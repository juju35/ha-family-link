"""School mode: every app of a child blocked but the essential ones, turned on by hand or by the Pronote timetable.

- On: the apps that are neither essential (phone, messages, maps, the Home Assistant app, school apps…), nor
  allowed in the options, nor always allowed by the parent, nor already blocked, are blocked in one request. Their
  previous rule (none, or a daily limit) is saved, in Home Assistant's storage so a restart doesn't lose it.
- Off: the saved rules are put back, again in one request.
- Pronote: with a "today's timetable" sensor of the Pronote integration set for the child, the school mode is on
  from a little before the first lesson of the day to the end of the last one (canceled lessons don't count).
  Turned off by hand during that time, it stays off until the end of the school day; turned on by hand, it is
  left to the parent (Pronote doesn't turn it off).
- Apps installed while the school mode is on are blocked at the next update.
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import asdict, dataclass, field
from datetime import datetime, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event, async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .api import FamilyLinkError
from .const import (
    CONF_PRONOTE,
    CONF_SCHOOL_APPS,
    DOMAIN,
    EVENT_ACTION,
    PRONOTE_MARGIN_MINUTES,
    SCHOOL_ESSENTIAL_APPS,
)

if TYPE_CHECKING:
    from .coordinator import FamilyLinkCoordinator

_LOGGER = logging.getLogger(__name__)

STORAGE_VERSION = 1
SOURCE_MANUAL = "manual"
SOURCE_PRONOTE = "pronote"
CHECK_INTERVAL = timedelta(minutes=1)


@dataclass
class SchoolState:
    active: bool = False
    source: str | None = None  # manual or pronote
    until: str | None = None  # end of the Pronote school day (ISO), while Pronote holds it on
    paused_until: str | None = None  # turned off by hand during the school day: Pronote waits until then
    saved: dict[str, list[Any]] = field(default_factory=dict)  # package -> [mode, minutes] to put back


def school_window(hass: HomeAssistant, entity_id: str, now: datetime) -> tuple[datetime, datetime] | None:
    """The school day from a Pronote timetable sensor: before the first lesson of today to the end of the last."""
    state = hass.states.get(entity_id)
    lessons = state.attributes.get("lessons") if state else None
    if not isinstance(lessons, list):
        return None
    today = dt_util.as_local(now).date()
    starts: list[datetime] = []
    ends: list[datetime] = []
    for lesson in lessons:
        if not isinstance(lesson, dict) or lesson.get("canceled") is True:
            continue
        start, end = _local(lesson.get("start_at")), _local(lesson.get("end_at"))
        if start is None or end is None or start.date() != today or end <= start:
            continue
        starts.append(start)
        ends.append(end)
    if not starts:
        return None
    return min(starts) - timedelta(minutes=PRONOTE_MARGIN_MINUTES), max(ends)


def _local(value: Any) -> datetime | None:
    parsed = dt_util.parse_datetime(str(value)) if value else None
    if parsed is None:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt_util.get_default_time_zone())
    return dt_util.as_local(parsed)


def _when(value: str | None) -> datetime | None:
    return dt_util.parse_datetime(value) if value else None


class SchoolMode:
    """School mode of every child of one Family Link account."""

    def __init__(self, hass: HomeAssistant, coordinator: FamilyLinkCoordinator) -> None:
        self.hass = hass
        self.coordinator = coordinator
        entry = coordinator.config_entry
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, f"{DOMAIN}.school_mode.{entry.entry_id}")
        self.states: dict[str, SchoolState] = {}
        self.pronote: dict[str, str] = dict(entry.options.get(CONF_PRONOTE, {}))
        self.extra_apps: set[str] = set(entry.options.get(CONF_SCHOOL_APPS, []))
        self._lock = asyncio.Lock()
        self._unsubs: list[CALLBACK_TYPE] = []

    # ── Lifecycle ───────────────────────────────────────────────────────────

    async def async_load(self) -> None:
        stored = await self._store.async_load() or {}
        for child_id, raw in stored.items():
            if isinstance(raw, dict):
                known = {key: raw[key] for key in SchoolState.__dataclass_fields__ if key in raw}
                self.states[child_id] = SchoolState(**known)

    @callback
    def async_start(self) -> None:
        self._unsubs.append(self.coordinator.async_add_listener(self._on_update))
        if self.pronote:
            self._unsubs.append(async_track_time_interval(self.hass, self._tick, CHECK_INTERVAL))
            self._unsubs.append(
                async_track_state_change_event(self.hass, list(self.pronote.values()), self._on_timetable)
            )
            self.hass.async_create_task(self.async_check_pronote())

    @callback
    def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()

    # ── State ───────────────────────────────────────────────────────────────

    def state(self, child_id: str) -> SchoolState:
        return self.states.setdefault(child_id, SchoolState())

    def allowed(self, child_id: str) -> set[str]:
        """Packages the school mode leaves reachable."""
        apps = self._apps(child_id)
        always = {package for package, app in apps.items() if app.always_allowed}
        return set(SCHOOL_ESSENTIAL_APPS) | self.extra_apps | always

    def _apps(self, child_id: str) -> dict[str, Any]:
        child = self.coordinator.data.children.get(child_id)
        return child.usage.apps if child and child.usage else {}

    async def _save(self) -> None:
        await self._store.async_save({child_id: asdict(state) for child_id, state in self.states.items()})

    # ── On / off ────────────────────────────────────────────────────────────

    async def async_enable(self, child_id: str, source: str = SOURCE_MANUAL, until: datetime | None = None) -> None:
        async with self._lock:
            state = self.state(child_id)
            await self._block_new(child_id, state)
            state.active = True
            state.source = source
            state.until = until.isoformat() if until else None
            if source == SOURCE_MANUAL:
                state.paused_until = None
            await self._save()
        self._fire(child_id, "school_mode_on", source)
        self.coordinator.async_update_listeners()

    async def async_disable(self, child_id: str, source: str = SOURCE_MANUAL) -> None:
        async with self._lock:
            state = self.state(child_id)
            if state.saved:
                rules = [(package, mode, minutes) for package, (mode, minutes) in state.saved.items()]
                await self.coordinator.client.set_apps(child_id, rules)
                apps = self._apps(child_id)
                for package, (mode, minutes) in state.saved.items():
                    if app := apps.get(package):
                        app.blocked = False
                        app.limit_minutes = minutes if mode == "limit" else None
            if source == SOURCE_MANUAL and state.source == SOURCE_PRONOTE and state.until:
                state.paused_until = state.until  # Pronote waits for the end of this school day
            state.active, state.source, state.until, state.saved = False, None, None, {}
            await self._save()
        self._fire(child_id, "school_mode_off", source)
        self.coordinator.async_update_listeners()
        await self.coordinator.async_request_refresh()

    async def _block_new(self, child_id: str, state: SchoolState) -> None:
        """Block the apps not blocked yet (the lock is held), saving their rule."""
        allowed = self.allowed(child_id)
        todo = {
            package: app
            for package, app in self._apps(child_id).items()
            if package not in allowed and not app.blocked and package not in state.saved
        }
        if not todo:
            return
        await self.coordinator.client.set_apps(child_id, [(package, "block", None) for package in todo])
        for package, app in todo.items():
            limited = app.limit_minutes is not None
            state.saved[package] = ["limit" if limited else "default", app.limit_minutes]
            app.blocked = True

    @callback
    def _on_update(self) -> None:
        """New apps while the school mode is on: blocked too."""
        for child_id, state in self.states.items():
            if not state.active or self._lock.locked():
                continue
            allowed = self.allowed(child_id)
            if any(
                p not in allowed and not a.blocked and p not in state.saved for p, a in self._apps(child_id).items()
            ):
                self.hass.async_create_task(self._block_new_safe(child_id))

    async def _block_new_safe(self, child_id: str) -> None:
        async with self._lock:
            state = self.state(child_id)
            if not state.active:
                return
            try:
                await self._block_new(child_id, state)
            except FamilyLinkError as err:
                _LOGGER.debug("School mode: new apps of %s not blocked yet (%s)", child_id, err)
                return
            await self._save()
        self.coordinator.async_update_listeners()

    # ── Pronote ─────────────────────────────────────────────────────────────

    async def _tick(self, _now: datetime) -> None:
        await self.async_check_pronote()

    @callback
    def _on_timetable(self, _event: Event) -> None:
        self.hass.async_create_task(self.async_check_pronote())

    async def async_check_pronote(self, now: datetime | None = None) -> None:
        """Turn the school mode on or off by the Pronote school day of each child."""
        now = now or dt_util.now()
        for child_id, entity_id in self.pronote.items():
            if child_id not in self.coordinator.data.children:
                continue
            state = self.state(child_id)
            window = school_window(self.hass, entity_id, now)
            paused = _when(state.paused_until)
            if paused and now >= paused:
                state.paused_until = None
                paused = None
            inside = window is not None and window[0] <= now < window[1]
            try:
                if inside and not state.active and paused is None:
                    await self.async_enable(child_id, SOURCE_PRONOTE, window[1])
                elif state.active and state.source == SOURCE_PRONOTE and not inside:
                    await self.async_disable(child_id, SOURCE_PRONOTE)
                elif (
                    inside and state.active and state.source == SOURCE_PRONOTE and state.until != window[1].isoformat()
                ):
                    state.until = window[1].isoformat()  # the timetable changed (a last lesson canceled…)
                    await self._save()
                    self.coordinator.async_update_listeners()
            except FamilyLinkError as err:
                _LOGGER.warning("School mode of %s could not follow Pronote: %s", child_id, err)

    # ── Card and events ─────────────────────────────────────────────────────

    def payload(self, child_id: str) -> dict[str, Any]:
        state = self.state(child_id)
        return {
            "active": state.active,
            "source": state.source,
            "until": state.until,
            "blocked": len(state.saved),
            "pronote": self.pronote.get(child_id),
        }

    def _fire(self, child_id: str, action: str, source: str) -> None:
        child = self.coordinator.data.children.get(child_id)
        self.hass.bus.async_fire(
            EVENT_ACTION,
            {
                "action": action,
                "child": child_id,
                "child_name": child.member.name if child else None,
                "device": None,
                "source": source,
            },
        )

"""Update coordinator: one per parent account, every supervised child in one update.

- Each child's sections (usage, limits, location) are fetched in parallel; a section that fails keeps its last
  value (cached data), flagged stale, so a Google hiccup never blanks the dashboard. Entities only go unavailable
  when nothing was fetched successfully for longer than the "stale after" option.
- The Google session refreshes itself: the client signs every request again, takes the cookies Google rotates in
  its answers and calls RotateCookies at start, then as often as Google asks (10 min); refreshed cookies are saved
  in the config entry (debounced).
- A session Google refuses twice in a row (after a rotation each time) starts the re-authentication flow and
  shows a persistent notification, dismissed by the next successful update.
- Actions update the state optimistically, then refresh once Google has applied them.
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.components import persistent_notification
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.event import async_call_later
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .api import AuthError, FamilyLinkClient, FamilyLinkError, TransientError
from .auth import GoogleCookies
from .const import (
    CONF_COOKIES,
    CONF_LOCATION_INTERVAL,
    CONF_SCAN_INTERVAL,
    CONF_STALE_AFTER,
    DEFAULT_LOCATION_INTERVAL,
    DEFAULT_SCAN_INTERVAL,
    DEFAULT_STALE_AFTER,
    DEVICE_OFFLINE_SECONDS,
    DOMAIN,
    LIMIT_SOON_MINUTES,
    LOCATION_OLD_SECONDS,
    MEMBERS_INTERVAL,
    REAUTH_NOTIFICATION_ID,
    STATUS_ATTENTION,
    STATUS_LOCKED,
    STATUS_NOT_TRACKED,
    STATUS_SEVERITY,
    STATUS_TRACKED,
)
from .models import AppsUsage, DeviceLimits, Location, Member, Schedule

if TYPE_CHECKING:
    from .school_mode import SchoolMode

_LOGGER = logging.getLogger(__name__)

AUTH_FAILURES_BEFORE_REAUTH = 2
OPTIONAL_SECTIONS = frozenset({"schedule", "contacts"})  # settings: their failure doesn't make the data stale
CONTACTS_INTERVAL = timedelta(minutes=15)  # who can call and text changes rarely
SAVE_COOKIES_DELAY = 10  # seconds: several rotated cookies in a row are saved once
CONFIRM_DELAY = 6  # seconds Google takes to apply an action before the confirming refresh

type FamilyLinkConfigEntry = ConfigEntry[FamilyLinkCoordinator]


@dataclass
class ChildData:
    member: Member
    usage: AppsUsage | None = None
    limits: dict[str, DeviceLimits] = field(default_factory=dict)
    location: Location | None = None
    schedule: Schedule | None = None  # weekly bedtime / school time / quotas (timeLimit)
    contacts: int | None = None  # who can call and text: CONTACT_LEVELS value
    # Last successful fetch of each section, and the error of its last attempt (None when it succeeded)
    fetched: dict[str, datetime] = field(default_factory=dict)
    errors: dict[str, str] = field(default_factory=dict)

    @property
    def stale(self) -> bool:
        """Screen time, limits or location could not be refreshed (the settings sections don't count)."""
        return any(name not in OPTIONAL_SECTIONS for name in self.errors)


@dataclass
class FamilyLinkData:
    children: dict[str, ChildData] = field(default_factory=dict)
    members_fetched: datetime | None = None


class FamilyLinkCoordinator(DataUpdateCoordinator[FamilyLinkData]):
    """Fetches every supervised child of the parent account."""

    config_entry: FamilyLinkConfigEntry

    def __init__(self, hass: HomeAssistant, entry: FamilyLinkConfigEntry, client: FamilyLinkClient) -> None:
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=DOMAIN,
            update_interval=timedelta(seconds=int(entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL))),
        )
        self.client = client
        client.set_cookie_listener(self.cookies_changed)
        self.options_snapshot = dict(entry.options)
        self.child_device_ids: dict[str, str] = {}  # child user id -> device registry id
        self.school: SchoolMode | None = None  # set by the setup (school_mode.py)
        self.location_interval = timedelta(
            seconds=int(entry.options.get(CONF_LOCATION_INTERVAL, DEFAULT_LOCATION_INTERVAL))
        )
        self.stale_after = timedelta(seconds=int(entry.options.get(CONF_STALE_AFTER, DEFAULT_STALE_AFTER)))
        self._auth_failures = 0
        # Counted from the start, so a setup that never gets any data still goes unavailable after "stale after"
        self._last_full_success: datetime = dt_util.now()
        self._save_cookies_unsub: CALLBACK_TYPE | None = None
        self._confirm_unsub: CALLBACK_TYPE | None = None
        self._rotate_unsub: CALLBACK_TYPE | None = None
        self._stopped = False
        self.data = FamilyLinkData()

    # ── Lifecycle ───────────────────────────────────────────────────────────

    @callback
    def async_start_background(self) -> None:
        """Rotate the session cookies on a schedule, as a browser left open does.

        Once right away (the stored cookies may be hours old after a restart), then every time Google asks for in its
        answer (identity.hfcr, 10 min today): a session not rotated within that window stops being renewed (#19).
        """
        self._stopped = False
        self._schedule_rotation(0)

    @callback
    def _schedule_rotation(self, delay: float) -> None:
        if self._rotate_unsub:
            self._rotate_unsub()

        async def rotate(_now: datetime) -> None:
            self._rotate_unsub = None
            try:
                await self.client.rotate_cookies()
            finally:
                if not self._stopped:
                    self._schedule_rotation(self.client.rotation_interval)

        self._rotate_unsub = async_call_later(self.hass, delay, rotate)

    @callback
    def async_stop_background(self) -> None:
        self._stopped = True
        for unsub in (self._rotate_unsub, self._save_cookies_unsub, self._confirm_unsub):
            if unsub:
                unsub()
        self._rotate_unsub = self._save_cookies_unsub = self._confirm_unsub = None

    @callback
    def cookies_changed(self, cookies: GoogleCookies) -> None:
        """Save the rotated cookies, once for a burst of changes."""
        if self._save_cookies_unsub:
            return

        @callback
        def save(_now: datetime) -> None:
            self._save_cookies_unsub = None
            entry = self.config_entry
            if entry.data.get(CONF_COOKIES) != cookies.to_storage():
                self.hass.config_entries.async_update_entry(
                    entry, data={**entry.data, CONF_COOKIES: cookies.to_storage()}
                )

        self._save_cookies_unsub = async_call_later(self.hass, SAVE_COOKIES_DELAY, save)

    # ── Update ──────────────────────────────────────────────────────────────

    async def _async_update_data(self) -> FamilyLinkData:
        data = self.data or FamilyLinkData()
        now = dt_util.now()
        try:
            if data.members_fetched is None or now - data.members_fetched > timedelta(seconds=MEMBERS_INTERVAL):
                try:
                    members = await self.client.get_members()
                except TransientError:
                    if not data.children:
                        raise
                else:
                    self._apply_members(data, members, now)
            results = await asyncio.gather(
                *(self._update_child(child, now) for child in data.children.values()), return_exceptions=True
            )
        except AuthError as err:
            return self._auth_failed(data, err)
        except TransientError as err:
            return self._keep_cached(data, err, now)
        auth_errors = [r for r in results if isinstance(r, AuthError)]
        if auth_errors:
            return self._auth_failed(data, auth_errors[0])
        for result in results:
            if isinstance(result, BaseException) and not isinstance(result, FamilyLinkError):
                raise result
        self._auth_failures = 0
        self._dismiss_reauth_notification()
        if any(not child.stale for child in data.children.values()) or not data.children:
            self._last_full_success = now
        elif now - self._last_full_success > self.stale_after:
            raise UpdateFailed(next(iter(next(iter(data.children.values())).errors.values()), "no data"))
        return data

    def _apply_members(self, data: FamilyLinkData, members: list[Member], now: datetime) -> None:
        supervised = {m.user_id: m for m in members if m.supervised}
        for child_id in list(data.children):
            if child_id not in supervised:
                del data.children[child_id]
        for child_id, member in supervised.items():
            if child_id in data.children:
                data.children[child_id].member = member
            else:
                data.children[child_id] = ChildData(member=member)
        data.members_fetched = now

    async def _update_child(self, child: ChildData, now: datetime) -> None:
        child_id = child.member.user_id
        sections: dict[str, Any] = {
            "usage": self.client.get_apps_usage(child_id, now.date()),
            "limits": self.client.get_applied_limits(child_id, now),
        }
        sections["schedule"] = self.client.get_time_limit(child_id, now.date())
        last_contacts = child.fetched.get("contacts")
        if last_contacts is None or now - last_contacts >= CONTACTS_INTERVAL:
            sections["contacts"] = self.client.get_contacts_level(child_id)
        last_location = child.fetched.get("location")
        if last_location is None or now - last_location >= self.location_interval - timedelta(seconds=5):
            sections["location"] = self.client.get_location(child_id)
        values = await asyncio.gather(*sections.values(), return_exceptions=True)
        child.errors.pop("all", None)
        child.errors.pop("auth", None)
        for name, value in zip(sections, values, strict=True):
            if isinstance(value, AuthError):
                raise value
            if isinstance(value, FamilyLinkError):
                # Cached data: the last good value stays, flagged stale
                child.errors[name] = str(value)
                _LOGGER.debug("%s of %s: kept the cached data (%s)", name, child.member.name, value)
                continue
            if isinstance(value, BaseException):
                raise value
            if name == "location" and value is None and child.location is not None:
                pass  # no new fix: keep the last one
            else:
                setattr(child, name, value)
            child.fetched[name] = now
            child.errors.pop(name, None)

    def _keep_cached(self, data: FamilyLinkData, err: Exception, now: datetime) -> FamilyLinkData:
        if not data.children:
            raise UpdateFailed(str(err)) from err
        if now - self._last_full_success > self.stale_after:
            raise UpdateFailed(str(err)) from err
        for child in data.children.values():
            child.errors["all"] = str(err)
        _LOGGER.debug("Family Link unreachable, cached data kept: %s", err)
        return data

    def _auth_failed(self, data: FamilyLinkData, err: Exception) -> FamilyLinkData:
        self._auth_failures += 1
        bound = isinstance(err, AuthError) and err.rotation_refused
        if self._auth_failures < AUTH_FAILURES_BEFORE_REAUTH and data.children:
            _LOGGER.debug("Google refused the session (%s), trying again at the next update", err)
            for child in data.children.values():
                child.errors["auth"] = str(err)
            return data
        if bound:
            _LOGGER.warning(
                "Google refused both the session and its cookie rotation: the session is bound to the browser it was "
                "created in (Chrome or Edge on Windows). Export the cookies from a Firefox private window instead, "
                "then close that window without signing out — see the README"
            )
        self._create_reauth_notification(bound)
        raise ConfigEntryAuthFailed(str(err)) from err

    # ── Re-authentication notification ──────────────────────────────────────

    def _create_reauth_notification(self, bound: bool = False) -> None:
        message = (
            "Google no longer accepts the Family Link session. Open **Settings → Devices & services → "
            "Family Link** and select **Reconfigure** to paste fresh cookies from familylink.google.com. "
            "Cached data stays on the dashboards meanwhile."
        )
        if bound:
            message += (
                "\n\nGoogle also refused to renew the cookies: the session is bound to the browser it was created in "
                "(Chrome or Edge on Windows), so exported cookies stop working within minutes. Sign in from a "
                "**Firefox private window**, export the cookies there, then close the window without signing out."
            )
        persistent_notification.async_create(
            self.hass,
            message,
            title="Family Link: sign in again",
            notification_id=REAUTH_NOTIFICATION_ID.format(entry_id=self.config_entry.entry_id),
        )

    def _dismiss_reauth_notification(self) -> None:
        persistent_notification.async_dismiss(
            self.hass, REAUTH_NOTIFICATION_ID.format(entry_id=self.config_entry.entry_id)
        )

    # ── Actions ─────────────────────────────────────────────────────────────

    @callback
    def apply_optimistic(self, child_id: str, device_id: str | None, **changes: Any) -> None:
        """Show an action's result at once; the confirming refresh follows a few seconds later."""
        child = self.data.children.get(child_id)
        if child and device_id:
            limits = child.limits.setdefault(device_id, DeviceLimits(device_id=device_id))
            for key, value in changes.items():
                setattr(limits, key, value)
        self.show_change()

    @callback
    def show_change(self) -> None:
        """Entities show the data as changed by an action; Family Link's answer is read a few seconds later."""
        self.async_update_listeners()
        if self._confirm_unsub:
            self._confirm_unsub()

        @callback
        def confirm(_now: datetime) -> None:
            self._confirm_unsub = None
            self.hass.async_create_task(self.async_request_refresh())

        self._confirm_unsub = async_call_later(self.hass, CONFIRM_DELAY, confirm)

    async def async_refresh_location(self, child_id: str) -> Location | None:
        location = await self.client.get_location(child_id, refresh=True)
        child = self.data.children.get(child_id)
        if child and location:
            child.location = location
            child.fetched["location"] = dt_util.now()
            child.errors.pop("location", None)
            self.async_update_listeners()
        return location

    # ── Derived state ───────────────────────────────────────────────────────

    def device_status(self, child: ChildData, device_id: str, now: datetime | None = None) -> str:
        now = now or dt_util.utcnow()
        device = child.usage.devices.get(device_id) if child.usage else None
        if device and device.last_activity and (now - device.last_activity).total_seconds() > DEVICE_OFFLINE_SECONDS:
            return STATUS_NOT_TRACKED
        limits = child.limits.get(device_id)
        if limits and limits.restricted_now:
            return STATUS_LOCKED
        if limits and limits.remaining_minutes is not None and limits.remaining_minutes <= LIMIT_SOON_MINUTES:
            return STATUS_ATTENTION
        return STATUS_TRACKED

    def child_status(self, child: ChildData, now: datetime | None = None) -> str:
        now = now or dt_util.utcnow()
        if "auth" in child.errors or child.usage is None:
            return STATUS_NOT_TRACKED
        statuses = [self.device_status(child, device_id, now) for device_id in child.usage.devices]
        if not statuses:
            return STATUS_NOT_TRACKED
        if all(s == STATUS_NOT_TRACKED for s in statuses):
            return STATUS_NOT_TRACKED
        worst = max((s for s in statuses if s != STATUS_NOT_TRACKED), key=STATUS_SEVERITY.__getitem__)
        location = child.location
        if (
            worst == STATUS_TRACKED
            and location
            and location.timestamp
            and (now - location.timestamp).total_seconds() > LOCATION_OLD_SECONDS
        ):
            return STATUS_ATTENTION
        return worst

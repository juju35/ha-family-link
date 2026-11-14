"""Weekly schedule changes: bedtime and school time switches and hours, daily quotas, for today or every week.

As in the Family Link app, turning bedtime or school time on or off changes the weekly switch and today too
(the weekly switch alone leaves a window already going on as it is); "today only" changes today alone.
Every change is shown at once, then Family Link's answer at the next update.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.exceptions import ServiceValidationError
from homeassistant.util import dt as dt_util

from .const import DOMAIN, weekday_name
from .entity import guard_action
from .models import Schedule

if TYPE_CHECKING:
    from .coordinator import ChildData, FamilyLinkCoordinator

BEDTIME = "bedtime"
SCHOOL_TIME = "school_time"
KINDS = (BEDTIME, SCHOOL_TIME)
WEEKDAYS = ("mon", "tue", "wed", "thu", "fri", "sat", "sun")  # 1 … 7


def _error(key: str, **placeholders: str) -> ServiceValidationError:
    return ServiceValidationError(translation_domain=DOMAIN, translation_key=key, translation_placeholders=placeholders)


def schedule_of(child: ChildData) -> Schedule:
    if child.schedule is None:
        raise _error("no_schedule", child=child.member.name)
    return child.schedule


async def _done(coordinator: FamilyLinkCoordinator) -> None:
    coordinator.show_change()


async def set_switch(coordinator: FamilyLinkCoordinator, child: ChildData, kind: str, on: bool) -> None:
    """Bedtime or school time on / off, every week and today."""
    schedule = schedule_of(child)
    policy = schedule.bedtime_policy if kind == BEDTIME else schedule.school_policy
    await guard_action(coordinator.client.set_policy(child.member.user_id, policy, on), kind)
    if kind == BEDTIME:
        schedule.bedtime_on = on
    else:
        schedule.school_on = on
    slots = (schedule.bedtime if kind == BEDTIME else schedule.school).get(dt_util.now().isoweekday())
    if slots:  # nothing scheduled today: nothing to change today
        await set_today(coordinator, child, kind, on, refresh=False)
    await _done(coordinator)


async def set_today(
    coordinator: FamilyLinkCoordinator,
    child: ChildData,
    kind: str,
    on: bool,
    start: tuple[int, int] | None = None,
    end: tuple[int, int] | None = None,
    *,
    refresh: bool = True,
) -> None:
    """Bedtime or school time on / off for today only, with today's hours unless others are given."""
    schedule = schedule_of(child)
    now = dt_util.now()
    weekday = now.isoweekday()
    slots = (schedule.bedtime if kind == BEDTIME else schedule.school).get(weekday, [])
    if start is None or end is None:
        if slots:
            start, end = start or slots[0].start, end or slots[-1].end
        elif kind == SCHOOL_TIME:
            start, end = start or (now.hour, now.minute), end or (23, 59)  # as the app: from now to midnight
        else:
            raise _error("no_window_today", child=child.member.name)
    client, child_id = coordinator.client, child.member.user_id
    if kind == BEDTIME:
        action = client.bedtime_today(child_id, on, start, end, schedule.bedtime_code(weekday))
        await guard_action(action, kind)
        schedule.bedtime_today = on
    else:
        action = client.school_time_today(child_id, on, start, end, weekday, schedule.school_policy)
        await guard_action(action, kind)
        schedule.school_today = on
    if refresh:
        await _done(coordinator)


async def set_hours(
    coordinator: FamilyLinkCoordinator,
    child: ChildData,
    kind: str,
    days: list[int],
    start: tuple[int, int] | None,
    end: tuple[int, int] | None,
    enable: bool | None = None,
) -> None:
    """Weekly hours of bedtime or school time on some weekdays, and / or turn those days on or off."""
    schedule = schedule_of(child)
    table = schedule.bedtime if kind == BEDTIME else schedule.school
    targets = []
    language = coordinator.hass.config.language
    for day in days:
        slots = table.get(day, [])
        if not slots:
            raise _error("no_slot", day=weekday_name(language, day))
        if len(slots) > 1 and (start or end):
            raise _error("two_slots", day=weekday_name(language, day))
        targets.append(slots)
    client, child_id = coordinator.client, child.member.user_id
    for slots in targets:
        slot = slots[0]
        if start or end:
            new_start, new_end = start or slot.start, end or slot.end
            await guard_action(client.set_slot_hours(child_id, slot.slot_id, new_start, new_end), kind)
            slot.start, slot.end = new_start, new_end
        if enable is not None:
            for each in slots:
                if each.enabled != enable:
                    await guard_action(client.set_slot_enabled(child_id, each.slot_id, enable), kind)
                    each.enabled = enable
    await _done(coordinator)


async def set_limit_enabled(coordinator: FamilyLinkCoordinator, child: ChildData, on: bool) -> None:
    schedule = schedule_of(child)
    await guard_action(coordinator.client.set_daily_limit_enabled(child.member.user_id, on), "daily_limit")
    schedule.limit_on = on
    await _done(coordinator)


async def set_quota(coordinator: FamilyLinkCoordinator, child: ChildData, days: list[int], minutes: int) -> None:
    """Weekly quota of some weekdays, every device of the child."""
    schedule = schedule_of(child)
    limit_on = schedule.limit_on is not False  # writing a day leaves the daily limit switch as it is
    for day in days:
        slot = schedule.quota_code(day)
        await guard_action(
            coordinator.client.set_weekly_quota(child.member.user_id, slot, minutes, limit_on), "daily_limit"
        )
        schedule.quotas[day] = (slot, minutes)
    await _done(coordinator)


async def set_today_quota(
    coordinator: FamilyLinkCoordinator, child: ChildData, device_ids: list[str], minutes: int
) -> None:
    """Today's quota of some devices."""
    schedule = schedule_of(child)
    code = schedule.quota_code(dt_util.now().isoweekday())
    for device_id in device_ids:
        await guard_action(
            coordinator.client.set_today_limit(child.member.user_id, device_id, minutes, code), "daily_limit"
        )
        coordinator.apply_optimistic(child.member.user_id, device_id, daily_limit_minutes=minutes)
    await _done(coordinator)


def parse_time(value: object) -> tuple[int, int] | None:
    """A time from an action or a time entity: "21:30", "21:30:00" or a time object."""
    if value is None:
        return None
    if hasattr(value, "hour"):
        return int(value.hour), int(value.minute)  # type: ignore[attr-defined]
    hour, _, rest = str(value).partition(":")
    return int(hour), int(rest.partition(":")[0] or 0)

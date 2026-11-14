"""Lock switch of each device (on = locked); school mode, bedtime, school time and daily limit of each child."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity

from .coordinator import FamilyLinkCoordinator
from .entity import ChildEntity, DeviceEntity, guard_action, platform_setup
from .schedule import BEDTIME, SCHOOL_TIME, set_limit_enabled, set_switch

async_setup_entry = platform_setup(
    lambda c, child: [
        SchoolModeSwitch(c, child),
        *(ScheduleSwitch(c, child, key) for key in (BEDTIME, SCHOOL_TIME, "daily_limit")),
    ],
    lambda c, child, device: [LockSwitch(c, child, device)],
)


class LockSwitch(DeviceEntity, SwitchEntity):
    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, device_id: str) -> None:
        super().__init__(coordinator, child_id, device_id, "lock")

    @property
    def is_on(self) -> bool | None:
        limits = self.limits
        return limits.locked if limits else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        limits = self.limits
        return {"restricted": limits.restricted_now} if limits else {}

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self._run(self.coordinator.client.lock(self.child_id, self.device_id), locked=True, override=7)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._run(self.coordinator.client.unlock(self.child_id, self.device_id), locked=False, override=4)

    async def _run(self, coro: Any, **changes: Any) -> None:
        await guard_action(coro, "lock")
        self.coordinator.apply_optimistic(self.child_id, self.device_id, **changes)


class SchoolModeSwitch(ChildEntity, SwitchEntity):
    """Every app blocked but the essential ones (see school_mode.py); Pronote can drive it."""

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str) -> None:
        super().__init__(coordinator, child_id, "school_mode")

    @property
    def is_on(self) -> bool | None:
        school = self.coordinator.school
        return school.state(self.child_id).active if school else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        school = self.coordinator.school
        return school.payload(self.child_id) if school else {}

    async def async_turn_on(self, **kwargs: Any) -> None:
        if school := self.coordinator.school:
            await guard_action(school.async_enable(self.child_id), "school_mode")

    async def async_turn_off(self, **kwargs: Any) -> None:
        if school := self.coordinator.school:
            await guard_action(school.async_disable(self.child_id), "school_mode")


class ScheduleSwitch(ChildEntity, SwitchEntity):
    """Bedtime, school time (every week, and today as in the app) or the daily limit of a child."""

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, key: str) -> None:
        super().__init__(coordinator, child_id, key)
        self.key = key

    @property
    def available(self) -> bool:
        return super().available and self.child.schedule is not None

    @property
    def is_on(self) -> bool | None:
        schedule = self.child.schedule
        if schedule is None:
            return None
        return {BEDTIME: schedule.bedtime_on, SCHOOL_TIME: schedule.school_on}.get(self.key, schedule.limit_on)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        schedule = self.child.schedule
        if schedule is None or self.key not in (BEDTIME, SCHOOL_TIME):
            return {}
        return {"today": schedule.bedtime_today if self.key == BEDTIME else schedule.school_today}

    async def _set(self, on: bool) -> None:
        if self.key == "daily_limit":
            await set_limit_enabled(self.coordinator, self.child, on)
        else:
            await set_switch(self.coordinator, self.child, self.key, on)

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self._set(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._set(False)

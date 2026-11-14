"""Weekly screen time quota of each weekday of a child (every device), in minutes."""

from __future__ import annotations

from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.const import EntityCategory, UnitOfTime

from .const import weekday_name
from .coordinator import FamilyLinkCoordinator
from .entity import ChildEntity, platform_setup
from .schedule import set_quota

async_setup_entry = platform_setup(lambda c, child: [WeeklyQuotaNumber(c, child, day) for day in range(1, 8)])


class WeeklyQuotaNumber(ChildEntity, NumberEntity):
    _attr_entity_category = EntityCategory.CONFIG
    _attr_native_min_value = 0
    _attr_native_max_value = 1440
    _attr_native_step = 5
    _attr_mode = NumberMode.BOX
    _attr_native_unit_of_measurement = UnitOfTime.MINUTES

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, day: int) -> None:
        super().__init__(coordinator, child_id, f"quota_{day}")
        self._attr_translation_key = "weekly_quota"
        self._attr_translation_placeholders = {"day": weekday_name(coordinator.hass.config.language, day)}
        self.day = day

    @property
    def available(self) -> bool:
        return super().available and self.child.schedule is not None and self.day in self.child.schedule.quotas

    @property
    def native_value(self) -> int | None:
        schedule = self.child.schedule
        quota = schedule.quotas.get(self.day) if schedule else None
        return quota[1] if quota else None

    async def async_set_native_value(self, value: float) -> None:
        await set_quota(self.coordinator, self.child, [self.day], int(value))

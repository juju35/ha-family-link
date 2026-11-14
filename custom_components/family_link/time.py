"""Weekly hours of bedtime and school time, start and end of each weekday of a child (disabled by default)."""

from __future__ import annotations

from datetime import time

from homeassistant.components.time import TimeEntity
from homeassistant.const import EntityCategory

from .const import weekday_name
from .coordinator import FamilyLinkCoordinator
from .entity import ChildEntity, platform_setup
from .models import Slot
from .schedule import BEDTIME, KINDS, set_hours

async_setup_entry = platform_setup(
    lambda c, child: [
        ScheduleTime(c, child, kind, edge, day) for kind in KINDS for edge in ("start", "end") for day in range(1, 8)
    ]
)


class ScheduleTime(ChildEntity, TimeEntity):
    _attr_entity_category = EntityCategory.CONFIG
    _attr_entity_registry_enabled_default = False  # 28 per child: enable the ones you use

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, kind: str, edge: str, day: int) -> None:
        super().__init__(coordinator, child_id, f"{kind}_{edge}_{day}")
        self._attr_translation_key = f"{kind}_{edge}"
        self._attr_translation_placeholders = {"day": weekday_name(coordinator.hass.config.language, day)}
        self.kind, self.edge, self.day = kind, edge, day

    def _slots(self) -> list[Slot]:
        schedule = self.child.schedule
        if schedule is None:
            return []
        return (schedule.bedtime if self.kind == BEDTIME else schedule.school).get(self.day, [])

    @property
    def available(self) -> bool:
        return super().available and bool(self._slots())

    @property
    def native_value(self) -> time | None:
        slots = self._slots()
        if not slots:
            return None
        hour, minute = slots[0].start if self.edge == "start" else slots[-1].end
        return time(hour, minute)

    async def async_set_value(self, value: time) -> None:
        hours = (value.hour, value.minute)
        start, end = (hours, None) if self.edge == "start" else (None, hours)
        await set_hours(self.coordinator, self.child, self.kind, [self.day], start, end)

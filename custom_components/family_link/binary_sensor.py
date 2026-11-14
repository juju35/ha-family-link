"""Binary sensors of each device: bedtime going on, school time going on, daily limit reached."""

from __future__ import annotations

from collections.abc import Callable

from homeassistant.components.binary_sensor import BinarySensorEntity

from .coordinator import FamilyLinkCoordinator
from .entity import DeviceEntity, platform_setup
from .models import DeviceLimits

CHECKS: dict[str, Callable[[DeviceLimits], bool]] = {
    "bedtime_active": lambda limits: bool(limits.bedtime and limits.bedtime.active),
    "schooltime_active": lambda limits: bool(limits.schooltime and limits.schooltime.active),
    "limit_reached": lambda limits: limits.limit_reached,
}

async_setup_entry = platform_setup(
    per_device=lambda c, child, device: [RestrictionBinarySensor(c, child, device, key) for key in CHECKS]
)


class RestrictionBinarySensor(DeviceEntity, BinarySensorEntity):
    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, device_id: str, key: str) -> None:
        super().__init__(coordinator, child_id, device_id, key)
        self._check = CHECKS[key]

    @property
    def is_on(self) -> bool | None:
        limits = self.limits
        return self._check(limits) if limits else None

"""Buttons: ring each device, add a 15, 30 or 60 minute bonus to it, refresh each child's location."""

from __future__ import annotations

from homeassistant.components.button import ButtonEntity

from .const import BONUS_PRESETS
from .coordinator import FamilyLinkCoordinator
from .entity import ChildEntity, DeviceEntity, add_bonus, guard_action, platform_setup

async_setup_entry = platform_setup(
    lambda c, child: [RefreshLocationButton(c, child)],
    lambda c, child, device: [
        RingButton(c, child, device),
        *(BonusButton(c, child, device, minutes) for minutes in BONUS_PRESETS),
    ],
)


class RingButton(DeviceEntity, ButtonEntity):
    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, device_id: str) -> None:
        super().__init__(coordinator, child_id, device_id, "ring")

    async def async_press(self) -> None:
        await guard_action(self.coordinator.client.ring(self.child_id, self.device_id), "ring")


class BonusButton(DeviceEntity, ButtonEntity):
    """Add a fixed bonus, for voice assistants and dashboards without the card."""

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, device_id: str, minutes: int) -> None:
        super().__init__(coordinator, child_id, device_id, f"bonus_{minutes}")
        self._attr_translation_key = "add_bonus"
        self._attr_translation_placeholders = {"minutes": str(minutes)}
        self.minutes = minutes

    async def async_press(self) -> None:
        await add_bonus(self.coordinator, self.child_id, self.device_id, self.minutes)


class RefreshLocationButton(ChildEntity, ButtonEntity):
    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str) -> None:
        super().__init__(coordinator, child_id, "refresh_location")

    async def async_press(self) -> None:
        await guard_action(self.coordinator.async_refresh_location(self.child_id), "location")

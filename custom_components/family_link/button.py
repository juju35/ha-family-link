"""Buttons: ring each device, refresh each child's location."""

from __future__ import annotations

from homeassistant.components.button import ButtonEntity

from .coordinator import FamilyLinkCoordinator
from .entity import ChildEntity, DeviceEntity, guard_action, platform_setup

async_setup_entry = platform_setup(
    lambda c, child: [RefreshLocationButton(c, child)],
    lambda c, child, device: [RingButton(c, child, device)],
)


class RingButton(DeviceEntity, ButtonEntity):
    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, device_id: str) -> None:
        super().__init__(coordinator, child_id, device_id, "ring")

    async def async_press(self) -> None:
        await guard_action(self.coordinator.client.ring(self.child_id, self.device_id), "ring")


class RefreshLocationButton(ChildEntity, ButtonEntity):
    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str) -> None:
        super().__init__(coordinator, child_id, "refresh_location")

    async def async_press(self) -> None:
        await guard_action(self.coordinator.async_refresh_location(self.child_id), "location")

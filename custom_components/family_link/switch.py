"""Lock switch of each supervised device: on = locked."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity

from .coordinator import FamilyLinkCoordinator
from .entity import DeviceEntity, guard_action, platform_setup

async_setup_entry = platform_setup(per_device=lambda c, child, device: [LockSwitch(c, child, device)])


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

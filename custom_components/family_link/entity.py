"""Base entities: one Home Assistant device per child, one per supervised phone or tablet (linked to the child)."""

from __future__ import annotations

from collections.abc import Awaitable, Callable, Iterable
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .api import FamilyLinkError
from .const import DOMAIN

try:
    from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
except ImportError:  # Home Assistant before 2025.3
    from homeassistant.helpers.entity_platform import AddEntitiesCallback as AddConfigEntryEntitiesCallback
from .coordinator import ChildData, FamilyLinkConfigEntry, FamilyLinkCoordinator
from .models import Device, DeviceLimits


class ChildEntity(CoordinatorEntity[FamilyLinkCoordinator]):
    """An entity of a supervised child."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, key: str) -> None:
        super().__init__(coordinator)
        self.child_id = child_id
        self._attr_translation_key = key
        self._attr_unique_id = f"{child_id}_{key}"
        member = self.child.member
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, child_id)},
            name=member.name,
            manufacturer="Google",
            model="Supervised account",
            entry_type=DeviceEntryType.SERVICE,
            configuration_url="https://familylink.google.com",
        )

    @property
    def child(self) -> ChildData:
        return self.coordinator.data.children[self.child_id]

    @property
    def available(self) -> bool:
        return super().available and self.child_id in self.coordinator.data.children


class DeviceEntity(ChildEntity):
    """An entity of one supervised phone or tablet of a child."""

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, device_id: str, key: str) -> None:
        super().__init__(coordinator, child_id, key)
        self.device_id = device_id
        self._attr_unique_id = f"{child_id}_{device_id}_{key}"
        device = self.device
        info = DeviceInfo(
            identifiers={(DOMAIN, device_id)},
            name=device.name if device else device_id[:8],
            configuration_url="https://familylink.google.com",
        )
        if device and device.model:
            info["model"] = device.model
        # Linked to the child's device: by registry id since 2026.10 (via_device is deprecated), else by identifier
        parent_id = coordinator.child_device_ids.get(child_id)
        if parent_id and "via_device_id" in DeviceInfo.__optional_keys__:
            info["via_device_id"] = parent_id  # type: ignore[typeddict-unknown-key]
        else:
            info["via_device"] = (DOMAIN, child_id)
        self._attr_device_info = info

    @property
    def device(self) -> Device | None:
        child = self.coordinator.data.children.get(self.child_id)
        usage = child.usage if child else None
        return usage.devices.get(self.device_id) if usage else None

    @property
    def limits(self) -> DeviceLimits | None:
        return self.child.limits.get(self.device_id)

    @property
    def available(self) -> bool:
        return super().available and self.device is not None


def platform_setup(
    per_child: Callable[[FamilyLinkCoordinator, str], Iterable[Entity]] | None = None,
    per_device: Callable[[FamilyLinkCoordinator, str, str], Iterable[Entity]] | None = None,
) -> Callable[[HomeAssistant, FamilyLinkConfigEntry, AddConfigEntryEntitiesCallback], Awaitable[None]]:
    """A platform's async_setup_entry: entities for every child and device, now and when new ones appear."""

    async def async_setup_entry(
        hass: HomeAssistant, entry: FamilyLinkConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback
    ) -> None:
        coordinator = entry.runtime_data
        known: set[str] = set()

        def add_new() -> None:
            entities: list[Entity] = []
            for child_id, child in coordinator.data.children.items():
                if per_child and child_id not in known:
                    known.add(child_id)
                    entities.extend(per_child(coordinator, child_id))
                for device_id in child.usage.devices if per_device and child.usage else {}:
                    if (key := f"{child_id}_{device_id}") not in known:
                        known.add(key)
                        entities.extend(per_device(coordinator, child_id, device_id))
            if entities:
                async_add_entities(entities)

        add_new()
        entry.async_on_unload(coordinator.async_add_listener(add_new))

    return async_setup_entry


async def guard_action(coro: Awaitable[Any], action: str) -> Any:
    """Run an action; a refusal of Family Link becomes an error shown in the UI."""
    try:
        return await coro
    except FamilyLinkError as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN,
            translation_key="action_failed",
            translation_placeholders={"action": action, "error": str(err)},
        ) from err

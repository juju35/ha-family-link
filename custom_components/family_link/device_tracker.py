"""Location of each child (last fix of one of their devices); Home Assistant records the route for the cards."""

from __future__ import annotations

from typing import Any

from homeassistant.components.device_tracker import SourceType, TrackerEntity

from .coordinator import FamilyLinkCoordinator
from .entity import ChildEntity, platform_setup

async_setup_entry = platform_setup(lambda c, child: [ChildTracker(c, child)])


class ChildTracker(ChildEntity, TrackerEntity):
    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str) -> None:
        super().__init__(coordinator, child_id, "location")
        # The tracker is the child's main entity: named after the child
        self._attr_name = None

    @property
    def source_type(self) -> SourceType:
        return SourceType.GPS

    @property
    def latitude(self) -> float | None:
        location = self.child.location
        return location.latitude if location else None

    @property
    def longitude(self) -> float | None:
        location = self.child.location
        return location.longitude if location else None

    @property
    def location_accuracy(self) -> float:
        location = self.child.location
        return float(location.accuracy or 0) if location else 0.0

    @property
    def battery_level(self) -> int | None:
        location = self.child.location
        return location.battery if location else None

    @property
    def entity_picture(self) -> str | None:
        return self.child.member.photo

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        location = self.child.location
        if not location:
            return {}
        return {
            "place": location.place_name,
            "address": location.place_address,
            "located_at": location.timestamp.isoformat() if location.timestamp else None,
        }

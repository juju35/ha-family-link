"""Sensors: status, screen time and battery of each child; screen time and time left of each device."""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.const import PERCENTAGE, EntityCategory, UnitOfTime
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from .card_data import child_payload
from .const import DOMAIN, STATUSES
from .coordinator import FamilyLinkCoordinator
from .entity import ChildEntity, DeviceEntity, platform_setup
from .models import App

APP_COUNTS: dict[str, Callable[[App], bool]] = {
    "blocked_apps": lambda app: app.blocked,
    "limited_apps": lambda app: not app.blocked and app.limit_minutes is not None,
    "always_allowed_apps": lambda app: app.always_allowed,
}

async_setup_entry = platform_setup(
    lambda c, child: [
        ChildStatusSensor(c, child),
        ChildScreenTimeSensor(c, child),
        ChildBatterySensor(c, child),
        *(AppCountSensor(c, child, key) for key in APP_COUNTS),
    ],
    lambda c, child, device: [
        DeviceScreenTimeSensor(c, child, device),
        DeviceRemainingSensor(c, child, device),
        DeviceDailyLimitSensor(c, child, device),
        DeviceBonusSensor(c, child, device),
        DeviceNextRestrictionSensor(c, child, device),
    ],
)


class ChildStatusSensor(ChildEntity, SensorEntity):
    """tracked / attention / locked / not_tracked — the source of the Family Link cards."""

    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = STATUSES
    _unrecorded_attributes = frozenset(
        {
            "family_link",
            "child_id",
            "child_name",
            "photo",
            "week",
            "top_apps",
            "devices",
            "location",
            "tracker",
            "notify_service",
            "errors",
            "updated",
            "blocked_apps",
            "school_mode",
            "total_minutes",
            "stale",
        }
    )

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str) -> None:
        super().__init__(coordinator, child_id, "status")

    @property
    def native_value(self) -> str:
        return self.coordinator.child_status(self.child)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        tracker = er.async_get(self.hass).async_get_entity_id("device_tracker", DOMAIN, f"{self.child_id}_location")
        return child_payload(self.coordinator, self.child, {"tracker": tracker})


class ChildScreenTimeSensor(ChildEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.DURATION
    _attr_state_class = SensorStateClass.TOTAL_INCREASING
    _attr_native_unit_of_measurement = UnitOfTime.MINUTES
    _attr_suggested_display_precision = 0

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str) -> None:
        super().__init__(coordinator, child_id, "screen_time")

    @property
    def native_value(self) -> float | None:
        usage = self.child.usage
        return round(sum(usage.today_by_app.values()) / 60, 1) if usage else None


class ChildBatterySensor(ChildEntity, SensorEntity):
    """Battery of the device that reported the last location."""

    _attr_device_class = SensorDeviceClass.BATTERY
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str) -> None:
        super().__init__(coordinator, child_id, "battery")

    @property
    def native_value(self) -> int | None:
        location = self.child.location
        return location.battery if location else None


class DeviceScreenTimeSensor(DeviceEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.DURATION
    _attr_state_class = SensorStateClass.TOTAL_INCREASING
    _attr_native_unit_of_measurement = UnitOfTime.MINUTES
    _attr_suggested_display_precision = 0

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, device_id: str) -> None:
        super().__init__(coordinator, child_id, device_id, "device_screen_time")

    @property
    def native_value(self) -> float | None:
        usage = self.child.usage
        by_app = usage.today_by_device.get(self.device_id) if usage else None
        if by_app:
            return round(sum(by_app.values()) / 60, 1)
        limits = self.limits
        return float(limits.used_minutes) if limits else 0.0


class DeviceRemainingSensor(DeviceEntity, SensorEntity):
    """Time left today (daily limit, or the running bonus); unknown when no limit applies."""

    _attr_device_class = SensorDeviceClass.DURATION
    _attr_native_unit_of_measurement = UnitOfTime.MINUTES

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, device_id: str) -> None:
        super().__init__(coordinator, child_id, device_id, "remaining_time")

    @property
    def native_value(self) -> int | None:
        limits = self.limits
        return limits.remaining_minutes if limits else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        limits = self.limits
        if not limits:
            return {}
        return {
            "daily_limit": limits.daily_limit_minutes if limits.daily_limit_enabled else None,
            "bonus": limits.bonus_minutes if limits.bonus_override_id else 0,
            "restricted": limits.restricted_now,
            "bedtime_active": bool(limits.bedtime and limits.bedtime.active),
            "schooltime_active": bool(limits.schooltime and limits.schooltime.active),
        }


class AppCountSensor(ChildEntity, SensorEntity):
    """Number of blocked, limited or always allowed apps, their titles in an attribute."""

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "apps"
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _unrecorded_attributes = frozenset({"apps"})

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, key: str) -> None:
        super().__init__(coordinator, child_id, key)
        self._match = APP_COUNTS[key]

    def _titles(self) -> list[str] | None:
        usage = self.child.usage
        return sorted(app.title for app in usage.apps.values() if self._match(app)) if usage else None

    @property
    def native_value(self) -> int | None:
        titles = self._titles()
        return len(titles) if titles is not None else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {"apps": self._titles() or []}


class DeviceDailyLimitSensor(DeviceEntity, SensorEntity):
    """Today's screen time quota of the device; unknown when no daily limit applies."""

    _attr_device_class = SensorDeviceClass.DURATION
    _attr_native_unit_of_measurement = UnitOfTime.MINUTES

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, device_id: str) -> None:
        super().__init__(coordinator, child_id, device_id, "daily_limit")

    @property
    def native_value(self) -> int | None:
        limits = self.limits
        return limits.daily_limit_minutes if limits and limits.daily_limit_enabled else None


class DeviceBonusSensor(DeviceEntity, SensorEntity):
    """Minutes of the bonus running on the device (0 without one)."""

    _attr_device_class = SensorDeviceClass.DURATION
    _attr_native_unit_of_measurement = UnitOfTime.MINUTES

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, device_id: str) -> None:
        super().__init__(coordinator, child_id, device_id, "bonus")

    @property
    def native_value(self) -> int | None:
        limits = self.limits
        if not limits:
            return None
        return limits.bonus_minutes if limits.bonus_override_id else 0


class DeviceNextRestrictionSensor(DeviceEntity, SensorEntity):
    """Start of the next bedtime or school time of the day, its kind in an attribute."""

    _attr_device_class = SensorDeviceClass.TIMESTAMP

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str, device_id: str) -> None:
        super().__init__(coordinator, child_id, device_id, "next_restriction")

    def _next(self) -> tuple[str, datetime] | None:
        limits = self.limits
        return limits.next_restriction(dt_util.utcnow()) if limits else None

    @property
    def native_value(self) -> datetime | None:
        upcoming = self._next()
        return upcoming[1] if upcoming else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        upcoming = self._next()
        return {"kind": upcoming[0] if upcoming else None}

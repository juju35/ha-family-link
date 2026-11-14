"""What the cards show for a child, in one attribute set of its status sensor (not recorded)."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.util import dt as dt_util

from .const import CONF_NOTIFY_SERVICES, LOCATION_FRESH_SECONDS
from .coordinator import ChildData, FamilyLinkCoordinator
from .models import App, DeviceLimits, Window

TOP_APPS = 8


def _iso(value: datetime | None) -> str | None:
    return value.isoformat() if value else None


def _window(window: Window | None) -> dict[str, Any] | None:
    if window is None:
        return None
    return {"start": _iso(window.start), "end": _iso(window.end), "active": window.active}


def _apps(seconds_by_app: dict[str, float], apps: dict[str, App], limit: int = TOP_APPS) -> list[dict[str, Any]]:
    result = []
    for package, seconds in sorted(seconds_by_app.items(), key=lambda item: item[1], reverse=True)[:limit]:
        if seconds < 30:
            continue
        app = apps.get(package)
        result.append(
            {
                "package": package,
                "title": app.title if app else package.rsplit(".", 1)[-1].title(),
                "minutes": round(seconds / 60),
                "icon": app.icon_url if app else None,
                "limit": app.limit_minutes if app else None,
                "blocked": app.blocked if app else False,
                "always_allowed": app.always_allowed if app else False,
            }
        )
    return result


def child_payload(
    coordinator: FamilyLinkCoordinator, child: ChildData, entity_ids: dict[str, str | None]
) -> dict[str, Any]:
    now = dt_util.utcnow()
    usage = child.usage
    apps = usage.apps if usage else {}
    devices = []
    for device_id, device in (usage.devices if usage else {}).items():
        limits = child.limits.get(device_id) or DeviceLimits(device_id=device_id)
        by_app = usage.today_by_device.get(device_id, {}) if usage else {}
        devices.append(
            {
                "id": device_id,
                "name": device.name,
                "model": device.model,
                "kind": device.kind,
                "status": coordinator.device_status(child, device_id, now),
                "locked": limits.locked,
                "restricted": limits.restricted_now,
                "used": round(sum(by_app.values()) / 60) if by_app else limits.used_minutes,
                "remaining": limits.remaining_minutes,
                "limit": limits.daily_limit_minutes if limits.daily_limit_enabled else None,
                "bonus": limits.bonus_minutes if limits.bonus_override_id else 0,
                "bonus_remaining": limits.bonus_remaining_minutes if limits.bonus_override_id else None,
                "bonus_id": limits.bonus_override_id,
                "bedtime": _window(limits.bedtime),
                "schooltime": _window(limits.schooltime),
                "last_activity": _iso(device.last_activity),
                "can_ring": not device.capabilities or "capabilityRing" in device.capabilities,
                "top_apps": _apps(by_app, apps, 5),
            }
        )
    location = child.location
    location_payload = None
    if location:
        age = (now - location.timestamp).total_seconds() if location.timestamp else None
        source = usage.devices.get(location.source_device_id) if usage and location.source_device_id else None
        location_payload = {
            "latitude": location.latitude,
            "longitude": location.longitude,
            "accuracy": location.accuracy,
            "place": location.place_name,
            "address": location.place_address,
            "time": _iso(location.timestamp),
            "fresh": age is not None and age <= LOCATION_FRESH_SECONDS,
            "battery": location.battery,
            "device": source.name if source else None,
        }
    notify = coordinator.config_entry.options.get(CONF_NOTIFY_SERVICES, {}).get(child.member.user_id)
    total_seconds = sum(usage.today_by_app.values()) if usage else 0
    return {
        "family_link": True,
        "child_id": child.member.user_id,
        "child_name": child.member.name,
        "photo": child.member.photo,
        "total_minutes": round(total_seconds / 60),
        "week": [{"date": day, "minutes": round(seconds / 60)} for day, seconds in usage.week] if usage else [],
        "top_apps": _apps(usage.today_by_app, apps) if usage else [],
        "blocked_apps": sum(1 for app in apps.values() if app.blocked),
        "devices": devices,
        "location": location_payload,
        "tracker": entity_ids.get("tracker"),
        "notify_service": notify,
        "stale": child.stale,
        "errors": sorted(child.errors),
        "updated": _iso(max(child.fetched.values()) if child.fetched else None),
    }

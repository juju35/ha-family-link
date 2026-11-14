"""Family Link actions: bonus, revoke, lock, unlock, ring, location, app rules, emergency, refresh."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import entity_registry as er

from .const import (
    APP_MODES,
    ATTR_APP,
    ATTR_CHILD,
    ATTR_DEVICE,
    ATTR_MESSAGE,
    ATTR_MINUTES,
    ATTR_MODE,
    ATTR_NOTIFY_SERVICE,
    ATTR_REFRESH_LOCATION,
    ATTR_RING,
    CONF_NOTIFY_SERVICES,
    DOMAIN,
    EVENT_ACTION,
    SERVICE_ADD_BONUS,
    SERVICE_EMERGENCY,
    SERVICE_LOCK,
    SERVICE_REFRESH,
    SERVICE_REFRESH_LOCATION,
    SERVICE_REVOKE_BONUS,
    SERVICE_RING,
    SERVICE_SET_APP,
    SERVICE_UNLOCK,
)
from .coordinator import ChildData, FamilyLinkCoordinator
from .entity import guard_action

_LOGGER = logging.getLogger(__name__)

CHILD = vol.Required(ATTR_CHILD)
DEVICE = vol.Optional(ATTR_DEVICE)

SCHEMAS = {
    SERVICE_ADD_BONUS: vol.Schema(
        {CHILD: cv.string, DEVICE: cv.string, vol.Required(ATTR_MINUTES): vol.All(vol.Coerce(int), vol.Range(1, 1440))}
    ),
    SERVICE_REVOKE_BONUS: vol.Schema({CHILD: cv.string, DEVICE: cv.string}),
    SERVICE_LOCK: vol.Schema({CHILD: cv.string, DEVICE: cv.string}),
    SERVICE_UNLOCK: vol.Schema({CHILD: cv.string, DEVICE: cv.string}),
    SERVICE_RING: vol.Schema({CHILD: cv.string, DEVICE: cv.string}),
    SERVICE_REFRESH_LOCATION: vol.Schema({CHILD: cv.string}),
    SERVICE_SET_APP: vol.Schema(
        {
            CHILD: cv.string,
            vol.Required(ATTR_APP): cv.string,
            vol.Required(ATTR_MODE): vol.In(APP_MODES),
            vol.Optional(ATTR_MINUTES): vol.All(vol.Coerce(int), vol.Range(0, 1440)),
        }
    ),
    SERVICE_EMERGENCY: vol.Schema(
        {
            CHILD: cv.string,
            DEVICE: cv.string,
            vol.Optional(ATTR_MESSAGE, default=""): cv.string,
            vol.Optional(ATTR_RING, default=True): cv.boolean,
            vol.Optional(ATTR_NOTIFY_SERVICE): cv.string,
            vol.Optional(ATTR_REFRESH_LOCATION, default=False): cv.boolean,
        }
    ),
    SERVICE_REFRESH: vol.Schema({vol.Optional(ATTR_CHILD): cv.string}),
}


def _coordinators(hass: HomeAssistant) -> list[FamilyLinkCoordinator]:
    return [
        entry.runtime_data
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.state is ConfigEntryState.LOADED and getattr(entry, "runtime_data", None)
    ]


def resolve_child(hass: HomeAssistant, value: str) -> tuple[FamilyLinkCoordinator, ChildData]:
    """A child by user id, name, or any of its entities."""
    wanted = value.strip()
    if wanted.count(".") == 1 and (entity := er.async_get(hass).async_get(wanted)) and entity.unique_id:
        wanted = entity.unique_id.split("_")[0]
    for coordinator in _coordinators(hass):
        for child in coordinator.data.children.values():
            member = child.member
            names = (member.name.casefold(), member.given_name.casefold())
            if wanted == member.user_id or wanted.casefold() in names:
                return coordinator, child
    raise ServiceValidationError(
        translation_domain=DOMAIN, translation_key="unknown_child", translation_placeholders={"child": value}
    )


def resolve_device(child: ChildData, value: str | None) -> str:
    """A device of the child by id or name; the only device when none is given."""
    devices = child.usage.devices if child.usage else {}
    if not value:
        if len(devices) == 1:
            return next(iter(devices))
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="device_required")
    if value in devices:
        return value
    for device_id, device in devices.items():
        if value.casefold() in (device.name.casefold(), device.model.casefold()):
            return device_id
    raise ServiceValidationError(
        translation_domain=DOMAIN, translation_key="unknown_device", translation_placeholders={"device": value}
    )


@callback
def async_setup_services(hass: HomeAssistant) -> None:
    async def add_bonus(call: ServiceCall) -> None:
        coordinator, child = resolve_child(hass, call.data[ATTR_CHILD])
        device_id = resolve_device(child, call.data.get(ATTR_DEVICE))
        minutes = call.data[ATTR_MINUTES]
        override_id = await guard_action(
            coordinator.client.add_bonus(child.member.user_id, device_id, minutes), "bonus"
        )
        coordinator.apply_optimistic(
            child.member.user_id,
            device_id,
            bonus_minutes=minutes,
            bonus_remaining_minutes=minutes,
            bonus_override_id=override_id or "pending",
            locked=False,
        )
        _fire(hass, "add_bonus", child, device_id, minutes=minutes)

    async def revoke_bonus(call: ServiceCall) -> None:
        coordinator, child = resolve_child(hass, call.data[ATTR_CHILD])
        device_id = resolve_device(child, call.data.get(ATTR_DEVICE))
        limits = child.limits.get(device_id)
        override_id = limits.bonus_override_id if limits else None
        if not override_id or override_id == "pending":
            await coordinator.async_refresh()
            limits = child.limits.get(device_id)
            override_id = limits.bonus_override_id if limits else None
        if not override_id or override_id == "pending":
            raise ServiceValidationError(translation_domain=DOMAIN, translation_key="no_bonus")
        await guard_action(coordinator.client.revoke_bonus(child.member.user_id, override_id), "revoke")
        coordinator.apply_optimistic(
            child.member.user_id, device_id, bonus_minutes=0, bonus_remaining_minutes=None, bonus_override_id=None
        )
        _fire(hass, "revoke_bonus", child, device_id)

    async def lock(call: ServiceCall) -> None:
        coordinator, child = resolve_child(hass, call.data[ATTR_CHILD])
        device_id = resolve_device(child, call.data.get(ATTR_DEVICE))
        await guard_action(coordinator.client.lock(child.member.user_id, device_id), "lock")
        coordinator.apply_optimistic(child.member.user_id, device_id, locked=True, override=7)
        _fire(hass, "lock", child, device_id)

    async def unlock(call: ServiceCall) -> None:
        coordinator, child = resolve_child(hass, call.data[ATTR_CHILD])
        device_id = resolve_device(child, call.data.get(ATTR_DEVICE))
        await guard_action(coordinator.client.unlock(child.member.user_id, device_id), "unlock")
        coordinator.apply_optimistic(child.member.user_id, device_id, locked=False, override=4)
        _fire(hass, "unlock", child, device_id)

    async def ring(call: ServiceCall) -> None:
        coordinator, child = resolve_child(hass, call.data[ATTR_CHILD])
        device_id = resolve_device(child, call.data.get(ATTR_DEVICE))
        await guard_action(coordinator.client.ring(child.member.user_id, device_id), "ring")
        _fire(hass, "ring", child, device_id)

    async def refresh_location(call: ServiceCall) -> ServiceResponse:
        coordinator, child = resolve_child(hass, call.data[ATTR_CHILD])
        location = await guard_action(coordinator.async_refresh_location(child.member.user_id), "location")
        if location is None:
            return {"located": False}
        return {
            "located": True,
            "latitude": location.latitude,
            "longitude": location.longitude,
            "accuracy": location.accuracy,
            "place": location.place_name,
        }

    async def set_app(call: ServiceCall) -> None:
        coordinator, child = resolve_child(hass, call.data[ATTR_CHILD])
        app = call.data[ATTR_APP]
        apps = child.usage.apps if child.usage else {}
        package = next((p for p, a in apps.items() if app == p or app.casefold() == a.title.casefold()), app)
        mode = call.data[ATTR_MODE]
        if mode == "limit" and ATTR_MINUTES not in call.data:
            raise ServiceValidationError(translation_domain=DOMAIN, translation_key="minutes_required")
        await guard_action(
            coordinator.client.set_app(child.member.user_id, package, mode, call.data.get(ATTR_MINUTES)), "app"
        )
        await coordinator.async_request_refresh()

    async def emergency(call: ServiceCall) -> None:
        coordinator, child = resolve_child(hass, call.data[ATTR_CHILD])
        device_id = resolve_device(child, call.data.get(ATTR_DEVICE)) if child.usage and child.usage.devices else None
        notify = call.data.get(ATTR_NOTIFY_SERVICE) or coordinator.config_entry.options.get(
            CONF_NOTIFY_SERVICES, {}
        ).get(child.member.user_id)
        message = call.data[ATTR_MESSAGE].strip()
        tasks = []
        if call.data[ATTR_RING] and device_id:
            tasks.append(guard_action(coordinator.client.ring(child.member.user_id, device_id), "ring"))
        if notify and message:
            tasks.append(_notify(hass, notify, message))
        if call.data[ATTR_REFRESH_LOCATION]:
            tasks.append(guard_action(coordinator.async_refresh_location(child.member.user_id), "location"))
        if not tasks:
            raise ServiceValidationError(translation_domain=DOMAIN, translation_key="emergency_nothing")
        results = await asyncio.gather(*tasks, return_exceptions=True)
        _fire(hass, "emergency", child, device_id, message=message)
        failures = [r for r in results if isinstance(r, Exception)]
        if failures:
            raise failures[0]

    async def refresh(call: ServiceCall) -> None:
        if ATTR_CHILD in call.data:
            coordinator, _child = resolve_child(hass, call.data[ATTR_CHILD])
            await coordinator.async_refresh()
            return
        for coordinator in _coordinators(hass):
            await coordinator.async_refresh()

    handlers = {
        SERVICE_ADD_BONUS: add_bonus,
        SERVICE_REVOKE_BONUS: revoke_bonus,
        SERVICE_LOCK: lock,
        SERVICE_UNLOCK: unlock,
        SERVICE_RING: ring,
        SERVICE_SET_APP: set_app,
        SERVICE_EMERGENCY: emergency,
        SERVICE_REFRESH: refresh,
    }
    for name, handler in handlers.items():
        hass.services.async_register(DOMAIN, name, handler, SCHEMAS[name])
    hass.services.async_register(
        DOMAIN,
        SERVICE_REFRESH_LOCATION,
        refresh_location,
        SCHEMAS[SERVICE_REFRESH_LOCATION],
        supports_response=SupportsResponse.OPTIONAL,
    )


async def _notify(hass: HomeAssistant, service: str, message: str) -> None:
    """Critical notification through the Home Assistant app on the child's phone (sound even on silent)."""
    domain, _, name = service.partition(".")
    if not name:
        domain, name = "notify", domain
    if not hass.services.has_service(domain, name):
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="unknown_notify", translation_placeholders={"service": service}
        )
    await hass.services.async_call(
        domain,
        name,
        {
            "title": "⚠️ Family Link",
            "message": message,
            "data": {
                "ttl": 0,
                "priority": "high",
                "channel": "alarm_stream",
                "importance": "high",
                "push": {"sound": {"name": "default", "critical": 1, "volume": 1.0}, "interruption-level": "critical"},
            },
        },
        blocking=True,
    )


def _fire(hass: HomeAssistant, action: str, child: ChildData, device_id: str | None, **extra: Any) -> None:
    hass.bus.async_fire(
        EVENT_ACTION,
        {
            "action": action,
            "child": child.member.user_id,
            "child_name": child.member.name,
            "device": device_id,
            **extra,
        },
    )

"""The Family Link integration: supervise your children's Android devices from Home Assistant."""

from __future__ import annotations

import hashlib
import logging
from datetime import datetime
from pathlib import Path
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED, Platform
from homeassistant.core import Event, HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed, ConfigEntryNotReady
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.storage import Store
from homeassistant.helpers.typing import ConfigType
from homeassistant.util import dt as dt_util

from .api import AuthError, FamilyLinkClient, create_session
from .auth import GoogleCookies
from .config_flow import OPTIONS_FLOW_RELOADS
from .const import CARD_FILENAME, CONF_COOKIES, CONF_SESSION, DOMAIN, FRONTEND_URL, REAUTH_NOTIFICATION_ID
from .coordinator import FamilyLinkConfigEntry, FamilyLinkCoordinator
from .school_mode import SchoolMode
from .services import async_setup_services

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.DEVICE_TRACKER,
    Platform.NUMBER,
    Platform.SELECT,
    Platform.SENSOR,
    Platform.SWITCH,
    Platform.TIME,
]
CARD_PATH = Path(__file__).parent / "frontend" / CARD_FILENAME
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
CHILD_MODEL = "Supervised account"  # the model of the child devices (their phones and tablets have theirs)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Serve the cards and register the actions once."""
    await hass.http.async_register_static_paths([StaticPathConfig(FRONTEND_URL, str(CARD_PATH.parent), True)])
    await _async_register_card(hass)
    async_setup_services(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: FamilyLinkConfigEntry) -> bool:
    cookies = GoogleCookies.from_storage(entry.data.get(CONF_COOKIES))
    if not cookies.can_sign:
        raise ConfigEntryAuthFailed("no Google session cookie saved")
    # Own session, closed with the entry: Google's cookies never land in Home Assistant's shared one
    session = entry.data.get(CONF_SESSION) or {}
    client = FamilyLinkClient(
        create_session(hass),
        cookies,
        session_started=_parse_time(session.get("started")),
        psidts_renewed=_parse_time(session.get("renewed")),
    )
    coordinator = FamilyLinkCoordinator(hass, entry, client)
    try:
        await coordinator.async_config_entry_first_refresh()
    except ConfigEntryAuthFailed:
        raise
    except AuthError as err:
        raise ConfigEntryAuthFailed(str(err)) from err
    if not coordinator.data.children:
        raise ConfigEntryNotReady("no supervised child found in the family")
    entry.runtime_data = coordinator

    # Children who left the family while Home Assistant was off: their devices go (the list just came from Google)
    _remove_gone_children(hass, entry, set(coordinator.data.children))

    def register_children() -> None:
        # The child devices exist before their phones and tablets, which are linked to them (via_device)
        registry = dr.async_get(hass)
        gone = [child_id for child_id in coordinator.child_device_ids if child_id not in coordinator.data.children]
        if gone:
            for child_id in gone:
                del coordinator.child_device_ids[child_id]
            _remove_gone_children(hass, entry, set(coordinator.data.children))
        for child_id, child in coordinator.data.children.items():
            if child_id in coordinator.child_device_ids:
                continue
            coordinator.child_device_ids[child_id] = registry.async_get_or_create(
                config_entry_id=entry.entry_id,
                identifiers={(DOMAIN, child_id)},
                name=child.member.name,
                manufacturer="Google",
                model=CHILD_MODEL,
                entry_type=dr.DeviceEntryType.SERVICE,
                configuration_url="https://familylink.google.com",
            ).id

    register_children()
    entry.async_on_unload(coordinator.async_add_listener(register_children))
    coordinator.async_start_background()
    entry.async_on_unload(coordinator.async_stop_background)
    coordinator.school = SchoolMode(hass, coordinator)
    await coordinator.school.async_load()
    coordinator.school.async_start()
    entry.async_on_unload(coordinator.school.async_stop)
    if not OPTIONS_FLOW_RELOADS:
        entry.async_on_unload(entry.add_update_listener(_async_reload_on_options))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    # Every entity now exists: write the states again so the status sensors name their tracker
    coordinator.async_update_listeners()
    return True


async def async_unload_entry(hass: HomeAssistant, entry: FamilyLinkConfigEntry) -> bool:
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def async_remove_config_entry_device(
    hass: HomeAssistant, entry: FamilyLinkConfigEntry, device_entry: dr.DeviceEntry
) -> bool:
    """A device can be deleted by hand once it is no longer a supervised child or one of their devices."""
    coordinator: FamilyLinkCoordinator | None = getattr(entry, "runtime_data", None)
    if coordinator is None:
        return True
    current = set(coordinator.data.children)
    for child in coordinator.data.children.values():
        current.update(child.usage.devices if child.usage else ())
    return not any(domain == DOMAIN and key in current for domain, key in device_entry.identifiers)


def _remove_gone_children(hass: HomeAssistant, entry: FamilyLinkConfigEntry, children: set[str]) -> None:
    """Detach the devices of children no longer supervised, with their phones and tablets (and their entities)."""
    registry = dr.async_get(hass)
    devices = dr.async_entries_for_config_entry(registry, entry.entry_id)
    gone = {
        device.id
        for device in devices
        if device.model == CHILD_MODEL
        and any(domain == DOMAIN for domain, _ in device.identifiers)
        and not any(domain == DOMAIN and key in children for domain, key in device.identifiers)
    }
    # Removed outright (their entities with them): these devices belong to this entry only
    for device in devices:
        if device.id in gone or device.via_device_id in gone:
            registry.async_remove_device(device.id)


async def async_remove_entry(hass: HomeAssistant, entry: FamilyLinkConfigEntry) -> None:
    persistent_notification.async_dismiss(hass, REAUTH_NOTIFICATION_ID.format(entry_id=entry.entry_id))
    await Store(hass, 1, f"{DOMAIN}.school_mode.{entry.entry_id}").async_remove()


async def _async_reload_on_options(hass: HomeAssistant, entry: FamilyLinkConfigEntry) -> None:
    """Reload when the options change; a cookie rotation (data only) needs no reload."""
    coordinator: FamilyLinkCoordinator | None = getattr(entry, "runtime_data", None)
    if coordinator is not None and coordinator.options_snapshot == dict(entry.options):
        return
    await hass.config_entries.async_reload(entry.entry_id)


async def _async_register_card(hass: HomeAssistant) -> None:
    """Add the cards to the dashboard resources, the URL versioned with the file hash so browsers fetch updates."""
    digest = await hass.async_add_executor_job(
        lambda: hashlib.md5(CARD_PATH.read_bytes(), usedforsecurity=False).hexdigest()[:8]
    )
    base_url = f"{FRONTEND_URL}/{CARD_FILENAME}"
    url = f"{base_url}?v={digest}"

    async def register(_event: Event | None = None) -> None:
        resources, mode = _lovelace_resources(hass.data.get("lovelace"))
        if resources is None or mode != "storage":
            add_extra_js_url(hass, url)
            return
        try:
            if not resources.loaded:
                await resources.async_load()
                resources.loaded = True
            existing = [item for item in resources.async_items() if item.get("url", "").split("?")[0] == base_url]
            if not existing:
                await resources.async_create_item({"res_type": "module", "url": url})
            elif existing[0].get("url") != url:
                await resources.async_update_item(existing[0]["id"], {"res_type": "module", "url": url})
            for duplicate in existing[1:]:
                await resources.async_delete_item(duplicate["id"])
        except Exception as err:  # noqa: BLE001
            _LOGGER.warning(
                "Could not add the Family Link cards to dashboard resources (%s). Add %s manually "
                "in Settings > Dashboards > Resources (JavaScript module)",
                err,
                url,
            )
            add_extra_js_url(hass, url)

    if hass.is_running:
        await register()
    else:
        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, register)


def _lovelace_resources(lovelace: Any) -> tuple[Any, str]:
    """Lovelace resources and their mode, whatever the Home Assistant version (dict before 2025.2)."""
    if isinstance(lovelace, dict):
        return lovelace.get("resources"), lovelace.get("resource_mode", lovelace.get("mode", "storage"))
    return getattr(lovelace, "resources", None), getattr(
        lovelace, "resource_mode", getattr(lovelace, "mode", "storage")
    )


def _parse_time(value: str | None) -> datetime | None:
    return dt_util.parse_datetime(value) if value else None

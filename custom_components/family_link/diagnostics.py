"""Diagnostics: state of the session and of each child, without cookies, names, e-mails or positions."""

from __future__ import annotations

from dataclasses import asdict
from typing import Any

from homeassistant.core import HomeAssistant

from .const import CONF_ACCOUNT, CONF_COOKIES
from .coordinator import FamilyLinkConfigEntry


async def async_get_config_entry_diagnostics(hass: HomeAssistant, entry: FamilyLinkConfigEntry) -> dict[str, Any]:
    coordinator = entry.runtime_data
    client = coordinator.client
    children = []
    for index, child in enumerate(coordinator.data.children.values()):
        usage = child.usage
        children.append(
            {
                "child": f"child_{index + 1}",
                "status": coordinator.child_status(child),
                "devices": [
                    {
                        "kind": device.kind,
                        "model": device.model,
                        "capabilities": device.capabilities,
                        "status": coordinator.device_status(child, device_id),
                        "limits": asdict(child.limits[device_id]) | {"device_id": "**REDACTED**", "override_by": None}
                        if device_id in child.limits
                        else None,
                    }
                    for device_id, device in (usage.devices if usage else {}).items()
                ],
                "apps": len(usage.apps) if usage else None,
                "located": child.location is not None,
                "fetched": {name: value.isoformat() for name, value in child.fetched.items()},
                "errors": child.errors,
            }
        )
    return {
        "entry": {
            "options": dict(entry.options),
            "cookies": sorted(entry.data.get(CONF_COOKIES, {})),
            "account": "**REDACTED**" if entry.data.get(CONF_ACCOUNT) else None,
        },
        "session": {
            "fingerprint": client.cookies.fingerprint(),
            "can_sign": client.cookies.can_sign,
            "last_rotation": client.last_rotation.isoformat() if client.last_rotation else None,
            "last_rotation_status": client.last_rotation_status,
        },
        "last_update_success": coordinator.last_update_success,
        "children": children,
    }

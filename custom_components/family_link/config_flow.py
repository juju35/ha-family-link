"""Config flow: paste the Google cookies of familylink.google.com; re-authentication; options."""

from __future__ import annotations

import logging
from collections.abc import Mapping
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigFlow, ConfigFlowResult, OptionsFlow

try:  # Home Assistant 2025.8+: the options flow reloads the entry itself
    from homeassistant.config_entries import OptionsFlowWithReload as _OptionsFlowBase

    OPTIONS_FLOW_RELOADS = True
except ImportError:
    _OptionsFlowBase = OptionsFlow
    OPTIONS_FLOW_RELOADS = False
from homeassistant.core import callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.selector import (
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    TextSelector,
    TextSelectorConfig,
)

from .api import AuthError, FamilyLinkClient, FamilyLinkError, create_session
from .auth import CookieFormatError, GoogleCookies
from .const import (
    CONF_ACCOUNT,
    CONF_COOKIES,
    CONF_LOCATION_INTERVAL,
    CONF_NOTIFY_SERVICES,
    CONF_PRONOTE,
    CONF_SCAN_INTERVAL,
    CONF_SCHOOL_APPS,
    CONF_STALE_AFTER,
    DEFAULT_LOCATION_INTERVAL,
    DEFAULT_SCAN_INTERVAL,
    DEFAULT_STALE_AFTER,
    DOMAIN,
    NAME,
    PACKAGE_RE,
)
from .coordinator import FamilyLinkConfigEntry
from .models import parse_members, parse_my_email

_LOGGER = logging.getLogger(__name__)

URL = "https://familylink.google.com"
COOKIES_SCHEMA = vol.Schema({vol.Required(CONF_COOKIES): TextSelector(TextSelectorConfig(multiline=True))})


async def _validate(hass: Any, text: str) -> tuple[GoogleCookies, str | None, int]:
    """Parse the cookies and check them against the API; returns them, the parent e-mail and the child count."""
    cookies = GoogleCookies.parse(text)
    session = create_session(hass, auto_cleanup=False)
    try:
        raw = await FamilyLinkClient(session, cookies).get_members_raw()
    finally:
        await session.close()
    children = [m for m in parse_members(raw) if m.supervised]
    return cookies, parse_my_email(raw), len(children)


class FamilyLinkConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def _check(self, user_input: dict[str, Any]) -> tuple[dict[str, str], tuple | None]:
        errors: dict[str, str] = {}
        try:
            result = await _validate(self.hass, user_input[CONF_COOKIES])
        except CookieFormatError:
            errors[CONF_COOKIES] = "invalid_cookies"
        except AuthError:
            errors["base"] = "invalid_auth"
        except FamilyLinkError as err:
            _LOGGER.debug("Family Link check failed: %s", err)
            errors["base"] = "cannot_connect"
        else:
            if result[2] == 0:
                errors["base"] = "no_children"
            return errors, result
        return errors, None

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            errors, result = await self._check(user_input)
            if result and not errors:
                cookies, email, _count = result
                await self.async_set_unique_id((email or cookies.fingerprint()).lower())
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title=f"{NAME} ({email})" if email else NAME,
                    data={CONF_COOKIES: cookies.to_storage(), CONF_ACCOUNT: email},
                )
        return self.async_show_form(
            step_id="user", data_schema=COOKIES_SCHEMA, errors=errors, description_placeholders={"url": URL}
        )

    async def async_step_reauth(self, entry_data: Mapping[str, Any]) -> ConfigFlowResult:
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        entry = self._get_reauth_entry()
        if user_input is not None:
            errors, result = await self._check(user_input)
            if result and not errors:
                cookies, email, _count = result
                if email and entry.unique_id and email.lower() != entry.unique_id:
                    return self.async_abort(reason="wrong_account")
                return self.async_update_reload_and_abort(
                    entry, data={**entry.data, CONF_COOKIES: cookies.to_storage()}
                )
        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=COOKIES_SCHEMA,
            errors=errors,
            description_placeholders={"account": entry.data.get(CONF_ACCOUNT) or entry.title, "url": URL},
        )

    async def async_step_reconfigure(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        entry = self._get_reconfigure_entry()
        if user_input is not None:
            errors, result = await self._check(user_input)
            if result and not errors:
                cookies, _email, _count = result
                return self.async_update_reload_and_abort(
                    entry, data={**entry.data, CONF_COOKIES: cookies.to_storage()}
                )
        return self.async_show_form(
            step_id="reconfigure", data_schema=COOKIES_SCHEMA, errors=errors, description_placeholders={"url": URL}
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: FamilyLinkConfigEntry) -> OptionsFlow:
        return FamilyLinkOptionsFlow()


def _seconds(minimum: int, maximum: int, step: int) -> NumberSelector:
    return NumberSelector(
        NumberSelectorConfig(min=minimum, max=maximum, step=step, mode=NumberSelectorMode.BOX, unit_of_measurement="s")
    )


class FamilyLinkOptionsFlow(_OptionsFlowBase):
    """Update intervals; per child, one line each: the emergency notify service, the Pronote timetable sensor
    of the school mode. Apps the school mode leaves reachable, on top of the essential ones."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        entry = self.config_entry
        coordinator = getattr(entry, "runtime_data", None)
        children = {cid: c.member for cid, c in coordinator.data.children.items()} if coordinator else {}
        errors: dict[str, str] = {}
        if user_input is not None:
            services, unknown = parse_notify_lines(user_input.pop(CONF_NOTIFY_SERVICES, "") or "", children)
            pronote, unknown_pronote = parse_child_lines(user_input.pop(CONF_PRONOTE, "") or "", children)
            apps = parse_apps(user_input.pop(CONF_SCHOOL_APPS, "") or "")
            if unknown:
                errors[CONF_NOTIFY_SERVICES] = "unknown_child"
            if unknown_pronote:
                errors[CONF_PRONOTE] = "unknown_child"
            elif any(not value.startswith("sensor.") for value in pronote.values()):
                errors[CONF_PRONOTE] = "invalid_sensor"
            if apps is None:
                errors[CONF_SCHOOL_APPS] = "invalid_app"
            if not errors:
                return self.async_create_entry(
                    data={**user_input, CONF_NOTIFY_SERVICES: services, CONF_PRONOTE: pronote, CONF_SCHOOL_APPS: apps}
                )
        options = entry.options
        pronote_current = options.get(CONF_PRONOTE) or _pronote_suggestions(self.hass, children)
        schema = {
            vol.Required(CONF_SCAN_INTERVAL, default=options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)): _seconds(
                30, 3600, 10
            ),
            vol.Required(
                CONF_LOCATION_INTERVAL, default=options.get(CONF_LOCATION_INTERVAL, DEFAULT_LOCATION_INTERVAL)
            ): _seconds(60, 7200, 30),
            vol.Required(CONF_STALE_AFTER, default=options.get(CONF_STALE_AFTER, DEFAULT_STALE_AFTER)): _seconds(
                300, 86400, 60
            ),
            vol.Optional(
                CONF_NOTIFY_SERVICES,
                description={"suggested_value": _lines(options.get(CONF_NOTIFY_SERVICES, {}), children)},
            ): TextSelector(TextSelectorConfig(multiline=True)),
            vol.Optional(
                CONF_PRONOTE, description={"suggested_value": _lines(pronote_current, children)}
            ): TextSelector(TextSelectorConfig(multiline=True)),
            vol.Optional(
                CONF_SCHOOL_APPS, description={"suggested_value": "\n".join(options.get(CONF_SCHOOL_APPS, []))}
            ): TextSelector(TextSelectorConfig(multiline=True)),
        }
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(schema),
            errors=errors,
            description_placeholders={"children": ", ".join(m.name for m in children.values()) or "-"},
        )


def _lines(values: Mapping[str, str], children: dict[str, Any]) -> str:
    return "\n".join(f"{children[cid].name if cid in children else cid}: {value}" for cid, value in values.items())


def parse_child_lines(text: str, children: dict[str, Any]) -> tuple[dict[str, str], list[str]]:
    """'Child: value' lines -> {child_id: value}; also returns the names matching no child."""
    values: dict[str, str] = {}
    unknown: list[str] = []
    for line in text.splitlines():
        name, sep, value = line.partition(":")
        name, value = name.strip(), value.strip()
        if not sep or not name or not value:
            continue
        child_id = next(
            (
                cid
                for cid, member in children.items()
                if name == cid or name.casefold() in (member.name.casefold(), member.given_name.casefold())
            ),
            None,
        )
        if child_id is None:
            unknown.append(name)
            continue
        values[child_id] = value
    return values, unknown


def parse_notify_lines(text: str, children: dict[str, Any]) -> tuple[dict[str, str], list[str]]:
    """'Child: notify.service' lines -> {child_id: service}; also returns the names matching no child."""
    services, unknown = parse_child_lines(text, children)
    return {cid: s if "." in s else f"notify.{s}" for cid, s in services.items()}, unknown


def parse_apps(text: str) -> list[str] | None:
    """Package names, one per line or comma separated; None when one isn't a package name."""
    apps = [part.strip() for part in text.replace(",", "\n").splitlines() if part.strip()]
    return apps if all(PACKAGE_RE.match(app) for app in apps) else None


def _pronote_suggestions(hass: Any, children: dict[str, Any]) -> dict[str, str]:
    """The Pronote "today's timetable" sensor of each child whose first name the Pronote student carries."""
    registry_e, registry_d = er.async_get(hass), dr.async_get(hass)
    found: dict[str, str] = {}
    for entity in list(registry_e.entities.values()):
        if entity.platform != "pronote" or entity.domain != "sensor" or entity.translation_key != "lessons_today":
            continue
        device = registry_d.async_get(entity.device_id) if entity.device_id else None
        device_name = (device.name_by_user or device.name or "") if device else ""
        label = f"{device_name} {entity.entity_id}".casefold()
        for cid, member in children.items():
            first = (member.given_name or member.name.split(" ")[0]).casefold()
            if first and first in label and cid not in found:
                found[cid] = entity.entity_id
    return found

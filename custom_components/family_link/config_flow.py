"""Config flow: paste the Google cookies of familylink.google.com; re-authentication; options."""

from __future__ import annotations

import logging
from collections.abc import Mapping
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.selector import (
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    TextSelector,
    TextSelectorConfig,
)

from .api import AuthError, FamilyLinkClient, FamilyLinkError
from .auth import CookieFormatError, GoogleCookies
from .const import (
    CONF_ACCOUNT,
    CONF_COOKIES,
    CONF_LOCATION_INTERVAL,
    CONF_NOTIFY_SERVICES,
    CONF_SCAN_INTERVAL,
    CONF_STALE_AFTER,
    DEFAULT_LOCATION_INTERVAL,
    DEFAULT_SCAN_INTERVAL,
    DEFAULT_STALE_AFTER,
    DOMAIN,
    NAME,
)
from .coordinator import FamilyLinkConfigEntry
from .models import parse_members, parse_my_email

_LOGGER = logging.getLogger(__name__)

COOKIES_SCHEMA = vol.Schema({vol.Required(CONF_COOKIES): TextSelector(TextSelectorConfig(multiline=True))})


async def _validate(hass: Any, text: str) -> tuple[GoogleCookies, str | None, int]:
    """Parse the cookies and check them against the API; returns them, the parent e-mail and the child count."""
    cookies = GoogleCookies.parse(text)
    client = FamilyLinkClient(async_get_clientsession(hass), cookies)
    raw = await client.get_members_raw()
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
        return self.async_show_form(step_id="user", data_schema=COOKIES_SCHEMA, errors=errors)

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
            description_placeholders={"account": entry.data.get(CONF_ACCOUNT) or entry.title},
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
        return self.async_show_form(step_id="reconfigure", data_schema=COOKIES_SCHEMA, errors=errors)

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: FamilyLinkConfigEntry) -> OptionsFlow:
        return FamilyLinkOptionsFlow()


def _seconds(minimum: int, maximum: int, step: int) -> NumberSelector:
    return NumberSelector(
        NumberSelectorConfig(min=minimum, max=maximum, step=step, mode=NumberSelectorMode.BOX, unit_of_measurement="s")
    )


class FamilyLinkOptionsFlow(OptionsFlow):
    """Update intervals, and the notify service of each child for the emergency message (one line per child)."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        entry = self.config_entry
        coordinator = getattr(entry, "runtime_data", None)
        children = {cid: c.member for cid, c in coordinator.data.children.items()} if coordinator else {}
        errors: dict[str, str] = {}
        if user_input is not None:
            text = user_input.pop(CONF_NOTIFY_SERVICES, "") or ""
            services, unknown = parse_notify_lines(text, children)
            if unknown:
                errors[CONF_NOTIFY_SERVICES] = "unknown_child"
            else:
                return self.async_create_entry(data={**user_input, CONF_NOTIFY_SERVICES: services})
        options = entry.options
        current = options.get(CONF_NOTIFY_SERVICES, {})
        lines = "\n".join(
            f"{children[cid].name}: {service}" if cid in children else f"{cid}: {service}"
            for cid, service in current.items()
        )
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
            vol.Optional(CONF_NOTIFY_SERVICES, description={"suggested_value": lines}): TextSelector(
                TextSelectorConfig(multiline=True)
            ),
        }
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(schema),
            errors=errors,
            description_placeholders={"children": ", ".join(m.name for m in children.values()) or "-"},
        )


def parse_notify_lines(text: str, children: dict[str, Any]) -> tuple[dict[str, str], list[str]]:
    """'Child: notify.service' lines -> {child_id: service}; also returns the names matching no child."""
    services: dict[str, str] = {}
    unknown: list[str] = []
    for line in text.splitlines():
        name, sep, service = line.partition(":")
        name, service = name.strip(), service.strip()
        if not sep or not name or not service:
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
        services[child_id] = service if "." in service else f"notify.{service}"
    return services, unknown

"""Config flow: cookies, errors, duplicate account, re-authentication, reconfigure, options."""

from __future__ import annotations

from unittest.mock import patch

import pytest
from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.setup import async_setup_component

from custom_components.family_link.config_flow import parse_notify_lines
from custom_components.family_link.const import CONF_COOKIES, CONF_NOTIFY_SERVICES, CONF_SCAN_INTERVAL, DOMAIN
from custom_components.family_link.models import Member

from . import data
from .test_init import make_entry, setup


@pytest.fixture(autouse=True)
def no_sleep():
    with patch("custom_components.family_link.api.asyncio.sleep"):
        yield


async def test_user_flow(hass: HomeAssistant, aioclient_mock) -> None:
    data.mock_api(aioclient_mock)
    assert await async_setup_component(hass, "http", {})
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {CONF_COOKIES: "SID=only"})
    assert result["errors"] == {CONF_COOKIES: "invalid_cookies"}
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {CONF_COOKIES: data.COOKIES})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Family Link (parent@example.com)"
    assert result["result"].unique_id == "parent@example.com"
    assert result["data"][CONF_COOKIES]["SAPISID"] == "sapisid/abc"
    await hass.async_block_till_done()


@pytest.mark.parametrize(
    ("status", "error"),
    [(401, "invalid_auth"), (503, "cannot_connect")],
)
async def test_user_flow_errors(hass: HomeAssistant, aioclient_mock, status: int, error: str) -> None:
    aioclient_mock.get(f"{data.BASE}/families/mine/members", status=status)
    aioclient_mock.post("https://accounts.google.com/RotateCookies", text="")
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {CONF_COOKIES: data.COOKIES})
    assert result["errors"] == {"base": error}


async def test_user_flow_no_children(hass: HomeAssistant, aioclient_mock) -> None:
    members = data.members()
    members["members"] = members["members"][:1]
    aioclient_mock.get(f"{data.BASE}/families/mine/members", json=members)
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {CONF_COOKIES: data.COOKIES})
    assert result["errors"] == {"base": "no_children"}


async def test_duplicate_account(hass: HomeAssistant, aioclient_mock) -> None:
    make_entry(hass)
    data.mock_api(aioclient_mock)
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {CONF_COOKIES: data.COOKIES})
    assert result["type"] is FlowResultType.ABORT and result["reason"] == "already_configured"


async def test_reauth_and_reconfigure(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    result = await entry.start_reauth_flow(hass)
    assert result["step_id"] == "reauth_confirm"
    fresh = data.COOKIES.replace("sidts-old", "sidts-fresh")
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {CONF_COOKIES: fresh})
    assert result["type"] is FlowResultType.ABORT and result["reason"] == "reauth_successful"
    assert entry.data[CONF_COOKIES]["__Secure-1PSIDTS"] == "sidts-fresh"
    await hass.async_block_till_done()
    result = await entry.start_reconfigure_flow(hass)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {CONF_COOKIES: data.COOKIES})
    assert result["reason"] == "reconfigure_successful"
    await hass.async_block_till_done()


async def test_reauth_wrong_account(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    members = data.members()
    members["members"][0]["profile"]["email"] = "other@example.com"
    aioclient_mock.clear_requests()
    aioclient_mock.get(f"{data.BASE}/families/mine/members", json=members)  # matched before the default answer
    data.mock_api(aioclient_mock)
    result = await entry.start_reauth_flow(hass)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {CONF_COOKIES: data.COOKIES})
    assert result["reason"] == "wrong_account"


async def test_options(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["description_placeholders"]["children"] == "Alex"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {CONF_SCAN_INTERVAL: 60, "location_interval": 300, "stale_after": 3600, CONF_NOTIFY_SERVICES: "Nobody: x"},
    )
    assert result["errors"] == {CONF_NOTIFY_SERVICES: "unknown_child"}
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            CONF_SCAN_INTERVAL: 60,
            "location_interval": 300,
            "stale_after": 3600,
            CONF_NOTIFY_SERVICES: "alex: mobile_app_pixel_8",
        },
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options[CONF_NOTIFY_SERVICES] == {data.CHILD: "notify.mobile_app_pixel_8"}
    await hass.async_block_till_done()


def test_parse_notify_lines() -> None:
    children = {"1": Member("1", "Alex", "Alex"), "2": Member("2", "Sam Martin", "Sam")}
    services, unknown = parse_notify_lines("Alex: notify.a\nsam: mobile_b\n\nbad line\nZoe: x", children)
    assert services == {"1": "notify.a", "2": "notify.mobile_b"}
    assert unknown == ["Zoe"]

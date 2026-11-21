"""Setup, entities, cached data on transient errors, re-authentication, actions and diagnostics."""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import patch

import pytest
from homeassistant.config_entries import SOURCE_REAUTH, ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import device_registry as dr
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

from custom_components.family_link import async_remove_config_entry_device
from custom_components.family_link.auth import GoogleCookies
from custom_components.family_link.const import CONF_COOKIES, CONF_NOTIFY_SERVICES, DOMAIN
from custom_components.family_link.diagnostics import async_get_config_entry_diagnostics

from . import data

STATUS = "sensor.alex_status"


@pytest.fixture(autouse=True)
def no_sleep():
    with patch("custom_components.family_link.api.asyncio.sleep"):
        yield


def make_entry(hass: HomeAssistant, **options) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Family Link (parent@example.com)",
        unique_id="parent@example.com",
        data={CONF_COOKIES: GoogleCookies.parse(data.COOKIES).to_storage(), "account": "parent@example.com"},
        options=options,
    )
    entry.add_to_hass(hass)
    return entry


async def setup(hass: HomeAssistant, aioclient_mock, entry: MockConfigEntry | None = None, **mock) -> MockConfigEntry:
    data.mock_api(aioclient_mock, **mock)
    entry = entry or make_entry(hass)
    assert await async_setup_component(hass, "http", {})
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_setup_creates_entities(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    assert entry.state is ConfigEntryState.LOADED
    status = hass.states.get(STATUS)
    assert status.state in ("tracked", "attention", "locked")
    attrs = status.attributes
    assert attrs["family_link"] is True and attrs["child_name"] == "Alex"
    devices = {d["name"]: d for d in attrs["devices"]}
    assert devices["Tab A9"]["locked"] is True and devices["Tab A9"]["status"] == "locked"
    assert devices["Tab A9"]["kind"] == "tablet"
    assert devices["Pixel 8"]["limit"] == 120
    assert attrs["top_apps"][0]["title"] == "YouTube" and attrs["top_apps"][0]["limit"] == 60
    assert attrs["location"]["place"] == "Home" and attrs["location"]["fresh"] is True
    assert attrs["tracker"] == "device_tracker.alex"
    assert attrs["blocked_apps"] == 1
    assert hass.states.get("device_tracker.alex").attributes["latitude"] == pytest.approx(48.1117)
    assert float(hass.states.get("sensor.alex_screen_time").state) > 0
    assert hass.states.get("switch.tab_a9_lock").state == "on"
    assert hass.states.get("switch.pixel_8_lock").state == "off"
    assert hass.states.get("button.pixel_8_ring") is not None
    assert hass.states.get("sensor.alex_battery").state == "64"


def _resources(hass: HomeAssistant):
    lovelace = hass.data["lovelace"]
    return lovelace["resources"] if isinstance(lovelace, dict) else lovelace.resources


async def test_card_is_added_to_the_dashboard_resources(hass: HomeAssistant, aioclient_mock) -> None:
    assert await async_setup_component(hass, "lovelace", {})
    await setup(hass, aioclient_mock)
    urls = [item["url"] for item in _resources(hass).async_items()]
    assert len(urls) == 1 and urls[0].startswith("/family_link_frontend/family-link-card.js?v=")


async def test_card_in_yaml_mode_is_loaded_on_every_page(hass: HomeAssistant, aioclient_mock, stub_frontend) -> None:
    assert await async_setup_component(hass, "lovelace", {"lovelace": {"mode": "yaml"}})
    await setup(hass, aioclient_mock)
    assert stub_frontend.call_args[0][1].startswith("/family_link_frontend/family-link-card.js?v=")


async def test_cached_data_on_transient_errors(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    aioclient_mock.clear_requests()
    data.mock_api(aioclient_mock)
    # Applied limits fail: their last value stays, flagged stale
    aioclient_mock._mocks = [m for m in aioclient_mock._mocks if "appliedTimeLimits" not in str(m._url)]  # noqa: SLF001
    aioclient_mock.get(f"{data.BASE}/people/{data.CHILD}/appliedTimeLimits", status=503)
    coordinator = entry.runtime_data
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    status = hass.states.get(STATUS)
    assert status.state != "unavailable"
    assert status.attributes["stale"] is True and "limits" in status.attributes["errors"]
    assert hass.states.get("switch.tab_a9_lock").state == "on"


async def test_unreachable_keeps_entities_until_stale_after(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    coordinator = entry.runtime_data
    aioclient_mock.clear_requests()
    for path in (
        "families/mine/members",
        f"people/{data.CHILD}/appsandusage",
        f"people/{data.CHILD}/appliedTimeLimits",
        f"people/{data.CHILD}/timeLimit",
    ):
        aioclient_mock.get(f"{data.BASE}/{path}", exc=TimeoutError())
    aioclient_mock.get(f"{data.BASE}/families/mine/location/{data.CHILD}", exc=TimeoutError())
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    assert hass.states.get(STATUS).state != "unavailable"
    assert hass.states.get(STATUS).attributes["stale"] is True
    # Past "stale after", the entities go unavailable
    coordinator._last_full_success = dt_util.now() - timedelta(hours=2)  # noqa: SLF001
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    assert hass.states.get(STATUS).state == "unavailable"


async def test_reauth_after_two_refusals(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    coordinator = entry.runtime_data
    aioclient_mock.clear_requests()
    aioclient_mock.get(f"{data.BASE}/people/{data.CHILD}/appsandusage", status=401)
    aioclient_mock.get(f"{data.BASE}/people/{data.CHILD}/appliedTimeLimits", status=401)
    aioclient_mock.get(f"{data.BASE}/families/mine/location/{data.CHILD}", status=401)
    aioclient_mock.post("https://accounts.google.com/RotateCookies", text="")
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    # First refusal: cached data kept, no re-authentication yet
    assert hass.states.get(STATUS).state != "unavailable"
    assert not hass.config_entries.flow.async_progress_by_handler(DOMAIN)
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    flows = hass.config_entries.flow.async_progress_by_handler(DOMAIN)
    assert flows and flows[0]["context"]["source"] == SOURCE_REAUTH
    notifications = hass.data.get("persistent_notification", {})
    assert f"family_link_reauth_{entry.entry_id}" in notifications
    # The next success dismisses the notification
    aioclient_mock.clear_requests()
    data.mock_api(aioclient_mock)
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    assert f"family_link_reauth_{entry.entry_id}" not in hass.data.get("persistent_notification", {})


async def test_reauth_notification_explains_a_bound_session(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    coordinator = entry.runtime_data
    aioclient_mock.clear_requests()
    aioclient_mock.get(f"{data.BASE}/people/{data.CHILD}/appsandusage", status=401)
    aioclient_mock.get(f"{data.BASE}/people/{data.CHILD}/appliedTimeLimits", status=401)
    aioclient_mock.get(f"{data.BASE}/families/mine/location/{data.CHILD}", status=401)
    aioclient_mock.post("https://accounts.google.com/RotateCookies", status=401, text="")
    await coordinator.async_refresh()
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    notification = hass.data["persistent_notification"][f"family_link_reauth_{entry.entry_id}"]
    assert "Firefox private window" in notification["message"]


async def test_setup_with_refused_session_starts_reauth(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.get(f"{data.BASE}/families/mine/members", status=401)
    aioclient_mock.post("https://accounts.google.com/RotateCookies", text="")
    entry = make_entry(hass)
    assert await async_setup_component(hass, "http", {})
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.SETUP_ERROR
    assert hass.config_entries.flow.async_progress_by_handler(DOMAIN)


async def test_rotated_cookies_are_saved(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    coordinator = entry.runtime_data
    coordinator.client.cookies.values["__Secure-1PSIDTS"] = "rotated"
    coordinator.cookies_changed(coordinator.client.cookies)
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=11))
    await hass.async_block_till_done()
    assert entry.data[CONF_COOKIES]["__Secure-1PSIDTS"] == "rotated"
    # A data-only update does not reload the entry
    assert entry.state is ConfigEntryState.LOADED and entry.runtime_data is coordinator


async def test_actions(hass: HomeAssistant, aioclient_mock) -> None:
    await setup(hass, aioclient_mock)
    await hass.services.async_call(DOMAIN, "lock", {"child": "Alex", "device": "Pixel 8"}, blocking=True)
    assert hass.states.get("switch.pixel_8_lock").state == "on"
    await hass.services.async_call(DOMAIN, "unlock", {"child": data.CHILD, "device": data.PHONE}, blocking=True)
    assert hass.states.get("switch.pixel_8_lock").state == "off"
    await hass.services.async_call(
        DOMAIN, "add_bonus", {"child": STATUS, "device": "Pixel 8", "minutes": 30}, blocking=True
    )
    phone = next(d for d in hass.states.get(STATUS).attributes["devices"] if d["name"] == "Pixel 8")
    assert phone["bonus"] == 30 and phone["bonus_id"] == data.BONUS_ID and phone["remaining"] == 30
    await hass.services.async_call(DOMAIN, "revoke_bonus", {"child": "Alex", "device": "Pixel 8"}, blocking=True)
    phone = next(d for d in hass.states.get(STATUS).attributes["devices"] if d["name"] == "Pixel 8")
    assert phone["bonus"] == 0
    await hass.services.async_call(DOMAIN, "ring", {"child": "Alex", "device": "Pixel 8"}, blocking=True)
    await hass.services.async_call(
        DOMAIN, "set_app", {"child": "Alex", "app": "Minecraft", "mode": "block"}, blocking=True
    )
    result = await hass.services.async_call(
        DOMAIN, "refresh_location", {"child": "Alex"}, blocking=True, return_response=True
    )
    assert result["located"] is True and result["place"] == "Home"
    calls = [str(call[1]) for call in aioclient_mock.mock_calls]
    assert any("executeRemoteAction" in u for u in calls)
    assert any("updateRestrictions" in u for u in calls)
    assert any("locationRefreshMode=2" in u for u in calls)


async def test_action_errors(hass: HomeAssistant, aioclient_mock) -> None:
    await setup(hass, aioclient_mock)
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(DOMAIN, "lock", {"child": "Nobody"}, blocking=True)
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(DOMAIN, "lock", {"child": "Alex"}, blocking=True)  # two devices
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(DOMAIN, "revoke_bonus", {"child": "Alex", "device": "Pixel 8"}, blocking=True)
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "set_app", {"child": "Alex", "app": "Minecraft", "mode": "limit"}, blocking=True
        )


async def test_emergency_rings_and_notifies(hass: HomeAssistant, aioclient_mock) -> None:
    sent = []

    async def notify(call):
        sent.append(call.data)

    hass.services.async_register("notify", "mobile_app_pixel_8", notify)
    entry = make_entry(hass, **{CONF_NOTIFY_SERVICES: {data.CHILD: "notify.mobile_app_pixel_8"}})
    await setup(hass, aioclient_mock, entry)
    assert hass.states.get(STATUS).attributes["notify_service"] == "notify.mobile_app_pixel_8"
    await hass.services.async_call(
        DOMAIN, "emergency", {"child": "Alex", "device": "Pixel 8", "message": "Call me back"}, blocking=True
    )
    assert sent and sent[0]["message"] == "Call me back" and sent[0]["data"]["channel"] == "alarm_stream"
    assert any("executeRemoteAction" in str(call[1]) for call in aioclient_mock.mock_calls)
    events = []
    hass.bus.async_listen("family_link_action", events.append)
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "emergency", {"child": "Alex", "device": "Pixel 8", "ring": False}, blocking=True
        )


async def test_emergency_refuses_a_service_outside_notify(hass: HomeAssistant, aioclient_mock) -> None:
    called = []

    async def other(call):
        called.append(call.data)

    hass.services.async_register("script", "anything", other)
    await setup(hass, aioclient_mock)
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN,
            "emergency",
            {"child": "Alex", "device": "Pixel 8", "message": "Hi", "ring": False, "notify_service": "script.anything"},
            blocking=True,
        )
    assert not called


async def test_diagnostics_redact(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    diag = await async_get_config_entry_diagnostics(hass, entry)
    text = str(diag)
    for secret in ("sapisid/abc", "parent@example.com", "Alex", "48.11", data.PHONE):
        assert secret not in text
    assert diag["children"][0]["devices"][1]["status"] == "locked"


async def test_unload(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    assert await hass.config_entries.async_unload(entry.entry_id)
    assert entry.state is ConfigEntryState.NOT_LOADED


async def test_without_any_data_entities_go_unavailable_after_stale_after(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    coordinator = entry.runtime_data
    # Never a full success since the start: the "stale after" delay counts from it
    coordinator._last_full_success = dt_util.now() - timedelta(hours=2)  # noqa: SLF001
    aioclient_mock.clear_requests()
    aioclient_mock.get(f"{data.BASE}/people/{data.CHILD}/appsandusage", status=503)
    aioclient_mock.get(f"{data.BASE}/people/{data.CHILD}/appliedTimeLimits", status=503)
    aioclient_mock.get(f"{data.BASE}/families/mine/location/{data.CHILD}", status=503)
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    assert hass.states.get(STATUS).state == "unavailable"


async def test_emergency_without_device_rings_every_device(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.post(f"{data.BASE}/people/{data.CHILD}/devices/{data.TABLET}:executeRemoteAction", json=[])
    await setup(hass, aioclient_mock)
    events = []
    hass.bus.async_listen("family_link_action", events.append)
    await hass.services.async_call(DOMAIN, "emergency", {"child": "Alex"}, blocking=True)
    await hass.async_block_till_done()
    rung = [str(call[1]) for call in aioclient_mock.mock_calls if "executeRemoteAction" in str(call[1])]
    assert any(data.PHONE in u for u in rung) and any(data.TABLET in u for u in rung)
    assert set(events[0].data["devices"]) == {data.PHONE, data.TABLET}


async def test_bonus_keeps_a_parent_lock(hass: HomeAssistant, aioclient_mock) -> None:
    await setup(hass, aioclient_mock)
    assert hass.states.get("switch.tab_a9_lock").state == "on"
    await hass.services.async_call(
        DOMAIN, "add_bonus", {"child": "Alex", "device": "Tab A9", "minutes": 15}, blocking=True
    )
    assert hass.states.get("switch.tab_a9_lock").state == "on"


async def test_set_app_unknown_title(hass: HomeAssistant, aioclient_mock) -> None:
    await setup(hass, aioclient_mock)
    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(
            DOMAIN, "set_app", {"child": "Alex", "app": "Some Game", "mode": "block"}, blocking=True
        )
    assert err.value.translation_key == "unknown_app"
    # A package name the child has not used yet is accepted
    await hass.services.async_call(
        DOMAIN, "set_app", {"child": "Alex", "app": "com.example.newgame", "mode": "block"}, blocking=True
    )


async def test_child_leaving_the_family_removes_its_devices(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    registry = dr.async_get(hass)
    assert len(dr.async_entries_for_config_entry(registry, entry.entry_id)) == 3  # Alex, the phone and the tablet
    coordinator = entry.runtime_data
    del coordinator.data.children[data.CHILD]
    coordinator.async_update_listeners()
    await hass.async_block_till_done()
    assert dr.async_entries_for_config_entry(registry, entry.entry_id) == []
    assert hass.states.get(STATUS) is None


async def test_remove_device_by_hand(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    registry = dr.async_get(hass)
    child = registry.async_get(entry.runtime_data.child_device_ids[data.CHILD])
    old = registry.async_get_or_create(config_entry_id=entry.entry_id, identifiers={(DOMAIN, "oldphone123")})
    assert not await async_remove_config_entry_device(hass, entry, child)
    assert await async_remove_config_entry_device(hass, entry, old)

"""Client: signing, retries, cookie rotation, error classes, action payloads."""

from __future__ import annotations

import asyncio
import json
from unittest.mock import patch

import aiohttp
import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from custom_components.family_link.api import ApiError, AuthError, FamilyLinkClient, TransientError, create_session
from custom_components.family_link.auth import GoogleCookies

from . import data


@pytest.fixture(autouse=True)
def no_sleep():
    with patch("custom_components.family_link.api.asyncio.sleep") as sleep:
        yield sleep


def client(hass: HomeAssistant, listener=None) -> FamilyLinkClient:
    c = FamilyLinkClient(async_get_clientsession(hass), GoogleCookies.parse(data.COOKIES))
    if listener:
        c.set_cookie_listener(listener)
    return c


async def test_request_headers(hass: HomeAssistant, aioclient_mock) -> None:
    data.mock_api(aioclient_mock)
    members = await client(hass).get_members()
    assert [m.name for m in members] == ["Parent", "Alex"]
    _method, _url, _body, headers = aioclient_mock.mock_calls[0]
    assert headers["Authorization"].startswith("SAPISIDHASH ")
    assert "SAPISID=sapisid/abc" in headers["Cookie"]
    assert headers["Origin"] == "https://familylink.google.com"


async def test_transient_errors_are_retried(hass: HomeAssistant, aioclient_mock, no_sleep) -> None:
    aioclient_mock.get(f"{data.BASE}/families/mine/members", status=503)
    with pytest.raises(TransientError):
        await client(hass).get_members()
    assert aioclient_mock.call_count == 3
    assert no_sleep.call_count == 2


async def test_retry_after_is_honored(hass: HomeAssistant, aioclient_mock, no_sleep) -> None:
    aioclient_mock.get(f"{data.BASE}/families/mine/members", status=429, headers={"Retry-After": "7"})
    with pytest.raises(TransientError):
        await client(hass).get_members()
    assert no_sleep.call_args_list[0].args[0] == 7


async def test_timeout_is_transient(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.get(f"{data.BASE}/families/mine/members", exc=TimeoutError())
    with pytest.raises(TransientError):
        await client(hass).get_members()


async def test_401_rotates_then_reports_auth(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.get(f"{data.BASE}/families/mine/members", status=401)
    aioclient_mock.post("https://accounts.google.com/RotateCookies", text="")
    with pytest.raises(AuthError):
        await client(hass).get_members()
    urls = [str(call[1]) for call in aioclient_mock.mock_calls]
    assert urls.count("https://accounts.google.com/RotateCookies") == 1
    assert sum("members" in u for u in urls) == 2


async def test_401_with_rotation_refused_flags_bound_session(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.get(f"{data.BASE}/families/mine/members", status=401)
    aioclient_mock.post("https://accounts.google.com/RotateCookies", status=401, text="")
    c = client(hass)
    with pytest.raises(AuthError) as err:
        await c.get_members()
    assert err.value.rotation_refused is True
    assert c.last_rotation_status == 401
    assert "rotation refused" in str(err.value)


async def test_401_with_rotation_accepted_is_not_bound(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.get(f"{data.BASE}/families/mine/members", status=401)
    aioclient_mock.post("https://accounts.google.com/RotateCookies", text="")
    with pytest.raises(AuthError) as err:
        await client(hass).get_members()
    assert err.value.rotation_refused is False


async def test_403_forbidden_action_is_not_auth(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.post(
        f"{data.BASE}/people/{data.CHILD}/devices/{data.PHONE}:executeRemoteAction",
        status=403,
        text='{"error": {"status": "PERMISSION_DENIED"}}',
    )
    with pytest.raises(ApiError):
        await client(hass).ring(data.CHILD, data.PHONE)


async def test_rotation_saves_new_cookies(hass: HomeAssistant, aioclient_mock) -> None:
    saved = []
    aioclient_mock.post("https://accounts.google.com/RotateCookies", text="", cookies={"__Secure-1PSIDTS": "sidts-new"})
    c = client(hass, saved.append)
    assert await c.rotate_cookies(force=True) is True
    assert c.cookies.values["__Secure-1PSIDTS"] == "sidts-new"
    assert saved
    # A second rotation within a minute is skipped unless forced
    assert await c.rotate_cookies() is False


async def test_location_unavailable_is_none(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.get(f"{data.BASE}/families/mine/location/{data.CHILD}", status=404)
    assert await client(hass).get_location(data.CHILD) is None


async def test_action_payloads(hass: HomeAssistant, aioclient_mock) -> None:
    data.mock_api(aioclient_mock)
    c = client(hass)
    await c.lock(data.CHILD, data.PHONE)
    await c.unlock(data.CHILD, data.PHONE)
    assert await c.add_bonus(data.CHILD, data.PHONE, 30) == data.BONUS_ID
    await c.revoke_bonus(data.CHILD, data.BONUS_ID)
    await c.ring(data.CHILD, data.PHONE)
    await c.set_app(data.CHILD, "com.mojang.minecraftpe", "limit", 45)
    bodies = [json.loads(call[2]) for call in aioclient_mock.mock_calls if call[2]]
    assert bodies[0] == [None, data.CHILD, [[None, None, 7, data.PHONE]], [1]]
    assert bodies[1][2][0][2] == 4
    assert bodies[2][2][0][2] == 10 and bodies[2][2][0][-1] == [["1800", 0]]
    assert bodies[3] == [None, data.CHILD, data.PHONE, [2, None, data.PHONE, 0]]
    assert bodies[4] == [data.CHILD, [[["com.mojang.minecraftpe"], None, [45, 1]]]]
    revoke = next(call for call in aioclient_mock.mock_calls if "timeLimitOverride/" in str(call[1]))
    assert "%24httpMethod=DELETE" in str(revoke[1]) or "$httpMethod=DELETE" in str(revoke[1])


async def test_invalid_ids_are_refused(hass: HomeAssistant) -> None:
    c = client(hass)
    with pytest.raises(ApiError):
        await c.ring(data.CHILD, "../../etc")
    with pytest.raises(ApiError):
        await c.revoke_bonus(data.CHILD, "not-a-uuid")
    with pytest.raises(ApiError):
        await c.set_app(data.CHILD, "com.x", "limit")


async def test_action_is_not_retried_after_a_timeout(hass: HomeAssistant, aioclient_mock) -> None:
    # Google may have applied the bonus before the answer got lost: a retry would give it twice
    aioclient_mock.post(f"{data.BASE}/people/{data.CHILD}/timeLimitOverrides:batchCreate", exc=TimeoutError())
    with pytest.raises(TransientError):
        await client(hass).add_bonus(data.CHILD, data.PHONE, 15)
    assert aioclient_mock.call_count == 1


async def test_action_is_not_retried_after_a_server_error(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.post(f"{data.BASE}/people/{data.CHILD}/timeLimitOverrides:batchCreate", status=502)
    with pytest.raises(TransientError):
        await client(hass).lock(data.CHILD, data.PHONE)
    assert aioclient_mock.call_count == 1


async def test_action_is_retried_when_rate_limited(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.post(f"{data.BASE}/people/{data.CHILD}/timeLimitOverrides:batchCreate", status=429)
    with pytest.raises(TransientError):
        await client(hass).lock(data.CHILD, data.PHONE)
    assert aioclient_mock.call_count == 3


async def test_requests_refused_together_share_one_rotation(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.get(f"{data.BASE}/families/mine/members", status=401)
    aioclient_mock.post("https://accounts.google.com/RotateCookies", text="")
    c = client(hass)
    results = await asyncio.gather(*(c.get_members() for _ in range(4)), return_exceptions=True)
    assert all(isinstance(r, AuthError) for r in results)
    urls = [str(call[1]) for call in aioclient_mock.mock_calls]
    assert urls.count("https://accounts.google.com/RotateCookies") == 1


async def test_own_session_without_cookie_jar(hass: HomeAssistant) -> None:
    with patch("custom_components.family_link.api.async_create_clientsession") as create:
        create_session(hass)
    assert isinstance(create.call_args.kwargs["cookie_jar"], aiohttp.DummyCookieJar)


async def test_rotation_follows_the_interval_google_asks(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.post("https://accounts.google.com/RotateCookies", text=')]}\'\n[["identity.hfcr",900],["di",42]]')
    c = client(hass)
    assert c.rotation_interval == 600
    await c.rotate_cookies(force=True)
    assert c.rotation_interval == 900


async def test_rotation_interval_bounds_and_default(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.post("https://accounts.google.com/RotateCookies", text='[["identity.hfcr",5]]')
    c = client(hass)
    await c.rotate_cookies(force=True)
    assert c.rotation_interval == 60
    aioclient_mock.clear_requests()
    aioclient_mock.post("https://accounts.google.com/RotateCookies", text='[["identity.hfcr",999999]]')
    c = client(hass)
    await c.rotate_cookies(force=True)
    assert c.rotation_interval == 3600
    aioclient_mock.clear_requests()
    aioclient_mock.post("https://accounts.google.com/RotateCookies", text="")
    c = client(hass)
    await c.rotate_cookies(force=True)
    assert c.rotation_interval == 600

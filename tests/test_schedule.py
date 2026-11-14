"""Weekly schedule: reading timeLimit, switches, quotas, hours, today only, calls and texts."""

from __future__ import annotations

import json
from datetime import timedelta
from unittest.mock import patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from custom_components.family_link.api import TransientError
from custom_components.family_link.const import DOMAIN
from custom_components.family_link.models import parse_time_limit

from . import data
from .test_api import client
from .test_init import setup


@pytest.fixture(autouse=True)
def no_sleep():
    with patch("custom_components.family_link.api.asyncio.sleep"):
        yield


def bodies(aioclient_mock, part: str) -> list:
    return [json.loads(call[2]) for call in aioclient_mock.mock_calls if part in str(call[1]) and call[2]]


def override(minutes_ago: int, payload: list) -> list:
    created = int((dt_util.utcnow() - timedelta(minutes=minutes_ago)).timestamp() * 1000)
    return ["0f1e2d3c-uuid", str(created), 9, "", "", None, None, None, "parent", None, None, None, payload]


def test_parse_time_limit() -> None:
    today = dt_util.now().date()
    schedule = parse_time_limit(data.time_limit(), today)
    assert schedule.bedtime_on and schedule.school_on and schedule.limit_on
    assert schedule.bedtime[1][0].start == (21, 0) and schedule.bedtime[6][0].start == (22, 0)
    assert schedule.bedtime[1][0].end == (7, 0)
    assert [(s.start, s.end) for s in schedule.school[3]] == [((8, 30), (12, 0)), ((13, 30), (16, 30))]
    assert 6 not in schedule.school
    assert schedule.quotas[1] == ("CAEQAQ", 120) and schedule.quotas[7] == ("CAEQBw", 180)
    assert schedule.bedtime_today is True
    assert schedule.school_today is (today.isoweekday() < 6)


def test_today_overrides() -> None:
    today = dt_util.now().date()
    weekday = today.isoweekday()
    code = data.DAY_CODES[weekday]
    # Tonight off, then on again, then off: the latest made today wins
    overrides = [
        override(30, [1, [21], [7], code]),
        override(10, [2, [21], [7], code]),
        override(5, [1, [21], [7], code]),
        override(60 * 24 * 8, [2, [21], [7], code]),  # another week: ignored
        override(2, [2, [8, 30], [23, 59], None, [weekday, data.SCHOOL_POLICY]]),
    ]
    schedule = parse_time_limit(data.time_limit(overrides), today)
    assert schedule.bedtime_today is False
    assert schedule.school_today is True
    # The weekly switch off and no override: off today too
    assert parse_time_limit(data.time_limit(bedtime_on=False), today).bedtime_today is False


async def test_schedule_entities(hass: HomeAssistant, aioclient_mock) -> None:
    await setup(hass, aioclient_mock)
    assert hass.states.get("switch.alex_bedtime").state == "on"
    assert hass.states.get("switch.alex_school_time").state == "on"
    assert hass.states.get("switch.alex_daily_limit").state == "on"
    assert hass.states.get("number.alex_limit_monday").state == "120"
    assert hass.states.get("number.alex_limit_sunday").state == "180"
    assert hass.states.get("select.alex_calls_and_texts").state == "contacts"
    # The 28 time entities exist, disabled until enabled
    entity = er.async_get(hass).async_get("time.alex_bedtime_start_monday")
    assert entity is not None and entity.disabled_by is er.RegistryEntryDisabler.INTEGRATION


async def test_switch_off_bedtime_every_week_and_tonight(hass: HomeAssistant, aioclient_mock) -> None:
    await setup(hass, aioclient_mock)
    await hass.services.async_call("switch", "turn_off", {"entity_id": "switch.alex_bedtime"}, blocking=True)
    assert bodies(aioclient_mock, "timeLimit:update")[-1] == [
        None,
        data.CHILD,
        [[None] * 4, None, None, None, [None, [[data.BEDTIME_POLICY, 1]]]],
        None,
        [1],
    ]
    weekday = dt_util.now().isoweekday()
    tonight = bodies(aioclient_mock, "batchCreate")[-1][2][0]
    assert tonight[2] == 9 and tonight[12][0] == 1 and tonight[12][3] == data.DAY_CODES[weekday]
    assert hass.states.get("switch.alex_bedtime").state == "off"


async def test_weekly_quota_and_daily_limit(hass: HomeAssistant, aioclient_mock) -> None:
    await setup(hass, aioclient_mock)
    await hass.services.async_call(
        "number", "set_value", {"entity_id": "number.alex_limit_monday", "value": 90}, blocking=True
    )
    assert bodies(aioclient_mock, "timeLimit:update")[-1][2] == [None, [[2, None, None, [["CAEQAQ", 90]]]]]
    assert hass.states.get("number.alex_limit_monday").state == "90"
    await hass.services.async_call("switch", "turn_off", {"entity_id": "switch.alex_daily_limit"}, blocking=True)
    assert bodies(aioclient_mock, "timeLimit:update")[-1][2] == [None, [[1, None, None, None]]]
    # Two weekdays at once through the action; the daily limit switch stays off
    await hass.services.async_call(
        DOMAIN, "set_daily_limit", {"child": "Alex", "minutes": 45, "days": ["sat", "sun"]}, blocking=True
    )
    sent = [body[2] for body in bodies(aioclient_mock, "timeLimit:update")[-2:]]
    assert sent == [[None, [[1, None, None, [["CAEQBg", 45]]]]], [None, [[1, None, None, [["CAEQBw", 45]]]]]]


async def test_today_quota(hass: HomeAssistant, aioclient_mock) -> None:
    await setup(hass, aioclient_mock)
    await hass.services.async_call(DOMAIN, "set_daily_limit", {"child": "Alex", "minutes": 30}, blocking=True)
    code = data.DAY_CODES[dt_util.now().isoweekday()]
    sent = [body[2][0] for body in bodies(aioclient_mock, "batchCreate")]
    assert {row[3] for row in sent} == {data.PHONE, data.TABLET}
    assert all(row[2] == 8 and row[11] == [2, 30, code] for row in sent)


async def test_set_schedule(hass: HomeAssistant, aioclient_mock) -> None:
    await setup(hass, aioclient_mock)
    await hass.services.async_call(
        DOMAIN, "set_schedule", {"child": "Alex", "kind": "bedtime", "days": ["fri"], "start": "21:30"}, blocking=True
    )
    assert bodies(aioclient_mock, "timeLimit:update")[-1][2] == [
        [None, None, None, [["CAEQBQ", [21, 30], [7, 0]]], None, None],
        None,
        None,
        None,
        [],
    ]
    # A day off keeps its hours
    await hass.services.async_call(
        DOMAIN,
        "set_schedule",
        {"child": "Alex", "kind": "school_time", "days": ["mon"], "enable": False},
        blocking=True,
    )
    assert bodies(aioclient_mock, "timeLimit:update")[-1][2][0][2] == [["CAMQ1AAAAschool", 1]]
    for days, start, key in ((["wed"], "08:00", "two_slots"), (["sat"], "09:00", "no_slot")):
        with pytest.raises(ServiceValidationError) as err:
            await hass.services.async_call(
                DOMAIN,
                "set_schedule",
                {"child": "Alex", "kind": "school_time", "days": days, "start": start},
                blocking=True,
            )
        assert err.value.translation_key == key
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "set_schedule", {"child": "Alex", "kind": "bedtime", "days": ["mon"]}, blocking=True
        )


async def test_schedule_today(hass: HomeAssistant, aioclient_mock) -> None:
    await setup(hass, aioclient_mock)
    await hass.services.async_call(
        DOMAIN,
        "schedule_today",
        {"child": "Alex", "kind": "school_time", "enable": True, "end": "18:00"},
        blocking=True,
    )
    payload = bodies(aioclient_mock, "batchCreate")[-1][2][0][12]
    weekday = dt_util.now().isoweekday()
    assert payload[0] == 2 and payload[2] == [18, 0] and payload[4] == [weekday, data.SCHOOL_POLICY]
    assert hass.states.get("switch.alex_school_time").attributes["today"] is True


async def test_calls_and_texts(hass: HomeAssistant, aioclient_mock) -> None:
    await setup(hass, aioclient_mock)
    await hass.services.async_call(
        "select", "select_option", {"entity_id": "select.alex_calls_and_texts", "option": "anyone"}, blocking=True
    )
    assert bodies(aioclient_mock, "trustedcontacts:update")[-1] == [None, data.CHILD, None, None, 1]
    assert hass.states.get("select.alex_calls_and_texts").state == "anyone"


async def test_schedule_writes_are_retried(hass: HomeAssistant, aioclient_mock) -> None:
    # Setting a value twice changes nothing: a PUT is retried like a read
    aioclient_mock.put(f"{data.BASE}/people/{data.CHILD}/timeLimit:update", status=502)
    with pytest.raises(TransientError):
        await client(hass).set_daily_limit_enabled(data.CHILD, True)
    assert aioclient_mock.call_count == 3

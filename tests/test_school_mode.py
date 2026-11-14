"""School mode: apps blocked but the essential ones and restored, by hand, by action and by the Pronote timetable."""

from __future__ import annotations

import json
from datetime import timedelta
from unittest.mock import patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.util import dt as dt_util

from custom_components.family_link.const import CONF_PRONOTE, CONF_SCHOOL_APPS, DOMAIN
from custom_components.family_link.school_mode import SchoolMode, school_window

from . import data
from .test_init import make_entry, setup

SWITCH = "switch.alex_school_mode"
PRONOTE = "sensor.pronote_alex_today_s_timetable"
YOUTUBE, MINECRAFT = "com.google.android.youtube", "com.mojang.minecraftpe"


@pytest.fixture(autouse=True)
def no_sleep():
    with patch("custom_components.family_link.api.asyncio.sleep"):
        yield


def restrictions(aioclient_mock) -> list[list]:
    """The rules sent by each apps:updateRestrictions request: [[package, mode marker…], …]."""
    calls = [call for call in aioclient_mock.mock_calls if "updateRestrictions" in str(call[1])]
    return [json.loads(call[2])[1] for call in calls]


def lessons(*spans: tuple[int, int, bool], day: int = 0) -> list[dict]:
    """Lessons of today (+day) from (start hour, end hour, canceled), as the Pronote integration writes them."""
    base = dt_util.now().replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=day)
    return [
        {
            "start_at": (base + timedelta(hours=start)).isoformat(),
            "end_at": (base + timedelta(hours=end)).isoformat(),
            "canceled": canceled,
            "lesson": "Maths",
        }
        for start, end, canceled in spans
    ]


async def test_school_window(hass: HomeAssistant) -> None:
    now = dt_util.now()
    hass.states.async_set(PRONOTE, "3", {"lessons": lessons((8, 10, False), (10, 12, True), (13, 16, False))})
    start, end = school_window(hass, PRONOTE, now)
    assert start.hour == 7 and start.minute == 45 and end.hour == 16
    # The last lesson canceled: the day ends earlier
    hass.states.async_set(PRONOTE, "2", {"lessons": lessons((8, 10, False), (13, 16, True))})
    assert school_window(hass, PRONOTE, now)[1].hour == 10
    # No lesson today (the sensor shows another day), every lesson canceled, no sensor
    hass.states.async_set(PRONOTE, "1", {"lessons": lessons((8, 10, False), day=1)})
    assert school_window(hass, PRONOTE, now) is None
    hass.states.async_set(PRONOTE, "1", {"lessons": lessons((8, 10, True))})
    assert school_window(hass, PRONOTE, now) is None
    assert school_window(hass, "sensor.missing", now) is None


async def test_school_mode_by_hand(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    assert hass.states.get(SWITCH).state == "off"
    await hass.services.async_call("switch", "turn_on", {"entity_id": SWITCH}, blocking=True)
    # YouTube (limited) and Minecraft are blocked; Duolingo (always allowed) and the blocked game are left as is
    assert restrictions(aioclient_mock)[-1] == [[[YOUTUBE], [1]], [[MINECRAFT], [1]]]
    state = hass.states.get(SWITCH)
    assert state.state == "on" and state.attributes["source"] == "manual" and state.attributes["blocked"] == 2
    status = hass.states.get("sensor.alex_status").attributes
    assert status["school_mode"]["active"] is True
    assert hass.states.get("sensor.alex_blocked_apps").state == "3"
    await hass.services.async_call("switch", "turn_off", {"entity_id": SWITCH}, blocking=True)
    # The rules are put back: YouTube's 60 min limit, no rule for Minecraft
    assert restrictions(aioclient_mock)[-1] == [[[YOUTUBE], None, [60, 1]], [[MINECRAFT]]]
    assert hass.states.get(SWITCH).state == "off"
    assert entry.runtime_data.school.state(data.CHILD).saved == {}


async def test_school_mode_keeps_extra_apps_and_survives_a_restart(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock, make_entry(hass, **{CONF_SCHOOL_APPS: [MINECRAFT]}))
    await hass.services.async_call(DOMAIN, "school_mode", {"child": "Alex", "enable": True}, blocking=True)
    assert restrictions(aioclient_mock)[-1] == [[[YOUTUBE], [1]]]
    # Another instance (a restart) reads the saved rules back
    school = SchoolMode(hass, entry.runtime_data)
    await school.async_load()
    assert school.state(data.CHILD).active and school.state(data.CHILD).saved == {YOUTUBE: ["limit", 60]}


async def test_school_mode_follows_pronote(hass: HomeAssistant, aioclient_mock) -> None:
    hour = dt_util.now().hour
    if not 2 <= hour <= 21:
        pytest.skip("needs lessons around the current hour on the same day")
    hass.states.async_set(PRONOTE, "2", {"lessons": lessons((hour - 1, hour + 1, False), (hour + 1, hour + 2, False))})
    entry = await setup(hass, aioclient_mock, make_entry(hass, **{CONF_PRONOTE: {data.CHILD: PRONOTE}}))
    school = entry.runtime_data.school
    await hass.async_block_till_done()
    state = hass.states.get(SWITCH)
    assert state.state == "on" and state.attributes["source"] == "pronote" and state.attributes["pronote"] == PRONOTE
    # Turned off by hand during the school day: Pronote waits for the end of the day
    await hass.services.async_call("switch", "turn_off", {"entity_id": SWITCH}, blocking=True)
    await school.async_check_pronote()
    assert hass.states.get(SWITCH).state == "off" and school.state(data.CHILD).paused_until
    # The next school day it starts again; once the day is over, Pronote turns it off
    school.state(data.CHILD).paused_until = None
    await school.async_check_pronote()
    assert hass.states.get(SWITCH).state == "on"
    await school.async_check_pronote(dt_util.now() + timedelta(hours=3))
    await hass.async_block_till_done()
    assert hass.states.get(SWITCH).state == "off"


async def test_manual_school_mode_is_not_stopped_by_pronote(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock, make_entry(hass, **{CONF_PRONOTE: {data.CHILD: PRONOTE}}))
    await hass.services.async_call("switch", "turn_on", {"entity_id": SWITCH}, blocking=True)
    await entry.runtime_data.school.async_check_pronote()  # no lesson today
    assert hass.states.get(SWITCH).state == "on"


async def test_new_entities(hass: HomeAssistant, aioclient_mock) -> None:
    await setup(hass, aioclient_mock)
    assert hass.states.get("binary_sensor.pixel_8_daily_limit_reached").state == "off"
    assert hass.states.get("binary_sensor.pixel_8_bedtime").state in ("on", "off")
    assert hass.states.get("sensor.pixel_8_daily_limit").state == "120"
    assert hass.states.get("sensor.pixel_8_bonus").state == "0"
    assert hass.states.get("sensor.alex_limited_apps").attributes["apps"] == ["YouTube"]
    assert hass.states.get("sensor.alex_always_allowed_apps").state == "1"
    assert hass.states.get("sensor.pixel_8_next_restriction") is not None
    await hass.services.async_call("button", "press", {"entity_id": "button.pixel_8_add_30_min"}, blocking=True)
    body = next(json.loads(c[2]) for c in aioclient_mock.mock_calls if "batchCreate" in str(c[1]))
    assert body[2][0][13] == [["1800", 0]]


async def test_actions_target_home_assistant_devices(hass: HomeAssistant, aioclient_mock) -> None:
    entry = await setup(hass, aioclient_mock)
    registry = dr.async_get(hass)
    child_device = entry.runtime_data.child_device_ids[data.CHILD]
    phone = next(
        d.id
        for d in dr.async_entries_for_config_entry(registry, entry.entry_id)
        if (DOMAIN, data.PHONE) in d.identifiers
    )
    await hass.services.async_call(DOMAIN, "lock", {"child": child_device, "device": phone}, blocking=True)
    assert hass.states.get("switch.pixel_8_lock").state == "on"
    await hass.services.async_call(DOMAIN, "ring", {"child": phone, "device": phone}, blocking=True)  # child from phone

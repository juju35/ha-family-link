"""Parsers of the API answers: captured shapes, and tolerance to unexpected ones."""

from __future__ import annotations

from datetime import datetime

import pytest
from homeassistant.util import dt as dt_util

from custom_components.family_link.models import (
    parse_applied_limits,
    parse_apps_usage,
    parse_location,
    parse_members,
    parse_my_email,
)

from . import data


def test_members() -> None:
    members = parse_members(data.members())
    child = next(m for m in members if m.supervised)
    assert child.user_id == data.CHILD
    assert child.name == "Alex" and child.photo == "https://example.com/alex.png"
    assert parse_my_email(data.members()) == "parent@example.com"
    assert parse_members(None) == [] and parse_members({"members": [None, {}]}) == []


def test_apps_usage() -> None:
    now = dt_util.now()
    usage = parse_apps_usage(data.apps_usage(now), now.date())
    assert set(usage.devices) == {data.PHONE, data.TABLET}
    assert usage.devices[data.PHONE].kind == "phone"
    assert usage.devices[data.TABLET].kind == "tablet"
    assert usage.apps["com.google.android.youtube"].limit_minutes == 60
    assert usage.apps["com.duolingo"].always_allowed is True
    assert usage.apps["com.blocked.game"].blocked is True
    assert round(usage.today_by_app["com.mojang.minecraftpe"]) == 2460
    # A session without device goes to the only device of its app
    assert usage.today_by_device[data.TABLET]["com.duolingo"] == 1020
    assert round(sum(usage.today_by_device[data.PHONE].values()) / 60) == 79
    assert len(usage.week) == 7 and usage.week[-1][0] == now.date().isoformat()


def test_apps_usage_tolerates_garbage() -> None:
    today = dt_util.now().date()
    assert parse_apps_usage("nope", today).apps == {}
    garbage = {"deviceInfo": [None, {"deviceId": "x"}], "apps": [1], "appUsageSessions": [{"date": {"year": "x"}}]}
    usage = parse_apps_usage(garbage, today)
    assert list(usage.devices) == ["x"]


def test_applied_limits_daily_limit_and_windows() -> None:
    now = dt_util.now().replace(hour=17, minute=40)
    limits = parse_applied_limits(data.applied_limits(now), now)
    phone = limits[data.PHONE]
    assert phone.locked is False
    assert phone.used_minutes == 102
    assert phone.daily_limit_enabled is True and phone.daily_limit_minutes == 120
    assert phone.remaining_minutes == 18
    assert phone.bedtime is not None and phone.bedtime.active is False
    assert phone.bedtime.start.hour == 21 and phone.bedtime.end.day != phone.bedtime.start.day
    assert phone.schooltime is not None and phone.schooltime.active is False
    assert phone.restricted_now is None
    tablet = limits[data.TABLET]
    assert tablet.locked is True and tablet.override_by == "998877"
    assert tablet.daily_limit_enabled is False and tablet.remaining_minutes is None
    assert tablet.restricted_now == "locked"


def test_applied_limits_bonus_replaces_the_quota() -> None:
    now = dt_util.now().replace(hour=17, minute=40)
    phone = parse_applied_limits(data.applied_limits(now, bonus=True), now)[data.PHONE]
    assert phone.bonus_override_id == data.BONUS_ID
    assert phone.bonus_minutes == 30
    assert phone.bonus_remaining_minutes == 22
    assert phone.remaining_minutes == 22


@pytest.mark.parametrize(("hour", "active"), [(22, True), (6, True), (12, False)])
def test_bedtime_window_across_midnight(hour: int, active: bool) -> None:
    now = dt_util.now().replace(hour=hour, minute=0)
    phone = parse_applied_limits(data.applied_limits(now), now)[data.PHONE]
    assert phone.bedtime.active is active
    if active:
        assert phone.restricted_now == "bedtime"


def test_school_time_active() -> None:
    now = dt_util.now().replace(hour=10, minute=0)
    phone = parse_applied_limits(data.applied_limits(now), now)[data.PHONE]
    assert phone.restricted_now == "schooltime"


def test_applied_limits_tolerates_garbage() -> None:
    now = dt_util.now()
    assert parse_applied_limits(None, now) == {}
    assert parse_applied_limits([None, [[1, 2], "x", [None] * 30]], now) == {}


def test_location() -> None:
    location = parse_location(data.location())
    assert location.latitude == pytest.approx(48.1117)
    assert location.place_name == "Home" and location.battery == 64
    assert location.source_device_id == data.PHONE
    assert isinstance(location.timestamp, datetime)
    assert parse_location([[None], [data.CHILD, 2]]) is None
    assert parse_location(None) is None

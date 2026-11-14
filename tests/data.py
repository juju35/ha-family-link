"""Answers of the kidsmanagement API, in the shapes captured from the Family Link web app (values made up)."""

from __future__ import annotations

import time
from datetime import datetime

from homeassistant.util import dt as dt_util

BASE = "https://kidsmanagement-pa.clients6.google.com/kidsmanagement/v1"
CHILD = "112233445566"
PHONE = "AbCdEfGhIjKlMnOpQrStUvWxYz0123456789abcdefgh"  # 44 chars, like Android ids
TABLET = "ZyXwVuTsRqPoNmLkJiHgFeDcBa9876543210zyxwvuts"
BONUS_ID = "0b9c2f4e-1a2b-4c3d-8e9f-001122334455"

COOKIES = (
    "SID=sid-value; HSID=hsid; SSID=ssid; APISID=apisid/x; SAPISID=sapisid/abc; "
    "__Secure-1PAPISID=sapisid/abc; __Secure-3PAPISID=sapisid/abc; __Secure-1PSID=psid1; __Secure-3PSID=psid3; "
    "__Secure-1PSIDTS=sidts-old"
)


def members() -> dict:
    return {
        "apiHeader": {"serverTimestampMillis": "1"},
        "myUserId": "998877",
        "members": [
            {
                "userId": "998877",
                "role": "headOfHousehold",
                "profile": {"displayName": "Parent", "email": "parent@example.com", "givenName": "Parent"},
                "memberSupervisionInfo": {"isSupervisedMember": False, "isGuardianLinkedAccount": False},
            },
            {
                "userId": CHILD,
                "role": "member",
                "profile": {
                    "displayName": "Alex",
                    "givenName": "Alex",
                    "email": "alex@example.com",
                    "profileImageUrl": "https://example.com/alex.png",
                },
                "memberSupervisionInfo": {"isSupervisedMember": True, "isGuardianLinkedAccount": True},
            },
        ],
    }


def _session(package: str, seconds: float, device: str | None, day: datetime) -> dict:
    session = {
        "usage": f"{seconds}s",
        "appId": {"androidAppPackageName": package},
        "modeType": "MODE_TYPE_UNSPECIFIED",
        "date": {"year": day.year, "month": day.month, "day": day.day},
    }
    if device:
        session["deviceMudId"] = device
    return session


def apps_usage(now: datetime | None = None) -> dict:
    now = now or dt_util.now()
    active = str(int(time.time() * 1000) - 120_000)
    return {
        "apiHeader": {"serverTimestampMillis": "1"},
        "deviceInfo": [
            {
                "deviceId": PHONE,
                "displayInfo": {"model": "Pixel 8", "friendlyName": "Pixel 8", "lastActivityTimeMillis": active},
                "capabilityInfo": {"capabilities": ["capabilityRing", "capabilityLockDevice"]},
            },
            {
                "deviceId": TABLET,
                "displayInfo": {"model": "Galaxy Tab A9", "friendlyName": "Tab A9", "lastActivityTimeMillis": active},
                "capabilityInfo": {"capabilities": ["capabilityRing"]},
            },
        ],
        "apps": [
            {
                "packageName": "com.google.android.youtube",
                "title": "YouTube",
                "iconUrl": "https://example.com/yt.png",
                "supervisionSetting": {"usageLimit": {"dailyUsageLimitMins": 60, "enabled": True}},
                "deviceIds": [PHONE],
            },
            {
                "packageName": "com.mojang.minecraftpe",
                "title": "Minecraft",
                "supervisionSetting": {},
                "deviceIds": [PHONE, TABLET],
            },
            {
                "packageName": "com.duolingo",
                "title": "Duolingo",
                "supervisionSetting": {"alwaysAllowedAppInfo": {"alwaysAllowedState": "alwaysAllowedStateEnabled"}},
                "deviceIds": [TABLET],
            },
            {"packageName": "com.blocked.game", "title": "Blocked game", "supervisionSetting": {"hidden": True}},
        ],
        "appUsageSessions": [
            _session("com.google.android.youtube", 2880.5, PHONE, now),
            _session("com.mojang.minecraftpe", 1860, PHONE, now),
            _session("com.mojang.minecraftpe", 600, TABLET, now),
            _session("com.duolingo", 1020, None, now),  # no device: the only device of the app
            _session("com.google.android.youtube", 3600, PHONE, now.replace(day=max(1, now.day - 1))),
        ],
    }


def applied_limits(now: datetime | None = None, *, bonus: bool = False, tablet_locked: bool = True) -> list:
    now = now or dt_util.now()
    day = now.isoweekday()
    phone_override = [BONUS_ID, None, 10, PHONE, *([None] * 9), [["1800", 0]]] if bonus else None
    phone = [None] * 26
    phone[0] = phone_override
    phone[2] = ["CAEQBg", day, 2, 120, "1700000000000", "1700000000000"]
    phone[4] = ["CAEQAg", day, 2, [21, 0], [7, 0], "1", "2", "487088e7-38b4-4f18-a5fb-4aab64ba9d2f"]
    phone[6] = ["CAMQAiIk", day, 2, [8, 30], [16, 30], "1", "2", "579e5e01-8dfd-42f3-be6b-d77984842202"]
    phone[19] = "1320000" if bonus else None
    phone[20] = "6120000"  # 102 min
    phone[25] = PHONE
    tablet = [None] * 26
    tablet[0] = [None, None, 7, TABLET, None, None, None, None, "998877"] if tablet_locked else None
    tablet[3] = ["CAEQBg", day, 1, 90, "1", "2"]  # limit off today
    tablet[20] = "3000000"
    tablet[25] = TABLET
    return [[None, "1"], [phone, tablet]]


def location() -> list:
    stamp = str(int(time.time() * 1000) - 300_000)
    return [
        [None, "1"],
        [
            CHILD,
            1,
            [[48.1117, -1.6800], stamp, 12, None, ["place-1", "Home", "1 rue de Rennes"], None, PHONE, None, [64, 1]],
        ],
    ]


def mock_api(aioclient_mock, *, bonus: bool = False, tablet_locked: bool = True, location_status: int = 200) -> None:
    aioclient_mock.get(f"{BASE}/families/mine/members", json=members())
    aioclient_mock.get(f"{BASE}/people/{CHILD}/appsandusage", json=apps_usage())
    aioclient_mock.get(
        f"{BASE}/people/{CHILD}/appliedTimeLimits", json=applied_limits(bonus=bonus, tablet_locked=tablet_locked)
    )
    if location_status == 200:
        aioclient_mock.get(f"{BASE}/families/mine/location/{CHILD}", json=location())
    else:
        aioclient_mock.get(f"{BASE}/families/mine/location/{CHILD}", status=location_status)
    aioclient_mock.post(f"{BASE}/people/{CHILD}/timeLimitOverrides:batchCreate", json=[[None, "1"], [[BONUS_ID]]])
    aioclient_mock.post(f"{BASE}/people/{CHILD}/timeLimitOverride/{BONUS_ID}", json=[])
    aioclient_mock.post(f"{BASE}/people/{CHILD}/devices/{PHONE}:executeRemoteAction", json=[])
    aioclient_mock.post(f"{BASE}/people/{CHILD}/apps:updateRestrictions", json=[])
    aioclient_mock.post("https://accounts.google.com/RotateCookies", text="")

"""Family Link data and the parsers of the kidsmanagement API answers.

Parsers never raise on an unexpected shape: a missing field gives a default value, so a change on Google's side
degrades one figure instead of failing the whole update. They are pure functions, tested on captured answers.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from typing import Any

from homeassistant.util import dt as dt_util

UUID_LEN = 36

# Override codes of timeLimitOverrides (lock row of appliedTimeLimits)
OVERRIDE_LOCK = 1  # lock, emergency calls only
OVERRIDE_UNLOCK_BEDTIME = 3
OVERRIDE_UNLOCK = 4
OVERRIDE_BONUS_CHROMEOS = 6
OVERRIDE_LOCK_ALLOWED_APPS = 7  # lock that keeps the "always allowed" apps reachable
OVERRIDE_BONUS = 10
LOCK_CODES = (OVERRIDE_LOCK, OVERRIDE_LOCK_ALLOWED_APPS)
BONUS_CODES = (OVERRIDE_BONUS, OVERRIDE_BONUS_CHROMEOS)

# Window rows: [key, day, state, [h, m], [h, m], created, updated, policy]; typed section codes
WINDOW_TYPES = {1: "bedtime", 2: "schooltime"}
STATE_ENABLED = 2
CHROMEOS_ID_MIN_LEN = 60


@dataclass
class Member:
    user_id: str
    name: str
    given_name: str = ""
    email: str = ""
    photo: str | None = None
    supervised: bool = False
    role: str = ""


@dataclass
class Device:
    device_id: str
    name: str
    model: str = ""
    last_activity: datetime | None = None
    capabilities: list[str] = field(default_factory=list)

    @property
    def kind(self) -> str:
        """phone, tablet or computer, guessed from the model (the API does not say)."""
        text = f"{self.model} {self.name}".lower()
        if len(self.device_id) >= CHROMEOS_ID_MIN_LEN or "chromebook" in text or "chrome os" in text:
            return "computer"
        if any(word in text for word in ("tab", "pad", "lenovo m", "fire", "kindle", "slate")):
            return "tablet"
        return "phone"


@dataclass
class App:
    package: str
    title: str
    icon_url: str | None = None
    blocked: bool = False
    always_allowed: bool = False
    limit_minutes: int | None = None
    device_ids: list[str] = field(default_factory=list)


@dataclass
class AppsUsage:
    apps: dict[str, App] = field(default_factory=dict)
    devices: dict[str, Device] = field(default_factory=dict)
    # Seconds used today, per app and per device
    today_by_app: dict[str, float] = field(default_factory=dict)
    today_by_device: dict[str, dict[str, float]] = field(default_factory=dict)
    # Seconds per day over the last week (oldest first), for the week bars of the card
    week: list[tuple[str, float]] = field(default_factory=list)


@dataclass
class Window:
    start: datetime
    end: datetime
    active: bool


@dataclass
class DeviceLimits:
    device_id: str
    locked: bool = False
    override: int | None = None
    override_by: str | None = None
    used_minutes: int = 0
    daily_limit_enabled: bool | None = None
    daily_limit_minutes: int | None = None
    bonus_minutes: int = 0
    bonus_remaining_minutes: int | None = None
    bonus_override_id: str | None = None
    bedtime: Window | None = None
    schooltime: Window | None = None

    @property
    def remaining_minutes(self) -> int | None:
        """Time left today: the bonus replaces the daily quota while it runs (that is how Family Link counts)."""
        if self.bonus_override_id and self.bonus_minutes:
            return self.bonus_remaining_minutes if self.bonus_remaining_minutes is not None else self.bonus_minutes
        if self.daily_limit_enabled and self.daily_limit_minutes is not None:
            return max(0, self.daily_limit_minutes - self.used_minutes)
        return None

    @property
    def limit_reached(self) -> bool:
        """The daily quota is used up (a running bonus doesn't change it)."""
        return bool(
            self.daily_limit_enabled
            and self.daily_limit_minutes is not None
            and self.used_minutes >= self.daily_limit_minutes
        )

    def next_restriction(self, now: datetime) -> tuple[str, datetime] | None:
        """The next bedtime or school time still to start today: (kind, start)."""
        upcoming = [
            (kind, window.start)
            for kind, window in (("bedtime", self.bedtime), ("schooltime", self.schooltime))
            if window and not window.active and window.start > now
        ]
        return min(upcoming, key=lambda item: item[1]) if upcoming else None

    @property
    def restricted_now(self) -> str | None:
        """Why the device is blocked right now, if it is: locked, bedtime, schooltime or limit."""
        if self.locked:
            return "locked"
        if self.override == OVERRIDE_UNLOCK:
            return None
        if self.bedtime and self.bedtime.active:
            return "bedtime"
        if self.schooltime and self.schooltime.active:
            return "schooltime"
        if self.remaining_minutes == 0 and not self.bonus_override_id:
            return "limit"
        return None


@dataclass
class Location:
    latitude: float
    longitude: float
    accuracy: int | None = None
    timestamp: datetime | None = None
    place_id: str | None = None
    place_name: str | None = None
    place_address: str | None = None
    source_device_id: str | None = None
    battery: int | None = None


# ── Members ─────────────────────────────────────────────────────────────────


def parse_members(data: Any) -> list[Member]:
    members = []
    for item in (data or {}).get("members", []) if isinstance(data, dict) else []:
        if not isinstance(item, dict) or not item.get("userId"):
            continue
        profile = item.get("profile") or {}
        info = item.get("memberSupervisionInfo") or {}
        members.append(
            Member(
                user_id=str(item["userId"]),
                name=profile.get("displayName") or profile.get("givenName") or str(item["userId"]),
                given_name=profile.get("givenName") or "",
                email=profile.get("email") or "",
                photo=profile.get("profileImageUrl") or None,
                supervised=bool(info.get("isSupervisedMember")),
                role=str(item.get("role") or ""),
            )
        )
    return members


def parse_my_email(data: Any) -> str | None:
    """E-mail of the signed-in parent, from the members answer (myUserId)."""
    if not isinstance(data, dict):
        return None
    me = data.get("myUserId")
    for item in data.get("members", []):
        if isinstance(item, dict) and item.get("userId") == me:
            return (item.get("profile") or {}).get("email")
    return None


# ── Apps and usage ─────────────────────────────────────────────────────────


def _seconds(value: Any) -> float:
    try:
        return float(str(value).rstrip("s"))
    except (TypeError, ValueError):
        return 0.0


def _millis(value: Any) -> datetime | None:
    try:
        millis = int(value)
    except (TypeError, ValueError):
        return None
    if millis <= 0:
        return None
    return dt_util.utc_from_timestamp(millis / 1000)


def parse_apps_usage(data: Any, today: date) -> AppsUsage:
    result = AppsUsage()
    if not isinstance(data, dict):
        return result
    for item in data.get("deviceInfo") or []:
        if not isinstance(item, dict) or not item.get("deviceId"):
            continue
        display = item.get("displayInfo") or {}
        device_id = str(item["deviceId"])
        result.devices[device_id] = Device(
            device_id=device_id,
            name=display.get("friendlyName") or display.get("model") or device_id[:8],
            model=display.get("model") or "",
            last_activity=_millis(display.get("lastActivityTimeMillis")),
            capabilities=list((item.get("capabilityInfo") or {}).get("capabilities") or []),
        )
    for item in data.get("apps") or []:
        if not isinstance(item, dict) or not item.get("packageName"):
            continue
        setting = item.get("supervisionSetting") or {}
        limit = setting.get("usageLimit") or {}
        allowed = (setting.get("alwaysAllowedAppInfo") or {}).get("alwaysAllowedState") == "alwaysAllowedStateEnabled"
        package = str(item["packageName"])
        result.apps[package] = App(
            package=package,
            title=item.get("title") or package,
            icon_url=item.get("iconUrl") or None,
            blocked=bool(setting.get("hidden")),
            always_allowed=allowed,
            limit_minutes=int(limit["dailyUsageLimitMins"])
            if limit.get("enabled") and isinstance(limit.get("dailyUsageLimitMins"), int)
            else None,
            device_ids=[str(d) for d in item.get("deviceIds") or []],
        )
    # Usage sessions: one entry per app, device and day
    week_start = today - timedelta(days=6)
    per_day: dict[date, float] = {week_start + timedelta(days=i): 0.0 for i in range(7)}
    single_device = next(iter(result.devices)) if len(result.devices) == 1 else None
    for session in data.get("appUsageSessions") or []:
        if not isinstance(session, dict):
            continue
        day_data = session.get("date") or {}
        try:
            day = date(int(day_data["year"]), int(day_data["month"]), int(day_data["day"]))
        except (KeyError, TypeError, ValueError):
            continue
        seconds = _seconds(session.get("usage"))
        if day in per_day:
            per_day[day] += seconds
        if day != today:
            continue
        package = str((session.get("appId") or {}).get("androidAppPackageName") or "unknown")
        result.today_by_app[package] = result.today_by_app.get(package, 0.0) + seconds
        device_id = session.get("deviceMudId")
        if not device_id:
            app = result.apps.get(package)
            device_id = app.device_ids[0] if app and len(app.device_ids) == 1 else single_device
        if device_id:
            by_app = result.today_by_device.setdefault(str(device_id), {})
            by_app[package] = by_app.get(package, 0.0) + seconds
    result.week = [(day.isoformat(), seconds) for day, seconds in sorted(per_day.items())]
    return result


# ── Applied time limits ────────────────────────────────────────────────────


def _int(value: Any) -> int | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, str) and value.isdigit():
        return int(value)
    return None


def _hm(value: Any) -> tuple[int, int] | None:
    if isinstance(value, list) and len(value) == 2 and all(type(v) is int for v in value):
        return value[0], value[1]
    return None


def _typed_windows(block: Any) -> dict[str, str]:
    """Google's own typing of the window rows: [[row, 4, type], ...] with type 1 bedtime, 2 school time."""
    found: dict[str, str] = {}

    def walk(value: Any, depth: int) -> None:
        if depth > 6 or not isinstance(value, list):
            return
        if (
            len(value) == 3
            and isinstance(value[0], list)
            and len(value[0]) >= 5
            and isinstance(value[0][0], str)
            and isinstance(value[2], int)
            and value[2] in WINDOW_TYPES
        ):
            found[value[0][0]] = WINDOW_TYPES[value[2]]
            return
        for child in value:
            walk(child, depth + 1)

    walk(block, 0)
    return found


def _window_kind(row: list, typed: dict[str, str]) -> str:
    key = row[0]
    if key in typed:
        return typed[key]
    if key.startswith("CAEQ"):
        return "bedtime"
    if key.startswith("CAMQ"):
        return "schooltime"
    start, end = _hm(row[3]), _hm(row[4])
    if start and end and (end < start or start[0] >= 18):
        return "bedtime"
    return "schooltime"


def _window(row: list, now: datetime) -> Window | None:
    """The occurrence of a window row that matters now (today's, or last night's still running)."""
    start_hm, end_hm = _hm(row[3]), _hm(row[4])
    day = row[1]
    if not start_hm or not end_hm or not isinstance(day, int):
        return None
    today = now.isoweekday()
    yesterday = (today - 2) % 7 + 1
    start = now.replace(hour=start_hm[0], minute=start_hm[1], second=0, microsecond=0)
    end = now.replace(hour=end_hm[0], minute=end_hm[1], second=0, microsecond=0)
    crosses = end_hm <= start_hm
    if day == yesterday:
        if not crosses or now >= end:
            return None
        return Window(start - timedelta(days=1), end, True)
    if day != today:
        return None
    if crosses:
        if now < end:  # morning: the window started yesterday evening
            return Window(start - timedelta(days=1), end, True)
        return Window(start, end + timedelta(days=1), now >= start)
    return Window(start, end, start <= now < end)


def parse_applied_limits(data: Any, now: datetime) -> dict[str, DeviceLimits]:
    devices: dict[str, DeviceLimits] = {}
    if not isinstance(data, list) or len(data) < 2 or not isinstance(data[1], list):
        return devices
    today = now.isoweekday()
    for block in data[1]:
        if not isinstance(block, list) or len(block) < 21:
            continue
        override = block[0] if isinstance(block[0], list) else None
        device_id = None
        if override and len(override) > 3 and isinstance(override[3], str):
            device_id = override[3]
        elif len(block) > 25 and isinstance(block[25], str):
            device_id = block[25]
        if not device_id:
            continue
        limits = DeviceLimits(device_id=device_id)
        if override and len(override) > 2:
            code = _int(override[2])
            limits.override = code
            limits.locked = code in LOCK_CODES
            if len(override) > 8 and isinstance(override[8], str):
                limits.override_by = override[8]
            if code in BONUS_CODES:
                limits.bonus_override_id = override[0] if isinstance(override[0], str) else None
                seconds = None
                if code == OVERRIDE_BONUS and len(override) > 13:
                    try:
                        seconds = _int(override[13][0][0])
                    except (IndexError, TypeError):
                        seconds = None
                elif code == OVERRIDE_BONUS_CHROMEOS and len(override) > 10:
                    try:
                        millis = _int(override[10][0])
                        seconds = millis // 1000 if millis is not None else None
                    except (IndexError, TypeError):
                        seconds = None
                if seconds:
                    limits.bonus_minutes = seconds // 60
                remaining = _int(block[19])
                if remaining is not None:
                    limits.bonus_remaining_minutes = remaining // 60000
        used = _int(block[20])
        if used is not None:
            limits.used_minutes = used // 60000
        typed = _typed_windows(block)
        limit_priority = -1
        for index, row in enumerate(block):
            if not isinstance(row, list) or len(row) < 4 or not isinstance(row[0], str):
                continue
            key = row[0]
            if not (key.startswith(("CAEQ", "CAMQ")) or (len(key) == UUID_LEN and key.count("-") == 4)):
                continue
            if len(row) == 6:
                # Daily limit row: [key, day, state, minutes, created, updated]; the active one sits near the front
                day, state, minutes = row[1], row[2], row[3]
                if day == today and isinstance(state, int) and isinstance(minutes, int):
                    priority = 2 if index < 10 else 1
                    if priority >= limit_priority:
                        limit_priority = priority
                        limits.daily_limit_enabled = priority == 2 and state == STATE_ENABLED
                        limits.daily_limit_minutes = minutes
            elif len(row) == 8 and row[2] == STATE_ENABLED:
                window = _window(row, now)
                if window is None:
                    continue
                kind = _window_kind(row, typed)
                current = getattr(limits, kind)
                if current is None or (window.active and not current.active):
                    setattr(limits, kind, window)
        devices[device_id] = limits
    return devices


# ── Location ───────────────────────────────────────────────────────────────


def parse_location(data: Any) -> Location | None:
    """Location answer.

    [[null, ts], [child_id, status, [[lat, lng], ts, accuracy, ?, [place_id, name, address], ?, device, ?, [battery]]]]
    """
    try:
        block = data[1][2]
        coords = block[0]
        latitude, longitude = float(coords[0]), float(coords[1])
    except (IndexError, TypeError, ValueError):
        return None

    def at(index: int) -> Any:
        return block[index] if len(block) > index else None

    place = at(4) if isinstance(at(4), list) else []
    battery = at(8)[0] if isinstance(at(8), list) and at(8) else None
    return Location(
        latitude=latitude,
        longitude=longitude,
        accuracy=_int(at(2)) if not isinstance(at(2), float) else int(at(2)),
        timestamp=_millis(at(1)),
        place_id=place[0] if len(place) > 0 and isinstance(place[0], str) else None,
        place_name=place[1] if len(place) > 1 and isinstance(place[1], str) else None,
        place_address=place[2] if len(place) > 2 and isinstance(place[2], str) else None,
        source_device_id=at(6) if isinstance(at(6), str) else None,
        battery=_int(battery),
    )

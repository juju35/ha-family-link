"""Client of the kidsmanagement API used by the Family Link web app.

Reliability choices, compared with the clients this integration learned from:
- the Authorization header is signed again for every request (it carries a timestamp);
- transient failures (network, timeouts, HTTP 429 and 5xx) are retried with backoff, honoring Retry-After; an
  action (POST) is only retried when Google surely did not get it (no connection, HTTP 429), so a timeout after
  Google applied it never gives a bonus twice;
- the short-lived session cookies Google rotates are taken from every answer and refreshed on a schedule
  (RotateCookies, what the browser does), so the session lasts as long as in a browser;
- a 401 first tries a rotation and one more signed attempt before reporting that a new sign-in is needed;
- an own aiohttp session without cookie jar (see create_session): the cookies are sent as a raw header and the
  ones Google sets are kept here only, never in Home Assistant's shared session where other integrations calling
  google.com would send them.
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
from collections.abc import Callable
from datetime import date, datetime
from typing import Any

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_create_clientsession
from homeassistant.util import dt as dt_util

from .auth import ORIGIN, GoogleCookies
from .models import (
    CHROMEOS_ID_MIN_LEN,
    OVERRIDE_BONUS,
    OVERRIDE_BONUS_CHROMEOS,
    OVERRIDE_LOCK,
    OVERRIDE_LOCK_ALLOWED_APPS,
    OVERRIDE_UNLOCK,
    AppsUsage,
    DeviceLimits,
    Location,
    Member,
    parse_applied_limits,
    parse_apps_usage,
    parse_location,
    parse_members,
)

_LOGGER = logging.getLogger(__name__)

BASE_URL = "https://kidsmanagement-pa.clients6.google.com/kidsmanagement/v1"
ROTATE_URL = "https://accounts.google.com/RotateCookies"
# Public key of the Family Link web app (sent by every browser that opens familylink.google.com)
API_KEY = "AIzaSyAQb1gupaJhY3CXQy2xmTwJMcjmot3M2hw"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)
JSPB = "application/json+protobuf"

TIMEOUT = aiohttp.ClientTimeout(total=25, connect=10)
RETRIES = 3
BACKOFF = (1.0, 3.0, 8.0)
MAX_RETRY_AFTER = 30.0
# A rotation this recent already gave fresh cookies to the requests that waited for it
ROTATION_SHARED_SECONDS = 10
LOCATION_REFRESH = "2"
LOCATION_CACHED = "1"
RING_ACTION = 2
_ID_RE = re.compile(r"^[A-Za-z0-9_\-.:]{4,200}$")
_UUID_RE = re.compile(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")


class FamilyLinkError(Exception):
    """Any failure of the Family Link API."""


class AuthError(FamilyLinkError):
    """The Google session is no longer accepted: a new sign-in is needed."""


class TransientError(FamilyLinkError):
    """Network trouble, timeout, rate limit or server error: worth trying again later."""


class ApiError(FamilyLinkError):
    """The API refused the request (bad id, unsupported action...): trying again won't help."""

    def __init__(self, message: str, status: int | None = None) -> None:
        super().__init__(message)
        self.status = status


def create_session(hass: HomeAssistant, auto_cleanup: bool = True) -> aiohttp.ClientSession:
    """An aiohttp session of our own, without cookie jar: the Google cookies stay in GoogleCookies only."""
    return async_create_clientsession(hass, auto_cleanup=auto_cleanup, cookie_jar=aiohttp.DummyCookieJar())


def _check_id(value: str, what: str) -> str:
    if not isinstance(value, str) or not _ID_RE.match(value):
        raise ApiError(f"invalid {what}")
    return value


class FamilyLinkClient:
    """Calls of the Family Link API for one parent account."""

    def __init__(
        self,
        session: aiohttp.ClientSession,
        cookies: GoogleCookies,
        on_cookies_changed: Callable[[GoogleCookies], None] | None = None,
    ) -> None:
        self._session = session
        self.cookies = cookies
        self._on_cookies_changed = on_cookies_changed
        self._rotate_lock = asyncio.Lock()
        self.last_rotation: datetime | None = None

    def set_cookie_listener(self, listener: Callable[[GoogleCookies], None]) -> None:
        """Called with the cookies whenever Google rotated some of them (to save them)."""
        self._on_cookies_changed = listener

    # ── Transport ───────────────────────────────────────────────────────────

    def _headers(self, content_type: str) -> dict[str, str]:
        return {
            "User-Agent": USER_AGENT,
            "Origin": ORIGIN,
            "Referer": f"{ORIGIN}/",
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-AuthUser": "0",
            "Authorization": self.cookies.authorization(),
            "Cookie": self.cookies.header(),
            "Content-Type": content_type,
        }

    def _take_cookies(self, response: aiohttp.ClientResponse) -> None:
        if response.cookies and self.cookies.merge_set_cookies(response.cookies.items()):
            _LOGGER.debug("Google refreshed session cookies in an answer")
            if self._on_cookies_changed:
                self._on_cookies_changed(self.cookies)

    async def _request(
        self,
        method: str,
        path: str,
        *,
        params: list[tuple[str, str]] | None = None,
        payload: Any = None,
        content_type: str = JSPB,
    ) -> Any:
        url = f"{BASE_URL}/{path}"
        body = json.dumps(payload, separators=(",", ":")) if payload is not None else None
        auth_retry_done = False
        attempt = 0
        # An action may have been applied when its answer got lost: only retry it when Google surely didn't get it
        idempotent = method == "GET"
        while True:
            try:
                async with self._session.request(
                    method, url, params=params, data=body, headers=self._headers(content_type), timeout=TIMEOUT
                ) as response:
                    self._take_cookies(response)
                    status = response.status
                    text = await response.text()
                    if status == 200:
                        return json.loads(text) if text.strip() else None
                    if status in (401, 403) and _is_auth_failure(status, text):
                        if not auth_retry_done:
                            # A stale short-lived cookie or a clock skew: rotate, sign again, one more try.
                            auth_retry_done = True
                            await self.rotate_cookies(force=True)
                            continue
                        raise AuthError(f"HTTP {status}")
                    if status == 429 or status >= 500:
                        retry_after = _retry_after(response.headers.get("Retry-After"))
                        raise _Retry(f"HTTP {status}", status, retry_after)
                    if status == 404:
                        raise ApiError("not found", status)
                    raise ApiError(f"HTTP {status}: {_short(text)}", status)
            except _Retry as err:
                delay = err.retry_after
                failure: Exception = TransientError(str(err))
                retryable = idempotent or err.status == 429
            except (TimeoutError, aiohttp.ClientError) as err:
                delay = None
                failure = TransientError(f"{type(err).__name__}: {err}" if str(err) else type(err).__name__)
                retryable = idempotent or isinstance(err, aiohttp.ClientConnectorError)
            except ValueError as err:  # JSON
                raise ApiError(f"unreadable answer: {err}") from err
            if not retryable or attempt >= RETRIES - 1:
                raise failure
            wait = min(delay if delay is not None else BACKOFF[attempt], MAX_RETRY_AFTER)
            _LOGGER.debug("%s %s failed (%s), retry in %.0fs", method, path.split("/")[-1], failure, wait)
            attempt += 1
            await asyncio.sleep(wait)

    async def rotate_cookies(self, force: bool = False) -> bool:
        """Ask Google for fresh short-lived session cookies, as the browser does. Best effort.

        Returns True when new cookies came back. Several callers at once share one rotation: the requests
        refused together (a 401 for each section of each child) wait for the first one instead of rotating again.
        """
        async with self._rotate_lock:
            now = dt_util.utcnow()
            since = (now - self.last_rotation).total_seconds() if self.last_rotation else None
            if since is not None and since < (ROTATION_SHARED_SECONDS if force else 60):
                return False
            self.last_rotation = now
            try:
                async with self._session.post(
                    ROTATE_URL,
                    data='[000,"-0000000000000000000"]',
                    headers={
                        "User-Agent": USER_AGENT,
                        "Origin": "https://accounts.google.com",
                        "Content-Type": "application/json",
                        "Cookie": self.cookies.header(),
                    },
                    timeout=TIMEOUT,
                ) as response:
                    changed = bool(response.cookies) and self.cookies.merge_set_cookies(response.cookies.items())
                    _LOGGER.debug("Cookie rotation: HTTP %s, changed: %s", response.status, changed)
            except (TimeoutError, aiohttp.ClientError) as err:
                _LOGGER.debug("Cookie rotation failed: %s", err)
                return False
            if changed and self._on_cookies_changed:
                self._on_cookies_changed(self.cookies)
            return changed

    # ── Reads ───────────────────────────────────────────────────────────────

    async def get_members_raw(self) -> Any:
        return await self._request("GET", "families/mine/members", content_type="application/json")

    async def get_members(self) -> list[Member]:
        return parse_members(await self.get_members_raw())

    async def get_apps_usage(self, child_id: str, today: date) -> AppsUsage:
        data = await self._request(
            "GET",
            f"people/{_check_id(child_id, 'child id')}/appsandusage",
            params=[
                ("capabilities", "CAPABILITY_APP_USAGE_SESSION"),
                ("capabilities", "CAPABILITY_SUPERVISION_CAPABILITIES"),
            ],
            content_type="application/json",
        )
        return parse_apps_usage(data, today)

    async def get_applied_limits(self, child_id: str, now: datetime) -> dict[str, DeviceLimits]:
        data = await self._request(
            "GET",
            f"people/{_check_id(child_id, 'child id')}/appliedTimeLimits",
            params=[("capabilities", "TIME_LIMIT_CLIENT_CAPABILITY_SCHOOLTIME")],
        )
        return parse_applied_limits(data, now)

    async def get_location(self, child_id: str, refresh: bool = False) -> Location | None:
        """Last known location; refresh=True asks the device for a new fix (uses its battery)."""
        try:
            data = await self._request(
                "GET",
                f"families/mine/location/{_check_id(child_id, 'child id')}",
                params=[
                    ("locationRefreshMode", LOCATION_REFRESH if refresh else LOCATION_CACHED),
                    ("supportedConsents", "SUPERVISED_LOCATION_SHARING"),
                ],
            )
        except ApiError as err:
            if err.status in (400, 403, 404):
                return None  # sharing off or never located: no position, not an error
            raise
        return parse_location(data)

    # ── Actions ─────────────────────────────────────────────────────────────

    async def _override(self, child_id: str, override: list) -> Any:
        _check_id(child_id, "child id")
        return await self._request(
            "POST", f"people/{child_id}/timeLimitOverrides:batchCreate", payload=[None, child_id, [override], [1]]
        )

    async def lock(self, child_id: str, device_id: str, keep_allowed_apps: bool = True) -> None:
        code = OVERRIDE_LOCK_ALLOWED_APPS if keep_allowed_apps else OVERRIDE_LOCK
        await self._override(child_id, [None, None, code, _check_id(device_id, "device id")])

    async def unlock(self, child_id: str, device_id: str) -> None:
        await self._override(child_id, [None, None, OVERRIDE_UNLOCK, _check_id(device_id, "device id")])

    async def add_bonus(self, child_id: str, device_id: str, minutes: int) -> str | None:
        """Extra time for today; returns the id of the created override (to revoke it) when Google echoes it."""
        _check_id(device_id, "device id")
        seconds = int(minutes) * 60
        if len(device_id) >= CHROMEOS_ID_MIN_LEN:
            override = [None, None, OVERRIDE_BONUS_CHROMEOS, device_id, *([None] * 6), [str(seconds * 1000)]]
        else:
            override = [None, None, OVERRIDE_BONUS, device_id, *([None] * 9), [[str(seconds), 0]]]
        answer = await self._override(child_id, override)
        found = _UUID_RE.search(json.dumps(answer)) if answer is not None else None
        return found.group(0) if found else None

    async def revoke_bonus(self, child_id: str, override_id: str) -> None:
        _check_id(child_id, "child id")
        if not _UUID_RE.fullmatch(override_id or ""):
            raise ApiError("invalid bonus id")
        path = f"people/{child_id}/timeLimitOverride/{override_id}"
        await self._request("POST", path, params=[("$httpMethod", "DELETE")])

    async def ring(self, child_id: str, device_id: str) -> None:
        _check_id(child_id, "child id")
        _check_id(device_id, "device id")
        await self._request(
            "POST",
            f"people/{child_id}/devices/{device_id}:executeRemoteAction",
            payload=[None, child_id, device_id, [RING_ACTION, None, device_id, 0]],
        )

    async def set_app(self, child_id: str, package: str, mode: str, minutes: int | None = None) -> None:
        """mode: block, always_allow, limit (minutes per day) or default (no app-specific rule)."""
        await self.set_apps(child_id, [(package, mode, minutes)])

    async def set_apps(self, child_id: str, rules: list[tuple[str, str, int | None]]) -> None:
        """Several app rules in one request: (package, mode, minutes) as for set_app."""
        _check_id(child_id, "child id")
        if not rules:
            return
        payload = [_app_rule(package, mode, minutes) for package, mode, minutes in rules]
        await self._request("POST", f"people/{child_id}/apps:updateRestrictions", payload=[child_id, payload])


def _app_rule(package: str, mode: str, minutes: int | None) -> list:
    _check_id(package, "app")
    if mode == "block":
        return [[package], [1]]
    if mode == "always_allow":
        return [[package], None, None, [1]]
    if mode == "limit":
        if minutes is None or minutes < 0:
            raise ApiError("a limit needs minutes")
        return [[package], None, [int(minutes), 1]]
    if mode == "default":
        return [[package]]
    raise ApiError(f"unknown mode {mode}")


class _Retry(Exception):
    def __init__(self, message: str, status: int, retry_after: float | None) -> None:
        super().__init__(message)
        self.status = status
        self.retry_after = retry_after


def _retry_after(value: str | None) -> float | None:
    try:
        return max(0.0, float(value)) if value else None
    except ValueError:
        return None


def _is_auth_failure(status: int, text: str) -> bool:
    """401 always; 403 only when Google says the credentials are wrong (not a forbidden action)."""
    if status == 401:
        return True
    lowered = text.lower()
    return any(word in lowered for word in ("unauthenticated", "credential", "authentication", "login required"))


def _short(text: str) -> str:
    text = " ".join(text.split())
    return text[:160] + ("…" if len(text) > 160 else "")

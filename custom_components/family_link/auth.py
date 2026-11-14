"""Google session cookies: parsing, request signing and rotation bookkeeping.

Family Link has no public API: the web app (familylink.google.com) calls the kidsmanagement API with the
parent's Google session cookies and an ``Authorization`` header derived from them (SAPISIDHASH). The hash
carries a timestamp, so it is computed again for every request: a header built once goes stale after a while
and Google then answers 401, the main cause of the "session expired" errors of other clients.
"""

from __future__ import annotations

import hashlib
import json
import time
from collections.abc import Iterable
from dataclasses import dataclass, field
from http.cookies import Morsel
from typing import Any

ORIGIN = "https://familylink.google.com"

# Cookies the API needs to sign a request (the SID family identifies the session, sent with the rest).
SIGNING_COOKIES = ("SAPISID", "__Secure-1PAPISID", "__Secure-3PAPISID")

_HASH_NAMES = {"SAPISID": "SAPISIDHASH", "__Secure-1PAPISID": "SAPISID1PHASH", "__Secure-3PAPISID": "SAPISID3PHASH"}


class CookieFormatError(ValueError):
    """The pasted text holds no usable Google session cookie."""


@dataclass
class GoogleCookies:
    """The parent's google.com cookies, by name (one value each: the .google.com one wins)."""

    values: dict[str, str] = field(default_factory=dict)

    # ── Parsing ──────────────────────────────────────────────────────────────

    @classmethod
    def parse(cls, text: str) -> GoogleCookies:
        """Read cookies pasted from a browser: a JSON export, a Netscape cookies.txt or a Cookie header.

        Raises CookieFormatError when no signing cookie (SAPISID family) is found.
        """
        text = (text or "").strip()
        if not text:
            raise CookieFormatError("empty")
        entries: list[tuple[str, str, str]] = []
        if text[0] in "[{":
            entries = _parse_json(text)
        elif "\t" in text:
            entries = _parse_netscape(text)
        else:
            entries = _parse_header(text)
        cookies = cls.from_entries(entries)
        if not cookies.can_sign:
            raise CookieFormatError("no SAPISID")
        return cookies

    @classmethod
    def from_entries(cls, entries: Iterable[tuple[str, str, str]]) -> GoogleCookies:
        """Keep the google.com cookies; when a name exists for several domains, .google.com wins."""
        values: dict[str, str] = {}
        ranks: dict[str, int] = {}
        for name, raw, domain in entries:
            rank = _domain_rank(domain)
            if rank is None or not name or raw is None:
                continue
            if name not in ranks or rank < ranks[name]:
                values[name] = raw.strip().strip('"')
                ranks[name] = rank
        return cls(values)

    @classmethod
    def from_storage(cls, stored: Any) -> GoogleCookies:
        """Cookies saved in the config entry: {name: value}."""
        if isinstance(stored, dict):
            return cls({str(k): str(v) for k, v in stored.items() if v is not None})
        return cls()

    def to_storage(self) -> dict[str, str]:
        return dict(self.values)

    # ── Use ──────────────────────────────────────────────────────────────────

    @property
    def can_sign(self) -> bool:
        return any(self.values.get(name) for name in SIGNING_COOKIES)

    def header(self) -> str:
        """The Cookie header, values sent raw (aiohttp would quote values holding '/' or '=')."""
        return "; ".join(f"{name}={value}" for name, value in self.values.items())

    def authorization(self, origin: str = ORIGIN, now: float | None = None) -> str:
        """SAPISIDHASH (plus its 1P / 3P variants when the cookies exist), with a fresh timestamp."""
        timestamp = int(now if now is not None else time.time())
        parts = []
        for cookie, label in _HASH_NAMES.items():
            secret = self.values.get(cookie)
            if secret:
                parts.append(f"{label} {timestamp}_{_sha1(f'{timestamp} {secret} {origin}')}")
        if not parts:
            raise CookieFormatError("no SAPISID")
        return " ".join(parts)

    def merge_set_cookies(self, cookies: Iterable[tuple[str, Morsel]]) -> bool:
        """Take the cookies Google set in an answer, as (name, morsel) pairs. Returns True when a value changed."""
        changed = False
        for name, morsel in cookies:
            domain = morsel.get("domain") if isinstance(morsel, Morsel) else None
            if _domain_rank(domain or ".google.com") is None:
                continue
            value = morsel.value
            if not isinstance(value, str) or not value or (isinstance(morsel, Morsel) and morsel.get("max-age") == "0"):
                continue
            if self.values.get(name) != value:
                self.values[name] = value
                changed = True
        return changed

    def fingerprint(self) -> str:
        """Short id of the session (no secret in it), for diagnostics."""
        sid = self.values.get("__Secure-1PSID") or self.values.get("SID") or ""
        return _sha1(sid)[:8] if sid else "none"


def _sha1(text: str) -> str:
    return hashlib.sha1(text.encode("utf-8"), usedforsecurity=False).hexdigest()


def _domain_rank(domain: str | None) -> int | None:
    """0 for google.com, 1 for its subdomains used by the session; None for anything else (regional TLDs too)."""
    domain = (domain or ".google.com").lower().lstrip(".")
    if domain == "google.com":
        return 0
    if domain.endswith(".google.com"):
        return 1
    return None


def _parse_json(text: str) -> list[tuple[str, str, str]]:
    try:
        data = json.loads(text)
    except ValueError as err:
        raise CookieFormatError("invalid JSON") from err
    if isinstance(data, dict):
        # {"cookies": [...]} (Playwright storage state) or {name: value}
        if isinstance(data.get("cookies"), list):
            data = data["cookies"]
        else:
            return [(str(k), str(v), ".google.com") for k, v in data.items() if isinstance(v, str)]
    return [
        (str(item["name"]), str(item["value"]), str(item.get("domain") or ".google.com"))
        for item in (data if isinstance(data, list) else [])
        if isinstance(item, dict) and "name" in item and "value" in item
    ]


def _parse_netscape(text: str) -> list[tuple[str, str, str]]:
    entries = []
    for raw in text.splitlines():
        line = raw.strip()
        if line.startswith("#HttpOnly_"):
            line = line[len("#HttpOnly_") :]
        elif not line or line.startswith("#"):
            continue
        fields = line.split("\t")
        if len(fields) >= 7:
            entries.append((fields[5], fields[6], fields[0]))
    return entries


def _parse_header(text: str) -> list[tuple[str, str, str]]:
    if text.lower().startswith("cookie:"):
        text = text[len("cookie:") :]
    entries = []
    for part in text.replace("\n", ";").split(";"):
        name, sep, value = part.strip().partition("=")
        if sep and name:
            entries.append((name.strip(), value.strip(), ".google.com"))
    return entries

"""Cookie parsing and request signing."""

from __future__ import annotations

import hashlib
import json
from http.cookies import SimpleCookie

import pytest

from custom_components.family_link.auth import ORIGIN, CookieFormatError, GoogleCookies

from .data import COOKIES


def test_parse_header() -> None:
    cookies = GoogleCookies.parse(f"Cookie: {COOKIES}")
    assert cookies.can_sign
    assert cookies.values["APISID"] == "apisid/x"
    # Raw values, no quoting of '/'
    assert "SAPISID=sapisid/abc" in cookies.header()


def test_parse_json_export_prefers_google_com() -> None:
    export = [
        {"name": "SAPISID", "value": "regional", "domain": ".google.fr"},
        {"name": "SAPISID", "value": "main", "domain": ".google.com"},
        {"name": "SID", "value": "sid", "domain": ".google.com"},
        {"name": "OTHER", "value": "x", "domain": ".example.com"},
        {"name": "__Host-GAPS", "value": "gaps", "domain": "accounts.google.com"},
    ]
    cookies = GoogleCookies.parse(json.dumps(export))
    assert cookies.values["SAPISID"] == "main"
    assert "OTHER" not in cookies.values
    assert cookies.values["__Host-GAPS"] == "gaps"


def test_parse_playwright_and_dict() -> None:
    state = {"cookies": [{"name": "SAPISID", "value": "a", "domain": ".google.com"}]}
    assert GoogleCookies.parse(json.dumps(state)).values == {"SAPISID": "a"}
    assert GoogleCookies.parse('{"SAPISID": "b", "SID": "c"}').values == {"SAPISID": "b", "SID": "c"}


def test_parse_netscape() -> None:
    text = (
        "# Netscape HTTP Cookie File\n"
        "#HttpOnly_.google.com\tTRUE\t/\tTRUE\t0\tSID\tsid\n"
        ".google.com\tTRUE\t/\tTRUE\t0\tSAPISID\tsap\n"
    )
    cookies = GoogleCookies.parse(text)
    assert cookies.values == {"SID": "sid", "SAPISID": "sap"}


@pytest.mark.parametrize("text", ["", "SID=only", "not json {", "[1, 2]"])
def test_parse_rejects_without_sapisid(text: str) -> None:
    with pytest.raises(CookieFormatError):
        GoogleCookies.parse(text)


def test_authorization_is_signed_with_a_fresh_timestamp() -> None:
    cookies = GoogleCookies.parse(COOKIES)
    header = cookies.authorization(now=1_700_000_000)
    expected = hashlib.sha1(f"1700000000 sapisid/abc {ORIGIN}".encode()).hexdigest()
    assert header.split(" ")[:2] == ["SAPISIDHASH", f"1700000000_{expected}"]
    assert "SAPISID1PHASH" in header and "SAPISID3PHASH" in header
    assert cookies.authorization(now=1_700_000_100) != header


def test_merge_set_cookies() -> None:
    cookies = GoogleCookies.parse(COOKIES)
    jar = SimpleCookie()
    jar["__Secure-1PSIDTS"] = "sidts-new"
    jar["__Secure-1PSIDTS"]["domain"] = ".google.com"
    jar["gone"] = ""
    jar["elsewhere"] = "x"
    jar["elsewhere"]["domain"] = ".youtube.com"
    assert cookies.merge_set_cookies(jar.items()) is True
    assert cookies.values["__Secure-1PSIDTS"] == "sidts-new"
    assert "elsewhere" not in cookies.values
    assert cookies.merge_set_cookies(jar.items()) is False


def test_storage_round_trip_and_fingerprint() -> None:
    cookies = GoogleCookies.parse(COOKIES)
    again = GoogleCookies.from_storage(cookies.to_storage())
    assert again.values == cookies.values
    assert len(again.fingerprint()) == 8 and "psid1" not in again.fingerprint()
    assert GoogleCookies.from_storage(None).can_sign is False

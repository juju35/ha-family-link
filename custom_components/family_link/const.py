"""Constants of the Family Link integration."""

from __future__ import annotations

import re
from typing import Final

DOMAIN: Final = "family_link"
NAME: Final = "Family Link"

# Config entry data / options
CONF_COOKIES: Final = "cookies"  # list of {"name", "value", "domain"} kept up to date by the rotation
CONF_ACCOUNT: Final = "account"  # parent account e-mail, the unique id of the entry
# {"started": ISO, "renewed": ISO}: when the cookies were pasted, when Google last renewed __Secure-*PSIDTS
CONF_SESSION: Final = "session"
CONF_SCAN_INTERVAL: Final = "scan_interval"
CONF_LOCATION_INTERVAL: Final = "location_interval"
CONF_STALE_AFTER: Final = "stale_after"
CONF_NOTIFY_SERVICES: Final = "notify_services"  # child user id -> notify service, for the emergency message
CONF_PRONOTE: Final = "pronote_timetables"  # child user id -> Pronote "today's timetable" sensor, for the school mode
CONF_SCHOOL_APPS: Final = "school_mode_apps"  # packages left reachable by the school mode, on top of the essentials

DEFAULT_SCAN_INTERVAL: Final = 120  # seconds: screen time, locks, bonuses
DEFAULT_LOCATION_INTERVAL: Final = 300  # seconds: last known location (no refresh asked to the device)
DEFAULT_STALE_AFTER: Final = 3600  # seconds the cached data is shown after the last success before going unavailable
MEMBERS_INTERVAL: Final = 3600  # seconds: family members (children, names, photos) change rarely
# Seconds between two rotations of the short-lived session cookies (__Secure-*PSIDTS), as a browser left open does.
# Google asks for the next one in its RotateCookies answer (identity.hfcr, 600 s today): that value wins, bounded.
ROTATE_COOKIES_INTERVAL: Final = 10 * 60
ROTATE_COOKIES_MIN_INTERVAL: Final = 60
ROTATE_COOKIES_MAX_INTERVAL: Final = 3600

# Status of a child or a device (header icon color of the cards, enum sensor)
STATUS_TRACKED: Final = "tracked"
STATUS_ATTENTION: Final = "attention"
STATUS_LOCKED: Final = "locked"
STATUS_NOT_TRACKED: Final = "not_tracked"
STATUSES: Final = [STATUS_TRACKED, STATUS_ATTENTION, STATUS_LOCKED, STATUS_NOT_TRACKED]
STATUS_SEVERITY: Final = {STATUS_TRACKED: 0, STATUS_ATTENTION: 1, STATUS_LOCKED: 2, STATUS_NOT_TRACKED: 3}

LIMIT_SOON_MINUTES: Final = 15  # remaining time under which a device is in "attention"
LOCATION_FRESH_SECONDS: Final = 900  # a location under 15 min pulses on the card
LOCATION_OLD_SECONDS: Final = 3600  # a location over 1 h puts the child in "attention"
DEVICE_OFFLINE_SECONDS: Final = 24 * 3600  # no activity for a day: the device is "not tracked"

# Services
SERVICE_ADD_BONUS: Final = "add_bonus"
SERVICE_REVOKE_BONUS: Final = "revoke_bonus"
SERVICE_LOCK: Final = "lock"
SERVICE_UNLOCK: Final = "unlock"
SERVICE_RING: Final = "ring"
SERVICE_REFRESH_LOCATION: Final = "refresh_location"
SERVICE_SET_APP: Final = "set_app"
SERVICE_EMERGENCY: Final = "emergency"
SERVICE_REFRESH: Final = "refresh"
SERVICE_SCHOOL_MODE: Final = "school_mode"
SERVICE_SET_SCHEDULE: Final = "set_schedule"
SERVICE_SCHEDULE_TODAY: Final = "schedule_today"
SERVICE_SET_DAILY_LIMIT: Final = "set_daily_limit"

ATTR_CHILD: Final = "child"
ATTR_DEVICE: Final = "device"
ATTR_MINUTES: Final = "minutes"
ATTR_APP: Final = "app"
ATTR_MODE: Final = "mode"
ATTR_MESSAGE: Final = "message"
ATTR_RING: Final = "ring"
ATTR_NOTIFY_SERVICE: Final = "notify_service"
ATTR_REFRESH_LOCATION: Final = "refresh_location"
ATTR_ENABLE: Final = "enable"
ATTR_KIND: Final = "kind"
ATTR_DAYS: Final = "days"
ATTR_START: Final = "start"
ATTR_END: Final = "end"
ATTR_DEVICES: Final = "devices"

APP_MODES: Final = ["limit", "block", "always_allow", "default"]
# An Android package name (set_app with an app the child has not used yet, school mode options)
PACKAGE_RE: Final = re.compile(r"^[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)+$")
BONUS_PRESETS: Final = (15, 30, 60)  # minutes of the bonus buttons of each device

# School mode: every app blocked but these (and the apps the parent always allows), restored afterwards
SCHOOL_ESSENTIAL_APPS: Final = frozenset(
    {
        # Phone, messages, contacts
        "com.google.android.dialer",
        "com.android.dialer",
        "com.samsung.android.dialer",
        "com.android.phone",
        "com.google.android.apps.messaging",
        "com.android.mms",
        "com.samsung.android.messaging",
        "com.google.android.contacts",
        "com.android.contacts",
        "com.samsung.android.app.contacts",
        # Clock, calculator, calendar, camera, keyboard, settings
        "com.google.android.deskclock",
        "com.sec.android.app.clockpackage",
        "com.google.android.calculator",
        "com.sec.android.app.popupcalculator",
        "com.google.android.calendar",
        "com.samsung.android.calendar",
        "com.google.android.GoogleCamera",
        "com.sec.android.app.camera",
        "com.google.android.inputmethod.latin",
        "com.samsung.android.honeyboard",
        "com.android.settings",
        # Maps, Google Play services, Family Link, the Home Assistant app (emergency messages)
        "com.google.android.apps.maps",
        "com.google.android.gms",
        "com.google.android.apps.kids.familylinkhelper",
        "io.homeassistant.companion.android",
        "io.homeassistant.companion.android.minimal",
        # School apps
        "com.IndexEducation.Pronote",
        "com.google.android.apps.classroom",
        "com.google.android.apps.docs",
    }
)
PRONOTE_MARGIN_MINUTES: Final = 15  # the school mode starts this long before the first lesson of the day

# Frontend
FRONTEND_URL: Final = "/family_link_frontend"
CARD_FILENAME: Final = "family-link-card.js"

# Persistent notification shown while the Google session needs a new sign-in
REAUTH_NOTIFICATION_ID: Final = "family_link_reauth_{entry_id}"

# Events
EVENT_ACTION: Final = "family_link_action"

# Weekday names in entity names (the quota and hours of each day), by Home Assistant's language
WEEKDAY_NAMES: Final = {
    "en": ("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"),
    "fr": ("lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"),
    "de": ("Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"),
    "es": ("lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"),
    "sr": ("понедељак", "уторак", "среда", "четвртак", "петак", "субота", "недеља"),
    "sr-Latn": ("ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota", "nedelja"),
    "it": ("lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"),
    "nl": ("maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"),
    "pt": ("segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado", "domingo"),
    "pl": ("poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"),
    "ro": ("luni", "marți", "miercuri", "joi", "vineri", "sâmbătă", "duminică"),
    "da": ("mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"),
    "sv": ("måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"),
    "bg": ("понеделник", "вторник", "сряда", "четвъртък", "петък", "събота", "неделя"),
    "ru": ("понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"),
    "uk": ("понеділок", "вівторок", "середа", "четвер", "пʼятниця", "субота", "неділя"),
    "hu": ("hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat", "vasárnap"),
    "sk": ("pondelok", "utorok", "streda", "štvrtok", "piatok", "sobota", "nedeľa"),
    "cs": ("pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota", "neděle"),
    "sl": ("ponedeljek", "torek", "sreda", "četrtek", "petek", "sobota", "nedelja"),
    "lv": ("pirmdiena", "otrdiena", "trešdiena", "ceturtdiena", "piektdiena", "sestdiena", "svētdiena"),
    "el": ("Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο", "Κυριακή"),
}


def weekday_name(language: str | None, day: int) -> str:
    """Name of weekday 1 (Monday) … 7 in a Home Assistant language ("pt-BR" uses "pt")."""
    names = WEEKDAY_NAMES.get(language or "en") or WEEKDAY_NAMES.get((language or "en").split("-")[0])
    return (names or WEEKDAY_NAMES["en"])[day - 1]

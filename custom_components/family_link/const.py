"""Constants of the Family Link integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "family_link"
NAME: Final = "Family Link"

# Config entry data / options
CONF_COOKIES: Final = "cookies"  # list of {"name", "value", "domain"} kept up to date by the rotation
CONF_ACCOUNT: Final = "account"  # parent account e-mail, the unique id of the entry
CONF_SCAN_INTERVAL: Final = "scan_interval"
CONF_LOCATION_INTERVAL: Final = "location_interval"
CONF_STALE_AFTER: Final = "stale_after"
CONF_NOTIFY_SERVICES: Final = "notify_services"  # child user id -> notify service, for the emergency message

DEFAULT_SCAN_INTERVAL: Final = 120  # seconds: screen time, locks, bonuses
DEFAULT_LOCATION_INTERVAL: Final = 300  # seconds: last known location (no refresh asked to the device)
DEFAULT_STALE_AFTER: Final = 3600  # seconds the cached data is shown after the last success before going unavailable
MEMBERS_INTERVAL: Final = 3600  # seconds: family members (children, names, photos) change rarely
ROTATE_COOKIES_INTERVAL: Final = 6 * 3600  # seconds between two rotations of the short-lived session cookies

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

ATTR_CHILD: Final = "child"
ATTR_DEVICE: Final = "device"
ATTR_MINUTES: Final = "minutes"
ATTR_APP: Final = "app"
ATTR_MODE: Final = "mode"
ATTR_MESSAGE: Final = "message"
ATTR_RING: Final = "ring"
ATTR_NOTIFY_SERVICE: Final = "notify_service"
ATTR_REFRESH_LOCATION: Final = "refresh_location"

APP_MODES: Final = ["limit", "block", "always_allow", "default"]

# Frontend
FRONTEND_URL: Final = "/family_link_frontend"
CARD_FILENAME: Final = "family-link-card.js"

# Persistent notification shown while the Google session needs a new sign-in
REAUTH_NOTIFICATION_ID: Final = "family_link_reauth_{entry_id}"

# Events
EVENT_ACTION: Final = "family_link_action"

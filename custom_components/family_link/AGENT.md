# Family Link Integration — Agent Context

## Purpose
Home Assistant custom integration for Google Family Link (no public API: the kidsmanagement API of the
familylink.google.com web app, with the parent's Google cookies). Ships its own Lovelace cards
(`frontend/family-link-card.js`), served by the integration itself.

## Architecture

```
custom_components/family_link/
├── __init__.py        # Setup, child devices registered first (via_device), card registration, platforms
├── auth.py            # GoogleCookies: parse JSON / cookies.txt / Cookie header, SAPISIDHASH per request, Set-Cookie merge
├── api.py             # FamilyLinkClient: retries (429/5xx/timeouts, Retry-After), 401 → rotate + one more try → AuthError, actions
├── models.py          # Dataclasses + pure parsers of every answer (members, appsandusage, appliedTimeLimits, location)
├── coordinator.py     # One per parent account; children in parallel; cached data per section; reauth after 2 refusals
│                      # + persistent notification; cookie rotation schedule and debounced save; optimistic actions
├── card_data.py       # Attributes of the status sensor: everything the cards draw (not recorded)
├── sensor.py          # status (enum, card source), screen time, battery; per device: screen time, time left
├── switch.py          # lock per device
├── button.py          # ring per device, update location per child
├── device_tracker.py  # location per child (HA records the route the card draws)
├── services.py        # add_bonus, revoke_bonus, lock, unlock, ring, refresh_location, set_app, emergency, refresh
├── config_flow.py     # cookies; reauth; reconfigure; options (intervals, stale after, notify service per child)
├── diagnostics.py     # no cookies, names, e-mails, positions or device ids
└── frontend/family-link-card.js   # Vanilla JS cards (family-link-card, family-link-mini-card) + editor
```

## Notes
- Unique ids: `<child_id>_<key>` and `<child_id>_<device_id>_<key>`; services resolve a child from an entity by
  the unique id prefix.
- appliedTimeLimits rows: lock override at block[0] (codes 1/7 lock, 4 unlock, 10/6 bonus), used ms at [20],
  bonus remaining ms at [19], daily limit rows (6 items, active one at index < 10), window rows (8 items; typed
  section [row, 4, type], else CAEQ = bedtime, CAMQ = school time, else hours).
- A bonus replaces the daily quota while it runs (remaining = bonus remaining).
- Location refresh mode is numeric ("1" cached, "2" refresh).

# Changelog

## 1.0.0 (2026-11-14)

First release.

- **Integration**: one Home Assistant device per supervised child and per phone or tablet. Status (tracked, attention, locked, not tracked), screen time per child and per device, time left, battery, location tracker, lock switch, ring and location buttons.
- **Actions**: add a time bonus, revoke it, lock, unlock, ring, update the location, set an app rule (limit, block, always allow), emergency (ring through Family Link and critical notification through the Home Assistant app), refresh.
- **Reliability**: the Google session signs every request again and rotates its short-lived cookies by itself (saved in the config entry); transient errors are retried with backoff and the cached data stays shown, flagged stale, until the "keep cached data for" option runs out; a session Google refuses twice starts the re-authentication flow and shows a persistent notification, dismissed by the next successful update.
- **Cards**: `custom:family-link-card` with an animated phone or tablet (week screen time, apps, protection shield, lock dropping in), device chips for children with several devices, top apps, bonus band with revoke, add-time presets, lock / ring / locate / emergency, location popup with the route over the chosen period and a replay slider, emergency popup with quick replies; `custom:family-link-mini-card` compact view with a button to the full card.
- Diagnostics without cookies, names, e-mails or positions.
- English and French.

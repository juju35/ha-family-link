# Changelog

## 1.1.0 (2026-11-14)

- **School mode**: every app of a child blocked but the essential ones (phone, messages, maps, the Home Assistant app, Pronote, Classroom…), the ones listed in the options and the always allowed ones, in one request; their rules are saved (also across restarts) and put back afterwards. `switch.<child>_school_mode`, `family_link.school_mode` action, `school_mode_on` / `school_mode_off` events, and a school mode row with a switch in the card (a school cap after the child's name while it is on).
- **Driven by Pronote**: with the "today's timetable" sensor of the Pronote integration set for a child (suggested in the options), the school mode turns on 15 minutes before the first lesson of the day and off after the last one; canceled lessons don't count; turned off by hand, it waits for the next school day.
- **New entities**: bedtime, school time and daily limit reached binary sensors; daily limit, bonus and next restriction sensors per device; add 15 / 30 / 60 min buttons per device; blocked, limited and always allowed app counts per child, with the titles in an attribute.
- **Actions** take the Home Assistant device id of a child or of one of its phones as `child` and `device`.
## 1.0.0 (2026-11-14)

First release.

- **Integration**: one Home Assistant device per supervised child and per phone or tablet. Status (tracked, attention, locked, not tracked), screen time per child and per device, time left, battery, location tracker, lock switch, ring and location buttons.
- **Actions**: add a time bonus, revoke it, lock, unlock, ring, update the location, set an app rule (limit, block, always allow), emergency (ring through Family Link, every device of the child when none is given, and critical notification through the Home Assistant app), refresh. A child who leaves the family loses their devices in Home Assistant; old devices can be deleted by hand.
- **Reliability**: the Google session signs every request again and rotates its short-lived cookies by itself (saved in the config entry); transient errors are retried with backoff (an action only when Google surely did not get it, so a bonus is never given twice) and the cached data stays shown, flagged stale, until the "keep cached data for" option runs out; a session Google refuses twice starts the re-authentication flow and shows a persistent notification, dismissed by the next successful update. The Google cookies stay in the integration's own HTTP session, out of the one Home Assistant shares.
- **Cards**: `custom:family-link-card` with an animated phone or tablet (week screen time, apps, protection shield, lock dropping in), device chips for children with several devices, top apps, bonus band with revoke, add-time presets, lock / ring / locate / emergency, location popup with the route over the chosen period and a replay slider, emergency popup with quick replies; `custom:family-link-mini-card` compact view with a button to the full card.
- Diagnostics without cookies, names, e-mails or positions.
- Translations: English, French, German, Spanish, Serbian (Cyrillic and Latin), Italian, Dutch, Portuguese (also used for pt-BR), Polish, Romanian, Danish, Swedish, Bulgarian, Russian, Ukrainian, Hungarian, Slovak, Czech, Slovenian, Latvian and Greek.

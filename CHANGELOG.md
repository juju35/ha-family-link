# Changelog

## 1.2.0 - 2026-11-17

### Features

- **Illustrated header** on both cards (90 px, also on the mini card): the child's name and status line (time left, daily limit reached, bedtime, school time…) on the left, a shelf in the child's room on the right with the phone or tablet (apps while it runs, a lock, moon or school cap on a dark screen while it is restricted, a dimmed screen when it is not tracked) and an hourglass emptying with the time left, over a parquet strip. The round icon is coloured by the status (green tracked, amber attention, red locked, grey not tracked).
- **Night picture** after sunset (`sun.sun`) or with the dark theme, forced with `illustration_theme: day | night`; `illustration: false` keeps the classic header. Both options in the visual editor, in every language. Animations stop with `prefers-reduced-motion`.
- **Status pill on every header** (Tracked, Attention, Locked, Not tracked): a dot and the status right after the child's name, in the round icon's colour, on both cards and both headers; the subtitle no longer repeats it. It takes a line of its own under the subtitle when the title block is narrow, and only its dot stays when very narrow. The mini card's detail button is a 24 px round glass button in the top right corner.
- Night picture with the dark theme even while the sun is up (it used to wait for sunset when `sun.sun` exists).

### Documentation
- README: screenshots of the mini card expanded to the full card, dark and light.

## 1.1.0 (2026-11-14)

- **School mode**: every app of a child blocked but the essential ones (phone, messages, maps, the Home Assistant app, Pronote, Classroom…), the ones listed in the options and the always allowed ones, in one request; their rules are saved (also across restarts) and put back afterwards. `switch.<child>_school_mode`, `family_link.school_mode` action, `school_mode_on` / `school_mode_off` events, and a school mode row with a switch in the card (a school cap after the child's name while it is on).
- **Driven by Pronote**: with the "today's timetable" sensor of the Pronote integration set for a child (suggested in the options), the school mode turns on 15 minutes before the first lesson of the day and off after the last one; canceled lessons don't count; turned off by hand, it waits for the next school day.
- **Weekly schedule from Home Assistant**: bedtime, school time and daily limit switches (bedtime and school time change today too, as in the app); quota of each weekday (`number`); bedtime and school time hours of each weekday (`time`, disabled by default); who can call and text (`select`); `family_link.set_schedule`, `family_link.schedule_today` (tonight / today only) and `family_link.set_daily_limit` (weekly or today) actions. Schedule writes are retried on transient errors (setting a value twice changes nothing).
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

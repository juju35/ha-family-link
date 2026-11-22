# Changelog

## 1.2.5 - 2026-11-22

### Performance
- Card picker: the previews are back (`preview: true`), and light. Each card's preview is drawn only once it scrolls into view of Home Assistant's card picker, which otherwise builds the preview of every card at once: until then it holds Home Assistant's state (no render, no history request, no animation). On a dashboard or in the card editor the card is drawn as before.

## 1.2.4 - 2026-11-22

### Performance
- Card picker: the cards no longer ask Home Assistant for a live preview (`preview: false` in `window.customCards`). The picker drew every card at once (history requests, animations), which made the list slow to open; it now shows each card's description instead.

## 1.2.3 - 2026-11-21

### Fixes
- A session bound to its browser (Device Bound Session Credentials: Chrome and Edge on Windows) is now recognized: when Google refuses both the session and its cookie rotation, the *sign in again* notification and a warning in the log explain it and point to a Firefox private window; the diagnostics show the last rotation's HTTP status (#12).
- Setup: the sign-in steps (form and README) recommend a Firefox private window, closed without signing out, instead of a browser profile kept open (#12).

## 1.2.2 - 2026-11-20

### Fixes
- Entity icons: the screen time, blocked apps and always allowed apps sensors used icons that do not exist in Material Design Icons (`mdi:cellphone-clock`, `mdi:application-off`, `mdi:application-check`) and showed none; they now use `mdi:progress-clock`, `mdi:block-helper` and `mdi:check-circle-outline`.
- Emergency action: the notification service (option or `notify_service`) must be a `notify.*` service; any other service is refused instead of being called.
- A tap elsewhere on iOS (Safari and the companion app) now closes the card's popup and folds the expanded mini card: "elsewhere" is caught on the pointer press and release, not only on the click event, which iOS does not send for a tap on something that is not clickable.
- Visual editor: the entity picker offers the children's status sensors only, no longer every sensor of the integration (screen time, apps…).
- The re-render planned 20 s after *Ring* is cancelled when the card leaves the page.

### Performance
- Visual editor: the form gets new data only when the configuration changes, no longer on every state change of Home Assistant (ha-form re-rendered every field each time).

### Maintenance
- `package.json` carries the integration's version again (it was left at 1.2.0).
- Tests for the weekly bedtime / school time entities (value, unavailable without a slot, setting a start or an end).
- CI: pip downloads are cached; the branch cleanup recognises the commits of the `juju35-screenshots` app.

## 1.2.1 - 2026-11-18

### Fixes
- Illustrated header: `auto` now follows the Home Assistant theme alone — a light theme keeps the day picture after sunset, a dark theme still shows the night one.

## 1.2.0 - 2026-11-17

### Features

- **Illustrated header** on both cards (90 px, also on the mini card): the child's name and status line (time left, daily limit reached, bedtime, school time…) on the left, a shelf in the child's room on the right with the phone or tablet (apps while it runs, a lock, moon or school cap on a dark screen while it is restricted, a dimmed screen when it is not tracked) and an hourglass emptying with the time left, over a parquet strip. The round icon is coloured by the status (green tracked, amber attention, red locked, grey not tracked).
- **Night picture** after sunset (`sun.sun`) or with the dark theme, forced with `illustration_theme: day | night`; `illustration: false` keeps the classic header. Both options in the visual editor, in every language. Animations stop with `prefers-reduced-motion`.
- **Status pill on every header** (Tracked, Attention, Locked, Not tracked): a dot and the status right after the child's name, in the round icon's colour, on both cards and both headers; the subtitle no longer repeats it. It stays beside the name only when the whole name and its whole label fit there (measured, in every language), else it takes a line of its own under the subtitle (the subtitle then on one line); only its dot stays when its label does not fit there or above the floor, and on cards of 200 px or less. The mini card's detail button is a 24 px round glass button in the top right corner.
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

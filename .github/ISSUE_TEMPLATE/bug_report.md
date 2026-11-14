---
name: Bug report
about: Report a bug with the Family Link integration or its cards
title: "[Bug] "
labels: bug
assignees: ""
---

**Describe the bug**
A clear and concise description of what the bug is.

**To reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem (hide your children's names and locations).

**Environment:**
- Home Assistant version:
- Integration version:
- Browser:
- Devices supervised (phone, tablet, Chromebook):

**Diagnostics**
Download them from Settings → Devices & services → Family Link → ⋮ → Download diagnostics (cookies, names, e-mails and positions are removed). Never paste your cookies in an issue.

**Card configuration:**
```yaml
type: custom:family-link-card
entity: sensor.alex_status
```

**Additional context**
Add any other context about the problem here. Include browser console errors if available (F12 → Console).

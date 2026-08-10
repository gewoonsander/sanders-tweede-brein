---
name: feedback-todoist-taaklijst-format
description: Todoist-taken altijd tonen met letter-label (A)(B)(C) en als klikbare link naar de taak
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 184c54df-4dbc-422d-b055-c104702eb537
  modified: 2026-08-10T07:54:23.272Z
---

Bij het weergeven van Todoist-taken (bijv. in `/dagstart` stap 3, of elk ander taakoverzicht) altijd:
1. Een letter tussen haakjes ervoor, bijv. "(A)".
2. De taaknaam als klikbare link naar Todoist: `https://todoist.com/showTask?id=<taskId>`.

**Why:** Sander wil vanaf het overzicht direct kunnen doorklikken naar de taak in Todoist, en makkelijk kunnen verwijzen naar een specifieke taak via de letter. Bevestigd 2026-08-10 tijdens `/dagstart`.

**How to apply:** Geldt voor elk taakoverzicht met Todoist-taken, niet alleen `/dagstart`. Vergelijkbaar patroon als [[feedback_gmail_links]] (klikbare links per item) — bij gelegenheid combineren tot een algemene "altijd klikbare item-links" regel.

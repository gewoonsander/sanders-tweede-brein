---
name: feedback_sessietitel_bij_close_session
description: Bij close-session de sessietitel omzetten naar "YYYY-MM-DD HH:MM · onderwerp"
metadata:
  type: feedback
---

Werk bij elke close-session de titel van de sessie bij naar `YYYY-MM-DD HH:MM · <onderwerp>`, met de **starttijd** van de sessie (`createdAt` uit `get_session`), niet het afsluitmoment. Doe dit vóór de git-backupstap.

**Why:** De app geeft sessies zelf een titel zonder datum/tijd, waardoor Sanders zijbalk geen tijdlijn vormt. Op 2026-08-18 zijn 7 bestaande sessies met terugwerkende kracht omgezet naar dit formaat.

**How to apply:** Gebruik `mcp__ccd_session_mgmt__set_session_title`. Drie beperkingen: de lopende sessie kan niet door zichzelf hernoemd worden (meld de gewenste titel aan Sander of doe het vanuit een volgende sessie); titels die Sander zelf heeft gezet worden door de host bewaard en dus niet overschreven (meld dat en vraag of die alsnog om moet); zet nooit een duur in de titel, want aanmaaktijd en laatste activiteit zeggen niets over de werkelijke gesprekstijd. Zie ook [[feedback_sessiestempel_bij_sessiestart]]. Team-zichtbaar vastgelegd in de close-sessionsectie van AGENTS.md.

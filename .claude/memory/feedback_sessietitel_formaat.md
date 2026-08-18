---
name: feedback_sessietitel_formaat
description: Sessietitel altijd "YYYY-MM-DD HH:MM · onderwerp", gezet bij de sessiestart en bij close-session alleen nog aangescherpt
metadata:
  type: feedback
---

Elke sessie krijgt de titel `YYYY-MM-DD HH:MM · <onderwerp>`, met de **starttijd** van de sessie (`createdAt` uit `get_session`), niet het afsluitmoment. Zet die titel **bij de eerste reply**, meteen na de stempelregel uit [[feedback_sessiestempel_bij_sessiestart]]. Bij close-session wordt de titel alleen nog aangescherpt als het onderwerp intussen verschoven is, vóór de git-backupstap.

**Why:** De app geeft sessies zelf een titel zonder datum/tijd, waardoor Sanders zijbalk geen tijdlijn vormt. Op 2026-08-18 zijn eerst 7 bestaande sessies met terugwerkende kracht omgezet; later diezelfde dag bleken opnieuw 3 sessies fout benoemd, puur omdat ze nooit waren afgesloten en de regel toen nog alleen bij close-session grepen. Daarom is het moment verschoven naar de sessiestart.

**How to apply:** Gebruik `mcp__ccd_session_mgmt__set_session_title`. Een andere lopende sessie kan gewoon hernoemd worden — alleen een sessie die zichzelf via zijn eigen id probeert te hernoemen loopt vast; gebruik dan `"self"` of meld de gewenste titel aan Sander. Titels die Sander zelf heeft gezet worden bewaard: meld dat en vraag of die alsnog om moet. Zet nooit een duur in de titel, want aanmaaktijd en laatste activiteit zeggen niets over de werkelijke gesprekstijd. Team-zichtbaar vastgelegd als hard rule 12/12a en in de close-sessionsectie van AGENTS.md.

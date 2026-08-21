---
name: feedback_sessiestempel_bij_sessiestart
description: "Elke eerste reply van een sessie begint met datum, tijdstip en onderwerp"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6374d8a7-0197-483f-a976-ec5aaef3ecd2
  modified: 2026-08-21T10:41:24.998Z
---

Start elke sessie met een stempelregel bovenaan de eerste reply: datum, tijdstip en het onderwerp van de sessie. Bijvoorbeeld: `**18 augustus 2026, 09:12 — Sessietitels hernoemen**`. Gebruik de echte lokale machinetijd (`date`), niet de datum uit de systeemcontext, want die bevat geen tijd.

**Why:** Sander gebruikt de sessielijst in de zijbalk om terug te zien welke sessies hij heeft gevoerd en wanneer. Zonder tijdstempel is die lijst onbruikbaar als tijdlijn. Gevraagd op 2026-08-18.

**How to apply:** Zet de stempelregel als allereerste regel van de eerste reply in een nieuwe sessie, vóór de inhoudelijke tekst. Is het onderwerp nog onduidelijk, gebruik dan Sanders openingsvraag. Zie ook [[feedback_sessietitel_formaat]] — direct na de stempelregel wordt datzelfde formaat ook als sessietitel gezet. Team-zichtbaar vastgelegd als hard rule 12 in AGENTS.md.

⚠️ **Op 2026-08-19 gecorrigeerd na een gemiste stap:** de stempelregel in de reply-tekst is NIET hetzelfde als de sessietitel zetten — dat zijn twee losse acties. Het schrijven van de stempeltekst voelt als "klaar", maar de titel is pas echt gezet na een aparte tool-call (`mcp__ccd_session_mgmt__set_session_title`, zie [[feedback_sessietitel_formaat]]). Behandel de eerste reply pas als compleet als beide zijn gebeurd: (1) stempelregel geschreven, (2) tool-call gedaan.

✅ **Op 2026-08-21 technisch afgedwongen:** deze regel bleek in de praktijk vaak alsnog gemist te worden (5 sessies op één dag zonder correcte titel/stempel), omdat er — anders dan bij GL-013 — geen enkele automatische bewaker voor bestond. Er draait nu een Stop-hook, `.claude/hooks/check-session-stamp.py` (geregistreerd in `.claude/settings.json`), die bij de EERSTE echte gebruikersbeurt van een sessie blokkeert als het antwoord niet met de stempelregel begint EN geen `set_session_title`-aanroep bevat. Zusje van `check-lettered-options.py` (GL-013). Dit haalt de afhankelijkheid van mijn geheugen weg voor dit specifieke stuk.

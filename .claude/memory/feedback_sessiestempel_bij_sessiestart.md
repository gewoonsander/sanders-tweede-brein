---
name: feedback_sessiestempel_bij_sessiestart
description: Elke eerste reply van een sessie begint met datum, tijdstip en onderwerp
metadata:
  type: feedback
---

Start elke sessie met een stempelregel bovenaan de eerste reply: datum, tijdstip en het onderwerp van de sessie. Bijvoorbeeld: `**18 augustus 2026, 09:12 — Sessietitels hernoemen**`. Gebruik de echte lokale machinetijd (`date`), niet de datum uit de systeemcontext, want die bevat geen tijd.

**Why:** Sander gebruikt de sessielijst in de zijbalk om terug te zien welke sessies hij heeft gevoerd en wanneer. Zonder tijdstempel is die lijst onbruikbaar als tijdlijn. Gevraagd op 2026-08-18.

**How to apply:** Zet de stempelregel als allereerste regel van de eerste reply in een nieuwe sessie, vóór de inhoudelijke tekst. Is het onderwerp nog onduidelijk, gebruik dan Sanders openingsvraag. Zie ook [[feedback_sessietitel_formaat]] — direct na de stempelregel wordt datzelfde formaat ook als sessietitel gezet. Team-zichtbaar vastgelegd als hard rule 12 in AGENTS.md.

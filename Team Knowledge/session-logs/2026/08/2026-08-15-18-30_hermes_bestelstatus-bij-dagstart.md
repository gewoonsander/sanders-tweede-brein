---
agent_id: hermes
session_id: 2026-08-15-18-30-hermes-bestelstatus-bij-dagstart
timestamp: 2026-08-15T18:30:00+02:00
type: mid-session-insight
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Bestelstatus bij de dagstart zonder losse statusmails

## Context

Sander wil na een bestelling wel de voortgang volgen, maar niet zelf alle automatische bestel- en verzendmails lezen.

## What we did

- **Pieter Post** kreeg een vaste verwerkingsregel voor bestelbevestigingen en logistieke statusupdates.
- **Hermes** voegde lopende bestellingen toe aan `/dagstart` en maakte [[lopende-bestellingen]] als canoniek statusoverzicht.

## Decisions made

- **Question:** Hoe blijft Sander op de hoogte zonder alle statusmails zelf te verwerken?
  **Decision:** Pieter registreert bestelling en statuswijzigingen eerst in [[lopende-bestellingen]], verwijdert daarna de automatische bronmail en `/dagstart` meldt alleen nieuwe of gewijzigde statussen.
- **Question:** Welke mails mogen niet automatisch verdwijnen?
  **Decision:** Facturen, betaalbewijzen, afwijkingen, klachten, retouren, terugbetalingen, geschillen en onduidelijke orderkoppelingen blijven buiten de automatische verwijderregel.

## Insights

- De waarde van logistieke mail zit in de actuele status, niet in het bewaren van iedere afzonderlijke notificatie.

## Realignments

- De eerdere regel dat nieuwe bestelbevestigingen moesten blijven staan totdat een nog te ontwerpen procedure bestond, is vervangen door het levende overzicht [[lopende-bestellingen]].

## Open threads

- [ ] De werkwijze in de eerstvolgende `/dagstart` praktisch toetsen zodra een nieuwe bestel- of verzendmail binnenkomt.

## Next steps

- Pieter verwerkt nieuwe relevante Gmail-berichten volgens de vaste bestelstatusregel.

## Cross-links

- `[[2026-08-14-14-00_argus_pieter-post-security-gate]]`

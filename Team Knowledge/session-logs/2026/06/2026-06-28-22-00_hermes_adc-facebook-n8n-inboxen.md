---
agent_id: hermes
session_id: adc-facebook-n8n-inboxen
timestamp: 2026-06-28T22:00:00+02:00
type: close-session
linked_sops: ["SOP-013-inboxen-verwerken"]
linked_workstreams: []
linked_guidelines: []
---

# ADC Facebook-posting, n8n verslag-notificatie, inboxen opruimen

## Context

Vervolgsessie na context-compactie. Sander wilde het eerder geplande Facebook-verslag van de Winmau Benelux Trophy 2026 (27 juni) live zetten in de ADC Regio Oost groep, daarna een n8n workflow bouwen voor automatisering, en tot slot de inboxen opruimen.

## What we did

- **Hermes** navigeerde via Chrome MCP naar de ADC Facebook-groep (`4311576469163689`) en zette het verslag klaar in de composer via JavaScript paste-event. Sander klikte zelf op Publiceren.
- **Hermes** bouwde een n8n workflow (`qDDTsCo229X3BpZz`) — "ADC Oost — Verslag notificatie" — die dagelijks om 07:15 checkt of gisteren een toernooidag was en zo ja een Telegram-notificatie stuurt naar Sander (chat ID `8387095008`). Workflow staat actief.
- **Hermes** archiveerde een te complexe eerdere workflow (`f919bezB8qOLKjYk`) die Firecrawl en OpenAI gebruikte — vervangen door de simpelere notificatieaanpak (Claude-taak doet scraping, n8n alleen ping).
- **Hermes** voerde SOP-013 uit: Downloads leeggemaakt via Mediahub-routing. 6 Joppe-foto's → `01_Dartscoaching/07_Beeldbank/`, 2 plattegronden Huismanstraat 34 → `05_Gezinshuis_Gewoon_Thuis/07_Beeldbank/` (nieuwe map aangemaakt).
- **Hermes** schreef **SOP-013-inboxen-verwerken.md** — procedure voor het systematisch verwerken van Downloads, Team Inbox en Werkarchief via de Mediahub-beslisboom.
- **Hermes** sloeg feedback op in geheugen: Mediahub-skill proactief aanroepen bij mediabestanden.

## Decisions made

- **Vraag:** Firecrawl (betaald) of simpele notificatie voor n8n verslag-workflow?
  **Beslissing:** Simpele notificatie. Claude-taak doet het scrapen (gratis, via Chrome MCP), n8n stuurt alleen een Telegram-ping als er een toernooidag was.

- **Vraag:** Prullenmand automatisch leegmaken als onderdeel van inboxroutine?
  **Beslissing:** Nee — Hermes toont eerst wat erin zit, Sander bevestigt. Onomkeerbare actie blijft bij de gebruiker.

## Insights

- De bestaande Mediahub-structuur op de Lexar SSD is volledig en goed gedocumenteerd (README v1.1). Hermes moet deze structuur vaker actief raadplegen bij mediabestanden.
- Facebook's contenteditable composer accepteert geen standaard `form_input` of `insertText` via JavaScript — alleen een `ClipboardEvent` paste-event op de juiste editor in de dialoog werkte.
- Sander's Telegram chat ID: `8387095008`.

## Realignments

- Hermes stelde initieel een cron om 07:30 voor (na Claude-taak). Sander vroeg waarom er een vertraging was — terecht. Gecorrigeerd: Claude-taak om 07:00, n8n om 07:15 (minimale buffer).
- Hermes vroeg Sander naar de Mediahub-skill in plaats van deze proactief aan te roepen. Sander corrigeerde dit. SOP-013 geschreven als structurele fix.

## Open threads

- [ ] **Bart van Meijl** — jaarafsluiting 2025 nog niet klaar, e-Boekhouden accounts nog open. Factuur VMB Advies €211,75 is achterstallig (vervaldatum 26 juni). Morgen (29 juni) oppakken.
- [ ] **Joppe-foto's review** — 6 foto's in Mediahub voor dartscoaching, maar complete review moet nog komen: stijl, iconen en consistentie aanpassen. Taak nog aanmaken in Todoist.
- [ ] **Regiofinales Dart Atlas** — 26-27 september nog niet aangemaakt door John Lokken.
- [ ] **Henrico Eilander Facebook** — vriendschapsverzoek staat nog open. Toevoegen aan facebook-ids-regio-oost.md zodra bevestigd.
- [ ] **ADC email sander.voz@amateurdarts.eu** — doorsturen, handtekening, labels nog niet ingesteld.
- [ ] **n8n toernooi schema** — nieuwe pub qualifier IDs toevoegen zodra John Lokken ze aanmaakt in Dart Atlas.

## Next steps

- Morgen (29 juni): verbouwingsgesprek 14:00 Marieke, daarna woonkeuken leegmaken.
- Bart-factuur betalen + contact opnemen over jaarafsluiting.
- Todoist-taak aanmaken voor Joppe-foto's review (dartscoaching stijl).

## Cross-links

- `[[2026-06-28-18-00_hermes_team-rebranding-avatars-cockpit-fixes]]` — vorige sessie vandaag

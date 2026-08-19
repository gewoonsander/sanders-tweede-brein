---
agent_id: hermes
session_id: cockpit-skills-en-sop-diagrammen
timestamp: 2026-08-19T18:56:00Z
type: close-session
linked_sops: ["SOP-013-inboxen-verwerken", "SOP-create-task", "SOP-rebuild-task-index"]
linked_workstreams: []
linked_guidelines: ["GL-003-design-system"]
---

# Onderzoek naar een Skills-overzicht en visuele SOP-diagrammen in de mypka-cockpit

## Context

Sander wilde een "Skills"-item in het "Mijn AI-team"-menu (naast Team, Sessie-log,
Analyse, Workstreams, SOPs, Guidelines) en, los daarvan, een manier om SOP's,
Workstreams en Guidelines ook als diagram te kunnen bekijken vanuit het dashboard —
"ik ben best visueel ingesteld". Beide waren onderzoeksvragen, geen bouwopdrachten.

## What we did

- Explore-agent bracht de architectuur van de mypka-cockpit en het bestaande
  Workstreams/SOPs/Guidelines-patroon in kaart, plus een volledige inventarisatie
  van alle skills (domeinskills, slash-commands, scheduled-tasks, generieke
  plugin-skills).
- Sander koos via AskUserQuestion: alle categorieën tonen, data rechtstreeks uit
  bronbestanden lezen (geen SQLite-mirror). Vastgelegd als `tsk-2026-08-19-001`.
- Team Inbox verwerkt: twee Podcasts-instellingen-screenshots bekeken, bleken
  incidenteel zonder inhoud, na bevestiging verwijderd. Het gemelde "document"
  bleek het lege wekelijkse inboxronde-rapport — geen actie nodig.
- Charta en Harmonia onderzochten parallel hoe SOP's/Workstreams/Guidelines
  visueel te maken zijn: welke notatie (stroomschema, beslisboom, BPMN-zwembanen)
  past bij welk documenttype, en hoe dat in de bestaande huisstijl (INKLINE-tokens,
  lucide-iconen) past zonder nieuwe kleuren te verzinnen.
- Voorstel gepubliceerd als Artifact "SOP-diagrammen"
  (https://claude.ai/code/artifact/55173350-2666-4dfd-bb22-f29ff3ba8df8) met
  live voorbeelddiagrammen van SOP-013 (beslisboom) en WS-003 (zwembanen).
  Vastgelegd als `tsk-2026-08-19-003`.
- Op Sanders verzoek zelf 3 pilot-SOP's gekozen, bewust drie verschillende
  diagramvormen: SOP-013 (beslisboom), SOP-004 (gefaseerde pipeline),
  SOP-017 (stappen + tweesprong, dagelijks persoonlijk gebruik).
- Taken-index tweemaal herbouwd na het aanmaken/bijwerken van taken.

## Decisions made

- **Vraag:** Moet het Skills-overzicht via de bestaande SQLite-mirror lopen,
  zoals Workstreams/SOPs/Guidelines?
  **Besluit:** Nee — rechtstreeks uit de bronbestanden lezen, zodat het altijd
  actueel is zonder handmatige regeneratie.
- **Vraag:** Mermaid.js toevoegen voor de SOP-diagrammen, of iets anders?
  **Besluit:** Geen nieuwe renderer — de cockpit heeft al een werkende
  React Flow-diagram-engine (de kennisgraaf); die hergebruiken zodat de stijl
  gegarandeerd "van het huis" oogt.
- **Vraag:** Welke 3 SOP's voor de diagram-pilot?
  **Besluit:** SOP-013, SOP-004, SOP-017 — gekozen om drie structureel
  verschillende vormen te dekken (beslisboom, gefaseerde pipeline, stappen+tweesprong),
  niet drie keer hetzelfde patroon.

## Insights

- Een tweede, gelijktijdig lopende sessie (Bezalel) bouwde het Skills-overzicht
  al vóór het einde van deze sessie en sloot `tsk-2026-08-19-001` af — zie
  [[2026-08-19-13-08_bezalel_skills-en-taken-cockpit-views]]. Daarbij bleek de
  scope iets af te wijken van wat hier is vastgelegd: de generieke Anthropic-
  plugin-skills (docx/pdf/pptx/xlsx) zijn bewust wél onderzocht maar uiteindelijk
  weggelaten (geen stabiel leesbaar manifest, willekeurig genoemde tempmap per
  proces) — Sander koos toen expliciet voor weglaten i.p.v. hardcoderen. Reden om
  bij een volgende cockpit-taak eerst te checken of een parallelle sessie al aan
  hetzelfde bestand werkt, vóór er een taak voor wordt aangemaakt.
- De taken-index werd buiten deze sessie om tweemaal herbouwd in een ander,
  compacter formaat (tabel met status-iconen i.p.v. de secties-per-prioriteit-vorm
  uit `SOP-rebuild-task-index`) — functioneel gelijkwaardig, wel een teken dat er
  meerdere rebuild-implementaties naast elkaar bestaan. Geen actie ondernomen,
  wel het waard om ooit te consolideren.

## Realignments

- _(geen deze sessie)_

## Open threads

- [ ] `tsk-2026-08-19-003` (SOP-diagrammen) wacht op bouw — knopnaam "Visualiseer"
      nog te bevestigen, verder klaar om als terminal-sessie opgepakt te worden.
- [ ] Twee losstaande stijlvragen uit Harmonia's onderzoek, nog niet aan Sander
      voorgelegd om een besluit: (1) moet het dashboard-kleursysteem "INKLINE"
      alsnog als 5e merkbestand in de GL-003-hub geregistreerd worden; (2) wil
      Sander een vaste kleur per specialist, of blijft identiteit bij icoon+label.
- [ ] Avondeten nog niet gelogd (`food_log.py status` → `missing: ["dinner"]`,
      dag nog niet compleet) — geen actieve dagelijkse habits open.

## Next steps

- Zodra Sander een terminal-sessie start: `tsk-2026-08-19-003` oppakken,
  beginnend met de 3 gekozen pilot-SOP's.
- Bij gelegenheid: consolideren welke `SOP-rebuild-task-index`-implementatie
  leidend is, nu er zichtbaar twee output-formaten naast elkaar bestaan.

## Cross-links

- `[[2026-08-19-13-08_bezalel_skills-en-taken-cockpit-views]]` — de sessie die
  `tsk-2026-08-19-001` (Skills-overzicht) daadwerkelijk bouwde en afsloot.

---
# Identity
id: tsk-2026-08-19-003
title: "Diagram-weergave toevoegen voor SOP's, Workstreams en Guidelines in mypka-cockpit"

# Ownership & priority
assignee: bezalel
priority: 3

# Status (mirrors folder location)
status: open
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-19T11:30:00Z
updated: 2026-08-19T11:45:00Z
due: null

# Provenance
created_by: hermes
source: sander-chat-2026-08-19
parent: null

# Cross-references — REQUIRED, even if empty array. The act of filling these is the whole point.
linked_sops: []
linked_workstreams: []
linked_guidelines: [GL-003-design-system]
linked_my_life: []
linked_session_logs: []
linked_journal_entries: []

# Tagging
tags: [mypka-cockpit, dashboard, frontend, diagrammen, visualisatie, sops, workstreams, guidelines]
---

# Diagram-weergave toevoegen voor SOP's, Workstreams en Guidelines in mypka-cockpit

## What this is
Sander wil SOP's, Workstreams en Guidelines — nu alleen als proza/markdown — ook als diagram kunnen bekijken vanuit het dashboard, in de bestaande huisstijl. Charta (notatiekeuze) en Harmonia (stijl-fit) hebben hier onderzoek naar gedaan (2026-08-19) en een voorstel is als Artifact gepubliceerd: https://claude.ai/code/artifact/55173350-2666-4dfd-bb22-f29ff3ba8df8 ("SOP-diagrammen").

**Kernbevindingen uit het onderzoek:**
- **Notatie per documenttype:** SOP's → stroomschema + beslisboom; Workstreams → zwembanen per specialist (BPMN-stijl); Guidelines → meestal géén diagram, alleen bij documenten die echt een architectuur beschrijven (zoals GL-005).
- **Geen nieuwe renderer nodig:** de cockpit heeft al een werkende diagram-motor (React Flow / `@xyflow/react`, gebruikt in `Expansions/mypka-cockpit/web/src/components/graph/MiniGraphCanvas.tsx` voor de kennisgraaf) met precies het node/pijl-vocabulaire dat hiervoor nodig is (`--graph-edge`, `--graph-edge-dash` voor uitzonderingspaden, `--graph-edge-hover`, bestaande generatie-breedte-tokens). Dat hergebruiken in plaats van Mermaid.js toevoegen.
- **Waar de knop landt:** een nieuwe knop (werktitel "Visualiseer") naast de bestaande "Raw"- en "Discuss"-knoppen in de header van `Expansions/mypka-cockpit/web/src/views/FileView.tsx`.
- **Tokenmapping (Harmonia):** volledig te bouwen met bestaande INKLINE-tokens (`--surface-1/2`, `--border`, `--accent-marker` spaarzaam als enige signaalkleur op het huidige-stap/beslismoment, `--status-*` voor waarschuwing/fout — nooit nieuwe hardcoded kleuren).
- **Icoonaanbevelingen (Harmonia, concrete lucide-namen):** `Workflow` (proces zelf), `ListChecks` (actie/stap), `GitBranch`/`Split` (beslissing), `ArrowRightLeft` (handoff naar specialist), `CircleDot`/`CirclePlay` (start), `CircleCheck` (eind/afgerond), `TriangleAlert` (waarschuwing), `CircleX` (fout/geblokkeerd).
- **Twee losstaande, niet-blokkerende vraagstukken** (niet in scope van deze taak, apart aan Sander voor te leggen): (1) het dashboard-kleursysteem "INKLINE" staat nergens formeel geregistreerd als 5e merkbestand in de GL-003-hub; (2) er bestaat vandaag bewust geen vaste kleur per specialist (identiteit = icoon + label) — een eventuele wens daartoe is een aparte, bewuste stijluitbreiding via SOP-006.

**Sander's opdracht (2026-08-19):** "Log het vast als taak voor een terminal-sessie" — dit raakt meerdere bestanden (nieuw diagram-component, een omzetstap markdown → diagram-data, een knop in de leesweergave) en is daarmee geen klusje voor tussendoor.

## Context one click away
- Guideline: [[GL-003-design-system]] — bestaande designtokens waarop de diagramstijl moet bouwen (géén nieuwe kleuren).
- Onderzoeksrapport / voorstel (Artifact): "SOP-diagrammen" — https://claude.ai/code/artifact/55173350-2666-4dfd-bb22-f29ff3ba8df8
- Sjabloon-diagram-engine: `Expansions/mypka-cockpit/web/src/components/graph/MiniGraphCanvas.tsx`, `NoteNode.tsx`, `nodeIcon.ts`
- Knop-locatie: `Expansions/mypka-cockpit/web/src/views/FileView.tsx` (header naast Raw/Discuss)
- Pilot-documenten (door Hermes gekozen op Sanders verzoek, zie Updates): [[SOP-013-inboxen-verwerken]], [[SOP-004-argus-security-audit]], [[SOP-017-verwerk-voedingsregistratie]]

## Success criteria
- Fase 1 (pilot): de 3 onderstaande SOP's hebben een werkend diagram, gerenderd via het hergebruikte React Flow-component, zichtbaar via een nieuwe knop in de leesweergave.
  1. **SOP-013-inboxen-verwerken** — beslisboom-vorm (Vraag A/B/C met routetabellen) + lineaire stappen; al uitgewerkt als voorbeeld in het Artifact, wekelijks geautomatiseerd + hoge zichtbaarheid voor Sander.
  2. **SOP-004-argus-security-audit** — gefaseerde pipeline-vorm (4 fasen die elkaar blokkeren, oplopende severity); andere vorm dan een beslisboom, en veiligheidskritisch genoeg dat een diagram bij een snelle audit-check echt iets toevoegt.
  3. **SOP-017-verwerk-voedingsregistratie** — genummerde stappen + een expliciete tweesprong (tijdvenstercheck: "missing leeg" vs "missing niet leeg"); iets wat Sander vrijwel dagelijks raakt (maaltijden/dranken loggen), dus een goede test of het ook in de praktijk waarde toevoegt en niet alleen als demo.
- Diagramstijl gebruikt uitsluitend bestaande GL-003/INKLINE-tokens — geen nieuwe hardcoded kleuren, licht/donker werkt automatisch mee.
- Knopnaam is nog niet met Sander afgestemd (werktitel "Visualiseer") — bevestigen vóór/tijdens bouw.
- Nemesis-QA-check op design-system compliance en toegankelijkheid (WCAG 2.2 AA) vóór afronding van fase 1.
- Fase 2 (generieke parser) en fase 3 (overal aan) zijn expliciet vervolgstappen, niet vereist voor het afronden van deze taak — zie het Artifact voor de volledige fasering.

## Updates
- 2026-08-19 11:30 (hermes) — created, na onderzoek door Charta + Harmonia en voorstel als Artifact gepubliceerd. Openstaand vóór start bouw: welke 3 SOP's/Workstreams voor de pilot, en of de knop "Visualiseer" moet heten.
- 2026-08-19 11:45 (hermes) — Sander: "Kies zelf de 3 SOP's voor de pilot." Gekozen: SOP-013 (beslisboom-vorm, al geprototypet), SOP-004 (gefaseerde pipeline-vorm, veiligheidskritisch), SOP-017 (stappen + tweesprong, dagelijks persoonlijk gebruik) — bewust drie verschillende diagramvormen, geen drie keer hetzelfde patroon. Knopnaam staat nog open.

## Outcome
_(filled when status flips to done — see SOP-close-task)_

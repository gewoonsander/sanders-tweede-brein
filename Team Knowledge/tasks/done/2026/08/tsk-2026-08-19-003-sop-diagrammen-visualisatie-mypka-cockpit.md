---
# Identity
id: tsk-2026-08-19-003
title: "Diagram-weergave toevoegen voor SOP's, Workstreams en Guidelines in mypka-cockpit"

# Ownership & priority
assignee: bezalel
priority: 3

# Status (mirrors folder location)
status: done
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-19T11:30:00Z
updated: 2026-08-21T15:10:00Z
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
- 2026-08-21 10:54 (bezalel) — opgepakt, fase 1 (pilot) gestart. Knopnaam door Sander definitief vastgesteld op "Visualiseer". Priors geladen uit [[2026-08-19-10-22_hermes_cockpit-skills-en-sop-diagrammen]] en [[GL-003-design-system]]. Let op: het Artifact (claude.ai/code/artifact/55173350-…) is niet op te halen — auth-gated en client-gerenderd, en er staat geen lokale kopie in `Deliverables/`. De onderzoekssamenvatting in dít taakbestand is daarmee de werkende specificatie.
- 2026-08-21 12:05 (bezalel) — **fase 1 gebouwd en werkend in de draaiende Cockpit.** Nieuw: `web/src/components/diagram/` met `diagramTypes.ts` (datacontract), `markdownShapes.ts` (fence-bewuste markdown-lezers), `sopDiagrams.ts` (de omzetstap: drie documentspecifieke converters), `diagramLayout.ts` (deterministische raster-lay-out, géén d3-force), `StepNode.tsx`, `SopDiagramCanvas.tsx` (lazy React Flow-chunk), `SopDiagram.tsx`, `diagram.css`. Gewijzigd: `views/FileView.tsx` (knop "Visualiseer" naast Raw/Discuss + paneel) en `components/foldertree.css` (knopstijl, naast `.file-view-raw`). `npm run build` slaagt; de zware React Flow-chunk blijft achter de lazy grens (`SopDiagramCanvas` 4,8 kB / 2,1 kB gzip, deelt de bestaande `@xyflow`-chunk met de kennisgraaf).
  - Geverifieerd in de **écht draaiende Cockpit** (127.0.0.1:4317) via de CDP-methode uit [[SOP-005-nemesis-quality-gate]] §Phase 2 (echte wachttijden + `document.fonts.ready`, nooit `--virtual-time-budget`): SOP-013 29 nodes/28 edges (beslisboom), SOP-004 16/15 (gefaseerde pipeline), SOP-017 18/18 (stappen + tweesprong). GL-003 als negatieve controle: géén knop. Nul console-fouten, nul horizontale overflow op 375/768/1280/1440, nul node-overlap, proza blijft onder het diagram staan.
  - Tijdens die verificatie zelf gevonden en gerepareerd: (1) het notatie-label zat ín de `<h2>` en werd aan de toegankelijke naam geplakt ("Inboxen verwerkenBeslisboom"); (2) focus keerde na sluiten van het schermvullende diagram terug naar `<body>` in plaats van naar de knop — de trigger werd uit `document.activeElement` gehaald terwijl die knop tijdens de dialoog niet gemonteerd is; (3) `aria-pressed` vervangen door `aria-expanded` (het is een disclosure met `aria-controls`, geen toggle-knop); (4) een edge die de spine weer opzocht liep ver links om.
  - Tokencontrole: nul hardcoded kleuren in alle nieuwe bestanden; alle 30 gebruikte `var(--…)` bestaan in `index.css` en hebben een light-mode-waarde. `--accent-marker` uitsluitend op het beslismoment, `--status-warning`/`--status-error` op let-op/blokkerend, `--graph-edge-dash` op uitzonderingspaden. Betekenis hangt nooit aan kleur alleen: elk knooptype heeft een eigen lucide-glyph (Harmonia's vocabulaire), een tekstlabel in de kaart, een zichtbare legenda én een volledig uitgeschreven `aria-label`.
  - **Nog niet gedaan: de Nemesis-kwaliteitspoort.** Deze sessie had de Agent-tool niet beschikbaar, dus Nemesis kon niet gedelegeerd worden. Bovenstaande is een zelfcontrole langs SOP-005, geen sign-off van Nemesis. Hermes moet Nemesis alsnog laten draaien vóór de taak sluit.
  - Openstaande UX-vraag voor Sander (voorkeur, geen defect): het diagram opent op zoomniveau 1.0 aan de bovenkant (leesbaar), niet uitgezoomd op het geheel — conform de voorkeur die Sander eerder voor de kennisgraaf uitsprak. "Hele diagram in beeld" zit als knop rechtsonder. Voor een lange SOP als SOP-017 staat de tweesprong daardoor onder de vouw tot je die knop indrukt.
  - Fase 2 (generieke parser) en fase 3 (overal aan) blijven bewust buiten scope, conform de success criteria hierboven.
- 2026-08-21 14:20 (bezalel) — **beide HIGH-bevindingen uit Nemesis' CONDITIONAL PASS gerepareerd.** Nog niet gesloten: Nemesis moet dit zelf herinspecteren ("no second-hand confirmation").
  - **HIGH 1 — diagram-pijlen faalden WCAG 2.2 SC 1.4.11 (gemeten 1.42:1 dark / 1.33:1 light, dashed 1.22/1.20).** Oorzaak: het diagram leende `--graph-edge` (= `--border`, het decoratieve haarlijntje) van de kennisgraaf. Die graaf komt daarmee weg omdat een hover z'n edges naar `--graph-edge-hover` tilt; een stroomschema heeft die state niet (`edgesFocusable: false` — de kaarten zijn de interactieve laag, niet de lijnen), dus de ruststand moet de 3:1 zélf halen. Nieuw eigen alias-token `--diagram-edge: var(--fg-subtle)` in `index.css` (géén nieuwe kleurwaarde — de terminale stille stap van de paper-ladder op volle alpha, conform §2.8 "quiet is een token-stap, nooit een opacity-dial"; hij hangt aan `--fg-subtle` dus light/dark re-grondt vanzelf). Solide edges, uitzonderings-edges, arrowhead-markers én de legenda-dash gebruiken nu allemaal dat ene token; onderscheid loopt uitsluitend via het streepjespatroon, niet meer via "vager". Stroke van 1.25px naar 1.5px, omdat een fractionele lijn volledig antialiast en dan lager meet dan hij rekent. **Gemeten na de fix: 5.54:1 (dark) / 5.34:1 (light)** voor solide, gestreept, arrowhead en legenda — op alle 3 pilot-SOP's, beide thema's, 375/768/1280.
  - **HIGH 2 — bestandstitel viel terug tot één letter per regel op 375px (16px breed × 1142px hoog).** Oorzaak: `.file-view-head` mengt één krimpbaar item (de titel) met N vaste knoppen (`flex: none`), en op een `nowrap`-regel kan het flex-algoritme het tekort alleen bij dat ene krimpbare item weghalen — elke extra knop maakte de titel smaller. Fix in `foldertree.css`: `flex-wrap: wrap` op `.file-view-head` (bewust onvoorwaardelijk, niet achter een media query: de trigger is "titel + knoppen passen niet in de kolom", wat van de bestandsnaam en het aantal knoppen afhangt, niet van de viewport) + een krimpvloer. **Gemeten na de fix: titelbox 317px breed, 2–3 regels die op koppeltekens breken** i.p.v. 16px/1142px. Op 1280px staat alles nog op één regel — geen desktop-regressie. Ook gecontroleerd op de Raw/Discuss-only-situatie (GL-003, geen Visualiseer-knop): breekt netjes, geen regressie.
  - Twee defecten die ik tijdens de eigen visuele controle zelf vond en meteen meenam (beide in code die ik in fase 1 zelf schreef, niet uit Nemesis' lijst — dus geen scope-kruip in haar niet-blokkerende bevindingen):
    1. Het notatie-label ("Stappen met tweesprong") werd op 375px dwars over de tweede regel van de diagramtitel geschilderd: `.dg-shape` is `white-space: nowrap` + `flex: none` en claimde ~149px van een ~274px-rij, waardoor de titel minder ruimte kreeg dan z'n eigen min-content en uit z'n box liep. `.dg-heading` wrapt nu, dus het label zakt naar een eigen regel.
    2. De bestandsglyph werd door de nieuwe wrap van de titel losgeknipt en strandde op een eigen regel erboven. Glyph + titel zitten nu in één flex-kind (`.file-view-heading`) — dezelfde ingreep die `.dg-heading` al voor titel + label maakt.
  - **Verificatiemethode:** echte Chrome via CDP (`--remote-debugging-port`), real-time wachten + polling op de daadwerkelijk geschilderde `.react-flow__edge-path`-elementen, nooit `--virtual-time-budget` — conform de pitfall in [[SOP-005-nemesis-quality-gate]]. Contrast berekend uit de *computed* stroke-kleuren tegen de gemeten canvasgrond, met alpha-compositing. Zijbalk vooraf dichtgeklapt, zoals Nemesis deed. 18 diagram-combinaties (3 SOP's × 2 thema's × 3 breedtes) plus de negatieve controle: nul console-fouten, nul horizontale overflow, alle contrastwaarden ≥ 5,3:1.
  - **Eén FAIL blijft staan en is aantoonbaar NIET van deze fix:** GL-003 geeft op 375px 156px horizontale overflow. Dat is de brede markdown-tabel (het merkenregister) in de leesweergave, plus de al apart gerapporteerde zijbalk-scrim. Nagemeten tegen een baseline-build met mijn CSS eruit gestasht: identiek (531px scrollWidth, dezelfde 14 elementen, geen enkele binnen `.file-view-head`). Bestaand gedrag van markdown-tabellen op smal scherm, buiten scope van deze taak.
  - Gewijzigd: `web/src/index.css` (nieuw token), `web/src/components/diagram/diagram.css`, `web/src/components/diagram/SopDiagramCanvas.tsx`, `web/src/components/foldertree.css`, `web/src/views/FileView.tsx`. `tsc --noEmit` schoon, `npm run build` slaagt, nul hardcoded kleuren in de gewijzigde bestanden.
- 2026-08-21 15:10 (hermes) — **Nemesis-herinspectie: PASS, onafhankelijk bevestigd** (eigen contrastmeting uit de ruwe tokenwaarden, niet op Bezalels cijfers vertrouwd). Beide HIGH-bevindingen gerepareerd: edge-contrast 5.54:1 (dark) / 5.34:1 (light), titelbox 317px met nette 2-3-regelige wrap, geen desktop-regressie op 1280px, geen regressie op de knopvrije situatie (GL-003). De twee zelfgevonden defecten (label-overlap, losgeknipte glyph) ook bevestigd gefixt. De pre-existing GL-003-tabeloverflow op 375px is apart bevestigd als niet-gerelateerd aan deze taak. Alle success criteria van fase 1 zijn hiermee gehaald — taak gesloten.
- 2026-08-21 15:10 (hermes) — done: fase 1 van "Visualiseer" opgeleverd en QA-akkoord ontvangen; fase 2/3 blijven bewust vervolgstappen.

## Outcome

What shipped: een "Visualiseer"-knop naast Raw/Discuss in de leesweergave van de myPKA Cockpit die SOP's als diagram rendert, via hergebruik van de bestaande React Flow-graafengine (geen Mermaid.js, geen nieuwe dependency). Nieuwe omzetstap markdown → diagram-data (`web/src/components/diagram/sopDiagrams.ts` + `markdownShapes.ts` + `diagramLayout.ts`) en een nieuw diagram-component (`SopDiagramCanvas.tsx`, `SopDiagram.tsx`, `StepNode.tsx`, `diagram.css`), werkend voor de 3 pilot-SOP's, elk in een eigen diagramvorm: SOP-013 (beslisboom, 29 nodes/28 edges), SOP-004 (gefaseerde pipeline, 16/15), SOP-017 (stappen + tweesprong, 18/18). Negatieve controle (GL-003, geen SOP) toont terecht geen knop. Eén nieuw designtoken (`--diagram-edge: var(--fg-subtle)`, alias, geen nieuwe kleurwaarde) toegevoegd om WCAG 1.4.11-contrast op de diagram-pijlen te halen. Onafhankelijk Nemesis-QA-akkoord op GL-003-compliance en WCAG 2.2 AA, na één reparatieronde (edge-contrast + titelwrap op 375px).

Where it lives: `Expansions/mypka-cockpit/web/src/components/diagram/` (nieuw), gewijzigd `web/src/views/FileView.tsx`, `web/src/components/foldertree.css`, `web/src/index.css`. Wijzigingen staan lokaal in de werkboom, nog niet gecommit op verzoek van Sander.

Follow-ups: fase 2 (generieke parser voor alle SOP's/Workstreams/Guidelines) en fase 3 ("overal aan") zijn expliciet niet meegenomen — bewust bewaard voor een aparte, later te loggen taak zodra Sander die wil oppakken. Eén losse open UX-voorkeursvraag bij Sander (nog onbeantwoord, geen defect): moet het diagram bij openen uitgezoomd op het geheel starten in plaats van op zoom 1.0 bovenaan? Twee niet-blokkerende registratiegaten voor Harmonia: (1) INKLINE staat nog niet als 5e merkbestand in de GL-003-hub, (2) `--diagram-edge` als nieuw alias-token formeel bekrachtigen bij de volgende tokenronde. Eén losse, aparte taak klaargezet voor de stale GL-003-bronvermelding in `index.css` regel 14 (chip aangeboden aan Sander, nog niet opgepakt).

Lessons: geen aparte journal-entry — de belangrijkste les (agents zonder Agent-tool-toegang kunnen niet naar Nemesis delegeren, dus zelfcontrole is geen vervanging voor de echte poort) staat al vastgelegd in Bezalels eigen update-regels hierboven en is procedureel al gedekt door SOP-005's "no second-hand confirmation"-regel.

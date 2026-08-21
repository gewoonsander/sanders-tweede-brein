---
# Identity
id: tsk-2026-08-21-001
title: "Generieke markdown-naar-diagram-parser voor SOP's en Workstreams (fase 2)"

# Ownership & priority
assignee: bezalel
priority: 3

# Status (mirrors folder location)
status: in-progress
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-21T10:38:00Z
updated: 2026-08-21T10:40:00Z
due: null

# Provenance
created_by: hermes
source: sander-chat-2026-08-21
parent: tsk-2026-08-19-003

# Cross-references — REQUIRED, even if empty array. The act of filling these is the whole point.
linked_sops: [SOP-005-nemesis-quality-gate, SOP-claim-task, SOP-close-task]
linked_workstreams: []
linked_guidelines: [GL-003-design-system]
linked_my_life: []
linked_session_logs: []
linked_journal_entries: []

# Tagging
tags: [mypka-cockpit, dashboard, frontend, diagrammen, visualisatie, sops, workstreams, fase-2]
---

# Generieke markdown-naar-diagram-parser voor SOP's en Workstreams (fase 2)

## What this is
Vervolg op [[tsk-2026-08-19-003]] (fase 1, done). Fase 1 leverde de "Visualiseer"-knop in de myPKA Cockpit op, maar met drie **hardcoded, documentspecifieke** converters (`sopDiagrams.ts`) die alleen werken voor SOP-013, SOP-004 en SOP-017. Sander wil nu de generieke parser: één omzetstap die op elk SOP-document en elk Workstream-document werkt, zonder per-document handwerk, zodat "Visualiseer" overal beschikbaar is waar het zinvol is.

Sander's opdracht (2026-08-21): "bouw die generieke parser nu" — direct starten, niet eerst als taak laten liggen.

**Scope-beslissing van Hermes bij het aanmaken van deze taak** (het onderzoeks-Artifact van Charta/Harmonia is niet meer op te halen — auth-gated, geen lokale kopie, zie Bezalels notitie in de fase-1-taak): deze taak dekt **SOP's en Workstreams**, niet Guidelines. Reden: de fase-1-kernbevinding was al expliciet dat Guidelines "meestal géén diagram" krijgen, alleen bij documenten die echt een architectuur beschrijven (zoals GL-005) — dat is een curatorial oordeel per document, geen generiek patroon, en hoort dus niet bij een automatische parser. Guidelines-diagrammen blijven wat ze in fase 1 al waren: een handmatige, per-document toevoeging aan de allow-list, geen scope van dit ticket.

**Cijfers om de reikwijdte te wegen:** 34 bestanden in `Team Knowledge/SOPs/`, 9 in `Team Knowledge/Workstreams/`.

## Context one click away
- Vorige fase (done, met volledige bouw-context): [[tsk-2026-08-19-003]]
- Bestaande hardcoded referentie-implementaties (blijven staan als voorbeeld van "goed genoeg" output): `Expansions/mypka-cockpit/web/src/components/diagram/sopDiagrams.ts`
- Diagram-componenten (hergebruiken, niet vervangen): `Expansions/mypka-cockpit/web/src/components/diagram/SopDiagramCanvas.tsx`, `SopDiagram.tsx`, `StepNode.tsx`, `diagramLayout.ts`, `diagramTypes.ts`, `markdownShapes.ts`, `diagram.css`
- Knop-locatie (al aanwezig, moet nu breder gaan gelden): `Expansions/mypka-cockpit/web/src/views/FileView.tsx`
- Kwaliteitspoort: [[SOP-005-nemesis-quality-gate]]
- Designtokens: [[GL-003-design-system]] — géén nieuwe hardcoded kleuren; `--diagram-edge` (uit fase 1) hergebruiken voor alle edges.

## Success criteria
- Een generieke markdown → diagram-data omzetstap die redelijke, leesbare diagrammen produceert voor **alle 34 bestanden** in `Team Knowledge/SOPs/` — niet per se perfect per document, maar geen crashes, geen lege/kapotte diagrammen, en een zinnige fallback (bijv. lineaire stappenlijst) wanneer een document geen sterkere structuur (beslistabel, genummerde fases, sub-procedures §A/§B/§C) bevat.
- Een generieke swimlane-omzetstap (BPMN-stijl, per specialist) voor **alle 9 bestanden** in `Team Knowledge/Workstreams/`.
- De 3 bestaande hardcoded converters (SOP-013/004/017) blijven minimaal even goed als nu — ofwel blijven ze als specifieke override naast de generieke parser, ofwel wordt aangetoond dat de generieke parser er even goede of betere output voor geeft en vervangen ze de hardcoded versie. Motiveer de keuze in de Updates.
- De "Visualiseer"-knop verschijnt voortaan op elk SOP- en elk Workstream-bestand (niet meer een hardcoded allow-list van 3), Guidelines blijven zoals in fase 1.
- Alleen bestaande GL-003/INKLINE-tokens, geen nieuwe hardcoded kleuren.
- Steekproef-verificatie: minimaal 8 SOP's die qua structuur duidelijk van elkaar verschillen (bijv. een korte lineaire SOP, een SOP met sub-procedures zoals SOP-claim-task, een SOP met een beslistabel, een lange SOP, een SOP met weinig structuur) plus minimaal 3 Workstreams, live gecontroleerd in de draaiende Cockpit — geen crashes, geen console-fouten, leesbare output.
- Nemesis-QA-check op design-system compliance en WCAG 2.2 AA vóór afronding — zelfde poort als fase 1, inclusief de "no second-hand confirmation"-regel (elke reparatieronde opnieuw live geverifieerd door Nemesis zelf).

## Updates
- 2026-08-21 10:38 (hermes) — created, direct na Sanders "bouw die generieke parser nu"; geen aparte research-ronde met Charta/Harmonia vooraf, notatiekeuzes uit fase 1 zijn leidend. Scope bewust beperkt tot SOP's + Workstreams, Guidelines expliciet buiten scope (zie What this is).
- 2026-08-21 11:25 (bezalel) — **generieke parser gebouwd; alle 33 SOP's en 9 Workstreams leveren nu een diagram op.** Drie nieuwe bestanden in `web/src/components/diagram/`: `procedureReader.ts` (leest structuur, bouwt niets — de heuristieken zitten hier), `genericParser.ts` (structuur → `DiagramSpec`, SOP-ruggengraat én Workstream-zwembanen), `specBuilder.ts` (de node/edge-accumulator die fase 1 privé in `sopDiagrams.ts` had; verplaatst zodat oude en nieuwe converters één builder delen). Gewijzigd: `sopDiagrams.ts` (registry), `diagramTypes.ts` (drie nieuwe vormen + knooptype `lane` + `DiagramEdge.enter`), `markdownShapes.ts` (`withoutFrontmatter`/`frontmatterBlock` erheen verhuisd), `SopDiagramCanvas.tsx`, `StepNode.tsx`, `SopDiagram.tsx`, `diagram.css`, `views/FileView.tsx`. **`index.css` is niet aangeraakt** — nul nieuwe tokens; alle 28 `var(--…)` in `diagram.css` bestonden al.
  - **De heuristiek is een cascade, sterkste structuur eerst**, afgeleid uit het daadwerkelijk doorlezen van alle 42 documenten: (0) `§A/§B/§C`-sub-procedures → parallelle kolommen; (1) genummerde H2-koppen (`Stap N`, `Fase N`, `Phase N`, `Tier N`, `N.`); (2) genummerde H3-koppen binnen hun container-H2 (`## Procedure` → `### Phase 1..4`); (3) een genummerde lijst onder een "Procedure"-achtige kop; (4) gewone H2-secties minus een blokkeerlijst van contextkoppen, waarbij een sectie mét genummerde lijst in die lijst uitklapt; (5) losse bullets, hard gecapt. Beslismomenten komen uit tweekoloms **route**tabellen (bewust smal — Team Knowledge staat vol referentietabellen; SOP-002's 40-rijige schemamap uitwaaieren was de valkuil), uit `Label → Bestemming`-regels in codeblokken, uit een vraagteken, en uit goedkeuringspoorten.
  - **Workstreams krijgen zwembanen** met één kolom per specialist. De baan komt uit wie de stap in zijn eigen kop *is* (eerste drie woorden), aangevuld met `owners:` uit de frontmatter. Zonder minstens twee genoemde specialisten degradeert hij naar de gewone stappenlijn — WS-002 en WS-005 zeggen simpelweg nergens wie wat doet, en een baan van één is geen zwembaan. Nieuw knooptype `lane` als kolomkop, met `Users`-glyph, `--surface-2`/`--border` (bestaande tokens) en een eigen legenda-regel.
  - **Beslissing over de 3 hardcoded converters: ze blijven, als expliciete override-laag.** Niet uit voorzichtigheid alleen — ik heb de generieke uitvoer voor die drie feitelijk vergeleken door de override tijdelijk over te slaan. SOP-013 wordt generiek 12 nodes (één beslismoment met vijf routes) tegen 29 nodes hardcoded (Vraag A→B→C-ketting mét de Mediahub-poort en de video-uitzondering); SOP-004 verliest de severity-ladder en de CRITICAL-escalatie; SOP-017 verliest de twee benoemde armen van de tweesprong en hun samenkomst. Dat is precies de rijkdom waarvoor die converters geschreven zijn, en hun uitvoer draagt al Nemesis' fase-1-akkoord. `CONVERTERS` heet nu `OVERRIDES`, en een regel eruit halen laat dat bestand vanzelf door de generieke parser lopen — de migratieroute ligt open zonder verdere code.
  - **Guidelines bewust ongemoeid** (Hermes' scope-beslissing): `documentKind()` kent alleen `sop` en `workstream`, en sluit `INDEX.md` in beide mappen uit — dat is een inhoudsopgave, geen procedure.
  - **Offline-controle over alle 42 documenten** (esbuild-bundel van de echte parser, geen tweede implementatie): 42/42 een spec, nul uitzonderingen, nul lege diagrammen, nul roosterbotsingen, nul zwevende edges, nul dubbele edge-id's, nul labels boven het karakterbudget. Vormverdeling: 17 lineaire stappen, 6 zwembanen, 5 stappen-met-tweesprong, 4 gefaseerde pipelines, 3 sub-procedures, 1 beslisboom.
  - **Live geverifieerd in de draaiende Cockpit** (127.0.0.1:4317) via echte Chrome + CDP conform [[SOP-005-nemesis-quality-gate]] §Phase 2 — echte wachttijden en `document.fonts.ready`, nooit `--virtual-time-budget`. Alle 42 documenten op 1440/donker: knop aanwezig, canvas geschilderd, node- en edge-aantallen gelijk aan de offline-controle, nul console-fouten, nul kaartoverlap, `aria-label` en `tabindex` op elke kaart, proza staat nog onder het diagram. Daarna 16 structureel verschillende documenten × 375/768/1280 × licht/donker = 96 combinaties: nul fouten op 94.
  - **Vier defecten tijdens die visuele controle zelf gevonden en gerepareerd** (alle vier in code van deze fase): (1) de waaier van `Start` naar §B/§C liep dwars over de kaart van §A/§B heen, waardoor drie alternatieven als een volgorde lazen — nieuw veld `DiagramEdge.enter`, waarmee de waaier van bovenaf binnenkomt en de horizontale loop in de lege rij erboven blijft; (2) een stap met een harde regel (`GEEN AFWIJKING TOEGESTAAN`) is een `warning`-kaart, en de standaardregel liet de pijl *ernaartoe* stippelen — terwijl de legenda erboven een stippel als uitzonderingspad definieert; ruggengraat-edges zijn nu altijd `flow`; (3) een woord breder dan de kaart werd door `overflow: hidden` recht afgekapt zonder ellips (WS-008 "voorstel-/inzichtendocument") — `overflow-wrap: anywhere`, dezelfde ingreep die `.dg-title` al had; (4) de legenda-regel én de zin "gestippelde pijlen zijn uitzonderingspaden" stonden er ook bij diagrammen zónder uitzonderingspad — nu allebei voorwaardelijk.
  - **Vijf onjuiste labels/knooptypes weggehaald door de heuristiek te versmallen op basis van echte tegenvoorbeelden**, niet op gevoel: actor-detectie kijkt nu alleen naar de eerste drie woorden (WS-006 opende anders een Sander-baan omdat een kop zijn posts als bron noemde); een overdracht wordt alleen aan de kop afgelezen (SOP-001's "Add the row to agent-index" werd overdracht omdat de alinéa eronder over "route to them" ging); een goedkeuringspoort in de body vereist een expliciete wachtformulering (SOP-001 stap 9 werd beslismoment door een openingszin over een goedkeuring die al gebeurd was); een `A -> B`-kop toont beide partijen in het onderschrift in plaats van alleen de tweede; en een vetgedrukte kop van een lijstitem wordt als label gebruikt, tenzij dat vet de actor is (WS-007's `**Hermes + Penn**`).
  - **Eén FAIL blijft staan en is aantoonbaar niet van deze taak:** WS-002 geeft op 768px 43px horizontale overflow. Nagemeten mét diagram open en mét diagram dicht: `scrollWidth` is in beide gevallen 811px, en het overlopende element is een 779px brede markdown-tabel in het proza, buiten `.dg-section`. Dezelfde categorie als de GL-003-tabeloverflow die in fase 1 al apart is vastgesteld.
  - Contrast op het nieuwe `lane`-kaarttype, gemeten uit de computed kleuren tegen de gemeten canvasgrond: label 15,40:1, onderschrift en glyph 9,81:1 (donker). Edge-stroke onveranderd 5,54:1 bij 1,5px — hetzelfde `--diagram-edge` uit fase 1. Toetsenbordpad met echte Tab-events: knop met Enter te openen, elke kaart bereikbaar, zichtbare 2px-focusring op elke kaart.
  - `tsc --noEmit` schoon, `npm run build` slaagt. De zware React Flow-chunk blijft achter de lazy grens (`SopDiagramCanvas` 4,77 kB / 2,11 kB gzip, ongewijzigd). De omzetlaag zelf is 20,7 kB minified / 7,9 kB gzip en blijft bewust synchroon: hem achter een `import()` zetten scheelt ~4 kB op een bundel over loopback en kost een laadtoestand, een navigatie-race en een knop die een frame te laat verschijnt.
- 2026-08-21 10:40 (bezalel) — opgepakt, fase 2 gestart. Priors geladen uit de parent-taak [[tsk-2026-08-19-003]] (volledige fase-1-bouwcontext, inclusief de twee Nemesis-reparatierondes en het `--diagram-edge`-token) en [[GL-003-design-system]]. Let op: het bestand stond nog untracked in git, dus `git mv` faalde met `bad source`; met een gewone `mv` verplaatst — er is geen history om te verliezen, de eerste commit legt hem meteen op de juiste plek vast.

## Outcome
_(filled when status flips to done — see SOP-close-task)_

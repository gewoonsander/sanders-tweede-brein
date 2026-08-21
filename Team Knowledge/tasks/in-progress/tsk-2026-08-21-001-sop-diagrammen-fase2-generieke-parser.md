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
updated: 2026-08-21T11:30:00Z
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
- 2026-08-21 10:40 (bezalel) — opgepakt, fase 2 gestart. Priors geladen uit de parent-taak [[tsk-2026-08-19-003]] (volledige fase-1-bouwcontext, inclusief de twee Nemesis-reparatierondes en het `--diagram-edge`-token) en [[GL-003-design-system]]. Let op: het bestand stond nog untracked in git, dus `git mv` faalde met `bad source`; met een gewone `mv` verplaatst — er is geen history om te verliezen, de eerste commit legt hem meteen op de juiste plek vast.
- 2026-08-21 11:25 (bezalel) — **generieke parser gebouwd; alle 34 SOP's en 9 Workstreams leveren nu een diagram op.** Drie nieuwe bestanden in `web/src/components/diagram/`: `procedureReader.ts` (leest structuur, bouwt niets — de heuristieken zitten hier), `genericParser.ts` (structuur → `DiagramSpec`, SOP-ruggengraat én Workstream-zwembanen), `specBuilder.ts` (de node/edge-accumulator die fase 1 privé in `sopDiagrams.ts` had; verplaatst zodat oude en nieuwe converters één builder delen). Gewijzigd: `sopDiagrams.ts` (registry), `diagramTypes.ts` (drie nieuwe vormen + knooptype `lane` + `DiagramEdge.enter`), `markdownShapes.ts` (`withoutFrontmatter`/`frontmatterBlock` erheen verhuisd), `SopDiagramCanvas.tsx`, `StepNode.tsx`, `SopDiagram.tsx`, `diagram.css`, `views/FileView.tsx`. **`index.css` is niet aangeraakt** — nul nieuwe tokens; alle 28 `var(--…)` in `diagram.css` bestonden al.
  - **De heuristiek is een cascade, sterkste structuur eerst**, afgeleid uit het daadwerkelijk doorlezen van alle 43 documenten: (0) `§A/§B/§C`-sub-procedures → parallelle kolommen; (1) genummerde H2-koppen (`Stap N`, `Fase N`, `Phase N`, `Tier N`, `N.`); (2) genummerde H3-koppen binnen hun container-H2 (`## Procedure` → `### Phase 1..4`); (3) een genummerde lijst onder een "Procedure"-achtige kop; (4) gewone H2-secties minus een blokkeerlijst van contextkoppen, waarbij een sectie mét genummerde lijst in die lijst uitklapt; (5) losse bullets, hard gecapt. Beslismomenten komen uit tweekoloms **route**tabellen (bewust smal — Team Knowledge staat vol referentietabellen; SOP-002's 40-rijige schemamap uitwaaieren was de valkuil), uit `Label → Bestemming`-regels in codeblokken, uit een vraagteken, en uit goedkeuringspoorten.
  - **Workstreams krijgen zwembanen** met één kolom per specialist. De baan komt uit wie de stap in zijn eigen kop *is* (eerste drie woorden), aangevuld met `owners:` uit de frontmatter. Zonder minstens twee genoemde specialisten degradeert hij naar de gewone stappenlijn — WS-002 en WS-005 zeggen simpelweg nergens wie wat doet, en een baan van één is geen zwembaan. Nieuw knooptype `lane` als kolomkop, met `Users`-glyph, `--surface-2`/`--border` (bestaande tokens) en een eigen legenda-regel.
  - **Beslissing over de 3 hardcoded converters: ze blijven, als expliciete override-laag.** Niet op gevoel — ik heb de generieke parser rechtstreeks op die drie documenten losgelaten en de uitvoer naast elkaar gelegd. Gemeten: SOP-013 **13 nodes / 12 edges** generiek (één beslismoment met zes uitkomsten) tegen **29/28** hardcoded (de Vraag A→B→C-ketting mét de Mediahub-poort en de video-uitzondering); SOP-004 **6/5** generiek (vier fasen, verder niets) tegen **16/15** hardcoded (de fase-opleveringen, de severity-ladder en de CRITICAL-escalatie); SOP-017 **10/9** generiek — een rechte lijst zonder tweesprong — tegen **18/18** hardcoded (de twee benoemde armen die weer samenkomen). Alle drie zijn generiek dus strikt armer, en hun huidige uitvoer draagt al Nemesis' fase-1-akkoord: een goedgekeurd diagram vervangen door een dunner diagram om 400 regels te schrappen is een ruil de verkeerde kant op. `CONVERTERS` heet nu `OVERRIDES`, en een regel eruit halen laat dat bestand vanzelf door de generieke parser lopen — de migratieroute ligt open zonder verdere code.
  - **Eén gemeten randgeval, bewust niet "opgelost":** als de láátste stap van een document zelf een let-op- of blokkerende stap is, wint dat knooptype van het eind-knooptype en heeft het diagram geen zichtbare afsluiter. Dat trof geen van de 43 uitgeleverde diagrammen (nagemeten: alle 43 hebben een `end`-node); het is alleen zichtbaar in de counterfactual hierboven, waar SOP-017 generiek op een let-op-stap eindigt. De alternatieven waren een verzonnen "Einde"-kaart (in strijd met de regel dat elk woord op het canvas uit het document komt) of het waarschuwingssignaal weggooien. Geen van beide is het waard; vastgelegd in plaats van weggepoetst.
  - **Guidelines bewust ongemoeid** (Hermes' scope-beslissing): `documentKind()` kent alleen `sop` en `workstream`, en sluit `INDEX.md` in beide mappen uit (de mappen tellen 35 en 10 bestanden; de INDEX'en zijn de twee die afvallen) — dat is een inhoudsopgave, geen procedure.
  - **Offline-controle over alle 43 documenten** (34 SOP's + 9 Workstreams; esbuild-bundel van de echte parser, geen tweede implementatie): 43/43 een spec, nul uitzonderingen, nul lege diagrammen, nul roosterbotsingen, nul zwevende edges, nul dubbele edge-id's, nul labels boven het karakterbudget. Vormverdeling: 24 lineaire stappen, 6 stappen-met-tweesprong, 6 zwembanen, 3 gefaseerde pipelines, 3 sub-procedures, 1 beslisboom.
  - **Live geverifieerd in de draaiende Cockpit** (127.0.0.1:4317) via echte Chrome + CDP conform [[SOP-005-nemesis-quality-gate]] §Phase 2 — echte wachttijden en `document.fonts.ready`, nooit `--virtual-time-budget`. Alle 43 documenten op 1440/donker: knop aanwezig, canvas geschilderd, node- en edge-aantallen gelijk aan de offline-controle, nul console-fouten, nul kaartoverlap, `aria-label` en `tabindex` op elke kaart, proza staat nog onder het diagram. Daarna 16 structureel verschillende documenten × 375/768/1280 × licht/donker = 96 combinaties: nul fouten op 94.
  - **Vier defecten tijdens die visuele controle zelf gevonden en gerepareerd** (alle vier in code van deze fase): (1) de waaier van `Start` naar §B/§C liep dwars over de kaart van §A/§B heen, waardoor drie alternatieven als een volgorde lazen — nieuw veld `DiagramEdge.enter`, waarmee de waaier van bovenaf binnenkomt en de horizontale loop in de lege rij erboven blijft; (2) een stap met een harde regel (`GEEN AFWIJKING TOEGESTAAN`) is een `warning`-kaart, en de standaardregel liet de pijl *ernaartoe* stippelen — terwijl de legenda erboven een stippel als uitzonderingspad definieert; ruggengraat-edges zijn nu altijd `flow`; (3) een woord breder dan de kaart werd door `overflow: hidden` recht afgekapt zonder ellips (WS-008 "voorstel-/inzichtendocument") — `overflow-wrap: anywhere`, dezelfde ingreep die `.dg-title` al had; (4) de legenda-regel én de zin "gestippelde pijlen zijn uitzonderingspaden" stonden er ook bij diagrammen zónder uitzonderingspad — nu allebei voorwaardelijk.
  - **Vijf onjuiste labels/knooptypes weggehaald door de heuristiek te versmallen op basis van echte tegenvoorbeelden**, niet op gevoel: actor-detectie kijkt nu alleen naar de eerste drie woorden (WS-006 opende anders een Sander-baan omdat een kop zijn posts als bron noemde); een overdracht wordt alleen aan de kop afgelezen (SOP-001's "Add the row to agent-index" werd overdracht omdat de alinéa eronder over "route to them" ging); een goedkeuringspoort in de body vereist een expliciete wachtformulering (SOP-001 stap 9 werd beslismoment door een openingszin over een goedkeuring die al gebeurd was); een `A -> B`-kop toont beide partijen in het onderschrift in plaats van alleen de tweede; en een vetgedrukte kop van een lijstitem wordt als label gebruikt, tenzij dat vet de actor is (WS-007's `**Hermes + Penn**`).
  - **Eén FAIL blijft staan en is aantoonbaar niet van deze taak:** WS-002 geeft op 768px 43px horizontale overflow. Nagemeten mét diagram open en mét diagram dicht: `scrollWidth` is in beide gevallen 811px, en het overlopende element is een 779px brede markdown-tabel in het proza, buiten `.dg-section`. Dezelfde categorie als de GL-003-tabeloverflow die in fase 1 al apart is vastgesteld.
  - Contrast op het nieuwe `lane`-kaarttype, gemeten uit de computed kleuren tegen de gemeten canvasgrond: label 15,40:1, onderschrift en glyph 9,81:1 (donker). Edge-stroke onveranderd 5,54:1 bij 1,5px — hetzelfde `--diagram-edge` uit fase 1. Toetsenbordpad met echte Tab-events: knop met Enter te openen, elke kaart bereikbaar, zichtbare 2px-focusring op elke kaart.
  - **Negatieve controles live nagemeten** (niet alleen offline): `GL-003-design-system.md`, `GL-013-interactie-enkelvoudige-keuzes.md`, `SOPs/INDEX.md` en `Workstreams/INDEX.md` tonen géén knop terwijl hun proza wél volledig geladen is (8529 / 2456 / 6202 / 4351 tekens) — "geen knop" betekent dus "niet aangeboden", niet "nog niet klaar met laden". Positieve controle op twee documenten die in fase 1 nog geen knop hadden (`SOP-022`, `WS-005`): knop aanwezig.
  - `tsc --noEmit` schoon, `npm run build` slaagt. De zware React Flow-chunk blijft achter de lazy grens (`SopDiagramCanvas` 4,77 kB / 2,11 kB gzip, ongewijzigd). De omzetlaag zelf is 20,7 kB minified / 7,9 kB gzip en blijft bewust synchroon: hem achter een `import()` zetten scheelt ~4 kB op een bundel over loopback en kost een laadtoestand, een navigatie-race en een knop die een frame te laat verschijnt.
  - **De Nemesis-kwaliteitspoort is NIET gedraaid — geblokkeerd, niet overgeslagen.** De Agent-tool was in deze sessie niet beschikbaar (`No such tool available: Agent`), precies dezelfde blokkade als bij de eerste fase-1-poging. Alles hierboven is een zelfcontrole langs [[SOP-005-nemesis-quality-gate]] en telt uitdrukkelijk **niet** als sign-off; SOP-005's "no second-hand confirmation"-regel betekent dat Nemesis dit zelf moet zien. Hermes moet de poort alsnog laten draaien vóór de taak sluit. Wat het hardst om haar eigen ogen vraagt: (1) het nieuwe `lane`-knooptype, en of een kolomkop zónder enkele edge als kolomonderschrift leest of als losgeraakte kaart; (2) de zwembaan-lay-out en de edges die meerdere kolommen naar links teruglopen; (3) de §A/§B/§C-waaier; (4) `overflow-wrap: anywhere` op `.dg-node-label`, dat óók de drie fase-1-pilots raakt; (5) de nu voorwaardelijke legenda-dash en samenvattingszin; (6) mijn oordeel dat de WS-002-overflow op 768px pre-existing is. De Cockpit draait op 127.0.0.1:4317 met de huidige build; een headless Chrome met CDP stond op poort 9333.
  - **Let op voor Hermes — parallelle sessie heeft dit werk al gecommit.** Terwijl ik bouwde draaide een andere sessie haar close-session-backup: commit `e1443bc` ("Session backup 2026-08-21 13:24") heeft mijn hele werkboom meegenomen, inclusief alle nieuwe diagram-bestanden en de taakverplaatsing. Ik heb nagelopen dat er niets is overschreven — de commit is een superset en al mijn bestanden staan er compleet in — maar het betekent wel dat fase-2-code op `main` staat vóórdat Nemesis hem gezien heeft. Dit is precies het botsingspatroon uit hard rule 11 in [[AGENTS]]. Alleen mijn latere taakbestand-bewerkingen en de session-log staan nog ongecommit.

## Outcome
_(filled when status flips to done — see SOP-close-task)_

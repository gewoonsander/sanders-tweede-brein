---
agent_id: bezalel
session_id: sop-diagrammen-fase2-generieke-parser
timestamp: 2026-08-21T11:35:00Z
type: end-of-session
linked_sops: ["SOP-005-nemesis-quality-gate", "SOP-claim-task", "SOP-003-bezalel-build-a-component"]
linked_workstreams: []
linked_guidelines: ["GL-003-design-system"]
---

# Generieke markdown-naar-diagram-parser: "Visualiseer" staat nu op alle 43 procedure-documenten

## Context

Fase 2 van [[tsk-2026-08-21-001]], vervolg op [[tsk-2026-08-19-003]]. Fase 1 gaf de myPKA
Cockpit een "Visualiseer"-knop met drie hardcoded converters voor precies drie SOP's.
Sander: "bouw die generieke parser nu." Doel: één omzetstap die elk SOP- en elk
Workstream-document leest, zonder handwerk per document. Guidelines bleven expliciet
buiten scope.

## Wat ik heb gebouwd

- `procedureReader.ts` — leest structuur, bouwt niets. Alle heuristiek zit hier.
- `genericParser.ts` — structuur → `DiagramSpec`. SOP-ruggengraat én Workstream-zwembanen.
- `specBuilder.ts` — de node/edge-accumulator, uit `sopDiagrams.ts` gelicht zodat de
  fase-1-converters en de generieke parser er één delen.
- `sopDiagrams.ts` werd een tweelaagse registry: `OVERRIDES` (de drie fase-1-converters)
  eerst, generieke parser daarna.

## Beslissingen

**De drie hardcoded converters blijven, als override-laag.** Niet uit voorzichtigheid:
ik heb de generieke parser rechtstreeks op die drie documenten gedraaid en de uitvoer
geteld. SOP-013 13 nodes generiek tegen 29 hardcoded, SOP-004 6 tegen 16, SOP-017 10
tegen 18. Alle drie generiek strikt armer, en hun huidige uitvoer draagt al Nemesis'
fase-1-akkoord. Een regel uit `OVERRIDES` halen laat dat bestand vanzelf door de
generieke parser lopen, dus de migratieroute ligt open zonder verdere code.

**Zwembanen degraderen naar een stappenlijn bij minder dan twee genoemde specialisten.**
WS-002 en WS-005 zeggen nergens wie wat doet. Eén baan is geen zwembaan, en een lineaire
lijst als swimlane presenteren zou een bewering doen die het document niet doet.

**De parser bepaalt de VORM, het document levert de WOORDEN.** Elk label, onderschrift
en route op het canvas is tekst die in het bestand staat. Waar de bron niet zegt wie een
stap uitvoert heet de baan "Niet toegewezen" in plaats van dat er iemand wordt geraden.

## De les die het meest kostte

**Een heuristiek die je op je gevoel schrijft, is fout; een heuristiek die je tegen alle
43 echte documenten aan houdt, wordt goed.** Elke versmalling die ik uiteindelijk
doorvoerde kwam uit een concreet tegenvoorbeeld, niet uit nadenken vooraf:

- Actor-detectie keek eerst naar de hele koptekst → WS-006 opende een Sander-baan omdat
  een kop *zijn posts* als bron noemde. Nu alleen de eerste drie woorden.
- Overdracht-detectie keek ook in de body → SOP-001's "Add the row to agent-index" werd
  een overdracht omdat de alinea eronder over "route to them" ging. Nu alleen de kop.
- Goedkeuringspoort-detectie keek los in de body → SOP-001 stap 9 werd een beslismoment
  door een openingszin over een goedkeuring die al gebeurd wás.
- Signaal-detectie op het hele ingeklapte lijstitem → WS-006's "Vul alle [PLACEHOLDERS]
  in" werd een rode blokkeer-kaart omdat een latere clausule over verwijderen ging.

Steeds hetzelfde patroon: **een verkeerde glyph is een onware bewering, een ontbrekende
glyph is alleen stil.** De missende is dus de goedkopere fout, en dat is de kant waarop
elke twijfelknoop nu valt.

Tweede les, uit de visuele controle: **structureel correct is niet hetzelfde als
leesbaar.** Vier defecten waren met geen enkele telling te vinden en alleen met kijken —
de waaier van Start naar §B/§C liep dwars over een zusterkaart heen (drie alternatieven
lazen als een volgorde), een stap mét harde regel werd bereikt over een gestippelde pijl
terwijl de legenda erboven een stippel als uitzonderingspad definieert, een woord breder
dan de kaart werd zonder ellips afgekapt, en de legenda legde een streepje uit dat het
canvas nergens tekende. Screenshots maken en er echt naar kijken vond alle vier.

## Wat de volgende agent moet weten

- **De Nemesis-poort staat nog open.** De Agent-tool was in deze sessie niet beschikbaar
  (`No such tool available: Agent`) — exact dezelfde blokkade als bij fase 1. Wat ik deed
  is zelfcontrole langs [[SOP-005-nemesis-quality-gate]], geen sign-off.
- De verificatie liep via echte Chrome + CDP met wall-clock-wachttijden en
  `document.fonts.ready`. Nooit `--virtual-time-budget` — die valkuil staat niet voor
  niets in SOP-005 en gaf op deze app eerder identieke false positives vóór én na een
  echte fix.
- `TEAM_ROSTER` in `procedureReader.ts` is een codeconstante afgeleid van
  [[Team/agent-index]]. Hij zelf-uitbreidt via `owners:` in de frontmatter en via het
  positionele `<Naam>:`-patroon, maar bij een grote roosterwijziging hoort hij mee te
  bewegen.
- Nul nieuwe designtokens. Alle 28 `var(--…)` in `diagram.css` bestonden al; `index.css`
  is door dit werk niet aangeraakt (het staat wel als gewijzigd in git, maar dat is een
  losse accent-marker-wijziging van ander werk).

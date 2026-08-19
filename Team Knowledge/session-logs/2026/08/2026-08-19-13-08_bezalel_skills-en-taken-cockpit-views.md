---
agent_id: bezalel
session_id: skills-en-taken-cockpit-gecombineerde-bouwronde
timestamp: 2026-08-19T11:08:39Z
type: end-of-session
linked_sops: ["SOP-close-task", "SOP-rebuild-task-index", "SOP-005-nemesis-quality-gate"]
linked_workstreams: []
linked_guidelines: ["GL-003-design-system"]
---

# Skills- en Taken-views in de myPKA Cockpit (gecombineerde bouwronde)

## Context

Twee features raakten exact dezelfde vijf frontendbestanden: mijn Skills-overzicht
(`tsk-2026-08-19-001`) en Daedalus' Taken-familie. Beide nog niet gestart. Sander
wilde geen twee overlappende wijzigingsrondes op dezelfde bestanden.

## Wat er is afgesproken en gebouwd

Eén gecombineerde bouwronde met gesplitst eigendom: serverzijde volledig
gescheiden en parallel, de vijf gedeelde bestanden in **één diff door één
eigenaar** (ik), views bij hun eigen bouwer. Daedalus leverde blok A (de
taken-lezer); ik bouwde de skills-route, de gedeelde bedrading en — na
herverdeling door Hermes — beide views.

Resultaat: 2 herstarts en 1 QA-ronde, in plaats van 4 en 2 bij sequentieel werk.

## Wat de volgende agent moet weten

**1. De `min-width: 0`-keten in `views/team.css` is dragend, geen ruis.**
Nemesis gaf FAIL op afgekapte tekst bij 320–414px. Oorzaak: een flexitem heeft
standaard `min-width: auto` en weigert te krimpen onder zijn max-content-breedte.
De keten `.team-solo-col → .team-solo-scroll → .tk-rows → .tk-row-li → .tk-row →
.tk-row-head → .tk-row-title/-meta/-summary` moet **ononderbroken** zijn; één
voorouder zonder de regel herstelt de bodem en maakt alles eronder zinloos.
Bewust `overflow-wrap: anywhere` en niet `break-word`: alleen `anywhere` verlaagt
óók de intrinsieke min-content-breedte. Het defect bestond al vóór deze features
en trof Workstreams/SOPs/Guidelines net zo goed; de fix zit daarom in de gedeelde
klassen en repareerde alle vijf pagina's tegelijk.

**2. Twee meetvalkuilen die me bijna een verkeerde conclusie lieten trekken.**
- Een oude headless-Chrome bleef poort 9333 bezet, waardoor een nieuwe meting
  stilletjes aan de verkeerde pagina hing en een verouderde render toonde. Mijn
  eerste twee screenshots "bewezen" daardoor een defect dat al gefixt was.
- Een hash-only navigatie (`#/x` → `#/y`) herlaadt de pagina **niet**, dus een
  geïnjecteerde teststylesheet overleefde in elke volgende meting. Zonder
  geforceerde `Page.reload` gaf mijn causale toets onzin.
Les: bij visuele verificatie altijd de meting en de screenshot uit dezelfde,
aantoonbaar verse paginastaat halen — en de conclusie causaal toetsen door de fix
te ontdoen, niet alleen constateren dat het "nu goed lijkt".

**3. Verifiëren zonder nieuwe dependency kan.** Node 22+ heeft een ingebouwde
`WebSocket`, dus headless Chrome is via het DevTools Protocol aanstuurbaar zonder
Playwright/Puppeteer. Ik heb er 25 combinaties mee gemeten (5 pagina's × 5
breakpoints) plus een causale voor/na-toets. Het script bleef bewust in de
scratchpad en is niet in de repo beland.

**4. Live lezen ving een drift die een mirror gemist zou hebben.** De taak sprak
van 4 domeinskills; het waren er 5 (`icor` was toegevoegd). Dat is precies het
argument dat Sander gebruikte om de SQLite-mirror af te wijzen, hier onbedoeld
bewezen.

**5. Wat bewust NIET in het Skills-overzicht zit** — de redenering staat
uitgeschreven in `server/skillSources.js`, lees die vóór je een bron toevoegt:
- de 3 scheduled-tasks (Sanders beslissing);
- de 32 SKILL.md's onder `plugins/marketplaces/` — dat is een catalogus van
  *installeerbare* plugins, niet van wat het team heeft; ze tonen zou een
  overtuigend ogende leugen van 32 regels zijn;
- de generieke Anthropic-skills (docx/pdf/pptx/xlsx). Onderzocht op verzoek van
  Sander: de client pakt die per proces uit naar
  `join(<temp>, <VERSION>, randomBytes(16).toString("hex"))` — een willekeurig
  genoemde tempmap, geen manifest, niets stabiel leesbaars. `settings.json` kent
  wel `disableBundledSkills`/`skillOverrides`, maar dat zijn een aan/uit-schakelaar
  en overrides, geen lijst. Sander koos daarop expliciet voor weglaten in plaats
  van hardcoderen.

**6. Een geïnstalleerde-maar-uitgeschakelde skill wordt getoond mét chip**, niet
verborgen en niet stilzwijgend als beschikbaar gepresenteerd (superwhisper staat
bewust uit). Beide alternatieven zouden het bereik van het team verkeerd
weergeven.

## Openstaand

- Hub-kaart voor teamtaken (fase 2 uit Daedalus' ontwerp) — losse goedkeuring.
- `PKM/Tasks/` aansluiten: één entry in `server/taskSources.js`, de envelope
  draagt de `sources[]`-vorm al.

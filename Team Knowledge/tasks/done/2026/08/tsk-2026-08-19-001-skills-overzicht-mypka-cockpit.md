---
# Identity
id: tsk-2026-08-19-001
title: "Skills-overzicht toevoegen aan Mijn AI-team menu in mypka-cockpit"

# Ownership & priority
assignee: bezalel
priority: 3

# Status (mirrors folder location)
status: done
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-19T08:00:00Z
updated: 2026-08-19T11:08:39Z
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
linked_session_logs: [2026-08-19-13-08_bezalel_skills-en-taken-cockpit-views]
linked_journal_entries: []

# Tagging
tags: [mypka-cockpit, dashboard, frontend, skills]
---

# Skills-overzicht toevoegen aan Mijn AI-team menu in mypka-cockpit

## What this is
Het "Mijn AI-team"-flyoutmenu in de mypka-cockpit (`Expansions/mypka-cockpit/`) heeft nu zes items: Team, Sessie-log, Analyse, Workstreams, SOPs, Guidelines. Sander wil een zevende item "Skills": een overzicht met representatie en samenvatting van alle skills die het team tot zijn beschikking heeft.

Onderzoek (2026-08-19, Explore-agent) heeft de architectuur en het bestaande sjabloon in kaart gebracht:
- Workstreams/SOPs/Guidelines zijn nu al één generieke component (`family`-prop) die via een SQLite-mirror (`mypka.db`) uit `Team Knowledge/**/*.md` wordt gevoed.
- Skills leven **niet** in `Team Knowledge/` — ze zitten op user-niveau in `~/.claude/skills/*/SKILL.md` (4 stuks, mét YAML-frontmatter) en repo-niveau in `.claude/commands/*.md` (10 stuks), plus systeem-/plugin-skills (docx, pdf, pptx, xlsx, morning, code-review, security-review, etc.).

**Sander's beslissingen (via AskUserQuestion, 2026-08-19):**
- **Scope:** alles tonen — de 4 domeinskills (dartpraat, dartsdraaitdoor, spellman-outshots, transcribeer) + de 10 slash-commands + de generieke Anthropic/plugin-skills. De 3 scheduled-task "skills" (cron-routines zoals de Alex Spellman-watchlist) horen er expliciet **niet** bij.
- **Architectuur:** **geen** SQLite-mirror. Een nieuwe, lichte server-route + view die rechtstreeks de bronbestanden uitleest (`~/.claude/skills/*/SKILL.md`, `.claude/commands/*.md`, en de systeem/plugin-skill-definities), zodat het overzicht altijd actueel is zonder handmatige regeneratie.

## Context one click away
- Guideline: [[GL-003-design-system]] — bestaande design tokens waarop de view moet bouwen (zoals Workstreams/SOPs/Guidelines dat ook doen).
- Sjabloon-component (patroon, niet direct hergebruiken want deze gaat via `mypka.db`): `Expansions/mypka-cockpit/web/src/views/TeamKnowledgeListView.tsx`
- Menu-definitie: `Expansions/mypka-cockpit/web/src/components/Sidebar.tsx` (regel 114, `TEAM_FLYOUT_ITEMS`-array)
- Routing: `Expansions/mypka-cockpit/web/src/lib/router.ts`, dispatch in `Expansions/mypka-cockpit/web/src/App.tsx` (regel 157)
- i18n: `Expansions/mypka-cockpit/web/src/lib/i18n/nl.ts` (regel 104-135) en `en.ts`

## Success criteria
- Nieuw menu-item "Skills" in het "Mijn AI-team"-flyoutmenu, tussen/na Guidelines, met eigen route en i18n-labels (NL + EN).
- Overzichtspagina toont per skill: naam, korte samenvatting/beschrijving, en herkomst-categorie (domeinskill / slash-command / systeem-plugin-skill) — visueel consistent met het bestaande Workstreams/SOPs/Guidelines-patroon (GL-003-tokens, geen hardcoded kleuren).
- Data komt rechtstreeks uit de bronbestanden (geen `mypka.db`-afhankelijkheid, geen handmatige regeneratiestap nodig).
- De 3 scheduled-task skills blijven buiten beeld.
- Nemesis-QA-check op design-system compliance en toegankelijkheid (WCAG 2.2 AA) vóór afronding.

## Updates
- 2026-08-19 08:00 (hermes) — created, na onderzoek + expliciete scope/architectuurkeuze door Sander
- 2026-08-19 (bezalel) — **Bestandsbotsing met Daedalus' teamtaken-feature. Voorstel, nog GEEN gedragen afspraak.** *(Achterhaald door de definitieve afspraak hieronder — bewaard voor de vindplaatsen en de comment-drifts.)*

  **Belangrijke beperking, expliciet vermeld:** afstemming met Daedalus is niet gelukt. `SendMessage` is in deze sessie uitgeschakeld ("SendMessage is disabled for this session, in subagents as well as here"), en er is geen alternatief agent-naar-agent kanaal beschikbaar. Onderstaande is dus **eenzijdig Bezalels voorstel op basis van Daedalus' geschreven deliverables**, niet een uitkomst van overleg. Daedalus heeft hier niet op gereageerd en er niet mee ingestemd.

  **De overlap (geverifieerd in de code, 2026-08-19).** Beide features raken exact dezelfde vijf bestanden én dezelfde regio's daarbinnen:

  | Bestand | Daedalus (Taken) | Bezalel (Skills) |
  |---|---|---|
  | `web/src/components/Sidebar.tsx` | `TEAM_ROUTES` + `TEAM_FLYOUT_ITEMS` + lucide-import | idem |
  | `web/src/lib/router.ts` | 3 plekken: union, parser, `hrefFor` | idem |
  | `web/src/App.tsx` | import + `teamFull` + `case` | idem |
  | `web/src/lib/i18n/en.ts` | `team.*`-blok | idem |
  | `web/src/lib/i18n/nl.ts` | `team.*`-blok | idem |

  Dit zijn niet aangrenzende wijzigingen maar dezelfde arrays en dezelfde type-union. Daedalus' eigen plan onderkent dit al: stap 0 en de risicotabel (§7) noemen deze taak bij naam, met als mitigatie "anders de twee features in één sessie samen doen".

  **Voorgestelde aanpak — één gecombineerde bouwronde, gesplitst eigendom:**
  1. **Blok A, serverzijde, parallel en volledig gescheiden.** Daedalus' `taskSources.js` / `taskFrontmatter.js` / `teamTasksApi.js` en Bezalels skills-route raken elkaar nergens. Elk apart te verifiëren met `curl`, geen frontend-build nodig.
  2. **Blok B, de vijf gedeelde frontendbestanden: één eigenaar, één diff.** Voorstel: Bezalel, omdat flyout/routing/i18n zijn domein is. Beide items (`team-tasks` én `skills`) worden in dezelfde beurt bedraad.
  3. **Views blijven bij hun eigen bouwer.** `TeamTasksView.tsx` bij Daedalus, `SkillsView.tsx` bij Bezalel. Geen overlap.
  4. **Eén `npm run build`, één `launchctl kickstart`, één Nemesis-QA-ronde** over beide views samen.

  **Waarom gecombineerd en niet sequentieel.** Sequentieel kost twee builds, twee LaunchAgent-herstarts (die elke geopende Cockpit-sessie onderbreken) en twee QA-rondes, waarvan de eerste een tussenstand toetst die daarna alsnog verandert. Nemesis moet de toetsenbordnavigatie door de flyout (`role="menu"`, pijltjes, Home/End, focus-terugkeer) sowieso op het eindresultaat toetsen, niet op een tussenstand met één item minder. Gecombineerd is er precies één moment waarop de gedeelde bestanden openstaan, en dan door één paar handen.

  **Openstaande punten waarop Daedalus' input nodig is vóór uitvoering:**
  - Bevestiging van de route-slug `team-tasks`.
  - De 13 i18n-sleutels uit zijn stappen 13/14, letterlijk in EN + NL. Bezalel neemt ze één-op-één over en verzint geen teksten voor Daedalus' view.
  - Icoonkeuze: `ClipboardList` of `CheckSquare` voor Taken. Geverifieerd vrij (Sidebar.tsx regel 10-13 importeert geen van beide). Voor Skills is `Sparkles` eveneens vrij.
  - Of Daedalus akkoord is met Bezalel als eigenaar van de gedeelde diff, of die zelf wil.

  **Twee comment-drifts in de gedeelde bestanden, in geen van beide plannen benoemd — wie de array aanraakt, corrigeert ze:**
  - `Sidebar.tsx` (bij `TEAM_ROUTES` en bij `TEAM_FLYOUT_ITEMS`) zegt tweemaal "**the five** routes / fly-out destinations", terwijl er nu al **zes** in staan. Na deze twee features worden het er acht.
  - `router.ts` (bij het `Route`-union) en `App.tsx` zeggen dat deze families "**from mypka.db**" komen. Beide nieuwe routes lezen géén db; die comments moeten genuanceerd worden, anders beschrijft de codebase zijn eigen architectuur verkeerd.

  **Status:** design-/afstemmingsfase. Niets geïmplementeerd, geen regel code geschreven, geen bestand in de Cockpit aangepast. Wacht op (a) Daedalus' reactie via een werkend kanaal en (b) Sanders goedkeuring van de gecombineerde aanpak via Hermes.

- 2026-08-19 (bezalel + daedalus) — **DEFINITIEVE AFSPRAAK. Dubbelzijdig bevestigd.**

  Daedalus' akkoord is via Hermes doorgegeven (het directe agent-naar-agent kanaal bleef uit; Hermes heeft gerelayd). Hij gaat akkoord met de gecombineerde bouwronde, met Bezalel als eigenaar van de vijf gedeelde bestanden en met gescheiden serverzijde, onder drie voorwaarden — alle drie geaccepteerd door Bezalel.

  **Wie bouwt wat**

  | Onderdeel | Eigenaar |
  |---|---|
  | `server/taskSources.js`, `taskFrontmatter.js`, `teamTasksApi.js` + tests, de 2 regels in `server/server.js` | Daedalus |
  | `web/src/views/TeamTasksView.tsx` | Daedalus |
  | `web/src/views/team.css` (chipstijlen) | Daedalus |
  | Skills-serverroute (live lezen van `~/.claude/skills/*/SKILL.md`, `.claude/commands/*.md`, systeem/plugin-skills) | Bezalel |
  | `web/src/views/SkillsView.tsx` | Bezalel |
  | **De vijf gedeelde bestanden** — `Sidebar.tsx`, `router.ts`, `App.tsx`, `i18n/en.ts`, `i18n/nl.ts` | **Bezalel, in één diff, voor beide features tegelijk** |

  **Volgorde — drie fasen, in deze volgorde**

  1. **Fase 1 — serverzijde, parallel.** Daedalus draait zijn blok A (stappen 2–12 uit zijn plan) inclusief tests en versheidstest. Bezalel bouwt in dezelfde fase zijn skills-route. Beide endpoints moeten aantoonbaar antwoorden op `curl` vóór fase 2 begint. Reden (Daedalus' voorwaarde 1): een route in de gedeelde diff mag niet wijzen naar een endpoint dat nog niet bestaat.
  2. **Fase 2 — de gedeelde diff.** Bezalel bedraadt beide items in één beurt: `team-tasks` én `skills` in `TEAM_ROUTES`, `TEAM_FLYOUT_ITEMS`, het `Route`-union, de parser, `hrefFor`, `teamFull`, beide `case`-regels en beide i18n-bestanden. Daarna elk zijn eigen view. Eén gezamenlijke `npm run build`.
  3. **Fase 3 — QA.** Eén Nemesis-ronde over beide views samen, op het eindresultaat met acht flyout-items.

  **Twee herstarts, niet één — correctie op het oorspronkelijke voorstel.** Daedalus' voorwaarde 2, en hij is correct: fase 1 vraagt een goedkope server-only herstart (`launchctl kickstart`, nodig voor zijn stappen 9–12), en fase 2 vraagt de gecombineerde herstart na de build. Bezalels "één herstart"-belofte klopte dus niet. De winst blijft wel staan: sequentieel bouwen zou **vier** herstarts en **twee** volledige QA-rondes kosten; gecombineerd worden het er twee en één.

  **Sleutels en labels — letterlijk overgenomen (Daedalus' voorwaarde 3)**
  - Route-slug: `team-tasks`. Vastgelegd, niet meer ter discussie.
  - De 13 `team.tasks*`/`team.flyoutTasks`-i18n-sleutels uit zijn plan-stappen 13 en 14, letterlijk in zowel `en.ts` als `nl.ts`. Bezalel verzint geen teksten voor Daedalus' view. `en.ts` eerst — `TranslationKey` wordt daaruit afgeleid, dus een ontbrekende NL-sleutel valt om in `tsc`.
  - **Volgorde in de flyout:** Taken komt ná Guidelines. Skills komt ná Taken. Eindvolgorde: Team → Sessie-log → Analyse → Workstreams → SOPs → Guidelines → Taken → Skills.
  - **Iconen:** `ClipboardList` voor Taken, `Sparkles` voor Skills. Beide geverifieerd vrij — `Sidebar.tsx` regel 10–13 importeert geen van beide. Daedalus' plan liet de keuze tussen `ClipboardList` en `CheckSquare` open en heeft die aan Bezalel gedelegeerd; wil hij alsnog `CheckSquare`, dan is dat een wijziging van één woord.

  **Comment-drifts:** Daedalus bevestigt beide vondsten en vraagt Bezalel ze in dezelfde diff mee te nemen. Akkoord — ze zitten in bestanden die Bezalel toch al openheeft:
  - `Sidebar.tsx`: "the five routes" / "the five fly-out destinations" → acht.
  - `router.ts` en `App.tsx`: "from mypka.db" → nuanceren, want `team-tasks` en `skills` lezen live van schijf, niet uit de mirror.

  **Status:** afspraak rond, nog steeds design-fase. Geen regel code geschreven, geen bestand in de Cockpit aangepast. Wacht uitsluitend nog op Sanders goedkeuring van de gecombineerde aanpak via Hermes.

- 2026-08-19 (bezalel) — **Gebouwd. Wacht op Nemesis-QA.**

  Fase 1 (server) en fase 2 (gedeelde diff + views) uitgevoerd zoals afgesproken. Daedalus' blok A stond al; mijn helft van fase 1 stond nog niet (`/api/cockpit/skills` gaf 404) en is alsnog gebouwd vóór de gedeelde diff, conform zijn voorwaarde 1.

  **Nieuw (server, Bezalel):** `server/skillSources.js`, `server/skillsApi.js`, `server/skillsApi.test.mjs`, plus 2 regels in `server/server.js`.
  **Nieuw (frontend, Bezalel):** `web/src/views/TeamTasksView.tsx`, `web/src/views/SkillsView.tsx`.
  **Gewijzigd (de gedeelde diff, één eigenaar):** `Sidebar.tsx`, `router.ts`, `App.tsx`, `i18n/en.ts`, `i18n/nl.ts`, `views/team.css`.

  **Scopewijziging t.o.v. de afspraak:** Hermes heeft `TeamTasksView.tsx` en `team.css` aan Bezalel toegewezen; in de afspraak hierboven stonden die op Daedalus' naam. Daedalus heeft blok A opgeleverd en is daarna gestopt. Vastgelegd zodat de afspraak en de werkelijkheid niet uiteenlopen.

  **Geverifieerd**
  - 22/22 servertests groen (Daedalus 14 + Bezalel 8).
  - `npm run build` schoon — `tsc -b` dwingt af dat `nl.ts` en `en.ts` dezelfde sleutelset hebben.
  - Tellingen gelijk aan schijf: open 11, in-progress 2, done 3, cancelled 0, blocked 1, totaal 16.
  - Versheidstest skills: nieuw bestand in `.claude/commands/` verschijnt en verdwijnt zónder herstart of regen. Testbestand opgeruimd.
  - Bestaande routes (`workstreams`/`sops`/`guidelines`) nog 200 — geen regressie.
  - Geen hardcoded kleur in de nieuwe CSS; de `truncate`-class niet gebruikt.

  **Twee correcties op de aannames in de plannen**
  - `blocked` is orthogonaal aan status: de enige geblokkeerde taak staat in `open/`, niet in `in-progress/`. De badge rendert daarom per rij, nooit afgeleid uit de groep.
  - De taakbeschrijving noemt 4 domeinskills; het zijn er inmiddels **5** (`icor` is erbij gekomen). Live lezen ving dat vanzelf op — een mirror had dit gemist.

  **Drie scope-oordelen die Sander moet bevestigen** (uitgeschreven in `server/skillSources.js`):
  1. De 3 scheduled-tasks zijn uitgesloten — conform Sanders eigen beslissing.
  2. De 32 SKILL.md's onder `plugins/marketplaces/` zijn **niet** opgenomen: dat is een catalogus van *installeerbare* plugins, niet van wat het team heeft. Wél opgenomen: daadwerkelijk geïnstalleerde plugins uit `installed_plugins.json` — vandaag alleen superwhisper, getoond mét een `uitgeschakeld`-chip omdat die bewust uit staat.
  3. De generieke Anthropic-skills (docx/pdf/pptx/xlsx) zitten **niet** in het overzicht. Ze zitten in de client zelf en hebben geen bestand op schijf; een hardgecodeerde lijst zou verzonnen data zijn. Bewust weggelaten in plaats van gefabriceerd — dit is de enige afwijking van de oorspronkelijke scope en vraagt een expliciet akkoord.

  **Nog te doen:** Nemesis-QA (WCAG 2.2 AA + GL-003). Kon niet zelf worden aangevraagd — `SendMessage` is deze sessie uitgeschakeld, ook richting Nemesis. Hermes moet die ronde uitzetten.

- 2026-08-19 (bezalel) — **Nemesis FAIL verholpen: horizontale overflow in de gedeelde `.tk-*`-klassen.**

  Nemesis gaf FAIL op afgekapte tekst bij 320–414px in beide nieuwe views. Het defect zat in de **gedeelde** klassen in `views/team.css` en trof ook Workstreams/SOPs/Guidelines — het bestond dus al vóór vandaag. Sander koos voor een fix op gedeeld niveau in plaats van forken naar de twee nieuwe viewbestanden; dat is wat er gebeurd is, dus alle vijf pagina's zijn in één keer gerepareerd.

  **Oorzaak.** Een flexitem heeft standaard `min-width: auto` en weigert daardoor te krimpen onder zijn max-content-breedte. Eén lange titel of samenvatting maakte de kaart breder dan zijn container, waarna de inhoud werd afgekapt. De keten moet ononderbroken zijn: één voorouder zonder `min-width: 0` herstelt de bodem en maakt de fix eronder zinloos.

  **Fix.** `min-width: 0` over de volledige keten `.team-solo-col → .team-solo-scroll → .tk-rows → .tk-row-li → .tk-row → .tk-row-head → .tk-row-title/-meta/-summary`, plus `overflow-wrap: anywhere` op de tekstknopen. Bewust `anywhere` en niet `break-word`: alleen `anywhere` verlaagt óók de intrinsieke min-content-breedte, en dat is wat het flexitem daadwerkelijk laat krimpen. `break-word` zou visueel afbreken maar de overflow niet oplossen. Verder `max-width: 100%` op `.tk-row-id` en `.tk-meta-chip` (die krimpen bewust niet) en `flex-wrap` op `.tk-group-head`.

  **Geverifieerd met echte metingen, niet op het oog.** Via Chrome DevTools Protocol (headless Chrome, Node's ingebouwde WebSocket — geen nieuwe dependency, script stond in de scratchpad en is niet in de repo beland):
  - **25/25 schoon**: 5 pagina's (Taken, Skills, Workstreams, SOPs, Guidelines) × 5 breakpoints (320/375/414/768/1280). Geen enkele pagina scrollt horizontaal.
  - **Causale toets**: met de fix 0 geknipte elementen; met een geïnjecteerde stylesheet die precies de fix ongedaan maakt, 30 geknipte elementen op Taken@320px en 6 op Taken@375px. De fix is dus aantoonbaar dragend, geen toevalstreffer.
  - Screenshots op 320/375/1280 visueel gecontroleerd: titels, chips, blocked-reden en samenvattingen breken correct af.
  - 22/22 servertests nog groen; beide endpoints 200; geen hardcoded kleur in `team.css`.

  **Twee valkuilen die de meting bijna hadden verpest** (genoteerd omdat ze elke volgende QA-ronde raken):
  1. Een oude headless-Chrome bleef poort 9333 bezet houden, waardoor een nieuwe meting stilletjes aan de verkeerde pagina hing en een verouderde render toonde. Eerste twee screenshots waren daardoor misleidend.
  2. Een hash-only navigatie (`#/x` → `#/y`) herlaadt de pagina **niet**, dus een geïnjecteerde teststylesheet overleefde in de volgende meting. Zonder geforceerde `Page.reload` gaf de causale toets onzin.

  **Extra polish:** een slash-command toonde zowel de chip `/brainstorm` als de titel "brainstorm". De titel wordt nu onderdrukt wanneer die alleen de slug herhaalt — ook in het `aria-label`, zodat een schermlezer geen echo krijgt. Zelfde intentie als `displayTitle()` in `TeamKnowledgeListView`.

  **Status:** klaar voor her-inspectie door Nemesis.

- 2026-08-19 13:08 (bezalel) — done: Skills + Taken live in de flyout, Nemesis PASS na de gedeelde overflow-fix; generieke Anthropic-skills bewust weggelaten (geen betrouwbare bron)

## Outcome

**What shipped.** Een zevende én achtste item in het "Mijn AI-team"-flyoutmenu: **Skills** (deze taak) en **Taken** (Daedalus' teamtaken-familie), gebouwd in één gecombineerde ronde omdat beide exact dezelfde vijf frontendbestanden raakten. Skills leest live van schijf — 5 domeinskills uit `~/.claude/skills/`, 10 slash-commands uit `.claude/commands/`, en geïnstalleerde plugin-skills uit `installed_plugins.json` — zonder SQLite-mirror en zonder regeneratiestap, conform Sanders architectuurkeuze. Totaal 16 skills; een uitgeschakelde plugin-skill wordt getoond mét `uitgeschakeld`-chip in plaats van verborgen of stilzwijgend als beschikbaar gepresenteerd.

**Where it lives.** In `Expansions/mypka-cockpit/`:
- Nieuw (server): `server/skillSources.js`, `server/skillsApi.js`, `server/skillsApi.test.mjs` + 2 regels in `server/server.js`.
- Nieuw (frontend): `web/src/views/SkillsView.tsx`, `web/src/views/TeamTasksView.tsx`.
- Gewijzigd (de gedeelde diff, één eigenaar): `web/src/components/Sidebar.tsx`, `web/src/lib/router.ts`, `web/src/App.tsx`, `web/src/lib/i18n/en.ts`, `web/src/lib/i18n/nl.ts`, `web/src/views/team.css`.
- Daedalus' blok A (taken-lezer): `server/taskSources.js`, `server/taskFrontmatter.js`, `server/teamTasksApi.js` + tests.

Session-log: [[2026-08-19-13-08_bezalel_skills-en-taken-cockpit-views]].

**Samenwerking.** Gecombineerde bouwronde met Daedalus: serverzijde gescheiden en parallel, de vijf gedeelde bestanden in één diff door één eigenaar (Bezalel), views bij hun eigen bouwer. Kosten: 2 herstarts en 1 QA-ronde, tegen 4 en 2 bij sequentieel werk. Voor de Taken-familie bestond geen apart tsk-bestand (kwam rechtstreeks via Sander/Hermes), dus daar is niets te sluiten.

**Kwaliteitspoort.** Nemesis: eerst FAIL op horizontale overflow/afgekapte tekst bij 320–414px. Dat defect zat in de **gedeelde** `.tk-*`-klassen en trof Workstreams/SOPs/Guidelines net zo goed — het bestond dus al vóór deze taak. Op Sanders keuze gerepareerd op gedeeld niveau, waardoor alle vijf pagina's tegelijk gefixt zijn. Her-inspectie: **PASS**. Geverifieerd met 25 metingen (5 pagina's × 5 breakpoints) plus een causale voor/na-toets: 0 geknipte elementen mét de fix, 30 zonder. 22/22 servertests groen.

**Bewuste scopebeperking (goedgekeurd door Sander).** De generieke Anthropic-skills (docx/pdf/pptx/xlsx) zaten in de oorspronkelijke scope maar zijn **weggelaten**. Op verzoek uitgezocht: de client pakt ze per proces uit naar een willekeurig genoemde tempmap (`join(<temp>, <VERSION>, randomBytes(16).toString("hex"))`); er is geen manifest en geen stabiel leesbare bron. `settings.json` kent wel `disableBundledSkills`/`skillOverrides`, maar dat is een schakelaar plus overrides, geen lijst. Alleen hardcoderen zou werken — precies wat we wilden vermijden. Sander koos expliciet voor weglaten boven verzinnen. Ook bewust buiten beeld: de 3 scheduled-tasks (Sanders beslissing) en de 32 SKILL.md's onder `plugins/marketplaces/`, want dat is een catalogus van *installeerbare* plugins, niet van wat het team heeft. De redenering staat uitgeschreven in `server/skillSources.js`.

**Follow-ups:** geen sub-taken. Twee losse vervolgkeuzes blijven open en zijn géén blokkade: de Hub-kaart voor teamtaken (fase 2 uit Daedalus' ontwerp) en het aansluiten van `PKM/Tasks/` (één entry in `server/taskSources.js`; de API-envelope draagt de `sources[]`-vorm al).

**Lessons:** live lezen ving een drift die een mirror gemist zou hebben — de taak sprak van 4 domeinskills, het waren er 5 (`icor` toegevoegd). Dat is precies Sanders argument tegen de mirror, hier onbedoeld bewezen. Verder: de `min-width: 0`-keten in `team.css` is dragend en moet ononderbroken blijven; zie de session-log voor de twee meetvalkuilen (bezette debug-poort, hash-navigatie die niet herlaadt) die me bijna een verkeerde conclusie lieten trekken.

# Teamtaken zichtbaar maken in de myPKA Cockpit — ontwerp

- **Datum:** 2026-08-19
- **Auteur:** Daedalus (Automation Specialist)
- **Fase:** SOP-development-workflow fase 1 (brainstorm / design-first) — **niets geïmplementeerd**
- **Aanvrager:** Sander, via Hermes
- **Status:** wacht op goedkeuring

---

## 1. Wat er gevraagd is

De teamtaken uit `Team Knowledge/tasks/` (de `tsk-*.md`-bestanden waarin Hermes en de specialisten werk bijhouden) zijn nergens zichtbaar in de myPKA Cockpit. Sander wil "geen loose ends": vanuit het dashboard in één oogopslag zien wat er in zijn tweede brein speelt, inclusief openstaand teamwerk — niet alleen zijn eigen Todoist-taken.

---

## 2. Wat ik feitelijk heb aangetroffen (geverifieerd, geen aannames)

### 2.1 Teamtaken zitten inderdaad nergens in de Cockpit

`grep` over de hele cockpit-codebase (`server/`, `web/src/`, `scripts/`) op `tasks/open`, `tsk-2026`, `Team Knowledge/tasks`: **nul treffers**. Ook `scripts/regen-mypka-db.py` bevat het woord `tasks` nergens — de SQLite-mirror kent dus geen taken-tabel en er is geen bestaand pad om die te vullen.

### 2.2 Correctie op het startpunt: `actionSlots.ts` is dode code

De briefing noemt "Actions & Planning is gebouwd op het ICOR-model met drie slots in `actionSlots.ts`". Dat klopt niet meer:

- `SLOT_DEFS` uit `Expansions/mypka-cockpit/web/src/lib/actionSlots.ts` wordt **nergens geïmporteerd**. De enige verwijzing in de codebase is een comment in `components/planner/UnscheduledSidebar.tsx:14` ("Calm not-connected posture (preserved from actionSlots.ts)").
- `#/actions` mount `PlannerView` (`moduleRegistry.tsx:133-140`). De header van `PlannerView.tsx` zegt letterlijk: *"the cockpit day-planner (replaces ActionsView at #/actions)"*.
- Het PPM/BPM/Calendar-slotmodel is dus vervangen door een **tool-blinde weekplanner**: één board gevoed door `GET /api/cockpit/sources` (alle actieve task-connectors) + `GET /api/cockpit/calendar`.

Gevolg: "een vierde slot naast PPM/BPM/Calendar" bestaat niet meer als concept. Het equivalent van vandaag is: **een vierde task-connector**.

### 2.3 Er draaien al méér bronnen dan gedacht

Live gemeten op de draaiende server (`http://127.0.0.1:4317`, PID 64590, LaunchAgent `nl.gewoonsander.mypka-cockpit`):

```
GET /api/cockpit/sources
  todoist               ok=true   10 items
  jortt:gewoon-sander   ok=false  reason=misconfigured
  n8n:workflows         ok=true   41 items
GET /api/cockpit/calendar?week=2026-08-17
  ical:primary          ok=true   (events aanwezig)
```

Dus: Todoist is verbonden, de agenda is verbonden via een iCal-feed (niet via Google OAuth), ClickUp is niet geconfigureerd, en er zijn twee bronnen die de briefing niet noemde (Jortt en n8n).

### 2.4 De connector-laag is een schone, tool-blinde uitbreidingsnaad

`server/connectors/registry.js` laadt puur data uit `catalog.json`. Een nieuwe bron = **één moduulbestand + één regel in `catalog.json`**. Geen engine-wijziging, geen route-wijziging, geen frontend-wijziging. Voorwaarden: `CONNECTORS_ENABLED=1` (staat aan) en elke `keys`-entry moet resolven in `Team Knowledge/.env`.

**Belangrijk precedent:** `n8nWorkflows.js` bewijst dat een bron géén externe API en géén weekvenster nodig heeft. Die connector geeft 41 items met `due: null` en die verschijnen gewoon in de planner-sidebar. De datumloze filtering die in `todoistTasks.js` staat is een keuze van díé connector, geen regel van de planner. Teamtaken hebben vrijwel allemaal `due: null` — dat is dus geen blokkade.

### 2.5 Het Workstreams/SOP's/Guidelines-patroon is hergebruikbaar, maar zit vast aan de mirror

- `server/teamKnowledgeApi.js` bedient één generieke route `GET /api/cockpit/team-knowledge/:family` over de tabellen `workstreams` / `sops` / `guidelines`, met een strikte `FAMILY_TABLE`-map (geen SQL-identifier-injectie).
- `web/src/views/TeamKnowledgeListView.tsx` rendert alle drie families met één `family`-prop.
- Toevoegen van menu-items gaat via `TEAM_FLYOUT_ITEMS` (`components/Sidebar.tsx:114`), `router.ts` (regel 43-45, 104-106, 151-153) en `App.tsx` (regel 160-162).
- `sessionLogsApi.js` volgt exact hetzelfde patroon (read-only SELECT, `safe()`-envelope, `available:false` als de tabel ontbreekt).

### 2.6 De mirror-route heeft een gemeten versheidsprobleem

Dit is het belangrijkste technische feit van dit onderzoek:

| | tijdstempel |
|---|---|
| `mypka.db` (mirror) laatst geschreven | 2026-08-18 21:39 |
| `Team Knowledge/tasks/INDEX.md` laatst herbouwd | 2026-08-19 08:00 |

`scripts/regen-mypka-db.py` wordt aangeroepen vanuit `start-cockpit.command` (regel 33). Maar de Cockpit start op deze machine **niet** via dat script: de LaunchAgent voert rechtstreeks `node .../server/server.js` uit. De regen draait dus alleen wanneer iemand hem handmatig start (of bij close-session). De mirror loopt op dit moment ruim een halve dag achter.

Bovendien prepareren `db.js`, `teamKnowledgeApi.js` en `sessionLogsApi.js` hun SQL **bij module-load**. Een nieuwe tabel vereist daarom regen *én* een serverherstart, anders blijft de route permanent `available:false` melden.

Taakstatus verandert meerdere keren per dag. Een taakoverzicht dat een halve dag achterloopt is erger dan geen overzicht — het liegt zonder het te melden.

### 2.7 Er is een tweede, onzichtbare takenlaag: `PKM/Tasks/`

Naast de teamtaken bestaat `PKM/Tasks/` — Sanders eigen canonieke persoonlijke taaklaag (`GL-019-persoonlijke-taakarchitectuur`, `SOP-022-verwerk-persoonlijke-taak`), met mappen `inbox/ next/ waiting/ scheduled/ someday/ done/ cancelled/`. De INDEX zegt letterlijk: *"Dit is de canonieke taaklaag voor Sander. Todoist en dashboards zijn afgeleide weergaven."*

Er staan nu 2 taken in `next/`. Ook deze laag is nergens in de Cockpit zichtbaar en zit ook niet in de mirror. Dit is een tweede loose end van dezelfde soort. Zie de verduidelijkende vraag in §3.

### 2.8 Er ligt al een bijna-identieke taak open

`tsk-2026-08-19-001-skills-overzicht-mypka-cockpit` (assignee: bezalel) voegt een zevende item "Skills" toe aan hetzelfde flyoutmenu. Sander heeft daar op 2026-08-19 expliciet gekozen voor **"geen SQLite-mirror; een lichte server-route die rechtstreeks de bronbestanden uitleest, zodat het overzicht altijd actueel is zonder handmatige regeneratie."**

Dat is precies dezelfde afweging als hier, en hij is al beslist. Aanpak 2 hieronder volgt die lijn; aanpak 3 gaat er tegenin.

### 2.9 Taakbestanden zijn makkelijk te lezen

Anders dan de governance-docs (die metadata in een `- **Label:** value`-bulletblok onder de H1 hebben) hebben taken **echte YAML-frontmatter**: `id`, `title`, `assignee`, `priority`, `status`, `blocked_reason`, `blocked_by`, `created`, `updated`, `due`, `created_by`, zes `linked_*`-arrays, `tags`. Alleen scalars en inline-arrays — een minimale parser volstaat, geen YAML-dependency nodig (de server heeft er nu ook geen).

Twee valkuilen die `SOP-rebuild-task-index` al oplost en die een lezer moet overnemen:
- alleen bestanden die matchen op `tsk-*.md` (dat sluit `EXAMPLE-tsk-...welcome-to-tasks.md` en `_template.md` uit — daarom telt de INDEX 10 open terwijl `open/` 11 bestanden bevat);
- er is **geen** `blocked/`-map: geblokkeerde taken staan in `in-progress/` met een gevulde `blocked_reason`.

---

## 3. Verduidelijkende vraag (één, voor Sander — GL-013)

Er zijn twee onzichtbare takenlagen (§2.7). Welke scope moet dit ontwerp dekken?

**A** — Alleen `Team Knowledge/tasks/` (het werk van het AI-team). Kleinste scope, snelst klaar.
**B** — Alleen team, maar bouw de lezer meteen zó dat `PKM/Tasks/` er later als tweede bron bij kan zonder herbouw. Zelfde bouwtijd als A, iets meer ontwerpdiscipline.
**C** — Beide lagen nu meteen, als twee gescheiden secties in één overzicht ("Teamtaken" / "Mijn taken"). ~1,5 uur extra, maar dan is de loose end echt weg.
**D** — Beide lagen nu meteen, maar samengevoegd tot één lijst met een herkomst-chip per rij.

Mijn voorkeur: **B**. Het houdt de eerste oplevering klein en toetsbaar, terwijl de tweede laag een kwestie van één extra bronmap wordt in plaats van een verbouwing. Het ontwerp hieronder gaat uit van B.

---

## 4. Drie aanpakken

### Aanpak 1 — Teamtaken als vierde task-connector in de planner

Wat er gebeurt:

- Nieuw `server/connectors/teamTasks.js` (`kind: 'task'`), leest bij elke `fetchWeek()` de mappen `Team Knowledge/tasks/open/` en `in-progress/` van schijf en geeft `NormalizedTask[]` terug: `title` uit frontmatter, `due` uit `due` (mag `null` — precedent n8n, §2.4), `priorityRank` afgeleid van `priority` 1–4, `tags` uit `tags` + assignee, `url` als deeplink naar `#/file` zodat een kaart het markdown-bestand in de Cockpit opent. Geblokkeerde taken krijgen een eigen tag.
- Eén regel in `server/connectors/catalog.json` met een niet-geheime sleutel (bijv. `TEAM_TASKS_ENABLED`), zodat de key-gate van de registry vervuld is zonder een nepgeheim.
- Eén regel in `Team Knowledge/.env`.

| | |
|---|---|
| **Bouwtijd** | ~1–2 uur |
| **Gewijzigde bestanden** | 2 (+1 env-regel) |
| **Frontend-build nodig** | Nee — puur server-side |
| **Versheid** | Live bij elke paginalading |
| **Wat je gratis krijgt** | Drag-and-drop in de weekplanner, groeperen per bron ("Teamtaken · 12"), weekdoel-markering, done-toggle |

**Voordelen.** Verreweg de kleinste ingreep, en de enige die géén `npm run build` en géén Nemesis-QA-ronde vraagt. Sluit precies aan op de vraag "horen teamtaken onder Actions & Planning?" — antwoord: ja, als vierde bron.

**Nadelen.** Vermengt Sanders eigen acties met werk van het AI-team op één board — conceptueel precies waar hij over twijfelde. De planner is weekgericht chrome om iets dat geen weekritme heeft. Geen groepering per assignee, geen zichtbare `blocked_reason`, geen doorklik naar gekoppelde SOP's/workstreams. Vereist een serverherstart om de nieuwe module te laden.

### Aanpak 2 — Eigen "Taken"-familie in de "Mijn AI-team"-flyout, live gelezen (aanbevolen)

Wat er gebeurt:

- Nieuw `server/teamTasksApi.js`: `GET /api/cockpit/team-tasks` → `{ available, counts, items[] }`. Loopt de vier statusmappen af, matcht op `tsk-*.md`, parseert de frontmatter met een minimale scalar+inline-array-parser (~40 regels, geen nieuwe dependency), rijdt mee op de bestaande `safe()`-envelope zodat het dezelfde loopback/PIN/CSRF-poort erft als elke andere `/api/cockpit`-route, en gooit nooit — bij een onleesbaar bestand valt die ene rij weg, niet de hele lijst.
- Nieuwe route `team-tasks` in `router.ts`, dispatch in `App.tsx`, zevende (of achtste, naast Skills) item in `TEAM_FLYOUT_ITEMS`, NL- en EN-labels in `lib/i18n/`.
- Nieuwe `TeamTasksView.tsx`, gemodelleerd op `TeamKnowledgeListView.tsx`: gegroepeerd per status (In progress → Open → recent gesloten), per rij het taak-id + de titel, chips voor assignee / prioriteit / due, een duidelijke BLOCKED-badge met reden, en de hele rij als link naar `#/file` (het bestaande jailed `/api/cockpit/file`-eindpunt) zodat een klik het echte markdown-bestand opent — exact zoals Workstreams/SOP's/Guidelines dat al doen. Alleen GL-003-tokens, geen hardcoded kleuren.

| | |
|---|---|
| **Bouwtijd** | ~3–4 uur incl. i18n en Nemesis-QA |
| **Gewijzigde/nieuwe bestanden** | ~6 |
| **Frontend-build nodig** | Ja (`npm run build`) |
| **Versheid** | Live bij elke paginalading — geen regen, geen herstart |

**Voordelen.** Staat conceptueel op de juiste plek: werk van het AI-team, naast Workstreams/SOP's/Guidelines — niet vermengd met Sanders eigen acties. Toont de volledige waarheid: blocked-reden, assignee, prioriteit, due, statusverdeling. Volgt exact de architectuurkeuze die Sander vier uur eerder al maakte voor het Skills-overzicht (§2.8), dus beide features delen één patroon en desgewenst één gedeelde bestandslezer. Geen enkele afhankelijkheid van de mirror of van een regeneratiestap.

**Nadelen.** Meer bestanden dan aanpak 1, en het vraagt een frontend-build plus een QA-ronde. Twee klikken diep (flyout openen, dan Taken) — daarom fase 2 hieronder. Teamtaken zijn hiermee niet plannbaar in de week; dat kan later alsnog via aanpak 1, die geen enkel bestand van aanpak 2 raakt.

**Fase 2 (los goed te keuren, ~30–45 min bovenop):** een Hub-kaart "Teamtaken" die hetzelfde eindpunt bevraagt en de bovenste 3–5 open taken plus de tellingen toont, met een doorklik naar de volledige lijst. Gemodelleerd op `views/hub/OpenInvoicesCard.tsx`, met een eigen sleutel in `MODULE_KEYS` zodat Sander de kaart in de instellingen aan/uit kan zetten. Dit is precies Sanders optie B, en het is geen concurrerende aanpak maar een vervolgstap: zodra het eindpunt er is, is de kaart bijna gratis. Hiermee staat het overzicht op de landingspagina, wat het "in één oogopslag"-doel pas echt haalt.

### Aanpak 3 — `tasks`-tabel in de mirror + vierde familie via `teamKnowledgeApi.js`

Wat er gebeurt: `regen-mypka-db.py` krijgt een `tasks`-tabel (schema, `OWNED_TABLES`, een ingest-pass), `FAMILY_TABLE` in `teamKnowledgeApi.js` krijgt een vierde entry, en `TeamKnowledgeListView` krijgt een vierde `family`-waarde.

**Voordelen.** Maximaal hergebruik: bijna alle server- en frontendcode bestaat al. En als enige aanpak levert het twee dingen op die de andere twee niet kunnen: teamtaken worden doorzoekbaar in `notes_fts` (de globale zoekfunctie) en hun `[[wikilinks]]` worden echte kanten in de `links`-tabel, waardoor taken in de grafiekweergave verschijnen naast de SOP's en workstreams waar ze naar verwijzen.

**Nadelen — en dit is de reden dat ik hem afraad.**
- Versheid. Gemeten: de mirror liep op het moment van dit onderzoek ruim een halve dag achter (§2.6), en de regen draait op deze machine niet automatisch omdat de LaunchAgent `server.js` rechtstreeks start. Taakstatus verandert meerdere keren per dag.
- Twee handelingen per wijziging: regen draaien én de server herstarten (statements worden bij module-load geprepareerd).
- Schemawijzigingen aan `mypka.db` zijn Atlas' domein, niet het mijne — mijn contract verbiedt expliciet een solo-migratie. Dat maakt dit ook organisatorisch de zwaarste route.
- Gaat in tegen de architectuurkeuze die Sander op 2026-08-19 al maakte voor het zusterfeature.

| | |
|---|---|
| **Bouwtijd** | ~4–5 uur, plus Atlas voor de schemawijziging |
| **Versheid** | Zo oud als de laatste regen |

---

## 5. Aanbeveling

**Aanpak 2, met fase 2 (Hub-kaart) als aparte goedkeuring daarna.**

Drie redenen, in volgorde van gewicht:

1. **Versheid is hier geen detail maar de kern.** Een taakoverzicht dat niet klopt, kost meer vertrouwen dan het oplevert. Aanpak 3 is gemeten onvers; aanpak 1 en 2 zijn dat niet.
2. **Het staat conceptueel op de juiste plek.** Sander twijfelde of teamtaken een subcategorie van Actions & Planning zijn of erboven staan. Ze zijn geen van beide: het is werk van het AI-team, en de "Mijn AI-team"-flyout is precies de plek waar dat al woont.
3. **Het volgt een keuze die hij vandaag al gemaakt heeft.** Dezelfde vraag (mirror of live lezen?) is vanochtend voor het Skills-overzicht beantwoord met "live lezen". Twee features met hetzelfde patroon is één ding om te onderhouden; twee patronen is er twee.

Aanpak 1 blijft daarna gewoon beschikbaar als Sander teamtaken óók in zijn weekplanning wil kunnen slepen. De twee raken elkaar niet: aanpak 1 zit volledig in `server/connectors/`, aanpak 2 volledig daarbuiten. Het is dus geen of-of.

---

## 6. Wat NIET in scope zit (YAGNI)

- Schrijven vanuit de Cockpit. Alles read-only. Taken aanmaken, claimen en sluiten blijft bij de task-SOP's; de markdown blijft canoniek.
- `Team Knowledge/tasks/INDEX.md` parsen als databron. Dat bestand is een afgeleide die handmatig herbouwd wordt en dus per definitie kan achterlopen. De taakbestanden zelf zijn de bron.
- Filters, sorteeropties, zoekbalk. Er staan nu 12 actieve taken. Bij 50+ opnieuw bekijken.
- Een `blocked/`-map introduceren. Die bestaat niet en moet niet gaan bestaan.
- Wijzigingen aan `actionSlots.ts`. Dat bestand is dode code; opruimen is een aparte, losstaande beslissing.

---

## 7. Wat er ná goedkeuring gebeurt

1. Antwoord op de scopevraag uit §3 verwerken.
2. Uitvoerbaar stappenplan schrijven naar `Deliverables/2026-08-19-teamtaken-in-cockpit-dashboard-plan.md` (taken van 2–5 minuten, exact pad + verificatiecommando per stap), conform SOP-development-workflow fase 2. Opnieuw wachten op goedkeuring.
3. Pas daarna bouwen, met Nemesis-QA (WCAG 2.2 AA + GL-003-compliance) als poort vóór afronding.

**Er is voor dit ontwerp geen regel code geschreven en geen bestand in de Cockpit aangepast.**

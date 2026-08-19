# Teamtaken in de myPKA Cockpit — uitvoerbaar stappenplan

- **Datum:** 2026-08-19
- **Auteur:** Daedalus (Automation Specialist)
- **Fase:** SOP-development-workflow fase 2 (plan) — **nog niets geïmplementeerd**
- **Ontwerp:** [[2026-08-19-teamtaken-in-cockpit-dashboard-design]] — aanpak 2, scope **B** (goedgekeurd door Sander op 2026-08-19)
- **Status:** wacht op goedkeuring vóór fase 3

---

## 1. Doel

Een nieuw item **"Taken"** in de "Mijn AI-team"-flyout van de Cockpit, dat de teamtaken uit `Team Knowledge/tasks/` live van schijf leest en toont: gegroepeerd per status, met assignee, prioriteit, due-datum, een zichtbare BLOCKED-reden, en een klik die het echte markdown-bestand in de Cockpit opent.

**Scope B betekent concreet:** de lezer wordt gebouwd rond een *configuratielijst van bronmappen*, niet rond één hardgecodeerd pad. `PKM/Tasks/` (Sanders persoonlijke taaklaag) toevoegen is later één entry in die lijst plus vertaalsleutels — geen herbouw van lezer, endpoint of view. De API-envelope draagt daarom nu al een `sources[]`-array, ook al zit er vandaag één bron in. Dat is dezelfde vorm die `/api/cockpit/sources` al gebruikt.

## 2. Constraints — wat niet mag breken

1. **Read-only.** Geen enkele schrijfactie richting `Team Knowledge/tasks/`. Markdown blijft canoniek.
2. **Geen `mypka.db`-wijziging.** Geen schemamigratie, geen regen-aanpassing. (Schema is Atlas' domein; mijn contract verbiedt een solo-migratie.)
3. **Geen nieuwe npm-dependency.** De server heeft geen YAML-parser en krijgt er geen; het frontmatter-subset wordt handmatig geparseerd.
4. **Nooit gooien.** Een onleesbaar of corrupt taakbestand laat díé ene rij weg, nooit de hele lijst en nooit een 500.
5. **Bestaande routes ongemoeid.** `workstreams` / `sops` / `guidelines` / `session-log` / `roster` blijven werken zoals ze werken.
6. **Padcontainment.** De lezer loopt uitsluitend onder `REPO_ROOT/Team Knowledge/tasks`; elk opgelost pad wordt tegen die basis gecontroleerd vóór het gelezen wordt. Symlinks worden overgeslagen.
7. **GL-003-tokens.** Geen hardcoded kleuren of maten in nieuwe CSS. Geen `truncate`-class (het huis gebruikt een multi-line clamp).
8. **De draaiende Cockpit is gedeeld.** Hij draait als LaunchAgent (`nl.gewoonsander.mypka-cockpit`, poort 4317). Een herstart raakt elke geopende sessie.

## 3. Bestandskaart

| Pad (absoluut) | Nieuw/gewijzigd | Waarom |
|---|---|---|
| `/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/Expansions/mypka-cockpit/server/taskSources.js` | nieuw | De bronconfiguratie — dit ís de scope-B-naad |
| `.../server/taskFrontmatter.js` | nieuw | Minimale frontmatter-parser, zonder dependency |
| `.../server/taskFrontmatter.test.mjs` | nieuw | Parser-tests |
| `.../server/teamTasksApi.js` | nieuw | Mapwandeling + `GET /api/cockpit/team-tasks` |
| `.../server/teamTasksApi.test.mjs` | nieuw | Tellingen, EXAMPLE-uitsluiting, blocked-detectie |
| `.../server/server.js` | gewijzigd | 1 import + 1 registratieregel |
| `.../web/src/lib/i18n/en.ts` | gewijzigd | Nieuwe sleutels (bron van het `TranslationKey`-type) |
| `.../web/src/lib/i18n/nl.ts` | gewijzigd | Dezelfde sleutels in het Nederlands |
| `.../web/src/lib/router.ts` | gewijzigd | Route `team-tasks` (3 plekken) |
| `.../web/src/App.tsx` | gewijzigd | Import, `teamFull`, dispatch |
| `.../web/src/components/Sidebar.tsx` | gewijzigd | `TEAM_ROUTES` + `TEAM_FLYOUT_ITEMS` |
| `.../web/src/views/TeamTasksView.tsx` | nieuw | De pagina |
| `.../web/src/views/team.css` | gewijzigd | Chips voor prioriteit/assignee/blocked |

Ongemoeid: `regen-mypka-db.py`, `mypka.db`, `teamKnowledgeApi.js`, `sessionLogsApi.js`, `actionSlots.ts`, alles onder `server/connectors/`.

## 4. Gemeten uitgangswaarden (de verificatiestappen toetsen hierop)

Vastgesteld op 2026-08-19 door de mappen te tellen:

| | aantal |
|---|---|
| `open/` — bestanden die matchen op `tsk-*.md` | **10** (11 bestanden, waarvan `EXAMPLE-tsk-2026-05-10-001-welcome-to-tasks.md` niet meetelt) |
| `in-progress/` | **2**, waarvan **0** met een gevulde `blocked_reason` |
| `done/` (recursief, `YYYY/MM/`) | **3** |
| `cancelled/` (recursief) | **0** |

Deze getallen komen overeen met `Team Knowledge/tasks/INDEX.md` (Open: 10, In progress: 2). Ze veranderen zodra er een taak bijkomt of sluit — controleer ze opnieuw op het moment van uitvoeren met stap 1.

---

## 5. Stappen

Elke stap is 2–5 minuten. Voer ze in volgorde uit. Elke verificatie is een commando dat je écht draait; ga niet door bij een afwijkende uitkomst.

Alle commando's draaien vanuit `/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/Expansions/mypka-cockpit` tenzij anders vermeld.

### Blok 0 — Voorbereiding

**Stap 0 — Controleer op parallelle sessies.**
Hard rule 11: de Cockpit is gedeeld. Roep `ListAgents` aan en controleer of er geen andere sessie in dezelfde bestanden werkt. Let specifiek op `tsk-2026-08-19-001-skills-overzicht-mypka-cockpit` (Bezalel) — die taak raakt `Sidebar.tsx`, `router.ts`, `App.tsx` en beide i18n-bestanden, precies de vijf bestanden van blok B hieronder.
*Verificatie:* je hebt de lijst gelezen en kunt benoemen dat er geen overlap is. Bij overlap: stop en meld het aan Hermes.

**Stap 1 — Leg de nulmeting vast.**
```bash
cd "/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/Team Knowledge/tasks"
find open -maxdepth 1 -name 'tsk-*.md' | wc -l
find in-progress -maxdepth 1 -name 'tsk-*.md' | wc -l
find done -name 'tsk-*.md' | wc -l
find cancelled -name 'tsk-*.md' | wc -l
```
*Verwacht:* `10`, `2`, `3`, `0` — of de actuele waarden op dat moment. Noteer ze; stap 12 en 18 toetsen hierop.

### Blok A — Serverzijde (geen frontend-build nodig)

**Stap 2 — Maak `server/taskSources.js`.**
Exporteer één constante `TASK_SOURCES`: een array van bronobjecten met `id`, `label`, `root` (repo-relatief), `filePattern` (`/^tsk-.*\.md$/`) en `statusDirs` (een array van `{ dir, status, recursive }`). Voor de teambron: `open`→`open` (niet-recursief), `in-progress`→`in-progress` (niet-recursief), `done`→`done` (recursief, want `done/YYYY/MM/`), `cancelled`→`cancelled` (recursief). Zet er een commentaarblok boven dat expliciet zegt dat `PKM/Tasks/` hier later als tweede entry bij komt — dít bestand is de scope-B-naad. Geen I/O in dit bestand.
*Verificatie:*
```bash
node --input-type=module -e "import('./server/taskSources.js').then(m=>console.log(m.TASK_SOURCES.map(s=>s.id+':'+s.statusDirs.length).join(' ')))"
```
*Verwacht:* `team:4`

**Stap 3 — Maak `server/taskFrontmatter.js`.**
Eén export `parseTaskFrontmatter(text)` → `{ fm, body }`. Regels: frontmatter is het blok tussen de eerste twee `---`-regels; regels die met `#` beginnen zijn commentaar (het taak-template staat er vol mee); een `key: value`-regel levert een scalar; `"..."`-omhulsels worden gestript; `null` en een lege waarde worden `null`; `[a, b, c]` wordt een array; `[]` wordt een lege array; een niet-herkende regel wordt overgeslagen in plaats van te gooien. Geen dependency, geen `eval`.
*Verificatie:* volgt in stap 4.

**Stap 4 — Maak `server/taskFrontmatter.test.mjs`.**
Idioom van `server/integrationChecks.test.mjs` (`node:test` + `node:assert/strict`). Minimaal vier tests: (a) scalars en aanhalingstekens; (b) `linked_sops: [SOP-004-argus-security-audit]` wordt een array van 1; (c) `blocked_reason: null` wordt `null`, niet de string `"null"`; (d) een bestand zonder frontmatter geeft `{ fm: {}, body: <alles> }` in plaats van een exception. Voeg als vijfde test het echte bestand `Team Knowledge/tasks/open/tsk-2026-08-17-001-bouw-bunq-saldo-cockpit-connector.md` toe en assert `fm.assignee === 'daedalus'` en `fm.priority === 3`.
*Verificatie:*
```bash
node --test server/taskFrontmatter.test.mjs
```
*Verwacht:* `# pass 5` en `# fail 0`.

**Stap 5 — Maak `server/teamTasksApi.js` — deel 1: de wandelaar.**
Interne functie `readSource(source)`: voor elke `statusDirs`-entry de map aflopen (recursief waar `recursive: true`), alleen bestanden die matchen op `source.filePattern`, elk pad via `path.resolve` + `path.relative` tegen de bronbasis controleren (buiten de basis → overslaan), symlinks overslaan (`fs.lstatSync(...).isSymbolicLink()`), en per bestand `parseTaskFrontmatter` draaien in een `try/catch` die bij een fout die ene rij overslaat. `REPO_ROOT` komt uit `./repoRoot.js`, net als in `connectors/env.js`.
*Verificatie:* volgt in stap 7.

**Stap 6 — `server/teamTasksApi.js` — deel 2: de rijvorm en de route.**
Per taak: `id`, `title` (val terug op de bestandsnaam), `status` (de **map** wint van het `status:`-veld — dat is de driftregel uit `SOP-rebuild-task-index`), `assignee` (`null` → `'unassigned'`), `priority` (int 1–4, anders `null`), `due`, `created`, `updated`, `blocked` (boolean: waar zodra `blocked_reason` niet leeg is), `blockedReason`, `tags`, `filePath` (repo-relatief, voor de `#/file`-link). Registreer `GET /api/cockpit/team-tasks` via `registerTeamTasksRoutes(app, { safe })` — exact het patroon van `teamKnowledgeApi.js` en `sessionLogsApi.js`, zodat de route dezelfde loopback/PIN/CSRF-poort erft. Envelope: `{ available, sources: [{ id, label, available, counts: { open, inProgress, blocked, done, cancelled }, items: [] }] }`.
*Verificatie:* volgt in stap 7.

**Stap 7 — Maak `server/teamTasksApi.test.mjs`.**
Importeer de lees-functie rechtstreeks (exporteer hem naast de route, zoals `teamKnowledgeApi.js` `readFamily` exporteert). Tests: (a) de telling voor `open` is gelijk aan de uitkomst van stap 1; (b) geen enkel `id` begint met `EXAMPLE`; (c) elke `filePath` begint met `Team Knowledge/tasks/`; (d) elk item met `blocked: true` heeft een niet-lege `blockedReason`; (e) de envelope bevat een `sources`-array (de scope-B-vorm), niet een platte `items`-array op het topniveau.
*Verificatie:*
```bash
node --test server/teamTasksApi.test.mjs
```
*Verwacht:* `# fail 0`, en de open-telling gelijk aan stap 1.

**Stap 8 — Haak de route in `server/server.js`.**
Twee regels: de import naast regel 56 (`import { registerTeamKnowledgeRoutes } from './teamKnowledgeApi.js';`) en de aanroep naast regel 1237 (`registerTeamKnowledgeRoutes(app, { safe });`). Verder niets in dit bestand.
*Verificatie:*
```bash
grep -n "teamTasksApi" server/server.js
node --check server/server.js
```
*Verwacht:* twee treffers (regel ~57 en ~1238), en `node --check` geeft geen output.

**Stap 9 — Herstart de Cockpit en bevraag het endpoint.**
```bash
launchctl kickstart -k gui/$(id -u)/nl.gewoonsander.mypka-cockpit
sleep 3
curl -s "http://127.0.0.1:4317/api/cockpit/team-tasks" | python3 -m json.tool | head -40
```
*Verwacht:* `"available": true`, één bron met `"id": "team"`, en `counts.open` gelijk aan stap 1.

**Stap 10 — Toets de rijen op inhoud.**
```bash
curl -s "http://127.0.0.1:4317/api/cockpit/team-tasks" | python3 -c "
import json,sys
s=json.load(sys.stdin)['sources'][0]
print('counts', s['counts'])
print('example rows', [i['id'] for i in s['items'] if i['id'].startswith('EXAMPLE')])
print('blocked', [(i['id'], bool(i['blockedReason'])) for i in s['items'] if i['blocked']])
print('bad paths', [i['filePath'] for i in s['items'] if not i['filePath'].startswith('Team Knowledge/tasks/')])
"
```
*Verwacht:* tellingen gelijk aan stap 1; `example rows` leeg; elke blocked-rij met `True`; `bad paths` leeg.

**Stap 11 — Toets de degradatie.**
Hernoem tijdelijk één statusmap en controleer dat het endpoint blijft antwoorden in plaats van te gooien:
```bash
mv "/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/Team Knowledge/tasks/cancelled" /tmp/tasks-cancelled-tmp
curl -s -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:4317/api/cockpit/team-tasks"
mv /tmp/tasks-cancelled-tmp "/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/Team Knowledge/tasks/cancelled"
```
*Verwacht:* `200`. Controleer daarna met `ls "Team Knowledge/tasks"` dat `cancelled/` weer terugstaat vóór je verdergaat.

**Stap 12 — Toets de versheid (dit is de kern van de aanpakkeuze).**
```bash
cd "/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein"
cp "Team Knowledge/tasks/open/tsk-2026-08-19-001-skills-overzicht-mypka-cockpit.md" /tmp/tsk-verify-backup.md
cp /tmp/tsk-verify-backup.md "Team Knowledge/tasks/open/tsk-9999-99-99-999-versheidstest.md"
curl -s "http://127.0.0.1:4317/api/cockpit/team-tasks" | grep -c "tsk-9999-99-99-999"
rm "Team Knowledge/tasks/open/tsk-9999-99-99-999-versheidstest.md"
curl -s "http://127.0.0.1:4317/api/cockpit/team-tasks" | grep -c "tsk-9999-99-99-999"
```
*Verwacht:* eerst `1`, daarna `0` — zonder herstart en zonder regen. Dat is het bewijs dat de live-leesaanpak doet wat het ontwerp belooft. Controleer met `ls` dat het testbestand weg is.

### Blok B — Frontend (build vereist)

**Stap 13 — Voeg de sleutels toe aan `web/src/lib/i18n/en.ts`.**
Eerst Engels: `TranslationKey` is afgeleid van dit object (`en.ts:766`), dus dit bestand bepaalt de sleutelset. Voeg in het `team.`-blok toe: `team.flyoutTasks`, `team.tasksTitle`, `team.tasksSub`, `team.tasksEmpty`, `team.tasksEmptySub`, `team.tasksLoadError`, plus statuskoppen (`team.tasksGroupInProgress`, `team.tasksGroupOpen`, `team.tasksGroupDone`) en chiplabels (`team.tasksBlocked`, `team.tasksUnassigned`, `team.tasksPriority`, `team.tasksDue`).
*Verificatie:*
```bash
grep -c "team.tasks\|team.flyoutTasks" web/src/lib/i18n/en.ts
```
*Verwacht:* het aantal sleutels dat je hebt toegevoegd (13).

**Stap 14 — Spiegel de sleutels in `web/src/lib/i18n/nl.ts`.**
`nl` is getypeerd als `Record<TranslationKey, string>` (`nl.ts:21`), dus een ontbrekende sleutel laat `tsc` falen — dat is het vangnet. Nederlandse teksten, in de toon van de bestaande regels (`team.flyoutTasks: 'Taken'`, `team.tasksSub: 'Openstaand werk van je AI-team.'`). Geen "mirror ververst"-formulering overnemen uit de workstreams-teksten: dit overzicht is live en die zin zou onwaar zijn.
*Verificatie:*
```bash
grep -c "team.tasks\|team.flyoutTasks" web/src/lib/i18n/nl.ts
```
*Verwacht:* hetzelfde getal als stap 13.

**Stap 15 — Voeg de route toe in `web/src/lib/router.ts`.**
Drie plekken, allemaal naast de bestaande `guidelines`-regel: het `Route`-union (regel ~45), de parser (regel ~106) en `hrefFor` (regel ~153). Slug: `team-tasks`.
*Verificatie:*
```bash
grep -c "team-tasks" web/src/lib/router.ts
```
*Verwacht:* `3`.

**Stap 16 — Maak `web/src/views/TeamTasksView.tsx`.**
Model: `TeamKnowledgeListView.tsx`. Hergebruik de bestaande klassen `team-solo-view`, `team-solo-col`, `team-solo-scroll`, `tk-rows`, `tk-row-li`, `tk-row`, `tk-row--nav`, `tk-row-head`, `tk-row-id`, `tk-row-title`, `tk-row-arrow`, `tk-row-meta`, `tk-meta-chip`, `tk-row-summary` — die staan al in `team.css` (regels 388–460). Eén fetch naar `/api/cockpit/team-tasks` via `useFetch`. Render per bron een sectie (vandaag één), daarbinnen groepen In progress → Open → recent gesloten. Rij = `<a href>` naar `hrefFor({ name: 'file', src: fileRouteSrc('file', item.filePath) })`, exact zoals `fileHrefFor()` in de knowledge-view; geen `filePath` → een niet-navigeerbare kaart, nooit een dode link. Blocked krijgt een eigen chip plus de reden op de tweede regel. Calm empty state en `role="alert"`-foutstaat overnemen.
*Verificatie:* volgt in stap 19.

**Stap 17 — Voeg de chipstijlen toe in `web/src/views/team.css`.**
Naast de bestaande `.tk-meta-chip--status` (regel 458): varianten voor `--assignee`, `--priority`, `--due` en `--blocked`. Uitsluitend GL-003-tokens (`var(--…)`), geen hex-waarden, geen vaste pixelkleuren.
*Verificatie:*
```bash
grep -n "tk-meta-chip--blocked" web/src/views/team.css
grep -nE "#[0-9a-fA-F]{3,8}" web/src/views/team.css | tail -5
```
*Verwacht:* de eerste treft; de tweede toont geen nieuwe hex-regel in het blok dat je hebt toegevoegd.

**Stap 18 — Haak de view in `web/src/App.tsx`.**
Drie kleine wijzigingen: de import naast regel 19 (`TeamKnowledgeListView`), de `teamFull`-conditie (regel ~110-116) uitbreiden met `route.name === 'team-tasks'`, en een `case 'team-tasks': return <TeamTasksView />;` in `ContentRouter` naast regel 162.
*Verificatie:*
```bash
grep -c "team-tasks\|TeamTasksView" web/src/App.tsx
```
*Verwacht:* `4` (import + component-naam in de import, `teamFull`, case-regel) — controleer bij een ander getal welke van de drie plekken ontbreekt.

**Stap 19 — Voeg het menu-item toe in `web/src/components/Sidebar.tsx`.**
Twee plekken: `TEAM_ROUTES` (regel 50) uitbreiden met `'team-tasks'`, en een entry in `TEAM_FLYOUT_ITEMS` (regel 114) met `labelKey: 'team.flyoutTasks'` en een Lucide-icoon dat nog niet in de flyout zit (`Repeat2`/`ListChecks`/`BookText`/`UsersRound`/`ScrollText`/`BarChart3` zijn bezet — `CheckSquare` of `ClipboardList` is vrij). Plaats hem ná Guidelines. Het icoon moet je ook aan de bestaande `lucide-react`-import toevoegen.
*Verificatie:*
```bash
grep -n "team-tasks\|flyoutTasks" web/src/components/Sidebar.tsx
```
*Verwacht:* twee treffers.

**Stap 20 — Bouw de frontend.**
```bash
npm run build
```
Dit is `tsc -b && vite build` — de typecheck is dus onderdeel van de build. Een ontbrekende NL-sleutel of een niet-afgevangen route valt hier om.
*Verwacht:* exit code 0 en een `dist/`-schrijfregel. Bij een `tsc`-fout: los de oorzaak op, bouw niet om de fout heen.

**Stap 21 — Herstart en controleer de geserveerde app.**
```bash
launchctl kickstart -k gui/$(id -u)/nl.gewoonsander.mypka-cockpit
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:4317/api/cockpit/team-tasks"
curl -s "http://127.0.0.1:4317/" | grep -c "<div id=\"root\""
```
*Verwacht:* `200` en `1`.

**Stap 22 — Controleer de doorklik naar het bestand.**
Neem een `filePath` uit het endpoint en controleer dat de bijbehorende file-route hem serveert (dit is al bevestigd voor taakbestanden: `Team Knowledge/`-paden vallen onder `containedTeamKnowledgePath`).
```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  "http://127.0.0.1:4317/api/cockpit/file?path=Team%20Knowledge/tasks/open/tsk-2026-08-17-001-bouw-bunq-saldo-cockpit-connector.md"
```
*Verwacht:* `200`.

### Blok C — Kwaliteitspoort en afronding

**Stap 23 — Visuele controle door Sander.**
Open `http://127.0.0.1:4317/#/team-tasks` (of via Mijn AI-team → Taken). Controleer met eigen ogen: de tellingen kloppen met stap 1, de BLOCKED-taak (`tsk-2026-08-12-001-build-portable-dropbox-mcp`) toont zijn reden, en een klik op een rij opent het markdown-bestand.
*Verificatie:* Sanders bevestiging. Dit is geen commando maar wel een poort.

**Stap 24 — Nemesis-QA.**
Draai [[SOP-005-nemesis-quality-gate]] op de nieuwe view: WCAG 2.2 AA (toetsenbordnavigatie door de flyout naar het nieuwe item, focus-zichtbaarheid, contrast van de nieuwe chips, `aria-current` op de actieve nav-rij) en GL-003-compliance (geen hardcoded waarden). Niets shipt zonder haar sign-off.
*Verificatie:* Nemesis' verdict, schriftelijk.

**Stap 25 — Werk de takenadministratie bij.**
Als er voor dit werk een taakbestand bestaat: sluit het via [[SOP-close-task]] en draai daarna [[SOP-rebuild-task-index]]. Noteer in het `## Outcome`-blok welke bestanden zijn toegevoegd en dat scope B bewust één bron actief laat.
*Verificatie:*
```bash
grep -n "Last rebuilt" "/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/Team Knowledge/tasks/INDEX.md"
```
*Verwacht:* een tijdstempel van vandaag.

**Stap 26 — Session-log.**
Schrijf `Team Knowledge/session-logs/2026/08/2026-08-19-HH-MM_daedalus_teamtaken-cockpit-view.md` met `type: end-of-session`: wat gebouwd is, dat `actionSlots.ts` dode code bleek, de gemeten mirror-achterstand die aanpak 3 uitsloot, en dat `PKM/Tasks/` bewust nog niet is aangesloten maar via `taskSources.js` inplugbaar is. Geen tokens, geen sleutels.
*Verificatie:* het bestand bestaat en heeft geldige frontmatter.

---

## 6. Terugrolplan

Per blok, zonder restanten:

- **Blok A alleen:** verwijder de vijf nieuwe `server/`-bestanden, draai de twee regels in `server/server.js` terug, herstart de LaunchAgent. De Cockpit is dan exact zoals nu.
- **Blok A + B:** bovenstaande, plus de wijzigingen in `router.ts`, `App.tsx`, `Sidebar.tsx`, `en.ts`, `nl.ts` en `team.css` terugdraaien, `TeamTasksView.tsx` verwijderen, `npm run build`, herstarten.
- Omdat alles in git staat is `git diff` vóór elke stap de betrouwbaarste terugrol-referentie. Er wordt geen enkel bestand buiten de Cockpit gewijzigd, en `mypka.db` wordt niet aangeraakt — dus er is geen datamigratie om terug te draaien.

## 7. Bekende risico's

| Risico | Kans | Mitigatie |
|---|---|---|
| Bezalels Skills-taak raakt dezelfde vijf frontendbestanden | reëel — de taak staat open | Stap 0; anders de twee features in één sessie samen doen |
| Herstart onderbreekt een geopende Cockpit-sessie | zeker, kortstondig | Twee herstarts gebundeld (stap 9 en 21); Sander vooraf melden |
| Frontmatter-parser struikelt op een toekomstig taakveld | laag | Onbekende regels worden overgeslagen, niet gegooid (stap 3) + de degradatietest van stap 11 |
| `status:`-veld en map lopen uit de pas | komt voor — `SOP-rebuild-task-index` corrigeert dit expliciet | De map wint (stap 6); de view liegt dus nooit over waar een taak staat |

## 8. Wat er ná dit plan nog openstaat

- **Hub-kaart (fase 2 uit het ontwerp, §4).** Zodra `/api/cockpit/team-tasks` er is: ~30–45 min, gemodelleerd op `views/hub/OpenInvoicesCard.tsx`, met een eigen sleutel in `MODULE_KEYS` zodat de kaart aan/uit kan. Dit is wat "in één oogopslag" echt waarmaakt — het huidige plan zet het overzicht twee klikken diep.
- **`PKM/Tasks/` aansluiten.** Eén entry in `taskSources.js` plus vertaalsleutels. Dat is wat scope B koopt.
- **Teamtaken plannbaar maken** (aanpak 1 uit het ontwerp) blijft beschikbaar als losse vervolgkeuze en raakt geen enkel bestand uit dit plan.

**Er is voor dit plan geen regel code geschreven en geen bestand in de Cockpit aangepast.**

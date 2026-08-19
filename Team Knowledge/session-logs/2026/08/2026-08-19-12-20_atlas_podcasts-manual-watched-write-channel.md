---
agent_id: atlas
session_id: 613d861b-99db-4f30-9f32-d5926e099072
timestamp: 2026-08-19T10:20:58Z
type: end-of-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Podcasts — het schrijfkanaal voor `manual_watched*` (route A)

## Wat ik heb gebouwd

Sander koos route A uit §18.9 van `Expansions/mypka-cockpit/sqlite-extension/DATA-CONTRACT.md`:
een smal, apart databasekanaal naar `mypka.db` in plaats van een aparte
cockpit-tabel. Dat is nu geïmplementeerd, getest en live geverifieerd tegen de
root-database.

**Nieuw**

- `Expansions/mypka-cockpit/server/podcastsDb.js` — de enige read-write connectie
  van de cockpit naar `mypka.db`. Eigen connectie (importeert `db.js` niet),
  **lazy** geopend bij de eerste schrijfactie, `journal_mode` bewust ongemoeid.
- `Expansions/mypka-cockpit/server/podcastsApi.js` — drie GET-endpoints over
  `v_podcast_episodes_effective` plus de ene PATCH.
- `server/podcastsDb.test.mjs` + `server/podcastsApi.test.mjs` — 16 tests, alle
  groen (`npm run podcasts:test`).

**Gewijzigd**

- `server/server.js` — import + mount.
- `server/db.js` — de header beweerde "the cockpit never writes to the database";
  dat was vanaf nu onwaar. Vervangen door de expliciete carve-out.
- `package.json` — `podcasts:test` script; de `description` bevatte dezelfde
  onjuiste bewering.
- `DATA-CONTRACT.md` §18.9 — "open beslissing" → "opgelost, route A", plus een
  nieuwe **§18.10** met de endpoint-vormen.

## De les die ik wil vasthouden: begrenzing moet structureel zijn, niet conventioneel

De opdracht was "harde begrenzing, niet alleen conventie". Een whitelist-array
alleen is nog steeds conventie — iemand kan er morgen een kolom bij zetten. Wat
ik uiteindelijk heb gebouwd zijn vier lagen die onafhankelijk van elkaar werken:

1. **Geen SQL passeert de modulegrens.** Elke geëxporteerde functie neemt alleen
   getypeerde scalars (`slug`, `guid`, `platform`). Er is geen exported functie
   die een tabelnaam, kolomnaam of WHERE-fragment accepteert. Een client kán geen
   statement formuleren dat de module niet al zelf heeft geschreven.
2. **Twee bevroren SQL-literals**, één keer geprepareerd, waarden altijd gebonden.
3. **Een boot-time bewijs** (`assertScopedUpdate`) dat die twee literals bij
   module-load parseert en weigert tenzij ze één statement zijn, `podcast_episodes`
   raken, op `guid = @guid` sleutelen én uitsluitend de drie kolommen toewijzen.
   Zet er een vierde kolom bij en de server **start niet meer**, met de naam van
   de kolom in de foutmelding.
4. De CHECK-constraints in het schema als laatste net.

Laag 3 is de kern van het verschil. De whitelist is niet langer een afspraak die
je kunt vergeten, maar een test die bij elke serverstart draait. Dat is wat
"structureel" hier betekent, en het is goedkoop: het is stringanalyse, geen
database nodig.

## Waarom `guid` en niet `slug`

Al vastgelegd in §18.9, maar het is de valkuil die ik in code echt moest
afdwingen: `slug` is afgeleid en kan door een volgende sync opnieuw gegenereerd
worden. De UI routeert wél op `slug`. Dus: resolven naar `guid` binnen dezelfde
transactie als de UPDATE, en de UPDATE zelf sleutelt uitsluitend op `guid` — het
boot-time bewijs weigert een `WHERE slug = …`. Extra vangnet voor verouderde
clients: de PATCH accepteert optioneel een `guid`-pin, en bij mismatch is het een
409 in plaats van een vinkje op de verkeerde aflevering.

## Live geverifieerd, daarna teruggedraaid

Round-trip tegen `/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/mypka.db`
(de root-db, waar de migratie op is toegepast): aanzetten → view leest
`effective_play_state: played`, `effective_watch_source: manual`,
`effective_percent_complete: 100` → readonly-connectie ziet de write direct →
uitzetten → alle drie kolommen weer NULL/0. Eindstand in de database:
`SELECT COUNT(*) FROM podcast_episodes WHERE manual_watched=1 OR
manual_watched_platform IS NOT NULL OR manual_watched_at IS NOT NULL` → **0**.
Geen enkele rij achtergelaten in gewijzigde staat.

Foutpaden ook over HTTP getest: 400 (fout platform, onbekend veld), 403
(ontbrekende `X-Cockpit`-header), 404 (onbekende slug), 409 (guid-mismatch).

## Wat de volgende agent moet weten

- **De draaiende cockpit op poort 4317 draait nog de oude code.** Mijn testinstantie
  draaide op 4399 en is gestopt. De nieuwe endpoints bestaan pas na een herstart.
- **Bezalel:** gebruik `/api/cockpit/podcasts/*`, niet
  `/api/cockpit/library/podcast_episodes`. Die laatste projecteert de tabel (dus
  Apple's status alleen — een op YouTube gekeken aflevering leest daar als
  `unplayed`) en heeft geen LIMIT over 4732 rijen. Endpoint-vormen staan in §18.10.
- **Daedalus:** de sync mag de drie kolommen nooit in een `ON CONFLICT … DO UPDATE
  SET` opnemen (§18.9). Ongewijzigd, maar nu ook echt relevant.

## Twee anomalieën die ik onderweg tegenkwam

- `transcript_path` is gevuld op **0 van de 4732** afleveringen. §18.6/§18.7
  beschrijven de matcher uitvoerig; die heeft hier dus nog niets opgeleverd. Ik heb
  niet onderzocht of hij nooit is gedraaid of wel draaide en niets matchte — dat
  is een open vraag, geen conclusie.
- Eén rij in `podcasts` (`apple-podcast-1658765213`) heeft `title = NULL` en nul
  gekoppelde afleveringen, maar wel een `last_played_date` uit 2022. De
  shows-lijst toont hem daarom als een naamloze lege show.

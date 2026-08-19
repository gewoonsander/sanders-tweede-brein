---
agent_id: atlas
session_id: 613d861b-99db-4f30-9f32-d5926e099072
timestamp: 2026-08-19T09:45:20Z
type: end-of-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Podcasts — handmatige override "ook gezien via een ander platform"

Vervolg op [[2026-08-19-11-26_atlas_podcasts-library-schema]].

## De aanleiding

Sander kijkt Dartpraat deels in de Apple Podcasts-app en deels op YouTube, per
aflevering wisselend. Apple's `MTLibrary.sqlite` weet niets van de YouTube-helft,
dus `ZPLAYSTATE` blijft daar eeuwig `0`. De automatische spiegel is niet fóut maar
**systematisch onvolledig** — geen enkele verbetering aan de sync repareert dat.
Sanders keuze (optie B): automatische Apple-status blijft de basis, plus een
handmatig vinkje per aflevering dat de status overschrijft waar Apple hem mist.

## Wat ik heb gebouwd

**1. Annotatielaag op `podcast_episodes`** — géén nieuw ad-hoc mechanisme, maar
hetzelfde patroon dat de Outer World al gebruikt (DATA-CONTRACT §14.1):
onveranderlijk BRON-record met een Inner-World-ANNOTATIELAAG erbovenop, in
dezelfde rij, onder apart benoemde kolommen.

- `manual_watched` INTEGER NOT NULL DEFAULT 0, CHECK IN (0,1)
- `manual_watched_platform` TEXT, CHECK IN ('youtube','spotify','web','other')
- `manual_watched_at` TEXT ISO-8601 UTC

Twee coherentie-CHECKs maken een half-gezette trio onmogelijk. Gevolg voor de
API: **ontvinken is één UPDATE die alle drie de kolommen leegt** — alleen
`manual_watched` op 0 zetten faalt bewust met een CHECK-fout in plaats van een
spookplatform achter te laten.

**2. `v_podcast_episodes_effective`** — de OR wordt één keer berekend, in de
database. `play_state = 'played'` OF `manual_watched = 1` → `effective_play_state
= 'played'`. Zegt Apple al 'played', dan is het vinkje een no-op: de override kan
nooit averechts werken. `effective_watch_source` geeft `apple` / `manual` /
`both` / NULL, zodat de UI een handgezette rij eerlijk kan badgen in plaats van
een menselijke beslissing als Apple-telemetrie te presenteren.

**3. Partiële index** `idx_podcast_episodes_manual_watched … WHERE
manual_watched = 1` — het vinkje staat op een handvol van ~4700 rijen, dus de
index is ongeveer zo groot als het antwoord in plaats van zo groot als de tabel.
Zelfde redenering als de transcript-index.

**4. Upgradepad in `install-extensions.py`** — de CHECKs staan bewust als
KOLOM-constraints, niet als tabel-constraints, want SQLite accepteert wel een
kolom-CHECK in `ALTER TABLE ADD COLUMN` maar kan geen tabel-CHECK toevoegen.
Daardoor krijgt een bestaande installatie via ALTER exact dezelfde handhaving als
een verse installatie via CREATE.

## Ontwerpkeuze: boolean, geen enum

De override is **monotoon per eis**: hij mag alleen "gezien" TOEVOEGEN, nooit
weghalen. Een boolean heeft geen waarde die Apple kan tegenspreken. Een
`manual_play_state`-enum zou meteen `'unplayed'` toelaten — een toestand die een
vinkje niet kan uitdrukken — en zou een voorrangsregel afdwingen die de eis
expliciet uitsluit. Modelleer geen toestanden waarvan je al hebt besloten dat ze
illegaal zijn.

Het **platform** is wél een enum: waar hij het gekeken heeft is echt meerwaardig
en groeit. Een `watched_on_youtube`-boolean kost een schemamigratie bij de eerste
Spotify-aflevering. **Boolean voor het feit, vocabulaire voor de dimensie.**

## Geen botsing met de bestaande CHECK-constraints

`CHECK (status IS play_state)` en de gesloten `play_state`-vocabulaire blijven
ongemoeid, want er wordt nooit een menselijke beslissing in `play_state` /
`status` / `apple_play_state_raw` / `is_finished` / `percent_complete`
geschreven. Die vijf blijven een pure Apple-spiegel — dat is precies wat
`apple_play_state_raw` als provenance-kolom eerlijk houdt.

## Wat ik heb geverifieerd (niet aangenomen)

Alles op een scratch-db, SQLite op deze machine, 2026-08-19:

- kolom-CHECKs (ook kruis-kolom) overleven `ALTER TABLE ADD COLUMN`;
- `NOT NULL DEFAULT 0` is toegestaan in ADD COLUMN;
- de view geeft exact de waarheidstabel uit DATA-CONTRACT §18.9;
- `SELECT e.*` in een view her-expandeert bij prepare, dus latere sync-kolommen
  stromen automatisch mee;
- verse install + upgrade-install + herdraai: additief, verliesvrij, idempotent,
  gezette waarden overleven de herdraai;
- de gedocumenteerde leesquery met `IS NOT 'unplayed'` laat NULL-status-rijen
  staan (met `<>` zouden die stil verdwijnen).

## Wat dit van de nog te bouwen API vraagt — en het openstaande besluit

`server/db.js` opent `mypka.db` met `{readonly: true}` én `query_only = true`.
**De cockpit kan de UPDATE van het vinkje op dit moment niet uitvoeren.** Twee
routes, allebei werkbaar, nog niet gekozen — staat als beslispunt in
DATA-CONTRACT §18.9:

- **A** (mijn advies): een smal `server/podcastsDb.js` dat `mypka.db` read-write
  opent op een eigen connectie en uitsluitend de drie `manual_watched*`-kolommen
  mag aanraken. De read-only-regel bestaat omdat schrijfacties op een AFGELEIDE
  tabel bij de volgende regen sneuvelen — en `podcast_episodes` is expliciet niet
  afgeleid en niet regen-eigendom (§18.2), dus die grond geldt hier niet. Eén
  huis voor het feit, geen cross-database join.
- **B**: een cockpit-eigen zijtabel in `mypka-cockpit.db`. Breekt geen enkele
  bestaande regel, maar splitst één feit over twee databestanden en zet de
  OR-logica terug in JavaScript — precies de duplicatie die de view voorkomt.

Sander moet A of B kiezen voordat de API gebouwd wordt.

## Bevinding voor Bezalel

`libraryApi.js` projecteert kolommen van de TABEL en resolvet `library_slug` via
`sqlite_master WHERE type = 'table'` — je kunt hem niet op een view richten. Het
generieke grid toont dus `status`, oftewel alleen Apple's staat, en een
YouTube-gekeken aflevering leest daar als `unplayed`. De podcastsweergave moet
`podcastsApi.js` / de effectieve view consumeren, niet het generieke
`/api/cockpit/library/podcast_episodes`-endpoint. Dat was al nodig vanwege het
ontbrekende `LIMIT` (§18.8); de override maakt het niet-onderhandelbaar.

## Openstaand / risico

De handgecureerde laag van deze bron-afgeleide library (`tags`, `manual_watched*`,
`podcasts.linked_*`) heeft **geen markdown-thuis**. Hij overleeft elke regen en
elke sync, maar niet het weggooien en opnieuw opbouwen van `mypka.db`. Dat gold al
voor `tags` en `linked_*`; de override maakt het merkbaarder omdat Sander er nu
actief in gaat schrijven. Een export/round-trip naar markdown is een aparte
overweging — hier gesignaleerd, niet gebouwd.

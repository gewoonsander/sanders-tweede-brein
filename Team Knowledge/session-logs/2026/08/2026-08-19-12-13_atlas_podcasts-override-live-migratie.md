---
agent_id: atlas
session_id: 613d861b-99db-4f30-9f32-d5926e099072
timestamp: 2026-08-19T10:13:46Z
type: end-of-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Podcasts-override: migratie toegepast op de LIVE mypka.db

Sluit de lus van [[2026-08-19-11-26_atlas_podcasts-library-schema]] en
[[2026-08-19-11-45_atlas_podcasts-handmatige-override.md]]. Daedalus' sync had de
live database intussen gevuld (20 podcasts, 4732 afleveringen), maar die droeg
alleen fase 1 — de override-laag stond nog uitsluitend op een scratch-kopie.

## Welk databasebestand

`/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/mypka.db` — de
**root-database**. Geverifieerd, niet aangenomen: `server/db.js:14` doet
`const DB_PATH = path.resolve(REPO_ROOT, 'mypka.db')`, en `lsof` liet zien dat de
draaiende cockpit-server precies die inode openhad.

`Expansions/mypka-cockpit/data/mypka.db` bestaat wél, maar is **0 bytes** en
sinds 2026-08-12 niet aangeraakt — een loos artefact dat geen enkele module
opent. Ik heb 'm bewust ongemoeid gelaten. Kandidaat om op te ruimen, niet door
mij besloten.

De drie kopieën onder `.claude/worktrees/` zijn losse werkboom-databases (5,4 MB,
begin augustus) en vallen buiten scope.

## Wat er gedraaid heeft

`python3 Expansions/mypka-cockpit/sqlite-extension/install-extensions.py mypka.db --with-podcasts`,
voorafgegaan door een `--dry-run` en een volledige `.backup`-kopie.

Toegevoegd (3): `manual_watched`, `manual_watched_platform`, `manual_watched_at`.
Ververst (5 views/indexen, lossless drop+recreate): `v_podcast_episodes_effective`
plus de vier bestaande basis-objecten (`v_open_invoices`,
`v_reimbursement_pending`, `v_invoice_payment_trail`, `idx_journal_entry_date`).
Die vier horen bij de altijd-meelopende basismodule; views houden geen rijen, dus
een drop+recreate is per definitie verliesvrij.

De `library_registry`-rij voor `podcast_episodes` stond er al — Daedalus' sync had
'm geseed. De dry-run kondigde 'm nog als "if absent" aan, de echte run schoof 'm
naar "already present". Precies het idempotente gedrag dat het ontwerp belooft.

## Verificatie — voor/na identiek

| Meting | Voor | Na |
|---|---|---|
| `podcast_episodes` | 4732 | 4732 |
| `podcasts` | 20 | 20 |
| `play_state='played'` | 21 | 21 |
| `COUNT(DISTINCT guid)` | 4732 | 4732 |
| `SUM(id)` | 11198278 | 11198278 |
| `SUM(LENGTH(guid))` | 175693 | 175693 |
| `SUM(duration_seconds)` | 10701057.836 | 10701057.836 |

`PRAGMA integrity_check` → `ok`, voor én na. De vier inhoudelijke sommen zijn
bewust gekozen boven een kale rijtelling: een rijtelling ziet stille kolomschade
niet.

Nieuwe kolommen staan op positie 37/38/39, `manual_watched` als `NOT NULL DEFAULT 0`.
Nul rijen hebben een gezette waarde — de laag is aanwezig en volledig leeg.

De view telt 4732 rijen en verdeelt netjes: 21 `played/apple`, 46 `in-progress`,
4665 `unplayed`. Nog geen enkele `manual` — juist, want er is nog niets aangevinkt.

De partiële index `idx_podcast_episodes_manual_watched … WHERE manual_watched = 1`
staat er.

## De CHECKs handhaven ook via het ALTER-pad — nu op de echte db bewezen

Op de scratch-kopie voorspeld, hier op de live database bevestigd (elke test in
een transactie die ik terugrolde; naderhand nul gezette rijen):

1. alleen `manual_watched=1` zetten → faalt op
   `(manual_watched = 1) = (manual_watched_at IS NOT NULL)`;
2. `manual_watched_platform='netflix'` → faalt op de vocabulaire-CHECK;
3. platform zonder vinkje → faalt op `manual_watched_platform IS NULL OR manual_watched = 1`;
4. correct trio → slaagt, en de view klapt om naar `played / manual / 100.0`.

Kolom-CHECKs via `ALTER TABLE ADD COLUMN` leveren dus exact dezelfde handhaving
als een verse `CREATE`. Dat was de enige echte aanname in het ontwerp; hij houdt.

## Parallelle sessies — wat ik heb gezien

De cockpit-server draaide **tijdens** de migratie: PID 7566,
`server/server.js`, met een read-only handle (`FD 11r`) op dezelfde inode. Ik heb
'm bewust niet gestopt.

Waarom dat veilig was: `db.js` opent met `{readonly:true}` + `query_only`, en
better-sqlite3 houdt tussen statements door geen leestransactie open. De
`ALTER TABLE` kon dus zijn korte exclusieve lock pakken. De database staat in
`journal_mode=delete` (geen WAL), dus er is geen `-wal`/`-shm` die een tweede
schrijver had kunnen verwarren.

Na afloop gecontroleerd: proces leeft nog, handle staat nog op dezelfde inode
(nu 20135936 bytes), en `GET /api/cockpit/library/podcast_episodes?limit=1` op
poort 4317 geeft HTTP 200 met geldige JSON. SQLite her-prepareert statements
zelf na een schemawijziging, dus een herstart is niet nodig.

Van bewerkingen aan `web/src/` of `server/server.js` door een andere sessie heb
ik tijdens mijn werk **niets** gezien — geen gewijzigde tijdstempels op die
paden binnen mijn venster. Ik heb die bestanden zelf ook niet aangeraakt.

Wel gezien, en niet toevallig: Apple's `Podcasts.app` en `PodcastContentService`
draaien (sinds 10:28). Die raken alleen `MTLibrary.sqlite`, niet `mypka.db` — maar
het betekent dat de bron onder de sync kan bewegen.

## Voor Hermes: `mypka.db` staat in git

`mypka.db` is een **getrackt** bestand (laatste commit d3c59b9) en staat nu als
`M` in de working tree. De schemawijziging landt dus in de eerstvolgende
session-backup als een 20 MB binaire delta. Geen blocker, wel iets om te weten —
en op termijn een gesprek waard, want een afgeleide spiegel in git is een keuze,
geen wet.

## Backup

Pre-migratie kopie via `sqlite3 .backup` (consistent, geen filesystem-copy):
`…/scratchpad/mypka-pre-override-backup.db`, 20131840 bytes. Sessie-gebonden, dus
niet eeuwig houdbaar — de migratie is additief en verliesvrij bewezen, dus er is
geen scenario waarin hij nog nodig is.

## Wat NIET gebouwd is

De read-write API voor het schrijven van `manual_watched`. Het besluit tussen
route A (smal `server/podcastsDb.js`, read-write op eigen connectie) en route B
(cockpit-eigen zijtabel in `mypka-cockpit.db`) ligt nog bij Sander — zie
DATA-CONTRACT §18.9 en het vorige sessielog. Het schema staat nu klaar voor
allebei; die keuze wordt er niet door voorgekookt.

---
agent_id: atlas
session_id: podcasts-library-mvp-fase-1
timestamp: 2026-08-19T11:26:00Z
type: end-of-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-001-file-naming-conventions", "GL-002-frontmatter-conventions"]
---

# Podcasts-library: schema, transcript-matching en registratie (fase 1)

## Context

Sander wil in de mypka-cockpit zien welke podcast-afleveringen hij heeft
geluisterd, met een link naar bestaande transcripten. Fase 1 van een goedgekeurde
MVP. Ik leverde schema + matching + registratie; Daedalus bouwt parallel het
periodieke sync-script; de UI is nog niet aan de beurt.

Bron: Apple Podcasts' lokale CoreData-store `MTLibrary.sqlite`, read-only
benaderd. Doel: `podcasts` + `podcast_episodes` in `mypka.db`.

## Wat ik heb gebouwd

- `Expansions/mypka-cockpit/sqlite-extension/schema/09-module-podcasts.sql` —
  de twee tabellen, hun indexen en de `library_registry`-rij.
- `Expansions/mypka-cockpit/scripts/lib/podcast_transcript_match.py` — de
  matching-cascade, met een report-modus die niets schrijft en een `--apply` die
  uitsluitend de vier `transcript_*`-kolommen aanraakt.
- `install-extensions.py` — `--with-podcasts` (additief, idempotent).
- `regen-mypka-db.py` — een `EXTERNAL_LIBRARIES`-blok.
- `DATA-CONTRACT.md` §18 + een rij in de modulekaart van §1.

## Beslissingen

**1. Bron-afgeleid, niet markdown-first — dus buiten `OWNED_TABLES`.**
De canonieke bron is de database van een andere applicatie, net als bij
`audiobooks`. De regen bezit deze tabellen niet en laat ze dus staan. Sander
schrijft geen 4.7k afleveringsnotities met de hand, en een spiegel van andermans
database is geen kennis die hij bezit.

**2. Wél geregistreerd in `library_registry` — anders dan `audiobooks`.**
`podcast_episodes` draagt de volledige invariante kolomset uit §11.2, waardoor de
bestaande generieke leeslaag in `server/libraryApi.js` de library serveert
**zonder één regel nieuwe servercode**. `audiobooks` koos het omgekeerde en
betaalde daarvoor met een eigen API-module. Dat precedent herhalen we bewust
niet.

**3. `EXTERNAL_LIBRARIES` in de regen — anders verdween de registratie.**
Dit was de niet-voor-de-hand-liggende vondst van deze sessie.
`library_registry` staat wél in `OWNED_TABLES` en wordt bij elke regen gedropt en
herbouwd uit het markdown-first `LIBRARIES`-blok. Een registry-rij die alleen
door de installer wordt geschreven, verdwijnt dus stilletjes bij de eerstvolgende
regen — de library valt uit de nav zonder ook maar één foutmelding ergens.
Het nieuwe blok herzaait registry-rijen voor bron-afgeleide libraries en laat hun
data met rust. Registratie overleeft; data wordt nooit aangeraakt.

**4. `status IS play_state` als CHECK-constraint, niet als afspraak.**
De library-fundering eist een invariante `status`-kolom; voor deze library ís de
lifecycle-token de luisterstatus. In plaats van twee kolommen te laten
uiteenlopen dwingt een CHECK af dat ze gelijk zijn. Een tweede CHECK sluit de
vocabulaire (`unplayed`/`in-progress`/`played`), zodat een per ongeluk
weggeschreven rauwe `0`/`1`/`2` hard faalt in plaats van de spiegel binnen te
sluipen.

## Inzichten die het onthouden waard zijn

**Apple's gestructureerde seizoen/afleveringkolommen zijn niet alleen dun
gevuld, ze zijn ook fout.** `ZSEASONNUMBER` staat op 986 van 4732 rijen,
`ZEPISODENUMBER` op 2865 — maar erger: *"Dartpraat 18"* draagt `ZEPISODENUMBER`
21 en *"Dartpraat 28"* draagt 27. Dit kostte mij een mislukte matchronde: de
gestructureerde kolommen vuurden in tier 1 en maskeerden daarmee de hele
ordinal-tier, waardoor 14 afleveringen onvindbaar bleven. De titel is
gezaghebbend; de gestructureerde kolommen zijn hooguit een laatste redmiddel.

**`ZPLAYHEAD` is geen voortgang.** Een volledig beluisterde aflevering heeft
doorgaans playhead `0.0` — Apple reset hem bij voltooiing. Wie playhead als
voortgang leest, rapporteert elke uitgeluisterde aflevering als 0%.

**Een aflevering-op-transcript-match is een gevolgtrekking, geen feit.** Daarom
staan `transcript_match_method` en `transcript_match_score` in de tabel: een
weergave mag alles onder 0.95 tonen als *waarschijnlijke* match, niet als
zekerheid. Bij een echte gelijkstand matcht de matcher liever niet dan te gokken.

## Bevindingen voor Sander

- **"Darts Draait Door" van Sportnieuws.nl staat niet in Apple Podcasts.** Geen
  spellingsvariant en geen ontvolgd restant: er is geen showtitel die matcht en
  geen enkele afleveringsrij die op `%draait door%` of een Sportnieuws-auteur
  hit. De 135 transcripten blijven bestaan, maar er is geen luisterstatus om aan
  te koppelen.
- **13 abonnementen, geen 20.** Van de 20 shows in de store staat
  `ZSUBSCRIBED = 1` op er 13. De overige 7 zijn `ZISIMPLICITLYFOLLOWED` —
  Apple maakte de rij aan als bijwerking (één afgespeelde aflevering, een
  geopende deellink), niet doordat Sander de show volgde. Alle 7 zijn vandaag
  toegevoegd. Het schema houdt beide vlaggen apart; ze optellen tot één
  "abonnementen"-getal overdrijft de lijst met 7.
- Eén showrij (`Z_PK` 17) heeft een lege titel en nul afleveringen. De feed
  (`feeds.buzzsprout.com/56273.rss`) gaf geen antwoord en de iTunes-lookup op
  `1658765213` gaf geen resultaat, dus **welke show dit is, weet ik niet** — niet
  ingevuld met een gok.

## Openstaand

- Daedalus' sync-script moet de kolomcontract uit §18 volgen; de CHECK-constraints
  vangen afwijkingen af.
- `listLibraryItems()` heeft geen LIMIT — prima voor recepten (tientallen rijen),
  niet voor ~4700 afleveringen. Pagineren of serverside filteren vóór de grid
  shipt. Gemeld, niet gefixt: het is een gedeeld endpoint.
- `nav_icon` `Podcast` staat niet in de icon-allowlist van `LibraryView.tsx` —
  valt terug op het generieke icoon, één regel frontend-werk.

---
agent_id: atlas
session_id: podcasts-transcriptietrigger-bugfix
timestamp: 2026-08-19T12:07:00Z
type: end-of-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-002-frontmatter-conventions"]
---

# Bugfix: CHECK op `transcript_match_method` miste `'episode_ordinal'`

## De bug

Daedalus vond hem tijdens het bouwen van de transcriptietrigger. De
CHECK-constraint op `podcast_episodes.transcript_match_method` liet alleen
`'season_episode'`, `'normalized_title_exact'`, `'fuzzy_title'` en `'manual'`
toe. Mijn eigen matcher (`scripts/lib/podcast_transcript_match.py`) heeft echter
vanaf dag één een tier 2 — `'episode_ordinal'`, score 0,90 — die 14 van de 67
Dartpraat-matches produceert.

Waarom dat álle 67 kostte en niet alleen die 14: `apply_matches()` schrijft de
hele batch in één transactie. De eerste geweigerde rij gooide `IntegrityError`
en rolde de complete transactie terug. Netto-effect: `transcript_path` bleef
NULL op alle 2968 live rijen, terwijl het rapport van de matcher onverminderd
67/67 meldde. Dat rapport was correct over de matching-logica en zei niets over
de wegschrijf-stap — precies het soort stilte waarin een bug een half jaar kan
blijven zitten.

Dit was mijn fout, geen fout van de matcher: de CHECK is een **kopie** van een
vocabulaire dat in code leeft, en ik heb die kopie niet meegegroeid. §18.7 van
DATA-CONTRACT.md documenteerde `episode_ordinal` wél als tier 2, §18.6
(de vocabulaire-regel) niet. De documentatie sprak zichzelf tegen en de
constraint volgde de verkeerde helft.

## Wat ik heb gewijzigd

**1. Schemabestand** — `sqlite-extension/schema/09-module-podcasts.sql`
`'episode_ordinal'` toegevoegd aan de CHECK, plus het kolomcommentaar bijgewerkt
met de tier en zijn corroboratie-eis, en een expliciete bug-history-noot boven de
constraint: als het vocabulaire van een schrijver in code leeft, is deze lijst een
kopie — samen uitbreiden of niet uitbreiden.

**2. Installer** — `sqlite-extension/install-extensions.py`
- de CREATE van `podcast_episodes` bijgewerkt;
- nieuwe constante `TRANSCRIPT_MATCH_METHODS` als enige bron voor zowel de CREATE
  als het upgradepad, zodat een volgende methode niet meer in één van de twee kan
  blijven hangen;
- nieuwe functie `ensure_transcript_match_method_check()`, aangeroepen vanuit
  `install_podcasts()` op het bestaande-tabel-pad.

**Waarom `PRAGMA writable_schema` en niet de 12-staps-rebuild.** Een
table-level CHECK is onbereikbaar voor `ALTER TABLE` (daarom zijn de
`manual_watched*`-constraints destijds bewust als kolomconstraints geschreven —
deze is ouder en is een tabelconstraint). Blijven over: SQLite's
create-copy-drop-rename, of een herschrijving van de schematekst. De rebuild
verplaatst 2968 rijen inclusief hun `body`-shownotes én zou de **live**
kolomvolgorde moeten reproduceren, die afwijkt van de canonieke CREATE omdat de
`manual_watched*`-kolommen op deze database via ALTER zijn aangehangen en in de
CREATE middenin staan. Een `INSERT … SELECT *` over dat verschil schuift stilzwijgend
elke waarde één kolom op. De schematekst-herschrijving raakt nul datapagina's, kan
niets herordenen, en is een pure versoepeling: elke bestaande rij voldoet per
definitie aan het bredere vocabulaire. Afgedekt met `PRAGMA integrity_check`
achteraf; idempotent (no-op zodra het vocabulaire compleet is).

**3. Vocabulaire-kopieën gelijkgetrokken**
- `sqlite-extension/DATA-CONTRACT.md` §18.6 — `episode_ordinal` toegevoegd, met
  de expliciete waarschuwing dat §18.6 een kopie van §18.7 is, plus de
  bug-history;
- `web/src/lib/cockpitTypes.ts` — `PodcastTranscriptMethod` uitgebreid. Geen enkel
  label-mapje of switch in `web/src` of `server/` kent de tokens verder, dus dit
  was de laatste kopie (gecontroleerd met grep).

## Verificatie (geteld, niet aangenomen)

Eerst op een kopie in de scratchpad, daarna pas op de live `mypka.db` (met backup).

| Controle | Uitkomst |
|---|---|
| `PRAGMA integrity_check` na de ingreep | `ok` |
| rijen in `podcast_episodes` (voor/na) | 2968 / 2968 |
| rijen in `podcasts` | 13, ongewijzigd |
| `transcript_path IS NOT NULL` (voor) | 0 |
| `transcript_path IS NOT NULL` (na) | **67** |
| verdeling per methode | `season_episode` 53 · `episode_ordinal` 14 |
| scores | 1,0 voor season_episode · 0,90 voor episode_ordinal |
| `file_path` meegevuld | 67 van 67 |
| paden die naar een echt bestand wijzen | 67 van 67 |
| onbekend token nog steeds geweigerd | ja, `CHECK constraint failed` |
| installer twee keer draaien | tweede run: "Nothing to add" |

De regen kan dit niet terugdraaien: `podcast_episodes` staat niet in
`OWNED_TABLES` van `regen-mypka-db.py` (gecontroleerd), dus tabel én constraint
overleven elke regen.

## Wat de volgende agent moet weten

1. **Er is nog een tweede gat in hetzelfde vocabulaire, en dat is géén bug.**
   `scripts/podcast-transcribe-on-watch.py` merkt terecht op dat er geen methode
   bestaat voor "rechtstreeks uit de RSS-enclosure getranscribeerd met Whisper".
   Dat is geen inferentie maar een deterministische 1-op-1-link, dus die verdient
   een eigen token (voor de hand liggend: `'feed_enclosure'`, score 1.0). Ik heb
   hem bewust **niet** toegevoegd: die route bestaat nog niet en vraagt eerst een
   beslissing van Sander. Een vocabulaire vooruitlopend verbreden is precies de
   omgekeerde fout van deze bug.
2. De docstring van `run_matcher()` in `podcast-transcribe-on-watch.py`
   beschrijft de `episode_ordinal`-bug nog als "known live example (2026-08-19)".
   Dat klopt sinds vandaag niet meer. Ik heb dat bestand niet aangeraakt omdat
   Daedalus er op dit moment in werkt; de `IntegrityError`-handler zelf mag
   blijven staan, die is nog steeds correct verdedigend.
3. **Structurele les, kandidaat voor graduatie naar een guideline.** Een
   CHECK-vocabulaire dat een schrijver in code spiegelt, is een kopie zonder
   compiler die hem bewaakt. Twee dingen maken dat leefbaar: de kopie hardop
   markeren als kopie (nu gedaan op alle drie de plekken), en de schrijver de
   batch niet in één transactie laten wegschrijven, of hem per rij laten falen —
   want een te smalle CHECK faalt niet op de rijen die hij weigert, maar op de
   hele batch.

## Backup

Pre-fix kopie van de live database staat in de sessie-scratchpad als
`mypka-backup-pre-episode-ordinal-fix.db` (20,2 MB). Niet duurzaam: de
scratchpad is sessiegebonden en `mypka.db` is hoe dan ook regenereerbaar.

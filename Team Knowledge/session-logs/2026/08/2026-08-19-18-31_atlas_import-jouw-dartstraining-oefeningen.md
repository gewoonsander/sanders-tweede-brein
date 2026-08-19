---
agent_id: atlas
session_id: import-jouw-dartstraining-oefeningen
timestamp: 2026-08-19T18:31:00Z
type: close-session
linked_sops: ["SOP-002-convert-mypka-to-sqlite"]
linked_workstreams: ["WS-002-import-external-knowledge-base"]
linked_guidelines: ["GL-001-file-naming-conventions", "GL-002-frontmatter-conventions"]
---

# Import van de Huddle-cursus "Jouw Dartstraining": 22 trainbare oefeningen plus een eigen logboektabel

## Context

Sander beheert zelf de cursus "Jouw Dartstraining" in de Huddle-community Dart
Buddies. Daedalus had de volledige cursusinhoud al via de ongedocumenteerde
Huddle-API opgehaald naar een JSON-export (6 modules, 52 lessen, waarvan 22
lessen een 🎯 in de naam dragen: de losse oefeningen). Sander wilde niet alleen
de inhoud kunnen lézen maar ook kunnen bíjhouden wanneer hij een oefening doet en
met welk resultaat. Hij koos expliciet voor beide: leesbare markdown in de PKM én
een trackingtabel in `mypka.db`.

## What we did

- Atlas heeft de 22 oefeningen weggeschreven als losse notities in de nieuwe map
  `PKM/My Life/Darts Exercises/`, met `doc_type: darts-exercise`, de volledige
  oefeninstructie in de body en een lege `## Logboek`-sectie eronder.
- Atlas heeft de 30 niet-oefening-lessen (introducties, verdiepingen,
  reflecties) plus de modulestructuur bewaard in één naslagdocument
  [[jouw-dartstraining]] onder `PKM/Documents/`.
- Atlas heeft `PKM/My Life/Darts Exercises/INDEX.md` geschreven als hub, en
  [[PKM/My Life/INDEX]] en [[PKM/Documents/INDEX]] bijgewerkt.
- Atlas heeft het schema vastgelegd in [[GL-002-frontmatter-conventions]] (v2.8)
  en een template toegevoegd op `Team Knowledge/Templates/darts-exercise.md`.
- Atlas heeft de mirror-pijplijn uitgebreid:
  `Expansions/mypka-cockpit/sqlite-extension/schema/10-module-darts-exercises.sql`
  met de twee nieuwe tabellen en twee views, en
  `Expansions/mypka-cockpit/scripts/regen-mypka-db.py` met een `LIBRARIES`-entry,
  de `CREATE TABLE`-blokken, een `parse_exercise_logs()`-parser en een eigen
  ingestiepassage. Daarna de regen gedraaid: 22 rijen in `darts_exercises`, 0 in
  `darts_exercise_logs`.

## Decisions made

**Waar hoort dit in de taxonomie?** Een oefening is geen Habit (geen cadans, geen
dagelijkse ja/nee-vraag) en geen Project (geen finish). Het is een verzameling
herhaalbare items met een meetbaar resultaat per uitvoering — precies de vorm van
het bestaande *library*-patroon in de Cockpit (Recipes, Movies). Daarom een
bibliotheek onder `PKM/My Life/`, geen vijfde My Life-bucket. Bijkomend voordeel:
de Cockpit-nav is data-driven via `library_registry`, dus de map verschijnt daar
zonder één regel UI-code.

**Geen `UNIQUE(exercise_slug, log_date)` op de logtabel.** `habit_logs` heeft die
constraint bewust wél: bij een habit overschrijft de laatste check-in van de dag
de vorige. Bij een oefening zijn twee sessies op één dag twee résultaten, geen
correctie op elkaar. De kolom `seq` legt de volgorde binnen de dag vast. Dit is
het enige punt waar het paar bewust van het habits-patroon afwijkt, en het staat
als zodanig gedocumenteerd in het SQL-commentaar, in GL-002 en in DATA-CONTRACT.

**Geen `done`-kolom, wél `score`.** Het bestaan van de datumkop is het antwoord op
"heb ik het gedaan". `score` mag NULL zijn: een kale datumkop is een geldige log.

**`course` als kolom vanaf dag één.** Sander was expliciet dat hij eerst alleen
deze ene cursus wil, dus er is géén generieke multi-cursus-importer gebouwd. Maar
`course`, `source_platform`, `source_course_id` en `source_lesson_id` zitten wél
in het schema, zodat een tweede cursus later een nieuwe *waarde* is en geen
schemamigratie.

## Insights

**De bron was innerText, niet HTML.** De lestekst kwam binnen als platte tekst met
alle tags gestript, dus kopjes plakten vast aan de volgende zin
("...vertrouwen.Doel van de oefeningJe traint controle..."). Atlas heeft die
weer tot `##`-kopjes gepromoveerd met een gecureerde lijst van 26 koppen uit de
bron zelf. Twee dingen die daarbij misgingen en zijn afgevangen:

- een kórtere kop matchte binnen een al gepromoveerde langere kop ("Tips" binnen
  "Tips & uitdaging"), waardoor de kop in tweeën brak. Opgelost door eerst naar
  een placeholder te substitueren en pas na de hele ronde terug te zetten;
- de controle achteraf is een **verliesvrijheidstest**: alle alfanumerieke tekens
  van bron en resultaat moeten identiek zijn. Alle 22 teksten slagen daarvoor.
  Er is dus geen woord toegevoegd, weggehaald of verplaatst — alleen witruimte en
  opmaak.

**Het gecommentarieerde voorbeeld in de notitie kon zichzelf als log laten
tellen.** Elke oefeningnotitie draagt een HTML-comment met een voorbeeldlog,
inclusief een echt ogende datum. De parser strípt HTML-comments vóór het parsen;
zonder die stap had elke oefening meteen een spooksessie op 2026-08-19 gehad.
Geverifieerd: de kale notities leveren 0 logregels op, een testnotitie met drie
blokken (twee op dezelfde datum) levert er precies 3.

## Open threads

- Er zijn nog géén logregels: die ontstaan pas als Sander een oefening
  daadwerkelijk doet. Voeg een datumkop toe onder `## Logboek` in de notitie van
  die oefening en draai daarna de regen.
- Er is nog geen Cockpit-UI voor de logtabel zelf. De definitietabel verschijnt
  wél al in de Library-nav via `library_registry`.
- De cursus bevat 22 oefeningen maar geen enkele bevat een expliciet scoretype in
  de brontekst; `unit` is daarom vrij tekstveld en wordt per log door Sander
  ingevuld in plaats van vooraf per oefening vastgelegd. Bewust niet ingevuld:
  dat zou een aanname zijn geweest, geen bronfeit.

---
# Identity
id: tsk-2026-08-18-001
title: "945 losse root-bestanden en 27 mappen in Google Drive routeren naar de bestaande documenten/-structuur"

# Ownership & priority
assignee: unassigned
priority: 3

# Status (mirrors folder location)
status: open
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-18T18:23:10Z
updated: 2026-08-18T18:23:10Z
due: null

# Provenance
created_by: hermes
source: hermes-session-2026-08-18-1949
parent: null

# Cross-references — REQUIRED, even if empty array. The act of filling these is the whole point.
linked_sops: [SOP-013-inboxen-verwerken]
linked_workstreams: []
linked_guidelines: [GL-001-file-naming-conventions, GL-020-informatie-invoer-uitvoer-en-levenscyclusregister, GL-013-interactie-enkelvoudige-keuzes]
linked_my_life: [gewoon-thuis, verbouwing-huismanstraat-34]
linked_session_logs: []
linked_journal_entries: []

# Tagging
tags: [google-drive, opruiming, documenten, gewoon-thuis, huismanstraat, terminal-sessie]
---

# 945 losse root-bestanden en 27 mappen in Google Drive routeren naar de bestaande documenten/-structuur

## What this is

Sanders Google Drive ("My Drive") root bevat 972 items direct in root: 27 mappen + 945 losse bestanden zonder map. Dit is geïnventariseerd (read-only) op 2026-08-18. Sander wil dit opnieuw inrichten, maar koos expliciet om nu alleen de contouren te bepalen — de daadwerkelijke uitvoering (honderden bestanden individueel beoordelen en verplaatsen) hoort in een Claude Code/terminal-sessie, niet in Cowork (zie [[feedback_grotere_klussen_naar_terminal_sessie]] in `.claude/memory`).

**Belangrijke ontdekking tijdens deze sessie:** er bestaat al een canonieke, deels uitgevoerde doelstructuur — `Google Drive/Mijn Drive/documenten/` met de 7 Key Elements uit [[GL-001-file-naming-conventions]] §13 (01-geloof, 02-gezondheid, 03-passie, 04-groei, 05-bijdrage, 06-financien, admin), vastgelegd na de opslagstrategie-migratie van 6 juli 2026. Geverifieerd via de Drive-MCP dat deze structuur echt bestaat en al gedeeltelijk gevuld is:
- `03-passie/` bevat al: `rdb/`, `materiaal/`, `dartscoaching/`, `website-archief/`, `adc/`, `dartteam-irritant/`
- `05-bijdrage/` bevat al: `gewoon-thuis/`, `adc/` (bewust een andere dan die in 03-passie — regiomanagement vs. community, zie sessielog 6 juli), `verbouwing-huismanstraat/`

Deze taak is dus **geen nieuwe structuur bedenken**, maar de rommelige root (27 losse mappen + 945 losse bestanden) routeren naar deze bestaande `documenten/`-structuur, mét zorgvuldige dedup-check omdat een deel van de root-mappen (Dartscoaching.nl, Amateur Darts Circuit, NDB, dartbuddies.online) vermoedelijk **overlapt** met wat al in `03-passie/dartscoaching/`, `03-passie/adc/` en `03-passie/rdb/` staat — dit is Drive-natieve content die nooit is meegenomen in de iCloud-migratie van 6 juli, dus waarschijnlijk niet 1-op-1 hetzelfde als wat al gemigreerd is. Niet blind samenvoegen; eerst diffen.

## Al uitgevoerd (deze sessie, met Sanders akkoord)

- **109 lege bestanden** (86× "Naamloos document", 23× "Naamloze spreadsheet", allemaal 1024 bytes) naar de prullenbak verplaatst.
- De **twee mappen "Opgeslagen vanuit Chrome"** samengevoegd (5 bestanden verplaatst naar de map met 10, lege map naar prullenbak).
- Beide acties zijn terug te draaien via de Google Drive-prullenbak.

## Beslissingen die Sander al genomen heeft (deze sessie)

- **Aanpak:** contouren nu bepalen, uitvoering (verplaatsen van bestanden) in een Claude Code/terminal-sessie.
- **Doelstructuur:** de bestaande `documenten/`-structuur volgen (GL-001 §13), niet iets nieuws bedenken.
- **AKP Gezinshuis-bestanden** (mentorgesprekken, weekvoortgang, bewonersnamen: Daan, Kudus, Yoram, Merel, Aung Ko Phyo): volg de bestaande conventie, dus naar `documenten/05-bijdrage/gewoon-thuis/` — géén nieuwe afgeschermde hoofdmap, géén aanpassing van de sharing-instellingen t.o.v. de beslissing van 6 juli.

## Voorgestelde routering (concept, nog niet uitgevoerd — te verifiëren tijdens de terminal-sessie)

### Mappen direct in root (27)

| Bron | Voorgestelde bestemming | Let op |
|---|---|---|
| Amateur Darts Circuit (17) | check overlap met `03-passie/adc/` én `05-bijdrage/adc/` | twee bestaande adc-mappen met bewust verschillend doel — eerst uitzoeken welke |
| NDB (63) | check overlap met `03-passie/rdb/` | nagaan of NDB (nationaal?) hetzelfde is als RDB (regionaal?) — niet aannemen dat het dezelfde bond is |
| Dartscoaching.nl (40) | `03-passie/dartscoaching/` | diff tegen bestaande inhoud, geen blinde merge |
| dartbuddies.online (10) | `03-passie/dartscoaching/dartbuddies/` | eerdere beslissing (6 juli): dartbuddies hoort ín dartscoaching, niet ernaast |
| Darttactiek van Beginner tot Professional (2) | `03-passie/dartscoaching/` of `03-passie/materiaal/` | klein, inhoud checken |
| Brainstorm Buddy (6) | `03-passie/` (submap TBD) | inhoud checken |
| Sell like Crazy (5) | `04-groei/` of `03-passie/materiaal/` | inhoud checken |
| Custom GPT Library (6) | `04-groei/` | |
| Google AI Studio (3) | `04-groei/` | |
| ai (2) | `04-groei/` | |
| Health (1) | `02-gezondheid/` | |
| Administratie (2) | `06-financien/` | inhoud checken |
| Gewoon Sander (2) | `06-financien/` of `admin/` | inhoud checken |
| WeFact_gewoonsander (1) | `06-financien/` | |
| Huismanstraat (55) | grotendeels `05-bijdrage/verbouwing-huismanstraat/` | check op niet-verbouwing content (bewoning/administratie) — mogelijk `admin/` |
| Huismanstraat gedeeld met LLM (3) | idem, samenvoegen met bovenstaande | |
| Meet Recordings (10) | per opname beoordelen | kan meerdere Key Elements raken |
| Sander Mediahub - Exports (6) | waarschijnlijk niet naar `documenten/` | relatie met lokale Sander Mediahub (Lexar SSD) nagaan |
| d archief (3) | nader onderzoeken | mogelijk gerelateerd aan het al langer openstaande "d archief" (620 bestanden, "Andere computers → Mijn MacBook Pro") uit de sessie van 6 juli — nagaan of dit dezelfde is |
| backup film van macbook air (5) | Archief (buiten `documenten/`, geen Key Element) | |
| 20260629 schoonmaak archief macbook pro (1) | Archief | |
| documenten (7) | is de doelstructuur zelf | geen actie |
| Getintothegroove (0, leeg) | prullenbak | |
| Google Earth (0, leeg) | prullenbak | |
| Relations (0, leeg) | prullenbak | |

### Losse bestanden in root (945, na opschoning nog 836)

- ~100 Gewoon Thuis/AKP-bestanden → `documenten/05-bijdrage/gewoon-thuis/` (bevestigd door Sander)
- Dart-gerelateerd (73+33 titels) → `documenten/03-passie/` (submap per context, o.a. de "Irritante Opstelling"-reeks 2022–2026)
- Financieel: 22 "factuur", 25 "toolstation", 10 "bunq"-transactieoverzichten, 12 "Doxie"-scans → `documenten/06-financien/`
- Huismanstraat-titels los in root (7) → zelfde afweging als de mappen hierboven
- Coaching-gerelateerd los in root (16) → `documenten/03-passie/dartscoaching/`
- 184 bestanden met datumprefix (YYYYMMDD) → grotendeels vermoedelijk `06-financien/` of `admin/`, per bestand beoordelen
- Resterende ~450 ongeclassificeerde losse bestanden → individueel beoordelen, geen automatische regel

### Nog niet opgeschoonde duplicaten (84 van de oorspronkelijke 193 — 109 lege bestanden zijn al weg)

23× "Template Zakelijke brief Gewoon Thuis", 10× "Weekvoortgang Daan", 8× "Template mentorgesprek Daan Gewoon Thuis", 6× "GGGGG Schema", 6× "Projectvoorstel", 6× "Template mentorgesprek Aung Ko Phyo Gewoon Thuis", + kleinere groepjes (Brief, Onkostenrapportage, Sjabloon Woonoverleg, Superleague, bunq-overzichten, e.a.). **Niet zomaar verwijderen** — in tegenstelling tot de lege bestanden kunnen dit legitieme verschillende versies zijn onder een generieke titel (bv. verschillende weken "Weekvoortgang Daan"). Vereist inhoudelijke check per groep voordat er iets naar de prullenbak gaat.

## Context one click away

- Procedure: [[SOP-013-inboxen-verwerken]]
- Guideline: [[GL-001-file-naming-conventions]] §13 (de doelstructuur)
- Guideline: [[GL-020-informatie-invoer-uitvoer-en-levenscyclusregister]]
- Tom's context: [[gewoon-thuis]], [[verbouwing-huismanstraat-34]]
- Eerdere migratie: `Deliverables/2026-07-06-opslagstrategie-migratie-plan.md`, sessielog [[2026-07-06-12-59_hermes_opslagstrategie-migratie-uitgevoerd]]

## Success criteria

- De 836 resterende losse root-bestanden zijn allemaal in een submap van `documenten/` (of bewust elders, met reden) geland — root bevat geen losse bestanden meer.
- De 24 resterende root-mappen (na aftrek van de lege mappen en de al samengevoegde Chrome-map) zijn opgeruimd: inhoud verplaatst of bewust als Archief gemarkeerd.
- Overlap tussen root-mappen (Dartscoaching.nl, Amateur Darts Circuit, NDB, dartbuddies.online) en de bestaande `03-passie/`-submappen is gecontroleerd en gededupliceerd — geen contentverlies, geen blinde merges.
- De 84 resterende duplicaat-titels zijn per groep beoordeeld (legitiem verschillend vs. echte duplicaten) voordat er iets verwijderd wordt.
- `documenten/05-bijdrage/gewoon-thuis/` bevat na afloop alle AKP Gezinshuis-content, geconsolideerd vanuit root.
- Sander heeft tussentijds de kans gehad om bij twijfelgevallen (met name Huismanstraat-indeling en de NDB/RDB-relatie) mee te beslissen — niet automatisch doorgevoerd zonder overleg.

## Updates

- 2026-08-18 19:49 (hermes) — created. Root-inventarisatie uitgevoerd via subagent, bestaande `documenten/`-structuur ontdekt en geverifieerd (was niet bekend bij aanvang van de sessie — Sanders eerste keuze voor AKP-plek is op basis hiervan bijgesteld). Snelle opschoning uitgevoerd: 109 lege bestanden + dubbele Chrome-map.
- 2026-08-18 19:30 (hermes) — Sander vroeg om meteen door te gaan met uitvoering in dezelfde (Cowork-)sessie i.p.v. te wachten op een terminal-sessie; afwijking van de oorspronkelijke aanpak-keuze, expliciet akkoord. **Incident:** bij het samenvoegen van map "Huismanstraat gedeeld met LLM" in `05-bijdrage/verbouwing-huismanstraat/` werden 2 van de 3 bestandsverplaatsingen geblokkeerd door de Claude Code auto-mode classifier (willekeurig, niet aangevraagd), maar de opruimactie op de nu ogenschijnlijk lege map-wrapper ging wél door voordat dit was opgemerkt. **"verbouwing huismanstaat 34" (spreadsheet) en "oud Verbouwing huismanstraat planning 3 kamers" (document) zijn mogelijk verloren** — niet te vinden via de Drive-tools, en Sander heeft zelf de Google Drive-prullenbak gecheckt en ze daar ook niet aangetroffen. Kan niet onafhankelijk bevestigd of hersteld worden vanuit deze sessie (geen restore-tool beschikbaar). Sander heeft opdracht gegeven door te gaan; dit blijft een openstaand, niet-opgelost dataverlies-risico — **nog navragen/onderzoeken in een latere sessie, met name of "oud Verbouwing huismanstraat planning 3 kamers" sowieso al achterhaald was** (titel begint met "oud").
  - Sindsdien: elke verplaatsing wordt individueel bevestigd vóórdat een bovenliggende map wordt opgeruimd (trash), om herhaling te voorkomen.
  - Voortgang root-mappen (11 van 27 verwerkt): Getintothegroove, Google Earth (leeg, getrasht) — Relations (leeg, trash geblokkeerd door classifier, nog te doen) — Administratie → `06-financien/boekhouden-bonnen/` — Gewoon Sander (2 bestanden → `06-financien/`, lege map getrasht) — Sell like Crazy → `04-groei/sell-like-crazy/` — Meet Recordings → `03-passie/dartscoaching/meet-recordings/` (bevat 1 bestand met "kan weg" in de titel — niet automatisch verwijderd, aan Sander) — Huismanstraat gedeeld met LLM → 1 bestand geland in `05-bijdrage/verbouwing-huismanstraat/`, map getrasht (zie incident hierboven) — Health → `02-gezondheid/health/` — ai → `04-groei/ai/` — Google AI Studio → `04-groei/google-ai-studio/` — Custom GPT Library → `04-groei/custom-gpt-library/` — WeFact_gewoonsander → `06-financien/wefact-gewoonsander/` — Darttactiek van Beginner tot Professional → `03-passie/dartscoaching/darttactiek-boek/`.
  - **AKP Gewoon Thuis losse bestanden: 158 van 158 verplaatst en geverifieerd** naar nieuwe submap `documenten/05-bijdrage/gewoon-thuis/dossiers/` (op Sanders keuze aangemaakt, naast de bestaande `documenten/assets/media/activiteiten/facturen/branding`-submappen van gewoon-thuis/ die eerder al bleken te bestaan — vermoedelijk website/huisstijl-gerelateerd, niet cliëntdossiers). Telling geverifieerd: exact 158 bestanden in de doelmap, geen dubbelingen, geen classifier-blokkades bij deze ronde. Bevat mentorgesprekken/weekvoortgang/dossiers van Daan, Kudus, Aung Ko Phyo, en oudere bewoners Yoram (2018-2019) en Merel (incl. persoonlijke items als verjaardagskaarten). **Nog niet gededupliceerd** — bevat de eerder genoemde duplicaat-titels (Template Zakelijke brief Gewoon Thuis 25x, Weekvoortgang Daan 10x, etc.), bewust ongemoeid gelaten.
- 2026-08-18 20:05 (hermes) — **alle 27 oorspronkelijke root-mappen verwerkt.** Root bevat nu alleen nog `documenten/` (de doelstructuur), `Sander Mediahub - Exports` (bewust ongemoeid — hoort bij [[tsk-2026-08-15-001-video-s-in-downloads-filen-naar-mediahub]]), de samengevoegde `Opgeslagen vanuit Chrome` (15 bestanden, nog niet verder gefileerd) en de nieuwe `archief/`-map.
  - Amateur Darts Circuit (17) → `03-passie/adc/pub-qualifiers/` (uitsluitend Pub Qualifiers-toernooimanagement, past bij bestaande inhoud van `adc/`)
  - NDB (63, vnl. ranking-screenshots) → nieuwe submap `03-passie/ndb/` — **bewust niet samengevoegd met `rdb/`**: NDB (nationale bond) en RDB (regionaal) zijn vermoedelijk niet dezelfde bond, nog te verifiëren met Sander
  - Dartscoaching.nl (40, gemengde inhoud: personas, ideeën, stijlgids, funnel, e-books, presentaties) → nieuwe submap `03-passie/dartscoaching/dartscoaching-nl-archief/` — **bewust NIET fijn uitgesorteerd** over de bestaande subs (branding/assets/coaching/dartboek/media/boek-darttactiek/materiaal/website), vereist inhoudelijke beoordeling per bestand
  - dartbuddies.online (10, ook gemengd — bevat zelfs een KVK-uittreksel en een generiek marketplace-ebook) → nieuwe submap `03-passie/dartscoaching/dartbuddies-online-archief/` — zelfde reden, niet fijn uitgesorteerd
  - Brainstorm Buddy → alle 6 bestanden bevestigd leeg (1024 bytes, incl. 5x dezelfde "DartCamp Juni"-titel en 1x "Test - Brainstorm Buddy") → prullenbak, lege map ook getrasht
  - Huismanstraat (55, hoofdmap) → `admin/huismanstraat-34/` — mix van aankoop/hypotheek/verzekering/energielabel (past bij admin) én verbouwingsspecifieke stukken (offerte zonnepanelen, draagbalk, factuur Karel van de Kamp — horen eigenlijk bij `05-bijdrage/verbouwing-huismanstraat/`) plus wat zeer oude historische pandfoto's (café De Laak, jaren '50-'70, niet van Sander) — **nog fijn uit te sorteren**
  - d archief, backup film van macbook air, 20260629 schoonmaak archief macbook pro → nieuwe root-map `archief/` (buiten `documenten/`, geen Key Element van toepassing) — **d archief bewust NIET samengevoegd**: bleek de oude "Google Drive test"-legacymap met zeer oude submappen "Gezinshuis Gewoon Thuis" (2017) en "a Gewoon Sander" (2015), hoge kans op verouderde duplicaten van wat nu in `05-bijdrage/gewoon-thuis/` staat
  - Relations, Getintothegroove, Google Earth (alle 3 leeg) → prullenbak
- 2026-08-18 21:10 (hermes) — **160 losse root-bestanden extra verwerkt** via patroonherkenning op titel (jq/regex over een volledige export van root), in mutueel exclusieve categorieën, elke batch stuk voor stuk bevestigd:
  - 27× "Irritante Opstelling"/dartshirt/dartteam Irritant-titels → `03-passie/dartteam-irritant/`
  - 15× RDB-titels → `03-passie/rdb/` (RDB = "Redelijke/Rivierenland Darts Bond", bevestigd een andere/lokalere bond dan NDB — dus terecht apart gehouden van de eerder aangemaakte `03-passie/ndb/`)
  - 10× superleague/toernooi-titels → `03-passie/materiaal/`
  - 64× overige dart/dartscoaching/dartbuddies-titels → `03-passie/materiaal/` (2 valse treffers uitgesloten: "Tandarts"-afspraakkaart en "jeugdarts"-GGD-brief bevatten toevallig "dart" als substring — met opzet niet meeverplaatst)
  - 30× factuur/toolstation/bunq/doxie-titels → `06-financien/`
  - 7× overige Huismanstraat-titels (masterplan, ontwikkelplan, onkosten) → `05-bijdrage/verbouwing-huismanstraat/`
  - 3× Dotterlaan-titels (vorige woning, verkocht) → nieuwe submap `admin/dotterlaan-31/`
  - 4× overige Gezinshuis-titels → `documenten/05-bijdrage/gewoon-thuis/dossiers/`
  - Alle moves per batch bevestigd gelukt, geen classifier-blokkades in deze ronde.
  - **Resterend: ca. 518 losse root-bestanden** (van de oorspronkelijke 836 na AKP) — deels nog niet doorzocht op patroon (o.a. de ~184 gedateerde scans, overige eenmalige bestanden), plus 15 bestanden in de samengevoegde `Opgeslagen vanuit Chrome`-map. Dit is het overgebleven werk: geen duidelijk keyword-patroon meer, vraagt individuele beoordeling per bestand — geschikter voor de geplande Claude Code/terminal-sessie dan verdere blinde patroonherkenning.

## Outcome
_(filled when status flips to done — see SOP-close-task)_

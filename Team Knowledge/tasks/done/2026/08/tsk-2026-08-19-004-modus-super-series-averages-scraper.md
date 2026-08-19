---
# Identity
id: tsk-2026-08-19-004
title: "Scraper + spreadsheet bouwen: alle speler-gemiddelden per Series van de Modus Super Series"

# Ownership & priority
assignee: daedalus
priority: 3

# Status (mirrors folder location)
status: done
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-19T14:26:21Z
updated: 2026-08-19T20:11:21Z
due: null

# Provenance
created_by: hermes
source: sander-chat-2026-08-19
parent: null

# Cross-references — REQUIRED, even if empty array. The act of filling these is the whole point.
linked_sops: []
linked_workstreams: []
linked_guidelines: []
linked_my_life: []
linked_session_logs: []
linked_journal_entries: []

# Tagging
tags: [darts, modus-super-series, scraping, data, spreadsheet, terminal-sessie]
---

# Scraper + spreadsheet bouwen: alle speler-gemiddelden per Series van de Modus Super Series

## What this is

Sander wil een spreadsheet/eenvoudige database met de gemiddelden (averages) van alle spelers, per "seizoen" (Series), van de MODUS Super Series darts-competitie — vanaf het begin tot nu. Hij koos er bewust voor dit als taak vast te leggen voor een terminal-/Claude Code-sessie in plaats van het meteen in Cowork te bouwen ([[feedback_grotere_klussen_naar_terminal_sessie]]: grotere/langere klussen bewaren voor terminal-werk).

Hermes (als Athena-onderzoeksrol) heeft in de chatsessie van 2026-08-19 al het haalbaarheidsonderzoek gedaan — zie hieronder. De bouw is uitgevoerd in de terminal-sessie van 2026-08-19 16:30.

## Achtergrond Modus Super Series (voor context)

- Internationale wekelijkse dartscompetitie, gestart september 2022 (opvolger van de "Online Darts Live League" uit 2021), georganiseerd door Modus (events-/managementbureau, opgericht 1997).
- Open voor spelers zonder PDC Tour Card plus "legends". Zes dagen per week live op PlutoTV, vaste locatie Portsmouth.
- **Belangrijk:** het zijn geen "15 jaar" maar 15 genummerde **"Series"** (~3 maanden / 12-13 weken elk, ruwweg 4 per jaar) plus één los evenement "Double Trouble". Series 1 t/m 14 zijn afgerond; Series 15 loopt nu (3 aug – 31 okt 2026, dus nog niet compleet op moment van onderzoek). Bevestigd via de [Honours Board](https://modussuperseries.com/honours-board).

## Technisch onderzoek — hoe de data te scrapen is

Bron: officiële site [modussuperseries.com](https://modussuperseries.com/). Onderzocht via netwerkverkeer-inspectie (browserdevtools), geen documentatie/API-key beschikbaar of nodig.

- De site is grotendeels server-gerenderde PHP — geen JavaScript-rendering nodig om te scrapen (gewone HTTP GET + HTML-parsing volstaat, bv. Python `requests` + `BeautifulSoup`).
- **Kern-endpoint:** `https://modussuperseries.com/week-averages.php?series_id=X&week_id=Y` — toont een tabel "ACCUMULATIVE AVERAGES" met per speler: positie, naam, gespeeld, (punten, darts — niet altijd aanwezig, zie caveat), gemiddelde. Cumulatief tot en met die week.
- ~~**De laatste beschikbare week van een Series = het eindgemiddelde van die hele Series.**~~ **Deze aanname is tijdens de bouw onjuist gebleken — zie "Bevindingen tijdens de bouw" hieronder.**
- **series_id-mapping** (afgeleid uit de `<select>`-dropdown op de averages-pagina):
  | Series | series_id |
  |---|---|
  | Series 1 t/m 14 | 1 t/m 14 (1:1) |
  | Series 15 (loopt nu) | 26 |
  | Double Trouble (los evenement) | 15 |
- Bonus/nice-to-have: er is ook een los JSON-endpoint `live-scores-json.php` met per-wedstrijd-statistieken (average_3_darts, checkout%, 100+/140+/180's) — data komt aantoonbaar van Sportradar (te herkennen aan `sr:`-object-ID's in de payload). Dit levert alleen "vandaag"-data per request (query param is een tijdstempel), dus voor historische per-wedstrijd-detail (in plaats van enkel het cumulatieve seizoensgemiddelde) is verder onderzoek nodig hoe oudere datums op te vragen zijn. **Niet gebruikt in deze bouw.**
- Ook bestaat `results.php` (met tabs Series/Group A/B/C/Final/Averages) — dezelfde onderliggende data, ruwe wedstrijdresultaten per week, mogelijk handig voor extra validatie/kruischeck van de averages. **Niet gebruikt in deze bouw.**

## Bevindingen tijdens de bouw (2026-08-19)

### 1. Kernaanname uit het onderzoek klopte niet — "Accumulative" is per week, niet per Series

De tabel met de kop "Accumulative Averages" is cumulatief **binnen één week** (groepswedstrijden, finalegroep, halve finales en finale van dat week-evenement), niet cumulatief over de hele Series. Elke week heeft een eigen spelersveld.

Geverifieerd: Series 1 week 6, week 9 en week 13 delen vrijwel geen spelers, en Ciaran Teehan staat in week 6 met 4 gespeelde partijen en in week 13 met 8 — losse tellingen, geen doorlopende. Was de oorspronkelijke aanname gevolgd, dan had de dataset per Series 6-12 spelers bevat in plaats van ~140, met een weekgemiddelde in plaats van een Series-gemiddelde.

**Gekozen oplossing:** alle weken van alle Series ophalen en het Series-gemiddelde berekenen als 3 × (som punten) / (som darts). Die formule is getoetst aan de site zelf: week 6 van Series 1 geeft James Hurrell 4722 punten / 159 darts → 3 × 29,698 = 89,09, exact het getoonde gemiddelde.

### 2. Open onzekerheid "kolomverschil tussen Series" — geen verschil, het was een CSS-artefact

Alle 16 onderdelen tonen dezelfde kolommen: Pos, Player, Played, Points, Darts, Average. De punten- en darts-kolom staan altijd in de HTML; de site verbergt ze puur met CSS onder 900px schermbreedte (`@media(max-width:900px) { .points-cell, .darts-cell { display: none } }`). De eerdere waarneming dat Series 1 alleen "Speeld + Gemiddelde" toonde, kwam dus van de schermbreedte tijdens het onderzoek, niet van een site-redesign. Controle over alle 2182 opgehaalde rijen: 0 rijen zonder punten/darts.

### 3. Open onzekerheid "bestaan series_id 16 t/m 25" — nee, leeg

series_id 16 t/m 25 (en 27 t/m 30, extra gecheckt) geven allemaal een lege pagina terug: "Week 0 Accumulative Averages" met een `no-results`-blok en nul tabelrijen. Er zit geen verborgen data achter. Alleen 1-14, 15 (Double Trouble) en 26 (Series 15) bestaan.

### 4. Overige bronbeperkingen

- **Series 1 mist de weken 1 t/m 5** — de site heeft daar geen averages-pagina voor; Series 1 begint bij Week 6. Alle andere afgeronde Series hebben 13 volledige weken.
- **Underscores in achternamen** — de bron schrijft samengestelde achternamen als `Jeffrey de_Zwaan`, `Gian van_Veen`, soms met een underscore aan het eind (`Rusty-Jake Rodriguez_`); 38 spelers. Genormaliseerd naar spaties, met de brontekst bewaard in de kolom `speler_bron`. De bron doet dit consistent: 593 unieke spelers vóór én na normalisatie, er zijn dus geen dubbele varianten samengevoegd.
- Spelers worden op naam samengevoegd; de site biedt geen spelers-ID. Twee verschillende spelers met exact dezelfde naam zouden samenvallen — niet gecontroleerd.

## Opgeleverd

- **Script:** `Team Knowledge/scripts/modus-super-series-averages.py` — alleen Python-stdlib, gedocumenteerd in `Team Knowledge/scripts/README.md`. Leest de Series-lijst uit de dropdown en de status afgerond/lopend uit de Honours Board, dus een nieuwe Series 16 wordt zonder codewijziging meegenomen.
- **Dataset:** `Deliverables/2026-08-19-modus-super-series-averages/` met toelichtende README en drie CSV's:
  - `modus-super-series-per-series.csv` — hoofdresultaat, 1937 rijen (speler × Series)
  - `modus-super-series-per-week.csv` — ruwe brondata, 2182 rijen
  - `modus-super-series-alltime.csv` — 593 unieke spelers over alle Series

Omvang: 16 onderdelen, Series 1 t/m 14 als `afgerond`, Series 15 als `lopend (tussenstand)` (3 weken gespeeld), Double Trouble als `los evenement`.

Controles: weekgemiddelde vs. herberekend 3 × punten / darts over alle 2182 rijen → 0 afwijkingen; Series-totalen vs. optelling van de weekdata over alle 1937 rijen → 0 mismatches; 0 rijen zonder gemiddelde; 0 gemiddelden buiten het bereik 30-120.

## Context one click away
- Herkomst: chatsessie Cowork, 2026-08-19, onderzoek gedaan door Hermes/Athena-rol op verzoek van Sander. Bouw: terminal-sessie 2026-08-19.
- Website: https://modussuperseries.com/
- Voorbeeldpagina (Series 15, week 3): https://modussuperseries.com/week-averages.php?series_id=26&week_id=193
- Voorbeeldpagina (Series 1, laatste week, automatisch): https://modussuperseries.com/week-averages.php?series_id=1
- Honours Board (bevestiging aantal Series + huidige Series-datumrange): https://modussuperseries.com/honours-board

## Success criteria
- [x] Voor elke afgeronde Series (1 t/m 14) is het eindgemiddelde per speler opgehaald (positie, naam, gespeeld, gemiddelde, en punten/darts waar beschikbaar).
- [x] Series 15 wordt apart gemarkeerd als "lopend, tussenstand" i.p.v. stilzwijgend meegeteld als afgerond seizoen.
- [x] Double Trouble wordt apart vermeld (het is geen genummerde Series in dezelfde reeks).
- [x] Resultaat is een spreadsheet (CSV/Excel of Google Sheet — vorm nog niet vastgesteld met Sander, mag simpel) met minimaal: Series, speler, gespeeld, gemiddelde. → drie CSV's, plus xlsx en Google Sheet opgeleverd.
- [x] De twee open onzekerheden hierboven (kolomverschil, series_id 16-25) zijn tijdens de bouw kort gecheckt en het resultaat is teruggekoppeld aan Sander — niet stilzwijgend genegeerd.
- [x] Sander heeft het eindresultaat gezien en goedgekeurd voordat de taak als afgerond geldt.

## Updates
- 2026-08-19 14:26 (hermes) — created, na haalbaarheidsonderzoek in chatsessie. Sander koos expliciet voor "vastleggen als taak voor terminal-sessie" i.p.v. nu meteen bouwen.
- 2026-08-19 16:58 (hermes) — picked up en gebouwd in terminal-sessie. Script + dataset opgeleverd, beide open onzekerheden beantwoord, en één kernaanname uit het oorspronkelijke onderzoek gecorrigeerd (zie "Bevindingen tijdens de bouw"). Status op in-progress i.p.v. done: het laatste success criterion vraagt om Sanders goedkeuring van het eindresultaat.
- 2026-08-19 20:11 (hermes) — Sander vroeg in de Cowork-sessie na te trekken of de taak al was opgepakt; bleek al gebouwd, gemerged naar main en zelfs uitgebreid met xlsx + Google Sheet (commits `a473842`, `170cf02`, `fb0765d`, `fba01ba`, `23a4f3b`). Drie CSV's + README naar Sander gestuurd ter beoordeling; Sander keurde goed ("a"). Taak op done.

## Outcome

What shipped: een herbruikbare Python-stdlib scraper (`Team Knowledge/scripts/modus-super-series-averages.py`) voor alle speler-gemiddelden van de MODUS Super Series, plus een dataset van 16 onderdelen (Series 1-14 afgerond, Series 15 lopend/tussenstand, Double Trouble los) in drie vormen: 3 CSV's (per-series hoofdbestand 1937 rijen, per-week brondata 2182 rijen, all-time 593 spelers), een xlsx-werkmap met drie tabbladen, en een Google Sheet in Drive (`documenten/03-passie/modus-super-series/`). Tijdens de bouw is een kernaanname uit het oorspronkelijke haalbaarheidsonderzoek gecorrigeerd (de "Accumulative Averages"-tabel is cumulatief per week, niet per Series) en zijn beide open onzekerheden uit dat onderzoek beantwoord. Alle 2182 weekrijen en 1937 Series-rijen zijn tegen herberekening geverifieerd, 0 afwijkingen.

Where it lives: `Deliverables/2026-08-19-modus-super-series-averages/` (CSV's, xlsx, README) + [Google Sheet](https://docs.google.com/spreadsheets/d/1O2TrBcqUXj5YvmZ_I92rpBDY8pC240E6VQOzDrbordQ/edit). Commits op main: `a473842` (scraper + dataset), `170cf02` (HTML-entiteiten fix), `fb0765d` (merge), `fba01ba` (index-opruiming), `23a4f3b` (xlsx + Google Sheet). Gebouwd in een losstaande terminal-sessie, niet in deze Cowork-sessie.

Follow-ups: geen. De Google Sheet is een momentopname van 2026-08-19 — bij een herdraai van het script ververst alleen de lokale data, de Sheet moet dan handmatig opnieuw geüpload worden (staat in de Deliverables-README).

Lessons: geen apart journal-entry geschreven; de correctie op het oorspronkelijke onderzoek staat vastgelegd in dit taakbestand zelf onder "Bevindingen tijdens de bouw".

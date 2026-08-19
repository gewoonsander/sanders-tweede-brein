---
# Identity
id: tsk-2026-08-19-004
title: "Scraper + spreadsheet bouwen: alle speler-gemiddelden per Series van de Modus Super Series"

# Ownership & priority
assignee: daedalus
priority: 3

# Status (mirrors folder location)
status: open
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-19T14:26:21Z
updated: 2026-08-19T14:26:21Z
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

Hermes (als Athena-onderzoeksrol) heeft in de chatsessie van 2026-08-19 al het haalbaarheidsonderzoek gedaan — zie hieronder. De bouw zelf is nog niet gestart.

## Achtergrond Modus Super Series (voor context)

- Internationale wekelijkse dartscompetitie, gestart september 2022 (opvolger van de "Online Darts Live League" uit 2021), georganiseerd door Modus (events-/managementbureau, opgericht 1997).
- Open voor spelers zonder PDC Tour Card plus "legends". Zes dagen per week live op PlutoTV, vaste locatie Portsmouth.
- **Belangrijk:** het zijn geen "15 jaar" maar 15 genummerde **"Series"** (~3 maanden / 12-13 weken elk, ruwweg 4 per jaar) plus één los evenement "Double Trouble". Series 1 t/m 14 zijn afgerond; Series 15 loopt nu (3 aug – 31 okt 2026, dus nog niet compleet op moment van onderzoek). Bevestigd via de [Honours Board](https://modussuperseries.com/honours-board).

## Technisch onderzoek — hoe de data te scrapen is

Bron: officiële site [modussuperseries.com](https://modussuperseries.com/). Onderzocht via netwerkverkeer-inspectie (browserdevtools), geen documentatie/API-key beschikbaar of nodig.

- De site is grotendeels server-gerenderde PHP — geen JavaScript-rendering nodig om te scrapen (gewone HTTP GET + HTML-parsing volstaat, bv. Python `requests` + `BeautifulSoup`).
- **Kern-endpoint:** `https://modussuperseries.com/week-averages.php?series_id=X&week_id=Y` — toont een tabel "ACCUMULATIVE AVERAGES" met per speler: positie, naam, gespeeld, (punten, darts — niet altijd aanwezig, zie caveat), gemiddelde. Cumulatief tot en met die week.
- **De laatste beschikbare week van een Series = het eindgemiddelde van die hele Series.** Als alleen het seizoensgemiddelde nodig is (niet de week-voor-week opbouw), volstaat het ophalen van `week-averages.php?series_id=X` zonder `week_id` — de site geeft dan automatisch de laatste week terug (geverifieerd: series_id=1 zonder week_id gaf direct Week 13, de laatste week van Series 1).
- **series_id-mapping** (afgeleid uit de `<select>`-dropdown op de averages-pagina):
  | Series | series_id |
  |---|---|
  | Series 1 t/m 14 | 1 t/m 14 (1:1) |
  | Series 15 (loopt nu) | 26 |
  | Double Trouble (los evenement) | 15 |
- Bonus/nice-to-have: er is ook een los JSON-endpoint `live-scores-json.php` met per-wedstrijd-statistieken (average_3_darts, checkout%, 100+/140+/180's) — data komt aantoonbaar van Sportradar (te herkennen aan `sr:`-object-ID's in de payload). Dit levert alleen "vandaag"-data per request (query param is een tijdstempel), dus voor historische per-wedstrijd-detail (in plaats van enkel het cumulatieve seizoensgemiddelde) is verder onderzoek nodig hoe oudere datums op te vragen zijn.
- Ook bestaat `results.php` (met tabs Series/Group A/B/C/Final/Averages) — dezelfde onderliggende data, ruwe wedstrijdresultaten per week, mogelijk handig voor extra validatie/kruischeck van de averages.

## Nog niet geverifieerd (aannames, geen vaststaande feiten — eerst checken tijdens de bouw)

- Of alle 14 afgeronde Series exact dezelfde tabelkolommen tonen. Series 1 toonde alleen "Speeld + Gemiddelde"; Series 15 toonde ook "Punten + Darts". Kolomverschil geconstateerd, oorzaak (bv. site-redesign halverwege) niet onderzocht.
- Of series_id 16 t/m 25 bestaan en wat ze zijn (ze zitten niet in de zichtbare dropdown naast 1-14, 15 [Double Trouble] en 26 [Series 15] — mogelijk andere/verborgen Modus-evenementen op hetzelfde platform, mogelijk niet relevant).
- Of Series 15 (nog lopend) meegenomen moet worden als "tot nu toe" gedeeltelijk resultaat, of pas na afloop (31-10-2026) verwerkt moet worden.

## Context one click away
- Herkomst: chatsessie Cowork, 2026-08-19, onderzoek gedaan door Hermes/Athena-rol op verzoek van Sander.
- Website: https://modussuperseries.com/
- Voorbeeldpagina (Series 15, week 3): https://modussuperseries.com/week-averages.php?series_id=26&week_id=193
- Voorbeeldpagina (Series 1, laatste week, automatisch): https://modussuperseries.com/week-averages.php?series_id=1
- Honours Board (bevestiging aantal Series + huidige Series-datumrange): https://modussuperseries.com/honours-board

## Success criteria
- Voor elke afgeronde Series (1 t/m 14) is het eindgemiddelde per speler opgehaald (positie, naam, gespeeld, gemiddelde, en punten/darts waar beschikbaar).
- Series 15 wordt apart gemarkeerd als "lopend, tussenstand" i.p.v. stilzwijgend meegeteld als afgerond seizoen.
- Double Trouble wordt apart vermeld (het is geen genummerde Series in dezelfde reeks).
- Resultaat is een spreadsheet (CSV/Excel of Google Sheet — vorm nog niet vastgesteld met Sander, mag simpel) met minimaal: Series, speler, gespeeld, gemiddelde.
- De twee open onzekerheden hierboven (kolomverschil, series_id 16-25) zijn tijdens de bouw kort gecheckt en het resultaat is teruggekoppeld aan Sander — niet stilzwijgend genegeerd.
- Sander heeft het eindresultaat gezien en goedgekeurd voordat de taak als afgerond geldt.

## Updates
- 2026-08-19 14:26 (hermes) — created, na haalbaarheidsonderzoek in chatsessie. Sander koos expliciet voor "vastleggen als taak voor terminal-sessie" i.p.v. nu meteen bouwen.

## Outcome
_(filled when status flips to done — see SOP-close-task)_

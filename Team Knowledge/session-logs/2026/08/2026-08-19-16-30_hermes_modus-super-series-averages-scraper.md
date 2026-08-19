---
agent_id: hermes
session_id: modus-super-series-averages-scraper
timestamp: 2026-08-19T14:30:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Modus Super Series averages-scraper gebouwd, kernaanname uit het onderzoek gecorrigeerd

## Context

Sander vroeg eerst welke open taken nog voor een terminal-sessie waren gemarkeerd, en koos daaruit taak B: de Modus Super Series averages-scraper ([[tsk-2026-08-19-004]]). Het haalbaarheidsonderzoek was in een eerdere Cowork-sessie al gedaan; de bouw stond nog open. Werk uitgevoerd in de worktree `modus-super-series-scraper`, branch `worktree-modus-super-series-scraper`.

## What we did

- Hermes doorzocht alle 13 open en 2 lopende taken op de markering `terminal-sessie` en leverde een overzicht van 4 open taken (Google Drive-root, Modus-scraper, SOP-diagrammen, SOP-013-inboxronde) plus 1 lopende die de tag draagt maar al buiten de terminal was opgepakt.
- Daedalus bouwde `Team Knowledge/scripts/modus-super-series-averages.py` — alleen Python-stdlib, geen API-sleutel, geen JavaScript-rendering. Leest de Series-lijst uit de dropdown van de site en de status afgerond/lopend uit de Honours Board, zodat een nieuwe Series zonder codewijziging meekomt.
- Dataset opgeleverd in `Deliverables/2026-08-19-modus-super-series-averages/`: drie CSV's (per Series 1937 rijen, per week 2182 rijen, all-time 593 spelers) plus een README met de volledige verantwoording en bronbeperkingen.
- Script gedocumenteerd in `Team Knowledge/scripts/README.md`.
- Taakbestand bijgewerkt en naar `tasks/in-progress/` gezet — niet naar `done`, omdat het laatste success criterion Sanders goedkeuring vraagt.

## Decisions made

- **Vraag:** Volstaat het ophalen van alleen de laatste week per Series, zoals het haalbaarheidsonderzoek aannam?
  **Beslissing:** Nee. Alle weken van alle Series ophalen en het Series-gemiddelde berekenen als 3 × (som punten) / (som darts). De weektabel bleek niet Series-cumulatief te zijn (zie Insights).

- **Vraag:** Hoe bepaalt het script of een Series afgerond of lopend is?
  **Beslissing:** Uit de Honours Board, waar alleen afgeronde Series een winnaar hebben — bewust niet hardcoded, zodat het klopt zodra Series 15 op 31-10-2026 afloopt.

- **Vraag:** Wat te doen met de underscores die de bron in samengestelde achternamen zet?
  **Beslissing:** Normaliseren naar spaties, met de onbewerkte brontekst bewaard in de kolom `speler_bron` van de weekdata, zodat de bewerking controleerbaar blijft.

## Insights

- De tabel die modussuperseries.com **"Accumulative Averages"** noemt is cumulatief *binnen één week* (groepsfase, finalegroep, halve finales en finale van dat week-evenement), niet over een hele Series. Elke week heeft een eigen spelersveld. Geverifieerd: Series 1 week 6, 9 en 13 delen vrijwel geen spelers, en Ciaran Teehan staat in week 6 met 4 partijen en in week 13 met 8 — losse tellingen. Was de oorspronkelijke aanname gevolgd, dan had de dataset per Series 6-12 spelers bevat in plaats van ~140, met een weekgemiddelde in plaats van een seizoensgemiddelde.
- Het "kolomverschil tussen Series" uit het onderzoek bestond niet: de punten- en darts-kolommen staan altijd in de HTML en worden alleen door CSS verborgen onder 900px schermbreedte. Een waarneming uit een browser is dus geen betrouwbare uitspraak over wat een endpoint levert — dat vraagt om een check op de ruwe HTML.
- Een query op eigen opgeleverde data is een goedkope extra controle: Sanders vraag naar het laagste gemiddelde bracht een echte bug aan het licht (HTML-entiteiten, `Tony O&#039;Shea`) die de geautomatiseerde numerieke controles niet konden vangen omdat ze alleen naar getallen keken.

## Realignments

- _(geen deze sessie)_

## Open threads

- [ ] Sander moet het eindresultaat bekijken en goedkeuren — laatste openstaande success criterion van [[tsk-2026-08-19-004]]; taak staat daarom op `in-progress`.
- [ ] Branch `worktree-modus-super-series-scraper` is gepusht maar nog niet naar `main` gemerged.
- [ ] In Sanders eigen werkmap staat het takenbestand nog untracked in `tasks/open/`; bij het mergen moet die losse kopie weg, anders staat de taak dubbel.
- [ ] Vorm van het eindresultaat nog open: CSV volstaat, maar Google Sheet is mogelijk via de bestaande `sheets_write.py` — daarvoor is alleen een spreadsheet-ID nodig.
- [ ] Niet gebruikt in deze bouw, wel beschikbaar als de behoefte per-wedstrijd-detail wordt: `live-scores-json.php` (Sportradar-data, alleen "vandaag") en `results.php` voor kruischecks.

## Next steps

- Sander bekijkt de drie CSV's en geeft akkoord of vraagt om een Google Sheet.
- Bij akkoord: taak naar `done` met een Outcome-regel, branch mergen naar `main`.

## Cross-links

- `[[2026-08-19-14-31_hermes_podcast-dashboard-verificatie]]` — vorige sessie van deze dag.

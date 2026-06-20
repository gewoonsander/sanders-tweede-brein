---
sop_id: SOP-003
title: ADC inschrijvingen opvragen
owner: Larry (via Mack)
tags:
  - ADC
  - darts
  - dart-atlas
  - inschrijvingen
  - regio-oost
last_updated: 2026-06-20
---

# SOP-003 — ADC inschrijvingen opvragen

## Doel

Live overzicht ophalen van alle inschrijvingen voor ADC-toernooien in Regio Oost, rechtstreeks van Dart Atlas. Geen login nodig — de entries-pagina's zijn publiek toegankelijk en server-rendered.

## Triggers

Voer deze SOP uit wanneer Sander vraagt:

- "Hoeveel mensen doen mee in onze regio?"
- "Geef me een update ADC-toernooien"
- "Wie heeft zich ingeschreven voor [toernooi]?"
- "Wat is de stand van inschrijvingen?"
- Of een andere variant die vraagt naar deelnemersaantallen of namenlijsten van ADC Regio Oost

## Seizoens-URLs (bijhouden als SSOT)

| Seizoen | Dart Atlas URL | Status |
|---|---|---|
| Winmau Benelux Trophy 2026 – East Netherlands | https://www.dartsatlas.com/seasons/ijkvdm44k7eC | ✅ actief |
| Winmau Benelux Open 2026 – East Netherlands | _nog niet aangemaakt door John Lokken_ | ⏳ verwacht volgende week |

**Updaten** zodra John de Benelux Open-URL aanmaakt: voeg de URL toe aan bovenstaande tabel.

## Procedure

### Stap 1 — Haal kalender op

Fetch de kalender-pagina van het actieve seizoen:

```
https://www.dartsatlas.com/seasons/[SEIZOEN_ID]/tournaments/schedule
```

Dart Atlas is server-rendered — `web_fetch` geeft volledige content zonder browser nodig.

Extraheer alle toernooi-URLs in de vorm `https://www.dartsatlas.com/tournaments/[ID]`.

### Stap 2 — Haal entries op per toernooi

Fetch parallel voor elk toernooi de entries-pagina:

```
https://www.dartsatlas.com/tournaments/[TOERNOOI_ID]/entries
```

**Let op:** de `/entries` URL werkt alleen als de basis-toernooi-URL eerder in dezelfde sessie via `web_fetch` is opgehaald (provenance-beperking). Volgorde is dus:
1. Fetch seizoenskalender → krijg toernooi-URLs
2. Fetch elke basis-toernooi-URL
3. Fetch elke `/entries` URL

### Stap 3 — Presenteer overzicht

Rapporteer per toernooi:

- Naam + categorie (Elite / Amateur I / Amateur II / Pub Qualifier)
- Datum + tijd + locatie
- Aantal ingeschreven spelers
- Namenlijst (genummerd)

Formaat:

```
🎯 [Toernooinaam] — [datum], [tijd] | [locatie] | [N] ingeschreven
1. Naam
2. Naam
...
```

Sluit af met een totaaltelling over alle toernooien.

## Notities

- Inschrijvingen zijn pas zichtbaar na betaling — de Dart Atlas entries-pagina toont alleen betalende deelnemers.
- De e-mailnotificaties via `sander.voz@amateurdarts.eu` (doorgestuurd naar `sander@gewoonsander.nl`) zijn een aanvullende signaallaag, maar Dart Atlas is altijd de meest actuele bron.
- Zodra het Benelux Open-seizoen live staat: URL toevoegen aan de tabel hierboven en de procedure is identiek.

## Gerelateerd

- [[adc]] — ADC topic overzicht
- [[adc-amateurdarts]] — CRM organisatie ADC

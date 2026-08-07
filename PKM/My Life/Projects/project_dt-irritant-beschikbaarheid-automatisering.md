---
name: D.T. Irritant — Beschikbaarheid-inventarisatie automatiseren
status: active
key_element: passie
linked_people:
  - jaimy-melchels
  - jos-wenders
  - frank-hoelen
  - terry-lenting
  - marc-vleghert
  - niels-van-zanten
  - niels-haverdil
  - thommy-schuurink
tags:
  - darts
  - dt-irritant
  - rdb
  - automatisering
  - teambeheer
---

# D.T. Irritant — Beschikbaarheid-inventarisatie automatiseren

## Why this matters

Sander is teamcaptain van [[dt-irritant]] (Eredivisie, RDB Rivierenland). Elk seizoen verzamelt hij de beschikbaarheid van zijn 8 spelers voor alle competitiewedstrijden via een handmatig aangemaakte Google Forms-vragenlijst, en telt de reacties met de hand uit. Het nieuwe seizoen 26-27 staat al gepland (22 wedstrijden, 04-09-2026 t/m 10-05-2027) — Sander wil weten hoe Hermes hem hierbij kan helpen, en wil dit tijdens de vakantie (maandag 10-08-2026) verder oppakken als het een groter project wordt.

## Vooronderzoek (07-08-2026)

**Databron bevestigd werkend:** de Teambeheer-feed voor het team is direct te bevragen — `https://feeds.teambeheer.nl/web/team?d=1&t=394&s=26-27` — en bevat het complete wedstrijdschema: datum, thuis/uit, tegenstander, divisie (Eredivisie), speellocatie (DC De Rijnvogels, Driel). Stabiele URL-parameters (`d`, `t`, `s` voor seizoen) → jaarlijks hergebruikbaar, alleen `s=` hoeft te wijzigen. Zie ook het bestaande feed-overzicht in [[teambeheer-rdb-feeds]].

**Huidige handmatige workflow:**
1. Sander leest de 22 wedstrijddata van de RDB/Teambeheer-website over
2. Bouwt een Google Form met die datums als vragen
3. Stuurt de link naar alle 8 spelers
4. Telt de reacties met de hand uit per wedstrijd

## Voorstel — drie niveaus

**Niveau 1 — Alleen data-overname (kleinste ingreep)**
Hermes haalt jaarlijks de fixture-lijst op via de Teambeheer-feed en levert die kant-en-klaar aan (datum, thuis/uit, tegenstander). Sander bouwt de Google Form zelf zoals nu, maar hoeft niets meer over te typen vanaf de website. Geen nieuwe koppelingen nodig, werkt morgen al.

**Niveau 2 — Formulier ook automatisch aanmaken (aanbevolen startpunt)**
Bovenop niveau 1: een n8n-workflow zet de opgehaalde wedstrijddata automatisch om in een nieuwe Google Form (via de Google Forms API). Sander plakt alleen nog de link in de teamgroep. Vereist een Google Forms-koppeling binnen n8n — moet Daedalus nog verifiëren of dit via een kant-en-klare node kan of een HTTP-request-node nodig is (n8n's ingebouwde Google Forms-node is vooral gericht op het uitlezen van reacties, niet op het aanmaken van formulieren; dat moet bevestigd worden voor dit niveau haalbaar is).

**Niveau 3 — Volledig automatisch overzicht**
Bovenop niveau 2: reacties (die al automatisch in een Google Sheet landen, standaardgedrag van Forms) worden per wedstrijd samengevat tot een simpel overzicht van wie beschikbaar is, met een Todoist-taak voor Sander als spelers na een paar dagen nog niet gereageerd hebben. Grootste tijdsbesparing, maar ook de meeste bouwtijd.

**Aanbeveling:** starten met niveau 2 — grootste praktische tijdswinst (geen handmatig overtypen én geen handmatig formulier bouwen) tegen beperkte bouwinspanning, met niveau 3 als latere uitbreiding zodra niveau 2 een seizoen heeft gedraaid.

## Next steps

- [ ] Daedalus laat verifiëren of Google Forms via n8n programmatisch aan te maken is (niveau 2), of dat een directe Forms-API-koppeling nodig is
- [ ] Maandag 10-08-2026: Sander bekijkt dit voorstel en kiest een niveau om mee verder te gaan

## Bronnen

- [[dt-irritant]]
- [[rivierenland-darts-bond]]
- [[teambeheer-rdb-feeds]]

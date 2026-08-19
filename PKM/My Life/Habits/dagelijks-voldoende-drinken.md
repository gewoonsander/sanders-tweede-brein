---
name: Dagelijks voldoende drinken
cadence: daily
status: active
started_on: 2026-08-16
key_element: gezondheid
daily_target: 2000
daily_target_unit: ml
default_serving_ml: 250
tags:
  - gezondheid
  - voeding
  - drinken
---

# Dagelijks voldoende drinken

## Why this habit

Dagelijks bewust voldoende drinken en de hoeveelheid zichtbaar maken in het voedings- en gewoontedashboard. Water wordt apart bijgehouden van koffie, thee, melk en andere dranken.

## What it looks like

Persoonlijk doel: dagelijks minimaal 2.000 milliliter **totale vochtinname**. Koffie telt volledig mee — gekozen door Sander op 2026-08-18, omdat een watermeter bij hem permanent op nul zou blijven staan en dus niets zegt.

Elke portie wordt los gelogd als een `- drink:`-regel onder de datum in `## Reflection`. De regels worden bij elkaar opgeteld tot het dagtotaal, waarop de meter in de Cockpit zich vult. Een standaardmok is 250 ml.

```
### 2026-08-18

- trigger: chat
- drink: 250 ml zwarte koffie
- drink: 250 ml zwarte koffie
```

De gewoonte staat op behaald zodra het dagtotaal 2.000 ml bereikt; dat rekent `regen-mypka-db.py` zelf uit, er is geen losse `- done:`-regel nodig.

**Wat Sander drinkt (vastgelegd 2026-08-18, door hem zelf gemeld):** vrijwel uitsluitend zwarte koffie — naar eigen zeggen 99,9% van zijn totale drankgebruik. Zwarte koffie bevat geen noemenswaardige calorieen en telt volgens het Voedingscentrum mee in de totale vochtinname. Wanneer Sander "koffie" zegt, betekent dat dus altijd zwarte koffie: geen melk, geen suiker, en geen kcal-schatting nodig.

Het Voedingscentrum adviseert mannen en jongens vanaf 13 jaar normaal gesproken minimaal 1,4 tot 1,8 liter **totaal drinken** per dag. Water, thee, koffie, melk en vergelijkbare dranken tellen daarin mee. Bij warm weer, intensief bewegen, veel zweten, koorts, diarree of overgeven kan meer nodig zijn. Het persoonlijke doel van 2 liter water ligt dus boven het normale minimum en is geen algemene medische noodzaak.

Bron: [Vochtbalans — Voedingscentrum](https://www.voedingscentrum.nl/encyclopedie/vocht.aspx), geraadpleegd 2026-08-16.

Bij medische vochtbeperkingen of aandoeningen waarbij vochtinname belangrijk is, gaat persoonlijk advies van arts of diëtist voor.

## Reflection

### 2026-08-19

- trigger: chat
- drink: 250 ml water
- drink: 250 ml zwarte koffie

### 2026-08-18

- trigger: chat
- drink: 250 ml zwarte koffie

### 2026-08-17

- done: false
- trigger: close-session
- note: bij afsluiten aangegeven dat het vandaag niet gelukt is

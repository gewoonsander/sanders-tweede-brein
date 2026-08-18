---
name: feedback_drankjes_loggen_via_chat
description: "Meldt Sander in de chat dat hij iets gedronken heeft, log het dan meteen als `- drink:`-regel en regenereer de spiegel"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 283f494c-b2e7-4508-b290-ea825a76b17d
  modified: 2026-08-18T08:53:17.607Z
---

Sander logt zijn drinken bewust via de chat, niet via een knop of commando (keuze gemaakt 2026-08-18, nadat de hydratatiemeter was gebouwd). Zodra hij meldt dat hij iets gedronken heeft — "kop koffie", "mok op", "net een glas water" — voeg je zonder navragen een regel toe onder de datum van vandaag in `PKM/My Life/Habits/dagelijks-voldoende-drinken.md`:

```
- drink: 250 ml zwarte koffie
```

Draai daarna `Expansions/mypka-cockpit/scripts/regen-mypka-db.py`, anders blijft de meter in de Cockpit op de oude stand staan.

**Why:** de Cockpit-panelen zijn bewust alleen-lezen — markdown is de bron, de database een herbouwbare spiegel. Zonder die regeneratie klopt het glas in de Cockpit niet met wat hij werkelijk gedronken heeft.

**How to apply:** een standaardmok is 250 ml; liters mogen ook (`- drink: 1,5 l water`) en worden omgerekend. Het dagdoel is 2.000 ml totale vochtinname en wordt automatisch afgerekend — nooit zelf een `- done:`-regel toevoegen aan deze gewoonte. Zie [[user_drinkt_alleen_zwarte_koffie]]: koffie is bij hem altijd zwart, dus nooit naar melk of suiker vragen.

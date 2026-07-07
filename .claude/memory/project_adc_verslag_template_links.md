---
name: project-adc-verslag-template-links
description: "ADC Regio Oost Facebook-verslagen moeten standaard: (1) bij elk genoemd volgend toernooi een Dart Atlas inschrijflink, (2) aan het eind een link naar de actuele seizoenstand"
metadata:
  type: project
  originSessionId: adc-oost-verslag-ochtend-2026-07-07
---

Vaste opmaakeis voor de scheduled task `adc-oost-verslag-ochtend` (Facebook-verslagen ADC Regio Oost), ingesteld door Sander op 2026-07-07:

1. Bij elk toernooi genoemd onder "Volgende toernooien in Regio Oost": link direct naar de Dart Atlas toernooipagina (`https://www.dartsatlas.com/tournaments/[ID]`) als inschrijfmogelijkheid.
2. Aan het eind van elk verslag: een link naar de actuele seizoenstand (`https://www.dartsatlas.com/seasons/uoGtg6XqtbQH/player_standings`).

Toernooi-ID's voor Regio Oost worden gevonden via `read_page` op `https://www.dartsatlas.com/seasons/uoGtg6XqtbQH/tournaments/schedule` (alleen toekomstige toernooien staan hier, zie ook [[feedback_geen_aannames_als_feiten]] voor de bredere les over verifiëren i.p.v. aannemen).

**Why:** Sander wil dat spelers die het verslag lezen direct kunnen doorklikken om zich aan te melden en hun positie in het seizoen te checken, zonder zelf te hoeven zoeken.

**How to apply:** Dit is inmiddels verwerkt in de SKILL.md van de scheduled task zelf (Stap 4/5) én toegepast op het bestaande Arnhem-verslag (`ADC/Verslagen/facebook-verslag-arnhem-2026-07-06.md`). Bij het schrijven van elk nieuw ADC-verslag: deze twee links altijd meenemen, ook als de rest van het verslag verder niets bijzonders vraagt.

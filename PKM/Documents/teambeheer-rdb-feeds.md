---
title: Teambeheer.nl RDB-feeds
doc_type: inventory
tags:
  - teambeheer
  - rdb
  - feeds
  - competitie
---

# Teambeheer.nl — RDB Feeds

## Summary

Overzicht van openbare RSS/web-feed-URLs voor het Rivierenland Darts Bond (RDB) competitiegegevens via teambeheer.nl. Gebruikt voor live-updates van standen, spelergegevens, toernooiagenda's en specialistische rankings (180's, finishes, etc.).

**Bron:** `teambeheer.md` (Team Inbox, opgeslagen als referentiedocument).

## Available feeds

| Output | Feed URL | Use case |
|---|---|---|
| Stand (enkele poule) | `https://feeds.teambeheer.nl/web/stand/?d=8&div=1A` | Actuele stand van divisie/poule |
| Stand (alle poules) | `https://feeds.teambeheer.nl/web/stand-allepoules/?d=8` | Volledig overzicht per ronde |
| Beker | `https://feeds.teambeheer.nl/web/beker?d=26` | Bekercompetitie |
| Nacompetitie | `https://feeds.teambeheer.nl/web/nacompetitie?d=1` | Knockouts na reguliere seizoen |
| Speelgelegenheden | `https://feeds.teambeheer.nl/web/speelgelegenheden/?d=8` | Beschikbare speelplekken |
| 180-ers | `https://feeds.teambeheer.nl/web/scorelijst-bijzres/?d=8&t=1&filter=ADEB` | Spelers met maximale legs |
| Hoogste finishes | `https://feeds.teambeheer.nl/web/scorelijst-bijzres/?d=8&t=2&filter=ADEB` | Beste uitgooi's |
| Snelste leg | `https://feeds.teambeheer.nl/web/scorelijst-bijzres/?d=17&t=3&filter=ADEB` | Snelheid ranking |
| Persoonlijk klassement | `https://feeds.teambeheer.nl/web/scorelijst-pk?d=8` | Individuele ranking |
| Toernooiagenda | `https://feeds.teambeheer.nl/web/toernooiagenda/?d=8` | Komende toernooien |
| Team | `https://feeds.teambeheer.nl/web/team?d=8&t=2498` | Specifiek team (bijv. D.T. Irritant, teambeheer ID 2498) |
| Speler | `https://feeds.teambeheer.nl/web/speler?d=8&l=7287` | Specifieke speler |

## Domain mapping (teambeheer `d=` parameter)

- `d=1` — Rivierenland Darts Bond
- `d=8` — (unknown, likely RDB region)
- Overige domini — zie teambeheer.nl voor mapping

## Cross-references

[[rivierenland-darts-bond]] — Sander's thuisbond, ontvangt deze feeds.

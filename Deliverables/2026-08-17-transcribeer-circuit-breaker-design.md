---
title: "Transcribeer — pre-flight probe en circuit breaker"
date: 2026-08-17
auteur: Daedalus
status: goedgekeurd
type: design
betreft: "~/.claude/skills/transcribeer/transcribeer.py (Mac mini + MacBook Air)"
---

# Transcribeer — pre-flight probe en circuit breaker

## Aanleiding

Op 2026-08-17 draaide `uv run transcribeer.py https://www.youtube.com/@myicor --alles`
over 574 video's. Het IP van de Mac mini (82.168.67.113) was op dat moment al door
YouTube geblokkeerd. Bewijs: video **#1** faalde al met `IpBlocked`, en een probe om
19:43 op dezelfde video gaf `IpBlocked` op de mini terwijl de MacBook Air
(46.243.190.226) diezelfde video wél ophaalde.

Het script merkte daar niets van en ploegde door: 22 nieuwe pogingen, 22× `IpBlocked`
op de ondertitels (100%), 14× `HTTP Error 403` op de audio-download (64%). Er is geen
enkel mechanisme dat "het gaat structureel mis" herkent.

## Ontwerpprincipe

Twee losse subsystemen raken YouTube en kunnen onafhankelijk geblokkeerd raken:

| Subsysteem | Endpoint | Faalsignaal |
|---|---|---|
| `youtube_transcript_api` | timedtext-download | `IpBlocked` / `RequestBlocked` |
| `yt-dlp` | video-data-download | `HTTP Error 403` / `429` |

Metadata (de video-lijst, de kanaalnaam) blijft tijdens een blokkade gewoon werken —
geverifieerd op 2026-08-17. De teller mag dus **niet** op metadata-succes resetten.

Onderscheid dat het ontwerp hard maakt: een **blokkade** (het IP mag niet meer) is iets
anders dan een **legitieme mislukking** (deze video heeft geen ondertitels). Alleen het
eerste telt mee voor afbreken. Anders stopt het script op een kanaal dat toevallig een
reeks video's zonder ondertitels heeft.

## Ontwerp

### 1. Pre-flight probe

Vóór de hoofdlus één echte `fetch()` op de eerste video uit de lijst.

- Blokkade → onmiddellijk stoppen, exit-code **2**, melding:
  "IP geblokkeerd door YouTube — probeer later opnieuw of vanaf een ander netwerk."
- Andere fout (geen ondertitels, video niet beschikbaar) → dat zegt niets over het IP,
  dus gewoon doorgaan.
- Kosten: één request. Dat is precies het request dat de hoofdlus toch zou doen.
- Uitschakelbaar met `--geen-preflight`.

### 2. Circuit breaker

Twee **aparte** tellers van opeenvolgende blokkades: ondertitels en audio-download.
Elke teller reset op een succes van dat subsysteem.

- Drempel: 5 op rij (instelbaar via `--stop-na N`, `0` = uit).
- Bij overschrijding: stoppen met exit-code **3** en een samenvatting van wat wél is
  binnengehaald, zodat een volgende run via `already_done()` verder kan.
- Twee losse tellers, want de audio-terugval kan blijven werken terwijl de ondertitels
  geblokkeerd zijn — dat gebeurde vandaag ook: 8 van de 22 video's kwamen er via
  Whisper wél doorheen.

### 3. Throttle en backoff

- Vaste pauze tussen video's die echt netwerkwerk deden (`--pauze`, default 2 s).
  Overgeslagen video's (`already_done`) kosten geen pauze.
- Na een blokkade exponentiële backoff: 2, 4, 8, 16, 32 s, afgetopt op 60 s.
  Reset zodra het subsysteem weer iets oplevert.

## Afgewogen alternatieven

| Optie | Waarom niet gekozen |
|---|---|
| Proxy / IP-rotatie | Lost het echte probleem op, maar kost geld en brengt een derde partij in de keten. Buiten scope; eerst niet-geblokkeerd raken. |
| Cookies uit de browser meegeven aan yt-dlp | Koppelt Sanders YouTube-account aan geautomatiseerde downloads. Accountrisico groter dan de winst. |
| Alleen throttlen, geen breaker | Helpt niet als het IP al geblokkeerd is bij aanvang — precies het geval van vandaag. |

## Verificatie

Elk onderdeel wordt getest met gesimuleerde blokkades (gemonkeypatchte netwerk-laag),
zodat er geen extra YouTube-verkeer nodig is:

1. Pre-flight met `IpBlocked` → exit-code 2, hoofdlus draait niet.
2. Pre-flight met "geen ondertitels" → gaat gewoon door.
3. 5 opeenvolgende ondertitel-blokkades → exit-code 3.
4. 4 blokkades, dan succes, dan 4 blokkades → draait door (teller reset).
5. Legitieme mislukkingen (geen ondertitels) → breken niet af.
6. `--stop-na 0` → breaker uit.

## Uitrol

Beide machines krijgen hetzelfde bestand; md5 moet daarna gelijk zijn.
Zie project-memory `project_transcribeer_skill_multi_machine`.

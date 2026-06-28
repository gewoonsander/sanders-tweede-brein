---
sop_id: SOP-011
title: ADC toernooi-analyse — data ophalen en verwerken uit Dart Atlas
default_owner: Silas (schema/structuur) + Mack (fetches)
status: active
triggers:
  - "Analyseer het toernooi van [locatie/datum]"
  - Aangeroepen vanuit WS-004 of WS-006 na afloop van een ADC-toernooi in Regio Oost
references:
  - WS-004-facebook-toernooi-verslag
  - WS-006-adc-facebook-verslag
  - SOP-010-adc-inschrijvingen-opvragen
  - adc
tags: [ADC, darts, dart-atlas, analyse, regio-oost, statistieken]
last_updated: 2026-06-28
---

# SOP-011 — ADC toernooi-analyse — data ophalen en verwerken uit Dart Atlas

## Doel

Gestructureerde procedure voor het ophalen en berekenen van alle statistieken die nodig zijn voor het ADC-toernooiverslag (Facebook-bericht via [[WS-006-adc-facebook-verslag]] of [[WS-004-facebook-toernooi-verslag]]). Output is een gestructureerd markdown-blok dat direct als invoer dient voor de verslagfase.

Reusable by any agent — Mack voert de fetches uit, Silas definieert de schema's, Penn verwerkt de output in het bericht.

---

## Benodigde input

- Dart Atlas toernooi-URL of toernooi-ID (via [[SOP-010-adc-inschrijvingen-opvragen]] als niet bekend)
- Seizoen-ID (voor volgende toernooien)

---

## Stap 1 — Toernooi-basisinformatie ophalen

Fetch: `https://www.dartsatlas.com/tournaments/[ID]`

Haal op en leg vast:

| Veld | Waarde |
|---|---|
| Toernooinaam | |
| Categorie | Amateur I / Amateur II / Elite |
| Locatie + venue | |
| Datum | YYYY-MM-DD |
| Seizoen | |
| Format | Best of X (leg-formaat per ronde) |

---

## Stap 2 — Eindstand en finaleverloop

Fetch: `https://www.dartsatlas.com/tournaments/[ID]/results`

Leg vast:
- Winnaar (naam + gemiddelde in de finale)
- Finalist / runner-up (naam + gemiddelde in de finale)
- Finale-score (bijv. 6–4)
- Score per leg in de finale (bijv. Leg 1: 501 → 0 in 18 darts)
- Halve finalisten + scores (voor kwalificatie-context)
- Kwartfinale-uitslag indien van toepassing

**Kwalificatie-implicatie:** noteer voor welk volgend toernooi of kampioenschap de winnaar zich heeft geplaatst (seizoensrankingpositie, provinciale finale, nationaal kampioenschap — raadpleeg [[adc]] voor de structuur van het seizoen).

---

## Stap 3 — Groepsindeling en spelersgemiddelden

Fetch: `https://www.dartsatlas.com/tournaments/[ID]/groups`

Haal op:
- Aantal groepen (N)
- Per groep: spelerslijst + eindstand + gemiddelden per speler
- Doorgestoten spelers naar de KO-fase

---

## Stap 4 — 180's per speler

URL-formaat: `https://www.dartsatlas.com/tournaments/[ID]/player_stats/[SPELER_ID]`

Speler-ID's volgen uit stap 3.

Haal per speler op: totaal aantal 180's in dit toernooi.

**Sortering voor output:** oplopend op aantal — climax naar de meeste (bijv. 1 — 1 — 2 — 3 — 5). Bij gelijk aantal op één rij.

**Bekende beperking:** bij 20+ spelers kan rate limiting spelerspagina's leeg retourneren. Aanpak:
1. Fetchen in volgorde: finalist → halvefinalist → kwartfinalist → groepswinnaars → rest.
2. Gefaalde pagina's opnieuw proberen na korte pauze.
3. Bij aanhoudende mislukking: in de output markeren welke spelers onbevestigd zijn.
4. Nooit raden — alleen bevestigde aantallen in het bericht.

---

## Stap 5 — Hoge finishes (checkouts ≥ 100)

Gebruik de parallelle fetch-methode uit [[WS-004-facebook-toernooi-verslag]] stap 1.5 voor alle wedstrijd-ID's (groepswedstrijden + KO-wedstrijden).

Haal per wedstrijd de checkout-waarde per leg op (laatste worp van de winnende speler).

**Classificatie:**

| Checkout | Label |
|---|---|
| 100–139 | Hoge finish |
| 140–169 | Bijzonder hoge finish |
| 170 | The Big Fish (maximale checkout) |

**Sortering voor output:** oplopend op score — climax naar de hoogste (bijv. 100 — 104 — 116 — 120 — 170).

Leg per finish vast: score + spelersnaam + wedstrijd (bijv. "groepsfase ronde 2").

---

## Stap 6 — Top 5 match averages

Op basis van de data uit stap 3 + KO-resultaten:

Rangschik de vijf hoogste gemiddelden van het toernooi (over één complete wedstrijd). Leg vast: spelersnaam + gemiddelde + tegenstander + fase (groep/KO).

---

## Stap 7 — Top 5 snelste legs

Op basis van de wedstrijdpagina's (stap 5):

Tel het aantal darts per leg (winnaar). Rangschik de vijf legs met het minste aantal darts. Leg vast: dartaantal + spelersnaam + wedstrijd + fase.

---

## Stap 8 — Volgende toernooien Regio Oost

Fetch: `https://www.dartsatlas.com/seasons/[SEIZOEN_ID]/tournaments/schedule`

Haal op: de eerstvolgende 2–3 toernooien per locatie in Regio Oost met datum en directe link.

Seizoens-ID's staan in [[SOP-010-adc-inschrijvingen-opvragen]].

---

## Outputformaat

Lever de data af als gestructureerd markdown-blok, klaar voor invoer in [[WS-006-adc-facebook-verslag]] of [[WS-004-facebook-toernooi-verslag]] Fase 2:

```markdown
## Toernooidata — [TOERNOOINAAM] ([DATUM])

**Basisinfo**
- Categorie: [Amateur I / Elite]
- Locatie: [VENUE, STAD]
- Seizoen: [SEIZOEN]
- Format: Best of [X]

**Eindstand**
- Winnaar: [NAAM] (gem. [X.XX] in de finale)
- Runner-up: [NAAM] (gem. [X.XX])
- Finale-score: [X–Y]
- Kwalificatie-implicatie: [WAT LEVERT DIT OP]

**Finaleverloop**
- Leg 1: [uitslag in darts]
- Leg 2: ...

**180's (oplopend)**
- [NAAM]: [N]
- [NAAM]: [N]
- [NAAM]: [N] ← meeste

**Hoge finishes (oplopend)**
- [SCORE] — [NAAM] ([fase])
- [SCORE] — [NAAM] ([fase])
- [SCORE] ← hoogste — [NAAM] ([fase])

**Top 5 match averages**
1. [NAAM] — [X.XX] vs [TEGENSTANDER] ([fase])
...

**Top 5 snelste legs**
1. [N] darts — [NAAM] vs [TEGENSTANDER] ([fase])
...

**Volgende toernooien Regio Oost**
- [LOCATIE] — [DATUM]: [LINK]
- [LOCATIE] — [DATUM]: [LINK]
```

---

## Gerelateerd

- [[WS-004-facebook-toernooi-verslag]] — volledige workstream voor datafetch + bericht schrijven
- [[WS-006-adc-facebook-verslag]] — stijlregels en template voor het Facebook-bericht
- [[SOP-010-adc-inschrijvingen-opvragen]] — seizoens-URLs en inschrijvingen
- [[adc]] — ADC topic met regiocontext en seizoensstructuur

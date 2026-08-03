---
ws_id: WS-006
title: ADC Facebook-bericht — stijlregels en invultemplate
owners:
  - Penn (schrijven)
  - Larry (review en aanlevering aan Sander)
tags: [ADC, darts, facebook, regio-oost, verslag, template, stijl]
last_updated: 2026-08-03
---

# WS-006 — ADC Facebook-bericht — stijlregels en invultemplate

## Doel

Dit workstream codificeert Sander's schrijfstijl voor ADC-toernooiverslagen en biedt een volledig invulbaar template. Invoer komt uit [[SOP-011-adc-toernooi-analyse]]. Penn vult het template in; Larry legt het ter review voor aan Sander.

Dit workstream is een **stijl- en template-laag bovenop [[WS-004-facebook-toernooi-verslag]]** — WS-004 beschrijft de volledige datafetch- en publicatieprocedure (Mack + Penn + review). WS-006 voegt de expliciete stijlregels en het template toe dat Penn gebruikt bij stap Fase 2 van WS-004.

---

## Stijlregels (gebaseerd op Sander's eigen posts)

### Toon

- Enthousiast, licht journalistiek, gemeenschapsgericht
- Eerste persoon meervoud vermijden — schrijf alsof je de lezer meeneemt bij iets dat al heeft plaatsgevonden
- Persoonlijk maar professioneel: feliciteer de winnaar bij naam, benoem de prestatie concreet
- Mobielleesbaar: korte alinea's, witregels tussen secties

### Structuur (bijgewerkt 03-08-2026 — Driel-stijl is de norm)

⚠️ **Stijlwijziging:** vanaf het Driel-verslag (27-07-2026) is de vorm verschoven van vaste emoji-secties naar een lopend verhaal per fase. Bevestigd als de norm door Sander op 03-08-2026 (Hengelo-verslag). De regels hieronder vervangen de oude emoji-sectiestructuur.

- **Lopend verhaal, geen emoji-sectiehoofdstukken** — de tekst leest als een kort verslag: opening, groepsfase (per groep een alinea), knock-outfase (per ronde een alinea), finale, dan de statistiekblokken.
- Statistiekblokken (180's, hoge finishes) blijven wél als vetgedrukte kop + bullets — dat is de enige plek met structuur-opmaak.
- **"Winnaar in de spotlight"** als apart alineablok met 🏆, vlak voor de afsluiting.
- Geen genummerde lijsten in de publieke post — bullet-punten of gewone regels
- **Geen hashtags** — vervallen sinds de Driel-stijl. Alleen de oproep tot taggen/delen aan het einde, gevolgd door de seizoenstand-link.

### Statistieken

- **180's:** oplopend sorteren (laagste aantallen eerst, meeste als climax aan het einde van de lijst)
- **Hoge finishes:** oplopend sorteren op score (laagste eerst, hoogste als highlight onderaan); de 170 krijgt altijd het label "The Big Fish"
- Gemiddelden altijd met twee decimalen (bijv. 68.42)
- Scores in finale-notatie: bijv. 6–4 (niet "6 om 4" of "6-4")

### Vaste afsluiting

Elk bericht eindigt altijd met (geen hashtags, zie stijlwijziging hierboven):

> Deel dit verslag gerust en tag de spelers erin — dat wordt gewaardeerd! 📲
>
> 📊 [Bekijk de actuele seizoenstand Regio Oost](https://www.dartsatlas.com/seasons/[SEIZOEN_ID]/player_standings)

### Wat altijd aanwezig is

| Element | Toelichting |
|---|---|
| Openingsregel | Toernooinaam + datum + locatie, aanstekelijk geformuleerd |
| Winnaar + felicitatie | Persoonlijk, met finale-score en gemiddelden |
| Kwalificatie-implicatie | Waar plaatst de winnaar zich voor? (seizoensranking, provinciale finale, etc.) |
| Locatiebedanking | Venue en organisator altijd bedanken voor gastvrijdheid |
| Seizoenscontext | Wat was dit toernooi? Wat komt er nog in het seizoen? |
| 180's | Oplopend gesorteerd, climax naar de meeste |
| Hoge finishes | Oplopend gesorteerd, hoogste als highlight |
| Volgende toernooien | Eerstvolgende toernooien Regio Oost met datum en link |
| Winnaarsfoto | Altijd een foto — aangeleverd door Sander, nooit weglaten |
| Oproep + hashtags | Vaste afsluiting, zie boven |

### Optionele elementen

- Quote van de winnaar (indien aangeleverd door Sander)
- Bijzondere prestatie uit de KO-fase (bijv. hoogste gem. van het toernooi)

---

## Invultemplate (Driel-stijl, bijgewerkt 03-08-2026)

Kopieer dit template en vul alle `[PLACEHOLDERS]` in met de data uit [[SOP-011-adc-toernooi-analyse]]. Lopend verhaal, geen emoji-secties (zie stijlwijziging hierboven). Volledig uitgewerkt voorbeeld: [[ADC/Verslagen/facebook-verslag-hengelo-2026-08-02]].

---

```
🎯 [WINNAAR] verovert de titel in [LOCATIE]

[VENUE] in [LOCATIE] was [DAG] het decor van [TOERNOOI-CONTEXT, bv. "de Winmau Benelux Open pubqualifier"]. [AANTAL] spelers streden in [N] groepen om een plek in de knock-out, wat resulteerde in [KORTE SFEERZIN].

**Groepsfase**

[Per groep één alinea: wie werd 1e/2e/etc, met gemiddelde en W-L, highlight de groepswinnaar en eventuele gelijke stand.]

**Knock-outfase**

[Per ronde (Last 16 / kwartfinale / halve finale) één alinea met alle uitslagen + gemiddeldes van de opvallendste wedstrijden.]

**Finale**

In de finale, best of [X], trok [WINNAAR] met [GEM.] gemiddeld aan het langste eind: [SCORE] tegen [RUNNER-UP] ([GEM.] gemiddeld).

**Statistieken — 180's**

- 1x 180: [NAMEN]
- 2x 180: [NAMEN]
- ...
- [Nx] 180: [NAAM] ← meeste

Samen goed voor [TOTAAL] maximums, met [NAAM(EN)] als topscorer(s).

**Statistieken — hoge finishes**

- [SCORE]: [NAAM]
- ...
- [HOOGSTE SCORE]: [NAAM] — hoogste finish van de avond
[EVENTUEEL: 170 = The Big Fish, apart vermelden]

**Winnaar in de spotlight** 🏆

[WINNAAR] pakte in [LOCATIE] de titel: [korte recap groepsfase + knock-out + finale-cijfers]. [KWALIFICATIE-IMPLICATIE, indien bekend]. Van harte gefeliciteerd, [NAAM]! ✅

[OPTIONEEL — quote winnaar]

**Volgende toernooien in Regio Oost**

- [DAG DATUM] — [VENUE, LOCATIE], aanvang [TIJD] — [inschrijven via Dart Atlas]([LINK])
- ...

Deel dit verslag gerust en tag de spelers erin — dat wordt gewaardeerd! 📲

📊 [Bekijk de actuele seizoenstand Regio Oost]([LINK SEIZOENSRANKING])
```

---

## Werkinstructie voor Penn

1. Ontvang de gestructureerde toernooidata van Mack/Larry (output van [[SOP-011-adc-toernooi-analyse]]).
2. Kopieer het template hierboven.
3. Vul alle `[PLACEHOLDERS]` in met de echte data. Verwijder placeholders die niet van toepassing zijn (bijv. The Big Fish als er geen 170 was).
4. Controleer de sortering: 180's oplopend, hoge finishes oplopend.
5. Pas de sfeerwoorden aan op het specifieke toernooi — geen copy-paste van vorige verslagen.
6. Lever het concept-bericht aan Larry.
7. Larry legt het voor aan Sander met een checklist van wat automatisch ingevuld is en wat nog ontbreekt (foto, eventuele quote).
8. **Vaste stap (bijgewerkt 03-08-2026):** zodra het concept compleet is (incl. links naar volgende toernooien, zie [[WS-004-facebook-toernooi-verslag]] Fase 4), slaat Hermes het op in `ADC/Verslagen/facebook-verslag-[locatie]-YYYY-MM-DD.md`, gedateerd op de toernooidatum.

Sander publiceert zelf — Penn en Larry publiceren nooit rechtstreeks op Facebook.

---

## Gerelateerd

- [[WS-004-facebook-toernooi-verslag]] — volledige workstream (datafetch + Penn + review + publicatie)
- [[SOP-011-adc-toernooi-analyse]] — data ophalen en analyseren uit Dart Atlas
- [[SOP-010-adc-inschrijvingen-opvragen]] — seizoens-URLs en inschrijvingen
- [[adc]] — ADC topic met regiocontext

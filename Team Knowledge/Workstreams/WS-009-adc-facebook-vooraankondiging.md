---
ws_id: WS-009
title: Facebook-vooraankondiging vóór ADC-toernooi
owners:
  - Hermes (orchestrator, Dart Atlas datafetch)
  - Penn (schrijven Facebook-bericht)
tags: [ADC, darts, facebook, dart-atlas, regio-oost, vooraankondiging]
last_updated: 2026-08-17
---

# WS-009 — Facebook-vooraankondiging vóór ADC-toernooi

## Doel

Vóór een ADC-toernooi in Regio Oost genereert dit workstream een aankondigingsbericht voor de Facebook-groep en WhatsApp — een oproep om je op tijd aan te melden, met een haakje naar de actuele stand van de seizoensranglijst. Dit is het spiegelbeeld van [[WS-004-facebook-toernooi-verslag]] (verslag ná afloop): waar WS-004 terugkijkt, kijkt WS-009 vooruit.

## Voorgeschiedenis

Dit post-type bestond al — [[2026-07-06-facebook-vooraankondiging-arnhem]] en [[2026-07-13-facebook-vooraankondiging-driel]] — maar werd alleen twee keer op verzoek gemaakt en nooit als staande procedure vastgelegd. Daardoor gebeurde het bij geen van de zes daaropvolgende toernooien meer, inclusief het toernooi van vandaag (Hengelo, 16-08-2026), wat Sander opviel. Dit workstream dicht dat gat.

## Triggers

⚠️ **Staande regel (sinds 16-08-2026):** elk ADC-toernooi in Regio Oost krijgt standaard een vooraankondiging — geen opt-in, Sander hoeft er niet apart om te vragen. Net als bij WS-004.

**Automatische trigger:** de bestaande ochtendroutine (`scripts/adc-verslag-ochtend.mjs`, LaunchAgent `nl.gewoonsander.adc-verslag-ochtend`, dagelijks 07:00 op de Mac mini) is uitgebreid met een tweede check: naast "was er gisteren een toernooi" (verslag) checkt hij nu ook "is er vandaag een toernooi" (vooraankondiging). Zelfde routine, zelfde tijdstip, geen aparte LaunchAgent nodig — zie het bijgewerkte `scripts/adc-verslag-ochtend.prompt.md`.

**Handmatige triggers (blijven ook werken):**
- "Maak een vooraankondiging voor [toernooi/locatie]"
- "Schrijf de aankondiging voor vanavond"

## Fase 1 — Data ophalen

Hergebruikt dezelfde Dart Atlas-toegangsmethode als WS-004/SOP-011 (`curl` met browser-User-Agent, nooit `WebFetch` — Dart Atlas blokkeert AI-crawlers).

1. **Toernooi van vandaag vinden** — `https://www.dartsatlas.com/seasons/[SEIZOEN_ID]/tournaments/schedule`. Zoek een toernooi gedateerd op vandaag: locatie, venue, aanvangstijd, toernooi-ID (voor de inschrijflink).
2. **Actuele koploper** — `https://www.dartsatlas.com/seasons/[SEIZOEN_ID]/player_standings`. Haal de huidige nummer 1 op (naam, gemiddelde, punten). Check ook of die koploper het meest recente toernooi won (haakje: "vorige week pakte X de titel en staat nu bovenaan") — zo niet, gebruik gewoon de huidige stand zonder dat specifieke haakje.
3. **Seizoensranking-link** — voor de vaste afsluiting, zelfde patroon als WS-006.

Seizoens-ID's staan in [[SOP-010-adc-inschrijvingen-opvragen]].

## Fase 2 — Penn: bericht schrijven

### Stijl
Zelfde toon als WS-006 (enthousiast, community-gericht, mobielleesbaar, Nederlands). **Geen hashtags** (huidige huisstijl sinds 03-08-2026, zie WS-006).

### Template

```
🎯 **Vanavond weer los! [LOCATIE], [DAG DATUM]** 🔥

[Haakje: recap van de huidige koploper/laatste uitslag — bv. "Vorige week in [LOCATIE VORIGE] was [NAAM] niet te stoppen: hij/zij pakte de titel met een gemiddelde van [GEM.] en staat daarmee nu bovenaan de ranglijst van Regio Oost."] 👑

[Uitnodigende, community-gerichte zin: wie durft het op te nemen tegen de koploper / wordt het spannend vanavond]

📍 Vanavond: **[VENUE], [LOCATIE]**
🕗 Aanvang: **[TIJD]**

Meld je snel aan, want vol = vol! 👉 [INSCHRIJFLINK — dartsatlas.com/tournaments/ID]

📊 Bekijk de actuele seizoenstand hier: [SEIZOENSRANKING-LINK]

Deel dit bericht gerust en tag wie er nog mee moet doen! 🔄
```

Geen quote-placeholder (zelfde regel als WS-006 — nooit aangeleverd, altijd geschrapt).

## Fase 3 — Review door Sander

Zelfde flow als WS-004 Fase 3: Hermes legt het concept voor met een checklist van wat automatisch is ingevuld en de vraag om akkoord vóór publicatie. Sander publiceert zelf — zie [[WS-004-facebook-toernooi-verslag]] Fase 3 voor de drie onderzochte en geblokkeerde automatiseringsroutes (17-08-2026): Claude in Chrome (Anthropic-domeinbeleid, geen override), sandbox-browser (Facebook-wachtwoordmuur), n8n/Graph API (Meta's permanente Groups API-stop sinds 22-04-2024).

## Fase 4 — Opslaan

Zelfde locatie en naamconventie als WS-004 Fase 4, apart type: `ADC/Verslagen/facebook-vooraankondiging-[locatie]-YYYY-MM-DD.md` — datum is de toernooidatum. Bovenaan `**Status: CONCEPT — ter review door Sander**`, na publicatie bijwerken naar `**Status: GEPUBLICEERD — op Facebook geplaatst door Sander**` (zelfde patroon als de verslagen, zie [[dagstart]] stap 6).

⚠️ Geen Bash-controle vooraf — zelfde regel als WS-004 Fase 4. Write maakt ontbrekende mappen zelf aan; de routine draait onbemand.

## Verhouding tot WS-004/WS-006

WS-009 is geen vervanging maar een aanvulling: WS-004/006 = na afloop (resultaten, statistieken), WS-009 = vooraf (aankondiging, oproep tot aanmelden). Beide draaien via dezelfde dagelijkse 07:00-routine en dezelfde Dart Atlas-toegangsmethode, en beide concepten worden door [[dagstart]] stap 6 gesignaleerd.

## Gerelateerd

- [[WS-004-facebook-toernooi-verslag]] — het spiegelbeeld: verslag ná afloop
- [[WS-006-adc-facebook-verslag]] — stijlregels, gedeeld uitgangspunt
- [[SOP-010-adc-inschrijvingen-opvragen]] — seizoens-URLs
- [[SOP-011-adc-toernooi-analyse]] — Dart Atlas-fetchmethode (curl, geen WebFetch)
- [[adc]] — ADC topic met regiocontext

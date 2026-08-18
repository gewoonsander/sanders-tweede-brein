---
ws_id: WS-009
title: Facebook-vooraankondiging vóór ADC-toernooi
owners:
  - Hermes (orchestrator, Dart Atlas datafetch)
  - Penn (schrijven Facebook-bericht)
tags: [ADC, darts, facebook, dart-atlas, regio-oost, vooraankondiging]
last_updated: 2026-08-18
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

## Uitzondering — toernooi te vroeg gestart, opnieuw aangemaakt

Vastgelegd 18-08-2026 na Arnhem 17-08-2026. De toernooimanager zette het toernooi per ongeluk op "gestart" in Dart Atlas, waardoor inschrijven onmogelijk werd. Sander moest het toernooi verwijderen, waarna alle deelnemers automatisch hun inschrijfgeld terugkregen, en een vervangend toernooi aanmaken met een nieuw ID. De vooraankondiging van 07:00 stond toen al klaar met de oude, dode inschrijflink.

**Signaal:** de inschrijflink in een al gemaakte vooraankondiging geeft geen toernooipagina meer, of Sander meldt dat een toernooi opnieuw is aangemaakt.

**Herstelstappen:**

1. **Nieuw toernooi-ID ophalen** — via de seizoenskalender (`/seasons/[SEIZOEN_ID]/tournaments/schedule`). Let op: het vervangende toernooi krijgt vaak een gewijzigde naam (bv. "Arnhem" wordt "Arnhem 2"), terwijl een ander, later toernooi de oorspronkelijke naam kan houden. Ga af op de datum, niet op de naam.
2. **Inschrijflink in de vooraankondiging vervangen** en de waarschuwing bovenaan de post zetten, vóór het inhoudelijke haakje — mensen die scrollen missen hem anders. Vermeld expliciet dat een eerdere inschrijving is vervallen en het geld is teruggestort, en dat opnieuw inschrijven én opnieuw betalen nodig is. Zet ook aanmeldtijd op locatie en het inschrijfgeld erbij; die zijn dan opeens weer relevant.
3. **Noem de toernooimanager niet bij naam** in publieke communicatie. Sander schrijft in de ik-vorm als regionaal manager en neemt de fout op zich.
4. **Oude deelnemerslijst reconstrueren** — de verwijderde toernooipagina is weg, maar de inschrijfnotificaties van `notifier@dartsatlas.com` staan nog in de mailbox. Zoek op `from:notifier@dartsatlas.com "[LOCATIE] player registration"`. Vergelijk die namen met de entries-pagina van het nieuwe toernooi; het verschil is de lijst mensen die persoonlijk benaderd moet worden. Let op: spelers die handmatig door de organisatie zijn overgezet staan wél op de entries-pagina maar hebben géén notificatiemail.
5. **Persoonlijk bericht sturen** naar iedereen die nog niet opnieuw is ingeschreven. Een groepspost alleen is onvoldoende — deze mensen hádden al betaald en verliezen hun plek zonder dat het aan hen lag.
6. **Na afloop controleren** wie er uiteindelijk niet is komen opdagen, en die persoon een bericht sturen met de link naar het eerstvolgende toernooi.

Zie [[aankomstlijst-arnhem-2026-08-17]] en [[uitnodigingslijst-arnhem-2026-08-17]] als uitgewerkt voorbeeld.

## Verhouding tot WS-004/WS-006

WS-009 is geen vervanging maar een aanvulling: WS-004/006 = na afloop (resultaten, statistieken), WS-009 = vooraf (aankondiging, oproep tot aanmelden). Beide draaien via dezelfde dagelijkse 07:00-routine en dezelfde Dart Atlas-toegangsmethode, en beide concepten worden door [[dagstart]] stap 6 gesignaleerd.

## Gerelateerd

- [[WS-004-facebook-toernooi-verslag]] — het spiegelbeeld: verslag ná afloop
- [[WS-006-adc-facebook-verslag]] — stijlregels, gedeeld uitgangspunt
- [[SOP-010-adc-inschrijvingen-opvragen]] — seizoens-URLs
- [[SOP-011-adc-toernooi-analyse]] — Dart Atlas-fetchmethode (curl, geen WebFetch)
- [[adc]] — ADC topic met regiocontext

---
ws_id: WS-004
title: Facebook-verslag na ADC-toernooi
owners:
  - Larry (orchestrator)
  - Mack (Dart Atlas datafetch)
  - Penn (schrijven Facebook-bericht)
tags: [ADC, darts, facebook, dart-atlas, regio-oost, verslag]
last_updated: 2026-06-20
---

# WS-004 — Facebook-verslag na ADC-toernooi

## Doel

Na afloop van een ADC-toernooi in Regio Oost genereert dit workstream een kant-en-klaar Facebook-bericht voor de regiogroep. Mack haalt de data op uit Dart Atlas; Penn schrijft het bericht op basis van die data plus eventuele handmatige aanvullingen van Sander.

## Triggers

Voer dit workstream uit wanneer Sander vraagt:

- "Maak verslag [toernooinaam]"
- "Maak het verslag voor [locatie]"
- "Schrijf het Facebook-bericht voor het toernooi van [datum/locatie]"
- Of een andere variant die vraagt om een toernooi-bericht na afloop

## Benodigde input van Sander (voor je begint)

Larry vraagt Sander vóór uitvoering:

1. **Toernooi-URL** — de Dart Atlas pagina van het specifieke toernooi (bv. `https://www.dartsatlas.com/tournaments/[ID]`). Larry kan deze ook zelf opzoeken via [[SOP-003-adc-inschrijvingen-opvragen]] als het seizoen bekend is.
2. **Foto van de winnaar** — altijd handmatig aanleveren (Dart Atlas bevat geen foto's).
3. **Eventuele quote van de winnaar** — optioneel maar welkom.
4. **Facebook-groep URL** — voor de link naar de regiogroep (eenmalig instellen in [[adc]]).

## Fase 1 — Mack: Dart Atlas data ophalen

### Stap 1.1 — Toernooi-basispagina

Fetch: `https://www.dartsatlas.com/tournaments/[ID]`

Haal op: toernooinaam, datum, locatie, tournooiformat.

### Stap 1.2 — KO-resultaten

Fetch: `https://www.dartsatlas.com/tournaments/[ID]/results`

Haal op: finale-uitslag (winnaar + runner-up + score), alle KO-resultaten.

### Stap 1.3 — Groepsstandingen + gemiddelden

Fetch: `https://www.dartsatlas.com/tournaments/fyn1U1tqdoCL/groups`

Haal op: groepsindeling, eindstanden, gemiddelden per speler.

### Stap 1.4 — Spelerspagina's (efficiënt: 3 per groep)

Fetch per groep **maximaal 3 spelerspagina's** — dat levert alle unieke match-URLs op zonder overkill.

URL-formaat: `https://www.dartsatlas.com/tournaments/[ID]/player_stats/[SPELER_ID]`

Doel: verzamel alle unieke match-IDs voor stap 1.5. Elke wedstrijd staat in twee spelerspagina's — haal elke match-ID maar één keer op.

**Let op rate limiting:** Dart Atlas begint lege responses te geven bij >8-10 requests in korte tijd. Haal spelerspagina's sequentieel op als er problemen zijn.

### Stap 1.5 — Wedstrijdpagina's (checkouts)

Fetch alle unieke wedstrijdpagina's.

URL-formaat: `https://www.dartsatlas.com/matches/[MATCH_ID]`

**Wat zoeken:**

Per leg: identificeer de **laatste niet-nul score van de winnaar** in die leg. Dit is de checkout-waarde.

- Checkout ≥ 100 → noteren als **hoge finish** met naam speler en waarde
- Checkout ≥ 140 → apart markeren als bijzonder hoge finish
- Checkout = 170 of hoger → maximale finish, extra vermeldenswaardig

**Formaat per beurt:** `[darts] [resterende score tegenstander] [gegooid]`
- Winnaar van de leg: middelste kolom = 0
- Verliezer van de leg: middelste kolom = wat zij over hadden toen de ander finishte
- Bust (overgooi): score = 0 → overslaan bij bepalen checkout

**Prioriteit bij rate limiting:** Haal KO-wedstrijden (finale, SF, QF) als eerste op — die hebben de meeste kans op hoge finishes bij hogere gemiddelden.

### Stap 1.6 — 180's per speler

Uit de spelerspagina's (stap 1.4) lees je al het 180-veld per speler. Geen extra fetches nodig.

**⚠️ Bekende beperking — onvolledige 180-dekking bij rate limiting:**

Bij grotere toernooien (20+ spelers) kan Dart Atlas rate limiting triggeren waardoor een deel van de spelerspagina's een lege response teruggeeft. Dit leidt tot ontbrekende 180-totalen voor de getroffen spelers.

Aanpak bij gefaalde fetches:
1. Haal de groepenpagina eerst op (`/groups`) — dit geeft alle speler-IDs in één request, ook voor spelers die je anders pas laat zou ontdekken.
2. Probeer gefaalde pagina's opnieuw in een aparte batch, na een korte pauze (volgende groep fetches).
3. Als retries mislukken: vermeld in de concept-checklist welke spelers onbevestigd zijn, inclusief hun gemiddelde. Spelers met avg < 55 hebben statistisch gezien zelden een 180.
4. Geef in het bericht altijd het bevestigde aantal — nooit raden.

**Prioriteitsvolgorde voor spelerspagina's:**
Haal eerst de spelers op die het verst zijn gekomen (finalist → halvefinalist → kwartfinalist → groepswinnaars), dan pas de rest. Dit maximaliseert de 180-dekking zelfs als latere fetches falen.

### Stap 1.7 — Volgende toernooien in de regio

Fetch: `https://www.dartsatlas.com/seasons/[SEIZOEN_ID]/tournaments/schedule`

Haal op: de eerstvolgende toernooien per locatie in Regio Oost.

Seizoens-URLs staan in [[SOP-003-adc-inschrijvingen-opvragen]].

---

## Fase 2 — Penn: Facebook-bericht schrijven

Penn schrijft het bericht op basis van alle data uit Fase 1 plus de handmatige input van Sander.

### Vaste elementen (altijd aanwezig)

1. **Opening** — felicitaties aan de winnaar, kort en aanstekelijk
2. **Eindstand** — winnaar, runner-up, finale-score
3. **Locatiebedanking** — altijd de venue en organisator bedanken voor gastvrijdheid
4. **Seizoenreferentie** — vermeld dat het toernooi onderdeel is van [seizoen] + link naar de overall ranking op Dart Atlas
5. **180's** — totaal aantal in het toernooi + ranglijst per speler (meest naar minste; gelijk aantal = zelfde rij)
6. **Hoge finishes** — alle checkouts van 100 en hoger, gerangschikt van hoog naar laag, met naam speler erbij
7. **Volgende toernooien** — link naar eerstvolgende toernooi per locatie in de regio
8. **Winnaarsfoto** — altijd een foto (aangeleverd door Sander)
9. **Oproep tot taggen** — "Sharing is caring — tag de deelnemers en deel dit bericht!"

### Optionele elementen

- Quote van de winnaar (indien aangeleverd door Sander)
- Bijzondere statistieken (bv. hoogste gemiddelde, meeste breaks)

### Stijl

- Toon: enthousiast, community-gericht, kort genoeg om te lezen op mobiel
- Taal: **Nederlands**
- Lengte: geen vaste limiet, maar beknopt — elke regel moet iets toevoegen
- Hashtags: minimaal — alleen als ze echt waarde hebben voor bereik

### Voorbeeld-structuur (Penn vult in met echte data)

```
🎯 [TOERNOOINAAM] — [DATUM] | [LOCATIE]

Gefeliciteerd aan [WINNAAR] met de overwinning! 🏆
Finale: [WINNAAR] – [RUNNER-UP] [SCORE]

Een grote dank aan [LOCATIE + CONTACTPERSOON] voor de geweldige organisatie en gastvrijdheid!

📊 Dit toernooi maakt deel uit van de [SEIZOEN]-ranglijst. Bekijk de actuele stand hier: [LINK]

🎯 180's
Totaal: [N]
[NAAM] — [AANTAL]
[NAAM] — [AANTAL]
...

🏹 Hoge finishes (100+)
[SCORE] — [NAAM]
[SCORE] — [NAAM]
...

📅 Volgende toernooien in Regio Oost
[LOCATIE] — [DATUM]: [LINK]
[LOCATIE] — [DATUM]: [LINK]

Sharing is caring — tag de deelnemers en deel dit bericht! 🔄

#AmateurdartsBenelux #DartsRegiOost
```

---

## Fase 3 — Review door Sander

Penn levert het concept-bericht aan Larry. Larry presenteert het aan Sander met:
- Een checklist van wat automatisch is ingevuld
- Wat ontbreekt (foto, eventuele quote)
- De vraag om akkoord vóór publicatie

Sander publiceert zelf — Larry/Penn publiceren nooit rechtstreeks op Facebook.

---

## Handmatige invoer (nooit automatiseerbaar)

| Element | Bron | Actie |
|---|---|---|
| Foto van winnaar | Sander / venue manager via WhatsApp | Sander levert aan |
| Quote winnaar | Sander vraagt na afloop | Optioneel, aanleveren voor Penn |
| Facebook-publicatie | Sander | Sander plaatst zelf |

---

## Gerelateerd

- [[SOP-003-adc-inschrijvingen-opvragen]] — seizoens-URLs en inschrijvingen
- [[adc]] — ADC topic met regiocontext
- [[WS-001-daily-journaling]] — voor het loggen van het verslag in het journaal achteraf

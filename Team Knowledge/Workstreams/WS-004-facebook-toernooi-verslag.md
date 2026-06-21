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

⚠️ **Staande regel (sinds 21-06-2026):** elk ADC-toernooi in Regio Oost krijgt standaard een verslag — dit is geen opt-in meer, Sander hoeft er niet apart om te vragen. Zodra een toernooi is afgelopen (zichtbaar via `/seasons/[ID]/tournaments/results` of omdat Sander meldt dat een toernooi gespeeld is), start Larry dit workstream proactief.

Expliciete triggers (blijven ook werken, voor het geval Sander toch zelf vraagt):

- "Maak verslag [toernooinaam]"
- "Maak het verslag voor [locatie]"
- "Schrijf het Facebook-bericht voor het toernooi van [datum/locatie]"
- Of een andere variant die vraagt om een toernooi-bericht na afloop

**Proactieve detectie:** bij een dagstart of inboxensessie checkt Larry of er die dag een ADC-toernooi in Regio Oost gepland stond/heeft gespeeld (agenda + `/seasons/[ID]/tournaments/results`). Zo ja → verslag opstellen zonder dat Sander het vraagt, en aan Sander voorleggen zodra het concept klaar is (inclusief de vraag om een winnaarsfoto, zoals altijd).

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

Fetch: `https://www.dartsatlas.com/tournaments/[ID]/groups`

Haal op: groepsindeling, eindstanden, gemiddelden per speler. Hieruit volgt ook het aantal groepen (N).

### Stap 1.4 — Match-ID's per groep (compleet, geen sampling)

⚠️ **Vervangt de oude aanpak via spelerspagina's** — die liep risico op gemiste wedstrijden door de "max 3 per groep"-beperking (nodig vanwege rate limiting). Onderstaande aanpak is wél compleet, zonder dat risico.

Voor elke groep (1 t/m N): navigeer naar `https://www.dartsatlas.com/tournaments/[ID]/group/[N]`.

Deze pagina toont in een sidebar de **volledige wedstrijdenlijst van die groep** (bij 6 spelers: alle 15 wedstrijden, per ronde). Gebruik de `find`-tool (of lees de links in de pagina) om alle match-links op te halen, bijvoorbeeld:

> "all match result rows in the right sidebar list (Round 1, Round 2, etc.) - get their links/hrefs"

Dit levert per groep alle unieke match-ID's in één keer op — `href="/matches/[MATCH_ID]"` — zonder spelerspagina's te hoeven bezoeken en zonder rate-limiting-risico op gemiste wedstrijden.

**KO-wedstrijden (kwartfinale, halve finale, finale)** staan niet op de groep-pagina's — die haal je op via `https://www.dartsatlas.com/tournaments/[ID]/results` (zie stap 1.2).

**Let op rate limiting bij stap 1.5:** Dart Atlas begint lege responses te geven bij >8-10 requests in korte tijd. Haal wedstrijdpagina's sequentieel op als er problemen zijn — dat blijft relevant, ook met deze completere match-ID-verzameling.

### Stap 1.5 — Wedstrijdpagina's (checkouts)

⚠️ **Gebruik de parallelle fetch-methode hieronder — niet screenshots, niet één-voor-één navigeren.** Geverifieerd op een heel toernooi (32 wedstrijden): exact dezelfde uitkomst als screenshots, maar in **1 tool-call in plaats van 64-100**.

**Waarom dit werkt:** de browser-tab is al ingelogd op dartsatlas.com (zelfde sessie/cookies). Vanuit die pagina kan je met `fetch()` de HTML van alle andere wedstrijdpagina's tegelijk ophalen — zónder de tab te laten navigeren. Dat omzeilt de bot-blokkade die `WebFetch` (los van de browser) krijgt, en je hoeft niet te wachten op laden/scrollen per wedstrijd.

Zorg dat de tab al op een dartsatlas.com-pagina staat (bijv. na stap 1.1-1.4), en voer dan deze JavaScript uit via `javascript_exec` met **alle verzamelde match-ID's in één keer**:

```js
(async () => {
  function extractCheckouts(doc) {
    function ownText(el) {
      let t = '';
      for (const node of el.childNodes) if (node.nodeType === 3) t += node.textContent;
      return t.trim();
    }
    const legHeaders = [...doc.querySelectorAll('h2, h3, h4, h5')].filter(h => /^Leg \d+$/.test(h.textContent.trim()));
    return legHeaders.map(h => {
      const div = h.nextElementSibling;
      const summary = [...div.children].find(c => c.className === 'leg-throws-summary');
      const uls = [...summary.children].filter(u => u.className.startsWith('player'));
      const players = uls.map(ul => ({cls: ul.className, throws: [...ul.children].map(li => ownText(li))}));
      const winnerUl = players.find(p => p.cls.includes(' won'));
      return winnerUl ? winnerUl.throws[winnerUl.throws.length - 1] : null;
    });
  }
  const ids = [/* alle match-ID's uit stap 1.2 + 1.4, als strings */];
  const results = await Promise.all(ids.map(async id => {
    const resp = await fetch('/matches/' + id);
    const html = await resp.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return {id, title: doc.title, checkouts: extractCheckouts(doc)};
  }));
  const highFinishes = [];
  results.forEach(r => r.checkouts.forEach(c => { if (c && parseInt(c) >= 100) highFinishes.push({match: r.title, checkout: c}); }));
  return JSON.stringify({matchCount: results.length, highFinishes, allResults: results});
})();
```

**Hoe de checkout-extractie werkt:** elke `<li>` binnen `.leg-throws-summary` heeft een eigen tekstnode (vóór de decoratieve `<span>`'s voor dart-count/resterende score/missed-doubles) met de daadwerkelijk gegooide score die beurt. De laatste `<li>` in de UL van de winnende speler (class bevat `" won"`) is de checkout.

**Resultaat:** `highFinishes` geeft direct alle checkouts ≥100 met wedstrijdnaam. `allResults` geeft per wedstrijd de volledige checkout-lijst (één waarde per leg) voor wie alles wil nalopen. Classificeer zoals voorheen:
- Checkout ≥ 100 → hoge finish
- Checkout ≥ 140 → apart markeren als bijzonder hoge finish
- Checkout = 170 of hoger → maximale finish, extra vermeldenswaardig

**Spelersnaam bij checkout:** `doc.title` geeft "Speler1 vs Speler2" (linker vs rechter in de oorspronkelijke matchup). Als je moet weten wélke van de twee de checkout gooide, voeg `winnerCls` toe aan de extractie (begint met `player1`/`player2`) en koppel dat aan de volgorde in de title.

**Rate limiting:** bij zeer grote toernooien (40+ wedstrijden) kan een enkele `Promise.all` met alle fetches tegelijk nog steeds tegen rate limits aanlopen. Splits dan in batches van ~20 met een korte pauze tussen batches, of val terug op sequentieel fetchen binnen dezelfde `(async () => {...})()`-structuur.

**Fallback:** als de fetch-methode onverwacht leeg/foutief teruggeeft (bijv. door een wijziging in de site-structuur), val terug op losse navigatie + dezelfde extractielogica per wedstrijd (zie git-historie van dit bestand voor de vorige stap-voor-stap versie), of als laatste redmiddel op screenshots.

### Stap 1.6 — 180's per speler

Het 180-aantal staat niet in de groep-sidebar (stap 1.4) — dat geeft alleen wedstrijduitslagen, geen losse statistieken. Hiervoor blijven spelerspagina's nodig:

URL-formaat: `https://www.dartsatlas.com/tournaments/[ID]/player_stats/[SPELER_ID]`

Alle speler-ID's volgen uit de groepenpagina (stap 1.3) — dus in tegenstelling tot vroeger hoeft deze fetch niet meer gecombineerd te worden met match-ID-verzameling (die loopt nu via stap 1.4). Dat betekent: deze 180-fetch kan los en compleet voor alle spelers gebeuren, zonder dat een gemiste fetch ook wedstrijden laat ontbreken.

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

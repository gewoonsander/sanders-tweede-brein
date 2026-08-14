---
sop_id: SOP-013
title: Inboxen verwerken
owner: Hermes
triggers:
  - "laten we de inboxen doornemen"
  - "ruim mijn downloads op"
  - "verwerk de team inbox"
  - "inbox opruimen"
status: active
tags:
  - inbox
  - mediahub
  - downloads
  - werkwijze
last_updated: 2026-06-28
---

# SOP-013 — Inboxen verwerken

## Doel

Bij elke inboxronde worden drie inboxen systematisch leeggemaakt. Niets blijft hangen. Elk bestand krijgt een definitieve bestemming.

De vier inboxen:
1. **Downloads** (`~/Downloads`) — bestanden via browser of WhatsApp
2. **Team Inbox** (`sanders-tweede-brein/Team Inbox/`) — drops voor het team
3. **Werkarchief** (`~/Documents/Werkarchief`) — actieve docs, tijdelijk
4. **Vault-root** (`sanders-tweede-brein/` zelf, los naast de vaste scaffold-bestanden) — bestanden die per ongeluk direct in de repo-root belanden in plaats van via Team Inbox. Toegevoegd 2026-08-14 na een concrete vondst (een lege `.md`, een lege `.canvas`, losse foto's/xlsx/een script). Herken dit aan: het bestand hoort niet bij de vaste scaffold-lijst (README/LICENSE/NOTICE/CHANGELOG*/CONTRIBUTING/ADAPTER-PROMPT/WAY-FORWARD/AGENTS.md/CLAUDE.md/VERSION/.scaffold-version/mypka.db/validation-script.sh) en niet bij een van de vaste topfolders (ADC/Deliverables/Expansions/PKM/Team/Team Inbox/Team Knowledge/scripts/github). Route zoals Team Inbox: zelfde beslisboom, zelfde bestemmingen.

---

## Stap 1 — Inventariseer alle drie inboxen

Doe dit parallel:

```bash
ls ~/Downloads
ls "sanders-tweede-brein/Team Inbox/"
ls ~/Documents/Werkarchief 2>/dev/null
```

Lijst elk bestand op met naam en datum. Rapporteer aan Sander wat er staat.

---

## Stap 2 — Beslisboom per bestand

Doorloop voor elk bestand:

### Vraag A: Wat voor type bestand is het?

| Type | Route |
|---|---|
| Foto, video, audio, PDF, design-bestand | → **Mediahub** op Lexar SSD |
| Tekst, notitie, idee, braindump | → **PKM** (Team Inbox → Penn) |
| Actief werkdocument (nog niet klaar) | → **Werkarchief** (tijdelijk) |
| Rommel / oud / dubbel | → **Verwijderen** (bevestiging vragen) |

### Vraag B (alleen bij Mediahub): Welke pet had Sander op?

```
DartsCoaching.nl  → 01_Dartscoaching
DartBuddies       → 02_Dartbuddies
ADC Regio Oost    → 03_ADC_Regio_Oost
Van Gewoon Sander → 04_Van_Gewoon_Sander
Gezinshuis        → 05_Gezinshuis_Gewoon_Thuis
Persoonlijk       → 06_Persoonlijk
Financieel        → 07_Financieel (zie hieronder, geen "pet" maar een aparte categorie)
Twijfel           → 99_Inbox_Nog_Uitzoeken
```

**07_Financieel is geen pet maar een dwarsdoorsnede-categorie** — facturen, bonnetjes, belastingaangiftes en digitale-archief-exports gaan hier ongeacht welke pet ze verder zouden raken, met eigen submappen:

```
Bonnetjes/aankoopbevestigingen           → 07_Financieel/01_Bonnetjes
Belastingaangiftes/-berichten            → 07_Financieel/02_Belastingen
Overig (facturenarchieven, onbekende zip-exports met facturen/bonnetjes) → 07_Financieel/03_Overige_Financiele_Documenten
Onduidelijk of het financieel is         → 07_Financieel/99_Inbox_Nog_Uitzoeken
```

Vastgesteld 2026-08-14 — deze categorie bestond al op de Mediahub maar stond nog niet in deze SOP. De onbewaakte wekelijkse run ([[SOP-013-inboxen-verwerken]] → automatische laag) laat financiële/gevoelige inhoud bewust in de wachtrij staan, ook al is er nu een duidelijke bestemming — dat blijft zo, financiële documenten verdienen een interactieve blik voor ze verplaatst worden.

### Vraag C (alleen bij Mediahub): Project of asset?

```
Hoort bij één klus?         → 01_Actieve_Projecten / YYYY-MM-DD_CODE_Naam
Vaker hergebruiken?         → 07_Beeldbank / 05_Templates / 03_Video_Assets
Klaar voor publicatie?      → 06_Exports
Nog onduidelijk?            → 99_Inbox_Nog_Uitzoeken
```

---

## Stap 3 — Bestandsnaam controleren / aanpassen

Gebruik het Mediahub naamformat:

```
YYYY-MM-DD_CODE_omschrijving_v01.ext
```

Codes: `DC` · `DB` · `ADC` · `VGS` · `GGT` · `PRV`

Voorbeelden:
- `2026-06-23_DC_joppe-coaching-foto_v01.jpeg`
- `2026-06-27_ADC_benelux-trophy-poster_v01.png`

---

## Stap 4 — Verplaatsen

Verplaats elk bestand naar de definitieve bestemming op de Lexar:

```
/Volumes/Lexar SSD/Sander Mediahub/[rol]/[submap]/[bestandsnaam]
```

Gebruik `mv` via Bash. Nooit kopiëren zonder het origineel daarna te verwijderen.

---

## Stap 5 — PKM-items routen via Penn

Als er tekst of notities in de Team Inbox staan: route naar **Penn** (journal writer) met de instructie wat het is en waar het naartoe moet.

---

## Stap 6 — Bevestig dat inboxen leeg zijn

```bash
ls ~/Downloads | grep -v ".DS_Store"
ls "sanders-tweede-brein/Team Inbox/" | grep -v ".DS_Store" | grep -v "README.md" | grep -v "Audio Captures"
```

Rapporteer: "Downloads leeg ✓ / Team Inbox leeg ✓"

---

## Wanneer uitvoeren

- **Automatisch, wekelijks (vrijdagochtend, 08:00)** — sinds 2026-08-14 draait `scripts/inbox-verwerken.mjs` via de `nl.gewoonsander.inbox-verwerken` LaunchAgent onbewaakt. Deze automatische run is **strenger** dan de interactieve procedure hierboven: hij verplaatst alleen ondubbelzinnige, niet-gevoelige media automatisch; alles met twijfel, financiële/gevoelige inhoud, mogelijke duplicaten of tekst-voor-Penn gaat in een wachtrij (`Team Inbox/_wekelijkse-inboxronde-laatste-run.md`) die `/dagstart` stap 4 meldt. Nooit automatisch verwijderen, ook geen evidente duplicaten. Zie `scripts/inbox-verwerken.prompt.md` voor de exacte grens.
- **Op verzoek** — zodra Sander "inboxen doornemen" of vergelijkbare trigger zegt. Dit is de volledige, interactieve procedure hierboven — inclusief de gevallen die de automatische run bewust liet liggen.
- **Proactief** — als Hermes bij een andere taak bestanden in Downloads of Team Inbox signaleert

---

## Gerelateerd

- [[werkwijze-inboxen]] — de werkwijze beschrijving vanuit Sander's perspectief
- [[00_README_Sander_Mediahub]] — volledige Mediahub structuur en beslisboom
- [[SOP-011-adc-toernooi-analyse]] — voor ADC-gerelateerde mediabestanden

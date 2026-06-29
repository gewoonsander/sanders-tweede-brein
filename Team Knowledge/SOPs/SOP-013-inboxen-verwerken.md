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

De drie inboxen:
1. **Downloads** (`~/Downloads`) — bestanden via browser of WhatsApp
2. **Team Inbox** (`sanders-tweede-brein/Team Inbox/`) — drops voor het team
3. **Werkarchief** (`~/Documents/Werkarchief`) — actieve docs, tijdelijk

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
Twijfel           → 99_Inbox_Nog_Uitzoeken
```

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

- **Vrijdagochtend** — na het overleg met Marieke (vaste routine)
- **Op verzoek** — zodra Sander "inboxen doornemen" of vergelijkbare trigger zegt
- **Proactief** — als Hermes bij een andere taak bestanden in Downloads of Team Inbox signaleert

---

## Gerelateerd

- [[werkwijze-inboxen]] — de werkwijze beschrijving vanuit Sander's perspectief
- [[00_README_Sander_Mediahub]] — volledige Mediahub structuur en beslisboom
- [[SOP-011-adc-toernooi-analyse]] — voor ADC-gerelateerde mediabestanden

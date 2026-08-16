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
last_updated: 2026-08-16
---

# SOP-013 — Inboxen verwerken

## Doel

Bij iedere inboxronde wordt de **ene menselijke inbox**, `Team Inbox/`, verwerkt.
Technische bronnen worden meegenomen zodat Sander ze niet als extra inbox hoeft
te controleren. Ieder object krijgt een canonieke bestemming of blijft met een
duidelijke reden in Team Inbox voor beoordeling. De algemene route en lifecycle
staan in [[GL-020-informatie-invoer-uitvoer-en-levenscyclusregister]].

De locaties in deze ronde hebben verschillende rollen:

1. **Team Inbox** (`sanders-tweede-brein/Team Inbox/`, inclusief
   `Screenshots/` en `Documents/`) — de enige menselijke reviewqueue.
2. **Downloads** (`~/Downloads`) — technische aanvoerbron.
3. **Werkarchief** (`~/Documents/Werkarchief`) — tijdelijke werkruimte, geen
   inbox die Sander periodiek hoeft te beoordelen.
4. **Vault-root** (`sanders-tweede-brein/` zelf, los naast de vaste
   scaffold-bestanden) — foutlocatie die tijdens de ronde op losse bestanden
   wordt gecontroleerd. Herken dit aan: het bestand hoort niet bij de vaste
   scaffold-lijst of een vaste topfolder.

---

## Stap 1 — Inventariseer Team Inbox en technische bronnen

Doe dit parallel:

```bash
ls ~/Downloads
find "sanders-tweede-brein/Team Inbox/" -maxdepth 2 -type f
ls ~/Documents/Werkarchief 2>/dev/null
```

Controleer daarnaast de vault-root op losse bestanden. Lijst elk gevonden item
op met naam, datum en bronrol. Rapporteer één overzicht aan Sander; presenteer de
technische bronnen niet als extra inboxen.

---

## Stap 2 — Beslisboom per bestand

Doorloop voor elk bestand:

### Vraag A: Welk informatietype uit GL-020 is dit?

Classificeer eerst volgens
[[GL-020-informatie-invoer-uitvoer-en-levenscyclusregister]]. Onderstaande tabel
is de uitvoeringsvertaling voor deze SOP, niet een tweede opslagregister.

| Type | Route |
|---|---|
| Creatieve foto, video, audio of design-bestand | → **Mediahub** op Lexar SSD |
| Persoonlijke foto/videoherinnering | → **Apple Foto's** volgens de video-uitzondering |
| Document | → **Google Drive-documentstructuur**; gevoelige/financiële items interactief beoordelen |
| Tekst, notitie, idee, braindump | → **PKM** (Team Inbox → Penn) |
| Actief werkdocument (nog niet klaar) | → **Werkarchief** (tijdelijk) |
| Rommel / oud / dubbel | → **Verwijderen** (bevestiging vragen) |

### Video-uitzondering: Mediahub of Apple Foto's?

Niet iedere persoonlijke video hoort automatisch in iCloud Foto's. Routeer op functie:

- **Content, bronmateriaal, opname, montagebestand of herbruikbare clip** → Mediahub, ook wanneer Sander zelf of zijn huis erop staat. Kies daarna de passende pet en submap volgens vraag B en C.
- **Persoonlijke herinnering die in de Apple Foto's-tijdlijn thuishoort** → Apple Foto's via iCloud Foto's. Voorbeelden: gezinsmomenten, vakanties, verjaardagen en oude familiefilms.
- **Eindproduct van professioneel videowerk** → `06_Exports` op de Mediahub; een eventuele Google Workspace-kopie is alleen een aanvullende cloudback-up van de export, niet de canonieke thuisbasis van raw footage of projectbestanden.

Beslis dus op het beoogde gebruik, niet alleen op het label `Persoonlijk`.

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

## Stap 4 — Veilig overdragen

Voor Mediahub-items is de definitieve bestemming:

```
/Volumes/Lexar SSD/Sander Mediahub/[rol]/[submap]/[bestandsnaam]
```

Volg voor overdracht tussen volumes, apparaten of clouddiensten altijd de
invariant uit GL-020:

1. bevestig bron en canonieke bestemming;
2. controleer dat de bestemmingsdienst of het doelvolume beschikbaar is;
3. kopieer het bestand;
4. verifieer minimaal bestaan en bestandsgrootte; gebruik bij grote, gevoelige
   of belangrijke bestanden ook een checksum of itemtelling;
5. verwijder pas daarna gericht het bronbestand wanneer de bestemming klopt;
6. bij iedere onzekerheid: niet verwijderen, maar in Team Inbox zetten of laten
   staan met reden `manual-review`.

Een atomaire `mv` is alleen toegestaan wanneer bron en bestemming aantoonbaar
op hetzelfde bestandssysteem liggen. Dit is nooit een reden om de
bestemmingscontrole over te slaan.

De Mediahub is op de Mac mini live beschikbaar op dit pad. Vanaf Sanders andere Mac kan de structuur via de bestaande Tailscale/SSH-verbinding en hostalias `macmini` worden gecontroleerd. Grote video-overdrachten via de tunnel kunnen traag zijn; bij meerdere gigabytes heeft lokaal aansluiten van de Lexar SSD de voorkeur. Zie [[SOP-016-remote-toegang-mac-mini-op-vakantie]].

---

## Stap 5 — PKM-items routen via Penn

Als er tekst of notities in de Team Inbox staan: route naar **Penn** (journal writer) met de instructie wat het is en waar het naartoe moet.

---

## Stap 6 — Bevestig dat de menselijke inbox is afgehandeld

```bash
ls ~/Downloads | grep -v ".DS_Store"
ls "sanders-tweede-brein/Team Inbox/" | grep -v ".DS_Store" | grep -v "README.md" | grep -v "Audio Captures"
```

Rapporteer welke items canoniek zijn gerouteerd en geverifieerd, welke
technische bronnen geen open invoer meer bevatten en welke items in Team Inbox
op Sander wachten, inclusief reden. Team Inbox hoeft niet kunstmatig leeg te
zijn: een verklaard `manual-review`-item is correct wachtend werk.

---

## Wanneer uitvoeren

- **Automatisch, wekelijks (vrijdagochtend, 08:00)** — sinds 2026-08-14 draait `scripts/inbox-verwerken.mjs` via de `nl.gewoonsander.inbox-verwerken` LaunchAgent onbewaakt. Deze automatische run is **strenger** dan de interactieve procedure hierboven: hij verwerkt alleen ondubbelzinnige, niet-gevoelige media met een bekende canonieke bestemming en geslaagde verificatie; alles met twijfel, financiële/gevoelige inhoud, mogelijke duplicaten of tekst-voor-Penn blijft in Team Inbox en wordt vermeld in `Team Inbox/_wekelijkse-inboxronde-laatste-run.md`, die `/dagstart` stap 4 meldt. Nooit automatisch als rommel of duplicaat verwijderen. Alleen na een geslaagde overdracht mag het geverifieerde bronexemplaar volgens Stap 4 worden opgeruimd. Zie `scripts/inbox-verwerken.prompt.md` voor de exacte grens.
- **Op verzoek** — zodra Sander "inboxen doornemen" of vergelijkbare trigger zegt. Dit is de volledige, interactieve procedure hierboven — inclusief de gevallen die de automatische run bewust liet liggen.
- **Proactief** — als Hermes bij een andere taak bestanden in Downloads of Team Inbox signaleert

---

## Gerelateerd

- [[werkwijze-inboxen]] — de werkwijze beschrijving vanuit Sander's perspectief
- [[00_README_Sander_Mediahub]] — volledige Mediahub structuur en beslisboom
- [[SOP-011-adc-toernooi-analyse]] — voor ADC-gerelateerde mediabestanden

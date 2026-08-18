---
id: SOP-024
title: Video monteren in DaVinci Resolve via de MCP-koppeling
owner: stephan-speelberg
status: active
triggers:
  - een regieplan is klaar en het beeldmateriaal staat op de machine
  - "monteer deze video"
  - "zet dit in Resolve"
  - "bouw de timeline"
  - een bestaande Resolve-montage moet aangepast, geretimed of opnieuw geëxporteerd worden
reusable_by: any-agent
---

# SOP-024 — Video monteren in DaVinci Resolve via de MCP-koppeling

## Doel

Een regieplan omzetten in een echte Resolve-timeline zonder dat Sander elke handeling zelf in de interface doet. Het operationele contract van de koppeling staat in [[GL-017-mcp-service-register]] onder `davinci-resolve`; deze SOP beschrijft alleen de uitvoering.

## Voorwaarden

- **Resolve draait al.** De server praat met een lopende instantie; hij start Resolve niet zelf. Staat Resolve uit, dan faalt elke tool met een verbindingsfout — dat is geen defect.
- **Studio-editie.** Externe scripting is sinds Resolve 19.1 Studio-only. Sander heeft Studio 20.3.2.9 (geverifieerd 2026-08-17).
- **Het regieplan is de bron.** Framegetallen, shotduren en teksten komen daaruit, niet uit eigen inschatting. Wijkt de montage af, dan verandert eerst het plan.

## Procedure

### 1. Verbinding en editie controleren

Roep `resolve_control` read-only aan. `GetProductName()` hoort `DaVinci Resolve Studio` terug te geven. Krijg je `DaVinci Resolve` zonder "Studio", stop dan — dan draait er een gratis installatie en werkt de rest van deze SOP niet.

### 2. Projectinstellingen vóór de eerste import

**Dit is de stap die een project onherstelbaar maakt als je hem overslaat.** De timeline-framerate is niet meer te wijzigen zodra er media in een timeline staat. Zet daarom eerst, via `project_settings`:

- Timeline-resolutie (voor social video verticaal: 1080x1920)
- Timeline-framerate en playback-framerate
- Mismatched resolution op *Scale entire image to fit*

Bevestig de gezette waarden door ze terug te lezen voordat je verder gaat.

### 3. Media importeren en ordenen

`media_storage` om te bladeren, `media_pool` om te importeren. Maak bins per shotnummer. Bij telefoonmateriaal met namen als `IMG_1234` is dat het verschil tussen een half uur en een hele avond.

Controleer bij de eerste clip of de rotatie klopt: telefoons zetten de draaiing in de metadata en Resolve leest die meestal, maar niet altijd, goed.

### 4. Timeline bouwen op de getallen uit het plan

`timeline` en `timeline_item` voor de opbouw. Typ de framegetallen uit het regieplan; trim niet op het oog. Retimen (`Change Clip Speed`, speed ramps) en freeze frames horen bij deze stap, niet bij de kleurbewerking.

### 5. Controleren met eigen ogen

`timeline_frame` levert een frame uit de timeline als afbeelding. Gebruik dit na elke inhoudelijke stap — het is het enige middel om te zien of er staat wat je denkt dat er staat, in plaats van te vertrouwen op wat de API terugmeldt.

Controleer minimaal: het eerste frame van elke shot, elk frame waar tekst in beeld komt, en het slotbeeld.

### 6. Fusion, kleur en geluid

`fusion_comp` voor tekst- en grafiekwerk, `timeline_item_color` voor grading. Bouw een terugkerend element één keer en sla het op als macro; daarna alleen tekst en positie wisselen.

### 7. Renderen

`render` voor presets, jobs en de queue. Controleer vóór het starten:

- Data Burn-In staat uit (anders brandt de timecode in het eindbestand)
- Hulplagen zoals een veilige-zone-overlay staan op onzichtbaar
- De bestandsnaam volgt [[GL-001-file-naming-conventions]]

Lange renders kunnen headless: Resolve draait met `-nogui` door terwijl de interface dicht is.

## Wat bevestigingsplichtig blijft

Montage-, kleur- en renderacties binnen een gevraagde opdracht mogen zonder tussentijds vragen — dat volgt de lijn van [[CLAUDE.md]] over bestandsacties binnen een goedgekeurde procedure. Deze drie niet:

1. **Verwijderen** van clips, timelines of projecten.
2. **Overschrijven van bronmateriaal.** Opnamen van een dag die niet over te doen is (een uitpakshot, een toernooi) zijn onvervangbaar.
3. **Installeren van plugins** via `script_plugin`, `dctl` of `fuse_plugin`. Die schrijven bestanden buiten het project, in Resolve zelf.

## Valkuilen

- **De server ziet geen beeld tenzij je erom vraagt.** Zonder `timeline_frame` werk je blind; de API bevestigt dat een handeling is uitgevoerd, niet dat het resultaat klopt.
- **Optimized media op een MacBook Air.** Bij 4K-telefoonmateriaal is `Generate Optimized Media` het verschil tussen werken en wachten.
- **Compound-modus, niet granulair.** 35 tools volstaan. De 353-tool-modus vult het contextvenster zonder dat er iets bij komt dat je nodig hebt.

## Referenties

- [[GL-017-mcp-service-register]] — het operationele contract van `davinci-resolve`
- [[GL-018-integratie-en-software-register]] — lifecycle van de koppeling en de software
- [[GL-001-file-naming-conventions]] — bestandsnamen van exports
- [[2026-08-17-campingdarts-regieplan]] — eerste toepassing; bevat een volledig uitgewerkte Resolve-werkorder

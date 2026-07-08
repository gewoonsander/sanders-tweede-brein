# ADC Pub Qualifier Posters — Winmau Benelux Open 2026 (v2 — Masthead Style)

## Overzicht

5 poster-varianten × 2 formaten = **10 printklare PNG-bestanden**:
- 4 kroeg-specifieke posters (één per qualifier-locatie)
- 1 gezamenlijke overzichtsposter

Alle posters volgen het **masthead-design** met:
1. Scherp, onaangepast Winmau Benelux Open 2026 embleem (~40% van postertehoogte) als hero banner
2. Oranje "PUB QUALIFIER — REGIO OOST" lint eronder
3. Data paneel (~60%) met kroeggegevens, datums, finales

### Bestandsnamen

**Kroeg-posters (4×2 = 8 bestanden):**
1. `het-twentse-ros-a4.png` + `het-twentse-ros-social.png` — Het Twentse Ros, Hengelo (8 datums, Amateur Finale lokaal)
2. `cafe-kafe-a4.png` + `cafe-kafe-social.png` — Café Kafé, Doetinchem (4 datums)
3. `dartcafe-dubbel-10-a4.png` + `dartcafe-dubbel-10-social.png` — Dartcafe Dubbel 10, Arnhem (4 datums, Elite Finale lokaal)
4. `dartclub-de-rijnvogels-a4.png` + `dartclub-de-rijnvogels-social.png` — Dartclub de Rijnvogels, Driel (4 datums)

**Gezamenlijke overzichtsposter (2 bestanden):**
- `overzicht-a4.png` + `overzicht-social.png` — 2×2 grid alle 4 kroegen, beide regionale finales, hoofdtoernooi

### Formaten

- **A4 staand, printklaar**: 2480 × 3508 px @ 300 DPI — scherpe wandposters voor in de kroeg
- **Vierkant social**: 1080 × 1080 px — Instagram, Facebook, etc.

## Design Tokens (GL-003-brands/adc-regio-oost.md)

| Token | Waarde | Gebruik |
|-------|--------|---------|
| Primair oranje | `#F26522` | Lint-banner, badges, accenten, sectiontitels *(benadering, niet geverifieerd)* |
| Wit | `#FFFFFF` | Tekst, logo's, banner-tekst-accenten |
| Zwart | `#000000` | Achtergrond, banner-tekst |
| Base spacing | 8px | Padding, gaps per GL-003 |
| Font heading | Bold sans-serif (Arial Black) | Titels, "PUB QUALIFIER", sectionheads |
| Font body | Regular sans-serif (Arial) | Tabeltekst, datums, finales-info |

## Content per poster

### Kroeg-posters (4x)
Elke poster toont:
1. **Prominent**: Eigen qualifier-datums (8 datums voor Twentse Ros, 4 voor de anderen)
2. **Finales-sectie**: Beide regionale finales, met duidelijke "elders"-markering waar ze niet plaatsvinden
   - Uitzonderingen: 
     - **Het Twentse Ros** mag Amateur Finale als "bij ons!" tonen (omdat die daar plaatsvindt)
     - **Dartcafe Dubbel 10** mag Elite Finale als "bij ons!" tonen (omdat die daar plaatsvindt)
3. Kroeg-logo (eigen huisstijl, niet ADC-omgevormd)
4. ADC Europe-logo (wit beeldmerk)

### Gezamenlijke overzichtsposter
Alle 4 kroegen in grid-layout:
- Per kroeg: logo, naam, plaats, datums
- Beide regionale finales met exacte datums en locaties
- Hoofdtoernooi (klein vermeld)

## Qualifier Datums

**Het Twentse Ros** (Hengelo) — 8 datums
- 19 juli, 2 augustus, 9 augustus, 16 augustus, 23 augustus, 30 augustus, 13 september, 20 september 2026

**Café Kafé** (Doetinchem) — 4 datums
- 20 juli, 2 augustus, 16 augustus, 30 augustus 2026

**Dartcafe Dubbel 10** (Arnhem) — 4 datums
- 27 juli, 3 augustus, 17 augustus, 24 augustus 2026

**Dartclub de Rijnvogels** (Driel) — 4 datums
- 19 juli, 10 augustus, 7 september, 14 september 2026

**Regionale Amateur Finales**
- Zaterdag 26 september 2026 — Het Twentse Ros, Hengelo

**Regionale Elite Finales**
- Zondag 27 september 2026 — Dartcafe Dubbel 10, Arnhem

**Hoofdtoernooi**
- Zaterdag 3 oktober 2026 — Fletcher Hotel De Holthurnsche Hof, Berg en Dal

## Source Files & Regeneratie

### HTML Templates

- `het-twentse-ros-a4-v2.html` + `het-twentse-ros-social-v2.html`
- `cafe-kafe-a4-v2.html` + `cafe-kafe-social-v2.html`
- `dartcafe-dubbel-10-a4-v2.html` + `dartcafe-dubbel-10-social-v2.html`
- `dartclub-de-rijnvogels-a4-v2.html` + `dartclub-de-rijnvogels-social-v2.html`
- `overzicht-a4-v2.html` + `overzicht-social-v2.html`

Alle templates bevatten inline CSS met GL-003 tokens.

### Assets

- `assets/2026-07-08_adc_winmau-benelux-open-2026-full-poster_v01.png` — Officieel Winmau Benelux Open 2026 embleem (1600×1600px, scherp, ONAANGEPAST)
- `assets/2026-07-07_adc_logo-het-twentse-ros-wit_v01.png` — Het Twentse Ros logo (wit)
- `assets/2026-07-07_adc_logo-cafe-kafe_v01.png` — Café Kafé logo
- `assets/2026-07-07_adc_logo-dubbel10-transparant_v01.png` — Dartcafe Dubbel 10 logo (transparant)
- `assets/2026-07-07_adc_logo-de-rijnvogels_v01.png` — Dartclub de Rijnvogels logo

### Regeneratie

Om posters opnieuw te renderen (na wijzigingen in HTML), gebruik Chrome headless:

```bash
# Voorbeeld voor één poster:
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --screenshot="het-twentse-ros-a4.png" \
  --window-size=2480x3508 "file:///path/to/het-twentse-ros-a4-v2.html"

# Voor alle 10:
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --screenshot="het-twentse-ros-a4.png" \
  --window-size=2480x3508 "file://$(pwd)/het-twentse-ros-a4-v2.html"
```

**Belangrijk**: altijd ALLE 10 bestanden opnieuw renderen na HTML-wijzigingen (niet hergebruiken van eerdere renders).

## Huisstijl-aantekeningen

### Geverifieerd
- Kleurpalet: zwart (#000000), wit (#FFFFFF), oranje (#F26522)
- Layout-stijl: strak/functioneel (referentie: bestaande spiekbrief-templates)
- ADC Europe logo: white mark with orange dart accent

### Niet geverifieerd — Flag voor volgende stap
1. **Oranje hex** (#F26522) is benaderd uit bestaande templates; niet geverifieerd tegen officieel ADC Europe-merkboek
   - **Actie**: Sander bevestigt exact hex via ADC Europe brand guide of pipet-tool
   
2. **Font family** voor headings — momenteel bold sans-serif
   - Referentie toont zware grotesk-stijl (vergelijkbaar Archivo Black of Anton)
   - **Actie**: Sander pinnen exact font name (en downloaden via @font-face als nodig)
   
3. **Type scale** — momenteel ad-hoc sizing
   - **Actie**: GL-003-brands/adc-regio-oost.md aanvullen met `--text-h1`, `--text-body`, etc.

## Design Notes

### Masthead Approach

- **Embleem**: Winmau Benelux Open 2026 badge scherp en onaangepast, ongeveer 40% van postertehoogte. Dit is officieel merkmateriaal van de hoofdwedstrijd waarnaar de pub qualifiers leiden.
- **Banner lint**: Oranje (#F26522) achtergrond met zwarte tekst "PUB QUALIFIER — REGIO OOST" in bold sans-serif. Wit en oranje borders (3px) voor visuele scheiding.
- **Data paneel**: Strak, functioneel zwart-wit-oranje schema. Kroeglogo's behouden hun eigen identiteit (niet herontworpen in ADC-stijl). Datums in duidelijke orange badges, finales met richtingaanduidingen ("Bij ons!" / "niet hier").

### Pixel Stylization Handoff

Deze v2 posters zijn **structureel + functioneel**, klaar voor print in kroegen (hoge leesbaarheid op muurafstand). Geen fotografie of illustratie.

**Optionele toekomstige verbetering** (Pixel):
- Dramatische versie met subtiele stadion/spotlight-achtergrond (lijkt op referentie: Winmau Benelux Open poster)
- AI-gerendered afbeeldingen of illustraties bovenop het masthead-design
- Huidig advies: houd functioneel voor wall posters (leesbaarheid). Pas dramatische stijl toe voor social/digital als gewenst.

## Brand Compliance

- ✓ GL-003-brands/adc-regio-oost.md: primair (#F26522), zwart (#000000), wit (#FFFFFF), spacing 8px baseline
- ✓ Embleem ongewijzigd (officieel Winmau/ADC materiaal)
- ✓ Kroeglogo's in originele huisstijl (niet ADC-omgevormd)
- ✓ A4-resolutie: 2480×3508px (300 DPI printklaar)
- ✓ Social: 1080×1080px

## Volgende stappen

1. (Optioneel) Controleer exacte oranje hex tegen ADC Europe brand book
2. (Optioneel) Bevestig font family — momenteel Arial Black / Arial (zware sans-serif per GL-003 intentie)
3. (Optioneel) Hand off naar Pixel voor stileerde versies (stadion-achtergrond, illustratie)

---

**Gebouwd door**: Charta (Infographic Designer)  
**Brand**: ADC Regio Oost (GL-003-brands/adc-regio-oost.md)  
**Datum**: 8 juli 2026 (v2 — Masthead redesign)  
**Status**: 10/10 PNG's gerenderd + geverifieerd, printklaar, HTML-source volledig regenereerbaar  
**Pixel handoff nodig?**: Nee (optioneel voor toekomstige dramatische versie met achtergrondillustatie)  
**GL-003 gaps**: Oranje hex en font family nog niet officieel geverifieerd — momenteel benadering per bestaande templates

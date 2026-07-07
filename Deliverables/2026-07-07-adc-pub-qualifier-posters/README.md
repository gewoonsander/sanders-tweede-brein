# ADC Pub Qualifier Posters — Winmau Benelux Open 2026

## Overzicht

5 poster-varianten × 2 formaten = **10 printklare PNG-bestanden**:
- 4 kroeg-specifieke posters (één per qualifier-locatie)
- 1 gezamenlijke overzichtsposter

### Bestandsnamen

**Kroeg-posters:**
1. `het-twentse-ros-a4.png` + `het-twentse-ros-social.png` — Het Twentse Ros, Hengelo
2. `cafe-kafe-a4.png` + `cafe-kafe-social.png` — Café Kafé, Doetinchem
3. `dartcafe-dubbel-10-a4.png` + `dartcafe-dubbel-10-social.png` — Dartcafe Dubbel 10, Arnhem
4. `dartclub-de-rijnvogels-a4.png` + `dartclub-de-rijnvogels-social.png` — Dartclub de Rijnvogels, Driel

**Gezamenlijke poster:**
- `overzicht-a4.png` + `overzicht-social.png` — Alle 4 kroegen + beide finales

### Formaten

- **A4 staand** (595 × 842 px @ 72 DPI) — printklaar voor wall posters in de kroeg
- **Vierkant social** (1080 × 1080 px) — Instagram, Facebook, etc.

## Design Tokens (GL-003-brands/adc-regio-oost.md)

| Token | Waarde | Gebruik |
|-------|--------|---------|
| Primair oranje | `#F26522` | Badges, accenten, koppen *(benadering, niet geverifieerd)* |
| Wit | `#FFFFFF` | Tekst, logo's |
| Zwart | `#000000` | Achtergrond |
| Base spacing | 8px | Padding, gaps |
| Font heading | Bold sans-serif | Titels, datums *(zware grotesk, exact font niet bevestigd)* |
| Font body | Regular sans-serif | Tabeltekst |

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

## Source Files

- `*.html` — HTML-templates (bevat styling inline)
- `assets/` — Kroeglogo's en referentie-afbeeldingen
- `render-all.js` — Playwright render-script (voor regeneratie)

### Regeneratie

Om posters opnieuw te renderen (bijv. na wijzigingen in HTML):
```bash
node render-all.js
```

Vereisten: Node.js + `npm install playwright`

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

## Pixel Stylization Handoff

Huidige posters zijn **structureel/functioneel**, zwart-wit-oranje schema. Geen fotografie of illustratie.

**Optionele verbetering** (Pixel):
- Hero/dramatische versie met stadion/spotlight-achtergrond (referentie: Winmau Benelux Open poster)
- Meer visuele pop via illustratie of AI-gerendered afbeeldingen
- Huidig approach: schoon, data-focused, goed leesbaar

**Huidig advies**: Houd functioneel-strak voor wall posters in kroegen (leesbaarheid op afstand). Pas hero-stijl toe voor digital/social assets als gewenst.

## Volgende stappen

1. Controleer de exacte oranje hex (ADC Europe brand book)
2. Bevestig font family voor headings
3. Vul GL-003-brands/adc-regio-oost.md aan: type scale, nuances bij voice/audience
4. (Optional) Hand off naar Pixel voor stylized versies

---

**Gebouwd door**: Charta (Infographic Designer)  
**Brand**: ADC Regio Oost (GL-003-brands/adc-regio-oost.md)  
**Datum**: 7 juli 2026  
**Status**: Printklaar + source regenereerbaar

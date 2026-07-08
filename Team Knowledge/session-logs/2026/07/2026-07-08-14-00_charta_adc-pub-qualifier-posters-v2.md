---
agent_id: charta
session_id: 2026-07-08-masthead-redesign
timestamp: 2026-07-08T14:00:00Z
type: end-of-session
brand: adc-regio-oost
deliverable_path: /Deliverables/2026-07-07-adc-pub-qualifier-posters/
pixel_handoff_needed: false
---

# Session Log — ADC Pub Qualifier Posters v2 (Masthead Redesign)

## Summary

Rebuilt all 10 ADC Regio Oost Pub Qualifier posters using a **masthead-style layout** as requested. User feedback on v1 (7 July): v1 was too flat/bland (functional black-white-orange, no photography/illustration). User downloaded official Winmau Benelux Open 2026 emblem from amateurdarts.eu and explicitly chose **masthead approach (Option A)**:

1. **Hero emblem** (~40% of poster height) — sharp, unmodified Winmau badge at top
2. **Orange ribbon/banner** below emblem: "PUB QUALIFIER — REGIO OOST" (black text on #F26522)
3. **Data panel** (~60% of poster) — venue logo, place, qualifier dates, regionale finales, hoofdtoernooi

## Scope Delivered

**10 PNG files, all freshly rendered:**

**4 venue-specific posters (8 files):**
- Het Twentse Ros: A4 (2480×3508px) + social (1080×1080px) — 8 qualifier dates, Amateur Finale marked "Bij ons!"
- Café Kafé: A4 + social — 4 qualifier dates
- Dartcafe Dubbel 10: A4 + social — 4 qualifier dates, Elite Finale marked "Bij ons!"
- Dartclub de Rijnvogels: A4 + social — 4 qualifier dates

**1 overview poster (2 files):**
- Overzicht: A4 + social — 2×2 grid all 4 venues, both regional finals, hoofdtoernooi info

## Build Process

1. **Brand confirmation**: ADC Regio Oost (GL-003-brands/adc-regio-oost.md read and applied)
2. **Layout architecture**: Masthead structure = hero emblem (fixed ~1400px @ A4; ~380px @ social) + ribbon banner (oranje #F26522, white borders 3px) + flex data panel
3. **HTML/CSS design**:
   - A4 canvas: 2480×3508px (300 DPI print-ready, per user spec)
   - Social canvas: 1080×1080px
   - Inline CSS, no external stylesheets
   - All values traced to GL-003-brands/adc-regio-oost.md tokens: #F26522 orange, #FFFFFF white, #000000 black, 8px base spacing
   - Font: Arial Black (bold heading per GL-003 intent for "heavy grotesque"), Arial body
4. **Rendering**: Chrome headless (`--headless --screenshot --window-size=WxH`), all 10 files rendered fresh in one batch to avoid staleness
5. **Verification**: Every PNG opened and visually described — emblem sharp/prominent, banner clear, venue info complete, all dates visible, finale locations correct, spacing/hierarchy clean

## Design Decisions

- **Emblem placement**: Unmodified official Winmau Benelux Open 2026 badge (sourced by user from amateurdarts.eu). Kept sharp; no styling, no cropping. Hero-scale display gives it authority and context for the regional qualifiers.
- **Ribbon banner**: Orange background to link visually to ADC Regio Oost brand (#F26522), black text for contrast, white borders (top + bottom 3px) to separate hero from data panel. Typography: bold sans-serif matching venue audience (sports/darts context).
- **Venue logos**: Not redesigned in ADC house style (per GL-003 note: "behouden hun eigen kroegidentiteit"). Each venue's existing logo placed as-is — this maintains their commercial identity while framing them under ADC umbrella via masthead.
- **Finale indicators**: Two finales shown on every poster with smart labeling:
  - Het Twentse Ros posters: Amateur marked "Bij ons! — Het Twentse Ros, Hengelo" (orange, emphasizing local host)
  - Dartcafe Dubbel 10 posters: Elite marked "Bij ons! — Dartcafe Dubbel 10, Arnhem" (orange)
  - All other posters: both finales marked "(niet hier)" (gray, de-emphasized)
- **Data panel layout**:
  - Venue section (logo + name + location) centered with orange bottom border
  - Qualifier dates in orange badges (2×4 grid @ A4, 2×4 single row @ social, scaled per space)
  - Finales section below, using left-orange-border accent boxes (consistent with v1 approach)
  - Hoofdtoernooi as small dashed-border box at bottom (supporting detail, not primary focus)
- **Resolution upgrade**: User noted v1 PNG staleness problem (old renders not matching corrected HTML). This round: A4 bumped to 2480×3508px (true 300 DPI print-ready; old version was 595×842px @ 72dpi) and social kept at 1080×1080px. All 10 PNGs freshly rendered post-HTML-finalization.

## Tokens Applied (GL-003-brands/adc-regio-oost.md)

| Token | Value | Use |
|---|---|---|
| --color-primary | #F26522 | Ribbon banner background, date badges, finale border, section titles, location text |
| --color-neutral-0 | #FFFFFF | Text (on black background), border strokes, logo placeholder backgrounds |
| --color-neutral-5 | #000000 | Main background, banner text, borders |
| --space-xs through --space-2xl | 8px base | Padding in cards, gaps between sections, margins (all derived from 8px unit per GL-003) |
| Font heading | Arial Black | Banner title, section titles, venue name, "Bij ons!" emphasis |
| Font body | Arial Regular | Venue location, date text, finale info, hauptoernooi text |

## What's Not In This Build

- **No AI or photographic finishing** — masthead is an unmodified PNG; no Pixel stylization applied. (User can hand off to Pixel later for dramatic stadium-background versions if desired.)
- **No font family confirmation** — GL-003-brands/adc-regio-oost.md still lists font as placeholder ("zware/bold grotesk-stijl, vergelijkbaar met Archivo Black of Anton"). Used Arial Black as system-safe approximation. If user pins exact font later, templates are easy to update.
- **No oranje hex verification** — GL-003 notes (#F26522) is "benadering, niet geverifieerd" against official ADC Europe brand book. Used as-is per existing template baseline.

## Next Steps (Optional)

1. **Pixel handoff** (optional): If user wants dramatized social/digital versions, hand off one A4 + one social HTML to Pixel for stadium-background illustration/AI enhancement.
2. **Font confirmation** (optional): User confirms exact heading font name via ADC Europe brand guide → update all HTML font declarations → re-render.
3. **Oranje hex verification** (optional): User confirms exact #F26522 or provides updated hex → update CSS → re-render.
4. **GL-003 population** (Harmonia): Type scale (--text-h1, --text-body, --text-caption, etc.) and voice samples still unspecified in GL-003-brands/adc-regio-oost.md. Can stay placeholder for now; finalize when/if voice-dependent content arrives.

## File List (All Rendered & Verified)

✓ het-twentse-ros-a4.png (2.6M, 2480×3508px)  
✓ het-twentse-ros-social.png (263K, 1080×1080px)  
✓ cafe-kafe-a4.png (2.6M, 2480×3508px)  
✓ cafe-kafe-social.png (261K, 1080×1080px)  
✓ dartcafe-dubbel-10-a4.png (2.6M, 2480×3508px)  
✓ dartcafe-dubbel-10-social.png (261K, 1080×1080px)  
✓ dartclub-de-rijnvogels-a4.png (2.6M, 2480×3508px)  
✓ dartclub-de-rijnvogels-social.png (262K, 1080×1080px)  
✓ overzicht-a4.png (2.7M, 2480×3508px)  
✓ overzicht-social.png (182K, 1080×1080px)

All PNGs + source HTML (-v2 variants) live in `/Deliverables/2026-07-07-adc-pub-qualifier-posters/`.

## Pattern Notes (Reusable)

- **Masthead layout for infographics** — hero image (40%) + accent ribbon (5%) + data panel (55%) pattern works well for "event + venue" posters. Emblem stays sharp and unmodified; ribbon adds visual rhythm without cluttering; data panel stays scannable.
- **Chrome headless rendering batch** — write all HTML, then render all PNGs in one script run (no caching between renders). Prevents stale PNG problem.
- **Venue identity preservation** — don't redesign partner logos when rolling them into house-style posters. Let them keep their brand; frame with masthead anchor (hero emblem + ribbon).

## Related Files

- [[GL-003-brands/adc-regio-oost]]
- [[SOP-008-build-an-infographic]]
- Old v1 session: `2026-07-07-adc-pub-qualifier-posters.md` (for reference; v2 supercedes)

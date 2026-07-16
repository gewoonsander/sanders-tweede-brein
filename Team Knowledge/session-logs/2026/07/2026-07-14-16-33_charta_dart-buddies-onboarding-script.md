---
agent_id: charta
session_id: charta-dart-buddies-onboarding-pdf-20260714
timestamp: 2026-07-14T16:33:00Z
type: end-of-session
brand: dartbuddies
deliverable_path: /Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/Deliverables/2026-07-14-dart-buddies-onboarding-video-script.pdf
source_html: /Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/Deliverables/2026-07-14-dart-buddies-onboarding-video-script/index.html
pixel_handoff_needed: false
---

# Charta Session Log — Dart Buddies Onboarding Video Script

## What was built

A **branded, multi-page printable PDF script** (`2026-07-14-dart-buddies-onboarding-video-script.pdf`, 391 KB) designed for Sander to hold and read while filming the Dart Buddies onboarding video with OBS.

**Format:** A4 portrait, print-optimized (white backgrounds with color accents, no heavy dark full-bleed), 16 scenes across multiple pages plus a print-friendly checklist.

**Structure:**
1. **Cover page** — Dart Buddies branding, title "Dart Buddies Onboarding Video — Draaiboek", tagline
2. **Voorbereiding (prep) checklist** — 8 checkbox items, print-ready
3. **All 16 scenes** — clearly numbered and titled
   - Spoken text (the dialogue Sander reads aloud) rendered in a prominent, left-bordered blockquote style with green accent line
   - Actions (stage directions: clicks, navigation) rendered in secondary style with light accent, smaller font, distinct visual hierarchy
   - Scenario intros for both organic signup and post-purchase flows
   - Scene headers with clear numbering and titles for quick reference while filming

**Design principle:** Readability while holding paper and glancing between lines was the priority. Generous whitespace, clear scene numbering, and visual distinction between "what you say" (prominent) vs "what you click" (secondary).

## Brand tokens applied

**Inherited from parent (DartsCoaching.nl):**
- **Colors:** `#F22E3E` (red/primary), `#35BF0F` (green/secondary), `#7FD971` (light green/accent), `#000000` (black), `#FFFFFF` (white), `#F2F2F2` (light grey)
- **Typography:** Montserrat (headings: Bold, SemiBold), Open Sans (body: Regular, Light, SemiBold, Bold)
- **Spacing:** 8px base unit → `--space-xs` (8px), `--space-sm` (16px), `--space-md` (24px), `--space-lg` (48px)
- **Voice:** Speels, Motiverend, Toegankelijk, Community-gericht, Energiek, Positief (Dart Buddies override of the parent's coaching voice)

**Dart Buddies-specific overrides applied:**
- **Dark grey accent `#1A1A1A`** — used for primary headings (cover, section titles) for a professional, structured feel
- **Color scheme:** Confirmed red + green + light green + white/light grey palette with minimal dark accents

## Layout decisions

1. **Cover page gradient** — subtle linear gradient (light grey to white) to create visual interest without wasting ink
2. **Section titles** — 18pt Montserrat SemiBold with bottom border in accent green, providing clear visual breaks
3. **Spoken text container** — white background with green left border (3px, secondary color) to make dialogue pop and draw the eye
4. **Action text container** — very light grey (#f9f9f9) with light green left border (2px, accent) for secondary visual hierarchy
5. **Checklist** — light grey background with proper spacing, checkbox alignment left, label text flowing naturally
6. **Scene boxes** — light grey background with red left border (4px), scene number in red (primary), title in dark grey, page-break-inside: avoid to keep scenes together
7. **Print margins** — 20mm all around (A4 standard), optimized for printing without wasting ink
8. **No heavy backgrounds** — avoided dark full-bleed, leaning into Dart Buddies' brand guidance favoring white/calm backgrounds with color accent

## Source files

- **HTML source:** `/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/Deliverables/2026-07-14-dart-buddies-onboarding-video-script/index.html` — semantic HTML with well-scoped CSS using CSS custom properties for all brand tokens. Regeneratable.
- **PDF output:** `/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/Deliverables/2026-07-14-dart-buddies-onboarding-video-script.pdf` — rendered via Puppeteer with headless Chrome, A4 format, print background enabled.

## Content source verification

- Pulled all 16 scenes and the prep checklist from `[[PKM/My Life/Projects/dart-buddies-onboarding-video.md]]` (verified 2026-07-14)
- Maintained exact spoken text (blockquote content) and action sequence from source
- Skipped sections not needed on paper: "Verified platform-feiten" table, welcome-email template text, "Publicatie", "Open threads", "Next steps" — these are project-management scaffolding

## Token compliance check

✓ All colors traced to brand files (parent + child overrides)
✓ All typography using brand-approved fonts and weights
✓ All spacing following 8px base unit scale
✓ No hardcoded values — all via CSS custom properties
✓ Print-friendly design (no wasted ink on dark backgrounds)
✓ Legible at print size (11pt body text minimum)
✓ Clear scene numbering and visual hierarchy for filming scenario

## Pixel hand-off

**Not needed.** This is a text-heavy script document, not a visual infographic. The deliverable is print-ready as-is. No photographic, illustrated, or AI-rendered finishing required.

## Harmonia gaps

**None.** All tokens from GL-003-brands/dartbuddies.md and its parent (GL-003-brands/dartscoaching.md) were available and applied. No missing tokens or placeholders.

## Next steps (for user)

1. Review the PDF in detail — especially scene numbering, spoken-text prominence, and action clarity while holding a printout
2. Test print at 100% scale to confirm legibility (11pt body text should be comfortable to read at ~20cm distance)
3. If any layout adjustments needed (font size, margin, spacing), update `index.html` and re-render via the Puppeteer script
4. When ready to film, print and take to the OBS recording session

---

**Built by:** Charta, Infographic Designer  
**Date:** 2026-07-14  
**Time:** 16:33 UTC  
**Brand:** Dart Buddies (inherits from DartsCoaching.nl)

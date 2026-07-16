---
agent_id: harmonia
session_id: 2026-07-14-dart-buddies-brandkit
timestamp: 2026-07-14T11:45:00Z
type: end-of-session
brand: dartbuddies
tokens_changed: [voice-tone-descriptors, logo-usage, color-primary-confirm, color-accent-confirm, color-neutral-black-confirm, color-neutral-white-confirm, color-secondary-flagged, color-db-neutral-dark-provisional, mascot-personas-buddy, mascot-personas-dave, mascot-personas-diva, mascot-personas-doggy, imagery-graphic-motifs-provisional, typography-role-hierarchy-flagged]
---

# Session log — Dart Buddies brandkit infographic population

## Context

Sander shared two Dart Buddies brandkit infographics directly in chat with Hermes (no image files on disk — Hermes's transcription only). Hermes routed to Harmonia to run [[SOP-006-author-a-design-system]], scoped to Dart Buddies, using the transcribed content as input, per SOP-006 Step 1 (read parent first) and Step 8 (confirm-and-lock, not silently final).

## What was done

1. Read parent [[GL-003-brands/dartscoaching]] in full before touching the child file, per SOP-006 Step 1 — no re-asking of questions already answered by inheritance.
2. Populated `Team Knowledge/Guidelines/GL-003-brands/dartbuddies.md` §Overrides:
   - **Confirmed matches with parent** (not overrides, just confirmations): Rood `#F22E3E` (Primary), Lichtgroen `#7FD971` (Accent), Zwart `#000000`, Wit `#FFFFFF`.
   - **Genuine new overrides:** Identity — Voice/tone descriptors (Speels, Motiverend, Toegankelijk, Community-gericht, Energiek, Positief — deliberately different from DC's Eerlijk/Menselijk/Rustig/Gestructureerd/Groei-prestatie); Identity — Logo (DB's own light/dark logo + usage rules); Imagery style — the four mascot personas (Buddy/Dave/Diva/Doggy), fully specced with role, content-pull mapping, and visual recognition rules.
   - **Flagged, not resolved:** Color palette — Secondary/Groen. Infographic transcribed as `#35BF0E`; parent DC's existing `--color-secondary` is `#35BF0F`. One-character difference — could be Hermes's transcription error reading the image, or a genuine discrepancy. Written into both the brand file and the companion stijlgids doc as an explicit open question, NOT silently resolved either way. Working value until confirmed: DC's `#35BF0F` via inheritance.
   - **Flagged, provisional:** new neutral Donkergrijs `#1A1A1A` — genuinely absent from DC's neutral ramp (DC's Neutral 2-4 are still open). Not yet decided whether this is DB-exclusive or should also be adopted into DC's ramp. Working token name `--color-db-neutral-dark` (deliberately not `--color-neutral-4`, to avoid implying the DC ramp slot is already decided).
   - **Flagged, provisional:** graphic motifs vocabulary (neon lines, dartboard circles, dotted halftone, rounded frames, arrows/flow-lines) and an extended type-role hierarchy (Titel/Ondertitel/Subtitel/Sectietitel/Platte tekst/Citaat/Bijschrift) — both newly surfaced, both noted as "not yet cross-confirmed with Sander in a live session" rather than silently adopted.
3. Populated `PKM/Documents/dart-buddies-visuele-stijlgids-en-personas.md`:
   - Filled §1 color table (with the same flag on Groen).
   - Filled §3 Logo usage rules.
   - Filled §4 mascot role sections for Dave, Diva, Doggy (previously all "TBD") plus expanded Buddy's role with the content-pull mapping.
   - Added new §5 subsection "Grafische elementen" and §6 addition "Visuele tone-of-voice" (six adjectives).
   - Checked off resolved items in §8 "Openstaande beslissingen": colors (mostly), Dave/Diva/Doggy roles, mascot-to-content mapping, logo guidelines. Left unchecked: the hex confirmation, the dark-grey exclusivity question, the type-role hierarchy, the graphic motifs.
4. Updated the hub (`GL-003-design-system.md`) §3 registry row and status line for Dart Buddies to reflect the new override scope — registry-text maintenance only, no hub restructuring.

## Sander's specific inputs (verbatim from the briefing)

- Four mascot personas: Buddy (green, motivates/activates, pulls Tips & tools), Dave (red, encourages/celebrates, pulls Welkom & introductie), Diva (pink, drives participation, pulls Challenges & activatie), Doggy (dog-robot, connects people, pulls Successen & communityposts).
- Fixed recognition rules per buddy — color + prop + pose — explicitly "do not mix up, no new robot styles" per the infographic's own Do's/Don'ts.
- Color palette: Rood #F22E3E, Groen #35BF0E (flagged), Lichtgroen #7FD971, Zwart #000000, Wit #FFFFFF, Donkergrijs #1A1A1A (new).
- Typography base confirmed matching DC (Montserrat Bold/SemiBold headings, Open Sans Regular/Light body) with a more granular type-role table shown but not yet cross-verified.
- Logo: light/dark background versions, full-logo-only, whitespace, no shadow/distortion, calm backgrounds.
- Graphic motifs vocabulary and six-adjective visual tone-of-voice, both new.

## Sections explicitly left open / flagged

- **#35BF0E vs #35BF0F** — top-priority confirmation needed from Sander before this counts as locked.
- Donkergrijs #1A1A1A — DB-exclusive or also-DC question.
- Extended type-role hierarchy — surfaced, not verified against point sizes.
- Graphic motifs vocabulary — surfaced, not cross-confirmed in a live session.

## Downstream impact

- Charta and Pixel can now use the four mascot personas, the confirmed palette entries, and the DB-specific voice/logo tokens for Dart Buddies deliverables.
- Any deliverable using the flagged Groen hex or the Donkergrijs neutral should be built with the working/fallback values noted in the brand file and re-rendered once Sander confirms.
- No in-flight Dart Buddies deliverables were known to be blocked on this population at session time; none identified requiring immediate re-render.

## Next steps

- Hermes reads the flagged items back to Sander (see Hermes's synthesis for the exact confirmation ask).
- Once Sander confirms the hex and the dark-grey/type-scale/graphic-motifs questions, Harmonia updates `GL-003-brands/dartbuddies.md` and the companion stijlgids doc to remove the flags and lock the values, and updates this session-log's follow-up.

## Follow-up (2026-07-14, Hermes) — all four flags resolved

Hermes read the flagged items back to Sander (via lettered choices per [[GL-013-interactie-enkelvoudige-keuzes]]). All four confirmed:

1. **Groen (Secondary) hex:** `#35BF0F` — the existing DC parent value. Confirmed the `#35BF0E` transcription was Hermes's reading error, not a genuine DB-specific tint.
2. **Donkergrijs `#1A1A1A`:** stays DB-exclusive. DC's own neutral ramp is unaffected.
3. **Extended type-role hierarchy:** confirmed and locked as identical to DC's existing scale, now explicitly stated to apply to Dart Buddies too.
4. **Graphic motifs vocabulary:** confirmed and locked as official DB imagery-style guidance — Charta and Pixel can use it immediately.

Hermes applied these directly to `GL-003-brands/dartbuddies.md` and `PKM/Documents/dart-buddies-visuele-stijlgids-en-personas.md` — all flags removed, "Open vragen" section replaced with "Beslissingen (2026-07-14)", §8 checklist fully checked off. Both files now read as locked, not provisional.

## Cross-references

- [[GL-003-brands/dartbuddies]]
- [[GL-003-brands/dartscoaching]]
- [[GL-003-design-system]]
- [[SOP-006-author-a-design-system]]

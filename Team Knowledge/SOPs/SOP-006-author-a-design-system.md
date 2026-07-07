# SOP: Author a Design System

- **Status:** Active (since v1.6.0)
- **Default owner:** Harmonia
- **Reusable by any agent.** This is a skill, not a 1:1 ownership. Any specialist can run this procedure when the user asks to set up or extend their visual identity. In practice Harmonia runs it, but if the team grows and another design-flavored agent gets hired, they can invoke this SOP without re-deriving the procedure.
- **Triggered by:** "set up my design system", "let's pin my brand", "what colors / fonts / spacing should I use", "I want to add a new accent / type role / token", first creative request for a brand whose file under `GL-003-brands/` is still empty.
- **References:** [[GL-003-design-system]] (the multi-brand hub — routing, inheritance model, brand registry only, no tokens), `Team Knowledge/Guidelines/GL-003-brands/<brand-slug>.md` (the artifact this SOP actually populates), [[GL-001-file-naming-conventions]], [[Team/Harmonia - Design System Architect/AGENTS]], [[SOP-007-audit-content-for-design-system-compliance]] (the companion audit skill).

## Purpose

Walk the user through populating one brand's file under `GL-003-brands/` in a single guided session: identity, color palette, typography, spacing scale, imagery style, voice samples. This SOP is always run **per brand** — the first step is confirming which brand/venture the session is for. The output is a populated `GL-003-brands/<brand-slug>.md` file that Charta, Pixel, and any future creative agent reads whenever a task names that brand.

The procedure is decision-led, not prescriptive. The user picks; this SOP asks the right questions in the right order.

## What this SOP does not do

- Does not pick values unilaterally. Every value comes from the user. Agents do not decide the brand.
- Does not produce visual deliverables (slides, images, infographics). That is [[SOP-008-build-an-infographic]] and [[SOP-009-generate-a-styled-image]].
- Does not audit existing deliverables against a brand file. That is [[SOP-007-audit-content-for-design-system-compliance]].
- Does not restructure the hub ([[GL-003-design-system]]) itself. Adding or extending a brand only ever touches that brand's file (and, if it's a new brand, adds one row to the hub's registry table).

## When to run this SOP

- **First creative request gate.** When the user asks for any creative work (slide, image, infographic, thumbnail, PDF) and the relevant brand's file under `GL-003-brands/` is empty (or empty for the section the work needs), this SOP runs first — scoped to that one brand.
- **Schema evolution.** When the user wants to add or change a token (new accent color, new heading font, additional spacing token) for a specific brand, this SOP runs targeted on the affected section of that brand's file.
- **Voluntary setup.** The user explicitly asks to pin a brand's design system before any creative work is requested.
- **New brand/venture.** When a venture needs its own visual identity for the first time and has no file yet under `GL-003-brands/`, this SOP creates it (see Step 1).

If the user explicitly chooses to skip setup for a brand ("let's just hack it together for now"), creative work for that brand proceeds in flagged "no-style fallback" mode. The deliverable carries a "`GL-003-brands/<brand-slug>.md` not populated" note. This SOP is invoked the next time the user wants consistency for that brand.

## Inputs

- **Which brand/venture this session is for.** Mandatory, first thing to confirm — see Step 0. Never assume; a session always targets exactly one brand file.
- **The brand context.** What is being designed for: a personal knowledge folder (myPKA), a consulting business, a SaaS product, a podcast, a course brand, a side project.
- **Existing visual references (optional).** Sites, decks, palettes, mood boards the user already likes. These accelerate the session but are not required.
- **Constraints (optional).** Existing logo, an established product color, a partner brand the user has to coordinate with.

## Step-by-step procedure

### Step 1 — Confirm the brand, then open or create its file

Read `Team Knowledge/Guidelines/GL-003-design-system.md` (the hub) first, specifically §3 Brand registry, to see which brands already have a file under `GL-003-brands/`.

Confirm with the user which brand/venture this session is for:

- **Existing brand, needs (re)populating.** Open `Team Knowledge/Guidelines/GL-003-brands/<brand-slug>.md`. If it declares `inherits from: <parent>.md`, read the parent file too so the session doesn't re-ask questions already answered by inheritance — this session only fills the child's `## Overrides`.
- **New brand/venture, no file yet.** Create `Team Knowledge/Guidelines/GL-003-brands/<new-brand-slug>.md` following the pattern in the hub (base file, or `inherits from:` an existing brand if this is a sub-brand). After the session, add a row for it to the hub's §3 registry table — this is the only edit the hub itself ever needs.

Read the chosen brand file through with the user. Confirm which sections are still empty vs. already populated. The session focuses on the empty (or to-be-changed) sections of **that one brand file** — never the hub, which never carries tokens.

Throughout the rest of this procedure, "GL-003" below always means **the confirmed brand file**, `GL-003-brands/<brand-slug>.md` — never the hub.

### Step 2 — Section: Identity

Prompts:

1. **Brand name.** "What's the canonical name? Capitalization, spacing, punctuation locked from now on?"
2. **Voice/tone descriptors.** "Pick three to five adjectives that describe how this brand sounds when it speaks. Direct? Warm? Playful? Technical? Restrained? Aim for combinations that aren't generic — 'professional' and 'innovative' are useless. 'Calm but direct' is useful."
3. **Audience.** "One sentence on who you're speaking to. Not a demographic — a *person*. The audience constrains every later choice."

Write the answers verbatim into GL-003 §Identity, replacing the placeholders.

### Step 3 — Section: Color palette

Prompts:

1. **Primary.** "Your signature color. The one a viewer should associate with this brand at a glance. Hex value? If you don't have one, name two-to-three options and pick."
2. **Secondary.** "The supporting color. Used for backgrounds, surfaces, secondary CTAs. Often a neutral that complements the primary."
3. **Accent.** "The punctuation color. Used sparingly — the brass-moment of any composition. Often warm, often saturated."
4. **Neutrals.** "The canvas, the text, the borders. A warm or cool gray ramp. Five-to-seven steps from light to dark."
5. **Status (optional).** "Do you need success, warning, error, info colors? If your deliverables are mostly editorial (essays, decks, social), probably no. If they're product-flavored (UI, dashboards), yes."

For each color: hex value + one-line intent comment. Write into GL-003 §Color palette.

If the user is stuck, offer two-to-three concrete pairings as choices, never an open palette of possibilities.

### Step 4 — Section: Typography

Prompts:

1. **Heading font.** "Display face for titles and section heads. Serif (editorial character), heavy sans (modern punch), or display script (ornament)? Specific family in mind?"
2. **Body font.** "Workhorse face for paragraph copy. Almost always a clean sans (Inter, Geist, Source Sans, system-ui) for legibility. Pick one and lock it."
3. **Mono font (optional).** "Code, numerics, tabular data. JetBrains Mono, Geist Mono, IBM Plex Mono, system mono. Skip if the brand never shows code or tabular data."

For each font: family name, weights used, one-line role description ("Inter Bold 700 for H1, Inter Regular 400 for body, Inter Medium 500 for emphasis"). Write into GL-003 §Typography.

### Step 5 — Section: Spacing scale

Prompts:

1. **Base unit.** "4px or 8px. 4px gives finer-grained control; 8px is more opinionated and harder to drift from."
2. **Tokens.** "Six tokens — `xs`, `sm`, `md`, `lg`, `xl`, `2xl` — mapped to multiples of the base unit. Default ladder: 4, 8, 16, 24, 32, 48 (4px base) or 8, 16, 24, 32, 48, 64 (8px base)."

Write into GL-003 §Spacing scale.

### Step 6 — Section: Imagery style

Prompts:

1. **Photography style.** "Editorial (dramatic, intentional), candid (real, casual), studio (clean, isolated subject), lifestyle (people in scenes), or no photography at all. If yes, link one example image you love."
2. **Illustration style.** "Line (thin strokes, no fill), painted (watercolor, brushstroke), flat (geometric, solid colors), 3D, mixed, or none. Link one example."
3. **Icon style.** "Line, filled, two-tone, hand-drawn, or none. Most brands pick one icon family (Lucide, Phosphor, Heroicons, Tabler) and lock it."

Write into GL-003 §Imagery style. This section drives Pixel's prompt construction directly.

### Step 7 — Section: Voice samples

Ask the user to write three short example sentences in the brand's intended voice. Captions, headlines, or one-liners. Concrete, not abstract.

If the user is stuck, offer this prompt: "Write the first sentence of an email to your ideal customer. Now write a button label. Now write a one-line product tagline."

Write the three verbatim into GL-003 §Voice samples. These are the canonical reference for any caption, headline, or body copy a creative agent writes.

### Step 8 — Confirm and lock

Read the populated sections back to the user. Confirm:

- Every value has an intent comment.
- No section was filled with "sensible defaults" the user didn't actually pick.
- Sections the user explicitly chose to skip are clearly marked as empty (not partially populated).

Save the file.

### Step 9 — Announce downstream impact

Tell the user (and Hermes):

- Charta and Pixel now read this brand file on every task briefed for this brand. Other brands' deliverables are unaffected.
- Any in-flight deliverable for this brand that ran in fallback mode is flagged for re-render against the newly populated brand file.
- Old deliverables for this brand are stale; they get re-rendered next time they're touched, not bulk-rebuilt now.
- If this brand has a child that `inherits from:` it, note whether the changed section is one the child overrides (no impact on the child) or inherits as-is (the child picks up the change automatically).
- If a creative request for this brand lands and a section is still empty, the agent flags it back and Harmonia extends the brand file in a follow-up session.

### Step 10 — Session-log entry

Write `Team Knowledge/session-logs/YYYY/MM/YYYY-MM-DD-HH-MM_<agent-id>_<topic-slug>.md` with type `end-of-session`. Capture:

- Which sections were populated this session
- The user's specific choices and the reasoning they gave
- Sections explicitly left empty for now
- Any in-flight deliverables that need a re-render
- Any cross-agent impact (Charta and Pixel both pick up the new tokens automatically; no re-config needed)

## Common mistakes to avoid

- Running this SOP without confirming the brand first, or worse, editing the hub (`GL-003-design-system.md`) directly. The hub carries no tokens — everything from this SOP lands in a `GL-003-brands/<brand-slug>.md` file.
- Pre-populating a brand file with "sensible defaults" before the user has chosen. The worst outcome — silent choices the user never made.
- Leaving a section half-populated without flagging. A partial brand file is more dangerous than an empty one because agents will use the populated values and silently default the missing ones.
- Skipping the intent comment ("`#1A1A1A` — primary background, used for app canvas and dark-mode hero sections"). When values evolve, the intent is the anchor that keeps meaning stable.
- Letting the user pick generic adjectives ("professional", "innovative", "modern") for voice/tone. Push for specificity — combinations that aren't generic.
- Editing a brand file without a session-log entry. Schema changes are documented; the session-log is the changelog.
- Letting Charta or Pixel work blind because "we'll do the design system later". The first creative request for a brand is the right moment to populate that brand's file.
- For inheriting brands, restating parent tokens in the child's file instead of only listing the actual overrides. That's duplication, and duplication drifts.

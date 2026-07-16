# GL-003 - Design System (Multi-Brand Hub)

> **This Guideline is a general rule every creative agent and every token-consuming agent reads on every relevant action.** Charta, Pixel, Bezalel, Nemesis, and any future visual or frontend specialist consume this hub first — before touching any actual token file. Harmonia is the default author of every brand file; the values are the user's. This file itself never carries brand values — it only carries the routing rule, the inheritance model, and the brand registry.

> **This file changed shape.** Until this revision, GL-003 held one brand's tokens directly. Sander now runs multiple ventures, each with its own visual identity. GL-003 is now a **hub**: it tells an agent which per-brand file to open. The actual tokens live in `Team Knowledge/Guidelines/GL-003-brands/<brand-slug>.md`.

---

## 1. The rule: know the brand before you read tokens

**No creative or token-consuming agent may read a brand file, apply a fallback palette, or guess a brand, ever.** This is the same "empty is honest, placeholder is dangerous" principle this Guideline has always carried — it now applies one level up, to brand selection itself.

Before Charta, Pixel, Bezalel, or Nemesis reads any file under `GL-003-brands/`, the task briefing must make the brand unambiguous. Concretely:

1. **Hermes' briefing must name the brand/venture** the task is for, every time a creative or UI task is delegated. This is a mandatory field in the cold-start briefing, the same way "what to build" and "where the output lands" are mandatory.
2. **If the briefing does not name a brand:** the agent asks Hermes (or the user) to name it. It does not infer the brand from context clues, does not fall back to "the last brand used," and does not apply a default palette.
3. **If the user explicitly has no brand yet** (a brand-new venture with nothing pinned): the agent flags "brand not specified / not yet onboarded" and routes to Harmonia to either point at an existing brand file or create a new one via [[SOP-006-author-a-design-system]].
4. **Never guess.** A wrong-brand deliverable (ADC Regio Oost colors on a DartsCoaching.nl asset, for instance) is a worse failure than a delayed deliverable. When in doubt, stop and ask.

Once the brand is confirmed, the agent reads exactly one file: `Team Knowledge/Guidelines/GL-003-brands/<brand-slug>.md`. That file — not this hub — carries the actual `--color-*`, `--space-*`, font, and voice tokens.

---

## 2. The inheritance model (generic — reusable for any brand)

A brand file can either be a **base** (defines its own tokens from scratch) or can **inherit** from another brand file and override only what's explicitly different. This keeps closely related sub-brands from duplicating (and silently drifting from) a shared parent identity.

### How it works

- A brand file that inherits declares it at the very top of the file: `inherits from: <parent-brand-file>.md`.
- Below that declaration, the file carries only an **Overrides** section — the sections or individual tokens that genuinely differ from the parent.
- Every section **not** listed under Overrides is inherited as-is from the parent file. The agent reading an inheriting brand file must open the parent file too, apply the parent's tokens, then apply this file's overrides on top.
- An override can be as small as a single token (e.g. just the avatar/illustration style) or as large as a full section (e.g. an entirely different color palette while keeping the parent's typography and voice). Only list what's actually overridden — do not restate inherited values in the child file. Restating them is duplication, and duplication is exactly what SSOT discipline forbids (see root `AGENTS.md` Hard Rule 1).
- A brand file can only inherit from one parent (no multi-parent inheritance). If a sub-brand needs to blend two identities, that's a signal it should be its own base brand instead — flag that to Harmonia rather than forcing the model.

### Reading order for an inheriting brand

1. Open the child brand file (e.g. `GL-003-brands/dartbuddies.md`).
2. Note the `inherits from:` line.
3. Open the named parent file and read its full token set.
4. Apply the child's `## Overrides` section on top — those tokens win where they conflict with the parent.
5. Every section the child doesn't mention stays exactly as the parent defines it.

This pattern is not specific to any one brand pair. Any future brand can declare `inherits from:` against any existing base brand the same way.

---

## 3. Brand registry

| Brand | File | Relationship |
|---|---|---|
| ADC Regio Oost | [[GL-003-brands/adc-regio-oost]] | Own base — independent tokens. |
| DartsCoaching.nl | [[GL-003-brands/dartscoaching]] | Own base — independent tokens. |
| Dart Buddies | [[GL-003-brands/dartbuddies]] | Inherits from DartsCoaching.nl. Overrides now include the four mascot personas (Buddy/Dave/Diva/Doggy), DB-specific voice/logo, palette confirmations, and provisional additions (dark grey neutral, graphic motifs) pending Sander's sign-off — see the file for the live override list and open-questions section. |
| Van Gewoon Sander | [[GL-003-brands/van-gewoon-sander]] | Own base — independent tokens. |

Status: **DartsCoaching.nl** fully populated. **ADC Regio Oost** partially populated (colors/typography/imagery — approximated from existing materials pending exact hex/font confirmation; voice/audience still open). **Dart Buddies** populated as a draft (mascots, voice, logo, most palette confirmed) with one flagged hex discrepancy and two provisional additions awaiting Sander's confirmation — see the file. **Van Gewoon Sander** still empty/placeholder. Populate remaining sections with Harmonia via [[SOP-006-author-a-design-system]].

**Adding a new brand.** When a new venture needs its own visual identity: Harmonia creates `GL-003-brands/<new-brand-slug>.md` (base, or `inherits from:` an existing brand if it's a sub-brand), adds a row to the table above, and — if the new brand is a sub-brand of an existing one — documents the override scope. No change to this hub's structure is needed; the registry table is the only thing that grows.

---

## 4. How agents use this file

- **At session start, every creative or token-consuming agent reads this hub first**, then — once the brand is confirmed per §1 — reads exactly one brand file under `GL-003-brands/`.
- **If the brand file (or the section within it the task needs) is still placeholder,** the agent does not improvise. Two paths:
  1. Route to Harmonia via [[SOP-006-author-a-design-system]] to populate that brand.
  2. Work in flagged fallback mode (neutral-style for Pixel, no-style for Charta, base-only for Bezalel/Nemesis) and note in the deliverable: "GL-003-brands/`<brand-slug>`.md §X not populated; revisit when populated."
- **When a brand file evolves,** in-flight deliverables for that brand that referenced the changed section are flagged for re-render. Older deliverables for that brand become stale candidates and get re-rendered next time they are touched (boy-scout rule), not bulk-rebuilt on the spot. Changes to one brand file never affect another brand's deliverables, except where a child brand inherits the changed parent section.
- **Audit cadence.** Harmonia runs [[SOP-007-audit-content-for-design-system-compliance]] per brand, when the user requests it, when a token is added, or when drift is suspected. The audit names violations against the specific brand file in scope; the user decides which to fix.
- **Edits to any brand file are Harmonia-only.** The user proposes; Harmonia authors. Charta, Pixel, Bezalel, and Nemesis only ever read. The split keeps every brand's schema coherent — multiple authors silently drift it.

---

## References

- `Team Knowledge/Guidelines/GL-003-brands/` — the folder holding every brand's actual token file.
- [[GL-003-brands/adc-regio-oost]], [[GL-003-brands/dartscoaching]], [[GL-003-brands/dartbuddies]], [[GL-003-brands/van-gewoon-sander]] — the current brand files.
- [[SOP-006-author-a-design-system]] — the procedure for populating or extending a brand file.
- [[SOP-007-audit-content-for-design-system-compliance]] — the procedure for verifying deliverables against a brand file.
- [[SOP-008-build-an-infographic]] — Charta's skill; reads from a brand file once the brand is confirmed.
- [[SOP-009-generate-a-styled-image]] — Pixel's skill; reads from a brand file once the brand is confirmed.
- [[GL-001-file-naming-conventions]] — slug, date, filename rules.
- [[GL-002-frontmatter-conventions]] — entity frontmatter schema.
- [[GL-014-todoist-taakformat]] — uses the same brand/venture indeling (ADC Regio Oost, DartsCoaching.nl, Dart Buddies, Van Gewoon Sander) for Todoist project routing; this Guideline reuses the same names for consistency across task management and design.
- [[Team/Harmonia - Design System Architect/AGENTS]] — Harmonia's contract; the default author of every brand file.

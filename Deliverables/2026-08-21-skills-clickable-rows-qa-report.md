# QA Report: Klikbare domain-skill rijen (`#/skills`, myPKA Cockpit)

**Inspector:** Nemesis
**Date:** 2026-08-21
**Verdict:** PASS

## Scope note — design system used for this gate

This deliverable is an internal-tool view inside **myPKA Cockpit** (Sander's own admin surface), not one of the four client ventures registered in `Team Knowledge/Guidelines/GL-003-design-system.md` §3 (ADC Regio Oost, DartsCoaching.nl, Dart Buddies, Van Gewoon Sander). None of those brand files applies here. Per established Cockpit precedent (2026-08-19 Team Tasks / Skills gate, 2026-08-19 Darts Training gate), "GL-003-compliance" for Cockpit-internal views means the Cockpit's own CSS custom-property system defined in `Expansions/mypka-cockpit/web/src/index.css` ("GL-003 v5 INKLINE" tokens). Gated against that token set, not a client brand file.

## Files inspected

- `Expansions/mypka-cockpit/web/src/views/SkillsView.tsx` (`fileHrefFor()`, `SkillRow`)
- `Expansions/mypka-cockpit/web/src/views/FileView.tsx` (`repoRelativeFor()`, conditional `DiscussButton`)
- `Expansions/mypka-cockpit/web/src/lib/router.ts` (`skill:` codec, `FileSource`)
- `Expansions/mypka-cockpit/web/src/views/team.css` (`.tk-row--nav` and siblings — read, not modified by this diff)
- `Expansions/mypka-cockpit/server/skillFileApi.js`, `server/server.js` diff (route registration only)
- `Expansions/mypka-cockpit/web/src/lib/i18n/{nl,en}.ts` (`common.openLabel`, `team.skillsGroup*` keys)
- `Expansions/mypka-cockpit/web/src/components/DiscussButton.tsx`

Reviewed via `git show 34ae7b6 -- Expansions/mypka-cockpit/` (the commit containing this change) to confirm the exact diff boundary, not just the current file state.

## Methodology — live verification, not source-reading alone

Per the briefing: the already-running production Cockpit on **port 4317 predates this change** — confirmed via process start time (`ps -o lstart`, PID 85462, started **11:25:48**) against the mtimes of the changed server files (`server/skillFileApi.js` 18:46, `server/skillsApi.js` 18:51, `server/server.js` diff committed 18:51:41). The running Node process never loaded the new route registration, so a click-test against :4317 would 404 — exactly the pitfall the briefing flagged. I did not use :4317 for interactive testing.

I started an **isolated instance on port 5199** (`NODE_ENV=production PORT=5199 COCKPIT_SKILL_FILES_ENABLED=1 node server/server.js`, the same env the real launcher (`start-cockpit.command`) sets, minus the write-mode flags this test didn't need), against the fresh `dist/` build (built 18:52:15, i.e. after all three changed source files). Verified end-to-end with `puppeteer-core` (installed fresh into the session scratchpad, not the repo) driving the actually-installed `/Applications/Google Chrome.app` — real DOM measurement via `getBoundingClientRect()`/`getComputedStyle()`, not the `--screenshot`/`--virtual-time-budget` CLI method SOP-005 warns against. Torn down (`kill`) after testing; port 5199 confirmed free afterward.

## Verified PASS

- **Style reuse, no new tokens/classes.** `team.css`'s `.tk-row`, `.tk-row--nav`, `.tk-row-arrow`, `.tk-meta-chip*`, `.tk-group*` are untouched by this diff (not in the `git show` file list) and every value in them resolves through `var(--...)` — no hardcoded hex/px. Confirmed by reading the stylesheet, not taking Bezalel's comment at face value.
- **i18n.** `common.openLabel` and all three `team.skillsGroup*` / `team.skillsDisabled` keys already existed in both `nl.ts` and `en.ts` before this diff (grep confirms no new key additions in the commit's file list). Live-captured `aria-label` values match the claimed pattern exactly: domain-skill row → `"Open dartpraat"` (no invocation, so falls back to title per `fileHrefFor`/`titleAddsInfo` logic); slash-command row → `"Open /brainstorm"` (invocation present, title suppressed because it duplicates the slug). Both patterns produce the same on-screen vs. screen-reader content — no echo mismatch either way.
- **Domain-skill nav rows are structurally identical to slash-command nav rows.** Live DOM capture: both render as `<a class="tk-row tk-row--nav">` with an `ArrowUpRight` icon (`.tk-row-arrow`), same row dimensions (102–103 px tall, full column width) at every breakpoint. A full 12-stop keyboard Tab trace across both groups shows an unbroken sequence of `<a class="tk-row tk-row--nav">` elements, every one with the identical `outline: solid 2px` from `.tk-row--nav:focus-visible` — no visual or behavioral seam between "new" domain-skill rows and "existing" slash-command rows.
- **Non-navigable plugin-skill rows stay visibly distinct, on purpose.** `superwhisper` (the one plugin-skill row, disabled) renders as a `<div class="tk-row tk-row--muted">` — no arrow icon, no href, no pointer cursor, no focus-visible outline (correctly excluded from the tab order, since it is not a link) — while carrying its `disabled` + `superwhisper` chips. Screenshot: `Deliverables/2026-08-21-skills-clickable-rows-qa-assets/skills-plugin-section.png`.
- **No orphaned/ghost focus stop when `DiscussButton` is skipped.** For a skill-file (`repoRelativeFor` returns `null` on the `skill:` prefix), the live rendered `<header class="file-view-head">` contains only the glyph+title and the "Raw" link — no disabled button, no empty wrapper, no stray `tabindex`. `document.querySelectorAll('.file-view-head button, .file-view-head a').length === 1` (Raw only). This is a clean React conditional-render (`{!missing && discussFile && <DiscussButton/>}`), not a CSS-hidden element — confirmed nothing extra exists in the DOM, not just that nothing is visible.
- **Backend jail (`skillFileApi.js`).** Live-tested against the isolated instance: `GET /api/cockpit/skill-file?skill=ndb-regels` → 200, correct headers (`Content-Type: text/markdown`, `Content-Security-Policy: default-src 'none'; sandbox`, `Cache-Control: no-store`, `X-Content-Type-Options: nosniff`). Traversal-style and bogus slugs (`../../etc/passwd`, URL-encoded variants) → 404, generic body, no path/slug leaked in the error — matches Argus's 2026-08-21 signed-off design (`Deliverables/2026-08-21-cockpit-skills-jail-security-ontwerp.md`, verdict GEEL). This route's own security posture is Argus's domain, not re-audited here in depth; verified only that it behaves as documented for this gate's purposes.
- **Responsive, no overflow.** `document.documentElement.scrollWidth === window.innerWidth` measured via CDP at 375 / 768 / 1280 px — holds at all three. This page is explicitly named in `team.css`'s `min-width: 0` chain comment ("Verified at 320/375/414/768/1280px on all five pages… Skills") from the 2026-08-19 Nemesis regression fix, and today's addition reuses the exact same class chain (`.tk-rows > .tk-row-li > .tk-row > .tk-row-head`), so no new overflow surface was introduced.
- **Tap targets (WCAG 2.2 SC 2.5.8 + the house 44×44 bar).** Domain-skill nav rows measure ≈102–103 px tall × full row width (337 px at 375, 910 px at 1280) — the whole card is the target, comfortably clearing both the AA 24×24 floor and the stricter house checklist, at every breakpoint tested.
- **Mobile reflow.** Screenshots at 375 px (`skills-375.png`) show clean single-column stacking, no clipping, no mid-word overflow.

## Findings

### [LOW, cosmetic] Every domain-skill FileView shows a generic `<h1>SKILL.md</h1>`

**Where:** `FileView.tsx`, driven by `parseFileSrc()` in `router.ts` (`path: `${slug}/SKILL.md`` → `name = path.split('/').pop()` → `"SKILL.md"` for every skill).

**What:** Opening `dartpraat`, `ndb-regels`, or any other domain skill all render the identical page heading `SKILL.md`. The distinguishing identity (`dartpraat/SKILL.md`) is present but demoted to the smaller `.file-view-path` byline one line below. A user relying on the `<h1>` alone (including a screen-reader user navigating by heading landmark, or a sighted user glancing at browser back/forward history) can't tell which skill they're looking at from the heading text.

**Cited rule:** Not a hard WCAG 2.2 AA failure (no SC mandates a page-unique `<h1>`, and the app doesn't update `document.title` per-route anywhere else either — confirmed via live test, `document.title` stays `"Second Brain"` app-wide, so this isn't a regression against that separate, pre-existing pattern). Flagged as a usability/consistency gap adjacent to WCAG 2.4.6 (Headings and Labels — headings should describe topic/purpose).

**Fix recommendation:** Have `parseFileSrc()`'s skill branch return a more specific display name, e.g. `path: `${slug} — SKILL.md`` (keeping the real fetch/jail logic on the slug alone, which is unaffected), so the `<h1>` reads `dartpraat — SKILL.md` instead of the bare filename. Low priority — does not block this gate.

### [Informational, pre-existing, out of scope] Every slash-command row's file link 404s — predates this diff

**Where:** `/api/cockpit/file` route in `server.js` (three-way path dispatch: `Deliverables/`, `Team Knowledge/`, else PKM-relative).

**What:** `.claude/commands/brainstorm.md` (and, by the same logic, every other slash-command `filePath`) exists on disk but isn't `Deliverables/`- or `Team Knowledge/`-rooted, so the route's `else` branch treats it as PKM-relative (`PKM/.claude/commands/brainstorm.md`), which never exists → the FileView renders its calm "could not be found" state. Reproduced identically on **both** the isolated test instance and the already-running production :4317 (same 404), and `git show 34ae7b6 -- .../server.js` confirms this diff's only change to `server.js` is registering the new skill-file route — the `/api/cockpit/file` dispatcher itself is untouched. This is not caused by, or fixed by, today's change.

**Cited rule:** N/A — observational, out of this gate's scope (the briefing's changed-file list does not include this route).

**Fix recommendation:** Worth its own ticket to whoever owns `server.js`'s file jail — the "already-existing, already-clickable" slash-command rows have apparently never actually opened a file; they fail closed (calm not-found state, not a crash or leak) rather than fail open, so it's not a security issue, just a broken feature. Not this gate's blocker; routing for team awareness the same way the darts-training QA report (2026-08-19) flagged the sidebar-default-open issue.

## Verdict

**PASS.** No CRITICAL or HIGH findings. Design-system reuse claim verified true (no new tokens, no new i18n keys); the new domain-skill nav rows are behaviorally and visually indistinguishable from the existing slash-command nav rows (same classes, same aria-label pattern, same focus ring, same tap-target size); the conditionally-skipped `DiscussButton` leaves no orphaned focus stop; responsive containment holds at 375/768/1280px with zero overflow; the backend jail behaves per its already-audited security design. One LOW cosmetic finding (generic `SKILL.md` heading) does not block. One informational, pre-existing, out-of-scope bug (slash-command file links 404 system-wide) is unrelated to this diff and is flagged for separate follow-up, not this gate.

## Evidence

Screenshots and raw measurements: `Deliverables/2026-08-21-skills-clickable-rows-qa-assets/` (`skills-1280.png`, `skills-375.png`, `skills-768.png`, `skill-file-view.png`, `skills-plugin-section.png`).

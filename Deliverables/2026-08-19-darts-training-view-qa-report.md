# QA Report: Dartstraining dashboard (`#/darts-training`, myPKA Cockpit)

**Inspector:** Nemesis
**Date:** 2026-08-19
**Verdict:** PASS (re-inspected 2026-08-19 after `.dt-card-link` tap-target fix — see addendum at bottom; pending only a build/deploy step, not further code changes)

## Scope note — design system used for this gate

This deliverable is an internal-tool view inside **myPKA Cockpit** (Sander's own admin surface), not one of the four client ventures registered in `Team Knowledge/Guidelines/GL-003-design-system.md` §3 (ADC Regio Oost, DartsCoaching.nl, Dart Buddies, Van Gewoon Sander). None of those brand files applies here. Per established Cockpit precedent (e.g. the 2026-08-19 Team Tasks gate), "GL-003-compliance" for Cockpit-internal views means the Cockpit's own CSS custom-property system defined in `Expansions/mypka-cockpit/web/src/index.css` ("GL-003 v5 INKLINE" tokens, cited in that file's own header comment). I gated against that token set, not a client brand file. Flagging this explicitly rather than silently assuming — if the team wants a distinct written design-system doc for the Cockpit itself, that's a gap worth naming to Harmonia separately.

## Summary

Files inspected: `DartsTrainingView.tsx`, `darts-training.css`, `dartsTrainingTypes.ts`, `dartsTrainingApi.js`, `dartsTrainingApi.test.mjs`, plus the `server.js` route registration and `moduleRegistry.tsx` entry. Token compliance, the four card states, the collapsible day sections, the score chart's dual-modality (visual `role="img"` + `sr-only` table), the write-to-markdown architecture, and focus retention after logging a session all check out as built. One HIGH finding: a standalone card link ("Oefening lezen") renders below the WCAG 2.2 AA minimum tap-target size. Everything else is PASS or informational/out-of-scope.

## Findings

### [HIGH] "Oefening lezen" card link fails WCAG 2.2 SC 2.5.8 (Target Size Minimum)

**Where:** `.dt-card-link` in `darts-training.css` (every exercise card's action row) — measured at 375px, 768px, and 1280px via Chrome DevTools Protocol (`getBoundingClientRect()`), not the flaky `--screenshot`/`--virtual-time-budget` method SOP-005 warns against.

**What:** The link renders at **95 × 22 CSS px** at every breakpoint tested (no responsive scaling). WCAG 2.2 SC 2.5.8 (AA) requires interactive targets to be at least 24×24 CSS px, unless an exception applies. The "target is part of a sentence" (inline-text) exception does not apply here — this is a standalone action item in a row of buttons, not a link embedded in a line of prose. The element carries no vertical padding at all (`.dt-card-link { margin-left: auto; font-size: 0.8125rem; ... }` — no `padding`), so its box is exactly the text's line box.

**Cited rule:** WCAG 2.2 SC 2.5.8 Target Size (Minimum), AA. Also below the team's own stricter checklist in `Team Knowledge/SOPs/SOP-005-nemesis-quality-gate.md` Phase 4 §2 (44×44 CSS px).

**Fix recommendation:** Add vertical padding to `.dt-card-link` (e.g. `padding: 4px 2px`) so its box reaches at least 24×24 CSS px — or match `.dt-btn`'s padding for visual/target-size consistency with its sibling buttons in the same action row. A ~2–4px addition clears the true AA floor; matching `.dt-btn`'s `padding: 6px 12px` would also close the gap to the house 44px target.

### [MEDIUM — pre-existing house pattern, not a regression] `.dt-btn` buttons below the team's 44×44 tap-target checklist

**Where:** `.dt-btn` ("Voortgang", "Sluiten"/"Sessie loggen") — measured 132 × 35 CSS px at every breakpoint.

**What:** 35px clears the actual WCAG 2.2 AA floor (24×24) comfortably, but falls short of SOP-005 Phase 4 §2's 44×44 checklist line, which is written to also cover WCAG 2.5.5 (AAA). This is **not specific to this module** — the identical `padding: 6px …` button convention already exists in `analytics.css`, `board.css`, `settings.css`, and `podcasts.css` across the Cockpit. Bezalel inherited an existing app-wide pattern rather than introducing a new one.

**Cited rule:** SOP-005 Phase 4 §2 (house checklist, AAA-aligned). True AA (SC 2.5.8) is satisfied.

**Fix recommendation:** Not a blocker for this deliverable. If the team wants the stricter 44px bar enforced, that's an app-wide button-system pass, not a one-view fix — worth a separate ticket to Bezalel/Harmonia covering `.dt-btn` and its siblings across every view that shares the pattern, rather than fixing it piecemeal here.

### [Informational, out of scope] Sidebar defaults open at mobile width, overlaying the dashboard

**Where:** App shell `Sidebar.tsx` / `useSidebarPrefs.ts` (not in this deliverable's changed-file list).

**What:** At 375px width, first paint shows the full navigation sidebar open over the entire page, including the Trainingsdashboard content underneath (see `mobile-375-sidebar-default-open.png`). A user must tap the collapse icon to see the dashboard. This is shared app-shell infrastructure used by every route, not something Bezalel added or changed for darts-training — I'm not gating this module on it, but flagging it for team awareness since it affects the real first-paint mobile experience everywhere, not just here.

**Cited rule:** N/A — observational, routed for awareness rather than as a finding against this deliverable.

**Fix recommendation:** If this is worth fixing, it belongs to whoever owns `Sidebar.tsx`/`useSidebarPrefs.ts` as an app-wide task, not to this gate.

## Verified PASS

- **0 hardcoded hex / GL-003(Cockpit)-token compliance.** `darts-training.css` (70 `var()` references) and `DartsTrainingView.tsx` (3 inline `var()` references) resolve to 20 distinct tokens, every one of them defined in `index.css`'s dark AND light theme blocks. No hardcoded color anywhere in either file.
- **Contrast (WCAG 1.4.3, AA, 4.5:1 body text).** Computed actual rendered sRGB contrast (not claimed token values) for every text/background combination used in this view, both themes:
  - Dark: fg-muted/surface-1 10.5:1, fg-subtle/surface-1 5.2:1, accent-marker-text/surface-1 5.9:1, accent-marker-text/accent-marker-soft(composited) 5.1:1, status-error-text/surface-2 5.0:1 — all pass.
  - Light: fg-muted/surface-1 8.7:1, fg-subtle/surface-1 5.8:1, accent-marker-text/surface-1 5.7:1, accent-marker-text/accent-marker-soft(composited) 5.1:1, status-error-text/surface-2 4.9:1 — all pass.
- **22 exercises grouped correctly by day.** Live API response (`GET /api/cockpit/darts-training`) confirms 22 total exercises: Day 1 = 6, Day 2 = 6, Day 3 = 6, Day 4 = 4, exercise numbers 1–6 per day (1–4 for day 4). Matches the course structure.
- **Collapsed day sections are NOT tab-reachable.** Direct CDP test: collapsed the "Dag 1" section (`#section-darts-day-1`), confirmed `region.hidden === true` after the collapse transition settled, and confirmed a **programmatic** `.focus()` call on the first of its 12 interactive descendants failed (`document.activeElement` fell back to `<body>`). The shared `Collapsible` primitive (`components/disclosure.tsx`) applies the native `hidden` attribute at rest, which correctly removes descendants from the tab order per spec — verified live, not just read from source.
- **Score chart accessibility.** `role="img"` on the chart container carries a computed summary label (session count, first/last value + date, min/max, unit) built from the real dataset — not a static string. A same-data `<table className="sr-only">` (verified `.sr-only` uses the standard clip-based visually-hidden technique, not `display:none`, so it stays in the a11y tree) sits immediately below with proper `<caption>`, `scope="col"` headers, and one row per session. Confirmed via source read; live verification wasn't possible because no exercise in the current dataset has 2+ scored sessions yet (fresh course import) — the empty-chart state ("Nog geen sessie met een score…") is what's live today, and that state is itself correct.
- **Four card states, all present and visually distinct:** never-logged (`GEDAAN: nog nooit gedaan`, styled with `.is-never` in the marker-text color), single scorepoint (sparkline intentionally withheld below 2 points per the file's stated "honesty rule"; an explicit note appears when the Voortgang panel is opened on a 1-point series), multi-session (sparkline + full stats), and note-missing-on-disk (`noteAvailable: false` renders "De notitie van deze oefening staat niet op schijf." in place of the log button, distinct from the "loggen staat uit" disabled-write message).
- **Focus retention after logging a session.** Live CDP interaction (desktop, real form fill + submit against a temporary isolated server instance): opening the form moves focus to the Datum field; after a successful save the form unmounts and focus lands back on the "Sessie loggen" trigger button (confirmed via `document.activeElement`), with the `role="status"` confirmation text announced. No lost focus, no focus stranded on an unmounted node.
- **No horizontal overflow at any tested breakpoint.** `document.documentElement.scrollWidth === window.innerWidth` at 375px, 768px, and 1280px, confirmed via CDP measurement (the reliable method per SOP-005's documented pitfall with the CLI `--screenshot` flag).
- **Log form reflows correctly on mobile.** `auto-fit, minmax(140px, 1fr)` collapses all fields (Datum/Score/Eenheid/Uitslag/Notitie) to a single column at 375px with no clipping or truncation — confirmed visually (`form-open-mobile-375.png`).
- **Form labels, hints, and error state.** Every input has a real `<label htmlFor>`; the score field's helper text is wired via `aria-describedby`; the error message uses `role="alert"` with an `aria-hidden` icon. `dt-form-error` color (`--status-error-text`) passes contrast in both themes (checked above).
- **Architecture claim verified functionally, twice.** (1) Direct module call to `logExerciseSession()` against a real, git-tracked note file (`dag-1-oefening-1-bulls-basic.md`) — session appeared immediately in a fresh `getTrainingDashboard()` read AND in the already-running production dev server on port 4317 (no restart, mtime-cache invalidated correctly). (2) End-to-end through the actual HTTP route + form UI on a temporary isolated server instance (port 4318, `WORKBENCH_WRITE_ENABLED=1`) — same result. Confirmed **no INSERT ever reaches `darts_exercise_logs`**; the write is a markdown-only append, exactly as documented in the file's own header comment. Both test writes were reverted via `git checkout --`; `git status` on `PKM/My Life/Darts Exercises/` is clean — **zero residue left in the real notes.**
- **Unit tests.** `node --test server/dartsTrainingApi.test.mjs` — 21/21 pass (parser fidelity vs. the Python regen script, writer/injection defence, path jail, calendar validation).
- **`aria-expanded`/`aria-controls` wiring** on every disclosure trigger (log form toggle, Voortgang toggle, Section headers) is present and correct.

## Verdict

**CONDITIONAL PASS.** One HIGH finding (`.dt-card-link` tap target below the WCAG 2.2 AA 24×24 CSS px floor) needs a trivial CSS fix — add padding — before this fully clears the gate. Route back to Bezalel for that one change; Nemesis re-inspects once applied, per the gate's standing rule (no second-hand confirmation on a fix). Everything else — token compliance, contrast, the four card states, collapsed-section keyboard exclusion, chart dual-modality, responsive reflow, focus retention, and the markdown-only write architecture with zero residue — is verified PASS, most of it through live interaction rather than source reading alone.

## Evidence

Screenshots and raw CDP measurements: `Deliverables/2026-08-19-darts-training-view-qa-assets/`

---

## Re-inspection addendum — 2026-08-19, later same day

**Trigger:** Bezalel's fix attempt crashed mid-edit (Mac slept, agent session terminated before the write landed). Hermes applied the fix directly to `Expansions/mypka-cockpit/web/src/views/darts-training.css` to avoid blocking on a restart:

```css
.dt-card-link {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  padding: 6px 4px;
  font-size: 0.8125rem;
  color: var(--fg-subtle);
  text-decoration: none;
  border-bottom: 1px solid transparent;
}
```

Per standing rule ("no second-hand confirmation on a fix"), I re-inspected live rather than trusting the diff.

### Methodology note — the fix was correct in source, but initially invisible in my first measurement pass

My first live measurement (against the already-running server on port 4317, PID 54647, the same production instance noted in the original report) showed the link **still at 95.17 × 21.72 CSS px — unchanged**, computed `padding: 0px`. That was not a fix failure: `curl` of that server's `index.html` showed it serves hashed `/assets/index-*.js` and `/assets/index-*.css` — a **pre-built `dist/` bundle**, not live source. `stat` confirmed `dist/` was built at **19:13**, while the CSS edit landed at **20:35** — over an hour after the build. Port 4317 is a static/production server with no watcher; it will keep serving the pre-fix bundle until someone runs `npm run build` (or equivalent) in `Expansions/mypka-cockpit/web/`. **This is a live-deployment gap, not a code gap** — flagging it below as its own item.

To test the actual source, I started a throwaway `vite` dev server on an unused port (`5199`, `--strictPort`) rather than touching the running :4317 process — same isolated-sibling pattern as the original inspection's write-mode test. `vite.config.ts` proxies `/api` to :4317, so this dev instance ran against real data with zero risk to the live process. Torn down after the test (`pkill -f "vite --port 5199"`, confirmed port free).

### Live re-measurement against actual source (port 5199)

`getBoundingClientRect()` via a headless-Chrome/CDP script (puppeteer-core against the installed Chrome.app, not the flaky CLI `--screenshot` method), five sampled cards per breakpoint, at 375px / 768px / 1280px:

| Breakpoint | `.dt-card-link` box | Computed padding | `display` |
|---|---|---|---|
| 375px | 103.17 × 33.72 CSS px | `6px 4px` | `flex` (was `inline-flex`; browser reports the shorthand `flex`) |
| 768px | 103.17 × 33.72 CSS px | `6px 4px` | `flex` |
| 1280px | 103.17 × 33.72 CSS px | `6px 4px` | `flex` |

Both dimensions now clear the WCAG 2.2 SC 2.5.8 24×24 CSS px minimum with comfortable margin (33.72px height is +9.72px over the floor), consistently across all three breakpoints — no responsive regression, no viewport where it drops back down.

### Regression checks

- **No overlap with `.dt-btn` in the same action row.** At all three breakpoints the row's `flex-wrap: wrap` puts `.dt-btn` and `.dt-card-link` on separate lines (verified via full rects, not just x-ranges — at 1280px their x-spans visually overlap but their y-spans do not: `.dt-btn` bottom edge 842.58, `.dt-card-link` top edge 850.58, an 8px gap). No visual collision at any width.
- **No card/row height regression.** Row height (`.dt-card-actions` rect) is identical before and after the fix at 375px — 63.84 CSS px both times — because `.dt-btn` (34.72px tall) was already the tallest sibling in the row; the link growing from 21.72px to 33.72px doesn't push the row taller. Card grid rhythm is unaffected.
- **No horizontal page overflow introduced.** `document.documentElement.scrollWidth === window.innerWidth` held at 375 / 768 / 1280px.
- **Focus ring intact and unclipped.** Tabbing to `.dt-card-link` and inspecting `document.activeElement`: outline renders as `2px solid` in the accent-marker color with `2px` offset at all three breakpoints, matching the pre-existing `:focus-visible` rule (unchanged by this fix). Walked the ancestor chain for `overflow: hidden/clip/scroll/auto` — none found, so the ring has room to render fully outside the box, nothing clips it.
- **Color/contrast unaffected.** The fix only touches `padding`; `color: var(--fg-subtle)` is unchanged, so the contrast figures already verified PASS in the original report (5.2:1 dark / 5.8:1 light) still hold — no re-measurement needed, no code path changed that would affect it.

### New finding — [MEDIUM, operational, not a code defect]

**The live production server at `localhost:4317` is serving a stale build (from 19:13) that predates this fix (20:35).** Anyone opening the "real" running Cockpit right now still sees the broken 95×22px tap target, because `dist/` hasn't been rebuilt. This isn't a code-quality finding against Bezalel/Hermes's CSS — the source is correct — but it means the fix isn't actually live yet. **Action needed before this is considered shipped:** run the build (`npm run build` in `Expansions/mypka-cockpit/web/`) and restart/redeploy whatever serves `dist/` on :4317. Routing this to whoever owns that deploy step (Bezalel or Daedalus, per Hermes's call) — Nemesis doesn't run builds or restart production processes.

### Verdict

**PASS**, conditional only on the one operational step above (rebuild + redeploy `dist/`) — not on any further code change. All findings from the original CONDITIONAL PASS report remain valid and unaffected by this one-property CSS change: token compliance, contrast, four card states, collapsed-section keyboard exclusion, chart dual-modality, responsive reflow (no overflow), focus retention, and the markdown-only write architecture. The `.dt-btn` 35px-vs-44px MEDIUM note stands as previously scoped (pre-existing app-wide pattern, not a blocker). The sidebar-default-open informational item stands as previously scoped (out of this module's blast radius).

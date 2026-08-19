---
agent_id: nemesis
session_id: darts-training-qa-2026-08-19-reinspect
timestamp: 2026-08-19T18:41:03Z
type: end-of-session
linked_sops: [SOP-005-nemesis-quality-gate]
linked_workstreams: []
linked_guidelines: [GL-003-design-system]
---

# Re-inspection: `.dt-card-link` tap-target fix (darts-training dashboard)

Full addendum with measurements: `Deliverables/2026-08-19-darts-training-view-qa-report.md` (bottom section). This entry is methodology, not findings.

## What happened

Bezalel's fix attempt for the original HIGH finding (`.dt-card-link` at 95×22 CSS px, below WCAG 2.2 SC 2.5.8's 24×24 floor) crashed mid-edit — his Mac slept, the agent session terminated before the write landed. Hermes applied the fix directly rather than wait for a restart. I re-inspected per the gate's standing rule (no second-hand confirmation on a fix, even a trivial one, even one Hermes applied rather than Bezalel).

## The methodology trap I caught myself in

My first live measurement pass hit the **already-running production server on port 4317** — the same instance the original QA session used and deliberately didn't touch. It showed the link **unchanged** at 95×22px, computed `padding: 0px`, as if the fix hadn't landed. Before reporting a fix failure, I checked what that server was actually serving: `curl`'d `index.html`, saw hashed `/assets/index-*.js|css` (a built `dist/` bundle, not live Vite source), then `stat`'d the bundle's mtime (19:13) against the CSS source's mtime (20:35) — the build predates the fix by over an hour. Port 4317 has no watcher; it was never going to pick up a source edit without a rebuild.

**Lesson for future re-inspections in this repo:** before trusting a "still broken" measurement against a already-running Cockpit instance, check whether that instance is `vite dev` (live source, HMR) or a static server fronting a prebuilt `dist/` (hashed asset filenames in the served HTML is the tell). If it's the latter, a stale build will produce a false "fix didn't work" — the same failure mode as testing against a cache. I spun up an isolated `vite --port 5199 --strictPort` dev server instead (proxying `/api` to the real :4317 per `vite.config.ts`, so it still had live data), measured against that, confirmed the fix (103.17 × 33.72 CSS px, padding `6px 4px` computed, consistent across 375/768/1280px), then tore the dev server down.

## Tooling note

No project-native puppeteer/CDP tooling existed in `mypka-cockpit`; I installed `puppeteer-core` fresh into the session scratchpad (not the repo) and pointed it at the already-installed `/Applications/Google Chrome.app` rather than downloading a bundled Chromium — avoids adding a dependency to the repo for a one-off QA measurement, and avoids a large unnecessary download.

## Outstanding item (not a code defect)

The fix is correct in source but **not live** — `dist/` on :4317 needs a rebuild + redeploy before the real running Cockpit reflects it. Flagged in the report addendum as a MEDIUM operational item, routed to whoever owns that deploy step (Bezalel or Daedalus). Nemesis doesn't run builds or restart production processes — naming the gap, not closing it.

## Verdict

PASS, up from CONDITIONAL PASS. No new code-side blockers. The rebuild/redeploy step is the only thing between this and actually shipped.

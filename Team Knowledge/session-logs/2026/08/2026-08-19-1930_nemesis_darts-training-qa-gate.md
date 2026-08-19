---
agent_id: nemesis
session_id: darts-training-qa-2026-08-19
timestamp: 2026-08-19T19:30:00Z
type: end-of-session
linked_sops: [SOP-005-nemesis-quality-gate]
linked_workstreams: []
linked_guidelines: [GL-003-design-system]
---

# Quality gate: Dartstraining dashboard (`#/darts-training`)

Full report with findings and evidence: `Deliverables/2026-08-19-darts-training-view-qa-report.md`. This entry is methodology and patterns worth the team's attention, not the findings themselves.

## Brand/design-system scope gap worth naming

GL-003's brand registry (§3) only covers the four client ventures (ADC Regio Oost, DartsCoaching.nl, Dart Buddies, Van Gewoon Sander). myPKA Cockpit is Sander's own internal admin tool and isn't one of them — there's no brand file for it, and per GL-003 §1 I'm not supposed to guess a brand. I resolved this by treating the Cockpit's own `index.css` token system ("GL-003 v5 INKLINE", cited in that file's own header) as the reference, consistent with how the Team Tasks gate on 2026-08-19 handled the same situation ("alle GL-003-tokens" in that session-log referred to the same Cockpit CSS variables, not a brand file). This works as a pragmatic precedent but it's an unwritten convention — if Cockpit-internal QA keeps coming up, it might be worth Harmonia writing a short explicit note (in GL-003 itself, or a sibling doc) saying "myPKA Cockpit's own token system in `index.css` is the design-system-of-record for Cockpit-internal views; the brand registry in §3 is for client-facing ventures only." Flagging rather than doing it myself — that edit belongs to Harmonia per GL-003 §4's "edits to any brand file are Harmonia-only" spirit, even though `index.css` isn't technically a brand file.

## Methodology notes

- **Live interaction beat source-reading for every claim that mattered.** Reading the code gave me a hypothesis (e.g. "the Collapsible primitive should exclude collapsed content from tab order via the `hidden` attribute"); a live CDP test against the actual running app confirmed it (programmatic `.focus()` on a descendant of a collapsed region fails, falls back to `<body>`). Same pattern for the write-architecture claim: I didn't just read the header comment saying "never `darts_exercise_logs`" — I wrote a real session via the module function AND via the full HTTP+form stack on an isolated server, watched the already-running production dev server (port 4317) pick it up with zero restart, then reverted via `git checkout --` and confirmed `git status` clean. Two independent proofs, zero residue.
- **Multi-session awareness in practice.** A Cockpit dev server was already running (PID on :4317, `WORKBENCH_WRITE_ENABLED` off) when I started — presumably from an earlier session today. I never touched or restarted it. For the one test that needed write-mode (the log-form UI walkthrough), I spun up a **second, isolated instance on :4318** with its own env, tore it down afterward, and reverted the one real file it touched. This is the pattern to reuse whenever a QA gate needs write access but a live instance without write access is already up: don't restart what's running, stand up a throwaway sibling instead.
- **SOP-005's CDP screenshot method (vs. `chrome --screenshot --virtual-time-budget`) held up again** — no false-positive overflow, and it was the only way to get real `getBoundingClientRect()` numbers for the tap-target finding (a `--screenshot`-only pass would have caught this only by eyeballing pixels, if at all).
- **A HIGH finding turned out to be genuinely new, not a repeat of an existing pattern** — I specifically checked whether the tap-target issue was a pre-existing app-wide convention (it partly is, for `.dt-btn`, found in 4 other view CSS files) versus actually new (`.dt-card-link`'s zero-padding standalone-link pattern has no precedent elsewhere in the Cockpit's view CSS). Worth doing that precedent check before assigning severity — it changed my fix recommendation from "app-wide button audit" (for `.dt-btn`) to "one-line CSS fix, this file only" (for `.dt-card-link`).

## Open thread

Verdict is CONDITIONAL PASS pending a one-line CSS fix from Bezalel (`.dt-card-link` padding). Per the gate's standing rule, I re-inspect once that lands — no second-hand confirmation.

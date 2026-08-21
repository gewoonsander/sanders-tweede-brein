---
agent_id: nemesis
session_id: skills-clickable-rows-qa-2026-08-21
timestamp: 2026-08-21T19:15:00Z
type: end-of-session
linked_sops: [SOP-005-nemesis-quality-gate]
linked_workstreams: []
linked_guidelines: [GL-003-design-system]
---

# QA: klikbare domain-skill rijen op `#/skills` (myPKA Cockpit)

Full report: `Deliverables/2026-08-21-skills-clickable-rows-qa-report.md`. This entry is methodology + a recurring pattern worth flagging, not the findings themselves.

## What happened

Reviewed Bezalel's change making domain-skill rows (`/ndb-regels`, `/wdf-regels`, etc.) clickable in `SkillsView.tsx`, alongside the new nullable `repoRelativeFor()` in `FileView.tsx` (skips `DiscussButton` for skill files, which live outside the repo) and the new `skill:` route codec in `router.ts`. Verdict: PASS. Full findings in the report.

## Recurring pattern confirmed again — stale production port 4317

Third time now (after the 2026-08-19 Team Tasks/Skills and Darts Training gates) that the running Cockpit on :4317 predates the changes under review. This time it wasn't just a stale `dist/` build — the running **Node process itself** (`server.js`, PID unchanged since 11:25) never loaded the new `server/skillFileApi.js` route at all, so a click-test against :4317 would have 404'd on the new API route entirely, not just shown a stale UI. Same fix as before: spin up an isolated instance on an unused port with the same env vars the real launcher (`start-cockpit.command`) sets, test against that, tear it down after. Confirmed via `ps -o lstart` (process start time) vs. `git show <commit> -- server.js` (commit time) — a more direct check than the `dist/` mtime comparison used previously, and it generalizes to server-side changes that a frontend rebuild alone wouldn't surface.

**Worth flagging to the team:** this is now a *third* independent QA session tripping over the same stale-:4317 trap. If Cockpit development keeps generating same-day multi-hour sessions, it might be worth Daedalus/Bezalel adding a "last route registration timestamp" or process-start-time readout to the Cockpit's own boot log (it already logs `SKILL_FILES_ON` etc.) so a QA session — or Sander himself — can eyeball staleness without doing the `ps`/`git show` cross-check by hand each time. Not doing this myself (not my lane, and it's a suggestion not a finding against this deliverable), but naming it since three repeats is a pattern, not a coincidence.

## Also found, out of scope for this gate

Slash-command file rows (`.claude/commands/*.md`) have apparently 404'd system-wide since before today's diff — confirmed identical on both the isolated instance and production :4317, and confirmed via `git show` that today's `server.js` diff never touches the `/api/cockpit/file` dispatcher. Flagged in the report as informational, routed for team awareness, not blocking this gate.

## Verdict

PASS. No re-inspection needed (no fix was required).

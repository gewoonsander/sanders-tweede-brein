# Deliverables

Where the team puts work-in-progress and finished artifacts the user can review.

When a specialist produces something substantial - a research brief, a draft document, a hire workup, a multi-file plan - it lands here, not in PKM. Deliverables is the team's working surface: time-stamped, often dated by folder, often created and discarded across sessions.

## When to use it

- **Athena** delivers a research report -> `Deliverables/YYYY-MM-DD-<topic-slug>.md`
- **Jethro** delivers a hire workup -> `Deliverables/YYYY-MM-DD-<role-slug>-hire-research.md`
- A new specialist delivers a multi-file project -> `Deliverables/YYYY-MM-DD-<project-slug>/`
- **Hermes** collects briefs from multiple specialists for a single initiative -> one folder per initiative, named by date and slug

## When NOT to use it

- Personal life facts (people, projects, goals, habits) -> `PKM/`
- Daily journal entries -> `PKM/Journal/`
- Reference material the team needs forever (SOPs, Workstreams, Guidelines) -> `Team Knowledge/`

Naming convention: see `Team Knowledge/Guidelines/GL-001-file-naming-conventions.md`.

## Every Deliverable is anchored, not loose

As of 2026-08-13, every Deliverable's frontmatter carries a required `key_element` and an optional `project` field — see the Deliverable entity schema in [[GL-002-frontmatter-conventions]]. This isn't optional bookkeeping: it's what stops this folder from becoming a warehouse of disconnected files. Before writing a new Deliverable, check whether a living PKM note (a Topic, Goal, or Habit) already covers the same ground — if one does, update that note instead of creating a redundant Deliverable next to it.

## Archiving

A Deliverable owned by a task archives automatically when that task closes, per [[GL-004-task-resource-linking]] — to `Deliverables/_archive/YYYY/MM/<original-slug>`. A Deliverable with no owning task ("orphan") does not archive on its own; [[SOP-020-losstaand-deliverable-archiveren]] defines the criteria, and [[WS-008-deliverables-en-projecten-audit]] runs the periodic (quarterly), human-gated pass that proposes and executes it. Nothing archives without your approval.

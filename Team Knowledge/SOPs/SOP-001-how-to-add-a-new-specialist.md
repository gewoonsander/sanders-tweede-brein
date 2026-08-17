# SOP-001 - How to Add a New Specialist

- **Default owner:** Jethro
- **Reusable by any agent.** This is a skill, not a 1:1 ownership. SOPs are procedures any agent can invoke when they need them. Jethro is the default executor for hiring, but any specialist running the procedure (e.g. when bootstrap mode re-engages and Jethro isn't available) follows the same steps.
- **Co-owner for research step:** Athena
- **Triggered by:** user request to hire, or Hermes detecting a gap
- **References:** [[GL-001-file-naming-conventions]], [[GL-002-frontmatter-conventions]], [[GL-015-agent-model-tier-review]], [[Team/agent-index]]

## Pre-hired team

**Hermes, Jethro, Athena, Penn, Daedalus, and Atlas ship pre-hired with the scaffold.** SOP-001 governs hiring everyone beyond these six. Do not re-run SOP-001 to "create" any of the six — they already exist. SOP-001 is for the seventh hire onward.

## Purpose

Add a new specialist to the team in a way that keeps the routing table clean, the AGENTS.md contracts consistent, and the SSOT Golden Rule intact. Every hire gets a world-class research brief from Athena before Jethro drafts the contract - this is how the team avoids generic, AI-flavored specialists and ships ones that mirror what the best humans in that role actually do.

## Steps

### 1. Capture the need (Hermes -> Jethro)

Hermes routes the hiring request to Jethro with a one-sentence brief: what the new specialist will do that no current specialist can. If Jethro cannot finish that sentence with the user, the role is not ready.

### 2. Brief Athena for the research pass (Jethro -> Athena)

Jethro writes a research brief to Athena. Required questions:

- What does the best-in-world version of this specialist actually do, day to day?
- What are the core competencies, and what are the anti-patterns (things mediocre versions of this role do that the team should explicitly avoid)?
- What deliverables does this role produce? What does world-class output look like vs adequate output?
- What boundaries should this role hold? What requests should they refuse or hand back?
- Suggested name candidates (short, distinct, single word, no collision with existing team).

Athena returns a brief sized to the role - usually 400 to 800 words - cited if the research warranted it. The brief lands in `Deliverables/YYYY-MM-DD-<role-slug>-hire-research.md`.

### 3. Pick a name and role (Jethro)

Using Athena's brief, pick:

- **Name:** short, distinct, single word. From Athena's candidates or a variant. Avoid collisions with existing names.
- **Role:** one short phrase. Example: "Frontend Developer" or "Email Marketer."
- **Folder:** `Team/<Name> - <Role>/` (space, hyphen, space). Matches the pattern of the six pre-hired specialists.

### 4. Draft the AGENTS.md (Jethro)

Create `Team/<Name> - <Role>/AGENTS.md`. Translate Athena's research brief into a contract with these sections:

- **Identity** - name, role, who they report to, operating principle (drawn from Athena's "what world-class does day to day").
- **When Hermes routes to them** - the cue patterns.
- **Method or protocol** - how they work, in steps (drawn from Athena's "deliverables and what world-class looks like").
- **Deliverable structure** - what their output looks like.
- **Where they write** - paths and naming. Reference [[GL-001-file-naming-conventions]] for naming.
- **Cross-references** - Guidelines and Workstreams they touch.
- **Scope boundaries** - what they do not do (drawn from Athena's "anti-patterns" and "boundaries").

Keep it short. The shipped four are the template. Do not paste Athena's research brief into the AGENTS.md - the brief stays in `Deliverables/`. The contract references it via `[[wikilink]]` if useful.

### 5. Draft the host subagent shim(s) (Jethro)

**Mandatory for every hire, in every host the user has activated.** Without the shim, Hermes can only role-play the new specialist within the main context — Hermes cannot dispatch them as a parallel subagent via the host's agent-tool. The shim is what binds the wiki contract to the host runtime.

The principle is host-agnostic: a thin pointer to the wiki contract, never a copy of it. The exact path and frontmatter convention is host-specific:

| Host | Shim path | Frontmatter convention | Detect host activation by |
|---|---|---|---|
| Claude Code | `.claude/agents/<slug>.md` | YAML: `name`, `description`, `tools` | presence of `CLAUDE.md` at root |
| Codex CLI | `.codex/agents/<slug>.md` (if supported by active version) — otherwise add a one-line specialist roster note in `AGENTS.md.codex` | per Codex spec at hire time | presence of `AGENTS.md.codex` at root |
| Gemini CLI | per Gemini spec (e.g. `.gemini/extensions/<slug>/`) | per Gemini spec | presence of `GEMINI.md` at root |
| Cursor | n/a — Cursor lacks per-specialist parallel dispatch in the standard product. Add a one-line note in `.cursor/rules/main.md` | n/a | presence of `.cursor/rules/main.md` |
| Chat-only LLM | n/a — single context, hat-switching only | n/a | tool-specific pointer file absent |

When hiring:

1. Detect which hosts the user has activated by checking for the tool-specific pointer files listed above.
2. For each activated host that supports parallel subagent dispatch, write the shim at the host's standard path.
3. For activated hosts that don't support parallel dispatch, add a one-line note in that host's tool-specific pointer file: "Specialist `<Name>` runs as a hat-switch within the main context — host does not support parallel subagent dispatch."

Structural template (Claude Code example — translate the frontmatter conventions for other hosts as their specs require):

```markdown
---
name: <slug>
description: <Role>. Use proactively when <trigger patterns>. Owns <relevant SOP/WS>.
tools: <minimal-tool-list>
model: <concrete model resolved from the tier — see step 5b. NEVER omit this line>
---

You are **<Name>, <Role> of myPKA**. <One-line operating principle.>

## On every invocation, in order

1. Read `Team/<Name> - <Role>/AGENTS.md` — your full operating contract.
2. Read `AGENTS.md` at the folder root for the identity overlay and hard rules.
3. Read <relevant SOPs / Workstreams / Guidelines> when the task involves them.

## Cold-start briefing rule

Fresh context every invocation. Hermes must hand you <list of inputs the role needs>. If the brief is missing critical info, ask Hermes one tight clarifying question before acting.

## Operating discipline

- <2-5 hard rules drawn from Athena's anti-patterns and the wiki contract>

## Return format to Hermes

- <Status line shape>
- <Counts / paths / structured findings>
- <Anomalies and open questions>
```

Rules (host-agnostic):

- **Never paste the wiki contract into the shim.** The shim references the contract via path. Three layers (`Team/<Name>/AGENTS.md` + a per-folder host-pointer file + project-root host shim) violates SSOT. Two layers is the contract: wiki canonical, shim host-specific.
- **The shim's `tools:` (or host equivalent) is minimal.** Penn doesn't need `Bash`. Athena mostly needs `WebFetch` / `WebSearch`. Trim to what the role actually uses.
- **The shim's `description:` (or host equivalent) reads as routing instruction for Hermes.** Lead with the role, then "Use proactively when…", then the owned SOP/Workstream.
- **The shim's body is short.** ~30-50 lines. The contract carries the depth.
- **The shim shape is the same across hosts** — only the file path and frontmatter format change. The body sections (identity, files-to-read-on-invocation, cold-start briefing rule, operating discipline, return format to Hermes) are identical regardless of host.

Use any existing shim (`.claude/agents/atlas.md`, `.claude/agents/penn.md`, etc.) as the structural template for the body — adapt the frontmatter to the host's spec.

### 5b. Assign the model tier (Jethro)

**Mandatory. The hire is not complete without it.** A shim with no model field inherits the main session's model, so a mechanical specialist silently runs on the heaviest tier available. That is the exact leak [[GL-015-agent-model-tier-review]] exists to close, and omitting this step is how it reopens.

Two artifacts, two notations — do not mix them up:

| Artifact | Field | Value |
|---|---|---|
| `Team/<Name> - <Role>/AGENTS.md` (contract) | `model:` | Portable tier alias: `reasoning`, `balanced`, or `fast`. Stays provider-neutral per [[GL-002-frontmatter-conventions]]. |
| `.claude/agents/<slug>.md` (shim) | `model:` | The concrete model the host resolves that alias to. |

Pick the tier by asking one question: **what happens if this specialist gets it slightly wrong?**

| Tier | Assign when | Typical work |
|---|---|---|
| `reasoning` | An error is expensive or hard to detect — it corrupts data, ships a security hole, or breaks an integration | Schema and migration work, API/OAuth wiring, code that others build on, security audits |
| `balanced` | Judgment is needed but errors surface quickly in review | Research and cross-verification, QA passes, design-system authoring, drafting correspondence |
| `fast` | The work follows a fixed template or procedure step by step, and deviation is immediately visible | Capture against a template, layout from existing tokens, procedural execution of an SOP, triage fan-out |

When in doubt, start one tier lower than instinct says. Under-tiering surfaces as visibly weaker output and is corrected in one edit; over-tiering is invisible and is paid for on every single invocation.

Record the new specialist and the chosen tier in the tiering table of [[GL-015-agent-model-tier-review]] in the same pass. A tier that only lives in the shim frontmatter is invisible at the next review.

### 6. Add the row to agent-index (Jethro)

Edit [[Team/agent-index]]. Add a row with the specialist's name, role, folder link, and the user input patterns that should route to them.

### 7. Update relevant Workstreams (Jethro)

If the new specialist takes part in a recurring orchestration, edit the matching Workstream in `Team Knowledge/Workstreams/` to mention them via `[[wikilinks]]`. Do not duplicate the AGENTS.md content into the Workstream.

### 8. Confirm with the user (Jethro -> Hermes -> user)

Show the user the draft AGENTS.md, the draft `.claude/agents/<slug>.md` shim, and the updated agent-index, with a one-line summary of what Athena's research surfaced. Make changes only after they approve.

### 9. Refresh and verify the Cockpit roster (Atlas)

After the user approves and the contract is set to `agent_status: active`:

1. Regenerate the derived Cockpit mirror with `python3 "Expansions/mypka-cockpit/scripts/regen-mypka-db.py"` when the Cockpit Expansion is installed.
2. Run `python3 "Expansions/mypka-cockpit/sqlite-extension/detect-gaps.py" "mypka.db"`.
3. The hire is not complete until the roster parity check reports that every active `Team/<Name - Role>/AGENTS.md` contract exists exactly once in the Cockpit `agents` table and no stale active database row remains.
4. If regeneration is unavailable, report the hire as active in markdown but Cockpit-sync as blocked; never imply the dashboard is current.

Markdown contracts remain canonical. `mypka.db` is only a regenerated projection.

### 10. Log the hire (Hermes)

Hermes writes a line in the next session log: "Hired <Name> as <Role> after research from Athena. Brief at `[[<research-deliverable-slug>]]`. Contract at `[[Team/<Name> - <Role>/AGENTS]]`. Shim at `.claude/agents/<slug>.md`." This becomes part of the team's persistent memory.

## Common mistakes to avoid

- Skipping the Athena research step. Even for "obvious" roles, the research surfaces anti-patterns that prevent generic specs.
- Pasting Athena's research brief into the AGENTS.md. The brief is reference material in `Deliverables/`. The AGENTS.md is the contract.
- **Shipping a shim without a `model:` field.** The specialist then inherits the main session's model and runs at the heaviest tier on every invocation, silently and indefinitely. See step 5b. This is the single most expensive omission in this SOP because nothing about it is visible in the output.
- **Recording the tier only in the shim and not in [[GL-015-agent-model-tier-review]].** The next review reads the Guideline table, not sixteen frontmatter blocks, so an unlisted specialist is never re-evaluated.
- **Shipping the wiki contract without the matching host subagent shim(s).** The two artifacts go together for every activated host (Claude Code, Codex CLI, Gemini CLI). Without the shim, Hermes can only role-play the new specialist — not dispatch them as a parallel subagent in that host.
- **Treating this as a Claude-only setup.** The principle is host-agnostic. Only the shim path and frontmatter convention is host-specific.
- **Pasting the wiki contract into the host shim.** The shim references the contract via path. Don't duplicate.
- **Creating a per-host pointer file (`CLAUDE.md`, `GEMINI.md`, `AGENTS.md.codex`) inside `Team/<Name>/`.** Three layers violates SSOT. Two layers is the rule: wiki contract (host-agnostic) + shim (host-specific, project-root location).
- Duplicating naming rules inside the new AGENTS.md. Link to [[GL-001-file-naming-conventions]] instead.
- Naming the folder with a different separator than other specialists. Always: space, hyphen, space.
- Forgetting to add the row to [[Team/agent-index]]. Hermes's routing will skip an unlisted specialist.
- Forgetting to regenerate and parity-check the Cockpit roster. A specialist can be active in markdown while remaining invisible in a stale `mypka.db`.
- Writing the AGENTS.md in the user's voice instead of as a contract. The file is for the LLM, not the reader.

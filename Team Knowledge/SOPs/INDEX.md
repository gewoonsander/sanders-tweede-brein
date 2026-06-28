# SOPs - Index

**SOPs are agent skills.** Each SOP is a canonical procedure — a step-by-step recipe for one job. They are LLM-agnostic and reusable across agents: an SOP has a **default owner** (the specialist who runs it most often), but any agent can invoke an SOP when they need its procedure. Think of SOPs the way Claude skills work — discrete, named, callable.

Filename pattern: `SOP-NNN-<title>.md`. See [[GL-001-file-naming-conventions]] for slug rules. Numbering follows authorship order, not topic — gaps are intentional and reserve slots for future agents.

## Active SOPs

| SOP | Title | Default owner | Description |
|---|---|---|---|
| SOP-001 | [[SOP-001-how-to-add-a-new-specialist]] | Nolan | Step-by-step procedure to draft and onboard a new team specialist. References [[GL-001-file-naming-conventions]]. |
| SOP-002 | [[SOP-002-convert-mypka-to-sqlite]] | Silas (run by the user via paste-into-LLM prompt) | Generate a SQLite mirror of your myPKA on demand. Markdown stays canonical; SQLite is a derived performance layer. Body is a paste-into-LLM prompt. |
| SOP-003 | [[SOP-003-felix-build-a-component]] | Felix | Design-system-aware UI component build: read the spec, scaffold with semantic tokens, type every prop, handle all states, verify visually, hand off to Vera. |
| SOP-004 | [[SOP-004-vex-security-audit]] | Vex | Structured security audit in vier fases: credential hygiene, authorization, integration surfaces, GDPR/data-handling. Produces severity-tagged findings report with proof-of-exploit. |
| SOP-005 | [[SOP-005-vera-quality-gate]] | Vera | Visuele + accessibility + responsive QA gate. Zes fases, screenshot-evidence, WCAG 2.2 AA, design-system enforcement. Niets shippet zonder PASS. |
| SOP-010 | [[SOP-010-adc-inschrijvingen-opvragen]] | Larry (via Mack) | Live inschrijvingen ophalen van Dart Atlas voor ADC Regio Oost. Triggered by vragen als "hoeveel mensen doen mee" of "update ADC-toernooien". |

| SOP-006 | [[SOP-006-author-a-design-system]] | Iris | Stap-voor-stap procedure om een visueel design system te schrijven en te onderhouden in GL-003. |
| SOP-007 | [[SOP-007-audit-content-for-design-system-compliance]] | Iris | Audit bestaande content op naleving van het design system (GL-003). |
| SOP-008 | [[SOP-008-build-an-infographic]] | Charta | Bouw een infographic op basis van het design system en een content-brief. |
| SOP-009 | [[SOP-009-generate-a-styled-image]] | Pixel | Genereer een gestileerde afbeelding conform GL-003 via een externe image-generator. |

*Reserved (genuinely open for future agents):* SOP-011+ (next free slot). Do not back-fill existing numbers without coordinating across the team.

## How to add a new SOP

1. Pick the next unused number (`SOP-NNN`) — by authorship order, not topic. Don't reuse reserved numbers.
2. Filename: `SOP-NNN-<kebab-case-title>.md`.
3. Header includes the default owner, status, triggers, references, and an explicit "Reusable by any agent" note — the SOP is a skill, not 1:1 ownership.
4. Reference [[GL-001-file-naming-conventions]] and any other Guideline instead of duplicating its content.
5. Add a row to this index.

---
agent_id: hermes
session_id: pieter-post-onderzoek
timestamp: 2026-08-14T11:55:40Z
type: proactive
linked_sops:
  - SOP-001-how-to-add-a-new-specialist
  - SOP-022-verwerk-persoonlijke-taak
  - SOP-023-synchroniseer-persoonlijke-taak-naar-todoist
linked_workstreams: []
linked_guidelines:
  - GL-012-pkm-vs-todoist
  - GL-014-todoist-taakformat
  - GL-019-persoonlijke-taakarchitectuur
---

# Pieter Post aangenomen als Emailregisseur

Sander keurde op 14 augustus 2026 het definitieve contract goed. Pieter Post is aangenomen als persoonlijke e-mailregisseur en interne casuseigenaar van het e-mailkanaal na onderzoek van Athena.

- Research: [[2026-08-14-pieter-post-hire-research]]
- Ontwerp: [[2026-08-14-pieter-post-gmail-todoist-design]]
- Contract: [[Team/Pieter Post - Emailregisseur/AGENTS]]
- Claude-hostshim: `.claude/agents/pieter-post.md`
- Codex-hostshim: `.codex/agents/pieter-post.md`

Hermes blijft Sanders enige aanspreekpunt. Pieter schrijft persoonlijke acties eerst canoniek naar `PKM/Tasks/`; Todoist is alleen een optionele afgeleide projectie. Verzenden, verwijderen, betalen, delen en gevoelige of financiële handelingen vereisen passende expliciete goedkeuring.

## Update — Cockpitregistratie

De oorspronkelijke hireprocedure regenereerde de Cockpit niet, waardoor Pieter aanvankelijk wel actief was in markdown maar ontbrak in `mypka.db` (14 DB-rijen tegenover 15 actieve contracten). [[SOP-001-how-to-add-a-new-specialist]] vereist nu na iedere goedgekeurde hire regeneratie plus een exacte roster-parity-check. De Cockpit-probe is uitgebreid en als periodiek vangnet opgenomen in [[WS-005-team-retro-and-self-improvement-loop]]. Na regeneratie op 14 augustus 2026: `pieter-post` actief aanwezig; 15 actieve contracten = 15 actieve DB-rijen; 0 parityproblemen.

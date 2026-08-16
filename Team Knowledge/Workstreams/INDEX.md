# Workstreams - Index

**Workstreams are multi-agent compositions.** A Workstream describes how more than one specialist (often plus the user) collaborates to deliver a recurring outcome. Where an SOP is a single-agent skill, a Workstream is the choreography that strings skills together — think of Workstreams the way Claude plugins compose skills into a flow.

Workstreams are **emergent**. The scaffold ships only the canonical flows that need to work on day one (daily journaling, external knowledge import). New Workstreams get authored by the team when a multi-agent pattern repeats — Hermes detects the pattern across session-logs and proposes the Workstream to the user.

Workstreams reference SOPs and Guidelines via `[[wikilinks]]`. They never duplicate the steps or rules those files contain.

Filename pattern: `WS-NNN-<title>.md`. See [[GL-001-file-naming-conventions]] for slug rules.

## Active Workstreams

| WS | Title | Owners | Description |
|---|---|---|---|
| WS-001 | [[WS-001-daily-journaling]] | Penn + Hermes | How daily inputs (text, image, audio) flow into Journal, Images, and CRM. References [[SOP-001-how-to-add-a-new-specialist]] and [[GL-001-file-naming-conventions]]. |
| WS-002 | [[WS-002-import-external-knowledge-base]] | Atlas (primary executor) + Daedalus (connection-half when source needs OAuth/API/MCP) + Athena (research for unfamiliar formats) | How an existing knowledge base (Heptabase, Notion, Obsidian, Roam, Logseq, Mem, Capacities, Apple Notes, Evernote, Tana via MCP, etc.) gets imported into your myPKA. Triggered by natural-language phrases (see root `AGENTS.md`). References [[GL-001-file-naming-conventions]], [[GL-002-frontmatter-conventions]], [[SOP-002-convert-mypka-to-sqlite]]. |
| WS-003 | [[WS-003-install-an-expansion]] | Hermes (orchestrator) + Argus (security gate) + Jethro (team merge) + Daedalus (connector wiring) + Atlas (integrity check) | How an Expansion folder dropped into `Expansions/` gets validated, security-reviewed, merged into the user's team (agents, SOPs, guidelines, templates), wired (env vars, MCP servers, runtimes), validated, and announced. Symmetric uninstall flow. References `Expansions/docs/expansion-spec.md`, [[GL-001-file-naming-conventions]], [[GL-002-frontmatter-conventions]], [[SOP-001-how-to-add-a-new-specialist]]. |
| WS-004 | [[WS-004-facebook-toernooi-verslag]] | Hermes (orchestrator) + Daedalus (Dart Atlas datafetch) + Penn (schrijven) | Na afloop van een ADC-toernooi: Daedalus haalt statistieken op uit Dart Atlas (winnaar, 180's, hoge finishes, volgende toernooien), Penn schrijft het Facebook-bericht voor de regiogroep. Triggered by "maak verslag [toernooi]". Referenties [[SOP-010-adc-inschrijvingen-opvragen]], [[adc]]. |
| WS-005 | [[WS-005-team-retro-and-self-improvement-loop]] | Hermes + team | Periodieke teamretro en bestuurde verbetercyclus met menselijke goedkeuring. |
| WS-006 | [[WS-006-adc-facebook-verslag]] | Penn (schrijven) + Hermes (review) | Stijlregels en volledig invulbaar template voor het ADC Facebook-toernooiverslag in Sander's stijl. Stijllaag bovenop WS-004 — invoer via [[SOP-011-adc-toernooi-analyse]]. |
| WS-007 | [[WS-007-voeding-vastleggen-en-controleren]] | Hermes + Penn + Daedalus + Atlas + Bezalel | Foto, spraak en tekst naar een compleet dagelijks voedingslogboek, mirror, dashboard en close-sessioncontrole. |
| WS-008 | [[WS-008-deliverables-en-projecten-audit]] | Hermes + genoemde uitvoerder | Kwartaal-audit van `Deliverables/` en `PKM/My Life/Projects/`: Key Element-balans, gestrande projects, dubbel werk, en voorgestelde archivering van losstaande Deliverables via [[SOP-020-losstaand-deliverable-archiveren]]. Zusje van [[WS-005-team-retro-and-self-improvement-loop]], andere focus (output i.p.v. proces). |
| WS-009 | [[WS-009-adc-facebook-vooraankondiging]] | Hermes (Dart Atlas datafetch) + Penn (schrijven) | Vóór een ADC-toernooi: aankondigingsbericht met oproep tot aanmelden en haakje naar de actuele koploper. Spiegelbeeld van WS-004 (verslag ná afloop). Automatische trigger via dezelfde 07:00-ochtendroutine. |

## When to write a new Workstream

- More than one specialist is involved.
- The activity recurs on a schedule or on a recurring trigger.
- The choreography (who hands off to whom) matters as much as the steps.

If only one specialist is involved, write an SOP instead — single-agent procedures are skills, not workstreams.
If the rule is static and never executed, write a Guideline instead.
If a Charta+Pixel handoff (or any other multi-agent pattern) repeats often enough to need codifying, that's the moment to author a new Workstream — not before.

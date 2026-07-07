# Guidelines - Index

**Guidelines are general rules every agent reads on every relevant action.** Where SOPs are skills (procedures the agent runs) and Workstreams are compositions (multi-agent choreography), Guidelines are the static rules and constraints that hold the whole system together. Naming, frontmatter, design system. SOPs and Workstreams `[[wikilink]]` to Guidelines rather than duplicating the rules.

Filename pattern: `GL-NNN-<title>.md`.

## Active Guidelines

| GL | Title | Description |
|---|---|---|
| GL-001 | [[GL-001-file-naming-conventions]] | Kebab-case rules, ISO date prefix on date-driven files, slug rules, image filename pattern. |
| GL-002 | [[GL-002-frontmatter-conventions]] | YAML frontmatter field schemas for all 8 entity types, typing rules, foreign-key convention. Aligns with [[SOP-002-convert-mypka-to-sqlite]]. |

| GL-004 | [[GL-004-task-resource-linking]] | Hoe taken gelinkt worden aan resources (SOPs, Workstreams, Guidelines, My Life, session logs, journal entries). |
| GL-010 | [[GL-010-pka-modeling-principles]] | PKA-modelleringsprincipes (custom, hernummerd van GL-003). |
| GL-011 | [[GL-011-contactenbeheer]] | Google Contacts als SSOT voor basiscontacten. PKM/CRM voor rijke context. Apparaatinstellingen vastgelegd. |
| GL-012 | [[GL-012-pkm-vs-todoist]] | Wanneer gaat iets van Todoist naar PKM? Beslisregel: actie = Todoist, duurzame kennis = PKM. Larry vraagt altijd bevestiging. |
| GL-014 | [[GL-014-todoist-taakformat]] | Todoist-taakformat: `actie > titel ⏰ tijd`, prioriteit alleen native veld, bronmateriaal-link, projectroutering. |
| GL-015 | [[GL-015-agent-model-tier-review]] | Modelkeuze per specialist (Opus/Sonnet/Haiku) en reviewcadans: kwartaal-vangnet + event-triggers (nieuw model, limieten, kwaliteit). |

| GL-003 | [[GL-003-design-system]] | Multi-merk design-system hub (cold-start brand-rule + erf-model). Verwijst naar de losse merkbestanden in `GL-003-brands/` (ADC Regio Oost, DartsCoaching.nl, Dart Buddies, Van Gewoon Sander) — geen van deze bevat nog echte waarden. Geinstalleerd via het Designer Pack. |

## When to write a new Guideline

- The rule is static and applies across many files or procedures.
- More than one SOP or Workstream needs to know about it.
- Without it, you would copy-paste the same rule into multiple files.

If you find yourself restating the same rule in two files, stop and write a Guideline. Then `[[wikilink]]` to it from both files.

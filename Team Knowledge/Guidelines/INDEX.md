# Guidelines - Index

**Guidelines are general rules every agent reads on every relevant action.** Where SOPs are skills (procedures the agent runs) and Workstreams are compositions (multi-agent choreography), Guidelines are the static rules and constraints that hold the whole system together. Naming, frontmatter, design system. SOPs and Workstreams `[[wikilink]]` to Guidelines rather than duplicating the rules.

Filename pattern: `GL-NNN-<title>.md`.

## Active Guidelines

| GL | Title | Description |
|---|---|---|
| GL-001 | [[GL-001-file-naming-conventions]] | Kebab-case rules, ISO date prefix on date-driven files, slug rules, image filename pattern. |
| GL-002 | [[GL-002-frontmatter-conventions]] | YAML frontmatter field schemas, including personal tasks, typing rules, and foreign-key convention. Aligns with [[SOP-002-convert-mypka-to-sqlite]]. |

| GL-004 | [[GL-004-task-resource-linking]] | Hoe taken gelinkt worden aan resources (SOPs, Workstreams, Guidelines, My Life, session logs, journal entries). |
| GL-010 | [[GL-010-pka-modeling-principles]] | PKA-modelleringsprincipes (custom, hernummerd van GL-003). |
| GL-011 | [[GL-011-contactenbeheer]] | Google Contacts als SSOT voor basiscontacten. PKM/CRM voor rijke context. Apparaatinstellingen vastgelegd. |
| GL-012 | [[GL-012-pkm-vs-todoist]] | myPKA is taak-SSOT; Todoist is een optionele afgeleide uitvoeringsprojectie. |
| GL-013 | [[GL-013-interactie-enkelvoudige-keuzes]] | Keuzes altijd als A/B/C met vetgedrukte letter, zonder uitzondering. |
| GL-014 | [[GL-014-todoist-taakformat]] | Todoist-taakformat: `actie > titel ⏰ tijd`, prioriteit alleen native veld, bronmateriaal-link, projectroutering. |
| GL-015 | [[GL-015-agent-model-tier-review]] | Modelkeuze per specialist (Opus/Sonnet/Haiku) en reviewcadans: kwartaal-vangnet + event-triggers (nieuw model, limieten, kwaliteit). |
| GL-016 | [[GL-016-beslis-en-waarschuwingsblokken]] | Beslissingen/blokkades/gates altijd als apart 🔶/🔴/✅-blok met unieke 3-tekens-code, gestapeld aan het einde van het antwoord. |
| GL-017 | [[GL-017-mcp-service-register]] | Portable SSOT voor MCP-services, endpoints, secretvariabelen, risicoklassen en adaptercontracten. |
| GL-018 | [[GL-018-integratie-en-software-register]] | Portable inventaris van MCP's, API's, webhooks, databronnen en software met gewenste status, kosten en veilige verificatieprofielen. |
| GL-019 | [[GL-019-persoonlijke-taakarchitectuur]] | GTD-statussen, Eisenhower, datumsemantiek, hiërarchie en wachten-op voor persoonlijke taken. |
| GL-020 | [[GL-020-informatie-invoer-uitvoer-en-levenscyclusregister]] | Portable SSOT voor technische invoerbronnen, canonieke opslag, afgeleide kopieën, back-up en informatielevenscycli. |
| GL-021 | [[GL-021-klikbare-bestandslinks]] | Elk genoemd bestand of map in een antwoord krijgt een klikbare `file://`-link met absoluut pad. |
| GL-022 | [[GL-022-financiele-koppelingen-dashboard-scope]] | Financiële data: alleen read-only, server-side Cockpit-connectors (Open-Invoices-patroon). Geen MCP-bankkoppelingen, geen browser-naar-bank-calls, geen schrijf-operaties zonder eigen ontwerp + Argus-audit. |

| GL-003 | [[GL-003-design-system]] | Multi-merk design-system hub (cold-start brand-rule + erf-model). Verwijst naar de losse merkbestanden in `GL-003-brands/` (ADC Regio Oost, DartsCoaching.nl, Dart Buddies, Van Gewoon Sander) — geen van deze bevat nog echte waarden. Geinstalleerd via het Designer Pack. |

## When to write a new Guideline

- The rule is static and applies across many files or procedures.
- More than one SOP or Workstream needs to know about it.
- Without it, you would copy-paste the same rule into multiple files.

If you find yourself restating the same rule in two files, stop and write a Guideline. Then `[[wikilink]]` to it from both files.

## Before creating any new register or "this is where X lives" file

Vastgelegd 2026-08-16 na de frustratie-audit ([[2026-08-16-frustratie-audit]]): een sessie richtte `PKM/Documents/software-en-tools.md` in als dé plek voor software-tracking, zonder te weten dat [[GL-018-integratie-en-software-register]] zich al expliciet "de portable single source of truth" voor exact datzelfde onderwerp noemt. Twee registers voor hetzelfde ding, ontstaan puur omdat niemand eerst zocht.

**Voordat je een nieuw bestand aanmaakt dat bedoeld is als vaste, doorlopend bij te werken lijst/register/overzicht van iets** (niet alleen een nieuwe Guideline — ook een los PKM/Documents-bestand, een nieuwe tabel, een nieuwe "inventaris"):

```bash
grep -rli "single source of truth\|enige bron\|de enige plek" "Team Knowledge/Guidelines"
```

Kom je een bestaand register tegen dat hetzelfde onderwerp claimt: gebruik dat, wikilink ernaartoe, voeg niets nieuws toe. Vind je niets: ga door, maar overweeg of dit een Guideline moet worden (zie hierboven) in plaats van een los PKM-document, juist om dit zelf straks als vindbare SSOT te laten gelden.

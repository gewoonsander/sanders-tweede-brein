# SOPs - Index

**SOPs are agent skills.** Each SOP is a canonical procedure — a step-by-step recipe for one job. They are LLM-agnostic and reusable across agents: an SOP has a **default owner** (the specialist who runs it most often), but any agent can invoke an SOP when they need its procedure. Think of SOPs the way Claude skills work — discrete, named, callable.

Filename pattern: `SOP-NNN-<title>.md`. See [[GL-001-file-naming-conventions]] for slug rules. Numbering follows authorship order, not topic — gaps are intentional and reserve slots for future agents.

## Active SOPs

| SOP | Title | Default owner | Description |
|---|---|---|---|
| SOP-001 | [[SOP-001-how-to-add-a-new-specialist]] | Jethro | Step-by-step procedure to draft and onboard a new team specialist. References [[GL-001-file-naming-conventions]]. |
| SOP-002 | [[SOP-002-convert-mypka-to-sqlite]] | Atlas (run by the user via paste-into-LLM prompt) | Generate a SQLite mirror of your myPKA on demand. Markdown stays canonical; SQLite is a derived performance layer. Body is a paste-into-LLM prompt. |
| SOP-003 | [[SOP-003-bezalel-build-a-component]] | Bezalel | Design-system-aware UI component build: read the spec, scaffold with semantic tokens, type every prop, handle all states, verify visually, hand off to Nemesis. |
| SOP-004 | [[SOP-004-argus-security-audit]] | Argus | Structured security audit in vier fases: credential hygiene, authorization, integration surfaces, GDPR/data-handling. Produces severity-tagged findings report with proof-of-exploit. |
| SOP-005 | [[SOP-005-nemesis-quality-gate]] | Nemesis | Visuele + accessibility + responsive QA gate. Zes fases, screenshot-evidence, WCAG 2.2 AA, design-system enforcement. Niets shippet zonder PASS. |
| SOP-010 | [[SOP-010-adc-inschrijvingen-opvragen]] | Hermes (via Daedalus) | Live inschrijvingen ophalen van Dart Atlas voor ADC Regio Oost. Triggered by vragen als "hoeveel mensen doen mee" of "update ADC-toernooien". |

| SOP-006 | [[SOP-006-author-a-design-system]] | Harmonia | Stap-voor-stap procedure om een visueel design system te schrijven en te onderhouden in GL-003. |
| SOP-007 | [[SOP-007-audit-content-for-design-system-compliance]] | Harmonia | Audit bestaande content op naleving van het design system (GL-003). |
| SOP-008 | [[SOP-008-build-an-infographic]] | Charta | Bouw een infographic op basis van het design system en een content-brief. |
| SOP-009 | [[SOP-009-generate-a-styled-image]] | Pixel | Genereer een gestileerde afbeelding conform GL-003 via een externe image-generator. |

| SOP-011 | [[SOP-011-adc-toernooi-analyse]] | Atlas (schema/structuur) + Daedalus (fetches) | Data ophalen en analyseren uit Dart Atlas na een ADC-toernooi: basisinfo, eindstand, 180's, hoge finishes, top averages, snelste legs, volgende toernooien. Output is een gestructureerd markdown-blok als invoer voor WS-004/WS-006. |
| SOP-012 | [[SOP-012-adc-seizoensplanning-aanleveren]] | Hermes | ADC-seizoensplanning aanleveren/verwerken. |
| SOP-013 | [[SOP-013-inboxen-verwerken]] | Hermes | Systematisch leegmaken van Downloads, Team Inbox en Werkarchief — elk bestand krijgt een definitieve bestemming. |
| SOP-014 | [[SOP-014-refresh-platform-specialist-knowledge]] | Athena | Lichte, herhaalbare refresh van een platform-specialist's kennisdossier (bijv. Martonny/Huddle, Tonnymart/Plug&Pay) — kwartaal-scheduled, alleen diep herlezen wat nieuw/gewijzigd is. |
| SOP-015 | [[SOP-015-adc-pub-qualifier-handleiding]] | Sander | Officiële ADC Europe/Darts Atlas-procedure voor toernooimanagers: inschrijvingen, check-in/checkout, format-regels, knockout, winnaarsfoto, financiële regelingen. |
| SOP-016 | [[SOP-016-remote-toegang-mac-mini-op-vakantie]] | Sander | Vanaf een andere locatie via Terminal + Tailscale SSH'en naar de Mac mini en daar Claude Code starten op de tweede-brein-repo. |
| SOP-017 | [[SOP-017-verwerk-voedingsregistratie]] | Penn + Daedalus | Foto, spraak of tekst normaliseren naar een categorie, nutrition-range en append-only dagelijks voedingslogboek. |
| SOP-018 | [[SOP-018-registreer-mcp-service-bij-agent-runtime]] | Daedalus | Een geregistreerde MCP-service veilig, idempotent en zonder secretduplicatie aansluiten op een agentruntime. |
| SOP-019 | [[SOP-019-controleer-integraties-en-software]] | Daedalus | Verwachte integraties vergelijken met secretvrije lokale of handmatige observaties en iedere afwijking een concrete vervolgactie geven. |
| SOP-020 | [[SOP-020-losstaand-deliverable-archiveren]] | Hermes (beoordeelt) + Sander (keurt goed) | Vijf archiveercriteria voor losstaande Deliverables (geen eigenaartaak) en het 30-dagen-signaal voor "nooit opgevolgd". Uitgevoerd binnen [[WS-008-deliverables-en-projecten-audit]]. |
| SOP-021 | [[SOP-021-audit-pkm-graafhygiene]] | Atlas (analyse) + Hermes (opvolging) + Sander (goedkeuring) | Alleen-lezen audit van geïsoleerde notities, gebroken/dubbelzinnige links, ontbrekende bijlagen en zwakke INDEX-verbindingen; nooit automatisch opschonen. |
| SOP-022 | [[SOP-022-verwerk-persoonlijke-taak]] | Hermes | Persoonlijke taak capturen, verduidelijken, koppelen, plannen/delegeren, reviewen en sluiten. |
| SOP-023 | [[SOP-023-synchroniseer-persoonlijke-taak-naar-todoist]] | Daedalus | Canonieke myPKA-taak idempotent naar Todoist projecteren en gebeurtenissen gecontroleerd terugverwerken. |

*Reserved (genuinely open for future agents):* SOP-024+ (next free slot). Do not back-fill existing numbers without coordinating across the team.

## How to add a new SOP

1. Pick the next unused number (`SOP-NNN`) — by authorship order, not topic. Don't reuse reserved numbers.
2. Filename: `SOP-NNN-<kebab-case-title>.md`.
3. Header includes the default owner, status, triggers, references, and an explicit "Reusable by any agent" note — the SOP is a skill, not 1:1 ownership.
4. Reference [[GL-001-file-naming-conventions]] and any other Guideline instead of duplicating its content.
5. Add a row to this index.

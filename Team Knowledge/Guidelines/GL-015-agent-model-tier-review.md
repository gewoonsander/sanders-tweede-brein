---
name: GL-015-agent-model-tier-review
title: Agent-modelkeuze — tiering en reviewcadans
type: guideline
tags:
  - agents
  - cost
  - model-tiering
owner: Hermes
created: 2026-07-07
---

# GL-015 — Agent-modelkeuze: tiering en reviewcadans

> **Hermes leest dit** bij elke wijziging aan `.claude/agents/*.md` frontmatter, en bij elk periodiek of getriggerd reviewmoment hieronder.

## Aanleiding

Zonder expliciet `model:`-veld in de frontmatter erft elke subagent het model van de hoofdsessie ("inherit from parent"). Draait Hermes op een zwaar model met hoog effort, dan draait elke specialist — ook mechanisch werk zoals journal-capture — op datzelfde zware niveau. Dat dreef Sander tegen zijn sessie- en weeklimieten aan en kostte extra geld bovenop het abonnement. Oplossing: per specialist een passend model kiezen op basis van de zwaarte van het werk, in plaats van alles impliciet te laten meeliften met het hoofdmodel.

Vaste instelling zonder revisie is echter ook geen goed idee: modellen verbeteren, taakzwaarte van een specialist kan verschuiven, en gebruikspatronen (limieten) veranderen. Deze Guideline legt zowel de huidige tiering vast als het moment waarop die opnieuw wordt beoordeeld.

## Reviewcadans

Twee triggers, niet één — een vast vangnet plus event-gestuurde herbeoordeling:

1. **Vast kwartaalmoment** — elk kwartaal kort nalopen of de tiering hieronder nog klopt bij het actuele gebruik.
2. **Event-getriggerd, direct** — zodra een van deze zich voordoet:
   - Anthropic brengt een nieuw modelfamilie uit (bijv. een nieuwe Haiku/Sonnet/Opus-generatie).
   - Sander loopt weer tegen sessie- of weeklimieten aan.
   - De output van een specialist kwalitatief tegenvalt (mogelijk te licht getierd) of een specialist blijkt structureel te zwaar ingezet voor wat hij doet (mogelijk te zwaar getierd).

Bij een review: loop de tabel hieronder langs, vraag per specialist "is dit nog de juiste zwaarte gegeven wat deze rol nu daadwerkelijk doet en welke modellen nu beschikbaar zijn", en werk de tabel + de frontmatter van het betreffende `.claude/agents/<slug>.md` bij.

## Huidige tiering

| Specialist | Model | Rationale |
|---|---|---|
| Bezalel (Felix) | Opus | Frontend-code schrijven, zwaar redeneerwerk |
| Atlas (Silas) | Opus | Schema/SQLite-migraties, foutgevoelige parsing |
| Daedalus (Mack) | Opus | API/OAuth/MCP-integraties, foutgevoelig |
| Argus (Vex) | Sonnet | Security-audits, gedegen maar geen zwaarste tier |
| Nemesis (Vera) | Sonnet | QA/accessibility-checks |
| Harmonia | Sonnet | Design-system authoring |
| Athena (Pax) | Sonnet | Research/cross-verificatie |
| Penn | Haiku | Journal-capture volgens vaste template |
| Jethro (Nolan) | Haiku | Volgt SOP-001 stap voor stap |
| Charta | Haiku | Infographic-layout volgens GL-003-tokens |
| Pixel | Haiku | Image-gen orchestratie |
| Hermes (orchestrator, hoofdsessie) | Sonnet, medium/low effort | Routeert alleen; geen zwaar redeneerwerk nodig op orchestratieniveau |

Status: **actief — doorgevoerd in de frontmatter van alle 11 `.claude/agents/*.md`-bestanden op 2026-07-07.**

## Wanneer deze Guideline gelezen wordt

- Bij elke wijziging aan een `model:`-veld in `.claude/agents/*.md`.
- Bij het kwartaalmoment of een van de events hierboven.

## Cross-references

- [[SOP-001-how-to-add-a-new-specialist]] — nieuwe hires krijgen hier direct een tier toegewezen in plaats van impliciet te erven.

## Updates to this Guideline

Wijzig de tabel hierboven bij elke review. Noteer kort waarom een tier verandert (nieuw model beschikbaar, taak zwaarder/lichter gebleken, limieten geraakt) zodat de volgende review niet blind hoeft te gokken.

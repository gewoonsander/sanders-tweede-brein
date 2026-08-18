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

**Laatste volledige herbeoordeling: 2026-08-18.** Alle zestien specialisten zijn langs de keuzevraag uit [[SOP-001-how-to-add-a-new-specialist]] stap 5b gelegd: *wat gebeurt er als deze specialist het nét verkeerd doet?*

| Specialist | Shim-model | Contract-alias | Rationale |
|---|---|---|---|
| Atlas (Silas) | Opus | `reasoning` | Schema- en migratiewerk, foutgevoelige parsing. Een fout vervuilt data die de rest van het systeem als waarheid leest |
| Daedalus (Mack) | Opus | `reasoning` | API-, OAuth- en MCP-integraties. Een fout breekt een koppeling of raakt credentials |
| Bezalel (Felix) | Opus | `reasoning` | Frontend-code waar anderen op voortbouwen; herstelkosten van zwak werk overtreffen de modelkosten ruim |
| Argus (Vex) | Opus | `reasoning` | **Gewijzigd 2026-08-18** — een gemiste kwetsbaarheid is het schoolvoorbeeld van "duur én moeilijk te zien". Sonnet paste niet bij de eigen keuzevraag |
| Athena (Pax) | Sonnet | `balanced` | Research en cross-verificatie; oordeel nodig, fouten komen bij het nalezen van de bronnen boven |
| Nemesis (Vera) | Sonnet | `balanced` | QA- en toegankelijkheidscontroles tegen een vast kader |
| Harmonia | Sonnet | `balanced` | Design-system authoring; afwijkingen zijn zichtbaar in de uitkomst |
| Pieter Post | Sonnet | `balanced` | Conceptantwoorden die Sander vóór verzending leest — de review vangt fouten af |
| Dagobert Duck | Sonnet | `balanced` | Financiële rapportage uit vastgelegde bronnen: cijfers moeten kloppen, maar elke bewering is tegen de bron te leggen |
| Jethro (Nolan) | Sonnet | `balanced` | **Gewijzigd 2026-08-18** — SOP-001 is zwaarder geworden: Jethro schrijft nu contracten uit onderzoek én maakt de tierkeuze in stap 5b. Dat is oordeel, geen sjabloonwerk |
| Martonny | Sonnet | `balanced` | **Gewijzigd 2026-08-18** — levert geverifieerde platformfeiten. Een verzonnen capaciteit is precies de fout die niemand opmerkt; dit is de rol waar "geen aannames als feiten" het hardst telt |
| Tonnymart | Sonnet | `balanced` | **Gewijzigd 2026-08-18** — zelfde redenering als Martonny |
| Stephan Speelberg | Sonnet | `balanced` | **Gewijzigd 2026-08-18** — montagefouten zie je bij het terugkijken meteen, en Resolve-scripting is opnieuw te draaien. Opus was zwaarder dan de foutkosten rechtvaardigen |
| Penn | Haiku | `fast` | Journal-capture volgens vaste template |
| Charta | Haiku | `fast` | Infographic-layout met bestaande GL-003-tokens |
| Pixel | Haiku | `fast` | Image-gen orchestratie |
| Hermes (orchestrator, hoofdsessie) | n.v.t. — sessiemodel | `balanced` | Routeert en vat samen. Advies blijft de midden-tier met medium/low effort; de hoofdsessie kiest Sander zelf in de interface, dit veld is dus adviserend en niet bindend |

Status: **actief — alle 16 `.claude/agents/*.md`-shims dragen een `model:`-veld, en alle 17 specialist-contracten dragen de portable alias (stand 2026-08-18).**

### Openstaand na deze ronde

**Fable 5 is niet ingedeeld.** Er is een modelvariant beschikbaar waarvan ik de positie in de zwaarte-/kostenverhouding niet ken. Zonder dat te weten hoort er geen specialist op gezet te worden. Uit te zoeken vóór de volgende ronde: waar past deze in de drie tiers, of valt hij erbuiten.

**Deze ronde is per saldo duurder, niet goedkoper.** Drie specialisten omhoog, één omlaag. Dat is bewust: het doel van de tiering is de juiste zwaarte, niet de laagste rekening. De grote besparing zit al in de elf van 2026-07-07 die niet meer het hoofdmodel erven.

**Niet gemeten, alleen beredeneerd.** Deze herbeoordeling is gedaan op taakzwaarte per rol, niet op waargenomen kwaliteitsverschil per model. Valt een specialist na deze wijziging op — te dun of juist onnodig zwaar — dan is dat een event-trigger en geen reden om de tabel te wantrouwen.

## Wanneer deze Guideline gelezen wordt

- Bij elke wijziging aan een `model:`-veld in `.claude/agents/*.md`.
- Bij het kwartaalmoment of een van de events hierboven.

## Cross-references

- [[SOP-001-how-to-add-a-new-specialist]] — nieuwe hires krijgen hier direct een tier toegewezen in plaats van impliciet te erven.

## Updates to this Guideline

Wijzig de tabel hierboven bij elke review. Noteer kort waarom een tier verandert (nieuw model beschikbaar, taak zwaarder/lichter gebleken, limieten geraakt) zodat de volgende review niet blind hoeft te gokken.

### Reviewgeschiedenis

- **2026-08-18 — volledige herbeoordeling.** Aanleiding: bij het aannemen van Dagobert Duck bleek dat zijn shim geen `model:`-veld had en hij dus het hoofdmodel erfde — hetzelfde lek dat deze Guideline op 2026-07-07 moest dichten. Oorzaak: de tierkeuze stond alleen hier en niet in de aanneemprocedure, dus wie SOP-001 netjes volgde kwam modellen nooit tegen. Structureel opgelost met stap 5b in [[SOP-001-how-to-add-a-new-specialist]], plus twee regels in de "Common mistakes"-lijst daar. Inhoudelijk: vier specialisten die na 2026-07-07 waren aangenomen zijn alsnog in de tabel opgenomen, en alle zestien zijn opnieuw langs de keuzevraag gelegd. Vier tiers gewijzigd (Argus omhoog, Jethro/Martonny/Tonnymart omhoog, Stephan Speelberg omlaag). Alle 17 contracten hebben nu de portable alias, zodat een modelwissel voortaan één vertaaltabel raakt in plaats van zestien bestanden.
- **2026-07-07 — invoering.** Elf specialisten getierd om te voorkomen dat elke subagent het hoofdmodel erft.

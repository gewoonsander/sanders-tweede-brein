---
name: GL-024-reverse-prompting-bij-vage-taken
title: Reverse prompting bij vage taken
type: guideline
tags:
  - interactie
  - delegatie
  - clarify
owner: Hermes
created: 2026-08-21
---

# GL-024 — Reverse prompting bij vage taken

## Aanleiding

Vastgelegd 2026-08-21 na analyse van de video "Dan Martell: The AI Cheat Codes Every
Founder Needs in 2026" (transcript: `PKM/Documents/YouTube-Kennis/kanaal/01 - Dan Martell
The AI Cheat Codes Every Founder Needs in 2026 [_24HzGNv-3A].md` — geen wikilink omdat de
bestandsnaam zelf vierkante haken bevat, wat botst met `[[...]]`-syntax). Martell noemt
"reverse prompting" als zijn belangrijkste prompt-gewoonte: geef de AI het einddoel, laat de
AI de verduidelijkende vragen stellen — in plaats van zelf vooraf alles uit te schrijven of,
omgekeerd, dat de AI blind aan de slag gaat op een aanname.

[[GL-013-interactie-enkelvoudige-keuzes]] regelt al **hoe** Hermes een keuze voorlegt
(altijd A/B/C). Deze Guideline regelt **wanneer** Hermes aan het begin van een taak actief
moet doorvragen in plaats van meteen uit te voeren of Sander te laten voorspecificeren — de
concrete invulling van de "Clarify"-stap in Hermes' 6-stappen delegatieprotocol (zie
root-`AGENTS.md`, sectie "Hermes's expanded role").

## Regel

Wanneer een taak een duidelijk **einddoel** heeft maar een open **uitvoeringspad** (bv. "zorg
dat de klantretentie beter wordt", "maak dit sneller", "help me hiermee"), doet Hermes twee
dingen niet:

1. niet blind uitvoeren op basis van een eigen aanname over wat Sander bedoelt;
2. niet terugkaatsen met "specificeer eerst precies wat je wilt".

In plaats daarvan identificeert Hermes (of de gebriefde specialist) de **kleinste set
blokkerende vragen** — vragen die de uitkomst materieel anders zouden maken — en stelt die
in het eerste antwoord voor, in [[GL-013-interactie-enkelvoudige-keuzes]]-formaat (A/B/C,
of het genummerde formaat bij meerdere vragen tegelijk).

## Grens met Auto Mode

Deze Guideline mag niet botsen met de sessie-brede instructie om te werken zonder onnodig te
pauzeren voor verduidelijking. Daarom geldt reverse prompting alleen wanneer minstens één van
deze twee waar is:

- er bestaat **nog geen SOP/Workstream** die het pad al ondubbelzinnig maakt (is dat er wel —
  bijv. "verwerk de team inbox" → [[SOP-013-inboxen-verwerken]] — dan is er niets te
  verduidelijken, gewoon uitvoeren);
- een verkeerde aanname zou **duur of moeilijk terug te draaien** zijn (een geschreven
  document, een verstuurd bericht, een structurele wijziging aan de wiki) — bij een
  goedkope, omkeerbare actie is een eerste redelijke aanname + voorleggen ter correctie
  sneller dan eerst vragen.

Is geen van beide waar — de taak is klein, omkeerbaar, en een redelijke aanname ligt voor de
hand — dan maakt Hermes gewoon de aanname, voert uit, en meldt die aanname erbij in plaats
van er eerst naar te vragen.

## Vorm

- Maximaal 3-4 vragen, gericht op wat de uitkomst het meest zou veranderen — geen generieke
  intakelijst.
- Eén bericht, niet een reeks losse volgvragen.
- Bij meerdere losse vragen: het genummerde `1. <vraag>? (A/B/C)`-formaat uit GL-013, niet
  per vraag een los A/B/C-blok.
- Sander mag zelf ook reverse-prompten: "ik wil X bereiken, vraag me wat je nodig hebt" is
  een geldige, verwachte opening voor een vage taak — Hermes reageert daar dan direct op
  volgens de regel hierboven, in plaats van te vragen om eerst alles uit te schrijven.

## Relatie tot het delegatieprotocol

Dit is de concrete invulling van de **Clarify**-stap in Hermes' 6-stappen delegatieprotocol
(Understand → Clarify → Match → Brief → Execute → Synthesize, zie root-`AGENTS.md`). Match en
Brief volgen pas ná Clarify wanneer Clarify daadwerkelijk vragen opleverde.

## Cross-references

- [[GL-013-interactie-enkelvoudige-keuzes]] — het antwoordformaat voor elke vraag die hieruit
  volgt.
- root-`AGENTS.md`, "Hermes's expanded role" — het delegatieprotocol waar dit een stap van
  invult.

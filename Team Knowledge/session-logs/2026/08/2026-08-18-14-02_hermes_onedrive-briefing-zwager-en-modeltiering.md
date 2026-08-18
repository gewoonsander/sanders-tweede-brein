---
agent_id: hermes
session_id: onedrive-briefing-zwager-en-modeltiering
timestamp: 2026-08-18T12:06:00Z
type: close-session
linked_sops: ["SOP-001-how-to-add-a-new-specialist"]
linked_workstreams: []
linked_guidelines: ["GL-015-agent-model-tier-review", "GL-002-frontmatter-conventions"]
---

# OneDrive-briefing voor Ralf, en een volledige modeltiering-herziening

## Context

Sander vroeg mee te denken over zijn zwager Ralf Zwaan, die een OneDrive-archief van circa 15.000 bestanden en 250 GB wil ordenen met een AI-agent, maar weinig vertrouwen heeft in LLM's. Twee bedrijven (Bouwbedrijf Zwaan, Convenient Interior) plus privémateriaal staan door elkaar. Halverwege sloeg de sessie om naar het eigen huis: bij het opzoeken van een eerdere modeltiering-sessie bleek die tiering stil verouderd te zijn.

## What we did

- Hermes werkte een aanpak uit voor het ordenen van Ralfs archief en herschreef die twee keer na inhoudelijke correcties van Sander.
- Hermes schreef `Deliverables/2026-08-18-onedrive-opschoning-briefing.md` — een briefing geadresseerd aan Ralfs eigen LLM, met begeleidingsinstructies (deel 0), het plan, en een toetslijst voor zijn onderzoeksteam.
- Hermes verstuurde die briefing als platte tekst naar `info@bouwbedrijfzwaan.nl` en verifieerde de verzending via de Gmail-API (label SENT).
- Hermes schreef `Deliverables/2026-08-18-modeltiering-agents-instructie.md` — een leveranciersneutrale instructie waarmee Ralfs orchestrator een eigen SOP over modeltiering kan schrijven.
- Hermes voegde stap 5b (Assign the model tier) toe aan `SOP-001`, plus het `model:`-veld in het shim-sjabloon, twee nieuwe cross-references en twee regels in "Common mistakes to avoid".
- Hermes gaf Dagobert Duck alsnog een tier (shim `sonnet`, contract-alias `balanced`) en voerde een volledige herbeoordeling uit van alle zestien specialisten.
- Hermes voegde de portable alias toe aan alle 17 specialist-contracten en herschreef de tiering-tabel in `GL-015` met rationale per specialist en een reviewgeschiedenis.

## Decisions made

- **Vraag:** API-koppeling met Microsoft Graph, of gewoon de lokaal gesynchroniseerde map doorlopen?
  **Besluit:** de eenvoudige route. Het lezen van namen, paden en datums vereist geen API en geen script; de zware route is naar de bijlage verplaatst voor als Ralf dit periodiek wil herhalen.

- **Vraag:** Backup vooraf en daarna verplaatsen, of kopiëren naast de bestaande structuur?
  **Besluit:** kopiëren. Sanders voorstel. De oude structuur blijft onaangeroerd, waardoor logboek, terugdraaiscript en goedkeuring-als-vangnet allemaal overbodig worden. Terugdraaien is dan "gooi de nieuwe map weg".

- **Vraag:** Bovenste mapniveau op levensdomein of op entiteit?
  **Besluit:** entiteit. Met meerdere bedrijven is "van welk bedrijf is dit" een administratieve vraag, geen ordeningsvoorkeur.

- **Vraag:** Bijlage of platte tekst in de mail naar Ralf?
  **Besluit:** platte tekst. Een bijlage vereist dat Hermes 28.000 tekens codering foutloos overtikt; dat risico is niet aanvaardbaar op een mail aan derden.

- **Vraag:** Waar hoort de tierkeuze bij het aannemen van een specialist te staan?
  **Besluit:** als verplichte stap ín SOP-001, niet als losse Guideline ernaast. Een richtlijn die je moet onthouden wordt vergeten; een stap in een procedure die je toch afloopt niet.

## Insights

- De tiering van 2026-07-07 was binnen zes weken verouderd: vier na dat moment aangenomen specialisten stonden niet in de tabel, en Dagobert Duck had helemaal geen `model:`-veld. Niet uit nalatigheid, maar omdat de aanneemprocedure en de tiering-richtlijn twee losse documenten waren.
- Een geautomatiseerde controle die faalt bij een ontbrekend `model:`-veld is het enige echte vangnet hiervoor. Nog niet gebouwd — zie open threads.
- Een tierherziening levert niet automatisch besparing op. Deze ronde ging per saldo omhoog (Argus, Jethro, Martonny, Tonnymart omhoog; Stephan Speelberg omlaag). Het doel is de juiste zwaarte, niet de laagste rekening.
- Bij het afsluiten bleek dat alle artefacten van deze sessie op 2026-08-17 waren gedateerd terwijl de systeemklok 2026-08-18 aangaf. Gecorrigeerd in de bestanden; de reeds verzonden mail draagt nog de oude datum.

## Realignments

- Sander, over de eerste uitwerking: _"Volgens mij doe jij het nu veel te ingewikkeld."_ Terecht — de vraag was hoe een agent concreet helpt, en het antwoord was uitgegroeid tot een bouwproject met app-registratie, acceptatiecriteria en terugdraaiscripts. De kern is één avond werk.
- Sander bracht zelf de kopieeroplossing in: _"binnen zijn OneDrive heeft hij genoeg ruimte om kopieën te maken van alles."_ Dat maakte drie van Hermes' vangnetten overbodig en was een beter ontwerp dan het oorspronkelijke.

## Open threads

- [ ] Fable 5 is niet ingedeeld in de tiering. Positie in de zwaarte-/kostenverhouding uitzoeken vóór de volgende ronde.
- [ ] Geautomatiseerde controle bouwen die faalt zodra een `.claude/agents/*.md` geen `model:`-veld heeft. Zonder dat vangnet veroudert `GL-015` opnieuw.
- [ ] De vier gewijzigde tiers zijn beredeneerd op taakzwaarte, niet gemeten op kwaliteit. Valt een specialist op, dan is dat een event-trigger.
- [ ] Team Inbox: 1 screenshot en 1 document wachten nog op verwerking.

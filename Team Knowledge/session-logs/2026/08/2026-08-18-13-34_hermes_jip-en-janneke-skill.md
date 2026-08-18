---
agent_id: hermes
session_id: jip-en-janneke-skill
timestamp: 2026-08-18T13:34:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-023-eenvoudige-taal", "GL-013-interactie-enkelvoudige-keuzes", "GL-016-beslis-en-waarschuwingsblokken"]
---

# Jip-en-janneke-skill gebouwd: technische rapporten hertalen naar eenvoudige taal

## Context

Sander merkte dat onderzoeksrapporten van het team vol vakwoorden en afkortingen zitten. Hij begrijpt er veel van, maar niet alles. Hij vroeg om een skill die output hertaalt naar "jip-en-janneketaal", met expliciete opdracht om eerst op te zoeken wat dat taalkundig precies is, dan een voorstel te doen en kritische vragen te stellen vóór implementatie.

## What we did

- Hermes deed bronnenonderzoek naar jip-en-janneketaal: herkomst (Annie M.G. Schmidt, *Het Parool* 13-09-1952 t/m 07-09-1957), en de meetstudie van Evers-Vermeul & Sanders (Universiteit Utrecht, *Onze Taal* jrg. 78) met concrete cijfers: ~6 woorden per zin, ~4 letters per woord, 91% tegenwoordige tijd, 54% directe rede, 8 lijdende zinnen in 30 verhalen.
- Hermes legde vijf ontwerpvragen voor met A/B/C-opties en een eigen aanbeveling; Sander koos 1B, 2C, 3B, 4B, 5B — precies de aanbeveling.
- Hermes schreef `Team Knowledge/Guidelines/GL-023-eenvoudige-taal.md` met acht hertaalregels, de meetcijfers, twee niveaus en een verplichte zelfcontrole.
- Hermes schreef `.claude/commands/jip.md` — vier aanroepvormen, wikilinkt naar GL-023 in plaats van de regels te herhalen.
- Hermes testte de skill op `Deliverables/2026-08-18-gemma-4-onderzoek-athena.md`: eenvoudige samenvatting bovenaan, Athena's technische rapport ongewijzigd eronder. Gemeten: 37 zinnen, gemiddeld 9,4 woorden, langste zin 18 woorden. Sander keurde het niveau goed (optie A).
- Hermes registreerde GL-023 in `Team Knowledge/Guidelines/INDEX.md` en `/jip` in de skill-tabel van `AGENTS.md`.
- Hermes vulde de ontbrekende `/caveman`-rij aan in dezelfde skill-tabel.

## Decisions made

- **Vraag:** Vervangt de eenvoudige versie het technische rapport?
  **Besluit:** Nee. Eenvoudige samenvatting bovenaan onder `## In het kort (simpel)`, technisch rapport ongewijzigd eronder. Reden: Sander zoekt het niet-technische nooit terug als het technische weg is.
- **Vraag:** Hoe streng vereenvoudigen?
  **Besluit:** Twee niveaus — standaard (gewoon simpel) en `/jip diep` (alles uitleggen).
- **Vraag:** Vaknamen weglaten of laten staan?
  **Besluit:** Laten staan, mét uitleg van wat het *doet* — niet waar de letters voor staan. Sander wil de termen op termijn zelf herkennen.
- **Vraag:** Waar geldt de skill?
  **Besluit:** Chat-antwoorden én `Deliverables/`. Niet in journaal, klantcommunicatie en ADC-verslagen — die hebben hun eigen toon.

## Insights

- Korte zinnen zijn niet het doel maar het gevolg. Onderzoek van Jentine Land laat zien dat vmbo-leerlingen teksten met korte zinnen juist *minder* goed begrepen zodra de samenhang wegviel. Daarom staat "verbindingswoorden zichtbaar houden" (en, maar, want, dus, toen) als harde regel in GL-023, en is de norm 10–12 woorden per zin in plaats van Schmidts 6.
- De term jip-en-janneketaal wordt ook denigrerend gebruikt. GL-023 verbiedt daarom expliciet kinderboekentoon: eenvoudige taal voor een volwassene, geen kleutertaal.
- Bij het hertalen van het Gemma-rapport bleek Athena's eigen executive summary ("12–13× langzamer dan Qwen 3.5") niet te kloppen met haar eigen bevinding (11 tokens/seconde tegenover 60+). Hermes nam alleen de twee ruwe getallen over en rekende geen verhouding uit. Dit bevestigt waarom regel 7 van GL-023 (getallen woordelijk exact, nooit zelf herberekenen) nodig is — juist bij vereenvoudigen is de verleiding om af te ronden het grootst.
- Het skill-register in `AGENTS.md` was niet compleet: `/caveman` bestond wel als bestand maar stond niet in de tabel, terwijl de regel eronder voorschrijft dat elke nieuwe skill direct een rij krijgt. Andere agents konden hem dus niet vinden.

## Realignments

- _(geen deze sessie — Sander volgde alle aanbevelingen)_

## Open threads

- [ ] De discrepantie in Athena's Gemma-rapport (executive summary zegt 12–13×, bevindingen zeggen 11 vs 60+ tokens/seconde) is gesignaleerd maar niet gecorrigeerd in het rapport zelf.

## Next steps

- `/jip` in de praktijk gebruiken op een volgend technisch rapport; bijschaven via `/improve-skill jip`, waarbij de aanpassing in GL-023 hoort te landen en niet in het commandobestand.

## Cross-links

- `[[GL-023-eenvoudige-taal]]` — de guideline die deze sessie opleverde.
- `[[Deliverables/2026-08-18-gemma-4-onderzoek-athena]]` — het testobject.

---
agent_id: hermes
session_id: darts-uitgooi-route-formule
timestamp: 2026-08-22T00:24:00+02:00
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes", "GL-016-beslis-en-waarschuwingsblokken"]
---

# Darts uitgooi-route formule — onderzoek en eerste formule-ontwerp

## Context

Sander wil een systematisch overzicht van de factoren die bepalen welke uitgooi-route (checkout) bij darts het beste is — aantal darts over, dubbel-kwaliteit, spelerservaring, wedstrijdsituatie — als bouwstenen voor een toekomstige weegbare formule in een app.

## What we did

- Hermes routeerde het onderzoek naar Athena, die Sanders eigen boek ("Darttactiek van beginner tot professional") volledig las, plus het Alex Spellman-archief (steekproef), Dartpraat/Darts Draait Door, WDF/NDB-regels en internetresearch (incl. academisch werk van Kohler 1982 en Tibshirani/Price/Taylor 2011). Resultaat: `Deliverables/2026-08-22-darts-uitgooi-routeprincipes.md`, 18 principes in 7 categorieën, elk met bron en confidence-niveau.
- Athena vulde het overzicht daarna aan met dartscheckoutassistant.com (2 nieuwe principes, 6 bestaande extra onderbouwd).
- Hermes bouwde een eerste, ongekalibreerd formule-ontwerp (`Deliverables/2026-08-22-darts-uitgooi-route-formule-v1.md`): per-pijl scoring i.p.v. vooraf vastgelegde routes, 12+ features met instelbare gewichten, contextuele multipliers (speler-nauwkeurigheid, tegenstander-dreiging), en een doorgerekend voorbeeld (restscore 70).
- Sander bracht tijdens het doorrekenen van restscore 52 een nieuw principe in: bust-risico bij het missen van een single naar de bijbehorende tripel (S20→D16 kan busten via T20=60; S12→D20 niet, want T12=36 blijft onder de restscore). Hermes verifieerde dit rekenkundig en voegde het toe als principe 3.5 aan beide documenten, inclusief de skill-afhankelijke nuance (zwaarder voor beginners) die Sander zelf gaf.
- Hermes maakte een compacte "gouden regels"-versie (`Deliverables/2026-08-22-darts-gouden-uitgooi-en-wegzetregels.md`, 14 regels), die Sander verder aanscherpte met een kernprincipe ("hoogste score is niet per definitie de beste") — verwerkt in beide documenten.
- Diverse losse restscore-doorrekeningen op verzoek (52, 56, 56 met D18-alternatief) om de principes te toetsen.

## Decisions made

- **Vraag:** Eerst het overzicht laten reviewen of meteen doorgaan naar de formule?
  **Beslissing:** Sander koos (na eerst "A" te kiezen) alsnog voor "doorgaan" — formule-ontwerp is dezelfde sessie opgepakt.
- **Vraag:** Het nieuw ontdekte bust-bestendigheidsprincipe toevoegen aan de documenten?
  **Beslissing:** Ja, aan beide (overzicht als 3.5, formule als sigma-geschaalde feature).

## Insights

- Sander's eigen praktijkkennis (bust-risico bij tripel-mishit, het "hoogste score is niet altijd beste"-kernprincipe) leverde minstens twee principes op die geen van de gestructureerde bronnen (boek, Spellman, podcasts, internetresearch) expliciet had benoemd — waardevol om bij toekomstig PKM-onderzoek rekening te houden met interactief doorrekenen als eigen onderzoeksmethode, niet alleen bronnenstudie.
- De formule is bewust ontworpen om nooit "punten van dit vak" als losse term te bevatten — vier bestaande features encoderen het "hoogste score ≠ beste keuze"-principe al impliciet.

## Realignments

- _(none this session)_

## Open threads

- [ ] Gewichten in de formule zijn nog niet gekalibreerd — het 70-voorbeeld in het formuledocument liet al zien dat de standaardgewichten soms afwijken van Sanders eigen intuïtie (T20-D5 vs. T18-D8).
- [ ] Kandidaat-generatie (welke dartbord-vakken/checkout-tabellen de formule als input krijgt) is nog niet uitgewerkt — apart algoritmisch bouwblok.
- [ ] Team Inbox staat nog open: 1 screenshot + 3 documenten wachten op verwerking (niet opgepakt deze sessie).

## Next steps

- Bij een volgende sessie: kalibratie van de formule-gewichten, en/of kandidaat-generatie (dartbord-geometrie + standaard checkout-tabellen) uitwerken als los bouwblok.
- Eventueel een werkende prototype-implementatie van de formule, zodra Sander daar behoefte aan heeft.

## Cross-links

- _(geen eerdere sessie-log over dit onderwerp — nieuw project)_

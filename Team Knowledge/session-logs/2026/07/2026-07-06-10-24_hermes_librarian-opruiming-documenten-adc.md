---
agent_id: hermes
session_id: 2026-07-06-librarian-opruiming-documenten-adc
timestamp: 2026-07-06T10:24:00Z
type: mid-session-insight
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-001-file-naming-conventions", "GL-002-frontmatter-conventions"]
---

# Librarian-opruiming: orphan-map /ADC/ en naamconventie-overtreders in PKM/Documents

## Context

Sander vroeg uitleg over de structuur van `PKM/Documents/` (waarom .md naast elke PDF, waarom submappen, waarom een `ADC`-map op het hoogste niveau naast `PKM`). Onderzoek bracht structuurdrift aan het licht die direct is gecorrigeerd (akkoord Sander: "a").

## What we did

- **Hermes** verplaatste de 5 bestanden uit de niet-gedocumenteerde root-map `/ADC/Verslagen/` naar `Deliverables/`, hernoemd naar `YYYY-MM-DD-slug.md` conform GL-001 (datums geverifieerd tegen de frontmatter/inhoud van elk bestand, niet blind overgenomen uit de oude bestandsnaam):
  - `2026-06-20-facebook-verslag-amateur2-finals.md`
  - `2026-06-20-facebook-verslag-amateur1-finals.md`
  - `2026-06-08-facebook-verslag-doetinchem.md`
  - `2026-06-27-facebook-verslag-benelux-trophy-hoofdtoernooi.md`
  - `2026-06-11-facebook-verslag-arnhem.md`
- **Hermes** verwijderde de lege root-map `/ADC/` (was geen onderdeel van het officiële mappenplan in `AGENTS.md`). `PKM/CRM/ADC/` (contactpersonen) blijft ongewijzigd — dat is wel de juiste, gedocumenteerde plek.
- **Hermes** hernoemde `PKM/Documents/2025-wet-winmau-western-european-tour.md` → `2025-11-15-wet-winmau-western-european-tour.md` (datum overgenomen uit het bestand se eigen `issued_on`-veld) en corrigeerde de 3 wikilinks die ernaar verwezen (`PKM/My Life/Topics/adc.md` ×2, sessielog `2026-06-16-22-00_larry_wet2025-pubqualifiers-superleague.md` ×1).
- **Hermes** opende de twee docx-bestanden (`2016-sollicitatie-applicatiebeheerder.docx` en `2016-11-sollicitatie-applicatiebeheerder.docx`) om de exacte datum te achterhalen (stond niet in bestandsmetadata) — gevonden in de brieftekst: "Arnhem, 9-11-16". Beide hernoemd naar `2016-11-09-sollicitatie-applicatiebeheerder-v01.docx` (kale versie) en `-v02.docx` (volledig geformatteerde versie met adresregel) — geen wikilinks elders die aanpassing vereisten.
- **Hermes** maakte de ontbrekende companion-.md aan voor `2026-06-22-factuur-db20260018-mark-van-ovost.pdf` conform het GL-002 Documents-schema (was wel als PDF aanwezig maar had nooit de verplichte entity-note gekregen).

## Insights

- `PKM/Documents/` wordt in de praktijk breder gebruikt dan de AGENTS.md-omschrijving ("paspoort, contracten, identiteitsbestanden") doet vermoeden — het bevat ook volledige boekhoudarchieven (`WeFact/`, `e-Boekhouden/`). Functioneel geen probleem (beide submappen hebben een eigen `README.md` met context), maar het is breder dan de oorspronkelijke scope-beschrijving.
- v01/v02-aanduiding bij de sollicitatiebrieven is een aanname van Hermes (kale versie = v01, volledig geformatteerde versie met adresblok = v02) — niet geverifieerd bij Sander welke daadwerkelijk de uiteindelijk verstuurde versie was.

## Open threads

- [ ] Overwegen of de AGENTS.md-omschrijving van `PKM/Documents/` moet worden verruimd naar "alle documenten", nu blijkt dat de praktijk al breder is dan "identiteitsbestanden".
- [ ] Sander bevestigen of de v01/v02-toewijzing van de sollicitatiebrieven klopt.

## Cross-links

- `[[2026-07-06-09-47_hermes_opslagstrategie-foto-apple-documenten-google]]` — zelfde sessie, gerelateerd gesprek over documentopslag

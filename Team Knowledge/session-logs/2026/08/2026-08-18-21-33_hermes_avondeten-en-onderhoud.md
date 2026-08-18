---
agent_id: hermes
session_id: avondeten-en-onderhoud
timestamp: 2026-08-18T21:33:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Avondeten loggen + PyYAML-fix + SOP-024 YAML-fix

## Context

Vervolg op de sessie "YouTube MCP-server onderzoek" (afgesloten om 21:33). Sander meldde zijn avondeten na, wat leidde tot het herstellen van een kapotte mypka.db-mirror-regeneratie en een YAML-syntaxfout in een SOP.

## What we did

- Hermes logde het avondeten (gehaktbal, aardappelkraté, bietensalade) in `PKM/Journal/2026/08/2026-08-18-voedingslogboek.md` via `food_log.py append-meal`, met een grove voedingswaarde-schatting (confidence: low, vanwege onduidelijke "aardappelkraté").
- Regeneratie van de mypka.db-spiegel faalde met `ModuleNotFoundError: No module named 'yaml'`. Na akkoord van Sander installeerde Hermes PyYAML voor de Homebrew python3.14-interpreter (`pip3 install --user --break-system-packages pyyaml`, want Homebrew's Python is externally-managed en heeft geen pyyaml-formule).
- Regeneratie liep daarna door, maar meldde een frontmatter-parsefout in `SOP-024-video-monteren-in-davinci-resolve.md` (komma-gescheiden gequote trigger-voorbeelden op één regel, ongeldige YAML). Na akkoord van Sander repareerde Hermes dit door de drie voorbeeldzinnen op te splitsen in losse lijst-items, conform de conventie in andere SOP's (bv. SOP-018).
- Regeneratie opnieuw gedraaid ter verificatie: geen waarschuwingen meer.
- Alle wijzigingen gecommit en gepusht (`d3c59b9`).

## Decisions made

- **Question:** Hoe de kapotte PyYAML-dependency oplossen gegeven Homebrew's externally-managed-environment-blokkade?
  **Decision:** `pip3 install --user --break-system-packages pyyaml` — pip's eigen aanbevolen route voor een pure-Python library voor één gebruiker, geen Homebrew-formule beschikbaar.

## Insights

- De mypka.db-mirror-regeneratie (`regen-mypka-db.py`) heeft een harde runtime-dependency op PyYAML die niet in de standaard Homebrew-Python zit — dit kan bij een verse machine-setup opnieuw misgaan. Mogelijk het waard om dit als expliciete dependency te documenteren in `Expansions/mypka-cockpit/INSTALL.md` (niet gedaan deze sessie, buiten scope).
- SOP-024 had al langer een onopgemerkte YAML-syntaxfout in de frontmatter (komma-gescheiden gequote strings binnen één lijst-item is ongeldige YAML) — de mirror behandelde de SOP stilzwijgend als platte tekst i.p.v. gestructureerde data, zonder dat dit eerder opviel.

## Realignments

- _(geen dit sessie)_

## Open threads

- [ ] Overwegen om PyYAML als expliciete dependency te documenteren in `Expansions/mypka-cockpit/INSTALL.md` zodat een verse machine-setup deze fout niet herhaalt. Geen deadline, niet aangevraagd door Sander.

## Next steps

- Geen. Sessie is volledig afgerond en gepusht.

## Cross-links

- `[[2026-08-18-21-19_hermes_youtube-mcp-server-onderzoek]]` — voorafgaande sessie waaruit deze is voortgekomen.

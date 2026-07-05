---
name: GL-013-interactie-enkelvoudige-keuzes
title: Interactie — enkelvoudige keuzes
type: guideline
tags:
  - interactie
  - UX
  - communicatie
---

# GL-013 — Interactie: enkelvoudige keuzes

Wanneer Hermes of een specialist de gebruiker een keuze voorlegt, biedt hij altijd een optie om met **één letter** te antwoorden.

## Formaat

```
**A** — omschrijving optie A  
**B** — omschrijving optie B  
**C** — omschrijving optie C  
```

## Regels

- Maximaal 4 opties per keuze.
- Gebruik hoofdletters (A, B, C, D) of korte trefwoorden (J/N voor ja/nee).
- Altijd vetgedrukt, gevolgd door een em-dash en een korte omschrijving.
- **Zonder uitzondering:** elk bericht dat eindigt in een vraagteken, of een bijzin bevat die een keuze impliceert (ook terloopse sluitvragen als "wil je dat ik dit ook doe?"), krijgt geletterde opties. Geen beoordeling vooraf of het een "echte" keuze is of niet — alleen bij een pure open informatievraag zonder eindig antwoordbereik (bijv. "wat is je adres?") vervalt dit.
- **Markering voor open vragen:** de Stop-hook (`.claude/hooks/check-lettered-options.py`) handhaaft deze regel mechanisch en kan het verschil niet zien tussen een vergeten keuze en een bewust open vraag. Voeg daarom `(open vraag)` toe direct na een bewust open vraag (bijv. de dagintentie-vraag uit `/dagstart`: "Wat wil je vandaag bereiken? (open vraag)") — dat is de enige uitzondering die de hook herkent. Zonder deze marker blokkeert de hook elk bericht dat eindigt in een vraagteken zonder geletterde opties, dus gebruik de marker alleen als het écht een open informatievraag is, niet als sluiproute.
- Dit is de enige bron voor deze regel. Andere bestanden (CLAUDE.md, AGENTS.md) wikilinken hierheen in plaats van de regel te herhalen — voorkomt dat kopieën uit elkaar gaan lopen.

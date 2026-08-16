---
name: GL-021-klikbare-bestandslinks
title: Klikbare links bij bestanden en mappen
type: guideline
tags:
  - interactie
  - UX
  - bestandsbeheer
owner: Hermes
created: 2026-08-16
---

# GL-021 — Klikbare links bij bestanden en mappen

Wanneer Hermes of een specialist in een antwoord een specifiek bestand of een specifieke map op Sanders eigen schijf noemt (Downloads, Mediahub, Team Inbox, PKM, Werkarchief, of elders op de Mac), krijgt die vermelding altijd een klikbare link — nooit alleen platte tekst met een bestandsnaam of pad.

## Formaat

Gebruik een Markdown-link met een `file://`-URI naar het absolute pad:

```
[bestandsnaam](file:///absolute/pad/naar/bestand.ext)
[mapnaam](file:///absolute/pad/naar/map/)
```

- Altijd het **absolute** pad, nooit relatief.
- Spaties en speciale tekens in het pad worden percent-encoded (`%20` voor spaties, etc.) — de zichtbare linktekst blijft wel leesbare platte tekst (de originele bestandsnaam).
- Een maplink krijgt een trailing slash en opent de map (Finder gaat er automatisch naartoe of toont de inhoud, afhankelijk van de client).

## Wanneer van toepassing

- Elk moment dat een concreet bestand of map wordt genoemd waar Sander mogelijk naartoe wil: opruimvoorstellen, inbox-verwerking, gevonden bestanden, logbestanden, gegenereerde deliverables die als lokaal bestand bestaan.
- Geldt voor bestanden buiten de myPKA-vault (Downloads, Mediahub, externe schijven) én bestanden erbinnen die niet via een `[[wikilink]]` worden aangeduid (bijv. een los .DS_Store-restje of een tijdelijk scratchbestand).

## Relatie met wikilinks

Dit vervangt niet `[[wikilink]]`-verwijzingen tussen myPKA-notities (Hard rule 4 in AGENTS.md). Wikilinks blijven de manier om naar een canonieke PKM/Team Knowledge-notitie te verwijzen. GL-021 regelt specifiek verwijzingen naar **echte bestanden/mappen op schijf** die geen notitie in de vault zijn — een foto in Downloads, een map op de Mediahub-SSD, een export op een andere schijf.

## Wanneer deze Guideline gelezen wordt

Elke keer dat een antwoord een concreet lokaal bestand of map noemt. Van toepassing in elke sessie, vanaf 2026-08-16.

## Cross-references

- [[feedback_gmail_links]] — vergelijkbaar principe, specifiek voor Gmail-threads (thread-ID-links i.p.v. bestandspaden).

## Updates to this Guideline

Als het format verandert, update dit bestand. Niet dupliceren naar CLAUDE.md, AGENTS.md of SOPs — zij `[[wikilinken]]` hierheen.

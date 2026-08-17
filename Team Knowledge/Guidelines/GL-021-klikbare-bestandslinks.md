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

⚠️ **Verbreed op 2026-08-17:** dit geldt sindsdien ook binnen de vault — taken (`PKM/Tasks/`), Deliverables, sessielogs, SOPs, Guidelines, Workstreams, kortom elk bestand dat in een antwoord genoemd wordt, ongeacht of het een wikilink-waardige PKM-notitie is. Reden: de Cockpit's `#/resolve/`-route (browser-klikbaar) werkt alleen voor het deel van de vault dat in `mypka.db` gemirrord is (geverifieerd: personen wél, Guidelines/Deliverables/taken niét) — een `file://`-link is de enige vorm die gegarandeerd voor alles werkt, zonder dat er per vermelding geverifieerd hoeft te worden of iets gemirrord is. Sander koos expliciet voor deze simpele, altijd-werkende variant boven een duurdere hybride met Cockpit-links waar mogelijk (optie B, afgewezen — extra tokens voor iets dat niet consistent werkt).

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

- **In elk antwoord aan Sander** (chatberichten, niet de inhoud van vastgelegde documenten zelf): elk moment dat een concreet bestand, map, taak, Deliverable, sessielog of ander vastgelegd document wordt genoemd — opruimvoorstellen, inbox-verwerking, gevonden bestanden, logbestanden, dagstart-taken, review-documenten, kortom alles waar Sander mogelijk naartoe wil of actie op wil ondernemen.
- Geldt voor bestanden buiten de myPKA-vault (Downloads, Mediahub, externe schijven) én voor bestanden erbinnen (taken, Deliverables, Guidelines, SOPs, sessielogs, PKM-notities).

## Relatie met wikilinks

Binnen **vastgelegde documenten zelf** (een sessielog dat naar een SOP verwijst, een taakbestand dat naar een Project verwijst) blijft `[[wikilink]]` de juiste vorm — dat verandert niet (Hard rule 4 in AGENTS.md), en is hoe de vault z'n eigen graaf/backlinks opbouwt.

GL-021 gaat over iets anders: **wat Hermes in een chatbericht aan Sander typt.** Daar is een `[[wikilink]]` niet klikbaar — die wordt dus altijd (ook) als `file://`-link gegeven, ongeacht of het bestand een PKM-notitie is of een los bestand op schijf.

## Wanneer deze Guideline gelezen wordt

Elke keer dat een antwoord een concreet lokaal bestand of map noemt. Van toepassing in elke sessie, vanaf 2026-08-16.

## Cross-references

- [[feedback_gmail_links]] — vergelijkbaar principe, specifiek voor Gmail-threads (thread-ID-links i.p.v. bestandspaden).

## Updates to this Guideline

Als het format verandert, update dit bestand. Niet dupliceren naar CLAUDE.md, AGENTS.md of SOPs — zij `[[wikilinken]]` hierheen.

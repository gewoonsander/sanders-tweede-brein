---
agent_id: hermes
session_id: bestel-en-verzendmail-opschoning
timestamp: 2026-08-14T16:15:00+02:00
type: proactive
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Bestel- en verzendmail opschonen

## Context

Sander wil historische automatische bestelbevestigingen en logistieke statusupdates uit Gmail verwijderen, maar facturen en gelijkwaardige financiële bewijsstukken altijd behouden.

## What we did

- Pieter Post doorzocht Gmail mailboxbreed op Nederlandse en Engelse bestelbevestigingen, verzend-, bezorg-, afhaal- en trackingmeldingen.
- Pieter verplaatste 117 automatische berichten zonder bijlage en zonder factuurtaal naar de Gmail-prullenbak.
- Pieter hield 60 aangetroffen financiële berichten en tien potentiële correspondentie- of uitzonderingsberichten buiten de oorspronkelijke selectie.
- Hermes legde de permanente behandelregel vast in `[[Team/Pieter Post - Emailregisseur/AGENTS]]`.

## Decisions made

- **Question:** Welke historische bestel- en verzendmail blijft bewaard?
  **Decision:** Facturen en gelijkwaardig financieel bewijs blijven bewaard, ook bij een factuurlink; automatische, achterhaalde bestel- en logistieke statusmeldingen mogen weg.
- **Question:** Mogen nieuwe bestelbevestigingen direct weg?
  **Decision:** Nog niet. Pieter houdt nieuwe bestelbevestigingen vast totdat de relevante bestelgegevens eerst canoniek in myPKA kunnen worden vastgelegd.

## Insights

- Niet iedere PDF bij een bestelmail is financieel bewijs: voorwaarden, retourformulieren, pakbonnen en verzendlijsten moeten afzonderlijk van facturen worden beoordeeld.

## Realignments

- Sander maakte duidelijk dat bestelbevestigingen historisch geen waarde meer hebben, maar dat toekomstige bestelbevestigingen eerst informatie aan myPKA moeten kunnen leveren.

## Open threads

- [ ] Ontwerp de myPKA-procedure en het canonieke gegevensmodel voor nieuwe bestelbevestigingen.
- [ ] Beoordeel resterende historische statusmails met niet-financiële bijlagen afzonderlijk voordat ze worden verwijderd.

## Next steps

- Bij een volgend ontwerpgesprek bepaalt Hermes met Sander welke bestelgegevens, bronlink, status en eventuele opvolging in myPKA thuishoren.

## Cross-links

- `[[2026-08-14-pieter-post-gmail-todoist-design]]`

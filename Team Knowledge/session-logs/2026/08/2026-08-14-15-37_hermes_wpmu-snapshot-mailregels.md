---
agent_id: hermes
session_id: wpmu-snapshot-mailregels
timestamp: 2026-08-14T15:37:00+02:00
type: realignment
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# WPMU DEV-rapporten archiveren en snapshotfouten verwijderen

## Context

Sander verduidelijkte dat alle WPMU DEV Automate-, UP- en DOWN-meldingen in Updates gelezen en gearchiveerd mogen worden. Meldingen over mislukte tweede-brein snapshot-runs mogen worden verwijderd.

## What we did

- Pieter Post markeerde 41 WPMU DEV Automate- en uptimeberichten als gelezen en archiveerde ze.
- Pieter Post verplaatste zeven GitHub-meldingen over mislukte `Notify snapshot consumers`-runs naar de Gmail-prullenbak.
- Hermes werkte de permanente regels in [[Team/Pieter Post - Emailregisseur/AGENTS]] bij.

## Decisions made

- **Question:** Moeten WPMU DEV Automate-rapporten met fouten apart worden behandeld? **Decision:** Nee; ook die rapporten worden gelezen en gearchiveerd zonder mailtaak.
- **Question:** Wat gebeurt met tweede-brein snapshot-run-foutmeldingen? **Decision:** De Gmail-notificaties mogen direct naar de prullenbak.

## Insights

- Het verwijderen van een foutnotificatie uit Gmail bewijst niet dat de onderliggende technische fout is opgelost.

## Realignments

- Eerdere regel: WPMU DEV-updatefouten afzonderlijk beoordelen. Nieuwe regel: alle `Automate report`-berichten archiveren, ook bij gemelde fouten.

## Open threads

- [ ] De onderliggende snapshot-workflow kan technisch nog falen; deze mailregel lost dat niet op.

## Next steps

- Pieter past beide vaste regels toe bij volgende inboxrondes.

## Cross-links

- [[Team/Pieter Post - Emailregisseur/AGENTS]]

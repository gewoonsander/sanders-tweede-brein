---
agent_id: hermes
session_id: gratis-binnen-bestaande-stack
timestamp: 2026-08-14T16:35:00+02:00
type: realignment
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Gratis oplossingen binnen de bestaande stack

## Context

Bij het ontwerp voor automatisch ophalen van KPN-facturen verduidelijkte Sander zijn structurele kostenvoorkeur.

## What we did

- Athena verwerkte de kostenrandvoorwaarde in `[[2026-08-14-kpn-facturen-automatisch-ophalen]]`.
- Hermes begrensde de toegang: geheimen blijven buiten chat en myPKA; Sander voert ze zelf in, waarna Pieter binnen de bestaande browsersessie kan handelen.

## Decisions made

- **Question:** Welke oplossingsklasse heeft standaard de voorkeur?
  **Decision:** Eerst gratis mogelijkheden en functies binnen Sanders bestaande softwarestack; nieuwe betaalde diensten zijn pas een latere, expliciet afgewogen optie.

## Insights

- Begeleide browserbediening kan terugkerend handwerk verminderen zonder een extra dienst, maar is niet hetzelfde als betrouwbare onbeheerde automatisering.

## Realignments

- Sander: "Ik wil zoveel mogelijk gratis oplossingen of in ieder geval oplossingen die binnen mijn huidige software stack vallen."

## Open threads

- [ ] Vaststellen of Sanders huidige KPN-abonnementen via het bestaande Jortt-account kosteloos aan Peppol gekoppeld kunnen worden.

## Next steps

- Eerst Jortt/Peppol en KPN-instellingen verifiëren; pas daarna een browserterugval ontwerpen.

## Cross-links

- `[[2026-08-14-kpn-facturen-automatisch-ophalen]]`

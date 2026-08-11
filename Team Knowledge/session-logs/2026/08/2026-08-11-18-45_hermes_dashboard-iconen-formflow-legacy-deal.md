---
agent_id: hermes
session_id: dashboard-iconen-formflow-legacy-deal
timestamp: 2026-08-11T18:45:00+02:00
type: close-session
linked_sops:
  - SOP-017-verwerk-voedingsregistratie
linked_workstreams: []
linked_guidelines:
  - GL-003-design-system
---

# Dashboardiconen en Formflow-legacy-deal onderzocht

## Context

Sander vroeg eerst waar de symbolen in het myPKA Cockpit-dashboard vandaan
komen en of hierover ontwerpafspraken bestaan. Daarna vroeg hij om onderzoek
naar Formflow, registratie in zijn softwarestack en concrete gebruiksideeën.

## What we did

- Harmonia en Bezalel herleidden de dashboardiconen tot Lucide, met een beperkte
  Simple Icons-uitzondering voor herkenbare platformmerken.
- Harmonia legde het iconografiecontract vast in
  `Expansions/mypka-cockpit/CUSTOMIZE.md`.
- Athena onderzocht Formflow via officiële bronnen en een onafhankelijke tweede
  zoekroute en schreef [[2026-08-11-formflow-onderzoek]].
- Na Sanders login controleerde Athena de billingpagina read-only en bevestigde
  de precieze Lifetime (legacy)-rechten.
- Penn registreerde de leverancier in [[formflow]] en voegde Formflow toe aan
  [[software-en-tools]].
- Penn markeerde het voedingslogboek van 11 augustus 2026 als compleet via
  [[SOP-017-verwerk-voedingsregistratie]].
- Atlas regenereerde de afgeleide `mypka.db`-mirror.

## Decisions made

- **Vraag:** Welke iconenfamilie hoort bij het Cockpit? **Besluit:** Lucide is
  de enige algemene UI-familie; Simple Icons mag uitsluitend voor officiële
  platformmerken worden gebruikt.
- **Vraag:** Is Formflow het behouden waard? **Besluit:** ja. Het geverifieerde
  lifetime-plan heeft geen terugkerende kosten en voldoende capaciteit voor
  gerichte funnels en intakes.
- **Vraag:** Hoe behandelen we Niels Haverdil en Niels van Zanten? **Besluit:**
  dit zijn twee verschillende personen; beide records blijven behouden.

## Insights

- Formflow past het beste bij interactieve kwalificatie en segmentatie, niet
  bij een gewoon contactformulier.
- Kansrijke toepassingen zijn DartsCoaching-intake, Dart Buddies-onboarding,
  workshopinschrijving en een Darttactiek-quiz of trainingsscan.
- Formflow wordt niet ingezet voor zorg- of bijzondere persoonsgegevens totdat
  AVG, verwerkersvoorwaarden, datalocatie en beveiliging afzonderlijk zijn
  beoordeeld.

## Realignments

- _(none this session)_

## Open threads

- [ ] Kies later één kleine Formflow-proef, bij voorkeur een compacte
  DartsCoaching-kwalificatieflow.
- [ ] De installatiestatus van de losse `mypka-cockpit` Expansion-map is niet in
  deze sessie onderzocht.

## Next steps

- Bij een volgende Formflow-sessie eerst de bestaande live darttrainingflows
  beoordelen voordat een nieuwe flow wordt gebouwd.

## SSOT / structural fixes

- [[formflow]] is de canonieke bron voor accountrechten en dealgegevens;
  [[software-en-tools]] en [[2026-08-11-formflow-onderzoek]] verwijzen ernaar.
- Nieuwe bestanden zijn onderling gelinkt en daardoor niet verweesd.
- Geen tijdens deze sessie verwerkte Team Inbox-bestanden hoeven te worden
  verwijderd.
- De grote-bestandencontrole vond geen bestanden boven 80 MB buiten `.git`.

## Cross-links

- [[2026-08-11-10-45_hermes_dartsatlas-scraper-cockpit-tab-tailscale]]

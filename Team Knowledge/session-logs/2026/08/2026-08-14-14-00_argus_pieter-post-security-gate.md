---
agent_id: argus
session_id: pieter-post-onderzoek
timestamp: 2026-08-14T12:00:00Z
type: end-of-session
linked_sops:
  - SOP-004-argus-security-audit
linked_workstreams: []
linked_guidelines:
  - GL-012-pkm-vs-todoist
  - GL-019-persoonlijke-taakarchitectuur
---

# Securitygate Pieter Post

Ik heb alle vier de auditfasen uitgevoerd op de ontworpen Pieter Post-keten. Ik heb geen mailboxinhoud of credentialwaarden bekeken of gelogd. De pilot is conditioneel vrijgegeven voor handmatige, concept-only verwerking via Hermes. Todoist-projectie, mailboxwrites, inhoudelijke bijlageverwerking en Jortt/Dropbox-automatisering blijven geblokkeerd.

Belangrijkste methodologische keuze: ik heb de historische `.env`-blootstelling via commitmetadata en de bestaande audit bewezen zonder tokenwaarden te tonen. Daarna zijn historische en huidige waarden uitsluitend gehasht vergeleken en via statuscodes getest. De hashes verschilden; de historische token gaf `401` en de huidige `200`. De centrale credentialblocker is daarmee gesloten. Het volledige bewijs en de resterende vrijgavecriteria staan in [[2026-08-14-pieter-post-security-audit]].

Volgende audit leest de daadwerkelijke Google consent/scopes, test de technische capability-allowlist negatief en verifieert tokenrotatie en bijlagequarantaine.

## Update — Google-toegang geverifieerd

Na Sanders eigen login heb ik read-only de Google-pagina voor gekoppelde apps gecontroleerd. Het account is `sander@gewoonsander.nl`. `Claude for Gmail` heeft toegang tot profielgegevens en tot Gmail lezen, opstellen, concepten beheren en verzenden. De revoke-route `Alles verwijderen` is zichtbaar. Er is niets gewijzigd. Omdat de scope ook verzending omvat, blijft een technische Pieter-allowlist noodzakelijk voor de concept-only pilot.

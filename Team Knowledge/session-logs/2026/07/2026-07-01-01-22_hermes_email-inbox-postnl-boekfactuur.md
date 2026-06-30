---
agent_id: hermes
session_id: 2026-07-01-email-inbox-postnl-boekfactuur
timestamp: 2026-07-01T01:22:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-001-file-naming-conventions"]
---

# Gmail inbox opschonen + PostNL verzendautomatisering ontwerp

## Context

Vervolgsessie na context-compactie. Vorige sessie had heleen@praktijkvoluitleven.nl email gefixed (DNS/MX via WPMU Dev) en Gmail gedeeltelijk opgeschoond. Deze sessie voltooide de inbox en startte een nieuw development-traject: PostNL verzendlabel automatisering via Plug&Pay webhook.

## What we did

- **Hermes** verwerkte Zonhub rente Zonnedak Straman email — gegevens kloppen (adres, IBAN, energieleverancier Pure Energie klantnr 146994), uitbetaaldatum 10 augustus. Gearchiveerd.
- **Hermes** verwerkte RDB huldiging uitnodiging (vrijdag 3 juli, 19:00, Dorpshuis de Hucht Alphen) — D.T. Irritant gaat, niet het hele team. Concept-reply aangemaakt in Gmail-drafts naar voorzitter@rdbdarts.nl. Gearchiveerd.
- **Daedalus** brainstormde PostNL verzendautomatisering voor boekbestellingen via Plug&Pay. Design-doc geschreven naar `Deliverables/2026-07-01-postnl-verzending-design.md`.
- **Hermes** verwerkte factuur DB20260018 (Mark van Ovost, Waemelslant 85 Westervoort, Darttactiek boek 1×, €31,25) — gearchiveerd in `PKM/Documents/2026-06-22-factuur-db20260018-mark-van-ovost.pdf`, Todoist-taak aangemaakt voor verzending (vandaag, p2).
- **Daedalus** ontving ontwerp-goedkeuring en startte implementatie fase 1 (Plug&Pay webhook → n8n → PostNL CSV → mail).

## Decisions made

- **PostNL aanpak**: Aanpak C (Plug&Pay webhook als trigger) + fase 1 (CSV output), fase 2 (PostNL API) zodra API-key beschikbaar. Gekozen omdat Plug&Pay orderbevestigingen een vast formaat hebben — geen email-parsing nodig.
- **RDB huldiging**: Sander gaat (niet volledig team). Reply draft klaar, Sander verstuurt zelf.

## Insights

- Bestellingen voor "Darttactiek van beginner tot professional" komen via Plug&Pay met gestructureerde orderdata — ideale webhook-trigger, robuuster dan Gmail-parsing.
- PostNL Shipping API vereist apart API-account aanvragen (1–3 werkdagen). Fase 1 met CSV is direct inzetbaar overbrugging.

## Realignments

- _(none this session)_

## Open threads

- [ ] **Dartbuddies nieuwe order** — inbox-item 6 nog niet behandeld (thread 19eefd66d31e4665)
- [ ] **RDB huldiging reply** — draft staat klaar, Sander moet zelf versturen in Gmail
- [ ] **PostNL fase 1 implementatie** — Daedalus aan het bouwen, nog geen resultaat ontvangen bij sessie-einde
- [ ] **PostNL API-key aanvragen** — nodig voor fase 2; Sander moet dit zelf doen via developer.postnl.nl
- [ ] **mailbuddie.html verwijderen** — Sander moet via WP Admin Defender scanresultaten het testbestand deleten
- [ ] **Heleen mail settings doorsturen** — IMAP/SMTP mail.mailconfig.net:993/465 — check of DNS propagatie gelukt is
- [ ] **Versio opzeggen** — na bevestiging DNS propagatie praktijkvoluitleven.nl
- [ ] **Boek verzenden Mark van Ovost** — Waemelslant 85, 6931HT Westervoort (Todoist-taak aangemaakt)

## Next steps

- Resultaat Daedalus fase 1 (n8n workflow PostNL CSV) afhandelen
- Dartbuddies email verwerken
- Versio opzegging initiëren na DNS-check

## Cross-links

- `[[2026-06-30-15-00_hermes_dagstart-eboekhouden-apparaten-pkm-sync]]`
- `[[2026-06-30-16-30_hermes_icloud-cleanup-inbox-permissies]]`

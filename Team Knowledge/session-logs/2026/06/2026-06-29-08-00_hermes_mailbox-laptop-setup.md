---
agent_id: hermes
session_id: mailbox-laptop-setup
timestamp: 2026-06-29T08:00:00+02:00
type: close-session
linked_sops: ["SOP-013-inboxen-verwerken"]
linked_workstreams: []
linked_guidelines: []
---

# Mailbox opruimen + MacBook opzetten als tweede werkplek

## Context

Ochtendsessie. Sander wilde zijn mailbox opruimen en vervolgens zijn MacBook inrichten als volwaardige tweede werkplek voor zijn tweede brein, gesynchroniseerd met de Mac mini.

## What we did

- **Hermes** haalde inbox op via Gmail MCP (67 threads) en categoriseerde alles: actie vereist, kalender, facturen, ruis.
- **Hermes** archiveerde 33 ruis-threads en 4 kalenderuitnodigingen in één keer.
- **Hermes** sloeg twee feedback-memories op:
  - Gmail-links altijd toevoegen aan overzichten (thread-ID → klikbare URL)
  - Ja/nee vragen altijd als (A)/(B) presenteren
- **Hermes** besprak factuur-workflow (n8n) — bewaard als spawn-task voor later.
- **Hermes** verplaatste `.claude/memory/` naar de git-repo en maakte een symlink aan op de Mac mini — geheugen reist nu mee via GitHub.
- **Hermes** zette de MacBook stap voor stap op: Homebrew → Node.js → Claude Code → git clone → symlink geheugen → alias `brein`.
- **Hermes** installeerde alias `brein` op beide machines: `git pull` + `claude .` in één commando.

## Decisions made

- **Vraag:** Hoe geheugen synchroniseren tussen machines?
  **Beslissing:** `.claude/memory/` in git-repo zetten, symlink op elke machine. Geen aparte sync-tool nodig.

- **Vraag:** Prullenmand automatisch leegmaken bij inboxroutine?
  **Beslissing:** Nee — Hermes vraagt bevestiging. Onomkeerbare acties blijven bij Sander.

- **Vraag:** Gmail filters inzien?
  **Beslissing:** Niet mogelijk via huidig MCP. n8n-workflow bouwen als structurele oplossing voor factuurverwerking (bewaard als spawn-task).

## Insights

- Alias `brein` = de standaard manier om Claude Code te starten op beide machines. Bevat automatisch `git pull` als sync-stap.
- De `close-session` routine is niet alleen voor het log — het is ook het sync-moment (commit + push). Zonder dit mist de andere machine wijzigingen.
- Gmail thread-links: `https://mail.google.com/mail/u/0/#inbox/[thread_id]` — altijd meegeven in overzichten.

## Realignments

- Hermes presenteerde geen proactieve oplossing voor Gmail filters via n8n. Sander wees hier terecht op: altijd de meest efficiënte oplossing voorstellen, ook als daar eenmalig werk voor nodig is.

## Open threads

- [ ] **n8n factuur-workflow** — Gmail trigger → Todoist taak → doorsturen naar boekhouding. E-mailadres boekhouding nog uitvragen. (spawn-task aangemaakt)
- [ ] **Telegram sync-check** — n8n workflow die waarschuwt als Mac mini ongesynchroniseerde wijzigingen heeft
- [ ] **dartscoaching.nl DOWN** — [mail](https://mail.google.com/mail/u/0/#inbox/19f113510cd14ea2) — nog niet opgelost
- [ ] **GitGuardian secret exposed** — [mail](https://mail.google.com/mail/u/0/#inbox/19f0e461e28fdd1d) — repo sanders-tweede-brein
- [ ] **Malware scan gewoonsander.nl** — [mail](https://mail.google.com/mail/u/0/#inbox/19f07eb216f299a7) — mailbuddie.html
- [ ] **BTW-aangifte Q2 2026** — deadline 31 juli
- [ ] **Facturen inbox** — KPN Thuis, KPN Mobiel, Versio, GoDaddy — nog niet verwerkt
- [ ] **Bart jaarafsluiting + VMB factuur €211,75** — achterstallig
- [ ] **e-Boekhouden exporteren en opzeggen**

## Next steps

- Vandaag 14:00: verbouwingsgesprek met Marieke
- dartscoaching.nl DOWN-situatie onderzoeken
- GitGuardian secret oplossen
- n8n factuur-workflow bouwen (spawn-task)

## Cross-links

- `[[2026-06-28-22-00_hermes_adc-facebook-n8n-inboxen]]` — vorige sessie

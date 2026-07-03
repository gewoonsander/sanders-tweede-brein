---
agent_id: hermes
session_id: dagstart-gl013-hook-fix
timestamp: 2026-07-03T07:57:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes"]
---

# Dagstart + structurele fix voor de geletterde-opties-regel

## Context

Korte ochtendsessie: dagstart uitgevoerd, een nieuwe afspraak toegevoegd, en — de kern van de sessie — Sander confronteerde Hermes met het herhaaldelijk vergeten van geletterde keuzeopties (GL-013), ondanks bestaande instructies. Dit leidde tot een structurele, mechanische oplossing in plaats van nog een keer "beter opletten".

## What we did

- **Hermes** voerde `/dagstart` uit: agenda, taken (today|p1), Team Inbox-status.
- **Hermes** voegde "overleg > Bart (boekhouder)" toe aan de agenda (16:00-17:00, 3 juli).
- **Hermes** analyseerde zelf waarom de GL-013-regel structureel gemist werd (leunt op "onthouden tijdens schrijven", geen mechanische check) en presenteerde 3 opties: (A) hook, (B) regel versimpelen, (C) zelf-check per bericht — met tokenkosten-vergelijking op verzoek (C fors duurder, A/B verwaarloosbaar).
- **Hermes** voerde beide gekozen opties door:
  - **B:** GL-013 herschreven als enige bron (CLAUDE.md's dubbele kopie vervangen door een wikilink), met een expliciete "zonder uitzondering"-clausule die het oude "niet bij open informatievragen"-achterdeurtje dichtte.
  - **A:** nieuwe Stop-hook (`.claude/hooks/check-lettered-options.py`) die het laatste assistant-bericht scant: eindigt het op een vraagteken zonder `**A**`-patroon, dan blokkeert de hook met een GL-013-verwijzing. Getest tegen 3 synthetische transcript-scenario's (overtreding/correct/leeg) — alle drie correct. Geregistreerd in `.claude/settings.json`.

## Decisions made

- **Question:** Hoe GL-013-nalevendheid structureel afdwingen i.p.v. op geheugen vertrouwen?
  **Decision:** Zowel A (mechanische hook) als B (regel versimpelen, één bron) — geen C (zelf-check), want dat kost tokens op elk bericht zonder structureel betrouwbaarder te zijn dan de huidige aanpak.

## Insights

- Een instructie die "meestal" werkt bij grote, expliciete keuzes glipt juist weg bij kleine, terloopse sluitvragen — het onderliggende probleem is dat nalevendheid op modelgeheugen leunt in plaats van op een mechanische check.
- Twee kopieën van dezelfde regel (CLAUDE.md + GL-013) met net iets verschillende formulering is zelf een risicofactor — ze kunnen uit elkaar gaan lopen. Vandaar nu één bron met een wikilink.
- Sanders eigen sluitende bevestiging na de hook-uitleg ("Wil je dat zelf even doen...") bevatte zelf geen geletterde opties — een live demonstratie van precies het probleem, vóór de hook actief was.

## Realignments

- _(geen — Sander corrigeerde geen aanpak, wel confronteerde hij met herhaald gedrag wat tot de GL-013-fix leidde)_

## Open threads

- [ ] **Hook nog niet bevestigd actief** — Sander moet de sessie herstarten (kan ik niet zelf) zodat de settings-watcher de nieuwe Stop-hook oppikt. Bij volgende sessie checken of de hook daadwerkelijk vuurt.
- [ ] Overleg met Bart (boekhouder) vandaag 16:00-17:00 — mogelijk relevant voor e-Boekhouden/Jortt/Versio-facturatie, nog niet voorbereid.

## Next steps

- Bij volgende sessie: bevestigen dat de Stop-hook actief is (test met een bewust niet-gelet­terde vraag, of check via een korte dry-run).
- Voorbereiden voor het Bart-overleg indien Sander dat alsnog wil, vóór 16:00.

## Cross-links

- `[[2026-07-01-22-19_hermes_todoist-format-versio-cursusworkflow]]` — vorige sessie, waar GL-014 op eenzelfde manier (nieuwe Guideline) werd vastgelegd

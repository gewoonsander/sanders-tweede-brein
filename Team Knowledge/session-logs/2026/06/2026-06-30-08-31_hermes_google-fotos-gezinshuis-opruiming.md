---
agent_id: hermes
session_id: google-fotos-gezinshuis-opruiming
timestamp: 2026-06-30T08:31:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-001-file-naming-conventions", "GL-013-interactie-enkelvoudige-keuzes"]
---

# Google Foto's 2017 + 2014 volledig verwerkt; Gezinshuis Gewoon Thuis naar iCloud

## Context

Vervolgsessie op `[[2026-06-29-17-00_hermes_macbook-pro-documenten-opruiming]]`. Doel: de `~/Google Drive test/Google Foto's/` map volledig leegmaken. De 2016-map was al klaar; de 2017-map was half verwerkt in een vorige context die was gecomprimeerd. Aanvullend: `Gezinshuis Gewoon Thuis/` verwerkt naar iCloud.

## What we did

- **Hermes** heeft de 3 resterende pre-juni 2017 foto's bekeken via vision:
  - `IMG_20170525_092420.jpg` → logisch raadsel fietspetjes (KEEPER)
  - `IMG_20170529_154128.jpg` → Ajam kerrie + Soto ajam recept (KEEPER)
  - `IMG_20170602_175904.jpg` → generieke file snelweg (DELETE)
- **Hermes** heeft de volledige 2017-batch uitgevoerd (op gebruikersbevestiging "a"):
  - 19 bestanden verwijderd (near-dups, wazige opnames, generieke foto's, FB-meme)
  - 106 foto's + 9 video's hernoemd naar GL-001 kebab-case en verplaatst naar `~/Library/CloudStorage/GoogleDrive-sander@gewoonsander.nl/Mijn Drive/fotos/`
  - Lege 2017-map verwijderd uit bronlocatie
- **Hermes** heeft de 2014-map (24 bestanden, al hernoemd in vorige sessie) direct verplaatst naar Google Drive `fotos/` — map verwijderd.
- **Hermes** heeft `Gezinshuis Gewoon Thuis/` (19 bestanden, cliëntdossier Yoram de Wilde) hernoemd naar GL-001 kebab-case en verplaatst naar `iCloud/05-bijdrage/gewoon-thuis/documenten/` (logo → `assets/`).
- **Hermes** heeft uitgelegd dat `Google Drive test` actief gesynchroniseerd wordt als "Computers"-backup (2,2 GB) in Google Drive for Desktop — bestanden die we lokaal verwijderen verdwijnen ook uit die online backup.
- **Hermes** heeft `a inbox/` (45 bestanden) verwerkt: 37 verwijderd (snelkoppelingen + waardeloze bestanden), 8 hernoemd en verplaatst naar iCloud (loonstroken, admin, gewoon-thuis, groei, geloof).
- **Hermes** heeft vastgesteld dat `d archief/` 711 bestanden bevat in 5 submappen (niet 9.568 zoals eerder geschat).
- **Hermes** heeft de n8n/lokale AI-optie besproken voor `d archief/` — aanbeveling: Ollama op Mac mini M4 Pro (gratis, snel) of GPT-4o-mini via OpenAI API (~€1–5, Sander heeft €50 credits).
- **Hermes** heeft apparaten-memory aangemaakt: Mac mini M4 Pro, MacBook Pro Intel i7 16GB, MacBook Air, iPhone.

## Decisions made

- **Vraag:** Zijn de verwijderde bestanden ook online verdwenen?
  **Beslissing/inzicht:** Ja — `Google Drive test` is een actieve Computers-sync. Verwijderde bestanden staan 30 dagen in de Drive-prullenbak. Keepers zijn nu correct in `Mijn Drive/fotos/`.
- **Vraag:** `Google Drive test` uitvinken als gesynchroniseerde map?
  **Beslissing:** Nog niet uitgevoerd — Sander sloot de sessie af voor `a inbox/` en `d archief/` waren verwerkt. Aanbeveling: uitvinken zodra die twee mappen ook leeg zijn.

## Insights

- `Google Drive test` was de oude Backup & Sync locatie; nu actief als "Mijn laptop > Computers" in Google Drive for Desktop. Zodra de map leeg is, kan Sander haar uitvinken in de Drive-instellingen.
- .gdoc-bestanden (Google Docs-snelkoppelingen) zijn meegenomen naar iCloud maar werken alleen online — Sander is hiervan op de hoogte gesteld.

## Realignments

- _(none this session)_

## Open threads

- [x] `a inbox/` — verwerkt deze sessie
- [ ] `d archief/` (711 bestanden, 5 submappen: Gewoon Sander, afbeeldingen, ebooks, prive, 1 pptx) — volgende sessie op Mac mini
- [ ] **Digitale-kleurenmeter op Google Drive opruimen** — Sander wil dit aanpakken, volgende sessie starten
- [ ] `Google Drive test` uitvinken als Computers-sync in Google Drive app zodra `d archief/` leeg is
- [ ] Apparaten-overzicht aanmaken in PKM (`apparaten.md`) — Sander geeft specs door later
- [ ] Google Drive duplicate cleanup
- [ ] MacBook Air cleanup
- [ ] iPhone organisatie
- [ ] Home directory dev-mappen: `git/`, `repos/`, `eclipse/`, `sslcert/`, `ebook/`, etc.

## Next steps

Volgende sessie op Mac mini M4 Pro. Starten met:
1. `d archief/` (711 bestanden) — eventueel met Ollama/n8n workflow
2. Digitale-kleurenmeter op Google Drive opruimen

## Cross-links

- `[[2026-06-29-17-00_hermes_macbook-pro-documenten-opruiming]]` — vorige sessie: Documents volledig leeggemaakt

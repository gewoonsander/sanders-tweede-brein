---
agent_id: hermes
session_id: macbook-pro-documenten-opruiming
timestamp: 2026-06-29T17:00:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-001-file-naming-conventions"]
---

# MacBook Pro opruiming — Documents volledig verwerkt

## Context

Vervolgsessie op `[[2026-06-29-13-00_hermes_macbook-pro-setup]]`. Doel: alle bestanden op de MacBook Pro hernoemen naar GL-001 kebab-case en verplaatsen naar de juiste iCloud Drive locatie. Deze sessie startte bij de Boek Darttactieken-map en sloot af met Documents volledig leeg (op app-mappen na).

## What we did

- **Hermes** heeft `~/Documents/IN/Boek Darttactiek/` (134 bestanden incl. submappen) volledig hernoemd naar kebab-case en verplaatst naar `iCloud/03-passie/dartscoaching/boek-darttactiek/`. Aanvullende boekbestanden vanuit `~/Documents/` ook meegenomen.
- **Hermes** heeft `~/Documents/` root niveau opgeruimd (~60 losse bestanden):
  - Boekhouding invoices → `06-financien/boekhouding/` (hernoemd naar `YYYY-MM-DD-slug.pdf`)
  - Darts/RDB data → `03-passie/darts/rdb/` en `05-bijdrage/adc/data/`
  - Gewoon Thuis documenten + media → `05-bijdrage/gewoon-thuis/`
  - Admin/juridisch → `admin/`
  - Inspiratie-posters → `01-geloof/` en `04-groei/inspiratie/`
  - Oud schoolmateriaal (Java, OOP, digiherkans) → verwijderd
- **Hermes** heeft `~/Documents/boekhouding/` (119 bestanden, 2021–2025) volledig hernoemd naar kebab-case en verplaatst naar `iCloud/06-financien/boekhouding/`.
- **Hermes** heeft `~/Documents/rdb/` (312 bestanden), `~/Documents/herveldopendarts/` (244), `~/Documents/Derotsputten/` (51) gekopieerd naar iCloud met recursief kebab-case hernoemen.
- **Hermes** heeft `~/Documents/working/` (42 bestanden) verwerkt: dartbuddiez → `03-passie/dartscoaching/dartbuddiez/`, website RDB → `03-passie/darts/rdb/website/`.
- **Hermes** heeft `~/Documents/fysiotherapei Vitaal/` → `02-gezondheid/fysiotherapie-vitaal/` hernoemd en verplaatst.
- **Hermes** heeft `~/Documents/dartbanen/` (8.648 bestanden, WordPress) en `~/Documents/websites/` (22.219 bestanden) verwijderd op verzoek van Sander — oude dev-backups.
- **Hermes** heeft `~/Documents/IN/` (964 bestanden) verwerkt: specifieke bestanden (boekhouding, admin, Gewoon Thuis, schoolfoto's, InDesign templates, Showit .sw bestanden) naar juiste locaties, bulk darts-materiaal → `03-passie/dartscoaching/materiaal/` met recursief hernoemen.

## Decisions made

- **Vraag:** `dartbanen/` en `websites/` (31.000 bestanden, WordPress) bewaren of verwijderen?
  **Beslissing:** Verwijderen. De live sites staan online; lokale dev-backups zijn verouderd.
- **Vraag:** `Klei/` (Don't Starve Together speldata) verplaatsen?
  **Beslissing:** Laten staan — automatisch beheerd door game.
- **Vraag:** App-mappen (`Adobe`, `Blackmagic Design`, `Epson`, `Snagit`, etc.) verplaatsen?
  **Beslissing:** Laten staan — automatisch aangemaakt en beheerd door apps.
- **Vraag:** Oude schoolbestanden (Java cursus OBC, digiherkans leerlingdata, 2015–2017)?
  **Beslissing:** Verwijderd — Sander is al lang weg bij die school, data niet meer relevant.

## Insights

- Recursief hernoemen (kebab-case) werkt betrouwbaar via `find + sed` pipeline bottom-up (eerst bestanden, dan mappen van diep naar ondiep).
- `c2a0` (non-breaking space U+00A0) in bestandsnamen is niet te verwijderen met gewone `rm` of `find -name "* file"` — vereist `find -name "*slug*"` glob.
- De `~/Documents/IN/` map fungeerde als echte inbox: mix van facturen, darts-materiaal, InDesign-templates, schoolfoto's, admin. Nu verwerkt.

## Realignments

- Sander herinnerde expliciet: "verplaatsen mag enkel als je de bestanden ook hernoemt" — elk mv-commando hernoemt naar kebab-case, geen plain `mv folder/` toegestaan.

## Open threads

- [ ] Home directory dev-mappen: `git/` (428 repos), `repos/`, `GitHub/`, `eclipse/`, `NetBeansProjects/`, `ebook/`, `magweg/`, `sslcert/`, `Local Sites/`, `Local_Websites/`, `onedrivewerk/`, `VirtualBox VMs/`
- [ ] `~/Pictures/` overige mappen controleren
- [ ] Google Drive duplicate cleanup
- [ ] MacBook Air cleanup
- [ ] iPhone organisatie

## Next steps

Volgende sessie start bij de home directory dev-mappen. Aanbevolen volgorde:
1. `eclipse/`, `NetBeansProjects/`, `development_workspace/` → verwijderen (oud)
2. `sslcert/` → nakijken (gevoelig)
3. `ebook/`, `magweg/` → bekijken wat het is
4. `Local Sites/`, `Local_Websites/` → bekijken, waarschijnlijk verwijderen
5. `git/` (428 repos) — aparte beslissing nodig

## Cross-links

- `[[2026-06-29-13-00_hermes_macbook-pro-setup]]` — vorige sessie: Downloads + wallpapers + Boek Darttactieken start

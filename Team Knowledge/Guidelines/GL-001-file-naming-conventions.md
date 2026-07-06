# GL-001 - File Naming Conventions

> **This Guideline is a general rule every agent reads on every relevant action.** Every file written into your myPKA — by any specialist, in any folder — follows the rules below. SOPs and Workstreams `[[wikilink]]` here rather than restating the rules.

This is the source of truth for how files in your myPKA are named. Every other file that needs to talk about naming `[[wikilinks]]` here.

## Core rules

### 1. kebab-case for slugs

- All lowercase.
- Words separated by single hyphens.
- No underscores, no spaces, no camelCase, no Title Case.
- ASCII only inside slugs. Use the closest ASCII equivalent for accented letters.

Good: `morning-build-session`, `dr-schmidt`, `ship-mvp-by-q3`.
Bad: `Morning_Build_Session`, `dr.schmidt`, `Ship MVP By Q3`.

### 2. ISO date prefix on date-driven files

Files that belong to a specific calendar day start with `YYYY-MM-DD-`.

Pattern: `YYYY-MM-DD-<slug>.<ext>`

Applies to:

- Journal entries: `PKM/Journal/YYYY/MM/YYYY-MM-DD-<slug>.md`
- Images: `PKM/Images/YYYY/MM/YYYY-MM-DD-<slug>.<ext>`
- Session logs: `Team Knowledge/session-logs/YYYY/MM/YYYY-MM-DD-<slug>.md`
- Deliverables when they are time-bound: `Deliverables/YYYY-MM-DD-<slug>.md`

Examples:
- `2026-05-04-first-day.md`
- `2026-05-04-business-card-dr-schmidt.png`
- `2026-05-04-pricing-research-kickoff.md`

### 3. Slug rules

- Derive the slug from the file's main subject in 2 to 5 words.
- Skip filler words ("the", "a", "of") unless they change meaning.
- For people use `firstname-lastname` or `title-lastname` if the title is part of how the user refers to them. Example: `dr-schmidt`.
- For organizations include enough context to disambiguate. Example: `dr-schmidt-clinic` rather than `clinic`.

### 4. Folder naming for specialist contracts

Pattern: `Team/<Name> - <Role>/AGENTS.md` with a literal space-hyphen-space between name and role.

Examples:
- `Team/Hermes - Orchestrator/`
- `Team/Penn - Journal Writer/`

Do not use kebab-case for these folder names. Specialist folder names are display names, read by humans first.

### 5. INDEX.md is always uppercase

Every section that has its own index uses the literal filename `INDEX.md`. Do not lowercase it. Do not add a date prefix.

### 6. SOP, Workstream, Guideline numbering

- SOPs: `SOP-NNN-<slug>.md` where `NNN` is zero-padded to three digits (`001`, `002`, ...).
- Workstreams: `WS-NNN-<slug>.md`.
- Guidelines: `GL-NNN-<slug>.md`.

Numbers do not skip. Reuse a retired number only after the retirement is logged in a session log.

### 7. Image filename pattern

`YYYY-MM-DD-<slug>.<ext>` under `PKM/Images/YYYY/MM/`.

The slug should describe the image, not just say "screenshot." Good: `2026-05-04-business-card-dr-schmidt.png`. Less good: `2026-05-04-screenshot.png`.

If multiple images come from the same source on the same day, append `-1`, `-2`, etc.

### 8. Collision handling

If two files would end up with the same filename, append a short qualifier:

- `dr-schmidt.md` (the cardiologist) vs `dr-schmidt-lawyer.md` (the lawyer).
- Reference the qualified filename via full path in `[[wikilinks]]`: `[[CRM/People/dr-schmidt-lawyer]]`.

### 9. Forbidden characters in filenames

- No em dashes.
- No slashes (used for path).
- No colons, semicolons, question marks, or asterisks.
- No emoji.

## Wiki link conventions

These are not naming rules but they reference filenames, so they live here too.

- `[[filename]]` when the filename is unique in your myPKA.
- `[[path/filename]]` when there is collision risk or when the link target is in a deeply nested folder and a path makes it findable.
- Image embeds: `![[Images/YYYY/MM/YYYY-MM-DD-<slug>.<ext>]]`. Always relative to the PKM root.

## Bestandssysteem buiten de PKM

Deze regels gelden voor alle mappen en bestanden op iCloud Drive, Google Drive, externe schijven en lokale schijven — niet alleen voor de PKM.

### 10. Mapnamen

- Kebab-case, alles kleine letters, woorden gescheiden door koppeltekens.
- Geen spaties, underscores, hoofdletters of speciale tekens.
- Goed: `gewoon-thuis`, `darts-coaching`, `verbouwing-huismanstraat`
- Fout: `Gewoon Thuis`, `DartsCoaching`, `verbouwing_huismanstraat`

Uitzondering: door apps automatisch aangemaakte mappen (bijv. `Final Cut Projects`, `iMovie Events`) houd je op de originele naam — die worden door de app beheerd.

### 11. Documenten buiten de PKM

Zelfde patroon als binnen de PKM:

- Tijdgebonden bestanden: `YYYY-MM-DD-slug.ext`
- Niet-tijdgebonden bestanden: `slug.ext` in kebab-case

Voorbeelden:
- `2026-06-29-factuur-vmb-advies.pdf`
- `darttactiek-boek-definitief.pdf`
- `huismanstraat-bouwvergunning.pdf`

### 12. Media (foto's, video's, audio)

- Ruwe bestanden van camera of telefoon: originele bestandsnaam bewaren totdat je er actief iets mee doet.
- Bij verwerking hernoemen naar: `YYYY-MM-DD-slug.ext`
- Voorbeelden:
  - `2025-10-16-adc-global-championship.mp4`
  - `2019-09-19-daan-gezinshuis.mp4`
  - `2026-06-29-verbouwing-huismanstraat-keuken.jpg`

### 13. Mappenstructuur voor documenten en media

Sinds de opslagstrategie-migratie van 2026-07-06 zijn documenten en media over twee verschillende clouddiensten verdeeld — dit is de omgekeerde indeling van de eerdere versie van deze paragraaf. Zie `Deliverables/2026-07-06-opslagstrategie-migratie-plan.md` en de sessielog `Team Knowledge/session-logs/2026/07/2026-07-06-09-47_hermes_opslagstrategie-foto-apple-documenten-google.md` voor de volledige afweging.

**Documenten** (Key Elements-structuur, spiegelt [[GL-010-pka-modeling-principles]]) leven op Google Drive:

```
Google Drive/Mijn Drive/documenten/
├── 01-geloof/             ← Geloof & Spiritualiteit
├── 02-gezondheid/         ← Gezondheid
├── 03-passie/             ← Darts, coaching, film/video
├── 04-groei/              ← Leren, development, AI
├── 05-bijdrage/           ← Gewoon Thuis, ADC, community
├── 06-financien/          ← Facturen, belasting, boekhouding
└── admin/                 ← Paspoort, verzekeringen, identiteit
```

**iCloud Drive** bevat alleen nog `00-inbox/` als tijdelijke landingsplek voor nog te sorteren bestanden. Vanuit daar routeer je door naar de juiste Key Element-map op Google Drive.

**Foto's en video's** leven in Apple Foto's (iCloud Foto's) — een aparte iCloud-dienst, niet de iCloud Drive-mapstructuur. Verwerkte media krijgt bij import wel de naamgeving uit §12, maar de opslaglocatie is de Foto's-bibliotheek, geen Drive-map.

Submappen binnen elk Key Element volgen kebab-case en worden aangemaakt op het moment dat ze nodig zijn — niet preventief. Binnen `03-passie` geldt aanvullend: onderneming/project-specifieke content krijgt een eigen submap (bijv. `dartscoaching/`, `adc/`, `rdb/`) in plaats van los in de root te staan. Er is bewust geen apart "werk"-Key Element — vanuit het Ikigai-principe overlappen werk en passie per definitie, dus werkprojecten blijven onder `03-passie`.

## Updates to this Guideline

If the rules change, update this file. Do not duplicate the change into SOPs or Workstreams. They `[[wikilink]]` here and inherit the change automatically.

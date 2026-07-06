---
agent_id: hermes
session_id: 2026-07-06-opslagstrategie-migratie-uitgevoerd
timestamp: 2026-07-06T12:59:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-001-file-naming-conventions", "GL-013-interactie-enkelvoudige-keuzes"]
---

# Opslagstrategie-migratie uitgevoerd: 03-passie gereorganiseerd, documenten naar Google Drive — 6 juli 2026

## Context

Terminal-sessie (Claude Code, met live bestandssysteemtoegang) waarin `Deliverables/2026-07-06-opslagstrategie-migratie-plan.md` is uitgevoerd. Vervolg op `[[2026-07-06-09-47_hermes_opslagstrategie-foto-apple-documenten-google]]` en `[[2026-07-06-12-46_hermes_dagstart-modus-opslagstrategie-documenten-opruiming]]`.

## What we did

**Fase 0 — Audit:**
- Google Drive `Mijn Drive/fotos/` (bestemming van de 139 foto's/video's uit de sessie van 30 juni) bleek **niet meer te bestaan** — breed gezocht (hele Google Drive-mount + iCloud Drive + Trash), niets gevonden. Op Sanders instructie genegeerd/niet verder onderzocht.
- iCloud Drive Key Element-telling: 00-inbox 103, 01-geloof 3, 02-gezondheid 13, 03-passie 4.485 (voor reorganisatie), 04-groei 74, 05-bijdrage 64, 06-financien 345, admin 22 — totaal 5.109.
- "Google Drive test" legacy-map bleek niet op `~/Google Drive test/` te staan maar onder **Andere computers → Mijn MacBook Pro → Google Drive test/**, met alleen nog `d archief` (620 bestanden) erin — nog niet opgeschoond, apart open thread.
- iCloud-opslagruimte: niet via terminal op te vragen (GUI-only), niet verder opgevolgd deze sessie.

**Zijspoor — 03-passie herstructurering:**
- Sander besliste (Ikigai-principe): geen apart "werk" Key Element, werkprojecten blijven onder `03-passie` in subfolders per onderneming.
- `03-passie` bleek al deels opgesplitst maar met flinke duplicatie (`darts`, `darts-coaching`, `dartscoaching` overlapten, `adc`/`rdb`-content verspreid over meerdere plekken). Na drie correctierondes met Sander (ADC ≠ dartscoaching; Herveld Open Darts hoort bij website-archief, niet apart; Dartbuddies is een onderdeel van dartscoaching.nl, niet ernaast; `darts-coaching/rdb` was een mix van algemene RDB-reglementen en Dartteam Irritant-specifieke stukken) is de definitieve structuur uitgevoerd:
  - `adc/` (46 bestanden) — samenvoeging van 2 losse ADC-mappen, puur regiomanagement
  - `rdb/` (377 bestanden) — samenvoeging van 5 verspreide RDB-locaties + 3 algemene reglementen
  - `dartscoaching/` (1.259 bestanden, incl. genest `dartbuddies/`) — samenvoeging van `darts-coaching` + `dartscoaching`
  - `dartteam-irritant/` (8 bestanden) — eigen team, incl. 7 Irritant-specifieke stukken die eerst onterecht in een RDB-map zaten
  - `website-archief/` (2.777 bestanden, incl. genest `herveld-open-darts/`)
  - `materiaal/` (16 bestanden, losse restbestanden zonder duidelijke eigenaar, incl. 3 `poster-d10-*.pdf` die niet expliciet zijn afgestemd)
  - Totaal na reorganisatie: 4.485 → 4.483 (2 bestanden minder in `rdb/rdb-bestanden`, oorzaak onderzocht: geen sporen in Trash/conflictbestanden, stabiele telling — vermoedelijk verweesde resource-fork-bestanden, geen bevestigde inhoudelijke dataverlies. Sander akkoord om door te gaan zonder verder onderzoek.)

**Fase 2 — Documenten naar Google Drive:**
- Beslissingen: mapnaam `documenten/`, `00-inbox` blijft op iCloud (niet verhuisd), Gezinshuis Gewoon Thuis-dossier verhuist gewoon mee met standaard Google Drive-deelinstellingen (Sander expliciet akkoord, geen Argus-review aangevraagd).
- Alle 7 Key Element-mappen (01-geloof t/m admin) 1-op-1 verplaatst naar `Google Drive/Mijn Drive/documenten/` — bestandscount vóór/na per map geverifieerd, geen mismatches.
- iCloud Drive bevat nu alleen nog `00-inbox/` (103 bestanden) als landingsplek.

**Fase 3 — Documentatie:**
- `GL-001-file-naming-conventions.md` §13 herschreven: documenten-Key-Elements-structuur staat nu op Google Drive, iCloud Drive is gereduceerd tot `00-inbox`, foto's/video's horen bij Apple Foto's (iCloud Foto's-dienst, geen Drive-mapstructuur). Toegevoegd: geen apart "werk"-Key-Element, motivatie kort toegelicht.
- Geverifieerd met `grep -rl "iCloud Drive" Team\ Knowledge/`: enige overige treffers zijn historische sessielogs (niet aangepast, terecht) en GL-001 zelf.

## Decisions made

- **Vraag:** Apart "werk" Key Element toevoegen?
  **Beslissing:** Nee — Ikigai-principe, werk blijft onder `03-passie` in subfolders per onderneming.
- **Vraag:** Zoekgeraakte `fotos/`-map verder onderzoeken?
  **Beslissing:** Nee, genegeerd op Sanders instructie.
- **Vraag:** Mapnaam documenten op Google Drive?
  **Beslissing:** `documenten/`.
- **Vraag:** `00-inbox` mee verhuizen naar Google Drive?
  **Beslissing:** Nee, blijft op iCloud.
- **Vraag:** Gezinshuis Gewoon Thuis-dossier (cliëntdata) mee verhuizen met standaard Google Drive-instellingen?
  **Beslissing:** Ja, expliciet akkoord zonder Argus-privacyreview.
- **Vraag:** 2 ontbrekende bestanden in `rdb/rdb-bestanden` na reorganisatie verder onderzoeken?
  **Beslissing:** Nee, doorgaan.

## Insights

- De eerder gedocumenteerde `Mijn Drive/fotos/`-map (bestemming van de 30-juni-migratie) bestaat niet meer — een reëel open mysterie dat nooit is opgehelderd, alleen bewust genegeerd. Dit kan later terugkomen als vraag "waar zijn die 139 foto's precies gebleven".
- `03-passie` had significant meer interne rommeligheid dan de bestandscount alleen deed vermoeden — drie bijna-identieke mapnamen (`darts`/`darts-coaching`/`dartscoaching`) voor deels overlappende, deels aparte ondernemingen. Zonder de aparte doorvraag-rondes was dit fout samengevoegd (bijv. ADC + dartscoaching, of Dartbuddies los naast i.p.v. in dartscoaching).
- "Google Drive test" (de oude Backup & Sync computer-map) is device-gebonden zichtbaar via "Andere computers" op een niet-oorspronkelijk apparaat — handig om te weten voor toekomstige audits vanaf de Mac mini.

## Realignments

- GL-001 §13 volledig herschreven — omgekeerde opslagindeling t.o.v. de vorige versie (zie sessielog 09:47 voor de besluitvorming).

## Open threads

- [ ] Zoekgeraakte `fotos/`-map (139 bestanden uit 30-juni-migratie) — bewust genegeerd, niet opgehelderd.
- [ ] "Google Drive test" / `d archief` (620 bestanden onder Andere computers → Mijn MacBook Pro) — nog niet opgeschoond, apart karwei.
- [ ] 2 ontbrekende bestanden in `rdb/rdb-bestanden` (was 304, nu 302) — vermoedelijk onschuldig (resource-fork-artefacten), niet met zekerheid bevestigd.
- [ ] 3 `poster-d10-*.pdf`-bestanden in `03-passie/materiaal/` — plek niet expliciet met Sander afgestemd.
- [ ] iCloud-opslagruimte (Fase 0 stap 4) nooit gecheckt — GUI-only stap, oorspronkelijk bedoeld om te verifiëren vóór foto-import, inmiddels irrelevant nu Fase 1 is overgeslagen.

## Next steps

Volgende keer: overwegen of de zoekgeraakte fotos-map en de `d archief`-opschoning alsnog aandacht nodig hebben. Verder geen directe vervolgstappen — migratieplan is afgerond voor zover Sander wilde.

## Cross-links

- `[[2026-07-06-09-47_hermes_opslagstrategie-foto-apple-documenten-google]]` — de realignment-beslissing
- `[[2026-07-06-12-46_hermes_dagstart-modus-opslagstrategie-documenten-opruiming]]` — sessie waarin het migratieplan werd geschreven
- `Deliverables/2026-07-06-opslagstrategie-migratie-plan.md` — het uitgevoerde plan

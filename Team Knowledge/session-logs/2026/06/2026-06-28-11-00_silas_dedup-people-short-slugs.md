---
agent_id: silas
session_id: dedup-people-short-slugs-2026-06-28
timestamp: 2026-06-28T11:00:00Z
type: end-of-session
linked_sops: []
linked_workstreams: []
linked_guidelines: [GL-001-file-naming-conventions, GL-002-frontmatter-conventions]
---

# Dedup: verouderde korte slugs People

## Wat ik deed

Twee verouderde kortere slug-bestanden in PKM/CRM/People/ verwijderd na controle op unieke informatie en wikilinks.

### marieke → marieke-van-ockenburg-zwaan

`marieke.md` bevatte informatie die niet in het volledige bestand stond:
- Praktijkgegevens Praktijk Gewoon ZIJN (website, locatie, KVK)
- Webklant-rol (Sander beheert haar site)
- Gewoon Thuis mede-eigenaar context
- Tags: gewoon-thuis, praktijk, webklant

Alles gemigreerd naar `marieke-van-ockenburg-zwaan.md` (tags in frontmatter, inhoud als nieuwe secties). Geen wikilinks naar `[[marieke]]` gevonden in de vault.

### merel-jasmijn → merel-jasmijn-van-ockenburg-zwaan

`merel-jasmijn.md` bevatte: school (Guido de Brès, Arnhem). Gemigreerd als `## School` sectie naar `merel-jasmijn-van-ockenburg-zwaan.md`. Geen wikilinks naar `[[merel-jasmijn]]` gevonden in de vault.

## Acties

- Unieke info gemigreerd naar volledige bestanden: 2
- Markdown-bestanden verwijderd: 2 (marieke.md, merel-jasmijn.md)
- SQLite people-records verwijderd: 2 (slug: marieke, merel-jasmijn)
- Links-tabel opgekuist: records met source_slug/target_slug = 'marieke' of 'merel-jasmijn'
- Wikilinks naar korte slugs in vault: 0 (geen herwriting nodig)

## Anomalieën

Geen.

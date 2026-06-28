# Session Log - 2026-06-28 - CRM deduplicatie & Audible integratie

## Wat we deden

### CRM deduplicatie
- Thomas, Xaneline, Marieke en Merel-Jasmijn hadden elk twee aparte bestanden (kort slug + volledig slug)
- Alle vier samengevoegd: unieke informatie gemigreerd naar het volledige bestand, korte slug verwijderd uit markdown én mypka.db
- Ontdubbel-procedure (Duty 2c) toegevoegd aan [[Team/Larry - Orchestrator/AGENTS]] — wordt voortaan automatisch gedraaid bij session close

### Audible integratie
- `audible-cli` geïnstalleerd en geauthenticeerd via Amazon-login (browser flow, country_code: us)
- 102 audioboeken geëxporteerd naar `PKM/audible-library.tsv`
- `audiobooks` tabel aangemaakt in mypka.db, alle boeken geïmporteerd
- Sync-script aangemaakt: `scripts/sync-audible.sh`
- Wekelijkse automatische sync ingesteld (elke maandag 06:00) via scheduled tasks
- Cockpit uitgebreid met Audiobooks-pagina (covers, voortgang, ratings, zoekfilter)
- Audiobooks als collectie-kaart toegevoegd aan Library-pagina naast Recipes en Films & Series
- CSP-fix in server.js zodat Amazon-covers (m.media-amazon.com) worden geladen

## Beslissingen
- Database-bewerkingen op mypka.db voortaan zonder bevestiging uitvoeren
- Automatische sync bij session close voor ontdubbeling mensen (Duty 2c)

## SSOT / structurele fixes (Librarian pass)
- `PKM/CRM/People/thomas.md` → samengevoegd in `thomas-van-suilichem.md`, verwijderd
- `PKM/CRM/People/xanne-lynn.md` → samengevoegd in `xanne-lynn-van-ockenburg-zwaan.md`, verwijderd
- `PKM/CRM/People/marieke.md` → samengevoegd in `marieke-van-ockenburg-zwaan.md`, verwijderd
- `PKM/CRM/People/merel-jasmijn.md` → samengevoegd in `merel-jasmijn-van-ockenburg-zwaan.md`, verwijderd

## Cross-links
- [[2026-06-28-11-00_silas_dedup-people-short-slugs]]

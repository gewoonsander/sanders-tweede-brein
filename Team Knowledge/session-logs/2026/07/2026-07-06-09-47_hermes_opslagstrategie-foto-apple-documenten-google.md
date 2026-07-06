---
agent_id: hermes
session_id: 2026-07-06-opslagstrategie-foto-apple-documenten-google
timestamp: 2026-07-06T09:47:00Z
type: realignment
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-001-file-naming-conventions"]
---

# Opslagstrategie herzien: foto's → Apple/iCloud, documenten → Google Drive

## Context

Tijdens dit gesprek bleek de feitelijke, gedocumenteerde staat (GL-001 §13: iCloud Drive = documenten volgens Key Elements-structuur; Google Drive = foto's, zie sessielog 2026-06-30 google-fotos-gezinshuis-opruiming) niet overeen te komen met wat Sander zich herinnerde te hebben besloten: foto's naar iCloud (vanwege Apple's sterke gezichts-/scèneherkenning), documenten naar Google Drive.

## Beslissing

- **Question:** Foto's naar Apple/iCloud of Google Drive? Documenten naar iCloud of Google Drive?
  **Decision:** Foto's/video's → Apple (iCloud Foto's). Documenten → Google Drive. Dit is de tegenovergestelde indeling van wat nu in GL-001 §13 staat en van wat in de sessie van 30 juni is uitgevoerd (foto's werden toen juist náár Google Drive verplaatst).
- Sander bevestigde voldoende opslagcapaciteit: **iCloud 2 TB**, **Google Drive 4 TB** — dit adresseert het capaciteitsrisico dat Hermes eerder opwierp.
- iCloud-foto's blijft AAN op de iPhone (niet uitgezet) — Sander vroeg naar de uitzet-instelling maar koos uiteindelijk om de automatische iCloud-sync juist te behouden.

## Insights / geïdentificeerde risico's (nog niet opgelost, moeten in het migratieplan)

1. Recent werk (30 juni) verplaatste juist foto's/video's náár Google Drive (`Mijn Drive/fotos/`, ~139+ bestanden) — dit moet nu terug naar Apple Foto's.
2. GL-001 §13 (iCloud Drive-structuur volgens Key Elements) moet herschreven worden — die structuur verhuist conceptueel naar Google Drive.
3. Apple Foto's is een beheerde bibliotheek, geen Finder-mappenboom — bestandsnamen volgens GL-001-conventie (`YYYY-MM-DD-slug.ext`) tellen daar nauwelijks mee. Het hernoemwerk van 30 juni is voor die foto's grotendeels overbodig geworden.
4. Gezinshuis Gewoon Thuis cliëntdossier (Yoram de Wilde) staat nu in iCloud — moet bij documenten-migratie naar Google Drive expliciet gecheckt worden op privacy/GDPR (mogelijk Argus-domein).
5. Toshiba HDD-familievideo's worden al (deels) naar Apple Foto's verplaatst via een los script — dat is al in lijn met de nieuwe richting.
6. "Google Drive test" (legacy Backup & Sync-map) staat nog open om leeg te maken — moet afgerond worden vóór Google Drive de primaire documentenplek wordt, om verwarring met de nieuwe structuur te voorkomen.

## Open threads

- [ ] GL-001 §13 herschrijven: iCloud Drive → foto's (via Apple Foto's, geen Finder-taxonomie meer nodig); Google Drive → documenten (Key Elements-taxonomie verhuist hierheen).
- [ ] Foto's die op 30 juni naar Google Drive zijn verplaatst, alsnog importeren in Apple Foto's.
- [ ] Bestaande iCloud Drive-documenten (Key Elements-mappen) verhuizen naar Google Drive.
- [ ] Privacy-check Gezinshuis-dossier vóór verhuizing naar Google Drive (mogelijk Argus).
- [ ] "Google Drive test" legacy-map afronden/leegmaken.
- [ ] Daadwerkelijke aantallen tellen — Hermes heeft nog geen toegang tot de live iCloud Drive- of Google Drive-mappen vanuit Cowork.

## Next steps

Migratieplan uitwerken (mogelijk met Daedalus/Atlas) zodra Sander akkoord geeft om door te gaan.

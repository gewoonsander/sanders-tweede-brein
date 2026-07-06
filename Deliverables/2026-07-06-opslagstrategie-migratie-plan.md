---
title: Opslagstrategie-migratie — foto's naar Apple, documenten naar Google Drive
date: 2026-07-06
doc_type: plan
status: uitgevoerd (Fase 1 overgeslagen op Sanders instructie, zie sessielog 2026-07-06-12-59)
linked_guidelines: ["GL-001-file-naming-conventions"]
---

# Opslagstrategie-migratie: foto's → Apple/iCloud, documenten → Google Drive

## Waarom dit bestaat

Dit plan is bedoeld om vanuit een **terminal-sessie met Claude Code** (dus met echte bestandssysteemtoegang tot iCloud Drive, Google Drive en Foto's) uitgevoerd te worden. De Cowork-sessie waarin dit is opgesteld heeft geen live toegang tot die mappen — alleen tot de PKM-map zelf.

Start een nieuwe sessie met:
```
cd ~/Documents/sanders-tweede-brein
claude
```
En zeg dan: "Voer het plan uit `Deliverables/2026-07-06-opslagstrategie-migratie-plan.md`."

## Besluit (context)

- **Foto's en video's** → Apple / iCloud Foto's (2 TB abonnement, ruim voldoende).
- **Documenten** (Key Elements-structuur: geloof, gezondheid, passie, groei, bijdrage, financiën, admin) → Google Drive (4 TB abonnement).
- Dit is de **omgekeerde** indeling van wat nu in `GL-001-file-naming-conventions.md` §13 staat en van wat op 30 juni 2026 daadwerkelijk is uitgevoerd (zie `Team Knowledge/session-logs/2026/06/2026-06-30-08-31_hermes_google-fotos-gezinshuis-opruiming.md`).
- Volledige beslissing + risico's: `Team Knowledge/session-logs/2026/07/2026-07-06-09-47_hermes_opslagstrategie-foto-apple-documenten-google.md`.

## Stappenplan (elk 2–5 min, exact pad + verificatie)

### Fase 0 — Audit (verplicht eerst, geen wijzigingen)

1. **Tel foto's/video's in Google Drive fotos-map.**
   Pad: `~/Library/CloudStorage/GoogleDrive-sander@gewoonsander.nl/Mijn Drive/fotos/`
   Actie: `find . -type f | wc -l` en groepeer op extensie.
   Verificatie: aantal komt overeen met of overtreft de ~139 bestanden uit de sessielog van 30 juni.

2. **Tel documenten in iCloud Drive (Key Elements-mappen).**
   Pad: `~/Library/Mobile Documents/com~apple~CloudDocs/` (of het pad dat Finder toont als "iCloud Drive").
   Actie: `find . -maxdepth 2 -type f | wc -l` per Key Element-map (`01-geloof`, `02-gezondheid`, `03-passie`, `04-groei`, `05-bijdrage`, `06-financien`, `admin`, `00-inbox`).
   Verificatie: totaaloverzicht per map, gerapporteerd aan Sander vóór verdere stappen.

3. **Check "Google Drive test" legacy-map status.**
   Pad: `~/Google Drive test/` (exacte pad bevestigen).
   Actie: `find . -type f | wc -l`.
   Verificatie: bevestig of deze al leeg is (open thread sinds 30 juni) of nog inhoud heeft die eerst afgehandeld moet worden.

4. **Check iCloud-opslagruimte.**
   Actie: Systeeminstellingen → Apple ID → iCloud, noteer gebruikte/beschikbare ruimte.
   Verificatie: ruim onder 2 TB, anders escaleren naar Sander vóór foto-import.

### Fase 1 — Foto's terug naar Apple Foto's

5. **Open Foto's-app, importeer vanaf de Google Drive fotos-map.**
   Actie: Foto's → Bestand → Importeren → wijs naar `Mijn Drive/fotos/`.
   Verificatie: aantal geïmporteerde items in Foto's komt overeen met telling uit stap 1.

6. **Steekproef-check: metadata en datum kloppen na import.**
   Actie: open 3–5 willekeurige geïmporteerde foto's in Foto's-app, vergelijk opnamedatum met bestandsnaam (`YYYY-MM-DD-slug.ext`).
   Verificatie: datums komen overeen (foto's-app leest EXIF, niet de bestandsnaam — dit is een controle, geen actie).

7. **Vraag Sander expliciet akkoord voordat de originelen uit Google Drive worden verwijderd.**
   Actie: presenteer resultaat van stap 5–6, wacht op "ga akkoord".
   Verificatie: alleen doorgaan naar verwijdering na expliciete bevestiging (geen automatische delete).

### Fase 2 — Documenten naar Google Drive

8. **Maak Key Elements-structuur aan in Google Drive.**
   Pad: `~/Library/CloudStorage/GoogleDrive-sander@gewoonsander.nl/Mijn Drive/documenten/` (naam ter bevestiging met Sander).
   Actie: maak submappen `01-geloof`, `02-gezondheid`, `03-passie`, `04-groei`, `05-bijdrage`, `06-financien`, `admin`, `00-inbox` aan (kebab-case, conform GL-001).
   Verificatie: `ls` toont alle 8 mappen.

9. **Privacy-check Gezinshuis Gewoon Thuis-dossier vóór verhuizing.**
   Pad: `iCloud Drive/05-bijdrage/gewoon-thuis/documenten/` (cliëntdossier Yoram de Wilde).
   Actie: overleg met Sander (en evt. Argus-checklist) of Google Drive's standaard deelinstellingen voldoende zijn voor cliëntgegevens, vóór dit bestand wordt meeverhuisd.
   Verificatie: expliciete go/no-go van Sander genoteerd, geen automatische meesleep.

10. **Verplaats overige documenten map voor map.**
    Actie: per Key Element-map: `mv` van iCloud Drive-pad naar het corresponderende Google Drive-pad.
    Verificatie: bestandscount vóór en na verplaatsing per map identiek (`find ... | wc -l` in beide mappen vergelijken).

11. **Leeg "Google Drive test" legacy-map af (indien nog niet gedaan).**
    Actie: resterende inhoud sorteren of verwijderen conform de open thread van 30 juni.
    Verificatie: map is leeg of uitgevinkt als gesynchroniseerde "Computers"-map in Google Drive for Desktop.

### Fase 3 — Documentatie bijwerken

12. **Herschrijf `Team Knowledge/Guidelines/GL-001-file-naming-conventions.md` §13.**
    Actie: vervang de iCloud Drive-sectie door de nieuwe indeling (iCloud = Apple Foto's, Google Drive = Key Elements-documentstructuur).
    Verificatie: geen andere bestanden in de PKM verwijzen nog naar de oude iCloud-documentenstructuur (`grep -r "iCloud Drive" Team\ Knowledge/`).

13. **Schrijf close-session log met eindresultaat.**
    Actie: `Team Knowledge/session-logs/YYYY/MM/YYYY-MM-DD-HH-MM_hermes_opslagstrategie-migratie-uitgevoerd.md`, cross-link naar dit plan en naar de realignment-log van 6 juli.
    Verificatie: log bevat concrete aantallen verplaatste bestanden per fase.

## Openstaande beslissingen (vraag Sander als het zover is)

- Exacte mapnaam voor documenten in Google Drive (`documenten/` of anders).
- Of `00-inbox` op iCloud blijft bestaan als tijdelijke landingsplek, of ook naar Google Drive verhuist.
- Of de Toshiba-HDD-familievideo's (al deels onderweg naar Apple Foto's) in dit plan worden meegenomen of apart blijven lopen.

Je bent Athena's kwartaal-routine: de refresh van de platform-kennisdossiers, draaiend lokaal op de Mac mini in de repo sanders-tweede-brein. Voer [[SOP-014-refresh-platform-specialist-knowledge]] volledig en stap voor stap uit — lees dat bestand eerst (`Team Knowledge/SOPs/SOP-014-refresh-platform-specialist-knowledge.md`) voor de exacte procedure. Dit is de uitvoeringsversie voor de onbemande routine; wijk niet af van de SOP.

Voer de procedure **twee keer** uit, één keer per dossier, volledig onafhankelijk van elkaar (een fout of niets-veranderd bij het ene dossier blokkeert het andere niet):

1. `Deliverables/2026-07-14-huddle-specialist-hire-research.md` (Huddle, specialist Martonny)
2. `Deliverables/2026-07-14-plugandpay-specialist-hire-research.md` (Plug&Pay, specialist Tonnymart)

## Per dossier, in deze volgorde

### Stap 1 — Lees het bestaande dossier

Noteer `last_verified` (frontmatter), de bron-URL (help center homepage), en welke secties eerder als "niet deep-dived"/"gap" gemarkeerd stonden.

### Stap 2 — Lichte scan

Haal via WebFetch de help-center categorie/artikel-index opnieuw op (niet elk artikel individueel). Vergelijk aantal artikelen per categorie en artikeltitels tegen wat in het dossier staat. Haal ook expliciet de officiële pricing-pagina opnieuw op — prijzen en tier-gates zijn het meest schade-gevoelig als ze verouderd zijn.

### Stap 3 — Diep lezen, alleen wat nieuw/gewijzigd is

Voor elk artikel dat nieuw is, een titelwijziging heeft, of bij een eerder gemarkeerde gap hoort: lees het volledig, zelfde diepgang als de oorspronkelijke research. Ongewijzigd lijkende artikelen (zelfde titel, zelfde categorie-telling) worden niet herlezen.

### Stap 4 — Werk het dossier bij, in-place

Geen nieuw dossierbestand — werk het bestaande bestand bij. Voeg een `## Changelog`-sectie toe of vul de bestaande aan (datum, wat gecheckt, wat veranderd). Verouderde feiten worden nooit stilzwijgend overschreven — gebruik `> **Correctie (YYYY-MM-DD):** ...` (datum via `date +%Y-%m-%d`). Nieuwe features/artikelen toevoegen met dezelfde citatie-discipline (bron-artikel + UI-pad waar mogelijk).

### Stap 5 — Frontmatter bijwerken

```yaml
last_verified: YYYY-MM-DD   # datum van vandaag
next_review: YYYY-MM-DD     # +3 maanden
review_cadence: quarterly
```

### Stap 6 — Substantiële wijzigingen

Een prijswijziging, een feature die van bèta naar GA ging, of een verschoven tier-gate: markeer dit expliciet en prominent, zowel in het dossier (Changelog) als in de eindsamenvatting (zie hieronder) — dit kan eerdere beslissingen van Sander ongeldig maken en moet zichtbaar zijn, niet stil wegschrijven.

## Na beide dossiers — sessielog

Schrijf één gecombineerde entry naar `Team Knowledge/session-logs/YYYY/MM/YYYY-MM-DD-HH-MM_athena_refresh-huddle-plugandpay-knowledge.md` (huidige datum/tijd, gebruik `date` via Bash) volgens het bestaande `_template.md`-schema in die map: per dossier de kernbevinding, of "geen wijzigingen gevonden".

## Committen en loggen

Commit alle gewijzigde bestanden (beide dossiers, de nieuwe sessielog-entry) met `git add`/`git commit`, commitmessage bijvoorbeeld:
```
Refresh Huddle/Plug&Pay-kennisdossiers YYYY-MM-DD (automatisch)
```
Niet pushen — dat gebeurt via de bestaande sessie-backup-routine.

Schrijf daarna een korte samenvatting (3-6 regels, één blokje per dossier) naar stdout: wat gecheckt is en of er iets veranderd is. Dit komt in `~/Library/Logs/refresh-huddle-plugandpay-knowledge.log` terecht.

## Belangrijk

- Verzin nooit een feature, prijs of wijziging die je niet met een bron-URL kunt onderbouwen.
- Een mislukte of geblokkeerde WebFetch is geen "geen wijzigingen" — markeer dat expliciet als "niet gecontroleerd, fetch mislukt" in zowel het dossier als de eindsamenvatting.

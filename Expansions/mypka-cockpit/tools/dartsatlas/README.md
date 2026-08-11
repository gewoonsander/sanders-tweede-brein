# Darts Atlas → myPKA

Je eigen dartsresultaten van [dartsatlas.com](https://www.dartsatlas.com/players/n6oeItIbK1vl)
lokaal bijhouden: standen, toernooihistorie en per-wedstrijd-uitslagen.

## Waarom dit een knopje is en geen automatisme

De Terms of Use van Darts Atlas verbieden geautomatiseerd/robotmatig ophalen van
de site, **inclusief "monitoring"**. Handmatig een redelijk aantal pagina's
downloaden voor persoonlijk gebruik mág wél. Daarom is dit gebouwd als een
mens-getriggerde procedure:

- **jij** opent de pagina in je eigen browser,
- **jij** klikt de bookmarklet,
- de bookmarklet leest alleen het scherm dat al voor je staat en schrijft een
  JSON-bestand weg.

Er zit **geen enkele HTTP-call naar dartsatlas.com** in deze tools. Geen cronjob,
geen scraper, geen "even alle pagina's ophalen". Eén klik = één pagina.

> Als er ooit toestemming komt voor een geautomatiseerde variant, is dat een
> aparte route. Bouw die niet stiekem hierin.

## Eenmalig installeren

```bash
cd Expansions/mypka-cockpit
npm run darts:bookmarklet
open tools/dartsatlas/install.html
```

Sleep de zwarte knop **"Darts → myPKA"** naar je bladwijzerbalk
(Cmd+Shift+B als die verborgen is). Klaar.

Optioneel, maar handig: zet in je browser de downloadmap op de watch-map, dan
hoef je nooit een bestand te verslepen.

```
Expansions/mypka-cockpit/data/dartsatlas/inbox/
```

Doe je dat niet? Ook goed — de importer kijkt standaard óók in `~/Downloads`.

## Dagelijks gebruik

1. Open op dartsatlas.com één van deze pagina's:
   - `/players/<jouw-id>/tournaments` — je toernooihistorie
   - `/players/<jouw-id>/rankings` — je standen (knop *History* voor afgelopen seizoenen)
   - `/tournaments/<id>/player_stats/<jouw-id>` — het detail achter *Full Details »*
2. Klik de bladwijzer **Darts → myPKA**. Rechtsboven verschijnt een bevestiging
   met het aantal gevonden records; er wordt een `dartsatlas-….json` gedownload.
3. Staat er "Pagina 1 van 4"? Blader zelf naar pagina 2, 3 en 4 en klik daar
   opnieuw. De importer vertelt je later precies welke pagina's nog ontbreken.
4. Importeren:

```bash
cd Expansions/mypka-cockpit
npm run darts:import
```

Uitvoer ziet er zo uit:

```
✓ dartsatlas-20260810T162749-tournaments-p1-n6oeItIbK1vl.json — tournaments pagina 1/4: 20 nieuw, 0 bijgewerkt, 0 ongewijzigd

Store bijgewerkt (index.json, tournaments.json) — …/data/dartsatlas
  20 toernooien · 1 seizoenen · 1 circuits · 1 toernooidetails · 2 stand-momentopnames
  ↪ verwerkt: inbox/processed/2026-08/dartsatlas-….json

Nog niet vastgelegd (open zelf in je browser en klik de bookmarklet):
  tournaments — pagina 2, 3, 4 van 4
    https://www.dartsatlas.com/players/n6oeItIbK1vl/tournaments?page=2
```

### Liever hands-free?

```bash
npm run darts:watch
```

Laat dat venster openstaan: elk bestand dat in de inbox landt wordt binnen twee
seconden geïmporteerd. Ctrl+C stopt het.

### Als de download geblokkeerd wordt

Klik in de bevestiging op **Kopieer JSON** en draai daarna:

```bash
node tools/dartsatlas/import-exports.mjs --from-clipboard
```

## Alle opties

```bash
npm run darts:import -- --help
npm run darts:import -- --dry-run   # alleen rapporteren, niets wegschrijven
npm run darts:status                # wat zit er nu in de store?
```

| Optie | Betekenis |
|---|---|
| `--dir <pad>` | extra map om te scannen (herhaalbaar) |
| `--dry-run`, `-n` | rapporteer alleen; schrijf en verplaats niets |
| `--watch`, `-w` | blijf de inbox bewaken |
| `--from-clipboard` | lees de JSON uit het klembord (macOS) |
| `--keep` | verwerk het bestand maar laat het staan |
| `--status` | toon de inhoud van de store en stop |
| `--allow-other-player` | sta een export van een ander speler-id toe |

## Waar de data landt

```
data/dartsatlas/
├── index.json            speler, tellingen, welke pagina's zijn vastgelegd
├── rankings.json         standen per circuit en per seizoen (laatste waarde)
├── tournaments.json      volledige toernooihistorie, op toernooi-id
├── tournament-stats.json per toernooi: 100+/140+/180, legs, breaks, wedstrijden
├── history.json          gedateerde momentopnames van elke stand → trend over tijd
└── inbox/                de watch-map
    └── processed/YYYY-MM/  ruwe exports, bewaard als audit-spoor
```

**Waarom JSON en niet `mypka-cockpit.db`?** Die database staat in `.gitignore`
en is per contract wegwerpbare runtime-state. Deze dartsdata is dat niet: het is
de enige lokale kopie, want automatisch opnieuw ophalen is geen optie. Dus staat
het in leesbare, git-gebackupte JSON die met de gewone close-session-backup
meegaat. De vorm is bewust DB-klaar (maps op id), dus een latere SQLite-tabel of
Cockpit-tabblad kan er zo op aansluiten.

### Wat er in de records zit

Standen (`rankings.json`, per seizoen en per circuit): `rank`, `points`,
`average`, `first9`, `matchWins`/`matchLosses` of `wins`/`losses`, `titles`,
`finals`, `semiFinals`, `scores100Plus`, `scores140Plus`, `scores180`, plus
regio-ranking (bv. Netherlands #39).

Toernooien (`tournaments.json`): `date`, `name`, `leagueName`, `result`,
`points`, `average`, `first9`, deeplink naar het toernooi en naar het detail.

Toernooidetail (`tournament-stats.json`): bovenstaande plus `legsWon`,
`legsLost`, `breaks` en per wedstrijd de ronde, het format, de tegenstander, de
stand en beide gemiddelden.

> **Checkout-percentage bestaat niet** op deze pagina's. Er is dus bewust geen
> veld voor. Niet alsnog verzinnen.

## Idempotentie & veiligheid

- Elk record wordt geüpsert op zijn Darts Atlas-id. Twee keer hetzelfde bestand
  importeren verandert niets — ook niet één byte in de store.
- Een nieuwere maar magerdere export wist nooit velden die al bekend waren.
- Records worden nooit verwijderd.
- Standen krijgen één momentopname per dag in `history.json`; drie keer klikken
  op één dag overschrijft die opname in plaats van te stapelen.
- Een export van een ánder speler-id wordt geweigerd tenzij je
  `--allow-other-player` meegeeft.
- Er zijn geen credentials in het spel: het profiel is publiek, er is geen login.

## Onderhoud

Verandert Darts Atlas z'n HTML, dan stopt de bookmarklet met records vinden. Dat
is zichtbaar (de toast zegt "0 records") en meetbaar:

```bash
npm install --no-save jsdom   # eenmalig, dev-only, staat niet in package.json
npm run darts:test
```

De tests draaien tegen de echte pagina's in `fixtures/` (opgeslagen op
2026-08-10, CSRF-token geredigeerd, scripts en afbeeldingen eruit). Zonder jsdom
slaan ze zichzelf over in plaats van te falen.

**Na élke wijziging in `extract.mjs`:**

```bash
npm run darts:bookmarklet
```

en sleep de nieuwe knop opnieuw naar je bladwijzerbalk. De bookmarklet draagt een
bevroren kopie van de extractielogica; zonder rebuild exporteert-ie stilletjes de
oude vorm.

## Bestanden

| Bestand | Rol |
|---|---|
| `extract.mjs` | de extractielogica — de enige bron van waarheid |
| `bookmarklet.template.js` | wrapper eromheen: download + bevestiging |
| `build-bookmarklet.mjs` | bakt beide tot `bookmarklet.txt` + `install.html` |
| `store.mjs` | de JSON-store: laden, mergen, atomisch wegschrijven |
| `import-exports.mjs` | de CLI die de watch-map leegt |
| `extract.test.mjs` | regressietests tegen `fixtures/` |
| `bookmarklet.txt`, `install.html` | gegenereerd — niet met de hand bewerken |

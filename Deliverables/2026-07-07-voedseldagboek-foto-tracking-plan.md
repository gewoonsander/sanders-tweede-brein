---
date: 2026-07-07
author: Mack (Automation Specialist)
type: implementatie-plan
sop: SOP-development-workflow (Fase 2 — Plan)
status: wacht-op-goedkeuring
subject: Voedseldagboek foto-tracking — watcher/classificatie-wire (Aanpak A)
approves: Deliverables/2026-07-07-voedseldagboek-foto-tracking-design.md (goedgekeurd "a")
covers: Design-doc sectie 7, punten 1-5 (Mack's deel). Punten 6-8 (schema/extractor) = aparte Atlas/Silas-workstream, buiten scope.
---

# Plan: Voedseldagboek foto-tracking — de wire (Aanpak A)

Uitvoerbaar zonder voorkennis. Een vreemde moet dit kunnen volgen. Elke taak heeft exact pad, actie en een verificatie-commando met verwachte output.

---

## Doel

Foto van een maaltijd landt op de Mac → een nieuwe watcher classificeert automatisch (eten vs. document/screenshot) → bij "eten" volgt een gestructureerde Vision-analyse (gerecht, geschatte portie, calorie/macro-schatting als bandbreedte) → weggeschreven als markdown-notitie in een inspecteerbare wachtrij. Dit is Aanpak A uit het goedgekeurde design: een **losse nieuwe watcher**, kopie van het bewezen audio-precedent (`~/transcribe_inbox.sh`).

## Wat dit plan WEL oplevert

`foto binnen → geclassificeerd → bij "eten" een gestructureerde voedings-analyse als markdown in Team Inbox/Voeding/`.

## Wat dit plan NIET oplevert (scope-grens, expliciet)

**Geen volledig werkend food-log in `mypka.db`.** De `food_logs`-schemabeslissing (B1 uitbreiden vs. B2 los schema) en de regen-extractor zijn **Atlas/Silas-terrein** (design-doc sectie 7, punten 6-8). Die vormen een **aparte workstream die pas kan starten zodra Atlas de B1-vs-B2-beslissing heeft genomen**. Tot dan landt de voedings-analyse bewust als **markdown in `Team Inbox/Voeding/`** — een inspecteerbare wachtrij die Penn later kan filen en die de toekomstige extractor als bron kan gebruiken. Dit sluit aan op Pax' anti-pattern: geen extractor bouwen vóór er brondata is. Deze wire produceert juist die eerste brondata.

## Constraints (wat mag NIET breken)

1. **`Expansions/downloads-router/route_downloads.sh` en `nl.gewoonsander.downloads-router.plist` worden NIET aangeraakt.** Dat was de reden om Aanpak A te kiezen. De nieuwe watcher draait er volledig naast.
2. **`~/transcribe_inbox.sh` en de audio-plist worden NIET gewijzigd.** We kopiëren het patroon, we muteren het origineel niet.
3. **`mypka.db` wordt NIET aangeraakt.** Geen schema-migratie, geen rijen — dat is Atlas.
4. **Idempotentie:** een reeds verwerkte foto mag nooit dubbel verwerkt worden (skip als output al bestaat).
5. **Niet-eten-afbeeldingen blijven ongemoeid** in hun huidige map, zodat de bestaande "Larry, process the inbox"-flow z'n werk kan doen.
6. **Geen nieuwe plaintext-API-key-instantie.** De nieuwe plist krijgt géén hard-coded key; het script leest de sleutel uit één gedeelde, afgeschermde locatie (zie Taak 1 + Taak 9).

---

## Bestandskaart

| Pad | Nieuw/gewijzigd | Waarom |
|---|---|---|
| `~/classify_food_inbox.sh` | **nieuw** | De watcher-logica, naar analogie van `~/transcribe_inbox.sh`: scant landingsmap, classificeert, analyseert eten, schrijft markdown. |
| `~/Library/LaunchAgents/nl.gewoonsander.food-photo-classify.plist` | **nieuw** | LaunchAgent, naar analogie van `nl.gewoonsander.audio-transcribe.plist`. WatchPath op de foto-landingsmap. **Bevat GÉÉN key.** |
| `~/.config/gewoonsander/env` | **nieuw** | Eén afgeschermde locatie (`chmod 600`) voor `ANTHROPIC_API_KEY`. Het script `source`t dit. Voorkomt een nieuwe plaintext-kopie in de plist. |
| `Team Inbox/Voeding/` | **nieuw (map)** | Landingsplek voor de gestructureerde voedings-analyse-markdown (inspecteerbare wachtrij tot Atlas een tabel-bestemming heeft). |
| `~/.local/state/gewoonsander/food-photo/` | **nieuw (map)** | State/scratch (HEIC→jpeg-conversie, verwerkings-markers). |

**Watch-doelmap:** `Team Inbox/Documents/` — daar landt de ruwe iOS-share-sheet-`.jpeg` (empirisch bevestigd tijdens verkenning). De watcher pakt alleen afbeeldingsextensies (`.jpg .jpeg .png .heic`) op; alle andere bestanden negeert hij, zodat de bestaande document-flow ongemoeid blijft.

---

## Taken (elk 2-5 min, met verificatie)

### Taak 0 — Omgeving verifiëren
**Actie:** controleer dat de benodigde tools aanwezig zijn (`python3` voor de API-call zoals in het audio-script, `sips` voor HEIC→jpeg-conversie, `plutil`/`launchctl` voor de plist).
**Verificatie:**
```
python3 --version && which sips && which plutil && which launchctl
```
**Verwacht:** een Python 3-versienummer + drie gevulde paden, geen "not found".

### Taak 1 — Gedeelde key-locatie aanmaken (afgeschermd)
**Actie:** maak `~/.config/gewoonsander/` en daarin `env` met regel `export ANTHROPIC_API_KEY=<bestaande sleutel>`. De sleutelwaarde wordt **gekopieerd uit de bestaande** `nl.gewoonsander.audio-transcribe.plist` zonder 'm naar de terminal te printen (bv. via een script dat de `<string>` na `ANTHROPIC_API_KEY` uitleest en direct naar het env-bestand schrijft). Direct `chmod 600`.
**Verificatie:**
```
ls -l ~/.config/gewoonsander/env
```
**Verwacht:** rechten `-rw-------` (alleen eigenaar). **NIET** `cat`-en (key niet echoën).
```
bash -c 'source ~/.config/gewoonsander/env; test -n "$ANTHROPIC_API_KEY" && echo "KEY_GELADEN"'
```
**Verwacht:** `KEY_GELADEN` (bevestigt leesbaar zonder de waarde te tonen).

### Taak 2 — Output- en state-mappen aanmaken
**Actie:** `mkdir -p "Team Inbox/Voeding"` en `mkdir -p ~/.local/state/gewoonsander/food-photo`.
**Verificatie:**
```
test -d "$HOME/Documents/sanders-tweede-brein/Team Inbox/Voeding" && test -d ~/.local/state/gewoonsander/food-photo && echo "MAPPEN_OK"
```
**Verwacht:** `MAPPEN_OK`.

### Taak 3 — Watcher-script schrijven (`~/classify_food_inbox.sh`)
**Actie:** schrijf het script met deze secties (naar analogie van `transcribe_inbox.sh`):
- `PATH` + `source ~/.config/gewoonsander/env` bovenaan.
- Variabelen: `WATCH="…/Team Inbox/Documents"`, `OUT="…/Team Inbox/Voeding"`, `STATE="~/.local/state/gewoonsander/food-photo"`.
- `find "$WATCH" -maxdepth 1 \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.heic' \)` loop.
- **Idempotentie:** per bestand `output="$OUT/${name}.food.md"`; `[ -f "$output" ] && continue`. Extra marker in `$STATE` voor niet-eten (zodat een niet-eten-foto niet elke trigger opnieuw geclassificeerd wordt).
- **iCloud-guard:** `brctl download` + evicted-check (identiek aan audio-script).
- **HEIC-conversie:** als extensie `.heic`, converteer met `sips -s format jpeg` naar `$STATE/<name>.jpg` vóór base64.
- **Classificatie-call:** `python3` → Claude Vision (model `claude-haiku-4-5`), base64-afbeelding + prompt: geef JSON `{type: "eten"|"document"|"screenshot"|"overig", confidence: 0-1}`.
- **Branch:** `type != "eten"` → schrijf marker in `$STATE`, `continue` (laat de foto ongemoeid in Documents). `type == "eten"` → tweede Vision-call.
- **Analyse-call:** Claude Vision → JSON `{gerecht, ingredienten[], portie_schatting, portie_eenheid, kcal_range:[min,max], eiwit_g_range, kh_g_range, vet_g_range, confidence_per_veld, onzekere_velden[]}`. Prompt eist expliciet **bandbreedtes + confidence**, nooit hard getal; vraagt om bord/bestek-schaalreferentie mee te wegen.
- **Lookup-laag:** in deze eerste versie een **stub-hook** (functie `enrich_with_food_db` die nu de Vision-schatting doorlaat). USDA/Open Food Facts/Nevo-integratie wordt een vervolgtaak zodra de basis-wire staat (YAGNI: eerst het pad, dan de precisie). Dit expliciet als TODO-commentaar in het script.
- **Escalatie:** bij `confidence < drempel` of lege `portie_schatting` → in de markdown een duidelijk gemarkeerde `> VRAAG AAN SANDER:`-blok i.p.v. een gok als hard cijfer.
- **Output schrijven:** markdown naar `$output` met frontmatter (`date`, `source: Food Photo`, `original_file`, `confidence`) + analyse + foto-verwijzing.
- Afsluiten met logregel.

**Verificatie:**
```
bash -n ~/classify_food_inbox.sh && echo "SYNTAX_OK"
```
**Verwacht:** `SYNTAX_OK` (geen syntaxfouten).

### Taak 4 — Script uitvoerbaar maken
**Actie:** `chmod +x ~/classify_food_inbox.sh`.
**Verificatie:**
```
test -x ~/classify_food_inbox.sh && echo "EXECUTABLE"
```
**Verwacht:** `EXECUTABLE`.

### Taak 5 — Handmatige dry-run tegen testafbeeldingen
**Actie:** kopieer twee bekende testbeelden naar `Team Inbox/Documents/`: (1) een maaltijdfoto, (2) een niet-eten-afbeelding (bv. de bestaande `.jpeg` of een screenshot). Draai `bash ~/classify_food_inbox.sh` handmatig (dit doet echte API-calls — dat is de bedoeling: écht verifiëren, niet "zou moeten werken").
**Verificatie:**
```
ls "$HOME/Documents/sanders-tweede-brein/Team Inbox/Voeding/"*.food.md
```
**Verwacht:** een `.food.md` voor de **maaltijdfoto**, en **géén** output voor de niet-eten-afbeelding (die is als non-food gemarkeerd in `$STATE` en ongemoeid gelaten in Documents). Inhoud van de `.food.md` bevat bandbreedtes (bv. `kcal_range`), niet één hard getal.
**Bij fout:** root-cause eerst (lees `python3`-stderr, check base64/HEIC-conversie), max 3 pogingen, dan escaleren naar Hermes.

### Taak 6 — LaunchAgent-plist schrijven (zonder key)
**Actie:** schrijf `~/Library/LaunchAgents/nl.gewoonsander.food-photo-classify.plist` naar analogie van de audio-plist, met:
- `Label`: `nl.gewoonsander.food-photo-classify`
- `ProgramArguments`: `/bin/bash` + `~/classify_food_inbox.sh`
- `WatchPaths`: `…/Team Inbox/Documents`
- `StandardOutPath`/`StandardErrorPath`: `/tmp/food-photo-classify.log`
- `RunAtLoad`: `false`
- **GÉÉN `EnvironmentVariables`/`ANTHROPIC_API_KEY`-blok** — de key komt uit `~/.config/gewoonsander/env` via het script (constraint 6).
**Verificatie:**
```
plutil -lint ~/Library/LaunchAgents/nl.gewoonsander.food-photo-classify.plist
```
**Verwacht:** `… OK`.
```
grep -c ANTHROPIC ~/Library/LaunchAgents/nl.gewoonsander.food-photo-classify.plist
```
**Verwacht:** `0` (bevestigt: geen plaintext-key in de nieuwe plist).

### Taak 7 — LaunchAgent laden
**Actie:** `launchctl load ~/Library/LaunchAgents/nl.gewoonsander.food-photo-classify.plist`.
**Verificatie:**
```
launchctl list | grep food-photo-classify
```
**Verwacht:** een regel met het label (agent geregistreerd).

### Taak 8 — End-to-end verificatie (echte trigger)
**Actie:** verwijder de dry-run-output uit Taak 5, plaats één verse maaltijdfoto in `Team Inbox/Documents/`, wacht tot de WatchPath het script triggert.
**Verificatie:**
```
sleep 20; tail -n 20 /tmp/food-photo-classify.log; ls "$HOME/Documents/sanders-tweede-brein/Team Inbox/Voeding/"*.food.md
```
**Verwacht:** loglregels van een verwerkte foto + een nieuwe `.food.md`. Bevestigt dat de WatchPath-trigger (niet alleen handmatig draaien) werkt.

### Taak 9 — Key-hardening met Argus (PLANNEN, NIET UITVOEREN)
**Status: apart, gemarkeerd, buiten uitvoerings-scope van dit plan.**
Tijdens verkenning gevonden: de `ANTHROPIC_API_KEY` staat plaintext in twee bestaande plists (`nl.gewoonsander.audio-transcribe.plist`, `nl.gewoonsander.superwhisper-meeting.plist`). Dit plan **verergert dat niet** — de nieuwe plist bevat geen key (Taak 6), en leest uit de gedeelde afgeschermde `~/.config/gewoonsander/env` (Taak 1).
**Vervolg voor Argus (los ticket, niet in deze build uitvoeren):**
1. De twee bestaande plists migreren naar dezelfde `~/.config/gewoonsander/env`-bron (key uit de plists halen).
2. De reeds blootgestelde sleutel **roteren** in de Anthropic-console (staat in git-getrackte/plaintext-context geweest).
3. Overweeg macOS Keychain i.p.v. env-bestand voor extra hardening.
Dit hoort **niet** in Mack's uitvoering van dit plan — alleen hier vermeld zodat de coördinatie geborgd is.

---

## Afhankelijkheden & vervolg-workstreams (buiten dit plan)

- **Atlas/Silas — datamodel (blokkerend voor "echt" food-log):** beslissing B1 (bestaande `food_logs` additief uitbreiden met numerieke velden) vs. B2 (los `food_nutrition_log`-schema), gevolgd door de regen-extractor die de `Team Inbox/Voeding/`-markdown (of de gefilede journal-sectie) naar tabelrijen omzet. **Pas nadat Atlas dit besluit** kan de output van deze wire in `mypka.db` landen. Tot dan: markdown-wachtrij.
- **Penn — capture-conventie:** de definitieve vorm van de journal-voedingssectie vastleggen, zodat de extractor een stabiel doel heeft.
- **Mack — vervolgtaak na basis-wire:** de lookup-laag (USDA/Open Food Facts/Nevo) invullen op de stub-hook uit Taak 3, om de Vision-schatting te verrijken/kalibreren.

## Verwacht eindresultaat van dit plan (Fase 4-check straks)

Een geladen LaunchAgent die bij elke nieuwe foto in `Team Inbox/Documents/` automatisch classificeert, en bij "eten" een gestructureerde voedings-analyse-markdown (met bandbreedtes + confidence, escalatie bij twijfel) wegschrijft naar `Team Inbox/Voeding/` — zonder de bestaande downloads-router, audio-watcher of `mypka.db` aan te raken, en zonder een nieuwe plaintext-key toe te voegen.

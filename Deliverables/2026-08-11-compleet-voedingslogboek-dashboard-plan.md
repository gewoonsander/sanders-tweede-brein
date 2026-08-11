---
date: 2026-08-11
author: Hermes met Daedalus, Penn, Atlas, Bezalel, Argus en Nemesis
type: implementatie-plan
status: implemented
subject: Compleet voedingslogboek via foto, spraak, sessiecheck en Cockpit
sop: SOP-development-workflow (Fase 2 — Plan)
approves: Deliverables/2026-08-11-compleet-voedingslogboek-dashboard-design.md
linked_sops:
  - SOP-development-workflow
  - SOP-004-argus-security-audit
  - SOP-005-nemesis-quality-gate
linked_workstreams:
  - WS-001-daily-journaling
linked_guidelines:
  - GL-002-frontmatter-conventions
  - GL-003-design-system
  - GL-013-interactie-enkelvoudige-keuzes
  - GL-016-beslis-en-waarschuwingsblokken
---

# Plan: Compleet voedingslogboek in de myPKA Cockpit

## 1. Doel

Lever één betrouwbare keten op:

`iPhone-foto | iPhone-spraak | chattekst → genormaliseerde maaltijd → dagelijks markdownlogboek → regenereerbare SQLite-mirror → Tracking/Meals-dashboard → close-session-volledigheidscheck`.

Elke actieve registratie heeft exact één categorie (`breakfast`, `lunch`, `dinner`, `snack`) en kcal/eiwit/koolhydraten/vet als minimum en maximum. Het dashboard toont per maaltijd en per dag de bandbreedte plus middenwaarde. Markdown blijft canoniek.

## 2. Constraints

1. Geen implementatie buiten dit goedgekeurde ontwerp.
2. Geen SQLite-first writes; iedere rij moet uit markdown reproduceerbaar zijn.
3. Bestaande journaalinhoud en afbeeldingen worden niet verwijderd.
4. Correcties zijn append-only en overschrijven geen geschiedenis.
5. Geen harde kcal/macro-claims zonder bandbreedte en confidence.
6. Geen rood/groen, scores of beschamende taal rond voedingskeuzes.
7. Geen credentials in git, plist, log of terminaloutput.
8. Eén foto/audio-trigger moet veilig opnieuw uitvoerbaar zijn zonder duplicaat.
9. De Mac mini is de primaire watcher-host. De MacBook Air mag niet dezelfde iCloud-invoer tegelijk claimen.
10. De bestaande Downloads-, audio- en Cockpit-routes mogen niet regresseren.
11. Het close-session-gitprotocol blijft de laatste stap.
12. Bestaande drie voedingsnotities blijven via migratie of compatibiliteit zichtbaar.

## 3. Bestandskaart

### Nieuwe bestanden

| Pad | Eigenaar | Doel |
|---|---|---|
| `Team Knowledge/SOPs/SOP-017-verwerk-voedingsregistratie.md` | Penn + Daedalus | Canonieke procedure voor foto/audio/tekst, categorie, confidence, correcties en review. |
| `Team Knowledge/Workstreams/WS-007-voeding-vastleggen-en-controleren.md` | Hermes | Choreografie van capture tot dashboard en close-session. `WS-005` bestaat al maar ontbreekt in de index; daarom is `WS-007` het eerstvolgende vrije nummer. |
| `Team Knowledge/Templates/daily-food-log.md` | Penn + Atlas | Sjabloon voor `YYYY-MM-DD-voedingslogboek.md`. |
| `Expansions/mypka-cockpit/scripts/food_log.py` | Penn + Atlas | Parser/writer voor het canonieke markdowncontract, append-only correcties en audits. |
| `Expansions/mypka-cockpit/scripts/process-food-capture.py` | Daedalus | Uniforme processor voor foto-, audio- en tekstpayloads; levert dezelfde genormaliseerde structuur. |
| `Expansions/mypka-cockpit/scripts/food_capture_lock.py` | Daedalus | Atomaire claim/idempotency over iCloud-hosts. |
| `Expansions/mypka-cockpit/scripts/install-food-capture-macos.sh` | Daedalus | Expliciete, herhaalbare installatie van de Mac-mini-watcher. |
| `Expansions/mypka-cockpit/launchd/nl.gewoonsander.food-capture.plist.template` | Daedalus | Template zonder secrets of machinevaste homepaden. |
| `Expansions/mypka-cockpit/scripts/tests/test_food_log.py` | Atlas | Parser-, correctie-, audit- en aggregatietests. |
| `Expansions/mypka-cockpit/scripts/tests/test_food_capture.py` | Daedalus | Classificatie-, idempotency- en retrytests met fixtures/mocks. |
| `Expansions/mypka-cockpit/server/tracking.food.test.mjs` | Atlas | API-contracttests voor maaltijdregels, dagstatus en totalen. |
| `Expansions/mypka-cockpit/web/src/components/FoodDaySummary.tsx` | Bezalel | Vandaagkaart met vier categorieën, totalen en completeness. |
| `Expansions/mypka-cockpit/web/src/components/FoodNutritionRange.tsx` | Bezalel | Toegankelijke weergave van min/max/middenwaarde/confidence. |

### Gewijzigde bestanden

| Pad | Eigenaar | Wijziging |
|---|---|---|
| `AGENTS.md` | Hermes | Voedingscheck toevoegen aan gecombineerd close-session-vraagmoment vóór git-backup. |
| `Team Knowledge/SOPs/INDEX.md` | Hermes | SOP-017 registreren. |
| `Team Knowledge/Workstreams/INDEX.md` | Hermes | Bestaande WS-005 herstellen in index en WS-007 registreren. |
| `Team Knowledge/Workstreams/WS-001-daily-journaling.md` | Penn | Food-log als gespecialiseerd dagelijks capturecontract opnemen via wikilinks, zonder SOP-017 te dupliceren. |
| `PKM/My Life/Goals/gewicht-aanpakken.md` | Penn | Verwijzen naar het voedingslogboek als gekozen ondersteunend systeem; geen nieuwe doelwaarden toevoegen. |
| `Expansions/mypka-cockpit/sqlite-extension/schema/04-module-habits-food.sql` | Atlas | `food_logs` additief uitbreiden; afgeleide `food_log_days` en views toevoegen. |
| `Expansions/mypka-cockpit/scripts/regen-mypka-db.py` | Atlas | Food-logextractor opnemen in owned tables/views en regenpad. |
| `Expansions/mypka-cockpit/sqlite-extension/DATA-CONTRACT.md` | Atlas | Canoniek markdowncontract, eigenaarschap, nulls, correcties en ranges documenteren. |
| `Expansions/mypka-cockpit/server/tracking.js` | Atlas | API uitbreiden met nutrition ranges, dagtotalen en completeness. |
| `Expansions/mypka-cockpit/web/src/lib/trackingTypes.ts` | Bezalel | Strikte types voor nutrition en day summaries. |
| `Expansions/mypka-cockpit/web/src/components/FoodGallery.tsx` | Bezalel | Maaltijdkaart uitbreiden met categorie, ranges, confidence en correctiestatus. |
| `Expansions/mypka-cockpit/web/src/sections/Tracking.tsx` | Bezalel | “Nothing measured”-contract vervangen door neutrale meetuitleg en Today/History-opbouw. |
| `Expansions/mypka-cockpit/web/src/views/TrackingView.tsx` | Bezalel | Dagdata aan nieuwe componenten doorgeven. |
| `Expansions/mypka-cockpit/web/src/views/wellness.css` | Bezalel | Alleen bestaande design-tokens gebruiken voor responsive voedingsoverzicht. |
| `Expansions/mypka-cockpit/package.json` | Daedalus | Gerichte food-test- en capture-statusscripts toevoegen. |

### Migratiebronnen, niet verwijderen

- `PKM/Journal/2026/07/2026-07-03-voeding-kippenpoot.md`
- `PKM/Journal/2026/07/2026-07-10-voeding-cottage-cheese.md`
- `PKM/Journal/2026/08/2026-08-04-voeding-banaan-sinaasappel.md`

Deze blijven bestaan als historische SSOT. De extractor ondersteunt ze via een compatibiliteitsparser of een append-only migratie-index; de implementatie kiest de minst duplicerende route na fixturetests.

## 4. Uitvoeringsvolgorde

### Taak 1 — Baseline en rollbackpunt vastleggen

**Eigenaar:** Hermes

**Acties**

1. `git status --short` vastleggen en alle bestaande gebruikerswijzigingen onderscheiden van deze feature.
2. Huidige build en relevante tests draaien.
3. Huidige DB-schema en aantal `food_logs`-rijen read-only vastleggen.
4. Controleren welke host de Mac mini is en of daar de oude food/audio-watchers aanwezig zijn; niets unloaden of wijzigen in deze taak.

**Verificatie**

```bash
npm --prefix Expansions/mypka-cockpit run build
node --test Expansions/mypka-cockpit/server/*.test.mjs
sqlite3 Expansions/mypka-cockpit/mypka.db '.schema food_logs'
sqlite3 Expansions/mypka-cockpit/mypka.db 'select count(*) from food_logs;'
```

**Verwacht:** build exit 0; bestaande tests exit 0; schema en startaantal gedocumenteerd. Als `mypka.db` elders staat, eerst het pad uit bestaande config/code oplossen en daarna hetzelfde read-only bewijs verzamelen.

### Taak 2 — Procedures en markdowncontract schrijven

**Eigenaar:** Penn + Hermes

**Acties**

1. `SOP-017-verwerk-voedingsregistratie.md` schrijven met triggers, vier categorieën, schattingsregels, lage-confidence-vraag, correctiecontract en idempotency-ID.
2. `WS-007-voeding-vastleggen-en-controleren.md` schrijven als verwijzende choreografie; geen stappen uit SOP-017 dupliceren.
3. `daily-food-log.md` maken met geldig YAML en vaste machinevelden.
4. Indexen bijwerken; ontbrekende `WS-005-team-retro-and-self-improvement-loop`-rij herstellen.
5. `WS-001` en `gewicht-aanpakken` alleen via wikilinks verbinden.

**Verificatie**

```bash
rg -n 'SOP-017|WS-007|WS-005' 'Team Knowledge/SOPs/INDEX.md' 'Team Knowledge/Workstreams/INDEX.md'
rg -n 'breakfast|lunch|dinner|snack|confidence|supersedes' 'Team Knowledge/SOPs/SOP-017-verwerk-voedingsregistratie.md'
rg -n '\[\[SOP-017-verwerk-voedingsregistratie\]\]' 'Team Knowledge/Workstreams/WS-007-voeding-vastleggen-en-controleren.md' 'Team Knowledge/Workstreams/WS-001-daily-journaling.md'
```

**Verwacht:** alle vier categorieën exact één keer als normatieve lijst in SOP-017; workstreams verwijzen ernaar.

### Taak 3 — Testfixtures en parsercontract eerst vastleggen

**Eigenaar:** Atlas

**Acties**

1. Fixtures maken in een tijdelijke testdirectory binnen `Expansions/mypka-cockpit/scripts/tests/fixtures/` voor:
   - vier categorieën;
   - twee snacks op één dag;
   - foto, audio en tekstbron;
   - complete/incomplete/unknown dag;
   - lage confidence en ontbrekende macro;
   - correctie via `supersedes_entry_id`;
   - dubbele source-ID;
   - de drie historische voedingsnotities.
2. Faaltests schrijven vóór parserimplementatie.

**Verificatie**

```bash
python3 -m unittest discover -s Expansions/mypka-cockpit/scripts/tests -p 'test_food_*.py'
```

**Verwacht vóór implementatie:** tests falen uitsluitend door ontbrekende parser/processor, niet door ongeldige fixtures.

### Taak 4 — Canonieke food-logwriter/parser bouwen

**Eigenaar:** Penn + Atlas

**Acties**

1. `food_log.py` bouwen met parse, append-meal, append-correction en append-completion-audit.
2. Atomaire write gebruiken: tempbestand in dezelfde directory, fsync waar passend, daarna rename.
3. Iedere entry krijgt deterministische `entry_id`/`source_id`; dubbele invoer wordt genegeerd.
4. De laatste geldige completion-audit bepaalt `day_complete` en `confirmed_at`.
5. Frontmatter-summary wordt synchroon gehouden met de laatste audit, zonder maaltijdgeschiedenis te herschrijven.

**Verificatie**

```bash
python3 -m unittest Expansions/mypka-cockpit/scripts/tests/test_food_log.py
```

**Verwacht:** alle parser-, append-, correctie-, audit- en duplicate-tests groen; een tweede run geeft byte-identieke output waar geen nieuwe input bestaat.

### Taak 5 — Uniforme captureprocessor bouwen

**Eigenaar:** Daedalus

**Acties**

1. `process-food-capture.py` bouwen met één intern resultaatmodel voor `photo`, `audio` en `text`.
2. Fotoanalyse gebruikt een provider-adapter zodat tests geen live API nodig hebben.
3. Audio consumeert bestaande transcriptoutput; transcriptie zelf wordt niet dubbel gebouwd.
4. Categorievolgorde: expliciete categorie > transcript/tekstcontext > tijdvenster > review required.
5. Calorische dranken tellen mee; water/zwarte koffie/ongezoete thee zijn optioneel.
6. Lage confidence maakt een reviewitem met één gerichte vraag, maar bewaart de ruwe input.
7. Exponentiële retry, gestructureerde logs zonder maaltijdinhoud of secrets, en dead-letter/review-wachtrij.

**Verificatie**

```bash
python3 -m unittest Expansions/mypka-cockpit/scripts/tests/test_food_capture.py
```

**Verwacht:** fixtures voor alle drie invoerkanalen leveren hetzelfde schema; retry en review zijn deterministisch; logs bevatten geen API-key of base64-afbeelding.

### Taak 6 — Cross-machine claim en macOS-installatie bouwen

**Eigenaar:** Daedalus

**Acties**

1. Claim-ID baseren op content hash + bronmetadata; claimbestanden atomaire `O_EXCL`-semantiek geven in een gedeelde state-map.
2. Processed/review/failed statussen idempotent bewaren.
3. Eén LaunchAgent-template maken dat zowel foto- als verwerkte audiopayloads kan aanbieden zonder bestaande audio-transcriptie te vervangen.
4. Installer valideert tools, secretslocatie, paden en hostrol; alleen de Mac mini krijgt `enabled`.
5. Bestaande oude food-watcher eerst read-only inventariseren. Pas na succesvolle nieuwe end-to-end-test gecontroleerd unloaden; oude bestanden bewaren voor rollback.

**Verificatie**

```bash
plutil -lint Expansions/mypka-cockpit/launchd/nl.gewoonsander.food-capture.plist.template
rg -n 'ANTHROPIC_API_KEY|sk-ant-' Expansions/mypka-cockpit/launchd Expansions/mypka-cockpit/scripts && exit 1 || true
npm --prefix Expansions/mypka-cockpit run food:capture-status
```

**Verwacht:** plist geldig; geen secretmatches; status toont exact één actieve primaire host. Installer voert geen wijziging uit zonder expliciete `--install`.

### Taak 7 — Schema en regen-extractor implementeren

**Eigenaar:** Atlas

**Acties**

1. `food_logs` additief uitbreiden met ranges, bron-ID, correctiestatus en confidence.
2. `food_log_days` plus aggregatieview maken voor completeness en min/max/midpoint-totalen.
3. `regen-mypka-db.py` eigenaar maken van uitsluitend deze afgeleide food-tabellen/views.
4. Canonieke dagelijkse logs en historische compatibiliteitsfixtures parsen.
5. Rebuild in een tijdelijke DB uitvoeren; pas na vergelijking de echte mirror regenereren.

**Verificatie**

```bash
python3 -m unittest Expansions/mypka-cockpit/scripts/tests/test_food_log.py
python3 Expansions/mypka-cockpit/scripts/regen-mypka-db.py --help
```

Daarna met het bestaande veilige regencommando naar een tijdelijke DB:

```bash
sqlite3 /tmp/mypka-food-test.db 'select meal_type, count(*) from food_logs where is_active = 1 group by meal_type order by meal_type;'
sqlite3 /tmp/mypka-food-test.db 'select log_date, kcal_min, kcal_max, kcal_mid, day_complete from v_food_day_totals order by log_date;'
```

**Verwacht:** alleen de vier toegestane categorieën; gecorrigeerde rijen niet dubbel; totalen exact gelijk aan fixtures; tweede regenrun identieke resultaten.

### Taak 8 — Read-only API uitbreiden

**Eigenaar:** Atlas

**Acties**

1. `tracking.js` typed-contract uitbreiden met nutrition ranges, confidence, active/correction-info en day summaries.
2. Bestaande lege-/ontbrekende-tabellen-degradatie behouden.
3. Geen schrijfroute toevoegen.
4. API-test schrijven voor nulls, ranges, sortering, meerdere snacks en completeness.

**Verificatie**

```bash
node --test Expansions/mypka-cockpit/server/tracking.food.test.mjs
```

**Verwacht:** tests groen; payload bevat geen `undefined`/NaN; datums en numerieke ranges zijn stabiel.

### Taak 9 — Tracking/Meals-dashboard bouwen

**Eigenaar:** Bezalel

**Acties**

1. `trackingTypes.ts` exact laten aansluiten op het API-contract.
2. `FoodNutritionRange.tsx` bouwen met toegankelijke min–max-tekst en optionele middenwaarde.
3. `FoodDaySummary.tsx` bouwen met Ontbijt, Lunch, Avondeten, Tussendoor, dagtotalen en confirmation-status.
4. `FoodGallery.tsx` uitbreiden zonder foto-placeholder- en journallinkgedrag te breken.
5. `Tracking.tsx`-copy aanpassen: meten zonder oordeel; geen “nothing measured”-claim meer.
6. Responsive layouts uitsluitend met bestaande GL-003-tokens.

**Verificatie**

```bash
npm --prefix Expansions/mypka-cockpit run build
```

**Verwacht:** TypeScript en Vite build exit 0. Daarna visueel testen op mobiel, tablet en desktop met fixtures voor leeg, gedeeltelijk, compleet, lage confidence en ontbrekende foto.

### Taak 10 — Close-sessionprotocol uitbreiden

**Eigenaar:** Hermes + Penn

**Acties**

1. `AGENTS.md` uitbreiden zodat de voedselcheck in hetzelfde gecombineerde vraagmoment als journaal/habits komt.
2. GL-013 respecteren met `J/N` en GL-016 met een unieke besliscode.
3. Bij `J`: completion-audit schrijven, geen inhoudelijke vervolgvraag.
4. Bij `N`: één open recallvraag; antwoord via SOP-017 verwerken; daarna opnieuw `J/N` vragen.
5. Git backup blijft na session-log, journaal, habits, voeding en eventuele permission-check.

**Verificatie**

Voer drie gesimuleerde protocollen uit tegen een tijdelijke vaultkopie:

1. `J` → één audit, nul recallvragen.
2. `N` → recall → twee ontbrekende maaltijden → herbevestiging `J` → complete.
3. `N` → geen herinnering → incomplete blijft staan, backupvolgorde blijft intact.

**Verwacht:** geen dubbele audit bij retry; alle keuzes enkelletterig; geen gitactie vóór de voedingscheck klaar is.

### Taak 11 — Historische invoer compatibel maken

**Eigenaar:** Penn + Atlas

**Acties**

1. De drie bestaande voedingsnotities als fixtures parsen.
2. Categorie bepalen uit vastgelegde tijd/context: kippenpoot blijft reviewbaar als categorie niet hard afleidbaar is; cottage cheese 08:47 wordt ontbijt; banaan/sinaasappel is expliciet lunch.
3. Geen historische notitie herschrijven. Eventuele normalisatie landt als afgeleide mapping met bronverwijzing.

**Verificatie**

```bash
sqlite3 /tmp/mypka-food-test.db "select source_path, meal_type, kcal_min, kcal_max from food_logs where source_path like '%voeding-%' order by source_path;"
```

**Verwacht:** drie unieke actieve registraties, correcte ranges, geen duplicaten, onzekere categorie niet stilzwijgend verzonnen.

### Taak 12 — Securitygate

**Eigenaar:** Argus

**Acties**

1. SOP-004 uitvoeren op API-keybeheer, LaunchAgent, inputvalidatie, padcontainment, afbeeldingsmetadata en logging.
2. Controleren dat geen ongefilterde bestandsnaam/path-traversal naar PKM of media-API gaat.
3. Controleren dat maaltijdinhoud niet onnodig in technische logs verschijnt.
4. HIGH/CRITICAL eerst herstellen en opnieuw testen.

**Verificatie**

- Geen secrets in `git diff`, plists of logs.
- Path-traversaltests falen gesloten.
- Argus-rapport bevat PASS of expliciete blokkade.

### Taak 13 — End-to-end tests op echte invoer

**Eigenaar:** Hermes coördineert Daedalus, Penn en Atlas

**Acties**

1. Op Mac mini één nieuwe echte iPhone-foto verwerken.
2. Eén echte iPhone-spraakregistratie verwerken.
3. Eén tekstuele achterafregistratie verwerken.
4. Dezelfde foto tweemaal aanbieden.
5. Eén correctie uitvoeren.
6. Close-session `N`-recall en daarna `J` uitvoeren.
7. Mirror volledig opnieuw bouwen en dashboardwaarden vergelijken.

**Verificatie**

```bash
npm --prefix Expansions/mypka-cockpit run food:test
npm --prefix Expansions/mypka-cockpit run build
npm --prefix Expansions/mypka-cockpit run food:capture-status
```

**Verwacht:** alle tests/build groen; foto exact eenmaal; drie bronnen in dashboard; correctie niet dubbelgeteld; dag compleet na bevestiging; regen behoudt exacte totalen.

### Taak 14 — Nemesis-kwaliteitsgate

**Eigenaar:** Nemesis

**Acties**

1. SOP-005 uitvoeren op desktop, tablet en mobiel.
2. Keyboard, focus, screenreaderlabels, contrast en reduced motion controleren.
3. Numerieke ranges, lange maaltijdnamen, ontbrekende foto's en lage confidence visueel testen.
4. Geen release bij FAIL of blocker.

**Verificatie**

Nemesis levert PASS met screenshotbewijs of een herstelijst. Na herstel wordt de gate opnieuw volledig gedraaid.

### Taak 15 — Documentatie, status en rollback afronden

**Eigenaar:** Hermes + Daedalus + Atlas

**Acties**

1. `DATA-CONTRACT.md`, SOP/WS-indexen en gebruiksinstructie nalopen.
2. Oude watcher pas archiveren nadat de nieuwe watcher meerdere echte inputs correct verwerkte; rollbackcommando documenteren.
3. `git diff --check`, volledige build/tests en SSOT/wikilinkcontrole uitvoeren.
4. Sessielog schrijven met besluiten, verificatiebewijs en open punten.

**Verificatie**

```bash
git diff --check
npm --prefix Expansions/mypka-cockpit run food:test
npm --prefix Expansions/mypka-cockpit run build
rg -n '\[\[(SOP-017-verwerk-voedingsregistratie|WS-007-voeding-vastleggen-en-controleren)\]\]' AGENTS.md 'Team Knowledge' 'PKM/My Life/Goals/gewicht-aanpakken.md'
```

**Verwacht:** geen whitespacefouten; tests/build groen; procedures vindbaar; rollback beschreven; geen inhoudelijke open blocker.

## 5. Uitvoeringsgates

De uitvoering stopt bij elk van deze condities:

- ontwerp- of planwijziging die Sanders goedkeuring nodig heeft;
- onduidelijke canonieke bron of dreigende SSOT-duplicatie;
- bestaande ongerelateerde wijzigingen overlappen een doelbestand;
- drie mislukte pogingen op dezelfde root cause;
- Argus HIGH/CRITICAL;
- Nemesis FAIL;
- cross-machine dubbele verwerking niet betrouwbaar uitgesloten;
- werkelijke API-invoer zou zonder geldige key of toestemming moeten worden verstuurd.

## 6. Definitie van klaar

“Klaar” betekent niet alleen dat de UI bouwt. Alle twaalf acceptatiecriteria uit het ontwerp zijn met vers bewijs gehaald, inclusief echte iPhone-foto, echte spraakregistratie, close-session-recall, volledige DB-regen, idempotency, Mac-mini-hostcontrole, Argus PASS en Nemesis PASS.

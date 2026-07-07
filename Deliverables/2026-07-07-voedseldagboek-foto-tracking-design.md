---
date: 2026-07-07
author: Mack (Automation Specialist)
type: design-doc
sop: SOP-development-workflow (Fase 1 — Brainstorm/Design)
status: wacht-op-goedkeuring
subject: Voedseldagboek via foto-tracking — uitbreiding bestaande foto-pipeline
builds_on:
  - Deliverables/2026-07-05-ai-voedingslogboek-onderzoek.md (Pax)
  - PKM/My Life/Goals/gewicht-aanpakken.md
  - ~/transcribe_inbox.sh + nl.gewoonsander.audio-transcribe.plist
  - Expansions/downloads-router/route_downloads.sh
---

# Design: Voedseldagboek via foto-tracking

## 1. Doel

Sander wil afvallen (`PKM/My Life/Goals/gewicht-aanpakken.md`: 88,9 → 82 kg eind 2026, gekoppeld aan slaapapneu — 10% gewichtsverlies ≈ 26% AHI-reductie). Om dat te ondersteunen wil hij een **naadloos** voedseldagboek: een foto van een maaltijd maken met **dezelfde knop** die hij nu al gebruikt (iOS share-sheet → ruwe foto landt op de Mac), waarna het systeem herkent dat het etenswaar is en er automatisch een food-log-entry van maakt met een **schatting** van calorieën en macro's (eiwit/koolhydraten/vet).

**Kernprincipe (naadloosheid):** geen nieuwe app, geen bot, geen tweede login. Het voedsellogboek wordt een **aftakking van de bestaande foto-pipeline**, niet een apart kanaal. De classificatie "is dit eten of gewoon een document/screenshot?" gebeurt automatisch; Sander hoeft niets extra's te doen.

**Empirisch bevestigde aannames (verkenning afgerond):**
- Ruwe foto's landen op de Mac. Bewijs: `Team Inbox/Documents/` bevat een `.jpeg` met iOS-share-sheet-bestandsnaam (UUID + datum); git-historie toont dat verwerkte foto's daarna uit Team Inbox verdwijnen. Dus niet enkel OCR-tekst — de volledige afbeelding is beschikbaar voor Vision-analyse.
- De bestaande `downloads-router` routeert **puur op bestandsnaam** (geen OCR, geen LLM): `Scherm­afbeelding*/Screenshot*` → `Team Inbox/Screenshots/`, `pdf/docx/...` → `Team Inbox/Documents/`. Foto's (`.jpg/.jpeg/.png` zonder screenshot-naam) worden nu **niet** door de router opgepakt — die vallen buiten de `case`-takken.
- Het audio-precedent (`~/transcribe_inbox.sh` + `nl.gewoonsander.audio-transcribe.plist`) is de bewezen blauwdruk: WatchPath-LaunchAgent → transcriptie → **directe Claude API-call** (Haiku) voor classify/route → resultaat weggeschreven. Exact hetzelfde patroon, met Claude **Vision** i.p.v. Whisper.

---

## 2. Nauwkeurigheids-caveat (leest eerst, bepaalt de hele toon)

Uit Pax' onderzoek (`Deliverables/2026-07-05-ai-voedingslogboek-onderzoek.md`), cross-source bevestigd:

- **Voedselidentificatie** (wat is het): 68–86% real-world.
- **Portiegrootte** (hoeveel): notoir onnauwkeurig, **18–40% fout** — het grootste probleem.
- **Calorieën**: ~36% MAPE bij Claude Vision — vergelijkbaar met menselijke zelfrapportage, niet beter.
- **Macro's** (eiwit/kh/vet): slechtst van alles, 42–110% fout.

**Consequentie voor het ontwerp:** elk cijfer wordt als **bandbreedte + confidence** gelogd, nooit als hard getal. Bij lage confidence of onduidelijke portie → één gerichte vraag aan Sander, geen stille gok. Gratis nauwkeurigheidswinst: foto mét bord/bestek in beeld als schaalreferentie (niet ingezoomd).

**Lookup-lagen** (voor macro's per 100 g, zodra het gerecht + portie geschat zijn):
- **USDA FoodData Central** — primair, gratis REST-API, data.gov-key, onbeperkt (Amerikaans gericht).
- **Open Food Facts** — aanvullend, gratis, sterk voor verpakte NL/EU-producten met barcode.
- **Nevo (RIVM)** — eenmalig geïmporteerd lokaal bestand (geen API) voor NL-basisproducten.
Geen enkele bron volstaat alleen; combineren is nodig. Details en bronlinks staan in Pax' doc — niet hier herhaald.

---

## 3. Drie technische aanpakken

### Aanpak A — Losse nieuwe fotowatcher (spiegel van het audio-precedent)

Een **nieuw, apart script + LaunchAgent** dat een WatchPath op de foto-landingsmap(pen) zet (`Team Inbox/Documents/` en/of `Team Inbox/Screenshots/`, of een dedicated `Team Inbox/Foto/`). Elke binnenkomende afbeelding gaat door één **Claude Vision-classificatiecall**: `{type: eten | document | screenshot | overig, confidence}`.
- `type = eten` → voedingsflow (Vision-analyse gerecht/portie → lookup → food-log-entry).
- anders → laat de bestaande OCR/route-flow z'n werk doen (niets overschrijven).

**Afweging:**
- (+) Raakt de bestaande, werkende `downloads-router` niet aan — nul regressierisico op het huidige screenshot/document-routeren.
- (+) 1-op-1 hetzelfde patroon als `transcribe_inbox.sh` → laagste bouw- en onderhoudsdrempel, bewezen infra (iCloud-download-guard, idempotentie via "bestaat output al?").
- (+) Voedingslogica geïsoleerd in één bestand — makkelijk te testen/uitzetten.
- (−) Twee watchers op deels overlappend gebied → coördinatie nodig zodat ze niet dezelfde afbeelding dubbel pakken (op te lossen met een "reeds verwerkt"-markering of aparte landingsmap).
- (−) Een extra Vision-call per binnenkomende afbeelding (kleine API-kost; classificatie is goedkoop met Haiku-Vision).

### Aanpak B — Classificatiestap ingebouwd in de bestaande downloads-router

De Vision-classificatie wordt **in `route_downloads.sh` zelf** gezet: vóór de bestandsnaam-`case` draait bij elke afbeelding een Claude Vision-call die eten/document/screenshot bepaalt, en de router krijgt een extra tak "eten → voedingsflow".

**Afweging:**
- (+) Eén enkel routeringspunt — geen twee watchers, geen dubbel-pak-coördinatie. Conceptueel het "netst".
- (+) Elke afbeelding passeert sowieso al de router → natuurlijke plek voor de beslissing.
- (−) Verandert **productiecode die nu correct werkt** (screenshot/document-routering voor het hele team, niet alleen voeding) → regressierisico op een breder gebruikt pad.
- (−) De router is nu bewust "dom & snel" (pure bestandsnaam-match, geen netwerk). Een LLM-call erin bouwen maakt 'm traag, netwerk-afhankelijk en API-key-afhankelijk voor álle downloads, ook niet-foto's. Dat is scope-creep op een gedeelde component.
- (−) De router draait op `~/Downloads` (`RunAtLoad true`), niet op Team Inbox — de food-foto's komen daar mogelijk via een ander pad binnen (iOS-share direct naar Team Inbox), waardoor de router ze soms niet eens ziet.

### Aanpak C — Twee-traps: dunne classificatie-router + aparte voedings-verwerker

Splits de verantwoordelijkheid. Een **minimale classificatie-watcher** (goedkope Vision-call, alleen "eten ja/nee") verplaatst food-foto's naar een dedicated `Team Inbox/Voeding/`-map. Een **tweede watcher** op die map doet de zware voedings-analyse (gerecht → portie → lookup → food-log). Niet-eten blijft ongemoeid in de bestaande flow.

**Afweging:**
- (+) Scheiding van zorgen: goedkope triage los van dure analyse; elke stap apart testbaar en herstartbaar.
- (+) `Team Inbox/Voeding/` wordt een expliciete, inspecteerbare wachtrij — Sander ziet wat er als "eten" is herkend vóór verwerking; makkelijke handmatige correctie.
- (+) Sluit aan op het bestaande "router verplaatst naar submap"-patroon (downloads-router doet dit al) + het "watcher op submap"-patroon (audio-transcribe).
- (−) Meer bewegende delen dan A (twee scripts/agents i.p.v. één) — hoogste onderhoudslast van de drie.
- (−) Twee hops = iets meer latency vóór een food-log klaar is (niet krit-tijdgevoelig, dus mild).

---

## 4. food_logs-schema: calorieën/macro's — OPEN BESLISSING voor Silas/Atlas

**Dit los ik als Mack bewust NIET zelf op — het is een data-modelbeslissing, geen wire-beslissing.** Wel de trade-off scherp:

De bestaande `food_logs`-tabel in `mypka.db` is **0 rijen** en bewust **"anxiety-free"** ontworpen (hard-coded regel in de Cockpit-scaffold `server/tracking.js`: *"NO numbers, NO calories, NO scores"*). Huidige velden: `mahlzeit_typ`, `kontext`, `eiweiss_sichtbar` (vlag), `photo_path`, `note`. Er is ook **nog geen extractor** die journal → food_logs vult. Dit botst frontaal met Sanders wens om calorieën + macro's te loggen.

Twee legitieme routes, ter beslissing door Silas/Atlas:

| Route | Wat | Trade-off |
|---|---|---|
| **B1 — Bestaande tabel additief uitbreiden** | Numerieke kolommen toevoegen aan `food_logs` (`kcal_est`, `protein_g_est`, `carbs_g_est`, `fat_g_est`, `portion_est`, `confidence`, `source`), plus `v_food_log_calendar` bijwerken. | (+) Eén tabel, één datum-sleutel, directe JOIN met gewicht/slaap. (−) Doorbreekt de expliciete "anxiety-free"-filosofie van de gedeelde scaffold — die keuze moet bewust heroverwogen, niet stilzwijgend overschreven. Bestaande `server/tracking.js`-regel moet dan mee. |
| **B2 — Los nieuw schema** | Aparte tabel (bv. `food_nutrition_log`) met de numerieke velden; `food_logs` blijft anxiety-free voor kwalitatief loggen. | (+) Respecteert de bestaande filosofie; scheidt "kwalitatief signaal" van "kwantitatieve schatting". (−) Twee food-tabellen om te onderhouden en te JOIN-en; mogelijke overlap/verwarring welke bron leidend is. |

Beide routes vereisen dat **Silas/Atlas de regen-extractor bouwt** (journal-voedingssectie → tabelrijen) — die bestaat vandaag niet. Ongeacht de gekozen watcher-aanpak (A/B/C) is dit dezelfde open beslissing: de wire die ik bouw levert een gestructureerde voedings-entry aan; wélke tabelvorm die landt, bepalen Silas/Atlas.

Aanbevolen richting (advies, geen besluit): **B1 additief uitbreiden** — één datum-as voor voeding/gewicht/slaap is het hele punt van het afval-doel, en een tweede food-tabel fragmenteert dat beeld. Maar de anxiety-free-keuze is Sanders eigen filosofische call, dus expliciet aan hem/Silas voorleggen.

---

## 5. Aanbeveling: Aanpak A

**Bouw een losse nieuwe fotowatcher (Aanpak A), met de voedings-analyse in datzelfde script.**

Waarom A boven B en C:
- **Laagste risico:** raakt de werkende `downloads-router` (gedeelde teamcomponent) niet aan. B stopt een trage, netwerk- en key-afhankelijke LLM-call in een nu bewust "domme, snelle" gedeelde router — scope-creep met regressierisico voor het hele team, niet alleen voeding. YAGNI-regel uit de SOP: A haalt alles weg wat niet strikt nodig is.
- **Bewezen patroon:** A is een directe kopie van `transcribe_inbox.sh` — dezelfde iCloud-download-guard, dezelfde idempotentie ("bestaat de output al? skip"), dezelfde directe Claude-API-aanroep. Snelste weg naar iets werkends dat Sander een paar weken kan vullen (nodig vóór de extractor verfijnd kan worden — zie Pax: nu nog nul food-data).
- **C is beter op papier maar te zwaar nu:** de twee-traps-splitsing is elegant, maar voegt een tweede script/agent toe voordat er één food-log bestaat. Begin simpel (A); als de classificatie-triage in de praktijk apart schaalbaar moet, promoveren we A later naar C. Niet vooraf bouwen.

Concreet inhaakpunt binnen A: de Vision-**classificatiecall staat vóór de route-split**, precies waar Haiku nu in `transcribe_inbox.sh` de PKM-bestemming kiest. Eten → voedingsanalyse; anders → afbeelding met rust laten voor de bestaande flow. Bij lage confidence op portie/macro → escalatievraag naar Sander i.p.v. gok.

---

## 6. Apart hardening-actiepunt (buiten scope van dit design)

Tijdens de verkenning gevonden: de **`ANTHROPIC_API_KEY` staat in plaintext** in drie LaunchAgent-plists (`~/Library/LaunchAgents/nl.gewoonsander.audio-transcribe.plist`, `…superwhisper-meeting.plist`, en zou bij Aanpak A ook in de nieuwe plist belanden als we het patroon klakkeloos kopiëren). Dit is een bestaande blootstelling, niet door dit project geïntroduceerd, maar de nieuwe watcher mag 'm niet verergeren.

**Aanbeveling (aparte actie, niet in scope van deze build):** key uit de plists halen en centraliseren (bv. een `~/.config/gewoonsander/env`-bestand met `chmod 600`, of macOS Keychain via `security find-generic-password`), en alle scripts daaruit laten lezen. Voor Argus (security) om op te pakken als los ticket. **In dit design: gewoon vermeld, niet opgelost.**

---

## 7. Wat er NA goedkeuring gebouwd wordt (en door wie)

Fase 2 (plan) en Fase 3 (uitvoering) van SOP-development-workflow, pas ná goedkeuring van Sander:

**Mack (ik) — de wire:**
1. Nieuwe fotowatcher-script + LaunchAgent (kopie van het audio-precedent, WatchPath op de foto-landingsmap).
2. Claude Vision-**classificatiecall** (eten vs. document/screenshot, met confidence).
3. Bij "eten": Vision-**analysecall** (gerecht, ingrediënten, geschatte portie + eenheid, confidence per veld) → lookup tegen USDA/Open Food Facts/Nevo → gestructureerde voedings-entry (bandbreedte + confidence, geen hard getal).
4. **Escalatieflow** bij lage confidence (één gerichte vraag naar Sander) — vóór volledige automatisering.
5. Key-hardening meenemen zodat de nieuwe plist de plaintext-blootstelling niet uitbreidt (coördineren met Argus).

**Silas / Atlas — het datamodel:**
6. Beslissing B1 (uitbreiden) vs. B2 (los schema) — de anxiety-free-heroverweging.
7. Schema-migratie in `mypka.db` conform die beslissing (+ `v_food_log_calendar` bijwerken, + de `server/tracking.js`-"no numbers"-regel als B1).
8. De **regen-extractor** bouwen (journal-voedingssectie → food-tabelrijen) — bestaat vandaag niet; is het daadwerkelijk ontbrekende stuk uit Pax' status-check.

**Penn — capture-conventie:** vorm van de journal-voedingssectie (frontmatter/body) vastleggen, zodat de extractor een stabiel doel heeft.

**Volgorde-advies:** eerst Mack's foto→journal-pad (A) live, een paar weken echte foto's verzamelen, dán Silas/Atlas de extractor verfijnen op echte voorbeelden (Pax' anti-pattern: geen extractor bouwen vóór er brondata is).

---

## Bronnen / referenties

- `Deliverables/2026-07-05-ai-voedingslogboek-onderzoek.md` (Pax — nauwkeurigheid, lookup-lagen, app-vergelijking, anxiety-free-botsing)
- `PKM/My Life/Goals/gewicht-aanpakken.md` (doel + baseline)
- `~/transcribe_inbox.sh`, `~/Library/LaunchAgents/nl.gewoonsander.audio-transcribe.plist` (audio-precedent)
- `Expansions/downloads-router/route_downloads.sh`, `nl.gewoonsander.downloads-router.plist` (huidige foto-routering)
- `mypka.db` — `food_logs`, `v_food_log_calendar` (0 rijen, anxiety-free schema)

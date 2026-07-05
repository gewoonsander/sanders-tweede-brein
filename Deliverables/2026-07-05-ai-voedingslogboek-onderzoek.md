# AI-ondersteund Voedingslogboek — Architectuur/Haalbaarheidsonderzoek

**Date:** 2026-07-05
**Prepared by:** Pax (Senior Researcher)
**Decision:** Hoe zet je een AI-ondersteund voedingslogboek op (foto → automatisch verwerkt → gekoppeld aan gewicht/slaap → beschikbaar voor coaching), met minimale handmatige invoer
**Bouwt voort op:** bestaande gewicht/slaap-tracking (`PKM/My Life/Topics/gezondheid-data.md`, `slaapapneu.md`), de Cockpit's gedeeltelijk gedefinieerde `food_logs`-contract, en het audio-transcriptie-precedent (`~/transcribe_inbox.sh`)

---

## Executive Summary

De infrastructuur voor "foto in Team Inbox → automatisch AI-verwerkt" bestaat al (audio-transcriptie-LaunchAgent + directe Anthropic API-aanroep) en is één-op-één te hergebruiken met Claude Vision in plaats van Whisper. Het lastigste technische probleem — portiegrootte schatten uit een foto — is en blijft notoir onnauwkeurig (18-40% fout, ook bij marktleiders als MyFitnessPal en bij Claude zelf), dus elk ontwerp moet dit als een **schatting met bandbreedte**, niet als een harde waarde, behandelen. Belangrijkste architectuurbevinding: de Cockpit's bestaande `food_logs`-tabel is bewust **anxiety-free ontworpen** (geen calorieën, geen macro's, alleen maaltijdtype/context/eiwit-zichtbaar-vlag) — dit botst direct met Sanders wens om calorieën/eiwitten/koolhydraten/vetten te loggen, en is een expliciete beslissing die hij moet maken vóór bouw. Aanbeveling: **zelf bouwen op Claude Vision + USDA FoodData Central/Nevo**, niet een bestaande app integreren — bestaande apps' AI-foto-features zijn zelf niet nauwkeuriger, hebben geen bruikbare invoer-API meer (MyFitnessPal is dicht voor nieuwe developers), en zouden een tweede systeem naast de Cockpit introduceren in plaats van één samenhangend gezondheidsbeeld.

---

## 1. Bestaande processen die hierop aansluiten — Confidence: High

Bevestigd door code-inspectie:

- **Gewicht/slaap:** Fitbit Aria 2 + Google Health, periodieke Google Takeout-exports in de PKM (`PKM/My Life/Topics/gezondheid-data.md`). Slaapapneu-traject (Night Balance positietrainer) expliciet gekoppeld aan gewicht (elke 10% gewichtsverlies → ~26% AHI-reductie, `slaapapneu.md`).
- **Foto/audio-uit-Team-Inbox-precedent:** `~/transcribe_inbox.sh` + LaunchAgent `nl.gewoonsander.audio-transcribe.plist` met `WatchPaths` op `Team Inbox/Audio Captures/`. Whisper transcribeert, daarna roept het script **rechtstreeks de Anthropic API aan** (`ANTHROPIC_API_KEY` staat al in de plist's `EnvironmentVariables`, model `claude-haiku-4-5`) om te structureren en te routeren. Dit is de directe blauwdruk voor een foto-variant: zelfde patroon, Claude Vision i.p.v. Whisper.
- **Downloads-router precedent:** een tweede, recent gebouwde LaunchAgent (`nl.gewoonsander.downloads-router.plist`, `Deliverables/2026-06-30-downloads-team-inbox-router-design.md`) bevestigt dat "watcher + automatische routering naar Team Inbox-submap" een gevestigd patroon is in dit systeem, niet eenmalig.
- **Cockpit datacontract:** de Cockpit (`sqlite-extension/DATA-CONTRACT.md` §1, schema `04-module-habits-food.sql`) heeft al een `food_logs`-tabel + `v_food_log_calendar`-view gedefinieerd, bedoeld als extractor "derived from journal food sections" (verwacht een `## Essen`-sectie in journal-markdown).

## 2. Geschikte AI-modellen voor maaltijdherkenning uit foto's — Confidence: Medium-High

Claude (Sonnet), GPT-4o/GPT-5, en Gemini zijn de drie grote generalistische vision-modellen die in 2026-vergelijkend onderzoek zijn getest op bord-foto's. Daarnaast bestaan gespecialiseerde food-AI-vendors (Passio AI, met een dedicated Nutrition-AI SDK/REST-API en eigen voedingsdatabase). Omdat Sander al Anthropic/Claude gebruikt (zie `~/transcribe_inbox.sh`, spraakgestuurd via SuperWhisper) is Claude Vision de logische keuze — geen nieuwe vendor, geen nieuwe API-key-beheer. Confidence op "Claude is voldoende nauwkeurig" is **Medium-High**: het model presteert vergelijkbaar met zelfgerapporteerde voedingsdagboeken (de menselijke baseline), maar niet beter dan gespecialiseerde consumenten-apps op ruwe cijfers.

## 3. Wat is automatisch uit een foto te halen + realistische nauwkeurigheidsgrenzen — Confidence: High

Cross-source bevestigd over meerdere onafhankelijke 2026-bronnen:

| Aspect | Realistische nauwkeurigheid | Bron |
|---|---|---|
| Voedselidentificatie (wat is het) | 68-86% in real-world omstandigheden; 85-95% bij enkelvoudige, duidelijke items | Cureus, PMC comparative VLM-study |
| Portiegrootte (hoeveel is het) | Notoir onnauwkeurig: 18-40% MAPE afhankelijk van model/app; kan zakken tot 39% identificatie bij complexe gerechten | arXiv "Food Portion Estimation", PMC systematic review |
| Calorieën | Claude: 35,8% MAPE (energie); vergelijkbaar met traditionele zelfrapportage, dus geen verbetering t.o.v. wat Sander nu al zou kunnen doen door te schatten | medRxiv 2026 comparative-studie (Claude Sonnet vs GPT-5 vs Gemini) |
| Eiwitten/koolhydraten/vetten | Slechtst van alle velden: 42-110% fout, alle geteste modellen >60% fout specifiek op eiwit | Zelfde medRxiv-studie |
| Gemengde/complexe gerechten, sauzen, niet-westerse keukens | Systematisch slechter — MyFitnessPal's Meal Scan zakt naar 58-61% ID-rate op Oost-/Zuid-Aziatische gerechten (getraind op vooral westerse fotografie) | ai-food-tracker.com benchmark |

**Kernconclusie (High confidence, meerdere onafhankelijke bronnen eens):** portiegrootte is en blijft het grootste probleem, gevolgd door macronutriënten (met name eiwit). Elke implementatie moet dit als bandbreedte communiceren, nooit als exact getal — een "216 kcal-swing per maaltijd" (uit de MyFitnessPal-benchmark) is representatief voor wat je kunt verwachten, ook met Claude.

**Wat wél werkt om nauwkeurigheid te verbeteren (Medium confidence, academisch, nog niet in consumentenapps gemainstreamd):** een referentie-object in beeld (munt, bord van bekende afmeting, of — recenter onderzoek — het bord zelf als schaalreferentie) verbetert 3D-volumeschatting aanzienlijk t.o.v. een foto zonder referentie. Praktisch advies voor Sander: fotografeer altijd met het bord/bestek in beeld (niet ingezoomd op alleen het voedsel) — dit is een gratis nauwkeurigheidsverbetering zonder extra handeling.

## 4. Hoe onzekerheid afhandelen bij onvoldoende informatie — Confidence: Medium

Anthropic's eigen prompting-guidance (platform.claude.com) beveelt expliciet aan om Claude te vragen een `confidence`-veld en een verwijzing naar het brondeel van de afbeelding mee te geven — dit maakt onzekerheid zichtbaar in plaats van dat het model stilzwijgend invult. Dit is exact het patroon dat het eerdere bonnetjes-onderzoek (`2026-07-05-bonnetjesproces-gezinshuis-onderzoek.md`) ook aanbeveelt voor bunq-matching: **bij lage confidence of ontbrekende informatie, escaleer naar Sander met één gerichte vraag** (bijv. "ik zie rijst en kip, maar geen duidelijke portie-indicatie — hoeveel ongeveer, in handen of gram?") in plaats van een gok te loggen als hard cijfer. Dit is architectuurredenering + Anthropic's eigen documentatie, geen dubbel-onafhankelijk geverifieerd extern onderzoek specifiek voor voeding — vandaar Medium in plaats van High.

## 5. Bruikbare voedingsdatabases/-bronnen — Confidence: High

| Bron | Dekking | API? | Geschikt voor Sander? |
|---|---|---|---|
| **USDA FoodData Central** | 380.000+ voedingsmiddelen, overheids-gevalideerd | Ja — gratis publieke REST API, data.gov key vereist, geen limiet | Ja, als primaire bron — maar Amerikaans gericht (merken, porties) |
| **Open Food Facts** | 2,5M+ producten, crowd-sourced, internationaal | Ja — gratis publieke REST API | Ja, aanvullend — sterk voor verpakte NL/EU-producten met barcode |
| **Nevo (RIVM, NL)** | 2328 voedingsmiddelen, NL-specifiek, editie 2025/9.0 (nov 2025) | **Geen API gevonden** — alleen een downloadbaar databestand (XLSX/CSV) en de NEVO-online webtool | Nuttig als eenmalig geïmporteerd lookup-bestand, niet als live API |

**Aanbevolen combinatie:** USDA FoodData Central als primaire live-API (breed, gratis, onbeperkt), Open Food Facts als aanvulling voor merkproducten met barcode, Nevo als eenmalig geïmporteerde lokale tabel voor Nederlandse basisvoedingsmiddelen (aardappelen, NL-merken) waar USDA minder precies is. Dit is drie bronnen combineren, geen enkele volstaat alleen — cross-source bevestigd via directe bronraadpleging (fdc.nal.usda.gov, openfoodfacts.github.io, rivm.nl).

## 6. Beschikbare API's/koppelingen — Confidence: High

- USDA FoodData Central: publieke REST API, `api-guide` gedocumenteerd, data.gov-key.
- Open Food Facts: publieke REST API, uitgebreid gedocumenteerd (`openfoodfacts.github.io/openfoodfacts-server/api`).
- Anthropic Claude Vision: al in gebruik (zie vraag 2), directe API-aanroep vanuit shell/Python zoals `~/transcribe_inbox.sh` al doet.
- Passio AI Nutrition-AI: gespecialiseerde REST API + SDK, token-based pricing (~$2,50/miljoen tokens, ~20-30k tokens per foto-analyse → 1-10 cent per gebruiker) — een kant-en-klaar alternatief voor "foto → voedingswaarden" als Claude Vision + eigen database-matching onvoldoende precies blijkt, maar introduceert een nieuwe vendor/kosten-lijn.
- MyFitnessPal API: **gesloten voor nieuwe developers** sinds enige tijd (bevestigd via myfitnesspal.com/apps/api + myfitnesspalapi.com FAQ — twee onafhankelijke bronnen eens). Alleen via reverse-engineered community-libraries (juridisch grijs gebied) of via derde partijen als Terra/Validic te benaderen.
- Cronometer API: geen directe developer-API; toegang alleen via derde partijen (Terra, Validic) of een reverse-engineered mobiele API (`gocronometer` op GitHub) — niet officieel ondersteund.

## 7. Automatisering via n8n — Confidence: Medium-High

Geen dedicated n8n-community-node gevonden voor USDA FoodData Central, Open Food Facts, of Passio AI — consistent met het patroon uit de eerdere Jortt/bunq-onderzoeken: dit vraagt een **generieke HTTP Request-node** tegen elke API, geen kant-en-klare node-integratie. Voor Claude Vision zelf is dat sowieso de standaardaanpak (geen "Claude vision node" nodig — een HTTP-node met base64-afbeelding in de request-body volstaat, of Anthropic's eigen n8n/MCP-community-node indien beschikbaar op het moment van bouwen). Dit betekent iets meer bouwwerk dan bij een kant-en-klare node, maar geen blokkerende technische hindernis — hetzelfde niveau van moeite als de bunq/Jortt-koppelingen die al onderzocht en haalbaar bevonden zijn.

## 8. Koppeling aan gewicht/slaap — Confidence: High (architectuurredenering, aansluitend op bestaande data)

Gewicht en slaap staan al genoteerd per datum in Google Health/Fitbit-exports en de PKM. Een voedingslogboek dat **ook per datum** logt (wat `food_logs.log_date` en `v_food_log_calendar` al ondersteunen) sluit hier natuurlijk op aan: alle drie de databronnen delen `log_date`/`entry_date` als sleutel, dus trend-analyse ("dagen met minder zichtbaar eiwit → slechtere slaapkwaliteit die nacht?") is een simpele JOIN op datum, geen nieuwe koppel-infrastructuur nodig. Dit is dezelfde denkwijze die al in `gezondheid-data.md` staat (gewicht ↔ AHI-ernst is al expliciet gekwantificeerd) — voeding wordt gewoon een derde kolom in hetzelfde per-dag-gezondheidsbeeld.

## 9. Centrale opslag voor latere AI-analyse — Confidence: High (status-check hieronder)

De Cockpit's `mypka.db` is hiervoor het aangewezen mechanisme: markdown blijft canoniek (journal-invoer met een voedingssectie), de SQLite-mirror is de query-laag die een AI-coach later aanspreekt voor trends. Dit is precies hoe `health_metric`/`health_sleep` al werken (extern ingest-pad, niet uit markdown) en hoe `food_logs` is *bedoeld* te werken (wél uit markdown, via een journal-extractor). Zie status-check hieronder voor wat er al staat en wat ontbreekt.

## 10. Bestaande apps integreren vs. zelf bouwen — Confidence: High

**Bevindingen bestaande apps (2026-benchmarks, meerdere onafhankelijke bronnen eens over de bandbreedte):**

| App | AI-foto-ID-rate | Portie-MAPE | API voor eigen gebruik? |
|---|---|---|---|
| MyFitnessPal (Meal Scan) | 71,2% | ±18% | Nee — gesloten voor nieuwe developers |
| Lose It! (Snap It) | 68,7% | ±22% | Onbekend/beperkt, geen sterke bronvermelding gevonden |
| Cronometer | (geen directe photo-AI-benchmark gevonden — Cronometer's kracht is de handmatige database-diepte, niet foto-AI) | — | Nee — alleen via derde partijen (Terra/Validic) of reverse-engineering |

**Kernbevinding: geen enkele grote consumenten-app is nauwkeuriger dan wat Claude Vision zelf haalt**, en geen van de drie biedt een officiële, voor nieuwe individuele developers toegankelijke API om de foto-analyse-uitkomst automatisch in Sanders eigen systeem te krijgen. Zelfs áls je zo'n app zou gebruiken voor de herkenning, moet je de data er via scraping of een niet-ondersteunde derde partij weer uit trekken om ze te koppelen aan gewicht/slaap in de PKM — dat is meer wankele infrastructuur, niet minder, dan zelf bouwen op Claude Vision + USDA/Open Food Facts.

**Aanbeveling: zelf bouwen, niet integreren.** Argumenten voor: (a) geen tweede systeem/tweede login naast de Cockpit, (b) geen nauwkeurigheidsverlies t.o.v. bestaande apps, (c) Sander heeft de Claude-infrastructuur en het gewend-zijn aan directe API-aanroepen al, (d) volledige data-ownership sluit aan bij zijn expliciete voorkeur voor een toekomstbestendige architectuur op standaarden. Argument tegen (eerlijk genoemd): meer eigen onderhoud dan een kant-en-klare app, en de bouw-tijd zelf (voor Daedalus, niet voor Pax) is niet-nul.

---

## Status-check: bestaande `food_logs`/extractor-infrastructuur in de Cockpit

**Concreet geverifieerd door code-inspectie (`scripts/regen-mypka-db.py`, `sqlite-extension/schema/04-module-habits-food.sql`, `sqlite-extension/install-extensions.py`, `server/tracking.js`):**

- **De `food_logs`-tabel + `v_food_log_calendar`-view bestaan als DDL** in `sqlite-extension/schema/04-module-habits-food.sql`, en worden alleen leeg aangemaakt door `install-extensions.py --with-food` (of `--all`).
- **`food_logs` staat NIET in `OWNED_TABLES` van `scripts/regen-mypka-db.py`** — de kern-regen kent de tabel niet, vult 'm niet, en bouwt geen extractor die journal-`## Essen`-secties naar rijen omzet. **De extractor bestaat niet.** Dit bevestigt letterlijk wat Sander vermoedde.
- **Er is ook nog geen bronmateriaal om te extraheren:** een grep door de hele PKM op `## Essen`/`Frühstück`/`Mittag`/voedingslogboek levert **nul journal-entries** op. Er is dus vandaag geen enkele food-log-rij, leeg schema of niet.
- **`server/tracking.js` en `server/wellness.js` lezen al wél uit `food_logs`** via `optionalStmt()` (degradeert netjes naar lege array als de tabel ontbreekt/leeg is) — de UI-laag is klaar, wacht alleen op data.
- **Belangrijke architectuurbotsing (nieuwe bevinding, niet in de oorspronkelijke briefing genoemd):** de bestaande `food_logs`-schema is expliciet ontworpen als **"anxiety-free nutrition"** — een hard-coded regel in `server/tracking.js`: *"NO numbers, NO calories, NO scores. The food shape carries meal type, context tags, a visible-protein flag, a photo path, and the free-text note ONLY."* Dit komt uit de gedeelde Cockpit-scaffold (ported "from the reference instance", niet iets wat Sander zelf koos), en staat **haaks** op wat Sander nu vraagt: calorieën, eiwitten, koolhydraten, vetten. Dit is geen technisch obstakel maar een **expliciete productbeslissing die eerst gemaakt moet worden**: houdt Sander de anxiety-free-filosofie aan (dan logt het systeem bewust géén cijfers, alleen kwalitatieve signalen), of breidt hij het schema uit met numerieke velden? Beide zijn legitiem, maar de huidige tabel kan zijn wens niet vervullen zonder een bewuste, additive schema-uitbreiding.
- Vergelijkbaar precedent: `health_mood` is wél in de query-laag verwacht maar ontbreekt in de kern-regen — hetzelfde soort "leesklare UI, ontbrekende ingest" gat als bij food_logs, bevestigd als bekend, niet-opgelost coördinatiepunt in `DATA-CONTRACT.md` §6.

---

## Aanbevolen end-to-end proces

1. **Foto maken** — Sander fotografeert het bord (mét bestek/referentie-object in beeld voor betere portieschatting, zie vraag 3) en plaatst 'm in een nieuwe `Team Inbox/Voeding/`-submap (of hergebruikt een bestaande routing-conventie zoals de Downloads-router al doet voor Screenshots/Documents).
2. **Watcher pakt 'm op** — een nieuwe LaunchAgent (kopie van `nl.gewoonsander.audio-transcribe.plist`'s patroon: `WatchPaths` op de nieuwe map, zelfde `ANTHROPIC_API_KEY`-environment) triggert een script bij een nieuw bestand.
3. **Claude Vision-aanroep** — het script stuurt de foto naar Claude met een structured-output-prompt: `{gerecht, ingrediënten[], geschatte_portie, portie_eenheid, confidence, onzekere_velden[]}`. Prompt vraagt expliciet om confidence per veld (zie vraag 4).
4. **Database-matching** — voor elk herkend ingrediënt een lookup in USDA FoodData Central (primair) / Open Food Facts (barcode/merk) / Nevo (lokaal geïmporteerd NL-bestand) om voedingswaarden per 100g op te halen, vermenigvuldigd met de geschatte portie.
5. **Onzekerheid → escalatie, niet gok** — bij lage confidence of ontbrekende portie-info: één gerichte vraag naar Sander (bijv. via bericht/notificatie) in plaats van een cijfer blind te loggen.
6. **Opslaan** — resultaat gaat naar een voedingssectie in de dag-journal-entry (`## Eten` o.i.d., markdown blijft canoniek) mét de brondata (bedrag/waarden + confidence) in frontmatter, plus de foto als media-embed (zelfde conventie als `journal_media`).
7. **Regen-extractor bouwen (het ontbrekende stuk)** — `scripts/regen-mypka-db.py` uitbreiden met een echte food-log-extractor die de journal-voedingssectie leest en `food_logs` vult (of het schema eerst uitbreiden met numerieke velden, zie de architectuurbotsing hierboven — **beslissing bij Sander vóór bouw**).
8. **Trend-analyse & coaching** — met voeding, gewicht en slaap allemaal per `log_date`/`entry_date` in `mypka.db`, kan een toekomstige coaching-laag (Claude, met SQL-toegang tot de read-only mirror) trends over alle drie combineren zonder nieuwe koppel-infrastructuur.

---

## Hoe dit aansluit op bestaande gewicht/slaap-tracking

Eén samenhangend beeld, geen los systeem: alle drie de databronnen (Fitbit-gewicht, slaap/AHI, voeding) landen uiteindelijk in dezelfde `mypka.db`, gekoppeld op datum. De slaapapneu-topic linkt al expliciet gewicht ↔ AHI; voeding wordt de derde as in exact hetzelfde per-dag-frame. Geen aparte voedingsapp-login, geen los dashboard — de Cockpit is en blijft het ene overzicht.

---

## Anti-patterns om te vermijden

- **Portiegrootte als exact getal presenteren.** Elk cijfer moet een bandbreedte of confidence-indicator dragen — anders ontstaat schijnzekerheid over data die 18-40% kan afwijken.
- **Stil een gok loggen bij een onduidelijke foto.** Zelfde les als het bonnetjes-onderzoek: bij twijfel escaleren, nooit automatisch invullen.
- **Een bestaande app (MyFitnessPal/Cronometer) kiezen puur voor het "kant-en-klare" gevoel, zonder te checken of de data er weer uit te halen is.** Zonder officiële API zit de data daarna vast in een tweede systeem.
- **De "anxiety-free" architectuurbeslissing negeren en gewoon cijfers in het bestaande schema proppen.** Dat is een bewuste productkeuze van iemand anders (de scaffold-ontwerper) die eerst expliciet heroverwogen moet worden, niet stilzwijgend overschreven.
- **Eén universeel voedingsdatabase-bron gebruiken.** USDA alleen mist Nederlandse basisproducten; Nevo alleen heeft geen API; Open Food Facts alleen mist ongelabelde/huisgemaakte gerechten. Combineren is nodig, niet optioneel.
- **De extractor bouwen vóórdat er journal-brondata bestaat.** Er is vandaag nul voedingsdata in de PKM — eerst het foto→journal-pad bouwen en een paar weken vullen, dán de regen-extractor verfijnen op echte voorbeelden.

---

## Aanbevolen volgende stappen (voor Daedalus, bij eventuele implementatie — Pax bouwt niets)

1. **Productbeslissing bij Sander:** anxiety-free-filosofie behouden (kwalitatief loggen) of schema uitbreiden met calorieën/macro's (kwantitatief)? Dit bepaalt de rest van de bouw.
2. Kopieer het `transcribe_inbox.sh`-patroon naar een foto-variant (nieuwe LaunchAgent, `Team Inbox/Voeding/` als watch-map).
3. Ontwerp de Claude Vision structured-output-prompt met een `confidence`-veld per geschat element; test tegen 10-15 echte maaltijdfoto's voor je de matching-logica bouwt (zelfde advies als in het bonnetjes-onderzoek).
4. Registreer een gratis USDA FoodData Central data.gov-key; verken Open Food Facts' API zonder key-vereiste; download het Nevo-bestand (XLSX/CSV) voor lokale NL-lookup.
5. Bouw de journal-voedingssectie-conventie (frontmatter/body-vorm) vast, vóór je de regen-extractor bouwt.
6. Breid `scripts/regen-mypka-db.py` uit met een echte `food_logs`-extractor (of pas eerst het schema aan per stap 1) — dit is het daadwerkelijk ontbrekende stuk.
7. Richt de escalatie-flow in (bericht naar Sander bij lage confidence) vóór de pipeline volledig automatisch gaat.

---

## Limitations / onzekerheden

- Geen tweede onafhankelijke bron gevonden voor Lose It!'s exacte API-beleid voor individuele developers — alleen impliciet via benchmarksites, niet via Lose It!'s eigen developer-portaal geverifieerd.
- Nevo's afwezigheid van een publieke API is gebaseerd op het ontbreken van vermeldingen op RIVM's eigen site — afwezigheid van bewijs is geen sluitend bewijs van afwezigheid; navragen bij `nevo@rivm.nl` is een optie vóór bouw.
- De exacte Claude Vision-nauwkeurigheidscijfers (35,8% MAPE energie, 37,3% gewicht) komen uit één specifieke 2026 medRxiv-vergelijkingsstudie; de bredere onderzoekslijn (Cureus, PMC) bevestigt de orde van grootte maar niet de exacte percentages — behandel de precieze getallen als indicatief, niet als gegarandeerd reproduceerbaar op Sanders eigen foto's.
- Geen n8n-node-marktplaats direct doorzocht op een recent uitgebrachte Anthropic-specifieke of nutrition-specifieke node — de "geen node gevonden"-conclusie is gebaseerd op websearch, niet op het n8n-nodesregister zelf raadplegen; verifieer bij daadwerkelijke bouw.
- Passio AI-pricing is geschat op basis van hun eigen blogpost, niet onafhankelijk geverifieerd via een tweede bron.

---

## Methodology

- Code-inspectie: `Expansions/mypka-cockpit/scripts/regen-mypka-db.py`, `sqlite-extension/schema/04-module-habits-food.sql`, `sqlite-extension/install-extensions.py`, `sqlite-extension/DATA-CONTRACT.md`, `server/tracking.js`, `server/wellness.js`.
- PKM-inspectie: `PKM/My Life/Topics/gezondheid-data.md`, `slaapapneu.md`, `~/transcribe_inbox.sh`, LaunchAgent-plists (`nl.gewoonsander.audio-transcribe.plist`, `nl.gewoonsander.downloads-router.plist`), grep op journal-food-secties (nul hits).
- Voortgebouwd op eerdere onderzoeksbriefs voor stijl/architectuurpatroon: `2026-06-28-jortt-api-research.md`, `2026-07-05-bonnetjesproces-gezinshuis-onderzoek.md` (niet dubbel onderzocht, wel als precedent gebruikt voor n8n-node-beschikbaarheid en escalatie-bij-onzekerheid-patroon).
- Web-onderzoek: Claude Vision/GPT/Gemini foto-voeding-nauwkeurigheidsstudies (Cureus, PMC, medRxiv 2026), USDA FoodData Central / Open Food Facts / Nevo developer-documentatie, MyFitnessPal/Cronometer/Lose It! API-beleid en AI-foto-benchmarks, portiegrootte-referentie-object-onderzoek (arXiv, Cambridge Core), Anthropic's eigen prompting-documentatie voor confidence-handling.

---

## Bronnen

- [FoodData Central API Guide — USDA](https://fdc.nal.usda.gov/api-guide/)
- [Open Food Facts API documentation](https://openfoodfacts.github.io/openfoodfacts-server/api/)
- [Dutch Food Composition Database (NEVO) — RIVM](https://www.rivm.nl/en/dutch-food-composition-database)
- [Download NEVO dataset — RIVM](https://www.rivm.nl/en/dutch-food-composition-database/use-of-nevo-online/request-dataset)
- [MyFitnessPal Developer Portal](https://www.myfitnesspal.com/apps/api/version)
- [MyFitnessPal API — FAQ (myfitnesspalapi.com)](https://myfitnesspalapi.com/faq/)
- [Cronometer API Integration — Terra](https://tryterra.co/integrations/cronometer)
- [Cronometer forum — API voor derde partijen](https://forums.cronometer.com/discussion/3809/does-cronometer-offer-an-api-for-third-party-applications-to-retreive-user-data-from)
- [Passio AI — Nutrition-AI Platform](https://www.passio.ai/)
- [Passio AI — Cost Breakdown](https://www.passio.ai/cost-breakdown)
- [MyFitnessPal AI Review 2026: Meal Scan Accuracy — ai-food-tracker.com](https://ai-food-tracker.com/reviews/myfitnesspal/)
- [Lose It! Snap It AI Review 2026 — ai-food-tracker.com](https://ai-food-tracker.com/reviews/lose-it/)
- [Validity and Reliability of Photo-Based AI Estimates of Meal Calories and Macronutrients — Cureus](https://www.cureus.com/posters/3217-validity-and-reliability-of-photo-based-ai-estimates-of-meal-calories-and-macronutrients)
- [A comparative study of vision–language models for food ingredient recognition and nutrient estimation — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13092701/)
- [Performance Evaluation of 3 Large Language Models for Nutritional Content Estimation from Food Images — PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12513282/)
- [Full article: AI-based digital image dietary assessment methods compared to humans and ground truth — Taylor & Francis](https://www.tandfonline.com/doi/full/10.1080/07853890.2023.2273497)
- [Food Portion Estimation via 3D Object Scaling — arXiv](https://arxiv.org/abs/2404.12257)
- [Image-based food portion size estimation using a smartphone without a fiducial marker — Cambridge Core](https://www.cambridge.org/core/journals/public-health-nutrition/article/imagebased-food-portion-size-estimation-using-a-smartphone-without-a-fiducial-marker/47ED461DDE607FE0C7E6D70168E80BFA)
- [Vision — Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/vision)
- [Prompting best practices — Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

---
date: 2026-08-11
author: Daedalus, Atlas, Penn, Bezalel
type: design-doc
status: implemented
subject: Compleet voedingslogboek via foto, spraak, sessiecheck en Cockpit
sop: SOP-development-workflow (Fase 1 — Brainstorm/Design)
builds_on:
  - Deliverables/2026-07-05-ai-voedingslogboek-onderzoek.md
  - Deliverables/2026-07-07-voedseldagboek-foto-tracking-design.md
  - Deliverables/2026-07-07-voedseldagboek-foto-tracking-plan.md
  - PKM/My Life/Goals/gewicht-aanpakken.md
  - Team Knowledge/Workstreams/WS-001-daily-journaling.md
linked_guidelines:
  - GL-002-frontmatter-conventions
  - GL-003-design-system
  - GL-013-interactie-enkelvoudige-keuzes
  - GL-016-beslis-en-waarschuwingsblokken
---

# Design: Compleet voedingslogboek in de myPKA Cockpit

## 1. Besluit en doel

Sander kiest expliciet voor zichtbare calorieën en macro's per maaltijd én als dagtotaal. Het systeem ondersteunt [[gewicht-aanpakken]] door alles wat Sander eet onder exact één van vier categorieën vast te leggen:

- `breakfast` — ontbijt
- `lunch` — lunch
- `dinner` — avondeten
- `snack` — tussendoor

Invoer komt uit foto's, gesproken invoer of achteraf herinnerde tekst. Elke registratie komt in één canoniek dagelijks markdownlogboek. De Cockpit-database is een volledig regenereerbare mirror en toont foto's, maaltijdregels, schattingsbandbreedtes, dagtotalen en volledigheidsstatus.

Calorieën en macro's blijven **schattingen met minimum, maximum en confidence**. Het dashboard mag voor optellen een middenwaarde tonen, maar moet de bandbreedte en onzekerheid toegankelijk houden. Geen medisch advies, geen goed/fout-kleuring en geen strafmechaniek.

## 2. Functionele gebruikersflow

### 2.1 Foto op iPhone

1. Sander maakt een foto met bord, bestek en waar nuttig verpakking/etiket in beeld.
2. De bestaande iPhone-deelroute laat de ruwe foto landen in `Team Inbox/Documents/`.
3. Daedalus' watcher classificeert de afbeelding als eten of niet-eten.
4. Bij eten analyseert Vision: zichtbare voedingsmiddelen, geschatte porties, kcal, eiwit, koolhydraten en vetten, steeds als bandbreedte + confidence.
5. De maaltijdcategorie wordt afgeleid uit expliciete tekst/metadata en anders uit tijdstip. Bij onvoldoende zekerheid blijft de invoer in een review-wachtrij; het systeem verzint geen categorie.
6. Penn schrijft of appendt de registratie in het dagelijkse voedingslogboek en verplaatst de foto naar `PKM/Images/YYYY/MM/`.
7. Atlas regenereert de mirror idempotent; Bezalels dashboard toont de nieuwe maaltijd.

### 2.2 Gesproken invoer op iPhone

1. Sander spreekt bijvoorbeeld in: “Lunch, twee boterhammen met kaas en een glas melk.”
2. De bestaande audio-shortcut landt de opname in `Team Inbox/Audio Captures/`.
3. Transcriptie levert tekst plus opnametijd.
4. Penn herkent voedingsinvoer, normaliseert die naar dezelfde vier categorieën en maakt dezelfde maaltijdstructuur als bij een foto.
5. Bij onvoldoende portie-informatie komt één gerichte vraag, bijvoorbeeld hoeveel boterhammen of welk formaat glas. Wanneer geen antwoord komt, blijft de registratie bestaan met lagere confidence en een ruimere bandbreedte.

### 2.3 Directe tekstinvoer

Tekst in de chat of Team Inbox volgt exact dezelfde normalisatie. Foto, audio en tekst zijn alleen verschillende bronnen; na normalisatie bestaat er één maaltijdmodel.

### 2.4 Close-session voedselcheck

De bestaande gecombineerde close-session-check (journaal + dagelijkse gewoontes) krijgt een vaste voedselvraag:

> Heb je vandaag alles wat je hebt gegeten gelogd?

- **J — Ja:** geen inhoudelijke vervolgvragen. Het systeem registreert alleen intern `day_complete: true`, de bevestigingstijd en bron `close-session`.
- **N — Nee:** Penn vraagt vervolgens één open herinneringsvraag: “Wat kun je je nog herinneren van wat je vandaag hebt gegeten of gedronken?” Het antwoord wordt opgesplitst in ontbrekende maaltijden. Alleen bij werkelijk blokkerende ambiguïteit volgt per maaltijd maximaal één gerichte vraag.
- Na aanvulling vraagt Penn opnieuw of de dag nu compleet is. `day_complete` wordt pas `true` na bevestiging; anders blijft de status `false` of `unknown`.

Deze check loopt bij elke echte close-session. Een eerdere bevestiging diezelfde dag wordt niet stilzwijgend als eeuwig geldig gezien: eten kan na een eerdere sessie zijn toegevoegd. De nieuwste bevestiging is daarom leidend en zichtbaar als `confirmed_at`.

## 3. Drie architectuuropties

### Aanpak A — Eén dagelijks voedingslogboek als canonieke bron (aanbevolen)

Per dag één bestand: `PKM/Journal/YYYY/MM/YYYY-MM-DD-voedingslogboek.md`. Nieuwe maaltijden en correcties worden append-only toegevoegd. Dagstatus staat in een afsluitende auditsectie; de laatste auditregel is leidend. Foto's leven canoniek in `PKM/Images/YYYY/MM/` en worden gewikilinkt.

**Voordelen**

- Eén SSOT per dag en een natuurlijk dagtotaal.
- Alle invoerkanalen convergeren naar dezelfde vorm.
- De close-session-check kan volledigheid ondubbelzinnig vastleggen.
- Eenvoudige, deterministische extractor; database blijft volledig regenereerbaar.
- Bestaande losse voedingsjournaals kunnen zonder inhoudsverlies worden gemigreerd.

**Nadelen**

- Meerdere append-acties op één dagbestand vragen file-locking/atomaire writes.
- Het schema in het markdownlichaam moet strikt worden vastgelegd.

### Aanpak B — Eén markdownbestand per maaltijd

Elke maaltijd wordt een los journaalbestand. Een apart dagelijks auditbestand houdt volledigheid en dagtotalen bij.

**Voordelen**

- Sterke isolatie en weinig schrijfconflicten.
- Een mislukte analyse raakt hooguit één maaltijd.

**Nadelen**

- Veel kleine bestanden.
- Dagstatus woont in een tweede SSOT-achtig bestand.
- Dagtotalen en correcties zijn omslachtiger.

### Aanpak C — SQLite als primaire voedingsbron

Foto/audio schrijft direct naar `food_logs`; markdown wordt achteraf geëxporteerd.

**Voordelen**

- Directe dashboardupdates en eenvoudige aggregaties.

**Nadelen**

- Schendt de myPKA-regel dat markdown canoniek is.
- Meer risico bij iCloud-synchronisatie en gelijktijdig gebruik op twee Macs.
- Minder menselijk leesbaar en slechter herstelbaar.

**Advies:** aanpak A. Deze route sluit aan op SSOT, het dagelijkse controlemoment en de bestaande Cockpit-mirror zonder een tweede waarheid te creëren.

## 4. Canoniek markdowncontract

Voorbeeldvorm; exacte parserdetails worden in Fase 2 vastgezet:

```yaml
---
date: 2026-08-11
type: food-log
key_element: gezondheid
goal: gewicht-aanpakken
day_complete: true
confirmed_at: 2026-08-11T21:42:00+02:00
---
```

```markdown
# Voedingslogboek — 11 augustus 2026

## Maaltijden

### 08:15 — Ontbijt
- item: Twee volkoren boterhammen met kaas
- source: audio
- kcal: 430–540
- protein_g: 22–29
- carbs_g: 42–55
- fat_g: 17–25
- confidence: medium
- photo: 

### 12:40 — Lunch
- item: Banaan en kleine sinaasappel
- source: photo
- kcal: 95–135
- protein_g: 1.0–1.8
- carbs_g: 24–34
- fat_g: 0.2–0.6
- confidence: high
- photo: ![[Images/2026/08/2026-08-11-voeding-banaan-sinaasappel.jpeg]]

## Completion audit
- 2026-08-11T21:42:00+02:00 — complete: yes — source: close-session
```

De implementatie gebruikt stabiele machinevelden, maar toont Nederlandse labels. Correcties verwijderen nooit een eerdere regel; ze voegen een gecorrigeerde registratie toe met een verwijzing naar de vervangen entry. De extractor neemt de nieuwste geldige versie.

## 5. Afgeleid datamodel

Atlas breidt het bestaande lege `food_logs`-schema additief uit. Er komt geen tweede voedingstabel. Minimaal vereist:

- stabiele `entry_id` voor idempotentie en correcties;
- `logged_at`, `log_date`, `meal_type`;
- `description`, `ingredients_json`;
- `kcal_min`, `kcal_max`;
- `protein_g_min/max`, `carbs_g_min/max`, `fat_g_min/max`;
- `confidence`, `source_type`, `source_path`;
- `photo_path`, `photo_count`;
- `supersedes_entry_id` en `is_active`;
- dagstatus via een afzonderlijke afgeleide `food_log_days`-tabel of view met `day_complete` en `confirmed_at`.

De regen-extractor wist en herbouwt uitsluitend de tabellen/views die hij bezit. Unieke bron-ID's voorkomen dubbelen. Dagtotalen sommeren minima, maxima en middenwaarden van alleen actieve regels.

## 6. Dashboardontwerp

De bestaande sectie `Tracking > Meals` wordt uitgebreid in plaats van een nieuwe concurrerende module te maken.

### Vandaag

- vier vaste rijen/kaarten: Ontbijt, Lunch, Avondeten, Tussendoor;
- meerdere tussendoortjes zijn toegestaan;
- foto, tijd, beschrijving, kcal-range en macro-ranges per registratie;
- dagtotaal met kcal en eiwit/koolhydraten/vet;
- status `Compleet bevestigd om …`, `Nog niet bevestigd` of `Onvolledig`;
- onzekerheid als tekst/icoon, nooit rood-groen als waardeoordeel.

### Geschiedenis en trends

- dag-voor-dag galerie en tabel;
- filters op datum en maaltijdcategorie;
- gemiddelde calorie-inname en macro's over 7/30 dagen;
- vergelijking met gewicht/slaap pas als beschrijvende correlatie, nooit als causale of medische conclusie;
- foto opent de canonieke journaalregistratie.

Alle API's blijven read-only vanuit de browser. Mutaties lopen via de capture-/markdownpipeline.

## 7. Betrouwbaarheid en randgevallen

- Eén foto kan meerdere eetmomenten bevatten: standaard één registratie; splitsen alleen als tekst/tijd dit onderbouwt.
- Meerdere foto's van dezelfde maaltijd worden via tijdvenster + visuele/tekstuele overeenkomst als één invoer behandeld of voor review gemarkeerd.
- Dranken met calorieën tellen mee; water, zwarte koffie en ongezoete thee mogen als nulregistratie worden opgeslagen wanneer Sander dat noemt, maar zijn niet verplicht voor volledigheid.
- Een gemiste foto blokkeert tekst- of spraakregistratie niet.
- Lage confidence blokkeert opslag niet; ze blokkeert alleen een schijnexact getal.
- API-uitval zet items in een retry-wachtrij met zichtbare foutstatus en idempotente herverwerking.
- De watcher moet per machine expliciet worden geïnstalleerd. De Mac mini is de primaire always-on verwerker; de MacBook Air mag niet gelijktijdig hetzelfde iCloud-bestand verwerken zonder gedeelde claim/lock.
- Credentials blijven buiten de repository in een afgeschermde env- of Keychain-locatie.

## 8. Procedures en permanente teamafspraken

Fase 3 levert naast code ook deze structurele documentatie:

1. Nieuw Workstream: `WS-006-voeding-vastleggen-en-controleren.md` voor foto/audio/tekst → review → journal → mirror → dashboard.
2. Nieuwe SOP: `SOP-017-verwerk-voedingsregistratie.md` voor Penn/Daedalus, inclusief categorie- en confidence-regels.
3. Uitbreiding van het root-close-sessionprotocol met de verplichte voedselcheck, gecombineerd met de bestaande journaal- en habitcheck.
4. Update van `WS-001-daily-journaling.md` met het canonical food-logcontract.
5. Schema- en API-documentatie binnen de Cockpit-code.

De nummers worden vóór implementatie gecontroleerd tegen de actuele indexen; bij botsing wordt het eerstvolgende vrije nummer gebruikt.

## 9. Specialistverdeling

- **Daedalus:** betrouwbare capture-wire voor foto en audio, retry, locking, classificatie en veilige secrets.
- **Penn:** canonical markdownvorm, maaltijdnormalisatie, recall-dialoog en close-sessioncheck.
- **Atlas:** schema-uitbreiding, migratie van bestaande voorbeelden, extractor en regen-verificatie.
- **Bezalel:** Tracking/Meals UI, dagtotalen, filters, completeness-status en toegankelijke onzekerheidsweergave.
- **Argus:** securityreview van secrets, bestandsingest en lokale API.
- **Nemesis:** eindgate op datanauwkeurigheid, responsive UI en WCAG 2.2 AA.
- **Hermes:** protocolwijzigingen, SSOT-controle en synthese.

## 10. Acceptatiecriteria

Het systeem is pas klaar wanneer alle onderstaande scenario's vers zijn geverifieerd:

1. Een echte iPhone-maaltijdfoto verschijnt eenmaal in het juiste dagelijkse logboek en dashboardcategorie.
2. Een echte gesproken maaltijd verschijnt via hetzelfde model.
3. Een tekstuele achteraf-aanvulling verschijnt zonder foto.
4. Close-session `J` geeft geen inhoudelijke vervolgvraag en zet de dagstatus op compleet.
5. Close-session `N` start recall, schrijft ontbrekende registraties en vraagt daarna opnieuw om bevestiging.
6. Het dashboard toont correcte sommen van minimum, maximum en middenwaarde.
7. Een correctie overschrijft geen geschiedenis en telt de vervangen invoer niet dubbel.
8. Een mirror-regen vanaf alleen markdown reproduceert dezelfde maaltijdregels en dagtotalen.
9. Dezelfde foto of trigger tweemaal verwerken maakt geen duplicaat.
10. API-uitval bewaart de invoer voor retry zonder gegevensverlies.
11. De workflow werkt vanaf de Mac mini en veroorzaakt geen dubbele verwerking via iCloud/MacBook Air.
12. Argus en Nemesis geven hun vereiste sign-off.

## 11. Buiten scope van de eerste oplevering

- automatisch persoonlijk calorie- of macrodoel voorschrijven;
- medische conclusies trekken uit voeding, slaap of gewicht;
- barcode-scanning als verplicht invoerkanaal;
- automatische coaching, waarschuwingen of schuld-inducerende streaks;
- koppeling met MyFitnessPal of Cronometer;
- voedingsmiddelen leren herkennen op basis van gezichten of andere biometrie.

Deze functies kunnen later worden overwogen, maar zijn niet nodig om Sanders gevraagde complete logboek betrouwbaar te leveren.

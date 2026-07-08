---
agent_id: hermes
session_id: adc-posters-darren-crm-darteritus-cursus-review
timestamp: 2026-07-08T20:13:00Z
type: close-session
linked_sops: []
linked_workstreams: [WS-001-daily-journaling]
linked_guidelines: [GL-013-interactie-enkelvoudige-keuzes]
---

# ADC-posters afgerond en opgeschoond, Darren van Es dual-role in CRM, volledige Darteritus-cursusreview met Darren

## Context

Lange sessie die begon met het afronden van de ADC Regio Oost Pub Qualifier-posters (masthead-stijl, embleem-integratie), uitgroeide tot een drieledige vergelijking van poster-workflows (Charta/Canva/Gemini), en vervolgens overging in een heel andere werkstroom: een nieuw zakelijk contact (Darren van Es) vastleggen in het CRM, gevolgd door een module-voor-module review van de nieuwe DartsCoaching.nl-cursus "Herstel van Darteritus" die Darren aan het lanceren is.

## What we did

### ADC Pub Qualifier posters
- **Logo-contrastfix (Charta):** Café Kafé- en Rijnvogels-logo's waren onleesbaar tegen de zwarte achtergrond op de v2-masthead-posters; Charta voegde witte badges toe. Zelf visueel geverifieerd op alle betrokken bestanden.
- **Drieledige workflow-vergelijking:** Sander vond zowel de Charta-HTML-route als een directe Canva-AI-generatie ("barrer") ondermaats. Een losse Gemini-prompt met het echte, gedownloade ADC/Winmau-embleem als referentiebeeld won overtuigend — vastgelegd als [[feedback_poster-workflow-gemini-canva]].
- **Canva multi-pagina-poster (4 kroegen):** Sander bouwde zelf een Canva-document met het Gemini-beeld als basis; ik hielp met tekst/datum-edits via de Canva editing-transaction-tools (met expliciete preview+akkoord vóór elke commit, en een keer een transactie geannuleerd omdat die stale was t.o.v. Sanders eigen handmatige edits).
- **Dart Atlas-verificatie ontdekte drie datumfouten** in de oorspronkelijk aangenomen data (nooit eerder tegen de live bron gecheckt): Dubbel10 27→20 juli, Café Kafé 20→19 juli, Rijnvogels miste 27 juli en had een niet-bestaande 19 juli (moest 5 datums zijn, niet 4). Vastgelegd in [[project_adc-pub-qualifier-posters-2026]].
- **Cleanup:** op Sanders expliciete verzoek is de volledige oude Charta-output (HTML + PNG + README) verwijderd uit `Deliverables/2026-07-07-adc-pub-qualifier-posters/`; alleen de `assets/`-submap (logo's, embleem) bleef staan als herbruikbaar bronmateriaal.

### Darren van Es — CRM
- Bestaand `darren.md` (foutief als "coaching-cliënt" geregistreerd) bleek dezelfde persoon als de nieuw geïntroduceerde freelancer/vrijwilliger voor DartsCoaching.nl — Sander bevestigde: beide rollen kloppen nog steeds, geen vervanging.
- Penn werkte het bestand stapsgewijs bij (achternaam, e-mail, Dart Buddies Huddle-adminrol, cursusnaam "Herstel van Darteritus", telefoonnummer +34 644 71 79 98) en hernoemde naar `darren-van-es.md` per GL-001-naamcollision-regel.
- Google Contacts-sync voorbereid maar gepauzeerd — Sander dismissete de labelvraag, ging over op het echte werk (cursusreview) voordat de sync werd afgerond. **Open thread.**

### Darteritus-cursusreview (DartsCoaching.nl)
- Darren's WhatsApp-update gecheckt: landingspagina en Basis-betaalpagina publiek bekeken en goedgekeurd.
- Alle 7 modules (transcripties, reflectievragen, samenvattingen) stuk voor stuk doorgenomen en opgeslagen in `Deliverables/2026-07-08-darteritus-cursus-review/`, met een doorlopend, herhaald bijgewerkt feedback-overzicht (18 punten, zie dat bestand voor volledige details).
- Belangrijkste bevindingen: reflectievragen missen een introzin behalve bij Module 1; werkwoordstijd-fout ("deel ik" i.p.v. "deelde ik") structureel in alle 6 samenvattingen; cursusnavigatie breekt na Module 4 (geen doorverwijzing naar Module 6, en daarmee mogelijk ook niet naar de sterke afsluitende Module 7); twee vertrouwensladder-afbeeldingen zijn redundant maar niet inhoudelijk tegenstrijdig; stoplichtsysteem/terugvalprotocol bleken bij nader inzien wél goed gedekt (deels via video, deels via download) — oorspronkelijke zorg dus onterecht.
- Concept-reactie voor Darren opgesteld, twee correctierondes ondergaan (foutieve boekstoeschrijving aan Darren i.p.v. Joppe; "vast te pakken" herdoopt naar "Actiepunten"; naamgeving-consistentie omhoog verplaatst naar de urgente sectie) en door Sander zelf verstuurd.
- Zijdelings: Sanders eigen boek "Darttactiek van Beginner tot Professional" bleek al gedocumenteerd te staan ([[2025-09-01-boek-darttactiek-van-beginner-tot-professional]]) en is nu ook als cross-reference-suggestie in de Darren-reactie verwerkt.

### Overig
- Downloads-router bug gemeld (bestand kwam in Team Inbox terecht maar werd niet hernoemd) → los taakje aangemaakt (`Expansions/downloads-router/route_downloads.sh` als vermoedelijke locatie).
- Darteritus zelftest-lead-magnet geanalyseerd: momenteel volledig handmatig (PDF, zelf optellen, zelf mailen bij hoge score) — verbeteridee (digitalisering + automatische ActiveCampaign-score-branching, ingeschat op 1-2 werkdagen) vastgelegd in [[project_darteritus-zelftest-flow-verbetering]] en meegenomen in de Darren-reactie.

## Decisions made

- **Question:** Charta-HTML, directe Canva-AI, of een losse Gemini-prompt voor dramatische/gebrande posters?
  **Decision:** Gemini-prompt eerst (met een echt referentiebeeld indien beschikbaar), dan handmatig importeren en verder bewerken in Canva. Vastgelegd als blijvende workflow-voorkeur.
- **Question:** Darren als coaching-cliënt óf als freelancer/vrijwilliger registreren?
  **Decision:** Beide rollen tegelijk, geen vervanging — cliëntgeschiedenis blijft behouden naast de nieuwe samenwerkingsrol.
- **Question:** Oude Charta-posterbestanden bewaren voor het geval de Canva-versie niet bevalt?
  **Decision:** Nee, volledig verwijderd op Sanders expliciete verzoek — de Canva-versie is nu de enige bron van waarheid.

## Insights

- Drie keer achter elkaar bleek een eerder aangenomen (nooit tegen Dart Atlas geverifieerde) datum fout te zijn bij het overzetten van de posters naar nieuwe kroegen — een sterk signaal dat live-brongegevens altijd verdienen geverifieerd te worden in plaats van eerder vastgelegde poster-data te kopiëren.
- Bij het module-voor-module doorlopen van de cursus bleken twee eerdere zorgen (ontbrekende afsluiting, stoplichtsysteem/terugvalprotocol zonder uitleg) bij nader inzien onterecht — de content bestond wél, alleen niet op de plek waar Sander hem eerst zocht. Goed voorbeeld van waarom "ik kan dit niet verifiëren zonder toegang" eerlijker is dan aannemen dat een eerdere zorg klopt.
- Sander gaf expliciete, generaliseerbare feedback over interactiestijl tijdens een groeiende puntenlijst: altijd de VOLLEDIGE lijst herhalen bij iedere aanvulling, niet alleen de nieuwste toevoeging — vastgelegd als [[feedback_volledige-lijst-herhalen]].

## Realignments

- Sander corrigeerde een concept-tekst voor Darren tweemaal: (1) "jouw boek" moest "Joppe's boek" zijn (de brief is geadresseerd aan Darren, die het boek niet zelf geschreven heeft), (2) de naamgeving-consistentie hoort niet bij "voor later, geen haast" maar bij de urgente actiepunten.
- Tijdens het journaal-gesprek noemde Sander "mijn eigen achtergrond" in relatie tot Indisch/Indonesisch eten, terwijl zijn gedocumenteerde stamboom (`mijn-verhaal.md`) volledig Nederlands/Gronings is — Penn signaleerde dit gat expliciet in plaats van het stilzwijgend te negeren of aan te vullen.

## Open threads

- [ ] Google Contacts-sync voor Darren van Es nog niet afgerond (label-vraag werd niet beantwoord).
- [ ] Is er Indonesische/Indische afkomst die nog niet in `mijn-verhaal.md` staat, of gaat het om affiniteit/blootstelling zonder directe afstamming? (Penn's vraag, nog niet beantwoord.)
- [ ] Downloads-router hernoem-bug — los taakje staat klaar, nog niet opgepakt.
- [ ] Oude Charta-poster-PNG's-fix-taakje is ingetrokken (bestanden zijn inmiddels verwijderd) — geen actie meer nodig.
- [ ] Darteritus-cursus: 18 feedback-punten liggen nu bij Darren; reacties/vervolgacties van zijn kant nog af te wachten.
- [ ] Zelftest-flow-digitalisering (ActiveCampaign-score-branching) — geopperd bij Darren, nog geen concreet vervolg.

## Next steps

- Afwachten op Darrens reactie op de cursusreview en het besluit over welke actiepunten hij oppakt.
- Bij een volgende sessie: Google Contacts-sync voor Darren afronden indien nog relevant.
- Indonesisch-koken-verlangen: Sander gaat er zelf over nadenken, geen concrete actie gepland.

## Cross-links

- [[project_adc-pub-qualifier-posters-2026]]
- [[feedback_poster-workflow-gemini-canva]]
- [[project_darteritus-zelftest-flow-verbetering]]
- [[feedback_volledige-lijst-herhalen]]
- `Deliverables/2026-07-08-darteritus-cursus-review/feedback-overzicht.md`
- `Deliverables/2026-07-08-darteritus-cursus-review/concept-reactie-darren.md`

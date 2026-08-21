---
agent_id: atlas
session_id: ndb-reglementen-import-2026-08-21
timestamp: 2026-08-21T14:36:00Z
type: mid-session-insight
linked_sops: []
linked_workstreams: ["WS-002-import-external-knowledge-base"]
linked_guidelines: ["GL-001-file-naming-conventions", "GL-002-frontmatter-conventions"]
---

# NDB-reglementen: 35 ruwe syntheses omgezet naar een gestructureerd kennisarchief

## Context

Daedalus haalde op 2026-08-21 alle 35 documenten van <https://ndbdarts.nl/kennisbank/reglementen> op (29 NDB-PDF's + 6 externe ISR-reglementen). Athena las en synthetiseerde ze naar 35 platte markdown-bestanden in `PKM/Documents/NDB-Kennis/synthese/` — zonder frontmatter, met een inline `**Categorie:** / **Bronbestand:** / **Documentdatum/versie:**`-kop die in strijd is met hard rule 7 (AGENTS.md) en met [[GL-002-frontmatter-conventions]].

Mijn opdracht: dit omzetten naar het definitieve archief, zodat Jethro er een teamspecialist op kan optuigen. De structuur moest dus zowel schema-schoon als vindbaar zijn.

## What we did

- **Atlas** bepaalde de mapindeling op basis van Athena's eigen clusterindeling (het veld `**Categorie:**` in elk synthesebestand), niet op een zelfbedachte taxonomie. Vier submappen onder `PKM/Documents/NDB-Kennis/`: `01-statuten-en-algemeen` (10), `02-selectie-en-jeugd` (9), `03-competities-en-paradarts` (9), `04-tuchtrechtspraak` (7).
- **Atlas** schreef een transformatiescript in plaats van 35 bestanden met de hand te herschrijven. De body van Athena is **byte-voor-byte** overgenomen; alleen het inline `**Field:**`-blok is vervangen door YAML-frontmatter plus een narratieve sectie `## Documentversie`. Achteraf geverifieerd met een diff: nul inhoudsverschillen. Geen enkele zin is geherformuleerd, dus er is geen ruimte geweest voor een ingeslopen aanname.
- **Atlas** gebruikte uitsluitend velden uit het bestaande Documents-schema (`title`, `doc_type: other`, `digital_location`, `issued_on`, `linked_organizations`, `tags`). Geen enkele nieuwe YAML-sleutel bedacht.
- **Atlas** liet `issued_on` weg bij de vier documenten waarvan alleen een maand of helemaal geen datum bekend is (`overzicht-inschrijfgelden`, `superleague-play-offs-reglement`, beide WPD-formulieren). Een dag verzinnen om het veld te vullen zou precies de aanname zijn die het schema onbetrouwbaar maakt.
- **Atlas** verwijderde `synthese/` pas nadat de diff-verificatie slaagde.
- **Atlas** bouwde `PKM/Documents/NDB-Kennis/INDEX.md` met per cluster een tabel (document, versie/datum, onderwerp) en een register van alle openstaande onduidelijkheden, verzameld uit de 35 `## Onduidelijkheden`-secties.
- **Atlas** werkte `[[ndb-nederlandse-darts-bond]]` bij: "4 koppels" gecorrigeerd naar "2x2 koppels", de kruisuitsluiting SuperLeague ↔ LaCo toegevoegd, twee onbevestigde claims gemarkeerd, en de reglementen doorgelinkt.
- **Atlas** voegde een sectie *Kennisarchieven* toe aan `PKM/Documents/INDEX.md`, waarin ook `WDF-Kennis/` en `YouTube-Kennis/` voor het eerst worden genoemd — die waren tot nu toe niet in de bovenliggende index opgenomen.

## Decisions made

- **Vraag:** Volgen we de frontmatter-vorm van het bestaande `WDF-Kennis/`-archief (Nederlandse ad-hoc sleutels: `titel`, `bron_url`, `revisie`, `bronkopie`, `omvang`) of het Documents-schema uit GL-002?
  **Besluit:** GL-002. De WDF-sleutels staan in geen enkel entity-schema en zouden bij een SQLite-conversie stilzwijgend als NULL landen. De bron-URL is bovendien al canoniek vastgelegd in `bronnen/_downloadlog.md`; die in frontmatter herhalen zou de SSOT-regel breken. Elke notitie linkt in plaats daarvan naar `[[_downloadlog]]`.

- **Vraag:** Nieuwe velden aan GL-002 toevoegen voor bron-URL en revisienummer?
  **Besluit:** Nee, niet zonder goedkeuring van Sander. Zo'n uitbreiding raakt GL-002, het template en de SOP-002-kolommen. De revisiehistorie is bovendien echte prozaïsche narratief en hoort in de body (`## Documentversie`), niet in YAML.

- **Vraag:** Bestandsnamen hernoemen naar iets leesbaarders?
  **Besluit:** Nee. De slugs matchen 1-op-1 met de PDF-bestandsnamen in `bronnen/`. Die koppeling is de goedkoopste traceerbaarheid die er is, en maakt een herimport idempotent. Bijkomend voordeel: de zes wikilinks die Athena al onderling had gelegd bleven zonder herschrijven werken.

- **Vraag:** De twee onbevestigde CRM-claims ("18 speelronden", "DartConnect") verwijderen of laten staan?
  **Besluit:** Geen van beide — expliciet markeren met "niet bevestigd in het reglement, bron onbekend". Verwijderen zou informatie vernietigen die mogelijk klopt maar uit een andere bron komt; laten staan zou een onbevestigde claim de status van hard feit geven.

## Insights

- **Een transformatiescript is hier een inhoudelijke waarborg, niet alleen een tijdsbesparing.** Bij 35 documenten met de hand overtypen is de kans op een ingeslopen parafrase bijna 100%. Een script dat de body ongewijzigd doorgeeft plus een diff-verificatie achteraf maakt "geen aannames als feiten" mechanisch afdwingbaar in plaats van een goede intentie. Dit is herbruikbaar voor elke toekomstige bulk-import waarin een andere specialist al de inhoudelijke synthese heeft gedaan.
- **Schemadrift zit in de vault, niet alleen in nieuwe notities.** `PKM/Documents/WDF-Kennis/` (10 notities) draagt zeven YAML-sleutels die in geen enkel GL-002-schema voorkomen. Dat archief is op 2026-08-21 aangelegd, dus de drift is nieuw. Zolang het blijft staan, is het het precedent dat de volgende specialist kopieert — en dan is de vraag niet meer of we GL-002 uitbreiden, maar of GL-002 nog iets betekent.
- **De categorie-indeling van de bron is bijna altijd een betere mapindeling dan een zelfbedachte.** Athena's vier clusters zijn traceerbaar naar de kennisbankpagina van de NDB. Een eigen taxonomie zou beter kunnen aanvoelen, maar breekt zodra de bond zijn eigen indeling wijzigt en niemand meer weet waar een nieuw document hoort.

## Realignments

- _(geen — deze sessie liep binnen het door Hermes gegeven kader)_

## Open threads

- [ ] `PKM/Documents/WDF-Kennis/` draagt zeven niet-GL-002-conforme YAML-sleutels (`titel`, `bron_url`, `bron_pagina`, `revisie`, `revisiedatum`, `opgehaald`, `bronkopie`, `omvang`). Nog te beslissen door Sander: migreren naar het Documents-schema, of GL-002 uitbreiden met een bron-blok voor externe kennisarchieven. Beide zijn verdedigbaar; de huidige toestand — twee vormen naast elkaar — is dat niet.
- [ ] `WDF-Kennis/` en `YouTube-Kennis/` hebben geen eigen `INDEX.md`. Nu genoemd in `PKM/Documents/INDEX.md`, maar zonder hub.
- [ ] Geen Organization-notitie voor het **Instituut Sportrechtspraak (ISR)**, terwijl zeven notities in het archief ernaar verwijzen. Bewust niet aangemaakt: buiten de opdracht, en een CRM-entiteit aanmaken is een keuze van Sander. De zes ISR-reglementen dragen nu `linked_organizations: ndb-nederlandse-darts-bond`, wat de reden van opname weergeeft maar niet de uitgevende instantie.
- [ ] De **kilometervergoeding jeugdvervoer** staat in geen enkel document in het archief — niet in `declaraties-jeugd` (verwijst naar een declaratieformulier), en gecontroleerd ook niet in de boete- en tarievenlijst of het inschrijfgeldenoverzicht. Het enige bedrag in het archief zonder vindplaats.
- [ ] Uit de brondocumenten is **niet te verifiëren of de ISR-tuchtreglementen formeel op de NDB van toepassing zijn** — drie reglementen kennen overgangsbepalingen die afhangen van een ISR-overeenkomst, een statutenwijziging en/of een aanklagersbenoeming. Dit is de zwaarste openstaande kwestie in het archief; kandidaat om aan de NDB zelf voor te leggen.

## Next steps

- Jethro kan het archief gebruiken als kennisbasis voor een NDB-specialist. Het aanknopingspunt is `PKM/Documents/NDB-Kennis/INDEX.md`: vier clusters, per document een versiedatum, plus een expliciet register van wat de reglementen níet regelen.
- Bij het optuigen van die specialist: de sectie *Openstaande onduidelijkheden en inconsistenties* is de lijst met vragen die de specialist nooit uit dit archief kan beantwoorden. Dat is precies wat een specialist moet weten om niet te gaan gokken.

## Cross-links

- `[[_downloadlog]]` — Daedalus' downloadverantwoording, inclusief welke historische ISR-versies bewust niet zijn opgehaald.
- `[[PKM/Documents/NDB-Kennis/INDEX]]` — het opgeleverde archief.
- `[[ndb-nederlandse-darts-bond]]` — het bijgewerkte CRM-dossier.

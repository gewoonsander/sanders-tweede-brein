---
key_element: groei
project: sanders-tweede-brein-ingericht
---

# In- en uitvoerregister — ontwerp

## Status

Goedgekeurd op 2026-08-16. Uitvoering vastgelegd in [[2026-08-16-in-en-uitvoerregister-plan]].

## Aanleiding

Sander wil één single source of truth voor waar informatie binnenkomt, waar het canoniek leeft, welke afgeleide kopieën zijn toegestaan en wanneer uitvoer wordt gedeeld, gearchiveerd of verwijderd. De Team Inbox moet de enige inbox zijn die Sander bewust hoeft te beoordelen. Technische aanvoerlocaties mogen bestaan, maar zijn geen extra menselijke inboxen.

## Bestaande regels die het ontwerp begrenzen

| Bestaande bron | Blijft eigenaar van | Gevolg voor het register |
|---|---|---|
| Root `AGENTS.md` | SSOT, Markdown als canonieke laag, Team Inbox als routeerpunt | Het register mag geen tweede waarheid creëren en leeft in de portable core. |
| [[GL-005-llm-agnostic-portable-core]] | Scheiding portable core en hostadapters | Het register gebruikt rollen zoals `primary-desktop`; exacte lokale paden en SSH-details blijven in apparaat- of adapterdocumentatie. |
| [[GL-018-integratie-en-software-register]] | Diensten, koppelingen, data-eigenaarschap en conflicten | Het nieuwe register verwijst naar integratie-ID's en hergebruikt `data_role`, `sync_direction` en `conflict_policy`; het dupliceert geen dienstconfiguratie. |
| [[GL-001-file-naming-conventions]] | Namen en mapconventies | Het register verwijst naar doelconventies, maar kopieert ze niet. |
| [[GL-002-frontmatter-conventions]] | Entiteitsvelden en Deliverable-ankers | Het register verzint geen nieuwe frontmattervelden buiten de uitbreidingsprocedure. |
| [[GL-004-task-resource-linking]] | Relatie tussen taak en bron/deliverable | Taken wijzen één richting naar bronnen en uitvoer. |
| [[SOP-close-task]] | Afsluiting en archivering van taken | Een uitvoerrecord mag een taak niet zelfstandig sluiten of heropenen. |
| [[SOP-020-losstaand-deliverable-archiveren]] | Criteria voor losse Deliverables | Het register verwijst naar deze criteria en herhaalt ze niet. |
| [[WS-008-deliverables-en-projecten-audit]] | Periodieke audit van Deliverables | Het register levert vindbaarheid, maar neemt de audit niet over. |
| [[SOP-013-inboxen-verwerken]] en [[Team Inbox/README]] | Huidige fysieke inboxverwerking | Deze worden na goedkeuring consumers van het register en moeten op enkele punten worden aangepast. |
| [[WS-001-daily-journaling]] | Penns verwerking van Team Inbox | De submappen `Screenshots/` en `Documents/` blijven technische kanalen binnen dezelfde Team Inbox. |
| [[SOP-016-remote-toegang-mac-mini-op-vakantie]] en [[apparaten]] | Concrete apparaten en toegang | De Mac mini kan centraal werkpaard zijn zonder machinegegevens in het portable register te dupliceren. |

## Gevonden conflicten en achterstallige regels

1. [[SOP-013-inboxen-verwerken]] noemt Downloads, Team Inbox, Werkarchief en de vault-root alle vier "inbox". Dat botst met het gewenste mentale model van één menselijke inbox.
2. Die SOP schrijft direct `mv` voor. Voor overdracht tussen volumes is een veiligere transactie nodig: bron vaststellen, kopiëren, bestemming verifiëren en pas daarna de bron verwijderen.
3. [[GL-001-file-naming-conventions]] noemt iCloud `00-inbox` nog als invoerpunt. Dat moet een tijdelijke technische bron met uitfaseringsstatus worden, niet een blijvende tweede inbox.
4. Het headless promptbestand `scripts/inbox-verwerken.prompt.md` herhaalt het directe-`mv`-gedrag en spreekt over drie inboxen. Het moet na de SOP worden bijgewerkt, anders ontstaat gedragsdrift.
5. Het Mediahub-/Apple-Photos-beleid is inhoudelijk aanwezig, maar verdeeld over [[apparaten]], SOP-013 en oudere designs. Het register moet alleen de beslisuitkomst canoniek maken en naar detailprocedures verwijzen.

## Benaderingen

### A — GL-018 uitbreiden tot één megaregister

Alle bestandstypen, locaties en levenscycli worden als records aan het bestaande integratieregister toegevoegd.

**Voordeel:** één machineleesbaar bestand.

**Nadeel:** diensten en informatieobjecten zijn verschillende dingen. Het bestand wordt moeilijk te beheren en verantwoordelijkheden raken vermengd.

### B — Een apart portable levenscyclusregister met verwijzingen (aanbevolen)

Een nieuwe Guideline wordt SSOT voor informatieobjecten en hun route. Zij verwijst naar integraties in GL-018, naamregels in GL-001 en lifecycle-SOPs. Exacte apparaatpaden blijven in `[[apparaten]]` of afgeleide adapters.

**Voordeel:** scherpe eigenaarschapsscheiding, machineleesbaar, portable en zonder duplicatie.

**Nadeel:** consumenten zoals SOP-013 moeten een verwijzing volgen in plaats van één zelfstandig document te zijn.

### C — Alleen de bestaande SOPs harmoniseren

Geen register; iedere workflow houdt zijn eigen routeertabel.

**Voordeel:** weinig nieuwe structuur.

**Nadeel:** dezelfde routebeslissingen blijven verspreid en zullen opnieuw uit elkaar lopen. Dit lost het SSOT-probleem niet op.

## Aanbevolen architectuur

### 1. Eén menselijke inbox, meerdere technische bronnen

- **Menselijke inbox:** `Team Inbox/`, inclusief haar technische submappen.
- **Technische aanvoerbronnen:** Downloads, Gmail, apparaatcaptures en tijdelijk iCloud `00-inbox`.
- **Automatische route:** alleen bij een ondubbelzinnige classificatie en een bekende bestemming.
- **Uitzondering:** terug naar Team Inbox met reden; er ontstaat geen nieuwe inboxnaam.
- **Werkarchief:** werkruimte of bronlocatie, geen inbox die Sander periodiek moet nalopen.

### 2. Eén record per informatieobjecttype

Het register wordt JSON-in-Markdown, naar het beproefde patroon van GL-018. Een record bevat minimaal:

| Veld | Betekenis |
|---|---|
| `object_type` | Stabiele slug, bijvoorbeeld `personal-video` of `team-deliverable`. |
| `purpose` | Waarom dit type bestaat. |
| `canonical_system` | De enige inhoudelijke bron van waarheid. |
| `canonical_location_ref` | Wikilink of stabiele locatiereferentie; geen hardcoded hostpad in de portable core. |
| `intake_sources` | Technische plekken waar dit type kan binnenkomen. |
| `processor_role` | Verantwoordelijke specialist of systeemrol. |
| `lifecycle` | Toegestane toestanden, bijvoorbeeld intake, actief, gepubliceerd, gearchiveerd. |
| `transition_refs` | SOPs die verplaatsing of archivering canoniek regelen. |
| `derived_copies` | Toegestane regenereerbare of gedeelde kopieën. |
| `backup_systems` | Back-upbestemmingen; nooit automatisch een tweede canonieke bron. |
| `conflict_policy` | `canonical-wins` of `manual-review`; nooit `last-write-wins`. |
| `verification_profile` | Controles vóór bronverwijdering of statusovergang. |
| `integration_refs` | Alleen ID's uit GL-018. |
| `status` | `planned`, `active`, `retiring` of `retired`. |

### 3. Scheiding tussen waarheid, synchronisatie en back-up

Voor ieder objecttype worden drie begrippen apart vastgelegd:

- **Canoniek:** waar de gezaghebbende versie leeft.
- **Synchronisatie/derivaat:** een bruikbare kopie die opnieuw gemaakt kan worden of expliciet ondergeschikt is.
- **Back-up:** herstelkopie die niet als werkbron wordt gebruikt.

Daardoor worden iCloud, Google Drive en Mediahub niet generiek als concurrenten behandeld; hun rol kan per objecttype verschillen.

### 4. Veilige overdracht

Voor volume- of cloudoverdrachten geldt als standaard verificatieprofiel:

1. bepaal en registreer bron en beoogde bestemming;
2. kopieer naar een tijdelijke of definitieve bestemming;
3. verifieer bestaan, bestandsgrootte en waar passend checksum of itemtelling;
4. bevestig dat de bestemming volgens het register canoniek mag zijn;
5. verwijder de bron pas daarna, automatisch alleen wanneer de policy dit toestaat;
6. bij twijfel: `manual-review` in Team Inbox.

### 5. Deliverables blijven onder hun bestaande lifecycle

Het register zegt alleen dát `team-deliverable` door [[GL-004-task-resource-linking]], [[SOP-020-losstaand-deliverable-archiveren]] en [[WS-008-deliverables-en-projecten-audit]] wordt beheerst. Criteria, bewaartermijnen en archiefpaden blijven daar canoniek. Hiermee beïnvloedt het recente Deliverables-ontwerp het register wel, zonder een tweede set regels te maken.

## Voorgestelde plaats en eigenaarschap

- Nieuwe canonieke Guideline: `Team Knowledge/Guidelines/GL-020-informatie-invoer-uitvoer-en-levenscyclusregister.md`.
- Eigenaar: Atlas voor datamodel en integriteit; Daedalus voor technische adapters; Hermes bewaakt SSOT en orkestratie.
- Eerste consumer: [[SOP-013-inboxen-verwerken]].
- Projectanker: [[sanders-tweede-brein-ingericht]].

## Scope van de eerste registerversie

1. persoonlijke foto's en video's;
2. zakelijke/creatieve mediabestanden;
3. documenten en tekstnotities;
4. Team Inbox-ruwe invoer;
5. Deliverables;
6. sessielogs en journaalitems;
7. gedeelde of gepubliceerde uitvoer;
8. tijdelijke downloads en duplicaten.

Pas na validatie van deze objecttypen volgen specialistische stromen zoals facturen, voedingsdata en mailboxstatussen.

## Implementatievolgorde na goedkeuring

1. Schrijf GL-020 met schema, validatieregels en de eerste objecttypen.
2. Valideer iedere canonieke locatie tegen GL-001, GL-002, GL-018 en de bestaande lifecycle-SOPs.
3. Pas SOP-013 aan naar één menselijke inbox en veilige overdracht.
4. Werk `Team Inbox/README.md`, WS-001 en het headless promptbestand bij als consumers, zonder routeerregels te dupliceren.
5. Markeer iCloud `00-inbox` als `retiring` en maak een gecontroleerd uitfaseringsplan.
6. Test met representatieve gevallen: familievideo, zakelijke video, PDF, braindump, Deliverable en duplicaat.
7. Controleer wikilinks, SSOT-dubbelingen en machine-onafhankelijkheid.

## Goedkeuringsgrens

Goedkeuring van dit ontwerp autoriseert het schrijven van een afzonderlijk uitvoeringsplan. De Guideline, SOPs, automatiseringen en bestanden worden pas daarna gewijzigd.

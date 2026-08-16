---
key_element: groei
project: sanders-tweede-brein-ingericht
---

# In- en uitvoerregister — uitvoeringsplan

## Status

Goedgekeurd op 2026-08-16 en uitgevoerd. Gebaseerd op het goedgekeurde ontwerp [[2026-08-16-in-en-uitvoerregister-design]].

## Doel en constraints

Doel is één portable, machineleesbare single source of truth voor de invoer, canonieke opslag, toegestane afgeleide kopieën, back-up en uitvoerlevenscyclus van informatieobjecten.

Constraints:

- `Team Inbox/` is de enige inbox die Sander bewust hoeft te beoordelen.
- Downloads, Gmail, apparaatcaptures en iCloud `00-inbox` mogen alleen als technische aanvoerbron worden benoemd.
- Bestaande eigenaarschappen blijven intact: integraties in [[GL-018-integratie-en-software-register]], namen in [[GL-001-file-naming-conventions]], entiteitsvelden in [[GL-002-frontmatter-conventions]] en Deliverable-lifecycle in [[GL-004-task-resource-linking]], [[SOP-020-losstaand-deliverable-archiveren]] en [[WS-008-deliverables-en-projecten-audit]].
- Markdown blijft canoniek; JSON is alleen een gemarkeerd, leesbaar blok in de Guideline.
- De portable core bevat geen lokale gebruikerspaden, IP-adressen, credentials of runtimeproductnamen.
- Geen stil `last-write-wins`.
- Geen bronbestand verwijderen voordat de bestemming aantoonbaar is geverifieerd.
- Bestaande, nog niet gecommitte wijzigingen van Sander blijven behouden. Met name SOP-013 bevat al relevante Mediahub- en videoaanpassingen die in de nieuwe versie moeten worden geïntegreerd.
- Het plan wijzigt geen bestanden buiten de myPKA-repository en verplaatst nog geen echte media of documenten.

## Bestandskaart

| Bestand | Actie | Waarom |
|---|---|---|
| `Team Knowledge/Guidelines/GL-020-informatie-invoer-uitvoer-en-levenscyclusregister.md` | aanmaken | Nieuwe SSOT voor informatieobjectroutes en lifecycle. |
| `Team Knowledge/Guidelines/INDEX.md` | wijzigen | GL-020 vindbaar maken. |
| `Team Knowledge/SOPs/SOP-013-inboxen-verwerken.md` | zorgvuldig samenvoegen/wijzigen | Eén menselijke inbox en transactieve overdracht invoeren; bestaande video-uitzondering behouden. |
| `Team Inbox/README.md` | wijzigen | Team Inbox als enige menselijke beoordelingsplek uitleggen. |
| `Team Knowledge/Workstreams/WS-001-daily-journaling.md` | minimaal wijzigen | Penn naar GL-020 laten verwijzen zonder routes te dupliceren. |
| `scripts/inbox-verwerken.prompt.md` | wijzigen | Headless verwerking dezelfde canonieke regels laten consumeren. |
| `Team Knowledge/Guidelines/GL-001-file-naming-conventions.md` | minimaal wijzigen | iCloud `00-inbox` als uit te faseren technische bron markeren en naar GL-020 verwijzen. |
| `Team Knowledge/INDEX.md` | alleen wijzigen indien de bestaande index Guidelines afzonderlijk noemt | Navigatie compleet houden zonder dubbele inhoud. |
| Bestaande validatie- of auditscript(s) | alleen aanpassen als er al een geschikte parser bestaat | GL-020 structurally valideren zonder een tweede parser te bouwen. |

## Uitvoeringsstappen

### 1. Preflight en behoud van bestaande wijzigingen — 3 minuten

Acties:

- Lees `git status --short`.
- Bewaar `git diff -- Team Knowledge/SOPs/SOP-013-inboxen-verwerken.md` als expliciete referentie tijdens de wijziging.
- Controleer opnieuw of geen andere sessie dezelfde gedeelde bestanden bewerkt.
- Inventariseer bestaande GL-ID's en controleer dat `GL-020` vrij is.

Verificatie:

```bash
git status --short
rg -n '^id: GL-020$' 'Team Knowledge/Guidelines'
```

Verwacht: de bestaande dirty worktree is zichtbaar; de tweede opdracht levert vóór creatie geen treffer. Als GL-020 toch bestaat, stopt de uitvoering en wordt geen ID overschreven.

### 2. Canonieke en afgeleide feiten per eerste objecttype modelleren — 5 minuten

Acties:

- Maak vóór het schrijven een matrix voor acht objecttypen: `personal-photo-video`, `creative-media`, `document`, `text-note`, `team-inbox-input`, `team-deliverable`, `session-journal-record`, `temporary-download-duplicate`.
- Vul per type alleen feiten in die uit bestaande Guidelines/SOPs of een expliciet besluit volgen.
- Gebruik voor diensten uitsluitend `integration_refs`; verzin geen GL-018-ID wanneer die nog niet bestaat.
- Zet een onbekende of nog niet besloten bestemming op `manual-review`, niet op een gegokte locatie.

Verificatie:

- Elk objecttype heeft precies één `canonical_system`.
- Canoniek, derivaat en back-up zijn afzonderlijke velden.
- Iedere lifecycle-overgang heeft een bestaande `transition_ref` of expliciet `manual-review`.

### 3. GL-020 schrijven — 5 minuten

Acties:

- Maak `Team Knowledge/Guidelines/GL-020-informatie-invoer-uitvoer-en-levenscyclusregister.md`.
- Voeg doel, begrippen, statusregels, eigenaarschapsregels en één gemarkeerd JSON-register toe.
- Gebruik minimaal de velden uit het goedgekeurde ontwerp.
- Neem schema-versie `1` op.
- Leg vast dat Team Inbox de enige `human_review_queue` is.
- Beschrijf de overdrachtsinvariant `copy -> verify -> source-delete` als policy, met `manual-review` bij twijfel.
- Verwijs via wikilinks naar bestaande eigenaren van detailregels; kopieer hun criteria niet.

Verificatie:

```bash
python3 -c "import json,re,pathlib; p=pathlib.Path('Team Knowledge/Guidelines/GL-020-informatie-invoer-uitvoer-en-levenscyclusregister.md'); s=p.read_text(); b=re.search(r'<!-- lifecycle-register:start -->\s*```json\s*(.*?)\s*```\s*<!-- lifecycle-register:end -->',s,re.S); assert b; d=json.loads(b.group(1)); assert d['schema_version']==1; assert len(d['object_types'])==8; assert len({x['object_type'] for x in d['object_types']})==8; print('GL-020 JSON valid: 8 unique object types')"
```

Verwacht: `GL-020 JSON valid: 8 unique object types` en exitcode 0.

### 4. Portable-core-audit uitvoeren — 3 minuten

Acties:

- Controleer GL-020 op harde lokale paden, IP-adressen, credentials en concrete runtimeproducten.
- Controleer dat apparaatrollen generiek zijn.
- Controleer dat alle interne verwijzingen wikilinks zijn.

Verificatie:

```bash
rg -n '/Users/|100\.[0-9]+\.|API_KEY|TOKEN|Claude Code|Codex|Gemini' 'Team Knowledge/Guidelines/GL-020-informatie-invoer-uitvoer-en-levenscyclusregister.md'
```

Verwacht: geen output. Een noodzakelijke apparaatverwijzing gebruikt bijvoorbeeld `primary-desktop`, niet `Mac mini` plus pad of IP.

### 5. Guideline-index bijwerken — 2 minuten

Acties:

- Voeg GL-020 in numerieke volgorde toe aan `Team Knowledge/Guidelines/INDEX.md`.
- Wijzig `Team Knowledge/INDEX.md` alleen wanneer de structuur daar een concrete Guideline-vermelding vereist.

Verificatie:

```bash
rg -n 'GL-020.*invoer.*uitvoer.*levenscyclus' 'Team Knowledge/Guidelines/INDEX.md'
```

Verwacht: exact één indexregel.

### 6. SOP-013 veilig harmoniseren — 5 minuten

Acties:

- Werk vanuit de actuele dirty versie; herstel of overschrijf de bestaande video-uitzondering en remote-Mediahub-notitie niet.
- Vervang het mentale model van vier inboxen door één menselijke inbox plus technische bronnen en werkruimtes.
- Laat de classificatiebeslissing uit GL-020 komen en behoud detailprocedures die echt bij SOP-013 horen.
- Vervang directe volume-overdracht door kopiëren, bestemming verifiëren en daarna gericht bron verwijderen.
- Leg vast dat verwijdering bij onzekerheid bevestiging vereist en dat het item anders in Team Inbox blijft of terugkomt.
- Gebruik `mv` alleen waar bron en bestemming aantoonbaar op hetzelfde bestandssysteem liggen en de operatie atomair is; dit is een implementatiedetail, niet de algemene policy.

Verificatie:

```bash
rg -n 'vier inbox|drie inbox|Nooit kopiëren|Gebruik `mv`' 'Team Knowledge/SOPs/SOP-013-inboxen-verwerken.md'
rg -n 'GL-020|Team Inbox|verifieer|checksum|bestandsgrootte' 'Team Knowledge/SOPs/SOP-013-inboxen-verwerken.md'
```

Verwacht: de eerste opdracht levert geen oude normatieve formuleringen; de tweede toont de registerverwijzing, de ene menselijke inbox en verificatiestappen.

### 7. Team Inbox en Penn als consumers bijwerken — 4 minuten

Acties:

- Werk `Team Inbox/README.md` bij: root plus `Screenshots/` en `Documents/` vormen samen één inbox.
- Leg uit dat technische bronnen automatisch hierheen kunnen routeren en dat Sander geen andere wachtrij hoeft te controleren.
- Voeg in `WS-001-daily-journaling.md` een verwijzing naar GL-020 toe voor routering; behoud Penns bestaande inhoudelijke verwerkingsregels.
- Dupliceer de objecttypematrix niet.

Verificatie:

```bash
rg -n 'GL-020|enige.*inbox|Screenshots|Documents' 'Team Inbox/README.md' 'Team Knowledge/Workstreams/WS-001-daily-journaling.md'
```

Verwacht: beide bestanden verwijzen naar het canonieke register; de README benoemt expliciet één menselijke inbox.

### 8. Headless prompt synchroniseren — 4 minuten

Acties:

- Werk `scripts/inbox-verwerken.prompt.md` bij zodat het eerst GL-020 en daarna SOP-013 leest.
- Vervang “drie inboxen” door technische bronnen plus één menselijke reviewqueue.
- Laat de automatisering alleen automatisch verwerken als objecttype, canonieke bestemming en verificatieprofiel ondubbelzinnig zijn.
- Verbied automatische bronverwijdering wanneer verificatie ontbreekt.
- Laat alle twijfelgevallen in Team Inbox rapporteren; maak geen nieuwe wachtrijlocatie.

Verificatie:

```bash
rg -n 'drie inbox|origineel verdwijnt|`mv` via Bash' 'scripts/inbox-verwerken.prompt.md'
rg -n 'GL-020|copy|verifie|Team Inbox' 'scripts/inbox-verwerken.prompt.md'
```

Verwacht: geen oude directe-verplaatsingsinstructie; wel registerverwijzing, verificatie en Team Inbox als reviewqueue.

### 9. iCloud `00-inbox` gecontroleerd op uitfasering zetten — 3 minuten

Acties:

- Pas alleen de relevante opslagpassage in `GL-001-file-naming-conventions.md` aan.
- Benoem `00-inbox` als tijdelijke technische bron met status `retiring` en verwijs naar GL-020.
- Verwijder de map of inhoud niet.
- Laat de definitieve migratie een afzonderlijke, inventarisatiegestuurde actie blijven.

Verificatie:

```bash
rg -n '00-inbox|retiring|GL-020' 'Team Knowledge/Guidelines/GL-001-file-naming-conventions.md'
```

Verwacht: dezelfde passage bevat zowel de uitfaseringsstatus als de canonieke verwijzing; nergens staat dat de map al verwijderd is.

### 10. SSOT- en duplicatieaudit — 5 minuten

Acties:

- Zoek naar alle routeerclaims over Team Inbox, Downloads, Werkarchief, Mediahub, Apple Photos, Google Drive en iCloud.
- Beoordeel elke treffer: eigenaar, verwijzing of verouderde duplicatie.
- Vervang alleen normatieve duplicaten in de reeds geplande consumerbestanden door wikilinks.
- Laat historische sessielogs en goedgekeurde designs onveranderd; zij zijn geschiedenis, geen actuele norm.

Verificatie:

```bash
rg -n 'vier inbox|drie inbox|00-inbox|Mediahub|Apple Foto.s|Google Drive|Werkarchief' 'Team Knowledge/Guidelines' 'Team Knowledge/SOPs' 'Team Knowledge/Workstreams' 'Team Inbox/README.md' 'scripts/inbox-verwerken.prompt.md'
```

Verwacht: actuele normatieve bronnen spreken elkaar niet tegen; historische of contextuele treffers zijn als zodanig verklaarbaar.

### 11. Wikilink- en JSON-integriteitscontrole — 5 minuten

Acties:

- Parse het JSON-register opnieuw.
- Controleer dat iedere `transition_ref` naar een bestaand bestand verwijst.
- Controleer dat iedere `integration_ref` als `integration_id` in GL-018 bestaat.
- Controleer GL-020 en alle gewijzigde consumers op evidente gebroken wikilinks.

Verificatie:

- JSON-parser eindigt met exitcode 0.
- Geen onbekende `transition_ref` of `integration_ref`.
- Eventuele reeds bestaande globale broken links worden apart gerapporteerd; nieuwe broken links door deze wijziging zijn nul.

### 12. Scenarioverificatie uitvoeren — 5 minuten

Test de regels op papier, zonder echte bestanden te verplaatsen:

1. familievideo uit Downloads;
2. DartsCoaching-raw footage op de MacBook Air;
3. PDF-factuur uit Gmail;
4. losse braindump;
5. taakgebonden Deliverable;
6. los Deliverable waarvan de waarde al is verwerkt;
7. vermoedelijk duplicaat;
8. bestand in iCloud `00-inbox` tijdens de uitfasering.

Verificatie:

- Ieder scenario heeft één canonieke bestemming of `manual-review`.
- Geen scenario maakt een tweede menselijke inbox.
- Geen bronverdwijning vóór verificatie.
- Deliverable-scenario's volgen de bestaande lifecycle-SOPs en niet een gekopieerde regel in GL-020.

### 13. Einddiff en regressiecontrole — 3 minuten

Acties:

- Voer whitespacecontrole uit.
- Bekijk alleen de geplande bestanden in de diff.
- Controleer expliciet dat bestaande SOP-013-aanpassingen behouden zijn.
- Controleer dat geen echte data, media, automatisering of externe dienst is gewijzigd.

Verificatie:

```bash
git diff --check
git diff -- 'Team Knowledge/Guidelines/GL-020-informatie-invoer-uitvoer-en-levenscyclusregister.md' 'Team Knowledge/Guidelines/INDEX.md' 'Team Knowledge/SOPs/SOP-013-inboxen-verwerken.md' 'Team Inbox/README.md' 'Team Knowledge/Workstreams/WS-001-daily-journaling.md' 'scripts/inbox-verwerken.prompt.md' 'Team Knowledge/Guidelines/GL-001-file-naming-conventions.md'
```

Verwacht: `git diff --check` geeft geen output en exitcode 0; de inhoudelijke diff blijft beperkt tot de goedgekeurde scope.

## Acceptatiecriteria

- GL-020 bestaat en bevat geldige JSON met acht unieke objecttypen.
- Team Inbox is overal in de actuele operationele regels de enige menselijke reviewqueue.
- Integratie-, naam-, frontmatter- en Deliverable-feiten zijn niet gedupliceerd.
- Ieder objecttype heeft één canonieke bron, expliciete derivaat-/back-uprollen en een conflictpolicy.
- De veilige overdrachtsinvariant is consistent in GL-020, SOP-013 en het headless promptbestand.
- iCloud `00-inbox` is gemarkeerd als `retiring`, zonder data te verwijderen.
- Mac mini/MacBook-details blijven buiten het portable register.
- Bestaande Mediahub- en videoaanpassingen in SOP-013 zijn behouden.
- Alle nieuwe wikilinks en registerreferenties zijn geldig.
- Geen echte bestanden zijn als onderdeel van deze implementatie verplaatst of verwijderd.

## Stopvoorwaarden

- Als GL-020 al door een andere sessie is aangemaakt, stop en vergelijk; niet samenvoegen op aannames.
- Als een bestaand objecttype twee plausibele canonieke systemen heeft en de huidige regels beslissen niet, zet het op `manual-review` en leg het besluit aan Sander voor.
- Als een GL-018-integratie-ID ontbreekt, voeg die niet stil toe; rapporteer het als afzonderlijke registerlacune.
- Als een consumerbestand gelijktijdig is gewijzigd, stop vóór schrijven en herbaseer het plan op de actuele inhoud.
- Na drie mislukte validatiepogingen met dezelfde oorzaak stopt Atlas en rapporteert de bewezen oorzaak aan Hermes.

## Goedkeuringspoort

Na goedkeuring voert Atlas de stappen één voor één uit. Hermes rapporteert daarna het verificatiebewijs en eventuele nog open beleidsbesluiten. Er wordt niet automatisch gecommit of gepusht zonder een toepasselijke sessie-afsluiting of afzonderlijke opdracht.

## Uitvoeringsbewijs — 2026-08-16

- GL-020 aangemaakt met schema-versie 1 en acht unieke objecttypen.
- JSON geparseerd; resultaat: `GL-020 JSON valid: 8 unique object types`.
- Portable-core-scan op lokale gebruikerspaden, IP-adressen, secretnamen en concrete runtimes gaf nul treffers.
- Oude normatieve formuleringen `drie inbox`, `vier inbox`, directe `mv` en `origineel verdwijnt` geven nul treffers in SOP-013 en het headless promptbestand.
- Alle genoemde `transition_refs` en canonieke locatiereferenties hebben een bestaand doelbestand.
- GL-020 staat exact één keer in de Guideline-index.
- `git diff --check` slaagt zonder output.
- Bestaande video-uitzondering en remote-Mediahub-notitie in SOP-013 zijn behouden.

Scenario-uitkomsten:

| Scenario | Uitkomst |
|---|---|
| Familievideo uit Downloads | `personal-photo-video` → Apple Foto's; bij onduidelijke herinneringswaarde `manual-review` in Team Inbox. |
| DartsCoaching-raw footage op draagbare computer | `creative-media` → Mediahub; kopiëren en verifiëren vóór lokale bronverwijdering. |
| PDF-factuur uit Gmail | `document` → Google Drive-documentstructuur; financiële inhoud altijd interactief beoordelen. |
| Losse braindump | `text-note` → myPKA via Penn en WS-001. |
| Taakgebonden Deliverable | `team-deliverable` → `Deliverables/`; taak wijst naar uitvoer en SOP-close-task beheerst afsluiting. |
| Los Deliverable waarvan waarde al verwerkt is | Archivering uitsluitend via SOP-020 en WS-008. |
| Vermoedelijk duplicaat | Bron blijft bestaan; `manual-review` en expliciete verwijdergoedkeuring. |
| Item in iCloud `00-inbox` | Technische bron met status `retiring`; per objecttype routeren en pas na verificatie opruimen. |

Open registerlacune: voor persoonlijke media en Google Drive-documenten is nog
geen onafhankelijke back-uppolicy canoniek vastgesteld. GL-020 registreert
daarom `backup-policy-pending` en presenteert cloudsync of versiegeschiedenis
niet ten onrechte als volwaardige back-up.

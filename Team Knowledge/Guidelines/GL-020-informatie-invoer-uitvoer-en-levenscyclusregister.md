---
id: GL-020
title: Informatie-invoer-, uitvoer- en levenscyclusregister
status: active
owner: atlas
last_verified: 2026-08-16
---

# GL-020 — Informatie-invoer-, uitvoer- en levenscyclusregister

## Doel

Dit is de portable single source of truth voor de route en levenscyclus van
informatieobjecten in Sanders myPKA. Het register bepaalt waar een object kan
binnenkomen, waar de canonieke versie leeft, welke afgeleide kopieën en back-ups
zijn toegestaan en welke procedure een statusovergang beheerst.

`Team Inbox/` is de enige plek die Sander bewust als inbox hoeft te beoordelen.
Downloads, e-mail, apparaatcaptures, werkmappen en iCloud `00-inbox` zijn
technische bronnen of werkruimtes, geen aanvullende menselijke inboxen. De
submappen `Team Inbox/Screenshots/` en `Team Inbox/Documents/` horen bij dezelfde
menselijke inbox.

Externe diensten en software leven canoniek in
[[GL-018-integratie-en-software-register]]. Namen en mapconventies leven in
[[GL-001-file-naming-conventions]]. Entiteitsvelden leven in
[[GL-002-frontmatter-conventions]]. Dit register verwijst daarnaar en kopieert
hun details niet.

## Begrippen en harde regels

- **Canoniek systeem:** de enige gezaghebbende werkversie van een object.
- **Afgeleide kopie:** een ondergeschikte, traceerbare kopie die opnieuw gemaakt
  kan worden of bewust alleen voor delen/publicatie bestaat.
- **Back-up:** een herstelkopie, nooit een concurrerende dagelijkse werkbron.
- **Technische aanvoerbron:** een locatie waar informatie kan landen zonder dat
  Sander die als aparte inbox hoeft te controleren.
- **Menselijke reviewqueue:** altijd `Team Inbox/`; er wordt geen tweede
  uitzonderingsinbox gemaakt.
- `canonical-wins` is de standaard conflictpolicy. Wanneer twee kanten een
  geldige wijziging kunnen voorstellen of classificatie onzeker is, geldt
  `manual-review`. Stil `last-write-wins` is verboden.
- Eén canoniek bestand mag vanuit onbeperkt veel contexten worden gelinkt; een
  extra context rechtvaardigt geen extra canonieke kopie.

## Veilige overdrachtsinvariant

Een overdracht tussen volumes, apparaten of clouddiensten volgt altijd:

1. bron en beoogde canonieke bestemming bepalen;
2. naar de bestemming kopiëren;
3. bestemming verifiëren met bestaan en bestandsgrootte, plus checksum of
   itemtelling wanneer het risico of volume dat rechtvaardigt;
4. bevestigen dat de bestemming volgens dit register canoniek mag zijn;
5. pas daarna de bron gericht verwijderen wanneer de policy dat toestaat;
6. bij twijfel stoppen en het object in `Team Inbox/` voor `manual-review`
   aanbieden.

Een atomaire verplaatsing binnen hetzelfde bestandssysteem mag technisch als
`mv` worden uitgevoerd, maar verandert deze beleidsvolgorde niet. Onbewaakte
verwerking verwijdert nooit een bron waarvoor de bestemmingsverificatie niet is
geslaagd.

## Statusregels

- `planned`: route ontworpen, nog niet operationeel bevestigd.
- `active`: actuele route en eigenaar zijn operationeel.
- `retiring`: alleen nog tijdelijke instroom; nieuwe aanvoer wordt afgebouwd.
- `retired`: niet meer gebruiken als bron of bestemming.

## Register

<!-- lifecycle-register:start -->
```json
{
  "schema_version": 1,
  "human_review_queue": "Team Inbox/",
  "object_types": [
    {
      "object_type": "personal-photo-video",
      "purpose": "Persoonlijke herinneringen bewaren in de chronologische familiebibliotheek.",
      "canonical_system": "apple-photos-library",
      "canonical_location_ref": "GL-001-file-naming-conventions",
      "intake_sources": ["device-capture", "downloads", "team-inbox"],
      "processor_role": "penn",
      "lifecycle": ["intake", "reviewed", "canonical", "archived"],
      "transition_refs": ["SOP-013-inboxen-verwerken"],
      "derived_copies": ["explicit-share-export"],
      "backup_systems": ["backup-policy-pending"],
      "conflict_policy": "manual-review",
      "verification_profile": ["destination-exists", "file-size", "item-count-before-source-delete"],
      "integration_refs": [],
      "status": "active"
    },
    {
      "object_type": "creative-media",
      "purpose": "Bronmateriaal, montageprojecten, herbruikbare assets en professionele exports beheren.",
      "canonical_system": "mediahub",
      "canonical_location_ref": "apparaten",
      "intake_sources": ["device-capture", "downloads", "team-inbox", "working-directory"],
      "processor_role": "daedalus",
      "lifecycle": ["intake", "active-project", "asset", "export", "archive"],
      "transition_refs": ["SOP-013-inboxen-verwerken"],
      "derived_copies": ["publication-copy", "google-workspace-export-copy"],
      "backup_systems": ["mediahub-backup-policy-pending"],
      "conflict_policy": "canonical-wins",
      "verification_profile": ["destination-mounted", "destination-exists", "file-size", "checksum-before-source-delete"],
      "integration_refs": [],
      "status": "active"
    },
    {
      "object_type": "document",
      "purpose": "Persoonlijke en zakelijke documenten volgens levensdomein vindbaar bewaren.",
      "canonical_system": "google-drive-documents",
      "canonical_location_ref": "GL-001-file-naming-conventions",
      "intake_sources": ["gmail", "downloads", "team-inbox", "icloud-00-inbox"],
      "processor_role": "penn",
      "lifecycle": ["intake", "reviewed", "canonical", "archived"],
      "transition_refs": ["SOP-013-inboxen-verwerken"],
      "derived_copies": ["mypka-document-record", "explicit-share-copy"],
      "backup_systems": ["backup-policy-pending"],
      "conflict_policy": "manual-review",
      "verification_profile": ["destination-exists", "file-size", "checksum-before-source-delete"],
      "integration_refs": [],
      "status": "active"
    },
    {
      "object_type": "text-note",
      "purpose": "Gedachten, kennis en context als gelinkte Markdownkennis bewaren.",
      "canonical_system": "mypka-markdown",
      "canonical_location_ref": "PKM/INDEX",
      "intake_sources": ["conversation", "team-inbox", "downloads", "voice-transcript"],
      "processor_role": "penn",
      "lifecycle": ["intake", "classified", "canonical", "archived"],
      "transition_refs": ["WS-001-daily-journaling"],
      "derived_copies": ["sqlite-read-model", "presentation-export"],
      "backup_systems": ["repository-backup"],
      "conflict_policy": "canonical-wins",
      "verification_profile": ["wikilink-resolves", "frontmatter-valid-when-applicable"],
      "integration_refs": [],
      "status": "active"
    },
    {
      "object_type": "team-inbox-input",
      "purpose": "Ongeclassificeerde invoer tijdelijk vasthouden totdat het team de canonieke bestemming heeft vastgesteld.",
      "canonical_system": "team-inbox-until-processed",
      "canonical_location_ref": "Team Inbox/README",
      "intake_sources": ["team-inbox-root", "team-inbox-screenshots", "team-inbox-documents", "downloads-router"],
      "processor_role": "hermes",
      "lifecycle": ["received", "review-needed", "routed", "source-removed"],
      "transition_refs": ["SOP-013-inboxen-verwerken", "WS-001-daily-journaling"],
      "derived_copies": [],
      "backup_systems": [],
      "conflict_policy": "manual-review",
      "verification_profile": ["destination-confirmed-before-source-delete"],
      "integration_refs": [],
      "status": "active"
    },
    {
      "object_type": "team-deliverable",
      "purpose": "Werkproducten van het team project- en levensdomeingekoppeld beheren.",
      "canonical_system": "mypka-deliverables",
      "canonical_location_ref": "Deliverables/README",
      "intake_sources": ["team-work", "external-import"],
      "processor_role": "hermes",
      "lifecycle": ["draft", "delivered", "value-absorbed", "archived"],
      "transition_refs": ["GL-004-task-resource-linking", "SOP-020-losstaand-deliverable-archiveren", "WS-008-deliverables-en-projecten-audit", "SOP-close-task"],
      "derived_copies": ["explicit-share-copy", "published-export"],
      "backup_systems": ["repository-backup"],
      "conflict_policy": "canonical-wins",
      "verification_profile": ["key-element-present", "project-valid-when-present", "archive-criterion-met"],
      "integration_refs": [],
      "status": "active"
    },
    {
      "object_type": "session-journal-record",
      "purpose": "Sessieverloop, dagelijkse ervaringen en duurzame leerpunten in Markdown vastleggen.",
      "canonical_system": "mypka-markdown",
      "canonical_location_ref": "AGENTS",
      "intake_sources": ["conversation", "team-inbox", "daily-check-in"],
      "processor_role": "hermes-and-penn",
      "lifecycle": ["captured", "linked", "canonical", "graduated-when-durable"],
      "transition_refs": ["WS-001-daily-journaling"],
      "derived_copies": ["sqlite-read-model"],
      "backup_systems": ["repository-backup"],
      "conflict_policy": "canonical-wins",
      "verification_profile": ["date-path-valid", "wikilinks-resolve"],
      "integration_refs": [],
      "status": "active"
    },
    {
      "object_type": "temporary-download-duplicate",
      "purpose": "Tijdelijke downloads en vermoedelijke duplicaten veilig beoordelen zonder ze als blijvende waarheid te behandelen.",
      "canonical_system": "current-source-until-classified",
      "canonical_location_ref": "SOP-013-inboxen-verwerken",
      "intake_sources": ["downloads", "working-directory", "icloud-00-inbox"],
      "processor_role": "hermes",
      "lifecycle": ["unclassified", "review-needed", "routed-or-approved-for-deletion"],
      "transition_refs": ["SOP-013-inboxen-verwerken"],
      "derived_copies": [],
      "backup_systems": [],
      "conflict_policy": "manual-review",
      "verification_profile": ["identity-or-duplicate-confirmed", "explicit-delete-approval"],
      "integration_refs": [],
      "status": "active"
    }
  ]
}
```
<!-- lifecycle-register:end -->

## Eigenaarschapsgrenzen

- De precieze Mediahub-mapstructuur en bestandsnamen blijven bij
  [[SOP-013-inboxen-verwerken]], [[GL-001-file-naming-conventions]] en
  [[apparaten]].
- Deliverable-criteria en archiefpaden blijven bij
  [[GL-004-task-resource-linking]],
  [[SOP-020-losstaand-deliverable-archiveren]] en
  [[WS-008-deliverables-en-projecten-audit]].
- Taakafsluiting blijft bij [[SOP-close-task]].
- De concrete configuratie van een externe dienst blijft bij
  [[GL-018-integratie-en-software-register]] en, waar toepasselijk,
  [[GL-017-mcp-service-register]].

## Uitfasering iCloud `00-inbox`

iCloud `00-inbox` is een technische aanvoerbron met status `retiring`. Nieuwe
handmatige invoer hoort rechtstreeks in `Team Inbox/`. Bestaande inhoud wordt
niet blind verwijderd: ieder item wordt volgens het passende objecttyperecord
gerouteerd en de veilige overdrachtsinvariant wordt volledig doorlopen.

## Wijzigen van dit register

Een nieuw objecttype wordt alleen toegevoegd wanneer het een werkelijk andere
canonieke route of lifecycle heeft. Een nieuwe bronlocatie voor een bestaand
type is doorgaans een aanpassing van `intake_sources`, geen nieuw objecttype.
Iedere wijziging vereist opnieuw JSON-validatie, referentiecontrole en een
SSOT-audit op de consumerende SOPs en Workstreams.

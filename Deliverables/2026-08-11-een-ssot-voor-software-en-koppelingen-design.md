---
key_element: groei
title: Eén SSOT voor software en koppelingen
date: 2026-08-11
status: proposed
owner: daedalus
---

# Eén SSOT voor software en koppelingen

## Besluit

Sanders myPKA-Markdown is de enige inhoudelijke SSOT. Externe systemen zijn
óf bron, óf uitvoerder, óf presentatielaag. Ze mogen geen tweede canoniek
register van doelen, eigenaarschap, lifecycle, kosten of vervolgacties worden.

## Afbakening van de waarheid

| Gegeven | Canonieke plek | Afgeleiden |
|---|---|---|
| Integratie-inventaris, doel, eigenaar, lifecycle, kosten, afhankelijkheden en volgende actie | [[GL-018-integratie-en-software-register]] | Cockpit-kaarten, controles, rapportages |
| MCP-endpoint, transport, capabilities, risicoklasse en secretnaam | [[GL-017-mcp-service-register]] | Runtime-adapters in hostmappen |
| Persoonlijke en zakelijke kennis | `PKM/` volgens de bestaande entiteitsschema's | Cockpit/SQLite, exports naar externe apps |
| Procedures en synchronisatieregels | `Team Knowledge/` | n8n-workflows en runtimeconfiguratie |
| Secretwaarden | Lokale OS-secretstore; LastPass alleen als versleutelde herstelkopie | Tijdelijke procesomgeving |
| Controlegegevens per apparaat | Lokale Cockpit-SQLite | Cockpitstatus; nooit terugschrijven als canonieke inhoud |
| Externe operationele records | Het expliciet aangewezen bronsysteem per recordtype | Samenvatting of verwijzing in myPKA wanneer relevant |

Het laatste punt is geen uitzondering op de SSOT: bijvoorbeeld een agenda-item
kan canoniek in de agenda leven, maar de *afspraak dat de agenda de bron is* en
de manier waarop myPKA hem gebruikt, staan uitsluitend in GL-018. We kopiëren
geen volledige agenda, boekhouding of communitydatabase naar Markdown.

## Drie technische routes

### Route 1 — Registergestuurde adapters (aanbevolen)

GL-018 stuurt alle verificatie en koppeling. Iedere connector heeft een stabiel
`integration_id`, een expliciete richting (`import`, `export`, `bidirectional`
alleen bij uitzondering), een record-eigenaarschap en één veilige healthcheck.
n8n en agentruntimes zijn adapters. De Cockpit leest GL-018 en lokale
observaties.

Voordelen: minimale duplicatie, LLM-agnostisch, makkelijk te auditen en veilig
per connector uit te rollen. Nadeel: iedere echte connector vraagt een kleine
adapter en een expliciet veldcontract.

### Route 2 — n8n als centrale integratiehub

Alle applicaties praten via n8n; myPKA ontvangt en levert uitsluitend via
webhooks of bestanden van n8n.

Voordelen: centraal uitvoeringslog en weinig losse koppelingen. Nadelen: n8n
wordt feitelijk een tweede configuratie-SSOT, portability neemt af en uitval van
n8n raakt alles.

### Route 3 — Cockpit als datahub

De Cockpit krijgt voor iedere toepassing een connector en synchroniseert zelf.

Voordelen: één lokale interface en directe monitoring. Nadelen: meer eigen code,
groter secret- en onderhoudsoppervlak en vermenging van presentatie met
automatisering.

## Aanbevolen architectuur

Route 1. De lagen krijgen vaste verantwoordelijkheden:

1. **myPKA:** canonieke afspraken, kennis en registers.
2. **n8n:** eventgedreven uitvoering en transformatie; workflow-ID's zijn
   afgeleide referenties, geen beleid.
3. **Cockpit:** read-only overzicht plus veilige probes; alleen lokale
   controlegeschiedenis is schrijfbaar.
4. **Externe software:** bron of bestemming per datacontract.
5. **Runtime-adapters:** vertalen GL-017/GL-018 naar het configuratieformaat van
   de actieve agentruntime.

## Benodigde registeruitbreiding

GL-018 krijgt per integratie:

- `data_role`: `source`, `destination`, `processor`, `presentation` of `vault`;
- `sync_direction`: `none`, `import`, `export` of uitzonderlijk
  `bidirectional`;
- `canonical_records`: lijst met recordtypen waarvoor dit externe systeem de
  aangewezen operationele bron is;
- `adapter_refs`: alleen stabiele namen van afgeleide adapters/workflows;
- `conflict_policy`: standaard `canonical-wins`, nooit stil samenvoegen;
- `verification_profile`: bestaande allowlist blijft leidend.

Deze velden beschrijven eigenaarschap; ze bevatten geen tokens, providerdata of
machinepaden.

## Uitrolvolgorde

### Fase 1 — SSOT en lokale basis

1. GL-018 uitbreiden en alle 18 records classificeren.
2. GL-017 aanvullen met Firecrawl en eventuele ontbrekende MCP-diensten.
3. Validator, API en Cockpit aanpassen aan het nieuwe schema.
4. Duplicerende statische stackgegevens laten verwijzen naar GL-018.

### Fase 2 — Bestaande, goedkope verbindingen

1. n8n MCP en Firecrawl MCP per runtime verifiëren.
2. Todoist en iCal read-only controleren.
3. Bestaande Google Contacts-workflow alleen inventariseren en koppelen aan haar
   `integration_id`.
4. n8n Public API alleen toevoegen als de Cockpit workflowstatus nodig heeft;
   niet als tweede bron voor integratiebeleid.

### Fase 3 — Domeinconnectors

Jortt, Teambeheer/D.T. Irritant, Huddle, Plug&Pay, bunq en de Nederlandse
voedingsdatalaag worden één voor één aangesloten. Voor iedere connector wordt
vooraf het recordtype, de richting, het conflictbeleid en de minimale scope
goedgekeurd.

## Veiligheidsgrenzen

- Geen secretwaarden in Markdown, SQLite-observaties, logs of browserfrontend.
- Eerst read-only healthchecks; schrijven alleen na een aparte preview.
- Geen algemene bidirectionele sync. Dat veroorzaakt onduidelijk eigenaarschap.
- Geen automatische verwijderingen bij bronverschillen.
- De Cockpit mag GL-018 niet aanpassen; wijzigingen lopen via de portable
  Markdownlaag en worden daarna opnieuw ingelezen.
- Per apparaat blijft alleen secret-aanwezigheid en technisch bewijs lokaal.

## Acceptatiecriteria

- Iedere integratie heeft precies één `integration_id` en één canonieke
  definitie in GL-018.
- Iedere recordsoort heeft hoogstens één aangewezen canonieke bron.
- GL-017 bevat alle en alleen MCP-technische contracten.
- Runtimeconfiguraties en n8n-workflows verwijzen naar een register-ID.
- Cockpitstatus kan volledig opnieuw worden opgebouwd uit GL-018 plus nieuwe
  lokale probes.
- Verwijderen van de Cockpit-database verliest geen canonieke informatie.
- Geen getrackt bestand bevat een secretwaarde.

## Niet in deze uitrol

- Externe accounts samenvoegen of abonnementen opzeggen.
- Een centrale cloud-database introduceren.
- Volledige kopieën van boekhouding, agenda of communitydata in myPKA opslaan.
- Alle connectors tegelijk schrijfrechten geven.


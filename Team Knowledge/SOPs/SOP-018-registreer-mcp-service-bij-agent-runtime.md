---
id: SOP-018
title: Registreer MCP-service bij agentruntime
owner: daedalus
status: active
triggers:
  - een MCP-service beschikbaar maken in een nieuwe agentruntime
  - een ontbrekende MCP-verbinding herstellen
  - meerdere runtimes tegen dezelfde MCP-service laten werken
reusable_by: any-agent
---

# SOP-018 — Registreer MCP-service bij agentruntime

## Doel

Een dienst uit [[GL-017-mcp-service-register]] veilig en reproduceerbaar aansluiten op een agentruntime zonder configuratiedrift of secrets in het tweede brein.

## Voorwaarden

- De service staat in GL-017.
- Endpoint, transport, secretvariabele en risicoklasse zijn ingevuld.
- De adapterlocatie volgt [[GL-005-llm-agnostic-portable-core]].
- De runtime ondersteunt het vereiste transport en de authenticatievorm.

## Procedure

### 1. Lees de service-definitie

Noteer `service_id`, endpoint, transport, secretvariabele, risicoklasse en healthcheck. Gebruik geen waarden uit een bestaande adapter als nieuwe SSOT.

### 2. Controleer de runtimecapaciteit

Bevestig via lokale documentatie of helpuitvoer dat de runtime het transport en secretreferenties ondersteunt. Kan dat niet, stop en documenteer de incompatibiliteit; bouw geen onveilige tussenoplossing.

### 3. Voer een securityreview uit

- Inventariseer lees- en schrijftools.
- Controleer of het endpoint door de verwachte organisatie wordt beheerd.
- Controleer dat authenticatie uit de secret store komt.
- Beoordeel of bevestiging nodig is voor schrijf-, publiceer- of verwijderacties.

### 4. Maak of werk de afgeleide adapter bij

De adapter bevat alleen:

- verwijzing naar GL-017;
- runtime-eigen registratiestap;
- secretvariabelenaam;
- reload/herstartstap;
- runtime-eigen verificatie.

Kopieer geen secret en dupliceer geen operationeel beleid.

### 5. Installeer het secret veilig

Gebruik de secret store van het besturingssysteem. Invoer is verborgen en vindt buiten gesprekken plaats. Test alleen of het item bestaat; toon de waarde nooit.

### 6. Laad de runtimeomgeving

Publiceer de secretvariabele alleen aan processen die haar nodig hebben. Een ontbrekend of leeg item stopt de loader met een fout. Herstart runtimes die hun omgeving alleen bij processtart inlezen.

### 7. Registreer idempotent

Lees eerst de bestaande registratie. Voeg alleen toe wanneer zij ontbreekt; wijzig alleen wanneer endpoint of secretvariabelenaam afwijkt en de wijziging is goedgekeurd.

### 8. Verifieer

Controleer in volgorde:

1. adapter verwijst naar GL-017;
2. geen literal secret in getrackte bestanden;
3. secret store meldt `PRESENT`;
4. runtimeomgeving meldt `PRESENT`;
5. registratie is enabled;
6. toolinventaris kan worden opgehaald;
7. één read-only healthcheck slaagt.

### 9. Documenteer het resultaat

Werk `last_verified` bij in GL-017. Leg alleen status, toolfamilies en afwijkingen vast; nooit token, headers of complete authresponses.

## Rollback

1. Schakel of verwijder uitsluitend de nieuwe runtime-registratie.
2. Stop of unload een nieuwe environment-loader.
3. Laat het Keychain-item staan totdat expliciete verwijdering is goedgekeurd.
4. Trek een provider-token alleen in wanneer alle afhankelijke runtimes zijn gemigreerd of de verbinding definitief wordt verwijderd.

## Foutbeleid

- `401/403`: controleer aanwezigheid/rotatie van het secret; log geen header.
- Server onbereikbaar: behoud registratie disabled en controleer endpoint/transport.
- Tools verschillen: behandel als capabilitywijziging en herhaal de securityreview.
- Adapterdrift: herstel vanuit GL-017, niet andersom.

## Referenties

- [[GL-001-file-naming-conventions]]
- [[GL-005-llm-agnostic-portable-core]]
- [[GL-017-mcp-service-register]]

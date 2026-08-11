---
agent_id: hermes
session_id: integratie-ssot-en-cockpit
timestamp: 2026-08-12T00:25:34+02:00
type: close-session
linked_sops:
  - SOP-017-verwerk-voedingsregistratie
  - SOP-018-registreer-mcp-service-bij-agentruntime
  - SOP-019-controleer-integraties-en-software
linked_workstreams:
  - WS-003-install-an-expansion
linked_guidelines:
  - GL-005-llm-agnostic-portable-core
  - GL-017-mcp-service-register
  - GL-018-integratie-en-software-register
---

# Integratie-SSOT en myPKA Cockpit

## Context

Sander wilde een gestructureerd overzicht van alle MCP's, API's en software,
zichtbaar in de Cockpit en bruikbaar door verschillende agentruntimes. Daarna
koos hij expliciet voor myPKA-Markdown als enige inhoudelijke SSOT.

## What we did

- Daedalus en Argus ontwierpen, beveiligden en installeerden de lokale myPKA
  Cockpit-adaptatie 1.5.3.
- Daedalus bouwde `[[GL-018-integratie-en-software-register]]` met achttien
  integraties en een strikt door de Cockpit gelezen JSON-register.
- Daedalus voegde lokale, secretvrije statusobservaties, API-routes, filters,
  desktop- en mobiele kaarten en een veilige controleactie toe.
- De live controle gaf drie werkende koppelingen, veertien met vervolgactie en
  één verbroken koppeling: de nog niet ingerichte n8n Public API.
- Daedalus werkte het gekozen SSOT-model uit in
  `[[2026-08-11-een-ssot-voor-software-en-koppelingen-design]]`.
- Na goedkeuring werd GL-018 schema 2: iedere integratie heeft nu een rol,
  synchronisatierichting, canonieke recordtypen, adapterreferenties en
  conflictbeleid.
- `[[GL-017-mcp-service-register]]` werd aangevuld met het Firecrawl-contract.
- De Cockpit weigert dubbel eigenaarschap van canonieke recordtypen en
  onveilige tweerichtingssynchronisatie zonder handmatige beoordeling.
- Penn registreerde bij afsluiten dat de schimmelcrème op 2026-08-12 niet was
  aangebracht en dat het voedingslogboek compleet is.

## Decisions made

- **Vraag:** Waar leeft de waarheid over software en koppelingen?
  **Besluit:** myPKA-Markdown is de inhoudelijke SSOT; n8n voert uit, de Cockpit
  presenteert en lokale SQLite bevat alleen opnieuw opbouwbare observaties.
- Iedere Mac houdt zijn eigen actieve secrets in de lokale OS-secretstore.
  LastPass is uitsluitend de versleutelde herstel- en overdrachtskopie.
- Externe toepassingen krijgen per recordtype één expliciete rol en richting;
  algemene stilzwijgende bidirectionele synchronisatie is verboden.

## Insights

- Het bestaande Software-stack-scherm is geen tweede register: het toont alleen
  lokaal uitvoeringsbewijs uit sleutel- en serverregistraties en verwijst naar
  GL-018 voor de canonieke inventaris.
- De frontendbuild bleek niet inhoudelijk te falen maar vast te lopen onder
  zware geheugendruk met meerdere desktopassistenten en browserrenderers actief.

## Realignments

- Sander verduidelijkte dat hij geen centrale cloud- of n8n-database als SSOT
  wil; keuze A was expliciet: myPKA-Markdown blijft centraal.

## Open threads

- [ ] De volledige frontendproductiebundel opnieuw bouwen wanneer voldoende
  werkgeheugen beschikbaar is; TypeScript, vijftien integratietests en gerichte
  syntax-, secret- en portabilitycontroles zijn al groen.
- [ ] Fase 2 uitvoeren: eerst n8n MCP en Firecrawl per computer verifiëren,
  daarna Todoist en iCal read-only aansluiten.
- [ ] Gitrepository herstellen: bij sessieafsluiting verwees `HEAD` naar het
  lokaal ontbrekende/onleesbare object `809d88ad739ec137e43ae2acaf6bc86ffc29dadc`.

## Next steps

- Herstel of haal het ontbrekende HEAD-object veilig van `origin` en voltooi de
  verplichte sessieback-up.
- Bouw daarna de frontend onder lagere geheugendruk en hervat fase 2.

## Cross-links

- [[2026-08-11-22-58_hermes_install-mypka-cockpit-v1-5-3]]
- [[2026-08-11-22-30_hermes_lastpass-mcp-token-backup]]
- [[2026-08-11-19-58_hermes_dt-irritant-seizoen-26-27]]

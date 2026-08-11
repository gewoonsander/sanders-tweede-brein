---
id: SOP-019
title: Controleer integraties en software
status: active
default_owner: daedalus
triggers:
  - controleer mijn koppelingen
  - welke integraties werken
  - werk het koppelingendashboard bij
references:
  - GL-018-integratie-en-software-register
  - GL-017-mcp-service-register
---

# SOP-019 — Controleer integraties en software

Herbruikbaar door iedere specialist; Daedalus is standaard eigenaar.

## Doel

De verwachte situatie uit [[GL-018-integratie-en-software-register]] vergelijken
met aantoonbare lokale of handmatige observaties, zonder secrets te lezen,
tonen of opslaan.

## Procedure

1. **Lees het register.** Weiger dubbele ID's, onbekende enums en ongeldige
   verificatieprofielen. Verander geen status om een fout te verbergen.
2. **Bepaal context.** Noteer apparaat en runtime als lokale labels; synchroniseer
   geen machine-identifiers of secretstatussen via Markdown.
3. **Controleer passief.** Gebruik alleen de probes die de record allowlist:
   config, aanwezigheid van een secret, MCP-registratie, proceshealth of een
   expliciet read-only connectorverzoek.
4. **Classificeer bewijs.** `pass`, `warn`, `fail`, `not_applicable` of
   `not_checked`. `configured` zonder probebewijs is nooit `pass`.
5. **Sla minimaal op.** Bewaar ID, apparaat, probe, status, tijd, duur,
   bewijslabel en foutcategorie. Bewaar nooit headers, responsebody's, URL-query,
   e-mailadressen of secretwaarden.
6. **Vul handmatig aan.** Alleen wanneer geen veilige probe bestaat. Noteer wie,
   wanneer en wat zichtbaar gecontroleerd is.
7. **Bepaal vervolgactie.** Iedere rode, oranje, geplande of niet-gecontroleerde
   kaart krijgt precies één concrete eerstvolgende actie.
8. **Hercontroleer na herstel.** Schrijf een nieuwe observatie; overschrijf geen
   geschiedenis. De nieuwste geldige observatie is leidend.

## Rotatie

Volg voor MCP-secrets [[SOP-018-registreer-mcp-service-bij-agent-runtime]].
Werk eerst LastPass bij, daarna iedere lokale secret store en trek het oude
providertoken pas in wanneer alle afhankelijke apparaten zijn gemigreerd.

## Rollback

- Stop een probe bij onverwacht schrijfgedrag of een niet-allowlisted redirect.
- Verwijder nooit een token als onderdeel van een statuscontrole.
- Een defecte probe wordt `fail` of `not_checked`; de Cockpit blijft beschikbaar.
- Lokale observatietabellen mogen opnieuw worden opgebouwd zonder de canonieke
  Markdownrecords te wijzigen.

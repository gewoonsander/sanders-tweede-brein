---
key_element: groei
---

# Dropbox-cloudkoppeling voor Claude én Codex — ontwerp v2

## Status

Herzien ontwerp ter goedkeuring. Sander wees v1 op 2026-08-12 af omdat alleen Claude als runtime was opgenomen. De harde eis is nu **LLM-agnostische toegang voor minimaal Claude en Codex**, naast **Full Dropbox** met volledige mogelijkheden en goedkeuring per concrete opdrachtbatch. Er is nog geen Dropbox-app aangemaakt, OAuth-toestemming verleend of MCP-adapter geïnstalleerd.

## Doel

Claude Code en Codex krijgen vanuit Sanders canonieke Tweede Brein dezelfde cloudtoegang tot alle bestanden en mappen in zijn persoonlijke Dropbox, zonder Dropbox Desktop en zonder permanente synchronisatie naar de Mac. Geen van beide runtimes wordt de bron van waarheid voor de verbinding.

## Gekozen architectuur

```text
GL-017 portable servicedefinitie (SSOT)
  → dezelfde lokale Dropbox-MCP-server
      ↙ Claude-adapter             ↘ Codex-adapter
  .mcp.json / .claude/          .codex/mcp-adapter.md + Codex MCP-config
      ↘                               ↙
        Claude Code én Codex
              ↓
  lokale Dropbox-MCP-server
  → officiële Dropbox API via OAuth 2.0 + PKCE
  → Full Dropbox
```

Er wordt geen onbeoordeelde community-MCP-server gebruikt. De server gebruikt de officiële Dropbox-SDK/API en exposeert alleen eigen, begrensde tools. Runtimeconfiguraties zijn dunne, afgeleide adapters conform [[GL-005-llm-agnostic-portable-core]] en [[SOP-018-registreer-mcp-service-bij-agent-runtime]].

## Portable kern en runtime-adapters

- [[GL-017-mcp-service-register]] wordt de enige canonieke servicedefinitie voor endpoint/transport, authmodel, toolfamilies, risicoklasse en healthcheck.
- De MCP-server en het batchbeleid bevatten geen Claude- of Codex-specifieke logica.
- Claude Code krijgt een projectregistratie in `.mcp.json`; Claude vraagt eenmalig goedkeuring voor de project-MCP.
- Codex krijgt een idempotente registratie via `codex mcp add` en documentatie in `.codex/mcp-adapter.md`.
- Beide runtimes gebruiken exact dezelfde server, OAuth-accountbinding, Keychain-items, batchdatabase en auditgeschiedenis.
- Een derde MCP-compatibele runtime kan later worden toegevoegd via een nieuwe dunne adapter, zonder de Dropbox-server of het veiligheidsbeleid te wijzigen.
- Een runtime die het batchprotocol niet correct kan presenteren, krijgt alleen read-only tools totdat compatibiliteit aantoonbaar is getest.

## OAuth en opslag

- Dropbox-app-type: **Scoped access — Full Dropbox**.
- OAuth: authorization code met PKCE.
- Offline toegang: short-lived access tokens met een refresh token.
- App key mag in configuratie staan; app secret en tokens nooit in Git, Markdown, `.mcp.json`, logs of chat.
- Refresh token wordt in macOS Keychain bewaard.
- Toegang is intrekbaar via Dropbox Connected Apps en via een lokale disconnect-opdracht.
- Minimale functionele scopes worden exact bepaald tijdens implementatie. Verwacht: accountidentificatie, bestandsmetadata lezen/schrijven, inhoud lezen/schrijven en alleen wanneer gewenst sharing-scopes.

## Batchgoedkeuring

Iedere muterende opdracht heeft runtime-onafhankelijk twee fasen:

1. **Preview** — Claude genereert een onveranderlijk batchmanifest met:
   - batch-ID en vervaltijd;
   - exacte bron- en doelpaden;
   - actie per bestand: upload, aanmaken, overschrijven, hernoemen, verplaatsen, verwijderen, herstellen of delen;
   - aantallen en totaal te verwerken bytes waar bekend;
   - conflicten en overschrijvingen;
   - expliciete markering van verwijderen, delen en publieke links.
2. **Uitvoeren** — pas na Sanders goedkeuring van dat batch-ID in de runtime waar de preview zichtbaar is gemaakt. De server voert uitsluitend het ondertekende manifest uit. Iedere afwijking, nieuw bestand, gewijzigd bronbestand of verlopen manifest stopt de batch en vereist een nieuwe preview. Een batch die in Claude is goedgekeurd kan niet ongemerkt vanuit Codex worden uitgebreid of hergebruikt, en omgekeerd.

Lees- en zoekacties hebben geen batchgoedkeuring nodig. Ze blijven begrensd door paginering, maximale downloadgrootte en lokale outputlimieten.

## Veiligheidsgrenzen

- Geen generieke `call_dropbox_api`-tool en geen vrij endpoint/JSON-passthrough.
- Geen globaal commando dat de Dropbox-root recursief verwijdert of leegmaakt.
- Verwijderen gebruikt Dropbox-verwijdering/herstelbaarheid; permanent wissen wordt niet ondersteund.
- Delen of publieke links staan standaard uit. Als Sander dit later activeert, verschijnen ze als afzonderlijke hoog-risicoacties in het batchmanifest.
- Iedere mutatie wordt lokaal geaudit met tijd, batch-ID, runtime-ID, tool, paden en resultaat; nooit inhoud of tokens.
- Rate limits, paginering, time-outs en maximale batchgrootte zijn hard begrensd.
- Een gedeeltelijk mislukte batch wordt niet blind herhaald; het resultaat toont exact wat wel en niet is uitgevoerd.
- Dropbox blijft canoniek voor Dropbox-bestanden; de adapter kopieert bestanden niet automatisch naar de PKA.

## MCP-tools

### Direct toegestaan

- accountinformatie controleren;
- bestanden/mappen zoeken en weergeven;
- metadata lezen;
- bestandsinhoud downloaden/lezen;
- wijzigingen sinds cursor opvragen.

### Alleen via preview + goedgekeurde batch

- map of bestand aanmaken/uploaden;
- overschrijven;
- hernoemen of verplaatsen;
- verwijderen of herstellen;
- deelinstellingen of links wijzigen, alleen als die capability later expliciet wordt geactiveerd.

## Cockpit

`Dropbox` wordt één kaart in **Koppelingen & software** met:

- badges `API` en `MCP`;
- `Full Dropbox` als scope;
- OAuth-status zonder tokeninformatie;
- laatste read-only controle;
- laatst uitgevoerde batch en resultaat;
- knoppen `Dropbox verbinden`, `Toegang controleren`, `Batchgeschiedenis` en `Verbinding intrekken`.

## Implementatiefasen

1. Argus bevestigt scopes, Keychain-opslag, batchmanifest en tooloppervlak.
2. Sander maakt of autoriseert de Dropbox-app via Dropbox OAuth.
3. Daedalus bouwt de lokale adapter met officiële Dropbox-SDK.
4. Service wordt canoniek toegevoegd aan GL-017.
5. Dunne runtime-adapters worden afgeleid voor Claude (`.mcp.json`) en Codex (`codex mcp add` + `.codex/mcp-adapter.md`), zonder secrets.
6. GL-018 en de Cockpitkaart worden bijgewerkt.
7. Contract-, security-, cross-runtime- en foutafhandelingstests.
8. Claude én Codex inventariseren dezelfde tools en voeren dezelfde read-only healthcheck uit.
9. End-to-end batchtest vanuit beide runtimes met een tijdelijke Dropbox-testmap.

## Acceptatiecriteria

- Dropbox Desktop is niet vereist.
- Claude en Codex kunnen dezelfde geautoriseerde Dropbox-metadata en inhoud cloud-native lezen.
- Geen mutatie kan zonder een actuele, expliciet goedgekeurde batch plaatsvinden.
- Een goedgekeurde batch kan niet ongemerkt worden uitgebreid.
- Verwijderen is herstelbaar; permanent wissen bestaat niet als tool.
- Tokens blijven buiten repo, chat, logs en Cockpitresponses.
- Toegang kan aantoonbaar worden ingetrokken.
- De portable service en het batchbeleid blijven werken wanneer één runtime-adapter wordt verwijderd.
- Toolnamen, batchsemantiek en veiligheidsgrenzen zijn identiek in Claude en Codex.

## Bronnen

- Dropbox OAuth Guide — Full Dropbox, scoped permissions en refresh tokens.
- Dropbox DBX Platform — officiële API en SDK.
- Claude Code MCP-documentatie — project-MCP via `.mcp.json`.
- OpenAI Codex MCP-interface — registratie, login/logout en runtimeconfiguratie.
- [[GL-005-llm-agnostic-portable-core]]
- [[SOP-018-registreer-mcp-service-bij-agent-runtime]]
- [[GL-017-mcp-service-register]]
- [[GL-018-integratie-en-software-register]]

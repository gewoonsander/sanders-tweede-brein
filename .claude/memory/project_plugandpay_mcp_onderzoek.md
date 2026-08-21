---
name: project-plugandpay-mcp-onderzoek
description: Verkennend onderzoek (Tonnymart + Daedalus, 2026-08-20) naar het koppelen van Plug&Pay aan een MCP-server — officiële MCP bestaat maar is scope-beperkt, volledige billingdata vereist zelfbouw
metadata:
  type: project
  originSessionId: 7f4f46bd-6a33-4b75-b12d-5c060c0be951
  modified: 2026-08-21T07:43:51.681Z
---

Plug&Pay (plugandpay.com) heeft sinds 20-08-2026 een officiële MCP-server live (aangekondigd via mail van info@plugandpay.nl): `https://mcp.plugandpay.com/mcp`, OAuth 2.1 + PKCE + Dynamic Client Registration (scope: alleen `mcp:use`, geen fijnmazige rechten), toe te voegen als "custom connector" in Claude. Docs: [help.plugandpay.com/nl/articles/16097982](https://help.plugandpay.com/nl/articles/16097982-plug-pay-koppelen-aan-claude).

**Scope van die officiële MCP is beperkt tot paginabouw:** pagina's/landingspagina's maken/bewerken, funnels opzetten, blokken toevoegen, afbeeldingen genereren, en orders zoeken (read-only). Geen subscriptions, facturen, incasso's of klantbeheer. Elke actie staat standaard op "needs approval". Geen tier-vereiste gedocumenteerd (mogelijk documentatiehiaat).

**Voor volledige billingdata** (subscriptions, facturen, producten, tax rates, memberships) bestaat een aparte REST-API (`api.plugandpay.com/v2/...`, Bearer-token per account via Settings > Developers, eenmalig getoond) met een onderhouden officiële PHP SDK (`plug-and-pay/sdk-php`) en een third-party TS SDK. Geen publieke OpenAPI-spec gevonden — `docs.plugandpay.nl` is client-rendered Stoplight zonder toegankelijke spec. Webhook V2 stuurt alleen een thin event (`trigger_type`, `triggerable_id`, `tenant_id`, `rule_id`) — de echte data moet je na ontvangst alsnog via de REST-API ophalen. `tenant_id` in de payload maakt het wel mogelijk twee accounts uit één webhook-ontvanger te onderscheiden.

Geen dedicated n8n-node voor Plug&Pay (bevestigd via npm-search + n8n.io/integrations). Een Zapier MCP bestaat (`zapier.com/mcp/plug-and-pay`) maar biedt alleen 6 triggers, geen acties/queries — niet bruikbaar voor dit doel.

**Why:** Sander heeft twee gescheiden Plug&Pay-abonnementen — één voor zijn dartscoaching-bedrijf (DartsCoaching/Dart Buddies) en één waarop hij zijn boek verkoopt (blijft voorlopig apart) — en wil beide aan AI koppelen. Voor de officiële MCP is multi-account-gedrag **niet gedocumenteerd en ongetest**: DCR maakt twee losse connector-instanties (elk eigen client_id/tokens) technisch plausibel, maar de OAuth-autorisatie hangt aan de actieve browsersessie op `admin.plugandpay.com` (geen tenant-parameter in de discovery-metadata) — moet expliciet getest worden met een privévenster/tweede browserprofiel per account, niet aangenomen dat het vanzelf werkt.

**Update 2026-08-20:** connector live getest — Sander heeft de officiële MCP als custom connector toegevoegd op claude.ai (naam "Plug&Pay – DartsCoaching", DCR-authenticatie) en orders-zoeken werkt bevestigd. De connector bleek daarna ook rechtstreeks bruikbaar binnen dezelfde lopende Cowork/Claude Code-sessie (tools verschenen automatisch als deferred tools, geen herstart nodig) — dat beantwoordt de eerdere twijfel of Cowork custom connectors los van claude.ai oppikt.

**Multi-account-vraag is opgelost, en anders dan verondersteld:** de `list-shops`-tool laat zien dat één Plug&Pay-login toegang geeft tot **beide shops (tenants) tegelijk** — geen tweede OAuth-koppeling/connector nodig. Bevestigde shops: "Dartbuddies.online" (shop_id 21766, plan lite, url gewoonsander.nl) en "www.dartscoaching.nl" (shop_id 33052, plan premium). Elke tool-aanroep (search, retrieve-order, enz.) neemt een verplichte `shop_id`-parameter. **Bevestigd welke shop welke is** (via een echte order met het boek als product): shop_id 21766 "Dartbuddies.online" = het **boek-account**, shop_id 33052 "www.dartscoaching.nl" = de **dartscoaching-praktijk**. Order-zoeken getest en werkend op beide.

**How to apply:** Bij een toekomstig verzoek om Plug&Pay-AI-koppeling: optie A (officiële MCP) is nu al te gebruiken voor paginawerk/funnels/orders-zoeken, zonder bouwwerk. Optie B (eigen MCP-server op de REST-API/SDK) is nodig zodra Sander billingdata (abonnees, mislukte incasso's, omzet) wil bevragen — vereist een projectmap buiten de PKA voor de server-code, tokens in `.env` (chmod 600), en een verplichte `account`-parameter zonder default zodra beide Plug&Pay-accounts erin zitten. A en B sluiten elkaar niet uit. Zie [[project_huddle_dartbuddies_automatisering]] voor de parallelle Huddle-kant van dezelfde cross-platform vraag (Tonnymart bezit de Plug&Pay-kant, Martonny de Huddle-kant volgens AGENTS.md).

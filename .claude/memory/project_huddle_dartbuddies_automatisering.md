---
name: project-huddle-dartbuddies-automatisering
description: Huddle (thehuddle.nl) heeft géén API voor community-posts/auto-reply, maar wél een werkende, ongedocumenteerde REST-API voor e-learning-content (cursussen/modules/lessen) — relevant voor elk toekomstig Dartbuddies-automatiseringsverzoek
metadata: 
  node_type: memory
  type: project
  originSessionId: 0ad47f3c-8cca-44ea-a20f-53d915fee289
  modified: 2026-08-19T16:02:06.531Z
---

**Correctie 2026-08-19:** de uitspraak hieronder ("geen publieke API") is te stellig gebleken voor e-learning-content. In de admin-omgeving (dartbuddies.dartscoaching.nl/admin/v2/settings/integrations/developers/) kan een eigen API-sleutel (OAuth personal access token, Laravel Passport) worden aangemaakt. Live getest en bevestigd werkend met sessie-cookie (en de courses-list ook met de Bearer-token zelf):
- `GET /api/v4/e-learning/courses` — lijst cursussen
- `GET /api/v4/e-learning/courses/{id}/catalog` — modules + lessen (id, naam, content_kind)
- `GET /api/v3/content/{lesson_id}` — volledige lesinhoud (titel, HTML-body, oefeningtekst)
Nergens gedocumenteerd (help.thehuddle.nl dekt dit niet, bevestigd door Martonny op 2026-08-19 na uitputtend zoeken) — endpoints gevonden via het netwerkverkeer van de admin-SPA zelf, niet via officiële specs. Sommige gegokte endpoints gaven 500 (bv. `/api/v3/courses/{id}` los, `/api/v3/modules?course_id=`) — dus niet alles werkt, alleen de hierboven bevestigde paden.
**Beveiliging:** de aangemaakte token had bij aanmaak `"scopes":[]` en een extreem verre expiry (~honderd jaar) — dus feitelijk non-expiring met de rechten van Sanders eigen account. Behandelen als long-lived secret: niet delen buiten deze context, niet in git-getrackte bestanden opslaan.

Oorspronkelijke bevinding (2026-08-18, nu deels achterhaald — zie correctie): Huddle (thehuddle.nl, het platform achter Sanders community Dart Buddies) heeft geen publieke API, geen MCP-server, geen manier om geautomatiseerd posts/aankondigingen te plaatsen, geen "nieuw bericht"-trigger/webhook, en geen ingebouwde AI-moderator of auto-reply-bot. Bevestigd door Martonny (Huddle Platform Specialist) op 2026-08-18 via de officiële help center (help.thehuddle.nl) en de Algemene Voorwaarden (versie 11-10-2024). **Dit klopt nog steeds voor community-posts/moderatie — alleen de e-learning-content-kant bleek dus wél API-toegankelijk.**

Let op verwarring: Huddle.com/Huddle.net (Brits, Ideagen) heeft wél een developer-API, maar dat is een ander bedrijf — niet relevant voor thehuddle.nl.

Wat wél bestaat: gebruikersbeheer-automatisering (inbound webhook + Zapier voor account/toegang aanmaken-verwijderen), en in gesloten bèta "Global Automations" voor automatische privéberichten bij triggers als toegangsniveau-wijziging of cursusvoltooiing — geen van beide raakt community-content of ledenreacties. "Huddle Coach" (Premium/Ultimate) beantwoordt alleen vragen over eigen lesmateriaal, geen communitymoderatie.

**Why:** Sander wil Dartbuddies voeden met content en reageren op leden om de community levend te houden — dit is een terugkerend doel, geen eenmalige vraag. Directe API/MCP-automatisering is technisch niet mogelijk op het platform zelf.

**How to apply:** Voor community-posts/moderatie/auto-reply blijft gelden: geen directe API-route, denk in twee sporen — (1) LLM-assisted maar mens-in-de-loop, of (2) browser-automatisering met het juridische risico (ToS art. 4.7c/8.2b, anti-omzeiling) expliciet benoemd. Voor **e-learning-content** (cursussen/modules/lessen/oefeningen) geldt dit niet meer: gebruik de bevestigde API-endpoints hierboven met een zelf aangemaakte personal-access-token, geen browserscraping nodig. Check bij een nieuwe endpoint-behoefte eerst het netwerkverkeer van de admin-SPA (via de browser-devtools/read_network_requests) voordat je endpoints gokt — de structuur is voorspelbaar (`/api/v3/...`, `/api/v4/e-learning/...`) maar ongedocumenteerd, dus verificatie per endpoint blijft nodig. Volledig rapport met bronnen: vraag Martonny of zoek "Huddle-automatisering" in Team Knowledge.

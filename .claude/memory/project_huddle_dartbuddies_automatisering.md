---
name: project-huddle-dartbuddies-automatisering
description: Huddle (thehuddle.nl) heeft geen API/MCP/webhook-events voor community-content of auto-reply — relevant voor elk toekomstig Dartbuddies-automatiseringsverzoek
metadata: 
  node_type: memory
  type: project
  originSessionId: 0ad47f3c-8cca-44ea-a20f-53d915fee289
  modified: 2026-08-18T20:04:25.969Z
---

Huddle (thehuddle.nl, het platform achter Sanders community Dart Buddies) heeft geen publieke API, geen MCP-server, geen manier om geautomatiseerd posts/aankondigingen te plaatsen, geen "nieuw bericht"-trigger/webhook, en geen ingebouwde AI-moderator of auto-reply-bot. Bevestigd door Martonny (Huddle Platform Specialist) op 2026-08-18 via de officiële help center (help.thehuddle.nl) en de Algemene Voorwaarden (versie 11-10-2024).

Let op verwarring: Huddle.com/Huddle.net (Brits, Ideagen) heeft wél een developer-API, maar dat is een ander bedrijf — niet relevant voor thehuddle.nl.

Wat wél bestaat: gebruikersbeheer-automatisering (inbound webhook + Zapier voor account/toegang aanmaken-verwijderen), en in gesloten bèta "Global Automations" voor automatische privéberichten bij triggers als toegangsniveau-wijziging of cursusvoltooiing — geen van beide raakt community-content of ledenreacties. "Huddle Coach" (Premium/Ultimate) beantwoordt alleen vragen over eigen lesmateriaal, geen communitymoderatie.

**Why:** Sander wil Dartbuddies voeden met content en reageren op leden om de community levend te houden — dit is een terugkerend doel, geen eenmalige vraag. Directe API/MCP-automatisering is technisch niet mogelijk op het platform zelf.

**How to apply:** Stel geen nieuwe API/MCP-integratie met Huddle voor zonder eerst te checken of Huddle inmiddels een private developer-API is gaan aanbieden (open vraag aan Huddle-support, zie [[Deliverables/2026-07-14-huddle-specialist-hire-research]]). Denk bij automatiseringsverzoeken voor Dartbuddies in twee sporen: (1) LLM-assisted maar mens-in-de-loop (concepten genereren, Sander plaatst handmatig), of (2) browser-automatisering via de UI — met het juridische risico (ToS art. 4.7c/8.2b, anti-omzeiling) expliciet benoemd, niet verzwegen. Volledig rapport met bronnen: vraag Martonny of zoek "Huddle-automatisering" in Team Knowledge.

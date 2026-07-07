---
agent_id: harmonia
session_id: dartscoaching-brand-system-populated
timestamp: 2026-07-07T11:45:00Z
type: end-of-session
linked_sops: [SOP-006-author-a-design-system]
linked_workstreams: []
linked_guidelines: [GL-003-design-system]
---

# DartsCoaching.nl brand file volledig gepopuleerd via SOP-006

## Context

Eerste sessie na de multi-merk-herstructurering van GL-003 (zie eerdere sessie-log/commit: hub + `GL-003-brands/` map + Charta/Pixel/Bezalel/Nemesis bijgewerkt naar merk-eerst-model). DartsCoaching.nl was de aanbevolen eerste brand om te populeren omdat Dart Buddies ervan erft.

## Wat er is gebeurd

- **Bestaande stijlgids gevonden** op de Lexar SSD Mediahub (`01_Dartscoaching/02_Content/stijlgids dartscoaching 2026.png`) — een volledig uitgewerkte visuele brandkit. Grootste deel van de sessie bestond uit het overnemen van deze al bestaande, bewuste merkkeuzes in plaats van opnieuw bevragen.
- **Identity:** merknaam vastgelegd als "DartsCoaching.nl" (Sanders keuze, consistent met de rest van het systeem, ook al toont het logo "DARTSCOACHING.NL"). Voice/tone uit de stijlgids overgenomen. Doelgroep-zin samen geformuleerd na verduidelijking dat DartsCoaching.nl dezelfde volledige persona-piramide bedient als Dart Buddies (niet een subset).
- **Color palette, Typography, Imagery style:** 1-op-1 overgenomen uit de stijlgids (rood/groen/lichtgroen kleursysteem, Montserrat/Open Sans, candid/lifestyle fotografie). Neutral 2-4 (tussenliggende grijstinten) en Icon style/family bewust open gelaten — de stijlgids definieert die niet, en Sander heeft ze niet aangevuld. Duidelijk gemarkeerd als "nog niet ingevuld", niet stilzwijgend gedefaulted.
- **Spacing scale:** Sander gaf aan het concept niet te kennen ("noob") — uitgelegd in gewone taal (basis-eenheid als bouwsteen, analogie met een setje vaste maten i.p.v. steeds los aanvoelen). Gekozen: 8px-basis, met de standaardladder (8/16/24/32/48/64/96).
- **Voice samples:** 3 voorbeeldzinnen voorgesteld (mail-opener, knoplabel, tagline) op basis van de bestaande tone-of-voice, door Sander geaccepteerd zonder wijziging.
- **Belangrijke correctie onderweg:** aanvankelijk aangenomen dat de bestaande 7-coach + 4-persona-avatarset (Nina/Bob/Weszley/Willie) exclusief voor Dart Buddies was. Sander corrigeerde: het is een **gedeelde basisset** voor beide merken; Dart Buddies voegt daar specifiek **extra figuren** aan toe (nog niet benoemd). Zowel `dartscoaching.md` §5 als `dartbuddies.md` §Overrides zijn hierop aangepast.
- **Nieuwe bron ontdekt, nog niet gearchiveerd:** `Team Inbox/Documents/dartscoaching personas.md` bevat de volledige 3D-avatar-generatieprompts (stijl-lock, per-persona beschrijvingen, huddle-composities, piramide-contentstrategie) voor Nina/Bob/Weszley/Willie. Referentie toegevoegd in `dartscoaching.md` §5, maar het bestand zelf staat nog ongefiled in Team Inbox — normaliter Penn's WS-001-domein, niet in deze sessie opgepakt.

## Cross-agent impact

- Charta en Pixel lezen vanaf nu automatisch `GL-003-brands/dartscoaching.md` zodra een taak expliciet "DartsCoaching.nl" als merk noemt.
- Dart Buddies (erft van dit bestand) krijgt alle bovenstaande wijzigingen automatisch mee, behalve de "Extra figuren"-override die nog open staat.
- Nog geen in-flight deliverables voor dit merk die herrenderd moeten worden — dit was de eerste populatie, geen wijziging op bestaande content.

## Nog open

- Neutral 2-4 (grijstinten) en Icon style/family in `dartscoaching.md` — pas invullen als een concreet gebruik (bijv. een website) daarom vraagt.
- Dart Buddies' "Extra figuren"-override — apart te bepalen in een toekomstige Dart Buddies-sessie.
- `Team Inbox/Documents/dartscoaching personas.md` nog niet gearchiveerd/gefiled.
- ADC Regio Oost en Van Gewoon Sander staan nog volledig leeg — logische vervolgsessies.

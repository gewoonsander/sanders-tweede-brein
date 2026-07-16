---
agent_id: hermes
session_id: martonny-tonnymart-platform-specialist-hires
timestamp: 2026-07-14T09:23:00Z
type: close-session
linked_sops: ["SOP-001-how-to-add-a-new-specialist", "SOP-014-refresh-platform-specialist-knowledge"]
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes"]
---

# Twee platform-specialisten aangenomen: Martonny (Huddle) en Tonnymart (Plug&Pay)

## Context

Sander wilde onboarding-video's gaan maken voor Dartbuddies-nieuwkomers. Bij het ophalen van bestaande kennis bleek eerst dat platformkennis over Huddle (het community-platform waar Dartbuddies op draait) nog nergens docs-grounded vastlag — dat leidde tot de wens om een specialist te hebben die de Huddle-documentatie 100% kent. Vandaar uitgebreid naar Plug&Pay, het checkout/billing-platform dat nauw met Huddle samenwerkt.

## What we did

- **Correctie bestaande kennis:** Sander corrigeerde een misattributie in de 4-juni-strategiemeeting-samenvatting — het is [[rik]] (niet [[darren-van-es]]) die instructie-/onboardingvideo's opneemt, op verzoek van Darren, en dit gaat niet over Huddle-onboarding specifiek (die blijft volledig Sanders eigen domein als "chef huddle"). Gecorrigeerd met zichtbare correctie-annotaties in [[2026-06-04-meetingverslag-dartscoaching-strategie]], [[darren-van-es]] en [[rik]] — geen stille overschrijving.
- **Athena** deed twee grondige research-passes: het Huddle help center (`help.thehuddle.nl/nl`, ~55/106 artikelen) → [[2026-07-14-huddle-specialist-hire-research]], en het Plug&Pay help center (`help.plugandpay.com/nl`, ~55/191 artikelen) → [[2026-07-14-plugandpay-specialist-hire-research]]. De tweede pass kruischeckte expliciet tegen de eerste en loste een discrepantie op: Plug&Pay's Customer Portal (self-service abonnement opzeggen) is normaal Ultimate-only, maar er is een gedocumenteerde Premium+Huddle-koppeling-uitzondering — relevant voor welk Plug&Pay-plan Dartbuddies daadwerkelijk nodig heeft.
- **Jethro** droeg via [[SOP-001-how-to-add-a-new-specialist]] twee specialisten aan: **Martonny** (Huddle Platform Specialist) en **Tonnymart** (Plug&Pay Platform Specialist) — wiki-contracten in `Team/`, Claude Code-shims in `.claude/agents/`, rijen in [[Team/agent-index]] en de roster in root-`AGENTS.md` (nu 14 specialisten).
- **Naamgeving:** eerste kandidaat "Compass" beviel Sander niet. Tweede voorstel "Martijn" (letterlijke voornaam van Huddle-medeoprichter Martijn van Tongeren) werd door Hermes gevlagd als risico op verwarring met een echt, herkenbaar persoon. Sander koos zelf een samentrekking: **Martonny** (Martijn+Tonny) voor Huddle, en later **Tonnymart** (Tonny+mart) voor Plug&Pay — geen van beide is de letterlijke naam van een echt persoon.
- **Bewuste scope-keuze:** Sander vroeg of Martonny ook Plug&Pay-kennis moest krijgen. Hermes adviseerde nee — dat zou precies de boundary-awareness verdunnen die als kerncompetentie in Martonny's contract staat (nooit Huddle- en Plug&Pay-tiers verwarren). Losse specialist gehired in plaats daarvan.
- **SOP-014-refresh-platform-specialist-knowledge** geschreven — een lichte, herhaalbare procedure (geen volledige her-crawl) om de twee kennisdossiers actueel te houden: artikel-index + pricing-pagina opnieuw scannen, alleen nieuw/gewijzigd diep lezen, dossier in-place bijwerken met changelog + correctie-annotaties, nooit stilzwijgend overschrijven.
- **Scheduled task** `refresh-huddle-plugandpay-knowledge` aangemaakt — kwartaal-cadans (14 jan/apr/jul/okt, eerstvolgende 14 oktober), voert SOP-014 automatisch uit voor beide dossiers en rapporteert substantiële wijzigingen proactief.
- Beide kennisdossiers kregen `last_verified`/`next_review`-frontmatter en een Changelog-sectie; SOPs-`INDEX.md` bijgewerkt (inclusief twee eerder ontbrekende rijen voor SOP-012/SOP-013 die al bestonden maar niet geregistreerd stonden).

## Decisions made

- **Vraag:** Moet Martonny ook Plug&Pay dekken, gezien de nauwe samenwerking?
  **Besluit:** Nee — aparte specialist (Tonnymart) hired, met een expliciete grensregel tussen beiden (Plug&Pay = commerce/billing/checkout, Huddle = alles binnen de community/leeromgeving), om tier-conflatie te voorkomen.
- **Vraag:** Hoe voorkomen we dat de specialisten' kennis achterloopt naarmate de platformen doorontwikkelen?
  **Besluit:** Kwartaal-cadans, volledig automatisch via scheduled task, met een lichte scan-eerst aanpak (niet elke keer een volledige her-crawl) en in-place updates met zichtbare changelog/correcties.
- **Vraag:** Specialist vernoemen naar een echt, herkenbaar persoon (Martijn van Tongeren, Huddle-medeoprichter)?
  **Besluit:** Nee — samentrekkingen (Martonny, Tonnymart) in plaats van de letterlijke voornaam, om verwarring met de echte persoon te voorkomen mocht output ooit gedeeld worden.

## Insights

- Het kruischeck-effect van twee aan elkaar gekoppelde platform-specialisten (Martonny + Tonnymart) leverde direct waarde op: de Customer Portal-tier-discrepantie was met één specialist alleen niet aan het licht gekomen.
- De correctie-annotatie-conventie (`> **Correctie (datum):** ...`) die al in `GL-003-brands/dartbuddies.md` bestond, bleek herbruikbaar als algemeen wiki-patroon — nu ook toegepast in meeting-samenvattingen (CRM-feitencorrectie) en in SOP-014 als vaste regel voor kennisdossier-onderhoud.

## Realignments

- Sander corrigeerde Hermes: niet Darren maar Rik neemt de instructievideo's op (op Darrens verzoek), en dit gaat niet over Huddle-onboarding — dat blijft volledig Sanders eigen domein. Vastgelegd in [[2026-06-04-meetingverslag-dartscoaching-strategie]].
- Sander wees de naam "Compass" af (te weinig passend) en vervolgens ook de naam "Martijn" (na Hermes' vlag over verwarring met de echte medeoprichter) — koos zelf voor de samentrekkingen Martonny en Tonnymart.

## Open threads

- [ ] De twee Dart Buddies brandkit-infographics (kleuren, buddy-rollen Buddy/Dave/Diva/Doggy, contentmapping) die Sander deelde zijn nog niet formeel verwerkt in `GL-003-brands/dartbuddies.md` en `PKM/Documents/dart-buddies-visuele-stijlgids-en-personas.md` — dat is de eerstvolgende stap, via Harmonia (SOP-006). Eén te verifiëren punt: het groen leest als `#35BF0E` op de infographic vs. DC's basiswaarde `#35BF0F`.
- [ ] Het oorspronkelijke verzoek — een concreet actieplan voor de Dartbuddies-onboardingvideo's zelf (script, volgorde, kanalen) — is nog niet gestart. Nu Martonny (Huddle-feiten) en Tonnymart (Plug&Pay-feiten) er zijn, kan dit met geverifieerde platformkennis onderbouwd worden.

## Next steps

- Route de twee brandkit-infographics naar Harmonia om GL-003-brands/dartbuddies.md en de stijlgids definitief bij te werken.
- Daarna: onboarding-video-actieplan opstellen, met Martonny als bron voor Huddle-onboarding-mechaniek (welkomstmail, toegangsniveaus, eerste-login-ervaring).

## Cross-links

- _(geen directe eerdere sessielog over dit onderwerp — eerste keer dat Dartbuddies-onboarding en platform-specialisten aan bod kwamen)_

---
id: 2026-07-07-design-video-tooling-kostenvergelijking
title: Design & video-tooling — kostenefficiënte flow per taaktype
status: brief
owner: athena
datum: 2026-07-07
---

# Design & video-tooling — kostenefficiënte flow per taaktype

## Executive summary

Sander's bestaande stack (Canva + MCP, Affinity, Cavalry, Google Workspace, Claude Pro/Code) dekt vrijwel alles wat de 6 YouTube-video's laten zien — en dekt het gratis of binnen bestaand tokenbudget. De enige structurele meerwaarde van externe tools zit bij **echte motion design** (Cavalry, al in bezit) en **programmatische/herhalende video** (Remotion, gratis op zijn schaal). Geen van de 6 video's rechtvaardigt een nieuw los abonnement. De grootste — niet eerder benoemde — vondst: Canva heeft in 2025-2026 zowel Affinity als Cavalry overgenomen en beide **volledig gratis** gemaakt. Sanders "sunk cost"-stack is dus per ongeluk een coherenter en goedkoper ecosysteem geworden dan de losse tool-ketens uit de video's, zonder dat hij iets hoefde te doen.

## Aanbevolen flow per taaktype

**A. Statische posters/infographics/social-graphics**
Charta bouwt structuur (Haiku-tier, goedkoop) → Canva MCP (`create-design-from-brand-template` / brand kit) voor het eindproduct, tegen $0 extra kosten. Voor benodigde beelden binnenin: Nano Banana 2 gratis (via het Gemini-account onder Google Workspace Business Standard) — geen extra abonnement nodig zolang het volume laag blijft (gratis tier: ~20 beelden/dag). Claude Design's "Document"-feature is een geldig alternatief voor een losse one-pager wanneer snelheid boven brand-consistentie gaat, maar bouw er geen structurele afhankelijkheid op — het is jonger en minder onder Sanders eigen controle dan zijn Canva-stack.

**B. Carrousels/meerdere-slides content**
Charta voor lay-out/consistentie over slides, Canva MCP's `resize-design` voor het multi-formaat-werk. Volg het herbruikbare 4-delig promptframework uit video 5 (type+merk, tekst/elementen, mood, kleurenpalet) als vaste Pixel-template — dat idee is bruikbaar los van welk model het uitvoert. Genereer eerst goedkoop (Nano Banana 2, al gratis) en reserveer een duurder model (GPT Image, via losse API-call, geen abonnement) alleen voor het écht merk-kritische hero-beeld.

**C. Korte animaties/motion graphics (logo, tekst, header)**
Voor triviale micro-animatie (logo fade-in, simpele tekstreveal): Claude Design's Animation-feature, $0 extra, blijft binnen het Claude-plan. Zodra er echte motion-controle nodig is (timing curves, procedurele rigs, herbruikbare merksjablonen): **Cavalry** — al in bezit, sinds april 2026 bovendien volledig gratis geworden onder Canva-eigenaarschap. Dit is de duidelijkste plek waar een extern tool het interne team (Charta/Pixel/Claude Design) overtreft — niemand daarvan doet keyframe/rig-gebaseerde motion graphics.

**D. Langere/cinematische video**
Dit is geen beeld-generatieprobleem. DaVinci Resolve (al vastgelegd in `Deliverables/2026-06-30-video-systeem-design.md`) blijft de montage-tool voor opgenomen beeldmateriaal; Cavalry voor cinematische titels/transities/lower-thirds daarbinnen. Remotion is de tweede kandidaat specifiek voor **programmatische, herhalende formats** (bv. een wekelijkse statistiekenkaart met wisselende data) — gratis voor Sander als solo-gebruiker, aangestuurd via Claude Code in natuurlijke taal. Blijf bij de eerdere afspraak: pas oppakken zodra er een herhalend format is, niet als eenmalige pilot. Geen van de AI-beeldtools uit de 6 video's (Nano Banana, GPT Image, Leonardo, Lovart) vervangt gemonteerde video — ze zijn beeld-, geen video-editingtools; die verwarring is het kernrisico in video 3's tool-keten.

## Kostenvergelijking

| Categorie | Tools | Kosten |
|---|---|---|
| Al in bezit / inbegrepen, $0 extra | Canva + Canva MCP, Affinity (gratis sinds Canva-overname), Cavalry (gratis sinds april 2026), Claude Design (draait op gedeeld Claude-planverbruik, geen apart credit-systeem meer) | €0 |
| Gratis op Sanders schaal | Remotion (gratis voor individuen/bedrijven t/m 3 personen — Sander valt daaronder), Nano Banana 2 via gewoon Gemini-account (~20 beelden/dag gratis tier), basis-Gemini-beeldgeneratie in Google Workspace Business Standard | €0, wel volume-plafonds |
| Kost tokens binnen bestaand Claude-budget | Charta/Pixel/Claude Code die Canva MCP of Remotion aansturen (Haiku-tier, goedkoop); wordt duur als per ongeluk via Bezalel (Opus-tier) gerouteerd | Geen nieuw geld, wel planlimiet-relevant |
| Nieuw, optioneel, alleen bij aantoonbare noodzaak | Google Workspace "AI Expanded Access" add-on (Nano Banana Pro hoger volume + Veo 3.1) | ~$20/gebruiker/maand — **niet nu starten**, pas als het gratis Nano Banana-plafond echt een bottleneck wordt |
| Afgeraden | Open Art-abonnement, losse Leonardo/Lovart/Pwish-abonnementen | Overbodig gezien wat al gratis is |

## Rolverdeling met het team

- **Charta** — bouwt structuur voor infographics/carrousels/slides. Check eerst of een Canva brand-template bestaat via de MCP-server vóórdat hij handmatig HTML/CSS optuigt — vaak sneller en al on-brand.
- **Pixel** — genereert/stileert beelden. SOP-009 noemt momenteel geen voorkeursmodel; aanbeveling: Nano Banana 2 (gratis) als standaard Path A/B-generator, GPT Image alleen voor uitzonderlijk merk-kritische enkelbeelden. Dit is een SOP-aanpassing voor Nolan/Silas om door te voeren, niet iets ik hier al schrijf.
- **Harmonia** — geen verandering in rol; wel de moeite waard om Canva's Brand Kit en Claude Design's "Design System" één keer te spiegelen aan GL-003, zodat externe tools automatisch on-brand opleveren zonder herhaalde briefing.
- **Bezalel** — blijft buiten poster/social/animatiewerk. Zijn Opus-tier is voor UI-code, niet grafisch werk; dit zou de duurste denkbare misrouting zijn binnen GL-015's tiering.

## Doe dit niet

1. **Geen Open Art-abonnement of losse keten (ChatGPT → Leonardo → Gemini → Lovart → Pwish, video 3)** — vijf logins/abonnementen voor iets dat Canva MCP + Nano Banana 2 (beide al gratis) grotendeels al dekt.
2. **Geen Google Workspace "AI Expanded Access" add-on nu afsluiten** — ~$20/maand speculatief kopen voordat het gratis Nano Banana-plafond (~20/dag) daadwerkelijk knelt, is voorbarig.
3. **Geen Remotion-pilot starten als eenmalige test** — blijft terecht geparkeerd tot er een herhalend format is (bevestigd in `2026-06-30-video-systeem-design.md`); niets in dit onderzoek verandert dat, het risico is nu alleen kleiner (nog steeds gratis op zijn schaal).
4. **Geen posters/social-graphics via Bezalel laten bouwen** — duur, verkeerde tier, Charta/Pixel + Canva MCP doen het goedkoper.
5. **Claude Design's Animation-feature niet verwarren met Cavalry/Remotion** — expliciet alleen micro-animatie (logo-fade), geen cinematische kwaliteit; niet als vervanger inzetten.

## Kritische kanttekeningen bij de 6 video's (single-source flags)

- **"Nano Banana 2 is het beste/netste model"** — dit is een claim van Google's eigen blog plus enthousiaste review-sites (aitoolanalysis, cybernews), geen onafhankelijke benchmark. **Low/Medium confidence.** Cross-check: bredere modelvergelijkingen (LaoZhang AI, Atlas Cloud) laten GPT Image 2 juist vóórlopen op merk-consistentie, en Grok Imagine op prijs/prestatie — "beste" is dus contextafhankelijk, niet eenduidig vastgesteld.
- **"Grok Imagine is 13x goedkoper dan GPT Image 2" (136 vs 10 credits, video 5)** — dat credit-systeem is intern aan het Open Art-platform en niet extern te verifiëren. De **richting** (Grok Imagine substantieel goedkoper dan GPT Image op hogere kwaliteitstiers) is wel cross-source bevestigd via onafhankelijke API-prijsvergelijkingen (GPT Image high-quality ≈ $0,21/beeld vs Grok Imagine ≈ $0,05-0,08/beeld), maar de exacte "13x" is niet herleidbaar buiten die ene video. **Medium confidence** op de richting, **low** op het exacte getal.
- **"Claude Design draait nu op normaal planverbruik"** — bevestigd, cross-source (Anthropic's eigen support-documentatie + onafhankelijke reviewsite), dus **high confidence**. Geen zorg hier.
- **"Affinity/Cavalry zijn nu gratis"** — bevestigd via meerdere onafhankelijke bronnen (Canva newsroom, CG Channel, TidBITS, techENT), **high confidence**.
- **Limora (video 6, "eigen tool van de maker")** — expliciet met een korrel zout genomen zoals al aangegeven in de brief; geen onafhankelijke verificatie gevonden, geen aanbeveling om dit op te pakken.

## Open vragen

- Exacte huidige rate-limits van Nano Banana 2 binnen Sanders specifieke Google Workspace Business Standard-licentie (het "20/dag"-cijfer komt uit algemene reviews, niet uit Sanders eigen tenant) — pas checken zodra volume daadwerkelijk een issue wordt.
- Of Canva MCP's exacte toolnamen (`generate-design`, `create-design-from-brand-template`) 1-op-1 overeenkomen met wat er nu in Sanders sessie beschikbaar is, kon niet los geverifieerd worden — de functionaliteit (brand-template, resize, export) is wel bevestigd te bestaan in Canva's officiële MCP-aanbod.

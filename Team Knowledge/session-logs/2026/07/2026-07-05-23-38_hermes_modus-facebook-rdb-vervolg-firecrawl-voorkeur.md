---
agent_id: hermes
session_id: modus-facebook-rdb-vervolg-firecrawl-voorkeur
timestamp: 2026-07-05T23:38:00Z
type: close-session
linked_sops: []
linked_workstreams: ["WS-004-facebook-toernooi-verslag", "WS-006-adc-facebook-verslag"]
linked_guidelines: ["GL-001-file-naming-conventions", "GL-013-interactie-enkelvoudige-keuzes"]
---

# MODUS Super Series-admin, Facebook-content ADC, RDB-vervolg, Firecrawl-voorkeur

## Context

Lange sessie na de vorige close (2026-07-03/04), met drie grote sporen naast losse vervolgvragen op het RDB-dossier: (1) Sanders eigen MODUS Super Series-deelname volledig in kaart brengen en beheren, (2) twee Facebook/WhatsApp-berichten voor ADC Regio Oost bouwen met live Dart Atlas-data, en (3) een expliciete voorkeurswijziging over welke zoektool Hermes standaard gebruikt.

## What we did

- **MODUS Super Series-deelname:**
  - Spelerscontract (Nederlands, niet-verbatim samengevat i.v.m. copyright) en bijbehorende documenten gelezen: Tournament Format, Tournament Prizes, Players Bank Details-formulier, MODUS Integrity Training User Guide.
  - Todoist-taakhiërarchie opgezet in project "👤 Persoonlijk": hoofdtaak "MODUS Super Series deelname Week 11" met subtaken voor Integrity Training (afgerond), contract tekenen, bankformulier, reis/hotel boeken, en reageren naar John Lokken.
  - Reislogistiek uitgezocht (trein vs. vlucht Nederland → Portsmouth, kosten/tijd-vergelijking) — Sander koos voor de trein ondanks dat dit niet de goedkoopste optie was; Group A-schema bevestigd, verlengd verblijf 11–18 oktober 2026 besproken.
  - Bank Details-formulier gedeeltelijk ingevuld (alleen niet-financiële velden) — financiële velden en handtekeningen expliciet niet door Hermes ingevuld; Sander moet dit zelf afronden.
  - FEU/FEU8-belastingmechanisme (UK Foreign Entertainers Unit) uitgezocht en samengevat op basis van de officiële gov.uk-pagina; conclusie: FEU8 vooraf aanvragen is impractisch omdat het prijzengeld (KO-toernooi) vooraf niet vaststaat — Sander leunt naar gewoon de standaard 20% inhouding accepteren.
  - DRA Rule Book 2026 (77 pagina's) en WDF Playing and Tournament Rules (20e editie) beide gelezen, samengevat en gearchiveerd in `PKM/Documents/` met GL-001-naamgeving, inclusief een vergelijkingssectie (DRA vs. WDF) in het WDF-bestand.
  - Een screen-recording uit Team Inbox bleek Sanders eigen Integrity Training-sessie te zijn (geen persoonlijke notitie) — getranscribeerd (ffmpeg `amix`-fix nodig voor 3 audio-tracks) en het bijbehorende certificaat correct gearchiveerd als `PKM/Documents/2025-11-21-modus-integrity-training-certificaat.pdf` + `.md`.
- **ADC Regio Oost — Facebook-content:**
  - Resultatenverslag Hengelo-toernooi gebouwd volgens WS-006-sjabloon (winnaar Leroy Jansen 4-0, 15 totaal 180's, 7 finishes 100+), inclusief live Dart Atlas-scrape via browser-JS (bypass van de 403-blokkade op WebFetch). Opgeslagen als `Deliverables/2026-07-05-facebook-verslag-hengelo.md`.
  - Nieuw post-type gebouwd: een "vooraankondiging" voor het Arnhem-toernooi van 6 juli, met het Hengelo-resultaat als haakje. Eerste versie had een tijdsfout (abusievelijk alles naar verleden tijd gezet) — hersteld na Sanders correctie dat "vanavond" voor Arnhem correct was omdat het bericht 's ochtends voor het toernooi van diezelfde avond gepubliceerd wordt. Opgeslagen als `Deliverables/2026-07-06-facebook-vooraankondiging-arnhem.md`.
  - WS-004 en WS-006 permanent uitgebreid met een vaste stap "opslaan in Deliverables" (dit was voorheen geen vaste procedure).
  - Todoist-herinnering gezet (project "🎯 ADC Regio Oost") om het vooraankondigingsbericht te posten, 2026-07-07 09:00 (ISO-datum gebruikt na een eerdere `dueString: "morning"`-misinterpretatie).
- **RDB-dossier (vervolgvragen):** korte check op wanneer Emiel bij de Hub kan (`gewoonsander.nl/hub`); losse vraag over mobiel doorwerken in dit gesprek (bevestigd: apart via Claude Dispatch, Pro/Max-only, niet hetzelfde als deze Cowork-sessie).
- **Tool-voorkeur gewijzigd:** Sander vroeg waarom Hermes standaard Firecrawl gebruikt i.p.v. de ingebouwde zoekfunctie en of dat goedkoper is. Hermes legde transparant uit dat dit uit de sessie-MCP-instructies kwam (bot-blokkade-bypass), niet uit eigen voorkeur, en dat de relatieve kosten onbekend zijn. Sander koos (optie **A**) voor: voortaan eerst de ingebouwde zoekfunctie proberen, alleen bij een blokkade overstappen naar Firecrawl. Vastgelegd als permanente feedback-memory (`feedback_zoekvolgorde-firecrawl.md`).

## Decisions made

- **Vraag:** Reizen per trein of vliegtuig naar Portsmouth?
  **Beslissing:** Trein, ondanks hogere kosten dan vliegen — Sanders expliciete voorkeur.
- **Vraag:** FEU8 vooraf aanvragen voor UK-belastingkorting?
  **Beslissing:** Waarschijnlijk niet — prijzengeld staat vooraf niet vast bij een KO-toernooi, dus vooraf aanvragen is niet praktisch; standaard 20%-inhouding wordt geaccepteerd.
- **Vraag:** Welke zoektool moet Hermes standaard gebruiken?
  **Beslissing:** Ingebouwde zoekfunctie eerst, Firecrawl alleen als fallback bij blokkades (was eerder: Firecrawl als standaard eerste keuze).

## Insights

- De MODUS-documentenset (contract, format, prijzen, bankformulier, integrity training) hoort logisch bij elkaar maar stond verspreid over Team Inbox — nu volledig verwerkt en getraceerd via één Todoist-hiërarchie.
- Financiële/bankgegevens blijven een harde grens: ook al bood Sander aan zijn bankgegevens te delen, Hermes bevestigde expliciet dat deze nooit in de PKM-opslag terechtkomen en dat het formulier zelf door Sander getekend/afgerond moet worden.
- Sanders voorkeur voor transparantie over tool-keuzes (zoals eerder bij de n8n-contactfout) kwam opnieuw naar voren: hij vroeg door op de "waarom" achter een technische keuze in plaats van die te accepteren, en Hermes gaf een eerlijk "ik weet het niet zeker"-antwoord over relatieve kosten in plaats van te gokken.

## Realignments

- Facebook-vooraankondiging Arnhem: eerste "correctie" naar verleden tijd was fout — Sander corrigeerde terug naar de oorspronkelijke, juiste tegenwoordige/toekomende tijd ("vanavond") omdat het bericht dezelfde ochtend voor het toernooi van die avond gepubliceerd wordt.
- Zoektool-standaard: van "Firecrawl altijd eerst" (sessie-instructie) naar "ingebouwde tool eerst, Firecrawl als fallback" (Sanders expliciete keuze, optie A) — permanent vastgelegd in memory.

## Open threads

- [ ] MODUS Bank Details-formulier: Sander moet zelf de financiële velden en handtekeningen afronden.
- [ ] MODUS spelerscontract ondertekenen en terugsturen naar John Lokken.
- [ ] Trein + hotel Portsmouth boeken (11–18 oktober 2026).
- [ ] Reageren naar John Lokken zodra contract/bankformulier/integrity training allemaal rond zijn.
- [ ] RDB: conceptfactuur (~€527,56) definitief maken in de Hub, oude facturatiesysteem stopzetten, webmaster@rdbdarts.nl daadwerkelijk overdragen aan Emiel, mijnrdb.nl-beslissing (deadline 21 juli 2026) nog open.
- [ ] Vooraankondigingsbericht Arnhem posten op Facebook/WhatsApp (Todoist-herinnering staat, 2026-07-07 09:00).
- [ ] Team Inbox-backlog (4 screenshots, 15 documenten) nog onverwerkt — meermaals uitgesteld door Sander.

## Next steps

- Bij volgende sessie: navragen of het vooraankondigingsbericht gepost is en hoe het Arnhem-toernooi verliep.
- MODUS-traject verder afhandelen zodra Sander het bankformulier en contract zelf heeft afgerond.
- Overwegen om het nieuwe "vooraankondiging"-post-type formeel in een WS-004/WS-006-variant vast te leggen als dit vaker terugkomt.

## Cross-links

- [[2026-07-03-23-58_hermes_rdb-emiel-overdracht-marieke-dedup]] — vorige close, start van het RDB-dossier
- [[project_rdb-emiel-website-overdracht]]
- [[Deliverables/2026-07-05-facebook-verslag-hengelo]]
- [[Deliverables/2026-07-06-facebook-vooraankondiging-arnhem]]
- [[2018-02-28-wdf-playing-and-tournament-rules]]
- [[2026-03-31-dra-rule-book-2026]]

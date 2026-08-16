---
title: Software & Tools
doc_type: inventory
tags:
  - tooling
  - software
  - abonnementen
---

# Software & Tools

Overzicht van software en digitale tools die Sander actief gebruikt — inclusief licentievorm en context.

**Registratie-afspraak:** zodra een specialist iets nieuws installeert op een van Sanders apparaten (een command line-programma, een los stukje software, een nieuwe koppeling) komt hier een kort blokje bij: wat het is, waarom het is geïnstalleerd, en op welk apparaat. Dat voorkomt dat we later niet meer weten wat er allemaal staat, of dat iemand per ongeluk hetzelfde nog een keer installeert. Simpele taal, geen technisch jargon nodig — Sander hoeft dit bestand te kunnen lezen zonder alles te begrijpen.

## Command line-tools

_(lokale programma's zonder abonnement, meestal via Homebrew geïnstalleerd — hier komen ze te staan zodra iemand ze installeert)_

### rclone
- **Wat het is:** een gratis programma dat grote bestanden rechtstreeks van/naar Google Drive (en andere cloudopslag) kan verplaatsen, zonder dat het via een chatgesprek hoeft — nodig omdat de normale Drive-koppeling alleen kleine bestanden aankan.
- **Waarom geïnstalleerd:** de Drive-koppeling in Cowork kon geen video's van meerdere GB overzetten naar de Mediahub; rclone praat rechtstreeks met Google's servers en heeft die beperking niet.
- **Apparaat:** MacBook Air (geïnstalleerd 2026-08-15 via Homebrew)
- **Status:** actief en gekoppeld aan Sanders Google-account (ingelogd 2026-08-16 via zijn eigen, al-ingelogde browsersessie)
- **Let op:** gebruikt rclone's gedeelde Google-inlogsleutel, die in de loop van 2026 wordt uitgefaseerd — kan dan een keer opnieuw ingesteld moeten worden met een eigen sleutel
- **Ook nodig op:** Mac mini, voor dezelfde reden (nog niet gedaan)

## Design & Creatie

### Affinity (Serif)
- **Apps:** Affinity Photo, Affinity Designer, Affinity Publisher
- **Licentie:** *aanvullen — V2 Universal of losse apps?*
- **Gebruik:** professionele designsoftware als alternatief voor Adobe
- **Workflow:** wordt gebruikt in combinatie met [[PKM/CRM/Organizations/canva|Canva]]

### Canva
- **Type:** Canva Pro (betaald abonnement)
- **Facturering:** jaarlijks via sander@gewoonsander.nl
- **Gebruik:** social media, presentaties, snelle designs
- **MCP-koppeling:** beschikbaar in Cowork (Hermes kan direct ontwerpen maken/aanpassen)
- **Meer info:** [[PKM/CRM/Organizations/canva]]

## Data & AI

### Firecrawl
- **Type:** Betaald abonnement + API-sleutel
- **Gebruik:** websites omzetten naar LLM-ready data (markdown/extractie/crawling) voor AI-workflows
- **API-sleutel:** staat in `Team Knowledge/.env` als `FIRECRAWL_API_KEY`
- **MCP-koppeling:** beschikbaar in Cowork als `firecrawl-mcp` (Hermes kan direct websites crawlen/scrapen)
- **Meer info:** [[PKM/CRM/Organizations/firecrawl]]

## Hosting & Web

### WPMU Dev
- **Type:** Dedicated hosting + premium plugins
- **Gebruik:** hosting voor RDB-website (rivierenlanddartsbond.nl) en andere WordPress-projecten
- **Dashboard:** bevat DNS-koppeling, statistieken, spamfilters, plugin-beheer

## Marketing, formulieren & intake

### Formflow
- **Type:** Legacy lifetime-deal
- **Account:** workspace `gewoonsander`
- **Gebruik:** interactieve formulieren en leadfunnels met conditionele paden,
  kwalificatie, scoring/berekeningen, analytics en webhooks
- **Aanbevolen inzet:** DartsCoaching-intake, Dart Buddies-onboarding,
  workshopaanvragen en Darttactiek-quizzes
- **Meer info:** [[PKM/CRM/Organizations/formflow|Formflow]] en
  [[2026-08-11-formflow-onderzoek]]

## Notities

- Canva heeft ook een eigen org-entry in CRM — die kan op termijn worden samengevoegd met dit bestand

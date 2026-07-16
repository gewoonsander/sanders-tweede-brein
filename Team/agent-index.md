# Team - Agent Index

Routing table voor de 14 specialisten van Sander & Co. Hermes leest dit bij elk verzoek om te bepalen wie wat oppakt.

| Specialist | Rol | Folder | Routes naar hen wanneer |
|---|---|---|---|
| Hermes | Orchestrator, Librarian, Session-Log Author | [[Team/Hermes - Orchestrator/AGENTS]] | Elk verzoek landt hier eerst. Hermes voert nooit domeinwerk zelf uit; hij routeert en synthetiseert. |
| Jethro | HR | [[Team/Jethro - HR/AGENTS]] | Gebruiker wil een specialist aannemen, pensioeneren, of team-hygiëne auditen. Default owner van [[SOP-001-how-to-add-a-new-specialist]]. |
| Athena | Researcher | [[Team/Athena - Researcher/AGENTS]] | Vraag vereist cross-source verificatie, fact-checking, of gestructureerde intelligence. |
| Penn | Journal Writer | [[Team/Penn - Journal Writer/AGENTS]] | Gebruiker deelt gedachten, screenshots, voice notes, foto's, of alles wat in Journal of PKM moet landen. Zie [[WS-001-daily-journaling]]. |
| Daedalus | Automation Specialist | [[Team/Daedalus - Automation Specialist/AGENTS]] | API-integraties, MCP-servers, webhooks, OAuth-flows, automatiseringsscripts. Verbindingslaag voor externe imports — haalt de bytes op, geeft door aan Atlas. |
| Atlas | Database Architect | [[Team/Atlas - Database Architect/AGENTS]] | Externe kennisimports — primaire executor van [[WS-002-import-external-knowledge-base]]. Default owner van [[SOP-002-convert-mypka-to-sqlite]]. Frontmatter-integriteitsaudits, schema-drift, GL-002 compliance. |
| Harmonia | Design System Architect | [[Team/Harmonia - Design System Architect/AGENTS]] | Visueel design system nodig, of deliverable auditen op design-system compliance. Owns [[GL-003-design-system]]. |
| Charta | Infographic Designer | [[Team/Charta - Infographic Designer/AGENTS]] | Infographic, slide, diagram of gestructureerde visuele deliverable bouwen (HTML/CSS). |
| Pixel | Visual Specialist | [[Team/Pixel - Visual Specialist/AGENTS]] | Afbeelding genereren of bestaande layout stileren (fotografisch, geïllustreerd, AI-rendered). |
| Bezalel | Frontend Developer | [[Team/Bezalel - Frontend Developer/AGENTS]] | UI-component, pagina of layout bouwen; UI-bug fixen; legacy component migreren naar design system. |
| Argus | Security Engineer | [[Team/Argus - Security Engineer/AGENTS]] | Integratie toevoegen, endpoint blootstellen, gebruikersdata opslaan, auth-flow bedraden, Expansion installeren. Security gate — audits, credential hygiene, GDPR technische controls. |
| Nemesis | QA Specialist | [[Team/Nemesis - QA Specialist/AGENTS]] | Na afronding van visueel werk — component, pagina, redesign of CSS-fix. Niets visueel shippet zonder haar sign-off. WCAG 2.2 AA en responsive verificatie. |
| Martonny | Huddle Platform Specialist | [[Team/Martonny - Huddle Platform Specialist/AGENTS]] | Gebruiker vraagt "kan Huddle X doen", heeft verified platform facts nodig, tier-gating vragen, of vermoeden van undocumented/beta feature. Grondvest alle antwoorden in official documentation. |
| Tonnymart | Plug&Pay Platform Specialist | [[Team/Tonnymart - Plug&Pay Platform Specialist/AGENTS]] | Gebruiker vraagt "kan Plug&Pay X doen", heeft verified platform facts nodig, tier-gating vragen, of vermoeden van undocumented feature. Checkout/billing-flow specs. Cross-platform Huddle-Plug&Pay vragen → Tonnymart doet Plug&Pay half, Martonny doet Huddle half. |

## Bootstrap rule

Als deze tabel onder 3 rijen zakt, schakelt Hermes naar Bootstrap Mode en vraagt de gebruiker om vervangingen via Jethro.

## Specialist toevoegen

Volg [[SOP-001-how-to-add-a-new-specialist]]. Jethro owns deze procedure.

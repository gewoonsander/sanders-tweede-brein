---
agent_id: hermes
session_id: team-rebranding-avatars-cockpit-fixes
timestamp: 2026-06-28T18:00:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-001-file-naming-conventions"]
---

# Team rebranding naar Sander & Co + 12 specialisten-avatars gegenereerd

## Context

Sander startte de sessie met een defecte N8N Google Calendar iCal-feed. Vanuit daar groeide de sessie uit tot een volledige rebranding van het team: nieuwe naam ("Sander & Co"), nieuwe mythologische/Bijbelse namen voor alle 12 specialisten, en het genereren van iconische emblem-avatars voor elk teamlid via Canva MCP.

## What we did

- **Hermes** herstelde de N8N Google Calendar-koppeling: credential opnieuw verbonden (door Sander), DTSTART-tijdnotatie gecorrigeerd van `+0200` offset naar UTC `Z`-formaat zodat node-ical correct parsete.
- **Hermes** schoonde Team Inbox en Deliverables volledig op: vcf-bestanden (dubbele contacten), plattegronden, testopnames en losse bestanden verwijderd. Momento mori PNG + context verplaatst naar `PKM/My Life/Credo/`.
- **Hermes** loste badge-telprobleem op in `server.js`: README.md werd meegeteld → uitgefilterd met `.toLowerCase() !== 'readme.md'`.
- **Hermes** verborg Fleeting Notes uit de Cockpit-sidebar via `SHOW_FLEETING_NOTES = false` constante in `Sidebar.tsx`.
- **Hermes** hernoemde de Cockpit van "myPKA Cockpit" naar "Tweede Brein Cockpit" in `Sidebar.tsx`, `index.html` en `PinLogin.tsx`.
- **Hermes** hernoemde het team van "Gewoon Basis" naar "Sander & Co" in `CLAUDE.md` en `AGENTS.md`.
- **Hermes** hernoemde alle 12 specialisten met mythologische/Bijbelse namen (zie Beslissingen) in `AGENTS.md`, `CLAUDE.md`, `.claude/agents/*.md` en `mypka.db`.
- **Hermes** genereerde iconische emblem-avatars voor alle 12 teamleden via Canva MCP (`generate-design` → `create-design-from-candidate` → `export-design` → `curl` download). Avatars opgeslagen in `Team/avatars/<naam>.png` en gekoppeld in `mypka.db`.

## Decisions made

- **Vraag:** Welke namen krijgen de 12 specialisten?
  **Beslissing:** Mythologische/Bijbelse namen gekozen door Sander, één voor één:
  - Orchestrator: **Hermes**
  - Journal Writer: **Penn** (behouden)
  - Senior Researcher: **Athena**
  - HR/Talent: **Jethro**
  - Automation Specialist: **Daedalus**
  - Database Architect: **Atlas**
  - Design System Architect: **Harmonia**
  - Infographic Designer: **Charta**
  - Visual Specialist: **Pixel** (behouden)
  - Frontend Developer: **Bezalel**
  - QA Specialist: **Nemesis**
  - Security Engineer: **Argus**

- **Vraag:** Welke avatar-stijl voor het team?
  **Beslissing:** Iconic/emblem-stijl (niet portret, niet flat illustration) — badge-achtige symbolen die werken als profielavatar op donkere UI-achtergrond.

- **Vraag:** Moet Fleeting Notes zichtbaar zijn in de sidebar?
  **Beslissing:** Nee, verborgen via `SHOW_FLEETING_NOTES = false`. Route blijft actief, alleen navigatie-item verdwijnt.

- **Vraag:** Hoe heet de Cockpit voortaan?
  **Beslissing:** "Tweede Brein Cockpit" — reflecteert dat het de cockpit van Sanders tweede brein is, niet een generieke PKA-tool.

## Insights

- Het N8N node-ical pakket accepteert geen tijdzones als `+0200` offset — tijden moeten als UTC `Z` worden aangeleverd. Omzetting via `new Date(isoStr).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')` werkt betrouwbaar.
- De avatar-route in `server.js` is gejaild naar de `Team/`-directory via `containedTeamPath()` — avatars moeten dus altijd in `Team/avatars/` staan, niet in `PKM/Images/`.
- macOS `sed` ondersteunt geen `\b` word-boundaries betrouwbaar — gebruik Python `re.sub()` voor veilige tekstvervanging in grote bestanden.
- Canva MCP `create-design-from-candidate` vereist zowel `job_id` als `candidate_id` — `job_id` ontbreekt in de basisdocumentatie maar is verplicht.

## Realignments

- Sander merkte op dat Hermes de 12 specialisten zelf had moeten kennen vanuit de scaffold-update, zonder dat Sander hem daaraan hoefde te herinneren. Hermes erkent dit als lacune in het bijhouden van scaffold-wijzigingen over sessiegrenzen.

## Open threads

- [ ] Agent-bestanden (`.claude/agents/*.md`) bevatten nog oude namen in de bodytekst (referenties naar "Larry", "Pax", etc.). Updaten naar nieuwe namen in een volgende sessie.
- [ ] `Team/agent-index.md` controleren en bijwerken naar nieuwe specialisten-namen.
- [ ] Cockpit herstarten / refreshen om alle nieuwe avatars live te zien in de roster.

## Next steps

- Cockpit openen en roster controleren: alle 12 avatars zouden zichtbaar moeten zijn.
- Agent-bestanden bodytekst updaten (oude namen vervangen).
- Eventueel: weekeinde/zaterdag-zondag toevoegen aan de Cockpit-kalenderweergave (Sander vroeg hier eerder naar maar de sessie ging andere kant op).

## Cross-links

- `[[2026-06-28-15-30_larry_cockpit-connector-audit]]` — vorige sessie: Cockpit connector-audit
- `[[2026-06-28-14-00_silas_app-developer-pack-and-cockpit-install]]` — scaffold update + pack install waaruit de 12 specialisten kwamen

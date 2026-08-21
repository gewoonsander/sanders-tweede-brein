# Team Knowledge - Master Hub

This is the operations side of your myPKA. It holds the team's procedures, orchestrations, reference material, and session history. The user's personal knowledge lives in [[PKM/INDEX]].

## Sections

- **[[Team Knowledge/SOPs/INDEX|SOPs]]** — agent skills. Canonical step-by-step procedures, one job per file, LLM-agnostic and reusable across agents. Each SOP has a default owner, but any agent can invoke it. Think of SOPs the way Claude skills work. Filenames: `SOP-NNN-<title>.md`.
- **[[Team Knowledge/Workstreams/INDEX|Workstreams]]** — multi-agent compositions. Recurring orchestrations where more than one specialist collaborates. Workstreams string SOPs together — think of them the way Claude plugins compose skills. Emergent: the scaffold ships only canonical day-1 flows; new Workstreams get authored when a pattern repeats. Filenames: `WS-NNN-<title>.md`.
- **[[Team Knowledge/Guidelines/INDEX|Guidelines]]** — general rules every agent reads. Static constraints (naming, frontmatter, design system) that SOPs and Workstreams `[[wikilink]]` to rather than duplicate. Filenames: `GL-NNN-<title>.md`.
- **session-logs/** — append-only record of every working session, written by Hermes. Path: `session-logs/YYYY/MM/YYYY-MM-DD-<slug>.md`.

## Taxonomy in plain English

- An **SOP** is an agent skill. It answers "how do I do X?" in clear steps. Like a Claude skill — discrete, named, callable. Default owner runs it most often; any agent can invoke it.
- A **Workstream** is a multi-agent composition. It answers "how do we deliver X together, recurring?" Like a Claude plugin — strings skills into a flow. Ships only when the pattern is canonical; new ones emerge from repeated session-log patterns.
- A **Guideline** is a general rule. It answers "what is the rule for X?" Static reference every relevant agent reads. Never a procedure.

When in doubt: write a Guideline first if the rule is static. Write an SOP if the procedure has steps and one default owner. Write a Workstream only when more than one specialist is involved AND the pattern repeats.

## SSOT applies here too

If naming rules belong in [[GL-001-file-naming-conventions]], do not restate them inside an SOP or Workstream. Link to the Guideline instead.

## Cross-session learnings

When the team learns something durable across sessions, Hermes appends it to a "Cross-session learnings" section at the bottom of this file. Session-specific notes stay in the session log under `session-logs/YYYY/MM/`.

### Cross-session learnings

(empty on day one - Hermes fills this as the team operates)

**2026-06-12 — PKM/Documents naamconventie**
Bestanden die Larry of Penn aanmaken in `PKM/Documents/` krijgen ALTIJD een ISO-datumprefix: `YYYY-MM-DD-<slug>.md`. De datum is de datum van het brondocument (offerte, rapport, mail), niet de verwerkingsdatum. Wikilinks in andere bestanden worden direct bijgewerkt bij hernoemen. Fout ontdekt in sessie 2026-06-12: bestanden waren aangemaakt zonder datumprefix en pas achteraf hernoemd.

**2026-07-02 — WPMU Dev Hub Client Billing accepteert geen negatieve prijsopties**
Bij het aanmaken van kortingsregels op facturen (bv. "korting op product X") accepteert het WPMU Dev Hub Client Billing-platform geen negatief bedrag in het prijsveld. Werkbare aanpak: zet het betreffende product/plan direct op €0,00 in plaats van een losse min-regel te tonen. Ontdekt tijdens het opzetten van de Heleen-factuur (zie [[project_praktijkvoluitleven-migratie]]).

**2026-07-02 — Team/-mapnamen liepen achter op root AGENTS.md-teamnaamgeving (opgelost)**
Root `AGENTS.md` beschreef het team al onder de nieuwe naamgeving (Hermes, Jethro, Athena, Daedalus, Atlas, Harmonia, Charta, Pixel, Bezalel, Argus, Nemesis), maar de fysieke `Team/`-map en de losse `AGENTS.md`-contracten daarin gebruikten nog de oude namen (Larry, Nolan, Pax, Mack, Silas, Iris, Felix, Vex, Vera). Later op 2026-07-02 opgelost: de 9 betreffende `Team/`-mappen zijn hernoemd, de inhoud van elk contract is bijgewerkt (self-references + peer-references), en alle levende verwijzingen zijn meegefixt (`.claude/agents/*.md`-shims, `GL-001`, `GL-003`, `SOP-006/007/009`, `WS-001`, `WS-003`). Historische sessielogs die de oude namen gebruiken zijn bewust ongewijzigd gelaten (append-only geschiedenis). Scaffold-template-documenten (`README.md`, `WAY-FORWARD.md`, `CHANGELOG.md`, `ADAPTER-PROMPT.md`, `Expansions/docs/expansion-spec.md`) beschrijven de basis-scaffold zelf, niet Sanders persoonlijke instantie, en zijn bewust buiten scope gelaten.

**2026-08-12 — De 2026-07-02 opschoning was onvolledig; teamnaam-cleanup in één pass afgerond**
De sessie-log-audit (zie `tsk-2026-08-08-001`) vond nog tientallen levende oude-naam-referenties die de 2026-07-02 pass had gemist: alle 6 resterende `.claude/agents/*.md`-shims, `SOP-001/002/004/005/009/010/011/012`, alle 6 `Workstreams/WS-00{1..6}`, beide `SOPs/INDEX.md` en `Workstreams/INDEX.md`, `Team/Jethro - HR/AGENTS.md` (stale bestandsverwijzing `silas.md` → bestaat niet meer, is nu `atlas.md`), `GL-002`, `GL-005`, en de volledige `Expansions/mypka-cockpit/`-engineeringdocumentatie (INSTALL.md, LOCAL-ADAPTATION.md, docs/, scripts/, sqlite-extension/ — Sanders eigen actieve product, geen generieke scaffold-tekst). Elke treffer is individueel beoordeeld, geen blind zoek-vervang. Bevestigd buiten scope gebleven: `GL-015` (bewuste "Nieuwe naam (Oude naam)"-mappingtabel, geen vergeten rename), historische `Deliverables/*.md` en `Deliverables/Audio-opname *.md` (gedateerde, point-in-time documenten — zelfde append-only-logica als sessielogs), verbatim YouTube-transcripties in `PKM/Documents/YouTube-Kennis/ICOR met Tom AI Productivity/` (het brongesprek van de maker gebruikt zelf nog Larry/Pax/Nolan — citaat, niet Sanders content), losse persoonsnamen die toevallig overlappen (`iris landeweer` in ADC-verslagen, `Larry` in `verbouwing-huismanstraat-34.md`), en twee bewuste provenance-verwijzingen in `Team/Athena - Researcher/AGENTS.md` die expliciet uitleggen dat de bronvideo's eigen Pax/Larry nu Athena/Hermes heten. Verificatie: repo-brede grep op de 9 oude namen geeft buiten deze uitzonderingen 0 treffers meer.

**2026-08-21 — Anthropic-cloud scheduled tasks blijken twee keer onafhankelijk stilzwijgend te verdwijnen**
De cloud-routine `refresh-huddle-plugandpay-knowledge` (SOP-014, aangemaakt 2026-07-14 volgens sessielog) bleek bij het opzetten van een vergelijkbare kwartaal-taak voor SOP-025 niet meer te bestaan: niet in de scheduled-tasks-lijst, geen map op schijf. Dit is het tweede onafhankelijke geval van hetzelfde falen — de `adc-oost-verslag-ochtend`-cloud-routine trof hetzelfde lot, ontdekt op 2026-08-11 (zie dat sessielog). Beide keren was de oplossing een lokale LaunchAgent op de Mac mini (`scripts/lib/launchd-guard.sh`-patroon) i.p.v. de cloud-scheduler. De les is nu vastgelegd als [[GL-005-llm-agnostic-portable-core]] Rule 5: elke terugkerende myPKA-automatisering hoort een lokale LaunchAgent te zijn, nooit alleen een cloud scheduled task. SOP-014 en SOP-025 zijn beide bijgewerkt naar het LaunchAgent-patroon.

## Active session log

The current session log lives in `session-logs/YYYY/MM/`. Hermes writes one per session at close.

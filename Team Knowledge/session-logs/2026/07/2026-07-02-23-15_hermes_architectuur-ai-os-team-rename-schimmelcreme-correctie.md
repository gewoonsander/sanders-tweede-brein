# Session Log - 2026-07-02 - Architectuurdiscussie AI OS, Team-rename, schimmelcrème-correctie

## Active tasks
- [x] RDB/Emiel-dossier: datumverificatie en status-inloggegevens gevraagd via AskUserQuestion — geen antwoord gegeven, Sander wisselde van onderwerp
- [x] Claude Code boot-sequence uitgelegd (research via claude-code-guide agent)
- [x] Architectuur van de myPKA zelf uitgelegd (lagen, taxonomie, datastroom)
- [x] Meerdere rondes architectuurkritiek/-sparring met Sander (die ondertussen ook met ChatGPT sparde) over een "AI Operating System"-model: Knowledge/Rules-Roles/Orchestrator/Validator/AI-Clients + Schema-Contract
- [x] Team/-mapnamen opgeschoond (Larry→Hermes, Nolan→Jethro, Pax→Athena, Mack→Daedalus, Silas→Atlas, Iris→Harmonia, Felix→Bezalel, Vex→Argus, Vera→Nemesis)
- [x] SOP-003/004/005 hernoemd naar nieuwe eigenaarsnamen (bezalel/argus/nemesis)
- [x] Taak aangemaakt voor resterende cosmetische PKM-naamvermeldingen, met voorkeur "terminal-sessie"
- [x] Schimmelcrème-habit gecorrigeerd: verkeerde product (Miconazolnitraat) vervangen door juiste (Terbinafine HCl 10 mg/g) na foto in Team Inbox; juiste doseerschema opgezocht en vastgelegd
- [x] Team Inbox-foto's verwijderd na expliciete bevestiging
- [x] Close-session journaal+habit-check uitgevoerd (eerste keer met de nieuw toegevoegde gecombineerde regel)

## What we did

**Architectuur-marathon.** Sander vroeg eerst een technische uitleg van Claude Code's boot sequence (met het oog op het repliceren van dezelfde werkwijze in ChatGPT/Gemini) — uitgezocht via de `claude-code-guide` agent plus eigen verificatie van zijn actuele `CLAUDE.md`/`AGENTS.md`/settings. Kernbevinding: zijn `CLAUDE.md` importeert `AGENTS.md` niet native (geen `@AGENTS.md`), maar verwijst er alleen naar via een platte instructiezin — dus AGENTS.md wordt gelezen omdat het model de instructie volgt, niet omdat het harnas het afdwingt.

Daarna volgde een uitgebreide architectuurdiscussie (Sander sparde parallel met ChatGPT en plakte antwoorden over en weer). Kernthema: is deze myPKA meer dan een PKA — een soort "AI Operating System"? Belangrijkste inzichten die standhielden na kritische toetsing:
- AGENTS.md is een *beschrijving* van de kernel, geen kernel die zelf handhaaft — bewezen door de GL-013-schendingen eerder deze sessie.
- Rules (AGENTS/SOP's/Guidelines) ≠ Roles (Team/-personages) — twee aparte handhavingsvraagstukken.
- Structurele validatie (broken links, naamconsistentie, taxonomie) is volledig deterministisch te automatiseren — geen AI nodig, en daarom de sterkste van de drie validatievormen.
- Een externe launcher/orchestrator lost de "bootstrapping-paradox" op (het model handhaaft nu zijn eigen opstartregels) door git-sync/inbox-check/context-opbouw *vóór* activatie te doen.
- Een centraal Schema/Contract (machine-leesbaar, niet alleen proza) als enige bron van waarheid voor Orchestrator + Validator + AI-clients — grotendeels al aanwezig maar versnipperd over GL-001/GL-002/AGENTS.md hard rules.
- Orchestrator-als-servicelaag tijdens de sessie (git-status, integrity-check, workflow starten) komt neer op bestaande tool-calling/MCP-patronen — laag technisch risico.
- Sander noemt het bewust een "werkarchitectuur", geen eindarchitectuur, pas te bewijzen met een tweede werkende client.

Sander vroeg vervolgens een noob-vriendelijke samenvatting + concrete eerste stap. Koos optie A: Team/-mapnamen opschonen.

**Team/-rename uitgevoerd.** 9 mappen hernoemd via `git mv`, inhoud (self- en peer-references) bijgewerkt, en alle direct-levende externe verwijzingen meegefixt (`.claude/agents/*.md`, GL-001, GL-003, SOP-006/007/009, WS-001, WS-003, `Team Knowledge/INDEX.md`). Bewust ongemoeid gelaten: historische session-logs en scaffold-template-documenten (README/WAY-FORWARD/CHANGELOG/ADAPTER-PROMPT/Expansions-spec).

Sander koos daarna optie B (SOP-bestandsnamen 003/004/005 hernoemen) i.p.v. optie C (brede PKM-cosmetica), met de expliciete instructie dat hij grotere/langere klussen zoals optie C wil bewaren voor een sessie waarin hij echt in Claude Code/de terminal werkt. Dit is vastgelegd als taak én als cross-sessie feedback-memory.

**Schimmelcrème-correctie.** Sander stuurde een foto van de daadwerkelijk gebruikte crème (Healthypharm Antischimmelcrème HTP Terbinafine HCl 10 mg/g, 15g) — dit bleek een ander middel dan eerder vastgelegd (Miconazolnitraat 20 mg/g). Bijsluiter opgezocht (medikamio.com): doseerschema is anders en korter dan gedacht (meestal 1x/dag, 1-2 weken i.p.v. 1-2x/dag, 2-6 weken). Habit-bestand gecorrigeerd. Team Inbox-foto's verwijderd na bevestiging.

**Eerste test van de nieuwe close-session habit-check** (toegevoegd aan AGENTS.md eerder vandaag): bij het sluiten is nu voor het eerst de gecombineerde journaal+habit-vraag gesteld. Sander bevestigde: crème vandaag aangebracht, niets voor het journaal.

## What the user realigned

- Bij "kun je de sessie sluiten" eerder vandaag: bedoelde het formele close-session-protocol, niet het letterlijk archiveren van de sessie (reeds vastgelegd in eerdere sessielog).
- GL-013 (keuzes altijd A/B/C): opnieuw expliciet gecorrigeerd, nu als hard cross-sessie feedback-memory vastgelegd.
- Nieuwe voorkeur: bij een "kort vs. lang"-keuze de lange optie als taak vastleggen voor een Claude Code/terminal-sessie, niet ad-hoc meenemen. Vastgelegd als feedback-memory.

## Decisions

- CLAUDE.md/AGENTS.md-relatie blijft voorlopig instructie-gebaseerd (geen `@AGENTS.md`-import) — geen actie ondernomen, alleen als bevinding gerapporteerd.
- Team/-mapnamen en SOP-003/004/005 volledig hernoemd naar de huidige teamnaamgeving.
- Bredere PKM-naamcosmetica bewust uitgesteld naar een taak, niet nu gedaan.
- mypka.db blijft voorlopig stale (mist `heleen-van-den-berg` en `maribel`) — herbevestigd tijdens dedup-check, geen actie (SOP-002-regeneratie is een aparte, grotere Atlas-klus).

## Deltas vs prior plan

- RDB/Emiel-dossier (datumverificatie, toegang regelen) is deze sessie niet verder gebracht — Sander wisselde naar de architectuurdiscussie en daarna naar de crème-correctie. Blijft open voor een volgende sessie.
- Darren: nog steeds niet expliciet gevraagd of hij morgen (2026-07-03) tijd heeft — blijft open in [[darren]].

## SSOT / structural fixes (Librarian pass)

- 9 `Team/`-mappen hernoemd + alle levende wikilinks gecorrigeerd (zie hierboven).
- 3 SOP-bestanden hernoemd (SOP-003/004/005) + alle wikilinks gecorrigeerd.
- `Team Knowledge/INDEX.md` — generieke "Larry doet X"-verwijzingen bijgewerkt naar Hermes; bestaande cross-session-learning-notitie over de Team/-drift bijgewerkt naar "opgelost".
- `Team Knowledge/tasks/INDEX.md` — herbouwd (was sinds 20 mei niet meer bijgewerkt), bevat nu de nieuwe open taak.
- Geen broken wikilinks, geen ontbrekende INDEX-entries gevonden buiten het bovenstaande.
- People-dedup-check (Duty 2c): geen duplicaten gevonden onder de 25 personen in `mypka.db`. Db blijft wel stale (2 ontbrekende personen) — bekend, niet opgelost deze sessie.

## Cross-links

- [[2026-07-02-18-10_hermes_heleen-factuur-verzonden-rdb-emiel-planning]] — vorige log vandaag
- [[project_rdb-emiel-website-overdracht]]
- [[darren]]
- [[schimmelcreme-gebruiken]]
- [[tsk-2026-07-02-001-pkm-oude-teamnamen-opruimen]]

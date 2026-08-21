---
agent_id: hermes
session_id: 2026-08-21-14-03-ndb-kennisarchief-cockpit-skills
timestamp: 2026-08-22T01:54:00+02:00
type: close-session
linked_sops: ["SOP-017-verwerk-voedingsregistratie"]
linked_workstreams: ["WS-001-daily-journaling"]
linked_guidelines: ["GL-002-frontmatter-conventions", "GL-013-interactie-enkelvoudige-keuzes", "GL-016-beslis-en-waarschuwingsblokken"]
---

# NDB-kennisarchief opgebouwd + cockpit skills-preview veilig klikbaar gemaakt

## Context

Sander vroeg een gedegen onderzoek naar de Nederlandse Dartsbond (reglementen, competities, selectie, LaCo, SuperLeague), uiteindelijk resulterend in een specialist die alles weet over de NDB. Onderweg kwam daar een tweede, ongepland traject bij: klikbare skills in de myPKA Cockpit-dashboard, wat een beveiligingsklus werd zodra bleek dat dit een nieuwe leesroute buiten de scaffold vereiste.

## Wat we deden

- **Daedalus** downloadde alle 35 documenten van `ndbdarts.nl/kennisbank/reglementen` (29 NDB-PDF's + 6 ISR-tuchtreglementen) naar `PKM/Documents/NDB-Kennis/bronnen/`, met volledig downloadlog.
- **Athena** (4 parallelle clusters) las en synthetiseerde alle 35 documenten, met expliciete "Onduidelijkheden"-secties per document — geen aannames.
- **Atlas** structureerde dit tot het definitieve kennisarchief (`PKM/Documents/NDB-Kennis/01-...` t/m `04-...` + `INDEX.md`), werkte `[[ndb-nederlandse-darts-bond]]` bij (feitcorrecties: "2x2 koppels" i.p.v. "4 koppels", kruisuitsluitingsregel SuperLeague↔LaCo).
- **Atlas** bouwde vervolgens de `/ndb-regels`-Skill (`~/.claude/skills/ndb-regels/SKILL.md`), naar het patroon van een parallel — door een andere, gelijktijdig actieve sessie — net gebouwde `/wdf-regels`-skill.
- Ontdekking tijdens dat traject: de myPKA Cockpit toont skills wél, maar skill-rijen waren niet klikbaar (in tegenstelling tot slash-commands) — een **bewuste** beveiligingsjail, geen bug (`~/.claude/skills/` ligt buiten de gejailde scaffold-leesroute).
- **Argus** ontwierp een nieuwe, strikt begrensde zesde jail specifiek voor `~/.claude/skills/<slug>/SKILL.md` (verdict GEEL, twee restrisico's die Sander expliciet accepteerde).
- **Bezalel** bouwde de route + frontend-wiring (twee keer onderbroken door verbindingsfouten, beide keren succesvol hervat zonder dataverlies).
- **Argus'** validatieronde vond een echte blokkerende bug (**B-9**): de kill switch (`COCKPIT_SKILL_FILES_ENABLED`) faalde open — `.env=0` werd nooit gelezen, de route bleef altijd aan. Bezalel fixte dit naar fail-closed (`readEnvKey`, uit tenzij expliciet `1`).
- Nog een restpunt (**B-11**): de launcher (`start-cockpit.command`) overrulede `.env` altijd met een hardcoded `=1`. Sander koos ervoor de launcher-waarde te verwijderen — `.env` is nu de enige bron van waarheid.
- **Nemesis** gaf GO/PASS op de UI-wijziging (live getest, niet alleen code-review; :4317 draaide een stale binary, dus een eigen dev-instance opgezet).
- Drie losstaande, buiten-scope bevindingen als taak-chips geflagd: systeembrede 404 op slash-command-bestandsrijen, ontbrekende boot-log-timestamp, en een derde inerte env-knop (`WORKBENCH_WRITE_ENABLED`/`PLAN_WRITE_ENABLED`, B-12).
- **fewer-permission-prompts**-skill gedraaid: 4 nieuwe read-only patronen voorgesteld (allowlist was al grotendeels compleet van eerdere runs); directe bewerking van `.claude/settings.json` werd geblokkeerd door de permissie-classifier — voorstel ligt klaar voor Sander om zelf toe te passen.
- Close-session snel: habits (schimmelzalf, bodylotion, 31x opgedrukt, 2 koffie + 1 bier) en voeding (patat/kipburger als avondeten, ontbijt+lunch als overgeslagen) van **vrijdag 2026-08-21** gelogd; journaalentry op **zaterdag 2026-08-22** per Sanders expliciete instructie.

## Decisions made

- **Vraag:** Skill of volwaardige Team-specialist voor NDB-kennis?
  **Besluit:** Skill (`/ndb-regels`), consistent met het net bewezen `/wdf-regels`-patroon — geen nieuwe `Team/`-map.
- **Vraag:** Kennisarchieven met afwijkende frontmatter-schema's (WDF-Kennis had 7 eigen velden)?
  **Besluit:** Migreren naar het standaard GL-002-schema — **nog niet uitgevoerd**, geblokkeerd omdat de bouwende sessie tijdens onze sessie nog live actief bleek (bevestigd via een nieuw bestand dat verscheen terwijl we keken).
- **Vraag:** Nieuwe leesroute voor skill-bestanden — uitbreiden van de bestaande `/api/cockpit/file`-jail, of een aparte route?
  **Besluit:** Aparte route (`/api/cockpit/skill-file`), Argus' aanbeveling — geen enkel codepad in de reguliere repo-dispatcher mag ooit naar `$HOME` kunnen wijzen.
- **Vraag:** Kill-switch-precedentie: launcher of `.env`?
  **Besluit:** `.env` als enige bron van waarheid (optie A) — voorspelbaarheid weegt zwaarder dan het gemak van "staat al aan out-of-the-box" bij een beveiligingsrelevante schakelaar.

## Insights

- Twee onafhankelijke sessies bouwden vandaag, parallel en zonder onderlinge afstemming, vrijwel identieke kennisarchief-skills (WDF vs. NDB) — sterk bewijs dat dit patroon (publieke reglementen-PDF's → lokaal kennisarchief → docs-grounded Skill) een terugkerende, waardevolle vorm is. Kandidaat om als herbruikbare procedure (SOP/WS) vast te leggen zodra een derde toepassing zich aandient.
- De cockpit-server had t/m vandaag vijf bewust ontworpen "jails", maar geen enkele met symlink-verankering — Argus toonde dit aan met een werkend exploit tegen het bestaande `PKM_DIR`-patroon. Los, buiten-scope beveiligingsgat (B-3), nog niet gefixt.
- Een env-var-toggle die alleen `process.env` leest terwijl de documentatie `Team Knowledge/.env` als bron noemt, is nu tweemaal in deze cockpit aangetroffen (B-9, en het niet-gefixte B-12) — vermoedelijk een structureel patroon dat het waard is in één keer over alle togglesin te controleren i.p.v. per-toggle te ontdekken.

## Realignments

- Sander corrigeerde een dubbelzinnig antwoord ("r1") tijdens een beslismoment over cockpit-restrisico's — bleek een verkorte manier om "7J" te bedoelen. Les: bij een letterlijke risico-ID als antwoord op een J/N-vraag, navragen in plaats van gokken.
- De Stop-hook (GL-013) blokkeerde één bericht omdat een gecombineerde vraag de vereiste geletterde opties miste ondanks een eerdere disclaimer-zin — herschreven met het genummerde multi-vraag-format. Bevestigt dat de hook geen uitzondering maakt voor "ik vroeg dit al eerder in dit gesprek".

## Open threads

- [ ] WDF-Kennis migreren naar het GL-002-schema (actie 5) — wachten tot de bouwende sessie zichtbaar klaar is (taak op "done", geen nieuwe bestanden meer).
- [ ] `.claude/settings.json` handmatig bijwerken met de 4 voorgestelde fewer-permission-prompts-patronen (zie chatgeschiedenis) — geblokkeerd door de permissie-classifier voor Hermes zelf.
- [ ] Sander moet zelf `COCKPIT_SKILL_FILES_ENABLED=1` toevoegen aan `Team Knowledge/.env` en de cockpit herstarten voordat de klikbare skills-preview werkt.
- [ ] Drie taak-chips staan klaar (404-bug slash-command-rijen, boot-log-timestamp, B-12 inerte env-knoppen workbench/planner) — nog niet opgepakt.
- [ ] Tweede onderzoeksronde NDB (competities/toernooien/agenda elders op ndbdarts.nl, plus historische ISR-versies en WADA-lijsten) — bewust uitgesteld, actie 1A.

## Next steps

- Bij volgende sessie: WDF-migratie-status opnieuw checken vóór iets anders op die map te doen.
- `/ndb-regels` en `/wdf-regels` zijn beide live en bruikbaar — geen verdere actie nodig om ze te proberen.

## Cross-links

- `[[2026-08-21-19-35_hermes_vscode-claude-code-koppeling]]` — meest recente eerdere log vóór deze sessie.
- `[[2026-08-21-skills-clickable-rows-qa]]` — Nemesis' QA-rapport, onderdeel van dit traject.

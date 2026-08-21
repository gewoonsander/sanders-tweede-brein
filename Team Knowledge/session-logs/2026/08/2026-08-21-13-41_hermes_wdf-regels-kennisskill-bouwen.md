---
agent_id: hermes
session_id: wdf-regels-kennisskill-2026-08-21
timestamp: 2026-08-21T17:15:00Z
type: close-session
linked_sops: [SOP-create-task, SOP-claim-task, SOP-close-task, SOP-rebuild-task-index]
linked_workstreams: []
linked_guidelines: [GL-013-interactie-enkelvoudige-keuzes]
---

# WDF-regels kennis-skill gebouwd; onderweg een multi-sessie-schemabotsing met de parallelle NDB-import ontdekt en opgelost

## Context

Sander vroeg om een callable skill die de reglementen van de World Darts Federation (dartswdf.com) kent, zodat hij WDF-vragen direct kan uitvragen in plaats van elke keer zelf te zoeken. Sessie in Cowork op de MacBook Air.

## What we did

- Hermes verkende dartswdf.com/rules (firecrawl), inventariseerde ~30 documenten in acht categorieën.
- Sander koos scope via GL-013-vraag: kernregels (spelregels, kwalificatie, ranking, organisatiestructuur incl. NDB-lidmaatschap), niet de volledige bestuurlijke laag — en koos "vastleggen als taak voor terminal-sessie" i.p.v. nu bouwen.
- Taak [[tsk-2026-08-21-002]] aangemaakt volgens SOP-create-task, met volledige document-inventaris en scope-afbakening.
- Sander gaf alsnog "nu meteen oppakken" — taak geclaimd binnen dezelfde Cowork-sessie (volledige Bash/tool-toegang was al aanwezig).
- Daedalus bouwde de eerste versie: 15 PDF's + org-pagina's opgehaald, `PKM/Documents/WDF-Kennis/` opgezet (ad-hoc Nederlandse frontmatter), skill `~/.claude/skills/wdf-regels/SKILL.md` gebouwd, geregistreerd in `AGENTS.md`. 27/27 feiten geverifieerd.
- Bij afronding: `git status` toonde onverwachte wijzigingen van een andere, al 3+ uur actieve peer-sessie die onafhankelijk een véél groter NDB-reglementen-archief bouwde (`PKM/Documents/NDB-Kennis/`, via Athena → Atlas → Daedalus, eigen `/ndb-regels`-skill). Die sessie's Atlas signaleerde dat WDF-Kennis' ad-hoc schema afweek van het GL-002 Documents-schema dat zij voor NDB-Kennis hadden vastgesteld.
- Sander koos via GL-013: (1) WDF-Kennis migreren naar GL-002, (2) de WDF Bye-Laws-eligibility (2.01, 7.05) alsnog toevoegen.
- Atlas migreerde alle 15 bestanden naar GL-002 (diff-verificatie 15/15 schoon, downloadlog-patroon overgenomen van NDB-precedent). Daedalus voegde bestand 16 toe (Bye-Laws-eligibility, 35/35 feiten geverifieerd) en werkte SKILL.md/INDEX.md/AGENTS.md bij.
- Hermes deed eindreview: drie verwijzingen naar Bye-Law 2.01 in eerder gemigreerde bestanden gecorrigeerd/verrijkt, taak gesloten als done met volledige Outcome.
- Sander testte de skill zelf (`/wdf-regels "hoe kan je je plaatsen voor het WK"`) — correct gerouteerd naar bestand 02, gegrond antwoord met citaat van het bronbestand.
- Los verzoek: Mac mini-specs opgevraagd. Hermes verifieerde eerst welke machine de sessie draait (MacBook Air, niet Mac mini) en haalde de specs via `ssh macmini` op in plaats van aan te nemen.
- Sessietitel bij afsluiten alsnog gecontroleerd/bevestigd (`2026-08-21 13:41 · WDF-regels kennis-skill bouwen`) — bleek al automatisch gezet, hernoemd naar het canonieke onderwerp.

## Decisions made

- **Vraag:** Volledige bestuurlijke WDF-laag (Constitution, Bye-Laws, Disciplinary Code, etc.) meenemen in de kennisbasis?
  **Besluit:** Nee, alleen kernregels (spelregels, kwalificatie, ranking, cups, organisatiestructuur). Later aangevuld met alleen de eligibility-clausules uit de Bye-Laws (2.01, 7.05) — bewust smal gehouden, niet de volledige Bye-Laws.
- **Vraag:** Nu bouwen in Cowork, of vastleggen als taak voor een terminal-sessie?
  **Besluit:** Eerst vastgelegd als taak (past bij Sanders eerdere voorkeur voor omvangrijke multi-document-klussen), maar Sander koos alsnog voor direct oppakken binnen dezelfde sessie.
- **Vraag:** WDF-Kennis migreren naar het GL-002 Documents-schema (zoals het NDB-Kennis-precedent) of het eigen ad-hoc schema laten staan?
  **Besluit:** Migreren — consistentie in de vault weegt zwaarder dan de snelheid van niets doen.

## Insights

- `ListAgents` vóór delegatie checken is nodig zodra een taak een **nieuwe conventie verzint** (nieuw archief-type, nieuw schema), niet alleen wanneer het doelbestand gedeeld lijkt. Thematische overlap tussen twee taken op dezelfde dag is een net zo sterk signaal als een gedeeld bestand. Vastgelegd in [[2026-08-21-listagents-voor-nieuwe-conventies]] (Hermes-journal) en [[2026-08-21-14-15_hermes_wdf-ndb-parallelle-sessie-schemadrift]] (mid-session-insight).
- Twee onafhankelijke, gelijktijdige sessies die aan **losstaande bestanden in dezelfde bovenliggende map** werken, geven geen git-conflict maar wel schema-drift — een categorie multi-sessie-risico die hard rule 11 nog niet expliciet dekte.

## Realignments

- _(geen — Sander stuurde bij via expliciete GL-013-keuzes, geen correcties op een verkeerd ingeschatte richting)_

## Open threads

- [ ] Geen Organization-notitie voor de WDF in `PKM/CRM/Organizations/` — `linked_organizations` staat leeg in alle 16 WDF-Kennis-bestanden. CRM-beslissing voor een volgende sessie.
- [ ] Naamsbotsing tussen `WDF-Kennis/bron/_downloadlog.md` en `NDB-Kennis/bronnen/_downloadlog.md` — de 36 NDB-notities gebruiken nog de korte, nu dubbelzinnige wikilink-vorm `[[_downloadlog]]`. Librarian-punt.
- [ ] `PKM/Documents/2018-02-28-wdf-playing-and-tournament-rules.md` (pre-existing, niet uit deze sessie) draagt `doc_type: reglement`, niet in de GL-002-enum — losstaande drift.
- [ ] Daily habits nog niet gelogd vandaag (2026-08-21): bodylotion, dagelijks bewegen, dagelijks opdrukken, dagelijks voldoende drinken, schimmelcrème. Voeding: ontbijt en lunch nog niet gelogd. Niet bevraagd — dit is de "snel"-variant van close-session.

## Next steps

- Sander kan de skill verder testen op eigen WDF-vragen.
- Eerstvolgende volledige close-session: journaal-, habit- en voedingsvraag alsnog stellen (vandaag oversloegen, zie Open threads).

## Cross-links

- [[tsk-2026-08-21-002-wdf-regels-kennisskill-bouwen]] — de taak, met volledige Updates-tijdlijn
- [[2026-08-21-14-15_hermes_wdf-ndb-parallelle-sessie-schemadrift]] — mid-session-insight over de collision
- [[2026-08-21-listagents-voor-nieuwe-conventies]] — Hermes-journalentry
- [[2026-08-21-14-36_atlas_ndb-reglementen-kennisarchief-structureren]] — de parallelle sessie's eigen log
- [[2026-08-21-15-57_atlas_wdf-kennis-migratie-gl002]] — Atlas' schemamigratie

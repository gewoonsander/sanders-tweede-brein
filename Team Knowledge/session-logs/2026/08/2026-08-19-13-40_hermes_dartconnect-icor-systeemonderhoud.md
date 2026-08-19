---
agent_id: hermes
session_id: dartconnect-icor-systeemonderhoud
timestamp: 2026-08-19T11:40:21Z
type: close-session
linked_sops: ["SOP-022-verwerk-persoonlijke-taak", "SOP-017-verwerk-voedingsregistratie"]
linked_workstreams: []
linked_guidelines: ["GL-021-klikbare-bestandslinks", "GL-013-interactie-enkelvoudige-keuzes", "GL-018-integratie-en-software-register"]
---

# DartConnect-onderzoek, ICOR-kennisskill en systeemonderhoud

## Context

Gestart 2026-08-18 21:54 met een kale DartConnect-link zonder toelichting. Groeide uit tot een
brede sessie: dataontsluiting voor een persoonlijk dartdashboard, een nieuwe kennis-skill over
de ICOR-methodologie waarop dit hele myPKA is gebouwd, een structurele fout in de
Todoist↔myPKA-synchronisatie, en de dagelijkse afsluitroutine.

## Wat we deden

- Athena onderzocht DartConnect-datatoegang (publieke API, kosten, ToS) plus iDarts, Bas
  Engelen/Premium Dartdata en Jacques Nieuwlaat — rapport in
  `Deliverables/2026-08-18-dartconnect-data-dashboard-onderzoek.md`. Conclusie: API-aanvraag bij
  DartConnect is de aanbevolen route, scraping wordt afgeraden (expliciet verboden in de ToS).
- Conceptmail naar DartConnect customer service opgesteld (nog niet verstuurd).
- GL-021 en de eigen `feedback_gmail_links`-memory uitgebreid: conceptmails krijgen voortaan ook
  een directe `#drafts/`-link, niet alleen bestaande threads. Uitgezocht dat de `draftId` uit
  `create_draft` niet bruikbaar is in een Gmail-URL — de `threadId` uit `list_drafts` wel.
- Sessietitel-fout hersteld: de stempelregel in de eerste reply was geschreven, maar
  `set_session_title` was nooit aangeroepen. `feedback_sessiestempel_bij_sessiestart` aangescherpt
  zodat dit onderscheid niet meer gemist wordt.
- Op verzoek een nieuwe kennis-skill gebouwd: `~/.claude/skills/icor/SKILL.md`, gedistilleerd uit
  de ICOR-kernvideo's binnen de al eerder getranscribeerde 588 video's van "ICOR with Tom AI
  Productivity". Bevestigd: ICOR = Input, Control, Output, Refine; dit repo is zelf het
  ICOR/myPKA-scaffold-product (merken genoemd in de licentiekop van `AGENTS.md`).
- Skill meteen gebruikt voor een ICOR-Refine-doorloop van Sanders eigen systeem: Journal en
  Team Knowledge fris, Weekly Reports drie weken achter (geen `2026/08`-map), en
  `PKM/Tasks/done/`+`cancelled/` nog nooit gebruikt (bevestigd via `git log`).
- Root cause gevonden via de Todoist-API: twee taken (KPN PDF-facturen, factuur Gewoon Thuis →
  Albero) waren al op 2026-08-17 in Todoist afgevinkt maar stonden in myPKA nog als `scheduled` —
  er bestaat geen sync terug van Todoist-voltooiing naar myPKA. Beide taken alsnog gesloten
  volgens SOP-022 en verplaatst naar `PKM/Tasks/done/2026/08/`; structurele opvolging vastgelegd
  in `PKM/Tasks/someday/tsk-2026-08-19-001-sync-gap-todoist-voltooiing-naar-mypka.md`.
- Op verzoek Claude's ingebouwde geheugenfunctie gecontroleerd via Claude in Chrome
  (claude.ai/settings, ingelogd account): "Generate memory from chats" stond al uit, "Search and
  reference chats" nog aan. Op bevestiging ook die laatste uitgezet — nu volledig uit, zoals Tom
  Solid in de ICOR-bronvideo's aanraadt.
- Bij het afsluiten gaf Sander een braindump door: water, koffie, tonijnsalade (eerst per abuis
  als lunch gelogd, gecorrigeerd naar ontbijt met `supersedes_entry_id`; lunch nog niet gegeten →
  vastgelegd via `food_log.py skip`), 31 keer opgedrukt (telt ook als `dagelijks-bewegen`),
  schimmelzalf en bodylotion — allemaal verwerkt in de betreffende Habit-bestanden en
  `PKM/Journal/2026/08/2026-08-19.md`, spiegel geregenereerd.

## Decisions made

- **Question:** Scrapen van DartConnect-data voor het persoonlijke dashboard, gezien de
  ontbrekende self-service API?
  **Decision:** Nee — de ToS verbiedt het expliciet en er bestaat een officiële, toegestane
  API-aanvraagroute. Eerst die route en iDarts verkennen.
- **Question:** Scope van de nieuwe ICOR-skill — algemeen advies, AI-agent-teams, of breed alles?
  **Decision:** Uitleg-en-toepassingsskill specifiek gericht op de ICOR-methodologie zelf en hoe
  die op Sanders eigen tweede brein toegepast wordt — Sander noemde zichzelf "een beetje een
  noob" op dit vlak.
- **Question:** De twee al-in-Todoist-afgevinkte taken nu sluiten in myPKA?
  **Decision:** Ja, plus een aparte opvolgtaak voor de structurele sync-gap (blijft `someday`
  zolang de Todoist-connector in de myPKA Cockpit geblokkeerd is).
- **Question:** Claude's "Search and reference chats" ook uitzetten naast "Generate memory from
  chats"?
  **Decision:** Ja, op Sanders bevestiging.

## Insights

- Een sessietitel is pas echt gezet na de `set_session_title`-tool-call — de zichtbare
  stempelregel in de reply-tekst is daar geen vervanging van. Twee losse stappen, niet één.
- `PKM/Tasks/done/` en `cancelled/` leeg zijn is geen teken van "weinig gebruikt", maar kan een
  structureel sync-gat zijn — pas te onderscheiden door de Todoist-kant er live naast te leggen,
  niet door alleen de myPKA-bestanden te lezen.
- De ICOR-bronvideo's zelf bevestigen wat hier al staat: sessie-/chatgeheugen dat het model zelf
  kiest wat te onthouden is onbetrouwbaar; een lokale, door de gebruiker gecontroleerde map (zoals
  dit myPKA) is het alternatief dat Tom en Paco zelf ook toepassen.

## Realignments

- Sander corrigeerde de maaltijdcategorie van de tonijnsalade: die was voor de lunch gegeten
  (dus ontbijt), niet als lunch — lunch moet nog. Verwerkt met een correctie-entry
  (`supersedes_entry_id`) in plaats van de oude entry te overschrijven, conform SOP-017.

## Open threads

- [ ] DartConnect-conceptmail staat klaar in Gmail, nog niet verstuurd door Sander.
- [ ] iDarts (`stats.idarts.nl`) nog niet zelf getest op "Sander Vos" — bepaalt of dat spoor
      teamcompetitie-wedstrijden dekt of alleen rankingtoernooien.
- [ ] Weekly Reports: geen `2026/08`-map, meerdere weekreviews ontbreken sinds eind juli.
- [ ] Team Inbox-tegenstrijdigheid (systeemmelding claimt wachtende items, eigen check + laatste
      inboxronde-rapport zien niets openstaand) nog niet opgelost — een echte SOP-013-ronde staat
      uit.
- [ ] `tsk-2026-08-19-001-sync-gap-todoist-voltooiing-naar-mypka` wacht op het Todoist-connectorwerk
      in de myPKA Cockpit.
- [ ] Lunch van vandaag nog niet gelogd (bewust als `skip` vastgelegd, geen blokkerende vraag).
- [ ] "Ik ben met heel veel projecten in AIB" — term "AIB" niet herkend, niet ingevuld; navragen
      wat hiermee bedoeld is.

## Next steps

- Zodra Sander reageert op de DartConnect-mail of iDarts zelf test: verder met het dashboard-spoor.
- Volgende sessie: Weekly Reports-achterstand oppakken (optie A uit het eerdere Refine-gesprek)
  en/of de Team Inbox-ronde draaien (optie B).

## Cross-links

- `[[2026-08-18-resolve-icor-kanaal-gemma4]]` — vorige sessie, bracht het ICOR-kanaal van 121 naar
  588 van 598 video's, wat deze sessie de kennisbron gaf voor de nieuwe `/icor`-skill.

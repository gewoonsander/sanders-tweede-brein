---
agent_id: hermes
session_id: 2026-08-18-19-49-google-drive-reorganisatie
timestamp: 2026-08-19T07:46:18Z
type: close-session
linked_sops: [SOP-013-inboxen-verwerken]
linked_guidelines: [GL-001-file-naming-conventions, GL-013-interactie-enkelvoudige-keuzes]
linked_workstreams: []
---

# Google Drive opnieuw ingericht: van 972 rommelige root-items naar de documenten/-structuur

## Context

Sander vroeg om zijn Google Drive opnieuw in te richten. Root bevatte 972 items (27 mappen + 945 losse bestanden), grotendeels ongeorganiseerd. Tijdens de sessie bleek dat er al een canonieke doelstructuur bestond (`documenten/` met de 7 Key Elements uit GL-001 §13, sinds de migratie van 6 juli) die niet bekend was bij de start — dit heeft Sanders eerdere keuze voor de AKP-bestemming bijgesteld.

## What we did

- Hermes liet een subagent de volledige root-inventarisatie uitvoeren (read-only).
- Snelle opschoning: 109 lege bestanden + dubbele "Opgeslagen vanuit Chrome"-map naar de prullenbak.
- Alle 27 oorspronkelijke root-mappen verwerkt: geroute naar de juiste plek in `documenten/` (03-passie, 04-groei, 05-bijdrage, 06-financien, admin) of naar een nieuwe `archief/`-map voor legacy-content zonder Key Element.
- Nieuwe submap `documenten/05-bijdrage/gewoon-thuis/dossiers/` aangemaakt; 158 losse AKP Gezinshuis-bestanden (mentorgesprekken, weekvoortgang, dossiers Daan/Kudus/Aung Ko Phyo/Yoram/Merel) daarnaartoe verplaatst en geteld-geverifieerd.
- 160 extra losse root-bestanden verwerkt via titel-patroonherkenning (jq/regex): dartteam-Irritant, RDB, financieel (facturen/toolstation/bunq/Doxie), Huismanstraat-losse titels, Dotterlaan (vorige woning), overige Gezinshuis-titels.
- Volledige routering en voortgang vastgelegd in [[tsk-2026-08-18-001-google-drive-root-opruimen-naar-documenten-structuur]].

## Decisions made

- **Vraag:** Meteen uitvoeren in Cowork, of bewaren voor een Claude Code/terminal-sessie zoals normaal bij grotere klussen?
  **Beslissing:** Sander koos om meteen door te gaan in dezelfde sessie — afwijking van de staande voorkeur, expliciet akkoord.
- **Vraag:** Waar horen de AKP Gezinshuis-bestanden?
  **Beslissing:** Bestaande conventie volgen (`documenten/05-bijdrage/gewoon-thuis/`), niet een nieuwe afgeschermde hoofdmap — bijgesteld nadat bleek dat deze conventie al op 6 juli bewust zonder aparte privacyreview was vastgesteld.
- **Vraag:** Binnen `gewoon-thuis/` los in de hoofdmap, of een nieuwe submap?
  **Beslissing:** Nieuwe submap `dossiers/`, gescheiden van de bestaande (vermoedelijk website/huisstijl-gerelateerde) submappen documenten/assets/media/activiteiten/facturen/branding.
- **Vraag:** Na alle root-mappen: doorgaan met de ~678 losse bestanden, of pauzeren?
  **Beslissing:** Sander koos twee keer om door te gaan; sessie is uiteindelijk gestopt na 160 extra bestanden met een statusupdate, omdat het resterende werk (~518 bestanden zonder duidelijk titel-patroon) individuele beoordeling vraagt.

## Insights

- Er bestond al een canonieke Google Drive-doelstructuur (GL-001 §13) die niet bekend was bij aanvang van de sessie — een herinnering dat root-rommel niet automatisch betekent dat er geen onderliggende structuur is; eerst verifiëren voor iets nieuws bedenken.
- Root-mappen met een voor de hand liggende naam bleken vaak gemengde content te bevatten (bv. "dartbuddies.online" bevatte ook een KVK-uittreksel en een generiek marketplace-ebook, "Huismanstraat" bevatte zowel legale/hypotheekdocumenten als verbouwingsspecifieke stukken) — blind op mapnaam routeren was niet veilig, per-bestand beoordelen (of expliciet een "-archief"-submap voor latere fijn-sortering) was nodig.
- Titel-patroonherkenning op "dart" leverde 2 valse positieven op via het Nederlandse woord "arts" (tandarts, jeugdarts) — bevestigt dat automatische keyword-matching op Nederlandse tekst extra zorg vraagt bij korte, veelvoorkomende substrings.

## Realignments

- _(geen expliciete correcties op Hermes' aanpak deze sessie, wel twee bijstellingen van Sanders eigen eerdere keuzes zoals hierboven vastgelegd onder Decisions made)_

## Open threads

- [ ] **Onopgelost dataverlies-risico:** bij het samenvoegen van "Huismanstraat gedeeld met LLM" zijn 2 bestanden ("verbouwing huismanstaat 34" spreadsheet en "oud Verbouwing huismanstraat planning 3 kamers") mogelijk verloren gegaan — niet te vinden via Drive-tools, niet aangetroffen in Sanders eigen prullenbak-check. Moet in een latere sessie verder uitgezocht worden.
- [ ] Ca. 518 resterende losse root-bestanden (o.a. ~184 gedateerde scans) zonder duidelijk titel-patroon — individuele beoordeling nodig, geschikt voor een Claude Code/terminal-sessie.
- [ ] 15 bestanden in de samengevoegde `Opgeslagen vanuit Chrome`-map nog niet verder gefileerd.
- [ ] Fijn-sortering binnen de nieuwe "-archief"-submappen (dartscoaching-nl-archief, dartbuddies-online-archief) over de bestaande subs (branding/assets/coaching/dartboek/media/boek-darttactiek/materiaal/website).
- [ ] Huismanstraat-hoofdmap (nu in `admin/huismanstraat-34/`) bevat nog verbouwingsspecifieke stukken die eigenlijk bij `05-bijdrage/verbouwing-huismanstraat/` horen, plus oude historische pandfoto's zonder duidelijke eigen plek.
- [ ] NDB/RDB-relatie: bewust apart gehouden (`03-passie/ndb/` vs `03-passie/rdb/`) op basis van sterke aanwijzingen dat het verschillende bonden zijn (RDB bleek "Rivierenland/Redelijke Darts Bond"), maar nog niet expliciet met Sander bevestigd.
- [ ] 84 resterende duplicaat-titels binnen `gewoon-thuis/dossiers/` (Template Zakelijke brief 25x, Weekvoortgang Daan 10x, e.a.) nog niet inhoudelijk beoordeeld op legitiem-verschillend vs. echte duplicaten.

## Next steps

Volgende sessie (bij voorkeur Claude Code/terminal): het Huismanstraat-dataverliesincident onderzoeken, de resterende ~518 losse root-bestanden individueel beoordelen en routeren, en de "-archief"-submappen fijn-sorteren. Volledige routeringstabel en instructies staan in [[tsk-2026-08-18-001-google-drive-root-opruimen-naar-documenten-structuur]].

## Cross-links

- [[tsk-2026-08-18-001-google-drive-root-opruimen-naar-documenten-structuur]] — de taak met volledige routeringsdetails en voortgang
- `Deliverables/2026-07-06-opslagstrategie-migratie-plan.md` — het eerdere migratieplan waarop de `documenten/`-structuur is gebaseerd
- [[2026-07-06-12-59_hermes_opslagstrategie-migratie-uitgevoerd]] — de sessie waarin die structuur is aangelegd

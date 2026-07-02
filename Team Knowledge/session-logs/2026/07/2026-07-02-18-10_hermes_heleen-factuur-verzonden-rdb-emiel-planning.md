# Session Log - 2026-07-02 - Heleen-factuur verzonden, RDB/Emiel-dossier opgezet

## Active tasks (checkboxes at top, single source of truth for this session)
- [x] Heleens WordPress-rol verhoogd naar Editor
- [x] Divi Builder-toegang voor Heleen geverifieerd (al werkend)
- [x] WPMU Dev cloud-verbinding hersteld
- [x] 696 spamcomments opgeruimd op praktijkvoluitleven.nl
- [x] GoDaddy-domeinoverdracht geverifieerd (€0,00 transfer, €7,99 als toekomstige verlengingsprijs)
- [x] Facturatieproducten aangemaakt in WPMU Dev Hub (Hostingpakket, Domeinnaam verlenging, Gebruik Divi) + productafbeeldingen
- [x] Gecombineerde 2025+2026-factuur (INV-0003, €328,96 incl. btw) samengesteld, met persoonlijk notitieberichtje, en verzonden naar Heleen
- [x] Uitgezocht en bevestigd: Heleen heeft via haar klantrol "Klant - Mail en Facturering" (Pro Email-permissie) toegang tot IMAP/SMTP-instellingen in haar klantportaal
- [x] WhatsApp-bericht naar Heleen gestuurd (vraag over portal-instellingen + melding over verzonden factuur)
- [x] Notitie vastgelegd bij Darren (dartscoachingcliënt): misverstand uitpraten + vragen naar tijd morgen voor online sessie
- [x] Nieuw projectdossier aangemaakt: RDB/Emiel Theloosen website- en toegangsoverdracht, met openstaande datumvraag (prijsuitreiking vs. ALV-datum)
- [ ] Sander pakt vanavond of morgenvroeg het Emiel/RDB-dossier verder op
- [ ] Sander praat vanavond of morgenvroeg het misverstand met Darren uit

## What we did

Grootste deel van de sessie ging over het afronden van het Praktijkvoluitleven.nl-dossier (zie [[project_praktijkvoluitleven-migratie]] voor de volledige technische geschiedenis): Heleens WordPress-rechten, Divi-toegang, een losgeraakte WPMU Dev-cloudverbinding, 696 spamcomments, domeinkosten-verificatie via GoDaddy, en het opzetten van drie facturatieproducten (Hostingpakket, Domeinnaam verlenging, Gebruik Divi) mét bijpassende productafbeeldingen in dezelfde stijl als bestaande iconen (.nl, RDB). De gecombineerde 2025+2026-factuur is samengesteld, voorzien van een persoonlijk bedankberichtje in de factuurnotities, en na Sanders expliciete akkoord daadwerkelijk verzonden (status nu "Payment Due", €328,96 incl. btw).

Vervolgens is uitgezocht of Heleen de IMAP/SMTP-instellingen voor Outlook zelf kan terugvinden in haar klantportaal. Bevestigd: haar klantrol "Klant - Mail en Facturering" heeft de "Pro Email"-permissie aan staan, wat haar toegang geeft tot precies dit soort configuratieschermen. Sander heeft haar via WhatsApp gevraagd of ze dit zelf terugvindt, met een ticket-fallback als dat niet lukt, en tegelijk gemeld dat de factuur onderweg is (met een luchtige "niet schrikken"-toon).

Aan het einde van de sessie is het formele close-session-protocol doorlopen: een korte notitie vastgelegd voor een openstaand punt met Darren (dartscoachingcliënt — mogelijk telefonische/spraakherkenningsfout "Dern" → "Darren", nu ook toegevoegd aan de speech-to-text-correcties in `.user.yaml`), en een nieuw projectdossier opgezet voor de aankomende overdracht van website-toegang aan Emiel Theloosen bij diens (verwachte) aantreden in het RDB-bestuur.

## What the user realigned

- Sander vroeg eerst om de sessie te "sluiten", wat aanvankelijk werd geïnterpreteerd als het archiveren van de sessie zelf. Sander corrigeerde: hij bedoelde het formele close-session-protocol uit `AGENTS.md` (Librarian-pas, journaal-check, sessielog, git-backup) — niet het daadwerkelijk beëindigen/archiveren van de conversatie.

## Decisions

- Factuur INV-0003 daadwerkelijk verzonden na expliciete instructie ("wil jij dat ook voor mij even doen") — dit was eerder in de sessie bewust als concept opgeslagen in afwachting van Sanders controle; nu definitief verzonden.
- Voor de "Gebruik Divi"-kortingsregel is gekozen om geen aparte negatieve regel te tonen (technisch niet mogelijk in WPMU Dev Hub), maar het product gewoon op €0,00 te zetten.
- Klant-record e-mailadres van Heleen blijft bewust op heleen_meems@hotmail.com in plaats van haar domeinadres, om Sanders eigen SSO-toegang tot haar mailbox niet te breken (WPMU Dev's ingebouwde privacy-mechanisme).
- Vraag over Outlook-instellingen gaat via WhatsApp (direct, snel antwoord) in plaats van het ticketsysteem (indirect, vereist dat ze eerst haar hotmail-inbox checkt) — ticketsysteem blijft de fallback-route mocht ze de instellingen niet zelf terugvinden.

## Deltas vs prior plan

- De eerder geplande "testklant-flow (Stripe-credit-truc)" voor eind-tot-eind-verificatie van het klantportaal is dit keer niet uitgevoerd — in plaats daarvan is rechtstreeks de klantrol-configuratie gecontroleerd (Pro Email-permissie), wat sneller een bevestigend antwoord gaf. De testklant-flow blijft als optionele, lagere-prioriteit vervolgstap staan.
- RDB/Emiel-dossier kreeg een eigen projectbestand (was voorheen alleen impliciet aanwezig in `emiel-theloosen.md`) omdat het nu een tijdsgevoelige, actieve taak is met een concrete deadline (vanavond/morgenvroeg, vóór de RDB-prijsuitreiking van morgenavond).

## SSOT / structural fixes (Librarian pass)

- `PKM/My Life/Projects/INDEX.md` miste 6 bestaande projectbestanden (waaronder de 2 nieuwe van vandaag) — index aangevuld met korte beschrijvingen.
- Wikilinks in de nieuwe/gewijzigde bestanden van vandaag (`project_praktijkvoluitleven-migratie`, `project_rdb-emiel-website-overdracht`, `darren`) gecontroleerd — allemaal geldig, geen broken links.
- Gevonden maar niet zelf gefixt (aan Sander gemeld, content-drift): `bouwlog-badkamer-toilet.md` mist YAML-frontmatter (wijkt af van GL-002); `mypka.db` is verouderd (Heleen van den Berg ontbreekt er bijvoorbeeld nog in); root `AGENTS.md` gebruikt een nieuwe teamnaamgeving (Hermes, Jethro, Athena, Daedalus, Atlas, Harmonia, Charta, Pixel, Bezalel, Argus, Nemesis) die nog niet is doorgevoerd in de `Team/`-map en de losse `AGENTS.md`-contracten daarin (die heten nog Larry, Nolan, Pax, Mack, Silas, Iris, Charta, Pixel, Felix, Vex, Vera) — onvoltooide rename, verdient een bewuste opschoning.
- Team Inbox opgeschoond: 5 screenshots verwijderd na expliciete bevestiging van Sander. StoryBoard-template-PDF en de drie bestanden in `Documents/` (receipts.csv, twee facturen) bewust laten staan — geen akkoord voor verwijdering gevraagd/gegeven.
- People-deduplicatie-check via `mypka.db` uitgevoerd: geen duidelijke duplicaten gevonden (met het voorbehoud dat de db verouderd is, zie hierboven).

## Cross-links

- [[2026-07-02-08-44_hermes_permissies-en-heleen-case]] — start van het klantportaal-traject, eerder vandaag
- [[project_praktijkvoluitleven-migratie]]
- [[project_rdb-emiel-website-overdracht]]

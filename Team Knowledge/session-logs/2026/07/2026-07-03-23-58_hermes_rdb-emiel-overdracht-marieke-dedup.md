---
agent_id: hermes
session_id: rdb-emiel-overdracht-marieke-dedup
timestamp: 2026-07-03T23:58:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes"]
---

# RDB/Emiel webmaster-overdracht + Marieke contact-dedup

## Context

Lange sessie op de dag van de RDB-huldiging/ALV (2026-07-03), waar Emiel Theloosen naar verwachting werd gekozen als bestuurslid communicatie. Grootste deel van de sessie ging op aan het volledig voorbereiden van de website/hosting-overdracht aan Emiel. Ook: dedup van Marieke's Google Contacts-kaart (met een tussentijdse fout), wat achtergrondvragen over de Claude Code-omgeving, en een kort zijspoor over factuur-archivering (weer ingetrokken).

## What we did

- **Marieke-contact dedup:** Sander vroeg waarom Google's automatische duplicatendetectie niks vond. Hermes zocht de kaart op via de n8n zoek-contact-webhook, legde uit waarom (verschillende bronnen/velden) en gaf instructie voor handmatig samenvoegen in de Contacts-app. Na Sanders bevestiging dat hij had samengevoegd, is het werkadres opgehaald (rommelveld) en na goedkeuring vervangen door het echte adres van Praktijk Gewoon Zijn (Leidenweg 5, Arnhem, via WebFetch).
  - **Incident:** de update-contact n8n-workflow bleek geen velden toe te voegen maar hele arrays (adressen, telefoonnummers) te overschrijven. Bij het zetten van het werkadres ging eerst het thuisadres (Huismanstraat 34) verloren, daarna ook de postcode en het mobiele nummer. Hermes herstelde dit stapsgewijs en meldde de fout expliciet aan Sander in plaats van door te poetsen. Eindresultaat: alle data hersteld, werkadres-veld staat nog open (Sander doet dit handmatig in de app).
- **RDB/Emiel webmaster-overdracht** (project_rdb-emiel-website-overdracht.md, uitgebreid bijgewerkt):
  - Datumfout gecorrigeerd: ALV + huldiging zijn beide op 2026-07-03 (niet 4 juli zoals eerder genoteerd) — gecorrigeerd in project-, persoons- en organisatiebestand.
  - Nieuw CRM-persoonsbestand aangemaakt: [[nick-pol]] (huidig/aftredend voorzitter RDB, beheert domein rdbdarts.nl en Google Workspace) — bleek al te bestaan in Google Contacts.
  - Emiels telefoonnummer toegevoegd aan CRM + Google Contacts.
  - Team Inbox-facturen (12 historische RDB-facturen 2017-2026) geanalyseerd en samengevat: twee keer een website gebouwd (2017, 2020), jarenlang servicecontract met twee prijsverhogingen (€25→€30→€35/maand).
  - **WPMU Dev Hub-klantdashboard voor RDB volledig opgezet:** klantrol opgehoogd naar "Edit All & Access billing"; hostingproduct bijgewerkt naar €35/maand (€420/jaar, oude €30-plan gearchiveerd); domeinproducten rdbdarts.nl + rivierenlanddartsbond.nl verlaagd naar €8/jaar (van €21,99, oude plannen gearchiveerd); concept-factuur (€527,56 incl. btw, jaar 2026) klaargezet maar bewust niet verzonden.
  - Branda Pro admin-welkomstbericht voor Emiel live gezet op de WordPress-site (met correctie van een typo in het e-mailadres).
  - Compleet pluginlicentie-overzicht opgesteld (stuk voor stuk doorgenomen met Sander): WPMU Dev-suite, WP All Import/Export, Divi Builder, BuddyBoss Platform + thema (apart van elkaar, thema is geen plugin — Sander corrigeerde dit terecht), Divi Machine, Divi Dynamic Helper, Smart Slider 3 Pro (blijft bij RDB), Advanced Custom Fields Pro, The Events Calendar (geen licentie meer, overgenomen door LiquidWeb).
  - Kritieke blocker vastgelegd: 2FA op webmaster@rdbdarts.nl staat op Sanders telefoon, kan alleen losgekoppeld via Nick's Google Workspace-beheerderstoegang — nog niet bevestigd of Emiel dit al geregeld heeft.
  - Overdrachtsdocument geschreven en iteratief uitgebreid: `Deliverables/2026-07-03-rdb-overdracht-emiel.md` — bevat nu login-gegevens (wachtwoorden gemaskeerd, echte wachtwoorden via apart kanaal), facturatie, support-kanalen, plugin/thema-overzicht, Sjoerd als nieuwe penningmeester voor de betaling.
  - Felicitatiebericht als Gmail-concept klaargezet voor Emiel (e.theloosen@calvi-insight.com).
- **Zijspoor (ingetrokken):** Daedalus kreeg opdracht een herbruikbare "archive-invoices"-skill te bouwen voor factuursturen.nl-facturen (UBL vs PDF). Kwam terug met een ontwerpvoorstel; Sander wilde dit niet meteen doorzetten ("later mee aan de slag") — geen code gebouwd, geen actie meer nodig.
- **Losse vragen beantwoord:** verschil tussen deze Claude Code-sessie en een losse cloud-sandbox (bevestigd: dit was de daadwerkelijke Mac mini); uitleg iCloud-sync van de Documents-map.

## Decisions made

- **Vraag:** Moet RDB's facturatie voor hosting + domeinen via Sanders losse systeem blijven lopen, of via de WPMU Dev Hub?
  **Beslissing:** Voortaan via de Hub. Sander moet zijn eigen systeem stopzetten voor deze posten zodra de conceptfactuur bevestigd wordt, om dubbele facturatie te voorkomen.
- **Vraag:** Wat te doen met het BuddyBoss-thema en Divi als alternatief?
  **Beslissing:** BuddyBoss-thema mag RDB via Sanders lifetime-licentie blijven gebruiken (actief op live + staging); als Emiel het niet wil, staat het Divi-thema al gratis geïnstalleerd als alternatief (licentiesleutel genoteerd).
- **Vraag:** Marieke's rommelveld (werkadres) meteen opschonen?
  **Beslissing:** Nee, Sander doet dat later zelf handmatig — geen verdere geautomatiseerde pogingen na het eerdere incident.

## Insights

- De n8n `update-contact`-webhook is niet veilig voor gedeeltelijke updates: hij vervangt complete arrays (adressen, telefoonnummers) in plaats van individuele velden toe te voegen. Bij toekomstig gebruik: eerst de volledige bestaande data ophalen en meesturen, niet ervan uitgaan dat losse velden additief werken.
- Sander stelt prijs op transparantie bij accountwijzigingen die *tegen* hem als Hermes' actie ingaan — toen de contact-update mislukte, werd dat direct en expliciet gemeld in plaats van stilgehouden, wat goed aansloot bij eerdere feedback over samenvatten-voor-filing.
- Bij grote, financieel/technisch gevoelige acties (klantrol wijzigen, facturen aanmaken, wachtwoorden delen) bleef Hermes consequent bij de grens: zelf klikken op reversibele/informatieve stappen, maar accounttoegang-wijzigingen (rol toekennen, e-mailaccount overdragen) expliciet aan Sander zelf overlaten met stap-voor-stap begeleiding.

## Realignments

- Sander corrigeerde dat een WordPress-thema geen plugin is, ook al werd het aanvankelijk in dezelfde lijst opgenomen — de documenten zijn daarop herstructureerd met een apart "Thema"-onderdeel.
- Wachtwoorden werden aanvankelijk in platte tekst gedeeld; na een korte kanttekening van Hermes over opslag in de PKM koos Sander er zelf voor om vervolgens gemaskeerde wachtwoorden te geven en de echte wachtwoorden via een apart kanaal te sturen.

## Open threads

- [ ] Concept-factuur (€527,56, jaar 2026) definitief maken/verzenden in de WPMU Dev Hub — betaling loopt via Sjoerd (nieuwe penningmeester).
- [ ] Sanders eigen facturatiesysteem stopzetten voor RDB-hosting/domeinen zodra de Hub-factuur bevestigd is.
- [x] **Opgelost tijdens close-session:** Sander heeft Nick zelf gevraagd de 2FA op `webmaster@rdbdarts.nl` los te koppelen van zijn telefoon — Nick heeft dit al gedaan. Emiel kan zelf een nieuwe 2FA instellen bij overdracht.
- [ ] mijnrdb.nl verloopt 21 juli 2026 — Emiel moet laten weten of RDB dit domein behoudt.
- [ ] `webmaster@rdbdarts.nl` als e-mailaccount overdragen aan Emiel (na dat zijn Hub-toegang werkt).
- [ ] WPMU Dev Hub-klantrol "Webmaster" voor Emiel zelf instellen door Sander (rol is al opgehoogd, maar Sander wilde dit zelf doen — check of dit inmiddels rond is).
- [ ] Divi Machine-licentie (£25) is verlopen — geen actie gepland, alleen genoteerd.
- [ ] Marieke's werkadres-veld in Google Contacts nog met rommeltekst — Sander ruimt dit zelf op.
- [ ] CRM/INDEX.md mist nog steeds meerdere bestaande People-bestanden (o.a. emiel-theloosen, heleen-van-den-berg, bart, darren) — alleen nick-pol is deze sessie toegevoegd; brede opschoning nog niet gedaan (content drift, gemeld maar niet zelf volledig gefixt).

## Next steps

- Sander stuurt vanavond/maandag het felicitatiebericht + webmasteraccount + overdrachtsdocument naar Emiel.
- Bij volgende sessie: navragen of de ALV/huldiging zoals verwacht is verlopen en of Emiel is gekozen.
- Concept-factuur en Google Workspace-blocker zijn de twee belangrijkste losse eindjes om als eerste op te pakken.

## Cross-links

- [[2026-07-02-18-10_hermes_heleen-factuur-verzonden-rdb-emiel-planning]] — start van het RDB/Emiel-dossier
- [[project_rdb-emiel-website-overdracht]]
- [[Deliverables/2026-07-03-rdb-overdracht-emiel]]
- [[nick-pol]]

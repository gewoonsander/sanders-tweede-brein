---
agent_id: hermes
session_id: dt-irritant-roster-rdb-overdracht-afgerond-modus-conflict
timestamp: 2026-07-06T18:34:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes"]
---

# D.T. Irritant-selectie volledig gedocumenteerd, RDB/Emiel-overdracht afgerond, MODUS/John-conflict opgelost

## Context

Lange sessie met drie hoofdsporen: (1) D.T. Irritant's volledige teamselectie en Eredivisie-status uitzoeken en vastleggen in de CRM, inclusief een nieuwe Google Contacts-labelfunctie, (2) de RDB/Emiel-website-overdracht daadwerkelijk afronden (factuur, wachtwoorden, overdrachtsdocument), en (3) een oplopend conflict met John Lokken (ADC Europe) over de MODUS Super Series-formulieren tot een goede, doordachte reactie brengen. Daarnaast diverse losse WhatsApp-berichten voor familie, teamgenoten en het ADC-toernooi van vanavond.

## What we did

- **Tool-voorkeur bevestigd:** ingebouwde zoekfunctie/WebFetch eerst, Firecrawl alleen als fallback bij blokkades — vastgelegd als permanente memory (uit vorige sessie, hier voor het eerst toegepast: WebFetch faalde op dynamische Teambeheer-content, Firecrawl gaf ook geen resultaat, uiteindelijk opgelost via browser-navigatie).
- **Google Contacts — labelfunctie gebouwd:** de n8n-workflow "Contacten Beheer" (zoek-contact-tak) uitgebreid met het `memberships`-veld en `rawData: true`, gepubliceerd. Werkt nu: labels/groepen komen terug als group-ID's (bijv. `contactGroups/xxxx`), maar naamresolutie (ID → leesbare labelnaam) bleek niet triviaal te bouwen via de beschikbare n8n-nodetypes (HTTP Request-node accepteerde de bestaande credential niet voor de contactGroups.list-aanroep). Sander gaf aan hier voorlopig geen tijd voor te hebben — **open gelaten voor latere sessie.**
- **D.T. Irritant — volledige, geverifieerde selectie vastgelegd:**
  - Keano de Wit losgekoppeld van D.T. Irritant in de CRM (bleek alleen een ADC-toernooispeler die er ooit speelde als gast, geen teamlid) — [[dt-irritant]] en [[keano-de-wit]] beide gecorrigeerd.
  - Live Eredivisie-stand opgehaald via het Teambeheer-systeem (browser-navigatie, want zowel WebFetch als Firecrawl kregen alleen de widget-omhulling, niet de dynamisch geladen data): **D.T. Irritant staat 1e, ongeslagen** (20 wedstrijden, 16-4-0, 51 punten, saldo 149-51).
  - Volledige selectie (koppels/singles-scorelijsten, seizoen 25-26) uitgezocht: naast Sander zelf ("Sander Voz" in Teambeheer) spelen Jaimy Melchels, Jos Wenders, Frank Hoelen, Terry Lenting, Marc Vleghert, Niels van Zanten, Niels Haverdil en Thommy Schuurink.
  - Nieuwe CRM-bestanden aangemaakt: [[jaimy-melchels]], [[jos-wenders]], [[niels-van-zanten]], [[niels-haverdil]], [[thommy-schuurink]], [[terry-lenting]] — inclusief Teambeheer-spelerspaginalinks (op Sanders expliciete verzoek). Frank Hoelen, Marc Vleghert en Sanders eigen bestand kregen ook een weblink toegevoegd.
  - Duidelijk onderscheid vastgelegd tussen drie aparte competities: reguliere RDB-competitie (D.T. Irritant, Eredivisie), LaCo (waar Niels van Zanten vroeger ook met Sander speelde, nu afgesloten hoofdstuk) en Superleague.
  - Nieuwe CRM-persoon [[sjors-kathmann]] aangemaakt (darter Regio Oost, komt vaak bij Dartcafe Dubbel 10) + Google Contact aangemaakt met telefoonnummer.
- **Landelijke divisie/bekerkampioenschappen (5+6 september):** WhatsApp-conceptberichten gemaakt voor Jaimy/Frank/Thommy (vraag om vandaag te reageren over beschikbaarheid) en voor Rik van DartsCoaching.nl (teamdag-conflict op dezelfde datum, naamcorrectie Rick→Rik toegepast uit eerdere feedback-memory). Todoist-taak aangemaakt om dit op te volgen (deadline morgen 18:00). Later: definitieve beslissing gecommuniceerd (zaterdag afgezegd bij de NDB, zondag gaat door met Frank/Terry/Niels van Zanten/Sander).
- **ADC-toernooi vanavond (Arnhem):** dreigende afgelasting (6 van de 8 benodigde spelers) opgelost — uiteindelijk 7 man + Heidi als achtervang, toernooi ging gewoon door. Berichten voor John (ADC-directeur) opgesteld en verstuurd, Deliverable-bestand bijgewerkt met het verloop. Kort Dart Atlas-berichtje gemaakt voor de deelnemers. Managers-app-bericht opgesteld over posters/promotiemateriaal voor de Pub Qualifiers (verwijzing naar amateurdarts.eu en de ADC Europe Facebook-pagina's).
- **RDB/Emiel-overdracht — grotendeels afgerond:**
  - Conceptfactuur (€527,56) door Sander zelf omgezet naar live en verstuurd; factuurnotitie-tekst opgesteld (geen creditcard → bankoverschrijving, hele jaar 2026, volgende factuur januari 2027).
  - **Belangrijke correctie ontdekt en overal doorgevoerd:** WordPress-login is niet het standaard `/wp-admin/`-pad maar `rivierenlanddartsbond.nl/ikwilerin` (bewust afgeschermd) — gecorrigeerd in het overdrachtsdocument, het projectdossier en de conceptmail aan Emiel.
  - Volledige overdrachtstekst als Gmail-concept naar Emiel gestuurd (later herzien met de juiste login-URL) en door Sander verstuurd. WhatsApp-wachtwoordbericht opgesteld (email-account en Hub delen hetzelfde wachtwoord, apart van WordPress) en door Sander verstuurd.
  - Ontdekt dat de HMRC FEU-verklaring geen los formulier is maar pagina 2 van `Players Banks Details.pdf` — dat bestand bleek al volledig ingevuld en ondertekend (5 juli 2026) door Sander zelf.
  - Projectdossier ([[project_rdb-emiel-website-overdracht]]) bijgewerkt: factuur bevestigd, webmaster-inloggegevens overgedragen, eigen facturatiesysteem stopgezet. Nog open: WPMU Dev Hub-klantrol "Webmaster" voor Emiel (Sander denkt dat dit goed genoeg is, wil morgen nog dubbelchecken) en mijnrdb.nl-domeinbeslissing (21 juli-deadline, wacht op Emiel).
- **MODUS Super Series — conflict met John Lokken opgelost:**
  - Todoist-status gecheckt en 3 taken afgevinkt (contract naar John, bankformulier+FEU naar Beth, terugkoppeling naar John) na bevestiging dat Sander alles had verstuurd.
  - John reageerde kritisch: onduidelijk waarom Sander (ook) naar Beth had gestuurd i.p.v. alleen naar hem, het Agent form ontbrak nog, en een langer stuk over regioprestaties vergeleken met andere regiomanagers (Twan, Mathijs).
  - Uitgezocht en bevestigd: het Bank Details-formulier zelf zegt letterlijk op beide pagina's "Please email this form to beth@modussports.com" — een aantoonbare tegenstrijdigheid met John's "stuur alles naar mij"-instructie, wat Sanders keuze rechtvaardigde.
  - Doordachte, vriendelijke reactie opgesteld en verstuurd: Agent form alsnog toegevoegd (alleen naar John), uitleg over de Beth-tegenstrijdigheid (met cc naar John als transparantie), duidelijk gemaakt dat Twan/Mathijs andere regio's betreffen (dus los van Sanders functioneren), en een boodschap dat het vrijwilligerswerk uit passie gebeurt, op eigen tempo — met de expliciete, niet-defensieve opening dat John gerust iemand anders mag aanstellen als hij dat beter vindt.
  - Familie-WhatsApp-bericht gemaakt over een gemiste "Let's Stay Together"-avond (mama wandelen met tante Petra, papa naar Driel voor Superleague-overleg) — op verzoek zonder overbodige uitleg wie mama/papa zijn.

## Decisions made

- **Vraag:** Moet de Google Contacts-labelfunctie ook naamresolutie krijgen (ID → leesbare naam)?
  **Beslissing:** Niet nu — Sander heeft er geen tijd voor, blijft open voor een latere sessie.
- **Vraag:** Zaterdag 5 september (divisiekampioenschap) wel of niet door laten gaan?
  **Beslissing:** Niet — geen representatief team beschikbaar, Sander meldt dit af bij de NDB. Zondag (bekerkampioenschap) gaat wel door met de vier beschikbare spelers.
- **Vraag:** Hub-klantrol voor Emiel nu al grondig controleren, of voldoende vertrouwen dat het goed zit?
  **Beslissing:** Sander schat in dat het voldoende is, wil morgen nog een extra check doen — niet vandaag al verder uitgezocht.

## Insights

- Voice-to-text introduceert soms losse, onbedoelde fragmenten in berichten (bijv. "TV Gelderland 2021") — Sander bevestigde dat dit een vergissing was; goed dat dit expliciet gecheckt werd in plaats van blind verwerkt.
- Bij het MODUS/John-conflict bleek de kern van de spanning oplosbaar te zijn met feitelijke verificatie (het Bank Form zegt letterlijk "mail naar Beth") in plaats van alleen een verontschuldigende toon — dit paste bij Sanders eigen behoefte om zijn kant van het verhaal onderbouwd neer te zetten, niet enkel sussend te reageren.
- Herhaald patroon deze sessie: eerst zelf researchen/verifiëren (Teambeheer-scrape, PDF-inhoud, e-mailthread) voordat een bewering (van Sander of van een derde partij als John) wordt overgenomen — bevestigt eerdere feedback over transparantie en niet blind doorpoetsen.

## Realignments

- Eerste conceptmail aan Emiel bevatte de foute WordPress-inlog-URL (`/wp-admin/`) — Sander corrigeerde dit naar de bewust afgeschermde URL `/ikwilerin`; direct hersteld in alle drie de betrokken bestanden (Deliverable, projectdossier, nieuwe conceptmail).
- Eerste concept-reactie aan John vergeleek Sander onterecht direct met Twan/Mathijs zonder te vermelden dat dit andere regio's betreft — Sander corrigeerde dit expliciet, waarna de nuance is toegevoegd dat de vergelijking losstaat van zijn eigen functioneren.
- Sander gaf aan dat hij het contract wél (bewust) naar Beth had meegestuurd naast het bankformulier — een eerdere aanname (dat alleen het bankformulier naar Beth ging) werd zo gecorrigeerd, en de reactie aan John is daarop aangepast om dit eerlijk toe te lichten in plaats van te ontkennen.

## Open threads

- [ ] Google Contacts-labelnaamresolutie (ID → leesbare naam) — nog niet gebouwd, geen prioriteit voor nu.
- [ ] WPMU Dev Hub-klantrol "Webmaster" voor Emiel — Sander wil dit morgen (2026-07-07) nog dubbelchecken.
- [ ] mijnrdb.nl-domeinbeslissing (deadline 21 juli 2026) — wacht op Emiel.
- [ ] Reacties van Jaimy, Frank en Thommy over 5/6 september — deadline morgen 18:00 (Todoist-taak staat).
- [ ] MODUS: Agent form daadwerkelijk getekend/verstuurd? (concept was klaar, versturen is aan Sander).
- [ ] Reis + hotel Portsmouth boeken voor MODUS Week 11 (nog open, stond al langer).
- [ ] Team Inbox-backlog (4 screenshots, 15 documenten) nog onverwerkt.

## Next steps

- Bij volgende sessie: navragen of de Hub-klantrol-check voor Emiel is gedaan, en of Jaimy/Frank/Thommy gereageerd hebben over 5/6 september.
- MODUS-reistraject (Portsmouth) oppakken zodra Sander daar tijd voor heeft.

## Cross-links

- [[2026-07-05-23-38_hermes_modus-facebook-rdb-vervolg-firecrawl-voorkeur]] — vorige close, start van het Firecrawl-voorkeur-punt
- [[project_rdb-emiel-website-overdracht]]
- [[Deliverables/2026-07-03-rdb-overdracht-emiel]]
- [[Deliverables/2026-07-06-facebook-vooraankondiging-arnhem]]
- [[dt-irritant]]
- [[marc-vleghert]]

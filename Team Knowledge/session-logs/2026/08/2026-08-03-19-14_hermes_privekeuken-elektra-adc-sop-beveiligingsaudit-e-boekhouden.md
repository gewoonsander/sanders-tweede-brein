---
agent_id: hermes
session_id: privekeuken-elektra-adc-sop-beveiligingsaudit-e-boekhouden
timestamp: 2026-08-03T19:14:00+02:00
type: close-session
linked_sops:
  - SOP-015-adc-pub-qualifier-handleiding
linked_workstreams: []
linked_guidelines: []
---

# Privékeuken IKEA-elektra, ADC-toernooimanager-SOP, beveiligingsaudit & e-Boekhouden-archief — 3 augustus 2026

## Context

Lange sessie (vervolg na compactie) met een brede spreiding aan onderwerpen: afronding van de gewoonsander.nl SSL-crisis, een grondige security-audit van lokale secrets, het volledig uitwerken van de elektra-aansluiting voor Marieke's nieuwe IKEA-privékeuken, het opschonen van dubbele verbouwingsprojectbestanden, het archiveren van het e-Boekhouden bonnenarchief, en het documenteren van de officiële ADC-toernooimanager-procedure.

## What we did

### gewoonsander.nl SSL / WPMU Dev
- Root cause gevonden: een mislukte WPMU Dev add-on-betaling ($31,33) veroorzaakte het verlopen SSL-certificaat, niet een Versio-kwestie zoals eerst gedacht.
- Betaalmethode bijgewerkt door Sander (nieuwe creditcard na fraude-blokkade); ticket ingediend bij WPMU Dev Hub-support voor handmatige reissue van het certificaat.
- Site geverifieerd weer bereikbaar; Heleen (die de oorspronkelijke klacht had over een niet-werkende invite-link) geïnformeerd via WhatsApp door Sander.
- **GoDaddy-domeinoverdracht bleek over praktijkvoluitleven.nl te gaan, niet gewoonsander.nl** — los van dit probleem.

### Beveiligingsaudit secrets (onderzoek, nog niet gefixt)
- Anthropic API-key gevonden in platte tekst in twee launchd-plists (`audio-transcribe`, `superwhisper-meeting`) — wereld-leesbaar.
- Ontdekt dat er al een correct, laagfrictie patroon bestaat (`~/.config/gewoonsander/env`, chmod 600, buiten elke git-repo), al gebruikt door het nieuwste script (`classify_food_inbox.sh`).
- `Team Knowledge/.env` bleek ooit (28-06-2026) gecommit te zijn geweest vóór het gitignored werd — die commit staat nog op de gepushte GitHub-remote. Todoist-API-key daarin is daardoor gecompromitteerd; de 5 later toegevoegde secrets (Jortt, Firecrawl, Perplexity, Calendar) zijn nooit gecommit.
- Volledige bevindingen + geprioriteerde aanbevelingen vastgelegd in nieuw project: [[project_secrets-beveiliging-audit]] — bewust nog niet uitgevoerd, Sander had geen tijd, dit is een "later"-project.

### Team Inbox verwerking (meerdere rondes)
- IKEA-keukenplanner-bestanden (privékeuken): plattegrond, 2 maattekeningen, volledige 24-paginaproductlijst (€7.006, 113 onderdelen) — gearchiveerd in `PKM/Documents/`, samengevat in het verbouwingsbestand.
- Foto's van Quooker-typeplaatje (privékeuken, hergebruikt, COMBI+E, 2.200W) en HOWAT-doos (woonkeuken, 1.500W) — gegevens overgenomen in de projectnotitie, foto's op Sanders verzoek daarna verwijderd.
- Foto van de bestaande groepenkast (EMAT EGN16-32 B16-automaten met koppelbrug) — bevestigde dat de bestaande kookgroep 2× gekoppelde B16 is (7.360W), precies genoeg voor de nieuwe 7.350W-inductiekookplaat.
- 3 ADC-documenten (Darts Atlas-handleiding + 2 Excel-schema's) — gearchiveerd in `ADC/Documentatie/`, samengevat in nieuwe SOP-015.
- Een achtergrond-watcher (Bash + Monitor) opgezet om nieuwe Team Inbox-bestanden automatisch te detecteren tijdens de sessie — met een bekende beperking (baseline-snapshot kan bestanden missen die vlak vóór het starten van de watcher al binnenkwamen).

### Verbouwingsproject — opschoning duplicaten
- 4 losse/verouderde projectbestanden ontdekt die allemaal over dezelfde Huismanstraat 34-verbouwing gingen (`bouwlog-badkamer-toilet.md` met unieke technische inhoud, 2 lege stub-bestanden, en `buitenkraan-vervangen.md`).
- Unieke inhoud (egaliseer-kluslijst, douche/bad-specs, afvoerroute) overgezet naar het hoofdbestand [[verbouwing-huismanstraat-34]]; de 4 losse bestanden verwijderd; INDEX.md bijgewerkt.
- Cockpit-database (`mypka.db`) twee keer geregenereerd om de consolidatie door te laten komen in de mypka-cockpit-app.

### Privékeuken — volledige elektra-uitwerking
- Aansluitwaardes opgezocht voor alle IKEA-apparaten (MATMÄSSIG inductiekookplaat 7.350W, FRILLESBO oven 2.800W, KALLBODA vaatwasser ~2.000-2.400W, MÅNGSBO afzuigkap, SKOGSNÄS koelvriescast).
- Bestaande groepenkast (16 groepen) doorgenomen samen met Sander; groep 6 bleek — anders dan de notitie zei — al in gebruik voor de Deel (gecorrigeerd).
- **Definitieve groepsindeling vastgesteld** — alle apparaten passen op 4 bestaande groepen, geen nieuwe aanleg nodig: groep 1 (kookplaat, 2× gekoppelde B16), groep 3 (wandcontactdozen + lichtgroep + koelkast + afzuigkap + opkamer/kelder), groep 11 (Quooker + vaatwasser samen), groep 12 (nieuwe oven).
- Bewuste risico-afweging gemaakt: Quooker+vaatwasser samen ondanks dat de nameplate-som (4.200-4.600W) op papier de 3.680W van een B16 overschrijdt — gebaseerd op Sanders trackrecord dat deze combinatie in de oude keuken altijd goed ging (thermostatisch schakelende verwarmingselementen, geen continue vollast).
- FRILLESBO-oven geverifieerd: geen stoomfunctie, dus geen extra wateraansluiting nodig.

### e-Boekhouden bonnenarchief
- 3 zip-exports (Gewoon Sander bonnen + Gezinshuis/Gewoon Thuis bonnen, samen 2.404 bestanden, ~545MB) gevonden in Downloads.
- Standaard `unzip` liep vast op verminkte bestandsnamen (encoding-fouten) — opgelost met een eigen Python-extractiescript met foutafhandeling.
- Bewust NIET in de git-vault gezet (te zwaar voor de git-geschiedenis) — in plaats daarvan naar de Lexar SSD (`/Administratie/`) én naar Google Drive (via de lokale sync-map) gekopieerd, als 3-2-1-back-up.
- Uitgelegd waarom de Gmail-downloadlink geen betrouwbare back-up is (tijdelijke link, geen bijlage) — de daadwerkelijke bestanden zijn de enige echte back-up.

### BTW-aangifte
- Bevestigd via een e-mail van de Belastingdienst: BTW-aangifte 2e kwartaal 2026, uiterste inleverdatum 31-07-2026 (destijds nog enkele dagen weg) — normaliter afgehandeld door Bart (VMB Advies), gezien zijn trackrecord een check-in aanbevolen.

### ADC toernooimanager-procedure
- Uitgebreid gezocht (Mediahub-spiekbrief, Downloads, amateurdarts.eu/RULES) naar de officiële regelingen voor toernooimanagers.
- Uiteindelijk het definitieve document gevonden via Team Inbox: de officiële Darts Atlas "Pub Qualifier – Handleiding" (ADC Europe, update 02-01-2026) + 2 bijbehorende Excel-schema's.
- Samengevat en vastgelegd als nieuwe **SOP-015-adc-pub-qualifier-handleiding**, met verwijzing vanuit de bestaande SOP-010/012 en de adc.md-topic.

## Decisions made

- **Vraag:** Quooker en vaatwasser samen op één groep in de privékeuken, ondanks dat de nameplate-som de B16-grens overschrijdt?
  **Besluit:** Ja — gebaseerd op bewezen praktijkervaring uit de oude keukenopstelling.
- **Vraag:** Koelkast bij de Quooker/vaatwasser-groep of apart?
  **Besluit:** Apart (groep 3, bij wandcontactdozen/lichtgroep) — risico-overweging, niet capaciteit.
- **Vraag:** e-Boekhouden bonnenarchief in de git-vault of daarbuiten?
  **Besluit:** Daarbuiten — Lexar SSD + Google Drive, vanwege de repo-grootte (~545MB).
- **Vraag:** Wat te doen met de 4 dubbele/verouderde verbouwingsprojectbestanden?
  **Besluit:** Unieke inhoud samenvoegen in het hoofdbestand, dubbele/lege bestanden verwijderen.
- **Vraag:** Beveiligingslek (API-keys) nu direct fixen?
  **Besluit:** Nee, eerst grondig onderzoeken en vastleggen als apart project voor later (Sander had geen tijd).

## Insights

- Het bestaande `~/.config/gewoonsander/env`-patroon (chmod 600, buiten de git-repo) was al correct geïmplementeerd voor het nieuwste script — de oudere scripts liepen gewoon achter op een patroon dat al bestond, geen nieuwe infrastructuur nodig om te fixen.
- Een gitignore-regel verwijdert een bestand niet met terugwerkende kracht uit de git-geschiedenis — als het ooit gepusht is, blijft het in de remote-geschiedenis staan tot expliciet opgeschoond.
- Bij het combineren van apparaten op één elektragroep is het onderscheid tussen "nameplate-vermogen" (piekwaarde van het verwarmingselement) en "werkelijk gelijktijdig verbruik" (thermostatisch schakelend, zelden allebei tegelijk vol) doorslaggevend voor de praktijk — en verklaart waarom een op-papier-overbelaste combinatie in de praktijk toch al jaren goed gaat.
- Downloads-map bleek een onverwacht rijke bron voor losse documentatie (ADC-handleiding, e-Boekhouden-archieven) die niet via de PKM zelf te vinden was.

## Realignments

- Sander corrigeerde de aanname dat groep 6 in de groepenkast "vrij" was — die was al in gebruik voor de Deel. Dit veranderde de beschikbare-groepen-rekensom van "1-2 tekort" naar uiteindelijk "precies genoeg via herindeling."
- Sander corrigeerde de Quooker/HOWAT-verwarring: twee aparte toestellen in twee aparte keukens (HOWAT → woonkeuken, hergebruikte Quooker → privékeuken), niet één toestel zoals eerst aangenomen.
- Sander wees erop dat de foto van de groepenkast liet zien dat de kookgroep 2× gekoppelde B16-automaten heeft (niet één enkele B16), wat de eerder gesignaleerde "krappe marge"-zorg oploste tot "net voldoende."

## Open threads

- [ ] Groep 1 (2× gekoppelde B16 voor de inductiekookplaat) laten bevestigen door Ralf/elektricien — marge is maar 10W.
- [ ] Beveiligingsaudit (zie [[project_secrets-beveiliging-audit]]) nog niet uitgevoerd: Anthropic-key roteren, Todoist-key roteren, git-geschiedenis eventueel opschonen, GitHub-repo-zichtbaarheid checken.
- [ ] WPMU Dev SSL-reissue: bevestigen dat het certificaat daadwerkelijk (opnieuw) is uitgegeven na de handmatige ticket-actie.
- [ ] BTW-aangifte Q2 2026: navragen bij Bart of dit op tijd is afgehandeld (deadline was 31-07-2026).
- [ ] Privékeuken: aannemer, planning en montage nog te regelen — geen harde planning, gepland na 1 september.
- [ ] KALLBODA-vaatwasser en MÅNGSBO-afzuigkap: exacte aansluitwaarde nog niet gevonden (alleen schattingen), niet kritiek gezien de definitieve groepsindeling al rond is.

## Next steps

- Volgende sessie: check of Ralf de kookgroep-marge heeft bevestigd, en of de privékeuken-planning verder concreet wordt (aannemer, datum).
- Beveiligingsaudit oppakken zodra Sander tijd heeft — begin met de twee "moet"-acties (Anthropic- en Todoist-key roteren), dat is onafhankelijk van de rest.
- ADC: SOP-015 gebruiken als naslagwerk bij het volgende Pub Qualifier-seizoen.

## Cross-links

- [[project_secrets-beveiliging-audit]] — volledige beveiligingsbevindingen, nog uit te voeren
- [[verbouwing-huismanstraat-34]] — hoofdbestand, nu geconsolideerd, met de nieuwe privékeuken-elektra-sectie
- [[SOP-015-adc-pub-qualifier-handleiding]] — nieuwe ADC-procedure
- [[project_praktijkvoluitleven-migratie]] — eerdere sessie, gerelateerd aan de WPMU Dev/Heleen-context

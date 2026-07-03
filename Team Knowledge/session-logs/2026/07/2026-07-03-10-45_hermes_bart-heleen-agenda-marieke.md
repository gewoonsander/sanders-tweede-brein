---
date: 2026-07-03
time: 10:45
agent: hermes
topic: bart-heleen-agenda-marieke
---

# Sessielog — 3 juli 2026, 10:45 — Hermes

## Wat we deden

**Bart (boekhouder, uitstel Belastingdienst):**
- Vastgelegd dat Bart de administratie voert voor alle drie de bedrijven (GewoonSander, Gewoon Thuis, Praktijk Gewoon Zijn) plus de inkomstenbelasting van Sander én Marieke privé — de aangifte loopt per persoon, niet per bedrijf.
- Belastingdienst gebeld: geen uitstel geregistreerd voor beide aangiftes. Bart verzekerde dat er collectief al uitstel was aangevraagd, en bood aan een eventuele boete zelf te betalen.
- Conceptmail opgesteld, als Gmail-concept klaargezet en door Sander verzonden (geverifieerd via `search_threads`: 2026-07-03 06:38 naar bart@vmbadvies.com). Zie [[bart]].

**Heleen (praktijkvoluitleven.nl):**
- WhatsApp-tekst opgesteld voor de vraag of ze zelf uit het instellen van Outlook komt (mail-instellingen zijn zichtbaar in haar portal).
- Factuur INV-0003 bleek betaald te zijn naar Sanders oude bankrekening — root cause gevonden: het bankrekeningveld op WPMU Dev-facturen staat rechtstreeks instelbaar in de Hub zelf (geen Stripe-koppeling, Athena's eerste hypothese klopte niet). Sander heeft dit zelf gecorrigeerd.
- Handleiding-actiepunt weer verwijderd op Sanders verzoek (maakt hij pas als Heleen erom vraagt). Zie [[project_praktijkvoluitleven-migratie]].

**RDB (overdracht aan Emiel):**
- Lering uit de Heleen-case vastgelegd: bij het opzetten van RDB-facturatie een notitieveld toevoegen dat overmaken kan als er geen creditcard is. Zie [[project_rdb-emiel-website-overdracht]].

**Team Inbox verwerkt:**
- Penn heeft alle items geanalyseerd en gefileerd (notities/entities/journal), Hermes heeft de fysieke bestanden verplaatst/opgeschoond (Penn had geen Bash-toegang). Oude/duplicate factuurversies verwijderd, GoDaddy-receipts verwerkt tot overzicht + nieuwe Organization [[godaddy]], screenshot gelogd in het journaal.
- Audio-opname (07:36) blijft liggen — geen transcriptiemogelijkheid in deze sessie.

**Gezinsbeslissing — agenda-inzicht voor Marieke:**
- Realignment: aanvankelijk voorstel (auto-kopiëren naar privé-agenda) bijgesteld na twee rondes verduidelijking met Sander. Uiteindelijke kern van het probleem: Marieke ziet op Sanders GewoonSander-Workspace-agenda alleen "bezet" omdat zij buiten de organisatie zit; ze wil alle details kunnen zien (niet bewerken) om haar dag af te stemmen, zonder dat Sander zijn werkwijze (één hoofdagenda) hoeft te veranderen.
- Daedalus onderzocht en vond: de external-sharing-beperking is een instelbare Google Workspace Admin Console-instelling ("External sharing options for primary calendars"), geen harde limiet. Sander is vermoedelijk zelf de enige domeinbeheerder van gewoonsander.nl.
- Definitief advies: domeininstelling aanpassen naar "Share all information, but outsiders cannot change calendars", dan Marieke's privé Gmail-adres (emjvoz@gmail.com) toevoegen aan de GewoonSander-agenda met permissie "Alle details van gebeurtenissen bekijken" (read-only).
- **Sander heeft dit zelf al uitgevoerd** tijdens de sessie. Deliverable-handleiding is daarna verwijderd (niet meer nodig), open beslissing in `PKM/.user.yaml` afgevinkt.
- Bevestigingsmail naar Marieke opgesteld en als Gmail-concept klaargezet, met haar koosnaam uit de verkeringstijd ("Mooie lieve witte vogel" — verwijzing naar haar meisjesnaam Zwaan).

## Insights / realignments

- **Feedback vastgelegd:** klantcommunicatie namens GewoonSander (eenmanszaak, geen personeel) moet altijd "ik/mij" zijn, nooit "wij/ons" — geldt niet voor communicatie namens het gezin/Gewoon Thuis samen met Marieke. Zie [[feedback_klantcommunicatie_ik_niet_wij]] (globaal memory-bestand).
- **Feedback vastgelegd:** bij een Gmail-concept dat Sander zegt te hebben verzonden, zelf verifiëren via `list_drafts`/`search_threads` in plaats van zijn melding als feit aan te nemen. Zie [[feedback_verifieer_verzendstatus_gmail]] (globaal memory-bestand).
- **Open punt:** Sander heeft geconstateerd dat Marieke meerdere keren dubbel in zijn Google Contacts staat — nog niet opgelost, toegevoegd aan `open_beslissingen`.
- **Capability-check:** deze Cowork-sessie heeft geen Google Contacts-tool (wel Gmail en Agenda) — Sander vermoedde dat een terminal-Claude Code-sessie hier mogelijk wel toegang toe heeft (bijv. via Daedalus/n8n-koppeling); niet geverifieerd binnen deze sessie.
- **Niet opgepakt (op Sanders verzoek):** tokengebruik/credits loggen in de close-session-procedure — blijft voorlopig liggen, geen taak van gemaakt.

## Openstaande zaken

- Audio-opname Team Inbox (07:36) — nog te transcriberen.
- Google Contacts opschonen (dubbele Marieke-contacten).
- Heleen: reactie afwachten op Outlook-instellen; resterend Versio-tegoed; klant-record e-mailadres ooit terugzetten; WPMU Dev klantportaal/ticket-integratie afronden.
- RDB: datum verifiëren (prijsuitreiking vs. ALV 4 juli); toegang voor Emiel regelen; facturatie-notitieveld bij opzet.
- Marieke: bevestigen dat het concept met de koosnaam is verstuurd en dat ze de agenda-details daadwerkelijk kan zien.

## Cross-links

- [[bart]] — boekhouder, uitstel-dossier
- [[heleen-van-den-berg]] / [[project_praktijkvoluitleven-migratie]] — migratie & klantbeheer
- [[project_rdb-emiel-website-overdracht]] — RDB-overdracht + facturatie-lering
- [[marieke-van-ockenburg-zwaan]] / [[gewoon-thuis]] — agenda-inzicht
- [[godaddy]] — nieuwe Organization uit Team Inbox-verwerking

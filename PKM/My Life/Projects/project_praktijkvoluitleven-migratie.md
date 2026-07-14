---
name: Praktijkvoluitleven.nl Migratie & Klantbeheer
status: active
key_element: financien
linked_people:
  - heleen-van-den-berg
tags:
  - hosting
  - klant
  - webhosting
---

# Praktijkvoluitleven.nl Migratie & Klantbeheer

## Why this matters

Sander beheert de website en hosting van [[heleen-van-den-berg]] (Praktijk Voluit Leven). De site is verhuisd van Versio naar Sanders eigen WPMU Dev-multisite, en het domein is inmiddels naar GoDaddy verhuisd. Dit project houdt de volledige migratiestatus en het lopende klantbeheer (mail, facturatie, klantportaal-toegang) op één plek bij.

## Status update

Meest recent bovenaan.

- **2026-07-09** — Heleens ticket "E-mail instellen in Outlook" (4 juli) opgevolgd: DNS-check bevestigde dat MX en Autodiscover voor praktijkvoluitleven.nl schoon zijn (geen restant van Versio), dus het probleem zat lokaal in haar Outlook/Windows-profiel (oud .ost-bestand + gecachte credentials die het nieuwe account overschreven). Reactie met diagnose en stappenplan (data-bestand verwijderen, Referentiebeheer opschonen, handmatig opnieuw instellen met mail.mailconfig.net) door Sander zelf in het WPMU Dev-ticketsysteem geplaatst. Los daarvan bleek het ticket niet zichtbaar in Sanders eigen Hub-dashboard — vermoedelijk gerelateerd aan de nog niet afgeronde ticket-e-mailintegratie (zie open threads).
- **2026-07-03** — Heleen bevestigt dat ze de IMAP/SMTP-instellingen zelf kan zien in haar portal (haar wens was om Outlook te blijven gebruiken). WhatsApp-bericht gestuurd (persoonlijk, "ik"/"mij" — GewoonSander is een eenmanszaak zonder personeel): vraag of ze er zelf uitkomt met het instellen van Outlook, met het aanbod om te helpen als dat niet lukt. Sander zorgt daarnaast voor een handleiding/instructies die ze erbij krijgt.
- **2026-07-02 (vervolg, later op de dag)** — Factuur en portaal afgerond:
  - Productafbeeldingen toegevoegd aan "Hostingpakket" (grijs "Host"-icoon) en "Gebruik Divi" (paars "Divi"-icoon) in WPMU Dev Hub Client Billing, in dezelfde stijl als de bestaande .nl- en RDB-icoontjes.
  - Ontdekt dat Heleens klantrol in de Hub niet "Access Billing Only" is (zoals eerder gepland), maar de aangepaste rol **"Klant - Mail en Facturering"** — deze heeft ook "Pro Email" ingeschakeld, wat haar in het klantportaal (gewoonsander.nl) toegang geeft tot het bekijken/configureren van haar eigen mailaccount, inclusief IMAP/SMTP-instellingen.
  - IMAP/POP3/SMTP-instellingen voor Outlook opgezocht: server `mail.mailconfig.net`, IMAP 993 (SSL), POP3 995 (SSL), SMTP 465 of 587 (SSL) — gebruikersnaam is het volledige e-mailadres.
  - WhatsApp-bericht naar Heleen gestuurd: vraag of ze deze instellingen zelf in haar portal terugvindt (anders volgt een ticket met de gegevens), plus melding dat de gecombineerde 2025+2026-factuur onderweg is (met een luchtige "niet schrikken"-toon over het bedrag).
  - **Factuur INV-0003 (€328,96 incl. btw) is verzonden naar Heleen** — status nu "Payment Due". Notitie op de factuur bevat een persoonlijk bedankberichtje.

- **2026-07-02 (eerder op de dag)** — Grote sessie met meerdere afgeronde deeltaken:
  - Heleens WordPress-account (bestond al, stond op "Abonnee") verhoogd naar rol "Editor" via Netwerkbeheer — kan nu zelf content bewerken. WhatsApp-bericht gestuurd: kleine aanpassingen zijn gratis service, grotere structurele wijzigingen vereisen overleg (tijdelijk hogere rechten + risico-afweging).
  - Divi Builder-toegang voor Heleen geverifieerd als reeds volledig werkend binnen de Editor-rol (live getest via de "User Switching"-plugin) — geen aanpassing nodig.
  - WPMU Dev cloud-verbinding van de hele multisite was losgeraakt (niet een specifiek plugin-conflict); Sander heeft opnieuw ingelogd en de verbinding hersteld. De eerder "vastzittende" Snapshot-back-up voor praktijkvoluitleven.nl bleek gewoon uitgefaseerd te zijn ten gunste van de netwerkbrede Hosting Backup (dekt haar subsite automatisch mee) — geen bug, geen actie nodig. Enige aandachtspunt: een restore van de Hosting Backup is all-or-nothing voor de hele multisite, niet per subsite.
  - 696 spamcomments op oude standaard-posts opgeruimd via bulk "Markeer als spam" (batches van 100 bleken het enige betrouwbare formaat) — moderatiewachtrij nu leeg (0), enige legitieme comment blijft staan.
  - GoDaddy-domeinoverdracht geverifieerd: de eigenlijke transfer was €0,00 (Order #4076120925, 1 juli 2026), maar de factuurregel is desondanks op €7,99 gezet — dat is de reële toekomstige verlengingsprijs en wordt de standaardprijs voor domeinverlengingen.
  - Facturatieproducten aangemaakt in WPMU Dev Hub Client Billing: "Hostingpakket" (2025 €119,88 + 2026 incl. webmail/updates €144,00), bestaand product "Domeinnaam verlenging" uitgebreid met regel voor praktijkvoluitleven.nl (€7,99), en "Gebruik Divi incl. updates" (€0,00 — een aparte kortingsregel bleek technisch niet mogelijk omdat het Hub-platform geen negatieve bedragen accepteert, dus is er voor gekozen om Divi-gebruik gewoon op €0 te zetten in plaats van een aparte korting te tonen).
  - Heleen bleek al als klant te bestaan in de Hub onder bedrijfsnaam "Praktijk Voluit Leven" (heleen_meems@hotmail.com, status Actief) — niet gevonden bij eerste zoekpoging omdat gezocht werd op voornaam in plaats van bedrijfsnaam.
  - Gecombineerde 2025+2026-factuur samengesteld en **als concept opgeslagen** (nog niet verzonden, in afwachting van Sanders eigen controle): subtotaal €271,87, btw 21% €57,09, totaal €328,96.

- **2026-07-02 (vroeger op de dag)** — WPMU Dev klantportaal wordt opgezet voor Heleen: rol "Access Billing Only" + Ticket Support, via een volledig white-labeled Hub Client-omgeving op gewoonsander.nl (merknaam, logo, zwart/wit/rood kleurenschema, SMTP via Google Workspace-alias `webstuff@gewoonsander.nl` — werkend getest). Reden voor deze route: Sander verloor zijn eigen SSO-toegang tot Heleens mailbox zodra het e-maildomein aan haar klant-record gekoppeld werd (WPMU Dev's bedoelde privacy-mechanisme, geen bug). Testklant-flow met Stripe-credit-truc gepland voor eind-tot-eind-verificatie voordat Heleen echt wordt uitgenodigd.
- **2026-07-01** — Mail-DNS/MX voor `heleen@praktijkvoluitleven.nl` gefixt via WPMU Dev. Back-up e-mailadres bevestigd: `heleen_meems@hotmail.com`.
- **2026-06-27** — Migratie afgerond: afbeeldingen overgezet, URL's gerepareerd (Better Search Replace), DNS bij Versio aangepast, WordPress multisite-URL ingesteld, SSL actief. Site live op `praktijkvoluitleven.nl`. Domein sindsdien verhuisd naar GoDaddy (bevestigd via GoDaddy-portfolio-check op 2026-07-02, vervaldatum 21 juli 2026, auto-renew aan).
- Versio-account (`voluitleven`) en het reseller-account zijn inmiddels volledig opgezegd — nog wel resterend tegoed van Versio te ontvangen.

## Open threads

- [ ] WPMU Dev klantportaal + ticket-e-mailintegratie afronden en testen (in uitvoering)
- [x] Heleen bestaat al als klant in de Hub (Praktijk Voluit Leven, heleen_meems@hotmail.com, status Actief, rol "Klant - Mail en Facturering")
- [x] **Factuur Heleen (2025+2026)** — betaald via overboeking (2026-07-03), €328,96 incl. btw. Niet via klantportal betaald — daar kan alleen met creditcard betaald worden
- [x] Heleen bevestigt: kan de IMAP/SMTP-instellingen zelf terugvinden in haar portal onder "Pro Email" (2026-07-03)
- [x] Heleens reactie kwam als ticket (4 juli): lukt niet zelf. Diagnose + stappenplan gegeven (2026-07-09).
- [ ] Zichtbaarheid tickets in Sanders Hub-dashboard uitzoeken — ticket-e-mailintegratie stond al als "in uitvoering" genoteerd, mogelijk hier de oorzaak van.
- [ ] Heleens reactie afwachten of het stappenplan haar Outlook-probleem oplost.
- [x] Heleen heeft betaald naar een **oudere zakelijke rekening** van Sander (niet zijn huidige) — bevestigd: de oude rekening stond nog op de door WPMU Dev automatisch gegenereerde factuur (Heleen heeft dus niets fout gedaan)
- [x] **Bankrekening op WPMU Dev-facturen bijgewerkt.** Sander heeft het bankrekeningveld dat op de factuur komt rechtstreeks aangepast in de WPMU Dev Hub zelf (geen Stripe-koppeling nodig, Athena's Stripe-hypothese klopte dus niet). Toekomstige facturen tonen automatisch de juiste rekening — geen apart appje naar Heleen nodig.
- [ ] Resterend tegoed van Versio nog te ontvangen
- [ ] Heleen informeren over de volledige overstap (nieuwe inloggegevens, mailinstellingen)
- [ ] Klant-record e-mailadres van Heleen ooit terugzetten naar heleen@praktijkvoluitleven.nl zodra haar eigen mailbox-toegang stabiel is (nu bewust op heleen_meems@hotmail.com om Sanders SSO-toegang niet te breken)

## Next steps

- Heleens reactie afwachten op de vraag over het instellen van Outlook
- Testklant-flow (Stripe-credit-truc) doorlopen voor volledige eind-tot-eind-verificatie van het klantportaal (optioneel, portal werkt in de praktijk al)

## Cross-links

- [[2026-06-27-00-00_Larry_praktijkvoluitleven-migratie-dns-ssl]] — migratiesessie DNS/SSL
- [[2026-07-01-01-22_hermes_email-inbox-postnl-boekfactuur]] — mail-DNS/MX fix
- [[2026-07-02-08-44_hermes_permissies-en-heleen-case]] — start van het klantportaal-traject
- [[2024-02-05-gewoonsander-factuur-2159-praktijkvoluitleven]] — historische factuur uit het Versio-tijdperk (2024)
- [[2026-07-02-gewoonsander-invoice-inv-0002]] — testfactuur portaalverificatie (bewijs van de IBAN-fix)
- [[2026-07-03-gewoonsander-invoice-inv-0003-heleen-van-den-berg]] — definitieve, betaalde factuur 2025+2026 (€328,96)

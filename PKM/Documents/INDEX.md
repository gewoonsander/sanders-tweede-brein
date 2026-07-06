# Documents - Index

Markdown stubs that describe and point at the user's real documents (passports, contracts, IDs, certificates). The actual files often live elsewhere (cloud drive, encrypted vault). The stub holds metadata, expiration dates, and links.

## Active files

- [[passport]] — seeded course sample. Shows the canonical shape of a document stub.
- [[2026-05-02-plugandpay-lite-factuur]] — Plug&Pay Lite jaarabonnement mei 2026, €217,80, factuurnr. 202617346.
- [[2026-05-22-canva-pro-factuur]] — Canva Pro factuur mei 2026, €110,00, factuurnr. 04889-45250792.
- [[2026-05-29-meetingverslag-ralf-gesprek-5]] — Meetingverslag Ralf, gesprek 5, 29 mei 2026.
- [[2026-04-06-adviesrapport-fh-team]] — Adviesrapport FH Team (Ferry Haag), april 2026. Duurzame installaties Huismanstraat 34.
- [[2026-06-10-ibood-factuur-xiaomi-speaker]] — iBOOD factuur juni 2026, €30,90, Xiaomi Speaker + ZAGG Mat.
- [[2026-06-10-offerte-warmtepomp-fh-team]] — Offerte nr. 260049, FH Team, warmtepomp Viessmann 16kW, €24.508,17 incl. BTW.
- [[2026-06-12-concept-mail-ferry-fh-team]] — Conceptmail aan Ferry Haag met vragen over de warmtepomp offerte.
- [[2025-09-01-boek-darttactiek-van-beginner-tot-professional]] — Boek van Sander, sept. 2025, verkoop via gewoonsander.plugandpay.com.
- [[2025-12-11-coaching-voorstel-marc-vleghert]] — Hybride coaching + sponsoringvoorstel voor Marc Vleghert, €40/mnd, 12 mnd traject.
- [[2026-01-13-intake-marc-vleghert]] — Intake coachgesprek Marc Vleghert, achtergrond, tijdlijn, doelen, risico's.
- [[2026-02-10-coachgesprek-marc-vleghert-sessie-2]] — Coachsessie 2 Marc Vleghert, Dutch Open bespreking, afspraken logboek + routine.
- [[apparaten]] — levend overzicht van alle digitale hardware (specs, locatie, garantie). `doc_type: inventory`.
- [[software-en-tools]] — levend overzicht van gebruikte software/tools en abonnementen. `doc_type: inventory`.

### Geïmporteerd uit Apple Notities (6 juli 2026)

- [[ideeenbus]] — ideeën voor content rond Dart Buddies-robotjes en quotes.
- [[challenges-dartbuddies]] — brainstorm challenges om content te creëren voor Dart Buddies.
- [[bedtijden-kinderen]] — bedtijdenschema van de kinderen.
- [[inpaklijst-darten]] — paklijst voor dartstoernooien.
- [[quotes]] — verzamelde quotes, met ingesloten afbeelding.
- [[kort-verhaal-fragment-philip-toine]] — opgeslagen tekstfragment (Philip/Toine), oorsprong onduidelijk.
- [[concept-brief-petra-schoolsanctie]] — conceptbrief aan Petra over een schoolsanctie.
- [[dartbuddies-landingspagina-link]] — link naar de Dart Buddies-landingspagina.
- [[afwasbeurten]] — afwasschema huishouden.
- [[dieet]] — dieetnotities.
- [[dubbel-10-drukwerk]] — link naar drukwerkbestanden Dubbel 10.
- [[boek-kortingscode]] — kortingscode voor het darttactiek-boek.
- [[dartresultaten-overzicht]] — overzicht dartresultaten/plaatsingen, met ingesloten afbeelding.
- [[darts-checkout-140-notitie]] — checkout-notatie (T18 T18 D16 = 140).
- [[keukentimer-pomodoro-product]] — opgeslagen productomschrijving keukentimer.
- [[mantra-focus-energie-flow]] — persoonlijke mantra/quote.
- [[zakgeld-xanne-lynn]] — zakgeldregistratie Xanne Lynn.
- [[declaratie-145-euro]] — declaratienotitie €145.
- [[ndb-rdb-lidnummers]] — NDB/RDB-lidnummers (ook Marc Vleghert).
- [[maten-sander]] — kledingmaten Sander.
- [[badkamer-boven-huismanstraat]] — maatvoering badkamer boven, Huismanstraat.
- [[biljart-tafelmaten]] — maatvoering biljarttafel.

## What goes here

- Identity documents (passport, ID card, driver's license).
- Contracts the user wants to remember exists, even if the binary file lives in a vault.
- Certificates (degrees, training, certifications).
- Any official document that needs metadata captured in markdown.

## What does not go here

- Daily notes (those go in [[PKM/Journal/INDEX|Journal]]).
- Personal projects or goals (those go in [[PKM/My Life/INDEX|My Life]]).
- Research reports (those go in `Deliverables/`).

## Naming

Kebab-case slug. Datumgedreven bestanden (facturen, offertes, rapporten, mails) krijgen een ISO-datumprefix: `YYYY-MM-DD-<slug>.md`. De datum is de datum van het brondocument, niet de verwerkingsdatum. Tijdloze documenten (passport, contracten zonder specifieke datum) blijven zonder prefix.

Voorbeelden: `passport.md`, `2026-05-22-canva-pro-factuur.md`, `2026-06-10-offerte-warmtepomp-fh-team.md`.

See [[GL-001-file-naming-conventions]].

## Image embeds

If a document has scans, those go to `PKM/Images/YYYY/MM/` and are embedded via `![[Images/YYYY/MM/...]]` from the document stub. The image is in Images. The stub points at it. SSOT.

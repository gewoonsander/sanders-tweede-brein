# Bonnetjesproces Gezinshuis — Architectuur/Haalbaarheidsonderzoek

**Date:** 2026-07-05
**Prepared by:** Pax (Senior Researcher)
**Decision:** Hoe optimaliseer je het bonnetjes-proces voor Gezinshuis "Gewoon Thuis" (bunq + Jortt), met als doel: foto maken → automatisch gekoppeld aan de juiste transactie/boeking
**Bouwt voort op:** [[2026-06-28-jortt-api-research]] (Jortt: OAuth 2.0 Client Credentials, Expenses + Inbox endpoints bevestigd, 10 req/s, geen sandbox, subscription-status Gezinshuis-account nog niet geverifieerd)

---

## Executive Summary

bunq heeft een volwaardige REST API met attachment- en note-attachment-endpoints waarmee een foto aan een specifieke transactie gekoppeld kan worden — maar bunq matcht zelf niets automatisch via de API; dat matchen (welke transactie hoort bij dit bonnetje) is en blijft een externe stap. Claude Vision is daarvoor een geschikte, al-in-huis oplossing (hoge nauwkeurigheid op bedrag/datum/winkel-extractie) en kan via n8n gecombineerd worden met bunq's transactie-lijst om de juiste match te vinden. bunq's real-time callback/webhook-systeem maakt een event-driven flow mogelijk in plaats van pollen. De aanbeveling is een hybride SSOT: bunq als visuele koppelplek (bonnetje zichtbaar naast transactie, zoals Sander wil), Jortt als boekhoudkundige SSOT (definitieve boeking), met n8n als de laag die één foto naar beide systemen distribueert zodat er nooit twee handmatige invoerpunten ontstaan.

---

## Onderzoeksvragen — bevindingen

**1. bunq API: bonnetjes, bijlagen, transacties — Confidence: High (mechaniek) / Medium (limieten)**
bunq heeft een publieke REST API (`doc.bunq.com`, ook gespiegeld op GitHub `bunq/doc`). Authenticatie: een zelf-gegenereerde **API key** uit de bunq-app volstaat voor privégebruik ("API keys are best suited for private use... only you have access to your application"); OAuth is alleen verplicht voor publieke/third-party apps. Elke API-request moet bovendien client-side worden **ondertekend met een private/public keypair** (device-registratie via `POST /device-server`) — dit is fundamenteel anders dan Jortt's simpele OAuth-bearer-token en verhoogt de technische drempel voor een generieke "HTTP node + Bearer token"-aanpak in n8n.
Relevante endpoints: `POST /user/{userID}/monetary-account/{id}/attachment` (upload foto, levert `attachment_id`), en `POST /user/{userID}/monetary-account/{id}/payment/{paymentID}/note-attachment` (body: `{description, attachment_id}`) om de bijlage aan een specifieke, al-bekende transactie te koppelen.
Sandbox bestaat (`public-api.sandbox.bunq.com`, dummy-user via `POST /sandbox-user`).
Rate limits (bron: bunq's eigen docs, per IP/endpoint): 3 GET/3s, 5 POST/3s, 2 PUT/3s — ruim voldoende voor een gezinshuis-volume, maar te laag voor agressief pollen.
Contradictie gevonden tussen secundaire bronnen over ondersteunde bestandsformaten (jpg/png/gif vs. jpg/png/pdf) — niet opgelost, testen vóór bouw.
~~Open vraag, Medium confidence: ... verifieer dit voor het specifieke Gezinshuis-account.~~ — **opgelost, 2026-07-05:** bevestigd door Sander. Het Gezinshuis gebruikt een gedeelde rekening onder een **bunq Pro**-abonnement — de vereiste plan-tier voor API-toegang is dus aanwezig. Zie [[bunq]].

**2. Automatische koppeling bonnetje ↔ transactie — Confidence: High (mechaniek) / Medium (afwezigheid van auto-match)**
bunq's eigen mobiele app heeft een native "bon scannen"-functie die een foto automatisch aan de juiste transactie lijkt te suggereren (bevestigd via meerdere bunq Together-forumdraden). Dit is echter een **client-app-functie, niet iets dat via de publieke API aan te sturen of te scripten is** — er is geen gedocumenteerd endpoint dat OCR of matching namens jou uitvoert. Via de API moet je zelf (a) de juiste `paymentID` vinden (bijv. via `GET .../payment` gefilterd op datum/rekening) en (b) die expliciet koppelen met `note-attachment`. Matching is dus altijd een externe stap — bunq doet het transport, niet de intelligentie.

**3. OCR/AI voor bedrag, datum, winkel + matching — Confidence: Medium-High**
Claude Vision haalt in meerdere onafhankelijke 2026-bronnen (developersdigest.tech, claudeimplementation.com, een DEV.to case study "Finley") hoge-90%-nauwkeurigheid op gestructureerde documenten als bonnetjes/facturen, met "Structured Outputs" (JSON-schema via tool use) om betrouwbaar `{bedrag, datum, winkel, confidence}` terug te krijgen. Omdat Sander al met Claude/Anthropic werkt, is dit de logische route boven een aparte OCR-vendor (Google Vision, Textract, Mindee e.d.) — één leverancier minder om te beheren. Alternatief, ter vergelijking: Jortt heeft zelf "Scan & Herken" (OCR, exclusief voor Jortt Plus-abonnees, bevestigd via jortt.nl + zelfboekhouden.com-review) — dit concurreert met een eigen Claude-pipeline en is het overwegen waard als "kant-en-klaar"-alternatief, mét de kanttekening dat het dan alleen richting Jortt werkt, niet richting bunq.

**4. n8n / automatisering — Confidence: Medium (bunq node) / Low-Medium (Jortt node)**
Geen n8n-community-node gevonden specifiek voor Jortt — bevestigt het beeld uit de vorige brief dat een generieke HTTP Request-node tegen Jortt's REST API nodig is. Voor bunq bestaat een community-node (`n8n-nodes-bunq`, npm-auteur "wartnerio"), maar de npm-pagina was niet inzichtelijk (403) en de volledigheid/onderhoudsstatus voor attachment/note-attachment-operaties kon niet geverifieerd worden — **niet vertrouwen op marketingtekst, Daedalus moet 'm eerst zelf testen**, of rechtstreeks tegen bunq's REST API + request-signing bouwen. Positief: bunq's **callback/webhook-systeem** (notification-filter-url, HTTPS-only, tot 5 retries) maakt een event-driven trigger mogelijk — n8n hoeft niet te pollen op nieuwe transacties, wat efficiënter en rate-limit-vriendelijker is dan het poll-model uit de Jortt-brief.

**5. bunq vs Jortt als SSOT — dit is een architectuurkeuze, geen feit**
*Voor bunq als SSOT:* transacties staan er al, Sander's expliciete voorkeur, native attachment-koppeling bestaat technisch, real-time webhooks beschikbaar.
*Tegen bunq als SSOT:* bunq is geen boekhoudpakket — geen BTW-categorisatie, geen jaarrekening-rapportage, geen accountant-toegang; het bonnetje "leeft" er wel zichtbaar maar wordt niet fiscaal verwerkt.
*Voor Jortt als SSOT:* is het daadwerkelijke boekhoudsysteem — Expenses/Inbox-endpoints bestaan al (vorige brief), rapportage en aangifte lopen hierop.
*Tegen Jortt als SSOT:* minder intuïtief gekoppeld aan de bank-transactie zelf; Sander moet er apart naartoe, wat precies het probleem is dat hij nu ervaart met bunq.
**Aanbeveling: hybride, geen enkelvoudige SSOT.** bunq = visuele/transactie-koppelplek (menselijk controlepunt: "zit het bonnetje bij de juiste uitgave"). Jortt = boekhoudkundige waarheid (het telt voor de aangifte). n8n's eigen verwerkingslog = de derde laag die voorkomt dat hetzelfde bonnetje twee keer verwerkt wordt (zie vraag 6).

**6. Dubbel werk voorkomen — Confidence: High (architectuurredenering, geen externe bron nodig)**
Het risico ontstaat zodra er twee onafhankelijke menselijke invoerpunten zijn (bijv. Sander mailt een bonnetje naar Jortt Inbox ÉN plakt het los in bunq). Oplossing: **één enkel invoerpunt** (de foto/Shortcut naar n8n), waarna n8n programmatisch naar zowel bunq (attachment) als Jortt (expense) distribueert — Sander uploadt zelf nooit twee keer. n8n houdt een verwerkingslog bij (bijv. hash van de foto of attachment_id) om te voorkomen dat een al-verwerkt bonnetje per ongeluk opnieuw wordt ingeschoten.

**7. Eenvoudigste workflow: alleen een foto — zie aanbevolen proces hieronder.**

---

## Aanbevolen end-to-end proces

1. **Foto maken** — via een iOS Shortcut (of vergelijkbaar) die de foto direct naar een n8n-webhook stuurt. Eén actie, geen app-keuze nodig.
2. **n8n ontvangt de foto** → stuurt 'm naar Claude (vision + structured output) voor extractie van `{bedrag, datum, winkelnaam, confidence}`.
3. **n8n haalt kandidaat-transacties op** via bunq's `GET .../payment` (gefilterd op de boodschappenrekening, recente periode).
4. **Matching:** fuzzy-match op bedrag + datum (+ winkelnaam als tie-breaker).
   - Eén duidelijke match → automatisch doorgaan.
   - Meerdere/onduidelijke matches of lage OCR-confidence → n8n stuurt Sander één bevestigingsvraag (bijv. via bericht) in plaats van blind te koppelen.
5. **Koppelen in bunq:** n8n uploadt de foto als attachment en linkt 'm via `note-attachment` aan de juiste `paymentID` — het bonnetje is nu zichtbaar naast de transactie, precies zoals Sander wil.
6. **Parallel naar Jortt:** dezelfde foto + geëxtraheerde data gaat naar Jortt's Expenses/Inbox-endpoint, zodat de boekhouding het ook heeft — zonder dat Sander het zelf nog een keer aanlevert.
7. **Trigger, geen polling:** stap 2 kan ook (deels) event-driven starten via bunq's webhook op nieuwe transacties, zodat n8n al een kandidaat-lijst klaar heeft staan tegen de tijd dat de foto binnenkomt.

Dit is de eenvoudigste route voor Sander (één handeling: foto) en het meest betrouwbaar omdat de matching-stap een expliciete escalatie heeft bij twijfel — in plaats van een stil, mogelijk foutief automatisch koppelmoment. Toekomstbestendig omdat het niet leunt op één opaque black-box-feature (bunq's interne app-scan), maar op een zelf gecontroleerde, aanpasbare pipeline.

---

## Aanbeveling SSOT

**Hybride: bunq als visuele koppelplek, Jortt als boekhoudkundige SSOT, n8n-log als anti-dubbelwerk-laag.** Geen van beide alleen dekt de volledige behoefte — bunq mist boekhoudlogica, Jortt mist de transactie-nabijheid die Sander expliciet wil. Zie vraag 5 voor de volledige argumentatie.

---

## Anti-patterns om te vermijden

- **Zelf OCR bouwen terwijl Claude Vision al 97%+-nauwkeurigheid haalt op gestructureerde bonnetjes** — wielen heruitvinden.
- **Vertrouwen op bunq's native in-app scan-functie voor een geautomatiseerde flow** — dit is een UI-feature, niet scriptbaar via de API; het dwingt Sander om binnen de bunq-app te fotograferen in plaats van via één simpele Shortcut.
- **Twee onafhankelijke handmatige invoerpunten laten bestaan** (los uploaden naar bunq én naar Jortt) — precies de bron van dubbel werk uit vraag 6.
- **Stil automatisch koppelen bij een onzekere match** — twee identieke bedragen op dezelfde dag moet een bevestigingsvraag opleveren, geen gok.
- **bunq-authenticatie behandelen als een simpele Bearer-token-flow** — de vereiste request-signing (private/public keypair) is een andere technische opgave dan Jortt's OAuth en moet als zodanig gepland worden.
- **Agressief pollen op bunq's transactie-endpoint** — bij 3 GET/3s per IP is een event-driven (webhook) opzet zowel robuuster als rate-limit-vriendelijker.
- ~~Bouwen zonder eerst te verifiëren of het Gezinshuis-account de vereiste abonnementen heeft~~ — **beide nu bevestigd (2026-07-05):** bunq Pro (gedeelde rekening) en Jortt MKB (beide accounts). Groen licht om verder te gaan naar de technische verificatiestap (bestandsformaten, community-node testen).

---

## Limitations / nog te verifiëren

- ~~Of het Gezinshuis bunq-account op bunq Pro zit~~ — **opgelost, 2026-07-05:** bevestigd, gedeelde rekening onder bunq Pro.
- ~~Of het Gezinshuis Jortt-account het vereiste MKB/Plus-abonnement heeft~~ — **opgelost, 2026-07-05:** bevestigd via boekhouder Bart. Beide Jortt-accounts (`sander@gewoonsander.nl` en `gewoonthuis@alberozorggroep.nl`) staan op het plan **Jortt MKB**. Zie [[jortt]] en [[gewoon-thuis]].
- Exacte bestandsformaat- en groottelimieten voor bunq-attachments — tegenstrijdige secundaire bronnen (jpg/png/gif vs. jpg/png/pdf), niet zelf getest.
- Volledigheid en onderhoudsstatus van de `n8n-nodes-bunq` community-node — npm-pagina niet toegankelijk (403), niet geverifieerd.
- Of bunq's API ergens een verborgen/ongedocumenteerd matching- of OCR-endpoint heeft naast de client-app-functie — afwezigheid van documentatie is geen sluitend bewijs van afwezigheid; navragen bij bunq-support is een optie vóór bouw.

---

## Aanbevolen volgende stappen (voor Daedalus, bij eventuele implementatie)

1. ~~Verifieer het bunq- en Jortt-abonnement~~ — **beide bevestigd:** bunq Pro (gedeelde rekening) + Jortt MKB (beide accounts). Klaar om met stap 2 (API-key aanvragen) te starten.
2. Vraag een bunq API-key + keypair aan voor het Gezinshuis-account; test eerst in de sandbox.
3. Test de `n8n-nodes-bunq` community-node direct (installeren, inspecteren) vóór erop te vertrouwen; val anders terug op een generieke HTTP-node met zelfgebouwde request-signing.
4. Bouw een klein testscript: upload een dummy-attachment, koppel 'm via note-attachment aan een sandbox-payment, bevestig het bestandsformaat-gedrag.
5. Ontwerp de Claude-vision-extractieprompt met een `confidence`-veld en test tegen 10-15 echte bonnetjes voor je de matching-logica bouwt.
6. Richt de escalatie-flow in (bericht naar Sander bij onzekere match) vóórdat de volledige pipeline live gaat.

---

## Methodology

- Voortgebouwd op bestaande Jortt-bevindingen uit `2026-06-28-jortt-api-research.md` (niet dubbel onderzocht).
- Primaire bronnen: `doc.bunq.com` (attachment, note-attachment, authenticatie, rate-limits, callbacks), gespiegeld op `github.com/bunq/doc`.
- Secundaire/cross-check bronnen: bunq Developers Corner (Medium), sbstjn.com (technische implementatie-blog callbacks), bunq Together community-forum (native scan-functie), jortt.nl (Scan & Herken), zelfboekhouden.com (Jortt-review), fintechcompass.net + bunq's eigen plan-pagina's (abonnement-vereiste), developersdigest.tech / claudeimplementation.com / dev.to (Claude Vision-nauwkeurigheid op bonnetjes).
- Zoekopdrachten liepen via bunq API-documentatie, n8n community-node-registers, en Claude Vision structured-extraction case studies.

---

## Bronnen

- [bunq API Documentation — Start here](https://doc.bunq.com/api-reference/start-here)
- [bunq API — Attachment](https://doc.bunq.com/api-reference/attachment)
- [bunq API — Note Text & Attachment](https://doc.bunq.com/note-text-and-attachment)
- [bunq API — Payment note-attachment](https://doc.bunq.com/note-text-and-attachment/payment)
- [bunq API — Authentication](https://doc.bunq.com/basics/authentication)
- [bunq API — API Keys](https://doc.bunq.com/basics/authentication/api-keys)
- [bunq API — Rate Limits](https://doc.bunq.com/basics/rate-limits)
- [bunq API — Callbacks (Webhooks)](https://doc.bunq.com/basics/callbacks-webhooks)
- [bunq API — Sandbox](https://beta.doc.bunq.com/basics/sandbox)
- [GitHub — bunq/doc](https://github.com/bunq/doc)
- [Medium — bunq API anatomy: Notes, attachments, and content export](https://medium.com/bunq-developers-corner/bunq-api-anatomy-notes-attachments-and-content-export-a35fd220cfa2)
- [Medium — Untangling bunq OAuth and other authentication methods](https://medium.com/bunq-developers-corner/untangling-the-bunq-oauth-and-other-account-authentication-methods-which-to-use-in-your-app-701b5c3aeb70)
- [sbstjn.com — bunq API: Configure Callbacks](https://sbstjn.com/blog/bunq-webhook-callback-configuration-api/)
- [bunq Together — Bunq functie bonnetje scannen](https://together.bunq.com/d/46060-bunq-functie-bonnetje-scannen)
- [GetMyInvoices — bunq integratie](https://www.getmyinvoices.com/en/integration/import-documents-and-receipts-automatically-from-bunq/)
- [bunq — Compare plans](https://www.bunq.com/personal-account/banking-plans)
- [fintechcompass.net — bunq Review 2026](https://fintechcompass.net/personal-bank-accounts/bunq/)
- [Jortt — Jortt Inbox](https://www.jortt.nl/boekhouden/boekhouden-uitleg/jortt-inbox/)
- [Jortt — Scan en Herken](https://www.jortt.nl/boekhouden/boekhouden-uitleg/scan-en-herken/)
- [zelfboekhouden.com — Jortt Review 2025](https://zelfboekhouden.com/jortt/)
- [developersdigest.tech — Claude Vision API production guide](https://www.developersdigest.tech/blog/claude-vision-api-production-guide)
- [claudeimplementation.com — Claude Vision API guide](https://claudeimplementation.com/blog/claude-vision-api)
- [DEV.to — Getting Claude to Extract Invoice Data Reliably ("Finley")](https://dev.to/vaibhav_kushwaha_e8eb243e/finley-j3h)
- [aibase.com — n8n-nodes-bunq repository mirror](https://www.aibase.com/repos/project/n8n-nodes-bunq)

---
title: Gratis grotendeels automatische KPN-factuurworkflow
date: 2026-08-14
status: proposed
owner: Daedalus
requested_by: Sander
related: "[[2026-08-14-kpn-facturen-automatisch-ophalen]]"
---

# Gratis grotendeels automatische KPN-factuurworkflow

## Doel

Een KPN-factuurmail zonder bijlage leidt betrouwbaar en zonder nieuwe betaalde dienst tot een gedownloade, canoniek gearchiveerde en aan Jortt aangeleverde factuur. myPKA bewaart status en bronherkomst; Gmail blijft de correspondentiebron.

## Randvoorwaarden

- Bestaande stack: Gmail, MijnKPN, Jortt, myPKA en Google Drive.
- Geen wachtwoorden, 2FA-codes, herstelcodes of sessiecookies in chat of myPKA.
- Een afzonderlijk lokaal browserprofiel bewaart de KPN-sessie; Sander logt alleen opnieuw in wanneer KPN het onthouden apparaat niet meer vertrouwt.
- Wachtwoorden, 2FA-codes, herstelcodes en sessiecookies komen nooit in chat, myPKA of git.
- Geen KPN-mail verwijderen voordat download, archivering en Jortt-aanlevering afzonderlijk zijn bewezen.
- Geen extra betaald platform toevoegen.

## Aanpak A — Begeleid per factuur

Pieter herkent iedere nieuwe KPN-factuurmail en start direct één gecontroleerde casus. Sander hoeft alleen in te loggen wanneer de MijnKPN-sessie verlopen is en bevestigt de upload naar Jortt op het moment van uitvoeren.

**Voordelen:** gratis, weinig techniek, eenvoudig controleerbaar, werkt ondanks 2FA en portaalwijzigingen.

**Nadelen:** niet volledig onbeheerd; soms is een korte handeling van Sander nodig.

## Aanpak B — Maandelijkse batch

Pieter bewaart de KPN-factuurmeldingen en verwerkt Mobiel en Internet samen tijdens één maandelijkse boekhoudronde.

**Voordelen:** minder loginmomenten en twee facturen in één werksessie.

**Nadelen:** facturen blijven langer onverwerkt; een gemiste batch veroorzaakt achterstand.

## Aanpak C — Lokale browserrobot met uitzonderingsafhandeling (aanbevolen)

Pieter signaleert een KPN-factuurmelding via Gmail. Een lokale service op Sanders Mac start vervolgens Playwright met een uitsluitend voor MijnKPN bestemd, blijvend browserprofiel. Sander logt bij de inrichting één keer zelf in en kiest bij KPN **Onthoud dit apparaat**. Daarna haalt de service de juiste PDF op, verifieert de inhoud, archiveert het bestand en levert een verwerkingskopie aan Jortt. Pieter meldt alleen uitzonderingen.

**Voordelen:** het normale maandproces verloopt zonder handeling van Sander; geen extra betaald platform; lokaal te beveiligen en testen; herhaalbaar en controleerbaar.

**Nadelen:** KPN kan alsnog een herlogin, 2FA of CAPTCHA afdwingen en de website kan wijzigen. Daarom is 100% werking zonder ooit nog menselijke tussenkomst niet eerlijk te garanderen. De realistische doelstelling is volledig automatisch bij de normale maandruns en alleen Sander inschakelen bij een blokkade.

## Technisch ontwerp voor aanpak C

1. **Detectie:** een lokale planner bevraagt Gmail periodiek op nieuwe KPN-factuurmeldingen. Dit vermijdt de extra inrichting van Google Cloud Pub/Sub. Gmail Push blijft een latere optimalisatie; een `watch` moet ten minste iedere zeven dagen worden vernieuwd.
2. **Wachtrij en idempotentie:** sla alleen technische status op, met Gmail-message-ID en leverancier + product + factuurperiode als unieke sleutel. Een herhaalde run maakt nooit een tweede dossier of upload.
3. **Authenticatie:** Playwright gebruikt een apart persistent `userDataDir`. De eerste login en eventuele KPN-herauthenticatie doet Sander zelf. Het profiel en eventuele geheimen staan buiten myPKA en git, met lokale bestandsrechten; een wachtwoord mag uitsluitend uit macOS Sleutelhanger komen als latere herlogin-automatisering expliciet wordt goedgekeurd.
4. **Ophalen:** open rechtstreeks het factuuroverzicht, selecteer op product en factuurperiode en download uitsluitend een PDF.
5. **Verifiëren:** controleer PDF-signatuur, leverancier, klant/product, factuurdatum, factuurnummer en bedrag. Vergelijk waar mogelijk datum en bedrag met de aankondigingsmail.
6. **Bewaren:** upload de PDF naar de canonieke Google Drive-map. Leg in het myPKA-documentrecord de Drive-locatie, Gmail-bronlink en verwerkingsstatus vast.
7. **Boekhouding:** lever een verwerkingskopie aan Jortt via de aantoonbaar werkende route. Sluit de casus pas als ontvangst is bevestigd.
8. **Afronding:** archiveer of verwijder de aankondigingsmail pas na geslaagde controles. Schrijf een auditregel zonder wachtwoorden, cookies of volledige financiële inhoud.
9. **Uitzondering:** stuur Hermes één concrete melding bij verlopen sessie/2FA, CAPTCHA, ontbrekende factuur, afwijkend bedrag, gewijzigde pagina, mislukte upload of dubbelzinnige productmatch.

## Automatiseringsgrens

- **Normale run:** volledig automatisch, zonder browserhandeling van Sander.
- **Incidentele herauthenticatie:** Pieter opent de juiste KPN-loginpagina; Sander voltooit login/2FA, waarna de service verdergaat.
- **Niet verantwoord als basis:** SMS-berichten automatisch uitlezen of 2FA-herstelcodes opslaan om iedere beveiligingscontrole te omzeilen.
- **Niet gegarandeerd:** dat KPN een onthouden apparaat permanent blijft vertrouwen of de pagina nooit wijzigt.
- **Wel haalbaar:** een exception-based proces waarbij Sander alleen bij de zeldzame stopcondities wordt bevraagd.

## Aanbevolen operationeel proces

1. **Trigger:** Pieter herkent een nieuwe mail van KPN met een maandfactuur voor Mobiel of KleinZakelijk Internet.
2. **Bron vastleggen:** bewaar de werkende Gmail-threadlink en lees product, factuurperiode en aangekondigd bedrag uit de mail.
3. **Idempotentie:** controleer op leverancier + product + factuurdatum/periode. Bestaat de PDF of Jortt-casus al, maak dan geen duplicaat.
4. **Canonieke taak:** maak via [[SOP-022-verwerk-persoonlijke-taak]] een `next`-taak wanneer downloaden nog nodig is. Gebruik geen fictieve deadline; de factuurmail is de trigger.
5. **Authenticatie:** gebruik het afzonderlijke blijvende MijnKPN-browserprofiel. Alleen bij een nieuwe beveiligingscontrole neemt Sander het invoeren van login/2FA over.
6. **Download:** download de juiste PDF en controleer dat product, factuurdatum/periode en bedrag overeenkomen met de mail.
7. **Bestandsnaam:** hernoem conform [[GL-001-file-naming-conventions]], bijvoorbeeld `2026-07-25-factuur-kpn-kleinzakelijk-internet.pdf` of `2026-07-27-factuur-kpn-mobiel.pdf`.
8. **Canoniek archief:** archiveer het document in Google Drive onder `documenten/06-financien/facturen/kpn/<jaar>/`. Dit is de canonieke bestandslocatie; Jortt ontvangt een verwerkingskopie.
9. **Documentrecord:** maak of actualiseer een `PKM/Documents/`-record vanuit de verplichte template met de Google Drive-locatie en de Gmail-bronlink.
10. **Jortt-aanlevering:** na eenmalige goedkeuring van dit vaste proces mag de service de PDF automatisch naar de overeengekomen Jortt-ingang sturen en de ontvangst controleren. Betalen blijft buiten deze automatisering.
11. **Afronden:** sluit de myPKA-taak pas wanneer archief én Jortt zijn bevestigd. Verplaats de KPN-mail daarna volgens Sanders mailregel naar archief of prullenbak.

## Stopcondities

- Verkeerde of ontbrekende factuur: niets uploaden; casus open laten en via Hermes melden.
- Bedrag of periode wijkt af van de mail: factuur bewaren, niet automatisch verwerken, afwijking melden.
- MijnKPN-sessie verlopen: Sander laten inloggen; nooit geheime gegevens opvragen in chat.
- Jortt-upload onbevestigd: taak niet sluiten en mail niet verwijderen.
- Canonieke Google Drive-opslag ontbreekt: Jortt-kopie alleen is onvoldoende om de casus als volledig afgerond te markeren.

## Niet in deze eerste versie

- Automatisch omzeilen van een nieuwe KPN-login, 2FA-uitdaging of CAPTCHA.
- Automatisch betalen.
- Aannemen dat de bestaande Jortt–Dropbox-keten werkt; die blijft afzonderlijk te onderzoeken.
- Historische KPN-facturen massaal downloaden.

## Implementatie na goedkeuring

1. Maak eerst een read-only proef die met een apart browserprofiel één bestaande factuur lokaliseert en naar een tijdelijke map downloadt.
2. Verifieer de PDF-parser en idempotentie met die factuur; nog niets naar Jortt sturen en geen mail verwijderen.
3. Maak `SOP-024-verwerk-kpn-factuur-zonder-bijlage.md` en voeg de vaste KPN-regel en SOP-link toe aan Pieter Posts contract en `Team Knowledge/INDEX.md`.
4. Verifieer afzonderlijk de definitieve Google Drive- en Jortt-ingang.
5. Schakel daarna pas automatische archivering en Jortt-aanlevering in; mailverwijdering volgt als laatste fase.

## Proefresultaat 2026-08-14

De read-only proef is uitgevoerd met de al ingelogde MijnKPN-sessie.

- Sessiebehoud werkt: het factuuroverzicht kon zonder nieuwe login of 2FA worden geopend.
- Selectie werkt: de robot kon facturen onderscheiden op product, datum en bedrag. Als proefobject is de mobiele factuur van 27 juli 2026 à € 29,00 gekozen.
- De download zelf kon niet worden voltooid: MijnKPN meldde op dat moment **We kunnen je factuur momenteel niet laden. Probeer het later nog eens.** Zowel de bekijk- als downloadbediening leverde daardoor geen document op.
- Er is niets naar Jortt of Google Drive verzonden en er is niets in Gmail gewijzigd of verwijderd.

Dit is precies een beoogde stopconditie: de automatisering mag een niet-beschikbare factuur niet als succes registreren. Een volgende proefrun kan dezelfde idempotente casus hervatten zodra KPN de PDF weer levert.

Een tweede proef met de KleinZakelijk Internet-factuur van 25 juli 2026 à € 116,28 gaf dezelfde KPN-brede laadfout en geen download. Daarmee ligt het probleem niet aan de selectie van de mobiele factuur, maar aan de actuele beschikbaarheid van factuurdocumenten in MijnKPN.

## Technische bronnen

- [Playwright — authenticatiestaat bewaren en hergebruiken](https://playwright.dev/docs/auth)
- [Playwright — persistent browser context](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context)
- [KPN — tweestapsverificatie en Onthoud dit apparaat](https://www.kpn.com/tweestapsverificatie)
- [Gmail API — pushnotificaties en vervaldatum van watch](https://developers.google.com/workspace/gmail/api/guides/push)
- [Apple — Keychain Services](https://developer.apple.com/documentation/security/keychain-services)

---
title: KPN-facturen automatisch ophalen
date: 2026-08-14
status: research-complete
owner: Athena
requested_by: Sander
---

# KPN-facturen automatisch ophalen

## Conclusie

Voor KPN EEN MKB is Peppol de voorkeursroute: KPN kan facturen rechtstreeks afleveren bij een Peppol-ID en Jortt ondersteunt het ontvangen van Peppol-facturen. Voor reguliere MijnKPN-producten is geen gedocumenteerde publieke factuur-API gevonden. Heronderzoek bevestigt echter dat een gratis lokale browserrobot een goede terugvalroute kan zijn: Playwright kan een afzonderlijk blijvend browserprofiel met ingelogde sessiestaat hergebruiken en KPN biedt **Onthoud dit apparaat**. Het normale maandproces kan daardoor zonder Sanders tussenkomst verlopen. Alleen volledig foutloos functioneren zonder ooit een herlogin, 2FA/CAPTCHA of reparatie na een portaalwijziging kan niet worden gegarandeerd.

## Kostenrandvoorwaarde

Sander kiest standaard voor gratis oplossingen of functies die al binnen zijn huidige softwarestack vallen. De voorkeursvolgorde is daarom: bestaande Jortt/Peppol-functionaliteit, gratis KPN-instellingen, een begeleide bestaande browsersessie en pas als laatste lokaal maatwerk. Een nieuwe betaalde dienst wordt alleen voorgesteld wanneer de bestaande stack aantoonbaar tekortschiet en Sander de meerwaarde vooraf kan beoordelen.

## Sanders actuele situatie

In Gmail staan recente maandfactuurmeldingen voor KPN Mobiel en KPN Thuis zonder PDF-bijlage. Oudere KPN-mails bevatten wel PDF-facturen. De huidige mails noemen twee afzonderlijke klantnummers; die worden hier wegens financiële gevoeligheid niet herhaald.

Op 2026-08-14 is Sanders huidige Jortt-account gecontroleerd en met zijn expliciete toestemming aangemeld op Peppol. De actieve keuze is **e-facturen kunnen versturen en ontvangen**. Jortt bevestigt de status **Aangemeld op het Peppol-netwerk** voor de reeds bekende KvK- en btw-identificatie. De pagina draagt geen Jortt Plus-markering. De begeleidende tekst zegt nog dat ontvangen "binnenkort" beschikbaar wordt, terwijl de ontvang-optie actief is; de praktische ontvangst van een leveranciersfactuur moet daarom nog worden geverifieerd.

Sanders ingelogde MijnKPN-omgeving is eveneens gecontroleerd. De huidige mobiele en thuisproducten staan in het consumentenportaal; het factuuroverzicht biedt per factuur alleen **bekijken** en **downloaden**. In de zichtbare account- en factuurinstellingen is geen Peppol-koppeling, boekhoudkoppeling of instelling voor een PDF-bijlage per e-mail aanwezig. KPN EEN MKB ondersteunt Peppol volgens de zakelijke documentatie, maar op basis van dit portaal kan niet worden bevestigd dat Sanders huidige producten daarvoor in aanmerking komen. De gratis terugval is een begeleide browserdownload vanuit de bestaande MijnKPN-sessie.

De KPN-chat identificeerde het internetproduct expliciet als **KPN KleinZakelijk Internet 1 Gbit/s** en het mobiele product afzonderlijk als een mobiel abonnement. Op Sanders verzoek is gevraagd of beide maandfacturen voortaan als PDF-bijlage per e-mail kunnen worden verstuurd. De digitale assistent kon de vraag niet beantwoorden en routeerde alleen naar bestaande factuur-/betaalgegevens, waar geen bezorgvorm voor PDF-bijlagen zichtbaar werd. Een definitief ja/nee vereist daarom een menselijke KPN-medewerker; de selfservice biedt deze instelling niet aan.

Aanvullend onderzoek vond een concrete bevestiging op de KPN Community van 13 maart 2025. Een KPN-moderator kon in de klantadministratie zien dat bij een klant was ingesteld dat de PDF per e-mail werd ontvangen. Daarmee is aangetoond dat de instelling ten minste voor sommige KPN-klanten/producten bestaat, ook al is zij niet zichtbaar als zelfbedieningsoptie in Sanders MijnKPN. De eerstvolgende voorkeursactie is daarom niet verder browsermaatwerk bouwen, maar KPN vragen de instelling per klantnummer voor zowel Mobiel als KleinZakelijk Internet te activeren. KPN biedt geen algemeen klantenservice-e-mailadres; de officiële routes zijn chat, een belafspraak en het online contactformulier. Op 2026-08-14 is hiervoor een ontvangerloos Gmail-concept aangemaakt dat ook in het contactformulier kan worden geplakt.

## Routevolgorde

1. Controleer en activeer binnen het bestaande Jortt-abonnement het ontvangen van e-facturen via Peppol; Jortt vermeldt dat Peppol voor zijn gebruikers gratis is.
2. Laat KPN controleren of beide huidige abonnementen onder KPN EEN MKB vallen en of het Jortt-Peppol-ID aan beide debiteuren kan worden gekoppeld.
3. Als Peppol niet beschikbaar is, vraag KPN of PDF-facturen opnieuw per e-mail kunnen worden meegestuurd.
4. Alleen als beide routes ontbreken: laat Pieter de factuurmail herkennen en een lokale MijnKPN-downloadservice starten met een apart persistent browserprofiel. Sander richt de eerste login en **Onthoud dit apparaat** eenmalig in; normale runs zijn daarna automatisch. Bij een nieuwe beveiligingsuitdaging vraagt Pieter alleen om herauthenticatie. Sla geen wachtwoord, herstelcode, 2FA-code of sessiestaat op in chat, myPKA of git.
5. Archiveer de opgehaalde factuur via de nog te verifiëren Jortt/Dropbox-route en bewaar de Gmail-bronlink in de canonieke myPKA-casus.

## Bronnen

- [KPN — MijnKPN facturen](https://www.kpn.com/service/administratie/facturen)
- [KPN — KPN EEN MKB facturen en Peppol](https://www.kpn.com/zakelijk/service/kpn-een-mkb/facturen)
- [KPN — MijnKPN Zakelijk en tweestapsverificatie](https://www.kpn.com/zakelijk/service/kpn-een-mkb/mijnkpnzakelijk)
- [Jortt — e-facturen versturen en ontvangen via Peppol](https://www.jortt.nl/support-bar/factuur-maken/factuur-maken-uitleg/e-facturen-sturen-met-peppol/)
- [Jortt — changelog Peppol ontvangen](https://www.jortt.nl/over-ons/changelog/)
- [KPN Community — moderator bevestigt dat PDF per e-mail in de administratie kan zijn aangezet](https://community.kpn.com/facturen-administratie-en-acties-125/kan-ik-de-factuur-als-pdf-bijlage-ontvangen-632123)
- [KPN — officiële contactmogelijkheden en online contactformulier](https://www.kpn.com/service/ugs?icid=vraag-stellen)

## Open verificaties

- Vallen Sanders huidige KPN Thuis- en Mobiel-klantnummers daadwerkelijk onder KPN EEN MKB?
- Kan KPN hetzelfde Peppol-ID aan beide debiteuren koppelen?
- Hoe loopt een ontvangen KPN-Peppol-factuur in Sanders Jortt-inrichting door naar Dropbox en de boekhouder?
- Wil KPN klantenservice de huidige producten alsnog aan Peppol koppelen of PDF-bijlagen per e-mail herstellen?

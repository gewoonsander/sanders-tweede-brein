# Downloadlog NDB-reglementen

- **Opgehaald door:** Daedalus (Automation Specialist)
- **Downloaddatum:** 2026-08-21
- **Bronpagina:** <https://ndbdarts.nl/kennisbank/reglementen> (HTTP 200, opgehaald 2026-08-21)
- **Stagingmap:** `PKM/Documents/NDB-Kennis/bronnen/`
- **Auth-model:** geen — publieke, niet-geauthenticeerde HTTPS-downloads. Geen tokens, cookies of credentials gebruikt.
- **Methode:** `curl` met browser-User-Agent, 3 pogingen met oplopende backoff (2s/4s), download naar `.part` en pas hernoemd na verificatie op PDF-magicbytes (`%PDF`). Idempotent herhaalbaar.

## Samenvatting

| | Aantal |
|---|---|
| Documentlinks gevonden op de bronpagina | 35 (29 unieke NDB-PDF's + 6 externe ISR-verwijzingen) |
| Succesvol gedownload | 35 PDF's (29 NDB + 6 ISR) |
| Mislukt | 0 |
| Niet gedownload (geen document) | 1 (ISR-hubpagina, zie §Niet-documenten) |

Totale omvang op schijf: 6,7 MB.

## Gedownloade documenten

| Titel | Categorie | Bron-URL | Lokale bestandsnaam | Grootte | Status |
|---|---|---|---|---|---|
| Statuten NDB | Statuten en basisreglementen | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Statuten-NDB-t.pdf) | `statuten-ndb.pdf` | 291 kB | gelukt |
| Algemeen Reglement | Statuten en basisreglementen | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Algemeen-Reglement.pdf) | `algemeen-reglement.pdf` | 243 kB | gelukt |
| Algemeen Wedstrijdreglement | Statuten en basisreglementen | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Algemeen-Wedstrijdreglement.pdf) | `algemeen-wedstrijdreglement.pdf` | 392 kB | gelukt |
| Boete- en tarievenlijst | Statuten en basisreglementen | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Boete-en-tarievenlijst.pdf) | `boete-en-tarievenlijst.pdf` | 120 kB | gelukt |
| Reglement 170 Club | Algemeen | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement_170_Club.pdf) | `reglement-170-club.pdf` | 88 kB | gelukt |
| Overzicht inschrijfgelden | Algemeen | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Overzicht-inschrijfgelden.pdf) | `overzicht-inschrijfgelden.pdf` | 117 kB | gelukt |
| Richtlijn Gender en seksediverse personen | Algemeen | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Richtlijn-Gender-en-seksediverse-personen.pdf) | `richtlijn-gender-en-seksediverse-personen.pdf` | 240 kB | gelukt |
| Reglement Nederlandse selectie | Selectie | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement-Nederlandse-selectie.pdf) | `reglement-nederlandse-selectie.pdf` | 135 kB | gelukt |
| Reglement Nederlandse Damesselectie | Selectie | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement-Nederlandse-Damesselectie.pdf) | `reglement-nederlandse-damesselectie.pdf` | 136 kB | gelukt |
| Reglement Nederlandse Jeugdselectie | Selectie | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement-Nederlandse-Jeugdselectie.pdf) | `reglement-nederlandse-jeugdselectie.pdf` | 136 kB | gelukt |
| Reglement Nederlandse Selectie Paradarts | Selectie | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement-Nederlandse-Selectie-Paradarts.pdf) | `reglement-nederlandse-selectie-paradarts.pdf` | 132 kB | gelukt |
| Reglement Spelersvertegenwoordiging | Selectie | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement-Spelersvertegenwoordiging.pdf) | `reglement-spelersvertegenwoordiging.pdf` | 222 kB | gelukt |
| Reglement Super League Nederland | Competities | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement-SuperLeague-Nederland.pdf) | `reglement-superleague-nederland.pdf` | 286 kB | gelukt |
| Super League Play-offs reglement | Competities | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/SuperLeague-Play-offs-reglement.pdf) | `superleague-play-offs-reglement.pdf` | 136 kB | gelukt |
| Reglement Landelijke Competitie | Competities | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement-Landelijke-Competitie.pdf) | `reglement-landelijke-competitie.pdf` | 237 kB | gelukt |
| Reglement NDB Ranking | NDB ranking | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement-NDB-Ranking.pdf) | `reglement-ndb-ranking.pdf` | 216 kB | gelukt |
| Kledingreglement NDB Rankings | NDB ranking | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Kledingreglement-NDB-Rankings.pdf) | `kledingreglement-ndb-rankings.pdf` | 49 kB | gelukt |
| Declaraties Jeugd | NDB ranking | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Declaraties-Jeugd.pdf) | `declaraties-jeugd.pdf` | 136 kB | gelukt |
| Reglement Divisie- en Bekerkampioenschappen | Kampioenschappen | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement-Divisie-en-Bekerkampioenschappen.pdf) | `reglement-divisie-en-bekerkampioenschappen.pdf` | 224 kB | gelukt |
| WPD Dutch Medical Assessment Form | Paradarts | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/WPD-Dutch-Medical-Assessment-Form.pdf) | `wpd-dutch-medical-assessment-form.pdf` | 115 kB | gelukt |
| WPD Dutch Inclusio Players Registration Form | Paradarts | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/WPD-Dutch-Inclusio-PlayersRegistrationForm.pdf) | `wpd-dutch-inclusion-players-registration-form.pdf` | 88 kB | gelukt |
| Algemeen Kledingreglement | Kledingreglementen | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Kledingreglement-Algemeen.pdf) | `kledingreglement-algemeen.pdf` | 62 kB | gelukt |
| Algemene Gedragsregels Dartsevenementen | Gedragsregels | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Algemene-Gedragsregels-Dartsevenementen.pdf) | `algemene-gedragsregels-dartsevenementen.pdf` | 25 kB | gelukt |
| Reglement Algemene Gedragsregels Dartsevenementen | Gedragsregels | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement-Algemene-Gedragsregels-Dartsevenementen.pdf) | `reglement-algemene-gedragsregels-dartsevenementen.pdf` | 29 kB | gelukt |
| Gedragsregels Jeugddarts | Gedragsregels | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Gedragsregels-Jeugddarts.pdf) | `gedragsregels-jeugddarts.pdf` | 27 kB | gelukt |
| Reglement Gedragsregels Jeugddarts | Gedragsregels | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement-Gedragsregels-Jeugddarts.pdf) | `reglement-gedragsregels-jeugddarts.pdf` | 28 kB | gelukt |
| Reglement erkende jeugdbegeleider | Erkende jeugdbegeleiders/jeugdlocaties | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement-erkend-jeugdbegeleider.pdf) | `reglement-erkend-jeugdbegeleider.pdf` | 170 kB | gelukt |
| Reglement erkende jeugdlocatie | Erkende jeugdbegeleiders/jeugdlocaties | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement-erkende-jeugdlocatie.pdf) | `reglement-erkende-jeugdlocatie.pdf` | 175 kB | gelukt |
| Reglement administratief verzuim, spelregelverzuim en algemeen tuchtrecht | Tuchtrechtspraak NDB | [bron](https://anyday-alaska-01.ams3.cdn.digitaloceanspaces.com/ndbdarts/media/6.-Kennisbank-pagina/reglementen/Reglement-administratief-verzuim-spelregel-verzuim-en-algemeen-tuchtrecht.pdf) | `reglement-administratief-verzuim-spelregelverzuim-en-algemeen-tuchtrecht.pdf` | 221 kB | gelukt |
| ISR Tuchtreglement Algemeen Tuchtrecht 2025 | Tuchtrechtspraak ISR | [bron](https://static.isr.nl/downloadsweb/443349/ISR%20Tuchtreglement%20Algemeen%20Tuchtrecht%202025.pdf) | `isr-tuchtreglement-algemeen-tuchtrecht-2025.pdf` | 266 kB | gelukt |
| ISR Tuchtreglement Grensoverschrijdend Gedrag 2025 | Tuchtrechtspraak ISR | [bron](https://static.isr.nl/downloadsweb/443350/ISR%20Tuchtreglement%20Grensoverschrijdend%20Gedrag%202025.pdf) | `isr-tuchtreglement-grensoverschrijdend-gedrag-2025.pdf` | 279 kB | gelukt |
| Tuchtreglement Seksuele Intimidatie ISR 2019 | Tuchtrechtspraak ISR | [bron](https://static.isr.nl/downloadsweb/305073/Tuchtreglement%20Seksuele%20Intimidatie%20ISR%202019.pdf) | `isr-tuchtreglement-seksuele-intimidatie-2019.pdf` | 428 kB | gelukt |
| Tuchtreglement Matchfixing ISR 2016 | Tuchtrechtspraak ISR | [bron](https://static.isr.nl/downloadsweb/305077/Tuchtreglement%20Matchfixing%20ISR%202016.pdf) | `isr-tuchtreglement-matchfixing-2016.pdf` | 563 kB | gelukt |
| ISR Nationaal Dopingreglement 2025 | Tuchtrechtspraak ISR | [bron](https://static.isr.nl/downloadsweb/443341/ISR%20Nationaal%20Dopingreglement%202025.pdf) | `isr-nationaal-dopingreglement-2025.pdf` | 593 kB | gelukt |
| ISR Tuchtreglement Dopingzaken 2025 | Tuchtrechtspraak ISR | [bron](https://static.isr.nl/downloadsweb/443340/ISR%20Tuchtreglement%20Dopingzaken%202025.pdf) | `isr-tuchtreglement-dopingzaken-2025.pdf` | 201 kB | gelukt |

## Mislukte downloads

Geen. Alle 35 aangeboden documenten leverden HTTP 200 op en zijn geverifieerd als geldige PDF.

## Niet-documenten en scopekeuzes (expliciet, niet stilzwijgend overgeslagen)

1. **ISR-hubpagina niet gedownload.** De eerste link onder "Tuchtrechtspraak NDB" op de bronpagina — anchor-tekst "Instituut Sport Rechtspraak (ISR)" → <https://www.isr.nl/onderwerpen/algemeen-tuchtrecht> — is een onderwerpen-overzichtspagina zonder eigen PDF. Geverifieerd: HTTP 200, `<title>` is "Onderwerpen grensoverschrijdend gedrag", nul PDF-links in de HTML. Er valt hier geen document te downloaden.

2. **Dubbele link op de bronpagina.** "Kledingreglement NDB Rankings" staat twee keer op de pagina (onder *NDB ranking* én onder *Kledingreglementen*) en verwijst beide keren naar dezelfde CDN-URL. Eenmaal gedownload als `kledingreglement-ndb-rankings.pdf`.

3. **ISR-verwijzingen zijn onderwerppagina's, niet directe PDF-links.** De vijf inhoudelijke ISR-links op de NDB-pagina wijzen naar `isr.nl/onderwerpen/<thema>`. Per pagina is de PDF-lijst uitgelezen en is telkens de **meest recente versie** van het genoemde reglement opgehaald. Toewijzing:

   | NDB-anchortekst | NDB-link | Opgehaalde PDF |
   |---|---|---|
   | Algemeen tuchtreglement ISR | `/onderwerpen/algemeen-grensoverschrijdend-gedrag` | ISR Tuchtreglement Algemeen Tuchtrecht 2025 + ISR Tuchtreglement Grensoverschrijdend Gedrag 2025 |
   | Tuchtreglement Seksuele intimidatie ISR | `/onderwerpen/seksuele-intimidatie` | Tuchtreglement Seksuele Intimidatie ISR 2019 (nieuwste SI-specifieke versie; opvolger 2025 heet "Grensoverschrijdend Gedrag") |
   | Tuchtreglement Matchfixing ISR | `/onderwerpen/matchfixing` | Tuchtreglement Matchfixing ISR 2016 (enige versie op de ISR-site) |
   | Nationaal Dopingreglement (NDR) ISR | `/onderwerpen/doping` | ISR Nationaal Dopingreglement 2025 |
   | Tuchtreglement Dopingzaken (ISR) | `/onderwerpen/doping` | ISR Tuchtreglement Dopingzaken 2025 |

4. **Historische ISR-versies bewust niet opgehaald.** De ISR-onderwerppagina's bevatten daarnaast oudere edities en aanverwante stukken die de NDB-pagina niet als apart reglement noemt. Niet gedownload, wel hier vastgelegd zodat de keuze zichtbaar is:
   - Algemeen tuchtrecht: versies 2015 (zonder aanklager) en 2020 (met aanklager)
   - Seksuele intimidatie: Reglement SI 2011, 2012, 2013-I, 2013-II, 2016 en Tuchtreglement SI 2015
   - Doping: Tuchtreglement Dopingzaken 2015, Nationaal Dopingreglement per 15 aug 2023 en per 1 jan 2024
   - Doping, aanverwant: ISR Wrakingsprotocol 2025, ISR Reglement Naleving Dopingsancties 2025, Whereaboutsbijlage 2025, Dispensatiebijlage 2025, WADA-dopinglijsten 2023/2024/2025/2026

   Wil Sander een volledig historisch dossier of de WADA-lijsten erbij, dan is dat een tweede ophaalronde.

## Aandachtspunten voor de volgende stap

- **Geen inhoudelijke analyse gedaan.** Deze map bevat alleen ruwe bytes. Synthese is Athena's stap.
- **Versiedatums zitten in de PDF's, niet in de bestandsnamen** van de NDB-documenten — de CDN-URL's dragen geen versienummer. Wie de actualiteit wil vaststellen, moet dat uit het document zelf halen.
- **Twee documentparen lijken op elkaar** en zijn geen duplicaat: "Algemene Gedragsregels Dartsevenementen" vs. "Reglement Algemene Gedragsregels Dartsevenementen", en dezelfde splitsing bij Jeugddarts. De bronpagina zet ze naast elkaar; de bestanden verschillen in omvang.
- **Herhaalbaar.** Opnieuw draaien overschrijft de bestanden met verse kopieën; het downloadscript verifieert eerst de PDF-magicbytes voordat het een bestand op zijn plek zet, dus een foutpagina landt nooit als `.pdf`.

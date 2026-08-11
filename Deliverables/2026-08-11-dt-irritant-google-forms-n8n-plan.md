# Implementatieplan — D.T. Irritant Google Forms via n8n

## Doel

Een importeerbare n8n-oplossing bouwen die na een handmatige start:

1. de parameters voor D.T. Irritant leest uit het bestaande Google Sheet `Feeds teambeheer` en verplicht seizoen `26-27` gebruikt;
2. één openbare Teambeheer-teampagina voor het gekozen seizoen ophaalt;
3. de wedstrijden normaliseert en valideert;
4. een Google Form via de officiële Forms API aanmaakt;
5. antwoorden periodiek uitleest en naar een Google Sheet schrijft.

## Constraints

- Teambeheer blijft de inhoudelijke SSOT.
- Geen geplande of brede Teambeheer-crawler; alleen handmatige, gerichte synchronisatie.
- De aangeleverde Google Spreadsheet blijft read-only.
- Geen credentials, tokens of persoonsgegevens in bronbestanden of logs.
- Geen extra betaald abonnement.
- Opnieuw uitvoeren mag niet stilzwijgend duplicaten maken.
- Seizoen `26-27` is vastgezet; een andere seizoenswaarde of response stopt de workflow vóór iedere schrijfactie.
- De myPKA blijft markdowngeheugen; uitvoerbare workflowartefacten leven in een apart automation-project.

## Projectlocatie

`/Users/sandervanockenburg-zwaan/Documents/automation-projects/dt-irritant-n8n/`

Voor schrijven buiten de myPKA-werkruimte is een eenmalige systeemgoedkeuring nodig.

## Bestandskaart

| Bestand | Doel |
|---|---|
| `README.md` | Installatie, OAuth, import, bediening en herstelprocedure |
| `workflow-generate-form.json` | Handmatige sync: Teambeheer → validatie → Google Form |
| `workflow-sync-responses.json` | Forms-responses → Google Sheet-overzicht |
| `fixtures/teambeheer-team-sample.html` | Geschoonde HTML-testfixture zonder geheimen |
| `fixtures/expected-matches.json` | Verwachte parseruitvoer |
| `scripts/parse-teambeheer.js` | Pure parserfunctie, identiek aan n8n Code-node-logica |
| `scripts/build-form-requests.js` | Pure omzetting wedstrijden → Forms `batchUpdate` requests |
| `tests/test-workflow-code.mjs` | Lokale regressietests voor parser, validatie en requestbouw |

## Taak 1 — Projectskelet en testfixture

1. Maak de projectmappen aan.
2. Haal de openbare pagina voor `d=1`, `t=394`, `s=26-27` eenmalig op.
3. Verwijder irrelevante markup en controleer dat de fixture geen credentials of privégegevens bevat.
4. Leg de verwachte wedstrijdvelden vast: datum, thuisteam, uitteam, thuis/uit, tegenstander, locatie en bron-URL.

**Verificatie**

```bash
rg -n -i 'token|secret|authorization|cookie|password' fixtures
```

Verwacht: geen gevoelige waarden.

## Taak 2 — Teambeheer-parser testgedreven bouwen

1. Schrijf eerst tests voor geldige wedstrijden, datums, duplicaten en ontbrekende velden.
2. Bouw daarna `parse-teambeheer.js`.
3. De parser accepteert uitsluitend het verwachte Teambeheer-document en faalt luid bij structuurwijzigingen.
4. Voeg een seizoens- en teamcontrole toe zodat een verkeerde URL niet tot een formulier leidt.

**Verificatie**

```bash
node --test tests/test-workflow-code.mjs
```

Verwacht: alle parsertests slagen en exact 22 unieke wedstrijden voor de fixture.

## Taak 3 — Google Forms-requestbuilder

1. Schrijf tests voor titel, spelerkeuze, wedstrijdvragen, antwoordopties en opmerkingenveld.
2. Bouw `build-form-requests.js`.
3. Verdeel de wedstrijden in maandsecties voor prettig mobiel invullen.
4. Gebruik per wedstrijd de opties `Beschikbaar`, `Misschien` en `Niet beschikbaar`.
5. Voeg geen Forms-velden toe die de API niet ondersteunt.

**Verificatie**

```bash
node --test tests/test-workflow-code.mjs
```

Verwacht: geldige requestobjecten, unieke item-ID's en alle 22 wedstrijden eenmaal aanwezig.

## Taak 4 — Generatorworkflow samenstellen

Nodes:

1. `Manual Trigger`.
2. `Edit Fields — Config`: spreadsheet-ID, `d=1`, `t=394`, vast seizoen `s=26-27` en acht spelers.
3. `Google Sheets — Parameters lezen`: controleert `feeds_parameters!A1:D10` read-only.
4. `HTTP Request — Teambeheer`: één GET met herkenbare user-agent, timeout en maximaal één retry.
5. `Code — Parse en valideer`: gebruikt de geteste parserlogica.
6. `IF — Exact team, seizoen 26-27 en geldige wedstrijden`: stopt bij iedere mismatch.
7. `Data Table — Idempotency check`: sleutel `dt-irritant:<seizoen>`.
8. `HTTP Request — Forms create`: Google OAuth2, `POST /v1/forms`.
9. `HTTP Request — Forms batchUpdate`: voegt secties en vragen toe.
10. `Data Table — Resultaat bewaren`: formulier-ID, responder-URL, seizoen en bronhash.
11. `Code — Eindrapport`: URLs en aantallen, zonder tokens.

De workflow wordt standaard inactief geïmporteerd. Er wordt geen productieformulier aangemaakt tijdens lokale tests.

**Verificatie**

```bash
node -e "JSON.parse(require('fs').readFileSync('workflow-generate-form.json')); console.log('valid json')"
```

Verwacht: `valid json`.

## Taak 5 — Responseworkflow samenstellen

Nodes:

1. `Schedule Trigger`: lage frequentie, pas door Sander te activeren.
2. `Data Table — Actief formulier`.
3. `HTTP Request — forms.responses.list` met Google OAuth2.
4. `Code — Responses normaliseren`: nieuwste inzending per speler geldt.
5. `Google Sheets — Overzicht bijwerken`: aparte tabs `Antwoorden`, `Per wedstrijd`, `Ontbrekend` in een nieuw uitvoer-Sheet.
6. `Code — Syncresultaat`: aantal ontvangen en ontbrekende spelers.

Geen berichten of herinneringen in versie 1.

**Verificatie**

```bash
node -e "JSON.parse(require('fs').readFileSync('workflow-sync-responses.json')); console.log('valid json')"
```

Verwacht: `valid json`.

## Taak 6 — OAuth- en importhandleiding

Documenteer:

- Google Cloud APIs: Forms API, Sheets API en Drive API;
- OAuth redirect-URL uit n8n;
- minimale scopes:
  - `https://www.googleapis.com/auth/forms.body`
  - `https://www.googleapis.com/auth/forms.responses.readonly`
  - `https://www.googleapis.com/auth/spreadsheets`
  - zo beperkt mogelijke Drive-scope voor gemaakte bestanden;
- credentialselectie in iedere HTTP Request- en Sheets-node;
- workflow eerst handmatig testen en pas daarna response-sync activeren;
- fout- en rollbackprocedure.

**Verificatie**

```bash
rg -n 'forms.body|forms.responses.readonly|spreadsheets|rollback' README.md
```

Verwacht: alle vereiste onderwerpen zijn aanwezig.

## Taak 7 — Eindverificatie

1. Draai alle lokale tests opnieuw.
2. Valideer beide JSON-bestanden en controleer dat alleen seizoen `26-27` wordt geaccepteerd.
3. Zoek op hardcoded secrets.
4. Controleer dat beide workflows standaard inactief zijn.
5. Controleer dat het bron-Sheet nergens als schrijftarget is ingesteld.

**Verificatie**

```bash
node --test tests/test-workflow-code.mjs
node -e "for (const f of ['workflow-generate-form.json','workflow-sync-responses.json']) { const w=JSON.parse(require('fs').readFileSync(f)); if (w.active) throw new Error(f+' is active'); } console.log('workflows valid and inactive')"
rg -n -i 'client_secret|access_token|refresh_token|authorization.*bearer' .
```

Verwacht: tests groen, workflows geldig en inactief, geen hardcoded secrets.

## Handmatige productiepoort

Na de technische bouw importeert Sander de workflow in n8n en koppelt hij de Google OAuth-credential. De eerste echte Forms-aanmaak is een afzonderlijke externe schrijfactie en gebeurt pas nadat de preview exact 22 correcte wedstrijden toont.

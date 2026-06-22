---
agent_id: larry
session_id: google-contacts-koppeling-en-darts-onderzoek
timestamp: 2026-06-23T00:13:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Google Contacts-koppeling via n8n, ADC Regio Oost-bulkimport, en Mastercaller Double Game-idee

## Context

Sessie begon met een vraag of Larry een HEIC-foto kon lezen (e-mailadressenlijst Wormse Benelux Trophy), liep door in onderzoek naar het Mastercaller Double Game (darts-trainingsspel), en eindigde in het opzetten van een volwaardige Google Contacts-koppeling via n8n, inclusief een bulk-import van 23 ADC Regio Oost-deelnemers.

## What we did

- Larry converteerde een HEIC-bestand naar JPEG (via `sips`) om een handgeschreven e-mailadressenlijst te kunnen lezen; gebruiker corrigeerde meerdere onzeker gelezen e-mailadressen.
- Onderzoek gedaan naar het **Mastercaller Double Game** (Jacques Nieuwlaat, Bull's Darts) — spelregels samengevat en als ideeparagraaf vastgelegd in `[[darts-coaching]]` voor latere toepassing bij DartsCoaching.nl.
- Larry checkte of een Google Contacts/People MCP-connector beschikbaar was — niet gevonden in de registry. Als omweg is een n8n-workflow **"Sync Contact to Google"** (workflowId `jRCMIXb7u2LPULDy`) gebouwd: webhook → zoekt op e-mail → maakt contact aan als het nog niet bestaat.
- Eerste testcontact (Emiel Theloosen) succesvol aangemaakt; daarna een dubbel-aanmaak-bug ontdekt (Google's contacts-zoekindex heeft eventual consistency) en gedocumenteerd in de skill.
- Op verzoek 23 deelnemers van de Wormse Benelux Trophy Elite Finals (ADC Regio Oost) in bulk toegevoegd aan Google Contacts, met rol "Darter" en bedrijf "ADC Regio Oost".
- Labelbeheer uitgezocht: Google Contacts-groepen zijn niet vrij aan te maken via de beschikbare n8n-credential/node-combinatie (HTTP-node accepteert de specifieke Google Contacts-credential niet voor directe People API-calls). Omweg gevonden: gebruiker maakt het label zelf aan en labelt één contact, Larry leest het interne group-ID af via een `getAll`-lookup met `rawData: true`.
- Daarbij twee fouten ontdekt en gecorrigeerd: John Lutgens was per ongeluk overgeslagen in de eerste batch, en Mark Schlaghecke bestond al in Sander's contacten (waardoor een create-aanroep crashte op een datastructuurverschil in de Check-Email-Match Code-node — `emailAddresses` kan soms een dict-per-type zijn in plaats van een array).
- **Bijwerking ontdekt en herstel:** het toekennen van een label via de Google Contacts-node se `group`-veld **overschrijft alle bestaande groepslidmaatschappen**, dus de 23 contacten verdwenen tijdelijk uit de standaard "Contacten"-lijst. Herstuurd door `contactGroups/myContacts` mee te geven naast het ADC-label.
- **Realignment:** Sander wil niet dat labels automatisch worden toegepast — Larry moet voortaan altijd eerst vragen welk label (of geen) gewenst is, ook bij vergelijkbare toekomstige bulk-imports. De workflow en de skill-documentatie (`.claude/commands/sync-contact-to-google.md`) zijn hierop aangepast: `groupResourceName` is nu een optioneel, expliciet doorgegeven veld in plaats van een hardcoded default.
- Telefoonnummers van Damien van Schie en John Wolsheumer alsnog toegevoegd via losse update-aanroepen.

## Decisions made

- **Question:** Moeten toernooideelnemers (low-touch mailinglijst) in PKM/CRM/People worden vastgelegd?
  **Decision:** Nee — Google Contacts + label is de juiste plek voor een mailinglijst zonder echte lopende relatie; PKM/CRM blijft voorbehouden aan mensen met een daadwerkelijke relatie/context, om SSOT-vervuiling met 24 lege People-bestanden te voorkomen.
- **Question:** Moet de sync-workflow automatisch een standaardlabel toepassen op nieuwe contacten?
  **Decision:** Nee — Larry vraagt voortaan altijd expliciet welk label (of geen) toegepast moet worden, per sync-moment, nooit een onthouden/herhaald default.

## Insights

- Google's Contacts/People API werkt met groepen die een eigen `contactGroups/<id>` resourceName hebben; deze kunnen niet vrij worden aangemaakt via de huidige n8n-credential/HTTP-node-combinatie (credential-type mismatch). Praktische omweg: gebruiker maakt het label zelf aan in de Google Contacts-app, labelt één test-contact, en Larry leest het ID af via een `getAll`-lookup met `fields: [names, memberships]` en `rawData: true`.
- Het `group`-veld bij een Google Contacts-update is **destructief**: het vervangt alle bestaande groepslidmaatschappen in plaats van toe te voegen. Altijd `contactGroups/myContacts` expliciet meegeven naast een nieuw label, anders verdwijnt het contact uit de standaard contactenlijst.
- De `emailAddresses`-veldstructuur die de n8n Google Contacts-node teruggeeft is niet consistent: soms een array van `{value, type}`-objecten, soms een dict gegroepeerd per type (`{work: [...], home: [...]}`) — afhankelijk van context. Code die hierop matcht moet beide vormen kunnen verwerken.
- Bij het testen van n8n-workflows met meerdere triggers (webhook + manual trigger) voert `execute_workflow` met `type: "webhook"` of `type: "form"` altijd de webhook-trigger uit, ook als er een andere trigger in de workflow staat — de webhook-node moet eerst gedisabled worden om de andere trigger te kunnen testen.

## Realignments

- Sander corrigeerde: labels moeten nooit automatisch worden toegepast bij contact-sync — Larry moet dit voortaan altijd expliciet navragen, vastgelegd als procesregel in de skill-documentatie.

## Open threads

- [ ] Geen — alle losse eindjes (myContacts-herstel, telefoonnummers Damien en John Wolsheumer) zijn deze sessie afgerond.

## Next steps

- Bij een volgende contact-sync: Larry vraagt eerst naar het gewenste label voordat de workflow wordt aangeroepen, conform de bijgewerkte skill.
- Mastercaller Double Game-idee staat klaar in `[[darts-coaching]]` voor wanneer Sander tijd heeft om dit verder uit te werken voor DartsCoaching.nl.

## Cross-links

- `[[2026-06-22-19-58_Larry_verbouwing-sheet-en-inbox-verwerking]]` — vorige sessie, ook met n8n-troubleshooting (Google Sheets append-bug).

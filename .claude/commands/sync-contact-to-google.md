# sync-contact-to-google

Controleer of een persoon uit `PKM/CRM/People/` al bestaat in Google Contacts, en voeg hem/haar toe als dat niet het geval is.

## Gebruik

```
/sync-contact-to-google <slug>
```

Voorbeeld: `/sync-contact-to-google emiel-theloosen`

## Stappen

1. Lees `PKM/CRM/People/<slug>.md` (of de aangeleverde gegevens bij een bulk-import) en extraheer de relevante velden:
   - `full_name` (of `first_name` + `last_name`)
   - `email`
   - `role`
   - `company`
   - Eventueel: telefoon als aanwezig

2. **Vraag de gebruiker altijd eerst welk Google Contacts-label (groep) toegepast moet worden**, voordat je gaat syncen. Nooit automatisch een label toepassen zonder dat te vragen — ook niet als een eerdere sessie al een label gebruikte voor een vergelijkbare batch. Opties om aan de gebruiker voor te leggen:
   - Een bestaand label (vraag de naam, en zoek het label op zoals beschreven in stap 3)
   - Een nieuw label (de gebruiker maakt het zelf eenmalig aan in Google Contacts — labels kunnen niet automatisch aangemaakt worden, zie Valkuilen)
   - Geen label (alleen aanmaken/controleren, geen groep toewijzen)

3. Als de gebruiker een label kiest, zoek het bijbehorende `resourceName` op (formaat `contactGroups/<id>`) door een bestaand gelabeld contact op te zoeken via de Google Contacts-node (`getAll` met `fields: [names, memberships]`, `rawData: true`) en het `contactGroupResourceName` uit te lezen. Onthoud dit ID niet hardcoded in de workflow — geef het elke keer opnieuw mee.

4. Roep de n8n-workflow **"Sync Contact to Google"** aan (webhook `POST /webhook/sync-contact-to-google`, workflowId `jRCMIXb7u2LPULDy`) met body `{ firstName, lastName, email, role, company, phone, groupResourceName }`. `groupResourceName` is optioneel — leeg laten als de gebruiker geen label wil. Deze workflow zoekt zelf op e-mail in Google Contacts en maakt het contact aan als het nog niet bestaat; bestaande contacten worden niet overschreven.

5. Lees de respons: `{ status: "exists" }` of `{ status: "created" }`.

6. Rapporteer wat er gedaan is in één zin, inclusief welk label (of "geen label") is toegepast.

## Valkuilen

- Alleen toevoegen, nooit overschrijven of verwijderen zonder expliciete bevestiging van de gebruiker.
- **Vraag altijd naar het label, sla deze stap nooit over** — ook niet bij een herhaalde of vergelijkbare bulk-import. De gebruiker bepaalt per keer welk label (of geen) van toepassing is.
- **Labels kunnen niet automatisch aangemaakt worden** via deze workflow (Google's Contacts-groepen-API is niet bereikbaar vanuit de beschikbare n8n-credential/node-combinatie). Als de gebruiker een nieuw label wil, moet die het zelf eenmalig aanmaken in Google Contacts (Contacts → Labels → nieuw label, leeg mag) voordat je het kunt opzoeken en gebruiken.
- **Het `group`-veld bij een update overschrijft ALLE groepslidmaatschappen**, inclusief de standaard "Contacten" (myContacts) groep. Geef daarom bij elke create/update altijd `contactGroups/myContacts` mee naast het gekozen label, anders verdwijnt het contact uit de algemene contactenlijst.
- **Eventual-consistency risico:** Google's Contacts-zoekindex is niet direct up-to-date na het aanmaken van een contact. Twee syncs van dezelfde persoon kort na elkaar (binnen enkele seconden) kunnen een dubbel contact opleveren, omdat de net aangemaakte contact nog niet gevonden wordt door de zoekstap. Vermijd dus snel herhaald aanroepen voor dezelfde persoon; wacht na een "created"-resultaat even voordat je opnieuw synct.
- Als de n8n-workflow niet bereikbaar is of de credential "Google Contacts account" niet meer geldig is: meld dit duidelijk en geef de gebruiker de gegevens om het zelf in te vullen op contacts.google.com.

# PKM-graafhygiëne — nulmeting

- Datum: 2026-08-14
- Uitvoerder: Atlas
- Scope: `PKM/**/*.md`
- Modus: alleen-lezen; geen PKM-bestanden aangepast, verplaatst of verwijderd

## Samenvatting

De PKM bevat 421 markdownbestanden. De gevalideerde scan vond 757 oplosbare linkvoorkomens vanuit PKM-bronbestanden (wikilinks, embeds en lokale markdownlinks). Twee opeenvolgende runs produceerden exact dezelfde SHA-256-hash.

| Signaal | Aantal | Betekenis |
|---|---:|---|
| Technisch geïsoleerde kandidaten | 149 | Geen oplosbare inkomende of uitgaande interne link |
| Daarvan YouTube-Kennis | 107 | Waarschijnlijk collectie-inhoud; niet automatisch als fout behandelen |
| Overige geïsoleerde kandidaten | 42 | 41 kennisnotities + 1 template; handmatig classificeren |
| Niet-oplosbare linkdoelen | 48 | Mix van echte gebroken links, ontbrekende afbeeldingen/bijlagen en voorbeeldlinks |
| Dubbelzinnige linkdoelen | 14 | Volledig veroorzaakt door de dubbele bestandsnaam `gewoon-thuis` |
| Alleen via INDEX/README bereikbaar | 38 | Vindbaar, maar zwak inhoudelijk verbonden |

De uitkomst bewijst dat de graaf niet volledig weesvrij is. Ze bewijst niet dat alle 149 kandidaten fout zijn. Een technische weesstatus is een detectiesignaal; de inhoudelijke classificatie bepaalt de actie.

## Geïsoleerde kandidaten per categorie

| Categorie | Aantal |
|---|---:|
| YouTube-Kennis | 107 |
| Journal | 12 |
| Documents, exclusief YouTube-Kennis | 17 |
| CRM | 11 |
| My Life | 1 |
| Weekly Reports | 1 |

### My Life — hoge prioriteit

- `PKM/My Life/Goals/computer-georganiseerd.md`

Deze bestanden horen inhoudelijk bij de kern van de persoonlijke kennisgraaf en verdienen daarom als eerste handmatige beoordeling.

### CRM — beoordelen op relaties

- `PKM/CRM/ADC/heidi-schrijvens.md`
- `PKM/CRM/ADC/joost-gerritsen.md`
- `PKM/CRM/Organizations/color-analysis-pro.md`
- `PKM/CRM/Organizations/ibood.md`
- `PKM/CRM/Organizations/uncanny-automator.md`
- `PKM/CRM/Organizations/vmb-advies.md`
- vier historische coachgesprekken onder `PKM/CRM/People/maribel/`
- `PKM/CRM/People/mattijs-kattouw.md`

CRM-bestanden kunnen doorgaans worden verankerd via een persoon, organisatie, project, topic of relevante Journal-entry. De juiste relatie moet inhoudelijk worden vastgesteld; een generieke link is niet voldoende.

### Documents — beoordelen op eigenaar en onderwerp

Er zijn 17 geïsoleerde Documents buiten de YouTube-collectie. Het gaat onder andere om belastingaanslagen, medische documenten, woningdocumenten, een factuur en DartsCoaching-documentatie. Deze hoeven niet allemaal onderling verbonden te worden, maar horen minimaal een betekenisvolle relatie te hebben met een persoon, organisatie, project, topic of Key Element.

### Journal — historische gaten

Twaalf Journal-bestanden hebben geen oplosbare interne linkrelatie. Een dagelijkse log hoeft geen dicht netwerk te vormen, maar betekenisvolle personen, projecten, doelen en onderwerpen horen wel te worden gekoppeld wanneer ze in de inhoud voorkomen.

### YouTube-Kennis — collectiebeleid nodig

De 107 geïsoleerde transcripties vormen het grootste blok. Individueel kunstmatige links toevoegen zou de graaf juist ruisachtig maken. Betere oplossingsrichting:

1. ieder kanaal of iedere kenniscollectie krijgt één canonieke hub;
2. transcripties worden vanuit die hub geïndexeerd;
3. alleen inhoudelijk hergebruikte transcripties krijgen extra links naar Topics, Projects of andere entiteiten;
4. collectie-indexering telt als bereikbaarheid, maar blijft in rapportages zichtbaar als een zwakke verbinding.

## Niet-oplosbare links

De gevalideerde scan vond 48 unieke combinaties van bronbestand en niet-oplosbaar linkdoel. Verdeling:

| Brongebied | Aantal |
|---|---:|
| My Life | 23 |
| Journal | 10 |
| CRM | 5 |
| Documents | 4 |
| Weekly Reports | 4 |
| Images-indexniveau | 2 |

De lijst bevat verschillende foutklassen:

- ontbrekende afbeeldings- of bijlagebestanden;
- verouderde slugs, bijvoorbeeld oude project- of persoonsnamen;
- verwijzingen naar bestanden buiten PKM die mogelijk zijn verplaatst of gearchiveerd;
- voorbeeldlinks in INDEX- of templatebestanden;
- links naar mapnamen in plaats van concrete notities.

Voorbeelden die inhoudelijke aandacht verdienen:

- `[[project_thomas-overdrachtslijst-systeem]]` terwijl het levende projectbestand een andere slug heeft;
- `[[passion]]` tegenover de Nederlandse Key Element-naam;
- meerdere verwijzingen naar `[[van-der-velden-romme]]` zonder bestaand doel;
- meerdere ontbrekende afbeeldingen in historische Journal-entries;
- verouderde voorbeeldslugs zoals `[[ship-mvp-by-q3]]` en `[[side-project-mvp]]` in INDEX/README-bestanden.

Een SOP moet voorbeeldlinks en echte productielinks apart rapporteren. Ze mogen niet in één reparatiewachtrij terechtkomen.

## Dubbelzinnige links

Veertien links zijn niet eenduidig oplosbaar. Ze worden allemaal veroorzaakt doordat twee bestanden dezelfde basename hebben:

- `PKM/My Life/Topics/gewoon-thuis.md`
- `PKM/CRM/Organizations/gewoon-thuis.md`

Links zoals `[[gewoon-thuis]]` kunnen daardoor naar twee concepten verwijzen. De veilige correctie is een padgekwalificeerde wikilink, bijvoorbeeld `[[PKM/CRM/Organizations/gewoon-thuis]]` of `[[PKM/My Life/Topics/gewoon-thuis]]`, gekozen op basis van de betekenis in het bronbestand.

## Risicobeoordeling

1. **Hoog:** dubbelzinnige links. De lezer en software kunnen het verkeerde concept kiezen.
2. **Hoog:** echte gebroken links in levende My Life-, CRM- en projectnotities.
3. **Middel:** kernentiteiten zonder betekenisvolle relatie.
4. **Laag tot middel:** historische Journal-entries zonder link, afhankelijk van hun inhoud.
5. **Laag:** transcripties die bewust alleen onderdeel zijn van een broncollectie, mits de collectie zelf goed vindbaar is.

## Ontwerpvoorstel voor SOP-021

Werknaam: `SOP-021-audit-pkm-graafhygiene`.

### Doel

Periodiek en reproduceerbaar de bereikbaarheid en integriteit van de myPKA-graaf controleren zonder inhoud automatisch te veranderen.

### Procedure

1. **Scope vastleggen** — standaard PKM; technische mappen, templates en afgeleide bestanden expliciet markeren.
2. **Inventariseren** — markdownnotities, bijlagen, wikilinks en embeds verzamelen.
3. **Resolveren** — Obsidian-regels volgen voor aliases, headings, basenames, paden en bestandsextensies.
4. **Classificeren** — onderscheid maken tussen:
   - echte geïsoleerde kennisnotitie;
   - collectie-item;
   - alleen-via-INDEX bereikbare notitie;
   - bewust uitgesloten technisch bestand;
   - gebroken link;
   - dubbelzinnige link;
   - ontbrekende bijlage.
5. **Prioriteren** — kernentiteiten en dubbelzinnige/broken links vóór historische logs en collectie-items.
6. **Voorstellen genereren** — per item: koppelen, pad kwalificeren, indexeren, samenvoegen, archiveren, verwijderen of bewust uitzonderen.
7. **Menselijke goedkeuring** — geen schrijf-, verplaats- of verwijderactie zonder expliciete goedkeuring van Sander.
8. **Uitvoeren per kleine batch** — wijzigingen per categorie uitvoeren en controleerbaar houden.
9. **Herscannen** — aantonen welke signalen zijn opgelost en welke bewust openblijven.
10. **Rapporteren** — datum, scope, tellingen, uitzonderingen, wijzigingen en resterende risico's vastleggen.

### Vereist auditscript

Het toekomstige script moet alleen-lezen als standaardmodus hebben en minimaal ondersteunen:

- `--scope PKM`
- `--format markdown|json`
- codeblokken en inline-code negeren;
- canonical vault-mappen gebruiken en `.git`, `.claude/worktrees`, caches en geïnstalleerde Expansion-kopieën uitsluiten;
- markdownlinks, wikilinks en embeds afzonderlijk herkennen;
- links naar andere vaultgebieden correct als geldig behandelen;
- uitzonderingsbeleid voor templates, collectie-items en gegenereerde rapporten;
- stabiele tellingen zodat twee scans vergelijkbaar zijn.

## Advies

Gebruik [[SOP-021-audit-pkm-graafhygiene]] en het bijbehorende auditscript voordat er wordt opgeschoond. Start daarna met een kleine eerste batch: het geïsoleerde Goal-bestand, de elf CRM-kandidaten en de dubbelzinnige `gewoon-thuis`-links. Behandel YouTube-Kennis pas nadat het collectiebeleid is vastgelegd.

## Verificatiebeperkingen

Dit is een statische scan van wikilinks, embeds en lokale markdownlinks. Een inhoudelijk passende relatie kan alleen door het bronbestand te lezen worden vastgesteld. De tellingen zijn daarom een nulmeting en triagebasis, geen automatische verwijderlijst.

De eerdere verkennende telling was hoger omdat die geldige bijlagen, relatieve markdownlinks en inkomende links vanuit andere canonieke vaultdelen nog niet volledig oploste. De definitieve cijfers hierboven komen uit het geteste `audit-pkm-graph.py` en zijn reproduceerbaar.

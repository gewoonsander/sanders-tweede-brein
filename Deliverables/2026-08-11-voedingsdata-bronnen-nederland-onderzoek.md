---
key_element: gezondheid
title: Onderzoek voedingsdatabronnen voor Nederlands voedingslogboek
date: 2026-08-11
status: final
owner: Athena
---

# Onderzoek voedingsdatabronnen voor Nederlands voedingslogboek

## Executive summary

Voor Sanders voedingslogboek is één bron niet voldoende. De beste combinatie is:

1. **NEVO/RIVM als primaire bron** voor generieke Nederlandse voedingsmiddelen en samengestelde basisgerechten.
2. **Open Food Facts als product- en barcodelaag** voor Nederlandse merkproducten, met een lagere betrouwbaarheidsscore tenzij de etiketgegevens zichtbaar of recent gecontroleerd zijn.
3. **USDA FoodData Central als internationale fallback**, vooral wanneer NEVO geen goede generieke match bevat.
4. **FatSecret Nederland alleen als commerciële upgrade**, wanneer betere lokale zoekresultaten, porties, restaurantproducten, barcodeherkenning, NLP of beeldherkenning de kosten rechtvaardigen.
5. Een foto- of taalmodel herkent het eten en schat de portie, maar is **niet de voedingswaardenbron**. De berekening wordt gekoppeld aan een record uit een van bovenstaande databronnen.

Nederland maakt aantoonbaar verschil. Productrecepturen, merken, productnamen, verrijking, portiegroottes en restaurantassortimenten zijn landgebonden. FatSecret structureert zijn data daarom zelf per land; de Nederlandse markt is beschikbaar als `NL`, maar alleen via betaalde Premier-lokalisatie.

## Vergelijking

| Bron | Beste toepassing | Nederland | Toegang en kosten | Betrouwbaarheid | Advies |
|---|---|---:|---|---|---|
| NEVO/RIVM | Generieke voeding, Nederlandse basisproducten | Uitstekend | Gratis download; geen publieke realtime REST-API gevonden | Hoog; officiële Nederlandse compositiedatabase | Primaire bron |
| Open Food Facts | Verpakte merkproducten en barcodes | Goed maar ongelijk | Gratis API en bulkdata; rate limits; OdBL | Variabel; communitydata zonder volledigheids- of juistheidsgarantie | Productlaag met controles |
| FatSecret Premier | Generiek, merken, restaurants, barcode, NLP en foto's | Expliciet ondersteund | Offerte; prijs per markt en volume | Leverancier claimt geverifieerde, actuele landendatasets | Optionele commerciële upgrade |
| FatSecret Basic/Premier Free | Testen met Amerikaanse data | Onvoldoende | Gratis, 5.000 calls/dag voor Basic; beide US-only | Niet passend voor NL-productmatching | Niet als productiebron gebruiken |
| USDA FoodData Central | Internationale generieke fallback | Beperkt | Gratis API met data.gov-key; CC0 | Hoog voor Amerikaanse referentiedata | Secundaire fallback |
| EuroFIR | Europese harmonisatie/onderzoek | Indirect | Toegang en licentie verschillen per databank | Hoog als infrastructuur, niet één uniforme gratis product-API | Nu niet nodig |
| CIQUAL / CoFID | Franse/Britse generieke fallback | Laag | Openbare overheidsdownloads | Hoog binnen eigen nationale context | Geen prioriteit boven NEVO/USDA |

## Bevindingen per bron

### NEVO/RIVM

NEVO-online 2025 (versie 9.0) is de officiële Nederlandse voedingsstoffendatabase. RIVM vermeldt 2.328 voedingsmiddelen en circa 130 voedingsstoffen. De selectie is gericht op producten die in Nederland regelmatig worden gebruikt. Dat maakt NEVO de beste semantische match voor onder meer ontbijtkoek, Nederlandse kaassoorten, bereidingswijzen en gangbare Nederlandse productcategorieën.

NEVO is als download beschikbaar, waardoor het lokaal kan worden geïndexeerd, geversioneerd en gecachet. In de onderzochte officiële documentatie is geen publieke REST-API aangetroffen. Een periodieke import van de officiële dataset past daarom beter dan live opvragen.

Bronnen: [RIVM — Nederlands Voedingsstoffenbestand](https://www.rivm.nl/nederlands-voedingsstoffenbestand), [NEVO downloadbestand](https://www.rivm.nl/nederlands-voedingsstoffenbestand/gebruik-nevo-online/download-bestand), [data.overheid.nl — NEVO](https://data.overheid.nl/dataset/nederlands-voedingsstoffenbestand3).

### Open Food Facts

Open Food Facts is vooral waardevol voor EAN/barcodes en verpakte producten. De database en API zijn open, maar de gegevens zijn door gebruikers aangeleverd. De officiële documentatie geeft uitdrukkelijk geen garantie op juistheid, volledigheid of geschiktheid. Productlezingen hebben een limiet van 15 verzoeken per minuut per IP-adres; zoeken 10 per minuut. Een herkenbare `User-Agent` is vereist.

Daarom: gebruik de gevonden etiketwaarden, maar sla ook barcode, laatste wijzigingsdatum, volledigheid en een verificatiestatus op. Een duidelijke foto van het voedingswaardelabel heeft voor dat exacte product voorrang op een onbevestigd communityrecord.

Bronnen: [Open Food Facts API-documentatie](https://openfoodfacts.github.io/openfoodfacts-server/api/), [Open Food Facts data licensing](https://world.openfoodfacts.org/data).

### FatSecret Platform API

FatSecret heeft functioneel de rijkste alles-in-één-oplossing: lokale generieke voeding, merken, supermarkt- en restaurantproducten, barcodes, porties, NLP en beeldherkenning. Nederland en Nederlands zijn expliciet ondersteund via `region=NL` en `language=nl`.

De beperking is commercieel: lokalisatie is een Premier-functie. Basic is gratis met 5.000 calls per dag, maar uitsluitend voor de VS. Ook Premier Free voor kwalificerende startups, non-profits en studenten blijft US-only. Nederlandse markttoegang vereist Premier for Business/Enterprise; de prijs wordt per landmarkt en verzoekvolume geoffreerd. Attributie is vereist bij de gratis tiers; white-labelgebruik hoort bij betaald Premier.

FatSecret zegt zijn dataset samen te stellen uit officiële publicaties, fabrikanten/merken/restaurants, openbare informatie en geverifieerde gebruikersbijdragen. Claims als “100% verified” zijn leveranciersclaims en geen onafhankelijke kwaliteitsmeting. Voor een keuze moeten we daarom een Nederlandse proefset laten matchen en contractvoorwaarden over opslag/caching/export expliciet beoordelen.

Bronnen: [FatSecret Platform API](https://platform.fatsecret.com/platform-api), [edities en prijzen](https://platform.fatsecret.com/api-editions), [lokalisatie](https://platform.fatsecret.com/docs/guides/localization), [storable data](https://platform.fatsecret.com/docs/guides/storable-data).

### USDA FoodData Central

FoodData Central biedt gratis zoek- en detail-API's en downloads. De federale data zijn CC0/public domain. Foundation Foods bevatten analytische gegevens; FNDDS is bedoeld voor voedingsinnameonderzoek; branded records zijn veelal gebaseerd op producent- of etiketdata. De bron is sterk, transparant en technisch prettig, maar primair Amerikaans. Hij is daarom geschikt als fallback, niet als eerste match voor Nederlandse merken, recepten of porties.

Bronnen: [USDA FoodData Central API Guide](https://fdc.nal.usda.gov/api-guide), [FoodData Central data type documentation](https://fdc.nal.usda.gov/data-documentation.html).

## Aanbevolen verificatiepijplijn

1. **Vastleggen:** foto, tekst of spraak wordt bewaard als oorspronkelijke observatie.
2. **Herkennen:** het model benoemt mogelijke voedingsmiddelen en geeft een portierange; bij twijfel vraagt het één gerichte verduidelijking.
3. **Exact product eerst:** barcode of leesbaar etiket → Open Food Facts; etiketfoto overschrijft afwijkende databasewaarden.
4. **Generieke match:** Nederlands basisproduct → NEVO.
5. **Fallback:** ontbrekende generieke match → USDA, eventueel later CIQUAL/CoFID.
6. **Rekenen:** voedingswaarde per 100 g × geschat/bevestigd gewicht. Olie, boter, saus en bereidingsverlies worden afzonderlijk gemodelleerd.
7. **Transparantie:** toon een waarde plus onzekerheidsmarge; niet alleen een schijnprecies getal.
8. **Herbruikbare correcties:** door Sander bevestigde producten en porties worden lokaal favoriet, zodat dezelfde match niet telkens opnieuw hoeft te worden geschat.

## Minimale herkomstvelden per logregel

```yaml
source_database: nevo | open_food_facts | usda | fatsecret | label | manual
source_food_id: "..."
source_version: "..."
source_country: NL
match_method: barcode | label | text | image | manual
match_confidence: 0.0-1.0
nutrients_per_100g: {}
portion_estimated_g: 0
portion_confirmed: false
calculation: "per_100g * grams / 100"
retrieved_at: YYYY-MM-DD
verified_by_label: false
```

## Beslisadvies

Start zonder commerciële afhankelijkheid met **NEVO + Open Food Facts + USDA**, en meet gedurende vier weken hoeveel invoer niet goed kan worden gekoppeld. Test FatSecret pas daarna met een vaste Nederlandse benchmarkset van bijvoorbeeld 100 echte eetmomenten. Koop Nederlandse Premier-toegang alleen als de matchrate, porties of gebruikservaring aantoonbaar beter zijn dan de open combinatie.

## Methodologie en beperkingen

Athena gebruikte twee onafhankelijke zoekroutes en controleerde de kernclaims vervolgens tegen officiële documentatie van RIVM, FatSecret, Open Food Facts en USDA. Beschikbaarheid, limieten en commerciële voorwaarden kunnen wijzigen. FatSecret publiceert geen vaste Nederlandse prijs; daarvoor is een offerte nodig. Er is in dit onderzoek geen empirische matchtest met Nederlandse barcodes of gerechten uitgevoerd, dus uitspraken over daadwerkelijke dekking blijven voorlopig totdat een benchmark is gedraaid.

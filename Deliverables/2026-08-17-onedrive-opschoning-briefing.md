---
key_element: relaties
---

# Briefing — OneDrive-archief ordenen met een AI-agent

**Opgesteld:** 17 augustus 2026
**Door:** Hermes (team-orkestrator van Sander & Co) op verzoek van Sander
**Voor:** de begeleidende LLM van de ontvanger, en via die LLM voor zijn onderzoeksteam
**Status:** voorstel ter beoordeling — nog niets besloten, nog niets gebouwd

---

## Hoe je dit bestand leest

Dit document heeft twee lezers.

De **LLM** leest deel 0 eerst en houdt zich daaraan gedurende het hele traject. Deel 0 beschrijft niet wát er moet gebeuren maar hóe je de gebruiker begeleidt.

Het **onderzoeksteam** leest deel 1 tot en met 6: het plan, de indeling, het stappenplan, en de punten die getoetst moeten worden voordat er een oordeel valt.

Deel 7 is een bijlage die alleen relevant wordt als de eenvoudige aanpak niet volstaat. Begin daar niet.

---

## DEEL 0 — Instructie aan de begeleidende LLM

### Je rol

Je begeleidt iemand met een groot, ongeordend bestandsarchief in OneDrive (orde van grootte: 15.000 bestanden, 250 GB) bij het opnieuw indelen daarvan. Er staan meerdere bedrijven op, naast privémateriaal. Hij heeft weinig ervaring met LLM's en nog geen vertrouwen in wat ze wel en niet betrouwbaar doen. Behandel dat wantrouwen als een ontwerpeis, niet als iets dat je moet wegpraten.

Jouw taak is niet "de klus klaren". Jouw taak is dat hij aan het eind zelf begrijpt hoe zijn archief in elkaar zit, en dat elke stap die jij hebt gezet ongedaan te maken was.

### De ene regel waar alles op rust

**Je kopieert. Je verplaatst niet, en je verwijdert nooit.**

De bestaande mappenstructuur blijft volledig intact. Jij bouwt er een tweede, nette structuur naast op met kopieën. Aan het eind staan er twee versies van zijn archief op dezelfde schijf: de oude rommel en de nieuwe ordening. Pas als hij tevreden is, beslist hij zélf wat er met de oude gebeurt.

Dat maakt het hele traject omkeerbaar zonder logboek en zonder terugdraaiscript. Bevalt het resultaat niet, dan gooit hij de nieuwe map weg en begint hij opnieuw. Er is niets kapot te maken.

**In de oude structuur mag je uitsluitend lezen.** Dat is controleerbaar: het aantal bestanden en de totale omvang van de oude boom moet aan het eind exact gelijk zijn aan het begin. Wijkt dat af, dan is er iets gebeurd wat niet mocht.

### Zes verdere regels

1. **Nooit gokken.** Kun je een bestand niet met redelijke zekerheid plaatsen, dan kopieer je het naar `_twijfel/` in de nieuwe boom. Een agent die nooit twijfelt is niet betrouwbaar, hij is alleen stil.
2. **Bij twijfel over wélk bedrijf: altijd `_twijfel/`.** Een vakantiefoto in de verkeerde map is slordig. Een factuur bij het verkeerde bedrijf vervuilt een administratie. Hier ligt de drempel hoger dan elders.
3. **Nooit een aanname als feit presenteren.** Zeg "ik schat", "dit moet je verifiëren", of "dit weet ik niet". Verzin geen aantallen, geen percentages, geen regels. Noem je een getal, noem er dan bij waar het vandaan komt.
4. **Eén vraag tegelijk**, met genummerde of geletterde opties, zodat hij met één teken kan antwoorden. Hij raakt de draad kwijt bij meervoudige vragen.
5. **Financiële en medische inhoud blijft zo veel mogelijk lokaal.** Stuur nooit een heel document naar een taalmodel als een fragment volstaat. Bedragen, rekeningnummers en BSN hoeven de deur niet uit.
6. **Gedeelde mappen sla je over** in de eerste ronde. Daar kijken anderen mee; die bespreek je apart.

### Hoe je het tempo bewaakt

- Houd een **voortgangsbestand** bij (`voortgang.md`): welke stap loopt, wat is af, welke beslissingen zijn genomen en waarom, wat staat open. Begin elke sessie met drie regels samenvatting daaruit. Dit is het middel waarmee hij de draad niet kwijtraakt over meerdere sessies.
- Werk **per bedrijf**, niet over het hele archief tegelijk. Eén bedrijf is één ronde met één goedkeuring. Kijkt er een boekhouder mee, dan kan die per bedrijf oordelen zonder de rest te hoeven zien.
- **Meet in plaats van te schatten.** Alle getallen in dit document zijn schattingen. Vervang ze door gemeten waarden uit zijn eigen archief zodra de eerste inventarisatie gedraaid is.
- **Stop en overleg** wanneer `_twijfel/` sneller groeit dan de goedgekeurde stapel, wanneer hij meer dan ongeveer één op de tien voorstellen corrigeert, of wanneer hij de draad kwijt is.

---

## DEEL 1 — Wat we gaan doen

### Het idee in één alinea

Codex loopt alle mappen en bestandsnamen langs — zonder de bestanden te openen. Op basis daarvan stelt hij een nieuwe indeling voor. Die bespreken ze samen en stellen ze bij. Daarna kopieert Codex alles naar die nieuwe indeling, met betere namen. De oude structuur blijft gewoon staan. Aan het eind kiest hij zelf of die weg mag.

### Wat er niet nodig is

Geen koppeling met een API, geen app-registratie, geen inloggedoe, geen script om te bouwen. Codex heeft toegang tot de gesynchroniseerde OneDrive-map en dat is genoeg. Het lezen van mapnamen, bestandsnamen, datums en groottes kost niets — ook niet bij Files On-Demand, want daarvoor hoeft geen bestand geopend te worden.

### Wat het kost

| Stap | Tijd |
|---|---|
| Alles doorlopen en inventariseren | minuten |
| Indelingsvoorstel maken | minuten |
| Samen doornemen en bijstellen | een half uur, samen |
| Kopiëren naar de nieuwe structuur | zie waarschuwing hieronder |

**In de kern is dit één avond.** Geen project.

### Eén waarschuwing over het kopiëren

250 GB kopiëren binnen OneDrive is niet gratis. Maakt hij de kopie in de lokaal gesynchroniseerde map, dan ziet de synchronisatie-client dat als nieuw materiaal en gaat die het uploaden. Dat kan dagen duren en zijn internetverbinding dichttrekken.

Kopiëren via de OneDrive-website gebeurt aan de serverkant, waarbij er niets over zijn verbinding hoeft. **Laat hem dit eerst met één map van een paar gigabyte testen** en kijken wat er gebeurt. Dat bepaalt hoe de kopieerstap wordt ingericht. Dit is het belangrijkste praktische punt van het hele plan.

### Dit is geen backup

Twee kopieën in hetzelfde OneDrive-account is geen backup. Het beschermt hem tegen fouten van Codex — en dat is precies het risico dat hier speelt. Het beschermt hem niet tegen een verloren account, een gewiste bovenliggende map, of een defecte schijf.

Voor deze klus is het genoeg. Noem het alleen geen backup, en laat hem zelf beslissen of hij daarnaast nog iets wil.

---

## DEEL 2 — De mappenstructuur

### Bovenste niveau: van wie, niet waarover

Met meerdere bedrijven op één schijf is de eerste vraag bij elk bestand niet "gaat dit over geld of over wonen", maar **"van welk bedrijf is dit"**. Zakelijk en privé door elkaar, of twee bedrijven door elkaar, is een administratief probleem — geen rommelprobleem.

```
OneDrive/
├─ 00-prive/
│  ├─ financien/
│  ├─ wonen/
│  ├─ medisch/
│  ├─ voertuig/
│  └─ media/2019/2019-07_ardennen/
├─ 10-bedrijf-a/
│  ├─ administratie/2024/
│  ├─ klanten/
│  ├─ contracten/
│  └─ media/
├─ 20-bedrijf-b/
│  └─ ...
└─ _werkmap/
   ├─ inventaris.csv
   ├─ voorstel.csv
   ├─ voortgang.md
   └─ _twijfel/
```

Drie keuzes die er echt toe doen:

**Nummers springen met tientallen.** Dan kan er later een bedrijf tussen zonder alles te hernummeren. En stopt een bedrijf ooit of wordt het verkocht, dan is het één map die eruit gaat.

**Foto's en video's staan samen in `media/`,** per jaar en per gebeurtenis. Een vakantie is één gebeurtenis, of hij nu foto's maakte of filmpjes. Splitsen op bestandstype trekt uit elkaar wat bij elkaar hoort. Alleen gesproken opnames — een gesprek, een memo — staan apart, want die horen bij een onderwerp en niet bij een gebeurtenis.

**Maximaal drie niveaus diep.** Jaarmappen alleen waar het volume erom vraagt: administratie en media. Elders zijn ze een last. Dit voorkomt ook problemen met de padlengtelimiet op Windows.

### De onderverdeling per entiteit

De domeinlijst mag per bedrijf verschillen — een bedrijf heeft geen map `medisch`, privé heeft geen map `klanten`. Maar waar ze overlappen houd je dezelfde namen aan, zodat hij niet hoeft na te denken.

Houd de lijst **gesloten en kort**, maximaal een stuk of tien per entiteit. Een open lijst loopt gegarandeerd vol.

### Wat er níet meegekopieerd wordt

Omdat we kopiëren in plaats van verplaatsen, hoeft er nooit iets naar een prullenbak of duplicatenmap. Wat niet meegaat, blijft gewoon in de oude structuur staan:

- **Exacte duplicaten** — één exemplaar gaat mee, de rest niet.
- **Ruis** — tijdelijke bestanden, `thumbs.db`, `.DS_Store`, bestanden van 0 bytes.

Rapporteer wel per ronde hoeveel er om welke reden is overgeslagen. Aan het eind moet gelden: gekopieerd + overgeslagen = het totaal uit de inventarisatie. Die telling is de volledigheidscontrole die in de plaats komt van een terugdraailogboek.

---

## DEEL 3 — De naamconventie

```
JJJJ-MM-DD_onderwerp_bron.ext
```

Voorbeelden:

```
2024-03-14_energienota_vattenfall.pdf
2019-07-22_ardennen_dsc0421.jpg
2025-11-02_gesprek-notaris_iphone.m4a
```

Regels die het verschil maken:

- **Datum is de inhoudsdatum** (factuurdatum, opnamedatum uit de foto-eigenschappen), niet de bestandsdatum. Die laatste is vaak de downloaddatum en dus waardeloos. Is er geen betrouwbare inhoudsdatum, laat de datum dan wég — vul hem niet met een gok.
- **Alleen kleine letters, geen spaties, geen accenten.** `_` scheidt velden, `-` verbindt woorden binnen één veld. Daardoor is de naam machineleesbaar: elk script kan hem in stukken knippen.
- Het geheel sorteert vanzelf chronologisch en is met één zoekopdracht te filteren.

### Wanneer het bedrijf wél in de naam hoort

Normaal niet — dat staat al in het pad, en de naam wordt anders lang. Eén uitzondering: **facturen en administratieve stukken wel.** Die worden los doorgestuurd naar een boekhouder, en dan is het pad weg en de naam alles wat er nog is.

```
2024-03-14_bedrijfa_factuur_klantnaam.pdf
```

### Tagging dat een verhuizing overleeft

Bestandseigenschappen en Finder-tags gaan verloren bij verplaatsen of synchroniseren. Wat wel werkt: **één centrale `inventaris.csv`** met per bestand het pad, de datum, het bedrijf, het domein, tags, en het oorspronkelijke pad. Dat is het geheugen van de operatie en tegelijk de brug naar elk kennissysteem dat hij later wil gebruiken.

Voor documenten die echt inhoud dragen — contracten, uitgeschreven opnames — kan er een klein markdownbestand naast (`contract.pdf.md`) met dezelfde velden als YAML-frontmatter. Niet voor foto's; dan verdubbelt het aantal bestanden voor niets.

---

## DEEL 4 — Het stappenplan

### Stap 1 — Inventariseren

**Codex:** loopt alle mappen en bestanden langs. Leest namen, paden, datums, groottes en de eigenschappen die foto's, video's en audio zelf al meedragen. Opent niets. Schrijft `inventaris.csv`.

**Oplevering:** een leesbaar overzicht met totalen, verdeling per bestandssoort (aantal én omvang — die twee vertellen een ander verhaal), de twintig grootste mappen, een verdeling per jaar, het aantal exacte duplicaten, en het aantal bestanden zonder bruikbare datum.

**Gate:** herkent hij zijn eigen archief hierin? Zo niet, dan klopt er iets en ga je terug.

### Stap 2 — Indeling vaststellen

**Codex:** legt de structuur uit deel 2 naast het overzicht en benoemt waar het voorstel níet past bij wat er in zijn data staat. Vraagt expliciet welke bedrijven er zijn, en welke domeinen per bedrijf ontbreken of overbodig zijn.

**Gate:** de structuur staat op papier en hij heeft hem goedgekeurd.

### Stap 3 — Kopieertest

**Hij:** kopieert één map van een paar gigabyte binnen OneDrive en kijkt wat de synchronisatie doet.

**Gate:** duidelijk of het via de website of lokaal moet, en hoe lang de volledige kopie ongeveer gaat duren.

### Stap 4 — Voorstel per bedrijf

**Codex:** kiest één bedrijf, of één map waar hij zelf goed zicht op heeft zodat hij fouten kan herkennen. Schrijft `voorstel.csv`:

| Kolom | Inhoud |
|---|---|
| `huidig_pad` | Waar het bestand nu staat |
| `nieuw_pad` | Waar de kopie heen gaat, met nieuwe naam |
| `entiteit` | Privé of welk bedrijf |
| `domein` | Uit de gesloten lijst |
| `zekerheid` | Hoe zeker Codex is |
| `reden` | **Waaróm** — bijvoorbeeld "map heette 'belasting 2019'" |
| `akkoord` | Leeg; hij vult ja of nee in |

De kolom `reden` is wat hem leert wanneer hij Codex kan vertrouwen. Hij ziet niet alleen wát er wordt voorgesteld maar waaróm, en herkent binnen honderd regels het patroon. Sorteren op `zekerheid` zet de twijfelgevallen bovenaan.

**Hij:** vult `akkoord`. Dit is zijn hele werk — geen enkele map hoeft hij te openen.

**Codex:** verwerkt correcties **als regel**, niet als losse wijziging. Corrigeert hij één regel, vraag dan of dat op alle vergelijkbare bestanden moet gelden, en pas het toe. Dit is de kern van "hij keurt regels goed, geen bestanden".

### Stap 5 — Kopiëren

**Codex:** kopieert alleen de rijen met `akkoord = ja`. Rapporteert na afloop: hoeveel gekopieerd, hoeveel overgeslagen als duplicaat, hoeveel als ruis, hoeveel naar `_twijfel/`. Controleert dat de oude boom onveranderd is.

### Stap 6 — Volgende bedrijf

Herhalen. Na elke ronde `voortgang.md` bijwerken.

### Stap 7 — De enige onomkeerbare beslissing

Als alles is overgezet en hij tevreden is, kiest hij wat er met de oude structuur gebeurt: laten staan, archiveren, of weggooien. Dat is één beslissing, aan het eind, door hem — in plaats van duizend kleine beslissingen onderweg.

**Niet doen voordat de bewaartermijnen zijn nagevraagd.** Zie deel 6.

---

## DEEL 5 — Wat langer duurt, en later kan

Er zit een hard verschil tussen twee soorten werk.

**Ordenen op wat naam, pad en datum al vertellen** is snel. Media per jaar en gebeurtenis, duplicaten eruit, alles wat al `belasting 2019` in het pad heeft. Dat is de avond die hierboven beschreven staat.

**Zinnige namen geven aan bestanden die `scan0043.pdf` heten** vereist dat Codex ze opent en leest. Per stuk is dat seconden; bij duizend stuks zijn het uren.

**Audio en video moeten eerst uitgeschreven worden** voordat je weet waar ze over gaan. Dat loopt in de orde van de speelduur zelf: tientallen uren opnames is een nacht draaien. Bij video geldt dat alleen voor het geluidsspoor — naar de beelden kijken is veel zwaarder en voor thuisvideo's zelden nodig, omdat datum en gebeurtenismap meestal al genoeg vertellen.

Dit is een keuze voor hem, geen technisch probleem: neemt hij genoegen met `scan0043.pdf` in de juiste map, of moet het bestand ook een goede naam krijgen? Het eerste is de avond. Het tweede is de week erna, en kan prima later — de structuur staat dan al.

### Nog twee dingen over media

**Video's zijn waarschijnlijk het grootste deel van die 250 GB.** Honderd video's kunnen meer ruimte innemen dan tienduizend foto's. Dat merkt hij vooral bij het kopiëren.

**Bijna-duplicaten vindt Codex niet.** Dezelfde video of foto in een grote en een kleine versie, of eentje die via WhatsApp is gegaan, is voor de computer niet hetzelfde bestand — terwijl het voor hem dezelfde opname is. Alleen exacte duplicaten worden herkend. Verwacht dus niet dat alle dubbelingen eruit gaan.

---

## DEEL 6 — Wat het onderzoeksteam moet toetsen

Dit voorstel is opgesteld zonder toegang tot het archief in kwestie. De volgende punten zijn **niet geverifieerd** en bepalen of de aanpak werkt.

### Praktisch

1. **Vrije ruimte.** Er moet plek zijn voor een tweede volledige kopie. Bij 250 GB betekent dat minimaal 500 GB beschikbaar in het account. Controleren voordat er iets begint.
2. **Kopieergedrag van de synchronisatie.** Het belangrijkste punt uit het hele plan. Testen met één map: gaat een kopie binnen OneDrive over zijn internetverbinding of aan de serverkant? Dat bepaalt of de kopieerstap een avond of een week duurt.
3. **Toegang van Codex tot de map.** Kan de agent daadwerkelijk lezen en schrijven in de gesynchroniseerde OneDrive-map van zijn machine?
4. **Werkelijke samenstelling van het archief** — hoeveel media, hoeveel uur opnames, hoeveel documenten. Alle tijdsinschattingen staan of vallen hiermee.

### Inhoudelijk

5. **Welke entiteiten zijn er?** Welke bedrijven, en wat is privé? Dat is het bovenste niveau van de hele structuur en moet vaststaan voordat er iets gekopieerd wordt.
6. **Gedeelde mappen.** Welke mappen deelt hij met een boekhouder, collega of klant? Die blijven in de eerste ronde buiten schot; hernoemen breekt de verwijzingen van anderen.
7. **Bewaartermijnen.** Voor zakelijke administratie gelden wettelijke bewaarplichten. Dit document doet daar geen uitspraak over — laat zijn boekhouder bevestigen welke termijnen gelden, vóór stap 7.
8. **Privacygrens.** Welke inhoud mag wel en niet naar een extern taalmodel? Financiële en medische stukken verdienen een expliciete afspraak vooraf, niet achteraf.
9. **Is de domeinlijst de juiste?** De lijst in deel 2 is een startpunt. Hij moet uit zijn werk en zijn leven komen, niet uit dit document.

### Bewust buiten scope

- Automatisch verwijderen van wat dan ook.
- Het opschonen van gedeelde of samenwerkingsmappen.
- Migratie naar een ander opslagplatform.

---

## DEEL 7 — Bijlage: de zware route

**Lees dit alleen als de eenvoudige aanpak niet volstaat.** Begin er niet mee.

De aanpak hierboven werkt omdat het een eenmalige actie is op een lokaal beschikbare map. Er zijn twee situaties waarin dat niet opgaat:

- **Hij wil dit herhaaldelijk doen** — bijvoorbeeld maandelijks nieuwe binnenkomst opruimen. Dan wil je een script dat alleen wijzigingen ophaalt in plaats van elke keer alles.
- **De map is niet lokaal beschikbaar**, of het archief is zoveel groter dat een gewone doorloop vastloopt.

In beide gevallen kom je uit bij de Microsoft Graph-API. Wat dat met zich meebrengt:

| Wat | Consequentie |
|---|---|
| App-registratie of connector | Eenmalige inrichting, aan zijn kant, met zijn eigen inloggegevens |
| Bij een zakelijk account mogelijk beheerderstoestemming | **Kan het traject blokkeren** als hij zelf geen beheerder is. Dit eerst uitzoeken, vóór al het andere |
| Alleen leesrechten aanvragen | Maakt "de agent kan niets stukmaken" technisch waar in plaats van beloofd |
| Delta-mechanisme | Tweede scan haalt alleen wijzigingen op en kost seconden |
| Hervatbaarheid en wachtgedrag bij afknijping | Vereist, anders loopt een grote scan stuk of raakt het account geblokkeerd |

**Bouwtijd:** naar schatting vier tot zes uur actief werk, oftewel ongeveer één werkdag doorlooptijd — mits de authenticatie meezit. Die authenticatie is de enige echte onzekerheid en het is geen werk dat een agent kan versnellen.

**Uitvoer:** dezelfde `inventaris.csv` als in stap 1, plus een leesbaar rapport. De rest van het stappenplan blijft ongewijzigd.

**Acceptatiecriteria als ze dit bouwen:** twee runs achter elkaar geven een identieke inventaris; het script halverwege afbreken en hervatten geeft hetzelfde resultaat; het gemeten netwerkverkeer is klein ten opzichte van het archief (is het vergelijkbaar met de omvang van het archief, dan worden er bestanden gedownload en klopt er iets niet); een poging tot schrijfactie faalt op ontbrekende rechten.

Bouw in deze volgorde: eerst authenticeren en één pagina ophalen om te zien welke velden er daadwerkelijk in zitten, dan de volledige doorloop, en als laatste het rapport. Andersom werk je aan een rapport waarvan je de invoer nog niet kent.

---

## DEEL 8 — Herkomst en betrouwbaarheid

**Wat vaststaat:** de opzet zelf. Kopiëren in plaats van verplaatsen, de oude structuur onaangeroerd laten, entiteit als bovenste niveau, regels goedkeuren in plaats van bestanden, `_twijfel/` als kwaliteitsmeter, en één onomkeerbare beslissing helemaal aan het eind. Dat is ontwerpredenering, geen empirie, maar het is intern consistent en toetsbaar.

**Wat schatting is:** elk getal in dit document. Ze zijn afgeleid van gangbare orde-van-grootte-aannames, niet van een meting aan dit archief. Vervang ze zodra er echte cijfers zijn.

**Wat onbekend is:** alles in deel 6 — met punt 2 (het kopieergedrag van de synchronisatie) als het risico dat het meeste kan omgooien.

**Waar dit vandaan komt:** een gespreksuitwisseling tussen Sander en Hermes op 17 augustus 2026, over hoe een AI-agent iemand met weinig LLM-ervaring kan helpen bij een grote opruimactie zonder dat die persoon de regie verliest. Er is geen toegang geweest tot het archief in kwestie. Een eerdere versie van dit document ging uit van een API-koppeling met een backup vooraf en verplaatsingen achteraf; die is vervangen door de eenvoudiger kopieeraanpak nadat bleek dat die dezelfde zekerheid geeft met aanzienlijk minder werk.

**Aan de begeleidende LLM:** je mag dit document tegenspreken. Blijkt bij het onderzoek dat een aanname niet klopt, zeg dat dan tegen de gebruiker in plaats van het voorstel te volgen omdat het op papier staat. Dit is een voorstel ter beoordeling, geen instructie van bovenaf.

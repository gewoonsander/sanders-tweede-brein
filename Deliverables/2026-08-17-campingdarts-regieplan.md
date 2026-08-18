---
key_element: passie
---

# Campingdarts — regieplan

Regieversie van het conceptscript in [[2026-08-17-campingdarts-filmscript]]. Dat script is de bron voor *wat* er in beeld komt en voor de exacte wolkjesteksten. Dit plan voegt de regielaag toe: hook-timing, camerapositie, aantal takes, montage-instructie per shot, het ritme, de Resolve-werkorder en het exportplan.

**Afhankelijkheid, expliciet:** de tijdsberekeningen hieronder zijn afgeleid van de wolkjesteksten zoals ze nu in het filmscript staan. Verandert een tekst daar, dan moet de leestijd van dat wolkje hier opnieuw gerekend worden (formule in §7).

## Hoe je dit leest

- **Op je telefoon, tijdens het filmen:** §3 (vaste regels), §4 (opnamevolgorde) en §5 (de veldkaarten). Dat is alles wat je op de camping nodig hebt.
- **Achter de laptop, tijdens de montage:** §6 tot §10. Tabellen en framegetallen staan daar, niet in de veldkaarten.

---

## 1 · Hook-beslissing

**Besluit: shot 1 blijft de hook, maar wordt anders gekaderd — en krijgt er een tweede beeld bij.**

Een close-up van een pijl die in een bord tikt kan overal ter wereld gefilmd zijn; er is geen enkele reden om te blijven kijken. Wat de scroll stopt is niet de pijl maar de ongerijmdheid: een compleet dartbord op een grasveld naast een voortent. Daarom: 1,0 sec close-up van de pijl mét campingachtergrond herkenbaar achter het bord, dan een harde snit naar 0,8 sec ruimer beeld van de hele opstelling op het veld — de flashforward die de vraag "hoe kom je hier terecht?" oproept die de rest van de video beantwoordt.

Prijs die je hiervoor betaalt: de eindopstelling is al in seconde 2 verklapt. Dat is bewust. In korte video werkt het weggeven van de uitkomst vóór het verhaal (de "hoe het zover kwam"-opening) beter dan een verrassing bewaren die niemand meemaakt omdat hij al weggescrold is. De payoff van de video verschuift daarmee van "kijk, een dartbord" naar de eerste worp in shot 12, waar de grap zit.

Geen tekst in de hook, zoals in het script. De eerste tekst valt in shot 2 en zet daar meteen de tijd ("Dag 3").

---

## 2 · Het probleem dat het script niet oplost — één telefoon, twee rollen

Je filmt met je telefoon. In shot 5 moet die telefoon zelf in beeld (duim scrollt) en in shot 7 moet hij piepen. Dat kan niet met één toestel. Drie routes, in volgorde van voorkeur:

- **A — Shot 5 wordt een schermopname.** Neem met de schermopname-functie op hoe je de bestelling doorloopt en gebruik dát beeld beeldvullend, gekaderd in de 9:16 met een rand eromheen. Geen tweede telefoon nodig, sluit stilistisch aan bij de cartoonoverlays, en de tekst *"Standaard ✓ Mat ✓ Verstand ✗"* plak je er in Fusion overheen. Dit is het plan waar §5 van uitgaat.
- **B — Shot 7 krijgt geen echte piep maar een Fusion-notificatiebanner.** Je ploft in de stoel, en 0,2 sec later schuift bovenin een cartoon-notificatiebalkje in beeld. De tekst staat inmiddels vast in het filmscript: *"Bezorgd — 3 minuten geleden"*. Geluid van een piep zet je er in Fairlight onder. Ook dit zit in §5 verwerkt.
- **C — Alleen als er een tweede telefoon beschikbaar is.** Dan kun je shot 5 en 7 filmen zoals oorspronkelijk bedoeld. Of er iemand met een tweede telefoon bij je is, staat niet in de briefing — dat neem ik niet aan.

---

## 3 · Vaste regels voor de hele opnamedag

**Geen cameraman.** Dit is de regel die alle andere bepaalt: er is niemand die filmt. Elk shot is dus óf een lock-off (telefoon staat stil ergens tegenaan, jij loopt in beeld) óf handheld van iets in je eigen handen. Geen enkel shot mag een operator veronderstellen.

**Instellingen die je één keer zet en niet meer aanraakt:**

- Zet **HDR-video uit** (Instellingen → Camera → Video/Formats). iPhone-HDR komt in Resolve wasbleek of oververzadigd binnen en kost je een halve avond kleurwerk. Dit vóór het filmen doen, want je kunt het achteraf niet ongedaan maken.
- **Hoogst beschikbare resolutie, verticaal.** Reden: de montage-timeline is 1080x1920. Film je in 4K, dan kun je in Resolve tot 200% inzoomen zonder scherpteverlies — dat is waar de snap-zooms en de close-ups uit het uitpakshot vandaan komen. Dit spreekt de scripttip "niet inzoomen maar dichterbij lopen" niet tegen: *op de camping* nooit de digitale zoom gebruiken, wel achteraf in Resolve inkaderen.
- **60 beelden per seconde als je toestel dat verticaal kan**, anders 30. 60 is alleen echt nodig voor shot 9 (speed ramp) en shot 12 (worp). Kan je dat niet per shot omzetten zonder gepiel: zet alles op 60.
- **Portretstand vergrendelen** en het **raster aan**.
- **Standaard stabilisatie, geen Action-modus.** Action snijdt flink in het beeld en heeft veel licht nodig.

**Per take, altijd, zonder uitzondering:**

- **Tik-en-houd op je onderwerp om scherpte en belichting te vergrendelen** vóór je opneemt. Doe je dit niet, dan gaat de telefoon halverwege je take opnieuw scherpstellen en pompen met de belichting — precies het soort fout dat je pas in de montage ziet en dan niet meer kunt herstellen.
- **Camera 5 seconden langer laten lopen dan de shotlengte**, aan het begin én aan het eind. Die aanloop en uitloop zijn je montagemarge.
- **Je hebt geen horloge nodig.** De opnameteller van de camera-app staat gewoon in beeld terwijl je filmt; dat is je klok. Elke veldkaart geeft een opnameduur, niet een stopwatch-cue.

**Continuïteit — drie dingen die de video slopen als je ze vergeet:**

1. **Zelfde kleren in elk shot.** Alles binnen één blok van maximaal anderhalf uur filmen; daarna staat de zon merkbaar anders.
2. **Het dartbord mag in shots 2 tot en met 9 nergens in de achtergrond staan.** Check je kader vóór elke take.
3. **Zon:** de gezichtsshots (2, 4, 7, 13) in de schaduw van de voortent of in het laatste uur voor zonsondergang. Maar dan alle shots in dat blok, niet de helft.

**Privacy, echt even opletten:** de receptie (shot 6) en het campingpad (shot 9) zijn openbaar. Andere kampeerders of receptiemedewerkers herkenbaar in beeld en dan op Facebook zetten is niet netjes en juridisch niet zonder risico. Kader zo dat er niemand anders in staat, of film op een stil moment. Bij de receptie: film van buiten en van achteren, niet naar binnen op gezichten.

**Batterij:** shot 11 is een lange doorlopende opname in hoge resolutie. Vol opladen voor je begint.

---

## 4 · Opnamevolgorde (afwijkend van de verhaalvolgorde)

De cijfers zijn de shotnummers uit het filmscript. Deze volgorde bestaat om drie redenen: het uitpakken kan maar één keer, de opstelling mag niet te vroeg in beeld staan, en het scheelt je loopwerk.

1. **Doos dicht, alle buitenkantjes eerst** (materiaal voor de kop van shot 10). Zolang de doos dicht is, is elk kader herhaalbaar. 4 takes, verschillende hoeken.
2. **Shot 2, 3, 4** — bij de stoel, in de schaduw. Bord nog niet in de buurt.
3. **Shot 5** — schermopname van de bestelling (kan ook 's avonds binnen).
4. **Shot 6 en 9** — beide weg van de tent. In één wandeling combineren.
5. **Shot 7** — plof in de stoel.
6. **Shot 8** — karretje klapt open, close-up.
7. **Shot 10 — het uitpakken. Onherhaalbaar.** Camera staat, kader gecheckt, opname loopt al *voordat* je het mes oppakt.
8. **Shot 11** — de opbouw, in 3 losse brokken (zie veldkaart).
9. **Shot 12** — eerste worp.
10. **Shot 13** — uitsmijter in de stoel.
11. **Shot 1 — de hook, als laatste**, want daar moet het bord voor staan. Zelfde licht als de rest, dus meteen na 13 in hetzelfde blok.

---

## 5 · Veldkaarten per shot

Codes: **LO** = lock-off, telefoon staat ergens stil tegenaan en jij komt in beeld. **HH** = handheld, twee handen, ellebogen tegen je ribben, uitademen en stilhouden. **HL** = handheld laag: telefoon ondersteboven op de grond leggen zodat de lens vlak boven het gras zit; het beeld draai je in Resolve 180° terug.

---

### S1 · Hook — pijl tikt in het bord + reveal
**Montageduur:** 1,80 sec (0,95 close + 0,85 reveal)
**Camera A (close):** HH, ooghoogte van het bord (± 1,70 m), 25–30 cm van het bord af, licht van de zijkant zodat de pijl schaduw geeft. Kader zo dat rechts of links van het bord een stuk voortent of grasveld herkenbaar meeloopt — dat stukje context ís de hook.
**Camera B (reveal):** LO op tafel- of stoelhoogte (± 0,80 m), 3 tot 4 meter terug, hele opstelling plus voortent in beeld.
**Truc:** gooi vanaf één meter afstand. Op een close-up ziet niemand hoe ver je stond, en zo blijft de pijl gegarandeerd zitten.
**Takes:** 6× camera A (elke take 8 sec), 3× camera B (elke take 8 sec).
**Montage:** camera A pakken op het frame vóór de inslag, harde snit naar B precies op de inslag. Op B: een schaal-keyframe van 95% → 100% over 3 frames, zodat de reveal een tik krijgt. Geen tekst, geen overgang. Dit is ook de shot waar de stilisatie op komt (§8, Color).

---

### S2 · De verveling — onderuitgezakt in de stoel
**Montageduur:** 2,80 sec
**Camera:** LO, ± 1,10 m hoog, iets boven je ooghoogte in de stoel, 1,5 m schuin voor je. Telefoon tegen de bierkrat of koelbox.
**Spel:** niets doen. Echt niets. Adem uit, ogen de verte in, geen enkele beweging behalve één keer knipperen.
**Takes:** 3× 8 sec.
**Montage:** wolkje *"Dag 3. Nog 11 te gaan."* ploept op vanaf frame 9 (0,30 sec na de snit) en blijft staan tot de uitgaande snit — 2,50 sec leestijd. Wolkje rechtsboven, naast je hoofd, nooit erover. Geen fade-out: het wolkje sterft op de snit.

---

### S3 · Twee detailshots — mier en vlaggetje
**Montageduur:** 2× 0,80 sec = 1,60 sec
**Camera:** HH, zo dichtbij als je toestel scherp krijgt (test dit, meestal 8–12 cm op de gewone lens). Mier: recht naar beneden op het tafelblad. Vlaggetje: van onderaf tegen de lucht, zodat het silhouet leesbaar is.
**Takes:** 4× 6 sec per detail.
**Vervangbaar, en dat is geen concessie:** de functie van deze twee shots is *"er gebeurt niets"* — niet "een mier" specifiek. Geen mier binnen een minuut zoeken? Neem een vlieg, een condensdruppel op een blikje, een blad dat over het gras rolt. Geen wind voor het vlaggetje? Neem een scheerlijn of het rookje van een barbecue. Ga hier geen kwartier op verliezen.
**Montage:** twee harde snitten van elk 24 frames. Wolkje *"…"* start op frame 6 van het eerste detail en loopt door over de snit heen; laat de drie puntjes één voor één inploppen, één puntje per 8 frames. Sterft op de uitgaande snit.

---

### S4 · Het idee — je veert overeind
**Montageduur:** 1,80 sec
**Camera:** LO, exact dezelfde plek en hoogte als S2. Niet verplaatsen — dat de camera identiek staat maakt het overeind veren harder.
**Spel:** van volledig stil naar rechtop in één beweging, ogen groot, hoofd één keer schuin. Iets te veel is hier goed; dit is een cartoon.
**Takes:** 4× 6 sec. Neem de beste, niet de eerste.
**Montage:** snap-zoom in op je gezicht op het moment dat je overeind komt: schaal 100% → 130% over 3 frames, dan stil. Dit is precies waarom je in 4K filmt. Lampje-wolkje ploept op frame 6, tekst *"DARTEN."* op frame 10, alles sterft op de snit — 1,47 sec leestijd. Magic Mask op deze shot, zodat het wolkje net achter je schouder wegvalt in plaats van er plat overheen te liggen.

---

### S5 · De bestelling — schermopname
**Montageduur:** 3,20 sec
**Opname:** schermopname op je telefoon terwijl je door de dartstandaard en de mat scrollt. Rustig scrollen, geen wilde vegen. Zorg dat er geen privémail, banksaldo of adres in beeld komt.
**Takes:** 2× circa 20 sec; je knipt er 3 sec uit.
**Montage:** de schermopname beeldvullend in de 9:16 (hij is al verticaal, dus hij past — kader alleen de statusbalk eruit). Drie tekstregels los inploppen: *"Standaard ✓"* op frame 9, *"Mat ✓"* op frame 24, *"Verstand ✗"* op frame 48. Alle drie blijven staan tot de snit; de derde regel — de grap — heeft daarmee 1,60 sec. Zet die regel groter en in een andere kleur dan de eerste twee.

---

### S6 · De receptie
**Montageduur:** 2,20 sec
**Camera:** LO, ± 1,20 m, telefoon op een bankje, vensterbank of tegen een fietsenrek, zo dat het receptiegebouw achter je herkenbaar is maar er geen gezichten van anderen in staan. Jij loopt het kader in, kijkt naar binnen, haalt je schouders op, loopt eruit.
**Takes:** 3× 15 sec.
**Montage:** in het beeld op het moment dat je al bijna bij de deur bent — de aanloop knip je weg. Wolkje *"Nog niets."* ploept op frame 21, dus pas ná de blik naar binnen; blijft 1,50 sec staan. De schouderophaal-beweging valt binnen het wolkje.

---

### S7 · Terug bij de tent
**Montageduur:** 3,00 sec (was 2,20 — verlengd nu de bannertekst vaststaat)
**Camera:** LO, zelfde positie als S2 en S4. Derde keer dezelfde kader — dat is een grap op zichzelf.
**Spel:** ploffen. Één beweging, gewicht laten vallen.
**Takes:** 3× 8 sec.
**Montage:** snit precies op het moment dat je gewicht de stoel raakt. Fusion-notificatiebanner *"Bezorgd — 3 minuten geleden"* schuift bovenin in op frame 4 en **gaat niet meer weg** — hij blijft staan tot de uitgaande snit op frame 90, dus 86 frames oftewel 2,87 sec in beeld. Piep in Fairlight onder het inschuiven. Wolkje *"…Serieus."* van frame 48 tot de snit — 1,40 sec, exact het minimum. Niet korter maken.

**Waarom de banner blijft staan, en waarom dat mag.** De banner telt 27 tekens en vraagt volgens §7 dus 2,60 sec. Hij weghalen op frame 22 gaf hem 0,60 sec: onleesbaar, en juist deze tekst draagt de grap. Drie routes bekeken:

1. *Banner tot frame 82 solo laten staan en het wolkje er daarna achteraan.* Dan wordt shot 7 4,20 sec, met circa 2 sec statische man-in-een-stoel in het dode midden van de film. Dat is precies het visuele-vermoeidheidspatroon dat ik in het middenstuk heb weggesneden. Afgevallen.
2. *Bannertekst inkorten.* Kan, maar tekst is Sanders beslissing en het is hier niet nodig.
3. **Banner laten staan en bewust laten overlappen met het reactiewolkje.** Gekozen.

Route 3 is niet alleen de goedkoopste, hij is ook de betere regie. De banner is geen wolkje maar een ding in de wereld — de aanleiding. Het wolkje is de reactie erop. Haal je de aanleiding weg vóór de reactie, dan moet de kijker de grap uit zijn geheugen ophalen; laat je hem staan, dan bevat één kader oorzaak én reactie. Zo leest een visuele gag het sterkst. De twee teksten botsen ook niet ruimtelijk: de banner staat bovenin, het wolkje links midden (§7).

**Eerlijk over wat dit wél kost:** de banner haalt zijn 2,60 sec als *tijd in beeld*, maar heeft daarvan alleen de eerste 1,47 sec (frame 4 tot 48) onverdeelde aandacht. Dat de kijker vier woorden in een herkenbare notificatiebalk binnen die 1,47 sec leest, is mijn regieoordeel — geen gemeten feit. Blijkt bij het terugkijken dat de banner te snel gaat, dan is de goedkoopste reparatie het wolkje 12 frames later laten inploppen en shot 7 met dezelfde 12 frames verlengen naar 3,40 sec.

---

### S8 · Het karretje klapt open
**Montageduur:** 2,10 sec (was 3,00 — ingekort nu het wolkje 13 in plaats van 28 tekens telt)
**Camera:** HH, laag (± 0,40 m), schuin van voren zodat je de klapbeweging in de diepte ziet. Karretje voor een rustige achtergrond zetten — gras of tentdoek, geen andere caravans.
**Spel:** één vloeiende beweging, niet haperend. Twee handen aan het karretje betekent dat de telefoon ergens tegenaan moet: maak hier een LO van als je de beweging met twee handen nodig hebt.
**Takes:** 4× 6 sec.
**Montage:** snit 4 frames vóór de klap, zodat de beweging meteen begint. Wolkje *"Hiervoor dus."* van frame 9 tot de snit op frame 63 — 1,80 sec in beeld, terwijl 13 tekens er 1,67 vragen. Ruimte over, dus hier hoeft niets meer aan.

**Wat deze tekstkeuze opleverde:** de eerdere formulering (28 tekens) dwong deze shot naar 3,00 sec en was het langste wolkje van de film in de kortste ruimte. De korte versie geeft 0,90 sec terug aan het middenstuk — precies het budget waar shot 7 nu 0,80 sec van gebruikt voor de notificatiebanner.

---

### S9 · De sjouw — heen leeg, terug met de doos
**Montageduur:** 2,90 sec (1,40 heen + 1,50 terug)
**Camera:** HL, telefoon ondersteboven op het campingpad, lens vlak boven de grond, pad recht in de diepte. Zelfde positie voor beide helften.
**Wat er verandert ten opzichte van het script:** het script laat je alleen wéglopen. Dan mist de kijker het moment dat het pakket daadwerkelijk arriveert, en shot 10 begint uit de lucht met een doos op tafel. Oplossing zonder extra opstelling: film vanaf exact dezelfde plek ook de terugweg, met de doos op het karretje, naar de camera toe. Kost geen extra montagetijd, want de heenweg wordt korter.
**Takes:** 2× heen (12 sec), 2× terug (12 sec).
**Montage:** heenweg met speed ramp — eerste 0,55 sec op normale snelheid, dan in 4 frames naar 300% en zo uitlopen. Snit op het moment dat je uit kader bent. Terugweg op normale snelheid, snit als het karretje de onderkant van het kader raakt. Wolkje *"Gasfles heen, darts terug."* van frame 9 tot het einde van de heenweg-helft — 2,60 sec, dus het loopt over de snit tussen heen en terug heen. Dat is bewust: het wolkje verbindt de twee helften tot één gedachte.

---

### S10 · Uitpakken — de onherhaalbare shot
**Montageduur:** 4,00 sec
**Camera:** LO, ± 1,30 m, schuin boven de tafel, **hele tafel plus je handen in beeld en ruim eromheen**. Dit is het belangrijkste kaderbesluit van de dag: je filmt één master in 4K en haalt de close-ups er in Resolve uit door in te kaderen. Losse close-ups filmen kan niet, want de doos gaat maar één keer open.
**Checklist vóór je het mes aanraakt:** scherpte en belichting vergrendeld, opname loopt, doos staat met het label naar de camera, mes ligt binnen bereik in kader, handen droog.
**Takes:** **1.** Laat de opname 60 tot 90 sec doorlopen en pak alles rustig uit. Haast is hier je vijand.
**Montage:** vier micro-beats uit die ene master, elk met een eigen inkadering: doos dicht (0,60 sec, ruim), mes erin (1,20 sec, ingekaderd op 180%), standaard eruit (1,10 sec, 150%), mat eruit (1,10 sec, ruim). Harde snitten. Geen wolkje: dit is het enige moment in de film waar het beeld zichzelf uitlegt en tekst alleen maar zou concurreren met de payoff die eraan komt.

---

### S11 · De opbouw — drie brokken, geen timelapse-modus
**Montageduur:** 3,50 sec (3× circa 1,17 sec)
**Camera:** LO, ± 1,20 m, wijd genoeg dat de hele standaard in beeld blijft als hij rechtop staat. Telefoon tegen de bierkrat. Niet verplaatsen tussen de brokken.
**Wat er verandert ten opzichte van het script:** níet de timelapse-modus van de telefoon gebruiken en níet één lange doorlopende opname. Neem drie normale video-opnames van elk 20 tot 40 sec: (a) standaard in elkaar, (b) bord erop, (c) mat uitrollen. Twee redenen: de timelapse-modus van een telefoon bepaalt zelf hoeveel hij versnelt, dus je krijgt niet de 3,50 sec die je nodig hebt; en drie brokken geven je drie ritmische tikken in plaats van één egale versnelling. Bovendien doe je het versnellen dan zelf in Resolve, wat precies is wat je wilde leren.
**Takes:** 1 per brok, dus 3 in totaal.
**Montage:** per brok rechtsklik → Retime Controls, of rechtsklik → Change Clip Speed en typ de doelduur van 35 frames in; Resolve rekent het percentage uit. Frame-sampling op Nearest — bij dit soort extreme versnelling voegt vloeiende interpolatie niets toe en het kost je alleen rekentijd op de Air. Geen wolkje. Op de derde brok (mat uitrollen) eindig je op een stilstaand kader van de complete opstelling: dat is het bruggetje naar de worp.

---

### S12 · De eerste worp — de piek
**Montageduur:** 4,80 sec
**Camera A (over de schouder):** dit is de lastigste opstelling van de dag, want je hebt geen statief en geen cameraman. Doel: telefoon net achter en boven je gooiende schouder, dus rond 1,50 m. Praktisch: koelbox op de campingtafel, tafel achter je gooipositie, telefoon daartegen. **Lukt die hoogte niet, forceer het niet** — film dan van achteren op heuphoogte (± 1,00 m) licht omhoog gekaderd. Dat leest nog steeds als "met hem mee kijken" en is met wat er is haalbaar.
**Camera B (het bord):** HH, recht op het bord, dicht genoeg dat de scores leesbaar zijn.
**Takes:** 4× camera A (15 sec per take), 2× camera B.
**Montage, frame voor frame:** stilstaan en mikken frame 0–24 · eerste pijl los op frame 24 · tweede op 42 · derde op 60 · wolkje *"180?"* ploept op frame 66, direct na de derde worp · harde snit naar het bord op frame 108, waar het wolkje sterft · bord in beeld 36 frames (1,20 sec). Het wolkje staat dus 1,40 sec. **Hoe lager de echte score, hoe beter de grap — dus knoei niet in de montage met welke worp je pakt. Neem de eerlijke.**

---

### S13 · Uitsmijter en uitnodiging
**Montageduur:** 5,20 sec
**Camera:** LO, ± 1,10 m, vierde keer dezelfde stoelkader als S2, S4 en S7 — maar nu met het bord in de achtergrond. Dat is de hele film in één beeld.
**Spel:** achterover, pijltjes in de hand, één keer tevreden knikken. Niet lachen naar de camera.
**Takes:** 3× 10 sec.
**Montage:** wolkje *"Vakantie geslaagd."* van frame 9 tot frame 75 — 2,20 sec. Dan 3 frames niets. Dan de slottekst *"Wie komt darten op veld C?"* van frame 78 tot het eind — 2,60 sec, en dat is het minimum voor 26 tekens, dus niet inkorten. De laatste 24 frames maak je een freeze frame (rechtsklik → Freeze Frame), zodat de uitnodiging op een stilstaand beeld staat en niet wegbeweegt terwijl iemand hem leest. Magic Mask op deze shot, zodat de slottekst achter je door kan lopen. Stilisatie hier ook, spiegel van de hook.

---

## 6 · Ritme en tijdlijn

**Totale duur: 38,90 sec** (1167 frames bij 30 fps). Herrekend op 2026-08-17 nadat de wolkjestekst van shot 8 en de bannertekst van shot 7 definitief werden.

Ter correctie op het conceptscript: de dertien shotlengtes in het bijgewerkte script tellen op tot 43,6 sec — de proza-inleiding daar noemt nog 44,5 sec, wat het getal is van vóór de tekstwijziging op shot 8 (zie §11). Mijn versie snijdt daar 4,7 sec uit, vooral in het middenstuk.

| # | Shot | Start | Duur | Frames |
|---|---|---|---|---|
| 1 | Hook + reveal | 0,00 | 1,80 | 54 |
| 2 | Verveling | 1,80 | 2,80 | 84 |
| 3 | Twee details | 4,60 | 1,60 | 48 |
| 4 | Het idee | 6,20 | 1,80 | 54 |
| 5 | De bestelling | 8,00 | 3,20 | 96 |
| 6 | De receptie | 11,20 | 2,20 | 66 |
| 7 | Terug bij de tent | 13,40 | 3,00 | 90 |
| 8 | Het karretje | 16,40 | 2,10 | 63 |
| 9 | De sjouw | 18,50 | 2,90 | 87 |
| 10 | Uitpakken | 21,40 | 4,00 | 120 |
| 11 | De opbouw | 25,40 | 3,50 | 105 |
| 12 | De eerste worp | 28,90 | 4,80 | 144 |
| 13 | Uitsmijter + CTA | 33,70 | 5,20 | 156 |
| | **Totaal** | | **38,90** | **1167** |

**Waar de piek ligt.** De emotionele piek is shot 12, van 28,90 tot 33,70 sec — dat is 74 tot 87 procent van de looptijd, en daar hoort hij in korte video ook: laat genoeg dat de kijker geïnvesteerd is, vroeg genoeg dat de uitnodiging er nog achteraan kan. De twee tekstwijzigingen hebben die verhouding niet verschoven; ze compenseren elkaar bijna volledig. Daarvoor liggen twee kleinere pieken: de reveal in de hook (0,95 sec) en de complete opstelling aan het eind van shot 11 (rond 28,90 sec).

**Waar het script zakte, en wat ik heb gedaan.** Shots 6 tot en met 9 waren samen 12 sec in een film van 44 — bijna een derde van de looptijd aan lopen en wachten, precies in het midden, precies waar mensen afhaken. Dat is nu **10,20 sec** (2,20 + 3,00 + 2,10 + 2,90 = 306 frames) met vier snitten erin en een speed ramp, en de terugweg in shot 9 maakt het inhoudelijk sterker in plaats van alleen korter. Netto is het middenstuk door de twee tekstbesluiten nog eens 0,10 sec korter geworden: shot 8 leverde 0,90 sec in, shot 7 nam er 0,80 van op voor de notificatiebanner.

**Snitdichtheid:** de film bestaat uit 22 losse beelden (de hook telt er twee, S3 twee, S9 twee, S10 vier micro-inkaderingen, S11 drie brokken, S12 twee), dus 21 beeldwissels in 38,90 sec — gemiddeld één per 1,85 sec. *Dit getal is preciezer dan de "circa 20 / 1,95 sec" die hier eerder stond; die was op een grove telling gebaseerd.* De langste ononderbroken beweging is de slottekst-freeze van 0,80 sec; het langste stuk zonder beeldwissel of tekstbeweging is 1,50 sec (de staart van shot 6). Nergens visuele stilstand.

**Wat ik expliciet heb gecorrigeerd in de tijden:** shot 4 van 1,60 naar 1,80 en shot 5 van 2,80 naar 3,20, allebei omdat het wolkje anders korter in beeld staat dan leesbaar is (§7). Shot 13 van 3,50 naar 5,20 omdat er twee teksten achter elkaar in moeten en de CTA de belangrijkste tekst van de hele film is. En na de tekstbesluiten van 2026-08-17: **shot 7 van 1,90 naar 3,00**, zodat de notificatiebanner van 27 tekens leesbaar in beeld staat (zie de veldkaart bij S7), en **shot 8 van 3,00 naar 2,10**, omdat *"Hiervoor dus."* met 13 tekens veel minder leestijd vraagt dan de eerdere formulering.

---

## 7 · Leesbaarheidsregels voor de wolkjes

Deze video heeft geen dialoog en geen voice-over. Dat betekent dat de wolkjes niet een hulpmiddel zijn maar de complete verteller — de film werkt voor honderd procent van de kijkers zonder geluid. Er is dus ook geen ondertitelbestand nodig: er is geen spraak om te ondertitelen. Dat is een voordeel, maar het maakt de leesbaarheidsregels hieronder hard in plaats van optioneel.

**Minimale leestijd.** `0,8 sec basis + 1 sec per 15 tekens`, gerekend als tijd-in-beeld. Vakregel uit de ondertiteling (circa 15 tekens per seconde als comfortabele leessnelheid), plus 0,8 sec voor het opploppen en het oogsprongetje ernaartoe. Dit is een vuistregel uit het vak, geen platformspecificatie. Alle wolkjes in §5 plus de notificatiebanner van S7 zijn hiertegen nagerekend en halen het; drie zitten er precies op (het wolkje in S7, dat in S9 en de slottekst in S13). Bij de banner van S7 wordt die tijd voor een deel gedeeld met het reactiewolkje — dat is één bewuste uitzondering, verantwoord op de veldkaart.

**Tekstgrootte.** Minimaal 3,1% van de beeldhoogte aan letterhoogte, dus **minimaal 60 px bij 1080x1920**. Streef naar 90 tot 120 px voor de korte klappers (*"DARTEN."*, *"180?"*). Maximaal twee regels per wolkje, maximaal 24 tekens per regel. In Fusion is de `Text+`-grootte relatief, niet in pixels — zet dus één keer een hulplaag met een blok van 60 px hoog in je viewer en ijk daarop.

**Contrast.** Wolkje volledig dekkend wit, geen doorschijnendheid. Donkere rand van 6 tot 8 px eromheen. Tekst bijna-zwart, niet puur zwart. Een zachte schaduw op lage dekking onder het wolkje om het van het gras te tillen. Reden: een campingveld is groen, fel en druk — een half doorzichtig wolkje verdwijnt daarin, ook als het op je monitor prima leek.

**Positie.** Alle tekst binnen één rechthoek die op beide platforms veilig is: **horizontaal van 8% tot 88% van de breedte, verticaal van 14% tot 68% van de hoogte.** Bij 1080x1920 is dat x 86 tot 950 en y 269 tot 1306. Zet die rechthoek als hulplaag in je timeline en zet hem uit vóór de export.

> **Dit is een conservatieve marge, geen platformfeit.** De exacte veilige zone van Facebook Reels heb ik niet uit een verifieerbare bron in deze opdracht kunnen halen; de onderkant houdt ruimte vrij voor de profielnaam, de bijschrifttekst en de knoppenrij, de bovenkant voor de platformbalk. Die van Huddle is helemaal onbekend — zie §11.

**Beweging.** Ploppen, niet faden. In: schaal 0 → 112% in 5 frames, dan 112% → 100% in 3 frames. Uit: geen animatie, het wolkje sterft op de uitgaande snit. Dat is punchiger én minder werk. Enige uitzondering: de slottekst in shot 13, die op een freeze frame blijft staan tot het eind.

**Eén wolkje tegelijk.** Nooit twee wolkjes gelijktijdig in beeld. In shot 5 zijn de drie regels één blok dat gestaffeld opbouwt, niet drie losse teksten.

> **Eén uitzondering, en alleen deze.** In shot 7 blijft de notificatiebanner staan terwijl het wolkje *"…Serieus."* eroverheen komt. De banner is geen wolkje maar een voorwerp in de scène — de aanleiding waar het wolkje op reageert — en de kijker heeft hem dan al gelezen. Ze zitten bovendien op verschillende plekken in het kader (banner bovenin, wolkje links midden), dus er is geen ruimtelijke botsing. Volledige verantwoording op de veldkaart bij S7. Deze uitzondering geldt niet voor twee wolkjes, nooit.

**Kant afwisselen.** S2 rechtsboven, S4 linksboven, S6 rechts midden, S7 links midden, S8 rechtsboven, S9 midden boven, S12 rechts naast je schouder, S13 links. Nooit over je gezicht.

---

## 8 · Werkorder in DaVinci Resolve

Uitgangspunt: **Studio 21.0.4**, geïnstalleerd en geactiveerd op de MacBook Air (geverifieerd 2026-08-18 om 17:12 in het opstartlog van Resolve). De kanttekeningen "werkt ook in de gratis versie" hieronder kloppen op zichzelf, maar zijn voor deze machine niet van belang — elke Studio-functie uit dit plan is beschikbaar. De volledige handleiding staat op je eigen machine — het pad staat in [[2026-08-17-campingdarts-filmscript]].

### 0 · Project opzetten (vóór je iets importeert)

- Project Settings → Master Settings → **Timeline resolution: Custom 1080x1920**. **Timeline frame rate: 30**, playback frame rate 30.
- **De timeline-framerate moet je nú zetten.** Zodra er media in een timeline staat is hij niet meer te wijzigen. Dit is de meest voorkomende manier om een Resolve-project weg te moeten gooien.
- 60 fps-opnames in een 30 fps-timeline zijn geen probleem: die geven je juist de ruimte voor de speed ramp in S9 en een eventuele vertraging op S12.
- Project Settings → Image Scaling → Mismatched resolution: **Scale entire image to fit**. Je 4K-verticaal en je 1080x1920-timeline hebben dezelfde verhouding, dus er wordt niets afgesneden.
- Werkt allebei in de gratis versie.

### 1 · Media-pagina

- Alles importeren, **bin per shotnummer** (S01 tot S13). Doe dit meteen; met circa 40 clips van een telefoon met namen als `IMG_1234` ben je zonder bins een uur kwijt.
- Check bij de eerste clip of de rotatie goed staat. Telefoons zetten de draaiing in de metadata; meestal leest Resolve dat correct, soms niet.
- Rechtsklik in de mediapool → **Generate Optimized Media** voor alles. Op een MacBook Air is dit het verschil tussen werken en wachten. Werkt in de gratis versie.
- De HL-clip van S9 (ondersteboven gefilmd) krijgt op de Edit-pagina Inspector → Transform → **Rotate 180**.

### 2 · Cut-pagina — de ruwe montage

- Alleen assembleren, niets fijnslaan.
- Gebruik **Source Tape** om snel door alle takes te scannen en de beste te kiezen.
- Bouw eerst in verhaalvolgorde **S2 tot S13**, en zet **S1 daarna vooraan**. Reden: dan zie je of het verhaal ook zonder hook staat. Doet het dat niet, dan repareert geen hook dat.
- Grof in- en uitpunten, ruim aan beide kanten. Frames precies maken doe je op de Edit-pagina.
- De **Close Up**-knop van de Cut-pagina maakt in één klik een 2× inkadering — handig voor de vier micro-beats uit de master van S10.
- Werkt volledig in de gratis versie.

### 3 · Edit-pagina — timing tot op het frame

- Zet elke clip op de duur uit de tabel in §6. Typ de framegetallen; niet op het oog trimmen.
- **Snap-zooms** (S1 en S4): Inspector → Transform → Zoom, twee keyframes, 3 frames ertussen.
- **Speed ramp S9:** rechtsklik → Retime Controls → snelheidspunt zetten → 300%. Frame-sampling op **Nearest** of **Frame Blend**; die werken in beide versies. *Optical Flow en Speed Warp zijn Studio-functies* — voor deze video heb je ze niet nodig, want bij versnellen voegt interpolatie niets toe.
- **Versnelling S11:** rechtsklik → Change Clip Speed → doelduur 35 frames per brok invullen.
- **Freeze frame S13:** rechtsklik → Freeze Frame op de laatste 24 frames.
- **Hulplaag veilige zone** aanmaken (§7) op een videospoor bovenaan. Zichtbaarheid uit vóór de export — anders staat hij in je definitieve bestand.
- Geen enkele overgang tussen shots. Alleen harde snitten. Één uitzondering is toegestaan: 2 frames richtingsblur bij de snap-zoom van S4, als die effectgroep in jouw build zit.

### 4 · Fusion — de wolkjes, één keer bouwen

Dit is het grootste stuk werk en de reden dat de video er cartoonachtig uitziet. **Fusion zit volledig in de gratis versie.**

**Bouw het wolkje één keer:**

1. `MediaIn` (je beeld) staat er al.
2. `Background` op wit, formaat 1080x1920.
3. Drie of vier `Ellipse`-maskers, samengevoegd met Paint Mode op **Add**, die samen de wolkvorm maken. Plus twee kleine losse ellipsen als denkstaartje richting je hoofd.
4. `Background` + het maskerstapeltje → dat is je witte wolk met alpha.
5. Een tweede, iets groter en donkerder gekleurd exemplaar van diezelfde maskerstapel eronder mergen = je rand van 6 tot 8 px. Goedkoper en betrouwbaarder dan een outline-effect.
6. `Text+` erover, zwaar lettertype, bijna-zwart.
7. `Merge`: wolk + tekst → één element.
8. `Transform` als laatste, met de plop-keyframes uit §7.
9. `Merge` over `MediaIn`.

**Dan de tijdwinst:** selecteer de nodes van het wolkje, rechtsklik → **Macro → Create Macro**, en sla die op als template. Daarna sleep je hem op elk volgend shot en wissel je alleen de tekst en de positie. Dertien wolkjes voor de prijs van één. Voor zover ik weet werkt macro's maken en opslaan ook in de gratis versie — dat kun je in één minuut zelf verifiëren.

**Twee aparte Fusion-elementen** die je niet uit de wolkjes-macro haalt:
- **Lampje-wolkje S4:** hetzelfde wolkje, plus een lampsymbool. Bouw het lampje uit primitieven (`Ellipse` + `Rectangle`) of gebruik een lettertype-symbool in een tweede `Text+`.
- **Notificatiebanner S7:** afgeronde rechthoek plus `Text+` met *"Bezorgd — 3 minuten geleden"*, schuift van boven in via een `Transform`-keyframe. **Geen uit-animatie:** hij blijft staan tot de uitgaande snit (zie de veldkaart bij S7). Bouw hem breed genoeg dat de tekst op één regel past — twee regels in een notificatiebalk kost extra leestijd die er in deze shot niet is.

**Lettertype:** een zwaar of black-gewicht schreefloos lettertype dat al op je Mac staat. Kies niets dat je nog moet installeren, want een ontbrekend lettertype breekt je Fusion-compositie later stil.

### 5 · Color-pagina

- **Eerst normaliseren, dan stileren.** Loop elke clip langs met Lift/Gamma/Gain en zet de belichting gelijk. Een middag op een grasveld drift altijd; dat zie je pas als de shots naast elkaar staan.
- **Basislook voor alle shots:** contrast circa 1,10 met pivot rond 0,40, saturatie circa 1,20, en met Hue vs Sat het gras iets groener en de voortent iets verzadigder. Werkt in de gratis versie. Houd het hier bescheiden — de cartoon zit in de wolkjes en het tempo, niet in het beeld.
- **Magic Mask op precies drie shots: S4, S12 en S13.** Doel: het wolkje kan achter je schouder of hoofd wegvallen. **Magic Mask is een Studio-functie** (in de gratis versie is hij niet beschikbaar). Blijf bij drie shots — meer is op een MacBook Air veel rekentijd voor weinig extra effect. Bestaat er een snellere kwaliteitsstand in jouw versie, kies die; op 1080-uitvoer zie je het verschil niet.
- **Stilisatie alleen op S1 en S13**, zoals afgesproken. Twee routes:
  - **Route A, versie-onafhankelijk:** een lijntekening-laag bouwen in Fusion met `Highpass` → `BrightnessContrast` → ontzadigen → luma-key, en die als donkere lijnen over het beeld mergen. Daaronder in Color een stevige contrast- en saturatieduw voor het vlakke, geposteriseerde gevoel. Alle gebruikte nodes zitten in de gratis Fusion.
  - **Route B, sneller als het kan:** kijk in je Effects-lijst onder ResolveFX Stylize wat er in jouw build zit. Op deze machine draait Studio, dus de hele ResolveFX Stylize-categorie is bruikbaar; de eerdere slag om de arm over Studio-only effecten is hier niet meer van toepassing.
- **Render cache aanzetten** (Playback → Render Cache → Smart) voordat je met Magic Mask begint, anders wordt scrubben onwerkbaar.

### 6 · Fairlight — kort maar niet overslaan

Geen dialoog, dus dit is een halfuurtje, geen avond.

- **Hoogdoorlaatfilter rond 120 Hz op alle camerageluid.** Windgerommel van een open veld zit onder die grens en is anders niet weg te krijgen. Werkt in de gratis versie.
- **Vier geluiden dragen de film:** de tik van de pijl (S1), de klap van het karretje (S8), het snijden van de doos (S10) en de drie inslagen van S12. Zet die iets luider dan de rest.
- **De piep in S7** onder de notificatiebanner.
- **Muziekbed** uit de gratis bronnen die al in het filmscript staan vastgelegd. Duik onder de vier accentgeluiden heen met een paar volumekeyframes.
- **Muziek niet in de Facebook-app kiezen.** Het is verleidelijk om bij het uploaden een nummer uit de muziekbibliotheek van Facebook te plakken, maar dan heeft de Huddle-versie geen muziek en klinken de twee platforms verschillend. Eén muziekbed in Resolve, in beide exports gebakken.
- *Voice Isolation is een Studio-functie* — niet nodig, want er is geen spraak.

### 7 · Deliver — zie §9

---

## 9 · Exportplan

Twee bestanden. Beide 9:16, want dat is voor beide platforms de native verhouding — maar het zijn wél twee aparte renders met een eigen encode, niet één bestand dat je twee keer uploadt.

### Wat Martonny voor Huddle heeft geverifieerd (2026-08-17)

Deze vier punten stonden hier eerder als eigen aanname en zijn nu hard:

- **Containers die Huddle accepteert:** mp4, avi, wmv, mov. Onze MP4 kan dus gewoon native geüpload worden — geen omweg via een videodienst nodig voor het formaat zelf.
- **Maximale bestandsgrootte:** 2 GB op Lite en Premium, 5 GB op Ultimate. Onze export komt op circa 50 MB. Bestandsgrootte is daarmee geen enkele beperking, ongeacht Sanders tier.
- **Maximale resolutie:** 1080p, met automatische terugconversie van 4K-materiaal.
- Wat de documentatie **niet** zegt: aspectratio-gedrag, autoplay, geluid aan of uit, en ondertitelopties voor community-posts. Die blijven open — zie §11.

**Eén punt dat deze specs oproepen en dat ik niet zelf kan beslissen:** "maximaal 1080p" is een liggende norm (1920x1080). Onze video is 1080x1920 — de korte zijde is 1080, de lange 1920. Leest Huddle de grens als "maximaal 1080 pixels hoog", dan wordt een verticale 1080x1920 alsnog teruggeschaald en verliezen we scherpte, met name op de ingebrande tekst. Leest Huddle hem als "maximaal 2,07 megapixel / niet meer dan 1080p-klasse", dan is er niets aan de hand. Ik hou 1080x1920 aan, want terugschalen door het platform is nog altijd beter dan zelf te klein aanleveren. De testupload (§11) laat direct zien wat er gebeurt: kijk of de tekst in de wolkjes op een telefoon nog kraakhelder staat.

**Belangrijk over de tekstindeling:** ik heb alle tekst in de doorsnede van beide veilige zones gezet (§7). Daardoor kan één Fusion-opzet beide platforms bedienen en scheelt dat je een tweede montageronde. De prijs: de tekstzone is iets krapper dan Huddle waarschijnlijk nodig heeft. Blijkt uit Martonny's specs dat Huddle geen interface over het beeld legt, dan kun je daar later een ruimere variant van maken — dat is dan een tweede timeline, geen tweede export.

| | Facebook (Reels/feed) | Huddle |
|---|---|---|
| Bestandsnaam | `2026-08-17-campingdarts-facebook-9-16.mp4` | `2026-08-17-campingdarts-huddle-9-16.mp4` |
| Resolutie | 1080x1920 | 1080x1920 |
| Framerate | 30 | 30 |
| Container | MP4 | MP4 |
| Codec | H.264, profiel High | H.264, profiel High |
| Bitrate | Restrict to **10.000 kb/s** | Restrict to **10.000 kb/s** |
| Audio | AAC, 48 kHz, stereo, 256 kb/s | AAC, 48 kHz, stereo, 256 kb/s |
| Duur | 38,90 sec | 38,90 sec |
| Verwachte bestandsgrootte | circa 50 MB | circa 50 MB |

**Deliver-instellingen die je makkelijk vergeet:**

- **Data Burn-In uit** (Deliver → Advanced Settings, of het aparte Data Burn-In-paneel). Staat die aan, dan brandt de timecode in je definitieve bestand.
- Hulplaag veilige zone onzichtbaar gezet.
- Frame reordering aan, key frames op automatisch.
- H.264 in MP4 werkt in beide Resolve-versies. Ga niet naar H.265: dat levert bij deze bitrates geen zichtbare winst en geeft alleen extra kans op afspeelproblemen bij het uploaden.

**Bitrate-keuze, eerlijk over de herkomst:** 10 Mbps voor 1080x1920 bij 30 fps is een ruime, veilige waarde voor een H.264-upload. Beide platforms hercomprimeren je bestand vrijwel zeker zelf; ruim aanleveren beperkt het kwaliteitsverlies van die tweede compressie. Dit blijft technisch oordeel, **geen uit een platformdocument overgenomen specificatie** — Martonny heeft de containers, de bestandsgrootte en de resolutiegrens geverifieerd, maar over bitrate zegt de documentatie niets.

**Waarom Huddle nu óók op 10 Mbps staat.** Hier stond eerder 8 Mbps met als enige reden dat de maximale bestandsgrootte op Huddle onbekend was. Die reden is weg: het plafond is 2 GB (Lite/Premium) of 5 GB (Ultimate) en onze export komt op circa 50 MB — een factor veertig onder de laagste grens. De voorzichtigheidskorting kostte alleen maar kwaliteit en leverde niets op. Beide exports zijn nu identiek ingesteld; het blijven twee aparte renders, want de encode-instellingen kunnen later per platform uiteenlopen zodra we weten hoe Huddle hercomprimeert.

**Voorbeeldframe voor de omslag.** Beide platforms kiezen zelf een openingsbeeld als je er geen aanwijst, en dat is meestal een bewogen of donker frame. Exporteer daarom een stilstaand beeld van de reveal rond 0:01,3 (Deliver → Single frame, PNG) en gebruik dat als omslag: `2026-08-17-campingdarts-omslag.png`. Moet dat beeld nog vormgeving krijgen — een logo, een titelbalk — dan is dat werk voor Pixel, niet voor mij.

---

## 10 · Wat ik in het conceptscript heb veranderd

| # | Verandering | Waarom |
|---|---|---|
| 1 | Hook krijgt campingcontext in kader plus een reveal-beeld erachter | Een pijl in een bord is overal; de ongerijmdheid stopt de scroll |
| 5 | Wordt een schermopname in plaats van een gefilmde telefoon | Eén telefoon kan niet camera én prop zijn (§2) |
| 7 | Piep wordt een Fusion-notificatiebanner met geluid eronder | Zelfde reden |
| 9 | Tweede helft toegevoegd: terugweg met de doos, naar de camera toe | Anders mist de kijker de aankomst van het pakket en begint S10 uit de lucht |
| 10 | Eén lock-off master in 4K, close-ups achteraf ingekaderd | De shot is onherhaalbaar; losse close-ups filmen kan dus niet |
| 11 | Drie losse opnames in plaats van de timelapse-modus van de telefoon | Timelapse-modus bepaalt zelf de versnelling; drie brokken geven ritme en je leert het retimen |
| 6–9 | Middenstuk van 12,0 naar 10,2 sec, met een speed ramp erin | 27% van de looptijd aan lopen en wachten, precies waar mensen afhaken |
| 4, 5, 13 | Iets langer gemaakt | De wolkjes stonden korter in beeld dan leesbaar (§7) |
| 7 | Van 1,90 naar 3,00 sec; banner blijft staan en overlapt het reactiewolkje | 27 tekens banner vragen 2,60 sec leestijd, en de banner draagt de grap (§5, S7) |
| 8 | Van 3,00 naar 2,10 sec | *"Hiervoor dus."* telt 13 tekens in plaats van 28 |
| Totaal | 43,6 → 38,9 sec | Compacter, en de piek ligt nog steeds op 74–87% van de looptijd |

---

## 11 · Aannames en open punten

**Beslist op 2026-08-17 — hier hoeft niets meer aan:**

- **Wolkje S8** is *"Hiervoor dus."* (13 tekens). Shot 8 daalt daarmee van 3,00 naar 2,10 sec.
- **Notificatiebanner S7** is *"Bezorgd — 3 minuten geleden"* (27 tekens). Shot 7 stijgt van 2,20 naar 3,00 sec en de banner blijft in beeld staan terwijl het reactiewolkje eroverheen komt. Volledige afweging op de veldkaart bij S7, de regeluitzondering in §7. **Er is geen kortere bannertekst nodig; ik heb geen tekstvariant aan Sander voor te leggen.**
- **Huddle-aanpak:** Sander stelt bewust géén supportvraag aan Huddle. Hij uploadt de klare video als test en kijkt hoe die valt. Dat is een besluit, geen omissie.

**Expliciete aannames — geen feiten:**

- De veilige tekstzone in §7 (8–88% breed, 14–68% hoog) is een conservatieve eigen marge. Ik heb de exacte veilige zone van Facebook Reels niet uit een verifieerbare bron in deze opdracht kunnen halen.
- De bitrates in §9 zijn technisch oordeel, niet overgenomen uit platformdocumentatie. Martonny's geverifieerde specs dekken containers, bestandsgrootte en resolutie — niet bitrate.
- Dat de kijker de notificatiebanner van S7 binnen zijn 1,47 sec onverdeelde aandacht leest, is regieoordeel. De banner haalt de leesregel op tijd-in-beeld (2,87 sec), niet op onverdeelde aandacht.
- De opname-instellingen gaan uit van "de hoogste beschikbare verticale resolutie en framerate op jouw toestel". Welk toestel dat is en of het 4K bij 60 beelden per seconde verticaal kan, staat niet in de briefing.
- Dat Fusion-macro's opslaan als template ook in de gratis versie werkt, is mijn beste kennis en in één minuut zelf te controleren.
- Dat er een tweede telefoon beschikbaar zou zijn, neem ik níet aan — zie §2, route C.

**Huddle: bewust openstaand, niet vergeten.**

Martonny heeft geverifieerd wat de documentatie geeft (containers, bestandsgrootte, resolutieplafond — zie §9). De rest staat níet in de documentatie, en Sander heeft besloten daar geen supportvraag voor te stellen: de testupload van de klare video is het antwoord. Deze vier punten blijven dus open **als bewuste keuze**, en de veilige lijn blijft ondertussen gelden — ingebrande tekst, verticaal 9:16, alles binnen de marge van §7.

| Onbekend | Wat de testupload moet uitwijzen |
|---|---|
| Aspectratio-gedrag | Wordt 9:16 volledig weergegeven, of croppt Huddle naar liggend/vierkant? Kijk of de bovenste en onderste wolkjes heel in beeld staan. |
| Autoplay | Start de video vanzelf in de tijdlijn? Zo niet, dan doet de hook zijn werk niet en wordt het omslagbeeld (§9) het belangrijkste frame van de film. |
| Geluid | Staat geluid standaard aan of uit? De film werkt volledig zonder geluid, dus dit is geen blokkade — het bepaalt alleen of de vier accentgeluiden uit §8.6 überhaupt gehoord worden. |
| Ondertitelopties bij community-posts | Niet gedocumenteerd. Niet blokkerend: er is geen spraak, dus er is geen ondertitelbestand (§7). |

Twee dingen om tijdens diezelfde test meteen mee te nemen:

- **Kijk of de tekst kraakhelder blijft.** Dat beantwoordt de 1080p-vraag uit §9: als Huddle de verticale 1080x1920 terugschaalt naar 1080 hoog, zie je het als eerste aan de randen van de wolkjes.
- **Als de speler hakkelt**, kan de plaatsing van de metadata in het MP4-bestand de oorzaak zijn. Of Resolve daar een instelling voor heeft, weet ik niet; een gratis hersluiting met ffmpeg lost het in dat geval op. Pas onderzoeken als het probleem zich voordoet.

**Overige open punten:**

- **Optioneel extra wolkje op S10** bij het opensnijden. Ik heb het weggelaten omdat het beeld zich daar zelf uitlegt en tekst met de aankomende payoff zou concurreren. Wil je het er toch bij, dan is dat een contentkeuze en moet S10 mee groeien met de leestijd.
- **Getal in het filmscript loopt achter.** De inleiding daar noemt "samen 44,5 sec" voor de ruwe shotlijst, maar sinds shot 8 van 3 naar 2,1 sec ging tellen de dertien shots op tot 43,6 sec. Kleine correctie voor de eigenaar van dat document; mijn tijdlijn in §6 rekent met 43,6.

---

Zie ook: [[2026-08-17-campingdarts-filmscript]] (bronscript, wolkjesteksten, opnametips), [[2026-08-17-video-regisseur-hire-research]] (standaarden en anti-patronen), [[GL-001-file-naming-conventions]] (bestandsnamen van de exports).

# Change log

## 2026-04-22 — Versie 3
- Verplichte groepsfasecontrole expliciet toegevoegd.
- Vastgelegd dat een overzicht van 100+ finishes per Pub Qualifier pas compleet is als zowel **groepsfase** als **knock-outfase** volledig zijn gecontroleerd.
- Extra verbod toegevoegd op het presenteren van een compleet toernooitotaal wanneer alleen knock-outwedstrijden zijn nagekeken.
- Verplichte formulering toegevoegd voor situaties waarin de groepsfase nog niet volledig is gecontroleerd.
- Controlelijst uitgebreid met expliciete checks voor **alle groepswedstrijden**.

## 2026-04-22 — Versie 2
- Changelog-sectie toegevoegd bovenin het kennisbestand.
- Extra foutpreventie toegevoegd na een concrete foutanalyse in het toernooi **Winmau Benelux Trophy 2026 - East Netherlands - Doetinchem**.
- Expliciet vastgelegd dat **hoge scores binnen een leg nooit als finish mogen worden gelezen** zonder dat de legwinnende reeks exact tot **501** is gereconstrueerd.
- Verduidelijkt dat een waarde als **121, 123, 125, 140** in de scorereeks standaard als **gewone score** moet worden behandeld, tenzij die waarde aantoonbaar de **laatste score van de legwinnaar** is.
- Extra verplichte controle toegevoegd: eerst vaststellen **wie de leg won**, daarna pas de winnende spelersreeks reconstrueren.
- Extra verbod toegevoegd op het afleiden van finishes uit **player stats**, **matchheaders**, **opvallende losse scores**, of **een onvolledig gelezen spelersregel**.
- Nieuwe eindcontrole toegevoegd: elke gemelde 100+ finish moet als losse regel herleidbaar zijn naar **speler, tegenstander, ronde, legnummer, volledige winnende reeks, checkout**.

---

# Instructie voor CustomGPT — volledig en betrouwbaar aantal 100+ finishes per Pub Qualifier

## Doel

Deze instructie zorgt ervoor dat de CustomGPT bij een vraag over **100+ finishes in één specifiek toernooi / Pub Qualifier** alleen werkt met **toernooi- en matchdetails** en niet opnieuw finishes mist of gewone 100+ scores verwart met checkouts.

De hoofdregel blijft:

- **Seizoenspagina = dashboard**
- **Statistics = seizoentotalen**
- **Toernooipagina = eventcontext**
- **Matchdetails = waarheid**

Voor **100+ finishes per Pub Qualifier** geldt dus altijd:

> Gebruik alleen de toernooipagina en de matchdetails.  
> Gebruik nooit automatisch seizoensstatistieken of alleen wedstrijdheaders als bron voor 100+ finishes.

---

## Kritieke foutpreventie

De belangrijkste fout die absoluut niet meer mag voorkomen is deze:

> Een **opvallende 100+ score** binnen een leg lezen alsof dit automatisch de **checkout** is.

Dat is onjuist.

Een score als **101, 106, 121, 123, 125, 140, 141** is **niet automatisch een finish**. Zo’n score telt alleen als 100+ finish wanneer aan **alle** onderstaande voorwaarden is voldaan:

1. de juiste **legwinnaar** is vastgesteld
2. alleen de **winnende spelersreeks** is gebruikt
3. die winnende reeks telt **exact op tot 501**
4. de betreffende 100+-score is de **laatste score van die winnende reeks**
5. die laatste score is **101 of hoger**

Als één van deze vijf punten niet hard bevestigd is, dan mag de score **niet als finish** worden gerapporteerd.

### Harde interpretatieregel

Gebruik deze standaardaanname:

> Elke 100+-score in een leg is **eerst een gewone score**, totdat bewezen is dat het de **laatste score van de legwinnaar** is en de volledige reeks exact **501** maakt.

Dus:
- **niet**: “ik zie 125, dus waarschijnlijk 125 finish”
- **wel**: “ik zie 125; ik controleer eerst of dit de laatste score van de legwinnaar is en of de reeks exact op 501 eindigt”

---

## Nieuwe harde regel: groepsfase is verplicht onderdeel van de controle

Een volledig toernooioverzicht van **100+ finishes per Pub Qualifier** is pas toegestaan nadat zowel de **groepsfase** als de **knock-outfase** volledig zijn gecontroleerd.

Dat betekent:
- groepswedstrijden horen **altijd** bij het toernooitotaal
- knock-outwedstrijden horen **altijd** bij het toernooitotaal
- een overzicht is **niet compleet** als alleen de knock-outfase is nagekeken
- een overzicht is **niet compleet** als alleen opvallende groepsscores zijn bekeken zonder reconstructie per leg

### Extra verbod

> Nooit een compleet toernooitotaal aan 100+ finishes presenteren wanneer alleen de knock-outfase is gecontroleerd.

### Verplichte formulering bij onvolledige controle

Gebruik bij incomplete analyse altijd expliciet:

- **“De groepsfase is nog niet volledig gecontroleerd, dus dit is nog geen compleet toernooitotaal.”**
- **“Ik rapporteer hieronder alleen de met zekerheid bevestigde 100+ finishes.”**

---

## Wat telt wel als 100+ finish

Een **100+ finish** is alleen een **checkout van 101 of hoger** waarmee een speler een leg wint.

Voorbeelden die **wel** tellen:

- 101 checkout
- 106 checkout
- 121 checkout
- 141 checkout
- 170 checkout

Voorbeelden die **niet** tellen:

- een gewone score van 100, 121 of 140 midden in de leg
- de wedstrijdstatistiek **100+** in de matchheader
- seizoenscijfers op de statistics-pagina
- aannames op basis van hoog gemiddelde of veel 140+ scores

Gebruik dus deze regel:

> Een 100+ finish mag alleen worden genoteerd als uit de **legdetails** blijkt dat de worpen van de winnaar exact op **501 uitkomen**, waarbij de **laatste worp / laatste score** de checkout van **101 of hoger** is.

---

## Verplichte route

Volg altijd deze route:

**Seizoen**  
→ **Results** of **Calendar**  
→ **specifiek toernooi openen**  
→ **Groups**  
→ **elke groepswedstrijd openen**  
→ **per match alle legs controleren**  
→ **daarna pas Bracket / knock-out controleren**  
→ **pas daarna totaal aantal 100+ finishes rapporteren**

Nooit afsnijden via:

- standings
- statistics
- alleen player stats
- alleen wedstrijdsamenvatting zonder legdetails
- alleen knock-outwedstrijden

---

## Informatieniveaus

Bepaal eerst het niveau:

### Seizoensniveau
Gebruik voor:

- ranking
- punten
- positie
- seizoensgemiddelden
- seizoentotalen 100+, 140+, 180

Niet gebruiken voor:

- 100+ finishes per Pub Qualifier

### Toernooilevel
Gebruik voor:

- deelnemers
- groepen
- bracket
- uitslagen
- globale eventcontext

Niet voldoende voor:

- volledig betrouwbare 100+ finishes, tenzij je per match kunt doorklikken naar legdetails

### Matchniveau
Gebruik voor:

- werkelijke bevestiging van 100+ finishes
- reconstructie van checkout per leg

**Matchdetails zijn de waarheid.**

---

## Stap-voor-stap werkwijze voor volledig toernooitotaal

### Stap 1 — Bepaal het juiste toernooi
Open het specifieke Pub Qualifier-event.

Controleer:

- eventnaam
- datum
- locatie
- of het event al volledig gespeeld is

### Stap 2 — Verzamel alle gespeelde wedstrijden
Gebruik de toernooipagina om alle gespeelde wedstrijden te vinden:

- alle groepswedstrijden in alle groepen
- groepswedstrijden van alle poules / flights / voorrondes
- knock-outwedstrijden
- kwartfinales
- halve finales
- finale
- eventuele voorrondes / last 16 / placement matches als zichtbaar

Maak een complete lijst van **alle gespeelde matches**.

### Stap 3 — Open elke match afzonderlijk
Ga per wedstrijd naar de **matchdetails**.

Gebruik nooit alleen de kopregel met statistieken als eindbron.

### Stap 4 — Werk per leg, niet per wedstrijdtotaal
Binnen elke match:

1. bekijk **elke leg apart**
2. lees de scorereeks van **beide spelers**
3. bepaal **wie de leg wint**
4. neem **alleen de scorereeks van de winnaar**
5. tel die reeks exact op
6. controleer of die reeks exact **501** vormt
7. noteer alleen de **laatste score** van de winnaar als checkout
8. als die checkout **101 of hoger** is: noteer een 100+ finish

### Stap 5 — Reconstructieregel
Gebruik deze reconstructieregel:

> De checkout is pas bevestigd als de zichtbare worpen van de legwinnaar samen exact 501 vormen.

Voorbeeld:

- 60 + 85 + 85 + 65 + 100 + 106 = 501  
  → dit is een **106 finish**

- 100 + 60 + 100 + 100 + 141 = 501  
  → dit is een **141 finish**

Als de reeks niet exact reconstrueerbaar is, dan mag de finish **niet als zeker bevestigd** worden gerapporteerd.

### Stap 6 — Negatieve controle: wanneer iets géén finish is
Gebruik ook altijd een negatieve controle.

Als een speler bijvoorbeeld gooit:

- 100 + 45 + 100 + 125 + 23 + 38 + 16 + 54 = 501

Dan is **54** de checkout en **125** slechts een gewone score.

Als een speler gooit:

- 41 + 95 + 41 + 26 + 121 + 101 + 76 = 501

Dan is **76** de checkout. Zowel **121** als **101** zijn dan **geen finishes**.

Deze negatieve controle is verplicht om te voorkomen dat opvallende 100+-scores foutief als checkout worden gelabeld.

### Stap 7 — Controleer altijd beide spelersregels
De GPT moet in **iedere leg** expliciet beide spelersregels lezen.

Waarom:
- om geen finish van de andere speler te missen
- om niet per ongeluk de verliezende spelersreeks als bron te nemen
- om zeker te weten welke speler de leg won

Verplichte controle per leg:

- Welke speler won de leg?
- Welke scorereeks hoort bij de winnaar?
- Is de laatste score van die winnaar 101+?
- Telt die volledige reeks exact op tot 501?

Pas daarna mag een finish worden genoteerd.

### Stap 8 — Registreer direct per speler
Houd tijdens het controleren een log bij:

- speler
- tegenstander
- ronde
- legnummer
- checkout
- volledige winnende reeks
- bron: matchdetails

Aanbevolen formaat:

```text
Dani Horst — vs Ryan Verhaegh — Halve finale — Leg 1 — 106 — 60, 85, 85, 65, 100, 106
Ryan Verhaegh — vs Dani Horst — Halve finale — Leg 4 — 141 — 100, 60, 100, 100, 141
```

### Stap 9 — Tel pas aan het einde op
Tel na alle wedstrijden:

- totaal aantal 100+ finishes in het toernooi
- aantal per speler
- hoogste finish
- eventueel per ronde

Doe dit pas **nadat alle groepswedstrijden én alle knock-outwedstrijden** zijn gecontroleerd.

---

## Belangrijkste foutbron die moet worden voorkomen

De grootste fout ontstaat wanneer de GPT alleen naar wedstrijdstatistieken of losse scores kijkt en niet naar de **checkoutlogica per leg**.

### Specifieke fout die eerder optrad
In de wedstrijdanalyse van een toernooi werd een speler onterecht meerdere 100+ finishes toegeschreven, terwijl het in werkelijkheid om **gewone 100+ scores binnen de leg** ging.

Waarom ging dat fout?

- de GPT keek naar opvallende hoge scores in de leg en niet strikt genoeg naar de **laatste score van de legwinnaar**
- de GPT reconstrueerde de volledige winnende reeks niet altijd tot exact **501**
- de GPT behandelde waarden als **121, 123, 125 of 140** te snel als mogelijke finish
- de GPT controleerde niet hard genoeg of die score daadwerkelijk de **slotscore van de winnende reeks** was
- de GPT controleerde soms wel de knock-outfase, maar niet de **volledige groepsfase**, en presenteerde toch een toernooitotaal

Daarom geldt als extra controle:

> Een score van 101+ binnen een leg is **verdacht als gewone score**, niet als finish, totdat het tegendeel exact bewezen is.

---

## Verplichte dubbelcheck per match

Na het analyseren van een wedstrijd moet de GPT deze checklist afwerken:

### Controlelijst
- [ ] Heb ik alle legs van deze match bekeken?
- [ ] Heb ik van elke leg vastgesteld wie won?
- [ ] Heb ik alleen de winnende spelersreeks gebruikt?
- [ ] Heb ik de worpen van de winnaar exact tot 501 opgeteld?
- [ ] Heb ik gecontroleerd of de laatste score 101+ was?
- [ ] Heb ik beide spelersregels gelezen, zodat ik geen finish van de andere speler mis?
- [ ] Heb ik alleen bevestigde checkouts genoteerd?
- [ ] Heb ik geen gewone 100+ score als finish aangemerkt?
- [ ] Heb ik van elke genoteerde finish ook de volledige winnende reeks opgeslagen?

Pas als alle vragen met **ja** beantwoord zijn, telt de match als volledig gecontroleerd.

---

## Verplichte eindcontrole voor het hele toernooi

Voordat de GPT een eindantwoord geeft, moet deze checklist worden afgewerkt:

- [ ] Zijn alle groepswedstrijden gecontroleerd?
- [ ] Zijn alle knock-outwedstrijden gecontroleerd?
- [ ] Zijn halve finales en finale gecontroleerd?
- [ ] Is van elke genoteerde finish de legreeks reconstrueerbaar?
- [ ] Is van elke genoteerde finish de laatste score van de legwinnaar bevestigd?
- [ ] Zijn er geen dubbeltellingen?
- [ ] Zijn gewone 100+ scores uitgesloten?
- [ ] Is het totaal per speler opgeteld?
- [ ] Is het toernooitotaal berekend?
- [ ] Is de hoogste finish bepaald?
- [ ] Is duidelijk vermeld of het overzicht volledig of mogelijk onvolledig is?

Extra harde eis:

> De GPT mag pas een eindtotaal geven als **elke losse gemelde 100+ finish** herleidbaar is naar: **speler, tegenstander, ronde, legnummer, volledige winnende reeks en checkout**.

---

## Omgaan met onvolledige of slecht zichtbare data

Als matchdetails onvolledig zijn of niet alle legs zichtbaar zijn, gebruik dan deze formuleringen:

- **“Deze informatie is op dit niveau niet volledig zichtbaar.”**
- **“Ik kan dit niet met zekerheid vaststellen op basis van deze pagina alleen.”**
- **“Voor een betrouwbaar aantal 100+ finishes per Pub Qualifier moeten alle matchdetails volledig zichtbaar zijn.”**
- **“Ik rapporteer hieronder alleen de met zekerheid bevestigde 100+ finishes.”**
- **“De groepsfase is nog niet volledig gecontroleerd, dus dit is nog geen compleet toernooitotaal.”**

Nooit:

- invullen op gevoel
- extrapoleren uit gemiddelden
- finish aannemen omdat een speler veel 100+ of 140+ scores had

---

## Wat niet gebruikt mag worden als bewijs voor 100+ finishes

Deze bronnen zijn **niet voldoende** als zelfstandig bewijs:

- statistics-pagina van het seizoen
- standings-pagina
- toernooi-overzicht zonder legdetails
- matchheader met 100+, 140+, 180
- player stats zonder checkoutbevestiging per leg
- een losse opvallende score van 101+ binnen de scorereeks
- een onvolledig gelezen spelersregel
- alleen knock-outresultaten zonder groepsfase

Deze bronnen kunnen alleen ondersteunend zijn, maar niet beslissend.

---

## Aanbevolen interne werkmethode voor de GPT

Gebruik intern altijd twee lijsten:

### Lijst A — alle gecontroleerde wedstrijden
Per match:

- ronde
- speler A
- speler B
- aantal gecontroleerde legs
- status: volledig / onvolledig
- fase: groep / knock-out

### Lijst B — alle bevestigde 100+ finishes
Per finish:

- speler
- checkout
- ronde
- tegenstander
- legnummer
- volledige winnende reeks
- fase: groep / knock-out

De GPT mag pas een eindtotaal geven als lijst A volledig is afgewerkt.

---

## Outputformat voor antwoord aan gebruiker

Gebruik dit format:

## Toernooioverzicht 100+ finishes

- [speler] — [aantal]  
  finishes: [checkout 1], [checkout 2], ...
- [speler] — [aantal]

**Totaal aantal 100+ finishes:** [aantal]  
**Hoogste finish:** [checkout] door [speler]

Zet er altijd onder:

- **“Dit overzicht is gebaseerd op toernooi- en matchdetails.”**
- **“Gewone 100+ scores zijn niet meegeteld als finish.”**
- **“Alleen checkouts van 101 of hoger zijn opgenomen.”**
- **“De groepsfase en knock-outfase zijn beide gecontroleerd.”**

Als de data onvolledig is:

- **“Dit zijn de met zekerheid bevestigde 100+ finishes; het overzicht kan onvolledig zijn als niet alle matchdetails zichtbaar zijn.”**
- **“De groepsfase is nog niet volledig gecontroleerd, dus dit is nog geen compleet toernooitotaal.”**

---

## Samenvattende hoofdregel

> Voor een compleet en betrouwbaar aantal 100+ finishes in een Pub Qualifier moet de GPT **alle gespeelde groepswedstrijden én alle knock-outwedstrijden** openen en per wedstrijd **alle legs** controleren.  
> Alleen een **reconstrueerbare checkout van 101+** uit de matchdetails telt als 100+ finish.

---

## Korte instructieversie voor bovenin een knowledge file

```text
Bij vragen over 100+ finishes in één specifieke Pub Qualifier mag je nooit varen op seizoensstatistieken, matchheaders of gewone 100+ scores. Gebruik alleen het specifieke toernooi en open vervolgens alle gespeelde wedstrijden. Controleer altijd zowel de groepsfase als de knock-outfase. Controleer per match alle legs, bepaal wie de leg won, neem alleen de winnende spelersreeks, tel die exact op tot 501 en noteer alleen de laatste score als finish wanneer die 101 of hoger is. Behandel elke opvallende 100+-score eerst als gewone score totdat bewezen is dat het de slotscore van de legwinnaar is. Controleer altijd beide spelersregels per leg om geen finish te missen en om zeker te weten wie de leg won. Tel pas na controle van alle groepswedstrijden én knock-outwedstrijden het totaal per speler en het toernooitotaal op. Een toernooitotaal mag nooit als compleet worden gepresenteerd als alleen de knock-outfase
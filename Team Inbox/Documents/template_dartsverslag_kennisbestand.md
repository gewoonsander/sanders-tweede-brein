# Kennisbestand — Template voor dartverslagen ADC Pub Qualifiers

## Doel

Dit kennisbestand geeft een vaste structuur voor het maken van betrouwbare en consistente verslaggeving over een gespeeld toernooi binnen een ADC / DartsAtlas-cyclus.

De template is bedoeld als basis voor:
- toernooiverslagen
- social posts
- websiteberichten
- korte samenvattingen
- uitgebreide eventrecaps

Belangrijk:
- **Seizoenspagina = dashboard**
- **Statistics = seizoentotalen**
- **Toernooipagina = eventcontext**
- **Matchdetails = waarheid**

Gebruik dus nooit automatisch seizoensdata als vervanging van cijfers uit één specifiek toernooi.

---

## Hoofdregel voor brongebruik

### Seizoenspagina gebruiken voor:
- naam van de cyclus
- ranking / standings
- huidige top 10
- kalender
- eerstvolgende toernooi
- algemene context van het seizoen

### Toernooipagina gebruiken voor:
- toernooinaam
- datum
- locatie
- aantal deelnemers
- groepsfase / poules
- knock-outschema
- resultaten
- player stats binnen dat specifieke event

### Matchdetails gebruiken voor:
- wedstrijdgemiddelden
- 180’ers per wedstrijd
- bevestigde 100+ finishes
- legdetails
- controle van hoge finishes

---

## Verplichte variabelen voor elk verslag

Gebruik onderstaande variabelen als vaste inputvelden.

### Basisgegevens toernooi
- **[TOERNOOINAAM]**
- **[DATUM]**
- **[LOCATIE]**
- **[CIRCUIT_OF_CYCLUS]**
- **[AANTAL_DEELNEMERS]**

### Toernooiverloop
- **[WINNAAR]**
- **[RUNNER_UP]**
- **[HALVE_FINALIST_1]**
- **[HALVE_FINALIST_2]**
- **[FINALESCORE]**
- **[POULES_AANWEZIG_JA_NEE]**
- **[AANTAL_POULES]**
- **[POULEWINNAARS]**

### Statistieken toernooi
- **[HOOGSTE_WEDSTRIJDGEMIDDELDE]**
- **[NAAM_HOOGSTE_WEDSTRIJDGEMIDDELDE]**
- **[NIVEAU_HOOGSTE_GEMIDDELDE]**
- **[HOOGSTE_FINISH]**
- **[NAAM_HOOGSTE_FINISH]**
- **[TOTAAL_180ERS]**
- **[180ERS_PER_SPELER]**
- **[MEESTE_180ERS_AANTAL]**
- **[NAAM_MEESTE_180ERS]**

### 100+ finishes
- **[TOTAAL_100PLUS_FINISHES]**
- **[100PLUS_FINISHES_PER_SPELER]**
- **[OVERZICHT_100PLUS_FINISHES_VOLLEDIG_JA_NEE]**

### Ranking en vooruitblik
- **[TOP10_RANKING_NA_TOERNOOI]**
- **[EERSTVOLGENDE_TOERNOOI_NAAM]**
- **[EERSTVOLGENDE_TOERNOOI_DATUM]**
- **[EERSTVOLGENDE_TOERNOOI_LOCATIE]**
- **[EERSTVOLGENDE_TOERNOOI_LINK]**

---

## Verplichte bronlogica per onderdeel

### Datum, locatie, deelnemers, cyclus
Haal dit van:
- seizoenspagina
- toernooipagina

### Poulewinnaars
Alleen noemen als:
- er daadwerkelijk een groepsfase / poules zijn
- de poule-indeling en eindstanden zichtbaar zijn

Noem per poule:
- **[POULE_NAAM] — [POULEWINNAAR]**

Als dit niet volledig zichtbaar is:
- **“De poulewinnaars zijn op dit niveau niet volledig zichtbaar.”**

### 180’ers in één specifiek toernooi
Gebruik:
- toernooipagina
- player stats van het event
- matchdetails waar nodig ter controle

Nooit automatisch seizoensstatistics gebruiken als toernooitotaal.

Output altijd als:
- **[SPELER] — [AANTAL]**

En vermeld ook:
- totaal aantal 180’ers
- speler met de meeste 180’ers

### Hoogste gemiddelde
Maak altijd onderscheid tussen:
- **seizoensgemiddelde**
- **toernooigemiddelde**
- **wedstrijdgemiddelde**

Gebruik in een toernooiverslag bij voorkeur:
- hoogste **wedstrijdgemiddelde** als dat direct controleerbaar is
- anders hoogste **toernooigemiddelde**

Noem er altijd bij op welk niveau het gaat:
- **[NIVEAU_HOOGSTE_GEMIDDELDE]**

Voorbeeld:
- “Het hoogste wedstrijdgemiddelde van de avond kwam op naam van [NAAM] met [GEMIDDELDE].”
- “Het hoogste toernooigemiddelde kwam op naam van [NAAM] met [GEMIDDELDE].”

### Hoogste finish
Een finish alleen noemen als die voldoende onderbouwd is via matchdetails.

Nooit een losse hoge score automatisch als finish lezen.

Gebruik:
- **[HOOGSTE_FINISH] door [NAAM_HOOGSTE_FINISH]**

### 100+ finishes
Gebruik alleen:
- toernooipagina
- alle groepswedstrijden
- alle knock-outwedstrijden
- matchdetails per leg

Regel:
Een 100+ finish telt alleen als een checkout van 101 of hoger van de legwinnaar exact reconstrueerbaar is naar 501.

Nooit:
- gewone 100+ score als finish presenteren
- alleen knock-out controleren en dan een compleet toernooitotaal claimen

Verplichte formulering bij twijfel:
- **“Dit zijn de met zekerheid bevestigde 100+ finishes.”**
- **“Het overzicht kan onvolledig zijn als niet alle matchdetails volledig zichtbaar zijn.”**

### Top 10 ranking
Gebruik:
- standings / rankingpagina van het seizoen

Noem altijd:
- positie
- speler
- punten

Output:
1. [SPELER] — [PUNTEN]
2. [SPELER] — [PUNTEN]
3. [SPELER] — [PUNTEN]
...
10. [SPELER] — [PUNTEN]

### Eerstvolgende toernooi
Gebruik:
- calendar

Noem altijd:
- naam
- datum
- locatie
- link

Output:
- **Volgende toernooi: [EERSTVOLGENDE_TOERNOOI_NAAM] — [EERSTVOLGENDE_TOERNOOI_DATUM] — [EERSTVOLGENDE_TOERNOOI_LOCATIE]**
- **Link: [EERSTVOLGENDE_TOERNOOI_LINK]**

---

## Verplichte controlevolgorde

Volg altijd deze volgorde:

**Seizoen**  
→ **Results / Calendar**  
→ **specifiek toernooi openen**  
→ **Groups controleren**  
→ **Bracket controleren**  
→ **matchdetails controleren**  
→ **ranking na toernooi ophalen**  
→ **eerstvolgende toernooi ophalen**  
→ **pas daarna verslag schrijven**

---

## Minimale inhoud van elk volledig verslag

Elk volledig verslag moet minimaal bevatten:

1. datum van het toernooi  
2. locatie van het toernooi  
3. naam van de cyclus / reeks  
4. aantal deelnemers  
5. winnaar en runner-up  
6. halvefinalisten  
7. poulewinnaars, als er poules waren  
8. hoogste gemiddelde + contextniveau  
9. hoogste finish  
10. totaal aantal 180’ers  
11. 180’ers per speler  
12. speler met de meeste 180’ers  
13. 100+ finishes, alleen als voldoende onderbouwd  
14. huidige top 10 van de ranking met punten  
15. eerstvolgende toernooi met link  

---

## Template — volledige verslagtekst

Gebruik dit als basisformat:

```text
[TOERNOOINAAM] werd gespeeld op [DATUM] bij [LOCATIE] en maakte deel uit van [CIRCUIT_OF_CYCLUS]. In totaal kwamen [AANTAL_DEELNEMERS] spelers in actie.

Het toernooi werd gewonnen door [WINNAAR], die in de finale met [FINALESCORE] te sterk was voor [RUNNER_UP]. De halvefinalisten waren daarnaast [HALVE_FINALIST_1] en [HALVE_FINALIST_2].

[ALS_POULES_AANWEZIG]
Er werd ook gespeeld in poules. De poulewinnaars waren:
- [POULE_1] — [POULEWINNAAR_1]
- [POULE_2] — [POULEWINNAAR_2]
- [POULE_3] — [POULEWINNAAR_3]
[/ALS_POULES_AANWEZIG]

Het hoogste [NIVEAU_HOOGSTE_GEMIDDELDE] kwam op naam van [NAAM_HOOGSTE_WEDSTRIJDGEMIDDELDE] met [HOOGSTE_WEDSTRIJDGEMIDDELDE]. De hoogste finish van het toernooi was [HOOGSTE_FINISH], gegooid door [NAAM_HOOGSTE_FINISH].

In totaal werden er [TOTAAL_180ERS] keer 180 gegooid. De 180’ers per speler:
- [SPELER_1] — [AANTAL]
- [SPELER_2] — [AANTAL]
- [SPELER_3] — [AANTAL]

De meeste 180’ers kwamen op naam van [NAAM_MEESTE_180ERS] met [MEESTE_180ERS_AANTAL].

[ALS_100PLUS_FINISHES_BESCHIKBAAR]
De bevestigde 100+ finishes:
- [SPELER] — [CHECKOUTS]
- [SPELER] — [CHECKOUTS]
Totaal aantal 100+ finishes: [TOTAAL_100PLUS_FINISHES].
[/ALS_100PLUS_FINISHES_BESCHIKBAAR]

De huidige top 10 van de ranking na dit toernooi:
1. [SPELER] — [PUNTEN]
2. [SPELER] — [PUNTEN]
3. [SPELER] — [PUNTEN]
4. [SPELER] — [PUNTEN]
5. [SPELER] — [PUNTEN]
6. [SPELER] — [PUNTEN]
7. [SPELER] — [PUNTEN]
8. [SPELER] — [PUNTEN]
9. [SPELER] — [PUNTEN]
10. [SPELER] — [PUNTEN]

Het eerstvolgende toernooi is [EERSTVOLGENDE_TOERNOOI_NAAM], op [EERSTVOLGENDE_TOERNOOI_DATUM] bij [EERSTVOLGENDE_TOERNOOI_LOCATIE].
Link: [EERSTVOLGENDE_TOERNOOI_LINK]
```

---

## Template — compacte social post

```text
[WINNAAR] heeft [TOERNOOINAAM] gewonnen. Het toernooi werd gespeeld op [DATUM] bij [LOCATIE] en maakte deel uit van [CIRCUIT_OF_CYCLUS]. In totaal deden [AANTAL_DEELNEMERS] spelers mee.

In de finale versloeg [WINNAAR] [RUNNER_UP] met [FINALESCORE]. Ook [HALVE_FINALIST_1] en [HALVE_FINALIST_2] haalden de halve finales.

[ALS_POULES_AANWEZIG]
De poulewinnaars waren: [POULEWINNAARS].
[/ALS_POULES_AANWEZIG]

Het hoogste [NIVEAU_HOOGSTE_GEMIDDELDE] kwam op naam van [NAAM_HOOGSTE_WEDSTRIJDGEMIDDELDE] met [HOOGSTE_WEDSTRIJDGEMIDDELDE]. De hoogste finish was [HOOGSTE_FINISH] door [NAAM_HOOGSTE_FINISH].

Er werden in totaal [TOTAAL_180ERS] 180’ers gegooid. De meeste kwamen op naam van [NAAM_MEESTE_180ERS] met [MEESTE_180ERS_AANTAL].

Top 10 ranking na dit toernooi:
[TOP10_RANKING_NA_TOERNOOI]

Volgende toernooi: [EERSTVOLGENDE_TOERNOOI_NAAM] — [EERSTVOLGENDE_TOERNOOI_DATUM]
[EERSTVOLGENDE_TOERNOOI_LINK]
```

---

## Template — variabelenlijst voor snelle invoer

```text
TOERNOOINAAM=
DATUM=
LOCATIE=
CIRCUIT_OF_CYCLUS=
AANTAL_DEELNEMERS=
WINNAAR=
RUNNER_UP=
HALVE_FINALIST_1=
HALVE_FINALIST_2=
FINALESCORE=
POULES_AANWEZIG_JA_NEE=
AANTAL_POULES=
POULEWINNAARS=
HOOGSTE_WEDSTRIJDGEMIDDELDE=
NAAM_HOOGSTE_WEDSTRIJDGEMIDDELDE=
NIVEAU_HOOGSTE_GEMIDDELDE=
HOOGSTE_FINISH=
NAAM_HOOGSTE_FINISH=
TOTAAL_180ERS=
180ERS_PER_SPELER=
MEESTE_180ERS_AANTAL=
NAAM_MEESTE_180ERS=
TOTAAL_100PLUS_FINISHES=
100PLUS_FINISHES_PER_SPELER=
OVERZICHT_100PLUS_FINISHES_VOLLEDIG_JA_NEE=
TOP10_RANKING_NA_TOERNOOI=
EERSTVOLGENDE_TOERNOOI_NAAM=
EERSTVOLGENDE_TOERNOOI_DATUM=
EERSTVOLGENDE_TOERNOOI_LOCATIE=
EERSTVOLGENDE_TOERNOOI_LINK=
```

---

## Verplichte formuleringen bij onzekerheid

Gebruik indien nodig letterlijk deze zinnen:

- **“Dit is zichtbaar als seizoenscijfer, niet als toernooicijfer.”**
- **“Voor een betrouwbaar aantal per Pub Qualifier moet worden doorgelikt naar de matchdetails.”**
- **“Deze informatie is op dit niveau niet volledig zichtbaar.”**
- **“Ik kan dit niet met zekerheid vaststellen op basis van deze pagina alleen.”**
- **“Dit zijn de met zekerheid bevestigde 100+ finishes.”**
- **“De groepsfase en knock-outfase moeten beide gecontroleerd zijn voor een compleet toernooioverzicht.”**

---

## Niet onderhandelbare regels

- Geen seizoensdata presenteren als toernooidata
- Geen aannames doen bij 180’ers of finishes
- Geen finish noemen zonder voldoende onderbouwing
- Geen gemiddelde noemen zonder contextniveau
- Geen compleet toernooitotaal aan 100+ finishes geven zonder groepsfase én knock-outfase
- Bij twijfel: onzekerheid benoemen
- Bij ontbrekende data: expliciet zeggen wat ontbreekt

---

## Samenvattende hoofdregel

> Een goed dartverslag noemt altijd de toernooicontext, de uitslag, de belangrijkste eventstatistieken, de 180’ers per speler, het hoogste gemiddelde met context, de hoogste finish, de ranking na afloop en het eerstvolgende toernooi met link. Alles wat op toernooiniveau wordt gerapporteerd, moet ook echt op toernooi- of matchniveau onderbouwd zijn.


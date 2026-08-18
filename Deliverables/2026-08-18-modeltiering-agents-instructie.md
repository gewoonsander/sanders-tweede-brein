---
key_element: relaties
---

# Modeltiering voor agents — praktische instructie voor een orchestrator

**Voor:** Larry, orchestrator — als basis om hier een eigen SOP van te schrijven
**Onderwerp:** elke agent een passend taalmodel geven in plaats van het zwaarste
**Status:** aanvulling op een bestaande agentstrategie, geen vervanging
**Opgesteld:** 18 augustus 2026

---

## Waarom dit document bestaat

Dit is een aanvulling op een agentstrategie die al staat: rollen zijn belegd, contracten zijn geschreven, agents worden aangeroepen. Wat er in zo'n opzet vaak ontbreekt is de vraag **welk model elke agent draait** — en dat is geen detail, want het is de enige knop die de kosten per aanroep bepaalt zonder dat je aan de rol zelf iets verandert.

Het is geschreven door een team dat deze stap al heeft gezet, zes weken geleden. In deel 5 staat wat er daarna alsnog misging. Dat deel is het meest waardevolle van dit document; de rest is de theorie eromheen.

---

## DEEL 1 — Het probleem: overerving is stil

Vrijwel elke agentruntime kent hetzelfde standaardgedrag: **geeft een agent geen model op, dan erft hij het model van de sessie die hem aanroept.**

Dat klinkt redelijk en is het niet. Draait de orchestrator op een zwaar model — wat logisch is, want die doet het routeerwerk en het overzicht — dan draait *elke* agent die hij aanroept op datzelfde zware model. Ook de agent die een notitie in een vast sjabloon giet. Ook de agent die een lijstje afvinkt.

Drie eigenschappen maken dit vervelender dan een gewone misconfiguratie:

**Het is onzichtbaar.** Een te zwaar model levert geen foutmelding en geen slechtere output. Er is niets aan het resultaat te zien. Je merkt het alleen aan het verbruik, en dan nog alleen als je ernaar zoekt.

**Het schaalt met succes.** Hoe beter de agentopzet werkt, hoe vaker agents worden aangeroepen, hoe groter de rekening. Het probleem groeit precies wanneer je er het minst op let.

**Het herstelt zichzelf niet.** Een verkeerd model blijft verkeerd tot iemand het expliciet aanpast. Er is geen moment waarop het vanzelf opvalt.

---

## DEEL 2 — Het principe: drie tiers, één vraag

Werk met drie niveaus. Meer dan drie levert eindeloos gepieker per agent op zonder dat het iets oplevert; minder dan drie is te grof.

De keuze maak je met één vraag: **wat gebeurt er als deze agent het net verkeerd doet?**

| Tier | Kies dit wanneer | Typisch werk |
|---|---|---|
| **Zwaar** | Een fout is duur of moeilijk te zien — hij vervuilt data, opent een lek, of breekt een koppeling waar anderen op bouwen | Datamodellen en migraties, API- en authenticatiewerk, code waar de rest op voortbouwt, veiligheidsaudits |
| **Midden** | Er is oordeel nodig, maar een fout valt bij de eerste controle op | Onderzoek en verificatie, kwaliteitscontroles, ontwerpwerk, het opstellen van correspondentie |
| **Licht** | Het werk volgt een vast sjabloon of een procedure stap voor stap, en afwijking is meteen zichtbaar | Vastleggen volgens een sjabloon, opmaak met bestaande bouwstenen, procedurele uitvoering, eerste triage van een grote stapel |

**Twijfel je, kies dan één tier lager dan je gevoel zegt.** Te licht getierd merk je binnen een dag aan de output en herstel je met één aanpassing. Te zwaar getierd merk je nooit en betaal je bij elke aanroep.

### De orchestrator zelf

Onderschat niet dat de orchestrator ook een keuze is. Een orchestrator die vooral routeert — bepalen wie wat doet, resultaten samenvoegen — heeft zelden het zwaarste model nodig. Doet hij ook zelf het inhoudelijke denkwerk, dan wel. Maak die keuze expliciet in plaats van hem te laten staan op wat de gebruiker toevallig in de interface heeft aangeklikt.

---

## DEEL 3 — Waar de instelling hoort te staan

Houd twee lagen uit elkaar, ook als jouw opzet nu maar één runtime kent:

| Laag | Wat er staat | Notatie |
|---|---|---|
| **Het contract van de agent** — de rolbeschrijving die niet aan een leverancier gebonden is | De *tier* | Een neutrale aanduiding: zwaar / midden / licht |
| **De runtime-configuratie** — het bestand dat de agent daadwerkelijk start | Het *model* | De concrete modelnaam van die leverancier |

Waarom het scheiden de moeite waard is: modelnamen veranderen elk half jaar, tiers niet. Staat er een concrete modelnaam in het contract, dan moet je bij elke nieuwe modelgeneratie elk contract langs. Staat er een tier, dan pas je één vertaaltabel aan.

Wil je toch één laag houden, prima — maar leg dan vast dát het een bewuste keuze is, zodat de volgende modelwissel niemand verrast.

---

## DEEL 4 — De reviewcadans

Een tiering die je één keer instelt en nooit herziet, verjaart. Twee triggers, niet één:

**Vast moment: elk kwartaal.** Loop de tabel langs en vraag per agent of dit nog de juiste zwaarte is voor wat die rol nu daadwerkelijk doet.

**Direct, bij een van deze gebeurtenissen:**

- Er komt een nieuwe modelgeneratie uit. Wat vorig jaar zwaar was, is nu vaak midden — voor dezelfde prijs of minder.
- Je loopt tegen gebruikslimieten of een onverwachte rekening aan.
- De output van een agent valt kwalitatief tegen (mogelijk te licht getierd).
- Een agent blijkt structureel eenvoudiger werk te doen dan bij het aannemen gedacht (mogelijk te zwaar getierd).

Noteer bij elke wijziging kort waaróm de tier verandert. Dan hoeft de volgende review niet te gokken wat de vorige dacht.

---

## DEEL 5 — De valkuil, en wat er bij ons misging

Dit is het deel waarvoor dit document geschreven is.

Wij hebben de tiering keurig vastgelegd: een aparte richtlijn met de motivering, een tabel met elke agent en zijn tier, een reviewcadans met vaste en gebeurtenisgestuurde triggers. Doorgevoerd bij alle agents die er op dat moment waren. Alles klopte.

**Zes weken later klopte het niet meer.**

Er waren vijf agents bijgekomen. Vier daarvan hadden wel een model gekregen, maar stonden niet in de tabel — die was dus stil verouderd en zou bij de volgende review vier agents overslaan. De vijfde, die dag aangenomen, had helemaal geen model meegekregen. Die erfde dus het zware model van de hoofdsessie: precies het lek dat de hele richtlijn moest dichten, binnen zes weken opnieuw open.

**De oorzaak was niet nalatigheid.** De oorzaak was dat de tiering in een aparte richtlijn stond, en de aanneemprocedure een ander document was. Wie een nieuwe agent aannam, volgde die procedure netjes van begin tot eind — en die procedure zei niets over modellen.

Daaruit volgen twee regels die belangrijker zijn dan de hele tabel:

**1. De tierkeuze is een verplichte stap ín de aanneemprocedure, niet een los document ernaast.** Een richtlijn die je moet onthouden, wordt vergeten. Een stap in een procedure die je toch al afloopt, niet. Zet hem tussen "configuratie schrijven" en "toevoegen aan het register", zodat hij fysiek niet over te slaan is.

**2. Laat een controle falen wanneer een agent geen tier heeft.** Dit is het enige echte vangnet. Een menselijke of AI-controle vergeet dit; een geautomatiseerde controle die de agentmap doorloopt en alarm slaat bij een ontbrekend modelveld, niet. Bouw die controle in dezelfde beweging als de tabel — anders is de tabel binnen een kwartaal weer achterhaald zonder dat iemand het merkt.

Als je van dit document maar twee dingen overneemt, neem dan deze twee.

---

## DEEL 6 — Wat de SOP minimaal moet bevatten

Concrete checklist om tegenaan te schrijven:

1. **Doel en aanleiding** — het overervingsgedrag uit deel 1, in twee zinnen. Wie de SOP over een jaar leest, moet begrijpen waarom hij bestaat.
2. **De drie tiers met hun keuzevraag** — de tabel uit deel 2, aangepast aan de rollen die jullie daadwerkelijk hebben.
3. **De vertaaltabel** tier → concreet model, per leverancier die jullie gebruiken. Dit is het enige stuk dat bij een modelwissel verandert.
4. **Waar het veld staat**, per laag, met een voorbeeld van beide.
5. **De verplichte stap bij het aannemen** — expliciet als genummerde stap in de aanneemprocedure zelf, niet als verwijzing.
6. **De verplichte registratie** — de nieuwe agent en zijn tier landen in dezelfde pass in de centrale tabel. Een tier die alleen in een configuratiebestand leeft, is bij de volgende review onzichtbaar.
7. **De reviewcadans** met beide soorten triggers uit deel 4.
8. **De geautomatiseerde controle** die faalt bij een ontbrekend modelveld.
9. **De huidige tabel** — elke agent, zijn tier, en één regel motivering. Die motivering is wat de volgende review bruikbaar maakt.

---

## DEEL 7 — Wat je beter niet doet

**Per agent een eigen model kiezen zonder tiers.** Dan heb je twintig losse beslissingen die niemand kan overzien en die bij elke modelwissel allemaal opnieuw moeten.

**De tiering baseren op hoe belangrijk een rol voelt.** Belangrijk is niet hetzelfde als moeilijk. Een agent die alle correspondentie doet, voelt belangrijk, maar volgt vaak een vast stramien. De vraag is wat er misgaat bij een kleine fout, niet hoe zichtbaar de rol is.

**Alles op zwaar zetten "om zeker te zijn".** Dat is de uitgangssituatie waar dit document een oplossing voor is.

**Alles op licht zetten om te besparen.** Een agent die datamodellen of koppelingen aanraakt en het net verkeerd doet, kost je een veelvoud aan hersteltijd van wat je aan modelkosten bespaart.

**De tabel bijwerken zonder de motivering.** Over drie maanden weet niemand meer waarom een agent op midden staat, en dan wordt de review giswerk in plaats van beoordeling.

---

## DEEL 8 — Herkomst en status

**Wat vaststaat:** het overervingsgedrag uit deel 1 en het verloop uit deel 5 zijn waargenomen in een draaiende opzet, niet bedacht. De richtlijn werd op 7 juli 2026 ingevoerd; de constatering dat er alsnog een agent zonder tier doorheen was geglipt, is van 18 augustus 2026.

**Wat aanbeveling is:** de indeling in precies drie tiers, de keuzevraag in deel 2, en de checklist in deel 6. Dat is werkbaar gebleken, maar het is geen wet — pas het aan naar de rollen die jullie hebben.

**Wat je zelf moet invullen:** de vertaaltabel van tier naar concreet model. Die hangt af van welke leverancier en welke abonnementsvorm jullie gebruiken, en verandert bij elke nieuwe modelgeneratie. Er staan hier bewust geen modelnamen in — die zouden binnen een half jaar verouderd zijn.

**Aan de orchestrator die dit oppakt:** je mag dit document tegenspreken. Werkt een andere indeling beter voor jullie rollen, doe dat dan en leg vast waarom. Het enige onderdeel dat ik zonder aarzeling zou overnemen, is deel 5 — die valkuil is geen kwestie van smaak.

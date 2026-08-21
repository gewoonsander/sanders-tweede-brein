# Darts uitgooi-route formule — eerste ontwerp (v1)

**Status:** eerste ontwerp, ongekalibreerd. Dit document is **mijn eigen ontwerp/interpretatie** (Hermes), gebouwd bovenop het gesourcete overzicht in [`2026-08-22-darts-uitgooi-routeprincipes.md`](2026-08-22-darts-uitgooi-routeprincipes.md). Niets hierin is een citaat uit een bron — het is een voorstel hoe de 18 gevonden principes zich tot een rekenbare formule laten combineren. Gewichten, normalisaties en de precieze wiskundige vorm zijn nog niet gevalideerd of getest; zie "Open punten" onderaan.

---

## 1. Kernbeslissing: per-pijl, niet per-vooraf-vastgelegde-route

Principe 3.4 (real-time herberekening) impliceert dat een "route" geen vooraf vastgelegd plan van 1-3 pijlen is, maar een reeks losse beslissingen: **na elke daadwerkelijk gegooide pijl wordt opnieuw berekend wat het beste doelvak is voor de volgende pijl**, op basis van de dan geldende restscore en resterende pijlen. Dat is ook robuuster om te implementeren dan het vooraf scoren van complete 3-pijl-combinaties.

De formule hieronder scoort dus: **gegeven de huidige toestand, welk doelvak is het beste voor de eerstvolgende pijl?**

### 1a. Kernprincipe: geen score-maximalisatie

Een expliciete architectuurkeuze die uit het gesprek volgt: `Score(vak)` in §7 optimaliseert **niet** naar de hoogste puntenwaarde van het vak zelf — nergens in de featurelijst (§5) staat "punten van dit vak" als term. Dat is bewust: de hoogste score is niet per definitie de beste keuze, soms is minder scoren beter als dat een beter uitgangspunt overlaat. Vier features encoderen dit principe al, elk op hun eigen manier:

- `f_bogey_afstand` (3.1) — bestraft een hogere score als die op een bogeygetal uitkomt.
- `f_split_optie` (3.3) — beloont een lagere score op de eerste pijl als dat een betere dubbel overlaat.
- `f_marge` (1.3) — beloont het vak met de breedste veilige marge, niet per se het vak met de hoogste score.
- `f_dubbel_pariteit` (2.1) — kan een even dubbel met minder punten laten winnen van een oneven dubbel met meer punten.

Bij het kalibreren van de gewichten in §8 is dit een expliciete check: als de formule ooit toch systematisch de hoogste-score-route boven een van deze vier signalen verkiest, is er iets mis met de gewichtsverhouding, niet met het ontwerp zelf.

---

## 2. Wanneer de formule draait (poort, geen gewicht)

Principe 1.1 (fasebepaling) is een schakelaar, geen gewicht:

```
ALS fase(restscore) == "finishen" (restscore ≤ 170, uitgooibaar)
 OF fase(restscore) == "wegzetten" EN speler kiest tactisch vooruit te denken
DAN: draai de route-formule
ANDERS: gewone scoor-logica (hoogste score), routeformule niet relevant
```

---

## 3. Kandidaat-generatie (harde randvoorwaarde, vóór scoring)

Voordat er iets gewogen wordt, wordt de kandidatenlijst bepaald door de **harde regel 7.1**: een geldige eindroute moet op een dubbel (of bullseye = D25) uitkomen, zonder bust. Voor de eerstvolgende pijl (niet per se de laatste) betekent dit: elk kandidaat-doelvak moet een restscore overlaten die met de resterende pijlen nog steeds tot een geldige dubbel-finish kan leiden. Vakken die dat niet doen (bv. een restscore van 1 overlaten, of een restscore die met de resterende pijlen niet meer uitgooibaar is) vallen af vóór de weging — dit is filtering, geen scoreverlaging.

*(De kandidatenlijst zelf — welke vakken above zijn er op een dartbord — is een los, algoritmisch onderdeel [dartbord-geometrie + standaard checkout-tabellen] en geen onderdeel van déze weegformule.)*

---

## 4. State — wat de formule als input nodig heeft

| Variabele | Betekenis |
|---|---|
| `restscore` | huidige restscore van de gooiende speler |
| `pijlen_over` | 1, 2 of 3 — hoeveel pijlen deze beurt nog te gaan zijn |
| `vorige_pijl_dit_beurt` | welk vak de vorige pijl(en) deze beurt daadwerkelijk raakten (voor switch-berekening; leeg bij de eerste pijl) |
| `speler_sigma` | ingeschatte nauwkeurigheid/spreiding van de speler (proxy: 3-darts-gemiddelde of expliciete instelling) |
| `persoonlijke_voorkeur_map` | per dubbel een trefkans-boost, door gebruiker ingesteld of uit trainingsdata |
| `tegenstander_restscore` | restscore van de tegenstander, om dreiging te bepalen |
| `wedstrijdformat` | bepaalt of principe 6.3 (intimidatie) relevant is (bv. uit bij solotraining) |
| `rekenvaardigheid_niveau` | gebruiker-ingesteld, beïnvloedt hoe zwaar routecomplexiteit meetelt |

---

## 5. Featurelijst per kandidaat-doelvak

Elke feature is genormaliseerd naar een waarde tussen 0 en 1 (1 = meest gunstig). `w_i` is het gebruikers-instelbare gewicht per feature.

| # | Feature | Bron-principe | Berekening (voorstel) |
|---|---|---|---|
| 1 | `f_marge` | 1.3 | fractie van de aangrenzende segmenten (links/rechts/hoog/laag van het doelvak) die bij een misser nog een uitgooibare restscore opleveren |
| 2 | `f_dubbel_pariteit` | 2.1 | 1.0 als de restscore na deze pijl op een even dubbel eindigt (of via halveerketen bereikbaar blijft), aflopend naarmate de keten korter is bij een oneven tussenstap |
| 3 | `f_dubbel_oriëntatie` | 2.2 | 1.0 verticaal, 0.5 horizontaal (laag gewicht standaard, want onbevestigd) |
| 4 | `f_persoonlijke_voorkeur` | 2.3 | rechtstreeks uit `persoonlijke_voorkeur_map`, kan andere features overrulen (zie §6) |
| 5 | `f_trefoppervlak` | 2.4 / 5.3 | oppervlak (cm²) van het kandidaat-vak (of vakcombinatie), genormaliseerd t.o.v. het grootste beschikbare kandidaat-oppervlak |
| 6 | `f_bogey_afstand` | 3.1 | 0 als de resulterende restscore een bekend bogey-getal is (zware penalty via hoog gewicht, geen harde uitsluiting — soms is er geen alternatief) |
| 7 | `f_laatste_cijfer` | 3.2 | 1.0 als resulterende restscore eindigt op 0/1/4/7, anders 0.3 (vuistregel, geen absolute uitsluiting) |
| 8 | `f_split_optie` | 3.3 | alleen actief als de primaire route al op een ongunstig dubbel zou uitkomen; beloont een vak dat een gunstiger dubbel overlaat |
| 9 | `f_switch` | 5.1 | 1.0 als het kandidaat-vak gelijk is aan `vorige_pijl_dit_beurt`, anders 0 (alleen relevant bij pijl 2 en 3) |
| 10 | `f_bull_veiligheid` | 5.2 | alleen relevant als een latere pijl deze beurt de bull is: beloont vakken die bij een gemiste bull nog een finish overlaten |
| 11 | `f_gegarandeerde_vooruitgang` | 6.2 | 1.0 als élke uitkomst (voltreffer/gedeeltelijk/misser) van dit vak nog een dubbel-kans oplevert volgende beurt |
| 12 | `f_intimidatie` | 6.3 | optioneel, alleen actief als `wedstrijdformat` dit relevant maakt; standaardgewicht laag |
| 13 | `f_bust_bestendigheid` | 3.5 (nieuw, uit gesprek 2026-08-22) | 1.0 als geen enkele uitkomst in het doelvak (single/tripel/dubbel) de restscore kan overschrijden, aflopend naarmate de tripel dichter bij/boven de restscore komt |

---

## 6. Contextuele multipliers (geen eigen features, maar modifiers op de gewichten)

Een paar principes zijn geen zelfstandige feature maar een **schaalfactor op andere features' gewicht** — dat voorkomt dat ze als losse optelterm dubbel meetellen:

- **`speler_sigma` (4.1)** schaalt `w_trefoppervlak`, `w_marge` én `w_bust_bestendigheid` naar boven naarmate de speler minder nauwkeurig is (grotere spreiding → oppervlak, foutmarge én bust-risico wegen zwaarder dan de theoretisch "perfecte" route). Een beginner met een reële kans om de tripel te raken in plaats van de bedoelde single heeft veel aan een hoog `w_bust_bestendigheid`; een zeer nauwkeurige speler kan dit gewicht laag zetten en laten domineren door bijvoorbeeld `w_pariteit`.
- **`tegenstander_restscore` → dreigingsniveau (6.1)** schaalt de veiligheidsgerichte gewichten (`w_marge`, `w_bull_veiligheid`, `w_gegarandeerde_vooruitgang`) naar beneden en de agressie-gerichte gewichten (bv. directe scoorkans) naar boven, naarmate de tegenstander dichter bij een finish staat.
- **`f_persoonlijke_voorkeur` (2.3)** kan bij een hoge waarde fungeren als **override**, niet alleen als extra optelterm: een dubbel waar de speler zeer sterk in gelooft kan de uitkomst van `f_dubbel_pariteit`/`f_dubbel_oriëntatie` opzij zetten (dit is expliciet [interpretatie] — het onderzoek geeft aan dát persoonlijke voorkeur relativeert, niet hoe sterk dat effect precies is).
- **`rekenvaardigheid_niveau` (4.2)** is geen feature van het doelvak maar van de speler, en zou in de app-interface een `route_complexiteit`-straf kunnen toevoegen: hoe lager de rekenvaardigheid, hoe zwaarder een eenvoudige/bekende route weegt boven een statistisch iets betere maar complexere route.

---

## 7. Totaalformule (voorstel)

```
Score(vak) = 
    HardeFilter(vak)                                    // §3 — 0 of 1, sluit ongeldige vakken uit
  × [
      w_marge(sigma, dreiging)        × f_marge
    + w_pariteit                       × f_dubbel_pariteit
    + w_oriëntatie                     × f_dubbel_oriëntatie
    + w_voorkeur                       × f_persoonlijke_voorkeur     // kan ook als override werken, zie §6
    + w_oppervlak(sigma)               × f_trefoppervlak
    + w_bogey                          × f_bogey_afstand
    + w_laatste_cijfer                 × f_laatste_cijfer
    + w_split                          × f_split_optie
    + w_switch                         × f_switch
    + w_bull_veiligheid(dreiging)      × f_bull_veiligheid
    + w_vooruitgang(dreiging)          × f_gegarandeerde_vooruitgang
    + w_intimidatie                    × f_intimidatie
    + w_bust_bestendigheid(sigma)      × f_bust_bestendigheid
    ]

Gekozen vak = argmax(Score(vak)) over alle geldige kandidaat-vakken
```

Na de daadwerkelijke worp herhaalt dit hele proces zich voor de volgende pijl (principe 3.4), met een bijgewerkte `restscore`, `pijlen_over` en `vorige_pijl_dit_beurt`.

---

## 8. Voorgestelde standaardgewichten (startpunt, niet gevalideerd)

Als eerste, arbitrair startpunt stel ik voor de confidence-niveaus uit het onderzoek te vertalen naar een basisgewicht (schaal 0-1), zodat feiten met sterke onderbouwing default zwaarder meetellen dan zwak onderbouwde praktijkwijsheid. Dit is **mijn eigen keuze, geen uit de bronnen afgeleide waarde**:

| Feature | Confidence bron | Voorgesteld standaardgewicht |
|---|---|---|
| `f_marge` | Hoog | 1.0 |
| `f_dubbel_pariteit` | Hoog | 1.0 |
| `f_dubbel_oriëntatie` | Laag/Medium | 0.35 |
| `f_persoonlijke_voorkeur` | Hoog | 0.9 (+ mogelijke override) |
| `f_trefoppervlak` | Medium | 0.6 |
| `f_bogey_afstand` | Hoog | 1.0 |
| `f_laatste_cijfer` | Hoog | 0.7 (overlapt deels met bogey_afstand, dus lager dan 1.0 om dubbeltelling te dempen) |
| `f_split_optie` | Medium | 0.5 |
| `f_switch` | Hoog | 0.8 |
| `f_bull_veiligheid` | Hoog | 0.9 |
| `f_gegarandeerde_vooruitgang` | Medium | 0.6 |
| `f_intimidatie` | Laag | 0.2 |
| `f_bust_bestendigheid` | Hoog (mechanisme) | 0.9 bij lage `speler_sigma`-waarde (beginner), aflopend richting 0.3 bij hoge nauwkeurigheid |

Elk gewicht moet in de app door de gebruiker aanpasbaar zijn — dit zijn uitsluitend voorgestelde defaults.

---

## 9. Voorbeeld-doorrekening: 70 over, 2 pijlen

Sanders eigen voorbeeld: restscore 70, `pijlen_over = 2`. Kandidaten (vereenvoudigd, twee opties):

- **Vak A: T20** (restscore bij voltreffer: 10, dus D5 als tweede pijl)
- **Vak B: T18** (restscore bij voltreffer: 16, dus D8 als tweede pijl)

Ruwe, illustratieve inschatting (geen echte trefkans-data, puur om de formule te demonstreren):

| Feature | Vak A (T20→D5) | Vak B (T18→D8) |
|---|---|---|
| `f_marge` | 0.7 (S20-buurvakken laten meestal nog iets uitgooibaars over) | 0.5 |
| `f_dubbel_pariteit` (van de resulterende D5 / D8) | 0.3 (D5 oneven) | 1.0 (D8 even) |
| `f_trefoppervlak` | 0.6 | 0.6 (zelfde tripel-grootte) |
| `f_switch` | n.v.t. (eerste pijl) | n.v.t. |

Met de standaardgewichten uit §8 scoort **Vak B (T18→D8) hoger** dan Vak A, puur door de dubbel-pariteit-term — wat aansluit bij principe 2.1, maar **afwijkt** van Sanders eigen T20-D5-voorbeeld uit het openingsbericht. Dat is geen fout in het voorbeeld, maar een teken dat `w_pariteit` hier wellicht te zwaar staat t.o.v. andere factoren die in dat specifieke voorbeeld meespelen (bv. speler-specifieke voorkeur voor T20, of dat T20 in de praktijk simpelweg vertrouwder is na de scoorfase). Dit is precies het soort spanning die pas met echte kalibratie (zie §10) oplosbaar is — het bevestigt vooral waarom de gewichten instelbaar moeten zijn, niet vast.

---

## 10. Open punten / vervolgstappen

- **Geen kalibratie:** de gewichten in §8 zijn niet getoetst aan echte spelerdata of experts. Voordat dit als "advies" aan gebruikers gepresenteerd wordt, verdient het validatie (bv. tegen bekende professionele checkout-voorkeuren, of tegen Sanders eigen intuïtie zoals in §9 zichtbaar werd).
- **Kandidaat-generatie is nog niet uitgewerkt:** welke dartbord-vakken en welke standaard checkout-tabellen precies de kandidatenlijst vullen, is een apart (algoritmisch, niet weeg-gebaseerd) bouwblok.
- **`f_marge` en `f_gegarandeerde_vooruitgang` vragen een simulatiestap:** deze features vereisen dat de formule voor elk kandidaat-vak de mogelijke misser-scenario's doorrekent — dat is rekenkundig zwaarder dan de andere, direct af te lezen features.
- **Interactie tussen features is nu puur additief**, terwijl principe 2.5 (D16 vs. D20-spanning) juist liet zien dat sommige principes elkaar *in de praktijk* tegenwerken op een niet-lineaire manier. Een lineaire som is een vereenvoudiging die in latere versies mogelijk vervangen moet worden door interactietermen.
- **`f_bull_veiligheid` en `f_bull_trefoppervlak` (5.3) zijn hier samengevoegd onder één feature** ter vereenvoudiging; een latere versie kan ze splitsen als blijkt dat ze in de praktijk verschillend moeten wegen.
- **`f_bust_bestendigheid` (§5, nieuw) is nog niet doorgerekend in het voorbeeld van §9** — dat voorbeeld (70, 2 pijlen, T20 vs T18) verdient een herberekening met deze feature erbij, net als het losse 52- en 56-voorbeeld dat in de sessie zelf al zonder formule is doorgerekend.

---

*Vervolg: zodra hier feedback op is, of zodra er behoefte is aan een werkende prototype-implementatie (bv. in een taal/omgeving naar keuze), kan dit doorontwikkeld worden naar uitvoerbare code.*

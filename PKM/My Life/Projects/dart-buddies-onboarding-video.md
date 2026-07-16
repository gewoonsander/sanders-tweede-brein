---
name: Dart Buddies Onboarding Video
status: active
key_element: passie
linked_topics:
  - dart-buddies
tags:
  - video
  - onboarding
  - huddle
  - dartbuddies
---

# Dart Buddies Onboarding Video — Definitief Draaiboek

## Why this matters

Nieuwe Dart Buddies-leden landen nu zonder begeleiding in de community. Dit project levert een opname-klaar draaiboek op waarmee Sander stap voor stap kan filmen: van aanmelden tot een compleet, zichtbaar profiel — de kern die elk nieuw lid nodig heeft om echt te "landen" in plaats van alleen in te loggen. Dit sluit ook een oude openstaande vraag uit de strategiemeeting van 5 april 2026: *"Huddle-onboarding-flow helder maken: wat zijn de eerste 3 stappen, wat is het aha-moment?"*

## Status update

**2026-07-14 (avond) — Scène-voor-scène doorname afgerond, script definitief bevestigd door Sander.** Alle 16 scènes zijn één voor één doorgenomen en akkoord bevonden, inclusief drie aanvullingen tijdens de doorname: scène 10 (notificaties, nieuw toegevoegd, MVP-grens verschoven), scène 11 (uitgebreide introductievragen), scène 12 (uitgebreide Victory Wall-tekst), scène 13 (Joppe Bakens-verwijzing), scène 14 (concrete Tips & Tools-modules). Klaar om op te nemen — geen openstaande scripttwijfels meer. Enige externe afhankelijkheid: Sander moet de welkomstmail-tekst nog live doorvoeren in Huddle vóór het filmen.

**2026-07-14 (later) — Welkomstmail definitief.** Volledige tekst uitonderhandeld met Sander, inclusief live-editor-check (bevestigde de `:firstname`-merge-tag en de vaste titel-suffix). Sander voert de tekst zelf door in Huddle (Settings > Email > Welkomstmail) — zie "Definitieve welkomstmail-tekst" hieronder.

**2026-07-14 — Draaiboek geverifieerd en definitief.** Basis was een playbook dat Sander met ChatGPT schreef; alle platform-specifieke claims zijn gecheckt tegen Martonny's Huddle-kennisdossier ([[2026-07-14-huddle-specialist-hire-research]]) en tegen Sander's eigen live Huddle-omgeving (meegekeken via browser, 2026-07-14). Alle onderdelen kloppen — zie "Verified platform-feiten" hieronder. Nog niet opgenomen.

## Verified platform-feiten (2026-07-14)

Live gecheckt in `dartbuddies.dartscoaching.nl` en tegen Martonny's dossier — dit is de brontabel voor het script hieronder, dus als iets in Huddle verandert, eerst hier bijwerken voor je herfilmt.

| Wat het script zegt | Werkelijkheid in Huddle | Bron |
|---|---|---|
| Welkomstmail met loginlink, 15 min geldig | Klopt exact — magic link, 15 min, daarna automatisch een nieuwe. **Kan niet opnieuw verstuurd worden** naar een bestaand lid. | Martonny §3 + Sander's live mailtekst |
| Kanaal "#dartsbuddies" | Heet in de UI gewoon **"Dartbuddies"**, zonder hekje. Het "#" was Sander's eigen schrijfconventie in teksten, niet de echte UI. | Live check, Toegangsniveaus → Free buddie → Kanalen |
| Kanaal "#victory-wall" | Heet in de UI **"The victory wall"** | Live check |
| Kanaal "#180-in-je-mindset" | Heet in de UI **"180 in je Mindset"** | Live check |
| "Gratis tools" | Is geen kanaal maar een **product**, genaamd **"Tips & Tools"**, gekoppeld aan hetzelfde toegangsniveau | Live check |
| "Profiel op publiek zetten" | Bevestigd: bij de profielinstellingen kan een lid zelf voornaam, achternaam, koptekst, "over mij" en social-links invullen, plus een **Privacy-instelling Openbaar/Privé**. Alleen bij "Openbaar" ben je vindbaar in zoekopdrachten en voor contact. | Sander (2026-07-14) + Martonny §6 (Koptekst, profielvelden, Ledenoverzicht) |
| Toegangsniveau achter dit alles | Heet **"Free buddie"** (niet "FreeBuddy") en staat aan als **standaard voor nieuwe gebruikers** — dus elke organische aanmelding krijgt dit automatisch. Gekoppeld: 3 kanalen (Dartbuddies, The victory wall, 180 in je Mindset) + 1 product (Tips & Tools). | Live check, Toegangsniveaus-paneel |
| Aanmeldroute | Bevestigd gratis: `dartbuddies.dartscoaching.nl` → "Maak een account aan" → alleen e-mail + robotcheck, geen betaalstap | Live check (browser, niet afgerond) |
| Vastgepind "Start hier"-bericht | Kan (posts zijn pinbaar), maar **alleen admins/moderators** mogen pinnen — dat wordt Sander zelf | Martonny §6 |
| Notificaties instellen | Bevestigd: profielfoto rechtsboven → "Notificaties" → `/settings/notifications`. Bovenaan een hoofdschakelaar "Alle notificaties", daaronder per categorie (Nieuwe gesprekken, Reacties, Evenementen) apart instelbaar op Pushnotificatie / E-mail / beide. | Live check, 2026-07-14 |
| Gated kanaal = zichtbaar met koop-nudge? | **Nee.** Een kanaal gekoppeld aan een toegangsniveau is voor leden zonder die toegang volledig **onzichtbaar** — geen slotje, geen CTA. Relevant voor het overwogen (en afgewezen) idee om "180 in je Mindset" achter het boek te zetten. | Martonny, help-artikel "Een kanaal aanmaken": "Only visible with correct access level" |

## Definitieve welkomstmail-tekst (2026-07-14)

Bevestigd via de live Huddle-editor (Settings > Email > Welkomstmail). Sander voert dit zelf door — niet door Hermes gewijzigd in het systeem zelf.

> **Titel (invoerveld, vaste suffix "DartsCoaching.nl" plakt er automatisch achter):** Welkom nieuwe dartbuddie bij
> **Subtitel:** Supertof dat je erbij bent.
> **Introductie:** Beste :firstname,
>
> Je bent nu officieel een Dartbuddie!
>
> Log in om te reageren op berichten, vragen te stellen en mee te doen in de community. We hopen je daar snel te zien én van je te horen.
>
> Begin met deze 3 simpele stappen:
>
> **1. Vul je profiel in**
> Zet er een profielfoto bij, vertel kort wie je bent en zet je profiel op publiek. Zo kunnen andere darters je herkennen, vinden en makkelijker contact met je maken. Wel zo gezellig!
>
> **2. Stel jezelf even voor**
> Ga naar het kanaal Dartbuddies en vertel kort wie je bent, waar je speelt en wat je wilt leren of bereiken met darten.
>
> **3. Kijk lekker rond**
> Deel je successen op The victory wall, neem een kijkje bij 180 in je Mindset of ga aan de slag met Tips & Tools. Zie je een gesprek dat je aanspreekt? Reageer gerust, of geef antwoord op een vraag van een ander lid — dat is al genoeg om actief mee te doen.
>
> We plaatsen regelmatig nieuwe toffe dingen in het platform: tips, tools, challenges, inspiratie en praktische oefeningen om slimmer te trainen en met meer plezier te spelen.
>
> Wist je trouwens dat we ook een app hebben voor op je telefoon? Handig om snel te reageren, updates te volgen en verbonden te blijven met de community.
>
> Zet ook je notificaties aan — dat werkt zowel in de app als op de website — zodat je niets mist. Je kunt ze altijd naar eigen smaak aanpassen in je instellingen.
>
> We zien je graag binnen!
>
> Dartelijke groet,
> Team Dart Buddies / DartsCoaching.nl
>
> **Knoptekst:** Ik wil naar binnen! *(ongewijzigd)*

**Wijzigingen t.o.v. het origineel:** kanaalnamen zonder "#" (matcht echte UI), "gratis tools" → "Tips & Tools" (exacte productnaam), extra zin over reageren op bestaande gesprekken (stap 3), notificaties-zin losgetrokken van de app-alinea (werkt in beide, niet alleen app), titel aangescherpt naar "Welkom nieuwe dartbuddie bij...", "Sportieve groet" → "Dartelijke groet" (bevestigd door Sander, sluit aan bij de speelse merkstem).

## MVP-scope

**Kern (deel 1):** aanmelden → in het systeem komen → profiel compleet en zichtbaar → notificaties aan. Dit is het opname-doel voor de eerste sessie. *(Notificaties toegevoegd aan de MVP op 2026-07-14 — direct na profiel, vóór de community-scènes, zodat demobob al meldingen krijgt zodra hij zich voorstelt in Deel 2.)*

**Vervolg (deel 2):** community verkennen (kanalen, Victory Wall, Tips & Tools, app) — zelfde sessie als er tijd over is, anders een aparte opname.

## Twee instap-scenario's

Zodra demobob eenmaal Free buddie-toegang heeft, is de vervolgervaring identiek — ongeacht hoe hij binnenkwam. Daarom: **twee korte, losse intro's**, die beide uitkomen bij dezelfde kernvideo. Niet twee keer alles opnemen.

- **Scenario A — Organisch:** demobob komt (fictief, als voorbeeld) via Google/zoekopdracht op **`https://dartbuddies.dartscoaching.nl/`**, klikt "Maak een account aan", krijgt automatisch Free buddie (want dat is de default). Dit scenario wordt daadwerkelijk live gefilmd (zie Opnamevolgorde).
- **Scenario B — Na aankoop:** demobob koopt een product (bijv. een training) bij DartsCoaching en krijgt Free buddie erbij als bonus, via de Plug&Pay-koppeling op dat product. **Open punt:** nog niet bevestigd of dit al live gekoppeld staat op een echt product — zie Open threads. Dit scenario wordt dus (nog) niet live nagespeeld met een echte aankoop; script hieronder is voorbereid voor zodra dat bevestigd is.

---

## Opnamevolgorde

**Beslissing (2026-07-14):** Sander neemt dit in één doorlopende live take op — het demobob-account wordt **niet** vooraf aangemaakt, maar echt tijdens het filmen zelf, zodat de hele reis (aanmelden → mail ontvangen → inloggen → profiel) écht van begin tot eind wordt vastgelegd, geen nabootsing. Dit lost meteen het "mail is niet opnieuw te versturen"-risico op: omdat het account vers is, komt de welkomstmail gegarandeerd live binnen tijdens de opname.

### Voorbereiding (niet gefilmd)

- [ ] Definitieve welkomstmail-tekst staat live in Settings > Email > Welkomstmail (zie hierboven) — **dit moet af zijn vóórdat je gaat opnemen**, anders komt de oude tekst live in beeld tijdens de opname
- [ ] OBS: 3 scènes klaar — camera groot / scherm groot + camera klein / alleen scherm
- [ ] Browser op 110-125% zoom, notificaties uit, geen wachtwoorden of privé-mails in beeld
- [x] Profielfoto voor demobob: `/Volumes/Lexar SSD/Sander Mediahub/01_Dartscoaching/07_Beeldbank/2026-07-14_DC_persona-bob-nobg_v01.png` (de echte Bob-persona-illustratie, achtergrond verwijderd — opgeruimd uit de Team Inbox op 2026-07-14, zie sessielog)
- [ ] Demo-profieltekst klaar om te typen: koptekst "Gezelligheidsdarter met ambities" + "over mij"-tekst (zie hieronder)
- [ ] Logo's beschikbaar indien nodig: `2026-06-12_db_logo-2026-white_v01.png` (Dart Buddies) en `2026-07-14_DC_logo-nobg_v01.png` (DartsCoaching.nl)
- [ ] Test-opname geluid (20 sec), terugluisteren op ruis/echo
- [ ] E-mailadres voor demobob klaar om live te typen (bijv. `demobob@dartscoaching.nl` of vergelijkbaar) — dit hoeft dus niet vooraf aangemaakt, alleen het adres paraat hebben
- [ ] Let op: na "Maak een account aan" kan er een korte laadtijd of echte robot-check zitten — dat knip je er in de montage uit (zie §15 Montageadvies), niet erg als het even duurt tijdens het filmen zelf

### Scène 1 — Opening *(camera groot, vóórdat je iets aanklikt)*

> "Welkom bij Dart Buddies. Superleuk dat je erbij bent. In deze video laat ik je écht van begin tot eind zien hoe je start: ik maak nu live een account aan, laat je de welkomstmail zien zodra die binnenkomt, en loop met je mee tot je profiel compleet en zichtbaar is."

### Scenario-intro A — Organisch, nu écht live aangemaakt (scherm, doorlopend vanaf hier)

Beeld: scherm, browser naar **`https://dartbuddies.dartscoaching.nl/`** (dit is tevens de login-URL — geen apart adres nodig).

> "Stel: demobob zoekt online naar tips om beter te darten, en komt zo uit bij DartsCoaching.nl. Daar ontdekt hij dat DartsCoaching ook een eigen community heeft: Dart Buddies. Hier op deze pagina kun je gratis een account aanmaken. Ik maak 'm nu gewoon live aan als demobob, zodat je precies ziet wat er gebeurt."

Actie (echt uitvoeren, niet naspelen):
1. Ga naar `https://dartbuddies.dartscoaching.nl/` — dit toont direct het inlogscherm met bovenaan drie groene vinkjes ("Alleen voor darters", "Tips & Tools", "Free")
2. Klik onderaan op **"Nog geen account? Maak een account aan"**
3. Typ het demobob-e-mailadres in het veld "E-mail"
4. Bevestig "Bevestig dat je geen robot bent"
5. Klik de knop **"Maak een account aan"** — laat expliciet zien dat er geen betaalstap volgt

> "Zo simpel is het — geen betaling, geen gedoe. Nu even naar mijn mailbox, want daar moet zo de welkomstmail binnenkomen."

Actie: switch naar mailbox-tab, wacht (evt. in montage inkorten) tot de mail binnenkomt live in beeld. Onderwerp: "Welkom nieuwe dartbuddie bij DartsCoaching.nl".

> "Daar is 'ie al. Laten we 'm samen openen."

*(Gaat direct door naar Scène 2 hieronder — dit is nu geen los intro-clipje meer maar het echte begin van de kernvideo.)*

### Scenario-intro B — Na aankoop (30-45 sec, los clipje — apart van de live opname, want vereist een echte aankoop)

Beeld: camera groot of scherm met een productpagina.

> "Heb je net een training of product bij ons gekocht? Dan krijg je er automatisch gratis Dart Buddies-toegang bij — onze community, mét tools en tips. Ik laat je zien wat je daarmee kunt."

Actie: (optioneel, alleen zodra bevestigd dat de Plug&Pay-koppeling live staat) laat kort zien dat de aankoopbevestiging/welkomstmail volgt — **niet opnemen voordat dit bevestigd is, zie Open threads.**

### Deel 1 — Kernvideo (vervolg): mail openen tot compleet profiel

**Scène 2 — Welkomstmail openen** *(scherm: mailbox, mail is al live binnengekomen in Scenario-intro A)*

> "Daar is 'ie. Zie je 'm niet meteen? Check dan je spamfolder — soms gooit je mailbox een prima pijl in het verkeerde vakje."
>
> *(Productienotitie, niet uitspreken in de video: deze mail kan niet opnieuw verstuurd worden aan een bestaand lid — handig om te weten als iemand later zegt de mail nooit ontvangen te hebben.)*

Actie: mail openen, kort door de 3 stappen scrollen in beeld (zonder ze nu al uit te voeren — dat komt in de volgende scènes).

**Scène 3 — Inloggen** *(scherm)*

> "Klik op de knop 'Ik wil naar binnen!' in de mail. Deze link is 15 minuten geldig — te laat? Dan vraag je gewoon een nieuwe aan via 'wachtwoord vergeten' op het inlogscherm. Je komt automatisch ingelogd op het platform terecht."

Actie: klik de knop in de mail, wacht tot je automatisch bent ingelogd op `https://dartbuddies.dartscoaching.nl/`.

**Scène 4 — Eerste blik op het platform** *(scherm: dashboard/homepage)*

> "Dit is Dart Buddies. Je hoeft niet meteen alles te bekijken — de belangrijkste eerste stap is jezelf zichtbaar maken. Dat doen we via je profiel."

**Scène 5 — Profiel openen** *(scherm)*

> "Klik rechtsboven op je profielfoto — daar opent een menu. Klik op 'Profiel'. Dit brengt je naar je profielpagina, waar je alles kunt invullen."

Actie: klik het profiel-icoon rechtsboven (naast het tandwiel-instellingenicoon) → klik "Profiel" in het dropdown-menu → landt op de profielbewerkingspagina.

**Scène 6 — Profielfoto** *(scherm)*

> "Bovenaan zie je je profielfoto. Klik op het potloodje erop en upload een duidelijke foto — geen fotoshoot nodig, gewoon herkenbaar."

Actie: upload `2026-07-14_DC_persona-bob-nobg_v01.png` (Mediahub: `01_Dartscoaching/07_Beeldbank/`) — de Bob-persona-illustratie, achtergrond al verwijderd.

**Scène 7 — Naam, koptekst en "over mij"** *(scherm)*

> "Daaronder vul je in: je voor- en achternaam — die staan als twee losse velden. Dan je koptekst, kort en krachtig. En bij 'Over mij' een paar zinnen: wie je bent, waar je speelt, wat je wilt leren. Onderaan kun je ook nog je socials koppelen, dat is optioneel."

Actie, in exacte veldvolgorde zoals op de pagina, met deze demo-tekst klaar om te typen:

| Veld | In te typen tekst |
|---|---|
| Voornaam | Bob |
| Achternaam | (demo) — of leeg laten, jouw keuze |
| Koptekst | Gezelligheidsdarter met ambities |
| Over mij | Hoi, ik ben Bob! Speel sinds een paar maanden met mijn team in de lokale competitie — vooral voor de gezelligheid, maar stiekem wil ik ook wel wat beter worden. Vooral mijn dubbels mogen wat consistenter. Leuk om hier tips te kunnen uitwisselen met andere darters! |
| Socials | optioneel, mag leeg blijven voor de demo |

**Scène 8 — Privacy op Openbaar zetten en opslaan** *(scherm)*

> "Scroll iets verder naar beneden en je ziet 'Privacy' met twee knoppen: Openbaar en Privé. Zet 'm op Openbaar — dat is nodig om vindbaar te zijn in de zoekopdrachten en voor andere leden om contact met je te maken. Klik daarna rechtsboven op 'Opslaan' — zonder opslaan telt het niet."

Actie: scroll naar "Privacy"-sectie onderaan de pagina, klik de knop "Openbaar" (groen gemarkeerd als actief), klik "Opslaan" rechtsboven naast "Annuleren".

**Scène 9 — Profiel compleet** *(camera groot)*

> "Dat is je profiel compleet en zichtbaar. Nog één ding voordat we de community induiken: notificaties instellen, zodat je niks mist."

**Scène 10 — Notificaties instellen** *(scherm)*

> "Klik weer rechtsboven op je profielfoto, en kies dit keer 'Notificaties'. Bovenaan zie je 'Alle notificaties' — de snelste route: zet die op 'Pushnotificatie & e-mail' en je mist niks. Wil je het preciezer instellen? Scroll dan naar beneden — per type melding, zoals nieuwe gesprekken of reacties, kun je apart kiezen: alleen push, alleen e-mail, of allebei. Dit is precies waarom het slim is om dit nu meteen te doen: straks stel je jezelf voor in de community, en zonder notificaties mis je het moment dat iemand daarop reageert."

Actie: klik profielfoto rechtsboven → "Notificaties" in het dropdown-menu → landt op `/settings/notifications` → zet "Alle notificaties" op "Pushnotificatie & e-mail" (of loop kort de losse categorieën door: Nieuwe gesprekken, Reacties, Evenementen).

*→ MVP-eindpunt. Profiel compleet + notificaties aan = helemaal klaar om mee te doen.*

### Deel 2 — Community verkennen (vervolg)

Navigatie voor deze scènes gebeurt via het **linkermenu**, dat twee secties heeft: "Communityplein" (Dartbuddies, The victory wall, Updates, Coach Café) en "Boeken" (180 in je Mindset, Darttactiek van beginner...). "Tips & Tools" staat niet in dit menu maar onder **E-Learning** bovenaan, als cursuskaart.

**Scène 11 — Dartbuddies-kanaal** *(scherm)*

> "Ga in het linkermenu naar 'Communityplein' en klik op 'Dartbuddies'. Stel jezelf hier voor — en maak het gerust wat uitgebreider dan alleen je naam. Denk aan: wie ben je, waar speel je? Op welk niveau zit je ongeveer? Heb je wel eens een 180 gegooid, of misschien zelfs een 9-darter? En waarom ben je eigenlijk lid geworden van Dart Buddies — wat wil je leren of bereiken? Hoe meer je deelt, hoe makkelijker andere darters een klik met je vinden."

Actie: linkermenu → Communityplein → **Dartbuddies**.

**Scène 12 — The victory wall** *(scherm)*

> "Onder Dartbuddies, in datzelfde menu, staat 'The victory wall'. Dit is de plek om elkaar te bemoedigen en successen te delen — en dat is niet om op te scheppen, maar omdat we darten nu eenmaal spelen om successen te ervaren. Niets is hier te gek: heb je nog nooit een 100-finish gegooid, en lukt het je eindelijk? Dan is dat het delen waard. Een mooie training, rustig gebleven onder druk, je eerste 9-darter, of gewoon een avond waarop alles lekker liep — het mag allemaal hier. Vieren is leven, en samen vieren is nog leuker."

Actie: linkermenu → Communityplein → **The victory wall**.

**Scène 13 — 180 in je Mindset** *(scherm)*

> "Scroll iets verder naar beneden naar 'Boeken' — daar vind je '180 in je Mindset'. Dit kanaal sluit aan bij het boek van Joppe Bakens, met dezelfde titel. Daarin gaat het over focus, presteren, trainen als een pro en omgaan met zenuwen — en dat vind je dus ook terug in dit kanaal: het mentale stuk van darten."

Actie: linkermenu → Boeken → **180 in je Mindset**. *(Let op: dit staat dus in een ander menu-blok dan Dartbuddies en Victory wall — niet vergeten in de video te benoemen, anders lijkt het net of het in hetzelfde lijstje staat.)*

**Scène 14 — Tips & Tools** *(scherm)*

> "Klik bovenaan op 'E-Learning'. Hier staan al je cursussen — en één daarvan is 'Tips & Tools', helemaal gratis voor je als Dartbuddie. Daarin vind je bijvoorbeeld de dartstoernooi-reflectietool: heb je een toernooi gegooid, dan kun je daarmee terugkijken wat er gebeurde. Ook zit er het reflectieboek bij '180 in je Mindset' bij — heb je het boek gekocht, dan hoef je niet in het boek zelf te schrijven, maar gebruik je dit ernaast. En er is een module 'De basis op orde', met tips voor een solide techniek. Begin met één onderdeel, gebruik 'm echt, en kijk dan verder."

Actie: bovenmenu → **E-Learning** → cursuskaart **"Tips & Tools"** (heeft een groen vinkje, dus al toegankelijk). Bevat exact 3 modules: Dartstoernooi reflectietool (2 lessen), Reflectiebook 180 in je mindset (2 lessen), De basis op orde: tips voor een solide techniek (9 lessen) — 174 leden hebben deze cursus al gevolgd.

**Scène 15 — App** *(scherm/telefoon)*

> "Dart Buddies werkt ook op je telefoon — handig om snel te reageren of iets terug te lezen."

**Scène 16 — Slotwoord** *(camera groot)*

> "Kort samengevat: vul je profiel in, zet 'm op openbaar, zet je notificaties aan, en stel jezelf voor in Dartbuddies. Daarna kun je rustig verder kijken. Tot snel in de community!"

---

## Publicatie (na opname)

- [ ] Vastgepind "Start hier"-bericht plaatsen in het Dartbuddies-kanaal (alleen Sander/mods kunnen pinnen) met de 3-stappen-samenvatting
- [ ] Video-thuisbasis: Martonny's advies — hoofdvideo pinnen in het welkomkanaal **én** alle video's in een los, gratis "Onboarding"-cursusje onder Producten zetten, zodat leden later per onderwerp kunnen terugzoeken
- [ ] PKM-status bijwerken zodra opgenomen (zie `Deliverables/2026-06-30-video-systeem-design.md` voor het algemene videowerkstroom-sjabloon)
- [ ] **Zodra de mobiele/app-video bestaat (apart vervolgproject):** verwijzing ernaar toevoegen aan het vastgepinde "Start hier"-bericht en/of de videobeschrijving — bewust **niet** ingesproken in scène 15, om niet te verwijzen naar content die nog niet bestaat.

## Open threads

- [ ] Sander voert de definitieve welkomstmail-tekst zelf door in Huddle (Settings > Email > Welkomstmail)
- [ ] Demobob-account nog aanmaken — pas nadat de welkomstmail-tekst live staat
- [ ] Bevestigen of Scenario B (aankoop → gratis Free buddie) al daadwerkelijk als Plug&Pay-koppeling live staat op een trainingsproduct, of dat dit nog opgezet moet worden — checken met Tonnymart
- [ ] Beslissen: alles in één opnamesessie (deel 1 + deel 2), of MVP eerst en deel 2 apart
- [ ] **Nieuw (2026-07-14): mobiele versie.** Sander merkte op dat de Huddle-mobiele-UI wezenlijk anders is dan desktop. Besluit: desktop-versie eerst afronden (dit project, al volledig gescript/geverifieerd), mobiele versie wordt een **apart vervolgproject** — zelfde scriptskelet, maar UI-stappen moeten opnieuw live geverifieerd worden op mobiel, en de opnametechniek verschilt (telefoonscherm vastleggen ≠ OBS-desktopcapture).

## Next steps

- [x] Welkomstmail-tekst definitief nalopen/aanscherpen (Settings > Email > Welkomstmail, preview) — 2026-07-14
- [x] Assets georganiseerd: Bob-persona-foto + coach-foto's opgeruimd uit Team Inbox naar Mediahub (`01_Dartscoaching/07_Beeldbank/`) — 2026-07-14, zie sessielog
- [x] Scène-voor-scène kritische doorname + exacte UI-details geverifieerd (profielpagina, navigatiepaden Deel 2) — 2026-07-14
- [ ] Sander voert de welkomstmail-tekst live door in Huddle
- [ ] Demobob-account aanmaken (live, tijdens opname zelf)
- [ ] Opnamesessie inplannen — deel 1 (MVP) minimaal, deel 2 indien tijd

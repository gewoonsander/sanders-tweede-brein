---
name: RDB Website- en Toegangsoverdracht aan Emiel Theloosen
status: active
key_element: overdracht
linked_people:
  - emiel-theloosen
tags:
  - darts
  - rdb
  - hosting
  - klant
  - overdracht
---

# RDB Website- en Toegangsoverdracht aan Emiel Theloosen

## Why this matters

[[emiel-theloosen]] wordt naar verwachting gekozen als bestuurslid communicatie bij de Rivierenland Darts Bond (RDB), tijdens een bestuurswisseling waar ook prijzen worden uitgereikt (Sanders team [[dt-irritant]] heeft dit seizoen de beker gewonnen en is eerste geworden in de Eredivisie). Sander beheert de RDB-website/hosting via WPMU Dev en moet Emiel alle benodigde informatie en toegang geven, vergelijkbaar met wat er bij [[heleen-van-den-berg]] is gedaan — maar groter en uitgebreider, omdat Emiel als bestuurslid waarschijnlijk meer/bredere toegang nodig heeft dan een reguliere klant.

## Status update

Meest recent bovenaan.

- **2026-07-03** — Twee aanvullingen op het overdrachtsdocument: (1) aanrader om een **staging site** te gebruiken bij het ontwikkelen (kopie op sub-URL, pas live zetten als hij tevreden is, zodat de bestaande site intact blijft); (2) Sander biedt aan om — als Emiel dat wil — een keer **online mee te kijken** met zijn scherm en hem persoonlijk door de Hub te leiden.
- Klantportaal-details van Sander zelf bevestigd:
  - **Exacte klantportaal-URL: `gewoonsander.nl/hub`** — hiermee is de eerdere open vraag over het loginpad opgelost.
  - **Correctie 2026-07-03 (later):** de 2026-factuur is nog niet uitgegaan — Sander moet deze nog aanmaken en klaarzetten in de Hub (dit is dus dezelfde concept-factuur die hierboven al genoemd staat, nog niet definitief).
  - Emiel kan **tickets aanmaken** in het portaal — dat is de manier waarop hij contact met Sander onderhoudt (naast support@gewoonsander.nl).
  - **Domeinregistratie via WPMU Dev staat bewust op inactief**: WPMU Dev heeft zelf ook een domein-reseller-functie, maar domeinen registreren via hen is duurder dan via Sanders eigen GoDaddy-route — vandaar dat dit uitstaat en domeinen buiten de Hub om via Sander blijven lopen.
  - **Plugins**: Emiel kan zelf nieuwe plugins toevoegen (via WordPress.org) én bestaande plugins beheren, inclusief een reeks premium plugins die via het WPMU Dev-abonnement beschikbaar zijn.
  - **Sites-overzicht**: onder "Sites" in de Hub ziet Emiel de RDB-site (rivierenlanddartsbond.nl) staan; daarop doorklikken geeft hem het volledige overzicht (hosting, status, etc.).
- Overdrachtsplan verder uitgewerkt:
  - **Plan voor vanavond:** als Emiel wordt gekozen in het bestuur, draagt Sander direct het webmasteraccount inclusief wachtwoord over — Emiel kan het wachtwoord daarna zelf wijzigen.
  - **Google Workspace wordt beheerd door [[nick-pol]], niet door Sander** — Sander heeft daar zelf geen (beheerders)toegang toe. Als Emiel iets met Google Workspace wil, moet hij daarvoor bij Nick zijn, niet bij Sander. Dit wijzigt de eerdere aanname (zie open thread hieronder over `webmaster@rdbdarts.nl` inloggen) — Sander regelt geen Workspace-zaken zelf.
  - **Domeinen bevestigd (alle drie, via GoDaddy, op Sanders naam):** rdbdarts.nl, rivierenlanddartsbond.nl, én mijnrdb.nl. Reden voor de overstap naar GoDaddy: Versio's prijs sprong in één keer naar **€22** per domein (eerder losser omschreven als "bijna 3x duurder") — bij GoDaddy een stuk goedkoper. Als Emiel iets met DNS wil, moet dat via Sander (zie ook de "Boodschap voor Emiel"-sectie).
  - Hub-inlog-URL's: Sanders eigen beheerderslogin is `https://wpmudev.com/hub2/`. Emiels klantenportaal draait op het domein `gewoonsander.nl` (bevestigd via het klantrecord en de Hub-instellingen) — het exacte loginpad op die site kon niet met zekerheid worden vastgesteld vanuit deze sessie; Sander checkt dit best zelf even voordat hij de link doorstuurt.
- WPMU Dev Hub-klantdashboard voor RDB uitgebreid opgezet:
  - Klantrol opgehoogd van "View All & Access billing" naar **"Edit All & Access billing"**.
  - Product "Website hosting + service" bijgewerkt: nieuw actief plan **€420/jaar (€35/maand)** aangemaakt, oude €30/maand-plan gearchiveerd.
  - Product "Domeinnaam verlenging": prijzen voor **rdbdarts.nl** en **rivierenlanddartsbond.nl** verlaagd van €21,99/jaar naar **€8/jaar** (weerspiegelt de echte, lagere GoDaddy-kosten na de Versio-overstap) — oude €21,99-plannen gearchiveerd, nieuwe €8-plannen aangemaakt.
  - Alle drie (hosting + beide domeinverlengingen, samen €436 excl. btw / **€527,56 incl. 21% btw per jaar**) zijn als **concept-factuur** klaargezet op het RDB-klantrecord — bewust **niet verzonden/geactiveerd**, in afwachting van Sanders controle (zelfde aanpak als bij de Heleen-factuur).
  - Besluit: RDB-facturatie voor hosting + domeinen loopt voortaan via de Hub in plaats van Sanders losse systeem — **let op: zodra dit concept wordt bevestigd, moet Sander stoppen met deze posten los te factureren, anders dubbel**.
  - Sander wil bij het gesprek met Emiel ook benadrukken dat hij altijd kostendekkend heeft gewerkt (zie sectie hieronder).
- Twee concrete actiepunten vastgelegd voor de overdracht: (1) `webmaster@rdbdarts.nl` overdragen aan Emiel — hij neemt het webmasterschap over; (2) een WPMU Dev Hub-klantdashboard voor Emiel opzetten, uitgebreider dan het bestaande sjabloon voor [[heleen-van-den-berg]] (rol "Klant - Mail en Facturering" + Pro Email). Voor Emiel is een bredere "Webmaster"-rol nodig: naast mailinstellingen ook zicht op het dedicated-hostingproduct (€35/maand) en bijbehorende facturen, en waarschijnlijk WordPress-rol Administrator (niet Editor) omdat hij de site zelf herbouwt. Volgorde: eerst zijn Hub-toegang werkend krijgen, dan pas `webmaster@rdbdarts.nl` overdragen — zelfde risico als bij Heleen (Sander verliest SSO-toegang tot een mailbox zodra die aan een ander klant-record hangt).
- Datumvraag opgelost: Sander bevestigt dat de ALV/bestuursvergadering direct aansluitend op de huldiging/prijsuitreiking plaatsvindt — dus **beide vandaag (2026-07-03)**, niet 4 juli zoals een eerdere notitie stelde. Die "4 juli"-datum in [[emiel-theloosen]] en [[rivierenland-darts-bond]] was onjuist en is gecorrigeerd. **Deadline is dus vanavond**, niet morgen.
- **2026-07-02** — Sander wil dit dossier vanavond (2026-07-02) verder oppakken, of anders morgenvroeg (2026-07-03), zodat alles geregeld is vóór de RDB-prijsuitreiking/bestuurspresentatie op de avond van 2026-07-03 (waar Sander als captain van dt-irritant ook naartoe gaat i.v.m. de bekerwinst/kampioenschap).
- Eerdere context (zie [[emiel-theloosen]]): kennismaking 22 juni, hostinggegevens WPMU Dev + Google Workspace zouden 25 juni gestuurd worden, Emiel wil een tweede WordPress-instantie offline bouwen en dan live zetten rond de bestuurswisseling.

## Open threads

- [x] **Klantenportaal-inloggegevens toegevoegd aan het overdrachtsdocument** — gebruikersnaam `webmaster@rdbdarts.nl`, portaal `gewoonsander.nl/hub`. Het echte wachtwoord staat bewust **niet** in het document (alleen gemaskeerd) — Sander stuurt dat via een apart kanaal. Emiel wordt geadviseerd het wachtwoord direct na ontvangst zelf te wijzigen.

- [x] **Persoonlijke welkomstboodschap voor Emiel ingesteld via Branda Pro (Admin Message)**, zichtbaar bovenaan elke WP-adminpagina van de RDB-site: felicitatie/succeswens voor het bouwen van de nieuwe website + verwijzing naar support@gewoonsander.nl.
- [x] **Pluginoverzicht voor maandag opgesteld — licenties per premium plugin, compleet:**
  - WPMU Dev Pro-suite (SmartCrawl Pro, Branda Pro, Smush Pro, Hummingbird Pro, Defender Pro, Forminator Pro): inbegrepen zolang hosting bij WPMU Dev blijft.
  - **WP All Import Pro + WP All Export Pro (en alle bijbehorende addons: ACF-addons x2, Users-addon x2):** lifetime subscription van Sander — lopen dus via hem, geen licentiecode overdraagbaar, wel te gebruiken zolang actief.
  - **Divi Builder:** lifetime subscription van Sander bij **Elegant Themes** (elegantthemes.com, dé website voor premium WordPress-thema's) — RDB mag hierop meeliften.
  - **BuddyBoss Platform-plugin:** lifetime licentie van Sander, geldig voor **maximaal 5 sites**. RDB kan daar prima **2 van gebruiken — één voor de staging site, één voor de live site**.
  - **The Events Calendar (beide varianten) — GEEN licentie meer, GEEN support meer.** Deze plugin is overgenomen door **LiquidWeb**, en Sanders licenties daarop zijn vervallen. **Actiepunt voor Emiel:** hij moet ofwel zelf rechtstreeks bij LiquidWeb een licentie/ondersteuning regelen, ofwel een andere agenda-/kalenderoplossing kiezen voor de website.
  - **Advanced Custom Fields Pro — Sanders persoonlijke licentie, niet overdraagbaar.** Wil Emiel/RDB ACF Pro blijven gebruiken, dan moet hij zelf een eigen licentie aanschaffen. Voorlopig: Emiel moet **op termijn deactiveren** — eerst checken of dat gevolgen heeft voor de website (velden die nog in gebruik zijn); als dat niet zo is, gewoon verwijderen, zodat Sander de licentie elders kan inzetten.
  - **Smart Slider 3 Pro — licentie is betaald en actief op 1 domein (rivierenlanddartsbond.nl). Deze mag RDB gewoon houden** (in tegenstelling tot de andere plugins hierboven, blijft deze licentie bij de bond, niet bij Sander).
  - **Divi Dynamic Helper (momenteel inactief) — beslissing van Emiel nodig.** Abonnement stond op Sanders naam, was betaald t/m 30 oktober 2026 — Sander heeft het abonnement uit voorzorg al opgezegd. De plugin blijft tot 30 oktober werken maar krijgt geen updates meer daarna. **Actiepunt:** Emiel moet aangeven of hij deze plugin wil gebruiken/heractiveren — reactiveren kost **$36**, en Sander maakt daar dan een factuur voor. Wil hij hem niet gebruiken, hoeft er niets te gebeuren (al stopgezet). Kan ook later alsnog, in overleg met Sander.
  - **Divi Machine — £25, licentie inmiddels verlopen.**
  - **Algemene afspraak voor alle plugins:** Sander weet nog niet welke plugins Emiel op termijn wel/niet wil blijven gebruiken. Mocht een plugin ooit een update nodig hebben, dan appt Emiel gewoon met Sander — samen bekijken ze dan of het goedkoper is om de bestaande licentie te reactiveren, of dat RDB beter zelf een eigen licentie aanschaft. Dat lossen ze dan wel op het moment zelf op.
- [x] **Thema (los van bovenstaande plugins — technisch iets anders):** Custom thema gebouwd op basis van het BuddyBoss-thema, actief op **rivierenlanddartsbond.nl** en **rdb.tempurl.host** (de staging-URL) — via Sanders lifetime licentie mag RDB dit gewoon blijven gebruiken. Achtergrond: dit thema was bedoeld voor een ledenomgeving/community-functie voor RDB, maar dat plan wordt momenteel herzien ("gaat een beetje op de schop") — nog onduidelijk of dit thema straks nog inhoudelijk nodig is. **Alternatief:** als Emiel het BuddyBoss-thema niet meer wil gebruiken, kan Sander gratis het **Divi-thema** installeren (ook van Elegant Themes, zelfde lifetime-subscription als Divi Builder). **Update:** Divi-thema is inmiddels al geïnstalleerd door Sander; licentiesleutel staat klaar in het overdrachtsdocument mocht Emiel dit willen gebruiken voor de vernieuwde site.
- [x] **Blocker opgelost: 2FA op `webmaster@rdbdarts.nl` losgekoppeld van Sanders telefoon.** Sander heeft [[nick-pol]] rechtstreeks gevraagd (bericht zelf verstuurd, niet via Hermes) om de tweestapsverificatie te verwijderen — **Nick heeft dit inmiddels gedaan.** Emiel kan bij overdracht dus zelf een nieuwe 2FA instellen op zijn eigen telefoon, zonder Sanders tussenkomst.
- [x] **Felicitatiebericht voor Emiel klaargezet** — als Gmail-concept naar e.theloosen@calvi-insight.com, onderwerp "Gefeliciteerd! RDB webmasterschap". Te versturen zodra Emiel is gekozen. Bevat: aankondiging dat webmasteraccount + uitgebreid overdrachtsdocument maandag volgen, plus de kernpunten (portaal-URL, support, domeinen, mijnrdb.nl-deadline, Google Workspace via Nick, staging-tip, aanbod online meeting).
- [ ] **mijnrdb.nl verloopt op 21 juli 2026** — al betaald door Sander bij GoDaddy. Emiel moet vóór die datum aangeven of RDB dit domein wil behouden; zo ja, verlengt Sander het en komt het op de factuur van volgend jaar.
- [x] **Concept-factuur op het RDB-klantrecord bekeken en bevestigd** (2026-07-06, door Sander zelf in de Hub omgezet naar live-factuur en verzonden) — hosting €420/jaar + 2x domeinverlenging €8/jaar, totaal €527,56 incl. btw. **Betaling loopt via Sjoerd, de nieuwe penningmeester** — per creditcard of bankoverschrijving o.v.v. het factuurnummer. Zodra betaald, zet Sander de factuur handmatig op "betaald" in de Hub.
- [x] **"Geen creditcard"-notitie voor de factuur** (les uit de Heleen-case): tekst opgesteld voor onder de factuurnotitie — "Deze factuur betreft de hosting- en domeinkosten voor het volledige jaar 2026. De vorige factuur (2212) is op 9 december 2025 door RDB voldaan en betrof de hosting van 2025. Heb je geen creditcard beschikbaar? Dan kun je het bedrag ook gewoon overmaken via een bankoverschrijving." — nog door Sander te plakken in de factuur zelf.
- [x] **Sanders eigen facturatiesysteem stopgezet voor hosting + domeinen van RDB** (2026-07-06) — voorkomt dubbele facturatie nu de Hub-factuur loopt.
- [x] **Inloggegevens van de huidige RDB-website (WordPress) toegevoegd aan het overdrachtsdocument** — URL `rivierenlanddartsbond.nl/ikwilerin` (**correctie 2026-07-06:** niet het standaard `/wp-admin/`-pad, dat is bewust afgeschermd), gebruikersnaam `webmaster@rdbdarts.nl`, wachtwoord gemaskeerd (echte wachtwoord via apart kanaal, zelfde aanpak als bij het klantenportaal-wachtwoord).
- [x] **`webmaster@rdbdarts.nl`-inloggegevens overgedragen aan Emiel** (2026-07-06) — wachtwoord via WhatsApp gestuurd (los kanaal), overdrachtsdocument + uitleg via e-mail. Emiel kan nu inloggen op klantenportaal en WordPress.
- [ ] **WPMU Dev Hub-klantrol "Webmaster" voor Emiel — waarschijnlijk voldoende, nog even dubbelchecken.** Sander schat in dat Emiel het prima kan bekijken met de huidige rechten; wil morgen (2026-07-07) nog een extra controle doen om zeker te weten dat de rol breed genoeg is (hosting-product + facturen zichtbaar, WordPress-rol Administrator).
- [x] **Uitzoeken of Sander daadwerkelijk kan inloggen met `webmaster@rdbdarts.nl` op het RDB-domein** — opgehelderd: Google Workspace wordt beheerd door [[nick-pol]], niet door Sander. Emiel moet voor Workspace-zaken dus bij Nick zijn.
- [x] **Hub-klantportaal-loginpad voor Emiel exact vaststellen** — bevestigd: `gewoonsander.nl/hub`.
- [x] Alle toegang en informatie voor Emiel geregeld (2026-07-06): overdrachtsdocument + e-mail + wachtwoorden via WhatsApp verstuurd. Enige nog openstaande sub-punt is de Hub-klantrol "Webmaster" (zie hierboven).
- [x] **Moot geworden:** vraag of "Sander stuurt inloggegevens 25 juni" gebeurd was — inmiddels sowieso gebeurd via de overdracht van 2026-07-06.
- [ ] **Bij het opzetten van RDB-facturatie (WPMU Dev Hub):** lering uit de Heleen-case — RDB had hetzelfde "geen creditcard"-probleem. Zet standaard een notitieveld op de factuur met de strekking "je kunt het bedrag ook gewoon overmaken als er geen creditcard beschikbaar is". Voorkomt een handmatig mailtje per keer en dat deze taak steeds opnieuw vergeten wordt.

## Boodschap voor Emiel — kostendekkend werken & domeinen

Sander wil dit expliciet aan Emiel meegeven tijdens de overdracht:

- Sander heeft altijd geprobeerd **redelijk kostendekkend** te werken voor RDB, niet winst te maken op de hosting/domeinen.
- Domeinnamen zaten oorspronkelijk bij **Versio**, maar de prijs sprong daar in één keer naar **€22 per domein** — daarom op een gegeven moment verhuisd naar **GoDaddy**, waar ze een stuk goedkoper zijn (zie ook [[rivierenland-darts-bond]] voor de huidige domeinen, allen inmiddels bij GoDaddy).
- De domeinen staan **op Sanders eigen naam** (niet op naam van RDB) — de kosten worden gewoon doorberekend aan RDB. Het gaat om **alle drie**: rdbdarts.nl, rivierenlanddartsbond.nl en mijnrdb.nl.
- **Google Workspace wordt beheerd door [[nick-pol]]**, niet door Sander — voor Workspace-zaken (mailaccounts, DNS voor mail, etc.) moet Emiel bij Nick zijn, niet bij Sander.
- **Divi Builder** (de pagebuilder waarmee de site gebouwd is) kost normaal **€89/jaar** aan licentiekosten, maar RDB gebruikt 'm **gratis** via Sanders eigen Divi-licentie (zie ook het bestaande "Gebruik Divi"-product in de Hub, €0,00 — zelfde constructie als bij Heleen).
- **Belangrijk voor Emiel om te weten:** als hij ooit iets aan de DNS-instellingen wil wijzigen, moet hij dat eerst bij Sander melden — dat zit namelijk bij de hosting inbegrepen. Sander wil dit graag als service blijven bieden, maar omdat de domeinen op zijn naam staan moet DNS-beheer via hem lopen.
- **Hoe Emiel Sander kan bereiken voor support:** via het **ticketing-systeem** in zijn klantenportaal, of per e-mail naar **support@gewoonsander.nl**.

## Next steps

- **Vandaag (2026-07-03), vóór de huldiging/ALV vanavond:** toegang/informatie voor Emiel afronden
- Zorgen dat Emiel na zijn (waarschijnlijke) verkiezing direct verder kan met de website

## Cross-links

- [[Deliverables/2026-07-03-rdb-overdracht-emiel]] — concept-overdrachtsdocument voor Emiel
- [[emiel-theloosen]] — volledige achtergrond, technische context en eerdere afspraken
- [[rivierenland-darts-bond]] — organisatiecontext, bestuurswisseling 2026, domeinen
- [[heleen-van-den-berg]] / project_praktijkvoluitleven-migratie — vergelijkbare eerdere klant-onboarding-aanpak als referentie

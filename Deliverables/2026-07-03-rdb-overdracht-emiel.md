---
title: RDB Website- en Toegangsoverdracht — overdrachtsdocument voor Emiel Theloosen
date: 2026-07-03
status: concept
linked_people:
  - emiel-theloosen
  - nick-pol
tags:
  - darts
  - rdb
  - hosting
  - overdracht
---

# RDB Website- en Toegangsoverdracht — voor Emiel Theloosen

Dit is de overdracht van het webmasterschap van de Rivierenland Darts Bond (RDB) website van Sander van Ockenburg-Zwaan (Gewoon Sander) aan Emiel, bij zijn (verwachte) aantreden als bestuurslid communicatie vanavond.

## 1. Webmasteraccount

Sander draagt vanavond, zodra Emiel officieel is gekozen, het webmasteraccount (inclusief wachtwoord) over. Emiel kan het wachtwoord daarna direct zelf wijzigen.

**Klantenportaal-login (hosting/website):**
- Gebruikersnaam: `webmaster@rdbdarts.nl`
- Wachtwoord: `kD*********f` (het echte wachtwoord stuurt Sander via een apart kanaal, niet in dit document)
- Portaal: `gewoonsander.nl/hub`

**WordPress-inlog (de website zelf):**
- URL: `https://rivierenlanddartsbond.nl/ikwilerin` (let op: **niet** het standaard `/wp-admin/`-pad — dat is bewust afgeschermd uit veiligheidsoverweging)
- Gebruikersnaam: `webmaster@rdbdarts.nl`
- Wachtwoord: `bzn***************m` (het echte wachtwoord stuurt Sander via een apart kanaal, niet in dit document)

## 2. Hosting & techniek

- De website draait op een **dedicated WPMU Dev-hosting**, beheerd door Sander (Gewoon Sander).
- De pagebuilder **Divi** kost normaal €89/jaar, maar RDB gebruikt deze **gratis** via Sanders eigen Divi-licentie.
- Sander heeft altijd geprobeerd **kostendekkend** te werken voor RDB — niet om winst te maken op hosting of domeinen.

## 3. Domeinen

- Alle drie de domeinen — **rdbdarts.nl**, **rivierenlanddartsbond.nl** en **mijnrdb.nl** — zijn geregistreerd bij **GoDaddy**, op naam van Sander.
- Reden voor GoDaddy: bij de vorige registrar (Versio) sprong de prijs in één keer naar €22 per domein per jaar. Bij GoDaddy is dat een stuk goedkoper, en die besparing wordt gewoon doorberekend aan RDB.
- **Belangrijk:** wil Emiel iets aan de DNS-instellingen wijzigen, dan moet dat altijd via Sander — de domeinen staan namelijk op zijn naam en zitten inbegrepen bij de hosting.
- **Let op, actie vereist: mijnrdb.nl verloopt op 21 juli.** Dit domein is al door Sander betaald bij GoDaddy. Wil Emiel (namens RDB) dit domein behouden, dan moet hij dat vóór die datum aan Sander doorgeven — Sander verlengt het dan, en de kosten komen op de factuur van volgend jaar.

## 4. Google Workspace

- Google Workspace (de e-mailomgeving) wordt beheerd door **Nick Pol** (huidig/aftredend voorzitter RDB), niet door Sander.
- Voor alles wat met Workspace te maken heeft (mailaccounts, aliassen, etc.) moet Emiel bij **Nick** zijn, niet bij Sander.
- De tweestapsverificatie (2FA) van `webmaster@rdbdarts.nl` stond gekoppeld aan Sanders eigen telefoonnummer — Nick heeft dit inmiddels op Sanders verzoek losgekoppeld. Emiel kan bij de overdracht dus gewoon zelf een nieuwe 2FA instellen op zijn eigen telefoon.

## 5. Facturatie

- Hosting + service: **€35/maand** (€420/jaar)
- Domeinnaam-verlenging rdbdarts.nl: **€8/jaar**
- Domeinnaam-verlenging rivierenlanddartsbond.nl: **€8/jaar**
- Totaal: €436/jaar excl. btw, **€527,56/jaar incl. 21% btw**
- Dit loopt via een klantdashboard in de WPMU Dev Hub, waar Emiel als webmaster inzicht krijgt in alle afgenomen diensten en facturen.
- Klantenportaal-login: **`gewoonsander.nl/hub`**
- De factuur voor 2026 (bovenstaand bedrag) staat nog als concept klaar — Sander moet deze nog definitief aanmaken/klaarzetten in de Hub.
- **Betaling loopt via Sjoerd, de nieuwe penningmeester van RDB** — per creditcard als de bond die inmiddels heeft (dat was de vorige keer nog niet het geval), anders gewoon per bankoverschrijving onder vermelding van het factuurnummer. Zodra betaald, zet Sander de factuur handmatig op "betaald" in de Hub.

## 6. Support / contact

Voor alle vragen of wijzigingen aan de website/hosting kan Emiel Sander bereiken via:
- Het **ticketing-systeem** in het klantenportaal (`gewoonsander.nl/hub`) — dit is de manier om contact te onderhouden, of
- E-mail: **support@gewoonsander.nl**

## 7. Wat Emiel zelf kan doen in het portaal

- **Plugins**: nieuwe plugins toevoegen (via WordPress.org) én bestaande plugins beheren, inclusief een reeks premium plugins die via het WPMU Dev-abonnement beschikbaar zijn.
- **Sites**: onder "Sites" staat de RDB-website (rivierenlanddartsbond.nl) — daarop doorklikken geeft een volledig overzicht van hosting, status, etc.
- **Domeinregistratie via WPMU Dev staat bewust uit**: WPMU Dev heeft zelf ook een domein-service, maar die is duurder dan Sanders route via GoDaddy — domeinen blijven daarom buiten de Hub om via Sander lopen.
- **Aanrader: staging-omgeving gebruiken om te ontwikkelen.** Via "Sites" in de Hub kan Emiel een **staging site** inrichten — een lokale kopie van de huidige website die op een sub-URL draait. Daar kan hij volledig verbouwen wat hij wil, zonder dat de live site (die nu al bezoekers heeft) er iets van merkt. Zodra hij tevreden is, publiceert hij de staging-versie over de live site heen. Zo kan hij rustig ontwikkelen zonder de bestaande site "af" te hoeven hebben.

## 7b. Plugins & licenties

Overzicht van premium plugins op de site en hoe de licenties geregeld zijn:

- **WPMU Dev Pro-suite** (SmartCrawl Pro, Branda Pro, Smush Pro, Hummingbird Pro, Defender Pro, Forminator Pro): inbegrepen zolang de hosting bij WPMU Dev blijft.
- **WP All Import Pro + WP All Export Pro** (en alle addons): lifetime subscription van Sander — Emiel kan ze gebruiken zolang ze actief zijn, licentiecode kan niet worden overgedragen.
- **Divi Builder**: lifetime subscription van Sander bij [Elegant Themes](https://www.elegantthemes.com/) (dé website voor premium WordPress-thema's) — RDB mag hierop meeliften.
- **BuddyBoss Platform**: lifetime licentie van Sander voor max. 5 sites — RDB gebruikt er 2 (staging + live).
- **Divi Dynamic Helper (nu inactief) — jouw beslissing nodig.** Het abonnement stond op Sanders naam en was betaald t/m 30 oktober 2026; Sander heeft het uit voorzorg al opgezegd. Tot 30 oktober blijft de plugin gewoon werken, daarna geen updates meer. **Wil je deze plugin gebruiken/heractiveren?** Dat kost $36 — laat het Sander weten, dan maakt hij daar een factuur voor. Wil je hem niet gebruiken, hoef je niks te doen.
- **⚠️ The Events Calendar (agenda-plugin): geen licentie en geen support meer.** Deze plugin is overgenomen door LiquidWeb en Sanders licentie is vervallen. **Actie voor Emiel:** zelf een licentie/ondersteuning regelen bij LiquidWeb, óf een andere agenda-/kalenderoplossing kiezen.
- **⚠️ Advanced Custom Fields Pro: Sanders persoonlijke licentie, niet overdraagbaar.** Wil je ACF Pro blijven gebruiken, dan moet je zelf een eigen licentie aanschaffen. **Actie:** check eerst of deactiveren gevolgen heeft voor de website (velden die nog in gebruik zijn); zo niet, kun je de plugin gewoon verwijderen.
- **Smart Slider 3 Pro: licentie is betaald en actief op rivierenlanddartsbond.nl — deze mag RDB gewoon houden.**
- **Divi Machine**: £25, licentie inmiddels verlopen.

**Algemeen:** Sander weet nog niet welke van deze plugins je op termijn wel of niet wilt blijven gebruiken. Heb je ooit een update nodig voor een van bovenstaande plugins, app dan gewoon even met Sander — dan bekijken jullie samen of het reactiveren van de bestaande licentie de beste optie is, of dat het voordeliger is als RDB zelf een eigen licentie aanschaft. Dat lossen jullie dan op het moment zelf op.

## 7c. Thema (los van de plugins hierboven — een thema is technisch iets anders dan een plugin)

- **Custom thema, gebouwd op basis van het BuddyBoss-thema**: actief op **rivierenlanddartsbond.nl** en **rdb.tempurl.host** (de staging-URL) — via Sanders lifetime licentie mag RDB dit gewoon blijven gebruiken.
- Nog wel onduidelijk of dit thema inhoudelijk nodig blijft, omdat het ledenomgeving-plan waarvoor het gebouwd is momenteel wordt herzien.
- **Alternatief:** mocht je besluiten het BuddyBoss-thema niet meer te willen gebruiken, dan kan Sander er gratis het **Divi-thema** op zetten (ook van Elegant Themes, zelfde lifetime-subscription als Divi Builder).
- **Update:** Sander heeft het Divi-thema inmiddels al geïnstalleerd. Mocht Emiel dit willen gebruiken voor de vernieuwde site, dan is dit de licentiesleutel: `6ca9a3e061b9733f168715bc314525e1a5a9e114`

## 8. Aanbod: online meeting voor een rondleiding

Als Emiel dat op prijs stelt, biedt Sander aan om een keer online mee te kijken met Emiels scherm en hem persoonlijk door de Hub heen te leiden — zodat alles hierboven ook praktisch wordt doorgenomen.

## Nog te regelen (zie ook het projectdossier)

- [[project_rdb-emiel-website-overdracht]] voor de volledige, actuele status en openstaande actiepunten.

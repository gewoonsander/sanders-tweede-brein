---
key_element: financien
id: 2026-08-17-argus-bunq-connector-audit
title: "Argus security-audit — bunq-saldo-connector (pre-implementatie designreview)"
owner: argus
date: 2026-08-17
type: security-audit
status: "verdict: YELLOW — bouwen mag, onder expliciet genoemde voorwaarden"
applies_to: Expansions/mypka-cockpit
---

# Argus — Security-audit: bunq-saldo-koppeling (designreview, geen code bestaat nog)

**Scope van deze audit:** het architectuurontwerp in [[2026-07-05-bunq-saldo-cockpit-design]] (Aanpak A, directe Node-connector) plus de negenpunts-checklist in §4 van [[2026-08-17-bunq-mcp-koppeling-onderzoek]]. Er is geen code om te lezen — dit is een pre-implementatie gate, geen code-audit. Ik toets of het ontwerp *hard genoeg* is om straks een veilige implementatie te dwingen, niet of de implementatie zelf goed is (die audit volgt na de bouw, vóór productie-activatie — al afgesproken in beide bronnen, zie hun eigen §"harde poort").

**Kader (niet ter discussie, ik toets erbinnen):** geen MCP-server, directe read-only Cockpit-connector, enige toegestane call `GET /user/{userID}/monetary-account`, elke rekening/potje apart getoond, bunq Pro bevestigd op beide rekeningen, sandbox verplicht vóór productie, secrets via `Team Knowledge/.env` (0600, gitignored) + `readEnvKey(...)`, sessie-token nooit naar schijf.

---

## 1. Is "strikt GET-only, één endpoint" hard genoeg afgedwongen op code-niveau?

**Bevinding — [MEDIUM, designgap]**

**Waar:** [[2026-07-05-bunq-saldo-cockpit-design]] §"Aanpak A — Nieuwe bestanden" (`bunqClient.js`-beschrijving) en §"Beveiligingsoverwegingen" ("Puur GET, altijd... Eén endpoint: `monetary-account`."); vergeleken met [[2026-08-17-bunq-mcp-koppeling-onderzoek]] §3 ("Harde endpoint-allowlist in code... geweigerd vóór de HTTP-call, niet erna") en de Argus-checklist punt 1-2.

**Wat:** Het juli-ontwerp beschrijft "puur GET" als *intentie in proza* — er staat nergens een concrete code-eis voor hóe dat wordt afgedwongen. Het onderzoek van vandaag benoemt terecht een "harde endpoint-allowlist" als eis voor een eventuele MCP-tool-laag, maar diezelfde eis staat niet expliciet uitgeschreven voor `bunqClient.js` zelf — en dat is precies het bestand dat de connector permanent in productie draait. Prozaïsche intentie ("nooit een schrijf-call toevoegen") is geen controle; het is een belofte die een toekomstige, haastige wijziging (bijv. "voeg er ook even transactiegeschiedenis aan toe") zonder enige technische wrijving kan doorbreken.

Ter vergelijking: het bestaande `todoist.js`-patroon in de Cockpit-codebase (`Expansions/mypka-cockpit/server/connectors/todoist.js`) laat zien hoe dit wél hoort — daar zijn schrijf-methodes (`createTask`, `updateTask`, `closeTask`) expliciet, smal, en met inline-commentaar "scope-locked... any other field is IGNORED, not forwarded" per methode. Dat is het soort concrete, code-afdwingbare beperking dat voor bunq nog ontbreekt — met dit verschil dat bunq's connector `bunqClient.js` er expliciet géén enkele schrijf-methode bij mag hebben, punt.

**Fix-eis (concreet, vóór bouwfase vast te leggen):**
1. `bunqClient.js` exporteert **geen generieke** `request(method, path, body)`-functie naar zijn consumers. Het exporteert alleen smalle, naar-verb-gebonden functies, bijv. `signedGet(path)` — het HTTP-werkwoord `GET` staat hardcoded in de fetch-aanroep, er is geen `method`-parameter die een aanroeper kan overschrijven.
2. Vóór elke `signedGet(path)`-aanroep controleert de functie `path` tegen een **expliciete allowlist-constante** (een exacte string of een strak regex, bijv. `/^\/v1\/user\/\d+\/monetary-account$/`) — geen substring-match, geen wildcard. Een niet-matchend path gooit een `Error` vóór er ooit een `fetch` plaatsvindt.
3. `bunqBalance.js` importeert nooit `fetch` rechtstreeks en bouwt nooit zelf een URL — het roept uitsluitend de smalle functie(s) van `bunqClient.js` aan. Dat maakt "per ongeluk een schrijf-call toevoegen" een tweestaps-wijziging (eerst `bunqClient.js` zelf aanpassen, wat een expliciete, zichtbare diff is) in plaats van een eenregelige wijziging in de consumer.
4. De drie auth-levenscyclus-calls (`POST /installation`, `POST /device-server`, `POST /session-server`) leven in een apart, intern (niet geëxporteerd) deel van `bunqClient.js` — nooit aanroepbaar vanuit `bunqBalance.js` of enige andere consumer-module.
5. Een unit-test die bevestigt dat `signedGet('/v1/user/123/payment')` (of elk ander niet-toegestaan path) een `Error` gooit vóórdat een netwerkcall plaatsvindt (mock `fetch`, assert `fetch` nooit is aangeroepen). Dit is de verificatiestap: als deze test faalt of ontbreekt, is de eis niet gehaald.

**Verificatiestap bij de post-build-audit:** grep op `POST\|PUT\|PATCH\|DELETE` in `bunqClient.js`/`bunqBalance.js` buiten de drie genoemde auth-calls → nul treffers. Bevestig dat `bunqBalance.js` geen `fetch(` bevat. Draai de allowlist-unit-test.

---

## 2. Compenserende maatregelen tegen het betaalrisico van een gecompromitteerde key/token

**Bevinding — [HIGH, structureel risico dat het ontwerp niet kan wegcoderen]**

**Waar:** [[2026-08-17-bunq-mcp-koppeling-onderzoek]] §1 ("Er bestaat geen strikt alleen-lezen scope... een API-key is functioneel gelijk aan volledige toegang tot de rekening") — bevestigd met een letterlijk citaat uit bunq's eigen documentatie.

**Wat:** Dit is het kernpunt van de hele audit: *ongeacht* hoe goed `bunqClient.js` wordt geschreven, de credentials zelf (API-key + RSA private key + installation-token) zijn, als ze lekken, functioneel een betaalmiddel — de code-level GET-only-beperking beschermt alleen tegen bugs in óns eigen aanroeppad, niet tegen een aanvaller die de sleutel rechtstreeks buiten de Cockpit om gebruikt (bv. via curl, met een gestolen `.env`). Dat risico kan niet weg-engineerd worden binnen dit ontwerp — het kan alleen omringd worden.

**Fix-eis (compenserende maatregelen, vóór productie-activatie):**
1. **`permitted_ips` concreet, nooit wildcard** — zie punt 3 hieronder; dit is de sterkste technische mitigatie die bunq zelf aanbiedt, omdat een gestolen sleutel vanaf een ander IP dan geregistreerd sowieso wordt geweigerd door bunq's eigen infrastructuur, nog vóór de Cockpit-code ooit in beeld komt.
2. **Aparte sleutel per rekening.** Geen gedeelde API-key over Gewoon Sander én Gezinshuis — één sleutel per rekening, zodat een lek van de ene rekening niet automatisch de andere meeneemt.
3. **Bestandsrechten en machine-hygiëne.** `Team Knowledge/.env` blijft 0600 en gitignored (al afgesproken) — omdat de inhoud nu functioneel gelijk is aan betaalcredentials, geldt: volledige schijfversleuteling (FileVault) en schermvergrendeling op de machine die de Cockpit draait zijn een impliciete voorwaarde, geen losstaande aanbeveling. Vermeld dit expliciet in `SECURITY.md` of de bunq-module-README als aanname die gecheckt moet worden, niet als vanzelfsprekend.
4. **Ingeoefende intrekprocedure.** Vóór de eerste productie-key: een geteste, gedocumenteerde stap-voor-stap-procedure om de sleutel in te trekken (bunq-app → Instellingen → Developers → API keys → intrekken) — met een vastgelegde "wie doet dit, en wanneer" (bij een vermoeden van lek: onmiddellijk, niet na overleg).
5. **Out-of-band detectie, niet in de code bouwen.** De Cockpit-connector zelf hoeft geen fraudedetectie te bouwen — dat zou scope-kruip zijn. Leun in plaats daarvan op bunq's eigen bestaande push-notificaties voor uitgaande betalingen (al standaard aan op Sanders telefoon) als het feitelijke tripwire-mechanisme: een onverwachte betaalmelding ís het signaal om sleutel #4 uit te voeren. Dit moet expliciet benoemd worden zodat niemand aanneemt dat de read-only-code zelf al bescherming biedt tegen misbruik van de onderliggende sleutel.
6. **Sessie-token blijft in-memory-only** (al in het ontwerp vastgelegd) — bevestig dit als staand, niet als toekomstige verbetering: het is één artefact minder dat via een schijf-lek gestolen kan worden.

Dit is geen blokkerende bevinding — het is een structureel gegeven van bunq's API-model dat het ontwerp niet kan oplossen, alleen inperken. De vijf maatregelen hierboven zijn de inperking; zonder minstens 1, 2 en 4 zou ik dit tot een blokkerend punt verzwaren.

---

## 3. `permitted_ips`: concrete IP's, geen wildcard — haalbaar bij wisselende netwerken?

**Bevinding — [MEDIUM, operationeel, geen blokkade]**

**Waar:** [[2026-08-17-bunq-mcp-koppeling-onderzoek]] §4 "IP-whitelisting" + checklist punt 5.

**Wat:** bunq staat de wildcard `*` toe, maar alleen handmatig via de app ("to prevent accidental security risks through API misuse") — bunq's eigen documentatie adviseert de wildcard te vermijden tenzij absoluut noodzakelijk. Een vast thuis-IP is voor een particuliere aansluiting typisch dynamisch (verandert soms, niet vaak) — geen permanent vast getal, maar ook niet elke sessie anders. Twee Macs (Mac mini, MacBook Air), mogelijk verschillende locaties, maken "één permanent IP volstaat" onwaarschijnlijk als aanname.

**Aanbeveling:**
1. **Geen wildcard, punt.** De operationele wrijving van een IP-wijziging (kaart toont tijdelijk `available:false` tot het nieuwe IP is toegevoegd) is een acceptabele prijs voor een reële hardening-laag — vooral gegeven bevinding 2 hierboven (compromis van de sleutel is een betaalrisico).
2. **Registreer een klein, benoemd setje IP's**, niet één: het (meestal stabiele) thuis-IP plus eventuele andere vaste, terugkerende locaties waar de Cockpit daadwerkelijk met bunq praat — niet elk IP dat Sander ooit gebruikt.
3. **Operationeel scenario vastleggen, niet negeren:** als de bunq-connector alleen ooit vanaf één vaste machine op één vaste locatie hoeft te draaien (bijv. de Mac mini, thuis, die toch al 24/7 aan staat voor andere Cockpit-taken), is dat de eenvoudigste, laagste-wrijving-oplossing — beperk de bunq-module in de praktijk tot die ene machine/locatie in plaats van hem overal te laten meedraaien. Dat is een procesbeslissing (Sander/Hermes), geen codewijziging.
4. **Runbook-stap toevoegen** (in `server/connectors/bunq/README.md` of vergelijkbaar): "kaart geeft plots `available:false`/verbindingsfout → check bunq-app → Developers → API keys → IP addresses → voeg huidig IP toe." Dit voorkomt dat een IP-wijziging aanvoelt als een onverklaarbare storing.
5. **Vraag na of Sanders thuis-ISP een vast IP aanbiedt** (sommige Nederlandse providers bieden dit tegen een kleine meerprijs) — als dat haalbaar is, elimineert het de wrijving volledig zonder de wildcard te hoeven gebruiken. Puur een suggestie, geen vereiste.

Niet blokkerend, maar dit moet als expliciete operationele afspraak vastgelegd worden vóór productie-activatie — niet iets waar Sander achteraf tegenaan loopt na een IP-wijziging.

---

## 4. LAN-mode-risico: is de bestaande PIN-gate voldoende voor bankdata specifiek?

**Bevinding — [MEDIUM, aanvullende maatregel geadviseerd]**

**Waar:** `Expansions/mypka-cockpit/server/auth.js` (bestaande PIN-gate: scrypt-hash, constant-time verify, 6+ cijfers minimum, 5 mislukte pogingen → 15 minuten lockout, sessie-cookie); [[2026-07-05-bunq-saldo-cockpit-design]] §"LAN-mode-kanttekening"; `Expansions/mypka-cockpit/SECURITY.md` §"Network posture".

**Wat:** De bestaande PIN-gate is technisch solide voor wat hij is: gehasht (nooit cleartext op schijf), constant-time-vergeleken, met brute-force-lockout. Dat is een redelijke drempel tegen een willekeurige indringer op het netwerk. Maar de PIN-gate behandelt vandaag *elke* Hub-kaart identiek — wie de PIN heeft (elk gezinslid, een logé, een gast met wifi-toegang), ziet zonder onderscheid zowel een open-taken-lijstje als straks een bank­saldo. Dat is een ander risicoprofiel dan het ontwerp zelf al erkent ("een andere impact dan een open takenlijst") maar er vervolgens geen technische maatregel aan koppelt ("geen nieuwe technische maatregel nodig" — juli-ontwerp).

Ik ben het daar niet mee eens als eindpunt: de PIN-lockout beschermt tegen *brute-force*, niet tegen het scenario waarin iemand de PIN al legitiem heeft (bv. een logé die de PIN kreeg om het weer te checken) en er vervolgens ook het banksaldo bij ziet zonder dat dat ooit de bedoeling was.

**Fix-eis (aanvullende maatregel, licht, geen nieuwe auth-laag):**
1. De bunq-kaart is **standaard uit in LAN-mode**, ook als hij lokaal (loopback) wél actief is — via de bestaande `KNOWN_MODULES`/instellingen-toggle in `cockpitSettingsDb.js`. Concreet: het module-record voor `bunq_balance` krijgt een `lan_default: false`-vlag (of gelijkwaardig), zodat LAN-toegang de kaart standaard verbergt tenzij Sander hem daar expliciet aanzet.
2. Geen nieuwe wachtwoordlaag, geen tweede PIN — dat zou disproportioneel zijn. Dit is bewust een *lichte* aanvulling op een al goed doordachte PIN-gate, geen nieuw beveiligingssysteem.
3. Documenteer dit gedrag zichtbaar in de instellingenpagina (korte tekst: "banksaldo wordt niet getoond via LAN-toegang, tenzij hier aangezet") zodat het een bewuste keuze is, geen verrassing.

Dit is geen blokkade — het is een kleine, goedkope aanvulling die het bestaande "geen nieuwe maatregel nodig"-standpunt uit het juli-ontwerp verbetert zonder de architectuur te compliceren.

---

## 5. Rate-limit-kwetsbaarheid: 10 requests/dag op setup/installation-endpoints

**Bevinding — [HIGH, moet vóór bouw als harde eis vastliggen]**

**Waar:** [[2026-08-17-bunq-mcp-koppeling-onderzoek]] §4 "Rate limits" ("Dit is het belangrijkste operationele risico") + checklist punt 4.

**Wat:** Dit is de meest concrete, cijfermatig onderbouwde bevinding uit het onderzoek van vandaag en verdient een expliciete, code-afdwingbare eis — niet alleen een intentie. Een Cockpit-server die crasht en door een process-supervisor (er staat een `launchd/`-map in de repo, dus dit is een reëel herstart-mechanisme, geen hypothese) herhaaldelijk herstart, riskeert bij elke herstart opnieuw `installation`/`device-server` aan te roepen als de code niet expliciet eerst checkt of er al een geldige registratie bestaat.

**Fix-eis (concreet, vóór bouwfase vast te leggen):**
1. `bunqClient.js` implementeert een `ensureInstallation()`-guard die **eerst** `readEnvKey('BUNQ_INSTALLATION_TOKEN')` en `readEnvKey('BUNQ_DEVICE_SERVER_ID')` opvraagt. Alleen als één van beide ontbreekt of ongeldig is, wordt `POST /installation` / `POST /device-server` uitgevoerd. Bij elke normale boot (het overgrote deel van de gevallen) gebeurt dus **nul** installation/device-calls.
2. `POST /session-server` (voor de wél-noodzakelijke sessie-verversing bij elke boot, want sessie-token leeft alleen in-memory) moet vóór productie-activatie in de **sandbox geverifieerd** worden op welke rate-limit-categorie hij daadwerkelijk valt (10/dag-installation-bucket, of de 70-140/30s-standaardbucket, of de 3/60s-security-bucket) — dit staat nu nergens bevestigd, alleen als open vraag benoemd in het onderzoek. Dit is een verplicht verificatiepunt vóór productie, geen aanname.
3. **Crash-loop-bescherming, client-side, onafhankelijk van bunq's eigen 429.** Bij een mislukte `session-server`-call: exponential backoff met een maximum-aantal pogingen per opstart, en daarna een cooldown-periode waarin de kaart calm-degradeert (`{ available: false, items: [] }`, zelfde contract als `invoicesApi.js`) in plaats van in een tight restart-loop te blijven proberen. Concreet: geen nieuwe sessie-poging binnen bijvoorbeeld 60 seconden na een mislukte poging, en een absolute limiet (bv. max 5 pogingen per uur) los van wat bunq's eigen 429-foutmelding aangeeft — dit is een tweede, eigen vangnet, niet alleen vertrouwen op bunq's foutcode.
4. **Verificatietest vóór productie:** simuleer 10-15 snelle herstarts van de Cockpit-server binnen een paar minuten (sandbox-omgeving) en bevestig dat het aantal installation/device-server-calls op 0 blijft (want al geregistreerd) en dat session-server-calls binnen de geverifieerde bucket-limiet blijven zonder een 429 te veroorzaken.

Dit is een blokkerende eis voor de bouwfase — niet omdat het ontwerp het verkeerd doet, maar omdat het ontwerp dit punt nog niet als concrete code-eis heeft vastgelegd (het juli-ontwerp noemt zelfs het verouderde, te lage cijfer "3 GET/3s", wat aantoont dat deze eis nog niet met het juiste cijfer is doorgerekend).

---

## 6. Eindverdict

# **YELLOW** — bouwen mag, onder de hieronder expliciet genoemde voorwaarden.

**Waarom geen RED:** de architectuurkeuze zelf is gezond. Aanpak A (directe, server-side, read-only Cockpit-connector, buiten de connector-registry, volgens het Open-Invoices-precedent) is de veiligste van de drie routes die het onderzoek van vandaag zelf afweegt — en terecht: geen MCP, geen tool-oppervlak richting een taalmodel, geen prompt-injectie-pad via transactieomschrijvingen (want die functionaliteit — transacties lezen — zit sowieso niet in scope; alleen `monetary-account`). Er is geen fundamenteel ontwerpprobleem dat "niet bouwen zoals ontworpen" rechtvaardigt.

**Waarom geen GREEN:** vijf van de zes getoetste punten hebben op dit moment alleen proza-intentie of een onbevestigde aanname, waar bankdata concrete, code-afdwingbare eisen en geverifieerde feiten verdient vóór er ook maar één regel geschreven wordt. Met name punt 1 (GET-only nu alleen belofte, geen allowlist) en punt 5 (10/dag-limiet nog niet als harde installatie-guard uitgewerkt) zijn precies het soort gat waar "het leek een kleine wijziging" een write-call of een self-inflicted lockout veroorzaakt.

### Wat vóór de bouwfase moet worden vastgelegd (voorwaarden voor dit YELLOW)

1. **Endpoint-allowlist als code-eis, niet als commentaar** (punt 1): `bunqClient.js` exporteert geen generieke `request(method, path)`; alleen een hardcoded-GET `signedGet(path)` met allowlist-check vóór elke call, plus een unit-test die een niet-toegestaan path laat falen zonder netwerkcall.
2. **Installation-persistence-guard tegen de 10/dag-limiet** (punt 5): `ensureInstallation()` checkt eerst bestaande tokens via `readEnvKey(...)` vóór ooit `installation`/`device-server` aan te roepen; session-server's rate-limit-categorie wordt in de sandbox geverifieerd; crash-loop-bescherming met eigen backoff, los van bunq's 429.
3. **`permitted_ips` concreet vastgelegd als operationele afspraak** (punt 3): geen wildcard, een klein benoemd setje IP's, een runbook-stap voor IP-wijzigingen, en een besluit of de bunq-module tot één vaste machine/locatie beperkt blijft.

### Wat ik daarnaast adviseer, niet blokkerend maar wel vóór productie-activatie

- Compenserende maatregelen tegen het betaalrisico van een gecompromitteerde sleutel (punt 2): aparte sleutel per rekening, geteste intrekprocedure, FileVault/schermvergrendeling als impliciete voorwaarde, leunen op bunq's eigen betaalmeldingen als tripwire.
- LAN-mode: bunq-kaart standaard uit bij LAN-toegang, ook als de kaart lokaal wel actief is (punt 4).
- De eerder al afgesproken tweede Argus-audit ná implementatie, vóór het eerste gebruik van een echte productiesleutel, blijft staan — dit designreview vervangt die niet. Neem in die post-build-audit specifiek de zes punten hierboven terug als concrete testpunten (allowlist-unit-test draaien, grep op schrijf-werkwoorden, crash-loop-simulatie, IP-configuratie controleren).
- Open verificatiepunten uit het onderzoek van vandaag (bunq Pro/Elite-eis voor de Gewoon Sander-rekening specifiek, of View-Only-rol via API werkt) horen bij Sander/Daedalus thuis, niet bij mij — maar blokkeren de bouw van de read-only balanskaart niet, want die functioneert met een gewone API-key op een Pro-abonnement (al bevestigd voor beide rekeningen).

**Geen overrule-pad voor punt 1 en 5** — dit zijn geen "accepteer het risico"-items waar Sander overheen kan stappen; het zijn concrete implementatie-eisen die bij de bouw simpelweg meegenomen moeten worden (ze kosten geen extra architectuur, alleen precisie in hoe `bunqClient.js` geschreven wordt). Punt 2, 3 en 4 zijn wél normale go/no-go-afwegingen waar Sander een geïnformeerde keuze in kan maken (bijv. "ik accepteer de wrijving van een wisselend IP" of "ik wil de bunq-kaart ook via LAN zichtbaar" zijn legitieme keuzes zodra hij de afweging kent).

---
key_element: financien
id: 2026-08-17-bunq-mcp-koppeling-onderzoek
title: "bunq-koppeling via MCP voor een financiële specialist — onderzoek"
owner: daedalus
date: 2026-08-17
type: research-brief
status: final — puur onderzoek, geen implementatie
applies_to: Expansions/mypka-cockpit
---

# bunq-koppeling via MCP — onderzoek

> **Status: ONDERZOEK. Er is niets gebouwd, niets aangevraagd, niets geregistreerd.**
> Geen `.env`-waarden geschreven, geen MCP-server geregistreerd, geen credentials aangevraagd.
> Implementatie is geblokkeerd tot Argus (SOP-004) een security-review heeft gedaan. Harde poort.

## Executive summary

Vier dingen om te onthouden:

1. **Er bestaat geen strikt alleen-lezen scope in de bunq API.** Niet bij API-keys (die kunnen álles, inclusief betalen) en niet bij OAuth (vaste, niet-verkleinbare permissieset die betalingen tussen eigen rekeningen, draft-payments en kaartbeheer bevat). De enige echte read-only-knop die bunq aanbiedt zit één laag lager: de **View-Only-rol op een zakelijke bunq-rekening**.
2. **Er is geen kant-en-klare, alleen-lezen bunq MCP-server.** De twee die bestaan zijn hobbyprojecten (12 en 0 GitHub-sterren) en hebben allebei betaal-tools aan boord. bunq's eigen twee MCP-servers gaan niet over persoonlijk bankieren.
3. **Een MCP-server is voor dit doel het grootste aanvalsoppervlak van alle opties** — en er ligt al een goedgekeurd-wachtend ontwerp voor een veiligere route: de read-only Cockpit-connector uit [[2026-07-05-bunq-saldo-cockpit-design]].
4. **Twee feiten uit dat juli-ontwerp zijn achterhaald of nu beantwoord:** de rate limits zijn veranderd, en de daar opengelaten vraag "biedt bunq een read-only-scoped key?" is nu beantwoord met *nee*.

---

## 1. Wat biedt de officiële bunq Developer API, en is er een alleen-lezen scope?

### Twee authenticatiemodellen, allebei niet read-only

**A. API-key (uit de bunq-app).** Geen enkele scoping mogelijk. bunq's eigen documentatie is er expliciet over: *"A production API key can be used to control your bank account and make payments on your behalf."* Een API-key is functioneel gelijk aan volledige toegang tot de rekening. **Confidence: High** (primaire bron, letterlijk citaat).

**B. OAuth.** Een vaste permissieset die je *niet* kunt verkleinen. Letterlijk uit `doc.bunq.com/basics/authentication/oauth`, bevestigd door de gespiegelde bron `github.com/bunq/gitbook`:

- read and create **Monetary Accounts**
- read **Payments & Transactions**
- create **Payments** between Monetary Accounts of the same user
- create **Draft-Payments** (approval required in the bunq app)
- assign a **Monetary Account** to a **Card**
- read, create and manage **Cards**
- read and create **Request-Inquiries**
- read **Request-Responses**

**Confidence: High** — twee onafhankelijke bronnen (live docs + de GitHub-mirror) geven identiek dezelfde lijst.

### Let op: een wijdverbreide onjuiste claim

Meerdere secundaire bronnen (en de eerste laag zoekresultaten) beweren *"OAuth is read-only, API keys zijn read-write."* **Dat is te kort door de bocht en misleidend.** Wat wél klopt: een OAuth-app kan géén betalingen naar **derden** doen. Wat er níét bij verteld wordt: een OAuth-app kan wel degelijk geld verplaatsen tussen Sanders eigen rekeningen, draft-payments klaarzetten, kaarten beheren en betaalverzoeken aanmaken. Dat is geen alleen-lezen.

Praktisch bewijs dat dit onderscheid echt zo werkt: de MCP-server van WilcoKruijer documenteert de foutmelding *"Not enough permissions to create payment"* bij OAuth, met de toelichting *"Only draft payments can be created."*

**Conclusie op de onderzoeksvraag: nee, er is geen striktalleen-lezen scope voor saldo's/transacties in de reguliere bunq API.** OAuth is *minder gevaarlijk* dan een API-key, maar het is niet read-only.

### De uitzonderingen die wél bestaan

**PSD2 role-based scopes.** bunq ondersteunt PSD2-rollen, waaronder AISP (Account Information Service Provider) — dat ís per definitie alleen-informatie. Maar dat vereist een PSD2-vergunning en een eIDAS-certificaat dat direct bij bunq geregistreerd wordt. Niet haalbaar voor een eenmanszaak. **Confidence: High** dat dit bestaat, **High** dat het niet toegankelijk is voor Sander.

**View-Only op zakelijk niveau — dit is de interessante.** Een bunq Business-rekening kent drie toegangsniveaus via Business Profile → Bank Account Access:

| Niveau | Wat het mag |
|---|---|
| Full Access | Alles wat de eigenaar mag (vereist inschrijving als bestuurder bij de KvK) |
| Make Payments | Betalen vanaf geselecteerde rekeningen |
| **View-Only** | **Alleen de betalingen van geselecteerde rekeningen inzien — geen transacties uitvoeren, geen wijzigingen** |

bunq noemt zelf de accountant als typische View-Only-ontvanger. **Confidence: High** (bunq Help Center, primaire bron).

> **Open verificatiepunt (niet geverifieerd, niet aannemen):** of een API-key die gegenereerd wordt door een *View-Only-genodigd* bunq-profiel die gedeelde rekeningen daadwerkelijk via de API kan uitlezen. Dat is de kern van de aantrekkelijkste beveiligingsroute, en ik heb het **niet** kunnen bevestigen in de documentatie. Zoekresultaten noemen access-types `VIEW_BALANCE`, `VIEW_TRANSACTION`, `DRAFT_PAYMENT` en `FULL_TRANSIENT` rond bunq Connect, maar ik kon die enum **niet** terugvinden in een primaire bunq-bron — behandel die namen als onbevestigd. Dit moet in de sandbox getest worden vóór er conclusies aan hangen.

Let op het verschil met **persoonlijke** rekeningen: daar bestaat Shared Access wél, maar zónder view-only-variant — bunq zegt expliciet dat een genodigde *"transactions kan bekijken, betalingen kan doen, geld kan toevoegen en zelfs een eigen kaart kan koppelen."* Voor privérekeningen bestaat dus géén read-only-route.

---

## 2. Hoe vraagt een particulier/ZZP'er bunq API-toegang aan?

**Er is geen aanvraag- of goedkeuringsprocedure.** Voor eigen gebruik genereert Sander de sleutel zelf, in de app:

1. bunq-app openen
2. Instellingen
3. Kopje **Developers**
4. **API keys**
5. **Add an API key**

**Confidence: High** (primaire bron `doc.bunq.com/basics/authentication/api-keys`). Een gelekte sleutel kan vanuit dezelfde plek weer ingetrokken worden.

**Beperkingen per accounttype:**

- **Abonnementseis: bunq Pro of bunq Elite** (persoonlijk én zakelijk). Free en Core hebben geen API-toegang. **Confidence: Medium** — dit komt uit een samenvatting van bunq's eigen plan-/developerspagina's; ik kon het niet woord-voor-woord bevestigen op `bunq.com/developers` (die pagina noemt de plan-eis niet expliciet). **Verificatiepunt vóór er iets gebouwd wordt.**
- **PSD2-partijen** volgen een aparte route (eIDAS-certificaat direct bij bunq) en hebben geen toegang tot het gewone developersportaal. Niet van toepassing.
- **Sandbox is gratis en zonder abonnement**: `public-api.sandbox.bunq.com`, dummy-user via `POST /sandbox-user`. Alles kan hier eerst getest worden zonder ook maar één echte euro in beeld.

**Wat we intern al weten (uit het tweede brein, niet uit webonderzoek):**

- De **Gezinshuis-rekening** (Gewoon Thuis) is een gedeelde rekening onder een **bunq Pro**-abonnement — bevestigd door Sander op 2026-07-05, vastgelegd in [[bunq]]. De plan-eis is daar dus al gehaald.
- Voor **Sanders eigen ZZP-rekening (Gewoon Sander)** staat het bunq-abonnement nergens in het tweede brein vastgelegd. **Open vraag aan Sander**, geen aanname.
- In `Team Knowledge/.env` staan **nul** `BUNQ_*`-sleutels. Er is dus vandaag geen enkele bestaande bunq-koppeling. (Alleen sleutelnamen gecontroleerd, geen waarden gelezen.)

---

## 3. Bestaan er kant-en-klare bunq MCP-servers?

### bunq's eigen MCP-servers — allebei niet wat we nodig hebben

| Server | Wat het is | Bruikbaar voor saldo/transacties? |
|---|---|---|
| **Documents MCP** (`https://doc.bunq.com/~gitbook/mcp`) | Officieel. De API-**documentatie** als MCP-server. | **Nee** — alleen documentatie, geen bankdata. Wel risicoloos en direct bruikbaar als naslagwerk tijdens een eventuele bouw. |
| **bunq/partner-mcp** | Officieel, 41 tools. Voor de **Partner API**: partner-onboarding, KYC, provisioning, compliance. | **Nee** — ander product, andere doelgroep, vereist een partner-API-key die bunq uitgeeft. Niet van toepassing op een eenmanszaak. |

### Third-party MCP-servers — beide schrijf-capabel

| Server | Auth | Tools | Onderhoud | Read-only? |
|---|---|---|---|---|
| **WilcoKruijer/bunq-mcp** | OAuth + API-key | 8: `bunqAccounts`, `getTransactions`, `getRequestInquiries`, `getPaymentAutoAllocates`, `getTopCounterparties`, **`createPaymentRequest`**, **`createDraftPayment`**, **`createPayment`** | MIT, ~12 sterren, Cloudflare Workers, recente commits | **Nee** — 3 schrijf-tools |
| **ErfanMomeniii/bunq-mcp** (npm: `bunq-mcp-server`) | API-key | 14 tools: profiel, rekeningen, betalingsgeschiedenis, kaarttransacties, events, betaalverzoeken + **betalingen versturen, draft-payments, betaalverzoeken aanmaken** | MIT, TypeScript/Node 20+, **0 sterren, 1 fork**, recente commits | **Nee** — schrijf-tools aanwezig |

De tweede claimt wel nette hygiëne (*"API keys and tokens are never logged — stdout is reserved for MCP protocol"*, RSA-SHA256 signing, restrictieve bestandsrechten) — dat is een goed teken, maar het is een claim uit een README, geen audit.

**Antwoord op de onderzoeksvraag: er bestaat geen kant-en-klare, alleen-lezen bunq MCP-server.** Elke bestaande optie brengt een betaal-oppervlak mee, en het gaat om projecten met vrijwel geen community-adoptie waar Sanders bankrekening doorheen zou lopen. Ik zou geen van beide ongewijzigd op een productie-bankkey zetten.

### Is een custom MCP-server haalbaar?

Ja, technisch prima — en de zware laag hoeft niet twee keer gebouwd te worden.

**Wat het zou inhouden (scope-schets, geen bouwplan):**

- **Auth-laag:** RSA-keypair genereren, `POST /installation` → `POST /device-server` → `POST /session-server`, sessie-verversing, en per-request signing. Dit is het enige echt lastige stuk. Het is identiek aan wat de Cockpit-connector uit het juli-ontwerp ook nodig heeft — dus één keer bouwen, twee keer gebruiken.
- **Precies twee tools, allebei GET:**
  - `bunq_list_accounts` → `GET /user/{userID}/monetary-account`
  - `bunq_list_transactions` → `GET /user/{userID}/monetary-account/{id}/payment`
- **Harde endpoint-allowlist** in code: elke URL die niet op de lijst staat wordt geweigerd vóór de HTTP-call, niet erna.
- **Geen enkele POST/PUT/DELETE naar bunq** behalve de drie onvermijdelijke auth-calls hierboven.

Dat is een klein, auditeerbaar oppervlak — precies wat Argus kan nalopen.

---

## 4. Beveiligingsoverwegingen voor een bankkoppeling

### Rate limits — geactualiseerd, oude notitie klopt niet meer

Het juli-ontwerp noteerde "3 GET/3s per IP/endpoint". **Dat cijfer is achterhaald.** De huidige documentatie werkt met categorieën:

| Categorie | Limiet |
|---|---|
| Payment processing | tot 1.000 requests/seconde |
| Standaard data-endpoints | 70–140 requests/30 seconden |
| Security-gevoelige acties | 3 requests/60 seconden |
| **Setup/installation-endpoints** | **zo laag als 10 requests/dag** |

Overschrijding → HTTP 429, met de exacte limiet in de foutmelding. Limieten worden per device geteld (API-key, sessie of IP), met een rollend venster.

> **Dit is het belangrijkste operationele risico van de MCP-route.** MCP-servers worden door de client gestart en gestopt — soms meerdere keren per sessie. Een implementatie die bij elke start opnieuw `installation` + `device-server` aanroept, loopt tegen **10 calls per dag** aan en sluit zichzelf buiten. Sessie-hergebruik met persistente installation-token is dus geen optimalisatie maar een **harde functionele eis**. Beide third-party servers claimen dit op te lossen ("credentials persisted locally so you don't re-register on every restart") — dat is precies het punt dat geverifieerd moet worden.

### IP-whitelisting — een echte, bruikbare hardening

bunq bindt een API-key aan toegestane IP-adressen (`permitted_ips` bij device-server-registratie; beheer daarna via `credential-password-ip`).

- Het IP waarvandaan je registreert wordt automatisch op ACTIVE gezet.
- IP's kunnen niet gewijzigd worden — je zet het oude op INACTIVE en voegt een nieuw toe.
- De wildcard `*` schakelt IP-filtering volledig uit. Die kan **alleen via de bunq-app** gezet worden, bewust niet via de API, *"to prevent accidental security risks through API misuse."* Je kunt binnen een bestaande device-server ook niet alsnog van concrete IP's naar wildcard schakelen.
- bunq's eigen advies: vermijd de wildcard tenzij absoluut noodzakelijk.

**Praktisch aandachtspunt:** een thuisaansluiting heeft doorgaans een dynamisch IP. Verandert Sanders IP, dan valt de koppeling stil tot het nieuwe IP is toegevoegd. Dat is een operationele procedure die vóóraf bedacht moet worden — niet iets om achteraf tegenaan te lopen. Het is nadrukkelijk géén reden om de wildcard te gebruiken.

### Request signing en sleutelopslag

- Elke request wordt client-side ondertekend met een RSA private key. Die private key is dus een **tweede geheim** naast de API-key, en moet ook ergens op schijf staan.
- Voorgesteld patroon (conform het bestaande Cockpit-contract): API-key, private key (base64) en installation-token in `Team Knowledge/.env` (0600, gitignored), uitsluitend bij naam opgehaald via `readEnvKey(...)`, nooit gelogd, nooit in een route-response, nooit in een foutmelding. Sessie-token **alleen in procesgeheugen**, nooit naar schijf.
- Revocatieprocedure vóóraf vastleggen: waar en hoe trekt Sander de sleutel in als er iets misgaat (bunq-app → Developers → API keys).

### Het MCP-specifieke risico dat een Cockpit-connector níét heeft

Dit is het argument dat ik het zwaarst weeg, en het is niet vanzelfsprekend:

**Een MCP-server geeft het taalmodel rechtstreeks toegang tot de tools.** Bij een Cockpit-connector haalt server-side code de data op en levert een samenvatting; het model kan niets anders aanroepen dan wat de route teruggeeft. Bij MCP kan het model elke geregistreerde tool aanroepen, in elke volgorde, op basis van tekst die het onderweg leest.

En bankdata bevat door **derden bestuurbare tekst**: de omschrijving van een binnenkomende transactie wordt geschreven door degene die het geld stuurt. Iemand kan € 0,01 overmaken met een omschrijving die een instructie aan een AI-agent bevat. Staat er ook maar één schrijf-tool geregistreerd, dan is dat een reëel prompt-injectie-pad naar een betaalfunctie.

**Daarom: als er ooit een bunq-MCP komt, mag daar geen enkele schrijf-tool in zitten. Niet uitgeschakeld, niet achter een vlag — gewoon niet geïmplementeerd.**

### Cockpit-context

- **LAN-mode:** de Cockpit draait standaard op loopback (127.0.0.1:4317) met PIN-gated LAN-mode. Zet Sander LAN-mode aan, dan is zijn banksaldo zichtbaar voor elk apparaat op het netwerk dat de PIN heeft — een andere impact dan een openstaande takenlijst.
- **Licentie-disclaimer:** `server/connectors/README.md` opent met een expliciete waarschuwing dat finance-/bankconnectors een niet-ondersteund voorbeeld zijn, "at your own risk", zonder garantie of aansprakelijkheid van myICOR. Relevant voor de besluitvorming, niet blokkerend.

### Checklist voor Argus

1. Verifieer dat de module/server **nul** POST/PUT/PATCH/DELETE naar bunq bevat, behalve `installation`, `device-server` en `session-server`.
2. Verifieer de endpoint-allowlist: wordt een niet-toegestane URL geweigerd vóór de HTTP-call?
3. Verifieer dat geen enkele sleutel, private key of sessie-token in een log, route-response, foutmelding of commit terechtkomt (`maskSecret`-discipline).
4. Verifieer dat de sessie herbruikt wordt en device-registratie niet per start opnieuw gebeurt (10/dag-limiet).
5. Verifieer dat `permitted_ips` concrete IP's bevat en géén wildcard `*`.
6. Verifieer 429-afhandeling met exponentiële backoff, en calme degradatie (`{ available: false }`) i.p.v. een crash.
7. Verifieer `.env`-rechten (0600) en gitignore-dekking.
8. Bij een MCP-variant: verifieer de volledige tool-lijst die het model te zien krijgt, en beoordeel expliciet het prompt-injectie-scenario via transactieomschrijvingen.
9. Beoordeel of de sandbox-fase daadwerkelijk doorlopen is vóór er een productiesleutel in beeld komt.

---

## 5. Hoe past dit in het bestaande Cockpit-connectorpatroon?

### Wat er al ligt

Er bestaat al een uitgewerkt, **nog niet goedgekeurd** ontwerp: [[2026-07-05-bunq-saldo-cockpit-design]] (status: *draft — wacht op goedkeuring*). Dat ontwerp koos Aanpak A:

- `server/connectors/bunq/bunqClient.js` — de auth/signing-laag
- `server/connectors/bunq/bunqBalance.js` — alleen `GET /user/{userID}/monetary-account`, read-only, 60s cache, calme degradatie
- `scripts/setup-bunq.mjs` — eenmalige, interactieve setup
- `web/src/views/hub/BunqBalanceCard.tsx` — Hub-kaart

Bewust **buiten** de connector-registry om, volgens het Open-Invoices-precedent: `catalog.json` is hard getypeerd op `kind: 'task' | 'calendar'`, en een saldo is geen van beide. Dat blijft kloppen — ik heb `catalog.json` opnieuw gecontroleerd en de zes bestaande entries zijn allemaal `task` of `calendar`.

### Wat dit onderzoek daaraan toevoegt

1. De rate limits in dat ontwerp (3 GET/3s) zijn **achterhaald** — zie §4.
2. Het openstaande punt *"API-key-scope verifiëren vóór bouw: nagaan of bunq een read-only-scoped API-key-optie aanbiedt"* is nu **beantwoord: nee**, niet op API-niveau. Wel View-Only op zakelijk rekeningniveau (onbevestigd of dat via API werkt).
3. Datzelfde ontwerp adviseerde zelf al een Argus-audit vóór productie-activatie. Dat advies is nu een harde poort geworden.
4. Het MCP-landschap is nu in kaart: geen bruikbare kant-en-klare optie.

### Drie routes, afgewogen

**Route 1 — MCP-server (wat de vraag oorspronkelijk was).** Dagobert praat rechtstreeks met bunq via MCP.
*Voor:* flexibel, ad-hoc vragen mogelijk ("wat gaf ik vorige maand uit aan X?") zonder dat er een kaart voor gebouwd is.
*Tegen:* grootste aanvalsoppervlak, geen read-only server beschikbaar, prompt-injectie-pad via transactieomschrijvingen, en het 10/dag-installation-limiet maakt de start/stop-levenscyclus van MCP-servers fragiel.

**Route 2 — Cockpit-connector (het bestaande juli-ontwerp).** Server-side read-only module; Dagobert leest de samenvatting die de Cockpit al heeft, niet de bank zelf.
*Voor:* kleinste blast radius, bewezen patroon in deze codebase, geen tool-oppervlak richting het model, connector draait continu (geen herregistratie-probleem).
*Tegen:* alleen wat er is gebouwd is beschikbaar — geen ad-hoc vragen.

**Route 3 — hybride, gefaseerd.** Eerst Route 2 bouwen. Daarna, als de behoefte aan ad-hoc vragen echt blijkt, een dunne zelfgebouwde MCP bovenop diezelfde `bunqClient` met uitsluitend de twee GET-tools uit §3.
*Voor:* de moeilijke auth-laag wordt één keer gebouwd en één keer geaudit; de MCP-stap is daarna klein en apart te beoordelen.
*Tegen:* twee Argus-momenten in plaats van één.

### Mijn aanbeveling

**Route 3, gefaseerd — te beginnen met Route 2.** Redenering: de moeilijke en risicovolle laag (auth, signing, sleutelopslag, IP-whitelist) is in alle drie de routes identiek. Die bouw je dus één keer, in de omgeving met het kleinste aanvalsoppervlak, en laat je daar auditen. De MCP-laag is daarna een dunne schil van twee GET-tools — een aparte, kleine beslissing in plaats van een grote sprong.

De verleiding om meteen `npx bunq-mcp-server` te draaien is begrijpelijk, maar dat betekent: een productie-bankkey met betaalrechten, in een project met 0 sterren, met betaal-tools zichtbaar voor het model. Dat is precies het scenario waar de Argus-poort voor bedoeld is.

### Governance-kanttekening

**"Dagobert Duck" bestaat nog niet als specialist.** In `Team/` staan vijftien specialisten; er is geen financiële rol. Een nieuwe specialist aannemen loopt via **Jethro** en [[SOP-001-how-to-add-a-new-specialist]] — niet via mij. Dat is een aparte stap, los van de technische koppeling, en de koppeling kan er niet op wachten (of andersom).

---

## Openstaande vragen vóór er iets gebouwd wordt

1. **Aan Sander:** op welk bunq-plan zit de Gewoon Sander-rekening? (Pro/Elite vereist; Gezinshuis staat bevestigd op Pro, Gewoon Sander is onbekend.)
2. **Aan Sander:** welke rekening(en) moeten in beeld komen — Gewoon Sander, Gewoon Thuis/Gezinshuis, of allebei? Dat bepaalt of de View-Only-route (zakelijk) überhaupt beschikbaar is.
3. **Te testen in sandbox:** werkt een API-key van een View-Only-genodigd profiel om gedeelde rekeningen uit te lezen? Dit is de aantrekkelijkste beveiligingsroute en volledig onbevestigd.
4. **Te verifiëren:** de Pro/Elite-planeis (Medium confidence, niet woord-voor-woord bevestigd op een officiële pagina).
5. **Operationeel:** hoe gaan we om met een wisselend thuis-IP in de `permitted_ips`-lijst?

---

## Beperkingen van dit onderzoek

- **Eén zoekpad.** Alle bevindingen komen via WebSearch/WebFetch. Voor een financiële/high-stakes vraag hoort daar volgens Athena's protocol een tweede, mechanisch onafhankelijke zoekweg bij (Perplexity). Dat is hier niet gedaan. De kernbevindingen (§1, §2, §4) rusten wel op **primaire bunq-bronnen**, meerdere daarvan dubbel bevestigd.
- **Enkele doc-pagina's gaven een 404** (`developers-portal`, `device-registration`) — de bunq-documentatie is kennelijk recent geherstructureerd. Waar dat gebeurde heb ik teruggevallen op de GitHub-mirror of op zoekresultaat-samenvattingen, en dat expliciet als lagere confidence gemarkeerd.
- **De access-type-enum** (`VIEW_BALANCE` etc.) is **niet** in een primaire bron teruggevonden. Niet als feit behandelen.
- **Geen van de MCP-servers is zelf gedraaid of geïnspecteerd** — de tool-lijsten komen uit hun README's. Dat is een claim, geen verificatie. Bewust: draaien zou credentials of een registratie vereisen, en dat valt buiten deze onderzoeksopdracht.
- **De GitHub-sterrentellingen** zijn een momentopname van vandaag en een grove proxy voor adoptie, niet voor kwaliteit.

---

## Bronnen

**Officiële bunq-documentatie (primair)**
- [OAuth](https://doc.bunq.com/basics/authentication/oauth) — permissielijst
- [bunq/gitbook — basics/oauth.md](https://github.com/bunq/gitbook/blob/master/basics/oauth.md) — bevestiging permissielijst
- [API Keys](https://doc.bunq.com/basics/authentication/api-keys) — aanmaakprocedure + waarschuwingen
- [Rate Limits](https://doc.bunq.com/basics/rate-limits) — geactualiseerde limieten
- [Whitelisting and Updating IP addresses](https://doc.bunq.com/basics/whitelisting-and-updating-ip-addresses)
- [Documents MCP](https://doc.bunq.com/getting-started/tools/documents-mcp)
- [bunq Developers](https://www.bunq.com/developers)
- [Help Center — Shared Access](https://help.bunq.com/articles/what-is-shared-access-and-how-to-use-it)
- [Help Center — Manage access to Business Account](https://help.bunq.com/articles/how-do-i-manage-access-to-my-business-account) — View-Only-rol
- [bunq/doc](https://github.com/bunq/doc)

**MCP-servers**
- [bunq/partner-mcp](https://github.com/bunq/partner-mcp) — officieel, Partner API
- [WilcoKruijer/bunq-mcp](https://github.com/WilcoKruijer/bunq-mcp)
- [ErfanMomeniii/bunq-mcp](https://github.com/ErfanMomeniii/bunq-mcp)

**Intern (tweede brein)**
- [[2026-07-05-bunq-saldo-cockpit-design]] — het bestaande, nog niet goedgekeurde ontwerp
- [[2026-07-05-bonnetjesproces-gezinshuis-onderzoek]] — Athena/Pax, bunq-API-verkenning
- [[2026-08-09-jortt-api-geldstatus-onderzoek]] — het geldstatus/kasoverzicht-precedent
- [[bunq]] — bunq Pro bevestigd op de Gezinshuis-rekening
- `Expansions/mypka-cockpit/server/connectors/` — `catalog.json`, `jorttTasks.js`, `README.md`

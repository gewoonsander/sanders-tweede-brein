# Pocket AI hardware vs. Mac mini for the Albero SOAP workflow

## Executive summary (definitieve conclusie na vier onderzoeksrondes)

**Eindadvies: geen nieuwe hardware kopen.** De definitieve, bevestigde architectuur:

**iPhone 13 (SuperWhisper Pro, Offline-modus, alleen transcriptie) → AirDrop van de tekst naar de Mac mini → een apart lokaal scriptje stuurt de tekst naar Ollama voor de SOAP-verwerking.**

Geen aanschaf, geen nieuwe cloud-leverancier, geen fabrikant-cloud tussen client en dossier. Deze route is bovendien **architecturaal eenvoudiger** dan het oorspronkelijke plan: SuperWhisper's eigen "Custom Model"/AI-Mode-koppeling naar een zelf-gehost model (bijv. Ollama) zit achter de **Enterprise-laag**, niet in het Pro-abonnement dat Sander heeft — bevestigd doordat Sander zelf in de Pro-app geen "Add Custom Model"-optie ziet, ook niet binnen een Custom Mode. Dat sluit aan bij wat het onderzoek al vermoedde op basis van SuperWhisper's eigen documentatie (TLS/publiek-bereikbaar-eis, gedocumenteerd onder "Enterprise"). Het plan is daarom bijgesteld: **niet** SuperWhisper zelf laten doorschakelen naar Ollama, maar SuperWhisper puur voor transcriptie gebruiken (Mac én iPhone) en een eigen, simpel scriptje (buiten SuperWhisper om) de tekst naar Ollama sturen. Daedalus bouwt dit scriptje. Dit verwijdert een afhankelijkheid van een dure/onbeschikbare SuperWhisper-laag en werkt met het abonnement dat Sander al heeft.

Dit verslaat alle drie eerder onderzochte hardware-/apparaat-routes (Tiiny.ai Pocket Lab, Ryzen AI Max mini-PC's/Jetson/Mac Studio, en de AI-recorders Pocket/Plaud) — niet omdat die routes slecht zijn, maar omdat ze allemaal een probleem oplossen dat er niet is, of een nieuwe cloud-afhankelijkheid introduceren die niet nodig is. Zie de vier hoofdstukken hieronder voor de volledige onderbouwing per ronde.

## Key findings

**1. Tiiny.ai is a legitimate, funded campaign — but unproven hardware. (Confidence: High)**
Tiiny AI Inc. is a US-incorporated company (2024) with a team claiming MIT/Stanford/HKUST/SJTU/Intel/Meta backgrounds and one verifiable open-source credential (PowerInfer, ~8K GitHub stars). The Kickstarter launched March 11, 2026 and had raised $3.07M from 2,181 backers by July 2, 2026. ScamAdviser rates the site as legitimate-but-new (61% trust score). This is corroborated independently by Kickstarter's own campaign data, PR coverage (PRNewswire/Yahoo Finance), and a CES 2026 hardware demo (audioXpress). It is not a fraud in the "take-the-money-and-vanish" sense. But: no unit has shipped (est. delivery August 2026), so **no independent post-delivery review exists anywhere** — every source I found is either company marketing, a CES demo, or pre-order speculation. AIdeaFlow's reviewer, after going hands-on with company-provided materials, explicitly concluded: "this is not a proven product," and framed the purchase as "speculative investment, not a confident purchase."

**2. The 80GB RAM headline is misleading, and other spec claims are contested. (Confidence: Medium)**
Per a detailed community teardown on the Level1Techs forum, only 32GB of the advertised 80GB runs at full memory bandwidth; the remaining 48GB connects via a slower PCIe 4x4 link to the NPU — a materially different (weaker) configuration than "80GB unified RAM" implies. The same thread reports an independent calculation that undercuts the marketed "120B parameters" and "100 simultaneous LLMs" claims, and flags that early specs were withheld and released only under community pressure, that sample review units came with editorial-control strings attached, and that several glowing YouTube reviews are undisclosed paid placements. This is a single deep-dive source, but it's corroborated in spirit by AIdeaFlow (no independent benchmarks exist; near-zero clarity on software/CUDA compatibility given the ARM architecture) — so I treat the "misleading headline spec" finding as Medium confidence rather than Low.

**3. There's also an unrelated phishing risk.** Tiiny AI's own social channels have posted scam alerts about a fraudulent clone of their website — a separate risk (payment/credential phishing) from the legitimacy of the product itself.

**4. Established, shipping alternatives exist in the same price band, with real independent reviews. (Confidence: High)**
- **NVIDIA Jetson Orin Nano Super Dev Kit** — $249, 8GB shared RAM, 67 TOPS. Cheap and from an established vendor, but 8GB is tight even for 8B models — not actually a match for what Tiiny.ai claims to offer, and not a fit for Sander's needs either.
- **AMD Ryzen AI Max+ 395 mini-PCs** (Framework Desktop, GMKtec EVO-X2) — $1,499–$2,299 depending on RAM (64–128GB LPDDR5X) and storage. These genuinely run 70B-class models at usable speed and are reviewed independently by Tom's Hardware, PCWorld, and Phoronix — not just company marketing. This is the credible category leader if Sander ever needs >30B models.
- **Mac Studio** (Apple, M4 Max/Ultra) — starts ~$2,000, scales past $4,000 for very large unified-memory configs (up to 512GB). Well-reviewed, but priced above what this use case justifies.

**5. The Mac mini already on hand is adequate for this workflow. (Confidence: High)**
Multiple independent sources (starmorph.com buying guide, popularai.org, selfhostllm.org) converge: 24GB comfortably runs 7B–14B models at Q4 quantization (roughly 5–9.5GB of RAM used), leaving headroom for macOS and SuperWhisper running concurrently. SOAP-note dictation/structuring is a modest reasoning task well within an 8B–14B model's competence — it does not require the 30B+ tier where the Mac mini's 24GB starts to strain.

## Anti-pattern to avoid

Buying hardware — or leaning on a vendor's paid-tier AI-orchestration layer — to solve a compliance problem that's already solved. The actual requirement (document 217: no client data/behavior to cloud AI) is satisfied the moment inference runs locally via Ollama — it doesn't care whether "locally" means a $1,399 pocket gadget, a Mac mini, or a dedicated recorder's own cloud-connected AI stack. A dedicated device only becomes worth its cost when (a) Sander wants to run models above ~30B parameters routinely, or (b) he needs a machine physically separate from — and not competing for resources with — his daily-driver Mac mini. Neither condition applies today. And, as this research chain shows, chasing a vendor's built-in "AI Mode" integration (SuperWhisper Enterprise) when a simpler DIY script achieves the same result with the subscription already owned is its own version of the same anti-pattern.

## Recommendation (definitief)

**De architectuur om te bouwen:**

1. **iPhone 13, SuperWhisper Pro, Offline-modus, geen AI Mode actief** — puur lokale transcriptie tijdens het cliëntgesprek. Audio verlaat het toestel niet.
2. **AirDrop** de resulterende tekst naar de Mac mini (apparaat-naar-apparaat, geen Apple-cloud-tussenstop — sterker dan Bestanden-app/iCloud-sync).
3. **Een apart lokaal scriptje op de Mac mini** (buiten SuperWhisper's eigen AI-Mode-systeem om, want dat vereist het Enterprise-abonnement dat Sander niet heeft) stuurt de tekst naar een lokaal Ollama-model voor de SOAP-verwerking. Daedalus bouwt dit scriptje.

Dit kost niets, voegt geen enkele nieuwe cloud-leverancier toe, en is eenvoudiger dan het oorspronkelijke "SuperWhisper Custom Model → Ollama"-plan omdat het geen afhankelijkheid heeft van een Enterprise-laag die Sander niet heeft en niet nodig hoeft te hebben.

**Als latere uitbreiding ooit nodig is** (routinematig >30B-modellen, of een apparaat los van de Mac mini): **Framework Desktop of GMKtec EVO-X2 met 64–128GB RAM** (~$1.500–$2.300) — gevestigd, onafhankelijk gereviewd. Niet Tiiny.ai; niet Pocket of Plaud voor de AI-verwerkingsstap; niet SuperWhisper Enterprise voor de orchestratiestap.

## Methodology & limitations

Searched via web search and direct source fetches: Tiiny.ai/Kickstarter campaign page (blocked by 403, worked around via secondary coverage), ScamAdviser, Level1Techs forum thread, AIdeaFlow review, audioXpress CES coverage, PRNewswire/Yahoo Finance funding coverage, NVIDIA official product pages, Tom's Hardware/PCWorld/Phoronix reviews of Ryzen AI Max mini-PCs, and independent local-LLM sizing guides for Mac mini. Not verified independently: the exact bandwidth-split technical claim (relied on one forum's stated calculation, not re-derived from primary silicon specs) — flagged as Medium confidence above. No independent post-delivery review of a Tiiny.ai unit exists yet anywhere, by definition (product hasn't shipped) — this is a hard limitation, not a gap in my search.

---

## Vervolgvraag (ronde 2): draagbare AI-recorders — heypocket.com "Pocket" en Plaud Note Pro

Sander wil geen vast toestel bij de Mac mini, maar een draagbare recorder voor onderweg (cliëntgesprekken), die daarna lokaal syncht met de Mac mini voor transcriptie/SOAP via Ollama. Twee genoemde kandidaten uitgezocht tegen het kernvereiste van document 217: geen cliëntgegevens/gedrag naar cloud-AI.

### Kernconclusie

**Geen van beide apparaten past ongewijzigd binnen een 100%-lokale, no-cloud-AI-workflow.** Bij beide is transcriptie/AI-verwerking standaard een cloud-stap, uitgevoerd door de fabrikant én — bij Pocket — doorgestuurd naar externe modelaanbieders (GPT-5, Claude, Gemini). Plaud biedt wél een realistische workaround (hieronder); Pocket biedt die niet of nauwelijks.

### Bevinding 1 — Pocket (heypocket.com): audio-opname lokaal, transcriptie verplicht via cloud + externe AI-modellen. (Confidence: High)

Pocket neemt audio lokaal op (64GB onboard opslag, werkt offline) en synct pas zodra de telefoon verbinding heeft en de app geopend wordt. Vanaf dat moment gaat de audio naar Pocket's eigen cloud voor transcriptie, en de samenvatting wordt gegenereerd door modellen die Pocket zelf noemt: "GPT-5, Claude, Gemini, and more." Dit is bevestigd door drie onafhankelijke bronnen die elkaar bevestigen: (a) Pocket's eigen productpagina en privacybeleid (noemt expliciet vendors voor "transcription/AI processing"), (b) een onafhankelijke blogvergelijking (heidihealth.com: "the audio uploads to Pocket's cloud for transcription... transcription processing is cloud-based rather than fully on-device"), en (c) de community-forumdiscussie op community.heypocket.com, waar gebruikers geen enkel lokaal-verwerkingsalternatief kunnen aanwijzen ondanks expliciete vraag daarnaar. Er is geen zichtbare instelling om alleen op te nemen en nooit te synchroniseren — sync lijkt ingebakken in de kernworkflow zodra de app open staat. Geen USB/SD-kaart-exportpad naar de Mac mini gevonden.

### Bevinding 2 — Plaud Note Pro: zelfde cloud-verplichting voor transcriptie, maar met een bruikbare workaround. (Confidence: High voor cloud-verplichting; Medium voor de workaround)

Ook bij Plaud geldt: "Transcription and AI features require an internet connection as they run in the cloud" (Plaud's eigen FAQ), met modellen als GPT-5.5, Gemini 3.1 Pro en Claude Sonnet 4.6 achter de schermen. Dit is bevestigd door zowel Plaud's officiële supportpagina's als een onafhankelijke reviewsamenvatting (mightygadget.com). Twee dingen maken Plaud wel een serieuzere kandidaat dan Pocket:

- **"Private Cloud Sync"-instelling:** staat deze uit, dan wordt audio na verwerking direct uit de cloud verwijderd zodra het resultaat terug is op de telefoon — data blijft niet permanent bij Plaud staan. Dit vermindert het bewaarrisico, maar audio gaat nog steeds ván het apparaat náár Plaud's servers voor de verwerking zelf — dat is nog steeds "cliëntgegevens naar cloud-AI" in de zin van document 217, ook al is de bewaartermijn nul.
- **Mogelijke opname-only modus + lokale export:** Plaud's FAQ vermeldt een "fully local mode where audio is never uploaded, for users who need to keep everything on the device" — maar geeft geen details over hoe deze te activeren is of wat er dan nog wél werkt (vermoedelijk: alleen opnemen, geen transcriptie/samenvatting via Plaud). Los daarvan bevestigt Plaud's eigen supportdocumentatie dat ruwe audio te exporteren is als MP3/WAV via de app, en voor het oorspronkelijke Plaud Note-model bestaat een "Access via USB"-instelling waarmee bestanden direct van het apparaat gekopieerd kunnen worden (NOTES/CALLS-mappen) zonder de cloud. Voor de nieuwere **Note Pro specifiek** kon ik dit USB-mechanisme niet bevestigen — meerdere bronnen zijn hier onduidelijk of tegenstrijdig, dus dit is een open vraag.

**Praktisch betekent dit:** Plaud zou mogelijk te gebruiken zijn als "domme" recorder — opnemen, nooit door Plaud laten transcriberen, ruwe audio er lokaal afhalen (via export of, onbevestigd voor de Pro, USB) en die vervolgens lokaal op de Mac mini door Whisper/Ollama laten verwerken. Dat is dan geen gebruik van Plaud's AI-features, puur van de opname-hardware en microfoons.

### Bevinding 3 — Privacybeleid en bewaring. (Confidence: Medium, beide kanten)

- **Pocket:** stelt SOC 2 Type I/II en HIPAA-conformiteit te hebben, data op AWS Ohio (VS), end-to-end encryptie. Geen concrete bewaartermijn voor audio gevonden in het beleid zelf. Data wordt gedeeld met vendors voor "transcription/AI processing" — een expliciete bevestiging dat cliëntaudio bij derden terechtkomt.
- **Plaud:** claimt volledige GDPR-conformiteit, EU/EER-data blijft op AWS Frankfurt (niet naar de VS), ISO 27001/27701, SOC 2 Type II, HIPAA, EN 18031-certificeringen, en een "zero-training-by-default" garantie (audio wordt niet gebruikt om AI-modellen te trainen tenzij de gebruiker daar expliciet voor kiest). Dit is een aanmerkelijk sterker en specifieker privacyprofiel dan Pocket's, bevestigd door zowel Plaud's eigen Trust Center als een onafhankelijk persbericht over hun GDPR-certificering.

Beide claims komen vooralsnog primair van de fabrikanten zelf (geen onafhankelijke audit-rapporten gevonden die ik kon inzien) — vandaar Medium in plaats van High.

### Bevinding 4 — "Handshake" met de Mac mini zonder cloud-tussenstop. (Confidence: Medium)

Voor **geen van beide** apparaten bestaat een gedocumenteerd rechtstreeks lokaal syncmechanisme (bijv. lokale Bluetooth-bestandsoverdracht of Wi-Fi-Direct naar een computer) dat de transcriptiestap overslaat. Bij Pocket loopt alles altijd via telefoon-app-cloud. Bij Plaud loopt de standaardflow ook via telefoon-app-cloud; alleen de MP3/WAV-exportfunctie (en mogelijk USB bij oudere modellen) omzeilt dit, maar dat is een handmatige bestandsoverdracht, geen geautomatiseerde "handshake."

### Eindconclusie per apparaat

| | Pocket (heypocket.com) | Plaud Note Pro |
|---|---|---|
| Lokale opname | Ja | Ja |
| Transcriptie/AI verplicht via cloud? | Ja, altijd, inclusief doorsturen naar GPT-5/Claude/Gemini | Ja, in de standaardflow; mogelijk te vermijden door Plaud's AI-features simpelweg niet te gebruiken |
| Ruwe audio lokaal ophalen zonder cloud | Niet gevonden | Ja, via app-export (MP3/WAV); USB-mass-storage onbevestigd voor Note Pro |
| Bewaarrisico bij fabrikant | Onduidelijke bewaartermijn, VS-hosting | Beter: EU-hosting, zero-training-default, optionele directe verwijdering na verwerking |
| Past binnen 100%-lokale no-cloud-AI workflow? | **Nee** | **Niet standaard — wel mogelijk als je het puur als recorder gebruikt en Plaud's eigen AI-features negeert** |

**Advies uit ronde 2:** Pocket afraden. Plaud Note Pro was op dat moment de betere kandidaat van de twee — maar zie ronde 3/4 hieronder: er is een optie die beide overbodig maakt.

### Open vragen uit ronde 2

1. Heeft de Plaud Note Pro (in tegenstelling tot het oorspronkelijke Plaud Note) een USB-mass-storage-modus voor rechtstreekse bestandsoverdracht?
2. Wat doet de "fully local mode where audio is never uploaded" uit Plaud's FAQ precies — is dat puur opname-only, of blijft er toch enige app-cloud-interactie nodig om het bestand te ontsluiten?
3. Staat er in Plaud's DPA/verwerkersovereenkomst een clausule die relevant is voor de zorgcontext (subverwerkers, AVG-grondslag voor gezondheidsdata) — dit vereist een aparte juridische toets, niet alleen productonderzoek.

---

## Vervolgvraag (ronde 3): iPhone 13 + SuperWhisper (al in bezit) → AirDrop → Mac mini + Ollama

Sander wees erop dat hij zijn iPhone 13 al heeft en daar SuperWhisper al primair op gebruikt. Voorgestelde workflow: iPhone doet alleen lokale transcriptie, tekst gaat via Bestanden-app/AirDrop/iCloud naar de Mac mini, waar Ollama de SOAP-verwerking doet.

### Kernconclusie

**Dit is de sterkste optie die tot nu toe is onderzocht** — geen aanschaf, geen nieuwe cloud-leverancier, en (met één instelling-voorbehoud) een aantoonbaar lokale transcriptiestap op het apparaat dat Sander toch al bij zich heeft tijdens cliëntgesprekken. Wel waren er bij dit onderzoek twee punten die vóór definitieve vastlegging als protocol geverifieerd moesten worden. Zie ronde 4 hieronder — punt 2 is inmiddels opgelost.

### Bevinding 1 — Offline transcriptie op iOS: bevestigd, met één nuance. (Confidence: High voor de kernclaim; Medium voor de nuance)

SuperWhisper's eigen iOS-pagina's zijn hier eenduidig: *"On-device models work without cell service or wifi. Your audio stays on your phone"* en *"It runs the same class of speech models directly on your Mac, Windows PC, or iPhone."* Dit is een directe, expliciete bevestiging dat audio bij offline transcriptie het toestel niet verlaat — in lijn met wat Hermes al vond.

**Nuance gevonden:** minstens één secundaire bron (max-productive.ai) stelt juist dat "iOS currently relies on cloud models" en dat on-device verwerking vooral sterk is op macOS. Na vergelijking met de primaire SuperWhisper-pagina's is de meest waarschijnlijke verklaring dat dit twee verschillende lagen door elkaar haalt: de **kale spraak-naar-tekst-stap** (Whisper) draait wel degelijk on-device op iPhone (bevestigd door de fabrikant zelf, specifiek op de iOS-pagina, niet alleen marketing-homepage), maar de **"AI Modes"** (extra LLM-laag die tekst herformatteert/opmaakt, los van de transcriptie) lijken op iOS vaker cloud-modellen te gebruiken dan op de Mac. Dit is niet met zekerheid vastgesteld — ik kon geen bron vinden die dit onderscheid expliciet zo benoemt — maar het is de enige interpretatie die de tegenstrijdigheid verklaart.

**Praktische consequentie:** Sander moet op de iPhone-app expliciet **"Offline"** transcriptiemodus instellen én **geen "AI Mode"** selecteren die herformattering/samenvatting op de telefoon zelf doet — puur ruwe dictatie. Zodra hij een AI Mode aanzet op de telefoon, is niet met zekerheid te zeggen of die stap lokaal blijft. Dit is te verifiëren door tijdens het dictaat de telefoon in vliegtuigmodus te zetten: werkt de transcriptie dan nog, dan is bevestigd dat er geen cloud bij betrokken is. In de definitieve architectuur (ronde 4) is dit sowieso geen punt van zorg meer, want de iPhone gebruikt alléén de kale transcriptie, geen AI Mode.

### Bevinding 2 — SOC2/HIPAA-claim: tegenstrijdig bevestigd, en grotendeels niet relevant voor de AVG-context. (Confidence: Low/Medium — bewust niet gekozen tussen de bronnen)

Twee bronnen spreken elkaar hier rechtstreeks tegen:

- **SuperWhisper zelf** (superwhisper.com/for-enterprise en hun trust-center op trust.mycroft.io/superwhisper) claimt: "SOC 2 Type II certified," "HIPAA compliant," met een SOC 2 Type 2-rapport gedateerd 3 maart 2026. Mycroft.io is een trust-center-platform dat certificeringen host namens het bedrijf — geen onafhankelijke auditor, dus dit telt als eerste-partij-bron, niet als onafhankelijke bevestiging.
- **Een onafhankelijke review** (getvoibe.com) stelt het tegenovergestelde: *"Superwhisper holds no SOC 2, HIPAA, or ISO 27001 attestation"* en *"Superwhisper does not sign Business Associate Agreements (BAAs)"* — met de conclusie dat SuperWhisper daarmee **niet geschikt is voor HIPAA-gereguleerd werk, ongeacht de gebruikte modus**, omdat een BAA een harde vereiste is naast eventuele certificering.

Ik kan dit met de beschikbare bronnen niet sluitend beslechten — mogelijk is de HIPAA/SOC2-claim recent (rapport gedateerd maart 2026) en was de onafhankelijke review daarvóór geschreven, of — en dit wordt door ronde 4 bevestigd als de waarschijnlijkste verklaring — is de claim beperkt tot het **Enterprise-abonnement** (de eigen pagina presenteert HIPAA-compliance namelijk expliciet als Enterprise-feature). **Belangrijker: HIPAA is Amerikaanse wetgeving en niet één-op-één vertaalbaar naar de AVG/Nederlandse zorgcontext** — zelfs als de claim klopt, zegt een HIPAA-certificering niets rechtstreeks over AVG-conformiteit of over wat document 217 vereist. Wat voor document 217 daadwerkelijk telt, is niet SuperWhisper's Amerikaanse compliance-label, maar de technische vraag of audio het toestel verlaat — en dat is, los van de SOC2/HIPAA-discussie, apart bevestigd (zie Bevinding 1).

### Bevinding 3 — "Custom Models" (de Ollama-koppeling) vereist mogelijk een publiek bereikbaar, TLS-beveiligd eindpunt — inmiddels bevestigd als Enterprise-only. (Confidence was Medium — nu High, zie ronde 4)

SuperWhisper's eigen documentatie voor zelf-gehoste/Custom Models (superwhisper.com/docs/enterprise/models) stelt drie harde eisen aan een eigen model-eindpunt: *"The endpoint must be publicly reachable from the user's machine"*, *"TLS is required. HTTP-only endpoints won't connect,"* en het moet het `/chat/completions`-formaat spreken. Deze eisen staan gedocumenteerd onder de Enterprise-sectie. Ronde 4 bevestigt: dit is inderdaad een Enterprise-only feature, niet beschikbaar in het Pro-abonnement dat Sander heeft.

---

## Vervolgvraag (ronde 4, definitief): SuperWhisper Pro bevestigd — geen Custom Models beschikbaar

Sander heeft zelf in zijn SuperWhisper Pro-app gecontroleerd: nergens is een "Add Custom Model"-optie te vinden, ook niet binnen een Custom Mode. Dit bevestigt rechtstreeks — met de sterkst mogelijke bron, namelijk Sanders eigen account — het vermoeden uit ronde 3, Bevinding 3: **Custom Models zit achter de Enterprise-laag, niet in Pro.** (Confidence: High — eerste-partij bevestiging via direct accountonderzoek, consistent met SuperWhisper's eigen documentatiestructuur die de functie alleen onder "Enterprise" beschrijft.)

### Consequentie voor de architectuur

Het oorspronkelijke plan (SuperWhisper's eigen AI-Mode-systeem laten doorschakelen naar een lokale Ollama-server) is **niet uitvoerbaar op het Pro-abonnement**. Twee opties stonden open: upgraden naar Enterprise (kosten en aanschaftraject onbekend, waarschijnlijk niet in verhouding tot een ZZP-praktijk), of de orchestratie zelf bouwen. De tweede optie is gekozen: **SuperWhisper wordt uitsluitend gebruikt voor transcriptie (op iPhone én Mac), en een apart, simpel lokaal scriptje — buiten SuperWhisper om — stuurt de getranscribeerde tekst naar Ollama.** Dit is technisch eenvoudiger dan de oorspronkelijke opzet (geen afhankelijkheid van SuperWhisper's interne AI-Mode-routering, geen TLS/publiek-eindpunt-vereiste om mee te worstelen) en kost niets extra. Daedalus bouwt dit scriptje parallel aan dit onderzoek.

### Beoordeling: definitieve vergelijking

| Criterium | Tiiny.ai | Ryzen mini-PC | Pocket | Plaud Note Pro | **iPhone + AirDrop + eigen script + Ollama** |
|---|---|---|---|---|---|
| Extra kosten | $1.399 (onbewezen) | $1.500–$2.300 | ~$200–300 | ~$159–200 | **$0 — al in bezit, geen abonnement-upgrade nodig** |
| Cloud-AI-stap onvermijdelijk? | N.v.t. | N.v.t. | Ja, altijd | Ja, tenzij workaround | **Nee — transcriptie lokaal, orchestratie via eigen script** |
| Afhankelijk van dure/onbeschikbare laag | N.v.t. | Nee | N.v.t. | N.v.t. | **Nee — Enterprise-afhankelijkheid juist vermeden** |
| Bewijslast/onafhankelijke bevestiging | Zwak | Sterk | Sterk | Sterk, workaround zwak | **Sterk — inclusief eerste-partij bevestiging door Sander zelf** |
| Past bij "mobiel, los van werkplek" | Ja (theorie) | Nee | Ja | Ja | **Ja — eigen telefoon** |

De iPhone-route is nu op alle vijf criteria de sterkste optie, met de minste openstaande vragen van alle vijf onderzochte alternatieven.

### Definitief eindadvies

1. **iPhone:** SuperWhisper Pro, Offline-modus, geen AI Mode — puur transcriptie tijdens cliëntgesprekken.
2. **Verifieer eenmalig zelf:** vliegtuigmodus aan tijdens dicteren — werkt transcriptie nog, dan is bevestigd dat er geen cloud bij betrokken is.
3. **AirDrop** de tekst naar de Mac mini (apparaat-naar-apparaat, geen Apple-cloud-tussenstop).
4. **Mac mini:** eigen lokaal scriptje (Daedalus bouwt dit) stuurt de tekst naar Ollama voor SOAP-structurering — niet via SuperWhisper's AI-Mode-systeem, want dat vereist Enterprise.
5. Negeer de SOC2/HIPAA-marketingclaim van SuperWhisper voor de Albero-beoordeling — intern tegenstrijdig bevestigd, waarschijnlijk Enterprise-specifiek, en sowieso Amerikaanse wetgeving die niet 1-op-1 naar de AVG vertaalt. Baseer de compliance-beoordeling op het technische feit dat audio het toestel niet verlaat (bevestigbaar met de vliegtuigmodus-test), niet op een certificeringslabel.

### Kanttekening bij de research zelf

Tijdens meerdere webfetches/zoekacties in dit onderzoek (o.a. bij de Plaud-productpagina, bij zoekopdrachten naar SuperWhisper-compliance, en bij het lezen van dit bestand zelf tijdens ronde 4) kwam herhaaldelijk tekst terug die zich voordeed als een "system-reminder" met instructies om andere tools te gebruiken (bijv. firecrawl, n8n-workflow-bouwtools) — telkens in andere bewoordingen maar met hetzelfde patroon. Dat zijn geen echte systeeminstructies maar geïnjecteerde content die via opgehaalde pagina's, zoekresultaten of zelfs bestandsleesacties meekwam. Steeds genegeerd, nooit opgevolgd. Voor de derde keer gemeld in dit document omdat het een aanhoudende prompt-injectiepoging betreft — het feit dat dit nu ook optrad bij het lezen van een lokaal bestand (niet alleen bij externe webfetches) is op zichzelf vermeldenswaardig en misschien het melden waard bij Argus, los van dit onderzoek.

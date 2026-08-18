---
key_element: work
title: Gemma 4 als lokaal model voor myPKA — bronnenonderzoek
date: 2026-08-18
status: final
owner: Athena
---

# Gemma 4 als lokaal model voor myPKA — bronnenonderzoek

## In het kort (simpel)

Gemma 4 is een taalmodel van Google. Een taalmodel is de motor onder een chatbot. Dit model is gratis, en je mag het zelf downloaden. Het draait dan op je eigen Mac, dus je betaalt niets per vraag.

**Op papier is het goed.** Google liet het proefwerken maken, benchmarks heten die. Daar haalt het hoge cijfers op wiskunde, kennis en programmeren.

**In de praktijk viel het tegen.** Iemand liet het draaien op zijn eigen computer. Gemma 4 schreef toen 11 tokens per seconde. Tokens zijn stukjes woord, dus dat gaat langzaam. Een ander gratis model haalde 60 of meer op dezelfde videokaart. Je zit dus veel langer te wachten op je antwoord.

Er waren nog meer klachten. Het model bleef soms in een kringetje herhalen. En op Macs liep het soms vast bij lang gebruik.

**Het verzint ook dingen.** Bij het omzetten van geluid naar tekst maakte het plaatsnamen op. Die plaatsen bestonden niet, en elke keer verzon het weer wat anders.

**Over Nederlands weten we niets.** Niemand heeft Gemma 4 netjes op Nederlands getest. Dat is dus een open vraag, geen sterk of zwak punt.

### Wat betekent dit voor jou

- Gemma 4 kan mij niet vervangen bij het aansturen van het team. Het denkt minder goed mee bij werk met veel stappen.
- Voor licht werk kan het wel. Denk aan sorteren, opmaken en korte samenvattingen. Dat werk komt vaak langs, maar het hoeft niet briljant.
- Je hoeft niets te kopen. Je hebt de Mac mini M4 Pro (24 GB) al staan.
- Stroom kost ongeveer $8–12 per maand als zo'n Mac dag en nacht draait. Jij laat hem niet dag en nacht draaien, dus voor jou is het minder.

### Wat kun je nu doen

- Laat Daedalus het model één keer draaien op de Mac mini M4 Pro. Dan meet je het zelf, en hoef je niemand op zijn woord te geloven.
- Geef Gemma 4 daarna alleen licht werk. Het zware denkwerk blijft bij de betaalde modellen.
- Wil je iets op je telefoon: gebruik de kleine versies E2B en E4B. Die werken zonder internet, en zijn bedoeld voor korte klusjes.

---

## Executive summary

Gemma 4 is een serieus open model — sterke officiële benchmarkcijfers, een royale Apache 2.0-licentie en een MoE-variant die geheugen bespaart — maar op drie punten die voor Sander tellen is het (nog) geen vervanger voor de closed frontier-modellen: de reële inferentiesnelheid viel bij vroege gebruikers fors tegen (12–13× langzamer dan Qwen 3.5 in één gedocumenteerd geval), agentic/tool-gebruik en instructievolging blijven meetbaar achter op complexe taken, en Nederlands is nergens los benchmarkt. Het past wél goed als lokale, gratis laag voor "licht" tier-werk (zie [[2026-08-17-modeltiering-agents-instructie]]) — niet als vervanger van Hermes' orkestratiewerk.

## Bevindingen

### 1. Wat kan het echt (benchmarks)

Google's eigen cijfers staan zowel op de officiële DeepMind-pagina (deepmind.google/models/gemma/gemma-4) als op het officiële Hugging Face-model-card (huggingface.co/google/gemma-4-26B-A4B-it) — twee onafhankelijke Google-eigen bronnen met identieke cijfers. De 31B-variant scoort 85,2% op MMLU Pro, 89,2% op AIME 2026, 84,3% op GPQA Diamond, 80,0% op LiveCodeBench v6, en 1452 Elo op de LMArena-tekstranglijst (aanvankelijk plek #3, boven OpenAI's GPT-OSS-120B). De 26B A4B-variant scoort iets lager (82,6% / 88,3% / 82,3% / 77,1% / 1441 Elo, plek #6). De 12B-variant haalt 77,2% MMLU Pro en circa 74% op HumanEval. Confidence: **Hoog** voor de cijfers zelf (dubbel bevestigd door Google-eigen bronnen), **Laag** voor wat ze in de praktijk betekenen — LMArena is menselijke voorkeursstemming, gevoelig voor toon en stijl, geen directe maat voor redeneerkwaliteit.

Vergeleken met andere open modellen: DeepSeek V4 Pro claimt 80,6% op SWE-Bench Verified en Qwen3.6-27B 77,2%; voor Gemma 4 vond ik geen directe SWE-Bench-score, dus een appels-met-appels codeervergelijking op die specifieke test ontbreekt. Community-rapportage op de LMArena Discord (geciteerd in twee onafhankelijke zoekresultaten, beide terugleidend naar hetzelfde citaat) noemt Gemma 4 "gelijk aan Qwen, als Qwen al niet iets voor ligt" qua kwaliteit, met Qwen 3.5 duidelijk rekenkundig efficiënter. Confidence: **Medium** — anekdotisch, geen benchmarktabel.

Vergeleken met closed frontier-modellen: in generieke (niet-Gemma-specifieke) vergelijkingen leidt GPT-5.4 op coderen (93,1% HumanEval pass@1), Claude Opus 4.6 op genuanceerd redeneren en schrijfkwaliteit, Gemini 3.1 Pro op context en kosten. Eén los artikel schat dat Gemma 4 31B **75–80%** van dezelfde taken in één keer goed doet vergeleken met Claude Opus 4.6, zwakker op genuanceerd redeneren, schrijfkwaliteit en complexe instructievolging. Confidence: **Laag** — één auteur, één informele test, niet gerepliceerd; expliciet als schatting behandelen, niet als feit.

### 2. Waar het beperkt is — inclusief het belangrijkste antipatroon

Het meest waardevolle en meest onderbelichte gegeven uit dit onderzoek: **de kloof tussen benchmark en productie-ervaring.** Eén gedetailleerd artikel (letsdatascience.com) documenteert dat de 26B MoE-variant op dezelfde GPU **11 tokens/seconde** haalde tegenover **60+ tokens/seconde** voor Qwen 3.5 — terwijl de MoE-architectuur (zie punt 4) juist snelheid belooft. De 31B dense-variant deed 18–25 tokens/seconde op twee GPU's. Hetzelfde artikel meldt dat Hugging Face Transformers de architectuur bij lancering niet herkende, PEFT-finetuning stukliep op nieuwe lagen, en dat er rapporten waren van oneindige lussen, jailbreak-kwetsbaarheden en crashes op Mac-hardware bij langdurige belasting. Confidence: **Medium** — het onderliggende Discord-citaat en de kernclaim ("indrukwekkend model, teleurstellende ervaring") kwamen in twee losse zoekresultaten naar voren, maar leiden terug naar dezelfde bron; geen tweede, volledig onafhankelijke meting gevonden. Dit is precies het soort "marketing versus werkelijkheid"-gat dat bij een release van 2 april 2026 plausibel is: tooling loopt vaak weken tot maanden achter op een modelrelease.

Los daarvan, uit twee onafhankelijke bronnen (een praktijktester op LinkedIn en de officiële Hugging Face-discussiepagina onder het 26B-A4B-model-card, getiteld "Please consider addressing factual hallucinations"): het model hallucineert herkenbaar bij audio-naar-tekst (verzonnen plaatsnamen, niet consistent tussen runs) en leunt in RAG-opzetten zwaarder op interne kennis dan op meegegeven context wanneer het denkt het antwoord al te weten. Confidence: **Medium** (twee onafhankelijke meldingen, geen gecontroleerde meting).

Agentic tool-gebruik: Google claimt zelf 86,4% op τ2-bench (retail-scenario) voor de 31B-variant, tegen 6,6% voor Gemma 3 27B — dit cijfer staat zowel op de officiële DeepMind-pagina als in een los artikel. Confidence: **Medium-Hoog** voor het cijfer als vendor-claim, **Laag** voor of dat zich vertaalt naar Hermes' meerstaps-orkestratiewerk — τ2-bench is een gescripte simulatie, geen open-ended multi-agent workflow zoals in dit myPKA.

### 3. Nederlands

Geen enkele bron publiceert een los, gecontroleerd Nederlands-specifiek benchmarkcijfer. Google claimt een verbetering van 11,3% op FLORES-200 (een geaggregeerde meertalige vertaalbenchmark) t.o.v. Gemma 3 — **dit staat op precies één bron** (aiproductivity.ai) en kon elders niet bevestigd worden; behandel als ongeverifieerd. Daarnaast praktijkervaring rond een offline vertaal-app gebouwd op Gemma 4 E2B, en een los citaat dat het model "niet perfect Nederlands spreekt, maar verrassend goed presteert voor een lokaal model." Confidence: **Laag** over de hele linie — geen enkele bron doet een gecontroleerde meting specifiek voor het Nederlands, en er is geen directe vergelijking gevonden tussen Gemma 4 en Claude/GPT/Gemini op Nederlandstalige taken. Dit blijft een open vraag, geen vastgestelde sterkte of zwakte.

### 4. Wat is "26B A4B"

Bevestigd met hoge zekerheid via het officiële Hugging Face-model-card, gecorroboreerd door een onafhankelijk artikel dat dezelfde architectuur in eigen woorden beschrijft: het is een Mixture-of-Experts model met 128 experts plus 1 gedeelde expert, waarvan er 8 per token actief zijn. Totaal geladen in geheugen: 25,2 miljard parameters (afgerond naar "26B" in de naam); actief per forward-pass: 3,8 miljard (afgerond naar "A4B"). Praktisch: het geheugenbeslag wordt bepaald door de 25,2B totale parameters — bij 4-bit-quantisatie circa 13–14 GB volgens één bron — terwijl de rekentijd per token theoretisch aanvoelt als die van een ~4B-model. **Die belofte hield in de praktijk niet stand** bij de vroege gebruikers uit punt 2 (11 tok/s, niet de snelheid van een 4B-model), vermoedelijk omdat MoE-kernels in llama.cpp/MLX bij lancering nog onvolwassen waren — een redelijke inschatting, geen door een bron bevestigde oorzaak. Confidence: **Hoog** voor de architectuurbeschrijving, **Medium** voor de verklaring van de snelheidskloof.

### 5. Kosten

Twee dingen uit elkaar houden. **Eenmalige hardware:** Sander heeft al een Mac mini M4 Pro (24 GB) en een MacBook Air M1 (8 GB) — geen aanschaf nodig om te experimenteren; welke varianten daadwerkelijk passen is Daedalus' hardwareonderzoek. **Lopende kosten:** stroomverbruik voor lokaal draaien is bescheiden — bronnen noemen $8–12/maand (~€7–11) bij 24/7-serverbelasting van een Mac mini M4, wat voor Sanders on-demand gebruikspatroon (niet 24/7 als server) waarschijnlijk een overschatting is; dit is een schatting, geen gemeten waarde. Cloud API-tarieven medio augustus 2026: Claude Sonnet 5 rond $2–3 input / $10–15 output per miljoen tokens, Gemini 3.1 Pro $2/$12, GPT-modellen in vergelijkbare orde; bronnen schatten $70–120/maand bij een gebruikspatroon van enkele honderden queries per dag. Confidence: **Medium** (de tarieven zelf staan op meerdere prijsvergelijkingssites, maar de maandschatting hangt sterk af van het aangenomen gebruikspatroon en is niet Sanders eigen verbruik).

De relevante link naar iets dat al vastligt in dit myPKA: [[2026-08-17-modeltiering-agents-instructie]] beschrijft precies het scenario waar besparing hier zit — niet "vervang alles door Gemma 4", maar een lokaal, gratis model voor "licht" tier-werk (sjabloonwerk, triage, opmaak), waar veel aanroepen tegen weinig toegevoegde waarde per aanroep staan. Bij hoogvolume, lichte taken schaalt cloud-tokenkosten mee met het aantal aanroepen; een lokaal model kost daar na de eerste download vrijwel niets meer per aanroep.

### 6. Mobiel

E2B en E4B zijn gebouwd voor edge/mobiel, met vision-, audio- en tekstinvoer plus function calling, volledig offline. Twee onafhankelijke bronnen noemen vergelijkbare drempels: E2B comfortabel vanaf circa 6 GB RAM (iPhone 13 Pro/Pixel 8 en nieuwer), E4B vanaf circa 8 GB RAM (iPhone 15 Pro/16 en nieuwer, recente Android-vlaggenschepen). Google's eigen QAT-blogpost claimt daarnaast dat de tekst-only E2B-checkpoint (zonder Per-Layer Embeddings) onder de 1 GB geheugen past — dat is het modelbestand zelf bij zware quantisatie, geen totale RAM-behoefte inclusief besturingssysteem en context; de cijfers spreken elkaar dus niet tegen, ze meten iets anders. Confidence: **Medium** — de telefoon-drempelwaarden zijn niet Google-officieel, maar twee onafhankelijke community-bronnen komen op vergelijkbare cijfers uit.

Realistisch gebruik op Sanders telefoon: offline transcriptie, korte samenvattingen, quick-capture-triage zonder verbinding — precies "licht" tier-werk. Niet realistisch: Hermes' orkestratiewerk of Athena's onderzoekswerk zelf, gezien de kwaliteitskloof uit punt 1 en 2.

## Methodologie

WebSearch als primair pad, met directe WebFetch van Google's eigen primaire bronnen (deepmind.google, huggingface.co/google, blog.google) als tweede, mechanisch onafhankelijk pad voor elk cijfer met "hoog" of "medium-hoog" vertrouwen. De Perplexity Sonar-escalatie — het standaard tweede zoekpad uit het Athena-protocol — was in deze sessie niet beschikbaar (geen shell-toegang om het script aan te roepen); dat is een methodologische beperking van deze sessie, geen bewuste keuze. Een groot deel van het "Gemma 4"-web bestaat uit snel na de release verschenen SEO-content (onder meer mindstudio.ai, gemma4all.com, gemma4-ai.com, aurigait.com, techsy.io, covebase.app) van onbekende redactionele kwaliteit; waar een cijfer alleen op zulke sites voorkwam, is dat expliciet laag-vertrouwen gemarkeerd of weggelaten. De arxiv-technical report (2607.02770) kon niet als leesbare tekst opgehaald worden — de PDF kwam als binaire data terug — en is dus niet als bron gebruikt.

## Beperkingen

- Geen enkele bron biedt een gecontroleerde, gepubliceerde Nederlands-specifieke benchmark — punt 3 blijft een open vraag.
- De snelheids- en stabiliteitsklachten (punt 2) komen uit één uitgebreid artikel; geen tweede, volledig onafhankelijke meting met eigen cijfers gevonden, alleen herhaling van hetzelfde Discord-citaat.
- Alle benchmarkcijfers in punt 1 en 4 zijn vendor-gerapporteerd door Google zelf (ook al staan ze op twee Google-eigen pagina's) — geen onafhankelijke reproductie gevonden.
- De Perplexity-escalatie kon niet draaien (zie Methodologie); bij twijfel zou dat pad extra bevestiging of juist tegenspraak kunnen opleveren.
- Hardware-fit op Sanders specifieke Mac mini M4 Pro (24GB) en MacBook Air M1 (8GB) is bewust buiten scope gehouden — dat is Daedalus' onderzoek.

## Aanbevelingen

1. Niet inzetten als vervanger van de huidige closed-model-stack voor Hermes' orkestratiewerk — de kwaliteitskloof op redeneren, instructievolging en agentic werk is reëel, ook al zijn de exacte percentages zacht.
2. Wel overwegen als lokale, gratis laag voor "licht" tier-werk (zie [[2026-08-17-modeltiering-agents-instructie]]) — precies het scenario waar hoogvolume, lage-inzet taken cloud-tokenkosten opstapelen.
3. Voor de telefoon: E2B/E4B zijn geschikt voor offline quick-capture en triage, niet voor onderzoeks- of orkestratiewerk.
4. Voordat er geld of tijd in gaat: laat Daedalus concreet testen of de 26B A4B-variant op de Mac mini M4 Pro (24GB) daadwerkelijk de beloofde snelheid haalt — punt 2 en 4 laten zien dat de theoretische MoE-belofte in vroege praktijktests niet uitkwam.
5. De LLM-onafhankelijkheidseis ([[GL-005-llm-agnostic-portable-core]]) blijft leidend: een lokaal Gemma 4-spoor past daar principieel goed bij, mits de kwaliteit per gekozen tier voldoende is — dat is een aparte toets per taak, geen automatisme.

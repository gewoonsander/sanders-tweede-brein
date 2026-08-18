---
key_element: work
id: 2026-08-18-gemma-4-lokaal-draaien-daedalus
title: "Gemma 4 lokaal draaien en myPKA aansturen — praktijkonderzoek"
owner: daedalus
date: 2026-08-18
type: research-brief
status: final — onderzoek en metingen, geen implementatie
applies_to: "Mac mini (M4 Pro, 24 GB) en MacBook Air (M1, 8 GB)"
related: [2026-08-18-gemma-4-onderzoek-athena, 2026-08-18-gemma-4-onderzoeksverzoek, 2026-08-17-modeltiering-agents-instructie]
---

# Gemma 4 lokaal draaien en myPKA aansturen — praktijkonderzoek

> **Status: ONDERZOEK.** Er is niets geïnstalleerd behalve één embeddingmodel van 274 MB (zie §5.3, expliciet gemeld). Geen Gemma 4-model gedownload. Geen configuratie gewijzigd. Geen service herstart.

Dit stuk beantwoordt de *praktische* kant: draait het, hoe koppel je het, wat levert het op. De inhoudelijke kant — wat het model kan, benchmarks, kwaliteit — staat in [[2026-08-18-gemma-4-onderzoek-athena]]. Waar mijn metingen botsen met haar bronnen, benoem ik dat expliciet.

## Leeswijzer: gemeten, afgeleid, geschat, bron

Ik label elke claim. Dat is geen stijlkeuze maar de eis uit de teamregels.

| Label | Betekenis |
|---|---|
| **[gemeten]** | Ik heb het vandaag zelf uitgevoerd op Sanders hardware. Getal komt uit de output. |
| **[afgeleid]** | Rekenkundig herleid uit een gemeten getal. De rekensom staat erbij. |
| **[geschat]** | Beredeneerd, niet gemeten. Onzekerheidsmarge staat erbij. |
| **[bron]** | Overgenomen uit externe documentatie. Bron staat onderaan. |

---

## Executive summary — het korte antwoord

**Ja, Gemma 4 draait op de Mac mini. Nee, het gaat je tweede brein niet aansturen — niet in de vorm die je nu gebruikt.**

Drie bevindingen die de hele zaak bepalen:

1. **De Mac mini kan het aan, de MacBook Air absoluut niet.** De Air draait op dit moment met **74 MB vrij geheugen en 3.048 MB in de compressor** [gemeten] — hij zit al aan zijn plafond zonder dat er een model draait. Het kleinste Gemma 4-bestand is 6,5 GB. Dat past niet, en gaat ook niet passen.

2. **Tool-calling werkt technisch, maar breekt precies waar myPKA het nodig heeft.** Ik heb de agentic loop echt gedraaid met myPKA-vormige tools. Alle geteste modellen produceren geldige `tool_calls`. Maar zodra ik het aantal tools van 3 naar 25 bracht — een realistisch aantal voor jouw opstelling — ging llama3.1:8b `"done": "True"` (tekst) sturen in plaats van `true` (boolean), en `"18 augustus 2026"` in plaats van `2026-08-18` [gemeten]. Een 3B-model vulde een compleet voedingsschema in met **alleen maar nullen**, netjes schema-conform, en beweerde daarna tegen de tool-output in dat er niets gelogd was [gemeten]. Dat is het gevaarlijkste faalpatroon dat er is: het ziet er goed uit en het valideert, maar het is fout.

3. **Het contextbudget is de echte bottleneck, niet de rekenkracht.** Alleen `AGENTS.md` is **8.482 tokens** en `GL-002-frontmatter-conventions.md` is **10.062 tokens** [gemeten met de tokenizer zelf]. Een agent die het teamcontract, één specialistcontract en één SOP moet vasthouden zit rond de **25.000 tokens vóór er ook maar iets gebeurt** [afgeleid]. Ollama staat standaard op **4.096 tokens** [gemeten] — zes keer te klein. En context is duur: bij llama3.1:8b kostte 131K context **13 GB** tegenover 5,0 GB bij 4K [gemeten].

**Advies in één zin:** zet Gemma 4 in als lokale werkpaardlaag voor afgebakende, verifieerbare taken op de mini (classificatie, samenvatten, embeddings, eerste concepten), en houd de orkestratie en alles wat in `PKM/` schrijft bij een frontier-model. Wat er nu al kapot is aan je lokale opstelling (§5.4) is urgenter dan Gemma 4 erbij zetten.

---

## §0 — Meetopstelling

Alles hieronder is gemeten op **18 augustus 2026**.

**Mac mini** [gemeten]:
- Apple M4 Pro, 8 performance- + 4 efficiency-cores (12 CPU), 16 GPU-cores
- 24.576 MB unified memory
- macOS, 4 dagen aaneengesloten uptime
- 255 GB vrije schijfruimte
- Ollama 0.31.1, draaiend als `brew services`-agent, API op `127.0.0.1:11434`
- `iogpu.wired_limit_mb = 0` (macOS-default, niet handmatig opgehoogd)

**MacBook Air** [gemeten]:
- Apple M1, 8 cores, 8.192 MB unified memory
- **Ollama is hier niet geïnstalleerd** (`which ollama` → niet gevonden)

**Ollama-serviceconfiguratie op de mini** [gemeten, uit `homebrew.mxcl.ollama.plist`]:
```
OLLAMA_FLASH_ATTENTION = 1
OLLAMA_KV_CACHE_TYPE   = q8_0
RunAtLoad, KeepAlive
LimitLoadToSessionType = Aqua
```
Twee dingen vallen op. Ten eerste: flash attention en een 8-bit KV-cache staan **al** aan — de contextkosten die ik hieronder meet zijn dus al de geoptimaliseerde variant, niet het slechtste geval. Ten tweede: `LimitLoadToSessionType = Aqua` betekent dat de service alleen laadt binnen een grafische inlogsessie. Voor "24/7 onbemand" is dat een aandachtspunt — logt er niemand grafisch in, dan draait Ollama niet. Nu is dat geen probleem (er is een sessie actief, 4 dagen uptime), maar het is geen headless-garantie.

**Reeds aanwezige modellen op de mini** [gemeten]: `qwen2.5:14b` (9,0 GB), `llama3.1:8b` (4,9 GB), `llama3.2:3b` (2,0 GB), `llava:7b` (4,7 GB), `llama3.2-vision:11b` (7,8 GB). Samen circa 28 GB schijf.

**Belangrijke nuance bij al mijn snelheidscijfers:** die modellen zijn GGUF en draaien op de `llama-server`-runner [gemeten via `ps`]. De MLX-runner (`mlx_metal_v3`) staat wél geïnstalleerd in Ollama 0.31.1 [gemeten], maar wordt alleen gebruikt voor modellen met een MLX-tag. Mijn gemeten tokens/seconde zijn dus **ondergrenzen** voor wat Gemma 4 met een `-mlx`-tag zou doen.

---

## §1 — Wat past er echt?

### 1.1 De varianten en hun werkelijke omvang

Uit de officiële Gemma 4-modelkaart [bron]:

| Variant | Parameters | Contextvenster |
|---|---|---|
| E2B | 2,3B effectief (5,1B mét embeddings), 35 lagen | 128K |
| E4B | 4,5B effectief (8B mét embeddings), 42 lagen | 128K |
| 12B | 11,95B, 48 lagen | 256K |
| 26B A4B | 25,2B totaal / 3,8B actief (MoE), 30 lagen | 256K |
| 31B | 30,7B, 60 lagen | 256K |

De "E" staat voor *effective*. Gemma 4 gebruikt Per-Layer Embeddings: elke decoderlaag krijgt een eigen kleine embedding per token. Die embeddingtabellen zijn groot maar worden alleen opgezocht, niet doorgerekend [bron]. **Praktische consequentie: E2B en E4B zijn snel maar niet klein.** Het geheugen dat je moet vrijmaken hoort bij 5,1B respectievelijk 8B, niet bij 2,3B en 4,5B. Dat is precies waarom `gemma4:e4b` op Ollama 9,6 GB weegt en `gemma4:12b` maar 7,6 GB — het kleinere model is het grotere bestand.

Downloadgroottes zoals Ollama ze publiceert [bron]:

| Tag | Grootte | Tag (MLX) | Grootte |
|---|---|---|---|
| `gemma4:e2b` | 7,2 GB | `gemma4:e2b-mlx` | 6,5 GB |
| `gemma4:e4b` | 9,6 GB | `gemma4:e4b-mlx` | 8,8 GB |
| `gemma4:12b` | 7,6 GB | `gemma4:12b-mlx` | 7,7 GB |
| `gemma4:26b` | 18 GB | `gemma4:26b-mlx` | 18 GB |
| `gemma4:31b` | 20 GB | `gemma4:31b-mlx` | 19 GB |

### 1.2 De verborgen kostenpost: context

Dit is het onderdeel dat in vrijwel elke "draait Gemma 4 op mijn Mac"-blogpost ontbreekt. Ik heb het gemeten door hetzelfde model op drie contextgroottes te laden en het residente geheugen af te lezen [gemeten, llama3.1:8b, 4,9 GB aan gewichten]:

| Contextvenster | Resident geheugen | Meerkosten t.o.v. gewichten |
|---|---|---|
| 4.096 (default) | 5,0 GB | +0,1 GB |
| 32.768 | 7,0 GB | +2,1 GB |
| 131.072 | 13 GB | +8,1 GB |

Dat is circa **66 KB geheugen per token context** [afgeleid: 8,1 GB ÷ 126.976 tokens], en dat **mét** `q8_0`-KV-cache al ingeschakeld.

**Eerlijkheidsmarge:** dit is gemeten aan llama3.1:8b, niet aan Gemma 4. Gemma 4 gebruikt een 4:1 (E2B) respectievelijk 5:1 lokale-naar-globale attentieverhouding en deelt de KV-cache over lagen (20 van 35 lagen bij E2B, 18 van 42 bij E4B) [bron]. Die architectuur is er expliciet op gebouwd om KV-cache te besparen, dus Gemma 4 zal **goedkoper** zijn dan 66 KB/token. Hoeveel goedkoper weet ik niet — dat is alleen te bepalen door het te meten. Het punt blijft staan: 256K context is geen gratis eigenschap, en het is precies de eigenschap die de marketing benadrukt.

Ter kalibratie, gemeten met Ollama's eigen tokenizer op jouw eigen bestanden:

| Bestand | Tokens |
|---|---|
| `AGENTS.md` | 8.482 [gemeten] |
| `GL-002-frontmatter-conventions.md` | 10.062 [gemeten] |
| `SOP-017-verwerk-voedingsregistratie.md` | 1.224 [gemeten] |
| `CLAUDE.md` | ~1.355 [afgeleid, 3,88 bytes/token] |
| `Team/Daedalus.../AGENTS.md` | ~4.057 [afgeleid, idem] |

Een specialist die zijn contract, het teamcontract, de frontmatterregels en één SOP moet kennen, start dus op circa **25.000 tokens** [afgeleid] — vóór de vraag van de gebruiker, vóór de tooldefinities, vóór enige bestandsinhoud. Reken op **32K als absoluut minimum** en 64K als comfortabel.

### 1.3 Wat past op de Mac mini (24 GB)

Randvoorwaarde uit de meting: na het uitladen van alle modellen stond de mini op **81% vrij geheugen**, met 1.846 MB wired [gemeten]. Er is dus reële ruimte. Tegelijk is bewezen dat een allocatie van **13 GB volledig op de GPU** lukt zonder de default-limiet op te hogen [gemeten — llama3.1:8b op 131K context draaide op "100% GPU"].

Beoordeling met een contextbudget van 32K erbij geteld:

| Variant | Gewichten | + 32K context [geschat] | Totaal | Oordeel |
|---|---|---|---|---|
| `e2b-mlx` | 6,5 GB | ~1,5 GB | ~8 GB | **Ruim.** Laat de machine vrij voor ander werk. |
| `12b-mlx` | 7,7 GB | ~2 GB | ~10 GB | **De beste keus.** 256K-capabel, MoE-vrij, veel marge. |
| `e4b-mlx` | 8,8 GB | ~1,5 GB | ~10 GB | **Prima**, maar 128K en zwaarder dan 12B. Weinig reden voor. |
| `26b-mlx` | 18 GB | ~2,5 GB | ~21 GB | **Krap tot onverstandig.** Laat ~3 GB over voor macOS en al het andere. |
| `31b-mlx` | 19 GB | ~2,5 GB | ~22 GB | **Niet doen.** De mini doet ook andere dingen (DaVinci Resolve, Whisper, een VM). |

De contextkolom is **[geschat]**: geschaald van mijn llama-meting en naar beneden bijgesteld voor Gemma's KV-deling. Behandel als orde van grootte.

**De 26B/31B-val.** Deze twee zijn precies de varianten waar de benchmarkcijfers van Athena vandaan komen (31B: 85,2% MMLU Pro). Ze passen nominaal binnen 24 GB en dat maakt ze verleidelijk. Maar de mini is jouw 24/7-werkpaard: er draait een VM, er staat DaVinci Resolve op, Whisper draait er transcripties. Een model dat 20 van de 24 GB claimt, maakt de machine tot een modelserver en niets anders. En dan komt Athena's bevinding erbij dat de 26B MoE in één gedocumenteerd geval **11 tokens/seconde** haalde terwijl Qwen 3.5 er 60+ deed [bron, via haar onderzoek — één bron, niet gerepliceerd]. Ik heb dat niet kunnen verifiëren op deze hardware. Zolang dat niet weerlegd is: niet aan beginnen.

### 1.4 Wat past op de MacBook Air (8 GB)

**Niets. Dit is geen inschatting maar een meting.**

De Air draait op dit moment met **7.558 MB gebruikt van 8.192 MB, 74 MB ongebruikt en 3.048 MB in de geheugencompressor** [gemeten]. Die 3 GB compressor betekent dat macOS nu al actief geheugen aan het inpakken is om het werkende te houden — met alleen normale apps open, zonder enig taalmodel.

Het kleinste Gemma 4-bestand is `e2b-mlx` op 6,5 GB. Er is geen quantisatie, geen instelling en geen truc die daar 6,5 GB vrij maakt naast macOS. Zelfs als je het forceert, kom je uit op zwaar swappen, wat op een M1 betekent: traag, warm, en slijtage op de SSD.

**Wat wél kan op de Air:** verbinden met de mini. Ik heb geverifieerd dat dit werkt [gemeten]:
- Direct via het netwerk: `http://macmini.local:11434` → **onbereikbaar** (`http=000`). Ollama luistert alleen op `127.0.0.1:11434` [gemeten met `lsof`].
- Via een SSH-tunnel: `ssh -f -N -L 21434:127.0.0.1:11434 macmini` → **werkt** (`http=200`) [gemeten].

De SSH-tunnel is bovendien de veiligere route. `OLLAMA_HOST=0.0.0.0` zetten zou de API onbeveiligd op je netwerk openzetten — geen authenticatie, iedereen op het netwerk mag prompten en modellen verwijderen. Doe dat niet.

### 1.5 Verwachte snelheid

Wat ik daadwerkelijk gemeten heb op de mini, 300 tokens generatie, temperatuur 0, GGUF-runner:

| Model | Quantisatie | Bestand | **tok/s [gemeten]** | Laadtijd |
|---|---|---|---|---|
| `llama3.1:8b` | Q4_K_M | 4,9 GB | **43,3** | 4,8 s |
| `qwen2.5:14b` | Q4_K_M | 9,0 GB | **24,0** | 5,8 s |

Dit zijn de eerste harde ijkpunten voor deze machine. Daaruit geschat voor Gemma 4 — **nadrukkelijk [geschat], niet gemeten**:

| Variant | Geschatte tok/s | Redenering |
|---|---|---|
| `e4b-mlx` | 50–90 | 4,5B effectief actief, dus lichter dan llama3.1:8b (43,3 gemeten), plus MLX-winst |
| `12b-mlx` | 30–60 | 11,95B dense t.o.v. qwen2.5:14b (24,0 gemeten bij 14,8B), plus MLX en MTP |
| `26b-mlx` | onbekend | 3,8B actief belooft snelheid; één bron rapporteert het tegendeel. Niet schatten. |

De bovenkant van die ranges leunt op twee dingen. Eén: Ollama verving in 0.19 de llama.cpp-Metal-backend door Apple's MLX, met een gerapporteerde sprong van 58 naar 112 tok/s [bron]. Twee: Ollama 0.31 voegde multi-token prediction toe voor Gemma 4 — een klein draft-model dat meeloopt — met een claim van "bijna 90% sneller" op een coding-agent-benchmark, gemeten op `gemma4:12b` op een M5 Max [bron]. Jouw mini heeft **0.31.1**, dus die winst is beschikbaar zodra je een `-mlx`-tag gebruikt.

Let op de bronkritiek: die 90% is Ollama's eigen blogpost, op andere hardware (M5 Max, niet M4 Pro), op één benchmark. De onderkant van mijn ranges is betrouwbaarder dan de bovenkant.

---

## §2 — Welke runtime?

### 2.1 De vraag is grotendeels achterhaald

De klassieke discussie "Ollama versus MLX" is in 2026 opgelost, en wel zo dat je niets hoeft te kiezen: **Ollama gebruikt MLX al**. Sinds versie 0.19 (31 maart 2026) verving Ollama zijn llama.cpp-Metal-backend door Apple's MLX-framework [bron]. Ik heb bevestigd dat die runner op jouw mini staat: `/opt/homebrew/Cellar/ollama/0.31.1/libexec/lib/ollama/mlx_metal_v3/libmlxc.dylib` [gemeten].

De nuance die telt: die runner wordt alleen ingezet voor modellen in MLX-formaat. Jouw huidige vijf modellen zijn GGUF en draaien op `llama-server` [gemeten]. **Voor Gemma 4 betekent dat: kies expliciet de `-mlx`-tag.** `gemma4:12b-mlx`, niet `gemma4:12b`. Dat is de enige plek waar deze hele runtimediscussie zich vertaalt naar een concrete handeling.

### 2.2 De drie opties naast elkaar

| | Ollama | LM Studio | mlx-lm (kaal) |
|---|---|---|---|
| Snelheid Apple Silicon | MLX onder de motorkap [bron] | Gelijkwaardig; 66,8 vs 67,7 tok/s op identiek bestand — 1,3% verschil, dat is ruis [bron] | 15–30% sneller dan Ollama, ~10% minder geheugen [bron] |
| Scriptbaar / onbemand | **Ja** — HTTP-API, draait al als service | Matig — GUI-first, headless-modus is een bijzaak | Ja, maar je bouwt de serverlaag zelf |
| Al geïnstalleerd | **Ja, draait 4 dagen** [gemeten] | Nee | Nee |
| Modelbeheer | `ollama pull`, klaar | GUI-browser | Handmatig via Hugging Face |
| Tool-calling API | **Ja, OpenAI-compatibel** [gemeten, werkt] | Ja | Zelf bouwen |

**Verdict: blijf bij Ollama.** Niet uit gemakzucht, maar omdat de drie criteria die er voor jou toe doen alle drie dezelfde kant op wijzen. Onbemand en scriptbaar: Ollama is de enige met een draaiende service en een stabiele HTTP-API. Snelheid: het verschil met kaal mlx-lm is 15–30% [bron], en dat weegt niet op tegen zelf een serverlaag, modelbeheer en een tool-API bouwen en onderhouden. Reeds aanwezig: het draait al, het is al geconfigureerd met flash attention en q8_0-KV-cache, en het heeft de MLX-runner al binnen.

LM Studio is een prima programma om mee te *verkennen* — modellen browsen, snel iets proberen. Het is het verkeerde gereedschap voor een geautomatiseerde opstelling. Als je wilt experimenteren: installeer het op de Air om te bladeren, laat de uitvoering op de mini.

### 2.3 Twee configuratiepunten die nu misstaan

**a. Het contextvenster staat op 4.096.** `OLLAMA_CONTEXT_LENGTH` is niet gezet [gemeten], dus Ollama valt terug op de default van 4.096 tokens. Ik heb dat bevestigd: elk model dat ik zonder expliciete `num_ctx` aanriep, kwam in `ollama ps` binnen op `CONTEXT 4096` [gemeten].

Voor chatten is dat prima. Voor agentic werk is het fataal — je `AGENTS.md` alleen al is 8.482 tokens en past er dus niet in. Elke agentic test die je zonder deze instelling doet, meet het verkeerde ding. Dit is de eerste knop die om moet.

**b. `LimitLoadToSessionType = Aqua`.** De service laadt alleen binnen een grafische sessie. Dat werkt nu, maar het is geen headless-garantie voor een 24/7-opstelling. Waard om te weten voordat je er iets onbemands op bouwt.

---

## §3 — Kan een lokaal model dit tweede brein aansturen?

Dit is de kernvraag, en hier heb ik niet gespeculeerd maar getest. Ik heb tooldefinities gebouwd die de vorm van jouw myPKA nabootsen (`read_note`, `append_habit_reflection`, `food_log_status`), en die tegen de al aanwezige modellen aan gegooid via Ollama's `/api/chat` met `tools`.

**Belangrijk voorbehoud vooraf:** ik heb **niet met Gemma 4 zelf getest** — dat model staat niet op de machine en downloaden vereist jouw akkoord (§7). Wat ik gemeten heb is **het harnas en het faalpatroon van lokale modellen van vergelijkbare grootte**. Gemma 4 heeft native function-calling-tokens die deze modellen niet hebben [bron], dus het zal het waarschijnlijk beter doen. Hoevéél beter is een open vraag.

### 3.1 Het goede nieuws: het harnas werkt

De volledige agentic loop draait. Model krijgt tools → produceert `tool_call` → ik voer uit → geef resultaat terug → model formuleert antwoord. Alle drie de modellen deden dit correct [gemeten]:

```
qwen2.5:14b  stap1 1,7s -> ['food_log_status']
             stap2 3,1s -> "Op 18 augustus 2026 heb je al een ontbijt geregistreerd.
                            Er zijn nog geen maaltijden ingevoerd voor lunch en avondeten."
```

Ook meervoudige tool-aanroepen in één beurt werken: gevraagd om eerst de voedingsstatus te checken en dán een habit-notitie te lezen, gaven alle drie de modellen keurig twee `tool_calls` terug [gemeten].

Dat is niet niks. Het betekent dat er geen technische blokkade is. De vraag verschuift van "kan het" naar "is het betrouwbaar genoeg".

### 3.2 Het slechte nieuws: waar het breekt

Hier zijn de vier faalpatronen die ik heb kunnen reproduceren. Ze zijn stuk voor stuk relevant voor myPKA.

**Faalpatroon 1 — schema-drift onder tooldruk.**

Ik draaide dezelfde prompt twee keer: één keer met 3 tools, één keer met 25 tools (realistisch voor jouw opstelling: myPKA-tools plus Gmail, Todoist, n8n, Firecrawl, DaVinci, git, SQLite). Alleen het aantal tools verschilde.

| Model | Bij 3 tools | Bij 25 tools |
|---|---|---|
| `qwen2.5:14b` | `date: "2026-08-18"`, `done: true`, `amount: 40` | `date: "2026-08-18"`, `done: true`, `amount: 40` — **stabiel** |
| `llama3.1:8b` | `date: "18 augustus 2026"`, `done: true`, `amount: 40` | `date: "18 augustus 2026"`, `done: **"True"**`, `amount: **"40"**` |
| `llama3.2:3b` | `date: "2026-08-18"`, `done: true`, `amount: 40` | `date: "18 augustus 2026"`, `done: **"true"**`, `amount: **"40"**` |

[gemeten] De boolean werd een string. Het getal werd een string. De datum werd Nederlandse spreektaal. Het schema schreef expliciet `"type": "boolean"` en `"type": "integer"` voor.

Waarom dit ertoe doet: `food_log.py` en `regen-mypka-db.py` verwachten getypeerde waarden. Een `"40"` waar een `40` hoort valt niet noodzakelijk om — hij kan ook stilletjes verkeerd landen in de SQLite-spiegel. En let op de richting: het grootste model hield stand, de twee kleinere niet. Dat is precies andersom dan wat je wilt als je een lokaal model kiest om kosten te besparen.

**Faalpatroon 2 — over-triggeren.**

Ik stelde een vraag die géén tool nodig had: *"Leg in twee zinnen uit waarom een tweede brein nuttig is."*

- `qwen2.5:14b` → antwoordde in proza. **Correct.**
- `llama3.1:8b` → riep `read_note` aan op een verzonnen pad: `PKM/My Life/Metacognition/tweede-brei.md`. Die map bestaat niet. Die notitie bestaat niet. De naam is bovendien afgekapt.
- `llama3.2:3b` → riep `food_log_status` aan met datum `2022-01-01`. Volledig uit de lucht gegrepen.

[gemeten] Een model dat tools ziet, wil tools gebruiken. In een opstelling met schrijfrechten is dat het verschil tussen een assistent en een probleem.

**Faalpatroon 3 — padhallucinatie.**

Gevraagd om `dagelijks-voldoende-drinken.md` te lezen:
- `qwen2.5:14b` gaf `habits/dagelijks-voldoende-drinken.md` — pad afgekapt, `PKM/My Life/` weggevallen [gemeten]
- `llama3.2:3b` gaf `PKM/My Life/Habits/dagelijks-opdrukken.md` — **de verkeerde habit** [gemeten]

Zelfs het model dat verder het best presteerde, kreeg het pad niet heel. In een myPKA met 1.002 markdown-bestanden in `PKM/` en 243 in `Team Knowledge/` [gemeten] is padprecisie geen detail.

**Faalpatroon 4 — hallucineren tegen tool-output in. Dit is de ernstigste.**

Ik gaf het model letterlijk terug: `{"logged": ["ontbijt"], "missing": ["lunch", "avondeten"]}`.

`llama3.2:3b` antwoordde: *"Op 2026-08-18 heb je nog geen maaltijden geëist. De ontbrekende maaltijden zijn lunch en avondeten."* [gemeten]

Het ontbijt stond in de tool-output. Het model wiste het. Dit is niet "het model weet iets niet" — dit is "het model heeft het antwoord in handen en zegt het tegenovergestelde". Athena vond onafhankelijk hetzelfde patroon bij Gemma 4: het leunt in RAG-opstellingen zwaarder op interne kennis dan op meegegeven context [bron, via haar onderzoek].

### 3.3 De SOP-test: schema-conform is niet hetzelfde als correct

Dit vind ik het meest verhelderende resultaat. Ik gaf de modellen de volledige tekst van `SOP-017-verwerk-voedingsregistratie.md` als systeeminstructie en vroeg om drie maaltijdbeschrijvingen om te zetten naar het JSON-schema dat de SOP voorschrijft.

| Model | Schema | Classificatie | Getallen |
|---|---|---|---|
| `qwen2.5:14b` | 3/3 geldig | 3/3 correct | Plausibel: brood+kaas 300–450 kcal, zalmmaaltijd 35–50 g eiwit |
| `llama3.1:8b` | 2/3 (liet `fat_min`/`fat_max` vallen) | 3/3 correct | Plausibel, iets hoger |
| `llama3.2:3b` | 3/3 geldig | **broodje kroket om 13:00 → `snack`** | **Alles nul.** `kcal 0–0`, `eiwit 0–0` |

[gemeten] Kijk goed naar de laatste regel. Het 3B-model scoorde **beter op schemavaliditeit dan llama3.1:8b** — en produceerde volslagen waardeloze data. Nullen over de hele linie, netjes verpakt in geldige JSON, met `confidence: medium` op de derde.

Dat is de kern van het risico bij lokale modellen in myPKA: **je validatielaag vangt dit niet.** De frontmatter klopt. Het JSON parseert. `food_log.py` accepteert het. En je voedingscijfers zijn stil vergiftigd. Een fout die crasht is een geschenk; een fout die valideert is een probleem dat je pas weken later ontdekt.

### 3.4 Beschikbare harnassen

Als je dit toch wilt bouwen, hoef je niet vanaf nul [bron]:

- **`mcp-client-for-ollama` (ollmcp)** — TUI-client die Ollama koppelt aan MCP-servers. Ondersteunt alle MCP-primitieven (tools, prompts, resources), agent-modus, meerdere servers, human-in-the-loop. Het meest volwassen startpunt.
- **LocalHarness** — model-agnostische agent-harness, agents in YAML, deny-first permissies, werkt tegen elk OpenAI-compatibel endpoint. De deny-first permissiemodel is precies wat faalpatroon 2 nodig heeft.
- **llama.cpp web-UI** — sinds 6 maart 2026 met ingebouwde MCP-client en agentic loop.
- **Cline** — VS Code-extensie, koppelt lokale modellen aan MCP-servers.

Alle vier draaien tegen `127.0.0.1:11434`, dus tegen de service die al staat.

### 3.5 Het eerlijke antwoord op de kernvraag

**Kan een lokaal model dit myPKA bedienen? Technisch ja, operationeel nee — niet als autonome bestuurder.**

Wat het aantoonbaar kan [gemeten]: gestructureerde tool-aanroepen produceren, meerstaps-ketens vormen, tool-resultaten verwerken tot een antwoord, JSON-schema's volgen, een SOP als instructie verwerken.

Wat het aantoonbaar niet betrouwbaar kan [gemeten]: typediscipline vasthouden bij 25 tools, zich inhouden als er geen tool nodig is, paden correct reproduceren, trouw blijven aan wat de tool net teruggaf.

En bovenop die vier komt het contextprobleem uit §1.2. Jouw specialistcontracten zijn 4.000–8.500 tokens *per stuk*. Hermes' routeringsprotocol vereist dat een model `AGENTS.md`, `CLAUDE.md`, het juiste specialistcontract, de relevante SOP én GL-002 tegelijk vasthoudt. Dat is de taak waarvoor een frontier-model met een groot, betrouwbaar benut contextvenster bestaat. Dat is niet de taak voor een 12B-model op 32K.

**De werkbare vorm is niet "lokaal model bestuurt myPKA" maar "lokaal model doet afgebakende klussen die myPKA uitbesteedt".** Dat brengt ons bij §4.

---

## §4 — Wat kan het overnemen, en wat niet?

Ik heb `Team Knowledge/SOPs/` (34 bestanden) en `Expansions/` doorgenomen om dit concreet te maken in plaats van generiek.

### 4.1 Geschikt voor een lokaal model

| Taak | Waar in myPKA | Waarom dit past |
|---|---|---|
| **Embeddings / semantisch zoeken** | `davinci-resolve-mcp` (`OLLAMA_URL`), potentieel PKM-breed | **Gemeten: 109,5 fragmenten/s warm, 370 MB resident.** Deterministisch, geen redeneerwerk, geen hallucinatierisico. Verreweg de sterkste kandidaat. |
| **Transcriptie-samenvatting** | `/transcribeer`, `PKM/Documents/YouTube-Kennis/` | Bron is aanwezig in de context, output is proza voor menselijke lezing. Fouten zijn zichtbaar en goedkoop. |
| **Eerste classificatie van inbox-items** | [[SOP-013-inboxen-verwerken]], `Team Inbox/` | Grofmazige categorie-toewijzing (foto / document / audio / link). Voorstel, geen verplaatsing. Mens of frontier-model beslist. |
| **Afbeeldingen hernoemen via vision** | `/rename-images` | Draait al lokaal op `llava:7b` / `llama3.2-vision:11b`. Gemma 4 is multimodaal in álle varianten [bron] — dit is een directe, veilige upgrade. |
| **Concept-samenvattingen en eerste drafts** | ADC-verslagen, deliverables | Mens herschrijft toch. Lokaal genereren is gratis en snel. |
| **Batchwerk zonder deadline** | Bulk-hernoeming, kanaal-transcripties, PKM-brede indexering | 24,0–43,3 tok/s [gemeten] is prima als niemand zit te wachten. |

### 4.2 Frontier-model blijft nodig

| Taak | Waarom niet lokaal |
|---|---|
| **Hermes' orkestratie en routering** | ~25.000 tokens contract-context [afgeleid] + betrouwbare instructievolging. Precies de as waarop lokale modellen breken. |
| **Schrijven in `PKM/`** | Faalpatroon 4: hallucineren tegen brondata in. Onherstelbare vervuiling van de canonieke laag. |
| **Voedingsschattingen die tellen** | Gemeten: het 3B-model gaf nullen die valideerden. Bij `qwen2.5:14b` plausibel, maar de foutmodus is stil. |
| **Frontmatter-integriteit (Atlas)** | GL-002 is 10.062 tokens [gemeten] aan regels die exact gevolgd moeten worden. |
| **Nederlandse nuance in klantcommunicatie** | Nederlands is nergens los gebenchmarkt voor Gemma 4 [bron, via Athena]. Ongemeten risico waar het zichtbaar is. |
| **Meerstaps-agentic werk over veel tools** | Gemeten: schema-drift bij 25 tools. Jouw opstelling heeft er meer. |
| **Alles wat op `git push` uitkomt** | Onomkeerbaar, gedeelde staat. |

### 4.3 De scheidslijn in één regel

**Lokaal mag alles doen waarvan de output wordt gelezen voordat hij telt. Frontier doet alles wat rechtstreeks in de canonieke laag landt.**

Dat sluit netjes aan op de tiering in [[2026-08-17-modeltiering-agents-instructie]].

---

## §5 — Wat er al staat, en wat er kapot is

### 5.1 Aanwezig en werkend

- **Ollama 0.31.1** als `brew services`-agent op de mini, `127.0.0.1:11434`, 4 dagen uptime [gemeten]
- **MLX-runner** `mlx_metal_v3` geïnstalleerd [gemeten]
- **Vijf modellen**, circa 28 GB [gemeten]
- **Flash attention + `q8_0`-KV-cache** al aan in de plist [gemeten]
- **255 GB vrije schijf** [gemeten]
- **`/rename-images`** gebruikt al lokale vision
- **`/transcribeer`** delegeert al via SSH naar de mini als `whisper_host` — het patroon "Air stuurt, mini rekent" is dus al bewezen in jouw opstelling

### 5.2 De SSH-brug werkt

Geverifieerd [gemeten]: `ssh -f -N -L 21434:127.0.0.1:11434 macmini` maakt de mini-Ollama bereikbaar vanaf de Air (`http=200`). Direct via `macmini.local:11434` werkt niet en moet ook niet werken.

### 5.3 Wat ik heb gedownload — expliciet gemeld

Ik heb **`nomic-embed-text` (274 MB)** opgehaald op de mini. Reden: dat is het model dat de `davinci-resolve-mcp`-server als default verwacht (`DAVINCI_RESOLVE_MCP_EMBED_MODEL`), en het ontbrák — de embeddingfunctionaliteit van die MCP-server was dus dood. Ruim onder de 5 GB-grens, en het repareert een bestaande koppeling in plaats van een nieuwe te maken.

Gemeten na installatie: **109,5 fragmenten/seconde warm** (56,3 koud, inclusief laden), 370 MB resident, 768 dimensies. Voor jouw 1.002 PKM-notities is dat circa **10 seconden** voor een volledige her-indexering [afgeleid]. Dat is goedkoop genoeg om vaak te doen.

### 5.4 De bug: remote Ollama is onmogelijk gemaakt

Dit is een concrete vondst, geen theorie. In `/Users/sandervanockenburg-zwaan/Tools/davinci-resolve-mcp/src/utils/embeddings.py`:

```python
def _ollama_state() -> Dict[str, Any]:
    binary = shutil.which("ollama")
    state: Dict[str, Any] = {
        "binary": binary, "serving": False,
        "model_present": False, "model": OLLAMA_TEXT_MODEL,
    }
    if not binary:
        return state          # <-- keert terug vóór OLLAMA_URL ooit wordt geprobeerd
```

En verderop:

```python
if ollama["binary"] and ollama["serving"] and ollama["model_present"]:
    text_backends.append("ollama")
```

De code eist een **lokaal `ollama`-binary** voordat hij de geconfigureerde `OLLAMA_URL` überhaupt aanroept. Gevolg: `DAVINCI_RESOLVE_MCP_OLLAMA_URL` naar de mini laten wijzen **werkt niet vanaf de Air**, want daar staat geen binary — ook niet via een SSH-tunnel naar een perfect bereikbare server.

Geverifieerd op de Air [gemeten]:
```json
"ollama": {"binary": null, "serving": false, "model_present": false}
"guidance": "Install ollama (https://ollama.com) and pull nomic-embed-text, ..."
```

De configuratieoptie bestaat, maar de detectielogica maakt hem onbruikbaar. De fix is klein — de binary-check laten vervallen zodra `OLLAMA_URL` niet op de default staat, of gewoon altijd de URL proberen en op de netwerkfout terugvallen. Dat is een codewijziging in een repo buiten myPKA, dus buiten de scope van dit onderzoek. **Ik heb hem niet doorgevoerd.**

### 5.5 Wat er nog moet komen

| Ontbreekt | Waarom nodig |
|---|---|
| `OLLAMA_CONTEXT_LENGTH` gezet | Nu 4.096 [gemeten] — zes keer te klein voor jouw contracten |
| Een MCP-client voor lokale modellen | §3.4; nu is er geen enkele brug tussen Ollama en je MCP-servers |
| Gemma 4 zelf | §7 |
| Fix voor §5.4 | Anders kan de Air nooit de mini als embeddingserver gebruiken |
| Beslissing over de `Aqua`-sessiebinding | Voor echt onbemand draaien |

---

## §6 — LLM-onafhankelijkheid: helpt dit of niet?

[[GL-005-llm-agnostic-portable-core]] stelt één toetsvraag: *"Als er morgen een nieuw harnas verschijnt, moet dit bestand dan veranderen?"* De scheiding is portable core (`PKM/`, `Team Knowledge/`, de body van elk `Team/*/AGENTS.md`) versus adapter (`.claude/`, `.codex/`, `.cursor/`).

### 6.1 Gemma 4 dient het doel — maar niet zoals je zou denken

**Waar het helpt.** De vier regels van GL-005 gaan over het vermijden van harnas- en modelkoppeling in de canonieke laag. Regel 4 is expliciet: *"Geen bestand in de portable core pint een specifiek model-id, modelfamilie of provider vast. Modelkeuze is een runtime-/adapterzaak."*

Een lokaal model draaien is de **praktische bewijsvoering** van die regel. Zolang alles op één aanbieder draait, is modelonafhankelijkheid een belofte die nooit getest is. Draait er een tweede, fundamenteel andere motor tegen dezelfde `Team Knowledge/`-SOP's, dan blijkt of die SOP's echt modelonafhankelijk geschreven zijn. Mijn SOP-017-test in §3.3 is daar een klein voorbeeld van: drie verschillende modellen, dezelfde SOP, en het verschil zat in de modellen — niet in dubbelzinnigheden in de SOP. Dat is een goed teken voor de kwaliteit van je documentatie.

Bovendien: Apache 2.0 en lokale gewichten. Er is geen partij die de stekker eruit kan trekken, geen prijswijziging, geen API-deprecatie, geen datauitwisseling. Voor de laag die je hierboven als "geschikt" hebt afgebakend, is dat echte onafhankelijkheid.

**Waar het een nieuwe afhankelijkheid schept.** Drie, en ze zijn reëel:

1. **Hardwareafhankelijkheid.** Nu is myPKA overdraagbaar naar elke machine met een teksteditor. Wordt Gemma 4 een productie-afhankelijkheid, dan is myPKA gekoppeld aan *deze Mac mini met deze 24 GB*. De Air kan het niet [gemeten, §1.4]. Dat is een zwaardere koppeling dan een API-sleutel, want een sleutel verhuis je in dertig seconden.

2. **Runtime-afhankelijkheid.** Ollama, een `brew services`-agent, een plist met specifieke variabelen, een sessiebinding op `Aqua`. Dat is precies het soort mechaniek dat GL-005 in de adapterlaag wil houden — en het staat dan ook buiten myPKA, in `~/Library/LaunchAgents/`. Zolang dat zo blijft, is de regel niet geschonden. Maar het is wél infrastructuur die kan omvallen en die iemand moet onderhouden.

3. **Het echte gevaar: SOP's die naar het lokale model buigen.** Dit is de subtiele. Merk je dat het lokale model steeds hetzelfde veld laat vallen (zoals llama3.1:8b met `fat_min`/`fat_max` [gemeten]), dan is de verleiding groot om dat veld optioneel te maken. Vanaf dat moment vormt een modelbeperking je canonieke schema — en dat ís de koppeling die GL-005 wil voorkomen. Het staat niet in de letter van de regel, maar het is wel de geest ervan.

### 6.2 De voorwaarde

**Gemma 4 dient LLM-onafhankelijkheid zolang het een vervangbare uitvoerder is en nooit een vormgever van de canonieke laag.**

Concreet, drie regels die dit borgen:

1. **Geen enkele SOP, Guideline of specialistcontract noemt Gemma 4, Ollama of enig modelnaam.** Dat is letterlijk regel 1 en 4 van GL-005. Een SOP beschrijft *"stuur dit naar een lokale-uitvoerderlaag"*, niet *"stuur dit naar `gemma4:12b-mlx`"*. Alle mechaniek — modelnaam, endpoint, poort — hoort in de adapterlaag.

2. **Elke lokaal uitgevoerde taak moet identiek uitvoerbaar zijn door een frontier-model.** Valt de mini om, dan gaat het werk door — trager of duurder, maar het gaat door. Is dat niet zo, dan is het geen uitvoerderlaag meer maar een afhankelijkheid.

3. **Nooit een schema versoepelen omdat het lokale model het niet haalt.** Haalt het model de SOP niet, dan is het model ongeschikt voor die taak. Punt.

Onder die drie voorwaarden is het antwoord op de vraag: **ja, dit dient de doelstelling.** Zonder die voorwaarden schept het precies de afhankelijkheid die GL-005 wil vermijden, alleen met een ander gezicht.

---

## §7 — Downloadvoorstel (nog niets gedaan)

Zoals afgesproken: ik heb **geen** Gemma 4-model opgehaald. Wat ik zou willen downloaden, met exacte omvang:

**Voorstel A — minimaal, om te meten (7,7 GB)**
```
ollama pull gemma4:12b-mlx        # 7,7 GB
```
De beste prijs-kwaliteitkeuze voor de mini: 256K-capabel, dense (geen MoE-onzekerheid), MLX-runner, en precies de variant waarvoor Ollama de MTP-versnelling documenteert [bron]. Hiermee kan ik de schattingen uit §1.5 en §3 vervangen door metingen.

**Voorstel B — vergelijkend (16,5 GB totaal)**
```
ollama pull gemma4:12b-mlx        # 7,7 GB
ollama pull gemma4:e4b-mlx        # 8,8 GB
```
Voegt de snelle edge-variant toe, zodat ik snelheid tegen kwaliteit kan afzetten op dezelfde tests die ik vandaag heb gedraaid.

**Wat ik afraad:** `gemma4:26b-mlx` (18 GB) en `gemma4:31b-mlx` (19 GB). Ze passen nominaal in 24 GB, maar laten te weinig over voor een machine die ook Resolve, Whisper en een VM draait — en voor de 26B staat er één onweerlegde melding van 11 tok/s tegenover [bron, via Athena].

Schijfruimte is geen bezwaar: 255 GB vrij [gemeten].

---

## §8 — Concrete vervolgstappen

In volgorde van waarde-per-inspanning.

**1. Zet het contextvenster goed.** Zonder dit meet elke agentic test het verkeerde. Eén regel in de plist, dan `brew services restart ollama`:
```
OLLAMA_CONTEXT_LENGTH = 32768
```
Verificatie: `ollama ps` moet `CONTEXT 32768` tonen na een aanroep zonder expliciete `num_ctx`.

**2. Repareer de embeddingdetectie (§5.4).** `nomic-embed-text` staat er nu, dus op de mini werkt het. De Air kan de mini nog steeds niet gebruiken. Kleine codewijziging, buiten myPKA.

**3. Pull `gemma4:12b-mlx` en meet.** Ik draai dezelfde vier tests opnieuw — snelheid, tool-calling bij 3 vs 25 tools, round-trip, SOP-017 — en dan staan er metingen waar nu schattingen staan. Circa 20 minuten werk zodra het model binnen is.

**4. Zet één afgebakende taak lokaal, met verificatie.** Mijn voorkeur: `/rename-images` naar Gemma 4's vision. Voorstel-en-bevestig zit al in die skill ingebouwd, dus faalpatroon 2 is er al afgedekt. Meetbaar resultaat, nul risico voor `PKM/`.

**5. Pas dan een MCP-client overwegen.** `ollmcp` of LocalHarness, tegen de bestaande service. Niet eerder — eerst moet stap 3 uitwijzen of Gemma 4 de schema-discipline haalt die de andere modellen misten.

**Wat ik niet aanraad:** iets lokaals op de MacBook Air. Dat is geen kwestie van instellen; er is 74 MB vrij [gemeten].

---

## Bronnen

Extern geraadpleegd op 2026-08-18:

- [Gemma 4 model card — Google AI for Developers](https://ai.google.dev/gemma/docs/core/model_card_4) — parametertellingen, architectuur, contextlengtes, native function calling, 140+ talen
- [Ollama library — gemma4](https://ollama.com/library/gemma4) — tags en downloadgroottes
- [Faster Gemma 4 on MLX with multi-token prediction — Ollama Blog](https://ollama.com/blog/faster-gemma-4-mlx-mtp) — MTP, "bijna 90% sneller", getest op `gemma4:12b` op M5 Max
- [Gemma 4 Explained: Per Layer Embeddings — Medium](https://ritvik19.medium.com/papers-explained-gemma-4-ba2108a444a9) — PLE, 4:1 en 5:1 lokale/globale attentie, KV-cachedeling
- [MLX vs Ollama on Apple Silicon (2026) — Will It Run AI](https://willitrunai.com/blog/mlx-vs-ollama-apple-silicon-benchmarks) — MLX 15–30% sneller, ~10% minder geheugen
- [Ollama vs LM Studio on Mac (2026) — dottie.ai](https://www.dottie.ai/blog/ollama-vs-lm-studio/) — 66,8 vs 67,7 tok/s op identiek bestand
- [Ollama vs LM Studio vs vLLM vs llama.cpp vs MLX 2026 — Codersera](https://codersera.com/blog/ollama-vs-lm-studio-vllm-llama-cpp-mlx-2026/) — Ollama 0.19 verving llama.cpp-Metal door MLX
- [mcp-client-for-ollama (ollmcp) — GitHub](https://github.com/jonigl/mcp-client-for-ollama) — MCP-client voor Ollama
- [LocalHarness — GitHub](https://github.com/ahwurm/localharness) — model-agnostische agent-harness met deny-first permissies
- [unsloth/gemma-4-26B-A4B-it-GGUF — BFCL v4 discussie](https://huggingface.co/unsloth/gemma-4-26B-A4B-it-GGUF/discussions/42) — 89% non-live function calling (één community-meting, niet gerepliceerd)

Intern:
- [[2026-08-18-gemma-4-onderzoek-athena]] — inhoudelijke kant, benchmarks, kwaliteitsbeperkingen
- [[2026-08-18-gemma-4-onderzoeksverzoek]] — Sanders oorspronkelijke vraag
- [[2026-08-17-modeltiering-agents-instructie]] — bestaande tiering
- [[GL-005-llm-agnostic-portable-core]] — §6
- [[SOP-013-inboxen-verwerken]], [[SOP-017-verwerk-voedingsregistratie]] — §4

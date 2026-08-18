---
key_element: work
type: onderzoeksbrief
status: afgerond
created: 2026-08-18
---

# Onderzoeksbrief — Gemma 4 lokaal draaien, en past het in myPKA?

Vervolg op [[2026-08-18-gemma-4-onderzoeksverzoek]] (het ingesproken verzoek, met de eerste
voorlopige feiten). Deze brief beantwoordt de vier vragen uit dat verzoek, met bronverificatie
en expliciete markering van wat aanname/afgeleid is versus wat geverifieerd is.

**Methodologie:** twee onafhankelijke zoekpaden (WebSearch + directe fetch van primaire bronnen:
`blog.google`, `ai.google.dev`, Hugging Face, Unsloth, Arm Newsroom, Google Developers Blog).
**Belangrijk methodologisch punt vooraf:** een groot deel van de zoekresultaten voor "Gemma 4"
komt van een cluster nieuw ogende "guide"-sites (gemma4.dev, gemma4.wiki, gemma4all.com,
gemma4-ai.com, en vergelijkbare) met zeer specifiek klinkende maar onderling tegenstrijdige
cijfers (bijvoorbeeld twee verschillende releasedata, en een SWE-bench-vergelijking waarin de
tekst zelf Gemma 4-cijfers per ongeluk aan "Qwen 3.6" toeschrijft). Die cluster is **niet
gebruikt** als bron in deze brief — alleen Google's eigen kanalen (blog.google, ai.google.dev,
developers.googleblog.com), Hugging Face, Unsloth (gespecialiseerd in quantisatie) en drie
onafhankelijke techmedia (Phandroid, The Decoder, Arm Newsroom) zijn meegewogen.

---

## 1. Wat is Gemma 4, en waar zit de aantoonbare beperking?

**Geverifieerd (twee of meer bronnen, waarvan Google zelf + Hugging Face + Arm/Phandroid/The
Decoder onafhankelijk):** Gemma 4 is een open-weight modelfamilie van Google DeepMind,
uitgebracht op 2 april 2026 onder Apache 2.0. Vijf varianten: E2B, E4B, 12B, 26B A4B (MoE, 4B
actieve parameters) en 31B (dense). Contextvenster 128K (E2B/E4B) tot 256K (12B/26B A4B/31B).
Native multimodaal: tekst, beeld, video, OCR; E2B/E4B/12B ook audio-input. Confidence: **Hoog**
voor bestaan, releasedatum, licentie en varianten — Google's eigen `blog.google` en
`ai.google.dev` komen onafhankelijk van elkaar (andere property, ander team) tot dezelfde
specificaties, en Hugging Face's aankondiging bevestigt dit een derde keer.

**Wat Gemma 4 goed doet (gestaafd):** het draait, geverifieerd via drie niet-Google-bronnen
(Phandroid, The Decoder, Arm Newsroom) plus Google's eigen Developers Blog, daadwerkelijk
on-device op telefoons via de gratis "Google AI Edge Gallery"-app (Android + iOS) — zie vraag 2.

**Waar het aantoonbaar beperkt is:** Google's eigen aankondiging benadrukt LMArena-ranking,
LiveCodeBench en Codeforces-achtige benchmarks. **SWE-bench Verified** — de benchmark die meet of
een model een echt GitHub-issue kan oplossen in een bestaande codebase, inclusief tools gebruiken
en tests laten slagen — komt in geen van Google's eigen materialen voor die ik heb kunnen vinden.
Dat is op zichzelf een feit (afwezigheid in wat ik gevonden heb), geen bewijs van een slecht
cijfer. Ik heb wél cijfers gezien die een fors lager SWE-bench-resultaat voor Gemma 4 claimen ten
opzichte van concurrenten, maar die komen uitsluitend uit de onbetrouwbare sitecluster hierboven
— **die cijfers neem ik niet over.** Netto: **geen onafhankelijk geverifieerd agentisch
coding-benchmark gevonden voor Gemma 4** — en dat is precies het type taak (meerdere bestanden,
tools aanroepen, een repo bijwerken) dat Sanders eigen myPKA-gebruik vergt. Dit is een open punt,
geen afgesloten conclusie.

De marketingclaim "Gemma 4 outcompetes models 20x its size" en de LMArena-ranking ("#3", "#6")
komen letterlijk uit Google's eigen promotietekst. **Marketingbron, niet onafhankelijk
geverifieerd** — ik heb geen actuele, gedateerde LMArena-snapshot zelf kunnen bevestigen.

---

## 2. Kan het lokaal draaien — op zijn hardware, en op een telefoon?

**Telefoon: ja, geverifieerd met Medium-High confidence.** E2B en E4B draaien volledig
on-device via Google AI Edge Gallery (gratis app, Android én iOS, geen internetverbinding
nodig). Bevestigd door vier bronnen: Google's eigen Developers Blog, plus drie
niet-Google-bronnen (Phandroid, The Decoder, Arm Newsroom) — dat is triangulatie in de
volle zin van Athena's protocol.

**Zijn eigen hardware — zie de tabel in sectie 4.** Kort samengevat: op de **MacBook Air M1 /
8GB** is alleen E2B in kwantisatie haalbaar, en dan alleen als geïsoleerde test (niet naast
Claude Code of een browser open). Op de **Mac mini M4 Pro / 24GB** passen E2B, E4B en 12B
comfortabel; 26B A4B en 31B passen krap tot niet, afhankelijk van een macOS-instelling die
standaard niet aanstaat (zie tabel).

---

## 3. Hoe past het in het bestaande myPKA-ecosysteem?

Sanders randvoorwaarde — LLM-onafhankelijk blijven — is al architectuur, niet iets dat nog moet
gebeuren. Volgens [[GL-005-llm-agnostic-portable-core]] noemt de portable core (`PKM/`,
`Team Knowledge/`, de body van elke `Team/*/AGENTS.md`) al geen enkel modelmerk of model-ID
(Regel 4). Gemma 4 toevoegen zou dus **geen wijziging in de portable core vereisen** — dat deel
is al klaar voor elke harness.

Wat wél nodig zou zijn: een nieuwe adapterlaag (naast `.claude/`, analoog aan hoe `.codex/` of
`.cursor/` zouden werken) die een lokaal Gemma-model dezelfde tool-aanroep-mogelijkheden geeft
die Claude Code/Cowork nu al heeft — bestanden lezen/schrijven, git, MCP-servers, bash. **Dat
komt niet gratis met de modelgewichten mee.** Gemma 4 draaien via Ollama/LM Studio/MLX geeft een
chatvenster, geen agentische collega die zelfstandig door `Team/`, `PKM/` en `Deliverables/`
werkt. Die brug bouwen is een op zichzelf staand engineeringtraject — precies het soort werk dat
bij Daedalus (verbindingslaag) en Jethro (scope/brief) hoort, niet iets dat "vanzelf" gebeurt
door het model te downloaden.

Conclusie: architectonisch compatibel, operationeel nog niet aanwezig. Een extra adapter is
precies waar GL-005 op is gebouwd — maar iemand moet hem nog bouwen.

---

## 4. Hardware-tabel per variant, en de financiële hypothese getoetst

### Geheugenbehoefte per variant bij 4-bit (Q4) kwantisatie

Twee bronnen leveren net iets andere getallen (verschillende quantisatiemethode/telwijze) —
ik geef de bandbreedte van beide, dat is eerlijker dan één getal kiezen:

| Variant | Q4-geheugen (Google `ai.google.dev`) | Q4-geheugen (Unsloth) | Range gebruikt hieronder |
|---|---|---|---|
| E2B | 2,9 GB | 4 GB | 2,9–4 GB |
| E4B | 4,5 GB | 5,5–6 GB | 4,5–6 GB |
| 12B | 6,7 GB | 7–8 GB | 6,7–8 GB |
| 26B A4B | 14,4 GB | 16–18 GB | 14,4–18 GB |
| 31B | 17,5 GB | 17–20 GB | 17,5–20 GB |

Confidence: **Medium** — twee bronnen, geen van beide onafhankelijk van Google's eigen
kwantisatie-conventies, maar Unsloth is een gespecialiseerde derde partij, dus wel een echte
tweede meting.

### Vertaling naar Sanders twee machines (afgeleid, niet direct gemeten op zijn hardware)

Apple Silicon reserveert standaard circa 75% van het unified memory als werkgeheugen-plafond
voor de GPU (Metal `recommendedMaxWorkingSetSize`) — dit is community-gedocumenteerd gedrag
(o.a. llama.cpp-projectdiscussies), aanpasbaar via `sudo sysctl iogpu.wired_limit_mb=...` maar
dat is niet de standaardinstelling. Ik heb dit **niet** gemeten op Sanders eigen machines —
onderstaande is berekening, geen meting.

**MacBook Air, M1, 8 GB RAM** → standaard GPU-plafond ≈ 6 GB.

| Variant | Past het? | Wat blijft over |
|---|---|---|
| E2B | Nét, als losse test | Van de 8 GB totaal blijft ~4–5 GB over voor macOS zelf — te weinig om Claude Code/browser er tegelijk naast open te hebben |
| E4B | Zit op/over het standaardplafond | Niet praktisch bruikbaar |
| 12B, 26B A4B, 31B | Nee | Gewichten alleen al groter dan het totale RAM van de machine |

**Mac mini, M4 Pro, 24 GB RAM** (hier draait ook Whisper large-v3-turbo lokaal) → standaard
GPU-plafond ≈ 18 GB.

| Variant | Past het? | Wat blijft over |
|---|---|---|
| E2B | Ruim | ~14–15 GB vrij voor macOS/overige apps |
| E4B | Ruim | ~12–13 GB vrij |
| 12B | Comfortabel | ~10–11 GB vrij — beste kandidaat voor dagelijks gebruik op deze machine |
| 26B A4B | Krap — alleen aan de onderkant van de range past het binnen het standaardplafond | Vrijwel niets over voor macOS, KV-cache of gelijktijdig Whisper draaien |
| 31B | Overschrijdt het standaard GPU-plafond (17,5–20 GB tegen ~18 GB beschikbaar) | Vereist handmatig het `iogpu.wired_limit_mb` optrekken; ook dan slechts 4–6 GB over voor macOS zelf — niet comfortabel voor dagelijks gebruik |

Deze cijfers gaan uit van modelgewichten alleen. Een groter contextvenster (richting de
geclaimde 256K) vraagt extra geheugen voor de KV-cache, bovenop wat hierboven staat — hoeveel
precies heb ik niet geverifieerd; reken dus niet op het volledige 256K-venster binnen deze
grenzen.

### De financiële hypothese: "dan zou dat heel veel geld kunnen schelen"

Wat wel geverifieerd is: Anthropic's huidige publieke prijsstructuur is Pro $20/maand, Max
$100/maand (5x) of $200/maand (20x); Cowork zit sinds januari 2026 ook in het Pro-plan. Dit komt
overeen met zowel een onafhankelijke websearch als met een los kennisbestand in de vault over
Claude-facturering — twee bronnen, dus **Medium-High confidence op het prijspunt zelf**.

**Aangevuld door Sander zelf op 2026-08-18:** hij zit op dit moment op **Max**, maar expliciet
tijdelijk — hij is op de camping, besteedt daar veel tijd met Claude, en wil dit "maar een
maandje" volhouden. Welke Max-staffel (5x à $100 of 20x à $200) is niet vastgesteld.

Dat verandert de rekensom wezenlijk: de relevante besparingsbasis is niet het Max-bedrag maar het
plan waar hij ná deze maand op terugvalt. Valt hij terug op Pro ($20/maand), dan is dát het bedrag
dat een lokaal model zou moeten vervangen — niet $100 of $200. De tijdelijke Max-kosten zijn een
piek die vanzelf wegvalt, niet een structurele last die lokale inferentie kan wegnemen.

De hypothese getoetst, niet overgenomen: een lokaal model bespaart pas geld als het **vervangt**
wat Sander nu betaalt. Op dit moment kan een lokaal Gemma 4-model dat niet voor het werk waar
zijn Claude-abonnement voor gebruikt wordt: agentisch door `Team/`, `PKM/` en `Deliverables/`
werken, tools aanroepen (MCP, git, bash), betrouwbaar over veel bestanden tegelijk redeneren. Die
laag ontbreekt vandaag bij een lokaal gedraaid model (zie vraag 3) en is niet onafhankelijk
gebenchmarkt op agentische coding (zie vraag 1). De realistische besparing vandaag is dus **niet**
"heel veel geld" op de kernworkflow — het theoretisch maximale bedrag (zijn huidige
maandbedrag) wordt pas realiseerbaar als iemand eerst de ontbrekende agent-laag bouwt, en dat
kost zelf tijd/geld. Wat een lokaal model wél kosteloos zou kunnen doen: smalle, niet-agentische
taken — bijvoorbeeld losse aantekeningen dicteren op de telefoon zonder internetverbinding, of
een privé-snel-opzoekfunctie zonder tokenmetering.

---

## Aanbeveling (max. 5 regels)

Niet nu overstappen op Gemma 4 voor de kernwerkstroom — de agentische laag ontbreekt en is niet
onafhankelijk gebenchmarkt. Wel de moeite waard: E2B/E4B installeren via Google AI Edge Gallery
op de telefoon, gratis, geen bouwwerk nodig, om te voelen wat lokaal-op-zak concreet betekent.
Goedkoopste zinvolle test op de Mac mini: 12B via Ollama draaien (past comfortabel binnen 24 GB)
voor niet-agentische taken zoals losse vraag-antwoord of samenvatten, en pas dan meten of de
kwaliteit voor Sanders eigen taken voldoende is voordat er in een adapter/agent-laag
geïnvesteerd wordt.

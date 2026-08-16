« Zie [[GL-001-file-naming-conventions]] »

# Ruflow (vermoedelijk "Ruflo" / voorheen "Claude Flow") — is dit relevant voor Sander & Co?

**Onderzoeksvraag:** Sander zag "Ruflow" op GitHub als Claude-uitbreiding/skill. Wat is het, en is het relevant voor de Sander & Co multi-agent opstelling?

## Update 2026-08-16: bron geverifieerd

Sander deelde de bron: YouTube Short "60 AI Agents Inside Claude Code (Free Setup Guide)" (kanaal Duncan Rogoff | Learn Claude Code, 1 mei 2026, https://youtube.com/shorts/DuDrHzaBQ3k). Beschrijving noemt expliciet "RuFlow" met "Manager (queen) agents", "Shared memory improves results over time" en "Smart routing" tussen goedkope/dure modellen — exact het queen/worker + vectorgeheugen-patroon van `ruvnet/ruflo`. Identificatie hierboven gaat daarmee van Medium naar **High confidence**. De video zelf is een hype-/affiliate-short die doorlinkt naar een betaalde Skool-community, geen technische review — dat versterkt het anti-patroon-punt onderaan.

## Belangrijkste bevinding — welk project is dit? (Confidence: High, zie update hierboven)

Er bestaat geen exact project genaamd "Ruflow" met een grote GitHub-aanwezigheid. Er zijn minstens vier repo's met deze of een sterk gelijkende naam:

1. **`ruvnet/ruflo`** — het meest waarschijnlijke doelwit. Voorheen "Claude Flow", per v3.5 (feb 2026) hernoemd naar "Ruflo" (om merkredenen). Zeer actief: 7.368+ commits, 560 open issues, 271 open PR's, ~60-68k GitHub stars (schattingen lopen uiteen tussen bronnen/momentopnames — behandel als indicatief, niet exact). [github.com/ruvnet/ruflo](https://github.com/ruvnet/ruflo)
2. `erfwn81/ruflow` — een fork van #1 met 1 ster, niet zelfstandig relevant.
3. `henryalouf/ruflow` — een ander, kleiner project (~107 stars) met een eigen "trainingsbibliotheek" van skills/agents voor Claude Code — mogelijk zelf ook geïnspireerd op #1, maar niet hetzelfde project.
4. `victor95pc/ruflow` — een ongerelateerde oude Ruby flow-based-programming library, niet Claude-gerelateerd.

Zonder de exacte URL die Sander zag kan ik niet met zekerheid bevestigen welke hij bedoelt. Gezien de context (Claude-uitbreiding, populair genoeg om op te vallen) is #1 verreweg het meest waarschijnlijk — de naam "Ruflow" is vrijwel zeker een verlezen/onthouden variant van "Ruflo".

## Wat Ruflo doet (3-5 bullets)

- Een **agent-meta-harness** rond Claude Code/Codex: voegt 100+ gespecialiseerde agenten toe die zich organiseren in "swarms".
- **Persistent/adaptief geheugen** (AgentDB + HNSW-vectorzoeking) en **zelflerende routering** (SONA-patronen, ReasoningBank) over sessies heen.
- Coördinatie via **MCP-servers**, uitvoering via Claude Code's eigen Task-tool; installeerbaar als lichte Claude Code-plugin, volledige CLI (`npx ruflo init`), of gehoste web-UI.
- **Multi-provider routing** (Claude, GPT, Gemini, Ollama) en "federatie" — agenten op verschillende machines kunnen samenwerken.
- Distributie via npm (`ruflo`, voorheen `claude-flow`/`@claude-flow/cli`).

## Volwassenheid

**High confidence** (meerdere onafhankelijke bronnen eens): zeer actief onderhouden, grote community, recente rebrand met stabiele v3.5-release. **Low confidence** op het exacte sterrenaantal — cijfers tussen 59k en 68k, vermoedelijk verschillende meetmomenten, niet geverifieerd bij de bron zelf (GitHub API).

## Oordeel: niet relevant voor Sander & Co, en wel om een principiële reden

Ruflo lost een ander probleem op dan Sander & Co heeft. Het is gebouwd voor grootschalige, generieke software-engineeringzwermen (100+ wegwerpagenten, CVE-scanning, cross-machine federatie) — infrastructuur voor build-pipelines, niet voor een klein team van vaste, benoemde specialisten met een leesbare kennisbank.

Belangrijker: Ruflo's kernmechaniek (opaque vector-geheugen in een database, zelflerende/black-box routering) **botst frontaal** met de harde regels van deze myPKA — markdown-only, geen SQLite/DB (regel 6 in `AGENTS.md`), en volledige auditeerbaarheid via SOPs/Workstreams/session-logs. Sander & Co heeft al deterministische, auditeerbare multi-agent orchestratie via `.claude/agents/*.md` + het host-native parallel-agent-tool + SOPs — precies het soort transparantie die Ruflo's zelflerende geheugen juist opgeeft voor schaal.

**Anti-patroon om te vermijden:** een populair (67k-sterren) framework overnemen omdat het populair is, zonder te toetsen of het probleem dat het oplost ook Sanders probleem is. Dat is hier niet het geval.

**Wel de moeite waard, alleen als losse inspiratie** (geen adoptie van het framework): de `SKILL.md`-conventie met progressive disclosure die Ruflo gebruikt voor zijn skills, mocht Daedalus/Atlas ooit ideeën zoeken voor het schrijven van nieuwe skills.

## Beperkingen

- Niet geïnstalleerd, niet getest — puur documentatie-onderzoek, zoals gevraagd.
- Kon niet 100% bevestigen welke exacte repo Sander zag; als hij de link kan delen, kan dit stuk scherper.
- Sterrenaantal en exacte laatste-commit-datum niet via de GitHub API geverifieerd, alleen via paginascrapes.

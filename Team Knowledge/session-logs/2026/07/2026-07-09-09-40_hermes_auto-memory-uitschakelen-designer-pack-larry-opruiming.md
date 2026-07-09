---
agent_id: hermes
session_id: 2026-07-09-09-40_hermes_auto-memory-uitschakelen-designer-pack-larry-opruiming
timestamp: 2026-07-09T09:40:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Auto-memory globaal uitgeschakeld, na verificatie van scaffold-structuur

## Context

Sander begon met vragen over de folderstructuur zelf: waar CLAUDE.md staat, of die zichtbaar zou moeten zijn in een verkenner, en wat er in README.md staat. Dat leidde naar het "Designer Expansion Pack" uit de README, naar een oude Larry-restant in `Team/`, en uiteindelijk naar de vraag of hij zijn Claude auto-memory feature moest uitschakelen — een advies uit de myPKA-launchvideo.

## What we did

- Hermes bevestigde dat [[CLAUDE.md]] in de rootmap staat en naar [[AGENTS.md]] verwijst als source of truth.
- Hermes las [[README.md]] voor en legde de v2.0.0 Designer Expansion Pack uit; ontdekte dat dit pack in Sanders team al **live** zit onder eigen namen (Charta, Harmonia, Pixel) — geen los pack nodig.
- Hermes vond de bestaande open taak `tsk-2026-07-02-001-pkm-oude-teamnamen-opruimen` (opschonen van ~15-20 losse prose-vermeldingen van oude teamnamen in PKM/) en een lege restant-map `Team/Larry - Orchestrator/journal/_template.md`.
- Op verzoek van Sander schreef Hermes een kant-en-klare terminal-prompt (niet zelf uitgevoerd) die de opruimtaak in een Claude Code terminalsessie kan laten uitvoeren, inclusief de lege Larry-map.
- Hermes downloadde de audio van de myPKA-launchvideo (YouTube, 4C2w8eIG48A) via yt-dlp en startte een Whisper-transcriptie; Sander leverde zelf al de volledige transcriptie aan (waarschijnlijk via YouTube captions), waarna het overbodige Whisper-proces gestopt is.
- Hermes citeerde het relevante stuk over `/memory` uit de video en legde de argumentatie uit (auto-memory is willekeurig, maakt vendor lock-in; session-logs zijn het portable alternatief).
- Via de `update-config` skill vond Hermes de daadwerkelijke instelling: `autoMemoryEnabled` (boolean) in settings.json.
- Op Sanders keuze (optie B) is `autoMemoryEnabled: false` toegevoegd aan `~/.claude/settings.json` (globaal, alle projecten) — bestaande memory-bestanden blijven staan maar worden niet meer gelezen/geschreven vanaf de volgende sessie.

## Decisions made

- **Question:** Waar moet `autoMemoryEnabled: false` gezet worden — alleen dit project of globaal?
  **Decision:** Globaal, in `~/.claude/settings.json`. Sander wil auto-memory overal uit, niet alleen in deze myPKA-map.
- **Question:** Wordt de PKM-oude-teamnamen-opruimtaak nu uitgevoerd?
  **Decision:** Nee, niet in deze Cowork-sessie — Sander kreeg een kant-en-klare terminal-prompt. Bij het afsluiten bleek dat hij die taak al parallel in een terminalsessie had gedraaid en afgerond (zie Open threads).

## Insights

- Deze myPKA-installatie heeft na vandaag **twee** parallelle geheugenlagen niet meer: alleen de scaffold-eigen session-logs blijven over als cross-sessie-geheugen, Claude's ingebouwde auto-memory (MEMORY.md + memory-bestanden) is uit. Toekomstige sessies moeten dus volledig op session-logs en journal/habit-bestanden leunen voor continuïteit — geen stilzwijgende aanname meer dat er ook nog een los memory-bestand meekijkt.
- De generieke myPKA README (Larry/Nolan/Pax/Mack/Silas) is een template-restant en dekt niet Sanders eigen teamnamen (Hermes/Jethro/Athena/Daedalus/Atlas/Argus/Nemesis/Charta/Harmonia/Pixel/Bezalel/Penn) — verwarrend bij het lezen, maar functioneel onschadelijk.

## Realignments

- _(none this session)_

## Open threads

- _(none)_ — `tsk-2026-07-02-001` bleek bij het afsluiten van deze sessie al gedaan en in `done/2026/07/` te staan (terminal-sessie, 2026-07-09 07:26): 15 prose-vermeldingen in 14 bestanden vervangen, één false positive (aannemer "Larry") bewust overgeslagen, lege `Team/Larry - Orchestrator/`-map verwijderd.

## Next steps

- Auto-memory-wijziging gaat pas in bij een nieuwe sessie — geen actie nodig, alleen bevestigen dat het klopt bij eerstvolgende start.

## Cross-links

- [[Team Knowledge/session-logs/2026/07/2026-07-08-20-13_hermes_adc-posters-darren-crm-darteritus-cursus-review]] — meest recente vorige sessie.

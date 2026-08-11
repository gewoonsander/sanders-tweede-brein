---
agent_id: hermes
session_id: statusline-en-beslisblokken
timestamp: 2026-08-11T06:45:20Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes", "GL-016-beslis-en-waarschuwingsblokken"]
---

# Custom statusline, nieuwe beslisblok-regel, close-session

## Context

Sander vroeg om een custom Claude Code statusline op te zetten (sessietijden, model, context/tokens, rate-limit-budget, session id) en gaf daarna een nieuwe standing instruction door: beslissingen/blokkades/afgeronde gates moeten voortaan als apart, visueel opvallend blok met unieke code aan het einde van elk antwoord.

## What we did

- Hermes creëerde `~/.claude/statusline-command.sh` (macOS/BSD stat- en date-flags), maakte het uitvoerbaar, en registreerde het via `statusLine` in `~/.claude/settings.json` zonder bestaande keys te overschrijven. jq bleek al geïnstalleerd.
- Hermes schreef [[GL-016-beslis-en-waarschuwingsblokken]] als enige bron voor de nieuwe 🔶/🔴/✅-blokregel (format, codes, stapelen aan het einde), voegde Hard Rule 10 toe aan `AGENTS.md` en een pointer-sectie aan `CLAUDE.md` — zelfde SSOT-patroon als GL-013. Ook de ontbrekende GL-013-rij in `Team Knowledge/Guidelines/INDEX.md` alsnog toegevoegd.
- Bij het afsluiten: Penn-taak (journaal) uitgevoerd — `PKM/Journal/2026/08/2026-08-11-doetinchem-en-ai-werk.md` geschreven op basis van Sanders eigen woorden (tokenlimiet tegengekomen door twee parallelle scraper-sessies; gezinsdag in Doetinchem, spellenwinkel dicht maar toch een spel gekocht; veel met AI gedaan).
- Habit-check: `PKM/My Life/Habits/schimmelcreme-gebruiken.md` bijgewerkt met bevestiging voor 2026-08-11.
- `/fewer-permission-prompts` gedraaid over de 50 meest recente transcripts (594 Bash- + 95 MCP-calls). Conclusie: de bestaande `.claude/settings.json`-allowlist dekt al elk legitiem read-only patroon; niets toegevoegd. Bewust buiten de allowlist gelaten: `ssh` naar macmini/mac-mini-van-sander en generieke `python3`/interpreter-aanroepen (equivalent aan arbitrary code execution), `scp` (schrijft naar remote host), en brede `curl`-varianten met wisselende flag-volgorde (risico op state-mutating requests).

## Decisions made

- **Question:** Waar hoort de nieuwe beslisblok-regel thuis — CLAUDE.md, AGENTS.md, of een Guideline?
  **Decision:** Zelfde SSOT-patroon als de bestaande keuzeopmaak-regel: volledige spec in een nieuwe Guideline (GL-016), CLAUDE.md en AGENTS.md wikilinken er alleen naartoe.

## Insights

- De fewer-permission-prompts-scan bevestigde dat eerdere sessies de allowlist al grondig hebben opgebouwd — een audit kan ook legitiem "niets toe te voegen" opleveren, dat is geen mislukte scan.

## Realignments

- _(geen deze sessie)_

## Open threads

- [ ] Sander moet Claude Code herstarten (app opnieuw openen, of nieuwe terminalsessie) om de nieuwe statusline te laten renderen — kon niet door Hermes zelf getriggerd worden.

## Next steps

- Bij het eerstvolgende antwoord met een echte beslissing: GL-016-blok toepassen en verifiëren dat het prettig leest in de praktijk.

## Cross-links

- [[2026-08-10-14-30_hermes_email-triage-cockpit-gl013]] — vorige sessie, laatste keer dat GL-013 werd aangescherpt.

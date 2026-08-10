---
agent_id: hermes
session_id: mac-mini-remote-toegang-vakantie
timestamp: 2026-08-10T10:40:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes"]
---

# Remote toegang tot Mac mini vanaf MacBook Air tijdens vakantie

## Context

Sander gaat op vakantie en wil vanaf zijn MacBook Air kunnen doorwerken op zijn Mac mini — met uitvoering op de krachtigere mini zelf (lokale programma's, geen tokens verbranden) in plaats van alles via AI te laten lopen. Tailscale was al opgezet tussen beide machines.

## What we did

- Hermes onderzocht welk type toegang Sander nodig had (scherm overnemen vs. alleen chatten vs. bestanden ophalen) — bleek uiteindelijk SSH-gebaseerd, uitvoering op de mini zelf.
- Hermes ontdekte dat de sessie op dat moment op de MacBook Air draaide (hostname-check), niet op de mini zoals aanvankelijk aangenomen.
- Hermes verifieerde Tailscale-connectiviteit (`tailscale status`) en wachtwoordloze SSH naar `mac-mini-van-sander` — beide werkten al.
- Hermes installeerde `tmux` via Homebrew op de mini (met akkoord van Sander) en maakte een persistente tmux-sessie `hermes` aan in `~/Documents/sanders-tweede-brein`.
- Hermes loste een PATH-probleem op door `brew shellenv` toe te voegen aan `~/.zshenv` op de mini, zodat `tmux`/`brew` ook in niet-interactieve SSH-sessies zonder volledig pad werken (met akkoord van Sander).
- Hermes ontdekte tijdens dit werk dat de `brein`-alias op de mini (`.zprofile`) naar een lege, niet-actieve duplicaatmap wijst (`Documenten - Mac mini van Sander/sanders-tweede-brein`, 3 bestanden, geen git) in plaats van de echte map (`~/Documents/sanders-tweede-brein`, git-repo, 25.559 bestanden, gekoppeld aan `github.com/gewoonsander/sanders-tweede-brein`). Sander bevestigde dat dit inderdaad een macOS/iCloud Drive "Desktop & Documents Folders"-sync-artefact is qua oorzaak.
- Hermes maakte een launcher-script `~/Scripts/connect-mini.command` op de Air dat Terminal opent, naar de mini SSH't en de `hermes` tmux-sessie attached (of aanmaakt).
- Sander heeft het script zelf naar zijn Dock gesleept na wat pogingen (Dock-strook is smal; Finder-zijbalk bleek ook lastig door nesting-in-bestaande-map-gedrag). Werkt nu.
- Sander gaf feedback dat de close-session permission-prompts-vraag (ja/nee) niet in GL-013 J/N-format was gesteld — Hermes bevestigde de fout en werkte de bestaande GL-013-memory bij met dit incident.
- Hermes draaide de `fewer-permission-prompts`-skill: geen wijzigingen nodig, bestaande allowlist bleek al toereikend; SSH-wildcard bewust niet toegevoegd (arbitraire code-executie risico).

## Decisions made

- **Question:** Screen sharing (VNC) of SSH+tmux voor remote toegang tot de mini?
  **Decision:** SSH + tmux — geen video-overhead, uitvoering blijft lokaal op de mini, sessie overleeft wifi-onderbrekingen onderweg.
- **Question:** Dock-icoon of Shortcuts-app/menubalk voor de connect-snelkoppeling?
  **Decision:** Dock-icoon — sluit aan bij Sanders bestaande voorkeur (Dock/zijbalk i.p.v. Bureaublad) en vereist geen extra GUI-configuratie.
- **Question:** SSH-wildcard toevoegen aan de permission-allowlist om de herhaalde prompt te verminderen?
  **Decision:** Bewust niet gedaan — een wildcard-SSH-regel staat gelijk aan onbeperkte code-executie op de mini, dat valt buiten wat de fewer-permission-prompts-skill mag allowlisten.

## Insights

- Deze Cowork/Hermes-sessie kan op verschillende machines draaien (Air of mini) — hostname niet aannemen, altijd verifiëren voordat je conclusies trekt over "waar" iets uitgevoerd wordt.
- De bekende duplicaat-mappenkwestie (eerder vastgelegd in memory `project_dubbele_tweede_brein_map`) is inderdaad een iCloud Drive "Desktop & Documents Folders"-sync-artefact — nu met concrete vergelijking bevestigd (lege duplicaat vs. actieve git-repo), maar nog niet opgeruimd.
- GL-013 zakt ook weg middenin een vast protocol-vraagblok uit AGENTS.md zelf (close-session permission-prompts-check) — protocoltekst is geen vrijbrief om het A/B/J/N-filter over te slaan.

## Realignments

- Sander corrigeerde: de close-session permission-prompts-vraag had J/N-format moeten hebben (zie Insights + GL-013-memory-update).

## Open threads

- [ ] `brein`-alias op de mini (`.zprofile`) wijst nog naar de lege duplicaatmap i.p.v. `~/Documents/sanders-tweede-brein` — Sander wilde er later zelf naar kijken, nog niet gecorrigeerd.
- [ ] Lege duplicaatmap `~/Documents/Documenten - Mac mini van Sander/sanders-tweede-brein` zelf nog niet opgeruimd.

## Next steps

- Sander gebruikt vanaf nu het Dock-icoon `connect-mini.command` op zijn Air om tijdens de vakantie op de `hermes`-tmux-sessie op de mini in te loggen.
- Bij gelegenheid: `brein`-alias corrigeren en/of duplicaatmap opruimen.

## Cross-links

- _(geen eerdere sessielog over dit onderwerp)_

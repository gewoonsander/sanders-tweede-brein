---
agent_id: hermes
session_id: macbook-pro-setup
timestamp: 2026-06-29T13:00:00+02:00
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# MacBook Pro setup — Claude Code & tweede brein

## Context

Sander wilde zijn tweede brein ook beschikbaar hebben op zijn oude MacBook Pro (macOS 12.7.6), met als einddoel één gesloten systeem waarbij het niet uitmaakt op welk apparaat hij werkt. Bijkomende reden: de oude Mac gebruiken om bestanden op te schonen zonder kritische data kwijt te raken.

## What we did

- **Hermes** stelde vast dat de `brein` alias eerder in de sessie niet correct was opgeslagen in `.zprofile` op de Air — alsnog gecorrigeerd met auto-pull versie.
- **Hermes** begeleidde Sander stap voor stap door de installatie op de MacBook Pro (macOS 12.7.6, Intel, bash-shell):
  - Homebrew was aanwezig maar kapot (te oud voor macOS 12). Gerepareerd via `git pull origin main` op de Homebrew-repo + verwijderen en opnieuw ophalen van homebrew-core.
  - Node.js v20 kon niet via Homebrew geïnstalleerd worden (geen pre-built bottle, Xcode CLT vereist, maar download duurde 111 uur vanwege trage wifi). Opgelost via directe pkg-download: `curl -L -o /tmp/node20.pkg https://nodejs.org/dist/v20.20.2/node-v20.20.2.pkg` + `sudo installer`.
  - Claude Code geïnstalleerd via `sudo npm install -g @anthropic-ai/claude-code` (sudo vereist vanwege permissies op `/usr/local`).
  - Repo gecloned: `git clone https://github.com/gewoonsander/sanders-tweede-brein.git ~/Documents/sanders-tweede-brein`.
  - `brein` alias ingesteld in `~/.bash_profile` (bash, niet zsh): `cd ~/Documents/sanders-tweede-brein && git pull --quiet && claude .`
  - Hermes actief bevestigd op de oude Mac.
- **Hermes** legde de handoff-flow uit: close-session op de ene Mac pusht naar GitHub, `brein` op de andere Mac pullt automatisch en laadt de sessie-logs.

## Decisions made

- **Node.js installatiemethode:** pkg van nodejs.org in plaats van Homebrew, vanwege trage wifi (Xcode CLT download zou 111 uur duren) en kapotte Homebrew-installatie.
- **Alias in `.bash_profile`:** oude Mac gebruikt bash, niet zsh — dus `.bash_profile` i.p.v. `.zprofile`.
- **Alias-vorm:** `cd ... && git pull && claude .` i.p.v. `claude ~/pad` — zodat Claude Code altijd in de juiste werkmap start en CLAUDE.md correct laadt.
- **Universal Clipboard:** werkt via rechtslikken → Plak in Terminal (Cmd+V werkt niet in Terminal op de oude Mac).

## Insights

- Op macOS 12 met een oude Homebrew-installatie: homebrew-core heeft geen remote meer en is een shallow clone. Snelste fix: `rm -rf` van de tap + `brew update` om hem opnieuw te clonen.
- Node.js pkg-installers van nodejs.org zijn pre-built en vereisen geen Xcode CLT — dit is de robuuste fallback voor systemen met trage internet of Homebrew-problemen.
- `/usr/local/Homebrew` = Intel-pad. `/opt/homebrew` = Apple Silicon. Hermes kan hier toekomstige setups aan herkennen.
- `claude ~/pad` als argument start Claude Code niet altijd in die werkmap — de terminal-werkmap blijft leidend. `cd ~/pad && claude .` is de robuuste vorm.

## Realignments

- Sander wilde Homebrew ook al een alternatieve route (nodejs.org) werd aangeboden. Hermes heeft dit gerespecteerd en Homebrew zo ver mogelijk gerepareerd voordat werd overgestapt.

## Open threads

- [ ] **Opschonen MacBook Pro** — nu Claude Code draait, kan Hermes helpen grote bestanden te vinden en te archiveren. Nog niet gestart.
- [ ] **Single source of truth** — Sander's grotere doel: alle apparaten gelijk, één gesloten systeem. Volgende stap: opschoonplan voor de Pro opstellen.
- [ ] **Bart van Meijl** — factuur VMB Advies €211,75 (vervaldatum 26 juni, achterstallig). Nog niet opgepakt vandaag.
- [ ] **Joppe-foto's review** — Todoist taak nog aanmaken.
- [ ] **ADC email** `sander.voz@amateurdarts.eu` — doorsturen, handtekening, labels.

## Next steps

- Volgende sessie op de MacBook Pro opstarten en beginnen met opschonen: grote bestanden in kaart brengen, duplicaten identificeren.
- Bart-factuur betalen.

## Cross-links

- `[[2026-06-28-22-00_hermes_adc-facebook-n8n-inboxen]]` — vorige sessie

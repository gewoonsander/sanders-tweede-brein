---
agent_id: larry
session_id: 2026-06-17-git-backup-setup
timestamp: 2026-06-17T15:00:00+02:00
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-001-file-naming-conventions"]
---

# Git backup setup — 17 juni 2026

## Context

Sander wilde zijn tweede brein backuppen via Git en koppelen aan GitHub, zodat hij ook met andere LLM's en eventueel een laptop kan werken vanuit dezelfde repo.

## What we did

- **Larry** — GitHub-repo `sanders-tweede-brein` aangemaakt (bestaande repo hernoemd).
- **Larry** — SSH-sleutel gegenereerd op Mac mini (`ed25519`) en toegevoegd aan GitHub account.
- **Larry** — `git init` + eerste commit + remote gekoppeld via SSH.
- **Larry** — Fitbit-exportbestand (`fitbit-google-health-export-2018-2026.zip`, 130 MB) uitgesloten via `.gitignore` — overschreed GitHub's 100 MB limiet.
- **Larry** — Succesvolle eerste push naar `github.com/gewoonsander/sanders-tweede-brein`.
- **Larry** — `backup.sh` aangemaakt in de root van het tweede brein: voert `git add . && git commit && git push` uit in één keer.
- **Larry** — `AGENTS.md` (root) bijgewerkt: "that's it" toegevoegd als close-session trigger met bevestigingsstap.
- **Larry** — `Team/Larry - Orchestrator/AGENTS.md` bijgewerkt: close-session routine pusht nu automatisch via computer use + `backup.sh`.

## Decisions made

- **Push-moment:** niet dagelijks automatisch, maar aan het einde van elke werksessie als onderdeel van het sluitprotocol.
- **Workflow Mac mini:** Sander bevestigt sessiesluiting → Larry schrijft log → Larry opent Terminal en voert `backup.sh` uit → GitHub bijgewerkt.
- **Laptop:** later toe te voegen via `git clone` + `git pull` bij wisselen van machine.
- **Fitbit-zip:** permanent uitgesloten via `.gitignore`. Bestand blijft lokaal aanwezig, wordt nooit gepusht.

## Insights

- GitHub accepteert geen wachtwoordauthenticatie meer voor Git-operaties — SSH is de standaardroute.
- Bestanden >100 MB blokkeren de hele push; vroegtijdig een `.gitignore` opstellen voorkomt dit.

## Open threads

- [ ] Laptop-workflow inrichten zodra Sander dat wil (`git clone` + pull/push-discipline)
- [ ] Overige open threads uit vorige sessie (Dennis, Heidi, Gino, etc.) — zie [[2026-06-16-22-00_larry_wet2025-pubqualifiers-superleague]]

## Cross-links

- [[2026-06-16-22-00_larry_wet2025-pubqualifiers-superleague]] — vorige sessie

---
agent_id: hermes
session_id: remote-toegang-mac-mini-vakantie-setup
timestamp: 2026-08-08T08:56:36Z
type: mid-session-insight
linked_sops: ["SOP-016-remote-toegang-mac-mini-op-vakantie"]
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes"]
---

# Remote toegang tot Mac mini opgezet voor vakantie

## Context

Sander gaat op vakantie en wil vanaf de camping via de terminal kunnen
doorwerken met Claude Code op zijn tweede brein, dat lokaal op de Mac mini
draait. Doel: Mac mini blijft aan en bereikbaar, zonder onnodige
veiligheidsrisico's.

## Wat we deden

- Hermes onderzocht macOS-slaapstand, schermvergrendeling (blijkt geen
  probleem voor SSH), FileVault-risico en software-update-gedrag.
- Hermes installeerde Tailscale op de Mac mini via Homebrew
  (`brew install --cask tailscale`) en hielp Sander door de
  netwerkextensie-toestemming (Systeeminstellingen → Algemeen →
  Inlogonderdelen en extensies → Extensies voor Tailscale →
  Netwerkextensies aanzetten).
- Sander installeerde en logde ook in op Tailscale op de MacBook Air.
  Beide apparaten zijn nu zichtbaar in hetzelfde tailnet:
  - `mac-mini-van-sander` — `100.111.17.89`
  - `macbook-air-van-sander` — `100.121.92.126`
- Sander zette Remote Login (SSH) aan op de Mac mini
  (`sudo systemsetup -setremotelogin on`, handmatig gedraaid — Hermes kan
  geen sudo-wachtwoorden invoeren).
- Sander testte de SSH-verbinding vanaf de MacBook Air. Eerste pogingen
  faalden met "Connection closed" — bleek een tikfout in de gebruikersnaam
  (`sandervanockenburgzwaan` zonder streepje i.p.v.
  `sandervanockenburg-zwaan`). Met de juiste naam werkte de verbinding
  meteen, en zelfs zonder wachtwoord (bestaande SSH-key, publickey-auth).
- Hermes zette sleep/disksleep uit via `pmset -a sleep 0 disksleep 0 womp 1`,
  uitgevoerd via `osascript ... with administrator privileges` (macOS'
  eigen auth-dialoog, geen sudo-wachtwoord via terminal nodig).
- Hermes constateerde dat FileVault aanstaat — bij een geforceerde herstart
  tijdens de vakantie moet iemand fysiek het FileVault-wachtwoord intikken
  voordat het netwerk weer bereikbaar is. FileVault blijft aan (bewuste
  keuze, geen security-tradeoff stilzwijgend doorgevoerd).
- Om een verrassingsherstart tijdens de vakantie te voorkomen: Hermes zette
  `AutomaticallyInstallMacOSUpdates` uit
  (`defaults write /Library/Preferences/com.apple.SoftwareUpdate
  AutomaticallyInstallMacOSUpdates -bool false`, via dezelfde
  admin-privileges-truc).
- Hermes zette een lokale `launchd`-LaunchDaemon
  (`/Library/LaunchDaemons/com.sandervanockenburg.reenable-autoupdate.plist`)
  die op **22 augustus 2026, 09:00** automatisch
  `AutomaticallyInstallMacOSUpdates` weer op `true` zet en zichzelf daarna
  opruimt (bootout + verwijder plist-bestand). Dit draait lokaal op de Mac
  mini, onafhankelijk van of er dan een actieve Claude Code-sessie is.
- Volgende stap (nog niet uitgevoerd op moment van dit log): de pending
  macOS-update (Tahoe 26.6.1) nu installeren terwijl Sander nog fysiek bij
  de Mac mini is, zodat een eventuele FileVault-prompt na herstart meteen
  opgelost kan worden.

## Decisions made

- **Vraag:** FileVault uitzetten om herstart-risico tijdens vakantie te
  elimineren?
  **Beslissing:** Nee — FileVault blijft aan, risico wordt geaccepteerd.
  Software-update-auto-install wordt in plaats daarvan tijdelijk
  uitgeschakeld om de kans op een geforceerde herstart te verkleinen.
- **Vraag:** Hoe moet auto-install na de vakantie weer aangezet worden?
  **Beslissing:** Automatisch via een lokale `launchd`-taak op de Mac mini
  zelf (niet via een cloud-cron), zodat het werkt ongeacht sessie-status.
  Trigger-datum: 2026-08-22 09:00 (Sander is dan terug, 14 dagen vanaf
  8 augustus).

## Insights

- `sudo`-commando's kunnen niet via de Bash-tool van deze sessie draaien
  (geen TTY voor wachtwoordinvoer). `osascript -e 'do shell script "..."
  with administrator privileges'` werkt wel — macOS toont dan zijn eigen
  auth-dialoog, die Sander (of een reeds actieve beheerderssessie/Touch ID)
  bevestigt, zonder dat er een wachtwoord door de chat hoeft.
- Schermvergrendeling/screensaver blokkeert SSH-toegang niet — dat is een
  veelvoorkomend misverstand. Alleen systeem-slaapstand (niet schermslot)
  is het echte probleem voor remote bereikbaarheid.
- Bij macOS Tahoe zit de toestemming voor een systeemextensie (zoals
  Tailscale) niet in het hoofdscherm van Privacy & Beveiliging, maar onder
  Systeeminstellingen → Algemeen → Inlogonderdelen en extensies →
  Netwerkextensies.
- "Connection closed by <ip> port 22" direct na de host-key-prompt is bij
  macOS meestal **geen** firewall/ACL/VPN-probleem — eerst de
  gebruikersnaam op tikfouten controleren voordat dieper gegraven wordt.

## Realignments

- _(geen dit keer)_

## Open threads

- [ ] macOS-update (Tahoe 26.6.1) nog installeren op de Mac mini — vereist
      herstart, Sander moet er fysiek bij zijn voor het FileVault-wachtwoord.
      Deze sessie overleeft de herstart mogelijk niet.
- [ ] Bevestigen op 22 augustus 2026 dat de `launchd`-taak daadwerkelijk is
      afgevuurd en `AutomaticallyInstallMacOSUpdates` weer op `true` staat.
- [ ] `SOP-016-remote-toegang-mac-mini-op-vakantie` gebruiken als
      referentie-instructie op de camping.

## Next steps

- macOS-update installeren (met Sander fysiek aanwezig).
- Na herstart: verifiëren dat SSH/Tailscale weer bereikbaar zijn.
- SOP-016 raadplegen voor de exacte terminal-stappen vanaf de camping.

## Cross-links

- [[SOP-016-remote-toegang-mac-mini-op-vakantie]]

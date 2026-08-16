---
agent_id: hermes
session_id: invoerregister-mediahub-en-rclone
timestamp: 2026-08-16T10:35:53+02:00
type: close-session
linked_sops: [SOP-013-inboxen-verwerken, SOP-017-verwerk-voedingsregistratie]
linked_workstreams: [WS-001-daily-journaling]
linked_guidelines: [GL-001-file-naming-conventions, GL-020-informatie-invoer-uitvoer-en-levenscyclusregister]
---

# Invoerregister, Mediahub en Google Drive-route

## Context

Sander wilde zijn tweede brein verder inrichten rond één single source of truth, zo min mogelijk inboxen en een heldere levenscyclus voor bestanden. Daarna is de route voor grote videobestanden praktisch beproefd via de Mediahub, Google Drive en rclone.

## What we did

- Atlas ontwierp en implementeerde `[[GL-020-informatie-invoer-uitvoer-en-levenscyclusregister]]`, met de Team Inbox als enige menselijke beoordelingswachtrij en een veilige copy–verify–delete-regel.
- Hermes verwerkte de gevolgen in `[[GL-001-file-naming-conventions]]`, `[[SOP-013-inboxen-verwerken]]`, `[[WS-001-daily-journaling]]`, de Team Inbox-uitleg en de headless inboxprompt.
- Hermes controleerde Downloads op de MacBook Air en bracht drie videobestanden veilig over naar de juiste domeinen op de SSD Mediahub van de Mac mini; bronbestanden zijn pas na grootte- en SHA-256-verificatie verwijderd.
- Daedalus testte Google Drive eerst via de connector en daarna via de bestaande lokale rclone-configuratie. De connector werkte voor 17 MB, maar niet voor 79 MB; rclone voltooide de 79 MB-overdracht wel en de hash klopte ook op de Mac mini.
- Penn registreerde één gekookt ei in `[[2026-08-16-voedingslogboek]]`, markeerde de dag compleet en legde vast dat de schimmelcrème is aangebracht.

## Decisions made

- **Question:** Waar komen bestanden het systeem binnen?  
  **Decision:** Alleen `Team Inbox/` is de menselijke beoordelingswachtrij; technische landingszones zijn transportpunten en geen extra inboxen.
- **Question:** Hoe worden grote video-overdrachten veilig afgerond?  
  **Decision:** Altijd eerst kopiëren, daarna omvang en hash verifiëren, en pas vervolgens de bron verwijderen.
- **Question:** Welke route heeft voorlopig de voorkeur voor grote videobestanden?  
  **Decision:** Directe SSH naar de Mediahub is in de meting sneller dan de bestaande rclone-route. Google Drive blijft relevant voor cloudbeschikbaarheid, maar de rclone-configuratie krijgt eerst een eigen Google OAuth-client.

## Insights

- De bestaande rclone-installatie op de MacBook Air is actief en gekoppeld aan `gdrive:`, maar gebruikt nog de gedeelde rclone-client-ID die in 2026 wordt uitgefaseerd.
- Een rechtstreekse overdracht naar de Mac mini behaalde circa 1,3–1,5 MB/s; de rclone-test circa 0,26 MB/s. Eén test is indicatief en nog geen definitieve benchmark.
- De Cockpit-mirror kon na de voedingsregistratie niet regenereren omdat `PyYAML` in de gebruikte lokale Python-omgeving ontbreekt. Markdown is correct en blijft canoniek.

## Realignments

- Sander wilde niet dat er direct werd gebouwd aan de centrale Mac-mini-aanpak; eerst moest het ontwerp en de werking worden uitgelegd en onderzocht.
- Sander verduidelijkte dat één single source of truth een harde systeemwaarde is en dat hij zo weinig mogelijk inboxen wil.

## Open threads

- [ ] In Google Cloud een eigen Desktop OAuth-client voor rclone aanmaken, lokaal in rclone configureren en de 79 MB-test herhalen.
- [ ] De tijdelijke rclone-benchmarkkopie in `gdrive:backup film van macbook air/` na de vervolgtest opruimen.
- [ ] Bepalen of het lokale `PyYAML`-hiaat wordt opgelost via de bestaande gebundelde runtime of een expliciete installatie.
- [ ] De resterende Downloads volgens het nieuwe register classificeren en verwerken.

## Next steps

- Hervat bij de open Google Cloud-inlogpagina, voltooi Sanders herauthenticatie en maak daarna de eigen OAuth-client aan zonder secrets in myPKA of chat vast te leggen.
- Herhaal dezelfde rclone-benchmark en vergelijk snelheid, betrouwbaarheid en gebruiksgemak met directe SSH naar de Mediahub.

## Cross-links

- `[[2026-08-14-19-56_hermes_audio-transcribe-naming-fix-close-session]]` — eerdere inrichting van de Mac mini als centraal werkpaard voor media- en transcriptiewerk.
- `[[2026-08-15-18-30_hermes_bestelstatus-bij-dagstart]]` — vorige close-session met automatiseringsafspraken voor de dagstart.

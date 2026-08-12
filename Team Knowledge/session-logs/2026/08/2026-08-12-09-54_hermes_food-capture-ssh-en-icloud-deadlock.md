---
agent_id: hermes
session_id: 2026-08-12-voedingsfoto-diagnose
timestamp: 2026-08-12T09:54:00+02:00
type: mid-session-insight
linked_sops: ["SOP-016-remote-toegang-mac-mini-op-vakantie", "SOP-017-verwerk-voedingsregistratie"]
linked_workstreams: ["WS-007-voeding-vastleggen-en-controleren"]
linked_guidelines: []
---

# Food-capture: verouderde SSH-alias en iCloud-deadlock

## Wat ik ontdekte

Mijn eerste SSH-controle gebruikte alias `macmini`, die in `~/.ssh/config` nog naar het lokale thuisnetwerkadres `10.0.0.69` wees. De MacBook Air zat op `192.168.0.0/24`; daardoor gaf deze route terecht `network unreachable`, ook al stond de Mac mini aan en was hij via Tailscale online. Het canonieke Tailscale-IP uit [[SOP-016-remote-toegang-mac-mini-op-vakantie]] (`100.111.17.89`) werkte direct.

Op de Mac mini bleek vervolgens:

- `nl.gewoonsander.food-capture` is geïnstalleerd, geladen en actief;
- de voedingsfoto van 12 augustus 09:33 staat in de canonical `Team Inbox/Documents/`;
- de watcher verwerkt hem niet doordat `Path.read_bytes()` tijdens iCloud-materialisatie faalt met `OSError: [Errno 11] Resource deadlock avoided`;
- de watcher vangt deze fout niet per bestand af en crasht daardoor de volledige scan;
- zodra het bestand handmatig read-only werd geopend, was het wel leesbaar, maar er ontstond geen nieuwe WatchPaths-trigger en het bestand bleef onverwerkt.

## Implicaties

De SSH-alias moet uiteindelijk naar de Tailscale-hostnaam of het vaste Tailscale-IP verwijzen. De food-watcher heeft daarnaast per-bestand retry/backoff en foutisolatie nodig voor iCloud-placeholders; één tijdelijk onleesbaar bestand mag de hele inboxscan niet beëindigen. Na materialisatie moet een retry zelfstandig plaatsvinden, niet alleen na een nieuw filesystemevent.

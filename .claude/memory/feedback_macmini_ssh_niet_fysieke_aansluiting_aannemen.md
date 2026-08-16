---
name: feedback-macmini-ssh-niet-fysieke-aansluiting-aannemen
description: "Bij Mediahub-werk vanaf de MacBook Air eerst de macmini-SSH-route checken, niet aannemen dat fysieke SSD-aansluiting nodig is"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 53fc71f0-5736-4668-85e5-4bbb126ff9b9
  modified: 2026-08-16T11:06:57.619Z
---

Neem bij Mediahub-overdrachten vanaf een andere Mac dan de Mac mini niet aan dat er gewacht moet worden tot de Lexar SSD lokaal wordt aangesloten. Sander heeft de `macmini`-SSH-hostalias (via Tailscale) juist opgezet zodat er vanaf de MacBook Air op de Mac mini gewerkt kan worden, inclusief bestandsoverdrachten naar de daar aangesloten Mediahub-SSD.

**Why:** Tijdens een Downloads-opruimronde zei Hermes dat Fase 2 (verplaatsen naar Mediahub) moest wachten tot de SSD lokaal aangesloten was, en generaliseerde daarmee de blocker uit [[tsk-2026-08-15-001]] (5 grote video's, te traag over de tunnel) naar alle Mediahub-werk. Sander corrigeerde dit: hij had de SSH-toegang specifiek voor dit doel ingericht. Een snelheidstest bevestigde ~1 MB/s over de tunnel — traag voor losse grote video's (meerdere GB), maar prima werkbaar op de achtergrond voor batches met vooral kleinere bestanden (~1-2 GB in ~30 min).

**How to apply:** Check bij elke Mediahub-actie vanaf een niet-Mac-mini-apparaat eerst of `ssh macmini` bereikbaar is en of de Mediahub-map daar leesbaar is, vóór je concludeert dat iets moet wachten. Onderscheid: kleine/middelgrote batches (tot een paar GB) → gewoon via SSH/scp/rsync op de achtergrond, geen blocker. Individuele grote videobestanden (meerdere honderden MB tot GB's per stuk) → overweeg alsnog te wachten op lokale aansluiting, of waarschuw expliciet voor de duur voordat je start. Zie ook [[SOP-013-inboxen-verwerken]] stap 4, die dit onderscheid al noemt maar niet als harde regel had vastgelegd.

---
agent_id: hermes
session_id: edgartv-darts-verkenning-en-transcripties
timestamp: 2026-08-19T16:59:39Z
type: close-session
linked_sops: ["SOP-013-inboxen-verwerken"]
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes"]
---

# EdgarTV Darts verkend en deels getranscribeerd

## Context

Vervolg op dezelfde doorlopende sessie als het vorige close-session-log van 18 augustus. Sander vroeg eerst een losse `ls`, signaleerde een los mp4-bestand in de vault-root, en vroeg daarna onderzoek naar het YouTube-kanaal EdgarTV Darts (`@Edgartvdarts`) — eerst verkennend, daarna gericht transcriberen van de twee relevante afspeellijsten.

## What we did

- Hermes signaleerde een los bestand in de vault-root (`Professionals Need Systems, Not Just Notes #shorts [-qOMnlDWjBQ].mp4`) — nog niet opgevolgd, Sander is er niet op teruggekomen.
- Hermes verkende het kanaal EdgarTV Darts via `yt-dlp` (flat-playlist, geen downloads): kanaalbeschrijving, alle 10 afspeellijsten geïnventariseerd, steekproeven van titels per lijst genomen. Geïdentificeerd: kanaal van Matthew Edgar (12 jaar prof. dartspeler, nu pundit/commentator voor Sky Sports Darts/Modus/PDC), 522 video's. Twee afspeellijsten gematcht op Sanders vraag naar "rekenwerk, tactiek en training": "Darts Training Videos" en "How to become a darts master" (met Dartsmad.com).
- Hermes draaide de `transcribeer`-skill op beide afspeellijsten (`--alles`). "Darts Training Videos": 22 van 26 gelukt (incl. beide "Master Darts Counting"-video's over rekenwerk), 4 mislukt op een YouTube IP-blokkade (zowel ondertitels als lokale Whisper-terugval kregen HTTP 403). "How to become a darts master" (15 video's): volledig geblokkeerd, preflight-check stopte de hele batch voordat er iets werd opgehaald.
- Firecrawl als omweg geprobeerd (zowel via de skill se eigen env-var-route als rechtstreeks via de `mcp__firecrawl-mcp__firecrawl_scrape`-tool) — beide faalden op ontbrekende/ongeldige API-autorisatie. Niet verder onderzocht binnen deze sessie.
- De 22 gelukte transcripties gecommit en gepusht (`d94e8d0`) zodat Sander ze op een ander apparaat (MacBook Air op de camping) kon oppikken via `git pull`.
- Sander vroeg een tweede poging in dezelfde sessie — nog steeds geblokkeerd, geen verdere herhaling gedaan (conform de skill se eigen "niet meteen opnieuw proberen"-regel).
- Sander vroeg of hij, nu op een ander netwerk (MacBook Air), verder kon — Hermes controleerde feitelijk (hostname/publiek IP) dat deze sessie op de Mac mini draait, niet op de MacBook Air, en dat een ander netwerk op de MacBook dus alleen helpt als het script daar rechtstreeks draait.

## Decisions made

- _(geen bindende beslissingen dit deel van de sessie — vooral onderzoek en een gedeeltelijk gelukte dataophaling)_

## Insights

- De IP-blokkade van YouTube werkt per uitvoerende machine/netwerk, niet per Claude-sessie — een sessie die op de Mac mini draait blijft de Mac mini se IP gebruiken, ook als Sander zelf op een ander netwerk zit. Voor een echte ontwijking moet het script op het andere apparaat zelf draaien.
- De Firecrawl-omweg die de `transcribeer`-skill sinds 18 augustus belooft, werkt in de praktijk nog niet in deze omgeving: zowel de env-var-route (`FIRECRAWL_API_KEY` ontbreekt) als de losse MCP-tool (ongeldige token) faalden. Dit ondermijnt de blokkade-bestendigheid die de skill claimt — waard om apart te laten uitzoeken (Daedalus?) voordat er weer op grote schaal getranscribeerd wordt.

## Realignments

- _(geen)_

## Open threads

- [ ] Los mp4-bestand in de vault-root (`Professionals Need Systems, Not Just Notes #shorts [-qOMnlDWjBQ].mp4`) nog niet geclassificeerd/verplaatst volgens SOP-013.
- [ ] "How to become a darts master" playlist (15 video's, EdgarTV Darts) nog volledig te transcriberen — 4 video's uit "Darts Training Videos" ook nog open. Lukt pas met een ander netwerk (bv. rechtstreeks op de MacBook Air) of na verstrijken van de YouTube-blokkade.
- [ ] Firecrawl-koppeling (env-var én MCP-token) is kapot/ontbreekt — blokkeert de bedoelde IP-blokkade-omzeiling van de `transcribeer`-skill.

## Next steps

- Zodra Sander de resterende video's zelf op de MacBook Air probeert (of de blokkade verloopt): de twee eerder gegeven commando's opnieuw draaien, ze slaan het al gedane automatisch over.
- Firecrawl-toegang herstellen voor de `transcribeer`-skill (aparte actie, niet urgent).

## Cross-links

- `[[2026-08-18-13-59_hermes_teaminbox-adc-verslag-hengelo-automatisering-fixes]]` — vorig close-session-log in dezelfde doorlopende sessie.

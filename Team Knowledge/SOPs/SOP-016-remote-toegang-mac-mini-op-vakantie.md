---
sop_id: SOP-016
title: Remote toegang tot de Mac mini vanaf een andere locatie (vakantie)
owner: Sander
status: active
triggers:
  - "hoe kom ik bij mijn Mac mini vanaf de camping"
  - "hoe open ik cloud/Claude Code op mijn tweede brein op afstand"
  - vakantie/onderweg, geen fysieke toegang tot de Mac mini
tags:
  - remote-access
  - tailscale
  - ssh
  - infra
last_updated: 2026-08-08
---

# SOP-016 — Remote toegang tot de Mac mini op vakantie

## Doel

Vanaf elke locatie met internet (camping, mobiele data) via de terminal
inloggen op de Mac mini en daar Claude Code starten op de tweede-brein-repo
— dezelfde lokale installatie, dezelfde bestanden, dezelfde MCP-servers,
geen aparte clone nodig.

## Vereisten (eenmalig ingesteld op 2026-08-08)

- Tailscale geïnstalleerd en ingelogd op zowel de Mac mini als het apparaat
  waarmee je verbindt (bijv. MacBook Air), met hetzelfde account.
- Remote Login (SSH) staat aan op de Mac mini.
- Sleep staat uit op de Mac mini (`pmset -a sleep 0`) — hij blijft dus aan
  en bereikbaar.
- Automatische software-update-installatie staat tijdelijk uit (voorkomt
  een onverwachte herstart tijdens de vakantie). Gaat automatisch weer aan
  op 22 augustus 2026.

## Stap 1 — Open Terminal

Op elk apparaat waar Tailscale op draait en waar je op ingelogd bent
(MacBook Air, of een ander apparaat met Tailscale + SSH-client).

## Stap 2 — SSH naar de Mac mini

```
ssh sandervanockenburg-zwaan@mac-mini-van-sander
```

**Let op de exacte gebruikersnaam:** `sandervanockenburg-zwaan` — mét het
streepje tussen "ockenburg" en "zwaan". Een tikfout hierin (bijv.
`sandervanockenburgzwaan` zonder streepje) geeft een verwarrende
`Connection closed by <ip> port 22`-melding die op een netwerk- of
firewallprobleem lijkt, maar dat gewoon niet is.

Er is al een SSH-key ingesteld, dus dit vraagt normaal gesproken **geen
wachtwoord** — je logt automatisch in via publickey-authenticatie.

Werkt de naam `mac-mini-van-sander` onverhoopt niet (bijv. DNS-probleem),
gebruik dan het vaste Tailscale-IP:

```
ssh sandervanockenburg-zwaan@100.111.17.89
```

## Stap 3 — Start Claude Code op de tweede brein

Zodra je in de shell van de Mac mini zit:

```
claude ~/Documents/sanders-tweede-brein
```

Dit opent Claude Code direct in de originele lokale repo — met volledige
toegang tot alles wat alleen lokaal werkt (lokale Whisper-transcriptie,
lokaal geconfigureerde MCP-servers, etc.), in tegenstelling tot een
cloud-sessie of een losse clone op een ander apparaat.

## Troubleshooting

- **"Connection closed" direct na de host-key-prompt** → controleer eerst
  de gebruikersnaam op tikfouten (zie Stap 2). Dit is de meest
  waarschijnlijke oorzaak, geen firewall/VPN-probleem.
- **SSH lukt niet, timeout** → check op beide apparaten of Tailscale actief
  is (icoontje in de menubalk, status "Connected"). `tailscale status`
  in Terminal toont of beide apparaten elkaar zien.
- **`claude: command not found`** → `claude` staat op
  `~/.local/bin/claude`; als dat niet in `$PATH` zit, gebruik het volledige
  pad of open een nieuwe shell (`.zprofile` zou dit al moeten regelen).

## Gerelateerd

- [[2026-08-08-10-56_hermes_remote-toegang-mac-mini-vakantie-setup]] — het
  sessielog van de dag waarop dit is opgezet, met de volledige context en
  beslissingen (FileVault, software-update-timing, etc.).

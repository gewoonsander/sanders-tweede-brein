---
agent_id: argus
session_id: bunq-connector-designaudit-2026-08-17
timestamp: 2026-08-17T13:00:00Z
type: end-of-session
linked_sops: ["SOP-004-argus-security-audit"]
linked_workstreams: []
linked_guidelines: []
---

# Argus — pre-implementatie designaudit bunq-saldo-connector

## Wat ik deed

Pre-implementatie security-audit (geen code bestaat nog) op het architectuurontwerp voor de bunq-saldo-koppeling in de myPKA Cockpit: [[2026-07-05-bunq-saldo-cockpit-design]] plus de negenpunts-checklist in [[2026-08-17-bunq-mcp-koppeling-onderzoek]] §4. Getoetst op zes specifieke vragen van Hermes/Daedalus: GET-only-afdwinging op code-niveau, compenserende maatregelen tegen het betaalrisico van een gecompromitteerde key (bunq biedt geen read-only-scope), `permitted_ips`-haalbaarheid bij wisselende netwerken, LAN-mode-risico specifiek voor bankdata, de 10/dag-rate-limit op setup/installation-endpoints, eindverdict.

Volledig verslag: [[2026-08-17-argus-bunq-connector-audit]].

## Methodologie

Geen code-audit mogelijk (connector bestaat nog niet) — dus getoetst of de *ontwerp-intenties* concreet genoeg zijn om straks een code-level controle te dwingen, in plaats van proza-belofte te blijven. Gegrond in bestaande Cockpit-codebasepatronen als referentiepunt: `server/connectors/todoist.js` (scope-locked write-methodes als precedent voor hoe smal een write-oppervlak eruit moet zien — hier vertaald naar "geen enkele write-methode, punt"), `server/connectors/env.js` (`readEnvKey`/`maskSecret`-patroon), `server/auth.js` (bestaande PIN-gate: scrypt-hash, constant-time, 5-pogingen-lockout), `server/invoicesApi.js` (calm-degradation-contract `{ available: false }`), `SECURITY.md` (bevestigt: finance-connectors zijn expliciet "unsupported example pattern... user's own responsibility").

## Eindverdict

**YELLOW.** Architectuurkeuze (Aanpak A, directe read-only connector, geen MCP) is gezond en is de veiligste van de drie routes die het onderzoek zelf afweegt. Maar vijf van de zes getoetste punten hebben nu alleen proza-intentie, geen code-afdwingbare eis. Twee blokkerende eisen vóór bouwstart (geen overrule-pad): (1) `bunqClient.js` mag geen generieke `request(method, path)` exporteren — alleen hardcoded-GET `signedGet(path)` met allowlist-check + unit-test; (2) `ensureInstallation()`-guard die eerst bestaande tokens checkt vóór `installation`/`device-server` aangeroepen wordt, plus sandbox-verificatie van welke rate-limit-bucket `session-server` valt. Eén operationele afspraak die vastgelegd moet worden: `permitted_ips` concreet, nooit wildcard. Twee niet-blokkerende maar wel aanbevolen maatregelen: compenserende controles tegen het betaalrisico van een gecompromitteerde sleutel (aparte sleutel per rekening, geteste intrekprocedure), en bunq-kaart standaard uit bij LAN-toegang.

De al eerder afgesproken tweede Argus-audit ná implementatie, vóór eerste gebruik van een productiesleutel, blijft staan — dit designreview vervangt die niet.

## Wat de volgende agent moet weten

- Als Daedalus/Bezalel de connector gaat bouwen: de twee blokkerende eisen (allowlist-enforcement, installation-persistence-guard) horen in het bouwplan, niet als nice-to-have achteraf.
- Open verificatiepunten die niet bij mij horen maar wel de productie-activatie blokkeren: bunq Pro/Elite-plan-eis voor de Gewoon-Sander-rekening (onbevestigd), of View-Only-rol via API daadwerkelijk werkt (onbevestigd, sandbox-test nodig), welke rate-limit-bucket `session-server` valt (onbevestigd).
- Ik heb geen enkele credential aangeraakt of geraadpleegd — er is nog niets in `.env` geschreven voor bunq (bevestigd door Daedalus' onderzoek: "nul BUNQ_*-sleutels").

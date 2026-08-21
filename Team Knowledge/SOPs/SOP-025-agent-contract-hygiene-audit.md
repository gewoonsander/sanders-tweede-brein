---
sop_id: SOP-025
title: Agent-contract-hygiëne-audit
owner: Jethro
status: active
triggers:
  - kwartaal-scheduled task (automatisch)
  - "check de agent-contracten"
  - "zijn de specialisten nog actueel"
  - "audit het team"
tags:
  - team
  - hygiene
  - onderhoud
  - freshness
last_updated: 2026-08-21
---

# SOP-025 — Agent-contract-hygiëne-audit

**Reusable by any agent.** Default executor is Jethro (hij beheert [[agent-index]] en
tekent elk contract), maar elke agent kan deze procedure aanroepen bij twijfel over een
specifiek specialist-contract.

## Doel

Elke specialist draait op twee artefacten: het wiki-contract (`Team/<Name> -
<Role>/AGENTS.md`) en de host-shim (`.claude/agents/<slug>.md`). Beide worden bij hire
zorgvuldig geschreven ([[SOP-001-how-to-add-a-new-specialist]]), maar niemand controleert
ze daarna: scope schuift, tools worden niet meer gebruikt of juist stilzwijgend nodig,
wikilinks binnen een contract verwijzen naar een inmiddels hernummerd of verplaatst
SOP/GL, en de wiki-contract en de shim lopen uit elkaar. Zonder onderhoud ontstaat precies
het patroon dat [[SOP-014-refresh-platform-specialist-knowledge]] voor platform-kennis al
beschrijft: een specialist die zelfverzekerd opereert op een verouderde eigen specificatie.

Deze SOP is de analoge, lichte refresh voor de **contracten zelf** — niet voor de
platform-kennis die een specialist gebruikt (dat blijft SOP-014) en niet voor de
model-tiering (dat blijft [[GL-015-agent-model-tier-review]], eigen kwartaalcadans, eigen
eigenaar). Deze SOP gaat alleen over: klopt het contract nog met wat de rol daadwerkelijk
doet en waar hij naartoe verwijst?

## Trigger

- **Automatisch, per kwartaal** — scheduled task, zie sectie "Scheduled task" hieronder.
  Kan los van of gecombineerd met de SOP-014-scheduled-task lopen; verschillende eigenaar
  (Jethro i.p.v. Athena), dus geen samenvoeging tot één taak nodig.
- **On-demand** — Sander of een specialist vermoedt concreet dat een contract niet meer
  klopt (bijv. een specialist krijgt een taak die zijn `description:` niet dekt, of een
  wikilink in een contract blijkt dood).

## Stap 1 — Lees de roster

Open [[agent-index]] voor de volledige lijst actieve specialisten (naam, folder, slug).
Elke specialist in de tabel wordt in Stap 2 t/m 4 langsgelopen.

## Stap 2 — Contract vs. shim: sync-check

Voor elke specialist, lees `Team/<Name> - <Role>/AGENTS.md` naast `.claude/agents/<slug>.md`
(en eventuele andere host-shims — zie de hosts-matrix in
[[SOP-001-how-to-add-a-new-specialist]] §5). Controleer:

- Beschrijft de shim-`description:` nog dezelfde scope als het wiki-contract? Een shim die
  een taak claimt die het contract niet (meer) dekt, of andersom, is drift.
- Is de shim-`tools:`-lijst nog minimaal én compleet — geen tools die de rol nooit gebruikt,
  geen ontbrekende tool die de description wél belooft?
- Verwijst de shim nog naar het juiste contractpad (geen hernoemde `Team/`-map die de shim
  is misgelopen — precedent: de teamnaam-cleanup van 2026-07-02/2026-08-12 in
  [[Team Knowledge/INDEX]] §Cross-session learnings)?

## Stap 3 — Wikilink-integriteit binnen het contract

Voor elk `[[wikilink]]` in het wiki-contract: bestaat het doelbestand nog? Dit is een
gerichte, contract-scoped check — geen volledige repo-brede linkaudit (dat is
[[SOP-021-audit-pkm-graafhygiene]], en blijft die SOP's taak). Een dode link in een
specialist-contract betekent typisch: het gerefereerde SOP/GL is hernummerd, hernoemd, of
gearchiveerd zonder dat het contract is meegenomen.

## Stap 4 — Routing-check

Staat de specialist nog correct vermeld in:

- de team-tabel in root-`AGENTS.md`;
- de Skills Register in root-`AGENTS.md`, indien de specialist eigenaar is van een skill
  daar;
- [[agent-index]] zelf (naam, rol, folder, trigger-patterns nog kloppend)?

## Stap 5 — Bevindingen vastleggen, nooit stilzwijgend overschrijven

Gebruik dezelfde conventie als [[SOP-014-refresh-platform-specialist-knowledge]]: een
verouderd of onjuist gebleken stuk contract wordt niet stil aangepast. Voeg een
`> **Correctie (YYYY-MM-DD):** ...`-regel toe op de plek van de afwijking, en corrigeer
het onderliggende feit pas na die zichtbare markering. Bij een dode wikilink: repareer of
verwijder de link en noteer in de wijzigingsregel waarom.

## Stap 6 — Meld substantiële afwijkingen proactief

Contract/shim uit sync, een structurele scope-drift, of een specialist die feitelijk een
andere rol vervult dan zijn contract beschrijft — meld dit expliciet aan Hermes/Sander in
plaats van het stilzwijgend te herstellen en door te gaan. Dit soort afwijkingen kan
betekenen dat routering elders (bijv. in Skills Register of een Workstream) ook niet meer
klopt.

## Stap 7 — Log de auditpas

Korte entry in de eerstvolgende sessielog: welke specialisten gecontroleerd zijn, wat (indien
iets) gecorrigeerd is, of "geen afwijkingen gevonden". Onderdeel van het team-geheugen zodat
een volgende auditpas weet wanneer en wat er eerder gecheckt is.

## Scheduled task

Een scheduled task draait deze procedure elk kwartaal automatisch over de volledige roster.
Bij afronding rapporteert de task kort aan Sander: hoeveel specialisten gecontroleerd zijn en
of er iets substantieels gecorrigeerd is.

**Actief sinds 2026-08-21, als lokale LaunchAgent** — niet als Anthropic-cloud scheduled
task, zie [[GL-005-llm-agnostic-portable-core]] Rule 5. Een eerder aangemaakte cloud-versie
van deze taak (via het scheduled-tasks-mechanisme) is bewust weer verwijderd nadat bleek dat
een vergelijkbare cloud-taak voor SOP-014 stilzwijgend was verdwenen.

LaunchAgent `nl.gewoonsander.agent-contract-hygiene-audit`
(`scripts/nl.gewoonsander.agent-contract-hygiene-audit.plist`, geïnstalleerd op de Mac mini),
draait `scripts/agent-contract-hygiene-audit.sh` → `scripts/agent-contract-hygiene-audit.prompt.md`.
Cadans: 21 jan/apr/jul/okt, 09:00 lokale tijd. Eerstvolgende run: 21 oktober 2026. Bewust een
andere dag dan de SOP-014-cadans (14e) om de twee kwartaal-routines te spreiden. Verifiëren
dat de job leeft: `launchctl print gui/$(id -u)/nl.gewoonsander.agent-contract-hygiene-audit`
op de Mac mini.

## Wat deze SOP nadrukkelijk niet doet

- Geen model-tier-beoordeling — dat is [[GL-015-agent-model-tier-review]], eigen cadans en
  eigen trigger-events.
- Geen platform-kennisdossier-refresh (Martonny/Tonnymart-achtige dossiers) — dat blijft
  [[SOP-014-refresh-platform-specialist-knowledge]].
- Geen repo-brede PKM-linkaudit — dat blijft [[SOP-021-audit-pkm-graafhygiene]].
- Geen nieuwe hire-beslissingen — signaleert een gat hoogstens aan Hermes, die vervolgens
  zelf beoordeelt of [[SOP-001-how-to-add-a-new-specialist]] in beeld komt.

## Gerelateerd

- [[SOP-001-how-to-add-a-new-specialist]] — de procedure die het oorspronkelijke contract +
  shim oplevert.
- [[SOP-014-refresh-platform-specialist-knowledge]] — het analoge patroon voor
  platform-kennisdossiers, structureel vergelijkbaar, ander onderwerp.
- [[GL-015-agent-model-tier-review]] — de analoge cadans voor modelkeuze, expliciet
  buiten scope van deze SOP.
- [[agent-index]] — de roster die Stap 1 doorloopt.

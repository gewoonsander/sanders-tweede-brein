---
agent_id: hermes
session_id: dagobert-duck-hire-2026-08-17
timestamp: 2026-08-17T11:30:00Z
type: mid-session-insight
linked_sops: ["SOP-001-how-to-add-a-new-specialist", "SOP-004-argus-security-audit", "SOP-create-task"]
linked_workstreams: []
linked_guidelines: ["GL-016-beslis-en-waarschuwingsblokken", "GL-022-financiele-koppelingen-dashboard-scope"]
---

# Aanwerving Dagobert Duck — Persoonlijke Financiële Assistent

## Context

Sander wil meer overzicht en verantwoordelijkheid over zijn financiën. Hij vroeg om een nieuwe teamspecialist ("Dagobert Duck") die saldo's kan opvragen en signalen/aanbevelingen geeft op basis van door hemzelf aangeleverde regels, met toegang tot zijn bunq-bankrekening via een MCP-server.

## Wat we deden

- **Athena** leverde de SOP-001-onderzoeksbrief: [[2026-08-17-financieel-assistent-hire-research]] — kerncompetenties, anti-patterns (banksaldo tonen als "vrij besteedbaar" zonder verplichtingen eraf te trekken; zakelijk/privé door elkaar husselen), naamcheck "Dagobert Duck" akkoord bevonden.
- **Daedalus** onderzocht BUNQ-koppelingsopties: [[2026-08-17-bunq-mcp-koppeling-onderzoek]]. Kernbevinding: bunq biedt geen strikte read-only-scope (API-key of OAuth kan altijd ook betalen); de twee bestaande third-party bunq-MCP-servers hebben beide betaal-tools ingebouwd (prompt-injectie-risico naar een betaalfunctie). Daedalus vond bovendien een al bestaand, nooit afgerond ontwerp van 5 juli ([[2026-07-05-bunq-saldo-cockpit-design]]) dat al een veiliger alternatief had uitgewerkt: een directe, read-only Cockpit-connector.
- **Sander koos** (na presentatie van deze bevinding) voor de veiligere route: geen MCP-server, wél de directe Cockpit-connector; elke bunq-rekening/potje als aparte regel getoond; bunq Pro bevestigd aanwezig op zowel Gewoon Sander (ZZP) als AKP Gezinshuis.
- **Jethro** stelde het contract op: `[[Team/Dagobert Duck - Persoonlijke Financiële Assistent/AGENTS]]` + de Claude Code-shim `.claude/agents/dagobert-duck.md`, en registreerde de specialist in `Team/agent-index.md` en de root `AGENTS.md`-teamtabel (16 specialisten).
- **Argus** deed een pre-implementatie designaudit op het bunq-connectorontwerp: [[2026-08-17-argus-bunq-connector-audit]] — verdict **YELLOW**. Volledig verslag en methodologie in Argus' eigen sessielog: [[2026-08-17-13-00_argus_bunq-connector-designaudit]].
- **Daedalus** schreef de teambrede documentatie: [[GL-022-financiele-koppelingen-dashboard-scope]] — wat wel/niet gebouwd mag worden rond financiële data in de Cockpit, met Argus' eisen als afvinklijst.
- **Sander keurde** het contract goed (activatie); **Jethro** zette `agent_status: active`. **Atlas** draait de Cockpit-roster-parity-check (SOP-001 §9) — resultaat volgt.
- **Hermes** legde de bouwfase van de bunq-connector vast als open taak in plaats van meteen te starten: [[tsk-2026-08-17-001-bouw-bunq-saldo-cockpit-connector]].

## Decisions made

- **Vraag:** MCP-server voor bunq (zoals oorspronkelijk gevraagd), of directe Cockpit-connector?
  **Beslissing:** Directe, read-only Cockpit-connector — geen MCP-server. Reden: bunq heeft geen read-only-scope, en de enige bestaande MCP-opties hebben ingebouwde betaal-tools (prompt-injectie-risico).
- **Vraag:** Weergave van bunq-potjes/sub-rekeningen op de toekomstige Cockpit-kaart?
  **Beslissing:** Elke rekening apart getoond (niet gecombineerd tot één totaal).
- **Vraag:** Dagobert Duck nu activeren?
  **Beslissing:** Ja — contract en shim staan op `agent_status: active`.
- **Vraag:** Bouwfase van de bunq-connector nu starten?
  **Beslissing:** Nee, bewust uitgesteld. Vastgelegd als open taak met de volledige spec (incl. Argus' 3 blokkerende eisen) zodat niets verloren gaat.

## Insights

- Bij financiële/bank-koppelingen is een bestaande directe server-side connector (Open-Invoices-precedent) principieel veiliger dan een MCP-server zodra de onderliggende API geen harde read-only-scope kent — een MCP geeft het taalmodel rechtstreeks toegang tot tools, en externe tekst (transactieomschrijvingen) is dan een prompt-injectie-oppervlak naar een schrijf-tool. Dit patroon is nu vastgelegd in [[GL-022-financiele-koppelingen-dashboard-scope]] zodat het niet opnieuw hoeft te worden uitgezocht bij een volgende financiële feature.
- Voordat een grote nieuwe workstream wordt gestart loont het om eerst te grepen op bestaande Deliverables — het juli-ontwerp lag al klaar en voorkwam dubbel onderzoek.

## Realignments

- Sander vroeg oorspronkelijk expliciet om een MCP-server-koppeling; op basis van Daedalus' onderzoek (geen read-only-scope bij bunq, bestaande MCP's hebben betaal-tools) is dit bijgesteld naar een directe Cockpit-connector. Sander ging hiermee akkoord (1A in het beslisblok).

## Open threads

- [ ] Atlas' Cockpit-roster-parity-check (SOP-001 §9) — resultaat nog niet binnen op moment van schrijven.
- [ ] [[tsk-2026-08-17-001-bouw-bunq-saldo-cockpit-connector]] — bouwfase, bewust uitgesteld, wacht op Sanders signaal om te starten.
- [ ] Tweede Argus-audit (post-implementatie, vóór eerste gebruik van een echte productie-sleutel) blijft een harde poort wanneer de bouwfase wél start.

## Next steps

- Bij het oppakken van de bouwfase: start bij [[tsk-2026-08-17-001-bouw-bunq-saldo-cockpit-connector]] — bevat de volledige spec en success criteria.
- Dagobert Duck kan vanaf nu proactief geroepen worden bij vragen over saldo, cashflow, budget — zodra er daadwerkelijk een databron is (nu nog geen live koppeling).

## Cross-links

- [[2026-08-16-23-38_hermes_vooraankondiging-transcriptie-frustratie-audit]] — meest recente eerdere Hermes-sessielog.

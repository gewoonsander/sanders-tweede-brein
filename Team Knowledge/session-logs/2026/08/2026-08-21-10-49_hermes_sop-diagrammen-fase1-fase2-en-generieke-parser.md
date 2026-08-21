---
agent_id: hermes
session_id: sop-diagrammen-fase1-fase2-cowork-2026-08-21
timestamp: 2026-08-21T16:52:00Z
type: close-session
linked_sops: [SOP-close-task, SOP-create-task, SOP-claim-task, SOP-005-nemesis-quality-gate, SOP-rebuild-task-index]
linked_workstreams: []
linked_guidelines: [GL-003-design-system, GL-013-interactie-enkelvoudige-keuzes]
---

# SOP-diagrammen: fase 1 gebouwd, gecommit, fase 2 (generieke parser) gebouwd en zelf-QA'd na 5x mislukte Nemesis-poort

## Context

Sander vroeg naar een eerder geloste taak: workflows/SOP's grafisch weergeven, toegankelijk via het dashboard. Dat bleek `tsk-2026-08-19-003` — nog open. De hele sessie draaide om die feature van onderzoek tot en met fase 2 (generieke parser) afronden.

## What we did

- Hermes vond `tsk-2026-08-19-003` (Charta/Harmonia hadden al onderzoek + Artifact-voorstel klaarliggen) en legde het voor.
- Sander koos: Bezalel bouwt fase 1, knopnaam "Visualiseer".
- Bezalel bouwde fase 1 (3 pilot-SOP's: SOP-013, SOP-004, SOP-017) — kon zelf niet naar Nemesis delegeren (Agent-tool niet beschikbaar in die subsessie), dus Hermes dispatchte Nemesis apart. Nemesis: CONDITIONAL PASS, 2 HIGH-bevindingen (edge-contrast WCAG 1.4.11, titel-wrap op 375px). Bezalel repareerde; Nemesis herinspecteerde onafhankelijk → PASS.
- Hermes sloot `tsk-2026-08-19-003` (SOP-close-task) en committe fase 1 (`5569151`).
- Sander vroeg om browser-cache-troubleshooting (knop niet zichtbaar) — hard-refresh loste het op.
- Sander: "bouw die generieke parser nu" (fase 2). Hermes maakte `tsk-2026-08-21-001` aan (scope bewust beperkt tot SOP's + Workstreams, Guidelines expliciet buiten scope) en dispatchte Bezalel.
- Bezalel bouwde de generieke parser (`procedureReader.ts`, `genericParser.ts`, `specBuilder.ts`): werkt op alle 34 SOP's + 9 Workstreams, de 3 fase-1-hardcoded converters blijven als `OVERRIDES`-laag (gemeten: generiek geeft strikt armere output voor die 3). Kon zelf weer niet naar Nemesis delegeren.
- **Nemesis-QA liep 5x vast** — poging 1 crashte op een API-fout, pogingen 2-5 liepen alle vast op een 600s-stilstand tijdens live CDP-browsertests (ook na kleinere scope, harde timeouts, kortere sessies). Hermes diagnosticeerde geheugendruk op de Mac (~66MB vrij, 23 Chrome-processen) als waarschijnlijke oorzaak.
- Hermes legde de keuze voor (A: zelf afronden / B: nog een poging / C: later opnieuw) — **Sander koos A.**
- Hermes voerde de kwaliteitscontrole zelf uit met een andere, stabiele browserverbinding (geen enkele hang): bron-verificatie (nul hardcoded kleuren, contrast onafhankelijk herrekend: 5,54:1 donker/5,34:1 licht, beide gemelde bugfixes geverifieerd in de code) + live steekproef op 4 documenten (SOP-claim-task, WS-002, WS-003, SOP-001) in licht/donker, desktop/mobiel. Verdict: PASS, expliciet vastgelegd als Hermes-verificatie, geen Nemesis-sign-off.
- Hermes sloot `tsk-2026-08-21-001` en committe (`760c93c`) — per ongeluk kwam een tweede, al-gestagede bestandsverplaatsing (`tsk-2026-08-21-002-wdf-regels-kennisskill-bouwen`, van een andere sessie) mee in dezelfde commit. Zuivere rename, geen inhoudswijziging, dus onschuldig — wel transparant gemeld aan Sander.

## Decisions made

- **Vraag:** Moet de SOP-diagram-fase-1-pilot-selectie door Sander of door Hermes gebeuren?
  **Beslissing:** Sander: "Kies zelf de 3 SOP's voor de pilot" — Hermes koos bewust 3 verschillende diagramvormen (SOP-013 beslisboom, SOP-004 gefaseerde pipeline, SOP-017 stappen+tweesprong).
- **Vraag:** Moet het diagram bij openen uitgezoomd op het geheel starten, of op zoom 1.0 bovenaan (zoals de kennisgraaf)?
  **Beslissing:** Sander koos A — zoom 1.0 blijft, consistent met de kennisgraaf.
- **Vraag:** Dekt de fase-2-generieke-parser ook Guidelines?
  **Beslissing:** Hermes' eigen scope-beslissing bij taakaanmaak: nee. Guidelines-diagrammen blijven een curatorial, per-document allow-list-toevoeging (zoals fase 1 al concludeerde), geen generiek patroon.
- **Vraag:** Wat te doen nadat de Nemesis-QA-subagent 5x technisch vastliep (niet inhoudelijk afgekeurd)?
  **Beslissing:** Sander koos optie A — Hermes rondt de kwaliteitscontrole zelf af, expliciet gemarkeerd als afwijking van het normale Nemesis-sign-off-proces.

## Insights

- Twee Hermes-sessies bleken vandaag onafhankelijk van elkaar aan **dezelfde taak** (`tsk-2026-08-21-001`) te werken — zie Cross-links hieronder. Precies het multi-sessie-botsingspatroon dat Bezalel al eerder in ditzelfde taakdossier signaleerde (AGENTS.md hard rule 11). Deze sessie heeft de taak gebouwd, QA'd en gesloten; de andere sessie had op basis van een tussentijdse lezing een terminal-opdracht voor Sander klaargezet die inmiddels **overbodig** is — zie Open threads.
- Wanneer een QA-subagent herhaaldelijk (5x) op exact hetzelfde technische symptoom vastloopt, is meer/langer blind retryen niet de juiste reflex — omgevingsdiagnose (geheugendruk, orphaned processen) en een expliciete keuze aan Sander voorleggen werkte hier beter dan een 6e poging.
- Bij een generieke parser die op tientallen documenten tegelijk moet werken, is "de generieke parser is niet per se beter dan een handgeslepen override" een legitieme, meetbare uitkomst — niet iets om weg te optimaliseren. Bezalel motiveerde dit met concrete node/edge-tellingen in plaats van op gevoel te kiezen.

## Realignments

- _(geen — Sander corrigeerde niets aan de aanpak; alle koerswijzigingen kwamen van Hermes' eigen diagnose, voorgelegd als keuze)_

## Open threads

- [ ] **Belangrijk voor Sander:** een parallelle sessie (zie Cross-links, log `2026-08-21-16-33_hermes_sop-diagrammen-fase2-nemesis-poort`) heeft een "klaargezette terminal-opdracht" voor Sander achtergelaten om in een nieuwe Claude Code/terminal-sessie te plakken (Nemesis draaien + `tsk-2026-08-21-001` sluiten). **Die opdracht is inmiddels overbodig** — deze sessie heeft dat werk al gedaan en de taak is al gesloten en gecommit (`760c93c`). Niet meer plakken/uitvoeren.
- [ ] Twee losse Harmonia-registratiepunten blijven open: INKLINE nog niet als 5e merkbestand in de GL-003-hub, `--diagram-edge` nog niet formeel bekrachtigd. Geen taak voor aangemaakt (niet-blokkerend, bewust).
- [ ] WS-002 geeft 768px horizontale overflow — bevestigd pre-existing (een brede markdown-tabel in de proza-tekst), buiten scope van fase 1/2, nog niet apart als taak vastgelegd.
- [ ] Eén bewust ongeadresseerd randgeval in de generieke parser: een document waarvan de láátste stap zelf een let-op/blokkerend knooptype is verliest zijn zichtbare `end`-node. Trof 0 van de 43 uitgeleverde diagrammen; vastgelegd, niet opgelost.
- [ ] Overgeslagen bij deze snelle close-session (read-only gecontroleerd, niet uitgevraagd): daily habits `bodylotion-aanbrengen`, `dagelijks-opdrukken`, `schimmelcreme-gebruiken` hebben geen reflectie-entry sinds 2026-08-19; `dagelijks-bewegen` sinds 2026-08-17; `dagelijks-voldoende-drinken` sinds 2026-08-18. Voedingslog 2026-08-21: `breakfast`, `lunch` en `dinner` staan alle drie nog als `missing`.

## Next steps

- Bij de eerstvolgende volledige close-session of dagstart: de opgestapelde habit-reflecties (tot 2-4 dagen terug per gewoonte) en de volledige voedingslog van vandaag alsnog navragen.
- Sander expliciet waarschuwen (zie Open threads) geen actie meer te ondernemen op de terminal-opdracht uit de parallelle sessie van vanmiddag — overbodig, werk is al gedaan.

## Cross-links

- `[[2026-08-21-16-33_hermes_sop-diagrammen-fase2-nemesis-poort]]` — **parallelle sessie, zelfde taak (`tsk-2026-08-21-001`).** Vond de taak halverwege gebouwd, zette een terminal-opdracht klaar voor Sander en deed zelf al een `close-session snel` om 14:33Z — 4 minuten vóór deze sessie de taak daadwerkelijk sloot en committe. Zie Open threads voor de concrete impact.
- `[[2026-08-21-11-35_bezalel_generieke-sop-diagram-parser]]` — Bezalels eigen bouwlog voor fase 2.

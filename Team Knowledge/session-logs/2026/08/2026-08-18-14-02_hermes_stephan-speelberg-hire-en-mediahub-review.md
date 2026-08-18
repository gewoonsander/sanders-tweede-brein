---
agent_id: hermes
session_id: stephan-speelberg-hire-en-mediahub-review
timestamp: 2026-08-18T12:02:00Z
type: close-session
linked_sops: ["SOP-001-how-to-add-a-new-specialist"]
linked_workstreams: []
linked_guidelines: ["GL-002-frontmatter-conventions", "GL-013-interactie-enkelvoudige-keuzes"]
---

# Hire Stephan Speelberg + Mediahub-structuur doorgelicht

## Context

Sander wilde een video-regisseur aan het team toevoegen voor sociale video's die hij in Huddle plaatst. Na afronding van die hire vroeg hij ook om, via SSH op de Mac mini, de opzet van zijn bestaande "Sander Mediahub" (Lexar SSD) te doorgronden — hij was het achterliggende principe uit een cursusfilmpje vergeten — en dit met de nieuwe regisseur te bespreken voor eventuele verbeteringen.

## What we did

- Jethro vertaalde de hiring-vraag naar een SOP-001-gap-statement en briefde Athena.
- Athena leverde de research brief op `[[2026-08-17-video-regisseur-hire-research]]` (dagpatroon, kerncompetenties, anti-patterns, deliverable-standaard, grenzen, naamcheck met affiliatie-risico-signalering rond "Steven Spielberg").
- Sander koos zelf de naam **Stephan Speelberg** (bewuste variant-spelling) om het affiliatie-risico te omzeilen zonder de knipoog te verliezen.
- Jethro rondde SOP-001 stap 3-7 af: contract op `Team/Stephan Speelberg - Video-Regisseur/AGENTS.md`, shim op `.claude/agents/stephan-speelberg.md`, agent-index bijgewerkt.
- Atlas synchroniseerde de Cockpit (stap 9): 17 actieve specialisten, parity bevestigd.
- Atlas signaleerde dat maar 3 van de 17 contracten expliciete `agent_status`-frontmatter droegen — de rest viel terug op een database-default.
- Jethro voegde bij alle 14 ontbrekende contracten expliciete frontmatter toe (`agent_status`, `agent_type`, `title`, `folder`); Atlas verifieerde 17/17 explicit, geen contentverlies, geen contaminatie van `contract_body`/bio-extractie.
- Bij verificatie bleek Pieter Post nog een oude frontmatter-vorm te hebben en de nieuwe velden (`agent_type`, `title`, `folder`) stonden nergens gedocumenteerd in GL-002. Jethro trok Pieter Post gelijk en breidde GL-002 uit met een "Contract-level fields"-tabel + v2.7-version-history-regel. Eerste versie markeerde `agent_version`/`owner` onterecht als verplicht — na eigen verificatie tegen de daadwerkelijke 17 contracten teruggestuurd voor correctie; tweede versie beschrijft de werkelijke staat correct (4 velden verplicht, 3 optioneel).
- Via `ssh macmini` de Mediahub-structuur op de Lexar SSD verkend; `00_README_Sander_Mediahub.md` (v1.1) gevonden met het volledige onderliggende principe (merk/rol → project → bestandstype, AI-vriendelijk ontworpen).
- Stephan gaf zijn vakinhoudelijke analyse: structuur is solide voor longform/klantwerk, wringt bij social's "één bronopname, meerdere gelijktijdige platform-exports"-patroon. Drie concrete, optionele verbetervoorstellen.
- Na Sanders akkoord: README bijgewerkt naar v1.2 (nieuwe optionele `08_Ondertitels`-map, platform-onderverdeling in `05_Exports` vanaf 3+ exports, `_editorial-note`-naamconventie), backup van v1.1 weggezet op dezelfde plek, wijziging geverifieerd byte-identiek na terugkopiëren.

## Decisions made

- **Question:** Hoe los je een naamconflict met een bekende levende persoon op zonder de bedoelde knipoog te verliezen?
  **Decision:** Bewuste variant-spelling ("Stephan Speelberg" i.p.v. "Steven Spielberg") in plaats van een volledig neutrale naam.
- **Question:** Moet `agent_status` overal expliciet in frontmatter staan, of mag een database-default volstaan?
  **Decision:** Expliciet verplicht op elk contract — vastgelegd in GL-002 v2.7, samen met `agent_type`, `title`, `folder`. `agent_version`, `owner`, `model` blijven optioneel.

## Insights

- Bij naamkeuzes die naar een bekende levende persoon verwijzen: een variant-spelling kan het affiliatie-risico oplossen zonder de bedoelde verwijzing te verliezen.
- Een subagent-rapport dat "afgerond" meldt, moet tegen de daadwerkelijke bestandsstaat geverifieerd worden voordat het als voltooid aan Sander wordt gemeld — de eerste GL-002-poging documenteerde een eis die 16 van 17 contracten niet haalden, en dat viel alleen op door de frontmatter zelf na te lezen in plaats van het subagent-rapport te vertrouwen.
- Sanders Mediahub-README (cursusgebaseerd) is bewust ontworpen voor AI-doorzoekbaarheid (vaste codes, datums, gescheiden assets/projecten) — dat verklaart waarom het cursusfilmpje die aanpak aanraadde, en maakt de structuur een goede basis voor toekomstige automatisering.

## Realignments

- _(geen deze sessie)_

## Open threads

- [ ] Team Inbox: 1 screenshot + 1 document nog niet verwerkt (niet opgepakt deze sessie — snelle sluiting).

## Next steps

- Stephan Speelberg is inzetbaar via `.claude/agents/stephan-speelberg.md` zodra Sander een videotaak aanlevert.
- Mediahub-README staat op v1.2; de drie nieuwe optionele conventies (platform-submappen, editorial-note-suffix, `08_Ondertitels`) worden pas concreet zichtbaar zodra een project ze daadwerkelijk nodig heeft.
- Team Inbox-items (1 screenshot, 1 document) wachten nog op verwerking.

## Cross-links

- `[[2026-08-17-video-regisseur-hire-research]]`
- `[[Team/Stephan Speelberg - Video-Regisseur/AGENTS]]`
- `[[2026-08-17-14-30_hire-stephan-speelberg-video-regisseur]]`
- `[[GL-002-frontmatter-conventions]]`

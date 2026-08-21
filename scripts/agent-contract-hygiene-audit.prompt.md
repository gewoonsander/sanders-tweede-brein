Je bent Jethro's kwartaal-routine: de agent-contract-hygiëne-audit, draaiend lokaal op de Mac mini in de repo sanders-tweede-brein. Voer [[SOP-025-agent-contract-hygiene-audit]] volledig en stap voor stap uit — lees dat bestand eerst (`Team Knowledge/SOPs/SOP-025-agent-contract-hygiene-audit.md`) voor de exacte procedure. Dit is de uitvoeringsversie voor de onbemande routine; wijk niet af van de SOP.

## Stap 1 — Roster lezen

Lees `Team/agent-index.md` voor de volledige lijst actieve specialisten (naam, folder, slug).

## Stap 2 — Contract vs. shim per specialist

Voor elke specialist uit de roster: lees `Team/<Name> - <Role>/AGENTS.md` naast de bijbehorende host-shim (`.claude/agents/<slug>.md`, en eventuele andere host-shims volgens de hosts-matrix in `Team Knowledge/SOPs/SOP-001-how-to-add-a-new-specialist.md` §5). Controleer:

- Beschrijft de shim-`description:` nog dezelfde scope als het wiki-contract?
- Is de shim-`tools:`-lijst nog minimaal én compleet?
- Verwijst de shim nog naar het juiste contractpad?

## Stap 3 — Wikilink-integriteit binnen het contract

Voor elk `[[wikilink]]` in het wiki-contract: bestaat het doelbestand nog (Glob/Grep in de repo)? Dit is contract-scoped, geen repo-brede audit (dat blijft SOP-021).

## Stap 4 — Routing-check

Staat de specialist nog correct in de team-tabel in root-`AGENTS.md`, in de Skills Register in root-`AGENTS.md` (indien van toepassing), en in `Team/agent-index.md` zelf?

## Stap 5 — Bevindingen vastleggen

Bij een gevonden afwijking: nooit stilzwijgend overschrijven. Voeg een `> **Correctie (YYYY-MM-DD):** ...`-regel toe op de plek van de afwijking (gebruik de datum van vandaag, `date +%Y-%m-%d`), en corrigeer het onderliggende feit pas na die zichtbare markering. Bij een dode wikilink: repareer of verwijder de link en noteer waarom in de wijzigingsregel.

## Stap 6 — Substantiële afwijkingen

Contract/shim langdurig uit sync, structurele scope-drift, of een specialist die feitelijk een andere rol vervult dan zijn contract beschrijft: markeer dit expliciet en prominent in zowel de correctie-regel als de eindsamenvatting (stap 8) — dit is iets wat Sander bij de eerstvolgende sessie moet zien, geen stille reparatie.

## Stap 7 — Sessielog

Schrijf een entry naar `Team Knowledge/session-logs/YYYY/MM/YYYY-MM-DD-HH-MM_jethro_agent-contract-hygiene-audit.md` (huidige datum/tijd, gebruik `date` via Bash) volgens het bestaande `_template.md`-schema in die map: welke specialisten gecontroleerd zijn, wat (indien iets) gecorrigeerd is, of "geen afwijkingen gevonden".

## Stap 8 — Committen en loggen

Commit alle gewijzigde bestanden (contracten, shims, agent-index, de nieuwe sessielog-entry) met `git add`/`git commit`, commitmessage bijvoorbeeld:
```
Agent-contract-hygiëne-audit YYYY-MM-DD (automatisch)
```
Niet pushen — dat gebeurt via de bestaande sessie-backup-routine.

Schrijf daarna een korte samenvatting (2-5 regels) naar stdout: aantal gecontroleerde specialisten, en of er iets substantieels gevonden/gecorrigeerd is. Dit komt in `~/Library/Logs/agent-contract-hygiene-audit.log` terecht.

## Wat deze routine nadrukkelijk niet doet

Geen model-tier-beoordeling (dat is [[GL-015-agent-model-tier-review]], aparte cadans/eigenaar), geen platform-kennisdossier-refresh (dat is [[SOP-014-refresh-platform-specialist-knowledge]]), geen repo-brede PKM-linkaudit (dat is [[SOP-021-audit-pkm-graafhygiene]]), en geen nieuwe hire-beslissingen — signaleer een gat hoogstens in de eindsamenvatting, beslis niets zelf.

## Belangrijk

- Verzin nooit een afwijking die je niet kunt aanwijzen — elke correctie moet terug te herleiden zijn naar een concreet, gelezen bestand.
- Bij twijfel of iets een echte afwijking is: noteer het als signaal in de eindsamenvatting in plaats van zelf een aanname-correctie door te voeren.

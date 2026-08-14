---
agent_id: hermes
session_id: pkm-graafhygiene-sop
timestamp: 2026-08-14T20:21:25+02:00
type: close-session
linked_sops: [SOP-021-audit-pkm-graafhygiene, SOP-017-verwerk-voedingsregistratie]
linked_workstreams: []
linked_guidelines: [GL-001-file-naming-conventions, GL-002-frontmatter-conventions]
---

# PKM-graafhygiëne meetbaar en herhaalbaar gemaakt

## Context

Sander wilde weten of de wikilinks in zijn tweede brein werkelijk één verbonden geheel vormen, of weesbestanden de graaf vervuilen en of daar een vaste SOP voor bestond. Er was wel een Librarian-controle, maar nog geen algemene, reproduceerbare procedure voor graafhygiëne.

## What we did

- Atlas legde uit dat een weesbestand bestaande verbindingen niet vervuilt, maar zelf buiten het netwerk en de context blijft.
- Atlas voerde een alleen-lezen nulmeting uit op 421 PKM-markdownbestanden en legde de resultaten vast in [[2026-08-14-pkm-graafhygiene-nulmeting]].
- Daedalus ontwierp na de goedgekeurde brainstorm een deterministisch Python-stdlib-script voor wikilinks, embeds, lokale markdownlinks, gebroken doelen, dubbelzinnige doelen en zwakke INDEX-verbindingen.
- Atlas maakte [[SOP-021-audit-pkm-graafhygiene]] en registreerde die in het SOP-register.
- Zes unittests slaagden; twee volledige runs leverden dezelfde SHA-256-hash op.
- De gevalideerde nulmeting eindigde op 421 bestanden, 757 geldige linkvoorkomens, 149 geïsoleerde kandidaten, 48 niet-oplosbare links, 14 dubbelzinnige links en 38 alleen-via-INDEX/README bereikbare notities.
- Penn legde bij het sluiten opnieuw vast dat het voedingslogboek van 2026-08-14 compleet is; de Cockpit-mirror is daarna geregenereerd.
- Hermes voegde het verplichte `key_element: groei` toe aan het audit-Deliverable.

## Decisions made

- **Vraag:** Moeten weesbestanden automatisch worden opgeruimd?
  **Besluit:** Nee. Eerst alleen-lezen meten en inhoudelijk classificeren; wijzigingen gebeuren alleen per kleine, expliciet goedgekeurde batch.
- **Vraag:** Hoe behandelen we de 107 geïsoleerde YouTube-transcripties?
  **Besluit:** Niet kunstmatig individueel linken. Eerst een collectiebeleid en canonieke hubs bepalen.
- **Vraag:** Moet de controle herhaalbaar worden?
  **Besluit:** Ja. SOP-021 en `Team Knowledge/scripts/audit-pkm-graph.py` zijn de canonieke procedure en uitvoerder.

## Insights

- Technische isolatie is een detectiesignaal, geen verwijdercriterium.
- De meeste geïsoleerde kandidaten komen uit één broncollectie. Een collectie-hub is daar informatiekundig sterker dan willekeurige individuele links.
- De dubbele basename `gewoon-thuis` veroorzaakt alle veertien dubbelzinnige links in de gevalideerde scan; herstel vereist per bronbestand een inhoudelijke keuze en een padgekwalificeerde wikilink.

## Realignments

- _(none this session)_

## Open threads

- [ ] Nog geen PKM-bestanden opgeschoond, verplaatst of verwijderd.
- [ ] Eerste mogelijke herstelbatch: `computer-georganiseerd.md`, elf geïsoleerde CRM-kandidaten en de veertien dubbelzinnige `gewoon-thuis`-links.
- [ ] Collectiebeleid voor `PKM/Documents/YouTube-Kennis/` bepalen voordat die 107 items worden aangepast.
- [ ] Een dashboardlink naar Obsidian of een globale Cockpit-graaf blijft een apart, nog niet uitgevoerd idee.

## Next steps

- Voer bij een volgende opdracht SOP-021 opnieuw uit en presenteer één kleine herstelbatch ter goedkeuring.
- Verwijder niets uitsluitend omdat een bestand technisch geïsoleerd is.

## Cross-links

- [[2026-08-14-pkm-graafhygiene-nulmeting]]
- [[SOP-021-audit-pkm-graafhygiene]]

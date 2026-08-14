# WS-008 — Deliverables & Projecten Audit

- **Status:** Actief (sinds 2026-08-13)
- **Type:** Workstream — periodieke, mens-gepoorte audit. Zusje van [[WS-005-team-retro-and-self-improvement-loop]], geen onderdeel ervan: WS-005 kijkt naar hoe het team zelf werkt (proces), deze kijkt naar wat het team daadwerkelijk heeft opgeleverd en voor welke Projects (output/portfolio). Zelfde goedkeur-mechaniek, ander onderwerp, ander ritme.
- **Owners:** **Hermes** (orchestrator — mijnt de data, clustert, schrijft het voorstel). De **genoemde uitvoerder** per goedgekeurd voorstel (voert de archivering of vervolgactie uit). **De gebruiker** (de poort — keurt goed welke inzichten kloppen en welke archiveringen doorgaan).
- **Referenties:** [[GL-002-frontmatter-conventions]] (het `key_element`/`project`-schema dat deze audit mijnt), [[GL-010-pka-modeling-principles]] (Key Elements-hiërarchie, Ikigai-balans), [[SOP-020-losstaand-deliverable-archiveren]] (de archiveercriteria die hier worden toegepast), [[GL-004-task-resource-linking]] (het bestaande taakgebonden archiefpad, buiten scope hier).
- **Getriggerd door:** "run de deliverables-audit" / "hoe staan mijn projecten ervoor" / on-demand. Geen automatische trigger — `/dagstart` mag na een kwartaal zonder run een keer nudgen, net als WS-005 dat doet voor de team-retro, nooit vanzelf starten.

## Waarom dit bestaat

Ontstaan op 2026-08-13 uit een brainstorm met Sander over waarom `Deliverables/` als een pakhuis aanvoelde. De kern bleek: Deliverables was de enige laag in de PKA zonder verbinding naar Key Elements/Projects (zie GL-010 Principe 5), waardoor niemand — mens of team — ooit kon zien welk deel van je energie waarheen ging. Nu die velden bestaan (GL-002 v2.6), is deze audit de eerste keer dat die vraag daadwerkelijk beantwoordbaar is.

## Wat deze audit anders maakt dan WS-005

| | WS-005 (Team Retro) | WS-008 (deze) |
|---|---|---|
| Mijnt | `Team/*/journal/`, `session-logs/` | `Deliverables/` (via `key_element`/`project`), `PKM/My Life/Projects/` |
| Vraag | Hoe moet het team beter werken? | Wat heb je gemaakt, voor welke Projects, en klopt dat met je Key Elements-balans? |
| Doelgroep voorstel | Het team / de implementer | Sander zelf — reflectief, geen procesverandering |
| Ritme | Ad-hoc, informele maandelijkse nudge-optie | Ad-hoc, informele kwartaal-nudge-optie |
| Landt in | `Deliverables/YYYY-MM-DD-team-retro-proposals.md` | `Deliverables/YYYY-MM-DD-deliverables-projecten-audit.md` |

## Procedure

### Stap 1 — Hermes: verzamel de data

1. Alle actieve Deliverables (`key_element`, `project`, aanmaakdatum) en al gearchiveerde uit `Deliverables/_archive/` van de afgelopen periode.
2. Alle Projects onder `PKM/My Life/Projects/` met hun `status`-veld en `key_element`.
3. Kandidaten voor archivering per [[SOP-020-losstaand-deliverable-archiveren]] — losstaande Deliverables die aan één van de vijf criteria voldoen.
4. Losstaande Deliverables ouder dan 30 dagen zonder criterium ("nooit opgevolgd").

### Stap 2 — Hermes: clusteer tot inzichten

Minimaal:

- **Key Element-balans** — welk domein (Geloof, Gezondheid, Passie, Groei, Bijdrage, Financiën) kreeg deze periode de meeste output, welke kreeg niets. Geen oordeel, alleen het patroon — Sander trekt zelf de conclusie of dat klopt met wat hij wilde.
- **Gestrande Projects** — Projects die wél Deliverables opleverden maar nog steeds niet op `status: done` staan, met hoelang ze al lopen.
- **Dubbel werk** — Deliverables die inhoudelijk overlappen met een bestaande PKM-notitie (Topic/Goal/Habit) in plaats van die bij te werken. Het voorbeeld dat dit patroon blootlegde: de cursussen/abonnementen-inventarisatie van 2026-08-12 dupliceerde `abonnementen.md` en `cursussen-afmaken.md` in plaats van ze bij te werken.
- **Archiveerbare kandidaten** — resultaat van Stap 1.3, per criterium uit [[SOP-020-losstaand-deliverable-archiveren]].

### Stap 3 — Hermes: schrijf één voorstel-/inzichtendocument

`Deliverables/YYYY-MM-DD-deliverables-projecten-audit.md`. Twee secties:

- **Inzichten** — Key Element-balans, gestrande Projects, dubbel-werk-patronen. Informatief, geen actie vereist.
- **Voorstellen** — de archiveerbare kandidaten, elk met het criterium en een korte onderbouwing. Niets wordt hierdoor al verplaatst.

### Stap 4 — De gebruiker keurt een subset goed

Sander beoordeelt de voorstellen-sectie en keurt goed welke archiveringen doorgaan. Inzichten hoeven geen goedkeuring — die zijn reflectief. Niet-goedgekeurde archiveer-voorstellen blijven gewoon staan tot de volgende audit.

### Stap 5 — Uitvoering

Voor elk goedgekeurd archiveer-voorstel: voer de `git mv` uit per [[SOP-020-losstaand-deliverable-archiveren]] §3.

### Stap 6 — Hermes: sessielog

Vastleggen: wanneer de audit liep, hoeveel Deliverables/Projects zijn bekeken, welke inzichten naar boven kwamen, hoeveel archiveringen zijn goedgekeurd/uitgevoerd.

## Edge cases

| Situatie | Gedrag |
|---|---|
| Een Deliverable mist nog `key_element`/`project` (aangemaakt vóór 2026-08-13) | Hermes vult dit retroactief in tijdens Stap 1, op basis van de inhoud — geen blokkade, geen aparte migratieklus nodig. |
| Sander keurt niets goed | Prima. Het voorstellendocument blijft staan als achterstand voor de volgende audit. |
| Een Project heeft geen enkel Deliverable | Geen bevinding — niet elk Project hoeft een Deliverable te produceren. |
| Dezelfde dubbel-werk-bevinding komt twee audits op rij terug | Signaal voor Sander, geen aanleiding voor het team om zelf iets te veranderen — dat gaat via WS-005 als het een procesding wordt. |

## Eigenaarschap

Hermes mijnt en clustert. De genoemde uitvoerder voert een goedgekeurde archivering uit. Sander is en blijft de poort — precies zoals bij WS-005, dit workstream verzint geen eigen autonomie-niveau.

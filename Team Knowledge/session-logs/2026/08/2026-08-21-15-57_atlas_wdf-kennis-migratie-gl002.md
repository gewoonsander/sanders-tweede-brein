---
agent_id: atlas
session_id: wdf-kennis-gl002-migratie-2026-08-21
timestamp: 2026-08-21T15:57:00Z
type: end-of-session
linked_sops: []
linked_workstreams: ["WS-002-import-external-knowledge-base"]
linked_guidelines: ["GL-001-file-naming-conventions", "GL-002-frontmatter-conventions"]
---

# WDF-Kennis gemigreerd naar het GL-002 Documents-schema

## Context

Op 2026-08-21 leverde Daedalus `PKM/Documents/WDF-Kennis/` op onder [[tsk-2026-08-21-002-wdf-regels-kennisskill-bouwen]]: 15 Nederlandstalige kennisbestanden, een `INDEX.md` en een `bron/`-map met 14 originele WDF-PDF's, als kennisbasis voor de skill `/wdf-regels`.

Een parallelle sessie signaleerde dat de frontmatter van dat archief Nederlandse ad-hoc sleutels gebruikte die in geen enkel GL-002-schema voorkomen — schema-drift in een van de negen schema-plichtige mappen (hard rule "Frontmatter discipline", AGENTS.md). Die sessie legde het precedent vast in [[2026-08-21-14-36_atlas_ndb-reglementen-kennisarchief-structureren]] en bracht `PKM/Documents/NDB-Kennis/` naar het Documents-schema.

Sander koos: **migreren naar GL-002**. Geen twee schemavormen naast elkaar in de vault. Deze sessie voerde dat uit voor WDF-Kennis, volgens hetzelfde patroon als het NDB-archief.

## What we did

- **Atlas** inventariseerde de drift eerst en telde meer dan de zeven eerder gemelde sleutels: naast `titel`, `bron_url`, `bron_pagina`, `revisie`, `revisiedatum`, `opgehaald`, `bronkopie` en `omvang` ook `geldt_voor`, `frequentie`, `revisiedatum_toelichting`, `bron_urls`, `bron_type`, `laatste_ledenupdate_volgens_bron`, en in `INDEX.md` nog `doel`, `bron_hoofdpagina`, `opgebouwd_door`, `opgebouwd_op`, `bijbehorende_skill` en `taak`. Zestien niet-canonieke sleutels, niet zeven.
- **Atlas** schreef een transformatiescript in plaats van 15 bestanden met de hand te herschrijven. De body is byte-voor-byte overgenomen; alleen het frontmatter-blok is vervangen en er is één sectie `## Documentversie` ingevoegd.
- **Atlas** gebruikte uitsluitend velden uit het Documents-schema: `title`, `doc_type: other`, `digital_location`, `issued_on`, `tags`. Geen nieuwe sleutel bedacht, GL-002 niet uitgebreid.
- **Atlas** legde de bron- en revisie-informatie narratief vast in `## Documentversie` per bestand, en de herkomst per document in het nieuwe `PKM/Documents/WDF-Kennis/bron/_downloadlog.md` — zelfde naam en opzet als `bronnen/_downloadlog.md` in het NDB-archief.
- **Atlas** hield de map **plat**, in bewuste afwijking van de vier NDB-clusters.
- **Atlas** werkte `~/.claude/skills/wdf-regels/SKILL.md`, `PKM/Documents/INDEX.md` en het taakbestand bij, en liet `status`/`blocked_reason` van de taak ongemoeid — die flip is aan Hermes, na review van zowel deze migratie als Daedalus' Bye-Laws-aanvulling.

## Decisions made

- **Vraag:** Submappen per categorie, zoals de vier clusters in NDB-Kennis?
  **Besluit:** Nee. NDB had 35 documenten; hier zijn het er 15, en het numerieke voorvoegsel (`01`–`15`) draagt de vijf categorieën van de bron al én dwingt de leesvolgorde af. Submappen zouden de routeringstabel van de skill, de INDEX-tabellen en elke `digital_location` raken zonder iets vindbaarder te maken. Resultaat: geen enkel pad is door de migratie veranderd.

- **Vraag:** Waar plaatsen we `## Documentversie`? Bij NDB staat die direct onder de H1.
  **Besluit:** Vlak vóór de eerste `##`-kop, dus onder de bestaande inleiding. Direct onder de H1 zou de bestaande inleidende alinea onder de kop "Documentversie" trekken, en die alinea gaat bij deze bestanden over de inhoud, niet over de versie. Zo blijft de bestaande tekst waar hij stond en verschuift er niets.

- **Vraag:** `linked_organizations` vullen?
  **Besluit:** Weglaten. Er bestaat geen Organization-notitie voor de WDF. Het NDB-archief hing de ISR-reglementen aan `ndb-nederlandse-darts-bond` als "reden van opname"; hier zou dat de verhouding omkeren — de NDB is één van 78 WDF-leden, niet de uitgever van deze reglementen. Een WDF-dossier aanmaken is een CRM-keuze van Sander.

- **Vraag:** Welke datum in `issued_on` bij `14-cup-europe-youth`, waar bestandsnaam (08-04-2026) en document (10 March 2026) elkaar tegenspreken?
  **Besluit:** De datum in het document zelf (2026-03-10), met de tegenstrijdigheid expliciet in de prozasectie én in het downloadlog. Bij `15-organisatiestructuur-en-leden` (websitepagina's) is `issued_on` helemaal weggelaten in plaats van een peildatum als documentdatum te vermommen.

## Insights

- **Een namingconventie die je 1-op-1 van een ander archief overneemt, kan een wikilink-botsing veroorzaken.** `bron/_downloadlog.md` volgt het NDB-precedent netjes, maar er zijn nu twee bestanden `_downloadlog.md` in de vault. De WDF-notities gebruiken daarom de padvorm; de 36 NDB-notities dragen nog de korte vorm `[[_downloadlog]]` en zijn daardoor vault-breed dubbelzinnig geworden. Bij een tweede archief van hetzelfde type is de vraag niet alleen "welke vorm volgen we" maar ook "is die vorm nog uniek".
- **Tel de drift, neem hem niet over uit een eerdere melding.** De vorige sessie meldde zeven ad-hoc sleutels; het waren er zestien. Een gerapporteerd aantal uit een tweede hand is een schatting tot je het zelf hebt geteld.
- **Diff-verificatie maakt "geen aannames als feiten" mechanisch.** Twee onafhankelijke controles (programmatische reconstructie van de body plus `diff` per bestand) leverden nul gewijzigde of verwijderde regels over 15 bestanden. Dat is geen goede intentie maar een meetbaar resultaat — en het is de reden dat een script hier een inhoudelijke waarborg is en niet alleen tijdwinst.

## Realignments

- _(geen — deze sessie liep binnen het door Hermes gegeven kader)_

## Open threads

- [ ] **Geen Organization-notitie voor de World Darts Federation** in `PKM/CRM/Organizations/`, terwijl 15 notities over haar reglementen gaan. `linked_organizations` is daarom overal leeg gelaten. Beslissing voor Sander: wel of geen `wdf-world-darts-federation`-dossier. Zelfde soort openstaand punt als het ontbrekende ISR-dossier bij het NDB-archief.
- [ ] **Twee bestanden `_downloadlog.md` in de vault.** De 36 NDB-notities linken met de korte vorm en zijn nu dubbelzinnig. Niet aangeraakt (andere sessie). Librarian-punt voor Hermes: NDB omzetten naar de padvorm, of één van beide hernoemen.
- [ ] **`PKM/Documents/2018-02-28-wdf-playing-and-tournament-rules.md` draagt `doc_type: reglement`**, wat niet in de GL-002-enum staat (`contract | id | invoice | warranty | medical | tax | inventory | other`). Bestaande drift buiten deze taak. Twee opties: corrigeren naar `other`, of `reglement` als waarde aan GL-002 toevoegen — dat laatste is verdedigbaar nu er twee reglementenarchieven in de vault staan die allemaal op `other` zijn geland.
- [ ] **`[[INDEX]]` zonder pad** in `15-organisatiestructuur-en-leden.md` is vault-breed dubbelzinnig (er zijn ruim vijftien `INDEX.md`-bestanden). Bewust niet gecorrigeerd: het staat in bodytekst die in deze migratie ongewijzigd moest blijven.
- [ ] **De Bye-Laws (2.01, 7.05)** blijven het inhoudelijke hiaat van de kennisbasis. Daedalus pakt dat apart op, ná deze migratie, om bestandsraces te voorkomen.

## Next steps

- Hermes reviewt deze migratie samen met Daedalus' Bye-Laws-aanvulling en beslist dan pas over `status`/`blocked_reason` van [[tsk-2026-08-21-002-wdf-regels-kennisskill-bouwen]].
- Komt er een Bye-Laws-document bij, dan krijgt dat hetzelfde schema: `doc_type: other`, `digital_location` naar `bron/`, revisie-informatie in `## Documentversie`, en een regel in de tabel van [[PKM/Documents/WDF-Kennis/bron/_downloadlog|_downloadlog]] plus in het revisieregister van de INDEX.

## Cross-links

- [[PKM/Documents/WDF-Kennis/INDEX|WDF-kennisbasis]] — het gemigreerde archief.
- [[PKM/Documents/WDF-Kennis/bron/_downloadlog|_downloadlog]] — de nieuwe ophaalverantwoording.
- [[2026-08-21-14-36_atlas_ndb-reglementen-kennisarchief-structureren]] — het precedent dat hier is gevolgd.
- [[tsk-2026-08-21-002-wdf-regels-kennisskill-bouwen]] — de taak.

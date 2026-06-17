---
agent_id: larry
session_id: 2026-06-16-adc-toernooi-crm-prijzengeld
timestamp: 2026-06-16T16:16:00+02:00
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-001-file-naming-conventions"]
---

# ADC toernooibeheer, CRM uitbreiding & prijzengeld — 16 juni 2026

## Context

Sessie begon als voortzetting van een vorige context-exceeded sessie (e-Boekhouden facturen, Jortt-concepten). Die waren al afgerond. Sander bevestigde dat de Fitbit-taak al klaar was. Hoofdwerk van deze sessie: ADC Oost-Nederland toernooibeheer, CRM-uitbreiding met twee nieuwe contacten, en afhandeling prijzengeld voor drie toernooien.

## What we did

- **Larry/Penn** — Drie Winmau Benelux Trophy 2026 - East Netherlands toernooien toegevoegd aan Google Calendar (referentieagenda ADC EAST NL): Amateur II Finals (za 13:00 @ Café Kafé), Amateur I Finals (za 14:00 @ Dartclub de Rijnvogels), Elite Finals (zo 14:00 @ Dartcafe Dubbel 10). Locaties vervolgens expliciet bijgewerkt via update_event.
- **Penn** — CRM aangemaakt voor [[michael-walstra]] (Toernooi Manager, Café Kafé) met IBAN NL89 RABO 0384 3778 31 (t.n.v. F.W.R Walstra).
- **Penn** — CRM aangemaakt voor [[stef-onderstal]] (Toernooi Manager, Dartclub de Rijnvogels) met IBAN NL87 RABO 0143 0440 01 (t.n.v. Dartclub de Rijnvogels).
- **Penn** — Nieuwe organisaties aangemaakt: [[cafe-kafe]] en [[dartclub-de-rijnvogels]]. CRM INDEX bijgewerkt.
- **Larry** — Prijzengeld opgezocht via DartsAtlas: Amateur II €200, Amateur I €200, Elite €400 (totaal €800 voorgeschoten).
- **Larry** — Todoist-taak aangemaakt voor betaling Michael Walstra (€200, vandaag). Na bevestiging betaling door Sander: taak bijgewerkt met bedrag.
- **Larry** — Todoist-taak aangemaakt voor betaling Stef Onderstal (€200, vandaag).
- **Larry** — Todoist-taken aangemaakt voor terugbetaling ADC: check mail John Lokken (17 juni) + reminder sturen (28 juni) indien geen reactie.
- **Larry** — WhatsApp-conceptberichten opgesteld voor Michael (betaalbevestiging + speelschema Amateur II + vraag volgende periode) en Stef (idem Amateur I, finale best of 7, Stef wil al meedoen — vraag om datum door te geven).
- **Larry (Librarian)** — Journal 2026-06-16 bijgewerkt met ADC-sectie. Geen broken wikilinks gevonden in nieuwe CRM-bestanden.

## Decisions made

- **Vraag:** Is WhatsApp integreerbaar voor berichtbeheer?
  **Beslissing:** Nee — geen MCP beschikbaar, geen officiële API voor persoonlijk gebruik. Computer use is enige optie maar niet schaalbaar. Telegram is aanbevolen alternatief als Sander structurele berichten-automatisering wil.

- **Vraag:** Café Kafé vs. bestaand sl-rijnvogels-duurzaam.md voor Dartclub de Rijnvogels.
  **Beslissing:** Dartclub de Rijnvogels (venue) krijgt eigen org-bestand `dartclub-de-rijnvogels.md`. SL Rijnvogels Duurzaam (team) blijft apart. Dartclub-bestand linkt naar sl-rijnvogels-duurzaam via wikilink.

## Insights

- DartsAtlas-pagina's zijn server-rendered — web_fetch geeft volledige content zonder Chrome nodig.
- Prijzengeld voor Elite Finals (€400) is nog niet uitbetaald — contactpersoon Dartcafe Dubbel 10 is nog onbekend in CRM.
- Stef Onderstal heeft al bevestigd mee te willen doen volgende periode — wacht alleen op datumopgave. Dit is een open thread voor de volgende rondes.

## Realignments

- Sander corrigeerde het speelschema-berichtje: het gaat om het format (groepen, legs) niet om de tijden/locaties. Larry had tijden/locaties eerst opgenomen, daarna gecorrigeerd naar format-info.
- "Finale best of 7" — Sander vulde aan dat de finale best of 7 is (stond niet op DartsAtlas), toegevoegd aan Stef-berichtje.

## Open threads

- [ ] Betaling prijzengeld Stef Onderstal (Dartclub de Rijnvogels) — €200 — taak staat voor vandaag
- [ ] Prijzengeld Elite Finals (€400) cash meenemen naar Dartcafe Dubbel 10 op zondag 21 juni — Sander is zelf gekwalificeerd voor het toernooi en betaalt ter plekke
- [ ] Check mail John Lokken (ADC directeur) over terugbetaling €800 — taak morgen 17 juni
- [ ] Reminder John Lokken sturen indien geen reactie — taak 28 juni
- [ ] Stef Onderstal: datum doorgeven voor volgende periode — wacht op antwoord WhatsApp
- [ ] Michael Walstra: vraag volgende periode nog open — wacht op antwoord WhatsApp

## Next steps

Bij volgende sessie: IBAN Dartcafe Dubbel 10 ophalen zodra Sander die heeft, CRM aanvullen, betaling uitvoeren. Check of John Lokken gereageerd heeft (taak 17 juni).

## Cross-links

- [[2026-06-16-19-30_larry_coaching-marc-vleghert-sessie-7]] — andere sessie van vandaag

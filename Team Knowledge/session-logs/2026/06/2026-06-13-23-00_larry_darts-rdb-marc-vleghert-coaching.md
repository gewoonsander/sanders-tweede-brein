---
agent_id: larry
session_id: 2026-06-13-darts-rdb-marc-vleghert-coaching
timestamp: 2026-06-13T23:00:00
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines:
  - GL-001-file-naming-conventions
---

# Darts PKA uitbreiding: RDB, Superleague, Marc Vleghert coaching

## Context

Vervolgsessie na context-compactie. PKA was al grotendeels gevuld. Sander bracht nieuwe darts-gerelateerde data mee: twee RDB-URLs, twee Teambeheer-spelerspagina's (RDB Eredivisie + Superleague), de gewoonsander.nl-site en drie inboxbestanden over de coaching van Marc Vleghert.

## What we did

- **Larry** fetched rivierenlanddartsbond.nl en eredivisie-pagina (client-rendered, geen standen beschikbaar).
- **Larry** maakte `PKM/CRM/Organizations/rivierenland-darts-bond.md` aan — correctie na feedback: naam gecorrigeerd naar Rivierenland Darts Bond (RDB).
- **Larry** updatte `PKM/CRM/Organizations/gewoon-sander.md` — IBAN NL05 BUNQ 2153 6071, tagline, producten, RDB als websiteklant toegevoegd.
- **Larry** fetched gewoonsander.nl en verwerkte de info in gewoon-sander.md.
- **Larry** verwerkte Teambeheer RDB Eredivisie-profiel (ID 2100113) in `sander-van-ockenburg-zwaan.md`: teamhistorie D.T. Irritant, seizoensstats 25-26 (81,3% singles, 30x 180, hoogste finish 154, 170 Club, langste reeks 20x in 2014).
- **Larry** verwerkte vier Superleague-seizoenen (ID 11097, d=21): SL Dubbel10 Arnhem (22-24) → SL Rijnvogels Duurzaam (24-heden). Vaste partner Marc Vleghert, Arno Looijen-connectie uitgelegd.
- **Larry** maakte `PKM/CRM/People/marc-vleghert.md` aan op verzoek van Sander.
- **Larry** updatte marc-vleghert.md na correcties: coaching gestart 2026, vertrek naar ander SL-team seizoen 26-27, ook speler D.T. Irritant RDB.
- **Larry** verwerkte Team Inbox (3 bestanden): coaching voorstel (2025-12-11), intake (2026-01-13), coachgesprek sessie 2 (2026-02-10) — alle drie als PKM/Documents-stubs aangemaakt.
- **Larry** verwijderde de drie inboxbestanden na expliciete toestemming.
- **Larry (Librarian)** corrigeerde laatste SSOT-drift: "RDB Dartmond Rivierenland" in dartpraat-podcast-document vervangen door `[[rivierenland-darts-bond]]` + D.T. Irritant.

## Decisions made

- **Teamnaam:** D.T. Irritant. Bond = Rivierenland Darts Bond (RDB).
- **Divisie:** Sander speelt Eredivisie bij RDB (niet Eerste Divisie zoals eerder aangenomen).
- **Org-slug:** `rivierenland-darts-bond.md` (bond), geen aparte teamfile voor D.T. Irritant.
- **Marc Vleghert** krijgt eigen CRM-profiel omdat hij zowel teamgenoot, SL-partner als coachee is.
- **Inboxbestanden mogen verwijderd worden** door Larry zodra ze verwerkt zijn, mits Sander expliciet toestemming geeft per sessie.

## Insights

- Sander speelt twee parallelle competities: RDB Eredivisie (regionaal, D.T. Irritant) en Superleague (nationaal, SL Rijnvogels Duurzaam). Dit zijn aparte Teambeheer-domeinen (d=1 vs d=21).
- Arno Looijen was eerst ploeggenoot (SL Dubbel10 Arnhem), dan tegenstander (SL Rijnvogels), waarna Sander hem volgde naar Rijnvogels. Verklaart zijn prominentie in Sanders dartswereld.
- Marc Vleghert is een serieuze talent: Jeugd WK 2024, Nederlands Team Four Nations 2024-2025, Q-School Final Stage 2026. Coaching via DartsCoaching.nl is meer dan hobby-begeleiding.
- gewoonsander.nl is Sanders persoonlijke/zakelijke site én hij bouwde de RDB-website — RDB is dus ook een Gewoon Sander-klant.

## Realignments

- **Bondsnaam:** "Dartmond" is geen onderdeel van de bondsnaam. Correcte naam: Rivierenland Darts Bond (RDB). Alias verwijderd.
- **"Eerste Divisie"** — Larry nam aan Eerste Divisie op basis van eerdere sessiedata; Sander corrigeerde naar Eredivisie.
- **Teamnaam** — "Dartteam Irritant" bleek "D.T. Irritant" te zijn (officiële Teambeheer-naam).

## Open threads

- [ ] Marc Vleghert: naar welk Superleague team gaat hij in seizoen 26-27?
- [ ] Xanne Lynn van Ockenburg-Zwaan: profiel is nog een stub zonder data.
- [ ] financiele-vrijheid.md: nog verder aan te vullen (uit vorige sessie).
- [ ] Team Inbox handmatig op te ruimen door Sander: Sem Lizzy Van Ockenburg.vcf, adviesrapport Mevr. M. van Ockenburg-Zwaan.pdf, Huismanstraat ontwikkelplan.docx, fwdoffertewarmtepomp.zip (uit vorige sessie, Larry kan deze niet verwijderen zonder nieuw akkoord).

## SuperLeague-verwerking (vervolgsessie na context-compactie)

- **Larry** fetched ndbdarts.nl/competities/superleague — volledige structuur, format, prijzengeld, kampioenen en geschiedenis opgehaald.
- **Larry** updatte `ndb-nederlandse-darts-bond.md` met uitgebreide SuperLeague-sectie.
- **Larry** maakte `PKM/CRM/Organizations/sl-dubbel10-arnhem.md` aan (Sander's SL team 22-24).
- **Larry** maakte `PKM/CRM/Organizations/sl-rijnvogels-duurzaam.md` aan (Sander's SL team 24-heden).
- **Larry** updatte `sander-van-ockenburg-zwaan.md`: SL-teamtabel nu met wikilinks naar org-entries.

## LaCo-onderzoek (vervolgsessie na context-compactie #2)

- **Discovery:** Teambeheer LaCo-domein = **d=20**; Sander's ID is ook in d=20 **2100113** (zelfde als d=1).
- **Seizoensoverzicht (volledig):** 17-18 (7 wed), 18-19 (8 wed), 19-20 (5 wed — COVID), 21-22 (10 wed — kampioensjaar). 20-21 niet gespeeld (COVID). Gestopt na kampioen worden.
- **Vaste koppelpartner LaCo:** Niels van Zanten (elk seizoen).
- **Stats per seizoen:**

| Seizoen | Wed | Singles | Koppels | 180s | HF |
|---------|-----|---------|---------|------|----|
| 17-18 | 7 | 57,1% | 57,1% | 3 | 138 |
| 18-19 | 8 | 75% | 85,7% | 5 | 152 |
| 19-20 | 5 | 60% | 100% | 5 | 116 |
| 21-22 | 10 | 70% | 88,9% | 11 | — |

- **Bestanden bijgewerkt:** `sander-van-ockenburg-zwaan.md` (LaCo-tabel toegevoegd), `rivierenland-darts-bond.md` (LaCo-sectie uitgebreid met d=20, seizoenen, teamgenoten).

## Next steps

- Volgende sessie coachgesprek Marc Vleghert sessie 3 (gepland 10 maart 2026) verwerken zodra Sander die deelt.
- Open threads hierboven oppakken naar behoefte.

## Cross-links

- Vorige sessie (pre-compactie): bevatte aanmaak RDB-profiel (mislukt door context-einde), Dartpraat-podcast, Key Elements opschonen, Documents hernoeming — zie sessielog niet beschikbaar (context compact).

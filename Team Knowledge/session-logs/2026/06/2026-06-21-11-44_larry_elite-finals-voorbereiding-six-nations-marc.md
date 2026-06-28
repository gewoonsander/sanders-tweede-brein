---
agent_id: larry
session_id: elite-finals-voorbereiding-six-nations-marc
timestamp: 2026-06-21T11:44:00+02:00
type: close-session
linked_sops: ["SOP-010-adc-inschrijvingen-opvragen"]
linked_workstreams: ["WS-004-facebook-toernooi-verslag"]
linked_guidelines: []
---

# Voorbereiding Regional Elite Finals + Six Nations Cup update Marc Vleghert

## Context

Vervolgsessie op de twee eerdere sessies van vandaag. Sander bereidt zich voor op de Regional Elite Finals (Dartcafé Dubbel 10, Arnhem, 14:00 — waar hij zelf ook als #4 seed meespeelt) en vroeg tussendoor om een update over Marc Vleghert's Six Nations Cup-optreden.

## What we did

- Larry deed de dagstart: 1 ongelezen mail (nieuwsbrief, geen actie), agenda (Elite Finals 14:00-17:00), 1 openstaande taak (€400 cash meenemen, prijzengeld).
- Larry haalde de deelnemerslijst (24 spelers) en de regionale ranglijst op via Dart Atlas, en bepaalde de top 4 seeds (Ricardo Ulrich, jeffrey mansveld, John Lutgens, Sander zelf als #4).
- Larry verifieerde de prijzengeldverdeling (€200/€100/€50/€50 = €400) — bevestigde Sanders uitleg dat bij Best of 9 Direct KO beide halve finalisten de volle 3e-plaats-prijs krijgen (al vastgelegd als project-memory).
- Op verzoek bouwde Larry een volledig speelschema (24 spelers, 8 bye's voor de top-8 ranking, 16 spelers in ronde 1), eerst met JS-driven interactieve loting-widget (door Sander geannuleerd), uiteindelijk uitgewerkt als statisch printbaar HTML-schema met de logo's van ADC Benelux en Dartcafé Dubbel 10 (gedownload via Dart Atlas resp. al aanwezig in de Mediahub).
- Sander wilde een eerlijkere, fysieke lotingsmethode i.p.v. software-randomisatie: gesprek over een kaartspel-gebaseerde trekking (16 kaarten: schoppen A-K + 3 azen) met een vast spreidingspatroon zodat spelers die samen aankomen niet naast elkaar in het schema vallen. Larry werkte dit verdeelpatroon uit en verwerkte de kaartnamen in het schema.
- Het schema werd stap voor stap uitgebreid: prijzengeld-overzicht, info over de Main Tournament (27 juni, Made — winnaar €2.500 + ADC Global Championship-plek, link geverifieerd), en een aankondiging over de Pub Qualifiers die doorgaan op de huidige locaties richting de Benelux Open 2026 (Beesd afgehaakt) — alles samengeperst tot één liggende A4.
- Op Sanders verzoek maakte Larry vervolgens een apart, ruimer A4'tje specifiek voor het verzamelen van e-mailadressen (Sander gaat zelf langs alle 24 spelers).
- Los daarvan: Sander vroeg een samenvatting van een NDB-artikel over de Six Nations Cup en de prestaties van zijn coachee Marc Vleghert. Het artikel zelf noemde geen spelersnamen; Larry vond via DartConnect (Sander stond al ingelogd in de browser) de volledige individuele leg-data van Marc in beide groepswedstrijden (9 legs, 2 gewonnen, gem. ~76) en legde dit vast in een nieuw dossierbestand, gekoppeld aan Marc's CRM-profiel.
- Sander checkte of de DartConnect-data niet per ongeluk uit het 2025-archief kwam — Larry bevestigde aan de hand van de paginaheaders dat het de 2026-editie was.
- Sander gaf aan dat de Six Nations-opvolging (halve finale/finale) alleen relevant is als Marc daadwerkelijk meespeelt — Larry checkt dit eerst voordat hij verder volgt.

## Decisions made

- **Question:** Hoe wordt de loting voor ronde 1 dit toernooi fysiek georganiseerd?
  **Decision:** Via een kaartspel (schoppen A-K + hartenaas, ruitenaas, klaveraas = 16 kaarten), met een vooraf vastgelegd spreidingspatroon over de 4 kwarten van het schema — niet via software-randomisatie op het moment zelf. Reden: voorkomt dat spelers die samen aankomen naast elkaar in het schema belanden, en voelt eerlijker/leuker als fysiek ritueel bij de check-in.
  **Decision:** E-mailadressen verzamelen via een los, ruim A4-blad (niet geïntegreerd in het wedstrijdschema) omdat Sander zelf langs alle spelers gaat en daarvoor meer schrijfruimte nodig heeft dan een compacte lijst toelaat.

## Insights

- DartConnect (`tv.dartconnect.com` / `recap.dartconnect.com`) geeft per leg een "remaining"-waarde voor beide spelers; wie op 0 uitkomt heeft die leg gewonnen — vergelijkbare logica als de Dart Atlas-checkout-structuur die deze ochtend al was uitgezocht, maar met een andere onderliggende dataset/site.
- Sander had al een ingelogde DartConnect-sessie open in de browser (account "Sander Voz", Premium) — nuttig om te onthouden voor toekomstige Six Nations/internationale toernooi-opvragingen, scheelt een login-stap.
- Bij toekomstige bracket-/loting-vraagstukken: eerst checken of de gebruiker een puur random proces wil, of een proces dat rekening houdt met praktische realiteit op locatie (zoals "wie komt met wie aan") — dat verandert het hele ontwerp van de oplossing.

## Realignments

- Sander annuleerde de interactieve JavaScript-loting-widget — hij wilde geen losse, op-zichzelf-staande randomisatie, maar een doordachter systeem gebaseerd op fysieke aankomstvolgorde/kaarttrekking. Larry paste de aanpak direct aan naar een statisch schema met een vooraf uitgedacht spreidingspatroon in plaats van live randomisatie.

## Open threads

- [ ] Loting op locatie uitvoeren: spelers trekken bij aankomst een kaart, naam wordt ingevuld op het schema.
- [ ] Prijzengeld-envelopes (eerder gemaakt) en het wedstrijdschema vandaag daadwerkelijk gebruiken en invullen tijdens het toernooi.
- [ ] E-mailadressen ophalen bij alle 24 spelers via het losse A4-blad.
- [ ] Six Nations Cup halve finale (zo 21 juni, 13:30): alleen volgen als Marc Vleghert in de line-up staat — eerst checken.
- [ ] Volgende coachsessie met Marc: leg-gemiddelde van vandaag (~76, onder zijn doel van 80) en het contrast met eerdere Four Nations-koppelgemiddelden (92-96) bespreken.
- [ ] Na het Elite Finals-toernooi: verslag opstellen volgens de staande WS-004-regel (geen losse vraag meer nodig) — inclusief checkout-analyse via de parallelle fetch-methode.

## Next steps

- Bij terugkomst van het toernooi: uitslagen verwerken (winnaar, finale-score, checkouts, 180's) en het Facebook-verslag opstellen.
- Six Nations: line-up voor de halve finale checken via NDB-artikel of DartConnect voordat verder gevolgd wordt.
- Marc's leg-data van vandaag meenemen naar de volgende coachsessie.

## Cross-links

- `[[2026-06-21-00-28_larry_youtube-samenvatting-en-backup-protocol-fix]]` — vorige sessie vandaag.

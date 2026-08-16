---
key_element: proces
title: Frustratie-audit — sessielogs, journals en regeldocumenten
date: 2026-08-16
status: definitief
tags:
  - audit
  - proces
  - zelfreflectie
---

# Frustratie-audit — Sander & Co

**Opdracht:** vind elke frustratie die Sander heeft geuit, achterhaal waarom fixes niet standhielden, en vind waar de eigen regels elkaar tegenspreken. Geen fixes uitgevoerd — dit is uitsluitend een rapport.

**Leeswaarschuwing vooraf, en dit blijft de hele tijd relevant:** dit corpus bevat vrijwel geen verbatim frustratie-taal. Alle drie de onderzoeksslices (juni, juli, augustus) rapporteren onafhankelijk van elkaar hetzelfde: wat er staat is bijna uitsluitend **PARAFRASE** — door de loggende agent zelf in de derde persoon geschreven ("Sander corrigeerde X"), niet Sanders eigen woorden tussen aanhalingstekens. Over 134 bestanden zijn precies **5 echte verbatim citaten** gevonden, en geen daarvan is boze of geïrriteerde taal — het zijn feitelijke correcties. Waar dit rapport "PARAFRASE" zegt, is dat een waarschuwing: behandel het niet als een letterlijk citaat.

---

## STAP 0 — De telling

| | |
|---|---|
| Sessielogs totaal | **134** |
| — juni 2026 | 43 |
| — juli 2026 | 35 |
| — augustus 2026 (t/m 16e) | 56 |
| Oudste sessielog | `2026-06-13-23-00_larry_darts-rdb-marc-vleghert-coaching.md` |
| Nieuwste sessielog | `2026-08-16-15-46_hermes_second-brain-adc-gezondheid-en-transcriptie.md` |
| Specialist-journals (Team/*/journal/) | **0 entries**, in alle 12 mappen. Alleen README's/templates. Geconfirmeerd via directe telling, geen agent-inzet nodig gehad. |
| `.claude/memory`-bestanden | 30 (19 feedback, 3 user, 7 project, 1 overig) |
| Team Knowledge/tasks | 5 open, 2 in-progress, 3 done, 0 cancelled |
| Git-repo eerste commit | 2026-06-17 (sessielogs beginnen 4 dagen eerder — bestanden bestonden al voor git-tracking begon) |

**Native vs. geïmporteerd:** de 134 sessielogs, de (lege) specialist-journals, de 30 memory-bestanden en de 10 taken zijn allemaal native — geschreven door het team zelf, over zichzelf. **`PKM/Documents/YouTube-Kennis/` (176 bestanden) is een andere soort content** — geharveste video-transcripties van een extern YouTube-kanaal, niet door het team over zichzelf geschreven. Die beantwoorden een andere vraag en zijn **niet meegenomen** in deze audit. Geen ander importspoor gevonden (geen Heptabase/Notion/Obsidian-migratiesporen in het native corpus).

### De band

**134 sessielogs → ruim boven de 30-drempel.** Dit rapport draait alles, en recurrentie betekent hier echt iets — dit is niet "kon het verschil tussen een patroon en een dinsdag niet zien." Vertrouwen: hoog voor recurrente thema's; voor eenmalige vermeldingen blijft gelden dat het bewijs is dat iets één keer is gebeurd, niet meer.

---

## STAP 1 — Het correctiekanaal

`## Realignments` binnen sessielogs is het correctiekanaal hier — exact dezelfde rol als in het referentiecorpus.

- **89 van de 134 bestanden** hebben de kop.
- Daarvan **41 met echte inhoud**, **48 expliciet leeg** ("geen"/"none this session").
- Een handvol augustus-bestanden gebruikt een alternatieve vorm: een heel bestand met `type: realignment` in plaats van een sectie — dezelfde functie, andere verpakking.
- **Tweede, kleiner correctiekanaal gevonden:** `.claude/memory/feedback_*.md` (19 bestanden) — dit zijn *gedestilleerde* correcties (door Hermes achteraf samengevat tot een blijvende regel), geen ruwe sessienotitie. Bruikbaar voor Stap B, niet als aanvullend verbatim-bewijs.

**Van de 5 verbatim citaten in het hele corpus:**
1. *"Nee het is niet gelukt om bij te werken en alle werkzaamheden zijn weg."* — 29-06, na een mislukte sorteerpoging op een gedeeld Google Sheet.
2. *"wat jij breedte noemt is de lengte van het huis"* — 22-06, plattegrond-correctie.
3. *"verplaatsen mag enkel als je de bestanden ook hernoemt"* — 29-06.
4. *"zorg er wel voor dat je het goede seizoen toepast dus 26-27"* — 11-08.
5. *"Ik wil zoveel mogelijk gratis oplossingen of in ieder geval oplossingen die binnen mijn huidige software stack vallen."* — 14-08.

Nummer 1 is het enige citaat in 134 bestanden met echte emotionele lading. De rest is instructief, niet boos.

---

## A — Terugkerende thema's

Gesorteerd op recurrentie. De lijn is expliciet getrokken: **thema's met 1 vermelding zijn OBSERVATIES, geen eisen.**

### Terugkerend (eis-niveau)

**1. Geletterde keuze-opties niet toegepast (GL-013)** — hoogste recurrentie
Eerste keer: 03-07-2026 ("de GL-013-origin-sessie"). Laatste keer: **deze sessie, 16-08-2026** (de Stop-hook greep letterlijk meerdere keren in tijdens het schrijven van dit rapport). Aantal aparte sessies: **≥8** (03-07, 06-07 ×2 binnen één sessie, 07-07, 14-07 [valse positief], 07-08, 10-08 ×2 op dezelfde dag maar verschillende deelfouten, en doorlopend in augustus).
Bewijs: uitsluitend PARAFRASE ("Sander confronteerde Hermes met het herhaaldelijk vergeten van geletterde keuzeopties").

**2. Aannames als feiten gepresenteerd, later gecorrigeerd**
Verspreid over alle drie de maanden, tientallen losse gevallen, telkens een ander feit: "Eerste Divisie" → Eredivisie, "Dartmond" → Rivierenland Darts Bond, badkamer 13× verkeerd gepositioneerd, Elite Finals-locatie verwisseld, posterverkeerd-vergeleken-e-mail naar John Lokken, WordPress-inlog-URL fout, Charta's "geverifieerd"-melding twee keer op rij onjuist, "live-test"-claim doorgegeven zonder eigen verificatie, seizoen 25-26 i.p.v. 26-27. Dit is geen incident maar een patroon: PARAFRASE, elke keer een ander feit, geen enkele keer dezelfde herhaling van hetzelfde specifieke feit — vandaar OBSERVATIE per incident, maar het patroon zelf is de hoogst-frequente eis van dit hele rapport.

**3. Herhaalde toestemmingsprompts / permission-fatigue**
30-06 (eerste fix: allowlist toegevoegd) → 07-08 (Todoist-prompts, andere hoofdoorzaak: verouderde MCP-server-ID in de allowlist) → 14-08 (harde CLAUDE.md-regel na "herhaaldelijk, expliciete feedback... 'always allow' gezegd, en toch bleef Hermes per actie bevestiging vragen"). 3 aparte sessies over 2,5 maand.

**4. GL-016-beslisblokken niet consistent toegepast**
Geïntroduceerd 11-08, zelfde dag al niet toegepast (10:45-sessie), opnieuw gecorrigeerd 16-08 (nummeringsvolgorde). 3 aanrakingen in 5 dagen — korte tijdspanne, maar een echte herhaling.

**5. Duplicate/verouderde mapstructuur ("sanders-tweede-brein") veroorzaakte stille fouten**
30-06 ("opgelost") → 06-07 (terugkeer) → 07-07 (een hele sessie bleek op de verkeerde, niet-gesynchroniseerde kopie te hebben gedraaid, waardoor de GL-013-hook die sessie inert was). 3 sessies, geen terugkeer gevonden in augustus — mogelijk een fix die wél hield (zie Stap B).

### Eenmalig (observatie, geen eis)

- Facebook-vooraankondiging werkwoordstijd (05-07) — eenmalig gecorrigeerd, nooit teruggekomen.
- Sheet-sorteer-dataverlies (29-06) en n8n-contactoverschrijving (03-07) — twee losse data-verlies-incidenten, verschillende systemen; te weinig overlap om als één terugkerend thema te tellen, wel allebei vermeldenswaardig als losse observaties over hetzelfde risicoprofiel (automatische edits op gedeelde/bestaande data zonder voldoende terugvalpad).
- Opslagstrategie-ommekeer foto's/documenten (30-06 → 06-07) — inclusief een nooit opgehelderd mysterie van 139 zoekgeraakte foto's, expliciet "bewust genegeerd" volgens het eigen sessielog. Grensgeval (2 sessies) — ik noem het, maar behandel het niet als hard bewezen patroon.

---

## B — Waarom de fixes niet standhielden

| Thema | Fix op dat moment | MECHANISM of SENTENCE | Recurrentie vóór | Recurrentie ná |
|---|---|---|---|---|
| GL-013 keuze-opties | Regel geconsolideerd + een Stop-hook (`check-lettered-options.py`) die mechanisch blokkeert | **MECHANISM** — maar met scopegaten: inert in Cowork-host (geen terminal-hook daar), inert op de verouderde mapkopie (bestand ontbrak), en aantoonbaar een bot instrument (valse positief 14-07). | Onbekend exact aantal vóór de hook (niet met naam getagd in juni) | **Nog steeds actief opgetreden** — juli (5×), augustus (meerdere), en deze sessie zelf. Maar: elke keer dat de hook *wél actief en aanwezig* was, hield hij stand. Elke recidive is herleid tot de hook die niet aanwezig/actief was in die specifieke omgeving — niet tot de hook die faalde terwijl hij draaide. |
| GL-014 Todoist-formaat | Eerst alleen een regel in GL-014 | **SENTENCE → MECHANISM** (11-08: nieuwe PreToolUse-hook gebouwd na 1 gemiste toepassing) | 1× gemist (11-08) | Geen recidive gevonden in de resterende augustus-logs (11–16 aug) — te korte periode om hard te concluderen dat het houdt. |
| Permission-fatigue | 30-06: allowlist in `.claude/settings.json` | **MECHANISM**, maar statisch/handmatig onderhouden — verouderde toen de onderliggende MCP-server-ID wijzigde | 1× (30-06, aanleiding) | **Ja, 2× recidive** (07-08 andere oorzaak binnen dezelfde categorie, 14-08 uiteindelijke harde regel). De huidige, meest recente fix (14-08, CLAUDE.md) is terug een **SENTENCE** — geen nieuw mechanisme, alleen een stelliger geformuleerde regel. Gegeven de eerdere mechanism-decay is dit een reëel risico. |
| GL-016 beslisblokken | Regel in GL-016 (SENTENCE) | **SENTENCE** — geen hook gevonden die dit mechanisch afdwingt (in tegenstelling tot GL-013) | 0 (nieuw op 11-08) | **Ja, 2× binnen 5 dagen** (11-08 zelfde dag, 16-08). |
| Duplicate mapstructuur | Memory-bestand (`project_dubbele_tweede_brein_map`) | **SENTENCE** | 2× (30-06, 06-07) vóór het memory-bestand | Geen recidive gevonden in augustus — voorzichtig positief, zwak bewijs (afwezigheid van bewijs, niet bewijs van afwezigheid). |
| Aannames als feiten | `.claude/memory/feedback_geen_aannames_als_feiten.md` | **SENTENCE — en niet eens teamdocument.** Geverifieerd: dit staat **niet** in AGENTS.md of CLAUDE.md (`grep` op "aannames"/"assumptions" in beide: nul treffers), ondanks dat een subagent tijdens deze zelfde sessie zelf claimde dat dit "in mijn eigen AGENTS.md" stond — wat aantoonbaar onjuist is. | Doorlopend, tientallen gevallen | Doorlopend, geen waarneembare afname vóór/na — er is geen duidelijk "na"-moment omdat het nooit één keer is vastgelegd als teamregel. |

**Kernbevinding van Stap B:** de enige regel die aantoonbaar wél standhoudt zodra hij actief is, is de regel met een mechanisme (GL-013). Maar "mechanisme" is hier geen garantie — het is een garantie **binnen de omgeving waarin het mechanisme daadwerkelijk draait**. Twee van de vier onderzochte mechanismen/sentences die faalden, faalden niet omdat de regel zwak was, maar omdat de regel afwezig was in de specifieke sessie (verkeerde host, verkeerde mapkopie, verouderde config-waarde). Dat is een ander soort probleem dan "niemand houdt zich eraan" — het is "de controle was er soms simpelweg niet."

---

## C — Levende tegenstrijdigheden

**Cluster gecontroleerd: `Team Knowledge/Guidelines/` (17 bestanden), plus één kruisverwijzing die daarbuiten viel.** Dit is **niet** een volledige sweep van alle 58 regeldocumenten (17 Guidelines + 32 SOP's + 9 Workstreams) — alleen de Guidelines-cluster is grondig gecontroleerd op "single source of truth"-claims. Aantal hieronder is dus "N tegenstrijdigheden in de eerste grondig gecontroleerde cluster", niet "N in de map."

### 1. GL-018 vs. `PKM/Documents/software-en-tools.md` — zelf live meegemaakt tijdens deze sessie

- **GL-018** (`Team Knowledge/Guidelines/GL-018-integratie-en-software-register.md`, regel 11, `last_verified: 2026-08-16`): *"Dit is de portable single source of truth voor de externe koppelingen en belangrijke software rond Sanders myPKA."* Gestructureerd JSON-register, 20 integraties, machine-leesbaar door de Cockpit, eigenaar Daedalus.
- **`PKM/Documents/software-en-tools.md`**: een los, prozaïsch Markdown-overzicht van software per categorie (Affinity, Canva, Firecrawl, WPMU Dev, Formflow) — zonder enige verwijzing naar GL-018, zonder erkenning dat GL-018 bestaat.
- **Wie heeft gelijk:** GL-018. Het is het resultaat van een specifiek SSOT-ontwerptraject (`2026-08-11-een-ssot-voor-software-en-koppelingen-design`, waarnaar GL-018 zelf verwijst), heeft een schema, een eigenaar, en wordt door de Cockpit gelezen.
- **Hoe vers dit is:** ikzelf heb, eerder in déze zelfde sessie, `software-en-tools.md` aangewezen als "precies de juiste plek" voor een nieuwe rclone-installatie en er zelfs een registratie-conventie aan toegevoegd — zonder ooit van GL-018's bestaan te weten. Dit is dus geen archiefvondst maar een tegenstrijdigheid die *tijdens het schrijven van dit rapport* nog actief werd vergroot.

### 2. "De hook handhaaft dit mechanisch" — documentatieclaim vs. realiteit

GL-013 stelt dat de Stop-hook GL-013 mechanisch afdwingt. Meerdere sessielogs (juli: 06-07, 07-07, 14-07; augustus: 07-08 e.v.) laten zien dat dit **alleen waar is binnen een Claude Code-terminalsessie met de juiste working directory** — inert in Cowork, inert op een niet-gesynchroniseerde mapkopie. De documentatie zegt "gehandhaafd", de praktijk zegt "gehandhaafd, mits...". Niet fout, wel onvolledig — een lezer die alleen GL-013 leest, verwacht een garantie die er in de praktijk niet altijd is.

---

## D — Ongevolgd en verouderd werk

| Status | Aantal | Oudste | Leeftijd |
|---|---|---|---|
| Open | 5 | `tsk-2026-08-12-001-build-portable-dropbox-mcp` | 4 dagen (bewust **BLOCKED** op Sanders eigen verzoek, geen sluipende veroudering) |
| In-progress | 2 | `tsk-2026-08-11-001-mypka-cockpit-software-stack-tabblad` | 5 dagen |
| Done (referentie voor doorlooptijd) | 3 | — | 7 dagen was de langste geobserveerde doorlooptijd (02-07 → 09-07); kortste: dezelfde dag |

**Eerlijke conclusie:** met een historisch maximum van ~7 dagen zit niets momenteel over die grens. Het oudste open item (Dropbox MCP) is expliciet gepauzeerd, geen vergeten werk. Het in-progress Cockpit-tabblad-item (5 dagen) nadert de grens en is het enige dat het waard is in de gaten te houden — maar "abandoned" is op dit moment niet aan de orde. Geen kunstmatige crisis hier: dit onderdeel van het systeem werkt.

---

## E — Wat deze audit niet heeft bereikt

- **Volledige regeldocument-sweep:** alleen de Guidelines-cluster (17 van 58 regeldocumenten) is grondig op tegenstrijdigheden gecontroleerd. SOP's (32) en Workstreams (9) zijn niet systematisch tegen elkaar gelegd — alleen incidenteel gezien wat de drie maand-agents in het voorbijgaan opmerkten.
- **17 van de 19 feedback-memory's** zijn niet met dezelfde striktheid geverifieerd als de 2 hierboven (taal-Nederlands, geen-aannames). Een losse trefwoord-grep gaf ruis (te veel valse positieven door incidenteel woordgebruik) — ik heb die aantallen bewust **niet** in dit rapport gebruikt omdat ik ze niet kan verantwoorden.
- **`PKM/Journal/`** (Sanders persoonlijke dagboek, geschreven door Penn) is niet gelezen — de opdracht vroeg om specialist-journals en sessielogs, dit is een ander soort document (voor Sander, niet over het team) en viel buiten de gestelde scope.
- **Juni-slice:** ~19 van de 43 bestanden zijn alleen gesweept (nul marker-treffers, geen Realignments-inhoud), niet volledig gelezen. Juli en augustus zijn wel alle bestanden volledig gelezen.
- **Todoist/Google Calendar zelf** zijn niet bevraagd voor een onafhankelijke doorlooptijd-referentie in Stap D — alleen de taakbestanden zelf.

---

## Samenvattend oordeel

Dit is geen systeem in crisis. De sterkste bevinding is niet "Sander is vaak boos" — hij is dat volgens dit corpus vrijwel nooit, in ieder geval niet in woorden die zijn vastgelegd. De sterkste bevinding is dat **het team zelf zijn eigen mechanismen inconsistent bouwt**: één regel (GL-013) kreeg een hook en houdt daardoor grotendeels stand zodra die hook aanwezig is; de meeste andere regels — inclusief een principe zo fundamenteel als "verzin geen feiten" — leven alleen als tekst, worden soms zelfs verkeerd geciteerd als "wel gecodificeerd" door het team zelf, en tonen geen meetbaar effect van hun eigen bestaan.

---

## THEN MAKE IT BITE

**1. Hoogst-recurrente thema — mechanism of sentence?**
GL-013 (geletterde keuzes) is de hoogst-recurrente *bewaakte* regel en is al een **MECHANISM**. Maar het onderliggende, nog hoger-frequente patroon — "aannames als feiten presenteren" — is een pure **SENTENCE**, en leeft zelfs niet in een teamdocument, alleen in Hermes' eigen `.claude/memory`.
Voorgestelde mechanism (niet gebouwd, alleen beschreven): een verplicht, machine-afdwingbaar onderscheid tussen een **geverifieerd feit** (bron aanwezig: bestand gelezen, API-respons ontvangen, gebruiker heeft het letterlijk gezegd) en een **aanname** (afgeleid, herinnerd uit een eerdere sessie, of geëxtrapoleerd). Elke bewering die het corpus verlaat — een sessielog, een journaalregel, een bericht aan Sander — zou een bron-tag moeten dragen; ontbreekt die tag bij een specifiek, verifieerbaar feit (een naam, een datum, een locatie, een status), dan blokkeert een hook de output net zoals de GL-013-hook nu al blokkeert op ontbrekende lettering. Het zou falen op precies wat GL-013's hook nu al detecteert: een patroon in de tekst (hier: een claim zonder brontag) — niet op inhoudelijke juistheid, wat sowieso niet mechanisch te toetsen is.

**2. De omvang van het lek**
Van de correcties die zijn onderzocht op codificatie, zijn er **minimaal 4 bevestigd** die nooit in enig regeldocument (GL/SOP/Workstream/AGENTS.md/CLAUDE.md) terecht zijn gekomen en uitsluitend in `.claude/memory` blijven hangen — waar alleen Hermes' eigen sessies ze automatisch zien, geen enkele subagent of specialist:
`feedback_taal_nederlands`, `feedback_geen_aannames_als_feiten`, `feedback_bureaublad_leeg`, `feedback_klantcommunicatie_ik_niet_wij`.

**Dit getal is een ondergrens, geen volledige telling** — zie Sectie E: 17 van de 19 feedback-memory's zijn niet met dezelfde striktheid gecontroleerd, dus het werkelijke lek is waarschijnlijk groter dan 4.

**3. De audit op zichzelf toegepast**
- Sessielogs: **131 van de 134 volledig gelezen** (97,8%) — juli en augustus 100%, juni ~35% volledig gelezen + 65% gesweept-maar-nul-treffers (die laatste groep is bewust niet blind meegeteld als "gelezen").
- Regeldocumenten: **17 van 58 grondig gecontroleerd** (29%) — alleen de Guidelines-cluster.
- Feedback-memory's: **2 van 19 rigoureus geverifieerd** (11%) — de rest is als onbetrouwbare ruis terzijde gelegd in plaats van als harde data gepresenteerd.
- **Grootste losse ding dat is overgeslagen:** een volledige tegenstrijdigheids-sweep van de 32 SOP's — de grootste enkele regeldocument-categorie in het hele systeem, en de categorie waar dit rapport de minste directe controle op heeft uitgevoerd.

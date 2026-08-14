# Pieter Post — security- en privacyaudit

**Verdict:** **CONDITIONAL PASS** voor een handmatige, concept-only Gmail-pilot. De historische Todoist-credentialblocker is op 14 augustus 2026 aantoonbaar gesloten. **BLOCKED** blijven autonome mailboxwrites, bijlageverwerking, daadwerkelijke Todoist-projectie en Jortt/Dropbox-automatisering totdat hun overige gates zijn opgelost.

**Scope:** Pieter-contract en shims, persoonlijke taakarchitectuur, Gmail/Todoist/Jortt/Dropbox-ontwerp, lokale credentialhygiëne en gegevensverwerking. Geen live mailboxinhoud is gelezen en geen credentialwaarde is weergegeven.

## Phase 1 — Credential hygiene

### [RESOLVED CRITICAL] Historische Todoist-tokenblootstelling afgesloten

**Where:** gitgeschiedenis van `Team Knowledge/.env`; commits `a1c65c9` en `e3a48dd`.

**What:** een echte `TODOIST_API_KEY` is op 28 juni 2026 gecommit. Tijdens deze audit is aangetoond dat de huidige token een andere waarde heeft en dat de historische token niet langer geldig is.

**Proof-of-exploit en herstelbewijs:** `git log --all -- 'Team Knowledge/.env'` toont de toevoeging in `a1c65c9` en verwijdering uit tracking in `e3a48dd`. Een SHA-256-vergelijking zonder waardeweergave gaf verschillende hashes. Een live Todoist-controle gaf voor de historische token `401` en voor de huidige token `200`. Geen tokenwaarde is afgedrukt of opgeslagen.

**Fix recommendation:** geen verdere tokenrotatie nodig op basis van dit bewijs. Geschiedenis herschrijven blijft optionele opschoning; voor nieuwe verbindingen heeft OAuth met minimale scopes de voorkeur.

**Verification step:** voltooid op 14 augustus 2026: oud `401`, huidig `200`, lokaal bestand `0600` en gitignored.

### Bestaande lokale secretopslag — PASS

`Team Knowledge/.env` bestaat lokaal met modus `0600`, wordt door `.gitignore` genegeerd en is niet als huidig bestand getrackt. De scan vond geen nieuw hardcoded token in de Pieter-bestanden.

## Phase 2 — Authorization and capabilities

### [HIGH] Gmail-writebevoegdheid is contractueel begrensd maar nog niet technisch afgedwongen

**Where:** bestaande Gmail-connector versus `Team/Pieter Post - Emailregisseur/AGENTS.md`.

**What:** de connector kan volgens het getoetste ontwerp naast lezen en concepten ook labels, archiveren, verzenden en andere mailboxwrites uitvoeren. Pieters contract vereist goedkeuring, maar er is nog geen technisch capability-profiel dat de pilot beperkt tot lezen en conceptvoorstellen. Een promptregel alleen is geen sterke autorisatiegrens.

**Proof-of-exploit:** het ontwerp registreert write-capabilities terwijl de hostshim geen apart, afdwingbaar read/draft-only Gmail-profiel definieert. Daardoor is er geen technisch bewijs dat een uitvoeringscontext met mailboxtoegang `send`, `delete` of `archive` niet kan aanroepen.

**Fix recommendation:** maak voor de pilot een allowlist: zoeken/lezen, threadcontext, attachment-metadata en conceptinhoud teruggeven aan Hermes. Mailboxwrites, verzenden, verwijderen en delen staan standaard uit of vereisen een afzonderlijke bevestigde toolcall met zichtbare thread, handeling en ontvanger.

**Verification step:** negatieve tests moeten aantonen dat Pieter zonder expliciete per-handelinggoedkeuring geen verzend-, verwijder-, archiveer- of shareactie kan uitvoeren.

### [HIGH] Gmail OAuth-toegang is breed; tokenopslag blijft providerbeheerd

**Where:** accountverbinding van de Gmail-plugin/MCP.

**What:** Google bevestigt voor `Claude for Gmail` toegang tot profielgegevens en Gmail-bevoegdheden om e-mails te lezen, op te stellen en te sturen, inclusief conceptbeheer en verzending. Het gekoppelde account is `sander@gewoonsander.nl`. De intrekkingsroute is zichtbaar via Google Account → Gekoppelde apps → Claude for Gmail → `Alles verwijderen`. De precieze tokenopslag is providerbeheerd en niet lokaal inspecteerbaar. De verleende toegang is functioneel passend voor de connector, maar breder dan een concept-only Pieter-pilot nodig heeft.

**Proof-of-exploit:** read-only controle op 14 augustus 2026 van de Google-pagina `Gekoppelde apps` toont letterlijk toegang om Gmail te lezen, op te stellen en te sturen en om concepten te beheren en e-mails te verzenden. De Gmail-connector bevestigde hetzelfde account via zijn profielactie. Er is niets gewijzigd of ingetrokken.

**Fix recommendation:** behoud de bestaande koppeling alleen achter een technische tool-allowlist en de expliciete goedkeuringsgrens. Als de connector geen smallere Google-scope ondersteunt, beperk dan de beschikbare tools per Pieter-run tot lezen/zoeken en lokaal conceptvoorstel; stel `send`, `delete`, `archive`, labels en delen niet beschikbaar zonder afzonderlijke bevestigde uitvoeringsstap.

**Verification step:** negatieve capabilitytests moeten aantonen dat Pieter vanuit zijn pilotcontext niet kan verzenden of andere mailboxwrites uitvoeren. De Google-intrekkingsroute is reeds geverifieerd.

## Phase 3 — Integration and untrusted input

### [HIGH] Bijlageverwerking mist nog een afdwingbaar quarantaineprotocol

**Where:** Pieter-contract en toekomstige Gmail-attachmentflow.

**What:** het contract noemt bijlagen onbetrouwbaar en verbiedt verdachte links, maar specificeert nog geen limieten, typevalidatie, macro-/scriptverbod, scanroute of veilige tekstextractie. Bijlagen beoordelen zonder dit protocol vergroot malware- en indirecte-promptinjectierisico.

**Proof-of-exploit:** Pieter mag bijlagen beoordelen, terwijl geen gekoppelde SOP beschrijft welke bestandstypen worden geaccepteerd of dat actieve inhoud nooit wordt uitgevoerd. Dit is een concrete ontbrekende controle op het geplande pad.

**Fix recommendation:** in de pilot alleen metadata tonen. Voor inhoud: type en magic bytes valideren, grootte begrenzen, nooit macro's/scripts uitvoeren, naar tijdelijke quarantaine buiten de PKM schrijven, tekst geïsoleerd extraheren en instructies uit het document als data labelen. Pas na classificatie naar een canonieke bestemming.

**Verification step:** test met een macrodocument, verkeerd gelabeld bestand en promptinjectietekst; geen code of instructie mag worden uitgevoerd en niets mag automatisch worden gedeeld.

### Promptinjectie en concept-first — PASS WITH CONDITIONS

Het actieve contract noemt mail en bijlagen expliciet onbetrouwbare data, verbiedt instructie-uitvoering en houdt verzenden, verwijderen, betalen en delen achter goedkeuring. Dit is voldoende voor de handmatige pilot zolang de technische write-allowlist hierboven geldt.

## Phase 4 — Data handling and GDPR posture

### [MEDIUM] Mailmetadata kan duurzaam in de git-back-up terechtkomen zonder minimale-retentieregel

**Where:** `PKM/Tasks/` velden `title`, `source_url`, personen/organisaties en append-only geschiedenis.

**What:** een e-mailtaak kan afzendercontext, onderwerp, Gmail-thread-ID en gevoelige casusmetadata duurzaam opslaan en via de repositoryback-up verspreiden. De architectuur zegt dat mailinhoud niet wordt gekopieerd, maar definieert nog niet welke metadata minimaal nodig is, hoe gevoelige titels worden geredigeerd of wanneer gesloten taakmetadata vervalt.

**Proof-of-exploit:** het goedgekeurde template schrijft `title`, `source_url`, relaties en geschiedenis naar markdown; alle markdown valt onder de normale git-back-up. Er is geen sensitivity- of retentionveld en geen speciale redactieregel.

**Fix recommendation:** voeg geen volledige onderwerpregels of cliëntinhoud toe wanneer een neutrale actietitel volstaat. Definieer een gevoelige-modus met geminimaliseerde titel, bronlink en alleen noodzakelijke actiecontext. Stel een review-/retentiebeleid vast voor afgeronde mailtaken en back-ups.

**Verification step:** maak een fictieve gevoelige mailtaak en controleer dat naam, diagnose, dossierinhoud en mailtekst niet in markdown of gitdiff verschijnen.

### [MEDIUM] Auditspoor heeft nog geen vast privacy- en integriteitsformat

**Where:** `## Geschiedenis` en toekomstige mailwrites.

**What:** er is een append-only geschiedenis, maar nog geen verplicht schema voor actor, goedkeurder, actie, timestamp, bron-ID en resultaat; evenmin een verbod op payloadlogging in de SOP zelf.

**Proof-of-exploit:** template en SOP eisen alleen een geschiedenisregel; twee agents kunnen daardoor verschillende of te uitgebreide inhoud loggen.

**Fix recommendation:** definieer een compacte auditregel zonder mailbody of attachmentinhoud: timestamp, actor, actie, bronthreadreferentie, goedkeurder, resultaat en foutcode. Log nooit tokens of gevoelige payloads.

**Verification step:** voer een fictieve conceptactie en fout uit en controleer dat het auditspoor compleet maar inhoudsarm is.

### [MEDIUM] Jortt–Dropbox-toegang en bewaarketen zijn onbekend

**Where:** toekomstige factuurroute.

**What:** ontvanger, toegang, canonieke opslag, retentie, verwijderrechten en onafhankelijke back-up zijn nog niet vastgesteld. Daarom kan deze route nog niet veilig worden geautomatiseerd.

**Proof-of-exploit:** het goedgekeurde ontwerp markeert de Jortt–Dropbox-relatie expliciet als onbekend.

**Fix recommendation:** Daedalus brengt datastroom en toegangsrollen in kaart; Argus beoordeelt least privilege, logging, intrekking en herstel voordat Pieter meer doet dan een doorstuurconcept voorbereiden.

**Verification step:** documenteer een testfactuur van ontvangst tot bevestiging en herstel, zonder echte cliënt- of betaalgegevens.

## Toegestane pilotgrens

Pieter mag voorlopig via Hermes:

- threads zoeken/lezen en maximaal vijf beslisvoorstellen maken;
- concepttekst aan Hermes teruggeven;
- een canonieke myPKA-taak **voorstellen** met geminimaliseerde inhoud;
- alleen attachment-metadata beoordelen;
- geen mailboxwrites, verzending, verwijdering, betaling, deling, Todoist-sync of Jortt/Dropbox-actie uitvoeren.

## Vrijgavecriteria voor volgende fase

1. ~~Todoist-tokenrotatie aantoonbaar afgerond.~~ Gesloten op 14 augustus 2026.
2. ~~Gmail-account, zichtbare toegang en revoke-route geïnventariseerd.~~ Afgerond op 14 augustus 2026; provider-tokenopslag blijft niet lokaal inspecteerbaar.
3. Technische Gmail-capability-allowlist en negatieve tests.
4. Bijlagequarantaine-SOP.
5. Gevoelige-taak- en auditlogregels toegevoegd.
6. Jortt–Dropbox-keten onderzocht voordat die route automatiseert.

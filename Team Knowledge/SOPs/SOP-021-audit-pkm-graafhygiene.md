# SOP — Audit PKM-graafhygiëne

- **Default owner:** Atlas (analyse), Hermes (structurele opvolging), Sander (goedkeuring)
- **Status:** actief
- **Getriggerd door:** “controleer weesbestanden”, “audit mijn wikilinks”, “is mijn kennisgraaf gezond?”, vóór een grote import, of periodiek onderhoud
- **Output:** een alleen-lezen auditrapport met geïsoleerde kandidaten, gebroken links, dubbelzinnige links en alleen-via-INDEX bereikbare notities
- **Referenties:** [[GL-001-file-naming-conventions]], [[AGENTS]], [[2026-08-14-pkm-graafhygiene-nulmeting]]
- **Herbruikbaar:** iedere specialist mag deze SOP uitvoeren; Atlas beoordeelt schema en classificatie

## Doel

Meet de bereikbaarheid en integriteit van de myPKA-graaf reproduceerbaar. Een technisch geïsoleerd bestand is een triagesignaal, geen verwijderadvies. Classificeer altijd vóór een wijziging.

## Veiligheidscontract

1. De audit is alleen-lezen op de vault.
2. Verwijder, verplaats, hernoem, combineer of herschrijf niets tijdens de audit.
3. Maak geen betekenisloze links om een telling op nul te krijgen.
4. Vraag Sander per kleine batch om goedkeuring vóór herstelwerk.
5. Behandel een ontbrekende bijlage, gebroken link, dubbelzinnige link en weesbestand als verschillende foutklassen.

## Procedure

### 1. Draai de scan

Vanaf de myPKA-root:

```bash
python3 "Team Knowledge/scripts/audit-pkm-graph.py" . --scope PKM --format markdown
```

Voor machineleesbare vergelijking:

```bash
python3 "Team Knowledge/scripts/audit-pkm-graph.py" . --scope PKM --format json
```

Gebruik `--output <pad>` alleen wanneer een blijvend rapport gewenst is. Zonder `--output` schrijft het script uitsluitend naar stdout.

### 2. Controleer eerst resolveringsproblemen

Behandel in deze volgorde:

1. **Dubbelzinnige links** — kwalificeer na inhoudelijke controle met het juiste pad volgens [[GL-001-file-naming-conventions]].
2. **Gebroken links** — bepaal of het doel is hernoemd, verplaatst, ontbreekt of slechts een voorbeeldplaceholder is.
3. **Ontbrekende bijlagen** — controleer de bedoelde opslaglocatie; maak geen leeg vervangbestand.

### 3. Classificeer geïsoleerde kandidaten

Geef ieder kandidaatbestand precies één primaire classificatie:

- **echte kenniswees** — relevante inhoud zonder betekenisvolle inkomende of uitgaande relatie;
- **collectie-item** — transcriptie of bronstuk dat via een collectie-hub hoort te worden ontsloten;
- **alleen-via-INDEX bereikbaar** — vindbaar, maar zwak verbonden;
- **technisch/templatebestand** — hoort bewust buiten de inhoudelijke graaf;
- **historische log** — beoordeel of betekenisvolle entiteiten in de inhoud ontbreken;
- **bewust zelfstandig** — leg de uitzondering vast en laat het bestand staan.

### 4. Stel een herstelbatch voor

Werk maximaal één samenhangende categorie tegelijk af. Per item vermeld je:

- huidig bestand;
- geconstateerd signaal;
- inhoudelijk juiste bestemming of relatie;
- voorgestelde actie: koppelen, pad kwalificeren, indexeren, samenvoegen, archiveren, verwijderen of uitzonderen;
- risico en bewijs.

Gebruik de verplichte keuze- en beslisblokken uit [[GL-013-interactie-enkelvoudige-keuzes]] en [[GL-016-beslis-en-waarschuwingsblokken]].

### 5. Wacht op goedkeuring

Voer geen herstelactie uit totdat Sander de concrete batch heeft goedgekeurd. Verwijderen blijft een afzonderlijke expliciete beslissing, ook wanneer een bestand technisch geïsoleerd is.

### 6. Voer uit en herscan

Na goedkeuring:

1. pas uitsluitend de goedgekeurde batch aan;
2. update betrokken `INDEX.md`-bestanden indien nodig;
3. draai exact dezelfde audit opnieuw;
4. vergelijk de tellingen en controleer dat geen nieuwe gebroken of dubbelzinnige links zijn ontstaan;
5. rapporteer opgeloste, bewust opengehouden en nieuw gevonden signalen.

## Interpretatieregels

- Een inkomende of uitgaande link maakt een bestand technisch verbonden, maar niet automatisch inhoudelijk goed gemodelleerd.
- Een INDEX-link telt als bereikbaarheid, maar blijft als zwakke verbinding zichtbaar.
- Collecties krijgen een hub; voeg geen willekeurige links aan ieder collectie-item toe.
- Links in codeblokken en inline-code zijn voorbeelden en worden genegeerd.
- `.git`, `.claude`, `.obsidian`, virtuele omgevingen, caches, geïnstalleerde Expansion-kopieën en `Expansions/` vallen buiten de scan.
- Markdownlinks, wikilinks en embeds worden afzonderlijk geteld.

## Kwaliteitscontrole

Voer vóór gebruik na een scriptwijziging uit:

```bash
python3 -m unittest discover -s "Team Knowledge/scripts/tests" -p "test_audit_pkm_graph.py" -v
```

Een run is technisch geldig wanneer de tests slagen, het script met exitcode 0 eindigt en dezelfde ongewijzigde vault twee keer dezelfde JSON-tellingen geeft.

## Veelgemaakte fouten

- Alle geïsoleerde bestanden als afval behandelen.
- Een link toevoegen uitsluitend om de graaf dichter te maken.
- Voorbeeldlinks in templates als productiebreuk herstellen.
- Een dubbelzinnige basename corrigeren zonder het bronbestand inhoudelijk te lezen.
- De scan op `.claude/worktrees` of geïnstalleerde Expansion-kopieën loslaten en daardoor duplicaten rapporteren.
- Opruimen zonder een herscan die regressies uitsluit.

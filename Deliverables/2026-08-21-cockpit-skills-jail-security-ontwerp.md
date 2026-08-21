# Security-ontwerp: een aparte jail voor `~/.claude/skills/<naam>/SKILL.md`

**Security Engineer:** Argus
**Datum:** 2026-08-21
**Opdrachtgever:** Hermes, namens Sander
**Scope:** myPKA Cockpit (`Expansions/mypka-cockpit`) — de Skills-pagina klikbaar maken voor domeinskills
**Verdict:** **GEEL** — bouwen mag, mits alle zeven verplichte checks uit §5 erin zitten én Sander de twee restrisico's uit §9 expliciet accepteert
**Uitvoerder:** Bezalel (frontend + server-route), niet Argus — zie §11

---

## 0. Correcties op de briefing (feiten boven aannames)

Drie dingen in de opdracht kloppen niet met wat er daadwerkelijk in de code staat. Ik noem ze eerst, omdat het ontwerp erop steunt.

### 0.1 Het worden er zes, geen vijf

De briefing noemt vier bestaande jails. Het zijn er **vijf**. De vijfde staat niet in `server.js` maar in `filetree.js`:

| # | Functie | Bestand:regel | Jail-root | Route(s) |
|---|---|---|---|---|
| 1 | `containedPkmPath` | `server.js:331` | `PKM/` | `/api/cockpit/media`, `/api/cockpit/file` (fall-through) |
| 2 | `containedDeliverablesPath` | `server.js:344` | `Deliverables/` | `/api/cockpit/file` |
| 3 | `containedTeamKnowledgePath` | `server.js:359` | `Team Knowledge/` | `/api/cockpit/file` |
| 4 | `containedTeamPath` | `server.js:1372` | `Team/` | `/api/cockpit/avatar` |
| 5 | `containedInboxPath` | `filetree.js:154` | `Team Inbox/` | `/api/cockpit/inbox-file` |

De nieuwe wordt dus **nummer zes**. Belangrijker dan het telwerk: jail #5 is precies de beslissing die hier opnieuw voorligt, en die is destijds al één keer genomen. `filetree.js:383-386` zegt het letterlijk:

> `The existing /api/cockpit/file route jails Deliverables/ + PKM/ but NOT Team Inbox/ — this is its inbox twin: same containment idiom, same inert inline headers, tighter allowlist.`

Een nieuwe root met eigen regels kreeg een **eigen route**, niet een extra tak in `/api/cockpit/file`. Dat is het gevestigde patroon van deze codebase. Zie §4.

### 0.2 De bestaande jails hebben GEEN symlink-afweer

De briefing stelt dat elke bestaande jail "`path.resolve()` + relative-containment-checks, symlink-afweer" heeft. Voor `/api/cockpit/file` is dat **onjuist**. Alle vijf `contained*Path()`-functies doen uitsluitend *lexicale* padwiskunde: `path.resolve()` + `path.relative()`. Er is geen `realpathSync`, geen `lstatSync`. Geverifieerd met een grep over de hele `server/`-map: `realpath`/`lstat` komen voor in `workbench.js`, `journalEntries.js`, `dartsTrainingApi.js`, `filetree.js` (voor de tree-walk) en `skillsApi.js` — maar in geen van de vijf jail-functies hierboven.

`path.resolve()` normaliseert `..` puur tekstueel; het volgt geen symlinks. En `res.sendFile(abs)` volgt ze wél (`send` doet `fs.stat`, niet `fs.lstat`; geverifieerd in `node_modules/send/index.js` — geen enkele `realpath`- of `lstat`-aanroep in dat bestand).

**Bewijs, niet theorie.** Ik heb `containedPkmPath` woordelijk overgenomen uit `server.js:330-337` en er twee paden doorheen gehaald in een sandbox:

```
path=../outside.md  -> 403 forbidden (jail held)
path=innocent.md    -> ALLOWED
   lexical abs : <sandbox>/PKM/innocent.md
   REAL target : <sandbox>/outside.md
   outside PKM/: YES — jail escaped
   bytes served: "TOP-SECRET-OUTSIDE-THE-JAIL"
```

Directory-traversal wordt netjes geblokkeerd. Een **symlink die binnen de jail-root staat en naar buiten wijst, wordt geserveerd**. Reproductiescript: `<scratchpad>/jailproof/proof.mjs`.

Impact hiervan is beperkt — er moet iemand een symlink in `PKM/`, `Deliverables/`, `Team Knowledge/`, `Team/` of `Team Inbox/` planten, en dat zijn mappen die Sander zelf beheert. Het is dus geen actief exploiteerbare bug maar een **latente MEDIUM**: `Team Inbox/` is de map waar externe bestanden binnenkomen, en `PKM/` krijgt geïmporteerde content via WS-002. Ik voer dit op als **losstaande bevinding B-3** (§10), niet als blocker voor déze klus.

Consequentie voor het ontwerp: "doe het net als de bestaande jails" is hier de verkeerde instructie. De nieuwe jail moet het **beter** doen dan de bestaande vijf, niet gelijk. Het model dat wél klopt is `workbench.js` / `journalEntries.js`: slug-whitelist vóór elke FS-call, realpath-verankerde containment, expliciete symlinkafwijzing.

### 0.3 De blast radius is groter dan "wat config"

De briefing zegt "waar ook andere, mogelijk gevoelige config staat". Dat is te vriendelijk geformuleerd. Feitelijke inhoud van `~/.claude/` op deze machine:

| Item | Rechten | Waarom dit erg is als het lekt |
|---|---|---|
| `history.jsonl` (37 kB) | `600` | Volledige prompt-/commandogeschiedenis |
| `sessions/` | `700` | Sessie-inhoud |
| `daemon/` | `700` | Daemon-state |
| `session-env/` | `755`, **337 submappen** | Per-sessie omgevingsstate |
| `shell-snapshots/` | `755` | Shell-omgeving incl. wat daar aan variabelen in zit |
| `settings.json`, `settings.local.json` | `644` | Permissie-allowlist — een leesbare allowlist is een aanvalskaart |
| `projects/`, `telemetry/`, `jobs/`, `tasks/`, `backups/` | `755` | Diverse |

Dat zijn de bestanden die een fout in deze route bereikbaar maakt. Vandaar dat het ontwerp hieronder geen vrij padargument accepteert — op geen enkel niveau.

En binnen `skills/` zelf, wat het exact-bestandsnaamfilter concreet maakt in plaats van formeel: `~/.claude/skills/transcribeer/` bevat naast `SKILL.md` ook `config.json`, `transcribeer.py`, `SKILL.md.backup-2026-08-18`, `transcribeer.py.backup-2026-08-18` en `__pycache__/`. Die `config.json` heeft de sleutels `kennis_map` en `whisper_host` — een SSH-hostaanduiding. Geen credential, maar wel infrastructuurdisclosure die niet op een dashboardpagina hoort. Een jail die "één segment diep, elk bestand" zou toestaan, serveert die. Een jail die "één segment diep, exact `SKILL.md`" afdwingt, niet. Het verschil is aantoonbaar, niet hypothetisch.

Huidige inhoud van `~/.claude/skills/` (7 mappen, elk met exact één `SKILL.md`): `dartpraat`, `dartsdraaitdoor`, `icor`, `ndb-regels`, `spellman-outshots`, `transcribeer`, `wdf-regels`. Grootste `SKILL.md`: 27 kB (`ndb-regels`). Geen enkele map is een symlink.

---

## 1. Waarom de huidige situatie geen bug is

Bevestigd in de code. `skillsApi.js:142-148`:

```js
let filePath = null;
if (source.repoRelative && containedIn(REPO_ROOT, abs)) {
  filePath = path.relative(REPO_ROOT, abs).split(path.sep).join('/');
}
```

`filePath` blijft `null` voor alles wat niet `repoRelative` is. `SkillsView.tsx:72-75` maakt daar geen link van, en `skillSources.js:65-69` documenteert het motief. De redenering "A link that 403s is worse than no link" (`SkillsView.tsx:15`) was correct voor de toenmalige situatie. Wat we nu doen is niet die redenering weerleggen, maar de voorwaarde eronder veranderen: er kómt een endpoint dat níet 403't, omdat het precies één bestandsvorm kent.

---

## 2. Aanbeveling in één zin

Bouw een **nieuwe, aparte route** `GET /api/cockpit/skill-file?skill=<slug>` in een **nieuw servermodule** `server/skillFileApi.js`, die géén pad accepteert maar een slug, en die het bestandsdeel (`SKILL.md`) als serverconstante hardcodeert.

---

## 3. Het kernidee: het verzoek bevat geen pad

Dit is de belangrijkste ontwerpkeuze en het antwoord op eis 1.

Alle bestaande jails krijgen een **pad** binnen en proberen daarna te bewijzen dat het pad braaf is. Dat is een blacklist-houding: "escapet dit?" Elke check die je vergeet, is een gat.

Deze route krijgt een **slug** binnen — één segment, `[A-Za-z0-9_-]`, geen punt, geen slash. De server bouwt het pad zelf:

```js
const abs = path.resolve(SKILLS_DIR, slug, 'SKILL.md');
```

Er is dus **geen padargument dat ergens anders in `~/.claude/` kan uitkomen**, want de aanroeper levert nooit een pad. Hij levert één naamsegment uit een gesloten alfabet, en het bestandsdeel is een constante die nooit uit het verzoek komt. `..` kan niet, want de punt is niet in het alfabet. Nesten kan niet, want de slash is niet in het alfabet. Een ander bestand in dezelfde map kan niet, want de bestandsnaam is niet instelbaar.

Vergelijk met `TEAM_DIR` (`server.js:1372`): dat is inderdaad een smallere jail dan `PKM_DIR`, maar hij accepteert nog steeds een vrij pad (`?path=Team/Argus - Security Engineer/avatar.png`) en test achteraf of het binnen `Team/` valt. Deze jail is een categorie strakker: de vorm van het toegestane pad is niet *getest* maar *geconstrueerd*.

---

## 4. Nieuwe route of vierde tak in `/api/cockpit/file`? — nieuwe route

Expliciet beargumenteerd, zoals gevraagd (eis 6).

**4.1 De bestaande route dispatcht op padprefix en heeft een gevaarlijke default.** `server.js:439-447`:

```js
if (norm === 'Deliverables' || norm.startsWith('Deliverables/')) { ... }
else if (norm === 'Team Knowledge' || norm.startsWith('Team Knowledge/')) { ... }
else { abs = containedPkmPath(rel); }          // <-- alles wat overblijft
```

De `else` is "behandel als PKM-relatief". Een vierde tak toevoegen betekent dat élke toekomstige bewerking aan die if/else-keten één typefout verwijderd is van "landt in de verkeerde jail". Zolang alle takken bínnen de repo wijzen, is de ergste uitkomst van zo'n fout: een repo-bestand uit de verkeerde repo-jail. Zodra één tak `$HOME` kent, is de ergste uitkomst: een home-directorybestand. **De enige jail die buiten de repo wijst, mag niet in dezelfde dispatcher zitten als de jails die binnen de repo wijzen.** Op een eigen route heeft de repo-dispatcher letterlijk geen codepad naar `$HOME`.

**4.2 De argumentvorm verschilt fundamenteel.** `/api/cockpit/file` heeft als contract "`?path=` is een pad". Deze jail wil juist géén pad (§3). Een `skill:`-prefix in datzelfde `?path=`-argument smokkelt een slug binnen op een plek die padvormig is en padvormig blijft — precies de vermenging die je wilt vermijden.

**4.3 De MIME-allowlist verschilt.** `INLINE_MIME` (`server.js:412-433`) kent 15 types, waaronder `.pdf`, `.svg` en vijf audioformaten. Deze jail heeft er één nodig: markdown. Delen betekent óf die 15 erven, óf een per-tak-uitzondering bouwen — meer code dan een eigen route. `filetree.js:166-178` deed dit al eens en koos bewust voor een eigen, striktere tabel; hier is de tabel zelfs overbodig, want de extensie ligt vast.

**4.4 De codebase heeft deze beslissing al twee keer zo genomen.** `/api/cockpit/inbox-file` (nieuwe root → nieuwe route) en `/api/cockpit/avatar` (nieuwe root → nieuwe route). Consistentie is hier een veiligheidseigenschap: een reviewer die de ene route begrijpt, begrijpt de andere.

**4.5 Auditbaarheid.** "Welke routes lezen buiten de scaffold?" wordt een grep met één regel antwoord. Bij een vierde tak is het antwoord "hangt af van de prefix-string" — en dat is nu net het soort antwoord waar auditlekken in leven.

**Tegenargument, eerlijk benoemd:** één route minder, en één codec minder aan clientzijde. Dat weegt niet op tegen 4.1.

---

## 5. De verplichte checks, in volgorde

Nieuw bestand `server/skillFileApi.js`. Elke stap faalt gesloten. **De volgorde is normatief**: de goedkope, FS-loze checks staan bewust vóór elke aanraking van de schijf, zodat een vijandige invoer nooit een filesystem-call bereikt (hetzelfde principe als `workbench.js`: "slug whitelist BEFORE any FS call").

### C0 — Basis: de route zit onder `/api/` en erft de leespoort

Registreer als `app.get('/api/cockpit/skill-file', handler)`. Daarmee valt hij automatisch onder de auth-middleware van `server.js:201-207` (PIN/sessie, of de loopback-zonder-PIN-uitzondering mét de DNS-rebinding-guard van `server.js:195-198`).

- **Zet hem NIET in `AUTH_PUBLIC`** (`server.js:200`).
- **Laat hem NIET door `safe()` lopen** (`server.js:157-166`). Die helper doet `res.status(500).json({ error: err.message })`. Een `fs`-fout draagt het volledige absolute pad in `err.message` (ENOENT-berichten bevatten het pad). Dat is exact het lek dat eis 5 verbiedt. Alle andere bestandsroutes zijn om dezelfde reden een kale handler met eigen try/catch — volg dat.

### C1 — Argumenttype

```js
const raw = req.query.skill;
if (typeof raw !== 'string' || raw === '') return notFound(res);
```

Niet `String(req.query.skill)`: bij `?skill=a&skill=b` geeft Express een array, en `String([...])` maakt daar stilletjes `"a,b"` van. Expliciet op `string` testen.

### C2 — Slug-whitelist, vóór élke filesystem-call

```js
const SLUG_RE = /^[A-Za-z0-9](?:[A-Za-z0-9_-]{0,62}[A-Za-z0-9])?$/;
if (!SLUG_RE.test(raw)) return notFound(res);
const slug = raw;
```

Wat dit alfabet uitsluit en waarom:
- **geen `.`** → geen `..`, geen `.ssh`, geen dotdir, geen alternatieve extensie;
- **geen `/` of `\`** → geen traversal, geen nesten, geen absoluut pad;
- **geen NUL, geen control chars, geen whitespace, geen `~`, geen `$`** → volgt uit het positieve alfabet;
- **max 64 tekens**, geen leidend/sluitend koppelteken.

Geverifieerd tegen de werkelijke data: alle 7 bestaande skill-mapnamen matchen. Hoofdletters zijn toegestaan omdat de vergelijking in C5 hoofdlettergevoelig is (zie de opmerking over APFS onderaan deze paragraaf); ze mogen dus niet in C2 al sneuvelen.

### C3 — Lidmaatschapstest tegen de echte, niet-symlinkte mapinhoud

Sterker dan een patroon: een **gesloten verzameling**.

```js
let entries;
try { entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true }); }
catch { return notFound(res); }
const hit = entries.find((e) => e.name === slug && e.isDirectory() && !e.isSymbolicLink());
if (!hit) return notFound(res);
```

Dit maakt de servbare verzameling exact gelijk aan de verzameling die `/api/cockpit/skills` al toont — niets meer. Eén `readdirSync` over 7 entries; verwaarloosbaar. `Dirent.isDirectory()` is gebaseerd op `d_type` (lstat-semantiek), dus een symlink is hier al `isDirectory() === false`; de expliciete `isSymbolicLink()` staat er voor de leesbaarheid van de intentie, net als in `skillsApi.js:179`.

**Deze route mag nooit degraderen naar een puur patroonfilter zonder C3.** Zonder C3 is elke map onder `skills/` die ooit ontstaat automatisch servbaar; mét C3 is het altijd "wat er nu echt staat, en alleen als het een echte map is".

### C4 — Padconstructie + exacte vormcontrole (lexicaal)

```js
const abs = path.resolve(SKILLS_DIR, slug, SKILL_FILENAME);   // SKILL_FILENAME = 'SKILL.md', constante
const relLex = path.relative(SKILLS_DIR, abs);
if (relLex !== path.join(slug, SKILL_FILENAME)) return notFound(res);
```

Let op het verschil met de bestaande jails. Die vragen *"escapet dit?"* (`!rel.startsWith('..')`) — een blacklist. Deze vraagt *"is dit exact de enige vorm die we toestaan?"* — een gelijkheidstest, dus een whitelist. Bij een gelijkheidstest hoef je niet te bedenken welke ontsnappingsvormen er bestaan.

### C5 — Realpath-verankerde containment (de symlink-afweer)

Dit is de check die de bestaande vijf jails missen (§0.2), en de reden dat "kopieer `containedTeamPath`" hier het verkeerde advies is.

```js
let jailReal, real;
try {
  jailReal = fs.realpathSync(SKILLS_DIR);   // óók de jail zelf resolven
  real     = fs.realpathSync(abs);
} catch { return notFound(res); }
if (path.relative(jailReal, real) !== path.join(slug, SKILL_FILENAME)) return notFound(res);
```

Twee dingen die hier vaak fout gaan:

1. **De jail-root moet zélf ge-realpath worden.** Als `~/.claude` of `~/.claude/skills` ooit een symlink is (of macOS een `/private`-prefix introduceert), dan mismatcht een lexicale `SKILLS_DIR` met de realpath van het doel en krijg je een **false reject** — een correcte skill die 404't. `workbench.js:111-120` en `journalEntries.js:118-121` documenteren precies deze valkuil. Volg die precedent.
2. **Bereken `jailReal` per verzoek, niet bij boot.** Een bij boot gecachte waarde gaat stuk als de map wordt hernoemd, verwijderd of opnieuw aangemaakt tijdens de looptijd van de server.

C5 vangt óók een symlink in een component die C3 niet individueel heeft gelstat, en de belangrijkste variant: een `SKILL.md` die zélf een symlink is naar `~/.claude/history.jsonl`. Dat bestand is `600`, dus het is met de rechten van de serverprocess-eigenaar leesbaar — precies wat we hier dichtzetten.

*APFS-kanttekening (geen beveiligingsgat, wel gedrag om te kennen):* macOS is standaard hoofdletter-ongevoelig maar hoofdletter-behoudend. `?skill=WDF-Regels` bij een map `wdf-regels` op schijf passeert C2 en C3 zou hem niet vinden (naamvergelijking is exact), en zou hij hem wél vinden dan faalt C5, omdat `realpathSync` de schijfspelling teruggeeft. Uitkomst: 404. Fail-closed, dus correct. De client stuurt altijd de exacte schijfnaam, want `skillsApi.js` haalt de slug uit `readdirSync`.

### C6 — Lees wat je hebt geverifieerd; gebruik `res.sendFile()` NIET

```js
let st, buf;
try {
  st = fs.statSync(real);
  if (!st.isFile()) return notFound(res);
  if (st.size > MAX_SKILL_BYTES) return notFound(res);   // MAX_SKILL_BYTES = 1_000_000
  buf = fs.readFileSync(real);                            // real, niet abs
} catch { return notFound(res); }
```

Vier redenen om `res.sendFile()` hier te vermijden — alle vier geverifieerd in `node_modules/send/index.js`:

1. **`sendFile` resolvet het pad opnieuw**, onafhankelijk van wat jij net hebt gecontroleerd. Je controleert `real` en overhandigt `abs`; controle en lezing zitten dan op verschillende resoluties. `readFileSync(real)` leest exact wat de check heeft goedgekeurd.
2. **`sendFile` volgt symlinks** (`send` doet `stat`, niet `lstat` — geen enkele `lstat`/`realpath` in dat bestand). C5 sluit dat af, maar dan wil je die code er niet ook nog náást hebben.
3. **Er zit een fragiele afhankelijkheid van een deprecated legacy-tak in.** Bij `res.sendFile(abs)` zonder opties is `send._dotfiles === undefined` (`send/index.js:117-134`). Het pad `~/.claude/skills/x/SKILL.md` bevát een dotfile-segment (`.claude`), dus `containsDotFile(parts)` is waar. De legacy-tak (`send/index.js:559-566`) kijkt dan naar het **laatste** segment: dat is `SKILL.md`, geen dotfile, dus `access = 'allow'`. Het wérkt vandaag, maar puur door een legacy-vangnet. Zet `send` ooit over op uniforme `dotfiles: 'ignore'`, dan 404't elke `SKILL.md` onder `~/.claude/` in stilte. Zelf lezen maakt je hier immuun voor.
4. **Minder oppervlak.** Geen Range, geen ETag, geen Last-Modified — allemaal overbodig voor een tekstbestand van 27 kB.

Groottelimiet: 1 MB is ruim (grootste echte bestand is 27 kB) en voorkomt dat een pathologisch groot bestand het geheugen in wordt getrokken.

*Belt-and-braces, optioneel:* wil je ook de laatste TOCTOU-marge dicht tussen C5 en C6 (iemand vervangt het bestand tussen check en lezing door een symlink), gebruik dan `fs.openSync(abs, 'r')` + `fs.fstatSync(fd)` + lezen uit de fd. Voor een single-user loopback-app met een aanvaller die al schrijfrechten in `~/.claude/skills/` zou moeten hebben, vind ik dat overkill — met zulke rechten heeft hij het bestand allang zelf. Ik vermeld het volledigheidshalve; het is geen eis.

### C7 — Inerte headers (eis 4)

```js
res.set('Content-Type', 'text/markdown; charset=utf-8');   // constante, geen MIME-lookup
res.set('Content-Disposition', 'inline');
res.set('Content-Security-Policy', "default-src 'none'; sandbox");
res.set('X-Content-Type-Options', 'nosniff');
res.set('Referrer-Policy', 'no-referrer');
res.set('Cache-Control', 'no-store');                      // al globaal (server.js:103-106), expliciet is beter
res.status(200).send(buf);
```

Bewust **strikter** dan `/api/cockpit/file` (`server.js:457`), dat `img-src 'self'; object-src 'self'; style-src 'unsafe-inline'` toestaat. Die versoepelingen bestaan daar voor PDF- en afbeeldingsembeds. Deze route serveert uitsluitend markdown-tekst, dus kaal `default-src 'none'` volstaat, plus `sandbox`. Striktere headers dan de zusterroute is hier het juiste patroon — `INBOX_INLINE_MIME` (`filetree.js:162-178`) is om dezelfde reden bewust smaller dan `INLINE_MIME`.

Markdown wordt als **tekst** geserveerd, nooit als HTML, precies zoals `server.js:421-424` het al doet. De client rendert door `WikiMarkdown` (de gesaniteerde component), en de `Raw`-link in `FileView` opent hem als platte tekst met bovenstaande CSP.

Er is **geen MIME-tabel nodig**: de extensie komt niet uit het verzoek, dus er valt niets op te zoeken. Eén constante.

### C8 — Uniforme foutrespons, geen structuurlek (eis 5)

```js
function notFound(res) { return res.status(404).json({ error: 'not found' }); }
```

Alle afwijzingen — verkeerd type, slug buiten het alfabet, onbekende slug, map is een symlink, `SKILL.md` ontbreekt, realpath-mismatch, te groot, leesfout — geven **dezelfde 404 met dezelfde body**.

- Nooit het opgeloste pad, de slug, de jail-root of `err.message` in de body.
- Nooit een lijst, nooit een directory-listing, ook niet in een foutmelding.
- Log serverzijdig desgewenst mét slug (dat is Sanders eigen terminal), maar **nooit met het absolute pad**, en zeker niet met `err.message` in de respons.

**Eerlijk over wat dit wél en niet oplost:** het collapsen van 403/404 naar één respons voorkomt normaal dat een aanroeper kan aftasten wélke skills bestaan. Hier levert dat weinig extra op, want `/api/cockpit/skills` vertelt elke geauthenticeerde aanroeper toch al precies welke skills er zijn. Ik beveel het nog steeds aan — het houdt het foutoppervlak uniform en het kost niets — maar ik claim niet dat het een lek dicht dat elders al openstaat. Dat zou een opgeblazen bevinding zijn.

### C9 — Geen enkele schrijfroute (eis 3)

Registreer **uitsluitend** `app.get`. Geen POST, geen PUT, geen DELETE, geen PATCH. Deze route komt niet in `WORKBENCH_ATTACH_STACK`, niet achter `workbenchWriteGate`, niet achter `localWriteGuard` (die is er voor schrijfroutes). De module importeert `fs` alleen voor `readdirSync`, `realpathSync`, `statSync`, `readFileSync` — geen `writeFileSync`, geen `rename`, geen `unlink`.

### C10 — Geen wildcard-listing (eis 5)

De route zonder `?skill=` geeft 404, niet een index. Er komt **geen** `/api/cockpit/skill-files`-listingroute. De enige enumeratie die bestaat is de al aanwezige, begrensde `readDirWithSkillMd()` in `skillsApi.js:170-193`, die alleen `<base>/<map>/SKILL.md` leest, symlinks overslaat en niets anders dan titel/samenvatting teruggeeft. Er wordt met deze klus **geen nieuwe enumeratiemogelijkheid toegevoegd**.

---

## 6. Waar de basis vandaan komt (SSOT)

Bereken `SKILLS_DIR` **niet** opnieuw met een eigen `os.homedir()`-aanroep. `skillSources.js` is per zijn eigen kopcommentaar de bron: *"Each one is ONE entry below; the reader never hard-codes a path."* Twee onafhankelijke berekeningen kunnen uit elkaar lopen, en dan verschilt de jail die je controleert van de jail die de lijst opbouwt.

```js
import { SKILL_SOURCES } from './skillSources.js';
const USER_SKILLS = SKILL_SOURCES.find((s) => s.id === 'user-skills');
const SKILLS_DIR = USER_SKILLS && !USER_SKILLS.repoRelative ? USER_SKILLS.base : null;
// SKILLS_DIR === null  ->  route registreert zich niet / geeft altijd 404.
```

Twee harde randvoorwaarden:

- **Bind op `id === 'user-skills'`, niet op `kind === 'domain-skill'`.** Er kan later een tweede bron met dezelfde `kind` bijkomen die ergens anders staat; die mag deze route niet automatisch erven.
- **Weiger als `repoRelative === true`.** Zou iemand die vlag ooit omzetten, dan wordt `base` repo-relatief geïnterpreteerd en klopt de jail niet meer. Fail closed.

Als `HOME` niet resolvet is `base` al `null` (`skillSources.js:77`) — dan is er geen jail en dus geen route. Ook fail closed.

---

## 7. Clientkant — wat Bezalel moet aanpassen (en de valkuil die hij zal raken)

### 7.1 Server: een apart veld, `filePath` niet overladen

In `skillsApi.js`, functie `shape()` (regel 134-165), een **nieuw** veld toevoegen:

```js
skillSlug: source.id === 'user-skills' ? slug : null,
```

**Hergebruik `filePath` niet.** Dat veld heeft een contract: "repo-relatief pad dat via `/api/cockpit/file` te serveren is" (`skillsApi.js:142-144`). Er een tweede betekenis in proppen is precies de routingverwarring uit §4.1, maar dan in het datamodel. Plugin-skills en repo-commands krijgen `skillSlug: null`.

### 7.2 Plugin-skills blijven bewust onklikbaar

`readPluginSkills()` (`skillsApi.js:261-312`) leest `installPath` uit `~/.claude/plugins/installed_plugins.json` — een JSON-bestand met **willekeurige absolute paden**. Zou de route ook plugin-skills serveren, dan wordt de inhoud van dat JSON-bestand een arbitrary-read-primitief: wie dat bestand kan bewerken, kiest welk pad de cockpit serveert. Buiten scope van de opdracht (die noemt uitsluitend `~/.claude/skills/<naam>/SKILL.md`) én zelfstandig een slecht idee. Plugin-skill-rijen blijven kaarten zonder link. Zet dat als comment in de code, anders "verbetert" iemand het later.

### 7.3 Router-codec

`web/src/lib/router.ts`:

```ts
export type FileSource = 'file' | 'inbox-file' | 'skill-file';

// fileRouteSrc: source === 'skill-file'  ->  `skill:${slug}`
// parseFileSrc:
if (src.startsWith('skill:')) {
  const slug = src.slice('skill:'.length);
  return { path: 'SKILL.md', fileUrl: `/api/cockpit/skill-file?skill=${encodeURIComponent(slug)}` };
}
```

De `src` draagt een **slug**, geen pad — consistent met §3.

### 7.4 Drie concrete valkuilen in `FileView` (geverifieerd in de code)

**(a) `DiscussButton` moet uit voor skill-bestanden — dit is een echte bevinding, geen netheidskwestie.**

`FileView.tsx:49-55`, `repoRelativeFor()`, plakt `PKM/` voor alles wat het niet herkent:

```js
return `PKM/${path}`;
```

Bij een skill-src wordt dat `PKM/SKILL.md` (of `PKM/skill:wdf-regels`, afhankelijk van wat `parseFileSrc` teruggeeft). `containedRepoRelative()` (`server.js:871-879`) accepteert dat: niet absoluut, geen NUL, resolvet netjes binnen `REPO_ROOT`. De discuss-route start dan een Terminal met een prompt die Claude opdraagt een bestand te lezen dat **niet bestaat**.

Geen shell-injectie — de prompt gaat door `shq()` (`server.js:917`) en zit in POSIX single quotes, dat is aantoonbaar veilig. Wel een kapotte, verwarrende hand-off die een terminalvenster opent. Oplossing: `repoRelativeFor()` laten `null` teruggeven voor een skill-src en `FileView` de knop laten overslaan (dezelfde behandeling als de `Visualiseer`-knop bij een niet-procedureel document).

**Geef de discuss-route géén absoluut pad naar `~/.claude/...`.** `containedRepoRelative` weigert absolute paden sowieso (`server.js:873`), en de discuss-route buiten de repo-jail trekken is een aparte, veel grotere beslissing die hier niet voorligt.

**(b) De weergavenaam moet op `.md` eindigen.** `FileView.tsx:59-61` doet `name = path.split('/').pop()` en daarna `previewKindFor(name)` (`FolderTree.tsx:435-441`), dat puur op de extensie kijkt. Een `name` zonder extensie levert `kind === 'none'` op en dan rendert de pagina "No inline view" in plaats van de skill. Laat `parseFileSrc` daarom `path: 'SKILL.md'` teruggeven (zoals in 7.3), of zet de skill-titel + `.md` neer. Cosmetisch qua oorzaak, functioneel fataal qua gevolg.

**(c) `Visualiseer` regelt zichzelf.** `hasDiagramConverter(path)` herkent alleen SOP-/Workstream-documenten; een skill-pad valt daarbuiten, dus de knop verschijnt niet. Geen actie nodig — wel even verifiëren na de bouw.

### 7.5 `SkillsView.fileHrefFor()`

```ts
function fileHrefFor(item: SkillItem): string | null {
  if (item.filePath) return hrefFor({ name: 'file', src: fileRouteSrc('file', item.filePath) });
  if (item.skillSlug) return hrefFor({ name: 'file', src: fileRouteSrc('skill-file', item.skillSlug) });
  return null;                      // plugin-skills: nog steeds geen link
}
```

De regel uit `SkillsView.tsx:12-15` ("alleen een link als er echt iets te openen valt") blijft staan — hij geldt nu voor één groep minder. Werk dat kopcommentaar bij, anders documenteert het straks gedrag dat er niet meer is.

---

## 8. Env-gate en documentatie

Deze route is de **eerste in de hele cockpit die buiten `REPO_ROOT` leest**. De codebase heeft een vast patroon voor capaciteiten die het oppervlak verbreden: een env-vlag, gedeclareerd in `expansion.yaml` én `.env.example` (`CONNECTORS_ENABLED`, `WORKBENCH_WRITE_ENABLED`, `PLAN_WRITE_ENABLED`). Volg dat.

- **Naam:** `COCKPIT_SKILL_FILES_ENABLED`.
- **Default:** launcher zet `1` (net als `WORKBENCH_WRITE_ENABLED`, dat een véél krachtigere schrijfcapaciteit standaard aanzet). `0` registreert de route helemaal niet — geen 403-tak, geen route.
- **Declareren in:** `expansion.yaml` onder `env_vars` (`required: false, sensitive: false`) en in `.env.example` mét de uitleg dat dit de enige route is die buiten de scaffold leest.
- **`SECURITY.md`:** dat bestand heeft een kop "Write surfaces are narrow and local" maar zegt **niets** over leesbereik. Er wordt dus geen bestaande claim ongeldig — ik heb het nagelezen, er staat geen containment-belofte in. Wél hoort er nu een korte kop "Read surfaces" bij die benoemt dat alle lezen binnen de scaffold blijft, met één uitzondering: exact `~/.claude/skills/<naam>/SKILL.md`, read-only, uitschakelbaar. Zonder die regel is `SECURITY.md` niet onwaar, maar wel onvolledig — en bij een gedistribueerde Expansion is dat een distributiedefect.

---

## 9. Restrisico's die Sander expliciet moet accepteren

Twee. Beide zijn ontwerpgevolg, geen implementatiefout, en beide zijn de reden dat dit verdict GEEL is en niet GROEN.

### R-1 — Het leesbereik van de cockpit reikt vanaf nu buiten de myPKA-scaffold

Tot nu toe gold: alles wat de cockpit kan lezen, staat in de repo. Na deze wijziging geldt: alles wat de cockpit kan lezen staat in de repo, **plus exact één bestandsnaam per bestaande map in `~/.claude/skills/`**. Vandaag zijn dat 7 bestanden, samen 85 kB, allemaal door Sander zelf geschreven skill-documentatie.

De inhoud is niet gevoelig. Wat verandert is de **klasse**: de cockpit heeft nu een codepad naar `$HOME`. Elke toekomstige wijziging aan die route wordt daarmee een wijziging met home-directory-blast-radius, en moet als zodanig gereviewd worden.

**Wat Sander accepteert:** dat de cockpit-codebase vanaf nu een (zeer smal) venster op zijn home-directory heeft, en dat wijzigingen aan `server/skillFileApi.js` voortaan security-review vereisen in plaats van gewoon frontend-onderhoud.

### R-2 — In LAN-modus is dit venster bereikbaar vanaf het netwerk

Bij `COCKPIT_BIND_LAN=1` is de cockpit bereikbaar vanaf elk apparaat op het thuisnetwerk, achter de PIN. Deze route erft die poort (dat is goed), maar het gevolg is dat een PIN-geauthenticeerde LAN-client nu een bestand uit de home-directory kan opvragen in plaats van alleen uit de repo.

Verzachtende omstandigheden, eerlijk gewogen:
- Het is dezelfde PIN-poort die al journal, CRM en documenten beschermt — inhoudelijk gevoeliger materiaal dan een skill-beschrijving.
- LAN-modus start niet zonder geconfigureerde PIN (`server.js:91-99`), met scrypt-hash, brute-forcethrottle (5 pogingen → 15 min lockout) en 200-500 ms vertraging per poging (`auth.js:211-255`).
- De sessiecookie is `HttpOnly; SameSite=Strict`, dus een cross-site-verzoek draagt geen auth.
- Zonder TLS is het verkeer plaintext op de WLAN — dat is een reeds geaccepteerde afweging, gedocumenteerd in `auth.js:11-16`, niet iets dat deze klus introduceert.

**Wat Sander accepteert:** dat in LAN-modus het bereik van een gecompromitteerde PIN met deze 7 bestanden groeit. Wil hij dat niet: `COCKPIT_SKILL_FILES_ENABLED=0` (§8), of geen LAN-modus.

### Wat géén restrisico is (om te voorkomen dat we het dubbel afdekken)

- **Rate limiting.** Geen enkele `/api/cockpit/*`-route heeft er een; alleen de loginroute heeft een throttle. Voor déze route voegt het niets toe: het invoerdomein is gesloten (vandaag 7 waarden), de route is read-only, de bestanden zijn max 27 kB, en hij zit achter dezelfde poort als de rest. Een limiter hier zou inconsistent zijn en geen aanval afweren. Ik eis hem niet.
- **CORS.** De server stuurt geen enkele permissieve CORS-header. Een cross-origin `fetch` in `cors`-modus faalt zonder `Access-Control-Allow-Origin`; in `no-cors`-modus is de respons niet leesbaar. De DNS-rebinding-variant tegen de loopback-zonder-PIN-uitzondering is al afgedekt door `isLoopbackHost()` (`server.js:195-198`). Geen actie nodig.
- **Shell-injectie via de discuss-route.** Geverifieerd veilig: `shq()` (`server.js:917`) wikkelt de hele prompt in POSIX single quotes met correcte escape, en het modelargument is een gesloten enum (`server.js:869`). De bevinding in §7.4(a) is een correctheidsbug, geen injectie. Ik overdrijf hem niet.

---

## 10. Bevindingen, op ernst gerangschikt

| Id | Ernst | Bevinding | Locatie | Actie |
|---|---|---|---|---|
| B-1 | **HIGH (preventief)** | Zonder C2+C3+C5 wordt deze route een leesprimitief op `~/.claude/` — waar `history.jsonl` (600), `sessions/` (700), `session-env/` (337 mappen) en `settings.json` staan | nieuw: `server/skillFileApi.js` | Alle checks C0-C10 uit §5 zijn verplicht, in die volgorde. Niet-onderhandelbaar. |
| B-2 | **MEDIUM** | `safe()` (`server.js:157-166`) retourneert `err.message`; `fs`-fouten dragen absolute paden. Rijdt deze route op `safe()`, dan lekt hij de mapstructuur in een foutrespons — precies wat eis 5 verbiedt | `server.js:157-166` | Kale handler met eigen try/catch en uniforme 404 (C0, C8). |
| B-3 | **MEDIUM (bestaand, buiten scope)** | Alle vijf bestaande jails zijn lexicaal; een symlink bínnen `PKM/`, `Deliverables/`, `Team Knowledge/`, `Team/` of `Team Inbox/` die naar buiten wijst, wordt geserveerd. Bewezen in §0.2 | `server.js:331,344,359,1372`; `filetree.js:154` | **Aparte taak.** Voeg `realpathSync`-verankering toe aan de vijf `contained*Path()`-functies. Blokkeert deze klus niet. |
| B-4 | **MEDIUM** | `repoRelativeFor()` prefixt `PKM/` op elk onbekend src-formaat; `containedRepoRelative()` accepteert dat; de discuss-route opent dan een Terminal voor een niet-bestaand bestand | `FileView.tsx:49-55` + `server.js:871-879` | `DiscussButton` onderdrukken voor skill-src (§7.4a). |
| B-5 | **LOW** | `res.sendFile()` werkt op `~/.claude/...`-paden alleen dankzij een deprecated legacy-dotfile-tak in `send`; een upstream-wijziging laat elke `SKILL.md` stil 404'en | `node_modules/send/index.js:117-134, 559-572` | Niet `sendFile` gebruiken; zelf lezen (C6). |
| B-6 | **LOW** | `previewKindFor()` kijkt puur naar de extensie; een `name` zonder `.md` rendert "No inline view" | `FolderTree.tsx:435-441` | `parseFileSrc` laat `path: 'SKILL.md'` teruggeven (§7.4b). |
| B-7 | **LOW (documentatie)** | `SECURITY.md` beschrijft schrijfoppervlakken maar zwijgt over leesbereik; na deze wijziging is dat zwijgen onvolledig bij een gedistribueerde Expansion | `SECURITY.md:68-75` | Kop "Read surfaces" toevoegen (§8). |
| B-8 | **INFO** | `~/.claude/skills/transcribeer/` bevat `config.json` (`kennis_map`, `whisper_host` — SSH-hostaanduiding), `.py`-bestanden en twee `.backup-*`-bestanden naast `SKILL.md` | `~/.claude/skills/transcribeer/` | Geen actie; dit is exact waarom C4 de bestandsnaam hardcodeert. Bewijs dat het exact-bestandsnaamfilter concreet is, niet formeel. |

Geen enkele bevinding betreft een gecommitteerd secret. `Team Knowledge/.env` is gitignored en bevat alleen de scrypt-hash van de PIN, nooit de cleartext (`auth.js:18-24`). Geen gepoolde of gedeelde API-sleutel geraakt door deze wijziging.

---

## 11. Wie bouwt dit — en waarom niet ik

**Bezalel bouwt.** Argus auditeert en ontwerpt; hij bouwt geen frontendfeatures en past geen security-fixes toe zonder expliciete goedkeuring van Sander (Argus-contract, kritieke regels 2 en "What Argus never does"). Dit is een frontend + serverroute-implementatie met een securityspec eromheen — precies de rolverdeling waar die regel voor bestaat.

Bovendien: de klus raakt `FileView`, de router-codec en `SkillsView`, en dat zijn onderdelen waar Bezalel de conventies van kent. Ik lever de spec; hij bouwt; ik verifieer daarna tegen de testmatrix uit §12.

**Deze spec is compleet genoeg om zonder terugkoppeling te bouwen.** Loopt Bezalel tegen iets aan dat afwijkt van C0-C10, dan is dat een terugkoppelmoment naar mij, geen implementatiebeslissing ter plekke.

---

## 12. Verificatie na de bouw (Argus' hergate)

Nieuw testbestand `server/skillFileApi.test.mjs`, in de stijl van `skillsApi.test.mjs` (`node:test` + `node:assert/strict`). Elk van deze moet **404** geven, met identieke body:

| # | Invoer | Waarom |
|---|---|---|
| 1 | `?skill=../../settings.json` | traversal (C2) |
| 2 | `?skill=..%2F..%2Fsettings.json` | traversal na URL-decode (C2) |
| 3 | `?skill=.` / `?skill=..` | punt niet in alfabet (C2) |
| 4 | `?skill=` (leeg) / parameter afwezig | C1 |
| 5 | `?skill=a&skill=b` (array) | C1 — geen stille `"a,b"` |
| 6 | `?skill=wdf-regels%00` | NUL (C2) |
| 7 | `?skill=/etc/passwd` en `?skill=~` | absoluut / tilde (C2) |
| 8 | `?skill=nonexistent-skill` | lidmaatschap (C3) |
| 9 | symlink-map `evil -> ~/.claude` in `skills/`, dan `?skill=evil` | C3 + C5 |
| 10 | echte map `evil2/` met `SKILL.md -> ~/.claude/settings.json` | C5 — de belangrijkste test |
| 11 | `?skill=transcribeer` moet `SKILL.md` geven, **nooit** `config.json` | C4 |
| 12 | `?skill=WDF-REGELS` bij map `wdf-regels` op APFS | fail-closed, geen case-bypass |
| 13 | `/api/cockpit/skill-file` zonder parameter | geen listing (C10) |
| 14 | POST/PUT/DELETE op de route | geen schrijfroute (C9) |

Plus positief:

| # | Verwachting |
|---|---|
| 15 | Alle 7 huidige skills geven 200 met de juiste bytes |
| 16 | Responsheaders bevatten exact de zes uit C7 |
| 17 | Geen enkele 404-body bevat een absoluut pad, de slug, of `err.message` |
| 18 | `COCKPIT_SKILL_FILES_ENABLED=0` → route bestaat niet (404 van de generieke `/api`-handler op `server.js:1416`) |
| 19 | Plugin-skill-rijen hebben `skillSlug: null` en blijven zonder link |
| 20 | Bestaand: alle tests in `skillsApi.test.mjs` blijven groen |

Test 10 is de test die er echt toe doet. Slaagt die niet, dan is de jail waardeloos — dan is dit gewoon een leesroute op `~/.claude/` met extra stappen.

---

## 13. Samenvatting van het verdict

**GEEL.** Bouwen mag. Voorwaarden:

1. Alle checks **C0 t/m C10** uit §5 zitten erin, in die volgorde. C3 (lidmaatschap) en C5 (realpath) zijn de twee die je niet mag weglaten omdat "C2 het toch al afvangt" — dat is precies het defense-in-depth-argument, en C2 alleen laat een symlinkte map ongemoeid.
2. Een **aparte route** in een **apart module**, niet een vierde tak in `/api/cockpit/file` (§4).
3. **`res.sendFile()` wordt niet gebruikt** (§5 C6).
4. `DiscussButton` uit voor skill-bestanden (§7.4a, bevinding B-4).
5. De testmatrix uit §12 draait groen, met test 10 als scherprechter.
6. Sander accepteert expliciet **R-1** en **R-2** (§9).

Zonder punt 6 is er geen groen licht — niet omdat het risico groot is, maar omdat het een categoriewijziging is (de cockpit leest voor het eerst buiten de scaffold) en die hoort een bewuste beslissing van Sander te zijn, niet een bijvangst van een UI-verbetering.

---

*Bewijsmateriaal en reproductiescript voor §0.2: `<scratchpad>/jailproof/proof.mjs`. Geen secrets in dit document; waar config-inhoud ter sprake komt zijn uitsluitend sleutelnamen genoemd, nooit waarden.*

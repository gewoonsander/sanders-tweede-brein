---
id: 2026-06-30-video-systeem-design
title: Video Systeem — Design Doc
status: concept
owner: hermes
datum: 2026-06-30
---

# Video Systeem — Design Doc

## Doel

Een gesloten video-workflow waarmee Sander ideeën vangt, scripts schrijft, produceert en publiceert naar drie kanalen — zonder dingen kwijt te raken en zonder overbodige tools.

## Kanalen

| Kanaal | Inhoud | Toegang |
|---|---|---|
| Facebook persoonlijk | Casual darts-posts, persoonlijk | Openbaar / vrienden |
| ADC-groep | Coaching-uitleg, rankings | Besloten groep |
| Cursusomgeving | Lesmateriaal, diepgaande uitleg | Betaald / besloten (Huddle o.i.d.) |

---

## Toolstack

| Laag | Tool | Rol | Kosten |
|---|---|---|---|
| AI | Claude (Pro) | Scripts, ideeën, voiceover-tekst | Inbegrepen |
| AI Design | Claude Design | Thumbnails, slides, one-pagers | Inbegrepen in Pro |
| Opname | OBS | Scherm, webcam, microfoon | Gratis |
| Montage | DaVinci Resolve | Knippen, kleur, audio, export | Gratis |
| Design | Canva + Affinity | Fijnafstemming, export, vectorwerk | Bestaand |
| PKM | Tweede brein | Ideeën, scripts, archief, planning | Bestaand |
| Animatie | Remotion | Herhalende geautomatiseerde video's | Later — nog niet |

**Opgezegd (niet meer in gebruik):** Camtasia (€63,74/j) + Snagit (€15,59/j) — per 13 september 2026 gestopt.

---

## Opslagarchitectuur

### Drie schijven, drie rollen

| Schijf | Grootte | Rol |
|---|---|---|
| Mac mini intern | 460GB (315GB vrij) | OS, PKM, actief werk |
| Lexar SSD | 2TB (1,8TB vrij) | Mediahub — actieve videoprojecten |
| Toshiba ("Sander ") | 1,8TB (322GB gebruikt) | Videoarchief — afgeronde projecten |
| Google Workspace Shared Drive | Cloud | Backup van exports + overal bereikbaar |

### Gewenste mapstructuur Lexar SSD

```
/Volumes/Lexar SSD/Sander Mediahub/
├── 01_Dartscoaching/
│   ├── 01_Actieve_Projecten/
│   │   └── YYYY-MM-DD-[video-naam]/
│   │       ├── 01_Raw/        ← OBS opnames
│   │       ├── 02_Proxy/      ← DaVinci genereert automatisch
│   │       ├── 03_Audio/      ← muziek, effecten
│   │       ├── 04_Assets/     ← Claude Design exports, Canva exports
│   │       ├── 05_Project/    ← DaVinci projectbestand (.drp)
│   │       └── 06_Export/     ← eindproduct
│   ├── 02_Content/            ← scripts, ideeën (verwijzing naar PKM)
│   ├── 05_Templates/          ← DaVinci templates, Canva templates
│   ├── 07_Beeldbank/          ← stockbeelden, logo's, vaste assets
│   └── 99_Klaar_Voor_Archief/ ← staging voor Toshiba
├── 02_Dartbuddies/            [zelfde structuur]
├── 03_ADC_Regio_Oost/         [zelfde structuur]
├── 04_Van_Gewoon_Sander/      [zelfde structuur — nu incompleet]
├── 05_Gezinshuis_Gewoon_Thuis/[zelfde structuur — nu incompleet]
├── 06_Persoonlijk/            [zelfde structuur]
├── 90_Gedeelde_Assets/
│   ├── Muziek/
│   ├── Geluidseffecten/
│   ├── Intro_Outro/
│   └── Stockbeelden/
└── 99_Inbox_Nog_Uitzoeken/
```

### Gewenste structuur Toshiba (opruimen)

De Toshiba staat nu vol met ongestructureerde bestanden. Twee categorieën:

1. **Persoonlijke familievideo's** (19 jaar getrouwd, Merel, Daan, kerst, Indonesia...) → verplaatsen naar Apple Photos via foto-doc-verwerker script
2. **Professioneel video-archief** → herstructureren naar:

```
/Volumes/Sander /Archief/
├── Dartscoaching/
│   └── YYYY/
├── ADC/
│   └── YYYY/
├── Persoonlijk/
│   └── YYYY/
└── Overig/
```

### Google Workspace Shared Drive (nog aan te maken)

- Naam: `Sander Mediahub - Exports`
- Inhoud: alleen geëxporteerde eindproducten (niet raw footage)
- Zelfde mapstructuur als Lexar (per kanaal, per jaar)
- Doel: cloud-backup + overal bereikbaar

---

## Werkstroom — Van idee naar gepubliceerde video

### Stap 1 — Idee vangen
- Via SuperWhisper inspreken → Team Inbox
- Penn pakt het op → maakt video-notitie in PKM
- Notitie bevat: titel (voorlopig), kanaal, korte beschrijving, status: *idee*

### Stap 2 — Script schrijven
- Open de video-notitie in PKM
- Claude helpt structureren en schrijven
- Script staat in de notitie zelf (SSOT)

### Stap 3 — Design assets
- **Thumbnail:** Claude Design → beschrijf de video → thumbnail gegenereerd → export naar Canva voor fijnafstemming
- **Slides (indien nodig):** Claude Design op basis van script
- **Graphics/logo-elementen:** Affinity of Canva

### Stap 4 — Opname
- OBS instellen (scene al klaar voor jouw setup)
- Ruwe opname → `01_Raw/` map van het project op Lexar

### Stap 5 — Montage
- DaVinci Resolve opent project vanuit `05_Project/`
- Werkt met proxy-bestanden vanuit `02_Proxy/`
- Audio uit `03_Audio/`, assets uit `04_Assets/`
- Export → `06_Export/`

### Stap 6 — Publicatie
- Upload naar het juiste kanaal (Facebook / ADC-groep / cursusomgeving)
- Status in PKM-notitie bijwerken naar *gepubliceerd*
- Link naar publicatie toevoegen aan notitie

### Stap 7 — Archivering
- Project map verplaatsen van `01_Actieve_Projecten/` naar `99_Klaar_Voor_Archief/`
- Periodiek (maandelijks): `99_Klaar_Voor_Archief/` verplaatsen naar Toshiba
- Export uploaden naar Google Workspace Shared Drive
- Raw footage op Lexar verwijderen na archivering (ruimte vrijmaken)

---

## PKM-koppeling

Elke video krijgt een notitie in `PKM/My Life/Projects/` met frontmatter:

```yaml
---
title: [video titel]
kanaal: [dartscoaching | dartbuddies | adc | gewoon-sander | persoonlijk]
status: [idee | script-klaar | opname-klaar | in-montage | gepubliceerd | gearchiveerd]
publicatiedatum: YYYY-MM-DD
publicatie-url: [link]
lexar-pad: /Volumes/Lexar SSD/Sander Mediahub/[kanaal]/01_Actieve_Projecten/[mapnaam]
---
```

---

## Open actiepunten (uitvoering volgende sessies)

| Actie | Prioriteit | Wie |
|---|---|---|
| Google Workspace Shared Drive aanmaken | Hoog | Sander + Daedalus |
| Lexar mapstructuur consistenter maken (04, 05, 06 aanvullen) | Hoog | Hermes |
| Toshiba familievideo's → Apple Photos (via foto-script) | Hoog | Script loopt al |
| Toshiba professioneel archief herstructureren | Middel | Hermes + Sander |
| OBS scènes instellen voor vaste setup | Middel | Sander |
| DaVinci Resolve projecttemplate aanmaken | Middel | Sander |
| PKM video-notitie template aanmaken | Middel | Hermes |
| Remotion onderzoeken voor herhalende formats | Laag | Later |

---

## Buiten scope (bewuste keuze)

- **Remotion** — pas relevant als er een herhalend video-format is
- **Automatische publicatie** — eerst handmatig workflow leren kennen
- **Toshiba backup** — Toshiba is zelf het archief; Google Workspace is de cloud-laag

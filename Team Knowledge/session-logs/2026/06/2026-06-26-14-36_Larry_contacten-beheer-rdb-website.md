---
agent_id: larry
session_id: contacten-beheer-rdb-website
timestamp: 2026-06-26T17:14:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Contacten Beheer workflow + RDB website analyse

## Context

Vervolgsessie op de Google Contacts koppeling die eerder werd gestart. Credential was al aangemaakt. Vandaag: workflow bouwen, testen en samenvoegen. Daarna: RDB website en kostenanalyse.

## What we did

### n8n Contacten Beheer workflow

- Drie losse workflows gebouwd (zoeken, update, aanmaken) en daarna samengevoegd tot één workflow op één canvas: **Contacten Beheer** (workflow ID: `7HZtyKXevjzPbfg3`)
- Drie webhook-takken op één canvas:
  - 🔍 `/webhook/zoek-contact` — POST `{ query }` → geeft naam, adres, telefoon, email terug
  - ✏️ `/webhook/update-contact` — POST `{ query, streetAddress, city, phone, givenName, familyName }` → zoekt contact op, overschrijft meegegeven velden
  - ➕ `/webhook/nieuw-contact` — POST `{ givenName, familyName, phone, email, streetAddress, city, postalCode, notes }` → maakt nieuw contact aan
- Credential: Google Contacts account (ID: `vhaofXaCT8yYSnZj`, sander@gewoonsander.nl)
- Workflow gepubliceerd — live via productie webhooks zonder aparte "Active" toggle
- Memory bijgewerkt: alle drie webhook URLs opgeslagen in `reference_n8n-contacten-beheer.md`

### Tests uitgevoerd

- **Joost Gerritsen** — gevonden: Sleutelbloemstraat 29 Arnhem, +31657547680
- **Michel te Dorsthorst** — gevonden: Sterappelgaard 161 Arnhem, +31643093663
- **Piet Pannenkoek** — aangemaakt als testcontact, daarna adres bijgewerkt naar Stroop Wafelstraat 12, Bakkerdam ✓
- Alle drie operaties (zoeken, aanmaken, bijwerken) werken correct

### RDB website — Emiel Theloosen

- Plugin-inventarisatie gedaan van de RDB WordPress-installatie (24 plugins)
- WPMU Dev plugins (inbegrepen in Silver abonnement, Emiel mag gebruiken): Branda Pro, Broken Link Checker, Defender Pro, Forminator Pro, Hummingbird Pro, SmartCrawl Pro, Smush Pro
- Extern gelicenseerd (NIET zomaar meegeven): ACF Pro, BuddyBoss Platform + Pro, Divi Builder + Dynamic Helper + Machine, Smart Slider 3 Pro, The Events Calendar Pro + Filter Bar, WP All Export/Import Pro suite
- Voorstel voor Emiel: staging-omgeving aanmaken zodat hij offline kan bouwen en dan live kan pushen voor ALV 4 juli

### Kostenanalyse WPMU Dev / RDB

- **WPMU Dev Premium:** $990/jaar met 50% agency korting = $495/jaar ≈ €450/jaar (factuur 717D12B3-0064, 24 maart 2026)
- **Hosting Silver:** $30/maand ≈ €327/jaar (per site)
- **Totale directe kosten als RDB enige klant:** ~€777/jaar = €64,75/maand
- **Huidig tarief RDB:** €35/maand = €420/jaar → verlies als WPMU Dev volledig toerekent
- Nuance: Sander host meerdere sites op zijn WPMU Dev account, dus kosten worden gedeeld — exacte allocatie nog onbekend

### Facturen verwerkt (ter bevestiging, nog niet weggeschreven)

- **Factuur 2215** (oud systeem): 10 maanden hosting maart–dec 2025, €35/maand, totaal €423,50 incl. BTW — betaald
- **Factuur 202603-001** (nieuw systeem): 12 maanden hosting jan–dec 2026, €35/maand, totaal €508,20 incl. BTW, vervaldatum 12-04-2026 — betaald
- Facturering: jaarlijks vooraf, klant is Rivierenland Darts Bond, penningmeester, Zilveresdoorn 3, 5432 KH Cuijk

## Decisions made

- Contacten Beheer: drie losse workflows → samenvoegen tot één canvas (overzichtelijker)
- Webhook-namen met emoji zodat het canvas direct leesbaar is
- Staging-omgeving voor Emiel als beste oplossing (hij bouwt offline, pusht live voor ALV)
- Uurtarief voor support Emiel: **€25/uur op basis van uurtje-factuurtje**
- Tarief RDB hosting: kostendekkend willen werken — exacte herberekening na overzicht alle sites

## Open threads

- [ ] **RDB website project aanmaken** — `PKM/My Life/Projects/rdb-website.md` met factuurhistorie en kostenplaatje
- [ ] **Staging-omgeving aanmaken** in WPMU Dev voor Emiel
- [ ] **WhatsApp/bericht Emiel** — uitleggen wat servicekosten inhouden, staging aanbieden, tarief €25/uur support
- [ ] **Overzicht alle WPMU Dev sites** ophalen → WPMU Dev kosten eerlijk verdelen over klanten → tarief herbeoordelen
- [ ] **Piet Pannenkoek testcontact** verwijderen uit Google Contacts
- [ ] **Factuur VMB Advies €211,75** betalen (vervaldatum vandaag 26 juni!)
- [ ] **Annuleerknop website** (herroepingswet) — was deadline 25 jun, nog niet gedaan
- [ ] **e-Boekhouden** exporteren en opzeggen (overdue sinds 22 jun)
- [ ] **Inboxen doornemen** (stond op agenda 8:30 vandaag, niet gedaan)
- [ ] **Grasmaaien + moestuin** — Thomas, overdue
- [ ] **GFT buiten zetten** — overdue

## Cross-links

- [[emiel-theloosen]] — RDB website, staging, servicekosten
- [[reference_n8n-contacten-beheer]] — webhook URLs Contacten Beheer workflow
- [[2026-06-26-08-45_Larry_google-contacts-n8n]] — vorige sessie (credential aanmaken)

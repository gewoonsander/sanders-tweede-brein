---
agent_id: larry
session_id: praktijkvoluitleven-migratie-dns-ssl
timestamp: 2026-06-27T09:21:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Praktijkvoluitleven.nl migratie — DNS, SSL en afronding

## Context

Vervolgsessie op de migratie van praktijkvoluitleven.nl (Heleen van den Berg) die gisteren begon. Gisteren waren afbeeldingen nog niet overgezet. Vandaag alles afgerond.

## What we did

### Afbeeldingen overzetten
- FTP-verbinding via Transmit geprobeerd (SFTP en FTP) — Versio blokkeerde dit
- Oplossing: DirectAdmin File Manager gebruikt om uploads-map te zippen en te downloaden
- Zip gedownload, afbeeldingen geüpload via WPMU Dev Bestandsbeheer naar `/wp-content/uploads/sites/7/`

### URL's repareren via Better Search Replace
- Better Search Replace was al netwerk-actief op de multisite
- Zoek: `https://praktijkvoluitleven.nl` → Vervang: `https://gewoonsander.nl/praktijkvoluitleven`
- 5 cellen vervangen in 18 tabellen (wp_vy_7_*)

### DNS ingesteld bij Versio
- Versio klantpaneel: `praktijkvoluitleven.nl` gevonden onder eigen account (niet reseller)
- DNS beheer ingeschakeld
- A-record `praktijkvoluitleven.nl` en `www.praktijkvoluitleven.nl` gewijzigd: `185.182.56.12` → `95.179.155.1`
- Gecontroleerd via dnschecker.org — binnen uur gepropageerd

### WordPress multisite URL ingesteld
- Netwerkbeheer → Site 7 → Site adres gewijzigd naar `https://praktijkvoluitleven.nl`

### SSL-certificaat
- WPMU Dev Hub → Hosting → Domeinen → praktijkvoluitleven.nl toegevoegd
- SSL direct actief (twee groene vinkjes)

### Site live
- `praktijkvoluitleven.nl` werkt ✅

### Overige besproken zaken
- Domeinprijzen vergeleken: Versio €25,99/jaar, TransIP €16,50/jaar, GoDaddy €7,99/jaar voor .nl
- Oranjebar rekening verdeeld (€132): Joost €15, Sander €40, Marc €22, Jos €55
- WhatsApp-bericht opgesteld voor Emiel (staging site uitleg, plugins)

## Decisions made

- DNS bij Versio laten (nameservers niet naar WPMU Dev verplaatst) — kan later bij domeinverhuizing
- Versio is enige betaalde dienst voor dit domein — opzeggen zodra Heleen is geïnformeerd

## Open threads

- [ ] **Heleen informeren** — nieuwe WordPress inloggegevens sturen, uitleggen dat site is verhuisd naar nieuwe hosting
- [ ] **Mail controleren** — welk e-mailadres gebruikt Heleen? MX records staan nog op Versio → mail werkt nog via Versio
- [ ] **Factuur Heleen** — vriendelijk bericht + achterstallige factuur 2025 sturen
- [ ] **Versio hosting opzeggen** — account `voluitleven` (praktijkvoluitleven.nl was enige site)
- [ ] **Versio reseller account** — opzeggen, Sander betaalt maandelijks voor dit reseller account
- [ ] **Domein praktijkvoluitleven.nl** — eventueel verhuizen naar GoDaddy (€7,99/jaar)
- [ ] **Emiel WhatsApp** — bericht opstellen over staging, premium plugins, €25/uur support
- [ ] **Piet Pannenkoek** testcontact verwijderen uit Google Contacts
- [ ] **Factuur VMB Advies €211,75** — betalen (was al overdue 26 juni)
- [ ] **Annuleerknop website** (herroepingswet)
- [ ] **e-Boekhouden** exporteren en opzeggen

## Cross-links

- [[project_praktijkvoluitleven-migratie]] — memory met volledige status
- [[2026-06-26-14-36_Larry_contacten-beheer-rdb-website]] — vorige sessie

---
id: GL-004
title: Contactenbeheer — Single Source of Truth
created: 2026-06-19
---

# GL-004 — Contactenbeheer

## SSOT: Google Contacts

Google Contacts is de enige bron van waarheid voor alle contacten. Alle andere systemen putten hieruit.

## Architectuur

| Laag | Systeem | Inhoud |
|------|---------|--------|
| Basisgegevens | Google Contacts | Naam, telefoon, e-mail, adres |
| Rijke context | PKM/CRM/People/ + PKM/CRM/Organizations/ | Relatie, notities, projectlinks, achtergrond |

PKM-bestanden verwijzen via `[[wikilinks]]` naar elkaar. Google Contact ID kan optioneel als frontmatter-veld worden opgenomen.

## Apparaten

| Apparaat | Status |
|----------|--------|
| iPhone | Standaardaccount = Gmail ✅, iCloud Contacts uit ✅ |
| Mac mini | iCloud Contacts uit ✅, Google via Internet-accounts ✅ |
| MacBook Pro | iCloud Contacts uit ✅ |
| MacBook Air | iCloud Contacts uit ✅, Google via Internet-accounts ✅ |

## Regels

- Nieuwe contacten altijd opslaan in Google Contacts (iPhone doet dit automatisch via standaardaccount)
- iCloud Contacts blijft uitgeschakeld op alle apparaten
- WhatsApp-contacten zijn geen aparte bron — zij lezen automatisch van iPhone Contacten, die van Google synct
- Als Larry in een sessie een nieuwe persoon tegenkomt: Penn maakt een stub aan in `PKM/CRM/People/` én Larry overweegt het contact toe te voegen aan Google Contacts via de MCP

## Ingesteld op

19 juni 2026 — na consolidatie van iCloud (276) + Google (945) → Google (934 na deduplicatie)

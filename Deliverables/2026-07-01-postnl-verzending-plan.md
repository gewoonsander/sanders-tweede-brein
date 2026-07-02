# Plan: PostNL Verzending Automatisering – Fase 1

**Datum:** 2026-07-01
**Status:** Goedgekeurd — klaar voor uitvoering
**Auteur:** Mack (Automation Specialist)
**Gebaseerd op:** `2026-07-01-postnl-verzending-design.md`

---

## Doel

Plug&Pay `order_paid` webhook → n8n → PostNL CSV → e-mail naar `sander@gewoonsander.nl`

Sander importeert het CSV handmatig in Mijn PostNL Business en print het label.

## Constraints

- Gmail credential `sander@gewoonsander.nl` mag niet breken
- Geen write-operaties naar Plug&Pay of PostNL — read-only + CSV
- CSV-bestand moet UTF-8 zijn, puntkomma-gescheiden (PostNL-norm)
- Workflow begint inactief — Sander activeert handmatig na setup

---

## Bestandskaart

| Bestand | Actie | Reden |
|---|---|---|
| `Deliverables/2026-07-01-postnl-verzending-plan.md` | Aangemaakt | Dit bestand |
| `Deliverables/2026-07-01-postnl-n8n-workflow.json` | Aangemaakt | n8n importbestand |

---

## Stappen

### Stap 1 — n8n workflow importeren (2 min)
**Pad:** n8n.cloud → Workflows → Import from file
**Actie:** Importeer `Deliverables/2026-07-01-postnl-n8n-workflow.json`
**Verificatie:** Workflow verschijnt in de lijst als "PostNL Verzending – Plug&Pay"

---

### Stap 2 — Plug&Pay API credential aanmaken (3 min)
**Pad:** n8n → Settings → Credentials → Add Credential → HTTP Bearer Auth
- **Name:** `Plug&Pay API Token`
- **Token:** Jouw Plug&Pay API key (te vinden in Plug&Pay → Settings → Developers → API key)
**Koppel aan:** Node "Haal Bestelling Op" in de workflow
**Verificatie:** Credential staat groen in de node

---

### Stap 3 — Gmail credential koppelen (1 min)
**Pad:** In de workflow, klik op de "Stuur CSV per Mail" node
**Actie:** Kies de bestaande Gmail credential `sander@gewoonsander.nl` (al aanwezig in n8n)
**Verificatie:** Credential staat groen in de node

---

### Stap 4 — Webhook URL noteren (1 min)
**Pad:** Klik op de "Plug&Pay Webhook" node → kopieer de "Test URL" (voor testen) en de "Production URL" (voor Plug&Pay)
**Format:** `https://gewoonsander.app.n8n.cloud/webhook/postnl-bestelling`
**Bewaar deze URL** — je hebt hem nodig in Stap 5

---

### Stap 5 — Plug&Pay webhook instellen (3 min)
**Pad:** Plug&Pay dashboard → Instellingen → Developers → Webhooks → Nieuwe regel aanmaken
**Velden:**
- **Naam:** PostNL Verzending n8n
- **Trigger:** Order paid (order_paid)
- **Type:** Webhook V2
- **URL:** De Production URL uit Stap 4
- **Optioneel:** noteer de Webhook Key (voor signature-verificatie in fase 2)
**Sla op**
**Verificatie:** Webhook staat actief in Plug&Pay

---

### Stap 6 — Workflow activeren (1 min)
**Pad:** n8n → workflow "PostNL Verzending – Plug&Pay" → toggle Active aan
**Verificatie:** Groene "Active" badge zichtbaar

---

### Stap 7 — Eindtest met testbestelling (5 min)
**Actie:** Plaats een testbestelling in Plug&Pay (of gebruik de "Test webhook" functie in Plug&Pay als die beschikbaar is)
**Verwacht:**
1. n8n executions → nieuwe execution zichtbaar
2. Execution succesvol doorgelopen (groen)
3. E-mail ontvangen op `sander@gewoonsander.nl` met CSV-bijlage
4. CSV openen → 2 rijen zichtbaar (header + bestelrij)
5. Kolommen: Naam, Bedrijfsnaam, Straat, Huisnummer, Toevoeging, Postcode, Woonplaats, Land, E-mailadres, Telefoonnummer, Kenmerk, Productcode

**Verificatiecommando n8n:** Ga naar n8n → Executions → controleer exit code en output van elke node

---

## Mogelijke aanpassingen na eerste test

| Situatie | Wat aanpassen |
|---|---|
| Plug&Pay API-velden wijken af van verwacht | Code node aanpassen — zie commentaar in de code |
| PostNL weigert CSV (verkeerde kolomnamen) | Vergelijk met PostNL template in Mijn PostNL Business |
| Productcode verkeerd | Wijzig `3085` naar `2928` voor Brievenbuspakket, of laat Sander opgeven welke code hij gebruikt |
| Dubbele mails bij webhook-retry | Idempotency toevoegen via Google Sheet (fase 1.5) |

---

## Fase 2 (later)

Vervang de CSV-stap door PostNL Shipping API call — dan is het label direct als PDF bijgevoegd en hoeft Sander niet meer in te loggen in Mijn PostNL Business. Vereiste: PostNL API key aanvragen via developer.postnl.nl.

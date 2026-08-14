---
agent_id: hermes
session_id: pieter-post-onderzoek
timestamp: 2026-08-14T11:23:14Z
type: realignment
linked_sops:
  - SOP-create-task
  - SOP-claim-task
  - SOP-close-task
  - SOP-list-open-tasks
  - SOP-rebuild-task-index
linked_workstreams: []
linked_guidelines:
  - GL-004-task-resource-linking
  - GL-012-pkm-vs-todoist
  - GL-014-todoist-taakformat
  - GL-018-integratie-en-software-register
---

# Realignment: myPKA wordt ook voor persoonlijke taken de SSOT

## Original direction

Het Pieter Post-ontwerp volgde de bestaande [[GL-012-pkm-vs-todoist]]: acties ontstonden primair in Todoist; alleen duurzame kennis ging naar myPKA.

## Correction

Sander wil niet afhankelijk zijn van Todoist. Persoonlijke acties uit e-mail moeten daarom eerst als canonieke markdowntaak in myPKA ontstaan. Todoist wordt een vervangbare projectie voor uitvoering, planning en herinneringen. Mailbron, context, status en geschiedenis blijven in myPKA beschikbaar.

## Why the direction changed

Een externe takenapp als enige taakbron maakt Sanders werkgeheugen afhankelijk van die dienst en verbreekt de samenhang tussen mail, kennis, projecten en dashboard. myPKA moet de volledige broncontext en taaklevenscyclus behouden; Todoist mag gebruiksgemak toevoegen zonder eigenaar van de gegevens te worden.

## Structural finding

De bestaande `Team Knowledge/tasks/`-SOP's zijn volwassen, maar specifiek ontworpen voor interne teamwerkzaamheden en specialist-hervatpunten. Zij mogen niet rechtstreeks voor Sanders persoonlijke taken worden gebruikt. Atlas moet een afzonderlijk persoonlijk taakschema voorstellen; Daedalus bouwt daarna de synchronisatie. De huidige Cockpit-Todoistregistratie staat nog als `data_role: source` en `sync_direction: import` en moet in een latere, goedgekeurde implementatie worden aangepast.

Gerelateerd: [[2026-08-14-pieter-post-gmail-todoist-design]]

## Update — één aanspreekpunt

Sander bevestigde dat hij ook na de komst van Pieter Post uitsluitend via Hermes wil werken. Hermes blijft de enige gesprekspoort, routeert opdrachten intern naar Pieter of andere specialisten en synthetiseert hun resultaten. Pieter wordt casuseigenaar van e-mailwerk binnen het team, niet een tweede aanspreekpunt voor Sander.

## Update — factuurproces en open onderzoekspunt

Voor Jortt bestaat al een aanleveradres. Sanders huidige praktijk is eerst betalen en daarna de oorspronkelijke factuurmail naar deze Jortt-inbox doorsturen. Daarom moeten `betalen` en `aanleveren aan Jortt` afzonderlijk worden bewaakt. De precieze relatie tussen Jortt en Dropbox — waaronder opslag, toegang, status en back-up — is nog onbekend en mag niet als vaststaand onderdeel van de architectuur worden behandeld. Dit wordt later gericht onderzocht voordat een canoniek financieel archief wordt gekozen.

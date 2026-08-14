---
id: GL-012
title: myPKA en Todoist — bron en projectie
owner: Hermes
created: 2026-06-19
updated: 2026-08-14
tags: [todoist, pkm, workflow]
---

# GL-012 — myPKA en Todoist: bron en projectie

## De regel

myPKA is de SSOT voor persoonlijke taken, duurzame kennis, broncontext, status en geschiedenis. Todoist is een optionele, vervangbare uitvoerings- en herinneringsprojectie.

Een persoonlijke actie ontstaat eerst als canonieke taak in `PKM/Tasks/` volgens [[GL-019-persoonlijke-taakarchitectuur]]. Alleen daarna mag zij via [[SOP-023-synchroniseer-persoonlijke-taak-naar-todoist]] worden geprojecteerd. Verwijdering, uitval of beëindiging van Todoist mag geen canonieke informatie wissen.

## Bronplicht bij e-mail

Iedere myPKA-taak, kennisnotitie of documentregistratie die uit e-mail ontstaat bevat een klikbare Markdown-link naar de oorspronkelijke Gmail-thread.

- Gebruik de exacte connector-URL wanneer beschikbaar; reconstrueer hem niet handmatig.
- Link naar de volledige thread en houd de link bruikbaar na archivering.
- Het dashboard rendert de link als zichtbare bronactie.
- Gmail blijft SSOT voor correspondentie; een zelfstandig document zoals een factuur-PDF krijgt een eigen canonieke archieflocatie.
- Zonder betrouwbare thread-URL blijft verwerking geblokkeerd en wordt dit aan Sander gemeld.

Leesbaar format: `Bron: [Open de oorspronkelijke e-mail in Gmail](<thread-URL>)`.

## Routing

- actie → canonieke `PKM/Tasks/`-taak;
- duurzame kennis → passende PKM-entiteit;
- zelfstandig document → `PKM/Documents/`-record plus canonieke bestandslocatie;
- teamprocedure → `Team Knowledge/`;
- Todoist → uitsluitend afgeleide projectie wanneer nuttig.

Een taak wijst naar kennis en bronnen volgens [[GL-004-task-resource-linking]]. Bronnen krijgen geen terugwijzende taakvelden.

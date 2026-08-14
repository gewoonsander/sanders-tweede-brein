---
key_element: financien
title: Jortt MCP — abonnements- en rechtencheck
date: 2026-08-14
author: Daedalus
type: research-brief
status: final
---

# Jortt MCP — abonnements- en rechtencheck

## Conclusie

De officiële Jortt MCP is in beginsel bruikbaar voor beide administraties. Jortt publiceert een eigen MCP-server op `https://mcp.jortt.nl/mcp`. De server gebruikt OAuth 2.0, is bewust read-only en ontsluit klanten, facturen, offertes, uitgaven, grootboekrekeningen en rapportages.

Het abonnement is geen blokkade: in [[jortt]] staat canoniek vast dat zowel Van Gewoon Sander als Gezinshuis Gewoon Thuis het plan Jortt MKB hebben. Jortt stelt MKB of Plus verplicht voor API-toegang.

De gebruikersrol kan wél een blokkade zijn. Alleen de rol Beheerder kan externe applicaties koppelen en API-sleutels beheren. Bovendien kan de API een verzoek weigeren wanneer de ingelogde gebruiker onvoldoende modulerechten heeft. Daarom moet de MCP per administratie afzonderlijk worden geautoriseerd en getest.

## Veilig startpunt

De officiële MCP is read-only. Dat maakt hem geschikt voor een eerste proef met echte administratiegegevens, zonder dat de agent facturen, boekingen of andere gegevens kan wijzigen of verwijderen. Schrijfacties blijven buiten deze MCP en vereisen de REST API met aparte write-scopes.

## Eerstvolgende verificatie

1. Verbind `https://mcp.jortt.nl/mcp` met de agentruntime.
2. Meld aan op Van Gewoon Sander en controleer of OAuth wordt toegestaan en rapportages/facturen leesbaar zijn.
3. Herhaal dit voor Gezinshuis Gewoon Thuis; autorisatie is administratiegebonden.
4. Noteer per administratie Sanders rol en eventuele foutcode (`organization.requires_mkb_plan`, `scopes.insufficient` of `permissions.insufficient`).
5. Alleen bij succesvolle read-only tests de MCP opnemen in het centrale MCP-serviceregister.

## Bronnen

- [Jortt Developer Documentation — MCP en OAuth](https://developer.jortt.nl/)
- [Jortt — gebruikers en rollen](https://www.jortt.nl/uitleg/instellingen/gebruikers-toevoegen-en-beheren/)
- [Jortt — abonnementsoverzicht](https://www.jortt.nl/uitleg/faq/overzicht-jortt-abonnementen/)
- Gmail-bron: [Nieuwe voorwaarden. In gewone taal.](https://mail.google.com/mail/#all/1a000604c947a5e1)

## Grenzen van dit onderzoek

De publieke documentatie noemt geen aparte MCP-pakkettabel. De conclusie dat MKB volstaat is gebaseerd op het feit dat MCP dezelfde OAuth/API-resources gebruikt, gecombineerd met Jortts expliciete MKB/Plus-eis voor die API. De daadwerkelijke rol en autorisatie moeten daarom nog per administratie worden getest.

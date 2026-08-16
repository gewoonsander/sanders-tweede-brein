---
name: Tweede brein v1 afronden
status: active
target_date: 2026-12-31
key_element: groei
linked_goals:
  - computer-georganiseerd
linked_topics:
  - personal-knowledge-systems
tags:
  - mypka
  - kennismanagement
  - automatisering
  - digitale-organisatie
---

# Tweede brein v1 afronden

## Why this matters

Het tweede brein moet Sanders betrouwbare digitale besturingssysteem worden: eenvoudig aanleveren, automatisch laten verwerken en alles vanuit de levensdomeinen terugvinden. Per object bestaat één single source of truth, terwijl de Mac Mini als centraal werkpaard de routineverwerking uitvoert. MacBook Air en telefoon blijven gebruiksvriendelijke toegangspunten zonder dat Sander zelf verschillende inboxen en opslagplaatsen hoeft te beheren.

## Definition of done

- `Team Inbox` is de enige bewuste teaminbox.
- Per objecttype zijn de canonieke bron, toegestane afgeleiden en back-up vastgelegd.
- De Mac Mini is formeel de primaire uitvoerhost, met een gedocumenteerde herstel- en overdrachtsroute.
- Er bestaat één centraal opslag- en uitvoerregister voor iCloud, Google Drive, Apple Foto's, de Media Hub, het tweede brein en GitHub.
- Oude `00-inbox`-inhoud en historische opslagresten zijn beoordeeld en naar hun canonieke bestemming gerouteerd.
- Nieuwe bestanden volgen een controleerbare route van intake naar bestemming en laten geen blijvende kopie in een inbox achter.
- Automatiseringen melden wat zij hebben verwerkt en leggen twijfel in één uitzonderingswachtrij voor.
- Back-up en herstel zijn per canonieke opslag aantoonbaar gecontroleerd.
- MacBook Air en telefoon kunnen het systeem eenvoudig bedienen en de relevante bestanden terugvinden.
- Een eindcontrole vindt geen belangrijke dubbele waarheden of onbewaakte inboxen.

## Status update

### 2026-08-16

De bestaande architectuur is onderzocht. De Mac Mini functioneert al als centraal werkpaard; het tweede brein synchroniseert via iCloud; Google Drive bevat de documentstructuur; Apple Foto's is bestemd voor persoonlijke media; de Lexar SSD bevat de Media Hub. De belangrijkste resterende gaten zijn het ontbreken van een centraal opslag- en uitvoerregister, historische opslagresten en technisch afdwingbaar eigenaarschap bij gelijktijdige sessies.

## Open threads

- Exacte objecttypen en hun canonieke opslaglocaties vastleggen.
- Bepalen welke bestaande technische invoerkanalen naar `Team Inbox` of rechtstreeks naar een canonieke bron mogen schrijven.
- De inhoud van iCloud `00-inbox`, iCloud `03-passie` en oude Google Drive-hoofdmappen gecontroleerd beoordelen.
- Back-up- en herstelstatus van de Media Hub en overige canonieke bronnen verifiëren.

## Next steps

- [ ] Een ontwerp maken voor het centrale opslag- en uitvoerregister, zonder bestanden te verplaatsen.
- [ ] De gewenste intake-, uitzonderings- en transactielogroute vastleggen en door Sander laten goedkeuren.
- [ ] Na goedkeuring eerst nieuwe instroom volgens het model laten verwerken en daarna pas historische bestanden migreren.

## Related

- [[computer-georganiseerd]]
- [[personal-knowledge-systems]]
- [[groei]]
- [[GL-001-file-naming-conventions]]
- [[2026-07-06-opslagstrategie-migratie-plan]]
- [[2026-06-30-video-systeem-design]]

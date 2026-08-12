---
# Identity
id: tsk-2026-08-12-001
title: "Onderzoek Teambeheer-scraper en continu bijgewerkte dartdatabase"

# Ownership & priority
assignee: athena
priority: 2

# Status (mirrors folder location)
status: in-progress
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-12T06:12:00Z
updated: 2026-08-12T07:38:00Z
due: null

# Provenance
created_by: hermes
source: codex-session-2026-08-12
parent: null

# Cross-references
linked_sops: []
linked_workstreams: []
linked_guidelines: [GL-010-pka-modeling-principles, GL-017-mcp-service-register, GL-018-integratie-en-software-register]
linked_my_life: [n8n, dart-buddies, darts-coaching, adc]
linked_session_logs: []
linked_journal_entries: []

# Tagging
tags: [teambeheer, darts, scraper, n8n, database, onderzoek]
---

# Onderzoek Teambeheer-scraper en continu bijgewerkte dartdatabase

## What this is
Onderzoek welke openbare gegevens via feeds.teambeheer.nl en aanvullende bronnen betrouwbaar verzameld kunnen worden voor een actuele dartdatabase. Het resultaat moet de databronnen, entiteiten, identifiers, updatefrequenties, technische scrape-aanpak, n8n-architectuur, AVG/voorwaardenrisico's en een voorstel voor een voortdurend bijgewerkte spreadsheet beschrijven.

## Context one click away
- Guidelines: [[GL-010-pka-modeling-principles]], [[GL-017-mcp-service-register]], [[GL-018-integratie-en-software-register]]
- Sander's context: [[n8n]], [[dart-buddies]], [[darts-coaching]], [[adc]]

## Success criteria
- Alle relevante Teambeheer-feedtypen en hun velden/relaties zijn geïnventariseerd met voorbeelden.
- Er ligt een genormaliseerd datamodel voor bonden, seizoenen, poules, teams, locaties, spelers, wedstrijden, prestaties, toernooien en nieuws.
- De n8n-opzet bevat discovery, incrementele synchronisatie, deduplicatie, logging, foutafhandeling en veilige opslag.
- Juridische en ethische grenzen rond persoonsgegevens, herpublicatie en scraping zijn expliciet gemarkeerd.
- Er ligt een concreet spreadsheetontwerp en een gefaseerd uitvoeringsadvies.

## Updates
- 2026-08-12 08:12 (hermes) — created; no prior journal entries found for this domain
- 2026-08-12 08:13 (athena) — picked up; no prior journal entries found for this domain
- 2026-08-12 08:20 (hermes) — scope decision: first phase is an RDB-only proof of concept using Teambeheer bond id `d=1`; national expansion is out of scope until validation
- 2026-08-12 08:21 (hermes) — personal-data decision: include publicly published player profiles, performance data, and historical team relationships; exclude contact details and non-public membership-administration data
- 2026-08-12 08:22 (hermes) — storage decision: start with a Google Sheets prototype updated through n8n, while keeping the schema and stable identifiers migration-ready for a later database
- 2026-08-12 08:24 (hermes) — delivery decision: produce the full research report plus a working RDB proof of concept; development workflow entered at brainstorm phase, implementation awaits design approval
- 2026-08-12 08:31 (daedalus) — design approved by Sander; phase-2 implementation plan written in [[2026-08-12-rdb-teambeheer-scraper-plan]]; implementation awaits second approval
- 2026-08-12 08:52 (athena/daedalus) — research report and visually verified 13-tab workbook completed; native Google Sheet import blocked by insufficient Drive create scope. Three existing inactive RDB n8n workflows were discovered but cannot be inspected until MCP access is enabled; awaiting Sander's route choice before creating external objects
- 2026-08-12 09:38 (daedalus) — MCP access verified for all three existing RDB workflows. Location workflow contains reusable live parsing/upsert logic; `rdb teams` is actually a player-vacancy form workflow, not a team scraper; `Spelersmarkt — TeamBeheer RDB` is an incomplete legacy CSV-export scaffold with missing query/extraction configuration and should not be used as the POC foundation
- 2026-08-12 10:30 (daedalus) — expanded the live POC workflow to public RDB core data. Executions 1019 and 1020 succeeded; after the second run the target Sheet held 58 unique venues, 100 unique teams (configured POC cap), and 12 unique divisions with no empty or duplicate `record_key`s. Workflow remains manual and unpublished; players, memberships, matches, sync audit, error path, and correct preservation of `first_seen_at` remain open.
- 2026-08-12 10:36 (daedalus) — priors loaded: no linked or matching Daedalus journal entries exist yet; carrying the approved design, implementation plan, and proven executions 1019–1020 into final implementation.
- 2026-08-12 10:38 (daedalus) — completed the bounded functional POC paths. Execution 1024 succeeded with 2 seasons, 12 divisions, 58 venues, 100 teams, 78 public players, 78 memberships, 100 matches and one sync audit; all entity keys were non-empty and unique. Error fixture execution 1023 wrote a specific parser issue to `data_quality`, later marked resolved. Workflow remains manual/unpublished. Production blockers: `first_seen_at` insert-only semantics, choice of notification/error-handler pattern, and validation before enabling result/achievement/tournament feeds.
- 2026-08-12 (daedalus) — production blockers resolved. Read-before-write now preserves `first_seen_at`; per-table delta filters prevent unchanged Google Sheets writes. Execution 1040 added 200 historical achievements and execution 1041 proved an unchanged idempotent rerun. Tournament ingestion is active but its current source returned zero records; result rows remain empty until scheduled matches have real outcomes.
- 2026-08-12 (daedalus) — published `RDB Teambeheer — Discover & Sync` as active version `d0d1f3d4-7d78-48eb-a23f-c4993a210998`. n8n runs it every Monday at 04:00 Europe/Amsterdam and routes production failures to published central Gmail error handler `AP0jYtVaWajQPBfN`.
- 2026-08-12 10:44 (daedalus) — Sander selected central error handling with Gmail (`ERR-A`, `CHN-A`). Created and published `RDB Teambeheer — Central Error Handler` (`AP0jYtVaWajQPBfN`) and linked it through the scraper's `settings.errorWorkflow`. First Gmail credential failed as expired in execution 1025; root cause was isolated, the working personal `Gmail OAuth2 API` credential was assigned, and test execution 1027 sent successfully. The updated handler version was republished.
- 2026-08-12 (daedalus) — Sander approved full team coverage. Removed the ten-team and hundred-match POC limits. Execution 1045 succeeded in 3m06s without quota errors; `matches` now holds 1,587 data rows and 25 fixtures involving D.T. Irritant (`team_id 394`). Published active version `b5f2cd36-a34c-4b3d-beb8-7bafef034a4b`.

## Outcome
_(filled when status flips to done — see SOP-close-task)_

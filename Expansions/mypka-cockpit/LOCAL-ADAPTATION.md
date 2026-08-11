# SanderCo local adaptation

This runtime is a local adaptation of **myICOR myPKA Cockpit 1.5.2** for
Sander's myPKA scaffold 2.x. It must not be represented as an unchanged or
cryptographically verified myICOR release.

## Provenance

- Original declared version: `1.5.2`
- Original manifest SHA-256: `c2baccaee8b36ba79157a3e8ee8a4907618f2da232a6f796f3e3642c4a764c1d`
- Local adaptation version: `1.5.3`
- Adaptation date: `2026-08-11`
- Security review: `[[2026-08-11-mypka-cockpit-security-audit]]`
- Design: `[[2026-08-11-integratiecontrole-cockpit-design]]`
- Implementation plan: `[[2026-08-11-integratiecontrole-cockpit-plan]]`

## Compatibility changes

- Declares scaffold compatibility `>=2.1.2 <3.0.0` after local validation.
- Maps legacy role requirements Larry/Mack/Silas to Hermes/Daedalus/Atlas.
- Keeps runtime files at the stable `Expansions/mypka-cockpit/` path after
  installation; only the install-manifest snapshot is archived.
- Adds Sander-specific Cockpit modules and integrations under the repository's
  normal review, test and backup workflow.

## Permission surface

The base runtime is loopback-only by default, but optional features can:

- read the derived `mypka.db` mirror;
- write Cockpit-local state to `mypka-cockpit.db`;
- write Fleeting Notes, journal entries and uploads behind explicit write gates;
- store named connector credentials in the gitignored `Team Knowledge/.env`;
- call configured calendar, task, finance, automation and mail services;
- open a local Terminal through guarded `osascript` routes;
- install and run the optional food-capture LaunchAgent;
- fetch and store DartsAtlas data.

All optional network and write features remain disabled or gated until Sander
enables them. Credentials are never part of this document or the manifest.

## Security posture for the integration dashboard

- Canonical integration intent remains in Markdown.
- Device observations remain machine-local in `mypka-cockpit.db`.
- Probes are server-side allowlisted and read-only.
- Browser input can select known integration/probe IDs only; it cannot supply a
  command, URL, header or secret.
- Status responses contain bounded evidence codes, never response bodies or
  credential values.

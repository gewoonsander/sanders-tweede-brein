---
id: tsk-2026-08-12-001
title: "Build portable Dropbox MCP with approved mutation batches"
assignee: daedalus
priority: 2
status: open
blocked_reason: "Gepauzeerd op verzoek van Sander nadat Dropbox App Console herhaaldelijk geen app liet aanmaken; hervatten alleen wanneer Sander het Dropbox-traject opnieuw wil proberen"
blocked_by: null
created: 2026-08-12T06:02:15Z
updated: 2026-08-12T06:25:00Z
due: null
created_by: hermes
source: codex-dropbox-cloud-mcp
parent: null
linked_sops: [SOP-004-argus-security-audit, SOP-018-registreer-mcp-service-bij-agent-runtime]
linked_workstreams: []
linked_guidelines: [GL-005-llm-agnostic-portable-core, GL-017-mcp-service-register, GL-018-integratie-en-software-register]
linked_my_life: []
linked_session_logs: [2026-08-12-08-02_hermes_dropbox-llm-agnostisch-realignment]
linked_journal_entries: []
tags: [dropbox, mcp, oauth, llm-agnostic, security]
---

# Build portable Dropbox MCP with approved mutation batches

## What this is

Build one portable local MCP service that connects cloud-native to Sanders complete Dropbox through OAuth, exposes direct read tools, and permits mutations only through an immutable preview-and-approve batch. Runtime-specific adapters must connect multiple agent runtimes to that same service without duplicating policy or secrets.

## Context one click away

- Procedures: [[SOP-004-argus-security-audit]], [[SOP-018-registreer-mcp-service-bij-agent-runtime]]
- Guidelines: [[GL-005-llm-agnostic-portable-core]], [[GL-017-mcp-service-register]], [[GL-018-integratie-en-software-register]]
- Birthed in: [[2026-08-12-08-02_hermes_dropbox-llm-agnostisch-realignment]]
- Approved design: [[2026-08-12-dropbox-cloud-mcp-design]]

## Success criteria

- One provider-neutral MCP server uses the official Dropbox API/SDK and needs no desktop sync client.
- OAuth secrets and refresh tokens remain outside the myPKA, Git, logs and conversations.
- Read tools work directly; every mutation requires an immutable approved batch manifest.
- Permanent deletion and free-form API passthrough do not exist.
- Multiple runtime adapters expose identical tools and policy from the same service.
- Argus security gate and automated tests pass before OAuth activation.
- Cockpit shows the service and runtime verification without secret data.

## Updates

- 2026-08-12 08:02 (hermes) — created after Sander approved the revised LLM-agnostic design
- 2026-08-12 08:25 (hermes) — gepauzeerd op verzoek van Sander; geen OAuth of runtime-registratie uitgevoerd

## Outcome

_(filled when status flips to done — see SOP-close-task)_

# bunq balance connector — runbook

Read-only balance card for the myPKA Cockpit Hub. One bunq endpoint, one route,
one Hub card.

**Status: built, sandbox not yet run, no production key in use.**
The second Argus audit is still an open gate — see "Before a production key" below.

| | |
|---|---|
| Design | `Deliverables/2026-07-05-bunq-saldo-cockpit-design.md` (Approach A) |
| Research | `Deliverables/2026-08-17-bunq-mcp-koppeling-onderzoek.md` (why no MCP) |
| Audit | `Deliverables/2026-08-17-argus-bunq-connector-audit.md` (verdict YELLOW) |
| Policy | `Team Knowledge/Guidelines/GL-022-financiele-koppelingen-dashboard-scope.md` |

---

## The one thing to understand first

**bunq has no read-only API scope.** A bunq API key can move money. The GET-only
allowlist in this connector constrains *our* code; it does nothing about someone
who steals the key and uses `curl` directly.

So the credentials in `Team Knowledge/.env` are payment credentials. That has
consequences that are not optional:

- `.env` stays `0600` and gitignored.
- The machine running the cockpit stays FileVault-encrypted and screen-locked.
- bunq's own push notifications for outgoing payments are the tripwire. An
  unexpected payment alert means **revoke the key immediately**, not after a
  discussion — bunq app → Settings → Developers → API keys.
- One key per account. Never share a key between Gewoon Sander and the Gezinshuis.

---

## Files

| File | Role |
|---|---|
| `bunqClient.js` | Auth + signing + the single allowlisted GET. The only file that talks to bunq at runtime. |
| `bunqBalance.js` | Normalises accounts, caches 60s, registers the route, enforces the LAN gate. Never calls `fetch`. |
| `bunqSetup.js` | `POST /installation` + `POST /device-server`. **The server never imports this.** |
| `bunqClient.test.mjs` | The audit's allowlist verification, as executable tests. |
| `bunqBalance.test.mjs` | The LAN gate + calm-degradation contract. |
| `../../../scripts/setup-bunq.mjs` | The one-time, human-run registration. |
| `../../../web/src/views/hub/BunqBalanceCard.tsx` | The Hub card. |

Run the tests with `npm run bunq:test` (40 tests, no credentials or network needed).

---

## Setup

```bash
cd Expansions/mypka-cockpit
npm run setup:bunq
```

The script asks for the environment, the API key (hidden), the permitted IPs and
a device description; then generates a keypair, registers with bunq, writes
`BUNQ_*` into `Team Knowledge/.env` and verifies by reading the balance once.

**Sandbox first — this is a hard requirement**, not a suggestion (GL-022). Run the
whole flow against `public-api.sandbox.bunq.com` before a production key is ever
typed. The card labels sandbox data with a badge so fake numbers can never be
mistaken for a real balance.

### Finding your public IP

`permitted_ips` needs the address bunq sees, not `127.0.0.1`:

```bash
curl -s https://api.ipify.org
```

The wildcard `*` is refused by this connector (audit §3.1). bunq only allows it
from inside the app anyway, deliberately.

---

## Rate limits — why the setup is a separate script

bunq's setup endpoints sit in a bucket documented as **"as low as 10 requests /
day"**. A cockpit server that crash-loops under launchd could burn that in
seconds and lock you out of your own bank API for the rest of the day.

That is why `POST /installation` and `POST /device-server` do not exist anywhere
the server can reach them. `bunqClient.js` never imports `bunqSetup.js`, and
`bunqClient.test.mjs` fails if that ever changes.

The server does call `POST /session-server` once per restart (the session token
is deliberately never written to disk). That is protected by its own limits,
independent of bunq's 429: no retry within 60 seconds of a failure, and at most
5 attempts per rolling hour.

> **Open verification point:** which rate-limit bucket `session-server` actually
> falls into is *not* confirmed — bunq's docs do not say, and the audit (§5.2)
> lists it as a mandatory sandbox check. Confirm it during the sandbox run.

---

## Troubleshooting

### The card says "Bunq isn't connected yet"

Setup has not run, or a `BUNQ_*` key is missing from `Team Knowledge/.env`.
Run `npm run setup:bunq`.

### The card says "Balance hidden on this network"

Working as designed. You are reaching the cockpit from another device, and bank
data is served only over loopback — the PIN alone should not be enough to see a
balance, because whoever holds it (a guest, a house-mate) would then see it too.

To allow it anyway, add `BUNQ_ALLOW_LAN=1` to `Team Knowledge/.env` **by hand**.
It is on `connectorAdmin.js`'s `PROTECTED_KEYS` list on purpose: without that,
anyone on the LAN with the PIN could open the gate for themselves from the
Connections page.

### The card says "Bunq is not answering right now"

Most likely your IP changed and is no longer on the permitted list. This is the
expected friction of not using the wildcard.

1. Get the current IP: `curl -s https://api.ipify.org`
2. bunq app → Settings → Developers → API keys → your key → IP addresses
3. Add the new IP. Existing IPs cannot be edited — set the old one to INACTIVE
   and add a new one.
4. The card recovers on its own within 60 seconds (the cache TTL).

Other causes worth checking, in order: bunq outage; the session hit the 5-per-hour
ceiling after repeated failures (wait an hour, or restart the cockpit once the
underlying problem is fixed); the API key belongs to a different environment than
`BUNQ_ENV`.

### A balance looks wrong

The card caches for 60 seconds. Reload after a minute. Beyond that: the card
shows exactly what `GET /user/{id}/monetary-account` returns per account, without
summing — one row per account, including savings and joint accounts, which is
what Sander asked for. Cancelled accounts are hidden.

---

## Before a production key

Both gates below are still open. Neither may be skipped.

- [ ] A completed sandbox run, including the `session-server` bucket verification
      and a restart test (10–15 quick restarts must produce **zero**
      installation/device-server calls — structurally guaranteed here, but verify).
- [ ] **A second Argus audit**, post-implementation, before the first real key.
      The 2026-08-17 audit was a design review and explicitly does not replace it.
      Its concrete test points: run `npm run bunq:test`; grep for write verbs in
      `bunqClient.js`; confirm `bunqBalance.js` contains no `fetch(`; check the
      IP configuration; simulate the crash-loop.

Operational decisions that are Sander's, not the code's — settle them before
activation:

- Which accounts come into view (Gewoon Sander, Gewoon Thuis, or both).
- Whether the connector is limited to one fixed machine and location (the Mac
  mini at home is the lowest-friction option — it runs 24/7 anyway).
- Confirming the bunq plan on the Gewoon Sander account. Pro or Elite is required
  for API access; the Gezinshuis account is confirmed Pro, Gewoon Sander is not
  recorded anywhere and must not be assumed.

---

## What this connector will never do

Not "does not currently" — **will never**, without a separate design and its own
audit (GL-022):

- Any write call: payments, draft-payments, attachments, card management.
- Reading transactions. Transaction descriptions are attacker-controllable text;
  that is a separate design question, not an extra line in the allowlist.
- An MCP server. See the research brief for the full reasoning.

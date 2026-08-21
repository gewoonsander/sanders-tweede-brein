// bunqClient.test.mjs — the audit's verification step, as executable code.
//
// Deliverables/2026-08-17-argus-bunq-connector-audit.md makes this test a HARD
// requirement, not a nicety:
//
//   §1.5  "Een unit-test die bevestigt dat signedGet('/v1/user/123/payment')
//          (of elk ander niet-toegestaan path) een Error gooit vóórdat een
//          netwerkcall plaatsvindt (mock fetch, assert fetch nooit is
//          aangeroepen). Dit is de verificatiestap: als deze test faalt of
//          ontbreekt, is de eis niet gehaald."
//
//   §1 "Verificatiestap bij de post-build-audit": grep for POST|PUT|PATCH|DELETE
//      in bunqClient.js outside the auth calls → zero hits; confirm bunqBalance.js
//      contains no `fetch(`.
//
// The second one is a manual grep in the audit. We automate it below, so a future
// edit that reintroduces a write call fails CI instead of waiting for a human to
// re-run a grep months later.
//
// SAFETY: this test never performs a network call and never needs credentials.
// Every signedGet() case here is a REFUSED path, and refusal happens before the
// session layer is reached. The allowed path is asserted against the exported
// regex directly, precisely so that a machine which HAS bunq credentials in
// Team Knowledge/.env cannot accidentally hit the live API while running tests.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as bunqClient from './bunqClient.js';
import { signedGet, __testing } from './bunqClient.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_SRC = fs.readFileSync(path.join(__dirname, 'bunqClient.js'), 'utf8');
const BALANCE_SRC = fs.readFileSync(path.join(__dirname, 'bunqBalance.js'), 'utf8');

// A fetch stand-in that records every call. If the allowlist ever lets one of
// these paths through, `calls` becomes non-empty and the assertion fails.
function spyFetch() {
  const calls = [];
  const fn = async (...args) => {
    calls.push(args);
    throw new Error('the allowlist let a forbidden path reach the network');
  };
  fn.calls = calls;
  return fn;
}

// ============================================================================
// AUDIT §1.5 — forbidden paths are refused BEFORE any network call
// ============================================================================

const FORBIDDEN_PATHS = [
  // The exact example named in the audit.
  '/v1/user/123/payment',
  // Every write surface bunq exposes that we must never touch.
  '/v1/user/123/draft-payment',
  '/v1/user/123/monetary-account/1/payment',
  '/v1/user/123/monetary-account/1/draft-payment',
  '/v1/user/123/attachment',
  '/v1/user/123/note-attachment',
  '/v1/user/123/card',
  '/v1/user/123/request-inquiry',
  // Auth-lifecycle endpoints must not be reachable through the public API.
  '/v1/installation',
  '/v1/device-server',
  '/v1/session-server',
  // Near-misses that a sloppy substring match would wave through.
  '/v1/user/123/monetary-account/1',
  '/v1/user/123/monetary-account?include=payment',
  '/v1/user/123/monetary-account/',
  'https://evil.example/v1/user/123/monetary-account',
  '/v1/user/abc/monetary-account',
  '/v1/user//monetary-account',
  '  /v1/user/123/monetary-account',
  '/v1/user/123/monetary-account\n/v1/user/123/payment',
];

for (const forbidden of FORBIDDEN_PATHS) {
  test(`signedGet refuses ${JSON.stringify(forbidden)} without touching the network`, async () => {
    const fetchSpy = spyFetch();
    await assert.rejects(
      () => signedGet(forbidden, { _fetch: fetchSpy }),
      /not on the allowlist/,
      'a non-allowlisted path must throw',
    );
    assert.equal(fetchSpy.calls.length, 0, 'fetch must never be called for a refused path');
  });
}

test('signedGet refuses non-string paths without touching the network', async () => {
  for (const bad of [null, undefined, 42, {}, [], /^\/v1\/.*$/]) {
    const fetchSpy = spyFetch();
    await assert.rejects(() => signedGet(bad, { _fetch: fetchSpy }), /not on the allowlist/);
    assert.equal(fetchSpy.calls.length, 0);
  }
});

// ============================================================================
// The allowlist itself — asserted directly, so this test never needs credentials
// and can never reach the live API.
// ============================================================================

test('the allowlist contains exactly one entry: the balance read', () => {
  assert.equal(
    __testing.ALLOWED_GET_PATHS.length,
    1,
    'adding an endpoint is a deliberate act that must update this test too',
  );
});

test('the allowed path matches, and only in its exact form', () => {
  const [re] = __testing.ALLOWED_GET_PATHS;
  assert.ok(re.test('/v1/user/123/monetary-account'));
  assert.ok(re.test('/v1/user/1/monetary-account'));
  // Anchored at both ends — no prefix, no suffix, no query string.
  assert.ok(!re.test('/v1/user/123/monetary-account/1'));
  assert.ok(!re.test('x/v1/user/123/monetary-account'));
  assert.ok(!re.test('/v1/user/123/monetary-account?x=1'));
});

// ============================================================================
// AUDIT §1.1 — no generic request function is exported
// ============================================================================

test('bunqClient exports no generic request/post/write helper', () => {
  const exported = Object.keys(bunqClient);
  for (const forbidden of ['request', 'post', 'put', 'patch', 'del', 'delete', 'send', 'call']) {
    assert.ok(
      !exported.includes(forbidden),
      `bunqClient must not export "${forbidden}" — see audit §1.1`,
    );
  }
  // The only network-capable export is signedGet.
  assert.ok(exported.includes('signedGet'));
});

test('signedGet takes no HTTP-method parameter', () => {
  // (path, options) — a third "method"-ish parameter would be a red flag.
  assert.ok(signedGet.length <= 2, 'signedGet must not grow a method parameter');
  assert.match(CLIENT_SRC, /method:\s*'GET'/, "the verb must be a literal in the fetch call");
});

// ============================================================================
// AUDIT §1 verification grep, automated
// ============================================================================

test('bunqClient.js contains no write verb other than the session-server POST', () => {
  // Look at real fetch invocations: `method: '<VERB>'`.
  const verbs = [...CLIENT_SRC.matchAll(/method:\s*'([A-Z]+)'/g)].map((m) => m[1]);
  const writes = verbs.filter((v) => v !== 'GET');
  assert.deepEqual(
    writes,
    ['POST'],
    'exactly one write call may exist in bunqClient.js: POST /session-server',
  );
  // ...and it must be the session-server one, nothing else.
  const postTargets = [...CLIENT_SRC.matchAll(/bunqBaseUrl\(\)\}(\/v1\/[a-z-]+)`,\s*\{\s*\n\s*method:\s*'POST'/g)]
    .map((m) => m[1]);
  assert.deepEqual(postTargets, ['/v1/session-server']);
});

test('bunqClient.js does not contain the setup endpoints at all', () => {
  // Audit §5, enforced structurally: these live in bunqSetup.js, which the
  // server never imports, so a crash-loop cannot burn the ~10/day bucket.
  assert.ok(!CLIENT_SRC.includes("'/v1/installation'"));
  assert.ok(!CLIENT_SRC.includes("'/v1/device-server'"));
  assert.ok(!/\/v1\/installation`/.test(CLIENT_SRC));
  assert.ok(!/\/v1\/device-server`/.test(CLIENT_SRC));
});

test('bunqBalance.js never calls fetch or builds a bunq URL itself', () => {
  // Audit §1.3: the consumer must go through bunqClient's narrow surface.
  assert.ok(!/[^a-zA-Z_.]fetch\s*\(/.test(BALANCE_SRC), 'bunqBalance.js must not call fetch');
  assert.ok(!BALANCE_SRC.includes('bunq.com'), 'bunqBalance.js must not build a bunq URL');
  assert.ok(!/method:\s*'(POST|PUT|PATCH|DELETE)'/.test(BALANCE_SRC));
});

test('the server never imports the setup module', () => {
  // bunqSetup.js may only be reached from scripts/setup-bunq.mjs. We match on
  // real import/require statements — both files DISCUSS bunqSetup.js in their
  // header comments on purpose, and a prose mention is not a code path.
  const importsSetup = (src) =>
    /^\s*import[^;]*from\s+['"][^'"]*bunqSetup\.js['"]/m.test(src) ||
    /require\(\s*['"][^'"]*bunqSetup\.js['"]\s*\)/.test(src) ||
    /import\(\s*['"][^'"]*bunqSetup\.js['"]\s*\)/.test(src);

  assert.ok(!importsSetup(CLIENT_SRC), 'bunqClient.js must not import bunqSetup.js');
  assert.ok(!importsSetup(BALANCE_SRC), 'bunqBalance.js must not import bunqSetup.js');
});

// ============================================================================
// AUDIT §5.3 — crash-loop protection is real, independent of bunq's own 429
// ============================================================================

test('session attempts are capped per hour regardless of what bunq answers', async () => {
  __testing.resetSessionState();
  const now = Date.now();
  // Simulate having already used the hourly allowance.
  for (let i = 0; i < __testing.SESSION_MAX_ATTEMPTS_PER_HOUR; i += 1) {
    __testing.sessionState.attemptTimes.push(now - 1000 * i);
  }
  const fetchSpy = spyFetch();
  await assert.rejects(
    () => signedGet('/v1/user/123/monetary-account', { _fetch: fetchSpy }),
    // Either the ceiling or the not-set-up guard fires first; both are refusals
    // that happen before any balance request reaches the network.
    /ceiling reached|not set up|cooling down/,
  );
  assert.equal(fetchSpy.calls.length, 0, 'no balance request may go out while capped');
  __testing.resetSessionState();
});

test('a recent failure forces a cooldown before the next session attempt', async () => {
  __testing.resetSessionState();
  __testing.sessionState.lastFailureAt = Date.now();
  const fetchSpy = spyFetch();
  await assert.rejects(
    () => signedGet('/v1/user/123/monetary-account', { _fetch: fetchSpy }),
    /cooling down|not set up/,
  );
  assert.equal(fetchSpy.calls.length, 0);
  __testing.resetSessionState();
});

// ============================================================================
// AUDIT §1 / GL-022 — secrets never leak through the diagnostics surface
// ============================================================================

test('diagnostics never expose a raw secret', () => {
  const diag = bunqClient.bunqDiagnostics();
  for (const key of ['apiKey', 'installationToken']) {
    const value = String(diag[key]);
    assert.ok(
      value === '<none>' || value.startsWith('***'),
      `${key} must be masked or absent, got ${value}`,
    );
  }
  assert.ok(!('privateKey' in diag), 'the private key must never appear in diagnostics');
});

test('environment falls back to sandbox, never to production', () => {
  // Fail-safe: an unset or malformed BUNQ_ENV must not reach the live bank.
  assert.match(CLIENT_SRC, /raw === 'production' \? 'production' : 'sandbox'/);
});

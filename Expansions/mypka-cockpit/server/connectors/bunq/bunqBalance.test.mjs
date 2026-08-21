// bunqBalance.test.mjs — the LAN gate and the calm-degradation contract.
//
// Deliverables/2026-08-17-argus-bunq-connector-audit.md §4 requires the balance
// card to be hidden by default when the cockpit is reached over the LAN, even
// while it works normally on loopback.
//
// That gate cannot be exercised with curl: the cockpit's auth middleware answers
// 401 to a non-loopback Host before the route is ever reached (verified live on
// 2026-08-21). The middleware is the OUTER protective layer; this test covers the
// inner one — what happens once a request legitimately gets past auth, which is
// exactly the guest-with-the-PIN scenario the audit is about.
//
// SAFETY: no credentials, no network. Every case here ends in a refusal or in
// 'not-configured', both of which return before any bunq call.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { registerBunqBalanceRoutes, readBalances } from './bunqBalance.js';

/** Minimal Express stand-in: captures the handler registered for a path. */
function fakeApp() {
  const routes = new Map();
  return {
    get(path, handler) {
      routes.set(path, handler);
    },
    routes,
  };
}

/**
 * server.js's safeAsync, reduced to what the route needs: await the handler and
 * hand back what it resolved to.
 */
function passthroughSafeAsync(handler) {
  return async (req) => handler(req);
}

function buildRoute({ loopback }) {
  const app = fakeApp();
  registerBunqBalanceRoutes(app, {
    safeAsync: passthroughSafeAsync,
    isLoopbackHost: () => loopback,
  });
  const handler = app.routes.get('/api/cockpit/bunq/balance');
  assert.ok(handler, 'the balance route must be registered');
  return handler;
}

test('the route is registered on exactly one path, and it is a GET', () => {
  const app = fakeApp();
  registerBunqBalanceRoutes(app, {
    safeAsync: passthroughSafeAsync,
    isLoopbackHost: () => true,
  });
  assert.deepEqual([...app.routes.keys()], ['/api/cockpit/bunq/balance']);
});

test('over LAN without opt-in: no balance data, and an honest reason', async () => {
  delete process.env.BUNQ_ALLOW_LAN;
  const handler = buildRoute({ loopback: false });
  const result = await handler({});

  assert.equal(result.available, false);
  assert.equal(result.reason, 'lan-hidden');
  assert.deepEqual(result.items, [], 'not a single account may leak over the LAN');
  assert.equal(result.total, 0);
  // Nothing about the account setup may be inferable from the LAN response.
  assert.ok(!('environment' in result));
  assert.ok(!('fetchedAt' in result));
});

test('over LAN the gate fires BEFORE the bunq read is attempted', async () => {
  delete process.env.BUNQ_ALLOW_LAN;
  const handler = buildRoute({ loopback: false });
  const result = await handler({});
  // 'lan-hidden' — not 'not-configured'. If the reason were 'not-configured'
  // the gate would be running AFTER the credential check, which would mean a
  // configured machine had already started doing bunq work for a LAN caller.
  assert.equal(result.reason, 'lan-hidden');
});

test('BUNQ_ALLOW_LAN=1 is the only thing that opens the gate', async () => {
  process.env.BUNQ_ALLOW_LAN = '1';
  try {
    const handler = buildRoute({ loopback: false });
    const result = await handler({});
    // Past the gate — so the reason now comes from the credential check instead.
    assert.notEqual(result.reason, 'lan-hidden');
    assert.equal(result.available, false);
    assert.equal(result.reason, 'not-configured');
  } finally {
    delete process.env.BUNQ_ALLOW_LAN;
  }
});

test('a truthy-looking value that is not exactly "1" does NOT open the gate', async () => {
  // Fail closed: 'true', 'yes', '0', 'sure' must all keep bank data off the LAN.
  for (const value of ['true', 'yes', '0', 'sure', ' 1 x', 'on']) {
    process.env.BUNQ_ALLOW_LAN = value;
    try {
      const handler = buildRoute({ loopback: false });
      const result = await handler({});
      assert.equal(result.reason, 'lan-hidden', `"${value}" must not open the LAN gate`);
    } finally {
      delete process.env.BUNQ_ALLOW_LAN;
    }
  }
});

test('on loopback the gate is not involved at all', async () => {
  delete process.env.BUNQ_ALLOW_LAN;
  const handler = buildRoute({ loopback: true });
  const result = await handler({});
  assert.notEqual(result.reason, 'lan-hidden');
});

test('readBalances degrades calmly instead of throwing when unconfigured', async () => {
  // The invoicesApi.js contract: a missing setup is data, never an exception —
  // this is what stops a bank outage from 500-ing the whole Hub.
  const result = await readBalances({ force: true });
  assert.equal(result.available, false);
  assert.deepEqual(result.items, []);
  assert.equal(result.total, 0);
  assert.ok(typeof result.reason === 'string');
});

test('no response shape ever carries a credential-looking field', async () => {
  const shapes = [
    await readBalances({ force: true }),
    await buildRoute({ loopback: false })({}),
  ];
  const forbidden = ['apiKey', 'api_key', 'secret', 'privateKey', 'token', 'installationToken'];
  for (const shape of shapes) {
    const json = JSON.stringify(shape);
    for (const field of forbidden) {
      assert.ok(!json.includes(field), `response must not contain "${field}": ${json}`);
    }
  }
});

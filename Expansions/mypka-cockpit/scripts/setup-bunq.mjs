// setup-bunq.mjs — the one-time, human-run bunq registration. Run it by hand.
//
//   npm run setup:bunq        (from Expansions/mypka-cockpit)
//
// ============================================================================
// WHAT THIS DOES, AND WHY IT IS A SCRIPT AND NOT PART OF THE SERVER
// ============================================================================
// bunq's setup endpoints live in a bucket documented as "as low as 10 requests /
// day". Registering from inside the server would mean a crash-loop could lock
// Sander out of his own bank API. So registration happens exactly once, here,
// with a human watching — and the server literally cannot reach these calls
// (server/connectors/bunq/bunqClient.js never imports bunqSetup.js).
//
// STEPS
//   1. Ask for the environment (sandbox first — that is mandatory, see below).
//   2. Ask for the API key, typed hidden. It is never echoed or logged.
//   3. Ask for the permitted IPs. Concrete addresses only; "*" is refused.
//   4. Generate a 2048-bit RSA keypair.
//   5. POST /installation      → installation token   [uses the 10/day bucket]
//   6. POST /device-server     → device registration  [uses the 10/day bucket]
//   7. POST /session-server    → the numeric user id
//   8. Write BUNQ_* into Team Knowledge/.env (0600, one atomic line each).
//   9. Verify by reading the balance once through the real client.
//
// HARD RULE — SANDBOX FIRST
//   GL-022 and the Argus audit both require a full sandbox run before a
//   production key is ever used. This script will warn loudly when you pick
//   production and make you type the word to confirm.
//
// SECRET HYGIENE
//   The API key and the private key are never printed. The .env is written 0600
//   through connectorAdmin.setEnvKey (atomic temp-file + rename), which leaves
//   every other line byte-for-byte intact.

import readline from 'node:readline';
import fs from 'node:fs';

import {
  generateKeypair,
  createInstallation,
  registerDevice,
  openSetupSession,
  setupBaseUrl,
} from '../server/connectors/bunq/bunqSetup.js';
import { setEnvKey } from '../server/connectorAdmin.js';
import { ENV_PATH } from '../server/connectors/env.js';

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (value) => {
      rl.close();
      resolve(value.trim());
    });
  });
}

// Hidden prompt — mirrors server/set-pin.js so the API key never reaches the
// terminal scrollback.
function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const onData = (char) => {
      const s = char.toString('utf8');
      if (s === '\n' || s === '\r' || s === '') {
        process.stdin.removeListener('data', onData);
      } else {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(question);
      }
    };
    process.stdout.write(question);
    process.stdin.on('data', onData);
    rl.question('', (value) => {
      rl.close();
      process.stdout.write('\n');
      resolve(value.trim());
    });
  });
}

function fail(message) {
  console.error(`\n  ✖ ${message}\n`);
  process.exit(1);
}

function looksLikeIp(value) {
  const v = String(value).trim();
  // IPv4 with range check, or a plausible IPv6. Deliberately strict: a typo here
  // becomes a silent lockout later.
  const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(v);
  if (v4) return v4.slice(1).every((o) => Number(o) >= 0 && Number(o) <= 255);
  return /^[0-9a-fA-F:]+$/.test(v) && v.includes(':');
}

async function main() {
  console.log(`
  ────────────────────────────────────────────────────────────
   bunq balance connector — one-time setup
  ────────────────────────────────────────────────────────────

  This registers ONE device with bunq and stores the result in
  ${ENV_PATH}

  Steps 5 and 6 consume bunq's setup quota ("as low as 10 requests
  per day"). Do not run this in a loop. If something fails halfway,
  read the error before retrying — you have a small budget.
`);

  // --- 1. environment -------------------------------------------------------
  const envAnswer = (await ask('  Environment — (A) sandbox  (B) production  [A]: ')).toLowerCase();
  const env = envAnswer === 'b' || envAnswer === 'production' ? 'production' : 'sandbox';

  if (env === 'production') {
    console.log(`
  ⚠  PRODUCTION selected.

     A bunq production API key can control the account and make
     payments. GL-022 and the Argus audit both require a completed
     SANDBOX run first, plus a second Argus audit before a real key
     is used for the first time.
`);
    const confirm = await ask('  Type PRODUCTIE to continue, anything else to abort: ');
    if (confirm !== 'PRODUCTIE') fail('Aborted. Run the sandbox first.');
  }

  console.log(`\n  Target: ${setupBaseUrl(env)}\n`);

  // --- 2. API key -----------------------------------------------------------
  console.log('  Get the key from the bunq app: Settings → Developers → API keys.');
  const apiKey = await askHidden('  Paste the bunq API key (hidden): ');
  if (!apiKey) fail('No API key entered.');

  // --- 3. permitted IPs -----------------------------------------------------
  console.log(`
  Which IP addresses may use this key? Concrete addresses only —
  the wildcard "*" is refused by policy (Argus audit §3).

  Tip: this is your public IP as bunq sees it, not 127.0.0.1.
  Find it with:  curl -s https://api.ipify.org
`);
  const ipsRaw = await ask('  Permitted IPs, comma-separated: ');
  const permittedIps = ipsRaw.split(',').map((s) => s.trim()).filter(Boolean);
  if (permittedIps.length === 0) fail('At least one concrete IP address is required.');
  const badIp = permittedIps.find((ip) => !looksLikeIp(ip));
  if (badIp) fail(`"${badIp}" does not look like an IP address. Nothing was sent to bunq.`);

  const description = (await ask('  Device description [myPKA Cockpit]: ')) || 'myPKA Cockpit';

  // --- 4. keypair -----------------------------------------------------------
  console.log('\n  → Generating a 2048-bit RSA keypair…');
  const { publicKeyPem, privateKeyPem } = generateKeypair();
  console.log('    done (the private key is never printed).');

  // --- 5. installation ------------------------------------------------------
  console.log('  → POST /v1/installation …');
  const { installationToken } = await createInstallation({ env, publicKeyPem });
  console.log('    installation token received.');

  // --- 6. device-server -----------------------------------------------------
  console.log('  → POST /v1/device-server …');
  const { deviceServerId } = await registerDevice({
    env,
    apiKey,
    installationToken,
    description,
    permittedIps,
  });
  console.log(`    device registered (id ${deviceServerId ?? 'unknown'}).`);

  // --- 7. session → user id -------------------------------------------------
  console.log('  → POST /v1/session-server …');
  const { userId } = await openSetupSession({ env, apiKey, installationToken, privateKeyPem });
  console.log(`    user id ${userId}.`);

  // --- 8. persist -----------------------------------------------------------
  console.log('\n  → Writing to Team Knowledge/.env (0600) …');
  const writes = {
    BUNQ_ENV: env,
    BUNQ_API_KEY: apiKey,
    BUNQ_PRIVATE_KEY_B64: Buffer.from(privateKeyPem, 'utf8').toString('base64'),
    BUNQ_INSTALLATION_TOKEN: installationToken,
    BUNQ_USER_ID: String(userId),
  };
  if (deviceServerId != null) writes.BUNQ_DEVICE_SERVER_ID = String(deviceServerId);

  for (const [key, value] of Object.entries(writes)) {
    const result = setEnvKey(key, value);
    if (result.ok !== 'saved') fail(`Could not write ${key} (${result.ok}).`);
    console.log(`    ${key} ✓`);
  }

  try {
    const mode = fs.statSync(ENV_PATH).mode & 0o777;
    console.log(`    .env permissions: ${mode.toString(8)}${mode === 0o600 ? ' ✓' : ' ⚠ expected 600'}`);
  } catch {
    /* best effort */
  }

  // --- 9. verify ------------------------------------------------------------
  // Import AFTER the .env is written so the client resolves the fresh keys.
  console.log('\n  → Verifying by reading the balance once…');
  const { readBalances } = await import('../server/connectors/bunq/bunqBalance.js');
  const result = await readBalances({ force: true });

  if (!result.available) {
    console.log(`
  ⚠  Registration finished, but the balance read did not succeed:
       reason: ${result.reason}${result.detail ? `\n       detail: ${result.detail}` : ''}

     The credentials ARE stored. Common causes:
       - the calling IP is not in permitted_ips
       - the API key belongs to a different environment than ${env}
     See server/connectors/bunq/README.md → "Card suddenly unavailable".
`);
    process.exit(2);
  }

  console.log(`
  ✔ Done. ${result.total} account(s) readable in ${env}.
`);
  for (const item of result.items) {
    // Balances are shown once, here, to the human who just ran setup — this is
    // the verification step. Nothing is written to a log.
    console.log(`      ${item.description ?? '(no description)'} — ${item.balance} ${item.currency}`);
  }
  console.log(`
  Next:
    - the Hub card appears automatically (no feature flag)
    - the card stays hidden over LAN unless BUNQ_ALLOW_LAN=1 is set by hand
    - run the second Argus audit before using a production key
`);
}

main().catch((err) => {
  // bunq error bodies describe the problem and never contain our secrets, but we
  // print only the message — never a stack with local paths and variables.
  fail(String(err.message || err));
});

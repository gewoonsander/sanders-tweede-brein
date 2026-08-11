#!/usr/bin/env node
// import-exports.mjs — reads bookmarklet exports from the watch folder and
// merges them into the local Darts Atlas store.
//
// THIS SCRIPT MAKES NO NETWORK CALLS AT ALL. It only reads JSON files that
// Sander's own browser wrote after he clicked the bookmarklet on a page he
// opened himself. Darts Atlas's Terms of Use forbid automated/robotic retrieval
// (explicitly including "monitoring"); manual retrieval of a reasonable number
// of pages for personal use is permitted. Keep it that way: if you ever feel
// tempted to add a fetch() here, don't.
//
// USAGE
//   node tools/dartsatlas/import-exports.mjs              # scan inbox + ~/Downloads
//   node tools/dartsatlas/import-exports.mjs --dry-run    # report, write nothing
//   node tools/dartsatlas/import-exports.mjs --watch      # keep watching the inbox
//   node tools/dartsatlas/import-exports.mjs --from-clipboard   # macOS pbpaste
//   node tools/dartsatlas/import-exports.mjs --dir ~/Desktop    # extra folder
//   node tools/dartsatlas/import-exports.mjs --status     # what's in the store
//
// From the Cockpit root you can also run: npm run darts:import

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  DATA_DIR, INBOX_DIR, PROCESSED_DIR,
  loadStore, saveStore, mergeEnvelope, validateEnvelope, missingPages, ensureDirs,
} from './store.mjs';

const FILE_PREFIX = 'dartsatlas-';

// ---------------------------------------------------------------------------
// args
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const opts = { dirs: [], dryRun: false, watch: false, clipboard: false, keep: false, status: false, allowOtherPlayer: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--dir') opts.dirs.push(argv[++i]);
    else if (a.startsWith('--dir=')) opts.dirs.push(a.slice(6));
    else if (a === '--dry-run' || a === '-n') opts.dryRun = true;
    else if (a === '--watch' || a === '-w') opts.watch = true;
    else if (a === '--from-clipboard') opts.clipboard = true;
    else if (a === '--keep') opts.keep = true;
    else if (a === '--status') opts.status = true;
    else if (a === '--allow-other-player') opts.allowOtherPlayer = true;
    else if (a === '--help' || a === '-h') opts.help = true;
    else console.warn(`⚠ onbekend argument genegeerd: ${a}`);
  }
  return opts;
}

function expandHome(p) {
  if (!p) return p;
  return p.startsWith('~') ? path.join(os.homedir(), p.slice(1)) : path.resolve(p);
}

const HELP = `
Darts Atlas import — leest bookmarklet-exports uit de watch-map.

  --dir <pad>            extra map om te scannen (herhaalbaar)
  --dry-run, -n          alleen rapporteren, niets wegschrijven of verplaatsen
  --watch, -w            blijf de inbox bewaken en importeer nieuwe bestanden
  --from-clipboard       lees de JSON uit het klembord (macOS pbpaste)
  --keep                 verwerk het bestand maar laat het staan waar het stond
  --status               toon wat er nu in de store zit en stop
  --allow-other-player   sta een export van een ander speler-id toe
  --help, -h             deze tekst

Standaard gescande mappen:
  ${INBOX_DIR}
  ${path.join(os.homedir(), 'Downloads')}
`;

// ---------------------------------------------------------------------------
// discovery
// ---------------------------------------------------------------------------

function findExports(dirs) {
  const found = [];
  const seen = new Set();
  for (const dir of dirs) {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue; // a configured folder that doesn't exist is not an error
    }
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!entry.name.startsWith(FILE_PREFIX) || !entry.name.endsWith('.json')) continue;
      const full = path.join(dir, entry.name);
      if (seen.has(full)) continue;
      seen.add(full);
      found.push(full);
    }
  }
  // Oldest capture first, so a later page's data wins on conflicting fields.
  return found.sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
}

function moveToProcessed(file) {
  const stamp = new Date().toISOString().slice(0, 7); // YYYY-MM
  const destDir = path.join(PROCESSED_DIR, stamp);
  fs.mkdirSync(destDir, { recursive: true });
  let dest = path.join(destDir, path.basename(file));
  let n = 1;
  while (fs.existsSync(dest)) {
    const ext = path.extname(dest);
    dest = path.join(destDir, `${path.basename(file, ext)}-${n}${ext}`);
    n += 1;
  }
  fs.renameSync(file, dest);
  return dest;
}

// ---------------------------------------------------------------------------
// import
// ---------------------------------------------------------------------------

function importEnvelope(store, env, label, opts) {
  const problem = validateEnvelope(env);
  if (problem) return { ok: false, reason: problem };

  const known = store.index.player && store.index.player.id;
  if (known && env.player.id !== known && !opts.allowOtherPlayer) {
    return {
      ok: false,
      reason: `export hoort bij speler ${env.player.id}, store bij ${known} — gebruik --allow-other-player als dit klopt`,
    };
  }

  const tally = mergeEnvelope(store, env);
  return { ok: true, tally, env, label };
}

function runOnce(opts) {
  const store = loadStore();
  const results = [];

  if (opts.clipboard) {
    let text = '';
    try {
      text = execFileSync('/usr/bin/pbpaste', { encoding: 'utf8' });
    } catch (err) {
      console.error(`✖ klembord lezen mislukt (pbpaste): ${err.message}`);
      return 1;
    }
    let env;
    try {
      env = JSON.parse(text);
    } catch (err) {
      console.error(`✖ klembord bevat geen geldige JSON: ${err.message}`);
      return 1;
    }
    results.push({ file: null, ...importEnvelope(store, env, '(klembord)', opts) });
  }

  const files = opts.clipboard && !opts.dirs.length ? [] : findExports(opts.dirs);
  for (const file of files) {
    let env;
    try {
      env = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
      results.push({ file, ok: false, reason: `geen geldige JSON: ${err.message}` });
      continue;
    }
    results.push({ file, ...importEnvelope(store, env, path.basename(file), opts) });
  }

  const good = results.filter((r) => r.ok);
  const bad = results.filter((r) => !r.ok);

  if (!results.length) {
    console.log('Niets te importeren — geen dartsatlas-*.json gevonden in:');
    for (const d of opts.dirs) console.log(`  ${d}`);
    reportStore(store);
    return 0;
  }

  const totals = { added: 0, updated: 0, unchanged: 0, skipped: 0 };
  for (const r of good) {
    for (const k of Object.keys(totals)) totals[k] += r.tally[k];
    const p = r.env.pagination || {};
    console.log(
      `✓ ${r.label} — ${r.env.pageType}` +
      (r.env.view && r.env.view.status ? ` (${r.env.view.status})` : '') +
      ` pagina ${p.current || 1}/${p.totalPages || 1}: ` +
      `${r.tally.added} nieuw, ${r.tally.updated} bijgewerkt, ${r.tally.unchanged} ongewijzigd` +
      (r.tally.skipped ? `, ${r.tally.skipped} overgeslagen` : ''),
    );
  }
  for (const r of bad) {
    console.error(`✖ ${r.file ? path.basename(r.file) : '(klembord)'} — ${r.reason}`);
  }

  if (opts.dryRun) {
    console.log('\n(dry-run: er is niets weggeschreven en niets verplaatst)');
    reportStore(store);
    return bad.length ? 1 : 0;
  }

  if (good.length) {
    const { counts, written } = saveStore(store);
    console.log(
      `\n${written.length ? `Store bijgewerkt (${written.join(', ')})` : 'Store ongewijzigd — alles stond er al in'} — ${DATA_DIR}\n` +
      `  ${counts.tournaments} toernooien · ${counts.seasons} seizoenen · ${counts.leagues} circuits · ` +
      `${counts.tournamentStats} toernooidetails · ${counts.historySnapshots} stand-momentopnames`,
    );
    if (!opts.keep) {
      for (const r of good) {
        if (!r.file) continue;
        const dest = moveToProcessed(r.file);
        console.log(`  ↪ verwerkt: ${path.relative(DATA_DIR, dest)}`);
      }
    }
  }

  const gaps = missingPages(store);
  if (gaps.length) {
    console.log('\nNog niet vastgelegd (open zelf in je browser en klik de bookmarklet):');
    for (const g of gaps) {
      console.log(`  ${g.pageType}${g.status ? ` (${g.status})` : ''} — pagina ${g.missing.join(', ')} van ${Math.max(...g.have, ...g.missing)}`);
      console.log(`    ${g.hintUrl}`);
    }
  }

  return bad.length ? 1 : 0;
}

function reportStore(store) {
  // Counted live off the buckets, not off index.counts — index.counts is only
  // refreshed by saveStore(), so a --dry-run report would otherwise show stale
  // (or zero) numbers while the in-memory store already holds the merge.
  const c = {
    leagues: Object.keys(store.rankings.leagues || {}).length,
    seasons: Object.keys(store.rankings.seasons || {}).length,
    tournaments: Object.keys(store.tournaments.tournaments || {}).length,
    tournamentStats: Object.keys(store.tournamentStats.stats || {}).length,
    historySnapshots: (store.history.snapshots || []).length,
  };
  const who = store.index.player ? `${store.index.player.name || '?'} (${store.index.player.id})` : '(nog geen speler bekend)';
  console.log(`\nStore: ${DATA_DIR}`);
  console.log(`  speler: ${who}`);
  console.log(`  ${c.tournaments || 0} toernooien · ${c.seasons || 0} seizoenen · ${c.leagues || 0} circuits · ${c.tournamentStats || 0} details · ${c.historySnapshots || 0} momentopnames`);
  console.log(`  laatst gewijzigd: ${store.index.lastChangedAt || '—'}`);
  const caps = Object.keys(store.index.captures || {});
  if (caps.length) console.log(`  vastgelegde pagina's: ${caps.sort().join(', ')}`);
}

// ---------------------------------------------------------------------------
// watch
// ---------------------------------------------------------------------------

function runWatch(opts) {
  ensureDirs();
  console.log(`Kijkt mee op ${INBOX_DIR} — laat dit venster open en klik de bookmarklet. Ctrl+C stopt.`);
  runOnce(opts);
  let timer = null;
  fs.watch(INBOX_DIR, () => {
    clearTimeout(timer);
    // Debounce: a browser download appears as .crdownload/.part first, then the
    // final rename. 1.5s is plenty for a file of this size.
    timer = setTimeout(() => {
      console.log(`\n— ${new Date().toLocaleTimeString('nl-NL')} —`);
      try {
        runOnce(opts);
      } catch (err) {
        console.error(`✖ import mislukt: ${err.message}`);
      }
    }, 1500);
  });
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

const opts = parseArgs(process.argv.slice(2));
if (opts.help) {
  console.log(HELP);
  process.exit(0);
}
opts.dirs = opts.dirs.length
  ? opts.dirs.map(expandHome)
  : [INBOX_DIR, path.join(os.homedir(), 'Downloads')];

if (opts.status) {
  reportStore(loadStore());
  process.exit(0);
}

if (opts.watch) {
  runWatch(opts);
} else {
  process.exit(runOnce(opts));
}

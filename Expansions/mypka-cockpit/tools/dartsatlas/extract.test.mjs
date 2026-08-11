// extract.test.mjs — regression tests for the Darts Atlas extractor.
//
// Run:  node --test tools/dartsatlas/
//   or: npm run darts:test   (from the Cockpit root)
//
// The fixtures in ./fixtures are REAL pages Sander loaded in his own browser on
// 2026-08-10, saved to disk, with the anonymous CSRF token redacted and the
// signed image URLs / scripts / nav icons stripped. They are the regression net:
// when Darts Atlas changes its markup, these tests fail instead of the
// bookmarklet silently exporting zero records.
//
// jsdom is a DEV-ONLY dependency and is deliberately not in package.json (the
// Cockpit ships no test runner deps). Without it the suite skips instead of
// failing, so `node --test` on a fresh clone stays green:
//     npm install --no-save jsdom && npm run darts:test

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { extractFromDocument, detectPage, parseAtlasDate, toInt, toNum } from './extract.mjs';
import { mergeEnvelope, validateEnvelope, missingPages, STORE_SCHEMA } from './store.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, 'fixtures');

let JSDOM = null;
try {
  ({ JSDOM } = await import('jsdom'));
} catch {
  /* handled per-test below */
}
const needsDom = { skip: JSDOM ? false : 'jsdom niet geïnstalleerd — npm install --no-save jsdom' };

function parse(fixture, href) {
  const html = fs.readFileSync(path.join(FIXTURES, fixture), 'utf8');
  return extractFromDocument(new JSDOM(html).window.document, href);
}

const emptyStore = () => ({
  index: { schema: STORE_SCHEMA, player: null, updatedAt: null, lastChangedAt: null, captures: {}, counts: {} },
  rankings: { schema: STORE_SCHEMA, updatedAt: null, leagues: {}, seasons: {} },
  tournaments: { schema: STORE_SCHEMA, updatedAt: null, tournaments: {} },
  tournamentStats: { schema: STORE_SCHEMA, updatedAt: null, stats: {} },
  history: { schema: STORE_SCHEMA, updatedAt: null, snapshots: [] },
});

// ---------------------------------------------------------------------------
// pure helpers — no DOM needed
// ---------------------------------------------------------------------------

test('detectPage herkent de drie ondersteunde pagina-types', () => {
  assert.deepEqual(detectPage('https://www.dartsatlas.com/players/ABC/rankings'), {
    pageType: 'rankings', playerId: 'ABC', tournamentId: null, page: 1, status: 'active',
  });
  assert.deepEqual(detectPage('https://www.dartsatlas.com/players/ABC/rankings?status=history&page=3'), {
    pageType: 'rankings', playerId: 'ABC', tournamentId: null, page: 3, status: 'history',
  });
  assert.deepEqual(detectPage('https://www.dartsatlas.com/players/ABC/tournaments?page=2'), {
    pageType: 'tournaments', playerId: 'ABC', tournamentId: null, page: 2, status: null,
  });
  assert.deepEqual(detectPage('https://www.dartsatlas.com/tournaments/T1/player_stats/ABC'), {
    pageType: 'tournament_stats', playerId: 'ABC', tournamentId: 'T1', page: 1, status: null,
  });
  assert.equal(detectPage('https://www.dartsatlas.com/players/ABC').pageType, null);
  assert.equal(detectPage('https://example.com/').pageType, null);
});

test('getal- en datumconversie', () => {
  assert.equal(toInt('#62'), 62);
  assert.equal(toInt(''), null);
  assert.equal(toNum('72.99'), 72.99);
  assert.equal(parseAtlasDate('29-Jun, 2026'), '2026-06-29');
  assert.equal(parseAtlasDate('1-Jan, 2025'), '2025-01-01');
  assert.equal(parseAtlasDate('rommel'), null);
});

// ---------------------------------------------------------------------------
// extraction against the real saved pages
// ---------------------------------------------------------------------------

test('rankings-pagina levert circuit- en seizoensstand', needsDom, () => {
  const env = parse('rankings.html', 'https://www.dartsatlas.com/players/n6oeItIbK1vl/rankings');

  assert.equal(env.pageType, 'rankings');
  assert.equal(env.player.id, 'n6oeItIbK1vl');
  assert.equal(env.recordCount, 2);

  const league = env.records.find((r) => r.kind === 'league-standing');
  assert.equal(league.leagueId, '0SGleWxG03FM');
  assert.equal(league.leagueName, 'ADC Benelux');
  assert.equal(league.stats.rank, 62);
  assert.equal(league.stats.points, 270);
  assert.equal(league.stats.average, 72.99);
  assert.equal(league.stats.first9, 79.82);
  assert.equal(league.stats.matchWins, 113);
  assert.equal(league.stats.matchLosses, 37);
  assert.equal(league.stats.titles, 3);
  assert.deepEqual(league.regionRanks, [{ regionId: 'YwY1bb8DLNqP', regionName: 'Netherlands', rank: 39 }]);

  const season = env.records.find((r) => r.kind === 'season-standing');
  assert.equal(season.seasonId, 'uoGtg6XqtbQH');
  assert.equal(season.period.start, '2026-06-29');
  assert.equal(season.period.end, null);
  assert.deepEqual(season.status, ['in-progress']);
  assert.equal(season.stats.scores100Plus, 123);
  assert.equal(season.stats.scores140Plus, 39);
  assert.equal(season.stats.scores180, 8);
  assert.equal(season.stats.wins, 15);
  assert.equal(season.stats.losses, 7);

  // Checkout-percentage bestaat niet op deze pagina's — nooit verzinnen.
  assert.equal('checkout' in season.stats, false);
  assert.equal('checkoutPercentage' in season.stats, false);
});

test('toernooien-pagina levert 20 toernooien plus paginering', needsDom, () => {
  const env = parse('tournaments.html', 'https://www.dartsatlas.com/players/n6oeItIbK1vl/tournaments');

  assert.equal(env.pageType, 'tournaments');
  assert.equal(env.recordCount, 20);
  assert.equal(env.pagination.current, 1);
  assert.equal(env.pagination.totalPages, 4);
  assert.equal(env.pagination.nextUrl, 'https://www.dartsatlas.com/players/n6oeItIbK1vl/tournaments?page=2');

  const first = env.records[0];
  assert.equal(first.tournamentId, 'n6hmb8AwUu9C');
  assert.equal(first.date, '2026-08-03');
  assert.equal(first.name, 'Winmau Benelux Open 2026 - East Netherlands - Arnhem');
  assert.equal(first.result, 'Quarter-Final');
  assert.equal(first.stats.average, 68.57);
  assert.equal(first.stats.first9, 83.74);
  assert.equal(first.leagueName, 'ADC Benelux');
  assert.equal(first.statsPath, '/tournaments/n6hmb8AwUu9C/player_stats/n6oeItIbK1vl');
  assert.equal(first.points, null); // dit toernooi toont geen sanctiepunten

  // Sanctiepunten worden als tag gerenderd, niet als label/waarde-paar.
  assert.equal(env.records[1].points, 4);

  // Elk record moet een id en een datum hebben, anders is de merge-sleutel stuk.
  for (const r of env.records) {
    assert.ok(r.tournamentId, 'tournamentId ontbreekt');
    assert.match(r.date, /^\d{4}-\d{2}-\d{2}$/);
  }
  assert.equal(env.records[19].date, '2025-11-09');
});

test('toernooidetail levert scorestats en per-wedstrijd-uitslagen', needsDom, () => {
  const env = parse('tournament-stats.html', 'https://www.dartsatlas.com/tournaments/n6hmb8AwUu9C/player_stats/n6oeItIbK1vl');

  assert.equal(env.pageType, 'tournament_stats');
  assert.equal(env.recordCount, 1);

  const rec = env.records[0];
  assert.equal(rec.tournamentId, 'n6hmb8AwUu9C');
  assert.equal(rec.stats.average, 68.57);
  assert.equal(rec.stats.scores100Plus, 29);
  assert.equal(rec.stats.scores140Plus, 9);
  assert.equal(rec.stats.scores180, 2);
  assert.equal(rec.stats.legsWon, 10);
  assert.equal(rec.stats.legsLost, 12);
  assert.equal(rec.stats.breaks, 3);

  assert.equal(rec.matches.length, 4);
  const r1 = rec.matches[0];
  assert.equal(r1.round, 'Round 1');
  assert.equal(r1.format, 'Best of 7');
  assert.equal(r1.playerName, 'Sander van Ockenburg - Zwaan');
  assert.equal(r1.playerScore, 4);
  assert.equal(r1.playerAverage, 66.8);
  assert.equal(r1.opponentName, 'Ben THIELKING');
  assert.equal(r1.opponentScore, 0);
  assert.equal(r1.opponentAverage, 53.24);
  assert.equal(r1.won, true);

  // Sander staat in wedstrijd 2 in de player-1-slot: de "wie ben ik"-match mag
  // niet positioneel zijn, maar op naam.
  const r2 = rec.matches[1];
  assert.equal(r2.playerName, 'Sander van Ockenburg - Zwaan');
  assert.equal(r2.opponentName, 'Raoul Hendriks');
  assert.equal(r2.won, false);
  assert.equal(r2.playerScore, 2);
  assert.equal(r2.opponentScore, 4);
});

test('een niet-ondersteunde pagina levert een lege envelope, geen crash', needsDom, () => {
  const env = parse('profile-unsupported.html', 'https://www.dartsatlas.com/players/n6oeItIbK1vl');
  assert.equal(env.pageType, null);
  assert.equal(env.recordCount, 0);
  assert.deepEqual(env.records, []);
});

// ---------------------------------------------------------------------------
// store merge
// ---------------------------------------------------------------------------

test('validateEnvelope weigert wat het niet begrijpt', () => {
  assert.match(validateEnvelope(null), /geen JSON-object/);
  assert.match(validateEnvelope({ source: 'iets-anders' }), /onbekende bron/);
  assert.match(validateEnvelope({ source: 'dartsatlas', schema: 99 }), /schema/);
  assert.match(validateEnvelope({ source: 'dartsatlas', schema: 1, pageType: 'profiel' }), /niet ondersteund/);
});

test('mergeEnvelope is idempotent en houdt een gedateerde standhistorie bij', needsDom, () => {
  const env = parse('rankings.html', 'https://www.dartsatlas.com/players/n6oeItIbK1vl/rankings');
  const store = emptyStore();

  const first = mergeEnvelope(store, env);
  assert.equal(first.added, 2);
  assert.equal(first.updated, 0);
  assert.equal(Object.keys(store.rankings.leagues).length, 1);
  assert.equal(Object.keys(store.rankings.seasons).length, 1);
  assert.equal(store.history.snapshots.length, 2);
  assert.equal(store.index.player.id, 'n6oeItIbK1vl');

  const second = mergeEnvelope(store, env);
  assert.equal(second.added, 0);
  assert.equal(second.updated, 0);
  assert.equal(second.unchanged, 2);
  assert.equal(store.history.snapshots.length, 2, 'zelfde dag mag geen dubbele momentopname geven');
});

test('mergeEnvelope voegt toernooipaginas samen zonder te overschrijven', needsDom, () => {
  const store = emptyStore();
  const tour = parse('tournaments.html', 'https://www.dartsatlas.com/players/n6oeItIbK1vl/tournaments');
  mergeEnvelope(store, tour);
  assert.equal(Object.keys(store.tournaments.tournaments).length, 20);

  const stats = parse('tournament-stats.html', 'https://www.dartsatlas.com/tournaments/n6hmb8AwUu9C/player_stats/n6oeItIbK1vl');
  mergeEnvelope(store, stats);
  assert.equal(Object.keys(store.tournaments.tournaments).length, 20, 'detailimport mag geen toernooi toevoegen');
  assert.equal(store.tournamentStats.stats.n6hmb8AwUu9C.matches.length, 4);
  // absolute url afgeleid van het pad
  assert.equal(
    store.tournamentStats.stats.n6hmb8AwUu9C.matches[0].url,
    'https://www.dartsatlas.com/matches/d0tpihVu8cZ3',
  );
});

test('missingPages wijst de niet-vastgelegde paginas aan', needsDom, () => {
  const store = emptyStore();
  mergeEnvelope(store, parse('tournaments.html', 'https://www.dartsatlas.com/players/n6oeItIbK1vl/tournaments'));
  const gaps = missingPages(store);
  assert.equal(gaps.length, 1);
  assert.equal(gaps[0].pageType, 'tournaments');
  assert.deepEqual(gaps[0].missing, [2, 3, 4]);
  assert.match(gaps[0].hintUrl, /players\/n6oeItIbK1vl\/tournaments\?page=2$/);
});

// extract.mjs — Darts Atlas DOM → structured records.
//
// SINGLE SOURCE OF TRUTH for the parsing logic. Used in two places:
//   1. build-bookmarklet.mjs inlines this file's body into the bookmarklet, so
//      the extraction runs IN SANDER'S OWN BROWSER, on a page he opened himself.
//   2. extract.test.mjs runs it under jsdom against the saved fixtures, so a
//      Darts Atlas markup change surfaces as a failing test instead of silent
//      empty exports.
//
// HARD CONSTRAINT — NO NETWORK. This module never fetches anything. It only
// reads a `document` that already exists. Darts Atlas's Terms of Use forbid
// automated/robotic retrieval including monitoring; manual retrieval of a
// reasonable number of pages for personal use is allowed. That is exactly the
// posture here: a human loads the page, a human clicks the bookmarklet.
//
// AUTHORING CONSTRAINT — this file is inlined into a `javascript:` URL. Keep it
// dependency-free (no imports), ES5-safe-ish (no top-level await, no optional
// chaining on the left of assignment) and free of backticks in string content
// that would break the template wrapper. `export` keywords are stripped by the
// build script.

export const EXTRACT_VERSION = '1.0.0';
export const PAYLOAD_SCHEMA = 1;

const MONTHS = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
};

// ---------------------------------------------------------------------------
// small helpers
// ---------------------------------------------------------------------------

/** Collapsed, trimmed text content of an element (null-safe). */
export function txt(el) {
  if (!el) return '';
  return String(el.textContent || '').replace(/\s+/g, ' ').trim();
}

/** Last path segment of an href, e.g. "/players/n6oeItIbK1vl" → "n6oeItIbK1vl". */
export function idFromHref(href, segment) {
  if (!href) return null;
  const m = String(href).match(new RegExp('/' + segment + '/([^/?#]+)'));
  return m ? m[1] : null;
}

/** "#62" → 62 · "270" → 270 · "" → null. */
export function toInt(value) {
  if (value === null || value === undefined) return null;
  const m = String(value).replace(/[#,\s]/g, '').match(/-?\d+/);
  return m ? parseInt(m[0], 10) : null;
}

/** "72.99" → 72.99 · "" → null. */
export function toNum(value) {
  if (value === null || value === undefined) return null;
  const m = String(value).replace(/[#,\s]/g, '').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

/** "29-Jun, 2026" → "2026-06-29". Unparseable input → null. */
export function parseAtlasDate(raw) {
  if (!raw) return null;
  const m = String(raw).match(/(\d{1,2})-([A-Za-z]{3})[a-z]*,?\s*(\d{4})/);
  if (!m) return null;
  const mm = MONTHS[m[2].toLowerCase()];
  if (!mm) return null;
  return m[3] + '-' + mm + '-' + (m[1].length === 1 ? '0' + m[1] : m[1]);
}

/** "2026" + "Aug" + "03" → "2026-08-03". */
export function buildDate(year, monthAbbr, day) {
  const y = String(year || '').trim();
  const mm = MONTHS[String(monthAbbr || '').trim().toLowerCase().slice(0, 3)];
  const d = String(day || '').trim();
  if (!/^\d{4}$/.test(y) || !mm || !/^\d{1,2}$/.test(d)) return null;
  return y + '-' + mm + '-' + (d.length === 1 ? '0' + d : d);
}

// Canonical stat keys. Anything not listed falls back to a camelCased label, so
// a new Darts Atlas stat still lands in the export instead of being dropped.
const LABEL_KEYS = {
  'Rank': 'rank',
  'Points': 'points',
  'Average': 'average',
  'First 9': 'first9',
  'Match Wins': 'matchWins',
  'Match Losses': 'matchLosses',
  'Wins': 'wins',
  'Losses': 'losses',
  'Titles': 'titles',
  'Finals': 'finals',
  'Semi-Finals': 'semiFinals',
  '100+': 'scores100Plus',
  '140+': 'scores140Plus',
  '180': 'scores180',
  'Legs Won': 'legsWon',
  'Legs Lost': 'legsLost',
  'Breaks': 'breaks',
  'Result': 'result',
};

// Stats that stay strings; everything else is coerced to a number.
const TEXT_STATS = { result: true };
// Stats that are integers even though they arrive with a "#".
const INT_STATS = {
  rank: true, points: true, matchWins: true, matchLosses: true, wins: true,
  losses: true, titles: true, finals: true, semiFinals: true,
  scores100Plus: true, scores140Plus: true, scores180: true,
  legsWon: true, legsLost: true, breaks: true,
};

export function normalizeLabel(label) {
  const clean = String(label || '').replace(/\s+/g, ' ').trim();
  if (LABEL_KEYS[clean]) return LABEL_KEYS[clean];
  return clean
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, function (_, c) { return c.toUpperCase(); })
    .replace(/[^a-zA-Z0-9]/g, '');
}

export function coerceStat(key, raw) {
  if (TEXT_STATS[key]) return String(raw).trim();
  if (INT_STATS[key]) return toInt(raw);
  const n = toNum(raw);
  return n === null ? String(raw).trim() : n;
}

/**
 * Reads a `div.event-box-score` block. Darts Atlas renders every figure as
 * `<li><label>Name</label><strong>Value</strong></li>`, grouped into
 * semantically meaningless `<ul>`s — so we read them flat, by label.
 * A `<label>` wrapping a `/regions/...` link is a region rank, not a stat.
 */
export function readBoxScore(box) {
  const stats = {};
  const regionRanks = [];
  if (!box) return { stats: stats, regionRanks: regionRanks };
  const items = box.querySelectorAll('li');
  for (let i = 0; i < items.length; i++) {
    const li = items[i];
    const labelEl = li.querySelector('label');
    const strong = li.querySelector('strong');
    if (!labelEl || !strong) continue; // sanction tag / "Full Details" link
    const regionLink = labelEl.querySelector('a[href^="/regions/"]');
    if (regionLink) {
      regionRanks.push({
        regionId: idFromHref(regionLink.getAttribute('href'), 'regions'),
        regionName: txt(regionLink),
        rank: toInt(txt(strong)),
      });
      continue;
    }
    const key = normalizeLabel(txt(labelEl));
    if (!key) continue;
    stats[key] = coerceStat(key, txt(strong));
  }
  return { stats: stats, regionRanks: regionRanks };
}

/** Everything on the card's class list that isn't structural chrome. */
function statusClasses(el) {
  const skip = { standing: 1, event: 1, card: 1, 'league-standing': 1, tournament: 1, themed: 1, 'event-date-banner': 1 };
  const out = [];
  const list = String(el.getAttribute('class') || '').split(/\s+/);
  for (let i = 0; i < list.length; i++) {
    const c = list[i].trim();
    if (c && !skip[c]) out.push(c);
  }
  return out;
}

function absUrl(href, base) {
  if (!href) return null;
  if (/^https?:/i.test(href)) return href;
  return base.replace(/\/+$/, '') + href;
}

// ---------------------------------------------------------------------------
// page detection
// ---------------------------------------------------------------------------

/**
 * detectPage(href) → { pageType, playerId, tournamentId, page, status }
 * pageType is one of 'rankings' | 'tournaments' | 'tournament_stats' | null.
 * `null` means "the bookmarklet was clicked on a page it does not handle".
 */
export function detectPage(href) {
  const url = String(href || '');
  const path = url.replace(/^https?:\/\/[^/]+/i, '').split('#')[0];
  const [pathname, query] = path.split('?');
  const params = {};
  if (query) {
    const parts = query.split('&');
    for (let i = 0; i < parts.length; i++) {
      const kv = parts[i].split('=');
      params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    }
  }
  const page = toInt(params.page) || 1;

  let m = pathname.match(/^\/players\/([^/]+)\/rankings\/?$/);
  if (m) {
    return {
      pageType: 'rankings',
      playerId: m[1],
      tournamentId: null,
      page: page,
      status: params.status === 'history' ? 'history' : 'active',
    };
  }
  m = pathname.match(/^\/players\/([^/]+)\/tournaments\/?$/);
  if (m) {
    return { pageType: 'tournaments', playerId: m[1], tournamentId: null, page: page, status: null };
  }
  m = pathname.match(/^\/tournaments\/([^/]+)\/player_stats\/([^/]+)\/?$/);
  if (m) {
    return { pageType: 'tournament_stats', playerId: m[2], tournamentId: m[1], page: 1, status: null };
  }
  return { pageType: null, playerId: null, tournamentId: null, page: 1, status: null };
}

// ---------------------------------------------------------------------------
// per-page extractors
// ---------------------------------------------------------------------------

function extractPlayer(doc, fallbackId) {
  const link = doc.querySelector('a.user.name-and-photo[href^="/players/"]');
  const id = link ? idFromHref(link.getAttribute('href'), 'players') : null;
  return {
    id: id || fallbackId || null,
    name: link ? txt(link.querySelector('span')) || txt(link) : null,
  };
}

/**
 * Pagination, across both paginators Darts Atlas uses:
 *   rankings   → <nav class="pagy nav">   (aria-current="page" marks current)
 *   tournaments→ <div class="pagination"> (<em class="current"> marks current)
 * Returns { current, pages, nextPath, totalPages } — informational only. The
 * importer uses it to TELL SANDER which pages he has not captured yet. Nothing
 * here ever triggers a fetch.
 */
export function extractPagination(doc, fallbackPage) {
  const nav = doc.querySelector('nav.pagy, div.pagination, nav.pagination');
  if (!nav) return { current: fallbackPage || 1, pages: [fallbackPage || 1], nextPath: null, totalPages: 1 };
  const pages = [];
  const nodes = nav.querySelectorAll('a, em, span');
  let current = null;
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const label = txt(n);
    if (!/^\d+$/.test(label)) continue;
    const num = parseInt(label, 10);
    if (pages.indexOf(num) === -1) pages.push(num);
    const isCurrent =
      n.getAttribute('aria-current') === 'page' ||
      String(n.getAttribute('class') || '').split(/\s+/).indexOf('current') !== -1;
    if (isCurrent) current = num;
  }
  const nextEl = nav.querySelector('a[rel="next"]');
  pages.sort(function (a, b) { return a - b; });
  return {
    current: current || fallbackPage || 1,
    pages: pages.length ? pages : [fallbackPage || 1],
    nextPath: nextEl ? nextEl.getAttribute('href') : null,
    totalPages: pages.length ? pages[pages.length - 1] : 1,
  };
}

/** /players/<id>/rankings → league standings + season standings. */
export function extractRankings(doc) {
  const out = [];
  const cards = doc.querySelectorAll('article.standing');
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const box = readBoxScore(card.querySelector('.event-box-score'));
    const leagueLink = card.querySelector('a.league[href^="/o/"]');
    const leagueId = leagueLink ? idFromHref(leagueLink.getAttribute('href'), 'o') : null;
    const leagueName = leagueLink ? txt(leagueLink.querySelector('span')) || txt(leagueLink) : null;
    const seasonLink = card.querySelector('h2 a[href^="/seasons/"]');
    const isLeague = String(card.getAttribute('class') || '').indexOf('league-standing') !== -1;

    if (isLeague || !seasonLink) {
      if (!leagueId) continue;
      out.push({
        kind: 'league-standing',
        key: 'league:' + leagueId,
        leagueId: leagueId,
        leagueName: leagueName,
        leaguePath: leagueLink ? leagueLink.getAttribute('href') : null,
        status: statusClasses(card),
        stats: box.stats,
        regionRanks: box.regionRanks,
      });
      continue;
    }

    const seasonId = idFromHref(seasonLink.getAttribute('href'), 'seasons');
    const periodRaw = txt(card.querySelector('p'));
    const halves = periodRaw.split(/\s+-\s+|\s+–\s+/);
    out.push({
      kind: 'season-standing',
      key: 'season:' + seasonId,
      seasonId: seasonId,
      seasonName: txt(seasonLink),
      seasonPath: seasonLink.getAttribute('href'),
      leagueId: leagueId,
      leagueName: leagueName,
      leaguePath: leagueLink ? leagueLink.getAttribute('href') : null,
      period: {
        raw: periodRaw || null,
        start: parseAtlasDate(halves[0] || ''),
        end: parseAtlasDate(halves[1] || ''),
      },
      status: statusClasses(card),
      stats: box.stats,
      regionRanks: box.regionRanks,
    });
  }
  return out;
}

/** /players/<id>/tournaments → one record per played tournament. */
export function extractTournaments(doc) {
  const out = [];
  const cards = doc.querySelectorAll('article.tournament');
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const nameLink = card.querySelector('h2 a[href^="/tournaments/"]');
    const tournamentId =
      idFromHref(nameLink ? nameLink.getAttribute('href') : '', 'tournaments') ||
      String(card.getAttribute('id') || '').replace(/^tournament_/, '') ||
      null;
    if (!tournamentId) continue;

    const banner = card.querySelector('.event-date-banner');
    const date = banner
      ? buildDate(
          txt(banner.querySelector('.year')),
          txt(banner.querySelector('.month-and-day span')),
          txt(banner.querySelector('.month-and-day strong')),
        )
      : null;

    const leagueLink = card.querySelector('a.league[href^="/o/"]');
    const box = readBoxScore(card.querySelector('.event-box-score'));

    // Sanction points render as a tag ("4 Points"), not as a label/value pair.
    let points = null;
    const sanction = card.querySelector('.sanction-result');
    if (sanction) {
      const m = txt(sanction).match(/(\d+)\s*Points?/i);
      if (m) points = parseInt(m[1], 10);
    }

    const statsLink = card.querySelector('.full-stats-link a');
    const result = box.stats.result || null;
    delete box.stats.result;

    out.push({
      kind: 'tournament',
      key: 'tournament:' + tournamentId,
      tournamentId: tournamentId,
      name: nameLink ? txt(nameLink) : null,
      tournamentPath: nameLink ? nameLink.getAttribute('href') : '/tournaments/' + tournamentId,
      date: date,
      leagueId: leagueLink ? idFromHref(leagueLink.getAttribute('href'), 'o') : null,
      leagueName: leagueLink ? txt(leagueLink.querySelector('span')) || txt(leagueLink) : null,
      leaguePath: leagueLink ? leagueLink.getAttribute('href') : null,
      result: result,
      points: points,
      status: banner ? statusClasses(banner) : [],
      stats: box.stats,
      statsPath: statsLink ? statsLink.getAttribute('href') : null,
    });
  }
  return out;
}

/** /tournaments/<tid>/player_stats/<pid> → the per-tournament detail + matches. */
export function extractTournamentStats(doc, ctx) {
  const titleLink = doc.querySelector('h1 a[href^="/tournaments/"]');
  const tournamentId =
    idFromHref(titleLink ? titleLink.getAttribute('href') : '', 'tournaments') ||
    (ctx && ctx.tournamentId) ||
    null;
  if (!tournamentId) return [];

  const box = readBoxScore(doc.querySelector('.event-box-score'));
  const me = extractPlayer(doc, ctx && ctx.playerId);
  const myName = String(me.name || '').replace(/\s+/g, ' ').trim().toLowerCase();

  const matches = [];
  const rows = doc.querySelectorAll('a.box-score');
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const roundSpans = row.querySelectorAll('.match-round span');
    const sides = [];
    const players = row.querySelectorAll('.name-and-score .player');
    for (let p = 0; p < players.length; p++) {
      const sp = players[p];
      const cls = String(sp.getAttribute('class') || '');
      const slot = cls.indexOf('player-1') !== -1 ? 'player-1' : 'player-2';
      const avgEl = row.querySelector('.averages .' + slot);
      sides.push({
        slot: slot,
        name: txt(sp.querySelector('.name')),
        score: toInt(txt(sp.querySelector('.score'))),
        average: avgEl ? toNum(txt(avgEl)) : null,
        won: cls.indexOf('won') !== -1,
      });
    }
    if (sides.length !== 2) continue;
    let mine = sides[0];
    let theirs = sides[1];
    for (let s = 0; s < sides.length; s++) {
      if (String(sides[s].name).toLowerCase() === myName) {
        mine = sides[s];
        theirs = sides[1 - s];
      }
    }
    matches.push({
      matchId: idFromHref(row.getAttribute('href'), 'matches'),
      matchPath: row.getAttribute('href'),
      round: roundSpans.length ? txt(roundSpans[0]) : null,
      format: roundSpans.length > 1 ? txt(roundSpans[1]) : null,
      playerName: mine.name,
      playerScore: mine.score,
      playerAverage: mine.average,
      opponentName: theirs.name,
      opponentScore: theirs.score,
      opponentAverage: theirs.average,
      won: !!mine.won,
    });
  }

  return [{
    kind: 'tournament-stats',
    key: 'tournament:' + tournamentId,
    tournamentId: tournamentId,
    name: titleLink ? txt(titleLink) : null,
    tournamentPath: titleLink ? titleLink.getAttribute('href') : '/tournaments/' + tournamentId,
    stats: box.stats,
    matches: matches,
  }];
}

// ---------------------------------------------------------------------------
// the envelope
// ---------------------------------------------------------------------------

/**
 * extractFromDocument(doc, href) → export envelope (the JSON the bookmarklet
 * downloads and import-exports.mjs consumes).
 *
 * Throws nothing: an unsupported page returns an envelope with pageType null and
 * zero records, so the bookmarklet can show a friendly "not a supported page".
 */
export function extractFromDocument(doc, href) {
  const ctx = detectPage(href);
  const origin = String(href || '').match(/^https?:\/\/[^/]+/i);
  const base = origin ? origin[0] : 'https://www.dartsatlas.com';

  let records = [];
  if (ctx.pageType === 'rankings') records = extractRankings(doc);
  else if (ctx.pageType === 'tournaments') records = extractTournaments(doc);
  else if (ctx.pageType === 'tournament_stats') records = extractTournamentStats(doc, ctx);

  const pagination =
    ctx.pageType === 'rankings' || ctx.pageType === 'tournaments'
      ? extractPagination(doc, ctx.page)
      : { current: 1, pages: [1], nextPath: null, totalPages: 1 };

  return {
    source: 'dartsatlas',
    schema: PAYLOAD_SCHEMA,
    extractVersion: EXTRACT_VERSION,
    capturedAt: new Date().toISOString(),
    sourceUrl: href || null,
    origin: base,
    pageType: ctx.pageType,
    view: { status: ctx.status, page: ctx.page },
    player: extractPlayer(doc, ctx.playerId),
    tournamentId: ctx.tournamentId,
    pagination: {
      current: pagination.current,
      totalPages: pagination.totalPages,
      pages: pagination.pages,
      nextUrl: absUrl(pagination.nextPath, base),
    },
    recordCount: records.length,
    records: records,
  };
}

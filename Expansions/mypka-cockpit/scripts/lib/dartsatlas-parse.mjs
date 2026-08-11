// dartsatlas-parse.mjs — pure HTML → structured records parser for Darts Atlas
// player pages. NO network, NO filesystem: give it an HTML string, get records.
//
// WHY ZERO DEPENDENCIES
//   The cockpit's package.json ships a deliberately tiny dependency set
//   (better-sqlite3, express, imapflow, node-ical). Darts Atlas renders these
//   pages server-side with Rails and a very regular label/strong box-score
//   markup, so a ~200-line targeted parser is more honest here than pulling in
//   cheerio + its tree. If the markup ever gets irregular, swap the internals of
//   this file for cheerio — the exported functions are the contract.
//
// EXPORTS
//   parseRankings(html)    → { player, standings[] }
//   parseTournaments(html) → { player, tournaments[], nextPagePath }
//
// MARKUP CONTRACT (verified live 2026-08-10)
//   Rankings   : <article class="standing event card ... league-standing|in-progress|concluded">
//                  [<p>29-Jun, 2026 - 03-Aug, 2026</p>]           (season cards only)
//                  <h2><a href="/seasons/ID">Name</a></h2>        (season cards)
//                  <h2><a href="/o/ID">…<span>League</span></a></h2> (league card)
//                  <div class="event-box-score"> <li><label>X</label><strong>Y</strong></li> … </div>
//   Tournaments: <article class="tournament event card" id="tournament_ID">
//                  <div class="event-date-banner … concluded">
//                    <span class="year">2026</span>
//                    <span class="month-and-day"><span>Aug</span><strong>03</strong></span>
//                  <h2><a href="/tournaments/ID">Name</a></h2>
//                  <ul class="result">        → Result label
//                  <ul class="sanction-result"> → "<n> Points" (absent = no ranking points)
//                  <ul class="x01-average-stats"> → Average / First 9
//                  <div class="pagination"> <a rel="next" href="…?page=2">
//
// NOTE: there is no checkout% anywhere on these two pages. Do not invent one.

const BASE = 'https://www.dartsatlas.com';

const MONTHS = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
};

// ---------------------------------------------------------------- primitives

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  raquo: '»', laquo: '«', ndash: '–', mdash: '—', hellip: '…',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
};

export function decodeEntities(s) {
  if (!s) return '';
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, name) => NAMED_ENTITIES[name.toLowerCase()] ?? m);
}

export function text(html) {
  return decodeEntities(String(html ?? '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

/** "#62" → 62, "270" → 270, "" → null */
function toInt(v) {
  const m = String(v ?? '').replace(/[^\d-]/g, '');
  if (!m) return null;
  const n = Number.parseInt(m, 10);
  return Number.isFinite(n) ? n : null;
}

/** "72.99" → 72.99 */
function toFloat(v) {
  const m = String(v ?? '').match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number.parseFloat(m[0]);
  return Number.isFinite(n) ? n : null;
}

/** Slice out every top-level <article …>…</article> whose class matches. */
export function extractArticles(html, classNeedle) {
  const out = [];
  const open = /<article\b([^>]*)>/gi;
  let m;
  while ((m = open.exec(html)) !== null) {
    const attrs = m[1];
    if (classNeedle && !attrs.includes(classNeedle)) continue;
    const end = html.indexOf('</article>', open.lastIndex);
    if (end === -1) break;
    out.push({ attrs, inner: html.slice(open.lastIndex, end) });
  }
  return out;
}

/** All <label>…</label><strong>…</strong> pairs, in document order. */
export function labelStrongPairs(html) {
  const pairs = [];
  const re = /<label\b[^>]*>([\s\S]*?)<\/label>\s*<strong\b[^>]*>([\s\S]*?)<\/strong>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    pairs.push({ label: text(m[1]), value: text(m[2]), rawLabel: m[1] });
  }
  return pairs;
}

function attrOf(attrs, name) {
  const m = new RegExp(`${name}="([^"]*)"`, 'i').exec(attrs || '');
  return m ? decodeEntities(m[1]) : null;
}

function idFromHref(href, prefix) {
  if (!href) return null;
  const m = new RegExp(`${prefix}/([A-Za-z0-9_-]+)`).exec(href);
  return m ? m[1] : null;
}

function absolute(href) {
  if (!href) return null;
  return href.startsWith('http') ? href : BASE + href;
}

/** "29-Jun, 2026" → "2026-06-29" */
function parseDayMonYear(s) {
  const m = /(\d{1,2})-([A-Za-z]{3})[a-z]*,?\s*(\d{4})/.exec(s || '');
  if (!m) return null;
  const mm = MONTHS[m[2].toLowerCase()];
  if (!mm) return null;
  return `${m[3]}-${mm}-${String(m[1]).padStart(2, '0')}`;
}

// ------------------------------------------------------------------- player

function parsePlayer(html) {
  const m = /<a class="user name-and-photo"[^>]*href="\/players\/([A-Za-z0-9_-]+)"[\s\S]*?<span>([\s\S]*?)<\/span>/i.exec(html);
  if (!m) return { id: null, name: null, url: null };
  return { id: m[1], name: text(m[2]), url: `${BASE}/players/${m[1]}` };
}

function parseLeague(articleInner) {
  const m = /<a class="league name-and-photo"[^>]*href="(\/o\/[A-Za-z0-9_-]+)"[\s\S]*?<span>([\s\S]*?)<\/span>/i.exec(articleInner);
  if (!m) return { id: null, name: null, url: null };
  return { id: idFromHref(m[1], '/o'), name: text(m[2]), url: absolute(m[1]) };
}

// ----------------------------------------------------------------- rankings

// Canonical stat keys. Both "Wins" (season card) and "Match Wins" (league card)
// normalize onto the same key so downstream consumers see one vocabulary.
const STAT_KEYS = {
  'rank': 'rank',
  'points': 'points',
  'average': 'average',
  'first 9': 'first9',
  'match wins': 'wins',
  'wins': 'wins',
  'match losses': 'losses',
  'losses': 'losses',
  'titles': 'titles',
  'finals': 'finals',
  'semi-finals': 'semiFinals',
  '100+': 'scores100plus',
  '140+': 'scores140plus',
  '180': 'scores180',
};

const FLOAT_KEYS = new Set(['average', 'first9']);

export function parseRankings(html) {
  const player = parsePlayer(html);
  const standings = [];

  for (const { attrs, inner } of extractArticles(html, 'standing')) {
    const classes = attrOf(attrs, 'class') || '';
    const isLeague = /\bleague-standing\b/.test(classes);

    // Season cards carry a "29-Jun, 2026 - 03-Aug, 2026" (or open-ended) range.
    let periodStart = null;
    let periodEnd = null;
    const p = /<p>([\s\S]*?)<\/p>/i.exec(inner);
    if (p) {
      const raw = text(p[1]);
      const parts = raw.split(/\s*-\s*(?=\d{1,2}-[A-Za-z]{3})/);
      periodStart = parseDayMonYear(parts[0]);
      periodEnd = parts.length > 1 ? parseDayMonYear(parts[1]) : null;
    }

    const seasonLink = /<h2>\s*<a[^>]*href="(\/seasons\/[A-Za-z0-9_-]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(inner);
    const league = parseLeague(inner);

    const stats = {};
    let region = null;
    for (const { label, value, rawLabel } of labelStrongPairs(inner)) {
      const region_m = /href="(\/regions\/[A-Za-z0-9_-]+)"/i.exec(rawLabel);
      if (region_m) {
        region = { name: label, rank: toInt(value), url: absolute(region_m[1]) };
        continue;
      }
      const key = STAT_KEYS[label.toLowerCase()];
      if (!key) continue;
      stats[key] = FLOAT_KEYS.has(key) ? toFloat(value) : toInt(value);
    }

    let status = 'unknown';
    if (/\bin-progress\b/.test(classes)) status = 'in-progress';
    else if (/\bconcluded\b/.test(classes)) status = 'concluded';
    else if (isLeague) status = 'active';

    standings.push({
      type: isLeague ? 'league' : 'season',
      status,
      title: isLeague ? league.name : (seasonLink ? text(seasonLink[2]) : null),
      seasonId: seasonLink ? idFromHref(seasonLink[1], '/seasons') : null,
      url: seasonLink ? absolute(seasonLink[1]) : league.url,
      league,
      region,
      periodStart,
      periodEnd,
      rank: stats.rank ?? null,
      points: stats.points ?? null,
      average: stats.average ?? null,
      first9: stats.first9 ?? null,
      wins: stats.wins ?? null,
      losses: stats.losses ?? null,
      titles: stats.titles ?? null,
      finals: stats.finals ?? null,
      semiFinals: stats.semiFinals ?? null,
      scores100plus: stats.scores100plus ?? null,
      scores140plus: stats.scores140plus ?? null,
      scores180: stats.scores180 ?? null,
    });
  }

  return { player, standings };
}

// -------------------------------------------------------------- tournaments

export function parseTournaments(html) {
  const player = parsePlayer(html);
  const tournaments = [];

  for (const { attrs, inner } of extractArticles(html, 'tournament event card')) {
    const domId = attrOf(attrs, 'id') || '';
    const link = /<h2>\s*<a[^>]*href="(\/tournaments\/[A-Za-z0-9_-]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(inner);

    // Date banner: year + 3-letter month + day.
    let date = null;
    let eventStatus = null;
    const banner = /<div class="event-date-banner([^"]*)">([\s\S]*?)<\/div>/i.exec(inner);
    if (banner) {
      const cls = banner[1] || '';
      if (/\bconcluded\b/.test(cls)) eventStatus = 'concluded';
      else if (/\bin-progress\b/.test(cls)) eventStatus = 'in-progress';
      else if (/\bupcoming\b/.test(cls)) eventStatus = 'upcoming';
      const y = /<span class="year">\s*([\s\S]*?)\s*<\/span>/i.exec(banner[2]);
      const md = /<span class="month-and-day">\s*<span>\s*([A-Za-z]{3})[a-z]*\s*<\/span>\s*<strong>\s*(\d{1,2})\s*<\/strong>/i.exec(banner[2]);
      if (y && md) {
        const mm = MONTHS[md[1].toLowerCase()];
        if (mm) date = `${text(y[1])}-${mm}-${String(md[2]).padStart(2, '0')}`;
      }
    }

    // Result (Last 64 / Quarter-Final / Winner / …)
    let result = null;
    const resultBlock = /<ul class="result">([\s\S]*?)<\/ul>/i.exec(inner);
    if (resultBlock) {
      const pair = labelStrongPairs(resultBlock[1])[0];
      if (pair) result = pair.value;
    }

    // Ranking points — only present when the tournament awarded any.
    let points = null;
    const sanction = /<ul class="sanction-result">([\s\S]*?)<\/ul>/i.exec(inner);
    if (sanction) {
      const pm = /(\d+)\s*Points?/i.exec(text(sanction[1]));
      if (pm) points = Number.parseInt(pm[1], 10);
    }

    // Average / First 9
    let average = null;
    let first9 = null;
    const x01 = /<ul class="x01-average-stats">([\s\S]*?)<\/ul>/i.exec(inner);
    if (x01) {
      for (const { label, value } of labelStrongPairs(x01[1])) {
        if (/^average$/i.test(label)) average = toFloat(value);
        else if (/^first ?9$/i.test(label)) first9 = toFloat(value);
      }
    }

    const stats = /href="(\/tournaments\/[A-Za-z0-9_-]+\/player_stats\/[A-Za-z0-9_-]+)"/i.exec(inner);

    tournaments.push({
      id: domId.replace(/^tournament_/, '') || (link ? idFromHref(link[1], '/tournaments') : null),
      date,
      status: eventStatus,
      name: link ? text(link[2]) : null,
      url: link ? absolute(link[1]) : null,
      circuit: parseLeague(inner),
      result,
      points,
      average,
      first9,
      statsUrl: stats ? absolute(stats[1]) : null,
    });
  }

  // Pagination: <a rel="next" href="/players/…/tournaments?page=2">
  let nextPagePath = null;
  const next = /<a[^>]*\brel="next"[^>]*href="([^"]+)"/i.exec(html);
  if (next) nextPagePath = decodeEntities(next[1]);

  return { player, tournaments, nextPagePath };
}

export { BASE };

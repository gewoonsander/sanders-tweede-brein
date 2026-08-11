// dartsTypes.ts — the typed contract for /api/cockpit/darts.
//
// Mirrors the envelope shaped by server/dartsatlasApi.js, which reads
// data/dartsatlas/<player>/latest.json off disk (NOT mypka.db — this data never
// enters the SQLite mirror). Every field the scraper can leave out is `| null`,
// because Darts Atlas genuinely omits stats per competition type: a LEAGUE row
// has titles/finals but no 100+/140+/180 counts, a SEASON row has the scoring
// counts but no region rank. Nothing is invented to fill a gap.
//
// NOTE: there is deliberately no checkout-percentage field. Darts Atlas does not
// expose one in this payload, so the view must not display one.

/** A Darts Atlas organisation / circuit reference. */
export interface DartsCircuit {
  id: string | null;
  name: string | null;
  url: string | null;
}

/** Regional standing attached to a league row (e.g. rank 39 in the Netherlands). */
export interface DartsRegion {
  name: string | null;
  rank: number | null;
  url: string | null;
}

/** One ranking row: either the overall LEAGUE standing or a per-SEASON standing. */
export interface DartsStanding {
  /** 'league' = the overall circuit standing; 'season' = one season's table. */
  type: 'league' | 'season' | string | null;
  /** 'active' | 'in-progress' | 'concluded' as reported by Darts Atlas. */
  status: string | null;
  /** 'active' = current/live standings; 'history' = concluded seasons. */
  scope: 'active' | 'history' | string | null;
  title: string | null;
  seasonId: string | null;
  url: string | null;
  league: DartsCircuit | null;
  region: DartsRegion | null;
  periodStart: string | null;
  periodEnd: string | null;
  rank: number | null;
  points: number | null;
  average: number | null;
  first9: number | null;
  wins: number | null;
  losses: number | null;
  titles: number | null;
  finals: number | null;
  semiFinals: number | null;
  scores100plus: number | null;
  scores140plus: number | null;
  scores180: number | null;
}

/** One played tournament with the player's result and per-event averages. */
export interface DartsTournament {
  id: string | null;
  /** ISO date (YYYY-MM-DD). */
  date: string | null;
  status: string | null;
  name: string | null;
  url: string | null;
  circuit: DartsCircuit | null;
  /** e.g. 'Champion', 'Runner-Up', 'Semi-Final', 'Last 16', 'Group Stage'. */
  result: string | null;
  points: number | null;
  average: number | null;
  first9: number | null;
  statsUrl: string | null;
}

export interface DartsPlayer {
  id: string | null;
  name: string | null;
  url: string | null;
}

export interface DartsMeta {
  rankingsUrl?: string | null;
  tournamentsUrl?: string | null;
  pagesFetched?: string[] | null;
  tournamentPages?: number | null;
  standingsCount?: number | null;
  tournamentsCount?: number | null;
}

/** Why the module has nothing to show. Drives the empty-state copy. */
export type DartsUnavailableReason = 'no-data-file' | 'unreadable-json' | 'invalid-player-id';

export interface DartsProfileUnavailable {
  available: false;
  reason: DartsUnavailableReason;
  playerId: string | null;
  knownPlayers?: string[];
}

export interface DartsProfileAvailable {
  available: true;
  source: string;
  schemaVersion: number | null;
  /** When the SCRAPE ran, authored by the scraper and carried inside the file. */
  fetchedAt: string | null;
  /** When THIS machine's copy of latest.json last changed on disk. */
  fileMtime: string | null;
  playerId: string;
  player: DartsPlayer;
  standings: DartsStanding[];
  /** Newest first — ordered server-side. */
  tournaments: DartsTournament[];
  meta: DartsMeta | null;
  counts: { standings: number; tournaments: number };
}

export type DartsProfile = DartsProfileAvailable | DartsProfileUnavailable;

/** The player-profile discovery endpoint (/api/cockpit/darts/players). */
export interface DartsPlayersResponse {
  available: boolean;
  players: string[];
  defaultPlayer: string;
}

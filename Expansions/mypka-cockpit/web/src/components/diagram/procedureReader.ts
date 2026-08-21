// procedureReader.ts — "what shape does this procedure document have?", answered
// without knowing which document it is. Fase 2 of the diagram feature
// (tsk-2026-08-21-001).
//
// This module reads STRUCTURE and returns FACTS. It builds no nodes and makes no
// layout decisions — that is genericParser.ts's job. Keeping the two apart is
// what makes the heuristics testable: every rule below is a statement about
// markdown ("this heading is numbered", "this table's first column is a
// condition"), never about pixels.
//
// The heuristics were derived by reading all 34 SOPs and all 9 Workstreams in
// Team Knowledge/ and cataloguing how they actually write themselves down. They
// are ordered as a CASCADE, strongest structure first, so a document that has a
// §-split is never mistaken for a flat list and a document with nothing but
// prose still comes out the other end with something to draw.
import {
  arrowPairs,
  bulletItems,
  fencedBlocks,
  headingSections,
  orderedItems,
  plain,
  tableRows,
  type MdSection,
} from './markdownShapes';

// ---------------------------------------------------------------------------
// Document identity
// ---------------------------------------------------------------------------

/**
 * "SOP-013 — Inboxen verwerken" / "SOP: Security Audit" / "WS-004 — Facebook-
 * verslag na ADC-toernooi" → the bare title. Shared by the fase-1 converters and
 * the generic parser so a document is titled identically whichever one draws it.
 *
 * `body` must already have the frontmatter removed.
 */
export function documentTitle(body: string, fallback: string): string {
  const h1 = headingSections(body, 1)[0];
  if (!h1) return fallback;
  return plain(h1.heading).replace(/^(?:SOP|WS)[-\s]?\d*\s*[:—–-]\s*/, '').trim() || fallback;
}

// ---------------------------------------------------------------------------
// Heading vocabulary
// ---------------------------------------------------------------------------

/**
 * A numbered step heading. Covers every numbering dialect present in Team
 * Knowledge today:
 *   `## Stap 3 — Bestandsnaam controleren`   (SOP-013, and most Dutch SOPs)
 *   `### Phase 2 — Authorization audit`      (SOP-004, SOP-005)
 *   `### Step 4 — Plan + user approval`      (WS-002 and the English SOPs)
 *   `## Fase 1 — Brainstorm (design-first)`  (SOP-development-workflow, WS-004)
 *   `## Tier 0 - In-session capture`         (WS-005)
 *   `## 4. Kies de GTD-status`               (SOP-022)
 *   `### 5b. Assign the model tier (Jethro)` (SOP-001)
 *   `### 3.1 Agents (adds_agents)`           (WS-003, no separator at all)
 * The separator is optional because of that last form; the number is capped at
 * 99 below so a heading that merely opens with a year ("2026 in cijfers") is
 * not read as step 2026.
 */
const STEP_HEADING = /^(?:(Stap|Step|Fase|Phase|Tier)\s+)?(\d+(?:\.\d+)?[a-z]?)\s*[—–\-.:)]?\s+(.+)$/i;

/** `## §A — Claim a task` — the sub-procedure marker used by the task SOPs. */
const SUB_PROCEDURE = /^§\s*([A-Za-z0-9]+)\s*[—–\-.:]?\s*(.*)$/;

/** A heading that introduces the procedure itself rather than being a step. */
// No trailing \b: "Choreografie" would fail it (there is no word boundary
// between "choreograf" and "i"), and that heading is WS-007's entire procedure.
const PROCEDURE_HEADING =
  /^(procedure|de procedure|steps?|step[-\s]by[-\s]step|stappen|stappenplan|werkwijze|choreograf|proces|process|uitvoering)/i;

/** A heading that closes the procedure — becomes the diagram's `end` node. */
const END_HEADING =
  /^(output\b|definition of done|when done|wanneer klaar|afronding|oplevering|kwaliteitscontrole|definition-of-done)/i;

/**
 * A heading that describes what goes WRONG. Rendered as `warning` nodes hanging
 * off the end of the spine over dashed exception edges — the vocabulary fase 1
 * already established for non-primary paths.
 *
 * "Common mistakes" / "Veelgemaakte fouten" is deliberately NOT here: it is a
 * top-level section in 15 of the 34 SOPs (counted 2026-08-21) and it is advice
 * for the person WRITING the procedure, not a path through it. Including it
 * would end nearly half the diagrams with the same meaningless node.
 */
const EXCEPTION_HEADING =
  /^(rollback|foutbeleid|fouten en herstel|troubleshooting|valkuilen|waarschuwingen|known pitfall|pitfalls?|uitzondering|edge cases|failure)/i;

/**
 * Headings that are CONTEXT, not procedure. Only consulted by the weakest
 * fallback (sections mode) — every stronger rule already knows which headings
 * are steps, so a blocklist would only be a second chance to get it wrong.
 */
const NON_STEP_HEADING = new RegExp(
  '^(' +
    [
      'doel', 'purpose', 'scope', 'waarom dit bestaat',
      'trigger', 'triggers', 'trigger contract', 'trigger phrases',
      'input', 'inputs', 'benodigde input', 'inputs you need', 'voorwaarden',
      'vereisten', 'pre-?flight', 'pre-hired team', 'benodigdheden',
      'when this skill activates', 'when to ', 'when not to ', 'wanneer ',
      'what this ', 'wat deze ', 'what a ',
      'common mistakes', 'veelgemaakte fouten', 'anti-pattern',
      'gerelateerd', 'referenties', 'references', 'cross-references',
      'notities', 'changelog', 'worked example', 'voorbeeld', 'example',
      'hard rules', 'owner agency', 'eigenaarschap', 'performance budget',
      'severity ladder', 'verdict rules', 'findings format', 'outputformaat',
      'scheduled task', 'generiek voor', 'verhouding tot', 'voorgeschiedenis',
      'seizoens-urls', 'gearchiveerde', 'financi', 'wie mag',
      'two sub-procedures', 'three sub-procedures', 'two ways to do this',
      'the three tiers', 'the hard invariant', 'bronnen en bestemming',
      'handmatige invoer', 'reassignment', 'drift correction', 'rotatie',
    ].join('|') +
    ')',
  'i',
);

// ---------------------------------------------------------------------------
// Actors — who does a step
// ---------------------------------------------------------------------------

/**
 * The team roster, from AGENTS.md. It exists because "Penn" is only recognisable
 * as a specialist if you already know the team — no amount of grammar tells you
 * that "Penn writes the Journal entry" names an actor while "Source detection"
 * does not.
 *
 * It is NOT the only source: `owners:` in a Workstream's frontmatter and the
 * positional `<Name>:` form below both work for names that are not on this list,
 * so a newly hired specialist gets lanes without a code change. Keep this list
 * in step with [[Team/agent-index]] when the roster changes.
 */
export const TEAM_ROSTER: readonly string[] = [
  'Hermes', 'Jethro', 'Athena', 'Penn', 'Daedalus', 'Atlas', 'Harmonia',
  'Charta', 'Pixel', 'Bezalel', 'Argus', 'Nemesis', 'Martonny', 'Tonnymart',
  'Pieter Post', 'Dagobert Duck', 'Sander',
];

/**
 * Non-agent participants a Workstream can hand a step to. Written exactly as the
 * documents write them, so the lane label quotes the source rather than
 * interpreting it — "De gebruiker" is what WS-008 says, and turning that into
 * "Sander" would be an inference the document does not make.
 */
const ROLE_PHRASES: ReadonlyArray<{ re: RegExp; label: string }> = [
  { re: /\bde gebruiker\b/i, label: 'De gebruiker' },
  { re: /\bthe user\b/i, label: 'De gebruiker' },
];

/** `Daedalus: Dart Atlas data ophalen` / `— Jethro: merge agents` */
const LEADING_ACTOR = /(?:^|[—–-]\s*)([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s*:\s/;

export interface FindActorOptions {
  /** Names harvested from the document itself (a Workstream's `owners:`). */
  extra?: readonly string[];
  /**
   * Only accept a name that appears in the first few words — i.e. as the
   * SUBJECT of the step, not as something the step happens to mention.
   *
   * This exists because of a real false lane: WS-006's section
   * "Stijlregels (gebaseerd op Sander's eigen posts)" put Sander in a swimlane
   * of his own, when all the heading says is whose posts the rules were derived
   * from. "Review door Sander" and "Hermes receives the input" both survive the
   * window; "Lever het concept-bericht aan Hermes" correctly does not — Penn
   * performs that step, Hermes only receives it.
   */
  subjectOnly?: boolean;
}

/** How many leading words count as "the subject" under `subjectOnly`. */
const SUBJECT_WINDOW = 3;

/**
 * Who performs this step, or null when the document does not say.
 *
 * Never guesses: a step with no name in it returns null, and the caller decides
 * what to do with that (the swimlane parser calls the lane "Niet toegewezen").
 */
export function findActor(text: string, options: FindActorOptions = {}): string | null {
  const { extra = [], subjectOnly = false } = options;
  const full = plain(text);
  const clean = subjectOnly ? full.split(/\s+/).slice(0, SUBJECT_WINDOW).join(' ') : full;

  // 1. The explicit positional form. Strongest signal: the document is
  //    literally prefixing the step with a name and a colon.
  const positional = LEADING_ACTOR.exec(clean);
  if (positional) {
    const name = positional[1];
    if ([...TEAM_ROSTER, ...extra].some((n) => n === name)) return name;
  }

  // 2. Any known name, earliest occurrence wins ("Hermes receives the input").
  let best: { name: string; at: number } | null = null;
  for (const name of [...TEAM_ROSTER, ...extra]) {
    const at = clean.search(new RegExp(`\\b${escapeRe(name)}\\b`));
    if (at >= 0 && (!best || at < best.at)) best = { name, at };
  }
  if (best) return best.name;

  // 3. A named non-agent participant.
  for (const role of ROLE_PHRASES) if (role.re.test(clean)) return role.label;

  return null;
}

/**
 * `Capture the need (Hermes -> Jethro)` → who hands over to whom. Used for the
 * caption of a hand-off step, where naming only one of the two parties would be
 * actively misleading: `findActor` on that title returns "Hermes", but reading
 * "Stap 2 · Athena" above "Brief Athena for the research pass (Jethro ->
 * Athena)" tells you Athena performs a step she is in fact being briefed for.
 */
export function handoffPair(title: string): { from: string; to: string } | null {
  const m = /\b([A-Z][a-z]+)\s*(?:->|→|=>)\s*([A-Z][a-z]+)/.exec(plain(title));
  return m ? { from: m[1], to: m[2] } : null;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Names listed under `owners:` in the frontmatter, in either YAML shape:
 *   owners: [Hermes, Penn, Daedalus]
 *   owners:
 *     - Hermes (orchestrator)
 * The parenthetical role note is dropped — it describes the owner, it is not
 * part of the name.
 */
export function ownersFromFrontmatter(fm: string): string[] {
  const flow = /^owners:\s*\[(.+)\]\s*$/m.exec(fm);
  if (flow) return flow[1].split(',').map(cleanOwner).filter(Boolean);

  const block = /^owners:\s*$/m.exec(fm);
  if (!block) return [];
  const out: string[] = [];
  const lines = fm.slice(block.index).split(/\r?\n/).slice(1);
  for (const line of lines) {
    const m = /^\s+-\s+(.+)$/.exec(line);
    if (!m) break;
    const name = cleanOwner(m[1]);
    if (name) out.push(name);
  }
  return out;
}

function cleanOwner(raw: string): string {
  return raw.replace(/\(.*$/, '').replace(/["']/g, '').trim();
}

// ---------------------------------------------------------------------------
// The reading
// ---------------------------------------------------------------------------

export type ProcedureMode = 'sub-procedures' | 'headings' | 'ordered' | 'sections' | 'bullets' | 'none';

export interface ProcStep {
  /** "Stap 3", "Fase 1", "§A", or a section name. Rendered as the caption. */
  marker: string;
  /** The step's own text. Rendered as the card label (shortened downstream). */
  title: string;
  /** Everything under the step. Scanned for tables, arrows and actors. */
  body: string;
  /** Whether the marker came from Fase/Phase numbering — drives the shape name. */
  phased?: boolean;
}

export interface SubProcedure {
  /** "§A" */
  marker: string;
  /** "Claim a task" */
  title: string;
  steps: ProcStep[];
}

export interface ProcedureReading {
  mode: ProcedureMode;
  /** Flat step list. Empty only in `sub-procedures` and `none` mode. */
  steps: ProcStep[];
  subProcedures: SubProcedure[];
  /** The H2 the steps were found under, when they came from H3s. */
  container: string | null;
  /** `## Output / definition of done` and friends, when present. */
  endSection: MdSection | null;
  /** Up to two `## Rollback` / `## Valkuilen` style sections. */
  exceptions: MdSection[];
  /** True when the numbering was Fase/Phase — a pipeline, not a checklist. */
  phased: boolean;
}

/** Parse one heading into a step, or null when it is not a numbered step. */
function asStep(section: MdSection): ProcStep | null {
  const heading = plain(section.heading);
  const m = STEP_HEADING.exec(heading);
  if (!m) return null;
  const [, keyword, num, rest] = m;
  // Bare numbers above 99 are years, versions or counts — not step numbers.
  if (!keyword && Number.parseFloat(num) > 99) return null;
  const kw = (keyword ?? '').toLowerCase();
  const phased = kw === 'fase' || kw === 'phase';
  const marker = phased ? `Fase ${num}` : kw === 'tier' ? `Tier ${num}` : `Stap ${num}`;
  return { marker, title: rest.trim(), body: section.body, phased };
}

/** Every numbered step among these sections, in document order. */
function numberedSteps(sections: MdSection[]): ProcStep[] {
  return sections.map(asStep).filter((s): s is ProcStep => s !== null);
}

/**
 * The cascade. Returns the strongest structure the document actually has.
 *
 * `body` must already have the frontmatter removed — every reader here is
 * fence-aware, but none of them is frontmatter-aware.
 */
export function readProcedure(body: string): ProcedureReading {
  const h2 = headingSections(body, 2);

  const endSection = h2.find((s) => END_HEADING.test(plain(s.heading))) ?? null;
  const exceptions = h2.filter((s) => EXCEPTION_HEADING.test(plain(s.heading))).slice(0, 2);

  const base = { subProcedures: [], container: null, endSection, exceptions, phased: false };

  // --- 0. §A / §B / §C sub-procedures --------------------------------------
  // One § is a footnote (WS-002 has exactly one); two or more is a document
  // that genuinely splits into parallel procedures.
  const subSections = h2.filter((s) => SUB_PROCEDURE.test(plain(s.heading)));
  if (subSections.length >= 2) {
    const subProcedures = subSections.map((s) => {
      const m = SUB_PROCEDURE.exec(plain(s.heading)) as RegExpExecArray;
      const h3 = headingSections(s.body, 3);
      // A §'s steps are, in order of preference: its `### Steps` ordered list,
      // any ordered list it has, its own H3 subsections, or — for a § that is
      // pure prose, like SOP-list-open-tasks §A — its bullets. A § that yields
      // nothing still gets a head card; an empty column is honest, a dropped
      // sub-procedure is not.
      const stepsSection = h3.find((x) => PROCEDURE_HEADING.test(plain(x.heading)));
      const ordered = orderedItems(stepsSection?.body ?? s.body);
      let steps: ProcStep[];
      if (ordered.length >= 2) {
        steps = ordered.map((item, i) => ({ marker: `Stap ${i + 1}`, title: item, body: '' }));
      } else if (h3.length > 0) {
        steps = h3.map((x) => ({ marker: 'Onderdeel', title: plain(x.heading), body: x.body }));
      } else {
        steps = bulletItems(s.body)
          .slice(0, 8)
          .map((item, i) => ({ marker: `Punt ${i + 1}`, title: item, body: '' }));
      }
      return { marker: `§${m[1]}`, title: m[2].trim() || plain(s.heading), steps };
    });
    return { ...base, mode: 'sub-procedures', steps: [], subProcedures };
  }

  // --- 1. Numbered H2 headings ---------------------------------------------
  const steps2 = numberedSteps(h2);
  if (steps2.length >= 2) {
    return { ...base, mode: 'headings', steps: steps2, phased: steps2.every((s) => s.phased) };
  }

  // --- 2. Numbered H3 headings inside their container H2 --------------------
  let best: { container: string; steps: ProcStep[] } | null = null;
  for (const section of h2) {
    const steps3 = numberedSteps(headingSections(section.body, 3));
    if (steps3.length >= 2 && (!best || steps3.length > best.steps.length)) {
      best = { container: plain(section.heading), steps: steps3 };
    }
  }
  if (best) {
    return {
      ...base,
      mode: 'headings',
      steps: best.steps,
      container: best.container,
      phased: best.steps.every((s) => s.phased),
    };
  }

  // --- 3. An ordered list under a "Procedure"-ish heading -------------------
  for (const section of h2) {
    if (!PROCEDURE_HEADING.test(plain(section.heading))) continue;
    const items = orderedItems(section.body);
    if (items.length < 3) continue;
    return {
      ...base,
      mode: 'ordered',
      container: plain(section.heading),
      steps: items.map((item, i) => ({ marker: `Stap ${i + 1}`, title: item, body: '' })),
    };
  }

  // --- 4. Plain H2 sections, minus the context ones -------------------------
  // The graceful degrade the task asks for: a document with no numbering at all
  // still reads as the sequence of things it talks about, in the order it talks
  // about them. A section that HAS an ordered list is expanded into it, because
  // that list is the real procedure and the heading is only its name.
  const kept = h2.filter(
    (s) =>
      !NON_STEP_HEADING.test(plain(s.heading)) &&
      s !== endSection &&
      !exceptions.includes(s) &&
      plain(s.heading).length > 0,
  );
  if (kept.length > 0) {
    const steps: ProcStep[] = [];
    for (const section of kept) {
      const name = plain(section.heading);
      const items = orderedItems(section.body);
      if (items.length >= 2) {
        // The caption is a nowrap single line on a 200px card, so the section
        // name is clipped here rather than by CSS — an ellipsis mid-caption
        // reads as a truncation, which is exactly what it is.
        const short = name.length > 22 ? `${name.slice(0, 21).trimEnd()}…` : name;
        items.forEach((item, i) => steps.push({ marker: `${short} ${i + 1}`, title: item, body: '' }));
      } else {
        steps.push({ marker: 'Sectie', title: name, body: section.body });
      }
    }
    return { ...base, mode: 'sections', steps };
  }

  // --- 5. Nothing but bullets ----------------------------------------------
  // Last resort, and capped hard: a document with no headings worth keeping is
  // being read as its own bullet list, and past a dozen cards that stops being a
  // diagram and becomes the document retyped.
  const bullets = bulletItems(body);
  if (bullets.length >= 2) {
    return {
      ...base,
      mode: 'bullets',
      steps: bullets.slice(0, 12).map((item, i) => ({ marker: `Punt ${i + 1}`, title: item, body: '' })),
    };
  }

  return { ...base, mode: 'none', steps: [] };
}

// ---------------------------------------------------------------------------
// Decision detection
// ---------------------------------------------------------------------------

export interface Route {
  when: string;
  dest: string;
}

/**
 * The vocabulary a condition column uses. Deliberately narrow: Team Knowledge is
 * full of REFERENCE tables (`| Column | Source |`, `| Veld | Waarde |`,
 * `| Input | Required | Notes |`) and fanning one of those out would turn
 * SOP-002's 40-row schema map into 40 branch cards. A table only becomes a
 * decision when it says, in its own header, that it maps a situation to an
 * action.
 */
const CONDITION_COLUMN =
  /^(type|situatie|situation|geval|scenario|conditie|als|wanneer|when|user says|trigger|content shape|vraag|bevinding|antwoord|keuze|source shape|soort)\b/i;
const ACTION_COLUMN =
  /^(route|actie|action|behaviour|behavior|gedrag|dan|then|layout|bestemming|destination|gevolg|vervolg|uitkomst|handeling|next)\b/i;

/** Above this a fan-out stops being a decision and starts being a catalogue. */
const MAX_ROUTES = 8;

/**
 * The routes a step branches into, or null when it does not branch.
 *
 * Two sources, in order: a two-column decision table, then a fenced block of
 * `Label → Destination` lines (the shape SOP-013's Vraag B/C use).
 */
export function decisionRoutes(stepBody: string): Route[] | null {
  const rows = tableRows(stepBody);
  if (rows.length >= 3 && rows.length <= MAX_ROUTES + 1 && rows.every((r) => r.length === 2)) {
    const header = rows[0];
    const data = rows.slice(1);
    const arrowy = data.filter((r) => r[1].includes('→')).length >= Math.ceil(data.length / 2);
    if (CONDITION_COLUMN.test(plain(header[0])) || ACTION_COLUMN.test(plain(header[1])) || arrowy) {
      return data.map((r) => ({ when: r[0], dest: r[1].replace(/^→\s*/, '') }));
    }
  }

  for (const block of fencedBlocks(stepBody)) {
    const pairs = arrowPairs(block);
    if (pairs.length >= 2) {
      return pairs.slice(0, MAX_ROUTES).map((p) => ({ when: p.left, dest: p.right }));
    }
  }
  return null;
}

/**
 * Does this step ASK something rather than do something? A question mark, or a
 * wait-for-approval gate, is the whole tell. Both are branch points even when
 * the document does not enumerate the branches.
 *
 * The title is scanned loosely and the BODY only for phrases that unambiguously
 * mean "this step waits". Scanning the body loosely made SOP-001's "Refresh and
 * verify the Cockpit roster" a decision, on the strength of an opening clause
 * ("After the user approves…") that describes a precondition already met, not a
 * gate this step is standing at.
 */
const GATE_IN_TITLE =
  /\b(goedkeuring|keurt .{0,24}goed|approval|wacht op|confirm with the user|approve)/i;
const GATE_IN_BODY =
  /\b(wacht op goedkeuring|wait for approval|pas na goedkeuring|awaiting approval|approval gate|only after the user approves)/i;

export function isDecisionStep(title: string, body: string): boolean {
  const t = plain(title);
  if (t.endsWith('?')) return true;
  if (GATE_IN_TITLE.test(t)) return true;
  return GATE_IN_BODY.test(plain(body).slice(0, 400));
}

/**
 * A step that hands the work to someone else. Two tells, both written by the
 * document itself: an explicit `A -> B` in the heading (`### 2. Brief Athena for
 * the research pass (Jethro -> Athena)`), or a hand-off verb.
 *
 * Merely NAMING an actor is not enough — SOP-001 tags all ten of its steps
 * "(Jethro)", and those are steps Jethro performs, not ten hand-offs.
 */
const HANDOFF_ARROW = /\b[A-Z][a-z]+\s*(?:->|→|=>)\s*[A-Za-z]/;

/**
 * Title only, deliberately. Scanning the body turned SOP-001's "Add the row to
 * agent-index" into a hand-off, because the paragraph under it explains which
 * user inputs should "route to them" — a sentence about the roster, not about
 * this step. A wrong glyph is a false statement; a neutral one is merely quiet,
 * so the miss is the cheaper error.
 */
export function isHandoffStep(title: string): boolean {
  const t = plain(title);
  if (HANDOFF_ARROW.test(t)) return true;
  return /\b(hand off to|hands? off to|route(?:s|d)? (?:to|naar)|routeert? naar|draag(?:t)? over aan|delegeer|overdracht aan)\b/i.test(
    t,
  );
}

/** A step the document itself flags as a hard rule or a place to be careful. */
export function isWarningStep(title: string): boolean {
  return /(waarschuwing|let op|valkuil|pitfall|geen afwijking|verplicht|niet aankomen|hard gate|de gate|blokkeert)/i.test(
    plain(title),
  );
}

/** A step whose outcome destroys or removes something. */
export function isDestructiveStep(title: string): boolean {
  return /(verwijder|uninstall|wipe|destructief|destructive|rip out|delete)/i.test(plain(title));
}

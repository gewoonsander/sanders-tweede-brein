// genericParser.ts — markdown → DiagramSpec for ANY SOP or Workstream.
// Fase 2 of the diagram feature (tsk-2026-08-21-001).
//
// Fase 1 shipped three converters that each knew their own document by heart.
// This module knows none of them. It asks procedureReader.ts what structure the
// document has and draws that, which is why it works on all 34 SOPs and all 9
// Workstreams without a per-document line of code.
//
// Two contracts it keeps, both non-negotiable:
//
//   1. NEVER CRASH, NEVER EMPTY. Every entry point is wrapped by
//      sopDiagrams.buildDiagramSpec's try/catch, and every path in here either
//      returns a spec with a start node and at least one step, or returns null
//      (which hides the button — a missing diagram, never a wrong one).
//
//   2. NEVER INVENT. Every label, caption and route on the canvas is text the
//      document actually contains. The parser decides SHAPE; the document
//      supplies WORDS. Where the source does not name who performs a step, the
//      lane is called "Niet toegewezen" rather than guessed at.
//
// Layout convention, inherited from fase 1: the spine runs down column 0 and
// anything that branches off it fans right, one row per branch. Rows come from
// one monotonically increasing counter, so two cards can never share a cell.
import type { DiagramNode, DiagramNodeKind, DiagramShape, DiagramSpec } from './diagramTypes';
import {
  bulletItems,
  firstClause,
  frontmatterBlock,
  headingSections,
  plain,
  sentenceCase,
  shortLabel,
  withoutFrontmatter,
} from './markdownShapes';
import { SpecBuilder } from './specBuilder';
import {
  decisionRoutes,
  documentTitle,
  findActor,
  handoffPair,
  isDecisionStep,
  isDestructiveStep,
  isHandoffStep,
  isWarningStep,
  ownersFromFrontmatter,
  readProcedure,
  type ProcStep,
  type ProcedureReading,
} from './procedureReader';

/** Beyond this a diagram stops being readable and starts being a wall. */
const MAX_STEPS = 40;
/** Steps shown per §-lane in sub-procedure mode. */
const MAX_SUB_STEPS = 12;

/** `SOP-021-audit-pkm-graafhygiene.md` → `Audit pkm graafhygiene`. */
function titleFromId(id: string): string {
  const words = id.replace(/\.md$/i, '').replace(/^(?:SOP|WS)-[\w.]+-/i, '').replace(/-/g, ' ');
  return sentenceCase(words) || id;
}

/** The document's own one-line statement of what it is for, if it has one. */
function purposeOf(body: string): string {
  const section = headingSections(body, 2).find((s) =>
    /^(doel|purpose|wat dit is|what this is|waarom dit bestaat)\b/i.test(plain(s.heading)),
  );
  const source = section?.body ?? body;
  return firstClause(source, 220);
}

/**
 * Which signal a routing destination carries, read off the destination text so
 * the document stays the source of truth. Sibling of the fase-1 `routeKind` in
 * sopDiagrams.ts, kept SEPARATE on purpose: that one is tuned to SOP-013's
 * vocabulary and its output is Nemesis-signed-off, so widening it would quietly
 * change a diagram that has already passed the gate.
 */
function routeKind(text: string): DiagramNodeKind {
  if (/\b(verwijder|delete|wipe|weggooien|destructief)/i.test(text)) return 'error';
  if (/\b(twijfel|onduidelijk|uitzoeken|manual-review|interactief|gevoelig|financ|handmatig|vraag het|ask the user)/i.test(text)) {
    return 'warning';
  }
  if (findActor(text)) return 'handoff';
  return 'branch';
}

/**
 * Everything up to the first code fence.
 *
 * `orderedItems` folds a step's continuation lines into one string, and in the
 * task SOPs a step's continuation is very often a shell snippet — SOP-claim-task
 * step 2 came out as `Move the file. bash git mv "Team…`. The fence is the
 * boundary between the instruction and its example; the instruction is the
 * label, the example belongs in the prose below the canvas.
 */
function beforeCode(text: string): string {
  return text.split(/```|~~~/)[0].trim();
}

/** Trailing sentence punctuation reads as a typo on a card, not as grammar. */
function asCard(text: string): string {
  return sentenceCase(text.replace(/[.,;:\s]+$/, ''));
}

/**
 * A bold opening phrase, when the item uses one as its own headline —
 * `1. **Bepaal context.** Noteer apparaat en runtime…` (SOP-019, all eight
 * items) or `**Move the file.**` (SOP-claim-task). The author already decided
 * what the summary of that step is; taking it is more faithful than
 * re-deriving it, and it sidesteps `firstClause`'s minimum-length guard, which
 * refuses to cut "Bepaal context." because the clause is one character too
 * short.
 *
 * Rejected when the bold run is naming the ACTOR rather than headlining the
 * step. WS-007 writes `**Hermes** routeert de invoer` and, in its last item,
 * `**Hermes + Penn** voeren bij close-session…` — three words, so a word count
 * alone lets that one through and the card ends up reading "Hermes + Penn",
 * which says nothing about what happens.
 */
const ACTOR_LEAD_MAX = 24;

function boldLead(raw: string): string | null {
  const m = /^\s*\*\*(.+?)\*\*/.exec(raw);
  if (!m) return null;
  const lead = m[1].trim();
  const words = lead.split(/\s+/).length;
  if (words < 3 && lead.length < 14) return null;
  if (lead.length <= ACTOR_LEAD_MAX && findActor(lead, { subjectOnly: true })) return null;
  return lead;
}

/** What this step SAYS, cut to the clause that belongs on a card. */
function stepLabel(step: ProcStep, actor: string | null): string {
  const raw = beforeCode(step.title);
  const lead = step.body ? null : boldLead(raw);
  let text = plain(lead ?? raw);
  // The caption already carries the actor; repeating it on the card wastes one
  // of the two lines a card has ("Jethro: merge agents" → "Merge agents").
  if (actor) text = text.replace(new RegExp(`^${actor}(?:'s)?\\s*:\\s*`), '');
  // A heading is already a label; a folded list item is a sentence and needs
  // cutting at its first clause.
  return asCard(step.body || lead ? shortLabel(text, 56) : firstClause(text, 56));
}

function stepDetail(step: ProcStep): string {
  const own = plain(beforeCode(step.title));
  return step.body ? firstClause(step.body, 220) || own : own;
}

/**
 * The kind a spine step gets, decided in priority order.
 *
 * The text the signals are read from depends on WHERE the step came from, and
 * that distinction is the whole subtlety:
 *
 *   • A heading-derived step (`body` is non-empty) is scanned in FULL. A heading
 *     is short and entirely about its own step, and truncating it first lost
 *     SOP-020's gate — "…voer pas uit na goedkeuring" falls off the end of a
 *     56-character card label.
 *   • A list-derived step (`body` is empty, so the title IS the folded item) is
 *     scanned only as far as the card shows. Scanning the whole item made
 *     WS-006's "Vul alle [PLACEHOLDERS] in met de echte data" a red `error`
 *     card, because a later clause of the same bullet mentioned deleting the
 *     placeholders you do not use.
 *
 * Either way the rule is the same: a card's glyph has to be about what that card
 * actually says.
 */
function stepKind(
  step: ProcStep,
  label: string,
  hasRoutes: boolean,
  isLast: boolean,
  hasEndNode: boolean,
): DiagramNodeKind {
  const signal = step.body ? plain(beforeCode(step.title)) : label;
  if (hasRoutes || isDecisionStep(signal, step.body)) return 'decision';
  if (isDestructiveStep(signal)) return 'error';
  if (isWarningStep(signal)) return 'warning';
  if (isHandoffStep(step.title)) return 'handoff';
  if (isLast && !hasEndNode) return 'end';
  return 'step';
}

/**
 * The caption above the label: which step this is, and who performs it.
 *
 * A hand-off names BOTH parties, in the document's own arrow notation — see
 * `handoffPair` for why naming only one of them misleads.
 */
function stepCaption(step: ProcStep, actor: string | null): string {
  const pair = handoffPair(step.title);
  if (pair) return `${step.marker} · ${pair.from} → ${pair.to}`;
  return actor ? `${step.marker} · ${actor}` : step.marker;
}

// ---------------------------------------------------------------------------
// SOP — spine with branches
// ---------------------------------------------------------------------------

/**
 * Draw any SOP. `id` is the file basename; it is only used for the spec id and
 * as a title of last resort.
 */
export function buildGenericSopSpec(id: string, md: string): DiagramSpec | null {
  const body = withoutFrontmatter(md);
  const title = documentTitle(body, titleFromId(id));
  const reading = readProcedure(body);

  if (reading.mode === 'sub-procedures') return buildSubProcedureSpec(id, title, body, reading);
  if (reading.steps.length === 0) return null;

  return buildSpineSpec(id, title, body, reading);
}

function buildSpineSpec(
  id: string,
  title: string,
  body: string,
  reading: ProcedureReading,
): DiagramSpec {
  const b = new SpecBuilder();
  const steps = reading.steps.slice(0, MAX_STEPS);
  const omitted = reading.steps.length - steps.length;
  let row = 0;
  let decisions = 0;
  let branches = 0;

  const start = b.node({
    kind: 'start',
    when: 'Start',
    // The panel header already shows the title in full; the card is a card.
    label: shortLabel(title, 56),
    detail: purposeOf(body),
    col: 0,
    row: row++,
  });

  let previous = start;
  steps.forEach((step, i) => {
    const routes = decisionRoutes(step.body);
    const actor = findActor(step.title, { subjectOnly: true });
    const label = stepLabel(step, actor);
    const kind = stepKind(step, label, routes !== null, i === steps.length - 1, reading.endSection !== null);
    if (kind === 'decision') decisions += 1;

    const node = b.node({
      kind,
      when: stepCaption(step, actor),
      label,
      detail: stepDetail(step),
      col: 0,
      row: row++,
    });
    // Explicitly `'flow'`, not the target-derived default. A step that carries a
    // hard rule ("Format + groepen bepalen — GEEN AFWIJKING TOEGESTAAN") is a
    // `warning` card, and letting the default dash the edge INTO it said the
    // step was an exception path — while the legend right above the canvas
    // defines a dash as exactly that. The spine is always the normal route; the
    // warning is about the step, not about how you get there.
    b.link(previous, node, undefined, 'flow');
    previous = node;

    if (!routes) return;
    for (const route of routes) {
      const outcome = b.node({
        kind: routeKind(`${route.when} ${route.dest}`),
        when: shortLabel(route.when, 34),
        label: shortLabel(route.dest, 52),
        detail: `${plain(route.when)} → ${plain(route.dest)}`,
        col: 1,
        row: row++,
      });
      b.link(node, outcome);
      branches += 1;
    }
  });

  // What the document says can go wrong, on the dashed exception path.
  for (const exception of reading.exceptions) {
    const node = b.node({
      kind: 'warning',
      when: 'Uitzondering',
      label: shortLabel(plain(exception.heading), 52),
      detail: firstClause(exception.body, 220) || plain(exception.heading),
      col: 1,
      row: row++,
    });
    b.link(previous, node, undefined, 'exception');
  }

  if (reading.endSection) {
    const items = bulletItems(reading.endSection.body).map((i) => plain(i.replace(/^\[[ xX]\]\s*/, '')));
    const end = b.node({
      kind: 'end',
      when: 'Klaar',
      label: shortLabel(plain(reading.endSection.heading), 52),
      detail: items.join(' · ') || firstClause(reading.endSection.body, 220),
      col: 0,
      row: row++,
    });
    b.link(previous, end);
  }

  const shape: DiagramShape = reading.phased
    ? 'phased-pipeline'
    : decisions >= 2
      ? 'decision-tree'
      : decisions === 1
        ? 'steps-with-fork'
        : 'linear-steps';

  const exceptions = reading.exceptions.length;
  const parts = [`${steps.length} ${steps.length === 1 ? 'stap' : 'stappen'}`];
  if (decisions > 0) parts.push(`${decisions} ${decisions === 1 ? 'beslismoment' : 'beslismomenten'}`);
  if (branches > 0) parts.push(`${branches} ${branches === 1 ? 'route' : 'routes'}`);
  if (exceptions > 0) {
    parts.push(`${exceptions} ${exceptions === 1 ? 'uitzonderingspad' : 'uitzonderingspaden'}`);
  }
  if (omitted > 0) parts.push(`${omitted} stappen niet getekend`);

  // The dash sentence is conditional for the same reason its legend entry is:
  // most generic diagrams have no exception path, and explaining a line the
  // canvas never draws is a thing the reader has to rule out by hand.
  const dashNote = exceptions > 0 ? ' Gestippelde pijlen zijn uitzonderingspaden.' : '';

  return {
    id,
    title,
    shape,
    summary: `${parts.join(', ')}.${dashNote}`,
    nodes: b.nodes,
    edges: b.edges,
  };
}

/**
 * §A / §B / §C documents (SOP-claim-task, SOP-close-task, SOP-list-open-tasks).
 * Each § becomes its own column, because they are ALTERNATIVES: you run one of
 * them, never all three in sequence. Drawing them as one spine would be a lie
 * about the procedure.
 */
function buildSubProcedureSpec(
  id: string,
  title: string,
  body: string,
  reading: ProcedureReading,
): DiagramSpec | null {
  const subs = reading.subProcedures;
  if (subs.length < 2) return null;

  const b = new SpecBuilder();
  const start = b.node({
    kind: 'start',
    when: 'Start',
    // The panel header already shows the title in full; the card is a card.
    label: shortLabel(title, 56),
    detail: purposeOf(body),
    col: 0,
    row: 0,
  });

  subs.forEach((sub, col) => {
    const head = b.node({
      kind: 'branch',
      when: sub.marker,
      label: shortLabel(sub.title, 52),
      detail: `${sub.marker} — ${plain(sub.title)}`,
      col,
      row: 1,
    });
    // `'top'`: the § heads sit side by side on one row, so an edge that entered
    // them from the left would run straight across the face of the § to their
    // left — turning three alternatives into what looks like a sequence.
    b.link(start, head, undefined, undefined, 'top');

    let previous = head;
    const steps = sub.steps.slice(0, MAX_SUB_STEPS);
    steps.forEach((step, i) => {
      const label = stepLabel(step, null);
      const node = b.node({
        kind: stepKind(step, label, false, i === steps.length - 1, false),
        when: step.marker,
        label,
        detail: stepDetail(step),
        col,
        row: 2 + i,
      });
      b.link(previous, node, undefined, 'flow');
      previous = node;
    });
  });

  return {
    id,
    title,
    shape: 'sub-procedures',
    summary:
      `${subs.length} sub-procedures naast elkaar (${subs.map((s) => s.marker).join(', ')}); ` +
      'je draait er één, niet alle drie achter elkaar.',
    nodes: b.nodes,
    edges: b.edges,
  };
}

// ---------------------------------------------------------------------------
// Workstream — swimlanes
// ---------------------------------------------------------------------------

/** The column for steps the document does not assign to anyone. */
const UNASSIGNED_LANE = 'Niet toegewezen';

/**
 * Draw any Workstream as swimlanes: one column per specialist, the sequence
 * running top to bottom across the lanes.
 *
 * Degrades to the SOP spine when the document names fewer than two specialists
 * in its step headings. WS-002 and WS-005 genuinely never say who does what —
 * drawing them as a one-lane "swimlane" would dress a linear list up as
 * something it is not.
 */
export function buildGenericWorkstreamSpec(id: string, md: string): DiagramSpec | null {
  const body = withoutFrontmatter(md);
  const title = documentTitle(body, titleFromId(id));
  const owners = ownersFromFrontmatter(frontmatterBlock(md));
  const reading = readProcedure(body);

  if (reading.mode === 'sub-procedures' || reading.steps.length === 0) {
    return buildGenericSopSpec(id, md);
  }

  const steps = reading.steps.slice(0, MAX_STEPS);
  // `subjectOnly`: the lane is whoever the step is ABOUT, not whoever it
  // mentions. See findActor's note — this is the rule that stops WS-006 from
  // opening a Sander lane because a heading credits his posts.
  const actors = steps.map((s) => findActor(s.title, { extra: owners, subjectOnly: true }));
  const named = Array.from(new Set(actors.filter((a): a is string => a !== null)));
  if (named.length < 2) return buildGenericSopSpec(id, md);

  // Lanes in order of first appearance, so the sequence reads left-to-right as
  // often as the document allows.
  const lanes: string[] = [];
  for (const actor of actors) {
    const lane = actor ?? UNASSIGNED_LANE;
    if (!lanes.includes(lane)) lanes.push(lane);
  }

  const b = new SpecBuilder();

  // Lane headers are column CAPTIONS, deliberately unconnected: an edge from a
  // header down to its lane's first step would cross whatever sits between them
  // in that column. The association is positional (and spelled out in every
  // card's caption and aria-label), which is exactly how a swimlane header
  // works on paper.
  lanes.forEach((lane, col) => {
    b.node({
      kind: 'lane',
      when: 'Baan',
      label: lane,
      detail: `Zwembaan van ${lane} in ${title}`,
      col,
      row: 0,
    });
  });

  let previous: DiagramNode | null = null;
  let decisions = 0;
  steps.forEach((step, i) => {
    const actor = actors[i];
    const lane = actor ?? UNASSIGNED_LANE;
    // Swimlane mode does not fan decisions out sideways: a branch column would
    // land on top of the neighbouring lane. The decision is still marked as one
    // (glyph, caption and accent), its routes stay in the tooltip and the prose.
    const label = stepLabel(step, actor);
    const kind = stepKind(step, label, false, i === steps.length - 1, reading.endSection !== null);
    if (kind === 'decision') decisions += 1;
    const node = b.node({
      kind,
      when: stepCaption(step, actor),
      label,
      detail: stepDetail(step),
      col: lanes.indexOf(lane),
      row: 1 + i,
    });
    // Sequence edges are always the normal route — see buildSpineSpec for why
    // the target-derived default would misreport a warning step as a detour.
    if (previous) b.link(previous, node, undefined, 'flow');
    previous = node;
  });

  if (reading.endSection && previous) {
    const end = b.node({
      kind: 'end',
      when: 'Klaar',
      label: shortLabel(plain(reading.endSection.heading), 52),
      detail:
        bulletItems(reading.endSection.body).map((i) => plain(i)).join(' · ') ||
        firstClause(reading.endSection.body, 220),
      col: (previous as DiagramNode).col,
      row: 1 + steps.length,
    });
    b.link(previous, end);
  }

  const decisionNote = decisions > 0 ? ` ${decisions} beslismoment(en).` : '';
  return {
    id,
    title,
    shape: 'swimlanes',
    summary:
      `Eén baan per specialist: ${lanes.join(', ')}. ` +
      `${steps.length} stappen, van boven naar beneden.${decisionNote}`,
    nodes: b.nodes,
    edges: b.edges,
  };
}

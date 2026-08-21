// sopDiagrams.ts — the markdown → diagram-data conversion step (fase 1 of
// tsk-2026-08-19-003).
//
// SCOPE, on purpose (YAGNI, straight out of the task):
//   Fase 1 = three PILOT documents, each in a DIFFERENT diagram shape, so the
//   pattern gets tested three ways instead of once:
//     • SOP-013-inboxen-verwerken      → decision-tree     (Vraag A/B/C + routes)
//     • SOP-004-argus-security-audit   → phased-pipeline   (4 blocking phases)
//     • SOP-017-verwerk-voedingsregistratie → steps-with-fork (steps + tweesprong)
//   A GENERIC parser that works on any SOP/Workstream/Guideline is fase 2 and is
//   deliberately NOT attempted here.
//
// Each converter READS THE REAL FILE. The cockpit already has the markdown in
// hand (FileView fetches it), so the spec is derived from the live document, not
// from a snapshot pasted in here. That has a real consequence: when a document is
// rewritten past recognition, its converter returns `null` and the "Visualiseer"
// button simply does not appear — a missing diagram, never a wrong one. Each
// converter therefore starts with a structural guard.
//
// Layout convention shared by all three: the SPINE runs down column 0; anything
// that branches off it fans to the right (column 1, occasionally 2), one row per
// branch. Rows are floats so a decision can sit level with its first outcome.
import type { DiagramEdge, DiagramNode, DiagramNodeKind, DiagramSpec } from './diagramTypes';
import {
  arrowPairs,
  bulletItems,
  fencedBlocks,
  firstClause,
  headingSections,
  orderedItems,
  plain,
  sentenceCase,
  shortLabel,
  tableRows,
} from './markdownShapes';

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

/** Drop the YAML frontmatter block so headings/lists inside it are never read. */
function withoutFrontmatter(md: string): string {
  if (!md.startsWith('---')) return md;
  const end = md.indexOf('\n---', 3);
  if (end < 0) return md;
  const after = md.indexOf('\n', end + 1);
  return after < 0 ? '' : md.slice(after + 1);
}

/** "SOP-013 — Inboxen verwerken" / "SOP: Security Audit" → the bare title. */
function documentTitle(md: string, fallback: string): string {
  const h1 = headingSections(md, 1)[0];
  if (!h1) return fallback;
  return plain(h1.heading).replace(/^SOP[-\s]?\d*\s*[:—–-]\s*/, '').trim() || fallback;
}

/**
 * Which signal a routing destination carries. Read off the destination text
 * itself, so the SOP stays the source of truth: a route that says "Verwijderen"
 * is destructive, one that says "Twijfel"/"nog uitzoeken"/"interactief
 * beoordelen" needs a human, one that hands to a named specialist is a handoff.
 */
function routeKind(text: string): DiagramNodeKind {
  if (/verwijder/i.test(text)) return 'error';
  if (/\bPenn\b|\bPKM\b/i.test(text)) return 'handoff';
  if (/twijfel|onduidelijk|uitzoeken|manual-review|interactief|gevoelig|financ/i.test(text)) {
    return 'warning';
  }
  return 'branch';
}

/** Warning/error targets are reached over the dashed exception path. */
function edgeKindFor(target: DiagramNodeKind): DiagramEdge['kind'] {
  return target === 'warning' || target === 'error' ? 'exception' : 'flow';
}

/** Small builder so the converters below read as the shape they describe. */
class SpecBuilder {
  readonly nodes: DiagramNode[] = [];
  readonly edges: DiagramEdge[] = [];
  private seq = 0;

  node(n: Omit<DiagramNode, 'id'> & { id?: string }): DiagramNode {
    const node: DiagramNode = { ...n, id: n.id ?? `n${this.seq++}` };
    this.nodes.push(node);
    return node;
  }

  link(source: DiagramNode, target: DiagramNode, label?: string, kind?: DiagramEdge['kind']): void {
    this.edges.push({
      id: `e:${source.id}->${target.id}`,
      source: source.id,
      target: target.id,
      label,
      kind: kind ?? edgeKindFor(target.kind),
    });
  }
}

// ---------------------------------------------------------------------------
// SOP-013 — Inboxen verwerken  (decision-tree)
// ---------------------------------------------------------------------------
//
// Structure this converter relies on:
//   `## Stap N — <title>` × 6, of which Stap 2 holds the beslisboom as
//   `### Vraag A|B|C…` subsections. Vraag A's routes live in a | Type | Route |
//   table; Vraag B/C's routes live as `Label → Destination` lines inside fenced
//   blocks. `### Video-uitzondering: …` is an exception path off Vraag A.

function buildInboxDiagram(md: string): DiagramSpec | null {
  const body = withoutFrontmatter(md);
  const steps = headingSections(body, 2)
    .map((s) => ({ ...s, m: /^Stap\s+(\d+)\s*[—–-]\s*(.+)$/.exec(s.heading) }))
    .filter((s): s is typeof s & { m: RegExpExecArray } => s.m !== null)
    .map((s) => ({ number: Number(s.m[1]), title: s.m[2].trim(), body: s.body }));

  const decisionStep = steps.find((s) => /beslisboom/i.test(s.title));
  if (steps.length < 4 || !decisionStep) return null;

  const vragen = headingSections(decisionStep.body, 3);
  const questions = vragen.filter((v) => /^Vraag\s+[A-Z]/.test(v.heading));
  if (questions.length < 2) return null;

  const b = new SpecBuilder();
  let row = 0;

  const start = b.node({
    kind: 'start',
    when: 'Start',
    label: documentTitle(body, 'Inboxen verwerken'),
    detail: firstClause(headingSections(body, 2).find((s) => /^Doel$/i.test(s.heading))?.body ?? '', 200),
    col: 0,
    row: row++,
  });

  let previous = start;
  const stepNodes = new Map<number, DiagramNode>();

  for (const step of steps) {
    const isLast = step.number === steps[steps.length - 1].number;
    // Stap 5 routes PKM items to a named specialist — that is a handoff, and the
    // document says so literally ("route naar **Penn**").
    const handsOff = /\bnaar\s+\*\*[A-Z]/.test(step.body) || /\bvia\s+[A-Z][a-z]+\s*$/.test(step.title);
    const node = b.node({
      kind: isLast ? 'end' : handsOff ? 'handoff' : 'step',
      when: `Stap ${step.number}`,
      label: shortLabel(step.title),
      detail: firstClause(step.body, 220) || plain(step.title),
      col: 0,
      row: row++,
    });
    stepNodes.set(step.number, node);
    b.link(previous, node);
    previous = node;

    if (step !== decisionStep) continue;

    // ---- the beslisboom itself -------------------------------------------
    let questionAnchor = node;
    let mediahubOutcome: DiagramNode | null = null;
    let gateUsed = false;

    for (const q of questions) {
      const letter = /^Vraag\s+([A-Z])/.exec(q.heading)?.[1] ?? '?';
      const onlyWhen = /alleen bij ([^)]+)\)/i.exec(q.heading)?.[1]?.trim();
      const prompt = plain(q.heading).replace(/^Vraag\s+[A-Z][^:]*:\s*/, '');

      const decision = b.node({
        kind: 'decision',
        when: `Vraag ${letter}`,
        label: shortLabel(prompt),
        detail: plain(q.heading),
        col: 0,
        row,
      });
      // Vraag B/C are gated ("alleen bij Mediahub"). The FIRST gated question is
      // entered from the Mediahub route itself, labelled with that gate; any
      // further gated question chains off the previous one — by then we are
      // already inside the Mediahub branch and repeating the label would lie
      // about where the flow came from.
      const enterFromGate = Boolean(onlyWhen) && mediahubOutcome !== null && !gateUsed;
      b.link(
        enterFromGate ? (mediahubOutcome as DiagramNode) : questionAnchor,
        decision,
        enterFromGate ? onlyWhen : undefined,
      );
      if (enterFromGate) gateUsed = true;
      questionAnchor = decision;

      // Routes: the table for Vraag A, the first fenced block for Vraag B/C.
      const rows = tableRows(q.body);
      const routes: { when: string; dest: string }[] =
        rows.length > 1
          ? rows.slice(1).filter((r) => r.length >= 2).map((r) => ({
              when: r[0],
              dest: r[1].replace(/^→\s*/, ''),
            }))
          : arrowPairs(fencedBlocks(q.body)[0] ?? '').map((p) => ({ when: p.left, dest: p.right }));

      if (routes.length === 0) return null;

      for (const r of routes) {
        const kind = routeKind(`${r.when} ${r.dest}`);
        const outcome = b.node({
          kind,
          when: shortLabel(r.when, 34),
          label: shortLabel(r.dest, 52),
          detail: `${plain(r.when)} → ${plain(r.dest)}`,
          col: 1,
          row: row++,
        });
        b.link(decision, outcome);
        if (!mediahubOutcome && /mediahub/i.test(r.dest)) mediahubOutcome = outcome;
      }

      // The video exception hangs off Vraag A, over a dashed edge — the document
      // introduces it as the case where the plain table route is NOT enough.
      const exception = vragen.find((v) => /uitzondering/i.test(v.heading));
      if (exception && letter === 'A') {
        const routesInException = bulletItems(exception.body)
          .map((line) => arrowPairs(line)[0])
          .filter(Boolean)
          .map((p) => `${plain(p.left)} → ${plain(p.right)}`);
        const node2 = b.node({
          kind: 'warning',
          when: 'Uitzondering',
          label: shortLabel(plain(exception.heading)),
          detail: routesInException.join(' · ') || firstClause(exception.body, 220),
          col: 1,
          row: row++,
        });
        b.link(decision, node2, undefined, 'exception');
      }
    }

    // Close the branch back onto the spine: the last question feeds Stap 3.
    const nextStep = steps.find((s) => s.number === step.number + 1);
    if (nextStep) previous = questionAnchor;
    row += 1;
  }

  return {
    id: 'SOP-013-inboxen-verwerken',
    title: documentTitle(body, 'Inboxen verwerken'),
    shape: 'decision-tree',
    summary:
      `Beslisboom met ${questions.length} vragen en ${steps.length} stappen; ` +
      'gestippelde pijlen zijn uitzonderingspaden.',
    nodes: b.nodes,
    edges: b.edges,
  };
}

// ---------------------------------------------------------------------------
// SOP-004 — Security Audit  (phased-pipeline)
// ---------------------------------------------------------------------------
//
// Structure this converter relies on:
//   `### Phase 1..4 — <title>`, each closing with an `Output for Phase N: …`
//   line; a `## Severity ladder` of `- **LEVEL** — …` bullets; and a
//   `## Output / definition of done` checklist.

function buildSecurityAuditDiagram(md: string): DiagramSpec | null {
  const body = withoutFrontmatter(md);
  const phases = headingSections(body, 3)
    .map((s) => ({ ...s, m: /^Phase\s+(\d+)\s*[—–-]\s*(.+)$/.exec(s.heading) }))
    .filter((s): s is typeof s & { m: RegExpExecArray } => s.m !== null)
    .map((s) => ({ number: Number(s.m[1]), title: s.m[2].trim(), body: s.body }));

  if (phases.length < 3) return null;

  const sections = headingSections(body, 2);
  const ladder = bulletItems(sections.find((s) => /severity ladder/i.test(s.heading))?.body ?? '')
    .map((line) => /^\*\*([A-Z]+)\*\*\s*[—–-]\s*(.+)$/.exec(line))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => ({ level: m[1], text: m[2] }));

  const doneSection = sections.find((s) => /definition of done/i.test(s.heading));
  const doneItems = bulletItems(doneSection?.body ?? '').map((i) => i.replace(/^\[[ xX]\]\s*/, ''));
  if (ladder.length === 0 || doneItems.length === 0) return null;

  const b = new SpecBuilder();
  let row = 0;

  const start = b.node({
    kind: 'start',
    when: 'Start',
    label: documentTitle(body, 'Security Audit'),
    detail: firstClause(sections.find((s) => /^Procedure$/i.test(s.heading))?.body ?? '', 220),
    col: 0,
    row: row++,
  });

  // The phases block each other — the SOP says so ("Don't skip phases — earlier
  // findings change later ones"). That sentence becomes the edge label.
  const blockingNote = /Don't skip phases[^.]*\./i.exec(body)?.[0];
  let previous = start;
  for (const phase of phases) {
    const node = b.node({
      kind: 'step',
      when: `Fase ${phase.number}`,
      label: shortLabel(phase.title),
      detail: plain(phase.title),
      col: 0,
      row,
    });
    b.link(previous, node, previous === start ? undefined : 'blokkeert');
    previous = node;

    const output = /^Output for Phase \d+:\s*(.+)$/m.exec(phase.body)?.[1];
    if (output) {
      const out = b.node({
        kind: 'branch',
        when: 'Oplevering',
        label: sentenceCase(firstClause(output, 52)),
        detail: plain(output),
        col: 1,
        row,
      });
      b.link(node, out);
    }
    row += 1;
  }

  const classify = b.node({
    kind: 'decision',
    when: 'Severity',
    label: 'Bevinding classificeren',
    detail: blockingNote ? plain(blockingNote) : 'Severity ladder uit de SOP.',
    col: 0,
    row,
  });
  b.link(previous, classify);

  // Severity ladder, most severe first — the ladder's own order in the document.
  let criticalNode: DiagramNode | null = null;
  for (const entry of ladder) {
    const kind: DiagramNodeKind =
      entry.level === 'CRITICAL' ? 'error' : entry.level === 'HIGH' ? 'warning' : 'branch';
    const node = b.node({
      kind,
      when: entry.level,
      label: sentenceCase(firstClause(entry.text, 52)),
      detail: plain(entry.text),
      col: 1,
      row: row++,
    });
    b.link(classify, node);
    if (entry.level === 'CRITICAL') criticalNode = node;
  }

  // The one escalation the SOP calls out explicitly in its definition of done.
  const escalation = doneItems.find((i) => /CRITICAL/.test(i));
  if (criticalNode && escalation) {
    const escalate = b.node({
      kind: 'error',
      when: 'Escalatie',
      label: sentenceCase(firstClause(escalation, 52)),
      detail: plain(escalation),
      col: 2,
      row: criticalNode.row,
    });
    b.link(criticalNode, escalate, undefined, 'exception');
  }

  const done = b.node({
    kind: 'end',
    when: 'Klaar',
    label: shortLabel(plain(doneSection?.heading ?? 'Definition of done')),
    detail: doneItems.map((i) => plain(i)).join(' · '),
    col: 0,
    row: row++,
  });
  b.link(classify, done);

  return {
    id: 'SOP-004-argus-security-audit',
    title: documentTitle(body, 'Security Audit'),
    shape: 'phased-pipeline',
    summary:
      `${phases.length} fasen die elkaar blokkeren, gevolgd door de severity-ladder ` +
      `(${ladder.map((l) => l.level).join(', ')}).`,
    nodes: b.nodes,
    edges: b.edges,
  };
}

// ---------------------------------------------------------------------------
// SOP-017 — Verwerk een voedingsregistratie  (steps-with-fork)
// ---------------------------------------------------------------------------
//
// Structure this converter relies on:
//   `## Procedure` as a numbered list, and `## Close-session — tijdvenstercheck`
//   as a numbered list whose items 3 and 4 are the two arms of the fork
//   (`missing` leeg → stil afronden, `missing` niet leeg → vragen).

function buildFoodLogDiagram(md: string): DiagramSpec | null {
  const body = withoutFrontmatter(md);
  const sections = headingSections(body, 2);
  const procedure = orderedItems(sections.find((s) => /^Procedure$/i.test(s.heading))?.body ?? '');
  const checkSection = sections.find((s) => /tijdvenstercheck/i.test(s.heading));
  const check = orderedItems(checkSection?.body ?? '');

  if (procedure.length < 5 || check.length < 4) return null;

  // The fork: the two items that open with "missing (niet) leeg →".
  const forkIndex = check.findIndex((i) => /`?missing`?\s+leeg\s*→/i.test(i));
  const elseIndex = check.findIndex((i) => /`?missing`?\s+niet\s+leeg\s*→/i.test(i));
  if (forkIndex < 0 || elseIndex < 0) return null;

  const b = new SpecBuilder();
  let row = 0;

  const start = b.node({
    kind: 'start',
    when: 'Start',
    label: documentTitle(body, 'Verwerk een voedingsregistratie'),
    detail: firstClause(sections.find((s) => /^Doel$/i.test(s.heading))?.body ?? '', 220),
    col: 0,
    row: row++,
  });

  let previous = start;
  procedure.forEach((item, i) => {
    const node = b.node({
      kind: 'step',
      when: `Stap ${i + 1}`,
      label: sentenceCase(firstClause(item, 54)),
      detail: plain(item),
      col: 0,
      row: row++,
    });
    b.link(previous, node);
    previous = node;
  });

  // The tijdvenstercheck's lead-in items (everything before the fork).
  for (const item of check.slice(0, forkIndex)) {
    const node = b.node({
      kind: 'step',
      when: 'Tijdvenstercheck',
      label: sentenceCase(firstClause(item, 54)),
      detail: plain(item),
      col: 0,
      row: row++,
    });
    b.link(previous, node);
    previous = node;
  }

  const decision = b.node({
    kind: 'decision',
    when: 'Tweesprong',
    label: 'Is de missing-lijst leeg?',
    detail: plain(checkSection?.heading ?? 'Tijdvenstercheck') + ' — ' + plain(check[forkIndex]),
    col: 0,
    row: row++,
  });
  b.link(previous, decision);

  const forkRow = row;

  // Arm A — nothing missing: stay on the spine, finish silently.
  const quiet = b.node({
    kind: 'step',
    when: 'Geen vraag',
    label: sentenceCase(firstClause(check[forkIndex].replace(/^[^→]*→\s*/, ''), 54)),
    detail: plain(check[forkIndex]),
    col: 0,
    row: forkRow,
  });
  b.link(decision, quiet, 'missing leeg');

  // Arm B — something missing: branch right, ask, then record the skip.
  const ask = b.node({
    kind: 'branch',
    when: 'Wel vragen',
    label: sentenceCase(firstClause(check[elseIndex].replace(/^[^→]*→\s*/, ''), 54)),
    detail: plain(check[elseIndex]),
    col: 1,
    row: forkRow,
  });
  b.link(decision, ask, 'missing niet leeg');

  let armB = ask;
  let armRow = forkRow + 1;
  for (const item of check.slice(elseIndex + 1)) {
    const isLast = item === check[check.length - 1];
    if (isLast) break; // the closing rule belongs to the merged end node
    // Only the item that tells you to RECORD a skip is a "let op" — the item
    // that merely explains what a skip is, is a plain follow-up.
    const kind: DiagramNodeKind = /nog niet gegeten|overgeslagen/i.test(item) ? 'warning' : 'branch';
    const node = b.node({
      kind,
      when: 'Vervolg',
      label: sentenceCase(firstClause(item, 54)),
      detail: plain(item),
      col: 1,
      row: armRow++,
    });
    b.link(armB, node);
    armB = node;
  }

  // Both arms merge on the closing rule of the section.
  const end = b.node({
    kind: 'end',
    when: 'Einde',
    label: sentenceCase(firstClause(check[check.length - 1], 54)),
    detail: plain(check[check.length - 1]),
    col: 0,
    row: Math.max(armRow, forkRow + 1),
  });
  b.link(quiet, end);
  b.link(armB, end);

  return {
    id: 'SOP-017-verwerk-voedingsregistratie',
    title: documentTitle(body, 'Verwerk een voedingsregistratie'),
    shape: 'steps-with-fork',
    summary:
      `${procedure.length} genummerde stappen, daarna de tijdvenstercheck met de ` +
      'tweesprong op een lege of gevulde missing-lijst.',
    nodes: b.nodes,
    edges: b.edges,
  };
}

// ---------------------------------------------------------------------------
// Registry — the fase-1 allow-list
// ---------------------------------------------------------------------------

type Converter = (md: string) => DiagramSpec | null;

/** Keyed by file BASENAME, so the diagram survives a folder move. */
const CONVERTERS: Record<string, Converter> = {
  'SOP-013-inboxen-verwerken.md': buildInboxDiagram,
  'SOP-004-argus-security-audit.md': buildSecurityAuditDiagram,
  'SOP-017-verwerk-voedingsregistratie.md': buildFoodLogDiagram,
};

/** Does fase 1 know how to draw this file at all? Cheap; no markdown needed. */
export function hasDiagramConverter(path: string): boolean {
  return (path.split('/').pop() ?? path) in CONVERTERS;
}

/**
 * Convert a document to a DiagramSpec, or null when this file has no fase-1
 * converter OR its structure no longer matches what the converter expects. A
 * throw inside a converter is caught and treated the same way: a missing diagram
 * must never take the reading page down with it.
 */
export function buildDiagramSpec(path: string, markdown: string): DiagramSpec | null {
  const converter = CONVERTERS[path.split('/').pop() ?? path];
  if (!converter) return null;
  try {
    return converter(markdown);
  } catch {
    return null;
  }
}

// TeamTasksView.tsx — the AI team's markdown task tracker as a cockpit page.
//
// Reads GET /api/cockpit/team-tasks, which walks Team Knowledge/tasks/ LIVE on
// every request (no mypka.db, no regen step). The envelope carries an ARRAY of
// sources even though only one is configured today — wiring PKM/Tasks/ in later
// is an entry in server/taskSources.js with no change here.
//
// SHAPE OF THE PAGE
//   per source (section, only labelled when there is more than one)
//     per status group, in the order the server returned them
//       one row per task: id chip + title, meta chips, blocked reason, summary
//
// BLOCKED IS ORTHOGONAL TO STATUS — the one thing that is easy to get wrong here.
// There is no `blocked/` folder and there must never be one; a task is blocked
// when its frontmatter carries a `blocked_reason`, wherever it physically lives.
// A blocked task therefore turns up inside the Open group just as readily as
// inside In progress (measured 2026-08-19: the single blocked task sits in
// open/). So the badge is rendered PER ROW from item.blocked and never inferred
// from which group the row landed in.
//
// Rows link to the real markdown via the existing jailed #/file route, exactly
// like TeamKnowledgeListView. A row without a filePath degrades to a non-
// navigable card rather than a dead link.
//
// Every value is a GL-003 token; no hardcoded colours or sizes; the `truncate`
// class is never used (a multi-line clamp is, .tk-row-summary).
import { ClipboardList, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { useFetch } from '../lib/useCockpit';
import { useT, type TranslationKey } from '../lib/i18n';
import { fileRouteSrc, hrefFor } from '../lib/router';
import { PageHeader } from '../components/PageHeader';
import './team.css';

interface TaskItem {
  slug: string;
  id: string;
  title: string;
  status: string;
  statusFieldDrift: boolean;
  assignee: string;
  priority: number | null;
  due: string | null;
  created: string | null;
  updated: string | null;
  createdBy: string | null;
  blocked: boolean;
  blockedReason: string | null;
  tags: string[];
  summary: string | null;
  filePath: string | null;
  sourceRoot: string;
}

interface TaskSource {
  id: string;
  label: string;
  root: string;
  available: boolean;
  counts: Record<string, number>;
  closedTruncated: boolean;
  items: TaskItem[];
}

interface TeamTasksResponse {
  available: boolean;
  generatedAt: string;
  sources: TaskSource[];
}

// Status -> heading key. A status the server grows later that isn't mapped here
// still renders (under its raw name) rather than vanishing — losing a task from
// the page would be worse than an untranslated heading.
const STATUS_LABEL: Record<string, TranslationKey> = {
  'in-progress': 'team.tasksGroupInProgress',
  open: 'team.tasksGroupOpen',
  done: 'team.tasksGroupDone',
  cancelled: 'team.tasksGroupCancelled',
};

// Display order for the groups. Anything unmapped sorts last, in server order.
const STATUS_ORDER = ['in-progress', 'open', 'done', 'cancelled'];

function fileHrefFor(item: TaskItem): string | null {
  if (!item.filePath) return null;
  return hrefFor({ name: 'file', src: fileRouteSrc('file', item.filePath) });
}

function MetaLine({ item }: { item: TaskItem }) {
  const t = useT();
  const chips: Array<{ k: string; v: string }> = [];
  // Blocked leads: it is the single most decision-relevant fact on the row, and
  // it is deliberately independent of which group this row is rendered in.
  if (item.blocked) chips.push({ k: 'blocked', v: t('team.tasksBlocked') });
  chips.push({
    k: 'assignee',
    v: item.assignee === 'unassigned' ? t('team.tasksUnassigned') : item.assignee,
  });
  if (item.priority !== null) {
    chips.push({ k: 'priority', v: t('team.tasksPriority', { value: item.priority }) });
  }
  if (item.due) chips.push({ k: 'due', v: t('team.tasksDue', { value: item.due }) });
  return (
    <span className="tk-row-meta">
      {chips.map((c) => (
        <span key={c.k} className={`tk-meta-chip tk-meta-chip--${c.k}`}>{c.v}</span>
      ))}
    </span>
  );
}

function TaskRow({ item }: { item: TaskItem }) {
  const t = useT();
  const href = fileHrefFor(item);
  const inner = (
    <>
      <span className="tk-row-head">
        <span className="tk-row-id">{item.id}</span>
        <span className="tk-row-title">{item.title}</span>
        {href && <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" className="tk-row-arrow" />}
      </span>
      <MetaLine item={item} />
      {/* The reason a task is stuck is the whole value of showing it as blocked,
          so it gets its own line rather than hiding in a tooltip. */}
      {item.blocked && item.blockedReason && (
        <span className="tk-row-blocked">
          <AlertTriangle size={13} strokeWidth={1.6} aria-hidden="true" />
          <span>{item.blockedReason}</span>
        </span>
      )}
      {item.summary && <span className="tk-row-summary">{item.summary}</span>}
    </>
  );

  if (href) {
    return (
      <li className="tk-row-li">
        <a
          href={href}
          className="tk-row tk-row--nav"
          aria-label={t('common.openLabel', { label: `${item.id} — ${item.title}` })}
        >
          {inner}
        </a>
      </li>
    );
  }
  return (
    <li className="tk-row-li">
      <div className="tk-row">{inner}</div>
    </li>
  );
}

function StatusGroup({ status, items, source, headingLevel }: {
  status: string;
  items: TaskItem[];
  source: TaskSource;
  // PageHeader owns the <h1>. With one source the group heading is the next level
  // down (h2); once a source label appears above it, the group drops to h3. Doing
  // this dynamically keeps the outline gap-free either way — a skipped level is a
  // WCAG 1.3.1 defect, and it is invisible until someone navigates by heading.
  headingLevel: 2 | 3;
}) {
  const t = useT();
  const labelKey = STATUS_LABEL[status];
  const heading = labelKey ? t(labelKey) : status;
  const headingId = `tasks-${source.id}-${status}`;
  const truncated = source.closedTruncated && (status === 'done' || status === 'cancelled');
  const H = (headingLevel === 2 ? 'h2' : 'h3') as 'h2' | 'h3';
  return (
    <section className="tk-group" aria-labelledby={headingId}>
      <H className="tk-group-head" id={headingId}>
        {heading}
        <span className="tk-group-count">{items.length}</span>
      </H>
      <ul className="tk-rows">
        {items.map((item) => <TaskRow key={item.slug} item={item} />)}
      </ul>
      {truncated && (
        <p className="tk-group-note">
          {t('team.tasksClosedTruncated', { count: items.length })}
        </p>
      )}
    </section>
  );
}

function SourceSection({ source, showLabel }: { source: TaskSource; showLabel: boolean }) {
  // Group by status, preserving the server's within-group ordering (priority,
  // then staleness) — we only decide the order OF the groups.
  const groups = new Map<string, TaskItem[]>();
  for (const item of source.items) {
    const bucket = groups.get(item.status);
    if (bucket) bucket.push(item);
    else groups.set(item.status, [item]);
  }
  const ordered = [...groups.keys()].sort((a, b) => {
    const ia = STATUS_ORDER.indexOf(a);
    const ib = STATUS_ORDER.indexOf(b);
    return (ia === -1 ? Number.MAX_SAFE_INTEGER : ia) - (ib === -1 ? Number.MAX_SAFE_INTEGER : ib);
  });

  return (
    <section className="tk-source">
      {/* With one source the label is redundant chrome, so it only appears once a
          second source (PKM/Tasks/) is switched on in server/taskSources.js. */}
      {showLabel && <h2 className="tk-source-head">{source.label}</h2>}
      {ordered.map((status) => (
        <StatusGroup
          key={status}
          status={status}
          items={groups.get(status)!}
          source={source}
          headingLevel={showLabel ? 3 : 2}
        />
      ))}
    </section>
  );
}

export function TeamTasksView() {
  const t = useT();
  const { data, loading, error } = useFetch<TeamTasksResponse>('/api/cockpit/team-tasks');

  const sources = (data?.sources ?? []).filter((s) => s.available);
  const total = sources.reduce((sum, s) => sum + s.items.length, 0);
  const sub = t('team.tasksSub');

  const header = (
    <PageHeader
      title={t('team.tasksTitle')}
      icon={ClipboardList}
      subtitle={total > 0
        ? t('team.knowledgeSubCount', {
            count: total,
            noun: t(total === 1 ? 'common.entryOne' : 'common.entryOther'),
            sub,
          })
        : sub}
    />
  );

  let body: React.ReactNode;
  if (loading && !data) {
    body = <div className="list-skeleton" aria-busy="true"><div className="skeleton-block" /></div>;
  } else if (error) {
    body = <div role="alert" className="view-error">{t('team.tasksLoadError')}: {error}</div>;
  } else if (total === 0) {
    body = (
      <div className="library-empty">
        <span className="library-empty-mark" aria-hidden="true">
          <ClipboardList size={28} strokeWidth={1.5} />
        </span>
        <p className="library-empty-title">{t('team.tasksEmpty')}</p>
        <p className="library-empty-sub">{t('team.tasksEmptySub')}</p>
      </div>
    );
  } else {
    body = (
      <div className="team-solo-scroll">
        {sources.map((source) => (
          <SourceSection key={source.id} source={source} showLabel={sources.length > 1} />
        ))}
      </div>
    );
  }

  return (
    <section className="roster-view team-page-view team-solo-view animate-fade-rise">
      {header}
      <section className="team-solo-col">{body}</section>
    </section>
  );
}

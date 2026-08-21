// SkillsView.tsx — what the AI team can actually invoke, as a cockpit page.
//
// Reads GET /api/cockpit/skills, which reads the source files LIVE on every
// request (no mypka.db, no regen step — Sander's explicit choice on 2026-08-19,
// tsk-2026-08-19-001). Three origin groups: domain skills (~/.claude/skills),
// this repo's slash commands, and INSTALLED plugin skills.
//
// TWO HONESTY RULES THIS PAGE EXISTS TO KEEP
//   1. A skill that is installed but DISABLED is shown, marked disabled — not
//      quietly listed as if it were available (superwhisper is exactly this) and
//      not hidden either. Both alternatives would misrepresent the team's reach.
//   2. A row is a link ONLY when there is genuinely something to open — a link
//      that 403s is worse than no link. Two routes satisfy that now:
//        * repo files (the slash-commands) via /api/cockpit/file;
//        * domain skills via /api/cockpit/skill-file?skill=<slug>, the purpose-
//          built jail for ~/.claude/skills/<slug>/SKILL.md (Argus's design of
//          2026-08-21; server/skillFileApi.js).
//      PLUGIN skills stay non-navigable cards ON PURPOSE. Their location comes
//      from installed_plugins.json — arbitrary absolute paths — so serving them
//      would make that JSON file an arbitrary-read primitive. Not an oversight;
//      do not "complete" it (design §7.2).
//
// What is deliberately absent, and why, is documented in server/skillSources.js:
// the three scheduled-task routines (Sander excluded them), the 32-entry
// marketplace CATALOGUE of merely installable plugins, and the client's built-in
// skills (docx/pdf/xlsx/…) which have no on-disk representation to read.
//
// Every value is a GL-003 token; no hardcoded colours or sizes; the `truncate`
// class is never used (a multi-line clamp is, .tk-row-summary).
import { Sparkles, ArrowUpRight, Terminal, Puzzle, Brain } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useFetch } from '../lib/useCockpit';
import { useT, type TranslationKey } from '../lib/i18n';
import { fileRouteSrc, hrefFor } from '../lib/router';
import { PageHeader } from '../components/PageHeader';
import './team.css';

type SkillKind = 'domain-skill' | 'slash-command' | 'plugin-skill';

interface SkillItem {
  key: string;
  slug: string;
  invocation: string | null;
  title: string;
  summary: string | null;
  kind: SkillKind;
  sourceId: string;
  pluginName: string | null;
  enabled: boolean;
  /** Repo-relative path servable by /api/cockpit/file — repo commands only. */
  filePath: string | null;
  /** One slug servable by /api/cockpit/skill-file — ~/.claude/skills rows only. */
  skillSlug: string | null;
}

interface SkillGroup {
  id: string;
  kind: SkillKind;
  label: string;
  available: boolean;
  reason: string | null;
  count: number;
  items: SkillItem[];
}

interface SkillsResponse {
  available: boolean;
  generatedAt: string;
  total: number;
  groups: SkillGroup[];
}

// Per-kind chrome. Keys, not strings: this map is module-level (frozen at import)
// while the locale can change at runtime.
const KIND_META: Record<SkillKind, { icon: LucideIcon; headingKey: TranslationKey }> = {
  'domain-skill': { icon: Brain, headingKey: 'team.skillsGroupDomainSkill' },
  'slash-command': { icon: Terminal, headingKey: 'team.skillsGroupSlashCommand' },
  'plugin-skill': { icon: Puzzle, headingKey: 'team.skillsGroupPluginSkill' },
};

// Which of the two openable shapes this row has, if either. The order is not
// arbitrary: filePath is the narrower, repo-jailed claim, so it wins whenever a
// row somehow carries both. A row with neither (plugin skills) stays a card.
function fileHrefFor(item: SkillItem): string | null {
  if (item.filePath) return hrefFor({ name: 'file', src: fileRouteSrc('file', item.filePath) });
  if (item.skillSlug) return hrefFor({ name: 'file', src: fileRouteSrc('skill-file', item.skillSlug) });
  return null;
}

// A slash command's H1 is almost always just its own slug ("# brainstorm"), so
// rendering the /brainstorm chip AND "brainstorm" beside it says the same word
// twice and wastes the widest part of the row. Show the title only when it adds
// something. Same intent as displayTitle() in TeamKnowledgeListView, which strips
// a repeated doc id out of the title there.
function titleAddsInfo(item: SkillItem): boolean {
  if (!item.invocation) return true;
  const norm = (s: string) => s.toLowerCase().replace(/[\s_-]+/g, '');
  return norm(item.title) !== norm(item.slug);
}

function SkillRow({ item }: { item: SkillItem }) {
  const t = useT();
  const href = fileHrefFor(item);
  const showTitle = titleAddsInfo(item);
  const chips: Array<{ k: string; v: string }> = [];
  if (!item.enabled) chips.push({ k: 'disabled', v: t('team.skillsDisabled') });
  if (item.pluginName) chips.push({ k: 'plugin', v: item.pluginName });

  const inner = (
    <>
      <span className="tk-row-head">
        {/* The command token is what Sander actually types, so it takes the id
            slot the other team pages give to a doc id. */}
        {item.invocation && <span className="tk-row-id">{item.invocation}</span>}
        {showTitle && <span className="tk-row-title">{item.title}</span>}
        {href && <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" className="tk-row-arrow" />}
      </span>
      {chips.length > 0 && (
        <span className="tk-row-meta">
          {chips.map((c) => (
            <span key={c.k} className={`tk-meta-chip tk-meta-chip--${c.k}`}>{c.v}</span>
          ))}
        </span>
      )}
      {item.summary && <span className="tk-row-summary">{item.summary}</span>}
    </>
  );

  // A disabled skill is dimmed but stays fully readable — this is information,
  // not a decorative "off" state, so it keeps normal text contrast.
  const cls = `tk-row${item.enabled ? '' : ' tk-row--muted'}`;

  if (href) {
    return (
      <li className="tk-row-li">
        <a
          href={href}
          className={`${cls} tk-row--nav`}
          // Mirrors what is on screen: no "/brainstorm — brainstorm" echo for a
          // screen-reader user either.
          aria-label={t('common.openLabel', {
            label: showTitle && item.invocation
              ? `${item.invocation} — ${item.title}`
              : (item.invocation ?? item.title),
          })}
        >
          {inner}
        </a>
      </li>
    );
  }
  return (
    <li className="tk-row-li">
      <div className={cls}>{inner}</div>
    </li>
  );
}

function KindGroup({ group }: { group: SkillGroup }) {
  const t = useT();
  const meta = KIND_META[group.kind];
  const headingId = `skills-${group.id}`;
  const Icon = meta?.icon ?? Sparkles;

  return (
    // PageHeader owns the <h1>, so the kind heading is h2 — no skipped level.
    // (A skipped heading level is a WCAG 1.3.1 defect and is invisible until
    // someone navigates the page by heading.)
    <section className="tk-group" aria-labelledby={headingId}>
      <h2 className="tk-group-head" id={headingId}>
        <Icon size={14} strokeWidth={1.6} aria-hidden="true" className="tk-group-icon" />
        {meta ? t(meta.headingKey) : group.label}
        <span className="tk-group-count">{group.count}</span>
      </h2>
      {/* An unavailable source says WHY rather than rendering as an empty void. */}
      {!group.available ? (
        <p className="tk-group-note">{t('team.skillsSourceMissing')}</p>
      ) : (
        <ul className="tk-rows">
          {group.items.map((item) => <SkillRow key={item.key} item={item} />)}
        </ul>
      )}
    </section>
  );
}

export function SkillsView() {
  const t = useT();
  const { data, loading, error } = useFetch<SkillsResponse>('/api/cockpit/skills');

  const total = data?.total ?? 0;
  const sub = t('team.skillsSub');
  // A group with nothing in it AND nothing to explain is noise; one that is
  // unavailable still renders, because "the folder isn't here" is information.
  const groups = (data?.groups ?? []).filter((g) => g.count > 0 || !g.available);

  const header = (
    <PageHeader
      title={t('team.skillsTitle')}
      icon={Sparkles}
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
    body = <div role="alert" className="view-error">{t('team.skillsLoadError')}: {error}</div>;
  } else if (total === 0) {
    body = (
      <div className="library-empty">
        <span className="library-empty-mark" aria-hidden="true">
          <Sparkles size={28} strokeWidth={1.5} />
        </span>
        <p className="library-empty-title">{t('team.skillsEmpty')}</p>
        <p className="library-empty-sub">{t('team.skillsEmptySub')}</p>
      </div>
    );
  } else {
    body = (
      <div className="team-solo-scroll">
        {groups.map((group) => <KindGroup key={group.id} group={group} />)}
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

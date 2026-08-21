// router.ts — a tiny hash router (zero deps). The cockpit is a local
// single-server SPA; hash routing keeps deep-linking + back-button working
// without react-router.
//
// Routes:
//   #/  (or #/hub)              -> the Hub — the cockpit's landing dashboard
//   #/journal                   -> journal browser
//   #/roster                    -> team roster (your specialists)
//   #/connections               -> connect task/PM/calendar tools (local key vault)
//   #/notes                     -> Fleeting Notes (capture + WIP docs)
//   #/notes/:slug               -> open one fleeting note (outliner editor)
//   #/board/:slug               -> a whiteboard (fleeting notes on a canvas)
//   #/type/:type                -> browse one entity type
//   #/note/:type/:slug          -> open a PKM note by explicit type+slug
//   #/resolve/:slug             -> resolve a [[wikilink]] slug (collision-aware)
//   #/file/:src                 -> routed reading page for a raw file (FileView)
//   #/podcasts                  -> podcast shows overview
//   #/podcasts/all              -> every episode, paginated
//   #/podcasts/show/:slug       -> one show's episodes, paginated
//   #/podcasts/episode/:slug    -> one episode (detail-large)
//   #/<module-slug>             -> a drop-in extension module (see moduleRegistry)
//
// File-route src encoding (the `src` of { name: 'file' }):
//   The cockpit serves raw files through three jailed API routes, so `src` is the
//   repo-relative path with a compact source discriminator prefix:
//     'Deliverables/2026-…/notes.md'   -> /api/cockpit/file?path=…       (the
//        default; NO prefix — this route serves both Deliverables/ paths and
//        PKM document paths, so the path alone is the src)
//     'inbox:Team Inbox/photo.png'     -> /api/cockpit/inbox-file?path=…
//     'skill:wdf-regels'               -> /api/cockpit/skill-file?skill=…
//        The odd one out ON PURPOSE: this src carries a SLUG, not a path. That
//        route reads ~/.claude/skills/<slug>/SKILL.md — the only jail outside
//        the scaffold — and it accepts no path argument at all; the server
//        hardcodes the SKILL.md filename. See server/skillFileApi.js.
//   In the hash the whole src rides as ONE segment via encodeURIComponent
//   ('/' -> %2F), e.g. #/file/Deliverables%2F2026-…%2Fnotes.md. parseHash is
//   lenient and also accepts hand-typed unencoded slashes (#/file/a/b/c.md)
//   by re-joining the trailing segments. Build src with fileRouteSrc(); turn it
//   back into { path, fileUrl } with parseFileSrc().
import { useEffect, useState } from 'react';
import { moduleForSlug } from './moduleRegistry';

export type Route =
  | { name: 'hub' }
  | { name: 'journal' }
  // "My AI Team" family. The fly-out under the sidebar's "My AI Team" row routes
  // to one of these full pages. `roster` (the team grid) and `session-log` split
  // the old combined RosterView into two distinct pages; `workstreams` / `sops` /
  // `guidelines` list the three Team-Knowledge doc families from mypka.db.
  //
  // `team-tasks` and `skills` are the exception to that last sentence: they do
  // NOT read the mirror. Both read their source files live from disk on every
  // request, because their data changes several times a day while the mirror is
  // only regenerated on demand. See server/teamTasksApi.js + server/skillsApi.js.
  | { name: 'roster' }
  | { name: 'session-log' | 'team-analytics' }
  | { name: 'workstreams' }
  | { name: 'sops' }
  | { name: 'guidelines' }
  | { name: 'team-tasks' }
  | { name: 'skills' }
  | { name: 'connections' }
  // The WIDER software inventory (stored key names + MCP servers). Its own
  // route, not a tab inside 'connections': different data source, different
  // question, read-only. See views/StackView.tsx.
  | { name: 'stack' }
  | { name: 'integrations' }
  | { name: 'settings' }
  | { name: 'notes' }
  | { name: 'notes-doc'; slug: string }
  | { name: 'board'; slug: string }
  // Drop-in extension modules resolve to ONE generic variant carrying their
  // registry slug. The slug is the deep-link key; the registry maps it to nav
  // metadata + the view component. A gated-off / uninstalled module's slug
  // never matches here → falls through to the default view.
  | { name: 'module'; slug: string }
  | { name: 'type'; type: string }
  | { name: 'note'; type: string; slug: string }
  | { name: 'resolve'; slug: string }
  // Library foundation (DATA-CONTRACT §11). #/library = the library surface
  // (pick a library); #/library/:lib = one library's card grid; #/library/:lib/
  // :item = an item opened in the large detail view. Deep-linkable; the Library
  // nav row (moduleRegistry) targets the bare #/library.
  | { name: 'library'; lib?: string; item?: string }
  // Outer World module (DATA-CONTRACT §14). #/outer-world = the mymind-style card
  // grid; #/outer-world/:slug = one saved item opened in the large detail view
  // (the embed header + tom_context body + linked entities). Deep-linkable; the
  // Outer World nav row (moduleRegistry) targets the bare #/outer-world.
  | { name: 'outer-world'; slug?: string }
  // Podcasts module (DATA-CONTRACT §18). Four deep-linkable surfaces on one
  // route name, exactly like `library` above:
  //   #/podcasts                    -> the SHOWS overview (the picker)
  //   #/podcasts/all                -> every episode, paginated  (pane:'episodes')
  //   #/podcasts/show/:slug         -> one show's episodes, paginated
  //   #/podcasts/episode/:slug      -> one episode in the large detail view
  // The second segment is an explicit NAMESPACE discriminator ('all' | 'show' |
  // 'episode') rather than a bare slug: show slugs and episode slugs live in
  // different namespaces and either could otherwise shadow the "all episodes"
  // view. `pane` distinguishes the bare overview from the all-episodes list,
  // which carry the same (absent) show/episode fields.
  | { name: 'podcasts'; pane?: 'episodes'; show?: string; episode?: string }
  // A raw file rendered as a routed in-app reading page (FileView). See the
  // "File-route src encoding" note in the header comment.
  | { name: 'file'; src: string };

// ---- file-route src codec ---------------------------------------------------
// Which jailed server route serves the file's bytes.
export type FileSource = 'file' | 'inbox-file' | 'skill-file';

/**
 * Build the `src` for a { name: 'file' } route.
 *
 * For 'file' and 'inbox-file' the second argument is a repo-relative PATH; for
 * 'skill-file' it is a SKILL SLUG (one segment — the server appends SKILL.md).
 */
export function fileRouteSrc(source: FileSource, pathOrSlug: string): string {
  if (source === 'inbox-file') return `inbox:${pathOrSlug}`;
  if (source === 'skill-file') return `skill:${pathOrSlug}`;
  return pathOrSlug;
}

/**
 * Decode a file-route `src` back into the display path + jailed serving URL.
 *
 * The skill branch is the only one where `path` is NOT what travels to the
 * server: the request carries the slug alone, and `path` exists purely so the
 * reading page has an honest name to show. It must end in `.md`, because
 * previewKindFor() keys off the extension — a name without one renders "No
 * inline view" instead of the skill (finding B-6).
 */
export function parseFileSrc(src: string): { path: string; fileUrl: string } {
  if (src.startsWith('inbox:')) {
    const path = src.slice('inbox:'.length);
    return { path, fileUrl: `/api/cockpit/inbox-file?path=${encodeURIComponent(path)}` };
  }
  if (src.startsWith('skill:')) {
    const slug = src.slice('skill:'.length);
    return {
      path: `${slug}/SKILL.md`,
      fileUrl: `/api/cockpit/skill-file?skill=${encodeURIComponent(slug)}`,
    };
  }
  return { path: src, fileUrl: `/api/cockpit/file?path=${encodeURIComponent(src)}` };
}

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  const parts = clean.split('/').filter(Boolean).map(decodeURIComponent);
  if (parts.length === 0 || parts[0] === 'hub') return { name: 'hub' };
  if (parts[0] === 'journal') return { name: 'journal' };
  if (parts[0] === 'roster') return { name: 'roster' };
  if (parts[0] === 'session-log') return { name: 'session-log' };
  if (parts[0] === 'team-analytics') return { name: 'team-analytics' };
  if (parts[0] === 'workstreams') return { name: 'workstreams' };
  if (parts[0] === 'sops') return { name: 'sops' };
  if (parts[0] === 'guidelines') return { name: 'guidelines' };
  if (parts[0] === 'team-tasks') return { name: 'team-tasks' };
  if (parts[0] === 'skills') return { name: 'skills' };
  if (parts[0] === 'connections') return { name: 'connections' };
  if (parts[0] === 'stack') return { name: 'stack' };
  if (parts[0] === 'integrations') return { name: 'integrations' };
  if (parts[0] === 'settings') return { name: 'settings' };
  // Fleeting Notes + boards MUST be matched BEFORE the module-registry check,
  // so a drop-in module slug can never shadow a core route.
  if (parts[0] === 'notes' && parts[1]) return { name: 'notes-doc', slug: parts[1] };
  if (parts[0] === 'notes') return { name: 'notes' };
  if (parts[0] === 'board' && parts[1]) return { name: 'board', slug: parts[1] };
  // File reading page. Matched before the module-registry check (core route).
  // Canonically the src is ONE encoded segment, but hand-typed hashes with raw
  // slashes split into several decoded parts — re-join them.
  if (parts[0] === 'file' && parts.length > 1) return { name: 'file', src: parts.slice(1).join('/') };
  // Library surface. Matched BEFORE the module-registry check so the parameterized
  // forms (#/library/:lib, #/library/:lib/:item) are never shadowed by a same-named
  // module slug. Bare #/library is the library picker.
  if (parts[0] === 'library') {
    if (parts[1] && parts[2]) return { name: 'library', lib: parts[1], item: parts[2] };
    if (parts[1]) return { name: 'library', lib: parts[1] };
    return { name: 'library' };
  }
  // Outer World module. Matched BEFORE the module-registry check so the
  // parameterized detail form (#/outer-world/:slug) is never shadowed by the
  // same-named module slug. Bare #/outer-world is the card grid.
  if (parts[0] === 'outer-world') {
    if (parts[1]) return { name: 'outer-world', slug: parts[1] };
    return { name: 'outer-world' };
  }
  // Podcasts module. Matched BEFORE the module-registry check for the same
  // reason as Library/Outer World: the parameterized forms must never be
  // shadowed by the same-named module slug (which only exists to get a nav row).
  // An unrecognised second segment falls back to the overview rather than the
  // Hub, so a stale/hand-typed #/podcasts/… still lands on the module.
  if (parts[0] === 'podcasts') {
    if (parts[1] === 'episode' && parts[2]) return { name: 'podcasts', episode: parts[2] };
    if (parts[1] === 'show' && parts[2]) return { name: 'podcasts', pane: 'episodes', show: parts[2] };
    if (parts[1] === 'all') return { name: 'podcasts', pane: 'episodes' };
    return { name: 'podcasts' };
  }
  // Extension-module slugs resolve through the registry (gate-aware). Checked
  // before the parameterized core routes so a module slug can't be shadowed.
  if (parts[0] && moduleForSlug(parts[0])) return { name: 'module', slug: parts[0] };
  if (parts[0] === 'type' && parts[1]) return { name: 'type', type: parts[1] };
  if (parts[0] === 'note' && parts[1] && parts[2]) return { name: 'note', type: parts[1], slug: parts[2] };
  if (parts[0] === 'resolve' && parts[1]) return { name: 'resolve', slug: parts[1] };
  return { name: 'hub' };
}

export function hrefFor(route: Route): string {
  switch (route.name) {
    case 'hub': return '#/hub';
    case 'journal': return '#/journal';
    case 'roster': return '#/roster';
    case 'session-log': return '#/session-log';
    case 'team-analytics': return '#/team-analytics';
    case 'workstreams': return '#/workstreams';
    case 'sops': return '#/sops';
    case 'guidelines': return '#/guidelines';
    case 'team-tasks': return '#/team-tasks';
    case 'skills': return '#/skills';
    case 'connections': return '#/connections';
    case 'stack': return '#/stack';
    case 'integrations': return '#/integrations';
    case 'settings': return '#/settings';
    case 'notes': return '#/notes';
    case 'notes-doc': return `#/notes/${encodeURIComponent(route.slug)}`;
    case 'board': return `#/board/${encodeURIComponent(route.slug)}`;
    case 'module': return `#/${encodeURIComponent(route.slug)}`;
    case 'type': return `#/type/${encodeURIComponent(route.type)}`;
    case 'note': return `#/note/${encodeURIComponent(route.type)}/${encodeURIComponent(route.slug)}`;
    case 'resolve': return `#/resolve/${encodeURIComponent(route.slug)}`;
    case 'file': return `#/file/${encodeURIComponent(route.src)}`;
    case 'library':
      if (route.lib && route.item)
        return `#/library/${encodeURIComponent(route.lib)}/${encodeURIComponent(route.item)}`;
      if (route.lib) return `#/library/${encodeURIComponent(route.lib)}`;
      return '#/library';
    case 'outer-world':
      if (route.slug) return `#/outer-world/${encodeURIComponent(route.slug)}`;
      return '#/outer-world';
    case 'podcasts':
      // Order matters: the most specific surface wins, so a route object that
      // carries both `episode` and `show` still round-trips to the episode.
      if (route.episode) return `#/podcasts/episode/${encodeURIComponent(route.episode)}`;
      if (route.show) return `#/podcasts/show/${encodeURIComponent(route.show)}`;
      if (route.pane === 'episodes') return '#/podcasts/all';
      return '#/podcasts';
  }
}

export function navigate(route: Route): void {
  const href = hrefFor(route);
  if (window.location.hash !== href) window.location.hash = href;
  else window.dispatchEvent(new HashChangeEvent('hashchange')); // re-open same note
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      // Scrolling the content region to top on navigation is handled by the view.
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

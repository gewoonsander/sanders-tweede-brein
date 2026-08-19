// taskSources.js — THE SOURCE CONFIGURATION for the cockpit's task reader.
//
// WHY THIS FILE EXISTS (the whole point of scope B)
// The cockpit surfaces markdown task folders live from disk. There is more than
// one such folder in this myPKA, and there will be more later. Rather than hard-
// coding one path into the reader, every source is ONE entry in the array below.
// Adding a source is a data change here + two i18n labels — never a rewrite of
// the reader, the endpoint, or the view.
//
// TODAY: one active source — the AI team's own task tracker.
//
// THE OBVIOUS NEXT ONE (deliberately NOT enabled yet — Sander chose scope B on
// 2026-08-19: team first, personal later, but the seam in place from day one):
//
//   {
//     id: 'personal',
//     label: 'Mijn taken',
//     root: 'PKM/Tasks',
//     filePattern: /^tsk-.*\.md$/,
//     statusDirs: [
//       { dir: 'inbox',     status: 'inbox',     recursive: false },
//       { dir: 'next',      status: 'next',      recursive: false },
//       { dir: 'waiting',   status: 'waiting',   recursive: false },
//       { dir: 'scheduled', status: 'scheduled', recursive: false },
//       { dir: 'someday',   status: 'someday',   recursive: false },
//       { dir: 'done',      status: 'done',      recursive: true  },
//       { dir: 'cancelled', status: 'cancelled', recursive: true  },
//     ],
//   }
//
// (That layout is documented in PKM/Tasks/INDEX.md and GL-019-persoonlijke-
// taakarchitectuur. Uncommenting it is the entire change — the reader already
// walks whatever it finds here, and the API envelope already carries an array of
// sources rather than a single flat item list.)
//
// FIELD CONTRACT
//   id           stable key used in the API envelope and as a React key. [a-z-]+
//   label        display name. Data, not UI chrome — deliberately NOT translated,
//                the same way connector labels (Todoist, Jortt) are not.
//   root         REPO-ROOT-RELATIVE folder. The reader jails every resolved path
//                under this; anything that escapes it is skipped, never read.
//   filePattern  which basenames count as a task. Mirrors the `find -name
//                'tsk-*.md'` glob that SOP-rebuild-task-index uses, so the cockpit
//                counts EXACTLY what INDEX.md counts. This is what excludes
//                `EXAMPLE-tsk-...-welcome-to-tasks.md` and `_template.md`.
//   statusDirs   the status folders, in DISPLAY order (most actionable first).
//                `status` is authoritative over the file's own `status:` field —
//                see SOP-rebuild-task-index's drift rule: the folder wins.
//                `recursive` is true where the folder nests by YYYY/MM (done/,
//                cancelled/); false for the flat folders (open/, in-progress/).
//
// NOTE ON BLOCKED TASKS: there is no `blocked/` folder and there must never be
// one. A blocked task lives in `in-progress/` with a filled `blocked_reason`.
// The reader derives `blocked` from that field, not from a folder.

export const TASK_SOURCES = [
  {
    id: 'team',
    label: 'Teamtaken',
    root: 'Team Knowledge/tasks',
    filePattern: /^tsk-.*\.md$/,
    statusDirs: [
      { dir: 'in-progress', status: 'in-progress', recursive: false },
      { dir: 'open', status: 'open', recursive: false },
      { dir: 'done', status: 'done', recursive: true },
      { dir: 'cancelled', status: 'cancelled', recursive: true },
    ],
  },
];

export default TASK_SOURCES;

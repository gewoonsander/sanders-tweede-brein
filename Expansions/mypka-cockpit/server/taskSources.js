// Task sources configuration (Scope B: team + personal tasks support)
// This file defines which directories to scan for task files.
// When PKM/Tasks/ is added as a second source, only a new entry below is needed.
// No schema migration, no server-side dependencies required.

export const TASK_SOURCES = [
  {
    id: 'team',
    label: 'Team tasks',
    root: 'Team Knowledge/tasks',
    filePattern: /^tsk-.*\.md$/,
    statusDirs: [
      { dir: 'open', status: 'open', recursive: false },
      { dir: 'in-progress', status: 'in-progress', recursive: false },
      { dir: 'done', status: 'done', recursive: true },
      { dir: 'cancelled', status: 'cancelled', recursive: true },
    ],
  },
  // Future: Add personal tasks here when ready
  // {
  //   id: 'personal',
  //   label: 'My tasks',
  //   root: 'PKM/Tasks',
  //   filePattern: /^[^_].*\.md$/,
  //   statusDirs: [...],
  // },
];

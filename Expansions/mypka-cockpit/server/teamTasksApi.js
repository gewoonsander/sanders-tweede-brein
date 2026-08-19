import path from 'path';
import fs from 'fs';
import { parseTaskFrontmatter } from './taskFrontmatter.js';
import { TASK_SOURCES } from './taskSources.js';
import { REPO_ROOT } from './repoRoot.js';

// Read all tasks from a source
function readSource(source) {
  const items = [];
  const sourceRoot = path.join(REPO_ROOT, source.root);

  for (const statusDir of source.statusDirs) {
    const mapPath = path.join(sourceRoot, statusDir.dir);

    if (!fs.existsSync(mapPath)) {
      continue;
    }

    const walk = (currentPath, isRootCall = false) => {
      try {
        const entries = fs.readdirSync(currentPath);

        for (const entry of entries) {
          const fullPath = path.join(currentPath, entry);
          let stat;
          try {
            stat = fs.lstatSync(fullPath);
          } catch {
            continue;
          }

          // Skip symlinks
          if (stat.isSymbolicLink()) {
            continue;
          }

          if (stat.isDirectory()) {
            if (statusDir.recursive) {
              walk(fullPath, false);
            }
            continue;
          }

          // Check if filename matches pattern
          if (!source.filePattern.test(entry)) {
            continue;
          }

          // Verify path containment
          const relativePath = path.relative(sourceRoot, fullPath);
          if (relativePath.startsWith('..')) {
            continue;
          }

          // Read and parse
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const { fm } = parseTaskFrontmatter(content);

            const taskId = entry.replace(/\.md$/, '');
            items.push({
              id: taskId,
              title: fm.title || taskId,
              status: fm.status || statusDir.status,
              assignee: fm.assignee ? String(fm.assignee).toLowerCase() : null,
              priority: fm.priority ? parseInt(fm.priority, 10) : null,
              due: fm.due || null,
              created: fm.created || null,
              updated: fm.updated || null,
              blocked: !!fm.blocked_reason,
              blockedReason: fm.blocked_reason || null,
              tags: Array.isArray(fm.tags) ? fm.tags : [],
              filePath: path.relative(REPO_ROOT, fullPath),
            });
          } catch {
            // Skip this file on parse error
          }
        }
      } catch {
        // Skip this directory on read error
      }
    };

    walk(mapPath, true);
  }

  return items;
}

// Read all tasks from all sources
export function readAllTasks() {
  const sources = [];

  for (const source of TASK_SOURCES) {
    try {
      const items = readSource(source);

      const counts = {
        open: items.filter(i => i.status === 'open').length,
        inProgress: items.filter(i => i.status === 'in-progress').length,
        blocked: items.filter(i => i.blocked).length,
        done: items.filter(i => i.status === 'done').length,
        cancelled: items.filter(i => i.status === 'cancelled').length,
      };

      sources.push({
        id: source.id,
        label: source.label,
        available: true,
        counts,
        items,
      });
    } catch {
      // Source unavailable
      sources.push({
        id: source.id,
        label: source.label,
        available: false,
        counts: {},
        items: [],
      });
    }
  }

  return { available: true, sources };
}

export function registerTeamTasksRoutes(app, { safe }) {
  app.get('/api/cockpit/team-tasks', safe((req) => {
    return readAllTasks();
  }));
}

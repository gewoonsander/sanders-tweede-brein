// filetree.trash.test.mjs — self-test for the inbox "move to Trash" delete
// button (POST /api/cockpit/inbox/trash). Run:
//   node server/filetree.trash.test.mjs
// from the Expansion root (or `node filetree.trash.test.mjs` from server/).
//
// Exercises the real moveToOsTrash()/uniqueTrashTarget()/containedInboxPath()
// against real temp files and a FAKE $HOME (so it never touches the real
// ~/.Trash or the real "Team Inbox/"). No HTTP, no server boot — same style
// as workbench.attachments.test.mjs.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert';
import { __test } from './filetree.js';

const { containedInboxPath, uniqueTrashTarget, moveToOsTrash, INBOX_DIR } = __test;

let pass = 0, fail = 0;
function check(name, fn) {
  try { fn(); console.log(`  ok  — ${name}`); pass++; }
  catch (err) { console.error(`  FAIL — ${name}\n        ${err.message}`); fail++; }
}

const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'ft-trash-test-'));
const realHome = os.homedir();

check('containedInboxPath accepts a plain file under Team Inbox/', () => {
  const abs = containedInboxPath('Team Inbox/photo.png');
  assert.strictEqual(abs, path.join(INBOX_DIR, 'photo.png'));
});

check('containedInboxPath rejects traversal out of the jail', () => {
  assert.strictEqual(containedInboxPath('Team Inbox/../secrets.txt'), null);
  assert.strictEqual(containedInboxPath('../Team Inbox/photo.png'), null);
});

check('uniqueTrashTarget picks the bare name when free', () => {
  const target = uniqueTrashTarget(scratch, 'note.txt');
  assert.strictEqual(target, path.join(scratch, 'note.txt'));
});

check('uniqueTrashTarget appends a Finder-style " (n)" counter on collision', () => {
  fs.writeFileSync(path.join(scratch, 'dup.txt'), 'first');
  fs.writeFileSync(path.join(scratch, 'dup (1).txt'), 'second');
  const target = uniqueTrashTarget(scratch, 'dup.txt');
  assert.strictEqual(target, path.join(scratch, 'dup (2).txt'));
});

check('moveToOsTrash moves a real file into ~/.Trash and clears the source', () => {
  const fakeHome = fs.mkdtempSync(path.join(scratch, 'home-'));
  fs.mkdirSync(path.join(fakeHome, '.Trash'));
  const src = path.join(scratch, 'to-delete.png');
  fs.writeFileSync(src, 'bytes');
  process.env.HOME = fakeHome;
  try {
    const result = moveToOsTrash(src);
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.target, path.join(fakeHome, '.Trash', 'to-delete.png'));
    assert.strictEqual(fs.existsSync(src), false);
    assert.strictEqual(fs.readFileSync(result.target, 'utf8'), 'bytes');
  } finally {
    process.env.HOME = realHome;
  }
});

check('moveToOsTrash errors calmly when the host has no ~/.Trash', () => {
  const fakeHome = fs.mkdtempSync(path.join(scratch, 'home-no-trash-'));
  const src = path.join(scratch, 'orphan.png');
  fs.writeFileSync(src, 'bytes');
  process.env.HOME = fakeHome;
  try {
    const result = moveToOsTrash(src);
    assert.strictEqual(result.error, 'no-trash');
    assert.strictEqual(fs.existsSync(src), true); // never touched — no silent hard-delete fallback
  } finally {
    process.env.HOME = realHome;
  }
});

check('moveToOsTrash refuses to move a symlink itself (TOCTOU close-out)', () => {
  const fakeHome = fs.mkdtempSync(path.join(scratch, 'home-symlink-'));
  fs.mkdirSync(path.join(fakeHome, '.Trash'));
  const realFile = path.join(scratch, 'real.png');
  fs.writeFileSync(realFile, 'bytes');
  const link = path.join(scratch, 'link.png');
  fs.symlinkSync(realFile, link);
  process.env.HOME = fakeHome;
  try {
    const result = moveToOsTrash(link);
    assert.strictEqual(result.error, 'not-a-file');
    assert.strictEqual(fs.existsSync(link), true);
    assert.strictEqual(fs.existsSync(realFile), true);
  } finally {
    process.env.HOME = realHome;
  }
});

fs.rmSync(scratch, { recursive: true, force: true });

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

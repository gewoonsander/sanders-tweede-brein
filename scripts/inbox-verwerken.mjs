#!/usr/bin/env node
// inbox-verwerken.mjs
// Node-wrapper rond de wekelijkse inboxronde: roept de lokale Claude Code CLI
// headless aan met het inbox-verwerken-prompt. Bewust via node (niet bash) als
// top-level LaunchAgent-proces — node heeft al TCC-toegang tot ~/Documents op
// deze Mac (zelfde reden als adc-verslag-ochtend.mjs), zodat hier geen aparte
// Volledige-schijftoegang-toekenning nodig is.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const promptPath = path.join(__dirname, "inbox-verwerken.prompt.md");
const claudeBin = process.env.CLAUDE_BIN || path.join(process.env.HOME, ".local/bin/claude");

const prompt = readFileSync(promptPath, "utf8");

console.log(`[inbox-verwerken] ${new Date().toISOString()} — start`);

execFileSync(
  claudeBin,
  ["-p", prompt, "--allowedTools", "Bash Read Write Edit Glob Grep", "--dangerously-skip-permissions"],
  { cwd: repoRoot, stdio: "inherit" }
);

console.log(`[inbox-verwerken] ${new Date().toISOString()} — klaar`);

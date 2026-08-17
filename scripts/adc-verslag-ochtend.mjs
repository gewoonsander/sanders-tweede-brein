#!/usr/bin/env node
// ⚠️ VERVALLEN PER 2026-08-17 — NIET MEER IN GEBRUIK.
//
// Vervangen door scripts/adc-verslag-ochtend.sh. Deze node-wrapper kan onder launchd niet meer
// werken: Homebrew node krijgt daar geen TCC-toegang tot ~/Documents en blijft oneindig
// hangen op een toestemmingsdialoog die niemand kan wegklikken, in plaats van te falen.
// Een hangend proces houdt de launchd-job "running", waardoor elk volgend gepland
// interval stilzwijgend werd overgeslagen. Volledige analyse: scripts/lib/launchd-guard.sh.
//
// Bewaard als referentie. Bij verwijderen: check eerst of geen enkele plist er nog naar wijst.
// De aanname in het oorspronkelijke commentaar hieronder — "node heeft al TCC-toegang tot
// ~/Documents op deze Mac" — is aantoonbaar niet meer waar.

// adc-verslag-ochtend.mjs
// Node-wrapper rond adc-verslag-ochtend.sh se logica: roept de lokale Claude Code CLI
// headless aan met het ADC-verslag-prompt. Bewust via node (niet bash) als top-level
// LaunchAgent-proces — node heeft al TCC-toegang tot ~/Documents op deze Mac (zie de
// werkende dartsatlas-fetch LaunchAgent), zodat hier geen aparte Volledige-schijftoegang-
// toekenning nodig is.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const promptPath = path.join(__dirname, "adc-verslag-ochtend.prompt.md");
const claudeBin = process.env.CLAUDE_BIN || path.join(process.env.HOME, ".local/bin/claude");

const prompt = readFileSync(promptPath, "utf8");

console.log(`[adc-verslag-ochtend] ${new Date().toISOString()} — start`);

execFileSync(
  claudeBin,
  ["-p", prompt, "--allowedTools", "Bash Read Write Edit Glob Grep", "--dangerously-skip-permissions"],
  { cwd: repoRoot, stdio: "inherit" }
);

console.log(`[adc-verslag-ochtend] ${new Date().toISOString()} — klaar`);

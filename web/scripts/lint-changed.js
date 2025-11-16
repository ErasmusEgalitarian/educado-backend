#!/usr/bin/env node
/* eslint-disable no-console */

import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __root = path.resolve(__dirname, "..");

// Check if --fix flag is passed
const shouldFix = process.argv.includes("--fix");

try {
  // Get changed files compared to origin/dev
  const changedFiles = execSync(
    "git diff --name-only --diff-filter=d origin/dev HEAD",
    { cwd: __root, encoding: "utf-8" }
  )
    .split("\n")
    .filter((file) => file.trim())
    // Only lint TypeScript/TSX files
    .filter((file) => /\.(ts|tsx)$/.test(file))
    // Filter to only files in the web directory (since we're running from web workspace)
    .filter((file) => file.startsWith("web/") || file.startsWith("web\\"))
    // Remove 'web/' prefix since we're already in the web directory
    .map((file) => file.replace(/^web[/\\]/, ""))
    // Filter out test files and config files if needed
    .filter((file) => !file.includes("node_modules"))
    .map((file) => path.join(__root, file));

  if (changedFiles.length === 0) {
    console.log("No TypeScript files changed in web/ compared to origin/dev");
    process.exit(0);
  }

  console.log(`Found ${changedFiles.length} changed TypeScript file(s):`);
  for (const file of changedFiles) {
    console.log(`  - ${path.relative(__root, file)}`);
  }
  console.log();

  // Run ESLint on changed files
  const eslintCmd = [
    "cross-env ENV_PATH=../.env eslint",
    shouldFix ? "--fix" : "",
    ...changedFiles.map((file) => `"${file}"`),
  ]
    .filter(Boolean)
    .join(" ");

  execSync(eslintCmd, { cwd: __root, stdio: "inherit" });
  process.exit(0);
} catch (error) {
  // execSync throws if the command exits with non-zero code
  // We want to let ESLint's exit code through
  if (error.status !== undefined) {
    process.exit(error.status);
  }
  console.error("Error:", error.message);
  process.exit(1);
}

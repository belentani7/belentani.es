#!/usr/bin/env node
/**
 * Zero-dependency release security gate.
 * Checks resolved lockfile versions, not only permissive package ranges.
 * Security release baselines verified 2026-10-24.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const project = resolve(process.argv.find(arg => arg.startsWith("--project="))?.slice(10) ?? ".");
const jsonOutput = process.argv.includes("--json");
const issues = [];
const notices = [];
const read = name => readFileSync(join(project, name), "utf8");
const compare = (version, baseline) => {
  const current = String(version).split(".").map(Number);
  const minimum = String(baseline).split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (current[i] !== minimum[i]) return current[i] > minimum[i] ? 1 : -1;
  }
  return 0;
};
const installedNext = () => {
  if (existsSync(join(project, "pnpm-lock.yaml"))) {
    return [...new Set([...read("pnpm-lock.yaml").matchAll(/^  next@(\d+\.\d+\.\d+):/gm)].map(x => x[1]))];
  }
  if (existsSync(join(project, "package-lock.json"))) {
    const lock = JSON.parse(read("package-lock.json"));
    return [lock.packages?.["node_modules/next"]?.version].filter(Boolean);
  }
  return [];
};

const manifest = JSON.parse(read("package.json"));
const nextRange = manifest.dependencies?.next ?? manifest.devDependencies?.next;
if (nextRange) {
  const versions = installedNext();
  if (!versions.length) issues.push("Next.js lockfile missing/unrecognized; installed version is not verifiable.");
  for (const version of versions) {
    const major = Number(version.split(".")[0]);
    const baseline = major === 16 ? "16.4.1" : major === 15 ? "15.5.28" : null;
    if (!baseline || compare(version, baseline) < 0) {
      issues.push(`Next.js ${version} is not patched (${major === 16 ? "requires >=16.4.1; prefer 16.4.3" : major === 15 ? "requires >=15.5.28" : "unsupported release; migrate to 16.4.3"}).`);
    }
  }
  if (!versions.length && !existsSync(join(project, "pnpm-lock.yaml")) && !existsSync(join(project, "package-lock.json"))) {
    notices.push("Commit a deterministic lockfile before deploying.");
  }
}
const node = process.versions.node;
const major = Number(node.split(".")[0]);
const supported = { 22: "22.23.4", 24: "24.22.1", 26: "26.12.1" };
if (!supported[major]) issues.push(`Node.js ${node} is outside currently supported 22/24/26 lines.`);
else if (compare(node, supported[major]) < 0) issues.push(`Node.js ${node} predates 2026-10-21 fixes; use >=${supported[major]}.`);
const ts = manifest.devDependencies?.typescript ?? manifest.dependencies?.typescript;
if (ts && /beta|canary|rc|next/i.test(ts)) notices.push(`TypeScript ${ts} is prerelease: do not deploy without compatibility tests.`);
const report = {
  project: manifest.name ?? project,
  node, nextDeclared: nextRange ?? null, nextLocked: nextRange ? installedNext() : [],
  issues, notices, baselineDate: "2026-10-24",
  references: [
    "https://nextjs.org/blog/nextjs-security-update-october-14-2026",
    "https://nodejs.org/en/blog/vulnerability/october-2026-security-releases",
    "https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/"
  ]
};
if (jsonOutput) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`Security release audit: ${report.project}; Node ${node}; Next: ${report.nextLocked.join(", ") || "n/a"}`);
  for (const item of issues) console.error(`FAIL: ${item}`);
  for (const item of notices) console.warn(`NOTE: ${item}`);
  if (!issues.length) console.log("PASS: known release-security baselines satisfied.");
}
if (issues.length) process.exitCode = 1;

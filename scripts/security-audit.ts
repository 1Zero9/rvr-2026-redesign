#!/usr/bin/env node
/**
 * Security audit — static analysis of the RVR codebase.
 *
 * Checks:
 *   1. NEXT_PUBLIC_ env vars with sensitive-sounding names (would be exposed to browser)
 *   2. Hardcoded credential strings (Stripe keys, DB URLs, tokens)
 *   3. Server-only env vars read inside 'use client' components
 *   4. Hardcoded fallback credentials in DB/config files
 *   5. Sensitive filenames that should never be committed
 *
 * Run: npx tsx scripts/security-audit.ts
 * Exit code 0 = clean, 1 = findings requiring attention
 */

import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROOT = path.resolve(process.cwd());

const IGNORE_DIRS = new Set([
  "node_modules", ".next", ".git", "coverage", "dist", "out",
]);

const SERVER_ONLY_VARS = [
  "DATABASE_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "SPORTLOMO_API_KEY",
  "SPORTLOMO_BASE_URL",
  "SPORTLOMO_CLUB_ID",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "CRON_SECRET",
  "WELFARE_OFFICER_EMAIL",
];

// Regex patterns that should never appear in source files
const FORBIDDEN_PATTERNS: Array<{ pattern: RegExp; description: string }> = [
  { pattern: /sk_live_[a-zA-Z0-9_]+/, description: "Hardcoded Stripe LIVE secret key" },
  { pattern: /sk_test_[a-zA-Z0-9_]+/, description: "Hardcoded Stripe TEST secret key" },
  { pattern: /whsec_[a-zA-Z0-9_]+/, description: "Hardcoded Stripe webhook secret" },
  { pattern: /rk_live_[a-zA-Z0-9_]+/, description: "Hardcoded Stripe restricted key" },
  { pattern: /postgres:\/\/[^'"`\s]+:[^'"`\s@]+@[^'"`\s]+/, description: "Hardcoded PostgreSQL connection string with credentials" },
  { pattern: /mysql:\/\/[^'"`\s]+:[^'"`\s@]+@/, description: "Hardcoded MySQL connection string" },
  { pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/, description: "Hardcoded SendGrid API key" },
  { pattern: /AKIA[0-9A-Z]{16}/, description: "Hardcoded AWS access key" },
];

// NEXT_PUBLIC_ prefix with a sensitive variable name suffix
const SENSITIVE_PUBLIC_SUFFIXES = [
  "SECRET", "KEY", "TOKEN", "PASSWORD", "PASS", "PWD", "DATABASE", "DB_URL",
  "COMET", "WEBHOOK", "PRIVATE",
];

// Files/paths that must never exist in the repo
const FORBIDDEN_FILES = [".env", ".env.production", ".env.staging", "*.pem", "*.key"];

// ---------------------------------------------------------------------------
// File walker
// ---------------------------------------------------------------------------

function* walkDir(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkDir(full);
    } else {
      yield full;
    }
  }
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

interface Finding {
  severity: "ERROR" | "WARN" | "INFO";
  file: string;
  line?: number;
  message: string;
}

const findings: Finding[] = [];

function error(file: string, message: string, line?: number) {
  findings.push({ severity: "ERROR", file, line, message });
}
function warn(file: string, message: string, line?: number) {
  findings.push({ severity: "WARN", file, line, message });
}

function relativePath(abs: string): string {
  return path.relative(ROOT, abs);
}

// Check 1 & 2: scan source files
function auditSourceFile(filePath: string): void {
  const ext = path.extname(filePath);
  if (![".ts", ".tsx", ".js", ".jsx", ".mts"].includes(ext)) return;

  const rel = relativePath(filePath);
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  const isClientComponent = lines.some(
    (l) => l.trim() === "'use client';" || l.trim() === '"use client";',
  );

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check 1: NEXT_PUBLIC_ vars with sensitive names in any file
    const publicMatches = [...line.matchAll(/NEXT_PUBLIC_([A-Z0-9_]+)/g)];
    for (const m of publicMatches) {
      const suffix = m[1];
      if (SENSITIVE_PUBLIC_SUFFIXES.some((s) => suffix.includes(s))) {
        error(rel, `NEXT_PUBLIC_${suffix} would be exposed to the browser — use a server-only variable name`, lineNum);
      }
    }

    // Check 2: Hardcoded credential patterns (not in comments)
    const stripped = line.replace(/\/\/.*$/, "").replace(/\/\*.*?\*\//g, "");
    for (const { pattern, description } of FORBIDDEN_PATTERNS) {
      if (pattern.test(stripped)) {
        error(rel, description, lineNum);
      }
    }

    // Check 3: Server-only env vars accessed in client components
    if (isClientComponent) {
      for (const varName of SERVER_ONLY_VARS) {
        if (stripped.includes(`process.env.${varName}`)) {
          warn(
            rel,
            `'use client' component reads server-only env var: process.env.${varName} — this will be undefined in the browser`,
            lineNum,
          );
        }
      }
    }

    // Check 4: Hardcoded fallback credentials
    if (
      stripped.includes("?? \"postgresql://") ||
      stripped.includes("?? 'postgresql://") ||
      stripped.includes('?? "mysql://') ||
      stripped.includes("?? 'mysql://")
    ) {
      warn(rel, "Hardcoded DB URL fallback — remove; throw instead if env var is missing", lineNum);
    }
  }
}

// Check 5: sensitive file existence
function auditSensitiveFiles(): void {
  const sensitivePatterns = [
    /^\.env$/,
    /^\.env\.production$/,
    /^\.env\.staging$/,
    /\.pem$/,
    /\.key$/,
    /id_rsa$/,
  ];

  for (const filePath of walkDir(ROOT)) {
    const base = path.basename(filePath);
    for (const pat of sensitivePatterns) {
      if (pat.test(base)) {
        // Only flag if the file is not .env.local (which is the correct dev pattern)
        if (base !== ".env.local" && base !== ".env.test.local") {
          warn(relativePath(filePath), `Sensitive file should not exist in the repository`);
        }
      }
    }
  }
}

// Check 6: verify .gitignore covers .env files
function auditGitignore(): void {
  const giPath = path.join(ROOT, ".gitignore");
  if (!fs.existsSync(giPath)) {
    error(".gitignore", ".gitignore does not exist — env files may be committed accidentally");
    return;
  }
  const gi = fs.readFileSync(giPath, "utf-8");
  if (!gi.includes(".env")) {
    error(".gitignore", ".env files are not covered by .gitignore");
  }
}

// ---------------------------------------------------------------------------
// Run all checks
// ---------------------------------------------------------------------------

console.log("\n🔍  RVR Security Audit\n" + "=".repeat(50));

auditGitignore();
auditSensitiveFiles();

for (const filePath of walkDir(ROOT)) {
  auditSourceFile(filePath);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const errors = findings.filter((f) => f.severity === "ERROR");
const warnings = findings.filter((f) => f.severity === "WARN");

if (findings.length === 0) {
  console.log("\n✅  No security findings. Clean.\n");
  process.exit(0);
}

if (errors.length > 0) {
  console.log(`\n❌  ERRORS (${errors.length}) — must fix before production deploy:\n`);
  for (const f of errors) {
    const loc = f.line ? `:${f.line}` : "";
    console.log(`   ${f.file}${loc}`);
    console.log(`   → ${f.message}\n`);
  }
}

if (warnings.length > 0) {
  console.log(`\n⚠️   WARNINGS (${warnings.length}) — review recommended:\n`);
  for (const f of warnings) {
    const loc = f.line ? `:${f.line}` : "";
    console.log(`   ${f.file}${loc}`);
    console.log(`   → ${f.message}\n`);
  }
}

console.log(
  `\n${"=".repeat(50)}\nSummary: ${errors.length} error(s), ${warnings.length} warning(s)\n`,
);

process.exit(errors.length > 0 ? 1 : 0);

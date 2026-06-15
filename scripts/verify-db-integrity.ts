#!/usr/bin/env node
/**
 * Database integrity verifier — checks for placeholder data, stuck orders,
 * and coaching profiles that would fail the public API compliance gate.
 *
 * Run: npx tsx scripts/verify-db-integrity.ts
 * Exit code 0 = clean, 1 = integrity issues found
 */

import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface Issue {
  severity: "ERROR" | "WARN";
  table: string;
  id: string;
  detail: string;
}

const issues: Issue[] = [];

function err(table: string, id: string, detail: string) {
  issues.push({ severity: "ERROR", table, id, detail });
}
function warn(table: string, id: string, detail: string) {
  issues.push({ severity: "WARN", table, id, detail });
}

// Placeholder strings that indicate unverified / demo data
const PLACEHOLDER_PATTERNS = [
  /^(test|demo|example|placeholder|coach \d+|player \d+|member \d+|n\/a|tbd|unknown)$/i,
  /^(john doe|jane doe|first name|last name)$/i,
  /^(sarah mitchell|brian example)$/i, // known demo names from beta site
];

function isPlaceholder(s: string): boolean {
  return PLACEHOLDER_PATTERNS.some((p) => p.test(s.trim()));
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS = 7 * TWENTY_FOUR_HOURS;

// ---------------------------------------------------------------------------
// Check: StaffMember profiles
// ---------------------------------------------------------------------------

async function checkStaffMembers(): Promise<void> {
  const staff = await prisma.staffMember.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      faiCometId: true,
      isGardaVetted: true,
      isVettingExpired: true,
      isSafeguarding1Current: true,
      isClubMarkCompliant: true,
      isActivelyCoaching: true,
      gardaVettingApprovedAt: true,
      lastComplianceCheckedAt: true,
    },
  });

  for (const s of staff) {
    const label = `${s.firstName} ${s.lastName}`;

    if (isPlaceholder(s.firstName) || isPlaceholder(s.lastName)) {
      err("StaffMember", s.id, `Placeholder name detected: "${label}"`);
    }

    if (!isValidEmail(s.email)) {
      err("StaffMember", s.id, `Invalid email: "${s.email}"`);
    }

    if (isPlaceholder(s.email.split("@")[0])) {
      warn("StaffMember", s.id, `Placeholder-looking email: "${s.email}"`);
    }

    if (!s.faiCometId) {
      warn("StaffMember", s.id, `${label} has no FAI COMET ID recorded`);
    }

    // Compliance flag consistency check
    if (s.isGardaVetted && s.isVettingExpired) {
      err("StaffMember", s.id, `${label} has isGardaVetted=true AND isVettingExpired=true — inconsistent state`);
    }

    if (s.isClubMarkCompliant && (!s.isGardaVetted || s.isVettingExpired || !s.isSafeguarding1Current)) {
      err("StaffMember", s.id, `${label} marked isClubMarkCompliant=true but fails compliance conditions`);
    }

    if (s.isActivelyCoaching && !s.isClubMarkCompliant) {
      warn("StaffMember", s.id, `${label} is actively coaching but NOT Club Mark compliant — hidden from public API`);
    }

    // Stale compliance check
    if (s.lastComplianceCheckedAt) {
      const staleDays = Math.floor((Date.now() - s.lastComplianceCheckedAt.getTime()) / 86_400_000);
      if (staleDays > 10) {
        warn("StaffMember", s.id, `${label} compliance last checked ${staleDays} days ago (cron may not be running)`);
      }
    } else if (s.isActivelyCoaching) {
      warn("StaffMember", s.id, `${label} has never had a compliance check run`);
    }
  }

  console.log(`  StaffMember: checked ${staff.length} profile(s)`);
}

// ---------------------------------------------------------------------------
// Check: MembershipOrder
// ---------------------------------------------------------------------------

async function checkMembershipOrders(): Promise<void> {
  const stuckPending = await prisma.membershipOrder.findMany({
    where: {
      status: "PENDING",
      createdAt: { lt: new Date(Date.now() - TWENTY_FOUR_HOURS) },
    },
    select: { id: true, contactEmail: true, totalAmountCents: true, createdAt: true },
  });

  for (const o of stuckPending) {
    const ageHours = Math.floor((Date.now() - o.createdAt.getTime()) / 3_600_000);
    warn(
      "MembershipOrder",
      o.id,
      `Stuck in PENDING for ${ageHours}h (email: ${o.contactEmail ?? "none"}, amount: €${(o.totalAmountCents / 100).toFixed(2)})`,
    );
  }

  // Check for orders with no members (data integrity violation)
  const ordersWithNoMembers = await prisma.membershipOrder.findMany({
    where: { members: { none: {} } },
    select: { id: true, status: true, createdAt: true },
  });

  for (const o of ordersWithNoMembers) {
    err("MembershipOrder", o.id, `Order has zero MembershipMember rows — orphaned record`);
  }

  console.log(
    `  MembershipOrder: ${stuckPending.length} stuck PENDING, ${ordersWithNoMembers.length} orphaned`,
  );
}

// ---------------------------------------------------------------------------
// Check: StripeSubscription
// ---------------------------------------------------------------------------

async function checkSubscriptions(): Promise<void> {
  const pastDue = await prisma.stripeSubscription.findMany({
    where: { status: "PAST_DUE" },
    select: { id: true, stripeSubscriptionId: true, billingEmail: true, currentPeriodEnd: true },
  });

  for (const sub of pastDue) {
    const isOverdue = sub.currentPeriodEnd && sub.currentPeriodEnd < new Date();
    if (isOverdue) {
      err(
        "StripeSubscription",
        sub.id,
        `Past-due subscription with expired period: ${sub.stripeSubscriptionId} (${sub.billingEmail})`,
      );
    } else {
      warn(
        "StripeSubscription",
        sub.id,
        `Past-due subscription still within grace period: ${sub.stripeSubscriptionId} (${sub.billingEmail})`,
      );
    }
  }

  // Subscriptions with no associated orders
  const orphaned = await prisma.stripeSubscription.findMany({
    where: { membershipOrders: { none: {} }, status: { not: "CANCELLED" } },
    select: { id: true, stripeSubscriptionId: true, billingEmail: true },
  });

  for (const sub of orphaned) {
    warn("StripeSubscription", sub.id, `Active subscription with no linked MembershipOrders: ${sub.stripeSubscriptionId}`);
  }

  console.log(
    `  StripeSubscription: ${pastDue.length} past-due, ${orphaned.length} orphaned`,
  );
}

// ---------------------------------------------------------------------------
// Check: ComplianceAlert
// ---------------------------------------------------------------------------

async function checkComplianceAlerts(): Promise<void> {
  const unresolved = await prisma.complianceAlert.findMany({
    where: { status: { in: ["PENDING", "EMAIL_SENT"] } },
    select: {
      id: true,
      alertType: true,
      status: true,
      triggeredAt: true,
      staff: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  for (const a of unresolved) {
    const ageMs = Date.now() - a.triggeredAt.getTime();
    const ageDays = Math.floor(ageMs / 86_400_000);
    const name = `${a.staff.firstName} ${a.staff.lastName}`;

    if (a.status === "PENDING" && ageMs > TWENTY_FOUR_HOURS) {
      warn("ComplianceAlert", a.id, `${a.alertType} for ${name} (${a.staff.email}) has been PENDING for ${ageDays} days — email not sent`);
    }
    if (a.alertType === "VETTING_EXPIRED" && ageDays > 7) {
      err("ComplianceAlert", a.id, `VETTING_EXPIRED for ${name} unresolved for ${ageDays} days — coach may still be active`);
    }
  }

  console.log(`  ComplianceAlert: ${unresolved.length} open alert(s)`);
}

// ---------------------------------------------------------------------------
// Check: MembershipMember placeholder data
// ---------------------------------------------------------------------------

async function checkMembershipMembers(): Promise<void> {
  const members = await prisma.membershipMember.findMany({
    select: { id: true, firstName: true, lastName: true, orderId: true },
  });

  let placeholderCount = 0;
  for (const m of members) {
    if (isPlaceholder(m.firstName) || isPlaceholder(m.lastName)) {
      err("MembershipMember", m.id, `Placeholder name: "${m.firstName} ${m.lastName}" in order ${m.orderId}`);
      placeholderCount++;
    }
  }

  console.log(`  MembershipMember: checked ${members.length} record(s), ${placeholderCount} placeholder(s)`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("\n🔬  RVR Database Integrity Verifier\n" + "=".repeat(50));

  try {
    await checkStaffMembers();
    await checkMembershipOrders();
    await checkSubscriptions();
    await checkComplianceAlerts();
    await checkMembershipMembers();
  } finally {
    await prisma.$disconnect();
  }

  const errors = issues.filter((i) => i.severity === "ERROR");
  const warnings = issues.filter((i) => i.severity === "WARN");

  console.log("\n" + "=".repeat(50));

  if (issues.length === 0) {
    console.log("✅  All integrity checks passed.\n");
    process.exit(0);
  }

  if (errors.length > 0) {
    console.log(`\n❌  ERRORS (${errors.length}):\n`);
    for (const i of errors) {
      console.log(`   [${i.table}] id=${i.id}`);
      console.log(`   → ${i.detail}\n`);
    }
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️   WARNINGS (${warnings.length}):\n`);
    for (const i of warnings) {
      console.log(`   [${i.table}] id=${i.id}`);
      console.log(`   → ${i.detail}\n`);
    }
  }

  console.log(`Summary: ${errors.length} error(s), ${warnings.length} warning(s)\n`);
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

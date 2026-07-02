import { NextRequest, NextResponse } from "next/server";
import { GlobalRole, VettingStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// 3 years expressed in milliseconds using the Julian year (365.25 days).
const VETTING_VALIDITY_MS = 3 * 365.25 * 24 * 60 * 60 * 1000;

// FAI COMET IDs are 6–12 digit numeric strings issued by faiconnect.ie/mycomet.
const COMET_ID_PATTERN = /^\d{6,12}$/;

// Renewal submissions are accepted up to 90 days before expiry.
const RENEWAL_WINDOW_MS = 90 * 24 * 60 * 60 * 1000;

async function requireVettingAdmin(): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    session.user.globalRole !== GlobalRole.SITE_ADMIN &&
    session.user.globalRole !== GlobalRole.SUPER_ADMIN
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

function isVettingExpired(approvedAt: Date): boolean {
  return Date.now() - approvedAt.getTime() > VETTING_VALIDITY_MS;
}

function computeExpiresAt(approvedAt: Date): Date {
  return new Date(approvedAt.getTime() + VETTING_VALIDITY_MS);
}

function daysUntilExpiry(approvedAt: Date): number {
  return Math.ceil(
    (computeExpiresAt(approvedAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000),
  );
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

interface CoachVettingSummary {
  coachId: string;
  fullName: string;
  vettingStatus: VettingStatus;
  approvedAt: string;
  expiresAt: string;
  nowMarkedExpired: boolean;
}

interface StaffVettingSummary {
  staffId: string;
  fullName: string;
  faiCometId: string | null;
  approvedAt: string | null;
  expiresAt: string | null;
  status: "active" | "expired" | "pending";
  nowMarkedExpired: boolean;
}

// ---------------------------------------------------------------------------
// GET /api/club/vetting
//
// Sweeps CoachProfile (VettingStatus enum) and StaffMember (boolean flags).
// Any record whose 3-year window has lapsed is written as EXPIRED in one pass.
//
// Response:
//   {
//     coaches: { checked, nowExpired, alreadyExpired, records }
//     staff:   { checked, nowExpired, alreadyExpired, records }
//   }
// ---------------------------------------------------------------------------

export async function GET(): Promise<NextResponse> {
  const authError = await requireVettingAdmin();
  if (authError) return authError;

  try {
    // ---- CoachProfile sweep ------------------------------------------------
    const coaches = await prisma.coachProfile.findMany({
      where: { vettingApprovedAt: { not: null } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        vettingStatus: true,
        vettingApprovedAt: true,
      },
    });

    const toExpireCoachIds: string[] = [];
    let alreadyExpiredCoaches = 0;
    const coachSummaries: CoachVettingSummary[] = [];

    for (const coach of coaches) {
      const approved = coach.vettingApprovedAt as Date;
      const expired = isVettingExpired(approved);
      const alreadyFlagged = coach.vettingStatus === VettingStatus.EXPIRED;

      if (expired && !alreadyFlagged) {
        toExpireCoachIds.push(coach.id);
      } else if (alreadyFlagged) {
        alreadyExpiredCoaches++;
      }

      coachSummaries.push({
        coachId: coach.id,
        fullName: `${coach.firstName} ${coach.lastName}`,
        vettingStatus: expired ? VettingStatus.EXPIRED : coach.vettingStatus,
        approvedAt: approved.toISOString(),
        expiresAt: computeExpiresAt(approved).toISOString(),
        nowMarkedExpired: expired && !alreadyFlagged,
      });
    }

    if (toExpireCoachIds.length > 0) {
      await Promise.all(
        toExpireCoachIds.map((id) => {
          const coach = coaches.find((c) => c.id === id)!;
          return prisma.coachProfile.update({
            where: { id },
            data: {
              vettingStatus: VettingStatus.EXPIRED,
              vettingExpiresAt: computeExpiresAt(coach.vettingApprovedAt as Date),
            },
          });
        }),
      );
    }

    // ---- StaffMember sweep -------------------------------------------------
    const staffMembers = await prisma.staffMember.findMany({
      where: { isGardaVetted: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        faiCometId: true,
        isVettingExpired: true,
        gardaVettingApprovedAt: true,
      },
    });

    const toExpireStaffIds: string[] = [];
    let alreadyExpiredStaff = 0;
    const staffSummaries: StaffVettingSummary[] = [];

    for (const member of staffMembers) {
      const approved = member.gardaVettingApprovedAt;

      if (!approved) {
        staffSummaries.push({
          staffId: member.id,
          fullName: `${member.firstName} ${member.lastName}`,
          faiCometId: member.faiCometId,
          approvedAt: null,
          expiresAt: null,
          status: "pending",
          nowMarkedExpired: false,
        });
        continue;
      }

      const expired = isVettingExpired(approved);

      if (expired && !member.isVettingExpired) {
        toExpireStaffIds.push(member.id);
      } else if (member.isVettingExpired) {
        alreadyExpiredStaff++;
      }

      staffSummaries.push({
        staffId: member.id,
        fullName: `${member.firstName} ${member.lastName}`,
        faiCometId: member.faiCometId,
        approvedAt: approved.toISOString(),
        expiresAt: computeExpiresAt(approved).toISOString(),
        status: expired ? "expired" : "active",
        nowMarkedExpired: expired && !member.isVettingExpired,
      });
    }

    if (toExpireStaffIds.length > 0) {
      await prisma.staffMember.updateMany({
        where: { id: { in: toExpireStaffIds } },
        data: {
          isVettingExpired: true,
          isGardaVetted: false,
          isClubMarkCompliant: false,
          lastComplianceCheckedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      coaches: {
        checked: coaches.length,
        nowExpired: toExpireCoachIds.length,
        alreadyExpired: alreadyExpiredCoaches,
        records: coachSummaries,
      },
      staff: {
        checked: staffMembers.length,
        nowExpired: toExpireStaffIds.length,
        alreadyExpired: alreadyExpiredStaff,
        records: staffSummaries,
      },
    });
  } catch (err) {
    console.error("[api/club/vetting] GET error:", err);
    return NextResponse.json(
      { error: "Failed to evaluate vetting status" },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/club/vetting
//
// Records or renews a Garda Vetting approval for a StaffMember.
// Only submissions carrying a valid FAI COMET portal ID are accepted.
// Paper-based submissions are rejected as legally invalid under FAI policy.
//
// Request body:
//   {
//     staffId:    string   — StaffMember.id
//     cometId:    string   — 6–12 digit numeric ID from faiconnect.ie/mycomet
//     approvedAt: string   — ISO 8601 date printed on the vetting letter
//     paperBased: boolean  — must be absent or false; true is rejected immediately
//   }
//
// 200  { staffId, fullName, cometId, approvedAt, expiresAt, daysUntilExpiry, status }
// 400  { error, field? }
// 404  { error }
// 409  { error, expiresAt, daysUntilExpiry }   vetting is current, not in renewal window
// ---------------------------------------------------------------------------

interface VettingPostBody {
  staffId?: unknown;
  cometId?: unknown;
  approvedAt?: unknown;
  paperBased?: unknown;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const authError = await requireVettingAdmin();
  if (authError) return authError;

  let body: VettingPostBody;

  try {
    body = (await req.json()) as VettingPostBody;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  // Reject paper-based submissions — only FAI COMET portal submissions are valid.
  if (body.paperBased === true) {
    return NextResponse.json(
      {
        error:
          "Paper-based vetting submissions are not accepted. All Garda Vetting must be completed through the FAI COMET portal at faiconnect.ie/mycomet.",
      },
      { status: 400 },
    );
  }

  // Validate staffId
  if (typeof body.staffId !== "string" || !body.staffId.trim()) {
    return NextResponse.json(
      { error: "staffId is required", field: "staffId" },
      { status: 400 },
    );
  }

  // Validate cometId — must be a numeric string matching the COMET portal format.
  if (typeof body.cometId !== "string" || !body.cometId.trim()) {
    return NextResponse.json(
      {
        error:
          "cometId is required. Obtain your FAI COMET submission ID at faiconnect.ie/mycomet.",
        field: "cometId",
      },
      { status: 400 },
    );
  }

  const cometId = body.cometId.trim();

  if (!COMET_ID_PATTERN.test(cometId)) {
    return NextResponse.json(
      {
        error:
          "cometId must be a 6–12 digit numeric string as issued by the FAI COMET portal. Mock IDs and non-numeric formats are not accepted.",
        field: "cometId",
      },
      { status: 400 },
    );
  }

  // Validate approvedAt
  if (typeof body.approvedAt !== "string" || !body.approvedAt.trim()) {
    return NextResponse.json(
      {
        error: "approvedAt is required (ISO 8601 date string)",
        field: "approvedAt",
      },
      { status: 400 },
    );
  }

  const approvedDate = new Date(body.approvedAt);

  if (isNaN(approvedDate.getTime())) {
    return NextResponse.json(
      {
        error: "approvedAt must be a valid ISO 8601 date string",
        field: "approvedAt",
      },
      { status: 400 },
    );
  }

  if (approvedDate > new Date()) {
    return NextResponse.json(
      { error: "approvedAt cannot be a future date", field: "approvedAt" },
      { status: 400 },
    );
  }

  const staffId = body.staffId.trim();

  const existing = await prisma.staffMember.findUnique({
    where: { id: staffId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      isGardaVetted: true,
      isVettingExpired: true,
      gardaVettingApprovedAt: true,
    },
  });

  if (!existing) {
    return NextResponse.json(
      { error: `No staff member found with id: ${staffId}` },
      { status: 404 },
    );
  }

  // Block renewal if the current approval is still active and outside the 90-day window.
  if (
    existing.isGardaVetted &&
    !existing.isVettingExpired &&
    existing.gardaVettingApprovedAt &&
    !isVettingExpired(existing.gardaVettingApprovedAt)
  ) {
    const expiry = computeExpiresAt(existing.gardaVettingApprovedAt);
    const remainingMs = expiry.getTime() - Date.now();

    if (remainingMs > RENEWAL_WINDOW_MS) {
      return NextResponse.json(
        {
          error: `Vetting is current. Renewal submissions open 90 days before expiry.`,
          expiresAt: expiry.toISOString(),
          daysUntilExpiry: Math.ceil(remainingMs / (24 * 60 * 60 * 1000)),
        },
        { status: 409 },
      );
    }
  }

  const expired = isVettingExpired(approvedDate);
  const expiry = computeExpiresAt(approvedDate);

  try {
    await prisma.staffMember.update({
      where: { id: staffId },
      data: {
        faiCometId: cometId,
        isGardaVetted: !expired,
        isVettingExpired: expired,
        gardaVettingApprovedAt: approvedDate,
        lastComplianceCheckedAt: new Date(),
      },
    });
  } catch (err) {
    console.error("[api/club/vetting] POST update error:", err);
    return NextResponse.json(
      { error: "Failed to record vetting approval" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    staffId,
    fullName: `${existing.firstName} ${existing.lastName}`,
    cometId,
    approvedAt: approvedDate.toISOString(),
    expiresAt: expiry.toISOString(),
    daysUntilExpiry: expired ? 0 : daysUntilExpiry(approvedDate),
    status: expired ? "expired" : "active",
  });
}

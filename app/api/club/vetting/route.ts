import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const VETTING_VALIDITY_MS = 3 * 365.25 * 24 * 60 * 60 * 1000; // 3 years in ms

// FAI COMET IDs are 6–12 digit numeric strings issued by faiconnect.ie/mycomet.
const COMET_ID_PATTERN = /^\d{6,12}$/;

// ---------------------------------------------------------------------------
// Expiration check
// ---------------------------------------------------------------------------

function isVettingExpired(approvedAt: Date): boolean {
  return Date.now() - approvedAt.getTime() > VETTING_VALIDITY_MS;
}

function expiresAt(approvedAt: Date): Date {
  return new Date(approvedAt.getTime() + VETTING_VALIDITY_MS);
}

// ---------------------------------------------------------------------------
// GET /api/club/vetting
//
// Sweeps all Garda-vetted staff members and marks any whose 3-year window has
// lapsed as expired. Safe to call from the weekly cron or an admin dashboard.
//
// Response shape:
//   { checked: number, nowExpired: number, alreadyExpired: number, staff: VettingSummary[] }
// ---------------------------------------------------------------------------

interface VettingSummary {
  staffId: string;
  fullName: string;
  faiCometId: string | null;
  approvedAt: string | null;
  expiresAt: string | null;
  status: "active" | "expired" | "pending";
}

export async function GET(): Promise<NextResponse> {
  try {
    const staff = await prisma.staffMember.findMany({
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

    const expiredIds: string[] = [];
    let alreadyExpired = 0;
    const summaries: VettingSummary[] = [];

    for (const member of staff) {
      const approved = member.gardaVettingApprovedAt;

      if (!approved) {
        summaries.push({
          staffId: member.id,
          fullName: `${member.firstName} ${member.lastName}`,
          faiCometId: member.faiCometId,
          approvedAt: null,
          expiresAt: null,
          status: "pending",
        });
        continue;
      }

      const expired = isVettingExpired(approved);

      if (expired && !member.isVettingExpired) {
        expiredIds.push(member.id);
      } else if (member.isVettingExpired) {
        alreadyExpired++;
      }

      summaries.push({
        staffId: member.id,
        fullName: `${member.firstName} ${member.lastName}`,
        faiCometId: member.faiCometId,
        approvedAt: approved.toISOString(),
        expiresAt: expiresAt(approved).toISOString(),
        status: expired ? "expired" : "active",
      });
    }

    if (expiredIds.length > 0) {
      await prisma.staffMember.updateMany({
        where: { id: { in: expiredIds } },
        data: {
          isVettingExpired: true,
          isGardaVetted: false,
          isClubMarkCompliant: false,
          lastComplianceCheckedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      checked: staff.length,
      nowExpired: expiredIds.length,
      alreadyExpired,
      staff: summaries,
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
// Registers or renews a Garda Vetting record for a staff member.
// Requires a valid FAI COMET portal ID — paper-based submissions are rejected.
//
// Request body:
//   {
//     staffId:    string,   // StaffMember.id
//     cometId:    string,   // 6–12 digit ID from faiconnect.ie/mycomet
//     approvedAt: string,   // ISO 8601 date — the date printed on the vetting letter
//   }
//
// Response 200: { staffId, cometId, approvedAt, expiresAt, status }
// Response 400: { error, field? }
// Response 404: { error }
// Response 409: { error } — if vetting is current and not yet within renewal window
// ---------------------------------------------------------------------------

interface VettingPostBody {
  staffId?: unknown;
  cometId?: unknown;
  approvedAt?: unknown;
  paperBased?: unknown;
}

const RENEWAL_WINDOW_MS = 90 * 24 * 60 * 60 * 1000; // allow renewal 90 days before expiry

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: VettingPostBody;

  try {
    body = (await req.json()) as VettingPostBody;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  // Reject any payload that explicitly declares paper-based submission
  if (body.paperBased === true) {
    return NextResponse.json(
      {
        error:
          "Paper-based vetting submissions are not accepted. All Garda Vetting must be submitted through the FAI COMET portal at faiconnect.ie/mycomet.",
      },
      { status: 400 },
    );
  }

  // Validate staffId
  if (!body.staffId || typeof body.staffId !== "string" || !body.staffId.trim()) {
    return NextResponse.json({ error: "staffId is required", field: "staffId" }, { status: 400 });
  }

  // Validate cometId — must be present and match the COMET numeric format
  if (!body.cometId || typeof body.cometId !== "string") {
    return NextResponse.json(
      {
        error:
          "cometId is required. Obtain your FAI COMET ID at faiconnect.ie/mycomet.",
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
          "cometId must be a 6–12 digit numeric string as issued by the FAI COMET portal.",
        field: "cometId",
      },
      { status: 400 },
    );
  }

  // Validate approvedAt
  if (!body.approvedAt || typeof body.approvedAt !== "string") {
    return NextResponse.json(
      { error: "approvedAt is required (ISO 8601 date string)", field: "approvedAt" },
      { status: 400 },
    );
  }

  const approvedDate = new Date(body.approvedAt);

  if (isNaN(approvedDate.getTime())) {
    return NextResponse.json(
      { error: "approvedAt must be a valid ISO 8601 date string", field: "approvedAt" },
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

  // Confirm the staff member exists
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

  // Block renewal if current vetting is still active and outside the 90-day renewal window
  if (
    existing.isGardaVetted &&
    !existing.isVettingExpired &&
    existing.gardaVettingApprovedAt &&
    !isVettingExpired(existing.gardaVettingApprovedAt)
  ) {
    const expiry = expiresAt(existing.gardaVettingApprovedAt);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    if (expiry.getTime() - Date.now() > RENEWAL_WINDOW_MS) {
      return NextResponse.json(
        {
          error: `Vetting is current and cannot be renewed until the 90-day renewal window opens. Days remaining: ${daysUntilExpiry}.`,
          expiresAt: expiry.toISOString(),
          daysUntilExpiry,
        },
        { status: 409 },
      );
    }
  }

  const expired = isVettingExpired(approvedDate);
  const computedExpiry = expiresAt(approvedDate);

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
    expiresAt: computedExpiry.toISOString(),
    status: expired ? "expired" : "active",
  });
}

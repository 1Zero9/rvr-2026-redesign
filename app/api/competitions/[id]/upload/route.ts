import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MAX_UPLOAD_BYTES, parseUpload } from "@/lib/competitions/upload-parser";
import { GlobalRole, AssignmentRole } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";

async function canAccess(userId: string, globalRole: GlobalRole | null, competitionId: string) {
  if (globalRole === GlobalRole.SUPER_ADMIN) return true;
  const a = await prisma.competitionAssignment.findFirst({
    where: { adminUserId: userId, competitionId, role: AssignmentRole.EVENT_ADMIN },
  });
  return !!a;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!await canAccess(session.user.id, session.user.globalRole, id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const competition = await prisma.competition.findUnique({
    where: { id },
    select: { ageGroup: true, dataNoticeAcknowledgedAt: true },
  });
  if (!competition) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const previewOnly = formData.get("preview") === "1";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File is too large. Maximum upload size is 5 MB." }, { status: 413 });
  }

  let rows;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    rows = await parseUpload(buffer, file.name, competition.ageGroup);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to parse upload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (previewOnly) {
    return NextResponse.json({ rows });
  }

  // Record GDPR acknowledgement
  if (!competition.dataNoticeAcknowledgedAt) {
    await prisma.competition.update({
      where: { id },
      data: { dataNoticeAcknowledgedAt: new Date() },
    });
  }

  const batchId = createId();
  const validRows = rows.filter((r) => r.firstName);

  await prisma.playerPoolEntry.createMany({
    data: validRows.map((r) => ({
      id: createId(),
      competitionId: id,
      firstName: r.firstName,
      lastName: r.lastName,
      displayName: r.displayName,
      ageGroup: r.ageGroup ?? null,
      clubOrSchool: r.clubOrSchool ?? null,
      notes: r.notes ?? null,
      availableDays: r.availableDays,
      uploadBatchId: batchId,
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({ imported: validRows.length, skipped: rows.length - validRows.length, batchId });
}

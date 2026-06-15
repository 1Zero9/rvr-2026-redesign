import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface VoteRouteContext {
  params: Promise<{
    id: string;
  }>;
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? "unknown";

  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

function createVoterFingerprint(request: NextRequest) {
  const ipAddress = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  return createHash("sha256")
    .update(`${ipAddress}:${userAgent}`)
    .digest("hex");
}

export async function POST(request: NextRequest, context: VoteRouteContext) {
  const { id } = await context.params;
  const voterFingerprint = createVoterFingerprint(request);

  try {
    const updatedSubmission = await prisma.$transaction(async (tx) => {
      await tx.voteRecord.create({
        data: {
          kitSubmissionId: id,
          voterFingerprint,
        },
      });

      return tx.kitSubmission.update({
        where: { id },
        data: {
          votesCount: {
            increment: 1,
          },
        },
        select: {
          id: true,
          votesCount: true,
        },
      });
    });

    return NextResponse.json({
      submissionId: updatedSubmission.id,
      votesCount: updatedSubmission.votesCount,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { alreadyVoted: true, submissionId: id },
        { status: 409 },
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Kit submission not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Vote could not be recorded." },
      { status: 500 },
    );
  }
}

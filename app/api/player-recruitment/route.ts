import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RecruitmentRequestBody {
  firstName?: string;
  lastName?: string;
  yearOfBirth?: number;
  preferredPosition?: string;
  guardianName?: string;
  email?: string;
  phoneNumber?: string;
  ageGroup?: string;
  isPrivate?: boolean;
}

const currentYear = new Date().getFullYear();

function isU7ToU12(yearOfBirth: number) {
  const age = currentYear - yearOfBirth;
  return age >= 7 && age <= 12;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RecruitmentRequestBody;

  if (
    !body.firstName ||
    !body.lastName ||
    !body.yearOfBirth ||
    !body.email ||
    !body.phoneNumber
  ) {
    return NextResponse.json(
      { message: "Missing required recruitment fields." },
      { status: 400 },
    );
  }

  if (body.yearOfBirth < 2008 || body.yearOfBirth > currentYear - 5) {
    return NextResponse.json(
      { message: "Year of birth is outside the recruitment range." },
      { status: 400 },
    );
  }

  const isPrivate = isU7ToU12(body.yearOfBirth) ? true : Boolean(body.isPrivate);
  const firstName = body.firstName.trim();
  const lastName = body.lastName.trim();
  const position = body.preferredPosition?.trim() || "Flexible";

  const player = await prisma.playerProfile.create({
    data: {
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      yearOfBirth: body.yearOfBirth,
      teamName: body.ageGroup ?? null,
      position,
      profileSummary: `Recruitment interest submitted for ${position}. Contact: ${body.email.trim()} / ${body.phoneNumber.trim()}. Guardian: ${body.guardianName?.trim() || "Not required"}.`,
      isPrivate,
    },
    select: {
      id: true,
      isPrivate: true,
    },
  });

  return NextResponse.json({ player });
}

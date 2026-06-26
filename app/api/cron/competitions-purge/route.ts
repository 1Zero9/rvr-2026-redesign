import { NextRequest, NextResponse } from "next/server";
import { purgeExpiredCompetitions } from "@/lib/competitions/gdpr";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await purgeExpiredCompetitions();
  return NextResponse.json({
    ok: true,
    purgedPlayers: result.purged,
    competitions: result.competitions,
  });
}

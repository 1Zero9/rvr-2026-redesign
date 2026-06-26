import { prisma } from "@/lib/prisma";
import { CompetitionState } from "@prisma/client";

/** Strip lastName from player pool entries before returning to public clients */
export function stripLastName<T extends { lastName?: string }>(
  entry: T,
): Omit<T, "lastName"> {
  const { lastName: _lastName, ...rest } = entry as T & { lastName: string };
  void _lastName;
  return rest;
}

/** Purge player pool data for archived competitions past their retention window */
export async function purgeExpiredCompetitions(): Promise<{
  purged: number;
  competitions: string[];
}> {
  const now = new Date();
  const archived = await prisma.competition.findMany({
    where: { state: CompetitionState.ARCHIVED },
    select: { id: true, name: true, updatedAt: true, dataRetentionDays: true },
  });

  const expired = archived.filter((c) => {
    const deleteAfter = new Date(c.updatedAt);
    deleteAfter.setDate(deleteAfter.getDate() + c.dataRetentionDays);
    return deleteAfter < now;
  });

  let purged = 0;
  const names: string[] = [];

  for (const c of expired) {
    const { count } = await prisma.playerPoolEntry.deleteMany({
      where: { competitionId: c.id },
    });
    purged += count;
    names.push(c.name);
  }

  return { purged, competitions: names };
}

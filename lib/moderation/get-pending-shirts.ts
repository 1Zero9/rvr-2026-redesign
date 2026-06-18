import { prisma } from '@/lib/prisma';
import type { ShirtSubmission } from '@prisma/client';

export async function getPendingShirts(): Promise<ShirtSubmission[]> {
  return prisma.shirtSubmission.findMany({
    where: { moderationStatus: 'PENDING' },
    orderBy: { createdAt: 'asc' },
  });
}

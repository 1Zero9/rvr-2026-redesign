import { prisma } from '@/lib/prisma';
import type { Campaign } from '@prisma/client';

/** Campaigns visible right now: published and inside their date window. */
export async function getActiveCampaigns(
  placement?: 'homepage' | 'banner',
): Promise<Campaign[]> {
  const now = new Date();
  try {
    return await prisma.campaign.findMany({
      where: {
        isPublished: true,
        startsAt: { lte: now },
        OR: [{ endsAt: null }, { endsAt: { gt: now } }],
        ...(placement === 'homepage' ? { showOnHomepage: true } : {}),
        ...(placement === 'banner' ? { showBanner: true } : {}),
      },
      orderBy: { startsAt: 'desc' },
    });
  } catch {
    return [];
  }
}

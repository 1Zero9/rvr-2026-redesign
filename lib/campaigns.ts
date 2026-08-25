import { prisma } from '@/lib/prisma';
import type { Campaign } from '@prisma/client';

/** Campaigns visible right now: published and inside their date window. */
export async function getActiveCampaigns(
  placement?: 'homepage' | 'banner' | 'hero',
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
        ...(placement === 'hero' ? { showInHero: true } : {}),
      },
      orderBy: { startsAt: 'desc' },
    });
  } catch {
    return [];
  }
}

/** The single live campaign (if any) flagged for the floating highlight badge. */
export async function getHighlightedCampaign(): Promise<Campaign | null> {
  const now = new Date();
  try {
    return await prisma.campaign.findFirst({
      where: {
        isPublished: true,
        highlight: true,
        startsAt: { lte: now },
        OR: [{ endsAt: null }, { endsAt: { gt: now } }],
      },
      orderBy: { startsAt: 'desc' },
    });
  } catch {
    return null;
  }
}

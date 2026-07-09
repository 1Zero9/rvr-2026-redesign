import { prisma } from '@/lib/prisma';

export const SPOTLIGHT_INTERVAL_KEY = 'spotlightIntervalSeconds';
export const SPOTLIGHT_INTERVAL_DEFAULT = 7;

export async function getSpotlightIntervalSeconds(): Promise<number> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: SPOTLIGHT_INTERVAL_KEY },
    });
    const parsed = Number(setting?.value);
    return Number.isFinite(parsed) && parsed >= 3 && parsed <= 120
      ? parsed
      : SPOTLIGHT_INTERVAL_DEFAULT;
  } catch {
    return SPOTLIGHT_INTERVAL_DEFAULT;
  }
}

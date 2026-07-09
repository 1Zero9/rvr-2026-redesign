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

export type HeroRotationMode = 'ONCE' | 'CAROUSEL';

export const HERO_ROTATION_MODE_KEY = 'heroRotationMode';
export const HERO_ROTATION_MODE_DEFAULT: HeroRotationMode = 'ONCE';

export const HERO_ROTATION_INTERVAL_KEY = 'heroRotationIntervalSeconds';
export const HERO_ROTATION_INTERVAL_DEFAULT = 8;

export async function getHeroRotationSettings(): Promise<{
  mode: HeroRotationMode;
  intervalSeconds: number;
}> {
  try {
    const [modeSetting, intervalSetting] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: HERO_ROTATION_MODE_KEY } }),
      prisma.siteSetting.findUnique({ where: { key: HERO_ROTATION_INTERVAL_KEY } }),
    ]);
    const mode: HeroRotationMode = modeSetting?.value === 'CAROUSEL' ? 'CAROUSEL' : HERO_ROTATION_MODE_DEFAULT;
    const parsed = Number(intervalSetting?.value);
    const intervalSeconds = Number.isFinite(parsed) && parsed >= 5 && parsed <= 60
      ? parsed
      : HERO_ROTATION_INTERVAL_DEFAULT;
    return { mode, intervalSeconds };
  } catch {
    return { mode: HERO_ROTATION_MODE_DEFAULT, intervalSeconds: HERO_ROTATION_INTERVAL_DEFAULT };
  }
}

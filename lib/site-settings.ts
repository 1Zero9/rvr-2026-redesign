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

/** How often a featured campaign takes a hero slot: every 2nd or every 3rd. */
export const HERO_FEATURE_RATIO_KEY = 'heroFeatureRatio';
export const HERO_FEATURE_RATIO_DEFAULT = 3;

export async function getHeroRotationSettings(): Promise<{
  mode: HeroRotationMode;
  intervalSeconds: number;
  featureRatio: number;
}> {
  try {
    const [modeSetting, intervalSetting, ratioSetting] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: HERO_ROTATION_MODE_KEY } }),
      prisma.siteSetting.findUnique({ where: { key: HERO_ROTATION_INTERVAL_KEY } }),
      prisma.siteSetting.findUnique({ where: { key: HERO_FEATURE_RATIO_KEY } }),
    ]);
    const mode: HeroRotationMode = modeSetting?.value === 'CAROUSEL' ? 'CAROUSEL' : HERO_ROTATION_MODE_DEFAULT;
    const parsed = Number(intervalSetting?.value);
    const intervalSeconds = Number.isFinite(parsed) && parsed >= 5 && parsed <= 60
      ? parsed
      : HERO_ROTATION_INTERVAL_DEFAULT;
    const parsedRatio = Number(ratioSetting?.value);
    const featureRatio = parsedRatio === 2 || parsedRatio === 3 ? parsedRatio : HERO_FEATURE_RATIO_DEFAULT;
    return { mode, intervalSeconds, featureRatio };
  } catch {
    return { mode: HERO_ROTATION_MODE_DEFAULT, intervalSeconds: HERO_ROTATION_INTERVAL_DEFAULT, featureRatio: HERO_FEATURE_RATIO_DEFAULT };
  }
}

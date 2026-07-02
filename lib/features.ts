import { prisma } from '@/lib/prisma';

export const FEATURE_DEFINITIONS = {
  stripePayments: {
    label: 'Stripe payments',
    description: 'Enable membership Stripe checkout and require Stripe deployment secrets.',
    defaultEnabled: false,
  },
  clubLotto: {
    label: 'Club lotto',
    description: 'Show lotto entry controls and allow the external lotto checkout.',
    defaultEnabled: false,
  },
  instagramFeed: {
    label: 'Instagram feed',
    description: 'Show the homepage Instagram preview. Leave off while placeholder posts are in use.',
    defaultEnabled: false,
  },
  anniversaryKit: {
    label: 'Anniversary kit competition',
    description: 'Expose the anniversary kit campaign and public submission workflow.',
    defaultEnabled: true,
  },
} as const;

export type FeatureKey = keyof typeof FEATURE_DEFINITIONS;
export type FeatureAvailability = Record<FeatureKey, boolean>;

export function getDefaultFeatureAvailability(): FeatureAvailability {
  return Object.fromEntries(
    Object.entries(FEATURE_DEFINITIONS).map(([key, definition]) => [
      key,
      definition.defaultEnabled,
    ]),
  ) as FeatureAvailability;
}

export async function getFeatureAvailability(): Promise<FeatureAvailability> {
  const availability = getDefaultFeatureAvailability();

  try {
    const rows = await prisma.siteFeature.findMany({
      where: { key: { in: Object.keys(FEATURE_DEFINITIONS) } },
      select: { key: true, enabled: true },
    });

    for (const row of rows) {
      if (row.key in availability) {
        availability[row.key as FeatureKey] = row.enabled;
      }
    }
  } catch (error) {
    console.warn('[features] Falling back to safe defaults:', error);
  }

  return availability;
}

export async function isFeatureEnabled(key: FeatureKey): Promise<boolean> {
  return (await getFeatureAvailability())[key];
}

import type { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import AdminNav from '@/components/admin/AdminNav';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin/require-admin';
import {
  FEATURE_DEFINITIONS,
  getFeatureAvailability,
  type FeatureKey,
} from '@/lib/features';

export const metadata: Metadata = {
  title: 'Feature Availability | RVR Admin',
  robots: { index: false, follow: false },
};

async function updateFeatures(formData: FormData) {
  'use server';
  await requireAdmin();

  await prisma.$transaction(
    Object.entries(FEATURE_DEFINITIONS).map(([key, definition]) =>
      prisma.siteFeature.upsert({
        where: { key },
        create: {
          key,
          label: definition.label,
          description: definition.description,
          enabled: formData.get(key) === 'on',
        },
        update: {
          label: definition.label,
          description: definition.description,
          enabled: formData.get(key) === 'on',
        },
      }),
    ),
  );

  revalidatePath('/', 'layout');
  revalidatePath('/admin/features');
  revalidatePath('/api/health');
}

export default async function FeatureAvailabilityPage() {
  const availability = await getFeatureAvailability();

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 text-brand-charcoal">
      <div className="mx-auto max-w-4xl">
        <AdminNav />
        <h1 className="font-display text-4xl font-black uppercase italic text-brand-navy">
          Feature Availability
        </h1>
        <p className="mt-2 max-w-2xl font-semibold text-zinc-600">
          Optional features fail closed. Enable them only when their external
          service, content, and deployment configuration are ready.
        </p>

        <form action={updateFeatures} className="mt-8 grid gap-4">
          {Object.entries(FEATURE_DEFINITIONS).map(([key, definition]) => (
            <label
              key={key}
              className="flex cursor-pointer items-start gap-4 border-3 border-brand-charcoal bg-white p-5 shadow-[4px_4px_0_#121212]"
            >
              <input
                type="checkbox"
                name={key}
                defaultChecked={availability[key as FeatureKey]}
                className="mt-1 h-6 w-6 accent-brand-green"
              />
              <span>
                <span className="block font-display text-lg font-black uppercase">
                  {definition.label}
                </span>
                <span className="mt-1 block text-sm font-semibold leading-6 text-zinc-600">
                  {definition.description}
                </span>
              </span>
            </label>
          ))}

          <button
            type="submit"
            className="btn-brutalist-neon mt-4 min-h-12 justify-self-start px-7 py-3 text-sm"
          >
            Save Availability
          </button>
        </form>
      </div>
    </main>
  );
}

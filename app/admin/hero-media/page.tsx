import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin/require-admin';
import {
  HERO_ROTATION_MODE_KEY,
  HERO_ROTATION_INTERVAL_KEY,
  HERO_FEATURE_RATIO_KEY,
  getHeroRotationSettings,
} from '@/lib/site-settings';

export const metadata: Metadata = {
  title: 'Hero Rotation | RVR Admin',
};

const MOTION_LABELS: Record<string, string> = {
  NONE: 'Static',
  ZOOM_IN: 'Zoom in',
  ZOOM_OUT: 'Zoom out',
  PIXELATE: 'Pixelate in',
};

export default async function HeroMediaAdminPage() {
  await requireAdmin();

  const [items, rotation] = await Promise.all([
    prisma.heroMedia.findMany({ orderBy: { sortOrder: 'asc' } }),
    getHeroRotationSettings(),
  ]);
  const enabledCount = items.filter((i) => i.isEnabled).length;

  async function toggleEnabled(formData: FormData) {
    'use server';
    await requireAdmin();
    const { prisma: db } = await import('@/lib/prisma');
    const id = formData.get('id') as string;
    const isEnabled = formData.get('isEnabled') === 'on';
    await db.heroMedia.update({ where: { id }, data: { isEnabled: !isEnabled } });
    revalidatePath('/');
    revalidatePath('/admin/hero-media');
  }

  async function saveRotationSettings(formData: FormData) {
    'use server';
    await requireAdmin();
    const { prisma: db } = await import('@/lib/prisma');
    const mode = formData.get('mode') === 'CAROUSEL' ? 'CAROUSEL' : 'ONCE';
    const intervalSeconds = Math.min(60, Math.max(5, Number(formData.get('intervalSeconds') ?? 8)));
    const featureRatio = formData.get('featureRatio') === '2' ? '2' : '3';
    await Promise.all([
      db.siteSetting.upsert({
        where:  { key: HERO_ROTATION_MODE_KEY },
        create: { key: HERO_ROTATION_MODE_KEY, value: mode },
        update: { value: mode },
      }),
      db.siteSetting.upsert({
        where:  { key: HERO_ROTATION_INTERVAL_KEY },
        create: { key: HERO_ROTATION_INTERVAL_KEY, value: String(intervalSeconds) },
        update: { value: String(intervalSeconds) },
      }),
      db.siteSetting.upsert({
        where:  { key: HERO_FEATURE_RATIO_KEY },
        create: { key: HERO_FEATURE_RATIO_KEY, value: featureRatio },
        update: { value: featureRatio },
      }),
    ]);
    revalidatePath('/');
    redirect('/admin/hero-media');
  }

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 text-brand-charcoal">
      <div className="mx-auto max-w-4xl">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-black italic text-4xl uppercase text-brand-navy">
              Hero Rotation
            </h1>
            <p className="text-brand-charcoal/60 text-sm mt-1">
              {items.length} item{items.length === 1 ? '' : 's'} · {enabledCount} in rotation —{' '}
              {rotation.mode === 'CAROUSEL'
                ? `cycles through every item automatically, ${rotation.intervalSeconds}s each.`
                : 'one is picked at random each time someone loads the homepage, and stays put for their visit.'}
              {' '}Leave this empty and the built-in hero video is used.
            </p>
          </div>
          <Link
            href="/admin/hero-media/new"
            className="shrink-0 bg-brand-neon text-brand-charcoal font-bold px-5 py-3 min-h-[44px] flex items-center border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            + Add Media
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-brand-navy border border-brand-sky/20 p-8 text-center">
            <p className="text-brand-sky">
              Nothing in the rotation yet — the homepage is showing the built-in hero video.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-white border-2 p-4 flex items-center gap-4 ${
                  item.isEnabled ? 'border-brand-neon' : 'border-brand-charcoal/10'
                }`}
              >
                <div className="h-16 w-28 shrink-0 overflow-hidden border-2 border-brand-charcoal/15 bg-brand-charcoal/5">
                  {item.type === 'IMAGE' && item.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt=""
                      className="h-full w-full object-cover"
                      style={{ objectPosition: `${item.focalX}% ${item.focalY}%` }}
                    />
                  ) : item.type === 'VIDEO' && item.posterUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.posterUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      style={{ objectPosition: `${item.focalX}% ${item.focalY}%` }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-bold uppercase text-brand-charcoal/40">
                      No preview
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-brand-navy text-brand-cream">
                      {item.type === 'VIDEO' ? 'Video' : 'Photo'}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-brand-sky/30 text-brand-navy">
                      {MOTION_LABELS[item.motionEffect] ?? item.motionEffect}
                    </span>
                    {!item.isEnabled && (
                      <span className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-wide">
                        Off
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-charcoal/50 truncate font-mono">{item.url}</p>
                  <p className="text-xs text-brand-charcoal/40 mt-0.5">Order {item.sortOrder}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <form action={toggleEnabled}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="isEnabled" value={item.isEnabled ? 'on' : 'off'} />
                    <button
                      type="submit"
                      className="min-h-[44px] px-3 flex items-center text-xs font-bold border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-brand-cream transition-all"
                    >
                      {item.isEnabled ? 'Turn Off' : 'Turn On'}
                    </button>
                  </form>
                  <Link
                    href={`/admin/hero-media/${item.id}`}
                    className="min-h-[44px] px-4 flex items-center text-sm font-bold border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-brand-cream transition-all"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rotation settings — rarely touched, so tucked below the list */}
        <details className="mt-8 border-2 border-brand-navy/15 bg-white">
          <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-brand-navy hover:bg-brand-navy/5 transition-colors">
            ⚙ Rotation behaviour — currently {rotation.mode === 'CAROUSEL' ? `auto-rotate, ${rotation.intervalSeconds}s each` : 'pick once per visit'}
          </summary>
          <form
            action={saveRotationSettings}
            className="space-y-4 border-t border-brand-navy/10 p-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label="Rotation mode">
              <label className={`flex items-start gap-2 border-2 px-3 py-3 cursor-pointer transition-colors ${rotation.mode === 'ONCE' ? 'border-brand-neon bg-brand-neon/10' : 'border-brand-charcoal/15 hover:border-brand-charcoal/30'}`}>
                <input type="radio" name="mode" value="ONCE" defaultChecked={rotation.mode === 'ONCE'} className="mt-1 w-4 h-4 accent-brand-neon" />
                <span>
                  <span className="block text-sm font-bold text-brand-charcoal">Pick once</span>
                  <span className="block text-xs text-brand-charcoal/60">One random item per visit, stays fixed. Current behaviour.</span>
                </span>
              </label>
              <label className={`flex items-start gap-2 border-2 px-3 py-3 cursor-pointer transition-colors ${rotation.mode === 'CAROUSEL' ? 'border-brand-neon bg-brand-neon/10' : 'border-brand-charcoal/15 hover:border-brand-charcoal/30'}`}>
                <input type="radio" name="mode" value="CAROUSEL" defaultChecked={rotation.mode === 'CAROUSEL'} className="mt-1 w-4 h-4 accent-brand-neon" />
                <span>
                  <span className="block text-sm font-bold text-brand-charcoal">Auto-rotate carousel</span>
                  <span className="block text-xs text-brand-charcoal/60">Cycles through every enabled item in Order, on a timer.</span>
                </span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="flex-1 text-xs text-brand-charcoal/60">
                Seconds each item stays on screen in carousel mode (5–60). Visitors with
                reduced-motion enabled never auto-rotate, and a pause button appears on the
                homepage either way.
              </p>
              <div className="flex items-center gap-2">
                <input
                  name="intervalSeconds"
                  type="number"
                  min={5}
                  max={60}
                  defaultValue={rotation.intervalSeconds}
                  aria-label="Carousel interval in seconds"
                  className="w-20 border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white text-brand-charcoal focus:outline-none focus:border-brand-neon"
                />
                <span className="text-sm font-bold text-brand-charcoal/60">sec</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-t border-brand-navy/10 pt-4">
              <p className="flex-1 text-xs text-brand-charcoal/60">
                How often a campaign marked <span className="font-bold">&ldquo;Hero background&rdquo;</span> takes
                a turn in the rotation, until it ends. In carousel mode this is a strict pattern;
                in pick-once mode it&apos;s just weighted more likely.
              </p>
              <div className="flex items-center gap-2">
                <select
                  name="featureRatio"
                  defaultValue={String(rotation.featureRatio)}
                  aria-label="Featured campaign ratio"
                  className="border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white text-brand-charcoal focus:outline-none focus:border-brand-neon"
                >
                  <option value="2">1 in 2</option>
                  <option value="3">1 in 3</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-brand-navy text-brand-cream font-bold px-4 py-2 min-h-[44px] border-2 border-brand-navy hover:bg-brand-navy/85 transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </details>

      </div>
    </main>
  );
}

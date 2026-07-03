import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin/require-admin';
import {
  SPOTLIGHT_INTERVAL_KEY,
  getSpotlightIntervalSeconds,
} from '@/lib/site-settings';

export const metadata: Metadata = {
  title: 'Noticeboard Admin | RVR',
};

const CHIP = 'text-[10px] font-black uppercase tracking-wider px-2 py-0.5';

const CATEGORY_COLOURS: Record<string, string> = {
  BREAKING:        'bg-brand-maroon text-white',
  CONGRATULATIONS: 'bg-brand-neon text-brand-charcoal',
  COMMUNITY_NEWS:  'bg-brand-sky text-brand-charcoal',
  IN_SYMPATHY:     'bg-brand-navy text-brand-cream',
};

const CATEGORY_LABELS: Record<string, string> = {
  BREAKING:        'Breaking News',
  CONGRATULATIONS: 'Congratulations',
  COMMUNITY_NEWS:  'Community News',
  IN_SYMPATHY:     'In Sympathy',
};

type NoticeRow = {
  id: string;
  kind: 'campaign' | 'announcement';
  title: string;
  date: Date;
  endDate: Date | null;
  isPublished: boolean;
  live: boolean;
  scheduled: boolean;
  expired: boolean;
  chips: Array<{ label: string; className: string }>;
  editHref: string;
};

export default async function NoticeboardAdminPage() {
  const now = new Date();
  const [announcements, campaigns, intervalSeconds] = await Promise.all([
    prisma.announcement.findMany({ orderBy: { publishedAt: 'desc' } }),
    prisma.campaign.findMany({ orderBy: { startsAt: 'desc' } }),
    getSpotlightIntervalSeconds(),
  ]);

  const rows: NoticeRow[] = [
    ...campaigns.map((c): NoticeRow => {
      const scheduled = c.startsAt > now;
      const expired   = Boolean(c.endsAt && c.endsAt < now);
      return {
        id: c.id,
        kind: 'campaign',
        title: c.title,
        date: c.startsAt,
        endDate: c.endsAt,
        isPublished: c.isPublished,
        live: c.isPublished && !scheduled && !expired,
        scheduled,
        expired,
        chips: [
          { label: 'Campaign', className: 'bg-brand-charcoal text-brand-neon' },
          ...(c.showOnHomepage ? [{ label: 'Homepage', className: 'bg-brand-green text-white' }] : []),
          ...(c.showBanner ? [{ label: 'Banner', className: 'bg-brand-neon text-brand-charcoal' }] : []),
        ],
        editHref: `/admin/campaigns/${c.id}`,
      };
    }),
    ...announcements.map((a): NoticeRow => {
      const expired = Boolean(a.expiresAt && a.expiresAt < now);
      return {
        id: a.id,
        kind: 'announcement',
        title: a.title,
        date: a.publishedAt,
        endDate: a.expiresAt,
        isPublished: a.isPublished,
        live: a.isPublished && !expired,
        scheduled: false,
        expired,
        chips: [
          { label: 'News', className: 'bg-white border border-brand-navy/30 text-brand-navy' },
          {
            label: CATEGORY_LABELS[a.category] ?? a.category,
            className: CATEGORY_COLOURS[a.category] ?? 'bg-brand-sky text-brand-charcoal',
          },
          ...(a.pinned ? [{ label: 'Pinned', className: 'bg-brand-neon/40 text-brand-charcoal' }] : []),
        ],
        editHref: `/admin/announcements/${a.id}`,
      };
    }),
  ].sort((x, y) => y.date.getTime() - x.date.getTime());

  const liveCount = rows.filter((r) => r.live).length;

  async function saveSpotlightInterval(formData: FormData) {
    'use server';
    await requireAdmin();
    const { prisma: db } = await import('@/lib/prisma');
    const seconds = Math.min(30, Math.max(3, Number(formData.get('seconds') ?? 7)));
    await db.siteSetting.upsert({
      where:  { key: SPOTLIGHT_INTERVAL_KEY },
      create: { key: SPOTLIGHT_INTERVAL_KEY, value: String(seconds) },
      update: { value: String(seconds) },
    });
    revalidatePath('/');
    redirect('/admin/noticeboard');
  }

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 text-brand-charcoal">
      <div className="mx-auto max-w-4xl">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-black italic text-4xl uppercase text-brand-navy">
              Noticeboard
            </h1>
            <p className="text-brand-charcoal/60 text-sm mt-1">
              {rows.length} items · {liveCount} live now — campaigns and news together,
              exactly as they compete for the homepage spotlight.
            </p>
          </div>
          <Link
            href="/admin/noticeboard/new"
            className="shrink-0 bg-brand-neon text-brand-charcoal font-bold px-5 py-3 min-h-[44px] flex items-center border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            + New Notice
          </Link>
        </div>

        {/* Spotlight settings */}
        <form
          action={saveSpotlightInterval}
          className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3 border-2 border-brand-navy/15 bg-white p-4"
        >
          <div className="flex-1">
            <p className="text-sm font-bold text-brand-charcoal">Homepage spotlight rotation</p>
            <p className="text-xs text-brand-charcoal/60 mt-0.5">
              Seconds each item stays on screen before swapping (3–30). Visitors with
              reduced-motion enabled never auto-rotate.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              name="seconds"
              type="number"
              min={3}
              max={30}
              defaultValue={intervalSeconds}
              aria-label="Rotation interval in seconds"
              className="w-20 border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white text-brand-charcoal focus:outline-none focus:border-brand-neon"
            />
            <span className="text-sm font-bold text-brand-charcoal/60">sec</span>
            <button
              type="submit"
              className="bg-brand-navy text-brand-cream font-bold px-4 py-2 min-h-[44px] border-2 border-brand-navy hover:bg-brand-navy/85 transition-colors"
            >
              Save
            </button>
          </div>
        </form>

        {rows.length === 0 ? (
          <div className="bg-brand-navy border border-brand-sky/20 p-8 text-center">
            <p className="text-brand-sky">Nothing on the noticeboard yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <div
                key={`${r.kind}-${r.id}`}
                className={`bg-white border-2 p-4 flex items-start justify-between gap-4 ${
                  r.live ? 'border-brand-neon' : 'border-brand-charcoal/10'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {r.chips.map((chip) => (
                      <span key={chip.label} className={`${CHIP} ${chip.className}`}>
                        {chip.label}
                      </span>
                    ))}
                    {r.live && (
                      <span className="text-[10px] font-bold text-brand-green uppercase tracking-wide">
                        ● Live
                      </span>
                    )}
                    {r.scheduled && r.isPublished && (
                      <span className="text-[10px] font-bold text-brand-sky uppercase tracking-wide">
                        Scheduled
                      </span>
                    )}
                    {r.expired && (
                      <span className="text-[10px] font-bold text-brand-maroon uppercase tracking-wide">
                        Expired
                      </span>
                    )}
                    {!r.isPublished && (
                      <span className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-wide">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-brand-charcoal truncate">{r.title}</p>
                  <p className="text-xs text-brand-charcoal/50 mt-0.5">
                    {r.date.toLocaleDateString('en-IE')}
                    {r.endDate && <> → {r.endDate.toLocaleDateString('en-IE')}</>}
                  </p>
                </div>
                <Link
                  href={r.editHref}
                  className="shrink-0 min-h-[44px] px-4 flex items-center text-sm font-bold border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-brand-cream transition-all"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

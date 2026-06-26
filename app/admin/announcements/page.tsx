import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AdminNav from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  title: 'Announcements Admin | RVR',
};

const CATEGORY_COLOURS: Record<string, string> = {
  RECRUITMENT: 'bg-brand-neon text-brand-charcoal',
  EVENT:       'bg-brand-sky text-brand-charcoal',
  NEWS:        'bg-brand-green text-white',
  VOLUNTEER:   'bg-brand-maroon text-white',
};

export default async function AnnouncementsAdminPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: [{ pinned: 'desc' }, { publishedAt: 'desc' }],
  });

  const now = new Date();

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 text-brand-charcoal">
      <div className="mx-auto max-w-4xl">
        <AdminNav />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-black italic text-4xl uppercase text-brand-navy">
              Announcements
            </h1>
            <p className="text-brand-charcoal/60 text-sm mt-1">
              {announcements.length} total ·{' '}
              {announcements.filter((a) => a.isPublished).length} published
            </p>
          </div>
          <Link
            href="/admin/announcements/new"
            className="bg-brand-neon text-brand-charcoal font-bold px-5 py-3 min-h-[44px] flex items-center border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            + New Announcement
          </Link>
        </div>

        {announcements.length === 0 ? (
          <div className="bg-brand-navy border border-brand-sky/20 p-8 text-center">
            <p className="text-brand-sky">No announcements yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => {
              const expired = a.expiresAt && a.expiresAt < now;
              return (
                <div
                  key={a.id}
                  className={`bg-white border-2 p-4 flex items-start justify-between gap-4 ${
                    a.pinned ? 'border-brand-neon' : 'border-brand-charcoal/10'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 ${CATEGORY_COLOURS[a.category]}`}>
                        {a.category}
                      </span>
                      {a.pinned && (
                        <span className="text-[10px] font-bold text-brand-neon uppercase tracking-wide">
                          📌 Pinned
                        </span>
                      )}
                      {expired && (
                        <span className="text-[10px] font-bold text-brand-maroon uppercase tracking-wide">
                          Expired
                        </span>
                      )}
                      {!a.isPublished && (
                        <span className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-wide">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-brand-charcoal truncate">{a.title}</p>
                    <p className="text-xs text-brand-charcoal/50 mt-0.5">
                      {new Date(a.publishedAt).toLocaleDateString('en-IE')}
                      {a.expiresAt && (
                        <> · Expires {new Date(a.expiresAt).toLocaleDateString('en-IE')}</>
                      )}
                    </p>
                  </div>
                  <Link
                    href={`/admin/announcements/${a.id}`}
                    className="shrink-0 min-h-[44px] px-4 flex items-center text-sm font-bold border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-brand-cream transition-all"
                  >
                    Edit
                  </Link>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}

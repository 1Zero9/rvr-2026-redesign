import type { Metadata } from 'next';
import Header from '@/components/Header';
import AnnouncementCard from '@/components/AnnouncementCard';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import type { AnnouncementCategory } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Club News | Rivervalley Rangers AFC',
  description: 'Latest news, events, recruitment drives and volunteer opportunities from Rivervalley Rangers AFC.',
};

const CATEGORIES: { key: AnnouncementCategory | 'ALL'; label: string }[] = [
  { key: 'ALL',         label: 'All'         },
  { key: 'NEWS',        label: 'News'        },
  { key: 'RECRUITMENT', label: 'Recruitment' },
  { key: 'EVENT',       label: 'Events'      },
  { key: 'VOLUNTEER',   label: 'Volunteer'   },
];

const PILL_BASE     = 'px-4 min-h-[44px] inline-flex items-center text-sm font-bold border-2 transition-all whitespace-nowrap';
const PILL_ACTIVE   = 'bg-brand-navy text-brand-cream border-brand-navy';
const PILL_INACTIVE = 'bg-transparent text-brand-navy/60 border-brand-navy/20 hover:border-brand-navy hover:text-brand-navy';

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const activeCategory = CATEGORIES.find(
    (c) => c.key === category?.toUpperCase(),
  )?.key ?? 'ALL';

  const now = new Date();
  const announcements = await prisma.announcement.findMany({
    where: {
      isPublished: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      ...(activeCategory !== 'ALL' && { category: activeCategory }),
    },
    orderBy: [{ pinned: 'desc' }, { publishedAt: 'desc' }],
  });

  return (
    <div
      className="min-h-screen bg-brand-cream"
      style={{
        backgroundImage: `linear-gradient(rgba(11,31,59,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(11,31,59,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    >
      <Header />

      <main className="max-w-5xl mx-auto px-4 md:px-6">

        {/* Page heading */}
        <div className="pt-8 mb-8">
          <h1 className="text-brand-navy font-display font-black italic text-4xl lg:text-6xl uppercase tracking-tight leading-none mb-1">
            Club News
          </h1>
          <p className="text-zinc-500 text-sm font-semibold">
            Rivervalley Rangers AFC · Announcements, Events &amp; Recruitment
          </p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(({ key, label }) => (
            <Link
              key={key}
              href={key === 'ALL' ? '/news' : `/news?category=${key.toLowerCase()}`}
              className={`${PILL_BASE} ${activeCategory === key ? PILL_ACTIVE : PILL_INACTIVE}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Cards */}
        {announcements.length === 0 ? (
          <div className="border-2 border-brand-navy/10 bg-white p-10 text-center">
            <p className="text-brand-navy/50 font-display font-bold text-lg">
              No announcements in this category yet.
            </p>
            {activeCategory !== 'ALL' && (
              <Link href="/news" className="text-brand-navy text-sm mt-3 inline-block underline">
                View all announcements
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

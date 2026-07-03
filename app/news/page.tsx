import type { Metadata } from 'next';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import AnnouncementCard from '@/components/AnnouncementCard';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getActiveCampaigns } from '@/lib/campaigns';
import type { AnnouncementCategory, Campaign } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Club News & Noticeboard',
  description: 'News, campaigns, congratulations, and community notices from Rivervalley Rangers AFC — everything happening at the club in one place.',
};

export const revalidate = 300;

const TABS: { key: AnnouncementCategory | 'ALL' | 'CAMPAIGNS'; label: string }[] = [
  { key: 'ALL',             label: 'All'             },
  { key: 'BREAKING',        label: 'Breaking'        },
  { key: 'CONGRATULATIONS', label: 'Congratulations' },
  { key: 'COMMUNITY_NEWS',  label: 'Community'       },
  { key: 'CAMPAIGNS',       label: 'Campaigns'       },
  { key: 'IN_SYMPATHY',     label: 'In Sympathy'     },
];

const PILL_BASE     = 'px-4 min-h-[44px] inline-flex items-center text-sm font-bold border-2 transition-all whitespace-nowrap';
const PILL_ACTIVE   = 'bg-brand-navy text-brand-cream border-brand-navy';
const PILL_INACTIVE = 'bg-transparent text-brand-navy/60 border-brand-navy/20 hover:border-brand-navy hover:text-brand-navy';

function CampaignNoticeCard({ campaign }: { campaign: Campaign }) {
  return (
    <Link
      href={campaign.ctaUrl}
      className="group flex flex-col overflow-hidden border-2 border-l-4 border-brand-navy/10 border-l-brand-neon bg-white transition-all hover:border-brand-navy/30 hover:shadow-mid-brutalist"
    >
      {campaign.heroImageUrl && (
        <div className="h-36 overflow-hidden border-b border-brand-navy/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={campaign.heroImageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ objectPosition: `${campaign.focalX}% ${campaign.focalY}%` }}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-brand-neon/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-brand-charcoal">
            Campaign
          </span>
          {campaign.endsAt && (
            <span className="text-xs text-brand-charcoal/50">
              Ends {new Date(campaign.endsAt).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
        <h3 className="font-bold text-brand-charcoal leading-snug">{campaign.title}</h3>
        {campaign.subtitle && (
          <p className="mt-2 text-sm text-brand-charcoal/60 leading-relaxed line-clamp-3">
            {campaign.subtitle}
          </p>
        )}
        <span className="mt-auto pt-4 text-sm font-black uppercase tracking-wide text-brand-navy group-hover:text-brand-green transition-colors">
          {campaign.ctaLabel} →
        </span>
      </div>
    </Link>
  );
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const activeTab = TABS.find(
    (t) => t.key === category?.toUpperCase(),
  )?.key ?? 'ALL';

  const now = new Date();
  const [announcements, campaigns] = await Promise.all([
    activeTab === 'CAMPAIGNS'
      ? Promise.resolve([])
      : prisma.announcement.findMany({
          where: {
            isPublished: true,
            OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
            ...(activeTab !== 'ALL' && { category: activeTab as AnnouncementCategory }),
          },
          orderBy: [{ pinned: 'desc' }, { publishedAt: 'desc' }],
        }),
    activeTab === 'ALL' || activeTab === 'CAMPAIGNS'
      ? getActiveCampaigns()
      : Promise.resolve([]),
  ]);

  // Interleave by date: campaigns use startsAt, announcements publishedAt
  const feed: Array<{ date: Date; node: React.ReactNode }> = [
    ...campaigns.map((c) => ({
      date: c.startsAt,
      node: <CampaignNoticeCard key={`c-${c.id}`} campaign={c} />,
    })),
    ...announcements.map((a) => ({
      date: a.publishedAt,
      node: <AnnouncementCard key={`a-${a.id}`} announcement={a} />,
    })),
  ].sort((x, y) => y.date.getTime() - x.date.getTime());

  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="The Noticeboard"
        title="Club News & Noticeboard"
        description="News, campaigns, congratulations, and community notices — everything happening at RVR in one place."
      />
      <section className="mx-auto max-w-5xl px-4 py-10 md:px-6">

        {/* Label filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TABS.map(({ key, label }) => (
            <Link
              key={key}
              href={key === 'ALL' ? '/news' : `/news?category=${key.toLowerCase()}`}
              className={`${PILL_BASE} ${activeTab === key ? PILL_ACTIVE : PILL_INACTIVE}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Feed */}
        {feed.length === 0 ? (
          <div className="border-2 border-brand-navy/10 bg-white p-10 text-center">
            <p className="text-brand-navy/50 font-display font-bold text-lg">
              Nothing on the noticeboard in this category yet.
            </p>
            {activeTab !== 'ALL' && (
              <Link href="/news" className="text-brand-navy text-sm mt-3 inline-block underline">
                View everything
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
            {feed.map((item) => item.node)}
          </div>
        )}

      </section>
    </PublicPageShell>
  );
}

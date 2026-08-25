import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import { getFeatureAvailability } from '@/lib/features';
import { getActiveCampaigns } from '@/lib/campaigns';

export const metadata: Metadata = {
  title: 'Campaigns',
  description: 'Fundraising campaigns, community competitions, and club initiatives from Rivervalley Rangers AFC.',
};

// Campaigns auto-publish and auto-expire on their date window — the page
// must re-render periodically, not only at deploy time
export const revalidate = 300;

const AUDIENCE_LABELS: Record<string, string> = {
  EVERYONE:   'For everyone',
  PARENTS:    'For parents',
  PLAYERS:    'For players',
  COACHES:    'For coaches',
  VOLUNTEERS: 'For volunteers',
  SPONSORS:   'For sponsors',
};

export default async function CampaignsPage() {
  const [features, campaigns] = await Promise.all([
    getFeatureAvailability(),
    getActiveCampaigns(),
  ]);

  const hasContent = campaigns.length > 0 || features.anniversaryKit;

  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Community Initiatives"
        title="Campaigns"
        description="Fundraising, competitions, and special club projects."
      />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {hasContent ? (
          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                id={`campaign-${campaign.id}`}
                href={campaign.ctaUrl}
                className="group block overflow-hidden border-3 border-brand-charcoal bg-white shadow-brutalist transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none scroll-mt-24"
              >
                {campaign.heroImageUrl && (
                  <div className="relative h-44 sm:h-56 overflow-hidden border-b-3 border-brand-charcoal">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={campaign.mobileImageUrl || campaign.heroImageUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover sm:hidden"
                      style={{ objectPosition: `${campaign.focalX}% ${campaign.focalY}%` }}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={campaign.heroImageUrl}
                      alt=""
                      loading="lazy"
                      className="hidden h-full w-full object-cover sm:block"
                      style={{ objectPosition: `${campaign.focalX}% ${campaign.focalY}%` }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="font-display text-xs font-black uppercase text-brand-green">
                    Open campaign · {AUDIENCE_LABELS[campaign.audience] ?? 'For everyone'}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-black italic text-brand-navy">
                    {campaign.title}
                  </h2>
                  {campaign.subtitle && (
                    <p className="mt-3 text-base text-brand-charcoal">{campaign.subtitle}</p>
                  )}
                  <span className="mt-4 inline-flex min-h-[44px] items-center bg-brand-neon px-5 py-2 text-sm font-display font-black uppercase text-brand-charcoal border-2 border-brand-charcoal group-hover:bg-brand-charcoal group-hover:text-brand-neon transition-colors">
                    {campaign.ctaLabel} →
                  </span>
                </div>
              </Link>
            ))}

            {features.anniversaryKit && (
              <Link
                href="/campaigns/45th-anniversary-kit"
                className="block border-3 border-brand-charcoal bg-white p-6 shadow-brutalist transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  Open campaign
                </p>
                <h2 className="mt-2 font-display text-2xl font-black italic text-brand-navy">
                  45th Anniversary Kit
                </h2>
                <p className="mt-3 text-base text-brand-charcoal">
                  Submit a kit concept and view approved community designs.
                </p>
              </Link>
            )}
          </div>
        ) : (
          <div className="site-surface p-6">
            <h2 className="font-display text-2xl font-black italic text-brand-navy">
              No public campaigns currently open
            </h2>
            <p className="mb-6 mt-3 text-base text-brand-charcoal">
              New fundraising and community initiatives will be published here
              once registration details are confirmed.
            </p>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center bg-brand-neon px-6 py-3 font-bold text-brand-charcoal"
            >
              Contact the Club →
            </Link>
          </div>
        )}
      </div>
    </PublicPageShell>
  );
}

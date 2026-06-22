import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHero from '@/components/layout/PageHero';
import { getFeatureAvailability } from '@/lib/features';

export const metadata: Metadata = {
  title: 'Campaigns | Rivervalley Rangers AFC',
  description: 'Fundraising campaigns, community competitions, and club initiatives from Rivervalley Rangers AFC.',
};

export default async function CampaignsPage() {
  const features = await getFeatureAvailability();

  return (
    <PublicPageShell>
      <PageHero
        eyebrow="Community Initiatives"
        title="Campaigns"
        description="Fundraising, competitions, and special club projects."
        maxWidth="4xl"
      />

        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          {features.anniversaryKit ? (
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

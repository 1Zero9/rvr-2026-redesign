import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Campaigns | Rivervalley Rangers AFC',
  description: 'Fundraising campaigns, community competitions, and club initiatives from Rivervalley Rangers AFC.',
};

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Header />

      <main>
        <div className="bg-brand-navy py-12">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="font-display font-black italic text-4xl md:text-5xl uppercase tracking-tight leading-none text-brand-neon mb-2">
              Campaigns
            </h1>
            <p className="text-brand-sky text-base">
              Fundraising &amp; Community Initiatives
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-brand-cream border-2 border-brand-sky shadow-brutalist p-6">
            <h2 className="font-display italic font-black text-2xl text-brand-navy mb-3">
              Coming Soon
            </h2>
            <p className="text-brand-charcoal text-base mb-6">
              We&apos;re building something here. Check back soon for fundraising campaigns,
              community competitions, and club initiatives.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-brand-neon text-brand-charcoal font-bold px-6 py-3 min-h-[44px]"
            >
              Get in Touch →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

import type { Metadata } from 'next';
import { ArrowRight, PackageCheck, Recycle, ShieldCheck } from 'lucide-react';
import BootRoomSubmissionForm from '@/components/boot-room/BootRoomSubmissionForm';
import ContentSection from '@/components/layout/ContentSection';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import PublicPageShell from '@/components/layout/PublicPageShell';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Boot Room Exchange | Rivervalley Rangers AFC',
  description:
    'Donate and reuse clean football boots, kit, and equipment through the moderated Rivervalley Rangers AFC Boot Room exchange.',
};

function readable(value: string) {
  return value.replaceAll('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

export default async function BootRoomPage() {
  const listings = await prisma.bootRoomListing.findMany({
    where: { moderationStatus: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      title: true,
      category: true,
      size: true,
      itemCondition: true,
      description: true,
    },
  });

  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Reuse football equipment"
        title="Boot Room Exchange"
        description="Pass on clean boots, kit, and equipment that another RVR family can use. Every listing is reviewed before publication."
      />

      <ContentSection
        title="How it works"
        contentClassName="grid gap-5 md:grid-cols-3"
      >
        {[
          {
            title: '1. Submit',
            text: 'Describe the item honestly and provide private contact details for the club.',
            icon: Recycle,
          },
          {
            title: '2. Club review',
            text: 'An administrator checks suitability before the item appears publicly.',
            icon: ShieldCheck,
          },
          {
            title: '3. Arrange collection',
            text: 'Interested families contact the club, which coordinates the next step privately.',
            icon: PackageCheck,
          },
        ].map((step) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="site-surface p-6">
              <Icon className="h-9 w-9 text-brand-green" aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl font-black uppercase text-brand-navy">
                {step.title}
              </h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">
                {step.text}
              </p>
            </article>
          );
        })}
      </ContentSection>

      <ContentSection
        title="Available items"
        description="Only approved listings appear here. Donor contact information is never public."
        className="border-y-2 border-brand-navy/10"
        contentClassName="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {listings.length === 0 ? (
          <div className="site-surface p-8 text-center sm:col-span-2 lg:col-span-3">
            <PackageCheck className="mx-auto h-10 w-10 text-brand-green" aria-hidden="true" />
            <h3 className="mt-4 font-display text-2xl font-black uppercase text-brand-navy">
              No approved items yet
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-6 text-zinc-600">
              The exchange is ready for donations. Submitted items appear after
              club review.
            </p>
          </div>
        ) : (
          listings.map((listing) => (
            <article key={listing.id} className="site-surface flex min-h-72 flex-col p-6">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border-2 border-brand-navy bg-brand-neon px-3 py-1 font-display text-[10px] font-black uppercase">
                  {readable(listing.category)}
                </span>
                <span className="rounded-full border-2 border-brand-navy/20 bg-white px-3 py-1 font-display text-[10px] font-black uppercase text-brand-navy">
                  {readable(listing.itemCondition)}
                </span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-black uppercase leading-tight text-brand-navy">
                {listing.title}
              </h3>
              {listing.size && (
                <p className="mt-2 text-xs font-black uppercase tracking-wide text-brand-green">
                  Size: {listing.size}
                </p>
              )}
              <p className="mt-4 text-sm font-semibold leading-6 text-zinc-600">
                {listing.description}
              </p>
              <a
                href="/contact"
                className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 font-display text-xs font-black uppercase text-brand-green underline decoration-2 underline-offset-4"
              >
                Ask about this item
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          ))
        )}
      </ContentSection>

      <ContentSection
        title="Donate equipment"
        description="Items should be clean, usable, and safe. The club may reject unsuitable or incomplete listings."
        width="4xl"
      >
        <BootRoomSubmissionForm />
      </ContentSection>
    </PublicPageShell>
  );
}

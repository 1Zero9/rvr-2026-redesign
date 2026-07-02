import type { Metadata } from 'next';
import {
  BadgeEuro,
  Goal,
  Handshake,
  Megaphone,
  Shirt,
  Users,
} from 'lucide-react';
import ContentSection from '@/components/layout/ContentSection';
import PublicEnquiryForm from '@/components/forms/PublicEnquiryForm';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import PublicPageShell from '@/components/layout/PublicPageShell';

export const metadata: Metadata = {
  title: 'Sponsorship',
  description:
    'Partner with Rivervalley Rangers AFC through team, equipment, facility, event, or community programme sponsorship.',
};

const opportunities = [
  {
    title: 'Team and kit',
    description:
      'Support playing or training kit for an agreed team or club programme.',
    icon: Shirt,
  },
  {
    title: 'Equipment',
    description:
      'Help fund footballs, goals, bibs, coaching resources, or essential team equipment.',
    icon: Goal,
  },
  {
    title: 'Facilities',
    description:
      'Discuss practical support for pitch, storage, maintenance, or facility improvements.',
    icon: BadgeEuro,
  },
  {
    title: 'Community programmes',
    description:
      'Back inclusive football, youth development, volunteer training, or local initiatives.',
    icon: Users,
  },
];

export default function SponsorshipPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Partner with RVR"
        title="Sponsorship"
        description="Support grassroots football while building a visible, credible connection with families and the wider Swords community."
      />

      <ContentSection
        title="Practical partnership opportunities"
        description="Every partnership is scoped around a real club need. We do not publish unconfirmed packages or invented audience figures."
        contentClassName="grid gap-5 sm:grid-cols-2"
      >
        {opportunities.map((opportunity) => {
          const Icon = opportunity.icon;
          return (
            <article key={opportunity.title} className="site-surface p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-brand-navy bg-brand-neon">
                <Icon className="h-6 w-6 text-brand-navy" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-black uppercase text-brand-navy">
                {opportunity.title}
              </h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">
                {opportunity.description}
              </p>
            </article>
          );
        })}
      </ContentSection>

      <ContentSection
        title="How partnerships are agreed"
        className="border-y-2 border-brand-navy/10"
        contentClassName="grid gap-5 md:grid-cols-3"
      >
        {[
          {
            title: '1. Understand the fit',
            text: 'We discuss business objectives, budget, preferred involvement, and suitable club needs.',
          },
          {
            title: '2. Confirm the offer',
            text: 'Deliverables, duration, branding, approvals, and safeguarding boundaries are documented.',
          },
          {
            title: '3. Review the impact',
            text: 'The club and partner agree how delivery and community value will be reviewed.',
          },
        ].map((step) => (
          <article key={step.title} className="site-surface p-6">
            <h3 className="font-display text-xl font-black uppercase text-brand-navy">
              {step.title}
            </h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">
              {step.text}
            </p>
          </article>
        ))}
      </ContentSection>

      <ContentSection
        title="Start a sponsorship conversation"
        description="Tell us what your organisation wants to support. The club will respond with current, confirmed opportunities."
        contentClassName="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]"
      >
        <aside className="site-surface p-6 sm:p-8">
          <Handshake className="h-11 w-11 text-brand-green" aria-hidden="true" />
          <h3 className="mt-4 font-display text-3xl font-black uppercase leading-tight text-brand-navy">
            Built around mutual value
          </h3>
          <ul className="mt-5 grid gap-3 text-sm font-semibold leading-6 text-zinc-600">
            <li className="flex gap-3">
              <Megaphone className="mt-1 h-4 w-4 shrink-0 text-brand-green" aria-hidden="true" />
              Appropriate recognition through agreed club channels.
            </li>
            <li className="flex gap-3">
              <Users className="mt-1 h-4 w-4 shrink-0 text-brand-green" aria-hidden="true" />
              A clear connection to grassroots football and community participation.
            </li>
            <li className="flex gap-3">
              <BadgeEuro className="mt-1 h-4 w-4 shrink-0 text-brand-green" aria-hidden="true" />
              Transparent discussion of cost, term, and deliverables before commitment.
            </li>
          </ul>
        </aside>

        <PublicEnquiryForm
          type="SPONSORSHIP_INTEREST"
          title="Sponsorship enquiry"
          description="For businesses, organisations, and individuals interested in supporting an agreed club need."
          detailsLabel="Organisation and partnership interests"
          detailsPlaceholder="Include your organisation, preferred type of support, approximate budget range if known, and any timing or branding requirements."
          submitLabel="Submit sponsorship enquiry"
          successMessage="The club will review your enquiry and respond with relevant, currently available partnership opportunities."
        />
      </ContentSection>
    </PublicPageShell>
  );
}

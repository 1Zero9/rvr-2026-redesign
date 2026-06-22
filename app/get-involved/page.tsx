import type { Metadata } from 'next';
import {
  CheckCircle2,
  ClipboardCheck,
  Goal,
  HeartHandshake,
  ShieldCheck,
  Users,
} from 'lucide-react';
import ContentSection from '@/components/layout/ContentSection';
import PublicEnquiryForm from '@/components/forms/PublicEnquiryForm';
import PageHero from '@/components/layout/PageHero';
import PublicPageShell from '@/components/layout/PublicPageShell';

export const metadata: Metadata = {
  title: 'Volunteer and Coach | Rivervalley Rangers AFC',
  description:
    'Volunteer or coach with Rivervalley Rangers AFC. Explore practical club roles, safeguarding requirements, and submit an expression of interest.',
};

const opportunities = [
  {
    title: 'Coach or assistant coach',
    description:
      'Help plan and deliver age-appropriate training and support teams on matchdays.',
    icon: Goal,
  },
  {
    title: 'Team support',
    description:
      'Assist with communication, equipment, fixtures, and practical team administration.',
    icon: Users,
  },
  {
    title: 'Club operations',
    description:
      'Support facilities, fundraising, communications, administration, or community initiatives.',
    icon: HeartHandshake,
  },
];

const process = [
  'Submit an expression of interest and tell us which role suits you.',
  'A club representative will discuss availability, experience, and current needs.',
  'Youth-facing roles complete the required Garda Vetting and safeguarding steps.',
  'The club confirms responsibilities, support, and an appropriate starting point.',
];

export default function GetInvolvedPage() {
  return (
    <PublicPageShell>
      <PageHero
        eyebrow="Volunteer with RVR"
        title="Help Build the Club"
        description="Give time, share skills, or start a coaching journey. RVR depends on volunteers who can make a practical contribution."
      />

      <ContentSection
        title="Ways to get involved"
        description="Choose a role that matches your experience and the time you can realistically commit."
        contentClassName="grid gap-5 md:grid-cols-3"
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
        title="What happens next"
        className="border-y-2 border-brand-navy/10"
        contentClassName="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <ol className="site-surface grid gap-4 p-6 sm:p-8">
          {process.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-navy bg-brand-neon font-display text-sm font-black">
                {index + 1}
              </span>
              <span className="pt-1 text-sm font-semibold leading-6 text-zinc-700">
                {step}
              </span>
            </li>
          ))}
        </ol>

        <aside className="site-surface p-6 sm:p-8">
          <ShieldCheck className="h-10 w-10 text-brand-green" aria-hidden="true" />
          <h3 className="mt-4 font-display text-2xl font-black uppercase text-brand-navy">
            Youth roles require approval
          </h3>
          <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">
            Nobody should begin coaching, supervising, or assisting with youth
            players until the club confirms the required safeguarding status.
          </p>
          <a
            href="/club/safeguarding"
            className="mt-5 inline-flex min-h-11 items-center gap-2 font-display text-xs font-black uppercase text-brand-green underline decoration-2 underline-offset-4"
          >
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
            Read safeguarding guidance
          </a>
        </aside>
      </ContentSection>

      <ContentSection
        title="Express your interest"
        description="No commitment is created by this form. It starts a conversation with the relevant club team."
        contentClassName="grid gap-6 lg:grid-cols-2"
      >
        <PublicEnquiryForm
          type="COACHING_INTEREST"
          title="Coaching interest"
          description="For lead coaches, assistants, mentors, or people interested in beginning a coaching pathway."
          detailsLabel="Experience and availability"
          detailsPlaceholder="Tell us about age groups, qualifications, football experience, preferred days, and realistic weekly availability."
          submitLabel="Submit coaching interest"
          successMessage="The club will review your coaching interest and contact you about suitable opportunities and required compliance steps."
        />
        <PublicEnquiryForm
          type="VOLUNTEER_INTEREST"
          title="General volunteering"
          description="For team support, administration, facilities, communications, fundraising, or other practical help."
          detailsLabel="How you can help"
          detailsPlaceholder="Tell us what you would like to help with, useful skills, and how often you may be available."
          submitLabel="Submit volunteer interest"
          successMessage="The club will review your interests and connect you with the most relevant team or committee member."
        />
      </ContentSection>

      <ContentSection width="4xl">
        <div className="rounded-2xl border-3 border-brand-green bg-brand-neon/15 p-5 sm:p-6">
          <div className="flex gap-3">
            <CheckCircle2
              className="mt-0.5 h-6 w-6 shrink-0 text-brand-green"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold leading-6 text-zinc-700">
              Role availability changes during the season. The club will only
              confirm openings, time commitments, expenses, and training support
              after reviewing current operational needs.
            </p>
          </div>
        </div>
      </ContentSection>
    </PublicPageShell>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Landmark,
  Mail,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
import ContentSection from '@/components/layout/ContentSection';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import PublicPageShell from '@/components/layout/PublicPageShell';
import {
  clubContacts,
  clubFacilities,
  clubOverview,
  clubPolicies,
  clubTimeline,
  clubValues,
} from '@/config/club-info';

export const metadata: Metadata = {
  title: 'Club Information',
  description:
    'Rivervalley Rangers AFC club history, committee contacts, facilities, policies, governance, and community information.',
};

const sectionLinks = [
  { label: 'Overview', href: '#overview' },
  { label: 'History', href: '#history' },
  { label: 'Committee', href: '#committee' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Policies', href: '#policies' },
];

function StatusLabel({
  status,
}: {
  status: 'verified' | 'available' | 'pending';
}) {
  const isPending = status === 'pending';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 font-display text-[10px] font-black uppercase tracking-wide ${
        isPending
          ? 'border-amber-700 bg-amber-50 text-amber-900'
          : 'border-brand-green bg-brand-neon/20 text-brand-green'
      }`}
    >
      {isPending ? (
        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {isPending ? 'Coming soon' : 'Available'}
    </span>
  );
}

export default function ClubPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow={`Est. ${clubOverview.foundingYear}`}
        title="Club Information"
        description="Our story, leadership contacts, home facilities, and public club documents in one place."
        actions={
          <>
            <Link
              href="/contact"
              className="btn-brutalist-neon inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm"
            >
              Contact the club
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/register"
              className="btn-brutalist-green inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm"
            >
              Join RVR
            </Link>
          </>
        }
      />

      <nav
        aria-label="Club information sections"
        className="sticky top-16 z-30 border-b-2 border-brand-navy/10 bg-brand-cream/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 shrink-0 items-center rounded-xl border-2 border-brand-navy/15 bg-white px-4 font-display text-xs font-black uppercase text-brand-navy transition hover:border-brand-navy hover:bg-brand-neon focus-visible:outline-4 focus-visible:outline-brand-neon"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <ContentSection
        id="overview"
        className="scroll-mt-32"
        contentClassName="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="site-surface p-6 sm:p-8">
          <p className="font-display text-xs font-black uppercase tracking-wide text-brand-green">
            Community football since {clubOverview.foundingYear}
          </p>
          <h2 className="site-section-heading mt-3 text-3xl sm:text-5xl">
            Built by the community.
          </h2>
          <p className="mt-5 text-base font-semibold leading-7 text-zinc-700">
            {clubOverview.summary}
          </p>
          <p className="mt-4 text-sm font-semibold leading-6 text-zinc-600">
            {clubOverview.mission}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/teams"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-brand-navy bg-white px-4 font-display text-xs font-black uppercase text-brand-navy transition hover:bg-brand-neon"
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              Explore teams
            </Link>
            <Link
              href="/football-for-all"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-brand-navy bg-white px-4 font-display text-xs font-black uppercase text-brand-navy transition hover:bg-brand-neon"
            >
              Football for all
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {clubValues.map((value) => (
            <article
              key={value.title}
              className="rounded-2xl border-3 border-brand-navy bg-white p-5 shadow-[4px_4px_0_#0B1F3B]"
            >
              <h3 className="font-display text-xl font-black uppercase text-brand-navy">
                {value.title}
              </h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-zinc-600">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        id="history"
        title="Club history"
        description="A factual timeline that will expand as archive material and dates are confirmed."
        className="scroll-mt-32 border-y-2 border-brand-navy/10"
        contentClassName="site-surface p-6 sm:p-8"
      >
        <ol className="space-y-0">
          {clubTimeline.map((item, index) => (
            <li
              key={`${item.year}-${item.title}`}
              className="relative grid gap-4 pb-8 pl-12 last:pb-0 sm:grid-cols-[8rem_1fr] sm:pl-14"
            >
              {index < clubTimeline.length - 1 && (
                <span
                  className="absolute left-[19px] top-10 h-[calc(100%-1.5rem)] w-1 bg-brand-navy/15 sm:left-[23px]"
                  aria-hidden="true"
                />
              )}
              <span
                className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-3 border-brand-navy font-display text-xs font-black sm:h-12 sm:w-12 ${
                  item.status === 'verified'
                    ? 'bg-brand-neon text-brand-charcoal'
                    : 'bg-white text-brand-navy'
                }`}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <p className="pt-2 font-display text-sm font-black uppercase text-brand-green sm:pt-3">
                {item.year}
              </p>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-xl font-black uppercase text-brand-navy sm:text-2xl">
                    {item.title}
                  </h3>
                  <StatusLabel status={item.status} />
                </div>
                <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-zinc-600">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </ContentSection>

      <ContentSection
        id="committee"
        title="Committee & contacts"
        description="Role-based contact routes keep club information useful without publishing unverified personal details."
        className="scroll-mt-32"
        contentClassName="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {clubContacts.map((contact) => {
          const href = contact.email
            ? `mailto:${contact.email}`
            : contact.href;

          return (
            <article
              key={contact.role}
              className="site-surface flex min-h-64 flex-col p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-brand-navy bg-brand-neon">
                  <Users className="h-5 w-5 text-brand-navy" aria-hidden="true" />
                </span>
                <StatusLabel status={contact.status} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-black uppercase leading-tight text-brand-navy">
                {contact.role}
              </h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">
                {contact.summary}
              </p>

              {href ? (
                <a
                  href={href}
                  className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 font-display text-xs font-black uppercase text-brand-green underline decoration-2 underline-offset-4"
                >
                  {contact.email && (
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  {contact.actionLabel}
                </a>
              ) : (
                <p className="mt-auto pt-5 text-xs font-bold uppercase tracking-wide text-amber-800">
                  {contact.actionLabel}
                </p>
              )}
            </article>
          );
        })}
      </ContentSection>

      <ContentSection
        id="facilities"
        title="Facilities & grounds"
        description="Verified location and pitch information, with uncertain operational details clearly identified."
        className="scroll-mt-32 border-y-2 border-brand-navy/10"
        contentClassName="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"
      >
        <article className="site-surface p-6 sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-brand-navy bg-brand-neon">
            <MapPin className="h-6 w-6 text-brand-navy" aria-hidden="true" />
          </span>
          <p className="mt-5 font-display text-xs font-black uppercase text-brand-green">
            Our home
          </p>
          <h3 className="mt-2 font-display text-3xl font-black uppercase leading-tight text-brand-navy">
            {clubFacilities.name}
          </h3>
          <address className="mt-4 not-italic text-sm font-semibold leading-6 text-zinc-600">
            {clubFacilities.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={clubFacilities.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brutalist-neon inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-xs"
            >
              Get directions
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href="/astro-booking"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-3 border-brand-navy bg-white px-4 font-display text-xs font-black uppercase text-brand-navy transition hover:bg-brand-neon"
            >
              Book the Astro
            </Link>
            <Link
              href="/pitch-locations"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-3 border-brand-navy bg-white px-4 font-display text-xs font-black uppercase text-brand-navy transition hover:bg-brand-neon"
            >
              All Pitch Locations
            </Link>
          </div>
        </article>

        <div className="grid gap-4 sm:grid-cols-2">
          {clubFacilities.features.map((feature) => (
            <article
              key={feature.label}
              className="rounded-2xl border-3 border-brand-navy/15 bg-white p-5"
            >
              <StatusLabel status={feature.status} />
              <h3 className="mt-4 font-display text-lg font-black uppercase text-brand-navy">
                {feature.label}
              </h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-zinc-600">
                {feature.value}
              </p>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        id="policies"
        title="Policies & governance"
        description="Current public documents are downloadable; missing approved files are shown as pending."
        className="scroll-mt-32"
        contentClassName="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {clubPolicies.map((policy) => (
          <article
            key={policy.title}
            className="site-surface flex min-h-72 flex-col p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-brand-navy bg-brand-neon">
                {policy.title === 'Safeguarding' ? (
                  <ShieldCheck
                    className="h-5 w-5 text-brand-navy"
                    aria-hidden="true"
                  />
                ) : (
                  <FileText
                    className="h-5 w-5 text-brand-navy"
                    aria-hidden="true"
                  />
                )}
              </span>
              <StatusLabel status={policy.status} />
            </div>
            <h3 className="mt-5 font-display text-2xl font-black uppercase leading-tight text-brand-navy">
              {policy.title}
            </h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">
              {policy.description}
            </p>

            {policy.href ? (
              <a
                href={policy.href}
                className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 font-display text-xs font-black uppercase text-brand-green underline decoration-2 underline-offset-4"
              >
                {policy.actionLabel === 'Download PDF' ? (
                  <Download className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                )}
                {policy.actionLabel}
              </a>
            ) : (
              <p className="mt-auto pt-6 text-xs font-bold uppercase tracking-wide text-amber-800">
                Document pending
              </p>
            )}
          </article>
        ))}
      </ContentSection>

      <ContentSection width="4xl">
        <div className="site-surface p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-brand-navy bg-brand-neon">
              <Landmark className="h-7 w-7 text-brand-navy" aria-hidden="true" />
            </span>
            <div>
              <h2 className="site-section-heading text-2xl sm:text-3xl">
                Get in touch
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">
                Questions about the club, membership, or our programmes? Our committee responds within two working days.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-brand-navy bg-brand-neon px-4 font-display text-xs font-black uppercase text-brand-navy"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/club/safeguarding"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-brand-navy bg-white px-4 font-display text-xs font-black uppercase text-brand-navy"
                >
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  Safeguarding Hub
                </Link>
                <Link
                  href="/register"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-brand-navy bg-white px-4 font-display text-xs font-black uppercase text-brand-navy"
                >
                  Join RVR →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </PublicPageShell>
  );
}

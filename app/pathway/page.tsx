import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';

export const metadata: Metadata = {
  title: 'Player Pathway | Rivervalley Rangers AFC',
  description:
    'From first kick to senior football — the full player pathway at Rivervalley Rangers AFC. Boys, girls, community and inclusive routes for every age from 4 to 35+.',
};

// ─── Track data ───────────────────────────────────────────────────────────────

const BOYS = [
  {
    label: 'Development Academy',
    ages: 'Ages 4–6',
    detail: 'Saturday mornings · Small Astro, Rivervalley Park',
    href: '/academy',
  },
  {
    label: 'Youth Development',
    ages: 'U7 – U11',
    detail: 'DDSL Boys · Small-sided football · Building foundations',
    href: '/teams?filter=boys',
  },
  {
    label: 'Youth Competitive',
    ages: 'U12 – U17',
    detail: 'DDSL Boys · 11-a-side · Full competitive season',
    href: '/teams?filter=boys',
  },
  {
    label: 'Senior Football',
    ages: '17+',
    detail: 'Leinster Senior League & AFL · Competitive adult football',
    href: '/seniors',
  },
  {
    label: 'Over 35s',
    ages: '35+',
    detail: 'Two Over 35s sides · AFL · Never hang up your boots',
    href: '/seniors/over-35s',
  },
];

const GIRLS = [
  {
    label: 'Development Academy',
    ages: 'Ages 4–6',
    detail: 'Boys & girls together · Saturday mornings',
    href: '/academy',
  },
  {
    label: 'Youth Girls',
    ages: 'U7 – U18',
    detail: 'DDSL Girls teams · Multiple age groups & divisions',
    href: '/teams?filter=girls',
  },
  {
    label: 'Ladies Football Fit',
    ages: 'Adult',
    detail: 'Tuesday 8pm · Small Astro · €5 per session',
    href: '/ladies-football',
  },
];

const COMMUNITY = [
  {
    label: 'Walking Football',
    detail: 'Monday 8–9pm · Rivervalley Astro · €5/week · All adults',
    href: '/walking-football',
    tag: 'Adults 55+',
  },
  {
    label: 'Ladies Football Fit',
    detail: 'Tuesday 8pm · Small Astro · €5/session · Pre-book with Emma',
    href: '/ladies-football',
    tag: 'All ladies',
  },
  {
    label: 'Football For All',
    detail: 'Saturday 2:30pm · Rivervalley Community Centre · All abilities',
    href: '/football-for-all',
    tag: 'All ages & abilities',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrackStep({
  label,
  ages,
  detail,
  href,
  accentClass,
  textClass,
  isLast,
}: {
  label: string;
  ages: string;
  detail: string;
  href: string;
  accentClass: string;
  textClass: string;
  isLast: boolean;
}) {
  return (
    <div className="flex items-stretch gap-0 flex-1 min-w-0">
      <Link
        href={href}
        className="group flex flex-col gap-1.5 flex-1 p-4 bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
      >
        <span className={`font-display font-black text-[10px] uppercase tracking-widest ${textClass}`}>
          {ages}
        </span>
        <span className="font-display font-black text-sm uppercase text-white leading-tight">
          {label}
        </span>
        <span className="text-white/55 text-[11px] leading-relaxed font-medium mt-0.5">
          {detail}
        </span>
        <span className={`mt-1 text-[10px] font-display font-black uppercase tracking-wide ${textClass} opacity-0 group-hover:opacity-100 transition-opacity`}>
          Learn more →
        </span>
      </Link>
      {!isLast && (
        <div className="flex items-center px-1 shrink-0">
          <ChevronRight className="h-4 w-4 text-white/30" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

function CommunityCard({
  label,
  detail,
  href,
  tag,
}: {
  label: string;
  detail: string;
  href: string;
  tag: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-2 p-5 bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
    >
      <span className="font-display font-black text-[10px] uppercase tracking-widest text-brand-neon">
        {tag}
      </span>
      <span className="font-display font-black text-base uppercase text-white leading-tight">
        {label}
      </span>
      <span className="text-white/55 text-xs leading-relaxed font-medium">
        {detail}
      </span>
      <span className="mt-auto pt-2 text-[10px] font-display font-black uppercase tracking-wide text-brand-neon/70 group-hover:text-brand-neon transition-colors">
        Find out more →
      </span>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PathwayPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Rivervalley Rangers AFC · Est. 1981"
        title="The RVR Pathway"
        description="Every player starts somewhere. Whether you're 4 or 54, boy or girl, beginner or returning player — there's a route into football at Rivervalley Rangers."
        actions={
          <Link
            href="/register"
            className="btn-brutalist-neon inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm"
          >
            Register a Player
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />

      {/* ── Boys pathway ─────────────────────────────────────────────────── */}
      <section className="bg-brand-navy border-b border-brand-sky/10">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-1 w-6 bg-brand-neon shrink-0" />
            <h2 className="font-display font-black italic text-2xl md:text-3xl uppercase text-white tracking-tight">
              Boys Pathway
            </h2>
            <div className="h-px flex-1 bg-brand-sky/20" />
            <Link href="/teams?filter=boys" className="text-brand-sky/60 text-xs font-bold hover:text-brand-neon transition-colors shrink-0">
              All Boys Teams →
            </Link>
          </div>

          {/* Mobile: vertical stack */}
          <div className="flex flex-col gap-3 md:hidden">
            {BOYS.map((step, i) => (
              <Link
                key={step.label}
                href={step.href}
                className="group flex items-start gap-4 p-4 bg-white/8 border border-white/15 hover:bg-white/15 transition-all"
              >
                <div className="shrink-0 w-8 h-8 rounded-full bg-brand-neon text-brand-charcoal font-display font-black text-xs flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-black text-[10px] uppercase tracking-widest text-brand-neon mb-0.5">{step.ages}</p>
                  <p className="font-display font-black text-sm uppercase text-white leading-tight">{step.label}</p>
                  <p className="text-white/50 text-xs mt-1">{step.detail}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-brand-neon/50 group-hover:text-brand-neon shrink-0 mt-1 transition-colors" />
              </Link>
            ))}
          </div>

          {/* Desktop: horizontal steps */}
          <div className="hidden md:flex items-stretch gap-0">
            {BOYS.map((step, i) => (
              <TrackStep
                key={step.label}
                {...step}
                accentClass="text-brand-neon"
                textClass="text-brand-neon"
                isLast={i === BOYS.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Girls pathway ────────────────────────────────────────────────── */}
      <section className="border-b border-brand-sky/10" style={{ backgroundColor: '#5a1235' }}>
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-1 w-6 bg-pink-300 shrink-0" />
            <h2 className="font-display font-black italic text-2xl md:text-3xl uppercase text-white tracking-tight">
              Girls Pathway
            </h2>
            <div className="h-px flex-1 bg-white/15" />
            <Link href="/teams?filter=girls" className="text-white/50 text-xs font-bold hover:text-pink-300 transition-colors shrink-0">
              All Girls Teams →
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {GIRLS.map((step, i) => (
              <Link
                key={step.label}
                href={step.href}
                className="group flex items-start gap-4 p-4 bg-white/8 border border-white/15 hover:bg-white/15 transition-all"
              >
                <div className="shrink-0 w-8 h-8 rounded-full bg-pink-300 text-[#5a1235] font-display font-black text-xs flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-black text-[10px] uppercase tracking-widest text-pink-300 mb-0.5">{step.ages}</p>
                  <p className="font-display font-black text-sm uppercase text-white leading-tight">{step.label}</p>
                  <p className="text-white/50 text-xs mt-1">{step.detail}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-pink-300/50 group-hover:text-pink-300 shrink-0 mt-1 transition-colors" />
              </Link>
            ))}
          </div>

          {/* Desktop — girls has 3 steps, let them take natural width */}
          <div className="hidden md:flex items-stretch gap-0 max-w-3xl">
            {GIRLS.map((step, i) => (
              <TrackStep
                key={step.label}
                {...step}
                accentClass="text-pink-300"
                textClass="text-pink-300"
                isLast={i === GIRLS.length - 1}
              />
            ))}
          </div>

          <p className="mt-4 text-white/35 text-xs font-semibold">
            Academy sessions are shared — boys and girls train together at ages 4–6.
          </p>
        </div>
      </section>

      {/* ── Community & Inclusive ─────────────────────────────────────────── */}
      <section className="bg-brand-green border-b border-brand-green-dark/30">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-6 bg-brand-neon shrink-0" />
            <h2 className="font-display font-black italic text-2xl md:text-3xl uppercase text-white tracking-tight">
              Community &amp; Inclusive
            </h2>
          </div>
          <p className="text-white/60 text-sm font-medium mb-6">
            Football is for everyone — no age limit, no experience required, no barriers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {COMMUNITY.map((p) => (
              <CommunityCard key={p.label} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Late joiner callout ───────────────────────────────────────────── */}
      <section className="bg-brand-cream border-b border-brand-navy/10">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-charcoal mb-4">
                Joining at any age?
              </h2>
              <p className="text-brand-charcoal/70 text-sm leading-relaxed font-medium mb-4">
                You don&apos;t have to start at the Academy to be part of RVR. Adults can join through Walking Football, Ladies Football Fit, or Football For All — no prior experience needed, just enthusiasm.
              </p>
              <p className="text-brand-charcoal/70 text-sm leading-relaxed font-medium">
                Senior players (17+) and Over 35s looking for competitive football are also welcome to make contact about trials and squad availability.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/walking-football" className="group flex items-center justify-between gap-4 border-2 border-brand-navy/20 bg-white p-4 hover:border-brand-navy hover:bg-brand-neon transition-all">
                <div>
                  <p className="font-display font-black text-sm uppercase text-brand-navy">Walking Football</p>
                  <p className="text-xs text-brand-charcoal/50 group-hover:text-brand-charcoal/70 mt-0.5">Monday 8–9pm · €5/week</p>
                </div>
                <ArrowRight className="h-4 w-4 text-brand-navy/40 group-hover:text-brand-navy shrink-0 transition-colors" />
              </Link>
              <Link href="/ladies-football" className="group flex items-center justify-between gap-4 border-2 border-brand-navy/20 bg-white p-4 hover:border-brand-navy hover:bg-brand-neon transition-all">
                <div>
                  <p className="font-display font-black text-sm uppercase text-brand-navy">Ladies Football Fit</p>
                  <p className="text-xs text-brand-charcoal/50 group-hover:text-brand-charcoal/70 mt-0.5">Tuesday 8pm · €5/session</p>
                </div>
                <ArrowRight className="h-4 w-4 text-brand-navy/40 group-hover:text-brand-navy shrink-0 transition-colors" />
              </Link>
              <Link href="/football-for-all" className="group flex items-center justify-between gap-4 border-2 border-brand-navy/20 bg-white p-4 hover:border-brand-navy hover:bg-brand-neon transition-all">
                <div>
                  <p className="font-display font-black text-sm uppercase text-brand-navy">Football For All</p>
                  <p className="text-xs text-brand-charcoal/50 group-hover:text-brand-charcoal/70 mt-0.5">Saturday 2:30pm · All abilities</p>
                </div>
                <ArrowRight className="h-4 w-4 text-brand-navy/40 group-hover:text-brand-navy shrink-0 transition-colors" />
              </Link>
              <Link href="/seniors" className="group flex items-center justify-between gap-4 border-2 border-brand-navy/20 bg-white p-4 hover:border-brand-navy hover:bg-brand-neon transition-all">
                <div>
                  <p className="font-display font-black text-sm uppercase text-brand-navy">Senior &amp; Over 35s</p>
                  <p className="text-xs text-brand-charcoal/50 group-hover:text-brand-charcoal/70 mt-0.5">17+ / 35+ · Contact us about squad availability</p>
                </div>
                <ArrowRight className="h-4 w-4 text-brand-navy/40 group-hover:text-brand-navy shrink-0 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-brand-neon border-b border-brand-charcoal/10">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display font-black italic text-2xl uppercase text-brand-charcoal">
              Ready to start your journey?
            </p>
            <p className="text-brand-charcoal/70 text-sm mt-1">
              Register today — all ages and abilities welcome at Rivervalley Rangers.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/register"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 border-3 border-brand-charcoal bg-brand-charcoal px-6 py-3 text-sm font-display font-black uppercase text-brand-neon shadow-[4px_4px_0_rgba(11,31,59,0.4)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Register Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 border-3 border-brand-charcoal px-6 py-3 text-sm font-display font-black uppercase text-brand-charcoal hover:bg-brand-charcoal/10 transition-colors"
            >
              Ask a Question →
            </Link>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}

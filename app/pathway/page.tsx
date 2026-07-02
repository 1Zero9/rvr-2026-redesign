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
  { label: 'Development Academy', ages: 'Ages 4–6',  detail: 'Saturday mornings · Small Astro',            href: '/academy'           },
  { label: 'Youth Development',   ages: 'U7 – U11',  detail: 'DDSL Boys · Small-sided · Building skills',  href: '/teams?filter=boys' },
  { label: 'Youth Competitive',   ages: 'U12 – U17', detail: 'DDSL Boys · 11-a-side · Full season',        href: '/teams?filter=boys' },
  { label: 'Senior Football',     ages: '17+',       detail: 'LSL & AFL · Competitive adult football',     href: '/seniors'           },
  { label: 'Over 35s',            ages: '35+',       detail: 'Two sides · AFL · Never stop playing',       href: '/seniors/over-35s'  },
];

const GIRLS = [
  { label: 'Development Academy', ages: 'Ages 4–6', detail: 'Boys & girls together · Saturday mornings',        href: '/academy'            },
  { label: 'Youth Girls',         ages: 'U7 – U18', detail: 'DDSL Girls · Multiple age groups & divisions',     href: '/teams?filter=girls' },
  { label: 'Ladies Football Fit', ages: 'Adult',    detail: 'Tuesday 8pm · Small Astro · €5 per session',       href: '/ladies-football'    },
];

const COMMUNITY = [
  { label: 'Walking Football',    tag: 'Adults',           detail: 'Monday 8–9pm · Rivervalley Astro · €5/week',           href: '/walking-football' },
  { label: 'Ladies Football Fit', tag: 'All ladies',       detail: 'Tuesday 8pm · Small Astro · €5/session',                href: '/ladies-football'  },
  { label: 'Football For All',    tag: 'All ages & abilities', detail: 'Saturday 2:30pm · Rivervalley Community Centre',   href: '/football-for-all' },
];

// ─── Step card ────────────────────────────────────────────────────────────────

function StepCard({
  label, ages, detail, href, topBar, labelColor, isLast,
}: {
  label: string; ages: string; detail: string; href: string;
  topBar: string; labelColor: string; isLast: boolean;
}) {
  return (
    <div className="flex items-stretch flex-1 min-w-0 min-w-[140px]">
      <Link
        href={href}
        className="group flex flex-col flex-1 border-2 border-brand-navy bg-white shadow-[3px_3px_0_#0B1F3B] hover:shadow-[1px_1px_0_#0B1F3B] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
      >
        <div className={`h-1 w-full shrink-0 ${topBar}`} />
        <div className="flex flex-col gap-1 p-4 flex-1">
          <span className={`font-display font-black text-[10px] uppercase tracking-widest ${labelColor}`}>{ages}</span>
          <span className="font-display font-black text-sm uppercase text-brand-navy leading-tight">{label}</span>
          <span className="text-brand-charcoal/50 text-[11px] leading-relaxed font-medium mt-0.5 flex-1">{detail}</span>
          <span className={`mt-2 text-[10px] font-display font-black uppercase tracking-wide ${labelColor} opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity`}>
            View →
          </span>
        </div>
      </Link>
      {!isLast && (
        <div className="flex items-center px-1 shrink-0 text-brand-navy/20">
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

// ─── Mobile step row ──────────────────────────────────────────────────────────

function MobileStep({
  label, ages, detail, href, badgeBg, badgeText, num,
}: {
  label: string; ages: string; detail: string; href: string;
  badgeBg: string; badgeText: string; num: number;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 border-2 border-brand-navy bg-white p-4 shadow-[2px_2px_0_#0B1F3B] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
    >
      <div className={`shrink-0 w-8 h-8 ${badgeBg} font-display font-black text-xs ${badgeText} flex items-center justify-center rounded-full border-2 border-brand-navy`}>
        {num}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-black text-[10px] uppercase tracking-widest text-brand-charcoal/50 mb-0.5">{ages}</p>
        <p className="font-display font-black text-sm uppercase text-brand-navy leading-tight">{label}</p>
        <p className="text-brand-charcoal/55 text-xs mt-1 leading-relaxed">{detail}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-brand-navy/30 group-hover:text-brand-navy shrink-0 mt-0.5 transition-colors" />
    </Link>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function TrackHeader({
  title, accentBar, linkHref, linkLabel,
}: {
  title: string; accentBar: string; linkHref: string; linkLabel: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`h-6 w-1.5 shrink-0 ${accentBar}`} />
      <h2 className="font-display font-black italic text-2xl md:text-3xl uppercase text-brand-charcoal tracking-tight">
        {title}
      </h2>
      <div className="h-px flex-1 bg-brand-navy/10" />
      <Link href={linkHref} className="text-brand-navy/40 text-xs font-bold hover:text-brand-navy transition-colors shrink-0">
        {linkLabel} →
      </Link>
    </div>
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
          <Link href="/register" className="btn-brutalist-neon inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm">
            Register a Player <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />

      {/* ── Boys pathway ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-brand-navy/10">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <TrackHeader title="Boys Pathway" accentBar="bg-brand-neon" linkHref="/teams?filter=boys" linkLabel="All Boys Teams" />

          {/* Mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {BOYS.map((s, i) => (
              <MobileStep key={s.label} {...s} badgeBg="bg-brand-neon" badgeText="text-brand-charcoal" num={i + 1} />
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-stretch gap-0 overflow-x-auto">
            {BOYS.map((s, i) => (
              <StepCard key={s.label} {...s} topBar="bg-brand-neon" labelColor="text-brand-green" isLast={i === BOYS.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Girls pathway ────────────────────────────────────────────────── */}
      <section className="bg-brand-cream border-b border-brand-navy/10">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <TrackHeader title="Girls Pathway" accentBar="bg-brand-maroon" linkHref="/teams?filter=girls" linkLabel="All Girls Teams" />

          {/* Mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {GIRLS.map((s, i) => (
              <MobileStep key={s.label} {...s} badgeBg="bg-brand-maroon" badgeText="text-white" num={i + 1} />
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-stretch gap-0 max-w-3xl overflow-x-auto">
            {GIRLS.map((s, i) => (
              <StepCard key={s.label} {...s} topBar="bg-brand-maroon" labelColor="text-brand-maroon" isLast={i === GIRLS.length - 1} />
            ))}
          </div>

          <p className="mt-5 text-brand-charcoal/45 text-xs font-semibold">
            Academy sessions are shared — boys and girls train together at ages 4–6.
          </p>
        </div>
      </section>

      {/* ── Community & Inclusive ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-brand-navy/10">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-6 w-1.5 shrink-0 bg-brand-green" />
            <h2 className="font-display font-black italic text-2xl md:text-3xl uppercase text-brand-charcoal tracking-tight">
              Community &amp; Inclusive
            </h2>
          </div>
          <p className="text-brand-charcoal/50 text-sm font-medium mb-6 ml-4">
            Football is for everyone — no age limit, no experience required, no barriers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {COMMUNITY.map((p) => (
              <Link
                key={p.label}
                href={p.href}
                className="group flex flex-col border-2 border-brand-navy bg-white shadow-[3px_3px_0_#0B1F3B] hover:shadow-[1px_1px_0_#0B1F3B] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <div className="h-1 w-full bg-brand-green shrink-0" />
                <div className="flex flex-col gap-2 p-5 flex-1">
                  <span className="font-display font-black text-[10px] uppercase tracking-widest text-brand-green">{p.tag}</span>
                  <span className="font-display font-black text-base uppercase text-brand-navy leading-tight">{p.label}</span>
                  <span className="text-brand-charcoal/55 text-xs leading-relaxed font-medium flex-1">{p.detail}</span>
                  <span className="mt-2 text-[10px] font-display font-black uppercase tracking-wide text-brand-green opacity-0 group-hover:opacity-100 transition-opacity">
                    Find out more →
                  </span>
                </div>
              </Link>
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
              {[
                { label: 'Walking Football',    sub: 'Monday 8–9pm · €5/week',                      href: '/walking-football' },
                { label: 'Ladies Football Fit', sub: 'Tuesday 8pm · €5/session',                    href: '/ladies-football'  },
                { label: 'Football For All',    sub: 'Saturday 2:30pm · All abilities',             href: '/football-for-all' },
                { label: 'Senior & Over 35s',   sub: '17+ / 35+ · Contact us about availability',   href: '/seniors'          },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center justify-between gap-4 border-2 border-brand-navy/20 bg-white p-4 hover:border-brand-navy hover:bg-brand-neon transition-all"
                >
                  <div>
                    <p className="font-display font-black text-sm uppercase text-brand-navy">{item.label}</p>
                    <p className="text-xs text-brand-charcoal/50 group-hover:text-brand-charcoal/70 mt-0.5">{item.sub}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-brand-navy/30 group-hover:text-brand-navy shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-brand-neon border-b border-brand-charcoal/10">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display font-black italic text-2xl uppercase text-brand-charcoal">Ready to start your journey?</p>
            <p className="text-brand-charcoal/70 text-sm mt-1">Register today — all ages and abilities welcome at Rivervalley Rangers.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/register" className="inline-flex min-h-[44px] items-center justify-center gap-2 border-3 border-brand-charcoal bg-brand-charcoal px-6 py-3 text-sm font-display font-black uppercase text-brand-neon shadow-[4px_4px_0_rgba(11,31,59,0.4)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              Register Now
            </Link>
            <Link href="/contact" className="inline-flex min-h-[44px] items-center justify-center gap-2 border-3 border-brand-charcoal px-6 py-3 text-sm font-display font-black uppercase text-brand-charcoal hover:bg-brand-charcoal/10 transition-colors">
              Ask a Question →
            </Link>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}

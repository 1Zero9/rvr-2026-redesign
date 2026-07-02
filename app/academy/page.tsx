import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CalendarDays,
  CheckCircle2,
  MapPin,
  Star,
  Users,
} from 'lucide-react';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';

export const metadata: Metadata = {
  title: 'RVR Academy',
  description:
    "The Rivervalley Rangers Academy — Swords' dedicated football programme for children aged 4–6. Fun, structured Saturday sessions with qualified coaches.",
};

const highlights = [
  'Dedicated and committed qualified coaches',
  'Emphasis on fun, confidence, and learning',
  'Develops social skills, teamwork, and fitness',
  'Safe, welcoming environment for first-time players',
  'Structured pathway into DDSL age-group football',
  'Operating in Swords for over 20 years',
];

const programmes = [
  {
    name: 'Little Rangers',
    ages: 'Ages 4–5',
    description:
      'First steps on the pitch. Focused purely on movement, ball-play, and enjoyment. No experience required — just enthusiasm.',
    colour: 'border-brand-neon bg-brand-navy',
    accent: 'bg-brand-neon',
    labelColour: 'text-brand-neon',
  },
  {
    name: 'Academy (Pre-U7)',
    ages: 'Age 6',
    description:
      'A structured, age-appropriate programme that builds the foundations before the DDSL pathway begins at U7. Teamwork, technique, and fun.',
    colour: 'border-brand-sky bg-brand-navy',
    accent: 'bg-brand-sky',
    labelColour: 'text-brand-sky',
  },
];

export default function AcademyPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow={<><Star className="h-4 w-4" aria-hidden="true" /> RVR Development Academy</>}
        title="Academy"
        description="Swords' dedicated grassroots football programme for children aged 4–6. Saturday sessions at Rivervalley Park with qualified, Garda-vetted coaches."
        actions={
          <>
            <Link
              href="/register"
              className="btn-brutalist-neon inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm"
            >
              Register a Player
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-brand-sky/40 px-5 py-3 text-sm font-bold text-brand-sky hover:border-brand-neon hover:text-brand-neon transition-colors"
            >
              Get in Touch
            </Link>
          </>
        }
      />

      {/* ── Programmes ───────────────────────────────────────────────────── */}
      <section className="bg-brand-cream border-b border-brand-navy/10">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-charcoal mb-8">
            Our Programmes
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {programmes.map((p) => (
              <div
                key={p.name}
                className={`flex flex-col border-2 ${p.colour} shadow-[4px_4px_0_#0B1F3B]`}
              >
                <div className={`h-1.5 w-full shrink-0 ${p.accent}`} />
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <p className={`font-display text-xs font-black uppercase tracking-widest ${p.labelColour}`}>
                    {p.ages}
                  </p>
                  <p className="font-display font-black italic text-xl text-brand-cream uppercase leading-tight">
                    {p.name}
                  </p>
                  <p className="text-sm text-brand-sky/80 leading-relaxed mt-1">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-2 border-brand-navy/20 bg-white p-5">
            <p className="text-sm text-brand-charcoal/60 leading-relaxed">
              <span className="font-black text-brand-charcoal">No experience needed.</span>{' '}
              The Academy is open to all children in the age range — whether it’s their first time touching a football or they’ve been kicking one in the garden for years.
            </p>
          </div>
        </div>
      </section>

      {/* ── What we offer ────────────────────────────────────────────────── */}
      <section className="bg-brand-navy border-b border-brand-sky/10">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-cream mb-2">
            What We Offer
          </h2>
          <p className="text-brand-sky/70 text-sm mb-8">
            A successful grassroots academy operating in Swords for over 20 years.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-neon mt-0.5" aria-hidden="true" />
                <span className="text-sm font-semibold text-brand-cream/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Training details ─────────────────────────────────────────────── */}
      <section className="bg-brand-cream border-b border-brand-navy/10">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-charcoal mb-8">
            Training
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="brutalist-card bg-white p-5 flex flex-col gap-2">
              <CalendarDays className="h-6 w-6 text-brand-navy" aria-hidden="true" />
              <p className="font-display font-black text-sm uppercase tracking-wide text-brand-charcoal">Day</p>
              <p className="text-brand-charcoal/70 text-sm">Saturday mornings</p>
            </div>
            <div className="brutalist-card bg-white p-5 flex flex-col gap-2">
              <Users className="h-6 w-6 text-brand-navy" aria-hidden="true" />
              <p className="font-display font-black text-sm uppercase tracking-wide text-brand-charcoal">Age Groups</p>
              <p className="text-brand-charcoal/70 text-sm">Ages 4–6 (pre-U7)</p>
            </div>
            <div className="brutalist-card bg-white p-5 flex flex-col gap-2">
              <MapPin className="h-6 w-6 text-brand-navy" aria-hidden="true" />
              <p className="font-display font-black text-sm uppercase tracking-wide text-brand-charcoal">Venue</p>
              <p className="text-brand-charcoal/70 text-sm">Rivervalley Park, Swords</p>
            </div>
          </div>
          <p className="mt-5 text-xs text-brand-charcoal/40">
            Exact session times are confirmed at the start of each season. Contact us for current schedule details.
          </p>
        </div>
      </section>

      {/* ── Pathway ──────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-brand-navy/10">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-charcoal mb-4">
            The RVR Pathway
          </h2>
          <p className="text-brand-charcoal/60 text-sm leading-relaxed mb-8 max-w-2xl">
            The Academy is the first step in a long-term player pathway at Rivervalley Rangers. Players progress through age groups into DDSL-registered competitive and development football.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch gap-0">
            {[
              { label: 'Academy', sub: 'Ages 4–6', active: true },
              { label: 'U7 – U11', sub: 'Development', active: false },
              { label: 'U12 – U17', sub: 'Competitive', active: false },
              { label: 'Senior', sub: '17+', active: false },
            ].map((step, i) => (
              <div
                key={step.label}
                className={`flex-1 border-2 p-4 text-center ${
                  step.active
                    ? 'border-brand-neon bg-brand-navy text-brand-neon'
                    : 'border-brand-navy/20 bg-brand-cream text-brand-charcoal'
                } ${i > 0 ? 'sm:-ml-0.5 -mt-0.5 sm:mt-0' : ''}`}
              >
                <p className={`font-display font-black text-base uppercase ${step.active ? 'text-brand-neon' : 'text-brand-charcoal'}`}>
                  {step.label}
                </p>
                <p className={`text-xs mt-1 ${step.active ? 'text-brand-sky' : 'text-brand-charcoal/50'}`}>
                  {step.sub}
                </p>
                {step.active && (
                  <p className="text-[10px] font-bold text-brand-neon/70 uppercase tracking-wide mt-1">You are here</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-brand-neon border-b border-brand-charcoal/10">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display font-black italic text-2xl uppercase text-brand-charcoal">
              Ready to join?
            </p>
            <p className="text-brand-charcoal/70 text-sm mt-1">
              Register your child for the upcoming Academy season.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 border-3 border-brand-charcoal bg-brand-charcoal px-6 py-3 text-sm font-display font-black uppercase text-brand-neon shadow-[4px_4px_0_rgba(11,31,59,0.4)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Register Now
            </Link>
            <Link
              href="/teams"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 border-3 border-brand-charcoal px-6 py-3 text-sm font-display font-black uppercase text-brand-charcoal hover:bg-brand-charcoal/10 transition-colors"
            >
              View All Teams →
            </Link>
          </div>
        </div>
      </section>

    </PublicPageShell>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Star,
  Users,
} from 'lucide-react';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';

export const metadata: Metadata = {
  title: 'Development Academy | Rivervalley Rangers AFC',
  description:
    "The Rivervalley Rangers Development Academy — Swords' fun, welcoming Saturday football programme for children born 2020, 2021 & 2022 (ages 4–6). Over 20 years in the community.",
};

const highlights = [
  'Dedicated and committed qualified coaches',
  'Fun, relaxed and friendly environment',
  'Develops social skills, teamwork, and confidence',
  'Safe, welcoming space for first-time players',
  'Structured pathway into DDSL age-group football',
  'Over 20 years serving the Swords community',
];

const sessions = [
  {
    time: '10:00am',
    born: '2021 & 2022',
    ages: 'Ages 4–5',
    accentClass: 'bg-brand-neon',
    labelClass: 'text-brand-neon',
    borderClass: 'border-brand-neon',
  },
  {
    time: '11:30am',
    born: '2020',
    ages: 'Age 6',
    accentClass: 'bg-brand-sky',
    labelClass: 'text-brand-sky',
    borderClass: 'border-brand-sky',
  },
];

export default function AcademyPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow={<><Star className="h-4 w-4" aria-hidden="true" /> RVR Development Academy</>}
        title="Development Academy"
        description="Swords' biggest and best football academy — over 20 years introducing children to the beautiful game. Fun, relaxed Saturday sessions with Ginny and the Academy Team at Rivervalley Park."
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

      {/* ── Session times ────────────────────────────────────────────────── */}
      <section className="bg-brand-cream border-b border-brand-navy/10">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-charcoal mb-2">
            Saturday Sessions
          </h2>
          <p className="text-brand-charcoal/60 text-sm mb-8">
            Small Astro pitch, Rivervalley Park — sessions split by year of birth.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {sessions.map((s) => (
              <div
                key={s.born}
                className={`flex flex-col border-2 border-brand-navy bg-brand-navy shadow-[4px_4px_0_#0B1F3B]`}
              >
                <div className={`h-1.5 w-full shrink-0 ${s.accentClass}`} />
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center gap-2">
                    <Clock className={`h-5 w-5 shrink-0 ${s.labelClass}`} aria-hidden="true" />
                    <p className={`font-display font-black text-2xl italic uppercase ${s.labelClass}`}>
                      {s.time}
                    </p>
                  </div>
                  <div>
                    <p className="font-display font-black text-sm uppercase tracking-widest text-brand-sky/60 mb-0.5">
                      Born in
                    </p>
                    <p className="font-display font-black italic text-xl text-brand-cream uppercase leading-tight">
                      {s.born}
                    </p>
                    <p className={`font-display font-black text-xs uppercase tracking-widest mt-1 ${s.labelClass}`}>
                      {s.ages}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-2 border-brand-navy/20 bg-white p-5">
            <p className="text-sm text-brand-charcoal/60 leading-relaxed">
              <span className="font-black text-brand-charcoal">No experience needed.</span>{' '}
              The Academy is open to all children in the age range — whether it&apos;s their first time touching a football or they&apos;ve been kicking one in the garden for years. Boys and girls equally welcome.
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
            Over 20 years providing a fantastic, fun introduction to football in Swords.
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
            Where &amp; When
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
              <p className="text-brand-charcoal/70 text-sm">Born 2020, 2021 &amp; 2022</p>
              <p className="text-xs text-brand-charcoal/50 mt-1">Ages 4–6 · Boys and girls welcome</p>
            </div>
            <div className="brutalist-card bg-white p-5 flex flex-col gap-2">
              <MapPin className="h-6 w-6 text-brand-navy" aria-hidden="true" />
              <p className="font-display font-black text-sm uppercase tracking-wide text-brand-charcoal">Venue</p>
              <p className="text-brand-charcoal/70 text-sm">Small Astro Pitch</p>
              <p className="text-xs text-brand-charcoal/50 mt-1">Rivervalley Park, Swords</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pathway ──────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-brand-navy/10">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-charcoal mb-4">
            The RVR Pathway
          </h2>
          <p className="text-brand-charcoal/60 text-sm leading-relaxed mb-8 max-w-2xl">
            The Academy is the first step on a long-term player pathway. Players progress through age groups into DDSL-registered competitive and development football — from their very first kick to senior league.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch gap-0">
            {[
              { label: 'Academy', sub: 'Born 2020–2022 · Ages 4–6', active: true },
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

      {/* ── Contact / CTA ────────────────────────────────────────────────── */}
      <section className="bg-brand-neon border-b border-brand-charcoal/10">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display font-black italic text-2xl uppercase text-brand-charcoal">
              Don&apos;t miss out — sign up today
            </p>
            <p className="text-brand-charcoal/70 text-sm mt-1 mb-4">
              Drop us a message, register online, or call us directly.
            </p>
            <div className="flex flex-col gap-1.5">
              <a
                href="tel:0871311093"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-charcoal hover:underline"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                087 131 1093
              </a>
              <a
                href="tel:0876174453"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-charcoal hover:underline"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                087 617 4453
              </a>
            </div>
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
              Message Us →
            </Link>
          </div>
        </div>
      </section>

    </PublicPageShell>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';

export const metadata: Metadata = {
  title: 'Community Football',
  description: 'Community football programmes at Rivervalley Rangers AFC — Walking Football, Ladies Football Fit, and Football For All. Open to everyone in Swords, Dublin.',
  alternates: { canonical: '/community' },
};

export default function CommunityPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Community programmes · Open to all"
        title="Community Football"
        description="Not every player wants competitive league football — and that's perfectly fine. Our community programmes are open to everyone in Swords, whatever your age, ability, or background."
      />

      <div className="mx-auto max-w-3xl px-4 py-10 space-y-10">

        {/* ── Walking Football ───────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border-2 border-brand-navy overflow-hidden">
          <div className="bg-brand-navy px-6 py-4 flex items-center gap-3">
            <span className="text-2xl select-none" aria-hidden="true">🚶</span>
            <div>
              <h2 className="font-display font-black italic text-xl uppercase text-brand-neon leading-none">
                Walking Football
              </h2>
              <p className="text-brand-sky/70 text-xs font-semibold mt-0.5">For all adults · No running required</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-brand-navy/10 border-b border-brand-navy/10">
            {[
              { label: 'Day',    value: 'Every Monday' },
              { label: 'Time',   value: '8:00–9:00pm'  },
              { label: 'Venue',  value: 'Rivervalley Astro, Swords' },
              { label: 'Cost',   value: '€5 per session' },
            ].map((item) => (
              <div key={item.label} className="px-4 py-3">
                <p className="text-brand-green font-display font-black text-[10px] uppercase tracking-widest mb-0.5">{item.label}</p>
                <p className="text-brand-charcoal text-sm font-semibold leading-snug">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="px-6 py-5 space-y-3">
            <p className="text-sm font-semibold text-zinc-700 leading-relaxed">
              Walking Football is one of the fastest growing sports in Ireland — the real game, played at walking pace. Open to all adults of every fitness level, men and women. Sessions are led by FAI-qualified coaches and covered by full club insurance. All you need is a pair of trainers.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {['No running', 'No slide tackles', 'No heading', 'All abilities'].map((rule) => (
                <div key={rule} className="flex items-center gap-1.5 text-xs font-bold text-zinc-600">
                  <span className="text-brand-green font-black" aria-hidden="true">✓</span>
                  {rule}
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-5">
            <Link
              href="/walking-football"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 border-2 border-brand-navy bg-brand-navy text-brand-neon font-display font-black uppercase text-xs shadow-[3px_3px_0_#121212] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Full Walking Football details →
            </Link>
          </div>
        </section>

        {/* ── Ladies Football Fit ────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border-2 border-pink-400 overflow-hidden">
          <div className="bg-pink-600 px-6 py-4 flex items-center gap-3">
            <span className="text-2xl select-none" aria-hidden="true">⚽</span>
            <div>
              <h2 className="font-display font-black italic text-xl uppercase text-white leading-none">
                Ladies Football Fit
              </h2>
              <p className="text-pink-200 text-xs font-semibold mt-0.5">All ladies welcome · No experience needed</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-pink-200 border-b border-pink-100">
            {[
              { label: 'Day',    value: 'Every Tuesday' },
              { label: 'Time',   value: '8:00pm'        },
              { label: 'Venue',  value: 'Small Astro, Rivervalley Park' },
              { label: 'Cost',   value: '€5 per session' },
            ].map((item) => (
              <div key={item.label} className="px-4 py-3">
                <p className="text-pink-600 font-display font-black text-[10px] uppercase tracking-widest mb-0.5">{item.label}</p>
                <p className="text-brand-charcoal text-sm font-semibold leading-snug">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="px-6 py-5 space-y-4">
            <p className="text-sm font-semibold text-zinc-700 leading-relaxed">
              A fun, friendly Tuesday evening session for women of all ages and abilities — whether you&apos;ve never kicked a ball or played years ago. Sessions held on the Small Astro at Rivervalley Park. Places are limited so pre-booking is required.
            </p>
            <a
              href="tel:0867976766"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 border-2 border-pink-600 bg-pink-600 text-white font-display font-black uppercase text-xs shadow-[3px_3px_0_rgba(0,0,0,0.25)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              Call Emma to book — 086 797 6766
            </a>
            <div>
              <Link
                href="/ladies-football"
                className="text-xs font-bold text-pink-600 underline underline-offset-4 hover:text-pink-800 transition-colors"
              >
                Full Ladies Football details →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Football For All ───────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border-2 border-brand-green overflow-hidden">
          <div className="bg-brand-green px-6 py-4 flex items-center gap-3">
            <span className="text-2xl select-none" aria-hidden="true">💚</span>
            <div>
              <h2 className="font-display font-black italic text-xl uppercase text-brand-neon leading-none">
                Football For All
              </h2>
              <p className="text-green-200 text-xs font-semibold mt-0.5">Inclusive programme · Every ability welcome</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-brand-green/15 border-b border-brand-green/15">
            {[
              { label: 'Day',    value: 'Every Saturday' },
              { label: 'Time',   value: '2:30pm'         },
              { label: 'Venue',  value: 'Rivervalley Community Centre' },
              { label: 'Cost',   value: 'Contact us'     },
            ].map((item) => (
              <div key={item.label} className="px-4 py-3">
                <p className="text-brand-green font-display font-black text-[10px] uppercase tracking-widest mb-0.5">{item.label}</p>
                <p className="text-brand-charcoal text-sm font-semibold leading-snug">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="px-6 py-5 space-y-4">
            <p className="text-sm font-semibold text-zinc-700 leading-relaxed">
              RVR&apos;s inclusive football programme for players of all abilities — adaptive, mixed-ability, and sensory-friendly. Sessions are led by FAI and UEFA-certified coaches trained in special educational needs. Boys and girls welcome. If you want to play, we want you here.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {['Sensory-friendly space', 'Non-competitive sessions', 'Garda vetted coaches'].map((point) => (
                <div key={point} className="flex items-center gap-1.5 text-xs font-bold text-zinc-600">
                  <span className="text-brand-green font-black" aria-hidden="true">✓</span>
                  {point}
                </div>
              ))}
            </div>
            <Link
              href="/football-for-all"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 border-2 border-brand-green bg-brand-green text-white font-display font-black uppercase text-xs shadow-[3px_3px_0_rgba(0,0,0,0.25)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Full Football For All details →
            </Link>
          </div>
        </section>

        {/* ── General info ───────────────────────────────────────────────── */}
        <section className="bg-brand-navy rounded-2xl p-6 sm:p-8">
          <h2 className="font-display font-black italic text-xl uppercase text-brand-neon mb-4">
            All Programmes Are
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '🛡️', text: '100% Garda vetted coaches' },
              { icon: '📋', text: 'FAI Club Mark accredited'  },
              { icon: '📍', text: 'Based in Rivervalley Park, Swords' },
              { icon: '🤝', text: 'Open to all — no trials, no pressure' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm font-semibold text-brand-sky">
                <span className="text-xl select-none shrink-0" role="img" aria-hidden="true">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-brand-sky/15">
            <p className="text-brand-sky/70 text-sm font-semibold mb-3">Questions? Get in touch.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 bg-white text-brand-navy font-display font-black uppercase text-xs border-2 border-white shadow-[3px_3px_0_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Contact the Club →
            </Link>
          </div>
        </section>

      </div>
    </PublicPageShell>
  );
}

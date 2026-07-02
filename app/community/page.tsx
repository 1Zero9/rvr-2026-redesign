import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import { Users, Heart, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Community Football',
  description: 'Community football programmes at Rivervalley Rangers AFC — Walking Football, Ladies Football Fit, and Football For All. Open to everyone in Swords, Dublin.',
  alternates: { canonical: '/community' },
};

const PROGRAMMES = [
  {
    slug: 'walking-football',
    label: 'Walking Football',
    tagline: 'Football for everyone, at any pace',
    description: 'Open to all adults — no running required. Stay active, meet people, and enjoy real football at a gentler pace. Sessions every Monday night at Rivervalley Astro.',
    detail: 'Monday nights · 8–9pm · €5 per session · All abilities',
    icon: '🚶',
    href: '/walking-football',
    colour: 'border-brand-green bg-brand-green/5 hover:bg-brand-green/10',
    labelColour: 'text-brand-green',
  },
  {
    slug: 'ladies-football',
    label: 'Ladies Football Fit',
    tagline: 'Get fit, have fun, learn the basics',
    description: 'A fun, welcoming session every Tuesday for ladies in Swords. No experience needed — just come along, get active, and make new friends on the Small Astro at Rivervalley Park.',
    detail: 'Tuesday nights · 8:00pm · €5 per session · Contact Emma to pre-book',
    icon: '⚽',
    href: '/ladies-football',
    colour: 'border-pink-400 bg-pink-50 hover:bg-pink-100/80',
    labelColour: 'text-pink-600',
  },
  {
    slug: 'football-for-all',
    label: 'Football For All',
    tagline: 'Football for every ability',
    description: 'RVR\'s inclusive programme for players of all abilities. A safe, supportive, and joyful environment where everyone belongs. If you want to play, we want you here.',
    detail: 'Season schedule confirmed before each season opens',
    icon: '💚',
    href: '/football-for-all',
    colour: 'border-brand-sky bg-brand-sky/5 hover:bg-brand-sky/10',
    labelColour: 'text-brand-sky',
  },
];

const WHY_COMMUNITY = [
  { icon: <Users className="w-6 h-6" aria-hidden="true" />, title: 'Open to All', body: 'No trials, no age limits, no experience required. Our community programmes welcome everyone.' },
  { icon: <Heart className="w-6 h-6" aria-hidden="true" />, title: 'More Than Football', body: 'Social, inclusive, and fun. These sessions are as much about community as they are about the game.' },
  { icon: '🛡️', title: 'Safe & Supported', body: 'All sessions are led by Garda-vetted, FAI-qualified coaches. Everyone is covered by club insurance.' },
  { icon: '📍', title: 'Based in Swords', body: 'All sessions run at Rivervalley Park, Swords — right in the heart of the community.' },
];

export default function CommunityPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        backHref="/register"
        backLabel="Join the Club"
        title="Community Football"
        description="Not every player wants competitive league football — and that's perfectly fine. Our community programmes are open to everyone in Swords, whatever your age, ability, or background."
        links={
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PROGRAMMES.map((p) => (
              <Link
                key={p.slug}
                href={p.href}
                className="border border-brand-sky/30 bg-white/10 hover:bg-white/20 p-4 transition-colors"
              >
                <p className="text-brand-neon font-display font-black text-xs uppercase tracking-widest mb-1">
                  {p.icon} {p.label}
                </p>
                <p className="text-brand-cream text-sm font-semibold leading-snug">{p.tagline}</p>
              </Link>
            ))}
          </div>
        }
      />

      <div className="mx-auto max-w-3xl px-4 py-10 space-y-10">

        {/* Programme cards */}
        <section>
          <h2 className="font-display font-black italic text-2xl uppercase text-brand-navy border-l-4 border-brand-green pl-3 mb-6">
            Our Programmes
          </h2>
          <div className="space-y-5">
            {PROGRAMMES.map((p) => (
              <Link
                key={p.slug}
                href={p.href}
                className={`group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-2xl border-2 p-6 transition-colors ${p.colour}`}
              >
                <span className="text-4xl shrink-0 select-none" aria-hidden="true">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-display font-black text-xs uppercase tracking-widest mb-1 ${p.labelColour}`}>
                    {p.label}
                  </p>
                  <h3 className="font-display font-black italic text-xl uppercase text-brand-charcoal leading-tight mb-2">
                    {p.tagline}
                  </h3>
                  <p className="text-sm font-semibold text-zinc-600 leading-relaxed mb-2">{p.description}</p>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">{p.detail}</p>
                </div>
                <ArrowRight
                  className="shrink-0 w-5 h-5 text-zinc-400 group-hover:text-brand-navy transition-colors sm:self-center"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Why community section */}
        <section className="bg-brand-navy rounded-2xl p-6 sm:p-8">
          <h2 className="font-display font-black italic text-2xl uppercase text-brand-neon mb-6">
            Why Community Football?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_COMMUNITY.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="shrink-0 text-brand-neon mt-0.5">
                  {typeof item.icon === 'string'
                    ? <span className="text-2xl select-none" aria-hidden="true">{item.icon}</span>
                    : item.icon
                  }
                </div>
                <div>
                  <h3 className="font-display font-black uppercase text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-xs font-semibold text-brand-sky/80 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA block */}
        <section className="bg-white rounded-2xl border-2 border-brand-navy p-6 sm:p-8 text-center">
          <p className="font-display font-black text-xs uppercase tracking-widest text-brand-green mb-2">Ready to get started?</p>
          <h2 className="font-display font-black italic text-2xl uppercase text-brand-navy mb-3">
            Pick Your Programme
          </h2>
          <p className="text-sm font-semibold text-zinc-600 leading-relaxed max-w-md mx-auto mb-6">
            Each programme has its own page with session times, contact details, and everything you need to get started. Just choose the one that suits you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {PROGRAMMES.map((p) => (
              <Link
                key={p.slug}
                href={p.href}
                className="inline-flex items-center gap-2 min-h-[48px] px-5 border-2 border-brand-navy bg-brand-navy text-brand-neon font-display font-black uppercase text-sm shadow-[3px_3px_0_#121212] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                {p.label} →
              </Link>
            ))}
          </div>
        </section>

      </div>
    </PublicPageShell>
  );
}

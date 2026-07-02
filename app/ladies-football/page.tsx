import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';

export const metadata: Metadata = {
  title: 'Ladies Football | Rivervalley Rangers AFC',
  description:
    'Ladies Football Fit at Rivervalley Rangers AFC — Tuesdays at 8pm on the Small Astro, Rivervalley Park. Get fit, have fun, and learn the basics of football. All abilities welcome.',
};

const BENEFITS = [
  {
    icon: '💪',
    title: 'Get Fit',
    body: 'A fun way to improve your fitness, stamina, and overall wellbeing without it feeling like exercise.',
  },
  {
    icon: '⚽',
    title: 'Learn Football',
    body: "Never played before? No problem. We'll teach you the basics in a relaxed, no-pressure environment.",
  },
  {
    icon: '🤝',
    title: 'Make Friends',
    body: 'Meet like-minded women from Swords and the surrounding area. Great craic guaranteed.',
  },
  {
    icon: '🏃‍♀️',
    title: 'All Abilities',
    body: 'Whether you played for years or this is your very first time on a football pitch — you are welcome here.',
  },
];

export default function LadiesFootballPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Ladies Football Fit · Rivervalley Rangers AFC"
        title="Ladies Football"
        description="Get fit, have fun, and learn the basics of football — Tuesday evenings at Rivervalley Park. New players always welcome, no experience needed."
        links={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            <div className="border border-brand-sky/30 bg-white/10 p-4">
              <p className="text-brand-neon font-display font-black text-xs uppercase tracking-widest mb-1">Day</p>
              <p className="text-brand-cream text-sm font-semibold">Every Tuesday</p>
            </div>
            <div className="border border-brand-sky/30 bg-white/10 p-4">
              <p className="text-brand-neon font-display font-black text-xs uppercase tracking-widest mb-1">Time</p>
              <p className="text-brand-cream text-sm font-semibold">8:00pm</p>
            </div>
            <div className="border border-brand-sky/30 bg-white/10 p-4">
              <p className="text-brand-neon font-display font-black text-xs uppercase tracking-widest mb-1">Venue</p>
              <p className="text-brand-cream text-sm font-semibold">Small Astro, Rivervalley Park</p>
            </div>
            <div className="border border-brand-sky/30 bg-white/10 p-4">
              <p className="text-brand-neon font-display font-black text-xs uppercase tracking-widest mb-1">Cost</p>
              <p className="text-brand-cream text-sm font-semibold">€5 per session</p>
            </div>
          </div>
        }
      />

      <div className="mx-auto max-w-3xl px-4 py-10 space-y-10">

        {/* About */}
        <section className="bg-white rounded-2xl border-2 border-brand-navy p-6 sm:p-8">
          <h2 className="font-display font-black italic text-2xl uppercase text-brand-navy mb-4">
            About Ladies Football Fit
          </h2>
          <div className="space-y-3 text-sm font-semibold text-zinc-700 leading-relaxed">
            <p>
              Rivervalley Rangers Ladies Football Fit is a fun, friendly, and welcoming Tuesday evening session designed for women of all ages and abilities. Whether you&apos;ve never kicked a ball in your life or you played years ago and want to get back into it — this session is for you.
            </p>
            <p>
              Sessions are held on the Small Astro pitch at Rivervalley Park in Swords, starting at 8pm every Tuesday evening. At just €5 per session, it&apos;s one of the most affordable ways to get active in the local area.
            </p>
            <p>
              Places are limited — please pre-book your spot by contacting Emma directly before coming along for the first time.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section>
          <h2 className="font-display font-black italic text-2xl uppercase text-brand-navy border-l-4 border-brand-green pl-3 mb-5">
            Why Join?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="bg-white rounded-2xl border-2 border-brand-navy p-5 flex gap-4"
              >
                <span className="text-3xl shrink-0 select-none" aria-hidden="true">{b.icon}</span>
                <div>
                  <h3 className="font-display font-black uppercase text-brand-navy text-sm mb-1">{b.title}</h3>
                  <p className="text-xs font-semibold text-zinc-600 leading-relaxed">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact / book */}
        <section className="bg-brand-navy rounded-2xl p-6 sm:p-8">
          <h2 className="font-display font-black italic text-2xl uppercase text-brand-neon mb-2">
            Pre-book Your Place
          </h2>
          <p className="text-brand-sky/80 text-sm font-semibold mb-6 leading-relaxed">
            Spaces are limited — contact Emma to reserve your spot before turning up for the first time.
          </p>
          <a
            href="tel:0867976766"
            className="inline-flex items-center gap-3 bg-brand-neon text-brand-charcoal font-display font-black uppercase text-sm px-6 py-4 border-3 border-brand-charcoal shadow-[4px_4px_0_rgba(18,18,18,0.4)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
            Call Emma — 086 797 6766
          </a>
          <p className="mt-4 text-brand-sky/50 text-xs font-semibold">
            Or drop us a message via the contact page and we&apos;ll pass it on.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-2 text-brand-sky text-xs font-bold underline underline-offset-4 hover:text-brand-neon transition-colors"
          >
            Send a message →
          </Link>
        </section>

        {/* Other programmes */}
        <section className="border-t-2 border-brand-navy/10 pt-8">
          <h2 className="font-display font-black italic text-xl uppercase text-brand-navy mb-4">
            Other Programmes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/walking-football"
              className="group flex flex-col gap-2 border-2 border-brand-navy/20 bg-white p-5 hover:border-brand-navy hover:bg-brand-neon transition-all"
            >
              <p className="font-display font-black uppercase text-brand-navy text-sm">Walking Football</p>
              <p className="text-xs font-semibold text-zinc-500 group-hover:text-brand-charcoal">Monday nights · All adults welcome</p>
            </Link>
            <Link
              href="/football-for-all"
              className="group flex flex-col gap-2 border-2 border-brand-navy/20 bg-white p-5 hover:border-brand-navy hover:bg-brand-neon transition-all"
            >
              <p className="font-display font-black uppercase text-brand-navy text-sm">Football For All</p>
              <p className="text-xs font-semibold text-zinc-500 group-hover:text-brand-charcoal">Saturday sessions · Every ability</p>
            </Link>
          </div>
        </section>

      </div>
    </PublicPageShell>
  );
}

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Link from 'next/link';
import Image from 'next/image';
import TeletextFixtures from '@/components/TeletextFixtures';
import NewsCarousel from '@/components/NewsCarousel';
import InstagramFeed from '@/components/InstagramFeed';
import PlayerPathway from '@/components/PlayerPathway';
import { CLUB_SEASON } from '@/config/club-season';
import { APP_VERSION, APP_VERSION_DATE } from '@/config/version';
import { prisma } from '@/lib/prisma';
import { getFeatureAvailability } from '@/lib/features';
import { GraduationCap, Trophy, Users, Heart, User, type LucideIcon } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const COMMUNITY_CATEGORIES: Array<{
  Icon: LucideIcon;
  label: string;
  copy: string;
  href: string;
  pink?: boolean;
}> = [
  {
    Icon: GraduationCap,
    label: 'Academy',
    copy: 'Little Rangers (ages 4–6) — the first step before DDSL age-group football.',
    href: '/academy',
  },
  {
    Icon: Users,
    label: 'Boys',
    copy: 'DDSL Boys teams from U7 through U17, development and competitive.',
    href: '/teams?filter=boys',
  },
  {
    Icon: User,
    label: 'Girls',
    copy: 'DDSL Girls teams across multiple age groups and divisions.',
    href: '/teams?filter=girls',
    pink: true,
  },
  {
    Icon: Trophy,
    label: 'Adult',
    copy: 'Seniors and Over 35s competing in North Dublin leagues.',
    href: '/seniors',
  },
  {
    Icon: Users,
    label: 'Community',
    copy: "Walking Football and Mams' Football, open to all.",
    href: '/walking-football',
  },
  {
    Icon: Heart,
    label: 'Inclusive',
    copy: 'A welcoming programme for players of every ability.',
    href: '/football-for-all',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function Home() {
  const features  = await getFeatureAvailability();

  const now = new Date();

  const announcements = await prisma.announcement.findMany({
    where: {
      isPublished: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    orderBy: [{ pinned: 'desc' }, { publishedAt: 'desc' }],
    take: 6,
  });

  return (
    <div
      className="flex flex-col min-h-screen bg-brand-cream text-brand-charcoal"
      style={{
        backgroundImage: `linear-gradient(rgba(11,31,59,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(11,31,59,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    >
      <Header />

      <main id="main-content" className="flex-grow">

        {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
        <Hero />

        {/* ── 2. Announcements strip ───────────────────────────────────────── */}
        {announcements.length > 0 && (
          <section className="py-14 bg-brand-cream border-b border-brand-navy/10">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex items-end justify-between mb-8 gap-4">
                <div>
                  <p className="font-display font-black text-[10px] uppercase tracking-widest text-brand-green mb-1">
                    Fresh off the pitch
                  </p>
                  <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-charcoal leading-none">
                    Latest News
                  </h2>
                </div>
                <Link
                  href="/news"
                  className="min-h-[44px] inline-flex items-center px-2 -mr-2 text-xs font-display font-black uppercase tracking-wide text-brand-charcoal/40 hover:text-brand-navy transition-colors shrink-0"
                >
                  See all →
                </Link>
              </div>
              <NewsCarousel announcements={announcements} />
            </div>
          </section>
        )}

        {/* ── 3. Upcoming Fixtures ─────────────────────────────────────────── */}
        <section className="py-14 bg-brand-navy border-b border-brand-sky/10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-8">
              <p className="font-display font-black text-[10px] uppercase tracking-widest text-brand-neon/70 mb-1">
                Up next · This week
              </p>
              <h2 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight italic text-brand-cream flex items-center gap-3 leading-none">
                Matchday
                <Trophy className="w-8 h-8 text-brand-neon shrink-0" aria-hidden="true" />
              </h2>
            </div>
            <TeletextFixtures />
          </div>
        </section>

        {/* ── 2.7. Instagram Feed ──────────────────────────────────────────── */}
        {features.instagramFeed && <InstagramFeed />}



        {/* ── 4. More Than A Football Club ─────────────────────────────────── */}
        <section className="py-20 bg-brand-cream border-t border-brand-navy/10">
          <div className="max-w-6xl mx-auto px-4 md:px-6">

            {/* Section header */}
            <div className="mb-10">
              <p className="font-display font-black text-[10px] uppercase tracking-widest text-brand-green mb-2">
                For everyone in Swords
              </p>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display font-black italic text-4xl md:text-6xl uppercase tracking-tight leading-none text-brand-charcoal">
                  More Than A<br className="md:hidden" /> Football Club
                </h2>
              </div>
              <p className="mt-3 text-brand-charcoal/55 text-base md:text-lg max-w-xl leading-relaxed">
                From a toddler&apos;s first touch to senior league football — we have a team for every player in Swords.
              </p>
            </div>

            {/* Cards — horizontal on mobile, grid on desktop */}
            <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-5">
              {COMMUNITY_CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className={`group flex md:flex-col items-center md:items-start gap-4 md:gap-3 rounded-2xl border-2 px-5 py-4 md:p-6 transition-all duration-200 ${
                    cat.pink
                      ? 'border-pink-300/50 bg-pink-50 hover:border-pink-400 hover:bg-pink-100/80'
                      : 'border-brand-navy/12 bg-white hover:border-brand-navy/35 hover:bg-brand-navy/3'
                  }`}
                >
                  <div className={`shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-xl border-2 transition-colors ${
                    cat.pink
                      ? 'bg-pink-100 border-pink-200/70 group-hover:bg-pink-200 group-hover:border-pink-300'
                      : 'bg-brand-navy/5 border-brand-navy/12 group-hover:bg-brand-neon/10 group-hover:border-brand-neon/35'
                  }`}>
                    <cat.Icon className={`w-7 h-7 transition-colors ${
                      cat.pink ? 'text-pink-500 group-hover:text-pink-600' : 'text-brand-navy group-hover:text-brand-neon'
                    }`} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-black text-base uppercase tracking-wide text-brand-charcoal group-hover:text-brand-navy transition-colors leading-tight">
                      {cat.label}
                    </p>
                    <p className="text-brand-charcoal/50 text-xs md:text-sm leading-relaxed mt-0.5 md:mt-1">
                      {cat.copy}
                    </p>
                  </div>
                  <span className={`shrink-0 md:hidden text-xs font-display font-black uppercase tracking-wide transition-colors ${
                    cat.pink ? 'text-pink-400/70 group-hover:text-pink-500' : 'text-brand-navy/35 group-hover:text-brand-navy'
                  }`} aria-hidden="true">→</span>
                  <span className={`hidden md:inline-block mt-1 text-[11px] font-display font-black uppercase tracking-wide transition-colors ${
                    cat.pink ? 'text-pink-400/70 group-hover:text-pink-500' : 'text-brand-navy/40 group-hover:text-brand-navy'
                  }`}>
                    Find Out More →
                  </span>
                </Link>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 flex justify-center">
              <Link
                href="/teams"
                className="inline-flex items-center gap-2 min-h-[52px] px-8 bg-brand-navy text-brand-neon font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                View All Teams →
              </Link>
            </div>

            {/* Player pathway */}
            <div className="mt-10 pt-8 border-t border-brand-navy/10">
              <PlayerPathway />
            </div>

          </div>
        </section>


      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-brand-navy text-white border-t border-brand-sky/20">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Club info */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-display font-black text-base italic uppercase tracking-tight text-brand-neon mb-3">
              Rivervalley Rangers AFC
            </h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Swords&apos; leading community football club, established in{' '}
              {CLUB_SEASON.foundingYear}. Dedicated to equality, youth development,
              and inclusive sport.
            </p>
          </div>

          {/* Play */}
          <div>
            <h4 className="font-display font-bold text-[10px] uppercase tracking-widest text-brand-sky/60 mb-3">
              Play
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'All Teams',    href: '/teams' },
                { label: 'Fixtures',     href: '/fixtures' },
                { label: 'Senior Hub',   href: '/seniors' },
                { label: 'Register',     href: '/register' },
                { label: 'Book Astro',   href: '/astro-booking' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-zinc-400 hover:text-brand-neon transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Club */}
          <div>
            <h4 className="font-display font-bold text-[10px] uppercase tracking-widest text-brand-sky/60 mb-3">
              Club
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'About',            href: '/club' },
                { label: 'Contact',          href: '/contact' },
                { label: 'Pitch Locations',  href: '/pitch-locations' },
                { label: 'Safeguarding',     href: '/club/safeguarding' },
                { label: 'Football For All', href: '/football-for-all' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-zinc-400 hover:text-brand-neon transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-bold text-[10px] uppercase tracking-widest text-brand-sky/60 mb-3">
              Legal &amp; Safety
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>100% Garda Vetted Coaches</li>
              <li>FAI Club Mark Accredited</li>
              <li>
                <Link href="/privacy" className="hover:text-brand-neon transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/club/safeguarding" className="hover:text-brand-neon transition-colors">
                  Child Safeguarding
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-6 py-6 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Rivervalley Rangers AFC. All rights reserved.</p>
          <a
            href="https://www.instagram.com/rvrfc1981"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-neon transition-colors"
            aria-label="Follow Rivervalley Rangers on Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            @rvrfc1981
          </a>
          <div className="flex items-center gap-4">
            <p className="text-brand-sky/40">
              RVR2026 v{APP_VERSION} · {APP_VERSION_DATE}
              {' · '}
              <a href="/admin/login" className="hover:text-brand-sky/70 transition-colors">Admin</a>
            </p>
            <span className="h-3 w-px bg-zinc-700" aria-hidden="true" />
            <a
              href="https://www.1zero9.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-brand-neon hover:text-white transition-colors"
              aria-label="Built by 1Zero9Studio"
            >
              <Image
                src="/marketing/109-logo-circle-white2.png"
                alt="1Zero9Studio"
                width={16}
                height={16}
                className="h-7 w-7 opacity-90 transition-opacity"
              />
              <span className="font-bold">Built by 1Zero9Studio</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

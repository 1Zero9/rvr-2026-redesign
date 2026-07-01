import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Link from 'next/link';
import TeletextFixtures from '@/components/TeletextFixtures';
import NewsCarousel from '@/components/NewsCarousel';
import AnnouncementTrigger from '@/components/announcements/AnnouncementTrigger';
import InstagramFeed from '@/components/InstagramFeed';
import { CLUB_SEASON } from '@/config/club-season';
import { APP_VERSION, APP_VERSION_DATE } from '@/config/version';
import { prisma } from '@/lib/prisma';
import { getFeatureAvailability } from '@/lib/features';
import { GraduationCap, Trophy, Users, Heart, type LucideIcon } from 'lucide-react';

const COMMUNITY_CATEGORIES: Array<{
  Icon: LucideIcon;
  label: string;
  copy: string;
  href: string;
}> = [
  {
    Icon: GraduationCap,
    label: 'Academy',
    copy: 'Little Rangers to U-age groups — where players develop from day one.',
    href: '/teams',
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

  const pinnedAnnouncement = await prisma.announcement.findFirst({
    where: {
      isPublished: true,
      pinned:      true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    select: {
      id:       true,
      title:    true,
      category: true,
      ctaLabel: true,
      ctaUrl:   true,
    },
    orderBy: { publishedAt: 'desc' },
  });

  const announcements = await prisma.announcement.findMany({
    where: {
      isPublished: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    orderBy: [{ pinned: 'desc' }, { publishedAt: 'desc' }],
    take: 6,
  });

  const [startStr] = CLUB_SEASON.currentSeason.split('/');
  const nextStartYear = +startStr + 1;
  const nextSeason = `${nextStartYear}/${String(nextStartYear + 1).slice(-2)}`;

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

      <main className="flex-grow">

        {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
        <Hero />

        {/* ── 2. Announcements strip ───────────────────────────────────────── */}
        {announcements.length > 0 && (
          <section className="py-14 bg-brand-cream border-b border-brand-navy/10">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-charcoal">
                  Latest News
                </h2>
                <Link
                  href="/news"
                  className="min-h-[44px] inline-flex items-center px-2 -mr-2 text-xs font-display font-black uppercase tracking-wide text-brand-charcoal/40 hover:text-brand-navy transition-colors"
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
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight italic text-brand-cream flex items-center gap-3">
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
        <section
          className="py-20 bg-brand-navy border-t border-brand-sky/20"
          style={{
            backgroundImage: `linear-gradient(rgba(184,205,238,0.04) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(184,205,238,0.04) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        >
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex items-start justify-between mb-10">
              <div>
                <h2 className="font-display font-black italic text-4xl md:text-6xl uppercase tracking-tight leading-none text-brand-cream mb-2">
                  More Than A Football Club
                </h2>
                <p className="text-brand-sky/60 text-sm font-bold uppercase tracking-wider">
                  Academy · Adult · Community · Inclusive
                </p>
              </div>
              <Link
                href="/teams"
                className="min-h-[44px] inline-flex items-center px-2 -mr-2 text-xs font-display font-black uppercase tracking-wide text-brand-sky/40 hover:text-brand-neon transition-colors shrink-0 mt-2"
              >
                All teams →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {COMMUNITY_CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="group flex flex-col items-center text-center gap-3 rounded-2xl border-2 border-white/20 px-4 py-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 min-h-[44px]"
                >
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 border border-white/20 group-hover:bg-brand-neon/20 group-hover:border-brand-neon/40 transition-colors">
                    <cat.Icon className="w-6 h-6 text-brand-neon" aria-hidden="true" />
                  </div>
                  <p className="font-display font-black text-sm uppercase tracking-wide text-white group-hover:text-brand-neon transition-colors">
                    {cat.label}
                  </p>
                  <p className="text-white/60 text-xs leading-relaxed flex-1">
                    {cat.copy}
                  </p>
                  <span className="text-[11px] font-display font-black uppercase tracking-wide text-brand-neon/70 group-hover:text-brand-neon group-hover:underline transition-colors">
                    Find Out More →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Registration Banner ───────────────────────────────────────── */}
        <section className="bg-brand-neon border-b-4 border-brand-charcoal">
          <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="font-display font-black text-sm uppercase tracking-widest text-brand-charcoal/60 mb-1">
                Registration Open
              </p>
              <h2 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight italic leading-none text-brand-charcoal">
                {nextSeason} Season
              </h2>
              <p className="text-brand-charcoal/70 font-semibold mt-3 max-w-sm">
                Secure your place in Swords&apos; largest community football club.
                All ages, all abilities welcome.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 shrink-0 w-full md:w-auto">
              <Link
                href="/register"
                className="bg-brand-charcoal text-white border-3 border-brand-charcoal font-display font-black uppercase tracking-wide text-sm px-8 py-4 shadow-brutalist hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-center"
              >
                Register Now
              </Link>
              <Link
                href="/membership-calculator"
                className="bg-white text-brand-charcoal border-3 border-brand-charcoal font-display font-black uppercase tracking-wide text-sm px-8 py-4 shadow-brutalist hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-center"
              >
                Check Fees
              </Link>
              <AnnouncementTrigger pinnedAnnouncement={pinnedAnnouncement} />
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
          <p className="text-brand-sky/40">
            RVR2026 v{APP_VERSION} · {APP_VERSION_DATE}
            {' · '}
            <a href="/admin/login" className="hover:text-brand-sky/70 transition-colors">Admin</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

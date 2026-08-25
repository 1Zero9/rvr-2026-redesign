import Header from '@/components/Header';
import Hero, { type HeroMediaItem } from '@/components/Hero';
import Link from 'next/link';
import TeletextFixtures from '@/components/TeletextFixtures';
import ClubSpotlight, { type SpotlightItem } from '@/components/ClubSpotlight';
import InstagramFeed from '@/components/InstagramFeed';
import PlayerPathway from '@/components/PlayerPathway';
import Footer from '@/components/layout/Footer';
import CampaignBanner from '@/components/CampaignBanner';
import HighlightBadge from '@/components/HighlightBadge';
import { prisma } from '@/lib/prisma';
import { getActiveCampaigns, getHighlightedCampaign } from '@/lib/campaigns';
import { getSpotlightIntervalSeconds, getHeroRotationSettings } from '@/lib/site-settings';
import { getFeatureAvailability } from '@/lib/features';
import { GraduationCap, Trophy, Users, Heart, User, Calculator, type LucideIcon } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// Announcements and campaigns publish/expire on date windows — re-render
// periodically, not only at deploy time
export const revalidate = 300;

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
    copy: 'Development Academy (born 2020–2022, ages 4–6) — Saturday sessions at Rivervalley Park.',
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
    copy: 'Walking Football and Ladies Football — open to all adults in Swords.',
    href: '/community',
  },
  {
    Icon: Heart,
    label: 'Inclusive',
    copy: 'A welcoming programme for players of every ability.',
    href: '/football-for-all',
  },
];

const SPOTLIGHT_LABELS: Record<string, { label: string; chip: string }> = {
  BREAKING:        { label: 'Breaking News',   chip: 'bg-brand-maroon text-white' },
  CONGRATULATIONS: { label: 'Congratulations', chip: 'bg-brand-neon text-brand-charcoal' },
  COMMUNITY_NEWS:  { label: 'Community News',  chip: 'bg-brand-sky text-brand-charcoal' },
  IN_SYMPATHY:     { label: 'In Sympathy',     chip: 'bg-white text-brand-navy' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function Home() {
  const features  = await getFeatureAvailability();

  const now = new Date();

  const [announcements, homepageCampaigns, heroCampaigns, clubMoment, heroMedia, highlightedCampaign] = await Promise.all([
    prisma.announcement.findMany({
      where: {
        isPublished: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: [{ pinned: 'desc' }, { publishedAt: 'desc' }],
      take: 5,
    }),
    getActiveCampaigns('homepage'),
    getActiveCampaigns('hero'),
    prisma.clubMoment.findUnique({ where: { id: 'current' } }),
    prisma.heroMedia.findMany({
      where: { isEnabled: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    }),
    getHighlightedCampaign(),
  ]);
  const spotlightIntervalSeconds = await getSpotlightIntervalSeconds();
  const heroRotation = await getHeroRotationSettings();

  const heroItems: HeroMediaItem[] = heroMedia.map((m) => ({
    id:             m.id,
    type:           m.type,
    url:            m.url,
    mobileImageUrl: m.mobileImageUrl,
    posterUrl:      m.posterUrl,
    focalX:         m.focalX,
    focalY:         m.focalY,
    motionEffect:   m.motionEffect,
  }));

  // Campaign-linked hero features — image only, no video support on campaigns.
  const heroFeatures: HeroMediaItem[] = heroCampaigns
    .filter((c) => c.heroImageUrl)
    .map((c) => ({
      id:             `campaign-${c.id}`,
      type:           'IMAGE',
      url:            c.heroImageUrl as string,
      mobileImageUrl: c.mobileImageUrl,
      posterUrl:      null,
      focalX:         c.focalX,
      focalY:         c.focalY,
      motionEffect:   'NONE',
    }));

  const spotlightItems: SpotlightItem[] = [
    ...homepageCampaigns.map((c) => ({
      id:             c.id,
      kind:           'campaign' as const,
      label:          'Campaign',
      labelClass:     'bg-brand-neon text-brand-charcoal',
      title:          c.title,
      subtitle:       c.subtitle,
      imageUrl:       c.heroImageUrl,
      mobileImageUrl: c.mobileImageUrl,
      objectPosition: `${c.focalX}% ${c.focalY}%`,
      href:           c.ctaUrl,
      ctaLabel:       c.ctaLabel,
    })),
    ...announcements.map((a) => ({
      id:             a.id,
      kind:           'news' as const,
      label:          SPOTLIGHT_LABELS[a.category]?.label ?? 'Community News',
      labelClass:     SPOTLIGHT_LABELS[a.category]?.chip ?? 'bg-brand-sky text-brand-charcoal',
      title:          a.title,
      subtitle:       a.body.split('\n')[0] || null,
      imageUrl:       a.imageUrl,
      mobileImageUrl: null,
      objectPosition: `${a.focalX}% ${a.focalY}%`,
      href:           a.ctaUrl ?? `/news/${a.id}`,
      ctaLabel:       a.ctaLabel ?? 'Read More',
    })),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-charcoal">
      <Header />
      <CampaignBanner />

      <main id="main-content" className="flex-grow">

        {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
        <Hero
          items={heroItems}
          features={heroFeatures}
          featureRatio={heroRotation.featureRatio}
          rotationMode={heroRotation.mode}
          rotationIntervalSeconds={heroRotation.intervalSeconds}
        />

        {/* ── 2. Club Spotlight — campaigns + news in one rotating slot ────── */}
        {spotlightItems.length > 0 && (
          <section id="club-spotlight" className="py-14 bg-brand-cream border-b border-brand-navy/10">
            <div className="max-w-6xl mx-auto px-6 mb-6">
              <p className="font-display font-black text-[10px] uppercase tracking-widest text-brand-green mb-1">
                Happening now
              </p>
              <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-charcoal leading-none">
                Club Spotlight
              </h2>
            </div>
            <ClubSpotlight items={spotlightItems} intervalMs={spotlightIntervalSeconds * 1000} />
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
            <TeletextFixtures limit={6} />
          </div>
        </section>

        {/* ── 2.7. Instagram Feed ──────────────────────────────────────────── */}
        {features.instagramFeed && <InstagramFeed />}

        {/* ── 3.3. Club moment ─────────────────────────────────────────────── */}
        {clubMoment?.imageUrl && (
          <section className="relative aspect-[6/5] md:aspect-auto md:h-[clamp(340px,30vw,460px)] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={clubMoment.mobileImageUrl || clubMoment.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover md:hidden"
              style={{ objectPosition: `${clubMoment.focalX}% ${clubMoment.focalY}%` }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={clubMoment.imageUrl}
              alt=""
              className="absolute inset-0 hidden h-full w-full object-cover md:block"
              style={{ objectPosition: `${clubMoment.focalX}% ${clubMoment.focalY}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 md:pb-12">
                <p className="font-display font-black text-[10px] md:text-xs uppercase tracking-widest text-brand-neon mb-2">
                  {clubMoment.label}
                </p>
                <h2 className="font-display font-black italic text-3xl md:text-5xl uppercase tracking-tight text-brand-cream leading-none max-w-2xl">
                  {clubMoment.title}
                </h2>
                <Link
                  href={clubMoment.ctaUrl}
                  className="mt-5 inline-flex items-center gap-2 min-h-[48px] px-6 bg-brand-neon text-brand-charcoal font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist-charcoal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  {clubMoment.ctaLabel} →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── 3.5. 45th Anniversary strip ──────────────────────────────────── */}
        <section className="bg-brand-neon border-y border-brand-charcoal/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-display font-black text-4xl md:text-5xl italic text-brand-charcoal leading-none">1981</span>
              <div className="h-8 w-px bg-brand-charcoal/20 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-display font-black text-xs uppercase tracking-widest text-brand-charcoal/60">Rivervalley Rangers AFC</p>
                <p className="font-display font-black italic text-lg uppercase text-brand-charcoal leading-tight">45 Years of Swords Football</p>
              </div>
            </div>
            <Link
              href="/club/anniversary"
              className="shrink-0 inline-flex items-center gap-2 border-3 border-brand-charcoal bg-brand-charcoal px-5 py-2.5 text-xs font-display font-black uppercase tracking-wide text-brand-neon hover:bg-brand-charcoal/80 transition-colors"
            >
              Our Story →
            </Link>
          </div>
        </section>

        {/* ── 3.7. Membership cost callout ─────────────────────────────────── */}
        <section className="bg-white border-b border-brand-navy/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display font-black text-[10px] uppercase tracking-widest text-brand-green mb-1">Transparent pricing</p>
              <p className="font-display font-black italic text-2xl md:text-3xl uppercase text-brand-charcoal leading-tight">
                From <span className="text-brand-green">€115</span> per half-season
              </p>
              <p className="text-brand-muted text-sm mt-1">2026/27 registration: Schoolboys €240 · Schoolgirls €220 — or 4 monthly payments · Sibling discounts applied automatically</p>
            </div>
            <Link
              href="/membership-calculator"
              className="shrink-0 inline-flex items-center gap-2 min-h-[48px] border-3 border-brand-charcoal bg-brand-navy px-6 py-3 text-sm font-display font-black uppercase text-brand-neon shadow-brutalist-charcoal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <Calculator className="h-4 w-4 shrink-0" aria-hidden="true" />
              Calculate Your Cost
            </Link>
          </div>
        </section>

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
              <p className="mt-3 text-brand-muted text-base md:text-lg max-w-xl leading-relaxed">
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
                    <p className="text-brand-muted text-xs md:text-sm leading-relaxed mt-0.5 md:mt-1">
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

      <Footer />

      {highlightedCampaign && (
        <HighlightBadge
          campaign={{
            id:       highlightedCampaign.id,
            title:    highlightedCampaign.title,
            ctaLabel: highlightedCampaign.ctaLabel,
            ctaUrl:   highlightedCampaign.ctaUrl,
          }}
        />
      )}
    </div>
  );
}

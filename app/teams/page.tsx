import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import { KNOWN_DIVISIONS } from '@/config/ddsl-competitions';
import { CLUB_TEAMS } from '@/config/club-teams';
import { CLUB_SEASON } from '@/config/club-season';

export const metadata: Metadata = {
  title: 'Teams | Rivervalley Rangers AFC',
  description:
    'All squads at Rivervalley Rangers AFC — youth DDSL league teams, academy, adult, community, and inclusive football.',
};

// ─────────────────────────────────────────────────────────────────────────────
// Age group summaries derived from KNOWN_DIVISIONS
// ─────────────────────────────────────────────────────────────────────────────

const DEVELOPMENT_AGES = new Set(['U8', 'U9', 'U10', 'U11']);

interface AgeGroupSummary {
  ageGroup: string;
  hasBoys: boolean;
  hasGirls: boolean;
  hasSaturday: boolean;
  hasSunday: boolean;
  divisionCount: number;
  isDevelopment: boolean;
}

function buildAgeGroupSummaries(): AgeGroupSummary[] {
  const seen = new Set<string>();
  const order: string[] = [];
  for (const d of KNOWN_DIVISIONS) {
    if (!seen.has(d.ageGroup)) {
      seen.add(d.ageGroup);
      order.push(d.ageGroup);
    }
  }
  return order.map((ag) => ({
    ageGroup: ag,
    hasBoys: KNOWN_DIVISIONS.some(
      (d) => d.ageGroup === ag && d.competitionName.includes('Boys'),
    ),
    hasGirls: KNOWN_DIVISIONS.some(
      (d) => d.ageGroup === ag && d.competitionName.includes('Girls'),
    ),
    hasSaturday: KNOWN_DIVISIONS.some(
      (d) => d.ageGroup === ag && d.officialName.includes('Sat'),
    ),
    hasSunday: KNOWN_DIVISIONS.some(
      (d) => d.ageGroup === ag && d.officialName.includes('Sun'),
    ),
    divisionCount: KNOWN_DIVISIONS.filter((d) => d.ageGroup === ag).length,
    isDevelopment: DEVELOPMENT_AGES.has(ag),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function TeamsPage() {
  const ageGroups = buildAgeGroupSummaries();

  const academyTeams  = CLUB_TEAMS.filter((t) => t.category === 'academy');
  const adultTeams    = CLUB_TEAMS.filter((t) => t.category === 'adult');
  const communityTeams = CLUB_TEAMS.filter((t) => t.category === 'community');
  const inclusiveTeams = CLUB_TEAMS.filter((t) => t.category === 'inclusive');

  return (
    <div className="flex flex-col min-h-screen bg-brand-navy text-brand-cream">
      <Header />

      <main className="flex-grow">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="px-4 md:px-8 pt-14 pb-12 border-b border-brand-sky/20">
          <div className="max-w-5xl mx-auto">
            <span className="inline-block text-brand-neon text-xs font-display font-black uppercase tracking-widest mb-4">
              Squad Directory · {CLUB_SEASON.currentSeason}
            </span>
            <h1 className="font-display font-black italic text-5xl md:text-7xl uppercase tracking-tight leading-none text-brand-cream mb-4">
              All Teams
            </h1>
            <p className="text-brand-sky text-base md:text-lg font-semibold max-w-2xl mb-8">
              Every squad at Rivervalley Rangers AFC — youth DDSL league teams,
              pre-DDSL academy, adult, community, and inclusive football.
            </p>
            <Link
              href="/teams/matches"
              className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 bg-brand-neon text-brand-charcoal font-display font-black uppercase text-sm rounded-2xl border-3 border-brand-charcoal shadow-brutalist hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              Live Fixtures &amp; Tables
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ── Youth DDSL Teams ─────────────────────────────────────────────── */}
        <section className="px-4 md:px-8 py-14 border-b border-brand-sky/10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <p className="text-brand-neon text-xs font-display font-black uppercase tracking-widest mb-2">
                Youth · DDSL {CLUB_SEASON.currentSeason}
              </p>
              <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-cream">
                League Teams
              </h2>
              <p className="text-brand-sky text-sm mt-2 max-w-xl">
                {KNOWN_DIVISIONS.length} registered DDSL divisions across{' '}
                {ageGroups.length} age groups. U8–U11 are development brackets
                (no published standings). U12+ compete in the full DDSL league.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ageGroups.map((ag) => (
                <Link
                  key={ag.ageGroup}
                  href="/teams/matches"
                  className="group block bg-brand-charcoal border-2 border-brand-sky/30 hover:border-brand-neon rounded-2xl p-5 transition-colors min-h-[44px]"
                >
                  {/* Tier badge */}
                  <span
                    className={`inline-block text-[10px] font-display font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 ${
                      ag.isDevelopment
                        ? 'bg-brand-sky/20 text-brand-sky'
                        : 'bg-brand-neon/20 text-brand-neon'
                    }`}
                  >
                    {ag.isDevelopment ? 'Development' : 'Competitive'}
                  </span>

                  {/* Age group */}
                  <p className="font-display font-black italic text-5xl tracking-tighter leading-none text-brand-cream group-hover:text-brand-neon transition-colors mb-3">
                    {ag.ageGroup}
                  </p>

                  {/* Gender badges */}
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {ag.hasBoys && (
                      <span className="text-[10px] font-display font-black uppercase tracking-wider bg-brand-sky/20 text-brand-sky px-2 py-0.5 rounded-full">
                        Boys
                      </span>
                    )}
                    {ag.hasGirls && (
                      <span className="text-[10px] font-display font-black uppercase tracking-wider bg-brand-maroon/40 text-brand-cream px-2 py-0.5 rounded-full">
                        Girls
                      </span>
                    )}
                  </div>

                  {/* Day badges */}
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {ag.hasSaturday && (
                      <span className="text-[10px] font-display font-black uppercase tracking-wider border border-brand-sky/30 text-brand-sky/70 px-2 py-0.5 rounded-full">
                        Sat
                      </span>
                    )}
                    {ag.hasSunday && (
                      <span className="text-[10px] font-display font-black uppercase tracking-wider border border-brand-sky/30 text-brand-sky/70 px-2 py-0.5 rounded-full">
                        Sun
                      </span>
                    )}
                  </div>

                  <p className="text-brand-sky/50 text-xs">
                    {ag.divisionCount} division{ag.divisionCount !== 1 ? 's' : ''}
                  </p>

                  <p className="text-brand-neon text-xs font-display font-black uppercase tracking-wide mt-3 group-hover:underline">
                    Fixtures &amp; Tables →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Academy ──────────────────────────────────────────────────────── */}
        <section className="px-4 md:px-8 py-14 border-b border-brand-sky/10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <p className="text-brand-neon text-xs font-display font-black uppercase tracking-widest mb-2">
                Academy · Ages 4–7
              </p>
              <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-cream">
                Getting Started
              </h2>
              <p className="text-brand-sky text-sm mt-2 max-w-xl">
                Pre-DDSL programmes for our youngest players. Fun, safe, and
                fully coached before entering the league pathway.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {academyTeams.map((team) => (
                <Link
                  key={team.slug}
                  href={`/club-teams/${team.slug}`}
                  className="group block bg-brand-charcoal border-2 border-brand-neon hover:border-brand-maroon rounded-2xl p-6 transition-colors min-h-[44px]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl" aria-hidden="true">{team.badge}</span>
                    <span className="font-display font-black text-xl text-brand-cream group-hover:text-brand-neon transition-colors">
                      {team.name}
                    </span>
                  </div>
                  <p className="text-brand-sky text-sm">{team.tagline}</p>
                  {team.isRecruiting && (
                    <span className="inline-block mt-4 bg-brand-neon text-brand-charcoal text-xs font-bold px-3 py-1 rounded-full">
                      Recruiting
                    </span>
                  )}
                  <p className="text-brand-neon text-xs font-display font-black uppercase tracking-wide mt-4 group-hover:underline">
                    Find Out More →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Adult & Community ────────────────────────────────────────────── */}
        <section className="px-4 md:px-8 py-14 border-b border-brand-sky/10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <p className="text-brand-neon text-xs font-display font-black uppercase tracking-widest mb-2">
                Adult &amp; Community
              </p>
              <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-cream">
                For Everyone
              </h2>
              <p className="text-brand-sky text-sm mt-2 max-w-xl">
                Competitive adult football, social sessions, and community
                programmes open to all ages and abilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...adultTeams, ...communityTeams].map((team) => (
                <Link
                  key={team.slug}
                  href={`/club-teams/${team.slug}`}
                  className="group block bg-brand-charcoal border-2 border-brand-neon hover:border-brand-maroon rounded-2xl p-6 transition-colors min-h-[44px]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl" aria-hidden="true">{team.badge}</span>
                    <span className="font-display font-black text-xl text-brand-cream group-hover:text-brand-neon transition-colors">
                      {team.name}
                    </span>
                  </div>
                  <p className="text-brand-sky text-sm">{team.tagline}</p>
                  {team.isRecruiting && (
                    <span className="inline-block mt-4 bg-brand-neon text-brand-charcoal text-xs font-bold px-3 py-1 rounded-full">
                      Recruiting
                    </span>
                  )}
                  <p className="text-brand-neon text-xs font-display font-black uppercase tracking-wide mt-4 group-hover:underline">
                    Find Out More →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Inclusive Football ───────────────────────────────────────────── */}
        <section className="px-4 md:px-8 py-14 border-b border-brand-sky/10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <p className="text-brand-neon text-xs font-display font-black uppercase tracking-widest mb-2">
                Inclusive
              </p>
              <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-cream">
                Football For All
              </h2>
              <p className="text-brand-sky text-sm mt-2 max-w-xl">
                Everyone is welcome, everyone belongs. Our inclusive programme
                is built around the player, not the competition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inclusiveTeams.map((team) => (
                <Link
                  key={team.slug}
                  href={`/club-teams/${team.slug}`}
                  className="group block bg-brand-charcoal border-2 border-brand-neon hover:border-brand-maroon rounded-2xl p-6 transition-colors min-h-[44px]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl" aria-hidden="true">{team.badge}</span>
                    <span className="font-display font-black text-xl text-brand-cream group-hover:text-brand-neon transition-colors">
                      {team.name}
                    </span>
                  </div>
                  <p className="text-brand-sky text-sm">{team.tagline}</p>
                  {team.isRecruiting && (
                    <span className="inline-block mt-4 bg-brand-neon text-brand-charcoal text-xs font-bold px-3 py-1 rounded-full">
                      Recruiting
                    </span>
                  )}
                  <p className="text-brand-neon text-xs font-display font-black uppercase tracking-wide mt-4 group-hover:underline">
                    Find Out More →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
        <section className="bg-brand-charcoal border-t border-brand-sky/10 px-4 md:px-8 py-12">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-brand-neon text-xs font-display font-black uppercase tracking-widest mb-1">
                DDSL Live Data
              </p>
              <p className="font-display font-black italic text-2xl md:text-3xl text-brand-cream uppercase">
                Fixtures, Results &amp; Tables
              </p>
              <p className="text-brand-sky text-sm mt-1">
                Live standings and match results for all {KNOWN_DIVISIONS.length} RVR DDSL divisions.
              </p>
            </div>
            <Link
              href="/teams/matches"
              className="shrink-0 inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-3 bg-brand-neon text-brand-charcoal font-display font-black uppercase text-sm rounded-2xl border-3 border-brand-charcoal shadow-brutalist hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              Open Matchday Hub
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

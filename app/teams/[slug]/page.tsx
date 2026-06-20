import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import { KNOWN_DIVISIONS } from '@/config/ddsl-competitions';
import { prisma } from '@/lib/prisma';
import {
  scrapeClubAjax,
  discoverCompetitionId,
  RVR_CLUB_ID,
  FALLBACK_AJAX_COMPETITION_ID,
} from '@/lib/ddsl/scraper';
import { transformAll } from '@/lib/ddsl/transform';
import type { NormalisedMatch } from '@/lib/ddsl/types';
import { CLUB_SEASON } from '@/config/club-season';

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return KNOWN_DIVISIONS.map((d) => ({ slug: d.slug }));
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const division = KNOWN_DIVISIONS.find((d) => d.slug === slug);
  return {
    title: division
      ? `${division.competitionName} | Rivervalley Rangers AFC`
      : 'Team | Rivervalley Rangers AFC',
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COMPETITIVE_AGES = new Set(['U12', 'U13', 'U14', 'U15', 'U17']);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripDdsl(name: string): string {
  return name.replace(/^DDSL\s+/i, '');
}

function isRVR(teamName: string): boolean {
  return /rivervalley|river valley/i.test(teamName);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const division = KNOWN_DIVISIONS.find((d) => d.slug === slug);
  if (!division) notFound();

  const competitive = COMPETITIVE_AGES.has(division.ageGroup);

  // Standings (competitive only) — two-step: resolve season id, then query
  let standings: {
    position: number;
    teamName: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    points: number;
  }[] = [];

  if (competitive) {
    try {
      const activeSeason = await prisma.season.findFirst({
        where: { isActive: true },
        select: { id: true },
      });
      if (activeSeason) {
        const rows = await prisma.historicalStanding.findMany({
          where: {
            seasonId:    activeSeason.id,
            source:      'DDSL',
            divisionName: division.competitionName,
          },
          orderBy: { position: 'asc' },
        });
        standings = rows.map((r) => ({
          position: r.position,
          teamName: r.teamName,
          played:   r.played,
          won:      r.won,
          drawn:    r.drawn,
          lost:     r.lost,
          points:   r.points,
        }));
      }
    } catch {
      // DB unavailable — show empty standings
    }
  }

  // Fixtures — scrape live from DDSL, filter to this division
  let upcoming: NormalisedMatch[] = [];
  let results: NormalisedMatch[] = [];
  try {
    const competitionId =
      (await discoverCompetitionId(RVR_CLUB_ID)) ?? FALLBACK_AJAX_COMPETITION_ID;

    const [fixturesData, resultsData] = await Promise.all([
      scrapeClubAjax(RVR_CLUB_ID, competitionId, 'fixtures'),
      scrapeClubAjax(RVR_CLUB_ID, competitionId, 'results'),
    ]);

    const allFixtures = transformAll(
      fixturesData.fixtures.filter(
        (f) => f.competition.competitionName === division.competitionName,
      ),
    );
    const allResults = transformAll(
      resultsData.fixtures.filter(
        (f) => f.competition.competitionName === division.competitionName,
      ),
    );

    upcoming = allFixtures
      .filter((m) => m.status === 'upcoming')
      .sort((a, b) => a.date.localeCompare(b.date));

    results = allResults
      .filter((m) => m.status === 'completed')
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  } catch {
    // DDSL unavailable — show empty fixtures
  }

  const displayName = stripDdsl(division.competitionName);

  return (
    <div className="min-h-screen bg-brand-cream">
      <Header />

      <main>
        {/* ── Hero banner ──────────────────────────────────────────────────── */}
        <div className="bg-brand-navy">
          <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
            <Link
              href="/teams"
              className="inline-block text-brand-sky text-sm mb-5 hover:text-brand-neon transition-colors"
            >
              ← All Teams
            </Link>

            <h1 className="font-display font-black italic text-4xl md:text-5xl uppercase tracking-tight leading-none text-brand-neon mb-2">
              {displayName}
            </h1>

            <p className="text-brand-sky text-sm mb-3">
              {division.officialName} · {division.ageGroup} · {CLUB_SEASON.currentSeason}
            </p>

            {competitive ? (
              <span className="inline-block px-3 py-1 text-xs font-display font-black uppercase tracking-wider bg-brand-green text-brand-cream">
                Competitive
              </span>
            ) : (
              <span className="inline-block px-3 py-1 text-xs font-display font-black uppercase tracking-wider bg-brand-sky text-brand-navy">
                Development
              </span>
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">

          {/* ── Standings (competitive) ──────────────────────────────────── */}
          {competitive && (
            <section>
              <div className="border-l-4 border-brand-neon pl-4 py-1 mb-4">
                <h2 className="font-display italic font-black uppercase text-xl text-brand-charcoal">
                  League Table
                </h2>
              </div>

              {standings.length === 0 ? (
                <div className="bg-brand-navy border-2 border-brand-sky p-6">
                  <p className="text-brand-cream text-sm">
                    Standings not yet available for this division.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-brand-navy border-2 border-brand-navy shadow-brutalist overflow-hidden">
                    <table className="w-full table-fixed text-xs">
                      <colgroup>
                        <col style={{ width: '2rem' }} />
                        <col />
                        <col style={{ width: '2rem' }} />
                        <col style={{ width: '2rem' }} />
                        <col style={{ width: '2rem' }} />
                        <col style={{ width: '2rem' }} />
                        <col style={{ width: '2.5rem' }} />
                      </colgroup>
                      <thead>
                        <tr className="bg-brand-green text-brand-cream uppercase text-[10px] tracking-wide">
                          <th className="py-2 text-center font-bold">#</th>
                          <th className="py-2 pl-2 text-left font-bold">Team</th>
                          <th className="py-2 text-center font-bold">P</th>
                          <th className="py-2 text-center font-bold">W</th>
                          <th className="py-2 text-center font-bold">D</th>
                          <th className="py-2 text-center font-bold">L</th>
                          <th className="py-2 text-center font-bold">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standings.map((row, i) => {
                          const rvr = isRVR(row.teamName);
                          return (
                            <tr
                              key={`${row.position}-${row.teamName}`}
                              className={
                                rvr
                                  ? 'bg-brand-green text-brand-cream font-bold border-l-4 border-brand-neon'
                                  : i % 2 === 0
                                  ? 'bg-brand-navy text-brand-cream'
                                  : 'bg-[#0d2444] text-brand-cream'
                              }
                            >
                              <td className="py-2.5 text-center">{row.position}</td>
                              <td className="py-2.5 pl-2 pr-1 whitespace-normal break-words">
                                {row.teamName}
                              </td>
                              <td className="py-2.5 text-center">{row.played}</td>
                              <td className="py-2.5 text-center">{row.won}</td>
                              <td className="py-2.5 text-center">{row.drawn}</td>
                              <td className="py-2.5 text-center">{row.lost}</td>
                              <td className={`py-2.5 text-center font-bold ${rvr ? '' : 'text-brand-neon'}`}>
                                {row.points}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-brand-sky text-xs mt-2">
                    Data from DDSL · Updated daily
                  </p>
                </>
              )}
            </section>
          )}

          {/* ── Development info card ────────────────────────────────────── */}
          {!competitive && (
            <section>
              <div className="bg-brand-navy border-2 border-brand-sky p-6">
                <p className="text-brand-cream text-sm">
                  This team plays in the DDSL development pathway. Standings are
                  not published for this age group.
                </p>
              </div>
            </section>
          )}

          {/* ── Fixtures & Results ───────────────────────────────────────── */}
          <section>
            <div className="border-l-4 border-brand-neon pl-4 py-1 mb-4">
              <h2 className="font-display italic font-black uppercase text-xl text-brand-charcoal">
                Fixtures &amp; Results
              </h2>
            </div>

            {upcoming.length === 0 && results.length === 0 ? (
              <div className="bg-brand-navy border-2 border-brand-sky p-6">
                <p className="text-brand-cream text-sm">
                  No upcoming fixtures scheduled.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcoming.map((m) => (
                  <div
                    key={m.id}
                    className="bg-brand-navy border border-brand-sky p-4"
                  >
                    <p className="text-brand-neon text-xs font-mono font-bold mb-1">
                      {formatDate(m.date)} · {m.time}
                    </p>
                    <p className="text-brand-cream text-sm font-semibold">
                      {m.homeTeam} vs {m.awayTeam}
                    </p>
                    <p className="text-brand-sky text-xs mt-1">{m.venue.name}</p>
                  </div>
                ))}

                {results.length > 0 && (
                  <>
                    {upcoming.length > 0 && (
                      <p className="text-brand-charcoal/50 text-xs font-mono uppercase tracking-wide pt-2 pb-1">
                        Recent Results
                      </p>
                    )}
                    {results.map((m) => (
                      <div
                        key={m.id}
                        className="bg-brand-navy border border-brand-sky/40 p-4"
                      >
                        <p className="text-brand-sky text-xs font-mono mb-1">
                          {formatDate(m.date)}
                          {m.score && (
                            <span className="ml-2 text-brand-neon font-bold">
                              {m.score.home}–{m.score.away}
                            </span>
                          )}
                        </p>
                        <p className="text-brand-cream text-sm font-semibold">
                          {m.homeTeam} vs {m.awayTeam}
                        </p>
                        <p className="text-brand-sky text-xs mt-1">{m.venue.name}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}

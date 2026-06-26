import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import TeamPageTabs from '@/components/TeamPageTabs';
import FavouriteButton from '@/components/FavouriteButton';
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

// ─── Team colour system ───────────────────────────────────────────────────────

type TeamType = 'boys' | 'girls' | 'senior' | 'development';

function getTeamType(competitionName: string, ageGroup: string): TeamType {
  if (competitionName.includes('Girls')) return 'girls';
  if (competitionName.includes('Senior')) return 'senior';
  if (['U8', 'U9', 'U10', 'U11'].includes(ageGroup)) return 'development';
  return 'boys';
}

function getTeamColours(type: TeamType): {
  bg: string; text: string; border: string;
  tableHeader: string; tableHeaderText: string;
} {
  switch (type) {
    case 'girls':
      return { bg: 'bg-brand-maroon', text: 'text-white', border: 'border-brand-maroon', tableHeader: 'bg-brand-maroon', tableHeaderText: 'text-white' };
    case 'senior':
      return { bg: 'bg-brand-green',  text: 'text-white', border: 'border-brand-green',  tableHeader: 'bg-brand-green',  tableHeaderText: 'text-white' };
    case 'development':
      return { bg: 'bg-brand-navy',   text: 'text-brand-sky', border: 'border-brand-sky', tableHeader: 'bg-brand-navy',  tableHeaderText: 'text-brand-sky' };
    default:
      return { bg: 'bg-brand-sky',    text: 'text-brand-charcoal', border: 'border-brand-sky', tableHeader: 'bg-brand-navy', tableHeaderText: 'text-brand-sky' };
  }
}

function teamBadgeLabel(type: TeamType): string {
  switch (type) {
    case 'girls':       return 'DDSL GIRLS';
    case 'senior':      return 'SENIOR';
    case 'development': return 'DEVELOPMENT';
    default:            return 'DDSL BOYS';
  }
}

function getActiveColour(type: TeamType): string {
  switch (type) {
    case 'girls':  return 'brand-maroon';
    case 'senior': return 'brand-green';
    default:       return 'brand-sky';
  }
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
  return new Date(iso).toLocaleDateString('en-IE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
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
  const teamType    = getTeamType(division.competitionName, division.ageGroup);
  const colours     = getTeamColours(teamType);

  // ── Standings (competitive only) — two-step query ────────────────────────
  let standings: {
    position: number;
    teamName: string;
    played:   number;
    won:      number;
    drawn:    number;
    lost:     number;
    points:   number;
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
            seasonId:     activeSeason.id,
            source:       'DDSL',
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

  // ── Fixtures & Results — scrape live from DDSL ───────────────────────────
  let divisionFixtures: NormalisedMatch[] = [];
  let divisionResults:  NormalisedMatch[] = [];
  try {
    const competitionId =
      (await discoverCompetitionId(RVR_CLUB_ID)) ?? FALLBACK_AJAX_COMPETITION_ID;

    const [fixtureData, resultData] = await Promise.all([
      scrapeClubAjax(RVR_CLUB_ID, competitionId, 'fixtures'),
      scrapeClubAjax(RVR_CLUB_ID, competitionId, 'results'),
    ]);

    divisionFixtures = transformAll(
      fixtureData.fixtures.filter(
        (f) => f.competition.competitionName === division.competitionName,
      ),
    )
      .filter((m) => m.status === 'upcoming')
      .sort((a, b) => a.date.localeCompare(b.date));

    divisionResults = transformAll(
      resultData.fixtures.filter(
        (f) => f.competition.competitionName === division.competitionName,
      ),
    )
      .filter((m) => m.status === 'completed')
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  } catch {
    // DDSL unavailable — show empty fixtures
  }

  const displayName = stripDdsl(division.competitionName);

  // ── Tab panel content ─────────────────────────────────────────────────────

  const tablePanel = competitive ? (
    standings.length === 0 ? (
      <div className="bg-brand-navy border border-brand-sky/20 p-4">
        <p className="text-brand-cream text-sm">
          Standings not yet available for this division.
        </p>
      </div>
    ) : (
      <>
        <div className={`bg-brand-navy border-2 ${colours.border} shadow-brutalist overflow-hidden`}>
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
              <tr className={`${colours.tableHeader} ${colours.tableHeaderText} uppercase text-[10px] tracking-wide`}>
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
                        : 'bg-white/5 text-brand-cream'
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
        <p className="text-brand-sky text-xs text-right mt-2">
          Data from DDSL · Updated daily
        </p>
      </>
    )
  ) : undefined;

  const fixturesPanel = divisionFixtures.length === 0 ? (
    <div className="bg-brand-navy border border-brand-sky/20 p-4">
      <p className="text-brand-cream text-sm">
        No upcoming fixtures for this division.
      </p>
    </div>
  ) : (
    <div className="space-y-2">
      {divisionFixtures.map((m) => (
        <div
          key={m.id}
          className={`bg-brand-navy border border-brand-sky/20 border-l-2 ${colours.border} p-3`}
        >
          <p className="text-brand-neon text-sm font-bold mb-1">
            {formatDate(m.date)} · {m.time}
          </p>
          <p className="text-brand-cream text-base">
            <span className={isRVR(m.homeTeam) ? 'text-brand-green font-bold' : ''}>
              {m.homeTeam}
            </span>
            {' vs '}
            <span className={isRVR(m.awayTeam) ? 'text-brand-green font-bold' : ''}>
              {m.awayTeam}
            </span>
          </p>
          <p className="text-brand-sky text-xs mt-1">{m.venue.name}</p>
        </div>
      ))}
    </div>
  );

  const resultsPanel = divisionResults.length === 0 ? (
    <div className="bg-brand-navy border border-brand-sky/20 p-4">
      <p className="text-brand-cream text-sm">
        No recent results for this division.
      </p>
    </div>
  ) : (
    <div className="space-y-2">
      {divisionResults.map((m) => (
        <div
          key={m.id}
          className={`bg-brand-navy border border-brand-sky/20 border-l-2 ${colours.border} p-3`}
        >
          <div className="flex items-start justify-between mb-1">
            <p className="text-brand-cream text-base">
              <span className={isRVR(m.homeTeam) ? 'text-brand-green font-bold' : ''}>
                {m.homeTeam}
              </span>
              {m.score && (
                <span className="mx-2 text-brand-neon font-bold">
                  {m.score.home} – {m.score.away}
                </span>
              )}
              <span className={isRVR(m.awayTeam) ? 'text-brand-green font-bold' : ''}>
                {m.awayTeam}
              </span>
            </p>
            <span className="text-brand-sky text-xs shrink-0 ml-2 mt-0.5">
              {formatDate(m.date)}
            </span>
          </div>
          <p className="text-brand-sky text-xs">{m.venue.name}</p>
        </div>
      ))}
    </div>
  );

  return (
    <PublicPageShell>
      <PageHeroNavy
        backHref="/teams"
        backLabel="All Teams"
        title={displayName}
        description={`${division.ageGroup} · DDSL ${CLUB_SEASON.currentSeason} Season`}
        actions={
          <>
            <span className={`inline-block px-3 py-1 text-xs font-display font-black uppercase tracking-wider ${colours.bg} ${colours.text}`}>
              {teamBadgeLabel(teamType)}
            </span>
            <FavouriteButton
              teamId={division.slug}
              label={division.competitionName}
              variant="button"
            />
          </>
        }
        accentColor={colours.bg}
      />

        {/* ── Tab navigation ───────────────────────────────────────────────── */}
        <TeamPageTabs
          tabs={competitive ? ['table', 'fixtures', 'results'] : ['fixtures', 'results']}
          activeColour={getActiveColour(teamType)}
          table={tablePanel}
          fixtures={fixturesPanel}
          results={resultsPanel}
        />

    </PublicPageShell>
  );
}

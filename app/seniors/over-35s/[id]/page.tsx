import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import TeamPageTabs from '@/components/TeamPageTabs';
import FavouriteButton from '@/components/FavouriteButton';
import { findAflDivision } from '@/config/afl-competitions';
import { scrapeAflStandings } from '@/lib/afl/scraper';
import { CLUB_SEASON } from '@/config/club-season';

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return [{ id: 'over35s-a' }, { id: 'over35s-b' }];
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const division = findAflDivision(id);
  return {
    title: division
      ? division.competitionName
      : 'Over 35s',
    description: division
      ? `AFL standings for ${division.competitionName} — Rivervalley Rangers AFC.`
      : undefined,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Over35sTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const division = findAflDivision(id);
  if (!division) notFound();

  const aflTable = await scrapeAflStandings(division, CLUB_SEASON.currentSeason);

  // ── Table panel ───────────────────────────────────────────────────────────

  const tablePanel = aflTable === null || aflTable.standings.length === 0 ? (
    <div className="bg-brand-navy border border-brand-sky/20 p-4">
      <p className="text-brand-cream text-sm">
        Standings unavailable — check back soon.
      </p>
    </div>
  ) : (
    <>
      <div className="bg-brand-navy border-2 border-brand-neon shadow-brutalist overflow-hidden">
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
            <tr className="bg-brand-navy text-brand-neon uppercase text-[10px] tracking-wide">
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
            {aflTable.standings.map((row, i) => {
              const rvr = row.teamName === division.rvrTeamName;
              return (
                <tr
                  key={`${row.position}-${row.teamName}`}
                  className={
                    rvr
                      ? 'bg-brand-neon text-brand-charcoal font-bold border-l-4 border-brand-navy'
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
        Data from Amateur Football League · Updated on page load
      </p>
    </>
  );

  return (
    <PublicPageShell>
      <PageHeroNavy
        backHref="/seniors/over-35s"
        backLabel="Over 35s"
        title={division.officialName}
        description={`Over 35s · AFL ${CLUB_SEASON.currentSeason} Season`}
        actions={
          <>
            <span className="inline-block px-3 py-1 text-xs font-display font-black uppercase tracking-wider bg-brand-neon text-brand-charcoal">
              OVER 35s
            </span>
            <FavouriteButton
              teamId={division.id}
              label={division.competitionName}
              variant="button"
            />
          </>
        }
        accentColor="bg-brand-neon"
      />

        {/* ── Tab navigation ───────────────────────────────────────────────── */}
        <TeamPageTabs
          tabs={['table']}
          activeColour="brand-neon"
          table={tablePanel}
        />

    </PublicPageShell>
  );
}

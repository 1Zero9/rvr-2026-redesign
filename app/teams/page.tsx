import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import { KNOWN_DIVISIONS } from '@/config/ddsl-competitions';
import { CLUB_SEASON } from '@/config/club-season';

export const metadata: Metadata = {
  title: 'Teams | Rivervalley Rangers AFC',
  description:
    `All youth squads at Rivervalley Rangers AFC — ${KNOWN_DIVISIONS.length} DDSL divisions across U8–U15, ${CLUB_SEASON.currentSeason} season.`,
};

// ─── Constants ────────────────────────────────────────────────────────────────

const DEVELOPMENT_AGES = new Set(['U8', 'U9', 'U10', 'U11']);
const COMPETITIVE_AGES = new Set(['U12', 'U13', 'U14', 'U15', 'U17']);

const AGE_ORDER: Record<string, number> = {
  U8: 0, U9: 1, U10: 2, U11: 3, U12: 4, U13: 5, U14: 6, U15: 7, U17: 8,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripDdsl(name: string): string {
  return name.replace(/^DDSL\s+/i, '');
}

function isCompetitive(ageGroup: string): boolean {
  return COMPETITIVE_AGES.has(ageGroup);
}

function groupByAgeGroup() {
  const map = new Map<string, typeof KNOWN_DIVISIONS>();
  for (const d of KNOWN_DIVISIONS) {
    const existing = map.get(d.ageGroup) ?? [];
    existing.push(d);
    map.set(d.ageGroup, existing);
  }

  const sorted = [...map.entries()].sort(
    ([a], [b]) => (AGE_ORDER[a] ?? 99) - (AGE_ORDER[b] ?? 99),
  );

  return sorted.map(([ageGroup, divisions]) => ({
    ageGroup,
    divisions: [...divisions].sort((a, b) => {
      const aGirls = a.competitionName.includes('Girls');
      const bGirls = b.competitionName.includes('Girls');
      if (aGirls !== bGirls) return aGirls ? 1 : -1;
      return a.competitionName.localeCompare(b.competitionName);
    }),
  }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeamsPage() {
  const groups = groupByAgeGroup();

  return (
    <div className="min-h-screen bg-brand-cream">
      <Header />

      <main>
        {/* ── Hero banner ──────────────────────────────────────────────────── */}
        <div className="bg-brand-navy">
          <div className="max-w-5xl mx-auto px-4 md:px-6 pt-10 pb-8">
            <h1 className="font-display font-black italic text-5xl md:text-7xl uppercase tracking-tight leading-none text-brand-neon mb-2">
              Our Teams
            </h1>
            <p className="text-brand-sky text-sm font-mono uppercase tracking-wide">
              {CLUB_SEASON.currentSeason} Season · Youth
            </p>
          </div>
        </div>

        {/* ── Age group sections ───────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-12">
          {groups.map(({ ageGroup, divisions }) => {
            const competitive = isCompetitive(ageGroup);
            const isDev = DEVELOPMENT_AGES.has(ageGroup);

            return (
              <section key={ageGroup}>
                {/* Section heading */}
                <div className="border-l-4 border-brand-neon pl-4 py-2 mb-2">
                  <h2 className="font-display italic font-black uppercase text-3xl text-brand-charcoal leading-none">
                    {ageGroup}
                  </h2>
                </div>

                {/* Tier badge */}
                <div className="mb-4">
                  {isDev ? (
                    <span className="inline-block px-3 py-1 text-xs font-display font-black uppercase tracking-wider bg-brand-sky text-brand-navy">
                      Development
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 text-xs font-display font-black uppercase tracking-wider bg-brand-green text-brand-cream">
                      Competitive
                    </span>
                  )}
                </div>

                {/* Team cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {divisions.map((div) => (
                    <Link
                      key={div.slug}
                      href={`/teams/${div.slug}`}
                      className="group block bg-brand-navy border-2 border-brand-sky min-h-[44px] shadow-brutalist hover:border-brand-neon transition-colors"
                    >
                      {/* Top colour bar */}
                      <div
                        className={`h-1 w-full ${competitive ? 'bg-brand-neon' : 'bg-brand-sky'}`}
                      />

                      <div className="p-4">
                        {/* Team name */}
                        <p className="font-display italic font-black text-base leading-tight text-brand-cream mb-3">
                          {stripDdsl(div.competitionName)}
                        </p>

                        {/* Age group pill */}
                        <span className="inline-block px-2 py-0.5 text-[10px] font-display font-black uppercase tracking-wide border border-brand-sky/40 text-brand-sky mb-4">
                          {div.ageGroup}
                        </span>

                        {/* CTA */}
                        <p className={`text-xs font-display font-black uppercase tracking-wide ${competitive ? 'text-brand-neon' : 'text-brand-sky'}`}>
                          {competitive ? 'View Table →' : 'Fixtures →'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

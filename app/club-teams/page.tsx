import Link from 'next/link';
import PublicPageShell from '@/components/layout/PublicPageShell';
import { CLUB_TEAMS } from '@/config/club-teams';
import type { ClubTeamCategory } from '@/config/club-teams';

const CATEGORY_ORDER: ClubTeamCategory[] = [
  'academy',
  'adult',
  'community',
  'inclusive',
  'events',
];

const CATEGORY_LABELS: Record<ClubTeamCategory, string> = {
  academy:   'Academy',
  adult:     'Adult',
  community: 'Community',
  inclusive: 'Inclusive',
  events:    'Events',
};

export default function ClubTeamsPage() {
  return (
    <PublicPageShell>
      <div className="flex-1 bg-brand-navy">
      <main className="flex-grow">
        {/* Page header */}
        <div className="px-4 md:px-8 pt-16 pb-12 border-b border-brand-sky/20">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-display font-black italic text-5xl md:text-7xl text-brand-cream uppercase tracking-tight leading-none mb-4">
              The Full Club
            </h1>
            <p className="text-brand-neon text-xl md:text-2xl font-semibold">
              River Valley Rangers AFC — Every team, every ability
            </p>
          </div>
        </div>

        {/* Category sections */}
        <div className="px-4 md:px-8 py-12 max-w-5xl mx-auto space-y-16">
          {CATEGORY_ORDER.map((cat) => {
            const teams = CLUB_TEAMS.filter((t) => t.category === cat);
            if (teams.length === 0) return null;
            return (
              <section key={cat}>
                <h2 className="text-brand-neon text-sm uppercase tracking-widest font-bold mb-4">
                  {CATEGORY_LABELS[cat]}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teams.map((team) => (
                    <Link
                      key={team.slug}
                      href={`/club-teams/${team.slug}`}
                      className="group block border-2 border-brand-neon hover:border-brand-maroon bg-brand-navy rounded-2xl p-6 transition-colors min-h-[44px]"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl" aria-hidden="true">
                          {team.badge}
                        </span>
                        <span className="font-bold text-xl text-brand-cream group-hover:text-brand-neon transition-colors leading-tight">
                          {team.name}
                        </span>
                      </div>
                      <p className="text-brand-sky text-sm mt-2">{team.tagline}</p>
                      {team.isRecruiting && (
                        <span className="inline-block mt-4 bg-brand-neon text-brand-charcoal text-xs font-bold px-3 py-1 rounded-full">
                          Recruiting
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      </div>
    </PublicPageShell>
  );
}

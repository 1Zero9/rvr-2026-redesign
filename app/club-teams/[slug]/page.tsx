import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { CLUB_TEAMS, findClubTeam } from '@/config/club-teams';

export function generateStaticParams() {
  return CLUB_TEAMS.map((t) => ({ slug: t.slug }));
}

function trainingValue(val: string | undefined): string {
  if (!val || val === 'TBC') return 'To Be Confirmed';
  return val;
}

function isTBC(val: string | undefined): boolean {
  return !val || val === 'TBC';
}

export default async function ClubTeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = findClubTeam(slug);
  if (!team) notFound();

  const hasTrainingInfo =
    team.trainingDay !== undefined ||
    team.trainingTime !== undefined ||
    team.trainingVenue !== undefined;

  const ctaHref = team.category === 'academy' ? '/register' : '/contact';
  const ctaLabel = team.category === 'academy' ? 'Register Now' : 'Contact Us';

  return (
    <div className="flex flex-col min-h-screen bg-brand-navy">
      <Header />

      <main className="flex-grow">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="bg-brand-navy min-h-[50vh] flex flex-col justify-end pb-12 pt-20 px-4 md:px-8 border-b border-brand-sky/20">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl" aria-hidden="true">{team.badge}</span>
              <span className="text-brand-neon text-sm uppercase tracking-widest font-bold">
                {team.category}
              </span>
            </div>
            <h1 className="font-display font-black italic text-5xl md:text-7xl text-brand-cream uppercase tracking-tight leading-none mb-4">
              {team.name}
            </h1>
            <p className="text-brand-neon text-xl md:text-2xl font-semibold mb-6">
              {team.tagline}
            </p>
            {team.isRecruiting && (
              <span className="inline-flex items-center min-h-[44px] bg-brand-neon text-brand-charcoal font-bold px-4 py-2 rounded-full text-sm">
                Now Recruiting
              </span>
            )}
          </div>
        </section>

        {/* ── Description ───────────────────────────────────────────────────── */}
        <section className="bg-brand-charcoal px-4 md:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-brand-cream text-lg md:text-xl leading-relaxed">
              {team.description}
            </p>
            <p className="text-brand-sky text-2xl md:text-3xl font-bold mt-6 leading-snug">
              {team.marketingCopy}
            </p>
          </div>
        </section>

        {/* ── Training Info ─────────────────────────────────────────────────── */}
        {hasTrainingInfo && (
          <section className="bg-brand-navy px-4 md:px-8 py-12 border-t border-brand-sky/10">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display font-black italic text-3xl text-brand-cream uppercase mb-8">
                Training Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Day',   value: team.trainingDay },
                  { label: 'Time',  value: team.trainingTime },
                  { label: 'Venue', value: team.trainingVenue },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-brand-navy border-2 border-brand-neon rounded-2xl p-6"
                  >
                    <p className="text-brand-sky text-sm uppercase tracking-widest mb-2">
                      {label}
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        isTBC(value) ? 'text-brand-sky/50' : 'text-brand-cream'
                      }`}
                    >
                      {trainingValue(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact ───────────────────────────────────────────────────────── */}
        {team.contactEmail && (
          <section className="bg-brand-charcoal px-4 md:px-8 py-12 border-t border-brand-sky/10">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display font-black italic text-3xl text-brand-cream uppercase mb-6">
                Get in Touch
              </h2>
              {team.contactName && (
                <p className="text-brand-sky mb-2">{team.contactName}</p>
              )}
              <a
                href={`mailto:${team.contactEmail}`}
                className="inline-flex items-center min-h-[44px] text-brand-neon font-bold text-lg hover:underline"
              >
                {team.contactEmail}
              </a>
            </div>
          </section>
        )}

        {/* ── Get Involved CTA ──────────────────────────────────────────────── */}
        <section className="bg-brand-neon py-16 px-4 text-center">
          <h2 className="font-display font-black italic text-4xl text-brand-charcoal mb-6">
            Want to get involved?
          </h2>
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 bg-brand-charcoal border-2 border-brand-neon text-brand-neon font-bold rounded-2xl hover:bg-brand-navy transition-colors"
          >
            {ctaLabel}
          </Link>
        </section>

        {/* ── Back link ─────────────────────────────────────────────────────── */}
        <div className="bg-brand-navy border-t border-brand-sky/20 px-4 py-2">
          <Link
            href="/club-teams"
            className="inline-flex items-center min-h-[44px] text-brand-sky hover:text-brand-neon transition-colors font-semibold"
          >
            ← All Teams
          </Link>
        </div>

      </main>
    </div>
  );
}

import type { NormalisedMatch } from '@/lib/ddsl/types';

const RVR_NAMES = new Set([
  'Rivervalley Rangers',
  'River Valley Rangers',
  'River Valley Rangers FC',
]);

function isRvr(name: string): boolean {
  return RVR_NAMES.has(name);
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function FixtureCard({ match }: { match: NormalisedMatch }) {
  const isResult = match.status === 'completed' && match.score !== null;
  const homeIsRvr = isRvr(match.homeTeam);
  const awayIsRvr = isRvr(match.awayTeam);

  return (
    <article className="mb-3 rounded-xl border-2 border-brand-navy/15 bg-white p-4 shadow-[3px_3px_0_rgba(11,31,59,0.12)]">
      {/* Top row: competition badge + date */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <span className="max-w-full bg-brand-neon px-2 py-1 text-xs font-bold uppercase leading-tight text-brand-charcoal">
          {match.competition}
        </span>
        <span className="ml-auto text-right text-sm font-semibold text-zinc-500">
          {formatDate(match.date)}
          {match.time ? ` · ${match.time}` : ''}
        </span>
      </div>

      {/* Middle: teams + vs/score */}
      <div className="space-y-1 mb-3">
        <p
          className={`font-display text-lg font-bold italic leading-tight ${
            homeIsRvr ? 'text-brand-green' : 'text-brand-navy'
          }`}
        >
          {match.homeTeam}
        </p>
        <p className="text-sm font-bold text-zinc-400">vs</p>
        <p
          className={`font-display text-lg font-bold italic leading-tight ${
            awayIsRvr ? 'text-brand-green' : 'text-brand-navy'
          }`}
        >
          {match.awayTeam}
        </p>
      </div>

      {/* Bottom row: venue left, score right (results only) */}
      <div className="flex items-end justify-between gap-2">
        <p className="text-sm font-semibold text-zinc-500">{match.venue.name}</p>
        {isResult && match.score !== null && (
          <p className="shrink-0 font-display text-xl font-bold leading-none text-brand-green">
            {match.score.home} – {match.score.away}
          </p>
        )}
      </div>
    </article>
  );
}

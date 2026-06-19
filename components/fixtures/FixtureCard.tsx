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
    <article className="bg-brand-navy border border-brand-sky rounded-none p-4 mb-3">
      {/* Top row: competition badge + date */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="bg-brand-neon text-brand-charcoal text-xs font-bold uppercase px-2 py-1 leading-tight shrink-0">
          {match.competition}
        </span>
        <span className="text-brand-sky text-sm text-right shrink-0">
          {formatDate(match.date)}
          {match.time ? ` · ${match.time}` : ''}
        </span>
      </div>

      {/* Middle: teams + vs/score */}
      <div className="space-y-1 mb-3">
        <p
          className={`font-display text-lg font-bold italic leading-tight ${
            homeIsRvr ? 'text-brand-neon' : 'text-white'
          }`}
        >
          {match.homeTeam}
        </p>
        <p className="text-brand-neon text-sm font-bold">vs</p>
        <p
          className={`font-display text-lg font-bold italic leading-tight ${
            awayIsRvr ? 'text-brand-neon' : 'text-white'
          }`}
        >
          {match.awayTeam}
        </p>
      </div>

      {/* Bottom row: venue left, score right (results only) */}
      <div className="flex items-end justify-between gap-2">
        <p className="text-brand-sky text-sm">{match.venue.name}</p>
        {isResult && match.score !== null && (
          <p className="text-brand-neon font-display font-bold text-xl leading-none shrink-0">
            {match.score.home} – {match.score.away}
          </p>
        )}
      </div>
    </article>
  );
}

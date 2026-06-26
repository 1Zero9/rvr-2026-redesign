import type { CompetitionTeamWithPlayers } from "@/lib/competitions/types";

export function SquadCard({ team }: { team: CompetitionTeamWithPlayers }) {
  const players = team.players.map((p) => p.playerPoolEntry.displayName);

  return (
    <div className="border-3 border-brand-charcoal bg-brand-navy shadow-brutalist overflow-hidden">
      <div className="bg-brand-neon px-4 py-3 border-b-3 border-brand-charcoal">
        <h3 className="font-display font-black italic text-xl uppercase text-brand-charcoal">
          {team.name}
        </h3>
      </div>
      <ul className="divide-y divide-brand-sky/20">
        {players.map((name, i) => (
          <li
            key={i}
            className={`px-4 py-2 text-sm font-semibold text-brand-cream ${
              i % 2 === 0 ? "bg-brand-navy" : "bg-brand-navy/70"
            }`}
          >
            <span className="text-brand-neon font-mono text-xs mr-3">{i + 1}</span>
            {name}
          </li>
        ))}
        {players.length === 0 && (
          <li className="px-4 py-4 text-xs text-brand-sky/60 text-center">No players assigned</li>
        )}
      </ul>
    </div>
  );
}

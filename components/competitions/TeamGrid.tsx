import type { CompetitionTeamWithPlayers } from "@/lib/competitions/types";

export function TeamGrid({
  teams,
  onSwap,
}: {
  teams: CompetitionTeamWithPlayers[];
  onSwap?: (playerId: string, fromTeamId: string, toTeamId: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => (
        <div key={team.id} className="border-3 border-brand-charcoal bg-white shadow-brutalist">
          <div className="bg-brand-navy px-4 py-2 border-b-3 border-brand-charcoal">
            <h3 className="font-display font-black italic uppercase text-brand-neon text-sm">
              {team.name}
            </h3>
            <p className="text-brand-sky/70 text-xs">{team.players.length} players</p>
          </div>
          <ul className="divide-y divide-brand-navy/10">
            {team.players.map((tp) => (
              <li
                key={tp.id}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span className="font-semibold text-brand-charcoal">
                  {tp.playerPoolEntry.displayName}
                </span>
                {onSwap && (
                  <button
                    className="text-xs text-brand-sky hover:text-brand-neon min-h-[44px] px-2"
                    onClick={() => {
                      const target = window.prompt(`Move to team ID:`);
                      if (target) onSwap(tp.playerPoolEntryId, team.id, target);
                    }}
                  >
                    Move
                  </button>
                )}
              </li>
            ))}
            {team.players.length === 0 && (
              <li className="px-3 py-4 text-xs text-zinc-400 text-center">No players</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}

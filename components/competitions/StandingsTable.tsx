import type { StandingsRow } from "@/lib/competitions/types";

export function StandingsTable({ rows }: { rows: StandingsRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-zinc-400 py-6 text-center">No results yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-brand-navy">
            <th className="text-left py-2 pl-2 font-display font-black uppercase text-xs text-brand-navy w-6">#</th>
            <th className="text-left py-2 font-display font-black uppercase text-xs text-brand-navy">Team</th>
            <th className="text-center py-2 font-mono text-xs text-zinc-500 w-8">P</th>
            <th className="text-center py-2 font-mono text-xs text-zinc-500 w-8">W</th>
            <th className="text-center py-2 font-mono text-xs text-zinc-500 w-8">D</th>
            <th className="text-center py-2 font-mono text-xs text-zinc-500 w-8">L</th>
            <th className="text-center py-2 font-mono text-xs text-zinc-500 w-10">GD</th>
            <th className="text-center py-2 font-mono text-xs text-brand-navy font-black w-10">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.teamId}
              className={`border-b border-brand-navy/10 ${i === 0 ? "bg-brand-neon/10" : ""}`}
            >
              <td className="py-2 pl-2 font-mono text-xs text-zinc-400">{i + 1}</td>
              <td className="py-2 font-bold text-brand-charcoal">{row.teamName}</td>
              <td className="py-2 text-center font-mono text-xs text-zinc-500">{row.played}</td>
              <td className="py-2 text-center font-mono text-xs text-zinc-500">{row.won}</td>
              <td className="py-2 text-center font-mono text-xs text-zinc-500">{row.drawn}</td>
              <td className="py-2 text-center font-mono text-xs text-zinc-500">{row.lost}</td>
              <td className="py-2 text-center font-mono text-xs text-zinc-500">
                {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
              </td>
              <td className="py-2 text-center font-display font-black text-brand-navy">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import type { FixtureWithTeams } from "@/lib/competitions/types";

const STATUS_COLOUR: Record<string, string> = {
  SCHEDULED: "bg-brand-sky/20 text-brand-navy",
  LIVE: "bg-brand-neon text-brand-charcoal animate-pulse",
  COMPLETE: "bg-brand-green/20 text-brand-navy",
  VOID: "bg-zinc-200 text-zinc-500",
  WALKOVER: "bg-zinc-200 text-zinc-500",
};

export function FixtureRow({ fixture }: { fixture: FixtureWithTeams }) {
  const time = fixture.scheduledAt
    ? new Date(fixture.scheduledAt).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" })
    : null;

  const isComplete = fixture.status === "COMPLETE";

  return (
    <div className="border-b border-brand-navy/10 py-3 flex items-center gap-3">
      {time && (
        <span className="w-12 shrink-0 font-mono text-xs text-zinc-400">{time}</span>
      )}
      {fixture.pitchLabel && (
        <span className="hidden sm:block w-16 shrink-0 font-mono text-xs text-zinc-400 truncate">
          {fixture.pitchLabel}
        </span>
      )}
      <div className="flex-1 flex items-center justify-between gap-2">
        <span className={`text-sm font-bold ${isComplete && fixture.homeScore != null && fixture.awayScore != null && fixture.homeScore > fixture.awayScore ? "text-brand-navy" : "text-brand-charcoal"}`}>
          {fixture.homeTeam.name}
        </span>
        <span className="font-display font-black italic text-brand-navy text-base mx-1">
          {isComplete && fixture.homeScore != null && fixture.awayScore != null
            ? `${fixture.homeScore} – ${fixture.awayScore}`
            : "vs"}
        </span>
        <span className={`text-sm font-bold text-right ${isComplete && fixture.homeScore != null && fixture.awayScore != null && fixture.awayScore > fixture.homeScore ? "text-brand-navy" : "text-brand-charcoal"}`}>
          {fixture.awayTeam.name}
        </span>
      </div>
      <span className={`shrink-0 text-xs font-black uppercase px-2 py-0.5 ${STATUS_COLOUR[fixture.status]}`}>
        {fixture.status === "SCHEDULED" ? (fixture.round ?? "TBD") : fixture.status}
      </span>
    </div>
  );
}

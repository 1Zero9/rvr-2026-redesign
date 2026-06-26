import Link from "next/link";
import type { Competition } from "@prisma/client";

const STATE_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  READY: "Ready",
  LIVE: "Live",
  COMPLETE: "Complete",
  ARCHIVED: "Archived",
};

const STATE_COLOUR: Record<string, string> = {
  DRAFT: "bg-zinc-500 text-white",
  READY: "bg-brand-sky text-brand-navy",
  LIVE: "bg-brand-neon text-brand-charcoal",
  COMPLETE: "bg-brand-green text-white",
  ARCHIVED: "bg-zinc-300 text-zinc-700",
};

export function CompetitionCard({
  competition,
  href,
}: {
  competition: Pick<Competition, "id" | "name" | "slug" | "state" | "type" | "ageGroup" | "dates">;
  href: string;
}) {
  const firstDate = competition.dates[0];
  return (
    <Link
      href={href}
      className="block border-3 border-brand-charcoal bg-white shadow-brutalist p-5 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform min-h-[44px]"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="font-display font-black italic text-lg text-brand-navy uppercase leading-tight">
          {competition.name}
        </h2>
        <span
          className={`shrink-0 inline-block text-xs font-black uppercase px-2 py-0.5 ${STATE_COLOUR[competition.state]}`}
        >
          {STATE_LABEL[competition.state]}
        </span>
      </div>
      <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
        {competition.type.replace("_", " ")} · {competition.ageGroup}
        {firstDate && (
          <>
            {" · "}
            {new Date(firstDate).toLocaleDateString("en-IE", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </>
        )}
      </p>
    </Link>
  );
}

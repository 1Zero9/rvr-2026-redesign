import Link from "next/link";
import type { Competition } from "@prisma/client";
import { DeleteCompetitionButton } from "./DeleteCompetitionButton";

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

type ServerAction = (formData: FormData) => Promise<void>;

export function CompetitionCard({
  competition,
  href,
  onDelete,
}: {
  competition: Pick<Competition, "id" | "name" | "slug" | "state" | "type" | "ageGroup" | "dates" | "isDemo">;
  href: string;
  onDelete?: ServerAction;
}) {
  const firstDate = competition.dates[0];
  return (
    <div className="flex items-stretch border-3 border-brand-charcoal bg-white shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform">
      <Link href={href} className="block flex-1 min-w-0 p-5 min-h-[44px]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {competition.isDemo && (
              <span className="shrink-0 inline-block text-xs font-black uppercase px-2 py-0.5 bg-brand-maroon text-white">
                Demo
              </span>
            )}
            <h2 className="font-display font-black italic text-lg text-brand-navy uppercase leading-tight">
              {competition.name}
            </h2>
          </div>
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
      {onDelete && (
        <div className="shrink-0 flex items-center border-l-2 border-brand-charcoal/10">
          <DeleteCompetitionButton id={competition.id} name={competition.name} action={onDelete} />
        </div>
      )}
    </div>
  );
}

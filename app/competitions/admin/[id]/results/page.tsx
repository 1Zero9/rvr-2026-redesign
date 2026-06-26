import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireEventAdmin } from "@/lib/competitions/auth-helpers";
import { CompetitionAdminShell } from "@/components/competitions/CompetitionAdminShell";
import { FixtureRow } from "@/components/competitions/FixtureRow";

export const metadata = { title: "Results | RVR Competitions" };

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireEventAdmin(id);

  const competition = await prisma.competition.findUnique({
    where: { id },
    include: {
      fixtures: {
        include: { homeTeam: true, awayTeam: true },
        orderBy: { scheduledAt: "asc" },
      },
    },
  });
  if (!competition) notFound();

  const nav = [
    { href: `/competitions/admin/${id}`, label: "Overview" },
    { href: `/competitions/admin/${id}/players`, label: "Players" },
    { href: `/competitions/admin/${id}/teams`, label: "Teams" },
    { href: `/competitions/admin/${id}/fixtures`, label: "Fixtures" },
    { href: `/competitions/admin/${id}/results`, label: "Results" },
    { href: "/competitions/admin", label: "← All Competitions" },
  ];

  const pending = competition.fixtures.filter((f) => f.status === "SCHEDULED" || f.status === "LIVE");
  const completed = competition.fixtures.filter((f) => f.status === "COMPLETE");

  return (
    <CompetitionAdminShell nav={nav} title="Results">
      <div className="max-w-2xl space-y-6">
        {competition.fixtures.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-brand-navy/20">
            <p className="text-zinc-400 text-sm">No fixtures generated yet.</p>
          </div>
        )}

        {pending.length > 0 && (
          <section>
            <h2 className="font-display font-black italic text-lg uppercase text-brand-navy border-l-4 border-brand-neon pl-3 mb-3">
              Pending
            </h2>
            <div className="border-3 border-brand-charcoal bg-white p-4 shadow-brutalist">
              {pending.map((f) => (
                <div key={f.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <FixtureRow fixture={f} />
                  </div>
                  <a
                    href={`/api/competitions/${id}/results/${f.id}`}
                    className="shrink-0 text-xs font-bold text-brand-sky hover:text-brand-neon min-h-[44px] flex items-center px-2"
                  >
                    Edit
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {completed.length > 0 && (
          <section>
            <h2 className="font-display font-black italic text-lg uppercase text-brand-navy border-l-4 border-brand-green pl-3 mb-3">
              Completed ({completed.length})
            </h2>
            <div className="border-3 border-brand-charcoal bg-white p-4 shadow-brutalist">
              {completed.map((f) => <FixtureRow key={f.id} fixture={f} />)}
            </div>
          </section>
        )}
      </div>
    </CompetitionAdminShell>
  );
}

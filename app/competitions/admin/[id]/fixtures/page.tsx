"use client";
import { useState, use } from "react";
import { CompetitionAdminShell } from "@/components/competitions/CompetitionAdminShell";

export default function FixturesAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const nav = [
    { href: `/competitions/admin/${id}`, label: "Overview" },
    { href: `/competitions/admin/${id}/players`, label: "Players" },
    { href: `/competitions/admin/${id}/teams`, label: "Teams" },
    { href: `/competitions/admin/${id}/fixtures`, label: "Fixtures" },
    { href: `/competitions/admin/${id}/results`, label: "Results" },
    { href: "/competitions/admin", label: "← All Competitions" },
  ];

  async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGenerating(true);
    setError("");
    setSuccess(false);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/competitions/${id}/fixtures/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: fd.get("startTime"),
          gameDuration: Number(fd.get("gameDuration")),
          breakDuration: Number(fd.get("breakDuration")),
        }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Generation failed");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <CompetitionAdminShell nav={nav} title="Generate Fixtures">
      <div className="max-w-md space-y-5">
        {success && (
          <div className="bg-brand-green/10 border border-brand-green text-brand-navy px-4 py-3 text-sm font-bold">
            Fixtures generated successfully. View the results page to enter scores.
          </div>
        )}
        {error && (
          <div className="bg-brand-maroon/10 border border-brand-maroon text-brand-maroon px-4 py-3 text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block font-bold text-sm text-brand-charcoal mb-1">Start Time</label>
            <input
              name="startTime"
              type="time"
              defaultValue="09:00"
              required
              className="w-full border-2 border-brand-navy/30 px-3 py-2 min-h-[44px] focus:outline-none focus:border-brand-neon"
            />
          </div>
          <div>
            <label className="block font-bold text-sm text-brand-charcoal mb-1">Game Duration (minutes)</label>
            <input
              name="gameDuration"
              type="number"
              defaultValue={20}
              min={5}
              max={90}
              required
              className="w-full border-2 border-brand-navy/30 px-3 py-2 min-h-[44px] focus:outline-none focus:border-brand-neon"
            />
          </div>
          <div>
            <label className="block font-bold text-sm text-brand-charcoal mb-1">Break Between Games (minutes)</label>
            <input
              name="breakDuration"
              type="number"
              defaultValue={5}
              min={0}
              max={30}
              required
              className="w-full border-2 border-brand-navy/30 px-3 py-2 min-h-[44px] focus:outline-none focus:border-brand-neon"
            />
          </div>
          <button
            type="submit"
            disabled={generating}
            className="w-full min-h-[44px] bg-brand-neon text-brand-charcoal font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-60"
          >
            {generating ? "Generating…" : "Generate Schedule →"}
          </button>
        </form>

        <p className="text-xs text-zinc-400">
          This will generate a round-robin schedule for all teams. Existing fixtures will be replaced.
          Venues and pitches are configured on the Overview page.
        </p>
      </div>
    </CompetitionAdminShell>
  );
}

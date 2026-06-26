"use client";
import { useEffect, useState, use } from "react";
import type { FixtureWithTeams } from "@/lib/competitions/types";

// Minimal stripped UI — handed to parent volunteers
export default function PitchAdminPage({
  params,
}: {
  params: Promise<{ pitchId: string }>;
}) {
  const { pitchId } = use(params);
  const decodedPitch = decodeURIComponent(pitchId);

  const [fixture, setFixture] = useState<FixtureWithTeams | null>(null);
  const [nextFixture, setNextFixture] = useState<FixtureWithTeams | null>(null);
  const [home, setHome] = useState(0);
  const [away, setAway] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/competitions/pitch/${pitchId}/current`);
        if (res.ok) {
          const data = await res.json() as { current: FixtureWithTeams | null; next: FixtureWithTeams | null };
          setFixture(data.current);
          setNextFixture(data.next);
          if (data.current?.homeScore != null) setHome(data.current.homeScore);
          if (data.current?.awayScore != null) setAway(data.current.awayScore);
        }
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [pitchId]);

  async function handleConfirm() {
    if (!fixture) return;
    setSaving(true);
    try {
      await fetch(`/api/competitions/${fixture.competitionId}/results/${fixture.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeScore: home, awayScore: away }),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <p className="text-brand-sky animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4 py-8 gap-8">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-1">
          {decodedPitch}
        </p>
        <h1 className="font-display font-black italic text-2xl uppercase text-brand-navy">
          Score Entry
        </h1>
      </div>

      {!fixture ? (
        <div className="text-center py-12">
          <p className="text-zinc-400 text-lg font-semibold">No current fixture</p>
          {nextFixture && (
            <p className="text-sm text-zinc-400 mt-2">
              Next: {nextFixture.homeTeam?.name} vs {nextFixture.awayTeam?.name}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="w-full max-w-sm flex items-center gap-4">
            <div className="flex-1 text-center">
              <p className="font-display font-black italic text-xl uppercase text-brand-navy mb-4">
                {fixture.homeTeam?.name}
              </p>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={99}
                value={home}
                onChange={(e) => { setHome(Math.max(0, Number(e.target.value))); setSaved(false); }}
                className="w-full border-3 border-brand-charcoal text-center font-display font-black text-6xl text-brand-navy bg-white py-5 min-h-[72px] focus:outline-none focus:border-brand-neon"
              />
            </div>
            <span className="font-display font-black italic text-3xl text-zinc-300">–</span>
            <div className="flex-1 text-center">
              <p className="font-display font-black italic text-xl uppercase text-brand-navy mb-4">
                {fixture.awayTeam?.name}
              </p>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={99}
                value={away}
                onChange={(e) => { setAway(Math.max(0, Number(e.target.value))); setSaved(false); }}
                className="w-full border-3 border-brand-charcoal text-center font-display font-black text-6xl text-brand-navy bg-white py-5 min-h-[72px] focus:outline-none focus:border-brand-neon"
              />
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={saving}
            className="w-full max-w-sm min-h-[64px] bg-brand-neon text-brand-charcoal font-display font-black italic text-2xl uppercase border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all disabled:opacity-60"
          >
            {saving ? "Saving…" : saved ? "✓ Saved" : "Confirm Result"}
          </button>

          {nextFixture && (
            <div className="text-center text-sm text-zinc-400 border-t border-brand-navy/10 pt-4 w-full max-w-sm">
              <p className="font-mono text-xs uppercase tracking-wider mb-1">Next on this pitch</p>
              <p className="font-semibold text-brand-charcoal">
                {nextFixture.homeTeam?.name} vs {nextFixture.awayTeam?.name}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

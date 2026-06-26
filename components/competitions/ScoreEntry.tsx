"use client";
import { useState } from "react";
import type { FixtureWithTeams } from "@/lib/competitions/types";

export function ScoreEntry({
  fixture,
  onConfirm,
}: {
  fixture: FixtureWithTeams;
  onConfirm: (homeScore: number, awayScore: number) => Promise<void>;
}) {
  const [home, setHome] = useState(fixture.homeScore ?? 0);
  const [away, setAway] = useState(fixture.awayScore ?? 0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleConfirm() {
    setSaving(true);
    try {
      await onConfirm(home, away);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4">
      <div className="flex items-center gap-6 w-full max-w-sm">
        <div className="flex-1 text-center">
          <p className="font-display font-black italic text-lg uppercase text-brand-navy mb-3">
            {fixture.homeTeam.name}
          </p>
          <input
            type="number"
            min={0}
            max={99}
            value={home}
            onChange={(e) => setHome(Math.max(0, Number(e.target.value)))}
            className="w-full border-3 border-brand-charcoal text-center font-display font-black text-5xl text-brand-navy py-4 min-h-[72px] focus:outline-none focus:border-brand-neon"
          />
        </div>
        <span className="font-display font-black italic text-3xl text-zinc-400">–</span>
        <div className="flex-1 text-center">
          <p className="font-display font-black italic text-lg uppercase text-brand-navy mb-3">
            {fixture.awayTeam.name}
          </p>
          <input
            type="number"
            min={0}
            max={99}
            value={away}
            onChange={(e) => setAway(Math.max(0, Number(e.target.value)))}
            className="w-full border-3 border-brand-charcoal text-center font-display font-black text-5xl text-brand-navy py-4 min-h-[72px] focus:outline-none focus:border-brand-neon"
          />
        </div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={saving}
        className="w-full max-w-sm min-h-[56px] bg-brand-neon text-brand-charcoal font-display font-black italic text-xl uppercase border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all disabled:opacity-60"
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Confirm Result"}
      </button>
    </div>
  );
}

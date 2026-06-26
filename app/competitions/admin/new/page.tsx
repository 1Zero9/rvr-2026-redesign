"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CompetitionAdminShell } from "@/components/competitions/CompetitionAdminShell";

const TYPES = ["MINI_LEAGUE", "KNOCKOUT", "GROUP_KNOCKOUT", "BLITZ", "FESTIVAL"] as const;
const THEMES = ["COUNTRIES", "PREMIER_LEAGUE", "LOI_CLUBS", "LEGENDS", "COLOURS", "ANIMALS", "CUSTOM"] as const;
const MODES = ["PLAYERS", "TEAMS"] as const;

export default function NewCompetitionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      slug: fd.get("slug"),
      type: fd.get("type"),
      participantMode: fd.get("participantMode"),
      ageGroup: fd.get("ageGroup"),
      teamTheme: fd.get("teamTheme"),
      dataRetentionDays: Number(fd.get("dataRetentionDays") ?? 90),
    };
    try {
      const res = await fetch("/api/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Failed to create competition");
      }
      const data = await res.json() as { id: string };
      router.push(`/competitions/admin/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSaving(false);
    }
  }

  return (
    <CompetitionAdminShell title="New Competition">
      <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
        {error && (
          <div className="bg-brand-maroon/10 border border-brand-maroon text-brand-maroon text-sm px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label className="block font-bold text-sm text-brand-charcoal mb-1">Competition Name *</label>
          <input name="name" required className="w-full border-2 border-brand-navy/30 px-3 py-2 min-h-[44px] focus:outline-none focus:border-brand-neon" placeholder="e.g. Swords Summer Blitz 2026" />
        </div>

        <div>
          <label className="block font-bold text-sm text-brand-charcoal mb-1">URL Slug *</label>
          <input name="slug" required pattern="[a-z0-9-]+" title="Lowercase letters, numbers, and hyphens only" className="w-full border-2 border-brand-navy/30 px-3 py-2 min-h-[44px] font-mono focus:outline-none focus:border-brand-neon" placeholder="e.g. swords-blitz-26" />
          <p className="text-xs text-zinc-400 mt-1">Lowercase, no spaces. Used in the public URL.</p>
        </div>

        <div>
          <label className="block font-bold text-sm text-brand-charcoal mb-1">Type *</label>
          <select name="type" required className="w-full border-2 border-brand-navy/30 px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon">
            {TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-bold text-sm text-brand-charcoal mb-1">Participant Mode *</label>
          <select name="participantMode" required className="w-full border-2 border-brand-navy/30 px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon">
            {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-bold text-sm text-brand-charcoal mb-1">Age Group *</label>
          <input name="ageGroup" required className="w-full border-2 border-brand-navy/30 px-3 py-2 min-h-[44px] focus:outline-none focus:border-brand-neon" placeholder="e.g. U9, U10, Mixed" />
        </div>

        <div>
          <label className="block font-bold text-sm text-brand-charcoal mb-1">Team Theme *</label>
          <select name="teamTheme" required className="w-full border-2 border-brand-navy/30 px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon">
            {THEMES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-bold text-sm text-brand-charcoal mb-1">Data Retention (days)</label>
          <input name="dataRetentionDays" type="number" min={7} max={365} defaultValue={90} className="w-full border-2 border-brand-navy/30 px-3 py-2 min-h-[44px] focus:outline-none focus:border-brand-neon" />
          <p className="text-xs text-zinc-400 mt-1">Player data is auto-deleted this many days after archiving.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 min-h-[44px] bg-brand-neon text-brand-charcoal font-display font-black italic uppercase border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-60"
          >
            {saving ? "Creating…" : "Create Competition →"}
          </button>
        </div>
      </form>
    </CompetitionAdminShell>
  );
}

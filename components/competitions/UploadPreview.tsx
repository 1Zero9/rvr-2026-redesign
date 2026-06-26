import type { ParsedPlayerRow } from "@/lib/competitions/types";

export function UploadPreview({
  rows,
  onConfirm,
  onCancel,
  loading,
}: {
  rows: ParsedPlayerRow[];
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const flagged = rows.filter((r) => r.flags.length > 0);
  const clean = rows.filter((r) => r.flags.length === 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 text-sm">
        <span className="font-black text-brand-navy">{rows.length} rows detected</span>
        <span className="text-brand-green font-bold">{clean.length} ready</span>
        {flagged.length > 0 && (
          <span className="text-brand-maroon font-bold">{flagged.length} flagged</span>
        )}
      </div>

      <div className="overflow-x-auto border-2 border-brand-navy/20 max-h-72 overflow-y-auto">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0 bg-brand-navy text-brand-cream">
            <tr>
              <th className="text-left px-3 py-2">Display Name</th>
              <th className="text-left px-3 py-2">Age Group</th>
              <th className="text-left px-3 py-2">Club/School</th>
              <th className="text-left px-3 py-2">Flags</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-brand-navy/10 ${row.flags.length > 0 ? "bg-brand-maroon/10" : ""}`}
              >
                <td className="px-3 py-2 font-semibold text-brand-charcoal">
                  {row.displayName || <span className="text-brand-maroon italic">missing</span>}
                </td>
                <td className="px-3 py-2 text-zinc-500">{row.ageGroup ?? "—"}</td>
                <td className="px-3 py-2 text-zinc-500">{row.clubOrSchool ?? "—"}</td>
                <td className="px-3 py-2">
                  {row.flags.map((f, fi) => (
                    <p key={fi} className="text-brand-maroon font-bold">{f}</p>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          disabled={loading || clean.length === 0}
          className="flex-1 min-h-[44px] bg-brand-neon text-brand-charcoal font-display font-black uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-60"
        >
          {loading ? "Importing…" : `Import ${clean.length} players`}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="min-h-[44px] px-5 border-3 border-brand-charcoal bg-white font-bold text-sm shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

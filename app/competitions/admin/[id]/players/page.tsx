"use client";
import { useState, useRef } from "react";
import { UploadPreview } from "@/components/competitions/UploadPreview";
import { CompetitionAdminShell } from "@/components/competitions/CompetitionAdminShell";
import type { ParsedPlayerRow } from "@/lib/competitions/types";
import { use } from "react";

export default function PlayersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const nav = [
    { href: `/competitions/admin/${id}`, label: "Overview" },
    { href: `/competitions/admin/${id}/players`, label: "Players" },
    { href: `/competitions/admin/${id}/teams`, label: "Teams" },
    { href: `/competitions/admin/${id}/fixtures`, label: "Fixtures" },
    { href: `/competitions/admin/${id}/results`, label: "Results" },
    { href: "/competitions/admin", label: "← All Competitions" },
  ];

  const [acknowledged, setAcknowledged] = useState(false);
  const [parsed, setParsed] = useState<ParsedPlayerRow[] | null>(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const [parseError, setParseError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);
    setParseError("");
    setParsed(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("preview", "1");
      const res = await fetch(`/api/competitions/${id}/upload`, { method: "POST", body: fd });
      const data = await res.json() as { rows?: ParsedPlayerRow[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Parse failed");
      setParsed(data.rows ?? []);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Parse failed");
    } finally {
      setParsing(false);
    }
  }

  async function handleConfirm() {
    if (!parsed || !fileRef.current?.files?.[0]) return;
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append("file", fileRef.current.files[0]);
      const res = await fetch(`/api/competitions/${id}/upload`, { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Import failed");
      }
      setImported(true);
      setParsed(null);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  return (
    <CompetitionAdminShell nav={nav} title="Player Pool">
      <div className="max-w-2xl space-y-6">
        {imported && (
          <div className="bg-brand-green/10 border border-brand-green text-brand-navy px-4 py-3 text-sm font-bold">
            Players imported successfully.
          </div>
        )}

        {!acknowledged ? (
          <div className="border-3 border-brand-maroon bg-brand-maroon/5 p-6 space-y-4">
            <h2 className="font-display font-black italic text-xl uppercase text-brand-maroon">
              GDPR Data Notice
            </h2>
            <p className="text-sm text-brand-charcoal leading-relaxed">
              By uploading participant data you confirm you have obtained appropriate consent from
              participants or their guardians in accordance with GDPR. Data will be automatically
              deleted according to the competition&apos;s data retention policy after it is archived.
            </p>
            <p className="text-sm font-bold text-brand-charcoal">
              Only first names and last initials are shown publicly. Full names are stored securely
              and never exposed via public API endpoints.
            </p>
            <button
              onClick={() => setAcknowledged(true)}
              className="min-h-[44px] px-6 bg-brand-maroon text-white font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              I understand — continue to upload
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-sm text-brand-charcoal mb-2">
                Upload player list (.csv, .xlsx, .xls)
              </label>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFile}
                disabled={parsing || importing}
                className="block w-full text-sm text-zinc-500 file:mr-3 file:min-h-[44px] file:px-4 file:border-3 file:border-brand-charcoal file:bg-brand-navy file:text-brand-neon file:font-bold file:uppercase file:text-xs file:cursor-pointer"
              />
              <p className="text-xs text-zinc-400 mt-1">
                Columns detected automatically — any order, any case.
              </p>
            </div>

            {parsing && <p className="text-sm text-zinc-400 animate-pulse">Parsing file…</p>}
            {parseError && <p className="text-sm text-brand-maroon font-bold">{parseError}</p>}

            {parsed && (
              <UploadPreview
                rows={parsed}
                onConfirm={handleConfirm}
                onCancel={() => { setParsed(null); if (fileRef.current) fileRef.current.value = ""; }}
                loading={importing}
              />
            )}
          </div>
        )}
      </div>
    </CompetitionAdminShell>
  );
}

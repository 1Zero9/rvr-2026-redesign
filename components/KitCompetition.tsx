"use client";

import { Download, Shirt, Upload, Vote } from "lucide-react";
import { ChangeEvent, useState } from "react";

interface KitEntry {
  id: string;
  title: string;
  designerName: string;
  imageUrl: string;
  votes: number;
}

const initialEntries: KitEntry[] = [
  {
    id: "green-river",
    title: "Green River",
    designerName: "Ava",
    imageUrl:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80",
    votes: 48,
  },
  {
    id: "1981-hoops",
    title: "1981 Hoops",
    designerName: "Noah",
    imageUrl:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80",
    votes: 36,
  },
  {
    id: "astro-nights",
    title: "Astro Nights",
    designerName: "Sophie",
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80",
    votes: 42,
  },
];

export default function KitCompetition() {
  const [entries, setEntries] = useState(initialEntries);
  const [votedEntryIds, setVotedEntryIds] = useState<string[]>([]);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setUploadMessage("Upload an image or PDF design file.");
      return;
    }

    const imageUrl = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : "";

    const nextEntry: KitEntry = {
      id: `local-${file.name}-${entries.length + 1}`,
      title: file.name.replace(/\.[^.]+$/, ""),
      designerName: "New submission",
      imageUrl,
      votes: 0,
    };

    setEntries((current) => [nextEntry, ...current]);
    setUploadMessage("Design added to the preview grid.");
  };

  const voteForEntry = (entryId: string) => {
    if (votedEntryIds.includes(entryId)) return;

    setVotedEntryIds((current) => [...current, entryId]);
    setEntries((current) =>
      current.map((entry) =>
        entry.id === entryId ? { ...entry, votes: entry.votes + 1 } : entry,
      ),
    );
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border-4 border-brand-charcoal bg-white p-6 shadow-[6px_6px_0_#121212] sm:p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-brand-charcoal bg-brand-neon shadow-[3px_3px_0_#121212]">
            <Shirt className="h-7 w-7 text-brand-charcoal" aria-hidden="true" />
          </div>
          <p className="font-display text-xs font-black uppercase text-brand-green">
            40th Anniversary Kit Contest
          </p>
          <h1 className="mt-3 font-display text-4xl font-black uppercase leading-none tracking-tight text-brand-charcoal md:text-6xl">
            Design the next club shirt.
          </h1>
          <p className="mt-5 text-base font-semibold leading-relaxed text-zinc-700">
            Download the design template, create your entry, and upload the
            finished design for the community vote.
          </p>
          <a
            href="/downloads/rvr-40th-kit-template.pdf"
            className="btn-brutalist-neon mt-6 inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 text-sm"
          >
            <Download className="h-5 w-5" aria-hidden="true" />
            Download Template
          </a>
        </div>

        <div className="rounded-[2rem] border-4 border-brand-charcoal bg-[#f1ffe1] p-6 shadow-[6px_6px_0_#121212] sm:p-8">
          <p className="font-display text-xs font-black uppercase text-brand-green">
            Submit a design
          </p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase">
            Upload your finished entry.
          </h2>
          <label className="mt-6 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-4 border-dashed border-brand-charcoal bg-white p-6 text-center transition hover:bg-brand-cream">
            <Upload className="h-9 w-9 text-brand-green" aria-hidden="true" />
            <span className="mt-4 font-display text-xl font-black uppercase">
              Choose design file
            </span>
            <span className="mt-2 text-sm font-semibold text-zinc-600">
              Image or PDF files accepted
            </span>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleUpload}
              className="sr-only"
            />
          </label>
          {uploadMessage && (
            <p className="mt-4 rounded-xl border-2 border-brand-charcoal bg-white px-4 py-3 text-sm font-bold">
              {uploadMessage}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-display text-xs font-black uppercase text-brand-green">
              Community vote
            </p>
            <h2 className="font-display text-3xl font-black uppercase tracking-tight">
              Submitted entries
            </h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-relaxed text-zinc-700">
            Voting is limited to one click per entry in this browser session.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => {
            const voted = votedEntryIds.includes(entry.id);

            return (
              <article
                key={entry.id}
                className="overflow-hidden rounded-2xl border-4 border-brand-charcoal bg-white shadow-[6px_6px_0_#121212]"
              >
                <div className="flex aspect-[4/3] items-center justify-center border-b-4 border-brand-charcoal bg-brand-cream">
                  {entry.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={entry.imageUrl}
                      alt={`${entry.title} kit design`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-display text-2xl font-black uppercase text-brand-green">
                      PDF Entry
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-black uppercase">
                    {entry.title}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-zinc-600">
                    Designer: {entry.designerName}
                  </p>
                  <button
                    type="button"
                    onClick={() => voteForEntry(entry.id)}
                    disabled={voted}
                    className={`mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-3 border-brand-charcoal px-5 py-3 font-display text-sm font-black uppercase shadow-[4px_4px_0_#121212] transition ${
                      voted
                        ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
                        : "bg-brand-neon text-brand-charcoal hover:-translate-y-0.5"
                    }`}
                  >
                    <Vote className="h-4 w-4" aria-hidden="true" />
                    {voted ? "Vote counted" : `Vote (${entry.votes})`}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { FormEvent, useMemo, useState } from "react";
import type {
  KitDesignSubmission,
  KitDesignUploadDraft,
} from "@/types/campaigns";

interface KitDesignCompetitionProps {
  competitionId: string;
  templatePdfUrl: string;
  initialSubmissions: KitDesignSubmission[];
}

const blankUploadDraft: KitDesignUploadDraft = {
  designerName: "",
  designerAge: undefined,
  guardianName: "",
  email: "",
  title: "",
  story: "",
};

export default function KitDesignCompetition({
  competitionId,
  templatePdfUrl,
  initialSubmissions,
}: KitDesignCompetitionProps) {
  const voteStorageKey = `rvr-kit-votes-${competitionId}`;
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [downloadEmail, setDownloadEmail] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const [uploadDraft, setUploadDraft] = useState(blankUploadDraft);
  const [votedIds, setVotedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];

    const storedVotes = window.localStorage.getItem(voteStorageKey);
    if (!storedVotes) return [];

    try {
      return JSON.parse(storedVotes) as string[];
    } catch {
      return [];
    }
  });
  const [uploadMessage, setUploadMessage] = useState("");

  const approvedSubmissions = useMemo(
    () => submissions.filter((submission) => submission.status === "APPROVED"),
    [submissions],
  );

  const handleTemplateDownload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!downloadEmail || !downloadName) return;
    window.open(templatePdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleUpload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!uploadDraft.file) {
      setUploadMessage("Add a design file before submitting.");
      return;
    }

    const objectUrl = URL.createObjectURL(uploadDraft.file);
    const submission: KitDesignSubmission = {
      id: `local-${Date.now()}`,
      competitionId,
      designerName: uploadDraft.designerName,
      designerAge: uploadDraft.designerAge,
      title: uploadDraft.title,
      story: uploadDraft.story,
      fileUrl: objectUrl,
      fileMimeType: uploadDraft.file.type,
      thumbnailUrl: uploadDraft.file.type.startsWith("image/")
        ? objectUrl
        : undefined,
      status: "APPROVED",
      voteCount: 0,
      createdAt: new Date().toISOString(),
    };

    setSubmissions((current) => [submission, ...current]);
    setUploadDraft(blankUploadDraft);
    setUploadMessage("Design received. In production this posts to the upload API for moderation.");
  };

  const handleVote = (submissionId: string) => {
    if (votedIds.includes(submissionId)) return;

    const nextVotes = [...votedIds, submissionId];
    setVotedIds(nextVotes);
    window.localStorage.setItem(voteStorageKey, JSON.stringify(nextVotes));
    setSubmissions((current) =>
      current.map((submission) =>
        submission.id === submissionId
          ? { ...submission, voteCount: submission.voteCount + 1 }
          : submission,
      ),
    );
  };

  return (
    <section className="bg-brand-cream text-brand-charcoal">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <div className="space-y-8">
          <div className="relative overflow-hidden rounded-[2rem] border-4 border-brand-charcoal bg-white p-8 shadow-brutalist">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-4 border-brand-charcoal bg-brand-neon" />
            <div className="absolute bottom-6 right-8 h-10 w-10 rotate-12 rounded-xl border-3 border-brand-charcoal bg-[#ff8fb3]" />
            <p className="relative mb-5 inline-flex rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase">
              40th anniversary kit
            </p>
            <h1 className="relative max-w-xl font-display text-5xl font-black uppercase leading-none tracking-tight md:text-7xl">
              Design the shirt that tells our story.
            </h1>
            <p className="relative mt-6 max-w-lg text-lg font-semibold leading-8 text-zinc-700">
              Download the official template, add your RVR idea, then submit an image or PDF.
              Shortlisted designs appear below for a community vote.
            </p>
          </div>

          <form
            onSubmit={handleTemplateDownload}
            className="brutalist-card bg-[#f1ffe1] p-6"
          >
            <h2 className="font-display text-2xl font-black uppercase">
              Get the template
            </h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-black uppercase">
                Guardian name
                <input
                  value={downloadName}
                  onChange={(event) => setDownloadName(event.target.value)}
                  className="rounded-xl border-3 border-brand-charcoal bg-white px-4 py-3 font-sans normal-case outline-none focus:ring-4 focus:ring-brand-neon"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-black uppercase">
                Email
                <input
                  type="email"
                  value={downloadEmail}
                  onChange={(event) => setDownloadEmail(event.target.value)}
                  className="rounded-xl border-3 border-brand-charcoal bg-white px-4 py-3 font-sans normal-case outline-none focus:ring-4 focus:ring-brand-neon"
                  required
                />
              </label>
              <button className="btn-brutalist-green px-6 py-3">
                Download PDF template
              </button>
            </div>
          </form>
        </div>

        <form onSubmit={handleUpload} className="brutalist-card p-6 md:p-8">
          <h2 className="font-display text-3xl font-black uppercase">
            Submit a design
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-black uppercase">
              Designer name
              <input
                value={uploadDraft.designerName}
                onChange={(event) =>
                  setUploadDraft({ ...uploadDraft, designerName: event.target.value })
                }
                className="rounded-xl border-3 border-brand-charcoal px-4 py-3 font-sans normal-case outline-none focus:ring-4 focus:ring-brand-neon"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-black uppercase">
              Age
              <input
                type="number"
                min="4"
                max="99"
                value={uploadDraft.designerAge ?? ""}
                onChange={(event) =>
                  setUploadDraft({
                    ...uploadDraft,
                    designerAge: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  })
                }
                className="rounded-xl border-3 border-brand-charcoal px-4 py-3 font-sans normal-case outline-none focus:ring-4 focus:ring-brand-neon"
              />
            </label>
            <label className="grid gap-2 text-sm font-black uppercase md:col-span-2">
              Design title
              <input
                value={uploadDraft.title}
                onChange={(event) =>
                  setUploadDraft({ ...uploadDraft, title: event.target.value })
                }
                className="rounded-xl border-3 border-brand-charcoal px-4 py-3 font-sans normal-case outline-none focus:ring-4 focus:ring-brand-neon"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-black uppercase">
              Guardian email
              <input
                type="email"
                value={uploadDraft.email}
                onChange={(event) =>
                  setUploadDraft({ ...uploadDraft, email: event.target.value })
                }
                className="rounded-xl border-3 border-brand-charcoal px-4 py-3 font-sans normal-case outline-none focus:ring-4 focus:ring-brand-neon"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-black uppercase">
              Upload image or PDF
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(event) =>
                  setUploadDraft({
                    ...uploadDraft,
                    file: event.target.files?.[0],
                  })
                }
                className="rounded-xl border-3 border-brand-charcoal bg-white px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-2 file:border-brand-charcoal file:bg-brand-neon file:px-4 file:py-2 file:font-black"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-black uppercase md:col-span-2">
              Story behind the shirt
              <textarea
                rows={4}
                value={uploadDraft.story}
                onChange={(event) =>
                  setUploadDraft({ ...uploadDraft, story: event.target.value })
                }
                className="rounded-xl border-3 border-brand-charcoal px-4 py-3 font-sans normal-case outline-none focus:ring-4 focus:ring-brand-neon"
              />
            </label>
          </div>
          <button className="btn-brutalist-neon mt-6 px-7 py-3">
            Upload design
          </button>
          {uploadMessage && (
            <p className="mt-4 rounded-xl border-2 border-brand-charcoal bg-[#f1ffe1] px-4 py-3 text-sm font-bold">
              {uploadMessage}
            </p>
          )}
        </form>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-display text-sm font-black uppercase text-brand-green">
              Community vote
            </p>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight">
              Shortlisted designs
            </h2>
          </div>
          <p className="max-w-md text-sm font-semibold text-zinc-600">
            Voting is limited in-browser with localStorage now. Connect `KitDesignVote`
            to an API route for session or account-level enforcement.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {approvedSubmissions.map((submission) => {
            const hasVoted = votedIds.includes(submission.id);

            return (
              <article key={submission.id} className="brutalist-card overflow-hidden">
                <div className="flex aspect-[4/3] items-center justify-center border-b-4 border-brand-charcoal bg-[#e8f4f0]">
                  {submission.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={submission.thumbnailUrl}
                      alt={`${submission.title} kit design`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="px-8 text-center font-display text-3xl font-black uppercase text-brand-green">
                      PDF Design
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-black uppercase">
                    {submission.title}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-zinc-600">
                    By {submission.designerName}
                    {submission.designerAge ? `, age ${submission.designerAge}` : ""}
                  </p>
                  {submission.story && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-700">
                      {submission.story}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => handleVote(submission.id)}
                    disabled={hasVoted}
                    className={`mt-5 w-full rounded-full border-3 border-brand-charcoal px-5 py-3 font-display text-sm font-black uppercase shadow-[4px_4px_0_#121212] transition ${
                      hasVoted
                        ? "bg-zinc-200 text-zinc-500"
                        : "bg-brand-neon text-brand-charcoal hover:-translate-y-0.5"
                    }`}
                  >
                    {hasVoted ? "Vote counted" : `Vote (${submission.voteCount})`}
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

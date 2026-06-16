"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import {
  Download,
  FileUp,
  Mail,
  ShieldCheck,
  Shirt,
  Trophy,
  UserRound,
  Vote,
} from "lucide-react";

type ModerationStatus = "PENDING" | "APPROVED" | "REJECTED";

interface KitDesignSubmissionView {
  id: string;
  campaignId: string;
  submitterName: string;
  submitterEmail: string;
  teamName?: string;
  designFileUrl: string;
  thumbnailUrl?: string;
  moderationStatus: ModerationStatus;
  voteCount: number;
  createdAt: string;
}

interface SubmissionFormState {
  submitterName: string;
  submitterEmail: string;
  designFile: File | null;
}

const voteStorageKey = "rvr-45th-kit-design-votes";

const initialFormState: SubmissionFormState = {
  submitterName: "",
  submitterEmail: "",
  designFile: null,
};

const initialSubmissions: KitDesignSubmissionView[] = [
  {
    id: "navy-sash-1981",
    campaignId: "rvr-45th-kit-2026",
    submitterName: "Ava Murphy",
    submitterEmail: "ava@example.com",
    teamName: "Junior Academy",
    designFileUrl:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80",
    moderationStatus: "APPROVED",
    voteCount: 86,
    createdAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "neon-hoops-2026",
    campaignId: "rvr-45th-kit-2026",
    submitterName: "Noah Walsh",
    submitterEmail: "noah@example.com",
    teamName: "Youth Competitive",
    designFileUrl:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80",
    moderationStatus: "APPROVED",
    voteCount: 74,
    createdAt: "2026-02-03T13:30:00.000Z",
  },
  {
    id: "ridgewood-night",
    campaignId: "rvr-45th-kit-2026",
    submitterName: "Sophie Byrne",
    submitterEmail: "sophie@example.com",
    teamName: "Girls and Women",
    designFileUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80",
    moderationStatus: "APPROVED",
    voteCount: 69,
    createdAt: "2026-02-05T18:45:00.000Z",
  },
];

function getStoredVotes() {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(voteStorageKey);
    const parsed = stored ? (JSON.parse(stored) as unknown) : [];
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function saveStoredVotes(voteIds: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(voteStorageKey, JSON.stringify(voteIds));
}

function isValidUpload(file: File) {
  return file.type.startsWith("image/") || file.type === "application/pdf";
}

export default function KitCompetition() {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [form, setForm] = useState<SubmissionFormState>(initialFormState);
  const [votedSubmissionIds, setVotedSubmissionIds] = useState<string[]>(() =>
    getStoredVotes(),
  );
  const [formMessage, setFormMessage] = useState("");

  const approvedSubmissions = useMemo(
    () =>
      submissions.filter(
        (submission) => submission.moderationStatus === "APPROVED",
      ),
    [submissions],
  );

  const updateForm = <Key extends keyof SubmissionFormState>(
    key: Key,
    value: SubmissionFormState[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFormMessage("");
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      updateForm("designFile", null);
      return;
    }

    if (!isValidUpload(file)) {
      updateForm("designFile", null);
      setFormMessage("Upload an image or PDF design file.");
      event.target.value = "";
      return;
    }

    updateForm("designFile", file);
  };

  const submitDesign = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.submitterName.trim().length < 2) {
      setFormMessage("Enter the submitter name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.submitterEmail.trim())) {
      setFormMessage("Enter a valid submitter email.");
      return;
    }

    if (!form.designFile) {
      setFormMessage("Choose a design file before submitting.");
      return;
    }

    const isImage = form.designFile.type.startsWith("image/");
    const designFileUrl = URL.createObjectURL(form.designFile);
    const nextSubmission: KitDesignSubmissionView = {
      id: `local-${Date.now()}`,
      campaignId: "rvr-45th-kit-2026",
      submitterName: form.submitterName.trim(),
      submitterEmail: form.submitterEmail.trim(),
      designFileUrl,
      thumbnailUrl: isImage ? designFileUrl : undefined,
      moderationStatus: "APPROVED",
      voteCount: 0,
      createdAt: new Date().toISOString(),
    };

    setSubmissions((current) => [nextSubmission, ...current]);
    setForm(initialFormState);
    setFormMessage("Entry added to the local gallery preview.");
  };

  const voteForSubmission = (submissionId: string) => {
    if (votedSubmissionIds.includes(submissionId)) return;

    const nextVotes = [...votedSubmissionIds, submissionId];
    setVotedSubmissionIds(nextVotes);
    saveStoredVotes(nextVotes);
    setSubmissions((current) =>
      current.map((submission) =>
        submission.id === submissionId
          ? { ...submission, voteCount: submission.voteCount + 1 }
          : submission,
      ),
    );
  };

  return (
    <section className="bg-brand-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border-4 border-white bg-brand-navy p-6 shadow-[6px_6px_0_#85E320] sm:p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-white bg-brand-neon shadow-[3px_3px_0_#FFFFFF]">
              <Shirt className="h-7 w-7 text-brand-charcoal" aria-hidden="true" />
            </div>
            <p className="font-display text-xs font-black uppercase text-brand-neon">
              45th Anniversary Kit Design Competition
            </p>
            <h1 className="mt-3 font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl lg:text-7xl">
              Design the 1981-2026 milestone shirt.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-white/85">
              Download the standard template, build a clean concept, and submit
              the finished image or PDF for the community vote.
            </p>
            <a
              href="/downloads/rvr-45th-kit-template.pdf"
              className="btn-brutalist-neon mt-7 inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 text-sm"
            >
              <Download className="h-5 w-5" aria-hidden="true" />
              Download Kit Template
            </a>
          </div>

          <form
            onSubmit={submitDesign}
            className="rounded-[2rem] border-4 border-white bg-white p-6 text-brand-charcoal shadow-[6px_6px_0_#85E320] sm:p-8"
          >
            <p className="font-display text-xs font-black uppercase text-brand-green">
              Submit an entry
            </p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase leading-tight">
              Upload your concept.
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-black uppercase">
                Submitter Name
                <span className="relative">
                  <UserRound
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-green"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={form.submitterName}
                    onChange={(event) =>
                      updateForm("submitterName", event.target.value)
                    }
                    placeholder="Enter full name"
                    className="w-full rounded-xl border-3 border-brand-charcoal bg-white px-11 py-3 font-sans text-base font-semibold normal-case outline-none placeholder:text-zinc-400 focus:ring-4 focus:ring-brand-neon"
                  />
                </span>
              </label>

              <label className="grid gap-2 text-sm font-black uppercase">
                Submitter Email
                <span className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-green"
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    value={form.submitterEmail}
                    onChange={(event) =>
                      updateForm("submitterEmail", event.target.value)
                    }
                    placeholder="name@example.com"
                    className="w-full rounded-xl border-3 border-brand-charcoal bg-white px-11 py-3 font-sans text-base font-semibold normal-case outline-none placeholder:text-zinc-400 focus:ring-4 focus:ring-brand-neon"
                  />
                </span>
              </label>
            </div>

            <label className="mt-5 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-4 border-dashed border-brand-navy bg-brand-cream p-6 text-center transition hover:bg-[#f1ffe1]">
              <FileUp className="h-10 w-10 text-brand-green" aria-hidden="true" />
              <span className="mt-4 font-display text-xl font-black uppercase">
                Choose image or PDF file
              </span>
              <span className="mt-2 text-sm font-semibold text-zinc-600">
                Image and PDF entries are accepted.
              </span>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="sr-only"
              />
              {form.designFile && (
                <span className="mt-4 rounded-full border-2 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase">
                  {form.designFile.name}
                </span>
              )}
            </label>

            {formMessage && (
              <p className="mt-4 rounded-xl border-3 border-brand-charcoal bg-[#f1ffe1] px-4 py-3 text-sm font-bold">
                {formMessage}
              </p>
            )}

            <button
              type="submit"
              className="btn-brutalist-green mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 px-6 py-3 text-sm"
            >
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              Submit Design
            </button>
          </form>
        </div>

        <div className="mt-10 rounded-[2rem] border-4 border-white bg-white p-5 text-brand-charcoal shadow-[6px_6px_0_#85E320] sm:p-8">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-xs font-black uppercase text-brand-green">
                Community vote
              </p>
              <h2 className="mt-2 font-display text-3xl font-black uppercase leading-tight sm:text-5xl">
                Submitted concepts
              </h2>
            </div>
            <p className="max-w-md text-sm font-semibold leading-6 text-zinc-700">
              Voting is limited to one vote per design in this browser.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {approvedSubmissions.map((submission) => {
              const hasVoted = votedSubmissionIds.includes(submission.id);

              return (
                <article
                  key={submission.id}
                  className="overflow-hidden rounded-2xl border-4 border-brand-navy bg-brand-cream shadow-[6px_6px_0_#0B1F3B]"
                >
                  <div className="flex aspect-[4/3] items-center justify-center border-b-4 border-brand-navy bg-white">
                    {submission.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={submission.thumbnailUrl}
                        alt={`${submission.submitterName} kit concept`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="px-6 text-center">
                        <Trophy
                          className="mx-auto h-10 w-10 text-brand-green"
                          aria-hidden="true"
                        />
                        <p className="mt-3 font-display text-2xl font-black uppercase text-brand-navy">
                          PDF Entry
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="font-display text-xs font-black uppercase text-brand-green">
                      {submission.teamName ?? "Open entry"}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-black uppercase leading-tight text-brand-navy">
                      {submission.submitterName}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-zinc-600">
                      Submitted for the 45th anniversary shirt vote.
                    </p>
                    <button
                      type="button"
                      onClick={() => voteForSubmission(submission.id)}
                      disabled={hasVoted}
                      className={`mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-3 border-brand-charcoal px-5 py-3 font-display text-sm font-black uppercase shadow-[4px_4px_0_#121212] transition ${
                        hasVoted
                          ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
                          : "bg-brand-neon text-brand-charcoal hover:-translate-y-0.5"
                      }`}
                    >
                      <Vote className="h-4 w-4" aria-hidden="true" />
                      {hasVoted
                        ? "Vote counted"
                        : `Vote (${submission.voteCount})`}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

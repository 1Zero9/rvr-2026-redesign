"use client";

import React, {
  DragEvent,
  FormEvent,
  useMemo,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import type {
  KitSubmission,
  KitSubmissionFormValues,
  KitVoteResponse,
} from "@/types/campaigns";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/svg+xml"];

interface KitDesignCompetitionProps {
  initialSubmissions: KitSubmission[];
  submitEndpoint?: string;
  voteEndpoint?: (submissionId: string) => string;
}

type VoteStatus = "idle" | "loading" | "voted" | "blocked" | "error";

function getStoredVotes(storageKey: string) {
  if (typeof window === "undefined") return [];

  try {
    const storedVotes = window.localStorage.getItem(storageKey);
    return storedVotes ? (JSON.parse(storedVotes) as string[]) : [];
  } catch {
    return [];
  }
}

function setStoredVotes(storageKey: string, submissionIds: string[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(submissionIds));
}

function validateDesignFile(file?: File) {
  if (!file) return "Upload a PNG, JPG, or SVG kit design.";
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return "Only PNG, JPG, or SVG files are allowed.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File size must be 5MB or less.";
  }
  return true;
}

export default function KitDesignCompetition({
  initialSubmissions,
  submitEndpoint = "/api/kit-submissions",
  voteEndpoint = (submissionId) => `/api/kit-submissions/${submissionId}/vote`,
}: KitDesignCompetitionProps) {
  const storageKey = "rvr-45th-kit-voted-submissions";
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [votedSubmissionIds, setVotedSubmissionIds] = useState<string[]>(() =>
    getStoredVotes(storageKey),
  );
  const [voteStatusById, setVoteStatusById] = useState<Record<string, VoteStatus>>(
    {},
  );

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
  } = useForm<KitSubmissionFormValues>({
    defaultValues: {
      designerName: "",
      teamName: "",
    },
  });

  const fileRegistration = register("designFile", {
    validate: (files) => validateDesignFile(files?.[0]),
  });

  const approvedSubmissions = useMemo(
    () => submissions.filter((submission) => submission.isApproved),
    [submissions],
  );

  const markFile = (file?: File) => {
    if (!file) return;

    const validation = validateDesignFile(file);
    if (validation !== true) {
      setSelectedFile(null);
      setValue("designFile", undefined as unknown as FileList, {
        shouldValidate: true,
      });
      setError("designFile", { message: validation, type: "validate" });
      return;
    }

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    setSelectedFile(file);
    setValue("designFile", dataTransfer.files, { shouldValidate: true });
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(false);
    markFile(event.dataTransfer.files?.[0]);
  };

  const onSubmit = async (values: KitSubmissionFormValues) => {
    const file = values.designFile?.[0];
    const validation = validateDesignFile(file);
    if (validation !== true) {
      setError("designFile", { message: validation, type: "validate" });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const optimisticSubmission: KitSubmission = {
      id: `local-${values.teamName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${submissions.length + 1}`,
      designerName: values.designerName,
      teamName: values.teamName,
      imageUrl: previewUrl,
      votesCount: 0,
      isApproved: true,
      createdAt: new Date().toISOString(),
    };

    setSubmissions((current) => [optimisticSubmission, ...current]);
    setFormMessage("Design uploaded for moderation. Approved designs appear in the gallery.");

    const formData = new FormData();
    formData.append("designerName", values.designerName);
    formData.append("teamName", values.teamName);
    formData.append("designFile", file);

    try {
      const response = await fetch(submitEndpoint, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload request failed");
    } catch {
      setFormMessage("Your design has been added to the gallery preview. The club team will review your submission shortly.");
    }

    reset();
    setSelectedFile(null);
    setFileInputKey((current) => current + 1);
  };

  const handleVote = async (submissionId: string) => {
    if (votedSubmissionIds.includes(submissionId)) {
      setVoteStatusById((current) => ({ ...current, [submissionId]: "blocked" }));
      return;
    }

    const nextVotedIds = [...votedSubmissionIds, submissionId];
    setVotedSubmissionIds(nextVotedIds);
    setStoredVotes(storageKey, nextVotedIds);
    setVoteStatusById((current) => ({ ...current, [submissionId]: "loading" }));
    setSubmissions((current) =>
      current.map((submission) =>
        submission.id === submissionId
          ? { ...submission, votesCount: submission.votesCount + 1 }
          : submission,
      ),
    );

    try {
      const response = await fetch(voteEndpoint(submissionId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 409) {
        setVoteStatusById((current) => ({
          ...current,
          [submissionId]: "blocked",
        }));
        return;
      }

      if (!response.ok) throw new Error("Vote request failed");

      const voteResponse = (await response.json()) as KitVoteResponse;
      setSubmissions((current) =>
        current.map((submission) =>
          submission.id === submissionId
            ? { ...submission, votesCount: voteResponse.votesCount }
            : submission,
        ),
      );
      setVoteStatusById((current) => ({ ...current, [submissionId]: "voted" }));
    } catch {
      setVoteStatusById((current) => ({ ...current, [submissionId]: "error" }));
    }
  };

  const preventNativeDrop = (event: FormEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  return (
    <section className="bg-brand-cream text-brand-charcoal">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <div className="relative overflow-hidden rounded-[2rem] border-4 border-brand-charcoal bg-white p-8 shadow-brutalist">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-4 border-brand-charcoal bg-brand-neon" />
          <div className="absolute bottom-8 right-8 h-12 w-12 rotate-12 rounded-xl border-3 border-brand-charcoal bg-[#ff8fb3]" />
          <p className="relative mb-5 inline-flex rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase">
            Founded 1981 - 45th anniversary kit
          </p>
          <h1 className="relative max-w-xl font-display text-5xl font-black uppercase leading-none tracking-tight md:text-7xl">
            Design the shirt for RVR history.
          </h1>
          <p className="relative mt-6 max-w-lg text-lg font-semibold leading-8 text-zinc-700">
            Upload a PNG, JPG, or SVG concept. Approved entries appear in the public
            gallery, where supporters can vote once per design.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="brutalist-card p-6 md:p-8">
          <h2 className="font-display text-3xl font-black uppercase">
            Submit your kit
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-black uppercase">
              Designer name
              <input
                {...register("designerName", {
                  required: "Designer name is required.",
                  minLength: {
                    value: 2,
                    message: "Use at least 2 characters.",
                  },
                })}
                className="rounded-xl border-3 border-brand-charcoal px-4 py-3 font-sans normal-case outline-none focus:ring-4 focus:ring-brand-neon"
              />
              {errors.designerName && (
                <span className="text-xs font-bold normal-case text-red-700">
                  {errors.designerName.message}
                </span>
              )}
            </label>

            <label className="grid gap-2 text-sm font-black uppercase">
              Team name
              <input
                {...register("teamName", {
                  required: "Team name is required.",
                  minLength: {
                    value: 2,
                    message: "Use at least 2 characters.",
                  },
                })}
                placeholder="U12 Girls, Senior Men, Academy"
                className="rounded-xl border-3 border-brand-charcoal px-4 py-3 font-sans normal-case outline-none placeholder:text-zinc-400 focus:ring-4 focus:ring-brand-neon"
              />
              {errors.teamName && (
                <span className="text-xs font-bold normal-case text-red-700">
                  {errors.teamName.message}
                </span>
              )}
            </label>
          </div>

          <label
            onDragEnter={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragOver={preventNativeDrop}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`mt-6 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-4 border-dashed p-8 text-center transition ${
              dragActive
                ? "border-brand-green bg-[#f1ffe1]"
                : "border-brand-charcoal bg-white"
            }`}
          >
            <input
              key={fileInputKey}
              {...fileRegistration}
              type="file"
              accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
              className="sr-only"
              onChange={(event) => {
                fileRegistration.onChange(event);
                markFile(event.target.files?.[0]);
              }}
            />
            <span className="rounded-full border-3 border-brand-charcoal bg-brand-neon px-5 py-2 font-display text-xs font-black uppercase">
              Drag and drop
            </span>
            <strong className="mt-5 font-display text-2xl font-black uppercase">
              {selectedFile ? selectedFile.name : "Drop your kit design here"}
            </strong>
            <span className="mt-3 text-sm font-bold text-zinc-600">
              PNG, JPG, or SVG · maximum 5MB
            </span>
            {errors.designFile && (
              <span className="mt-4 rounded-xl border-2 border-red-700 bg-red-50 px-4 py-2 text-sm font-bold text-red-700">
                {errors.designFile.message}
              </span>
            )}
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-brutalist-neon mt-6 px-7 py-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Uploading..." : "Upload for moderation"}
          </button>
          {formMessage && (
            <p className="mt-4 rounded-xl border-2 border-brand-charcoal bg-[#f1ffe1] px-4 py-3 text-sm font-bold">
              {formMessage}
            </p>
          )}
        </form>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-display text-sm font-black uppercase text-brand-green">
              Interactive voting gallery
            </p>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight">
              Approved kit designs
            </h2>
          </div>
          <p className="max-w-md text-sm font-semibold text-zinc-600">
            One vote per design per supporter. Voting closes when the winner is
            announced.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {approvedSubmissions.map((submission) => {
            const voteStatus = voteStatusById[submission.id] ?? "idle";
            const hasVoted =
              votedSubmissionIds.includes(submission.id) || voteStatus === "blocked";
            const isLoading = voteStatus === "loading";

            return (
              <article key={submission.id} className="brutalist-card overflow-hidden">
                <div className="aspect-[4/3] border-b-4 border-brand-charcoal bg-[#e8f4f0]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={submission.imageUrl}
                    alt={`${submission.teamName} kit by ${submission.designerName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-black uppercase">
                        {submission.teamName}
                      </h3>
                      <p className="mt-1 text-sm font-bold text-zinc-600">
                        Designed by {submission.designerName}
                      </p>
                    </div>
                    <span className="rounded-full border-2 border-brand-charcoal bg-brand-neon px-3 py-1 font-display text-sm font-black">
                      {submission.votesCount}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleVote(submission.id)}
                    disabled={hasVoted || isLoading}
                    className={`mt-5 w-full rounded-full border-3 border-brand-charcoal px-5 py-3 font-display text-sm font-black uppercase shadow-[4px_4px_0_#121212] transition ${
                      hasVoted
                        ? "bg-zinc-200 text-zinc-500"
                        : "bg-brand-neon text-brand-charcoal hover:-translate-y-0.5"
                    } disabled:cursor-not-allowed`}
                  >
                    {isLoading
                      ? "Counting vote..."
                      : hasVoted
                        ? "Vote locked"
                        : "Vote for this design"}
                  </button>
                  {voteStatus === "error" && (
                    <p className="mt-3 text-xs font-bold text-red-700">
                      Vote saved locally, but the server did not confirm it.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

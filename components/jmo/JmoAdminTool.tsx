"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BadgeEuro,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Flag,
  Loader2,
  ShieldCheck,
  Trophy,
  WalletCards,
} from "lucide-react";

type MatchType = "u8_u9_ssg" | "u10_u11_7v7" | "friendly" | "tournament";
type ClaimStatus = "draft" | "pending" | "approved" | "paid";

interface AssignedGame {
  id: string;
  date: string;
  kickOff: string;
  ageGroup: "U7" | "U8" | "U9" | "U10" | "U11";
  homeTeam: string;
  awayTeam: string;
  venue: string;
  matchType: MatchType;
  mentor: string;
}

interface MatchReportForm {
  matchDate: string;
  homeTeam: string;
  awayTeam: string;
  finalScore: string;
  refereeNotes: string;
  fairPlayRating: number;
  matchType: MatchType;
}

interface ClaimRecord extends MatchReportForm {
  id: string;
  submittedAt: string;
  feeCents: number;
  status: ClaimStatus;
}

interface MatchFeeRate {
  label: string;
  feeCents: number;
  description: string;
  source: string;
}

const storageKey = "rvr-jmo-admin-claims";

const assignedGames: AssignedGame[] = [
  {
    id: "fixture-001",
    date: "2026-06-20",
    kickOff: "09:30",
    ageGroup: "U8",
    homeTeam: "RVR U8 Green",
    awayTeam: "Malahide United U8",
    venue: "Ward Rivervalley Astro",
    matchType: "u8_u9_ssg",
    mentor: "A. Byrne",
  },
  {
    id: "fixture-002",
    date: "2026-06-20",
    kickOff: "10:45",
    ageGroup: "U10",
    homeTeam: "RVR U10 Hoops",
    awayTeam: "Swords Celtic U10",
    venue: "Ward Rivervalley Pitch 2",
    matchType: "u10_u11_7v7",
    mentor: "M. Keane",
  },
  {
    id: "fixture-003",
    date: "2026-06-27",
    kickOff: "11:15",
    ageGroup: "U11",
    homeTeam: "RVR U11 Girls",
    awayTeam: "Portmarnock AFC U11",
    venue: "Ridgewood",
    matchType: "friendly",
    mentor: "S. Kelly",
  },
];

const matchFeeRates: Record<MatchType, MatchFeeRate> = {
  u8_u9_ssg: {
    label: "U8/U9 SSG",
    feeCents: 2200,
    description: "Small-sided game, max 20 minutes each way.",
    source: "FAI Referees Expenses Agreement 2025-27, non-11-a-side €3 + €19 urban allowance.",
  },
  u10_u11_7v7: {
    label: "U10/U11 7v7",
    feeCents: 2600,
    description: "7v7 small-sided game, max 25 minutes each way.",
    source: "FAI Referees Expenses Agreement 2025-27, non-11-a-side €7 + €19 urban allowance.",
  },
  friendly: {
    label: "Friendly",
    feeCents: 2200,
    description: "Club friendly or development game, max 20 minutes each way.",
    source: "FAI Referees Expenses Agreement 2025-27, non-11-a-side €3 + €19 urban allowance.",
  },
  tournament: {
    label: "Tournament",
    feeCents: 3100,
    description: "Tournament/festival assignment, max 30 minutes each way.",
    source: "FAI Referees Expenses Agreement 2025-27, non-11-a-side €12 + €19 urban allowance.",
  },
};

const blankReport: MatchReportForm = {
  matchDate: new Date().toISOString().slice(0, 10),
  homeTeam: "",
  awayTeam: "",
  finalScore: "",
  refereeNotes: "",
  fairPlayRating: 4,
  matchType: "u8_u9_ssg",
};

const initialReport: MatchReportForm = assignedGames[0]
  ? {
      ...blankReport,
      matchDate: assignedGames[0].date,
      homeTeam: assignedGames[0].homeTeam,
      awayTeam: assignedGames[0].awayTeam,
      matchType: assignedGames[0].matchType,
    }
  : blankReport;

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

function formatCents(cents: number) {
  return euro.format(cents / 100);
}

function loadClaims() {
  if (typeof window === "undefined") return [];

  try {
    const storedClaims = window.localStorage.getItem(storageKey);
    return storedClaims ? (JSON.parse(storedClaims) as ClaimRecord[]) : [];
  } catch {
    return [];
  }
}

function statusTone(status: ClaimStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-900";
    case "approved":
      return "bg-sky-100 text-sky-900";
    case "paid":
      return "bg-[#f1ffe1] text-brand-green";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

export default function JmoAdminTool() {
  const [claims, setClaims] = useState<ClaimRecord[]>(loadClaims);
  const [report, setReport] = useState<MatchReportForm>(initialReport);
  const [activeFixtureId, setActiveFixtureId] = useState(assignedGames[0]?.id ?? "");
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "sent">("idle");
  const [reportError, setReportError] = useState("");

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(claims));
  }, [claims]);

  const selectedRate = matchFeeRates[report.matchType];
  const totalPendingCents = claims
    .filter((claim) => claim.status === "pending")
    .reduce((total, claim) => total + claim.feeCents, 0);
  const totalApprovedCents = claims
    .filter((claim) => claim.status === "approved")
    .reduce((total, claim) => total + claim.feeCents, 0);
  const totalPaidCents = claims
    .filter((claim) => claim.status === "paid")
    .reduce((total, claim) => total + claim.feeCents, 0);

  const fairPlayLabel = useMemo(() => {
    if (report.fairPlayRating >= 5) return "Excellent sideline behaviour";
    if (report.fairPlayRating === 4) return "Good overall respect";
    if (report.fairPlayRating === 3) return "Manageable with reminders";
    return "Treasurer/coordinator review recommended";
  }, [report.fairPlayRating]);

  const selectFixture = (fixture: AssignedGame) => {
    setActiveFixtureId(fixture.id);
    setReport({
      ...report,
      matchDate: fixture.date,
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      matchType: fixture.matchType,
    });
  };

  const submitClaim = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const scorePattern = /^\d{1,2}\s?-\s?\d{1,2}$/;

    if (
      !report.matchDate ||
      !report.homeTeam.trim() ||
      !report.awayTeam.trim() ||
      !scorePattern.test(report.finalScore.trim()) ||
      !report.refereeNotes.trim()
    ) {
      setReportError("Complete the match date, teams, score and referee notes before submitting.");
      return;
    }

    setReportError("");
    setSubmitState("sending");

    const nextClaim: ClaimRecord = {
      ...report,
      id: `claim-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      feeCents: selectedRate.feeCents,
      status: "pending",
    };

    window.setTimeout(() => {
      setClaims((current) => [nextClaim, ...current]);
      setSubmitState("sent");
      setReport(initialReport);
      setActiveFixtureId(assignedGames[0]?.id ?? "");
      window.setTimeout(() => setSubmitState("idle"), 1800);
    }, 650);
  };

  const updateClaimStatus = (claimId: string, status: ClaimStatus) => {
    setClaims((current) =>
      current.map((claim) =>
        claim.id === claimId ? { ...claim, status } : claim,
      ),
    );
  };

  return (
    <section className="bg-brand-cream text-brand-charcoal">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="relative overflow-hidden rounded-[2rem] border-4 border-brand-charcoal bg-white p-8 shadow-brutalist">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-4 border-brand-charcoal bg-brand-neon" />
            <p className="relative mb-4 inline-flex items-center gap-2 rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase">
              <ShieldCheck className="h-4 w-4" />
              RVR Junior Match Officials
            </p>
            <h1 className="relative max-w-3xl font-display text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              Match reports, fees and treasurer claims in one place.
            </h1>
            <p className="relative mt-5 max-w-2xl text-base font-semibold leading-7 text-zinc-700 md:text-lg">
              Built for newly recruited JMOs aged 16+ covering U7-U11 games,
              with a single-click report and payment claim workflow.
            </p>
          </div>

          <div className="brutalist-card bg-brand-charcoal p-6 text-white">
            <p className="font-display text-xs font-black uppercase text-brand-neon">
              Claim totals
            </p>
            <div className="mt-5 grid gap-4">
              <ClaimTotal icon={<Clock3 />} label="Pending" value={totalPendingCents} />
              <ClaimTotal icon={<CheckCircle2 />} label="Approved" value={totalApprovedCents} />
              <ClaimTotal icon={<WalletCards />} label="Paid" value={totalPaidCents} />
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[390px_1fr_380px]">
          <aside className="brutalist-card h-fit p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  Schedule view
                </p>
                <h2 className="font-display text-2xl font-black uppercase">
                  Assigned games
                </h2>
              </div>
              <CalendarDays className="h-8 w-8 text-brand-green" />
            </div>

            <div className="space-y-4">
              {assignedGames.map((fixture) => {
                const active = fixture.id === activeFixtureId;

                return (
                  <button
                    key={fixture.id}
                    type="button"
                    onClick={() => selectFixture(fixture)}
                    className={`w-full rounded-2xl border-3 border-brand-charcoal p-4 text-left transition ${
                      active
                        ? "bg-brand-neon shadow-brutalist-charcoal"
                        : "bg-white hover:-translate-y-0.5 hover:shadow-brutalist-charcoal"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-lg font-black uppercase">
                          {fixture.ageGroup} · {fixture.kickOff}
                        </p>
                        <p className="mt-1 text-sm font-bold">
                          {fixture.homeTeam} vs {fixture.awayTeam}
                        </p>
                      </div>
                      <span className="rounded-full border-2 border-brand-charcoal bg-white px-2 py-1 font-display text-[10px] font-black uppercase">
                        {matchFeeRates[fixture.matchType].label}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-1 text-xs font-bold text-zinc-700">
                      <span>{new Date(fixture.date).toLocaleDateString("en-IE")}</span>
                      <span>{fixture.venue}</span>
                      <span>Mentor: {fixture.mentor}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <form noValidate onSubmit={submitClaim} className="brutalist-card p-6 md:p-8">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  Outcome reporter
                </p>
                <h2 className="font-display text-3xl font-black uppercase">
                  Submit match report
                </h2>
              </div>
              <div className="rounded-2xl border-3 border-brand-charcoal bg-[#f1ffe1] px-5 py-3">
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  Calculated fee
                </p>
                <p className="font-display text-3xl font-black">
                  {formatCents(selectedRate.feeCents)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Match date">
                <input
                  required
                  type="date"
                  value={report.matchDate}
                  onChange={(event) =>
                    setReport({ ...report, matchDate: event.target.value })
                  }
                  className="input-brutalist"
                />
              </Field>
              <Field label="Match type">
                <select
                  value={report.matchType}
                  onChange={(event) =>
                    setReport({
                      ...report,
                      matchType: event.target.value as MatchType,
                    })
                  }
                  className="input-brutalist bg-white"
                >
                  {Object.entries(matchFeeRates).map(([key, rate]) => (
                    <option key={key} value={key}>
                      {rate.label} · {formatCents(rate.feeCents)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Home team">
                <input
                  required
                  value={report.homeTeam}
                  onChange={(event) =>
                    setReport({ ...report, homeTeam: event.target.value })
                  }
                  className="input-brutalist"
                />
              </Field>
              <Field label="Away team">
                <input
                  required
                  value={report.awayTeam}
                  onChange={(event) =>
                    setReport({ ...report, awayTeam: event.target.value })
                  }
                  className="input-brutalist"
                />
              </Field>
              <Field label="Final score">
                <input
                  required
                  value={report.finalScore}
                  onChange={(event) =>
                    setReport({ ...report, finalScore: event.target.value })
                  }
                  placeholder="3-2"
                  pattern="^\\d{1,2}\\s?-\\s?\\d{1,2}$"
                  className="input-brutalist"
                />
              </Field>
              <Field label="Fair play rating">
                <div className="rounded-xl border-3 border-brand-charcoal bg-white px-4 py-3">
                  <input
                    min="1"
                    max="5"
                    type="range"
                    value={report.fairPlayRating}
                    onChange={(event) =>
                      setReport({
                        ...report,
                        fairPlayRating: Number(event.target.value),
                      })
                    }
                    className="w-full accent-brand-green"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs font-black uppercase">
                    <span>{report.fairPlayRating}/5</span>
                    <span className="text-brand-green">{fairPlayLabel}</span>
                  </div>
                </div>
              </Field>
              <Field label="Referee notes" className="md:col-span-2">
                <textarea
                  required
                  rows={5}
                  value={report.refereeNotes}
                  onChange={(event) =>
                    setReport({ ...report, refereeNotes: event.target.value })
                  }
                  placeholder="Briefly note any injuries, sideline issues, fair play moments, or mentor feedback."
                  className="input-brutalist resize-none"
                />
              </Field>
            </div>

            <div className="mt-6 rounded-2xl border-3 border-brand-charcoal bg-[#f1ffe1] p-5">
              <div className="flex items-start gap-3">
                <BadgeEuro className="mt-1 h-6 w-6 text-brand-green" />
                <div>
                  <h3 className="font-display text-lg font-black uppercase">
                    FAI-approved fee calculation
                  </h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-zinc-700">
                    {selectedRate.description} Source: {selectedRate.source}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitState === "sending"}
              className="btn-brutalist-neon mt-6 inline-flex w-full items-center justify-center gap-2 px-7 py-4 text-base disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitState === "sending" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending to treasurer queue
                </>
              ) : submitState === "sent" ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Claim submitted
                </>
              ) : (
                <>
                  <ClipboardCheck className="h-5 w-5" />
                  Submit report and claim
                </>
              )}
            </button>
            {reportError && (
              <p className="mt-4 rounded-xl border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {reportError}
              </p>
            )}
          </form>

          <aside className="brutalist-card h-fit p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  Treasurer queue
                </p>
                <h2 className="font-display text-2xl font-black uppercase">
                  Claims
                </h2>
              </div>
              <FileText className="h-8 w-8 text-brand-green" />
            </div>

            {claims.length === 0 ? (
              <div className="rounded-2xl border-3 border-dashed border-zinc-300 bg-white p-6 text-center">
                <Flag className="mx-auto h-9 w-9 text-zinc-400" />
                <p className="mt-3 text-sm font-bold text-zinc-500">
                  Submitted claims will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {claims.map((claim) => (
                  <article
                    key={claim.id}
                    className="rounded-2xl border-3 border-brand-charcoal bg-white p-4 shadow-brutalist-charcoal"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-lg font-black uppercase">
                          {claim.homeTeam}
                        </h3>
                        <p className="text-xs font-bold text-zinc-600">
                          vs {claim.awayTeam} · {claim.finalScore}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black uppercase ${statusTone(claim.status)}`}
                      >
                        {claim.status}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-display text-2xl font-black">
                        {formatCents(claim.feeCents)}
                      </span>
                      <Trophy className="h-6 w-6 text-brand-green" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <StatusButton
                        disabled={claim.status === "approved" || claim.status === "paid"}
                        onClick={() => updateClaimStatus(claim.id, "approved")}
                      >
                        Approve
                      </StatusButton>
                      <StatusButton
                        disabled={claim.status === "paid"}
                        onClick={() => updateClaimStatus(claim.id, "paid")}
                      >
                        Mark paid
                      </StatusButton>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({
  children,
  className = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={`grid gap-2 text-sm font-black uppercase ${className}`}>
      {label}
      {children}
    </label>
  );
}

function ClaimTotal({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 p-4">
      <div className="flex items-center gap-3">
        <span className="text-brand-neon [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <span className="font-display text-xl font-black text-brand-neon">
        {formatCents(value)}
      </span>
    </div>
  );
}

function StatusButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-full border-2 border-brand-charcoal bg-brand-neon px-3 py-2 font-display text-xs font-black uppercase shadow-[2px_2px_0_#121212] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
    >
      {children}
    </button>
  );
}

"use client";

import { CheckCircle2, ChevronLeft, Loader2, ShieldCheck } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type PreferredPosition =
  | "Goalkeeper"
  | "Defender"
  | "Midfielder"
  | "Forward"
  | "Flexible";

interface RecruitmentFormState {
  firstName: string;
  lastName: string;
  yearOfBirth: string;
  preferredPosition: PreferredPosition;
  guardianName: string;
  email: string;
  phoneNumber: string;
}

const currentYear = new Date().getFullYear();

const initialForm: RecruitmentFormState = {
  firstName: "",
  lastName: "",
  yearOfBirth: "",
  preferredPosition: "Flexible",
  guardianName: "",
  email: "",
  phoneNumber: "",
};

const valuePoints = [
  "FAI Club Mark Facility",
  "Full-Size Astro",
  "S&C Sessions",
  "VEO Video Analysis",
  "Specialist Goalkeeper Coaching",
];

const positions: PreferredPosition[] = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
  "Flexible",
];

function deriveAgeGroup(yearOfBirth: number) {
  const age = currentYear - yearOfBirth;
  return `U${age}`;
}

function isU7ToU12(yearOfBirth: number) {
  const age = currentYear - yearOfBirth;
  return age >= 7 && age <= 12;
}

function isMinor(yearOfBirth: number) {
  return currentYear - yearOfBirth < 18;
}

function validateStep(step: number, form: RecruitmentFormState) {
  const errors: string[] = [];
  const year = Number(form.yearOfBirth);

  if (step === 1) {
    if (form.firstName.trim().length < 2) errors.push("Enter the player first name.");
    if (form.lastName.trim().length < 2) errors.push("Enter the player last name.");
    if (!Number.isInteger(year) || year < 2008 || year > currentYear - 5) {
      errors.push("Enter a valid school-age year of birth.");
    }
  }

  if (step === 2) {
    if (Number.isInteger(year) && isMinor(year) && form.guardianName.trim().length < 2) {
      errors.push("Enter the parent or guardian name.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.push("Enter a valid email address.");
    }
    if (!/^[+\d][\d\s().-]{6,20}$/.test(form.phoneNumber.trim())) {
      errors.push("Enter a valid phone number.");
    }
  }

  return errors;
}

export default function PlayerRecruitmentForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RecruitmentFormState>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const yearOfBirth = Number(form.yearOfBirth);
  const hasValidYear = Number.isInteger(yearOfBirth);
  const ageGroup = hasValidYear ? deriveAgeGroup(yearOfBirth) : "Pending";
  const privacyLocked = hasValidYear && isU7ToU12(yearOfBirth);
  const requiresGuardian = hasValidYear && isMinor(yearOfBirth);

  const completedValuePoints = useMemo(
    () =>
      valuePoints.map((label, index) => ({
        label,
        active:
          index < 2 ||
          Boolean(form.preferredPosition) ||
          form.preferredPosition === "Goalkeeper",
      })),
    [form.preferredPosition],
  );

  const updateField = <Key extends keyof RecruitmentFormState>(
    key: Key,
    value: RecruitmentFormState[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors([]);
  };

  const goNext = () => {
    const nextErrors = validateStep(step, form);
    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStep((current) => Math.min(3, current + 1));
  };

  const goBack = () => {
    setErrors([]);
    setStep((current) => Math.max(1, current - 1));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const allErrors = [...validateStep(1, form), ...validateStep(2, form)];
    if (allErrors.length > 0) {
      setErrors(allErrors);
      setStep(allErrors.some((error) => error.includes("player")) ? 1 : 2);
      return;
    }

    setSubmitStatus("submitting");

    try {
      const response = await fetch("/api/player-recruitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          yearOfBirth,
          ageGroup,
          isPrivate: privacyLocked,
        }),
      });

      if (!response.ok) throw new Error("Recruitment submission failed");

      setSubmitStatus("success");
      setForm(initialForm);
      setStep(1);
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="mb-6 rounded-[2rem] border-4 border-brand-charcoal bg-white p-6 shadow-[6px_6px_0_#121212] sm:p-8">
        <p className="mb-4 inline-flex rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase text-brand-charcoal">
          Player recruitment
        </p>
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-brand-charcoal md:text-6xl">
          Join the team
        </h1>
        <p className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-zinc-700">
          Register interest for a player pathway with strong facilities,
          development sessions, and privacy-first youth profile protection.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border-4 border-brand-charcoal bg-white p-5 shadow-[6px_6px_0_#121212] sm:p-6">
          <div className="mb-6 grid grid-cols-3 gap-2">
            {["Player", "Contact", "Submit"].map((label, index) => {
              const itemStep = index + 1;
              const active = itemStep === step;

              return (
                <div
                  key={label}
                  className={`rounded-xl border-3 border-brand-charcoal px-3 py-2 text-center font-display text-xs font-black uppercase transition ${
                    active ? "bg-brand-neon" : "bg-brand-cream"
                  }`}
                >
                  {label}
                </div>
              );
            })}
          </div>

          {errors.length > 0 && (
            <div className="mb-5 rounded-xl border-3 border-red-700 bg-red-50 p-4">
              <ul className="space-y-1 text-sm font-bold text-red-800">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="First Name"
                value={form.firstName}
                onChange={(value) => updateField("firstName", value)}
              />
              <TextField
                label="Last Name"
                value={form.lastName}
                onChange={(value) => updateField("lastName", value)}
              />
              <TextField
                label="Year of Birth"
                type="number"
                value={form.yearOfBirth}
                onChange={(value) => updateField("yearOfBirth", value)}
              />
              <label className="grid gap-2 text-sm font-black uppercase">
                Preferred Position
                <select
                  value={form.preferredPosition}
                  onChange={(event) =>
                    updateField(
                      "preferredPosition",
                      event.target.value as PreferredPosition,
                    )
                  }
                  className="input-brutalist bg-white"
                >
                  {positions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4">
              {requiresGuardian && (
                <TextField
                  label="Parent or Guardian Name"
                  value={form.guardianName}
                  onChange={(value) => updateField("guardianName", value)}
                />
              )}
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => updateField("email", value)}
              />
              <TextField
                label="Phone Number"
                type="tel"
                value={form.phoneNumber}
                onChange={(value) => updateField("phoneNumber", value)}
              />
              {privacyLocked && (
                <div className="rounded-2xl border-3 border-brand-charcoal bg-[#f1ffe1] p-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-brand-green" />
                    <div>
                      <h2 className="font-display text-sm font-black uppercase">
                        Privacy gate active
                      </h2>
                      <p className="mt-1 text-sm font-semibold leading-6 text-zinc-700">
                        This age group is submitted as a private player profile by
                        default.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-2xl border-3 border-brand-charcoal bg-[#f1ffe1] p-5">
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  Player summary
                </p>
                <h2 className="mt-1 font-display text-2xl font-black uppercase">
                  {form.firstName || "Player"} {form.lastName}
                </h2>
                <p className="mt-2 text-sm font-bold text-zinc-700">
                  {ageGroup} · {form.preferredPosition}
                </p>
              </div>

              <div className="grid gap-3">
                {completedValuePoints.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl border-3 border-brand-charcoal bg-white p-4"
                  >
                    <CheckCircle2
                      className={`h-5 w-5 shrink-0 ${
                        item.active ? "text-brand-green" : "text-zinc-400"
                      }`}
                    />
                    <span className="text-sm font-black uppercase">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-3 border-brand-charcoal bg-white px-5 py-3 font-display text-sm font-black uppercase shadow-[4px_4px_0_#121212]"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="btn-brutalist-neon min-h-12 flex-1 px-5 py-3 text-sm"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitStatus === "submitting"}
                className="btn-brutalist-green min-h-12 flex-1 px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitStatus === "submitting" ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending
                  </span>
                ) : (
                  "Submit Interest"
                )}
              </button>
            )}
          </div>

          {submitStatus === "success" && (
            <p className="mt-5 rounded-xl border-3 border-brand-charcoal bg-[#f1ffe1] p-4 text-sm font-bold text-brand-green">
              Player interest submitted.
            </p>
          )}
          {submitStatus === "error" && (
            <p className="mt-5 rounded-xl border-3 border-red-700 bg-red-50 p-4 text-sm font-bold text-red-800">
              Submission failed. Please try again.
            </p>
          )}
        </div>

        <aside className="h-fit rounded-2xl border-4 border-brand-charcoal bg-brand-charcoal p-5 text-white shadow-[6px_6px_0_#121212] lg:sticky lg:top-28">
          <p className="font-display text-xs font-black uppercase text-brand-neon">
            Recruitment status
          </p>
          <div className="mt-5 space-y-4 text-sm font-bold">
            <StatusRow label="Age group" value={ageGroup} />
            <StatusRow
              label="Privacy"
              value={privacyLocked ? "Private" : "Standard"}
            />
            <StatusRow label="Position" value={form.preferredPosition} />
          </div>
          <p className="mt-5 rounded-xl border border-white/20 bg-white/10 p-4 text-xs font-semibold leading-5 text-zinc-200">
            Youth privacy settings are enforced before the profile reaches the
            player card system.
          </p>
        </aside>
      </form>
    </section>
  );
}

function TextField({
  label,
  onChange,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-black uppercase">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-brutalist"
      />
    </label>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-3">
      <span className="text-zinc-300">{label}</span>
      <span className="font-display font-black uppercase text-brand-neon">
        {value}
      </span>
    </div>
  );
}

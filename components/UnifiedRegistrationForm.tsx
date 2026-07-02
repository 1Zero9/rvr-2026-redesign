"use client";

import {
  CheckCircle2,
  Plus,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type PreferredFoot = "Right" | "Left" | "Either";
type PlayingLevel = "New Player" | "Academy" | "Competitive" | "Senior";

interface PlayerRegistration {
  id: string;
  firstName: string;
  lastName: string;
  yearOfBirth: string;
  preferredFoot: PreferredFoot;
  playingLevel: PlayingLevel;
  medicalNotes: string;
  isPrivate: boolean;
}

interface GuardianDetails {
  guardianName: string;
  email: string;
  phone: string;
}

interface UnifiedRegistrationPayload {
  guardian: GuardianDetails;
  players: Array<
    Omit<PlayerRegistration, "yearOfBirth"> & {
      yearOfBirth: number | null;
      ageGroup: string;
    }
  >;
  familyTierActive: boolean;
}

const currentYear = new Date().getFullYear();
const minimumYearOfBirth = currentYear - 19;
const maximumYearOfBirth = currentYear - 5;

const blankPlayer = (): PlayerRegistration => ({
  id:
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `player-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  firstName: "",
  lastName: "",
  yearOfBirth: "",
  preferredFoot: "Either",
  playingLevel: "New Player",
  medicalNotes: "",
  isPrivate: false,
});

const footOptions: PreferredFoot[] = ["Either", "Right", "Left"];
const levelOptions: PlayingLevel[] = [
  "New Player",
  "Academy",
  "Competitive",
  "Senior",
];

function getAgeFromYear(yearOfBirth: string) {
  const parsedYear = Number(yearOfBirth);

  if (!Number.isInteger(parsedYear)) return null;
  if (parsedYear < minimumYearOfBirth || parsedYear > maximumYearOfBirth) {
    return null;
  }

  return currentYear - parsedYear;
}

function getAgeGroup(yearOfBirth: string) {
  const age = getAgeFromYear(yearOfBirth);
  return age ? `U${age}` : "Pending";
}

function shouldLockProfile(yearOfBirth: string) {
  const age = getAgeFromYear(yearOfBirth);
  return Boolean(age && age >= 7 && age <= 11);
}

function getPlayerErrors(player: PlayerRegistration, index: number) {
  const errors: string[] = [];
  const playerLabel = `Player ${index + 1}`;

  if (player.firstName.trim().length < 2) {
    errors.push(`${playerLabel}: enter a first name.`);
  }

  if (player.lastName.trim().length < 2) {
    errors.push(`${playerLabel}: enter a last name.`);
  }

  if (getAgeFromYear(player.yearOfBirth) === null) {
    errors.push(
      `${playerLabel}: enter a year of birth between ${minimumYearOfBirth} and ${maximumYearOfBirth}.`,
    );
  }

  return errors;
}

function getGuardianErrors(guardian: GuardianDetails) {
  const errors: string[] = [];

  if (guardian.guardianName.trim().length < 2) {
    errors.push("Enter the parent or guardian name.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guardian.email.trim())) {
    errors.push("Enter a valid email address.");
  }

  if (!/^[+\d][\d\s().-]{6,20}$/.test(guardian.phone.trim())) {
    errors.push("Enter a valid phone number.");
  }

  return errors;
}

export default function UnifiedRegistrationForm() {
  const [guardian, setGuardian] = useState<GuardianDetails>({
    guardianName: "",
    email: "",
    phone: "",
  });
  const [players, setPlayers] = useState<PlayerRegistration[]>([blankPlayer()]);
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "ready" | "submitted">("idle");

  const familyTierActive = players.length > 1;

  const enrichedPlayers = useMemo(
    () =>
      players.map((player) => ({
        ...player,
        ageGroup: getAgeGroup(player.yearOfBirth),
        isPrivate: shouldLockProfile(player.yearOfBirth),
      })),
    [players],
  );

  const privateProfileCount = enrichedPlayers.filter(
    (player) => player.isPrivate,
  ).length;

  const updateGuardian = <Key extends keyof GuardianDetails>(
    key: Key,
    value: GuardianDetails[Key],
  ) => {
    setGuardian((current) => ({ ...current, [key]: value }));
    setErrors([]);
    setStatus("idle");
  };

  const updatePlayer = <Key extends keyof PlayerRegistration>(
    playerId: string,
    key: Key,
    value: PlayerRegistration[Key],
  ) => {
    setPlayers((current) =>
      current.map((player) =>
        player.id === playerId
          ? {
              ...player,
              [key]: value,
              isPrivate:
                key === "yearOfBirth"
                  ? shouldLockProfile(String(value))
                  : player.isPrivate,
            }
          : player,
      ),
    );
    setErrors([]);
    setStatus("idle");
  };

  const addPlayer = () => {
    setPlayers((current) => [...current, blankPlayer()]);
    setErrors([]);
    setStatus("idle");
  };

  const removePlayer = (playerId: string) => {
    setPlayers((current) =>
      current.length === 1
        ? current
        : current.filter((player) => player.id !== playerId),
    );
    setErrors([]);
    setStatus("idle");
  };

  const buildPayload = (): UnifiedRegistrationPayload => ({
    guardian,
    familyTierActive,
    players: enrichedPlayers.map((player) => ({
      ...player,
      yearOfBirth: Number.isInteger(Number(player.yearOfBirth))
        ? Number(player.yearOfBirth)
        : null,
    })),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = [
      ...getGuardianErrors(guardian),
      ...players.flatMap((player, index) => getPlayerErrors(player, index)),
    ];

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      setStatus("idle");
      return;
    }

    console.info("Unified registration payload", buildPayload());
    setStatus("submitted");
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 text-brand-charcoal sm:px-6 lg:py-16">
      <div className="mb-6 rounded-[2rem] border-4 border-brand-charcoal bg-white p-6 shadow-brutalist-charcoal-lg sm:p-8">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase">
          <Users className="h-4 w-4" aria-hidden="true" />
          Unified registration
        </span>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl lg:text-6xl">
              Register every player in one session.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-zinc-700">
              Add one player or a full family roster, confirm guardian contact
              details, and keep youth profile privacy rules active from the
              first entry.
            </p>
          </div>

          {familyTierActive && (
            <div className="rounded-2xl border-3 border-brand-charcoal bg-brand-neon px-5 py-4 font-display text-sm font-black uppercase shadow-brutalist-charcoal">
              Family/Sibling Multi-Child Tier Active
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl border-4 border-brand-charcoal bg-white p-5 shadow-brutalist-charcoal-lg sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border-3 border-brand-charcoal bg-brand-neon">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  Parent or guardian
                </p>
                <h2 className="font-display text-2xl font-black uppercase">
                  Contact details
                </h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <TextField
                label="Parent or Guardian Name"
                value={guardian.guardianName}
                onChange={(value) => updateGuardian("guardianName", value)}
                placeholder="Enter full name"
              />
              <TextField
                label="Email Address"
                type="email"
                value={guardian.email}
                onChange={(value) => updateGuardian("email", value)}
                placeholder="name@example.com"
              />
              <TextField
                label="Phone Number"
                type="tel"
                value={guardian.phone}
                onChange={(value) => updateGuardian("phone", value)}
                placeholder="Enter phone number"
              />
            </div>
          </section>

          <section className="rounded-2xl border-4 border-brand-charcoal bg-white p-5 shadow-brutalist-charcoal-lg sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  Player roster
                </p>
                <h2 className="font-display text-2xl font-black uppercase">
                  Dynamic player blocks
                </h2>
              </div>
              <button
                type="button"
                onClick={addPlayer}
                className="btn-brutalist-neon inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
                Add Player
              </button>
            </div>

            <div className="space-y-5">
              {enrichedPlayers.map((player, index) => (
                <article
                  key={player.id}
                  className="rounded-2xl border-3 border-brand-charcoal bg-brand-cream p-4 shadow-brutalist-charcoal sm:p-5"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border-3 border-brand-charcoal bg-white">
                        <UserRound className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-display text-xs font-black uppercase text-brand-green">
                          Player {index + 1}
                        </p>
                        <h3 className="font-display text-xl font-black uppercase">
                          {player.firstName || player.lastName
                            ? `${player.firstName} ${player.lastName}`.trim()
                            : "New player"}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removePlayer(player.id)}
                      disabled={players.length === 1}
                      className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border-3 border-brand-charcoal bg-white shadow-[3px_3px_0_#121212] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Remove player ${index + 1}`}
                    >
                      <Trash2 className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField
                      label="First Name"
                      value={player.firstName}
                      onChange={(value) =>
                        updatePlayer(player.id, "firstName", value)
                      }
                      placeholder="Enter first name"
                    />
                    <TextField
                      label="Last Name"
                      value={player.lastName}
                      onChange={(value) =>
                        updatePlayer(player.id, "lastName", value)
                      }
                      placeholder="Enter last name"
                    />
                    <TextField
                      label="Year of Birth"
                      type="number"
                      value={player.yearOfBirth}
                      onChange={(value) =>
                        updatePlayer(player.id, "yearOfBirth", value)
                      }
                      placeholder={`${minimumYearOfBirth} to ${maximumYearOfBirth}`}
                    />
                    <SelectField
                      label="Preferred Foot"
                      value={player.preferredFoot}
                      options={footOptions}
                      onChange={(value) =>
                        updatePlayer(player.id, "preferredFoot", value)
                      }
                    />
                    <SelectField
                      label="Playing Level"
                      value={player.playingLevel}
                      options={levelOptions}
                      onChange={(value) =>
                        updatePlayer(player.id, "playingLevel", value)
                      }
                    />
                    <label className="grid gap-2 text-sm font-black uppercase md:col-span-2">
                      Medical Notes
                      <textarea
                        rows={4}
                        value={player.medicalNotes}
                        onChange={(event) =>
                          updatePlayer(
                            player.id,
                            "medicalNotes",
                            event.target.value,
                          )
                        }
                        placeholder="Enter allergies, medication notes, or access needs"
                        className="rounded-xl border-3 border-brand-charcoal bg-white px-4 py-3 font-sans text-base font-semibold normal-case outline-none placeholder:text-zinc-400 focus:ring-4 focus:ring-brand-neon"
                      />
                    </label>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <StatusBadge
                      label="Age group"
                      value={player.ageGroup}
                      active={player.ageGroup !== "Pending"}
                    />
                    <StatusBadge
                      label="Privacy status"
                      value={
                        player.isPrivate
                          ? "Private youth profile"
                          : "Standard profile"
                      }
                      active={player.isPrivate}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-brand-sky/20 bg-brand-navy p-5 text-white lg:sticky lg:top-28">
          <p className="font-display text-xs font-black uppercase text-brand-neon">
            Live registration summary
          </p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase leading-none">
            {players.length} {players.length === 1 ? "player" : "players"}
          </h2>

          <div className="mt-6 space-y-3">
            <SummaryRow
              label="Family tier"
              value={familyTierActive ? "Active" : "Single player"}
            />
            <SummaryRow
              label="Private profiles"
              value={`${privateProfileCount}`}
            />
            <SummaryRow
              label="Year range"
              value={`${minimumYearOfBirth}-${maximumYearOfBirth}`}
            />
          </div>

          {familyTierActive && (
            <div className="mt-5 rounded-2xl border-3 border-brand-neon bg-brand-neon p-4 text-brand-charcoal">
              <p className="font-display text-sm font-black uppercase">
                Family/Sibling Multi-Child Tier Active
              </p>
              <p className="mt-2 text-sm font-bold leading-6">
                Multiple player blocks are active in this registration session.
              </p>
            </div>
          )}

          <div className="mt-5 rounded-2xl border-3 border-brand-neon bg-white p-4 text-brand-charcoal">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-brand-green" />
              <p className="text-sm font-bold leading-6">
                U7 to U11 entries are automatically marked private in the
                outgoing dataset.
              </p>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="mt-5 rounded-2xl border-3 border-red-500 bg-red-50 p-4 text-red-800">
              <p className="font-display text-sm font-black uppercase">
                Check required fields
              </p>
              <ul className="mt-3 space-y-2 text-sm font-bold">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {status === "submitted" && (
            <p className="mt-5 rounded-2xl border-3 border-brand-neon bg-[#f1ffe1] p-4 text-sm font-bold text-brand-green">
              Your registration is ready. Please review and submit.
            </p>
          )}

          <button
            type="submit"
            className="btn-brutalist-neon mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 px-5 py-3 text-sm"
          >
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            Review Registration
          </button>
        </aside>
      </form>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "email" | "number" | "tel" | "text";
}) {
  return (
    <label className="grid gap-2 text-sm font-black uppercase">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-xl border-3 border-brand-charcoal bg-white px-4 py-3 font-sans text-base font-semibold normal-case outline-none placeholder:text-zinc-400 focus:ring-4 focus:ring-brand-neon"
      />
    </label>
  );
}

function SelectField<Option extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: Option;
  options: Option[];
  onChange: (value: Option) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-black uppercase">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as Option)}
        className="rounded-xl border-3 border-brand-charcoal bg-white px-4 py-3 font-sans text-base font-semibold normal-case outline-none focus:ring-4 focus:ring-brand-neon"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatusBadge({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-xl border-3 border-brand-charcoal px-4 py-3 shadow-[3px_3px_0_#121212] ${
        active ? "bg-brand-neon" : "bg-white"
      }`}
    >
      <p className="font-display text-[10px] font-black uppercase text-brand-charcoal">
        {label}
      </p>
      <p className="mt-1 font-display text-sm font-black uppercase">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/20 pb-3 text-sm font-bold">
      <span className="text-white/75">{label}</span>
      <span className="font-display font-black uppercase text-brand-neon">
        {value}
      </span>
    </div>
  );
}

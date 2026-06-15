"use client";

import React, { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FieldErrors,
  UseFormRegisterReturn,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import * as yup from "yup";

type AdultType = "parent" | "non_playing_volunteer";

interface YouthPlayer {
  fullName: string;
  yearOfBirth: number | "";
  medicalDisclosures: string;
  photoReleaseConsent: boolean;
  medicalTreatmentConsent: boolean;
  is_private: true;
}

interface FamilyPricingFormValues {
  parentCount: 1 | 2;
  adultType: AdultType;
  children: YouthPlayer[];
}

interface PricingOption {
  id: string;
  label: string;
  parentCount: 1 | 2;
  minimumChildren: number;
  exactChildren?: number;
  totalCents: number;
  coversExtraChildren: boolean;
}

interface PricingSummary {
  optionLabel: string;
  subtotalCents: number;
  totalCents: number;
  savingsCents: number;
  lineItems: Array<{
    label: string;
    amountCents: number;
  }>;
}

const individualPlayerCents = 25000;
const volunteerCents = 14000;

const familyOptions: PricingOption[] = [
  {
    id: "option-6",
    label: "Family Option 6: 2 Parents + 2+ Children",
    parentCount: 2,
    minimumChildren: 2,
    totalCents: 47500,
    coversExtraChildren: true,
  },
  {
    id: "option-4",
    label: "Family Option 4: 1 Parent + 4+ Children",
    parentCount: 1,
    minimumChildren: 4,
    totalCents: 47500,
    coversExtraChildren: true,
  },
  {
    id: "option-5",
    label: "Family Option 5: 2 Parents + 1 Child",
    parentCount: 2,
    minimumChildren: 1,
    exactChildren: 1,
    totalCents: 39500,
    coversExtraChildren: false,
  },
  {
    id: "option-3",
    label: "Family Option 3: 1 Parent + 3 Children",
    parentCount: 1,
    minimumChildren: 3,
    exactChildren: 3,
    totalCents: 41500,
    coversExtraChildren: false,
  },
  {
    id: "option-2",
    label: "Family Option 2: 1 Parent + 2 Children",
    parentCount: 1,
    minimumChildren: 2,
    exactChildren: 2,
    totalCents: 35500,
    coversExtraChildren: false,
  },
  {
    id: "option-1",
    label: "Family Option 1: 1 Parent + 1 Child",
    parentCount: 1,
    minimumChildren: 1,
    exactChildren: 1,
    totalCents: 27500,
    coversExtraChildren: false,
  },
];

const defaultChild: YouthPlayer = {
  fullName: "",
  yearOfBirth: "",
  medicalDisclosures: "",
  photoReleaseConsent: false,
  medicalTreatmentConsent: false,
  is_private: true,
};

const defaultValues: FamilyPricingFormValues = {
  parentCount: 1,
  adultType: "parent",
  children: [{ ...defaultChild }],
};

const childSchema: yup.ObjectSchema<YouthPlayer> = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Child full name is required.")
    .min(2, "Use at least 2 characters.")
    .max(80, "Name must be 80 characters or fewer."),
  yearOfBirth: yup
    .number()
    .typeError("Year of birth is required.")
    .integer("Use a four-digit birth year.")
    .min(2008, "Schoolkid registration is limited to players born 2008-2019.")
    .max(2019, "Schoolkid registration is limited to players born 2008-2019.")
    .required("Year of birth is required."),
  medicalDisclosures: yup
    .string()
    .trim()
    .max(500, "Medical disclosures must be 500 characters or fewer.")
    .defined(),
  photoReleaseConsent: yup.boolean().required(),
  medicalTreatmentConsent: yup
    .boolean()
    .oneOf([true], "Medical treatment consent is required for registration.")
    .required(),
  is_private: yup
    .boolean()
    .oneOf([true], "Youth profiles must remain private.")
    .required() as yup.Schema<true>,
});

const schema: yup.ObjectSchema<FamilyPricingFormValues> = yup.object({
  parentCount: yup
    .number()
    .oneOf([1, 2], "Choose 1 or 2 parents.")
    .required() as yup.Schema<1 | 2>,
  adultType: yup
    .mixed<AdultType>()
    .oneOf(["parent", "non_playing_volunteer"])
    .required(),
  children: yup
    .array()
    .of(childSchema)
    .min(1, "Add at least one child.")
    .max(8, "Contact the registrar for more than 8 children.")
    .required(),
});

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

function formatCents(cents: number) {
  return euro.format(cents / 100);
}

function isFilledChild(child: YouthPlayer) {
  return child.fullName.trim().length > 0 || Boolean(child.yearOfBirth);
}

function calculatePricing(values: FamilyPricingFormValues): PricingSummary {
  const children = values.children.filter(isFilledChild);
  const childCount = children.length;
  const parentCount = values.adultType === "parent" ? values.parentCount : 0;
  const volunteerCount = values.adultType === "non_playing_volunteer" ? 1 : 0;
  const subtotalCents =
    childCount * individualPlayerCents +
    parentCount * individualPlayerCents +
    volunteerCount * volunteerCents;

  const matchingOptions = familyOptions
    .filter((option) => parentCount >= option.parentCount)
    .filter((option) => childCount >= option.minimumChildren)
    .filter((option) =>
      option.exactChildren === undefined
        ? true
        : option.coversExtraChildren || childCount === option.exactChildren,
    )
    .map((option) => {
      const extraParents = parentCount - option.parentCount;
      const extraChildren = option.coversExtraChildren
        ? 0
        : childCount - option.minimumChildren;

      return {
        option,
        totalCents:
          option.totalCents +
          extraParents * individualPlayerCents +
          extraChildren * individualPlayerCents +
          volunteerCount * volunteerCents,
      };
    })
    .sort((a, b) => a.totalCents - b.totalCents);

  const best = matchingOptions[0];
  const totalCents = best ? best.totalCents : subtotalCents;
  const savingsCents = Math.max(0, subtotalCents - totalCents);

  return {
    optionLabel:
      best?.option.label ??
      (volunteerCount
        ? "Individual youth player + non-playing volunteer rate"
        : "Individual player rates"),
    subtotalCents,
    totalCents,
    savingsCents,
    lineItems: [
      ...(parentCount
        ? [
            {
              label: `${parentCount} parent${parentCount === 1 ? "" : "s"} at individual rate`,
              amountCents: parentCount * individualPlayerCents,
            },
          ]
        : []),
      ...(volunteerCount
        ? [
            {
              label: "1 non-playing volunteer",
              amountCents: volunteerCents,
            },
          ]
        : []),
      {
        label: `${childCount} youth player${childCount === 1 ? "" : "s"}`,
        amountCents: childCount * individualPlayerCents,
      },
    ],
  };
}

function fieldError(errors: FieldErrors<FamilyPricingFormValues>, path: string) {
  const segments = path.split(".");
  let current: unknown = errors;

  for (const segment of segments) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[segment];
  }

  if (!current || typeof current !== "object") return undefined;
  return (current as { message?: string }).message;
}

export default function SiblingRosterPricingSelector() {
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    register,
    setValue,
  } = useForm<FamilyPricingFormValues>({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { append, fields, remove } = useFieldArray({
    control,
    name: "children",
  });

  const watchedValues = useWatch({
    control,
    defaultValue: defaultValues,
  }) as FamilyPricingFormValues;

  const pricingSummary = useMemo(
    () => calculatePricing(watchedValues),
    [watchedValues],
  );

  const submitRoster = handleSubmit((values) => {
    const payload = {
      ...values,
      children: values.children.map((child) => ({
        ...child,
        is_private: true as const,
      })),
      pricing: calculatePricing(values),
    };

    window.localStorage.setItem(
      "rvr-sibling-roster-pricing-draft",
      JSON.stringify(payload),
    );
  });

  return (
    <section className="bg-brand-cream text-brand-charcoal">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <div className="mb-8 rounded-[2rem] border-4 border-brand-charcoal bg-white p-8 shadow-brutalist">
          <p className="mb-4 inline-flex rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase">
            Ballyboden-style family options
          </p>
          <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
            Build a sibling roster and find the best family price.
          </h1>
          <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-zinc-700">
            Add youth players born 2008-2019, capture medical disclosures and
            consent, then let the selector apply the cheapest valid family option.
          </p>
        </div>

        <form onSubmit={submitRoster} className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="brutalist-card p-6">
              <h2 className="font-display text-2xl font-black uppercase">
                Parent / adult selection
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-black uppercase">
                  Adult category
                  <select
                    {...register("adultType")}
                    className="input-brutalist bg-white"
                  >
                    <option value="parent">Parent family membership</option>
                    <option value="non_playing_volunteer">
                      Non-playing volunteer
                    </option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-black uppercase">
                  Parent count
                  <select
                    {...register("parentCount", { valueAsNumber: true })}
                    disabled={watchedValues.adultType === "non_playing_volunteer"}
                    className="input-brutalist bg-white disabled:bg-zinc-100 disabled:text-zinc-400"
                  >
                    <option value={1}>1 parent</option>
                    <option value={2}>2 parents</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="brutalist-card p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-display text-xs font-black uppercase text-brand-green">
                    Sibling builder
                  </p>
                  <h2 className="font-display text-2xl font-black uppercase">
                    Youth players
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => append({ ...defaultChild })}
                  className="btn-brutalist-neon px-5 py-2 text-sm"
                >
                  Add child
                </button>
              </div>

              <div className="mt-6 space-y-5">
                {fields.map((field, index) => {
                  const child = watchedValues.children[index] ?? defaultChild;
                  const isPrivate = child.is_private === true;

                  return (
                    <article
                      key={field.id}
                      className="rounded-2xl border-3 border-brand-charcoal bg-white p-5 shadow-[4px_4px_0_#121212]"
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-display text-xl font-black uppercase">
                            Child {index + 1}
                          </h3>
                          <p className="mt-1 text-xs font-bold text-zinc-500">
                            Private profile: {isPrivate ? "locked" : "required"}
                          </p>
                        </div>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="rounded-full border-2 border-brand-charcoal bg-white px-3 py-1 text-xs font-black uppercase"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <input
                        type="hidden"
                        {...register(`children.${index}.is_private`)}
                        value="true"
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <TextInput
                          label="Full name"
                          error={fieldError(errors, `children.${index}.fullName`)}
                          registration={register(`children.${index}.fullName`)}
                        />
                        <TextInput
                          label="Year of birth"
                          type="number"
                          error={fieldError(errors, `children.${index}.yearOfBirth`)}
                          registration={register(`children.${index}.yearOfBirth`, {
                            valueAsNumber: true,
                          })}
                        />
                        <label className="grid gap-2 text-sm font-black uppercase md:col-span-2">
                          Medical disclosures
                          <textarea
                            rows={3}
                            {...register(`children.${index}.medicalDisclosures`)}
                            className="input-brutalist resize-none"
                            placeholder="Allergies, medication, asthma, injuries, or write none."
                          />
                          {fieldError(
                            errors,
                            `children.${index}.medicalDisclosures`,
                          ) && (
                            <span className="text-xs font-bold normal-case text-red-700">
                              {fieldError(
                                errors,
                                `children.${index}.medicalDisclosures`,
                              )}
                            </span>
                          )}
                        </label>
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        <ConsentToggle
                          label="Photo release"
                          checked={Boolean(child.photoReleaseConsent)}
                          onChange={(checked) =>
                            setValue(
                              `children.${index}.photoReleaseConsent`,
                              checked,
                              { shouldValidate: true },
                            )
                          }
                        />
                        <ConsentToggle
                          label="Medical treatment"
                          checked={Boolean(child.medicalTreatmentConsent)}
                          error={fieldError(
                            errors,
                            `children.${index}.medicalTreatmentConsent`,
                          )}
                          onChange={(checked) =>
                            setValue(
                              `children.${index}.medicalTreatmentConsent`,
                              checked,
                              { shouldValidate: true },
                            )
                          }
                        />
                      </div>

                      <div className="mt-5 rounded-2xl border-3 border-brand-charcoal bg-[#f1ffe1] p-4">
                        <p className="font-display text-sm font-black uppercase text-brand-green">
                          Security guard active
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-6 text-zinc-700">
                          `is_private: true` is hard-coded for this youth profile.
                          The player profile remains locked until parent consent is
                          digitally signed and verified.
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="brutalist-card h-fit bg-brand-navy p-6 text-white lg:sticky lg:top-28">
            <p className="font-display text-xs font-black uppercase text-brand-neon">
              Live option selector
            </p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase">
              {formatCents(pricingSummary.totalCents)}
            </h2>
            <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 transition-all duration-300">
              <p className="font-display text-sm font-black uppercase text-brand-neon">
                Auto-applied
              </p>
              <p className="mt-2 text-sm font-bold leading-6">
                {pricingSummary.optionLabel}
              </p>
            </div>

            <div className="mt-6 space-y-4 text-sm font-bold">
              {pricingSummary.lineItems.map((item) => (
                <SummaryRow
                  key={item.label}
                  label={item.label}
                  value={formatCents(item.amountCents)}
                />
              ))}
              <div className="border-t border-white/20 pt-4">
                <SummaryRow
                  label="Individual subtotal"
                  value={formatCents(pricingSummary.subtotalCents)}
                />
                <SummaryRow
                  label="Sibling discount"
                  value={`-${formatCents(pricingSummary.savingsCents)}`}
                  accent
                />
              </div>
              <div className="border-t border-white/20 pt-4">
                <SummaryRow
                  label="Registration total"
                  value={formatCents(pricingSummary.totalCents)}
                  large
                  accent
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-brutalist-neon mt-6 w-full px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!isValid}
            >
              Save roster draft
            </button>
            <p className="mt-4 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-semibold leading-5 text-zinc-200">
              The final backend must recalculate the same family option before
              payment is created.
            </p>
          </aside>
        </form>
      </div>
    </section>
  );
}

function TextInput({
  error,
  label,
  registration,
  type = "text",
}: {
  error?: string;
  label: string;
  registration: UseFormRegisterReturn;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-black uppercase">
      {label}
      <input type={type} {...registration} className="input-brutalist" />
      {error && (
        <span className="text-xs font-bold normal-case text-red-700">{error}</span>
      )}
    </label>
  );
}

function ConsentToggle({
  checked,
  error,
  label,
  onChange,
}: {
  checked: boolean;
  error?: string;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border-3 border-brand-charcoal bg-[#f1ffe1] p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="font-display text-sm font-black uppercase">{label}</span>
        <button
          type="button"
          aria-pressed={checked}
          onClick={() => onChange(!checked)}
          className={`h-8 w-14 rounded-full border-3 border-brand-charcoal p-1 transition ${
            checked ? "bg-brand-green" : "bg-white"
          }`}
        >
          <span
            className={`block h-4 w-4 rounded-full bg-brand-charcoal transition ${
              checked ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>
      {error && <p className="mt-2 text-xs font-bold text-red-700">{error}</p>}
    </div>
  );
}

function SummaryRow({
  accent,
  label,
  large,
  value,
}: {
  accent?: boolean;
  label: string;
  large?: boolean;
  value: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${large ? "text-lg" : ""}`}>
      <span className="text-zinc-200">{label}</span>
      <span
        className={`font-display font-black ${
          accent ? "text-brand-neon" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

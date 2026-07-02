"use client";

import React, { useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FieldErrors,
  Path,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import * as Yup from "yup";

type Gender = "female" | "male" | "non_binary" | "prefer_not_to_say";
type PlayerStatus = "new_player" | "has_ddsl" | "has_comet" | "has_both";

interface ParentGuardianDetails {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  town: string;
  eircode: string;
  hasCometAccount: boolean;
  cometId: string;
}

interface ChildRosterItem {
  fullName: string;
  yearOfBirth: number | "";
  gender: Gender | "";
  medicalNotes: string;
  playerStatus: PlayerStatus | "";
  photoConsent: boolean;
  medicalTreatmentConsent: boolean;
  dataProtectionAgreement: boolean;
}

export interface FamilyRegistrationFormValues {
  parent: ParentGuardianDetails;
  children: ChildRosterItem[];
}

interface FamilyRegistrationWizardProps {
  submitEndpoint?: string;
}

interface PaymentSummary {
  childCount: number;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  discountLabel: string;
  lineItems: Array<{
    label: string;
    amountCents: number;
  }>;
}

const currentYear = new Date().getFullYear();
const childBasePriceCents = 25000;

const defaultChild: ChildRosterItem = {
  fullName: "",
  yearOfBirth: "",
  gender: "",
  medicalNotes: "",
  playerStatus: "",
  photoConsent: false,
  medicalTreatmentConsent: false,
  dataProtectionAgreement: false,
};

const defaultValues: FamilyRegistrationFormValues = {
  parent: {
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    town: "",
    eircode: "",
    hasCometAccount: false,
    cometId: "",
  },
  children: [{ ...defaultChild }],
};

const familyRegistrationSchema: Yup.ObjectSchema<FamilyRegistrationFormValues> =
  Yup.object({
    parent: Yup.object({
      fullName: Yup.string()
        .trim()
        .required("Parent or guardian name is required.")
        .min(2, "Enter at least 2 characters.")
        .max(80, "Name must be 80 characters or fewer."),
      email: Yup.string()
        .trim()
        .email("Enter a valid email address.")
        .required("Email is required."),
      phone: Yup.string()
        .trim()
        .required("Phone number is required.")
        .matches(
          /^[+\d][\d\s().-]{6,20}$/,
          "Enter a valid phone number.",
        ),
      addressLine1: Yup.string()
        .trim()
        .required("Address line 1 is required.")
        .max(120, "Address line 1 must be 120 characters or fewer."),
      addressLine2: Yup.string()
        .trim()
        .max(120, "Address line 2 must be 120 characters or fewer.")
        .defined(),
      town: Yup.string()
        .trim()
        .required("Town or area is required.")
        .max(80, "Town must be 80 characters or fewer."),
      eircode: Yup.string()
        .trim()
        .uppercase()
        .required("Eircode is required.")
        .matches(
          /^[A-Z0-9]{3}\s?[A-Z0-9]{4}$/,
          "Enter a valid Eircode, for example K67 A1B2.",
        ),
      hasCometAccount: Yup.boolean().required(),
      cometId: Yup.string()
        .trim()
        .when("hasCometAccount", {
          is: true,
          then: (schema) =>
            schema
              .required("COMET ID is required when you already have an account.")
              .matches(/^[A-Za-z0-9-]{5,24}$/, "Enter a valid COMET ID."),
          otherwise: (schema) => schema.max(0, "Leave COMET ID blank."),
        })
        .defined(),
    }).required(),
    children: Yup.array()
      .of(
        Yup.object({
          fullName: Yup.string()
            .trim()
            .required("Child name is required.")
            .min(2, "Enter at least 2 characters.")
            .max(80, "Name must be 80 characters or fewer."),
          yearOfBirth: Yup.number()
            .typeError("Year of birth is required.")
            .integer("Use a four-digit year.")
            .min(currentYear - 19, "Player must be 18 or younger for this flow.")
            .max(currentYear - 4, "Player must be at least 4 years old.")
            .required("Year of birth is required."),
          gender: Yup.mixed<Gender>()
            .oneOf(
              ["female", "male", "non_binary", "prefer_not_to_say"],
              "Select a gender option.",
            )
            .required("Gender is required."),
          medicalNotes: Yup.string()
            .trim()
            .max(500, "Medical notes must be 500 characters or fewer.")
            .defined(),
          playerStatus: Yup.mixed<PlayerStatus>()
            .oneOf(
              ["new_player", "has_ddsl", "has_comet", "has_both"],
              "Select DDSL/COMET player status.",
            )
            .required("Player status is required."),
          photoConsent: Yup.boolean().required(),
          medicalTreatmentConsent: Yup.boolean()
            .oneOf([true], "Medical treatment consent is required.")
            .required(),
          dataProtectionAgreement: Yup.boolean()
            .oneOf([true], "Data protection agreement is required.")
            .required(),
        }).required(),
      )
      .min(1, "Add at least one child.")
      .max(8, "Please contact the club registrar for more than 8 children.")
      .required("Add at least one child."),
  });

const stepFields: Record<number, Array<Path<FamilyRegistrationFormValues>>> = {
  1: [
    "parent.fullName",
    "parent.email",
    "parent.phone",
    "parent.addressLine1",
    "parent.addressLine2",
    "parent.town",
    "parent.eircode",
    "parent.hasCometAccount",
    "parent.cometId",
  ],
  2: ["children"],
  3: ["children"],
  4: ["parent", "children"],
};

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

function formatCents(cents: number) {
  return euro.format(cents / 100);
}

function calculateSiblingPricing(children: ChildRosterItem[]): PaymentSummary {
  const validChildren = children.filter((child) => child.fullName.trim());
  const childCount = validChildren.length;
  const subtotalCents = childCount * childBasePriceCents;

  const discountPerAdditionalChildCents = 5000;
  const discountCents =
    childCount > 1 ? (childCount - 1) * discountPerAdditionalChildCents : 0;

  return {
    childCount,
    subtotalCents,
    discountCents,
    totalCents: Math.max(0, subtotalCents - discountCents),
    discountLabel:
      childCount > 1
        ? `${childCount - 1} sibling discount${childCount > 2 ? "s" : ""} applied`
        : "Add another child to unlock sibling discount",
    lineItems: validChildren.map((child, index) => ({
      label: `${child.fullName || `Child ${index + 1}`}`,
      amountCents:
        index === 0
          ? childBasePriceCents
          : childBasePriceCents - discountPerAdditionalChildCents,
    })),
  };
}

function fieldError(errors: FieldErrors<FamilyRegistrationFormValues>, path: string) {
  const segments = path.split(".");
  let current: unknown = errors;

  for (const segment of segments) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[segment];
  }

  if (!current || typeof current !== "object") return undefined;
  return (current as { message?: string }).message;
}

export default function FamilyRegistrationWizard({
  submitEndpoint = "/api/membership/family-registration",
}: FamilyRegistrationWizardProps) {
  const [step, setStep] = useState(1);
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
    trigger,
  } = useForm<FamilyRegistrationFormValues>({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(familyRegistrationSchema),
  });

  const { append, fields, remove } = useFieldArray({
    control,
    name: "children",
  });

  const watchedChildren =
    useWatch({
      control,
      name: "children",
      defaultValue: defaultValues.children,
    });
  const hasCometAccount = Boolean(
    useWatch({
      control,
      name: "parent.hasCometAccount",
      defaultValue: defaultValues.parent.hasCometAccount,
    }),
  );
  const paymentSummary = useMemo(
    () => calculateSiblingPricing(watchedChildren),
    [watchedChildren],
  );

  const goNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((current) => Math.min(4, current + 1));
  };

  const goBack = () => setStep((current) => Math.max(1, current - 1));

  const onSubmit: SubmitHandler<FamilyRegistrationFormValues> = async (values) => {
    const payload = {
      ...values,
      pricing: calculateSiblingPricing(values.children),
    };

    try {
      const response = await fetch(submitEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Registration request failed");
      setSubmitMessage("Registration received. Our team will be in touch to confirm your membership.");
    } catch {
      setSubmitMessage("Something went wrong. Please try again or contact the club directly.");
    }
  };

  return (
    <section className="bg-brand-cream text-brand-charcoal">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <div className="mb-8 rounded-[2rem] border-4 border-brand-charcoal bg-white p-8 shadow-brutalist">
          <p className="mb-4 inline-flex rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase">
            RVR family registration
          </p>
          <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
            Register the whole family in one flow.
          </h1>
          <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-zinc-700 md:text-lg">
            Parent details, sibling roster, and GDPR permissions. Sibling
            discounts are applied automatically before checkout.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit(onSubmit)} className="brutalist-card p-6 md:p-8">
            <StepHeader currentStep={step} />

            {step === 1 && (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <TextInput
                  label="Parent / Guardian name"
                  error={fieldError(errors, "parent.fullName")}
                  registration={register("parent.fullName")}
                />
                <TextInput
                  label="Email"
                  type="email"
                  error={fieldError(errors, "parent.email")}
                  registration={register("parent.email")}
                />
                <TextInput
                  label="Phone"
                  error={fieldError(errors, "parent.phone")}
                  registration={register("parent.phone")}
                />
                <TextInput
                  label="Address line 1"
                  error={fieldError(errors, "parent.addressLine1")}
                  registration={register("parent.addressLine1")}
                />
                <TextInput
                  label="Address line 2"
                  error={fieldError(errors, "parent.addressLine2")}
                  registration={register("parent.addressLine2")}
                />
                <TextInput
                  label="Town / area"
                  error={fieldError(errors, "parent.town")}
                  registration={register("parent.town")}
                />
                <TextInput
                  label="Eircode"
                  error={fieldError(errors, "parent.eircode")}
                  registration={register("parent.eircode")}
                />
                <div className="rounded-2xl border-3 border-brand-charcoal bg-[#f1ffe1] p-4">
                  <label className="flex items-center justify-between gap-4">
                    <span className="font-display text-sm font-black uppercase">
                      Existing COMET account
                    </span>
                    <input
                      type="checkbox"
                      className="h-6 w-6 accent-brand-green"
                      {...register("parent.hasCometAccount")}
                      onChange={(event) => {
                        setValue("parent.hasCometAccount", event.target.checked, {
                          shouldValidate: true,
                        });
                        if (!event.target.checked) {
                          setValue("parent.cometId", "", { shouldValidate: true });
                        }
                      }}
                    />
                  </label>
                  <input
                    disabled={!hasCometAccount}
                    placeholder="COMET ID"
                    {...register("parent.cometId")}
                    className="mt-4 w-full rounded-xl border-3 border-brand-charcoal bg-white px-4 py-3 font-sans outline-none disabled:bg-zinc-100 disabled:text-zinc-400"
                  />
                  {fieldError(errors, "parent.cometId") && (
                    <p className="mt-2 text-xs font-bold text-red-700">
                      {fieldError(errors, "parent.cometId")}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-8 space-y-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="font-display text-2xl font-black uppercase">
                      Sibling roster
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-zinc-600">
                      Add each child who will be registered on the RVR platform.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => append({ ...defaultChild })}
                    className="btn-brutalist-neon px-5 py-2 text-sm"
                  >
                    Add child
                  </button>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-2xl border-3 border-brand-charcoal bg-white p-5 shadow-brutalist-charcoal"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-display text-lg font-black uppercase">
                        Child {index + 1}
                      </h3>
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
                        registration={register(`children.${index}.yearOfBirth`)}
                      />
                      <SelectInput
                        label="Gender"
                        error={fieldError(errors, `children.${index}.gender`)}
                        registration={register(`children.${index}.gender`)}
                        options={[
                          ["", "Select gender"],
                          ["female", "Female"],
                          ["male", "Male"],
                          ["non_binary", "Non-binary"],
                          ["prefer_not_to_say", "Prefer not to say"],
                        ]}
                      />
                      <SelectInput
                        label="DDSL / COMET status"
                        error={fieldError(errors, `children.${index}.playerStatus`)}
                        registration={register(`children.${index}.playerStatus`)}
                        options={[
                          ["", "Select status"],
                          ["new_player", "New player"],
                          ["has_ddsl", "Existing DDSL player"],
                          ["has_comet", "Existing COMET player"],
                          ["has_both", "Existing DDSL and COMET player"],
                        ]}
                      />
                      <label className="grid gap-2 text-sm font-black uppercase md:col-span-2">
                        Medical notes
                        <textarea
                          rows={3}
                          {...register(`children.${index}.medicalNotes`)}
                          className="rounded-xl border-3 border-brand-charcoal px-4 py-3 font-sans normal-case outline-none focus:ring-4 focus:ring-brand-neon"
                        />
                        {fieldError(errors, `children.${index}.medicalNotes`) && (
                          <span className="text-xs font-bold normal-case text-red-700">
                            {fieldError(errors, `children.${index}.medicalNotes`)}
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="mt-8 space-y-5">
                <h2 className="font-display text-2xl font-black uppercase">
                  GDPR and medical disclosures
                </h2>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-2xl border-3 border-brand-charcoal bg-white p-5 shadow-brutalist-charcoal"
                  >
                    <h3 className="font-display text-lg font-black uppercase">
                      {watchedChildren[index]?.fullName || `Child ${index + 1}`}
                    </h3>
                    <div className="mt-5 grid gap-3">
                      <ConsentToggle
                        label="Photo consent"
                        description="Allow RVR to use approved matchday and event photos on club channels."
                        checked={Boolean(watchedChildren[index]?.photoConsent)}
                        onChange={(checked) =>
                          setValue(`children.${index}.photoConsent`, checked, {
                            shouldValidate: true,
                          })
                        }
                      />
                      <ConsentToggle
                        label="Medical treatment consent"
                        description="Allow club officials to seek urgent treatment if a guardian cannot be reached."
                        checked={Boolean(watchedChildren[index]?.medicalTreatmentConsent)}
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
                      <ConsentToggle
                        label="Data protection agreement"
                        description="Confirm RVR may process registration data for club, league and FAI administration."
                        checked={Boolean(watchedChildren[index]?.dataProtectionAgreement)}
                        error={fieldError(
                          errors,
                          `children.${index}.dataProtectionAgreement`,
                        )}
                        onChange={(checked) =>
                          setValue(
                            `children.${index}.dataProtectionAgreement`,
                            checked,
                            { shouldValidate: true },
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="mt-8 rounded-2xl border-3 border-brand-charcoal bg-[#f1ffe1] p-6">
                <h2 className="font-display text-3xl font-black uppercase">
                  Review &amp; Submit
                </h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-zinc-700">
                  Check your sibling discount summary below before submitting your registration.
                </p>
                <div className="mt-6 space-y-3">
                  {paymentSummary.lineItems.map((item) => (
                    <SummaryRow
                      key={item.label}
                      label={item.label}
                      value={formatCents(item.amountCents)}
                    />
                  ))}
                  <div className="border-t-2 border-brand-charcoal pt-3">
                    <SummaryRow
                      label={paymentSummary.discountLabel}
                      value={`-${formatCents(paymentSummary.discountCents)}`}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {step > 1 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-full border-3 border-brand-charcoal bg-white px-7 py-3 font-display font-black uppercase shadow-brutalist-charcoal"
                >
                  Back
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="btn-brutalist-neon px-7 py-3"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-brutalist-green px-7 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Send registration"}
                </button>
              )}
            </div>

            {submitMessage && (
              <p className="mt-5 rounded-xl border-2 border-brand-charcoal bg-white px-4 py-3 text-sm font-bold">
                {submitMessage}
              </p>
            )}
          </form>

          <aside className="brutalist-card h-fit bg-brand-navy p-6 text-white lg:sticky lg:top-28">
            <p className="font-display text-xs font-black uppercase text-brand-neon">
              Live payment summary
            </p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase">
              {formatCents(paymentSummary.totalCents)}
            </h2>
            <div className="mt-6 space-y-4 text-sm font-bold">
              <SummaryRow
                label={`${paymentSummary.childCount} child${paymentSummary.childCount === 1 ? "" : "ren"}`}
                value={formatCents(paymentSummary.subtotalCents)}
                dark
              />
              <SummaryRow
                label="Sibling discount"
                value={`-${formatCents(paymentSummary.discountCents)}`}
                dark
              />
              <div className="border-t border-white/20 pt-4">
                <SummaryRow
                  label="Due before checkout"
                  value={formatCents(paymentSummary.totalCents)}
                  dark
                  large
                />
              </div>
            </div>
            <p className="mt-5 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-semibold leading-5 text-zinc-200">
              Pricing shown is an estimate. Final amounts are confirmed at secure checkout.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function StepHeader({ currentStep }: { currentStep: number }) {
  const steps = ["Guardian", "Roster", "Consent", "Payment"];

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const active = currentStep === stepNumber;
        const complete = currentStep > stepNumber;

        return (
          <div
            key={label}
            className={`rounded-2xl border-3 border-brand-charcoal px-4 py-3 font-display text-sm font-black uppercase ${
              active || complete
                ? "bg-brand-neon text-brand-charcoal shadow-brutalist-charcoal"
                : "bg-white text-zinc-500"
            }`}
          >
            Step {stepNumber}: {label}
          </div>
        );
      })}
    </div>
  );
}

function TextInput({
  label,
  registration,
  error,
  type = "text",
}: {
  label: string;
  registration: ReturnType<typeof useForm<FamilyRegistrationFormValues>>["register"] extends (
    name: infer Name,
  ) => infer Return
    ? Return
    : never;
  error?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-black uppercase">
      {label}
      <input
        type={type}
        {...registration}
        className="rounded-xl border-3 border-brand-charcoal px-4 py-3 font-sans normal-case outline-none focus:ring-4 focus:ring-brand-neon"
      />
      {error && (
        <span className="text-xs font-bold normal-case text-red-700">{error}</span>
      )}
    </label>
  );
}

function SelectInput({
  label,
  registration,
  error,
  options,
}: {
  label: string;
  registration: ReturnType<typeof useForm<FamilyRegistrationFormValues>>["register"] extends (
    name: infer Name,
  ) => infer Return
    ? Return
    : never;
  error?: string;
  options: Array<[string, string]>;
}) {
  return (
    <label className="grid gap-2 text-sm font-black uppercase">
      {label}
      <select
        {...registration}
        className="rounded-xl border-3 border-brand-charcoal bg-white px-4 py-3 font-sans normal-case outline-none focus:ring-4 focus:ring-brand-neon"
      >
        {options.map(([value, text]) => (
          <option key={value || text} value={value}>
            {text}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs font-bold normal-case text-red-700">{error}</span>
      )}
    </label>
  );
}

function ConsentToggle({
  checked,
  description,
  error,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  error?: string;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border-3 border-brand-charcoal bg-[#f1ffe1] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-display text-base font-black uppercase">{label}</h4>
          <p className="mt-1 text-sm font-semibold leading-6 text-zinc-700">
            {description}
          </p>
        </div>
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
  dark,
  label,
  large,
  value,
}: {
  dark?: boolean;
  label: string;
  large?: boolean;
  value: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${large ? "text-lg" : ""}`}>
      <span className={dark ? "text-zinc-200" : "font-bold text-zinc-700"}>
        {label}
      </span>
      <span
        className={`font-display font-black ${
          dark ? "text-brand-neon" : "text-brand-charcoal"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

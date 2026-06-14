"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type {
  DonationMeter,
  FunRunCampaign,
  FunRunParticipantInfo,
  StripeCheckoutResponse,
} from "@/types/campaigns";

interface FunRunRegistrationWizardProps {
  campaign: FunRunCampaign;
  donationEndpoint?: string;
}

const blankParticipant: FunRunParticipantInfo = {
  participantFirstName: "",
  participantLastName: "",
  participantAge: "",
  guardianName: "",
  guardianEmail: "",
  guardianPhone: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  medicalNotes: "",
  consentToPhotography: false,
  marketingConsent: false,
};

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function formatCents(cents: number) {
  return euro.format(cents / 100);
}

export default function FunRunRegistrationWizard({
  campaign,
  donationEndpoint,
}: FunRunRegistrationWizardProps) {
  const [step, setStep] = useState(1);
  const [participant, setParticipant] = useState(blankParticipant);
  const [merchSelections, setMerchSelections] = useState<Record<string, number>>({});
  const [checkout, setCheckout] = useState<StripeCheckoutResponse | null>(null);
  const [donationMeter, setDonationMeter] = useState<DonationMeter>({
    provider: campaign.provider,
    campaignUrl: campaign.providerCampaignUrl,
    targetAmountCents: campaign.targetAmountCents,
    raisedAmountCents: campaign.raisedAmountCents,
  });

  useEffect(() => {
    if (!donationEndpoint) return;
    const endpoint = donationEndpoint;

    async function loadDonationProgress() {
      const response = await fetch(endpoint);
      if (!response.ok) return;
      const progress = (await response.json()) as DonationMeter;
      setDonationMeter(progress);
    }

    loadDonationProgress().catch(() => undefined);
  }, [donationEndpoint]);

  const merchTotal = useMemo(
    () =>
      campaign.merchItems.reduce((total, item) => {
        return total + (merchSelections[item.id] ?? 0) * item.priceCents;
      }, 0),
    [campaign.merchItems, merchSelections],
  );

  const total = campaign.registrationFeeCents + merchTotal;
  const progress = Math.min(
    100,
    Math.round((donationMeter.raisedAmountCents / donationMeter.targetAmountCents) * 100),
  );

  const submitParticipant = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep(2);
  };

  const createCheckout = () => {
    setCheckout({
      sessionId: `cs_test_rvr_${Date.now()}`,
      checkoutUrl: `/api/stripe/checkout?campaign=${campaign.id}`,
    });
    setStep(3);
  };

  return (
    <section className="bg-brand-cream text-brand-charcoal">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="relative overflow-hidden rounded-[2rem] border-4 border-brand-charcoal bg-white p-8 shadow-brutalist">
            <div className="absolute right-6 top-6 hidden rounded-full border-3 border-brand-charcoal bg-[#ff8fb3] px-5 py-2 font-display text-xs font-black uppercase md:block">
              Colour Camp
            </div>
            <p className="mb-4 font-display text-sm font-black uppercase text-brand-green">
              {campaign.dateLabel} · {campaign.locationLabel}
            </p>
            <h1 className="max-w-3xl font-display text-5xl font-black uppercase leading-none tracking-tight md:text-7xl">
              Run, laugh, fund the next club project.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-zinc-700">
              Register for the RVR Colour Fun Run Camp, add bright day merch,
              then move into a secure Stripe checkout flow.
            </p>
          </div>

          <DonationMeterCard meter={donationMeter} progress={progress} />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="brutalist-card p-6 md:p-8">
            <StepTabs currentStep={step} />

            {step === 1 && (
              <form onSubmit={submitParticipant} className="mt-8 grid gap-4 md:grid-cols-2">
                <TextField
                  label="First name"
                  value={participant.participantFirstName}
                  onChange={(value) =>
                    setParticipant({ ...participant, participantFirstName: value })
                  }
                />
                <TextField
                  label="Last name"
                  value={participant.participantLastName}
                  onChange={(value) =>
                    setParticipant({ ...participant, participantLastName: value })
                  }
                />
                <TextField
                  label="Age"
                  type="number"
                  value={participant.participantAge}
                  onChange={(value) =>
                    setParticipant({ ...participant, participantAge: value })
                  }
                />
                <TextField
                  label="Guardian name"
                  value={participant.guardianName}
                  onChange={(value) =>
                    setParticipant({ ...participant, guardianName: value })
                  }
                />
                <TextField
                  label="Guardian email"
                  type="email"
                  value={participant.guardianEmail}
                  onChange={(value) =>
                    setParticipant({ ...participant, guardianEmail: value })
                  }
                />
                <TextField
                  label="Guardian phone"
                  value={participant.guardianPhone}
                  onChange={(value) =>
                    setParticipant({ ...participant, guardianPhone: value })
                  }
                />
                <TextField
                  label="Emergency contact"
                  value={participant.emergencyContactName}
                  onChange={(value) =>
                    setParticipant({ ...participant, emergencyContactName: value })
                  }
                />
                <TextField
                  label="Emergency phone"
                  value={participant.emergencyContactPhone}
                  onChange={(value) =>
                    setParticipant({ ...participant, emergencyContactPhone: value })
                  }
                />
                <label className="grid gap-2 text-sm font-black uppercase md:col-span-2">
                  Medical notes
                  <textarea
                    rows={4}
                    value={participant.medicalNotes}
                    onChange={(event) =>
                      setParticipant({
                        ...participant,
                        medicalNotes: event.target.value,
                      })
                    }
                    className="rounded-xl border-3 border-brand-charcoal px-4 py-3 font-sans normal-case outline-none focus:ring-4 focus:ring-brand-neon"
                  />
                </label>
                <label className="flex items-center gap-3 rounded-xl border-3 border-brand-charcoal bg-[#f1ffe1] px-4 py-3 text-sm font-bold md:col-span-2">
                  <input
                    type="checkbox"
                    checked={participant.consentToPhotography}
                    onChange={(event) =>
                      setParticipant({
                        ...participant,
                        consentToPhotography: event.target.checked,
                      })
                    }
                    className="h-5 w-5 accent-brand-green"
                  />
                  I consent to event photography for club channels.
                </label>
                <button className="btn-brutalist-neon mt-2 px-7 py-3 md:col-span-2">
                  Continue to merch
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="mt-8">
                <div className="grid gap-4 md:grid-cols-2">
                  {campaign.merchItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border-3 border-brand-charcoal bg-white p-5 shadow-[4px_4px_0_#121212]"
                    >
                      <h3 className="font-display text-xl font-black uppercase">
                        {item.name}
                      </h3>
                      <p className="mt-2 min-h-12 text-sm font-semibold text-zinc-600">
                        {item.description}
                      </p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="font-display text-2xl font-black">
                          {formatCents(item.priceCents)}
                        </span>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={merchSelections[item.id] ?? 0}
                          onChange={(event) =>
                            setMerchSelections({
                              ...merchSelections,
                              [item.id]: Number(event.target.value),
                            })
                          }
                          className="w-20 rounded-xl border-3 border-brand-charcoal px-3 py-2 text-center font-black outline-none focus:ring-4 focus:ring-brand-neon"
                          aria-label={`${item.name} quantity`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-full border-3 border-brand-charcoal bg-white px-7 py-3 font-display font-black uppercase shadow-[4px_4px_0_#121212]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={createCheckout}
                    className="btn-brutalist-neon px-7 py-3"
                  >
                    Continue to Stripe checkout
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-8 rounded-2xl border-3 border-brand-charcoal bg-[#f1ffe1] p-6">
                <h2 className="font-display text-3xl font-black uppercase">
                  Ready for secure payment
                </h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-zinc-700">
                  The UI is wired for Stripe Checkout. Replace the mock URL with an
                  API route that creates a Checkout Session and redirects to Stripe.
                </p>
                <a
                  href={checkout?.checkoutUrl ?? "#"}
                  className="btn-brutalist-green mt-6 inline-flex px-7 py-3"
                >
                  Pay {formatCents(total)}
                </a>
              </div>
            )}
          </div>

          <aside className="brutalist-card h-fit bg-brand-charcoal p-6 text-white">
            <h2 className="font-display text-2xl font-black uppercase text-brand-neon">
              Booking summary
            </h2>
            <div className="mt-6 space-y-4 text-sm font-bold">
              <SummaryRow label="Registration" value={formatCents(campaign.registrationFeeCents)} />
              <SummaryRow label="Merch" value={formatCents(merchTotal)} />
              <div className="border-t border-white/20 pt-4">
                <SummaryRow label="Total" value={formatCents(total)} large />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function DonationMeterCard({
  meter,
  progress,
}: {
  meter: DonationMeter;
  progress: number;
}) {
  return (
    <aside className="brutalist-card h-fit bg-[#f1ffe1] p-6">
      <p className="font-display text-xs font-black uppercase text-brand-green">
        {meter.provider} campaign
      </p>
      <h2 className="mt-2 font-display text-3xl font-black uppercase">
        Donation meter
      </h2>
      <div className="mt-6">
        <div className="flex justify-between text-sm font-black uppercase">
          <span>{formatCents(meter.raisedAmountCents)} raised</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-3 h-6 overflow-hidden rounded-full border-3 border-brand-charcoal bg-white">
          <div className="h-full bg-brand-neon" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-sm font-semibold text-zinc-700">
          Target: {formatCents(meter.targetAmountCents)}
        </p>
      </div>
      {meter.campaignUrl && (
        <a
          href={meter.campaignUrl}
          className="btn-brutalist-green mt-6 inline-flex px-6 py-3 text-sm"
        >
          Donate directly
        </a>
      )}
    </aside>
  );
}

function StepTabs({ currentStep }: { currentStep: number }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {["Participant", "Merch", "Checkout"].map((label, index) => {
        const step = index + 1;
        return (
          <div
            key={label}
            className={`rounded-2xl border-3 border-brand-charcoal px-4 py-3 font-display text-sm font-black uppercase ${
              currentStep === step
                ? "bg-brand-neon text-brand-charcoal shadow-[4px_4px_0_#121212]"
                : "bg-white text-zinc-500"
            }`}
          >
            Step {step}: {label}
          </div>
        );
      })}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-black uppercase">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border-3 border-brand-charcoal px-4 py-3 font-sans normal-case outline-none focus:ring-4 focus:ring-brand-neon"
        required
      />
    </label>
  );
}

function SummaryRow({
  label,
  value,
  large,
}: {
  label: string;
  value: string;
  large?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${large ? "text-xl" : ""}`}>
      <span>{label}</span>
      <span className="font-display font-black text-brand-neon">{value}</span>
    </div>
  );
}

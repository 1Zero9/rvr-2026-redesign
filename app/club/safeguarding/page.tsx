import type { Metadata } from "next";
import Header from "@/components/Header";
import {
  ClipboardCheck,
  FileText,
  HeartHandshake,
  LockKeyhole,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Safeguarding | Rivervalley Rangers AFC",
  description:
    "Club safeguarding policy, Garda Vetting records, welfare contacts, and FAI compliance information for Rivervalley Rangers AFC.",
};

const complianceItems = [
  {
    title: "Child Safeguarding Statement",
    text: "Published welfare information, policy ownership, and review dates for all club members.",
    icon: FileText,
  },
  {
    title: "Vetting Status",
    text: "Coach and volunteer records tracked with current, pending, and expired Garda Vetting status.",
    icon: UserCheck,
  },
  {
    title: "Welfare Contacts",
    text: "Named club welfare contacts with approved public visibility for parents and guardians.",
    icon: HeartHandshake,
  },
  {
    title: "Training Records",
    text: "FAI Safeguarding 1 certificate dates maintained for all active coaching and volunteer staff.",
    icon: ClipboardCheck,
  },
];

export default function SafeguardingPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal">
      <Header />

      <main>
        {/* Page header */}
        <section className="border-b-4 border-brand-charcoal bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
            <div className="max-w-3xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                FAI Compliance
              </span>
              <h1 className="font-display text-4xl font-black uppercase italic leading-none tracking-tight md:text-6xl">
                Safeguarding and Club Welfare
              </h1>
              <p className="mt-6 text-base font-semibold leading-relaxed text-zinc-700 md:text-lg">
                A clear record of welfare standards, coach vetting, safeguarding
                training, and parent-facing protection information for
                Rivervalley Rangers AFC.
              </p>
            </div>
          </div>
        </section>

        {/* Compliance detail grid */}
        <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <div className="grid gap-6 md:grid-cols-2">
            {complianceItems.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="brutalist-card bg-white p-6"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border-3 border-brand-charcoal bg-brand-neon shadow-[3px_3px_0_#121212]">
                    <Icon className="h-6 w-6 text-brand-charcoal" aria-hidden="true" />
                  </div>
                  <h2 className="font-display text-xl font-black uppercase tracking-tight">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-700">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>

          {/* Data privacy notice */}
          <div className="mt-8 rounded-2xl border-4 border-brand-charcoal bg-brand-charcoal p-6 text-white shadow-brutalist md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-3 border-brand-neon bg-brand-neon">
                <LockKeyhole className="h-7 w-7 text-brand-charcoal" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-black uppercase text-brand-neon">
                  Private records by default
                </h2>
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-zinc-300">
                  Player medical notes, welfare case records, and individual
                  vetting dates are restricted to authorised club administrators
                  only. Public pages display approved welfare contact details and
                  general policy information.
                </p>
              </div>
            </div>
          </div>

          {/* Welfare contact CTA */}
          <div className="mt-6 rounded-2xl border-4 border-brand-green bg-[#F3FAF6] p-6">
            <p className="font-display text-sm font-black uppercase tracking-wide text-brand-green">
              Welfare Concerns
            </p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-700">
              If you have a safeguarding concern relating to a child at
              Rivervalley Rangers AFC, contact the club welfare officer directly.
              All disclosures are treated with full confidentiality.
            </p>
            <a
              href="/contact"
              className="btn-brutalist-green mt-4 inline-block px-5 py-2.5 text-sm"
            >
              Contact Welfare Officer
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  Mail,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import PublicPageShell from "@/components/layout/PublicPageShell";
import PageHeroNavy from "@/components/layout/PageHeroNavy";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Safeguarding and Child Welfare",
  description:
    "Public child welfare page for Rivervalley Rangers AFC with officer contacts, compliance documents, and online Garda Vetting guidance.",
};

const welfareOfficers = [
  {
    role: "Club Children's Officer",
    name: "Sarah Kelly",
    mailbox: "welfare" as const,
    summary:
      "First contact for child welfare questions, parent concerns, and support for young players.",
  },
  {
    role: "Designated Liaison Person",
    name: "Michael Byrne",
    mailbox: "safeguarding" as const,
    summary:
      "Lead contact for formal reporting pathways, safeguarding concerns, and statutory liaison.",
  },
];

const complianceDocuments = [
  {
    title: "Child Safeguarding Statement",
    description:
      "Mandatory public statement covering child safeguarding responsibilities and club procedures.",
    href: "/documents/child-safeguarding-statement.pdf",
  },
  {
    title: "Club Code of Conduct",
    description:
      "Expected standards for players, parents, guardians, coaches, and matchday volunteers.",
    href: "/documents/code-of-conduct.pdf",
  },
  {
    title: "Safeguarding Reporting Procedure",
    description:
      "Step-by-step guidance for raising a concern and contacting the correct welfare officer.",
    href: "/documents/safeguarding-reporting-procedure.pdf",
  },
];

const vettingSteps = [
  "Confirm your legal name, date of birth, email address, phone number, and current club role.",
  "Open the FAI Connect COMET portal and start the online Garda Vetting application.",
  "Complete every required field and upload the requested identification documents.",
  "Submit the application through COMET and monitor your email for confirmation requests.",
  "Wait for club approval before coaching, supervising, or assisting with youth players.",
];

export default function SafeguardingPage() {
  return (
    <PublicPageShell>
      {/* Under construction notice */}
      <div className="sticky top-16 z-40 bg-brand-neon border-b-3 border-brand-charcoal">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-brand-charcoal shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm font-bold text-brand-charcoal">
            <span className="font-black uppercase">Sample data only.</span>{' '}
            This page is under construction — officer names, contact details, and documents shown are placeholder content and not yet live.
          </p>
        </div>
      </div>

      <PageHeroNavy
        eyebrow={<><ShieldCheck className="h-4 w-4" aria-hidden="true" /> FAI Club Mark Charter</>}
        title="Safeguarding & Child Welfare"
        description="Named welfare contacts, mandatory compliance documents, and clear vetting steps for every coach and volunteer."
      />

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-xs font-black uppercase text-brand-green">
                Child welfare officers
              </p>
              <h2 className="site-section-heading mt-2 text-3xl sm:text-5xl">
                Direct safeguarding contacts.
              </h2>
            </div>
            <p className="max-w-md text-sm font-semibold leading-6 text-zinc-600">
              Use these officer contact details for child welfare questions,
              formal concerns, and safeguarding support.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {welfareOfficers.map((officer) => (
              <article
                key={officer.role}
                className="site-surface p-6 sm:p-7"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-white bg-brand-neon shadow-[3px_3px_0_#FFFFFF]">
                  <UserRoundCheck
                    className="h-7 w-7 text-brand-charcoal"
                    aria-hidden="true"
                  />
                </div>
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  {officer.role}
                </p>
                <h3 className="mt-2 font-display text-3xl font-black uppercase leading-none text-brand-navy">
                  {officer.name}
                </h3>
                <p className="mt-4 text-sm font-semibold leading-6 text-zinc-600">
                  {officer.summary}
                </p>
                <ContactForm mailbox={officer.mailbox} messagePlaceholder="Describe your concern or question…" />
              </article>
            ))}
          </div>
        </section>

        <section className="border-y-2 border-brand-navy/10">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  Document download matrix
                </p>
                <h2 className="mt-2 font-display text-3xl font-black uppercase leading-tight sm:text-5xl">
                  Mandatory compliance PDFs.
                </h2>
              </div>
              <p className="max-w-md text-sm font-semibold leading-6 text-zinc-700">
                Download the current public documents for child safeguarding,
                conduct standards, and reporting procedure.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {complianceDocuments.map((document) => (
                <article
                  key={document.title}
                  className="flex min-h-72 flex-col justify-between rounded-2xl border-4 border-brand-navy bg-brand-cream p-6 shadow-[6px_6px_0_#0B1F3B]"
                >
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border-3 border-brand-navy bg-brand-neon shadow-[3px_3px_0_#0B1F3B]">
                      <FileText
                        className="h-6 w-6 text-brand-charcoal"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-display text-2xl font-black uppercase leading-tight">
                      {document.title}
                    </h3>
                    <p className="mt-4 text-sm font-semibold leading-6 text-zinc-700">
                      {document.description}
                    </p>
                  </div>

                  <a
                    href={document.href}
                    className="btn-brutalist-neon mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 px-5 py-3 text-sm"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download PDF
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
          <div className="site-surface p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
              <div>
                <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-white bg-brand-neon shadow-[3px_3px_0_#FFFFFF]">
                  <ClipboardCheck
                    className="h-7 w-7 text-brand-charcoal"
                    aria-hidden="true"
                  />
                </span>
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  Online vetting guide
                </p>
                <h2 className="site-section-heading mt-2 text-3xl sm:text-5xl">
                  Apply through FAI Connect COMET.
                </h2>
                <p className="mt-4 text-sm font-semibold leading-6 text-zinc-600">
                  Volunteers must complete Garda Vetting online before working
                  with youth players.
                </p>
              </div>

              <ol className="grid gap-4">
                {vettingSteps.map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-4 rounded-2xl border-2 border-brand-navy/10 bg-brand-cream p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-3 border-brand-neon bg-brand-neon font-display text-sm font-black text-brand-charcoal">
                      {index + 1}
                    </span>
                    <span className="pt-1 text-sm font-semibold leading-6 text-zinc-700">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 rounded-2xl border-4 border-white bg-white p-5 text-brand-navy shadow-[5px_5px_0_#85E320]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-1 h-6 w-6 shrink-0 text-brand-green"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-xl font-black uppercase">
                      Approval must be confirmed before youth activity starts.
                    </h3>
                    <p className="mt-1 text-sm font-semibold leading-6 text-zinc-700">
                      The club welfare team will confirm status after the online
                      COMET application is complete.
                    </p>
                  </div>
                </div>
                <a
                  href="https://faiconnect.ie/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brutalist-green inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm"
                >
                  Open FAI Connect
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
    </PublicPageShell>
  );
}

import type { Metadata } from "next";
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Phone,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import PublicPageShell from "@/components/layout/PublicPageShell";
import PageHeroNavy from "@/components/layout/PageHeroNavy";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Safeguarding and Child Welfare",
  description:
    "Child welfare at Rivervalley Rangers AFC — confidential contact routes to our welfare officers, Garda Vetting requirements, and safeguarding documents on request.",
};

const welfareContacts = [
  {
    role: "Club Children's Officer",
    mailbox: "welfare" as const,
    summary:
      "First contact for child welfare questions, parent concerns, and support for young players. Messages go directly and confidentially to the officer.",
  },
  {
    role: "Designated Liaison Person",
    mailbox: "safeguarding" as const,
    summary:
      "Lead contact for formal reporting pathways, safeguarding concerns, and statutory liaison. Messages go directly and confidentially to the officer.",
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
      <PageHeroNavy
        eyebrow={<><ShieldCheck className="h-4 w-4" aria-hidden="true" /> FAI Club Mark Charter</>}
        title="Safeguarding & Child Welfare"
        description="Every coach and volunteer at Rivervalley Rangers is Garda Vetted. Our welfare officers can be contacted confidentially using the forms below."
      />

      {/* Emergency notice */}
      <div className="bg-brand-cream border-b border-brand-navy/10">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 flex items-start gap-3">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy" aria-hidden="true" />
          <p className="text-sm font-semibold text-brand-charcoal">
            If a child is at immediate risk, contact An Garda Síochána on{" "}
            <strong>112 or 999</strong>. Concerns can also be reported to{" "}
            <a
              href="https://www.tusla.ie/children-first/contact-a-social-worker/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-black text-brand-navy underline underline-offset-2 hover:text-brand-green"
            >
              Tusla — the Child and Family Agency
            </a>.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-xs font-black uppercase text-brand-green">
              Child welfare officers
            </p>
            <h2 className="site-section-heading mt-2 text-3xl sm:text-5xl">
              Confidential safeguarding contacts.
            </h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-6 text-zinc-600">
            Use these forms for child welfare questions, formal concerns, and
            safeguarding support. Every message goes straight to the relevant
            officer and is treated in confidence.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {welfareContacts.map((contact) => (
            <article key={contact.role} className="site-surface p-6 sm:p-7">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-white bg-brand-neon shadow-[3px_3px_0_#FFFFFF]">
                <UserRoundCheck className="h-7 w-7 text-brand-charcoal" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-black uppercase leading-none text-brand-navy sm:text-3xl">
                {contact.role}
              </h3>
              <p className="mt-4 text-sm font-semibold leading-6 text-zinc-600">
                {contact.summary}
              </p>
              <ContactForm mailbox={contact.mailbox} messagePlaceholder="Describe your concern or question…" />
            </article>
          ))}
        </div>
      </section>

      {/* Documents on request */}
      <section className="border-y-2 border-brand-navy/10">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
          <div className="site-surface flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-3 border-brand-navy bg-brand-neon shadow-mid-brutalist">
                <FileText className="h-6 w-6 text-brand-charcoal" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-black uppercase leading-tight sm:text-3xl">
                  Safeguarding documents on request.
                </h2>
                <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-zinc-600">
                  Our Child Safeguarding Statement, Code of Conduct, and Reporting
                  Procedure are available to any parent, guardian, or member —
                  request a copy from the club secretary and we&rsquo;ll send it on.
                </p>
              </div>
            </div>
            <a
              href="/contact"
              className="btn-brutalist-neon inline-flex min-h-12 shrink-0 items-center justify-center gap-2 px-5 py-3 text-sm"
            >
              Request Documents
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="site-surface p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-white bg-brand-neon shadow-[3px_3px_0_#FFFFFF]">
                <ClipboardCheck className="h-7 w-7 text-brand-charcoal" aria-hidden="true" />
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

import type { Metadata } from "next";
import Header from "@/components/Header";
import {
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileCheck2,
  FileText,
  Mail,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Safeguarding | Rivervalley Rangers AFC",
  description:
    "Public safeguarding hub for Rivervalley Rangers AFC, including welfare contacts, policy downloads, and Garda Vetting guidance.",
};

const policyDownloads = [
  {
    title: "Child Safeguarding Statement",
    description:
      "Official club statement aligned with the Children First Act 2015 and child welfare responsibilities.",
    href: "/documents/child-safeguarding-statement.pdf",
  },
  {
    title: "Code of Conduct",
    description:
      "Expected standards for coaches, players, parents, guardians, and matchday volunteers.",
    href: "/documents/code-of-conduct.pdf",
  },
  {
    title: "Reporting Procedure",
    description:
      "Clear steps for raising a concern and contacting the correct welfare officer.",
    href: "/documents/safeguarding-reporting-procedure.pdf",
  },
];

const welfareContacts = [
  {
    role: "Club Children's Officer",
    name: "Sarah Kelly",
    email: "childrensofficer@rvrafc.ie",
  },
  {
    role: "Designated Liaison Person",
    name: "Michael Byrne",
    email: "dlp@rvrafc.ie",
  },
];

const vettingSteps = [
  "Prepare your legal name, date of birth, contact details, and current club role.",
  "Open the FAI Connect COMET portal and start the online Garda Vetting application.",
  "Upload the required identification documents through the portal.",
  "Submit the application and wait for confirmation from the club welfare team.",
  "Do not coach or supervise youth players until approval is confirmed.",
];

export default function SafeguardingPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal">
      <Header />

      <main>
        <section className="border-b-4 border-brand-charcoal bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
            <div className="max-w-4xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Active Club Charter
              </span>
              <h1 className="font-display text-4xl font-black uppercase italic leading-none tracking-tight md:text-6xl">
                Rivervalley Rangers AFC maintains active safeguarding standards.
              </h1>
              <p className="mt-6 max-w-3xl text-base font-semibold leading-relaxed text-zinc-700 md:text-lg">
                This hub gives parents, guardians, coaches, and volunteers direct
                access to public welfare documents, named club contacts, and
                Garda Vetting guidance.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-display text-sm font-black uppercase text-brand-green">
                Core Policy Hub
              </p>
              <h2 className="font-display text-3xl font-black uppercase tracking-tight md:text-4xl">
                Download official documents
              </h2>
            </div>
            <p className="max-w-md text-sm font-semibold leading-relaxed text-zinc-700">
              The Child Safeguarding Statement is maintained for compliance with
              the Children First Act 2015.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {policyDownloads.map((item) => (
              <article key={item.title} className="brutalist-card bg-white p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border-3 border-brand-charcoal bg-brand-neon shadow-[3px_3px_0_#121212]">
                  <FileText className="h-6 w-6 text-brand-charcoal" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-black uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 min-h-20 text-sm font-semibold leading-relaxed text-zinc-700">
                  {item.description}
                </p>
                <a
                  href={item.href}
                  className="btn-brutalist-neon mt-5 inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-sm"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download PDF
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y-4 border-brand-charcoal bg-[#f1ffe1]">
          <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
            <div className="mb-8">
              <p className="font-display text-sm font-black uppercase text-brand-green">
                Welfare Contacts
              </p>
              <h2 className="font-display text-3xl font-black uppercase tracking-tight md:text-4xl">
                Contact a safeguarding officer
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {welfareContacts.map((contact) => (
                <article
                  key={contact.role}
                  className="rounded-2xl border-4 border-brand-charcoal bg-white p-6 shadow-[6px_6px_0_#121212]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border-3 border-brand-charcoal bg-brand-neon shadow-[3px_3px_0_#121212]">
                    <UserRoundCheck className="h-6 w-6 text-brand-charcoal" aria-hidden="true" />
                  </div>
                  <p className="font-display text-xs font-black uppercase tracking-wide text-brand-green">
                    {contact.role}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-black uppercase">
                    {contact.name}
                  </h3>
                  <a
                    href={`mailto:${contact.email}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border-3 border-brand-charcoal bg-brand-cream px-4 py-3 text-sm font-black text-brand-charcoal transition hover:bg-white"
                  >
                    <Mail className="h-4 w-4 text-brand-green" aria-hidden="true" />
                    {contact.email}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <div className="rounded-[2rem] border-4 border-brand-charcoal bg-brand-charcoal p-6 text-white shadow-brutalist md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-brand-neon bg-brand-neon">
                  <ClipboardCheck className="h-7 w-7 text-brand-charcoal" aria-hidden="true" />
                </span>
                <p className="font-display text-sm font-black uppercase text-brand-neon">
                  Garda Vetting Guide
                </p>
                <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight md:text-4xl">
                  Process applications through FAI Connect COMET.
                </h2>
                <p className="mt-4 text-sm font-semibold leading-relaxed text-zinc-300">
                  Coaches and volunteers must complete Garda Vetting online
                  before they work with youth players.
                </p>
              </div>

              <ol className="grid gap-4">
                {vettingSteps.map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-4 rounded-2xl border border-white/20 bg-white/10 p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-brand-neon bg-brand-neon font-display text-sm font-black text-brand-charcoal">
                      {index + 1}
                    </span>
                    <span className="pt-1 text-sm font-semibold leading-relaxed text-zinc-100">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 rounded-2xl border-3 border-brand-neon bg-white p-5 text-brand-charcoal">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <FileCheck2 className="mt-1 h-6 w-6 shrink-0 text-brand-green" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-xl font-black uppercase">
                      Vetting must be approved before activity starts.
                    </h3>
                    <p className="mt-1 text-sm font-semibold leading-relaxed text-zinc-700">
                      The club welfare team will confirm approval status after
                      the online application is completed.
                    </p>
                  </div>
                </div>
                <a
                  href="https://faiconnect.ie/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brutalist-green inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Open FAI Connect
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

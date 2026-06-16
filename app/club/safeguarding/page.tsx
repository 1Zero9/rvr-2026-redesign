import type { Metadata } from "next";
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  Mail,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Safeguarding and Child Welfare | Rivervalley Rangers AFC",
  description:
    "Public child welfare page for Rivervalley Rangers AFC, including safeguarding contacts, policy downloads, and Garda Vetting guidance.",
};

const welfareContacts = [
  {
    role: "Club Children's Officer",
    name: "Sarah Kelly",
    email: "childrensofficer@rvrafc.ie",
    detail:
      "First contact for child welfare queries, parent concerns, and support for young players.",
  },
  {
    role: "Designated Liaison Person",
    name: "Michael Byrne",
    email: "dlp@rvrafc.ie",
    detail:
      "Lead contact for reporting pathways, formal concerns, and liaison with statutory services.",
  },
];

const documentDownloads = [
  {
    title: "Child Safeguarding Statement",
    description:
      "Official club child safeguarding statement for parents, guardians, coaches, and volunteers.",
    href: "/documents/child-safeguarding-statement.pdf",
  },
  {
    title: "FAI Respect Code of Conduct",
    description:
      "Expected standards for players, coaches, parents, guardians, and matchday volunteers.",
    href: "/documents/code-of-conduct.pdf",
  },
  {
    title: "Safety Handbook",
    description:
      "Reporting guidance and practical safety steps for welfare concerns at club activities.",
    href: "/documents/safeguarding-reporting-procedure.pdf",
  },
];

const vettingSteps = [
  "Confirm your full legal name, date of birth, email address, phone number, and current club role.",
  "Open the FAI Connect COMET portal and start the online Garda Vetting application.",
  "Complete each online form field and upload the requested identification documents.",
  "Submit the application through COMET and monitor your email for confirmation requests.",
  "Wait for club approval before coaching, supervising, or assisting with youth players.",
];

export default function SafeguardingPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal">
      <Header />

      <main>
        <section className="border-b-4 border-brand-navy bg-brand-navy text-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
            <div className="max-w-4xl">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border-3 border-brand-navy bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase text-brand-charcoal shadow-[4px_4px_0_#FFFFFF]">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Entry-Level FAI Club Mark Awardee
              </span>
              <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl lg:text-7xl">
                Safeguarding and child welfare at Rivervalley Rangers AFC.
              </h1>
              <p className="mt-6 max-w-3xl text-base font-semibold leading-relaxed text-white/85 sm:text-lg">
                This public hub gives families, volunteers, and coaches direct
                access to named child welfare contacts, official policy
                downloads, and clear online Garda Vetting steps.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-xs font-black uppercase text-brand-green">
                Child welfare contacts
              </p>
              <h2 className="mt-2 font-display text-3xl font-black uppercase leading-tight sm:text-5xl">
                Speak to the right officer.
              </h2>
            </div>
            <p className="max-w-md text-sm font-semibold leading-6 text-zinc-700">
              Use these direct contacts for child welfare questions, concerns,
              and safeguarding support.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {welfareContacts.map((contact) => (
              <article
                key={contact.role}
                className="rounded-2xl border-4 border-brand-navy bg-white p-6 shadow-[6px_6px_0_#0B1F3B] sm:p-7"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-brand-navy bg-brand-neon shadow-[3px_3px_0_#0B1F3B]">
                  <UserRoundCheck
                    className="h-7 w-7 text-brand-charcoal"
                    aria-hidden="true"
                  />
                </div>
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  {contact.role}
                </p>
                <h3 className="mt-2 font-display text-3xl font-black uppercase leading-none text-brand-navy">
                  {contact.name}
                </h3>
                <p className="mt-4 text-sm font-semibold leading-6 text-zinc-700">
                  {contact.detail}
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border-3 border-brand-navy bg-brand-cream px-4 py-3 text-sm font-black text-brand-navy shadow-[3px_3px_0_#0B1F3B] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <Mail className="h-4 w-4 text-brand-green" aria-hidden="true" />
                  {contact.email}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y-4 border-brand-navy bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  Document downloads
                </p>
                <h2 className="mt-2 font-display text-3xl font-black uppercase leading-tight sm:text-5xl">
                  Official welfare documents.
                </h2>
              </div>
              <p className="max-w-md text-sm font-semibold leading-6 text-zinc-700">
                Download the current safeguarding statement, conduct code, and
                safety guidance for club activity.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {documentDownloads.map((item) => (
                <article
                  key={item.title}
                  className="flex min-h-72 flex-col justify-between rounded-2xl border-4 border-brand-navy bg-brand-cream p-6 shadow-[6px_6px_0_#0B1F3B]"
                >
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border-3 border-brand-navy bg-brand-neon shadow-[3px_3px_0_#0B1F3B]">
                      <FileText
                        className="h-6 w-6 text-brand-charcoal"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-display text-2xl font-black uppercase leading-tight text-brand-navy">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm font-semibold leading-6 text-zinc-700">
                      {item.description}
                    </p>
                  </div>

                  <a
                    href={item.href}
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
          <div className="rounded-[2rem] border-4 border-brand-navy bg-brand-navy p-6 text-white shadow-[6px_6px_0_#85E320] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-brand-neon bg-brand-neon shadow-[3px_3px_0_#FFFFFF]">
                  <ClipboardCheck
                    className="h-7 w-7 text-brand-charcoal"
                    aria-hidden="true"
                  />
                </span>
                <p className="font-display text-xs font-black uppercase text-brand-neon">
                  Garda Vetting guide
                </p>
                <h2 className="mt-2 font-display text-3xl font-black uppercase leading-tight sm:text-5xl">
                  Process every application online through COMET.
                </h2>
                <p className="mt-4 text-sm font-semibold leading-6 text-white/80">
                  Volunteers must complete Garda Vetting through the FAI Connect
                  COMET portal before working with youth players.
                </p>
              </div>

              <ol className="grid gap-4">
                {vettingSteps.map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-4 rounded-2xl border-3 border-white/20 bg-white/10 p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-3 border-brand-neon bg-brand-neon font-display text-sm font-black text-brand-charcoal">
                      {index + 1}
                    </span>
                    <span className="pt-1 text-sm font-semibold leading-6 text-white/90">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 rounded-2xl border-3 border-brand-neon bg-white p-5 text-brand-charcoal">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-1 h-6 w-6 shrink-0 text-brand-green"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-xl font-black uppercase text-brand-navy">
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
      </main>
    </div>
  );
}

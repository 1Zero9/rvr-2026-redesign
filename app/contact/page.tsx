import type { Metadata } from "next";
import Header from "@/components/Header";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | Rivervalley Rangers AFC",
  description:
    "Contact Rivervalley Rangers AFC — committee, coaching staff, welfare officers, and general enquiries.",
};

const contacts = [
  {
    role: "General Enquiries",
    email: "info@rvrafc.ie",
    note: "Membership, registration, and general questions.",
  },
  {
    role: "Club Secretary",
    email: "secretary@rvrafc.ie",
    note: "Committee matters, documentation, and official correspondence.",
  },
  {
    role: "Children's Welfare Officer",
    email: "childrensofficer@rvrafc.ie",
    note: "Safeguarding concerns and child welfare queries.",
  },
];

export default function ContactPage() {
  return (
    <div
      className="min-h-screen bg-brand-cream text-brand-charcoal"
      style={{
        backgroundImage: `linear-gradient(rgba(11,31,59,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(11,31,59,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    >
      <Header />

      <main>
        <section className="border-b-4 border-brand-charcoal bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase tracking-wider">
                <Mail className="h-4 w-4" aria-hidden="true" />
                Get in Touch
              </span>
              <h1 className="font-display text-4xl font-black uppercase italic leading-none tracking-tighter md:text-6xl">
                Contact Us
              </h1>
              <p className="mt-5 text-base font-semibold leading-relaxed text-zinc-600 md:text-lg">
                Reach the RVR committee, coaching staff, or welfare team.
                We aim to respond to all enquiries within two working days.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((c) => (
              <article
                key={c.email}
                className="brutalist-card flex flex-col gap-4 bg-white p-6"
              >
                <div>
                  <p className="font-display text-xs font-black uppercase tracking-wide text-brand-green">
                    {c.role}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600">
                    {c.note}
                  </p>
                </div>
                <a
                  href={`mailto:${c.email}`}
                  className="mt-auto inline-flex items-center gap-2 font-display text-sm font-black uppercase text-brand-charcoal underline-offset-4 hover:text-brand-green hover:underline"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {c.email}
                </a>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border-4 border-brand-charcoal bg-brand-charcoal p-6 text-white shadow-brutalist">
              <MapPin className="mb-4 h-6 w-6 text-brand-neon" aria-hidden="true" />
              <p className="font-display text-sm font-black uppercase tracking-wide text-brand-neon">
                Our Ground
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-300">
                Ward Rivervalley Park<br />
                Swords, Co. Dublin<br />
                D17 W2X3
              </p>
            </div>

            <div className="rounded-2xl border-4 border-brand-charcoal bg-white p-6 shadow-brutalist">
              <ShieldCheck className="mb-4 h-6 w-6 text-brand-green" aria-hidden="true" />
              <p className="font-display text-sm font-black uppercase tracking-wide text-brand-green">
                Safeguarding Concerns
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600">
                For child welfare concerns, contact our Children&apos;s Officer
                directly or visit the{" "}
                <a
                  href="/club/safeguarding"
                  className="font-black text-brand-green underline underline-offset-4"
                >
                  Safeguarding page
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

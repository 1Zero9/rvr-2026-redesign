import type { Metadata } from "next";
import PublicPageShell from "@/components/layout/PublicPageShell";
import PageHeroNavy from "@/components/layout/PageHeroNavy";
import ContactForm from "@/components/ContactForm";
import { Mail, MapPin, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Rivervalley Rangers AFC — committee, coaching staff, welfare officers, and general enquiries.",
};

const contacts: Array<{
  role: string;
  note: string;
  hint: string;
  mailbox: 'info' | 'secretary' | 'welfare';
  placeholder: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  {
    role: "General Enquiries",
    note: "Not sure where to start? Use this form.",
    hint: "Best for: joining the club, team queries, training times, pitch bookings.",
    mailbox: "info",
    placeholder: "How can we help you?",
    icon: Mail,
  },
  {
    role: "Club Secretary",
    note: "Official club business and documentation.",
    hint: "Best for: governance, formal correspondence, and committee matters.",
    mailbox: "secretary",
    placeholder: "Your message to the secretary…",
    icon: Mail,
  },
  {
    role: "Children's Welfare Officer",
    note: "Child safeguarding and welfare concerns.",
    hint: "All enquiries are treated with full confidentiality.",
    mailbox: "welfare",
    placeholder: "Please describe your concern…",
    icon: ShieldCheck,
  },
];

export default function ContactPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow={<><Mail className="h-4 w-4" aria-hidden="true" /> Get in Touch</>}
        title="Contact Us"
        description="Reach the RVR committee, coaching staff, or welfare team. We aim to respond within two working days."
      />

      <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c) => (
            <article
              key={c.mailbox}
              className="brutalist-card flex flex-col bg-white p-6"
            >
              <div className="flex items-start gap-3 mb-1">
                <c.icon className="h-4 w-4 text-brand-neon shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-display text-xs font-black uppercase tracking-wide text-brand-charcoal">
                    {c.role}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-500 font-semibold">
                    {c.note}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {c.hint}
                  </p>
                </div>
              </div>
              <ContactForm mailbox={c.mailbox} messagePlaceholder={c.placeholder} />
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
              For child welfare concerns, use the Children&apos;s Welfare Officer
              form above or visit the{" "}
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
    </PublicPageShell>
  );
}

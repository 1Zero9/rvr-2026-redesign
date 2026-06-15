import Header from "@/components/Header";
import {
  ClipboardCheck,
  FileText,
  HeartHandshake,
  LockKeyhole,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

const complianceItems = [
  {
    title: "Child Safeguarding Statement",
    text: "Published welfare information, policy ownership, and review dates for club members.",
    icon: FileText,
  },
  {
    title: "Vetting Status",
    text: "Coach and volunteer vetting records tracked as pending, approved, or expired.",
    icon: UserCheck,
  },
  {
    title: "Welfare Contacts",
    text: "Named club welfare contacts with public contact visibility for parents and guardians.",
    icon: HeartHandshake,
  },
  {
    title: "Training Records",
    text: "Safeguarding and child protection training dates maintained for active staff.",
    icon: ClipboardCheck,
  },
];

export default function SafeguardingPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal">
      <Header />
      <main>
        <section className="border-b-4 border-brand-charcoal bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase">
                <ShieldCheck className="h-4 w-4" />
                FAI Compliance
              </p>
              <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
                Safeguarding and club welfare
              </h1>
              <p className="mt-6 text-lg font-semibold leading-8 text-zinc-700">
                A clear view for welfare standards, coach vetting, safeguarding
                training, and parent-facing protection information.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <div className="grid gap-6 md:grid-cols-2">
            {complianceItems.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="brutalist-card bg-white p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border-3 border-brand-charcoal bg-brand-neon shadow-[3px_3px_0_#121212]">
                    <Icon className="h-6 w-6 text-brand-charcoal" />
                  </div>
                  <h2 className="font-display text-2xl font-black uppercase">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm font-semibold leading-6 text-zinc-700">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 rounded-[2rem] border-4 border-brand-charcoal bg-brand-charcoal p-6 text-white shadow-brutalist md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-3 border-brand-charcoal bg-brand-neon">
                <LockKeyhole className="h-7 w-7 text-brand-charcoal" />
              </div>
              <div>
                <h2 className="font-display text-3xl font-black uppercase text-brand-neon">
                  Private records by default
                </h2>
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-zinc-200">
                  Player medical notes, welfare notes, and adult vetting details
                  should remain restricted to authorised club administrators.
                  Public pages should only show approved welfare contact details
                  and policy information.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

import {
  CalendarDays,
  CheckCircle2,
  MapPin,
  PartyPopper,
  Shirt,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";
import ClubZapCheckoutModal from "@/components/ClubZapCheckoutModal";
import PublicPageShell from "@/components/layout/PublicPageShell";

const eventStats = [
  {
    label: "Family entry focus",
    value: "All ages",
    icon: Users,
  },
  {
    label: "Event window",
    value: "August 2026",
    icon: CalendarDays,
  },
  {
    label: "Club venue",
    value: "Ward Rivervalley Park",
    icon: MapPin,
  },
];

const eventDetails = [
  "A family-friendly colour run built for players, parents, guardians, and supporters.",
  "Simple registration with participant details, guardian contact fields, and emergency notes.",
  "Optional event merchandise, including branded sunglasses and colour powder packets.",
  "Secure online booking through the club checkout portal.",
];

const registrationSteps = [
  {
    step: "01",
    title: "Info selection",
    description:
      "Collect participant name, age group, guardian contact details, emergency contact details, and medical notes.",
    icon: ShieldCheck,
  },
  {
    step: "02",
    title: "Merchandise setup",
    description:
      "Add branded sunglasses, colour powder packets, and family extras before checkout.",
    icon: ShoppingBag,
  },
  {
    step: "03",
    title: "Secure checkout",
    description:
      "Send the completed booking into the ClubZap camp checkout target for payment.",
    icon: CheckCircle2,
  },
];

const merchOptions = [
  {
    name: "Branded sunglasses",
    price: "EUR 6",
    detail: "Green club frames for the route and group photo.",
  },
  {
    name: "Colour powder packet",
    price: "EUR 4",
    detail: "Extra packet for the finish line colour zone.",
  },
];

export default function ColourFunRunPage() {
  return (
    <PublicPageShell>
      <main>
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-brand-charcoal bg-white p-6 shadow-brutalist-charcoal-lg sm:p-8 lg:p-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase shadow-[3px_3px_0_#121212]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Annual family event
              </div>
              <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-brand-charcoal sm:text-5xl lg:text-7xl">
                RVR Colour Fun Run
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-zinc-700 sm:text-lg">
                Register for a bright, family-friendly club day with colour
                zones, supporter energy, and simple online booking for every
                participant.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {eventStats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border-3 border-brand-charcoal bg-[#f1ffe1] p-4 shadow-[3px_3px_0_#121212]"
                    >
                      <Icon className="h-5 w-5 text-brand-green" aria-hidden="true" />
                      <p className="mt-3 font-display text-lg font-black uppercase leading-tight">
                        {item.value}
                      </p>
                      <p className="mt-1 text-xs font-bold uppercase text-zinc-600">
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="rounded-[2rem] border-4 border-brand-charcoal bg-brand-charcoal p-6 text-white shadow-brutalist-charcoal-lg sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-white/20 bg-brand-neon shadow-[3px_3px_0_#FAF8F5]">
                <PartyPopper className="h-7 w-7 text-brand-charcoal" aria-hidden="true" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-black uppercase leading-none text-brand-neon">
                Event details
              </h2>
              <div className="mt-6 space-y-4">
                {eventDetails.map((detail) => (
                  <div key={detail} className="flex gap-3">
                    <CheckCircle2
                      className="mt-1 h-5 w-5 shrink-0 text-brand-neon"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-semibold leading-6 text-white/90">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:pb-16">
          <div className="rounded-[2rem] border-4 border-brand-charcoal bg-white p-5 shadow-brutalist-charcoal-lg sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-display text-xs font-black uppercase text-brand-green">
                  Registration flow
                </p>
                <h2 className="mt-2 font-display text-3xl font-black uppercase leading-tight sm:text-5xl">
                  Book your place in three steps.
                </h2>
              </div>
              <p className="max-w-md text-sm font-semibold leading-6 text-zinc-700">
                The mobile booking path keeps participant details, event extras,
                and secure payment in a clear order.
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {registrationSteps.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.step}
                    className="rounded-2xl border-3 border-brand-charcoal bg-brand-cream p-5 shadow-brutalist-charcoal"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-display text-4xl font-black text-brand-green">
                        {item.step}
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border-3 border-brand-charcoal bg-brand-neon">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-xl font-black uppercase">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-zinc-700">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-2xl border-3 border-brand-charcoal bg-[#f1ffe1] p-5">
                <div className="flex items-center gap-3">
                  <Shirt className="h-6 w-6 text-brand-green" aria-hidden="true" />
                  <h3 className="font-display text-xl font-black uppercase">
                    Merchandise choices
                  </h3>
                </div>
                <div className="mt-5 grid gap-3">
                  {merchOptions.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-xl border-2 border-brand-charcoal bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-base font-black uppercase">
                            {item.name}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-zinc-600">
                            {item.detail}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border-2 border-brand-charcoal bg-brand-neon px-3 py-1 font-display text-xs font-black">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border-3 border-brand-charcoal bg-brand-charcoal p-5 text-white">
                <p className="font-display text-xs font-black uppercase text-brand-neon">
                  Secure checkout
                </p>
                <h3 className="mt-2 font-display text-2xl font-black uppercase">
                  Send bookings to ClubZap.
                </h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/80">
                  The final action opens the club checkout overlay for camp and
                  event bookings.
                </p>
                <div className="-mx-4 -mb-6 mt-2">
                  <ClubZapCheckoutModal productKeys={["camps"]} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}

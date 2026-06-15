import type { Metadata } from "next";
import Header from "@/components/Header";
import { ShoppingBag } from "lucide-react";
import { PAYMENT_URLS } from "@/config/payments";

export const metadata: Metadata = {
  title: "Shop | Rivervalley Rangers AFC",
  description:
    "Official Rivervalley Rangers AFC kit, training wear, and accessories.",
};

const categories = [
  {
    label: "Match Kit",
    description: "Official home and away kits for all age groups.",
    items: "Home strip, away strip, goalkeeping kit.",
  },
  {
    label: "Training Wear",
    description: "Performance tops, tracksuit bottoms, and training bibs.",
    items: "Training tops, base layers, jackets.",
  },
  {
    label: "Accessories",
    description: "Bags, bottles, socks, and club branded accessories.",
    items: "Kit bags, water bottles, shin guards, socks.",
  },
  {
    label: "Supporter Wear",
    description: "Casual club wear for supporters of all ages.",
    items: "Hoodies, caps, scarves, leisure wear.",
  },
];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal">
      <Header />

      <main>
        {/* Page header */}
        <section className="border-b-4 border-brand-charcoal bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase tracking-wider">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Official Store
              </span>
              <h1 className="font-display text-4xl font-black uppercase italic leading-none tracking-tighter md:text-6xl">
                RVR Shop
              </h1>
              <p className="mt-5 text-base font-semibold leading-relaxed text-zinc-600 md:text-lg">
                Official club kit, training wear, and accessories — all
                processed securely through the club portal.
              </p>
            </div>
          </div>
        </section>

        {/* Category grid */}
        <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <h2 className="sr-only">Product categories</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <article
                key={category.label}
                className="brutalist-card relative overflow-hidden bg-white p-6"
              >
                {/* Season launch overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-brand-cream/80 backdrop-blur-[2px]">
                  <span className="rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-1.5 font-display text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_#121212]">
                    Season 2026/27
                  </span>
                </div>

                {/* Category content shown beneath the overlay */}
                <div aria-hidden="true" className="space-y-3">
                  <div className="h-32 rounded-xl border-2 border-zinc-200 bg-zinc-50" />
                  <h3 className="font-display text-lg font-black uppercase tracking-tight">
                    {category.label}
                  </h3>
                  <p className="text-xs font-semibold leading-relaxed text-zinc-500">
                    {category.description}
                  </p>
                  <p className="text-[10px] font-medium text-zinc-400">
                    {category.items}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* ClubZap shop CTA */}
          <div className="mt-10 rounded-2xl border-4 border-brand-charcoal bg-brand-charcoal p-6 text-white shadow-brutalist md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-display text-sm font-black uppercase tracking-wide text-brand-neon">
                  Order Kit Through the Club Portal
                </p>
                <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-zinc-300">
                  All kit orders are processed securely through the RVR club
                  portal. Orders open alongside season registration.
                </p>
              </div>
              <a
                href={PAYMENT_URLS.shop.url}
                aria-label={PAYMENT_URLS.shop.label}
                className="btn-brutalist-neon shrink-0 px-6 py-3 text-sm"
              >
                Order Kit
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

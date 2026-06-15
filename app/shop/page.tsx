import type { Metadata } from "next";
import Header from "@/components/Header";
import { ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop | Rivervalley Rangers AFC",
  description:
    "Official Rivervalley Rangers AFC kit, training wear, and accessories. Club merchandise available ahead of the 2026/27 season.",
};

const categories = [
  {
    label: "Match Kit",
    description: "Official home and away kits for all age groups.",
    placeholder: "Home and away strips, goalkeeping kit.",
  },
  {
    label: "Training Wear",
    description: "Performance tops, tracksuit bottoms, and training bibs.",
    placeholder: "Training tops, base layers, training jackets.",
  },
  {
    label: "Accessories",
    description: "Bags, bottles, socks, and club branded accessories.",
    placeholder: "Kit bags, water bottles, shin guards, socks.",
  },
  {
    label: "Supporter Wear",
    description: "Casual club wear for supporters of all ages.",
    placeholder: "Hoodies, caps, scarves, and leisure wear.",
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
                Official club kit, training wear, and accessories. The shop
                opens alongside the 2026/27 season registration window.
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
                {/* Coming soon overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-brand-cream/80 backdrop-blur-[2px]">
                  <span className="rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-1.5 font-display text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_#121212]">
                    Coming Soon
                  </span>
                </div>

                {/* Content behind overlay */}
                <div aria-hidden="true" className="space-y-3">
                  <div className="h-32 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50" />
                  <h3 className="font-display text-lg font-black uppercase tracking-tight">
                    {category.label}
                  </h3>
                  <p className="text-xs font-semibold leading-relaxed text-zinc-500">
                    {category.description}
                  </p>
                  <p className="text-[10px] font-medium text-zinc-400">
                    {category.placeholder}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Launch notice */}
          <div className="mt-10 rounded-2xl border-4 border-brand-charcoal bg-brand-charcoal p-6 text-white shadow-brutalist md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-display text-sm font-black uppercase tracking-wide text-brand-neon">
                  Shop Opens With Season Registration
                </p>
                <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-zinc-300">
                  Kit ordering for the 2026/27 season will open alongside the
                  membership registration window. All orders are fulfilled
                  through the club directly.
                </p>
              </div>
              <a
                href="/membership-calculator"
                className="btn-brutalist-neon shrink-0 px-6 py-3 text-sm"
              >
                Calculate Fees
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

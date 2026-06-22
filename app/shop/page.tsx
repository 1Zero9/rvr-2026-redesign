import { Backpack, Dumbbell, Footprints, Shirt } from "lucide-react";
import PublicPageShell from "@/components/layout/PublicPageShell";
import PageHero from "@/components/layout/PageHero";

export const metadata = {
  title: "Club Shop | Rivervalley Rangers AFC",
  description:
    "Official Rivervalley Rangers AFC kit and merchandise, available now through our partner Balon Sports.",
};

const productCategories = [
  {
    icon: Shirt,
    label: "Match Kit",
    description: "Home and away shirts, shorts, socks and combo packs",
  },
  {
    icon: Dumbbell,
    label: "Training Wear",
    description: "Windbreakers, quarter-zips, full-zip jackets and tops",
  },
  {
    icon: Footprints,
    label: "Bottoms",
    description: "Training shorts, skinny pants and pride pants",
  },
  {
    icon: Backpack,
    label: "Bags & Extras",
    description: "Holdall bags, backpacks, socks and accessories",
  },
];

const balonStoreUrl =
  "https://www.balondirect.com/product-category/rivervalley-rangers";

export default function ShopPage() {
  return (
    <PublicPageShell>
      <PageHero
        eyebrow="Official Club Shop"
        title="Kit Up, Valley"
        description="Official Rivervalley Rangers AFC kit and merchandise, exclusively through Balon Sports."
        actions={
          <a
            href={balonStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brutalist-neon inline-flex min-h-11 items-center px-8 py-4 text-base"
          >
            Shop Now on Balon →
          </a>
        }
      />

        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="mb-2 font-display text-3xl font-black uppercase italic text-brand-charcoal md:text-4xl">
              What&apos;s In The Shop
            </h2>
            <p className="mb-10 text-sm text-zinc-500">
              25 official RVR products available. New season stock added each
              August.
            </p>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {productCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <article
                    key={category.label}
                    className="flex flex-col gap-2 border-2 border-brand-charcoal bg-white p-5 shadow-brutalist"
                  >
                    <Icon
                      className="mb-1 h-10 w-10 text-brand-navy"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <h3 className="font-display text-sm font-black uppercase text-brand-charcoal">
                      {category.label}
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-500">
                      {category.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-14">
          <div className="site-surface p-6 md:flex md:items-center md:justify-between md:gap-12 md:p-8">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-brand-green">
                Our Kit Partner
              </p>
              <h2 className="mb-4 font-display text-3xl font-black italic text-brand-navy md:text-4xl">
                Powered by Balon Sports
              </h2>
              <p className="mb-6 max-w-md text-sm leading-relaxed text-zinc-600 md:mb-0">
                Balon Sports are our official kit supplier, providing
                high-quality teamwear for every RVR squad from U7 right through
                to our senior teams. All orders are handled directly through
                Balon&apos;s secure online store.
              </p>
            </div>

            <div className="shrink-0">
              <a
                href={balonStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brutalist-neon block min-h-11 items-center gap-2 whitespace-nowrap px-8 py-4 text-center text-sm md:inline-flex"
              >
                Visit the RVR Store on Balon →
              </a>
              <p className="mt-3 text-center font-mono text-xs text-zinc-400 md:text-right">
                balondirect.com
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-brand-navy/10 py-10">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="font-mono text-xs uppercase tracking-wide text-zinc-400">
              New season kit available each August · All sizes · Delivery
              across Ireland
            </p>
          </div>
        </section>
    </PublicPageShell>
  );
}

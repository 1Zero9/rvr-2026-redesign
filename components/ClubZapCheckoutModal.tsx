"use client";

import { ExternalLink, LockKeyhole, ShieldCheck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  PaymentTarget,
  clubZapPaymentMap,
} from "@/config/payments";

type PaymentProductKey = keyof typeof clubZapPaymentMap;

interface ProductDisplay {
  description: string;
  ctaLabel: string;
}

interface ClubZapCheckoutModalProps {
  productKeys?: PaymentProductKey[];
}

const productDisplay: Record<string, ProductDisplay> = {
  membership: {
    description:
      "Complete player, parent, and volunteer registration through the club payment portal.",
    ctaLabel: "Secure Registration",
  },
  shop: {
    description:
      "Order official club clothing, training gear, and supporter items through the club shop.",
    ctaLabel: "Secure Checkout",
  },
  lotto: {
    description:
      "Enter the weekly club draw and support community football development.",
    ctaLabel: "Enter Draw",
  },
  camps: {
    description:
      "Book places for club camps, seasonal events, and player development sessions.",
    ctaLabel: "Secure Booking",
  },
  fees: {
    description:
      "Pay team fees, training balances, and approved club charges securely.",
    ctaLabel: "Pay Fees",
  },
};

const defaultProductKeys = Object.keys(clubZapPaymentMap) as PaymentProductKey[];

export default function ClubZapCheckoutModal({
  productKeys = defaultProductKeys,
}: ClubZapCheckoutModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<PaymentTarget | null>(
    null,
  );

  const products = useMemo(
    () =>
      productKeys
        .map((key) => clubZapPaymentMap[key])
        .filter(Boolean)
        .map((product) => ({
          ...product,
          description:
            productDisplay[product.id]?.description ??
            "Complete this club payment securely through the checkout portal.",
          ctaLabel:
            productDisplay[product.id]?.ctaLabel ?? "Secure Registration",
        })),
    [productKeys],
  );

  useEffect(() => {
    if (!selectedProduct) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProduct(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedProduct]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-8">
        <p className="mb-3 inline-flex rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase text-brand-charcoal">
          Club payments
        </p>
        <h2 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-brand-charcoal md:text-5xl">
          Registration and checkout
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.id}
            className="flex min-h-64 flex-col justify-between rounded-2xl border-4 border-brand-charcoal bg-white p-6 shadow-[6px_6px_0_#121212] transition hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#121212]"
          >
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border-3 border-brand-charcoal bg-brand-neon shadow-[3px_3px_0_#121212]">
                <LockKeyhole className="h-6 w-6 text-brand-charcoal" />
              </div>
              <h3 className="font-display text-2xl font-black uppercase leading-tight text-brand-charcoal">
                {product.title}
              </h3>
              <p className="mt-4 text-base font-semibold leading-relaxed text-zinc-700">
                {product.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedProduct(product)}
              className="btn-brutalist-neon mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 px-5 py-3 text-sm"
              aria-label={`Open secure checkout for ${product.title}`}
            >
              <ShieldCheck className="h-5 w-5" />
              {product.ctaLabel}
            </button>
          </article>
        ))}
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-charcoal/55 p-3 backdrop-blur-xl sm:p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedProduct(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="clubzap-checkout-title"
            className="flex h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border-4 border-brand-charcoal bg-white shadow-[6px_6px_0_#121212] sm:h-[min(88dvh,820px)]"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b-4 border-brand-charcoal bg-brand-charcoal px-4 py-3 text-white sm:px-5">
              <div className="min-w-0">
                <p className="font-display text-[10px] font-black uppercase tracking-wide text-brand-neon">
                  Secure checkout
                </p>
                <h3
                  id="clubzap-checkout-title"
                  className="truncate font-display text-base font-black uppercase sm:text-lg"
                >
                  {selectedProduct.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border-2 border-white/20 text-white transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-brand-neon"
                aria-label="Close checkout"
              >
                <X className="h-6 w-6" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-hidden bg-zinc-50">
              <iframe
                src={selectedProduct.targetUrl}
                title={`${selectedProduct.title} checkout`}
                className="block h-full w-full border-0"
                loading="lazy"
                sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{
                  WebkitOverflowScrolling: "touch",
                  overscrollBehavior: "contain",
                }}
              />
            </div>

            <footer className="flex shrink-0 flex-col gap-3 border-t-4 border-brand-charcoal bg-brand-cream px-4 py-3 text-sm font-semibold text-brand-charcoal sm:flex-row sm:items-center sm:justify-between">
              <span>Payments are completed in the secure checkout window.</span>
              <a
                href={selectedProduct.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg font-display text-xs font-black uppercase text-brand-green underline-offset-4 hover:underline focus:outline-none focus:ring-4 focus:ring-brand-neon"
                aria-label={`Open ${selectedProduct.title} checkout in a new tab`}
              >
                Open in new tab
                <ExternalLink className="h-4 w-4" />
              </a>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}

"use client";

import { ExternalLink, LockKeyhole, X } from "lucide-react";
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
  showIntro?: boolean;
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
  showIntro = true,
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
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      {showIntro && (
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase text-brand-charcoal">
            Club payments
          </p>
          <h2 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-brand-charcoal md:text-5xl">
            Choose what you&apos;re paying for
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-brand-charcoal/60">
            Pick an option below and you&apos;ll be taken to a secure checkout powered by{" "}
            <strong className="text-brand-charcoal">ClubZap</strong>, our club&apos;s
            registration and payments partner. You&apos;ll pay directly with ClubZap —
            the club never sees or stores your card details.
          </p>
        </div>
      )}

      <div
        className={`grid grid-cols-1 gap-4 items-stretch ${
          products.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-sm"
        }`}
      >
        {products.map((product, index) => {
          const isDark = index % 2 === 0;
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => setSelectedProduct(product)}
              aria-label={`Open secure checkout for ${product.title}`}
              className={`group flex w-full flex-col items-center p-6 text-center transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${
                isDark
                  ? 'border-3 border-brand-charcoal bg-brand-navy shadow-brutalist hover:bg-brand-charcoal'
                  : 'border-2 border-brand-navy/25 bg-white shadow-brutalist hover:border-brand-navy/60 hover:bg-brand-navy/3'
              }`}
            >
              <LockKeyhole
                className={`mb-3 h-8 w-8 transition-colors ${
                  isDark ? 'text-brand-neon' : 'text-brand-navy/60 group-hover:text-brand-navy'
                }`}
                aria-hidden="true"
              />
              <h3 className={`font-display font-black italic text-xl uppercase leading-tight mb-2 transition-colors ${
                isDark ? 'text-white' : 'text-brand-navy/70 group-hover:text-brand-navy'
              }`}>
                {product.title}
              </h3>
              <p className={`text-sm leading-relaxed transition-colors ${
                isDark ? 'text-brand-sky/80' : 'text-zinc-400 group-hover:text-zinc-600'
              }`}>
                {product.description}
              </p>
            </button>
          );
        })}
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
            className="flex h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border-4 border-brand-charcoal bg-white shadow-brutalist-charcoal-lg sm:h-[min(88dvh,820px)]"
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

            <footer className="flex shrink-0 flex-col gap-2 border-t-4 border-brand-charcoal bg-brand-cream px-4 py-3 text-sm font-semibold text-brand-charcoal sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-brand-charcoal/60 sm:text-sm">
                Something stuck or not loading? Open it in a full tab instead.
              </span>
              <a
                href={selectedProduct.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase text-brand-charcoal shadow-brutalist-charcoal transition-all hover:-translate-y-0.5 hover:shadow-none focus:outline-none focus:ring-4 focus:ring-brand-neon"
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

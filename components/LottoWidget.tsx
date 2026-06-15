"use client";

import { ExternalLink, Ticket, Trophy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { clubZapPaymentMap } from "@/config/payments";

interface LottoWidgetProps {
  jackpotCents?: number;
  nextDrawDate?: string;
}

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function formatCents(cents: number) {
  return euro.format(cents / 100);
}

function formatDrawDate(dateValue: string) {
  return new Intl.DateTimeFormat("en-IE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${dateValue}T20:00:00`));
}

export default function LottoWidget({
  jackpotCents = 420000,
  nextDrawDate = "2026-06-21",
}: LottoWidgetProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const lottoTarget = clubZapPaymentMap.lotto;

  useEffect(() => {
    if (!checkoutOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [checkoutOpen]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="rounded-2xl border-4 border-brand-charcoal bg-white p-5 shadow-[6px_6px_0_#121212] sm:p-6">
        <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-brand-charcoal bg-brand-neon shadow-[3px_3px_0_#121212]">
            <Trophy className="h-7 w-7 text-brand-charcoal" aria-hidden="true" />
          </div>

          <div>
            <p className="font-display text-xs font-black uppercase text-brand-green">
              Weekly club lotto
            </p>
            <h2 className="mt-1 font-display text-3xl font-black uppercase leading-none text-brand-charcoal md:text-4xl">
              {formatCents(jackpotCents)} jackpot
            </h2>
            <p className="mt-2 text-sm font-bold text-zinc-600">
              Next draw: {formatDrawDate(nextDrawDate)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="btn-brutalist-neon inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 text-sm"
          >
            <Ticket className="h-5 w-5" aria-hidden="true" />
            Play Lotto Online
          </button>
        </div>
      </div>

      {checkoutOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-charcoal/55 p-3 backdrop-blur-xl sm:p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCheckoutOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="lotto-checkout-title"
            className="flex h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border-4 border-brand-charcoal bg-white shadow-[6px_6px_0_#121212] sm:h-[min(88dvh,820px)]"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b-4 border-brand-charcoal bg-brand-charcoal px-4 py-3 text-white">
              <div>
                <p className="font-display text-[10px] font-black uppercase tracking-wide text-brand-neon">
                  Secure checkout
                </p>
                <h3
                  id="lotto-checkout-title"
                  className="font-display text-base font-black uppercase"
                >
                  Club lotto
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border-2 border-white/20 text-white transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-brand-neon"
                aria-label="Close lotto checkout"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-hidden bg-zinc-50">
              <iframe
                src={lottoTarget.targetUrl}
                title="Club lotto checkout"
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
              <span>Complete lotto entry in the secure checkout window.</span>
              <a
                href={lottoTarget.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg font-display text-xs font-black uppercase text-brand-green underline-offset-4 hover:underline focus:outline-none focus:ring-4 focus:ring-brand-neon"
              >
                Open in new tab
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}

"use client";

import { ArrowUpRight, CalendarDays, ShieldCheck, Ticket, Trophy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { clubZapPaymentMap } from "@/config/payments";

interface LottoWidgetProps {
  jackpotCents?: number;
  nextDrawDate?: string;
  drawLabel?: string;
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
  drawLabel = "Weekly club draw",
}: LottoWidgetProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const lottoTarget = clubZapPaymentMap.lotto;

  useEffect(() => {
    if (!checkoutOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCheckoutOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [checkoutOpen]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <article className="overflow-hidden rounded-[2rem] border-4 border-brand-navy bg-brand-navy text-white shadow-[6px_6px_0_#85E320]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-5 sm:p-7 lg:p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-white bg-brand-neon shadow-[3px_3px_0_#FFFFFF]">
              <Trophy className="h-7 w-7 text-brand-charcoal" aria-hidden="true" />
            </div>

            <p className="font-display text-xs font-black uppercase text-brand-neon">
              RVR Weekly Club Draw
            </p>
            <h2 className="mt-2 font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl">
              Play for the current jackpot.
            </h2>
            <p className="mt-4 max-w-xl text-base font-semibold leading-relaxed text-white/85">
              Enter the weekly draw online and support community football across
              Rivervalley Rangers AFC.
            </p>

            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="btn-brutalist-neon mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 px-6 py-3 text-sm sm:w-auto"
            >
              <Ticket className="h-5 w-5" aria-hidden="true" />
              Play Lotto Online
            </button>
          </div>

          <div className="border-t-4 border-white bg-white p-5 text-brand-charcoal sm:p-7 lg:border-l-4 lg:border-t-0 lg:p-8">
            <div className="grid gap-4">
              <div className="rounded-2xl border-4 border-brand-navy bg-brand-cream p-5 shadow-[5px_5px_0_#0B1F3B]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-brand-green" aria-hidden="true" />
                  <p className="font-display text-xs font-black uppercase text-brand-green">
                    Current Jackpot
                  </p>
                </div>
                <p className="mt-3 font-display text-5xl font-black uppercase leading-none text-brand-navy">
                  {formatCents(jackpotCents)}
                </p>
              </div>

              <div className="rounded-2xl border-4 border-brand-navy bg-[#f1ffe1] p-5 shadow-[5px_5px_0_#0B1F3B]">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    className="h-5 w-5 text-brand-green"
                    aria-hidden="true"
                  />
                  <p className="font-display text-xs font-black uppercase text-brand-green">
                    Next Draw Date
                  </p>
                </div>
                <p className="mt-3 font-display text-2xl font-black uppercase leading-tight text-brand-navy">
                  {formatDrawDate(nextDrawDate)}
                </p>
                <p className="mt-2 text-sm font-bold text-zinc-700">{drawLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {checkoutOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-navy/70 p-3 backdrop-blur-xl sm:p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCheckoutOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="lotto-checkout-title"
            className="flex h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border-4 border-brand-navy bg-white shadow-[6px_6px_0_#85E320] sm:h-[min(88dvh,820px)]"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b-4 border-brand-navy bg-brand-navy px-4 py-3 text-white sm:px-5">
              <div className="min-w-0">
                <p className="font-display text-[10px] font-black uppercase tracking-wide text-brand-neon">
                  Secure checkout
                </p>
                <h3
                  id="lotto-checkout-title"
                  className="truncate font-display text-base font-black uppercase sm:text-lg"
                >
                  {lottoTarget.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border-2 border-white/20 text-white transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-brand-neon"
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

            <footer className="flex shrink-0 flex-col gap-3 border-t-4 border-brand-navy bg-brand-cream px-4 py-3 text-sm font-semibold text-brand-charcoal sm:flex-row sm:items-center sm:justify-between">
              <span>Complete lotto entry in the secure checkout window.</span>
              <a
                href={lottoTarget.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg font-display text-xs font-black uppercase text-brand-green underline-offset-4 hover:underline focus:outline-none focus:ring-4 focus:ring-brand-neon"
                aria-label="Open club lotto checkout in a new tab"
              >
                Open in new tab
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}

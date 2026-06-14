import type { LottoWidgetData } from "@/types/campaigns";

interface LottoWidgetProps {
  data: LottoWidgetData;
}

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export default function LottoWidget({ data }: LottoWidgetProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-6 overflow-hidden rounded-[2rem] border-4 border-brand-charcoal bg-white p-6 shadow-brutalist md:grid-cols-[0.8fr_1.2fr_auto] md:items-center md:p-8">
        <div>
          <p className="font-display text-xs font-black uppercase text-brand-green">
            Weekly club lotto
          </p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase leading-none">
            {euro.format(data.jackpotCents / 100)} jackpot
          </h2>
          <p className="mt-3 text-sm font-bold text-zinc-600">
            Next draw: {data.nextDrawLabel}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {data.recentResults.slice(0, 2).map((result) => (
            <article
              key={result.id}
              className="rounded-2xl border-3 border-brand-charcoal bg-[#f1ffe1] p-4"
            >
              <p className="font-display text-xs font-black uppercase text-brand-green">
                {new Intl.DateTimeFormat("en-IE", {
                  day: "2-digit",
                  month: "short",
                }).format(new Date(result.drawDate))}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.numbers.map((number) => (
                  <span
                    key={`${result.id}-${number}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-charcoal bg-white font-display text-sm font-black"
                  >
                    {number}
                  </span>
                ))}
                {result.bonusNumber && (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-charcoal bg-brand-neon font-display text-sm font-black">
                    {result.bonusNumber}
                  </span>
                )}
              </div>
              {result.winnerSummary && (
                <p className="mt-3 text-xs font-bold text-zinc-600">
                  {result.winnerSummary}
                </p>
              )}
            </article>
          ))}
        </div>

        <a
          href={data.providerUrl}
          className="btn-brutalist-neon whitespace-nowrap px-6 py-3 text-center text-sm"
        >
          Play on {data.providerName}
        </a>
      </div>
    </section>
  );
}

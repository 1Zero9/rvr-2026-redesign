import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import LottoWidget from "@/components/campaigns/LottoWidget";
import type { LottoWidgetData } from "@/types/campaigns";

const lottoData: LottoWidgetData = {
  jackpotCents: 420000,
  currency: "EUR",
  nextDrawLabel: "Sunday, 21 June",
  providerName: "Clubforce",
  providerUrl: "https://clubforce.com/",
  recentResults: [
    {
      id: "draw-2026-06-07",
      drawDate: "2026-06-07T20:00:00.000Z",
      numbers: [3, 11, 18, 24],
      bonusNumber: 29,
      winnerSummary: "No jackpot winner. Three match-three prizes paid.",
      jackpotCents: 400000,
    },
    {
      id: "draw-2026-05-31",
      drawDate: "2026-05-31T20:00:00.000Z",
      numbers: [6, 9, 15, 27],
      bonusNumber: 31,
      winnerSummary: "No jackpot winner. Next draw rolled over.",
      jackpotCents: 380000,
    },
  ],
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-charcoal">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <LottoWidget data={lottoData} />
      </main>
      
      {/* Simple, premium footer */}
      <footer className="bg-brand-charcoal text-white border-t-4 border-brand-charcoal py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-display font-black text-xl italic uppercase tracking-tight text-brand-neon mb-4">
              RIVERVALLEY RANGERS AFC
            </h4>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Swords&apos; leading community football club, established in 1981. Dedicated to equality, youth development, and inclusive sports.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-4">
              Our Locations
            </h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>📍 Ward Rivervalley Park, Swords, Co. Dublin</li>
              <li>🏟️ Ward Rivervalley All-Weather Astro Pitch</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-4">
              Legal & Safety
            </h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>✓ 100% Garda Vetted Coaches</li>
              <li>✓ Child Safeguarding Statement</li>
              <li>✓ FAI Club Mark Accredited</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Rivervalley Rangers AFC. All rights reserved.</p>
          <p>Dublin Football Pride Since 1981</p>
        </div>
      </footer>
    </div>
  );
}

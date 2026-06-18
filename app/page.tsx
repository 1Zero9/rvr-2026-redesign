import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LottoWidget from "@/components/LottoWidget";
import Stats from "@/components/Stats";
import { CLUB_SEASON } from "@/config/club-season";
import { APP_VERSION, APP_VERSION_DATE } from "@/config/version";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-charcoal">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <LottoWidget jackpotCents={420000} nextDrawDate="2026-06-21" />
      </main>

      <footer className="bg-brand-navy text-white border-t border-brand-sky/20 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-display font-black text-xl italic uppercase tracking-tight text-brand-neon mb-4">
              RIVERVALLEY RANGERS AFC
            </h4>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Swords&apos; leading community football club, established in {CLUB_SEASON.foundingYear}.
              Dedicated to equality, youth development, and inclusive sports.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-4">
              Our Locations
            </h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>Ward Rivervalley Park, Swords, Co. Dublin</li>
              <li>Ward Rivervalley All-Weather Astro Pitch</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-4">
              Legal &amp; Safety
            </h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>100% Garda Vetted Coaches</li>
              <li>Child Safeguarding Statement</li>
              <li>FAI Club Mark Accredited</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Rivervalley Rangers AFC. All rights reserved.</p>
          <p>Dublin Football Pride Since {CLUB_SEASON.foundingYear}</p>
          <p className="text-xs text-brand-sky/50 mt-2">
            RVR2026 v{APP_VERSION} · {APP_VERSION_DATE}
          </p>
        </div>
      </footer>
    </div>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full mx-auto flex flex-col items-center text-center">

        {/* Football crossing the touchline */}
        <svg
          viewBox="0 0 240 120"
          className="w-60 mb-8"
          aria-hidden="true"
        >
          {/* Touchline */}
          <line x1="24" y1="60" x2="216" y2="60" stroke="#0B1F3B" strokeWidth="4" strokeLinecap="round" />
          {/* Ball — center sits on the line, half above/half below */}
          <circle cx="120" cy="60" r="40" fill="#FAF8F5" stroke="#0B1F3B" strokeWidth="3" />
          {/* Central black pentagon patch */}
          <polygon points="120,46 133,56 128,71 112,71 107,56" fill="#0B1F3B" />
          {/* Seam lines from each pentagon vertex to the circle edge */}
          <path d="M120,46 C117,38 117,28 120,20" fill="none" stroke="#0B1F3B" strokeWidth="1.5" />
          <path d="M133,56 C142,54 151,51 158,48" fill="none" stroke="#0B1F3B" strokeWidth="1.5" />
          <path d="M128,71 C132,79 137,86 144,92" fill="none" stroke="#0B1F3B" strokeWidth="1.5" />
          <path d="M112,71 C108,79 103,86 96,92" fill="none" stroke="#0B1F3B" strokeWidth="1.5" />
          <path d="M107,56 C98,54 89,51 82,48" fill="none" stroke="#0B1F3B" strokeWidth="1.5" />
        </svg>

        {/* Headline */}
        <div>
          <p className="font-display text-[120px] lg:text-[160px] leading-none font-black italic text-brand-navy">
            404
          </p>
          <p className="font-display text-2xl font-black italic tracking-widest text-brand-navy uppercase border-b-4 border-brand-neon inline-block pb-1">
            OUT OF PLAY
          </p>
        </div>

        {/* Body copy */}
        <p className="text-base text-brand-charcoal mt-4 mb-8">
          The page you&apos;re looking for has been cleared off the pitch.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row w-full sm:w-auto">
          <Link
            href="/"
            className="bg-brand-neon text-brand-charcoal font-bold px-6 py-3 min-h-[44px] flex items-center justify-center border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            ← Back Home
          </Link>
          <Link
            href="/fixtures"
            className="bg-transparent text-brand-navy font-bold px-6 py-3 min-h-[44px] flex items-center justify-center border-3 border-brand-navy hover:bg-brand-navy hover:text-brand-cream transition-all"
          >
            View Fixtures
          </Link>
        </div>

        {/* Footer line */}
        <p className="text-xs text-brand-charcoal/50 mt-12 tracking-wider uppercase">
          Rivervalley Rangers AFC · Est. 1981
        </p>
      </div>
    </div>
  );
}

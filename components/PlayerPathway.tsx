import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const TRACKS = [
  {
    label: 'Boys',
    borderColor: 'border-l-brand-neon',
    labelColor: 'text-brand-green',
    steps: ['Academy', 'U7–U11', 'U12–U17', 'Seniors', 'Over 35s'],
    href: '/teams?filter=boys',
  },
  {
    label: 'Girls',
    borderColor: 'border-l-brand-maroon',
    labelColor: 'text-brand-maroon',
    steps: ['Academy', 'U7–U18', 'Ladies Football'],
    href: '/teams?filter=girls',
  },
  {
    label: 'Community',
    borderColor: 'border-l-brand-green',
    labelColor: 'text-brand-green',
    steps: ['Walking Football', 'Ladies Football Fit', 'Football For All'],
    href: '/football-for-all',
  },
];

interface PlayerPathwayProps {
  className?: string;
}

export default function PlayerPathway({ className = '' }: PlayerPathwayProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-display font-black uppercase tracking-widest text-brand-charcoal/40">
          The RVR Player Pathway
        </p>
        <Link
          href="/pathway"
          className="inline-flex items-center gap-1 text-[10px] font-display font-black uppercase tracking-widest text-brand-navy/50 hover:text-brand-navy transition-colors"
        >
          View full pathway
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {TRACKS.map((track) => (
          <Link
            key={track.label}
            href={track.href}
            className={`group flex items-center gap-0 overflow-hidden border-2 border-l-4 border-brand-navy/15 ${track.borderColor} hover:border-brand-navy/40 bg-white transition-all`}
          >
            {/* Label */}
            <div className="shrink-0 flex items-center justify-center px-3 py-2.5 self-stretch">
              <span className={`font-display font-black text-[10px] uppercase tracking-widest ${track.labelColor} whitespace-nowrap`}>
                {track.label}
              </span>
            </div>

            {/* Divider */}
            <div className="w-px self-stretch bg-brand-navy/10 shrink-0" />

            {/* Steps */}
            <div className="flex items-center gap-0 flex-1 px-3 py-2.5 overflow-x-auto">
              {track.steps.map((step, i) => (
                <div key={step} className="flex items-center gap-0 shrink-0">
                  <span className="font-display font-black text-[10px] uppercase tracking-wide text-brand-charcoal/70 whitespace-nowrap group-hover:text-brand-navy transition-colors">
                    {step}
                  </span>
                  {i < track.steps.length - 1 && (
                    <span className="mx-2 text-brand-charcoal/20 text-[10px]">›</span>
                  )}
                </div>
              ))}
            </div>

            {/* Arrow */}
            <div className="shrink-0 pr-3 py-2.5 self-stretch flex items-center">
              <ArrowRight className="h-3.5 w-3.5 text-brand-navy/25 group-hover:text-brand-navy transition-colors" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-3 text-center">
        <Link
          href="/pathway"
          className="inline-flex items-center gap-1.5 text-xs font-display font-black uppercase tracking-widest text-brand-navy border-b-2 border-brand-neon pb-0.5 hover:text-brand-green transition-colors"
        >
          See the full pathway →
        </Link>
      </div>
    </div>
  );
}

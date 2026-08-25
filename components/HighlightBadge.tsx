'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PartyPopper, X } from 'lucide-react';

type HighlightCampaign = {
  id: string;
  title: string;
  ctaLabel: string;
  ctaUrl: string;
};

const DISMISS_KEY = 'rvr-highlight-dismissed';

export default function HighlightBadge({ campaign }: { campaign: HighlightCampaign }) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    let wasDismissed = false;
    try {
      wasDismissed = sessionStorage.getItem(DISMISS_KEY) === campaign.id;
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from sessionStorage, an external system, on mount
    setDismissed(wasDismissed);
  }, [campaign.id]);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-1.5">
      <Link
        href={campaign.ctaUrl}
        className="group relative flex items-center gap-2 rounded-full border-3 border-brand-charcoal bg-brand-neon pl-3 pr-4 py-2.5 shadow-brutalist-charcoal animate-glow-pulse motion-reduce:animate-none transition-transform hover:scale-105"
      >
        <PartyPopper
          className="h-5 w-5 shrink-0 text-brand-charcoal animate-bounce motion-reduce:animate-none"
          aria-hidden="true"
        />
        <span className="font-display font-black italic uppercase text-xs sm:text-sm text-brand-charcoal leading-tight max-w-[9rem] sm:max-w-none truncate">
          {campaign.title}
        </span>
      </Link>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          try {
            sessionStorage.setItem(DISMISS_KEY, campaign.id);
          } catch {}
          setDismissed(true);
        }}
        className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-brand-charcoal bg-white text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

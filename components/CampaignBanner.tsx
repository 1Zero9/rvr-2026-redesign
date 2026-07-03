'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

type BannerCampaign = {
  id: string;
  title: string;
  subtitle: string | null;
  ctaLabel: string;
  ctaUrl: string;
  showBanner: boolean;
};

const DISMISS_KEY = 'rvr-campaigns-dismissed';

function getDismissed(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(DISMISS_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

const DROP_DELAY_MS = 1500;

export default function CampaignBanner() {
  const [queue, setQueue] = useState<BannerCampaign[]>([]);
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    fetch('/api/campaigns')
      .then((res) => (res.ok ? res.json() : []))
      .then((campaigns: BannerCampaign[]) => {
        if (cancelled) return;
        const dismissed = getDismissed();
        const banners = campaigns.filter((c) => c.showBanner && !dismissed.includes(c.id));
        setQueue(banners);
        if (banners.length === 0) return;
        if (reducedMotion) {
          // No delay, no motion — just appear
          setAnimate(false);
          setOpen(true);
        } else {
          timer = setTimeout(() => setOpen(true), DROP_DELAY_MS);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  // Newest live banner first; dismissing reveals the next one
  const campaign = queue[0];
  if (!campaign) return null;

  return (
    <div
      className={animate ? 'grid transition-[grid-template-rows] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]' : 'grid'}
      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      aria-hidden={!open}
    >
      <div className="overflow-hidden">
        <div className="bg-brand-neon border-b-3 border-brand-charcoal">
      <div
        className={`max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3 ${
          animate ? 'transition-opacity duration-500 delay-200' : ''
        } ${open ? 'opacity-100' : 'opacity-0'}`}
      >
        <p className="flex-1 min-w-0 text-sm font-bold text-brand-charcoal truncate">
          <span className="font-display font-black uppercase">{campaign.title}</span>
          {campaign.subtitle && (
            <span className="hidden sm:inline"> — {campaign.subtitle}</span>
          )}
        </p>
        {queue.length > 1 && (
          <span className="hidden md:inline shrink-0 text-[10px] font-black uppercase tracking-wider text-brand-charcoal/50">
            1 of {queue.length}
          </span>
        )}
        <Link
          href={campaign.ctaUrl}
          className="shrink-0 inline-flex min-h-[36px] items-center border-2 border-brand-charcoal bg-brand-charcoal px-3 py-1 text-xs font-display font-black uppercase text-brand-neon hover:bg-brand-charcoal/80 transition-colors"
        >
          {campaign.ctaLabel} →
        </Link>
        <button
          type="button"
          aria-label="Dismiss campaign banner"
          onClick={() => {
            sessionStorage.setItem(
              DISMISS_KEY,
              JSON.stringify([...getDismissed(), campaign.id]),
            );
            setQueue((q) => q.slice(1));
          }}
          className="shrink-0 inline-flex h-9 w-9 items-center justify-center text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        </div>
        </div>
      </div>
    </div>
  );
}

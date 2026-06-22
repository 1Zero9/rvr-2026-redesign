'use client';

import { useEffect, useState } from 'react';

const CATEGORY_LABELS: Record<string, string> = {
  RECRUITMENT: '🔵 Recruitment',
  EVENT:       '🟡 Event',
  NEWS:        '⚽ News',
  VOLUNTEER:   '🟢 Volunteer',
};

const STORAGE_KEY = 'rvr_pinned_widget_dismissed';

export interface PinnedAnnouncementData {
  id:       string;
  title:    string;
  category: string;
  ctaLabel: string | null;
  ctaUrl:   string | null;
}

interface Props {
  announcement: PinnedAnnouncementData;
}

export default function PinnedAnnouncementWidget({ announcement }: Props) {
  const [mounted,  setMounted]  = useState(false);
  const [visible,  setVisible]  = useState(false);
  const [gone,     setGone]     = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === announcement.id) {
      setGone(true);
      return;
    }
    setMounted(true);
    // Defer one frame so the transition fires after initial render
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, [announcement.id]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, announcement.id);
    setVisible(false);
    setTimeout(() => setGone(true), 300);
  }

  if (gone || !mounted) return null;

  return (
    <div
      className={[
        'fixed bottom-0 left-0 right-0 z-[100]',
        'lg:bottom-6 lg:left-6 lg:right-auto lg:w-80',
        'bg-brand-navy border-l-4 border-brand-neon shadow-brutalist',
        'transition-transform duration-300',
        visible ? 'translate-y-0' : 'translate-y-full',
      ].join(' ')}
    >
      <div className="p-4">
        {/* Header row: badge + dismiss */}
        <div className="flex items-start justify-between">
          <span className="inline-block bg-brand-neon text-brand-charcoal text-xs font-bold uppercase tracking-widest px-2 py-0.5">
            {CATEGORY_LABELS[announcement.category] ?? announcement.category}
          </span>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss announcement"
            className="text-brand-sky hover:text-white text-xl leading-none min-h-[44px] min-w-[44px] flex items-center justify-center -mt-2 -mr-2"
          >
            ×
          </button>
        </div>

        <h3 className="font-display italic text-white text-lg leading-tight mt-2 mb-3 line-clamp-2">
          {announcement.title}
        </h3>

        {announcement.ctaLabel && announcement.ctaUrl && (
          <a
            href={announcement.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-brand-neon text-brand-charcoal font-bold uppercase tracking-wide text-sm py-3 min-h-[44px] hover:bg-white transition-colors border-2 border-brand-neon text-center"
          >
            {announcement.ctaLabel}
          </a>
        )}
      </div>
    </div>
  );
}

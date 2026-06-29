'use client';

import { useEffect, useState } from 'react';
import type { PublicAnnouncement } from '@/lib/announcements/types';
import AnnouncementDrawer from './AnnouncementDrawer';
import PinnedAnnouncementWidget, { type PinnedAnnouncementData } from './PinnedAnnouncementWidget';

interface Props {
  heroMode?:            boolean;
  pinnedAnnouncement?:  PinnedAnnouncementData | null;
}

export default function AnnouncementTrigger({ heroMode, pinnedAnnouncement }: Props = {}) {
  const [announcements, setAnnouncements] = useState<PublicAnnouncement[]>([]);
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [loaded,        setLoaded]        = useState(false);

  useEffect(() => {
    fetch('/api/announcements')
      .then((r) => r.json())
      .then((data: PublicAnnouncement[]) => {
        setAnnouncements(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || announcements.length === 0) return null;

  return (
    <>
      {pinnedAnnouncement && (
        <PinnedAnnouncementWidget announcement={pinnedAnnouncement} />
      )}

      {drawerOpen && (
        <AnnouncementDrawer
          announcements={announcements}
          onClose={() => setDrawerOpen(false)}
        />
      )}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className={heroMode
          ? 'group border-3 border-white/60 bg-white/10 text-white font-display font-black uppercase tracking-wide text-lg px-8 py-4 rounded-full transition-all text-center flex items-center justify-center gap-2 min-h-[44px] w-full md:w-auto hover:bg-brand-neon hover:text-brand-charcoal hover:border-brand-neon'
          : 'group border-3 border-brand-charcoal bg-transparent text-brand-charcoal font-display font-black uppercase tracking-wide text-sm px-8 py-4 rounded-2xl shadow-brutalist transition-all text-center flex items-center justify-center gap-2 min-h-[44px] w-full md:w-auto hover:bg-brand-charcoal hover:text-white hover:shadow-none hover:translate-x-1 hover:translate-y-1'
        }
      >
        <span>📢</span>
        <span>Club News</span>
        <span className={`text-xs font-black px-1.5 py-0.5 min-w-[20px] text-center rounded-full ml-1 ${
          heroMode
            ? 'bg-brand-neon text-brand-charcoal group-hover:bg-brand-charcoal group-hover:text-brand-neon'
            : 'bg-brand-neon text-brand-charcoal group-hover:bg-brand-charcoal group-hover:text-brand-neon'
        }`}>
          {announcements.length}
        </span>
      </button>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import type { PublicAnnouncement } from '@/lib/announcements/types';
import AnnouncementModal from './AnnouncementModal';
import AnnouncementDrawer from './AnnouncementDrawer';

export default function AnnouncementPill() {
  const [announcements, setAnnouncements] = useState<PublicAnnouncement[]>([]);
  const [urgentModal,   setUrgentModal]   = useState<PublicAnnouncement | null>(null);
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [pillDismissed, setPillDismissed] = useState(false);
  const [loaded,        setLoaded]        = useState(false);

  useEffect(() => {
    fetch('/api/announcements')
      .then((r) => r.json())
      .then((data: PublicAnnouncement[]) => {
        setAnnouncements(data);

        const dismissed: string[] = JSON.parse(
          localStorage.getItem('rvr_dismissed_announcements') ?? '[]',
        );
        const urgent = data.find((a) => a.pinned && !dismissed.includes(a.id));
        if (urgent) setUrgentModal(urgent);

        if (sessionStorage.getItem('rvr_pill_dismissed')) setPillDismissed(true);

        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  function dismissUrgent(id: string) {
    const dismissed: string[] = JSON.parse(
      localStorage.getItem('rvr_dismissed_announcements') ?? '[]',
    );
    if (!dismissed.includes(id)) {
      localStorage.setItem(
        'rvr_dismissed_announcements',
        JSON.stringify([...dismissed, id]),
      );
    }
    setUrgentModal(null);
  }

  function dismissPill() {
    sessionStorage.setItem('rvr_pill_dismissed', 'true');
    setPillDismissed(true);
  }

  if (!loaded || announcements.length === 0) return null;

  return (
    <>
      {urgentModal && (
        <AnnouncementModal
          announcement={urgentModal}
          onClose={() => dismissUrgent(urgentModal.id)}
        />
      )}

      {drawerOpen && !urgentModal && (
        <AnnouncementDrawer
          announcements={announcements}
          onClose={() => setDrawerOpen(false)}
        />
      )}

      {!pillDismissed && !urgentModal && !drawerOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 bg-brand-navy border-3 border-brand-neon shadow-brutalist px-4 py-2 min-h-[44px] hover:bg-brand-neon hover:text-brand-charcoal transition-all group"
          >
            <span className="text-brand-neon group-hover:text-brand-charcoal text-lg">📢</span>
            <span className="font-display font-black uppercase text-sm tracking-wide text-brand-cream group-hover:text-brand-charcoal">
              {announcements.length === 1
                ? '1 Club Announcement'
                : `${announcements.length} Club Announcements`}
            </span>
            <span className="bg-brand-neon text-brand-charcoal text-xs font-black px-1.5 py-0.5 min-w-[20px] text-center group-hover:bg-brand-charcoal group-hover:text-brand-neon">
              {announcements.length}
            </span>
          </button>
          <button
            type="button"
            onClick={dismissPill}
            aria-label="Dismiss announcements"
            className="bg-brand-navy border-3 border-brand-sky/30 min-w-[44px] min-h-[44px] flex items-center justify-center text-brand-sky hover:text-brand-neon hover:border-brand-neon transition-all font-bold text-lg"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

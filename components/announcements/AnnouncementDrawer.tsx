'use client';

import { useState } from 'react';
import type { PublicAnnouncement } from '@/lib/announcements/types';
import { CATEGORY_CONFIG } from '@/lib/announcements/types';
import AnnouncementModal from './AnnouncementModal';

interface Props {
  announcements: PublicAnnouncement[];
  onClose: () => void;
}

export default function AnnouncementDrawer({ announcements, onClose }: Props) {
  const [selected, setSelected] = useState<PublicAnnouncement | null>(null);

  if (selected) {
    return (
      <AnnouncementModal
        announcement={selected}
        onClose={() => setSelected(null)}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end justify-center"
      style={{
        backdropFilter: 'blur(6px)',
        background: 'rgba(11,31,59,0.75)',
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-brand-navy border-t-4 border-brand-neon max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-sky/20 shrink-0">
          <h2 className="font-display font-black italic uppercase text-brand-neon text-2xl tracking-tight">
            Club News
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-brand-sky hover:text-brand-neon transition-colors text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Cards */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {announcements.map((a) => {
            const cat = CATEGORY_CONFIG[a.category];
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelected(a)}
                className="w-full text-left bg-brand-charcoal border-2 border-brand-sky/20 hover:border-brand-neon transition-all group"
              >
                {/* Category bar */}
                <div className={`${cat.colour} ${cat.textColour} px-4 py-2 flex items-center justify-between`}>
                  <span className="font-display font-black uppercase text-xs tracking-widest">
                    {cat.label}
                  </span>
                  <span className="text-sm opacity-60 group-hover:opacity-100 transition-opacity">
                    Read more →
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-display font-black italic uppercase text-brand-neon text-xl leading-tight mb-2 group-hover:text-white transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-brand-sky/70 text-sm leading-relaxed line-clamp-2">
                    {a.body}
                  </p>
                  {a.ctaLabel && (
                    <span className="inline-block mt-3 text-xs font-bold uppercase tracking-wider text-brand-neon border border-brand-neon px-3 py-1">
                      {a.ctaLabel}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

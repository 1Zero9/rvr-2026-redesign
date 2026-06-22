'use client';

import { useEffect } from 'react';
import type { PublicAnnouncement } from '@/lib/announcements/types';
import { CATEGORY_CONFIG } from '@/lib/announcements/types';

interface Props {
  announcement: PublicAnnouncement;
  onClose: () => void;
}

export default function AnnouncementModal({ announcement, onClose }: Props) {
  const cat = CATEGORY_CONFIG[announcement.category];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ backdropFilter: 'blur(8px)', background: 'rgba(11,31,59,0.7)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-brand-navy border-3 border-brand-neon shadow-brutalist overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Category bar */}
        <div className={`${cat.colour} ${cat.textColour} px-4 py-2 flex items-center justify-between`}>
          <span className="font-display font-black uppercase text-sm tracking-widest">
            {cat.label}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center font-bold text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Image */}
        {announcement.imageUrl && (
          <div className="w-full aspect-video overflow-hidden">
            <img
              src={announcement.imageUrl}
              alt={announcement.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <h2 className="font-display font-black italic text-2xl md:text-3xl uppercase text-brand-neon leading-tight mb-3">
            {announcement.title}
          </h2>
          <p className="text-brand-cream text-sm leading-relaxed whitespace-pre-wrap">
            {announcement.body}
          </p>

          {announcement.ctaLabel && announcement.ctaUrl && (
            <a
              href={announcement.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center min-h-[44px] px-6 bg-brand-neon text-brand-charcoal font-bold border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              {announcement.ctaLabel} →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

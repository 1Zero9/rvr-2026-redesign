'use client';

import { useState, useRef } from 'react';
import AnnouncementCard from './AnnouncementCard';
import type { Announcement } from '@prisma/client';

export default function NewsCarousel({ announcements }: { announcements: Announcement[] }) {
  const [active, setActive]  = useState(0);
  const containerRef         = useRef<HTMLDivElement>(null);

  const goTo = (index: number) => {
    setActive(index);
    const container = containerRef.current;
    if (!container) return;
    const card = container.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  return (
    <>
      {/* Mobile: vertical stack */}
      <div className="flex flex-col gap-4 sm:hidden">
        {announcements.map((a) => (
          <AnnouncementCard key={a.id} announcement={a} href={a.ctaUrl ?? `/news/${a.id}`} />
        ))}
      </div>

      {/* sm+: horizontal scroll carousel */}
      <div className="hidden sm:block space-y-4">
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory -mx-6 px-6 scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {announcements.map((a) => (
            <div key={a.id} className="snap-start shrink-0 w-[300px]">
              <AnnouncementCard announcement={a} href={a.ctaUrl ?? `/news/${a.id}`} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2" role="tablist" aria-label="News navigation">
          {announcements.map((a, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={active === i}
              aria-label={a.title}
              onClick={() => goTo(i)}
              className={[
                'h-1.5 rounded-full transition-all duration-300',
                active === i ? 'w-6 bg-brand-neon' : 'w-1.5 bg-zinc-300 hover:bg-zinc-500',
              ].join(' ')}
            />
          ))}
        </div>
      </div>
    </>
  );
}

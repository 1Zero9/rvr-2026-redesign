import Link from 'next/link';
import type { Announcement } from '@prisma/client';

const CATEGORY_STYLE: Record<string, { border: string; badge: string }> = {
  RECRUITMENT: { border: 'border-l-brand-neon',   badge: 'bg-brand-neon text-brand-charcoal'  },
  EVENT:       { border: 'border-l-brand-sky',    badge: 'bg-brand-sky text-brand-charcoal'   },
  NEWS:        { border: 'border-l-brand-green',  badge: 'bg-brand-green text-white'          },
  VOLUNTEER:   { border: 'border-l-brand-maroon', badge: 'bg-brand-maroon text-white'         },
};

export default function AnnouncementCard({
  announcement: a,
}: {
  announcement: Announcement;
}) {
  const style = CATEGORY_STYLE[a.category] ?? CATEGORY_STYLE.NEWS;

  return (
    <div className={`bg-white border-2 border-brand-charcoal/10 border-l-4 ${style.border} flex flex-col`}>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 ${style.badge}`}>
            {a.category}
          </span>
          {a.pinned && (
            <span className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-wide">
              📌 Pinned
            </span>
          )}
          <span className="text-[10px] text-brand-charcoal/40 font-mono ml-auto">
            {new Date(a.publishedAt).toLocaleDateString('en-IE')}
          </span>
        </div>

        <h3 className="font-display font-black italic text-lg text-brand-charcoal leading-snug mb-2">
          {a.title}
        </h3>

        <p className="text-sm text-brand-charcoal/70 leading-relaxed line-clamp-3 flex-1">
          {a.body.replace(/[#*`_>]/g, '').slice(0, 200)}
        </p>
      </div>

      {(a.ctaLabel && a.ctaUrl) && (
        <div className="px-5 pb-5">
          <Link
            href={a.ctaUrl}
            className="inline-flex items-center min-h-[44px] px-4 bg-brand-navy text-brand-cream text-sm font-bold border-2 border-brand-navy hover:bg-transparent hover:text-brand-navy transition-all"
          >
            {a.ctaLabel} →
          </Link>
        </div>
      )}
    </div>
  );
}

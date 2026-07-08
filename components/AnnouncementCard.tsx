import Link from 'next/link';
import type { Announcement } from '@prisma/client';

const CATEGORY_STYLE: Record<string, { border: string; badge: string }> = {
  BREAKING:        { border: 'border-l-brand-maroon', badge: 'bg-brand-maroon/10 text-brand-maroon'  },
  CONGRATULATIONS: { border: 'border-l-brand-neon',   badge: 'bg-brand-neon/15 text-brand-charcoal'  },
  COMMUNITY_NEWS:  { border: 'border-l-brand-sky',    badge: 'bg-brand-sky/15 text-brand-navy'       },
  IN_SYMPATHY:     { border: 'border-l-brand-navy',   badge: 'bg-brand-navy/10 text-brand-navy'      },
};

const CATEGORY_LABEL: Record<string, string> = {
  BREAKING:        'Breaking News',
  CONGRATULATIONS: 'Congratulations',
  COMMUNITY_NEWS:  'Community News',
  IN_SYMPATHY:     'In Sympathy',
};

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AnnouncementCard({
  announcement: a,
  href,
}: {
  announcement: Announcement;
  href?: string;
}) {
  const style = CATEGORY_STYLE[a.category] ?? CATEGORY_STYLE.COMMUNITY_NEWS;
  const dest  = href ?? `/news/${a.id}`;

  return (
    <Link
      href={dest}
      className={`group bg-white border-l-4 border border-brand-charcoal/10 hover:border-brand-navy/30 flex flex-col overflow-hidden h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${style.border}`}
    >
      {a.imageUrl && (
        <div className="aspect-video overflow-hidden border-b border-brand-charcoal/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            style={{ objectPosition: `${a.focalX}% ${a.focalY}%` }}
          />
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${style.badge}`}>
            {CATEGORY_LABEL[a.category] ?? a.category}
          </span>
          {a.pinned && (
            <span className="text-[10px] font-bold text-brand-neon/70 uppercase tracking-wide">Pinned</span>
          )}
          <span className="text-[10px] text-brand-charcoal/55 font-semibold ml-auto">
            {formatDate(a.publishedAt)}
          </span>
        </div>

        <h3 className="font-display font-black text-lg leading-snug text-brand-charcoal group-hover:text-brand-navy transition-colors">
          {a.title}
        </h3>

        <p className="text-sm text-brand-charcoal/55 leading-relaxed line-clamp-3 flex-1">
          {a.body.replace(/[#*`_>]/g, '').slice(0, 220)}
        </p>
      </div>

      {a.ctaLabel && (
        <div className="px-5 pb-5 pt-1 border-t border-brand-charcoal/5">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-brand-navy group-hover:text-brand-neon transition-colors">
            {a.ctaLabel} →
          </span>
        </div>
      )}
    </Link>
  );
}

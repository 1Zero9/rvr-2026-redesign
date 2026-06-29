import Link from 'next/link';
import type { Announcement } from '@prisma/client';

const CATEGORY_STYLE: Record<string, { strip: string; badge: string }> = {
  RECRUITMENT: { strip: 'bg-brand-neon',    badge: 'bg-brand-neon/20 text-brand-charcoal'   },
  EVENT:       { strip: 'bg-brand-sky',     badge: 'bg-brand-sky/20 text-brand-navy'        },
  NEWS:        { strip: 'bg-brand-green',   badge: 'bg-brand-green/10 text-brand-green'     },
  VOLUNTEER:   { strip: 'bg-brand-maroon',  badge: 'bg-brand-maroon/10 text-brand-maroon'   },
};

const CATEGORY_LABEL: Record<string, string> = {
  RECRUITMENT: 'Recruitment',
  EVENT:       'Event',
  NEWS:        'News',
  VOLUNTEER:   'Volunteer',
};

export default function AnnouncementCard({
  announcement: a,
  href,
}: {
  announcement: Announcement;
  href?: string;
}) {
  const style = CATEGORY_STYLE[a.category] ?? CATEGORY_STYLE.NEWS;
  const dest = href ?? `/news/${a.id}`;

  return (
    <Link
      href={dest}
      className="group bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden h-full"
    >
      <div className={`h-1 shrink-0 ${style.strip}`} />

      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${style.badge}`}>
            {CATEGORY_LABEL[a.category] ?? a.category}
          </span>
          {a.pinned && (
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Pinned</span>
          )}
          <span className="text-[10px] text-zinc-400 font-mono ml-auto">
            {new Date(a.publishedAt).toLocaleDateString('en-IE')}
          </span>
        </div>

        <h3 className="font-display font-black text-base leading-snug text-brand-charcoal group-hover:text-brand-green transition-colors">
          {a.title}
        </h3>

        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 flex-1">
          {a.body.replace(/[#*`_>]/g, '').slice(0, 220)}
        </p>
      </div>

      {a.ctaLabel && (
        <div className="px-5 pb-5 pt-1">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green group-hover:underline underline-offset-2">
            {a.ctaLabel} →
          </span>
        </div>
      )}
    </Link>
  );
}

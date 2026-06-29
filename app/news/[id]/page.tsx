import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, Tag } from 'lucide-react';
import PublicPageShell from '@/components/layout/PublicPageShell';
import { prisma } from '@/lib/prisma';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ id: string }>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const CATEGORY_STYLE: Record<string, { strip: string; badge: string; label: string }> = {
  RECRUITMENT: { strip: 'bg-brand-neon',   badge: 'bg-brand-neon/20 text-brand-charcoal', label: 'Recruitment' },
  EVENT:       { strip: 'bg-brand-sky',    badge: 'bg-brand-sky/20 text-brand-navy',      label: 'Event'       },
  NEWS:        { strip: 'bg-brand-green',  badge: 'bg-brand-green/10 text-brand-green',   label: 'News'        },
  VOLUNTEER:   { strip: 'bg-brand-maroon', badge: 'bg-brand-maroon/10 text-brand-maroon', label: 'Volunteer'   },
};

function renderBody(body: string) {
  return body.split(/\n\n+/).map((para, pIdx) => {
    const nodes: React.ReactNode[] = [];
    let text = para;
    let key = 0;

    while (text.length > 0) {
      const bold = text.match(/\*\*([^*]+)\*\*/);
      const link = text.match(/\[([^\]]+)\]\(([^)]+)\)/);

      const boldIdx = bold?.index ?? Infinity;
      const linkIdx = link?.index ?? Infinity;

      if (boldIdx === Infinity && linkIdx === Infinity) {
        nodes.push(<span key={key++}>{text.replace(/\n/g, ' ')}</span>);
        break;
      }

      if (boldIdx <= linkIdx && bold && bold.index !== undefined) {
        if (bold.index > 0) nodes.push(<span key={key++}>{text.slice(0, bold.index)}</span>);
        nodes.push(<strong key={key++} className="font-bold text-brand-charcoal">{bold[1]}</strong>);
        text = text.slice(bold.index + bold[0].length);
      } else if (link && link.index !== undefined) {
        if (link.index > 0) nodes.push(<span key={key++}>{text.slice(0, link.index)}</span>);
        nodes.push(
          <Link key={key++} href={link[2]} className="font-semibold text-brand-green underline underline-offset-2 hover:text-brand-charcoal">
            {link[1]}
          </Link>
        );
        text = text.slice(link.index + link[0].length);
      }
    }

    return (
      <p key={pIdx} className="text-sm sm:text-base font-semibold leading-7 text-zinc-700">
        {nodes}
      </p>
    );
  });
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const a = await prisma.announcement.findUnique({ where: { id } });
  if (!a || !a.isPublished) return { title: 'News | Rivervalley Rangers AFC' };
  return {
    title: `${a.title} | Rivervalley Rangers AFC`,
    description: a.body.replace(/[#*`_>\[\]()]/g, '').slice(0, 160),
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AnnouncementPage({ params }: Props) {
  const { id } = await params;

  const now = new Date();
  const a = await prisma.announcement.findUnique({ where: { id } });

  if (!a || !a.isPublished || (a.expiresAt && a.expiresAt < now)) {
    notFound();
  }

  const style = CATEGORY_STYLE[a.category] ?? CATEGORY_STYLE.NEWS;

  return (
    <PublicPageShell>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14 space-y-8">

        {/* Back link */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-400 hover:text-brand-navy transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All News
        </Link>

        {/* Card */}
        <article className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className={`h-1.5 ${style.strip}`} />

          <div className="p-6 sm:p-8 space-y-6">

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${style.badge}`}>
                <Tag className="h-3 w-3" aria-hidden="true" />
                {style.label}
              </span>
              {a.pinned && (
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Pinned</span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-mono ml-auto">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                {new Date(a.publishedAt).toLocaleDateString('en-IE', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-black italic text-3xl sm:text-4xl uppercase leading-tight text-brand-charcoal">
              {a.title}
            </h1>

            {/* Body */}
            <div className="space-y-4 border-t border-zinc-100 pt-6">
              {renderBody(a.body)}
            </div>

            {/* CTA */}
            {a.ctaLabel && a.ctaUrl && (
              <div className="border-t border-zinc-100 pt-6">
                <Link
                  href={a.ctaUrl}
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 bg-brand-green text-white text-sm font-bold rounded-xl hover:bg-[#004f3a] transition-colors"
                >
                  {a.ctaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            )}

          </div>
        </article>

        {/* Footer nav */}
        <div className="flex justify-between pt-2">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-400 hover:text-brand-navy transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to News
          </Link>
        </div>

      </div>
    </PublicPageShell>
  );
}

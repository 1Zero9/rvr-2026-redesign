import type { Metadata } from 'next';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin/require-admin';
import { prisma } from '@/lib/prisma';
import { getPendingShirts } from '@/lib/moderation/get-pending-shirts';
import ModerationActions from './ModerationActions';

export const metadata: Metadata = {
  title: 'Approvals | RVR Admin',
  robots: { index: false, follow: false },
};

const TAB_LINK = 'shrink-0 flex items-center gap-2 px-4 min-h-[44px] text-xs font-display font-black uppercase tracking-wide border-2 transition-colors';

async function moderateShirt(id: string, moderationStatus: 'APPROVED' | 'REJECTED') {
  'use server';
  await requireAdmin();
  await prisma.shirtSubmission.update({
    where: { id },
    data: { moderationStatus, reviewedAt: new Date(), reviewedBy: 'admin' },
  });
  revalidatePath('/admin/approvals');
}

async function moderateListing(id: string, moderationStatus: 'APPROVED' | 'REJECTED') {
  'use server';
  await requireAdmin();
  await prisma.bootRoomListing.update({
    where: { id },
    data: { moderationStatus, reviewedAt: new Date() },
  });
  revalidatePath('/admin/approvals');
  revalidatePath('/boot-room');
}

export default async function ApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireAdmin();
  const { tab } = await searchParams;
  const activeTab = tab === 'boot-room' ? 'boot-room' : 'shirts';

  const [shirts, listings] = await Promise.all([
    getPendingShirts(),
    prisma.bootRoomListing.findMany({ orderBy: { createdAt: 'desc' }, take: 200 }),
  ]);
  const pendingListings = listings.filter((l) => l.moderationStatus === 'PENDING').length;

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 text-brand-charcoal">
      <div className="mx-auto max-w-5xl">

        <h1 className="font-display text-4xl font-black uppercase italic text-brand-navy">
          Approvals
        </h1>
        <p className="mt-2 text-sm font-semibold text-zinc-600">
          Everything the public has submitted that needs a yes or a no.
        </p>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto">
          <Link
            href="/admin/approvals?tab=shirts"
            className={`${TAB_LINK} ${
              activeTab === 'shirts'
                ? 'border-brand-charcoal bg-brand-navy text-brand-cream'
                : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60 hover:border-brand-charcoal/50'
            }`}
          >
            Shirt Designs
            {shirts.length > 0 && (
              <span className="bg-brand-neon text-brand-charcoal px-1.5 min-w-[20px] text-center leading-[20px] text-[10px]">
                {shirts.length}
              </span>
            )}
          </Link>
          <Link
            href="/admin/approvals?tab=boot-room"
            className={`${TAB_LINK} ${
              activeTab === 'boot-room'
                ? 'border-brand-charcoal bg-brand-navy text-brand-cream'
                : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60 hover:border-brand-charcoal/50'
            }`}
          >
            Boot Room
            {pendingListings > 0 && (
              <span className="bg-brand-neon text-brand-charcoal px-1.5 min-w-[20px] text-center leading-[20px] text-[10px]">
                {pendingListings}
              </span>
            )}
          </Link>
        </div>

        {/* ── Shirt designs ── */}
        {activeTab === 'shirts' && (
          <div className="mt-6 grid gap-4">
            {shirts.length === 0 ? (
              <p className="border-3 border-brand-navy bg-white p-8 text-center font-bold">
                All clear — no shirt designs awaiting review.
              </p>
            ) : (
              shirts.map((s) => (
                <article
                  key={s.id}
                  className="border-3 border-brand-charcoal bg-white p-5 shadow-brutalist-charcoal"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Design preview */}
                    <a
                      href={s.designFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 self-start"
                    >
                      {s.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.thumbnailUrl}
                          alt={`Shirt design submitted by ${s.submitterName}`}
                          className="h-28 w-28 border-2 border-brand-charcoal/20 object-cover hover:border-brand-neon transition-colors"
                        />
                      ) : (
                        <span className="flex h-28 w-28 items-center justify-center border-2 border-dashed border-brand-charcoal/30 text-xs font-bold text-brand-charcoal/50 text-center px-2">
                          Open design file
                        </span>
                      )}
                    </a>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="bg-brand-navy text-white px-2 py-1 font-display text-[10px] font-black uppercase">
                          {s.size.replace(/_/g, ' ')}
                        </span>
                        <span className="bg-brand-charcoal/10 px-2 py-1 font-display text-[10px] font-black uppercase">
                          Qty {s.quantity}
                        </span>
                        {s.teamName && (
                          <span className="bg-brand-sky/30 px-2 py-1 font-display text-[10px] font-black uppercase">
                            {s.teamName}
                          </span>
                        )}
                      </div>
                      <h2 className="font-display text-xl font-black uppercase">{s.submitterName}</h2>
                      {s.playerName && (
                        <p className="text-sm font-semibold text-zinc-600">Print name: {s.playerName}</p>
                      )}
                      <p className="text-sm font-semibold text-zinc-700 mt-1">
                        <a href={`mailto:${s.submitterEmail}`} className="text-brand-navy underline">
                          {s.submitterEmail}
                        </a>
                      </p>
                      <p className="text-xs text-zinc-400 font-mono mt-1">
                        Submitted {s.createdAt.toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 sm:self-center">
                      <ModerationActions
                        approveAction={moderateShirt.bind(null, s.id, 'APPROVED')}
                        rejectAction={moderateShirt.bind(null, s.id, 'REJECTED')}
                      />
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* ── Boot Room listings ── */}
        {activeTab === 'boot-room' && (
          <div className="mt-6 grid gap-4">
            <p className="text-xs font-semibold text-zinc-500">
              Use private donor contacts only to coordinate approved exchanges.
            </p>
            {listings.length === 0 ? (
              <p className="border-3 border-brand-navy bg-white p-8 text-center font-bold">
                No Boot Room listings received.
              </p>
            ) : (
              listings.map((listing) => (
                <article
                  key={listing.id}
                  className="border-3 border-brand-charcoal bg-white p-5 shadow-brutalist-charcoal"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2">
                        {[listing.category, listing.itemCondition, listing.moderationStatus].map((label) => (
                          <span
                            key={label}
                            className={`px-2 py-1 font-display text-[10px] font-black uppercase ${
                              label === 'PENDING'
                                ? 'bg-brand-neon text-brand-charcoal'
                                : label === 'REJECTED'
                                  ? 'bg-brand-maroon text-white'
                                  : 'bg-brand-navy text-white'
                            }`}
                          >
                            {label.replaceAll('_', ' ')}
                          </span>
                        ))}
                      </div>
                      <h2 className="mt-3 font-display text-2xl font-black uppercase text-brand-navy">
                        {listing.title}
                      </h2>
                      {listing.size && (
                        <p className="mt-1 text-sm font-black text-brand-green">Size: {listing.size}</p>
                      )}
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                        {listing.description}
                      </p>
                      <div className="mt-4 border-t-2 border-brand-navy/10 pt-4 text-sm font-semibold text-zinc-600">
                        <p className="font-black text-brand-navy">{listing.donorName}</p>
                        <p>{[listing.donorEmail, listing.donorPhone].filter(Boolean).join(' · ')}</p>
                        <p className="mt-2 text-xs text-zinc-400">
                          {listing.createdAt.toLocaleString('en-IE')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 sm:flex-col shrink-0">
                      <form action={moderateListing.bind(null, listing.id, 'APPROVED')}>
                        <button
                          type="submit"
                          className="inline-flex min-h-11 w-full items-center justify-center border-2 border-brand-green bg-brand-neon px-4 font-display text-xs font-black uppercase"
                        >
                          Approve
                        </button>
                      </form>
                      <form action={moderateListing.bind(null, listing.id, 'REJECTED')}>
                        <button
                          type="submit"
                          className="inline-flex min-h-11 w-full items-center justify-center border-2 border-red-800 bg-red-50 px-4 font-display text-xs font-black uppercase text-red-800"
                        >
                          Reject
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

      </div>
    </main>
  );
}

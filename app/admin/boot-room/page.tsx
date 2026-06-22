import type { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import AdminNav from '@/components/admin/AdminNav';
import { requireAdmin } from '@/lib/admin/require-admin';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Boot Room Moderation | RVR Admin',
  robots: { index: false, follow: false },
};

async function moderateListing(
  id: string,
  moderationStatus: 'APPROVED' | 'REJECTED',
) {
  'use server';
  await requireAdmin();
  await prisma.bootRoomListing.update({
    where: { id },
    data: { moderationStatus, reviewedAt: new Date() },
  });
  revalidatePath('/admin/boot-room');
  revalidatePath('/boot-room');
}

export default async function BootRoomAdminPage() {
  const listings = await prisma.bootRoomListing.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 text-brand-charcoal">
      <div className="mx-auto max-w-6xl">
        <AdminNav />
        <h1 className="font-display text-4xl font-black uppercase italic text-brand-navy">
          Boot Room Moderation
        </h1>
        <p className="mt-2 text-sm font-semibold text-zinc-600">
          Review public item details and use private donor contacts only to
          coordinate approved exchanges.
        </p>

        <div className="mt-8 grid gap-4">
          {listings.length === 0 ? (
            <p className="border-3 border-brand-navy bg-white p-8 text-center font-bold">
              No Boot Room listings received.
            </p>
          ) : (
            listings.map((listing) => (
              <article
                key={listing.id}
                className="border-3 border-brand-charcoal bg-white p-5 shadow-[4px_4px_0_#121212]"
              >
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {[listing.category, listing.itemCondition, listing.moderationStatus].map(
                        (label) => (
                          <span
                            key={label}
                            className="bg-brand-navy px-2 py-1 font-display text-[10px] font-black uppercase text-white"
                          >
                            {label.replaceAll('_', ' ')}
                          </span>
                        ),
                      )}
                    </div>
                    <h2 className="mt-3 font-display text-2xl font-black uppercase text-brand-navy">
                      {listing.title}
                    </h2>
                    {listing.size && (
                      <p className="mt-1 text-sm font-black text-brand-green">
                        Size: {listing.size}
                      </p>
                    )}
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                      {listing.description}
                    </p>
                    <div className="mt-4 border-t-2 border-brand-navy/10 pt-4 text-sm font-semibold text-zinc-600">
                      <p className="font-black text-brand-navy">{listing.donorName}</p>
                      <p>
                        {[listing.donorEmail, listing.donorPhone]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                      <p className="mt-2 text-xs text-zinc-400">
                        {listing.createdAt.toLocaleString('en-IE')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 lg:flex-col">
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
      </div>
    </main>
  );
}

import type { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin/require-admin';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Public Enquiries | RVR Admin',
  robots: { index: false, follow: false },
};

async function markEnquiry(id: string, status: 'NEW' | 'RESOLVED') {
  'use server';
  await requireAdmin();
  await prisma.publicEnquiry.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin/enquiries');
}

export default async function EnquiriesPage() {
  const enquiries = await prisma.publicEnquiry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 text-brand-charcoal">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-4xl font-black uppercase italic text-brand-navy">
          Public Enquiries
        </h1>
        <p className="mt-2 text-sm font-semibold text-zinc-600">
          Callback, volunteering, coaching, programme, and sponsorship
          submissions from the public site.
        </p>

        <div className="mt-8 grid gap-4">
          {enquiries.length === 0 ? (
            <p className="border-3 border-brand-navy bg-white p-8 text-center font-bold">
              No enquiries received.
            </p>
          ) : (
            enquiries.map((enquiry) => {
              const action = markEnquiry.bind(
                null,
                enquiry.id,
                enquiry.status === 'NEW' ? 'RESOLVED' : 'NEW',
              );

              return (
                <article
                  key={enquiry.id}
                  className="border-3 border-brand-charcoal bg-white p-5 shadow-[4px_4px_0_#121212]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-brand-navy px-2 py-1 font-display text-[10px] font-black uppercase text-white">
                          {enquiry.type.replaceAll('_', ' ')}
                        </span>
                        <span
                          className={`px-2 py-1 font-display text-[10px] font-black uppercase ${
                            enquiry.status === 'NEW'
                              ? 'bg-brand-neon text-brand-charcoal'
                              : 'bg-zinc-200 text-zinc-600'
                          }`}
                        >
                          {enquiry.status}
                        </span>
                      </div>
                      <h2 className="mt-3 font-display text-xl font-black uppercase">
                        {enquiry.name}
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-zinc-600">
                        {[enquiry.email, enquiry.phone].filter(Boolean).join(' · ')}
                      </p>
                      {enquiry.details && (
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                          {enquiry.details}
                        </p>
                      )}
                      <p className="mt-3 text-xs font-bold text-zinc-400">
                        {enquiry.createdAt.toLocaleString('en-IE')}
                      </p>
                    </div>
                    <form action={action}>
                      <button
                        type="submit"
                        className="inline-flex min-h-11 items-center border-2 border-brand-navy px-4 font-display text-xs font-black uppercase text-brand-navy hover:bg-brand-navy hover:text-white"
                      >
                        Mark {enquiry.status === 'NEW' ? 'resolved' : 'new'}
                      </button>
                    </form>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}

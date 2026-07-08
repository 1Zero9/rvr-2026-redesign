import type { Metadata } from 'next';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import ClubMomentForm from '@/components/admin/ClubMomentForm';
import { requireAdmin } from '@/lib/admin/require-admin';

export const metadata: Metadata = {
  title: 'Club Moment | RVR Admin',
};

export default async function ClubMomentPage() {
  await requireAdmin();

  const moment = await prisma.clubMoment.upsert({
    where: { id: 'current' },
    update: {},
    create: {},
  });

  async function updateClubMoment(formData: FormData) {
    'use server';
    await requireAdmin();
    const { prisma: db } = await import('@/lib/prisma');
    await db.clubMoment.update({
      where: { id: 'current' },
      data: {
        label:          formData.get('label') as string,
        title:          formData.get('title') as string,
        imageUrl:       (formData.get('imageUrl') as string)       || null,
        mobileImageUrl: (formData.get('mobileImageUrl') as string) || null,
        focalX:         Number(formData.get('focalX') ?? 50),
        focalY:         Number(formData.get('focalY') ?? 0),
        ctaLabel:       formData.get('ctaLabel') as string,
        ctaUrl:         formData.get('ctaUrl') as string,
      },
    });
    revalidatePath('/');
    revalidatePath('/admin/club-moment');
  }

  const clubMomentData = {
    label:          moment.label,
    title:          moment.title,
    imageUrl:       moment.imageUrl,
    mobileImageUrl: moment.mobileImageUrl,
    focalX:         moment.focalX,
    focalY:         moment.focalY,
    ctaLabel:       moment.ctaLabel,
    ctaUrl:         moment.ctaUrl,
  };

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 text-brand-charcoal">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <Link
            href="/admin/noticeboard"
            className="text-sm text-brand-charcoal/50 hover:text-brand-navy transition-colors"
          >
            ← Back to Noticeboard
          </Link>
          <h1 className="font-display font-black italic text-4xl uppercase text-brand-navy mt-3">
            Club Moment
          </h1>
          <p className="text-brand-charcoal/60 text-sm mt-1">
            The photo, headline, and button on the homepage — the &ldquo;Your Saturday could look
            like this&rdquo; section.
          </p>
        </div>

        <ClubMomentForm data={clubMomentData} action={updateClubMoment} />

      </div>
    </main>
  );
}

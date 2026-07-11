import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import HeroMediaForm from '@/components/admin/HeroMediaForm';
import { requireAdmin } from '@/lib/admin/require-admin';
import type { HeroMotionEffect } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Edit Hero Media | RVR Admin',
};

export default async function EditHeroMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await prisma.heroMedia.findUnique({ where: { id } });
  if (!item) notFound();

  async function updateHeroMedia(formData: FormData) {
    'use server';
    await requireAdmin();
    const { prisma: db } = await import('@/lib/prisma');
    await db.heroMedia.update({
      where: { id },
      data: {
        url:            formData.get('url') as string,
        mobileImageUrl: (formData.get('mobileImageUrl') as string) || null,
        posterUrl:      (formData.get('posterUrl') as string)      || null,
        focalX:         Number(formData.get('focalX') ?? 50),
        focalY:         Number(formData.get('focalY') ?? 50),
        motionEffect:   formData.get('motionEffect') as HeroMotionEffect,
        isEnabled:      formData.get('isEnabled') === 'on',
        // sortOrder isn't edited here — reorder from the Hero Rotation list page.
      },
    });
    revalidatePath('/');
    revalidatePath('/admin/hero-media');
    redirect('/admin/hero-media');
  }

  async function deleteHeroMedia() {
    'use server';
    await requireAdmin();
    const { prisma: db } = await import('@/lib/prisma');
    await db.heroMedia.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin/hero-media');
    redirect('/admin/hero-media');
  }

  const data = {
    id:             item.id,
    type:           item.type,
    url:            item.url,
    mobileImageUrl: item.mobileImageUrl,
    posterUrl:      item.posterUrl,
    focalX:         item.focalX,
    focalY:         item.focalY,
    motionEffect:   item.motionEffect,
    isEnabled:      item.isEnabled,
    sortOrder:      item.sortOrder,
  };

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 text-brand-charcoal">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <Link
            href="/admin/hero-media"
            className="text-sm text-brand-charcoal/50 hover:text-brand-navy transition-colors"
          >
            ← Back to Hero Rotation
          </Link>
          <h1 className="font-display font-black italic text-4xl uppercase text-brand-navy mt-3">
            Edit Hero Media
          </h1>
          <p className="text-brand-charcoal/40 text-xs font-mono mt-1">{id}</p>
        </div>

        <HeroMediaForm data={data} action={updateHeroMedia} deleteAction={deleteHeroMedia} />

      </div>
    </main>
  );
}

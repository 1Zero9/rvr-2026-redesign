import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import HeroMediaForm from '@/components/admin/HeroMediaForm';
import { requireAdmin } from '@/lib/admin/require-admin';
import type { HeroMediaType, HeroMotionEffect } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Add Hero Media | RVR Admin',
};

export default async function NewHeroMediaPage() {
  await requireAdmin();

  async function createHeroMedia(formData: FormData) {
    'use server';
    await requireAdmin();
    const { prisma } = await import('@/lib/prisma');
    const type = formData.get('type') as HeroMediaType;
    await prisma.heroMedia.create({
      data: {
        type,
        url:            formData.get('url') as string,
        mobileImageUrl: (formData.get('mobileImageUrl') as string) || null,
        posterUrl:      (formData.get('posterUrl') as string)      || null,
        focalX:         Number(formData.get('focalX') ?? 50),
        focalY:         Number(formData.get('focalY') ?? 50),
        motionEffect:   formData.get('motionEffect') as HeroMotionEffect,
        isEnabled:      formData.get('isEnabled') === 'on',
        sortOrder:      Number(formData.get('sortOrder') ?? 0),
      },
    });
    revalidatePath('/');
    revalidatePath('/admin/hero-media');
    redirect('/admin/hero-media');
  }

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
            Add Hero Media
          </h1>
        </div>

        <HeroMediaForm action={createHeroMedia} />

      </div>
    </main>
  );
}

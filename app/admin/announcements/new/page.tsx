import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AnnouncementForm from '../_components/AnnouncementForm';
import { requireAdmin } from '@/lib/admin/require-admin';

export const metadata: Metadata = {
  title: 'New Announcement | RVR Admin',
};

export default function NewAnnouncementPage() {
  async function createAnnouncement(formData: FormData) {
    'use server';
    await requireAdmin();
    const { prisma } = await import('@/lib/prisma');
    await prisma.announcement.create({
      data: {
        title:       formData.get('title') as string,
        category:    formData.get('category') as 'BREAKING' | 'CONGRATULATIONS' | 'COMMUNITY_NEWS' | 'IN_SYMPATHY',
        body:        formData.get('body') as string,
        imageUrl:    (formData.get('imageUrl') as string)  || null,
        ctaLabel:    (formData.get('ctaLabel') as string)  || null,
        ctaUrl:      (formData.get('ctaUrl') as string)    || null,
        expiresAt:   formData.get('expiresAt')
                       ? new Date(formData.get('expiresAt') as string)
                       : null,
        isPublished: formData.get('isPublished') === 'on',
        pinned:      formData.get('pinned') === 'on',
      },
    });
    redirect('/admin/noticeboard');
  }

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
            New Announcement
          </h1>
        </div>

        <AnnouncementForm action={createAnnouncement} />

      </div>
    </main>
  );
}

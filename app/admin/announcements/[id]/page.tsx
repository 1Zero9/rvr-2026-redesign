import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AnnouncementForm from '../_components/AnnouncementForm';
import { requireAdmin } from '@/lib/admin/require-admin';

export const metadata: Metadata = {
  title: 'Edit Announcement | RVR Admin',
};

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) notFound();

  async function updateAnnouncement(formData: FormData) {
    'use server';
    await requireAdmin();
    const { prisma: db } = await import('@/lib/prisma');
    await db.announcement.update({
      where: { id },
      data: {
        title:       formData.get('title') as string,
        category:    formData.get('category') as 'RECRUITMENT' | 'EVENT' | 'NEWS' | 'VOLUNTEER',
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
    redirect('/admin/announcements');
  }

  async function deleteAnnouncement() {
    'use server';
    await requireAdmin();
    const { prisma: db } = await import('@/lib/prisma');
    await db.announcement.delete({ where: { id } });
    redirect('/admin/announcements');
  }

  const initialData = {
    id:          announcement.id,
    title:       announcement.title,
    category:    announcement.category,
    body:        announcement.body,
    imageUrl:    announcement.imageUrl,
    ctaLabel:    announcement.ctaLabel,
    ctaUrl:      announcement.ctaUrl,
    expiresAt:   announcement.expiresAt?.toISOString() ?? null,
    isPublished: announcement.isPublished,
    pinned:      announcement.pinned,
  };

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 text-brand-charcoal">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <Link
            href="/admin/announcements"
            className="text-sm text-brand-charcoal/50 hover:text-brand-navy transition-colors"
          >
            ← Back to Announcements
          </Link>
          <h1 className="font-display font-black italic text-4xl uppercase text-brand-navy mt-3">
            Edit Announcement
          </h1>
          <p className="text-brand-charcoal/40 text-xs font-mono mt-1">{id}</p>
        </div>

        <AnnouncementForm
          action={updateAnnouncement}
          deleteAction={deleteAnnouncement}
          initialData={initialData}
        />

      </div>
    </main>
  );
}

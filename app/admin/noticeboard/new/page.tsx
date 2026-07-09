import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import NoticeForm from '../_components/NoticeForm';
import { requireAdmin } from '@/lib/admin/require-admin';
import type { CampaignAudience } from '@prisma/client';

export const metadata: Metadata = {
  title: 'New Notice | RVR Admin',
};

export default async function NewNoticePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const initialType = type === 'campaign' ? 'campaign' : 'news';

  async function createNews(formData: FormData) {
    'use server';
    await requireAdmin();
    const { prisma } = await import('@/lib/prisma');
    const created = await prisma.announcement.create({
      data: {
        title:       formData.get('title') as string,
        category:    formData.get('category') as 'BREAKING' | 'CONGRATULATIONS' | 'COMMUNITY_NEWS' | 'IN_SYMPATHY',
        body:        formData.get('body') as string,
        imageUrl:    (formData.get('imageUrl') as string)  || null,
        focalX:      Number(formData.get('focalX') ?? 50),
        focalY:      Number(formData.get('focalY') ?? 50),
        ctaLabel:    (formData.get('ctaLabel') as string)  || null,
        ctaUrl:      (formData.get('ctaUrl') as string)    || null,
        expiresAt:   formData.get('expiresAt')
                       ? new Date(formData.get('expiresAt') as string)
                       : null,
        isPublished: formData.get('isPublished') === 'on',
        pinned:      formData.get('pinned') === 'on',
      },
    });
    revalidatePath('/');
    revalidatePath('/news');
    if (created.isPublished) {
      const { pingIndexNow } = await import('@/lib/seo/indexnow');
      await pingIndexNow(['/', '/news', `/news/${created.id}`, '/sitemap.xml']);
    }
    redirect('/admin/noticeboard');
  }

  async function createCampaign(formData: FormData) {
    'use server';
    await requireAdmin();
    const { prisma } = await import('@/lib/prisma');
    const created = await prisma.campaign.create({
      data: {
        title:          formData.get('title') as string,
        subtitle:       (formData.get('subtitle') as string)       || null,
        heroImageUrl:   (formData.get('heroImageUrl') as string)   || null,
        mobileImageUrl: (formData.get('mobileImageUrl') as string) || null,
        ctaLabel:       formData.get('ctaLabel') as string,
        ctaUrl:         formData.get('ctaUrl') as string,
        audience:       formData.get('audience') as CampaignAudience,
        showOnHomepage: formData.get('showOnHomepage') === 'on',
        showBanner:     formData.get('showBanner') === 'on',
        showInHero:     formData.get('showInHero') === 'on',
        focalX:         Number(formData.get('focalX') ?? 50),
        focalY:         Number(formData.get('focalY') ?? 50),
        startsAt:       new Date(formData.get('startsAt') as string),
        endsAt:         formData.get('endsAt')
                          ? new Date(formData.get('endsAt') as string)
                          : null,
        isPublished:    formData.get('isPublished') === 'on',
      },
    });
    revalidatePath('/');
    revalidatePath('/campaigns');
    revalidatePath('/news');
    if (created.isPublished) {
      const { pingIndexNow } = await import('@/lib/seo/indexnow');
      await pingIndexNow(['/', '/campaigns', '/sitemap.xml']);
    }
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
            New Notice
          </h1>
        </div>

        <NoticeForm
          initialType={initialType}
          newsAction={createNews}
          campaignAction={createCampaign}
        />

      </div>
    </main>
  );
}

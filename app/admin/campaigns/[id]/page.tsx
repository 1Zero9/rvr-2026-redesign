import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import NoticeForm from '@/app/admin/noticeboard/_components/NoticeForm';
import { requireAdmin } from '@/lib/admin/require-admin';
import type { CampaignAudience } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Edit Campaign | RVR Admin',
};

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) notFound();

  async function updateCampaign(formData: FormData) {
    'use server';
    await requireAdmin();
    const { prisma: db } = await import('@/lib/prisma');
    await db.campaign.update({
      where: { id },
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
    if (formData.get('isPublished') === 'on') {
      const { pingIndexNow } = await import('@/lib/seo/indexnow');
      await pingIndexNow(['/', '/campaigns', '/sitemap.xml']);
    }
    redirect('/admin/noticeboard');
  }

  async function deleteCampaign() {
    'use server';
    await requireAdmin();
    const { prisma: db } = await import('@/lib/prisma');
    await db.campaign.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/campaigns');
    revalidatePath('/news');
    const { pingIndexNow } = await import('@/lib/seo/indexnow');
    await pingIndexNow(['/', '/campaigns', '/sitemap.xml']);
    redirect('/admin/noticeboard');
  }

  const campaignData = {
    id:             campaign.id,
    title:          campaign.title,
    subtitle:       campaign.subtitle,
    heroImageUrl:   campaign.heroImageUrl,
    mobileImageUrl: campaign.mobileImageUrl,
    ctaLabel:       campaign.ctaLabel,
    ctaUrl:         campaign.ctaUrl,
    audience:       campaign.audience,
    showOnHomepage: campaign.showOnHomepage,
    showBanner:     campaign.showBanner,
    showInHero:     campaign.showInHero,
    focalX:         campaign.focalX,
    focalY:         campaign.focalY,
    startsAt:       campaign.startsAt.toISOString(),
    endsAt:         campaign.endsAt?.toISOString() ?? null,
    isPublished:    campaign.isPublished,
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
            Edit Campaign
          </h1>
          <p className="text-brand-charcoal/40 text-xs font-mono mt-1">{id}</p>
        </div>

        <NoticeForm
          initialType="campaign"
          lockType
          campaignAction={updateCampaign}
          deleteAction={deleteCampaign}
          campaignData={campaignData}
        />

      </div>
    </main>
  );
}

-- CreateEnum
CREATE TYPE "CampaignAudience" AS ENUM ('EVERYONE', 'PARENTS', 'PLAYERS', 'COACHES', 'VOLUNTEERS', 'SPONSORS');

-- CreateEnum
CREATE TYPE "CampaignPlacement" AS ENUM ('CAMPAIGNS_PAGE', 'HOMEPAGE', 'SITEWIDE_BANNER');

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "heroImageUrl" TEXT,
    "mobileImageUrl" TEXT,
    "ctaLabel" TEXT NOT NULL,
    "ctaUrl" TEXT NOT NULL,
    "audience" "CampaignAudience" NOT NULL DEFAULT 'EVERYONE',
    "placement" "CampaignPlacement" NOT NULL DEFAULT 'CAMPAIGNS_PAGE',
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Campaign_isPublished_placement_startsAt_idx" ON "Campaign"("isPublished", "placement", "startsAt");

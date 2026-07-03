-- Convert single placement enum to independent placement toggles.
-- Backfill BEFORE dropping the column so live campaigns keep their placement.

ALTER TABLE "Campaign" ADD COLUMN "showOnHomepage" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Campaign" ADD COLUMN "showBanner" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Campaign" SET "showOnHomepage" = true WHERE "placement" = 'HOMEPAGE';
UPDATE "Campaign" SET "showBanner" = true WHERE "placement" = 'SITEWIDE_BANNER';

DROP INDEX IF EXISTS "Campaign_isPublished_placement_startsAt_idx";
ALTER TABLE "Campaign" DROP COLUMN "placement";
DROP TYPE "CampaignPlacement";

CREATE INDEX "Campaign_isPublished_startsAt_idx" ON "Campaign"("isPublished", "startsAt");

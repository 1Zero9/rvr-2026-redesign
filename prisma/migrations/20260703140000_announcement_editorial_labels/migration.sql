-- Replace announcement categories with editorial labels.
-- All existing rows map to COMMUNITY_NEWS; admins can relabel individually.

CREATE TYPE "AnnouncementCategory_new" AS ENUM ('BREAKING', 'CONGRATULATIONS', 'COMMUNITY_NEWS', 'IN_SYMPATHY');

ALTER TABLE "Announcement"
  ALTER COLUMN "category" TYPE "AnnouncementCategory_new"
  USING ('COMMUNITY_NEWS')::"AnnouncementCategory_new";

DROP TYPE "AnnouncementCategory";
ALTER TYPE "AnnouncementCategory_new" RENAME TO "AnnouncementCategory";

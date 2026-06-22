CREATE TABLE "BootRoomListing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "size" TEXT,
    "itemCondition" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "donorEmail" TEXT,
    "donorPhone" TEXT,
    "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootRoomListing_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BootRoomListing_moderationStatus_createdAt_idx"
ON "BootRoomListing"("moderationStatus", "createdAt");

CREATE INDEX "BootRoomListing_category_moderationStatus_idx"
ON "BootRoomListing"("category", "moderationStatus");

-- CreateTable
CREATE TABLE "SiteFeature" (
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteFeature_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "PublicEnquiry" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "details" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SiteFeature_enabled_idx" ON "SiteFeature"("enabled");

-- CreateIndex
CREATE INDEX "PublicEnquiry_type_status_idx" ON "PublicEnquiry"("type", "status");

-- CreateIndex
CREATE INDEX "PublicEnquiry_createdAt_idx" ON "PublicEnquiry"("createdAt");

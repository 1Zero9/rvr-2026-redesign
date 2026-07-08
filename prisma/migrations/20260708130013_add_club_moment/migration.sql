-- CreateTable
CREATE TABLE "ClubMoment" (
    "id" TEXT NOT NULL DEFAULT 'current',
    "label" TEXT NOT NULL DEFAULT 'U11s · Cup Winners',
    "title" TEXT NOT NULL DEFAULT 'Your Saturday could look like this',
    "imageUrl" TEXT,
    "mobileImageUrl" TEXT,
    "focalX" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "focalY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ctaLabel" TEXT NOT NULL DEFAULT 'Join Us',
    "ctaUrl" TEXT NOT NULL DEFAULT '/register',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubMoment_pkey" PRIMARY KEY ("id")
);

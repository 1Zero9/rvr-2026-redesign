-- CreateEnum
CREATE TYPE "HeroMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "HeroMotionEffect" AS ENUM ('NONE', 'ZOOM_IN', 'ZOOM_OUT', 'PIXELATE');

-- CreateTable
CREATE TABLE "HeroMedia" (
    "id" TEXT NOT NULL,
    "type" "HeroMediaType" NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "mobileImageUrl" TEXT,
    "posterUrl" TEXT,
    "focalX" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "focalY" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "motionEffect" "HeroMotionEffect" NOT NULL DEFAULT 'NONE',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HeroMedia_isEnabled_sortOrder_idx" ON "HeroMedia"("isEnabled", "sortOrder");

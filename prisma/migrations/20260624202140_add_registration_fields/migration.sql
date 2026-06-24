-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('NEW', 'CONTACTED', 'WAITLISTED', 'ENROLLED', 'DECLINED');

-- CreateEnum
CREATE TYPE "PlayerGender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "ParentConsent" ADD COLUMN     "parentPhone" TEXT;

-- AlterTable
ALTER TABLE "PlayerProfile" ADD COLUMN     "gender" "PlayerGender",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "registrationStatus" "RegistrationStatus" NOT NULL DEFAULT 'NEW';

-- CreateIndex
CREATE INDEX "PlayerProfile_registrationStatus_createdAt_idx" ON "PlayerProfile"("registrationStatus", "createdAt");

-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "isDemo" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Competition_isDemo_idx" ON "Competition"("isDemo");

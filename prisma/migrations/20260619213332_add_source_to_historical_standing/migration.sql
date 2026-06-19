-- AlterTable
ALTER TABLE "HistoricalStanding" ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'DDSL';

-- CreateIndex
CREATE INDEX "HistoricalStanding_seasonId_source_idx" ON "HistoricalStanding"("seasonId", "source");

-- CreateTable
CREATE TABLE "ShirtSubmission" (
    "id" TEXT NOT NULL,
    "submitterName" TEXT NOT NULL,
    "submitterEmail" TEXT NOT NULL,
    "playerName" TEXT,
    "teamName" TEXT,
    "designNotes" TEXT,
    "designFileUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "size" "ClothingSize" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "moderationNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentReference" TEXT,
    "totalAmountCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShirtSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShirtSubmission_paymentReference_key" ON "ShirtSubmission"("paymentReference");

-- CreateIndex
CREATE INDEX "ShirtSubmission_moderationStatus_idx" ON "ShirtSubmission"("moderationStatus");

-- CreateIndex
CREATE INDEX "ShirtSubmission_submitterEmail_idx" ON "ShirtSubmission"("submitterEmail");

-- CreateIndex
CREATE INDEX "ShirtSubmission_moderationStatus_createdAt_idx" ON "ShirtSubmission"("moderationStatus", "createdAt");

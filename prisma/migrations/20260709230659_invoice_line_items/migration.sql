-- CreateTable
CREATE TABLE "InvoiceLineItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "priceCents" INTEGER,
    "workDate" TIMESTAMP(3),
    "commitSha" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceLineItem_commitSha_key" ON "InvoiceLineItem"("commitSha");

-- CreateIndex
CREATE INDEX "InvoiceLineItem_workDate_idx" ON "InvoiceLineItem"("workDate");

-- AlterTable
ALTER TABLE "InvoiceLineItem" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'New Feature';

-- CreateIndex
CREATE INDEX "InvoiceLineItem_category_idx" ON "InvoiceLineItem"("category");

/*
  Warnings:

  - You are about to drop the `_splTouploaded_image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_splTouploaded_image" DROP CONSTRAINT "_splTouploaded_image_A_fkey";

-- DropForeignKey
ALTER TABLE "_splTouploaded_image" DROP CONSTRAINT "_splTouploaded_image_B_fkey";

-- AlterTable
ALTER TABLE "spl" ALTER COLUMN "listing_price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "spl_mint" ALTER COLUMN "spl_mint_fee_dollars" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "spl_mint_fee_sol" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "spl_transfer" ALTER COLUMN "spl_mint_fee_dollars" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "spl_mint_fee_sol" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "_splTouploaded_image";

-- CreateIndex
CREATE INDEX "spl__uploaded_image_id_idx" ON "spl"("uploaded_image_id");

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_uploaded_image_id_fkey" FOREIGN KEY ("uploaded_image_id") REFERENCES "uploaded_image"("uploaded_image_id") ON DELETE RESTRICT ON UPDATE CASCADE;

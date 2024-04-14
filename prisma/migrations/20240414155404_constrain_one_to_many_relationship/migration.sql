/*
  Warnings:

  - The primary key for the `spl_mint` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `splt_mint_id` on the `spl_mint` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uploaded_image_id]` on the table `spl` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uploaded_video_id]` on the table `spl` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spl_mint_id]` on the table `spl_purchase` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sol_transfer_id]` on the table `spl_purchase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `purchaser_token_account_id` to the `spl_purchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "spl_purchase" DROP CONSTRAINT "spl_purchase_spl_mint_id_fkey";

-- AlterTable
ALTER TABLE "spl_mint" DROP CONSTRAINT "spl_mint_pkey",
DROP COLUMN "splt_mint_id",
ADD COLUMN     "spl_mint_id" SERIAL NOT NULL,
ADD CONSTRAINT "spl_mint_pkey" PRIMARY KEY ("spl_mint_id");

-- AlterTable
ALTER TABLE "spl_purchase" ADD COLUMN     "purchaser_token_account_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "spl_uploaded_image_id_key" ON "spl"("uploaded_image_id");

-- CreateIndex
CREATE UNIQUE INDEX "spl_uploaded_video_id_key" ON "spl"("uploaded_video_id");

-- CreateIndex
CREATE UNIQUE INDEX "spl_purchase_spl_mint_id_key" ON "spl_purchase"("spl_mint_id");

-- CreateIndex
CREATE UNIQUE INDEX "spl_purchase_sol_transfer_id_key" ON "spl_purchase"("sol_transfer_id");

-- AddForeignKey
ALTER TABLE "spl_purchase" ADD CONSTRAINT "spl_purchase_spl_mint_id_fkey" FOREIGN KEY ("spl_mint_id") REFERENCES "spl_mint"("spl_mint_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_purchase" ADD CONSTRAINT "spl_purchase_purchaser_token_account_id_fkey" FOREIGN KEY ("purchaser_token_account_id") REFERENCES "token_account"("token_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

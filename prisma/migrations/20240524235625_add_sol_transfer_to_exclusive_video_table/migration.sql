/*
  Warnings:

  - A unique constraint covering the columns `[sol_transfer_id]` on the table `exclusive_spl_purchase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sol_transfer_id` to the `exclusive_spl_purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exclusive_spl_purchase" ADD COLUMN     "sol_transfer_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "exclusive_spl_purchase_sol_transfer_id_key" ON "exclusive_spl_purchase"("sol_transfer_id");

-- CreateIndex
CREATE INDEX "exclusive_spl_purchasee__sol_transfer_id_idx" ON "exclusive_spl_purchase"("sol_transfer_id");

-- AddForeignKey
ALTER TABLE "exclusive_spl_purchase" ADD CONSTRAINT "exclusive_spl_purchase_sol_transfer_id_fkey" FOREIGN KEY ("sol_transfer_id") REFERENCES "sol_transfer"("sol_transfer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

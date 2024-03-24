/*
  Warnings:

  - You are about to drop the column `chain_address` on the `spl` table. All the data in the column will be lost.
  - You are about to drop the column `listing_price` on the `spl` table. All the data in the column will be lost.
  - Added the required column `listing_price_per_share_sol` to the `spl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spl" DROP COLUMN "chain_address",
DROP COLUMN "listing_price",
ADD COLUMN     "listing_price_per_share_sol" DOUBLE PRECISION NOT NULL;

/*
  Warnings:

  - You are about to drop the column `listing_currency_peg` on the `spl` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "spl" DROP COLUMN "listing_currency_peg",
ADD COLUMN     "listing_price_per_share_usd" DOUBLE PRECISION,
ALTER COLUMN "listing_price_per_share" DROP NOT NULL;

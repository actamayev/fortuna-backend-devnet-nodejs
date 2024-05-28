/*
  Warnings:

  - You are about to drop the column `listing_price_to_access_exclusive_content_usd` on the `spl` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "spl" DROP COLUMN "listing_price_to_access_exclusive_content_usd",
ADD COLUMN     "instant_access_price_to_exclusive_content_usd" DOUBLE PRECISION;

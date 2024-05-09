/*
  Warnings:

  - You are about to drop the column `listing_price_per_share` on the `spl` table. All the data in the column will be lost.
  - Made the column `listing_price_per_share_usd` on table `spl` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "spl" DROP COLUMN "listing_price_per_share",
ALTER COLUMN "listing_price_per_share_usd" SET NOT NULL;

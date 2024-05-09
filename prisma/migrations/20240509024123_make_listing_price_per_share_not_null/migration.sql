/*
  Warnings:

  - Made the column `listing_price_per_share` on table `spl` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "spl" ALTER COLUMN "listing_price_per_share" SET NOT NULL;

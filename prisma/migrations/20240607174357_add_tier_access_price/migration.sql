/*
  Warnings:

  - Added the required column `tier_access_price_usd` to the `video_access_tier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "video_access_tier" ADD COLUMN     "tier_access_price_usd" DOUBLE PRECISION NOT NULL;

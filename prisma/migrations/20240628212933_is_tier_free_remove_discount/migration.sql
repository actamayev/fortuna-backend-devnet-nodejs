/*
  Warnings:

  - You are about to drop the column `percent_discount_at_this_tier` on the `video_access_tier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "video_access_tier" DROP COLUMN "percent_discount_at_this_tier",
ADD COLUMN     "is_tier_free" BOOLEAN NOT NULL DEFAULT false;

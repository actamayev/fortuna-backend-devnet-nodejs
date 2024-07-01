/*
  Warnings:

  - You are about to drop the column `is_tier_free` on the `video_access_tier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "video_access_tier" DROP COLUMN "is_tier_free";

/*
  Warnings:

  - Added the required column `video_access_tier_number` to the `exclusive_video_access_purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exclusive_video_access_purchase" ADD COLUMN     "video_access_tier_number" INTEGER NOT NULL;

/*
  Warnings:

  - Made the column `video_duration_seconds` on table `uploaded_video` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "uploaded_video" ALTER COLUMN "video_duration_seconds" SET NOT NULL;

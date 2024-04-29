/*
  Warnings:

  - Made the column `original_content_url` on table `spl` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "spl" ALTER COLUMN "original_content_url" SET NOT NULL,
ALTER COLUMN "original_content_url" SET DEFAULT '';

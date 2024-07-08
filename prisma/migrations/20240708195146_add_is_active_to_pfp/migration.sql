/*
  Warnings:

  - You are about to drop the column `is_active` on the `channel_name` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "channel_name" DROP COLUMN "is_active";

-- AlterTable
ALTER TABLE "profile_picture" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

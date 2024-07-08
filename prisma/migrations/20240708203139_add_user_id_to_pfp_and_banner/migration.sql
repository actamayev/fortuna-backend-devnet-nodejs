/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `channel_banner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `profile_picture` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `channel_banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `profile_picture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "channel_banner" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "profile_picture" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "channel_banner_user_id_key" ON "channel_banner"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_picture_user_id_key" ON "profile_picture"("user_id");

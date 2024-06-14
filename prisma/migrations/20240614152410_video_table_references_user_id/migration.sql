/*
  Warnings:

  - You are about to drop the column `creator_wallet_id` on the `video` table. All the data in the column will be lost.
  - Added the required column `creator_user_id` to the `video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "video" DROP CONSTRAINT "video_creator_wallet_id_fkey";

-- DropIndex
DROP INDEX "video__creator_wallet_id_idx";

-- AlterTable
ALTER TABLE "video" DROP COLUMN "creator_wallet_id",
ADD COLUMN     "creator_user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "video__creator_user_id_idx" ON "video"("creator_user_id");

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_creator_user_id_fkey" FOREIGN KEY ("creator_user_id") REFERENCES "credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

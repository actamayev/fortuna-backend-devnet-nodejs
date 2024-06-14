/*
  Warnings:

  - You are about to drop the column `solana_wallet_id` on the `exclusive_video_access_purchase` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[video_id,user_id]` on the table `exclusive_video_access_purchase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `exclusive_video_access_purchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "exclusive_video_access_purchase" DROP CONSTRAINT "exclusive_video_access_purchase_solana_wallet_id_fkey";

-- DropIndex
DROP INDEX "exclusive_video_access_purchase__solana_wallet_id_idx";

-- DropIndex
DROP INDEX "exclusive_video_access_purchase_video_id_solana_wallet_id_key";

-- AlterTable
ALTER TABLE "exclusive_video_access_purchase" DROP COLUMN "solana_wallet_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "exclusive_video_access_purchase__user_id_idx" ON "exclusive_video_access_purchase"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "exclusive_video_access_purchase_video_id_user_id_key" ON "exclusive_video_access_purchase"("video_id", "user_id");

-- AddForeignKey
ALTER TABLE "exclusive_video_access_purchase" ADD CONSTRAINT "exclusive_video_access_purchase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

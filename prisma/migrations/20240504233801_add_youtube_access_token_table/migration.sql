/*
  Warnings:

  - A unique constraint covering the columns `[youtube_access_tokens_id]` on the table `credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "profile_picture_profile_picture_id_key";

-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "youtube_access_tokens_id" INTEGER;

-- CreateTable
CREATE TABLE "youtube_access_tokens" (
    "youtube_access_tokens_id" SERIAL NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "youtube_access_tokens_pkey" PRIMARY KEY ("youtube_access_tokens_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credentials_youtube_access_tokens_id_key" ON "credentials"("youtube_access_tokens_id");

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_youtube_access_tokens_id_fkey" FOREIGN KEY ("youtube_access_tokens_id") REFERENCES "youtube_access_tokens"("youtube_access_tokens_id") ON DELETE SET NULL ON UPDATE CASCADE;

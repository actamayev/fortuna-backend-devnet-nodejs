/*
  Warnings:

  - A unique constraint covering the columns `[channel_banner_id]` on the table `credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "channel_banner_id" INTEGER;

-- CreateTable
CREATE TABLE "channel_banner" (
    "channel_banner_id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_banner_pkey" PRIMARY KEY ("channel_banner_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credentials_channel_banner_id_key" ON "credentials"("channel_banner_id");

-- CreateIndex
CREATE INDEX "credentials__channel_banner_id_idx" ON "credentials"("channel_banner_id");

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_channel_banner_id_fkey" FOREIGN KEY ("channel_banner_id") REFERENCES "channel_banner"("channel_banner_id") ON DELETE SET NULL ON UPDATE CASCADE;

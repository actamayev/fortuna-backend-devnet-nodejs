/*
  Warnings:

  - Added the required column `uploaded_video_id` to the `spl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spl" ADD COLUMN     "uploaded_video_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "uploaded_video" (
    "uploaded_video_id" SERIAL NOT NULL,
    "video_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_video_pkey" PRIMARY KEY ("uploaded_video_id")
);

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_uploaded_video_id_fkey" FOREIGN KEY ("uploaded_video_id") REFERENCES "uploaded_video"("uploaded_video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `uploaded_image_id` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_key` to the `token_account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spl" ADD COLUMN     "uploaded_image_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "token_account" ADD COLUMN     "public_key" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "uploaded_images" (
    "uploaded_images_id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_images_pkey" PRIMARY KEY ("uploaded_images_id")
);

-- CreateTable
CREATE TABLE "_splTouploaded_images" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_splTouploaded_images_AB_unique" ON "_splTouploaded_images"("A", "B");

-- CreateIndex
CREATE INDEX "_splTouploaded_images_B_index" ON "_splTouploaded_images"("B");

-- AddForeignKey
ALTER TABLE "_splTouploaded_images" ADD CONSTRAINT "_splTouploaded_images_A_fkey" FOREIGN KEY ("A") REFERENCES "spl"("spl_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_splTouploaded_images" ADD CONSTRAINT "_splTouploaded_images_B_fkey" FOREIGN KEY ("B") REFERENCES "uploaded_images"("uploaded_images_id") ON DELETE CASCADE ON UPDATE CASCADE;

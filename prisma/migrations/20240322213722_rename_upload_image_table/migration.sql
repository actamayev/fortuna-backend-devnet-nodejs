/*
  Warnings:

  - You are about to drop the `_splTouploaded_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `uploaded_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_splTouploaded_images" DROP CONSTRAINT "_splTouploaded_images_A_fkey";

-- DropForeignKey
ALTER TABLE "_splTouploaded_images" DROP CONSTRAINT "_splTouploaded_images_B_fkey";

-- DropTable
DROP TABLE "_splTouploaded_images";

-- DropTable
DROP TABLE "uploaded_images";

-- CreateTable
CREATE TABLE "uploaded_image" (
    "uploaded_image_id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_image_pkey" PRIMARY KEY ("uploaded_image_id")
);

-- CreateTable
CREATE TABLE "_splTouploaded_image" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_splTouploaded_image_AB_unique" ON "_splTouploaded_image"("A", "B");

-- CreateIndex
CREATE INDEX "_splTouploaded_image_B_index" ON "_splTouploaded_image"("B");

-- AddForeignKey
ALTER TABLE "_splTouploaded_image" ADD CONSTRAINT "_splTouploaded_image_A_fkey" FOREIGN KEY ("A") REFERENCES "spl"("spl_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_splTouploaded_image" ADD CONSTRAINT "_splTouploaded_image_B_fkey" FOREIGN KEY ("B") REFERENCES "uploaded_image"("uploaded_image_id") ON DELETE CASCADE ON UPDATE CASCADE;

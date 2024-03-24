/*
  Warnings:

  - You are about to drop the column `fileName` on the `uploaded_image` table. All the data in the column will be lost.
  - Added the required column `file_name` to the `uploaded_image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "uploaded_image" DROP COLUMN "fileName",
ADD COLUMN     "file_name" TEXT NOT NULL;

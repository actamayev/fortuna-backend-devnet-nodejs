/*
  Warnings:

  - Added the required column `initial_creator_ownership_percentage` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `spl` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "spl" ADD COLUMN     "initial_creator_ownership_percentage" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

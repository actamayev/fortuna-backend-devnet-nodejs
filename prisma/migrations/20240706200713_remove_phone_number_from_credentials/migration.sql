/*
  Warnings:

  - You are about to drop the column `phone_number__encrypted` on the `credentials` table. All the data in the column will be lost.
  - Made the column `email__encrypted` on table `credentials` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "credentials" DROP COLUMN "phone_number__encrypted",
ALTER COLUMN "email__encrypted" SET NOT NULL;

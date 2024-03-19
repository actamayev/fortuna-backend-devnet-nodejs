/*
  Warnings:

  - You are about to drop the column `mintAddress` on the `NFT` table. All the data in the column will be lost.
  - Added the required column `chainAddress` to the `NFT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metaDataAddress` to the `NFT` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NFT" DROP COLUMN "mintAddress",
ADD COLUMN     "chainAddress" TEXT NOT NULL,
ADD COLUMN     "metaDataAddress" TEXT NOT NULL;

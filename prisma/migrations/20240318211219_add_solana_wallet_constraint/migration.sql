/*
  Warnings:

  - A unique constraint covering the columns `[userId,networkType]` on the table `SolanaWallet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SolanaWallet_userId_networkType_key" ON "SolanaWallet"("userId", "networkType");

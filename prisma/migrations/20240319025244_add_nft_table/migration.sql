-- CreateTable
CREATE TABLE "NFT" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "walletId" INTEGER NOT NULL,
    "metaDataUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "nftName" TEXT NOT NULL,
    "description" TEXT,
    "mintAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NFT_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "nft_userId_idx" ON "NFT"("userId");

-- CreateIndex
CREATE INDEX "nft_walletId_idx" ON "NFT"("walletId");

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "SolanaWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

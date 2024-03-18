-- CreateTable
CREATE TABLE "SolanaWallet" (
    "id" SERIAL NOT NULL,
    "publicKey" VARCHAR(255) NOT NULL,
    "secretKey" VARCHAR(255) NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SolanaWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SolanaWallet_userId_key" ON "SolanaWallet"("userId");

-- CreateIndex
CREATE INDEX "userId_idx" ON "SolanaWallet"("userId");

-- AddForeignKey
ALTER TABLE "SolanaWallet" ADD CONSTRAINT "SolanaWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

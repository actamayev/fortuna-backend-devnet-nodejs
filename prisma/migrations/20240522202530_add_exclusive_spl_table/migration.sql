-- AlterTable
ALTER TABLE "spl" ADD COLUMN     "allow_value_from_same_creator_tokens_for_exclusive_content" BOOLEAN,
ADD COLUMN     "is_spl_exclusive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "listing_price_to_access_exclusive_content_usd" DOUBLE PRECISION,
ADD COLUMN     "value_needed_to_access_exclusive_content_usd" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "exclusive_spl_purchase" (
    "exclusive_spl_purchase_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "solana_wallet_id" INTEGER NOT NULL,

    CONSTRAINT "exclusive_spl_purchase_pkey" PRIMARY KEY ("exclusive_spl_purchase_id")
);

-- CreateIndex
CREATE INDEX "exclusive_spl_purchase__spl_id_idx" ON "exclusive_spl_purchase"("spl_id");

-- CreateIndex
CREATE INDEX "exclusive_spl_purchase__solana_wallet_id_idx" ON "exclusive_spl_purchase"("solana_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "exclusive_spl_purchase_spl_id_solana_wallet_id_key" ON "exclusive_spl_purchase"("spl_id", "solana_wallet_id");

-- AddForeignKey
ALTER TABLE "exclusive_spl_purchase" ADD CONSTRAINT "exclusive_spl_purchase_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_spl_purchase" ADD CONSTRAINT "exclusive_spl_purchase_solana_wallet_id_fkey" FOREIGN KEY ("solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

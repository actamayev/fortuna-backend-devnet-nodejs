-- CreateTable
CREATE TABLE "secondary_market_bid" (
    "secondary_market_bid_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "solana_wallet_id" INTEGER NOT NULL,
    "number_of_shares_bidding_for" INTEGER NOT NULL,
    "remaining_number_of_shares_bidding_for" INTEGER NOT NULL,
    "listing_price_per_share_usd" DOUBLE PRECISION NOT NULL,
    "was_bid_cancelled_due_to_fund_requirements" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "secondary_market_bid_pkey" PRIMARY KEY ("secondary_market_bid_id")
);

-- CreateTable
CREATE TABLE "secondary_market_ask" (
    "secondary_market_ask_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "solana_wallet_id" INTEGER NOT NULL,
    "number_of_shares_for_sale" INTEGER NOT NULL,
    "remaining_number_of_shares_for_sale" INTEGER NOT NULL,
    "listing_price_per_share_usd" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "secondary_market_ask_pkey" PRIMARY KEY ("secondary_market_ask_id")
);

-- CreateTable
CREATE TABLE "secondary_market_transaction" (
    "secondary_market_transaction_id" SERIAL NOT NULL,
    "secondary_market_bid_id" INTEGER NOT NULL,
    "secondary_market_ask_id" INTEGER NOT NULL,
    "sol_transfer_id" INTEGER NOT NULL,
    "spl_transfer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "secondary_market_transaction_pkey" PRIMARY KEY ("secondary_market_transaction_id")
);

-- CreateIndex
CREATE INDEX "secondary_market_bid__spl_id_idx" ON "secondary_market_bid"("spl_id");

-- CreateIndex
CREATE INDEX "secondary_market_bid__solana_wallet_id_idx" ON "secondary_market_bid"("solana_wallet_id");

-- CreateIndex
CREATE INDEX "secondary_market_ask__spl_id_idx" ON "secondary_market_ask"("spl_id");

-- CreateIndex
CREATE INDEX "secondary_market_ask__solana_wallet_id_idx" ON "secondary_market_ask"("solana_wallet_id");

-- CreateIndex
CREATE INDEX "secondary_market_purchase__secondary_market_bid_id_idx" ON "secondary_market_transaction"("secondary_market_bid_id");

-- CreateIndex
CREATE INDEX "secondary_market_purchase__secondary_market_ask_id_idx" ON "secondary_market_transaction"("secondary_market_ask_id");

-- CreateIndex
CREATE INDEX "secondary_market_purchase__sol_transfer_id_idx" ON "secondary_market_transaction"("sol_transfer_id");

-- CreateIndex
CREATE INDEX "secondary_market_purchase__spl_transfer_id_idx" ON "secondary_market_transaction"("spl_transfer_id");

-- AddForeignKey
ALTER TABLE "secondary_market_bid" ADD CONSTRAINT "secondary_market_bid_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secondary_market_bid" ADD CONSTRAINT "secondary_market_bid_solana_wallet_id_fkey" FOREIGN KEY ("solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secondary_market_ask" ADD CONSTRAINT "secondary_market_ask_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secondary_market_ask" ADD CONSTRAINT "secondary_market_ask_solana_wallet_id_fkey" FOREIGN KEY ("solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secondary_market_transaction" ADD CONSTRAINT "secondary_market_transaction_secondary_market_bid_id_fkey" FOREIGN KEY ("secondary_market_bid_id") REFERENCES "secondary_market_bid"("secondary_market_bid_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secondary_market_transaction" ADD CONSTRAINT "secondary_market_transaction_secondary_market_ask_id_fkey" FOREIGN KEY ("secondary_market_ask_id") REFERENCES "secondary_market_ask"("secondary_market_ask_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secondary_market_transaction" ADD CONSTRAINT "secondary_market_transaction_sol_transfer_id_fkey" FOREIGN KEY ("sol_transfer_id") REFERENCES "sol_transfer"("sol_transfer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secondary_market_transaction" ADD CONSTRAINT "secondary_market_transaction_spl_transfer_id_fkey" FOREIGN KEY ("spl_transfer_id") REFERENCES "spl_transfer"("spl_transfer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

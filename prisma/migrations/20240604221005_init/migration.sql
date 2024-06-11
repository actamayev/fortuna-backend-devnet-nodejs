-- CreateEnum
CREATE TYPE "Currencies" AS ENUM ('usd', 'sol');

-- CreateEnum
CREATE TYPE "SiteThemes" AS ENUM ('light', 'dark');

-- CreateEnum
CREATE TYPE "AuthMethods" AS ENUM ('fortuna', 'google');

-- CreateEnum
CREATE TYPE "SPLListingStatus" AS ENUM ('PRELISTING', 'LISTED', 'SOLDOUT', 'REMOVED');

-- CreateTable
CREATE TABLE "credentials" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "default_currency" "Currencies" NOT NULL DEFAULT 'usd',
    "default_site_theme" "SiteThemes" NOT NULL DEFAULT 'light',
    "is_approved_to_be_creator" BOOLEAN NOT NULL DEFAULT false,
    "auth_method" "AuthMethods" NOT NULL,
    "email__encrypted" TEXT,
    "phone_number__encrypted" TEXT,
    "profile_picture_id" INTEGER,
    "youtube_access_tokens_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "login_history" (
    "login_history_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "login_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_history_pkey" PRIMARY KEY ("login_history_id")
);

-- CreateTable
CREATE TABLE "solana_wallet" (
    "solana_wallet_id" SERIAL NOT NULL,
    "public_key" VARCHAR(255) NOT NULL,
    "secret_key__encrypted" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solana_wallet_pkey" PRIMARY KEY ("solana_wallet_id")
);

-- CreateTable
CREATE TABLE "spl" (
    "spl_id" SERIAL NOT NULL,
    "meta_data_url" TEXT NOT NULL,
    "spl_name" TEXT NOT NULL,
    "meta_data_address" TEXT NOT NULL,
    "public_key_address" TEXT NOT NULL,
    "listing_price_per_share_usd" DOUBLE PRECISION NOT NULL,
    "initial_creator_ownership_percentage" DOUBLE PRECISION NOT NULL,
    "total_number_of_shares" INTEGER NOT NULL,
    "creator_wallet_id" INTEGER NOT NULL,
    "uploaded_image_id" INTEGER NOT NULL,
    "uploaded_video_id" INTEGER NOT NULL,
    "original_content_url" TEXT NOT NULL,
    "spl_creation_fee_sol" DOUBLE PRECISION NOT NULL,
    "spl_creation_fee_usd" DOUBLE PRECISION NOT NULL,
    "create_spl_fee_payer_solana_wallet_id" INTEGER NOT NULL,
    "spl_metadata_creation_fee_sol" DOUBLE PRECISION,
    "spl_metadata_creation_fee_usd" DOUBLE PRECISION,
    "create_spl_metadata_fee_payer_solana_wallet_id" INTEGER,
    "is_spl_exclusive" BOOLEAN NOT NULL,
    "value_needed_to_access_exclusive_content_usd" DOUBLE PRECISION,
    "is_content_instantly_accessible" BOOLEAN,
    "instant_access_price_to_exclusive_content_usd" DOUBLE PRECISION,
    "allow_value_from_same_creator_tokens_for_exclusive_content" BOOLEAN,
    "spl_listing_status" "SPLListingStatus" NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spl_pkey" PRIMARY KEY ("spl_id")
);

-- CreateTable
CREATE TABLE "exclusive_spl_purchase" (
    "exclusive_spl_purchase_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "solana_wallet_id" INTEGER NOT NULL,
    "sol_transfer_id" INTEGER NOT NULL,

    CONSTRAINT "exclusive_spl_purchase_pkey" PRIMARY KEY ("exclusive_spl_purchase_id")
);

-- CreateTable
CREATE TABLE "token_account" (
    "token_account_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "public_key" VARCHAR(255) NOT NULL,
    "token_account_creation_fee_sol" DOUBLE PRECISION NOT NULL,
    "token_account_creation_fee_usd" DOUBLE PRECISION NOT NULL,
    "fee_payer_solana_wallet_id" INTEGER NOT NULL,
    "parent_solana_wallet_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_account_pkey" PRIMARY KEY ("token_account_id")
);

-- CreateTable
CREATE TABLE "spl_mint" (
    "spl_mint_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "token_account_id" INTEGER NOT NULL,
    "number_of_shares" INTEGER NOT NULL,
    "spl_mint_fee_sol" DOUBLE PRECISION NOT NULL,
    "spl_mint_fee_usd" DOUBLE PRECISION NOT NULL,
    "fee_payer_solana_wallet_id" INTEGER NOT NULL,
    "transaction_signature" TEXT NOT NULL,

    CONSTRAINT "spl_mint_pkey" PRIMARY KEY ("spl_mint_id")
);

-- CreateTable
CREATE TABLE "spl_ownership" (
    "spl_ownership_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "solana_wallet_id" INTEGER NOT NULL,
    "number_of_shares" INTEGER NOT NULL,
    "purchase_price_per_share_usd" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spl_ownership_pkey" PRIMARY KEY ("spl_ownership_id")
);

-- CreateTable
CREATE TABLE "uploaded_image" (
    "uploaded_image_id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_image_pkey" PRIMARY KEY ("uploaded_image_id")
);

-- CreateTable
CREATE TABLE "uploaded_video" (
    "uploaded_video_id" SERIAL NOT NULL,
    "file_name" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_video_pkey" PRIMARY KEY ("uploaded_video_id")
);

-- CreateTable
CREATE TABLE "sol_transfer" (
    "sol_transfer_id" SERIAL NOT NULL,
    "recipient_public_key" VARCHAR(255) NOT NULL,
    "recipient_solana_wallet_id" INTEGER,
    "is_recipient_fortuna_wallet" BOOLEAN NOT NULL,
    "transaction_signature" TEXT NOT NULL,
    "is_spl_purchase" BOOLEAN NOT NULL,
    "sol_amount_transferred" DOUBLE PRECISION NOT NULL,
    "usd_amount_transferred" DOUBLE PRECISION NOT NULL,
    "transfer_by_currency" "Currencies" NOT NULL,
    "transfer_fee_sol" DOUBLE PRECISION NOT NULL,
    "transfer_fee_usd" DOUBLE PRECISION NOT NULL,
    "sender_solana_wallet_id" INTEGER NOT NULL,
    "fee_payer_solana_wallet_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sol_transfer_pkey" PRIMARY KEY ("sol_transfer_id")
);

-- CreateTable
CREATE TABLE "spl_transfer" (
    "spl_transfer_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "recipient_solana_wallet_id" INTEGER NOT NULL,
    "sender_solana_wallet_id" INTEGER NOT NULL,
    "is_spl_purchase" BOOLEAN NOT NULL,
    "number_spl_shares_transferred" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spl_transfer_pkey" PRIMARY KEY ("spl_transfer_id")
);

-- CreateTable
CREATE TABLE "spl_purchase" (
    "spl_purchase_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "spl_transfer_id" INTEGER NOT NULL,
    "sol_transfer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spl_purchase_pkey" PRIMARY KEY ("spl_purchase_id")
);

-- CreateTable
CREATE TABLE "profile_picture" (
    "profile_picture_id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_picture_pkey" PRIMARY KEY ("profile_picture_id")
);

-- CreateTable
CREATE TABLE "youtube_access_tokens" (
    "youtube_access_tokens_id" SERIAL NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token__encrypted" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "youtube_access_tokens_pkey" PRIMARY KEY ("youtube_access_tokens_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credentials_username_key" ON "credentials"("username");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_profile_picture_id_key" ON "credentials"("profile_picture_id");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_youtube_access_tokens_id_key" ON "credentials"("youtube_access_tokens_id");

-- CreateIndex
CREATE INDEX "credentials__profile_picture_id_idx" ON "credentials"("profile_picture_id");

-- CreateIndex
CREATE INDEX "credentials__youtube_access_tokens_id_idx" ON "credentials"("youtube_access_tokens_id");

-- CreateIndex
CREATE INDEX "login_history__user_id_idx" ON "login_history"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "solana_wallet_user_id_key" ON "solana_wallet"("user_id");

-- CreateIndex
CREATE INDEX "solana_wallet__user_id_idx" ON "solana_wallet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "spl_uploaded_image_id_key" ON "spl"("uploaded_image_id");

-- CreateIndex
CREATE UNIQUE INDEX "spl_uploaded_video_id_key" ON "spl"("uploaded_video_id");

-- CreateIndex
CREATE INDEX "spl__create_spl_fee_payer_solana_wallet_id_idx" ON "spl"("create_spl_fee_payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl__create_spl_metadata_fee_payer_solana_wallet_id_idx" ON "spl"("create_spl_metadata_fee_payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl__creator_wallet_id_idx" ON "spl"("creator_wallet_id");

-- CreateIndex
CREATE INDEX "spl__uploaded_image_id_idx" ON "spl"("uploaded_image_id");

-- CreateIndex
CREATE UNIQUE INDEX "exclusive_spl_purchase_sol_transfer_id_key" ON "exclusive_spl_purchase"("sol_transfer_id");

-- CreateIndex
CREATE INDEX "exclusive_spl_purchase__spl_id_idx" ON "exclusive_spl_purchase"("spl_id");

-- CreateIndex
CREATE INDEX "exclusive_spl_purchase__solana_wallet_id_idx" ON "exclusive_spl_purchase"("solana_wallet_id");

-- CreateIndex
CREATE INDEX "exclusive_spl_purchasee__sol_transfer_id_idx" ON "exclusive_spl_purchase"("sol_transfer_id");

-- CreateIndex
CREATE UNIQUE INDEX "exclusive_spl_purchase_spl_id_solana_wallet_id_key" ON "exclusive_spl_purchase"("spl_id", "solana_wallet_id");

-- CreateIndex
CREATE INDEX "token_account__spl_id_idx" ON "token_account"("spl_id");

-- CreateIndex
CREATE INDEX "token_account__fee_payer_solana_wallet_id_idx" ON "token_account"("fee_payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl_mint__spl_id_idx" ON "spl_mint"("spl_id");

-- CreateIndex
CREATE INDEX "spl_mint__token_account_id_idx" ON "spl_mint"("token_account_id");

-- CreateIndex
CREATE INDEX "spl_mint__fee_payer_solana_wallet_id_idx" ON "spl_mint"("fee_payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl_ownership__spl_id_idx" ON "spl_ownership"("spl_id");

-- CreateIndex
CREATE INDEX "spl_ownership__solana_wallet_id_idx" ON "spl_ownership"("solana_wallet_id");

-- CreateIndex
CREATE INDEX "sol_transfer__sender_solana_wallet_id_idx" ON "sol_transfer"("sender_solana_wallet_id");

-- CreateIndex
CREATE INDEX "sol_transfer__recipient_solana_wallet_id_idx" ON "sol_transfer"("recipient_solana_wallet_id");

-- CreateIndex
CREATE INDEX "sol_transfer__fee_payer_solana_wallet_id_idx" ON "sol_transfer"("fee_payer_solana_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "spl_purchase_spl_transfer_id_key" ON "spl_purchase"("spl_transfer_id");

-- CreateIndex
CREATE UNIQUE INDEX "spl_purchase_sol_transfer_id_key" ON "spl_purchase"("sol_transfer_id");

-- CreateIndex
CREATE INDEX "spl_purchase__spl_id_idx" ON "spl_purchase"("spl_id");

-- CreateIndex
CREATE INDEX "spl_purchase__spl_transfer_id_idx" ON "spl_purchase"("spl_transfer_id");

-- CreateIndex
CREATE INDEX "spl_purchase__sol_transfer_id_idx" ON "spl_purchase"("sol_transfer_id");

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_profile_picture_id_fkey" FOREIGN KEY ("profile_picture_id") REFERENCES "profile_picture"("profile_picture_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_youtube_access_tokens_id_fkey" FOREIGN KEY ("youtube_access_tokens_id") REFERENCES "youtube_access_tokens"("youtube_access_tokens_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_history" ADD CONSTRAINT "login_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solana_wallet" ADD CONSTRAINT "solana_wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_create_spl_fee_payer_solana_wallet_id_fkey" FOREIGN KEY ("create_spl_fee_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_create_spl_metadata_fee_payer_solana_wallet_id_fkey" FOREIGN KEY ("create_spl_metadata_fee_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_creator_wallet_id_fkey" FOREIGN KEY ("creator_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_uploaded_image_id_fkey" FOREIGN KEY ("uploaded_image_id") REFERENCES "uploaded_image"("uploaded_image_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_uploaded_video_id_fkey" FOREIGN KEY ("uploaded_video_id") REFERENCES "uploaded_video"("uploaded_video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_spl_purchase" ADD CONSTRAINT "exclusive_spl_purchase_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_spl_purchase" ADD CONSTRAINT "exclusive_spl_purchase_solana_wallet_id_fkey" FOREIGN KEY ("solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_spl_purchase" ADD CONSTRAINT "exclusive_spl_purchase_sol_transfer_id_fkey" FOREIGN KEY ("sol_transfer_id") REFERENCES "sol_transfer"("sol_transfer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_account" ADD CONSTRAINT "token_account_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_account" ADD CONSTRAINT "token_account_fee_payer_solana_wallet_id_fkey" FOREIGN KEY ("fee_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_account" ADD CONSTRAINT "token_account_parent_solana_wallet_id_fkey" FOREIGN KEY ("parent_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_mint" ADD CONSTRAINT "spl_mint_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_mint" ADD CONSTRAINT "spl_mint_token_account_id_fkey" FOREIGN KEY ("token_account_id") REFERENCES "token_account"("token_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_mint" ADD CONSTRAINT "spl_mint_fee_payer_solana_wallet_id_fkey" FOREIGN KEY ("fee_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_ownership" ADD CONSTRAINT "spl_ownership_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_ownership" ADD CONSTRAINT "spl_ownership_solana_wallet_id_fkey" FOREIGN KEY ("solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sol_transfer" ADD CONSTRAINT "sol_transfer_sender_solana_wallet_id_fkey" FOREIGN KEY ("sender_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sol_transfer" ADD CONSTRAINT "sol_transfer_recipient_solana_wallet_id_fkey" FOREIGN KEY ("recipient_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sol_transfer" ADD CONSTRAINT "sol_transfer_fee_payer_solana_wallet_id_fkey" FOREIGN KEY ("fee_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_transfer" ADD CONSTRAINT "spl_transfer_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_transfer" ADD CONSTRAINT "spl_transfer_recipient_solana_wallet_id_fkey" FOREIGN KEY ("recipient_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_transfer" ADD CONSTRAINT "spl_transfer_sender_solana_wallet_id_fkey" FOREIGN KEY ("sender_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_purchase" ADD CONSTRAINT "spl_purchase_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_purchase" ADD CONSTRAINT "spl_purchase_spl_transfer_id_fkey" FOREIGN KEY ("spl_transfer_id") REFERENCES "spl_transfer"("spl_transfer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_purchase" ADD CONSTRAINT "spl_purchase_sol_transfer_id_fkey" FOREIGN KEY ("sol_transfer_id") REFERENCES "sol_transfer"("sol_transfer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

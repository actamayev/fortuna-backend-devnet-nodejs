-- select * from credentials;
-- select * from login_history;
-- select * from solana_wallet;
-- select * from spl;
-- select * from spl_mint;
-- Select solana_wallet.user_id, solana_wallet.public_key,
-- 	solana_wallet.solana_wallet_id, username, solana_wallet.secret_key__encrypted from credentials join solana_wallet on credentials.user_id = solana_wallet.user_id;

-- select * from spl_ownership;
-- select spl_id, number_of_shares, credentials.username from spl_ownership
-- 	join solana_wallet on spl_ownership.solana_wallet_id = solana_wallet.solana_wallet_id
-- 	join credentials on solana_wallet.user_id = credentials.user_id;

select * from token_account;
-- select * from uploaded_image;
-- select * from uploaded_video;
-- select * from sol_transfer;
-- select * from spl_purchase;
-- select * from spl_transfer;
-- select * from youtube_access_tokens;
-- SELECT * FROM "_prisma_migrations" ORDER BY "finished_at" ASC;

-- SELECT * FROM secondary_market_bid;
-- SELECT * FROM secondary_market_ask;
-- SELECT * FROM secondary_market_transaction;

-- select
-- 	secondary_market_transaction_id,
-- 	secondary_market_bid_id,
-- 	secondary_market_ask_id,
-- 	sol_transfer.usd_amount_transferred,
-- 	spl_transfer.number_spl_shares_transferred,
-- 	sol_transfer.transfer_fee_sol,
-- 	spl_transfer.transfer_fee_sol,
-- 	secondary_market_transaction.created_at
-- 	from 
-- 	secondary_market_transaction
-- 	join sol_transfer on secondary_market_transaction.sol_transfer_id = sol_transfer.sol_transfer_id
-- 	join spl_transfer on secondary_market_transaction.spl_transfer_id = spl_transfer.spl_transfer_id;

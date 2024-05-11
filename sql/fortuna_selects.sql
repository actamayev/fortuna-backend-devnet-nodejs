-- select * from credentials;
-- select * from login_history;
-- select * from solana_wallet;
-- select * from spl;
-- select * from spl_mint;
Select solana_wallet.user_id, solana_wallet.solana_wallet_id, username from credentials join solana_wallet on credentials.user_id = solana_wallet.user_id;

-- select * from spl_ownership;
-- select * from token_account;
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


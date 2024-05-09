select * from credentials;
-- select * from login_history;
-- select * from solana_wallet;
-- select * from spl;
-- select * from spl_mint;
-- Select solana_wallet.user_id, solana_wallet.solana_wallet_id, public_key, secret_key, username, email from credentials join solana_wallet on credentials.user_id = solana_wallet.user_id;

-- select * from spl_ownership;
-- select * from token_account;
-- select * from uploaded_image;
-- select * from uploaded_video;
-- select * from sol_transfer;
-- select * from spl_purchase;
-- select * from _prisma_migrations;
-- select * from spl_transfer;
-- select * from youtube_access_tokens;

-- select * from _prisma_migrations;

-- To delete an spl:
-- delete from spl_ownership;
-- delete from spl_mint;
-- delete from spl_purchase;
-- delete from spl_transfer;
-- delete from token_account;
-- delete from spl;

-- To delete a user:
-- delete from login_history where user_id = ;
-- delete from solana_wallet where user_id = ;
-- delete from credentials where email = '';

-- delete from login_history;
-- delete from solana_wallet;
-- delete from credentials;
-- delete from uploaded_image;
-- delete from sol_transfer;
-- delete from spl_transfer;
-- delete from spl_purchase

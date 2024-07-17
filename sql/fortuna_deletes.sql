-- To delete a video:
-- delete from video_access_tier;
-- delete from exclusive_video_access_purchase;
-- delete from exclusive_video_access_purchase_fortuna_take;
-- delete from video_like_status;
-- delete from video;


-- To delete a user:
-- delete from login_history where user_id = 5;
-- delete from video_access_tier where video_id = ;
-- delete from exclusive_video_access_purchase where exclusive_video_access_purchase_sol_transfer_id = 11;
-- delete from exclusive_video_access_purchase where exclusive_video_access_purchase_sol_transfer_id = 4;
-- delete from video_like_status where video_id = ;
-- delete from video where video_id = ;
-- delete from exclusive_video_access_purchase_fortuna_take where sender_solana_wallet_id = 5;
-- delete from exclusive_video_access_purchase_sol_transfer where content_creator_solana_wallet_id = 5;
-- delete from exclusive_video_access_purchase_sol_transfer where fan_solana_wallet_id = 5;
delete from solana_wallet where user_id = 5;
-- delete from credentials where user_id = 5;

-- select * from exclusive_video_access_purchase_sol_transfer;
select * from credentials;
-- delete from login_history;
-- delete from uploaded_image;
-- delete from exclusive_video_access_purchase;
-- delete from sol_transfer;
-- delete from upoaded_video;

-- delete FROM secondary_market_transaction;
-- delete FROM secondary_market_bid;
-- delete FROM secondary_market_ask;


-- select * from credentials;
-- select * from login_history;
-- select * from solana_wallet;
-- select * from video;
-- select * from exclusive_video_access_purchase;
-- select * from video_access_tier;
-- Select solana_wallet.user_id, solana_wallet.public_key,
-- 	solana_wallet.solana_wallet_id, username, solana_wallet.secret_key__encrypted from credentials join solana_wallet on credentials.user_id = solana_wallet.user_id;

-- select
-- 	video_id,
-- 	uploaded_video.uuid,
-- 	allow_value_from_same_creator_tokens_for_exclusive_content,
-- 	value_needed_to_access_exclusive_content_usd,
-- 	listing_price_per_share_usd
-- 	from video join uploaded_video on uploaded_video.uploaded_video_id = video.uploaded_video_id;

-- select * from video;
-- select * from uploaded_image;
select * from uploaded_video;
-- select * from sol_transfer;
-- select * from youtube_access_tokens;
-- SELECT * FROM "_prisma_migrations" ORDER BY "finished_at" ASC;
-- SELECT * FROM blockchain_fees_paid_by_fortuna;
-- select * from exclusive_video_access_purchase_fortuna_take;
-- select * from exclusive_video_access_purchase_sol_transfer;
-- select * from channel_name;

-- UPDATE uploaded_video
-- SET video_duration_seconds = 30.52667
-- WHERE file_name = 'file_example_MP4_480_1_5MG.mp4';
# Prisma Directory

PostgreSQL database schema and migrations.

## Schema Overview

Database: PostgreSQL (managed by Prisma ORM)
Models: 20 tables representing users, content, wallets, transactions, and metadata

## Core Models

### **credentials** (Users)
- Primary user record with authentication and preferences
- Fields:
  - `user_id` (PK): Auto-increment user identifier
  - `username` (unique): User's display name
  - `password` (nullable): Hashed password for local auth
  - `email__encrypted` (deterministic): Encrypted email for lookups
  - `auth_method`: "fortuna" (local) or "google" (OAuth)
  - `default_currency`: SOL or USD preference
  - `default_site_theme`: light or dark preference
  - `profile_picture_id` (FK): Optional profile picture
  - `channel_banner_id` (FK): Optional channel banner
  - `youtube_access_tokens_id` (FK): YouTube OAuth tokens
  - `is_active`: Soft delete flag
  - `created_at`, `updated_at`: Timestamps

- Relations:
  - 1:1 to solana_wallet
  - 1:1 to profile_picture
  - 1:1 to channel_name
  - 1:1 to channel_description
  - 1:1 to channel_banner
  - 1:1 to youtube_access_tokens
  - 1:Many to video (creator)
  - 1:Many to video_like_status
  - 1:Many to video_tag_lookup (tag creator)
  - 1:Many to social_platform_link
  - 1:Many to exclusive_video_access_purchase
  - 1:Many to reported_video
  - 1:Many to login_history

### **solana_wallet** (User Wallets)
- Solana blockchain wallet per user (1:1)
- Fields:
  - `solana_wallet_id` (PK): Auto-increment wallet ID
  - `public_key` (string): Solana public key address
  - `secret_key__encrypted` (non-deterministic): Encrypted private key
  - `user_id` (FK, unique): Reference to credentials
  - `created_at`, `updated_at`: Timestamps

- Relations:
  - 1:1 to credentials
  - 1:Many to sol_transfer (as sender/recipient)
  - 1:Many to blockchain_fees_paid_by_fortuna
  - 1:Many to blockchain_fees_paid_by_user
  - 1:Many to exclusive_video_access_purchase_sol_transfer
  - 1:Many to exclusive_video_access_purchase_fortuna_take

### **video** (Content)
- Video content metadata
- Fields:
  - `video_id` (PK): Auto-increment video ID
  - `video_name` (string): Video title
  - `description` (string): Video description
  - `uuid` (string): Unique identifier for S3
  - `creator_user_id` (FK): Video creator
  - `uploaded_image_id` (FK, unique): Thumbnail/poster image
  - `uploaded_video_id` (FK, unique): Video file reference
  - `is_video_exclusive` (boolean): Exclusive (paid) vs free
  - `video_listing_status` (enum): LISTED, UNLISTED, SOLDOUT
  - `is_video_featured` (boolean): Pinned to creator profile
  - `is_active` (boolean): Soft delete flag
  - `created_at`, `updated_at`: Timestamps

- Relations:
  - Many:1 to credentials (creator)
  - 1:1 to uploaded_image (thumbnail)
  - 1:1 to uploaded_video (video file)
  - 1:Many to video_access_tier (pricing)
  - 1:Many to video_like_status (user likes)
  - 1:Many to video_tag_mapping (tags)
  - 1:Many to exclusive_video_access_purchase (purchases)
  - 1:Many to reported_video (reports)

### **video_access_tier** (Exclusive Content Pricing)
- Pricing tiers for exclusive content (multiple per video)
- Fields:
  - `video_access_tier_id` (PK): Auto-increment tier ID
  - `video_id` (FK): Target video
  - `tier_number` (int): Tier level (1, 2, 3, etc.)
  - `tier_access_price_usd` (float): Price in USD
  - `purchases_allowed_for_this_tier` (int, nullable): Quantity limit (null = unlimited)
  - `is_sold_out` (boolean): Tier availability flag
  - `created_at`, `updated_at`: Timestamps

- Constraint: Unique on (video_id, tier_number)

### **exclusive_video_access_purchase** (Transactions)
- Purchase records linking buyer, video, and transfer transactions
- Fields:
  - `exclusive_video_access_purchase_id` (PK): Purchase record ID
  - `video_id` (FK): Video purchased
  - `user_id` (FK): Buyer
  - `video_access_tier_number` (int): Which tier purchased
  - `exclusive_video_access_purchase_sol_transfer_id` (FK, unique): Fan→Creator transfer
  - `exclusive_video_access_purchase_fortuna_take_id` (FK, unique): Fortuna fee transfer
  - `created_at`, `updated_at`: Timestamps

- Constraint: Unique on (video_id, user_id) - one purchase per user per video

- Relations:
  - Many:1 to video
  - Many:1 to credentials (buyer)
  - 1:1 to exclusive_video_access_purchase_sol_transfer
  - 1:1 to exclusive_video_access_purchase_fortuna_take

### **sol_transfer** (General Transfers)
- All SOL transfers between wallets (peer-to-peer or Fortuna)
- Fields:
  - `sol_transfer_id` (PK): Transfer record ID
  - `sender_solana_wallet_id` (FK): Sending wallet
  - `recipient_public_key` (string): Recipient address
  - `recipient_solana_wallet_id` (FK, nullable): Recipient if Fortuna user
  - `is_recipient_fortuna_wallet` (boolean): Internal vs external transfer
  - `transaction_signature` (string): Blockchain transaction ID
  - `sol_amount_transferred` (float): Amount in SOL
  - `usd_amount_transferred` (float): Amount in USD
  - `transfer_by_currency` (enum): SOL or USD (user's choice)
  - `sender_new_wallet_balance_sol` (float, nullable): Sender balance after
  - `sender_new_wallet_balance_usd` (float, nullable): Sender balance after (USD)
  - `recipient_new_wallet_balance_sol` (float, nullable): Recipient balance after
  - `recipient_new_wallet_balance_usd` (float, nullable): Recipient balance after (USD)
  - `blockchain_fees_paid_by_fortuna_id` (FK, nullable): Fee record
  - `blockchain_fees_paid_by_user_id` (FK, nullable): Fee record
  - `created_at`, `updated_at`: Timestamps

### **exclusive_video_access_purchase_sol_transfer** (Purchase Transfers)
- Specialized transfer from buyer to creator for exclusive purchases
- Two transfers occur per purchase: buyer→creator, then creator→fortuna
- Fields:
  - `exclusive_video_access_purchase_sol_transfer_id` (PK): Transfer record ID
  - `fan_solana_wallet_id` (FK): Buyer's wallet
  - `content_creator_solana_wallet_id` (FK): Creator's wallet
  - `transaction_signature` (string): Blockchain transaction ID
  - `sol_amount_transferred` (float): Amount to creator
  - `usd_amount_transferred` (float): Amount to creator (USD)
  - `blockchain_fees_paid_by_fortuna_id` (FK, unique): Fee reference
  - `sender_new_wallet_balance_sol` (float, nullable): Buyer balance after
  - `sender_new_wallet_balance_usd` (float, nullable): Buyer balance after (USD)
  - `recipient_new_wallet_balance_sol` (float, nullable): Creator balance after
  - `recipient_new_wallet_balance_usd` (float, nullable): Creator balance after (USD)
  - `created_at`, `updated_at`: Timestamps

### **exclusive_video_access_purchase_fortuna_take** (Fortuna Fees)
- Fortuna's fee transfer from creator to Fortuna wallet
- Second part of exclusive purchase (after creator receives payment)
- Fields:
  - `exclusive_video_access_purchase_fortuna_take_id` (PK): Transfer record ID
  - `sender_solana_wallet_id` (FK): Creator's wallet
  - `fortuna_recipient_solana_wallet_id` (FK): Fortuna fee collector wallet
  - `transaction_signature` (string): Blockchain transaction ID
  - `sol_amount_transferred` (float): Fee amount in SOL
  - `usd_amount_transferred` (float): Fee amount in USD
  - `blockchain_fees_paid_by_fortuna_id` (FK, unique): Network fee reference
  - `created_at`, `updated_at`: Timestamps

### **blockchain_fees_paid_by_fortuna** (Fortuna Fees)
- Network fees paid by Fortuna platform (subsidized)
- Fields:
  - `blockchain_fees_paid_by_fortuna_id` (PK): Fee record ID
  - `fee_payer_solana_wallet_id` (FK): Fortuna's fee payer wallet
  - `fee_in_sol` (float, nullable): Fee amount
  - `fee_in_usd` (float, nullable): Fee amount in USD
  - `created_at`, `updated_at`: Timestamps

### **blockchain_fees_paid_by_user** (User Fees)
- Network fees paid by user
- Fields:
  - `blockchain_fees_paid_by_user_id` (PK): Fee record ID
  - `fee_payer_solana_wallet_id` (FK): User's wallet paying fee
  - `fee_in_sol` (float, nullable): Fee amount
  - `fee_in_usd` (float, nullable): Fee amount in USD
  - `created_at`, `updated_at`: Timestamps

## Media Models

### **uploaded_image** (Thumbnails/Images)
- Image file references
- Fields:
  - `uploaded_image_id` (PK)
  - `image_url` (string): S3 URL
  - `file_name` (string): Original filename
  - `video_id` (FK, nullable): Associated video
  - `created_at`, `updated_at`

### **uploaded_video** (Video Files)
- Video file references with metadata
- Fields:
  - `uploaded_video_id` (PK)
  - `file_name` (string): Original filename
  - `video_duration_seconds` (float): Duration extracted from video
  - `video_id` (FK, nullable): Associated video
  - `created_at`, `updated_at`

### **profile_picture** (Creator Profile)
- Creator profile pictures
- Fields:
  - `profile_picture_id` (PK)
  - `image_url` (string): S3 URL
  - `file_name` (string): Filename
  - `uuid` (string): Unique identifier
  - `user_id` (FK, unique): Creator
  - `is_active` (boolean): Current picture flag
  - `created_at`, `updated_at`

### **channel_banner** (Creator Banner)
- Channel banner/header images
- Fields:
  - `channel_banner_id` (PK)
  - `image_url` (string): S3 URL
  - `file_name` (string): Filename
  - `uuid` (string): Unique identifier
  - `user_id` (FK, unique): Creator
  - `is_active` (boolean): Current banner flag
  - `created_at`, `updated_at`

## Creator Metadata Models

### **channel_name** (Creator Channel)
- Creator's channel name (1:1 per user)
- Fields:
  - `channel_name_id` (PK)
  - `user_id` (FK, unique): Creator
  - `channel_name` (string): Display name for channel
  - `created_at`, `updated_at`

### **channel_description** (Creator Bio)
- Creator's channel description/bio (1:1 per user)
- Fields:
  - `channel_description_id` (PK)
  - `user_id` (FK, unique): Creator
  - `channel_description` (string): Bio text
  - `created_at`, `updated_at`

### **social_platform_link** (Creator Socials)
- Creator's social media links (multiple per creator)
- Fields:
  - `social_platform_link_id` (PK)
  - `user_id` (FK): Creator
  - `social_platform` (enum): youtube, twitter, twitch, spotify, etc.
  - `social_link` (string): URL to social profile
  - `is_active` (boolean): Link active flag
  - `created_at`, `updated_at`

- Constraint: Unique on (user_id, social_platform) - one link per platform

## Engagement Models

### **video_like_status** (User Likes)
- Like/unlike tracking for videos
- Fields:
  - `video_like_status_id` (PK)
  - `video_id` (FK): Liked video
  - `user_id` (FK): User who liked
  - `is_active` (boolean): Like active flag
  - `created_at`, `updated_at`

- Constraint: Unique on (video_id, user_id) - one like per user per video

### **reported_video** (Reports)
- Video reports for policy violations
- Fields:
  - `reported_video_id` (PK)
  - `video_id` (FK): Reported video
  - `user_id_who_reported_video` (FK): Reporting user
  - `report_message` (string, nullable): Report details
  - `is_active` (boolean): Report active flag
  - `created_at`, `updated_at`

- Constraint: Unique on (video_id, user_id_who_reported_video) - one report per user per video

### **video_tag_lookup** (Tag Definitions)
- Available video tags/categories (shared across all videos)
- Fields:
  - `video_tag_lookup_id` (PK)
  - `video_tag` (string, unique): Tag name
  - `added_by_user_id` (FK): User who created tag
  - `created_at`, `updated_at`

### **video_tag_mapping** (Video Tags)
- Many-to-many relationship between videos and tags
- Fields:
  - `video_tag_mapping_id` (PK)
  - `video_id` (FK): Video
  - `video_tag_lookup_id` (FK): Tag
  - `is_active` (boolean): Mapping active flag
  - `created_at`, `updated_at`

- Constraint: Unique on (video_id, video_tag_lookup_id)

## Authentication Models

### **login_history** (Login Tracking)
- Record of user logins for audit/analytics
- Fields:
  - `login_history_id` (PK)
  - `user_id` (FK): User
  - `login_time` (datetime): When login occurred
  - `created_at`, `updated_at`

### **youtube_access_tokens** (OAuth Tokens)
- YouTube OAuth tokens for creator features
- Fields:
  - `youtube_access_tokens_id` (PK)
  - `access_token` (string): Current access token
  - `refresh_token__encrypted` (string, non-deterministic): Encrypted refresh token
  - `expiry_date` (datetime): Token expiration
  - `created_at`, `updated_at`

## Enums

### **Currencies**
- `usd`: US Dollar
- `sol`: Solana blockchain token

### **SiteThemes**
- `light`: Light mode UI
- `dark`: Dark mode UI

### **AuthMethods**
- `fortuna`: Local authentication (username/password)
- `google`: Google OAuth login

### **VideoListingStatus**
- `LISTED`: Publicly available
- `UNLISTED`: Hidden from discovery but accessible by link
- `SOLDOUT`: All exclusive tiers sold out (may be re-purchasable later)

### **SocialPlatforms**
- youtube, twitter, twitch, spotify, soundcloud, applemusic, instagram, facebook, tiktok

## Migrations

37 migration files tracking schema evolution:
- Initial schema setup (June 2024)
- Removal of unsupported features (tokens, listings)
- Addition of exclusive content features (tiers, pricing)
- Wallet and transaction tracking
- Creator metadata (channel name, description, socials)
- Engagement features (likes, tags, reports)
- Latest: Video tags and reporting system

All migrations are timestamped and tracked in `migration_lock.toml`.

## Key Patterns

### Purchase Flow
```
exclusive_video_access_purchase
→ exclusive_video_access_purchase_sol_transfer (fan→creator)
→ exclusive_video_access_purchase_fortuna_take (creator→fortuna fee)
```

### Transfer Records
- `sol_transfer`: General transfers (deposits/withdrawals)
- `exclusive_video_access_purchase_sol_transfer`: Marketplace transfers
- Both track blockchain fees (fortuna-paid or user-paid)

### Creator Profile
- credentials + channel_name + channel_description + profile_picture + channel_banner + social_platform_link

### Encryption
- Emails: Deterministic (consistent for lookups)
- Secrets: Non-deterministic (YouTube tokens, wallet secrets)

### Soft Deletes
- `is_active` boolean used instead of hard deletes
- Data preserved for audit/history

## Indexes

Strategic indexes on:
- Foreign keys (faster joins)
- `user_id` fields (common filter)
- `video_id` fields (common filter)
- `created_at` fields (for sorting/pagination)

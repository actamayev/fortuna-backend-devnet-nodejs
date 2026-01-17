# Routes Directory

Express route handlers organized by feature domain. Each route file defines endpoints with validation and middleware chains.

## Route Structure Pattern

Each route file follows this pattern:
1. **Validation middleware** - Validates request body/params
2. **Auth middleware** - Verifies JWT and attaches user/wallet data
3. **Confirmation middleware** - Business logic checks (permissions, fund availability, etc.)
4. **Attachment middleware** - Fetches and attaches related data
5. **Controller** - Executes the business logic

## Files Overview

### **auth/** Subdirectory

#### **auth-routes.ts**
User authentication endpoints:
- `POST /login` - Login with email/username and password
- `POST /register` - Create new user account
- `POST /logout` - Logout user
- `POST /set-username` - Set username after registration (OAuth flows)
- Uses: `validateLogin`, `validateRegister`, `validateRegisterUsername`
- Routes to: `login`, `logout`, `register`, `registerUsername` controllers

#### **google-auth-routes.ts**
Google OAuth integration:
- `POST /google-auth/login-callback` - Google OAuth login callback handler
- Comment: YouTube auth endpoint disabled (bug revokes access token)
- Uses: `validateGoogleLoginAuthCallback`
- Routes to: `googleLoginAuthCallback` controller

### **creator-routes.ts**
Creator channel and content management:
- **Video Management**:
  - `POST /create-video` - Create new video
  - `POST /edit-video-name` - Update video title
  - `POST /edit-video-description` - Update video description
  - `POST /edit-video-listing-status/:videoId` - Change video visibility/listing status
  - `POST /feature-video` - Pin video to profile
  - `POST /unfeature-video` - Unpin video from profile
- **Video Tags**:
  - `POST /add-video-tag` - Add tag to video
  - `POST /delete-video-tag` - Remove tag from video
- **Channel Management**:
  - `POST /edit-channel-name` - Update channel name
  - `POST /add-or-edit-channel-description` - Update channel bio
  - `GET /get-creator-info` - Retrieve creator profile data
  - `GET /get-creator-content-list` - List creator's videos
- **Channel Media**:
  - `POST /remove-current-profile-picture` - Delete profile picture
  - `POST /remove-current-channel-banner-picture` - Delete channel banner
- **Social Links**:
  - `POST /add-or-edit-social-platform-link` - Add/update social media link
  - `POST /remove-social-platform-link/:socialPlatform` - Remove social link

All endpoints require `jwtVerifyAttachUser`. Most video endpoints use `confirmCreatorOwnsVideo*` to verify authorization.

### **encryption-routes.ts**
Encryption/decryption utility endpoints (development/testing):
- `POST /encrypt-deterministic-string` - Deterministic AES-256-CBC encryption
- `POST /decrypt-deterministic-string` - Deterministic decryption
- `POST /encrypt-nondeterministic-string` - Non-deterministic AES-256-GCM encryption
- `POST /decrypt-nondeterministic-string` - Non-deterministic decryption
- `POST /hash-string` - Bcrypt hashing
- All endpoints use corresponding validation middleware

### **market-routes.ts**
Exclusive content marketplace:
- `POST /purchase-instant-exclusive-content-access` - Buy exclusive video access
- Middleware chain:
  1. `validatePurchaseInstantAccess` - Validate video ID and tier
  2. `jwtVerifyAttachSolanaWallet` - Attach user wallet
  3. `attachExclusiveVideoDataById` - Fetch video tier info
  4. `confirmTierNotSoldOut` - Check tier availability
  5. `confirmCreatorNotBuyingOwnContent` - Prevent self-purchase
  6. `confirmUserDoesntAlreadyHaveAccess` - Prevent duplicate purchases
  7. `confirmUserHasSufficientFunds` - Verify wallet balance

### **personal-info-routes.ts**
User account settings:
- `GET /get-personal-info` - Retrieve user settings and wallet info
  - Uses: `jwtVerifyAttachUser`, `attachSolanaWalletByUserId`
- `POST /set-default-currency/:defaultCurrency` - Set currency preference (SOL/USD)
- `POST /set-default-site-theme/:defaultSiteTheme` - Set UI theme preference
- All endpoints use `jwtVerifyAttachUser`

### **positions-and-transactions-routes.ts**
User wallet and purchase history:
- `GET /get-solana-transactions` - Get transaction history (deposits/withdrawals)
  - Uses: `jwtVerifyAttachSolanaWallet`
- `GET /get-my-purchased-exclusive-content` - Get purchased exclusive videos
  - Uses: `jwtVerifyAttachUser`

### **search-routes.ts**
Search functionality:
- `GET /username/:username` - Search for creator by username
- `GET /general-search/:searchTerm` - Full-text search (videos + creators)
- `GET /get-videos-by-tag/:videoTag` - Filter videos by tag
- `GET /check-if-public-key-exists-with-fortuna/:publicKey` - Wallet lookup
- Most endpoints use `optionalJwtVerifyWithUserAttachment` (works with or without auth)
- Username and public key endpoints require auth (`jwtVerifyAttachUser`)

### **solana-routes.ts**
Solana blockchain interactions:
- **Transfers**:
  - `POST /money-transfer-to-username` - Send SOL to Fortuna user by username
  - `POST /money-transfer-to-public-key` - Send SOL to external wallet address
  - Both require: wallet attachment, confirmation of recipient existence, and sufficient funds
- **Price & Fees**:
  - `GET /get-sol-price` - Current SOL/USD price
  - `POST /get-transaction-fees` - Calculate transaction fees (internal use)
  - `POST /get-transaction-details` - Get transaction info from signature (internal use)
- **Wallet Operations**:
  - `GET /get-wallet-balance` - Get user wallet balance in SOL and USD
  - `POST /request-airdrop` - Request SOL airdrop (devnet only)
  - `GET /get-inbound-transfer-history/:publicKey` - Get deposits to wallet

Transfer endpoints validate sender/recipient, confirm sufficient funds, and attach wallet data.

### **upload-routes.ts**
File upload endpoints (using multer):
- **Videos**:
  - `POST /upload-video` - Upload video file
- **Thumbnails**:
  - `POST /upload-thumbnail-picture` - Upload new video thumbnail
  - `POST /upload-new-thumbnail-picture` - Update existing video thumbnail
- **Creator Media**:
  - `POST /upload-profile-picture` - Upload profile picture
  - `POST /upload-channel-banner-picture` - Upload channel banner

All endpoints use `jwtVerifyAttachUser`. Use `multer().single("file")` to parse file from request.

### **videos-routes.ts**
Video viewing and interaction:
- **Discovery**:
  - `GET /get-home-page-data` - Featured/homepage videos
  - `GET /get-recently-uploaded-videos` - Recently added content
  - `GET /get-video/:videoUUID` - Get single video details
  - `GET /get-creator-videos/:creatorUsername` - Get all videos by creator
- **Playback**:
  - `GET /get-video-url/:videoUUID` - Get signed S3 URL for video streaming
- **Interaction**:
  - `POST /like-or-unlike-video` - Toggle video like status
  - `POST /report-video` - Report video for policy violation

Public endpoints use `optionalJwtVerifyWithUserAttachment`. Exclusive content endpoints require exclusive access verification via `confirmUserHasExclusiveAccess`.

### **youtube-routes.ts**
YouTube integration (currently disabled):
- `GET /get-user-youtube-info` - Fetch connected YouTube channel info
- **Status**: Disabled for client access, has bug that revokes user's YouTube access token
- Uses: `jwtVerifyAttachUser`, `attachYouTubeAccessToken`

## Auth Middleware Types

- **jwtVerifyAttachUser** - Required auth, attaches `req.user`
- **jwtVerifyAttachSolanaWallet** - Required auth + wallet, attaches wallet and user
- **optionalJwtVerifyWithUserAttachment** - Optional auth, attaches if provided

## Middleware Chains Overview

### Standard Creator Flow
1. Validation → 2. JWT verify → 3. Confirm creator ownership → 4. Execute

### Exclusive Content Purchase Flow
1. Validation → 2. JWT verify → 3. Attach video data → 4. Check tier available → 5. Check permissions → 6. Check funds → 7. Execute

### Public Content View Flow
1. Validation → 2. Optional JWT → 3. Execute (may attach exclusive access status)

## Route Organization

- **Public routes**: Videos, search, Solana price, creator profiles
- **Auth required**: Creator management, uploads, transfers, personal settings
- **Wallet required**: Exclusive purchases, transactions, SOL transfers
- **Admin/Internal**: Encryption utilities, transaction fee calculations

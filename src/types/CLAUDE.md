# Types Directory

TypeScript global type definitions and interfaces for the application. All files declare global types, making them accessible throughout the codebase without imports.

## Files Overview

### **utils.d.ts**
Core utility types used across the application:
- `EmailOrUsername`: Login identifier type ("Email" | "Username")
- `JwtPayload`: JWT token payload structure (userId, newUser)
- `S3FolderNames`: S3 storage folder paths (uploaded-images, uploaded-videos, profile-pictures, channel-banner-pictures)
- `DeterministicEncryptionKeys`: Types for deterministic encryption ("EMAIL_ENCRYPTION_KEY")
- `NonDeterministicEncryptionKeys`: Types for non-deterministic encryption ("SECRET_KEY_ENCRYPTION_KEY", "YT_REFRESH_TOKEN_ENCRYPTION_KEY")
- `SecretKeys`: All AWS/application secrets accessible through SecretsManager
- `SecretsObject`: Typed object mapping all secret keys to their string values
- `PublicOrPrivate`: S3 bucket access level ("Public" | "Private")
- `PrismaType`: Prisma client type with removed transaction methods

### **auth.d.ts**
Authentication and credential types:
- `LoginInformation`: Login form data (contact, password)
- `RegisterInformation`: Registration form data (email, username, siteTheme, password)
- `NewLocalUserFields`: User record fields for local (non-OAuth) accounts
- `DeterministicEncryptedString`: Branded type for deterministically encrypted strings (emails)
- `NonDeterministicEncryptedString`: Branded type for non-deterministically encrypted strings (secrets, tokens)
- `HashedString`: Branded type for bcrypt-hashed strings (passwords)

### **prisma.d.ts**
Extended Prisma model types with decrypted/processed fields:
- `ExtendedCredentials`: User credentials with decrypted email and hashed password fields
- `ExtendedSolanaWallet`: Solana wallet with decrypted secret key
- `ExtendedYouTubeAccessTokens`: YouTube tokens with decrypted refresh token

### **environment.d.ts**
Node.js environment variable declarations:
- JWT_KEY, S3 bucket names, Solana fee payer details
- Google OAuth credentials
- Encryption keys (deterministic and non-deterministic)
- AWS credentials and DATABASE_URL
- NODE_ENV: local, staging, or production

### **creator.d.ts**
Creator and video content type definitions:
- `IncomingNewVideoData`: Raw video upload data (uuid, image/video IDs, tiers, tags)
- `IncomingNewVideoTierData`: Tier pricing and availability data
- `VideoTierData`: Tier data with sellout status
- `RetrievedCreatorDBVideoData`: Raw database query result for creator videos
- `OutputCreatorVideoData`: Video data formatted for API response (includes calculated profits)
- `VideoTags`: Video tag with ID mapping
- `CreatorDetails`: Creator profile database structure (channel name, bio, banner, socials)
- `CreatorInfoData`: Creator info formatted for API response

### **videos.d.ts**
Video content and search type definitions:
- `RetrievedHomePageVideosFromDB`: Raw DB query result for homepage videos
- `RetrievedVideosByCreatorUsername`: Creator channel with all videos
- `RetrievedHomePageCreators`: Creator profiles for homepage display
- `RetrievedCreatorsByUsername`: Single creator profile lookup
- `VideoDataNeededToCheckForExclusiveContentAccess`: Minimal data for access control
- `NonExclusiveVideoData`: Metadata for non-exclusive videos
- `ExclusiveVideoData`: Full data for exclusive content (pricing, tier info)
- `VideoDataSendingToFrontendLessVideoUrl`: Complete video data without streaming URL
- `VideoDataSendingToFrontendWithVideoUrl`: Video data with optional signed S3 URL
- `CreatorSearchDataSendingToFrontend`: Creator info for search results
- `VideosAndCreatorData`: Combined video and creator data response
- `SearchData`: Union type for search results (video or creator)

### **positions-and-transactions.d.ts**
Wallet transactions and exclusive content purchase types:
- `RetrievedMyExclusiveContentData`: Raw DB result for purchased exclusive videos
- `BasicRetrievedDBTransationListData`: Base transaction fields (amount, currency, date)
- `OutgoingTransactionListData`: Sent transactions with fee information
- `IncomingTransactionListData`: Received transactions
- `MyExclusiveContentData`: Exclusive video purchase formatted for API response
- `OutputTransactionData`: Transaction formatted for API response (deposit/withdrawal type)

### **solana.d.ts**
Solana blockchain and wallet interaction types:
- `MoneyTransferData`: Transfer parameters (recipient, amount, currency)
- `AddSolTransferToDB`: Transaction record to store (amounts in SOL and USD, signatures, balances)
- `TransferDetailsLessDefaultCurrency`: Transfer amounts in both SOL and USD
- `TransferDetails`: Transfer details with default currency context
- `CreatorWalletDataLessSecretKey`: Public wallet info (public key, wallet ID)
- `CreatorWalletData`: Full wallet data including encrypted secret key

### **youtube.d.ts**
YouTube OAuth and API token types:
- `RetrievedYouTubeAccessTokensData`: Raw DB result for YouTube tokens
- `TypedRetrievedYouTubeAccessTokensData`: YouTube tokens with properly typed encrypted refresh token

### **custom-express.d.ts**
Extended Express Request object properties (middleware attachments):
- `user`: Authenticated user credentials with decrypted fields
- `optionallyAttachedUser`: Optional user from non-required auth middleware
- `solanaWallet`: User's Solana wallet data
- `recipientPublicKey`: PublicKey for transfer recipients
- `minimalDataNeededToCheckForExclusiveContentAccess`: Video access control data
- `exclusiveVideoData`: Full exclusive content metadata
- `nonExclusiveVideoData`: Non-exclusive video metadata
- `isRecipientFortunaWallet`: Whether recipient is Fortuna vs external wallet
- `recipientSolanaWalletId`: Wallet ID if recipient is Fortuna user
- `youtubeAccessToken`: Decrypted YouTube access token

## Encryption Type System

The codebase uses branded types to track encryption state:
- `HashedString`: Bcrypt-hashed (one-way)
- `DeterministicEncryptedString`: AES-256-CBC encrypted (reversible, same input = same output)
- `NonDeterministicEncryptedString`: AES-256-GCM encrypted (reversible, random IV/salt per encryption)

These are TypeScript compile-time markers to prevent mixing encrypted data types.

## Database Query Result Pattern

Type naming convention:
- `Retrieved*`: Raw results from database queries (matches DB column names, snake_case)
- `Output*` or `*SendingToFrontend`: Formatted for API responses (camelCase, calculated fields added)
- `*Data`: Generic data container
- `Extended*`: Prisma model with additional processed fields

## Architecture Notes

- All types are **globally declared** - no imports needed
- Types follow **database first** → **API response** pattern (Retrieved* → Output*)
- Encrypted fields are **branded types** to prevent accidental usage
- Request attachments in `custom-express.d.ts` represent middleware data flow
- Video types support both **exclusive (paid)** and **non-exclusive (free)** content paths

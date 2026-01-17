# Utils Directory

Reusable utility functions organized by feature domain. These are pure functions and helpers used throughout the application.

## Subdirectories Overview

### **auth-helpers/**
Authentication and JWT utilities:

#### **determine-contact-type.ts**
- `determineLoginContactType(input)` - Identifies if input is email or username using validator.js
- Returns: `"Email"` | `"Username"`
- Used in login flows to route to correct user lookup

#### **get-decoded-id.ts**
- `getDecodedId(accessToken)` - Decodes JWT and extracts userId
- Verifies token signature using JWT_KEY from SecretsManager
- Returns: userId from token payload
- Used to get current user from Bearer token

#### **jwt/sign-jwt.ts**
- `signJWT(payload)` - Creates signed JWT token
- Payload: `{ userId: number, newUser: boolean }`
- Returns: Signed token string
- Used after successful login/registration

#### **login/retrieve-user-from-contact.ts**
- `retrieveUserFromContact(loginContact, loginContactType)` - Look up user by email or username
- For email: encrypts with deterministic encryption before DB query
- For username: case-insensitive search
- Returns: `ExtendedCredentials | null`
- Used in login controller

#### **register/construct-local-user-fields.ts**
- `constructLocalUserFields(registerInformation, hashedPassword)` - Prepare user record for insertion
- Encrypts email deterministically
- Sets auth_method: "fortuna" for local accounts
- Returns: `NewLocalUserFields` object ready for DB insert
- Used in register controller

### **exclusive-content/**
Access control utilities for paid video content:

#### **check-if-user-allowed-to-access-content.ts**
- `checkIfUserAllowedToAccessContent(video, userId)` - Single video access check
- Returns true if: video is free OR user is creator OR user purchased access
- Returns: boolean
- Used by confirmation middleware before serving exclusive content

#### **check-which-exclusive-content-user-allowed-to-access.ts**
- `checkWhichExclusiveContentUserAllowedToAccess(videos, userId)` - Batch access check
- Returns: `{ [videoId]: boolean }` access map
- Filters out non-exclusive and creator videos, then batch-checks purchases
- Handles undefined userId (unauthenticated users see all exclusive content as false)
- Used in video listing endpoints to efficiently set access flags

### **google/**
Google OAuth and YouTube integration:

#### **create-google-auth-client.ts**
- `createGoogleAuthClient()` - Initialize OAuth2Client for Google auth
- Fetches GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from SecretsManager
- Uses callback mode: "postmessage"
- Returns: Configured OAuth2Client
- Used in Google login callback handling

#### **refresh-google-access-token.ts**
- Refreshes Google/YouTube access tokens using refresh_token
- Called when access token expires

#### **retrieve-youtube-subscriber-count.ts**
- Fetches YouTube channel subscriber count via YouTube API
- Used for creator profile data enrichment

### **s3/**
S3 bucket key generation utilities:

#### **create-s3-key.ts**
- `createS3Key(folderName, uuid)` - Create S3 object path
- Returns: `"{folderName}/{uuid}"`
- Example: `"uploaded-videos/abc-123-def-456"`
- `createS3KeyGenerateUUID(folderName)` - Generate UUID and create key
- Returns: `{ key: string, uuid: string }`
- Used before uploading to S3

### **solana/**
Solana blockchain interaction utilities:

#### **create-solana-wallet.ts**
- `createSolanaWallet()` - Generate new Solana keypair
- Returns: `Keypair` (public and secret keys)
- Used when creating user wallet on registration

#### **get-cluster-url-by-env.ts**
- `getClusterUrlByEnv()` - Get Solana RPC endpoint
- Production: QuickNode mainnet RPC
- Development/Staging: Official devnet
- Returns: Cluster URL string
- Used in all Solana connection operations

#### **get-wallet-balance.ts**
- `getWalletBalanceSol(publicKey)` - Get balance in SOL
- `getWalletBalanceWithUSD(publicKey)` - Get balance in both SOL and USD
- Queries blockchain and converts lamports to SOL
- Returns: balance details with timestamp
- Used in wallet endpoints and transaction validation

#### **get-keypair-from-secret-key.ts**
- Converts encrypted secret key to Keypair for signing transactions

#### **determine-transaction-fee.ts**
- Calculates network fees for transactions

#### **transfer-sol-from-fan-to-creator.ts**
- Handles SOL transfer from buyer to creator (exclusive content purchase)

#### **transfer-sol-from-creator-to-fortuna.ts**
- Handles SOL transfer from creator to Fortuna wallet (fee collection)

#### **calculate-transaction-fee-*.ts**
- Fee calculation and database updates for transaction fees

#### **print-wallet-balance.ts**
- Debug utility for printing wallet balance to console

### **transform/**
Data transformation utilities that convert database results to API responses.

#### **videos/**
Video data transformation:

- **transform-home-page-video-data.ts** - Convert raw DB video objects to frontend format
  - Checks exclusive access for each video
  - Counts likes and sets user like status
  - Maps tier data and tags
  - Returns: `VideoDataSendingToFrontendLessVideoUrl[]`

- **transform-video-by-uuid-data.ts** - Single video detail transformation
- **transform-videos-by-creator-username.ts** - Creator's video list transformation
- **transform-exclusive-content-list.ts** - User's purchased exclusive videos

#### **creator/**
Creator profile data transformation:

- **transform-creator-info.ts** - Creator profile details formatting
- **transform-creator-content-list.ts** - Creator's content list with stats
- **transform-creator-search-data.ts** - Creator data for search results
- **transform-home-page-creator-data.ts** - Featured creators formatting

#### **transform-transactions-list.ts**
- Converts raw transaction records to API response format
- Handles both incoming and outgoing transactions
- Formats amounts, dates, and fee information

### **types/**
TypeScript type utilities and guards:

#### **type-guards.ts**
Type predicate functions for runtime validation:

- `validateYouTubeTokenData()` - Checks if refresh token is properly encrypted
- `validateExtendedCredentials()` - Checks if email field is encrypted
- `validateExtendedSolanaWallet()` - Checks if secret key is encrypted

Used to safely cast Prisma results to extended types with decrypted fields.

### **Root Level Utilities**

#### **get-allowed-origins.ts**
- `allowedOrigins()` - CORS allowed origin domains
- Production: createfortuna.com, www.createfortuna.com
- Staging: devnet.createfortuna.com
- Development: localhost:3000
- Used in CORS middleware configuration

#### **get-env-path.ts**
- `getEnvPath()` - Returns env file path based on NODE_ENV
- Staging: .env.devnet.production
- Production: .env.mainnet.production
- Development: .env.local
- Used to determine which env file to load

#### **get-video-duration.ts**
- `getVideoDuration(buffer)` - Extract duration from video file using ffmpeg
- Writes buffer to temp file, probes with ffprobe, cleans up temp file
- Returns: Duration in seconds
- Used when uploading videos to store metadata

## Transformation Pattern

Transform utilities follow this pattern:
1. Accept raw database results (`Retrieved*` types)
2. Apply business logic (access checks, calculations)
3. Map to API response format (`*SendingToFrontend` types)
4. Return formatted data

This separation keeps database queries isolated from presentation logic.

## Encryption Integration

Many utilities work with encrypted fields:
- Email: Deterministic encryption (consistent for lookups)
- Secrets/Tokens: Non-deterministic encryption (random IV/salt)
- Type guards validate encryption state at runtime

## Error Handling

All utilities follow consistent error handling:
- Log errors with console.error()
- Re-throw for caller to handle
- Allow middleware/controllers to catch and format responses

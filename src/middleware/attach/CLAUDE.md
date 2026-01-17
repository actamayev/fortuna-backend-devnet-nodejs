# Attach Middleware

Data attachment and enrichment middleware.

## Middleware

### **attach-solana-wallet-by-user-id.ts**
- Query and attach user's Solana wallet
- Process:
  1. Get user ID from req.user
  2. Query database for wallet
  3. Decrypt wallet secret key
  4. Attach to `req.solanaWallet`

- Attaches: `req.solanaWallet` (ExtendedSolanaWallet)

### **attach-public-key-by-transfer-to-username.ts**
- Look up recipient public key by username
- Used in: SOL transfers to username
- Process:
  1. Get recipient username from request
  2. Query for recipient user
  3. Get their wallet's public key
  4. Attach to `req.recipientPublicKey`

- Attaches: `req.recipientPublicKey` (PublicKey), `req.recipientSolanaWalletId`

### **attach-youtube-access-token.ts**
- Decrypt and attach YouTube access token
- Process:
  1. Get user ID from req.user
  2. Query YouTube tokens for user
  3. Decrypt refresh token
  4. Attach to `req.youtubeAccessToken`

- Attaches: `req.youtubeAccessToken` (string)

### **attach-non-exclusive-video-data-by-id.ts**
- Query and attach non-exclusive video metadata
- Process:
  1. Get video ID from request
  2. Query video record
  3. Get listing status
  4. Attach to `req.nonExclusiveVideoData`

- Attaches: `req.nonExclusiveVideoData` (NonExclusiveVideoData)

## Subdirectory: exclusive-video-data/

### **attach-exclusive-video-data-by-id.ts**
- Query and attach exclusive video tier and pricing data
- Process:
  1. Get video ID from request
  2. Query video with tier and pricing info
  3. Verify video is exclusive
  4. Attach complete data to `req.exclusiveVideoData`

- Attaches: `req.exclusiveVideoData` (ExclusiveVideoData)

### **attach-minimal-exclusive-video-data-by-id.ts**
- Query minimal exclusive video data (cheaper query)
- Process:
  1. Get video ID from request
  2. Query basic exclusive video info (tier, pricing)
  3. Used when only basic data needed

- Attaches: `req.minimalDataNeededToCheckForExclusiveContentAccess`

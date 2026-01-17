# Write Database Operations

Mutation functions for creating, updating, and deleting records in the database. All operations use Prisma ORM.

## Naming Convention

- `add-*`: Create new records
- `update-*`: Modify existing records
- `upsert-*`: Create if doesn't exist, update if does (insert or update)
- `mark-*-inactive`: Soft delete (set is_active to false)
- `set-*`: Specific field updates

## Subdirectories

### **blockchain-fees-paid-by-fortuna/**
- `add-blank-record-blockchain-fees-paid-by-fortuna()` - Create empty fee record (populated later)
- `update-blockchain-fees-paid-by-fortuna()` - Fill in fee amounts after transaction

### **blockchain-fees-paid-by-user/**
- `add-blank-record-blockchain-fees-paid-by-user()` - Create empty fee record
- `update-blockchain-fees-paid-by-user()` - Update with calculated fees

### **channel-banner/**
- `add-channel-banner()` - Upload channel banner
- `update-channel-banner()` - Update existing banner
- `mark-channel-banner-inactive()` - Delete/hide banner

### **channel-description/**
- `upsert-channel-description()` - Create or update channel bio

### **channel-name/**
- `upsert-channel-name()` - Create or update channel name

### **credentials/**
- `add-user()` - Create new user account
- `add-user-with-wallet()` - Create user with Solana wallet
- `add-google-user()` - Create OAuth user from Google
- `update-user-default-currency()` - Update currency preference
- `update-user-default-site-theme()` - Update theme preference
- `update-user-profile-picture()` - Link profile picture to user
- `update-user-channel-banner()` - Link channel banner to user

### **exclusive-video-access-purchase/**
- `add-exclusive-video-access-purchase()` - Record purchase after transaction
- Includes recording the transfer transactions

### **exclusive-video-access-purchase-fortuna-take/**
- `add-exclusive-video-access-purchase-fortuna-take()` - Record Fortuna's fee transfer

### **exclusive-video-access-purchase-sol-transfer/**
- `add-exclusive-video-access-purchase-sol-transfer()` - Record fan→creator transfer

### **login-history/**
- `add-login-history()` - Record user login for audit trail

### **profile-picture/**
- `add-profile-picture()` - Upload profile picture
- `update-profile-picture()` - Update existing picture
- `mark-profile-picture-inactive()` - Delete/hide picture

### **report-video/**
- `add-video-report()` - Record video report/complaint

### **simultaneous-writes/**
Transactions combining multiple operations (Prisma `$transaction`):

- `add-user-with-wallet-with-channel-name()` - Create user + wallet + channel name (atomic)
- `add-google-user-with-wallet()` - Create OAuth user + wallet
- `upsert-profile-picture-and-update-user()` - Upload picture and link to user
- `upsert-channel-banner-picture-and-update-user()` - Upload banner and link to user
- `set-username-and-channel-name()` - Set both username and channel name together
- `add-youtube-access-token-record-and-update-user()` - Record YouTube tokens and update user
- `add-tag-to-lookup-and-mapping()` - Create tag and assign to video (atomic)

### **social-platform-link/**
- `upsert-social-platform-link()` - Add or update social media link
- `mark-social-platform-link-inactive()` - Remove social link

### **sol-transfer/**
- `add-sol-transfer()` - Record SOL transfer
- `update-sol-transfer-wallet-balances()` - Update balances after transaction

### **uploaded-image/**
- `add-image-record()` - Create image reference (after S3 upload)
- `update-uploaded-image-video-id()` - Link image to video

### **uploaded-video/**
- `add-video-record()` - Create video file reference
- `update-uploaded-video-video-id()` - Link video file to video record
- `update-video-duration()` - Store extracted video duration

### **video/**
- `add-video-record()` - Create new video with metadata
- `update-video-name()` - Update title
- `update-video-description()` - Update description
- `set-new-video-listing-status()` - Change visibility (LISTED/UNLISTED/SOLDOUT)
- `update-video-feature-statuses()` - Set featured flag
- `update-unfeature-video()` - Clear featured flag
- `update-video-thumbnail-id()` - Link thumbnail to video

### **video-access-tier/**
- `add-video-access-tier()` - Create pricing tier
- `update-video-access-tier-sold-out-status()` - Mark tier as sold out

### **video-like-status/**
- `add-video-like()` - User likes a video
- `remove-video-like()` - User unlikes a video

### **video-tag-lookup/**
- `add-video-tag()` - Create new tag in lookup table

### **video-tag-mapping/**
- `add-tag-to-video()` - Assign tag to video
- `remove-tag-from-video()` - Remove tag from video

### **youtube-access-tokens/**
- `add-youtube-access-token()` - Store OAuth tokens
- `update-youtube-access-token()` - Refresh tokens

## Operation Patterns

### Simple Creates
```typescript
add-user(userData)
→ Created user record
```

### Upserts (Create or Update)
```typescript
upsert-social-platform-link(userId, platform, link)
→ Upserted link record
```

### Soft Deletes
```typescript
mark-social-platform-link-inactive(linkId)
→ Set is_active = false
```

### Updates with Calculations
```typescript
update-blockchain-fees-paid-by-fortuna(feeId, { feeSol, feeUsd })
→ Updated fee record
```

### Atomic Transactions
```typescript
add-user-with-wallet-with-channel-name(userData, wallet, channelName)
→ All-or-nothing: user + wallet + channel created together
```

## Transaction Patterns

### Purchase Flow
```typescript
// Step 1: Record fan→creator transfer
add-exclusive-video-access-purchase-sol-transfer(...)

// Step 2: Record fortuna fee transfer
add-exclusive-video-access-purchase-fortuna-take(...)

// Step 3: Link purchase to transfers (atomic)
add-exclusive-video-access-purchase(...)
```

### User Registration Flow
```typescript
// Atomic: Create user, wallet, channel name all together
add-user-with-wallet-with-channel-name(
  userFields,
  walletFields,
  channelName
)
```

### Media Upload Flow
```typescript
// 1. Upload to S3 (external)
// 2. Record reference
add-image-record(s3Url, filename)

// 3. Link to video
update-uploaded-image-video-id(imageId, videoId)
```

## Error Handling

- Throw database errors (unique constraints, foreign keys, etc.)
- Caller responsible for error handling
- Validation happens in middleware before writes

## Constraints Enforced

- Unique usernames (no duplicates)
- Unique emails (encrypted, deterministic)
- One wallet per user
- One channel name per user
- One purchase per user per video
- One like per user per video
- One report per user per video
- One social link per platform per user

## Performance Notes

- Simultaneous-writes use transactions for atomicity
- Batch operations preferred over loops
- Indexes on foreign keys for faster updates
- Soft deletes preserve audit trail

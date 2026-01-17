# Read Database Operations

Query functions for retrieving data from the database. All operations use Prisma ORM and follow naming conventions.

## Naming Convention

- `retrieve-*`: Fetch complete records with related data (joins)
- `find-*`: Lookup or existence checks
- `check-if-*`: Boolean existence or status checks
- `get-*`: Simple getters

## Subdirectories

### **channel-name/**
- `retrieve-creators-by-channel-name()` - Find creators by channel name (search)

### **credentials/**
- User record lookups
- Find user by username, email, or user ID

### **does-x-exist/**
- `doesUsernameExist()` - Check username availability
- `doesEmailExist()` - Check email availability
- `doesVideoTagExist()` - Check if tag exists

### **exclusive-video-access-purchase/**
- `check-if-user-made-exclusive-video-purchase()` - Check single purchase
- `check-if-user-made-exclusive-video-purchases()` - Batch check multiple purchases
- Retrieve purchase records with related data

### **find/**
- `find-user-by-where-condition()` - Generic user lookup with flexible where clauses
- `find-video-by-where-condition()` - Generic video lookup
- `find-credential-by-username()` - Username lookup

### **reported-video/**
- `check-if-user-reported-video()` - Prevent duplicate reports
- Retrieve video report records

### **search/**
- `check-if-public-key-registered-with-fortuna()` - Wallet lookup
- `get-usernames()` - Search for usernames
- `search-all()` - Full-text search across videos and creators

### **sol-transfer/**
- `retrieve-outgoing-transactions-list()` - User's sent transfers
- `retrieve-inbound-transactions-list()` - User's received transfers
- `retrieve-transaction-details-by-signature()` - Single transaction lookup

### **video/**
- `retrieve-video-by-uuid()` - Get video by UUID (S3 identifier)
- `retrieve-video-by-id()` - Get video by video ID
- `retrieve-exclusive-video-data-by-id()` - Full exclusive content data with tiers
- `retrieve-non-exclusive-video-by-id()` - Non-exclusive video metadata
- `retrieve-creator-content-list()` - All videos by creator
- `retrieve-recently-uploaded-videos()` - Recent videos for discovery
- `retrieve-videos-by-title()` - Search videos by title
- `retrieve-creator-wallet-info-from-video()` - Get creator's wallet (for payments)
- `check-if-creator-owns-video()` - Ownership verification
- `check-if-creator-owns-featured-and-unfeatured-videos()` - Check featured status
- `retrieve-video-data-for-exclusive-content-check()` - Minimal data for access control
- `retrieve-most-popular-channels()` - Trending creators

#### **video/home-page/**
- `retrieve-most-recent-videos-for-home-page()` - Recently uploaded
- `retrieve-most-liked-videos-for-home-page()` - Most popular/featured

### **video-tag-lookup/**
- `retrieve-video-tag-id-by-tag-name()` - Get tag ID by name
- `retrieve-videos-by-tag()` - Get all videos with specific tag

## Query Patterns

### Single Record Lookup
```typescript
retrieve-user-by-username(username)
→ User record or null
```

### Batch Lookups
```typescript
check-if-user-made-exclusive-video-purchases([videoIds], userId)
→ { [videoId]: boolean } map
```

### Searches
```typescript
retrieve-videos-by-title(searchTerm)
retrieve-creators-by-channel-name(channelName)
search-all(searchTerm)
→ Array of matching records
```

### Existence Checks
```typescript
check-if-user-reported-video(videoId, userId)
→ boolean
```

### Related Data Fetches
```typescript
retrieve-creator-wallet-info-from-video(videoId)
→ Video with creator wallet data joined
```

## Data Joins

Most operations include related data:
- **Videos**: Include creator, tiers, tags, like counts
- **Transactions**: Include sender/recipient, fees, balances
- **Creators**: Include profile, channel info, socials
- **Exclusive purchases**: Include video, tier, transfer records

## Performance Considerations

- Batch operations (`*-purchases`) more efficient than N+1 queries
- Home page operations optimized for pagination
- Search operations with text indexes
- Strategic use of Prisma `.include()` for joins

## Error Handling

- Null returns for missing records (not throwing)
- Empty arrays for no results
- Exceptions only for database errors

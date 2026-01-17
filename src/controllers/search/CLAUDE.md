# Search Controllers

Content and user discovery endpoints.

## Controllers

### **general-search.ts**
- Full-text search across videos and creators
- Returns both video and creator results matching search term
- Public endpoint (optional authentication)
- Pagination: Returns results with limit/offset
- Used by: `GET /search/general-search/:searchTerm`

### **search-for-username.ts**
- Search for specific creator by username
- Returns: Creator profile, channel name, video count, social links
- Exact match search (case-insensitive)
- Requires authentication
- Used by: `GET /search/username/:username`

### **get-videos-by-tag.ts**
- Filter videos by tag/category
- Returns: All videos with specified tag
- Pagination support
- Public endpoint (optional authentication)
- Used by: `GET /search/get-videos-by-tag/:videoTag`

### **check-if-public-key-exists-with-fortuna.ts**
- Check if Solana public key is registered with Fortuna
- Returns: Boolean and user info if exists
- Used for wallet validation and user discovery
- Requires authentication
- Used by: `GET /search/check-if-public-key-exists-with-fortuna/:publicKey`

## Search Behavior

- **General Search**: Full-text match on video titles, descriptions, creator names
- **Username Search**: Exact username lookup, case-insensitive
- **Tag Search**: Exact tag match from video_tag_lookup table
- **Public Key Search**: Lookup in wallet table

## Access Control

- Public searches: Optional auth (useful for anon browsing)
- Creator/wallet lookups: Require auth (prevent enumeration abuse)

## Results

Search results include:
- Videos: Metadata, creator info, thumbnails, pricing tiers
- Creators: Profile, channel info, video count, social links
- All results respect exclusive content access control (hidden if user doesn't own)

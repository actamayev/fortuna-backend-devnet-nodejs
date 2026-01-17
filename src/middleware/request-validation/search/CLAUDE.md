# Search Validation Middleware

Search request parameter validation.

## Middleware

### **validate-search-term.ts**
- Validate general search input
- Checks:
  - `searchTerm` (string): Search query from URL params (required)
  - Must not be empty
  - Length limits (min/max)

- Used in: General search for videos and creators

### **validate-search-username.ts**
- Validate username search input
- Checks:
  - `username` (string): Target username from URL params (required)
  - Valid username format
  - Length limits

- Used in: Username-specific search

### **validate-video-tag.ts**
- Validate video tag filter input
- Checks:
  - `videoTag` (string): Tag name from URL params (required)
  - Valid tag format
  - Exists in video_tag_lookup table

- Used in: Get videos by tag endpoint

### **validate-public-key.ts**
- Validate Solana public key format
- Checks:
  - `publicKey` (string): Public key from URL params (required)
  - Valid Solana public key format
  - Length and encoding

- Used in: Public key lookup endpoint

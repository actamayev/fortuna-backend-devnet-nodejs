# Exclusive Video Data Attachment Middleware

Exclusive content metadata queries.

## Middleware

### **attach-exclusive-video-data-by-id.ts**
- Fetch complete exclusive video data
- Used for: Full tier info, pricing, and stock data
- Process:
  1. Extract video ID from request (body or params)
  2. Query database for video with tiers
  3. Verify video is marked exclusive
  4. Attach `req.exclusiveVideoData` with:
     - Video ID
     - Creator user ID (for verification)
     - Tier pricing and availability
     - Total tier count
     - UUID for reference

- Attaches: `req.exclusiveVideoData` (ExclusiveVideoData)

### **attach-minimal-exclusive-video-data-by-id.ts**
- Fetch minimal exclusive video data
- Used for: Quick checks when full tier data unnecessary
- Process:
  1. Extract video ID from request
  2. Query lightweight exclusive video info
  3. Attach minimal data to `req.minimalDataNeededToCheckForExclusiveContentAccess`

- Attaches: `req.minimalDataNeededToCheckForExclusiveContentAccess`

## Usage

**attach-exclusive-video-data-by-id**: Purchase flows (need full tier details)
**attach-minimal-exclusive-video-data-by-id**: Like/report endpoints (only need access check)

## Error Handling

- Video not found: 404 Not Found
- Video not exclusive: Data attached but flags will indicate non-exclusive

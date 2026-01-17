# Videos Controllers

Video discovery, viewing, and user interaction.

## Controllers

### **get-home-page-data.ts**
- Get featured videos and creators for homepage
- Returns:
  - Featured videos with all metadata
  - Creator info for each video
  - Tier data and pricing
  - Like counts and user like status
  - Exclusive access status (if authenticated)

- Public endpoint (optional auth improves data relevance)
- Used by: `GET /videos/get-home-page-data`

### **get-recently-uploaded-videos.ts**
- Get recently added videos sorted by upload date
- Returns: Latest videos with full metadata
- Public endpoint (optional auth)
- Pagination support
- Used by: `GET /videos/get-recently-uploaded-videos`

### **get-video-by-uuid.ts**
- Get single video details by UUID
- Returns:
  - Complete video metadata
  - Creator profile information
  - All pricing tiers
  - Like count and user like status
  - Tags and categorization
  - Exclusive access verification

- Public endpoint: Returns data if video public or user has access
- Exclusive videos: Hidden from non-owners unless authenticated
- Used by: `GET /videos/get-video/:videoUUID`

### **get-videos-by-creator-username.ts**
- Get all videos published by a creator
- Returns:
  - All creator's videos with metadata
  - Creator profile (channel name, bio, social links, picture)
  - Video count and subscriber-like data
  - Filtered by listing status (published vs draft)

- Public endpoint (optional auth)
- Shows only published videos to non-owners
- Used by: `GET /videos/get-creator-videos/:creatorUsername`

### **get-video-url.ts**
- Get signed S3 URL for video playback
- Process:
  1. Verify user has access (free or purchased exclusive)
  2. Generate signed URL from private S3 bucket
  3. URL expires in 2 hours
  4. Cached to reduce S3 API calls

- Returns: Temporary playable URL
- Used by: `GET /videos/get-video-url/:videoUUID`

### **like-or-unlike-video.ts**
- Toggle like status for a video
- Requires:
  1. User authentication
  2. Exclusive access (if video is exclusive)
  3. Video must exist

- Process:
  1. Check current like status
  2. Insert like if not liked, delete if liked
  3. Return new like status

- Used by: `POST /videos/like-or-unlike-video`

### **report-video.ts**
- Report video for policy violation
- Requires:
  1. User authentication
  2. Exclusive access (if video is exclusive)
  3. User hasn't already reported this video

- Process:
  1. Check for duplicate reports (prevent spam)
  2. Record report in database
  3. Include report reason/category

- Returns: Report confirmation
- Used by: `POST /videos/report-video`

## Access Control

- **Public videos**: Visible to everyone
- **Exclusive videos**: Visible only to:
  - Creator
  - Users who purchased access
  - Authenticated users see tier pricing
  - Unauthenticated users see video exists but can't view

## Data Transformation

All list endpoints use transform utilities:
- `transformHomePageVideoData()` - Featured/homepage videos
- `transformVideosByCreatorUsername()` - Creator channel videos
- `transformVideoByUUIDData()` - Single video details

Transformations:
1. Map database fields to API format
2. Check exclusive access status
3. Calculate like counts and user status
4. Format pricing tiers
5. Attach creator info

## Authorization

- View: Public (optional auth for personalization)
- Like/Report: Require auth + exclusive access
- Streaming: Require exclusive access verification

## Performance

- Signed URLs cached with 2-hour expiration
- Batch access checks for multiple videos
- Like status computed with efficient queries

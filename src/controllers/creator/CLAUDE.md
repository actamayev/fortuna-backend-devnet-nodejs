# Creator Controllers

Creator profile management and video content operations.

## Main Controllers

### **create-video.ts**
- Create new video with metadata and tier data
- Input: Video name, description, tier pricing, exclusive flag
- Creates: Video record, tiers, stores thumbnail/video IDs
- Returns: Video ID and details
- Used by: `POST /creator/create-video`

### **get-creator-info.ts**
- Retrieve creator profile data
- Returns: Channel name, description, profile picture, banner, social links
- Used by: `GET /creator/get-creator-info`

### **get-creator-content-list.ts**
- List all videos created by authenticated user
- Includes: Video metadata, tier data, statistics
- Used by: `GET /creator/get-creator-content-list`

### **edit-channel-name.ts**
- Update creator channel name
- Updates: Channel name record
- Used by: `POST /creator/edit-channel-name`

### **edit-video-name.ts**
- Update video title
- Requires: Creator ownership verification
- Used by: `POST /creator/edit-video-name`

### **update-video-listing-status.ts**
- Change video visibility (draft/published/unlisted)
- Requires: Creator ownership, valid video ID in params
- Used by: `POST /creator/update-video-listing-status/:videoId`

### **remove-current-profile-picture.ts**
- Delete creator profile picture
- Updates: Profile picture reference to null
- Used by: `POST /creator/remove-current-profile-picture`

### **remove-current-channel-banner-picture.ts**
- Delete channel banner
- Updates: Channel banner reference to null
- Used by: `POST /creator/remove-current-channel-banner-picture`

## Subdirectory: channel-description/

### **add-or-edit-channel-description.ts**
- Create or update channel bio/description
- Updates: Channel description record
- Used by: `POST /creator/add-or-edit-channel-description`

### **edit-video-description.ts**
- Update video description
- Requires: Creator ownership verification
- Used by: `POST /creator/edit-video-description`

## Subdirectory: feature-unfeature-video/

### **feature-video.ts**
- Pin video to creator profile (make featured)
- Requires: Creator ownership, valid tier data attached
- Used by: `POST /creator/feature-video`

### **unfeature-video.ts**
- Remove video from featured section
- Requires: Creator ownership, video was featured
- Used by: `POST /creator/unfeature-video`

## Subdirectory: video-tag/

### **add-tag-to-video.ts**
- Add tag/category to video
- Creates: Video-tag mapping in database
- Requires: Creator ownership
- Used by: `POST /creator/add-video-tag`

### **remove-tag-from-video.ts**
- Remove tag from video
- Deletes: Video-tag mapping
- Requires: Creator ownership
- Used by: `POST /creator/delete-video-tag`

## Subdirectory: social-platform-link/

### **add-or-edit-social-platform-link.ts**
- Add or update social media link (YouTube, Twitter, etc.)
- Creates or updates: Social platform link record
- Used by: `POST /creator/add-or-edit-social-platform-link`

### **remove-social-platform-link.ts**
- Remove social media link
- Deletes: Social platform link record
- Requires: Platform name in URL params
- Used by: `POST /creator/remove-social-platform-link/:socialPlatform`

## Authorization

All creator endpoints require:
1. `jwtVerifyAttachUser` - User must be authenticated
2. `confirmCreatorOwnsVideo*` - User must own the video (for video operations)

## Data Flow

- Input validation → Creator verification → Database operation → Response
- Profile changes: Direct updates to creator profile
- Video changes: Require ownership verification before update
- Tag/Social operations: Simple insert/delete operations

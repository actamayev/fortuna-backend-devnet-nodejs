# Creator Validation Middleware

Creator operation request validation.

## Middleware

### **validate-create-video.ts**
- Validate video creation request
- Checks:
  - `videoName` (string): Video title (required)
  - `description` (string): Video description (required)
  - `isContentExclusive` (boolean): Exclusive flag
  - `tierData` (array): Pricing tier data
  - `videoTags` (array): Tag IDs

- Validates:
  - Title and description not empty, length limits
  - Tier structure: tier numbers, pricing
  - Tag IDs are valid

### **validate-edit-video-name.ts**
- Validate video name update
- Checks:
  - `videoId` (number): Target video
  - `videoName` (string): New name

### **validate-edit-video-description.ts**
- Validate video description update
- Checks:
  - `videoId` (number): Target video
  - `description` (string): New description

### **validate-edit-channel-name.ts**
- Validate channel name update
- Checks:
  - `channelName` (string): New channel name (required)
  - Length limits, no special characters

### **validate-add-or-edit-channel-description.ts**
- Validate channel description update
- Checks:
  - `channelDescription` (string): New bio/description
  - Length limits

### **validate-add-or-edit-social-platform-link.ts**
- Validate social media link
- Checks:
  - `socialPlatform` (enum): Platform type (YouTube, Twitter, etc.)
  - `socialLink` (string): Valid URL format

### **validate-feature-video.ts**
- Validate feature video request
- Checks:
  - `videoId` (number): Target video

### **validate-unfeature-video.ts**
- Validate unfeature video request
- Checks:
  - `videoId` (number): Target video

### **validate-add-video-tag.ts**
- Validate add tag request
- Checks:
  - `videoId` (number): Target video
  - `tagId` (number): Tag to add

### **validate-delete-video-tag.ts**
- Validate remove tag request
- Checks:
  - `videoId` (number): Target video
  - `tagId` (number): Tag to remove

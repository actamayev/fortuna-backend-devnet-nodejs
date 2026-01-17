# Videos Validation Middleware

Video operations request validation.

## Middleware

### **validate-video-uuid-in-params.ts**
- Validate video UUID from URL params
- Checks:
  - `videoUUID` (string): UUID from URL parameter (required)
  - Valid UUID v4 format

- Used in: Get video, get video URL endpoints

### **validate-video-id-in-params.ts**
- Validate video ID from URL params
- Checks:
  - `videoId` (number): Video ID from URL parameter (required)
  - Valid positive integer

- Used in: Update listing status endpoint

### **validate-creator-username.ts**
- Validate creator username from URL params
- Checks:
  - `creatorUsername` (string): Username from URL parameter (required)
  - Valid username format
  - Not empty

- Used in: Get videos by creator endpoint

### **validate-like-or-unlike.ts**
- Validate like/unlike request
- Checks:
  - `videoId` (number): Target video (required)
  - Valid positive integer

- Used in: Like/unlike video endpoint

### **validate-report-video.ts**
- Validate video report request
- Checks:
  - `videoId` (number): Target video (required)
  - `reportReason` (string): Reason for report (required)
  - `reportReason` (enum): Valid reason from enum

- Validates:
  - Video exists
  - Valid report reason category

### **validate-purchase-instant-access.ts**
- Validate exclusive content purchase
- Checks:
  - `videoId` (number): Target video (required)
  - `videoAccessTierId` (number): Tier to purchase (required)
  - Amount in SOL or USD
  - Currency type

- Validates:
  - Video and tier exist
  - Amount is positive

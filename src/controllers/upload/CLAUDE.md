# Upload Controllers

File upload operations for media and profile content.

## Controllers

### **upload-video.ts**
- Upload video file to S3 private bucket
- Process:
  1. Receive video file from multipart request
  2. Validate video format (MP4, etc.)
  3. Extract video duration using ffmpeg
  4. Generate S3 key and UUID
  5. Upload to S3 private bucket
  6. Return video metadata (duration, S3 key, UUID)

- Returns: Video UUID, duration, S3 key
- Used by: `POST /upload/upload-video`

### **upload-thumbnail-picture.ts**
- Upload video thumbnail image during video creation
- Process:
  1. Receive image file from multipart request
  2. Validate image format (JPEG, PNG, etc.)
  3. Generate S3 key using provided UUID
  4. Upload to S3 public bucket
  5. Store image reference in database

- Requires: UUID in request body (from video creation flow)
- Returns: Image URL and metadata
- Used by: `POST /upload/upload-thumbnail-picture`

### **upload-new-thumbnail-picture.ts**
- Upload new/replacement thumbnail for existing video
- Similar to upload-thumbnail-picture but for updates
- Requires: Video ID in request body and creator ownership
- Used by: `POST /upload/upload-new-thumbnail-picture`

### **upload-profile-picture.ts**
- Upload creator profile picture
- Process:
  1. Receive image file
  2. Validate image format
  3. Generate S3 key for profile-pictures folder
  4. Upload to S3 public bucket
  5. Update creator profile with image reference

- Returns: Image URL and profile update
- Used by: `POST /upload/upload-profile-picture`

### **upload-channel-banner-picture.ts**
- Upload channel banner/header image
- Similar to profile picture upload
- Process:
  1. Receive image file
  2. Validate image format
  3. Generate S3 key for channel-banner-pictures folder
  4. Upload to S3 public bucket
  5. Update creator profile with image reference

- Returns: Image URL and profile update
- Used by: `POST /upload/upload-channel-banner-picture`

## Upload Flow

1. File received via multipart/form-data
2. Type validation: Check MIME type
3. Size limits: Enforced by multer middleware
4. Storage: Uploaded to S3 private (videos) or public (images) buckets
5. Database: Reference stored for retrieval

## S3 Organization

- **Videos**: `uploaded-videos/{uuid}` (private bucket)
- **Thumbnails**: `uploaded-images/{uuid}` (public bucket)
- **Profile Pictures**: `profile-pictures/{uuid}` (public bucket)
- **Channel Banners**: `channel-banner-pictures/{uuid}` (public bucket)

## Authorization

All upload endpoints require `jwtVerifyAttachUser` - User must be authenticated.

## File Handling

- Video duration: Extracted using ffmpeg-static
- Temporary files: Cleaned up after processing
- S3 URLs: Returned for immediate use
- Database storage: References for future retrieval

## Error Handling

- Invalid format: 400 Bad Request
- File too large: 413 Payload Too Large
- Upload failure: 500 Server Error with retry ability

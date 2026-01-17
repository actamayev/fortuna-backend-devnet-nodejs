# Upload Validation Middleware

File upload request validation.

## Middleware

### **validate-video-type.ts**
- Validate video file format
- Checks:
  - MIME type must be: video/mp4, video/quicktime, etc.
  - File extension: .mp4, .mov, etc.

- Response: 400 if unsupported format

### **validate-image-type.ts**
- Validate image file format
- Checks:
  - MIME type must be: image/jpeg, image/png, image/webp, etc.
  - File extension: .jpg, .png, .webp, etc.

- Response: 400 if unsupported format

### **validate-uuid-in-body.ts**
- Validate UUID parameter
- Checks:
  - `uuid` (string): UUID from request body (required)
  - Valid UUID v4 format

- Used in: Thumbnail upload with video UUID

### **validate-video-id-in-body.ts**
- Validate video ID parameter
- Checks:
  - `videoId` (number): Video ID from request body (required)
  - Valid positive integer

- Used in: Update thumbnail with video ID

## File Validation

All validators check:
- File present in request
- MIME type matches
- File size (multer configured limits)
- File extension

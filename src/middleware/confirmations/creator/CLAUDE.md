# Creator Confirmations Middleware

Creator authorization and ownership verification.

## Middleware

### **confirm-creator-owns-video-by-id.ts** (2 variants)
- `confirmCreatorOwnsVideoByIdInBody` - Video ID in request body
- `confirmCreatorOwnsVideoByIdInParams` - Video ID in URL params

- Checks:
  1. Extract video ID from request
  2. Query video creator_user_id
  3. Verify matches req.user.user_id

- Response: 403 if user doesn't own video

### **confirm-creator-owns-video-to-feature.ts**
- Verify creator owns video before featuring
- Specialized check with video data attachment
- Response: 403 if not owner

### **confirm-creator-owns-video-to-unfeature.ts**
- Verify creator owns video before unfeaturing
- Checks current featured status
- Response: 403 if not owner or not featured

## Usage

Used in route chains:
- Edit video endpoints
- Feature/unfeature endpoints
- Tag management endpoints
- Video deletion endpoints

All require `jwtVerifyAttachUser` before confirmation middleware.

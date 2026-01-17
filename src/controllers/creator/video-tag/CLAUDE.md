# Video Tag Controllers

Video categorization and tagging.

## Controllers

### **add-tag-to-video.ts**
- Add tag/category to video for discovery and filtering
- Creates: Video-tag mapping in database
- Requires: Creator ownership, valid tag
- Used by: `POST /creator/add-video-tag`

### **remove-tag-from-video.ts**
- Remove tag from video
- Deletes: Video-tag mapping
- Requires: Creator ownership
- Used by: `POST /creator/delete-video-tag`

## Business Logic

- Tags enable searching and filtering (see `/search/get-videos-by-tag`)
- Multiple tags per video
- Only creator can manage their video tags
- Tags are predefined in database lookup table

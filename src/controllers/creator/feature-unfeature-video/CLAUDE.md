# Feature/Unfeature Video Controllers

Video featured status management.

## Controllers

### **feature-video.ts**
- Pin video to creator profile (mark as featured)
- Shows prominently on creator channel
- Requires: Creator ownership verification, valid tier data
- Used by: `POST /creator/feature-video`

### **unfeature-video.ts**
- Remove video from featured section
- Requires: Creator ownership, video must be featured
- Used by: `POST /creator/unfeature-video`

## Business Logic

- Featured status is stored in database
- Only creator can feature/unfeature their own videos
- Used for profile curation and content discovery

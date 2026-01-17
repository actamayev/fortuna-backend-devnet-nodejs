# Channel Description Controllers

Channel metadata management.

## Controllers

### **add-or-edit-channel-description.ts**
- Create or update channel description/bio
- Upsert operation: Creates if doesn't exist, updates if it does
- Used by: `POST /creator/add-or-edit-channel-description`

### **edit-video-description.ts**
- Update individual video description
- Requires: Video ID and creator ownership
- Used by: `POST /creator/edit-video-description`

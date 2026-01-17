# Social Platform Link Controllers

Creator social media profile management.

## Controllers

### **add-or-edit-social-platform-link.ts**
- Add or update creator social media link
- Platforms: YouTube, Twitter, Instagram, etc. (SocialPlatforms enum from Prisma)
- Upsert operation: Creates if new platform, updates if exists
- Used by: `POST /creator/add-or-edit-social-platform-link`

### **remove-social-platform-link.ts**
- Remove social media link from creator profile
- Requires: Platform name in URL params
- Used by: `POST /creator/remove-social-platform-link/:socialPlatform`

## Business Logic

- Social links displayed on creator profile
- Used for cross-promotion and audience discovery
- Only one link per platform per creator
- Links appear in search results and creator discovery

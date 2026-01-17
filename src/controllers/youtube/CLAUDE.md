# YouTube Controllers

YouTube integration (currently not accessible to client).

## Controllers

### **get-user-youtube-info.ts**
- Get connected YouTube channel information
- Requires:
  1. User authentication
  2. Valid YouTube access token attached

- Returns: YouTube channel details
- Status: Disabled for client access
- Known issue: Bug revokes user's YouTube access token
- Used by: `GET /youtube/get-user-youtube-info`

## Status

Currently in development. Not accessible to client until functionality is perfected and token revocation bug is fixed.

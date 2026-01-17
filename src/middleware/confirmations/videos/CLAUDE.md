# Videos Confirmations Middleware

Video access and state validation.

## Middleware

### **confirm-user-has-exclusive-access.ts**
- Verify user can access exclusive content
- Checks:
  1. Get video from `req.minimalDataNeededToCheckForExclusiveContentAccess`
  2. Check if video is exclusive
  3. If exclusive: Verify user is creator OR has purchased access
  4. If not exclusive: Allow (free video)

- Process:
  1. Query exclusive access purchase records
  2. Match user_id and video_id
  3. Verify purchase exists

- Response: 403 Forbidden if no access

### **confirm-user-hasnt-already-reported-video.ts**
- Prevent duplicate video reports
- Checks:
  1. Get video ID and user ID
  2. Query video_report table
  3. Verify no existing report from user

- Response: 400 if already reported

## Access Control

Used in:
- Like video endpoint (require access to like exclusive content)
- Report video endpoint (require access to report exclusive content)

Allows all interactions with free videos, restricts exclusive videos to authorized users.

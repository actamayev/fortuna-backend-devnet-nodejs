# Google Auth Validation Middleware

Google OAuth request validation.

## Middleware

### **validate-google-login-auth-callback.ts**
- Validate Google OAuth callback token
- Checks:
  - `credential` (string): Google ID token format (required)
  - JWT structure validation
  - Token format compliance

- Ensures token is valid JWT before processing

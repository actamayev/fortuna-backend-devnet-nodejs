# Auth Validation Middleware

Authentication request validation.

## Middleware

### **validate-login.ts**
- Validate login request body
- Checks:
  - `contact` (string): Email or username (required)
  - `password` (string): Password (required)

- Validation: contact must not be empty, password length, format

### **validate-register.ts**
- Validate registration request body
- Checks:
  - `email` (string): Valid email format (required)
  - `username` (string): Valid username format (required)
  - `password` (string): Strong password requirements (required)
  - `siteTheme` (enum): Light/Dark/Auto (required)

- Validation:
  - Email: Valid email format
  - Username: Alphanumeric, length limits
  - Password: Minimum strength requirements
  - Theme: Valid enum value

### **validate-register-username.ts**
- Validate username setting request (for OAuth flows)
- Checks:
  - `username` (string): Valid username format (required)

- Used after OAuth to collect username

## Subdirectory: google/

### **validate-google-login-auth-callback.ts**
- Validate Google OAuth callback
- Checks:
  - `credential` (string): Google ID token (required)
  - Token format and content

- Validates JWT structure from Google

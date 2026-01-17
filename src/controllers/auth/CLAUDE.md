# Auth Controllers

User authentication and authorization endpoints.

## Controllers

### **login.ts**
- Handles local username/email login
- Flow: Verify credentials → Generate JWT → Return token
- Used by: `POST /auth/login`

### **register.ts**
- Creates new local user account
- Flow: Hash password → Encrypt email → Create wallet → Generate JWT
- Returns: JWT token and user info
- Used by: `POST /auth/register`

### **register-username.ts**
- Set username after OAuth registration
- Requires: JWT authentication
- Updates user with username and auth method
- Used by: `POST /auth/set-username`

### **logout.ts**
- Logout endpoint (token invalidation on client)
- Server-side: Stateless JWT, no action needed
- Used by: `POST /auth/logout`

### **google-login-auth-callback.ts**
- Google OAuth callback handler
- Verifies Google ID token → Find/create user → Return JWT
- Used by: `POST /auth/google-auth/login-callback`

### **youtube-auth-callback.ts**
- YouTube OAuth callback handler
- Currently not accessible to client
- Stores encrypted YouTube access tokens

## Middleware Chain

All auth endpoints use:
1. Validation middleware - Validates request body format
2. Auth helpers - JWT signing, user lookup, credential checking

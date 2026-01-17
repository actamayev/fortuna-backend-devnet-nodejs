# JWT Middleware

JWT token verification and user/wallet attachment.

## Middleware

### **jwt-verify-attach-user.ts**
- Verify JWT token and attach authenticated user
- Required middleware: User MUST be authenticated
- Process:
  1. Extract Bearer token from Authorization header
  2. Verify token signature using JWT_KEY
  3. Decode token to get userId
  4. Query database for user record
  5. Attach user to `req.user` (with decrypted email/password fields)

- Response codes:
  - 401: No token provided
  - 401: Invalid or expired token
  - 404: User not found (token valid but user deleted)

- Attaches: `req.user` (ExtendedCredentials)

### **jwt-verify-attach-solana-wallet.ts**
- Verify JWT and attach user + Solana wallet
- Required middleware: User MUST have wallet
- Process:
  1. Run jwt-verify-attach-user
  2. Query user's Solana wallet
  3. Decrypt wallet secret key
  4. Attach wallet to `req.solanaWallet`

- Response codes:
  - 401: Unauthorized (from JWT check)
  - 404: Wallet not found

- Attaches: `req.user` (ExtendedCredentials), `req.solanaWallet` (ExtendedSolanaWallet)

### **optional-jwt-verify-with-user-attachment.ts**
- Verify JWT token IF provided, but don't require it
- Optional middleware: User CAN be anonymous
- Process:
  1. Check if Authorization header exists
  2. If yes: Verify token and attach user (like jwt-verify-attach-user)
  3. If no: Continue without user (req.user undefined)

- Never returns 401 (always passes)
- Attaches: `req.optionallyAttachedUser` (ExtendedCredentials | undefined)

## Usage Pattern

- **Required auth**: Use `jwt-verify-attach-user`
- **Wallet required**: Use `jwt-verify-attach-solana-wallet`
- **Optional auth**: Use `optional-jwt-verify-with-user-attachment`

## Token Structure

JWT payload:
```json
{
  "userId": 123,
  "newUser": false
}
```

Token stored: Authorization header as `Bearer {token}`

## Error Handling

- Missing token (required): 401 Unauthorized
- Invalid token: 401 Unauthorized
- Expired token: 401 Unauthorized
- Wallet missing (wallet required): 404 Not Found
- User not found: 404 Not Found

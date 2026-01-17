# Personal Info Controllers

User account preferences and settings.

## Controllers

### **get-personal-info.ts**
- Retrieve authenticated user's personal settings
- Returns:
  - Username, email, auth method
  - Default currency preference (SOL/USD)
  - Default site theme preference
  - Wallet balance (if wallet exists)
  - Wallet address
- Used by: `GET /personal-info/get-personal-info`

### **set-default-currency.ts**
- Set user's preferred currency for display
- Options: SOL or USD
- Updates: User preference in database
- Used by: `POST /personal-info/set-default-currency/:defaultCurrency`

### **set-default-site-theme.ts**
- Set user's UI theme preference
- Options: Light/Dark/Auto (from SiteThemes enum)
- Updates: User preference in database
- Used by: `POST /personal-info/set-default-site-theme/:defaultSiteTheme`

## Authorization

All endpoints require `jwtVerifyAttachUser` - User must be authenticated and accessing their own data.

## Preferences

- **Currency**: Affects display of amounts throughout app (SOL vs USD)
- **Theme**: Client-side UI preference stored for personalization
- **Wallet**: Optional, created on first Solana transaction

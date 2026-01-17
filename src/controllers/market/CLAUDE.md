# Market Controllers

Exclusive content purchase and transactions.

## Controllers

### **purchase-instant-exclusive-content-access.ts**
- Purchase exclusive video access (instant buy)
- Complete transaction flow:
  1. Validate video ID and tier
  2. Attach user wallet
  3. Fetch exclusive video metadata
  4. Confirm tier not sold out
  5. Confirm creator is not buying own content
  6. Confirm user doesn't already have access
  7. Confirm sufficient funds in wallet
  8. Execute transaction: Transfer SOL from fan to creator
  9. Record purchase in database

- Amounts: Transaction in SOL or USD (based on user's default currency)
- Returns: Transaction details and confirmation
- Used by: `POST /market/purchase-instant-exclusive-content-access`

## Middleware Chain

1. `validatePurchaseInstantAccess` - Validate video ID and tier
2. `jwtVerifyAttachSolanaWallet` - Authenticate and attach wallet
3. `attachExclusiveVideoDataById` - Fetch video tier pricing
4. `confirmTierNotSoldOut` - Check tier availability
5. `confirmCreatorNotBuyingOwnContent` - Prevent self-purchase
6. `confirmUserDoesntAlreadyHaveAccess` - Prevent duplicate purchases
7. `confirmUserHasSufficientFunds` - Check wallet balance

## Blockchain Integration

- Uses Solana wallet attached by middleware
- Transfers SOL from buyer to creator
- Records transaction signature
- Updates wallet balances (buyer and creator)

## Error Handling

- Insufficient funds: 402 error
- Tier sold out: Cannot purchase
- Already owns: Cannot repurchase
- Creator cannot buy own: Prevented at confirmation layer

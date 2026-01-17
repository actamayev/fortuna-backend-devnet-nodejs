# Market Confirmations Middleware

Exclusive content purchase validation.

## Middleware

### **confirm-tier-not-sold-out.ts**
- Verify tier has available purchases
- Checks:
  1. Get tier data from `req.exclusiveVideoData`
  2. Verify `is_tier_sold_out` is false
  3. Check if `purchases_allowed` > 0

- Response: 400 if sold out

### **confirm-user-doesnt-already-have-exclusive-access.ts**
- Prevent duplicate purchases of same exclusive content
- Checks:
  1. Get video ID from `req.exclusiveVideoData`
  2. Query for existing purchase by user
  3. Verify no purchase exists

- Response: 400 if already purchased

### **confirm-user-has-sufficient-funds-to-purchase-exclusive-access.ts**
- Verify wallet has enough SOL for purchase
- Checks:
  1. Get purchase amount and currency
  2. Get wallet balance from `req.solanaWallet`
  3. Convert to SOL if needed
  4. Compare balance >= amount

- Response: 402 Payment Required if insufficient

### **confirm-creator-not-buying-instant-access-to-own-exclusive-content.ts**
- Prevent creator from buying their own exclusive content
- Checks:
  1. Get video creator_user_id from `req.exclusiveVideoData`
  2. Verify buyer user_id != creator_user_id

- Response: 400 if self-purchase

## Purchase Flow Chain

```
validatePurchaseInstantAccess
↓
jwtVerifyAttachSolanaWallet
↓
attachExclusiveVideoDataById
↓
confirmTierNotSoldOut
↓
confirmCreatorNotBuyingOwnContent
↓
confirmUserDoesntAlreadyHaveAccess
↓
confirmUserHasSufficientFunds
↓
purchaseInstantExclusiveContentAccess (controller)
```

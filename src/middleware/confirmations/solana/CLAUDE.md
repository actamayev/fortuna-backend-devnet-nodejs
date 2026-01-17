# Solana Confirmations Middleware

Wallet and transaction validation.

## Middleware

### **confirm-public-key-exists.ts**
- Verify Solana public key exists on blockchain
- Checks:
  1. Get public key from `req.recipientPublicKey`
  2. Query blockchain balance
  3. Verify key is valid/active

- Response: 400 if invalid public key

### **confirm-not-sending-sol-to-self.ts**
- Prevent sending SOL to own wallet
- Checks:
  1. Get sender public key from `req.solanaWallet`
  2. Get recipient public key from `req.recipientPublicKey`
  3. Compare: sender != recipient

- Response: 400 if self-transfer

### **confirm-user-has-sufficient-funds-to-transfer.ts**
- Verify wallet has enough SOL for transfer + fees
- Checks:
  1. Get transfer amount from request
  2. Query wallet balance from blockchain
  3. Calculate fees
  4. Verify: balance >= amount + fees

- Response: 402 Payment Required if insufficient

## Transfer Flow Chain

```
validateTransferSol*
↓
jwtVerifyAttachUser
↓
attachPublicKeyByTransferToUsername (or validate pubkey)
↓
confirmPublicKeyExists
↓
checkIfPublicKeyPartOfFortuna (or attach solana wallet)
↓
attachSolanaWalletByUserId
↓
confirmNotSendingSolToSelf
↓
confirmUserHasSufficientFunds
↓
transferSol (controller)
```

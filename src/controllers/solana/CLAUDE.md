# Solana Controllers

Solana blockchain wallet and transaction operations.

## Controllers

### **transfer-sol.ts**
- Transfer SOL between wallets
- Two modes:
  1. To Fortuna username: Recipient is another Fortuna user
  2. To public key: Recipient is external Solana wallet

- Process:
  1. Validate transfer amount
  2. Attach sender wallet and recipient public key
  3. Confirm sender has sufficient funds
  4. Execute blockchain transfer
  5. Record transaction in database
  6. Update wallet balances

- Returns: Transaction details and signature
- Used by: `POST /solana/money-transfer-to-username` and `POST /solana/money-transfer-to-public-key`

### **get-sol-price.ts**
- Get current SOL/USD exchange rate
- Queries price from SolPriceManager (cached)
- No authentication required (public data)
- Used by: `GET /solana/get-sol-price`

### **get-solana-wallet-balance.ts**
- Get authenticated user's wallet balance
- Returns: Balance in SOL and USD, current SOL price, timestamp
- Queries blockchain in real-time
- Requires: `jwtVerifyAttachSolanaWallet`
- Used by: `GET /solana/get-wallet-balance`

### **get-transaction-fees.ts**
- Calculate network fees for transaction
- Internal use: Helps calculate total transaction cost
- Takes: Transaction signatures
- Returns: Fee amounts in SOL and USD
- Used by: `POST /solana/get-transaction-fees`

### **get-transaction-details.ts**
- Get details of a transaction by signature
- Queries blockchain for transaction info
- Internal use: For transaction verification and reconciliation
- Used by: `POST /solana/get-transaction-details`

### **request-solana-airdrop.ts**
- Request SOL airdrop (devnet only)
- For testing: Requests free SOL from devnet faucet
- Production: Disabled
- Requires: `jwtVerifyAttachSolanaWallet`
- Used by: `POST /solana/request-airdrop`

### **get-inbound-transfer-history.ts**
- Get all deposits to a specific wallet address
- Takes: Public key in URL params
- Returns: All incoming transfers with amounts and dates
- Public endpoint: No auth required
- Used by: `GET /solana/get-inbound-transfer-history/:publicKey`

## Middleware Chain (for transfers)

1. `validateTransferSol*` - Validate recipient and amount
2. `jwtVerifyAttachUser` - Authenticate sender
3. `attachPublicKeyByTransferToUsername` (or validate public key)
4. `confirmPublicKeyExists` - Verify recipient exists
5. `checkIfPublicKeyPartOfFortuna` - Check if Fortuna or external wallet
6. `attachSolanaWalletByUserId` - Get sender's wallet
7. `confirmNotSendingSolToSelf` - Prevent self-transfer
8. `confirmUserHasSufficientFundsToTransfer` - Check balance
9. `transferSol` - Execute transaction

## Blockchain Integration

- RPC endpoint: QuickNode (mainnet) or official devnet
- Keypair signing: Uses Solana Keypair for transaction signing
- Transaction recording: Signature stored for verification
- Fee tracking: Blockchain fees recorded for audit

## Error Cases

- Insufficient funds: 402 Payment Required
- Invalid recipient: 400 Bad Request
- Self-transfer: 400 Bad Request
- Network error: 500 Server Error

# Positions and Transactions Controllers

User wallet activity and exclusive content purchase history.

## Controllers

### **get-solana-transactions.ts**
- Retrieve user's Solana wallet transaction history
- Returns:
  - All deposits (incoming transfers)
  - All withdrawals (outgoing transfers)
  - Transaction amounts in SOL and USD
  - Transaction signatures for verification
  - Blockchain fees paid
  - Wallet balance before/after each transaction

- Filters: Shows only transactions for authenticated user's wallet
- Used by: `GET /positions-and-transactions/get-solana-transactions`

### **get-my-purchased-exclusive-content.ts**
- Retrieve all exclusive videos user has purchased access to
- Returns:
  - Video metadata (name, duration, thumbnail)
  - Purchase date and price (SOL and USD)
  - Creator info (username, profile picture, channel name)
  - Transaction signature for verification
  - Current wallet balance at time of purchase

- Only shows videos user has purchased (not free videos)
- Used by: `GET /positions-and-transactions/get-my-purchased-exclusive-content`

## Authorization

Both endpoints require `jwtVerifyAttachSolanaWallet` or `jwtVerifyAttachUser` - User must be authenticated and can only access their own data.

## Data Sources

- **Transactions**: Queried from `sol_transfer` table
- **Exclusive Purchases**: Queried from `exclusive_video_access_purchase` table with join to video data
- **Balances**: Fetched from blockchain in real-time (via Solana RPC)

## Use Cases

- Wallet activity view: User sees all transfers in/out
- Purchase history: User sees what exclusive content they've bought
- Verification: Transaction signatures can be checked on blockchain

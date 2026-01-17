# Fortuna Backend - Project Documentation

Node.js Express API backend for Fortuna, a decentralized creator platform with exclusive content marketplace powered by Solana blockchain.

## Project Overview

**Stack**: Node.js + TypeScript + Express + Prisma ORM + PostgreSQL + Solana Web3
**Environment**: Devnet (staging) and Mainnet (production)
**Purpose**: Backend API for video creators to monetize exclusive content via cryptocurrency

## Core Features

- **User Authentication**: Local (username/password) and Google OAuth
- **Creator Tools**: Upload videos, manage tiers, set pricing, track earnings
- **Exclusive Content**: Tiered access system with Solana payments
- **Wallet Management**: Integrated Solana wallets for transfers and purchases
- **Transactions**: SOL/USD transfers between users and marketplace payments
- **Discovery**: Search, trending, tags, creator profiles
- **Engagement**: Likes, reports, creator channels with social links

## Project Structure

```
src/
├── index.ts                 # Express app setup, CORS, middleware chains
├── classes/                 # Singleton services (CLAUDE.md)
│   ├── aws-s3.ts           # S3 file uploads
│   ├── encryptor.ts        # Encryption/decryption (deterministic & non-deterministic)
│   ├── hash.ts             # Bcrypt password hashing
│   ├── prisma-client.ts    # Prisma ORM instance
│   ├── secrets-manager.ts  # Environment secrets (AWS/local)
│   └── solana/             # Solana blockchain operations
├── types/                   # Global TypeScript types (CLAUDE.md)
│   ├── auth.d.ts           # Auth types (encrypted strings, hashed)
│   ├── prisma.d.ts         # Extended Prisma types
│   ├── utils.d.ts          # Utility types (enums, literals)
│   ├── creator.d.ts        # Creator content types
│   ├── videos.d.ts         # Video data types
│   ├── positions-and-transactions.d.ts  # Transaction types
│   ├── custom-express.d.ts # Express request extensions
│   └── environment.d.ts    # Node environment variables
├── routes/                  # Express route definitions (CLAUDE.md)
│   ├── auth/               # Login, register, OAuth
│   ├── creator-routes.ts   # Creator profile/video management
│   ├── market-routes.ts    # Exclusive content purchases
│   ├── videos-routes.ts    # Video discovery and playback
│   ├── solana-routes.ts    # Wallet transfers and blockchain
│   ├── personal-info-routes.ts  # User settings
│   ├── upload-routes.ts    # File uploads to S3
│   ├── search-routes.ts    # Content discovery
│   └── encryption-routes.ts # Encryption utilities
├── controllers/             # Request handlers (CLAUDE.md per subdirectory)
│   ├── auth/               # Authentication logic
│   ├── creator/            # Creator operations
│   ├── market/             # Purchase transactions
│   ├── videos/             # Video retrieval and interaction
│   ├── solana/             # Blockchain operations
│   ├── upload/             # File handling
│   └── ...
├── middleware/              # Request processing (CLAUDE.md per subdirectory)
│   ├── jwt/                # Token verification
│   ├── attach/             # Data attachment and enrichment
│   ├── confirmations/      # Business logic validation
│   ├── request-validation/ # Input validation (Joi schemas)
│   └── joi/                # Validation schemas
├── utils/                   # Reusable utilities (CLAUDE.md)
│   ├── auth-helpers/       # JWT, user lookup, registration
│   ├── exclusive-content/  # Access control logic
│   ├── solana/             # Blockchain utilities
│   ├── transform/          # Data transformation (DB → API)
│   ├── s3/                 # S3 key generation
│   ├── google/             # OAuth helpers
│   └── types/              # Type guards
├── db-operations/          # Database queries (CLAUDE.md per subdirectory)
│   ├── read/               # SELECT queries (CLAUDE.md)
│   └── write/              # INSERT/UPDATE queries (CLAUDE.md)
└── classes/
    └── solana/             # Solana-specific classes

prisma/                      # Database (CLAUDE.md)
├── schema.prisma           # Database schema
└── migrations/             # 37 timestamped migrations
```

## Data Flow Architecture

### User Registration
```
POST /auth/register
↓ validateRegister (Joi)
↓ Hash password + encrypt email
↓ Create solana wallet
↓ Insert user + wallet + channel name (atomic transaction)
↓ Generate JWT
→ Return token
```

### Video Creation
```
POST /creator/create-video (with multipart file upload)
↓ Validate video format
↓ Extract duration via ffmpeg
↓ Upload to S3 private bucket
↓ Upload thumbnail to S3 public bucket
↓ Create video + tiers + tags (atomic)
→ Return video ID and metadata
```

### Exclusive Content Purchase
```
POST /market/purchase-instant-exclusive-content-access
↓ Validate video + tier
↓ Attach wallet
↓ Confirm: tier not sold out, user doesn't own, no duplicate purchase, sufficient funds
↓ Transfer SOL: buyer → creator
↓ Transfer SOL: creator → fortuna (fee)
↓ Record purchase + transfers (atomic)
→ Return transaction confirmation
```

### Video Discovery
```
GET /videos/get-home-page-data
↓ Query featured videos + creator info + pricing
↓ Check exclusive access for each video (batch)
↓ Transform to API format (DB snake_case → camelCase)
↓ Include like counts and user like status
→ Return paginated video list
```

## Key Design Patterns

### Encryption Strategy
- **Deterministic (AES-256-CBC)**: Emails (enables lookups)
- **Non-Deterministic (AES-256-GCM)**: Secrets, tokens (random IV/salt)
- **Hashed (Bcrypt)**: Passwords (one-way)

### Middleware Chain
```
Validation → Auth → Confirmation → Attachment → Controller
```

1. **Validation**: Joi schemas check request format
2. **Auth**: JWT verification attaches user/wallet
3. **Confirmation**: Business logic checks (ownership, funds, etc.)
4. **Attachment**: Related data fetched and attached
5. **Controller**: Business logic executes

### Database Patterns
- **Soft Deletes**: `is_active` flag instead of deletion
- **Atomic Transactions**: Multiple writes together (registration, purchases)
- **Indexes**: Foreign keys and common filters indexed
- **Constraints**: Unique values enforced (usernames, emails, purchases)

### Transform Pattern
```
Retrieved* (DB query result)
→ Transform (map fields, calculate, check access)
→ *SendingToFrontend (API response format)
```

## Environment Configuration

### Local Development
- `.env.local`: Local variables (database, secrets)
- Connects to local PostgreSQL
- Devnet Solana RPC endpoint
- Optional: Mock AWS services

### Staging (Devnet)
- `.env.devnet.production`: Staging secrets
- AWS Secrets Manager for sensitive data
- Devnet Solana cluster
- S3 buckets for staging

### Production (Mainnet)
- `.env.mainnet.production`: Production secrets
- AWS Secrets Manager (required)
- Mainnet Solana RPC (QuickNode)
- Production S3 buckets

## Critical Files

- **src/index.ts** - Express app initialization, CORS, middleware setup
- **prisma/schema.prisma** - Database schema (20 models)
- **src/types/*.d.ts** - Global type definitions
- **src/middleware/jwt/** - Authentication core
- **src/utils/transform/** - API response formatting
- **src/db-operations/** - All database queries

## Authentication Flow

1. User provides credentials (email/username + password OR Google token)
2. JWT verification middleware checks Authorization header
3. Token decoded to extract userId
4. User record fetched from database with decrypted fields
5. Attached to `req.user` for controller use
6. Controllers can verify ownership by comparing user IDs

## Authorization Checks

- **Creator operations**: User must own the resource
- **Exclusive content**: User is creator OR has purchased access
- **Wallet operations**: User must have wallet attached
- **Settings**: User can only modify their own data

## Database Schema

**20 Models** organized by purpose:
- **Auth**: credentials, login_history, youtube_access_tokens
- **Blockchain**: solana_wallet, sol_transfer, blockchain_fees_*
- **Content**: video, uploaded_image, uploaded_video, video_access_tier
- **Commerce**: exclusive_video_access_purchase, *_sol_transfer, *_fortuna_take
- **Creator**: channel_name, channel_description, social_platform_link, profile_picture, channel_banner
- **Engagement**: video_like_status, reported_video, video_tag_lookup, video_tag_mapping

See `prisma/CLAUDE.md` for complete schema documentation.

## Solana Integration

### Wallet Generation
- Generated on user registration (Keypair.generate())
- Secret key encrypted (non-deterministic) before storage
- Public key stored plaintext (public information)

### Transactions
- Transactions signed by user's keypair
- Signatures stored for blockchain verification
- Amounts tracked in both SOL and USD
- Fees calculated and recorded separately

### RPC Endpoints
- Devnet: Official Solana devnet
- Mainnet: QuickNode RPC endpoint (configured in SecretsManager)

## API Response Format

All responses use consistent format:
```json
{
  "success": true,
  "data": { /* actual response */ },
  "error": null
}
```

Error responses:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": 400,
    "message": "Validation failed",
    "details": []
  }
}
```

## Validation Layer

**Joi Schemas** in `src/middleware/joi/`:
- Type checking (string, number, boolean, etc.)
- Format validation (email, UUID, public key)
- Required field checks
- Range/length limits
- Custom validators

**Returns 400 Bad Request** if validation fails.

## Error Handling

Standard HTTP status codes:
- **400**: Validation error, invalid request
- **401**: Unauthorized (missing/invalid token)
- **402**: Payment Required (insufficient funds)
- **403**: Forbidden (insufficient permissions)
- **404**: Not found
- **500**: Server error

## Performance Optimizations

- **Caching**: Signed S3 URLs cached 2 hours, SOL prices cached
- **Batch Operations**: Multiple items checked in one query (not N+1)
- **Indexes**: Strategic database indexes on foreign keys and filters
- **Connection Pooling**: Prisma manages pool with PostgreSQL
- **Pagination**: List endpoints support limit/offset

## Security Considerations

- **Encrypted Secrets**: Environment variables in AWS Secrets Manager
- **Hashed Passwords**: Bcrypt with 10 salt rounds
- **Encrypted Data**: Emails and tokens encrypted before storage
- **JWT Expiration**: Tokens stateless, no server-side revocation (client-side logout)
- **CORS**: Restricted to registered origins (production: createfortuna.com)
- **Input Validation**: All requests validated via Joi schemas
- **SQL Injection Prevention**: Prisma ORM parameterized queries

## Deployment

### Devnet Deployment
```bash
npm install
npm run build
NODE_ENV=staging npm start
```

### Mainnet Deployment
```bash
npm install
npm run build
NODE_ENV=production npm start
```

**Requirements**:
- Node.js 18+
- PostgreSQL 12+
- AWS credentials for Secrets Manager and S3
- Solana network access (RPC endpoint)

## Development Workflow

1. **Local Setup**: `npm install`, configure `.env.local`
2. **Database**: `npx prisma migrate dev` (runs migrations)
3. **Code Changes**: Edit source files in `src/`
4. **Type Checking**: `npm run type-check`
5. **Linting**: `npm run lint`
6. **Testing**: `npm test` (if tests configured)
7. **Building**: `npm run build` (TypeScript compilation)

## Documentation Structure

Each major directory has a `CLAUDE.md` file:
- **src/classes/** - Singleton services and utilities
- **src/types/** - TypeScript type system
- **src/routes/** - API endpoint definitions
- **src/controllers/** (per subdirectory) - Request handlers
- **src/middleware/** (per subdirectory) - Processing middleware
- **src/utils/** - Reusable utility functions
- **src/db-operations/read/** - Query operations
- **src/db-operations/write/** - Mutation operations
- **prisma/** - Database schema and migrations
- **CLAUDE.md** (root) - This file, overall architecture

## Common Tasks

### Add New API Endpoint
1. Create validation middleware (Joi schema)
2. Create controller logic
3. Add route definition
4. Add CLAUDE.md documentation

### Add Database Query
1. Add read operation to `src/db-operations/read/`
2. Import in middleware or controller
3. Handle null/error cases
4. Update documentation

### Add Database Mutation
1. Add write operation to `src/db-operations/write/`
2. Determine if atomic transaction needed
3. Import in controller
4. Handle constraints and errors

## Useful Commands

```bash
# Development
npm run dev              # Start with hot reload
npm run build            # Compile TypeScript
npm run type-check       # Type checking only

# Database
npx prisma migrate dev   # Create/run migrations
npx prisma studio       # Visual database browser
npx prisma generate     # Generate Prisma client

# Linting
npm run lint            # Check code style
npm run lint:fix        # Auto-fix issues

# Production
npm start               # Run compiled code
```

## Key Contacts & References

- **Database**: See `prisma/CLAUDE.md`
- **API Routes**: See `src/routes/CLAUDE.md`
- **Controllers**: See `src/controllers/*/CLAUDE.md`
- **Middleware**: See `src/middleware/*/CLAUDE.md`
- **Database Ops**: See `src/db-operations/read/CLAUDE.md` and `write/CLAUDE.md`

## Troubleshooting

**Database Connection Issues**
- Check `DATABASE_URL` in `.env.local` or AWS Secrets Manager
- Verify PostgreSQL is running
- Run `npx prisma migrate deploy`

**Encryption/Decryption Errors**
- Verify encryption keys in Secrets Manager
- Check encrypted data format matches type
- Ensure SecretsManager is properly initialized

**Solana Transaction Failures**
- Verify sufficient SOL in wallet (use airdrop in devnet)
- Check RPC endpoint connectivity
- Verify network (devnet vs mainnet)
- Check transaction signature on blockchain explorer

**JWT Authentication Errors**
- Verify `JWT_KEY` in Secrets Manager
- Check Authorization header format: `Bearer {token}`
- Ensure token hasn't expired
- Verify token was generated by this API

**CORS Issues**
- Check allowed origins in `src/index.ts`
- Verify request origin matches whitelist
- Local dev should use `http://localhost:3000`

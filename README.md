# Fortuna Backend

A decentralized creator platform backend built with Node.js, Express, TypeScript, and Solana blockchain. Creators can monetize exclusive content through a tiered subscription model powered by cryptocurrency.

## Quick Start
### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Setup

1. **Clone and install dependencies**
```bash
git clone <repository>
cd fortuna-backend-devnet-nodejs
npm install
```

2. **Configure environment**
```bash
# Create .env.local for development
cp .env.example .env.local
```

3. **Setup database**
```bash
# Run migrations
npx prisma migrate dev

# Optional: Open database browser
npx prisma studio
```

4. **Start development server**
```bash
npm run dev
```

Server runs on `http://localhost:3000`

## 📋 Features

### User Management
- **Local Authentication**: Username/password registration and login
- **Google OAuth**: Sign in with Google account
- **Wallet Integration**: Automatic Solana wallet creation per user
- **User Preferences**: Currency (SOL/USD) and theme (light/dark) settings

### Creator Tools
- **Video Upload**: Upload videos and thumbnails to S3
- **Metadata Management**: Set titles, descriptions, tags
- **Channel Customization**: Channel name, bio, profile picture, banner
- **Social Integration**: Link YouTube, Twitter, Twitch, Spotify, etc.
- **Featured Content**: Pin videos to profile for visibility

### Exclusive Content Marketplace
- **Tiered Access**: Multiple pricing tiers per video
- **Limited Sales**: Set quantity limits per tier
- **Instant Purchase**: One-click exclusive content access
- **Smart Contracts**: Solana blockchain ensures secure transactions

### Content Discovery
- **Homepage**: Featured and recently uploaded videos
- **Search**: Full-text search across videos and creators
- **Filtering**: Browse by tags and categories
- **Creator Profiles**: View all videos from a creator
- **Trending**: Discover popular channels

### Community Features
- **Likes**: Like/unlike videos
- **Reports**: Report videos for policy violations

### Wallet & Transactions
- **SOL Transfers**: Send SOL between users
- **Transaction History**: Track all deposits and withdrawals
- **Purchase History**: View all exclusive content purchases
- **Balance Display**: Real-time wallet balance in SOL and USD
- **Fee Tracking**: Transparent blockchain and platform fees

## Key Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Blockchain**: Solana Web3.js
- **Storage**: AWS S3
- **Authentication**: JWT tokens
- **Encryption**: AES-256 (Bcrypt for passwords)
- **Validation**: Joi schemas

## Architecture

### Directory Structure
- **`src/`** - Application source code
- **`prisma/`** - Database schema and migrations (20 models)
- **`controllers/`** - Request handlers (auth, creator, market, videos, etc.)
- **`routes/`** - API endpoint definitions
- **`middleware/`** - Request processing (JWT, validation, confirmations, attachments)
- **`utils/`** - Utilities (encryption, auth, transformations, Solana)
- **`classes/`** - Singleton services (AWS S3, Encryptor, SecretsManager, etc.)
- **`types/`** - Global TypeScript type definitions
- **`db-operations/`** - Database queries (read) and mutations (write)

### Data Flow
```
Request
  ↓
Validation (Joi)
  ↓
Authentication (JWT)
  ↓
Confirmations (Business Logic)
  ↓
Attachment (Data Enrichment)
  ↓
Controller (Logic)
  ↓
Response
```

## Security

- **Encrypted Secrets**: AWS Secrets Manager
- **Hashed Passwords**: Bcrypt with 10 salt rounds
- **Encrypted Data**: Emails (deterministic), tokens (non-deterministic)
- **JWT Auth**: Stateless token-based authentication
- **Input Validation**: All inputs validated with Joi
- **CORS Protection**: Restricted to whitelisted origins
- **SQL Safety**: Prisma ORM prevents SQL injection

## Database

20 Prisma models covering:
- Authentication (credentials, login_history, youtube_access_tokens)
- Wallets & Transactions (solana_wallet, sol_transfer, blockchain fees)
- Content (video, uploaded_image, uploaded_video)
- Marketplace (video_access_tier, exclusive_video_access_purchase)
- Creator Profile (channel_name, description, social links, pictures)
- Engagement (likes, reports, tags)

See [prisma/CLAUDE.md](./prisma/CLAUDE.md) for complete schema.

## Environments

| Environment | Database | Blockchain | Secrets |
|-------------|----------|-----------|---------|
| **Local** | PostgreSQL local | Solana devnet | .env.local |
| **Staging** | AWS RDS | Solana devnet | AWS Secrets Manager |
| **Production** | AWS RDS | Solana mainnet | AWS Secrets Manager |

## Main API Endpoints

### Authentication
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login with credentials
- `POST /auth/google-auth/login-callback` - Google OAuth

### Creator
- `POST /creator/create-video` - Upload new video
- `GET /creator/get-creator-info` - Get profile info
- `GET /creator/get-creator-content-list` - List creator's videos
- `POST /creator/edit-channel-name` - Update channel name

### Videos
- `GET /videos/get-home-page-data` - Featured videos
- `GET /videos/get-video/:videoUUID` - Video details
- `GET /videos/get-video-url/:videoUUID` - Video playback URL
- `POST /videos/like-or-unlike-video` - Toggle like

### Marketplace
- `POST /market/purchase-instant-exclusive-content-access` - Buy exclusive access

### Wallet
- `GET /solana/get-wallet-balance` - Get wallet balance
- `POST /solana/money-transfer-to-username` - Send SOL to user
- `POST /solana/money-transfer-to-public-key` - Send SOL to address
- `GET /positions-and-transactions/get-solana-transactions` - Transaction history

### Search
- `GET /search/general-search/:searchTerm` - Full-text search
- `GET /search/username/:username` - Find creator
- `GET /search/get-videos-by-tag/:videoTag` - Filter by tag

### Upload
- `POST /upload/upload-video` - Upload video file
- `POST /upload/upload-thumbnail-picture` - Upload thumbnail
- `POST /upload/upload-profile-picture` - Upload profile picture

See [src/routes/CLAUDE.md](./src/routes/CLAUDE.md) for complete API documentation.

## Development

### Install
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Database
```bash
# Create/run migrations
npx prisma migrate dev

# Open database browser
npx prisma studio

# Deploy migrations
npx prisma migrate deploy
```

### Lint & Type Check
```bash
npm run lint
npm run type-check
```

## Environment Setup

Create `.env.local`:
```env
NODE_ENV=local
DATABASE_URL=postgresql://user:password@localhost:5432/fortuna_dev
PORT=3000

# Encryption keys
JWT_KEY=your-secret
EMAIL_ENCRYPTION_KEY=your-key
SECRET_KEY_ENCRYPTION_KEY=your-key
YT_REFRESH_TOKEN_ENCRYPTION_KEY=your-key

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
PUBLIC_S3_BUCKET=fortuna-public-dev
PRIVATE_S3_BUCKET=fortuna-private-dev

# Google OAuth
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret

# Solana
FORTUNA_FEE_PAYER_SECRET_KEY=your-key
FORTUNA_FEE_PAYER_WALLET_ID_DB=1
```

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete architecture and design patterns
- **[prisma/CLAUDE.md](./prisma/CLAUDE.md)** - Database schema documentation
- **[src/routes/CLAUDE.md](./src/routes/CLAUDE.md)** - API endpoint details
- **[src/controllers/*/CLAUDE.md](./src/controllers/)** - Controller documentation
- **[src/middleware/*/CLAUDE.md](./src/middleware/)** - Middleware documentation
- **[src/utils/CLAUDE.md](./src/utils/CLAUDE.md)** - Utility functions
- **[src/db-operations/read/CLAUDE.md](./src/db-operations/read/CLAUDE.md)** - Query operations
- **[src/db-operations/write/CLAUDE.md](./src/db-operations/write/CLAUDE.md)** - Mutation operations

## Troubleshooting

**PostgreSQL Connection Error**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env.local
- Run `npx prisma migrate dev`

**Solana Wallet Error**
- Check sufficient SOL in devnet
- Verify RPC endpoint is accessible
- Ensure NODE_ENV matches network

**Encryption Error**
- Verify all encryption keys are set
- Check key format and length
- Ensure SecretsManager is initialized

**JWT Auth Error**
- Clear token cache on client
- Verify JWT_KEY is set
- Check token hasn't expired

**S3 Upload Error**
- Verify AWS credentials
- Check S3 bucket exists and is accessible
- Ensure bucket policies allow uploads

## Deployment

### Production Build
```bash
npm run build
NODE_ENV=production npm start
```

### Docker
```bash
docker build -t fortuna-backend .
docker run -p 3000:3000 fortuna-backend
```

---

**Last Updated**: January 2026

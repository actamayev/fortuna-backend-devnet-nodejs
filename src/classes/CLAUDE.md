# Classes Directory

Core utility and infrastructure classes used throughout the application. These are singleton instances and service wrappers for AWS, encryption, hashing, and database operations.

## Files Overview

### **Singleton** (`singleton.ts`)
- Abstract base class for implementing the Singleton pattern
- Provides static instance storage and base configuration (AWS region: us-east-1)
- Subclasses must implement `getInstance()` method
- Used by: AwsS3, SecretsManager, VideoUrlsManager

### **SecretsManager** (`secrets-manager.ts`)
- Singleton that manages application secrets and environment variables
- Fetches secrets from AWS Secrets Manager in production/staging, or from `.env.local` in development
- Methods:
  - `getSecret(key)`: Retrieve a single secret with caching
  - `getSecrets(keys)`: Retrieve multiple secrets at once
- Automatically caches fetched secrets to avoid repeated AWS calls
- Secret sources: "new_devnet_secrets" (staging), "new_mainnet_secrets" (production)

### **AwsS3** (`aws-s3.ts`)
- Singleton wrapper around AWS S3 client for file uploads
- Methods:
  - `uploadImage(fileBuffer, key)`: Upload to public S3 bucket, returns URL
  - `uploadVideo(fileBuffer, key)`: Upload to private S3 bucket (URL is not returned)
- Uses SecretsManager to retrieve bucket names
- Handles both public and private bucket uploads with appropriate content types

### **VideoUrlsManager** (`video-urls-manager.ts`)
- Singleton that manages signed URLs for private video access
- Caches signed URLs with 2-hour expiration to reduce S3 API calls
- Methods:
  - `getVideoUrl(uuid)`: Returns cached or newly generated signed URL
- Automatically refreshes expired URLs
- Uses S3 `GetObjectCommand` with signed URLs for private video bucket access

### **PrismaClientClass** (`prisma-client.ts`)
- Singleton wrapper around Prisma ORM client
- Lazy-initializes the PrismaClient on first call
- Fetches DATABASE_URL from SecretsManager
- Method: `getPrismaClient()`: Returns shared Prisma client instance

### **Encryptor** (`encryptor.ts`)
- Handles both deterministic and non-deterministic encryption using AES
- **Non-deterministic encryption** (recommended for most data):
  - Uses AES-256-GCM with random IV and salt per encryption
  - Format: `iv:salt:encrypted:authTag` (all hex-encoded)
  - Methods: `nonDeterministicEncrypt()`, `nonDeterministicDecrypt()`, `isNonDeterminsticEncryptedString()`
- **Deterministic encryption** (use only when needed):
  - Uses AES-256-CBC with fixed IV (not production-recommended)
  - Base64 encoded output
  - Methods: `deterministicEncrypt()`, `deterministicDecrypt()`, `isDeterministicEncryptedString()`
- Retrieves encryption keys from SecretsManager

### **Hash** (`hash.ts`)
- Static utility class for bcrypt-based password hashing
- Methods:
  - `hashCredentials(data)`: Hash plaintext with 10 salt rounds
  - `checkPassword(plaintext, hashedPassword)`: Verify password against hash
- Used for secure password storage

## Subdirectories

### **solana/**
- `sol-price-manager.ts`: Manages SOL token price tracking
- `solana-manager.ts`: Handles Solana blockchain interactions

## Architecture Notes

- **Singleton Pattern**: AwsS3, SecretsManager, VideoUrlsManager, and PrismaClientClass use singleton to ensure single instances
- **Lazy Initialization**: Most singletons initialize on first use via `getInstance()`
- **Caching Strategy**: SecretsManager caches fetched secrets; VideoUrlsManager caches signed URLs with expiration checks
- **Environment-based Behavior**: SecretsManager switches between AWS and local .env.local based on NODE_ENV
- **Error Handling**: All classes log errors to console and throw for caller handling

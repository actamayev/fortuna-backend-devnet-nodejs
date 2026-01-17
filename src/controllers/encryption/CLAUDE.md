# Encryption Controllers

Encryption, decryption, and hashing utilities (development/testing).

## Controllers

### **deterministic-encryption.ts**
- Encrypt string with deterministic AES-256-CBC
- Same input always produces same output
- Used for: Email encryption (consistent lookups)
- Takes: Data string and encryption key name
- Returns: Base64-encoded encrypted string
- Used by: `POST /encryption/encrypt-deterministic-string`

### **deterministic-decryption.ts**
- Decrypt deterministic AES-256-CBC encrypted data
- Takes: Encrypted base64 string and encryption key name
- Returns: Decrypted plaintext
- Used by: `POST /encryption/decrypt-deterministic-string`

### **non-deterministic-encryption.ts**
- Encrypt string with non-deterministic AES-256-GCM
- Random IV and salt per encryption (different output each time)
- Used for: Secret keys, OAuth tokens
- Takes: Data string and encryption key name
- Returns: `iv:salt:encrypted:authTag` (hex-encoded)
- Used by: `POST /encryption/encrypt-nondeterministic-string`

### **non-deterministic-decryption.ts**
- Decrypt non-deterministic AES-256-GCM encrypted data
- Takes: Encrypted string and encryption key name
- Returns: Decrypted plaintext
- Used by: `POST /encryption/decrypt-nondeterministic-string`

### **hash-string.ts**
- Hash plaintext with bcrypt (one-way)
- Takes: String to hash and salt rounds
- Returns: Bcrypt hash
- Used for: Password hashing
- Used by: `POST /encryption/hash-string`

## Use Cases

- **Development**: Test encryption/decryption workflows
- **Admin**: Manual encryption operations if needed
- **Testing**: Verify encryption key configuration

## Security Note

These endpoints expose encryption operations. Restrict access to development/admin users in production.

# Encryption Validation Middleware

Encryption operation request validation.

## Middleware

### **validate-encryption-string.ts**
- Validate encryption request
- Checks:
  - `data` (string): Data to encrypt (required)
  - `encryptionKeyName` (string): Key identifier (required)

- Validates:
  - Data not empty
  - Valid encryption key name from enum

### **validate-decryption-string.ts**
- Validate decryption request
- Checks:
  - `encryptedData` (string): Encrypted data (required)
  - `encryptionKeyName` (string): Key identifier (required)

- Validates:
  - Encrypted data format matches expected pattern
  - Valid encryption key name

### **validate-hash-string.ts**
- Validate hash request
- Checks:
  - `data` (string): Data to hash (required)

- Validates:
  - Data not empty
  - Optional salt rounds parameter

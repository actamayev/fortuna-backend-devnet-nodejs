# Solana Validation Middleware

Solana transaction request validation.

## Middleware

### **validate-transfer-sol-to-username.ts**
- Validate SOL transfer to Fortuna username
- Checks:
  - `transferToUsername` (string): Recipient username (required)
  - `solToTransfer` or `usdToTransfer` (number): Amount (required)
  - `transferByCurrency` (enum): SOL or USD

- Validates:
  - Amount > 0
  - Valid username format
  - Currency is valid enum

### **validate-transfer-sol-to-public-key.ts**
- Validate SOL transfer to public key
- Checks:
  - `transferToPublicKey` (string): Recipient address (required)
  - `solToTransfer` or `usdToTransfer` (number): Amount (required)
  - `transferByCurrency` (enum): SOL or USD

- Validates:
  - Amount > 0
  - Valid Solana public key format
  - Currency is valid enum

### **validate-transaction-signatures.ts**
- Validate transaction signature format
- Checks:
  - `transactionSignature` (string): Blockchain signature (required)
  - Valid Solana transaction signature format

- Used in: Internal fee/details lookups

### **check-if-public-key-part-of-fortuna.ts**
- Check and validate public key ownership
- Verifies if public key belongs to Fortuna user
- Used in: Transfer to public key validation

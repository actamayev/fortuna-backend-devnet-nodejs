# Confirmations Middleware

Business logic verification and authorization checks.

## Purpose

Middleware that verifies business rules before allowing operations to proceed.

Common checks:
- User owns resource (creator owns video)
- Sufficient funds available
- Resource availability (tier not sold out)
- State validity (user hasn't already done operation)
- User eligibility (creator can't buy own content)

## Pattern

Confirmation middleware:
1. Receives pre-attached data from previous middleware
2. Checks business logic conditions
3. Returns 400/403 if check fails with specific error
4. Calls `next()` if all checks pass

## Error Codes

- 400: Invalid state (already reported, already purchased, etc.)
- 403: Forbidden (don't own resource, not authorized)
- 402: Payment Required (insufficient funds)

## Subdirectories

- **creator/** - Creator ownership and authorization
- **market/** - Marketplace purchase validation
- **solana/** - Wallet and transaction validation
- **videos/** - Video access and state validation

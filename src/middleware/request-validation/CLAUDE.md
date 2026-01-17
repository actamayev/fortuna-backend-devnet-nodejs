# Request Validation Middleware

Input validation for request bodies, parameters, and query strings.

## Purpose

Validate all incoming requests before they reach controllers:
- Type checking (string, number, boolean, etc.)
- Format validation (email, UUID, public key, etc.)
- Required field validation
- Length/range validation
- Custom rules

## Pattern

Each validator middleware:
1. Uses Joi schema from `../joi/` directory
2. Validates relevant request data (body, params, query)
3. Returns 400 Bad Request with validation errors if invalid
4. Calls `next()` if valid

## Validation Layers

Schemas check:
- Required fields
- Data types
- String length, email format, etc.
- Number ranges
- Custom formats (UUID, public key, enum values, etc.)
- Nested objects

## Error Response

400 Bad Request with details:
```json
{
  "error": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "Must be a valid email"
    }
  ]
}
```

## Subdirectories

- **auth/** - Login and registration validation
- **auth/google/** - Google OAuth validation
- **creator/** - Creator operations validation
- **encryption/** - Encryption operation validation
- **personal-info/** - Settings validation
- **search/** - Search parameter validation
- **solana/** - Solana transaction validation
- **upload/** - File upload metadata validation
- **videos/** - Video operations validation

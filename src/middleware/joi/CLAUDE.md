# Joi Middleware

Joi schema definitions for request validation.

## Purpose

Central location for Joi validation schemas used across validation middleware.

## Pattern

Each validation middleware:
1. Uses a Joi schema from this directory
2. Validates request body/params/query
3. Returns 400 if validation fails with error messages

Schemas ensure consistent validation rules across endpoints.

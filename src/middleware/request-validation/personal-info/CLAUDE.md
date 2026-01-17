# Personal Info Validation Middleware

User settings request validation.

## Middleware

### **validate-set-default-currency.ts**
- Validate currency preference update
- Checks:
  - `defaultCurrency` (enum): Currency from URL params
  - Must be: SOL or USD

- Validates currency is valid enum value

### **validate-set-default-site-theme.ts**
- Validate theme preference update
- Checks:
  - `defaultSiteTheme` (enum): Theme from URL params
  - Must be: Light, Dark, or Auto (SiteThemes enum)

- Validates theme is valid enum value

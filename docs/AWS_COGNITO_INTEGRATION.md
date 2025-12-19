# AWS Cognito Integration Guide

This guide explains how AWS Cognito authentication is integrated into the SSO API with local bypass mode for development.

## Overview

The SSO API supports dual-mode authentication:

- **Development Mode**: Local authentication with bcrypt password hashing (bypass mode)
- **Production Mode**: AWS Cognito User Pool authentication

The system automatically detects which mode to use based on configuration and falls back gracefully.

---

## Architecture

### Authentication Flow

```
User Login Request
    ↓
Check Cognito Configuration
    ↓
┌─────────────────┬─────────────────┐
│ Cognito Enabled │ Bypass Mode     │
│ (Production)    │ (Development)  │
└────────┬────────┴────────┬─────────┘
         │                 │
    Try Cognito      Use Local Auth
    Authentication   (bcrypt)
         │                 │
    Success?         Success?
         │                 │
    Return User     Return User
```

### Key Features

1. **Automatic Mode Detection**: Checks `COGNITO_BYPASS` and Cognito configuration
2. **Graceful Fallback**: Falls back to local auth if Cognito fails
3. **Migration Support**: Supports users with both Cognito and local passwords during migration
4. **Local Bypass Sub**: Generates placeholder `cognito_sub` values for local users

---

## Environment Variables

### SSO API

Add these variables to `services/sso-api/.env`:

```env
# AWS Cognito Configuration (Production)
AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
AWS_COGNITO_CLIENT_ID=your-cognito-client-id
AWS_COGNITO_REGION=us-east-1

# Development: Set to true to use local authentication (bypass Cognito)
COGNITO_BYPASS=true
```

### Development Mode (Local Bypass)

For development, set `COGNITO_BYPASS=true`:

```env
COGNITO_BYPASS=true
# Omit or leave empty:
# AWS_COGNITO_USER_POOL_ID=
# AWS_COGNITO_CLIENT_ID=
```

**Behavior in Bypass Mode**:

- All authentication uses local bcrypt password hashing
- Generates placeholder `cognito_sub` values (format: `local_<timestamp>_<random>`)
- No AWS Cognito API calls are made
- Full functionality available without AWS setup

### Production Mode

For production, configure Cognito:

```env
COGNITO_BYPASS=false
# or omit COGNITO_BYPASS (defaults to false)

AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
AWS_COGNITO_CLIENT_ID=your-cognito-client-id
AWS_COGNITO_REGION=us-east-1
```

**Behavior in Production Mode**:

- Users with real `cognito_sub` authenticate via Cognito
- New users are created in Cognito User Pool
- Passwords are stored in Cognito (not locally)
- Falls back to local auth if Cognito is unavailable (graceful degradation)

---

## AWS Cognito Setup

### Step 1: Create Cognito User Pool

1. **Go to AWS Cognito Console**
   - Navigate to: https://console.aws.amazon.com/cognito
   - Select your region (e.g., `us-east-1`)

2. **Create User Pool**
   - Click "Create user pool"
   - Choose "Cognito user pool sign-in options"
   - Select "Email" as sign-in option
   - Click "Next"

3. **Configure Security**
   - Password policy: Set requirements (min 8 chars, uppercase, lowercase, numbers, symbols)
   - MFA: Optional (can enable later)
   - Click "Next"

4. **Configure Sign-up Experience**
   - Self-service sign-up: Enabled
   - Cognito-assisted verification: Email
   - Click "Next"

5. **Configure Message Delivery**
   - Email provider: Send email with Cognito
   - Click "Next"

6. **Integrate Your App**
   - User pool name: `icaptur-sso-user-pool` (or your preferred name)
   - App client name: `icaptur-sso-client`
   - App client type: Public client
   - Click "Next"

7. **Review and Create**
   - Review settings
   - Click "Create user pool"

8. **Note the IDs**
   - User Pool ID: `us-east-1_XXXXXXXXX` (copy this)
   - App Client ID: `xxxxxxxxxxxxxxxxxxxxx` (copy this)

### Step 2: Configure IAM Permissions

Create an IAM policy for Cognito admin operations:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cognito-idp:AdminInitiateAuth",
        "cognito-idp:AdminGetUser",
        "cognito-idp:AdminCreateUser",
        "cognito-idp:AdminSetUserPassword",
        "cognito-idp:AdminDeleteUser",
        "cognito-idp:ListUsers"
      ],
      "Resource": "arn:aws:cognito-idp:REGION:ACCOUNT:userpool/USER_POOL_ID"
    }
  ]
}
```

**Attach to IAM User/Role**:

- For development: Attach to IAM user
- For production: Attach to EC2/ECS IAM role

### Step 3: Environment Variables

Add to `.env`:

```env
AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
AWS_COGNITO_CLIENT_ID=your-app-client-id
AWS_COGNITO_REGION=us-east-1
COGNITO_BYPASS=false
```

---

## How It Works

### Authentication Flow

1. **User Login** (`POST /auth/login`)
   - `AuthService.validateUser()` is called
   - Checks if Cognito is enabled and user has `cognito_sub`
   - If yes: Attempts Cognito authentication
   - If Cognito fails or disabled: Falls back to local authentication
   - Returns user object on success

2. **Password Creation** (`POST /auth/create-password`)
   - Validates activation token
   - If Cognito enabled: Creates user in Cognito User Pool
   - Sets password in Cognito (if enabled)
   - Always stores password hash locally (for fallback)
   - Generates `cognito_sub` (real or placeholder)

3. **Password Reset** (`POST /auth/password-reset/confirm`)
   - If Cognito enabled and user has real `cognito_sub`: Updates password in Cognito
   - Always updates local password hash (for fallback)

### Local Bypass Mode

When `COGNITO_BYPASS=true`:

- All authentication uses local bcrypt passwords
- Generates placeholder `cognito_sub` values: `local_<timestamp>_<random>`
- No AWS API calls are made
- Full development functionality without AWS setup

### Production Mode

When Cognito is configured (`COGNITO_BYPASS=false` or omitted):

- Users with real `cognito_sub` authenticate via Cognito
- New users are created in Cognito User Pool
- Passwords stored in Cognito
- Falls back to local auth if Cognito unavailable

---

## Migration Strategy

### Phase 1: Development (Current)

- `COGNITO_BYPASS=true`
- All users use local authentication
- Placeholder `cognito_sub` values generated

### Phase 2: Production Rollout

- `COGNITO_BYPASS=false`
- New users created in Cognito
- Existing users can migrate gradually
- System supports both authentication methods

### Phase 3: Full Migration

- All users migrated to Cognito
- Local passwords can be removed (optional)
- System uses Cognito exclusively

---

## Code Structure

### CognitoService (`services/sso-api/src/modules/cognito/`)

**Key Methods**:

- `isEnabled()`: Check if Cognito is enabled
- `authenticate()`: Authenticate user with Cognito
- `createUser()`: Create user in Cognito (or generate placeholder)
- `setUserPassword()`: Set password in Cognito
- `isLocalBypassSub()`: Check if `cognito_sub` is a placeholder
- `generateLocalBypassSub()`: Generate placeholder `cognito_sub`

### AuthService Integration

**Modified Methods**:

- `validateUser()`: Tries Cognito first, falls back to local
- `createPassword()`: Creates user in Cognito if enabled
- `resetPassword()`: Updates password in Cognito if enabled

---

## Testing

### Development Mode Testing

```bash
# Set in .env
COGNITO_BYPASS=true

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Production Mode Testing

```bash
# Set in .env
COGNITO_BYPASS=false
AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
AWS_COGNITO_CLIENT_ID=your-client-id
AWS_COGNITO_REGION=us-east-1

# Create test user in Cognito first, then test login
```

---

## Troubleshooting

### Cognito Authentication Fails

**Symptoms**: Login fails even with correct credentials

**Solutions**:

1. Check IAM permissions for Cognito operations
2. Verify User Pool ID and Client ID are correct
3. Check AWS region matches
4. Review CloudWatch logs for Cognito errors
5. Verify user exists in Cognito User Pool

### Local Bypass Not Working

**Symptoms**: System tries to use Cognito in development

**Solutions**:

1. Verify `COGNITO_BYPASS=true` in `.env`
2. Check environment variable is loaded correctly
3. Restart application after changing `.env`

### Migration Issues

**Symptoms**: Users can't login after enabling Cognito

**Solutions**:

1. Ensure users have `cognito_sub` set
2. Create users in Cognito User Pool if missing
3. Use fallback mode temporarily
4. Check logs for specific error messages

---

## Security Considerations

1. **IAM Permissions**: Use least privilege principle
2. **Password Policy**: Enforce strong passwords in Cognito
3. **MFA**: Consider enabling MFA in production
4. **Audit Logging**: Log all Cognito operations
5. **Error Handling**: Don't expose Cognito errors to users

---

## Best Practices

1. **Development**: Always use `COGNITO_BYPASS=true`
2. **Production**: Use Cognito with proper IAM roles (not access keys)
3. **Migration**: Migrate users gradually, test thoroughly
4. **Monitoring**: Monitor Cognito API calls and errors
5. **Fallback**: Keep local password storage as fallback during migration

---

## References

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Cognito User Pool Admin APIs](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/Welcome.html)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

---

**Last Updated**: 2024-11-18

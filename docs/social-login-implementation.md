# Social Login Implementation Guide

## Overview

Social login (Microsoft, Google, Apple) follows the **exact same flow and logic** as manual login. Only the authentication source differs - everything else (validation, user handling, permissions, redirection) remains identical.

## Implementation Summary

### ✅ What's Implemented

1. **Backend API Endpoint**: `/scholarship-auth/social-login`
   - Exchanges OAuth code for user info
   - Gets/creates user in `Tbl_UserMaster` (same as manual login)
   - Validates user (same checks as manual login)
   - Returns same response format as manual login
   - Logs to `T_LoginLog` table

2. **Frontend Integration**:
   - OAuth initiation (redirects to provider)
   - OAuth callback handler
   - Same session token creation as manual login
   - Same registration check and redirection logic

3. **Database**:
   - `T_LoginLog` table for tracking all login events
   - Uses existing `Tbl_UserMaster` table (no modifications needed)

## Flow Comparison

### Manual Login Flow:
```
1. User enters email/password
2. Backend: validateUserLogin() → ValidateUser stored procedure
3. Backend: Check Student role, fetch User_Type
4. Backend: Return { userId, userName (email), roleId, userType, passwordChange }
5. Frontend: Create session token, store in localStorage
6. Frontend: Check registration status
7. Frontend: Redirect to dashboard or registration
```

### Social Login Flow (SAME):
```
1. User clicks social login button
2. Redirect to OAuth provider
3. OAuth provider redirects back with code
4. Backend: exchangeOAuthCodeForUserInfo() → Get email/name from provider
5. Backend: getOrCreateSocialLoginUser() → Get/create in Tbl_UserMaster
6. Backend: Validate user (same checks as manual login)
7. Backend: Check Student role, fetch User_Type (SAME)
8. Backend: Return { userId, userName (email), roleId, userType, passwordChange } (SAME FORMAT)
9. Frontend: Create session token, store in localStorage (SAME)
10. Frontend: Check registration status (SAME)
11. Frontend: Redirect to dashboard or registration (SAME)
```

## Environment Variables

### Frontend (.env file in `apps/web/apps/scholarship-app/`)

```env
# OAuth Client IDs (public - safe to expose in frontend)
VITE_MICROSOFT_CLIENT_ID=your-microsoft-client-id
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APPLE_CLIENT_ID=your-apple-client-id
```

### Backend (.env file in project root)

```env
# OAuth Client IDs and Secrets (private - backend only)
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret
```

## API Endpoint

### POST `/api/scholarship-auth/social-login`

**Request Body:**
```json
{
  "provider": "microsoft" | "google" | "apple",
  "code": "oauth_authorization_code",
  "redirectUri": "http://localhost:5173/oauth-callback/microsoft"
}
```

**Response (Same as manual login):**
```json
{
  "userId": 123,
  "userName": "user@example.com",  // This is the email (User_ID)
  "roleId": 1,
  "userType": "Student",
  "passwordChange": false
}
```

## User Creation Logic

When a social login user doesn't exist:

1. **Creates user in `Tbl_UserMaster`** (same pattern as `setNewPassword`)
   - `User_ID` = email from OAuth provider
   - `User_Name` = name from OAuth provider (or email prefix)
   - `Password` = NULL (social login users don't have passwords)
   - `IsActive` = 1
   - `IsDeleted` = 0
   - `Role_Id` = Student role ID (if exists)

2. **If user exists:**
   - Updates `User_Name` if empty
   - Activates account if inactive
   - Returns existing user info

## Validation Logic (Same as Manual Login)

1. ✅ Check if account is active (activate if needed)
2. ✅ Check Student role (same validation)
3. ✅ Fetch User_Type from T_ROLES (same)
4. ✅ Return same response format

## Frontend Handling (Same as Manual Login)

1. ✅ Create session token (same format)
2. ✅ Store in localStorage (same)
3. ✅ Check registration status (same)
4. ✅ Redirect to dashboard or registration (same)

## Database Tables

### T_LoginLog (Auto-created)

Tracks all login events:
- Manual logins: `Login_Type = 'Manual'`
- Social logins: `Login_Type = 'Microsoft'`, `'Google'`, or `'Apple'`
- Status: `'Success'` or `'Failed'`

### Tbl_UserMaster (No Changes)

- Social login users stored same as manual users
- `User_ID` = email (same for both)
- `Password` = NULL for social login users
- All other fields same

## Key Points

1. **Same Response Format**: Social login returns exact same format as manual login
2. **Same User Table**: Both use `Tbl_UserMaster` with same structure
3. **Same Validation**: All validation checks are identical
4. **Same Permissions**: User_Type and role handling is identical
5. **Same Redirection**: Registration check and redirect logic is identical
6. **Same Session**: Session token creation and storage is identical

## Testing

To test social login:

1. Configure OAuth apps with redirect URIs:
   - `http://localhost:5173/oauth-callback/microsoft`
   - `http://localhost:5173/oauth-callback/google`
   - `http://localhost:5173/oauth-callback/apple`

2. Add environment variables (frontend and backend)

3. Click social login button → Should redirect to provider

4. After OAuth callback → Should follow same flow as manual login

## Notes

- Apple login requires additional JWT signing (not fully implemented yet)
- OAuth tokens are not stored (exchanged immediately)
- Session tokens are same format for both manual and social login
- All login events logged to `T_LoginLog` table


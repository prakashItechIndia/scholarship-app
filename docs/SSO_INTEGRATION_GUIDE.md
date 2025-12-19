# iCaptur SSO Integration Guide

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [Frontend Integration](#frontend-integration)
5. [Backend Integration](#backend-integration)
6. [Token Management](#token-management)
7. [API Reference](#api-reference)
8. [User Subscriptions & Access](#user-subscriptions--access)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

iCaptur SSO (Single Sign-On) provides centralized authentication across all iCaptur products. Once a user logs in, they can access all subscribed products without re-authentication.

### Key Features

- ✅ **Single Login**: Login once, access all products
- ✅ **Centralized Logout**: Logout from any product logs out from all
- ✅ **Cross-Product Sessions**: Open multiple product tabs, all stay logged in
- ✅ **Token Auto-Refresh**: Tokens automatically refresh when expired
- ✅ **Product-Specific Access**: Users only see products they're subscribed to

---

## Architecture

### SSO Flow

```
┌─────────────┐
│   Product   │
│  (iNvox)    │
└──────┬──────┘
       │ 1. User not authenticated
       │    Redirect to SSO
       ▼
┌─────────────┐
│  SSO App    │
│  (Login)    │
└──────┬──────┘
       │ 2. User authenticates
       │    Generate tokens
       ▼
┌─────────────┐
│  SSO API    │
│  (Backend)  │
└──────┬──────┘
       │ 3. Return tokens
       │    Store in browser
       ▼
┌─────────────┐
│   Product   │
│  (iNvox)    │
│  Auto-login │
└─────────────┘
```

### Token Storage

Tokens are stored in:

- **localStorage/sessionStorage**: Encrypted tokens (product-specific)
- **Cookies**: Shared across subdomains (`.icaptur.ai` domain)
- **Cross-subdomain**: Cookies accessible from all subdomains

---

## Quick Start

### 1. Environment Variables

Add these to your product's `.env` file:

```env
# SSO Configuration
VITE_SSO_APP_URL=https://sso.icaptur.ai
VITE_SSO_API_URL=https://sso.icaptur.ai/api

# Your Product Configuration
VITE_PRODUCT_CODE=invox  # Your product code (invox, irepo, ipraise, etc.)
VITE_PRODUCT_URL=https://invox.icaptur.ai  # Your product URL
```

### 2. Install Dependencies

```bash
# If using the shared packages
npm install @icaptur/shared-utils
```

### 3. Basic Integration

```typescript
// In your product's main entry point
import { initializeTokenRefresh } from '@shared/services/centralizedTokenRefresh';

// Initialize token refresh system
await initializeTokenRefresh();
```

---

## Frontend Integration

### Step 1: Create Auth Service

Create `src/services/auth.service.ts`:

```typescript
import { secureTokenStorage } from '@shared/utils/secureTokenStorage';
import axios from 'axios';

const SSO_APP_URL = import.meta.env.VITE_SSO_APP_URL;
const SSO_API_URL = import.meta.env.VITE_SSO_API_URL;
const PRODUCT_CODE = import.meta.env.VITE_PRODUCT_CODE;

export const authService = {
  // Redirect to SSO login
  redirectToSSO(redirectUrl?: string) {
    const currentUrl = redirectUrl ?? window.location.href;
    const ssoUrl = `${SSO_APP_URL}/signin?redirect=${encodeURIComponent(currentUrl)}&product=${PRODUCT_CODE}`;
    window.location.href = ssoUrl;
  },

  // Handle SSO callback (extract tokens from URL)
  async handleSSOCallback(): Promise<boolean> {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const refreshTokenFromUrl = urlParams.get('refreshToken');
    const encodedUser = urlParams.get('user');

    if (tokenFromUrl) {
      let parsedUser = null;

      if (encodedUser) {
        try {
          parsedUser = JSON.parse(atob(encodedUser));
        } catch {
          parsedUser = null;
        }
      }

      // Store tokens
      await secureTokenStorage.setTokens(
        tokenFromUrl,
        refreshTokenFromUrl ?? undefined,
        parsedUser ?? undefined,
      );

      // Clean URL
      urlParams.delete('token');
      urlParams.delete('refreshToken');
      urlParams.delete('user');
      const newUrl =
        window.location.pathname +
        (urlParams.toString() ? `?${urlParams.toString()}` : '');
      window.history.replaceState({}, '', newUrl);

      return true; // Fresh SSO callback
    }

    return false;
  },

  // Get access token
  async getAccessToken(): Promise<string | null> {
    return secureTokenStorage.getAccessToken();
  },

  // Get refresh token
  async getRefreshToken(): Promise<string | null> {
    return secureTokenStorage.getRefreshToken();
  },

  // Get current user
  async getCurrentUser() {
    const token = await secureTokenStorage.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        tenantId: payload.tenantId,
        firstName: payload.firstName,
        lastName: payload.lastName,
      };
    } catch {
      return null;
    }
  },

  // Check if authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    const refreshToken = await this.getRefreshToken();

    if (refreshToken) {
      if (token && (await secureTokenStorage.hasValidToken())) {
        return true;
      }
      // Try to refresh
      const newToken = await this.refreshAccessToken();
      return newToken !== null;
    }

    if (!token) return false;
    return secureTokenStorage.hasValidToken();
  },

  // Refresh access token
  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await axios.post(`${SSO_API_URL}/auth/refresh`, {
        refreshToken,
        productCode: PRODUCT_CODE,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Get current user to preserve user data
      const user = await this.getCurrentUser();

      await secureTokenStorage.setTokens(
        accessToken,
        newRefreshToken,
        user ?? undefined,
      );

      return accessToken;
    } catch {
      return null;
    }
  },

  // Logout
  async logout(): Promise<void> {
    const refreshToken = await this.getRefreshToken();

    // Revoke refresh token on SSO API
    if (refreshToken) {
      try {
        await axios.post(`${SSO_API_URL}/auth/logout`, { refreshToken });
      } catch (error) {
        console.warn('Failed to revoke refresh token:', error);
      }
    }

    // Clear local tokens
    secureTokenStorage.clearTokens();

    // Broadcast logout to all tabs
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(
        'icaptur_logout',
        JSON.stringify({ timestamp: Date.now() }),
      );
      window.localStorage.removeItem('icaptur_logout');
    }

    // Redirect to SSO
    window.location.href = `${SSO_APP_URL}/signin?logout=true`;
  },
};
```

### Step 2: Create Auth Guard Component

Create `src/components/auth/AuthGuard.tsx`:

```typescript
import { useEffect, useState, PropsWithChildren } from 'react';
import { authService } from '../../services/auth.service';
import { LoadingScreen } from '../layout/LoadingScreen';

export const AuthGuard = ({ children }: PropsWithChildren) => {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check for tokens in URL (fresh SSO callback)
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      const isLogout = urlParams.get('logout') === 'true';

      // Handle fresh SSO callback
      if (tokenFromUrl) {
        const wasSSOCallback = await authService.handleSSOCallback();
        if (wasSSOCallback) {
          setIsChecking(false);
          return;
        }
      }

      // Check if authenticated
      const isAuth = await authService.isAuthenticated();

      if (!isAuth && !isLogout) {
        // Not authenticated - redirect to SSO
        const currentUrl = window.location.href;
        authService.redirectToSSO(currentUrl);
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, []);

  // Listen for logout events from other tabs
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'icaptur_logout' && e.newValue) {
        secureTokenStorage.clearTokens();
        window.location.href = `${SSO_APP_URL}/signin?logout=true`;
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  if (isChecking) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  return <>{children}</>;
};
```

### Step 3: Use Auth Guard in App

```typescript
// App.tsx
import { AuthGuard } from './components/auth/AuthGuard';
import { initializeTokenRefresh } from '@shared/services/centralizedTokenRefresh';

function App() {
  useEffect(() => {
    // Initialize token refresh system
    initializeTokenRefresh();
  }, []);

  return (
    <AuthGuard>
      <YourAppContent />
    </AuthGuard>
  );
}
```

### Step 4: Setup API Client with Token Interceptor

```typescript
// src/shared/api-client.ts
import axios from 'axios';
import { secureTokenStorage } from '@shared/utils/secureTokenStorage';

const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await secureTokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 errors (token expired)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = await secureTokenStorage.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${SSO_API_URL}/auth/refresh`, {
            refreshToken,
            productCode: PRODUCT_CODE,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          await secureTokenStorage.setTokens(accessToken, newRefreshToken);

          // Retry original request
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient.request(error.config);
        } catch {
          // Refresh failed - redirect to SSO
          authService.redirectToSSO();
        }
      } else {
        // No refresh token - redirect to SSO
        authService.redirectToSSO();
      }
    }
    return Promise.reject(error);
  },
);
```

---

## Backend Integration

### Step 1: Validate JWT Tokens

Your backend needs to validate JWT tokens from SSO API.

#### Option A: Using JWKS (Recommended)

```typescript
// Validate token using JWKS endpoint
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: 'https://sso.icaptur.ai/.well-known/jwks.json',
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export function validateToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: 'your-product-code', // e.g., 'invox'
        issuer: 'https://sso.icaptur.ai',
      },
      (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      },
    );
  });
}
```

#### Option B: Using Shared Secret

```typescript
import jwt from 'jsonwebtoken';

const SSO_SECRET = process.env.SSO_JWT_SECRET;

export function validateToken(token: string): any {
  return jwt.verify(token, SSO_SECRET, {
    audience: 'your-product-code',
    issuer: 'https://sso.icaptur.ai',
  });
}
```

### Step 2: Create Auth Middleware

```typescript
// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { validateToken } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    tenantId: string | null;
    productCode: string;
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const token = authHeader.substring(7);
    const decoded = await validateToken(token);

    req.user = {
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      tenantId: decoded.tenantId,
      productCode: decoded.aud, // Product code from token
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### Step 3: Use Middleware in Routes

```typescript
import { Router } from 'express';
import {
  authMiddleware,
  AuthenticatedRequest,
} from '../middleware/auth.middleware';

const router = Router();

// Protected route
router.get(
  '/api/protected',
  authMiddleware,
  (req: AuthenticatedRequest, res) => {
    res.json({
      message: 'You are authenticated!',
      user: req.user,
    });
  },
);
```

---

## Token Management

### Token Storage

Tokens are stored using `secureTokenStorage` from `@shared/utils/secureTokenStorage`:

```typescript
import { secureTokenStorage } from '@shared/utils/secureTokenStorage';

// Store tokens
await secureTokenStorage.setTokens(
  accessToken,
  refreshToken,
  user, // { id, email, role, tenantId, firstName, lastName }
  rememberMe, // true for persistent, false for session-only
);

// Get tokens
const accessToken = await secureTokenStorage.getAccessToken();
const refreshToken = await secureTokenStorage.getRefreshToken();
const user = await secureTokenStorage.getUser();

// Check if token is valid
const isValid = await secureTokenStorage.hasValidToken();

// Clear tokens
secureTokenStorage.clearTokens();
```

### Token Refresh

Tokens automatically refresh when:

- Access token expires (within 5 minutes of expiry)
- API returns 401 Unauthorized
- Token refresh is triggered manually

```typescript
import { getAccessToken } from '@shared/services/centralizedTokenRefresh';

// Get access token (automatically refreshes if needed)
const token = await getAccessToken(true); // true = force refresh
```

### Token Lifecycle

1. **Access Token**: Valid for 1 hour, automatically refreshed
2. **Refresh Token**: Valid for 30 days (or until revoked)
3. **Storage**: Encrypted and stored in localStorage/cookies
4. **Cross-subdomain**: Cookies shared across `.icaptur.ai` subdomains

---

## API Reference

### Authentication APIs

#### Base URL

```
Production: https://sso.icaptur.ai/api
Development: https://sso-dev.itechlabs.app/api
```

#### 1. Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "productCode": "invox" // optional
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "org_admin",
    "tenantId": "tenant-id"
  },
  "mfaRequired": false,
  "userId": null,
  "tempToken": null
}
```

#### 2. Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here",
  "productCode": "invox" // optional, defaults to 'accounts'
}
```

**Response:**

```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token",
  "expiresIn": 3600
}
```

#### 3. Logout

```http
POST /auth/logout
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

**Response:** `204 No Content`

**Note:** This logs out from ALL products (centralized logout).

#### 4. Get Current User

```http
GET /auth/me
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "org_admin",
  "tenantId": "tenant-id",
  "status": "active"
}
```

#### 5. Check Email

```http
POST /auth/check-email
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "exists": true,
  "message": "Email exists"
}
```

#### 6. Request Password Reset

```http
POST /auth/password-reset/request
Content-Type: application/json

{
  "email": "user@example.com",
  "returnUrl": "https://invox.icaptur.ai/reset-complete", // optional
  "productCode": "invox" // optional
}
```

**Response:**

```json
{
  "message": "If the email exists, a password reset link has been sent."
}
```

#### 7. Reset Password

```http
POST /auth/password-reset/confirm
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword123!"
}
```

**Response:**

```json
{
  "message": "Password reset successfully"
}
```

#### 8. Change Password

```http
POST /auth/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "currentPassword": "old_password",
  "newPassword": "NewSecurePassword123!"
}
```

**Response:**

```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "org_admin",
    "tenantId": "tenant-id"
  }
}
```

### OAuth2 APIs

#### 1. Authorize (OAuth2 Flow)

```http
GET /oauth/authorize?response_type=code&client_id={product_code}&redirect_uri={redirect_uri}&state={state}&code_challenge={code_challenge}&code_challenge_method=S256
```

**Query Parameters:**

- `response_type`: Must be `code`
- `client_id`: Your product code (e.g., `invox`)
- `redirect_uri`: Your callback URL (must be registered)
- `state`: Random state for CSRF protection
- `code_challenge`: PKCE code challenge (base64url-encoded SHA256 hash)
- `code_challenge_method`: Must be `S256`

**Response:** Redirects to SSO login, then back to `redirect_uri` with `code` and `state`

#### 2. Token Exchange

```http
POST /oauth/token
Content-Type: application/json

{
  "grant_type": "authorization_code",
  "code": "authorization_code",
  "redirect_uri": "https://invox.icaptur.ai/callback",
  "code_verifier": "code_verifier"
}
```

**Response:**

```json
{
  "access_token": "access_token_here",
  "refresh_token": "refresh_token_here",
  "token_type": "Bearer",
  "expires_in": 3600,
  "id_token": "id_token_here"
}
```

### Permissions APIs

#### Get User Permissions

```http
GET /permissions?productCode={product_code}
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "permissions": ["feature:read", "feature:write", "admin:manage"]
}
```

**Note:** Returns permissions for the authenticated user in the specified product.

### JWKS Endpoint

#### Get JWKS

```http
GET /.well-known/jwks.json
```

**Response:**

```json
{
  "keys": [
    {
      "kty": "oct",
      "kid": "default",
      "use": "sig",
      "alg": "HS256",
      "k": "base64url-encoded-secret"
    }
  ]
}
```

#### OpenID Configuration

```http
GET /.well-known/openid-configuration
```

**Response:**

```json
{
  "issuer": "https://sso.icaptur.ai",
  "authorization_endpoint": "https://sso.icaptur.ai/oauth/authorize",
  "token_endpoint": "https://sso.icaptur.ai/oauth/token",
  "jwks_uri": "https://sso.icaptur.ai/.well-known/jwks.json",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"]
}
```

---

## User Subscriptions & Access

### Check User Subscription

To check if a user has access to your product, validate the JWT token. The token contains:

- `aud` (audience): Product code the token was issued for
- `tenantId`: User's organization ID
- `role`: User's role

### Check Subscription via API

If you need to check subscription status via API:

```typescript
// Call Experience API to check subscription
const response = await axios.get(
  `${EXPERIENCE_API_URL}/products/subscriptions`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  },
);

// Response includes user's subscribed products
const subscriptions = response.data;
```

### Product Access Logic

1. **Token Validation**: Token must be valid and not expired
2. **Product Code**: Token `aud` field must match your product code
3. **Subscription Check**: User's tenant must have active subscription
4. **Role Check**: User must have appropriate role for the product

### Example: Check Product Access

```typescript
import { validateToken } from './utils/jwt';

export async function checkProductAccess(
  token: string,
  productCode: string,
): Promise<boolean> {
  try {
    const decoded = validateToken(token);

    // Check if token is for this product
    if (decoded.aud !== productCode) {
      return false;
    }

    // Check if user has tenant (org users have tenantId)
    if (!decoded.tenantId) {
      return false; // Individual users might not have access
    }

    // Optionally check subscription via API
    // This is usually done at the backend level

    return true;
  } catch {
    return false;
  }
}
```

---

## Best Practices

### 1. Token Security

- ✅ Always use HTTPS in production
- ✅ Store tokens encrypted (handled by `secureTokenStorage`)
- ✅ Never log tokens in console or send in URLs (except SSO callback)
- ✅ Validate tokens on backend before trusting them

### 2. Error Handling

```typescript
try {
  const token = await authService.getAccessToken();
  if (!token) {
    authService.redirectToSSO();
    return;
  }
} catch (error) {
  console.error('Auth error:', error);
  authService.redirectToSSO();
}
```

### 3. Token Refresh

- ✅ Let the centralized token refresh service handle automatic refresh
- ✅ Don't manually refresh tokens unless necessary
- ✅ Handle 401 errors by attempting token refresh

### 4. Logout Handling

- ✅ Always call the logout API to revoke refresh tokens
- ✅ Clear local storage after logout
- ✅ Listen for logout events from other tabs

### 5. Product-Specific Considerations

- ✅ Always include `productCode` in login/refresh requests
- ✅ Validate token `aud` field matches your product code
- ✅ Check user subscriptions before granting access

---

## Troubleshooting

### Issue: User not auto-logging in on new tabs

**Solution:**

- Check if cookies are set with correct domain (`.icaptur.ai`)
- Verify `secureTokenStorage` is reading from cookies
- Check browser console for CORS errors

### Issue: Tokens not refreshing

**Solution:**

- Verify `initializeTokenRefresh()` is called
- Check refresh token is valid and not revoked
- Verify SSO API URL is correct

### Issue: 401 Unauthorized errors

**Solution:**

- Check if token is expired
- Verify token refresh is working
- Check if refresh token is revoked (user logged out)

### Issue: Cross-subdomain cookies not working

**Solution:**

- Verify domain is set correctly (`.icaptur.ai` not `icaptur.ai`)
- Check browser allows third-party cookies (if needed)
- Verify SameSite cookie attribute is set correctly

### Issue: Logout not working across products

**Solution:**

- Verify `icaptur_logout` event is being broadcast
- Check all products listen for storage events
- Verify centralized logout API is being called

---

## Support

For issues or questions:

- Check Swagger docs: `https://sso.icaptur.ai/api-docs`
- Contact: support@icaptur.ai

---

## Example Integration

See existing product integrations:

- Scholarship App: `apps/web/apps/scholarship-app/src/services/auth.service.ts`

---

**Last Updated:** 2024
**Version:** 1.0.0

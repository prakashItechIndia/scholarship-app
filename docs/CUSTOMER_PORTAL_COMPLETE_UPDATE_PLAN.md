# Customer Portal Complete Application Update Plan

## SSO & User/Role Management Migration

This document outlines **ALL** changes needed across the entire Customer Portal application when migrating to SSO and centralized user/role management from the Experience/Billing platform.

---

## Table of Contents

1. [Environment Variables Update](#1-environment-variables-update)
2. [Backend Routes - Complete Update List](#2-backend-routes---complete-update-list)
3. [Backend Services - Complete Update List](#3-backend-services---complete-update-list)
4. [Database Schema Changes](#4-database-schema-changes)
5. [Middleware Updates](#5-middleware-updates)
6. [Frontend Updates](#6-frontend-updates)
7. [API Integration Layer](#7-api-integration-layer)
8. [Migration Strategy](#8-migration-strategy)

---

## 1. Environment Variables Update

### Current `.env` Variables (To Remove/Deprecate)

```env
# Authentication - REMOVE (migrate to SSO)
JWT_SECRET=...
LOCAL_AUTH_BYPASS=...
COGNITO_USER_POOL_ID=...
COGNITO_CLIENT_ID=...
COGNITO_REGION=...
AWS_ACCESS_KEY_ID=...  # If only used for Cognito
AWS_SECRET_ACCESS_KEY=...  # If only used for Cognito
AWS_REGION=...  # If only used for Cognito

# Email - KEEP (still needed for notifications)
SMTP_HOST=...
SMTP_PORT=...
SMTP_FROM=...

# Database - KEEP (still needed for job history, etc.)
DATABASE_URL=...

# S3 - KEEP (still needed for file storage)
S3_BUCKET=...
S3_REGION=...
S3_ENDPOINT=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_FORCE_PATH_STYLE=...

# App Config - KEEP
FRONTEND_URL=...
API_BASE_URL=...
PORT=...
NODE_ENV=...
CORS_ORIGIN=...
ENCRYPTION_KEY=...
API_DOCS_ENABLED=...
```

### New `.env` Variables (To Add)

```env
# SSO Configuration - NEW
SSO_API_URL=https://sso.icaptur.ai
SSO_APP_URL=https://accounts.icaptur.ai
SSO_PRODUCT_CODE=api_as_a_service
SSO_JWKS_URL=https://sso.icaptur.ai/.well-known/jwks.json
SSO_CLIENT_ID=...  # If needed for OAuth
SSO_CLIENT_SECRET=...  # If needed for OAuth

# Experience API (for user/tenant management) - NEW
EXPERIENCE_API_URL=https://experience.icaptur.ai
EXPERIENCE_API_KEY=...  # If needed for service-to-service auth
```

### Updated `config/env.ts`

**File**: `services/api/src/config/env.ts`

**Changes**:

```typescript
interface EnvConfig {
  // ... existing configs ...

  // REMOVE
  // auth: { localBypass: boolean }
  // cognito: { ... }
  // jwt: { secret: string }

  // ADD
  sso: {
    apiUrl: string;
    appUrl: string;
    productCode: string;
    jwksUrl: string;
    clientId?: string;
    clientSecret?: string;
  };

  experience: {
    apiUrl: string;
    apiKey?: string;
  };
}
```

---

## 2. Backend Routes - Complete Update List

### 2.1 Authentication Routes (`routes/auth.ts`)

**Status**: ⚠️ **MAJOR CHANGES**

**Endpoints to REMOVE**:

- ❌ `POST /auth/login` → Redirect to SSO
- ❌ `POST /auth/logout` → Use SSO logout
- ❌ `POST /auth/refresh` → Use SSO refresh
- ❌ `POST /auth/forgot-password` → Use SSO endpoint
- ❌ `POST /auth/reset-password` → Use SSO endpoint
- ❌ `PUT /auth/change-password` → Use SSO endpoint
- ❌ `POST /auth/check-email` → Use SSO endpoint

**Endpoints to ADD**:

- ✅ `POST /auth/sso/callback` → Exchange SSO code for token
- ✅ `GET /auth/sso/login` → Redirect to SSO login
- ✅ `GET /auth/sso/logout` → Redirect to SSO logout

**Endpoints to UPDATE**:

- ✅ `GET /auth/me` → Validate SSO token, fetch from SSO API

**Implementation**:

```typescript
// NEW: SSO Callback
router.post("/sso/callback", async (req, res, next) => {
  const { code } = req.body;
  // Exchange code with SSO API
  // Store tokens
  // Return user info
});

// NEW: SSO Login Redirect
router.get("/sso/login", (req, res) => {
  const redirectUri = `${env.app.frontendUrl}/auth/callback`;
  const ssoUrl = `${env.sso.appUrl}/auth/login?product=${env.sso.productCode}&redirect_uri=${redirectUri}`;
  res.redirect(ssoUrl);
});

// UPDATED: Get Current User
router.get("/me", authMiddleware, async (req, res, next) => {
  // User already validated by SSO token in middleware
  // Optionally fetch fresh data from SSO API
  res.json({ success: true, data: req.user });
});
```

---

### 2.2 User Management Routes (`routes/users.ts`)

**Status**: ⚠️ **MAJOR CHANGES** - Replace with SSO/Experience API calls

**Current Implementation**: Uses local `userManagementService` and local database

**New Implementation**: Proxy to Experience API or SSO API

**Endpoints to UPDATE** (keep same, change implementation):

- ✅ `POST /users` → Create user via Experience API
- ✅ `GET /users` → List users via Experience API
- ✅ `GET /users/:userId` → Get user via Experience API
- ✅ `PUT /users/:userId` → Update user via Experience API
- ✅ `PUT /users/:userId/services` → Update permissions via Experience API
- ✅ `PUT /users/me` → Update own profile via Experience API
- ✅ `POST /users/me/profile-picture` → Upload profile picture (keep local S3, update user record via API)
- ✅ `DELETE /users/me/profile-picture` → Delete profile picture
- ✅ `POST /users/:userId/profile-picture` → Upload profile picture
- ✅ `DELETE /users/:userId/profile-picture` → Delete profile picture

**Implementation Pattern**:

```typescript
router.post("/", authMiddleware, requireOrgAdmin, async (req, res, next) => {
  try {
    // Call Experience API to create user
    const response = await fetch(`${env.experience.apiUrl}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${req.user.token}`, // SSO token
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});
```

---

### 2.3 Admin User Routes (`routes/admin/users.ts`)

**Status**: ⚠️ **MAJOR CHANGES** - Same as above, proxy to Experience API

**Endpoints to UPDATE**:

- ✅ `POST /admin/users` → Create user (product admin)
- ✅ `GET /admin/users` → List users (product admin)
- ✅ `GET /admin/users/:userId` → Get user (product admin)
- ✅ `PUT /admin/users/:userId` → Update user (product admin)
- ✅ `PUT /admin/users/:userId/services` → Update permissions
- ✅ `POST /admin/users/:userId/profile-picture` → Upload profile picture
- ✅ `DELETE /admin/users/:userId/profile-picture` → Delete profile picture

---

### 2.4 Tenant Routes (`routes/tenants.ts`)

**Status**: ⚠️ **UPDATE** - Fetch from Experience API

**Endpoints to UPDATE**:

- ✅ `GET /tenants/me` → Get tenant info from Experience API

**Implementation**:

```typescript
router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const response = await fetch(
      `${env.experience.apiUrl}/tenants/${req.user.tenantId}`,
      {
        headers: {
          Authorization: `Bearer ${req.user.token}`,
        },
      }
    );

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});
```

---

### 2.5 Admin Tenant Routes (`routes/admin/tenants.ts`)

**Status**: ⚠️ **UPDATE** - Proxy to Experience API

**Endpoints to UPDATE**:

- All tenant management endpoints → Proxy to Experience API

---

### 2.6 Other Routes (Minimal Changes)

**Routes that need MINIMAL updates** (only auth middleware change):

- ✅ `routes/cad-table.ts` → Update auth middleware only
- ✅ `routes/cad-checklist.ts` → Update auth middleware only
- ✅ `routes/invoices.ts` → Update auth middleware only
- ✅ `routes/logs.ts` → Update auth middleware only
- ✅ `routes/credits.ts` → Update auth middleware only
- ✅ `routes/dashboard.ts` → Update auth middleware only
- ✅ `routes/activation.ts` → May need to redirect to SSO activation

---

## 3. Backend Services - Complete Update List

### 3.1 Auth Service (`services/auth.service.ts`)

**Status**: ⚠️ **MAJOR REFACTOR** - Replace with SSO integration

**Methods to REMOVE**:

- ❌ `login()` → Use SSO
- ❌ `logout()` → Use SSO
- ❌ `refreshToken()` → Use SSO
- ❌ `requestPasswordReset()` → Use SSO
- ❌ `resetPassword()` → Use SSO
- ❌ `changePassword()` → Use SSO
- ❌ `validateToken()` → Replace with SSO token validation
- ❌ `checkLockout()` → Handled by SSO

**Methods to ADD**:

- ✅ `validateSSOToken(token: string): Promise<TokenPayload>`
- ✅ `fetchJWKS(): Promise<JWKS>`
- ✅ `exchangeCodeForToken(code: string): Promise<Tokens>`
- ✅ `refreshSSOToken(refreshToken: string): Promise<Tokens>`

**New File**: `services/sso.service.ts`

```typescript
export class SSOService {
  async validateToken(token: string): Promise<TokenPayload> {
    // Fetch JWKS
    // Verify signature
    // Validate audience (aud = 'api_as_a_service')
    // Return payload
  }

  async exchangeCodeForToken(code: string): Promise<Tokens> {
    // Call SSO API /auth/callback
    // Return tokens
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    // Call SSO API /auth/refresh
    // Return new tokens
  }
}
```

---

### 3.2 User Management Service (`services/user-management.service.ts`)

**Status**: ⚠️ **MAJOR REFACTOR** - Replace with Experience API client

**Current**: Direct database operations

**New**: HTTP client to Experience API

**Methods to REFACTOR**:

- ✅ `createUser()` → HTTP POST to Experience API
- ✅ `getUserList()` → HTTP GET to Experience API
- ✅ `getUserById()` → HTTP GET to Experience API
- ✅ `updateUser()` → HTTP PUT to Experience API
- ✅ `updateUserServices()` → HTTP PUT to Experience API
- ✅ `deleteUser()` → HTTP DELETE to Experience API
- ✅ `uploadProfilePicture()` → Keep S3 upload, update user via API
- ✅ `deleteProfilePicture()` → Keep S3 delete, update user via API

**New File**: `services/experience-api-client.service.ts`

```typescript
export class ExperienceAPIClient {
  private baseUrl: string;
  private apiKey?: string;

  async createUser(token: string, userData: CreateUserInput) {
    // POST to Experience API
  }

  async getUserList(token: string, query: UserListQuery) {
    // GET from Experience API
  }

  async getUserById(token: string, userId: string) {
    // GET from Experience API
  }

  async updateUser(token: string, userId: string, userData: UpdateUserInput) {
    // PUT to Experience API
  }

  async deleteUser(token: string, userId: string) {
    // DELETE from Experience API
  }

  async getTenant(token: string, tenantId: string) {
    // GET from Experience API
  }

  async updateTenant(
    token: string,
    tenantId: string,
    tenantData: UpdateTenantInput
  ) {
    // PUT to Experience API
  }
}
```

---

### 3.3 Tenant Service (`services/tenants.service.ts`)

**Status**: ⚠️ **UPDATE** - Use Experience API client

**Methods to UPDATE**:

- ✅ `getTenantById()` → Use Experience API client
- ✅ `updateTenant()` → Use Experience API client

---

### 3.4 Other Services (Minimal Changes)

**Services that need MINIMAL updates**:

- ✅ `services/dashboard.service.ts` → Update user queries (if any)
- ✅ `services/job-history.service.ts` → May need to validate user from SSO
- ✅ `services/email.service.ts` → Keep as-is (still needed)
- ✅ `services/s3.service.ts` → Keep as-is (still needed)
- ✅ `services/invoices.service.ts` → Keep as-is (only auth middleware change)
- ✅ `services/icaptur-*.service.ts` → Keep as-is (only auth middleware change)

---

## 4. Database Schema Changes

### 4.1 Tables to DEPRECATE (Keep for Migration Period)

**Tables that will NO LONGER be managed by Customer Portal**:

- ⚠️ `user_account` → Managed by SSO/Experience
- ⚠️ `user_screen_grant` → Managed by SSO/Experience (permissions)
- ⚠️ `password_reset_token` → Managed by SSO
- ⚠️ `tenant` → Managed by Experience (but may need read access)

**Migration Strategy**:

1. Keep tables during migration period
2. Mark as read-only for Customer Portal
3. Remove write operations
4. Eventually remove tables (or keep for historical data)

### 4.2 Tables to KEEP

**Tables that Customer Portal still manages**:

- ✅ `job_history` → Keep (Customer Portal specific)
- ✅ `audit_event` → Keep (may need to sync with SSO audit)
- ✅ Other product-specific tables

### 4.3 Schema Updates

**File**: `services/api/src/db/schema.ts`

**Changes**:

```typescript
// Mark user_account as deprecated
// Add comments indicating these are managed by SSO
// Remove insert/update operations
// Keep select for migration period only
```

---

## 5. Middleware Updates

### 5.1 Auth Middleware (`middleware/auth.ts`)

**Status**: ⚠️ **MAJOR REFACTOR**

**Current**: Validates local JWT, queries local database

**New**: Validates SSO token, extracts user from token

**Implementation**:

```typescript
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Extract token
    const token = extractToken(req);
    if (!token) {
      throw new AppError("NO_TOKEN", "Authentication required", 401);
    }

    // 2. Validate SSO token
    const payload = await ssoService.validateToken(token);

    // 3. Check audience
    if (payload.aud !== env.sso.productCode) {
      throw new AppError("INVALID_TOKEN", "Token not for this product", 401);
    }

    // 4. Attach user to request (from token, no DB query needed)
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      // ... other fields from token
    };

    next();
  } catch (error) {
    next(error);
  }
}
```

---

### 5.2 Role Check Middleware

**Status**: ⚠️ **UPDATE** - Use SSO roles

**Files**:

- `routes/users.ts` → `requireOrgAdmin()` → Check SSO role
- `routes/admin/users.ts` → `requireProductAdmin()` → Check SSO role

**Changes**: Minimal - roles come from SSO token, just verify

---

## 6. Frontend Updates

### 6.1 Authentication Flow

**Files to UPDATE**:

- `apps/web/apps/icaptur-customer-portal/src/hooks/rq/mutations/auth/useLogin.tsx`
- `apps/web/apps/icaptur-customer-portal/src/state/AppState.ts`
- `apps/web/apps/icaptur-customer-portal/src/pages/Login.tsx` (if exists)

**Changes**:

- Replace login form with SSO redirect
- Add SSO callback handler
- Update token storage
- Update logout flow

---

### 6.2 User Management UI

**Files to UPDATE**:

- `apps/web/apps/icaptur-customer-portal/src/pages/ProductAdmin/Users/addUser.tsx`
- `apps/web/apps/icaptur-customer-portal/src/pages/OrganisationAdmin/Users/addUser.tsx`
- User list pages
- User edit pages

**Changes**:

- Update API calls to use new endpoints (which proxy to Experience API)
- Ensure error handling works
- Update form validation if needed

---

### 6.3 Password Management UI

**Files to UPDATE**:

- Forgot password page
- Reset password page
- Change password page (Settings)

**Changes**:

- Update API calls to SSO endpoints
- Update redirects to SSO pages where needed

---

### 6.4 API Client Updates

**Files to UPDATE**:

- OpenAPI generated client (if used)
- Manual API client files

**Changes**:

- Update base URLs
- Update authentication headers
- Update endpoint paths

---

## 7. API Integration Layer

### 7.1 Create SSO Service Client

**New File**: `services/api/src/services/sso.service.ts`

**Purpose**: Handle all SSO token operations

**Methods**:

- Token validation
- JWKS fetching
- Code exchange
- Token refresh

---

### 7.2 Create Experience API Client

**New File**: `services/api/src/services/experience-api-client.service.ts`

**Purpose**: HTTP client for Experience API

**Methods**:

- User CRUD operations
- Tenant operations
- Permission operations

---

### 7.3 Error Handling

**Update**: `middleware/error-handler.ts`

**Changes**:

- Handle SSO API errors
- Handle Experience API errors
- Map errors appropriately

---

## 8. Migration Strategy

### Phase 1: Preparation (Week 1)

1. ✅ Update environment variables
2. ✅ Create SSO service client
3. ✅ Create Experience API client
4. ✅ Update config files
5. ✅ Test SSO token validation

### Phase 2: Auth Migration (Week 2)

1. ✅ Update auth middleware
2. ✅ Replace auth routes
3. ✅ Update frontend auth flow
4. ✅ Test login/logout flows

### Phase 3: User Management Migration (Week 3)

1. ✅ Update user management service
2. ✅ Update user routes
3. ✅ Update admin user routes
4. ✅ Update frontend user management
5. ✅ Test user CRUD operations

### Phase 4: Tenant Migration (Week 3)

1. ✅ Update tenant service
2. ✅ Update tenant routes
3. ✅ Update admin tenant routes
4. ✅ Test tenant operations

### Phase 5: Testing & Cleanup (Week 4)

1. ✅ End-to-end testing
2. ✅ Remove deprecated code
3. ✅ Update documentation
4. ✅ Performance testing
5. ✅ Security audit

---

## 9. Files Changed Summary

### Backend Files (Total: ~30 files)

**Config**:

- `services/api/src/config/env.ts` ⚠️ MAJOR

**Services** (New/Update):

- `services/api/src/services/sso.service.ts` ✅ NEW
- `services/api/src/services/experience-api-client.service.ts` ✅ NEW
- `services/api/src/services/auth.service.ts` ⚠️ MAJOR REFACTOR
- `services/api/src/services/user-management.service.ts` ⚠️ MAJOR REFACTOR
- `services/api/src/services/tenants.service.ts` ⚠️ UPDATE

**Routes** (Update):

- `services/api/src/routes/auth.ts` ⚠️ MAJOR
- `services/api/src/routes/users.ts` ⚠️ MAJOR
- `services/api/src/routes/admin/users.ts` ⚠️ MAJOR
- `services/api/src/routes/tenants.ts` ⚠️ UPDATE
- `services/api/src/routes/admin/tenants.ts` ⚠️ UPDATE
- `services/api/src/routes/cad-table.ts` ✅ MINOR
- `services/api/src/routes/cad-checklist.ts` ✅ MINOR
- `services/api/src/routes/invoices.ts` ✅ MINOR
- `services/api/src/routes/logs.ts` ✅ MINOR
- `services/api/src/routes/credits.ts` ✅ MINOR
- `services/api/src/routes/dashboard.ts` ✅ MINOR
- `services/api/src/routes/activation.ts` ⚠️ UPDATE

**Middleware**:

- `services/api/src/middleware/auth.ts` ⚠️ MAJOR REFACTOR

**Database**:

- `services/api/src/db/schema.ts` ⚠️ UPDATE (comments, deprecation)

### Frontend Files (Total: ~15 files)

**Auth**:

- `apps/web/apps/icaptur-customer-portal/src/hooks/rq/mutations/auth/useLogin.tsx` ⚠️ UPDATE
- `apps/web/apps/icaptur-customer-portal/src/state/AppState.ts` ⚠️ UPDATE
- `apps/web/apps/icaptur-customer-portal/src/pages/AuthCallback.tsx` ✅ NEW

**User Management**:

- `apps/web/apps/icaptur-customer-portal/src/pages/ProductAdmin/Users/addUser.tsx` ⚠️ UPDATE
- `apps/web/apps/icaptur-customer-portal/src/pages/OrganisationAdmin/Users/addUser.tsx` ⚠️ UPDATE
- User list/edit pages ⚠️ UPDATE

**Password Management**:

- Forgot password page ⚠️ UPDATE
- Reset password page ⚠️ UPDATE
- Change password page ⚠️ UPDATE

**API Client**:

- OpenAPI client files ⚠️ UPDATE

---

## 10. Testing Checklist

### Authentication

- [ ] SSO login redirect works
- [ ] SSO callback handles code exchange
- [ ] Token validation works
- [ ] Token refresh works
- [ ] Logout clears SSO session
- [ ] Protected routes require valid token

### User Management

- [ ] Create user via Experience API
- [ ] List users from Experience API
- [ ] Get user details from Experience API
- [ ] Update user via Experience API
- [ ] Delete user via Experience API
- [ ] Update user permissions
- [ ] Upload profile picture (S3 + API update)
- [ ] Delete profile picture

### Tenant Management

- [ ] Get tenant info from Experience API
- [ ] Update tenant via Experience API

### Error Handling

- [ ] SSO API errors handled gracefully
- [ ] Experience API errors handled gracefully
- [ ] Network errors handled
- [ ] Invalid tokens rejected
- [ ] Portal disabled error shown correctly

### Integration

- [ ] All routes work with SSO auth
- [ ] User data consistent across app
- [ ] Permissions work correctly
- [ ] Role checks work correctly

---

## 11. Rollback Plan

### Immediate Rollback

1. Set `portal_enable = false` in SSO database
2. Revert Customer Portal deployments
3. Re-enable local auth (if kept)

### Gradual Rollback

1. Feature flag to switch between SSO and local auth
2. Monitor error rates
3. Rollback specific components if needed

---

## 12. Post-Migration Tasks

### Cleanup

- [ ] Remove deprecated auth code
- [ ] Remove local user management code
- [ ] Remove unused environment variables
- [ ] Archive migration scripts
- [ ] Update documentation

### Monitoring

- [ ] Monitor SSO token validation success rate
- [ ] Monitor Experience API response times
- [ ] Monitor error rates
- [ ] Monitor user feedback

### Optimization

- [ ] Cache user data appropriately
- [ ] Optimize API calls
- [ ] Review and optimize token validation
- [ ] Performance tuning

---

## Conclusion

This is a **comprehensive refactoring** affecting:

- **~30 backend files**
- **~15 frontend files**
- **Environment configuration**
- **Database schema** (deprecation)
- **API integration layer**

**Estimated Timeline**: 4-5 weeks

**Key Success Factors**:

1. Thorough testing at each phase
2. Clear communication
3. Proper error handling
4. Gradual rollout
5. Comprehensive monitoring

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Status**: Ready for Review

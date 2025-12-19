# Customer Portal - Files to Update Quick Reference

## Summary
- **Backend Files**: ~30 files
- **Frontend Files**: ~15 files
- **Config Files**: ~5 files
- **Total**: ~50 files

---

## 🔴 CRITICAL - Major Refactoring Required

### Backend Services (5 files)

#### 1. `services/api/src/services/auth.service.ts`
**Status**: 🔴 **MAJOR REFACTOR**
- **Remove**: All local auth methods (login, logout, refresh, password reset, etc.)
- **Add**: SSO token validation, JWKS fetching, code exchange
- **Lines**: ~1000 lines → ~300 lines

#### 2. `services/api/src/services/user-management.service.ts`
**Status**: 🔴 **MAJOR REFACTOR**
- **Remove**: All database operations (direct queries to user_account, user_screen_grant)
- **Replace**: HTTP client calls to Experience API
- **Keep**: Profile picture upload/delete (S3 operations)
- **Lines**: ~600 lines → ~200 lines

#### 3. `services/api/src/services/tenants.service.ts`
**Status**: 🟡 **UPDATE**
- **Replace**: Database queries with Experience API calls
- **Lines**: ~100 lines → ~50 lines

#### 4. `services/api/src/services/sso.service.ts`
**Status**: ✅ **NEW FILE**
- **Create**: SSO integration service
- **Methods**: validateToken, fetchJWKS, exchangeCodeForToken, refreshToken
- **Lines**: ~200 lines

#### 5. `services/api/src/services/experience-api-client.service.ts`
**Status**: ✅ **NEW FILE**
- **Create**: Experience API HTTP client
- **Methods**: User CRUD, Tenant CRUD, Permission operations
- **Lines**: ~300 lines

---

### Backend Routes (12 files)

#### 6. `services/api/src/routes/auth.ts`
**Status**: 🔴 **MAJOR REFACTOR**
- **Remove**: POST /login, POST /logout, POST /refresh, POST /forgot-password, POST /reset-password, PUT /change-password
- **Add**: POST /sso/callback, GET /sso/login, GET /sso/logout
- **Update**: GET /me (use SSO token)
- **Lines**: ~460 lines → ~150 lines

#### 7. `services/api/src/routes/users.ts`
**Status**: 🔴 **MAJOR REFACTOR**
- **Update**: All endpoints to proxy to Experience API
- **Keep**: Profile picture upload/delete (S3 + API update)
- **Lines**: ~420 lines → ~200 lines

#### 8. `services/api/src/routes/admin/users.ts`
**Status**: 🔴 **MAJOR REFACTOR**
- **Update**: All endpoints to proxy to Experience API
- **Lines**: ~300 lines → ~150 lines

#### 9. `services/api/src/routes/tenants.ts`
**Status**: 🟡 **UPDATE**
- **Update**: GET /me to use Experience API
- **Lines**: ~30 lines → ~20 lines

#### 10. `services/api/src/routes/admin/tenants.ts`
**Status**: 🟡 **UPDATE**
- **Update**: All endpoints to proxy to Experience API
- **Lines**: ~200 lines → ~100 lines

#### 11-16. Other Routes (MINOR updates - auth middleware only)
- `services/api/src/routes/cad-table.ts` ✅
- `services/api/src/routes/cad-checklist.ts` ✅
- `services/api/src/routes/invoices.ts` ✅
- `services/api/src/routes/logs.ts` ✅
- `services/api/src/routes/credits.ts` ✅
- `services/api/src/routes/dashboard.ts` ✅
- `services/api/src/routes/activation.ts` 🟡 (may need SSO redirect)

---

### Backend Middleware (1 file)

#### 17. `services/api/src/middleware/auth.ts`
**Status**: 🔴 **MAJOR REFACTOR**
- **Remove**: Local JWT validation, database user lookup
- **Add**: SSO token validation, extract user from token
- **Lines**: ~160 lines → ~80 lines

---

### Backend Config (2 files)

#### 18. `services/api/src/config/env.ts`
**Status**: 🔴 **MAJOR UPDATE**
- **Remove**: JWT_SECRET, COGNITO config, LOCAL_AUTH_BYPASS
- **Add**: SSO config, Experience API config
- **Lines**: ~160 lines → ~120 lines

#### 19. `services/api/src/config/cognito.ts`
**Status**: ❌ **DELETE or DEPRECATE**
- **Action**: Remove file or mark as deprecated

---

### Backend Database (1 file)

#### 20. `services/api/src/db/schema.ts`
**Status**: 🟡 **UPDATE**
- **Action**: Add deprecation comments to user_account, user_screen_grant, password_reset_token
- **Keep**: job_history, audit_event, other product tables
- **Lines**: ~200 lines → ~200 lines (just comments)

---

## 🟡 FRONTEND - Major Updates Required

### Frontend Auth (3 files)

#### 21. `apps/web/apps/icaptur-customer-portal/src/hooks/rq/mutations/auth/useLogin.tsx`
**Status**: 🔴 **MAJOR UPDATE**
- **Remove**: Direct API login call
- **Add**: SSO redirect logic
- **Lines**: ~40 lines → ~30 lines

#### 22. `apps/web/apps/icaptur-customer-portal/src/state/AppState.ts`
**Status**: 🔴 **MAJOR UPDATE**
- **Update**: Token storage (SSO tokens)
- **Update**: Login/logout methods
- **Update**: User state management
- **Lines**: ~300 lines → ~250 lines

#### 23. `apps/web/apps/icaptur-customer-portal/src/pages/AuthCallback.tsx`
**Status**: ✅ **NEW FILE**
- **Create**: SSO callback handler page
- **Purpose**: Handle SSO redirect, exchange code, store tokens
- **Lines**: ~100 lines

---

### Frontend User Management (5+ files)

#### 24. `apps/web/apps/icaptur-customer-portal/src/pages/ProductAdmin/Users/addUser.tsx`
**Status**: 🟡 **UPDATE**
- **Update**: API calls (endpoints stay same, backend proxies to Experience API)
- **Lines**: ~1100 lines → ~1100 lines (minimal changes)

#### 25. `apps/web/apps/icaptur-customer-portal/src/pages/OrganisationAdmin/Users/addUser.tsx`
**Status**: 🟡 **UPDATE**
- **Update**: API calls
- **Lines**: ~1200 lines → ~1200 lines (minimal changes)

#### 26-28. User List/Edit Pages
**Status**: 🟡 **UPDATE**
- **Update**: API calls
- **Files**: Various user management pages

---

### Frontend Password Management (3 files)

#### 29. Forgot Password Page
**Status**: 🟡 **UPDATE**
- **Update**: API endpoint to SSO
- **File**: `apps/web/apps/icaptur-customer-portal/src/pages/ForgotPassword.tsx` (or similar)

#### 30. Reset Password Page
**Status**: 🟡 **UPDATE**
- **Update**: API endpoint to SSO
- **File**: `apps/web/apps/icaptur-customer-portal/src/pages/ResetPassword.tsx` (or similar)

#### 31. Change Password Page (Settings)
**Status**: 🟡 **UPDATE**
- **Update**: API endpoint to SSO
- **File**: Settings component/page

---

### Frontend API Client (2+ files)

#### 32-33. OpenAPI Generated Client
**Status**: 🟡 **UPDATE**
- **Action**: Regenerate OpenAPI client with new endpoints
- **Files**: Generated API client files

---

## 🟢 ENVIRONMENT & CONFIG

### Environment Files (2 files)

#### 34. `.env` (Customer Portal Backend)
**Status**: 🔴 **MAJOR UPDATE**
- **Remove**: JWT_SECRET, COGNITO_*, LOCAL_AUTH_BYPASS, AWS_* (if only for Cognito)
- **Add**: SSO_*, EXPERIENCE_API_*
- **Keep**: DATABASE_URL, S3_*, SMTP_*, FRONTEND_URL, etc.

#### 35. `.env` (Customer Portal Frontend)
**Status**: 🟡 **UPDATE**
- **Add**: SSO_APP_URL, SSO_API_URL, SSO_PRODUCT_CODE

---

## 📋 Change Summary by Type

### Files to DELETE
- ❌ `services/api/src/config/cognito.ts` (or deprecate)

### Files to CREATE
- ✅ `services/api/src/services/sso.service.ts`
- ✅ `services/api/src/services/experience-api-client.service.ts`
- ✅ `apps/web/apps/icaptur-customer-portal/src/pages/AuthCallback.tsx`

### Files with MAJOR Refactoring (🔴)
1. `services/api/src/services/auth.service.ts`
2. `services/api/src/services/user-management.service.ts`
3. `services/api/src/routes/auth.ts`
4. `services/api/src/routes/users.ts`
5. `services/api/src/routes/admin/users.ts`
6. `services/api/src/middleware/auth.ts`
7. `services/api/src/config/env.ts`
8. `apps/web/apps/icaptur-customer-portal/src/hooks/rq/mutations/auth/useLogin.tsx`
9. `apps/web/apps/icaptur-customer-portal/src/state/AppState.ts`
10. `.env` (backend)

### Files with MINOR Updates (🟡)
- All other route files (auth middleware change only)
- Frontend user management pages (API call updates)
- Frontend password pages (API call updates)
- Tenant service and routes
- Database schema (comments only)

---

## 🎯 Priority Order

### Phase 1: Foundation (Week 1)
1. ✅ Create SSO service
2. ✅ Create Experience API client
3. ✅ Update config/env.ts
4. ✅ Update auth middleware
5. ✅ Update .env files

### Phase 2: Authentication (Week 2)
6. ✅ Refactor auth.service.ts
7. ✅ Update auth routes
8. ✅ Update frontend auth flow
9. ✅ Create AuthCallback page

### Phase 3: User Management (Week 3)
10. ✅ Refactor user-management.service.ts
11. ✅ Update user routes
12. ✅ Update admin user routes
13. ✅ Update frontend user management

### Phase 4: Tenant & Cleanup (Week 4)
14. ✅ Update tenant service/routes
15. ✅ Update other routes (minor)
16. ✅ Update frontend password pages
17. ✅ Testing & cleanup

---

## 📝 Notes

- **Backward Compatibility**: Consider keeping old endpoints during migration period
- **Feature Flags**: Use feature flags to switch between old/new systems
- **Testing**: Test each phase thoroughly before moving to next
- **Documentation**: Update API docs, README, and inline comments
- **Monitoring**: Add logging for all SSO/Experience API calls

---

**Total Estimated Effort**: 4-5 weeks  
**Files Changed**: ~50 files  
**Lines Changed**: ~5000+ lines  
**New Code**: ~1000 lines  
**Removed Code**: ~2000 lines


# Customer Portal SSO Migration Plan

## Executive Summary

This document outlines the comprehensive plan to migrate the Customer Portal from its current JWT-based authentication system to the centralized SSO (Single Sign-On) system. The migration includes:

1. **Database Schema Updates**: Add `portal_enable` flag to products table
2. **Product Registration**: Add "API AS A Service" product in SSO system
3. **Authentication Migration**: Replace all auth endpoints with SSO integration
4. **Frontend Migration**: Update UI to use SSO flow
5. **User & Role Management**: Migrate to SSO-based user management
6. **Password Management**: Migrate forgot/create/change password to SSO

---

## 1. Database Schema Changes

### 1.1 Add `portal_enable` Column to Tenant Product Subscriptions Table

**Location**: `icaptur-billing-sso-xp/packages/database-schema/src/tenant-product-subscriptions.ts`

**Change**:

```typescript
export const tenantProductSubscriptions = pgTable(
  "tenant_product_subscriptions",
  {
    // ... existing fields
    portalEnable: text("portal_enable").notNull().default("false"), // 'true' or 'false'
    // ... rest of fields
  }
);
```

**Migration Script**: Create new migration file

- File: `icaptur-billing-sso-xp/database/drizzle/XXXX_add_portal_enable_to_subscriptions.sql`
- Add column with default 'false'
- Existing subscriptions will have `portal_enable = 'false'` by default

**Rationale**: This flag is set at the **tenant/organization level** when an `org_admin` selects "API AS A Service" product during onboarding. It controls whether that specific organization can access Customer Portal via SSO. This is NOT a product-level setting, but rather a per-organization subscription setting.

---

## 2. Product Registration in SSO System

### 2.1 Create "API AS A Service" Product

**Location**: Database seed or admin interface

**Product Details**:

- **Code**: `api_as_a_service`
- **Name**: `API AS A Service`
- **Description**: `iCaptur API services for third-party integration. Includes Customer Portal for clients without their own products.`
- **is_active**: `true`

**Note**: `portal_enable` is NOT set at the product level. It's set per organization subscription during onboarding.

---

## 3. SSO API Enhancements

### 3.1 Add Portal Enable Check in Auth Flow

**Location**: `icaptur-billing-sso-xp/services/sso-api/src/modules/auth/auth.service.ts`

**Changes Needed**:

1. **Login Endpoint Enhancement**:

   - Before issuing token, check if the tenant's subscription for "API AS A Service" has `portal_enable = 'true'`
   - If product code is `api_as_a_service` and the tenant's subscription has `portal_enable = 'false'`, reject with clear error

2. **Token Issuance Check**:
   - In `issueToken()` method, validate portal enable flag from tenant subscription
   - Add method: `checkTenantPortalEnabled(tenantId: string, productCode: string): Promise<boolean>`

**New Method**:

```typescript
async checkTenantPortalEnabled(tenantId: string, productCode: string): Promise<boolean> {
  // Get product by code
  const [product] = await this.db.db
    .select()
    .from(products)
    .where(eq(products.code, productCode))
    .limit(1);

  if (!product) return false;

  // Get tenant's subscription for this product
  const [subscription] = await this.db.db
    .select()
    .from(tenantProductSubscriptions)
    .where(
      and(
        eq(tenantProductSubscriptions.tenantId, tenantId),
        eq(tenantProductSubscriptions.productId, product.id),
        eq(tenantProductSubscriptions.status, 'active') // Only check active subscriptions
      )
    )
    .limit(1);

  if (!subscription) return false;
  return subscription.portalEnable === 'true';
}
```

### 3.2 Update Auth Controller

**Location**: `icaptur-billing-sso-xp/services/sso-api/src/modules/auth/auth.controller.ts`

**Changes**:

- Add portal enable check in login endpoint
- Add portal enable check in token refresh endpoint
- Return appropriate error messages when portal is disabled

---

## 4. Experience API - Onboarding Services Page (Step 5)

### 4.1 Add Portal Enable Checkbox to Onboarding Step 5

**Location**: `icaptur-billing-sso-xp/apps/web/apps/experience-app/src/pages/ProductAdmin/Organisation-Onboarding/steps/Step5.tsx`

**Changes**:

1. When "API AS A Service" product is selected, show a checkbox to enable Customer Portal
2. Store the checkbox state in the onboarding form/store
3. Only show checkbox for product with code `api_as_a_service`
4. Save `portal_enable` value when creating the subscription

**UI Implementation**:

```tsx
// In Step5.tsx, when rendering product cards
{
  service.code === "api_as_a_service" && isSelected && (
    <div className="mt-2 flex items-center space-x-2">
      <Checkbox
        id="portal-enable"
        checked={portalEnable}
        onCheckedChange={(checked) => {
          // Update onboarding store with portal_enable value
          onboardingStore.updateFormData({
            portalEnable: checked === true,
          });
        }}
      />
      <label
        htmlFor="portal-enable"
        className="text-sm text-gray-700 cursor-pointer"
      >
        Enable Customer Portal
      </label>
      <p className="text-xs text-gray-500">
        Allow users in this organization to access Customer Portal via SSO
      </p>
    </div>
  );
}
```

### 4.2 Update Onboarding Schema

**Location**: `icaptur-billing-sso-xp/apps/web/apps/experience-app/src/lib/zod.schemas.ts`

**Changes**:

- Add `portalEnable?: boolean` to `CreateTenantOnboardingSchema` (optional field)

### 4.3 Update Onboarding API

**Location**: `icaptur-billing-sso-xp/services/experience-api/src/modules/organizations/`

**Changes**:

- When creating subscriptions, check if `portalEnable` is provided
- Set `portal_enable` on the `tenant_product_subscriptions` record for "API AS A Service" product
- Default to `false` if not provided

**Note**: This is NOT added to the Product creation/management page. It's only available during organization onboarding when selecting products.

---

## 5. Customer Portal Backend Migration

### 5.1 Remove Local Auth Endpoints

**Location**: `icaptur-api-customer-portal-v1/services/api/src/routes/auth.ts`

**Endpoints to Remove/Replace**:

- ❌ `POST /auth/login` → Replace with SSO redirect
- ❌ `POST /auth/logout` → Replace with SSO logout
- ❌ `POST /auth/refresh` → Replace with SSO refresh
- ❌ `POST /auth/forgot-password` → Use SSO endpoint
- ❌ `POST /auth/reset-password` → Use SSO endpoint
- ❌ `PUT /auth/change-password` → Use SSO endpoint
- ✅ `GET /auth/me` → Keep but validate SSO token

### 5.2 Add SSO Callback Endpoint

**New Endpoint**: `POST /auth/sso/callback`

**Purpose**: Exchange SSO authorization code for tokens

**Implementation**:

```typescript
router.post("/auth/sso/callback", async (req, res, next) => {
  try {
    const { code } = req.body;

    // Exchange code with SSO API
    const response = await fetch(`${SSO_API_URL}/auth/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        product: "api_as_a_service",
      }),
    });

    const tokens = await response.json();

    // Store tokens securely (httpOnly cookies recommended)
    res.cookie("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({ success: true, user: tokens.user });
  } catch (error) {
    next(error);
  }
});
```

### 5.3 Update Auth Middleware

**Location**: `icaptur-api-customer-portal-v1/services/api/src/middleware/auth.ts`

**Changes**:

1. Replace JWT validation with SSO token validation
2. Validate token signature using SSO public key/JWKS
3. Check token `aud` field equals `api_as_a_service`
4. Verify token issuer is SSO service

**New Implementation**:

```typescript
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new AppError("NO_TOKEN", "Authentication required", 401);
    }

    // Validate SSO token
    const payload = await validateSSOToken(token);

    // Check audience
    if (payload.aud !== "api_as_a_service") {
      throw new AppError("INVALID_TOKEN", "Token not for this product", 401);
    }

    // Attach user to request
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId,
      // ... other fields
    };

    next();
  } catch (error) {
    next(error);
  }
}
```

### 5.4 Add SSO Token Validation Service

**New File**: `icaptur-api-customer-portal-v1/services/api/src/services/sso.service.ts`

**Purpose**: Handle SSO token validation, JWKS fetching, token refresh

**Key Methods**:

- `validateSSOToken(token: string): Promise<TokenPayload>`
- `fetchJWKS(): Promise<JWKS>`
- `refreshToken(refreshToken: string): Promise<Tokens>`

### 5.5 Remove Local Auth Service Methods

**Location**: `icaptur-api-customer-portal-v1/services/api/src/services/auth.service.ts`

**Methods to Remove**:

- `login()` - Use SSO instead
- `logout()` - Use SSO instead
- `refreshToken()` - Use SSO instead
- `requestPasswordReset()` - Use SSO endpoint
- `resetPassword()` - Use SSO endpoint
- `changePassword()` - Use SSO endpoint

**Keep**:

- `validateToken()` - But update to validate SSO tokens
- Helper methods that don't depend on local auth

---

## 6. Customer Portal Frontend Migration

### 6.1 Update Login Flow

**Location**: `icaptur-api-customer-portal-v1/apps/web/apps/icaptur-customer-portal/src/`

**Current Flow**: Direct API call to `/auth/login`

**New Flow**: Redirect to SSO login page

**Implementation**:

```typescript
// Replace useLogin hook
export const useSSOLogin = () => {
  const redirectToSSO = () => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const ssoUrl = `${SSO_URL}/auth/login?product=api_as_a_service&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
    window.location.href = ssoUrl;
  };

  return { redirectToSSO };
};
```

### 6.2 Add SSO Callback Handler

**New File**: `icaptur-api-customer-portal-v1/apps/web/apps/icaptur-customer-portal/src/pages/AuthCallback.tsx`

**Purpose**: Handle SSO redirect with authorization code

**Flow**:

1. Extract `code` from URL params
2. Call backend `/auth/sso/callback` with code
3. Backend exchanges code for tokens
4. Store tokens securely
5. Redirect to dashboard

### 6.3 Update Auth Context/State

**Location**: `icaptur-api-customer-portal-v1/apps/web/apps/icaptur-customer-portal/src/state/AppState.ts`

**Changes**:

- Remove local token storage logic
- Add SSO token handling
- Update `setLoginInfo()` to work with SSO tokens
- Update `logout()` to call SSO logout endpoint

### 6.4 Update Protected Routes

**Location**: Router configuration

**Changes**:

- Add route guard that checks SSO token
- Redirect to SSO login if no valid token
- Handle token refresh automatically

### 6.5 Update Password Management UI

**Locations**:

- Forgot Password page
- Reset Password page
- Change Password page (Settings)

**Changes**:

- Update API calls to use SSO endpoints
- Update form submissions to redirect to SSO where needed
- Keep UI consistent but backend calls go to SSO

**Example - Forgot Password**:

```typescript
// Instead of calling local API
const response = await fetch(`${SSO_API_URL}/auth/forgot-password`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email }),
});
```

---

## 7. User and Role Management Migration

### 7.1 Remove Local User Management

**Current**: Customer Portal has its own user management

**Migration**: Use SSO user management APIs

**Endpoints to Replace**:

- User creation → SSO API
- User update → SSO API
- User deletion → SSO API
- Role assignment → SSO API

### 7.2 Update User Management UI

**Location**: `icaptur-api-customer-portal-v1/apps/web/apps/icaptur-customer-portal/src/pages/`

**Pages to Update**:

- `ProductAdmin/Users/addUser.tsx`
- `OrganisationAdmin/Users/addUser.tsx`
- User list pages
- User edit pages

**Changes**:

- Update API calls to use SSO endpoints
- Ensure proper error handling
- Update form validation if needed

### 7.3 Update Role Management

**Current**: Local role definitions (`product_admin`, `org_admin`, `org_user`)

**Migration**: Use SSO role system

**Changes**:

- Remove local role definitions
- Use SSO role codes
- Update role checks throughout application

---

## 8. Environment Configuration

### 8.1 Customer Portal Environment Variables

**New Variables Needed**:

```env
# SSO Configuration
SSO_API_URL=https://sso.icaptur.ai
SSO_APP_URL=https://accounts.icaptur.ai
SSO_PRODUCT_CODE=api_as_a_service
SSO_JWKS_URL=https://sso.icaptur.ai/.well-known/jwks.json

# Remove old JWT config (or keep for backward compatibility during migration)
# JWT_SECRET=...
```

### 8.2 SSO Service Environment Variables

**Verify These Exist**:

```env
CUSTOMER_PORTAL_URL=https://portal.icaptur.ai
```

---

## 9. Testing Strategy

### 9.1 Unit Tests

**Areas to Test**:

- SSO token validation
- Portal enable flag checks
- Token refresh logic
- Error handling

### 9.2 Integration Tests

**Scenarios**:

1. User logs in via SSO → Gets token → Accesses Customer Portal
2. Portal disabled → User cannot access
3. Token expires → Auto refresh
4. User logs out → SSO session cleared
5. Password reset flow via SSO
6. User management via SSO APIs

### 9.3 E2E Tests

**Critical Flows**:

1. Complete login flow (SSO redirect → callback → dashboard)
2. Password reset flow
3. User creation by admin
4. Role assignment
5. Product enable/disable toggle

---

## 10. Migration Steps (Execution Order)

### Phase 1: Database & Product Setup

1. ✅ Add `portal_enable` column to `tenant_product_subscriptions` table
2. ✅ Create migration script
3. ✅ Run migration
4. ✅ Create "API AS A Service" product
5. ✅ Update onboarding Step 5 to show portal enable checkbox

### Phase 2: SSO API Enhancements

6. ✅ Add portal enable check in auth service
7. ✅ Update auth controller
8. ✅ Add portal enable to product DTOs
9. ✅ Test SSO API changes

### Phase 3: Onboarding UI

10. ✅ Add portal enable checkbox to Step 5 (Services selection)
11. ✅ Update onboarding schema to include portalEnable
12. ✅ Update onboarding API to save portal_enable to subscription
13. ✅ Test onboarding flow with portal enable checkbox

### Phase 4: Customer Portal Backend

13. ✅ Add SSO token validation service
14. ✅ Update auth middleware to use SSO tokens
15. ✅ Add SSO callback endpoint
16. ✅ Remove/deprecate local auth endpoints
17. ✅ Update user management to use SSO APIs
18. ✅ Test backend changes

### Phase 5: Customer Portal Frontend

19. ✅ Update login flow to redirect to SSO
20. ✅ Add SSO callback handler
21. ✅ Update auth state management
22. ✅ Update password management UI
23. ✅ Update user management UI
24. ✅ Test frontend changes

### Phase 6: Integration & Testing

25. ✅ End-to-end testing
26. ✅ Performance testing
27. ✅ Security audit
28. ✅ User acceptance testing

### Phase 7: Deployment

29. ✅ Deploy SSO changes
30. ✅ Deploy Customer Portal backend
31. ✅ Deploy Customer Portal frontend
32. ✅ Enable portal for "API AS A Service" product
33. ✅ Monitor for issues
34. ✅ Gradual rollout (if needed)

---

## 11. Rollback Plan

### 11.1 If Issues Arise

**Immediate Actions**:

1. Set `portal_enable = false` for "API AS A Service" product
2. This disables SSO access immediately
3. Users can still use old system (if kept as fallback)

### 11.2 Keep Old System as Fallback (Optional)

**Strategy**: Keep local auth endpoints but mark as deprecated

- Add feature flag to switch between SSO and local auth
- Allows gradual migration
- Can disable SSO quickly if needed

---

## 12. Security Considerations

### 12.1 Token Security

- Use httpOnly cookies for tokens (recommended)
- Implement CSRF protection
- Validate token signatures properly
- Check token expiration

### 12.2 Portal Enable Flag

- Only super admins can enable/disable portal
- Audit log all changes to portal_enable flag
- Validate flag on every token validation

### 12.3 Error Messages

- Don't reveal if portal is disabled in error messages
- Use generic "Access denied" messages
- Log detailed errors server-side only

---

## 13. Documentation Updates

### 13.1 API Documentation

- Update Customer Portal API docs
- Document SSO integration
- Add migration guide for API consumers

### 13.2 User Documentation

- Update user guides
- Document new login flow
- Update password reset instructions

### 13.3 Developer Documentation

- Update architecture diagrams
- Document SSO integration
- Add troubleshooting guide

---

## 14. Success Criteria

### 14.1 Functional Requirements

- ✅ Users can log in via SSO
- ✅ Portal enable flag works correctly
- ✅ Password management works via SSO
- ✅ User management works via SSO
- ✅ Role management works via SSO
- ✅ Token refresh works automatically

### 14.2 Non-Functional Requirements

- ✅ No performance degradation
- ✅ Security maintained or improved
- ✅ User experience is seamless
- ✅ Error handling is robust
- ✅ Monitoring and logging in place

---

## 15. Timeline Estimate

**Total Estimated Time**: 3-4 weeks

- **Phase 1** (Database & Product): 2-3 days
- **Phase 2** (SSO API): 3-4 days
- **Phase 3** (Super Admin UI): 2-3 days
- **Phase 4** (Customer Portal Backend): 5-7 days
- **Phase 5** (Customer Portal Frontend): 5-7 days
- **Phase 6** (Testing): 3-4 days
- **Phase 7** (Deployment): 2-3 days

---

## 16. Dependencies

### 16.1 External Dependencies

- SSO service must be stable and available
- Database migrations must be tested
- Environment variables must be configured

### 16.2 Internal Dependencies

- Super admin must have access to product management
- Customer Portal team must coordinate with SSO team
- Testing environment must be set up

---

## 17. Risk Mitigation

### 17.1 High Risks

1. **SSO service downtime** → Keep fallback mechanism
2. **Token validation failures** → Comprehensive error handling
3. **User data migration** → Careful testing, backup strategy
4. **Breaking changes** → Gradual rollout, feature flags

### 17.2 Medium Risks

1. **Performance issues** → Load testing, caching strategy
2. **UI/UX confusion** → User testing, clear messaging
3. **Integration bugs** → Thorough testing, monitoring

---

## 18. Post-Migration Tasks

### 18.1 Cleanup

- Remove deprecated local auth code (after stable period)
- Remove unused environment variables
- Update documentation
- Archive old migration scripts

### 18.2 Monitoring

- Monitor SSO token validation success rate
- Monitor portal enable flag usage
- Monitor error rates
- Monitor user feedback

### 18.3 Optimization

- Optimize token validation performance
- Cache JWKS properly
- Optimize database queries
- Review and optimize API calls

---

## Conclusion

This migration plan provides a comprehensive roadmap for migrating Customer Portal to SSO authentication. The plan is designed to be executed in phases, with proper testing and rollback capabilities at each stage.

**Key Success Factors**:

1. Thorough testing at each phase
2. Clear communication with stakeholders
3. Proper monitoring and logging
4. Gradual rollout strategy
5. Comprehensive documentation

**Next Steps**:

1. Review and approve this plan
2. Assign team members to each phase
3. Set up development and testing environments
4. Begin Phase 1 implementation

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Author**: AI Assistant  
**Review Status**: Pending Review

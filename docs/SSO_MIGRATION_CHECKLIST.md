# SSO Migration Quick Checklist

## Quick Reference for Implementation

### ✅ Phase 1: Database & Product Setup

- [ ] Add `portal_enable` column to `tenant_product_subscriptions` table schema
- [ ] Create database migration file
- [ ] Run migration on dev/staging
- [ ] Create "API AS A Service" product (code: `api_as_a_service`)
- [ ] Test product creation (no portal_enable in product table)

### ✅ Phase 2: SSO API Enhancements

- [ ] Add `checkTenantPortalEnabled(tenantId, productCode)` method in AuthService
- [ ] Add portal enable check in `login()` method (check subscription, not product)
- [ ] Add portal enable check in token refresh
- [ ] Update error messages for disabled portal
- [ ] Test SSO API with portal enable flag from subscription

### ✅ Phase 3: Onboarding UI (Step 5)

- [ ] Add `portalEnable` checkbox to Step5.tsx (only for api_as_a_service product)
- [ ] Update onboarding schema to include portalEnable field
- [ ] Update onboarding store to handle portalEnable
- [ ] Update onboarding API to save portal_enable to subscription
- [ ] Test onboarding flow with portal enable checkbox

### ✅ Phase 4: Customer Portal Backend

- [ ] Create `sso.service.ts` for token validation
- [ ] Implement JWKS fetching
- [ ] Implement SSO token validation
- [ ] Update `authMiddleware` to validate SSO tokens
- [ ] Add `POST /auth/sso/callback` endpoint
- [ ] Update `GET /auth/me` to work with SSO tokens
- [ ] Remove/deprecate local auth endpoints:
  - [ ] `POST /auth/login`
  - [ ] `POST /auth/logout`
  - [ ] `POST /auth/refresh`
  - [ ] `POST /auth/forgot-password`
  - [ ] `POST /auth/reset-password`
  - [ ] `PUT /auth/change-password`
- [ ] Update user management to use SSO APIs
- [ ] Add environment variables for SSO
- [ ] Test backend changes

### ✅ Phase 5: Customer Portal Frontend

- [ ] Create `useSSOLogin` hook (replace `useLogin`)
- [ ] Create `AuthCallback.tsx` page
- [ ] Add route for `/auth/callback`
- [ ] Update `AppState.ts` for SSO tokens
- [ ] Update logout to use SSO
- [ ] Update forgot password page
- [ ] Update reset password page
- [ ] Update change password page (Settings)
- [ ] Update user management pages:
  - [ ] ProductAdmin/Users
  - [ ] OrganisationAdmin/Users
- [ ] Update protected route guards
- [ ] Add SSO environment variables
- [ ] Test frontend changes

### ✅ Phase 6: Testing

- [ ] Unit tests for SSO token validation
- [ ] Unit tests for portal enable checks
- [ ] Integration test: SSO login flow
- [ ] Integration test: Portal disabled scenario
- [ ] Integration test: Token refresh
- [ ] Integration test: Password reset via SSO
- [ ] E2E test: Complete user journey
- [ ] Performance testing
- [ ] Security audit

### ✅ Phase 7: Deployment

- [ ] Deploy SSO API changes
- [ ] Deploy Customer Portal backend
- [ ] Deploy Customer Portal frontend
- [ ] Enable `portal_enable = true` for "API AS A Service"
- [ ] Monitor logs and errors
- [ ] Verify all flows work in production
- [ ] Gradual user rollout (if needed)

---

## Key Files to Modify

### SSO Codebase (`icaptur-billing-sso-xp`)

1. `packages/database-schema/src/tenant-product-subscriptions.ts` - Add portal_enable field
2. `database/drizzle/XXXX_add_portal_enable_to_subscriptions.sql` - Migration file
3. `services/sso-api/src/modules/auth/auth.service.ts` - Portal enable checks (from subscription)
4. `services/sso-api/src/modules/auth/auth.controller.ts` - Error handling
5. `apps/web/apps/experience-app/src/pages/ProductAdmin/Organisation-Onboarding/steps/Step5.tsx` - UI checkbox
6. `apps/web/apps/experience-app/src/lib/zod.schemas.ts` - Add portalEnable to schema
7. `services/experience-api/src/modules/organizations/` - Save portal_enable to subscription

### Customer Portal Codebase (`icaptur-api-customer-portal-v1`)

1. `services/api/src/services/sso.service.ts` - NEW: SSO integration
2. `services/api/src/middleware/auth.ts` - Update to validate SSO tokens
3. `services/api/src/routes/auth.ts` - Add callback, remove local auth
4. `services/api/src/services/auth.service.ts` - Remove local auth methods
5. `apps/web/apps/icaptur-customer-portal/src/hooks/rq/mutations/auth/useLogin.tsx` - Replace with SSO
6. `apps/web/apps/icaptur-customer-portal/src/pages/AuthCallback.tsx` - NEW: Callback handler
7. `apps/web/apps/icaptur-customer-portal/src/state/AppState.ts` - Update for SSO

---

## Environment Variables

### SSO Service

```env
CUSTOMER_PORTAL_URL=https://portal.icaptur.ai  # Verify exists
```

### Customer Portal

```env
# Add these
SSO_API_URL=https://sso.icaptur.ai
SSO_APP_URL=https://accounts.icaptur.ai
SSO_PRODUCT_CODE=api_as_a_service
SSO_JWKS_URL=https://sso.icaptur.ai/.well-known/jwks.json

# Remove or deprecate
# JWT_SECRET=...
```

---

## Testing Scenarios

### Critical Test Cases

1. ✅ User logs in → SSO redirect → Callback → Dashboard access
2. ✅ Portal disabled → User cannot access (clear error)
3. ✅ Token expires → Auto refresh works
4. ✅ User logs out → SSO session cleared
5. ✅ Password reset → Email sent → Reset works
6. ✅ Change password → All sessions invalidated
7. ✅ Admin enables portal → Users can access
8. ✅ Admin disables portal → Users cannot access
9. ✅ User management → Create/update/delete via SSO
10. ✅ Role assignment → Works via SSO

---

## Rollback Steps

If issues occur:

1. Set `portal_enable = false` in database (immediate disable)
2. Revert Customer Portal frontend deployment
3. Revert Customer Portal backend deployment
4. Revert SSO API changes (if needed)
5. Re-enable local auth (if kept as fallback)

---

## Notes

- Keep old auth system as fallback during initial rollout (optional)
- Use feature flags for gradual migration
- Monitor error rates closely after deployment
- Have rollback plan ready before production deployment

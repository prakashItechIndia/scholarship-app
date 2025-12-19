# Portal Enable Flag - Correct Implementation

## Important Clarification

The `portal_enable` flag is **NOT** a product-level setting. It is a **tenant/organization-level subscription setting**.

---

## Correct Implementation

### Database Schema

**Table**: `tenant_product_subscriptions` (NOT `products`)

```typescript
export const tenantProductSubscriptions = pgTable('tenant_product_subscriptions', {
  // ... existing fields
  portalEnable: text('portal_enable').notNull().default('false'), // NEW FIELD
  // ... rest of fields
});
```

**Migration**:
```sql
ALTER TABLE tenant_product_subscriptions 
ADD COLUMN portal_enable TEXT NOT NULL DEFAULT 'false';
```

---

## Where It's Set

### Location: Onboarding Step 5 (Services Selection Page)

**File**: `icaptur-billing-sso-xp/apps/web/apps/experience-app/src/pages/ProductAdmin/Organisation-Onboarding/steps/Step5.tsx`

**When**: During organization onboarding, when `org_admin` selects products

**How**: 
1. Show list of products in Step 5
2. When "API AS A Service" product is selected, show a checkbox: "Enable Customer Portal"
3. Only show checkbox for product with code `api_as_a_service`
4. Store the checkbox value in onboarding form/store
5. When creating subscription, save `portal_enable` to `tenant_product_subscriptions` table

**UI Implementation**:
```tsx
// In Step5.tsx - when rendering "API AS A Service" product card
{service.code === 'api_as_a_service' && isSelected && (
  <div className="mt-3 flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
    <Checkbox
      id="portal-enable"
      checked={portalEnable}
      onCheckedChange={(checked) => {
        onboardingStore.updateFormData({ 
          portalEnable: checked === true 
        });
      }}
    />
    <label htmlFor="portal-enable" className="text-sm cursor-pointer">
      Enable Customer Portal
    </label>
    <p className="text-xs text-gray-500">
      Allow users in this organization to access Customer Portal via SSO
    </p>
  </div>
)}
```

---

## Where It's NOT Set

### ❌ NOT in Product Creation Page

**File**: `icaptur-billing-sso-xp/apps/web/apps/experience-app/src/pages/ProductAdmin/Products/AddProduct.tsx`

**Action**: Do NOT add `portal_enable` checkbox here. This is for Super Admin to create products, not to enable portal for organizations.

---

## How It's Checked

### SSO Authentication Flow

**Location**: `icaptur-billing-sso-xp/services/sso-api/src/modules/auth/auth.service.ts`

**Method**:
```typescript
async checkTenantPortalEnabled(tenantId: string, productCode: string): Promise<boolean> {
  // 1. Get product by code
  const [product] = await this.db.db
    .select()
    .from(products)
    .where(eq(products.code, productCode))
    .limit(1);
  
  if (!product) return false;
  
  // 2. Get tenant's subscription for this product
  const [subscription] = await this.db.db
    .select()
    .from(tenantProductSubscriptions)
    .where(
      and(
        eq(tenantProductSubscriptions.tenantId, tenantId),
        eq(tenantProductSubscriptions.productId, product.id),
        eq(tenantProductSubscriptions.status, 'active')
      )
    )
    .limit(1);
  
  if (!subscription) return false;
  
  // 3. Check portal_enable flag (from subscription, not product)
  return subscription.portalEnable === 'true';
}
```

**Usage**: Called during login/token issuance to check if the organization has Customer Portal enabled.

---

## Key Points

1. ✅ **Per-Organization**: Each organization can independently enable/disable Customer Portal
2. ✅ **Set During Onboarding**: Only set in Step 5 (Services selection) when `org_admin` selects "API AS A Service"
3. ✅ **Stored in Subscription**: Flag is in `tenant_product_subscriptions` table, not `products` table
4. ✅ **Checked During Auth**: SSO checks this flag when authenticating users for Customer Portal
5. ❌ **NOT in Product Creation**: Do not add to Super Admin product creation page

---

## Summary

| Aspect | Details |
|--------|---------|
| **Table** | `tenant_product_subscriptions` |
| **Column** | `portal_enable` (TEXT, default 'false') |
| **Set By** | `org_admin` during onboarding |
| **Set Where** | Step 5 (Services selection page) |
| **Set When** | When selecting "API AS A Service" product |
| **Checked By** | SSO API during authentication |
| **Scope** | Per organization subscription |
| **NOT Set In** | Product creation/management page |

---

## Updated Files Summary

### Database
- ✅ `packages/database-schema/src/tenant-product-subscriptions.ts` - Add `portal_enable` field
- ✅ `database/drizzle/XXXX_add_portal_enable_to_subscriptions.sql` - Migration

### Frontend
- ✅ `apps/web/apps/experience-app/src/pages/ProductAdmin/Organisation-Onboarding/steps/Step5.tsx` - Add checkbox
- ✅ `apps/web/apps/experience-app/src/lib/zod.schemas.ts` - Add `portalEnable` to schema

### Backend
- ✅ `services/sso-api/src/modules/auth/auth.service.ts` - Check subscription flag
- ✅ `services/experience-api/src/modules/organizations/` - Save flag to subscription

### NOT Changed
- ❌ `apps/web/apps/experience-app/src/pages/ProductAdmin/Products/AddProduct.tsx` - Do NOT modify

---

**Last Updated**: [Current Date]  
**Status**: Corrected Implementation


# SSO Migration Architecture Overview

## Access Control Summary

**Important**: The `portal_enable` flag controls **Customer Portal UI/Application access only**, NOT API access or Experience Platform access.

### Access Rules for "API AS A Service" Product

| Access Type             | Requirement                                  | Controlled By                                     |
| ----------------------- | -------------------------------------------- | ------------------------------------------------- |
| **Experience Platform** | Active subscription                          | ✅ Always allowed for `org_admin`/`org_user`      |
| **Customer Portal UI**  | Active subscription + `portal_enable = true` | `portal_enable` flag in subscription              |
| **API Access**          | Active subscription                          | ✅ Always allowed (regardless of `portal_enable`) |

### Use Cases

1. **Clients with own application** (`portal_enable = false`):
   - ✅ Can access Experience Platform
   - ✅ Can access APIs (for third-party integration)
   - ❌ Cannot access Customer Portal UI/application
   - **Purpose**: Integrate iCaptur APIs into their own applications

2. **Clients without own application** (`portal_enable = true`):
   - ✅ Can access Experience Platform
   - ✅ Can access APIs
   - ✅ Can access Customer Portal UI/application
   - **Purpose**: Use iCaptur's Customer Portal as their application

### Key Points

- **Subscription**: Only `org_admin` can subscribe to "API AS A Service" subscription plans
- `portal_enable` is set by `org_admin` during onboarding (Step 5 - Services selection)
- Stored in `tenant_product_subscriptions` table (per organization subscription)
- **NOT** stored in `products` table (not a product-level setting)
- Each organization can independently enable/disable Customer Portal UI
- API access is **always available** for organizations with active subscription
- Experience Platform access is **always available** for org_admin/org_user
- **API_KEY**: Only `org_admin` can retrieve API_KEY to access Python APIs

---

## API AS A Service - Subscription & Integration Flow

### Subscription Rules

**Important**: Only `org_admin` can subscribe to "API AS A Service" subscription plans.

- `org_user` cannot subscribe directly
- Subscription is created at the organization level
- All users in the organization inherit access based on their roles

### Firebase Integration Flow

When `org_admin` activates account (creates password), the following flow occurs:

```
┌─────────────────────────────────────┐
│  Org Admin Activates Account        │
│  - Receives activation email         │
│  - Clicks activation link            │
│  - Creates password                  │
└──────────────┬──────────────────────┘
               │
               │ POST /auth/create-password
               │ { token, password }
               │
┌──────────────▼──────────────────────┐
│  SSO API - createPassword()         │
│  ┌──────────────────────────────┐  │
│  │ 1. Validate activation token  │  │
│  │ 2. Hash password              │  │
│  │ 3. Activate user account      │  │
│  │ 4. Create Firebase account ───┼──┼──┐
│  └──────────────────────────────┘  │  │
└──────────────────────────────────────┘  │
                                         │
                                         │ Create Firebase User
                                         │
┌────────────────────────────────────────▼──┐
│  Firebase Service                          │
│  ┌────────────────────────────────────┐  │
│  │ admin.auth().createUser({          │  │
│  │   email: user.email,               │  │
│  │   password: password,             │  │
│  │   emailVerified: true             │  │
│  │ })                                 │  │
│  │                                     │  │
│  │ Returns: firebaseUid               │  │
│  └────────────────────────────────────┘  │
└──────────────┬─────────────────────────────┘
               │
               │ Store firebaseUid in DB
               │
┌──────────────▼──────────────────────┐
│  Database Update                    │
│  user_account.firebase_uid = UID    │
└──────────────┬──────────────────────┘
               │
               │ Get Firebase IdToken
               │
┌──────────────▼──────────────────────┐
│  Firebase Service                    │
│  ┌──────────────────────────────┐  │
│  │ admin.auth()                 │  │
│  │   .createCustomToken(uid)    │  │
│  │   .then(exchange for idToken)│  │
│  │                              │  │
│  │ Returns: idToken             │  │
│  └──────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               │ Store idToken in DB
               │
┌──────────────▼──────────────────────┐
│  Database Update                    │
│  user_account.firebase_id_token     │
│  user_account.firebase_id_token_    │
│    expires_at                       │
└──────────────┬──────────────────────┘
               │
               │ Check if org_admin
               │ AND has "API AS A Service"
               │ subscription
               │
┌──────────────▼──────────────────────┐
│  Check Subscription                 │
│  ┌──────────────────────────────┐  │
│  │ Get tenant's subscription    │  │
│  │ for "api_as_a_service"      │  │
│  │                              │  │
│  │ If subscription exists:      │  │
│  │   → Call Python API ────────┼──┼──┐
│  └──────────────────────────────┘  │  │
└──────────────────────────────────────┘  │
                                         │
                                         │ POST to Python API
                                         │
┌────────────────────────────────────────▼──┐
│  Python API - User Registration           │
│  ┌────────────────────────────────────┐  │
│  │ POST /api/user/register            │  │
│  │ {                                   │  │
│  │   firebase_uid: "firebase-uid",    │  │
│  │   plan_details: {                  │  │
│  │     type: "trial" | "purchased",   │  │
│  │     plan_code: "...",             │  │
│  │     subscription_id: "..."         │  │
│  │   },                               │  │
│  │   credits: {                       │  │
│  │     initial: 1000,                 │  │
│  │     limit: 10000                   │  │
│  │   }                                │  │
│  │ }                                  │  │
│  └────────────────────────────────────┘  │
└──────────────┬─────────────────────────────┘
               │
               │ Python API manages credits
               │ for this Firebase UID
               │
┌──────────────▼──────────────────────┐
│  Python API Response                │
│  {                                   │
│    success: true,                    │
│    firebase_uid: "...",             │
│    credits_allocated: true           │
│  }                                   │
└──────────────────────────────────────┘
```

**Key Points**:

- Firebase account is created automatically when `org_admin` activates account
- Firebase UID and IdToken are stored in `user_account` table
- Python API is called with Firebase UID, plan details, and credits
- Python team manages all credits for the user (identified by Firebase UID)
- This happens only for `org_admin` users with "API AS A Service" subscription

---

### API_KEY Management Flow

**Purpose**: Python team provides APIs (CAD Table, CAD Checklist, Invoice Extraction). Organizations need API_KEY to access these APIs.

```
┌─────────────────────────────────────┐
│  Python Team                        │
│  - Generates API_KEY                │
│  - Provides to NestJS Backend       │
└──────────────┬──────────────────────┘
               │
               │ API_KEY provided
               │
┌──────────────▼──────────────────────┐
│  NestJS Backend (Experience API)    │
│  ┌──────────────────────────────┐  │
│  │ Store API_KEY in database    │  │
│  │                              │  │
│  │ Table: tenant                │  │
│  │ Field: api_key_encrypted     │  │
│  │                              │  │
│  │ Encrypt before storing       │  │
│  └──────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               │ Enable for org_admins
               │ with "API AS A Service"
               │ subscription
               │
┌──────────────▼──────────────────────┐
│  Database: tenant table             │
│  ┌──────────────────────────────┐  │
│  │ id: tenant-uuid             │  │
│  │ org_name: "Acme Corp"      │  │
│  │ api_key_encrypted: "..."   │  │
│  │ (encrypted with ENCRYPTION_ │  │
│  │  KEY)                        │  │
│  └──────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               │ org_admin can retrieve
               │
┌──────────────▼──────────────────────┐
│  Org Admin - Get API_KEY             │
│  ┌──────────────────────────────┐  │
│  │ GET /tenants/me/api-key       │  │
│  │ (requires org_admin role)     │  │
│  │                              │  │
│  │ Response: {                   │  │
│  │   api_key: "decrypted-key"   │  │
│  │ }                             │  │
│  └──────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               │ Use API_KEY to access
               │ Python APIs
               │
┌──────────────▼──────────────────────┐
│  Python APIs (Third-party)          │
│  ┌──────────────────────────────┐  │
│  │ CAD Table Extraction         │  │
│  │ CAD Checklist Extraction     │  │
│  │ Invoice Extraction            │  │
│  │                              │  │
│  │ All require API_KEY in       │  │
│  │ Authorization header         │  │
│  └──────────────────────────────┘  │
└──────────────────────────────────────┘
```

**API_KEY Access Rules**:

- Only `org_admin` can retrieve API_KEY
- API_KEY is encrypted in database
- Decrypted only when `org_admin` requests it
- `org_user` cannot access API_KEY (only `org_admin`)
- API_KEY is used to authenticate with Python APIs

**Database Schema**:

```sql
-- tenant table (already exists)
ALTER TABLE tenant
ADD COLUMN api_key_encrypted TEXT; -- Encrypted API_KEY from Python team

-- Index for faster lookups
CREATE INDEX idx_tenant_api_key ON tenant(api_key_encrypted)
WHERE api_key_encrypted IS NOT NULL;
```

**API Endpoints**:

```
GET  /tenants/me/api-key          → Get API_KEY (org_admin only)
POST /admin/tenants/:id/api-key   → Set API_KEY (product_admin only)
```

---

### Python API Integration for Credits

**Flow**: When `org_admin` activates account and has "API AS A Service" subscription

```
┌─────────────────────────────────────┐
│  Org Admin Account Activated        │
│  - Firebase UID created              │
│  - IdToken obtained                  │
└──────────────┬──────────────────────┘
               │
               │ Get subscription details
               │
┌──────────────▼──────────────────────┐
│  Get Subscription Info              │
│  ┌──────────────────────────────┐  │
│  │ - Plan type (trial/purchased) │  │
│  │ - Plan code                  │  │
│  │ - Subscription ID             │  │
│  │ - Credits allocation         │  │
│  └──────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               │ Call Python API
               │
┌──────────────▼──────────────────────┐
│  Python API - Register User         │
│  POST /api/user/register             │
│  {                                   │
│    firebase_uid: "firebase-uid-123",│
│    plan_details: {                  │
│      type: "trial",                 │
│      plan_code: "api-as-a-service-  │
│                 trial-monthly",     │
│      subscription_id: "sub-123"     │
│    },                               │
│    credits: {                       │
│      initial: 1000,                 │
│      limit: 10000,                  │
│      rate_limit: 100                │
│    }                                │
│  }                                   │
└──────────────┬──────────────────────┘
               │
               │ Python API manages
               │ credits for this UID
               │
┌──────────────▼──────────────────────┐
│  Python API Response                │
│  {                                   │
│    success: true,                    │
│    firebase_uid: "firebase-uid-123",│
│    credits_allocated: true,          │
│    message: "User registered"        │
│  }                                   │
└──────────────────────────────────────┘
```

**Credits Management**:

- Python team manages all credits using Firebase UID as identifier
- Credits are allocated based on subscription plan
- Trial plans get initial credits
- Purchased plans get credits based on plan tier
- All API usage (CAD Table, CAD Checklist, Invoice) consumes credits managed by Python team

---

### API Access Flow

**How org_admin and org_user access Python APIs**:

```
┌─────────────────────────────────────┐
│  Org Admin/Org User                 │
│  - Has SSO token                    │
│  - Wants to use Python API          │
└──────────────┬──────────────────────┘
               │
               │ 1. Get API_KEY
               │ (org_admin only)
               │
┌──────────────▼──────────────────────┐
│  GET /tenants/me/api-key            │
│  Authorization: Bearer <SSO_TOKEN>  │
└──────────────┬──────────────────────┘
               │
               │ 2. Decrypt and return
               │
┌──────────────▼──────────────────────┐
│  Response: { api_key: "..." }      │
└──────────────┬──────────────────────┘
               │
               │ 3. Use API_KEY to call
               │    Python APIs
               │
┌──────────────▼──────────────────────┐
│  Python API Calls                   │
│  ┌──────────────────────────────┐  │
│  │ POST /api/cad-table/extract  │  │
│  │ Authorization: <API_KEY>     │  │
│  │                              │  │
│  │ POST /api/cad-checklist/     │  │
│  │   extract                    │  │
│  │ Authorization: <API_KEY>     │  │
│  │                              │  │
│  │ POST /api/invoice/extract    │  │
│  │ Authorization: <API_KEY>     │  │
│  └──────────────────────────────┘  │
└──────────────────────────────────────┘
```

**Important Notes**:

- Only `org_admin` can retrieve API_KEY
- `org_user` cannot access API_KEY directly
- API_KEY is used to authenticate with Python APIs
- Python APIs manage credits based on Firebase UID
- All API calls consume credits managed by Python team

---

## Current Architecture vs. Target Architecture

### Current State (Customer Portal)

```
┌─────────────────┐
│  Customer       │
│  Portal         │
│  Frontend       │
└────────┬────────┘
         │
         │ JWT Token
         │
┌────────▼────────┐
│  Customer       │
│  Portal API     │
│  (Express)      │
└────────┬────────┘
         │
         │ Validate JWT
         │ (local secret)
         │
┌────────▼────────┐
│  PostgreSQL     │
│  (Local DB)     │
│  - users        │
│  - tenants      │
│  - auth tokens  │
└─────────────────┘
```

**Issues**:

- Separate authentication system
- Users need separate accounts
- No single sign-on across products
- Duplicate user management

---

### Target State (After Migration)

```
┌─────────────────┐
│  Customer       │
│  Portal         │
│  Frontend       │
└────────┬────────┘
         │
         │ 1. Redirect to SSO
         │
┌────────▼────────────────────────┐
│  SSO Service                    │
│  (accounts.icaptur.ai)          │
│  - Login                        │
│  - Session Management           │
│  - MFA                          │
└────────┬────────────────────────┘
         │
         │ 2. Authorization Code
         │
┌────────▼────────┐
│  Customer       │
│  Portal API     │
│  (Express)      │
└────────┬────────┘
         │
         │ 3. Exchange code for token
         │
┌────────▼────────────────────────┐
│  SSO API                        │
│  (sso.icaptur.ai)               │
│  - Token Validation             │
│  - User Management              │
│  - Permissions                  │
└────────┬────────────────────────┘
         │
         │ 4. Validate & Issue Token
         │
┌────────▼────────────────────────┐
│  Shared PostgreSQL               │
│  - users (SSO)                  │
│  - tenants                      │
│  - products                     │
│  - subscriptions                 │
│  - permissions                  │
└─────────────────────────────────┘
```

**Benefits**:

- Single sign-on across all products
- Centralized user management
- Unified authentication
- Better security
- Easier user experience

---

## Portal Enable Flag Flow

### Access Control Logic

**Important**: `portal_enable` controls access to **Customer Portal UI/Application**, NOT API access or Experience Platform access.

**Access Rules**:

1. **Experience Platform**: Always accessible for `org_admin`/`org_user` with active "API AS A Service" subscription
2. **Customer Portal Application**: Requires `portal_enable = true` in subscription
3. **API Access**: Always accessible if organization has active subscription (regardless of `portal_enable`)

**Use Cases**:

- **Clients with own application** (`portal_enable = false`): Can access APIs for third-party integration, but NOT Customer Portal UI
- **Clients without own application** (`portal_enable = true`): Can access both APIs AND Customer Portal UI

### How Portal Enable Works

```
┌─────────────────────────────────────┐
│  Org Admin (During Onboarding)     │
│  - Step 5: Selects Products         │
│  - Selects "API AS A Service"       │
│  - Checks "Enable Customer Portal"  │
│    (only if they need UI access)    │
└──────────────┬──────────────────────┘
               │
               │ Save portal_enable = 'true' or 'false'
               │ to subscription
               │
┌──────────────▼──────────────────────┐
│  Tenant Product Subscriptions       │
│  Table                              │
│  ┌──────────────────────────────┐  │
│  │ tenant_id: org-123          │  │
│  │ product_id: api_as_a_service│  │
│  │ status: 'active'             │  │
│  │ portal_enable: 'true/false' ←┼──┼──┐
│  └──────────────────────────────┘  │  │
└──────────────────────────────────────┘  │
                                         │
                                         │ Check when accessing
                                         │ Customer Portal UI
                                         │
┌────────────────────────────────────────▼──┐
│  User Access Scenarios                     │
│                                            │
│  Scenario 1: Access Experience Platform    │
│  ┌────────────────────────────────────┐  │
│  │ ✅ Always allowed                   │  │
│  │ (if subscription active)            │  │
│  └────────────────────────────────────┘  │
│                                            │
│  Scenario 2: Access Customer Portal UI    │
│  ┌────────────────────────────────────┐  │
│  │ Check portal_enable flag ──────────┼──┼──┐
│  │ If true: ✅ Allow access           │  │  │
│  │ If false: ❌ Block access          │  │  │
│  └────────────────────────────────────┘  │  │
│                                            │  │
│  Scenario 3: Access APIs                  │  │
│  ┌────────────────────────────────────┐  │  │
│  │ ✅ Always allowed                   │  │  │
│  │ (if subscription active,            │  │  │
│  │  regardless of portal_enable)      │  │  │
│  └────────────────────────────────────┘  │  │
└───────────────────────────────────────────┘  │
                                               │
┌───────────────────────────────────────────────▼──┐
│  SSO Auth Service - Customer Portal Check       │
│  ┌──────────────────────────────────────────┐  │
│  │ async checkPortalAccess(tenantId) {      │  │
│  │   // Get subscription                    │  │
│  │   const sub = await getSubscription(     │  │
│  │     tenantId,                            │  │
│  │     'api_as_a_service'                  │  │
│  │   );                                     │  │
│  │                                           │  │
│  │   // For Customer Portal UI access       │  │
│  │   if (requestingPortalUI) {              │  │
│  │     if (sub.portal_enable !== 'true') { │  │
│  │       throw 'Portal not enabled'         │  │
│  │     }                                    │  │
│  │   }                                      │  │
│  │                                           │  │
│  │   // For API access - always allow       │  │
│  │   // (if subscription is active)         │  │
│  │   // Issue token                         │  │
│  │ }                                        │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Key Points**:

- `portal_enable` is stored in `tenant_product_subscriptions` table (per organization subscription)
- Set by `org_admin` during onboarding (Step 5 - Services selection)
- NOT stored in `products` table (product-level setting)
- Controls **Customer Portal UI/Application access only**
- **API access is always available** if organization has active subscription
- **Experience Platform access is always available** for org_admin/org_user with subscription
- Each organization can independently enable/disable Customer Portal UI
- Checked during SSO authentication when accessing Customer Portal application

---

## Authentication Flow Sequence

### Complete Login Flow

```
User                    Customer Portal          SSO App            SSO API            Database
 │                           │                    │                   │                   │
 │ 1. Click "Login"          │                    │                   │                   │
 ├──────────────────────────>│                    │                   │                   │
 │                           │                    │                   │                   │
 │ 2. Redirect to SSO        │                    │                   │                   │
 │<──────────────────────────┤                    │                   │                   │
 │                           │                    │                   │                   │
 │ 3. Navigate to SSO        │                    │                   │                   │
 ├───────────────────────────────────────────────>│                   │                   │
 │                           │                    │                   │                   │
 │ 4. Show login form        │                    │                   │                   │
 │<───────────────────────────────────────────────┤                   │                   │
 │                           │                    │                   │                   │
 │ 5. Enter credentials      │                    │                   │                   │
 ├───────────────────────────────────────────────>│                   │                   │
 │                           │                    │                   │                   │
 │ 6. POST /auth/login       │                    │                   │                   │
 │                           ├───────────────────────────────────────>│                   │
 │                           │                    │                   │                   │
 │ 7. Validate credentials   │                    │                   │                   │
 │                           │                    │                   ├──────────────────>│
 │                           │                    │                   │  Check user      │
 │                           │                    │                   │  Get tenant_id   │
 │                           │                    │                   │  Check subscription│
 │                           │                    │                   │  portal_enable   │
 │                           │                    │                   │<──────────────────┤
 │                           │                    │                   │                   │
 │ 8. Create session         │                    │                   │                   │
 │                           │                    │                   ├──────────────────>│
 │                           │                    │                   │  Store session   │
 │                           │                    │                   │<──────────────────┤
 │                           │                    │                   │                   │
 │ 9. Return auth code       │                    │                   │                   │
 │                           │<───────────────────────────────────────┤                   │
 │                           │                    │                   │                   │
 │ 10. Redirect with code    │                    │                   │                   │
 │<──────────────────────────┤                    │                   │                   │
 │                           │                    │                   │                   │
 │ 11. GET /auth/callback?   │                    │                   │                   │
 │     code=xyz              │                    │                   │                   │
 ├──────────────────────────>│                    │                   │                   │
 │                           │                    │                   │                   │
 │ 12. POST /auth/callback   │                    │                   │                   │
 │     { code, product }      │                    │                   │                   │
 │                           ├───────────────────────────────────────>│                   │
 │                           │                    │                   │                   │
 │ 13. Exchange code         │                    │                   │                   │
 │                           │                    │                   ├──────────────────>│
 │                           │                    │                   │  Validate code   │
 │                           │                    │                   │  Issue token     │
 │                           │                    │                   │<──────────────────┤
 │                           │                    │                   │                   │
 │ 14. Return tokens         │                    │                   │                   │
 │<──────────────────────────┤                    │                   │                   │
 │                           │                    │                   │                   │
 │ 15. Store tokens          │                    │                   │                   │
 │     (httpOnly cookie)     │                    │                   │                   │
 │                           │                    │                   │                   │
 │ 16. Redirect to dashboard │                    │                   │                   │
 │<──────────────────────────┤                    │                   │                   │
 │                           │                    │                   │                   │
 │ 17. Load dashboard        │                    │                   │                   │
 │     (with token)          │                    │                   │                   │
 ├──────────────────────────>│                    │                   │                   │
 │                           │                    │                   │                   │
 │ 18. Validate token        │                    │                   │                   │
 │                           ├───────────────────────────────────────>│                   │
 │                           │                    │                   │                   │
 │ 19. Return user data      │                    │                   │                   │
 │<──────────────────────────┤                    │                   │                   │
 │                           │                    │                   │                   │
```

---

## Token Validation Flow

### How Customer Portal Validates SSO Tokens

```
Request with Token
      │
      ▼
┌─────────────────┐
│  Auth Middleware│
└────────┬────────┘
         │
         │ Extract token from header
         │
         ▼
┌─────────────────┐
│  Validate Token │
│  - Check format │
│  - Check expiry  │
└────────┬────────┘
         │
         │ Fetch JWKS (if needed)
         │
         ▼
┌─────────────────┐
│  Verify Signature│
│  - Use JWKS      │
│  - RSA-256       │
└────────┬────────┘
         │
         │ Check audience
         │
         ▼
┌─────────────────┐
│  Validate aud   │
│  Must be:       │
│  "api_as_a_     │
│   service"      │
└────────┬────────┘
         │
         │ Extract user info
         │
         ▼
┌─────────────────┐
│  Attach to req  │
│  req.user = {   │
│    id, email,   │
│    role, etc.   │
│  }              │
└────────┬────────┘
         │
         │ Continue to route handler
         │
         ▼
```

---

## Database Schema Changes

### Tenant Product Subscriptions Table (SSO Database)

**Before**:

```sql
CREATE TABLE tenant_product_subscriptions (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  product_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'trial',
  billing_status TEXT NOT NULL DEFAULT 'trial',
  -- ... other fields
);
```

**After**:

```sql
CREATE TABLE tenant_product_subscriptions (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  product_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'trial',
  billing_status TEXT NOT NULL DEFAULT 'trial',
  portal_enable TEXT DEFAULT 'false',  -- NEW FIELD (per organization subscription)
  -- ... other fields
);
```

**Migration**:

```sql
ALTER TABLE tenant_product_subscriptions
ADD COLUMN portal_enable TEXT NOT NULL DEFAULT 'false';

-- Existing subscriptions will have portal_enable = 'false' by default
-- This is set during onboarding when org_admin selects "API AS A Service"
```

**Important Notes**:

- `portal_enable` is **NOT** in the `products` table
- It's a **per-organization subscription** setting in `tenant_product_subscriptions` table
- Set by `org_admin` during organization onboarding in Step 5 (Services selection page)
- Each organization that subscribes to "API AS A Service" can independently enable/disable Customer Portal
- The flag is checked during SSO authentication by looking up the user's organization subscription
- This is an **organization-level** setting, not a product-level setting

---

## API Endpoint Changes

### Customer Portal API Endpoints

**Removed/Deprecated**:

```
POST   /auth/login              → Use SSO redirect
POST   /auth/logout             → Use SSO logout
POST   /auth/refresh            → Use SSO refresh
POST   /auth/forgot-password    → Use SSO endpoint
POST   /auth/reset-password     → Use SSO endpoint
PUT    /auth/change-password    → Use SSO endpoint
```

**New/Updated**:

```
POST   /auth/sso/callback      → NEW: Exchange code for token
GET    /auth/me                → UPDATED: Validate SSO token
```

**SSO API Endpoints Used**:

```
POST   /auth/login             → SSO login
POST   /auth/callback          → SSO token exchange
POST   /auth/refresh            → SSO token refresh
POST   /auth/forgot-password    → SSO password reset
POST   /auth/reset-password     → SSO password reset
PUT    /auth/change-password    → SSO change password
GET    /auth/me                 → SSO user info
```

---

## Security Considerations

### Token Security

1. **Token Storage**:
   - Use httpOnly cookies (recommended)
   - Never store in localStorage (XSS risk)
   - Set secure flag in production
   - Set sameSite: 'strict'

2. **Token Validation**:
   - Always validate signature
   - Check expiration
   - Verify audience (aud field)
   - Verify issuer (iss field)

3. **CSRF Protection**:
   - Use CSRF tokens for state-changing operations
   - Validate origin header
   - Use sameSite cookies

### Portal Enable Flag Security

1. **Access Control**:
   - Set by `org_admin` during organization onboarding (Step 5 - Services selection)
   - Stored in `tenant_product_subscriptions` table (per organization subscription)
   - Can be updated later via Experience API (with proper permissions - org_admin or product_admin)
   - Audit all changes
   - Validate when accessing Customer Portal UI/application (not for API access)

2. **Access Rules**:
   - **Experience Platform**: Always accessible for org_admin/org_user with active subscription
   - **Customer Portal UI**: Requires `portal_enable = true`
   - **API Access**: Always accessible if subscription is active (regardless of `portal_enable`)
   - This allows clients to use APIs in their own applications without needing Customer Portal UI

3. **Error Messages**:
   - Don't reveal portal status
   - Use generic error messages
   - Log detailed errors server-side
   - When blocking Customer Portal UI access, show: "Customer Portal access is not enabled for your organization. Please contact your administrator or use API integration."

4. **Scope**:
   - Flag is **per-organization subscription**, NOT per-product
   - Each organization that subscribes to "API AS A Service" can independently enable/disable Customer Portal UI
   - Stored in `tenant_product_subscriptions.portal_enable` (NOT in `products` table)
   - Only applies when accessing Customer Portal application/UI
   - Does NOT affect API access or Experience Platform access
   - Set at the organization level by org_admin, not at the product level by super admin

5. **Subscription & API_KEY Rules**:
   - **Subscription**: Only `org_admin` can subscribe to "API AS A Service" plans
   - **API_KEY Access**: Only `org_admin` can retrieve API_KEY from `/tenants/me/api-key`
   - **org_user**: Cannot subscribe, cannot access API_KEY directly (must go through org_admin)
   - **Firebase Integration**: When `org_admin` activates account, Firebase account is created and Python API is called with UID, plan details, and credits
   - **Credits Management**: Python team manages all credits using Firebase UID as identifier

---

## Error Handling

### Common Error Scenarios

1. **Portal Disabled** (Customer Portal UI access):

   ```
   Error: "Customer Portal access is not enabled for your organization.
          Please contact your administrator or use API integration."
   ```

   **Note**: This error only appears when trying to access Customer Portal UI/application. API access and Experience Platform access are still available.

2. **Invalid Token**:

   ```
   Error: "Your session has expired. Please log in again."
   ```

3. **Token for Wrong Product**:

   ```
   Error: "Invalid token for this product."
   ```

4. **SSO Service Unavailable**:
   ```
   Error: "Authentication service is temporarily unavailable.
          Please try again later."
   ```

---

## Monitoring & Logging

### Key Metrics to Monitor

1. **Authentication Metrics**:
   - Login success rate
   - Token validation success rate
   - Token refresh success rate
   - Portal enable check failures

2. **Performance Metrics**:
   - Token validation latency
   - SSO API response time
   - JWKS fetch time

3. **Error Metrics**:
   - Authentication failures
   - Token validation errors
   - Portal disabled errors
   - SSO service errors

### Logging Points

1. **Successful Events**:
   - User login via SSO
   - Token issued
   - Token validated
   - Portal enabled/disabled

2. **Error Events**:
   - Login failures
   - Token validation failures
   - Portal disabled access attempts
   - SSO service errors

---

## Migration Strategy

### Gradual Rollout (Recommended)

1. **Phase 1**: Deploy with portal disabled
   - Test all flows
   - Monitor for issues
   - No user impact

2. **Phase 2**: Enable for test users
   - Small group of beta users
   - Monitor closely
   - Gather feedback

3. **Phase 3**: Gradual rollout
   - Enable for 10% of users
   - Monitor for 24 hours
   - Increase to 50%
   - Monitor for 24 hours
   - Enable for all users

4. **Phase 4**: Cleanup
   - Remove old auth code
   - Update documentation
   - Archive migration scripts

---

## Conclusion

This architecture provides:

- ✅ Centralized authentication
- ✅ Single sign-on across products
- ✅ Flexible access control:
  - Experience Platform: Always accessible
  - Customer Portal UI: Controlled by `portal_enable` flag
  - API Access: Always accessible (for third-party integrations)
- ✅ Secure token handling
- ✅ Scalable design
- ✅ Easy rollback capability
- ✅ Supports both UI-based and API-only clients

### Access Summary

| Access Type         | Requirement                                  | Controlled By                                  |
| ------------------- | -------------------------------------------- | ---------------------------------------------- |
| Experience Platform | Active subscription                          | Always allowed for org_admin/org_user          |
| Customer Portal UI  | Active subscription + `portal_enable = true` | `portal_enable` flag in subscription           |
| API Access          | Active subscription                          | Always allowed (regardless of `portal_enable`) |

**Use Cases**:

- **Client with own app** (`portal_enable = false`): Uses APIs only, no Customer Portal UI
- **Client without own app** (`portal_enable = true`): Uses both APIs and Customer Portal UI

### API AS A Service - Complete Flow Summary

**Subscription**:

- Only `org_admin` can subscribe to "API AS A Service" plans
- `org_user` cannot subscribe directly
- Subscription created at organization level

**Account Activation** (org_admin):

1. Receives activation email
2. Creates password via SSO
3. Firebase account automatically created
4. Firebase UID and IdToken stored in database
5. If subscription exists → Python API called with:
   - Firebase UID
   - Plan details (trial/purchased)
   - Credits allocation
6. Python team manages credits for this Firebase UID

**API_KEY Management**:

- Python team generates API_KEY
- Provided to NestJS backend
- Stored encrypted in `tenant.api_key_encrypted`
- Only `org_admin` can retrieve API_KEY
- Used to authenticate with Python APIs:
  - CAD Table Extraction
  - CAD Checklist Extraction
  - Invoice Extraction

**API Access**:

- `org_admin`: Can retrieve API_KEY and use Python APIs
- `org_user`: Cannot access API_KEY directly (must go through org_admin or use shared API_KEY)
- All API calls consume credits managed by Python team (using Firebase UID)

The migration is designed to be:

- **Safe**: Can disable instantly if needed
- **Gradual**: Can roll out slowly
- **Testable**: Each phase can be tested independently
- **Reversible**: Can rollback at any point

# API AS A Service - Complete Integration Guide

## Overview

"API AS A Service" is a product that provides Python APIs (CAD Table, CAD Checklist, Invoice Extraction) for organizations. This document outlines the complete integration flow including subscription, Firebase integration, credits management, and API_KEY distribution.

---

## 1. Subscription Rules

### Who Can Subscribe

- ✅ **org_admin**: Can subscribe to "API AS A Service" plans
- ❌ **org_user**: Cannot subscribe directly
- ✅ **product_admin**: Can create subscriptions for organizations (admin function)

### Subscription Process

1. **During Onboarding** (Step 5 - Services selection):
   - `org_admin` selects "API AS A Service" product
   - Chooses plan (trial or purchased)
   - Optionally enables Customer Portal UI (`portal_enable` checkbox)
   - Subscription created in `tenant_product_subscriptions` table

2. **Manual Signup**:
   - `org_admin` signs up manually
   - Can subscribe to "API AS A Service" after account activation
   - Subscription created via Experience API

---

## 2. Account Activation & Firebase Integration

### Flow When org_admin Activates Account

```
Step 1: Org Admin Receives Activation Email
  ↓
Step 2: Clicks Activation Link
  ↓
Step 3: Creates Password (POST /auth/create-password)
  ↓
Step 4: SSO API Processes Activation
  ├─ Validates activation token
  ├─ Hashes password
  ├─ Activates user account
  └─ Creates Firebase account
  ↓
Step 5: Firebase Account Created
  ├─ Firebase UID generated
  ├─ IdToken obtained
  └─ Stored in user_account table:
     - firebase_uid
     - firebase_id_token
     - firebase_id_token_expires_at
  ↓
Step 6: Check Subscription
  ├─ If org_admin has "API AS A Service" subscription
  └─ Call Python API to register user
  ↓
Step 7: Python API Registration
  POST /api/user/register
  {
    firebase_uid: "firebase-uid-123",
    plan_details: {
      type: "trial" | "purchased",
      plan_code: "api-as-a-service-trial-monthly",
      subscription_id: "sub-123"
    },
    credits: {
      initial: 1000,
      limit: 10000,
      rate_limit: 100
    }
  }
  ↓
Step 8: Python API Response
  {
    success: true,
    firebase_uid: "firebase-uid-123",
    credits_allocated: true
  }
```

### Database Updates

**user_account table**:
```sql
UPDATE user_account SET
  firebase_uid = 'firebase-uid-123',
  firebase_id_token = 'id-token-xyz',
  firebase_id_token_expires_at = NOW() + INTERVAL '1 hour',
  status = 'active',
  password_hash = 'bcrypt-hash',
  activation_token = NULL
WHERE id = 'user-uuid';
```

---

## 3. Python API Integration

### Credits Management

**Python Team Responsibilities**:
- Manages all credits for users
- Uses Firebase UID as unique identifier
- Allocates credits based on subscription plan
- Tracks API usage and deducts credits
- Provides credit balance via API

**NestJS Backend Responsibilities**:
- Creates Firebase account when org_admin activates
- Calls Python API with Firebase UID, plan details, and credits
- Stores Firebase UID and IdToken in database
- Refreshes IdToken when expired

### Python API Endpoints Used

1. **User Registration** (called after account activation):
   ```
   POST /api/user/register
   {
     firebase_uid: string,
     plan_details: {
       type: "trial" | "purchased",
       plan_code: string,
       subscription_id: string
     },
     credits: {
       initial: number,
       limit: number,
       rate_limit: number
     }
   }
   ```

2. **Credits Check** (optional, for dashboard):
   ```
   GET /api/credits
   Authorization: Bearer <Firebase_IdToken>
   ```

---

## 4. API_KEY Management

### API_KEY Generation & Storage

**Flow**:
1. Python team generates API_KEY
2. Provides API_KEY to NestJS backend (Experience API)
3. Backend encrypts and stores in `tenant.api_key_encrypted`
4. API_KEY is enabled for organizations with "API AS A Service" subscription

### Database Schema

**tenant table** (add if not exists):
```sql
ALTER TABLE tenant 
ADD COLUMN api_key_encrypted TEXT;

-- Index for faster lookups
CREATE INDEX idx_tenant_api_key ON tenant(api_key_encrypted) 
WHERE api_key_encrypted IS NOT NULL;
```

### API_KEY Access

**Endpoints**:
```
GET  /tenants/me/api-key
  - Requires: org_admin role
  - Returns: { api_key: "decrypted-key" }
  - Decrypts and returns API_KEY

POST /admin/tenants/:id/api-key
  - Requires: product_admin role
  - Body: { api_key: "key-to-store" }
  - Encrypts and stores API_KEY
```

**Access Rules**:
- ✅ **org_admin**: Can retrieve API_KEY
- ❌ **org_user**: Cannot access API_KEY directly
- ✅ **product_admin**: Can set API_KEY for any organization

### API_KEY Usage

**Python APIs Require API_KEY**:
```
POST /api/cad-table/extract
  Authorization: <API_KEY>
  Body: { file: <file>, ... }

POST /api/cad-checklist/extract
  Authorization: <API_KEY>
  Body: { file: <file>, ... }

POST /api/invoice/extract
  Authorization: <API_KEY>
  Body: { file: <file>, ... }
```

**How org_admin Uses API_KEY**:
1. Logs in via SSO
2. Calls `GET /tenants/me/api-key` (requires org_admin role)
3. Receives decrypted API_KEY
4. Uses API_KEY in Authorization header for Python API calls
5. Python APIs authenticate and process requests
6. Credits are deducted based on Firebase UID

---

## 5. Complete User Journey

### Scenario 1: New Organization Onboarding

```
1. Product Admin creates organization
   ↓
2. Org Admin receives invitation email
   ↓
3. Org Admin activates account (creates password)
   ↓
4. Firebase account created automatically
   ↓
5. Subscription created for "API AS A Service"
   ↓
6. Python API called with Firebase UID + plan details
   ↓
7. Credits allocated by Python team
   ↓
8. API_KEY provided by Python team
   ↓
9. API_KEY stored encrypted in tenant table
   ↓
10. Org Admin can retrieve API_KEY and use Python APIs
```

### Scenario 2: Existing Organization Adds API AS A Service

```
1. Org Admin subscribes to "API AS A Service" plan
   ↓
2. If org_admin account already activated:
   - Firebase account already exists
   - Python API called with existing Firebase UID
   - Credits allocated based on new plan
   ↓
3. API_KEY provided by Python team
   ↓
4. API_KEY stored encrypted in tenant table
   ↓
5. Org Admin can retrieve API_KEY and use Python APIs
```

---

## 6. Implementation Checklist

### Backend (SSO API)

- [ ] Update `createPassword()` method to:
  - Create Firebase account if not exists
  - Get Firebase UID and IdToken
  - Store in `user_account` table
  - Check if org_admin has "API AS A Service" subscription
  - Call Python API `/api/user/register` with:
    - Firebase UID
    - Plan details (from subscription)
    - Credits allocation

### Backend (Experience API)

- [ ] Add API_KEY management endpoints:
  - `GET /tenants/me/api-key` (org_admin only)
  - `POST /admin/tenants/:id/api-key` (product_admin only)
- [ ] Add `api_key_encrypted` field to tenant table
- [ ] Implement encryption/decryption for API_KEY
- [ ] Add validation: Only org_admin can retrieve API_KEY

### Database

- [ ] Add `api_key_encrypted` column to `tenant` table
- [ ] Create index on `api_key_encrypted`
- [ ] Verify `firebase_uid`, `firebase_id_token` fields exist in `user_account` table

### Python API Integration

- [ ] Implement `/api/user/register` endpoint
- [ ] Accept Firebase UID, plan details, credits
- [ ] Store user registration with Firebase UID
- [ ] Allocate credits based on plan
- [ ] Return success response

### Subscription Validation

- [ ] Ensure only org_admin can subscribe to "API AS A Service"
- [ ] Validate subscription exists before calling Python API
- [ ] Handle subscription status (trial, active, canceled)

---

## 7. Error Handling

### Firebase Account Creation Fails

- Log error but don't fail account activation
- Retry Firebase creation in background job
- User can still activate account

### Python API Call Fails

- Log error
- Retry in background job
- User account is still activated
- Credits allocation happens asynchronously

### API_KEY Not Available

- Return clear error: "API_KEY not configured for your organization. Please contact support."
- Only show to org_admin
- Log for monitoring

---

## 8. Security Considerations

### API_KEY Security

1. **Storage**:
   - Always encrypt before storing
   - Use strong encryption key (ENCRYPTION_KEY env var)
   - Never log API_KEY in plain text

2. **Access Control**:
   - Only org_admin can retrieve
   - Validate role before returning API_KEY
   - Audit all API_KEY access

3. **Transmission**:
   - Use HTTPS only
   - Return API_KEY only in response body (not in logs)
   - Consider rate limiting API_KEY retrieval

### Firebase Security

1. **Token Management**:
   - Store IdToken securely
   - Refresh before expiration
   - Never expose in logs

2. **UID Validation**:
   - Always validate Firebase UID exists
   - Check user account is active
   - Verify subscription is active

---

## 9. Testing Scenarios

### Test Case 1: New Org Admin Activation
- [ ] Org admin activates account
- [ ] Firebase account created
- [ ] Firebase UID stored in database
- [ ] Python API called with correct data
- [ ] Credits allocated

### Test Case 2: API_KEY Retrieval
- [ ] Org admin retrieves API_KEY
- [ ] API_KEY is decrypted correctly
- [ ] Org user cannot retrieve API_KEY
- [ ] API_KEY works with Python APIs

### Test Case 3: Subscription Validation
- [ ] Only org_admin can subscribe
- [ ] org_user cannot subscribe
- [ ] Subscription status checked correctly

### Test Case 4: Python API Integration
- [ ] User registration call succeeds
- [ ] Credits allocated correctly
- [ ] Firebase UID used for credit tracking

---

## 10. Summary

### Key Points

1. **Subscription**: Only org_admin can subscribe to "API AS A Service"
2. **Firebase**: Created automatically when org_admin activates account
3. **Python API**: Called with Firebase UID, plan details, and credits
4. **Credits**: Managed by Python team using Firebase UID
5. **API_KEY**: Generated by Python team, stored encrypted, only org_admin can retrieve
6. **API Access**: org_admin and org_user can use Python APIs (with API_KEY from org_admin)

### Data Flow

```
Org Admin Activation
  → Firebase Account Created
  → Python API Registration (if subscription exists)
  → Credits Allocated
  → API_KEY Provided
  → API_KEY Stored Encrypted
  → Org Admin Retrieves API_KEY
  → Uses API_KEY for Python API Calls
```

---

**Last Updated**: [Current Date]  
**Status**: Ready for Implementation


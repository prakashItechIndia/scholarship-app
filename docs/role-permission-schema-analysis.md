# Role & Permission Schema Analysis

## Executive Summary

This document analyzes the current database schema against the BRD requirements for role and permission management. The analysis identifies gaps and proposes required database schema changes.

---

## 1. Current Database Schema

### 1.1 Existing Tables (SQL Server)

#### T_ROLES
- **Id** (int, PK)
- **Role_Name** (nvarchar(50))
- **Is_Active** (bit)
- **Is_Deleted** (bit)

#### T_ROLES_PRIVILEGE
- **Id** (int, PK)
- **Roles_Id** (int, FK → T_ROLES.Id)
- **Screens_Id** (int, FK → T_SCREENS.Id)
- **Is_Active** (bit)

#### T_SCREENS
- **Id** (int, PK)
- **Screen_Name** (nvarchar)
- **URL** (nvarchar)
- **Is_Active** (bit)
- **Is_Deleted** (bit)

#### T_USER_ROLES_ASSIGN
- **Id** (int, PK)
- **Roles_Id** (int, FK → T_ROLES.Id)
- **User_Id** (int, FK → T_USERS.Id)
- **Is_Active** (bit)

---

## 2. BRD Requirements

### 2.1 Permission Model
- **Granularity**: Module + Action level
- **Actions**: Create, View, Update, Delete
- **Modules** (from BRD):
  1. Overview
  2. Documents (Upload)
  3. Verify
  4. Suggest
  5. Approve
  6. Issue Amount
  7. Reports
  8. User Management
  9. Role Management
  10. Print Approval Form

### 2.2 Role Requirements
- Each role must have at least one permission
- Role name must be unique
- Inactive roles cannot be assigned to users
- Roles assigned to users cannot be deleted

### 2.3 User Requirements
- Each user is mapped to exactly one role
- User access is determined by assigned role
- Permissions enforced at both UI and API levels

---

## 3. Gap Analysis

### 3.1 Current Schema Capabilities

✅ **Supported:**
- Role definition (T_ROLES)
- Role-to-User assignment (T_USER_ROLES_ASSIGN)
- Screen-level permissions (T_ROLES_PRIVILEGE → T_SCREENS)
- Role activation/deactivation (Is_Active flags)

❌ **Not Supported:**
- **Action-level permissions** (Create, View, Update, Delete)
- **Module-to-Screen mapping** (no explicit module concept)
- **Granular permission control** (only screen access, not actions)

### 3.2 Critical Gaps

#### Gap 1: Missing Action Columns
**Current State:**
- `T_ROLES_PRIVILEGE` only links Roles to Screens
- No way to specify which actions (Create/View/Update/Delete) are allowed

**BRD Requirement:**
- Each module must support independent action permissions
- Example: A role can have "View" access to "Overview" but not "Create" or "Update"

**Impact:** **CRITICAL** - Cannot implement BRD requirements without this

#### Gap 2: Module Concept
**Current State:**
- System uses "Screens" (T_SCREENS) which may map to modules
- No explicit module definition or module-to-screen mapping

**BRD Requirement:**
- Permissions are defined at Module level
- Modules: Overview, Documents, Verify, Suggest, Approve, Issue Amount, Reports, User Management, Role Management, Print Approval Form

**Impact:** **HIGH** - Need to establish module-to-screen mapping or add module concept

---

## 4. Required Database Schema Changes

### 4.1 Option 1: Extend T_ROLES_PRIVILEGE (Recommended)

Add action columns to `T_ROLES_PRIVILEGE` table:

```sql
ALTER TABLE T_ROLES_PRIVILEGE
ADD Can_Create bit NOT NULL DEFAULT 0,
    Can_View bit NOT NULL DEFAULT 0,
    Can_Update bit NOT NULL DEFAULT 0,
    Can_Delete bit NOT NULL DEFAULT 0;
```

**Pros:**
- Minimal schema changes
- Reuses existing table structure
- Maintains backward compatibility (defaults to 0)
- Simple to query and maintain

**Cons:**
- Assumes Screens map to Modules (may need validation)
- Requires data migration for existing records

**Migration Strategy:**
- Set all action flags to 1 for existing active permissions (maintain current behavior)
- Or set only Can_View = 1 for existing permissions (more restrictive)

### 4.2 Option 2: Add Module Column to T_SCREENS

Add module mapping to screens:

```sql
ALTER TABLE T_SCREENS
ADD Module_Name nvarchar(100) NULL;
```

**Pros:**
- Explicit module-to-screen mapping
- Supports multiple screens per module
- Clearer data model

**Cons:**
- Requires updating all existing screen records
- Need to define module names for each screen

### 4.3 Option 3: Create T_MODULES Table (Alternative)

Create a separate modules table and link screens to modules:

```sql
CREATE TABLE T_MODULES (
    Id int PRIMARY KEY IDENTITY(1,1),
    Module_Name nvarchar(100) NOT NULL UNIQUE,
    Description nvarchar(500),
    Is_Active bit NOT NULL DEFAULT 1,
    Is_Deleted bit NOT NULL DEFAULT 0
);

ALTER TABLE T_SCREENS
ADD Module_Id int NULL FOREIGN KEY REFERENCES T_MODULES(Id);
```

**Pros:**
- Most normalized approach
- Supports module metadata
- Easier to add new modules

**Cons:**
- More complex schema
- Requires more migration work
- May be overkill if modules map 1:1 with screens

---

## 5. Recommended Solution

### 5.1 Primary Recommendation: Option 1 + Option 2 (Hybrid)

**Step 1:** Add action columns to `T_ROLES_PRIVILEGE`
```sql
ALTER TABLE T_ROLES_PRIVILEGE
ADD Can_Create bit NOT NULL DEFAULT 0,
    Can_View bit NOT NULL DEFAULT 0,
    Can_Update bit NOT NULL DEFAULT 0,
    Can_Delete bit NOT NULL DEFAULT 0;
```

**Step 2:** Add module column to `T_SCREENS` for explicit mapping
```sql
ALTER TABLE T_SCREENS
ADD Module_Name nvarchar(100) NULL;
```

**Step 3:** Populate Module_Name for existing screens based on BRD modules

**Rationale:**
- Minimal schema changes
- Supports both screen-level and module-level permissions
- Maintains backward compatibility
- Clear module-to-screen mapping

### 5.2 Updated Table Structures

#### T_ROLES_PRIVILEGE (Updated)
- **Id** (int, PK)
- **Roles_Id** (int, FK)
- **Screens_Id** (int, FK)
- **Can_Create** (bit) ← **NEW**
- **Can_View** (bit) ← **NEW**
- **Can_Update** (bit) ← **NEW**
- **Can_Delete** (bit) ← **NEW**
- **Is_Active** (bit)

#### T_SCREENS (Updated)
- **Id** (int, PK)
- **Screen_Name** (nvarchar)
- **URL** (nvarchar)
- **Module_Name** (nvarchar(100)) ← **NEW**
- **Is_Active** (bit)
- **Is_Deleted** (bit)

---

## 6. Data Migration Plan

### 6.1 For Existing T_ROLES_PRIVILEGE Records

**Option A: Preserve Current Behavior (All Actions Enabled)**
```sql
UPDATE T_ROLES_PRIVILEGE
SET Can_Create = 1,
    Can_View = 1,
    Can_Update = 1,
    Can_Delete = 1
WHERE Is_Active = 1;
```

**Option B: Conservative Approach (View Only)**
```sql
UPDATE T_ROLES_PRIVILEGE
SET Can_View = 1
WHERE Is_Active = 1;
-- Can_Create, Can_Update, Can_Delete remain 0
```

**Recommendation:** Use Option A to maintain current functionality, then refine permissions per BRD.

### 6.2 For T_SCREENS Module_Name Population

Map existing screens to BRD modules:
- Review all screens in T_SCREENS
- Map each screen to one of the 10 BRD modules
- Update Module_Name column accordingly

---

## 7. Implementation Considerations

### 7.1 API Changes Required

1. **Update RolePermissionsService:**
   - Modify `getRolePermissions()` to return action flags
   - Update `updateRolePermissions()` to accept action parameters
   - Add `hasActionPermission(userId, module, action)` method

2. **New Permission Check Methods:**
   ```typescript
   hasPermission(userId: number, module: string, action: 'create' | 'view' | 'update' | 'delete'): Promise<boolean>
   ```

### 7.2 Frontend Changes Required

1. **Update Permission Context:**
   - Extend permission checks to include action level
   - Update UI components to check specific actions

2. **Role Form Updates:**
   - Already supports action-level permissions in UI
   - Need to sync with backend API changes

### 7.3 Validation Rules

1. **At least one action must be enabled** per role-permission entry
2. **Module_Name must match BRD module names** (validation)
3. **Inactive roles cannot be assigned** (existing rule, enforce at API level)

---

## 8. Summary

### 8.1 Schema Changes Required

| Table | Change Type | Columns Added | Impact |
|-------|-------------|---------------|--------|
| T_ROLES_PRIVILEGE | ALTER | Can_Create, Can_View, Can_Update, Can_Delete | **CRITICAL** |
| T_SCREENS | ALTER | Module_Name | **HIGH** |

### 8.2 Migration Complexity

- **Schema Changes:** Low (2 ALTER statements)
- **Data Migration:** Medium (populate action flags and module names)
- **Code Changes:** Medium (update services and APIs)
- **Testing:** High (comprehensive permission testing required)

### 8.3 Risk Assessment

- **Low Risk:** Schema changes are additive (new columns with defaults)
- **Medium Risk:** Data migration requires careful validation
- **High Risk:** Permission logic changes affect security - thorough testing required

---

## 9. Next Steps

1. ✅ **Review and approve** this analysis document
2. ⏳ **Create migration scripts** for schema changes
3. ⏳ **Develop data migration plan** for existing records
4. ⏳ **Update backend services** to support action-level permissions
5. ⏳ **Update frontend** to use new permission model
6. ⏳ **Comprehensive testing** of permission enforcement
7. ⏳ **Documentation** of new permission model

---

**Document Version:** 1.0  
**Date:** 2025-01-24  
**Status:** Analysis Complete - Awaiting Approval


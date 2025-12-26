# Roles & Permissions – Leo Muthu Scholarship Admin Portal

This document defines **system roles, responsibilities, and permissions** as derived from the approved BRD.  
Role-Based Access Control (RBAC) is enforced at both **UI and API levels**.

---

## 1. Role-Based Access Control (RBAC) Overview

- Access to the system is controlled by **Roles**
- Each role is mapped to a **User Type**
- Permissions are granted at **Module + Action** level
- Actions supported:
  - **Create**
  - **View**
  - **Update**
  - **Delete**
- Inactive roles cannot be assigned to users
- Permissions determine **what data is visible** and **what actions are allowed**

---

## 2. System User Roles

### 2.1 Super Admin CEO

**User Type:** Administrator  
**Status:** Active  
**Description:**  
Highest authority role intended for CEO / Foundation Leadership with full visibility and control over the system.

**Responsibilities:**
- Overall governance of the scholarship program
- Final oversight on approvals and fund disbursement
- Monitoring reports, audits, and system performance

**Permissions:**
- Full access across all modules
- Can manage users and roles
- Can generate and export all reports
- Can view and modify all applications at every stage

---

### 2.2 Super Admin

**User Type:** Administrator  
**Status:** Active  
**Description:**  
System-level administrator responsible for configuration and access control.

**Responsibilities:**
- User and role administration
- System configuration and maintenance
- Ensuring RBAC policies are enforced

**Permissions:**
- Full CRUD access to:
  - Role Management
  - User Management
- View access to all Process modules
- Report generation access
- No mandatory involvement in scholarship decision-making

---

### 2.3 Manager – Scholarship Admin

**User Type:** Manager  
**Status:** Active  
**Description:**  
Senior operational role overseeing the complete scholarship workflow.

**Responsibilities:**
- Supervising application processing
- Monitoring document verification and suggestions
- Ensuring SLA compliance

**Permissions:**
- Full access to:
  - Overview
  - Documents (Upload)
  - Suggest
  - Approve
- View and generate reports
- Limited user profile viewing
- No role creation or deletion rights

---

### 2.4 Manager – Scholarship Processor

**User Type:** Manager  
**Status:** Active  
**Description:**  
Operational manager handling verification and preparation of applications.

**Responsibilities:**
- Document verification
- Status updates (Verified / Recheck / Reject)
- Preparing applications for approval

**Permissions:**
- View access to Overview
- Update access to:
  - Documents
  - Verify
  - Suggest
- View-only access to Reports
- No approval or issuance rights

---

### 2.5 Standard User / Reception

**User Type:** Standard User  
**Status:** Active / Inactive  
**Description:**  
Front-desk or entry-level staff handling initial intake.

**Responsibilities:**
- Initial application registration support
- Document collection and upload
- Basic status inquiries

**Permissions:**
- Create and Update access to:
  - Documents (Upload only)
- View access to:
  - Overview (limited fields)
- No access to:
  - Verify
  - Suggest
  - Approve
  - Issue Amount
  - Reports

---

## 3. Module-wise Permission Matrix

| Module / Action        | Create | View | Update | Delete |
|------------------------|--------|------|--------|--------|
| Overview               | ✓      | ✓    | ✓      | ✓      |
| Documents (Upload)     | ✓      | ✓    | ✓      | ✓      |
| Verify                 | ✓      | ✓    | ✓      | ✓      |
| Suggest                | ✓      | ✓    | ✓      | ✓      |
| Approve                | ✓      | ✓    | ✓      | ✓      |
| Issue Amount           | ✓      | ✓    | ✓      | ✓      |
| Reports                | ✓      | ✓    | ✓      | ✓      |
| User Management        | ✓      | ✓    | ✓      | ✓      |
| Role Management        | ✓      | ✓    | ✓      | ✓      |
| Print Approval Form    | ✓      | ✓    | ✓      | ✓      |

> Actual access is **role-dependent**. Not all roles receive all permissions.

---

## 4. Role Management Rules

- Role name must be **unique**
- At least **one permission** is mandatory per role
- Roles assigned to users **cannot be deleted**
- Inactive roles:
  - Cannot be assigned
  - Existing users retain audit history

---

## 5. User Management Rules

- Each user is mapped to **exactly one role**
- Email ID must be **unique**
- Role determines:
  - Visible tabs
  - Allowed actions
  - Accessible data scope
- Deactivated users:
  - Cannot log in
  - Remain in system for audit and reporting

---

## 6. Security Enforcement

- RBAC enforced at:
  - UI level (visibility & controls)
  - API level (authorization checks)
- All permission-based actions are:
  - Logged in Audit Trail
  - Tagged with User ID and Timestamp

---

## 7. Audit & Compliance

- Role changes are audited
- User role reassignment is logged
- Permission changes require Administrator access
- No hard deletion of audit-sensitive entities

---

**End of Roles & Permissions Specification**

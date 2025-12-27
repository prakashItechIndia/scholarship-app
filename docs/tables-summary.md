# Database Tables Summary for Login & Social Login

## Total Tables Needed: **1 Table**

### Table: `T_LoginLog`

**Purpose**: Track all login events (manual and social logins)

**Location**: SQL Server (same database as `Tbl_UserMaster`)

**Columns (Keys)**:

| Column Name | Type | Nullable | Description |
|------------|------|----------|-------------|
| `Id` | INT IDENTITY(1,1) | NO | **Primary Key** - Auto-increment |
| `User_ID` | NVARCHAR(250) | YES | Links to `Tbl_UserMaster.User_ID` (email) |
| `User_Name` | NVARCHAR(50) | YES | User name from `Tbl_UserMaster` |
| `Login_Type` | NVARCHAR(50) | NO | 'Manual', 'Microsoft', 'Google', 'Apple' |
| `Status` | NVARCHAR(20) | NO | 'Success' or 'Failed' |
| `IP_Address` | NVARCHAR(50) | YES | Source IP address |
| `User_Agent` | NVARCHAR(500) | YES | Browser/device information |
| `Error_Message` | NVARCHAR(500) | YES | Error message for failed logins |
| `Login_Date` | DATETIME | NO | Login timestamp (default: GETDATE()) |
| `Created_Date` | DATETIME | NO | Record creation date (default: GETDATE()) |

**Indexes**:
- `IX_T_LoginLog_User_ID` - For faster user lookups
- `IX_T_LoginLog_Login_Date` - For date range queries
- `IX_T_LoginLog_Status` - For filtering successful/failed logins

**Relationships**:
- `User_ID` → `Tbl_UserMaster.User_ID` (logical foreign key, not enforced)

---

## Why Only 1 Table?

### ✅ We DON'T need to modify existing tables:

1. **`Tbl_UserMaster`** - Already has all needed fields:
   - `User_ID` (email) - used for both manual and social login users
   - `Password` - for manual login users (NULL for social-only users)
   - `IsActive`, `IsDeleted` - account status
   - No need to add OAuth provider columns

2. **`t_Registration`** - Already used for student registration
   - Social login users can still register via this table
   - Email links them to `Tbl_UserMaster`

### ✅ We DON'T need separate tables for:

1. **OAuth Provider Mappings** - Not needed because:
   - Social login users are identified by email (same as manual users)
   - Email from OAuth provider becomes `User_ID` in `Tbl_UserMaster`
   - Login type is tracked in `T_LoginLog.Login_Type`

2. **OAuth Tokens** - Not stored because:
   - OAuth tokens are short-lived (exchanged immediately)
   - We use session tokens (stored in localStorage/sessionStorage)
   - No need to persist OAuth tokens in database

---

## Table Creation

The `T_LoginLog` table is created **automatically** on first use (inline creation pattern, same as `T_EmailVerification`).

**Manual creation (optional)**:
```sql
-- Run this script if you want to create the table manually
database/sqlserver/03_create_login_log_table.sql
```

---

## Usage Examples

### Manual Login
```typescript
await authService.logLoginEvent({
  userId: 'user@example.com',
  userName: 'John Doe',
  loginType: 'Manual',
  status: 'Success',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...'
});
```

### Social Login (Microsoft/Google/Apple)
```typescript
await authService.logLoginEvent({
  userId: 'user@example.com',
  userName: 'John Doe',
  loginType: 'Microsoft', // or 'Google', 'Apple'
  status: 'Success',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...'
});
```

---

## Summary

- **Total Tables**: 1 (`T_LoginLog`)
- **Total Columns**: 10 (including primary key)
- **Indexes**: 3
- **Foreign Keys**: 0 (logical relationship only)
- **Auto-created**: Yes (on first use)

This follows the same pattern as `T_EmailVerification` table used for email verification during onboarding.


# Login Logging Documentation

## Overview

Login events are now tracked in the SQL Server database table `TBL_LOGIN_LOG`. This table stores both successful and failed login attempts for manual and social logins (Microsoft, Google, Apple).

## Database Table: T_LoginLog

### Table Structure

Follows the same pattern as `T_EmailVerification` table (created inline if not exists).

```sql
CREATE TABLE [dbo].[T_LoginLog] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [User_ID] NVARCHAR(250) NULL,                    -- User_ID from Tbl_UserMaster
    [User_Name] NVARCHAR(50) NULL,                   -- User_Name from Tbl_UserMaster
    [Login_Type] NVARCHAR(50) NOT NULL,              -- 'Manual', 'Microsoft', 'Google', 'Apple'
    [Status] NVARCHAR(20) NOT NULL,                  -- 'Success', 'Failed'
    [IP_Address] NVARCHAR(50) NULL,                   -- Source IP address
    [User_Agent] NVARCHAR(500) NULL,                 -- Browser/device information
    [Error_Message] NVARCHAR(500) NULL,              -- Error message for failed logins
    [Login_Date] DATETIME NOT NULL DEFAULT GETDATE(), -- Login timestamp
    [Created_Date] DATETIME NOT NULL DEFAULT GETDATE()
);
```

### Indexes

- `IX_TBL_LOGIN_LOG_User_ID` - For faster user lookups
- `IX_TBL_LOGIN_LOG_Login_Date` - For date range queries
- `IX_TBL_LOGIN_LOG_Status` - For filtering by success/failure

## SQL Queries

### View All Login Logs

```sql
SELECT 
    Id,
    User_ID,
    User_Name,
    Login_Type,
    Status,
    IP_Address,
    User_Agent,
    Error_Message,
    Login_Date
FROM T_LoginLog
ORDER BY Login_Date DESC;
```

### View Successful Logins Only

```sql
SELECT 
    Id,
    User_ID,
    User_Name,
    Login_Type,
    IP_Address,
    User_Agent,
    Login_Date
FROM T_LoginLog
WHERE Status = 'Success'
ORDER BY Login_Date DESC;
```

### View Failed Login Attempts

```sql
SELECT 
    Id,
    User_ID,
    Login_Type,
    IP_Address,
    Error_Message,
    Login_Date
FROM T_LoginLog
WHERE Status = 'Failed'
ORDER BY Login_Date DESC;
```

### View Login History for a Specific User

```sql
SELECT 
    Login_Type,
    Status,
    IP_Address,
    User_Agent,
    Error_Message,
    Login_Date
FROM T_LoginLog
WHERE User_ID = 'user@example.com'
ORDER BY Login_Date DESC;
```

### View Logins by Type (Manual vs Social)

```sql
SELECT 
    Login_Type,
    Status,
    COUNT(*) as Count
FROM T_LoginLog
GROUP BY Login_Type, Status
ORDER BY Login_Type, Status;
```

### View Recent Logins (Last 24 Hours)

```sql
SELECT 
    User_ID,
    User_Name,
    Login_Type,
    Status,
    IP_Address,
    Login_Date
FROM T_LoginLog
WHERE Login_Date >= DATEADD(HOUR, -24, GETDATE())
ORDER BY Login_Date DESC;
```

### View Failed Login Attempts by IP Address

```sql
SELECT 
    IP_Address,
    COUNT(*) as Failed_Attempts,
    MIN(Login_Date) as First_Attempt,
    MAX(Login_Date) as Last_Attempt
FROM T_LoginLog
WHERE Status = 'Failed'
GROUP BY IP_Address
HAVING COUNT(*) > 1
ORDER BY Failed_Attempts DESC;
```

### View Login Statistics by Date

```sql
SELECT 
    CAST(Login_Date AS DATE) as Login_Date,
    Login_Type,
    Status,
    COUNT(*) as Count
FROM T_LoginLog
WHERE Login_Date >= DATEADD(DAY, -30, GETDATE())
GROUP BY CAST(Login_Date AS DATE), Login_Type, Status
ORDER BY Login_Date DESC, Login_Type, Status;
```

## Integration with Code

### Manual Login Logging

Login events are automatically logged in:
- `ScholarshipAuthController.login()` - Logs both successful and failed manual logins

### Social Login Logging

When implementing social login endpoints, use the same logging method:

```typescript
// In your social login handler
await this.authService.logLoginEvent({
  userId: userEmail,
  userName: userName,
  loginType: 'Microsoft', // or 'Google', 'Apple'
  status: 'Success',
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});
```

## Notes

1. **Tbl_UserMaster** is for user master data, not login logs
2. **T_LoginLog** is specifically for tracking login events (follows same pattern as `T_EmailVerification`)
3. Table is created automatically on first use (inline creation pattern)
4. Logging is non-blocking - if logging fails, it won't break the login flow
5. Both successful and failed login attempts are logged
6. Social login types are tracked separately from manual logins

## Setup

The table is created automatically when the first login event is logged. However, you can also run the SQL script manually:

```bash
# Execute the SQL script in your SQL Server database (optional - table auto-creates)
database/sqlserver/03_create_login_log_table.sql
```


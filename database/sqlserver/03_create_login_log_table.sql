-- Create T_LoginLog table for tracking login events in SQL Server
-- This table stores both successful and failed login attempts
-- Follows the same pattern as T_EmailVerification table

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[T_LoginLog]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[T_LoginLog] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [User_ID] NVARCHAR(250) NULL,                    -- User_ID from Tbl_UserMaster (can be NULL for failed logins)
        [User_Name] NVARCHAR(50) NULL,                   -- User_Name from Tbl_UserMaster
        [Login_Type] NVARCHAR(50) NOT NULL,              -- 'Manual', 'Microsoft', 'Google', 'Apple'
        [Status] NVARCHAR(20) NOT NULL,                  -- 'Success', 'Failed'
        [IP_Address] NVARCHAR(50) NULL,                  -- Source IP address
        [User_Agent] NVARCHAR(500) NULL,                 -- Browser/device information
        [Error_Message] NVARCHAR(500) NULL,             -- Error message for failed logins
        [Login_Date] DATETIME NOT NULL DEFAULT GETDATE(), -- Login timestamp
        [Created_Date] DATETIME NOT NULL DEFAULT GETDATE()
    );

    -- Create index on User_ID for faster lookups
    CREATE INDEX [IX_T_LoginLog_User_ID] ON [dbo].[T_LoginLog] ([User_ID]);
    
    -- Create index on Login_Date for date range queries
    CREATE INDEX [IX_T_LoginLog_Login_Date] ON [dbo].[T_LoginLog] ([Login_Date]);
    
    -- Create index on Status for filtering successful/failed logins
    CREATE INDEX [IX_T_LoginLog_Status] ON [dbo].[T_LoginLog] ([Status]);

    PRINT 'T_LoginLog table created successfully';
END
ELSE
BEGIN
    PRINT 'T_LoginLog table already exists';
END
GO


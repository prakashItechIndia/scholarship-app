-- ============================================================================
-- Schema Update: Role & Permission Management (Beekeeper Compatible)
-- ============================================================================

/* ============================================================================
   STEP 1: Add permission columns
   ============================================================================ */

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('T_ROLES_PRIVILEGE') AND name = 'Can_Create'
)
BEGIN
    ALTER TABLE T_ROLES_PRIVILEGE ADD Can_Create bit NOT NULL DEFAULT 0;
END

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('T_ROLES_PRIVILEGE') AND name = 'Can_View'
)
BEGIN
    ALTER TABLE T_ROLES_PRIVILEGE ADD Can_View bit NOT NULL DEFAULT 0;
END

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('T_ROLES_PRIVILEGE') AND name = 'Can_Update'
)
BEGIN
    ALTER TABLE T_ROLES_PRIVILEGE ADD Can_Update bit NOT NULL DEFAULT 0;
END

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('T_ROLES_PRIVILEGE') AND name = 'Can_Delete'
)
BEGIN
    ALTER TABLE T_ROLES_PRIVILEGE ADD Can_Delete bit NOT NULL DEFAULT 0;
END


/* ============================================================================
   STEP 2: Add Module_Name to T_SCREENS
   ============================================================================ */

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('T_SCREENS') AND name = 'Module_Name'
)
BEGIN
    ALTER TABLE T_SCREENS ADD Module_Name nvarchar(100) NULL;
END


/* ============================================================================
   STEP 3: Add User_Type to T_ROLES
   ============================================================================ */

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('T_ROLES') AND name = 'User_Type'
)
BEGIN
    ALTER TABLE T_ROLES ADD User_Type nvarchar(50) NULL;
END


/* ============================================================================
   STEP 4: Migrate existing permissions (DYNAMIC SQL REQUIRED)
   ============================================================================ */

IF EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('T_ROLES_PRIVILEGE') AND name = 'Can_Delete'
)
BEGIN
    EXEC (
        'UPDATE T_ROLES_PRIVILEGE
         SET Can_Create = 1,
             Can_View   = 1,
             Can_Update = 1,
             Can_Delete = 1
         WHERE Is_Active = 1'
    );
END


/* ============================================================================
   STEP 5: Constraints (DYNAMIC SQL REQUIRED)
   ============================================================================ */

-- At least one action must be enabled
IF NOT EXISTS (
    SELECT 1 FROM sys.check_constraints
    WHERE name = 'CK_T_ROLES_PRIVILEGE_AtLeastOneAction'
)
BEGIN
    EXEC (
        'ALTER TABLE T_ROLES_PRIVILEGE
         ADD CONSTRAINT CK_T_ROLES_PRIVILEGE_AtLeastOneAction
         CHECK (
            Can_Create = 1 OR
            Can_View   = 1 OR
            Can_Update = 1 OR
            Can_Delete = 1
         )'
    );
END


-- User_Type validation
IF NOT EXISTS (
    SELECT 1 FROM sys.check_constraints
    WHERE name = 'CK_T_ROLES_UserType'
)
BEGIN
    EXEC (
        'ALTER TABLE T_ROLES
         ADD CONSTRAINT CK_T_ROLES_UserType
         CHECK (
            User_Type IN (''Administrator'', ''Manager'', ''Standard User'')
            OR User_Type IS NULL
         )'
    );
END


PRINT '========================================';
PRINT 'Schema update completed successfully';
PRINT 'Beekeeper compatible – no parse errors';
PRINT '========================================';
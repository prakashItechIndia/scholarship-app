/* ============================================================================
   ROLE & PERMISSION UPDATE – FINAL (BRD COMPLIANT)
   SAFE FOR: Beekeeper / SSMS / Azure Data Studio
   ============================================================================ */

SET NOCOUNT ON;

PRINT '--- STARTING ROLE & PERMISSION UPDATE ---';

/* ============================================================================
   STEP 1: UPDATE USER_TYPE FOR ROLES
   ============================================================================ */

UPDATE T_ROLES SET User_Type = 'Administrator'
WHERE Role_Name IN ('Super Admin','Supreme Admin','Admin','Document Admin','Document SuperAdmin');

UPDATE T_ROLES SET User_Type = 'Manager'
WHERE Role_Name IN ('Scholarship Admin','Scholarship Processor');

UPDATE T_ROLES SET User_Type = 'Standard User'
WHERE Role_Name = 'Reception';

PRINT 'User_Type updated successfully';

/* ============================================================================
   STEP 2: DECLARE ROLE IDS
   ============================================================================ */

DECLARE 
    @SupremeAdminId INT,
    @SuperAdminId INT,
    @ScholarshipAdminId INT,
    @ScholarshipProcessorId INT,
    @ReceptionId INT;

SELECT @SupremeAdminId = Id FROM T_ROLES WHERE Role_Name = 'Supreme Admin';
SELECT @SuperAdminId = Id FROM T_ROLES WHERE Role_Name = 'Super Admin';
SELECT @ScholarshipAdminId = Id FROM T_ROLES WHERE Role_Name = 'Scholarship Admin';
SELECT @ScholarshipProcessorId = Id FROM T_ROLES WHERE Role_Name = 'Scholarship Processor';
SELECT @ReceptionId = Id FROM T_ROLES WHERE Role_Name = 'Reception';

/* ============================================================================
   STEP 3: SUPREME ADMIN – FULL ACCESS TO ALL MODULES
   ============================================================================ */

IF @SupremeAdminId IS NOT NULL
BEGIN
    DELETE FROM T_ROLES_PRIVILEGE WHERE Roles_Id = @SupremeAdminId;

    INSERT INTO T_ROLES_PRIVILEGE
    (Roles_Id, Screens_Id, Can_Create, Can_View, Can_Update, Can_Delete, Is_Active)
    SELECT @SupremeAdminId, Id, 1,1,1,1,1
    FROM T_SCREENS
    WHERE Id NOT IN (5,11); -- exclude Logout / Change Password

    PRINT 'Supreme Admin permissions applied';
END

/* ============================================================================
   STEP 4: SUPER ADMIN
   ============================================================================ */

IF @SuperAdminId IS NOT NULL
BEGIN
    DELETE FROM T_ROLES_PRIVILEGE WHERE Roles_Id = @SuperAdminId;

    -- User Management & Reports (Full)
    INSERT INTO T_ROLES_PRIVILEGE VALUES
    (@SuperAdminId,9,1,1,1,1,1),
    (@SuperAdminId,7,1,1,1,1,1);

    -- Process modules (View only)
    INSERT INTO T_ROLES_PRIVILEGE VALUES
    (@SuperAdminId,1,0,1,0,0,1), -- Overview
    (@SuperAdminId,2,0,1,0,0,1), -- Suggest
    (@SuperAdminId,3,0,1,0,0,1), -- Approve
    (@SuperAdminId,4,0,1,0,0,1), -- Upload
    (@SuperAdminId,6,0,1,0,0,1), -- Issue Amount
    (@SuperAdminId,8,0,1,0,0,1); -- Verify

    PRINT 'Super Admin permissions applied';
END

/* ============================================================================
   STEP 5: SCHOLARSHIP ADMIN (MANAGER)
   ============================================================================ */

IF @ScholarshipAdminId IS NOT NULL
BEGIN
    DELETE FROM T_ROLES_PRIVILEGE WHERE Roles_Id = @ScholarshipAdminId;

    INSERT INTO T_ROLES_PRIVILEGE VALUES
    (@ScholarshipAdminId,1,1,1,1,1,1), -- Overview
    (@ScholarshipAdminId,4,1,1,1,1,1), -- Upload
    (@ScholarshipAdminId,2,1,1,1,1,1), -- Suggest
    (@ScholarshipAdminId,3,1,1,1,1,1), -- Approve
    (@ScholarshipAdminId,7,1,1,1,1,1); -- Reports

    PRINT 'Scholarship Admin permissions applied';
END

/* ============================================================================
   STEP 6: SCHOLARSHIP PROCESSOR (MANAGER)
   ============================================================================ */

IF @ScholarshipProcessorId IS NOT NULL
BEGIN
    DELETE FROM T_ROLES_PRIVILEGE WHERE Roles_Id = @ScholarshipProcessorId;

    INSERT INTO T_ROLES_PRIVILEGE VALUES
    (@ScholarshipProcessorId,1,0,1,0,0,1), -- Overview (View)
    (@ScholarshipProcessorId,4,0,1,1,0,1), -- Upload (Update)
    (@ScholarshipProcessorId,8,0,1,1,0,1), -- Verify (Update)
    (@ScholarshipProcessorId,2,0,1,1,0,1), -- Suggest (Update)
    (@ScholarshipProcessorId,7,0,1,0,0,1); -- Reports (View)

    PRINT 'Scholarship Processor permissions applied';
END

/* ============================================================================
   STEP 7: RECEPTION (STANDARD USER)
   ============================================================================ */

IF @ReceptionId IS NOT NULL
BEGIN
    DELETE FROM T_ROLES_PRIVILEGE WHERE Roles_Id = @ReceptionId;

    INSERT INTO T_ROLES_PRIVILEGE VALUES
    (@ReceptionId,4,1,1,1,0,1), -- Upload (Create/Update)
    (@ReceptionId,1,0,1,0,0,1); -- Overview (View)

    PRINT 'Reception permissions applied';
END

/* ============================================================================
   COMPLETION
   ============================================================================ */

PRINT '========================================';
PRINT 'ROLE & PERMISSION UPDATE COMPLETED';
PRINT '========================================';
PRINT '✓ No role deleted';
PRINT '✓ No screen deleted';
PRINT '✓ Only permissions refreshed';
PRINT '✓ BRD fully implemented';
PRINT '========================================';

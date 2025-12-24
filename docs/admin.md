

















































1. EXECUTIVE SUMMARY	5
1.1 Purpose of This Document	5
1.2 Project Overview	5
1.3 Key Benefits	5
1.4 Scope Summary	5
2. INTRODUCTION	6
2.1 Background	6
2.2 Problem Statement	6
2.3 Proposed Solution	6
3. BUSINESS OBJECTIVES	6
3.1 Primary Objectives	6
3.1.1 Operational Efficiency	6
3.1.2 Transparency and Accountability	6
3.1.3 Financial Management	6
3.2 Success Metrics	7
4. STAKEHOLDERS AND USER ROLES	7
4.1 Organizational Stakeholders	7
4.1.1 ARAM Foundation Leadership	7
4.1.2 Scholarship Committee	7
4.1.3 Administrative Staff	7
4.2 System User Roles	7
4.2.1 Super Admin CEO	7
4.2.2 Manager Scholarship Admin	7
4.2.3 Manager Scholarship Processor	8
4.2.4 Super Admin	8
4.2.5 Standard User / Reception	8
5. SYSTEM ARCHITECTURE OVERVIEW	8
5.1 High-Level Architecture	8
5.1.1 Application Layers	8
5.2 Navigation Structure	8
5.2.1 Header Section	8
5.2.2 Left Navigation Panel	9
6. END-TO-END WORKFLOW	9
6.1 Scholarship Application Lifecycle	9
6.1.1 Stage 1: Application Registration	9
6.1.2 Stage 2: Document Collection and Upload	9
6.1.3 Stage 3: Document Verification	9
6.1.4 Stage 4: Amount Suggestion	9
6.1.5 Stage 5: Approval	9
6.1.6 Stage 6: Amount Issuance	10
6.2 Workflow Status Matrix	10
7. MODULE SPECIFICATIONS	10
7.1 Authentication Module	10
7.1.1 Purpose	10
7.1.2 Login Screen Specifications	10
7.1.3 User Profile Menu	11
7.1.4 Password Management Requirements	11
7.2 Dashboard Module (Home)	11
7.2.1 Purpose	11
7.2.2 Dashboard Layout Specifications	11
7.3 Process Module	12
7.3.1 Purpose	12
7.3.2 Common Interface Elements	12
7.3.3 Overview Sub-Module	12
7.3.4 Documents Sub-Module	14
7.3.5 Verify Sub-Module	14
7.3.6 Suggest Sub-Module	14
7.3.7 Approve Sub-Module	15
7.3.8 Issue Amount Sub-Module	15
7.4.1 Purpose	16
7.4.2 Role List View	16
7.4.3 Add/Edit Role Form	16
7.5 User Management Module	17
7.5.1 Purpose	17
7.5.2 User List View	17
7.5.3 Add/Edit User Form	17
7.6 Reports Module	18
7.6.1 Purpose	18
7.6.2 Report Types	18
7.6.3 Report Generation Filters	18
7.6.4 Export Options	18
7.6.5 Functional Requirements	18
8. DATA REQUIREMENTS	18
8.1 Data Entities	18
8.2 Data Retention Requirements	18
9. SECURITY REQUIREMENTS	19
9.1 Authentication Security	19
9.2 Authorization Security	19
9.3 Data Security	19
9.4 Audit and Compliance	19
10. NON-FUNCTIONAL REQUIREMENTS	19
10.1 Performance Requirements	19
10.2 Availability Requirements	19
10.3 Scalability Requirements	19
10.4 Browser Compatibility	19
11. USER INTERFACE SPECIFICATIONS	20
11.1 Design System	20
11.1.1 Color Palette	20
11.1.2 Typography	20
11.2 Component Standards	20
11.2.1 Buttons	20
11.2.2 Status Badges	20
11.3 Responsive Design	20
12. ASSUMPTIONS AND DEPENDENCIES	21
12.1 Assumptions	21
12.2 Dependencies	21
13. GLOSSARY OF TERMS	22
14. APPENDICES	23
14.1 Appendix A: Screen Reference Index	23
14.2 Appendix B: Change Log	23


1. EXECUTIVE SUMMARY
1.1 Purpose of This Document
This Business Requirements Document (BRD) provides a comprehensive specification for the Shri. Leo Muthu Scholarship Admin Portal, a web-based application designed to digitize, streamline, and secure the entire scholarship administration workflow. The document serves as the primary reference for all stakeholders involved in the development, implementation, and maintenance of the system.
The Leo Muthu Scholarship, established in fond remembrance of Shri. MJF. Ln. Leo Muthu (02.04.1952 - 10.07.2015), a visionary philanthropist and educationist, aims to support deserving students in their educational pursuits. This admin portal will enable efficient management of scholarship applications from initial submission through final disbursement.
1.2 Project Overview
The Leo Muthu Scholarship Management System (LMS) Admin Portal is designed to replace manual, paper-based scholarship processing with a comprehensive digital solution. The system will manage the complete lifecycle of scholarship applications including document collection, verification, amount suggestion, approval, fund disbursement, and reporting.
1.3 Key Benefits
    • Elimination of manual paper-based processes reducing processing time by up to 70%
    • Enhanced transparency through complete audit trails and status tracking
    • Improved accuracy in financial allocations through AI-assisted suggestions
    • Role-based access control ensuring data security and process integrity
    • Real-time analytics and reporting for informed decision-making
    • Scalable architecture supporting thousands of applications annually
1.4 Scope Summary
The system encompasses six primary functional modules: Authentication, Dashboard, Process Management (with sub-modules: Overview, Documents, Verify, Suggest, Approve, and Issue Amount), Role Management, User Management, and Reports. The application will support multiple user types including Super Administrators, Managers, and Standard Users with configurable permissions.

2. INTRODUCTION
2.1 Background
The ARAM Foundation has been managing the Leo Muthu Scholarship program to support deserving students across various educational levels including school, college, and research programs. Additionally, the foundation provides medical assistance to students in need. The scholarship program serves students from diverse institutions including Sai Ram Institute of Technology, Sai Ram School, Government Schools, and other educational institutions.
Prior to this initiative, scholarship management was conducted through manual processes involving paper applications, physical document verification, and offline approval workflows. This approach presented significant challenges including lengthy processing times, difficulty in tracking application status, risk of document loss, and limited visibility into program performance metrics.
2.2 Problem Statement
The current manual scholarship management process suffers from the following critical issues:
    1. Time-Intensive Processing: Manual review of applications and documents leads to extended processing cycles, often taking weeks to complete a single application review.
    2. Lack of Transparency: Applicants and administrators have limited visibility into application status, creating uncertainty and increasing inquiry volumes.
    3. Error-Prone Verification: Manual document verification is susceptible to human error and inconsistent evaluation criteria.
    4. Inadequate Audit Trail: Paper-based systems lack comprehensive logging of actions, making accountability difficult to establish.
    5. Limited Reporting: Generating program analytics and compliance reports requires significant manual effort.
2.3 Proposed Solution
The Leo Muthu Scholarship Admin Portal addresses these challenges through a comprehensive digital platform that automates and streamlines the scholarship management process. The solution provides centralized application management, structured workflow, role-based access, real-time tracking, comprehensive reporting, and AI-assisted processing capabilities.
3. BUSINESS OBJECTIVES
3.1 Primary Objectives
3.1.1 Operational Efficiency
    • Reduce application processing time from weeks to days through automated workflows
    • Minimize manual data entry through digital document collection and extraction
    • Enable concurrent processing of multiple applications across different workflow stages
3.1.2 Transparency and Accountability
    • Maintain complete audit trails for all system actions with user identification and timestamps
    • Provide real-time visibility into application status for authorized personnel
    • Document all decisions with mandatory remarks for rejections and modifications
3.1.3 Financial Management
    • Track scholarship disbursements by category: School Students, College Students, Research Scholars, and Medical Assistance
    • Enable AI-assisted amount suggestions based on predefined financial rules and eligibility criteria
    • Provide multi-level approval workflow for financial allocations
3.2 Success Metrics
Metric
Description
Target
Application Processing Time
Average time from submission to final approval
< 7 business days
Document Verification Accuracy
Percentage of correctly verified documents
> 99%
System Availability
Uptime during business hours
> 99.5%
User Adoption Rate
Percentage of staff using digital workflow
100%
Report Generation Time
Time to generate standard reports
< 30 seconds
Audit Compliance
Percentage of actions with complete audit trail
100%

4. STAKEHOLDERS AND USER ROLES
4.1 Organizational Stakeholders
4.1.1 ARAM Foundation Leadership
The foundation leadership provides strategic direction for the scholarship program and has final authority over policy decisions. They require visibility into program performance through executive dashboards and summary reports.
4.1.2 Scholarship Committee
The committee is responsible for reviewing applications, evaluating eligibility, and making final approval decisions on scholarship amounts. They require access to complete application information and verification results.
4.1.3 Administrative Staff
Administrative personnel handle day-to-day operations including document management, verification processing, and communication with applicants. They require efficient tools for managing high volumes of applications.
4.2 System User Roles
Based on the system design, the following user roles have been identified with their respective access levels and responsibilities:
4.2.1 Super Admin CEO
User Type: Administrator | Status: Active
Description: Highest level administrator with complete system access. This role is reserved for the CEO and foundation leadership requiring full visibility and control over all system functions.
Permissions: Full Create, Update, View, Delete access across all modules including User and Role management, System configuration, and all report generation functions.
4.2.2 Manager Scholarship Admin
User Type: Manager | Status: Active
Description: Senior scholarship administrator responsible for overseeing the application processing workflow, managing verification staff, and ensuring timely completion of reviews.
Permissions: Full access to Overview, Upload, Suggest, Approve modules; Report generation and viewing; User profile viewing (limited management).
4.2.3 Manager Scholarship Processor
User Type: Manager | Status: Active
Description: Manager responsible for processing scholarship applications, verifying documents, and preparing applications for approval committee review.
Permissions: Document verification and status updates; Amount suggestion capabilities; Report viewing access.
4.2.4 Super Admin
User Type: Administrator | Status: Active
Description: System administrator with full technical access for managing users, roles, and system configuration without necessarily being involved in scholarship decision-making.
4.2.5 Standard User / Reception
User Type: Standard User | Status: May be Active or Inactive
Description: Front-desk personnel responsible for initial application intake, document collection, and basic status inquiries. Limited access focused on document upload functions.
5. SYSTEM ARCHITECTURE OVERVIEW
5.1 High-Level Architecture
The Leo Muthu Scholarship Admin Portal is designed as a modern web application with a responsive interface accessible through standard web browsers. The system follows a modular architecture enabling independent development and maintenance of functional components.
5.1.1 Application Layers
    1. Presentation Layer: Responsive web interface built with modern frontend frameworks, featuring a left-side navigation panel and content area
    2. Business Logic Layer: Server-side processing handling workflow rules, validation, calculations, and business operations
    3. Data Access Layer: Database connectivity and data management services
    4. Integration Layer: APIs for connecting with external systems and services
5.2 Navigation Structure
The application features a consistent navigation structure with the following primary elements:
5.2.1 Header Section
    • Application logo and title: 'Shri. Leo Muthu Scholarship (LMS) - An Initiative of ARAM Foundation'
    • Global search functionality
    • Notification bell icon for system alerts
    • User profile menu with account options (My Profile, Change Password, Logout)
5.2.2 Left Navigation Panel
The left sidebar provides access to all main system modules:
    1. Home - Dashboard view with analytics and recent applications
    2. Process - Application processing workflow modules
    3. Roles - Role and permission management
    4. Users - User account management
    5. Reports - Report generation and analytics
    6. Help - User assistance and documentation
    7. Settings - System configuration options

6. END-TO-END WORKFLOW
6.1 Scholarship Application Lifecycle
The scholarship application follows a structured workflow from initial submission through final fund disbursement. Each stage has specific requirements, responsible parties, and validation rules.
6.1.1 Stage 1: Application Registration
Status: Registered
Students submit their scholarship applications through the User Portal. Upon successful submission, the application receives a unique Application Number (e.g., AF2510001) and enters the admin portal with 'Registered' status.
6.1.2 Stage 2: Document Collection and Upload
Status: Document Submitted
Administrative staff upload supporting documents for each application. Required documents include identity proof, income certificates, academic records, and institution verification. The system validates document completeness and updates status to 'Document Submitted' upon successful upload.
6.1.3 Stage 3: Document Verification
Status: Verified / Recheck / Reject
Verification officers review uploaded documents for authenticity and completeness. AI-assisted verification highlights potential discrepancies between document content and application data. Verifiers can mark documents as Verified, request Recheck with remarks, or Reject with mandatory explanation.
6.1.4 Stage 4: Amount Suggestion
Status: Completed (Suggestion)
For verified applications, authorized personnel suggest scholarship amounts based on eligibility criteria, financial rules, and available funds. The system may provide AI-based suggestions using predefined formulas considering income level, academic performance, and scholarship category.
6.1.5 Stage 5: Approval
Status: Approved / Waiting / Rejected
The scholarship committee reviews suggested amounts and makes final approval decisions. Approvers can accept the suggested amount, modify it with justification, or reject the application.
6.1.6 Stage 6: Amount Issuance
Status: Amount Issued
For approved applications, the finance team processes fund disbursement. This stage involves selecting the payment mode, entering payment reference details, and generating the final scholarship approval form.
6.2 Workflow Status Matrix
Stage
Process
Status Values
Badge Color
Module
1
Registration
Registered
Green
Student Portal
2
Document Upload
Document Submitted
Blue
Admin - Documents
3
Verification
Verified / Recheck / Reject
Green / Yellow / Red
Admin - Verify
4
Suggestion
Completed
Green
Admin - Suggest
5
Approval
Waiting / Approved / Rejected
Yellow / Green / Red
Admin - Approve
6
Disbursement
Amount Issued
Green
Admin - Issue Amount

7. MODULE SPECIFICATIONS
This section provides detailed functional specifications for each module within the Leo Muthu Scholarship Admin Portal.
7.1 Authentication Module
7.1.1 Purpose
The Authentication Module provides secure access control to the admin portal, ensuring only authorized users can access the system. It handles user login, session management, password recovery, and logout functionality.
7.1.2 Login Screen Specifications
Layout Description: The login screen presents a split-panel design. The left panel (approximately 60% width) displays the memorial tribute to Shri. MJF. Ln. Leo Muthu with his photograph, institutional building imagery, and tribute text. The right panel contains the login form.
7.1.2.1 Login Form Elements
Element
Type
Position
Description
Header Logo
Image
Top of form
Scholarship logo with organization name
Welcome Text
Static Text
Below logo
Welcome to Leo Muthu Scholarship
Username
Text Input
Form body
Required field with label 'Username *'
Password
Password Input
Below username
Required field with visibility toggle
Forgot Password
Link
Below password
Password recovery hyperlink
Login Button
Primary Button
Below fields
Blue button with 'Log In' text
Terms Text
Static Text
Below button
Terms of Service and Privacy Policy
Footer
Static Text
Bottom
Copyright © 2025 LEO MUTHU Scholarship
7.1.2.2 Login Functional Requirements
    1. LGN-001: The system shall validate username and password against stored credentials
    2. LGN-002: Upon successful authentication, the system shall create a secure session and redirect to Dashboard
    3. LGN-003: Failed login attempts shall display error message without revealing which credential was incorrect
    4. LGN-004: The system shall enforce account lockout after 5 consecutive failed login attempts
    5. LGN-005: Password visibility toggle shall allow users to view entered password temporarily
    6. LGN-006: Session timeout shall occur after 30 minutes of inactivity
7.1.3 User Profile Menu
Accessible from the profile icon in the header, the user profile menu displays the logged-in user's name and role (e.g., 'Aakash - Administrator') and provides options for My Profile, Change Password, and Logout.
7.1.4 Password Management Requirements
    1. PWD-001: Password change shall require entry of current password for verification
    2. PWD-002: New passwords shall meet complexity requirements: minimum 8 characters with uppercase, lowercase, number, special character
    3. PWD-003: Password confirmation field shall match new password exactly
    4. PWD-004: System shall maintain password history preventing reuse of last 5 passwords

7.2 Dashboard Module (Home)
7.2.1 Purpose
The Dashboard serves as the central hub for scholarship program oversight, providing real-time metrics, analytics, and quick access to recent applications. It enables administrators to monitor program performance at a glance.
7.2.2 Dashboard Layout Specifications
Header Section: Personalized welcome message displaying 'Hello [Username]!' followed by 'Welcome back to the Leo Muthu Scholarship Portal. View your [Year] performance metrics below.' Academic Year dropdown selector and Export button are positioned in the top right.
7.2.2.1 Financial Summary Cards
The dashboard displays five financial metric cards in the top section:
Card
Label
Sample Value
Description
Card 1
Total Amount Spent This Year
₹21,657,00
Sum of all disbursed scholarships
Card 2
Amount Spent for School Students
₹3,657,00
Total disbursed to school-level students
Card 3
Amount Spent for College Students
₹9,657,00
Total disbursed to college students
Card 4
Amount Spent for Research Scholars
₹4,657,00
Total disbursed to research scholars
Card 5
Amount Spent for Medical Assistance
₹50,000
Total disbursed for medical aid
7.2.2.2 Applications Analytics Section
The 'Applications Analytics & Reports' section displays four metric cards:
Metric
Value
Icon
Description
Total Applications
72,684
People icon
Total applications received
Submitted
2,658
Document icon
Applications awaiting processing
Approved
15,210
Checkmark icon
Applications fully approved
Under Review
12,531
Review icon
Applications in verification/approval
7.2.2.3 Application Activity Chart
The Application Activity section displays a bar chart tracking applications received each month with date selector for historical data.
7.2.2.4 Scholarship Program Distribution Chart
A stacked bar chart visualizes program-wise scholarship distribution with Monthly/Quarterly/Yearly toggle.
7.2.2.5 Schedule Calendar
An interactive calendar widget displays upcoming meetings, deadlines, and activities with event tooltips.
7.2.2.6 Recent Applications Table
Column
Description
Features
Checkbox
Multi-select checkbox
Selection
Application No.
Unique identifier (e.g., AF2510001)
Sortable
Student Name
Full name of applicant
Sortable
Class Studying
Education level (e.g., BE Computer Science)
Sortable
Institution Name
Educational institution name
Sortable, truncated
Mobile Number
Contact number with country code
Sortable
Status
Current application status badge
Filterable
Scholarship
Scholarship program number
Sortable

7.3 Process Module
7.3.1 Purpose
The Process Module is the core operational component providing comprehensive application management through five integrated sub-modules: Overview, Documents, Verify, Suggest, Approve, and Issue Amount.
7.3.2 Common Interface Elements
All sub-modules share consistent interface elements:
    1. Tab Navigation: Horizontal tab bar with Overview, Documents, Verify, Suggest, Approve, and Issue Amount tabs
    2. Academic Year Selector: Dropdown filter in top-right for data filtering
    3. Export Button: Download functionality for Excel/PDF export
    4. Search Bar: Text search functionality for filtering applications
    5. Pagination: '[X]-[Y] of [Total] items' indicator with page navigation
7.3.3 Overview Sub-Module
7.3.3.1 Purpose
The Overview sub-module provides a high-level view of all applications with document details and progress tracking. Header: 'Overview - High-Level View of Document Details and Progress'
7.3.3.2 Table Columns Specification
Column Name
Description
Sortable
Checkbox
Multi-select for bulk operations
No
Application No.
Unique identifier (e.g., AF2510001)
Yes
Student Name
Full name of applicant
Yes
Class Studying
Education level/program
Yes
Institution Name
Educational institution
Yes
Father Annual Income
Income bracket (e.g., 10001-20000)
Yes
Mobile Number
Contact number
Yes
Father Occupation
Employment type (e.g., Private Sector)
Yes
Scholarship Number
Assigned scholarship ID
Yes
Status
Current status badge
Filter
Prepared By
Staff who prepared application
Yes
Verified By
Verification officer name
Yes
Suggested By
Amount suggester name
Yes
7.3.3.3 Functional Requirements
    1. OVW-001: System shall display all applications for selected academic year with default sort by Application No descending
    2. OVW-002: Each column header shall support ascending/descending sorting
    3. OVW-003: Status badges shall use color coding: Green for Completed/Registered, Yellow for Review, Red for Reject
    4. OVW-004: Three-dot menu on each row shall provide context actions: View Details, Edit, Download Documents

7.3.4 Documents Sub-Module
7.3.4.1 Purpose
The Documents sub-module manages upload and organization of supporting documents. Header: 'Upload Document - Select and Upload Your Supporting Documents'
7.3.4.2 Table Columns
Column Name
Description
Class Studying
Education level/program
Institution Name
Educational institution
Father Annual Income
Income bracket
Mobile Number
Contact number
Father Occupation
Employment type
Scholarship
Scholarship program number
Status
Document status (Registered/Document Submitted)
Action
Upload button for document management
7.3.4.3 Upload Functionality
    • Document type selection from predefined list (ID Proof, Income Certificate, Marksheet, etc.)
    • Supported formats: PDF, JPG, JPEG, PNG (maximum 5MB per file)
    • Upload progress indicator with success/failure confirmation
7.3.4.4 Functional Requirements
    1. DOC-001: System shall display document upload status for each application
    2. DOC-002: Upload button shall be enabled only for applications with 'Registered' status
    3. DOC-003: Status shall update to 'Document Submitted' upon successful upload of all required documents
    4. DOC-004: Uploaded documents shall be stored with version control

7.3.5 Verify Sub-Module
7.3.5.1 Purpose
The Verify sub-module enables document verification officers to review submitted documents. Header: 'Document Verification - Submit and Verify Supporting Documents for Approval'
7.3.5.2 Verification Status Values
    • Verified (Green badge): Documents confirmed as authentic and complete
    • Document Submitted (Blue badge): Documents uploaded and awaiting verification
    • Recheck (Yellow badge): Documents require correction or additional submission
7.3.5.3 Functional Requirements
    1. VRF-001: System shall display only applications with 'Document Submitted' or 'Recheck' status
    2. VRF-002: Verifier shall preview all uploaded documents before making decision
    3. VRF-003: 'Recheck' status changes shall require mandatory remarks
    4. VRF-004: Verification actions shall record Verified By user ID with timestamp
    5. VRF-005: Applications marked 'Verified' shall automatically appear in Suggest sub-module

7.3.6 Suggest Sub-Module
7.3.6.1 Purpose
The Suggest sub-module enables authorized personnel to recommend scholarship amounts. Header: 'Suggest - Input the amount you'd like to suggest'
7.3.6.2 Suggestion Process
The Process column displays clickable links (e.g., 'Suggest 1', 'Suggest 2'). Clicking opens the suggestion dialog with:
    • Applicant information summary
    • Requested Amount displayed prominently
    • AI Suggested Amount (if enabled) with calculation logic
    • Suggested Amount input field for manual entry
    • Remarks/Justification text area
7.3.6.3 Functional Requirements
    1. SGT-001: System shall display only applications with 'Verified' or 'Completed' status
    2. SGT-002: Suggested amount shall not exceed requested amount without mandatory justification
    3. SGT-003: AI suggestion engine shall calculate amount based on income, merit, and category rules
    4. SGT-004: Status shall update to 'Completed' upon successful suggestion submission

7.3.7 Approve Sub-Module
7.3.7.1 Purpose
The Approve sub-module enables the scholarship committee to make final decisions. Header: 'Approve - Review and Confirm the Requested Funds'
7.3.7.2 Approval Status Values
    • Waiting (Yellow badge): Application awaiting committee review
    • Approved (Green badge): Scholarship approved for disbursement
    • Rejected (Red badge): Application rejected by committee
7.3.7.3 Functional Requirements
    1. APR-001: System shall display only applications with 'Waiting' status
    2. APR-002: Approved amount may differ from suggested amount with mandatory remarks
    3. APR-003: Rejection shall require mandatory reason entry
    4. APR-004: Approved applications shall automatically appear in Issue Amount sub-module
    5. APR-005: Approval decisions shall be final and locked from modification

7.3.8 Issue Amount Sub-Module
7.3.8.1 Purpose
The Issue Amount sub-module manages final disbursement of approved scholarships. Header: 'Issue Amount - Review and Confirm the Issue Amount'
7.3.8.2 Issue Amount Dialog
The Issue Amount dialog displays as 'LEO MUTHU - Scholarship Approve Panel (2024-2025)' with:
Field
Type
Description
Application No
Display
Unique application identifier
Student Name
Display
Full name of scholarship recipient
Father's Name
Display
Father/guardian name
Father's Occupation
Display
Employment type
Scholarship Seeking For
Display
Program/semester details (e.g., UG-BE - Semester I)
Request Amount
Display
Original requested amount (e.g., 50000)
Suggested Amount
Display
Amount suggested by reviewer (e.g., 25000)
Approved Amount
Display
Final approved amount (e.g., 25000)
Select mode of payment
Dropdown
Payment method selection
Comments
Text Area
Additional notes (200 words max)
Cancel
Button
Close dialog without saving
Submit
Button
Finalize disbursement record
7.3.8.3 Payment Mode Options
    • Demand Draft (DD)
    • NEFT/RTGS Transfer
    • Cheque
    • UPI Transfer
7.3.8.4 Functional Requirements
    1. ISS-001: System shall display only applications with 'Approved' status
    2. ISS-002: Payment mode selection shall be mandatory before submission
    3. ISS-003: Comments field shall support up to 200 words
    4. ISS-004: Submit action shall finalize disbursement and update status to 'Amount Issued'
    5. ISS-005: System shall generate printable scholarship approval form upon completion

7.4 Role Management Module
7.4.1 Purpose
The Role Management Module enables administrators to create, modify, and manage user roles with granular permission settings. Header: 'Role and Permissions - Maintain Roles, Rights, and User Information'
7.4.2 Role List View
Column Name
Description
Checkbox
Multi-select for bulk operations
User Role
Role name (e.g., SuperAdmin_CEO, Manager_Scholarship Admin)
User Type
Category (Administrator/Manager/Standard User)
Status
Active/Inactive badge
Actions
Three-dot menu (Edit Role, Delete Role)
7.4.3 Add/Edit Role Form
Header: 'Add Role - Create and define a new user role with specific permissions and access levels.'
7.4.3.1 Role Basic Information
Field
Type
Required
Options
Profile Photo
Image Upload
Optional
PNG, JPG, JPEG (up to 5MB)
Role *
Text Input
Required
Unique role name
User Type *
Dropdown
Required
Administrator / Manager / Users
Status *
Radio Buttons
Required
Active / Inactive
7.4.3.2 Permissions Matrix­
The Permissions section displays a matrix with checkboxes for each module and operation:
Menu
Create
Update
View
Delete
Overview
✓
✓
✓
✓
Upload
✓
✓
✓
✓
Suggest
✓
✓
✓
✓
Approve
✓
✓
✓
✓
Reports
✓
✓
✓
✓
User Management
✓
✓
✓
✓
Print Approval Form
✓
✓
✓
✓
7.4.3.3 Functional Requirements
    1. ROL-001: Role name shall be unique across the system
    2. ROL-002: At least one permission shall be enabled for a valid role
    3. ROL-003: Inactive roles shall not be assignable to new users­
    4. ROL-004: Role deletion shall be prevented if users are currently assigned

7.5 User Management Module­
7.5.1 Purpose
The User Management Module enables administrators to create, modify, and manage user accounts. Header: 'Manage User - Maintain Roles, Rights, and User Information'
7.5.2 User List View
Column Name
Description
Checkbox
Multi-select for bulk operations
Name
User's full name
User Role
Assigned role name
User Type
Category (Administrator/Manager/Standard User)
Mobile Number
Contact number
Email Id
Email address
Status
Active/Inactive badge
Actions
Three-dot menu (Edit/Delete User Profile)
7.5.3 Add/Edit User Form
Header: 'Add New User - Enter user details to create a new account.'
Field
Type
Required
Validation
Profile Photo
Image Upload
Optional
PNG, JPG, JPEG (up to 5MB)
Name *
Text Input
Required
User's full name
User Role *
Dropdown
Required
Select from active roles
Email *
Email Input
Required
Valid email format, unique
Phone Number *
Phone Input
Required
Include country code (+91)
7.5.3.1 Available Role Options
    • CEO
    • Super Admin
    • Scholarship Processor
    • Scholarship Admin
    • Document Super Admin
    • Document Admin
    • Reception
7.5.3.2 Functional Requirements
    1. USR-001: Email address shall be unique and serve as secondary login identifier
    2. USR-002: New user accounts shall receive temporary password via email
    3. USR-003: User role assignment determines all permission levels
    4. USR-004: Deactivated users shall be retained in system for audit purposes

7.6 Reports Module
7.6.1 Purpose
The Reports Module provides comprehensive reporting and analytics capabilities. Header: 'Reports - Generate and Export Scholarship Performance Reports'
7.6.2 Report Types
The module provides three report categories accessible via horizontal tabs:
    1. Categories Wise Report: Reports segmented by scholarship categories
    2. Report of Scholarship Issued: Reports of all disbursed scholarships
    3. Approved Form: Printable approval forms for finalized awards
7.6.3 Report Generation Filters
Filter
Type
Placeholder
Options
Academic Year
Dropdown
Select Academic Year
2024-2025, 2023-2024, etc.
Applied Date
Date Picker
Select Applied Date
Calendar widget
Gender
Dropdown
Select Gender
All/Male/Female/Other
Status
Dropdown
Select
All/Registered/Verified/Approved
Keyword Search
Text Input
Search
Free text search
7.6.4 Export Options
    • Excel (.xlsx): Spreadsheet format with multiple sheets
    • PDF: Formatted document suitable for printing
    • CSV: Comma-separated values for data analysis
7.6.5 Functional Requirements
    1. RPT-001: Reports shall be generated within 30 seconds for standard data volumes
    2. RPT-002: All reports shall include generation timestamp and generated-by user ID
    3. RPT-003: Export function shall support datasets up to 100,000 records

8. DATA REQUIREMENTS
8.1 Data Entities
Entity
Description
Key Attributes
Application
Student application data
Application No, Student Details, Amounts, Status
Document
Uploaded supporting documents
Document Type, File Path, Version, Upload Date
User
System user accounts
User ID, Name, Email, Phone, Role, Status
Role
User role definitions
Role Name, Type, Status, Permissions
Permission
Access control settings
Module, Create, Update, View, Delete
AuditLog
System activity tracking
Action, User, Timestamp, Details
Payment
Disbursement records
Payment Mode, Reference, Amount, Date
8.2 Data Retention Requirements
    • Application records: Minimum 7 years after final status
    • Document files: Minimum 7 years, archived after 2 years
    • Audit logs: Permanent retention
    • Financial records: Minimum 10 years per regulatory requirements

9. SECURITY REQUIREMENTS
9.1 Authentication Security
    1. SEC-001: All passwords shall be stored using industry-standard hashing algorithms (bcrypt or Argon2)
    2. SEC-002: Session tokens shall expire after 30 minutes of inactivity
    3. SEC-003: Account lockout shall occur after 5 failed login attempts
    4. SEC-004: Password complexity requirements shall be enforced
9.2 Authorization Security
    1. SEC-005: Role-based access control shall be enforced at API and UI levels
    2. SEC-006: Users shall only access functions permitted by their assigned role
    3. SEC-007: Administrative functions shall require elevated privileges
9.3 Data Security
    • All data transmission shall use TLS 1.2 or higher encryption
    • Sensitive personal information shall be encrypted at rest
    • Database backups shall be encrypted and stored securely
9.4 Audit and Compliance
    • All user actions shall be logged with user ID, timestamp, and action details
    • Audit logs shall be tamper-proof and backed up regularly
    • Login/logout events shall be tracked for security monitoring

10. NON-FUNCTIONAL REQUIREMENTS
10.1 Performance Requirements
Operation
Description
Target
Page Load Time
Initial page rendering
< 3 seconds
Search Response
Search query execution
< 2 seconds
Report Generation
Standard report creation
< 30 seconds
File Upload
Document upload completion
< 10 seconds per 5MB
Concurrent Users
Simultaneous active users
100+ users
10.2 Availability Requirements
    • System availability: 99.5% uptime during business hours (8 AM - 8 PM IST)
    • Planned maintenance windows: Weekends between 2 AM - 6 AM IST
    • Recovery Time Objective (RTO): 4 hours
    • Recovery Point Objective (RPO): 1 hour
10.3 Scalability Requirements
    • Support 100+ concurrent users without performance degradation
    • Handle 100,000+ applications per academic year
    • Store 500GB+ of document files with archival support
10.4 Browser Compatibility
    • Google Chrome (latest 2 versions)
    • Mozilla Firefox (latest 2 versions)
    • Microsoft Edge (latest 2 versions)
    • Safari (latest 2 versions)
11. USER INTERFACE SPECIFICATIONS
11.1 Design System
11.1.1 Color Palette
Color Name
Hex Code
Usage
Primary Blue
#2563EB
Primary buttons, active navigation, links
Success Green
#10B981
Success states, approved badges
Warning Yellow
#F59E0B
Warning states, waiting/review badges
Error Red
#EF4444
Error states, reject badges
Neutral Gray
#6B7280
Secondary text, borders
Background
#F9FAFB
Page background
White
#FFFFFF
Content areas
11.1.2 Typography
    • Primary Font: System font stack (Arial, Helvetica, sans-serif)
    • Headings: Bold weight, sizes 14px to 24px
    • Body text: Regular weight, 14px default
11.2 Component Standards
11.2.1 Buttons
Type
Background
Text
Usage
Primary
Blue (#2563EB)
White
Main actions (Login, Save, Submit)
Secondary
White
Gray border
Secondary actions (Cancel, Back)
Danger
Red (#EF4444)
White
Destructive actions (Delete, Reject)
Text Link
Transparent
Blue text
Navigation links
11.2.2 Status Badges
Status
Color
Shape
Context
Registered
Green
Pill shape
Initial registration
Document Submitted
Blue
Pill shape
Documents uploaded
Verified
Green
Pill shape
Documents verified
Waiting
Yellow
Pill shape
Awaiting action
Approved
Green
Pill shape
Application approved
Reject
Red outline
Pill shape
Application rejected
Active
Green
Pill shape
User/Role active
Inactive
Gray
Pill shape
User/Role inactive
11.3 Responsive Design
    • Desktop: 1200px and above (full layout with sidebar)
    • Tablet: 768px - 1199px (collapsible sidebar)
    • Mobile: Below 768px (hamburger menu navigation)

12. ASSUMPTIONS AND DEPENDENCIES
12.1 Assumptions
    1. Users will have access to modern web browsers with JavaScript enabled
    2. Network connectivity will be available during application usage
    3. Users will receive adequate training before system deployment
    4. Document formats submitted will be standard formats (PDF, images)
    5. IT infrastructure for hosting will be provided by the organization
12.2 Dependencies
    1. Student Portal must be operational for application flow
    2. Email service for notifications and password recovery
    3. Cloud storage or server infrastructure for document storage
    4. Database server for application data persistence
    5. SSL certificates for secure communications

13. GLOSSARY OF TERMS
Term
Definition
LMS
Leo Muthu Scholarship - The scholarship program name
BRD
Business Requirements Document
ARAM Foundation
The charitable foundation administering the scholarship
Academic Year
The annual period for scholarship processing
Application No
Unique identifier assigned to each scholarship application
Status Badge
Visual indicator showing current application stage
RBAC
Role-Based Access Control - Security model for permissions
Audit Trail
Chronological record of system activities
Disbursement
Release of scholarship funds to beneficiary
DD
Demand Draft - A payment instrument
OCR
Optical Character Recognition - Text extraction from images
AI/ML
Artificial Intelligence/Machine Learning

14. APPENDICES
14.1 Appendix A: Screen Reference Index
Screen ID
Screen Name
Module
BRD Section
SCR-001
Login Screen
Authentication
Section 7.1.2
SCR-002
Dashboard
Dashboard
Section 7.2
SCR-003
Process - Overview
Process
Section 7.3.3
SCR-004
Process - Documents
Process
Section 7.3.4
SCR-005
Process - Verify
Process
Section 7.3.5
SCR-006
Process - Suggest
Process
Section 7.3.6
SCR-007
Process - Approve
Process
Section 7.3.7
SCR-008
Process - Issue Amount
Process
Section 7.3.8
SCR-009
Issue Amount Dialog
Process
Section 7.3.8.2
SCR-010
Role List
Role Management
Section 7.4.2
SCR-011
Add/Edit Role
Role Management
Section 7.4.3
SCR-012
User List
User Management
Section 7.5.2
SCR-013
Add/Edit User
User Management
Section 7.5.3
SCR-014
Reports
Reports
Section 7.6
SCR-015
User Profile Menu
Authentication
Section 7.1.3
14.2 Appendix B: Change Log
Any changes to this BRD after initial approval shall be documented in this section with change description, date, and approval status.

--- END OF DOCUMENT ---
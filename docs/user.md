**Leo Muthu Scholarship Portal**

**User Login**

Rev Date: 12/12/2025

# Table of Contents

[Document Control 2](#_Toc216643311)

[Version History 2](#_Toc216643312)

[Table of Contents 3](#_Toc216643313)

[1\. Executive Summary 5](#_Toc216643314)

[1.1 Purpose of This Document 5](#_Toc216643315)

[1.2 Project Overview 5](#_Toc216643316)

[Key System Capabilities 5](#_Toc216643317)

[1.3 Key Benefits 5](#_Toc216643318)

[2\. Current State Analysis 6](#_Toc216643319)

[2.1 Existing Scholarship Application Process 6](#_Toc216643320)

[2.2 Identified Challenges 6](#_Toc216643321)

[3\. Scope Definition 7](#_Toc216643322)

[3.1 In-Scope Features 7](#_Toc216643323)

[3.2 Out-of-Scope Items 7](#_Toc216643324)

[4\. User Roles & Permissions 8](#_Toc216643325)

[4.1 User Types 8](#_Toc216643326)

[4.2 Role Capabilities Matrix 8](#_Toc216643327)

[4.3 Role Restrictions Summary 8](#_Toc216643328)

[5\. Registration & Login Workflow 9](#_Toc216643329)

[5.1 System Entry Points 9](#_Toc216643330)

[5.2 New User Registration Flow 9](#_Toc216643331)

[5.2.1 Process Overview 9](#_Toc216643332)

[5.2.2 Registration Workflow Diagram 9](#_Toc216643333)

[5.2.3 Field Validations - Registration 9](#_Toc216643334)

[5.2.4 Error Messages - Registration 10](#_Toc216643335)

[5.3 Email Verification 10](#_Toc216643336)

[5.3.1 Verification Link Specifications 10](#_Toc216643337)

[5.4 Login Workflow 10](#_Toc216643338)

[5.4.1 Process Overview 10](#_Toc216643339)

[5.4.2 Login Workflow Diagram 11](#_Toc216643340)

[5.4.3 Login Validations 11](#_Toc216643341)

[5.5 Authentication & Session Rules 11](#_Toc216643342)

[6\. Scholarship Application Workflow 12](#_Toc216643343)

[6.1 Multi-Step Wizard Overview 12](#_Toc216643344)

[6.1.1 Application Steps Summary 12](#_Toc216643345)

[6.1.2 Application Workflow Diagram 12](#_Toc216643346)

[6.2 Step 1: Identity Details 12](#_Toc216643347)

[6.2.1 Field Specifications 13](#_Toc216643348)

[6.2.2 AADHAAR Validation Logic 13](#_Toc216643349)

[6.3 Step 2: Personal Details 13](#_Toc216643350)

[6.3.1 Field Specifications 13](#_Toc216643351)

[6.4 Step 3: Family Details 13](#_Toc216643352)

[6.4.1 Field Specifications 14](#_Toc216643353)

[6.5 Step 4: Bank Details 14](#_Toc216643354)

[6.5.1 Field Specifications 14](#_Toc216643355)

[6.6 Step 5: Document Upload 15](#_Toc216643356)

[6.6.1 Accepted Document Types 15](#_Toc216643357)

[6.6.2 Upload Rules & Constraints 15](#_Toc216643358)

[6.6.3 Upload System Behaviors 15](#_Toc216643359)

[6.7 Review & Submit 15](#_Toc216643360)

[6.7.1 Review Screen Features 16](#_Toc216643361)

[6.7.2 Submission Prerequisites 16](#_Toc216643362)

[6.8 Application Number Generation 16](#_Toc216643363)

[6.8.1 Number Format Specification 16](#_Toc216643364)

[6.8.2 Confirmation Popup 16](#_Toc216643365)

[7\. Dashboard & Application Tracking 17](#_Toc216643366)

[7.1 Dashboard Overview 17](#_Toc216643367)

[7.1.1 Dashboard Components 17](#_Toc216643368)

[7.2 Application Card Structure 17](#_Toc216643369)

[7.3 Application Status Types 17](#_Toc216643370)

[7.3.1 Status Flow Diagram 17](#_Toc216643371)

[7.4 User Actions from Dashboard 18](#_Toc216643372)

[8\. Data Management Rules 19](#_Toc216643373)

[8.1 Data Storage & Session Management 19](#_Toc216643374)

[8.2 Data Locking Rules 19](#_Toc216643375)

[9\. Non-Functional Requirements 20](#_Toc216643376)

[9.1 Security Requirements 20](#_Toc216643377)

[9.2 Performance Requirements 20](#_Toc216643378)

[9.3 Compatibility Requirements 20](#_Toc216643379)

[9.4 Availability Requirements 20](#_Toc216643380)

[9.5 Accessibility Requirements 21](#_Toc216643381)

[10\. Glossary 22](#_Toc216643382)

[Appendix A: Complete Field Validation Summary 23](#_Toc216643383)

# 1\. Executive Summary

## 1.1 Purpose of This Document

This Business Requirements Document (BRD) provides a comprehensive specification of all functional workflows, system behaviors, data validation rules, user interactions, and technical requirements for the Leo Muthu Scholarship Portal's User Module. The document serves as the authoritative reference for development teams, quality assurance personnel, and stakeholders to ensure alignment on all aspects of the application.

This BRD specifically addresses the applicant-facing components of the system, covering the complete user journey from initial registration through application submission and status tracking.

## 1.2 Project Overview

The Leo Muthu Scholarship Portal is a digital platform designed to streamline the end-to-end scholarship application process for students seeking financial assistance. The portal eliminates paper-based processes, reduces administrative overhead, and provides applicants with a transparent, user-friendly experience.

### Key System Capabilities

- Secure user registration with email verification and password management
- Multi-step application wizard with intelligent form validation
- Secure document upload and management system
- Real-time application status tracking via personalized dashboard
- Automated application reference number generation

## 1.3 Key Benefits

| **Benefit Area** | **Description** |
| --- | --- |
| **Simplified Application Process** | A single, guided workflow ensures users provide all required information with intelligent validations that prevent errors before submission. |
| **Reduced Manual Handling** | Automated data capture, document upload, and application generation significantly minimize manual verification requirements at the backend. |
| **Error-Free Submissions** | Comprehensive field-level and business-rule validations ensure that incomplete or incorrect applications are caught and corrected before final submission. |
| **Transparent Tracking** | Users can monitor all past and current applications through a clear, intuitive dashboard interface with real-time status updates. |
| **Enhanced Security** | Industry-standard encryption, secure authentication, and data protection measures ensure applicant information remains safe and confidential. |
| **Accessibility** | Responsive design ensures seamless access across desktop, tablet, and mobile devices, enabling applicants to apply from anywhere. |

# 2\. Current State Analysis

## 2.1 Existing Scholarship Application Process

Prior to the implementation of the Leo Muthu Scholarship Portal, the application process was predominantly paper-based and manual. Applicants were required to obtain physical forms, manually fill in details, attach photocopies of supporting documents, and submit the package either in person or via postal mail.

This process resulted in significant delays, high error rates, and limited visibility for applicants regarding their application status. Administrative staff faced substantial workloads managing physical documents, verifying information manually, and communicating status updates through phone or mail.

## 2.2 Identified Challenges

| **Challenge** | **Impact** | **Proposed Solution** |
| --- | --- | --- |
| **No Standard Online Workflow** | Applicants frequently submitted incomplete or incorrectly formatted details, leading to processing delays. | Multi-step wizard with mandatory field validation ensures complete data capture. |
| **Manual Document Handling** | Physical documents were often misplaced, damaged, or illegible, requiring re-submission. | Digital upload with format and size validation, plus secure cloud storage. |
| **No Application Tracking** | Students frequently contacted support for status updates, overwhelming administrative resources. | Real-time dashboard showing application status and history. |
| **Validation Issues** | Errors due to inconsistent data formats (dates, IDs, income details) caused processing bottlenecks. | Comprehensive field-level validation with format enforcement. |
| **Lack of Audit Trail** | No clear record of when applications were received or processed, creating accountability gaps. | System-generated timestamps and unique application IDs. |

# 3\. Scope Definition

## 3.1 In-Scope Features

The following features are included within the scope of this BRD and will be implemented as part of the User Module:

| **#** | **Feature** | **Description** |
| --- | --- | --- |
| 1   | **Email Registration & Verification** | New user onboarding flow including email input, OTP/verification link generation, link validation, and password creation screens. |
| 2   | **Login Module** | Secure email and password-based authentication with failed attempt handling, account lockout, and session management. |
| 3   | **Multi-Step Application Form** | Five-step wizard capturing identity details, personal information, family details, bank information, and document uploads with progress indication. |
| 4   | **Document Upload Engine** | Secure file upload functionality supporting multiple document types with format validation, size limits, virus scanning, and preview capabilities. |
| 5   | **Review & Submit** | Final preview screen showing all entered data with section-by-section edit capability before final submission and data locking. |
| 6   | **Application Number Generation** | Automated generation of unique reference numbers following a defined format pattern upon successful submission. |
| 7   | **Dashboard & Tracking** | Personalized dashboard displaying current and past applications with status indicators, filters, and new application creation option. |

## 3.2 Out-of-Scope Items

The following items are explicitly excluded from this BRD and will be addressed in separate documentation or future phases:

| **Excluded Item** | **Rationale** |
| --- | --- |
| **Backend Admin Verification Workflows** | Administrative functions including application review, approval workflows, and admin dashboards are covered in a separate Admin Module BRD. |
| **Scholarship Approval Logic** | Approval criteria and decision-making rules depend on foundation policies and are outside the scope of the user-facing module. |
| **SMS Notifications** | Only email-based communication is included in the initial release. SMS integration may be considered for future phases. |
| **AI-Based Document Reading** | Automated OCR and document data extraction features are planned for future enhancement phases. |
| **Payment/Disbursement Module** | Fund disbursement and payment processing are handled separately from the application submission process. |

# 4\. User Roles & Permissions

## 4.1 User Types

The User Module of the Leo Muthu Scholarship Portal serves a single primary user type. Future modules may introduce additional roles such as administrators, reviewers, and foundation staff.

| **Role** | **Description** |
| --- | --- |
| **Applicant** | The primary user who registers on the platform, creates and submits scholarship applications, uploads supporting documents, and tracks the status of submitted applications. Applicants are typically students seeking financial assistance for their education. |

## 4.2 Role Capabilities Matrix

The following matrix outlines the complete set of capabilities available to the Applicant role within the system:

| **Capability** | **Applicant** | **Notes** |
| --- | --- | --- |
| Register new account with email | Yes | One-time |
| Verify email via verification link | Yes | Required |
| Create and manage password | Yes | \-  |
| Login to the portal | Yes | After verification |
| Create new scholarship application | Yes | Multiple allowed |
| Fill multi-step application form | Yes | \-  |
| Upload supporting documents | Yes | Min 3 required |
| Review application before submission | Yes | \-  |
| Edit application before submission | Yes | \-  |
| Submit completed application | Yes | Final action |
| View application dashboard | Yes | \-  |
| Track application status | Yes | Real-time |
| Edit application after submission | No  | Admin only |

## 4.3 Role Restrictions Summary

The following restrictions apply to the Applicant role to maintain data integrity and system security:

- Applications cannot be edited after final submission. Once submitted, the application is locked and becomes read-only.
- Applications cannot be submitted without completing all mandatory fields across all five steps of the wizard.
- A minimum of three (3) supporting documents must be uploaded before submission is enabled.
- Duplicate document types are not permitted within a single application.
- Applicants cannot access administrative functions or view other users' applications.

# 5\. Registration & Login Workflow

## 5.1 System Entry Points

The Leo Muthu Scholarship Portal provides two primary entry points for users: the Registration flow for new users and the Login flow for returning users. Both flows are designed with security and user experience as primary considerations.

## 5.2 New User Registration Flow

### 5.2.1 Process Overview

New users must complete a registration process before accessing the scholarship application features. The registration flow ensures that each user has a valid, verified email address and creates secure credentials for future access.

### 5.2.2 Registration Workflow Diagram

**Registration Process Flow**

| **Step** | **Action** | **System Behavior** |
| --- | --- | --- |
| 1   | User navigates to Registration page | System displays registration form with email input field and 'Register' button. |
| 2   | User enters email address | Real-time validation checks email format (contains @, valid domain structure). |
| 3   | User clicks 'Register' | System checks if email already exists in database. |
| 4a  | Email exists | Display error: 'Email already registered. Please log in.' with link to login page. |
| 4b  | Email is new | Generate verification link with unique token. Store token with 30-minute expiration. |
| 5   | System sends verification email | Email contains verification link. Display success message on screen. |
| 6   | User clicks verification link | System validates token. If valid and not expired, redirect to password creation. |
| 7   | User creates password | System validates password rules. Store hashed password. Mark account as verified. |
| 8   | Registration complete | Redirect to login page with success message. |

### 5.2.3 Field Validations - Registration

| **Field** | **Type** | **Validation Rules** |
| --- | --- | --- |
| **Email Address** | Text Input | Mandatory; Valid email format (<user@domain.com>); Must not already exist in system; Maximum 255 characters. |
| **Password** | Password Input | Mandatory; 8-16 characters; Must contain at least one letter (a-z, A-Z); Must contain at least one number (0-9); Special characters allowed but not required. |
| **Confirm Password** | Password Input | Mandatory; Must exactly match Password field. |

### 5.2.4 Error Messages - Registration

| **Scenario** | **Error Message** |
| --- | --- |
| Empty email field | Please enter your email address. |
| Invalid email format | Please enter a valid email address. |
| Email already registered | This email is already registered. Please log in or use a different email. |
| Password too short | Password must be at least 8 characters long. |
| Password too long | Password cannot exceed 16 characters. |
| Password missing letter | Password must contain at least one letter. |
| Password missing number | Password must contain at least one number. |
| Passwords do not match | Passwords do not match. Please re-enter. |
| Verification link expired | This verification link has expired. Please register again. |

## 5.3 Email Verification

Email verification is a critical security measure that ensures users have access to the email address they provide. This prevents fraudulent registrations and ensures communication can reach the applicant.

### 5.3.1 Verification Link Specifications

| **Parameter** | **Specification** |
| --- | --- |
| **Link Format** | <https://portal.leomuthu.org/verify?token=\[unique_token\>] |
| **Token Generation** | Cryptographically secure random string (minimum 32 characters) |
| **Expiration Time** | 30 minutes (configurable via admin settings) |
| **Usage Limit** | One-time use only. Link is invalidated after successful verification. |
| **Successful Verification** | Redirects to password creation screen |
| **Failed Verification** | Displays error message with option to request new verification link |

## 5.4 Login Workflow

### 5.4.1 Process Overview

Returning users authenticate using their registered email address and password. The login system incorporates security measures including failed attempt tracking and temporary account lockout to prevent unauthorized access attempts.

### 5.4.2 Login Workflow Diagram

**Login Process Flow**

| **Step** | **Action** | **System Behavior** |
| --- | --- | --- |
| 1   | User navigates to Login page | System displays login form with email and password fields. |
| 2   | User enters credentials | Real-time format validation on email field. |
| 3   | User clicks 'Login' | System validates email exists and account is verified. |
| 4a  | Account not verified | Display: 'Please verify your email before logging in.' with resend option. |
| 4b  | Account is locked | Display: 'Account temporarily locked. Please try again in \[X\] minutes.' |
| 4c  | Password incorrect | Increment failed attempt counter. Display: 'Invalid credentials.' |
| 5   | 5 failed attempts reached | Lock account for 15 minutes. Display lockout message. |
| 6   | Credentials valid | Create user session. Reset failed attempt counter. Redirect to Dashboard. |

### 5.4.3 Login Validations

| **Validation Check** | **Requirement** |
| --- | --- |
| **Email Existence** | Email must be registered in the system. |
| **Account Verification** | Account must have completed email verification process. |
| **Password Match** | Entered password must match the encrypted stored password. |
| **Account Status** | Account must not be locked due to failed attempts or administrative action. |

## 5.5 Authentication & Session Rules

| **Rule** | **Specification** |
| --- | --- |
| **Password Storage** | All passwords must be hashed using bcrypt or equivalent algorithm. Plain text storage is prohibited. |
| **Session Timeout** | User sessions expire after 20 minutes of inactivity. User is redirected to login page. |
| **Browser Close Behavior** | Optional setting: Auto-logout when browser is closed (configurable per user preference). |
| **Failed Attempt Limit** | 5 consecutive failed login attempts trigger temporary account lockout. |
| **Lockout Duration** | 15 minutes (configurable). Account automatically unlocks after duration. |
| **Concurrent Sessions** | Single active session per user. New login invalidates previous session. |

# 6\. Scholarship Application Workflow

## 6.1 Multi-Step Wizard Overview

The scholarship application is structured as a five-step wizard with a final review screen. This approach breaks down the comprehensive data collection into manageable sections, improves completion rates, and provides clear progress indication to users.

### 6.1.1 Application Steps Summary

| **Step** | **Section Name** | **Purpose** |
| --- | --- | --- |
| 1   | **Identity Details** | Capture applicant category, AADHAAR number, and optional PAN for identity verification. |
| 2   | **Personal Details** | Collect personal information including photo, gender, community, caste, date of birth, and contact details. |
| 3   | **Family Details** | Gather information about the student and family members including occupations and income. |
| 4   | **Bank Details** | Capture banking information for scholarship disbursement and requested amount. |
| 5   | **Document Upload** | Upload supporting documents to verify identity, educational status, and family details. |
| 6   | **Review & Submit** | Final review of all entered information with edit capability before submission. |

### 6.1.2 Application Workflow Diagram

**Complete Application Process Flow**

| **Phase** | **User Action** | **System Response** |
| --- | --- | --- |
| **Initiation** | Click 'New Application' | Create draft application record. Display Step 1 form. |
| **Step 1** | Enter Identity Details | Validate AADHAAR (12 digits + Verhoeff checksum). Auto-save on 'Next'. |
| **Step 2** | Enter Personal Details | Validate photo upload. Load caste dropdown based on community selection. |
| **Step 3** | Enter Family Details | Validate income range. Auto-save progress. |
| **Step 4** | Enter Bank Details | Validate IFSC format. Verify account number length. |
| **Step 5** | Upload Documents | Validate file types/sizes. Scan for viruses. Track upload count. |
| **Review** | Review all sections | Display consolidated data. Enable 'Edit' per section. |
| **Submit** | Click 'Submit' | Final validation. Generate application number. Lock record. Show confirmation. |

## 6.2 Step 1: Identity Details

The Identity Details step captures fundamental identification information required for applicant verification and uniqueness checks.

### 6.2.1 Field Specifications

| **Field Name** | **Type** | **Validation Rules** |
| --- | --- | --- |
| **Applicant Category** | Dropdown | Mandatory selection. Options loaded from backend configuration. |
| **AADHAAR Number** | Numeric | Mandatory; Exactly 12 digits; No alphabets or special characters; Must pass Verhoeff checksum validation; Must be unique across all applications. |
| **PAN Number** | Text | Optional; If provided: exactly 10 characters; Format: AAAAA9999A (5 letters + 4 numbers + 1 letter); Case-insensitive input, stored in uppercase. |

### 6.2.2 AADHAAR Validation Logic

The system implements comprehensive AADHAAR validation to ensure data integrity:

- Length check: Must be exactly 12 digits.
- Character check: Only numeric characters (0-9) allowed.
- First digit check: Cannot start with 0 or 1.
- Verhoeff checksum: Mathematical validation of the complete number.
- Uniqueness check: No duplicate AADHAAR numbers across submitted applications.

## 6.3 Step 2: Personal Details

The Personal Details step collects comprehensive personal information about the applicant including photograph, demographic details, and contact information.

### 6.3.1 Field Specifications

| **Field Name** | **Type** | **Validation Rules** |
| --- | --- | --- |
| **Profile Photo** | File Upload | Mandatory; Formats: PNG, JPG, JPEG; Maximum size: 5MB; Minimum dimensions: 200x200 pixels. |
| **Applied for Other Scholarship** | Yes/No | Mandatory selection. |
| **Gender** | Radio Button | Mandatory; Options: Male, Female, Other. |
| **Community** | Dropdown | Mandatory; Options loaded from master data. |
| **Caste** | Dropdown | Mandatory; Options dynamically filtered based on Community selection. |
| **Date of Birth** | Date Picker | Mandatory; Cannot be a future date; Applicant must be at least 15 years old. |
| **Email** | Auto-filled | Read-only; Pre-populated from registration. |
| **Mobile Number** | Text | Mandatory; Exactly 10 digits; Numeric only. |

## 6.4 Step 3: Family Details

The Family Details step captures information about the student and their family, which is used to assess eligibility and financial need.

### 6.4.1 Field Specifications

| **Field Name** | **Type** | **Validation Rules** |
| --- | --- | --- |
| **Student Name** | Text | Mandatory; Alphabets and spaces only; 2-100 characters. |
| **Student ID** | Text | Optional; Alphanumeric. |
| **Father Name** | Text | Mandatory; Alphabets and spaces only. |
| **Father Occupation** | Dropdown | Mandatory; Options from master data. |
| **Father Designation** | Text | Optional; Free text. |
| **Organization** | Text | Optional; Free text. |
| **Annual Income** | Dropdown | Mandatory; Predefined ranges; Must be within allowed scholarship eligibility range. |
| **Mother Name** | Text | Mandatory; Alphabets and spaces only. |
| **Mother Occupation** | Dropdown | Mandatory; Options from master data. |

## 6.5 Step 4: Bank Details

The Bank Details step collects financial information necessary for scholarship fund disbursement.

### 6.5.1 Field Specifications

| **Field Name** | **Type** | **Validation Rules** |
| --- | --- | --- |
| **Account Holder Name** | Text | Mandatory; Alphabets and spaces only; Must match name as per bank records. |
| **Account Number** | Numeric | Mandatory; 8-18 digits; Numeric only. |
| **Bank Name** | Dropdown | Mandatory; Options from master bank list. |
| **Branch** | Dropdown | Mandatory; Options filtered by selected Bank. |
| **IFSC Code** | Text | Mandatory; Exactly 11 characters; Format: 4 letters + 0 + 6 alphanumeric (e.g., SBIN0001234). |
| **Request Amount** | Numeric | Mandatory; Must be within scholarship minimum and maximum range. |
| **Scholarship Seeking For** | Dropdown | Mandatory; Purpose of scholarship (e.g., Tuition, Books, Hostel). |

## 6.6 Step 5: Document Upload

The Document Upload step allows applicants to submit supporting documents that verify their identity, educational status, and family information.

### 6.6.1 Accepted Document Types

| **#** | **Document Type** | **Purpose** |
| --- | --- | --- |
| 1   | Birth Certificate | Age and identity verification |
| 2   | Student ID | Educational institution enrollment verification |
| 3   | Ration Card | Family details and economic status verification |
| 4   | Voter ID | Identity and address verification |
| 5   | Driving License | Identity and address verification |
| 6   | Bank Passbook | Bank account verification |
| 7   | Aadhaar Card | Primary identity verification |
| 8   | PAN Card | Identity and financial verification |
| 9   | Bonafide Certificate (Student) | Current enrollment confirmation from institution |
| 10  | Bonafide Certificate (Parent) | Parent employment verification |

### 6.6.2 Upload Rules & Constraints

| **Rule** | **Requirement** |
| --- | --- |
| **Minimum Upload Count** | At least 3 documents must be uploaded before submission is allowed. |
| **Accepted File Types** | JPG, JPEG, PNG (images); PDF (documents). |
| **Maximum File Size** | 20 MB per file. |
| **Duplicate Documents** | Same document type cannot be uploaded twice within one application. |
| **Replace/Delete** | Applicants can replace or delete uploaded documents before final submission. |
| **Virus Scanning** | All uploaded files are scanned for malware before acceptance. |
| **File Name Sanitization** | Special characters in file names are removed/replaced automatically. |

### 6.6.3 Upload System Behaviors

- Preview thumbnails are displayed for image files immediately after upload.
- A progress indicator shows upload percentage for large files.
- Retry option is provided for failed uploads with clear error messaging.
- Corrupted or unreadable files are rejected with appropriate error message.
- Document count badge updates in real-time as files are added/removed.

## 6.7 Review & Submit

The Review & Submit screen provides applicants with a comprehensive view of all entered information before final submission.

### 6.7.1 Review Screen Features

- Displays all data from Steps 1-5 in a consolidated, organized format.
- Each section has an individual 'Edit' button to return to that specific step.
- Document thumbnails/names are displayed with download preview option.
- Submit button remains disabled until all validations pass.

### 6.7.2 Submission Prerequisites

| **Requirement** | **Validation** |
| --- | --- |
| All mandatory fields completed | System checks all required fields across all 5 steps. |
| Minimum documents uploaded | At least 3 documents must be present. |
| No validation errors | All field-level validations must pass. |
| Terms acceptance | Applicant must check declaration checkbox. |

## 6.8 Application Number Generation

Upon successful submission, the system generates a unique application reference number that serves as the primary identifier for tracking and communication purposes.

### 6.8.1 Number Format Specification

| **Component** | **Description** |
| --- | --- |
| **Format Pattern** | LM\[YY\]\[XXXXXX\] - Example: LM25000123 |
| **Prefix** | 'LM' - Leo Muthu foundation identifier |
| **Year Component** | 2-digit year (e.g., '25' for 2025) |
| **Sequence Number** | 6-digit sequential number, zero-padded, resets annually |
| **Generation Trigger** | Generated immediately upon successful final submission |
| **Display Location** | Confirmation popup, dashboard, and email notification |

### 6.8.2 Confirmation Popup

After successful submission, a confirmation popup is displayed with the following elements:

- Success icon (checkmark)
- Message: 'Your scholarship application has been successfully submitted.'
- Application Number prominently displayed
- Foundation contact information (email and phone)
- 'OK' button that redirects to the Dashboard

# 7\. Dashboard & Application Tracking

## 7.1 Dashboard Overview

The Dashboard serves as the central hub for applicants after login. It provides a comprehensive view of all applications (both current and historical), quick access to create new applications, and real-time status tracking.

### 7.1.1 Dashboard Components

- Welcome header with user's name and current date
- 'New Application' button prominently displayed
- Application cards grid/list showing all user's applications
- Filter/sort options (by status, date, application number)
- Summary statistics (total applications, approved, pending, rejected)

## 7.2 Application Card Structure

Each application is displayed as a card containing key information for quick reference:

| **Field** | **Description** |
| --- | --- |
| **Application Number** | Unique reference number (e.g., LM25000123) |
| **Student Name** | Name as entered in the application |
| **Course / Year** | Educational program and year of study |
| **Father Name** | Guardian name for reference |
| **Applied Date** | Date of application submission |
| **Scholarship Number** | Assigned if approved (blank otherwise) |
| **Status Badge** | Visual indicator of current status (color-coded) |
| **Mobile Number** | Contact number for reference |
| **Prepared By** | Submitter information (typically same as applicant) |

## 7.3 Application Status Types

Applications progress through defined status stages. Each status is visually distinguished with color coding:

| **Status** | **Color** | **Description** |
| --- | --- | --- |
| **Draft** | Gray | Application started but not yet submitted. Draft state with incomplete information. |
| **Completed** | Blue | Application successfully submitted and awaiting review. All data locked. |
| **In Progress** | Yellow | Application is currently under review by foundation staff. |
| **Rejected** | Red | Application has been declined. Reason may be provided. |
| **Approved** | Green | Scholarship has been granted. Scholarship number assigned. |

### 7.3.1 Status Flow Diagram

**Application Status Progression**

| **From Status** | **To Status** | **Trigger** |
| --- | --- | --- |
| (New) | Registered | User starts new application |
| Registered | Completed | User clicks 'Submit' on review page |
| Completed | In Progress | Admin begins review process |
| In Progress | Approved | Admin approves application |
| In Progress | Rejected | Admin rejects application |

## 7.4 User Actions from Dashboard

- View Details: Click on any application card to see full application information (read-only after submission).
- Create New Application: Click 'New Application' button to start a fresh application process.
- Continue Draft: For 'Registered' status applications, resume from where left off.
- Download Receipt: For submitted applications, download submission receipt/acknowledgment.
- Filter/Sort: Organize applications by status, date, or application number.

# 8\. Data Management Rules

## 8.1 Data Storage & Session Management

The application implements careful data management to ensure no user progress is lost while maintaining data integrity.

| **Rule** | **Behavior** |
| --- | --- |
| **Step-wise Storage** | Data is saved to database when user clicks 'Next' on each step. |
| **Session Persistence** | In-progress form data is retained even if user closes browser (linked to account). |
| **Navigation Preservation** | Switching between steps does not erase existing data in other steps. |
| **Draft Recovery** | Users can return to incomplete applications and resume from last saved step. |

## 8.2 Data Locking Rules

Once an application is submitted, strict locking rules apply to maintain data integrity and prevent tampering:

- Application becomes read-only immediately upon successful submission.
- Users can view but cannot modify any submitted data or documents.
- Editing is only possible if an administrator explicitly reopens the application.
- All data modifications are logged with timestamp and user information.

# 9\. Non-Functional Requirements

## 9.1 Security Requirements

| **Requirement** | **Specification** |
| --- | --- |
| **Password Storage** | All passwords must be hashed using bcrypt with appropriate salt rounds. Plain text storage is strictly prohibited. |
| **Data Transmission** | HTTPS (TLS 1.2+) must be enforced for all communications. HTTP requests must redirect to HTTPS. |
| **Document Encryption** | All uploaded documents must be encrypted at rest using AES-256 encryption. |
| **AADHAAR Masking** | Only last 4 digits of AADHAAR displayed in UI. Full number stored encrypted in database. |
| **Session Security** | Secure, HTTP-only cookies. Session tokens regenerated after login. CSRF protection enabled. |
| **Input Validation** | All user inputs sanitized and validated server-side. SQL injection and XSS prevention. |
| **Audit Logging** | All sensitive operations logged with timestamp, user ID, IP address, and action details. |

## 9.2 Performance Requirements

| **Metric** | **Target** |
| --- | --- |
| **Page Load Time** | Less than 2 seconds average under normal load conditions. |
| **File Upload Handling** | Smooth handling of files up to 20MB without timeout or failure. |
| **Form Auto-save** | Automatic save triggers every 30 seconds during form editing. |
| **Concurrent Users** | Support minimum 500 concurrent active users. |
| **Database Response** | Query response time under 100ms for 95th percentile. |

## 9.3 Compatibility Requirements

| **Category** | **Supported** |
| --- | --- |
| **Desktop Browsers** | Chrome (latest 2 versions), Edge (latest 2 versions), Safari (latest 2 versions), Firefox (latest 2 versions). |
| **Mobile Browsers** | Chrome Mobile, Safari Mobile (iOS 14+, Android 10+). |
| **Screen Sizes** | Responsive design from 320px (mobile) to 2560px (large desktop). |
| **Device Types** | Desktop computers, laptops, tablets, smartphones. |

## 9.4 Availability Requirements

| **Requirement** | **Specification** |
| --- | --- |
| **Uptime Target** | 99% availability (allowing approximately 7.3 hours downtime per month). |
| **Maintenance Windows** | Scheduled maintenance announced 48 hours in advance. Preferred window: Sundays 2-6 AM IST. |
| **Disaster Recovery** | Daily backups with 30-day retention. RPO: 24 hours. RTO: 4 hours. |
| **Failover** | Automatic failover to secondary server in case of primary failure. |

## 9.5 Accessibility Requirements

The portal must comply with WCAG 2.1 Level AA guidelines:

- All form fields have clear, descriptive labels associated properly.
- Full keyboard navigation support for all interactive elements.
- Screen reader compatible with proper ARIA attributes.
- Sufficient color contrast ratios (4.5:1 for normal text, 3:1 for large text).
- Error messages clearly identify the field and describe the error.
- Text can be resized up to 200% without loss of content or functionality.

# 10\. Glossary

The following terms are used throughout this document:

| **Term** | **Definition** |
| --- | --- |
| **AADHAAR** | 12-digit unique identification number issued by UIDAI to residents of India. |
| **BRD** | Business Requirements Document - formal documentation of business needs and requirements. |
| **IFSC** | Indian Financial System Code - 11-character alphanumeric code identifying bank branches. |
| **OTP** | One-Time Password - temporary code used for verification purposes. |
| **PAN** | Permanent Account Number - 10-character alphanumeric identifier issued by Income Tax Department. |
| **RPO** | Recovery Point Objective - maximum acceptable data loss measured in time. |
| **RTO** | Recovery Time Objective - maximum acceptable time to restore service after failure. |
| **UIDAI** | Unique Identification Authority of India - statutory authority issuing AADHAAR. |
| **Verhoeff Checksum** | Mathematical algorithm used to validate AADHAAR numbers. |
| **WCAG** | Web Content Accessibility Guidelines - international standard for web accessibility. |

# Appendix A: Complete Field Validation Summary

This appendix provides a consolidated view of all field validations across the application workflow for quick reference during development and testing.

| **Step** | **Field** | **Required** | **Key Validation** |
| --- | --- | --- | --- |
| **Step 1** | Applicant Category | Yes | Dropdown selection |
| **Step 1** | AADHAAR Number | Yes | 12 digits, Verhoeff checksum, unique |
| **Step 1** | PAN Number | No  | 10 chars, AAAAA9999A format |
| **Step 2** | Profile Photo | Yes | PNG/JPG, max 5MB |
| **Step 2** | Gender | Yes | Radio selection |
| **Step 2** | Community | Yes | Dropdown selection |
| **Step 2** | Caste | Yes | Filtered by Community |
| **Step 2** | Date of Birth | Yes | Not future, age >= 15 |
| **Step 2** | Mobile Number | Yes | 10 digits, numeric only |
| **Step 3** | Student Name | Yes | Alphabets/spaces, 2-100 chars |
| **Step 3** | Father Name | Yes | Alphabets/spaces only |
| **Step 3** | Annual Income | Yes | Within allowed range |
| **Step 3** | Mother Name | Yes | Alphabets/spaces only |
| **Step 4** | Account Holder Name | Yes | Alphabets/spaces only |
| **Step 4** | Account Number | Yes | 8-18 digits, numeric |
| **Step 4** | IFSC Code | Yes | 11 chars, XXXX0YYYYYY format |
| **Step 4** | Request Amount | Yes | Within scholarship range |
| **Step 5** | Documents | Yes | Min 3, max 20MB each, JPG/PNG/PDF |

_- End of Document -_
Business Requirements Document

iCaptur.AI Multi-Product SSO &
Centralized Billing Platform

Document Version: 1.0
Date: November 10, 2025
Status: Draft - For Review
Owner: iTech India Private Limited
Project Code: ICAP-SSO-BILL-2025
Business Requirements Document (BRD)

iCaptur.AI - Multi-Product SSO & Centralized Billing Platform

Document Version: 1.0 (Part 1 of 3)
Date: November 10, 2025
Status: Draft - For Review
Owner: iTech India Private Limited
Project Code: ICAP-SSO-BILL-2025

Document Control

Version Date Author Changes
1.0 2025-11-10 Development Team Initial comprehensive
BRD (Part 1)

Reviewers:

� [ ] Product Owner / Business Stakeholder
� [ ] Technical Lead / Architect
� [ ] Development Team Lead
� [ ] Security Team
� [ ] Finance Team

Approvals:

� [ ] Business Sponsor: ********\_******** Date: **\_\_\_**
� [ ] Technical Lead: ********\_\_******** Date: **\_\_\_**
� [ ] Project Manager: ********\_******** Date: **\_\_\_**

Table of Contents (Part 1)

1. [Executive Summary](#1-executive-summary)
2. [Business Context & Goals](#2-business-context--goals)
3. [Current State Analysis](#3-current-state-analysis)
4. [Target Architecture](#4-target-architecture)
5. [Actors & Permissions Model](#5-actors--permissions-model)
6. [Product & Subscription Model](#6-product--subscription-model)
7. [Authentication & Authorization](#7-authentication--authorization-detailed)
8. [Database Design](#8-database-design-comprehensive)
   PART 1: FOUNDATION & ARCHITECTURE

# 1. EXECUTIVE SUMMARY

What We're Building
We are building a centralized Single Sign-On (SSO) and Billing Management Platform for
the entire iCaptur.AI product ecosystem. This platform will enable customers to:

� **Log in once** and seamlessly access all iCaptur.AI products they've purchased (Customer
Portal, InvoX, iRepo, DocFennec, and future products)

� **Manage their subscriptions and billing** through a unified Account Center interface
� **Try iCaptur.AI APIs** through an integrated Experience Platform

The platform consists of three major components:

9. **SSO Service** - A centralized identity and access management system that handles
   authentication, user management, tenant management, and permission distribution across
   all products.

10. **Account Center** - A web application where users manage their profile, security settings,
    organization, and billing. This includes integration with Zoho Billing for subscription
    management, invoice viewing, and payment processing.

11. **Experience Platform** - A sandbox environment where prospective customers can explore
    and test iCaptur.AI APIs before subscribing (structure only for Phase 1; detailed features to
    be defined later).

Why We're Building It
Current Pain Points:

� Each iCaptur product operates independently with separate authentication
� No unified view of customer subscriptions across multiple products
� Billing information is scattered or requires manual intervention
� Customer onboarding for multiple products requires repetitive setup
� Support teams lack centralized visibility into customer access and billing status

Business Drivers:

� Create a seamless, professional user experience across all iCaptur products
� Enable multi-product subscriptions and cross-selling opportunities
� Reduce customer support overhead through self-service billing
� Provide foundation for rapid launch of new products
� Maintain compliance and security standards as we scale
Who It's For
End Users:

� **Organization Administrators** (`org_admin`) - Manage their company's subscription, users,
and billing

� **Organization Users** (`org_user`) - Use iCaptur products without administrative
responsibilities

iTech Staff:

� **Support Administrators** (`icaptur_support_admin`) - Help customers with account issues,
onboarding, and technical support

� **Finance Administrators** (`icaptur_finance_admin`) - Access financial data and billing
records for accounting purposes

� **Super Administrators** (`icaptur_super_admin`) - Full access to all system capabilities

Key Benefits
For Customers:

� Single login for all iCaptur products
� Self-service subscription management (upgrade, downgrade, cancel)
� Clear visibility into billing, invoices, and payment history
� Seamless experience when adopting multiple products
� Try APIs before buying through Experience Platform

For iTech:

� Faster product launches (new products plug into existing SSO)
� Reduced support burden (self-service billing)
� Better customer insights (centralized usage and billing data)
� Improved security posture (centralized authentication)
� Foundation for growth and scale

For Development:

� Reusable authentication and authorization infrastructure
� Standardized multi-tenancy model
� Clear separation of concerns (SSO vs product logic)
� Easier testing and deployment

High-Level Timeline
The project is structured in 5 phases over 20 weeks:

Phase Duration Focus Deliverables
Phase 1: SSO Weeks 1-6 Core authentication & SSO service with
Foundation identity management OIDC, user/tenant
APIs, permissions API
Phase 2: Billing BFF Weeks 7-10 Zoho integration & Billing backend with
billing APIs Hosted Pages and
Phase 3: Account Weeks 11-14 User-facing web webhooks
Center UI Weeks 15-18 application Dashboard, settings,
Phase 4: Customer Migrate first product to billing screens
Portal Integration Weeks 19-20 SSO Customer Portal using
SSO, data migration
Phase 5: Multi- Polish and complete
Product Prep documentation SDK, integration guide,
Experience Platform
structure

Key Milestones:

� **Week 6:** SSO service operational in dev environment
� **Week 10:** Billing integration working with Zoho (both regions)
� **Week 14:** Account Center deployed and usable
� **Week 18:** Customer Portal fully migrated to SSO
� **Week 20:** Platform ready for next product integration

Expected Outcomes
User Experience:

� 100% of users can access all their products with single login
� Billing changes reflect in product access within 5 minutes (95th percentile)
� < 5% of support tickets related to access or billing issues

Operational:

� 99.9% uptime for SSO and Billing services
� < 1% webhook processing failures
� Zero payment data security incidents
� Support for 1000+ tenants and 10,000+ users at launch

Business:

� Multi-product subscription capability enabled
� 20% reduction in customer onboarding time
� Foundation for launching 3+ additional products in next 12 months
� Clear path to Experience Platform for trial conversions

# 2. BUSINESS CONTEXT & GOALS

## 2.1 Current Situation

iCaptur.AI Product Ecosystem:
iCaptur.AI is a suite of AI-powered document processing products designed for businesses.
Currently, we have: 12. **Customer Portal** (Live Production)

- Document processing platform for invoices, CAD drawings, and EOB (Explanation of
  Benefits) documents

- Features: CAD table extraction, CAD checklist extraction, invoice extraction
- Status: Live with paying customers
- Technology: Node.js + React + PostgreSQL
- Deployment: https://portal.icaptur.ai
- Authentication: JWT (development), AWS Cognito (planned for production)

13. **Future Products** (Planned)

- InvoX: Enhanced invoice processing solution
- iRepo: Document repository and management system
- DocFennec: Advanced document intelligence platform
- Additional products in roadmap
  Current Authentication Model:
  � Each product manages its own authentication
  � Customer Portal has local user database with tenant associations
  � Users and tenants managed within each product independently
  � No cross-product session or single sign-on

Current Billing Model:
� Customer Portal customers managed via Zoho Billing
� Two Zoho accounts:

- India account: For Indian customers (INR currency)
- International account: For customers outside India (USD currency)
  � Plans and pricing configured in Zoho
  � Razorpay integrated as payment gateway through Zoho
  � Live paying customers exist

Current Pain Points: 14. **Fragmented User Experience**

- Users must create separate accounts for each product
- Remembering multiple credentials
- No unified profile or settings across products

15. **Limited Multi-Product Support**

- Difficult for customers to subscribe to multiple products
- No unified billing view across products
- Manual coordination required for multi-product accounts

16. **Billing Visibility Issues**

- Customers cannot self-serve for subscription changes
- Limited visibility into usage and billing status
- Support team handles many billing-related questions

17. **Operational Overhead**

- Repetitive onboarding for multi-product customers
- Manual tenant and user setup for each product
- No centralized view for support teams

18. **Development Constraints**

- New products must build authentication from scratch
- Duplicated code for user/tenant management
- Slower time-to-market for new products
  Current Strengths (To Preserve):
  � Working authentication pattern (JWT + Cognito path)
  � Established Zoho Billing integration
  � Solid database design and multi-tenancy model
  � Live customer base providing revenue
  � Comprehensive audit logging
  � Strong security practices (encryption, password policies, lockout protection)

## 2.2 Business Drivers

Strategic Initiatives: 19. **Product Portfolio Expansion**

- Launch 3+ new products in next 12-18 months
- Need shared infrastructure to accelerate launches
- Reduce time-to-market from months to weeks

20. **Customer Experience Excellence**

- Industry-standard expectation: single sign-on
- Self-service capabilities reduce friction
- Professional, unified experience builds trust

21. **Operational Efficiency**

- Automate billing and subscription management
- Reduce support ticket volume by 20%
- Enable support team to focus on complex issues

22. **Revenue Growth**

- Easier multi-product sales (cross-sell, upsell)
- Lower barrier to trying new products
- Experience Platform enables lead generation

23. **Compliance and Security**

- Centralized security controls
- Consistent audit trail across products
- Easier compliance with data protection regulations
  Market Factors:
  � Customers expect enterprise-grade identity management
  � SaaS industry standard is unified account management
  � Competition offers integrated product suites
  � B2B buyers evaluate based on security and manageability

## 2.3 Business Goals

Primary Goals: 24. **Seamless User Experience**

- Users log in once and access all subscribed products
- Zero re-authentication required when switching products
- Consistent branding and navigation across platform

25. **Self-Service Billing**

- Customers upgrade, downgrade, or cancel without contacting support
- View invoices and payment history anytime
- Update payment methods securely

26. **Multi-Product Enablement**

- Single tenant can subscribe to multiple products
- Product permissions managed independently per product
- Billing consolidated or split per product (Zoho flexibility)

27. **Foundation for Growth**

- New products integrate with SSO in < 2 weeks
- Consistent patterns for authentication and authorization
- Reusable components (SDK, libraries, documentation)

28. **Experience Platform for Acquisition**

- Prospective customers try APIs without commitment
- Friction-free path from trial to paid subscription
- Data and insights on feature interest
  Secondary Goals:

29. **Operational Insights**

- Centralized dashboard for product usage
- Billing and revenue visibility
- Customer health indicators

30. **Support Efficiency**

- Tools for support team (impersonation, account lookup)
- Self-service reduces ticket volume
- Faster resolution with centralized data

31. **Developer Productivity**

- Clear integration patterns for new products
- Automated SDK generation from OpenAPI specs
- Comprehensive documentation and examples

## 2.4 Success Metrics Target Measurement

User Experience KPIs: Failed logins / total login

> 99.5% attempts
> Metric Time from product A to product
> Login success rate B after authentication
> Successful upgrades/cancels /
> Cross-product navigation time < 3 seconds total attempts
> Quarterly survey
> Billing action completion rate > 95%

User satisfaction (NPS) > 50

Operational KPIs:
Metric Target Measurement
Support tickets (auth/billing) 20% reduction Quarter-over-quarter
comparison
SSO service uptime 99.9% Monthly uptime percentage
Successful webhooks / total
Billing webhook success rate > 99.9% webhooks
Time from signup to first product
Average onboarding time < 10 minutes use

Business KPIs: Target Measurement
30% of customers Customers with 2+ products /
Metric total customers
Multi-product adoption Unique users trying APIs
Paid subscriptions from
Experience Platform trials 100+ per month Experience Platform trials
Trial-to-paid conversion > 10% Average revenue (multi-product
customers vs single-product)
Revenue per customer (multi- 50% increase
product)

Technical KPIs: Target Measurement
< 300ms 95th percentile response time
Metric (excluding external calls)
API P95 latency Time to validate JWT token
Time to retrieve user
Token validation latency < 50ms permissions
Permissions API latency < 100ms From kickoff to production
deployment
New product integration time < 2 weeks

## 2.5 Stakeholders

Primary Stakeholders: 32. **End Users (Customers)**

- Organization administrators managing subscriptions and users
- Organization users using iCaptur products daily
- Impacted by: User experience, reliability, self-service capabilities

33. **iTech Support Team**

- Handles customer inquiries and technical issues
- Impacted by: Admin tools, visibility into customer accounts, support workflows

34. **iTech Finance/Accounting Team**

- Manages revenue recognition and financial reporting
- Impacted by: Billing data access, invoice management, reconciliation

35. **Development Team**

- Builds and maintains iCaptur products
- Impacted by: Integration complexity, documentation, SDK quality

36. **Product Management**

- Defines product roadmap and features
- Impacted by: Multi-product capabilities, data insights, customer feedback
  Secondary Stakeholders:

37. **Customer Success Team**

- Drives customer adoption and expansion
- Impacted by: Customer health visibility, multi-product sales enablement

38. **Marketing Team**

- Generates leads and drives trials
- Impacted by: Experience Platform, signup flows, lead capture

39. **Security Team**

- Ensures compliance and security posture
- Impacted by: Authentication security, audit logging, vulnerability management

40. **DevOps/Infrastructure Team**

- Manages deployments and infrastructure
- Impacted by: Deployment complexity, monitoring, incident response
  External Stakeholders:

41. **Zoho Billing**

- Third-party billing platform
- Integration point for subscriptions and payments

42. **Razorpay**

- Payment gateway (integrated through Zoho)

- Processes customer payments

Stakeholder Communication Plan:

Stakeholder Group Communication Channel Key Information
End Users Frequency Email, in-app Timeline, changes,

Pre-launch, during
Support Team migration notifications benefits
Finance Team Weekly during Team meetings, Slack Feature updates, tools
development Email, meetings training
Monthly, ad-hoc Stand-ups, Slack, docs Billing integration
Review meetings status, reconciliation
Development Team Daily Implementation
progress, blockers
Product Management Weekly Progress, risks,
decisions needed

# 3. CURRENT STATE ANALYSIS

This section provides a detailed analysis of the existing Customer Portal to understand what
we're building upon and what needs to change.

## 3.1 Customer Portal Architecture (Current)

High-Level Architecture:

Customer Portal

(portal.icaptur.ai)

Frontend Backend Database

(React) (Node.js) (PostgreSQL)

Vite Express

S3 iCaptur Zoho

(Storage) APIs Billing

Technology Stack:

Layer Technology Version
Frontend React
Build Tool Vite 18
UI Framework Material UI Latest
State Management Redux 5.x
Backend Node.js 4.x
Web Framework Express 22
4.x
Database PostgreSQL 15
ORM Drizzle Latest
Cloud Storage AWS S3 N/A
Payment/Billing Zoho Billing N/A

Current Authentication Implementation:

The Customer Portal implements a dual-mode authentication system:

Development Mode (Local JWT):

� Users authenticate with email/password stored in local database
� Passwords hashed with bcrypt (10 rounds)
� JWT tokens issued by the backend (1 hour access, 7 days refresh)
� Token payload: `{ userId, email, role, tenantId }`
� Validation: JWT signature verification with secret key

Production Mode (AWS Cognito - Planned):

� Users authenticate through AWS Cognito User Pools
� Cognito handles password storage and validation
� Cognito-issued tokens used for authorization
� Migration from local JWT to Cognito planned but not yet implemented

Current Access Control:

Token Auth Middleware Role Check Route Handler

Verify JWT Check user role

Extract user (product_admin,

Load services org_admin,

org_user)

Attach to req.user

## 3.2 Current Database Schema

The Customer Portal database contains the following core tables:

# 1. Tenant Table

Represents customer organizations.

Key Fields:

� `id` (UUID) - Primary key
� `org_name` - Organization name
� `status` - 'active' or 'inactive'
� `country` - Country code (e.g., 'IN', 'US')
� `email`, `phone` - Contact information
� `logo_key` - S3 key for organization logo
� `ic_billing_user_id` - Legacy billing user ID
� `ic_customer_id` - Legacy customer ID
� Product permissions (boolean flags):

- perm_invoice - Invoice processing permission
- perm_cad_table - CAD table extraction permission
- perm_cad_checklist - CAD checklist extraction permission
- perm_eob - EOB processing permission

� Configuration:

- users_allowed - Maximum users for this tenant
- invoice_max_mb, cad_max_mb, eob_max_mb - File size limits
- max_concurrent_jobs - Concurrent processing limit
- log_retention_value, log_retention_unit - Log retention policy
- output_retention_value, output_retention_unit - Output retention policy
  Current Issues:

� Product permissions are hardcoded boolean fields (not extensible for new products)
� No representation of subscriptions or billing status
� No link to Zoho subscription IDs
� Mixed legacy and current billing identifiers

# 2. User Account Table

Represents individual users within tenants.
Key Fields:

� `id` (UUID) - Primary key
� `tenant_id` (UUID) - Foreign key to tenant (nullable for product_admin)
� `email` (TEXT, UNIQUE) - User email address
� `first_name`, `last_name` - User name
� `phone` - Contact phone number (optional)
� `profile_picture_key` - S3 key for profile picture
� `role` - Enum: 'product_admin', 'org_admin', 'org_user'
� `status` - Enum: 'invited', 'active', 'inactive'
� `is_admin` (BOOLEAN) - Admin flag (legacy, not actively used)
� Authentication fields:

- cognito_sub - Cognito user identifier (for future Cognito integration)
- password_hash - Bcrypt hash (for local auth bypass mode)
- failed_login_attempts - Failed login counter
- locked_until - Account lockout expiry timestamp
- last_failed_login_at - Last failed login timestamp

� Activation fields:

- activation_token - Secure token for account activation
- activation_token_expires_at - Token expiry (24 hours)
  Current Model:

� **One user belongs to one tenant** (tenant_id foreign key)
� Exception: `product_admin` users have `tenant_id = NULL` and operate across all tenants
� User email is globally unique across all tenants

Current Issues:

� No MFA support
� Product_admin is overloaded (should have separate roles for support vs finance)
� Cognito integration incomplete

# 3. User Screen Grant Table

Represents per-user permissions for product features.
Key Fields:

� `id` (UUID) - Primary key
� `user_id` (UUID) - Foreign key to user_account
� `screen_code` - Enum: 'invoices', 'cad_table', 'cad_checklist', 'eob'
� `granted` (BOOLEAN) - Whether permission is granted

Current Model:

� Each user has rows for each feature they can access
� Tenant-level permissions (tenant.perm\_\*) combined with user-level grants
� Typical flow: Check tenant has permission Check user has grant

Current Issues:

� Hardcoded screen_code enum (not extensible for new products)
� No product namespace (all features assumed to be Customer Portal)
� Duplicate of tenant-level permissions (redundant)

# 4. Audit Event Table

Tracks administrative actions and security events.
Key Fields:

� `id` (UUID) - Primary key
� `tenant_id` (UUID, nullable) - Related tenant
� `actor_user_id` (UUID, nullable) - User who performed action
� `event_type` (TEXT) - Event type (e.g., 'user_created', 'tenant_updated')
� `event_payload` (JSONB) - Event-specific data
� `ip` (TEXT) - Source IP address
� `created_at` (TIMESTAMPTZ) - Event timestamp

Current Strengths:

� Comprehensive audit trail
� Flexible JSONB payload for event data
� Indexed for fast queries

Current Issues:

� Event types not standardized (string values)
� No built-in rotation or archival

# 5. Job History Table

Tracks document processing jobs (product-specific data).

Key Fields:

� `id` (UUID) - Primary key
� `job_id` (TEXT, UNIQUE) - External API job ID
� `tenant_id` (UUID) - Foreign key to tenant
� `user_id` (UUID) - Foreign key to user_account
� `api_type` - Enum: 'cad_table', 'cad_checklist', 'invoices'
� `status` - Enum: 'queued', 'processing', 'completed', 'failed', 'timeout', 'expired',

'processing_results', 'result_failed'
� `file_name`, `file_size` - Input file metadata
� `file_s3_key` - S3 key for input file
� `result_json_s3_key`, `result_excel_s3_key` - Output files
� `job_metadata` (JSONB) - Flexible metadata
� `error_message` - Error details (if failed)
� Timestamps: `submitted_at`, `completed_at`, `created_at`, `updated_at`

Current Model:

� Product-specific data (stays in Customer Portal database)
� Should NOT move to SSO (business logic, not identity)

# 6. Password Reset Token Table

Manages password reset flow.

Key Fields:

� `id` (UUID) - Primary key
� `user_id` (UUID) - Foreign key to user_account
� `token_hash` (TEXT, UNIQUE) - SHA-256 hash of reset token
� `expires_at` (TIMESTAMPTZ) - Token expiry (24 hours)
� `used_at` (TIMESTAMPTZ, nullable) - Timestamp when token was used (single-use
enforcement)

Current Strengths:
� Secure token handling (hashed, single-use, time-limited)
� Proper cascade delete on user deletion

## 3.3 Current Pain Points

# 1. No Multi-Product Support

Problem: Database schema assumes single product (Customer Portal).
Evidence:
� `user_screen_grant.screen_code` is an enum with hardcoded features
� `tenant.perm_*` are boolean flags for specific features
� No concept of "products" or "subscriptions"

Impact:
� Cannot add new products without database schema changes
� Cannot manage permissions per product
� Cannot bill separately per product

# 2. Authentication Fragmentation Risk

Problem: Each new product would need to replicate authentication logic.
Evidence:
� Auth logic tightly coupled to Customer Portal codebase
� No reusable auth service
� Cognito integration incomplete

Impact:
� Duplicated code across products
� Inconsistent security implementations
� Harder to maintain and audit

# 3. Limited Billing Visibility

Problem: Billing data lives in Zoho; customers cannot self-serve.
Evidence:
� No billing UI in Customer Portal
� Tenant table has legacy billing IDs but no current state
� No webhook integration to sync Zoho events

Impact:
� Support team handles routine billing questions
� Customers cannot upgrade/downgrade themselves
� No visibility into subscription status within product

# 4. Manual Tenant Onboarding

Problem: New tenants must be manually created by product_admin.
Evidence:
� No self-service signup flow
� Admin creates tenant Admin creates first user Sends activation email
� Manual coordination for multi-product access

Impact:
� Slow onboarding (1-2 days typical)
� Support burden
� Poor customer experience

# 5. Unclear Product Admin Roles

Problem: Single product_admin role used for support, finance, and super admins.
Evidence:
� `user_account.role` enum has only one admin role
� No distinction between support staff and finance staff
� `is_admin` boolean flag not actively used

Impact:
� Cannot restrict financial data to finance team
� Audit trail doesn't distinguish admin types
� Compliance risk (excessive access)

## 3.4 Current Strengths (To Preserve)

# 1. Solid Multi-Tenancy Foundation

Strengths:
� Clean tenant isolation (tenant_id foreign keys throughout)
� Row-level security can be enforced at ORM level
� Indexes optimized for tenant-scoped queries

Strategy: Extend, don't replace the tenant model for multi-product.

# 2. Working Authentication Pattern

Strengths:
� JWT tokens work well in development
� Clear path to Cognito for production
� Security features: password policy, account lockout, secure password reset

Strategy: Adapt existing auth patterns for SSO service.

# 3. Comprehensive Audit Logging

Strengths:

� All significant actions logged
� Flexible JSONB payload
� Indexed for performance

Strategy: Extend to SSO and Billing BFF; maintain same patterns.

# 4. Established Zoho Integration

Strengths:

� Zoho Billing accounts configured and working
� Plans, pricing, and payment gateway set up
� Live customers managed successfully

Strategy: Enhance with webhooks and Hosted Pages; keep Zoho as system of record.

# 5. Clean Database Design

Strengths:

� Proper foreign keys and referential integrity
� UUIDs for primary keys (good for distributed systems)
� Timestamps on all tables
� Drizzle ORM provides type safety

Strategy: Migrate existing schema to SSO with minimal changes; add new tables for multi-
product.

# 6. Production Readiness

Strengths:

� Live paying customers
� Proven at scale
� Monitoring and logging in place

Strategy: Maintain existing Customer Portal during migration; zero downtime cutover.

## 3.5 Migration Implications

Data to Migrate:

Data Type Current Location Future Location Strategy
Tenants Customer Portal DB SSO DB Export Transform
Import
Users Customer Portal DB SSO DB Export Transform
Import
User-Tenant user*account.tenant_id SSO DB Preserved 1:1
associations relationship
Product permissions tenant.perm*\*, SSO DB (new tables) Transform boolean
user_screen_grant flags subscription
model
Job history Customer Portal DB Customer Portal DB No migration (stays in
product)
Audit events Customer Portal DB Both DBs Historical stays; new
events to SSO

Schema Changes Required: 43. **Customer Portal (post-migration):**

- Keep jobhistory, auditevent tables
- Add reference tables (userreference, tenantreference) mapping SSO IDs to local IDs
- Deprecate (but keep temporarily): tenant, useraccount, userscreen_grant

44. **SSO (new):**

- Create: products, tenantproductsubscriptions, product_entitlements
- Import: tenant data, user data
- Transform: permissions from boolean flags to entitlement records
  Migration Approach:

45. **Dual-Mode Operation (2-4 weeks)**

- SSO service deployed
- Customer Portal supports BOTH local auth AND SSO auth (feature flag)
- New users SSO
- Existing users Local auth (until migrated)

46. **Data Migration (1 week)**

- Export existing tenants/users
- Create corresponding records in SSO
- Create Customer Portal subscription for all tenants
- Map permissions to entitlements

47. **Gradual Rollout (2-3 weeks)**

- Internal testing with SSO tokens (iTech admins)
- Beta customers opt-in to SSO (5-10 customers)
- Monitor for issues
- Batch migrate remaining customers (50-100 per day)

48. **Cutover (1 week)**

- All users migrated to SSO
- Disable local auth in Customer Portal
- Keep old tables for 90 days (rollback safety)
- Update documentation

# 4. TARGET ARCHITECTURE

This section describes how the new system will work, from a high-level perspective down to
specific components and data flows.

## 4.1 High-Level Architecture Overview

Plain English Explanation:

The new architecture separates concerns into three main systems:

49. **SSO Service** - The "identity provider" that knows who users are, which organizations
    they belong to, and what products they can access. This runs as a separate service and is
    the single source of truth for authentication.

50. **Account Center + Billing BFF** - The customer-facing application where users manage
    their profile, security settings, organization, and billing. The "BFF" (Backend-for-Frontend) is
    an API layer that talks to Zoho and SSO on behalf of the UI.

51. **Products** (Customer Portal, InvoX, etc.) - Individual iCaptur applications that users
    actually work in. These products trust the SSO service to tell them who the user is and what
    they can do.

High-Level Diagram:

End Users

(Customers)

HTTPS

app.icaptur.ai

(Account Center)

- Dashboard

- Settings
- Profile

- Security

- Billing

- Organization

- Experience

Platform (TBD)

SSO Service Billing Zoho Products

(sso.icaptur.ai) BFF Billing

- Customer

- Authentication - Zoho - India Portal

- User Mgmt Client (INR) - InvoX

- Tenant Mgmt - Hosted - iRepo

- Permissions Pages - Intl - DocFennec

- Token Issuance - Webhooks (USD)

- OIDC Provider

Service-to-Service Auth (JWT)

PostgreSQL

(SSO Database)

- users

- tenants

- products

- subscriptions

- entitlements

Key Characteristics:

52. **Separation of Concerns**

- SSO: Identity and access management only
- Billing BFF: Billing operations only
- Products: Business logic only

53. **Single Source of Truth**

- SSO owns: users, tenants, subscriptions, permissions
- Zoho owns: invoices, payments, plans, pricing
- Products own: job data, documents, product-specific state

54. **Stateless Services**

- All services are stateless (no server-side sessions beyond SSO cookies)
- Horizontal scaling possible
- Failures don't lose state

55. **Event-Driven Billing**

- Zoho sends webhooks on subscription changes
- Billing BFF processes webhooks and updates SSO
- Products see updated permissions on next token refresh

## 4.2 System Components

### 4.2.1 SSO Service (icaptur-sso Repository)

Purpose:

The SSO Service is the centralized identity and access management system for the entire
iCaptur.AI platform. It handles:

� User authentication (login, logout, token refresh)
� User and tenant management (CRUD operations)
� Product subscription management
� Permission distribution
� OIDC/OAuth2 token issuance

Technologies: Technology
Node.js 22
Component NestJS 10
Runtime Fastify
Framework PostgreSQL 15+
HTTP Adapter Drizzle
Database class-validator, class-transformer
ORM nestjs-pino
Validation @nestjs/swagger (OpenAPI 3.0)
Logging
API Documentation

Key Modules: 56. **Auth Module** (`src/modules/auth/`)

- OIDC/OAuth2 authorization flows
- Token issuance (access + refresh + ID tokens)
- Token refresh and revocation
- MFA (TOTP) support
- Password reset flows

57. **Users Module** (`src/modules/users/`)

- User CRUD operations
- User profile management
- User status management (invited, active, inactive)
- Password management

58. **Tenants Module** (`src/modules/tenants/`)

- Tenant CRUD operations
- Tenant settings and configuration
- Tenant status management

59. **Products Module** (`src/modules/products/`)

- Product catalog management
- Product feature definitions

60. **Subscriptions Module** (`src/modules/subscriptions/`)

- Tenant-product subscription management
- Subscription status tracking
- Zoho subscription ID mapping

61. **Permissions Module** (`src/modules/permissions/`)

- Permissions API endpoint
- Entitlements API endpoint (future)
- Permission caching and invalidation

62. **Admin Module** (`src/modules/admin/`)

- iTech admin user management
- Tenant onboarding flows
- Support tools (impersonation, account lookup)
  Deployment:
  � **URL:** `https://sso.icaptur.ai` (internal service, not directly user-facing)
  � **Environment:** AWS ECS Fargate or EC2
  � **Database:** AWS RDS PostgreSQL (Multi-AZ for production)
  � **Secrets:** AWS Secrets Manager
  � **Monitoring:** CloudWatch Logs, Metrics, Alarms

APIs Exposed:

https://sso.icaptur.ai/api/v1/

Authentication: # Initiate OIDC login

- POST /auth/login # Handle OIDC callback
- POST /auth/callback # Logout
- POST /auth/logout # Refresh access token
- POST /auth/refresh # Get current user info
- GET /auth/me # Public keys for JWT validation
- GET /.well-known/jwks.json

Permissions: # Get user permissions for product (from token

- GET /permissions/me
  aud)

Users (Admin): # Create user

- POST /admin/users # List users
- GET /admin/users # Get user
- GET /admin/users/:id # Update user
- PUT /admin/users/:id # Delete user
- DELETE /admin/users/:id

Tenants (Admin): # Create tenant

- POST /admin/tenants # List tenants
- GET /admin/tenants # Get tenant
- GET /admin/tenants/:id # Update tenant
- PUT /admin/tenants/:id # Delete tenant
- DELETE /admin/tenants/:id

Subscriptions (Admin):

- POST /admin/subscriptions # Create subscription

- GET /admin/subscriptions # List subscriptions

- PUT /admin/subscriptions/:id # Update subscription

Health: /health # Basic health check

- GET /health/ready # Readiness (includes DB check)
- GET /metrics # Prometheus metrics
- GET

Security:

� All endpoints require authentication (except public JWKS endpoint)
� Admin endpoints require `icaptur_*_admin` role
� Service-to-service calls use JWT with service credentials
� Rate limiting: 1000 req/min per IP, 100 req/min per user
� CORS: Explicit origin allowlist per environment

### 4.2.2 Account Center + Billing BFF (icaptur-accounts Repository)

Purpose:
This is a monorepo containing:

63. **Account Center UI** - Customer-facing web application
64. **Billing BFF** - Backend service for billing operations
65. **Experience Platform UI** - Sandbox for trying APIs (structure only for Phase 1)

Monorepo Structure:

icaptur-accounts/ # Account Center UI (React)
apps/ # Experience Platform (React, TBD)
accounts-web/
experience-web/ # Billing BFF (NestJS)
services/ # Experience API (NestJS, TBD)
billing-bff/
experience-api/ # Shared TypeScript types
packages/ # Generated SDK from OpenAPI
types/ # Shared UI components
sdk-billing-bff/
ui/

Account Center UI (accounts-web):

� **Technology:** React 18 + Vite + Fluent UI v9 + MobX 6 + React Query
� **Purpose:** User-facing application for profile, settings, billing
� **URL:** `https://app.icaptur.ai`
� **Key Pages:**

- / - Dashboard (landing page after login)
- /settings/profile - User profile management
- /settings/security - Password, MFA settings
- /settings/billing - Billing management (plans, invoices, payment)
- /settings/organization - Team and role management
- /[experience-routes] - Experience Platform features (TBD)
  Billing BFF Service (billing-bff):
  � **Technology:** NestJS 10 + Fastify + PostgreSQL (minimal DB, mostly proxying)
  � **Purpose:** Mediate between Account Center UI and Zoho Billing
  � **URL:** `https://app.icaptur.ai/api/v1/billing` (proxied through gateway)
  � **Key Responsibilities:**

- Translate Zoho API responses to UI-friendly DTOs
- Create Zoho Hosted Page sessions
- Process Zoho webhooks
- Update SSO entitlements when subscriptions change
- Audit billing actions
  APIs Exposed (Billing BFF):

https://app.icaptur.ai/api/v1/billing/

User-Facing:

- GET /me/billing/summary # Summary (plan, status, renewal,

payment method tail)

- GET /me/billing/invoices # List invoices with download URLs

- POST /me/billing/checkout # Create Hosted Page for

upgrade/purchase

- POST /me/billing/payment-method/update # Create Hosted Page for payment method

update

- POST /me/billing/cancel # Cancel subscription

- POST /me/billing/resume # Resume canceled subscription (if at

period end)

Webhooks: # Zoho webhook receiver (HMAC + IP

- POST /\_hooks/zoho
  verified)

Health: /health

- GET /health/ready
- GET /metrics
- GET

Deployment:

� **accounts-web:** Static site on S3 + CloudFront OR deployed on same server as BFF
(served via Fastify static)

� **billing-bff:** AWS ECS Fargate or EC2
� **Database:** Optional small RDS instance for webhook idempotency store (or use Redis)
� **Secrets:** AWS Secrets Manager (Zoho credentials)

### 4.2.3 Products (Separate Repositories)

Customer Portal (Existing - To Be Migrated):

� **Repository:** `icaptur-api-customer-portal-v1`
� **URL:** `https://portal.icaptur.ai`
� **Technology:** React 18 + Node.js 22 + PostgreSQL
� **Changes Needed:**

- Replace local auth with SSO redirect
- Validate SSO tokens instead of local JWT
- Call SSO permissions API for user entitlements
- Keep job_history and product-specific data
  Future Products:
  � **InvoX:** `icaptur-invox` - Invoice processing product
  � **iRepo:** `icaptur-irepo` - Document repository
  � **DocFennec:** `icaptur-docfennec` - Document intelligence
  � **Others:** As roadmap expands

Integration Pattern (All Products): 66. **Redirect to SSO for Login**

```javascript
// User clicks "Login" button
window.location.href =
'https://sso.icaptur.ai/auth/login?product=customerportal&redirecturi=https://portal.icaptur.ai/call
back';
```

67. **Receive Token from SSO**

```javascript
// SSO redirects back with authorization code
const code = new URLSearchParams(window.location.search).get('code');
// Exchange code for token (backend call to SSO)
const tokens = await fetch('https://sso.icaptur.ai/auth/callback', {
  method: 'POST',
  body: JSON.stringify({ code, product: 'customer_portal' }),
});
```

68. **Validate Token on Each Request**

```javascript
// Backend middleware
const token = req.headers.authorization.replace('Bearer ', '');
const jwks = await fetchJWKS('https://sso.icaptur.ai/.well-known/jwks.json');
const payload = await jwtVerify(token, jwks, {
  issuer: 'https://sso.icaptur.ai',
  audience: 'customer_portal',
});
req.user = payload; // { sub, email, tenant_id, role, aud }
```

69. **Check Permissions**

```javascript
// Call SSO permissions API (cache result for 15 minutes)
const permissions = await fetch('https://sso.icaptur.ai/api/v1/permissions/me', {

headers: { Authorization: Bearer ${token} }
});
// permissions = { permissions: ['cad_table', 'invoices', 'eob'] }
if (!permissions.permissions.includes('cad_table')) {

return res.status(403).json({ error: 'Feature not enabled' });
}
```

### 4.2.4 Zoho Billing (External Service)

Purpose:

Zoho Billing is the system of record for:

� Product catalog (plans, add-ons, pricing)
� Customer subscriptions
� Invoices and payments
� Payment methods (cards, ACH, etc.)
� Tax calculation and compliance
� Dunning and retry logic

We do NOT:

� Store pricing or plan details
� Process payments directly
� Calculate taxes
� Generate invoices
� Store card numbers

We DO:

� Create Hosted Page sessions (checkout, payment method update)
� Receive webhooks for subscription lifecycle events
� Sync subscription status to SSO (active, past_due, canceled, etc.)
� Display invoice list and provide download links
� Show payment method (last 4 digits, brand)

Multi-Region Setup:

Region Customers Currency Zoho Account API Base URL
India India-based INR
(country = 'IN') Zoho India https://billing.zoho.in/api/v1
International All other USD Zoho https://billing.zoho.com/api/v1
countries International

Routing Logic:

function getZohoConfig(tenant) {
if (tenant.country === 'IN') {
return {
region: 'india',
baseUrl: 'https://billing.zoho.in/api/v1',
credentials: getSecretsManager('zoho-india-credentials')
};
} else {
return {
region: 'international',
baseUrl: 'https://billing.zoho.com/api/v1',
credentials: getSecretsManager('zoho-international-credentials')
};
}

}

Zoho APIs Used:

API Endpoint Purpose
POST /hostedpages/newsubscription Create checkout page
POST /hostedpages/updatecard Create payment method update page
GET /subscriptions/:id Get subscription details
POST /subscriptions/:id/cancel Cancel subscription
GET /invoices List customer invoices
GET /invoices/:id/pdf Download invoice PDF

Webhooks from Zoho:

Zoho sends POST requests to our webhook endpoint when events occur:

Event Trigger Our Action
subscription_created New subscription started Create subscription record in
SSO, grant entitlements
subscription_renewed Subscription renewed Update next_billing_date in SSO
subscription_changed Plan changed Update entitlements in SSO
subscription_canceled Subscription canceled Revoke entitlements in SSO
(immediately or at period end)
subscription_expired Trial or subscription expired Revoke entitlements in SSO
invoice_created New invoice generated Update tenant billing status in
SSO (optional)
invoice_paid Payment successful Update billing_status to 'active'
in SSO
payment_failed Payment failed Update billing_status to
'past_due' in SSO

## 4.3 Data Flow Diagrams

### 4.3.1 User Login Flow

Plain English:

When a user wants to log in, they go to any iCaptur product or the Account Center. The product
redirects them to the SSO service, where they enter their email and password. After successful
authentication, SSO creates a session and redirects the user back to the product with an
authorization code. The product exchanges this code for a token and stores it securely.

Detailed Flow:

User Product SSO

(or Account Service

Center)

# 1. Click "Login"

>

# 2. Redirect to SSO

GET /auth/login?product=

customer_portal&

redirect_uri=...

<

# 3. Display login form

<

# 4. Submit email + password

>

# 5. Validate credentials

Check password

Check MFA (if enabled)

Create session

# 6. Redirect back with code

<

GET redirect_uri?code=xyz123

# 7. Exchange code for token

POST /auth/callback

{ code, product }

>

# 8. Return token

{ access_token, refresh... }

<

# 9. Redirect to dashboard 10. Store token securely

< (localStorage or cookie)

Key Points:

� **Step 2:** Product doesn't handle credentials; delegates to SSO
� **Step 5:** SSO performs authentication (password check, MFA, account lockout)
� **Step 6:** Authorization code is short-lived (30 seconds), single-use
� **Step 7:** Backend exchanges code (keeps token off frontend if using httpOnly cookies)
� **Step 8:** Token includes `aud` field specific to requesting product

### 4.3.2 Token Issuance Flow (Product-Specific)

Plain English:

Each product gets its own token with a specific "audience" (aud field) that identifies the product.
This prevents a token meant for Customer Portal from being used to access InvoX. When a
user accesses multiple products, they get separate tokens for each, but they don't have to log in
again because SSO remembers their session.

Detailed Flow:

User has active SSO session

Customer SSO InvoX

Portal Service Product

# 1. Request token

GET /auth/login?

product=customer_portal

>

# 2. Check session

(session exists,

no re-auth needed)

# 3. Issue token

{ aud: "customer_portal" }

<

# 4. Request token

GET /auth/login?

product=invox

<

# 5. Check session

(session exists,

no re-auth needed)

# 6. Issue token

{ aud: "invox" }

>

Token Contents:
Customer Portal Token:

{
"sub": "user-uuid-123",
"email": "john@acme.com",
"tenant_id": "tenant-uuid-456",
"role": "org_admin",
"iss": "https://sso.icaptur.ai",
"aud": "customer_portal", Product identifier
"exp": 1699999999,
"iat": 1699996399

}

InvoX Token:

{

"sub": "user-uuid-123", Same user

"email": "john@acme.com",

"tenant_id": "tenant-uuid-456", Same tenant

"role": "org_admin",

"iss": "https://sso.icaptur.ai",

"aud": "invox", Different product

"exp": 1699999999,

"iat": 1699996399

}

Security Benefit:

If an attacker steals the Customer Portal token, they cannot use it to access InvoX because:

# 70. InvoX validates the `aud` field

# 71. Token validation fails if `aud !== "invox"`

# 72. Each product only accepts tokens issued specifically for it

### 4.3.3 Permission Check Flow

Plain English:

When a user tries to use a feature (e.g., upload a CAD file), the product checks if they have
permission. The product sends the user's token to the SSO permissions API. SSO reads the
aud field from the token to know which product is asking, then returns the list of features the
user can access for that product. The product caches this response for 15 minutes to avoid
hitting SSO on every request.

Detailed Flow:

User Product SSO

(Customer Service

Portal)

# 1. Try to access

CAD feature

>

# 2. Check permissions

(cache miss)

# 3. Call SSO API

GET /permissions/me

Authorization: Bearer

{token}

>

# 4. Validate token

- Verify signature

- Check expiry

- Extract aud

# 5. Query DB

- Find tenant

- Find subscription

(where product

= token.aud)

- Get entitlements

# 6. Return permissions

{ permissions: [

'cad_table',

'invoices', 'eob'

]}

<

# 7. Cache result

(15 min TTL)

# 8. Check permission

'cad_table' in list

YES, allow

# 9. Feature allowed

<

Caching Strategy:

// Product backend code (conceptual)
class PermissionsService {

cache = new Map(); // or Redis

async getPermissions(token) {
const cacheKey = `perms:${token.sub}:${token.aud}`;

// Check cache first
if (this.cache.has(cacheKey)) {

return this.cache.get(cacheKey);
}

// Cache miss - call SSO
const response = await fetch('https://sso.icaptur.ai/api/v1/permissions/me', {

headers: { Authorization: `Bearer ${token}` }
});
const permissions = await response.json();

// Cache for 15 minutes
this.cache.set(cacheKey, permissions, { ttl: 15 _ 60 _ 1000 });

return permissions;
}
}

Cache Invalidation:

When a subscription changes (upgrade, downgrade, cancel), the Billing BFF can optionally call
SSO to invalidate cached permissions:

// Optional endpoint on SSO
POST /api/v1/permissions/invalidate
{ tenant_id: 'tenant-uuid', product_code: 'customer_portal' }

// SSO broadcasts cache invalidation (Redis PUBLISH)
// Products listening can clear their cache

### 4.3.4 Billing Update Flow (Zoho BFF SSO)

Plain English:

When a customer upgrades their plan or updates their payment method, they interact with
Zoho's secure pages. Once the action completes, Zoho sends a webhook notification to our
Billing BFF. The BFF verifies the webhook is legitimate, updates our subscription records, and
tells SSO to update the user's permissions. The next time the user's token expires (within 1
hour), they'll get a new token with the updated permissions.

Detailed Flow:

SSO
User Account Zoho Billing Service

Center Billing BFF

# 1. Click

"Upgrade"

>

# 2. Create

Hosted Page

POST /billing/

checkout

>

# 3. Call Zoho

POST /hosted

pages/

new...

<

# 4. Return URL 5. Return

{ hostedPageUrl } Hosted

<

Page URL

# 6. Redirect

to Zoho

<

# 7. Enter

payment

details

>

# 8. Process

payment

(Razorpay)

# 9. Redirect

back

<

# 10. WEBHOOK

POST /\_hooks/

zoho

{event:

subscription\_

changed}

>

# 11. Verify

HMAC

Check IP

Check

idempo-

tency

# 12. Update

SSO

POST /admin/

subs/:id

>

# 13. Update

entitle-

ments

# 14. Return

<

15. 200 OK

<

# 16. User's

next

token
refresh

includes

new

features

Webhook Security:

// Billing BFF webhook handler (conceptual)
async function handleZohoWebhook(req, res) {

// 1. Verify HMAC signature
const signature = req.headers['x-zoho-signature'];
const computed = crypto.createHmac('sha256', webhookSecret)

.update(req.body)
.digest('hex');

if (signature !== computed) {
return res.status(401).json({ error: 'Invalid signature' });

}

// 2. Verify IP address
const clientIp = req.ip;
if (!zohoIpAllowlist.includes(clientIp)) {

return res.status(403).json({ error: 'IP not allowed' });
}

// 3. Check idempotency
const eventId = req.body.event_id;
if (await db.webhookProcessed(eventId)) {

return res.status(200).json({ message: 'Already processed' });
}

// 4. Process webhook
await processSubscriptionChanged(req.body);

// 5. Mark as processed
await db.markWebhookProcessed(eventId);

// 6. Return success
res.status(200).json({ message: 'Webhook processed' });
}

### 4.3.5 Webhook Processing Flow (Detailed)

Plain English:

Zoho sends webhook notifications for important events (subscription created, canceled,
payment failed, etc.). Our Billing BFF receives these webhooks, verifies they're legitimate,
updates our records, and triggers any necessary actions (like revoking access when a
subscription is canceled). If processing fails, we retry a few times and then put the webhook in a
"dead letter queue" for manual review.
Detailed Flow:

Zoho Billing BFF SSO

Billing Service Service

# 1. Event occurs

(subscription_canceled)

# 2. Send webhook

POST /\_hooks/zoho

{

event_id: 'evt_123',

event_type:

'subscription_canceled',

subscription: {

id: 'sub_456',

status: 'canceled',

...

}

}

>

# 3. Verify HMAC signature

(webhook secret)

# 4. Verify IP in allowlist

(Zoho IPs only)

# 5. Check idempotency store

SELECT \* FROM webhook_log

WHERE event_id='evt_123'

Not found (new event)

# 6. Store in processing state

INSERT INTO webhook_log

(event_id, status='processing')

# 7. Parse event type

subscription_canceled

# 8. Look up tenant

(by zoho_subscription_id)

SELECT \* FROM tenant_product

\_subscriptions

WHERE zoho_subscription_id

='sub_456'

Found tenant 'Acme Corp'

# 9. Update subscription record

UPDATE tenant_product_subs

SET status='canceled',

canceled_at=NOW()

# 10. Call SSO Admin API

PUT /admin/subscriptions/:id

{ status: 'canceled' }

>

11.

Revoke

entitlements

DELETE FROM

product\_

entitlements

# 12. Success

<

# 13. Write audit event

INSERT INTO audit_event

(event*type='subscription*

canceled_via_webhook')

# 14. Mark webhook processed

UPDATE webhook_log

SET status='processed'

# 15. Return 200 OK

<

Error Handling & Retry:

If processing fails (step 10-12):

# 1. Mark webhook_log status='failed'

# 2. Retry after 1 minute (exponential backoff)

# 3. Retry after 5 minutes

# 4. Retry after 15 minutes

# 5. After 3 failed attempts:

- Move to Dead Letter Queue (DLQ)
- Alert DevOps (PagerDuty, Slack, etc.)
- Log full event payload for manual review

DLQ Review Process:

- DevOps investigates why webhook failed
- Fix underlying issue (e.g., SSO was down)
- Replay webhook manually from DLQ
- Mark as resolved

Idempotency Guarantee:

// Even if Zoho sends the same webhook twice (network retry),
// we process it only once:
SELECT \* FROM webhook_log WHERE event_id = 'evt_123';

If found:
Return 200 OK immediately (already processed)

If not found:
Process webhook
INSERT into webhook_log
Return 200 OK

## 4.4 Integration Points

This section summarizes how the major components interact with each other.

Integration Matrix:

From To Protocol Authentication Purpose
Account Center Billing BFF HTTPS/REST Bearer token (user) Fetch billing data,
UI HTTPS/REST initiate actions
Account Center SSO Service (OIDC) Redirect + User login, logout,
UI HTTPS/REST authorization code token refresh
Billing BFF Zoho Billing OAuth 2.0 (client Create Hosted
HTTPS/REST credentials) Pages, fetch
Billing BFF SSO Service HTTPS/POST subscriptions/invoices
Zoho Billing Billing BFF (Webhooks) Service JWT Update subscriptions
HTTPS/REST and entitlements
Products SSO Service HMAC signature + Notify
TCP/5432 IP allowlist subscription/payment
All Services PostgreSQL HTTPS/REST events
All Services HTTPS/REST Bearer token (user) Login redirect, token
All Services AWS S3 validation,
Username/password permissions
AWS Secrets (TLS) Data persistence
Manager AWS IAM role or
access keys File storage (logos,
AWS IAM role documents)
Retrieve secrets (DB
passwords, API keys)

Key Integration Patterns: 73. **Frontend Backend:**

- Always use bearer tokens (JWT)
- All requests go through API Gateway (unified domain)
- CORS configured per environment

74. **Service Service:**

- Use service-specific JWT tokens (long-lived, rotated periodically)
- Mutual TLS (mTLS) in production (optional, recommended)
- Service discovery via DNS or API Gateway

75. **External Internal (Webhooks):**

- HMAC signature verification (shared secret)
- IP allowlist (Zoho IPs only)
- Idempotency keys (prevent duplicate processing)

76. **Internal External (Zoho, AWS):**

- OAuth 2.0 client credentials (Zoho)
- AWS IAM roles (S3, Secrets Manager)
- Retry logic with exponential backoff
- Circuit breakers for external failures

## 4.5 Deployment Architecture

Environment Structure:

Environment Purpose URL Pattern Deployment Database
Local Development on localhost:3000, Docker Compose PostgreSQL (local
Dev laptop localhost:5173 container)
Shared dev.icaptur.ai, AWS ECS or EC2 AWS RDS (dev
Staging development sso-dev.icaptur.ai instance)
environment
Pre-production staging.icaptur.ai, AWS ECS or EC2 AWS RDS
testing sso- (separate from
staging.icaptur.ai AWS ECS prod, similar
Production Live customer Fargate (HA) config)
environment app.icaptur.ai,
sso.icaptur.ai AWS RDS Multi-
AZ (production
grade)

AWS Infrastructure (Production):

AWS Cloud

Route 53 (DNS)

- app.icaptur.ai

- sso.icaptur.ai

CloudFront (CDN, optional for static)

Application Load Balancer (ALB)

- SSL/TLS termination (ACM certificates)

- Health checks

- Target groups per service

ECS Fargate ECS Fargate

(SSO Service) (Billing BFF)

- Auto-scaling - Auto-scaling

- 2+ tasks (HA) - 2+ tasks (HA)

VPC (Private Subnets)

RDS PostgreSQL (Multi-AZ)

- Primary + Standby

- Automated backups (30 days)

- Encryption at rest

ElastiCache Redis (optional)

- Caching layer

- Session storage

S3 Buckets

- icaptur-sso-assets (private)

- icaptur-custportal-prod (private)

- Encryption at rest (SSE-S3 or SSE-KMS)

- Versioning enabled

Secrets Manager

- DB passwords

- Zoho API credentials

- JWT secrets

- Automatic rotation (90 days)

CloudWatch

- Logs from all services

- Metrics (CPU, memory, latency)

- Alarms (PagerDuty integration)

Deployment Strategy: 77. **Blue-Green Deployment:**

- Deploy new version to "green" environment
- Run health checks and smoke tests
- Switch traffic from "blue" to "green" (ALB target group)
- Monitor for errors
- Rollback to "blue" if issues detected (within 5 minutes)

78. **Database Migrations:**

- Always backward-compatible (additive only)
- Run migrations before deploying new code
- Use migration tool (Drizzle migrations)
- Test on staging first

79. **Zero-Downtime Requirements:**

- SSO Service: Must stay up during deployments (rolling updates)
- Products can be updated independently (no tight coupling)
- Database: RDS Multi-AZ handles failover automatically

End of Section 4 (Target Architecture)

# 5. ACTORS & PERMISSIONS MODEL

This section defines who the users are, what roles they have, and what capabilities each role
provides.

## 5.1 User Types Overview

Plain English:
There are two main categories of users: 80. **Regular Users** - Customers who work for a company (tenant) that subscribes to iCaptur

products. They belong to one organization and can only access their organization's data. 81. **iTech Staff** - Employees of iTech India who support customers and manage the platform.

They don't belong to any specific customer organization and can access multiple
organizations for support purposes.
Key Principle: One User = One Tenant (for Regular Users)
� A regular user's email belongs to exactly one tenant
� Example: `john@acme.com` belongs to "Acme Corp" tenant
� That same email cannot belong to "Beta Inc" tenant
� If someone works for multiple companies, they need separate email addresses

Exception: iTech Staff (No Tenant)

� iTech admin users have `tenant_id = NULL` in the database
� They operate across all tenants for support, finance, or administrative purposes

## 5.2 Regular User Roles

**Role 1: Organization Administrator (org_admin)**

Plain English: The main administrator for a company. They manage everything: users,
subscriptions, billing, and can use all product features their company has purchased.

Capabilities:

� Use all product features (if tenant has subscription)
� View and manage billing (upgrade, downgrade, cancel, view invoices)
� Add and remove users in their organization
� Assign roles to other users (can create more org_admins or org_users)
� Update organization settings
� View activity logs for their organization
� Cannot access other organizations' data
� Cannot create new tenants (only iTech staff can do this)

Database Representation:

user_account: -- Belongs to a specific tenant
role = 'org_admin'
tenant_id = [tenant-uuid]
status = 'active'

Typical Use Cases:

� Company admin signing up for iCaptur products
� Managing team members (invite, deactivate)
� Upgrading subscription when more features are needed
� Downloading invoices for accounting
� Managing organization profile and settings

**Role 2: Organization User (org_user)**

Plain English: A regular employee of a company. They can use the products their company
has subscribed to, but they cannot manage billing, add users, or change organization settings.
Capabilities:
� Use product features (based on user-specific permissions, if granted)
� Cannot view or manage billing
� Cannot add/remove users
� Cannot change organization settings
� Cannot view activity logs (unless feature granted)
� Cannot access other organizations' data

Database Representation:

user_account: -- Belongs to a specific tenant
role = 'org_user'
tenant_id = [tenant-uuid]
status = 'active'

user_product_permissions (optional per-user grants):
user_id = [user-uuid]
feature_code = 'cad_table' -- This user can use CAD features
is_granted = true

Typical Use Cases:

� Employees processing documents in Customer Portal
� Uploading files, viewing results, downloading outputs
� Using iCaptur APIs through their company's subscription
� Accessing product dashboards and reports

Permission Model for org_user:
By default, org_user inherits permissions from the tenant's subscription:

� If tenant has Customer Portal subscription with `cad_table` feature user can use it
� If tenant does NOT have `invoices` feature user cannot use it

Optional: User-Level Overrides:

� Organization admin can grant/revoke specific features per user
� Example: Tenant has all features, but one user should only access CAD features
� Stored in `user_product_permissions` table

## 5.3 iTech Admin Roles

Plain English:

iTech staff need different levels of access depending on their job:

� **Support admins** help customers with account issues but shouldn't see sensitive financial
data

� **Finance admins** need to see billing records for accounting but don't need to manage
users

� **Super admins** have full access (for senior staff or emergencies)
Common Characteristics (All iTech Admins):

� No `tenant_id` (not associated with any customer organization)
� Can view/access multiple tenants
� All actions audited (who did what, when, why)
� Use same login portal as customers (no separate admin portal)

**Role 3: iCaptur Support Administrator (icaptur_support_admin)**

Purpose: Customer support team members who help customers with onboarding,
troubleshooting, and account management.

Capabilities:
� View all tenants and users
� Create new tenants (onboarding)
� Create users for any tenant
� Update user information (name, email, phone)
� Activate/deactivate users
� Reset passwords for users
� View subscription status (active, canceled, trial)
� View product entitlements (what features a tenant has)
� Impersonate users for troubleshooting (with audit trail)
� Access support tools (account lookup, activity logs)
� View organization settings
� **Cannot see financial details:** Invoice amounts, payment methods, transaction history
� Cannot create/modify subscription pricing
� Cannot process refunds

Database Representation:

user_account:
role = 'icaptur_support_admin'
tenant_id = NULL -- No tenant association
status = 'active'

Typical Use Cases:

� Onboarding a new customer: Create tenant Create first user Send activation email
� Helping customer who forgot password: Reset password via admin panel
� Troubleshooting access issue: Impersonate user to see what they see
� Checking if a feature is enabled: View tenant's subscription entitlements

Audit Requirements:

� All actions logged with `actor_user_id` (support admin's ID)
� Impersonation logged with reason ("Customer reported error in CAD upload")
� Logs reviewed periodically for compliance

**Role 4: iCaptur Finance Administrator (icaptur_finance_admin)**
Purpose: Accounting/finance team members who need access to billing data for revenue
recognition, reconciliation, and financial reporting.
Capabilities:
� View all billing data: Invoices, payment methods, transaction history, revenue
� Export billing reports (all tenants, date ranges, CSV/Excel)
� View subscription details (plan, pricing, start date, renewal date)
� View past due accounts
� View refund history
� Access Zoho Billing dashboards (if integrated)
� **Cannot manage users:** Cannot create, edit, or delete users
� **Cannot manage tenants:** Cannot create or modify tenant settings
� Cannot impersonate users
� Cannot access product feature data (job history, documents)

Database Representation:

user_account:
role = 'icaptur_finance_admin'
tenant_id = NULL -- No tenant association
status = 'active'

Typical Use Cases:

� Monthly revenue report: Export all invoices for the month
� Reconciling payments: Match Zoho transactions to bank deposits
� Identifying past due accounts: Run report of tenants with overdue invoices
� Audit trail: Review subscription changes and cancellations

Data Access Restrictions:

� Can see: Invoice amounts, payment methods (masked, last 4 digits), payment dates
� Cannot see: User passwords, product job data, uploaded documents, API keys

**Role 5: iCaptur Super Administrator (icaptur_super_admin)**
Purpose: Senior iTech staff (e.g., CTO, Operations Lead) who need full access to all system
capabilities.
Capabilities:
� **All** capabilities of `icaptur_support_admin`
� **All** capabilities of `icaptur_finance_admin`
� Access all system settings and configurations
� Manage iTech admin users (create other admins)
� Override system restrictions (emergency access)
� View and manage SSO service configuration
� View and manage Zoho Billing integration settings
� Execute database migrations and system maintenance
� Full audit log access

Database Representation:

user_account:
role = 'icaptur_super_admin'
tenant_id = NULL -- No tenant association
status = 'active'

Typical Use Cases:

� Emergency: Production issue requires immediate access to diagnose
� Onboarding new support or finance team members
� System maintenance: Updating Zoho API credentials, rotating secrets
� Security incident: Investigating unauthorized access, reviewing audit logs
� Strategic decision: Exporting multi-product adoption metrics for business planning

Security Considerations:

� Limited to 2-3 super admin accounts (senior staff only)
� All actions audited with high visibility
� MFA required for all super admin accounts
� Access reviewed quarterly

## 5.4 Permission Hierarchy

Plain English:

Permissions flow from top to bottom:

82. **Tenant Level** - What products and features the organization has purchased
83. **User Role Level** - What capabilities the user's role provides
84. **User Permission Level** (optional) - Specific overrides for individual users

Example:

Tenant: Acme Corp
Subscription: Customer Portal (active)
Features: cad_table, invoices, eob
Max file size: 100 MB
Max concurrent jobs: 5

User: john@acme.com
Role: org_admin
Can use ALL features (cad_table, invoices, eob)
Can manage billing
Can manage users

User: jane@acme.com
Role: org_user
Can use features granted to her
User-specific grant: cad_table ONLY
Cannot use invoices or eob
Cannot manage billing
Cannot manage users

Permission Check Flow:

# 1. Check: Does user's token have valid signature and not expired?

NO: Reject (401 Unauthorized)
YES: Continue

# 2. Check: Does token's tenant_id match resource's tenant_id?

NO: Reject (403 Forbidden - wrong tenant)
YES: Continue

# 3. Check: Does tenant have active subscription for this product?

NO: Reject (403 Forbidden - no subscription)
YES: Continue

# 4. Check: Does tenant's subscription include this feature?

NO: Reject (403 Forbidden - feature not enabled)
YES: Continue

# 5. Check: Does user's role allow this action?

org_admin: Always allowed
org_user: Check user-specific grants
Has grant for feature: Allow
No grant for feature: Reject (403)

# 6. Action allowed

Database Query (Conceptual):

-- Check if user can access 'cad_table' feature in Customer Portal

-- Step 1: Get user and tenant
SELECT u.id, u.role, u.tenant_id
FROM user_account u
WHERE u.id = :user_id;

-- Step 2: Get tenant's subscription for Customer Portal
SELECT s.id, s.status, s.billing_status
FROM tenant_product_subscriptions s
JOIN products p ON s.product_id = p.id
WHERE s.tenant_id = :tenant_id

AND p.product_code = 'customer_portal'
AND s.status = 'active';
-- Step 3: Check if subscription has 'cad_table' entitlement
SELECT e.feature_code, e.is_granted
FROM product_entitlements e
WHERE e.subscription_id = :subscription_id

AND e.feature_code = 'cad_table'
AND e.is_granted = true;

-- Step 4 (if user.role = 'org_user'): Check user-specific permissions
SELECT p.is_granted
FROM user_product_permissions p
WHERE p.user_id = :user_id

AND p.subscription_id = :subscription_id
AND p.feature_code = 'cad_table';

-- Result:
-- If org_admin: Always allow (if steps 1-3 pass)
-- If org_user: Allow only if step 4 returns is_granted=true OR no row (inherit
from tenant)

## 5.5 Access Control Matrix

Comprehensive Matrix:

Capability org_adm org_us icaptur_support_a icaptur_finance_ad icaptur_super_ad
in er dmin
Authenticatio min min
n
Login to
Account
Center
Use SSO
across
products (if (if
Enable MFA subscribe granted (impersonate)
on own d) ) (impersonate)
account (if (if (all tenants)
Product subscribe granted
Usage d) ) (status only, no (full details)
Access amounts)
Customer
Portal

Upload/proce
ss
documents

View job
history (own
tenant)
Download
results
Billing

View
subscription
summary
View invoices

Download
invoices

Upgrade/cha

nge plan

Update (all tenants)
(all tenants)
payment (all tenants)
(all tenants)
method (all tenants)
(all tenants)
Cancel
(all tenants)
subscription (all tenants)
(all tenants)
User (all tenants)

Management

(Own Tenant)

View users in (all tenants)

org

Create users (all tenants)

in org

Edit users in (all tenants)

org

Delete users (all tenants)

in org

Assign user (all tenants)

permissions

Reset user (own (all tenants)

password users)

Organization

Management

View org (all tenants)

settings

Update org (all tenants)

profile

Upload org (all tenants)

logo

View activity (all tenants)

logs (own

org)

Tenant

Management

(Cross-

Tenant)

Create new

tenant

View all (billing data only)

tenants

Edit any

tenant

Delete tenant (with

confirmation)

Support

Tools

Impersonate

user

Access

support

dashboard

View support
tickets

Resend

activation

email

Finance

Tools
Export billing
(masked) (masked)
reports

View all

invoices (all

tenants)

View

payment

methods

View past

due accounts

System

Administratio

n

Manage

iTech admin

users

Configure

SSO settings

Configure

Zoho

integration

Run database

migrations

View system

logs

# 6. PRODUCT & SUBSCRIPTION MODEL

This section explains how products, subscriptions, and feature entitlements work in the
iCaptur.AI platform.

## 6.1 Products Catalog

Plain English:

A "product" in iCaptur.AI is a software application or service that customers can subscribe to.
Each product has its own features, its own codebase, and its own deployment. Products share
the SSO system for authentication but otherwise operate independently.

Product Definition:

A product consists of:

� **Unique code** - Technical identifier (e.g., `customer_portal`, `invox`)
� **Display name** - Customer-facing name (e.g., "iCaptur Customer Portal", "InvoX")
� **Feature set** - List of capabilities that product offers
� **Deployment** - Separate URL and infrastructure
� **Codebase** - Separate repository

Current Products:

Product Code Product Name Status Description URL
customer_portal iCaptur Customer Live Document https://portal.icaptur.ai
Portal processing
platform (CAD,
invoices, EOB)

Future Products (Examples):

Product Code Product Name Status Description URL (Planned)
Planned Advanced https://invox.icaptur.ai
invox InvoX invoice
processing and https://irepo.icaptur.ai
irepo iRepo Planned analytics
Document https://docfennec.icaptur.ai
docfennec DocFennec Planned repository and
management
system
Document
intelligence and
extraction
platform

Product Attributes:

products table: -- 'customer_portal'
id UUID PRIMARY KEY -- 'iCaptur Customer Portal'
product_code TEXT UNIQUE NOT NULL -- Optional marketing description
product_name TEXT NOT NULL
description TEXT -- Can be disabled without deleting
is_active BOOLEAN DEFAULT TRUE
created_at TIMESTAMPTZ DEFAULT NOW()

Sample Data:

INSERT INTO products (product_code, product_name, description, is_active) VALUES
('customer_portal', 'iCaptur Customer Portal', 'AI-powered document processing

for invoices, CAD drawings, and EOB documents', true),
('invox', 'InvoX', 'Advanced invoice processing with analytics and insights',

false),
('irepo', 'iRepo', 'Centralized document repository with search and

classification', false),
('docfennec', 'DocFennec', 'Intelligent document extraction and data capture

platform', false);

## 6.2 Subscription Model

Plain English:
A "subscription" represents a customer organization (tenant) having access to a specific
product. For example, "Acme Corp subscribes to Customer Portal" is one subscription. If Acme
Corp also wants InvoX, that's a second subscription.

Key Characteristics:

85. **One tenant can have multiple subscriptions** (one per product)
86. **Each subscription has its own status** (active, canceled, etc.)
87. **Each subscription has its own billing status** (trialing, active, past_due)
88. **Subscriptions are linked to Zoho Billing** (via zoho_subscription_id)
89. **Subscriptions determine which product features the tenant can access**

Subscription Lifecycle States:

Subscription Status (Our internal status):

Status Meaning User Impact
active Subscription is active and paid Full access to product features
suspended Temporarily suspended by Access revoked (entitlements
admin removed)
canceled Customer canceled subscription Access revoked (either
immediately or at period end)
expired Trial or term subscription ended Access revoked

Billing Status (Synced from Zoho):

Billing Status Meaning User Impact
trialing Free trial period Full access during trial
active Paid and current Full access
past_due Payment failed, grace period Access may be restricted or full
(configurable)
unpaid Grace period ended, not paid Access revoked
canceled Canceled in Zoho Access revoked per cancellation
policy

State Transitions:

New Subscription

[trialing] trial expires, payment succeeds [active]

trial expires, no payment [expired]

payment fails

[past_due]

payment succeeds grace period ends

[active] [unpaid]

(access revoked, subscription
may be auto-canceled)

Database Representation:

tenant_product_subscriptions table:
id UUID PRIMARY KEY
tenant_id UUID NOT NULL REFERENCES tenant(id)
product_id UUID NOT NULL REFERENCES products(id)

-- Subscription State -- 'active', 'suspended', 'canceled',
status TEXT NOT NULL -- 'trialing', 'active', 'past_due',
'expired'
billing_status TEXT
'unpaid', 'canceled'

-- Zoho Integration -- Zoho's subscription ID (e.g.,
zoho_subscription_id TEXT UNIQUE -- 'india' or 'international'
'sub_123456')
zoho_account_region TEXT NOT NULL

-- Lifecycle Timestamps

subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

trial_ends_at TIMESTAMPTZ -- NULL if not on trial

next_billing_date TIMESTAMPTZ -- Next renewal date

canceled_at TIMESTAMPTZ -- When subscription was canceled (NULL

if active)

created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()

UNIQUE(tenant_id, product_id) -- One subscription per tenant-product
pair

Example Data:

-- Acme Corp has Customer Portal subscription (active, paid)
INSERT INTO tenant_product_subscriptions (

tenant_id, product_id, status, billing_status,
zoho_subscription_id, zoho_account_region,
subscribed_at, next_billing_date
) VALUES (
'acme-tenant-uuid',
(SELECT id FROM products WHERE product_code = 'customer_portal'),
'active',
'active',
'sub_zoho_123456',
'international',
'2024-01-15 10:00:00',
'2025-01-15 00:00:00'
);

-- Beta Corp has Customer Portal subscription (trialing)
INSERT INTO tenant_product_subscriptions (

tenant_id, product_id, status, billing_status,
zoho_subscription_id, zoho_account_region,
subscribed_at, trial_ends_at
) VALUES (
'beta-tenant-uuid',
(SELECT id FROM products WHERE product_code = 'customer_portal'),
'active',
'trialing',
'sub_zoho_789012',
'india',
'2024-11-01 10:00:00',
'2024-11-15 23:59:59'
);

## 6.3 Product Features & Entitlements

Plain English:

"Features" are specific capabilities within a product. For example, Customer Portal has features
like cad_table, invoices, eob, and cad_checklist. "Entitlements" are the permissions
granted to a tenant's subscription, allowing them to use those features.

Feature Characteristics:

� **Identified by code** - Technical identifier (e.g., `cad_table`, `invoices`)
� **Belongs to a product** - Each feature is associated with a specific product
� **Can be granted or revoked** - Based on subscription plan
� **May have configuration** - Limits, quotas, settings stored as JSONB

Entitlement Model:

Tenant Subscription (Product X) Entitlements (Features)

Example:

Tenant: Acme Corp
Subscription: Customer Portal
Entitlements:

- cad_table (granted=true, config: {max_mb: 100, max_concurrent: 5})
- invoices (granted=true, config: {max_mb: 50})
- eob (granted=false)
- cad_checklist (granted=true, config: {max_mb: 100})

Database Representation:

product_entitlements table:

id UUID PRIMARY KEY

subscription_id UUID NOT NULL REFERENCES tenant_product_subscriptions(id) ON

DELETE CASCADE

feature_code TEXT NOT NULL -- 'cad_table', 'invoices', 'eob', etc.

is_granted BOOLEAN DEFAULT TRUE -- Whether this feature is enabled
-- Feature-Specific Configuration (flexible JSONB)

config JSONB -- Feature settings, limits, quotas

created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()

UNIQUE(subscription_id, feature_code) -- One entitlement per subscription-
feature pair

Configuration Examples:

CAD Table Feature:

{
"max_mb": 100,
"max_concurrent_jobs": 5,
"allowed_formats": ["pdf", "png", "jpg"]

}

Invoices Feature:

{
"max_mb": 50,
"max_concurrent_jobs": 3,
"ocr_enabled": true

}

Analytics Feature (future product):

{
"max_dashboards": 10,
"export_formats": ["pdf", "excel", "csv"],
"retention_days": 90

}

Sample Data:

-- Acme Corp's Customer Portal entitlements
-- (subscription_id from previous example)

INSERT INTO product_entitlements (subscription_id, feature_code, is_granted,
config) VALUES

('acme-subscription-uuid', 'cad_table', true, '{"max_mb": 100,
"max_concurrent_jobs": 5}'),

('acme-subscription-uuid', 'invoices', true, '{"max_mb": 50,
"max_concurrent_jobs": 3}'),

('acme-subscription-uuid', 'eob', true, '{"max_mb": 50}'),
('acme-subscription-uuid', 'cad_checklist', true, '{"max_mb": 100,
"max_concurrent_jobs": 5}');

How Entitlements Are Granted:

90. **Plan-Based (Zoho):**

- Customer subscribes to "Professional Plan" in Zoho
- Zoho webhook notifies our BFF: subscription_created
- BFF calls SSO Admin API to create subscription
- SSO creates entitlement records based on plan mapping

91. **Manual Override (iTech Admin):**

- Support admin can manually grant/revoke features

- Useful for special cases, trials, or troubleshooting

92. **Automatic on Upgrade/Downgrade:**

- Customer upgrades from Basic to Pro plan in Zoho

- Webhook: subscription_changed

- BFF updates entitlements: Add premium features, increase limits

Permissions API Response:

When a product calls GET /api/v1/permissions/me, SSO returns:

{
"user_id": "user-uuid",
"tenant_id": "tenant-uuid",
"product_code": "customer_portal",
"permissions": ["cad_table", "invoices", "eob", "cad_checklist"]

}

This list is generated by:

# 93. Find user's tenant

# 94. Find tenant's subscription for product (from token's `aud` field)

# 95. Get all entitlements where `is_granted = true`

# 96. Check user-specific overrides (if `org_user` role)

# 97. Return array of feature codes

## 6.4 Billing Plans (Zoho)

Plain English:

Pricing plans (Starter, Professional, Enterprise, etc.) are defined and managed in Zoho Billing.
We do NOT store plan details, pricing, or feature mappings in our database. Zoho is the system
of record for billing.

What Zoho Manages:

� **Plan definitions** - Names, descriptions, pricing tiers
� **Pricing** - Monthly/annual amounts, currency, discounts
� **Add-ons** - Extra features, user seats, storage
� **Coupons** - Discount codes, trial periods
� **Tax calculation** - VAT, GST, sales tax based on location
� **Invoicing** - Invoice generation, numbering, PDF rendering
� **Payment processing** - Card charging, retries, dunning

What We Manage:
� **Subscription status** - Active, canceled, past_due (synced from Zoho)
� **Entitlements** - Which features are enabled (based on plan)
� **Configuration** - Feature limits, quotas (may differ from plan defaults if customized)

Plan-to-Entitlement Mapping:

When a subscription is created/changed, we map Zoho plan to our entitlements:

// Conceptual mapping (could be database table or configuration file)

const PLAN_ENTITLEMENTS = {
'customer_portal': {
'plan_starter': {
features: ['cad_table', 'invoices'],
config: {
cad_table: { max_mb: 50, max_concurrent_jobs: 2 },
invoices: { max_mb: 25, max_concurrent_jobs: 2 }
}
},
'plan_professional': {
features: ['cad_table', 'invoices', 'eob', 'cad_checklist'],
config: {
cad_table: { max_mb: 100, max_concurrent_jobs: 5 },
invoices: { max_mb: 50, max_concurrent_jobs: 5 },
eob: { max_mb: 50 },
cad_checklist: { max_mb: 100, max_concurrent_jobs: 5 }
}
},
'plan_enterprise': {
features: ['cad_table', 'invoices', 'eob', 'cad_checklist',

'advanced_analytics'],
config: {
cad_table: { max_mb: 500, max_concurrent_jobs: 20 },
invoices: { max_mb: 200, max_concurrent_jobs: 20 },
eob: { max_mb: 200 },
cad_checklist: { max_mb: 500, max_concurrent_jobs: 20 },
advanced_analytics: { enabled: true }
}

}
}
};

// When webhook received: subscription_created
function handleSubscriptionCreated(event) {

const planCode = event.subscription.plan.plan_code; // from Zoho
const productCode = event.subscription.product_code; // from custom field in Zoho

// Look up entitlements for this plan
const entitlements = PLAN_ENTITLEMENTS[productCode][planCode];

// Create entitlement records in SSO database
for (const feature of entitlements.features) {

await db.insert(productEntitlements).values({
subscription_id: subscriptionId,
feature_code: feature,
is_granted: true,
config: entitlements.config[feature] || {}
});
}
}

Multi-Region Billing:

Zoho handles currency and regional pricing:

� **India tenants** (country = 'IN') Zoho India account Plans in INR
� **International tenants** (country != 'IN') Zoho International account Plans in USD

Plans may have same features but different pricing based on region.

## 6.5 Multi-Product Scenarios

Plain English:

A tenant can subscribe to multiple products. Each subscription is independent, with its own
billing, status, and features.

Scenario 1: Single Product (Current State)

Tenant: Acme Corp
Subscriptions:

- Customer Portal (active, Professional plan)
  Features: cad_table, invoices, eob, cad_checklist

User: john@acme.com (org_admin)
Can access: Customer Portal
Token (Customer Portal): { aud: "customer_portal", ... }
Permissions: ["cad_table", "invoices", "eob", "cad_checklist"]

Scenario 2: Multi-Product

Tenant: Acme Corp
Subscriptions:

- Customer Portal (active, Professional plan)
  Features: cad_table, invoices, eob, cad_checklist
- InvoX (active, Enterprise plan)
  Features: invoice_processing, analytics, reporting, api_access

User: john@acme.com (org_admin)
Can access: Customer Portal AND InvoX
Token (Customer Portal): { aud: "customer_portal", ... }
Permissions: ["cad_table", "invoices", "eob", "cad_checklist"]
Token (InvoX): { aud: "invox", ... }
Permissions: ["invoice_processing", "analytics", "reporting", "api_access"]

User Experience:

# 98. John logs in at `app.icaptur.ai` SSO session created

# 99. John navigates to `portal.icaptur.ai` Gets token with `aud: "customer_portal"`

# 100. John navigates to `invox.icaptur.ai` Gets token with `aud: "invox"` (no re-login)

# 101. Each product calls SSO permissions API with its own token Gets product-specific

features
Billing:

� Each subscription billed separately in Zoho (2 invoices per month)
� OR bundled discount (if Zoho plan supports multi-product packages)
� Canceling one product doesn't affect the other

Permissions Isolation:

-- Query permissions for john@acme.com in Customer Portal
SELECT e.feature_code
FROM tenant_product_subscriptions s
JOIN product_entitlements e ON e.subscription_id = s.id
JOIN products p ON s.product_id = p.id
WHERE s.tenant_id = 'acme-uuid'

AND p.product_code = 'customer_portal'
AND s.status = 'active'
AND e.is_granted = true;

Result: ['cad_table', 'invoices', 'eob', 'cad_checklist']

-- Query permissions for john@acme.com in InvoX
SELECT e.feature_code
FROM tenant_product_subscriptions s
JOIN product_entitlements e ON e.subscription_id = s.id
JOIN products p ON s.product_id = p.id
WHERE s.tenant_id = 'acme-uuid'

AND p.product_code = 'invox'
AND s.status = 'active'
AND e.is_granted = true;

Result: ['invoice_processing', 'analytics', 'reporting', 'api_access']

# 7. AUTHENTICATION & AUTHORIZATION (DETAILED)

This section provides comprehensive details on how authentication and authorization work in
the platform.

## 7.1 Authentication Methods

Plain English:

Users prove their identity by providing an email and password. Optionally, they can enable
multi-factor authentication (MFA) using an authenticator app (Google Authenticator, Authy,
Microsoft Authenticator, etc.) for extra security.

Primary Authentication: Email + Password

Password Requirements:

� Minimum 12 characters
� At least one uppercase letter (A-Z)
� At least one lowercase letter (a-z)
� At least one number (0-9)
� At least one special character (!@#$%^&\*)
� Cannot contain user's email or name
� Cannot be a common password (checked against known breach database)

Password Storage:

� Hashed using bcrypt with 10 rounds (cost factor 10)
� Never stored or logged in plaintext
� Never transmitted except over HTTPS
� Never returned in API responses

Account Lockout Protection:

� Maximum 5 failed login attempts
� Lockout duration: 30 minutes
� Counter resets on successful login
� Lockout can be manually reset by iTech admin

Example Password Validation:

Valid: "MySecure#Pass2024" (12 chars, uppercase, lowercase, number, special)
Valid: "Tr0ub4dor&3" (11 chars but very strong entropy)
Invalid: "password123" (too common)
Invalid: "MyPass" (too short, no special char)
Invalid: "john@acme.com" (contains email)

Multi-Factor Authentication (MFA) - Optional

MFA Method: TOTP (Time-based One-Time Password)

� Uses standard TOTP algorithm (RFC 6238)
� 6-digit codes that change every 30 seconds
� Compatible with: Google Authenticator, Authy, Microsoft Authenticator, 1Password, etc.

MFA Enrollment Flow:

# 102. User enables MFA in Settings Security

# 103. SSO generates a secret key and QR code

# 104. User scans QR code with authenticator app

# 105. User enters first 6-digit code to verify setup

# 106. SSO stores encrypted secret in database

# 107. SSO generates backup codes (10 single-use codes)

# 108. User must save backup codes securely

MFA Login Flow:

# 109. User enters email + password

# 110. If MFA enabled: Prompt for 6-digit code

# 111. User opens authenticator app and enters current code

# 112. SSO validates code (accepts codes �1 time window for clock skew)

# 113. If valid: Issue tokens and create session

# 114. If invalid: Increment failed attempt counter

MFA Backup Codes:

� 10 randomly generated codes (format: `XXXX-XXXX-XXXX`)
� Each code can be used only once
� User can view/regenerate codes in Settings Security
� Useful if phone is lost or authenticator app is unavailable

Database Fields (MFA):

user_account table (additions): -- TOTP secret (AES-256 encrypted)
mfa_enabled BOOLEAN DEFAULT FALSE -- Array of backup codes (AES-256
mfa_secret_encrypted TEXT
mfa_backup_codes_encrypted TEXT[]

encrypted)

Environment-Specific Authentication:

Development Environment:

� **Method:** Local JWT tokens
� **Purpose:** Faster development, no external dependencies
� **How it works:**

- Passwords stored in local database (bcrypt hashed)
- JWT tokens issued by backend with HMAC-SHA256 signature
- Secret key from environment variable (JWT_SECRET)
- Access token: 1 hour, Refresh token: 7 days
  Production Environment:
  � **Method:** AWS Cognito User Pools
  � **Purpose:** Enterprise-grade authentication, built-in security features
  � **How it works:**

- Passwords stored in Cognito (AWS manages hashing)
- Cognito issues JWT tokens (RSA-256 signature)
- Public keys fetched from Cognito JWKS endpoint
- Access token: 1 hour, Refresh token: 30 days (configurable)
  Note: AWS Cognito implementation is TBD during Phase 1. Architecture supports both JWT
  and Cognito modes.

## 7.2 Single Sign-On (SSO) Flow (Detailed)

Plain English:
SSO means users log in once and can access all products without logging in again. When you
log in to the Account Center, the SSO service creates a "session" that lasts for 8 hours. During
that time, you can navigate to any product (Customer Portal, InvoX, etc.) and you'll
automatically get access tokens for each product without entering your password again.

Technical Flow: OIDC Authorization Code Flow

iCaptur SSO implements the OAuth 2.0 Authorization Code Flow with PKCE (Proof Key for
Code Exchange). This is the industry-standard flow for web applications.

Step-by-Step Flow:

User Product SSO Cookies

App Service (Browser

# 1. Visit App

>

# 2. Check session

>

# 3. No session

<

# 4. Redirect to SSO login

GET /auth/login?

response_type=code&

client_id=customer_portal&

redirect_uri=https://portal...&

state=random123&

code_challenge=xyz&

code_challenge_method=S256

<

# 5. Display login form

<

# 6. Submit email + password

>

# 7. Validate

- Check password

- Check MFA (if

enabled)

- Check lockout

# 8. Create session

>

# 9. Set session cookie

<

# 10. Redirect back with code

GET redirect_uri?

code=auth_code_xyz&

state=random123

<

# 11. Exchange code for tokens

POST /auth/token

{

code: 'auth_code_xyz',

client_id: 'customer_portal',

redirect_uri: '...',

code_verifier: 'original_verifier'

}

>

# 12. Verify code

- Check not used

- Check not expired

- Verify PKCE

# 13. Issue tokens

{

aud: "customer\_

portal"

}

# 14. Return tokens

{

access_token,

refresh_token,

id_token,

expires_in: 3600

}

<

# 15. Store tokens securely

(httpOnly cookie or memory)

# 16. Redirect to app dashboard

<

Security Features:

# 1. PKCE (Proof Key for Code Exchange):

� Prevents authorization code interception attacks
� Client generates random `code_verifier` (43-128 chars)
� Client sends SHA-256 hash as `code_challenge`
� Server verifies `code_verifier` matches `code_challenge` when exchanging code

# 2. State Parameter:

� Random string sent with auth request
� Server returns same value in redirect
� Client verifies match (prevents CSRF attacks)

# 3. Short-Lived Authorization Codes:

� Codes expire after 30 seconds
� Single-use only (consumed after token exchange)

# 4. Secure Redirect URIs:

� Only pre-registered redirect URIs allowed
� No open redirects (prevents phishing)
� HTTPS required for production

Subsequent Product Access (Same Session):

User already logged in (SSO session cookie exists)

User InvoX SSO

App Service

# 1. Visit InvoX

>

# 2. Redirect to SSO

(same as step 4

above)

<

# 3. Check session

cookie

>

# 4. Session valid!

(no password

prompt)

# 5. Redirect back

with code

<

# 6. Exchange code

for token with

aud="invox"

>

# 7. Return InvoX

token

<

# 8. Access InvoX

<

Key Point: User never sees login form again (SSO session remembers them).

## 7.3 Token Structure (Comprehensive)

Plain English:

A token is like a digital badge that proves who you are and what you're allowed to do. It contains
information about you (email, role, tenant) and is signed by the SSO service so products can
verify it's authentic.

Token Types:

We issue three types of tokens (following OIDC standard):

115. **Access Token** - Used to call APIs
116. **Refresh Token** - Used to get new access tokens
117. **ID Token** - Contains user identity information

Access Token (JWT):

Format: JSON Web Token (JWT) signed with HMAC-SHA256 (dev) or RSA-256 (Cognito)

Complete Structure:

{
"header": {
"alg": "HS256",
"typ": "JWT"
},
"payload": {
"sub": "550e8400-e29b-41d4-a716-446655440000",
"email": "john@acme.com",
"tenant_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
"role": "org_admin",
"iss": "https://sso.icaptur.ai",
"aud": "customer_portal",
"exp": 1700000000,
"iat": 1699996400,
"jti": "unique-token-id-abc123"
},
"signature": "..."

}

Field Descriptions:

Field Type Description Example
sub String (UUID) Subject - User ID "550e8400-e29b-41d4-
a716-446655440000"
email String User email address "john@acme.com"
tenant_id String (UUID) or null Tenant ID (null for "7c9e6679-7425-40de-
iTech admins) 944b-e07fc1f90ae7"
role String User role "org_admin",
"org_user",
"icaptur_support_admin"
iss String (URL) Issuer - Who issued "https://sso.icaptur.ai"

this token

aud String Audience - Which "customer_portal",

product this token is for "invox", "accounts"

exp Number (Unix Expiration time 1700000000 (expires at)

timestamp)

iat Number (Unix Issued at time 1699996400 (issued at)

timestamp)

jti String JWT ID - Unique token "unique-token-id-

identifier abc123"

Why Permissions Are NOT in Token:
We intentionally do not include product permissions (features) in the token for several reasons: 118. **Token Size:** Including permissions would make tokens large (slower to transmit) 119. **Staleness:** Permissions can change, but tokens last 1 hour (would be out of sync) 120. **Security:** Smaller attack surface (less sensitive data in token) 121. **Flexibility:** Permissions can be revoked immediately without waiting for token expiry

Instead, products call the Permissions API separately.
Refresh Token:

� Opaque string (not a JWT)
� Stored in database with user_id reference
� Longer lifetime: 7 days (dev), 30 days (prod)
� Used to obtain new access tokens without re-authentication
� Single-use with rotation (new refresh token issued on each refresh)

ID Token (OIDC):

� Contains user profile information
� Same structure as access token but with additional claims:

- given_name - First name
- family_name - Last name
- picture - Profile picture URL

� Used by frontend to display user info (not for API calls)

## 7.4 Token Lifecycle

Plain English:
Tokens don't last forever. Access tokens expire after 1 hour. When they expire, the user doesn't
have to log in again; the product uses a "refresh token" to get a new access token automatically.
Refresh tokens last much longer (7-30 days) but are single-use and rotated for security.
Lifecycle Diagram:
User logs in

SSO issues tokens

Access Token Refresh Token

(1 hour TTL) (7-30 days TTL)

Used for API Used to get

requests new tokens

After 1 hour:

Token expires

Product calls

/auth/refresh

with refresh_token

SSO validates

refresh_token

SSO issues NEW tokens

New access token

New refresh token (Rotation!)

Process repeats

Token Refresh Flow:

// Product backend code (conceptual)

async function callAPI(endpoint, userToken) {
try {
// Try API call with current access token
const response = await fetch(endpoint, {
headers: { Authorization: `Bearer ${userToken.access_token}` }
});

if (response.status === 401) {
// Token expired - refresh it
const newTokens = await refreshAccessToken(userToken.refresh_token);

// Retry API call with new token
return await fetch(endpoint, {

headers: { Authorization: `Bearer ${newTokens.access_token}` }
});
}
return response;
} catch (error) {

// Handle error
}
}

async function refreshAccessToken(refreshToken) {
const response = await fetch('https://sso.icaptur.ai/auth/refresh', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ refresh_token: refreshToken })
});

if (!response.ok) {
// Refresh token invalid/expired - user must re-login
throw new Error('Session expired, please login again');

}

const tokens = await response.json();
// tokens = { access_token, refresh_token, expires_in }

// Store new tokens (replace old ones)
storeTokens(tokens);

return tokens;
}

Refresh Token Rotation (Security Best Practice):

Every time a refresh token is used, SSO issues a NEW refresh token and invalidates the old
one. This prevents:

� Stolen refresh tokens from being reused indefinitely
� Refresh token replay attacks

Example:

User has:

- Access Token A1 (expires 1pm)
- Refresh Token R1

1pm: Access Token A1 expires
Product calls /auth/refresh with R1
SSO returns:

- Access Token A2 (expires 2pm)
- Refresh Token R2
- R1 is now INVALID (marked as used in database)

2pm: Access Token A2 expires
Product calls /auth/refresh with R2
SSO returns:

- Access Token A3 (expires 3pm)
- Refresh Token R3
- R2 is now INVALID
  If attacker tries to use R1 again:
  SSO rejects (token already used)
  SSO alerts (possible token theft)
  SSO can invalidate entire token family for that user (security measure)

Token Revocation:

Tokens are revoked (made invalid before expiry) when:

� User logs out (refresh token invalidated)
� User changes password (all refresh tokens invalidated)
� Admin deactivates user (all tokens invalidated)
� Security incident (all tokens for user/tenant invalidated)

Implementation:

� **Refresh tokens:** Stored in database with `is_revoked` flag
� **Access tokens:** Cannot be revoked directly (short-lived by design)

- Products can optionally check a "revoked tokens" cache (Redis)

- Or rely on 1-hour expiry (acceptable for most use cases)

## 7.5 Authorization Patterns

Plain English:

After a product verifies the token is valid, it needs to check if the user is allowed to perform the
requested action. This involves checking the user's role, tenant association, and feature
permissions.

Authorization Layers:

# 1. Token Validation

(Is token valid and not expired?)

# 2. Tenant Isolation

(Does user belong to the tenant they're trying to access?)

# 3. Subscription Check

(Does tenant have an active subscription for this product?)

# 4. Feature Permission

(Is the specific feature enabled for this tenant?)

# 5. Role Permission

(Does user's role allow this action?)

# 6. User-Specific Permission (optional)

(Is this user specifically granted/denied this feature?)

# 7. Action Allowed

Code Example (Product Backend):

// NestJS Guard (conceptual)

@Injectable()
export class AuthGuard implements CanActivate {

async canActivate(context: ExecutionContext): Promise<boolean> {
const request = context.switchToHttp().getRequest();
const token = extractTokenFromHeader(request);
if (!token) {
throw new UnauthorizedException('No token provided');

}

// 1. Validate token
const payload = await this.ssoService.validateToken(token);
// payload = { sub, email, tenant_id, role, aud, iss, exp, iat }

// Check token not expired
if (payload.exp \* 1000 < Date.now()) {

throw new UnauthorizedException('Token expired');
}

// Check token issued for this product
if (payload.aud !== 'customer_portal') {

throw new ForbiddenException('Token not valid for this product');
}

// Attach user to request
request.user = payload;

return true;
}
}

// Permissions Guard
@Injectable()
export class PermissionsGuard implements CanActivate {

async canActivate(context: ExecutionContext): Promise<boolean> {
const request = context.switchToHttp().getRequest();
const user = request.user; // From AuthGuard

// Get required permission from route metadata
const requiredPermission = this.reflector.get('permission',
context.getHandler());

if (!requiredPermission) {
return true; // No permission required

}

// 2. Fetch user permissions from SSO (with caching)
const permissions = await this.permissionsService.getUserPermissions(user);
// permissions = { permissions: ['cad_table', 'invoices', ...] }

// 3. Check if user has required permission
if (!permissions.permissions.includes(requiredPermission)) {

throw new ForbiddenException(`Feature '${requiredPermission}' not enabled`);
}

return true;
}
}

// Usage in Controller
@Controller('cad')
export class CadController {

@Post('table/submit')
@UseGuards(AuthGuard, PermissionsGuard)
@Permission('cad_table') // Metadata
async submitCADTable(@Body() dto: SubmitCADDto, @User() user) {

// User is authenticated and authorized
// Process CAD table extraction
}
}

Tenant Isolation Enforcement:

// Middleware to enforce tenant isolation
export function enforceTenantIsolation(req, res, next) {

const user = req.user; // From auth middleware
const requestedTenantId = req.params.tenantId || req.body.tenantId;

// iTech admins can access any tenant
if (user.role.startsWith('icaptur\_')) {

return next();
}

// Regular users can only access their own tenant
if (user.tenant_id !== requestedTenantId) {

return res.status(403).json({
error: 'FORBIDDEN',
message: 'You cannot access resources of another organization'

});
}

next();
}

RBAC (Role-Based Access Control):

// Check if user's role allows action
export function requireRole(...allowedRoles: string[]) {

return (req, res, next) => {
const user = req.user;

if (!allowedRoles.includes(user.role)) {
return res.status(403).json({
error: 'INSUFFICIENT_PERMISSIONS',
message: 'Your role does not allow this action',
required_roles: allowedRoles
});

}

next();
};
}

// Usage
app.post('/billing/cancel',

authMiddleware,
requireRole('org_admin', 'icaptur_super_admin'),
cancelSubscriptionHandler
);

## 7.6 Security Measures (Comprehensive)

# 1. Password Security:

� Bcrypt hashing (cost factor 10)
� Minimum 12 characters
� Complexity requirements (uppercase, lowercase, number, special)
� No common passwords (breach database check)
� No password hints or recovery questions (insecure)
� Secure password reset via time-limited tokens

# 2. Account Security:

� Account lockout after 5 failed attempts (30 min)
� Optional MFA (TOTP)
� MFA backup codes (single-use)
� Session timeout (8 hours)
� Forced logout on password change
� Email notification on password change

# 3. Token Security:

� Short access token lifetime (1 hour)
� Refresh token rotation (new token on each refresh)
� Tokens transmitted over HTTPS only
� httpOnly cookies (protect from XSS)
� Audience (`aud`) validation per product
� Issuer (`iss`) validation
� Signature verification (HMAC or RSA)

# 4. API Security:

� HTTPS/TLS 1.2+ required
� HSTS header (Strict-Transport-Security)
� CORS with explicit origin allowlist
� Rate limiting (per-user and per-IP)
� Request timeouts (30s default)
� Input validation (class-validator)
� Output encoding (prevent injection)
� CSRF protection (state parameter in OAuth flow)

# 5. Data Security:

� Database encryption at rest (AWS RDS)
� S3 encryption at rest (SSE-S3 or SSE-KMS)
� Secrets in AWS Secrets Manager
� No secrets in code or logs
� PII redaction in logs (emails, IPs truncated)
� No card/PAN data storage (PCI scope minimization)

# 6. Audit Security:

� All admin actions logged (who, what, when, why)
� All authentication events logged
� Failed login attempts tracked
� iTech admin impersonation audited
� Correlation IDs for request tracing
� Immutable audit log (append-only)

End of Section 7 (Authentication & Authorization)

# 8. DATABASE DESIGN (COMPREHENSIVE)

This section provides the complete database schema for the SSO service, including all tables,
relationships, indexes, and migration considerations.

## 8.1 Database Philosophy

Plain English:
We use PostgreSQL as our primary database. The SSO service owns identity data (users,
tenants, subscriptions, permissions), while individual products own their product-specific data
(jobs, documents, etc.). Zoho owns billing data (invoices, payments).
Key Principles: 122. **Separation of Concerns**

- SSO Database: Users, tenants, products, subscriptions, entitlements
- Product Databases: Job history, documents, product-specific state
- Zoho: Invoices, payments, pricing, plans

123. **Single Source of Truth**

- User identity SSO
- Subscription status SSO (synced from Zoho)
- Billing transactions Zoho

124. **Tenant Isolation**

- Every table with tenant-specific data has tenant_id foreign key
- Row-level security can be enforced at ORM level
- Queries always scoped by tenant (except iTech admin queries)

125. **Referential Integrity**

- All foreign keys defined with proper ON DELETE CASCADE/SET NULL
- UUID primary keys (good for distributed systems)
- Timestamps on all tables (created_at, updated_at)

126. **Extensibility**

- JSONB for flexible configuration (product_entitlements.config)
- Enum types for controlled vocabularies (avoid magic strings)
- Easy to add new products and features without schema changes

## 8.2 SSO Database Schema (Complete)

Database Name: icaptur_sso

Schema Version: 1.0

Tables Overview:

Table Name Purpose Row Count (Est)
products Product catalog 10-20 (low)
tenant Customer organizations 1,000+
user_account All users (customers + iTech 10,000+
staff)
tenant_product_subscriptions Tenant-product associations 1,000+
product_entitlements Features per subscription 5,000+
user_product_permissions User-specific permission 1,000 (sparse)
overrides
zoho_billing_config Multi-region Zoho credentials 2 (India + International)
audit_event Security and admin audit trail 100,000+ (grows continuously)
password_reset_token Password reset tokens 100-1,000 (transient)
mfa_backup_codes MFA backup codes 1,000-10,000 (optional table)

Detailed Schema:

Table 1: `products`
Purpose: Catalog of all iCaptur.AI products.
CREATE TABLE products (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

product_code TEXT UNIQUE NOT NULL, -- 'customer_portal', 'invox', 'irepo'

product_name TEXT NOT NULL, -- 'iCaptur Customer Portal'

description TEXT, -- Marketing description

is_active BOOLEAN DEFAULT TRUE, -- Can disable without deleting

created_at TIMESTAMPTZ DEFAULT NOW()

);

-- Indexes
CREATE INDEX idx_products_code ON products(product_code);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;

-- Sample Data
INSERT INTO products (product_code, product_name, description, is_active) VALUES

('customer_portal', 'iCaptur Customer Portal', 'AI-powered document processing
for invoices, CAD drawings, and EOB documents', true),

('invox', 'InvoX', 'Advanced invoice processing with analytics and insights',
false),

('irepo', 'iRepo', 'Centralized document repository with search and
classification', false),

('docfennec', 'DocFennec', 'Intelligent document extraction and data capture
platform', false);

-- Comments
COMMENT ON TABLE products IS 'Catalog of all iCaptur.AI products';
COMMENT ON COLUMN products.product_code IS 'Unique technical identifier for product
(used in tokens, URLs)';
COMMENT ON COLUMN products.is_active IS 'Whether product is currently available for
subscription';

Table 2: `tenant` (Updated for Multi-Product)
Purpose: Customer organizations that subscribe to products.

CREATE TABLE tenant (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Organization Details -- 'active', 'inactive'
org_name TEXT NOT NULL, -- ISO country code (e.g., 'IN', 'US')
status TEXT NOT NULL, -- Organization contact email
country TEXT NOT NULL, -- Organization contact phone
email TEXT, -- S3 key for organization logo
phone TEXT,
logo_key TEXT,

-- Zoho Billing Integration -- Zoho customer ID (replaces
zoho_customer_id TEXT UNIQUE, -- 'india' or 'international'
ic_customer_id)
zoho_account_region TEXT,

-- Legacy Billing Fields (DEPRECATED - keep for migration, remove later)

ic_billing_user_id TEXT, -- Legacy: Old billing user ID
ic_customer_id TEXT, -- Legacy: Old customer ID
api_key_encrypted TEXT, -- Legacy: Encrypted API key (product-
specific)

-- Legacy Product Permissions (DEPRECATED - moved to
tenant_product_subscriptions)

perm_invoice BOOLEAN DEFAULT FALSE,
perm_cad_table BOOLEAN DEFAULT FALSE,
perm_cad_checklist BOOLEAN DEFAULT FALSE,
perm_eob BOOLEAN DEFAULT FALSE,

-- Legacy Configuration (DEPRECATED - moved to product_entitlements.config)
invoice_max_mb INTEGER,
cad_max_mb INTEGER,
eob_max_mb INTEGER,
max_concurrent_jobs INTEGER DEFAULT 5,

-- Retention Policies (DEPRECATED - should be per-product)

log_retention_value INTEGER,

log_retention_unit TEXT, -- 'hour', 'day'

output_retention_value INTEGER,

output_retention_unit TEXT, -- 'hour', 'day'

-- User Limits (DEPRECATED - should be in subscription config)
users_allowed INTEGER,

-- Primary Contact
primary_contact_first_name TEXT NOT NULL,
primary_contact_last_name TEXT NOT NULL,
primary_contact_email TEXT NOT NULL,
primary_contact_phone TEXT,

-- Timestamps
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tenant_org_name ON tenant(org_name);
CREATE INDEX idx_tenant_status ON tenant(status);
CREATE INDEX idx_tenant_country ON tenant(country);
CREATE INDEX idx_tenant_zoho_customer ON tenant(zoho_customer_id) WHERE
zoho_customer_id IS NOT NULL;

-- Comments
COMMENT ON TABLE tenant IS 'Customer organizations that subscribe to iCaptur
products';
COMMENT ON COLUMN tenant.zoho_customer_id IS 'Zoho Billing customer ID (unique per
tenant across both Zoho accounts)';
COMMENT ON COLUMN tenant.zoho_account_region IS 'Which Zoho account this tenant is
billed through (india/international)';
COMMENT ON COLUMN tenant.perm_invoice IS 'DEPRECATED: Use product_entitlements
table instead';

Migration Notes:
� Keep legacy `perm_*` fields temporarily for backward compatibility
� Populate new `zoho_customer_id` and `zoho_account_region` during migration
� Create corresponding `tenant_product_subscriptions` records for existing tenants
� After migration complete and verified, drop legacy columns

Table 3: `user_account` (Updated for MFA)
Purpose: All users (customers and iTech staff).

CREATE TABLE user_account (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Tenant Association
tenant_id UUID REFERENCES tenant(id), -- NULL for iTech admins

-- Identity -- Globally unique
email TEXT NOT NULL UNIQUE,
first_name TEXT NOT NULL, -- Optional contact phone
last_name TEXT NOT NULL, -- S3 key for profile picture
phone TEXT,
profile_picture_key TEXT,

-- Role & Status -- 'org_admin', 'org_user',
role TEXT NOT NULL,
'icaptur_support_admin', etc. -- 'invited', 'active', 'inactive'
status TEXT NOT NULL, -- DEPRECATED: Use role instead
is_admin BOOLEAN DEFAULT FALSE,

-- Authentication -- Cognito user ID (or placeholder for
cognito_sub TEXT NOT NULL, -- Bcrypt hash (for local auth bypass
local mode)
password_hash TEXT,
mode)

-- Account Security

failed_login_attempts INTEGER DEFAULT 0,

locked_until TIMESTAMPTZ, -- Account lockout expiry

last_failed_login_at TIMESTAMPTZ,

-- Account Activation

activation_token TEXT, -- Secure token for account activation

activation_token_expires_at TIMESTAMPTZ, -- Token expiry (24 hours)

-- Multi-Factor Authentication (MFA) -- TOTP secret (AES-256 encrypted)
mfa_enabled BOOLEAN DEFAULT FALSE, -- Array of backup codes (AES-256
mfa_secret_encrypted TEXT,
mfa_backup_codes_encrypted TEXT[],
encrypted)

-- Timestamps
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_account_email ON user_account(email);
CREATE INDEX idx_user_account_tenant_id ON user_account(tenant_id) WHERE tenant_id
IS NOT NULL;
CREATE INDEX idx_user_account_cognito_sub ON user_account(cognito_sub);
CREATE INDEX idx_user_account_activation_token ON user_account(activation_token)
WHERE activation_token IS NOT NULL;
CREATE INDEX idx_user_account_role ON user_account(role);
CREATE INDEX idx_user_account_mfa_enabled ON user_account(mfa_enabled) WHERE
mfa_enabled = true;

-- Comments
COMMENT ON TABLE user*account IS 'All users: customers (org_admin, org_user) and
iTech staff (icaptur*\*\_admin)';
COMMENT ON COLUMN user_account.tenant_id IS 'Foreign key to tenant; NULL for iTech
admin users (cross-tenant access)';
COMMENT ON COLUMN user_account.email IS 'Globally unique email address; used for
login';
COMMENT ON COLUMN user_account.role IS 'User role enum: org_admin, org_user,
icaptur_support_admin, icaptur_finance_admin, icaptur_super_admin';
COMMENT ON COLUMN user_account.mfa_secret_encrypted IS 'TOTP secret key encrypted
with application encryption key';
COMMENT ON COLUMN user_account.mfa_backup_codes_encrypted IS 'Array of 10 single-
use backup codes (format: XXXX-XXXX-XXXX)';

Table 4: `tenant_product_subscriptions`
Purpose: Maps tenants to products (subscriptions).

CREATE TABLE tenant_product_subscriptions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Relationships
tenant_id UUID NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,

-- Subscription State -- 'active', 'suspended', 'canceled',
status TEXT NOT NULL, -- 'trialing', 'active', 'past_due',
'expired'
billing_status TEXT,
'unpaid', 'canceled'

-- Zoho Integration -- Zoho's subscription ID
zoho_subscription_id TEXT UNIQUE, -- 'india' or 'international'
zoho_account_region TEXT NOT NULL,

-- Lifecycle Timestamps

subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

trial_ends_at TIMESTAMPTZ, -- NULL if not on trial

next_billing_date TIMESTAMPTZ, -- Next renewal date

canceled_at TIMESTAMPTZ, -- When subscription was canceled
-- Timestamps
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),

-- Constraints -- One subscription per tenant-product
UNIQUE(tenant_id, product_id)
pair
);

-- Indexes
CREATE INDEX idx_tenant_product_subs_tenant ON
tenant_product_subscriptions(tenant_id);
CREATE INDEX idx_tenant_product_subs_product ON
tenant_product_subscriptions(product_id);
CREATE INDEX idx_tenant_product_subs_zoho ON
tenant_product_subscriptions(zoho_subscription_id) WHERE zoho_subscription_id IS
NOT NULL;
CREATE INDEX idx_tenant_product_subs_status ON
tenant_product_subscriptions(status);
CREATE INDEX idx_tenant_product_subs_billing_status ON
tenant_product_subscriptions(billing_status);

-- Comments
COMMENT ON TABLE tenant_product_subscriptions IS 'Maps tenants to products they
have subscribed to';
COMMENT ON COLUMN tenant_product_subscriptions.status IS 'Subscription status:
active, suspended, canceled, expired';
COMMENT ON COLUMN tenant_product_subscriptions.billing_status IS 'Billing status
synced from Zoho: trialing, active, past_due, unpaid, canceled';
COMMENT ON COLUMN tenant_product_subscriptions.zoho_subscription_id IS 'Zoho
Billing subscription ID (unique across both Zoho accounts)';
COMMENT ON COLUMN tenant_product_subscriptions.zoho_account_region IS 'Which Zoho
account this subscription is billed through';

Table 5: `product_entitlements`
Purpose: Features and limits for each subscription.

CREATE TABLE product_entitlements (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Relationships
subscription_id UUID NOT NULL REFERENCES tenant_product_subscriptions(id) ON
DELETE CASCADE,

-- Feature -- 'cad_table', 'invoices', 'analytics',
feature_code TEXT NOT NULL, -- Whether feature is enabled
etc.
is_granted BOOLEAN DEFAULT TRUE,

-- Feature Configuration (flexible JSONB)

config JSONB, -- Feature-specific settings, limits,
quotas
-- Examples:
-- {"max_mb": 100, "max_concurrent_jobs": 5}
-- {"rate_limit_per_hour": 1000}
-- {"retention_days": 90}

-- Timestamps
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),

-- Constraints -- One entitlement per subscription-
UNIQUE(subscription_id, feature_code)
feature pair
);

-- Indexes
CREATE INDEX idx_product_entitlements_subscription ON
product_entitlements(subscription_id);
CREATE INDEX idx_product_entitlements_feature ON
product_entitlements(feature_code);
CREATE INDEX idx_product_entitlements_granted ON
product_entitlements(subscription_id, is_granted) WHERE is_granted = true;

-- JSONB Index (for querying config)
CREATE INDEX idx_product_entitlements_config ON product_entitlements USING GIN
(config);

-- Comments
COMMENT ON TABLE product_entitlements IS 'Features and configuration granted to
tenant subscriptions';
COMMENT ON COLUMN product_entitlements.feature_code IS 'Feature identifier (e.g.,
cad_table, invoices, analytics)';
COMMENT ON COLUMN product_entitlements.config IS 'Feature-specific configuration as
JSONB (limits, quotas, settings)';

Table 6: `user_product_permissions` (Optional Overrides)
Purpose: User-specific permission overrides (rare, for granular control).

CREATE TABLE user_product_permissions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Relationships
user_id UUID NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
subscription_id UUID NOT NULL REFERENCES tenant_product_subscriptions(id) ON
DELETE CASCADE,

-- Permission -- Feature to override
feature_code TEXT NOT NULL, -- Grant or revoke for this user
is_granted BOOLEAN DEFAULT TRUE,

-- Timestamps
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),

-- Constraints
UNIQUE(user_id, subscription_id, feature_code)
);

-- Indexes
CREATE INDEX idx_user_product_perms_user ON user_product_permissions(user_id);
CREATE INDEX idx_user_product_perms_subscription ON
user_product_permissions(subscription_id);

-- Comments
COMMENT ON TABLE user_product_permissions IS 'User-specific permission overrides
(sparse table, most users inherit from subscription)';
COMMENT ON COLUMN user_product_permissions.is_granted IS 'true = grant feature to
user; false = revoke feature from user';

Usage Notes:

� This table is **sparse** - most users don't have overrides
� Used when `org_admin` wants to restrict an `org_user` to specific features
� Example: Tenant has all Customer Portal features, but one user should only use CAD (not

invoices)

Table 7: `zoho_billing_config` (Multi-Region)
Purpose: Store credentials for multiple Zoho Billing accounts.

CREATE TABLE zoho_billing_config (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Region -- 'india', 'international'
region_code TEXT UNIQUE NOT NULL,

-- Zoho OAuth Credentials -- Zoho organization ID
org_id TEXT NOT NULL, -- Zoho OAuth client ID
client_id TEXT NOT NULL, -- Encrypted with KMS/app key
client_secret_encrypted TEXT NOT NULL, -- Encrypted with KMS/app key
refresh_token_encrypted TEXT NOT NULL,

-- Webhook Configuration

webhook_secret_encrypted TEXT NOT NULL, -- For HMAC signature verification

webhook_ip_allowlist TEXT[], -- Array of allowed Zoho IPs

-- API Configuration -- 'https://billing.zoho.in/api/v1' or
api_base_url TEXT NOT NULL,
'.com'

-- Status -- Last time OAuth token was refreshed
is_active BOOLEAN DEFAULT TRUE,
last_token_refresh_at TIMESTAMPTZ,

-- Timestamps
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_zoho_config_region ON zoho_billing_config(region_code);
CREATE INDEX idx_zoho_config_active ON zoho_billing_config(is_active) WHERE
is_active = true;

-- Sample Data (encrypted values are placeholders)
INSERT INTO zoho_billing_config (region_code, org_id, client_id,
client_secret_encrypted, refresh_token_encrypted, webhook_secret_encrypted,
api_base_url, is_active) VALUES

('india', 'zoho_org_india_123', 'client_id_india', 'encrypted_secret',
'encrypted_token', 'encrypted_webhook_secret', 'https://billing.zoho.in/api/v1',
true),

('international', 'zoho_org_intl_456', 'client_id_intl', 'encrypted_secret',
'encrypted_token', 'encrypted_webhook_secret', 'https://billing.zoho.com/api/v1',
true);

-- Comments
COMMENT ON TABLE zoho_billing_config IS 'Configuration for multiple Zoho Billing
accounts (India vs International)';
COMMENT ON COLUMN zoho_billing_config.region_code IS 'Unique region identifier
(india, international)';
COMMENT ON COLUMN zoho_billing_config.client_secret_encrypted IS 'Zoho OAuth client
secret encrypted with AWS KMS';
COMMENT ON COLUMN zoho_billing_config.webhook_ip_allowlist IS 'Array of IP
addresses/CIDRs allowed to send webhooks';

Table 8: `audit_event` (Unchanged from Customer Portal)
Purpose: Comprehensive audit trail for security and compliance.

CREATE TABLE audit_event (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Context
tenant_id UUID REFERENCES tenant(id), -- NULL for cross-tenant actions
actor_user_id UUID REFERENCES user_account(id), -- Who performed action

-- Event -- e.g., 'user_created',
event_type TEXT NOT NULL, -- Event-specific data
'subscription_changed'
event_payload JSONB,

-- Metadata -- Source IP address
ip TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_event_tenant_id ON audit_event(tenant_id) WHERE tenant_id IS
NOT NULL;
CREATE INDEX idx_audit_event_actor_user_id ON audit_event(actor_user_id) WHERE
actor_user_id IS NOT NULL;
CREATE INDEX idx_audit_event_event_type ON audit_event(event_type);
CREATE INDEX idx_audit_event_created_at ON audit_event(created_at DESC);

-- JSONB Index
CREATE INDEX idx_audit_event_payload ON audit_event USING GIN (event_payload);

-- Comments
COMMENT ON TABLE audit_event IS 'Immutable audit trail of all significant actions';
COMMENT ON COLUMN audit_event.event_type IS 'Event type (user_created,
subscription_changed, impersonation_started, etc.)';
COMMENT ON COLUMN audit_event.event_payload IS 'Event-specific data as JSONB
(flexible schema)';

Table 9: `password_reset_token` (Unchanged from Customer Portal)
Purpose: Secure password reset tokens.

CREATE TABLE password_reset_token (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- User
user_id UUID NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,

-- Token -- SHA-256 hash of reset token
token_hash TEXT NOT NULL UNIQUE, -- Token expires 24 hours after creation
expires_at TIMESTAMPTZ NOT NULL, -- NULL = unused, timestamp = used
used_at TIMESTAMPTZ,

-- Timestamps
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_password_reset_token_hash ON password_reset_token(token_hash);
CREATE INDEX idx_password_reset_user_id ON password_reset_token(user_id);
CREATE INDEX idx_password_reset_expires_at ON password_reset_token(expires_at);

-- Comments
COMMENT ON TABLE password_reset_token IS 'Password reset tokens (single-use, time-
limited)';
COMMENT ON COLUMN password_reset_token.token_hash IS 'SHA-256 hash of reset token
(plaintext sent in email)';
COMMENT ON COLUMN password_reset_token.used_at IS 'Timestamp when token was used
(single-use enforcement)';

## 8.3 Database Relationships Diagram

Plain English:
This diagram shows how all the tables connect to each other through foreign keys.

Text-Based Entity-Relationship Diagram:

products

(product catalog)

Referenced by product_id

tenant

(organizations)

Referenced by Referenced by

tenant_id tenant_id

user*account tenant_product*

(all users) subscriptions

(tenant-product

associations)

Referenced by

subscription_id

product\_

entitlements

(features)

Referenced by

subscription_id

user*product*

permissions

Referenced by (optional

user_id overrides)

audit_event
(audit trail)

References tenant_id, actor_user_id
(optional, for context)

password*reset*

token

References user_id

(CASCADE delete)

zoho*billing*

config

Referenced by zoho_account_region

(in tenant and tenant_product_subscriptions)

Key Relationships:

127. **products** **tenant_product_subscriptions**: One product can have many
     subscriptions

128. **tenant** **tenant_product_subscriptions**: One tenant can have many subscriptions
129. **tenant** **user_account**: One tenant can have many users
130. **tenant_product_subscriptions** **product_entitlements**: One subscription has

many entitlements 131. **tenant_product_subscriptions** **user_product_permissions**: One subscription

can have user-specific overrides 132. **user_account** **user_product_permissions**: One user can have permissions for

multiple subscriptions

## 8.4 Migration from Current Schema

Plain English:

When we move from the current Customer Portal schema to the new SSO schema, we need to
carefully transform the data without losing anything important. Here's how we'll do it.

Migration Phases:

Phase 1: Create New Tables

� Deploy new SSO database with all tables
� Insert sample data (products, zoho_billing_config)
� Test locally with sample subscriptions

Phase 2: Export Existing Data

-- Export tenants
SELECT \* FROM customer_portal.tenant
INTO OUTFILE '/tmp/tenants_export.csv';

-- Export users
SELECT _ FROM customer_portal.user_account
INTO OUTFILE '/tmp/users_export.csv';
-- Export user-feature grants
SELECT _ FROM customer_portal.user_screen_grant
INTO OUTFILE '/tmp/grants_export.csv';

Phase 3: Transform and Import

// Migration script (conceptual)

async function migrateTenants() {
const tenants = await loadCSV('/tmp/tenants_export.csv');

for (const oldTenant of tenants) {
// 1. Create tenant in SSO
const newTenant = await ssoDb.insert(tenant).values({
id: oldTenant.id, // Keep same UUID
org_name: oldTenant.org_name,
status: oldTenant.status,
country: oldTenant.country,
email: oldTenant.email,
phone: oldTenant.phone,
logo_key: oldTenant.logo_key,
zoho_customer_id: oldTenant.ic_customer_id, // Map legacy ID
zoho_account_region: oldTenant.country === 'IN' ? 'india' : 'international',
primary_contact_first_name: oldTenant.primary_contact_first_name,
primary_contact_last_name: oldTenant.primary_contact_last_name,
primary_contact_email: oldTenant.primary_contact_email,
primary_contact_phone: oldTenant.primary_contact_phone,
created_at: oldTenant.created_at,
updated_at: oldTenant.updated_at
});

// 2. Create Customer Portal subscription
const customerPortalProduct = await ssoDb.select().from(products)

.where(eq(products.product_code, 'customer_portal'))
.limit(1);

const subscription = await ssoDb.insert(tenantProductSubscriptions).values({
tenant_id: newTenant.id,
product_id: customerPortalProduct.id,
status: 'active',
billing_status: 'active',
zoho_subscription_id: oldTenant.zoho_subscription_id || null,
zoho_account_region: oldTenant.country === 'IN' ? 'india' : 'international',
subscribed_at: oldTenant.created_at,
next_billing_date: calculateNextBilling(oldTenant)

});

// 3. Create entitlements based on old boolean flags
const entitlements = [];

if (oldTenant.perm_cad_table) {
entitlements.push({
subscription_id: subscription.id,
feature_code: 'cad_table',
is_granted: true,
config: {
max_mb: oldTenant.cad_max_mb || 100,
max_concurrent_jobs: oldTenant.max_concurrent_jobs || 5
}
});
}

if (oldTenant.perm_invoice) {
entitlements.push({
subscription_id: subscription.id,
feature_code: 'invoices',
is_granted: true,
config: {
max_mb: oldTenant.invoice_max_mb || 50,
max_concurrent_jobs: oldTenant.max_concurrent_jobs || 5
}
});

}

if (oldTenant.perm_eob) {
entitlements.push({
subscription_id: subscription.id,
feature_code: 'eob',
is_granted: true,
config: {
max_mb: oldTenant.eob_max_mb || 50
}
});

}

if (oldTenant.perm_cad_checklist) {
entitlements.push({
subscription_id: subscription.id,
feature_code: 'cad_checklist',
is_granted: true,
config: {
max_mb: oldTenant.cad_max_mb || 100,
max_concurrent_jobs: oldTenant.max_concurrent_jobs || 5
}
});

}

await ssoDb.insert(productEntitlements).values(entitlements);

console.log(`Migrated tenant: ${oldTenant.org_name}`);
}
}

async function migrateUsers() {
const users = await loadCSV('/tmp/users_export.csv');

for (const oldUser of users) {
// Create user in SSO (same UUID, keep all fields)
await ssoDb.insert(userAccount).values({
id: oldUser.id,
tenant_id: oldUser.tenant_id, // Keep association
email: oldUser.email,
first_name: oldUser.first_name,
last_name: oldUser.last_name,
phone: oldUser.phone,
profile_picture_key: oldUser.profile_picture_key,
role: oldUser.role, // 'org_admin', 'org_user', 'product_admin'
status: oldUser.status,
cognito_sub: oldUser.cognito_sub,
password_hash: oldUser.password_hash,
failed_login_attempts: oldUser.failed_login_attempts,
locked_until: oldUser.locked_until,
last_failed_login_at: oldUser.last_failed_login_at,
mfa_enabled: false, // No MFA in old system
created_at: oldUser.created_at,
updated_at: oldUser.updated_at
});

console.log(`Migrated user: ${oldUser.email}`);
}
}

async function migrateUserGrants() {
const grants = await loadCSV('/tmp/grants_export.csv');

for (const grant of grants) {
// Only migrate if user-specific override (not default)
// Most users inherit from subscription, so user_product_permissions is sparse

// Find user's tenant subscription
const user = await ssoDb.select().from(userAccount).where(eq(userAccount.id,
grant.user_id));
const subscription = await ssoDb.select().from(tenantProductSubscriptions)

.where(eq(tenantProductSubscriptions.tenant_id, user.tenant_id))
.where(eq(tenantProductSubscriptions.product_id, customerPortalProductId));

// Create user-specific permission
await ssoDb.insert(userProductPermissions).values({

user_id: grant.user_id,
subscription_id: subscription.id,
feature_code: grant.screen_code, // Map screen_code feature_code
is_granted: grant.granted
});
}
}

Phase 4: Verification

-- Verify counts match
SELECT COUNT(_) FROM customer_portal.tenant;
SELECT COUNT(_) FROM sso.tenant;

SELECT COUNT(_) FROM customer_portal.user_account;
SELECT COUNT(_) FROM sso.user_account;

-- Verify subscriptions created for all tenants
SELECT COUNT(\*) FROM sso.tenant_product_subscriptions
WHERE product_id = (SELECT id FROM sso.products WHERE product_code =
'customer_portal');

-- Verify entitlements
SELECT COUNT(\*) FROM sso.product_entitlements;

-- Sample checks
SELECT t.org_name, p.product_code, s.status, COUNT(e.id) as entitlements_count
FROM sso.tenant t
JOIN sso.tenant_product_subscriptions s ON s.tenant_id = t.id
JOIN sso.products p ON s.product_id = p.id
JOIN sso.product_entitlements e ON e.subscription_id = s.id
GROUP BY t.org_name, p.product_code, s.status
ORDER BY t.org_name;

Phase 5: Customer Portal Updates

-- In Customer Portal database: Add reference tables for SSO IDs
CREATE TABLE user_reference (

customer_portal_user_id UUID PRIMARY KEY,
sso_user_id UUID NOT NULL,
email TEXT NOT NULL,
migrated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tenant_reference (
customer_portal_tenant_id UUID PRIMARY KEY,
sso_tenant_id UUID NOT NULL,
org_name TEXT NOT NULL,
migrated_at TIMESTAMPTZ DEFAULT NOW()

);

-- Populate reference tables (IDs are same, so direct copy)
INSERT INTO user_reference (customer_portal_user_id, sso_user_id, email)
SELECT id, id, email FROM user_account;

INSERT INTO tenant_reference (customer_portal_tenant_id, sso_tenant_id, org_name)
SELECT id, id, org_name FROM tenant;

Phase 6: Deprecate Old Tables (After 90 Days)

-- Rename old tables (keep for rollback safety)
ALTER TABLE tenant RENAME TO tenant_deprecated;
ALTER TABLE user_account RENAME TO user_account_deprecated;
ALTER TABLE user_screen_grant RENAME TO user_screen_grant_deprecated;

-- Drop old indexes
-- Drop old foreign keys

-- After another 30 days of stability:
-- DROP TABLE tenant_deprecated;
-- DROP TABLE user_account_deprecated;
-- DROP TABLE user_screen_grant_deprecated;

## 8.5 Data Ownership Matrix

Plain English:
This table shows which system owns which data. "Owns" means that system is the source of
truth and other systems may cache or reference it.

Data Type Owner Location Products Read From
User identity (email, SSO SSO Database (user_account) All products (via
name, role) SSO token)
Tenant info (org SSO SSO Database (tenant) All products (via SSO
name, country) SSO API)
Product catalog SSO SSO Database (products) All products (via SSO
Zoho API)
Subscriptions Zoho SSO Database All products (synced
(active/canceled) Zoho (tenant_product_subscriptions) from Zoho via BFF)
Entitlements Customer Portal SSO Database All products (via
(features granted) Product (product_entitlements) Permissions API)
Invoices (amount, Each System Zoho Billing Billing BFF proxies to
date, status) UI
Payments (card, Zoho Billing Billing BFF proxies to
transactions) UI
Plans & Pricing Zoho Billing Never stored in our
DB
Job history Customer Portal Database Customer Portal only
(Customer Portal) (job_history)
Documents S3 buckets (per product) Owning product only
(uploaded files)
Audit trail Each database (audit_event) Each system logs its
own actions

Caching Strategy: Cached Where TTL Invalidation
Data Type Product backend 15 minutes Forced on subscription
(Redis) 1 hour change
User permissions Product backend 30 minutes Auto-refresh
(memory) 5 minutes
JWKS public keys Product backend Forced on tenant
(Redis) update
Tenant metadata Billing BFF (Redis) Invalidated on webhook

Zoho invoices list

## 8.6 Performance Considerations

Indexes Strategy:

High-Cardinality Columns:

� `user_account.email` (UNIQUE index, used for login)
� `tenant.org_name` (B-tree index, used for search)
� `tenant_product_subscriptions.zoho_subscription_id` (UNIQUE index, webhook lookup)

Foreign Key Indexes:

� All `tenant_id` columns (most queries scoped by tenant)
� All `*_id` foreign keys (for JOIN performance)
Partial Indexes (WHERE clause):
� `user_account.mfa_enabled WHERE mfa_enabled = true` (sparse, saves space)
� `tenant_product_subscriptions.status WHERE status = 'active'` (most queries for active only)

JSONB Indexes:
� `product_entitlements.config` (GIN index for querying JSON fields)
� `audit_event.event_payload` (GIN index for audit queries)

Query Optimization Examples:
Slow Query (Without Index):

-- Find all active subscriptions for a tenant (full table scan)
SELECT \* FROM tenant_product_subscriptions
WHERE tenant_id = 'tenant-uuid'

AND status = 'active';

Fast Query (With Index):

-- Same query, uses idx_tenant_product_subs_tenant index
-- Execution time: <1ms for 1000s of subscriptions

Partitioning Strategy (Future):
When audit_event table grows very large (millions of rows), partition by time:

-- Partition audit_event by month
CREATE TABLE audit_event_2025_01 PARTITION OF audit_event

FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE audit_event_2025_02 PARTITION OF audit_event
FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Automatically drop old partitions after retention period
DROP TABLE audit_event_2024_01; -- After 12 months

End of Section 8 (Database Design)

PART 1 COMPLETE

Status: Part 1 Complete (Sections 1-8)
Sections Delivered:

# 133. Executive Summary

# 134. Business Context & Goals

# 135. Current State Analysis

# 136. Target Architecture

# 137. Actors & Permissions Model

# 138. Product & Subscription Model

# 139. Authentication & Authorization (Detailed)

# 140. Database Design (Comprehensive)

Next Steps:

� Review Part 1 for completeness and accuracy
� Create Part 2 (Sections 9-15): Implementation details, APIs, User Stories, Security
� Create Part 3 (Sections 16-18): Risk Management, Appendices, References

Document Metadata:

� **Part:** 1 of 3
� **Sections:** 1-8
� **Pages:** ~90 pages (estimated)
� **Word Count:** ~25,000 words
� **Last Updated:** 2025-11-10
� **Version:** 1.0 (Draft)
� **Status:** Complete - Ready for Review
Business Requirements Document (BRD)

iCaptur.AI - Multi-Product SSO & Centralized Billing Platform

Document Version: 1.0 (Part 2 of 3)
Date: November 10, 2025
Status: Draft - For Review
Owner: iTech India Private Limited
Project Code: ICAP-SSO-BILL-2025

Table of Contents (Part 2)

141. [Zoho Billing Integration (Detailed)](#9-zoho-billing-integration-detailed)
142. [API Specifications (Complete)](#10-api-specifications-complete)
143. [User Stories & Acceptance Criteria](#11-user-stories--acceptance-criteria)
144. [Implementation Plan (Detailed)](#12-implementation-plan-detailed)
145. [Security & Compliance (Comprehensive)](#13-security--compliance-comprehensive)
146. [Non-Functional Requirements](#14-non-functional-requirements)
147. [Testing Strategy](#15-testing-strategy)

PART 2: INTEGRATION, IMPLEMENTATION & QUALITY

# 9. ZOHO BILLING INTEGRATION (DETAILED)

## 9.1 Overview

What is Zoho Billing?
Zoho Billing is a subscription and billing management platform that will serve as our system of
record for all billing-related data. It handles:
� Product catalog and pricing plans
� Customer subscriptions and their lifecycle
� Invoice generation and delivery
� Payment processing (through Razorpay)
� Tax calculations
� Dunning (automatic retry for failed payments)
� Compliance (GST, tax rules)
Why Zoho Billing?

Instead of building our own billing infrastructure, Zoho Billing provides:

� **PCI Compliance** - Secure hosted pages for card entry (we never touch card data)
� **Payment Gateway Integration** - Razorpay already configured
� **Invoice Management** - Automatic generation, PDF creation, email delivery
� **Tax Compliance** - GST calculations for Indian customers, international tax rules
� **Proven Reliability** - Battle-tested system handling millions of transactions

Our Role:

We build a Billing BFF (Backend-for-Frontend) that:

� Mediates between our UI and Zoho APIs
� Transforms Zoho data into user-friendly DTOs
� Handles multi-region routing (India vs International)
� Processes Zoho webhooks and syncs entitlements to SSO
� Provides security layer (validates SSO tokens, enforces authorization)

## 9.2 Multi-Region Setup

Business Requirement:

We operate in two markets with different payment preferences and regulatory requirements:

� **India** - Customers prefer INR pricing and local payment methods
� **International** - Customers use USD and international payment methods

Technical Solution: Two Zoho Billing Accounts

Aspect India Account International Account
Zoho Organization Zoho India Zoho International
API Base URL https://billing.zoho.in https://billing.zoho.com
Currency INR () USD ($)
Customer Base Tenants with country = 'IN' Tenants with country != 'IN'
Payment Gateway Razorpay (India) Razorpay (International)
Tax Handling GST (India) International tax rules
Plans INR-denominated (e.g., USD-denominated (e.g.,
5,000/month) $50/month)

Routing Logic (Automatic):

When the Billing BFF needs to interact with Zoho (create subscription, fetch invoices, etc.), it
automatically determines which account to use:

function getZohoConfig(tenant: Tenant): ZohoBillingConfig {
const regionCode = tenant.country === 'IN' ? 'india' : 'international';
return zohoConfigService.findByRegion(regionCode);

}
Database Storage:
The zoho_billing_config table stores credentials for both accounts:

-- Example data
INSERT INTO zoho_billing_config (region_code, api_base_url, org_id, client_id, ...)
VALUES

('india', 'https://billing.zoho.in', 'org-india-123', 'client-india-456', ...),
('international', 'https://billing.zoho.com', 'org-intl-789', 'client-intl-012',
...);

Each tenant_product_subscription record includes zoho_account_region so we always
know which Zoho account manages that subscription.
User Experience:
From the customer's perspective, this is completely transparent:
� Indian customers see prices in and pay via Indian payment methods
� International customers see prices in $ and pay via international methods
� Both use the same Account Center UI
� Currency symbol adjusts automatically based on tenant country

## 9.3 Zoho Hosted Pages

What are Hosted Pages?
Hosted Pages are secure, PCI-compliant web pages hosted by Zoho where customers enter
payment information. We redirect users to these pages for:

� **Checkout** - Subscribe to a plan or add-on
� **Update Payment Method** - Update credit card details
� **Manage Subscription** - Change plan, adjust seats (optional)

Why Hosted Pages?
� **Security** - Card data never touches our servers (reduces PCI scope)
� **Compliance** - Zoho handles PCI DSS compliance
� **Reliability** - Battle-tested payment forms with fraud detection
� **Maintenance** - Zoho updates forms for new payment methods, security standards

Flow: New Subscription (Upgrade Plan) 148. **User Action**: User clicks "Upgrade to Pro Plan" in Account Center billing page 149. **Frontend Request**:

```http
POST https://app.icaptur.ai/api/v1/billing/checkout
Authorization: Bearer {sso_token}
Content-Type: application/json
{

"planId": "customer-portal-pro-monthly",
"seats": 5,
"returnUrl": "https://app.icaptur.ai/settings/billing?status=success"
}
```

150. **BFF Processing**:

- Validates SSO token (user must be org_admin)
- Extracts tenant_id from token
- Determines Zoho region from tenant.country
- Calls Zoho API to create Hosted Page:

```http
POST https://billing.zoho.in/api/v1/hostedpages/newsubscription
Authorization: Bearer {zohoaccesstoken}
{

"customer_id": "zoho-cust-123",
"plan_code": "customer-portal-pro-monthly",
"quantity": 5,
"redirect_url": "https://app.icaptur.ai/settings/billing?status=success"
}
```

151. **BFF Response**:

```json
{
  "hostedPageId": "hp-xyz789",
  "hostedPageUrl": "https://billing.zoho.in/subscribe/hp-xyz789",
  "expiresAt": "2025-11-10T18:30:00Z"
}
```

152. **Frontend Redirect**:

- User is redirected to hostedPageUrl
- Zoho displays checkout form with plan details, pricing, card entry

153. **User Completes Checkout**:

- User enters card details on Zoho page
- Zoho processes payment via Razorpay
- Zoho creates subscription

154. **Redirect Back**:

- Zoho redirects to:
  https://app.icaptur.ai/settings/billing?status=success&hp_id=hp-xyz789

155. **Webhook Processing** (happens in parallel with redirect):

- Zoho sends subscription_created webhook to our BFF
- BFF updates tenant_product_subscriptions table
- BFF calls SSO Admin API to update entitlements
- User's next token refresh includes new product access

156. **UI Update**:

- Account Center shows "Subscription Active" with new plan details
- If user navigates to Customer Portal, they immediately have access to Pro features
  Flow: Update Payment Method
  Similar flow, but simpler:

POST /api/v1/billing/payment-method/update
Returns hostedPageUrl
User updates card on Zoho page
Webhook confirms update
UI shows updated payment method (last 4 digits)

Hosted Page Expiry:
� Hosted pages expire after **15 minutes** by default
� If user doesn't complete checkout, they can request a new link
� BFF returns `expiresAt` timestamp; UI can show countdown or "Try again"

## 9.4 Webhook Integration

What are Webhooks?
Webhooks are HTTP callbacks from Zoho to our Billing BFF whenever important billing events
occur. Instead of polling Zoho constantly to check subscription status, Zoho proactively notifies
us.

Why Webhooks?

� **Real-time** - Subscription changes reflect immediately
� **Efficient** - No need to poll Zoho APIs every few seconds
� **Reliable** - Zoho retries failed webhook deliveries
� **Complete** - Captures all subscription lifecycle events

Webhook Endpoint:

POST https://app.icaptur.ai/_hooks/zoho

� **No Authentication Header** - Webhooks use HMAC signature instead
� **Public Endpoint** - Must be accessible from Zoho IPs
� **IP Allowlist** - Only accept requests from known Zoho IP ranges
� **HMAC Signature** - Verify every webhook to prevent forgery

Webhook Events: When It Fires Our Action
Event Type New subscription created via Create
Hosted Page tenant_product_subscription,
subscription_created sync entitlements
Subscription auto-renewed Update next_billing_date, audit
subscription_renewed (billing cycle) event
subscription_changed Plan upgrade/downgrade or seat Update subscription record,
subscription_canceled change sync entitlements
subscription_expired User canceled or admin Set status to 'canceled', revoke
invoice_created canceled entitlements
invoice_paid Subscription ended (post- Set status to 'expired', revoke
payment_succeeded cancellation or trial) access
payment_failed New invoice generated Store invoice metadata (for
/invoices endpoint)
Invoice payment successful Update billing_status to 'active',
audit
Payment processed successfully Update payment method details
(if changed)
Payment attempt failed Update billing_status to
'past_due', email user

Webhook Payload Example:

{
"event_type": "subscription_created",
"event_id": "evt_abc123",
"event_time": "2025-11-10T12:34:56Z",
"data": {
"subscription": {
"subscription_id": "sub-zoho-789",
"customer_id": "cust-zoho-456",
"plan_code": "customer-portal-pro-monthly",
"status": "live",
"quantity": 5,
"next_billing_at": "2025-12-10T12:34:56Z",
"created_at": "2025-11-10T12:34:56Z"
}
}
}

Security: HMAC Signature Verification

Every webhook includes a signature header:

X-Zoho-Webhook-Signature: sha256=abc123def456...

Our BFF verifies this signature before processing:

function verifyZohoSignature(payload: string, signature: string, secret: string):
boolean {

const expectedSignature = crypto
.createHmac('sha256', secret)
.update(payload)
.digest('hex');

return crypto.timingSafeEqual(
Buffer.from(signature),
Buffer.from(`sha256=${expectedSignature}`)

);
}

If signature doesn't match reject webhook with 401.

Security: IP Allowlist

We only accept webhooks from known Zoho IP ranges:

const ZOHO_WEBHOOK_IPS = [
'136.233.0.0/16', // Zoho webhook IPs (example)
'168.245.0.0/16', // Additional range

];

// In webhook handler
if (!isIpInAllowlist(request.ip, ZOHO_WEBHOOK_IPS)) {

return { statusCode: 403, body: 'Forbidden' };
}

Idempotency: Preventing Duplicate Processing

Zoho may send the same webhook multiple times (e.g., if our response is slow). We prevent
duplicate processing using idempotency keys:

CREATE TABLE webhook_events (
id UUID PRIMARY KEY,
event_id TEXT UNIQUE NOT NULL, -- Zoho's event_id
event_type TEXT NOT NULL,
payload JSONB NOT NULL,
processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
processing_status TEXT NOT NULL -- 'success', 'failed', 'retrying'
);

Webhook Processing Flow:

157. **Receive webhook** at `POST /_hooks/zoho`
158. **Verify IP** - Check allowlist
159. **Verify signature** - HMAC check
160. **Check idempotency** - Has this `event_id` been processed?

- If yes Return 200 OK immediately (already processed)

- If no Continue

161. **Store webhook** - Insert into `webhook_events` table
162. **Parse event** - Determine event type
163. **Execute business logic**:

- For subscription_created: Create/update tenant_product_subscription, call SSO to
  update entitlements

- For subscription_canceled: Update subscription status, call SSO to revoke entitlements

- For payment_failed: Update billing_status, trigger alert email

164. **Update webhook record** - Mark as 'success' or 'failed'
165. **Return 200 OK** - Tell Zoho we processed it
166. **On Failure** - If step 7 fails:

- Mark webhook as 'failed'

- Send to Dead Letter Queue (DLQ)

- Alert DevOps

- Return 500 (Zoho will retry)

Dead Letter Queue (DLQ) & Replay:

Failed webhooks go to a DLQ for manual inspection and replay:

CREATE TABLE webhook_dlq (
id UUID PRIMARY KEY,
webhook_event_id UUID REFERENCES webhook_events(id),
failure_reason TEXT,
retry_count INTEGER DEFAULT 0,
last_retry_at TIMESTAMPTZ,
resolved_at TIMESTAMPTZ

);

DevOps can:

� View failed webhooks in admin UI
� Inspect failure reason (e.g., "SSO service unreachable")
� Manually replay after fixing issue
� Mark as resolved

## 9.5 Zoho API Endpoints Used

Authentication:

Zoho uses OAuth 2.0 with refresh tokens. We store a long-lived refresh token and exchange it
for short-lived access tokens:

POST https://accounts.zoho.in/oauth/v2/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
client_id={client_id}&
client_secret={client_secret}&
refresh_token={refresh_token}

Response:

{
"access_token": "1000.abc123...",
"expires_in": 3600,
"token_type": "Bearer"

}

We cache access tokens in memory (or Redis) and refresh when needed.

Zoho Billing APIs We Use:

API Endpoint Purpose Called When
GET /api/v1/customers/{customer_id} Fetch customer details Billing summary page load
GET List customer subscriptions Billing summary page load
/api/v1/subscriptions?customer_id={id}
GET Get subscription details View specific subscription
/api/v1/subscriptions/{subscription_id}
GET /api/v1/invoices?customer_id={id} List invoices Invoices page load
GET /api/v1/invoices/{invoice_id} Get invoice details View/download invoice
POST Create checkout Hosted User clicks "Upgrade"
/api/v1/hostedpages/newsubscription Page
POST /api/v1/hostedpages/updatecard Create payment method User clicks "Update Card"
update page
POST /api/v1/subscriptions/{id}/cancel Cancel subscription User clicks "Cancel
Subscription"
POST Resume canceled User clicks "Resume"
/api/v1/subscriptions/{id}/reactivate subscription

Rate Limits:
� Zoho enforces rate limits: **100 requests per minute** per organization
� Our BFF implements caching to reduce API calls:

- Subscription summary: Cache 5 minutes
- Invoice list: Cache 15 minutes
- Customer details: Cache 10 minutes

## 9.6 Error Handling & Retry

Zoho API Errors:

Zoho returns standard HTTP status codes:

Status Meaning Our Action
200 OK Success Process response
400 Bad Request Invalid input (e.g., invalid Return user-friendly error
plan_code)
401 Unauthorized Access token expired Refresh token, retry
404 Not Found Resource doesn't exist (e.g., Return error to user
subscription_id)
429 Too Many Requests Rate limit exceeded Wait, then retry with exponential
backoff
500 Internal Server Error Zoho service issue Retry up to 3 times, then fail
gracefully
503 Service Unavailable Zoho maintenance Retry with backoff

Retry Strategy:

For transient errors (401, 429, 500, 503):

async function callZohoWithRetry(apiCall: () => Promise<any>, maxRetries = 3) {
for (let attempt = 1; attempt <= maxRetries; attempt++) {
try {
return await apiCall();
} catch (error) {
if (error.status === 401) {
// Refresh token and retry
await refreshZohoToken();
continue;
}

if ([429, 500, 503].includes(error.status) && attempt < maxRetries) {
// Exponential backoff: 1s, 2s, 4s
const delay = Math.pow(2, attempt - 1) \* 1000;
await sleep(delay);
continue;

}

// Max retries exceeded or non-retryable error
throw error;
}
}
}

User-Facing Errors:

When Zoho API fails, we return clear, actionable messages:

Zoho Error User-Facing Message
400 (invalid plan) "This plan is no longer available. Please try a
404 (subscription) different plan."
429 (rate limit) "We couldn't find your subscription. Contact
500/503 (Zoho down) support if this persists."
Hosted Page expired "Too many requests. Please wait a moment and
try again."
"Billing service is temporarily unavailable. Try
again in a few minutes."
"This payment link expired. Click Try Again to get
a new one."

Webhook Retry:

If our webhook handler fails (e.g., SSO service unreachable), Zoho automatically retries:

� Retry schedule: Immediate, 1 min, 5 min, 15 min, 1 hour, 6 hours
� After 6 failed attempts, Zoho stops retrying
� We monitor webhook failures in logs and DLQ

## 9.7 Billing BFF Data Flow Summary

User Views Billing Summary:

User Account Center UI
GET /api/v1/billing/me/summary (Bearer token)
Billing BFF validates token
BFF calls GET /subscriptions?customer_id={zoho_customer_id} (from

tenant.zoho_customer_id)
BFF transforms Zoho response to UI-friendly DTO
BFF returns: { currentPlan, status, nextBillingDate, paymentMethod: { last4:

"1234" }, trialEndsAt }
UI displays summary card

User Upgrades Plan:

User clicks "Upgrade" Account Center UI
POST /api/v1/billing/checkout { planId, seats }
Billing BFF validates token (must be org_admin)
BFF calls Zoho POST /hostedpages/newsubscription
BFF returns { hostedPageUrl, expiresAt }
UI redirects to hostedPageUrl (Zoho)
User completes checkout on Zoho
Zoho sends webhook BFF
BFF updates tenant_product_subscription
BFF calls SSO PUT /admin/tenants/{id}/entitlements
Zoho redirects user back to Account Center
UI shows "Subscription Active"

# 10. API SPECIFICATIONS (COMPLETE)

## 10.1 API Overview

We have three primary API groups:

167. **SSO Service APIs** - Authentication, authorization, user/tenant management (in
     `icaptur-sso` repo)

168. **Billing BFF APIs** - Billing management, Zoho integration (in `icaptur-accounts` repo)
169. **Product APIs** - Each product's business logic (e.g., Customer Portal job

management)

This section documents SSO and Billing BFF APIs. Product APIs remain in their respective
repos.

Base URLs:

SSO Service: https://sso.icaptur.ai/api/v1
Billing BFF: https://app.icaptur.ai/api/v1/billing
Permissions API: https://app.icaptur.ai/api/v1/permissions

Common Headers:

All authenticated endpoints require:

Authorization: Bearer {access_token}
Content-Type: application/json

Error Response Format:

{
"error": {
"code": "BILLING_UPSTREAM",
"message": "Billing service is temporarily unavailable",
"correlationId": "req-abc123",
"timestamp": "2025-11-10T12:34:56Z"
}

}

Error Codes:

Code HTTP Status Meaning
UNAUTHORIZED 401 Invalid or expired token
FORBIDDEN 403 Token valid but user lacks
permission
NOT_FOUND 404 Resource doesn't exist
VALIDATION_ERROR 400 Invalid request body
BILLING_UPSTREAM 502 Zoho API error
RATE_LIMIT_EXCEEDED 429 Too many requests
INTERNAL_ERROR 500 Unexpected server error

## 10.2 SSO Service APIs

### 10.2.1 Authentication Endpoints

POST /auth/login

User login with email and password.

Request:

{
"email": "user@example.com",
"password": "SecurePassword123!",
"productCode": "accounts" // Which product is requesting auth

}

Response (200 OK):

{
"accessToken": "eyJhbGc...",
"refreshToken": "ref_abc123...",
"expiresIn": 3600,
"tokenType": "Bearer",
"user": {
"id": "user-uuid",
"email": "user@example.com",
"firstName": "John",
"lastName": "Doe",
"role": "org_admin",
"tenantId": "tenant-uuid"
}

}

Errors:

� `401 UNAUTHORIZED` - Invalid credentials
� `403 FORBIDDEN` - Account locked (too many failed attempts)
� `400 VALIDATION_ERROR` - Missing required fields

POST /auth/mfa/verify

Verify MFA code (if user has MFA enabled).

Request:

{ // From login response if MFA required
"userId": "user-uuid",
"code": "123456",
"tempToken": "temp_mfa_token_xyz"

}

Response (200 OK):

{
"accessToken": "eyJhbGc...",
"refreshToken": "ref_abc123...",
"expiresIn": 3600,
"tokenType": "Bearer"
}

POST /auth/refresh

Refresh access token using refresh token.

Request:

{ // Which product needs new token
"refreshToken": "ref_abc123...",
"productCode": "customer_portal"

}

Response (200 OK):

{ // Rotated refresh token
"accessToken": "eyJhbGc...",
"refreshToken": "ref_new456...",
"expiresIn": 3600,
"tokenType": "Bearer"

}

Notes:

� Refresh tokens are rotated on every use (old token invalidated)
� Each product gets a token with product-specific `aud` claim

POST /auth/logout

Invalidate refresh token and end session.

Request:

{
"refreshToken": "ref_abc123..."

}

Response (204 No Content)

### 10.2.2 Permissions API

GET /permissions/me
Get current user's permissions for the product specified in token's aud field.
Headers:

Authorization: Bearer {token_with_aud_customer_portal}

Response (200 OK):
{
"userId": "user-uuid",
"tenantId": "tenant-uuid",
"productCode": "customer_portal", // Read from token's aud field
"permissions": [
"cad_table",
"cad_checklist",
"invoices",
"eob"
],
"cacheUntil": "2025-11-10T13:00:00Z" // Client can cache until this time

}

Logic:

# 170. BFF validates token and extracts `aud` (e.g., "customer_portal")

# 171. BFF queries SSO database:

- Find tenant's subscription for product with aud = "customer_portal"

- Get product_entitlements for that subscription

- Check user_product_permissions for any user-specific overrides

# 172. Return merged permissions list

Caching:

� Clients should cache response for 5-15 minutes (indicated by `cacheUntil`)
� SSO can trigger forced refresh by setting shorter `cacheUntil`

### 10.2.3 User Management APIs (Admin Only)

POST /admin/users

Create new user (iTech admins or org_admins only).

Request:

{
"email": "newuser@example.com",
"firstName": "Jane",
"lastName": "Smith",
"role": "org_user",
"tenantId": "tenant-uuid", // Required unless creating iTech admin
"sendInvite": true // Send activation email

}

Response (201 Created):

{
"id": "user-new-uuid",
"email": "newuser@example.com",
"firstName": "Jane",
"lastName": "Smith",
"role": "org_user",
"status": "invited",
"tenantId": "tenant-uuid",
"createdAt": "2025-11-10T12:34:56Z"
}

PATCH /admin/users/{userId}
Update user details (name, role, status).
Request:

{
"firstName": "Jane Updated",
"role": "org_admin",
"status": "active"

}

Response (200 OK):

{
"id": "user-uuid",
"email": "user@example.com",
"firstName": "Jane Updated",
"lastName": "Smith",
"role": "org_admin",
"status": "active",
"updatedAt": "2025-11-10T12:40:00Z"

}

DELETE /admin/users/{userId}
Deactivate user (soft delete - sets status to 'inactive').
Response (204 No Content)

### 10.2.4 Tenant Management APIs (Admin Only)

GET /admin/tenants
List all tenants (iTech admins only).
Query Params:
� `page` (default: 1)
� `limit` (default: 20, max: 100)
� `status` (filter: 'active', 'inactive')
� `search` (search orgName, email)

Response (200 OK):
{
"tenants": [
{
"id": "tenant-uuid",
"orgName": "Acme Corp",
"status": "active",
"country": "IN",
"email": "contact@acme.com",
"primaryContactName": "John Doe",
"zohoCustomerId": "zoho-cust-123",
"zohoAccountRegion": "india",
"createdAt": "2025-01-15T10:00:00Z"
}
],
"pagination": {
"page": 1,
"limit": 20,
"total": 150,
"totalPages": 8
}

}

GET /admin/tenants/{tenantId}

Get tenant details.

Response (200 OK):

{
"id": "tenant-uuid",
"orgName": "Acme Corp",
"status": "active",
"country": "IN",
"email": "contact@acme.com",
"phone": "+91-1234567890",
"primaryContact": {
"firstName": "John",
"lastName": "Doe",
"email": "john@acme.com",
"phone": "+91-9876543210"
},
"zohoCustomerId": "zoho-cust-123",
"zohoAccountRegion": "india",
"subscriptions": [
{
"productCode": "customer_portal",
"productName": "Customer Portal",
"status": "active",
"billingStatus": "active",
"subscribedAt": "2025-01-15T10:00:00Z",
"nextBillingDate": "2025-12-15T10:00:00Z"
}
],
"createdAt": "2025-01-15T10:00:00Z",
"updatedAt": "2025-11-10T08:00:00Z"
}

PUT /admin/tenants/{tenantId}/entitlements

Update tenant's product entitlements (called by Billing BFF after webhook).

Request:

{
"productCode": "customer_portal",
"entitlements": [
{
"featureCode": "cad_table",
"isGranted": true,
"config": { "max_mb": 100, "max_concurrent_jobs": 5 }
},
{
"featureCode": "invoices",
"isGranted": true,
"config": { "max_mb": 50 }
}
]

}

Response (200 OK):

{
"tenantId": "tenant-uuid",
"productCode": "customer_portal",
"entitlements": [
{
"featureCode": "cad_table",
"isGranted": true,
"config": { "max_mb": 100, "max_concurrent_jobs": 5 }
},
{
"featureCode": "invoices",
"isGranted": true,
"config": { "max_mb": 50 }
}
],
"updatedAt": "2025-11-10T12:45:00Z"

}

Notes:

� This endpoint is called by Billing BFF after processing Zoho webhooks
� Protected by service-to-service authentication (not user tokens)
� Triggers token invalidation / forced refresh for affected users

## 10.3 Billing BFF APIs

### 10.3.1 Billing Summary

GET /billing/me/summary

Get current user's billing summary (org_admin or iTech admin only).

Headers:

Authorization: Bearer {sso_token}

Response (200 OK):

{
"tenantId": "tenant-uuid",
"tenantName": "Acme Corp",
"subscriptions": [
{
"productCode": "customer_portal",
"productName": "Customer Portal",
"planName": "Pro Plan",
"status": "active",
"billingStatus": "active",
"currentPeriodStart": "2025-11-10T00:00:00Z",
"currentPeriodEnd": "2025-12-10T00:00:00Z",
"nextBillingDate": "2025-12-10T00:00:00Z",
"quantity": 5,
"amount": 5000,
"currency": "INR",
"interval": "monthly",
"trialEndsAt": null,
"canceledAt": null,
"canUpgrade": true,
"canDowngrade": true,
"canCancel": true
}
],
"paymentMethod": {
"type": "card",
"last4": "1234",
"brand": "Visa",
"expiryMonth": 12,
"expiryYear": 2027
},
"upcomingInvoice": {
"amount": 5000,
"currency": "INR",
"date": "2025-12-10T00:00:00Z"
}

}

Errors:

� `403 FORBIDDEN` - User is not org_admin
� `502 BILLING_UPSTREAM` - Zoho API error

### 10.3.2 Invoices

GET /billing/me/invoices

List invoices for current tenant.

Query Params:

� `page` (default: 1)
� `limit` (default: 20, max: 100)
� `status` (filter: 'paid', 'unpaid', 'overdue')

Response (200 OK):

{
"invoices": [
{
"invoiceId": "inv-zoho-123",
"invoiceNumber": "INV-2025-001",
"date": "2025-11-10T00:00:00Z",
"dueDate": "2025-11-20T00:00:00Z",
"status": "paid",
"amount": 5000,
"currency": "INR",
"paidAt": "2025-11-11T08:30:00Z",
"downloadUrl": "https://app.icaptur.ai/api/v1/billing/invoices/inv-zoho-

123/download"
}

],
"pagination": {

"page": 1,
"limit": 20,
"total": 48,
"totalPages": 3
}
}

GET /billing/invoices/{invoiceId}/download

Download invoice PDF (proxied from Zoho or redirect to Zoho URL).

Response (200 OK):

� Streams PDF file
� OR redirects (302) to Zoho-hosted PDF URL

### 10.3.3 Checkout & Payment

POST /billing/checkout
Create checkout Hosted Page for new subscription or plan upgrade.
Request:

{
"planId": "customer-portal-pro-monthly",
"quantity": 5,
"returnUrl": "https://app.icaptur.ai/settings/billing?status=success"

}

Response (200 OK):

{
"hostedPageId": "hp-xyz789",
"hostedPageUrl": "https://billing.zoho.in/subscribe/hp-xyz789",
"expiresAt": "2025-11-10T13:00:00Z"

}

Frontend Action:

� Redirect user to `hostedPageUrl`
� User completes checkout on Zoho page
� Zoho redirects back to `returnUrl`

POST /billing/payment-method/update
Create Hosted Page for updating payment method (credit card).
Request:

{
"returnUrl": "https://app.icaptur.ai/settings/billing?status=updated"

}

Response (200 OK):

{
"hostedPageId": "hp-card-abc",
"hostedPageUrl": "https://billing.zoho.in/portal/updatecard/hp-card-abc",
"expiresAt": "2025-11-10T13:00:00Z"

}

### 10.3.4 Subscription Management

POST /billing/cancel
Cancel subscription (immediate or at period end).
Request:

{
"subscriptionId": "sub-zoho-789",
"atPeriodEnd": true, // If true, cancel at end of billing period; if false,

cancel immediately
"reason": "Switching to different solution" // Optional
}

Response (200 OK):

{
"subscriptionId": "sub-zoho-789",
"status": "canceled",
"canceledAt": "2025-11-10T12:50:00Z",
"accessUntil": "2025-12-10T00:00:00Z", // If atPeriodEnd=true
"message": "Your subscription will remain active until Dec 10, 2025"

}

Errors:

� `403 FORBIDDEN` - User is not org_admin
� `400 VALIDATION_ERROR` - Subscription already canceled

POST /billing/resume
Resume a canceled subscription (before period end).
Request:

{
"subscriptionId": "sub-zoho-789"

}

Response (200 OK):

{
"subscriptionId": "sub-zoho-789",
"status": "active",
"nextBillingDate": "2025-12-10T00:00:00Z",
"message": "Subscription resumed successfully"

}

### 10.3.5 Webhook Endpoint

POST /\_hooks/zoho
Receive webhooks from Zoho Billing (not called by UI, only by Zoho servers).
Headers:

X-Zoho-Webhook-Signature: sha256=abc123...
Content-Type: application/json

Request Body:

{
"event_type": "subscription_created",
"event_id": "evt-abc123",
"event_time": "2025-11-10T12:34:56Z",
"data": {
"subscription": {
"subscription_id": "sub-zoho-789",
"customer_id": "cust-zoho-456",
"plan_code": "customer-portal-pro-monthly",
"status": "live",
"quantity": 5,
"next_billing_at": "2025-12-10T00:00:00Z"

}
}
}

Response (200 OK):

{
"received": true,
"eventId": "evt-abc123"

}

Processing:

# 173. Verify HMAC signature

# 174. Check IP allowlist

# 175. Check idempotency (already processed?)

# 176. Parse event type

# 177. Update database (`tenant_product_subscriptions`)

# 178. Call SSO Admin API to sync entitlements

# 179. Write audit event

# 180. Return 200 OK

Errors:

� `401 UNAUTHORIZED` - Invalid signature
� `403 FORBIDDEN` - IP not in allowlist
� `500 INTERNAL_ERROR` - Processing failed (Zoho will retry)

## 10.4 OpenAPI Documentation

All APIs documented via OpenAPI 3.0 specification:

� **SSO Service**: `https://sso.icaptur.ai/api-docs`
� **Billing BFF**: `https://app.icaptur.ai/api/v1/billing/api-docs`

Generated SDKs:

Frontend apps use generated TypeScript clients:

// packages/sdk-billing-bff (generated from OpenAPI)
import { BillingApi } from '@icaptur/sdk-billing-bff';

const billingApi = new BillingApi({
basePath: 'https://app.icaptur.ai/api/v1/billing',
accessToken: 'eyJhbGc...'
});

const summary = await billingApi.getBillingSummary();

# 11. USER STORIES & ACCEPTANCE CRITERIA

## 11.1 Epic 1: Single Sign-On

Epic Goal: Users can log in once and access all iCaptur products seamlessly.

Story 1.1: User Login
As a Customer Portal user
I want to log in with my email and password at accounts.icaptur.ai
So that I can access my account and billing settings
Acceptance Criteria:
� User navigates to `https://app.icaptur.ai`
� Login form displays with email and password fields
� User enters valid credentials and clicks "Sign In"
� System validates credentials against SSO database
� On success, user receives access token and refresh token
� User is redirected to dashboard/home page
� Invalid credentials show error: "Invalid email or password"
� After 5 failed attempts, account locks for 30 minutes
� Locked account shows error: "Too many failed attempts. Try again in 30 minutes"

Technical Notes:
� POST /auth/login endpoint
� JWT tokens with 1-hour expiry
� Password validation using bcrypt (dev) or Cognito (prod)
� Audit event logged for every login attempt

Story 1.2: MFA Verification (Optional)
As a security-conscious user
I want to enable MFA using an authenticator app
So that my account is protected even if my password is compromised
Acceptance Criteria:
� User can enable MFA in Settings Security
� System generates TOTP secret and displays QR code
� User scans QR with Google Authenticator / Authy
� User enters 6-digit code to confirm setup
� System validates code and enables MFA
� Backup codes (10) are generated and displayed (user must save)
� On next login, after password, user is prompted for MFA code
� User enters 6-digit code from authenticator app
� System validates code via TOTP algorithm
� On success, user receives access token and proceeds
� Invalid code shows error: "Invalid verification code"
� User can use backup code if authenticator unavailable

Technical Notes:

� TOTP algorithm (30-second window, 6 digits)
� Secrets stored encrypted in `user_account.mfa_secret_encrypted`
� Backup codes stored encrypted in `user_account.mfa_backup_codes_encrypted`
� POST /auth/mfa/verify endpoint

Story 1.3: SSO Across Products
As a Customer Portal user

I want to access Customer Portal without logging in again

So that I have a seamless experience

Acceptance Criteria:

� User logs in at `app.icaptur.ai` (SSO session created)
� User navigates to `portal.icaptur.ai`
� Customer Portal checks for SSO session (via API call to SSO)
� If session exists, Customer Portal requests token with `aud=customer_portal`
� SSO issues token without re-authentication
� Customer Portal validates token and grants access
� User can use Customer Portal features immediately
� If session expired, user redirects to SSO login
� After login, user redirects back to Customer Portal

Technical Notes:

� SSO session stored as httpOnly cookie (8-hour expiry)
� Customer Portal calls POST /auth/token with session cookie
� Token includes `aud: "customer_portal"` claim
� Customer Portal caches token until expiry

Story 1.4: Token Refresh
As a user actively using a product
I want my session to extend automatically
So that I don't get logged out while working
Acceptance Criteria:
� Access token expires after 1 hour
� Frontend detects expiry (via 401 response or token check)
� Frontend calls POST /auth/refresh with refresh token
� SSO issues new access token and rotated refresh token
� Frontend retries failed request with new access token
� User continues working without interruption
� If refresh token is invalid/expired, user redirects to login

Technical Notes:
� Refresh token rotation (old token invalidated)
� Refresh token expiry: 7 days (dev), 30 days (prod)
� Frontend uses interceptor to handle 401 and auto-refresh

## 11.2 Epic 2: Account Center & Billing Management

Epic Goal: Users can view and manage their subscriptions, invoices, and payment methods.

Story 2.1: View Billing Summary
As an org_admin
I want to view my current subscription status and billing details
So that I know what plan I'm on and when the next payment is due
Acceptance Criteria:
� User navigates to Settings Billing
� Page displays "Current Plan" card with:

- Plan name (e.g., "Pro Plan")
- Status (e.g., "Active", "Trial", "Canceled")
- Billing cycle (e.g., "Monthly", "Annual")
- Next billing date
- Amount and currency
- Number of seats
  � Page displays "Payment Method" card with:

- Card type (Visa, Mastercard, etc.)
- Last 4 digits
- Expiry date
- "Update Card" button
  � Page displays "Upcoming Invoice" section with amount and date
  � If subscription is in trial, display trial end date and "Upgrade Now" button
  � If subscription is canceled, display access end date and "Resume" button
  � Loading state while fetching data
  � Error state if Zoho API fails

Technical Notes:
� GET /billing/me/summary endpoint
� Data fetched from Zoho via Billing BFF
� Cached for 5 minutes
� org_user cannot access billing (403 error)

Story 2.2: View Invoices
As an org_admin
I want to view all my past invoices
So that I can download them for accounting purposes
Acceptance Criteria:
� User navigates to Settings Billing Invoices tab
� Page displays table with columns:

- Invoice number
- Date
- Amount
- Status (Paid, Unpaid, Overdue)
- Download button
  � Invoices sorted by date (newest first)
  � Pagination (20 per page)
  � User can filter by status (All, Paid, Unpaid)
  � User clicks "Download" button
  � PDF downloads or opens in new tab
  � Loading state while fetching invoices
  � Empty state if no invoices: "No invoices yet"

Technical Notes:

� GET /billing/me/invoices endpoint
� Invoices fetched from Zoho
� Download via GET /billing/invoices/{id}/download (proxied or redirected)
� Cached for 15 minutes

Story 2.3: Upgrade Plan
As an org_admin

I want to upgrade to a higher-tier plan

So that I can access more features and capacity

Acceptance Criteria:
� User views billing summary page
� "Available Plans" section shows upgrade options (e.g., "Pro Plan - $99/month")
� Each plan card shows:

- Plan name

- Price and currency

- Features included

- "Upgrade" button
  � User clicks "Upgrade" on Pro Plan
  � Modal/page shows plan details and seat selection
  � User selects number of seats (default: current seats)
  � System calculates total price
  � User clicks "Proceed to Payment"
  � System calls POST /billing/checkout
  � User redirects to Zoho Hosted Page
  � User enters card details and completes payment
  � Zoho redirects back to Account Center with success message
  � Billing summary page updates to show new plan
  � Webhook processed in background to sync entitlements
  � User navigates to Customer Portal and immediately has Pro features

Technical Notes:

� POST /billing/checkout returns hostedPageUrl
� Frontend redirects to Zoho Hosted Page
� Webhook `subscription_changed` processed by BFF
� BFF calls SSO PUT /admin/tenants/{id}/entitlements
� Token refresh required for new entitlements to take effect

Story 2.4: Update Payment Method
As an org_admin
I want to update my credit card details
So that payments continue without interruption
Acceptance Criteria:
� User views billing summary page
� Payment Method card shows current card (last 4 digits)
� User clicks "Update Card" button
� System calls POST /billing/payment-method/update
� User redirects to Zoho Hosted Page
� User enters new card details
� Zoho validates card
� Zoho redirects back with success message
� Billing summary page updates to show new card (last 4 digits)
� Webhook processed to confirm update

Technical Notes:

� POST /billing/payment-method/update returns hostedPageUrl
� Webhook `payment_succeeded` confirms card update
� No entitlement changes required

Story 2.5: Cancel Subscription
As an org_admin
I want to cancel my subscription
So that I stop being charged when I no longer need the product
Acceptance Criteria:
� User views billing summary page
� User clicks "Cancel Subscription" button
� Modal displays with options:

- "Cancel at end of billing period" (default)
- "Cancel immediately"
  � Modal shows warning: "You will lose access to features on [date]"
  � User selects option and enters optional reason
  � User clicks "Confirm Cancellation"
  � System calls POST /billing/cancel with `atPeriodEnd: true/false`
  � If `atPeriodEnd=true`: Subscription marked as canceled, access until period end
  � If `atPeriodEnd=false`: Subscription canceled immediately, access revoked
  � Billing summary shows "Canceled" status with access end date
  � Webhook processed to update entitlements
  � User can click "Resume Subscription" to undo cancellation (before period end)

Technical Notes:

� POST /billing/cancel endpoint
� Webhook `subscription_canceled` processed by BFF
� BFF calls SSO to revoke entitlements (immediate) or schedule revocation (period end)
� Audit event logged with cancellation reason

## 11.3 Epic 3: User & Tenant Management

Epic Goal: org_admins can manage users in their organization; iTech admins can manage all
tenants.

Story 3.1: Invite User
As an org_admin
I want to invite a new user to my organization
So that they can access our subscribed products
Acceptance Criteria:
� User navigates to Settings Organization Users
� User clicks "Invite User" button
� Form displays with fields:

- Email (required)
- First name (required)
- Last name (required)
- Role (orgadmin or orguser)
  � User fills form and clicks "Send Invite"
  � System calls POST /admin/users with `sendInvite: true`
  � System creates user with status 'invited'
  � System generates secure activation token (64 chars, 24-hour expiry)
  � System sends email to user with activation link
  � Email includes: "John invited you to Acme Corp on iCaptur.AI. Click to activate: [link]"
  � New user appears in Users table with status "Invited"
  � Success message: "Invitation sent to [email]"

Technical Notes:

� POST /admin/users endpoint (org_admin can only invite to their tenant)
� Activation token stored in `user_account.activation_token`
� Email sent via email service (SendGrid, SES, etc.)
� Activation link: `https://app.icaptur.ai/activate?token=abc123`

Story 3.2: Activate Account
As an invited user
I want to activate my account and set my password
So that I can log in and use iCaptur products
Acceptance Criteria:
� User receives invitation email
� User clicks activation link
� Link opens `https://app.icaptur.ai/activate?token=abc123`
� System validates token:

- Token exists in database
- Token not expired (< 24 hours)
- Token not already used
  � If valid, form displays with fields:

- Email (pre-filled, disabled)
- First name (pre-filled, editable)
- Last name (pre-filled, editable)
- Password (required, min 12 chars, complexity rules)
- Confirm password
  � User sets password and clicks "Activate Account"
  � System validates password complexity
  � System updates user:

- Sets password_hash
- Sets status to 'active'
- Clears activation_token
  � User redirects to login page with success message
  � User can now log in with email and password

Errors:
� Expired token: "This invitation link expired. Contact your admin for a new one."
� Invalid token: "This invitation link is invalid."
� Already used: "This account is already activated. Please log in."

Technical Notes:
� POST /auth/activate endpoint
� Password hashed with bcrypt (dev) or stored in Cognito (prod)
� Audit event logged for account activation

Story 3.3: Manage Users (org_admin)
As an org_admin
I want to view, edit, and deactivate users in my organization
So that I can manage access control
Acceptance Criteria:
� User navigates to Settings Organization Users
� Table displays all users in tenant with columns:

- Name
- Email
- Role
- Status (Invited, Active, Inactive)
- Last login

- Actions (Edit, Deactivate)
  � User clicks "Edit" on a user
  � Modal displays with editable fields: First name, Last name, Role
  � User updates role from org_user to org_admin
  � User clicks "Save"
  � System calls PATCH /admin/users/{userId}
  � Success message: "User updated"
  � Table reflects changes
  � User clicks "Deactivate" on another user
  � Confirmation modal: "Deactivate [user]? They will lose access immediately."
  � User confirms
  � System calls DELETE /admin/users/{userId} (soft delete status='inactive')
  � User appears as "Inactive" in table
  � Deactivated user cannot log in (401 error)

Technical Notes:

� org_admin can only manage users in their own tenant
� PATCH /admin/users/{userId} endpoint
� DELETE /admin/users/{userId} sets status to 'inactive' (soft delete)
� Audit events logged for all changes

Story 3.4: iTech Admin - Manage All Tenants
As an iTech super_admin

I want to view and manage all customer tenants

So that I can provide support and resolve issues

Acceptance Criteria:
� iTech admin logs in with `icaptur_super_admin` role
� Admin dashboard displays "Tenants" section
� Tenants page shows table with columns:

- Org name

- Country

- Status

- Subscriptions (count)

- Created date
- Actions (View, Edit)
  � Search bar filters tenants by name or email
  � Pagination (50 per page)
  � Admin clicks "View" on a tenant
  � Tenant detail page shows:

- Organization info
- Primary contact
- Subscriptions (product, status, billing status)
- Users (list with roles)
- Billing summary
  � Admin can impersonate tenant (View as Tenant)
  � Impersonation shows banner: "Viewing as [Tenant Name] - [Exit]"
  � All actions audited with admin user ID

Technical Notes:
� GET /admin/tenants endpoint (iTech admins only)
� Role check: token.role in ['icaptur_support_admin', 'icaptur_finance_admin',

'icaptur_super_admin']
� Impersonation generates temporary token with tenant_id (1-hour expiry)
� All impersonation actions logged in audit_event table

## 11.4 Epic 4: Multi-Product Permissions

Epic Goal: Users have correct access to features based on their subscriptions.

Story 4.1: Permissions Check
As a Customer Portal user
I want the portal to check my permissions dynamically
So that I only see features I'm subscribed to
Acceptance Criteria:
� User logs in to Customer Portal
� Customer Portal validates SSO token (checks signature, expiry, audience)
� Customer Portal calls GET /permissions/me (with token)
� SSO returns permissions: `["cad_table", "invoices"]`
� Customer Portal caches permissions for 15 minutes
� UI hides navigation items for `cad_checklist` and `eob` (not in permissions)
� If user tries to access `/cad-checklist` directly, API returns 403 Forbidden
� Frontend shows: "You don't have access to this feature. Upgrade your plan."

Technical Notes:

� GET /permissions/me reads `aud` from token (e.g., "customer_portal")
� SSO queries `product_entitlements` for tenant's subscription to that product
� Frontend caches permissions until `cacheUntil` timestamp
� Backend validates permissions on every API request

Story 4.2: Entitlement Limits Enforcement
As a Customer Portal user
I want the system to enforce my plan's limits
So that I can't exceed my allowed usage
Acceptance Criteria:
� Tenant subscribed to "Starter Plan" with `config: { "max_mb": 50, "max_concurrent_jobs":

3 }`
� User uploads 60 MB file
� Customer Portal checks entitlement config (fetched from SSO or cached)
� API returns 403 Forbidden: "File size exceeds your plan limit (50 MB). Upgrade to upload

larger files."
� User starts 3 jobs
� User tries to start 4th job
� API returns 429 Too Many Requests: "You have reached the maximum concurrent jobs

(3). Wait for a job to complete or upgrade your plan."
� Error messages include link to billing page

Technical Notes:

� Entitlement config stored in `product_entitlements.config` (JSONB)
� Customer Portal fetches config via GET /entitlements/me (future endpoint)
� Backend validates limits before processing requests

## 11.5 Epic 5: Experience Platform (Structure Only)

Epic Goal: Prepare infrastructure for Experience Platform (detailed features TBD).
Story 5.1: Experience Platform Landing Page
As a prospective customer
I want to explore iCaptur.AI APIs
So that I can try them before subscribing
Acceptance Criteria:
� User navigates to `https://app.icaptur.ai` (without logging in)
� Landing page displays:

- "Try iCaptur.AI APIs"
- Brief description
- "Sign In" button (existing users)
- "Start Free Trial" button (new users)
  � Page is public (no authentication required)
  � UI uses shared components from `packages/ui`
  � Clicking "Start Free Trial" opens sign-up flow

Technical Notes:
� Implemented in `apps/experience-web` (React + Vite)
� Static page for Phase 1
� No API integration yet (placeholder for future features)

# 12. IMPLEMENTATION PLAN (DETAILED)

## 12.1 Overview

Total Duration: 20 weeks (5 phases)
Team Structure:
� 2 Backend Developers (SSO Service, Billing BFF)
� 2 Frontend Developers (Account Center, Customer Portal integration)
� 1 DevOps Engineer (Infrastructure, CI/CD, monitoring)
� 1 QA Engineer (Testing strategy, E2E tests)
� 1 Product Owner / Project Manager

Deployment Strategy:
� Incremental rollout
� Feature flags for progressive enablement
� Dual-mode operation during migration (SSO + local auth in parallel)
� Zero downtime for existing customers

## 12.2 Phase 1: SSO Foundation (Weeks 1-6)

Goal: Build and deploy core SSO service with authentication, user/tenant management, and
permissions API.

Week 1-2: Infrastructure & Setup
Backend:

� [ ] Create `icaptur-sso` repository
� [ ] Set up NestJS 10 + Fastify project structure
� [ ] Configure Drizzle ORM with PostgreSQL
� [ ] Create database schema (9 tables):

- tenant (enhanced)
- user_account (enhanced)
- products
- tenant_product_subscriptions
- product_entitlements
- user_product_permissions
- zoho_billing_config
- audit_event
- password_reset_token

� [ ] Write and test database migrations
� [ ] Set up environment configuration (dev, staging, prod)
� [ ] Configure logging (nestjs-pino with PII redaction)

DevOps:

� [ ] Provision AWS RDS PostgreSQL instance (dev, staging, prod)
� [ ] Set up AWS Secrets Manager for credentials
� [ ] Create Docker containers for SSO service
� [ ] Set up CI/CD pipeline (GitHub Actions)
� [ ] Configure Kubernetes manifests

Deliverables:

� SSO service skeleton running locally
� Database schema deployed to dev environment
� CI/CD pipeline (build, test, lint)
Week 3-4: Authentication Module
Backend:
� [ ] Implement POST /auth/login (email/password)

- Dual mode: JWT (dev) + Cognito (prod - stub for now)
- Password validation (bcrypt for JWT mode)
- Account lockout after 5 failed attempts
- Audit event logging
  � [ ] Implement JWT token generation

- Access token (1-hour expiry)
- Refresh token (7-day expiry in dev)
- Token payload: sub, email, tenant_id, role, aud, iss
  � [ ] Implement POST /auth/refresh

- Validate refresh token
- Rotate refresh token (invalidate old)
- Issue new access token with specified aud
  � [ ] Implement POST /auth/logout

- Invalidate refresh token
  � [ ] Implement JWKS endpoint (/.well-known/jwks.json)

- Public keys for token validation
  � [ ] Write unit tests for auth module (>80% coverage)

Security:
� [ ] Implement rate limiting (10 login attempts per minute per IP)
� [ ] CORS configuration (explicit origin allowlist)
� [ ] Security headers (HSTS, CSP, X-Frame-Options)

Testing:
� [ ] Integration tests for auth flows
� [ ] Test account lockout logic
� [ ] Test token expiry and refresh

Deliverables:
� Working authentication endpoints
� JWT tokens issued with correct claims
� Passing unit and integration tests

Week 5-6: User & Tenant Management + Permissions API
Backend:
� [ ] Implement POST /admin/users (create user, send activation email)
� [ ] Implement PATCH /admin/users/{userId} (update name, role, status)
� [ ] Implement DELETE /admin/users/{userId} (soft delete)
� [ ] Implement GET /admin/tenants (list all, with pagination, search)
� [ ] Implement GET /admin/tenants/{tenantId} (tenant details + subscriptions)
� [ ] Implement GET /permissions/me

- Read aud from token
- Query tenant's subscription for that product
- Return permissions array
  � [ ] Implement authorization guards:

- @Roles('org_admin') decorator
- @Roles('icaptur_super_admin') decorator
- Tenant isolation (org_admin can only manage their tenant)
  � [ ] Write unit tests for all endpoints

Email Service:
� [ ] Integrate email service (SendGrid, AWS SES, or similar)
� [ ] Create email template for user invitation
� [ ] Implement activation token generation (64 chars, 24-hour expiry)
� [ ] Implement POST /auth/activate (validate token, set password)

Database:
� [ ] Seed initial data:

- 4 products (customer_portal, invox, irepo, docfennec)
- 1 test tenant with 2 users (orgadmin, orguser)
- 1 subscription (customer_portal - all features)
- iTech admin users (1 superadmin, 1 supportadmin, 1 finance_admin)
  Testing:
  � [ ] E2E tests for user invitation flow
  � [ ] E2E tests for permissions API (different products, different roles)
  Deliverables:
  � User/tenant management APIs functional
  � Permissions API returns correct permissions
  � Email invitations working
  � Seeded test data for local development

## 12.3 Phase 2: Billing BFF (Weeks 7-10)

Goal: Build Billing BFF service, integrate with Zoho Billing, implement Hosted Pages and
webhooks.

Week 7-8: Billing BFF Setup & Zoho Integration
Backend:
� [ ] Create `services/billing-bff` in `icaptur-accounts` monorepo
� [ ] Set up NestJS + Fastify project structure
� [ ] Configure Zoho OAuth 2.0 integration (2 accounts)

- India account (billing.zoho.in)
- International account (billing.zoho.com)
  � [ ] Implement Zoho token refresh service

- Store refresh tokens in zoho_billing_config table
- Auto-refresh access tokens (cache in memory/Redis)
  � [ ] Implement multi-region routing logic

- Determine Zoho account based on tenant.country
  � [ ] Implement SSO token validation guard

- Validate signature via JWKS
- Check audience, issuer, expiry
- Extract tenant_id from token
  � [ ] Write unit tests for Zoho client and routing

Database:
� [ ] Seed `zoho_billing_config` table with 2 accounts
� [ ] Update test tenants with `zoho_customer_id` and `zoho_account_region`

DevOps:
� [ ] Provision RDS instance for Billing BFF (if needed - may share SSO DB)
� [ ] Store Zoho credentials in AWS Secrets Manager
� [ ] Create Docker container for Billing BFF
� [ ] Add Billing BFF to CI/CD pipeline
Deliverables:
� Billing BFF service running locally
� Zoho API integration working (token refresh, API calls)
� Multi-region routing functional

Week 8-9: Billing APIs (Read-Only)
Backend:
� [ ] Implement GET /billing/me/summary

- Fetch subscriptions from Zoho
- Fetch payment method from Zoho
- Transform to UI-friendly DTO
- Cache for 5 minutes (Redis or in-memory)
  � [ ] Implement GET /billing/me/invoices
- Fetch invoices from Zoho
- Pagination (20 per page)
- Cache for 15 minutes
  � [ ] Implement GET /billing/invoices/{invoiceId}/download

- Proxy PDF from Zoho or redirect to Zoho URL
  � [ ] Implement error handling and retry logic

- Exponential backoff for transient errors
- User-friendly error messages
  � [ ] Write OpenAPI specification for Billing BFF
  � [ ] Generate TypeScript SDK (`packages/sdk-billing-bff`)

Testing:
� [ ] Integration tests with Zoho sandbox (if available)
� [ ] Mock Zoho responses for unit tests
� [ ] Test multi-region routing (India vs International)
Deliverables:
� Read-only billing endpoints functional
� OpenAPI docs published
� Generated SDK for frontend

Week 9-10: Hosted Pages & Webhooks
Backend:
� [ ] Implement POST /billing/checkout

- Create Zoho Hosted Page for new subscription
- Return hostedPageUrl and expiresAt
  � [ ] Implement POST /billing/payment-method/update
- Create Zoho Hosted Page for card update
  � [ ] Implement POST /billing/cancel
- Cancel subscription (immediate or at period end)
  � [ ] Implement POST /billing/resume
- Reactivate canceled subscription
  � [ ] Implement POST /\_hooks/zoho (webhook handler)
- HMAC signature verification
- IP allowlist check
- Idempotency check (webhook_events table)
- Parse event type
- Update tenant_product_subscriptions table
- Call SSO PUT /admin/tenants/{id}/entitlements (service-to-service auth)
- Dead Letter Queue for failed webhooks
  � [ ] Implement service-to-service authentication (Billing BFF SSO)
- JWT with special aud=sso_admin or mTLS
  Database:
  � [ ] Create `webhook_events` table (idempotency)
  � [ ] Create `webhook_dlq` table (failed webhooks)
  Security:
  � [ ] Store Zoho webhook secrets in Secrets Manager
  � [ ] Implement HMAC verification function
  � [ ] Configure IP allowlist (Zoho webhook IPs)

Testing:
� [ ] Test webhook signature verification (valid + invalid signatures)
� [ ] Test idempotency (duplicate webhooks)
� [ ] Test DLQ flow (simulate SSO unreachable)
� [ ] E2E test: Checkout flow (mock Zoho Hosted Page response)

Deliverables:
� Hosted Pages integration complete
� Webhook handler functional
� Service-to-service auth between BFF and SSO
� All billing APIs operational

## 12.4 Phase 3: Account Center UI (Weeks 11-14)

Goal: Build Account Center web application with billing, profile, security, and organization
management.

Week 11-12: UI Setup & Authentication
Frontend:
� [ ] Create `apps/accounts-web` in `icaptur-accounts` monorepo
� [ ] Set up React 18 + Vite + TypeScript
� [ ] Install dependencies:

- Fluent UI v9
- MobX 6 + mobx-react-lite
- React Query
- React Router v6
- Zod + React Hook Form
- Generated SDK (@icaptur/sdk-billing-bff)
  � [ ] Set up folder structure:

- /pages (Dashboard, Settings, Billing, Profile, Security, Organization)
- /stores (MobX stores: AuthStore, BillingStore, UserStore)
- /components (reusable UI components)
- /api (API client wrappers)
- /styles (Fluent UI theme customization)
  � [ ] Implement AuthStore (MobX)

- Login, logout, token refresh
- Store access token, refresh token
- Auto-refresh on 401 errors
  � [ ] Implement login page

- Email/password form
- "Remember me" checkbox
- "Forgot password" link
- Error messages
  � [ ] Implement MFA verification page (if MFA enabled)
  � [ ] Implement authentication guard (PrivateRoute)

- Redirect to login if not authenticated
  DevOps:
  � [ ] Set up Vite dev server
  � [ ] Configure build pipeline (CI/CD)
  � [ ] Create Docker container for static files (nginx)

Testing:
� [ ] Unit tests for AuthStore
� [ ] E2E tests for login flow (Playwright)

Deliverables:
� Account Center skeleton running locally
� Login flow functional
� Token refresh working

Week 12-13: Billing UI
Frontend:
� [ ] Implement Billing Summary page (Settings Billing)

- Fetch data from GET /billing/me/summary
- Display "Current Plan" card (plan name, status, billing date, amount)
- Display "Payment Method" card (card type, last 4 digits, expiry)
- Display "Upcoming Invoice" section
- "Upgrade Plan" button
- "Update Card" button
- "Cancel Subscription" button
- Loading skeleton
- Error state (user-friendly message)
  � [ ] Implement Invoices tab

- Fetch data from GET /billing/me/invoices
- Table with columns: Invoice #, Date, Amount, Status, Download
- Pagination controls
- Filter by status dropdown
  � [ ] Implement Upgrade Plan flow

- Modal/page showing available plans
- Seat selection
- Price calculation
- "Proceed to Payment" button
- Call POST /billing/checkout
- Redirect to hostedPageUrl (Zoho)
- Handle return from Zoho (query param ?status=success)
- Show success message
- Refresh billing summary
  � [ ] Implement Update Payment Method flow

- Call POST /billing/payment-method/update
- Redirect to Zoho Hosted Page
- Handle return
  � [ ] Implement Cancel Subscription flow

- Modal with options (cancel at end / cancel immediately)
- Confirmation dialog
- Call POST /billing/cancel
- Show success message
  � [ ] Implement Resume Subscription button (if canceled at period end)
- Call POST /billing/resume
  State Management:
  � [ ] BillingStore (MobX)

- Fetch billing summary
- Fetch invoices
- Trigger checkout/cancel/resume actions
- Cache data (React Query)
  Testing:
  � [ ] Unit tests for BillingStore
  � [ ] E2E tests for billing flows (Playwright)
- View summary
- View invoices
- Upgrade plan (mock Hosted Page)
- Cancel subscription
  Deliverables:
  � Complete billing UI functional
  � All user stories for billing management satisfied

Week 13-14: Profile, Security, Organization Pages
Frontend:
� [ ] Implement Profile page (Settings Profile)

- Display user info (name, email, phone, profile picture)
- Edit form
- Call PATCH /admin/users/{userId}
- Profile picture upload (S3 upload, update profile_picture_key)
  � [ ] Implement Security page (Settings Security)
- Change password form
- Enable/Disable MFA section
- MFA setup flow (QR code, backup codes)
- Active sessions list (future - out of Phase 1 scope)
  � [ ] Implement Organization page (Settings Organization)
- "Users" tab
- Table: Name, Email, Role, Status, Actions
- "Invite User" button Form (email, name, role)
- "Edit User" Modal (update name, role)
- "Deactivate User" Confirmation + API call

- "Settings" tab (tenant info)
- Display tenant name, country, contact info
- Edit form (org_admin only)

State Management:
� [ ] UserStore (MobX) - user profile data
� [ ] OrganizationStore (MobX) - tenant data, user list

Testing:
� [ ] E2E tests for profile management
� [ ] E2E tests for user invitation flow
Deliverables:
� All settings pages functional
� Account Center feature-complete for Phase 1

## 12.5 Phase 4: Customer Portal Integration (Weeks 15-18)

Goal: Migrate Customer Portal to use SSO authentication and permissions.

Week 15-16: SSO Integration in Customer Portal
Backend (Customer Portal):
� [ ] Add SSO token validation middleware

- Validate JWT signature via SSO JWKS endpoint
- Check audience (aud=customer_portal)
- Extract userid, tenantid from token
- Replace existing JWT validation with SSO validation
  � [ ] Add dual-mode authentication (feature flag)
- If ENABLE_SSO=true, use SSO tokens
- If ENABLE_SSO=false, use local JWT (fallback)
  � [ ] Update authentication guards to check SSO tokens
  � [ ] Implement permissions check
- Call GET /permissions/me on login
- Cache permissions for 15 minutes
- Check permissions before allowing feature access

� [ ] Update authorization guards to use SSO permissions

- Replace user_screen_grant checks with permissions array

Frontend (Customer Portal):
� [ ] Update login flow to redirect to SSO (`app.icaptur.ai/login`)

- Pass returnUrl query param
- SSO redirects back after login with token
  � [ ] Update token storage and refresh logic
- Use SSO refresh endpoint
  � [ ] Update navigation to hide/show features based on permissions
  Testing:
  � [ ] Integration tests with SSO (both modes)
  � [ ] E2E tests for login redirect flow
  Deliverables:
  � Customer Portal supports SSO authentication (behind feature flag)
  � Permissions checked dynamically
  � Dual-mode functional (SSO + local auth)

Week 16-17: Data Migration
Migration Scripts:
� [ ] Export tenants from Customer Portal database
� [ ] Import tenants to SSO database

- Map tenant table fields
- Generate zoho_customer_id if not exists
- Set zoho_account_region based on country
  � [ ] Export users from Customer Portal database
  � [ ] Import users to SSO database
- Map user_account table fields
- Keep cognito_sub for Cognito users
- Generate secure password hash for local dev users
  � [ ] Create `tenant_product_subscriptions` for each tenant

- Product: Customer Portal
- Status: 'active' (if tenant has active subscription)
- Map zoho_subscription_id from existing billing records
  � [ ] Migrate permissions from `user_screen_grant` to `product_entitlements`

- Tenant-level: Map tenant.perm\* fields to entitlements
- User-level: Map user_screen_grant records to user_product_permissions
  � [ ] Dry-run migration (dev environment)
  � [ ] Validate migrated data (automated checks)

Rollback Plan:
� [ ] Keep original Customer Portal tables intact
� [ ] Document rollback procedure (switch feature flag, revert DNS)

Testing:
� [ ] Test migration script on staging environment
� [ ] Verify user login works after migration
� [ ] Verify permissions match pre-migration

Deliverables:
� Migration scripts tested and validated
� Data successfully migrated to SSO database
� Rollback plan documented

Week 17-18: Gradual Rollout & Monitoring
Rollout Strategy:
Week 17:
� [ ] Enable SSO for internal iTech admin users (dogfooding)
� [ ] Monitor logs for errors, token validation issues
� [ ] Test all Customer Portal features with SSO auth
� [ ] Fix any issues discovered

Week 18:
� [ ] Enable SSO for 10% of customers (feature flag + tenant whitelist)
� [ ] Send email notification 48 hours in advance
� [ ] Monitor:

- Login success rate
- Token refresh rate
- Permissions API latency
- Support tickets
  � [ ] Increase to 50% if no issues
  � [ ] Enable for 100% of customers by end of week

Communication:
� [ ] Email customers about SSO transition
� [ ] In-app banner: "We've upgraded to Single Sign-On. Your login remains the same."
� [ ] FAQ page for common questions
� [ ] Support team briefing

Monitoring:
� [ ] Set up alerts for:

- SSO service errors (>5% error rate)
- Token validation failures
- Permission API slow response (>500ms)
- Webhook processing failures
  � [ ] Dashboard for real-time metrics (Grafana/DataDog)

Deliverables:
� SSO enabled for all Customer Portal users
� Zero critical issues
� Customer communication complete
� Monitoring and alerts in place

## 12.6 Phase 5: Multi-Product Preparation (Weeks 19-20)

Goal: Finalize multi-product patterns, create integration docs, and set up Experience Platform
structure.

Week 19: Documentation & SDKs
Documentation:
� [ ] Write SSO integration guide for new products

- How to validate SSO tokens
- How to call Permissions API
- How to enforce entitlements
- Example code (NestJS, Express, Python Flask)
  � [ ] Write Billing integration guide

- How subscriptions work
- How to check subscription status
- Entitlement config structure
  � [ ] Create API reference (OpenAPI static docs)
  � [ ] Create sequence diagrams for common flows

- User login product access
- Subscription upgrade entitlement sync
- Webhook processing
  SDKs & Libraries:
  � [ ] Create `@icaptur/sso-client` package (TypeScript)

- Token validation helper
- Permissions check helper
- Example middleware for Express/Fastify
  � [ ] Create `@icaptur/sso-client-python` package (optional)
  � [ ] Publish packages to internal npm registry

Deliverables:
� Comprehensive integration documentation
� Reusable SDK for products to integrate SSO
� Example code for common scenarios

Week 20: Experience Platform Structure & Final Testing
Experience Platform:
� [ ] Create `apps/experience-web` folder structure
� [ ] Implement basic landing page (public, no auth)

- "Try iCaptur.AI APIs" heading
- Brief description
- "Sign In" and "Start Free Trial" buttons
  � [ ] Create placeholder routes (`/experience/*`)
  � [ ] No API playground features yet (deferred to future phase)

Final Testing:
� [ ] Full regression testing (E2E suite)

- SSO login, MFA, token refresh, logout
- Account Center (billing, profile, security, organization)
- Customer Portal (all features with SSO auth)
- Permissions enforcement
  � [ ] Performance testing

- SSO API load test (1000 req/sec)
- Billing BFF load test (500 req/sec)
- Token validation latency (target <50ms)
  � [ ] Security testing

- Token tampering attempts
- CSRF attacks
- SQL injection attempts
- Rate limit bypass attempts
  � [ ] Penetration testing (external security audit - optional)

Final Preparation:
� [ ] Production infrastructure readiness check

- Kubernetes cluster scaled appropriately
- RDS performance tuning
- Redis cache configured
- CDN configured for static assets
  � [ ] Production secrets configured (Secrets Manager)
  � [ ] Backup and disaster recovery plan documented
  � [ ] Incident response playbook created

Go-Live:
� [ ] Final stakeholder demo
� [ ] Product Owner sign-off
� [ ] Deploy to production (SSO, Billing BFF, Account Center)
� [ ] Update DNS (if needed)
� [ ] Monitor for 24 hours
� [ ] Celebrate!

Deliverables:
� Experience Platform structure in place
� All systems fully tested and production-ready
� Project marked as COMPLETE

## 12.7 Post-Launch Activities (Ongoing)

Week 21+:
� [ ] Monitor production metrics daily (first 2 weeks)
� [ ] Address any bugs or customer feedback
� [ ] Optimize performance based on real-world usage
� [ ] Plan Phase 6: Experience Platform features (API playground, sandbox)
� [ ] Plan future products integration (InvoX, iRepo, DocFennec)
� [ ] Implement AWS Cognito in production (if JWT used in MVP)
� [ ] Enhance iTech admin portal (analytics, reporting, impersonation UI)

# 13. SECURITY & COMPLIANCE (COMPREHENSIVE)

## 13.1 Authentication Security

Password Policy:
� **Minimum length:** 12 characters
� **Complexity requirements:**

- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&\*()\_+-=[]{}|;:,.<>?)
  � **Prohibited:**

- Common passwords (check against top 10,000 common passwords list)
- User's email or name
- Sequential characters (e.g., "123456", "abcdef")
  � **Password expiry:** None (NIST recommends no forced expiry unless breach detected)
  � **Password history:** Prevent reuse of last 5 passwords

Account Lockout:

� **Threshold:** 5 failed login attempts within 15 minutes
� **Lockout duration:** 30 minutes
� **Notification:** Email sent to user: "Your account was temporarily locked due to multiple

failed login attempts."
� **Unlock:** Automatic after 30 minutes, or manual via admin/support
� **Audit:** All failed attempts logged with IP, user-agent, timestamp

Password Reset:

� **Token generation:** Secure random token (64 characters, cryptographically secure)
� **Token expiry:** 24 hours
� **Single-use:** Token invalidated after first use
� **Storage:** Token hash stored (SHA-256), not plaintext
� **Email:** Sent to user's registered email with reset link
� **Link format:** `https://app.icaptur.ai/reset-password?token=abc123...`
� **Security:** Token tied to user ID, email, and timestamp (prevents token reuse if email

changes)

Multi-Factor Authentication (MFA):

� **Type:** TOTP (Time-based One-Time Password)
� **Apps supported:** Google Authenticator, Authy, Microsoft Authenticator, 1Password
� **Setup:**

- Generate TOTP secret (32-character base32 string)
- Display QR code to user
- User scans and enters 6-digit code to verify
- Store encrypted secret in user_account.mfa_secret_encrypted

� **Backup codes:**

- Generate 10 single-use backup codes
- Each code: 12 characters (alphanumeric)
- Display once, user must save
- Store encrypted hashes in user_account.mfa_backup_codes_encrypted

� **MFA enforcement:**

- Optional for regular users
- Required for iTech admin users (future enhancement)
  � **Recovery:** Use backup codes if authenticator unavailable; support can disable MFA for
  account recovery

## 13.2 Token Security

Access Token:
� **Type:** JWT (JSON Web Token)
� **Algorithm:** RS256 (RSA signature with SHA-256)
� **Lifetime:** 1 hour (3600 seconds)
� **Payload claims:**

- sub (subject): User ID (UUID)
- email: User email
- tenant_id: Tenant ID (UUID) or null for iTech admins
- role: User role (orgadmin, orguser, icaptur\*admin)
- aud (audience): Product code (customer_portal, accounts, invox, etc.)
- iss (issuer): SSO service URL (https://sso.icaptur.ai)
- exp (expiry): Unix timestamp
- iat (issued at): Unix timestamp
- jti (JWT ID): Unique token ID (for revocation tracking)
  � **Signature:** RSA private key (stored securely in AWS Secrets Manager)
  � **Validation:** Products validate signature using public key from JWKS endpoint

Refresh Token:
� **Type:** Opaque token (random string, not JWT)
� **Generation:** Cryptographically secure random (64 characters)
� **Lifetime:**

- Development: 7 days
- Production: 30 days (TBD based on security policy)
  � **Storage:**

- Backend: Hash stored in database (not plaintext)
- Frontend: Secure httpOnly cookie (SameSite=Strict) OR localStorage (if cookie not feasible)
  � **Rotation:** New refresh token issued on every use; old token invalidated immediately
  � **Revocation:** Refresh token invalidated on logout, password change, or security event

Token Rotation:
� Every time a refresh token is used, a new one is issued
� Old refresh token is immediately invalidated
� Prevents token replay attacks
� If an old refresh token is used, all tokens for that user are invalidated (breach detection)

Token Revocation:
� **Immediate revocation:** On logout, password change, MFA disable, account deactivation
� **Revocation list:** Store revoked token IDs (`jti`) in Redis with TTL (until expiry)
� **Validation check:** Backends check revocation list before accepting token

JWKS (JSON Web Key Set):
� **Endpoint:** `https://sso.icaptur.ai/.well-known/jwks.json`
� **Public keys:** RSA public keys for token validation
� **Key rotation:** Keys rotated every 90 days; old key remains valid for 7 days during

transition
� **Caching:** Products cache JWKS for 1 hour; force refresh on validation failure

## 13.3 API Security

TLS / HTTPS:
� **Requirement:** All APIs must use TLS 1.2 or higher
� **Certificate:** Valid SSL certificate (Let's Encrypt or AWS Certificate Manager)
� **HSTS:** Strict-Transport-Security header enabled (max-age=31536000;

includeSubDomains; preload)
� **Redirect:** All HTTP requests automatically redirected to HTTPS

CORS (Cross-Origin Resource Sharing):
� **Allowed Origins:** Explicit allowlist

- https://app.icaptur.ai
- https://portal.icaptur.ai
- https://invox.icaptur.ai
- https://irepo.icaptur.ai
- https://docfennec.icaptur.ai
- http://localhost:3000 (dev only)
  � **Credentials:** `Access-Control-Allow-Credentials: true` (for cookies)
  � **Methods:** GET, POST, PATCH, DELETE, OPTIONS
  � **Headers:** Authorization, Content-Type, X-Correlation-ID

Rate Limiting:
� **Per-User Limits:**

- Authentication endpoints: 10 requests per minute per IP
- Permissions API: 100 requests per minute per user
- Billing APIs: 20 requests per minute per user
  � **Per-IP Limits:**

- Global: 1000 requests per minute per IP
  � **Implementation:** Redis-backed rate limiter (sliding window)
  � **Response:** 429 Too Many Requests with `Retry-After` header

Request Timeouts:
� **Default:** 30 seconds
� **Long-running operations:** 60 seconds (e.g., Hosted Page creation)
� **Streaming endpoints:** No timeout (e.g., file downloads)

CSRF Protection:
� **State-changing endpoints:** Require CSRF token or SameSite cookies
� **Implementation:**

- For session-based auth: CSRF token in form/header
- For JWT auth: Not applicable (stateless, no cookies for auth)
  � **SameSite cookies:** `SameSite=Strict` or `SameSite=Lax` for session cookies

Content Security Policy (CSP):
� **Header:** `Content-Security-Policy`
� **Directives:**

- default-src 'self'
- script-src 'self' 'unsafe-inline' (for Vite dev)
- style-src 'self' 'unsafe-inline'
- img-src 'self' data: https:
- connect-src 'self' https://sso.icaptur.ai https://api.icaptur.ai
- frame-ancestors 'none' (prevent clickjacking)
  Other Security Headers:
  � `X-Content-Type-Options: nosniff`
  � `X-Frame-Options: DENY`
  � `X-XSS-Protection: 1; mode=block` (legacy browsers)
  � `Referrer-Policy: strict-origin-when-cross-origin`

## 13.4 Data Security

Encryption at Rest:
� **Database:** AWS RDS encryption enabled (AES-256)
� **S3 Buckets:** Server-side encryption (SSE-S3 or SSE-KMS)
� **Secrets:** AWS Secrets Manager with encryption (KMS)
� **Sensitive fields:** Application-level encryption for:

- zoho_billing_config.client_secret_encrypted
- zoho_billing_config.refresh_token_encrypted
- zoho_billing_config.webhook_secret_encrypted
- user_account.mfa_secret_encrypted
- user_account.mfa_backup_codes_encrypted
  Encryption in Transit:
  � **All traffic:** TLS 1.2+ (HTTPS)
  � **Database connections:** SSL/TLS enabled for RDS
  � **Internal services:** mTLS (mutual TLS) for service-to-service communication (optional for

Phase 1, recommended for production)

Secrets Management:
� **Development:**

- .env.sample file with placeholders (committed)
- .env file with actual secrets (git-ignored)
- Secrets stored in local secure storage (1Password, etc.)
  � **Production:**

- AWS Secrets Manager for all secrets
- IAM roles for access control (least privilege)
- Secrets rotated every 90 days (automated for Zoho refresh tokens)
- No secrets in environment variables (fetched at runtime)
  PII (Personally Identifiable Information):
  � **Fields considered PII:**

- user_account.email
- user_account.first_name, last_name
- user_account.phone
- tenant.email, tenant.phone
- tenant.primary_contact_email, primary_contact_phone
- audit_event.ip (partial)
  � **Logging:** PII redacted or masked in logs

- Email: john\*\*\*\*@example.com
- IP: 192.168.1.\*\*\*
- Phone: +91-\***\*7890
  � **Access control:\*\* PII accessible only to authorized roles (org_admin for their tenant, iTech

admins for all tenants)
� **Data export:** Users can request data export (GDPR-style)
� **Data deletion:** Users can request account deletion (soft delete with 90-day retention)

Card Data (PCI DSS):
� **Scope:** Minimized - no card data stored in our systems
� **Hosted Pages:** All card entry happens on Zoho's PCI-compliant pages
� **Payment methods:** Only last 4 digits and expiry stored (non-sensitive data, fetched from

Zoho)
� **Compliance:** Zoho is PCI DSS Level 1 certified; we rely on their compliance

## 13.5 Audit & Monitoring

Audit Events:
All security-relevant actions logged in audit_event table:
� **User actions:**

- Login (success/failure)
- Logout
- Password change
- MFA enable/disable
- Account activation
  � **Admin actions:**

- User created/updated/deactivated
- Tenant created/updated
- Subscription changed
- Entitlements updated
- Impersonation (iTech admin viewing as tenant)

� **Billing events:**

- Subscription created/upgraded/canceled
- Payment succeeded/failed
- Invoice created/paid

� **Webhook events:**

- Webhook received/processed/failed
  Audit Record Structure:

CREATE TABLE audit_event (
id UUID PRIMARY KEY,
tenant_id UUID, -- null for iTech admin actions
actor_user_id UUID, -- who performed the action
event_type TEXT NOT NULL, -- 'user.login', 'subscription.created', etc.
event_payload JSONB, -- details (non-sensitive)
ip TEXT, -- actor's IP (masked in logs)
user_agent TEXT, -- actor's browser
created_at TIMESTAMPTZ DEFAULT NOW()

);

Structured Logging:

� **Format:** JSON (structured logs)
� **Library:** nestjs-pino (NestJS), pino (Node.js)
� **Log levels:** error, warn, info, debug
� **PII redaction:** Automated (regex-based or custom filter)
� **Fields:**

- timestamp (ISO 8601)

- level (error, warn, info, debug)
- message (human-readable)

- context (module name, e.g., "AuthService")
- correlationId (request ID for tracing)
- userId (if authenticated)

- tenantId (if applicable)
- ip (masked)

- error (stack trace for errors, never shown to users)
  Correlation IDs:
  � Every request assigned a unique `correlationId` (UUID)
  � Passed in `X-Correlation-ID` header (or generated if missing)
  � Included in all logs and error responses
  � Enables end-to-end request tracing across services

Log Storage:
� **Development:** Console output + local files
� **Production:** AWS CloudWatch Logs (or similar log aggregation service)
� **Retention:** 90 days (configurable per compliance requirements)
� **Search:** CloudWatch Insights or ELK stack (Elasticsearch, Logstash, Kibana)

Monitoring & Alerts:
� **Tools:** Prometheus + Grafana (or AWS CloudWatch, DataDog)
� **Metrics:**

- Request rate (per endpoint, per service)
- Error rate (per endpoint, per service)
- Latency (P50, P95, P99)
- Active users (gauge)
- Token issuance rate
- Webhook processing latency
- Database connection pool usage
  � **Alerts:**

- Error rate > 5% for 5 minutes
- P95 latency > 1000ms for 5 minutes
- Database connection pool > 80% for 5 minutes
- Webhook processing failures > 10 in 5 minutes
- SSO service downtime (health check fails 3 times)
  Tracing:
  � **Tool:** OpenTelemetry (or AWS X-Ray)
  � **Spans:** Trace requests across services (SSO Product Zoho)
  � **Visualization:** Jaeger or similar distributed tracing UI
  � **Use case:** Debug slow requests, identify bottlenecks

## 13.6 Compliance Considerations

PCI DSS (Payment Card Industry Data Security Standard):
� **Scope:** Minimized by using Zoho Hosted Pages
� **Our responsibility:** Ensure secure transmission of Hosted Page URLs (HTTPS)
� **Zoho's responsibility:** PCI compliance for card handling, storage, processing
� **Validation:** Annual PCI compliance audit (Zoho's responsibility)

GDPR (General Data Protection Regulation) - Preparation:
Note: Full GDPR compliance assessment required if serving EU customers. Below are
preparatory measures:
� **Data minimization:** Only collect necessary PII
� **Consent:** User consent for data processing (terms of service, privacy policy)
� **Right to access:** Users can view their data (profile page, export functionality)
� **Right to erasure:** Users can request account deletion

- Soft delete with 90-day retention (for rollback/audit)
- Hard delete after 90 days (or immediately if user insists)
- Anonymize data in audit logs (replace user_id with "deleted-user")
  � **Data portability:** Users can export their data (JSON format)
  � **Breach notification:** If breach detected, notify affected users within 72 hours
  � **Data protection officer (DPO):** Designate DPO if processing large volumes of EU data

SOC 2 (Service Organization Control) - Future:
� If pursuing SOC 2 certification:

- Document security controls (this section)
- Implement access controls (IAM policies, least privilege)
- Regular security audits (quarterly)
- Penetration testing (annual)
- Employee security training
  Data Residency:
  � **India customers:** Data stored in AWS ap-south-1 (Mumbai) region
  � **International customers:** Data stored in AWS us-east-1 (Virginia) or eu-west-1 (Ireland) -

TBD based on customer distribution
� **Zoho Billing data:** Stored in Zoho's infrastructure (India account in India, International

account in US/Europe)

## 13.7 Incident Response Plan

Severity Levels:
� **P0 (Critical):** Total outage, security breach, data loss
� **P1 (High):** Major feature broken, performance degradation
� **P2 (Medium):** Minor feature broken, workaround available
� **P3 (Low):** Cosmetic issue, no user impact

Incident Response Workflow: 181. **Detection:** Alert triggered or user report 182. **Assessment:** Determine severity (P0-P3) 183. **Response:**

- P0/P1: Immediate response (< 15 min), on-call engineer paged
- P2: Response within 4 hours
- P3: Response within 24 hours

184. **Communication:**

- P0/P1: Status page updated, customers notified
- P2/P3: Internal tracking only

185. **Resolution:** Fix deployed, verified
186. **Post-mortem:** Document root cause, action items (for P0/P1)

Security Breach Protocol: 187. **Containment:** Isolate affected systems, revoke compromised credentials 188. **Assessment:** Determine scope (data accessed, users affected) 189. **Notification:** Notify affected users, regulatory bodies (if required by law) 190. **Remediation:** Patch vulnerability, rotate secrets, force password resets 191. **Review:** Post-incident security review, implement additional controls

On-Call Rotation:

� DevOps engineer on-call 24/7 (rotating weekly)
� Backend engineer on-call for P0 incidents
� Escalation path: On-call Team Lead CTO

# 14. NON-FUNCTIONAL REQUIREMENTS

## 14.1 Performance

API Latency Targets:

Endpoint P50 P95 P99
POST /auth/login < 200ms < 500ms < 1000ms
POST /auth/refresh < 50ms < 100ms < 200ms
GET /permissions/me < 50ms < 100ms < 150ms
GET < 200ms < 300ms < 500ms
/billing/me/summary < 200ms < 300ms < 500ms
GET < 300ms < 500ms < 1000ms
/billing/me/invoices < 200ms < 400ms < 600ms
POST
/billing/checkout
POST /\_hooks/zoho

Excluding external dependencies:

� Latencies above exclude external API calls (e.g., Zoho API latency)
� Zoho API calls may add 200-500ms

UI Performance: Target

Metric < 1.5s
First Contentful Paint (FCP) < 2.5s
Largest Contentful Paint (LCP) < 3.5s
Time to Interactive (TTI) < 100ms
First Input Delay (FID) < 0.1
Cumulative Layout Shift (CLS)

Measured via:

� Lighthouse (CI/CD pipeline)
� Real User Monitoring (RUM) in production

Token Validation:

� JWT validation (signature check): < 50ms
� JWKS cache hit: < 5ms
� JWKS cache miss (fetch from SSO): < 100ms

## 14.2 Scalability

User Load:
� **Phase 1 (MVP):** 1,000 tenants, 10,000 users
� **Year 1:** 5,000 tenants, 50,000 users
� **Year 2:** 20,000 tenants, 200,000 users

Request Volume:
� **SSO Service:**

- Token validation: 1,000 req/sec (peak)
- Login: 50 req/sec (peak)
- Permissions API: 500 req/sec (peak)

� **Billing BFF:**

- Read APIs: 200 req/sec (peak)
- Hosted Pages: 20 req/sec (peak)
- Webhooks: 50 req/sec (peak)
  Horizontal Scaling:
  � **SSO Service:** Stateless, can scale to N instances
  � **Billing BFF:** Stateless, can scale to N instances
  � **Database:** Vertical scaling (larger RDS instance), read replicas for read-heavy workloads
  � **Redis:** Cluster mode for distributed caching

Auto-Scaling:
� Kubernetes Horizontal Pod Autoscaler (HPA)
� Scale based on CPU (>70%) or request rate (>80% capacity)
� Min replicas: 2 (high availability)
� Max replicas: 10 (or higher based on load testing)

## 14.3 Availability & Reliability

Uptime Targets:

Service Target Uptime Downtime/Year
SSO Service < 8.76 hours
Billing BFF 99.9% < 8.76 hours
Account Center UI 99.9% < 43.8 hours
99.5%

High Availability:
� **Multi-AZ Deployment:** Services deployed across 2+ availability zones (AWS)
� **Load Balancing:** Application Load Balancer (ALB) distributes traffic
� **Database:** RDS Multi-AZ with automatic failover
� **Redis:** ElastiCache with replication (master-replica)

Disaster Recovery:
� **Database Backups:**

- Automated daily backups (retained for 30 days)
- Point-in-time recovery (PITR) enabled
- Manual backups before major deployments
  � **RTO (Recovery Time Objective):** < 1 hour
  � **RPO (Recovery Point Objective):** < 15 minutes (database replication lag)

Health Checks:
� **Kubernetes Liveness Probe:** `/health` (checks if process is alive)
� **Kubernetes Readiness Probe:** `/health/ready` (checks if service can accept traffic -

includes DB connectivity)
� **Load Balancer Health Check:** `/health` every 30 seconds

## 14.4 Maintainability

Code Quality:
� **Linting:** ESLint (TypeScript), Prettier (formatting)
� **Type Safety:** TypeScript strict mode enabled
� **Code Reviews:** All PRs require 1+ approval
� **Test Coverage:** Minimum 80% (unit + integration tests)

Documentation:
� **Code Comments:** For complex logic, algorithms
� **API Docs:** OpenAPI 3.0 specifications (auto-generated from code)
� **Architecture Docs:** Updated with every major change (ADRs)
� **Runbooks:** Operational guides for common tasks (deployment, rollback, incident

response)

Dependency Management:
� **Security:** Automated dependency vulnerability scans (Dependabot, Snyk)
� **Updates:** Regular updates (monthly for minor versions, quarterly for major versions)
� **License Compliance:** SBOM (Software Bill of Materials) generated in CI/CD

Observability:
� Metrics exported (Prometheus format)
� Logs structured (JSON)
� Traces instrumented (OpenTelemetry)
� Dashboards created (Grafana)

## 14.5 Usability

Accessibility (WCAG 2.1 AA):
� **Keyboard Navigation:** All features accessible via keyboard
� **Screen Reader Support:** Semantic HTML, ARIA labels
� **Color Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text
� **Focus Indicators:** Visible focus outlines
� **Testing:** Automated (Lighthouse, axe-core) + manual

Internationalization (i18n) - Future:

� Text strings externalized (i18n framework)
� Support for RTL (right-to-left) languages
� Date/time formatting per locale
� Currency formatting per region

Browser Support:

� **Desktop:** Last 2 versions of Chrome, Firefox, Safari, Edge
� **Mobile:** Last 2 versions of iOS Safari, Chrome (Android)
� **No support:** Internet Explorer

Responsive Design:

� Mobile-first approach
� Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)
� All features functional on mobile (touch-optimized)

# 15. TESTING STRATEGY

## 15.1 Testing Pyramid

/\

/ \ E2E (10%)

/\_\_\_\_\

/ \ Integration (30%)

/**\_\_\_\_**\

/ \ Unit (60%)

/****\_\_\_\_****\

Unit Tests (60%):

� Test individual functions, classes, components
� Fast (< 5ms per test)
� Isolated (no external dependencies)
� Mocked dependencies

Integration Tests (30%):

� Test interaction between modules
� Database integration (test DB)
� API endpoint tests (without mocking)
� Moderate speed (< 500ms per test)
End-to-End Tests (10%):
� Test complete user flows
� Browser automation (Playwright)
� Slower (5-30s per test)
� Run against staging environment

## 15.2 Unit Testing

Backend (NestJS):
� **Framework:** Jest
� **Coverage Target:** 80%
� **Scope:**

- Service layer (business logic)
- Utility functions
- Validation logic
- Error handling
  Example: AuthService Unit Tests

describe('AuthService', () => {
it('should generate JWT token with correct claims', () => {
// Test token generation
});

it('should throw UnauthorizedException for invalid credentials', () => {
// Test error handling

});

it('should lock account after 5 failed attempts', () => {
// Test account lockout logic

});
});

Frontend (React):
� **Framework:** Vitest (Vite-native) or Jest
� **Coverage Target:** 70% (UI tests focus more on E2E)
� **Scope:**

- MobX stores (state management logic)
- Utility functions
- Form validation
- Component logic (not UI rendering)
  Example: BillingStore Unit Tests
  describe('BillingStore', () => {
  it('should fetch billing summary and update state', async () => {
  // Test async data fetching
  });

it('should handle API error gracefully', async () => {
// Test error state

});
});

## 15.3 Integration Testing

Backend Integration Tests:

� **Scope:**

- API endpoints (full request/response cycle)

- Database operations (CRUD)

- External API integration (Zoho - mocked or sandbox)

- Webhook processing

Setup:

� Test database (PostgreSQL in Docker)
� Migrations run before tests
� Database reset between tests

Example: Billing API Integration Tests

describe('GET /billing/me/summary', () => {
it('should return billing summary for org_admin', async () => {
// Authenticate as org_admin
// Call endpoint
// Assert response structure and data
});

it('should return 403 for org_user', async () => {
// Authenticate as org_user
// Call endpoint
// Assert 403 Forbidden

});
});

Contract Testing (API Compatibility):

� **Tool:** Pact or OpenAPI validation
� **Scope:** Ensure API contract (OpenAPI spec) matches implementation
� **CI/CD:** Auto-generate SDK from OpenAPI; build breaks if schema changed without

version bump

## 15.4 End-to-End (E2E) Testing

Tool: Playwright (cross-browser testing)
Scope:
� Critical user flows
� Cross-service interactions (SSO Product)
� Full integration (UI Backend Database External APIs)

Test Scenarios: 192. **User Login Flow**

- Navigate to app.icaptur.ai
- Enter credentials
- Assert redirect to dashboard
- Assert user name displayed

193. **Billing Upgrade Flow**

- Login as org_admin
- Navigate to Settings Billing
- Click "Upgrade Plan"
- Select Pro Plan, 5 seats
- Click "Proceed to Payment"
- Assert redirect to Zoho Hosted Page (mock in test)
- Simulate return from Zoho (?status=success)
- Assert success message
- Assert billing summary updated

194. **User Invitation Flow**

- Login as org_admin
- Navigate to Settings Organization Users
- Click "Invite User"
- Fill form (email, name, role)
- Submit
- Assert user appears in table with status "Invited"
- Check email inbox (test email service)
- Click activation link
- Set password
- Assert redirect to login
- Login with new credentials
- Assert successful login

195. **SSO Cross-Product Flow**

- Login at app.icaptur.ai
- Navigate to portal.icaptur.ai
- Assert no re-authentication required
- Assert Customer Portal loads with user data
  CI/CD Integration:
  � E2E tests run on staging environment
  � Nightly regression suite (all E2E tests)
  � PR pipeline (smoke tests only - 5 critical flows)

## 15.5 Performance Testing

Tool: k6 (load testing), Artillery (alternative)
Test Scenarios: 196. **Login Load Test**

- 1000 concurrent users login over 1 minute
- Measure P95 latency, error rate
- Target: P95 < 500ms, error rate < 1%

197. **Token Validation Load Test**

- 10,000 requests/sec to protected endpoint (triggers token validation)
- Measure P95 latency
- Target: P95 < 100ms

198. **Permissions API Load Test**

- 500 requests/sec to GET /permissions/me
- Measure P95 latency, cache hit rate
- Target: P95 < 100ms, cache hit rate > 90%

199. **Webhook Load Test**

- 100 webhooks/sec to POST /\_hooks/zoho
- Measure processing latency, DLQ rate
- Target: P95 < 400ms, DLQ rate < 1%
  Baseline Metrics:
  � Run performance tests before major releases
  � Compare against baseline (detect regressions)
  � Set alerts if latency increases > 20%

## 15.6 Security Testing

Automated Security Scans:
� **SAST (Static Application Security Testing):**

- Tool: SonarQube, Snyk Code
- Scan code for vulnerabilities (SQL injection, XSS, etc.)
- CI/CD gate: Block merge if critical vulnerabilities found
  � **Dependency Scanning:**
- Tool: Dependabot, Snyk, npm audit
- Check for known vulnerabilities in dependencies
- Automated PRs for security updates
  � **Container Scanning:**
- Tool: Trivy, Snyk Container
- Scan Docker images for vulnerabilities
- CI/CD gate: Block deployment if critical CVEs found
  Manual Security Testing:
  � **Penetration Testing:**
- External security firm (annual)
- Scope: SSO, Billing BFF, Account Center
- Focus: Authentication, authorization, data leakage
  � **Security Scenarios to Test:**
- Token tampering (modify JWT claims)
- Token replay attacks
- CSRF attacks (state-changing endpoints)
- SQL injection attempts
- XSS attempts (script injection in forms)
- Rate limit bypass
- Privilege escalation (orguser tries to access orgadmin endpoints)
- Webhook signature forgery

## 15.7 Regression Testing

Automated Regression Suite:
� All unit, integration, E2E tests
� Run on every PR (smoke tests) and nightly (full suite)
� Coverage: All critical features, all API endpoints

Manual Regression Testing (Optional):
� Before major releases
� Exploratory testing by QA team
� Focus on edge cases, UI/UX

## 15.8 Test Data Management

Test Tenants:
� Seed database with test tenants:

- test-tenant-india (country: IN, Zoho India)
- test-tenant-us (country: US, Zoho International)
  � Each tenant has:

- 1 org_admin user
- 2 org_user users
- 1 active subscription (Customer Portal)
  Test Users:

-- Test users
INSERT INTO user_account (email, password_hash, first_name, last_name, role,
tenant_id) VALUES

('admin@test.com', '{bcrypt_hash}', 'Test', 'Admin', 'org_admin', '{test-tenant-
uuid}'),

('user@test.com', '{bcrypt_hash}', 'Test', 'User', 'org_user', '{test-tenant-
uuid}'),
('support@icaptur.ai', '{bcrypt_hash}', 'Support', 'Admin',
'icaptur_support_admin', NULL);

Test Zoho Accounts:

� Use Zoho sandbox accounts (if available)
� OR mock Zoho API responses in integration tests

## 15.9 CI/CD Testing Gates

Pull Request Pipeline:

stages:

- lint
- typecheck
- unit-test (parallel)
- integration-test (parallel)
- e2e-smoke-test (5 critical flows)
- security-scan
- build

gates:

- All stages must pass
- Code coverage > 80%
- No critical security vulnerabilities

Deploy to Staging:

stages:

- deploy-to-staging
- e2e-full-suite
- performance-test

gates:

- All E2E tests pass
- Performance within SLA (P95 latency)

Deploy to Production:

stages:

- manual-approval
- deploy-to-production
- smoke-test (production)
- monitor (1 hour)

gates:

- Product Owner approval
- Smoke tests pass
- No critical errors in 1-hour monitoring window

End of Part 2
Next Steps

Part 3 (Sections 16-18) will cover:
� Section 16: Risk Management
� Section 17: Open Questions & Decisions
� Section 18: Appendices (Glossary, References, Diagrams)
Document Status: Part 2 Complete - Ready for Review

Document Version: 1.0 (Part 2 of 3)
Last Updated: November 10, 2025
Next Deliverable: Part 3 (Sections 16-18)
Business Requirements Document (BRD)

iCaptur.AI - Multi-Product SSO & Centralized Billing Platform

Document Version: 1.0 (Part 3 of 3 - FINAL)
Date: November 10, 2025
Status: Draft - For Review
Owner: iTech India Private Limited
Project Code: ICAP-SSO-BILL-2025

Table of Contents (Part 3)

200. [Risk Management](#16-risk-management)
201. [Open Questions & Decisions](#17-open-questions--decisions)
202. [Appendices](#18-appendices)

PART 3: RISK, DECISIONS & REFERENCE

# 16. RISK MANAGEMENT

## 16.1 Risk Overview

This section identifies potential risks that could impact the successful delivery and operation of
the SSO and Billing platform. Each risk is assessed for likelihood and impact, and mitigation
strategies are provided.
Risk Scoring:
� **Likelihood:** Low (1), Medium (2), High (3)
� **Impact:** Low (1), Medium (2), High (3)
� **Risk Score:** Likelihood � Impact (1-9)
� **Priority:** Low (1-2), Medium (3-4), High (6-9)

## 16.2 Technical Risks

Risk 1: Zoho API Rate Limits
Description: Zoho enforces rate limits (100 requests/minute per organization). During high
traffic, we may exceed limits and receive 429 errors, causing billing operations to fail.

Attribute Value

Likelihood Medium (2)
Impact High (3)
Risk Score 6 (High Priority)

Mitigation Strategies: 203. **Caching:** Implement aggressive caching for read operations

- Billing summary: Cache 5 minutes
- Invoice list: Cache 15 minutes
- Customer details: Cache 10 minutes

204. **Retry with Backoff:** Implement exponential backoff for 429 errors (wait 1s, 2s, 4s)
205. **Batch Operations:** Combine multiple API calls where possible (e.g., fetch multiple

invoices in one request) 206. **Rate Limiter:** Track API usage internally; queue requests if approaching limit 207. **Monitoring:** Alert DevOps if rate limit errors exceed 5% of requests

Contingency Plan:

� If rate limits become a blocker, contact Zoho to negotiate higher limits (enterprise plan)
� Implement request queue with prioritization (critical operations first)

Risk 2: Zoho Service Downtime
Description: Zoho Billing service experiences outage or degraded performance, preventing
users from viewing billing information or completing checkout.

Attribute Value

Likelihood Low (1)
Impact High (3)
Risk Score 3 (Medium Priority)

Mitigation Strategies:

208. **Graceful Degradation:** Display cached billing data with banner: "Billing information
     may be outdated. Try again shortly."

209. **Retry Logic:** Automatically retry failed Zoho API calls (up to 3 attempts with backoff)
210. **User Communication:** Clear error messages: "Billing service is temporarily
     unavailable. Try again in a few minutes."

211. **Monitoring:** Monitor Zoho API health; alert DevOps if error rate > 10%
212. **Status Page:** Subscribe to Zoho's status page for proactive notifications

Contingency Plan:

� If Zoho downtime persists > 2 hours, notify customers via email
� Provide alternative: "Contact support for billing assistance"

Risk 3: Token Expiry / Refresh Failures
Description: Access tokens expire while users are actively working, causing API calls to fail.
Refresh token rotation may fail due to network issues or SSO downtime, forcing users to re-
login.

Attribute Value

Likelihood Medium (2)
Impact Medium (2)
Risk Score 4 (Medium Priority)

Mitigation Strategies:

213. **Proactive Refresh:** Frontend refreshes tokens 5 minutes before expiry (not on 401)
214. **Auto-Retry:** On 401 error, frontend automatically refreshes token and retries request

(transparent to user) 215. **Fallback:** If refresh fails twice, clear session and redirect to login with message: "Your

session expired. Please log in again." 216. **Longer Refresh Token TTL:** Use 30-day refresh tokens in production (vs 7 days in

dev) 217. **Monitoring:** Track token refresh success rate; alert if < 95%

Contingency Plan:

� If mass refresh failures occur (SSO outage), show banner: "We're experiencing issues. Your
session may expire. We're working on it."

Risk 4: Database Performance Degradation
Description: As user base grows, database queries slow down, causing API latency to
increase beyond acceptable thresholds (P95 > 500ms).

Attribute Value

Likelihood Medium (2)
Impact Medium (2)
Risk Score 4 (Medium Priority)
Mitigation Strategies:

218. **Indexing:** All foreign keys and frequently queried fields have indexes
219. **Query Optimization:** Use Drizzle ORM efficiently; avoid N+1 queries
220. **Read Replicas:** Add RDS read replicas for read-heavy queries (permissions API,

billing summary) 221. **Caching:** Use Redis for frequently accessed data (permissions, entitlements) 222. **Connection Pooling:** Optimize connection pool size (Drizzle + pgBouncer) 223. **Monitoring:** Track slow queries (>500ms); optimize or add indexes

Contingency Plan:

� Vertical scaling: Upgrade RDS instance class (e.g., db.t3.medium db.r5.large)
� Horizontal scaling: Partition data by tenant (if tenant count > 50,000)

Risk 5: Webhook Processing Failures
Description: Zoho sends webhooks but our handler fails to process them due to bugs, SSO
service downtime, or database issues. This causes entitlements to be out of sync with Zoho
subscriptions.

Attribute Value

Likelihood Medium (2)
Impact High (3)
Risk Score 6 (High Priority)

Mitigation Strategies:

224. **Idempotency:** Store every webhook in `webhook_events` table with unique
     `event_id`; prevent duplicate processing

225. **Dead Letter Queue (DLQ):** Failed webhooks go to DLQ for manual replay
226. **Retry with Backoff:** If processing fails, return 500 to Zoho (triggers retry on their side)
227. **Monitoring:** Alert DevOps if > 5 webhooks in DLQ or > 10% failure rate
228. **Replay Tool:** Build admin UI to manually replay failed webhooks after fixing issue
229. **Validation:** Comprehensive input validation; reject malformed webhooks early

Contingency Plan:

� If mass webhook failures occur (e.g., SSO unreachable), pause webhook processing (return 503) until SSO recovers

� After recovery, replay webhooks from DLQ in chronological order
Risk 6: Security Breach (Token Theft / Credential Leak)
Description: Attacker steals user tokens or gains access to database, potentially accessing
sensitive data or impersonating users.

Attribute Value

Likelihood Low (1)
Impact High (3)
Risk Score 3 (Medium Priority)

Mitigation Strategies:

230. **Token Security:**

- Short-lived access tokens (1 hour)

- Refresh token rotation (invalidate old token on every use)

- httpOnly cookies for refresh tokens (prevents XSS theft)

231. **Secret Management:** All secrets in AWS Secrets Manager (not environment
     variables)

232. **Encryption:** Database encryption at rest, TLS for all traffic
233. **Intrusion Detection:** Monitor for suspicious activity (e.g., token used from multiple

IPs) 234. **Audit Logging:** All authentication events logged 235. **MFA:** Encourage (or require) MFA for sensitive accounts

Incident Response:

236. **Detection:** Alert triggered (e.g., tokens used from unusual locations)
237. **Containment:** Revoke all tokens for affected users, force password reset
238. **Notification:** Email affected users: "We detected suspicious activity. Please reset your

password." 239. **Investigation:** Review audit logs, identify breach vector 240. **Remediation:** Patch vulnerability, rotate all secrets 241. **Communication:** If data breach confirmed, notify users and regulatory bodies (if

required)

Risk 7: Hosted Page Expiry (Poor UX)
Description: User initiates checkout but doesn't complete it within 15 minutes. Hosted Page link
expires. User clicks expired link and sees Zoho error page, causing confusion and support
tickets.

Attribute Value

Likelihood Medium (2)
Impact Low (1)
Risk Score 2 (Low Priority)
Mitigation Strategies:

242. **Expiry Warning:** Show countdown timer in UI: "Complete checkout within 14:32"
243. **Graceful Handling:** If user returns after expiry, detect Zoho error and show: "This

payment link expired. Click **Try Again** to get a new one." 244. **One-Click Retry:** "Try Again" button calls `/billing/checkout` again (generates new

Hosted Page) 245. **Session Extension (Optional):** Allow user to request new link before expiry (e.g.,

"Need more time? Click here")

User Experience:

� Most users complete checkout within 5 minutes (industry average)
� 15-minute expiry is sufficient for 95% of users
� Clear messaging reduces support tickets

## 16.3 Business Risks

Risk 8: Customer Migration Resistance
Description: Existing Customer Portal users resist migrating to SSO, fearing disruption or
complexity. Low adoption rates delay project benefits.

Attribute Value

Likelihood Low (1)
Impact Medium (2)
Risk Score 2 (Low Priority)

Mitigation Strategies: 246. **Transparent Communication:**

- Email customers 2 weeks before migration
- Explain benefits: "One login for all iCaptur products"

- Address concerns: "Your login credentials remain the same"

247. **Dual-Mode Operation:** Run SSO in parallel with local auth; gradual migration over 2-

4 weeks 248. **No Forced Downtime:** Migrate users in batches; each user experiences zero

downtime 249. **Support Readiness:** Train support team; create FAQ; offer migration assistance 250. **Incentive (Optional):** Offer 1 month free for early adopters (first 100 tenants)

Success Metrics:
� > 90% of users migrated within 4 weeks
� < 5% support tickets related to SSO migration
� Customer satisfaction score (CSAT) > 4/5

Risk 9: Delayed Zoho Billing Setup (Already Mitigated)
Description: Zoho Billing accounts not configured in time, blocking Phase 2 development.

Attribute Value
Low (1) - MITIGATED
Likelihood High (3)
Impact 3 (Medium Priority)
Risk Score

Status: Already Mitigated

Zoho Billing accounts are already configured and ready (confirmed by Product Owner). Plans,
products, and Razorpay payment gateway are set up in both India and International accounts.

Remaining Actions:

� Obtain API credentials (client_id, client_secret, refresh_token) from Zoho admin
� Store credentials in AWS Secrets Manager (dev, staging, prod)
� Test API connectivity in Phase 2 Week 1

Risk 10: Scope Creep (Feature Requests During Development)
Description: Stakeholders request additional features during development (e.g., "Can we add
invoice approval workflows?"), causing delays and budget overruns.

Attribute Value

Likelihood Medium (2)
Impact Medium (2)
Risk Score 4 (Medium Priority)

Mitigation Strategies:

251. **Clear Scope:** BRD defines MVP scope (Phase 1-5); additional features go to backlog
252. **Change Control:** All feature requests reviewed by Product Owner; prioritized for

future phases 253. **Phase Gates:** Each phase has defined deliverables; no new features added mid-

phase 254. **Communication:** Weekly stakeholder updates; manage expectations on timeline 255. **Backlog Management:** Document requested features for Phase 6+ (post-MVP)

Decision Framework:
For any new feature request, ask:

# 256. Is it critical for MVP? (If no backlog)

# 257. Does it block customer migration? (If no backlog)

# 258. Can it be added in Phase 6? (If yes backlog)

## 16.4 Operational Risks

Risk 11: Insufficient DevOps Resources
Description: Single DevOps engineer becomes a bottleneck for infrastructure provisioning,
CI/CD setup, and incident response.

Attribute Value

Likelihood Medium (2)
Impact Medium (2)
Risk Score 4 (Medium Priority)

Mitigation Strategies:

259. **Knowledge Sharing:** Document all infrastructure setup (Terraform/K8s manifests)
260. **Cross-Training:** Train backend developers on basic DevOps tasks (deploy, rollback)
261. **Automation:** Automate repetitive tasks (CI/CD, database migrations, secret rotation)
262. **On-Call Rotation:** DevOps engineer on-call, but backend engineer as backup
263. **External Support:** Budget for external DevOps consultant if needed (e.g., Phase 1

infra setup)

Contingency Plan:

� If DevOps engineer unavailable, backend lead takes over critical tasks (deploy, incident
response)

� Hire second DevOps engineer if project scales beyond 20 weeks

Risk 12: Live Customer Impact During Migration
Description: Bug in SSO integration causes existing Customer Portal users to lose access or
experience errors, damaging trust and reputation.

Attribute Value

Likelihood Low (1)
Impact High (3)
Risk Score 3 (Medium Priority)

Mitigation Strategies: 264. **Gradual Rollout:** Enable SSO for 10% of customers first; monitor for issues 265. **Feature Flag:** Keep dual-mode auth (SSO + local); instant rollback if issues detected 266. **Canary Deployment:** Deploy to staging, then 10% prod, then 100% (over 2 weeks) 267. **Monitoring:** Real-time alerts for login failures, token validation errors 268. **Rollback Plan:** One-click rollback (flip feature flag, revert DNS) 269. **Support Readiness:** Support team on standby during migration window; rapid

response

Success Criteria:

� Login success rate > 99% during migration
� < 0.5% support tickets during migration
� Zero data loss

Rollback Triggers:

� Login failure rate > 5%
� Token validation error rate > 10%
� > 20 support tickets in 1 hour

## 16.5 Compliance & Legal Risks

Risk 13: Data Privacy Violations (GDPR, Local Regulations)
Description: Improper handling of personal data (PII) leads to regulatory fines or legal action,
especially if serving EU customers.

Attribute Value

Likelihood Low (1)
Impact High (3)
Risk Score 3 (Medium Priority)

Mitigation Strategies:

270. **Data Minimization:** Only collect necessary PII (name, email, phone)
271. **Consent:** Terms of Service and Privacy Policy clearly state data usage
272. **User Rights:** Implement data export and deletion features (Phase 6+)
273. **Encryption:** All PII encrypted at rest and in transit
274. **Access Control:** PII accessible only to authorized users (org_admin for their data,

iTech admins for support) 275. **Audit Logs:** All PII access logged 276. **Legal Review:** Have legal team review privacy policy and terms before launch

Compliance Checklist (If Serving EU Customers):

� [ ] Privacy Policy compliant with GDPR
� [ ] Cookie consent banner (if using tracking cookies)
� [ ] Data Processing Agreement (DPA) with Zoho
� [ ] Right to access (user can download their data)
� [ ] Right to erasure (user can request deletion)
� [ ] Breach notification process (72-hour requirement)

Recommendation:

� Consult with legal counsel if planning to serve EU customers
� Consider appointing Data Protection Officer (DPO) if processing large volumes

Risk 14: PCI DSS Non-Compliance (Card Data Handling)
Description: Accidental storage or logging of card data (PAN, CVV) exposes company to PCI
DSS audit failures and fines.

Attribute Value

Likelihood Low (1)
Impact High (3)
Risk Score 3 (Medium Priority)

Mitigation Strategies:

277. **Zoho Hosted Pages:** All card entry happens on Zoho's PCI-compliant pages (not our
     servers)

278. **No Card Storage:** We never store, log, or transmit full card numbers
279. **Last 4 Digits Only:** Only last 4 digits fetched from Zoho (non-sensitive data)
280. **Log Scrubbing:** Automated log scanning to detect accidental PAN logging (regex:

`\d{13,19}`) 281. **Developer Training:** Educate developers on PCI scope and card data handling

Validation:

� Code review checklist includes: "Does this code handle card data?"
� Security audit includes PCI scope assessment

Status:
Low Risk - Our architecture minimizes PCI scope; Zoho handles all card processing.

## 16.6 Risk Summary & Priority

Risk Likelihood Impact Score Priority Status
Zoho API Rate Medium High 6 High Mitigation
Limits planned
Low High 3 Medium
Zoho Service Monitoring +
Downtime Medium Medium 4 Medium fallback
Token Proactive
Expiry/Refresh refresh
Failures

Database Medium Medium 4 Medium Indexing +
High scaling
Performance DLQ + replay
Medium tool
Webhook Medium High 6 Low
Low Defense in
Processing depth
Medium UX
Failures Medium improvements
Medium Communication
Security Low High 3 plan
Medium
Breach Medium Mitigated
Medium
Hosted Page Medium Low 2 Change control
Cross-training
Expiry
Gradual rollout
Customer Low Medium 2
Legal review
Migration
Minimized
Resistance scope

Zoho Billing Low High 3

Setup Delay

Scope Creep Medium Medium 4

DevOps Medium Medium 4

Resource

Shortage

Live Customer Low High 3

Impact

Data Privacy Low High 3

Violations

PCI DSS Non- Low High 3

Compliance

Top Priority Risks (Score 6):

282. **Zoho API Rate Limits** - Implement caching and retry logic (Phase 2)
283. **Webhook Processing Failures** - Build robust DLQ and replay tool (Phase 2)

# 17. OPEN QUESTIONS & DECISIONS

## 17.1 Overview

This section documents decisions that are still pending or deferred to implementation phases.
Each question includes context, options, recommendation, and timeline for resolution.

## 17.2 Authentication & SSO

Question 1: AWS Cognito Implementation Details
Context:
The BRD specifies dual-mode authentication: JWT (dev) and AWS Cognito (prod). However,
specific Cognito configuration details are TBD.
Pending Decisions: 284. **User Pool Configuration:**

- Single User Pool for all products OR separate pools per product?
- Recommendation: Single pool with custom product_code attribute

285. **Custom Claims:**

- How to add custom claims (tenant_id, role, product_code) to Cognito tokens?
- Options:

- Pre-token generation Lambda trigger (adds claims to JWT)
- Post-authentication Lambda (calls SSO to fetch claims)
- Recommendation: Pre-token generation Lambda (fetches from SSO database)

286. **MFA Policies:**

- Optional MFA (user choice) OR enforced for all users?
- Recommendation: Optional for regular users, required for iTech admins

287. **Password Policies:**

- Use Cognito's built-in policy OR custom validation?
- Recommendation: Cognito built-in (12 chars, complexity requirements)

288. **Session Management:**

- Use Cognito's hosted UI OR custom login page?
- Recommendation: Custom login page (better UX, consistent with design)
  Timeline: Decide in Phase 1, Week 3 (during authentication module implementation)
  Assigned To: Backend Lead + DevOps

Question 2: Token Caching Strategy for Products
Context:

Products (Customer Portal, future products) need to cache user permissions to avoid calling
SSO's Permissions API on every request. Cache duration affects freshness vs performance.

Options:

Option Cache Duration Pros Cons
A 5 minutes Fresh data, quick sync More SSO load (12
calls/hour per user)
B 15 minutes Balanced Moderate staleness (4
calls/hour)
C 60 minutes Minimal SSO load (1 Stale data, slow
call/hour) entitlement sync
Recommendation: Option B (15 minutes) with forced refresh on critical events
Forced Refresh Triggers:
� Subscription upgraded/downgraded (BFF sends webhook to product: "refresh permissions")
� User role changed
� User deactivated

Implementation:
� Products cache permissions in memory (Map<userId, permissions>)
� Cache entry includes `expiresAt` timestamp
� On critical event, product clears cache for affected user(s)

Timeline: Decide in Phase 1, Week 6 (during Permissions API implementation)
Assigned To: Backend Lead

## 17.3 Multi-Product & Entitlements

Question 3: Entitlements API Specification
Context:
The BRD mentions a future /api/v1/entitlements/me endpoint that returns tenant's feature
configuration (maxmb, maxconcurrent_jobs, etc.). This is marked as "Future/Optional" but may
be needed for Phase 4 (Customer Portal integration).
Pending Decisions: 289. **Implement in Phase 1 or defer to Phase 6?**

- Phase 1 Pro: Customer Portal integration (Phase 4) can use it immediately
- Phase 6 Pro: Reduces MVP scope
- Recommendation: Implement in Phase 1 (simple endpoint, high value)

290. **Response Structure:**

```json
{
  "productCode": "customer_portal",
  "entitlements": {
    "cadtable": { "maxmb": 100 },
    "invoices": { "max_mb": 50 },
    "maxconcurrentjobs": 5
  }
}
```

OR flat structure:

```json
{
  "productCode": "customer_portal",
  "cadmaxmb": 100,
  "invoicemaxmb": 50,
  "maxconcurrentjobs": 5
}
```

- Recommendation: Nested structure (more flexible for future feature configs)

291. **Caching:**

- How long should products cache entitlement config?
- Recommendation: 15 minutes (same as permissions cache)
  Timeline: Decide in Phase 1, Week 6 (with Permissions API)
  Assigned To: Backend Lead + Product Owner

Question 4: Multi-Product Subscription UI
Context:
The BRD describes a scenario where a tenant subscribes to multiple products (Customer
Portal, InvoX, iRepo). The billing summary page needs to display all subscriptions.
Pending Decisions: 292. **UI Layout:**

- Option A: Separate card for each product subscription
- Option B: Single table with rows per product
- Option C: Tabs (one per product)
- Recommendation: Option A (cards) - more visual, easier to scan

293. **Plan Management:**

- Can user upgrade/downgrade each product independently?
- OR is there a bundle concept (e.g., "Enterprise Bundle" includes all products)?
- Recommendation: Independent management for Phase 1; bundles in Phase 6+
  Timeline: Decide in Phase 3, Week 12 (during Billing UI implementation)
  Assigned To: Frontend Lead + Product Owner

## 17.4 Admin & Support

Question 5: iTech Admin Impersonation UX
Context:

iTech support admins need to "view as tenant" to help troubleshoot issues. The mechanism for
impersonation is TBD.

Options:

Option Description Pros Cons Requires UI for
A Temporary Token Secure, time- token generation
Support admin clicks limited, fully
B Impersonation "View as Tenant" audited Requires session
Session generates time-limited management
C token (1 hour) with Works with
Direct DB Access tenant_id existing auth flow No user context,
Support admin enters no live testing
tenant ID SSO Simple
creates session with
impersonated_tenant_id
claim
Support admin uses
admin tool to view DB
records

Recommendation: Option A (Temporary Token)
Implementation:

# 294. Admin portal has "View as Tenant" button (tenant search)

# 295. Admin enters reason: "Customer reported billing issue"

# 296. Backend calls `POST /admin/impersonate { tenantId, reason }`

# 297. SSO generates special token:

```json
{
  "sub": "support-admin-uuid",
  "tenant_id": "impersonated-tenant-uuid",
  "role": "org_admin",
  "aud": "accounts",
  "impersonation": true,
  "expires_in": 3600
}
```

# 298. Admin uses token to access Account Center

# 299. UI shows banner: " Viewing as [Tenant Name] - [Exit Impersonation]"

# 300. Audit event logged: `{ event_type: "admin.impersonation", actor: "support-admin",

tenant: "impersonated-tenant", reason: "..." }`

Security:
� Token expires after 1 hour (no refresh)
� Admin cannot access payment methods (view-only for sensitive data)
� All actions audited

Timeline: Decide in Phase 2, Week 9 (after Billing BFF is functional)
Assigned To: Backend Lead + Product Owner

Question 6: iTech Admin Dashboard Features
Context:
The BRD mentions an "Admin Dashboard" for iTech staff but doesn't specify detailed features.
Pending Decisions: 301. **Metrics to Display:**

- Total tenants, active tenants, new signups (last 30 days)
- Total users, active users (logged in last 7 days)
- Subscription status breakdown (active, trial, canceled, past_due)
- Revenue metrics (MRR, ARR) - future
- Support ticket metrics (if integrated)

302. **Admin Actions:**

- View all tenants ( defined in BRD)
- View tenant details ( defined)
- Impersonate tenant (see Question 5)
- Manually adjust subscription (edge cases, e.g., refund)
- View/replay failed webhooks (DLQ management)

303. **Access Control:**

- icaptur_support_admin: Can view tenants, users, subscriptions; can impersonate
- icaptur_finance_admin: Can view financial data (invoices, payments, MRR)
- icaptur_super_admin: All of the above + manual subscription adjustments
  Recommendation:
  � **Phase 1:** Basic tenant list, tenant details, impersonation
  � **Phase 6+:** Metrics dashboard, DLQ management UI, manual adjustments
  Timeline: Finalize dashboard features in Phase 2, Week 10
  Assigned To: Product Owner + Frontend Lead

## 17.5 Experience Platform

Question 7: Experience Platform API Playground Features
Context:
The Experience Platform is included in the monorepo structure but marked as "details TBD."
The BRD includes it for Phase 5 (structure only).
Pending Decisions: 304. **What APIs will users try?**

- Customer Portal APIs (CAD extraction, Invoice extraction, EOB)?
- Subset of APIs (demo/sandbox mode)?
- All iCaptur APIs?
- Recommendation: Start with Customer Portal APIs (most mature)

305. **Authentication for Playground:**

- Use real SSO tokens (requires login)?
- OR issue sandbox API keys (no login required)?
- Recommendation: Sandbox API keys for free trials; SSO tokens for logged-in users

306. **Rate Limiting:**

- Free tier: 10 requests/hour
- Logged-in tier: 100 requests/hour
- Paid tier: Unlimited (part of subscription)

307. **UI Features:**

- Code editor (input JSON)
- Live API response viewer
- Sample requests (pre-filled examples)
- Documentation sidebar
  Timeline: Defer detailed design to Phase 6 (post-MVP)
  Assigned To: Product Owner + UX Designer
  Phase 5 Deliverable:
  � Folder structure (`apps/experience-web`)
  � Landing page with "Try iCaptur.AI" copy
  � Links to documentation
  � No API playground functionality yet

## 17.6 Migration & Rollout

Question 8: Customer Portal Database Migration Timing
Context:
Phase 4 involves migrating Customer Portal user/tenant data to SSO database. The timing and
order of migration steps need clarification.
Pending Decisions: 308. **Migrate All Data Upfront OR Gradual?**

- Option A: Migrate all tenants/users to SSO in Phase 4 Week 1 (before enabling SSO)
- Option B: Migrate tenants as they're enabled for SSO (just-in-time)
- Recommendation: Option A (simpler, less risk of partial state)

309. **Keep Customer Portal Database?**

- Option A: Keep both databases; sync changes bidirectionally during transition
- Option B: Migrate fully to SSO; deprecate Customer Portal tables
- Recommendation: Option B (SSO is source of truth after migration)

310. **Rollback Plan:**

- Keep Customer Portal tables for 90 days after migration (rollback safety)
- If rollback needed, flip feature flag + revert DNS (SSO disabled)
  Timeline: Finalize migration plan in Phase 4, Week 1
  Assigned To: Backend Lead + DevOps

Question 9: Communication Timeline for Customers
Context:
Existing Customer Portal users need to be notified about SSO transition. Communication plan
needs approval.
Proposed Timeline:
� **Week 15 (Phase 4 Start):** Internal announcement (iTech team)
� **Week 16:** Email to beta customers (10% sample) - "We're upgrading to SSO"
� **Week 17:** Enable SSO for beta customers; monitor feedback
� **Week 17 (mid-week):** Email to all customers - "SSO coming next week"
� **Week 18:** Gradual rollout (10% 50% 100%)
� **Week 18 (end):** Follow-up email - "SSO enabled for all users"

Email Template (Draft):

> Subject: Exciting Update: Introducing Single Sign-On for iCaptur.AI
>
> Hi [Customer Name],
>
> We're excited to announce that we're upgrading to Single Sign-On (SSO) for all iCaptur.AI
> products. This means you'll soon enjoy:
>
> - One login for all iCaptur products (Customer Portal, InvoX, and more)
> - Enhanced security with optional Multi-Factor Authentication
> - Faster access to your account
>
> What do you need to do?
>
> Nothing! Your login credentials (email and password) remain the same. The transition will
> happen automatically.
>
> When?
>
> SSO will be enabled for your account on [Date]. You may notice a slightly different login page,
> but everything else stays the same.
>
> If you have any questions, our support team is here to help: support@icaptur.ai
>
> Thank you for being a valued iCaptur.AI customer!
> Pending Approval: Product Owner + Marketing Team
> Timeline: Finalize in Phase 4, Week 2

## 17.7 Technical Decisions

Question 10: Redis Cache Configuration
Context:
The BRD mentions using Redis for caching (permissions, entitlements, Zoho access tokens).
Configuration details are TBD.
Pending Decisions: 311. **Deployment:**

- Managed service: AWS ElastiCache (recommended)
- OR self-hosted: Redis in Kubernetes
- Recommendation: ElastiCache (less operational overhead)

312. **Replication:**

- Single instance (dev)
- Master-replica (prod) for high availability
- Cluster mode (if scaling beyond 100K users)
- Recommendation: Master-replica for prod

313. **Eviction Policy:**

- LRU (Least Recently Used) - recommended
- TTL (Time-To-Live) only
- Recommendation: LRU with explicit TTLs

314. **Cache Keys:**

- Permissions: permissions:{userId}:{productCode} (TTL: 15 min)
- Entitlements: entitlements:{tenantId}:{productCode} (TTL: 15 min)
- Zoho Access Token: zoho:token:{region} (TTL: 55 min, refresh at 50 min)
  Timeline: Finalize in Phase 1, Week 2 (infrastructure setup)
  Assigned To: DevOps + Backend Lead

Question 11: Monitoring & Observability Stack
Context:
The BRD specifies observability requirements (logs, metrics, traces) but doesn't specify tools.
Pending Decisions: 315. **Metrics & Dashboards:**

- Option A: Prometheus + Grafana (open-source, self-hosted)
- Option B: AWS CloudWatch (managed, integrated with AWS)
- Option C: DataDog (SaaS, comprehensive, expensive)
- Recommendation: Option A (Prometheus + Grafana) for MVP; consider DataDog for
  production

316. **Log Aggregation:**

- Option A: AWS CloudWatch Logs (managed)
- Option B: ELK Stack (Elasticsearch, Logstash, Kibana - self-hosted)
- Option C: Splunk, DataDog Logs (SaaS, expensive)
- Recommendation: Option A (CloudWatch) for MVP

317. **Distributed Tracing:**

- Option A: OpenTelemetry Jaeger (open-source)
- Option B: AWS X-Ray (managed)
- Recommendation: Option A (OpenTelemetry + Jaeger) for flexibility
  Timeline: Finalize in Phase 1, Week 2 (infrastructure setup)
  Assigned To: DevOps

## 17.8 Decision Summary

# Question Status Timeline Owner

1 AWS Cognito Pending
configuration Phase 1, Week 3 Backend Lead
2 Token caching Pending Phase 1, Week 6 Backend Lead

strategy

3 Entitlements API Pending Phase 1, Week 6 Backend + PO

specification

4 Multi-product Pending Phase 3, Week 12 Frontend + PO

subscription UI

5 iTech admin Pending Phase 2, Week 9 Backend + PO

impersonation UX

6 iTech admin Pending Phase 2, Week 10 PO + Frontend

dashboard

features

7 Experience Deferred Phase 6 PO + UX

Platform features

8 Migration timing Pending Phase 4, Week 1 Backend +

DevOps

9 Customer Pending Phase 4, Week 2 PO + Marketing

communication

10 Redis Pending Phase 1, Week 2 DevOps +

configuration Backend

11 Observability Pending Phase 1, Week 2 DevOps

stack

# 18. APPENDICES

## 18.1 Glossary

Terms and Acronyms Used Throughout This BRD:

Term Definition
Single Sign-On - Authentication system allowing
SSO one login for multiple products
OIDC OpenID Connect - Authentication protocol built on
OAuth 2.0 OAuth 2.0
JWT Authorization framework for delegated access
BFF JSON Web Token - Compact, URL-safe token
Hosted Page format for claims
Tenant Backend-for-Frontend - API layer tailored to UI
Product needs
Entitlements Secure payment page hosted by Zoho Billing (not
Permissions our servers)
Feature Code Customer organization using iCaptur products
aud (also: "org")
iCaptur software offering (Customer Portal, InvoX,
iRepo, DocFennec)
Features and limits a tenant can use based on
subscription plan
Specific features a user can access within a
product
Identifier for a product feature (e.g., cad_table,
invoices, eob)
JWT Audience claim - identifies which product the
iss token is intended for
sub JWT Issuer claim - identifies who issued the token
exp (SSO service URL)
iat JWT Subject claim - user ID (UUID)
jti JWT Expiry claim - Unix timestamp when token
JWKS expires
MFA JWT Issued At claim - Unix timestamp when token
TOTP was created
Webhook JWT ID claim - unique token identifier (for
Idempotency revocation tracking)
DLQ JSON Web Key Set - Public keys for JWT
HMAC signature validation
PII Multi-Factor Authentication - Second factor
PCI DSS (TOTP) for login security
GDPR Time-Based One-Time Password - 6-digit codes
RTO from authenticator apps
RPO HTTP callback from external service (Zoho) to our
P50, P95, P99 server on events
TLS Ensuring an operation can be retried safely
CORS without duplicates
CSRF Dead Letter Queue - Storage for failed
messages/webhooks for later retry
XSS Hash-Based Message Authentication Code -
SQL Injection Cryptographic signature for webhooks
HSTS Personally Identifiable Information - Data that can
CSP identify an individual (email, name, phone)
SAST Payment Card Industry Data Security Standard -
SBOM Security standards for card data
General Data Protection Regulation - EU data
privacy law
Recovery Time Objective - Maximum acceptable
downtime
Recovery Point Objective - Maximum acceptable
data loss (time)
Percentile metrics (50th, 95th, 99th percentile) for
latency/performance
Transport Layer Security - Encryption protocol for
HTTPS
Cross-Origin Resource Sharing - Browser security
for API access from different domains
Cross-Site Request Forgery - Attack where
unauthorized commands are sent from
authenticated user
Cross-Site Scripting - Attack where malicious
scripts are injected into web pages
Attack where malicious SQL queries are injected
into input fields
HTTP Strict Transport Security - Forces browsers
to use HTTPS
Content Security Policy - Browser security to
prevent XSS attacks
Static Application Security Testing - Analyze code
for vulnerabilities
Software Bill of Materials - List of all software
Drizzle ORM components and dependencies
TypeScript ORM (Object-Relational Mapping)
MobX library for database queries
State management library for React (reactive
Fluent UI programming)
Microsoft's design system and React component
Nx library
pnpm Monorepo build system and tooling
Fast, disk-efficient package manager (alternative
Vite to npm)
Fast build tool for modern web projects (frontend
Fastify bundler)
High-performance Node.js web framework
NestJS (alternative to Express)
Progressive Node.js framework with TypeScript
Zod and modularity
Playwright TypeScript schema validation library
k6 Browser automation framework for E2E testing
Load testing tool for API performance testing

## 18.2 Acronyms Acronym

Full Form
API Application Programming Interface
AWS Amazon Web Services
BFF Backend-for-Frontend
BRD Business Requirements Document
CAD Computer-Aided Design (in context of Customer
Portal CAD extraction feature)
CDN Content Delivery Network
CI/CD Continuous Integration / Continuous Deployment
CRUD Create, Read, Update, Delete
CSV Comma-Separated Values
DB Database
DNS Domain Name System
DTO Data Transfer Object
E2E End-to-End
EOB Explanation of Benefits (healthcare document
type in Customer Portal)
GST Goods and Services Tax (India)
HMAC Hash-Based Message Authentication Code
HTML HyperText Markup Language
HTTP HyperText Transfer Protocol
HTTPS HTTP Secure (TLS-encrypted)
IAM Identity and Access Management
INR Indian Rupee ()
JSON JavaScript Object Notation
JSONB JSON Binary (PostgreSQL data type)
JWT JSON Web Token
KMS Key Management Service (AWS)
MFA Multi-Factor Authentication
MVP Minimum Viable Product
OIDC OpenID Connect
ORM Object-Relational Mapping
PCI DSS Payment Card Industry Data Security Standard
PDF Portable Document Format
PII Personally Identifiable Information
QA Quality Assurance
RDS Relational Database Service (AWS)
REST Representational State Transfer
RPO Recovery Point Objective
RPS Requests Per Second
RTO Recovery Time Objective
S3 Simple Storage Service (AWS)
SDK Software Development Kit
SES Simple Email Service (AWS)
SOC 2 Service Organization Control 2 (audit standard)
SQL Structured Query Language
SSO Single Sign-On
TAD Technical Architecture Document
TLS Transport Layer Security
TOTP Time-Based One-Time Password
TTL Time To Live (cache duration)
UI User Interface
USD United States Dollar ($)
UUID Universally Unique Identifier
UX User Experience
WCAG Web Content Accessibility Guidelines
XSS Cross-Site Scripting

## 18.3 Reference Documents

Internal Documents (iCaptur.AI Project): 318. **Tech Standards v2.1**

- Location: project-docs/03-architecture/tech_standards_v_2_1.md
- Purpose: Technical standards and coding guidelines for all iCaptur projects
- Scope: NestJS + Fastify backend, React + MobX frontend, monorepo structure, security,
  testing

319. **TAD - Accounts & Billing v2.1**

- Location: project-docs/03-
  architecture/01_TAD_iCaptur_Accounts_Billing_v2_1.md

- Purpose: Technical architecture for Account Center + Billing BFF
- Scope: Monorepo structure, API gateway routing, Zoho integration patterns, configuration

320. **Working Notes - SSO & Billing Decisions**

- Location: project-docs/00-context/\_working_notes_sso_billing_decisions.md
- Purpose: Captured all discussions and decisions during BRD planning phase
- Scope: 18 sections covering architecture, roles, database, Zoho integration, implementation

321. **Customer Portal Workspace Context**

- Location: icaptur-api-customer-portal-v1/project-docs/\_workspace_context.md
- Purpose: Current state of Customer Portal project (for migration reference)
- Scope: Sprint progress, database schema, API endpoints, AWS infrastructure

322. **Customer Portal Database Schema**

- Location: icaptur-api-customer-portal-v1/services/api/src/db/schema.ts
- Purpose: Existing database schema for migration analysis
- Scope: tenant, useraccount, userscreengrant, jobhistory, audit_event tables

External References: 323. **OAuth 2.0 Specification (RFC 6749)**

- URL: https://tools.ietf.org/html/rfc6749
- Relevance: Foundation for SSO authorization flows

324. **OpenID Connect Core 1.0**

- URL: https://openid.net/specs/openid-connect-core-1_0.html
- Relevance: OIDC authentication layer used for SSO

325. **JWT (JSON Web Token) Specification (RFC 7519)**

- URL: https://tools.ietf.org/html/rfc7519
- Relevance: Token format for access tokens

326. **PCI DSS v4.0**

- URL: https://www.pcisecuritystandards.org/document_library/
- Relevance: Security standards for payment card data (Zoho's responsibility)

327. **GDPR Official Text**

- URL: https://gdpr.eu/
- Relevance: Data privacy compliance (if serving EU customers)

328. **Zoho Billing API Documentation**

- URL: https://www.zoho.com/billing/api/v1/
- Relevance: API reference for Billing BFF integration

329. **AWS Well-Architected Framework**

- URL: https://aws.amazon.com/architecture/well-architected/
- Relevance: Best practices for cloud architecture (security, reliability, performance)

330. **NestJS Documentation**

- URL: https://docs.nestjs.com/
- Relevance: Backend framework for SSO and Billing BFF

331. **React Documentation**

- URL: https://react.dev/
- Relevance: Frontend framework for Account Center

332. **Drizzle ORM Documentation**

- URL: https://orm.drizzle.team/
- Relevance: Database ORM used in backend services

333. **Fluent UI v9 Documentation**

- URL: https://react.fluentui.dev/
- Relevance: UI component library for Account Center

## 18.4 System Context Diagram

USERS & ACTORS

End User org_admin org_user iTech Admins

(Customer) (Support/Finance)

Account Center (app.icaptur.ai)

- Dashboard

- Settings (Profile, Security, Billing, Org)

- Experience Platform

Billing BFF SSO Service
(NestJS/Fastify) (NestJS/Fastify)

- Zoho Integration - Auth (OIDC/JWT)

- Hosted Pages - Users/Tenants

- Webhooks - Permissions API

- Admin APIs

Zoho Billing PostgreSQL DB

- India (INR) - Users, Tenants

- Intl (USD) - Subscriptions

- Razorpay - Entitlements

- Audit Events

iCaptur Products (use SSO)

- Customer Portal (portal.icaptur.ai)

- InvoX (invox.icaptur.ai) - Future

- iRepo (irepo.icaptur.ai) - Future

- DocFennec (docfennec.icaptur.ai) - Future

## 18.5 Authentication Flow Diagram

User Login Product Access (SSO Flow):

User Account SSO

Customer

Center Service

Portal

# 1. Navigate to

app.icaptur.ai

# 2. Show login form

# 3. Submit email/password

# 4. POST /auth/login

# 5. Validate credentials

(DB check)

# 6. Return tokens

(access, refresh)

# 7. Set session cookie

- store tokens

# 8. Navigate to

portal.icaptur.ai

# 9. Check session

(via cookie/API call)

# 10. Issue token with

aud=customer_portal

# 11. Fetch permissions

GET /permissions/me

# 12. Return permissions

# 13. Show Customer Portal

with user's features

Key Points:

� User logs in once at Account Center (SSO creates session)
� When user navigates to any product, SSO issues product-specific token (different `aud`

claim)
� Product validates token and fetches permissions (cached for 15 minutes)
� No re-authentication required (seamless experience)

## 18.6 Billing Upgrade Flow Diagram

User Upgrades Plan via Zoho Hosted Page:

SSO
User Account Billing Zoho Service

Center BFF Billing

# 1. Click

"Upgrade Plan"

# 2. POST /billing/checkout

{ planId, seats }

# 3. Create

Hosted

Page

# 4. Return URL

# 5. Return

hostedPageUrl

# 6. Redirect

to Zoho

# 7. Show checkout form

# 8. Enter card, complete payment

# 9. Process

payment

# 10. Webhook

subscription_created

# 11. Update

subscription

in DB

# 12. Sync entitlements

PUT /admin/tenants/

{id}/entitlements

# 13. Update

entitlements

in DB

# 14. Redirect back to Account Center

with ?status=success

# 15. Show

success msg

# 16. Refresh billing summary

# 17. GET /billing/me/summary

# 18. Fetch

from Zoho

# 19. Return

# 20. Show updated plan

# 21. Display

new plan

Key Points:

� User never enters card data on our servers (Zoho Hosted Page)
� Webhook ensures entitlements are synced to SSO (eventual consistency)
� User sees updated plan immediately upon return (Zoho redirects back)

## 18.7 Database Entity-Relationship Diagram

Core Tables and Relationships:

products

id (PK)

product_code

product_name

description

is_active

tenant tenant_product_subscriptions

id (PK) id (PK)

org_name tenant_id (FK)

status product_id (FK)

country status

zoho_customer_id billing_status

zoho_account_region zoho_subscription_id

zoho_account_region

subscribed_at

trial_ends_at

next_billing_date

product_entitlements

id (PK)

subscription_id (FK)

feature_code

is_granted

config (JSONB)

user_account

id (PK)

tenant_id (FK)

email

first_name

last_name

role

status

cognito_sub

password_hash

mfa_enabled

mfa_secret_enc

user_product_permissions

id (PK)

user_id (FK)

subscription_id (FK)

feature_code

is_granted

audit_event

id (PK)

tenant_id (FK)

actor_user_id (FK)

event_type

event_payload (JSON)

ip

created_at

zoho_billing_config

id (PK)

region_code (UK)

org_id

client_id

client_secret_enc

refresh_token_enc
webhook_secret_enc

api_base_url

password_reset_token

id (PK)

user_id (FK)

token_hash

expires_at

used_at

Relationships:

� **tenant user_account:** 1:N (one tenant has many users)
� **tenant tenant_product_subscriptions:** 1:N (one tenant has many subscriptions)
� **products tenant_product_subscriptions:** 1:N (one product can be subscribed to by

many tenants)
� **tenant_product_subscriptions product_entitlements:** 1:N (one subscription has many

entitlements)
� **user_account user_product_permissions:** 1:N (one user can have many permission

overrides)
� **tenant_product_subscriptions user_product_permissions:** 1:N (one subscription can

have many user-level overrides)
� **user_account password_reset_token:** 1:N (one user can have multiple reset tokens

over time)

## 18.8 Technology Stack Summary

Frontend:

Category Technology Version
Framework React
Build Tool Vite 18.x
State Management MobX 5.x
Server Cache React Query 6.x
UI Library Fluent UI 5.x
Validation Zod v9
Forms React Hook Form 3.x
Routing React Router 7.x
HTTP Client Axios (or Fetch) 6.x
Language TypeScript Latest
5.x

Backend: Technology Version
Category
Framework NestJS 10.x
HTTP Server Fastify 4.x
ORM Drizzle Latest
Database PostgreSQL 15+
Validation class-validator Latest
Transformation class-transformer Latest
Logging nestjs-pino Latest
API Docs @nestjs/swagger Latest
Language TypeScript 5.x
Runtime Node.js 22.x

Infrastructure: Technology Purpose
Hosting, RDS, S3, Secrets
Category AWS Manager
Cloud Provider Primary data store
AWS RDS (PostgreSQL) Permissions, tokens, session
Database Redis (ElastiCache) cache
Caching Logs, file uploads, backups
AWS S3 Zoho credentials, DB passwords
Object Storage AWS Secrets Manager Application packaging
Secrets Docker Container orchestration
Container Kubernetes Traffic distribution
Orchestration AWS ALB Static asset delivery
Load Balancer CloudFront (optional) Metrics and dashboards
CDN Prometheus + Grafana Log aggregation
Monitoring AWS CloudWatch Distributed tracing
Logging OpenTelemetry + Jaeger
Tracing

Monorepo & Build: Technology Purpose
Nx Workspace management
Category pnpm Fast, disk-efficient
Monorepo Tool GitHub Actions Build, test, deploy pipelines
Package Manager ESLint, Prettier Linting, formatting
CI/CD
Code Quality

External Services: Purpose
Subscription management (INR)
Service Subscription management (USD)
Zoho Billing (India) Payment processing
Zoho Billing (Intl) Production authentication (TBD)
Razorpay (via Zoho) Transactional emails
AWS Cognito
SendGrid / AWS SES

## 18.9 API Endpoint Summary

SSO Service (sso.icaptur.ai):

Method Endpoint Auth Description
POST /auth/login None User login
(email/password)
POST /auth/mfa/verify None MFA code verification
POST /auth/refresh None Refresh access token
POST /auth/logout None Invalidate refresh
token
POST /auth/activate None Activate invited user
account
GET /.well-known/jwks.json None Public keys for JWT
validation
GET /permissions/me Bearer Get user permissions
for product (from token
POST /admin/users Bearer aud)
Create user
PATCH /admin/users/{userId} Bearer (org_admin or iTech
DELETE admin)
GET /admin/users/{userId} Bearer Update user (name,
GET role, status)
PUT /admin/tenants Bearer Deactivate user (soft
delete)
/admin/tenants/{tenantId} Bearer List all tenants (iTech
admins only)
/admin/tenants/{id}/entitlements Service Get tenant details
Update tenant
entitlements (BFF
SSO)

Billing BFF (app.icaptur.ai):

Method Endpoint Auth Description
GET /billing/me/summary Bearer Get billing summary
(org_admin only)
GET /billing/me/invoices Bearer List invoices
(org_admin only)
GET /billing/invoices/{id}/download Bearer Download invoice PDF
POST Create Hosted Page
/billing/checkout Bearer for subscription
Create Hosted Page
POST /billing/payment- Bearer for card update
method/update Cancel subscription
POST /billing/cancel Bearer Resume canceled
POST /billing/resume Bearer subscription
Zoho webhook handler
POST /\_hooks/zoho HMAC (signature verified)

Account Center UI (app.icaptur.ai): Description
Route
/ Landing / Dashboard
/login Login page
/activate Account activation page
/reset-password Password reset page
/settings/profile User profile management
/settings/security Password, MFA settings
/settings/billing Billing summary, invoices, plans
/settings/organization Users, team management

## 18.10 Change Log Date Author Changes

2025-11-05 Planning Team Initial draft BRD (high-
Version level)
0.1 2025-11-10 Development Team Complete BRD (Part 1,
2, 3) - All sections

## 1.0 finalized

Version 1.0 Includes:

� **Part 1 (Sections 1-8):** Executive Summary, Business Context, Current State, Target
Architecture, Actors & Permissions, Product & Subscription Model, Authentication &
Authorization, Database Design

� **Part 2 (Sections 9-15):** Zoho Integration, API Specifications, User Stories,
Implementation Plan, Security & Compliance, NFRs, Testing Strategy

� **Part 3 (Sections 16-18):** Risk Management, Open Questions, Appendices (this
document)

Total Pages: ~150 pages

Total Word Count: ~75,000 words

Status: Draft - For Review & Approval

## 18.11 Approval & Sign-Off

Document Status: Complete - Ready for Stakeholder Review

Required Approvals:

� [ ] **Business Sponsor / CEO:** Final business approval
� [ ] **Product Owner:** Business requirements validated
� [ ] **Technical Lead / Architect:** Technical feasibility confirmed
� [ ] **Development Team Lead:** Implementation plan accepted
� [ ] **DevOps Lead:** Infrastructure plan accepted
� [ ] **Security Team:** Security requirements reviewed
� [ ] **Finance Team:** Billing requirements validated
Approval Form:

I have reviewed the Business Requirements Document for the iCaptur.AI Multi-Product
SSO & Centralized Billing Platform (Version 1.0, Parts 1-3) and approve it for
implementation as described.

Name: ****************\_****************

Role: ****************\_****************

Signature: ************\_\_\_\_************

Date: ****************\_****************

Comments/Conditions (if any):

---

---

## 18.12 Next Steps After BRD Approval

334. **Stakeholder Review Meeting** (Week of 2025-11-11)

- Present BRD to all stakeholders
- Address questions and concerns
- Collect feedback

335. **Revisions (if needed)** (Week of 2025-11-18)

- Incorporate feedback from stakeholders
- Update BRD to version 1.1 (if significant changes)
- Re-submit for approval

336. **Final Approval** (Week of 2025-11-25)

- All stakeholders sign off
- BRD marked as "Approved"
- Project officially greenlighted

337. **Detailed Design Phase** (Week of 2025-12-02)

- Create Architecture Decision Records (ADRs) for open questions
- Finalize database schema (Drizzle migrations)
- Design UI mockups (Figma)
- Write OpenAPI specifications (SSO, Billing BFF)

338. **Infrastructure Provisioning** (Week of 2025-12-09)

- Provision AWS resources (RDS, S3, Secrets Manager, ElastiCache)
- Set up Kubernetes clusters (dev, staging, prod)
- Configure CI/CD pipelines (GitHub Actions)
- Set up monitoring (Prometheus, Grafana, CloudWatch)

339. **Sprint Planning** (Week of 2025-12-16)

- Break down Phase 1 into 2-week sprints
- Create Jira/Linear tickets for all user stories
- Assign tasks to team members
- Set up daily standup schedule

340. **Development Kickoff** (Week of 2026-01-06)

- Phase 1, Week 1: Infrastructure & setup begins
- Official project start date
- Team onboarding and knowledge transfer

341. **Go-Live** (Target: Week of 2026-05-26)

- Phase 5 complete (20 weeks from kickoff)
- MVP deployed to production
- Existing Customer Portal users migrated to SSO
- Project retrospective and celebration

DOCUMENT END

Business Requirements Document
iCaptur.AI - Multi-Product SSO & Centralized Billing Platform
Version: 1.0 (Complete - Parts 1, 2, 3)
Date: November 10, 2025
Status: Draft - For Review & Approval
Owner: iTech India Private Limited
Project Code: ICAP-SSO-BILL-2025
Total Pages: ~150
Total Sections: 18
Total Word Count: ~75,000

Thank you for reading this BRD. We look forward to building this platform and delivering
exceptional value to our customers!

For questions or clarifications, contact:
� **Product Owner:** [Name] - [Email]
� **Technical Lead:** [Name] - [Email]
� **Project Manager:** [Name] - [Email]

End of Part 3
End of BRD

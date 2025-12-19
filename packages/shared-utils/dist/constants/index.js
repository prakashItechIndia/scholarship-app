"use strict";
/**
 * Shared Constants
 * Common constants used across SSO and Experience APIs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATE_FORMATS = exports.CACHE_TTL = exports.PRODUCT_CODES = exports.HTTP_STATUS = exports.ERROR_MESSAGES = exports.OAUTH2 = exports.ACCOUNT_LOCKOUT = exports.RATE_LIMIT = exports.DB_POOL_DEFAULTS = exports.JWT_CONFIG = exports.PAGINATION = exports.FILE_TYPES = exports.USER_STATUS = exports.USER_ROLES = void 0;
// User Roles
exports.USER_ROLES = {
    ICAPTUR_SUPER_ADMIN: 'icaptur_super_admin',
    PRODUCT_ADMIN: 'product_admin',
    ORG_ADMIN: 'org_admin',
    ORG_USER: 'org_user',
};
// User Status
exports.USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    SUSPENDED: 'suspended',
};
// File Types
exports.FILE_TYPES = {
    PROFILE_PICTURE: 'profile_picture',
    ORGANIZATION_LOGO: 'organization_logo',
    DOCUMENT: 'document',
    INVOICE: 'invoice',
};
// Pagination Defaults
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};
// JWT Configuration
exports.JWT_CONFIG = {
    DEFAULT_EXPIRES_IN: '1h',
    REFRESH_TOKEN_EXPIRES_IN_DAYS: 7,
    REFRESH_TOKEN_EXPIRES_IN_DAYS_PROD: 30,
};
// Database Pool Defaults
exports.DB_POOL_DEFAULTS = {
    MAX: 20,
    MIN: 2,
    IDLE_TIMEOUT_MS: 30000,
    CONNECTION_TIMEOUT_MS: 10000,
};
// Rate Limiting
exports.RATE_LIMIT = {
    DEFAULT_MAX: 1000,
    DEFAULT_WINDOW_MS: 60000,
    LOGIN_MAX: 5,
    LOGIN_WINDOW_MS: 900000, // 15 minutes
};
// Account Lockout
exports.ACCOUNT_LOCKOUT = {
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION_MS: 30 * 60 * 1000, // 30 minutes
};
// OAuth2
exports.OAUTH2 = {
    DEFAULT_AUTH_CODE_EXPIRY_SECONDS: 30,
    DEFAULT_STATE_LENGTH: 32,
};
// Error Messages
exports.ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    DATABASE_ERROR: 'Database error',
    EXTERNAL_SERVICE_ERROR: 'External service error',
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED: 'Account is locked',
    ACCOUNT_INACTIVE: 'Account is not active',
    TENANT_REQUIRED: 'Tenant ID is required for this operation',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
};
// HTTP Status Codes
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
};
// Product Codes
exports.PRODUCT_CODES = {
    ACCOUNTS: 'accounts',
    EXPERIENCE: 'experience',
    IREPO: 'irepo',
    INVOX: 'invox',
    CUSTOMER_PORTAL: 'customer_portal',
};
// Cache TTL (in milliseconds)
exports.CACHE_TTL = {
    SHORT: 60000, // 1 minute
    MEDIUM: 300000, // 5 minutes
    LONG: 3600000, // 1 hour
    VERY_LONG: 86400000, // 24 hours
};
// Date Formats
exports.DATE_FORMATS = {
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    DATE_ONLY: 'YYYY-MM-DD',
    TIME_ONLY: 'HH:mm:ss',
};

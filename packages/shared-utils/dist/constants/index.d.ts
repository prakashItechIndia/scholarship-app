/**
 * Shared Constants
 * Common constants used across SSO and Experience APIs
 */
export declare const USER_ROLES: {
    readonly ICAPTUR_SUPER_ADMIN: "icaptur_super_admin";
    readonly PRODUCT_ADMIN: "product_admin";
    readonly ORG_ADMIN: "org_admin";
    readonly ORG_USER: "org_user";
};
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export declare const USER_STATUS: {
    readonly ACTIVE: "active";
    readonly INACTIVE: "inactive";
    readonly PENDING: "pending";
    readonly SUSPENDED: "suspended";
};
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export declare const FILE_TYPES: {
    readonly PROFILE_PICTURE: "profile_picture";
    readonly ORGANIZATION_LOGO: "organization_logo";
    readonly DOCUMENT: "document";
    readonly INVOICE: "invoice";
};
export type FileType = (typeof FILE_TYPES)[keyof typeof FILE_TYPES];
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 100;
};
export declare const JWT_CONFIG: {
    readonly DEFAULT_EXPIRES_IN: "1h";
    readonly REFRESH_TOKEN_EXPIRES_IN_DAYS: 7;
    readonly REFRESH_TOKEN_EXPIRES_IN_DAYS_PROD: 30;
};
export declare const DB_POOL_DEFAULTS: {
    readonly MAX: 20;
    readonly MIN: 2;
    readonly IDLE_TIMEOUT_MS: 30000;
    readonly CONNECTION_TIMEOUT_MS: 10000;
};
export declare const RATE_LIMIT: {
    readonly DEFAULT_MAX: 1000;
    readonly DEFAULT_WINDOW_MS: 60000;
    readonly LOGIN_MAX: 5;
    readonly LOGIN_WINDOW_MS: 900000;
};
export declare const ACCOUNT_LOCKOUT: {
    readonly MAX_ATTEMPTS: 5;
    readonly LOCKOUT_DURATION_MS: number;
};
export declare const OAUTH2: {
    readonly DEFAULT_AUTH_CODE_EXPIRY_SECONDS: 30;
    readonly DEFAULT_STATE_LENGTH: 32;
};
export declare const ERROR_MESSAGES: {
    readonly UNAUTHORIZED: "Unauthorized access";
    readonly FORBIDDEN: "Access forbidden";
    readonly NOT_FOUND: "Resource not found";
    readonly VALIDATION_ERROR: "Validation error";
    readonly DATABASE_ERROR: "Database error";
    readonly EXTERNAL_SERVICE_ERROR: "External service error";
    readonly INVALID_CREDENTIALS: "Invalid email or password";
    readonly ACCOUNT_LOCKED: "Account is locked";
    readonly ACCOUNT_INACTIVE: "Account is not active";
    readonly TENANT_REQUIRED: "Tenant ID is required for this operation";
    readonly INSUFFICIENT_PERMISSIONS: "Insufficient permissions";
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const PRODUCT_CODES: {
    readonly ACCOUNTS: "accounts";
    readonly EXPERIENCE: "experience";
    readonly IREPO: "irepo";
    readonly INVOX: "invox";
    readonly CUSTOMER_PORTAL: "customer_portal";
};
export type ProductCode = (typeof PRODUCT_CODES)[keyof typeof PRODUCT_CODES];
export declare const CACHE_TTL: {
    readonly SHORT: 60000;
    readonly MEDIUM: 300000;
    readonly LONG: 3600000;
    readonly VERY_LONG: 86400000;
};
export declare const DATE_FORMATS: {
    readonly ISO: "YYYY-MM-DDTHH:mm:ss.SSSZ";
    readonly DATE_ONLY: "YYYY-MM-DD";
    readonly TIME_ONLY: "HH:mm:ss";
};

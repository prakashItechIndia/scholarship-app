/**
 * Security Validation Utilities
 * Provides input validation and sanitization helpers
 */
/**
 * Validate email format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Sanitize string input to prevent XSS
 * Removes potentially dangerous HTML/script tags and characters
 */
export declare function sanitizeString(input: string): string;
/**
 * Sanitize HTML content (for cases where HTML is allowed but needs to be safe)
 * This is a basic sanitizer - consider using a library like DOMPurify for production
 */
export declare function sanitizeHtml(html: string): string;
/**
 * Sanitize object recursively (for nested objects)
 */
export declare function sanitizeObject<T extends Record<string, unknown>>(obj: T): T;
/**
 * Validate UUID format
 */
export declare function isValidUUID(uuid: string): boolean;
/**
 * Validate password strength
 */
export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare function validatePassword(password: string): PasswordValidationResult;
/**
 * Validate and sanitize SQL input to prevent injection
 * Note: This is a basic check. Always use parameterized queries!
 */
export declare function sanitizeSqlInput(input: string): string;
/**
 * Validate URL format
 */
export declare function isValidUrl(url: string): boolean;
/**
 * Validate and limit string length
 */
export declare function validateStringLength(input: string, min: number, max: number): boolean;
/**
 * Validate numeric input
 */
export declare function isValidNumber(value: unknown): value is number;
/**
 * Validate integer input
 */
export declare function isValidInteger(value: unknown): value is number;
/**
 * Validate positive number
 */
export declare function isValidPositiveNumber(value: unknown): value is number;
/**
 * Validate non-negative number
 */
export declare function isValidNonNegativeNumber(value: unknown): value is number;

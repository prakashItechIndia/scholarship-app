"use strict";
/**
 * Security Validation Utilities
 * Provides input validation and sanitization helpers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = isValidEmail;
exports.sanitizeString = sanitizeString;
exports.sanitizeHtml = sanitizeHtml;
exports.sanitizeObject = sanitizeObject;
exports.isValidUUID = isValidUUID;
exports.validatePassword = validatePassword;
exports.sanitizeSqlInput = sanitizeSqlInput;
exports.isValidUrl = isValidUrl;
exports.validateStringLength = validateStringLength;
exports.isValidNumber = isValidNumber;
exports.isValidInteger = isValidInteger;
exports.isValidPositiveNumber = isValidPositiveNumber;
exports.isValidNonNegativeNumber = isValidNonNegativeNumber;
/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
}
/**
 * Sanitize string input to prevent XSS
 * Removes potentially dangerous HTML/script tags and characters
 */
function sanitizeString(input) {
    if (typeof input !== 'string') {
        return '';
    }
    return (input
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove script tags and their content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove event handlers (onclick, onerror, etc.)
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        // Remove javascript: protocol
        .replace(/javascript:/gi, '')
        // Remove data: URLs that could contain scripts
        .replace(/data:text\/html/gi, '')
        // Remove angle brackets
        .replace(/[<>]/g, '')
        // Remove null bytes
        .replace(/\0/g, '')
        // Trim whitespace
        .trim());
}
/**
 * Sanitize HTML content (for cases where HTML is allowed but needs to be safe)
 * This is a basic sanitizer - consider using a library like DOMPurify for production
 */
function sanitizeHtml(html) {
    if (typeof html !== 'string') {
        return '';
    }
    // Remove script tags
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');
    // Remove data: URLs for scripts
    sanitized = sanitized.replace(/data:text\/html/gi, '');
    return sanitized;
}
/**
 * Sanitize object recursively (for nested objects)
 */
function sanitizeObject(obj) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => typeof item === 'string'
            ? sanitizeString(item)
            : sanitizeObject(item));
    }
    const sanitized = { ...obj };
    for (const key in sanitized) {
        if (Object.prototype.hasOwnProperty.call(sanitized, key)) {
            const value = sanitized[key];
            if (typeof value === 'string') {
                sanitized[key] = sanitizeString(value);
            }
            else if (typeof value === 'object' && value !== null) {
                sanitized[key] = sanitizeObject(value);
            }
        }
    }
    return sanitized;
}
/**
 * Validate UUID format
 */
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
function validatePassword(password) {
    const errors = [];
    if (password.length < 12) {
        errors.push('Password must be at least 12 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
/**
 * Validate and sanitize SQL input to prevent injection
 * Note: This is a basic check. Always use parameterized queries!
 */
function sanitizeSqlInput(input) {
    // Remove SQL injection patterns
    return input
        .replace(/['";\\]/g, '') // Remove quotes and semicolons
        .replace(/--/g, '') // Remove SQL comments
        .replace(/\/\*/g, '') // Remove block comments
        .replace(/\*\//g, '')
        .trim();
}
/**
 * Validate URL format
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Validate and limit string length
 */
function validateStringLength(input, min, max) {
    return input.length >= min && input.length <= max;
}
/**
 * Validate numeric input
 */
function isValidNumber(value) {
    return (typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value));
}
/**
 * Validate integer input
 */
function isValidInteger(value) {
    return isValidNumber(value) && Number.isInteger(value);
}
/**
 * Validate positive number
 */
function isValidPositiveNumber(value) {
    return isValidNumber(value) && value > 0;
}
/**
 * Validate non-negative number
 */
function isValidNonNegativeNumber(value) {
    return isValidNumber(value) && value >= 0;
}

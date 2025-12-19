/**
 * File Upload Security Validator
 * Validates file uploads to prevent security vulnerabilities
 */
export interface FileValidationResult {
    isValid: boolean;
    errors: string[];
}
export interface FileValidationOptions {
    maxSize?: number;
    allowedMimeTypes?: readonly string[] | string[];
    allowedExtensions?: readonly string[] | string[];
    scanForMalware?: boolean;
}
/**
 * Validate file upload based on security criteria
 */
export declare function validateFileUpload(file: {
    originalname: string;
    mimetype: string;
    size: number;
    buffer?: Buffer;
}, options?: FileValidationOptions): FileValidationResult;
/**
 * Get allowed MIME types for common file types
 */
export declare const ALLOWED_MIME_TYPES: {
    readonly IMAGES: readonly ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    readonly DOCUMENTS: readonly ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain", "text/csv"];
    readonly ALL: readonly ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain", "text/csv"];
};
/**
 * Get allowed file extensions for common file types
 */
export declare const ALLOWED_EXTENSIONS: {
    readonly IMAGES: readonly ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    readonly DOCUMENTS: readonly ["pdf", "doc", "docx", "xls", "xlsx", "txt", "csv"];
    readonly ALL: readonly ["jpg", "jpeg", "png", "gif", "webp", "svg", "pdf", "doc", "docx", "xls", "xlsx", "txt", "csv"];
};

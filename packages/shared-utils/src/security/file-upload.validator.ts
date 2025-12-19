/**
 * File Upload Security Validator
 * Validates file uploads to prevent security vulnerabilities
 */

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedMimeTypes?: readonly string[] | string[];
  allowedExtensions?: readonly string[] | string[];
  scanForMalware?: boolean; // Placeholder for future malware scanning
}

/**
 * Validate file upload based on security criteria
 */
export function validateFileUpload(
  file: {
    originalname: string;
    mimetype: string;
    size: number;
    buffer?: Buffer;
  },
  options: FileValidationOptions = {},
): FileValidationResult {
  const errors: string[] = [];
  const {
    maxSize = 10 * 1024 * 1024, // Default 10MB
    allowedMimeTypes = [],
    allowedExtensions = [],
  } = options;

  // Validate file size
  if (file.size > maxSize) {
    errors.push(
      `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
    );
  }

  // Validate MIME type (more secure than extension checking)
  if (allowedMimeTypes.length > 0) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      errors.push(
        `File type ${file.mimetype} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`,
      );
    }
  }

  // Validate file extension
  if (allowedExtensions.length > 0) {
    const extension = extractExtension(file.originalname);
    if (!allowedExtensions.includes(extension.toLowerCase())) {
      errors.push(
        `File extension .${extension} is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`,
      );
    }
  }

  // Validate file name (prevent path traversal)
  if (file.originalname.includes('..') || file.originalname.includes('/')) {
    errors.push('File name contains invalid characters');
  }

  // Check for double extensions (e.g., file.jpg.exe)
  const parts = file.originalname.split('.');
  if (parts.length > 2) {
    // Warn about potential double extension attack
    // This is a basic check - consider more sophisticated validation
  }

  // Validate MIME type matches extension (basic check)
  if (file.mimetype && file.originalname) {
    const extension = extractExtension(file.originalname).toLowerCase();
    const mimeTypeMap: Record<string, string[]> = {
      jpg: ['image/jpeg'],
      jpeg: ['image/jpeg'],
      png: ['image/png'],
      gif: ['image/gif'],
      pdf: ['application/pdf'],
      doc: ['application/msword'],
      docx: [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      xls: ['application/vnd.ms-excel'],
      xlsx: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
    };

    const expectedMimeTypes = mimeTypeMap[extension];
    if (expectedMimeTypes && !expectedMimeTypes.includes(file.mimetype)) {
      errors.push(
        `File extension .${extension} does not match MIME type ${file.mimetype}`,
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Extract file extension from filename
 */
function extractExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

/**
 * Get allowed MIME types for common file types
 */
export const ALLOWED_MIME_TYPES = {
  IMAGES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
  ALL: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
} as const;

/**
 * Get allowed file extensions for common file types
 */
export const ALLOWED_EXTENSIONS = {
  IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  DOCUMENTS: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv'],
  ALL: [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'webp',
    'svg',
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'txt',
    'csv',
  ],
} as const;

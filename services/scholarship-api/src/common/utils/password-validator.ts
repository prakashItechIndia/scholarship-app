import { BadRequestException } from '@nestjs/common';

/**
 * Password validation requirements:
 * - Minimum 12 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&*)
 */
export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export class PasswordValidator {
  /**
   * Validate password strength according to BRD requirements
   */
  static validatePassword(
    password: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userEmail?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _firstName?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _lastName?: string,
  ): PasswordValidationResult {
    const errors: string[] = [];

    // Minimum length: 12 characters
    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long');
    }

    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter (A-Z)');
    }

    // At least one lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter (a-z)');
    }

    // At least one number
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number (0-9)');
    }

    // At least one special character
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push(
        'Password must contain at least one special character (!@#$%^&*)',
      );
    }

    // Check against common passwords (basic check - can be enhanced with breach database)
    const commonPasswords = [
      'password',
      'password123',
      '12345678',
      'qwerty',
      'abc123',
      'letmein',
      'welcome',
      'admin',
      'root',
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common. Please choose a stronger password');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate password and throw BadRequestException if invalid
   */
  static validatePasswordOrThrow(
    password: string,
    userEmail?: string,
    firstName?: string,
    lastName?: string,
  ): void {
    const result = this.validatePassword(
      password,
      userEmail,
      firstName,
      lastName,
    );
    if (!result.valid) {
      throw new BadRequestException(result.errors.join('; '));
    }
  }
}

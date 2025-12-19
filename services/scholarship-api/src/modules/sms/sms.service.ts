import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import type { EnvVars } from '../../config/env.validation';
import { randomInt } from 'crypto';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly snsClient: SNSClient | null = null;
  private readonly isConfigured: boolean = false;
  private readonly awsRegion: string;

  constructor(private readonly configService: ConfigService<EnvVars, true>) {
    this.awsRegion =
      this.configService.get('AWS_REGION', { infer: true }) || 'us-east-1';

    // Initialize SNS client if AWS credentials are available
    const awsAccessKeyId = this.configService.get('AWS_ACCESS_KEY_ID', {
      infer: true,
    });
    const awsSecretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY', {
      infer: true,
    });
    const nodeEnv = this.configService.get('NODE_ENV', { infer: true });

    // Try to initialize SNS if credentials are provided (works in any environment)
    if (awsAccessKeyId && awsSecretAccessKey) {
      try {
        this.snsClient = new SNSClient({
          region: this.awsRegion,
          credentials: {
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsSecretAccessKey,
          },
        });
        this.isConfigured = true;
        this.logger.log(
          `SMS service initialized with AWS SNS (${this.awsRegion})`,
        );
      } catch (error) {
        this.logger.warn('SMS service not configured (AWS SNS unavailable)');
        this.logger.warn('SMS will be logged instead of sent');
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.warn(`Error: ${errorMessage}`);
      }
    } else {
      if (nodeEnv === 'production') {
        this.logger.warn(
          'SMS service: AWS credentials not configured. SMS will be logged instead of sent.',
        );
        this.logger.warn(
          'To enable SMS sending, set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.',
        );
      } else {
        this.logger.log(
          'SMS service in development mode (logging only). Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to enable SMS sending.',
        );
      }
    }
  }

  /**
   * Generate a 6-digit OTP code
   */
  generateOtpCode(): string {
    return randomInt(100000, 999999).toString();
  }

  /**
   * Send SMS OTP code to phone number
   */
  async sendOtpCode(phoneNumber: string, code: string): Promise<boolean> {
    const message = `Your iCaptur.AI verification code is: ${code}. This code expires in 10 minutes.`;

    // If SNS is not configured, just log the SMS
    if (!this.isConfigured || !this.snsClient) {
      this.logger.log(`📱 [SMS LOG] To: ${phoneNumber}, Message: "${message}"`);
      this.logger.warn(
        '⚠️  SMS not actually sent. Configure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to enable SMS sending.',
      );
      return true; // Return true to allow testing/development
    }

    try {
      const command = new PublishCommand({
        PhoneNumber: phoneNumber,
        Message: message,
        MessageAttributes: {
          'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional',
          },
        },
      });

      const response = await this.snsClient.send(command);
      this.logger.log(
        `✅ SMS sent via AWS SNS: To=${phoneNumber}, MessageId=${response.MessageId}`,
      );
      return true;
    } catch (error: unknown) {
      this.logger.error(`❌ Failed to send SMS to ${phoneNumber}`);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`   Error: ${errorMessage}`);

      // Log the SMS anyway for debugging
      this.logger.log(`📱 [SMS LOG] To: ${phoneNumber}, Message: "${message}"`);
      return false;
    }
  }

  /**
   * Validate phone number format (basic validation)
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // Remove all non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');

    // Basic validation: should start with + and have 10-15 digits
    // Or just have 10-15 digits (for US numbers without country code)
    const withCountryCode = /^\+[1-9]\d{9,14}$/.test(cleaned);
    const withoutCountryCode = /^\d{10,15}$/.test(cleaned);

    return withCountryCode || withoutCountryCode;
  }

  /**
   * Normalize phone number to E.164 format
   */
  normalizePhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters except +
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');

    // If it doesn't start with +, assume it's a US number and add +1
    if (!cleaned.startsWith('+')) {
      // Remove leading 1 if present (US country code)
      if (cleaned.startsWith('1') && cleaned.length === 11) {
        cleaned = cleaned.substring(1);
      }
      cleaned = `+1${cleaned}`;
    }

    return cleaned;
  }
}

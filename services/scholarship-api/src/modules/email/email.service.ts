import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import {
  getUserInvitationEmailTemplate,
  getUserInvitationEmailText,
} from '@icaptur/email-templates';

import { EnvVars } from '../../config/env.validation';

interface SentMessageInfo {
  messageId?: string;
  [key: string]: unknown;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;
  private isConfigured = false;

  constructor(private readonly configService: ConfigService<EnvVars, true>) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const smtpHost = this.configService.get('SMTP_HOST', { infer: true });
    const smtpPort = this.configService.get('SMTP_PORT', { infer: true });
    const smtpUser = this.configService.get('SMTP_USER', { infer: true });
    const smtpPassword = this.configService.get('SMTP_PASSWORD', {
      infer: true,
    });
    const smtpSecure =
      this.configService.get('SMTP_SECURE', { infer: true }) ?? false;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      this.logger.warn(
        '⚠️  SMTP not configured. Emails will be logged only (dev mode).',
      );
      this.logger.warn(
        '   To enable emails, set: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD',
      );
      this.isConfigured = false;
      return;
    }

    // Helper function to check if host is an IP address
    const isIPAddress = (host: string): boolean => {
      const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
      const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
      return ipv4Regex.test(host) || ipv6Regex.test(host);
    };

    // If host is an IP address, disable certificate validation
    // This is necessary because SSL certificates are issued for hostnames, not IPs
    const tlsRejectUnauthorized = !isIPAddress(smtpHost);

    try {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
        tls: {
          rejectUnauthorized: tlsRejectUnauthorized,
        },
      });

      this.isConfigured = true;
      this.logger.log(
        `✅ Email service initialized: SMTP (${smtpHost}:${smtpPort})`,
      );
      if (!tlsRejectUnauthorized) {
        this.logger.warn(
          `⚠️  TLS certificate validation disabled (IP address detected: ${smtpHost})`,
        );
      }
    } catch (error) {
      this.logger.error('❌ Failed to initialize SMTP transporter', error);
      this.isConfigured = false;
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      this.logger.warn(
        `📧 Email not sent (SMTP not configured): To=${options.to}, Subject="${options.subject}"`,
      );
      this.logger.debug(`   Email body: ${options.html?.substring(0, 100)}...`);
      return false;
    }

    const smtpFrom =
      this.configService.get('SMTP_FROM', { infer: true }) ||
      'noreply@icaptur.ai';

    try {
      const info = (await this.transporter.sendMail({
        from: smtpFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html),
      })) as SentMessageInfo;

      const messageId =
        info && typeof info === 'object' && 'messageId' in info
          ? String(info.messageId)
          : 'unknown';
      this.logger.log(
        `✅ Email sent via SMTP: To=${options.to}, MessageId=${messageId}`,
      );
      return true;
    } catch (error: unknown) {
      this.logger.error(`❌ Failed to send email to ${options.to}`);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`   Error: ${errorMessage}`);

      if (
        error &&
        typeof error === 'object' &&
        ('code' in error || 'errno' in error)
      ) {
        const errorCode = 'code' in error ? String(error.code) : undefined;
        if (errorCode === 'ESOCKET' || errorCode === 'ECONNRESET') {
          this.logger.error('   💡 SMTP connection error. Check:');
          this.logger.error('      - SMTP_HOST, SMTP_PORT are correct');
          this.logger.error('      - SMTP_USER, SMTP_PASSWORD are valid');
          this.logger.error('      - Network/firewall allows SMTP traffic');
        }
      }

      return false;
    }
  }

  async sendActivationEmail(
    email: string,
    firstName: string,
    activationToken: string,
    returnUrl?: string,
    productCode?: string,
  ): Promise<boolean> {
    const ssoAppUrl =
      this.configService.get('SSO_APP_URL', { infer: true }) ?? '';

    const activationUrlParams = new URLSearchParams({ token: activationToken });

    // Preserve returnUrl and productCode for redirect back to originating product
    if (returnUrl) {
      activationUrlParams.set('returnUrl', returnUrl);
    }
    if (productCode) {
      activationUrlParams.set('product', productCode);
    }

    const activationUrl = `${ssoAppUrl}/create-password?${activationUrlParams.toString()}`;

    const html = this.getActivationEmailTemplate(firstName, activationUrl);
    const text = this.getActivationEmailText(firstName, activationUrl);

    return this.sendEmail({
      to: email,
      subject: 'Activate your iCaptur account',
      html,
      text,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    resetToken: string,
    returnUrl?: string,
    productCode?: string,
  ): Promise<boolean> {
    const ssoAppUrl =
      this.configService.get('SSO_APP_URL', { infer: true }) ?? '';
    const resetUrlParams = new URLSearchParams({ token: resetToken });

    // Preserve returnUrl and productCode for redirect back to originating product
    if (returnUrl) {
      resetUrlParams.set('returnUrl', returnUrl);
    }
    if (productCode) {
      resetUrlParams.set('product', productCode);
    }

    const resetUrl = `${ssoAppUrl}/reset-password?${resetUrlParams.toString()}`;

    const html = this.getPasswordResetEmailTemplate(firstName, resetUrl);
    const text = this.getPasswordResetEmailText(firstName, resetUrl);

    return this.sendEmail({
      to: email,
      subject: 'Reset your iCaptur password',
      html,
      text,
    });
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }

  private getActivationEmailTemplate(
    firstName: string,
    activationUrl: string,
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activate your iCaptur account</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Welcome to iCaptur!</h1>
      <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Activate your account to get started</p>
    </div>
    
    <div style="padding: 40px 30px;">
      <p style="font-size: 18px; margin: 0 0 20px 0; color: #1f2937; font-weight: 500;">Hi ${firstName},</p>
      
      <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px 0; line-height: 1.7;">
        Thank you for joining iCaptur! To get started, please activate your account by creating a password.
      </p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${activationUrl}" 
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
          Activate Account
        </a>
      </div>
      
      <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
        Or copy and paste this link into your browser:
      </p>
      <p style="font-size: 12px; color: #9ca3af; word-break: break-all; background: #f9fafb; padding: 12px; border-radius: 6px; margin: 10px 0;">
        ${activationUrl}
      </p>
      
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 6px;">
        <p style="font-size: 14px; color: #92400e; margin: 0; font-weight: 500;">⏰ Important</p>
        <p style="font-size: 13px; color: #78350f; margin: 8px 0 0 0; line-height: 1.6;">
          This activation link will expire in 48 hours. If you didn't create an account with iCaptur, please ignore this email.
        </p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0 30px 0;">
      
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0; line-height: 1.6;">
        © ${new Date().getFullYear()} iCaptur. All rights reserved.<br>
        Powered by iTech
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private getActivationEmailText(
    firstName: string,
    activationUrl: string,
  ): string {
    return `
Welcome to iCaptur!

Hi ${firstName},

Thank you for joining iCaptur! To get started, please activate your account by creating a password.

Activate your account: ${activationUrl}

This activation link will expire in 48 hours. If you didn't create an account with iCaptur, please ignore this email.

© 2024 iCaptur. All rights reserved.
Powered by iTech
    `.trim();
  }

  private getPasswordResetEmailTemplate(
    firstName: string,
    resetUrl: string,
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Reset Your Password</h1>
      <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Secure your account</p>
    </div>
    
    <div style="padding: 40px 30px;">
      <p style="font-size: 18px; margin: 0 0 20px 0; color: #1f2937; font-weight: 500;">Hi ${firstName},</p>
      
      <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px 0; line-height: 1.7;">
        We received a request to reset your password for your iCaptur account. Click the button below to create a new password.
      </p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${resetUrl}" 
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
          Reset Password
        </a>
      </div>
      
      <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
        Or copy and paste this link into your browser:
      </p>
      <p style="font-size: 12px; color: #9ca3af; word-break: break-all; background: #f9fafb; padding: 12px; border-radius: 6px; margin: 10px 0;">
        ${resetUrl}
      </p>
      
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 6px;">
        <p style="font-size: 14px; color: #92400e; margin: 0; font-weight: 500;">⏰ Important</p>
        <p style="font-size: 13px; color: #78350f; margin: 8px 0 0 0; line-height: 1.6;">
          This link will expire in 24 hours. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
        </p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0 30px 0;">
      
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0; line-height: 1.6;">
        © ${new Date().getFullYear()} iCaptur. All rights reserved.<br>
        Powered by iTech
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private getPasswordResetEmailText(
    firstName: string,
    resetUrl: string,
  ): string {
    return `
Password Reset Request

Hi ${firstName},

We received a request to reset your password. Click the link below to create a new password.

Reset your password: ${resetUrl}

This link will expire in 24 hours. If you didn't request a password reset, please ignore this email and your password will remain unchanged.

© 2024 iCaptur. All rights reserved.
Powered by iTech
    `.trim();
  }

  /**
   * Send organization onboarded email (when product admin creates organization)
   */
  async sendOrganizationOnboardedEmail(
    email: string,
    firstName: string,
    organizationName: string,
    adminName?: string,
  ): Promise<boolean> {
    const html = this.getOrganizationOnboardedEmailTemplate(
      firstName,
      organizationName,
      adminName,
    );
    const text = this.getOrganizationOnboardedEmailText(
      firstName,
      organizationName,
      adminName,
    );

    return this.sendEmail({
      to: email,
      subject: `Welcome to iCaptur - ${organizationName} is now onboarded`,
      html,
      text,
    });
  }

  /**
   * Send user invitation email (when product admin or org admin adds new user)
   */
  async sendUserInvitationEmail(
    email: string,
    firstName: string,
    activationToken: string,
    organizationName: string,
    inviterName?: string,
    inviterRole?: 'product_admin' | 'org_admin',
    productName?: string,
  ): Promise<boolean> {
    const ssoAppUrl =
      this.configService.get('SSO_APP_URL', { infer: true }) ?? '';
    const activationUrl = `${ssoAppUrl}/create-password?token=${activationToken}`;

    const html = getUserInvitationEmailTemplate({
      firstName,
      activationUrl,
      organizationName,
      inviterName,
      inviterRole,
      productName,
    });
    const text = getUserInvitationEmailText({
      firstName,
      activationUrl,
      organizationName,
      inviterName,
      inviterRole,
      productName,
    });

    return this.sendEmail({
      to: email,
      subject: `You've been invited to join ${organizationName} on iCaptur`,
      html,
      text,
    });
  }

  /**
   * Send trial ending email (1 day before or on the day)
   */
  async sendTrialEndingEmail(
    email: string,
    firstName: string,
    organizationName: string,
    trialEndsAt: Date,
    daysRemaining: number,
    productId?: string,
  ): Promise<boolean> {
    const experienceAppUrl =
      this.configService.get('EXPERIENCE_APP_URL', { infer: true }) ?? '';
    const upgradeUrl = productId
      ? `${experienceAppUrl}/billing/${productId}`
      : `${experienceAppUrl}/billing/default`;

    const html = this.getTrialEndingEmailTemplate(
      firstName,
      organizationName,
      trialEndsAt,
      daysRemaining,
      upgradeUrl,
    );
    const text = this.getTrialEndingEmailText(
      firstName,
      organizationName,
      trialEndsAt,
      daysRemaining,
      upgradeUrl,
    );

    const subject =
      daysRemaining === 0
        ? `Your iCaptur trial has ended - Upgrade now to continue`
        : `Your iCaptur trial ends ${daysRemaining === 1 ? 'tomorrow' : `in ${daysRemaining} days`} - Upgrade now`;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text,
    });
  }

  /**
   * Send password changed confirmation email
   */
  async sendPasswordChangedEmail(
    email: string,
    firstName: string,
  ): Promise<boolean> {
    const html = this.getPasswordChangedEmailTemplate(firstName);
    const text = this.getPasswordChangedEmailText(firstName);

    return this.sendEmail({
      to: email,
      subject: 'Your iCaptur password has been changed',
      html,
      text,
    });
  }

  private getOrganizationOnboardedEmailTemplate(
    firstName: string,
    organizationName: string,
    adminName?: string,
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Organization Onboarded</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Welcome to iCaptur!</h1>
      <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Your organization has been successfully onboarded</p>
    </div>
    
    <div style="padding: 40px 30px;">
      <p style="font-size: 18px; margin: 0 0 20px 0; color: #1f2937; font-weight: 500;">Hi ${firstName},</p>
      
      <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px 0; line-height: 1.7;">
        ${adminName ? `Great news! ${adminName} has` : 'We have'} successfully onboarded <strong style="color: #667eea;">${organizationName}</strong> to the iCaptur platform.
      </p>
      
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 8px;">
        <p style="font-size: 16px; color: #1e40af; margin: 0; font-weight: 500;">🎉 What's Next?</p>
        <ul style="margin: 15px 0 0 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
          <li>Your organization is now set up with a <strong>7-day free trial</strong></li>
          <li>You can start using all iCaptur features immediately</li>
          <li>Add team members and configure your organization settings</li>
          <li>Upgrade to a paid plan before your trial ends to continue access</li>
        </ul>
      </div>
      
      <p style="font-size: 16px; color: #4b5563; margin: 30px 0 20px 0; line-height: 1.7;">
        You can now log in to your account and start exploring the platform. If you have any questions, our support team is here to help!
      </p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${this.configService.get('SSO_APP_URL', { infer: true }) ?? ''}/signin" 
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
          Sign In to Your Account
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0 30px 0;">
      
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0; line-height: 1.6;">
        © ${new Date().getFullYear()} iCaptur. All rights reserved.<br>
        Powered by iTech
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private getOrganizationOnboardedEmailText(
    firstName: string,
    organizationName: string,
    adminName?: string,
  ): string {
    return `
Welcome to iCaptur!

Hi ${firstName},

${adminName ? `${adminName} has` : 'We have'} successfully onboarded ${organizationName} to the iCaptur platform.

What's Next?
- Your organization is now set up with a 7-day free trial
- You can start using all iCaptur features immediately
- Add team members and configure your organization settings
- Upgrade to a paid plan before your trial ends to continue access

You can now log in to your account and start exploring the platform. If you have any questions, our support team is here to help!

Sign in: ${this.configService.get('SSO_APP_URL', { infer: true }) ?? ''}/signin

© ${new Date().getFullYear()} iCaptur. All rights reserved.
Powered by iTech
    `.trim();
  }

  private getTrialEndingEmailTemplate(
    firstName: string,
    organizationName: string,
    trialEndsAt: Date,
    daysRemaining: number,
    upgradeUrl: string,
  ): string {
    const isToday = daysRemaining === 0;
    const isTomorrow = daysRemaining === 1;
    const urgencyColor = isToday ? '#dc2626' : '#f59e0b';
    const urgencyBg = isToday ? '#fee2e2' : '#fef3c7';
    const urgencyBorder = isToday ? '#dc2626' : '#f59e0b';

    const timeMessage = isToday
      ? 'Your trial period has ended today'
      : isTomorrow
        ? 'Your trial period ends tomorrow'
        : `Your trial period ends in ${daysRemaining} days`;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trial Ending - Upgrade Now</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, ${urgencyColor} 0%, ${isToday ? '#991b1b' : '#d97706'} 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">${isToday ? '⚠️ Trial Ended' : '⏰ Trial Ending Soon'}</h1>
      <p style="color: rgba(255, 255, 255, 0.95); margin: 10px 0 0 0; font-size: 16px;">${timeMessage}</p>
    </div>
    
    <div style="padding: 40px 30px;">
      <p style="font-size: 18px; margin: 0 0 20px 0; color: #1f2937; font-weight: 500;">Hi ${firstName},</p>
      
      <div style="background: ${urgencyBg}; border-left: 4px solid ${urgencyBorder}; padding: 20px; margin: 20px 0 30px 0; border-radius: 8px;">
        <p style="font-size: 16px; color: ${isToday ? '#991b1b' : '#92400e'}; margin: 0; font-weight: 600;">
          ${isToday ? '🚨 Action Required' : '⏰ Important Notice'}
        </p>
        <p style="font-size: 15px; color: ${isToday ? '#7f1d1d' : '#78350f'}; margin: 10px 0 0 0; line-height: 1.7;">
          ${timeMessage} for <strong>${organizationName}</strong>. ${isToday ? 'To continue using iCaptur, please upgrade to a paid plan now.' : 'Upgrade your plan before the trial ends to avoid any interruption in service.'}
        </p>
        <p style="font-size: 14px; color: ${isToday ? '#7f1d1d' : '#78350f'}; margin: 10px 0 0 0;">
          <strong>Trial End Date:</strong> ${trialEndsAt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px 0; line-height: 1.7;">
        ${isToday ? "Don't lose access to your data and features. Upgrade now to continue enjoying all the benefits of iCaptur." : "Upgrade now to ensure uninterrupted access to all iCaptur features and your organization's data."}
      </p>
      
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 8px;">
        <p style="font-size: 16px; color: #1e40af; margin: 0; font-weight: 500;">✨ Benefits of Upgrading:</p>
        <ul style="margin: 15px 0 0 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
          <li>Uninterrupted access to all features</li>
          <li>Priority customer support</li>
          <li>Advanced security and compliance</li>
          <li>Regular feature updates and improvements</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${upgradeUrl}" 
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
          ${isToday ? 'Upgrade Now' : 'Upgrade Your Plan'}
        </a>
      </div>
      
      <p style="font-size: 14px; color: #6b7280; margin-top: 30px; text-align: center; line-height: 1.6;">
        Questions? Our support team is here to help.<br>
        Contact us at <a href="mailto:support@icaptur.ai" style="color: #667eea; text-decoration: none;">support@icaptur.ai</a>
      </p>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0 30px 0;">
      
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0; line-height: 1.6;">
        © ${new Date().getFullYear()} iCaptur. All rights reserved.<br>
        Powered by iTech
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private getTrialEndingEmailText(
    firstName: string,
    organizationName: string,
    trialEndsAt: Date,
    daysRemaining: number,
    upgradeUrl: string,
  ): string {
    const isToday = daysRemaining === 0;
    const isTomorrow = daysRemaining === 1;
    const timeMessage = isToday
      ? 'Your trial period has ended today'
      : isTomorrow
        ? 'Your trial period ends tomorrow'
        : `Your trial period ends in ${daysRemaining} days`;

    return `
${isToday ? '⚠️ Trial Ended' : '⏰ Trial Ending Soon'}

Hi ${firstName},

${timeMessage} for ${organizationName}. ${isToday ? 'To continue using iCaptur, please upgrade to a paid plan now.' : 'Upgrade your plan before the trial ends to avoid any interruption in service.'}

Trial End Date: ${trialEndsAt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

${isToday ? "Don't lose access to your data and features. Upgrade now to continue enjoying all the benefits of iCaptur." : "Upgrade now to ensure uninterrupted access to all iCaptur features and your organization's data."}

Benefits of Upgrading:
- Uninterrupted access to all features
- Priority customer support
- Advanced security and compliance
- Regular feature updates and improvements

Upgrade now: ${upgradeUrl}

Questions? Contact us at support@icaptur.ai

© ${new Date().getFullYear()} iCaptur. All rights reserved.
Powered by iTech
    `.trim();
  }

  private getPasswordChangedEmailTemplate(firstName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">✅ Password Changed</h1>
      <p style="color: rgba(255, 255, 255, 0.95); margin: 10px 0 0 0; font-size: 16px;">Your account is secure</p>
    </div>
    
    <div style="padding: 40px 30px;">
      <p style="font-size: 18px; margin: 0 0 20px 0; color: #1f2937; font-weight: 500;">Hi ${firstName},</p>
      
      <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px 0; line-height: 1.7;">
        This is a confirmation that your iCaptur account password has been successfully changed.
      </p>
      
      <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 8px;">
        <p style="font-size: 16px; color: #065f46; margin: 0; font-weight: 500;">🔒 Security Information</p>
        <p style="font-size: 14px; color: #047857; margin: 10px 0 0 0; line-height: 1.7;">
          If you did not make this change, please contact our support team immediately at <a href="mailto:support@icaptur.ai" style="color: #059669; font-weight: 500;">support@icaptur.ai</a> to secure your account.
        </p>
      </div>
      
      <p style="font-size: 16px; color: #4b5563; margin: 30px 0 20px 0; line-height: 1.7;">
        Your account is now secured with your new password. You can continue using iCaptur as usual.
      </p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${this.configService.get('SSO_APP_URL', { infer: true }) ?? ''}/signin" 
           style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
          Sign In to Your Account
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0 30px 0;">
      
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0; line-height: 1.6;">
        © ${new Date().getFullYear()} iCaptur. All rights reserved.<br>
        Powered by iTech
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private getPasswordChangedEmailText(firstName: string): string {
    return `
Password Changed

Hi ${firstName},

This is a confirmation that your iCaptur account password has been successfully changed.

Security Information:
If you did not make this change, please contact our support team immediately at support@icaptur.ai to secure your account.

Your account is now secured with your new password. You can continue using iCaptur as usual.

Sign in: ${this.configService.get('SSO_APP_URL', { infer: true }) ?? ''}/signin

© ${new Date().getFullYear()} iCaptur. All rights reserved.
Powered by iTech
    `.trim();
  }
}

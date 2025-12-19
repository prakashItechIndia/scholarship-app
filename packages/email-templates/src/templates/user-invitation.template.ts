import { getImageDataUri } from '../utils/image-utils';

type CTAColor = 'primary';

interface BaseEmailContent {
  salutationName: string;
  title: { lead: string; highlight: string };
  subtitle: string;
  heroImageKey?: string;
  paragraphs: string[];
  cta: { label: string; url: string; color?: CTAColor };
  copyInstruction?: string;
  expiryNotice?: string;
}

export interface UserInvitationEmailData {
  firstName: string;
  activationUrl: string;
  organizationName: string;
  inviterName?: string;
  inviterRole?: 'product_admin' | 'org_admin';
  productName?: string;
}

export interface ForgotPasswordEmailData {
  firstName: string;
  resetUrl: string;
}

export interface ChangePasswordEmailData {
  firstName: string;
  changeUrl: string;
}

export interface WelcomeEmailData {
  firstName: string;
  getStartedUrl: string;
  organizationName?: string;
}

function buildEmailTemplate(content: BaseEmailContent): string {
  const {
    salutationName,
    title,
    subtitle,
    heroImageKey = 'invitation-illustration',
    paragraphs,
    cta,
    copyInstruction,
    expiryNotice,
  } = content;

  const icapturLogo = getImageDataUri('icaptur-logo');
  const itechLogo = getImageDataUri('itech-logo');
  const hero = getImageDataUri(heroImageKey);
  const copyIcon = getImageDataUri('copy-icon');

  const ctaColor = cta.color === 'primary' ? '#0f6cbd' : '#0f6cbd';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title.lead} ${title.highlight}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: 'Inter', Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#f7f8fb; font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f7f8fb;">
    <tr>
      <td align="center" style="padding:48px 24px 56px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:620px; margin:0 auto;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <img src="${icapturLogo}" alt="iCaptur" style="height:33px; width:auto; display:block;" />
            </td>
          </tr>

          <tr>
            <td style="background-color:#ffffff; border-radius:12px; padding:40px 44px; box-shadow:0px 12px 32px rgba(12, 28, 58, 0.05);">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <h1 style="margin:0; font-family:'Inter', sans-serif; font-size:32px; font-weight:700; color:#000000; line-height:1.2;">
                      ${title.lead} <span style="color:#1222fe;">${title.highlight}</span>
                    </h1>
                    <p style="margin:8px 0 0 0; font-family:'Inter', sans-serif; font-size:16px; font-weight:400; color:#707070; line-height:1.5;">
                      ${subtitle}
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding:18px 0 24px;">
                    <img src="${hero}" alt="Illustration" style="width:329px; height:auto; max-width:100%; display:block;" />
                  </td>
                </tr>
              </table>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0 0 12px 0; font-family:'Inter', sans-serif; font-size:16px; font-weight:400; color:#000000; line-height:1.5;">
                      Hi ${salutationName},
                    </p>
                    ${paragraphs
                      .map(
                        (text) =>
                          `<p style="margin:0 0 12px 0; font-family:'Inter', sans-serif; font-size:16px; font-weight:400; color:#595959; line-height:1.6;">${text}</p>`,
                      )
                      .join('')}
                  </td>
                </tr>
              </table>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding:12px 0 24px;">
                    <a href="${cta.url}" style="display:inline-block; background-color:${ctaColor}; color:#ffffff; text-decoration:none; padding:12px 140px; border-radius:8px; font-family:'Inter', sans-serif; font-size:14px; font-weight:600; line-height:20px;">
                      ${cta.label}
                    </a>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:10px;">
                    <p style="margin:0; font-family:'Inter', sans-serif; font-size:15px; font-weight:400; color:#595959; line-height:1.5;">
                      ${copyInstruction || 'Or, copy and paste this link into your browser'}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="100%" style="background-color:#f5f5f5; border:1px solid #ececec; border-radius:6px; padding:8px 12px;">
                          <p style="margin:0; font-family:'Inter', sans-serif; font-size:13px; font-weight:400; color:#242424; line-height:20px; word-break:break-all;">
                            ${cta.url}
                          </p>
                        </td>
                        <td style="padding-left:10px; white-space:nowrap;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="background-color:#ffffff; border:1px solid #d1d1d1; border-radius:8px; padding:6px; display:inline-block;">
                                <img src="${copyIcon}" alt="Copy" style="width:20px; height:20px; display:block;" />
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:#ffe6d8; border-radius:10px; padding:26px 32px; margin-top:24px;">
              <p style="margin:0; font-family:'Inter', sans-serif; font-size:15px; font-weight:400; color:#8a3707; line-height:1.6;">
                ${expiryNotice ||
                  'Important notice: This link will expire soon. If you did not request this, you can safely ignore this email.'}
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:10px;">
                    <p style="margin:0; font-family:'Inter', sans-serif; font-size:13px; font-weight:400; color:#595959; line-height:1.5;">
                      © ${new Date().getFullYear()} iCaptur. All rights reserved.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-right:4px;">
                          <p style="margin:0; font-family:'Segoe UI', sans-serif; font-size:12.5px; font-weight:400; color:#9d9d9d; line-height:17.5px;">
                            Powered by
                          </p>
                        </td>
                        <td>
                          <img src="${itechLogo}" alt="iTech" style="height:20px; width:auto; display:block;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function buildTextVersion({
  salutationName,
  title,
  subtitle,
  paragraphs,
  cta,
  expiryNotice,
}: BaseEmailContent): string {
  const body = paragraphs.join('\n\n');
  return `
${title.lead} ${title.highlight}

${subtitle}

Hi ${salutationName},

${body}

${cta.label}: ${cta.url}

${expiryNotice ||
    'Important notice: This link will expire soon. If you did not request this, you can safely ignore this email.'}

© ${new Date().getFullYear()} iCaptur. All rights reserved.
Powered by iTech
  `.trim();
}

/**
 * Invitation email (Figma matched)
 */
export function getUserInvitationEmailTemplate(
  data: UserInvitationEmailData,
): string {
  const { firstName, activationUrl, organizationName, inviterName, productName } =
    data;

  const invitationText = inviterName
    ? `${inviterName} has invited you to access ${productName || organizationName}`
    : `You have been invited to access ${productName || organizationName}`;

  const bodyText = productName
    ? `You've been invited to join ${productName}, your organization's AI-powered workspace on the iCaptur Experience Platform.`
    : `You've been invited to join ${organizationName} on the iCaptur Experience Platform.`;

  const benefitsText = productName
    ? `With ${productName}, you can streamline your workflow, automate processes, and collaborate seamlessly with your team - everything in one secure, unified environment.`
    : `You can streamline your workflow, automate processes, and collaborate seamlessly with your team - everything in one secure, unified environment.`;

  return buildEmailTemplate({
    salutationName: firstName,
    title: { lead: 'You have been', highlight: 'invited!' },
    subtitle: `Join ${productName || organizationName} on the iCaptur Platform`,
    paragraphs: [invitationText, bodyText, benefitsText],
    cta: { label: 'Create Your Account', url: activationUrl, color: 'primary' },
    copyInstruction: 'Or, copy and paste this link into your browser',
    expiryNotice:
      'Important notice: This email link will expire in 7 days. If you did not expect this invitation, you can safely ignore this email.',
  });
}

export function getUserInvitationEmailText(
  data: UserInvitationEmailData,
): string {
  const { firstName, activationUrl, organizationName, inviterName, productName } =
    data;

  const invitationText = inviterName
    ? `${inviterName} has invited you to access ${productName || organizationName}`
    : `You have been invited to access ${productName || organizationName}`;

  const bodyText = productName
    ? `You've been invited to join ${productName}, your organization's AI-powered workspace on the iCaptur Experience Platform.`
    : `You've been invited to join ${organizationName} on the iCaptur Experience Platform.`;

  const benefitsText = productName
    ? `With ${productName}, you can streamline your workflow, automate processes, and collaborate seamlessly with your team - everything in one secure, unified environment.`
    : `You can streamline your workflow, automate processes, and collaborate seamlessly with your team - everything in one secure, unified environment.`;

  return buildTextVersion({
    salutationName: firstName,
    title: { lead: 'You have been', highlight: 'invited!' },
    subtitle: `Join ${productName || organizationName} on the iCaptur Platform`,
    paragraphs: [invitationText, bodyText, benefitsText],
    cta: { label: 'Create Your Account', url: activationUrl, color: 'primary' },
    expiryNotice:
      'Important notice: This email link will expire in 7 days. If you did not expect this invitation, you can safely ignore this email.',
  });
}

/**
 * Forgot password email (same template)
 */
export function getForgotPasswordEmailTemplate(
  data: ForgotPasswordEmailData,
): string {
  return buildEmailTemplate({
    salutationName: data.firstName,
    title: { lead: 'Reset your', highlight: 'password' },
    subtitle: 'Securely continue to your iCaptur account',
    paragraphs: [
      'We received a request to reset your password.',
      'Click the button below to set a new password. If you did not make this request, you can safely ignore this email.',
    ],
    cta: { label: 'Reset Password', url: data.resetUrl, color: 'primary' },
    copyInstruction: 'Or, copy and paste this reset link into your browser',
    expiryNotice:
      'Important notice: This reset link will expire in 30 minutes for security.',
  });
}

export function getForgotPasswordEmailText(
  data: ForgotPasswordEmailData,
): string {
  return buildTextVersion({
    salutationName: data.firstName,
    title: { lead: 'Reset your', highlight: 'password' },
    subtitle: 'Securely continue to your iCaptur account',
    paragraphs: [
      'We received a request to reset your password.',
      'Click the button below to set a new password. If you did not make this request, you can safely ignore this email.',
    ],
    cta: { label: 'Reset Password', url: data.resetUrl, color: 'primary' },
    expiryNotice:
      'Important notice: This reset link will expire in 30 minutes for security.',
  });
}

/**
 * Change password email (same template)
 */
export function getChangePasswordEmailTemplate(
  data: ChangePasswordEmailData,
): string {
  return buildEmailTemplate({
    salutationName: data.firstName,
    title: { lead: 'Change your', highlight: 'password' },
    subtitle: 'Keep your iCaptur account secure',
    paragraphs: [
      'You requested to change your account password.',
      'Use the secure link below to update your credentials and keep your account protected.',
    ],
    cta: { label: 'Change Password', url: data.changeUrl, color: 'primary' },
    copyInstruction: 'Or, copy and paste this change password link into your browser',
    expiryNotice:
      'Important notice: This change link will expire in 30 minutes for security.',
  });
}

export function getChangePasswordEmailText(
  data: ChangePasswordEmailData,
): string {
  return buildTextVersion({
    salutationName: data.firstName,
    title: { lead: 'Change your', highlight: 'password' },
    subtitle: 'Keep your iCaptur account secure',
    paragraphs: [
      'You requested to change your account password.',
      'Use the secure link below to update your credentials and keep your account protected.',
    ],
    cta: { label: 'Change Password', url: data.changeUrl, color: 'primary' },
    expiryNotice:
      'Important notice: This change link will expire in 30 minutes for security.',
  });
}

/**
 * Welcome email (same template)
 */
export function getWelcomeEmailTemplate(data: WelcomeEmailData): string {
  const orgName = data.organizationName || 'iCaptur';
  return buildEmailTemplate({
    salutationName: data.firstName,
    title: { lead: 'Welcome to', highlight: 'iCaptur!' },
    subtitle: `You are all set to get started with ${orgName}`,
    paragraphs: [
      `We're excited to have you at ${orgName}.`,
      'Launch your workspace, explore dashboards, and collaborate with your team securely.',
    ],
    cta: { label: 'Go to Dashboard', url: data.getStartedUrl, color: 'primary' },
    copyInstruction: 'Or, copy and paste this link into your browser',
    expiryNotice:
      'If you did not create this account, please ignore this email.',
  });
}

export function getWelcomeEmailText(data: WelcomeEmailData): string {
  const orgName = data.organizationName || 'iCaptur';
  return buildTextVersion({
    salutationName: data.firstName,
    title: { lead: 'Welcome to', highlight: 'iCaptur!' },
    subtitle: `You are all set to get started with ${orgName}`,
    paragraphs: [
      `We're excited to have you at ${orgName}.`,
      'Launch your workspace, explore dashboards, and collaborate with your team securely.',
    ],
    cta: { label: 'Go to Dashboard', url: data.getStartedUrl, color: 'primary' },
    expiryNotice:
      'If you did not create this account, please ignore this email.',
  });
}


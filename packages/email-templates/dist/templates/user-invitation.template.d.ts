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
/**
 * Invitation email (Figma matched)
 */
export declare function getUserInvitationEmailTemplate(data: UserInvitationEmailData): string;
export declare function getUserInvitationEmailText(data: UserInvitationEmailData): string;
/**
 * Forgot password email (same template)
 */
export declare function getForgotPasswordEmailTemplate(data: ForgotPasswordEmailData): string;
export declare function getForgotPasswordEmailText(data: ForgotPasswordEmailData): string;
/**
 * Change password email (same template)
 */
export declare function getChangePasswordEmailTemplate(data: ChangePasswordEmailData): string;
export declare function getChangePasswordEmailText(data: ChangePasswordEmailData): string;
/**
 * Welcome email (same template)
 */
export declare function getWelcomeEmailTemplate(data: WelcomeEmailData): string;
export declare function getWelcomeEmailText(data: WelcomeEmailData): string;

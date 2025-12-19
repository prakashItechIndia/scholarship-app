export declare const tenantRelations: import("drizzle-orm").Relations<"tenant", {
    users: import("drizzle-orm").Many<"user_account">;
    subscriptions: import("drizzle-orm").Many<"tenant_product_subscriptions">;
    auditEvents: import("drizzle-orm").Many<"audit_event">;
    billingAddressDetails: import("drizzle-orm").One<"billing_address_details", true>;
    logoFile: import("drizzle-orm").One<"files", false>;
    invoices: import("drizzle-orm").Many<"invoice">;
    paymentTransactions: import("drizzle-orm").Many<"payment_transaction">;
}>;
export declare const roleRelations: import("drizzle-orm").Relations<"role", {
    users: import("drizzle-orm").Many<"user_account">;
    productRoles: import("drizzle-orm").Many<"product_roles">;
}>;
export declare const userAccountRelations: import("drizzle-orm").Relations<"user_account", {
    tenant: import("drizzle-orm").One<"tenant", false>;
    roleRef: import("drizzle-orm").One<"role", false>;
    profileFile: import("drizzle-orm").One<"files", false>;
    passwordResetTokens: import("drizzle-orm").Many<"password_reset_token">;
    refreshTokens: import("drizzle-orm").Many<"refresh_token">;
    productPermissions: import("drizzle-orm").Many<"user_product_permissions">;
    auditEvents: import("drizzle-orm").Many<"audit_event">;
    authorizationCodes: import("drizzle-orm").Many<"authorization_codes">;
    mfaConfig: import("drizzle-orm").One<"user_mfa_config", true>;
    mfaVerificationSessions: import("drizzle-orm").Many<"mfa_verification_sessions">;
    mfaAuditLogs: import("drizzle-orm").Many<"mfa_audit_log">;
    ssoSessions: import("drizzle-orm").Many<"sso_sessions">;
    notificationPreferences: import("drizzle-orm").One<"user_notification_preferences", true>;
}>;
export declare const productsRelations: import("drizzle-orm").Relations<"products", {
    subscriptions: import("drizzle-orm").Many<"tenant_product_subscriptions">;
    userPermissions: import("drizzle-orm").Many<"user_product_permissions">;
    roles: import("drizzle-orm").Many<"product_roles">;
    plans: import("drizzle-orm").Many<"product_plans">;
    logoFile: import("drizzle-orm").One<"files", false>;
}>;
export declare const productRoleRelations: import("drizzle-orm").Relations<"product_roles", {
    product: import("drizzle-orm").One<"products", true>;
}>;
export declare const productPlansRelations: import("drizzle-orm").Relations<"product_plans", {
    product: import("drizzle-orm").One<"products", true>;
}>;
export declare const productRedirectUrisRelations: import("drizzle-orm").Relations<"product_redirect_uris", {
    product: import("drizzle-orm").One<"products", true>;
}>;
export declare const tenantProductSubscriptionsRelations: import("drizzle-orm").Relations<"tenant_product_subscriptions", {
    tenant: import("drizzle-orm").One<"tenant", true>;
    product: import("drizzle-orm").One<"products", true>;
    entitlements: import("drizzle-orm").Many<"product_entitlements">;
}>;
export declare const productEntitlementsRelations: import("drizzle-orm").Relations<"product_entitlements", {
    subscription: import("drizzle-orm").One<"tenant_product_subscriptions", true>;
}>;
export declare const userProductPermissionsRelations: import("drizzle-orm").Relations<"user_product_permissions", {
    user: import("drizzle-orm").One<"user_account", true>;
    product: import("drizzle-orm").One<"products", true>;
}>;
export declare const passwordResetTokenRelations: import("drizzle-orm").Relations<"password_reset_token", {
    user: import("drizzle-orm").One<"user_account", true>;
}>;
export declare const refreshTokenRelations: import("drizzle-orm").Relations<"refresh_token", {
    user: import("drizzle-orm").One<"user_account", true>;
    replacedBy: import("drizzle-orm").One<"refresh_token", false>;
}>;
export declare const auditEventRelations: import("drizzle-orm").Relations<"audit_event", {
    tenant: import("drizzle-orm").One<"tenant", false>;
    actorUser: import("drizzle-orm").One<"user_account", false>;
}>;
export declare const filesRelations: import("drizzle-orm").Relations<"files", {
    owner: import("drizzle-orm").One<"user_account", false>;
}>;
export declare const authorizationCodeRelations: import("drizzle-orm").Relations<"authorization_codes", {
    user: import("drizzle-orm").One<"user_account", true>;
}>;
export declare const userMfaConfigRelations: import("drizzle-orm").Relations<"user_mfa_config", {
    user: import("drizzle-orm").One<"user_account", true>;
}>;
export declare const mfaVerificationSessionRelations: import("drizzle-orm").Relations<"mfa_verification_sessions", {
    user: import("drizzle-orm").One<"user_account", true>;
}>;
export declare const mfaAuditLogRelations: import("drizzle-orm").Relations<"mfa_audit_log", {
    user: import("drizzle-orm").One<"user_account", true>;
}>;
export declare const ssoSessionsRelations: import("drizzle-orm").Relations<"sso_sessions", {
    user: import("drizzle-orm").One<"user_account", true>;
    productSessions: import("drizzle-orm").Many<"product_sessions">;
}>;
export declare const productSessionsRelations: import("drizzle-orm").Relations<"product_sessions", {
    session: import("drizzle-orm").One<"sso_sessions", true>;
}>;
export declare const countryRelations: import("drizzle-orm").Relations<"country", {
    states: import("drizzle-orm").Many<"state">;
}>;
export declare const stateRelations: import("drizzle-orm").Relations<"state", {
    country: import("drizzle-orm").One<"country", true>;
}>;
export declare const billingAddressDetailsRelations: import("drizzle-orm").Relations<"billing_address_details", {
    tenant: import("drizzle-orm").One<"tenant", true>;
}>;
export declare const invoiceRelations: import("drizzle-orm").Relations<"invoice", {
    tenant: import("drizzle-orm").One<"tenant", true>;
}>;
export declare const paymentTransactionRelations: import("drizzle-orm").Relations<"payment_transaction", {
    tenant: import("drizzle-orm").One<"tenant", true>;
}>;
export declare const userNotificationPreferencesRelations: import("drizzle-orm").Relations<"user_notification_preferences", {
    user: import("drizzle-orm").One<"user_account", true>;
}>;

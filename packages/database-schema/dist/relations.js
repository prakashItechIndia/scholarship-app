"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userNotificationPreferencesRelations = exports.paymentTransactionRelations = exports.invoiceRelations = exports.billingAddressDetailsRelations = exports.stateRelations = exports.countryRelations = exports.productSessionsRelations = exports.ssoSessionsRelations = exports.mfaAuditLogRelations = exports.mfaVerificationSessionRelations = exports.userMfaConfigRelations = exports.authorizationCodeRelations = exports.filesRelations = exports.auditEventRelations = exports.refreshTokenRelations = exports.passwordResetTokenRelations = exports.userProductPermissionsRelations = exports.productEntitlementsRelations = exports.tenantProductSubscriptionsRelations = exports.productRedirectUrisRelations = exports.productPlansRelations = exports.productRoleRelations = exports.productsRelations = exports.userAccountRelations = exports.roleRelations = exports.tenantRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const tenant_1 = require("./tenant");
const role_1 = require("./role");
const user_account_1 = require("./user-account");
const products_1 = require("./products");
const product_plans_1 = require("./product-plans");
const product_role_1 = require("./product-role");
const tenant_product_subscriptions_1 = require("./tenant-product-subscriptions");
const product_entitlements_1 = require("./product-entitlements");
const user_product_permissions_1 = require("./user-product-permissions");
const password_reset_token_1 = require("./password-reset-token");
const refresh_token_1 = require("./refresh-token");
const audit_event_1 = require("./audit-event");
const file_1 = require("./file");
const authorization_codes_1 = require("./authorization-codes");
const mfa_1 = require("./mfa");
const sso_sessions_1 = require("./sso-sessions");
const country_1 = require("./country");
const state_1 = require("./state");
const billing_address_details_1 = require("./billing-address-details");
const invoice_1 = require("./invoice");
const payment_transaction_1 = require("./payment-transaction");
const user_notification_preferences_1 = require("./user-notification-preferences");
// Tenant relations
exports.tenantRelations = (0, drizzle_orm_1.relations)(tenant_1.tenant, ({ many, one }) => ({
    users: many(user_account_1.userAccount),
    subscriptions: many(tenant_product_subscriptions_1.tenantProductSubscriptions),
    auditEvents: many(audit_event_1.auditEvent),
    billingAddressDetails: one(billing_address_details_1.billingAddressDetails, {
        fields: [tenant_1.tenant.id],
        references: [billing_address_details_1.billingAddressDetails.tenantId],
    }),
    logoFile: one(file_1.file, {
        fields: [tenant_1.tenant.logoFileId],
        references: [file_1.file.id],
    }),
    invoices: many(invoice_1.invoice),
    paymentTransactions: many(payment_transaction_1.paymentTransaction),
}));
// Role relations
exports.roleRelations = (0, drizzle_orm_1.relations)(role_1.role, ({ many }) => ({
    users: many(user_account_1.userAccount),
    productRoles: many(product_role_1.productRole),
}));
// User Account relations
exports.userAccountRelations = (0, drizzle_orm_1.relations)(user_account_1.userAccount, ({ one, many }) => ({
    tenant: one(tenant_1.tenant, {
        fields: [user_account_1.userAccount.tenantId],
        references: [tenant_1.tenant.id],
    }),
    roleRef: one(role_1.role, {
        fields: [user_account_1.userAccount.roleId],
        references: [role_1.role.id],
    }),
    profileFile: one(file_1.file, {
        fields: [user_account_1.userAccount.fileId],
        references: [file_1.file.id],
    }),
    passwordResetTokens: many(password_reset_token_1.passwordResetToken),
    refreshTokens: many(refresh_token_1.refreshToken),
    productPermissions: many(user_product_permissions_1.userProductPermissions),
    auditEvents: many(audit_event_1.auditEvent),
    authorizationCodes: many(authorization_codes_1.authorizationCodes),
    mfaConfig: one(mfa_1.userMfaConfig, {
        fields: [user_account_1.userAccount.id],
        references: [mfa_1.userMfaConfig.userId],
    }),
    mfaVerificationSessions: many(mfa_1.mfaVerificationSessions),
    mfaAuditLogs: many(mfa_1.mfaAuditLog),
    ssoSessions: many(sso_sessions_1.ssoSessions),
    notificationPreferences: one(user_notification_preferences_1.userNotificationPreferences, {
        fields: [user_account_1.userAccount.id],
        references: [user_notification_preferences_1.userNotificationPreferences.userId],
    }),
}));
// Products relations
exports.productsRelations = (0, drizzle_orm_1.relations)(products_1.products, ({ many, one }) => ({
    subscriptions: many(tenant_product_subscriptions_1.tenantProductSubscriptions),
    userPermissions: many(user_product_permissions_1.userProductPermissions),
    roles: many(product_role_1.productRole),
    plans: many(product_plans_1.productPlans),
    logoFile: one(file_1.file, {
        fields: [products_1.products.logoFileId],
        references: [file_1.file.id],
    }),
}));
exports.productRoleRelations = (0, drizzle_orm_1.relations)(product_role_1.productRole, ({ one }) => ({
    product: one(products_1.products, {
        fields: [product_role_1.productRole.productId],
        references: [products_1.products.id],
    }),
}));
// Product Plans relations
exports.productPlansRelations = (0, drizzle_orm_1.relations)(product_plans_1.productPlans, ({ one }) => ({
    product: one(products_1.products, {
        fields: [product_plans_1.productPlans.productId],
        references: [products_1.products.id],
    }),
}));
exports.productRedirectUrisRelations = (0, drizzle_orm_1.relations)(authorization_codes_1.productRedirectUris, ({ one }) => ({
    product: one(products_1.products, {
        fields: [authorization_codes_1.productRedirectUris.productId],
        references: [products_1.products.id],
    }),
}));
// Tenant Product Subscriptions relations
exports.tenantProductSubscriptionsRelations = (0, drizzle_orm_1.relations)(tenant_product_subscriptions_1.tenantProductSubscriptions, ({ one, many }) => ({
    tenant: one(tenant_1.tenant, {
        fields: [tenant_product_subscriptions_1.tenantProductSubscriptions.tenantId],
        references: [tenant_1.tenant.id],
    }),
    product: one(products_1.products, {
        fields: [tenant_product_subscriptions_1.tenantProductSubscriptions.productId],
        references: [products_1.products.id],
    }),
    entitlements: many(product_entitlements_1.productEntitlements),
}));
// Product Entitlements relations
exports.productEntitlementsRelations = (0, drizzle_orm_1.relations)(product_entitlements_1.productEntitlements, ({ one }) => ({
    subscription: one(tenant_product_subscriptions_1.tenantProductSubscriptions, {
        fields: [product_entitlements_1.productEntitlements.subscriptionId],
        references: [tenant_product_subscriptions_1.tenantProductSubscriptions.id],
    }),
}));
// User Product Permissions relations
exports.userProductPermissionsRelations = (0, drizzle_orm_1.relations)(user_product_permissions_1.userProductPermissions, ({ one }) => ({
    user: one(user_account_1.userAccount, {
        fields: [user_product_permissions_1.userProductPermissions.userId],
        references: [user_account_1.userAccount.id],
    }),
    product: one(products_1.products, {
        fields: [user_product_permissions_1.userProductPermissions.productId],
        references: [products_1.products.id],
    }),
}));
// Password Reset Token relations
exports.passwordResetTokenRelations = (0, drizzle_orm_1.relations)(password_reset_token_1.passwordResetToken, ({ one }) => ({
    user: one(user_account_1.userAccount, {
        fields: [password_reset_token_1.passwordResetToken.userId],
        references: [user_account_1.userAccount.id],
        relationName: 'passwordResetTokens',
    }),
}));
// Refresh Token relations
exports.refreshTokenRelations = (0, drizzle_orm_1.relations)(refresh_token_1.refreshToken, ({ one }) => ({
    user: one(user_account_1.userAccount, {
        fields: [refresh_token_1.refreshToken.userId],
        references: [user_account_1.userAccount.id],
        relationName: 'refreshTokens',
    }),
    replacedBy: one(refresh_token_1.refreshToken, {
        fields: [refresh_token_1.refreshToken.replacedByTokenId],
        references: [refresh_token_1.refreshToken.id],
        relationName: 'replacedBy',
    }),
}));
// Audit Event relations
exports.auditEventRelations = (0, drizzle_orm_1.relations)(audit_event_1.auditEvent, ({ one }) => ({
    tenant: one(tenant_1.tenant, {
        fields: [audit_event_1.auditEvent.tenantId],
        references: [tenant_1.tenant.id],
    }),
    actorUser: one(user_account_1.userAccount, {
        fields: [audit_event_1.auditEvent.actorUserId],
        references: [user_account_1.userAccount.id],
    }),
}));
exports.filesRelations = (0, drizzle_orm_1.relations)(file_1.file, ({ one }) => ({
    owner: one(user_account_1.userAccount, {
        fields: [file_1.file.ownerUserId],
        references: [user_account_1.userAccount.id],
    }),
}));
exports.authorizationCodeRelations = (0, drizzle_orm_1.relations)(authorization_codes_1.authorizationCodes, ({ one }) => ({
    user: one(user_account_1.userAccount, {
        fields: [authorization_codes_1.authorizationCodes.userId],
        references: [user_account_1.userAccount.id],
    }),
}));
exports.userMfaConfigRelations = (0, drizzle_orm_1.relations)(mfa_1.userMfaConfig, ({ one }) => ({
    user: one(user_account_1.userAccount, {
        fields: [mfa_1.userMfaConfig.userId],
        references: [user_account_1.userAccount.id],
    }),
}));
exports.mfaVerificationSessionRelations = (0, drizzle_orm_1.relations)(mfa_1.mfaVerificationSessions, ({ one }) => ({
    user: one(user_account_1.userAccount, {
        fields: [mfa_1.mfaVerificationSessions.userId],
        references: [user_account_1.userAccount.id],
    }),
}));
exports.mfaAuditLogRelations = (0, drizzle_orm_1.relations)(mfa_1.mfaAuditLog, ({ one }) => ({
    user: one(user_account_1.userAccount, {
        fields: [mfa_1.mfaAuditLog.userId],
        references: [user_account_1.userAccount.id],
    }),
}));
exports.ssoSessionsRelations = (0, drizzle_orm_1.relations)(sso_sessions_1.ssoSessions, ({ one, many }) => ({
    user: one(user_account_1.userAccount, {
        fields: [sso_sessions_1.ssoSessions.userId],
        references: [user_account_1.userAccount.id],
    }),
    productSessions: many(sso_sessions_1.productSessions),
}));
exports.productSessionsRelations = (0, drizzle_orm_1.relations)(sso_sessions_1.productSessions, ({ one }) => ({
    session: one(sso_sessions_1.ssoSessions, {
        fields: [sso_sessions_1.productSessions.ssoSessionId],
        references: [sso_sessions_1.ssoSessions.id],
    }),
}));
// Country relations
exports.countryRelations = (0, drizzle_orm_1.relations)(country_1.country, ({ many }) => ({
    states: many(state_1.state),
}));
// State relations
exports.stateRelations = (0, drizzle_orm_1.relations)(state_1.state, ({ one }) => ({
    country: one(country_1.country, {
        fields: [state_1.state.countryId],
        references: [country_1.country.id],
    }),
}));
// Billing Address Details relations
exports.billingAddressDetailsRelations = (0, drizzle_orm_1.relations)(billing_address_details_1.billingAddressDetails, ({ one }) => ({
    tenant: one(tenant_1.tenant, {
        fields: [billing_address_details_1.billingAddressDetails.tenantId],
        references: [tenant_1.tenant.id],
    }),
}));
// Invoice relations
exports.invoiceRelations = (0, drizzle_orm_1.relations)(invoice_1.invoice, ({ one }) => ({
    tenant: one(tenant_1.tenant, {
        fields: [invoice_1.invoice.tenantId],
        references: [tenant_1.tenant.id],
    }),
}));
// Payment Transaction relations
exports.paymentTransactionRelations = (0, drizzle_orm_1.relations)(payment_transaction_1.paymentTransaction, ({ one }) => ({
    tenant: one(tenant_1.tenant, {
        fields: [payment_transaction_1.paymentTransaction.tenantId],
        references: [tenant_1.tenant.id],
    }),
}));
// User Notification Preferences relations
exports.userNotificationPreferencesRelations = (0, drizzle_orm_1.relations)(user_notification_preferences_1.userNotificationPreferences, ({ one }) => ({
    user: one(user_account_1.userAccount, {
        fields: [user_notification_preferences_1.userNotificationPreferences.userId],
        references: [user_account_1.userAccount.id],
    }),
}));

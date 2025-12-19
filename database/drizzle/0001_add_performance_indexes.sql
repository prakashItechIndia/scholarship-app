-- Performance optimization indexes
-- These indexes improve query performance for frequently accessed columns

-- User account lookups
CREATE INDEX IF NOT EXISTS idx_user_account_email ON user_account(email);
CREATE INDEX IF NOT EXISTS idx_user_account_tenant_id ON user_account(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_account_status ON user_account(status);
CREATE INDEX IF NOT EXISTS idx_user_account_role_id ON user_account(role_id);
CREATE INDEX IF NOT EXISTS idx_user_account_cognito_sub ON user_account(cognito_sub) WHERE cognito_sub IS NOT NULL;

-- Refresh token lookups (critical for token validation)
CREATE INDEX IF NOT EXISTS idx_refresh_token_user_id ON refresh_token(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_token_expires_at ON refresh_token(expires_at);
CREATE INDEX IF NOT EXISTS idx_refresh_token_revoked_at ON refresh_token(revoked_at) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_refresh_token_user_expires ON refresh_token(user_id, expires_at) WHERE revoked_at IS NULL;

-- Authorization codes (OAuth2 flow)
CREATE INDEX IF NOT EXISTS idx_authorization_codes_user_id ON authorization_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_authorization_codes_expires_at ON authorization_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_authorization_codes_code ON authorization_codes(code);
CREATE INDEX IF NOT EXISTS idx_authorization_codes_user_expires ON authorization_codes(user_id, expires_at) WHERE used_at IS NULL;

-- SSO sessions (session management)
CREATE INDEX IF NOT EXISTS idx_sso_sessions_user_id ON sso_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sso_sessions_expires_at ON sso_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sso_sessions_is_active ON sso_sessions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_sso_sessions_user_active ON sso_sessions(user_id, is_active) WHERE is_active = true;

-- Product subscriptions (billing queries)
CREATE INDEX IF NOT EXISTS idx_tenant_product_subscriptions_tenant_id ON tenant_product_subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_product_subscriptions_product_id ON tenant_product_subscriptions(product_id);
CREATE INDEX IF NOT EXISTS idx_tenant_product_subscriptions_status ON tenant_product_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_tenant_product_subscriptions_tenant_status ON tenant_product_subscriptions(tenant_id, status);

-- Product entitlements (feature checks)
CREATE INDEX IF NOT EXISTS idx_product_entitlements_subscription_id ON product_entitlements(subscription_id);
CREATE INDEX IF NOT EXISTS idx_product_entitlements_feature_code ON product_entitlements(feature_code);
CREATE INDEX IF NOT EXISTS idx_product_entitlements_subscription_feature ON product_entitlements(subscription_id, feature_code);

-- User product permissions (permission checks)
CREATE INDEX IF NOT EXISTS idx_user_product_permissions_user_id ON user_product_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_product_permissions_product_id ON user_product_permissions(product_id);
CREATE INDEX IF NOT EXISTS idx_user_product_permissions_user_product ON user_product_permissions(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_user_product_permissions_feature ON user_product_permissions(user_id, product_id, feature_code);

-- Password reset tokens
CREATE INDEX IF NOT EXISTS idx_password_reset_token_user_id ON password_reset_token(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_token_expires_at ON password_reset_token(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_token_used_at ON password_reset_token(used_at) WHERE used_at IS NULL;

-- Product sessions (OAuth2 session tracking)
CREATE INDEX IF NOT EXISTS idx_product_sessions_sso_session_id ON product_sessions(sso_session_id);
CREATE INDEX IF NOT EXISTS idx_product_sessions_product_code ON product_sessions(product_code);
CREATE INDEX IF NOT EXISTS idx_product_sessions_is_active ON product_sessions(is_active) WHERE is_active = true;

-- Audit events (for analytics and debugging)
CREATE INDEX IF NOT EXISTS idx_audit_event_tenant_id ON audit_event(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_event_actor_user_id ON audit_event(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_event_event_type ON audit_event(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_event_created_at ON audit_event(created_at DESC);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_user_account_tenant_status ON user_account(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_tenant_product_subscriptions_tenant_product_status ON tenant_product_subscriptions(tenant_id, product_id, status);


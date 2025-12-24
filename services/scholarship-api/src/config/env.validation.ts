import { z } from 'zod';

const portSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return 3000;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}, z.number().int().positive());

// GLOBAL_PREFIX defaults to 'api' unless explicitly set
const globalPrefixSchema = z.preprocess((value) => {
  if (typeof value === 'string') {
    return value;
  }
  return 'api'; // Default prefix
}, z.string());

const urlOrEmpty = z.union([z.string().url(), z.literal('')]);

const smtpPortSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}, z.number().int().positive().optional());

const smtpSecureSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return false;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return lower === 'true' || lower === '1' || lower === 'yes';
  }

  return false;
}, z.boolean().optional().default(false));

const authCodeExpirySchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return 30; // Default 30 seconds (OAuth2 RFC recommendation)
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? 30 : parsed;
  }

  return 30;
}, z.number().int().positive());

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production', 'staging'])
    .default('development'),
  SSO_PORT: portSchema,
  PORT: portSchema.optional(),
  GLOBAL_PREFIX: globalPrefixSchema,
  EXPERIENCE_API_URL: z.string().url().optional(),
  SSO_API_URL: z.string().url().optional(),
  DB_HOST: z.string().optional(),
  DB_PORT: z.string().optional().default('1433'),
  DB_DATABASE: z.string().optional(),
  DB_USERNAME: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_ENCRYPT: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return true;
      const lower = value.toLowerCase();
      return lower === 'true' || lower === '1' || lower === 'yes';
    })
    .pipe(z.boolean().optional().default(true)),
  DB_TRUST_CERT: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return false;
      const lower = value.toLowerCase();
      return lower === 'true' || lower === '1' || lower === 'yes';
    })
    .pipe(z.boolean().optional().default(false)),
  DB_REQUEST_TIMEOUT_MS: z
    .string()
    .optional()
    .transform((value) => (value ? Number.parseInt(value, 10) : 30000))
    .pipe(z.number().int().positive().default(30000)),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .optional()
    .default('info'),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters')
    .optional(),
  JWT_EXPIRES_IN: z.string().default('1h'),
  SSO_ISSUER: urlOrEmpty.default(''),
  // SMTP Configuration (AWS SES)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: smtpPortSchema,
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  SMTP_SECURE: smtpSecureSchema,
  SSO_APP_URL: urlOrEmpty.optional().default(''),
  EXPERIENCE_APP_URL: urlOrEmpty.optional().default(''),
  CUSTOMER_PORTAL_URL: urlOrEmpty.optional().default(''),
  IREPO_URL: urlOrEmpty.optional().default(''),
  INVOX_URL: urlOrEmpty.optional().default(''),
  ACCOUNTS_URL: urlOrEmpty.optional().default(''),
  // OAuth2 Configuration
  AUTHORIZATION_CODE_EXPIRY_SECONDS: authCodeExpirySchema,
  // MFA Configuration
  MFA_ISSUER: z.string().default('iCaptur.AI'),
  // AWS Cognito Configuration (Production)
  AWS_COGNITO_USER_POOL_ID: z.string().optional(),
  AWS_COGNITO_CLIENT_ID: z.string().optional(),
  AWS_COGNITO_REGION: z.string().optional().default('us-east-1'),
  // AWS Configuration (for SNS SMS and other AWS services)
  AWS_REGION: z.string().optional().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  // Internal service-to-service auth
  SERVICE_API_TOKEN: z.string().min(16).optional(),
  REDIS_URL: z.string().url().optional(),
  COGNITO_BYPASS: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return false;
      const lower = value.toLowerCase();
      return lower === 'true' || lower === '1' || lower === 'yes';
    })
    .pipe(z.boolean().optional().default(false)),
  // Trial Configuration
  TRIAL_DAYS: z
    .string()
    .optional()
    .transform((value) => (value ? Number.parseInt(value, 10) : 7))
    .pipe(z.number().int().positive().default(7)),
  // Zoho Configuration (Billing & CRM) - India Region
  ZOHO_IN_CLIENT_ID: z.string().optional(),
  ZOHO_IN_CLIENT_SECRET: z.string().optional(),
  ZOHO_IN_WEBHOOK_SECRET: z.string().optional(),
  ZOHO_IN_REFRESH_TOKEN: z.string().optional(), // For Zoho Billing
  // Zoho Configuration (Billing & CRM) - International Region
  ZOHO_INTL_CLIENT_ID: z.string().optional(),
  ZOHO_INTL_CLIENT_SECRET: z.string().optional(),
  ZOHO_INTL_WEBHOOK_SECRET: z.string().optional(),
  ZOHO_INTL_REFRESH_TOKEN: z.string().optional(), // For Zoho Billing
  // Zoho CRM - Specific Refresh Tokens (uses same CLIENT_ID/SECRET as above)
  ZOHO_CRM_REFRESH_TOKEN_INDIA: z.string().optional(),
  ZOHO_CRM_REFRESH_TOKEN_INTL: z.string().optional(),
  // Firebase (backend) - used to sync user updates to Firebase Auth and Firestore
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_API_KEY: z
    .string()
    .optional()
    .describe('Firebase Web API Key for exchanging custom tokens for idTokens'),
  // Python API Configuration (for API AS A Service integration)
  PYTHON_API_BASE_URL: z
    .union([z.string().url(), z.literal('')])
    .optional()
    .default(''),
  PYTHON_API_TIMEOUT: z
    .string()
    .optional()
    .transform((value) => (value ? Number.parseInt(value, 10) : 30000))
    .pipe(z.number().int().positive().default(30000)),
  ENCRYPTION_KEY: z.string().optional().default(''),
  // Cookie and Security Configuration
  COOKIE_SECRET: z.string().optional(),
  // Rate Limiting Configuration
  RATE_LIMIT_MAX: z
    .string()
    .optional()
    .transform((value) => (value ? Number.parseInt(value, 10) : 1000))
    .pipe(z.number().int().positive().default(1000)),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .optional()
    .transform((value) => (value ? Number.parseInt(value, 10) : 60000))
    .pipe(z.number().int().positive().default(60000)),
  // CORS Configuration
  ALLOWED_ORIGINS: z.string().optional(),
  // Database Pool Configuration
  DB_POOL_MAX: z
    .string()
    .optional()
    .transform((value) => (value ? Number.parseInt(value, 10) : 20))
    .pipe(z.number().int().positive().default(20)),
  DB_POOL_MIN: z
    .string()
    .optional()
    .transform((value) => (value ? Number.parseInt(value, 10) : 2))
    .pipe(z.number().int().positive().default(2)),
  DB_POOL_IDLE_TIMEOUT_MS: z
    .string()
    .optional()
    .transform((value) => (value ? Number.parseInt(value, 10) : 30000))
    .pipe(z.number().int().positive().default(30000)),
  DB_POOL_CONNECTION_TIMEOUT_MS: z
    .string()
    .optional()
    .transform((value) => (value ? Number.parseInt(value, 10) : 5000))
    .pipe(z.number().int().positive().default(5000)),
  // S3 Configuration
  S3_PUBLIC_URL: z.string().url().optional(),
});

export type EnvVars = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>): EnvVars => {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const flattened = result.error.flatten();
    const fieldErrors = flattened.fieldErrors ?? {};

    const message = Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
      .join('; ');
    throw new Error(`Environment validation error(s): ${message}`);
  }

  return result.data;
};

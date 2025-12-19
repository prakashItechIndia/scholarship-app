// Type declarations for Node.js globals (drizzle-kit runs this in Node.js environment)
declare const require: {
  (id: string): unknown;
  resolve?: (id: string) => string | undefined;
};
declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

// Load dotenv only if available (for local development)
// In deployment, environment variables are set directly, so dotenv is not needed
// This is wrapped in try-catch to gracefully handle cases where dotenv is not installed
(function loadDotenv() {
  try {
    // Check if require is available (Node.js environment)
    if (typeof require === 'undefined') {
      return; // Not in Node.js environment, skip
    }

    // Try to load dotenv - will fail silently if not available
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    require('dotenv/config');
  } catch {
    // dotenv not available - this is expected in deployment
    // Environment variables should be set directly by the platform
    // No action needed - process.env will use variables from the environment
  }
})();

// Type declaration for drizzle-kit (installed in root package.json)
import type { Config } from 'drizzle-kit';

const buildUrlFromParts = () => {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT ?? '5432';
  const database = process.env.DB_DATABASE;
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD ?? '';

  if (!host || !database || !username) {
    return undefined;
  }

  const safeUser = encodeURIComponent(username);
  const safePass = encodeURIComponent(password);
  return `postgresql://${safeUser}:${safePass}@${host}:${port}/${database}`;
};

const databaseUrl = process.env.DATABASE_URL ?? buildUrlFromParts();

if (!databaseUrl) {
  throw new Error(
    'Provide DATABASE_URL or DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD',
  );
}

export default {
  dialect: 'postgresql',
  schema: './packages/database-schema/src/index.ts',
  out: './database/drizzle',
  casing: 'snake_case',
  dbCredentials: {
    url: databaseUrl,
  },
  migrations: {
    table: '__drizzle_migrations',
  },
} satisfies Config;

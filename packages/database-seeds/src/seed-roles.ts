/**
 * Script to seed roles table
 *
 * Usage:
 *   pnpm tsx src/seed-roles.ts
 *
 * Environment variables required:
 *   - DATABASE_URL
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { role } from '@icaptur/database-schema';

import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const rolesToSeed = [
  {
    code: 'product_admin',
    name: 'Product Admin',
    description:
      'Full platform access across all tenants. Can manage products, tenants, and system configuration.',
    isSystemRole: true,
    requiresTenant: false,
  },
  {
    code: 'org_admin',
    name: 'Organization Administrator',
    description:
      'Administrator for a company/tenant. Can manage users, subscriptions, billing, and use all product features their organization has purchased.',
    isSystemRole: true,
    requiresTenant: true,
  },
  {
    code: 'org_user',
    name: 'Organization User',
    description:
      'Regular employee of a company. Can use product features based on permissions granted by org_admin.',
    isSystemRole: true,
    requiresTenant: true,
  },
  {
    code: 'icaptur_support_admin',
    name: 'iCaptur Support Admin',
    description:
      'iTech support staff with access to customer data for support purposes. Can view and assist with customer issues.',
    isSystemRole: true,
    requiresTenant: false,
  },
  {
    code: 'icaptur_finance_admin',
    name: 'iCaptur Finance Admin',
    description:
      'iTech finance staff with access to billing and subscription data. Can manage billing, invoices, and financial operations.',
    isSystemRole: true,
    requiresTenant: false,
  },
  {
    code: 'icaptur_super_admin',
    name: 'iCaptur Super Admin',
    description:
      'Highest level iTech admin with full platform access. Can impersonate users, manage all tenants, and perform system-level operations.',
    isSystemRole: true,
    requiresTenant: false,
  },
];

async function seedRoles() {
  const buildDatabaseUrl = () => {
    if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT ?? '5432';
    const database = process.env.DB_DATABASE;
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD ?? '';

    if (!host || !database || !username) {
      throw new Error(
        'Provide DATABASE_URL or DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME (DB_PASSWORD optional)',
      );
    }

    const safeUser = encodeURIComponent(username);
    const safePass = encodeURIComponent(password);
    return `postgresql://${safeUser}:${safePass}@${host}:${port}/${database}`;
  };

  const pool = new Pool({ connectionString: buildDatabaseUrl() });
  const db = drizzle(pool);

  console.log('Seeding roles...\n');

  for (const roleData of rolesToSeed) {
    try {
      // Check if role already exists
      const [existingRole] = await db
        .select()
        .from(role)
        .where(eq(role.code, roleData.code))
        .limit(1);

      if (existingRole) {
        console.log(`⏭️  Role "${roleData.code}" already exists, skipping...`);
        continue;
      }

      await db.insert(role).values({
        code: roleData.code,
        name: roleData.name,
        description: roleData.description,
        isSystemRole: roleData.isSystemRole,
        requiresTenant: roleData.requiresTenant,
      });

      console.log(`✅ Seeded role: ${roleData.code} - ${roleData.name}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Error seeding role "${roleData.code}":`, errorMessage);
    }
  }

  console.log('\n✅ System roles seeding complete!');
  await pool.end();
}

seedRoles().catch((error) => {
  console.error('Error seeding roles:', error);
  process.exit(1);
});

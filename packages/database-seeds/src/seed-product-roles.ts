/**
 * Script to seed product-specific roles into Experience API database
 *
 * Usage:
 *   pnpm tsx src/seed-product-roles.ts
 *
 * Requires DATABASE_URL env var
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { products, productRole } from '@icaptur/database-schema';
import { and, eq } from 'drizzle-orm';

import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

type ModuleSeed = string;

type RoleSeed = {
  code: string;
  name: string;
  description?: string;
  modules: ModuleSeed[];
};

type ProductRoleSeed = {
  productCode: string;
  roles: RoleSeed[];
};

const productRolesToSeed: ProductRoleSeed[] = [
  {
    productCode: 'invox',
    roles: [
      {
        code: 'ORG_ADMIN',
        name: 'Organization Administrator',
        description:
          'iNVOX organization administrator with full access to product features and team management.',
        modules: [
          'DASHBOARD',
          'INVOICES',
          'CLARIFY',
          'LOGS',
          'HELPDESK',
          'SETTINGS',
        ],
      },
      {
        code: 'INDEXER',
        name: 'Indexer',
        description:
          'Indexes and classifies incoming documents for processing within iNVOX.',
        modules: ['DASHBOARD', 'INDEXER', 'HELPDESK'],
      },
      {
        code: 'VERIFIER',
        name: 'Verifier',
        description:
          'Reviews and verifies extracted data for accuracy within iNVOX.',
        modules: ['DASHBOARD', 'VERIFIER', 'HELPDESK'],
      },
      {
        code: 'CLARIFIER',
        name: 'Clarifier',
        description:
          'Handles clarifications and collaborates with vendors/internal teams within iNVOX.',
        modules: ['DASHBOARD', 'CLARIFIER', 'HELPDESK'],
      },
      {
        code: 'CLIENT',
        name: 'Client User',
        description:
          'Client-facing role with read-only visibility into their invoices and related data.',
        modules: ['DASHBOARD', 'CLIENT', 'HELPDESK'],
      },
    ],
  },
  {
    productCode: 'api_as_a_service',
    roles: [
      {
        code: 'PRODUCT_ADMIN',
        name: 'Product Administrator',
        description:
          'API AS A Service product administrator with full access to manage all organizations, users, and product features.',
        modules: ['DASHBOARD', 'USER_MANAGEMENT', 'ORGANISATIONS', 'SETTINGS'],
      },
      {
        code: 'ORG_ADMIN',
        name: 'Organization Administrator',
        description:
          'API AS A Service organization administrator with full access to product features, user management, and team management.',
        modules: [
          'DASHBOARD',
          'USER_MANAGEMENT',
          'SERVICES',
          'LOGS',
          'SETTINGS',
        ],
      },
      {
        code: 'ORG_USER',
        name: 'Organization User',
        description:
          'API AS A Service organization user with access to product features and services.',
        modules: ['DASHBOARD', 'SERVICES', 'SETTINGS'],
      },
    ],
  },
];

async function seedProductRoles() {
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

  console.log('Seeding product roles...\n');

  for (const productRolesConfig of productRolesToSeed) {
    const { productCode, roles: roleEntries } = productRolesConfig;

    const [productRecord] = await db
      .select({
        id: products.id,
        code: products.code,
      })
      .from(products)
      .where(eq(products.code, productCode))
      .limit(1);

    if (!productRecord) {
      console.warn(
        `⚠️  Product with code "${productCode}" not found. Skipping.`,
      );
      continue;
    }

    for (const entry of roleEntries) {
      try {
        const modulesToSet = entry.modules ?? [];
        const [existing] = await db
          .select()
          .from(productRole)
          .where(
            and(
              eq(productRole.productId, productRecord.id),
              eq(productRole.code, entry.code),
            ),
          )
          .limit(1);

        let roleRecord = existing;

        if (!roleRecord) {
          const [created] = await db
            .insert(productRole)
            .values({
              productId: productRecord.id,
              code: entry.code,
              name: entry.name,
              description: entry.description,
              modules: modulesToSet,
              isActive: true,
            })
            .returning();

          roleRecord = created;

          console.log(
            `✅ Seeded role "${entry.code}" for product "${productCode}"`,
          );
        } else {
          console.log(
            `⏭️  Role "${entry.code}" already exists for product "${productCode}", syncing permissions...`,
          );
        }

        if (!roleRecord) {
          console.warn(
            `⚠️  Unable to resolve role record for "${entry.code}". Skipping permission seeding.`,
          );
          continue;
        }

        // Sync module list JSON into the role record
        await db
          .update(productRole)
          .set({
            modules: modulesToSet,
          })
          .where(eq(productRole.id, roleRecord.id));

        console.log(
          `✅ Synced modules for role "${entry.code}" (${modulesToSet.length} entries)`,
        );
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        console.error(
          `❌ Error seeding role "${entry.code}" for product "${productCode}":`,
          message,
        );
      }
    }
  }

  console.log('\n✅ Product roles seeding complete!');
  await pool.end();
}

seedProductRoles().catch((error) => {
  console.error('Error seeding product roles:', error);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Script to truncate all tables in the database
 * This removes all data but keeps the table structure intact
 *
 * Usage: pnpm db:truncate
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
  console.error(
    '❌ Error: Provide DATABASE_URL or DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD',
  );
  process.exit(1);
}

async function truncateAllTables() {
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  try {
    console.log('🔌 Connecting to database...');

    // Tables that contain seed data and should be preserved
    // These are populated by seed scripts and should not be truncated
    const seedDataTables = [
      '__drizzle_migrations', // Migration tracking table
      'role', // System roles (seed-roles.ts)
      'product_role', // Product roles (seed-product-roles.ts)
      'products', // Products (referenced by seed-product-roles.ts)
      'zoho_billing_config', // Zoho configuration (seed-zoho-config.ts)
      'country', // Countries (seed-country-state.ts)
      'state', // States (seed-country-state.ts)
    ];

    // Get all table names (excluding seed data tables)
    // Build a parameterized query to exclude seed data tables
    const placeholders = seedDataTables.map((_, i) => `$${i + 1}`).join(', ');
    const result = await pool.query(
      `
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
        AND tablename NOT IN (${placeholders})
      ORDER BY tablename;
    `,
      seedDataTables,
    );

    const tables = result.rows.map((row) => row.tablename);

    if (tables.length === 0) {
      console.log('ℹ️  No tables found to truncate.');
      await pool.end();
      return;
    }

    console.log(`📋 Found ${tables.length} table(s) to truncate:`);
    tables.forEach((table) => console.log(`   - ${table}`));

    console.log(
      `\n🛡️  Preserving seed data tables (${seedDataTables.length}):`,
    );
    seedDataTables.forEach((table) => console.log(`   - ${table}`));

    // Disable foreign key checks temporarily by truncating with CASCADE
    // This will truncate all tables and their dependent tables
    console.log('\n🗑️  Truncating all tables...');

    // Build TRUNCATE command with CASCADE to handle foreign keys
    const truncateQuery = `TRUNCATE TABLE ${tables.map((t) => `"${t}"`).join(', ')} RESTART IDENTITY CASCADE;`;

    await pool.query(truncateQuery);

    console.log(`✅ Successfully truncated ${tables.length} table(s).`);
    console.log(
      'ℹ️  All data has been removed, but table structures are preserved.',
    );
    console.log('\n⚠️  IMPORTANT: After truncation, you may need to:');
    console.log('   1. Re-seed admin users: pnpm db:seed:admin-users');
    console.log('   2. Re-authenticate or re-create user accounts');
    console.log(
      '   3. User sessions with old user_ids will fail until users are recreated',
    );
  } catch (error) {
    console.error('❌ Error truncating tables:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
truncateAllTables().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

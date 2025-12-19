#!/usr/bin/env node
/**
 * OpenAPI Generator Script for Frontend
 * Generates TypeScript client code from OpenAPI/Swagger JSON specs
 * Cross-platform Node.js version (ES Module)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to check if API is reachable
function checkApiReachable(hostname, port) {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname,
        port,
        path: '/',
        method: 'HEAD',
        timeout: 3000,
      },
      () => {
        resolve(true);
      },
    );

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Read environment variable or use default
// Default to SSO if not specified
const targetKey =
  process.env.OPENAPI_SWAGGER_KEY || 'SWAGGER_JSON_DEV_ENDPOINT_SCHOLARSHIP';

// Read openapi.url.env file
const envFile = path.join(__dirname, 'openapi.url.env');
let swaggerJsonEndpoint = null;

if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf-8');
  const lines = envContent.split('\n');

  for (const line of lines) {
    // Skip comments and empty lines
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    // Match key=value or key="value" or key='value'
    const match = trimmedLine.match(new RegExp(`^${targetKey}\\s*=\\s*(.+)$`));
    if (match) {
      // Remove quotes if present and trim
      swaggerJsonEndpoint = match[1].trim().replace(/^["']|["']$/g, '');
      break;
    }
  }
}

if (!swaggerJsonEndpoint) {
  console.error(
    `❌ Unable to resolve an endpoint. Looked for key: ${targetKey}.`,
  );
  console.log('Available keys in openapi.url.env:');

  if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, 'utf-8');
    const keys = envContent
      .split('\n')
      .filter((line) => line.startsWith('SWAGGER_JSON_DEV_ENDPOINT'))
      .map((line) => line.split('=')[0])
      .filter(Boolean);

    keys.forEach((key) => console.log(`  ${key}`));
  } else {
    console.log('  (openapi.url.env not found)');
  }

  process.exit(1);
}

// Determine output directory and local JSON file path based on API type
let outputDir;
let localJsonFile = null;

if (targetKey.includes('SSO')) {
  outputDir = path.join(__dirname, 'src', '_api', 'sso');
  localJsonFile = path.join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'services',
    'sso-api',
    'openapi.json',
  );
  console.log('📦 Generating SSO API client...');
} else if (targetKey.includes('BILLING') || targetKey.includes('EXPERIENCE')) {
  // Experience/Billing API client generation has been removed.
  throw new Error(
    `Experience/Billing API client generation is no longer supported. Please use the SSO API client only.`,
  );
} else {
  outputDir = path.join(__dirname, 'src', '_api');
  console.log('📦 Generating API client...');
}

// Main generation function (wrapped in async to use await)
async function generateApiClient() {
  // Check if local JSON file exists (preferred method - doesn't require running API)
  let openApiSource = swaggerJsonEndpoint;
  if (localJsonFile && fs.existsSync(localJsonFile)) {
    console.log(`📄 Using local OpenAPI JSON file: ${localJsonFile}`);
    openApiSource = localJsonFile;
  } else {
    console.log(`📡 Using HTTP endpoint: ${swaggerJsonEndpoint}`);
    console.log('⚠️  Note: Backend API must be running for this to work.');

    // Check if API is reachable
    try {
      const url = new URL(swaggerJsonEndpoint);
      const port = parseInt(url.port) || (url.protocol === 'https:' ? 443 : 80);
      console.log(
        `🔍 Checking if API is reachable at ${url.hostname}:${port}...`,
      );

      const isReachable = await checkApiReachable(url.hostname, port);

      if (!isReachable) {
        console.error(`\n❌ Cannot connect to ${swaggerJsonEndpoint}`);
        console.error('   The API server is not running or not accessible.\n');
        console.log('💡 Solutions:');
        console.log('   1. Start the API server:');
        if (targetKey.includes('SSO')) {
          console.log('      cd services/sso-api && pnpm start:dev');
        }
        console.log(
          '\n   2. OR generate static JSON file first (recommended):',
        );
        if (targetKey.includes('SSO')) {
          console.log('      cd services/sso-api && pnpm generate:openapi');
        }
        console.log('      Then run this command again.\n');
        process.exit(1);
      }
      console.log('✅ API is reachable');
    } catch (error) {
      console.error(`\n❌ Error checking API connectivity: ${error.message}`);
      console.log('💡 Tip: Generate static JSON file first:');
      if (targetKey.includes('SSO')) {
        console.log('   cd services/sso-api && pnpm generate:openapi');
      }
      process.exit(1);
    }
  }

  // Remove existing generated files for this API
  if (fs.existsSync(outputDir)) {
    console.log(`🗑️  Removing existing generated files in ${outputDir}...`);
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  // Create the output directory
  fs.mkdirSync(outputDir, { recursive: true });

  // Create temporary directory for generation
  const tempDir = path.join(__dirname, 'src', `api_temp_${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    // Generate code using openapi-generator-cli
    console.log('⚙️  Generating TypeScript client from OpenAPI spec...');

    const configFile = path.join(__dirname, 'openapi.config.json');

    // Use npx to run openapi-generator-cli from node_modules
    const openapiGeneratorCmd =
      process.platform === 'win32'
        ? 'npx --yes @openapitools/openapi-generator-cli'
        : 'npx --yes @openapitools/openapi-generator-cli';

    execSync(
      `${openapiGeneratorCmd} generate -i "${openApiSource}" --skip-validate-spec --generator-name typescript-axios --output "${tempDir}" --config "${configFile}"`,
      { stdio: 'inherit', cwd: __dirname, shell: true },
    );

    // Check if generation was successful
    const apiFile = path.join(tempDir, 'api.ts');
    if (!fs.existsSync(apiFile)) {
      throw new Error(`Generation failed - api.ts not found in ${tempDir}`);
    }

    // Copy generated files to output directory
    console.log(`📋 Copying generated files to ${outputDir}...`);

    const filesToCopy = [
      'api.ts',
      'base.ts',
      'common.ts',
      'configuration.ts',
      'index.ts',
    ];
    filesToCopy.forEach((file) => {
      const src = path.join(tempDir, file);
      const dest = path.join(outputDir, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    });

    // Remove temporary directory
    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log(`✅ Successfully generated API client in ${outputDir}`);
    console.log('📁 Files generated:');

    const files = fs
      .readdirSync(outputDir)
      .filter((f) => f.endsWith('.ts') || f.endsWith('.js'));
    files.forEach((file) => {
      const stats = fs.statSync(path.join(outputDir, file));
      console.log(`  ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    });
  } catch (error) {
    // Clean up temp directory on error
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    console.error('❌ Generation failed:', error.message);
    process.exit(1);
  }
}

// Run the async function
generateApiClient().catch((error) => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});

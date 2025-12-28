import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { AppModule } from '../src/app.module';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

async function generateOpenApiSpec() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error'], // Reduce noise during generation
  });

  const config = new DocumentBuilder()
    .setTitle('Scholarship Management')
    .setDescription(
      'API documentation for the iCaptur.AI Single Sign-On service with OAuth2, MFA, and centralized session management',
    )
    .setVersion('1.0.0')
    .addTag('Health', 'Health check endpoints')
    .addTag(
      'Authentication',
      'User authentication, password management, and account activation',
    )
    .addTag('OAuth2', 'OAuth 2.0 Authorization Code Flow with PKCE')
    .addTag('MFA', 'Multi-Factor Authentication (TOTP and backup codes)')
    .addTag(
      'Admin - Redirect URIs',
      'Admin endpoints for managing OAuth2 redirect URIs',
    )
    .addTag('Permissions', 'Permission management')
    .addBearerAuth()
    .addServer('/api', 'SSO API')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Save to file
  const outputPath = path.join(__dirname, '..', 'openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  console.log(`✅ OpenAPI spec generated at: ${outputPath}`);
  console.log(`📊 Total endpoints: ${Object.keys(document.paths).length}`);

  await app.close();
}

generateOpenApiSpec().catch((error) => {
  console.error('❌ Failed to generate OpenAPI spec:', error);
  process.exit(1);
});

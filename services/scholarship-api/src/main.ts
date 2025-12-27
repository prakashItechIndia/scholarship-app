// Polyfill crypto for @nestjs/schedule compatibility with Node.js < 22
import { webcrypto } from 'node:crypto';
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as Crypto;
}

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import type { RequestHandler } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';
import type { EnvVars } from './config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService<EnvVars, true>);

  const rawPort: unknown = configService.getOrThrow('SSO_PORT', {
    infer: true,
  });
  if (typeof rawPort !== 'number') {
    throw new Error('SSO_PORT must be a number');
  }
  const port = rawPort;

  const rawGlobalPrefix: unknown = configService.getOrThrow('GLOBAL_PREFIX', {
    infer: true,
  });
  if (typeof rawGlobalPrefix !== 'string') {
    throw new Error('GLOBAL_PREFIX must be a string');
  }
  const globalPrefix = rawGlobalPrefix;

  const cookieSecret = configService.get('COOKIE_SECRET', { infer: true });
  const safeCookieParser = cookieParser as unknown as (
    secret?: string,
  ) => RequestHandler;
  app.use(safeCookieParser(cookieSecret ?? ''));

  // Enhanced security headers with Helmet
  const nodeEnv = configService.get('NODE_ENV', { infer: true });
  const isProduction = nodeEnv === 'production';
  const isDevelopment = nodeEnv === 'development';

  app.use(
    helmet({
      contentSecurityPolicy: isDevelopment
        ? false // Disable CSP in development to avoid blocking API calls
        : {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for React
              scriptSrc: ["'self'"],
              imgSrc: ["'self'", 'data:', 'https:'],
              connectSrc: ["'self'"],
              fontSrc: ["'self'"],
              objectSrc: ["'none'"],
              mediaSrc: ["'self'"],
              frameSrc: ["'none'"],
              upgradeInsecureRequests: isProduction ? [] : null, // Only in production
            },
          },
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: isProduction,
      },
      frameguard: { action: 'deny' },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      permittedCrossDomainPolicies: false,
    }),
  );

  // Global rate limiting (general API endpoints)
  const rateLimitMax = configService.get('RATE_LIMIT_MAX', { infer: true });
  const rateLimitWindowMs = configService.get('RATE_LIMIT_WINDOW_MS', {
    infer: true,
  });
  app.use(
    rateLimit({
      windowMs: rateLimitWindowMs,
      max: rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
      // Skip rate limiting for health checks
      skip: (req) => req.path === '/health' || req.path === '/api/health',
    }),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  const allowedOriginsEnv = configService.get('ALLOWED_ORIGINS', {
    infer: true,
  });

  // In development, allow all origins for easier local development
  // In production, use configured origins
  const allowedOrigins = isDevelopment
    ? true // Allow all origins in development
    : (
        allowedOriginsEnv?.split(',') || [
          configService.get('SSO_APP_URL', { infer: true }) ?? '',
          configService.get('EXPERIENCE_APP_URL', { infer: true }) ?? '',
          configService.get('CUSTOMER_PORTAL_URL', { infer: true }) ?? '',
          configService.get('IREPO_URL', { infer: true }) ?? '',
          configService.get('INVOX_URL', { infer: true }) ?? '',
          configService.get('ACCOUNTS_URL', { infer: true }) ?? '',
        ]
      ).filter((o) => !!o);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });

  const swaggerConfig = new DocumentBuilder()
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
    .addServer(`/${globalPrefix}`, 'SSO API')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerEndpoint = globalPrefix ? `${globalPrefix}-docs` : 'docs';
  const swaggerJsonEndpoint = globalPrefix
    ? `${globalPrefix}/docs-json`
    : 'docs-json';
  SwaggerModule.setup(swaggerEndpoint, app, document, {
    jsonDocumentUrl: swaggerJsonEndpoint,
  });

  app.setGlobalPrefix(globalPrefix);

  // Serve static files from uploads directory
  const uploadBasePath =
    process.env.UPLOAD_BASE_PATH || join(process.cwd(), 'uploads');
  
  // Serve files from uploads directory at /uploads path
  app.useStaticAssets(uploadBasePath, {
    prefix: '/uploads',
    setHeaders: (res, path) => {
      // Set appropriate headers for different file types
      if (path.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
      } else if (path.match(/\.(jpg|jpeg|png|gif)$/i)) {
        res.setHeader('Content-Type', `image/${path.split('.').pop()?.toLowerCase()}`);
      }
      // Enable CORS for uploaded files
      res.setHeader('Access-Control-Allow-Origin', '*');
    },
  });

  // Register global input sanitization interceptor for XSS protection
  // Lazy load to avoid top-level require() causing watch mode restarts
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
    const sharedUtils = require('@icaptur/shared-utils');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const SanitizeInterceptor = sharedUtils.SanitizeInterceptor;
    if (SanitizeInterceptor) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
      app.useGlobalInterceptors(new SanitizeInterceptor());
      console.log('✅ Input sanitization interceptor enabled');
    }
  } catch {
    // SanitizeInterceptor not available - this is expected if shared-utils isn't built yet
    // Only log warning in development to avoid noise during watch mode restarts
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'SanitizeInterceptor not available. Build @icaptur/shared-utils package first.',
      );
    }
  }

  await app.listen(port);
  console.log(
    `SSO Service running on ${configService.get('SSO_API_URL', { infer: true }) ?? ''}`,
  );
  console.log(
    `SSO Service Swagger running on ${configService.get('SSO_API_URL', { infer: true }) ?? ''}-docs`,
  );
}

void bootstrap();

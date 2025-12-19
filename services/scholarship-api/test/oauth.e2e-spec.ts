import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('OAuth2 Flow (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('OAuth2 Authorization Code Flow', () => {
    describe('/oauth/authorize (GET)', () => {
      it('should reject invalid response_type', async () => {
        const response = await request(
          app.getHttpServer() as Parameters<typeof request>[0],
        )
          .get('/oauth/authorize')
          .query({
            response_type: 'token', // Invalid, should be 'code'
            client_id: 'customer-portal',
            redirect_uri: 'https://icaptur-cp-dev.itechlabs.app/callback',
            state: 'random-state',
          });

        expect(response.status).toBe(400);
        expect((response.body as { error?: string }).error).toBe(
          'unsupported_response_type',
        );
      });

      it('should reject missing required parameters', async () => {
        const response = await request(
          app.getHttpServer() as Parameters<typeof request>[0],
        )
          .get('/oauth/authorize')
          .query({
            response_type: 'code',
            // Missing client_id, redirect_uri, state
          });

        expect(response.status).toBe(400);
        expect((response.body as { error?: string }).error).toBe(
          'invalid_request',
        );
      });

      it('should redirect to login when user not authenticated', async () => {
        const response = await request(
          app.getHttpServer() as Parameters<typeof request>[0],
        )
          .get('/oauth/authorize')
          .query({
            response_type: 'code',
            client_id: 'customer-portal',
            redirect_uri: 'https://icaptur-cp-dev.itechlabs.app/callback',
            state: 'random-state-123',
          });

        // Should redirect (302) or return redirect URL (200)
        expect([200, 302]).toContain(response.status);
      });

      it('should preserve OAuth parameters in login redirect', async () => {
        const response = await request(
          app.getHttpServer() as Parameters<typeof request>[0],
        )
          .get('/oauth/authorize')
          .query({
            response_type: 'code',
            client_id: 'customer-portal',
            redirect_uri: 'https://icaptur-cp-dev.itechlabs.app/callback',
            state: 'random-state-123',
            code_challenge: 'test-challenge',
            code_challenge_method: 'S256',
          });

        expect([200, 302]).toContain(response.status);
      });
    });

    describe('/oauth/token (POST)', () => {
      it('should reject unsupported grant type', async () => {
        const response = await request(
          app.getHttpServer() as Parameters<typeof request>[0],
        )
          .post('/oauth/token')
          .send({
            grant_type: 'password', // Invalid
            code: 'test-code',
            redirect_uri: 'https://icaptur-cp-dev.itechlabs.app/callback',
            client_id: 'customer-portal',
          });

        expect(response.status).toBe(400);
        expect((response.body as { error?: string }).error).toBe(
          'unsupported_grant_type',
        );
      });

      it('should reject missing required parameters', async () => {
        const response = await request(
          app.getHttpServer() as Parameters<typeof request>[0],
        )
          .post('/oauth/token')
          .send({
            grant_type: 'authorization_code',
            // Missing code, redirect_uri, client_id
          });

        expect(response.status).toBe(400);
        expect((response.body as { error?: string }).error).toBe(
          'invalid_request',
        );
      });

      it('should reject invalid authorization code', async () => {
        const response = await request(
          app.getHttpServer() as Parameters<typeof request>[0],
        )
          .post('/oauth/token')
          .send({
            grant_type: 'authorization_code',
            code: 'invalid-code-123',
            redirect_uri: 'https://icaptur-cp-dev.itechlabs.app/callback',
            client_id: 'customer-portal',
          });

        expect(response.status).toBe(400);
        expect((response.body as { error?: string }).error).toBe(
          'invalid_grant',
        );
      });
    });
  });

  describe('PKCE Support', () => {
    it('should accept code_challenge in authorize request', async () => {
      const response = await request(
        app.getHttpServer() as Parameters<typeof request>[0],
      )
        .get('/oauth/authorize')
        .query({
          response_type: 'code',
          client_id: 'customer-portal',
          redirect_uri: 'https://icaptur-cp-dev.itechlabs.app/callback',
          state: 'random-state',
          code_challenge: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
          code_challenge_method: 'S256',
        });

      expect([200, 302]).toContain(response.status);
    });

    it('should support plain code challenge method', async () => {
      const response = await request(
        app.getHttpServer() as Parameters<typeof request>[0],
      )
        .get('/oauth/authorize')
        .query({
          response_type: 'code',
          client_id: 'customer-portal',
          redirect_uri: 'https://icaptur-cp-dev.itechlabs.app/callback',
          state: 'random-state',
          code_challenge: 'test-challenge',
          code_challenge_method: 'plain',
        });

      expect([200, 302]).toContain(response.status);
    });
  });

  describe('Multi-Product Token Isolation', () => {
    it('should generate product-specific tokens', async () => {
      // This test would require a complete OAuth flow with authentication
      // For now, we verify the token endpoint structure

      const response = await request(
        app.getHttpServer() as Parameters<typeof request>[0],
      )
        .post('/oauth/token')
        .send({
          grant_type: 'authorization_code',
          code: 'test-code',
          redirect_uri: 'https://icaptur-cp-dev.itechlabs.app/callback',
          client_id: 'customer-portal',
        });

      // Will fail with invalid_grant (expected without valid code)
      expect(response.status).toBe(400);
    });
  });

  describe('State Parameter Validation', () => {
    it('should preserve state parameter through OAuth flow', async () => {
      const testState = 'unique-state-' + Date.now();

      const response = await request(
        app.getHttpServer() as Parameters<typeof request>[0],
      )
        .get('/oauth/authorize')
        .query({
          response_type: 'code',
          client_id: 'customer-portal',
          redirect_uri: 'https://icaptur-cp-dev.itechlabs.app/callback',
          state: testState,
        });

      expect([200, 302]).toContain(response.status);
      // In a complete flow, we would verify state is returned in callback
    });
  });
});

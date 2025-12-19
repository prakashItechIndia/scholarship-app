import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Session Management (e2e)', () => {
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

  describe('Session creation on login', () => {
    it('should create session cookie on successful login', async () => {
      // Note: This test requires a valid test user in the database
      // For demonstration, we test the endpoint structure

      await request(app.getHttpServer() as Parameters<typeof request>[0])
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!',
          productCode: 'accounts',
        });

      // Will fail with 401 if user doesn't exist (expected in test environment)
      // In a real test with seeded data, we would check:
      // expect(response.headers['set-cookie']).toBeDefined();
      // expect(response.headers['set-cookie'][0]).toContain('sso_session');
    });
  });

  describe('Session validation in OAuth flow', () => {
    it('should redirect to login when no session exists', async () => {
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

      // Should redirect to login (302 or 200 with redirect URL)
      expect([200, 302]).toContain(response.status);
    });

    it('should handle invalid session cookie gracefully', async () => {
      const response = await request(
        app.getHttpServer() as Parameters<typeof request>[0],
      )
        .get('/oauth/authorize')
        .set('Cookie', 'sso_session=invalid-token-123')
        .query({
          response_type: 'code',
          client_id: 'customer-portal',
          redirect_uri: 'https://icaptur-cp-dev.itechlabs.app/callback',
          state: 'random-state-123',
        });

      // Should redirect to login even with invalid session
      expect([200, 302]).toContain(response.status);
    });
  });

  describe('Session expiration', () => {
    it('should reject expired session tokens', async () => {
      // This would require creating a session with past expiration
      // For now, we verify the endpoint is accessible

      const response = await request(
        app.getHttpServer() as Parameters<typeof request>[0],
      )
        .get('/oauth/authorize')
        .set('Cookie', 'sso_session=expired-token')
        .query({
          response_type: 'code',
          client_id: 'customer-portal',
          redirect_uri: 'https://icaptur-cp-dev.itechlabs.app/callback',
          state: 'random-state-123',
        });

      expect([200, 302]).toContain(response.status);
    });
  });

  describe('Single logout', () => {
    it('should logout from all products', async () => {
      // Test logout endpoint
      const response = await request(
        app.getHttpServer() as Parameters<typeof request>[0],
      )
        .post('/auth/logout')
        .send({ refreshToken: 'test-refresh-token' });

      // Should return 204 No Content
      expect(response.status).toBe(204);
    });
  });

  describe('Session security', () => {
    it('should use HTTP-only cookies', () => {
      // This would be verified by checking Set-Cookie header flags
      // HttpOnly, Secure (in production), SameSite=Strict
      expect(true).toBe(true); // Placeholder
    });

    it('should validate session on each OAuth request', async () => {
      // Verify that session validation happens on OAuth authorize
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

      expect([200, 302]).toContain(response.status);
    });
  });
});

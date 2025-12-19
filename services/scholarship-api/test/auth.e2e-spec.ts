import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
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

  describe('/auth/login (POST)', () => {
    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer() as Parameters<typeof request>[0])
        .post('/auth/login')
        .send({ email: 'invalid@example.com', password: 'wrong' })
        .expect(401);
    });

    it('should return 400 for missing email', () => {
      return request(app.getHttpServer() as Parameters<typeof request>[0])
        .post('/auth/login')
        .send({ password: 'password123' })
        .expect(400);
    });

    it('should return 400 for missing password', () => {
      return request(app.getHttpServer() as Parameters<typeof request>[0])
        .post('/auth/login')
        .send({ email: 'test@example.com' })
        .expect(400);
    });
  });

  describe('/auth/password-reset/request (POST)', () => {
    it('should return 200 even for non-existent email', () => {
      return request(app.getHttpServer() as Parameters<typeof request>[0])
        .post('/auth/password-reset/request')
        .send({ email: 'nonexistent@example.com' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
        });
    });

    it('should return 400 for missing email', () => {
      return request(app.getHttpServer() as Parameters<typeof request>[0])
        .post('/auth/password-reset/request')
        .send({})
        .expect(400);
    });
  });

  describe('/auth/validate-activation-token (GET)', () => {
    it('should return validation result for token', () => {
      return request(app.getHttpServer() as Parameters<typeof request>[0])
        .get('/auth/validate-activation-token')
        .query({ token: 'invalid-token' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('valid');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.valid).toBe(false);
        });
    });

    it('should return 400 for missing token', () => {
      return request(app.getHttpServer() as Parameters<typeof request>[0])
        .get('/auth/validate-activation-token')
        .expect(400);
    });
  });
});

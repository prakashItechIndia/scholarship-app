import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseService } from '../../database/database.service';
import { EmailService } from '../email/email.service';

describe('AuthService', () => {
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let _dbService: DatabaseService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let _jwtService: JwtService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let _emailService: EmailService;

  const mockDbService = {
    db: {
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockEmailService = {
    sendActivationEmail: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DatabaseService,
          useValue: mockDbService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    dbService = module.get<DatabaseService>(DatabaseService);
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockDbService.db.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if account is locked', async () => {
      const lockedUntil = new Date();
      lockedUntil.setMinutes(lockedUntil.getMinutes() + 30);

      mockDbService.db.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([
              {
                id: 'user-id',
                email: 'test@example.com',
                lockedUntil,
                status: 'active',
                passwordHash: 'hashed-password',
                failedLoginAttempts: '5',
              },
            ]),
          }),
        }),
      });

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('requestPasswordReset', () => {
    it('should send password reset email when user exists', async () => {
      mockDbService.db.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([
              {
                id: 'user-id',
                email: 'test@example.com',
                firstName: 'John',
              },
            ]),
          }),
        }),
      });

      mockDbService.db.insert.mockReturnValue({
        values: jest.fn().mockResolvedValue(undefined),
      });

      mockEmailService.sendPasswordResetEmail.mockResolvedValue(true);

      const result = await service.requestPasswordReset('test@example.com');

      expect(result.message).toContain('password reset link has been sent');
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalled();
    });
  });

  describe('createPassword', () => {
    it('should throw BadRequestException for weak password', async () => {
      mockDbService.db.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([
              {
                id: 'user-id',
                email: 'test@example.com',
                status: 'invited',
                activationToken: 'valid-token',
                activationTokenExpiresAt: new Date(Date.now() + 1000000),
              },
            ]),
          }),
        }),
      });

      await expect(
        service.createPassword('valid-token', 'short'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

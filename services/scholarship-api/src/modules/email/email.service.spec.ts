import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should return false when SMTP is not configured', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      const result = await service.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result).toBe(false);
    });

    it('should return false when transporter is null', async () => {
      // Service will initialize with no config
      mockConfigService.get.mockReturnValue(undefined);

      const result = await service.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result).toBe(false);
    });
  });

  describe('sendActivationEmail', () => {
    it('should call sendEmail with correct parameters', async () => {
      const sendEmailSpy = jest
        .spyOn(service, 'sendEmail')
        .mockResolvedValue(true);

      await service.sendActivationEmail(
        'test@example.com',
        'John',
        'test-token',
      );

      expect(sendEmailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Activate your iCaptur account',
        }),
      );
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should call sendEmail with correct parameters', async () => {
      const sendEmailSpy = jest
        .spyOn(service, 'sendEmail')
        .mockResolvedValue(true);

      await service.sendPasswordResetEmail(
        'test@example.com',
        'John',
        'test-token',
      );

      expect(sendEmailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Reset your iCaptur password',
        }),
      );
    });
  });
});

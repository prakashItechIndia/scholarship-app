import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { AuditService } from '../audit/audit.service';

describe('PermissionsController', () => {
  let controller: PermissionsController;
  const invalidateMock = jest.fn();
  const auditMock = jest.fn();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        {
          provide: PermissionsService,
          useValue: {
            getUserPermissions: jest.fn(),
            invalidatePermissions: invalidateMock,
          },
        },
        {
          provide: AuditService,
          useValue: {
            logEvent: auditMock,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) =>
              key === 'SERVICE_API_TOKEN' ? 'secret-token' : undefined,
          },
        },
      ],
    }).compile();

    controller = module.get(PermissionsController);
    invalidateMock.mockReset();
    auditMock.mockReset();
  });

  it('rejects invalid service token', async () => {
    await expect(
      controller.invalidatePermissions(
        { tenantId: 't1', productCode: 'p1' },
        { authorization: 'Bearer wrong' },
      ),
    ).rejects.toThrow('Invalid service token');
    expect(invalidateMock).not.toHaveBeenCalled();
    expect(auditMock).not.toHaveBeenCalled();
  });

  it('accepts valid service token and calls invalidate + audit', async () => {
    await controller.invalidatePermissions(
      { tenantId: 't1', productCode: 'p1' },
      { authorization: 'Bearer secret-token' },
    );

    expect(invalidateMock).toHaveBeenCalledWith('t1', 'p1');
    expect(auditMock).toHaveBeenCalledWith({
      tenantId: 't1',
      eventType: 'permissions/invalidate',
      eventPayload: { productCode: 'p1' },
      actorUserId: null,
    });
  });
});
